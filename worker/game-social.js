/**
 * Cut-Off Run social layer (mindgains.ai/api/game/*), mounted by game.js.
 *
 * Daily Paper: 10 questions, the same for every player in India on an IST day. Picked with a
 * seeded RNG from the static quiz-data sets, so every Worker instance picks the same paper.
 * All-India Mock: 20 questions, the same for everyone, open Sunday 20:00 to 21:00 IST.
 * Both hand out a normal signed game round (k = 'paper' | 'mock'), so /submit re-marks them as
 * usual and then calls recordEvent for the rank and percentile. Only a player's first submit counts.
 *
 * Groups: study groups, coaching centres, colleges and creator boards share one table. A group
 * board ranks its members by this week's league score; the group league ranks groups by the sum.
 * Bharat Board: this week's league and today's paper, grouped by state.
 *
 * Routes
 *   GET  /api/game/paper?device=          today's paper round (+ my result if already played)
 *   GET  /api/game/mock?device=           mock status, and the round while it is live
 *   GET  /api/game/event?ev=p:ID|m:ID     leaderboard for one paper or mock
 *   POST /api/game/group/create  {name, kind, device}
 *   POST /api/game/group/join    {code, device}
 *   POST /api/game/group/leave   {code, device}
 *   GET  /api/game/group?code=&device=    one group's board
 *   GET  /api/game/groups?kind=&device=   group league + my groups
 *   GET  /api/game/bharat                 state board
 *   POST /api/game/ghost  {rec, name, kind}  NationLap: store a lap to share, returns a code
 *   GET  /api/game/ghost?code=            NationLap: the lap behind a share link
 *   POST /api/game/informed {state, device, clean, total}  NationLap: count today's race for a state
 *   GET  /api/game/informed               NationLap: Most Informed State, last 7 days
 *
 * D1 tables: worker/game-schema-004-social.sql
 */

export const STATES = {
  AN: 'Andaman and Nicobar', AP: 'Andhra Pradesh', AR: 'Arunachal Pradesh', AS: 'Assam', BR: 'Bihar', CH: 'Chandigarh',
  CT: 'Chhattisgarh', DH: 'Dadra, Nagar Haveli, Daman and Diu', DL: 'Delhi', GA: 'Goa', GJ: 'Gujarat', HR: 'Haryana',
  HP: 'Himachal Pradesh', JK: 'Jammu and Kashmir', JH: 'Jharkhand', KA: 'Karnataka', KL: 'Kerala', LA: 'Ladakh',
  LD: 'Lakshadweep', MP: 'Madhya Pradesh', MH: 'Maharashtra', MN: 'Manipur', ML: 'Meghalaya', MZ: 'Mizoram',
  NL: 'Nagaland', OR: 'Odisha', PY: 'Puducherry', PB: 'Punjab', RJ: 'Rajasthan', SK: 'Sikkim', TN: 'Tamil Nadu',
  TG: 'Telangana', TR: 'Tripura', UP: 'Uttar Pradesh', UK: 'Uttarakhand', WB: 'West Bengal',
};
export const cleanState = (s) => (STATES[String(s || '').toUpperCase()] ? String(s).toUpperCase() : '');

const KINDS = ['friends', 'coaching', 'college', 'creator'];
const PAPER_N = 10, MOCK_N = 20;
// Syllabus only. Current affairs belong to NationLap (Today's Race), so the two games never overlap.
const PAPER_PLAN = ['Polity', 'History', 'Geography', 'Economy', 'Environment', 'Science', 'Polity', 'History', 'Geography', 'Economy'];
const MOCK_PLAN = PAPER_PLAN.concat(['Environment', 'Science', 'Polity', 'History', 'Geography', 'Economy', 'Environment', 'Science', 'Polity', 'History']);
const GROUP_MAX = 500, JOIN_MAX = 10, CREATE_MAX = 5;
const IST = 5.5 * 3600000, DAY = 86400000;
// Sunday 20:00 IST = Sunday 14:30 UTC. Day 0 of the epoch (1 Jan 1970) was a Thursday.
const MOCK_START_UTC = 14.5 * 3600000, MOCK_LEN = 3600000;

function seeded(seed) {
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const cleanName = (s) => String(s || '').replace(/[^\p{L}\p{N} .&'-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 32);

// Most recent Sunday 14:30 UTC at or before ms, and the mock id (= its week number).
function mockWindow(now) {
  const d = Math.floor(now / DAY), dow = (d + 4) % 7; // 0 = Sunday
  let start = (d - dow) * DAY + MOCK_START_UTC;
  if (start > now) start -= 7 * DAY;
  return { id: Math.floor(start / DAY / 7), start, end: start + MOCK_LEN, next: start + 7 * DAY };
}

export function makeSocial({ TRACKS, json, hmac, loadBank, usable, limited, identify, SETS, b64u, rid, weekId, dayId, isLong, ttl }) {
  async function pickFixed(env, plan, seed) {
    const R = seeded(seed), items = [], seen = new Set();
    for (const subj of plan) {
      const sets = SETS[subj];
      for (let t = 0; t < 12; t++) {
        const set = sets[(R() * sets.length) | 0];
        const bank = await loadBank(env, set);
        if (!bank || !bank.questions.length) continue;
        const idx = (R() * bank.questions.length) | 0;
        const q = bank.questions[idx], id = `${set}#${idx}`;
        if (!q || !usable(q) || q.canary || seen.has(id)) continue;
        seen.add(id);
        items.push({ id, subject: subj, question: q.question, options: q.options, answer_index: q.answer_index,
          explanation: String(q.explanation || '').slice(0, 240), source: q.source || '', pyq_year: q.pyq_year || null,
          difficulty: 2, long: isLong(q) });
        break;
      }
    }
    return items;
  }

  async function signRound(env, items, k, ev) {
    const payload = b64u(JSON.stringify({ r: rid(), i: items.map((x) => x.id), t: Date.now(), e: 'all', k, ev }));
    return payload + '.' + await hmac(env.QUIZ_SECRET, 'game|' + payload);
  }

  async function myResult(env, ev, uid) {
    if (!env.GAME_DB || !uid) return null;
    const me = await env.GAME_DB.prepare('SELECT pts, ms, correct, wrong, skipped, grid FROM game_event WHERE ev=?1 AND uid=?2').bind(ev, uid).first();
    return me ? Object.assign({ grid: me.grid, correct: me.correct, wrong: me.wrong, skipped: me.skipped }, await standing(env, ev, me)) : null;
  }

  async function standing(env, ev, me) {
    const db = env.GAME_DB;
    const better = await db.prepare('SELECT COUNT(*) AS n FROM game_event WHERE ev=?1 AND (pts > ?2 OR (pts = ?2 AND ms < ?3))').bind(ev, me.pts, me.ms).first();
    const tot = await db.prepare('SELECT COUNT(*) AS n FROM game_event WHERE ev=?1').bind(ev).first();
    const rank = Number(better.n) + 1, total = Number(tot.n) || 1;
    return { rank, total, top_pct: Math.max(1, Math.ceil((rank / total) * 100)), pts: me.pts };
  }

  async function paper(request, env) {
    const url = new URL(request.url), now = Date.now(), day = dayId(now);
    // NEET and JEE players get their own science paper; everyone else shares the general one.
    const tk = TRACKS[String(url.searchParams.get('exam') || '').toLowerCase()] ? String(url.searchParams.get('exam')).toLowerCase() : '';
    if (await limited(env.GAME_ROUND_RL, 'gp:' + (request.headers.get('cf-connecting-ip') || 'na'), 6)) return json({ error: 'slow down' }, 429, { 'retry-after': '60' });
    const ev = 'p:' + (tk ? tk + ':' : '') + day;
    const who = await identify(request, env, { device: url.searchParams.get('device') || '' }).catch(() => null);
    const items = await pickFixed(env, tk ? Array.from({ length: PAPER_N }, (_, i) => TRACKS[tk][i % TRACKS[tk].length]) : PAPER_PLAN, day * 7919 + 17 + (tk ? tk.length * 131 : 0));
    if (items.length < 5) return json({ error: 'paper not available' }, 503);
    const mine = who ? await myResult(env, ev, who.uid) : null;
    const players = env.GAME_DB ? Number((await env.GAME_DB.prepare('SELECT COUNT(*) AS n FROM game_event WHERE ev=?1').bind(ev).first()).n) : 0;
    return json({ ev, day, track: tk, no: day - 20762, token: await signRound(env, items, 'paper', ev), items, ttl, secs: 150, players, mine });
  }

  async function mock(request, env) {
    const url = new URL(request.url), now = Date.now(), w = mockWindow(now);
    const live = env.MOCK_OPEN === '1' || (now >= w.start && now < w.end);
    const ev = 'm:' + w.id, db = env.GAME_DB;
    const who = await identify(request, env, { device: url.searchParams.get('device') || '' }).catch(() => null);
    const count = async (t) => db ? Number((await db.prepare(`SELECT COUNT(*) AS n FROM ${t} WHERE ev=?1`).bind(ev).first()).n) : 0;
    const base = { ev, live, starts_at: live ? w.start : (now < w.start ? w.start : w.next), ends_at: w.end, last_ev: ev };
    if (!live || url.searchParams.get('status') === '1') {
      return json(Object.assign(base, { joined: await count('game_event_join'), finished: await count('game_event'), mine: who ? await myResult(env, ev, who.uid) : null }));
    }
    if (await limited(env.GAME_ROUND_RL, 'gm:' + (request.headers.get('cf-connecting-ip') || 'na'), 6)) return json({ error: 'slow down' }, 429, { 'retry-after': '60' });
    const items = await pickFixed(env, MOCK_PLAN, w.id * 104729 + 3);
    if (who && db) await db.prepare('INSERT OR IGNORE INTO game_event_join (ev, uid, at) VALUES (?1, ?2, ?3)').bind(ev, who.uid, now).run();
    return json(Object.assign(base, { token: await signRound(env, items, 'mock', ev), items, ttl, secs: 300,
      joined: await count('game_event_join'), finished: await count('game_event'), mine: who ? await myResult(env, ev, who.uid) : null }));
  }

  // Called by /submit after a paper or mock round has been re-marked. First submit per player counts.
  async function recordEvent(env, P, who, r, body) {
    if (!env.GAME_DB || !/^[pm]:(?:neet:|jee:)?\d+$/.test(String(P.ev || ''))) return null;
    const grid = String(body.grid || '').replace(/[^GRS]/g, '').slice(0, 30);
    await env.GAME_DB.prepare(`INSERT OR IGNORE INTO game_event (ev, uid, name, state, pts, ms, correct, wrong, skipped, grid, at)
      VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)`)
      .bind(P.ev, who.uid, who.name, cleanState(body.state), r.pts, r.ms, r.correct, r.wrong, r.skipped, grid, Date.now()).run();
    return myResult(env, P.ev, who.uid);
  }

  async function eventBoard(request, env) {
    const url = new URL(request.url), ev = String(url.searchParams.get('ev') || '');
    if (!/^[pm]:(?:neet:|jee:)?\d+$/.test(ev) || !env.GAME_DB) return json({ rows: [] });
    const db = env.GAME_DB, st = cleanState(url.searchParams.get('state'));
    const { results } = await db.prepare(`SELECT uid, name, state, pts, correct FROM game_event WHERE ev=?1 ${st ? 'AND state=?2' : ''} ORDER BY pts DESC, ms ASC LIMIT 20`)
      .bind(...(st ? [ev, st] : [ev])).all();
    const me = await identify(request, env, { device: url.searchParams.get('device') || '' }).catch(() => null);
    return json({ ev, rows: (results || []).map((x, i) => ({ rank: i + 1, name: x.name, state: x.state, pts: x.pts, correct: x.correct, me: !!(me && me.uid === x.uid) })) },
      200, { 'cache-control': 'public, max-age=20' });
  }

  async function body(request) { try { return await request.json(); } catch { return null; } }
  async function gate(request, env) {
    if (request.method !== 'POST') return { err: json({ error: 'POST only' }, 405) };
    if (await limited(env.GAME_SUBMIT_RL, 'gg:' + (request.headers.get('cf-connecting-ip') || 'na'), 10)) return { err: json({ error: 'slow down' }, 429, { 'retry-after': '60' }) };
    if (!env.GAME_DB) return { err: json({ error: 'storage not configured' }, 503) };
    const b = await body(request);
    const who = b && await identify(request, env, b);
    if (!who) return { err: json({ error: 'login required' }, 401) };
    return { b, who, db: env.GAME_DB };
  }

  async function groupCreate(request, env) {
    const { err, b, who, db } = await gate(request, env);
    if (err) return err;
    const name = cleanName(b.name), kind = KINDS.includes(b.kind) ? b.kind : 'friends';
    if (name.length < 3) return json({ error: 'Pick a name of 3 to 32 letters' }, 400);
    const mine = await db.prepare('SELECT COUNT(*) AS n FROM game_group WHERE owner=?1').bind(who.uid).first();
    if (Number(mine.n) >= CREATE_MAX) return json({ error: `You can run up to ${CREATE_MAX} groups` }, 409);
    const joined = await db.prepare('SELECT COUNT(*) AS n FROM game_group_member WHERE uid=?1').bind(who.uid).first();
    if (Number(joined.n) >= JOIN_MAX) return json({ error: `You are already in ${JOIN_MAX} groups` }, 409);
    const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    for (let t = 0; t < 5; t++) {
      const code = Array.from(crypto.getRandomValues(new Uint8Array(6)), (x) => A[x % A.length]).join('');
      try {
        const now = Date.now();
        await db.batch([
          db.prepare('INSERT INTO game_group (code, name, kind, owner, created_at) VALUES (?1,?2,?3,?4,?5)').bind(code, name, kind, who.uid, now),
          db.prepare('INSERT INTO game_group_member (code, uid, joined_at) VALUES (?1,?2,?3)').bind(code, who.uid, now),
        ]);
        return json({ ok: true, code, name, kind });
      } catch { /* code taken, try another */ }
    }
    return json({ error: 'try again' }, 500);
  }

  async function groupJoin(request, env) {
    const { err, b, who, db } = await gate(request, env);
    if (err) return err;
    const code = String(b.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    const g = await db.prepare('SELECT code, name, kind FROM game_group WHERE code=?1').bind(code).first();
    if (!g) return json({ error: 'No group has this code' }, 404);
    const n = await db.prepare('SELECT COUNT(*) AS n FROM game_group_member WHERE code=?1').bind(code).first();
    if (Number(n.n) >= GROUP_MAX) return json({ error: 'This group is full' }, 409);
    const joined = await db.prepare('SELECT COUNT(*) AS n FROM game_group_member WHERE uid=?1').bind(who.uid).first();
    if (Number(joined.n) >= JOIN_MAX) return json({ error: `You are already in ${JOIN_MAX} groups` }, 409);
    await db.prepare('INSERT OR IGNORE INTO game_group_member (code, uid, joined_at) VALUES (?1,?2,?3)').bind(code, who.uid, Date.now()).run();
    return json({ ok: true, code: g.code, name: g.name, kind: g.kind });
  }

  async function groupLeave(request, env) {
    const { err, b, who, db } = await gate(request, env);
    if (err) return err;
    const code = String(b.code || '').toUpperCase().slice(0, 6);
    await db.prepare('DELETE FROM game_group_member WHERE code=?1 AND uid=?2').bind(code, who.uid).run();
    return json({ ok: true });
  }

  async function groupBoard(request, env) {
    if (!env.GAME_DB) return json({ error: 'storage not configured' }, 503);
    const url = new URL(request.url), db = env.GAME_DB, week = weekId(Date.now());
    const code = String(url.searchParams.get('code') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    const g = await db.prepare('SELECT code, name, kind FROM game_group WHERE code=?1').bind(code).first();
    if (!g) return json({ error: 'No group has this code' }, 404);
    const { results } = await db.prepare(`SELECT m.uid, COALESCE(l.name, 'Aspirant') AS name, COALESCE(l.score, 0) AS score
      FROM game_group_member m LEFT JOIN game_league l ON l.uid = m.uid AND l.week = ?2 WHERE m.code = ?1 ORDER BY score DESC LIMIT 100`).bind(code, week).all();
    const me = await identify(request, env, { device: url.searchParams.get('device') || '' }).catch(() => null);
    const rows = (results || []).map((r, i) => ({ rank: i + 1, name: r.name, score: r.score, me: !!(me && me.uid === r.uid) }));
    const cnt = await db.prepare('SELECT COUNT(*) AS n FROM game_group_member WHERE code=?1').bind(code).first();
    return json({ code: g.code, name: g.name, kind: g.kind, week, members: Number(cnt.n), total: rows.reduce((s, r) => s + r.score, 0), rows, member: rows.some((r) => r.me) });
  }

  async function groupLeague(request, env) {
    if (!env.GAME_DB) return json({ rows: [], mine: [] });
    const url = new URL(request.url), db = env.GAME_DB, week = weekId(Date.now());
    const kind = KINDS.includes(url.searchParams.get('kind')) ? url.searchParams.get('kind') : '';
    // Groups need 3 members to enter the league, so one player cannot make a group of one and top it.
    const { results } = await db.prepare(`SELECT g.code, g.name, g.kind, COUNT(m.uid) AS members, COALESCE(SUM(l.score), 0) AS total
      FROM game_group g JOIN game_group_member m ON m.code = g.code LEFT JOIN game_league l ON l.uid = m.uid AND l.week = ?1
      ${kind ? 'WHERE g.kind = ?2' : ''} GROUP BY g.code HAVING members >= 3 ORDER BY total DESC LIMIT 20`).bind(...(kind ? [week, kind] : [week])).all();
    const me = await identify(request, env, { device: url.searchParams.get('device') || '' }).catch(() => null);
    let mine = [];
    if (me) {
      const r = await db.prepare('SELECT g.code, g.name, g.kind FROM game_group_member m JOIN game_group g ON g.code = m.code WHERE m.uid = ?1').bind(me.uid).all();
      mine = r.results || [];
    }
    return json({ week, rows: (results || []).map((r, i) => ({ rank: i + 1, code: r.code, name: r.name, kind: r.kind, members: r.members, total: r.total })), mine });
  }

  async function bharat(request, env) {
    if (!env.GAME_DB) return json({ states: [] });
    const db = env.GAME_DB, now = Date.now(), week = weekId(now), ev = 'p:' + dayId(now);
    const lg = await db.prepare(`SELECT state, COUNT(*) AS players, SUM(score) AS total FROM game_league WHERE week=?1 AND state <> '' AND score > 0 GROUP BY state`).bind(week).all();
    const pp = await db.prepare(`SELECT state, COUNT(*) AS n, AVG(correct) AS avg FROM game_event WHERE ev=?1 AND state <> '' GROUP BY state`).bind(ev).all();
    const by = {};
    for (const r of lg.results || []) by[r.state] = { code: r.state, name: STATES[r.state] || r.state, players: r.players, total: r.total, paper: 0, paper_avg: null };
    for (const r of pp.results || []) {
      by[r.state] = by[r.state] || { code: r.state, name: STATES[r.state] || r.state, players: 0, total: 0 };
      by[r.state].paper = r.n; by[r.state].paper_avg = Math.round(r.avg * 10) / 10;
    }
    return json({ week, states: Object.values(by).sort((a, b) => b.total - a.total) }, 200, { 'cache-control': 'public, max-age=60' });
  }

  // NationLap friend ghosts. A recording is {v:1, ms, step, t[], lat[]}: two floats per 200 ms,
  // so a few KB. It is checked for shape and size, not for being a fair lap: a ghost only
  // changes what one friend sees on their own screen, and never touches a score or a board.
  const GHOST_KINDS = ['affairs', 'quick'];
  async function ghost(request, env) {
    if (!env.GAME_DB) return json({ error: 'storage not configured' }, 503);
    const db = env.GAME_DB;
    if (request.method === 'GET') {
      const code = String(new URL(request.url).searchParams.get('code') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
      const row = code && await db.prepare('SELECT name, kind, ms, rec, at FROM nl_ghost WHERE code=?1').bind(code).first();
      if (!row) return json({ error: 'This ghost has expired' }, 404);
      return json({ name: row.name, kind: row.kind, ms: row.ms, at: row.at, rec: JSON.parse(row.rec) }, 200, { 'cache-control': 'public, max-age=3600' });
    }
    if (request.method !== 'POST') return json({ error: 'GET or POST' }, 405);
    if (await limited(env.GAME_SUBMIT_RL, 'gh:' + (request.headers.get('cf-connecting-ip') || 'na'), 10)) return json({ error: 'slow down' }, 429, { 'retry-after': '60' });
    const b = await body(request);
    const r = b && b.rec;
    const nums = (a) => Array.isArray(a) && a.length >= 10 && a.length <= 3000 && a.every((x) => typeof x === 'number' && Number.isFinite(x));
    if (!r || r.v !== 1 || !nums(r.t) || !nums(r.lat) || r.t.length !== r.lat.length || !(r.ms >= 10000 && r.ms <= 1200000) || !(r.step > 0 && r.step <= 1000)) {
      return json({ error: 'bad recording' }, 400);
    }
    const rec = JSON.stringify({ v: 1, ms: Math.round(r.ms), step: r.step, t: r.t.map((x) => Math.round(x * 1e5) / 1e5), lat: r.lat.map((x) => Math.round(x * 100) / 100) });
    if (rec.length > 60000) return json({ error: 'recording too long' }, 400);
    const name = cleanName(b.name).slice(0, 20) || 'A friend';
    const kind = GHOST_KINDS.includes(b.kind) ? b.kind : 'affairs';
    const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', now = Date.now();
    for (let t = 0; t < 5; t++) {
      const code = Array.from(crypto.getRandomValues(new Uint8Array(7)), (x) => A[x % A.length]).join('');
      try {
        await db.prepare('INSERT INTO nl_ghost (code, name, kind, ms, rec, at) VALUES (?1,?2,?3,?4,?5,?6)').bind(code, name, kind, Math.round(r.ms), rec, now).run();
        // Shared ghosts live 30 days; trim the old ones now and then rather than on a cron.
        if (Math.random() < 0.02) await db.prepare('DELETE FROM nl_ghost WHERE at < ?1').bind(now - 30 * DAY).run();
        return json({ ok: true, code });
      } catch { /* code taken, try another */ }
    }
    return json({ error: 'try again' }, 500);
  }

  // Most Informed State: how many people from each state kept up with the news this week.
  // It counts finishes, one per device per IST day, so the measure is turnout, not marks; the
  // graded India board stays where it is. Accuracy is shown beside it, never ranked on.
  async function informed(request, env) {
    if (!env.GAME_DB) return json({ states: [] });
    const db = env.GAME_DB, now = Date.now(), day = dayId(now);
    if (request.method === 'POST') {
      if (await limited(env.GAME_SUBMIT_RL, 'gi:' + (request.headers.get('cf-connecting-ip') || 'na'), 10)) return json({ error: 'slow down' }, 429, { 'retry-after': '60' });
      const b = await body(request);
      const st = cleanState(b && b.state), dev = String((b && b.device) || '').replace(/[^a-z0-9]/gi, '').slice(0, 32);
      const total = Math.max(0, Math.min(30, Number(b && b.total) | 0)), clean = Math.max(0, Math.min(total, Number(b && b.clean) | 0));
      if (!st || dev.length < 8 || !total) return json({ error: 'bad request' }, 400);
      await db.prepare('INSERT OR IGNORE INTO nl_informed (day, uid, state, clean, total, at) VALUES (?1,?2,?3,?4,?5,?6)').bind(day, 'd_' + dev, st, clean, total, now).run();
    }
    const { results } = await db.prepare(`SELECT state, COUNT(*) AS n, SUM(clean) AS c, SUM(total) AS t FROM nl_informed WHERE day > ?1 GROUP BY state ORDER BY n DESC, c DESC LIMIT 40`).bind(day - 7).all();
    const states = (results || []).map((r, i) => ({ rank: i + 1, code: r.state, name: STATES[r.state] || r.state, players: r.n, accuracy: r.t ? Math.round((r.c / r.t) * 100) : 0 }));
    return json({ days: 7, states }, 200, request.method === 'GET' ? { 'cache-control': 'public, max-age=60' } : {});
  }

  const routes = {
    '/api/game/informed': informed,
    '/api/game/ghost': ghost,
    '/api/game/paper': paper, '/api/game/mock': mock, '/api/game/event': eventBoard,
    '/api/game/group/create': groupCreate, '/api/game/group/join': groupJoin, '/api/game/group/leave': groupLeave,
    '/api/game/group': groupBoard, '/api/game/groups': groupLeague, '/api/game/bharat': bharat,
  };
  return { routes, recordEvent };
}

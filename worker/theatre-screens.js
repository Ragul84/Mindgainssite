// ==== theatre-screens-20261121 (mindgains.ai) ====
// Auto screens for the Live Theatre: one hall = several screens, like a multiplex.
//   * Screen 1 is the old hall instance ("main" / "tnpsc"), so nothing about existing links changes.
//     Screen k (k >= 2) is the TheatreHall instance "<hall>~s<k>"; each screen has its own 216 seats, chat and ambient audience.
//   * A lobby instance per hall ("lobby:<hall>", same TheatreHall class, so no new binding or migration) decides who goes
//     where: first screen under the soft cap (200 real people), reconnects go back to their screen, a friend's invite link
//     and a group link go to the inviter's / group's screen (up to the hard cap, 216 seats).
//   * The lobby is the single source of truth for the quiz: it picks ONE question, pushes it to every screen, collects the
//     answers after 15 s, scores them on one combined board and pushes the same reveal + Top 5 to every screen.
//   * Viewer count: every screen reports its live count to the lobby; the lobby pushes the combined total back (at most
//     every 2 s), so every screen shows "N in the hall" for the whole hall.
//   * Friends together: on hello, a friend who came by the inviter's link is seated next to the inviter (left/right seat);
//     if neither is free, the friend takes the nearest free PAIR of seats and the inviter gets a "Move us together" offer
//     (the other seat of the pair is held for them for 90 s). Nobody is ever moved without tapping.
//   * Group links: a block of 2-8 adjacent seats in one screen, held for 20 minutes for members of the link.
//   * Cost: seat-map broadcasts are batched (one per 250 ms per screen instead of one per join/leave/sit), and the
//     "N answered" ticker is throttled to one per 600 ms per screen.
// Installed with installScreens(TheatreHall) from worker/index.js (prototype wrapper, same pattern as rmDelegate), so the
// hall code in theatre.js keeps working unchanged for every other instance (duo-v1, profile-v1, rankmock:*).
import { PRO_SEATS, SEAT_RE, clean } from './theatre-shared.js';
import { HOOKS } from './theatre-hooks.js';
import { recordAnswers } from './pro.js';

const HALLS = new Set(['main', 'tnpsc']);
const SOFT = 200, HARD = 216, QUIZ_EVERY_MS = 4 * 60 * 1000, ANSWER_MS = 15000;
const STICKY_MS = 4 * 3600e3, SEEN_MS = 90e3, PUSH_GAP = 2000, HB_MS = 30e3;
const PAIR_HOLD_MS = 90e3, GROUP_MS = 20 * 60e3, GROUP_MAX = 8, PIN_MS = 6000;
const ROWS = 'ABCDEFGHIJKL', PER = 18;
const AL = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const code6 = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), (x) => AL[x % AL.length]).join('');
const testOn = (env) => !!(env && env.SCREENS_TEST === '1');
const screenName = (hall, k) => (k === 1 ? hall : hall + '~s' + k);
const J = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

// ---------- seat geometry (pure) ----------
const rc = (s) => [ROWS.indexOf(s[0]), +s.slice(1)];
const key = (r, n) => ROWS[r] + n;
const dist = (a, b) => { const [r1, n1] = rc(a), [r2, n2] = rc(b); return Math.abs(r1 - r2) * 1.6 + Math.abs(n1 - n2); };
const ALL = []; for (let r = 0; r < ROWS.length; r++) for (let n = 1; n <= PER; n++) ALL.push(key(r, n));
// a seat anyone may take: inside the hall, not reserved for Pro (unless pro), not used, not held for someone else
function freeFn(used, holds, who, pro, now) {
  return (s) => SEAT_RE.test(s) && (pro || !PRO_SEATS.has(s)) && !used.has(s) && !heldOther(holds, s, who, now);
}
function heldOther(holds, s, who, now) { const h = holds && holds[s]; return !!(h && h.until > now && !(who && (h.id === who.id || (h.g && h.g === who.g)))); }
// next to `seat` in the same row: right then left
function adjacent(seat, ok) { const [r, n] = rc(seat); for (const m of [n + 1, n - 1]) if (m >= 1 && m <= PER && ok(key(r, m))) return key(r, m); return null; }
// nearest pair of free side-by-side seats to `seat`; returns [near, other] where `near` is the one closer to `seat`
function nearestPair(seat, ok) {
  let best = null, bd = 1e9;
  for (let r = 0; r < ROWS.length; r++) for (let n = 1; n < PER; n++) {
    const a = key(r, n), b = key(r, n + 1); if (!ok(a) || !ok(b)) continue;
    const d = Math.min(dist(a, seat), dist(b, seat)); if (d < bd) { bd = d; best = dist(a, seat) <= dist(b, seat) ? [a, b] : [b, a]; }
  }
  return best;
}
function nearestOne(seat, ok) { let best = null, bd = 1e9; for (const s of ALL) if (ok(s)) { const d = seat ? dist(s, seat) : Math.abs(rc(s)[0] - 6.5) * 1.2 + Math.abs(rc(s)[1] - 9.5) * .55; if (d < bd) { bd = d; best = s; } } return best; }
// block of n side-by-side free seats in one row: nearest to `seat` if given, else middle rows / centre first
function findBlock(n, ok, seat) {
  let best = null, bd = 1e9;
  for (let r = 0; r < ROWS.length; r++) for (let s = 1; s + n - 1 <= PER; s++) {
    const blk = []; for (let i = 0; i < n; i++) blk.push(key(r, s + i));
    if (!blk.every(ok)) continue;
    const mid = s + (n - 1) / 2, d = seat ? Math.min(...blk.map((x) => dist(x, seat))) : Math.abs(r - 6.5) * 1.2 + Math.abs(mid - 9.5) * .55;
    if (d < bd) { bd = d; best = blk; }
  }
  return best;
}
// lobby screen choice (pure): counts {k: n}, returns k
function pickScreen(counts, max, cap) {
  for (let k = 1; k <= max; k++) if ((counts[k] || 0) < cap) return k;
  return max + 1;
}
export const SCREENS_PURE = { adjacent, nearestPair, nearestOne, findBlock, pickScreen, freeFn, dist };

// ---------- lobby (instance "lobby:<hall>") ----------
async function lobbyLoad(self) {
  if (self.__L) return self.__L;
  const L = (await self.ctx.storage.get('lob')) || { hall: 'main', sc: {}, max: 1, next: 0, sim: null };
  self.__L = L; return L;
}
const lobbySave = (self) => self.ctx.storage.put('lob', self.__L);
function phantom(L, k, now) {   // test-only simulated crowd: fills screens 1..m with up to SOFT phantoms each
  const s = L.sim; if (!s || s.until < now) return 0;
  const full = Math.floor(s.n / SOFT), rest = s.n % SOFT;
  return k <= full ? SOFT : k === full + 1 ? rest : 0;
}
function realCount(L, k, now) { const e = L.sc[k]; if (!e || now - e.at > SEEN_MS) return e && e.pend && now - e.pendAt < 15e3 ? e.pend : 0; return e.n + (e.pend && now - e.pendAt < 15e3 ? e.pend : 0); }
const countOf = (L, k, now) => realCount(L, k, now) + phantom(L, k, now);
function counts(L, now) { const o = {}; const m = Math.max(L.max, simScreens(L, now)); for (let k = 1; k <= m; k++) o[k] = countOf(L, k, now); return o; }
const simScreens = (L, now) => (L.sim && L.sim.until > now ? Math.ceil(L.sim.n / SOFT) : 0);
const totalOf = (L, now) => Object.values(counts(L, now)).reduce((a, b) => a + b, 0);
const liveScreens = (L, now) => Object.keys(L.sc).map(Number).filter((k) => realCount(L, k, now) > 0);
const activeScreens = (L, now) => Object.values(counts(L, now)).filter((n) => n > 0).length;

async function toScreen(self, k, body) {
  const L = self.__L;
  try {
    const stub = self.env.THEATRE.get(self.env.THEATRE.idFromName(screenName(L.hall, k)));
    const r = await stub.fetch('https://scr/__scr', { method: 'POST', body: JSON.stringify({ ...body, hall: L.hall, k }) });
    return await r.json();
  } catch { return null; }
}
async function pushTotals(self) {
  const L = self.__L, now = Date.now(); L.lastPush = now; self.__pushT = null;
  const c = counts(L, now), total = Object.values(c).reduce((a, b) => a + b, 0), scrs = Object.values(c).filter((n) => n > 0).length;
  self.__lastTotal = total;
  await Promise.all(liveScreens(L, now).map((k) => toScreen(self, k, { op: 'total', total, mine: c[k] || 0, scrs })));
}
function pushSoon(self) {
  const L = self.__L, now = Date.now();
  if (self.__pushT) return;
  const wait = Math.max(0, PUSH_GAP - (now - (L.lastPush || 0)));
  self.__pushT = setTimeout(() => { pushTotals(self).catch(() => {}); }, wait);
}

async function lobbyFetch(self, request) {
  const L = await lobbyLoad(self), b = await request.json().catch(() => ({})), now = Date.now(), S = self.ctx.storage;
  if (b.hall && HALLS.has(b.hall) && L.hall !== b.hall) { L.hall = b.hall; await S.put('hall', b.hall); await lobbySave(self); }
  if (!(await S.get('hall'))) await S.put('hall', L.hall);
  const cap = testOn(self.env) && b.scap > 0 ? Math.min(SOFT, b.scap | 0) : SOFT;
  if (b.op === 'assign') {
    const p = clean(b.p, 64), ref = clean(b.ref, 64), grp = clean(b.grp, 8).toUpperCase();
    let k = 0, why = 'fill';
    if (grp) { const g = await S.get('g:' + grp); if (g && g.until > now && countOf(L, g.k, now) < HARD) { k = g.k; why = 'group'; } }
    if (!k && ref && ref !== p) { const s = await S.get('st:' + ref); if (s && now - s.at < STICKY_MS) { if (countOf(L, s.k, now) < HARD) { k = s.k; why = 'friend'; } else why = 'friendfull'; } }
    if (!k && p) { const s = await S.get('st:' + p); if (s && now - s.at < STICKY_MS && countOf(L, s.k, now) < HARD && countOf(L, s.k, now) > 0) { k = s.k; why = 'back'; } }
    if (!k) k = pickScreen(counts(L, now), Math.max(L.max, simScreens(L, now)), cap);
    if (k > L.max) L.max = k;
    const e = L.sc[k] || (L.sc[k] = { n: 0, at: 0 });
    e.pend = (e.pendAt && now - e.pendAt < 15e3 ? e.pend || 0 : 0) + 1; e.pendAt = now;
    if (p) await S.put('st:' + p, { k, at: now });
    await lobbySave(self);
    if (!(await S.getAlarm())) await S.setAlarm(now + QUIZ_EVERY_MS);
    return J({ k, why, name: screenName(L.hall, k) });
  }
  if (b.op === 'report') {
    const k = b.k | 0; if (k < 1 || k > 500) return J({ err: 'k' });
    const e = L.sc[k] || (L.sc[k] = { n: 0, at: 0 });
    const was = e.n; e.n = Math.max(0, b.n | 0); e.at = now; e.pend = 0;
    if (k > L.max) L.max = k;
    // a screen that just woke up mid-round gets the running question
    const Q = self.quiz, late = Q && !Q.revealed && Q.ends > now && !(Q.screens || []).includes(k);
    if (late) { Q.screens = [...(Q.screens || []), k]; await self.save(); }
    await lobbySave(self);
    if (e.n !== was || totalOf(L, now) !== self.__lastTotal) pushSoon(self);
    if (e.n > 0 && !(await S.getAlarm())) await S.setAlarm(now + QUIZ_EVERY_MS);
    const c = counts(L, now);
    return J({ total: Object.values(c).reduce((a, x) => a + x, 0), mine: c[k] || 0, scrs: Object.values(c).filter((x) => x > 0).length, next: L.next || 0,
      ...(late ? { quiz: pubQuiz(Q) } : {}), ...(Q && Q.revealed ? {} : {}) });
  }
  if (b.op === 'bonus') {   // invite reward: +pts on the combined board, every screen shows the new Top 5
    const id = clean(b.id, 64); if (!id) return J({ err: 'id' });
    const x = self.board[id] || (self.board[id] = { name: clean(b.name, 20) || 'Friend', seat: b.seat || null, pts: 0, ms: 0 });
    x.pts += Math.max(0, Math.min(500, b.pts | 0)); await self.save();
    await Promise.all(liveScreens(L, now).filter((k) => k !== (b.from | 0)).map((k) => toScreen(self, k, { op: 'bonus', id, entry: x, refok: b.refok || null })));
    return J({ ok: true, entry: x });
  }
  if (b.op === 'chatall') {   // a MindGains host message reaches every screen
    await Promise.all(liveScreens(L, now).filter((k) => k !== (b.from | 0)).map((k) => toScreen(self, k, { op: 'chat', m: b.m })));
    return J({ ok: true });
  }
  if (b.op === 'group') {
    const p = clean(b.p, 64), n = Math.max(2, Math.min(GROUP_MAX, b.n | 0));
    if (!p) return J({ err: 'player' }, 400);
    const mine = (await S.get('gp:' + p)) || [];
    const live = mine.filter((x) => x.until > now);
    if (live.length >= 3) return J({ err: 'limit' }, 429);
    const code = code6(), until = now + GROUP_MS, order = [];
    const s = await S.get('st:' + p); if (s && now - s.at < STICKY_MS) order.push(s.k);
    for (let k = 1; k <= L.max; k++) if (!order.includes(k)) order.push(k);
    order.push(L.max + 1);
    for (const k of order) {
      const c = countOf(L, k, now); if (c + n > (k === order[0] && s ? HARD : cap)) continue;
      const r = await toScreen(self, k, { op: 'reserve', code, n, owner: p, until });
      if (r && r.seats) {
        if (k > L.max) L.max = k;
        await S.put('g:' + code, { k, until, n, owner: p, seats: r.seats });
        await S.put('gp:' + p, [...live, { code, until }]); await lobbySave(self);
        return J({ code, k, seats: r.seats, until, moved: r.moved || null });
      }
    }
    return J({ err: 'full' }, 409);
  }
  if (b.op === 'status') {
    if (testOn(self.env) && b.sim !== undefined) { L.sim = b.sim > 0 ? { n: Math.min(5000, b.sim | 0), until: now + 30 * 60e3 } : null; await lobbySave(self); pushSoon(self); }
    if (testOn(self.env) && b.quiznow) await S.setAlarm(now + 200);
    const c = counts(L, now);
    return J({ hall: L.hall, total: Object.values(c).reduce((a, x) => a + x, 0), screens: c, soft: SOFT, hard: HARD, sim: L.sim || null, quiz: self.quiz ? { qid: self.quiz.qid, revealed: !!self.quiz.revealed, screens: self.quiz.screens || [] } : null, next: L.next || 0, board: Object.keys(self.board || {}).length });
  }
  if (b.op === 'quiznow' && testOn(self.env)) { await S.setAlarm(now + 200); return J({ ok: true }); }
  return J({ err: 'op' }, 400);
}
const pubQuiz = (Q) => ({ qid: Q.qid, from: Q.from || '', q: Q.q, opts: Q.opts, correct: Q.correct, start: Q.start, ends: Q.ends });

// the lobby's alarm drives one quiz for every screen
async function lobbyAlarm(self) {
  const L = await lobbyLoad(self), S = self.ctx.storage, now = Date.now();
  const live = liveScreens(L, now);
  if (!live.length) { self.quiz = null; self.board = {}; L.next = 0; await self.save(); await lobbySave(self); return; }   // nobody anywhere: sleep and reset the show
  const pauseAt = async (at) => (typeof self.rmPausedUntil === 'function' ? await self.rmPausedUntil(at) : 0);   // Sunday Rank Mock pause (PR #3), if present
  if (self.quiz && !self.quiz.revealed) {
    const Q = self.quiz, targets = [...new Set([...(Q.screens || []), ...live])];
    const got = await Promise.all(targets.map((k) => toScreen(self, k, { op: 'collect', qid: Q.qid })));
    const answers = {};
    for (const g of got) if (g && g.answers) for (const [id, x] of Object.entries(g.answers)) if (!answers[id]) answers[id] = x;
    Q.revealed = true;
    let right = 0;
    for (const [id, x] of Object.entries(answers)) {
      const b = self.board[id] || (self.board[id] = { name: x.name, seat: x.seat, pts: 0, ms: 0 });
      b.name = x.name; b.seat = x.seat;
      if (x.i === Q.correct) { right++; b.pts += 100 + Math.max(0, Math.round((ANSWER_MS - x.ms) / 150)); b.ms += x.ms; }
    }
    const n = Object.keys(answers).length, pct = n ? Math.round(right / n * 100) : 0;
    const fast = Object.values(answers).filter((x) => x.i === Q.correct).sort((a, b) => a.ms - b.ms)[0];
    // keep the board lean: only players with points travel to the screens
    const board = {}; for (const [id, v] of Object.entries(self.board)) if (v.pts > 0) board[id] = v;
    self.board = board;
    let at = Date.now() + QUIZ_EVERY_MS; const rmp = await pauseAt(at); if (rmp) at = rmp;
    L.next = at; await self.save(); await lobbySave(self); await S.setAlarm(at);
    await Promise.all(targets.map((k) => toScreen(self, k, { op: 'reveal', qid: Q.qid, correct: Q.correct, pct, n, fastest: fast ? { name: fast.name, s: +(fast.ms / 1000).toFixed(1) } : null, board, next: at, ...(rmp ? { paused: 'rankmock', until: rmp } : {}) })));
    return;
  }
  const rmp = await pauseAt(now);
  if (rmp) { L.next = rmp; await lobbySave(self); await S.setAlarm(rmp); await Promise.all(live.map((k) => toScreen(self, k, { op: 'next', at: rmp, paused: 'rankmock', until: rmp }))); return; }
  const q = await self.pickQuestion();
  if (!q) { L.next = Date.now() + QUIZ_EVERY_MS; await lobbySave(self); await S.setAlarm(L.next); return; }
  const t = Date.now();
  self.quiz = { qid: 'q' + t, from: q.from || '', q: q.question, opts: q.options, correct: q.answer_index, start: t, ends: t + ANSWER_MS, revealed: false, screens: live };
  await self.save(); await S.setAlarm(t + ANSWER_MS + 700);
  await Promise.all(live.map((k) => toScreen(self, k, { op: 'quiz', quiz: pubQuiz(self.quiz) })));
}

// ---------- screen side ----------
async function lobbyCall(env, hall, body) {
  try {
    const stub = env.THEATRE.get(env.THEATRE.idFromName('lobby:' + hall));
    const r = await stub.fetch('https://lobby/__lobby', { method: 'POST', body: JSON.stringify({ hall, ...body }) });
    return await r.json();
  } catch { return null; }
}
async function holdsLoad(self) { if (!self.__holds) self.__holds = (await self.ctx.storage.get('holds')) || {}; return self.__holds; }
function holdsPrune(self, now) { const H = self.__holds || {}; let ch = false; for (const [s, h] of Object.entries(H)) if (!(h.until > now)) { delete H[s]; ch = true; } return ch; }
const holdsSave = (self) => self.ctx.storage.put('holds', self.__holds || {});
function usedSeats(self, except) { const u = new Set(); for (const { ws, a } of self.peers()) if (a.seat && ws !== except) u.add(a.seat); return u; }
const ownCount = (self) => self.ctx.getWebSockets().length;
function shownTotal(self) { const T = self.__tot; if (!T) return ownCount(self); return Math.max(ownCount(self), T.total - T.mine + ownCount(self)); }
function resList(self, now) { const H = self.__holds || {}, used = usedSeats(self); return Object.keys(H).filter((s) => H[s].until > now && !used.has(s)); }

function reportSoon(self, delay = 700) {
  if (self.__repT) return;
  self.__repT = setTimeout(() => { self.__repT = null; report(self).catch(() => {}); }, delay);
}
async function report(self) {
  const S = self.__S; if (!S) return;
  const r = await lobbyCall(self.env, S.hall, { op: 'report', k: S.k, n: ownCount(self) });
  if (!r || r.err) return;
  applyTotal(self, r);
  if (r.next) self.__next = r.next;
  if (r.quiz && (!self.quiz || self.quiz.qid !== r.quiz.qid)) await startQuiz(self, r.quiz);
}
function applyTotal(self, r) {
  const before = shownTotal(self), bs = self.__tot && self.__tot.scrs;
  self.__tot = { total: r.total | 0, mine: r.mine | 0, scrs: r.scrs | 0 };
  if (shownTotal(self) !== before || r.scrs !== bs) self.__origAllFn.call(self, { t: 'count', count: shownTotal(self), here: ownCount(self), scr: self.__S.k, scrs: Math.max(1, r.scrs | 0) });
}
async function startQuiz(self, q) {
  self.quiz = { qid: q.qid, from: q.from || '', q: q.q, opts: q.opts, correct: q.correct, start: q.start, ends: q.ends, answers: {}, revealed: false };
  await self.save();
  self.all({ t: 'quiz', qid: q.qid, from: q.from || '', q: q.q, opts: q.opts, ends: q.ends });
  HOOKS.onQuiz(self);
  await self.save();
}
async function screenOp(self, request) {
  const b = await request.json().catch(() => ({})), now = Date.now();
  if (!self.__S) self.__S = (await self.ctx.storage.get('scr')) || null;
  if (!self.__S && HALLS.has(b.hall) && b.k >= 1) {   // a brand-new screen (e.g. a group block before anyone connects)
    self.__S = { hall: b.hall, k: b.k | 0 }; await self.ctx.storage.put('scr', self.__S); self.__mode = 'screen'; self.__origAll = self.__origAll || Object.getPrototypeOf(self).__origAllFn;
  }
  if (!self.__S) return J({ err: 'not a screen' }, 409);
  if (b.op === 'total') { applyTotal(self, b); return J({ ok: true }); }
  if (b.op === 'quiz') { if (!self.quiz || self.quiz.qid !== b.quiz.qid) await startQuiz(self, b.quiz); return J({ ok: true }); }
  if (b.op === 'collect') { const Q = self.quiz; return J({ answers: Q && Q.qid === b.qid ? Q.answers || {} : {} }); }
  if (b.op === 'reveal') {
    let Q = self.quiz;
    if (!Q || Q.qid !== b.qid) Q = self.quiz = { qid: b.qid, q: '', opts: [], correct: b.correct, answers: {}, start: now, ends: now };
    Q.revealed = true; Q.correct = b.correct;
    self.board = b.board || {};
    const mine = Object.entries(Q.answers || {}).filter(([, x]) => x.uid);
    if (mine.length) self.ctx.waitUntil(recordAnswers(self.env, mine.map(([, x]) => [x.uid, Q.qid, Q.from || 'General', x.i === Q.correct, x.ms])));
    flushAnswered(self);
    self.all({ t: 'reveal', qid: Q.qid, correct: Q.correct, pct: b.pct, n: b.n, top: self.top(), fastest: b.fastest || null });
    const order = Object.entries(self.board).filter(([, v]) => v.pts > 0).sort((x, y) => y[1].pts - x[1].pts || x[1].ms - y[1].ms).map(([id]) => id);
    for (const { ws, a } of self.peers()) { const r = order.indexOf(a.id); self.send(ws, { t: 'me', rank: r >= 0 ? r + 1 : 0, of: order.length, pts: r >= 0 ? self.board[a.id].pts : 0 }); }
    HOOKS.afterReveal(self);
    await self.save();
    self.__next = b.next; await self.ctx.storage.put('scrNext', b.next);
    self.all({ t: 'next', at: b.next, ...(b.paused ? { paused: b.paused, until: b.until } : {}) });
    return J({ ok: true });
  }
  if (b.op === 'next') { self.__next = b.at; self.all({ t: 'next', at: b.at, ...(b.paused ? { paused: b.paused, until: b.until } : {}) }); return J({ ok: true }); }
  if (b.op === 'bonus') {
    self.board[b.id] = b.entry; await self.save();
    self.all({ t: 'board', top: self.top() });
    if (b.refok) for (const { ws, a } of self.peers()) if (a.id === b.id) self.send(ws, { t: 'refok', name: b.refok.name, pts: b.refok.pts });
    return J({ ok: true });
  }
  if (b.op === 'chat') { const m = b.m; if (m && m.text) { self.chat.push(m); if (self.chat.length > 60) self.chat = self.chat.slice(-60); self.__origAllFn.call(self, { t: 'chat', m }); await self.ctx.storage.put('chat', self.chat); } return J({ ok: true }); }
  if (b.op === 'reserve') {
    const H = await holdsLoad(self); holdsPrune(self, now);
    const n = Math.max(2, Math.min(GROUP_MAX, b.n | 0)), owner = clean(b.owner, 64);
    const ownerPeer = self.peers().find((p) => owner && (p.a.lpid === owner || p.a.pid === owner));
    const used = usedSeats(self, ownerPeer ? ownerPeer.ws : null);
    const ok = freeFn(used, H, null, false, now);
    const blk = findBlock(n, ok, ownerPeer ? ownerPeer.a.seat : null);
    if (!blk) return J({ err: 'full' });
    for (const s of blk) H[s] = { g: b.code, until: b.until };
    let moved = null;
    if (ownerPeer && !blk.includes(ownerPeer.a.seat)) {   // the creator takes the first seat of the block (or the one nearest them)
      ownerPeer.a.seat = blk[0]; ownerPeer.a.g = b.code; ownerPeer.a.pin = now + PIN_MS; ownerPeer.ws.serializeAttachment(ownerPeer.a); moved = blk[0];
      self.send(ownerPeer.ws, { t: 'seatyou', seat: blk[0], why: 'group' });
    } else if (ownerPeer) { ownerPeer.a.g = b.code; ownerPeer.ws.serializeAttachment(ownerPeer.a); }
    await holdsSave(self); self.broadcastSeats();
    return J({ seats: blk, moved });
  }
  return J({ err: 'op' }, 400);
}

// friend / group seating on hello (runs before the hall's own hello, so the client's first "sit" can't race it)
async function seatOnHello(self, ws, a, m) {
  const now = Date.now(), H = await holdsLoad(self); if (holdsPrune(self, now)) await holdsSave(self);
  const grp = clean(m.grp, 8).toUpperCase(), ref = clean(m.ref, 64), lp = clean(m.pid, 64);
  if (!a.lpid) a.lpid = lp;
  if (grp && Object.values(H).some((h) => h.g === grp)) {
    a.g = grp;
    const used = usedSeats(self, ws), block = Object.keys(H).filter((s) => H[s].g === grp && H[s].until > now).sort();
    const seat = block.find((s) => !used.has(s)) || nearestOne(block[0], freeFn(used, H, a, false, now));
    if (seat) { a.seat = seat; a.pin = now + PIN_MS; ws.serializeAttachment(a); self.send(ws, { t: 'seatyou', seat, why: block.includes(seat) ? 'group' : 'groupfull' }); return true; }
  }
  if (ref && ref !== lp) {
    const inv = self.peers().find((p) => p.ws !== ws && p.a.seat && (p.a.lpid === ref || p.a.pid === ref || p.a.uid === ref));
    if (!inv) return false;
    const used = usedSeats(self, ws), ok = freeFn(used, H, a, false, now), name = clean(m.name, 20) || 'Your friend';
    let seat = adjacent(inv.a.seat, ok), why = 'friend';
    if (!seat) {
      const pair = nearestPair(inv.a.seat, ok);
      if (pair) {
        seat = pair[0]; why = 'friendnear';
        H[pair[1]] = { id: inv.a.id, until: now + PAIR_HOLD_MS }; await holdsSave(self);
        self.send(inv.ws, { t: 'pairoffer', seat: pair[1], friendSeat: pair[0], name, ttl: PAIR_HOLD_MS });
      } else { seat = nearestOne(inv.a.seat, ok); why = 'friendfar'; }
    }
    if (seat) { a.seat = seat; a.pin = now + PIN_MS; ws.serializeAttachment(a); self.send(ws, { t: 'seatyou', seat, why, name: inv.a.name, near: inv.a.seat }); return true; }
  }
  return false;
}

// answered ticker: at most one per 600 ms per screen
function queueAnswered(self, m) { self.__ansQ = m; if (self.__ansT) return; self.__ansT = setTimeout(() => flushAnswered(self), 600); }
function flushAnswered(self) { clearTimeout(self.__ansT); self.__ansT = null; const m = self.__ansQ; self.__ansQ = null; if (m) self.__origAllFn.call(self, { ...m, of: ownCount(self) }); }

export function installScreens(Cls) {
  const P = Cls.prototype;
  if (P.__screens) return; P.__screens = true;
  const orig = { fetch: P.fetch, wsm: P.webSocketMessage, wsc: P.webSocketClose, wse: P.webSocketError, alarm: P.alarm, send: P.send, all: P.all, bs: P.broadcastSeats };
  P.__origAllFn = orig.all;
  async function mode(self) {
    if (self.__mode === undefined) {
      if (await self.ctx.storage.get('lob')) self.__mode = 'lobby';
      else { const s = await self.ctx.storage.get('scr'); self.__S = s || null; self.__mode = s ? 'screen' : null; if (s) { self.__next = (await self.ctx.storage.get('scrNext')) || 0; await holdsLoad(self); } }
    }
    if (self.__mode === 'screen') self.__origAll = orig.all;
    return self.__mode;
  }
  P.fetch = async function (request) {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/__lobby') { if (!this.__L) { await lobbyLoad(this); await lobbySave(this); } this.__mode = 'lobby'; return lobbyFetch(this, request); }
    if (request.method === 'POST' && url.pathname === '/__scr') { await mode(this); return screenOp(this, request); }
    // Sunday Rank Mock admin-test pause (PR #3) is posted to the hall instance (= screen 1): the lobby runs the quiz, so pass it on
    if (request.method === 'POST' && url.pathname === '/__rmpause' && (await mode(this)) === 'screen') {
      const body = await request.text(), hall = (this.__S && this.__S.hall) || 'main';
      try { await this.env.THEATRE.get(this.env.THEATRE.idFromName('lobby:' + hall)).fetch('https://lobby/__rmpause', { method: 'POST', body }); } catch {}
      return orig.fetch.call(this, new Request(request.url, { method: 'POST', body, headers: request.headers }));
    }
    const k = +url.searchParams.get('scr'), hall = url.searchParams.get('hall');
    if (k >= 1 && HALLS.has(hall) && request.headers.get('Upgrade') === 'websocket') {
      if (!this.__S) { const s = { hall, k }; await this.ctx.storage.put('scr', s); this.__S = s; this.__mode = 'screen'; await holdsLoad(this); this.__next = (await this.ctx.storage.get('scrNext')) || 0; }
      this.__origAll = orig.all;
      const res = await orig.fetch.call(this, request);
      const al = await this.ctx.storage.getAlarm();   // heartbeat to the lobby every 30 s while anyone is here
      if (!al || al > Date.now() + HB_MS) await this.ctx.storage.setAlarm(Date.now() + HB_MS);
      reportSoon(this);
      return res;
    }
    return orig.fetch.call(this, request);
  };
  P.webSocketMessage = async function (ws, raw) {
    if ((await mode(this)) !== 'screen') return orig.wsm.call(this, ws, raw);
    let m; try { m = JSON.parse(raw); } catch { return; }
    const a = ws.deserializeAttachment() || {}, now = Date.now();
    if (m.t === 'hello') {
      if (!a.lpid) { a.lpid = clean(m.pid, 64); ws.serializeAttachment(a); }
      if (!a.seat) await seatOnHello(this, ws, a, m);
      return orig.wsm.call(this, ws, raw);
    }
    if (m.t === 'sit') {
      const seat = String(m.seat || '');
      if (a.pin && a.pin > now && a.seat && seat !== a.seat) return this.send(ws, { t: 'seatyou', seat: a.seat, why: 'pinned' });
      if (heldOther(this.__holds, seat, a, now)) return this.send(ws, { t: 'taken', seat });
      const r = await orig.wsm.call(this, ws, raw);
      const H = this.__holds || {}, b = ws.deserializeAttachment() || {};
      if (H[seat] && H[seat].id === a.id && b.seat === seat) { delete H[seat]; await holdsSave(this); this.send(ws, { t: 'seatyou', seat, why: 'together' }); }
      return r;
    }
    if (m.t === 'hk_test' && m.op === 'quiz' && testOn(this.env)) { await lobbyCall(this.env, this.__S.hall, { op: 'quiznow' }); return; }
    return orig.wsm.call(this, ws, raw);
  };
  P.webSocketClose = async function (ws, ...x) { const md = await mode(this); const r = await orig.wsc.call(this, ws, ...x); if (md === 'screen') reportSoon(this, 400); return r; };
  P.webSocketError = async function (ws, e) { const md = await mode(this); const r = await orig.wse.call(this, ws, e); if (md === 'screen') reportSoon(this, 400); return r; };
  P.alarm = async function (...x) {
    const md = await mode(this);
    if (md === 'lobby') return lobbyAlarm(this);
    if (md !== 'screen') return orig.alarm.call(this, ...x);
    // screens don't run their own quiz: the alarm is a heartbeat to the lobby while anyone is here
    await report(this);
    if (ownCount(this)) await this.ctx.storage.setAlarm(Date.now() + HB_MS);
  };
  P.send = function (ws, m) {
    if (this.__mode === 'screen' && m && m.t === 'state') {
      m = { ...m, count: shownTotal(this), here: ownCount(this), scr: this.__S.k, scrs: Math.max(1, (this.__tot && this.__tot.scrs) || 1), res: resList(this, Date.now()) };
      if (this.__next) m.next = this.__next; else delete m.next;
    }
    return orig.send.call(this, ws, m);
  };
  P.all = function (m) {
    if (this.__mode === 'screen' && m) {
      if (m.t === 'seats') m = { ...m, count: shownTotal(this), here: ownCount(this), scr: this.__S.k, scrs: Math.max(1, (this.__tot && this.__tot.scrs) || 1), res: resList(this, Date.now()) };
      else if (m.t === 'answered') return queueAnswered(this, m);
      else if (m.t === 'chat' && m.m && m.m.host && !m.__relayed) lobbyCall(this.env, this.__S.hall, { op: 'chatall', from: this.__S.k, m: m.m });
    }
    return orig.all.call(this, m);
  };
  // seat maps: one broadcast per 250 ms per screen (earned-seat walks still go out at once)
  P.broadcastSeats = function () {
    if (this.__mode !== 'screen' || this.__mv) return orig.bs.call(this);
    if (this.__bsT) return;
    this.__bsT = setTimeout(() => { this.__bsT = null; try { orig.bs.call(this); } catch {} }, 250);
  };
  // invite reward on the combined board (called from theatre.js after the local +150)
  P.__scrBonus = function (rid, b, pts, name) {
    if (this.__mode !== 'screen') return;
    lobbyCall(this.env, this.__S.hall, { op: 'bonus', from: this.__S.k, id: rid, name: b.name, seat: b.seat, pts, refok: { name, pts } });
  };
}

// ---------- Worker routes ----------
// /api/theatre/<hall>/ws          -> lobby picks the screen, the socket goes to that screen's Durable Object
// /api/theatre/<hall>/group  POST -> {p, n} a group link holding n adjacent seats for 20 minutes
// /api/theatre/<hall>/screens GET -> combined count per screen (test switches only on preview workers)
export async function screensRoute(request, env, pathname) {
  const m = pathname.match(/^\/api\/theatre\/(main|tnpsc)\/(ws|group|screens)$/);
  if (!m) return null;
  const hall = m[1], url = new URL(request.url);
  if (m[2] === 'ws') {
    if (request.headers.get('Upgrade') !== 'websocket') return new Response('websocket only', { status: 426 });
    const q = url.searchParams;
    const r = await lobbyCall(env, hall, { op: 'assign', p: q.get('p') || '', ref: q.get('ref') || '', grp: q.get('grp') || '', scap: +q.get('scap') || 0 });
    const k = r && r.k >= 1 ? r.k : 1;
    const stub = env.THEATRE.get(env.THEATRE.idFromName(screenName(hall, k)));
    return stub.fetch(new Request(request.url + (request.url.includes('?') ? '&' : '?') + 'hall=' + hall + '&scr=' + k + '&why=' + ((r && r.why) || 'fill'), request));
  }
  if (m[2] === 'group') {
    if (request.method !== 'POST') return J({ error: 'POST only' }, 405);
    const b = await request.json().catch(() => ({}));
    const r = await lobbyCall(env, hall, { op: 'group', p: b.p, n: b.n });
    if (!r) return J({ error: 'busy' }, 503);
    if (r.err) return J({ error: r.err }, r.err === 'limit' ? 429 : r.err === 'full' ? 409 : 400);
    return J({ ...r, url: '/play/theatre/?hall=' + hall + '&grp=' + r.code });
  }
  const body = { op: 'status' };
  if (testOn(env)) { if (url.searchParams.has('sim')) body.sim = +url.searchParams.get('sim') || 0; if (url.searchParams.has('quiznow')) body.quiznow = 1; }
  const r = await lobbyCall(env, hall, body);
  return J(r || { error: 'busy' });
}

// MindGains Pro: plans, Razorpay checkout (order -> verify / webhook), free watch allowance,
// synced streak with freezes, and the weak-chapters report. Storage: D1 GAME_DB (game-schema-007-pro.sql).
// Secrets: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET.
import { verifyUser, bearer } from './auth.js';
import CH from '../play/theatre/chapters.json';

export const PLANS = {
  month: { name: 'Pro Monthly', paise: 9900, days: 30 },
  exam: { name: 'Exam Pass · 6 months', paise: 39900, days: 182 },
  year: { name: 'Pro Yearly', paise: 59900, days: 365 },
  // Teacher: Pro + big batch rooms for a tuition class (60 students per room, 10 rooms); students' watch time covered
  tmonth: { name: 'Teacher Monthly', paise: 29900, days: 30, teacher: true },
  tyear: { name: 'Teacher Yearly', paise: 299900, days: 365, teacher: true },
};
export const ROOM_LIMITS = { pro: { rooms: 2, members: 8 }, teacher: { rooms: 10, members: 60 } };
export async function teacherUntil(env, uid) {
  if (!uid || !env.GAME_DB) return 0;
  try { const r = await env.GAME_DB.prepare('SELECT teacher_until FROM pro_sub WHERE uid = ?1').bind(uid).first(); return r && r.teacher_until > Date.now() ? r.teacher_until : 0; } catch { return 0; }
}
export const LAUNCH = { paise: 4900, seats: 500 };   // first month ₹49 for the first 500 Pro members
export const FREE_SECS = 30 * 60;
const DAY = 864e5;
export const istDay = (t = Date.now()) => new Date(t + 5.5 * 3600e3).toISOString().slice(0, 10);
// the Night Race week rolls over every Sunday 20:00 IST
const NIGHT0 = Date.parse('2026-11-15T14:30:00Z');   // a Sunday, 20:00 IST
const nightWeek = () => Math.floor((Date.now() - NIGHT0) / (7 * DAY));
const nightEnds = () => NIGHT0 + (nightWeek() + 1) * 7 * DAY;
// ---- lap verification (NationLap track: length 9568 units, 1 lap; recorder samples every 200 ms)
const TRACK_LEN = 9568, STEP = 200, VMAX = 75, VAVG = 52;   // units/s: peak (top speed + boost + star, generous) and best sustained lap average
export function checkLap(rec, wallMs) {
  if (!rec || rec.v !== 1 || rec.step !== STEP || !Array.isArray(rec.t) || !Array.isArray(rec.lat) || rec.t.length !== rec.lat.length) return { ok: false, why: 'format' };
  const n = rec.t.length, ms = rec.ms | 0;
  if (n < 50 || n > 3000) return { ok: false, why: 'length' };
  if (n * STEP > ms * 1.05 + 1500 || n * STEP < ms * .72 - 1500) return { ok: false, why: 'time' };   // samples must cover the claimed time (slow phones sample a bit less often)
  if (wallMs + 5000 < ms) return { ok: false, why: 'clock' };                                   // can't finish faster than real time
  const maxStep = (VMAX * STEP / 1000) / TRACK_LEN * 1.6;                                          // fraction of a lap per sample
  let prog = 0;
  for (let i = 1; i < n; i++) {
    const a = +rec.t[i - 1], c = +rec.t[i], la = +rec.lat[i];
    if (!(a >= 0 && a <= 1 && c >= 0 && c <= 1) || !isFinite(la) || Math.abs(la) > 60) return { ok: false, why: 'sample' };
    let d = c - a; if (d > .5) d -= 1; if (d < -.5) d += 1;
    if (d > maxStep) return { ok: false, why: 'speed' };
    prog += d;
  }
  if (prog < .97) return { ok: false, why: 'incomplete' };
  if (ms < TRACK_LEN / VMAX * 1000 || prog * TRACK_LEN / (ms / 1000) > VAVG) return { ok: false, why: 'too fast' };
  return { ok: true, ms };
}
const J = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

export async function proUntil(env, uid) {
  if (!uid || !env.GAME_DB) return 0;
  try { const r = await env.GAME_DB.prepare('SELECT until FROM pro_sub WHERE uid = ?1').bind(uid).first(); return r && r.until > Date.now() ? r.until : 0; } catch { return 0; }
}
export async function watchedToday(env, who) {
  if (!who || !env.GAME_DB) return 0;
  try { const r = await env.GAME_DB.prepare('SELECT secs FROM watch_day WHERE who = ?1 AND day = ?2').bind(who, istDay()).first(); return r ? r.secs : 0; } catch { return 0; }
}
export async function addWatch(env, who, secs) {
  if (!who || !env.GAME_DB) return 0;
  try {
    const r = await env.GAME_DB.prepare('INSERT INTO watch_day (who, day, secs) VALUES (?1, ?2, ?3) ON CONFLICT(who, day) DO UPDATE SET secs = secs + ?3 RETURNING secs').bind(who, istDay(), secs).first();
    return r ? r.secs : 0;
  } catch { return 0; }
}
export async function recordAnswers(env, rows) {   // rows: [uid, qid, chapter, ok, ms]
  if (!env.GAME_DB || !rows.length) return;
  try {
    const st = env.GAME_DB.prepare('INSERT OR IGNORE INTO quiz_hist (uid, qid, chapter, ok, ms, at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)'), now = Date.now();
    await env.GAME_DB.batch(rows.map((r) => st.bind(r[0], r[1], r[2] || 'General', r[3] ? 1 : 0, r[4] | 0, now)));
  } catch {}
}

// ---- streak: one row per account; Pro members get 2 freezes a month that each cover one missed day
function streakOf(days) {
  let t = Date.now(); if (!days.includes(istDay(t))) t -= DAY;   // today not studied yet: the streak is still alive from yesterday
  let n = 0; for (; days.includes(istDay(t)); t -= DAY) n++; return n;
}
async function touchStreak(env, uid, pro) {
  const month = istDay().slice(0, 7);
  const row = await env.GAME_DB.prepare('SELECT days, freezes, month FROM streak WHERE uid = ?1').bind(uid).first();
  let days = row ? JSON.parse(row.days) : [], freezes = row && row.month === month ? row.freezes : 2, used = null;
  const today = istDay(), y1 = istDay(Date.now() - DAY), y2 = istDay(Date.now() - 2 * DAY);
  if (!days.includes(today)) {
    if (pro && freezes > 0 && !days.includes(y1) && days.includes(y2)) { days.push(y1); freezes--; used = y1; }
    days.push(today); days = days.sort().slice(-400);
    await env.GAME_DB.prepare('INSERT OR REPLACE INTO streak (uid, days, freezes, month) VALUES (?1, ?2, ?3, ?4)').bind(uid, JSON.stringify(days), freezes, month).run();
  }
  return { streak: streakOf(days), freezes, frozen: used, days: days.slice(-35) };
}

// ---- Razorpay
const enc = new TextEncoder();
async function hmacHex(secret, msg) {
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return [...new Uint8Array(await crypto.subtle.sign('HMAC', k, enc.encode(msg)))].map((b) => b.toString(16).padStart(2, '0')).join('');
}
const same = (a, b) => { if (!a || !b || a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; };
export const _test = { hmacHex, same, streakOf };

async function activate(env, orderId, paymentId) {
  const o = await env.GAME_DB.prepare('SELECT uid, plan, status FROM pro_pay WHERE order_id = ?1').bind(orderId).first();
  if (!o) return null;
  if (o.status === 'paid') return proUntil(env, o.uid);   // verify + webhook both arrive: extend only once
  const P = PLANS[o.plan], add = P.days * DAY, cur = await proUntil(env, o.uid), curT = await teacherUntil(env, o.uid);
  // Teacher includes Pro; buying Pro on top of Teacher never shortens the teacher time
  const tUntil = P.teacher ? Math.max(Date.now(), curT) + add : curT, until = Math.max(Math.max(Date.now(), cur) + add, tUntil);
  await env.GAME_DB.batch([
    env.GAME_DB.prepare("UPDATE pro_pay SET status = 'paid', payment_id = ?2 WHERE order_id = ?1").bind(orderId, paymentId),
    env.GAME_DB.prepare('INSERT INTO pro_sub (uid, plan, until, rzp_order, rzp_payment, at, teacher_until) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7) ON CONFLICT(uid) DO UPDATE SET plan = excluded.plan, until = excluded.until, rzp_order = excluded.rzp_order, rzp_payment = excluded.rzp_payment, at = excluded.at, teacher_until = excluded.teacher_until').bind(o.uid, o.plan, until, orderId, paymentId, Date.now(), tUntil || 0),
  ]);
  return until;
}
async function launchPrice(env, uid) {
  try {
    if (uid && await env.GAME_DB.prepare("SELECT 1 FROM pro_pay WHERE uid = ?1 AND status = 'paid' LIMIT 1").bind(uid).first()) return false;
    const n = await env.GAME_DB.prepare("SELECT COUNT(*) AS n FROM pro_sub WHERE plan != 'ref'").first();
    return (n ? n.n : 0) < LAUNCH.seats;
  } catch { return false; }
}


// ---- refer-a-friend: every 5 brand-new friends who sign in through your link = 3 days of Pro
export const REF = { need: 5, days: 3, maxPer30d: 6, bonusSecs: 30 * 60 };
const RCH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
async function refCode(env, uid) {
  const r = await env.GAME_DB.prepare('SELECT code FROM ref_code WHERE uid = ?1').bind(uid).first();
  if (r) return r.code;
  for (let i = 0; i < 5; i++) {
    const b = crypto.getRandomValues(new Uint8Array(6)); const code = [...b].map((x) => RCH[x % RCH.length]).join('');
    try { await env.GAME_DB.prepare('INSERT INTO ref_code (uid, code, at) VALUES (?1, ?2, ?3)').bind(uid, code, Date.now()).run(); return code; } catch {}
  }
  return '';
}
async function refStatus(env, uid) {
  const code = await refCode(env, uid);
  const p = await env.GAME_DB.prepare('SELECT COUNT(*) AS n FROM ref_join WHERE referrer = ?1 AND rewarded = 0').bind(uid).first();
  const t = await env.GAME_DB.prepare('SELECT COUNT(*) AS n FROM ref_join WHERE referrer = ?1').bind(uid).first();
  const w = await env.GAME_DB.prepare('SELECT COUNT(*) AS n, COALESCE(SUM(days),0) AS d FROM ref_reward WHERE uid = ?1').bind(uid).first();
  return { code, link: 'https://mindgains.ai/play/theatre/?ref=' + code, pending: p ? p.n : 0, total: t ? t.n : 0, rewards: w ? w.n : 0, daysEarned: w ? w.d : 0, need: REF.need, days: REF.days };
}
async function isNewUser(env, uid) {
  const today = istDay();
  const q = [
    env.GAME_DB.prepare('SELECT 1 FROM watch_day WHERE who = ?1 AND day < ?2 LIMIT 1').bind('u:' + uid, today),
    env.GAME_DB.prepare('SELECT 1 FROM quiz_hist WHERE uid = ?1 AND at < ?2 LIMIT 1').bind(uid, Date.now() - 864e5),
    env.GAME_DB.prepare('SELECT 1 FROM pro_sub WHERE uid = ?1 LIMIT 1').bind(uid),
    env.GAME_DB.prepare('SELECT 1 FROM ref_code WHERE uid = ?1 AND at < ?2 LIMIT 1').bind(uid, Date.now() - 864e5),
  ];
  for (const s of q) { try { if (await s.first()) return false; } catch {} }
  return true;
}
async function refClaim(env, uid, code) {
  code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  if (!code) return { ok: false, why: 'code' };
  const r = await env.GAME_DB.prepare('SELECT uid FROM ref_code WHERE code = ?1').bind(code).first();
  if (!r || r.uid === uid) return { ok: false, why: 'self' };
  if (await env.GAME_DB.prepare('SELECT 1 FROM ref_join WHERE invitee = ?1').bind(uid).first()) return { ok: false, why: 'used' };
  if (!(await isNewUser(env, uid))) return { ok: false, why: 'not-new' };
  const now = Date.now(), ref = r.uid;
  await env.GAME_DB.prepare('INSERT OR IGNORE INTO ref_join (invitee, referrer, at) VALUES (?1, ?2, ?3)').bind(uid, ref, now).run();
  await addWatch(env, 'u:' + uid, -REF.bonusSecs);   // double-sided: the friend gets extra free theatre today
  const p = await env.GAME_DB.prepare('SELECT COUNT(*) AS n FROM ref_join WHERE referrer = ?1 AND rewarded = 0').bind(ref).first();
  if (p && p.n >= REF.need) {
    const recent = await env.GAME_DB.prepare('SELECT COUNT(*) AS n FROM ref_reward WHERE uid = ?1 AND at > ?2').bind(ref, now - 30 * 864e5).first();
    if (!recent || recent.n < REF.maxPer30d) {
      const ids = (await env.GAME_DB.prepare('SELECT invitee FROM ref_join WHERE referrer = ?1 AND rewarded = 0 ORDER BY at LIMIT ?2').bind(ref, REF.need).all()).results.map((x) => x.invitee);
      const cur = await env.GAME_DB.prepare('SELECT until FROM pro_sub WHERE uid = ?1').bind(ref).first();
      const until = Math.max(now, cur ? cur.until : 0) + REF.days * 864e5;
      await env.GAME_DB.batch([
        ...ids.map((i) => env.GAME_DB.prepare('UPDATE ref_join SET rewarded = 1 WHERE invitee = ?1').bind(i)),
        env.GAME_DB.prepare("INSERT INTO pro_sub (uid, plan, until, at) VALUES (?1, 'ref', ?2, ?3) ON CONFLICT(uid) DO UPDATE SET until = MAX(pro_sub.until, ?3) + ?4").bind(ref, until, now, REF.days * 864e5),
        env.GAME_DB.prepare('INSERT INTO ref_reward (uid, at, days) VALUES (?1, ?2, ?3)').bind(ref, now, REF.days),
      ]);
    }
  }
  return { ok: true };
}

export async function proRoute(request, env, pathname) {
  if (!env.GAME_DB) return J({ error: 'unavailable' }, 503);
  const ready = !!(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);

  if (pathname === '/api/pro/webhook' && request.method === 'POST') {
    const raw = await request.text();
    if (!env.RAZORPAY_WEBHOOK_SECRET || !same(await hmacHex(env.RAZORPAY_WEBHOOK_SECRET, raw), request.headers.get('x-razorpay-signature') || '')) return J({ error: 'bad signature' }, 400);
    try {
      const ev = JSON.parse(raw), p = ev.payload && ev.payload.payment && ev.payload.payment.entity;
      if ((ev.event === 'payment.captured' || ev.event === 'order.paid') && p && p.order_id) await activate(env, p.order_id, p.id);
    } catch {}
    return J({ ok: true });
  }

  const uid = await verifyUser(bearer(request));
  if (pathname === '/api/pro/ref') { if (!uid) return J({ error: 'signin' }, 401); return J(await refStatus(env, uid)); }
  if (pathname === '/api/pro/ref/claim' && request.method === 'POST') {
    if (!uid) return J({ error: 'signin' }, 401);
    let b = {}; try { b = await request.json(); } catch {}
    try { return J(await refClaim(env, uid, b.code)); } catch (e) { return J({ ok: false, why: 'err' }); }
  }
  if (pathname === '/api/pro/me') {
    const pid = String(new URL(request.url).searchParams.get('pid') || '').slice(0, 40);
    const until = await proUntil(env, uid), w = await watchedToday(env, uid ? 'u:' + uid : pid ? 'p:' + pid : '');
    let st = {}; if (uid) { try { st = await touchStreak(env, uid, !!until); } catch {} }
    const tUntil = await teacherUntil(env, uid);
    return J({ signedIn: !!uid, pro: !!until, until, teacher: !!tUntil, teacherUntil: tUntil, freeLeft: until ? null : Math.max(0, FREE_SECS - w), freeMins: FREE_SECS / 60,
      launch: await launchPrice(env, uid), ready, plans: PLANS, launchPaise: LAUNCH.paise, ...st });
  }
  if (!uid) return J({ error: 'sign in' }, 401);

  if (pathname === '/api/pro/order' && request.method === 'POST') {
    if (!ready) return J({ error: 'Payments open very soon' }, 503);
    let body = {}; try { body = await request.json(); } catch {}
    const plan = PLANS[body.plan] ? body.plan : 'month';
    const amount = plan === 'month' && (await launchPrice(env, uid)) ? LAUNCH.paise : PLANS[plan].paise;
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST', headers: { 'content-type': 'application/json', Authorization: 'Basic ' + btoa(env.RAZORPAY_KEY_ID + ':' + env.RAZORPAY_KEY_SECRET) },
      body: JSON.stringify({ amount, currency: 'INR', receipt: 'mg_' + Date.now().toString(36), notes: { uid, plan } }),
    });
    const o = await r.json().catch(() => ({}));
    if (!r.ok || !o.id) return J({ error: 'Could not start the payment, try again' }, 502);
    await env.GAME_DB.prepare("INSERT INTO pro_pay (order_id, uid, plan, amount, status, at) VALUES (?1, ?2, ?3, ?4, 'created', ?5)").bind(o.id, uid, plan, amount, Date.now()).run();
    return J({ key: env.RAZORPAY_KEY_ID, order_id: o.id, amount, plan, name: PLANS[plan].name });
  }
  if (pathname === '/api/pro/verify' && request.method === 'POST') {
    let b = {}; try { b = await request.json(); } catch {}
    const oid = String(b.razorpay_order_id || ''), pid = String(b.razorpay_payment_id || ''), sig = String(b.razorpay_signature || '');
    if (!ready || !oid || !pid || !same(await hmacHex(env.RAZORPAY_KEY_SECRET, oid + '|' + pid), sig)) return J({ error: 'Payment not verified' }, 400);
    const own = await env.GAME_DB.prepare('SELECT uid FROM pro_pay WHERE order_id = ?1').bind(oid).first();
    if (!own || own.uid !== uid) return J({ error: 'Not your order' }, 403);
    return J({ pro: true, until: await activate(env, oid, pid) });
  }
  // Pro Night Race: one weekly race (IST week, fresh every Sunday 8 PM) with an all-India and per-state board.
  // Score = verified lap time. The server hands out a one-use ticket when the race starts; the finish
  // must arrive with the lap recording, which is checked against the track: no sample may move faster
  // than a kart can physically go, the lap must be complete, and real time since the ticket must cover it.
  if (pathname === '/api/pro/night/start' && request.method === 'POST') {
    if (!(await proUntil(env, uid))) return J({ error: 'Pro only' }, 403);
    const run = crypto.randomUUID();
    await env.GAME_DB.prepare('INSERT INTO night_run (run, uid, wk, at, used) VALUES (?1, ?2, ?3, ?4, 0)').bind(run, uid, nightWeek(), Date.now()).run();
    return J({ run });
  }
  if (pathname === '/api/pro/night') {
    const wk = nightWeek(), ev = 'pro:' + wk;
    if (request.method === 'POST') {
      if (!(await proUntil(env, uid))) return J({ error: 'Pro only' }, 403);
      let b = {}; try { b = await request.json(); } catch {}
      const t = await env.GAME_DB.prepare('SELECT uid, wk, at, used FROM night_run WHERE run = ?1').bind(String(b.run || '')).first();
      if (!t || t.uid !== uid || t.used || t.wk !== wk) return J({ error: 'This run is not valid' }, 403);
      await env.GAME_DB.prepare('UPDATE night_run SET used = 1 WHERE run = ?1').bind(String(b.run)).run();
      const v = checkLap(b.rec, Date.now() - t.at);
      if (!v.ok) return J({ error: 'Run not verified', why: v.why }, 422);
      const ms = v.ms, pts = 10000000 - ms;   // faster = higher
      const name = String(b.name || 'Racer').replace(/[<>]/g, '').slice(0, 20), state = String(b.state || '').replace(/[^A-Z]/g, '').slice(0, 3);
      await env.GAME_DB.prepare(`INSERT INTO game_event (ev, uid, name, state, pts, ms, correct, wrong, skipped, grid, at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0, 0, 0, '', ?7)
        ON CONFLICT(ev, uid) DO UPDATE SET pts = excluded.pts, ms = excluded.ms, name = excluded.name, state = excluded.state, at = excluded.at WHERE excluded.pts > game_event.pts`).bind(ev, uid, name, state, pts, ms, Date.now()).run();
    }
    const top = (await env.GAME_DB.prepare('SELECT name, state, pts, ms FROM game_event WHERE ev = ?1 ORDER BY pts DESC, ms ASC LIMIT 10').bind(ev).all()).results || [];
    let me = null;
    if (uid) {
      const r = await env.GAME_DB.prepare('SELECT pts, state FROM game_event WHERE ev = ?1 AND uid = ?2').bind(ev, uid).first();
      if (r) {
        const all = await env.GAME_DB.prepare('SELECT COUNT(*) AS n FROM game_event WHERE ev = ?1 AND pts > ?2').bind(ev, r.pts).first();
        const st = r.state ? await env.GAME_DB.prepare('SELECT COUNT(*) AS n FROM game_event WHERE ev = ?1 AND state = ?2 AND pts > ?3').bind(ev, r.state, r.pts).first() : null;
        me = { pts: r.pts, rank: all.n + 1, state: r.state, stateRank: st ? st.n + 1 : null };
      }
    }
    const n = await env.GAME_DB.prepare('SELECT COUNT(*) AS n FROM game_event WHERE ev = ?1').bind(ev).first();
    return J({ week: wk, ends: nightEnds(), racers: n ? n.n : 0, top, me });
  }
  // Replay quiz (Pro): 5 questions from the episode's chapter, answers checked here and added to the report.
  if (pathname === '/api/pro/quiz' || pathname === '/api/pro/quiz/check') {
    if (!(await proUntil(env, uid))) return J({ error: 'Pro only' }, 403);
    const b = request.method === 'POST' ? await request.json().catch(() => ({})) : {};
    const set = String(b.set || new URL(request.url).searchParams.get('set') || '');
    if (!/^[a-z0-9-]+(\/[a-z0-9-]+){1,4}$/.test(set)) return J({ error: 'bad set' }, 400);
    const r = await env.ASSETS.fetch(new Request('https://assets.local/assets/quiz-data/' + set + '.json'));
    if (!r.ok) return J({ error: 'not found' }, 404);
    const qs = (await r.json()).questions || [];
    const chapter = String(CH.titles[set] || set.split('/').pop()).replace(/ Quiz$/, '');
    if (pathname === '/api/pro/quiz') {
      const pool = qs.map((q, i) => [q, i]).filter(([q]) => !q.retired && Array.isArray(q.options) && q.options.length === 4 && Number.isInteger(q.answer_index));
      for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
      const ids = pool.slice(0, 5).map(([, i]) => i), exp = Date.now() + 2 * 3600e3;
      const token = exp + '.' + await hmacHex(env.QUIZ_SECRET || 'mg', `rq|${uid}|${set}|${ids.join(',')}|${exp}`);
      return J({ set, chapter, token, ids, questions: ids.map((i) => ({ id: i, q: qs[i].question, opts: qs[i].options })) });
    }
    const ids = Array.isArray(b.ids) ? b.ids.map(Number) : [], [exp, sig] = String(b.token || '').split('.');
    if (!(+exp > Date.now()) || !same(sig, await hmacHex(env.QUIZ_SECRET || 'mg', `rq|${uid}|${set}|${ids.join(',')}|${exp}`)) || !ids.includes(+b.id)) return J({ error: 'bad token' }, 403);
    const q = qs[+b.id], ok = +b.i === q.answer_index;
    await recordAnswers(env, [[uid, `rq:${set}:${b.id}:${istDay()}`, chapter, ok, Math.min(120000, Math.max(0, b.ms | 0))]]);
    return J({ correct: q.answer_index, ok, explanation: String(q.explanation || '').slice(0, 400) });
  }
  if (pathname === '/api/pro/report') {
    const pro = !!(await proUntil(env, uid));
    const rs = await env.GAME_DB.prepare('SELECT chapter, COUNT(*) AS n, SUM(ok) AS ok, AVG(ms) AS ms FROM quiz_hist WHERE uid = ?1 AND at > ?2 GROUP BY chapter ORDER BY n DESC LIMIT 40').bind(uid, Date.now() - 90 * DAY).all();
    const ch = (rs.results || []).map((r) => ({ chapter: r.chapter, n: r.n, pct: Math.round((r.ok / r.n) * 100), s: +(r.ms / 1000).toFixed(1) }));
    const tot = ch.reduce((a, c) => a + c.n, 0), ok = ch.reduce((a, c) => a + (c.n * c.pct) / 100, 0);
    const weak = ch.filter((c) => c.n >= 2).sort((a, b) => a.pct - b.pct).slice(0, 5);
    // free accounts see their totals and their single weakest chapter; the full breakdown is Pro
    return J({ pro, total: tot, pct: tot ? Math.round((ok / tot) * 100) : 0, weak: pro ? weak : weak.slice(0, 1), chapters: pro ? ch : [], locked: pro ? 0 : Math.max(0, ch.length - 1) });
  }
  return J({ error: 'not found' }, 404);
}

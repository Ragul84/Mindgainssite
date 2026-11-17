// MindGains Pro: plans, Razorpay checkout (order -> verify / webhook), free watch allowance,
// synced streak with freezes, and the weak-chapters report. Storage: D1 GAME_DB (game-schema-007-pro.sql).
// Secrets: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET.
import { verifyUser, bearer } from './auth.js';

export const PLANS = {
  month: { name: 'Pro Monthly', paise: 9900, days: 30 },
  exam: { name: 'Exam Pass · 6 months', paise: 39900, days: 182 },
  year: { name: 'Pro Yearly', paise: 59900, days: 365 },
};
export const LAUNCH = { paise: 4900, seats: 500 };   // first month ₹49 for the first 500 Pro members
export const FREE_SECS = 30 * 60;
const DAY = 864e5;
export const istDay = (t = Date.now()) => new Date(t + 5.5 * 3600e3).toISOString().slice(0, 10);
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
  const cur = await proUntil(env, o.uid), until = Math.max(Date.now(), cur) + PLANS[o.plan].days * DAY;
  await env.GAME_DB.batch([
    env.GAME_DB.prepare("UPDATE pro_pay SET status = 'paid', payment_id = ?2 WHERE order_id = ?1").bind(orderId, paymentId),
    env.GAME_DB.prepare('INSERT OR REPLACE INTO pro_sub (uid, plan, until, rzp_order, rzp_payment, at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)').bind(o.uid, o.plan, until, orderId, paymentId, Date.now()),
  ]);
  return until;
}
async function launchPrice(env, uid) {
  try {
    if (uid && await env.GAME_DB.prepare("SELECT 1 FROM pro_pay WHERE uid = ?1 AND status = 'paid' LIMIT 1").bind(uid).first()) return false;
    const n = await env.GAME_DB.prepare('SELECT COUNT(*) AS n FROM pro_sub').first();
    return (n ? n.n : 0) < LAUNCH.seats;
  } catch { return false; }
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
  if (pathname === '/api/pro/me') {
    const pid = String(new URL(request.url).searchParams.get('pid') || '').slice(0, 40);
    const until = await proUntil(env, uid), w = await watchedToday(env, uid ? 'u:' + uid : pid ? 'p:' + pid : '');
    let st = {}; if (uid) { try { st = await touchStreak(env, uid, !!until); } catch {} }
    return J({ signedIn: !!uid, pro: !!until, until, freeLeft: until ? null : Math.max(0, FREE_SECS - w), freeMins: FREE_SECS / 60,
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

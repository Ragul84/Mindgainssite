// Teach on MindGains (mgs-teach-20261121): 30% teacher referral programme.
// Routes: /teach/, /teach/dashboard/, /teach/admin/, /t/<code>, /api/teach/*, and the footer link appended to /assets/pv.js.
// Tables (GAME_DB) are created lazily with CREATE TABLE IF NOT EXISTS (teachEnsure); see game-schema-010-teach.sql.
import { verifyUser, bearer } from './auth.js';
import { PLANS, LAUNCH } from './pro.js';
import { limited, localLimited } from './limits.js';
import { TEACH_PAGES } from './teach-pages.js';

var TEACH = { rate: 30, windowDays: 90, minPayoutPaise: 5e4, cookie: "mg_t" };
var TEACH_DAY = 864e5;
var teachReady = false;
var teachJ = (d, s = 200, extra = {}) => new Response(JSON.stringify(d), { status: s, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex", ...extra } });
var TEACH_SQL = [
  "CREATE TABLE IF NOT EXISTS teach_app (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, exam TEXT NOT NULL, channel TEXT NOT NULL DEFAULT '', audience TEXT NOT NULL DEFAULT '', note TEXT NOT NULL DEFAULT '', uid TEXT, status TEXT NOT NULL DEFAULT 'pending', code TEXT UNIQUE, claim_hash TEXT, at INTEGER NOT NULL, decided_at INTEGER)",
  "CREATE INDEX IF NOT EXISTS teach_app_status ON teach_app (status, at)",
  "CREATE INDEX IF NOT EXISTS teach_app_uid ON teach_app (uid)",
  "CREATE TABLE IF NOT EXISTS teach_ref (uid TEXT PRIMARY KEY, code TEXT NOT NULL, clicked_at INTEGER NOT NULL, at INTEGER NOT NULL)",
  "CREATE INDEX IF NOT EXISTS teach_ref_code ON teach_ref (code, at)",
  "CREATE TABLE IF NOT EXISTS teach_comm (order_id TEXT PRIMARY KEY, code TEXT NOT NULL, uid TEXT NOT NULL, plan TEXT NOT NULL, amount INTEGER NOT NULL, commission INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending', at INTEGER NOT NULL, paid_at INTEGER, payout_ref TEXT)",
  "CREATE INDEX IF NOT EXISTS teach_comm_code ON teach_comm (code, status)",
  "CREATE TABLE IF NOT EXISTS teach_click (code TEXT NOT NULL, day TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (code, day))"
];
async function teachEnsure(env) {
  if (teachReady || !env.GAME_DB) return;
  await env.GAME_DB.batch(TEACH_SQL.map((s) => env.GAME_DB.prepare(s)));
  teachReady = true;
}
var teachEnc = new TextEncoder();
async function teachSha(s) {
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", teachEnc.encode(s)))].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function teachRand(n = 18) {
  const a = crypto.getRandomValues(new Uint8Array(n));
  return btoa(String.fromCharCode(...a)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
var teachSame = (a, b) => {
  a = String(a || ""); b = String(b || "");
  if (!a || !b || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
};
var teachIstDay = (t = Date.now()) => new Date(t + 5.5 * 36e5).toISOString().slice(0, 10);
var TEACH_CODE_RE = /^[a-z0-9]{3,20}$/;
function teachCookie(request) {
  const c = request.headers.get("cookie") || "";
  const m = c.match(/(?:^|;\s*)mg_t=([a-z0-9]{3,20})\.(\d{10,14})(?:;|$)/);
  if (!m) return null;
  const at = Number(m[2]);
  if (!(at > 0) || Date.now() - at > TEACH.windowDays * TEACH_DAY || at > Date.now() + 6e4) return null;
  return { code: m[1], at };
}
async function teachAttach(env, uid, request) {
  const ck = teachCookie(request);
  if (!uid || !ck || !env.GAME_DB) return null;
  await teachEnsure(env);
  if (await env.GAME_DB.prepare("SELECT 1 FROM teach_ref WHERE uid = ?1").bind(uid).first()) return null;
  const t = await env.GAME_DB.prepare("SELECT uid FROM teach_app WHERE code = ?1 AND status = 'approved'").bind(ck.code).first();
  if (!t || t.uid === uid) return null;
  if (await env.GAME_DB.prepare("SELECT 1 FROM pro_pay WHERE uid = ?1 AND status = 'paid' LIMIT 1").bind(uid).first()) return null;
  await env.GAME_DB.prepare("INSERT OR IGNORE INTO teach_ref (uid, code, clicked_at, at) VALUES (?1, ?2, ?3, ?4)").bind(uid, ck.code, ck.at, Date.now()).run();
  return ck.code;
}
async function teachOnPaid(env, orderId) {
  if (!env.GAME_DB || !orderId) return null;
  await teachEnsure(env);
  const o = await env.GAME_DB.prepare("SELECT uid, plan, amount, status FROM pro_pay WHERE order_id = ?1").bind(orderId).first();
  if (!o || o.status !== "paid" || !(o.amount > 0)) return null;
  const r = await env.GAME_DB.prepare("SELECT code, at FROM teach_ref WHERE uid = ?1").bind(o.uid).first();
  if (!r || Date.now() - r.at > TEACH.windowDays * TEACH_DAY) return null;
  const t = await env.GAME_DB.prepare("SELECT uid FROM teach_app WHERE code = ?1 AND status = 'approved'").bind(r.code).first();
  if (!t || t.uid === o.uid) return null;
  const commission = Math.floor(o.amount * TEACH.rate / 100);
  await env.GAME_DB.prepare("INSERT OR IGNORE INTO teach_comm (order_id, code, uid, plan, amount, commission, status, at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'pending', ?7)").bind(orderId, r.code, o.uid, o.plan, o.amount, commission, Date.now()).run();
  return commission;
}
async function teachOnRefund(env, orderId) {
  if (!env.GAME_DB || !orderId) return;
  await teachEnsure(env);
  await env.GAME_DB.prepare("UPDATE teach_comm SET status = 'void' WHERE order_id = ?1 AND status = 'pending'").bind(orderId).run();
}
async function teachStats(env, code) {
  const db = env.GAME_DB;
  const [clicks, signups, paid, sums] = await Promise.all([
    db.prepare("SELECT COALESCE(SUM(n),0) AS n FROM teach_click WHERE code = ?1").bind(code).first(),
    db.prepare("SELECT COUNT(*) AS n FROM teach_ref WHERE code = ?1").bind(code).first(),
    db.prepare("SELECT COUNT(DISTINCT uid) AS n FROM teach_comm WHERE code = ?1 AND status != 'void'").bind(code).first(),
    db.prepare("SELECT COALESCE(SUM(CASE WHEN status != 'void' THEN commission END),0) AS earned, COALESCE(SUM(CASE WHEN status = 'pending' THEN commission END),0) AS pending, COALESCE(SUM(CASE WHEN status = 'paid' THEN commission END),0) AS paid, COALESCE(SUM(CASE WHEN status != 'void' THEN amount END),0) AS sales FROM teach_comm WHERE code = ?1").bind(code).first()
  ]);
  return { clicks: clicks.n, signups: signups.n, paidStudents: paid.n, salesPaise: sums.sales, earnedPaise: sums.earned, pendingPaise: sums.pending, paidOutPaise: sums.paid };
}
var teachMask = (uid) => {
  let h = 2166136261;
  for (const ch of String(uid || "")) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  return "Student #" + h.toString(36).toUpperCase().padStart(4, "0").slice(-4);
};
var teachStr = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
function teachSlug(name) {
  const s = String(name || "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g, "").slice(0, 14);
  return s.length >= 3 ? s : "teach" + s;
}
async function teachAdminOk(request, env) {
  const key = env.TEACH_ADMIN || env.THEATRE_ADMIN;
  const ip = request.headers.get("cf-connecting-ip") || "na";
  if (localLimited("tadm:" + ip, 20)) return false;
  return !!key && teachSame(request.headers.get("x-admin-key") || "", key);
}
async function teachBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
async function teachApi(request, env, pathname) {
  if (!env.GAME_DB) return teachJ({ error: "unavailable" }, 503);
  await teachEnsure(env);
  const db = env.GAME_DB, now = Date.now(), origin = new URL(request.url).origin;
  if (pathname === "/api/teach/apply") {
    if (request.method !== "POST") return teachJ({ error: "POST only" }, 405);
    const ip = request.headers.get("cf-connecting-ip") || "na";
    if (await limited(env.GAME_SUBMIT_RL, "teach:" + ip, 5)) return teachJ({ error: "Too many tries. Please wait a minute." }, 429);
    const b = await teachBody(request);
    if (b.website) return teachJ({ ok: true });
    const a = { name: teachStr(b.name, 80), email: teachStr(b.email, 120).toLowerCase(), phone: teachStr(b.phone, 20).replace(/[\s-]/g, ""), exam: teachStr(b.exam, 120), channel: teachStr(b.channel, 300), audience: teachStr(b.audience, 40), note: teachStr(b.note, 600) };
    const bad = [];
    if (a.name.length < 2) bad.push("name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email)) bad.push("email");
    if (!/^\+?\d{10,13}$/.test(a.phone)) bad.push("phone");
    if (a.exam.length < 2) bad.push("exam");
    if (a.channel && !/^https?:\/\/\S+\.\S+/i.test(a.channel)) bad.push("channel");
    if (!a.audience) bad.push("audience");
    if (bad.length) return teachJ({ error: "Please check: " + bad.join(", "), fields: bad }, 400);
    const uid = await verifyUser(bearer(request));
    const prev = await db.prepare("SELECT id, status FROM teach_app WHERE email = ?1 ORDER BY id DESC LIMIT 1").bind(a.email).first();
    if (prev && prev.status === "approved") return teachJ({ ok: true, status: "approved" });
    if (prev && prev.status === "pending") {
      await db.prepare("UPDATE teach_app SET name = ?2, phone = ?3, exam = ?4, channel = ?5, audience = ?6, note = ?7, uid = COALESCE(?8, uid), at = ?9 WHERE id = ?1").bind(prev.id, a.name, a.phone, a.exam, a.channel, a.audience, a.note, uid || null, now).run();
      return teachJ({ ok: true, status: "pending", updated: true });
    }
    await db.prepare("INSERT INTO teach_app (name, email, phone, exam, channel, audience, note, uid, status, at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'pending', ?9)").bind(a.name, a.email, a.phone, a.exam, a.channel, a.audience, a.note, uid || null, now).run();
    return teachJ({ ok: true, status: "pending" });
  }
  if (pathname === "/api/teach/attach") {
    if (request.method !== "POST") return teachJ({ error: "POST only" }, 405);
    if (!teachCookie(request)) return teachJ({ ok: true, attached: false });
    const uid = await verifyUser(bearer(request));
    if (!uid) return teachJ({ error: "signin" }, 401);
    return teachJ({ ok: true, attached: !!await teachAttach(env, uid, request) });
  }
  if (pathname === "/api/teach/me") {
    const uid = await verifyUser(bearer(request));
    if (!uid) return teachJ({ error: "signin" }, 401);
    const claim = teachStr(new URL(request.url).searchParams.get("claim"), 64);
    let t = await db.prepare("SELECT id, name, code, status, at, decided_at FROM teach_app WHERE uid = ?1 AND status = 'approved' ORDER BY id DESC LIMIT 1").bind(uid).first();
    if (!t && claim) {
      const h = await teachSha(claim);
      const c = await db.prepare("SELECT id FROM teach_app WHERE claim_hash = ?1 AND status = 'approved'").bind(h).first();
      if (c) {
        await db.prepare("UPDATE teach_app SET uid = ?2, claim_hash = NULL WHERE id = ?1").bind(c.id, uid).run();
        t = await db.prepare("SELECT id, name, code, status, at, decided_at FROM teach_app WHERE id = ?1").bind(c.id).first();
      }
    }
    if (!t) {
      const p = await db.prepare("SELECT status FROM teach_app WHERE uid = ?1 ORDER BY id DESC LIMIT 1").bind(uid).first();
      return teachJ({ teacher: false, status: p ? p.status : "none" });
    }
    const st = await teachStats(env, t.code);
    const recent = (await db.prepare("SELECT uid, plan, amount, commission, status, at FROM teach_comm WHERE code = ?1 ORDER BY at DESC LIMIT 25").bind(t.code).all()).results.map((r) => ({ student: teachMask(r.uid), plan: r.plan, amountPaise: r.amount, commissionPaise: r.commission, status: r.status, at: r.at }));
    const joins = (await db.prepare("SELECT uid, at FROM teach_ref WHERE code = ?1 ORDER BY at DESC LIMIT 25").bind(t.code).all()).results.map((r) => ({ student: teachMask(r.uid), at: r.at, windowEnds: r.at + TEACH.windowDays * TEACH_DAY }));
    return teachJ({ teacher: true, name: t.name, code: t.code, link: origin + "/t/" + t.code, approvedAt: t.decided_at, rate: TEACH.rate, windowDays: TEACH.windowDays, minPayoutPaise: TEACH.minPayoutPaise, ...st, payable: st.pendingPaise >= TEACH.minPayoutPaise, recent, joins });
  }
  if (pathname.startsWith("/api/teach/admin/")) {
    if (!await teachAdminOk(request, env)) return teachJ({ error: "forbidden" }, 403);
    const act = pathname.slice("/api/teach/admin/".length);
    if (act === "list") {
      const apps = (await db.prepare("SELECT id, name, email, phone, exam, channel, audience, note, status, code, uid IS NOT NULL AS linked, claim_hash IS NOT NULL AS claimOpen, at, decided_at FROM teach_app ORDER BY CASE status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END, at DESC LIMIT 300").all()).results;
      const teachers = [];
      for (const a of apps) if (a.status === "approved" && a.code) teachers.push({ id: a.id, name: a.name, email: a.email, phone: a.phone, code: a.code, linked: !!a.linked, ...await teachStats(env, a.code) });
      const comms = (await db.prepare("SELECT order_id, code, uid, plan, amount, commission, status, at, paid_at, payout_ref FROM teach_comm ORDER BY at DESC LIMIT 200").all()).results;
      return teachJ({ apps, teachers, comms, rate: TEACH.rate, minPayoutPaise: TEACH.minPayoutPaise, windowDays: TEACH.windowDays });
    }
    if (request.method !== "POST") return teachJ({ error: "POST only" }, 405);
    const b = await teachBody(request);
    if (act === "approve") {
      const a = await db.prepare("SELECT id, name, status, uid FROM teach_app WHERE id = ?1").bind(Number(b.id) || 0).first();
      if (!a) return teachJ({ error: "not found" }, 404);
      if (a.status === "approved") return teachJ({ error: "already approved" }, 409);
      let code = teachStr(b.code, 20).toLowerCase();
      if (code && !TEACH_CODE_RE.test(code)) return teachJ({ error: "code must be 3-20 letters or digits" }, 400);
      if (!code) {
        const base = teachSlug(a.name);
        code = base;
        for (let i = 2; await db.prepare("SELECT 1 FROM teach_app WHERE code = ?1").bind(code).first(); i++) code = base + i;
      } else if (await db.prepare("SELECT 1 FROM teach_app WHERE code = ?1").bind(code).first()) return teachJ({ error: "code taken" }, 409);
      const claim = teachRand(18);
      await db.prepare("UPDATE teach_app SET status = 'approved', code = ?2, claim_hash = ?3, decided_at = ?4 WHERE id = ?1").bind(a.id, code, await teachSha(claim), now).run();
      return teachJ({ ok: true, code, link: origin + "/t/" + code, dashboard: origin + "/teach/dashboard/", claimLink: origin + "/teach/dashboard/?claim=" + claim, linked: !!a.uid });
    }
    if (act === "reject") {
      await db.prepare("UPDATE teach_app SET status = 'rejected', decided_at = ?2 WHERE id = ?1 AND status = 'pending'").bind(Number(b.id) || 0, now).run();
      return teachJ({ ok: true });
    }
    if (act === "suspend") {
      await db.prepare("UPDATE teach_app SET status = 'suspended', decided_at = ?2 WHERE id = ?1 AND status = 'approved'").bind(Number(b.id) || 0, now).run();
      return teachJ({ ok: true });
    }
    if (act === "markpaid") {
      const code = teachStr(b.code, 20), ref = teachStr(b.payoutRef, 80);
      if (!TEACH_CODE_RE.test(code) || !ref) return teachJ({ error: "code and payoutRef required" }, 400);
      const s = await db.prepare("SELECT COALESCE(SUM(commission),0) AS p, COUNT(*) AS n FROM teach_comm WHERE code = ?1 AND status = 'pending'").bind(code).first();
      if (!s.n) return teachJ({ error: "nothing pending" }, 409);
      if (s.p < TEACH.minPayoutPaise && !b.force) return teachJ({ error: "below the payout minimum", pendingPaise: s.p }, 409);
      await db.prepare("UPDATE teach_comm SET status = 'paid', paid_at = ?2, payout_ref = ?3 WHERE code = ?1 AND status = 'pending'").bind(code, now, ref).run();
      return teachJ({ ok: true, paidPaise: s.p, rows: s.n });
    }
    if (act === "void") {
      await db.prepare("UPDATE teach_comm SET status = 'void' WHERE order_id = ?1 AND status = 'pending'").bind(teachStr(b.orderId, 80)).run();
      return teachJ({ ok: true });
    }
    return teachJ({ error: "unknown" }, 404);
  }
  return teachJ({ error: "not found" }, 404);
}
var TEACH_FOOT_JS = `
;(function(){try{if(!sessionStorage.getItem('mg_t_att')&&localStorage.getItem('mg_user')){var tok=null;for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/^sb-.+-auth-token$/.test(k)){try{tok=JSON.parse(localStorage.getItem(k)).access_token}catch(e){}}}if(tok){sessionStorage.setItem('mg_t_att','1');fetch('/api/teach/attach',{method:'POST',headers:{Authorization:'Bearer '+tok}}).catch(function(){})}}}catch(e){}try{if(document.querySelector('.mg-foot a[href="/teach/"]'))return;var ul=document.querySelector('.mg-foot nav[aria-label="Company"] ul');var a=document.createElement('a');a.href='/teach/';a.textContent='Teach on MindGains';if(ul){var li=document.createElement('li');li.appendChild(a);ul.appendChild(li);return}var l=document.querySelector('.mg-foot-legal');if(l)l.appendChild(a)}catch(e){}})();
`;
var teachHtml = (body, extra = {}) => new Response(body, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300", ...extra } });
async function teachRoute(request, env, pathname) {
  if (pathname.startsWith("/api/teach/")) return teachApi(request, env, pathname);
  if (pathname === "/assets/pv.js") {
    const r = await env.ASSETS.fetch(request);
    if (!r.ok) return r;
    const js = await r.text();
    return new Response(js + TEACH_FOOT_JS, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=3600" } });
  }
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  if (pathname === "/teach") return Response.redirect(new URL("/teach/", request.url).toString(), 301);
  if (pathname === "/teach/" || pathname === "/teach/index.html") return teachHtml(teachLanding());
  if (pathname === "/teach/dashboard" || pathname === "/teach/admin") return Response.redirect(new URL(pathname + "/", request.url).toString(), 301);
  if (pathname === "/teach/dashboard/") return teachHtml(TEACH_PAGES.dashboard, { "cache-control": "no-store", "x-robots-tag": "noindex" });
  if (pathname === "/teach/admin/") return teachHtml(TEACH_PAGES.admin, { "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" });
  const m = pathname.match(/^\/t\/([A-Za-z0-9]{3,20})\/?$/);
  if (m) {
    const code = m[1].toLowerCase(), url = new URL(request.url);
    const dest = new URL("/play/theatre/?hall=main", url.origin);
    let set = null;
    if (env.GAME_DB) {
      try {
        await teachEnsure(env);
        const ok = await env.GAME_DB.prepare("SELECT 1 FROM teach_app WHERE code = ?1 AND status = 'approved'").bind(code).first();
        if (ok) {
          await env.GAME_DB.prepare("INSERT INTO teach_click (code, day, n) VALUES (?1, ?2, 1) ON CONFLICT(code, day) DO UPDATE SET n = n + 1").bind(code, teachIstDay()).run();
          if (!teachCookie(request)) set = `${TEACH.cookie}=${code}.${Date.now()}; Max-Age=${TEACH.windowDays * 86400}; Path=/; Secure; HttpOnly; SameSite=Lax`;
          dest.searchParams.set("t", code);
        }
      } catch {
      }
    }
    const h = new Headers({ location: dest.toString(), "cache-control": "no-store", "x-robots-tag": "noindex" });
    if (set) h.append("set-cookie", set);
    return new Response(null, { status: 302, headers: h });
  }
  return null;
}
var teachLandingCache = null;
var teachRs = (p) => {
  const r = Math.floor(p / 100), ps = p % 100, s = String(r);
  const g = s.length > 3 ? s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + s.slice(-3) : s;
  return "\u20B9" + g + (ps ? "." + String(ps).padStart(2, "0") : "");
};
function teachLanding() {
  if (teachLandingCache) return teachLandingCache;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const cut = (p) => Math.floor(p * TEACH.rate / 100);
  const rows = ["month", "exam", "year"].filter((k) => PLANS[k]).map((k) => `<tr><td>${esc(PLANS[k].name)}</td><td>${teachRs(PLANS[k].paise)}</td><td>${teachRs(cut(PLANS[k].paise))}</td></tr>`).join("");
  let ex = "";
  if (typeof LAUNCH !== "undefined" && LAUNCH && LAUNCH.paise && PLANS.month && LAUNCH.paise < PLANS.month.paise) ex += `A first month bought at the ${teachRs(LAUNCH.paise)} launch price earns ${teachRs(cut(LAUNCH.paise))}. `;
  if (PLANS.exam) ex += `If 20 of your students take the ${esc(PLANS.exam.name.split(" \xB7 ")[0])}, you earn ${teachRs(20 * cut(PLANS.exam.paise))}.`;
  let card = "";
  if (PLANS.exam) card = `<aside class="t-ex" aria-label="Example payout"><span class="t-tag">Example month</span><dl><div><dt>Students who joined through your link</dt><dd>20</dd></div><div><dt>Each took the ${esc(PLANS.exam.name.split(" \xB7 ")[0])}</dt><dd>${teachRs(PLANS.exam.paise)}</dd></div><div><dt>Your 30% per student</dt><dd>${teachRs(cut(PLANS.exam.paise))}</dd></div><div class="t-ex-tot"><dt>Paid to your UPI</dt><dd>${teachRs(20 * cut(PLANS.exam.paise))}</dd></div></dl><p>An illustration of the maths, not a promise of earnings.</p></aside>`;
  teachLandingCache = TEACH_PAGES.landing.replace("{{PLAN_ROWS}}", rows).replace("{{EXAMPLE}}", ex).replace("{{EXAMPLE_CARD}}", card);
  return teachLandingCache;
}

export { TEACH, teachCookie, teachAttach, teachOnPaid, teachOnRefund, teachRoute };

import { verifyUser } from './auth.js';
import RM_PACK from './rank-mock-pack.json';
import { RM_CLIENT, RM_PAGE } from './rank-mock-assets.js';

// ==== Sunday State Rank Mock (mindgains.ai) ====
// Every Sunday 19:00 IST all students of an exam take the same timed paper at the same moment.
// One Durable Object per exam (RankMock, idFromName("rm:" + exam)). Hibernatable WebSockets; all state persisted.
// Real participants only: ranks contain only people who joined and answered. No ambient/fake entrants.
// Server paced: question k is open for qSecs, then revealed for revealSecs. Score = correct answers (no negative marks).
// Ties: lower total time wins (answer ms per question; an unanswered question counts the full window).
var RM_EXAMS = {
  "tnpsc-g4": {
    label: "TNPSC Group 4", hall: "tnpsc", weekday: 0, hhmm: "19:00", n: 25, qSecs: 30, revealSecs: 5,
    mix: { polity: 4, history: 4, geography: 3, economics: 2, science: 4, tamil: 5, maths: 3 }
  }
};
var RM_IST = 5.5 * 36e5;
var RM_KEEP_DONE_MS = 20 * 6e4;     // result stays on screens 20 min, then the next week is scheduled
function rmNextStart(cfg, now) {
  const [h, m] = cfg.hhmm.split(":").map(Number), dur = rmDuration(cfg);
  const d = new Date(now + RM_IST);
  let t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), h, m) - RM_IST;
  t += ((cfg.weekday - d.getUTCDay() + 7) % 7) * 864e5;
  while (t + dur <= now) t += 7 * 864e5;
  return t;
}
function rmDuration(cfg) { return cfg.n * (cfg.qSecs + cfg.revealSecs) * 1e3; }
// Hall quiz pause: while a Rank Mock for an exam held in this hall is about to start or running, the hall's regular
// 4-minute quiz is held back (from RM_PAUSE_PAD before the start until RM_PAUSE_PAD after the end). Weekly windows
// are computed from RM_EXAMS (no messages needed); admin test mocks push an explicit "until" to the hall instance.
var RM_PAUSE_PAD = 5 * 6e4;
// returns the time the pause ends if `at` falls inside a pause window for `hall`, else 0
function rmHallPauseUntil(hall, at, testUntil) {
  let until = testUntil && testUntil > at ? testUntil : 0;
  for (const cfg of Object.values(RM_EXAMS)) {
    if (cfg.hall !== hall) continue;
    const dur = rmDuration(cfg), s = rmNextStart(cfg, at - RM_PAUSE_PAD);   // first start whose end + pad is still ahead of `at`
    if (s - RM_PAUSE_PAD <= at && at < s + dur + RM_PAUSE_PAD) until = Math.max(until, s + dur + RM_PAUSE_PAD);
  }
  return until;
}
// tell the hall instance that an admin test mock is on (until > now) or over (until = 0). Best effort.
async function rmNotifyHall(env, hall, until) {
  try {
    if (!env || !env.THEATRE || !hall) return;
    const stub = env.THEATRE.get(env.THEATRE.idFromName(hall));
    await stub.fetch(new Request("https://x/__rmpause", { method: "POST", body: JSON.stringify({ until: until > 0 ? until : 0 }) }));
  } catch {}
}
function rmDay(t) { return new Date(t + RM_IST).toISOString().slice(0, 10); }
function rmHash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rmRng(seed) { let a = rmHash(String(seed)); return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function rmShuffle(a, rnd) { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; }
// same paper for everyone: seeded by the mock id; avoids questions used in recent real mocks when the pack allows
function rmPick(pack, mix, n, seed, used) {
  const rnd = rmRng(seed), avoid = new Set(used || []), out = [];
  for (const [sub, want] of Object.entries(mix)) {
    const pool = rmShuffle(pack[sub] || [], rnd);
    const fresh = pool.filter((q) => !avoid.has(q.h)), stale = pool.filter((q) => avoid.has(q.h));
    for (const q of fresh.concat(stale).slice(0, want)) out.push({ ...q, s: sub });
  }
  if (out.length < n) {
    const have = new Set(out.map((q) => q.h));
    const rest = rmShuffle(Object.entries(pack).flatMap(([s, l]) => l.map((q) => ({ ...q, s }))), rnd).filter((q) => !have.has(q.h));
    out.push(...rest.slice(0, n - out.length));
  }
  return rmShuffle(out, rnd).slice(0, n);
}
// standings: score desc, total time asc; identical score+time share a rank (competition ranking)
function rmStandings(P) {
  const rows = Object.entries(P).filter(([, p]) => p.a > 0).map(([k, p]) => ({ k, n: p.n, sc: p.sc, tm: p.tm, j: p.j }));
  rows.sort((x, y) => y.sc - x.sc || x.tm - y.tm || x.j - y.j);
  let r = 0;
  rows.forEach((row, i) => { if (i === 0 || row.sc !== rows[i - 1].sc || row.tm !== rows[i - 1].tm) r = i + 1; row.r = r; });
  return rows;
}
var rmTop = (rows, k = 10) => rows.slice(0, k).map((x) => ({ r: x.r, n: x.n, sc: x.sc, tm: Math.round(x.tm / 100) / 10 }));
var RM_BAD = /\b(fuck\w*|shit\w*|bitch\w*|bastard|asshole|dick|madarchod|bhenchod|chutiya|punda|sunni|otha|thevdiya)\b/gi;
var rmName = (s) => String(s || "").replace(/[<>&"'`]/g, "").replace(RM_BAD, (w) => "*".repeat(w.length)).replace(/\s+/g, " ").trim().slice(0, 20);
var rmJson = (b, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });

var RankMock = class {
  // lazy=true: created inside another Durable Object class (production reuses the THEATRE namespace); call init() first
  constructor(ctx, env, lazy) {
    this.ctx = ctx; this.env = env; this.cur = null; this.P = {}; this.last = null; this.exam = null;
    if (!lazy) ctx.blockConcurrencyWhile(() => this.init());
  }
  async init() {
    const g = await this.ctx.storage.get(["cur", "P", "last", "exam"]);
    this.cur = g.get("cur") || null; this.P = g.get("P") || {}; this.last = g.get("last") || null; this.exam = g.get("exam") || this.exam || null;
  }
  cfg() { return RM_EXAMS[this.exam] || RM_EXAMS["tnpsc-g4"]; }
  async persist() { await this.ctx.storage.put({ cur: this.cur, P: this.P, last: this.last }); }
  // make sure a mock is scheduled; roll a finished one over after RM_KEEP_DONE_MS
  async ensure(now = Date.now()) {
    const c = this.cur;
    if (c && c.phase === "done" && now >= c.doneAt + RM_KEEP_DONE_MS) await this.rollover();
    if (!this.cur) {
      const cfg = this.cfg(), at = rmNextStart(cfg, now);
      this.cur = { id: this.exam + "-" + rmDay(at), test: false, phase: "scheduled", startsAt: at, n: cfg.n, qSecs: cfg.qSecs, revealSecs: cfg.revealSecs, k: -1 };
      this.P = {};
      await this.persist();
    }
    const want = this.nextAlarm();
    const have = await this.ctx.storage.getAlarm();
    if (want && have !== want) await this.ctx.storage.setAlarm(want);
  }
  nextAlarm() {
    const c = this.cur; if (!c) return null;
    if (c.phase === "scheduled") return c.startsAt;
    if (c.phase === "q") return c.qEnds + 250;
    if (c.phase === "rev") return c.revEnds;
    if (c.phase === "done") return c.doneAt + RM_KEEP_DONE_MS;
    return null;
  }
  async delPrefix(prefix) {
    for (let guard = 0; guard < 400; guard++) {
      const keys = [...(await this.ctx.storage.list({ prefix, limit: 1000 })).keys()];
      if (!keys.length) return;
      for (let i = 0; i < keys.length; i += 128) await this.ctx.storage.delete(keys.slice(i, i + 128));
    }
  }
  async rollover() {
    const c = this.cur;
    if (c && c.phase === "done") {
      if (!c.test) {
        const used = (await this.ctx.storage.get("used")) || [];
        await this.ctx.storage.put("used", used.concat((c.qs || []).map((q) => q.h)).slice(-400));
      }
      await this.ctx.storage.put("hist:" + c.id, { id: c.id, test: !!c.test, at: c.startsAt, of: c.of || 0, top: c.top || [] });
    }
    await this.ctx.storage.delete(["cur", "P"]);
    await this.delPrefix("a:"); await this.delPrefix("reg:");
    this.cur = null; this.P = {}; this.rows = null;
    // a weekly mock that was parked by an admin test comes back if it is still ahead
    const sv = await this.ctx.storage.get("saved");
    if (sv) { await this.ctx.storage.delete("saved"); if (sv.startsAt > Date.now()) { this.cur = sv; await this.persist(); } }
  }
  status() {
    const c = this.cur, cfg = this.cfg();
    return {
      exam: this.exam, label: cfg.label, hall: cfg.hall, weekly: { weekday: cfg.weekday, hhmm: cfg.hhmm, tz: "Asia/Kolkata" },
      mock: c && { id: c.id, test: !!c.test, phase: c.phase, startsAt: c.startsAt, n: c.n, qSecs: c.qSecs, revealSecs: c.revealSecs, k: c.k, endsAt: c.startsAt + c.n * (c.qSecs + c.revealSecs) * 1e3, of: c.of || 0, top: c.phase === "done" ? c.top : c.live, regs: c.regs || 0, players: Object.keys(this.P).length },
      last: this.last, now: Date.now()
    };
  }
  peers() { return this.ctx.getWebSockets().map((ws) => ({ ws, a: ws.deserializeAttachment() || {} })); }
  send(ws, m) { try { ws.send(JSON.stringify(m)); } catch {} }
  all(m) { const s = JSON.stringify(m); for (const ws of this.ctx.getWebSockets()) { try { ws.send(s); } catch {} } }
  qMsg() { const c = this.cur, q = c.qs[c.k]; return { t: "mq", id: c.id, k: c.k, n: c.n, s: q.s, q: q.q, o: q.o, ends: c.qEnds, start: c.qStart, qSecs: c.qSecs }; }
  meFor(key) {
    if (!key || !this.P[key]) return { joined: false };
    const p = this.P[key], rows = this.rows || rmStandings(this.P), row = rows.find((x) => x.k === key);
    return { joined: true, name: p.n, sc: p.sc, a: p.a, tm: p.tm, rank: row ? row.r : 0, of: rows.length, ans: p.ans };
  }
  async fetch(request) {
    const url = new URL(request.url), exam = url.searchParams.get("exam");
    if (exam && RM_EXAMS[exam] && this.exam !== exam) { this.exam = exam; await this.ctx.storage.put("exam", exam); }
    if (!this.exam) return rmJson({ error: "exam" }, 400);
    await this.ensure();
    const op = url.searchParams.get("op");
    if (request.headers.get("Upgrade") === "websocket") {
      const [client, server] = Object.values(new WebSocketPair());
      this.ctx.acceptWebSocket(server);
      server.serializeAttachment({ key: null, name: "" });
      return new Response(null, { status: 101, webSocket: client });
    }
    if (op === "status") return rmJson(this.status());
    if (op === "register" && request.method === "POST") {
      let b = {}; try { b = await request.json(); } catch {}
      const key = await this.identify(b), name = rmName(b.name);
      if (!key || name.length < 2) return rmJson({ error: "name" }, 400);
      const c = this.cur; if (!c || c.phase === "done") return rmJson({ error: "closed" }, 409);
      const rk = "reg:" + c.id + ":" + key;
      if (!(await this.ctx.storage.get(rk))) { await this.ctx.storage.put(rk, { n: name, at: Date.now() }); c.regs = (c.regs || 0) + 1; await this.ctx.storage.put("cur", c); }
      return rmJson({ ok: true, id: c.id, regs: c.regs, startsAt: c.startsAt });
    }
    if (op === "result") {
      const key = await this.identify({ pid: url.searchParams.get("pid") });
      const c = this.cur; if (!c) return rmJson({ error: "none" }, 404);
      return rmJson({ id: c.id, test: !!c.test, phase: c.phase, me: this.meFor(key), top: c.top || rmTop(rmStandings(this.P)) });
    }
    if (op === "admin") {
      const want = this.env.MOCK_ADMIN || this.env.THEATRE_ADMIN, got = request.headers.get("x-mock-admin") || "";
      if (!want || got.length !== want.length || got !== want) return rmJson({ error: "forbidden" }, 403);
      let b = {}; try { b = await request.json(); } catch {}
      if (b.action === "start") return rmJson(await this.startTest(b));
      if (b.action === "stop") { if (this.cur && this.cur.test) { this.cur.phase = "done"; this.cur.doneAt = Date.now() - RM_KEEP_DONE_MS; await this.rollover(); await this.ensure(); this.all({ t: "mreset" }); await rmNotifyHall(this.env, this.cfg().hall, 0); } return rmJson({ ok: true, status: this.status() }); }
      return rmJson({ error: "action" }, 400);
    }
    return rmJson({ error: "op" }, 404);
  }
  // admin/test: run a short mock now (does not touch the weekly schedule; the weekly mock resumes after)
  async startTest(b) {
    const cfg = this.cfg(), now = Date.now();
    if (this.cur && (this.cur.phase === "q" || this.cur.phase === "rev") && !this.cur.test) return { error: "a real mock is running" };
    const park = this.cur && this.cur.phase === "scheduled" && !this.cur.test ? this.cur : null;
    const n = Math.max(1, Math.min(cfg.n, b.n | 0 || 5)), qSecs = Math.max(3, Math.min(60, b.qSecs | 0 || 10)), revealSecs = Math.max(1, Math.min(10, b.revealSecs | 0 || 3)), lobby = Math.max(2, Math.min(600, b.lobbySecs | 0 || 20));
    if (this.cur && this.cur.phase === "done" && !this.cur.test) await this.rollover();
    await this.delPrefix("a:");
    this.cur = { id: "test-" + this.exam + "-" + now.toString(36), test: true, phase: "scheduled", startsAt: now + lobby * 1e3, n, qSecs, revealSecs, k: -1, regs: 0 };
    this.P = {}; this.rows = null;
    if (park) await this.ctx.storage.put("saved", park);
    await this.persist(); await this.ctx.storage.setAlarm(this.cur.startsAt);
    this.all({ t: "mstate", ...this.status() });
    await rmNotifyHall(this.env, cfg.hall, this.cur.startsAt + n * (qSecs + revealSecs) * 1e3 + RM_PAUSE_PAD);
    return { ok: true, status: this.status() };
  }
  async identify(b) {
    let uid = null;
    if (b && b.token && typeof RM_VERIFY === "function") uid = await RM_VERIFY(String(b.token));
    if (uid) return "u:" + uid.slice(0, 40);
    const pid = String((b && b.pid) || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 48);
    return pid.length >= 6 ? "p:" + pid : null;
  }
  async webSocketMessage(ws, raw) {
    let m; try { m = JSON.parse(raw); } catch { return; }
    const a = ws.deserializeAttachment() || {};
    if (m.t === "hello") {
      a.key = await this.identify(m); a.name = rmName(m.name);
      ws.serializeAttachment(a);
      const c = this.cur;
      this.send(ws, { t: "mstate", ...this.status(), me: this.meFor(a.key), q: c && c.phase === "q" ? this.qMsg() : null });
    } else if (m.t === "join") {
      const c = this.cur, name = rmName(m.name) || a.name;
      if (!a.key) return this.send(ws, { t: "merr", why: "id" });
      if (!c || c.phase === "done") return this.send(ws, { t: "merr", why: "closed" });
      if (name.length < 2) return this.send(ws, { t: "merr", why: "name" });
      a.name = name; ws.serializeAttachment(a);
      if (!this.P[a.key]) {
        // a late joiner gets the full window for every question already asked
        const missed = Math.max(0, c.phase === "q" ? c.k : c.k + 1);
        this.P[a.key] = { n: name, j: Date.now(), sc: 0, a: 0, tm: missed * c.qSecs * 1e3, ans: ".".repeat(missed) };
        await this.ctx.storage.put("P", this.P);
      } else this.P[a.key].n = name;
      this.send(ws, { t: "mjoined", id: c.id, me: this.meFor(a.key), q: c.phase === "q" ? this.qMsg() : null });
    } else if (m.t === "ans") {
      const c = this.cur, now = Date.now();
      if (!c || c.phase !== "q" || m.id !== c.id || m.k !== c.k || !a.key || !this.P[a.key]) return;
      if (now > c.qEnds + 400) return this.send(ws, { t: "mlate", k: c.k });
      const i = Number(m.i); if (!Number.isInteger(i) || i < 0 || i > 3) return;
      const ak = "a:" + c.id + ":" + c.k + ":" + a.key;
      if (await this.ctx.storage.get(ak)) return;
      const ms = Math.max(0, Math.min(c.qSecs * 1e3, now - c.qStart));
      await this.ctx.storage.put(ak, { i, ms });
      this.send(ws, { t: "mlocked", k: c.k, i });
    }
  }
  async webSocketClose(ws) { try { ws.close(); } catch {} }
  async webSocketError() {}
  async alarm() {
    const c = this.cur, now = Date.now();
    if (!c) return this.ensure(now);
    if (c.phase === "scheduled" && now >= c.startsAt - 300) {
      const cfg = this.cfg(), used = c.test ? [] : ((await this.ctx.storage.get("used")) || []);
      c.qs = rmPick(RM_PACK, cfg.mix, c.n, c.id, used);
      c.n = c.qs.length;
      await this.openQ(0);
    } else if (c.phase === "q" && now >= c.qEnds) {
      await this.reveal();
    } else if (c.phase === "rev" && now >= c.revEnds - 50) {
      if (c.k + 1 < c.n) await this.openQ(c.k + 1); else await this.finish();
    } else if (c.phase === "done" && now >= c.doneAt + RM_KEEP_DONE_MS) {
      await this.rollover();
      await this.ensure(now); this.all({ t: "mstate", ...this.status() }); return;
    }
    const want = this.nextAlarm(); if (want) await this.ctx.storage.setAlarm(Math.max(want, Date.now() + 50));
  }
  async openQ(k) {
    const c = this.cur, now = Date.now();
    c.k = k; c.phase = "q"; c.qStart = now; c.qEnds = now + c.qSecs * 1e3;
    await this.ctx.storage.put("cur", c);
    this.all(this.qMsg());
  }
  async reveal() {
    const c = this.cur, q = c.qs[c.k], got = await this.ctx.storage.list({ prefix: "a:" + c.id + ":" + c.k + ":" });
    const byKey = new Map(); for (const [k, v] of got) byKey.set(k.slice(("a:" + c.id + ":" + c.k + ":").length), v);
    let right = 0, n = 0;
    for (const [key, p] of Object.entries(this.P)) {
      const v = byKey.get(key);
      if (p.ans.length > c.k) continue;            // already counted (resume safety)
      if (v) { n++; p.a++; p.tm += v.ms; p.ans += String(v.i); if (v.i === q.a) { p.sc++; right++; } }
      else { p.tm += c.qSecs * 1e3; p.ans += "."; }
    }
    c.phase = "rev"; c.revEnds = Date.now() + c.revealSecs * 1e3;
    const rows = this.rows = rmStandings(this.P);
    c.of = rows.length; c.live = rmTop(rows);
    await this.persist();
    this.all({ t: "mrev", id: c.id, k: c.k, n: c.n, a: q.a, e: (q.e || "").slice(0, 220), pct: n ? Math.round(right / n * 100) : 0, answered: n, of: rows.length, top: c.live, next: c.k + 1 < c.n ? c.revEnds : null });
    this.sendMe(rows, false);
  }
  sendMe(rows, final) {
    const pos = new Map(rows.map((x) => [x.k, x]));
    for (const { ws, a } of this.peers()) {
      const p = a.key && this.P[a.key]; if (!p) continue;
      const row = pos.get(a.key);
      this.send(ws, { t: "mme", id: this.cur.id, final, rank: row ? row.r : 0, of: rows.length, sc: p.sc, a: p.a, n: this.cur.n, k: this.cur.k, tm: Math.round(p.tm / 100) / 10, ans: p.ans, name: p.n });
    }
  }
  async finish() {
    const c = this.cur, rows = this.rows = rmStandings(this.P);
    c.phase = "done"; c.doneAt = Date.now(); c.of = rows.length; c.top = rmTop(rows); c.key = c.qs.map((q) => q.a).join("");
    if (!c.test) this.last = { id: c.id, at: c.startsAt, of: c.of, top: c.top };
    await this.persist();
    this.all({ t: "mfinal", id: c.id, test: !!c.test, label: this.cfg().label, of: rows.length, n: c.n, top: c.top, at: c.startsAt });
    this.sendMe(rows, true);
  }
};
// routes: /api/mock/<exam>/{status,register,result,admin,ws} and /api/mock/client.js
async function rmRoute(request, env, pathname) {
  if (pathname === "/api/mock/client.js") return new Response(RM_CLIENT, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=300" } });
  const m = pathname.match(/^\/api\/mock\/([a-z0-9-]{2,24})\/(status|register|result|admin|ws)$/);
  if (!m || !RM_EXAMS[m[1]]) return rmJson({ error: "not found" }, 404);
  if (m[2] === "ws" && request.headers.get("Upgrade") !== "websocket") return new Response("websocket only", { status: 426 });
  if ((m[2] === "register" || m[2] === "admin") && request.method !== "POST") return rmJson({ error: "POST" }, 405);
  const u = new URL(request.url); u.searchParams.set("exam", m[1]); u.searchParams.set("rmexam", m[1]); if (m[2] !== "ws") u.searchParams.set("op", m[2]);
  // preview: its own RANKMOCK namespace. production: a dedicated instance in the existing THEATRE namespace (no new class)
  const NS = env.RANKMOCK || env.THEATRE;
  const stub = NS.get(NS.idFromName("rankmock:" + m[1]));
  return stub.fetch(new Request(u.toString(), request));
}
// theatre HTML: add the small entry (existing .ttbtn style), the screen hook, and the client script. Anchor-checked.
function rmPatchTheatre(html) {
  if (html.includes('id="rmEntry"')) return html;
  const A1 = "RACE TODAY'S SUBJECT ›</a>";
  if (html.includes(A1)) html = html.replace(A1, A1 + ' <a class="ttbtn" id="rmEntry" href="/play/theatre/mock/" title="Sunday State Rank Mock" style="display:table;margin-top:6px;text-decoration:none;white-space:nowrap" hidden>SUN 7 PM RANK MOCK ›</a>');
  const A2 = "window.__room = { RM, roomOn, applyPlay, batchHub, addVideo, askQuiz, invite, members, roomQuiz };";
  if (html.includes(A2)) html = html.replace(A2, A2 + "\ntry { window.__mgMock = { THREE, screen, SW, SH, hall: () => hall, mine: () => mine, pro: () => PRO, streak: () => streak, pid: () => { try { return getPlayerId(); } catch (e) { return ''; } }, name: () => myName, token: async () => { try { return await account.accessToken(); } catch (e) { return ''; } }, flash: (t) => flashCard(t) }; dispatchEvent(new Event('mg:theatre')); } catch (e) {}");
  const A3 = "</body>";
  const i = html.lastIndexOf(A3);
  if (i > 0) html = html.slice(0, i) + '<script src="/api/mock/client.js" defer></script>' + html.slice(i);
  return html;
}
// wrap the site's default export: mock routes + theatre HTML patch; everything else untouched
function rmWrap(base) {
  return {
    ...base,
    async fetch(request, env, ctx) {
      const { pathname } = new URL(request.url);
      if (pathname.startsWith("/api/mock/")) return rmRoute(request, env, pathname);
      if (pathname === "/play/theatre/mock" || pathname === "/play/theatre/mock/") return new Response(RM_PAGE, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
      const res = await base.fetch(request, env, ctx);
      if ((pathname === "/play/theatre/" || pathname === "/play/theatre/index.html") && res.status === 200 && (res.headers.get("content-type") || "").includes("text/html")) {
        const h = new Headers(res.headers); h.delete("content-length"); h.delete("etag");
        return new Response(rmPatchTheatre(await res.text()), { status: 200, headers: h });
      }
      return res;
    }
  };
}
// Production only: no new Durable Object class or migration. Mock instances live in the existing THEATRE namespace
// under their own names ("rankmock:<exam>"); TheatreHall delegates to RankMock only on those instances, which are
// marked in their own storage ("rm:exam"). The live halls ("main", "tnpsc") never take this path.
var RM_VERIFY = typeof verifyUser === "function" ? verifyUser : null;
function rmDelegate(Cls) {
  const P = Cls.prototype;
  if (P.__rmDelegated) return; P.__rmDelegated = true;
  const orig = { fetch: P.fetch, webSocketMessage: P.webSocketMessage, webSocketClose: P.webSocketClose, webSocketError: P.webSocketError, alarm: P.alarm };
  async function impl(self, request) {
    if (self.__rm === undefined) {
      let exam = await self.ctx.storage.get("rm:exam");
      const ex = request ? new URL(request.url).searchParams.get("rmexam") : null;
      if (!exam && ex && RM_EXAMS[ex] && !new URL(request.url).searchParams.get("hall")) { exam = ex; await self.ctx.storage.put("rm:exam", ex); }
      if (exam) { const r = new RankMock(self.ctx, self.env, true); r.exam = exam; await r.init(); r.exam = r.exam || exam; self.__rm = r; } else self.__rm = null;
    }
    return self.__rm;
  }
  P.fetch = async function (request) { const r = await impl(this, request); return r ? r.fetch(request) : orig.fetch.call(this, request); };
  P.webSocketMessage = async function (ws, m) { const r = await impl(this); return r ? r.webSocketMessage(ws, m) : orig.webSocketMessage.call(this, ws, m); };
  P.webSocketClose = async function (ws, ...a) { const r = await impl(this); return r ? r.webSocketClose(ws, ...a) : orig.webSocketClose.call(this, ws, ...a); };
  P.webSocketError = async function (ws, e) { const r = await impl(this); return r ? r.webSocketError(ws, e) : orig.webSocketError.call(this, ws, e); };
  P.alarm = async function (...a) { const r = await impl(this); return r ? r.alarm(...a) : orig.alarm.call(this, ...a); };
}
export { RM_EXAMS, RankMock, rmRoute, rmPatchTheatre, rmWrap, rmDelegate, rmHallPauseUntil, rmNextStart, rmDuration, rmPick, RM_PAUSE_PAD };

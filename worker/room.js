// MindGains Batch rooms: a private copy of the theatre for a group of friends, a class or a tuition batch.
// The owner (Pro) and teachers put their own YouTube videos on the screen, pause/seek for everyone and
// ask quizzes. While a quiz is open, chat is locked until everyone answers or the teacher resumes.
// HTTP: POST /api/room/create {name}  GET /api/room/mine  GET /api/room/info?code=  WS /api/room/<code>/ws
// WS client -> hello{token,name,look,tk?} sit{seat} chat{text} ans{qid,i} tick
//              (host/teacher) video{v,title} play pause{pos} seek{pos} quiz{q,opts,correct} resume teacher{uid} kick{uid}
// WS server -> state, play, seats, chat, quiz, qprog, reveal, lock, role, err
import { DurableObject } from 'cloudflare:workers';
import { verifyUser, bearer } from './auth.js';
import { proUntil, addWatch, watchedToday, recordAnswers, FREE_SECS, istDay } from './pro.js';

const MAX_MEMBERS = 30;
const SEAT_RE = /^[A-L]([1-9]|1[0-8])$/;
const BAD = /\b(fuck\w*|shit\w*|bitch\w*|bastard|asshole|dick|madarchod|bhenchod|chutiya|punda|sunni|otha|thevdiya)\b/gi;
const clean = (s, n) => String(s || '').replace(/[<>]/g, '').trim().slice(0, n);
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const CODE_RE = /^[A-Z0-9]{6}$/;
const weekKey = (t = Date.now()) => { const d = new Date(t + 5.5 * 3600e3); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d.toISOString().slice(0, 10); };
export const ytId = (u) => { u = String(u || '').trim(); if (/^[\w-]{11}$/.test(u)) return u;
  const m = u.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/); return m ? m[1] : null; };

async function streakOf(env, code) {   // consecutive days on which every member who came to the room studied 10+ min there
  const db = env.GAME_DB; if (!db) return 0;
  const rows = (await db.prepare('SELECT s.day, COUNT(*) seen, SUM(CASE WHEN d.uid IS NOT NULL THEN 1 ELSE 0 END) done FROM room_seen s LEFT JOIN room_day d ON d.code = s.code AND d.day = s.day AND d.uid = s.uid WHERE s.code=? GROUP BY s.day ORDER BY s.day DESC LIMIT 400').bind(code).all()).results || [];
  const ok = new Set(rows.filter((r) => r.seen > 0 && r.done >= r.seen).map((r) => r.day));
  let s = 0, t = Date.now(); if (!ok.has(istDay(t))) t -= 864e5;
  while (ok.has(istDay(t))) { s++; t -= 864e5; }
  return s;
}
async function weekRank(env, code) {
  const db = env.GAME_DB, wk = weekKey(); if (!db) return null;
  const me = (await db.prepare('SELECT pts FROM room_week WHERE code=? AND wk=?').bind(code, wk).first())?.pts || 0;
  const above = (await db.prepare('SELECT COUNT(*) c FROM room_week WHERE wk=? AND pts>?').bind(wk, me).first())?.c || 0;
  const of = (await db.prepare('SELECT COUNT(*) c FROM room_week WHERE wk=? AND pts>0').bind(wk).first())?.c || 0;
  return { pts: me, rank: me > 0 ? above + 1 : 0, of };
}

export class StudyRoom extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      const s = await ctx.storage.get(['meta', 'play', 'list', 'quiz', 'chat', 'teachers']);
      this.meta = s.get('meta') || null; this.play = s.get('play') || { v: '', pos: 0, playing: false, at: Date.now() };
      this.list = s.get('list') || []; this.quiz = s.get('quiz') || null; this.chat = s.get('chat') || []; this.teachers = s.get('teachers') || [];
    });
  }
  peers() { return this.ctx.getWebSockets().map((ws) => ({ ws, a: ws.deserializeAttachment() || {} })); }
  send(ws, m) { try { ws.send(JSON.stringify(m)); } catch {} }
  all(m) { const s = JSON.stringify(m); for (const ws of this.ctx.getWebSockets()) { try { ws.send(s); } catch {} } }
  seats() { const m = {}, l = {}, p = []; for (const { a } of this.peers()) if (a.seat && a.uid) { m[a.seat] = a.name; if (a.look) l[a.seat] = a.look; if (a.pro) p.push(a.seat); } return { seats: m, looks: l, pros: p }; }
  online() { return new Set(this.peers().filter((p) => p.a.uid).map((p) => p.a.uid)).size; }
  broadcastSeats() { this.all({ t: 'seats', count: this.online(), ...this.seats() }); }
  pos() { const P = this.play; return P.playing ? P.pos + (Date.now() - P.at) / 1000 : P.pos; }
  playMsg() { return { t: 'play', v: this.play.v, title: this.play.title || '', pos: this.pos(), playing: this.play.playing, by: this.play.playing ? '' : (this.play.by || ''), list: this.list }; }
  async setPlay(p) { this.play = { ...this.play, ...p, at: Date.now() }; await this.ctx.storage.put('play', this.play); this.all(this.playMsg()); }
  role(a) { return !a.uid ? 'guest' : a.uid === this.meta.owner ? 'owner' : this.teachers.includes(a.uid) ? 'teacher' : 'member'; }
  quizPublic() { const Q = this.quiz; return Q && !Q.revealed ? { qid: Q.qid, q: Q.q, opts: Q.opts, by: Q.by, n: Object.keys(Q.answers).length, of: this.online() } : null; }

  async fetch(request) {
    if (request.headers.get('Upgrade') !== 'websocket') return new Response('websocket only', { status: 426 });
    const code = new URL(request.url).searchParams.get('code');
    if (!this.meta) {
      const r = this.env.GAME_DB && await this.env.GAME_DB.prepare('SELECT code, name, owner, tkey FROM room WHERE code=?').bind(code).first();
      if (!r) return new Response('no such room', { status: 404 });
      this.meta = r; await this.ctx.storage.put('meta', r);
    }
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ id: crypto.randomUUID().slice(0, 8), name: 'Guest', seat: null });
    return new Response(null, { status: 101, webSocket: client });
  }

  async ownerPro() { const now = Date.now(); if (this._op && now - this._op.at < 6e5) return this._op.v; const v = !!(await proUntil(this.env, this.meta.owner)); this._op = { at: now, v }; return v; }

  async webSocketMessage(ws, raw) {
    let m; try { m = JSON.parse(raw); } catch { return; }
    const a = ws.deserializeAttachment() || {}, M = this.meta, db = this.env.GAME_DB;
    if (m.t === 'hello') {
      const uid = m.token ? await verifyUser(String(m.token)) : null;
      if (!uid) return this.send(ws, { t: 'err', why: 'signin' });
      a.uid = uid; a.name = clean(m.name, 20) || 'Friend';
      if (Array.isArray(m.look)) a.look = [Math.max(0, Math.min(9, m.look[0] | 0)), Math.max(0, Math.min(9, m.look[1] | 0))];
      a.pro = !!(await proUntil(this.env, uid));
      // membership: join on first visit (room cap), teacher link promotes
      const mem = await db.prepare('SELECT role FROM room_member WHERE code=? AND uid=?').bind(M.code, uid).first();
      if (!mem && uid !== M.owner) {
        const n = (await db.prepare('SELECT COUNT(*) c FROM room_member WHERE code=?').bind(M.code).first())?.c || 0;
        if (n >= MAX_MEMBERS) return this.send(ws, { t: 'err', why: 'full' });
        if (await db.prepare('SELECT 1 FROM room_member WHERE code=? AND uid=? AND role=?').bind(M.code, uid, 'kicked').first()) return this.send(ws, { t: 'err', why: 'removed' });
        await db.prepare('INSERT OR IGNORE INTO room_member (code, uid, name, role, joined) VALUES (?,?,?,?,?)').bind(M.code, uid, a.name, 'member', Date.now()).run();
      } else if (mem && mem.role === 'kicked') return this.send(ws, { t: 'err', why: 'removed' });
      else await db.prepare('UPDATE room_member SET name=? WHERE code=? AND uid=?').bind(a.name, M.code, uid).run();
      if (m.tk && m.tk === M.tkey && !this.teachers.includes(uid) && uid !== M.owner) { this.teachers.push(uid); await this.ctx.storage.put('teachers', this.teachers); await db.prepare('UPDATE room_member SET role=? WHERE code=? AND uid=?').bind('teacher', M.code, uid).run(); }
      a.role = this.role(a); ws.serializeAttachment(a);
      this.ctx.waitUntil(db.prepare('INSERT OR IGNORE INTO room_seen (code, day, uid) VALUES (?,?,?)').bind(M.code, istDay(), uid).run());
      const op = await this.ownerPro();
      const w = a.pro || op ? 0 : await watchedToday(this.env, 'u:' + uid);
      this.send(ws, { t: 'state', me: a.id, role: a.role, room: { code: M.code, name: M.name, ownerPro: op, ...(a.role === 'owner' ? { tkey: M.tkey } : {}) },
        count: this.online(), ...this.seats(), chat: this.chat.slice(-50), quiz: this.quizPublic(), locked: !!this.quizPublic(), streak: await streakOf(this.env, M.code), week: await weekRank(this.env, M.code) });
      this.send(ws, this.playMsg());
      this.send(ws, { t: 'pro', pro: a.pro, signedIn: true, freeLeft: a.pro || op ? null : Math.max(0, FREE_SECS - w) });
      if (!a.pro && !op && w >= FREE_SECS) this.send(ws, { t: 'wall' });
      this.broadcastSeats();
      return;
    }
    if (!a.uid) return this.send(ws, { t: 'err', why: 'signin' });
    const boss = a.role === 'owner' || a.role === 'teacher';
    if (m.t === 'tick') {
      const now = Date.now(); if (now - (a.lt || 0) < 25000) return; a.lt = now; a.secs = (a.secs || 0) + 30; ws.serializeAttachment(a);
      if (a.secs === 600) this.ctx.waitUntil(db.prepare('INSERT OR IGNORE INTO room_day (code, day, uid) VALUES (?,?,?)').bind(M.code, istDay(), a.uid).run());
      if (a.pro || await this.ownerPro()) return;   // a Pro owner's room is free for the whole batch
      const w = await addWatch(this.env, 'u:' + a.uid, 30), left = Math.max(0, FREE_SECS - w);
      this.send(ws, { t: 'free', left }); if (!left) this.send(ws, { t: 'wall' });
    } else if (m.t === 'sit') {
      const seat = String(m.seat || ''); if (!SEAT_RE.test(seat)) return;
      if (this.peers().some((p) => p.ws !== ws && p.a.seat === seat)) return this.send(ws, { t: 'taken', seat });
      a.seat = seat; ws.serializeAttachment(a); this.broadcastSeats();
    } else if (m.t === 'chat') {
      if (this.quizPublic() && !boss) return this.send(ws, { t: 'slow', why: 'Chat is paused for the quiz' });
      const now = Date.now(); if (!boss && now - (a.lc || 0) < 3000) return this.send(ws, { t: 'slow', wait: 3000 - (now - (a.lc || 0)) });
      let text = clean(m.text, 240).replace(/\s+/g, ' '); if (!text) return;
      text = text.replace(BAD, (w) => '*'.repeat(w.length));
      a.lc = now; ws.serializeAttachment(a);
      const re = m.re && m.re.name ? { name: clean(m.re.name, 20), text: clean(m.re.text, 60) } : null;
      const msg = { name: a.name, seat: a.seat, text, at: now, ...(re ? { re } : {}), ...(a.role === 'teacher' ? { teacher: 1 } : a.role === 'owner' ? { owner: 1 } : a.pro ? { pro: 1 } : {}) };
      this.chat.push(msg); if (this.chat.length > 80) this.chat = this.chat.slice(-80);
      this.all({ t: 'chat', m: msg }); await this.ctx.storage.put('chat', this.chat);
    } else if (m.t === 'ans') {
      const Q = this.quiz; if (!Q || Q.revealed || m.qid !== Q.qid || Q.answers[a.uid]) return;
      const i = Number(m.i); if (!Number.isInteger(i) || i < 0 || i >= Q.opts.length) return;
      Q.answers[a.uid] = { i, ms: Date.now() - Q.start, name: a.name }; await this.ctx.storage.put('quiz', Q);
      const n = Object.keys(Q.answers).length, of = new Set(this.peers().filter((p) => p.a.uid && p.a.role !== 'owner' && p.a.role !== 'teacher').map((p) => p.a.uid)).size;
      this.all({ t: 'qprog', qid: Q.qid, n, of });
      if (of && n >= of) await this.reveal();
    } else if (!boss) {
      return;
    } else if (m.t === 'video') {
      const v = ytId(m.v); if (!v) return this.send(ws, { t: 'err', why: 'link' });
      const title = clean(m.title, 80) || 'Video';
      if (!this.list.some((x) => x.v === v)) { this.list.push({ v, title }); if (this.list.length > 40) this.list.shift(); await this.ctx.storage.put('list', this.list); }
      await this.setPlay({ v, title, pos: Math.max(0, +m.pos || 0), playing: true });
    } else if (m.t === 'unlist') {
      this.list = this.list.filter((x) => x.v !== m.v); await this.ctx.storage.put('list', this.list); this.all(this.playMsg());
    } else if (m.t === 'play') {
      if (this.quizPublic()) return this.send(ws, { t: 'slow', why: 'Close the quiz first' });
      if (this.play.v) await this.setPlay({ pos: this.pos(), playing: true });
    } else if (m.t === 'pause') {
      await this.setPlay({ pos: Number.isFinite(+m.pos) ? Math.max(0, +m.pos) : this.pos(), playing: false, by: a.name });
    } else if (m.t === 'seek') {
      await this.setPlay({ pos: Math.max(0, +m.pos || 0) });
    } else if (m.t === 'quiz') {
      const q = clean(m.q, 300), opts = (Array.isArray(m.opts) ? m.opts : []).map((x) => clean(x, 120)).filter(Boolean), c = Number(m.correct);
      if (!q || opts.length < 2 || opts.length > 4 || !Number.isInteger(c) || c < 0 || c >= opts.length) return this.send(ws, { t: 'err', why: 'quiz' });
      await this.setPlay({ pos: this.pos(), playing: false, by: a.name });
      this.quiz = { qid: 'r' + Date.now(), q, opts, correct: c, by: a.name, start: Date.now(), answers: {}, revealed: false };
      await this.ctx.storage.put('quiz', this.quiz);
      this.all({ t: 'quiz', ...this.quizPublic() }); this.all({ t: 'lock', on: true });
    } else if (m.t === 'resume') {
      if (this.quiz && !this.quiz.revealed) await this.reveal();
    } else if (m.t === 'teacher' && a.role === 'owner') {
      const uid = clean(m.uid, 64); if (!uid || uid === M.owner) return;
      if (m.off) this.teachers = this.teachers.filter((x) => x !== uid); else if (!this.teachers.includes(uid)) this.teachers.push(uid);
      await this.ctx.storage.put('teachers', this.teachers);
      await db.prepare('UPDATE room_member SET role=? WHERE code=? AND uid=?').bind(m.off ? 'member' : 'teacher', M.code, uid).run();
      for (const p of this.peers()) if (p.a.uid === uid) { p.a.role = this.role(p.a); p.ws.serializeAttachment(p.a); this.send(p.ws, { t: 'role', role: p.a.role }); }
      this.all({ t: 'members', list: await this.members() });
    } else if (m.t === 'kick' && a.role === 'owner') {
      const uid = clean(m.uid, 64); if (!uid || uid === M.owner) return;
      await db.prepare('UPDATE room_member SET role=? WHERE code=? AND uid=?').bind('kicked', M.code, uid).run();
      for (const p of this.peers()) if (p.a.uid === uid) { this.send(p.ws, { t: 'err', why: 'removed' }); try { p.ws.close(4003, 'removed'); } catch {} }
      this.broadcastSeats();
    } else if (m.t === 'members') {
      this.send(ws, { t: 'members', list: await this.members() });
    }
  }
  async members() {
    const on = new Set(this.peers().map((p) => p.a.uid).filter(Boolean));
    const r = (await this.env.GAME_DB.prepare("SELECT uid, name, role FROM room_member WHERE code=? AND role!='kicked' ORDER BY joined").bind(this.meta.code).all()).results || [];
    return [{ uid: this.meta.owner, name: 'Owner', role: 'owner', on: on.has(this.meta.owner) }, ...r.map((x) => ({ ...x, on: on.has(x.uid) }))];
  }
  async reveal() {
    const Q = this.quiz; Q.revealed = true; await this.ctx.storage.put('quiz', Q);
    const ans = Object.entries(Q.answers), right = ans.filter(([, x]) => x.i === Q.correct);
    const pct = ans.length ? Math.round(right.length / ans.length * 100) : 0;
    const fast = right.sort((p, q) => p[1].ms - q[1].ms)[0];
    this.all({ t: 'reveal', qid: Q.qid, correct: Q.correct, pct, n: ans.length, fastest: fast ? { name: fast[1].name, s: +(fast[1].ms / 1000).toFixed(1) } : null });
    this.all({ t: 'lock', on: false });
    const db = this.env.GAME_DB;
    this.ctx.waitUntil(recordAnswers(this.env, ans.map(([uid, x]) => [uid, Q.qid, 'Batch · ' + this.meta.name, x.i === Q.correct, x.ms])));
    if (db && right.length) this.ctx.waitUntil(db.prepare('INSERT INTO room_week (code, wk, pts) VALUES (?,?,?) ON CONFLICT(code, wk) DO UPDATE SET pts = pts + excluded.pts').bind(this.meta.code, weekKey(), right.length * 100).run());
  }
  async webSocketClose(ws) { try { ws.close(); } catch {} this.broadcastSeats(); }
  async webSocketError() { this.broadcastSeats(); }
}

export async function roomRoute(request, env, pathname) {
  const db = env.GAME_DB; if (!db) return json({ error: 'unavailable' }, 503);
  const ws = pathname.match(/^\/api\/room\/([A-Z0-9]{6})\/ws$/);
  if (ws) {
    const stub = env.ROOM.get(env.ROOM.idFromName(ws[1]));
    return stub.fetch(new Request(request.url + (request.url.includes('?') ? '&' : '?') + 'code=' + ws[1], request));
  }
  const uid = await verifyUser(bearer(request)); if (!uid) return json({ error: 'signin' }, 401);
  if (pathname === '/api/room/create' && request.method === 'POST') {
    if (!(await proUntil(env, uid))) return json({ error: 'pro' }, 403);
    const owned = (await db.prepare('SELECT COUNT(*) c FROM room WHERE owner=?').bind(uid).first())?.c || 0;
    if (owned >= 5) return json({ error: 'limit', why: 'You can own up to 5 batch rooms' }, 400);
    let body = {}; try { body = await request.json(); } catch {}
    const name = clean(body.name, 40) || 'My Batch';
    const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', pick = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (x) => A[x % A.length]).join('');
    let code = ''; for (let i = 0; i < 6 && !code; i++) { const c = pick(6); if (!(await db.prepare('SELECT 1 FROM room WHERE code=?').bind(c).first())) code = c; }
    const tkey = pick(10);
    await db.prepare('INSERT INTO room (code, name, owner, tkey, created) VALUES (?,?,?,?,?)').bind(code, name, uid, tkey, Date.now()).run();
    return json({ code, name, tkey });
  }
  if (pathname === '/api/room/mine') {
    const r = (await db.prepare(`SELECT r.code, r.name, r.owner = ? AS mine, (SELECT COUNT(*) FROM room_member m2 WHERE m2.code = r.code AND m2.role != 'kicked') + 1 AS members
      FROM room r WHERE r.owner = ? OR r.code IN (SELECT code FROM room_member WHERE uid = ? AND role != 'kicked') ORDER BY r.created DESC LIMIT 20`).bind(uid, uid, uid).all()).results || [];
    for (const x of r) { x.streak = await streakOf(env, x.code); x.week = await weekRank(env, x.code); x.mine = !!x.mine; }
    const board = (await db.prepare('SELECT r.name, w.pts, w.code FROM room_week w JOIN room r ON r.code = w.code WHERE w.wk=? AND w.pts>0 ORDER BY w.pts DESC LIMIT 10').bind(weekKey()).all()).results || [];
    const mineC = new Set(r.map((x) => x.code));
    return json({ rooms: r, pro: !!(await proUntil(env, uid)), board: board.map((b) => ({ name: b.name, pts: b.pts, mine: mineC.has(b.code) })) });
  }
  if (pathname === '/api/room/info') {
    const code = String(new URL(request.url).searchParams.get('code') || '').toUpperCase();
    if (!CODE_RE.test(code)) return json({ error: 'code' }, 400);
    const r = await db.prepare('SELECT code, name FROM room WHERE code=?').bind(code).first();
    return r ? json(r) : json({ error: 'none' }, 404);
  }
  return json({ error: 'not found' }, 404);
}

// MindGains Batch rooms: a private copy of the theatre for friends, a class or a tuition batch.
// Owner (Pro) and teachers put YouTube videos on the screen, play/pause/seek for everyone and ask quizzes.
// While a quiz is open the video is paused and member chat is locked until everyone answers, the
// teacher resumes, or the deadline passes. The server is the clock for playback (hibernating WebSockets).
//
// HTTP  POST /api/room/create {name}            -> {code, invite}          (Pro only, max 5 rooms)
//       POST /api/room/<code>/teacher-link {rotate?} -> {link}              (owner only)
//       GET  /api/room/mine                      -> {rooms, board, pro}
//       WS   /api/room/<code>/ws                 (failed joins rate-limited per IP)
// WS in   everyone: hello{token,name,look,t?} sit chat{text,re?} ans{qid,i} report{uid,msgId} tick members
//         host/teacher: video{v,title} unlist{v} play pause{pos} seek{pos} quiz{q,opts,correct,subject,chapter,seconds?} resume kick{uid} ban{uid}
//         owner: teacher{uid} untteacher{uid}
// WS out  state, play/sync (with serverNow), seats, chat, quiz, qprog{answered,total}, reveal{correct,pctRight}, lock, unlock, kicked, role, members, slow, err
import { DurableObject } from 'cloudflare:workers';
import { verifyUser, bearer } from './auth.js';
import { proUntil, teacherUntil, ROOM_LIMITS, addWatch, watchedToday, recordAnswers, FREE_SECS, istDay } from './pro.js';

const SYNC_MS = 30000;
const SEAT_RE = /^[A-L]([1-9]|1[0-8])$/;
const BAD = /\b(fuck\w*|shit\w*|bitch\w*|bastard|asshole|dick|madarchod|bhenchod|chutiya|punda|sunni|otha|thevdiya)\b/gi;
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // no I, O, 0, 1
const clean = (s, n) => String(s || '').replace(/[<>]/g, '').trim().slice(0, n);
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const rand = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (x) => ALPHA[x % ALPHA.length]).join('');
const token24 = () => Array.from(crypto.getRandomValues(new Uint8Array(24)), (x) => 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'[x % 56]).join('');
export const weekKey = (t = Date.now()) => { const d = new Date(t + 5.5 * 3600e3); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d.toISOString().slice(0, 10); };
export const ytId = (u) => { u = String(u || '').trim(); if (/^[\w-]{11}$/.test(u)) return u;
  const m = u.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/); return m ? m[1] : null; };

async function memberCount(db, code) { return 1 + ((await db.prepare('SELECT COUNT(*) c FROM room_member WHERE code=? AND banned=0').bind(code).first())?.c || 0); }
// batch streak: consecutive days on which at least half the batch studied 10+ minutes in the room
export async function streakOf(env, code) {
  const db = env.GAME_DB; if (!db) return 0;
  const need = Math.max(1, Math.ceil((await memberCount(db, code)) * 0.5));
  const rows = (await db.prepare('SELECT day, COUNT(*) c FROM room_day WHERE code=? AND minutes>=10 GROUP BY day ORDER BY day DESC LIMIT 400').bind(code).all()).results || [];
  const ok = new Set(rows.filter((r) => r.c >= need).map((r) => r.day));
  let s = 0, t = Date.now(); if (!ok.has(istDay(t))) t -= 864e5;
  while (ok.has(istDay(t))) { s++; t -= 864e5; }
  return s;
}
// weekly batch board: rooms with 3+ active members this week; score = (study minutes + correct answers x 2) / members
export async function weekBoard(env) {
  const db = env.GAME_DB, wk = weekKey();
  const act = (await db.prepare('SELECT code, COUNT(DISTINCT uid) a, SUM(minutes) m FROM room_day WHERE day>=? GROUP BY code HAVING a>=3').bind(wk).all()).results || [];
  if (!act.length) return [];
  const cor = new Map(((await db.prepare('SELECT code, pts FROM room_week WHERE wk=?').bind(wk).all()).results || []).map((r) => [r.code, r.pts]));
  const out = [];
  for (const r of act) { const n = await memberCount(db, r.code); out.push({ code: r.code, score: Math.round(((r.m || 0) + (cor.get(r.code) || 0) * 2) / n), active: r.a }); }
  out.sort((x, y) => y.score - x.score);
  return out;
}

export class StudyRoom extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      const s = await ctx.storage.get(['meta', 'play', 'list', 'quiz', 'chat', 'teachers', 'mutes']);
      this.meta = s.get('meta') || null; this.play = s.get('play') || { v: '', pos: 0, playing: false, at: Date.now() };
      this.list = s.get('list') || []; this.quiz = s.get('quiz') || null; this.chat = s.get('chat') || [];
      this.teachers = s.get('teachers') || []; this.mutes = s.get('mutes') || {};
    });
  }
  peers() { return this.ctx.getWebSockets().map((ws) => ({ ws, a: ws.deserializeAttachment() || {} })); }
  send(ws, m) { try { ws.send(JSON.stringify(m)); } catch {} }
  all(m) { const s = JSON.stringify(m); for (const ws of this.ctx.getWebSockets()) { try { ws.send(s); } catch {} } }
  seats() { const m = {}, l = {}, p = []; for (const { a } of this.peers()) if (a.seat && a.uid) { m[a.seat] = a.name; if (a.look) l[a.seat] = a.look; if (a.pro) p.push(a.seat); } return { seats: m, looks: l, pros: p }; }
  online() { return new Set(this.peers().filter((p) => p.a.uid).map((p) => p.a.uid)).size; }
  students() { return new Set(this.peers().filter((p) => p.a.uid && p.a.role === 'member').map((p) => p.a.uid)); }
  broadcastSeats() { this.all({ t: 'seats', count: this.online(), ...this.seats() }); }
  pos() { const P = this.play; return P.playing ? P.pos + (Date.now() - P.at) / 1000 : P.pos; }
  playMsg(t = 'play') { return { t, v: this.play.v, title: this.play.title || '', pos: this.pos(), playing: this.play.playing, at: this.play.at, serverNow: Date.now(), by: this.play.playing ? '' : (this.play.by || ''), ...(t === 'play' ? { list: this.list } : {}) }; }
  async setPlay(p) { this.play = { ...this.play, ...p, pos: p.pos != null ? p.pos : this.pos(), at: Date.now() }; await this.ctx.storage.put('play', this.play); this.all(this.playMsg()); }
  role(a) { return !a.uid ? 'guest' : a.uid === this.meta.owner ? 'owner' : this.teachers.includes(a.uid) ? 'teacher' : 'member'; }
  quizPublic() { const Q = this.quiz; return Q && !Q.revealed ? { qid: Q.qid, q: Q.q, opts: Q.opts, by: Q.by, subject: Q.subject, chapter: Q.chapter, deadline: Q.deadline, serverNow: Date.now(), answered: Object.keys(Q.answers).length, total: this.students().size } : null; }
  async schedule() {   // one alarm drives the 30 s sync and the quiz deadline
    if (!this.ctx.getWebSockets().length) return;
    let at = Date.now() + SYNC_MS; if (this.quiz && !this.quiz.revealed) at = Math.min(at, this.quiz.deadline);
    const cur = await this.ctx.storage.getAlarm(); if (!cur || cur > at) await this.ctx.storage.setAlarm(at);
  }
  async alarm() {
    if (!this.ctx.getWebSockets().length) return;
    if (this.quiz && !this.quiz.revealed && Date.now() >= this.quiz.deadline - 250) await this.reveal();
    if (this.play.v) this.all(this.playMsg('sync'));
    await this.schedule();
  }

  async fetch(request) {
    if (request.headers.get('Upgrade') !== 'websocket') return new Response('websocket only', { status: 426 });
    const code = new URL(request.url).searchParams.get('code');
    if (!this.meta) { const r = await this.env.GAME_DB.prepare('SELECT code, name, owner FROM room WHERE code=?').bind(code).first(); if (!r) return new Response('no such room', { status: 404 }); this.meta = r; await this.ctx.storage.put('meta', r); }
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ id: crypto.randomUUID().slice(0, 8), name: 'Guest', seat: null });
    await this.schedule();
    return new Response(null, { status: 101, webSocket: client });
  }
  async ownerPro() { const now = Date.now(); if (this._op && now - this._op.at < 6e5) return this._op.v; const v = !!(await proUntil(this.env, this.meta.owner)); this._op = { at: now, v }; return v; }
  closeUid(uid, why) { for (const p of this.peers()) if (p.a.uid === uid) { this.send(p.ws, { t: 'kicked', why }); try { p.ws.close(4003, why); } catch {} } }

  async webSocketMessage(ws, raw) {
    let m; try { m = JSON.parse(raw); } catch { return; }
    const a = ws.deserializeAttachment() || {}, M = this.meta, db = this.env.GAME_DB;
    if (m.t === 'hello') {
      const uid = m.token ? await verifyUser(String(m.token)) : null;
      if (!uid) return this.send(ws, { t: 'err', why: 'signin' });
      a.uid = uid; a.name = clean(m.name, 20) || 'Friend';
      if (Array.isArray(m.look)) a.look = [Math.max(0, Math.min(9, m.look[0] | 0)), Math.max(0, Math.min(9, m.look[1] | 0))];
      a.pro = !!(await proUntil(this.env, uid));
      const mem = await db.prepare('SELECT role, banned FROM room_member WHERE code=? AND uid=?').bind(M.code, uid).first();
      if (mem && mem.banned) { this.send(ws, { t: 'kicked', why: 'banned' }); try { ws.close(4003, 'banned'); } catch {} return; }
      if (!mem && uid !== M.owner) {
        const cap = (await teacherUntil(this.env, M.owner)) ? ROOM_LIMITS.teacher.members : ROOM_LIMITS.pro.members;
        if ((await memberCount(db, M.code)) >= cap) return this.send(ws, { t: 'err', why: 'full', cap });
        await db.prepare('INSERT OR IGNORE INTO room_member (code, uid, name, role, joined, banned) VALUES (?,?,?,?,?,0)').bind(M.code, uid, a.name, 'member', Date.now()).run();
      } else if (mem) await db.prepare('UPDATE room_member SET name=? WHERE code=? AND uid=?').bind(a.name, M.code, uid).run();
      const tk = clean(m.t2 || m.tk, 40);
      if (tk && uid !== M.owner && !this.teachers.includes(uid)) {
        const r = await db.prepare('SELECT tkey FROM room WHERE code=?').bind(M.code).first();
        if (r && r.tkey && tk === r.tkey) { this.teachers.push(uid); await this.ctx.storage.put('teachers', this.teachers); await db.prepare('UPDATE room_member SET role=? WHERE code=? AND uid=?').bind('teacher', M.code, uid).run(); }
      }
      a.role = this.role(a); ws.serializeAttachment(a);
      const op = await this.ownerPro(), free = a.pro || op;
      const w = free ? 0 : await watchedToday(this.env, 'u:' + uid);
      const cap = (await teacherUntil(this.env, M.owner)) ? ROOM_LIMITS.teacher.members : ROOM_LIMITS.pro.members;
      this.send(ws, { t: 'state', role: a.role, me: uid, serverNow: Date.now(), room: { code: M.code, name: M.name, ownerPro: op, cap },
        count: this.online(), ...this.seats(), chat: this.chat.slice(-50), quiz: this.quizPublic(), locked: !!this.quizPublic(), streak: await streakOf(this.env, M.code) });
      this.send(ws, this.playMsg());
      this.send(ws, { t: 'pro', pro: a.pro, signedIn: true, freeLeft: free ? null : Math.max(0, FREE_SECS - w) });
      if (!free && w >= FREE_SECS) this.send(ws, { t: 'wall' });
      this.broadcastSeats();
      if (this.quiz && !this.quiz.revealed) this.all({ t: 'qprog', qid: this.quiz.qid, answered: Object.keys(this.quiz.answers).length, total: this.students().size });
      return;
    }
    if (!a.uid) return this.send(ws, { t: 'err', why: 'signin' });
    const boss = a.role === 'owner' || a.role === 'teacher', now = Date.now();
    if (m.t === 'tick') {
      if (now - (a.lt || 0) < 25000) return; a.lt = now; a.secs = (a.secs || 0) + 30; ws.serializeAttachment(a);
      if (a.secs % 60 === 0) this.ctx.waitUntil(db.prepare('INSERT INTO room_day (code, day, uid, minutes) VALUES (?,?,?,1) ON CONFLICT(code, day, uid) DO UPDATE SET minutes = minutes + 1').bind(M.code, istDay(), a.uid).run());
      if (a.pro || await this.ownerPro()) return;   // a Pro owner's room is free for the whole batch
      const w = await addWatch(this.env, 'u:' + a.uid, 30), left = Math.max(0, FREE_SECS - w);
      this.send(ws, { t: 'free', left }); if (!left) this.send(ws, { t: 'wall' });
    } else if (m.t === 'sit') {
      const seat = String(m.seat || ''); if (!SEAT_RE.test(seat)) return;
      if (this.peers().some((p) => p.ws !== ws && p.a.seat === seat)) return this.send(ws, { t: 'taken', seat });
      a.seat = seat; ws.serializeAttachment(a); this.broadcastSeats();
    } else if (m.t === 'chat') {
      if (!boss && this.quizPublic()) return this.send(ws, { t: 'slow', why: 'Chat is paused for the quiz' });
      if (!boss && (this.mutes[a.uid] || 0) > now) return this.send(ws, { t: 'slow', wait: this.mutes[a.uid] - now, why: 'You are muted for a few minutes after reports' });
      if (!boss) {   // 1 message per 2 s, 10 per minute
        a.ts = (a.ts || []).filter((x) => now - x < 60000);
        if (now - (a.ts[a.ts.length - 1] || 0) < 2000) return this.send(ws, { t: 'slow', wait: 2000 - (now - a.ts[a.ts.length - 1]) });
        if (a.ts.length >= 10) return this.send(ws, { t: 'slow', wait: 60000 - (now - a.ts[0]), why: 'Slow down: 10 messages a minute' });
        a.ts.push(now);
      }
      let text = clean(m.text, 240).replace(/\s+/g, ' '); if (!text) return;
      text = text.replace(BAD, (w) => '*'.repeat(w.length));
      ws.serializeAttachment(a);
      const re = m.re && m.re.name ? { name: clean(m.re.name, 20), text: clean(m.re.text, 60) } : null;
      const msg = { id: now.toString(36) + rand(3), uid: a.uid, name: a.name, seat: a.seat, text, at: now, ...(re ? { re } : {}), ...(a.role === 'teacher' ? { teacher: 1 } : a.role === 'owner' ? { owner: 1 } : a.pro ? { pro: 1 } : {}) };
      this.chat.push(msg); if (this.chat.length > 80) this.chat = this.chat.slice(-80);
      this.all({ t: 'chat', m: msg }); await this.ctx.storage.put('chat', this.chat);
    } else if (m.t === 'report') {
      const uid = clean(m.uid, 64), msg = this.chat.find((x) => x.id === m.msgId && x.uid === uid);
      if (!uid || uid === a.uid || !msg) return;
      await db.prepare('INSERT INTO room_report (code, reporter, uid, msg, created) VALUES (?,?,?,?,?)').bind(M.code, a.uid, uid, msg.text, now).run();
      const n = (await db.prepare('SELECT COUNT(DISTINCT reporter) c FROM room_report WHERE code=? AND uid=? AND created>?').bind(M.code, uid, now - 36e5).first())?.c || 0;
      this.send(ws, { t: 'slow', why: 'Thanks, reported' });
      if (n >= 3 && !(this.mutes[uid] > now) && uid !== M.owner && !this.teachers.includes(uid)) { this.mutes[uid] = now + 6e5; await this.ctx.storage.put('mutes', this.mutes); for (const p of this.peers()) if (p.a.uid === uid) this.send(p.ws, { t: 'slow', wait: 6e5, why: 'You are muted for 10 minutes after reports' }); }
    } else if (m.t === 'ans') {
      const Q = this.quiz; if (!Q || Q.revealed || m.qid !== Q.qid || Q.answers[a.uid] != null || a.role !== 'member' || now > Q.deadline) return;
      const i = Number(m.i); if (!Number.isInteger(i) || i < 0 || i >= Q.opts.length) return;
      Q.answers[a.uid] = { i, ms: now - Q.start, name: a.name }; await this.ctx.storage.put('quiz', Q);
      const answered = Object.keys(Q.answers).length, total = this.students().size;
      this.all({ t: 'qprog', qid: Q.qid, answered, total });
      if (total && [...this.students()].every((u) => Q.answers[u] != null)) await this.reveal();
    } else if (m.t === 'members') {
      this.send(ws, { t: 'members', list: await this.members() });
    } else if (!boss) {
      return;   // everything below is host / teacher only
    } else if (m.t === 'video') {
      const v = ytId(m.v); if (!v) return this.send(ws, { t: 'err', why: 'link' });
      const title = clean(m.title, 80) || 'Video';
      if (!this.list.some((x) => x.v === v)) { this.list.push({ v, title }); if (this.list.length > 40) this.list.shift(); await this.ctx.storage.put('list', this.list); }
      await this.setPlay({ v, title, pos: Math.max(0, +m.pos || 0), playing: !this.quizPublic() });
    } else if (m.t === 'unlist') {
      this.list = this.list.filter((x) => x.v !== m.v); await this.ctx.storage.put('list', this.list); this.all(this.playMsg());
    } else if (m.t === 'play') {
      if (this.quizPublic()) return this.send(ws, { t: 'slow', why: 'Reveal the quiz first' });
      if (this.play.v) await this.setPlay({ playing: true });
    } else if (m.t === 'pause') {
      await this.setPlay({ pos: Number.isFinite(+m.pos) && m.pos != null ? Math.max(0, +m.pos) : this.pos(), playing: false, by: a.name });
    } else if (m.t === 'seek') {
      if (Number.isFinite(+m.pos)) await this.setPlay({ pos: Math.max(0, +m.pos) });
    } else if (m.t === 'quiz') {
      const q = clean(m.q, 300), opts = (Array.isArray(m.opts) ? m.opts : []).map((x) => clean(x, 120)).filter(Boolean), c = Number(m.correct);
      if (!q || opts.length < 2 || opts.length > 4 || !Number.isInteger(c) || c < 0 || c >= opts.length) return this.send(ws, { t: 'err', why: 'quiz' });
      if (this.quizPublic()) return this.send(ws, { t: 'slow', why: 'A quiz is already open' });
      const secs = Math.max(10, Math.min(600, Math.round(+m.seconds || 60)));
      await this.setPlay({ playing: false, by: a.name });
      this.quiz = { qid: 'r' + now, q, opts, correct: c, subject: clean(m.subject, 40) || 'General', chapter: clean(m.chapter, 80) || 'General', by: a.name, start: now, deadline: now + secs * 1000, answers: {}, revealed: false };
      await this.ctx.storage.put('quiz', this.quiz);
      this.all({ t: 'quiz', ...this.quizPublic() }); this.all({ t: 'lock' });
      await this.ctx.storage.setAlarm(this.quiz.deadline);
    } else if (m.t === 'resume') {
      if (this.quiz && !this.quiz.revealed) await this.reveal();
    } else if (m.t === 'kick' || m.t === 'ban') {
      const uid = clean(m.uid, 64); if (!uid || uid === M.owner || uid === a.uid) return;
      if (this.teachers.includes(uid) && a.role !== 'owner') return;   // teachers can't remove teachers
      if (m.t === 'ban') { await db.prepare('UPDATE room_member SET banned=1, role=? WHERE code=? AND uid=?').bind('member', M.code, uid).run(); this.teachers = this.teachers.filter((x) => x !== uid); await this.ctx.storage.put('teachers', this.teachers); }
      this.closeUid(uid, m.t === 'ban' ? 'banned' : 'kicked'); this.broadcastSeats();
      this.send(ws, { t: 'members', list: await this.members() });
    } else if ((m.t === 'teacher' || m.t === 'untteacher') && a.role === 'owner') {
      const uid = clean(m.uid, 64); if (!uid || uid === M.owner) return;
      const off = m.t === 'untteacher' || !!m.off;
      if (off) this.teachers = this.teachers.filter((x) => x !== uid); else if (!this.teachers.includes(uid)) this.teachers.push(uid);
      await this.ctx.storage.put('teachers', this.teachers);
      await db.prepare('UPDATE room_member SET role=? WHERE code=? AND uid=?').bind(off ? 'member' : 'teacher', M.code, uid).run();
      for (const p of this.peers()) if (p.a.uid === uid) { p.a.role = this.role(p.a); p.ws.serializeAttachment(p.a); this.send(p.ws, { t: 'role', role: p.a.role }); }
      this.send(ws, { t: 'members', list: await this.members() });
    }
  }
  async members() {
    const on = new Set(this.peers().map((p) => p.a.uid).filter(Boolean)), op = this.peers().find((p) => p.a.uid === this.meta.owner);
    const r = (await this.env.GAME_DB.prepare('SELECT uid, name, role FROM room_member WHERE code=? AND banned=0 ORDER BY joined').bind(this.meta.code).all()).results || [];
    return [{ uid: this.meta.owner, name: op ? op.a.name : 'Host', role: 'owner', on: on.has(this.meta.owner) }, ...r.map((x) => ({ ...x, role: this.teachers.includes(x.uid) ? 'teacher' : 'member', on: on.has(x.uid) }))];
  }
  async reveal() {
    const Q = this.quiz; if (!Q || Q.revealed) return; Q.revealed = true; await this.ctx.storage.put('quiz', Q);
    const ans = Object.entries(Q.answers), right = ans.filter(([, x]) => x.i === Q.correct);
    const pctRight = ans.length ? Math.round(right.length / ans.length * 100) : 0;
    const fast = [...right].sort((p, q) => p[1].ms - q[1].ms)[0];
    this.all({ t: 'reveal', qid: Q.qid, correct: Q.correct, pctRight, pct: pctRight, n: ans.length, fastest: fast ? { name: fast[1].name, s: +(fast[1].ms / 1000).toFixed(1) } : null });
    this.all({ t: 'unlock' });
    const db = this.env.GAME_DB;
    // weak-chapters report: tagged with the quiz's chapter (qid carries the room code)
    this.ctx.waitUntil(recordAnswers(this.env, ans.map(([uid, x]) => [uid, 'room:' + this.meta.code + ':' + Q.qid, Q.chapter || Q.subject || 'General', x.i === Q.correct, x.ms])));
    if (db && right.length) this.ctx.waitUntil(db.prepare('INSERT INTO room_week (code, wk, pts) VALUES (?,?,?) ON CONFLICT(code, wk) DO UPDATE SET pts = pts + excluded.pts').bind(this.meta.code, weekKey(), right.length).run());
  }
  async webSocketClose(ws) { try { ws.close(); } catch {} this.broadcastSeats(); if (this.quiz && !this.quiz.revealed) this.all({ t: 'qprog', qid: this.quiz.qid, answered: Object.keys(this.quiz.answers).length, total: this.students().size }); }
  async webSocketError() { this.broadcastSeats(); }
}

export async function roomRoute(request, env, pathname) {
  const db = env.GAME_DB; if (!db) return json({ error: 'unavailable' }, 503);
  const ws = pathname.match(/^\/api\/room\/([A-Z0-9]{6})\/ws$/);
  if (ws) {   // unknown codes count as failed joins per IP (stops code guessing)
    const ip = request.headers.get('cf-connecting-ip') || 'x', now = Date.now();
    const fails = (await db.prepare('SELECT COUNT(*) c FROM room_fail WHERE ip=? AND at>?').bind(ip, now - 6e5).first())?.c || 0;
    if (fails >= 15) return new Response('too many attempts', { status: 429 });
    if (!(await db.prepare('SELECT 1 FROM room WHERE code=?').bind(ws[1]).first())) {
      await db.prepare('INSERT INTO room_fail (ip, at) VALUES (?,?)').bind(ip, now).run();
      if (Math.random() < .05) await db.prepare('DELETE FROM room_fail WHERE at<?').bind(now - 864e5).run();
      return new Response('no such room', { status: 404 });
    }
    const stub = env.ROOM.get(env.ROOM.idFromName(ws[1]));
    return stub.fetch(new Request(request.url + (request.url.includes('?') ? '&' : '?') + 'code=' + ws[1], request));
  }
  const uid = await verifyUser(bearer(request)); if (!uid) return json({ error: 'signin' }, 401);
  if (pathname === '/api/room/create' && request.method === 'POST') {
    if (!(await proUntil(env, uid))) return json({ error: 'pro' }, 403);
    const L = (await teacherUntil(env, uid)) ? ROOM_LIMITS.teacher : ROOM_LIMITS.pro;
    const owned = (await db.prepare('SELECT COUNT(*) c FROM room WHERE owner=?').bind(uid).first())?.c || 0;
    if (owned >= L.rooms) return json({ error: 'limit', why: L === ROOM_LIMITS.pro ? `Pro includes ${L.rooms} batch rooms. Teacher plan: ${ROOM_LIMITS.teacher.rooms} rooms, ${ROOM_LIMITS.teacher.members} students each` : `You can own up to ${L.rooms} batch rooms` }, 400);
    let body = {}; try { body = await request.json(); } catch {}
    const name = clean(body.name, 40) || 'My Batch';
    let code = ''; for (let i = 0; i < 8 && !code; i++) { const c = rand(6); if (!(await db.prepare('SELECT 1 FROM room WHERE code=?').bind(c).first())) code = c; }
    await db.prepare('INSERT INTO room (code, name, owner, tkey, created) VALUES (?,?,?,?,?)').bind(code, name, uid, token24(), Date.now()).run();
    return json({ code, name, invite: '/play/theatre/?room=' + code });
  }
  const tl = pathname.match(/^\/api\/room\/([A-Z0-9]{6})\/teacher-link$/);
  if (tl && request.method === 'POST') {
    const r = await db.prepare('SELECT owner, tkey FROM room WHERE code=?').bind(tl[1]).first();
    if (!r || r.owner !== uid) return json({ error: 'owner' }, 403);
    let body = {}; try { body = await request.json(); } catch {}
    let tk = r.tkey; if (body.rotate || !tk || tk.length < 24) { tk = token24(); await db.prepare('UPDATE room SET tkey=? WHERE code=?').bind(tk, tl[1]).run(); }
    return json({ link: '/play/theatre/?room=' + tl[1] + '&t=' + tk });
  }
  if (pathname === '/api/room/mine') {
    const r = (await db.prepare(`SELECT r.code, r.name, r.owner = ? AS mine FROM room r
      WHERE r.owner = ? OR r.code IN (SELECT code FROM room_member WHERE uid = ? AND banned = 0) ORDER BY r.created DESC LIMIT 20`).bind(uid, uid, uid).all()).results || [];
    const board = await weekBoard(env), rank = new Map(board.map((b, i) => [b.code, i + 1]));
    for (const x of r) { x.members = await memberCount(db, x.code); x.streak = await streakOf(env, x.code); x.rank = rank.get(x.code) || 0; x.mine = !!x.mine; }
    const names = new Map(); for (const b of board.slice(0, 10)) names.set(b.code, (await db.prepare('SELECT name FROM room WHERE code=?').bind(b.code).first())?.name || 'Batch');
    const mineC = new Set(r.map((x) => x.code));
    const tch = !!(await teacherUntil(env, uid)), L = tch ? ROOM_LIMITS.teacher : ROOM_LIMITS.pro;
    return json({ rooms: r, pro: !!(await proUntil(env, uid)), teacher: tch, limits: L, of: board.length, board: board.slice(0, 10).map((b) => ({ name: names.get(b.code), score: b.score, mine: mineC.has(b.code) })) });
  }
  return json({ error: 'not found' }, 404);
}

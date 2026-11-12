// MindGains Theatre: one live room per hall (Durable Object, WebSocket hibernation).
// Clients connect to /api/theatre/<hall>/ws. The room keeps who sits where, broadcasts the live count
// and seat map, runs MIGA's quiz rounds (question -> answers -> reveal) and a per-show top 5.
// Messages (JSON):
//   client -> {t:'hello', name, seat?}   {t:'sit', seat}   {t:'ans', qid, i}   {t:'react', e}
//   server -> {t:'state', count, seats:{seat:name}, top, quiz?}   {t:'seats', ...}   {t:'quiz', q}
//             {t:'reveal', qid, correct, pct, top}   {t:'react', e, seat}
import { DurableObject } from 'cloudflare:workers';

const DAY_SETS = {"main": {"mon": ["upsc/polity/constitution-features", "upsc/polity/constitutional-bodies", "upsc/polity/dpsp", "upsc/polity/executive", "upsc/polity/federalism", "upsc/polity/fundamental-rights", "upsc/polity/int-relations", "upsc/polity/judiciary", "upsc/polity/local-govt", "upsc/polity/parliament"], "tue": ["upsc/history/ancient-kingdoms", "upsc/history/indus-valley", "upsc/history/medieval-india", "upsc/history/prehistoric"], "wed": ["upsc/geography/agriculture-geo", "upsc/geography/climate", "upsc/geography/environment-eco", "upsc/geography/map-based", "upsc/geography/natural-resources", "upsc/geography/physical-india", "upsc/geography/physical-world", "upsc/geography/population", "upsc/geography/rivers-drainage", "upsc/geography/transport-infra"], "thu": ["upsc/economics/agriculture-eco", "upsc/economics/budget-fiscal", "upsc/economics/economic-reforms", "upsc/economics/industry-msme", "upsc/economics/inflation", "upsc/economics/money-banking", "upsc/economics/national-income", "upsc/economics/poverty-inclusion", "upsc/economics/trade-balance"], "fri": ["upsc/science/biology", "upsc/science/biotech", "upsc/science/chemistry", "upsc/science/defence-tech", "upsc/science/disease-health", "upsc/science/energy", "upsc/science/physics", "upsc/science/space-tech", "upsc/environment/biodiversity", "upsc/environment/climate-change", "upsc/environment/ecology-basics", "upsc/environment/env-laws", "upsc/environment/pollution", "upsc/environment/protected-areas"], "sat": ["upsc/history/1857-revolt", "upsc/history/art-culture", "upsc/history/british-conquest", "upsc/history/gandhi-era", "upsc/history/national-movement", "upsc/history/post-1947"], "sun": ["upsc/polity/constitution-features", "upsc/polity/constitutional-bodies", "upsc/polity/dpsp", "upsc/geography/agriculture-geo", "upsc/geography/climate", "upsc/geography/environment-eco", "upsc/economics/agriculture-eco", "upsc/economics/budget-fiscal", "upsc/economics/economic-reforms"]}, "tnpsc": {"mon": ["tnpsc/polity/constitution-making", "tnpsc/polity/dpsp", "tnpsc/polity/elections", "tnpsc/polity/fundamental-rights", "tnpsc/polity/governance", "tnpsc/polity/judiciary", "tnpsc/polity/local-bodies", "tnpsc/polity/parliament", "tnpsc/polity/preamble", "tnpsc/polity/president-pm", "tnpsc/polity/state-govt", "tnpsc/polity/tn-polity"], "tue": ["tnpsc/history/art-culture", "tnpsc/history/british-rule", "tnpsc/history/chola-pandya", "tnpsc/history/freedom-struggle", "tnpsc/history/gupta-post-gupta", "tnpsc/history/indus-valley", "tnpsc/history/jainism-buddhism", "tnpsc/history/maratha", "tnpsc/history/mauryan", "tnpsc/history/medieval-india", "tnpsc/history/mughal", "tnpsc/history/post-independence", "tnpsc/history/social-reform", "tnpsc/history/tamil-history", "tnpsc/history/unit-viii-tamil-nadu-history-culture", "tnpsc/history/vedic-age", "tnpsc/history/vijayanagara"], "wed": ["tnpsc/geography/earth-universe", "tnpsc/geography/india-climate", "tnpsc/geography/india-physical", "tnpsc/geography/india-resources", "tnpsc/geography/india-rivers", "tnpsc/geography/india-soils", "tnpsc/geography/tn-districts", "tnpsc/geography/tn-geography", "tnpsc/geography/transport-trade", "tnpsc/geography/world-geography", "tnpsc/geography/world-oceans"], "thu": ["tnpsc/economics/agriculture", "tnpsc/economics/banking-finance", "tnpsc/economics/budget-taxation", "tnpsc/economics/current-schemes", "tnpsc/economics/industry", "tnpsc/economics/international-trade", "tnpsc/economics/national-income", "tnpsc/economics/planning", "tnpsc/economics/poverty-welfare", "tnpsc/economics/tn-economy", "tnpsc/economics/unit-ix-development-administration"], "fri": ["tnpsc/science/biology-cells", "tnpsc/science/biology-human", "tnpsc/science/biology-plants", "tnpsc/science/chemistry-acids", "tnpsc/science/chemistry-matter", "tnpsc/science/chemistry-reactions", "tnpsc/science/computer-basics", "tnpsc/science/environment", "tnpsc/science/physics-electricity", "tnpsc/science/physics-motion", "tnpsc/science/physics-optics", "tnpsc/science/science-tech"], "sat": ["tnpsc/tamil/bhakti-literature", "tnpsc/tamil/epic-literature", "tnpsc/tamil/ezhuthu-ilakkanam", "tnpsc/tamil/modern-tamil", "tnpsc/tamil/porul-ilakkanam", "tnpsc/tamil/post-sangam", "tnpsc/tamil/sangam", "tnpsc/tamil/sol-ilakkanam", "tnpsc/tamil/thirukkural", "tnpsc/tamil/tolkappiyam"], "sun": ["tnpsc/history/art-culture", "tnpsc/history/british-rule", "tnpsc/history/chola-pandya", "tnpsc/history/freedom-struggle", "tnpsc/polity/constitution-making", "tnpsc/polity/dpsp", "tnpsc/polity/elections", "tnpsc/polity/fundamental-rights"]}};
const QUIZ_EVERY_MS = 4 * 60 * 1000, ANSWER_MS = 15000;
const SEAT_RE = /^[A-L]([1-9]|1[0-8])$/;
const BAD = /\b(fuck\w*|shit\w*|bitch\w*|bastard|asshole|dick|madarchod|bhenchod|chutiya|punda|sunni|otha|thevdiya)\b/gi;
const clean = (s, n) => String(s || '').replace(/[<>]/g, '').trim().slice(0, n);

export class TheatreHall extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env); this.env = env;
    this.quiz = null; this.board = {}; this.qi = 0; this.chat = [];
    ctx.blockConcurrencyWhile(async () => { this.quiz = (await ctx.storage.get('quiz')) || null; this.board = (await ctx.storage.get('board')) || {}; this.chat = (await ctx.storage.get('chat')) || []; });
  }
  async save() { await this.ctx.storage.put({ quiz: this.quiz, board: this.board }); }
  peers() { return this.ctx.getWebSockets().map((ws) => ({ ws, a: ws.deserializeAttachment() || {} })); }
  seatMap() { const m = {}; for (const { a } of this.peers()) if (a.seat) m[a.seat] = a.name; return m; }
  top() { return Object.entries(this.board).filter(([, v]) => v.pts > 0).sort((x, y) => y[1].pts - x[1].pts || x[1].ms - y[1].ms).slice(0, 5).map(([id, v]) => ({ name: v.name, seat: v.seat, pts: v.pts })); }
  send(ws, m) { try { ws.send(JSON.stringify(m)); } catch {} }
  all(m) { const s = JSON.stringify(m); for (const ws of this.ctx.getWebSockets()) { try { ws.send(s); } catch {} } }
  broadcastSeats() { this.all({ t: 'seats', count: this.ctx.getWebSockets().length, seats: this.seatMap() }); }

  async fetch(request) {
    if (request.headers.get('Upgrade') !== 'websocket') return new Response('websocket only', { status: 426 });
    const hall = new URL(request.url).searchParams.get('hall'); if (hall) await this.ctx.storage.put('hall', hall);
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ id: crypto.randomUUID().slice(0, 8), name: 'Guest', seat: null });
    if (!(await this.ctx.storage.getAlarm())) await this.ctx.storage.setAlarm(Date.now() + QUIZ_EVERY_MS);
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, raw) {
    let m; try { m = JSON.parse(raw); } catch { return; }
    const a = ws.deserializeAttachment() || {};
    if (m.t === 'hello') {
      a.name = clean(m.name, 20) || 'Guest';
      ws.serializeAttachment(a);
      this.send(ws, { t: 'state', me: a.id, count: this.ctx.getWebSockets().length, seats: this.seatMap(), top: this.top(), chat: this.chat.slice(-40), quiz: this.quiz && { qid: this.quiz.qid, q: this.quiz.q, opts: this.quiz.opts, ends: this.quiz.ends } });
      this.broadcastSeats();
    } else if (m.t === 'sit') {
      const seat = String(m.seat || '');
      if (!SEAT_RE.test(seat)) return;
      if (this.peers().some((p) => p.ws !== ws && p.a.seat === seat)) return this.send(ws, { t: 'taken', seat });
      a.seat = seat; ws.serializeAttachment(a); this.broadcastSeats();
    } else if (m.t === 'ans') {
      const Q = this.quiz; if (!Q || m.qid !== Q.qid || Date.now() > Q.ends || Q.answers[a.id]) return;
      const i = Number(m.i); if (!Number.isInteger(i) || i < 0 || i >= Q.opts.length) return;
      Q.answers[a.id] = { i, ms: Date.now() - Q.start, name: a.name, seat: a.seat };
      await this.save();
      this.all({ t: 'answered', qid: Q.qid, n: Object.keys(Q.answers).length });
    } else if (m.t === 'react') {
      const now = Date.now(); if (now - (a.lr || 0) < 700) return; a.lr = now; ws.serializeAttachment(a);
      const e = ['1f525', '1f602', '1f92f', '1f44f', '2764_fe0f', '1f4af', '1f389', '1f9e0', '1f64f', '1f62e', '1f680', '1f4a1'].includes(m.e) ? m.e : null;
      if (e) this.all({ t: 'react', e, seat: a.seat || null });
    } else if (m.t === 'chat') {
      const now = Date.now(); if (now - (a.lc || 0) < 5000) return this.send(ws, { t: 'slow', wait: 5000 - (now - (a.lc || 0)) });
      let text = clean(m.text, 140).replace(/\s+/g, ' '); if (!text) return;
      if (/https?:|www\.|\.com\b/i.test(text)) return this.send(ws, { t: 'slow', why: 'No links in chat' });
      text = text.replace(BAD, (w) => '*'.repeat(w.length));
      a.lc = now; ws.serializeAttachment(a);
      const msg = { name: a.name, seat: a.seat, text, at: now };
      this.chat.push(msg); if (this.chat.length > 60) this.chat = this.chat.slice(-60);
      this.all({ t: 'chat', m: msg }); await this.ctx.storage.put('chat', this.chat);
    }
  }
  async webSocketClose(ws) { try { ws.close(); } catch {} this.broadcastSeats(); }
  async webSocketError(ws) { this.broadcastSeats(); }

  // alarm drives the quiz: start a round, then reveal it ANSWER_MS later
  async alarm() {
    if (!this.ctx.getWebSockets().length) { this.quiz = null; this.board = {}; await this.save(); return; }   // nobody here: sleep and reset the show
    if (this.quiz && !this.quiz.revealed) { this.reveal(); await this.save(); await this.ctx.storage.setAlarm(Date.now() + QUIZ_EVERY_MS); return; }
    const q = await this.pickQuestion();
    if (q) {
      const now = Date.now();
      this.quiz = { qid: 'q' + now, q: q.question, opts: q.options, correct: q.answer_index, start: now, ends: now + ANSWER_MS, answers: {}, revealed: false };
      await this.save();
      this.all({ t: 'quiz', qid: this.quiz.qid, q: q.question, opts: q.options, ends: this.quiz.ends });
      await this.ctx.storage.setAlarm(now + ANSWER_MS + 500);
    } else await this.ctx.storage.setAlarm(Date.now() + QUIZ_EVERY_MS);
  }
  reveal() {
    const Q = this.quiz; Q.revealed = true;
    let right = 0;
    for (const [id, x] of Object.entries(Q.answers)) {
      const b = this.board[id] || (this.board[id] = { name: x.name, seat: x.seat, pts: 0, ms: 0 });
      b.name = x.name; b.seat = x.seat;
      if (x.i === Q.correct) { right++; b.pts += 100 + Math.max(0, Math.round((ANSWER_MS - x.ms) / 150)); b.ms += x.ms; }
    }
    const n = Object.keys(Q.answers).length, pct = n ? Math.round(right / n * 100) : 0;
    this.all({ t: 'reveal', qid: Q.qid, correct: Q.correct, pct, n, top: this.top() });
  }
  // the hall's quiz bank: the day's subject from the site's quiz data (set by the client on connect)
  async pickQuestion() {
    const hall = (await this.ctx.storage.get('hall')) || 'main';
    const d = new Date(Date.now() + 5.5 * 3600e3), day = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][d.getUTCDay()];
    const sets = DAY_SETS[hall][day] || DAY_SETS.main.mon;
    for (let tries = 0; tries < 5; tries++) {
      const set = sets[(Math.random() * sets.length) | 0];
      try {
        const r = await this.env.ASSETS.fetch(new Request('https://x/assets/quiz-data/' + set + '.json'));
        if (!r.ok) continue;
        const strip = (o) => String(o).replace(/^\s*\(?[A-Da-d][.):]\s+/, '').trim();
        const qs = (await r.json()).questions.filter((q) => !q.retired && Array.isArray(q.options) && q.options.length === 4 && q.question.length < 160 && Number.isInteger(q.answer_index)
          && q.options.map(strip).every((o) => o.length > 2 && o.length < 60 && !/\b(above|both|neither|none of)\b/i.test(o)) && new Set(q.options.map((o) => strip(o).toLowerCase())).size === 4)
          .map((q) => ({ ...q, options: q.options.map(strip) }));
        if (qs.length) return qs[(Math.random() * qs.length) | 0];
      } catch {}
    }
    return null;
  }
}

let newsCache = null;
async function latestNews() {
  if (newsCache && Date.now() - newsCache.at < 3 * 3600e3) return newsCache.data;
  const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36', 'Accept-Language': 'en-IN,en;q=0.9' };
  const pick = async (q, okChannel) => {
    try {
      const h = await (await fetch('https://www.youtube.com/results?search_query=' + encodeURIComponent(q) + '&sp=CAISBAgCEAE%253D', { headers: UA })).text();
      const k = h.indexOf('var ytInitialData = '); if (k < 0) return [];
      const d = JSON.parse(h.slice(k + 20, h.indexOf(';</script>', k)));
      const vr = []; (function walk(o) { if (o && typeof o === 'object') { if (o.videoRenderer) vr.push(o.videoRenderer); for (const x of Object.values(o)) walk(x); } })(d);
      const out = [];
      for (const v of vr) {
        const title = (v.title?.runs || []).map((r) => r.text).join(''), ch = (v.ownerText?.runs || []).map((r) => r.text).join(''), len = v.lengthText?.simpleText || '';
        if (!len || !okChannel.test(ch) || /[ऀ-ॿ]|hindi/i.test(title)) continue;
        const secs = len.split(':').reduce((a, x) => a * 60 + +x, 0);
        if (secs > 900) out.push({ id: v.videoId, secs, title: title.slice(0, 100), channel: ch });
        if (out.length >= 2) break;
      }
      return out;
    } catch { return []; }
  };
  const data = { main: await pick('The Hindu newspaper analysis today UPSC English', /English/i), tnpsc: await pick('The Hindu editorial analysis in Tamil TNPSC', /Tamil|TNPSC/i) };
  if (data.main.length || data.tnpsc.length) newsCache = { at: Date.now(), data };
  return data;
}
export function theatreRoute(request, env, pathname) {
  if (pathname === '/api/theatre/news') return latestNews().then((d) => new Response(JSON.stringify(d), { headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=1800' } }));
  const m = pathname.match(/^\/api\/theatre\/(main|tnpsc)\/ws$/);
  if (!m) return new Response('not found', { status: 404 });
  const stub = env.THEATRE.get(env.THEATRE.idFromName(m[1]));
  return stub.fetch(new Request(request.url + (request.url.includes('?') ? '&' : '?') + 'hall=' + m[1], request));
}

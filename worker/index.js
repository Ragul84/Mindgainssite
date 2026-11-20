/**
 * mindgains.ai Worker. Everything is static assets except the quiz bank.
 *
 * Why: the 170k-question bank used to ship as 323 public JSON files with answer_index and
 * explanation inside, linked from every quiz page. Any crawler could take it in a minute.
 * Now the files are unreachable from outside; the browser gets a round of 20 questions with
 * no answers, and asks for each answer only after picking one. A signed token ties every
 * answer request to a round this Worker issued, and both endpoints are rate-limited per IP,
 * so copying the bank means tens of thousands of throttled requests rather than one wget.
 */

import { CANARIES, canaryGroup } from './canaries.js';
import { makeGame } from './game.js';
import { limited } from './limits.js';

const ROUND_SIZE = 20;
const HALF = 10;
const TOKEN_TTL_MS = 3 * 60 * 60 * 1000;
const SET_RE = /^[a-z0-9-]+(\/[a-z0-9-]+){0,4}$/;

// Two legacy questions whose stored text contradicted their answer; fixed here so the
// answer the server checks matches what the student sees.
const REPAIRS = {
  'Consider: (A) All botanists are scientists. (B) No scientist is a mathematician. (C) Some botanists are mathematicians. Which statement is contradictory to the premises?': {
    question: 'Consider: (A) All botanists are scientists. (B) No scientist is a mathematician. Which conclusion follows?',
    options: ['No botanist is a mathematician.', 'Some scientists are mathematicians.', 'All botanists are mathematicians.', 'Some botanists are not scientists.'],
    answer_index: 0,
    explanation: 'All botanists are scientists, and no scientist is a mathematician. Therefore, no botanist can be a mathematician.',
  },
  'Given: (1) Some athletes are not mathematicians. (2) All mathematicians are scientists. Which of the following must be true?': {
    options: ['All athletes are scientists.', 'No scientist is an athlete.', 'Some athletes are not mathematicians.', 'Some scientists are athletes.'],
    answer_index: 2,
    explanation: 'The first premise directly guarantees that some athletes are not mathematicians. The second premise does not establish any athlete–scientist relationship.',
  },
};

const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex', ...extra },
});

const enc = new TextEncoder();
async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Same set loaded by many students in a row: keep parsed banks for the isolate's life.
const bankCache = new Map();
async function loadBank(env, set) {
  if (bankCache.has(set)) return bankCache.get(set);
  const res = await env.ASSETS.fetch(new Request(`https://assets.local/assets/quiz-data/${set}.json`));
  if (!res.ok) return null;
  const data = await res.json();
  const questions = (data.questions || []).map((q) => (REPAIRS[q.question] ? { ...q, ...REPAIRS[q.question] } : q));
  // Trap questions ride along with the real ones (see canaries.js).
  const group = canaryGroup(set);
  if (group) questions.push(...CANARIES[group]);
  const bank = { questions };
  if (bankCache.size > 40) bankCache.delete(bankCache.keys().next().value);
  bankCache.set(set, bank);
  return bank;
}

// `retired` marks a question kept only so the indices after it stay stable (ids are set#index).
const usable = (q) => !q.retired && Array.isArray(q.options)
  && q.options.length === 4
  && Number.isInteger(q.answer_index)
  && q.answer_index >= 0 && q.answer_index < 4
  && q.options.every((o) => String(o).trim().length > 2)
  && new Set(q.options.map((o) => String(o).trim().toLowerCase())).size === 4;

function shuffle(a) {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

// Same mix the page used to pick in the browser: half statement-style, half direct.
function pickRound(questions) {
  const pattern = /(?:Statement\s*\d+|Statement\s*[I|V|X]+|\b[1-9]\.|\(\d{1,2}\))/i;
  const stmts = [], directs = [];
  questions.forEach((q, i) => { if (usable(q)) (pattern.test(q.question) ? stmts : directs).push(i); });
  if (!stmts.length || !directs.length) return shuffle([...stmts, ...directs]).slice(0, ROUND_SIZE);
  const n = Math.max(HALF, Math.min(stmts.length, directs.length));
  return shuffle([...shuffle(stmts).slice(0, n), ...shuffle(directs).slice(0, n)]).slice(0, ROUND_SIZE);
}

// Rate limits (localLimited / limited) live in ./limits.js so the teacher programme shares them.

async function round(request, env) {
  const url = new URL(request.url);
  const set = (url.searchParams.get('set') || '').replace(/^\/+|\/+$/g, '').replace(/\.json$/, '');
  if (!SET_RE.test(set)) return json({ error: 'bad set' }, 400);
  const ip = request.headers.get('cf-connecting-ip') || 'na';
  if (await limited(env.QUIZ_ROUND_RL, 'r:' + ip, 12)) return json({ error: 'slow down' }, 429, { 'retry-after': '60' });
  const bank = await loadBank(env, set);
  if (!bank) return json({ error: 'not found' }, 404);
  const ids = pickRound(bank.questions);
  const exp = Date.now() + TOKEN_TTL_MS;
  const token = `${exp}.${await hmac(env.QUIZ_SECRET, `${set}|${ids.join(',')}|${exp}`)}`;
  return json({
    set, token, ids,
    questions: ids.map((i) => ({ id: i, question: bank.questions[i].question, options: bank.questions[i].options })),
  });
}

async function check(request, env) {
  if (request.method !== 'POST') return json({ error: 'POST only' }, 405);
  const ip = request.headers.get('cf-connecting-ip') || 'na';
  if (await limited(env.QUIZ_CHECK_RL, 'c:' + ip, 90)) return json({ error: 'slow down' }, 429, { 'retry-after': '60' });
  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad body' }, 400); }
  const { set, ids, token, id } = body || {};
  if (!SET_RE.test(set || '') || !Array.isArray(ids) || ids.length > ROUND_SIZE || typeof token !== 'string') return json({ error: 'bad request' }, 400);
  const [exp, sig] = token.split('.');
  if (!(Number(exp) > Date.now())) return json({ error: 'expired' }, 403);
  if (sig !== await hmac(env.QUIZ_SECRET, `${set}|${ids.join(',')}|${exp}`)) return json({ error: 'bad token' }, 403);
  if (!ids.includes(id)) return json({ error: 'not in round' }, 403);
  const bank = await loadBank(env, set);
  const q = bank && bank.questions[id];
  if (!q) return json({ error: 'not found' }, 404);
  return json({ id, answer_index: q.answer_index, explanation: q.explanation || '' });
}

// Cut-Off Run: /api/game/* (see game.js)
const game = makeGame({ json, hmac, loadBank, limited, usable });

import { TheatreHall, theatreRoute } from './theatre.js';
import { proRoute } from './pro.js';
import { StudyRoom, roomRoute } from './room.js';
import { teachRoute } from './teach.js';
import { growthServe } from './growth.js';
import { hooksServe } from './theatre-hooks.js';
import { rmWrap, rmDelegate } from './rank-mock.js';
export { TheatreHall, StudyRoom };

// Sunday State Rank Mock: mock instances live in the existing THEATRE namespace ("rankmock:<exam>");
// TheatreHall hands over to RankMock only on instances marked "rm:exam" in their own storage. No new DO class or migration.
rmDelegate(TheatreHall);

const SEC = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Content-Security-Policy': "frame-ancestors 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), usb=()',
};
const site = {
  async fetch(request, env) {
    const res = await route(request, env);
    if (res.status === 101 || res.webSocket) return res;
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(SEC)) if (!out.headers.has(k)) out.headers.set(k, v);
    return out;
  },
};
// rmWrap adds /api/mock/*, /play/theatre/mock/ and the Rank Mock entry on the theatre page; everything else goes to `site`.
export default rmWrap(site);
async function route(request, env) {
  {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/quiz/round') return round(request, env);
    if (pathname === '/api/quiz/check') return check(request, env);
    if (pathname.startsWith('/api/game/')) return game(request, env, pathname);
    if (pathname.startsWith('/api/pro/')) return proRoute(request, env, pathname);
    if (pathname.startsWith('/api/room/')) return roomRoute(request, env, pathname);
    if (pathname.startsWith('/api/theatre/')) return theatreRoute(request, env, pathname);
    // Teach on MindGains: /teach/, /t/<code>, /api/teach/*, and the footer link added to /assets/pv.js
    if (pathname.startsWith('/api/teach/') || pathname === '/teach' || pathname.startsWith('/teach/') || pathname.startsWith('/t/') || pathname === '/assets/pv.js') {
      const tr = await teachRoute(request, env, pathname);
      if (tr) return tr;
    }
    // The raw bank is for this Worker only.
    if (pathname.startsWith('/assets/quiz-data/')) return new Response('Not found', { status: 404 });
    // Static assets: growthServe (301s, SEO/theatre/pro/sitemap/llms page fixes) wrapped by hooksServe
    // (Live Theatre hooks page patch, /assets/mg-profile.js, NationLap profile hand-off). Each page patch is
    // anchor-checked and idempotent: a page that already carries the change is served unchanged.
    return hooksServe(request, env, growthServe);
  }
}

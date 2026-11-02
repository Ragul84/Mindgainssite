/**
 * Server-side reader for the MindWhite quiz bank in Upstash Redis (quiz:subject:* lists).
 * Read-only: only LINDEX is sent. The token stays in Worker secrets (REDIS_URL, REDIS_TOKEN);
 * the browser never sees it. Round ids look like rq:<keyNo>:<index>:<hash> so the submit
 * step can fetch the same item again and check the text did not change in between.
 */
import { REDIS_MAP } from './redis_map.js';

const KEYS = Object.keys(REDIS_MAP).sort();
export const BANK_EXAMS = ['upsc', 'tnpsc', 'ssc', 'rrb', 'banking', 'samacheer', 'ncert'];
const EXAM_NAME = { upsc: 'UPSC', tnpsc: 'TNPSC', ssc: 'SSC', rrb: 'RRB', banking: 'Banking', samacheer: 'Samacheer (TN school)', ncert: 'NCERT' };
const BAD = /\b(figure|diagram|given below image|shown above|graph below|following picture|qr code)\b/i;

export const redisReady = (env) => !!(env.REDIS_URL && env.REDIS_TOKEN);

async function pipe(env, cmds) {
  for (const c of cmds) if (c[0] !== 'LINDEX') throw new Error('read only');
  const r = await fetch(env.REDIS_URL.replace(/\/$/, '') + '/pipeline', {
    method: 'POST', headers: { authorization: 'Bearer ' + env.REDIS_TOKEN, 'content-type': 'application/json' }, body: JSON.stringify(cmds),
  });
  if (!r.ok) return null;
  return (await r.json()).map((x) => x && x.result);
}
const norm = (t) => String(t).toLowerCase().replace(/[^a-z0-9\u0B80-\u0BFF]+/g, '');
async function h6(t) {
  const d = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(norm(t)));
  return Array.from(new Uint8Array(d).slice(0, 4), (b) => b.toString(16).padStart(2, '0')).join('');
}
function answerOf(q, o) {
  let a = q.answer_index ?? q.correct_answer;
  if (typeof a === 'number') return Number.isInteger(a) && a >= 0 && a < o.length ? a : -1;
  if (typeof a === 'string') {
    const s = a.trim();
    if (/^\d$/.test(s)) return +s < o.length ? +s : -1;
    if (/^[A-Da-d]$/.test(s)) { const i = 'ABCD'.indexOf(s.toUpperCase()); return i < o.length ? i : -1; }
    return o.findIndex((x) => x.toLowerCase() === s.toLowerCase());
  }
  return -1;
}
// Same rules as tools/build_redis_map.py, so the counts in the report match what a round can serve.
export function cleanRedis(raw) {
  let q;
  try { q = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return null; }
  if (!q) return null;
  const t = String(q.question || q.question_text || q.prompt || '').trim();
  const o = Array.isArray(q.options) ? q.options.map((x) => String(x ?? '').trim()) : [];
  if (!t || t.length > 320 || BAD.test(t) || o.length < 2 || o.length > 4 || o.some((x) => !x || x.length > 90)) return null;
  if (new Set(o.map((x) => x.toLowerCase())).size !== o.length) return null;
  const a = answerOf(q, o);
  if (a < 0) return null;
  const ex = (Array.isArray(q.exam_types) ? q.exam_types : []).map((e) => String(e).toLowerCase());
  return { question: t, options: o, answer_index: a, explanation: String(q.explanation || '').slice(0, 240), difficulty: q.difficulty || 'medium', exams: ex };
}

export function examList() {
  const n = {};
  for (const k of KEYS) for (const [e, c] of Object.entries(REDIS_MAP[k].e)) if (BANK_EXAMS.includes(e)) n[e] = (n[e] || 0) + c;
  return BANK_EXAMS.filter((e) => n[e]).map((e) => ({ id: e, name: EXAM_NAME[e], questions: n[e] }));
}

function keysFor(subj, exam) {
  const out = [];
  KEYS.forEach((k, i) => {
    const m = REDIS_MAP[k];
    if (m.s !== subj) return;
    const w = exam === 'all' ? Object.values(m.e).reduce((a, b) => a + b, 0) : m.e[exam] || 0;
    if (w > 0) out.push([i, w]);
  });
  return out;
}
const wpick = (arr) => { let s = 0; for (const x of arr) s += x[1]; let r = Math.random() * s; for (const x of arr) { if ((r -= x[1]) < 0) return x; } return arr[arr.length - 1]; };

/** Fill up to n items for the given game subjects and exam. seen/exclude hold ids and text hashes. */
export async function redisRound(env, { subjects, exam, n, exclude, seen, isLong }) {
  const items = [], texts = new Set();
  const pools = subjects.map((s) => [s, keysFor(s, exam)]).filter((p) => p[1].length);
  if (!pools.length) return items;
  for (let pass = 0; pass < 3 && items.length < n; pass++) {
    const picks = [];
    for (let j = 0; j < (n - items.length) * 2 + 4; j++) {
      const [subj, ks] = pools[(items.length + j) % pools.length];
      const [ki] = wpick(ks), m = REDIS_MAP[KEYS[ki]];
      picks.push({ subj, ki, idx: (Math.random() * m.n) | 0 });
    }
    const res = await pipe(env, picks.map((p) => ['LINDEX', KEYS[p.ki], p.idx]));
    if (!res) break;
    for (let j = 0; j < picks.length && items.length < n; j++) {
      const q = cleanRedis(res[j]);
      if (!q) continue;
      const kx = KEYS[picks[j].ki].split(':')[3];
      if (exam !== 'all' && q.exams.length && !q.exams.includes(exam) && kx !== exam) continue;
      const h = await h6(q.question), id = `rq:${picks[j].ki}:${picks[j].idx}:${h}`, nt = norm(q.question);
      if (seen.has(id) || exclude.has(id) || texts.has(nt)) continue;
      seen.add(id); texts.add(nt);
      items.push({ id, subject: picks[j].subj, exam: (exam === 'all' ? (kx || 'mix') : exam).toUpperCase(), question: q.question, options: q.options,
        answer_index: q.answer_index, explanation: q.explanation, source: '', pyq_year: null,
        difficulty: { easy: 1, medium: 2, hard: 3 }[q.difficulty] || 2, long: isLong(q) });
    }
  }
  return items;
}

/** Re-read one item for marking. Returns null if the id is malformed or the stored text changed. */
export async function redisById(env, id) {
  const m = /^rq:(\d+):(\d+):([0-9a-f]{8})$/.exec(id);
  if (!m || !redisReady(env)) return null;
  const key = KEYS[+m[1]];
  if (!key) return null;
  const res = await pipe(env, [['LINDEX', key, +m[2]]]);
  const q = res && cleanRedis(res[0]);
  if (!q || (await h6(q.question)) !== m[3]) return null;
  return { q, subj: REDIS_MAP[key].s };
}

/**
 * Cut-Off Run game API (mindgains.ai/api/game/*).
 *
 * The runner needs the answer key on the device while a level plays (gates resolve instantly),
 * so a game round carries answers. What keeps the bank safe is the same idea as /api/quiz:
 * small rounds, a signed token, and a strict per-IP rate limit. The raw quiz-data files stay
 * blocked. What keeps the league honest: the client never sends a score. It sends its answers;
 * this Worker re-marks them against the bank, checks the timing, and computes the points.
 *
 * Routes
 *   GET  /api/game/round?subjects=Polity,History&n=30&pyq=0&exclude=id,id
 *   POST /api/game/submit      {token, answers:[{id,c,ms}], lv, seed, win, score, device}
 *   GET  /api/game/league?week=ID
 *   GET  /api/game/challenge?code=CR..
 *
 * Bindings: QUIZ_SECRET (existing secret), GAME_DB (D1, new), GAME_ROUND_RL + GAME_SUBMIT_RL
 * (rate limit, new). Optional vars: SUPABASE_URL, SUPABASE_ANON_KEY, PROFILE_TABLE.
 */

import { redisReady, redisRound, redisById, examList, BANK_EXAMS } from './redisbank.js';

const ROUND_MAX = 30;
const ROUND_TTL_MS = 30 * 60 * 1000;
const DAILY_CAP = 3000;
const ROUND_CAP = 600;
const SUBJECTS = ['Polity', 'History', 'Geography', 'Economy', 'Environment', 'Science', 'Current Affairs', 'CSAT'];

// Game subject -> quiz-data sets. Exam-wide general studies only; state-specific sets are left out.
const SETS = {
  Polity: ['upsc/polity/constitution-features', 'upsc/polity/constitutional-bodies', 'upsc/polity/dpsp', 'upsc/polity/executive', 'upsc/polity/federalism', 'upsc/polity/fundamental-rights', 'upsc/polity/int-relations', 'upsc/polity/judiciary', 'upsc/polity/local-govt', 'upsc/polity/parliament', 'ssc/polity/constitution', 'ssc/polity/fundamental-rights', 'ssc/polity/governance'],
  History: ['upsc/history/1857-revolt', 'upsc/history/ancient-kingdoms', 'upsc/history/art-culture', 'upsc/history/british-conquest', 'upsc/history/gandhi-era', 'upsc/history/indus-valley', 'upsc/history/medieval-india', 'upsc/history/national-movement', 'upsc/history/post-1947', 'upsc/history/prehistoric', 'upsc/history/world-history', 'ssc/history/ancient', 'ssc/history/medieval', 'ssc/history/modern'],
  Geography: ['upsc/geography/agriculture-geo', 'upsc/geography/climate', 'upsc/geography/map-based', 'upsc/geography/natural-resources', 'upsc/geography/physical-india', 'upsc/geography/physical-world', 'upsc/geography/population', 'upsc/geography/rivers-drainage', 'upsc/geography/transport-infra', 'ssc/geography/india-geo', 'ssc/geography/world-geo'],
  Economy: ['upsc/economics/agriculture-eco', 'upsc/economics/budget-fiscal', 'upsc/economics/economic-reforms', 'upsc/economics/industry-msme', 'upsc/economics/inflation', 'upsc/economics/money-banking', 'upsc/economics/national-income', 'upsc/economics/poverty-inclusion', 'upsc/economics/trade-balance', 'ssc/economy/banking', 'ssc/economy/economy'],
  Environment: ['upsc/environment/biodiversity', 'upsc/environment/climate-change', 'upsc/environment/ecology-basics', 'upsc/environment/env-laws', 'upsc/environment/pollution', 'upsc/environment/protected-areas', 'upsc/geography/environment-eco', 'ssc/geography/environment'],
  Science: ['upsc/science/biology', 'upsc/science/biotech', 'upsc/science/chemistry', 'upsc/science/defence-tech', 'upsc/science/disease-health', 'upsc/science/energy', 'upsc/science/physics', 'upsc/science/space-tech', 'ssc/science/science-tech'],
  'Current Affairs': ['rrb/general-aware/current-affairs', 'ssc/polity/current-gk'],
  CSAT: ['upsc/csat-quant/data-sufficiency', 'upsc/csat-quant/logical-reasoning', 'upsc/csat-quant/number-system', 'upsc/csat-quant/percentage', 'upsc/csat-quant/speed-distance', 'upsc/csat-quant/time-work'],
};
const SET_OF = new Map();
for (const [subj, sets] of Object.entries(SETS)) for (const s of sets) SET_OF.set(s, subj);

const DIFF = { easy: 1, medium: 2, hard: 3 };

// ---------- Previous year questions (Supabase table pyq_questions, read server-side) ----------
// Only rows with an official or verified key, 4 options, no figure, English text, and a subject we can place.
const PYQ_EXAMS = { upsc: 'UPSC', tnpsc: 'TNPSC' };
const PYQ_FILTER = 'question_type=eq.objective&answer_source=in.(official-key,ticked-verified)&nullified=is.false&needs_figure=is.false';
const PYQ_SEL = 'id,exam,year,subject,topic,question_text,options,answer_text,images';
const PYQ_RULES = [
  ['CSAT', /csat|aptitude|reasoning|mental ability|quantitative|comprehension|numerical|data interpretation|simplification|percentage|ratio/],
  ['Current Affairs', /current affairs|current events/],
  ['Polity', /polity|constitution|governance|panchayat|parliament|judiciary|administration|rights|lok sabha|rajya sabha|article \d|amendment|president|governor|election/],
  ['Environment', /environment|ecology|biodiversity|climate|pollution|wildlife|sanctuary|national park|wetland|species/],
  ['Economy', /econom|budget|bank|inflation|gdp|fiscal|monetary|tax|trade|rbi|finance|market/],
  ['Geography', /geograph|river|monsoon|soil|mountain|plateau|ocean|latitude|district|mineral|crop/],
  ['History', /history|culture|art|heritage|dynasty|movement|freedom|ancient|medieval|modern india|king|temple|sangam|literature|chola|mughal|congress|gandhi/],
  ['Science', /science|physics|chemistry|biology|technology|disease|vitamin|space|computer|energy|cell|virus|planet/],
];
function pyqSubject(r) {
  for (const f of [r.subject, r.topic, r.question_text]) {
    const t = String(f || '').toLowerCase();
    if (!t || t.includes('general tamil')) continue;
    for (const [s, re] of PYQ_RULES) if (re.test(t)) return s;
  }
  return null;
}
function cleanPyq(r) {
  const o = (Array.isArray(r.options) ? r.options : []).map((x) => String(x).trim());
  if (o.length !== 4 || new Set(o.map((x) => x.toLowerCase())).size !== 4 || o.some((x) => !x)) return null;
  if (Array.isArray(r.images) && r.images.length) return null;
  const a = String(r.answer_text || '').trim().toLowerCase();
  const hit = o.map((x, i) => (x.toLowerCase() === a ? i : -1)).filter((i) => i >= 0);
  if (hit.length !== 1) return null;
  const q = String(r.question_text || '').trim();
  if (q.length < 15 || /[\u0B80-\u0BFF\uFFFD]/.test(q + o.join('')) || /\b(figure|diagram)\b|given (map|graph)/i.test(q)) return null;
  const subj = pyqSubject(r);
  if (!subj) return null;
  return { id: 'pyq:' + r.id, exam: r.exam, year: Number(r.year) || null, subj, question: q, options: o, answer_index: hit[0] };
}
const pyqCache = new Map(); // exam -> {at, rows[]}
async function sbGet(env, path) {
  const key = env.SUPABASE_PYQ_KEY || env.SUPABASE_ANON_KEY;
  if (!env.SUPABASE_URL || !key) return null;
  const r = await fetch(env.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/' + path, { headers: { apikey: key, ...(key.startsWith('eyJ') ? { authorization: 'Bearer ' + key } : {}), prefer: 'count=exact' } });
  return r.ok ? r : null;
}
// Keep ~600 clean rows per exam per isolate for 15 minutes, taken from random offsets.
async function pyqPool(env, exam) {
  const c = pyqCache.get(exam);
  if (c && Date.now() - c.at < 15 * 60000 && c.rows.length) return c.rows;
  const head = await sbGet(env, `pyq_questions?select=id&exam=eq.${exam}&${PYQ_FILTER}&limit=1`);
  const total = head ? Number((head.headers.get('content-range') || '').split('/')[1]) || 0 : 0;
  if (!total) return [];
  const rows = [], seen = new Set();
  for (let k = 0; k < 3; k++) {
    const off = Math.floor(Math.random() * Math.max(1, total - 300));
    const r = await sbGet(env, `pyq_questions?select=${PYQ_SEL}&exam=eq.${exam}&${PYQ_FILTER}&order=id&offset=${off}&limit=300`);
    if (!r) continue;
    for (const row of await r.json()) { const q = cleanPyq(row); if (q && !seen.has(q.id)) { seen.add(q.id); rows.push(q); } }
  }
  pyqCache.set(exam, { at: Date.now(), rows });
  return rows;
}
// Level to plan. Story levels 1..OPEN (default 12, chapters of 3), then the endless Exam Season.
// Chapter 1 easy, chapters 2 and 3 medium, chapter 4 and the Season hard. Every 3rd Season stage
// (its boss) is a PYQ year gate: stage 3 is 2015, stage 6 is 2016, and so on, capped at PYQ_LAST_YEAR.
function levelPlan(lv, env, exParam) {
  const open = Math.max(3, Math.round((Number(env.STORY_OPEN) || 12) / 3) * 3), last = Number(env.PYQ_LAST_YEAR) || 2025;
  const tier = lv && lv % 12 === 0 ? 2 : lv >= 3 && lv % 4 === 0 ? 1 : 0;
  if (!lv) return { diff: 0, year: 0, exam: 'UPSC', tier: 0 };
  const diff = lv <= 3 ? 1 : lv <= 9 ? 2 : 3;
  const st = lv - open, gate = st > 0 && st % 3 === 0;
  const exam = String(exParam).toLowerCase() === 'tnpsc' ? 'TNPSC' : 'UPSC', first = exam === 'TNPSC' ? 2016 : 2015;
  return { diff, tier, exam, year: gate ? Math.min(last, first + st / 3 - 1) : 0, gatePyq: gate ? 2 : 0 };
}
const yearCache = new Map();
async function pyqYear(env, exam, year, subjects) {
  const k = exam + year;
  let rows = yearCache.get(k);
  if (!rows || Date.now() - rows.at > 15 * 60000) {
    const r = await sbGet(env, `pyq_questions?select=${PYQ_SEL}&exam=eq.${encodeURIComponent(exam)}&year=eq.${year}&${PYQ_FILTER}&limit=400`);
    rows = { at: Date.now(), list: r ? (await r.json()).map(cleanPyq).filter(Boolean) : [] };
    yearCache.set(k, rows);
  }
  let l = rows.list;
  if (subjects && subjects.length) { const f = l.filter((q) => subjects.includes(q.subj)); if (f.length) l = f; }
  return l.slice().sort(() => Math.random() - 0.5);
}
const SEEN_DAYS = 30, SEEN_KEEP = 800;
async function recentSeen(env, uid) {
  if (!env.GAME_DB) return [];
  try {
    const r = await env.GAME_DB.prepare('SELECT qid FROM game_seen WHERE uid = ?1 AND at > ?2 ORDER BY at DESC LIMIT ?3')
      .bind(uid, Date.now() - SEEN_DAYS * 864e5, SEEN_KEEP).all();
    return (r.results || []).map((x) => x.qid);
  } catch { return []; } // table missing: rounds still work, just without the repeat filter
}
async function markSeen(env, uid, ids) {
  if (!env.GAME_DB || !ids.length) return;
  try {
    const now = Date.now(), st = env.GAME_DB.prepare('INSERT OR REPLACE INTO game_seen (uid, qid, at) VALUES (?1, ?2, ?3)');
    const batch = ids.map((id) => st.bind(uid, id, now));
    if (Math.random() < 0.05) batch.push(env.GAME_DB.prepare('DELETE FROM game_seen WHERE at < ?1').bind(now - SEEN_DAYS * 864e5));
    await env.GAME_DB.batch(batch);
  } catch { /* best effort */ }
}
async function pyqById(env, id) {
  for (const c of pyqCache.values()) { const q = c.rows.find((x) => x.id === id); if (q) return q; }
  const r = await sbGet(env, `pyq_questions?select=${PYQ_SEL}&id=eq.${encodeURIComponent(id.slice(4))}&${PYQ_FILTER}&limit=1`);
  if (!r) return null;
  const row = (await r.json())[0];
  return row ? cleanPyq(row) : null;
}
const words = (s) => String(s || '').trim().split(/\s+/).length;
const isLong = (q) => {
  const t = String(q.question || '');
  return t.length > 140 || t.includes('\n') || /^(consider the following|with reference to|how many of the above)/i.test(t)
    || /statement\s*(\d|i)/i.test(t) || (q.options || []).some((o) => String(o).length > 45);
};
const b64u = (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));
const weekId = (ms) => Math.floor((Math.floor(ms / 86400000) + 3) / 7); // same formula as the game
const dayId = (ms) => Math.floor((ms + 5.5 * 3600000) / 86400000); // IST day for the daily cap
const rid = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, '0')).join('');

export function makeGame({ json, hmac, loadBank, limited, usable }) {
  async function bankQ(env, id) {
    if (id.startsWith('rq:')) return redisById(env, id);
    if (id.startsWith('pyq:')) { const p = await pyqById(env, id); return p ? { q: { question: p.question, answer_index: p.answer_index, options: p.options, difficulty: 'hard' }, subj: p.subj } : null; }
    const k = id.lastIndexOf('#');
    if (k < 0) return null;
    const set = id.slice(0, k), idx = Number(id.slice(k + 1));
    if (!SET_OF.has(set) || !Number.isInteger(idx)) return null;
    const bank = await loadBank(env, set);
    const q = bank && bank.questions[idx];
    return q ? { q, set, idx, subj: SET_OF.get(set) } : null;
  }

  async function identify(request, env, body) {
    const auth = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (auth && env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
      try {
        const base = env.SUPABASE_URL.replace(/\/$/, '');
        const h = { apikey: env.SUPABASE_ANON_KEY, authorization: 'Bearer ' + auth };
        const r = await fetch(base + '/auth/v1/user', { headers: h });
        if (r.ok) {
          const u = await r.json();
          let name = 'Aspirant', city = '';
          const t = env.PROFILE_TABLE || 'profiles';
          const p = await fetch(`${base}/rest/v1/${t}?id=eq.${encodeURIComponent(u.id)}&select=display_name,city`, { headers: h });
          if (p.ok) { const row = (await p.json())[0]; if (row) { name = row.display_name || name; city = row.city || ''; } }
          return { uid: u.id, name: String(name).slice(0, 24), city: String(city).slice(0, 24), guest: false };
        }
      } catch { /* fall through to guest */ }
    }
    // Guests: points are computed the same way but kept off the public league unless ALLOW_GUEST_LEAGUE is set.
    const dev = String((body && body.device) || '').replace(/[^a-z0-9]/gi, '').slice(0, 24);
    if (!dev) return null;
    return { uid: 'g_' + dev, name: 'Guest ' + dev.slice(0, 4).toUpperCase(), city: '', guest: true };
  }

  async function round(request, env) {
    const url = new URL(request.url);
    const ip = request.headers.get('cf-connecting-ip') || 'na';
    if (await limited(env.GAME_ROUND_RL, 'gr:' + ip, 6)) return json({ error: 'slow down' }, 429, { 'retry-after': '60' });
    const want = (url.searchParams.get('subjects') || '').split(',').map((s) => s.trim()).filter((s) => SUBJECTS.includes(s));
    const subjects = want.length ? want : SUBJECTS.filter((s) => s !== 'CSAT' && s !== 'Current Affairs');
    const n = Math.max(5, Math.min(ROUND_MAX, Number(url.searchParams.get('n')) || ROUND_MAX));
    const pyqMode = url.searchParams.get('pyq') || '0';
    const pyq = pyqMode === '1';
    const exParam = (url.searchParams.get('exam') || 'both').toLowerCase();
    const exams = (exParam === 'both' || exParam === 'all') ? Object.values(PYQ_EXAMS) : [PYQ_EXAMS[exParam]].filter(Boolean);
    // Main bank: the MindWhite Redis lists when the Worker has REDIS_URL + REDIS_TOKEN, else the legacy JSON sets.
    const bankExam = BANK_EXAMS.includes(exParam) ? exParam : 'all';
    const useRedis = redisReady(env) && url.searchParams.get('src') !== 'legacy';
    const exclude = new Set((url.searchParams.get('exclude') || '').split(',').slice(0, 300));
    const items = [], seen = new Set();
    // Progression (PROGRESSION_PLAN.md): level sets a difficulty band and, on Season boss stages, a PYQ year gate.
    const lv = Math.max(0, Math.min(9999, parseInt(url.searchParams.get('level') || url.searchParams.get('lv') || '0', 10) || 0));
    const plan = levelPlan(lv, env, exParam);
    const dq = String(url.searchParams.get('diff') || '').toLowerCase();
    const diff = ({ 1: 1, 2: 2, 3: 3, easy: 1, medium: 2, hard: 3 })[dq] || plan.diff;
    const topic = String(url.searchParams.get('topic') || '').toLowerCase().replace(/[^a-z0-9 -]/g, '').slice(0, 40);
    const yq = parseInt(url.searchParams.get('pyq_year') || '', 10);
    const gateYear = (yq >= 1990 && yq <= 2100) ? yq : plan.year;
    const gateExam = PYQ_EXAMS[exParam] || plan.exam;
    // No repeats per player: ids served in the last 30 days are skipped (D1 game_seen, keyed by login or device).
    const who = await identify(request, env, { device: url.searchParams.get('device') || '' }).catch(() => null);
    const seenRows = who ? await recentSeen(env, who.uid) : [];
    for (const id of seenRows) exclude.add(id);
    if (gateYear && !pyq) {
      for (const q of await pyqYear(env, gateExam, gateYear, want)) {
        if (items.length >= (plan.gatePyq || 1)) break;
        if (seen.has(q.id) || exclude.has(q.id)) continue;
        seen.add(q.id);
        items.push({ id: q.id, subject: q.subj, exam: q.exam, question: q.question, options: q.options, answer_index: q.answer_index,
          explanation: '', source: `${q.exam} ${q.year || ''}`.trim(), pyq_year: q.year, difficulty: 3, long: isLong(q), gate: true });
      }
    }
    // Previous year questions first: all of the round in PYQ mode, about a fifth in a normal level.
    const wantPyq = pyq ? n : pyqMode === 'mix' ? Math.round(n / 5) : 0;
    if (wantPyq) {
      let pool = [];
      for (const ex of exams) pool = pool.concat(await pyqPool(env, ex));
      if (!pyq && want.length) pool = pool.filter((q) => want.includes(q.subj));
      if (yq >= 1990) pool = pool.filter((q) => +q.year === yq);
      for (let t = 0; t < pool.length * 2 && items.length < wantPyq; t++) {
        const q = pool[(Math.random() * pool.length) | 0];
        if (!q || seen.has(q.id) || exclude.has(q.id)) continue;
        seen.add(q.id);
        items.push({ id: q.id, subject: q.subj, exam: q.exam, question: q.question, options: q.options, answer_index: q.answer_index,
          explanation: '', source: `${q.exam} ${q.year || ""}`.trim(), pyq_year: q.year, difficulty: 3, long: isLong(q) });
      }
    }
    if (!pyq && useRedis && items.length < n) {
      try { items.push(...await redisRound(env, { subjects, exam: bankExam, n: n - items.length, exclude, seen, isLong, topic, diff })); } catch { /* fall back to the legacy sets below */ }
    }
    for (let tries = 0; !pyq && items.length < n && tries < n * 10; tries++) {
      const subj = subjects[tries % subjects.length];
      const sets = SETS[subj];
      const set = sets[(Math.random() * sets.length) | 0];
      const bank = await loadBank(env, set);
      if (!bank || !bank.questions.length) continue;
      const idx = (Math.random() * bank.questions.length) | 0;
      const q = bank.questions[idx], id = `${set}#${idx}`;
      if (!q || !usable(q) || q.canary || seen.has(id) || exclude.has(id)) continue;
      seen.add(id);
      items.push({
        id, subject: subj, question: q.question, options: q.options, answer_index: q.answer_index,
        explanation: String(q.explanation || '').slice(0, 240), source: q.source || '', pyq_year: q.pyq_year || null,
        difficulty: DIFF[q.difficulty] || 2, long: isLong(q),
      });
    }
    const payload = b64u(JSON.stringify({ r: rid(), i: items.map((x) => x.id), t: Date.now(), e: bankExam }));
    const token = payload + '.' + await hmac(env.QUIZ_SECRET, 'game|' + payload);
    // The bank has no previous-year tags yet, so a PYQ-only request returns what it can and says so.
    if (who) await markSeen(env, who.uid, items.map((x) => x.id));
    return json({ token, items, exam: bankExam, source: useRedis ? 'bank' : 'legacy', pyq_available: items.some((x) => x.pyq_year), ttl: ROUND_TTL_MS,
      plan: { level: lv, diff, topic: topic || null, pyq_gate: gateYear ? `${gateExam} ${gateYear}` : null, tier: plan.tier, repeats_skipped: seenRows.length } });
  }

  async function submit(request, env) {
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405);
    const ip = request.headers.get('cf-connecting-ip') || 'na';
    if (await limited(env.GAME_SUBMIT_RL, 'gs:' + ip, 10)) return json({ error: 'slow down' }, 429, { 'retry-after': '60' });
    let body;
    try { body = await request.json(); } catch { return json({ error: 'bad body' }, 400); }
    const { token, answers } = body || {};
    if (typeof token !== 'string' || token.length > 9000 || !Array.isArray(answers) || answers.length > ROUND_MAX) return json({ error: 'bad request' }, 400);
    const [payload, sig] = token.split('.');
    if (!payload || sig !== await hmac(env.QUIZ_SECRET, 'game|' + payload)) return json({ error: 'bad token' }, 403);
    let P;
    try { P = JSON.parse(unb64u(payload)); } catch { return json({ error: 'bad token' }, 403); }
    const now = Date.now();
    if (!(now - P.t < ROUND_TTL_MS)) return json({ error: 'expired' }, 403);
    const who = await identify(request, env, body);
    if (!who) return json({ error: 'login required' }, 401);
    if (!env.GAME_DB) return json({ error: 'league storage not configured' }, 503);
    const db = env.GAME_DB;

    // Single use: the round id is the primary key.
    try {
      await db.prepare('INSERT INTO game_rounds_used (rid, uid, used_at) VALUES (?1, ?2, ?3)').bind(P.r, who.uid, now).run();
    } catch { return json({ error: 'round already submitted' }, 409); }

    const inRound = new Set(P.i), done = new Set();
    let correct = 0, wrong = 0, skipped = 0, tooFast = 0, pts = 0, msSum = 0;
    for (const a of answers) {
      if (!a || typeof a.id !== 'string' || !inRound.has(a.id) || done.has(a.id)) continue;
      done.add(a.id);
      const ms = Math.max(0, Math.min(120000, Number(a.ms) || 0));
      msSum += ms;
      const c = Number(a.c);
      if (!Number.isInteger(c) || c < 0) { skipped++; continue; }
      const b = await bankQ(env, a.id);
      if (!b) continue;
      const minMs = 450 + 12 * words(b.q.question); // nobody reads and steers faster than this
      if (ms < minMs) { tooFast++; continue; }
      if (c === b.q.answer_index) { correct++; pts += 10 * (DIFF[b.q.difficulty] || 2) / 2 + (isLong(b.q) ? 5 : 0); }
      else { wrong++; pts -= 3; } // negative marking, like the exam
    }
    const elapsed = now - P.t;
    if (done.size >= 4 && (elapsed < done.size * 900 || msSum > elapsed + 5000)) {
      await db.prepare('INSERT INTO game_runs (rid, uid, week, day, points, correct, wrong, flagged, created_at) VALUES (?1,?2,?3,?4,0,?5,?6,1,?7)')
        .bind(P.r, who.uid, weekId(now), dayId(now), correct, wrong, now).run();
      return json({ error: 'timing check failed', points: 0 }, 422);
    }
    const answered = correct + wrong;
    if (body.win && answered >= 3 && correct / answered >= 0.6) pts += 40;
    pts = Math.max(0, Math.min(ROUND_CAP, Math.round(pts)));

    const day = dayId(now), week = weekId(now);
    const used = await db.prepare('SELECT COALESCE(SUM(points),0) AS s FROM game_runs WHERE uid=?1 AND day=?2').bind(who.uid, day).first();
    const room = Math.max(0, DAILY_CAP - Number((used && used.s) || 0));
    const award = Math.min(pts, room);
    await db.batch([
      db.prepare('INSERT INTO game_runs (rid, uid, week, day, points, correct, wrong, flagged, created_at) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9)')
        .bind(P.r, who.uid, week, day, award, correct, wrong, tooFast ? 1 : 0, now),
      // The exam comes from the signed round token, not from the client body.
      db.prepare(`INSERT INTO game_league (uid, week, name, city, score, guest, updated_at, exam) VALUES (?1,?2,?3,?4,?5,?6,?7,?8)
                  ON CONFLICT(uid, week) DO UPDATE SET score = score + excluded.score, name = excluded.name, city = excluded.city, updated_at = excluded.updated_at,
                  exam = CASE WHEN excluded.exam <> '' THEN excluded.exam ELSE game_league.exam END`)
        .bind(who.uid, week, who.name, who.city, award, who.guest ? 1 : 0, now, BANK_EXAMS.includes(P.e) ? P.e : ''),
    ]);
    const tot = await db.prepare('SELECT score FROM game_league WHERE uid=?1 AND week=?2').bind(who.uid, week).first();

    // A friend challenge is only issued for a run that passed the checks above.
    let challenge = null;
    const lv = Number(body.lv), seed = Number(body.seed), score = Number(body.score);
    if (Number.isInteger(lv) && lv > 0 && lv < 100 && Number.isInteger(seed) && seed >= 0 && Number.isFinite(score) && score >= 0) {
      const target = Math.min(Math.round(score), 4000 + lv * 400);
      challenge = await signChallenge(env, lv, seed, target);
    }
    return json({ points: award, capped: award < pts, correct, wrong, skipped, too_fast: tooFast, week, week_total: Number((tot && tot.score) || award), challenge });
  }

  async function signChallenge(env, lv, seed, target) {
    const core = `CR${lv.toString(36)}-${seed.toString(36)}-${target.toString(36)}`.toUpperCase();
    return core + '-' + (await hmac(env.QUIZ_SECRET, 'ch|' + core)).slice(0, 8).toUpperCase().replace(/[-_]/g, 'X');
  }

  async function challenge(request, env) {
    const code = String(new URL(request.url).searchParams.get('code') || '').trim().toUpperCase();
    const m = /^(CR[0-9A-Z]+-[0-9A-Z]+-[0-9A-Z]+)-([0-9A-Z]{8})$/.exec(code);
    if (!m) return json({ ok: false }, 400);
    const want = (await hmac(env.QUIZ_SECRET, 'ch|' + m[1])).slice(0, 8).toUpperCase().replace(/[-_]/g, 'X');
    if (want !== m[2]) return json({ ok: false }, 403);
    const [lv, seed, target] = m[1].slice(2).split('-').map((x) => parseInt(x, 36));
    return json({ ok: true, lv, seed, target });
  }

  async function league(request, env) {
    if (!env.GAME_DB) return json([]);
    const url = new URL(request.url);
    const week = Number(url.searchParams.get('week')) || weekId(Date.now());
    const guests = env.ALLOW_GUEST_LEAGUE === '1' ? '' : 'AND guest = 0';
    if (url.searchParams.get('v') === '2') return leagueV2(request, env, url, week, guests);
    const { results } = await env.GAME_DB.prepare(`SELECT uid, name, city, score FROM game_league WHERE week = ?1 ${guests} ORDER BY score DESC LIMIT 30`).bind(week).all();
    const me = await identify(request, env, { device: url.searchParams.get('device') });
    return json((results || []).map((r) => ({ name: r.name, city: r.city, score: r.score, me: !!(me && me.uid === r.uid) })));
  }

  // Public Hall of Fame feed: weekly top players with optional city and exam filters.
  async function leagueV2(request, env, url, week, guests) {
    const db = env.GAME_DB;
    const city = String(url.searchParams.get('city') || '').trim().slice(0, 24);
    const exam = String(url.searchParams.get('exam') || '').toLowerCase();
    const lim = Math.max(3, Math.min(50, Number(url.searchParams.get('limit')) || 20));
    const where = ['week = ?1'], args = [week];
    if (city) { where.push(`city = ?${args.length + 1} COLLATE NOCASE`); args.push(city); }
    if (BANK_EXAMS.includes(exam)) { where.push(`exam = ?${args.length + 1}`); args.push(exam); }
    const w = where.join(' AND ') + ' ' + guests;
    const { results } = await db.prepare(`SELECT uid, name, city, exam, score FROM game_league WHERE ${w} AND score > 0 ORDER BY score DESC, updated_at ASC LIMIT ${lim}`).bind(...args).all();
    const cnt = await db.prepare(`SELECT COUNT(*) AS n FROM game_league WHERE ${w} AND score > 0`).bind(...args).first();
    const cities = await db.prepare(`SELECT city, COUNT(*) AS n FROM game_league WHERE week = ?1 AND city <> '' ${guests} GROUP BY city COLLATE NOCASE ORDER BY n DESC LIMIT 20`).bind(week).all();
    const exams = await db.prepare(`SELECT exam, COUNT(*) AS n FROM game_league WHERE week = ?1 AND exam <> '' ${guests} GROUP BY exam ORDER BY n DESC`).bind(week).all();
    const me = await identify(request, env, { device: url.searchParams.get('device') });
    const resetsAt = ((week + 1) * 7 - 3) * 86400000; // Monday 00:00 UTC, same week formula as the game
    return json({
      week, resets_at: resetsAt, players: Number((cnt && cnt.n) || 0),
      cities: (cities.results || []).map((r) => r.city), exams: (exams.results || []).map((r) => r.exam),
      rows: (results || []).map((r, i) => ({ rank: i + 1, name: r.name, city: r.city, exam: r.exam ? r.exam.toUpperCase() : '', score: r.score, me: !!(me && me.uid === r.uid) })),
    }, 200, { 'cache-control': 'public, max-age=30' });
  }

  return async function handle(request, env, pathname) {
    if (pathname === '/api/game/round') return round(request, env);
    if (pathname === '/api/game/submit') return submit(request, env);
    if (pathname === '/api/game/league') return league(request, env);
    if (pathname === '/api/game/exams') return json({ exams: redisReady(env) ? examList() : [], pyq: Object.values(PYQ_EXAMS) });
    if (pathname === '/api/game/challenge') return challenge(request, env);
    return json({ error: 'not found' }, 404);
  };
}

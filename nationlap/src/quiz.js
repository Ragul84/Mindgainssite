// Quiz system — item boxes ask a real exam question instead of an instant roulette.
// Correct answer -> good item + XP. Wrong answer -> no item, small XP still for attempting.
// Live questions via the same local Upstash proxy used by the other RTW build
// (server/quiz-proxy.mjs on 127.0.0.1:8787). No offline fallback bank — if the proxy
// is down we show a clear "offline" state and just grant a random item so the race
// never stalls.
import { CHARACTERS } from './config.js';

const PROXY = 'http://127.0.0.1:8787';

const SUBJECT_POOL = {
  Polity: 'polity',
  History: 'history',
  Geography: 'geography',
  Economy: 'economics',
  Quant: 'maths',
  Science: 'science',
  Reasoning: 'reasoning',
  'Current Affairs': 'current-affairs',
};
const POOLS = [...new Set(Object.values(SUBJECT_POOL))];
// A pool that always has questions, used when the requested one is empty (Current Affairs).
const FALLBACK_POOL = 'polity';
const ASKED_KEY = 'rtw_tkr_asked_qids';

const CLOSING_RE = /(Which of the (?:above )?statements?|Which of the following|How many of the (?:above|following)|Select the correct)\b/i;
// An option that only selects among numbered statements — "2 only", "Both 1 and 2",
// "1 and 3 only", "1, 2 and 3", "Neither 1 nor 2", "None of the above". Matching the shape
// rather than listing exact strings, because the pools use a 2-statement set AND a
// 3-statement set ("1 and 2 only" / "2 and 3 only" / "1 and 3 only" / "1, 2 and 3"), and
// an exact-string list silently missed the latter.
const STATEMENT_OPT_RE = /^[\s\d,]*(?:(?:only|both|and|neither|nor|none|all|of|the|above|statements?)\b[\s\d,]*)*$/i;
function isStatementOption(o) {
  const s = String(o).trim();
  return s.length > 0 && /\d|none|all/i.test(s) && STATEMENT_OPT_RE.test(s);
}

/**
 * Lay a statements question out readably: stem, one statement per line, closing question.
 *
 * Two shapes come out of the pools. Most are "1. Foo 2. Bar Which of the statements...".
 * Some are written as "Statement 1: Foo Statement 2: Bar" — run together, and a chunk of
 * those carry NO stem and NO closing question at all, so on screen they read as two loose
 * assertions with nothing asked. Their options are always 1 only / 2 only / Both / Neither,
 * which is exactly the standard wrapper, so we restore it rather than leaving the player to
 * guess what is being asked. `opts` gates that: without the tell-tale option set we only
 * reformat, never add words.
 */
function formatQuestionText(text, opts) {
  if (!text) return '';
  let out = String(text).trim();

  // "Statement 1: Foo" -> "1. Foo", matching the numbering the options refer to
  out = out.replace(/(^|\s)Statement\s*(\d+)\s*[:.]\s*/gi, '$1\n$2. ');

  out = out.replace(/\s+(?=[1-9]\.\s+[A-Z])/g, '\n');
  // Only pull the closing question onto its own line when there IS a statement list above it.
  // Unconditionally breaking before "Which of the following" split ordinary stems mid-sentence
  // ("Article 33 is concerned with / which of the following?").
  if (/(^|\n)\d+\.\s/.test(out)) {
    // Must follow a sentence end. Breaking on the phrase wherever it appeared cut
    // "Match List-I ... and / select the correct answer" in half mid-clause.
    out = out.replace(/([.?])\s+(?=(Which of the (?:above )?statements?|Which of the following|How many of the (?:above|following)|Select the correct)\b)/i, '$1\n');
  }
  // collapse runs of 3+ only: a genuine blank line separates List-I from List-II in
  // match-the-following questions, and flattening those ran the two lists together
  out = out.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

  // The wrapper is only ever added to something that genuinely IS a statement list: at least
  // two numbered statements on their own lines. Gating on the options alone was not enough —
  // a date question's options ("1942", "1943"...) are bare numbers too, and every plain MCQ
  // with numeric answers picked up a spurious "Which of the statements..." line.
  const hasList = /(^|\n)1\.\s/.test(out) && /(^|\n)2\.\s/.test(out);
  const optsSelectStatements = Array.isArray(opts) && opts.length >= 3 && opts.every(isStatementOption);
  if (hasList && optsSelectStatements) {
    if (/^\s*\d+\.\s/.test(out)) out = 'Consider the following statements:\n' + out;
    if (!CLOSING_RE.test(out)) out += '\nWhich of the statements given above is/are correct?';
  }
  return out;
}

function qId(item) {
  if (item?.id) return String(item.id);
  const s = String(item?.q || '').slice(0, 80);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return 'h' + (h >>> 0).toString(36);
}
function loadAsked() {
  try {
    const raw = JSON.parse(localStorage.getItem(ASKED_KEY) || '[]');
    return new Set(Array.isArray(raw) ? raw.slice(-600) : []);
  } catch (e) { return new Set(); }
}
function saveAsked(set) {
  try { localStorage.setItem(ASKED_KEY, JSON.stringify([...set].slice(-600))); } catch (e) {}
}

function el(tag, cls, parent, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}

export function createQuizSystem({ uiRoot, onResult }) {
  const root = el('div', 'quiz-overlay hidden', uiRoot);
  root.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-topic"></div>
      <div class="quiz-q"></div>
      <div class="quiz-opts"></div>
      <div class="quiz-hint"></div>
    </div>`;
  const topicEl = root.querySelector('.quiz-topic');
  const qEl = root.querySelector('.quiz-q');
  const optsEl = root.querySelector('.quiz-opts');
  const hintEl = root.querySelector('.quiz-hint');

  const cache = new Map(); // pool -> question[]
  const asked = loadAsked();
  let open = false;
  let liveOk = null;
  let currentPool = null;
  let resultCb = null;

  fetch(PROXY + '/health').then((r) => r.json()).then((h) => { liveOk = !!(h && h.ok && h.redis); }).catch(() => { liveOk = false; });

  function poolFor(character) {
    return (character && SUBJECT_POOL[character.subject]) || POOLS[(Math.random() * POOLS.length) | 0];
  }

  function normalise(raw, pool) {
    return (Array.isArray(raw) ? raw : [])
      .map((q, i) => ({
        id: q.id || (pool + '-' + i),
        q: q.q || q.question,
        opts: Array.isArray(q.opts) ? q.opts : Array.isArray(q.options) ? q.options : null,
        ans: typeof q.ans === 'number' ? q.ans : q.answer_index,
        explain: q.explain || q.explanation || '',
      }))
      .filter((q) => q.q && Array.isArray(q.opts) && q.opts.length && typeof q.ans === 'number');
  }

  /** The bank shipped with the build (dev/export-quiz.mjs), used when the proxy isn't there. */
  function fetchStatic(pool) {
    return fetch(`assets/quiz/${pool}.json?v=20261017`)
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((raw) => normalise(raw, pool))
      .catch(() => []);
  }

  /**
   * Live proxy first, static bank second.
   *
   * PROXY is 127.0.0.1, which only exists on a dev machine — in production it is unreachable,
   * and a page served over https refuses the plain-http request as mixed content before it
   * even leaves the browser. Without the fallback every item box would open a quiz that never
   * loads, which is the entire learning loop gone. So the deployed build reads the exported
   * bank, and a developer running the proxy still gets whatever is live in Upstash.
   */
  function fetchPool(pool) {
    if (cache.has(pool)) return Promise.resolve(cache.get(pool));
    const u = new URL(PROXY + '/quiz');
    u.searchParams.set('pool', pool);
    u.searchParams.set('n', '50');
    const live = liveOk === false
      ? Promise.reject(new Error('proxy known down'))
      : fetch(u.toString())
        .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then((data) => {
          const list = normalise(Array.isArray(data?.questions) ? data.questions : [], pool);
          if (!list.length) throw new Error('empty pool');
          liveOk = true;
          return list;
        });

    return live
      .catch(() => { liveOk = false; return fetchStatic(pool); })
      .then((list) => {
        // Current Affairs has no questions in the bank at all, so its zones would reach an
        // item box and get nothing — a silent dead end rather than a quiz. Any pool that comes
        // back empty borrows from the general bank instead, so a box always asks something.
        if (!list.length && pool !== FALLBACK_POOL) {
          borrowed.add(pool);
          return fetchPool(FALLBACK_POOL).then((alt) => { cache.set(pool, alt); return alt; });
        }
        cache.set(pool, list);
        return list;
      });
  }

  // Pools that came back empty and borrowed the fallback bank: their questions are not theirs.
  const borrowed = new Set();
  const POOL_LABEL = {
    polity: 'Polity', 'polity-dpsp': 'Polity · DPSP', 'polity-fr': 'Polity · Fundamental Rights',
    'polity-judiciary': 'Polity · Judiciary', 'polity-parliament': 'Polity · Parliament', 'polity-ncert-c11': 'Polity · NCERT XI',
    history: 'History', geography: 'Geography', economics: 'Economy', science: 'Science',
    maths: 'Maths', reasoning: 'Reasoning', 'current-affairs': 'Current Affairs',
  };
  /* The heading must name where the question really came from. A track zone ("Indus Valley
     Civilisation") asks from its whole subject pool, so naming the zone put a Mirabai question
     under Indus Valley. Only questions built from the zone itself (lesson cards, affairs facts)
     carry the zone's topic. */
  function labelFor(zone, pool) {
    if (zone?.items) return zone.topic || zone.subject || 'General Knowledge';
    if (borrowed.has(pool)) return POOL_LABEL[FALLBACK_POOL];
    return POOL_LABEL[pool] || zone?.subject || 'General Knowledge';
  }

  function pickQuestion(list) {
    const unseen = list.filter((q) => !asked.has(qId(q)));
    const pool = unseen.length ? unseen : list;
    return pool[(Math.random() * pool.length) | 0];
  }

  /**
   * Show a question for `kart`'s subject — or, if `zone` is given (the topic zone the player
   * is currently driving through, see billboards.js's zones + main.js's zone lookup), ask from
   * that zone's pool instead: study the billboards, get quizzed on exactly that material.
   * Calls onResult({ correct, kart }) once answered (or immediately with correct:null if the
   * proxy has no questions available, so the caller can just grant a normal item and move on).
   */
  function ask(kart, zone) {
    if (open) return;
    open = true;
    root.classList.remove('hidden');
    currentPool = zone?.pool || poolFor(kart?.character);
    topicEl.textContent = (zone?.topic || kart?.character?.subject || 'General Knowledge').toUpperCase();
    qEl.textContent = 'Loading question…';
    optsEl.innerHTML = '';
    hintEl.textContent = '';

    // A zone may carry its own questions (the affairs race: this lap's facts) instead of a
    // pool to fetch.
    (zone?.items ? Promise.resolve(zone.items) : fetchPool(currentPool)).then((list) => {
      if (!open) return; // closed while loading (shouldn't normally happen)
      if (!list.length) {
        qEl.textContent = 'Quiz offline — free item!';
        hintEl.textContent = 'Start server/quiz-proxy.mjs for live questions';
        setTimeout(() => close({ correct: null, kart }), 900);
        return;
      }
      topicEl.textContent = labelFor(zone, currentPool).toUpperCase();
      const item = pickQuestion(list);
      qEl.textContent = formatQuestionText(item.q, item.opts);
      let answered = false;
      item.opts.forEach((opt, i) => {
        const b = el('button', 'quiz-opt', optsEl);
        b.type = 'button';
        b.textContent = opt;
        b.onclick = () => {
          if (answered) return;
          answered = true;
          const correct = i === item.ans;
          asked.add(qId(item));
          saveAsked(asked);
          [...optsEl.children].forEach((btn, bi) => {
            btn.disabled = true;
            if (bi === item.ans) btn.classList.add('correct');
            else if (bi === i && !correct) btn.classList.add('wrong');
          });
          hintEl.textContent = item.explain ? (correct ? '✓ ' : '✗ ') + item.explain : (correct ? 'Correct!' : 'Not quite');
          // a longer explanation gets time to be read
          const extra = Math.min(2200, Math.max(0, (item.explain || '').length - 60) * 18);
          setTimeout(() => close({ correct, kart }), (correct ? 1100 : 1500) + extra);
        };
      });
    });
  }

  function close(result) {
    open = false;
    root.classList.add('hidden');
    onResult?.(result);
  }

  return {
    ask,
    isOpen: () => open,
    isLive: () => liveOk,
  };
}

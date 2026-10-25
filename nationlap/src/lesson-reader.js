// The "Study Pit Stop" — the reading layer that runs BEFORE a race, not during it.
//
// Why it lives here and not on a billboard: a lesson is ~600 words, and nobody reads 600 words
// with a kart paused mid-corner. The race already owns interruption (quiz popups), so reading
// gets its own screen where it can be unhurried. Billboards stay what they are — recall cues
// for what you read here.
//
// Content comes from assets/lessons/<zoneId>.json, exported from the MindGains content vault
// by dev/export-lessons.mjs. A zone with no lesson file simply skips straight to the race —
// today that's reason-calendar and current-affairs-basics, which the vault has no lesson for.

import { bus } from './events.js';

function el(tag, cls, parent, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
}

const cache = new Map();

/** Returns the parsed lesson, or null if this zone has no exported lesson yet. */
export async function loadLesson(zoneId) {
  if (!zoneId) return null;
  if (cache.has(zoneId)) return cache.get(zoneId);
  let data = null;
  try {
    const res = await fetch(`assets/lessons/${zoneId}.json`);
    if (res.ok) data = await res.json();
  } catch { /* offline or missing file — treated the same as "no lesson yet" */ }
  cache.set(zoneId, data);
  return data;
}

/**
 * The zone's flashcards, flattened across its parts — question/answer pairs the billboards use
 * as recall prompts during the race. Empty array when the zone has no exported lesson.
 */
export async function lessonCards(zoneId) {
  const lesson = await loadLesson(zoneId);
  return (lesson?.parts || []).flatMap((p) => p.cards || []);
}

// ---------------------------------------------------------------------------------------------
// Block renderers. Each vault block type gets a game-flavoured treatment rather than a plain
// document element — a trap becomes a hazard sign, a table becomes a versus scoreboard, a
// timeline becomes a row of checkpoint flags.
// ---------------------------------------------------------------------------------------------
const RENDER = {
  text(b, parent) {
    el('p', 'lr-text', parent, b.text);
  },

  trap(b, parent) {
    const box = el('div', 'lr-trap', parent);
    el('span', 'lr-trap-badge', box, 'TRAP');
    el('p', 'lr-trap-text', box, b.text);
  },

  table(b, parent) {
    const wrap = el('div', 'lr-versus', parent);
    const heads = b.headers || [];
    const cols = heads.length || (b.rows?.[0]?.length ?? 0);
    for (let c = 0; c < cols; c++) {
      const col = el('div', 'lr-vcol', wrap);
      el('div', 'lr-vhead', col, heads[c] || '');
      for (const row of b.rows || []) el('div', 'lr-vcell', col, row[c] ?? '');
    }
    if (cols === 2) el('div', 'lr-vs', wrap, 'VS');
  },

  timeline(b, parent) {
    const line = el('div', 'lr-timeline', parent);
    for (const it of b.items || []) {
      const node = el('div', 'lr-tl-item', line);
      el('div', 'lr-tl-flag', node);
      el('div', 'lr-tl-label', node, it.label || '');
      el('div', 'lr-tl-value', node, it.value || '');
    }
  },

  mindmap(b, parent) {
    const map = el('div', 'lr-mindmap', parent);
    el('div', 'lr-mm-center', map, b.center || '');
    const ring = el('div', 'lr-mm-ring', map);
    for (const br of b.branches || []) {
      const pill = el('div', 'lr-mm-branch', ring);
      el('b', null, pill, br.label || '');
      el('span', null, pill, br.value || '');
    }
  },

  fact_grid(b, parent) {
    const grid = el('div', 'lr-grid', parent);
    for (const it of b.items || []) {
      const tile = el('div', 'lr-tile', grid);
      el('span', 'lr-tile-text', tile, it.label || it.detail || '');
    }
  },
};

export function createLessonReader({ uiRoot, onDone, awardXp }) {
  const root = el('div', 'lesson-reader hidden', uiRoot);
  root.innerHTML = `
    <div class="lr-frame">
      <div class="lr-top">
        <div class="lr-badge"><span class="lr-subject"></span><span class="lr-topic"></span></div>
        <div class="lr-clock hidden"><span class="lr-clock-num"></span><i>SEC</i></div>
        <button type="button" class="lr-skip">SKIP &rsaquo;&rsaquo;</button>
      </div>
      <div class="lr-road"><div class="lr-road-fill"></div><div class="lr-kart"></div><div class="lr-checkpoints"></div></div>
      <div class="lr-stage"></div>
      <div class="lr-bottom">
        <button type="button" class="lr-prev">BACK</button>
        <div class="lr-count"></div>
        <button type="button" class="lr-next">NEXT</button>
      </div>
    </div>`;

  const subjectEl = root.querySelector('.lr-subject');
  const topicEl = root.querySelector('.lr-topic');
  const stage = root.querySelector('.lr-stage');
  const roadFill = root.querySelector('.lr-road-fill');
  const kart = root.querySelector('.lr-kart');
  const checkpoints = root.querySelector('.lr-checkpoints');
  const countEl = root.querySelector('.lr-count');
  const prevBtn = root.querySelector('.lr-prev');
  const nextBtn = root.querySelector('.lr-next');
  const skipBtn = root.querySelector('.lr-skip');

  const clockEl = root.querySelector('.lr-clock');
  const clockNum = root.querySelector('.lr-clock-num');

  let pages = [];      // flattened across all parts
  let idx = 0;
  let open = false;
  let finish = null;
  let ticker = null;   // set only when the caller imposes a time limit (the grid scroll does)

  /** Flatten parts -> one page list, injecting a title card at each part boundary. */
  function flatten(lesson) {
    const out = [];
    for (const part of lesson.parts || []) {
      out.push({ kind: 'part', title: part.title, intro: part.intro });
      for (const p of part.pages || []) out.push({ kind: 'page', ...p });
    }
    out.push({ kind: 'end' });
    return out;
  }

  function renderCheckpoints() {
    checkpoints.innerHTML = '';
    pages.forEach((p, i) => {
      const dot = el('span', 'lr-cp', checkpoints);
      if (p.kind === 'part') dot.classList.add('major');
      dot.style.left = `${(i / Math.max(1, pages.length - 1)) * 100}%`;
    });
  }

  function renderPage() {
    const p = pages[idx];
    stage.innerHTML = '';
    const card = el('div', 'lr-card', stage);
    // re-trigger the entry animation on every page change
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = '';

    if (p.kind === 'part') {
      card.classList.add('lr-card-part');
      el('div', 'lr-part-kicker', card, 'NEW SECTION');
      el('h2', 'lr-part-title', card, p.title);
      if (p.intro) el('p', 'lr-part-intro', card, p.intro);
    } else if (p.kind === 'end') {
      card.classList.add('lr-card-end');
      el('div', 'lr-end-title', card, 'LESSON COMPLETE');
      el('p', 'lr-end-sub', card, 'The billboards on this track are your recall cues. Go race it.');
      el('div', 'lr-end-xp', card, '+40 XP');
    } else {
      el('h2', 'lr-page-title', card, p.title || '');
      if (p.intro) el('p', 'lr-page-intro', card, p.intro);
      const body = el('div', 'lr-blocks', card);
      for (const b of p.blocks || []) RENDER[b.type]?.(b, body);
    }

    const last = idx === pages.length - 1;
    prevBtn.disabled = idx === 0;
    nextBtn.textContent = last ? 'START RACE' : 'NEXT';
    nextBtn.classList.toggle('go', last);
    countEl.textContent = last ? '' : `${idx + 1} / ${pages.length - 1}`;

    const t = pages.length > 1 ? idx / (pages.length - 1) : 1;
    roadFill.style.width = `${t * 100}%`;
    kart.style.left = `${t * 100}%`;
    checkpoints.querySelectorAll('.lr-cp').forEach((d, i) => d.classList.toggle('done', i <= idx));
  }

  function go(delta) {
    const next = idx + delta;
    if (next < 0) return;
    if (next >= pages.length) return done(true);
    idx = next;
    kart.classList.remove('hop');
    void kart.offsetWidth;
    kart.classList.add('hop');
    renderPage();
  }

  function stopClock() { if (ticker) { clearInterval(ticker); ticker = null; } }

  /** Counts the grid's study time down in the header; closing at zero is not a "skip". */
  function startClock(seconds) {
    stopClock();
    let left = Math.max(1, Math.floor(seconds));
    clockNum.textContent = left;
    clockEl.classList.remove('hidden');
    ticker = setInterval(() => {
      left -= 1;
      clockNum.textContent = Math.max(0, left);
      clockEl.classList.toggle('urgent', left <= 10);
      if (left <= 0) done(true);
    }, 1000);
  }

  function done(completed) {
    if (!open) return;
    open = false;
    stopClock();
    clockEl.classList.add('hidden');
    root.classList.add('hidden');
    if (completed) awardXp?.(40);
    const cb = finish; finish = null;
    cb?.(completed);
    onDone?.(completed);
  }

  nextBtn.addEventListener('click', () => go(1));
  prevBtn.addEventListener('click', () => go(-1));
  skipBtn.addEventListener('click', () => done(false));
  window.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.code === 'ArrowRight' || e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); go(1); }
    else if (e.code === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.code === 'Escape') { e.preventDefault(); done(false); }
  });

  /**
   * Show the lesson for a zone.
   * Resolves `true` if read to the end, `false` if skipped, and `null` — distinct from both —
   * when the zone has no exported lesson at all. The caller needs to tell "skipped" from
   * "nothing to show": skipping still counts as read, a missing lesson must not.
   */
  async function show(zone, { timeLimitSec } = {}) {
    const lesson = await loadLesson(zone?.id);
    if (!lesson || !lesson.parts?.length) return null;
    pages = flatten(lesson);
    idx = 0;
    subjectEl.textContent = (zone.subject || '').toUpperCase();
    topicEl.textContent = zone.topic || '';
    renderCheckpoints();
    renderPage();
    open = true;
    root.classList.remove('hidden');
    if (timeLimitSec > 0) startClock(timeLimitSec); else clockEl.classList.add('hidden');
    bus.emit?.('lesson:open', { zoneId: zone.id });
    return new Promise((resolve) => { finish = resolve; });
  }

  return { show, isOpen: () => open, close: () => done(false) };
}

// Journey progress: per-zone mastery state, persisted locally. Linear per subject — master a
// zone's quiz and the next zone in that subject unlocks; each subject's first zone is open from
// the start so there's always somewhere new to go.
//
// Mastery is not "get it right twice". A zone is cleared by COMPLETE_THRESHOLD correct answers
// with wrong answers costing you ground, and it then enters spaced review: it comes back due
// after 3, 7, 21 and 50 days. Those intervals aren't invented here — they're the
// `spaced_repetition_config` the MindGains content vault already ships with each lesson, so
// the game reviews on the same schedule the rest of the product does.
import { TOPIC_ZONES } from './learn-facts.js';

const KEY = 'tkr_zone_progress';

/** Correct answers needed to first clear a zone. */
export const COMPLETE_THRESHOLD = 5;
/** Correct answers that clear one section of a lesson (a section is ~5 pages and one race). */
export const SECTION_THRESHOLD = 4;
/** Days until a cleared zone falls due again, one entry per review stage. */
export const REVIEW_INTERVALS_DAYS = [3, 7, 21, 50];

const DAY_MS = 86400000;

// The order the path visits subjects in — this is "the journey."
export const SUBJECT_ORDER = ['Polity', 'History', 'Geography', 'Economy', 'Science', 'Quant', 'Reasoning', 'Current Affairs'];

/** Raw zone state, for the account sync to read and merge. */
export function rawZones() { return load(); }
/** Replace zone state wholesale — used once, after merging the account's row in on sign-in. */
export function replaceZones(next) { if (next && typeof next === 'object') save(next); }

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY) || '{}'); return s && typeof s === 'object' ? s : {}; }
  catch (e) { return {}; }
}
function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
}

/** Normalises a stored record, including ones written before review tracking existed. */
function rec(state, zoneId) {
  const r = state[zoneId] || {};
  return {
    correct: r.correct || 0,
    wrong: r.wrong || 0,
    stage: r.stage || 0,       // how many spaced reviews have been passed
    reviewAt: r.reviewAt || 0, // epoch ms; 0 = not yet cleared, so not scheduled
    // correct answers per lesson section. Progress from before sections existed carries over
    // into section 1, so nobody loses ground they had earned.
    sec: Array.isArray(r.sec) ? r.sec.slice()
      : (r.correct > 0 && r.correct < COMPLETE_THRESHOLD ? [Math.min(SECTION_THRESHOLD, r.correct)] : []),
  };
}

export function getOrderedZones() {
  const bySubject = new Map();
  for (const z of TOPIC_ZONES) {
    if (!bySubject.has(z.subject)) bySubject.set(z.subject, []);
    bySubject.get(z.subject).push(z);
  }
  const ordered = [];
  for (const subj of SUBJECT_ORDER) for (const z of bySubject.get(subj) || []) ordered.push(z);
  // any subject not in SUBJECT_ORDER (shouldn't happen, but stay robust) goes at the end
  for (const [subj, zs] of bySubject) if (!SUBJECT_ORDER.includes(subj)) ordered.push(...zs);
  return ordered;
}

/** Full path with live unlocked/completed/due state per node, in journey order. */
export function getJourney() {
  const state = load();
  const zones = getOrderedZones();
  const now = Date.now();
  let prevSubject = null;
  let prevDone = true;
  return zones.map((z) => {
    if (z.subject !== prevSubject) { prevSubject = z.subject; prevDone = true; }
    const r = rec(state, z.id);
    const unlocked = prevDone;
    const completed = r.correct >= COMPLETE_THRESHOLD;
    // A cleared zone that has come round again: still counts as completed for unlocking (you
    // don't lose the road behind you), but the map can flag it for another pass.
    const due = completed && r.reviewAt > 0 && now >= r.reviewAt;
    prevDone = completed;
    const attempts = r.correct + r.wrong;
    return {
      ...z, unlocked, completed, due,
      correct: r.correct, wrong: r.wrong, stage: r.stage,
      reviewAt: r.reviewAt,
      sec: r.sec,
      accuracy: attempts ? r.correct / attempts : 0,
      mastered: r.stage >= REVIEW_INTERVALS_DAYS.length,
    };
  });
}

function scheduleNext(r) {
  const days = REVIEW_INTERVALS_DAYS[Math.min(r.stage, REVIEW_INTERVALS_DAYS.length - 1)];
  r.reviewAt = Date.now() + days * DAY_MS;
}


/** Per-section progress for a zone with `n` sections: [{ correct, cleared }]. */
export function sectionState(zoneId, n) {
  const r = rec(load(), zoneId);
  const done = r.correct >= COMPLETE_THRESHOLD;
  return Array.from({ length: n }, (_, i) => {
    const c = Math.min(SECTION_THRESHOLD, r.sec[i] || 0);
    return { correct: done ? SECTION_THRESHOLD : c, cleared: done || c >= SECTION_THRESHOLD };
  });
}

/**
 * One answer inside a section race. A wrong answer costs a point, as for zones. Clearing the
 * last open section clears the lesson, which unlocks the next one and starts its reviews.
 */
export function recordSection(zoneId, i, n, ok) {
  if (!zoneId) return null;
  const state = load();
  const r = rec(state, zoneId);
  r.sec[i] = Math.max(0, Math.min(SECTION_THRESHOLD, (r.sec[i] || 0) + (ok ? 1 : -1)));
  if (!ok) r.wrong += 1;
  const sectionCleared = ok && r.sec[i] >= SECTION_THRESHOLD;
  let justCompleted = false;
  const all = Array.from({ length: n }, (_, k) => (r.sec[k] || 0) >= SECTION_THRESHOLD).every(Boolean);
  if (all && r.correct < COMPLETE_THRESHOLD) {
    r.correct = COMPLETE_THRESHOLD; r.stage = 0; scheduleNext(r); justCompleted = true;
  }
  state[zoneId] = r;
  save(state);
  return { sectionCleared, justCompleted, correct: r.sec[i] };
}

export function recordCorrect(zoneId) {
  if (!zoneId) return null;
  const state = load();
  const r = rec(state, zoneId);
  const wasComplete = r.correct >= COMPLETE_THRESHOLD;
  const wasDue = wasComplete && r.reviewAt > 0 && Date.now() >= r.reviewAt;

  r.correct = Math.min(COMPLETE_THRESHOLD, r.correct + 1);
  const justCompleted = !wasComplete && r.correct >= COMPLETE_THRESHOLD;

  if (justCompleted) {
    r.stage = 0;
    scheduleNext(r);
  } else if (wasDue) {
    // answered correctly on a review that had come due — move out to the next interval
    r.stage = Math.min(REVIEW_INTERVALS_DAYS.length, r.stage + 1);
    scheduleNext(r);
  }

  state[zoneId] = r;
  save(state);
  return { justCompleted, correct: r.correct, stage: r.stage, mastered: r.stage >= REVIEW_INTERVALS_DAYS.length };
}

/**
 * A wrong answer costs ground rather than being ignored, so a zone can't be cleared by
 * guessing through it. A zone already cleared drops back a review stage and returns sooner.
 */
export function recordWrong(zoneId) {
  if (!zoneId) return null;
  const state = load();
  const r = rec(state, zoneId);
  r.wrong += 1;
  const wasComplete = r.correct >= COMPLETE_THRESHOLD;
  if (wasComplete) {
    r.stage = Math.max(0, r.stage - 1);
    scheduleNext(r);
  } else {
    r.correct = Math.max(0, r.correct - 1);
  }
  state[zoneId] = r;
  save(state);
  return { correct: r.correct, wrong: r.wrong, stage: r.stage };
}

export function overallStats() {
  const journey = getJourney();
  return {
    total: journey.length,
    completed: journey.filter((z) => z.completed).length,
    unlocked: journey.filter((z) => z.unlocked).length,
    due: journey.filter((z) => z.due).length,
    mastered: journey.filter((z) => z.mastered).length,
  };
}

/** Zones that have come round for review, soonest-due first — what the map should nudge. */
export function dueZones() {
  return getJourney().filter((z) => z.due).sort((a, b) => a.reviewAt - b.reviewAt);
}

// Cup progression: several heats -> accumulated points -> podium -> unlock next cup.
// Pure state, no rendering — main.js drives the race flow, hud.js renders the podium.
import { CUPS, POINTS_TABLE } from './config.js';

const PROGRESS_KEY = 'tkr_cup_progress';

function loadProgress() {
  try {
    const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch (e) { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch (e) {}
}

export function pointsForPlace(place) {
  const i = Math.max(1, Math.min(POINTS_TABLE.length, place | 0)) - 1;
  return POINTS_TABLE[i] || 0;
}

export function isCupUnlocked(cupId) {
  const cup = CUPS.find((c) => c.id === cupId);
  if (!cup) return false;
  if (!cup.unlock) return true;
  const progress = loadProgress();
  return !!progress[cup.unlock]?.completed;
}

// ---------------------------------------------------------------------------------------------
// Resumable runs: a cup is several heats long, so quitting mid-cup shouldn't throw the run away.
// The active run is written to storage whenever it changes and restored on next launch.
// Granularity is the heat, not the lap — resuming half-way round a lap isn't meaningful, but
// resuming at the heat you were about to race is.
// ---------------------------------------------------------------------------------------------
const ACTIVE_KEY = 'tkr_active_run';

function saveActive(state) {
  try {
    if (state) localStorage.setItem(ACTIVE_KEY, JSON.stringify(state));
    else localStorage.removeItem(ACTIVE_KEY);
  } catch (e) {}
}

/** The saved in-progress run, or null. Shape: { cupId, heatIndex, totalPoints, placesByHeat, characterIndex, focusZoneId }. */
export function loadActiveRun() {
  try {
    const raw = JSON.parse(localStorage.getItem(ACTIVE_KEY) || 'null');
    if (!raw || typeof raw !== 'object') return null;
    const cup = CUPS.find((c) => c.id === raw.cupId);
    if (!cup) return null;
    if (!(raw.heatIndex >= 0 && raw.heatIndex < cup.heats.length)) return null;
    return { ...raw, cupName: cup.name, totalHeats: cup.heats.length };
  } catch (e) { return null; }
}

export function clearActiveRun() { saveActive(null); }

/**
 * @param {string} cupId
 * @param {object} [restore] — a run previously returned by loadActiveRun(), to pick up where it left off
 */
export function createCupRun(cupId, restore) {
  const cup = CUPS.find((c) => c.id === cupId) || CUPS[0];
  let heatIndex = restore?.heatIndex ?? 0;
  let totalPoints = restore?.totalPoints ?? 0;
  const placesByHeat = Array.isArray(restore?.placesByHeat) ? restore.placesByHeat.slice() : [];
  // extra context carried alongside the run so a resume rebuilds the same race
  let meta = {
    characterIndex: restore?.characterIndex ?? 0,
    focusZoneId: restore?.focusZoneId ?? null,
  };

  const persist = () => saveActive({
    cupId: cup.id, heatIndex, totalPoints, placesByHeat, ...meta,
  });

  const run = {
    cup,
    get heatIndex() { return heatIndex; },
    get totalHeats() { return cup.heats.length; },
    get meta() { return { ...meta }; },
    currentHeat: () => cup.heats[heatIndex],
    isLastHeat: () => heatIndex >= cup.heats.length - 1,
    /** Store what the resumed race needs to rebuild itself (racer choice, focused topic). */
    setMeta(next) { meta = { ...meta, ...next }; persist(); },
    /** Record the player's place for the heat just finished; returns points earned. */
    recordHeat(place) {
      const pts = pointsForPlace(place);
      totalPoints += pts;
      placesByHeat.push(place);
      persist();
      return pts;
    },
    advance() {
      heatIndex = Math.min(cup.heats.length - 1, heatIndex + 1);
      persist();
    },
    get totalPoints() { return totalPoints; },
    get placesByHeat() { return placesByHeat.slice(); },
    /** Call once after the final heat — marks the cup completed and clears the resume point. */
    finish() {
      const progress = loadProgress();
      const prevBest = progress[cup.id]?.bestPoints || 0;
      progress[cup.id] = { completed: true, bestPoints: Math.max(prevBest, totalPoints) };
      saveProgress(progress);
      clearActiveRun();
      return progress[cup.id];
    },
  };
  persist();
  return run;
}

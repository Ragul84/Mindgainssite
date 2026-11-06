// News Streak: consecutive IST days on which the player finished TODAY's affairs race.
// Archive (month) laps are revision and do not count. Kept on the device; the India board
// already holds the server-graded record, this is the habit the title screen shows back.
import { istToday } from './affairs.js';

const KEY = 'nl_news_streak';
const dayNum = (d) => Math.floor(Date.parse(d + 'T00:00:00Z') / 86400000);

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); return s && s.last ? s : { last: null, n: 0, best: 0 }; }
  catch (e) { return { last: null, n: 0, best: 0 }; }
}

/** The streak as it stands now: 0 once a whole day has been missed. */
export function newsStreak() {
  const s = load();
  if (!s.last) return { n: 0, today: false, best: s.best || 0 };
  const gap = dayNum(istToday()) - dayNum(s.last);
  return { n: gap <= 1 ? s.n : 0, today: gap === 0, best: s.best || 0 };
}

/** Count a finished race on the latest set. The set can carry yesterday's date before the
    5am refresh, or on a day the desk skipped; racing the newest news still counts as keeping up. */
export function bumpNewsStreak() {
  const today = istToday();
  const s = load();
  if (s.last === today) return { ...newsStreak(), bumped: false };
  const gap = s.last ? dayNum(today) - dayNum(s.last) : 99;
  const n = gap === 1 ? s.n + 1 : 1;
  const next = { last: today, n, best: Math.max(s.best || 0, n) };
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) { /* storage unavailable */ }
  return { n, today: true, best: next.best, bumped: true };
}

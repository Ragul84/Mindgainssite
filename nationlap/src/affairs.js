// Today's current affairs, as race content.
//
// The notebook at mindgains.ai/current-affairs/ and this game read the same `ca_cards` table,
// written once each morning at 5am IST. Reading it here rather than shipping a copy means the
// race is never a day behind the page, and there is nothing to rebuild when the news changes.
//
// Everything degrades: no network, no rows, a bad shape — the caller gets an empty list and
// the race runs exactly as it did before current affairs existed.

const REST = 'https://yuntwerxahgmaoduxvqc.supabase.co/rest/v1/ca_cards';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bnR3ZXJ4YWhnbWFvZHV4dnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTk4OTMsImV4cCI6MjA3MTM3NTg5M30.1mFUH9yp55uxN8n9tyRHLFbve36_kpaJs41nPU85S74';

const BUDGET_MS = 4000;
const cache = new Map();   // monthKey|'latest' -> card[]

const str = (v) => (typeof v === 'string' ? v : '');
const arr = (v) => (Array.isArray(v) ? v : []);

/** IST, because the set turns over at 5am local and not at UTC midnight. */
export function istToday() {
  return new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
}

function shape(row) {
  const id = str(row.id);
  const stamp = str(row.stamp);
  if (!id || !stamp) return null;

  const gateA = str(row.gate_a), gateB = str(row.gate_b), gateAns = str(row.gate_answer);
  // A card is only usable as a GATE if it carries a short, confusable pair. Everything else
  // still works as a briefing line and a recap row, so a day without gates is a quieter race
  // rather than a broken one.
  let gate = gateA && gateB && (gateAns === 'a' || gateAns === 'b')
    ? { a: gateA, b: gateB, answer: gateAns }
    : null;
  // No authored pair: build one from the card's own MCQ, so every fact read is a fact tested.
  const opts = Array.isArray(row.options) ? row.options.map(str) : [];
  const ans = Number.isInteger(row.answer) ? row.answer : -1;
  if (!gate && opts.length >= 2 && ans >= 0 && ans < opts.length) {
    const wrong = opts[ans === 0 ? 1 : 0];
    let h = 0; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    gate = h & 1 ? { a: wrong, b: opts[ans], answer: 'b' } : { a: opts[ans], b: wrong, answer: 'a' };
  }

  return {
    id,
    date: str(row.card_date).slice(0, 10),
    cat: str(row.cat) || 'polity',
    gs: str(row.gs) || 'GS2',
    stamp,
    ask: str(row.ask),
    why: str(row.why),
    staticFact: str(row.static_fact),
    source: str(row.source),
    trap: str(row.trap),
    myth: str(row.myth),
    yield: Number(row.yield) || 2,
    gate,
    // the card's own MCQ: item boxes in an affairs race ask this, so every question comes
    // from a fact the player was just shown
    options: Array.isArray(row.options) ? row.options.map(str) : [],
    answer: Number.isInteger(row.answer) ? row.answer : -1,
  };
}

async function get(query, key, raw = false) {
  if (cache.has(key)) return cache.get(key);
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), BUDGET_MS);
  try {
    const res = await fetch(`${REST}?${query}`, {
      signal: ctl.signal,
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
    });
    if (!res.ok) return [];
    const rows = await res.json();
    if (!Array.isArray(rows)) return [];
    const out = raw ? rows.map((r) => ({ date: String(r.card_date || '').slice(0, 10) })) : rows.map(shape).filter(Boolean);
    cache.set(key, out);
    return out;
  } catch {
    return [];       // offline or slow: the race simply has no affairs today
  } finally {
    clearTimeout(timer);
  }
}

/**
 * The newest day that actually has cards — not necessarily today. If the morning job has not
 * run yet, yesterday's set is the honest answer rather than an empty scroll.
 */
export async function loadLatest() {
  const rows = await get('select=*&order=card_date.desc,yield.desc&limit=40', 'latest');
  if (!rows.length) return { date: '', cards: [] };
  const date = rows[0].date;
  return { date, cards: rows.filter((c) => c.date === date) };
}

/** A past month, for riding a week you missed. */
export async function loadMonth(monthKey) {
  if (!/^\d{4}-\d{2}$/.test(monthKey)) return [];
  const [y, m] = monthKey.split('-').map(Number);
  const next = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, '0')}-01`;
  return get(
    `select=*&card_date=gte.${monthKey}-01&card_date=lt.${next}&order=card_date.desc,yield.desc&limit=1000`,
    monthKey,
  );
}

/** The cards that can become lane gates, strongest first. */
export function gatesFrom(cards, max = 8) {
  return cards.filter((c) => c.gate).sort((a, b) => b.yield - a.yield).slice(0, max);
}

/** The three lines the briefing scroll shows. Highest yield, because that is what gets asked. */
export function briefingFrom(cards, n = 3) {
  return [...cards].sort((a, b) => b.yield - a.yield).slice(0, n);
}

/**
 * The months that actually hold cards, newest first.
 *
 * Asked of the server rather than assumed: offering a month that turns out to be empty is a
 * dead end the player only discovers after a load, and the archive only goes back as far as
 * the job has been running.
 */
export async function availableMonths(limit = 12) {
  // Counted per month rather than read from rows: the server caps any read at 1,000 rows, and
  // with ~300 cards a month a row scan only ever saw the newest three months.
  const out = [];
  const now = new Date(Date.now() + 5.5 * 3600_000);
  for (let i = 0; i < limit; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = d.toISOString().slice(0, 7);
    const nx = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1)).toISOString().slice(0, 10);
    try {
      const r = await fetch(`${REST}?select=id&card_date=gte.${key}-01&card_date=lt.${nx}`, {
        headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, Prefer: 'count=exact', Range: '0-0' },
      });
      const n = Number((r.headers.get('content-range') || '/0').split('/')[1]) || 0;
      if (n > 0) out.push(key);
    } catch { /* skip a month we cannot reach */ }
  }
  return out;
}

const MONTH_NAMES = ['january','february','march','april','may','june','july','august','september','october','november','december'];

/** "2026-09" -> "September 2026" */
export function monthLabel(key) {
  const [y, m] = String(key).split('-').map(Number);
  const name = MONTH_NAMES[(m || 1) - 1] || '';
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${y || ''}`.trim();
}


/** Facts per lap. Six is what fits one read at the grid and one lap of recall. */
export const FACTS_PER_LAP = 6;
export const MAX_LAPS = 3;

/**
 * Split the day into laps: read a lap's facts, race that lap on only those facts, then the
 * next batch. Highest yield first, sizes balanced (14 facts = 5/5/4, not 6/6/2).
 */
export function splitLaps(cards) {
  const ranked = [...cards].sort((a, b) => b.yield - a.yield).slice(0, FACTS_PER_LAP * MAX_LAPS);
  const laps = Math.max(1, Math.min(MAX_LAPS, Math.ceil(ranked.length / FACTS_PER_LAP)));
  const out = Array.from({ length: laps }, () => []);
  const base = Math.floor(ranked.length / laps), extra = ranked.length % laps;
  let k = 0;
  for (let i = 0; i < laps; i++) for (let j = 0; j < base + (i < extra ? 1 : 0); j++) out[i].push(ranked[k++]);
  return out;
}

/** A card as a quiz.js question item, or null if it has no usable MCQ. */
export function quizItem(c) {
  if (!c.ask || c.options.length < 2 || !(c.answer >= 0 && c.answer < c.options.length)) return null;
  return { id: 'ca:' + c.id, q: c.ask, opts: c.options, ans: c.answer, explain: c.why };
}

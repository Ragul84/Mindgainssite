// Bharat Yatra: the journey across India's 36 states and UTs, one race per state.
//
// Content comes from the Know Your India data (/assets/data/states_*.json), so the game and the
// page never disagree. Each state becomes cards in the same shape as a current-affairs card, so
// the briefing scroll, the lane gates and the recap work unchanged: read the state, race it.
//
// Gates only ask things that are stable and unambiguous: capital, official language, year
// formed, Lok Sabha seats. District counts change too often to test, and values with two
// answers ("Srinagar (summer) / Jammu (winter)") stay in the briefing, never in a gate.
// Score 60% of a state's gates and it is stamped in the Bharat Passport (kept on the device).

const PASS_KEY = 'nl_passport';
export const STAMP_AT = 0.6;

// [col,row] on a 9 x 7 grid, roughly where each state sits. Same layout as Cut-Off Run's
// Bharat Board, so the two games read as one family.
export const TILE = {
  JK: [2, 0], LA: [3, 0], CH: [1, 1], PB: [2, 1], HP: [3, 1], UK: [4, 1], SK: [6, 1], AR: [8, 1],
  RJ: [1, 2], HR: [2, 2], DL: [3, 2], UP: [4, 2], BR: [5, 2], WB: [6, 2], AS: [7, 2], NL: [8, 2],
  GJ: [1, 3], MP: [2, 3], CT: [3, 3], JH: [4, 3], ML: [7, 3], MN: [8, 3],
  DH: [0, 4], MH: [1, 4], TG: [2, 4], OR: [3, 4], TR: [7, 4], MZ: [8, 4],
  GA: [1, 5], KA: [2, 5], AP: [3, 5], LD: [0, 6], KL: [2, 6], TN: [3, 6], PY: [4, 6], AN: [6, 6],
};
const KEY_CODE = {
  ANDHRAPRADESH: 'AP', ARUNACHALPRADESH: 'AR', ASSAM: 'AS', BIHAR: 'BR', CHHATTISGARH: 'CT', GOA: 'GA',
  GUJARAT: 'GJ', HARYANA: 'HR', HIMACHALPRADESH: 'HP', JHARKHAND: 'JH', KARNATAKA: 'KA', KERALA: 'KL',
  MADHYAPRADESH: 'MP', MAHARASHTRA: 'MH', MANIPUR: 'MN', MEGHALAYA: 'ML', MIZORAM: 'MZ', NAGALAND: 'NL',
  ODISHA: 'OR', PUNJAB: 'PB', RAJASTHAN: 'RJ', SIKKIM: 'SK', TAMILNADU: 'TN', TELANGANA: 'TG', TRIPURA: 'TR',
  UTTARPRADESH: 'UP', UTTARAKHAND: 'UK', WESTBENGAL: 'WB', DELHI: 'DL', JAMMUANDKASHMIR: 'JK', PUDUCHERRY: 'PY',
  LADAKH: 'LA', CHANDIGARH: 'CH', ANDAMANANDNICOBARISLANDS: 'AN', DADRAANDNAGARHAVELIANDDAMANANDDIU: 'DH', LAKSHADWEEP: 'LD',
};

let data = null;
/** All states as {code, name, tagline, capital, language, formed, lokSabha, facts[]}. */
export async function loadStates() {
  if (data) return data;
  const [meta, gk, core] = await Promise.all([
    fetch('/assets/data/states_meta.json').then((r) => r.json()),
    fetch('/assets/data/states_gk.json').then((r) => r.json()),
    fetch('/assets/data/states_core.json').then((r) => r.json()).catch(() => ({})),
  ]);
  data = {};
  for (const [k, m] of Object.entries(meta)) {
    const code = KEY_CODE[k], g = gk[k] || {};
    if (!code) continue;
    data[code] = { code, name: m.state, tagline: m.tagline || '', lokSabha: m.lokSabha, capital: g.capital || '',
      language: g.language || '', formed: String(g.formed || ''), facts: Array.isArray(g.facts) ? g.facts : [],
      // states_core.json: the must-know lists (borders, rivers, dance, festivals, landmarks, parks, knownFor)
      ...(core[code] || {}) };
  }
  return data;
}

// A value is gate-safe when it has one plain answer.
const plain = (v) => {
  const s = String(v || '').replace(/\s*\(formerly[^)]*\)/i, '').trim();
  return s && !/[/()]/.test(s) ? s : '';
};
const hash = (s) => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };

/** A wrong answer of the same kind, from another state, picked the same way every time. */
function decoy(all, st, field, right) {
  // English is an additional official language in several states, so it is never a "wrong" answer.
  const pool = [...new Set(Object.values(all).map((x) => plain(x[field])).filter((v) => v && v !== right && !(field === 'language' && v === 'English')))];
  return pool.length ? pool[hash(st.code + field) % pool.length] : '';
}

function card(st, n, stamp, why, staticFact, ask, right, wrong) {
  const id = `bharat:${st.code}:${n}`;
  const gate = right && wrong ? (hash(id) & 1 ? { a: wrong, b: right, answer: 'b' } : { a: right, b: wrong, answer: 'a' }) : null;
  return { id, date: '', cat: 'bharat', gs: '', stamp, ask, why, staticFact, source: 'Know Your India', trap: '', myth: '',
    yield: gate ? 3 : 1, gate, options: gate ? [gate.a, gate.b] : [], answer: gate ? (gate.answer === 'a' ? 0 : 1) : -1 };
}

/** The cards for one state: up to four gated questions, then its facts as briefing lines. */
export function stateCards(all, code) {
  const st = all[code];
  if (!st) return [];
  const out = [];
  const cap = plain(st.capital), lang = plain(st.language), year = /^\d{4}$/.test(st.formed) ? st.formed : '';
  const seats = Number.isFinite(+st.lokSabha) ? String(st.lokSabha) : '';
  if (cap) out.push(card(st, 1, `${st.name}: capital`, st.tagline, `The capital of ${st.name} is ${cap}.`, `Capital of ${st.name}?`, cap, decoy(all, st, 'capital', cap)));
  if (lang) out.push(card(st, 2, `${st.name}: language`, '', `The official language of ${st.name} is ${lang}.`, `Official language of ${st.name}?`, lang, decoy(all, st, 'language', lang)));
  if (year) {
    const wrongYear = String(+year + ((hash(code) % 2) ? 4 : -6));
    out.push(card(st, 3, `${st.name}: formed`, '', `${st.name} was formed in ${year}.`, `${st.name} was formed in?`, year, wrongYear));
  }
  if (seats) {
    const w = String(Math.max(1, +seats + ((hash(code + 'ls') % 2) ? 3 : -2) * (+seats > 6 ? 2 : 1)));
    out.push(card(st, 4, `${st.name}: Lok Sabha`, '', `${st.name} sends ${seats} member${seats === '1' ? '' : 's'} to the Lok Sabha.`, `Lok Sabha seats from ${st.name}?`, seats, w === seats ? String(+seats + 1) : w));
  }
  // The must-know lists. A wrong option comes from another state and is never one of this
  // state's own answers, so a gate can't mark a true fact wrong.
  const list = (k) => (Array.isArray(st[k]) ? st[k] : []);
  const otherPool = (k) => [...new Set(Object.values(all).filter((x) => x.code !== code).flatMap((x) => (Array.isArray(x[k]) ? x[k] : [])))]
    .filter((v) => !list(k).includes(v));
  const pickOther = (k, salt) => { const pool = otherPool(k); return pool.length ? pool[hash(code + k + salt) % pool.length] : ''; };
  let n = 20;
  const ASK = {
    rivers: [(v) => `A major river of ${st.name}?`, (v) => `${v} flows through ${st.name}.`, 2],
    dance: [(v) => `A dance of ${st.name}?`, (v) => `${v} is a dance form of ${st.name}.`, 1],
    festivals: [(v) => `A festival of ${st.name}?`, (v) => `${v} is celebrated in ${st.name}.`, 1],
    landmarks: [(v) => `Which is in ${st.name}?`, (v) => `${v} is in ${st.name}.`, 2],
    parks: [(v) => `A national park in ${st.name}?`, (v) => `${v} is in ${st.name}.`, 1],
  };
  // Neighbours: the decoy is a state that does not border this one.
  const names = Object.values(all).map((x) => x.name);
  const nb = list('borders').filter((b) => names.includes(b)).slice(0, 2);
  nb.forEach((b, i) => {
    const not = names.filter((x) => x !== st.name && !list('borders').includes(x));
    const w = not.length ? not[hash(code + 'nb' + i) % not.length] : '';
    out.push(card(st, n++, `${st.name}: neighbours`, '', `${st.name} shares a border with ${list('borders').join(', ')}.`, `Which borders ${st.name}?`, b, w));
  });
  for (const [k, [ask, line, max]] of Object.entries(ASK)) {
    list(k).slice(0, max).forEach((v, i) => {
      out.push(card(st, n++, `${st.name}: ${k === 'parks' ? 'national park' : k.replace(/s$/, '')}`, '', line(v), ask(v), v, pickOther(k, i)));
    });
  }
  // Known-for lines and the Know Your India facts are read in the brief, not gated: they are
  // sentences, too long for an arch.
  list('knownFor').forEach((f, i) => out.push(card(st, 60 + i, 'Known for', f, '', '', '', '')));
  st.facts.forEach((f, i) => out.push(card(st, 70 + i, 'Did you know', f, '', '', '', '')));
  return out;
}

/** Split a state's cards into up to 3 laps of about 7, each lap with its share of gates. */
export function stateLaps(cards) {
  const gated = cards.filter((c) => c.gate), plainCards = cards.filter((c) => !c.gate);
  const laps = Math.max(1, Math.min(3, Math.ceil(cards.length / 7)));
  const out = Array.from({ length: laps }, () => []);
  gated.forEach((c, i) => out[i % laps].push(c));
  plainCards.forEach((c, i) => out[i % laps].push(c));
  return out;
}

// ---- passport ---------------------------------------------------------------------------
export function passport() {
  try { return JSON.parse(localStorage.getItem(PASS_KEY) || '{}') || {}; } catch (e) { return {}; }
}
/** Record a run; returns true when this run stamped the state for the first time. */
export function recordStateRun(code, clean, total) {
  const p = passport(), pct = total ? clean / total : 0, prev = p[code];
  const stamped = pct >= STAMP_AT;
  if (!prev || pct > prev.best) p[code] = { best: Math.round(pct * 100) / 100, stamped: stamped || !!(prev && prev.stamped), at: Date.now() };
  try { localStorage.setItem(PASS_KEY, JSON.stringify(p)); } catch (e) { /* storage unavailable */ }
  return stamped && !(prev && prev.stamped);
}
export const stampedCount = () => Object.values(passport()).filter((x) => x.stamped).length;

// ---- the Yatra screen -------------------------------------------------------------------
const esc = (t) => String(t).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));

export function createYatra({ uiRoot, onRace, onClose }) {
  const root = document.createElement('div');
  root.className = 'yatra hidden';
  uiRoot.appendChild(root);
  let pick = null;

  async function open() {
    pick = null;
    const [all] = await Promise.all([loadStates().catch(() => null), loadMap()]);
    if (!all) { root.innerHTML = '<div class="yt-panel"><p class="yt-sub">Could not load the map. Check your connection.</p><button class="btn" data-x>BACK</button></div>'; show(); return; }
    render(all);
    show();
  }
  function show() {
    root.classList.remove('hidden');
    root.querySelectorAll('[data-x]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); close(); onClose?.(); }));
  }
  function close() { root.classList.add('hidden'); }

  const REGIONS = [['N', 'North'], ['NE', 'North-East'], ['E', 'East'], ['C', 'Central'], ['W', 'West'], ['S', 'South'], ['IS', 'Islands']];
  const HUE = { N: 210, NE: 150, E: 18, C: 95, W: 35, S: 330, IS: 190 };
  // A small landscape per state, drawn in SVG: hills, coast, desert, forest, plains, islands, city.
  const LAND = {
    hills: '<path d="M2 34 18 12l10 12 8-8 18 18z" fill="#fff" opacity=".9"/><path d="M14 17l4-5 4 5z" fill="#fff"/>',
    coast: '<path d="M2 26c8-6 14 6 22 0s14 6 22 0 6 2 10 0v12H2z" fill="#fff" opacity=".9"/><circle cx="44" cy="12" r="6" fill="#fff"/>',
    desert: '<path d="M2 34c10-10 20-10 30 0 6-6 14-8 24 0z" fill="#fff" opacity=".9"/><circle cx="16" cy="12" r="6" fill="#fff"/>',
    forest: '<path d="M10 34V24M28 34V20M46 34V24" stroke="#fff" stroke-width="3"/><path d="M10 6 2 24h16zM28 2 18 22h20zM46 6l-8 18h16z" fill="#fff" opacity=".9"/>',
    plains: '<path d="M2 28h52v6H2z" fill="#fff" opacity=".9"/><path d="M8 28c4-10 8-10 12 0M30 28c4-12 10-12 14 0" stroke="#fff" stroke-width="3" fill="none"/><circle cx="44" cy="10" r="5" fill="#fff"/>',
    islands: '<path d="M2 30c8-4 16 4 24 0s16 4 30 0v8H2z" fill="#fff" opacity=".7"/><path d="M14 30c2-8 10-8 12 0z" fill="#fff"/><path d="M20 22c-1-8 3-14 8-16M20 22c4-6 10-6 14-4" stroke="#fff" stroke-width="2.5" fill="none"/>',
    city: '<path d="M4 34V18h8v16M14 34V8h10v26M26 34V14h8v20M36 34V22h8v12M46 34V12h6v22" fill="#fff" opacity=".9"/>',
  };

  // The map itself: India's states and UTs as drawn on official maps (DataMeet's Survey of
  // India / Census based boundaries, including all of J&K and Ladakh), one tappable shape each.
  let MAP = null;
  async function loadMap() {
    if (!MAP) MAP = await fetch('/assets/data/india_map.json').then((r) => r.json()).catch(() => null);
    return MAP;
  }
  // Too small to tap as a shape, so they also get a dot.
  const TINY = new Set(['CH', 'DL', 'GA', 'PY', 'DH', 'LD', 'SK', 'TR', 'AN']);

  function render(all) {
    const p = passport(), n = stampedCount();
    const m = MAP;
    const fill = (st) => {
      const s = p[st.code];
      if (s?.stamped) return '#22b35e';
      if (s) return '#e2733a';
      return `hsl(${HUE[st.region || 'N'] + (hash(st.code) % 24) - 12} 38% 46%)`;
    };
    const shapes = m ? Object.values(all).filter((st) => m.states[st.code]).map((st) =>
      `<path class="ym-st${pick === st.code ? ' on' : ''}" data-st="${st.code}" d="${m.states[st.code].d}" fill="${fill(st)}"><title>${esc(st.name)}</title></path>`).join('') : '';
    const dots = m ? Object.values(all).filter((st) => TINY.has(st.code) && m.states[st.code]).map((st) => {
      const [x, y] = m.states[st.code].c;
      return `<circle class="ym-dot${pick === st.code ? ' on' : ''}" data-st="${st.code}" cx="${x}" cy="${y}" r="11" fill="${fill(st)}"><title>${esc(st.name)}</title></circle>`;
    }).join('') : '';
    // the picked state is drawn again on top, so its gold outline is never hidden by a neighbour
    const top = m && pick && m.states[pick] ? `<path class="ym-top" d="${m.states[pick].d}"/>` : '';
    const map = m
      ? `<svg class="ym-svg" viewBox="0 0 ${m.w} ${m.h}" role="img" aria-label="Map of India">${shapes}${top}${dots}</svg>`
      : '<p class="yt-sub">Map unavailable. Pick a state from the list.</p>';

    const st = pick && all[pick], s = pick && p[pick];
    const nGates = st ? stateCards(all, pick).filter((c) => c.gate).length : 0;
    const side = st
      ? `<div class="yt-card" style="--h:${HUE[st.region || 'N']}"><svg class="yt-art" viewBox="0 0 56 38" aria-hidden="true">${LAND[st.land] || LAND.plains}</svg>
          <div><div class="yt-name">${esc(st.name)}</div><div class="yt-tag">${esc(st.tagline)}</div></div>
          <div class="yt-facts">Capital ${esc(plain(st.capital) || st.capital)} · ${nGates} questions over ${stateLaps(stateCards(all, pick)).length} laps</div>
          <div class="yt-best">${s ? (s.stamped ? `✓ Stamped · best ${Math.round(s.best * 100)}%` : `Best ${Math.round(s.best * 100)}% · ${Math.round(STAMP_AT * 100)}% stamps it`) : `Score ${Math.round(STAMP_AT * 100)}% to stamp it`}</div>
          <button class="btn primary yt-go" data-go="${pick}">RACE ${esc(st.name.toUpperCase())}</button></div>`
      : `<div class="yt-card ym-hint"><div class="yt-name">Pick a state</div><div class="yt-tag">Tap any state or UT on the map. Race it, learn its must-know facts, and stamp your Bharat Passport.</div>
          <div class="ym-key"><span><i style="background:#22b35e"></i>Stamped</span><span><i style="background:#e2733a"></i>Tried</span><span><i style="background:hsl(210 38% 46%)"></i>Not yet</span></div></div>`;
    const chips = Object.values(all).sort((a, b) => a.name.localeCompare(b.name)).map((x) =>
      `<button class="ym-chip${p[x.code]?.stamped ? ' done' : ''}${pick === x.code ? ' on' : ''}" data-st="${x.code}">${p[x.code]?.stamped ? '✓ ' : ''}${esc(x.name)}</button>`).join('');

    root.innerHTML = `<div class="yt-panel ym-panel">
        <div class="yt-head"><div><div class="yt-title">BHARAT YATRA</div><div class="yt-sub">Your Bharat Passport · ${n} of 36 stamped</div></div><button class="btn small" data-x>BACK</button></div>
        <div class="yt-progress"><i style="width:${Math.round((n / 36) * 100)}%"></i></div>
        <div class="ym-body"><div class="ym-map">${map}</div><div class="ym-side">${side}</div></div>
        <details class="ym-list"><summary>All states &amp; UTs</summary><div class="ym-chips">${chips}</div></details>
        ${n ? `<button class="btn small yt-share">SHARE MY PASSPORT</button>` : ''}
        <div class="ym-credit">Map: DataMeet, based on Survey of India boundaries</div>
      </div>`;
    root.querySelectorAll('[data-st]').forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation(); pick = b.dataset.st; render(all); show();
      // on a phone the card sits under the map: bring it into view
      if (window.innerWidth < 760) root.querySelector('.ym-side')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }));
    root.querySelector('[data-go]')?.addEventListener('click', (e) => { e.stopPropagation(); const k = e.currentTarget.dataset.go; close(); onRace?.(k, all[k].name, stateCards(all, k)); });
    root.querySelector('.yt-share')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = `I've stamped ${n} of 36 states and UTs in my Bharat Passport on NationLap 🇮🇳 How many can you get?`;
      window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + location.origin + '/nationlap/'), '_blank', 'noopener');
    });
  }

  return { open, close, isOpen: () => !root.classList.contains('hidden') };
}

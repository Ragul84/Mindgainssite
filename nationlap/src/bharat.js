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
  const [meta, gk] = await Promise.all([
    fetch('/assets/data/states_meta.json').then((r) => r.json()),
    fetch('/assets/data/states_gk.json').then((r) => r.json()),
  ]);
  data = {};
  for (const [k, m] of Object.entries(meta)) {
    const code = KEY_CODE[k], g = gk[k] || {};
    if (!code) continue;
    data[code] = { code, name: m.state, tagline: m.tagline || '', lokSabha: m.lokSabha, capital: g.capital || '',
      language: g.language || '', formed: String(g.formed || ''), facts: Array.isArray(g.facts) ? g.facts : [] };
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
  const pool = [...new Set(Object.values(all).map((x) => plain(x[field])).filter((v) => v && v !== right))];
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
  st.facts.forEach((f, i) => out.push(card(st, 10 + i, 'Did you know', f, '', '', '', '')));
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
    const all = await loadStates().catch(() => null);
    if (!all) { root.innerHTML = '<div class="yt-panel"><p class="yt-sub">Could not load the map. Check your connection.</p><button class="btn" data-x>BACK</button></div>'; show(); return; }
    render(all);
    show();
  }
  function show() {
    root.classList.remove('hidden');
    root.querySelectorAll('[data-x]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); close(); onClose?.(); }));
  }
  function close() { root.classList.add('hidden'); }

  function render(all) {
    const p = passport(), n = stampedCount();
    const Z = 44, G = 6;
    const tiles = Object.keys(TILE).map((k) => {
      const [c, r] = TILE[k], s = p[k], st = all[k];
      const cls = s?.stamped ? 'done' : s ? 'tried' : '';
      return `<button class="yt-tile ${cls}${pick === k ? ' on' : ''}" data-st="${k}" style="left:${c * (Z + G)}px;top:${r * (Z + G)}px" title="${esc(st ? st.name : k)}">${k}${s?.stamped ? '<i>✓</i>' : ''}</button>`;
    }).join('');
    const st = pick && all[pick], s = pick && p[pick];
    const side = st
      ? `<div class="yt-card"><div class="yt-name">${esc(st.name)}</div><div class="yt-tag">${esc(st.tagline)}</div>
          <div class="yt-best">${s ? (s.stamped ? `✓ Stamped · best ${Math.round(s.best * 100)}%` : `Best ${Math.round(s.best * 100)}% · ${Math.round(STAMP_AT * 100)}% stamps it`) : `Score ${Math.round(STAMP_AT * 100)}% to stamp it`}</div>
          <button class="btn primary yt-go" data-go="${pick}">RACE ${esc(st.name.toUpperCase())}</button></div>`
      : `<div class="yt-card yt-hint">Pick a state on the map. Read its card, race its gates, and stamp it in your passport.</div>`;
    root.innerHTML = `<div class="yt-panel">
        <div class="yt-head"><div><div class="yt-title">BHARAT YATRA</div><div class="yt-sub">${n} of 36 states and UTs stamped</div></div><button class="btn small" data-x>BACK</button></div>
        <div class="yt-body"><div class="yt-map" style="width:${9 * (Z + G) - G}px;height:${7 * (Z + G) - G}px">${tiles}</div>${side}</div>
        ${n ? `<button class="btn small yt-share">SHARE MY PASSPORT</button>` : ''}
      </div>`;
    root.querySelectorAll('[data-st]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); pick = b.dataset.st; render(all); show(); }));
    root.querySelector('[data-go]')?.addEventListener('click', (e) => { e.stopPropagation(); const k = e.currentTarget.dataset.go; close(); onRace?.(k, all[k].name, stateCards(all, k)); });
    root.querySelector('.yt-share')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = `I've stamped ${n} of 36 states and UTs in my Bharat Passport on NationLap 🇮🇳 How many can you get?`;
      window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + location.origin + '/nationlap/'), '_blank', 'noopener');
    });
  }

  return { open, close, isOpen: () => !root.classList.contains('hidden') };
}

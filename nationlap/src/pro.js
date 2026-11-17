// MindGains Pro inside NationLap: Pro status (cached for the gold kart), the gold PRO dock in the
// lobby, and the weekly Pro Night Race sheet (board, your all-India + state rank, start / unlock).
import * as account from './account.js';
import { myState } from './prefs.js';
import { getPlayerName } from './lb.js';

const KEY = 'mg_pro_until';
export function isProCached() { try { return (+localStorage.getItem(KEY) || 0) > Date.now(); } catch (e) { return false; } }
let status = null;
export async function refreshPro() {
  try {
    const t = await account.accessToken();
    status = await (await fetch('/api/pro/me', { headers: t ? { Authorization: 'Bearer ' + t } : {} })).json();
    try { localStorage.setItem(KEY, String(status.pro ? status.until : 0)); } catch (e) {}
  } catch (e) {}
  document.querySelectorAll('.pro-dock').forEach((d) => d.classList.toggle('is-pro', isProCached()));
  return status;
}

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const CROWN = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4.5 3.5L12 4l4.5 7.5L21 8l-2 11H5L3 8zm2.6 13h12.8v1.6H5.6z"/></svg>';

/** Gold PRO dock button in the lobby's mode row. */
export function mountProDock(row, onStart) {
  if (!row || row.querySelector('.pro-dock')) return;
  const b = document.createElement('button'); b.type = 'button'; b.className = 'dock pro-dock' + (isProCached() ? ' is-pro' : '');
  b.innerHTML = `${CROWN}<span>PRO RACE</span>`;
  b.addEventListener('click', (e) => { e.stopPropagation(); openNight(onStart); });
  row.appendChild(b);
}

function left(ms) { const h = Math.floor(ms / 3600e3), d = Math.floor(h / 24); return d ? `${d}d ${h % 24}h` : `${h}h ${Math.floor(ms % 3600e3 / 60e3)}m`; }

export async function openNight(onStart) {
  const d = document.createElement('div'); d.className = 'pn-wrap';
  d.innerHTML = `<div class="pn-card"><button class="pn-x" aria-label="Close">✕</button>
    <div class="pn-crown">${CROWN}</div><div class="pn-k">THIS WEEK'S</div><h2>PRO NIGHT RACE</h2>
    <p class="pn-s">One mock race on the week's syllabus. Your best run counts. New race every Sunday, 8 PM.</p>
    <div class="pn-me" hidden></div><div class="pn-board"><div class="pn-empty">Loading the board…</div></div>
    <div class="pn-cta"></div></div>`;
  document.body.appendChild(d);
  const close = () => d.remove();
  d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('.pn-x')) close(); });
  const signed = account.isSignedIn();
  if (signed) await refreshPro();
  const pro = isProCached();
  const cta = d.querySelector('.pn-cta');
  if (pro) { cta.innerHTML = '<button class="btn primary pn-go">START RACE</button>'; cta.querySelector('.pn-go').onclick = () => { close(); onStart(); }; }
  else if (!signed) { cta.innerHTML = '<button class="btn primary pn-go">SIGN IN TO RACE</button><a class="pn-link" href="/pro/?back=/nationlap/">What is Pro? ›</a>'; cta.querySelector('.pn-go').onclick = () => { close(); account.signInPopup(); }; }
  else cta.innerHTML = '<a class="btn primary pn-go" href="/pro/?plan=exam&back=/nationlap/">UNLOCK WITH PRO</a><div class="pn-small">from ₹99 · unlimited theatre, weak chapters &amp; more</div>';
  let r = null;
  if (signed) { try { r = await (await fetch('/api/pro/night', { headers: { Authorization: 'Bearer ' + (await account.accessToken()) } })).json(); } catch (e) {} }
  const board = d.querySelector('.pn-board');
  if (!r || r.error || !r.top) { board.innerHTML = `<div class="pn-empty">${signed ? 'The board fills up as Pro racers finish.' : 'Sign in to see this week\'s board.'}</div>`; return; }
  d.querySelector('.pn-k').textContent = `THIS WEEK · ${r.racers} RACER${r.racers === 1 ? '' : 'S'} · ENDS IN ${left(r.ends - Date.now())}`;
  board.innerHTML = r.top.length ? r.top.map((x, i) => `<div class="pn-row${i < 3 ? ' t' + (i + 1) : ''}"><b>${i + 1}</b><span>${esc(x.name)}${x.state ? ` <i>${esc(x.state)}</i>` : ''}</span><em>${x.pts.toLocaleString('en-IN')}</em></div>`).join('')
    : '<div class="pn-empty">No one has raced yet this week. Be #1.</div>';
  if (r.me) { const m = d.querySelector('.pn-me'); m.hidden = false; m.innerHTML = `<div><small>ALL-INDIA</small><b>#${r.me.rank}</b></div>${r.me.stateRank ? `<div><small>${esc(r.me.state)}</small><b>#${r.me.stateRank}</b></div>` : ''}<div><small>YOUR BEST</small><b>${r.me.pts.toLocaleString('en-IN')}</b></div>`; }
}

/** After a Pro Night Race: send the result, show the new rank. */
export async function submitNight(place, ms, toast) {
  try {
    const t = await account.accessToken(); if (!t) return;
    const r = await (await fetch('/api/pro/night', { method: 'POST', headers: { 'content-type': 'application/json', Authorization: 'Bearer ' + t },
      body: JSON.stringify({ place, ms, name: account.accountName() || getPlayerName(), state: myState() }) })).json();
    if (r && r.me && toast) toast(`👑 Pro Night Race · #${r.me.rank} all-India${r.me.stateRank ? ` · #${r.me.stateRank} in ${r.me.state}` : ''}`);
  } catch (e) {}
}

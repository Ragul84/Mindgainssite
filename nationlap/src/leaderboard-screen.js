// Today's board. Scores were already being submitted to Supabase — nothing ever showed them,
// so players were competing against an audience they couldn't see. This is that audience.
//
// Deliberately read-only and name-only: no free text anywhere, so there is nothing to moderate.
// The only outgoing signal is a fixed-vocabulary cheer, stored per device, which is why it needs
// no server table and carries no user-authored content.
import { bus } from './events.js';

function el(tag, cls, parent, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
}

// Fixed vocabulary. Adding free text here would turn the game into a platform hosting
// user-generated content, with everything that carries for an audience that includes minors.
const CHEERS = ['👏', '🔥', '🚀', '🧠'];
const CHEER_KEY = 'tkr_cheers_given';

function loadCheers() {
  try { return JSON.parse(localStorage.getItem(CHEER_KEY) || '{}') || {}; } catch (e) { return {}; }
}
function saveCheers(c) {
  try { localStorage.setItem(CHEER_KEY, JSON.stringify(c)); } catch (e) { /* storage blocked */ }
}

export function createLeaderboardScreen({ uiRoot, lb, getXp, account, onClose }) {
  const root = el('div', 'lb-screen hidden', uiRoot);
  root.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="game-rail left"></div>
    <div class="game-rail right"></div>
    <div class="lb-panel">
      <div class="lb-top">
        <div class="lb-title">INDIA BOARD</div>
        <button type="button" class="lb-close"><span class="esc-hint">ESC · </span>BACK</button>
      </div>
      <div class="lb-tabs"><button type="button" data-p="today" class="on">TODAY</button><button type="button" data-p="week">THIS WEEK</button><button type="button" data-p="all">ALL-TIME</button></div>
      <div class="lb-you"></div>
      <div class="lb-rows"></div>
      <div class="lb-foot">Current-affairs XP, graded on the server · 20 per correct gate, +10 for showing up, +20 for a clean day · Top 10 today go on the Hall of Fame</div>
    </div>`;

  const rowsEl = root.querySelector('.lb-rows');
  const youEl = root.querySelector('.lb-you');
  root.querySelector('.lb-close').addEventListener('click', () => close());
  let period = 'today';
  root.querySelectorAll('.lb-tabs button').forEach((b) => b.addEventListener('click', () => {
    period = b.dataset.p;
    root.querySelectorAll('.lb-tabs button').forEach((x) => x.classList.toggle('on', x === b));
    load();
  }));

  let cheers = loadCheers();

  function close() {
    root.classList.add('hidden');
    onClose?.();
  }

  function medal(i) {
    return i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
  }

  function paint(rows, myRank) {
    // identify 'me' by account id when signed in — the board rows are keyed on auth uid now
    const myId = account?.currentUser?.()?.id || lb.getMyId();
    const myXp = getXp?.() ?? 0;
    rowsEl.innerHTML = '';

    if (!rows.length) {
      el('div', 'lb-empty', rowsEl, period === 'today' ? 'No names yet today — be the first.' : 'No scores yet.');
    }

    rows.forEach((r, i) => {
      const mine = r.player_id === myId;
      const row = el('div', 'lb-row' + (mine ? ' me' : '') + (medal(i) ? ' ' + medal(i) : ''), rowsEl);
      el('span', 'lb-place', row, String(i + 1));
      el('span', 'lb-name', row, r.player_name || 'Racer');
      el('span', 'lb-score', row, `${r.score ?? 0} XP${r.accuracy != null ? ' · ' + r.accuracy + '%' : ''}`);
      // you can cheer anyone but yourself; once per racer per day, and it's a fixed icon
      if (!mine) {
        const key = r.player_id + '|' + new Date().toISOString().slice(0, 10);
        const given = cheers[key];
        const b = el('button', 'lb-cheer' + (given ? ' given' : ''), row, given || '＋');
        b.type = 'button';
        b.title = given ? 'Cheered' : 'Send a cheer';
        if (!given) {
          b.addEventListener('click', (e) => {
            e.stopPropagation();
            const pick = CHEERS[Math.floor(Math.random() * CHEERS.length)];
            cheers[key] = pick;
            saveCheers(cheers);
            b.textContent = pick;
            b.classList.add('given', 'pop');
            bus.emit?.('ui:confirm');
          });
        }
      }
    });

    // Your own standing, always visible even when you're far down the table
    const inTable = rows.some((r) => r.player_id === myId);
    youEl.classList.toggle('hidden', inTable && myRank != null && myRank <= rows.length);
    youEl.innerHTML = '';
    if (!youEl.classList.contains('hidden')) {
      el('span', 'lb-you-label', youEl, 'YOU');
      el('span', 'lb-you-rank', youEl, myRank != null ? '#' + myRank : '—');
      el('span', 'lb-you-xp', youEl, myRank != null ? '' : 'Race today’s affairs to get on the board');
    }
  }

  function paintSignedOut() {
    rowsEl.innerHTML = '';
    youEl.classList.add('hidden');
    const box = el('div', 'lb-signin', rowsEl);
    el('div', 'lb-signin-title', box, 'Sign in to compete');
    el('p', 'lb-signin-sub', box,
      'The board only counts signed-in racers, so a place on it is earned. '
      + 'Your XP keeps saving on this device either way.');
    const b = el('button', 'lb-signin-btn', box, 'Sign in with Google');
    b.type = 'button';
    b.addEventListener('click', () => account?.signIn());
  }

  // Server-scored India board (ca_board). Readable by everyone — the scores are graded on the
  // server, so unlike the old self-reported board there is nothing to hide behind a sign-in.
  async function load() {
    rowsEl.innerHTML = '';
    el('div', 'lb-empty', rowsEl, 'Loading…');
    const { fetchToppers } = await import('./hall-of-fame.js');
    const rows = await fetchToppers(period, 50);
    const myId = account?.currentUser?.()?.id;
    const me = rows.find((r) => r.user_id === myId);
    paint(rows.map((r) => ({ player_id: r.user_id, player_name: r.name, score: r.xp, accuracy: r.accuracy })), me ? me.rank : null);
    if (!account?.isSignedIn?.()) {
      const box = el('div', 'lb-signin', rowsEl);
      el('p', 'lb-signin-sub', box, 'Sign in and race today’s affairs to put your name here.');
      const sb = el('button', 'lb-signin-btn', box, 'Sign in with Google');
      sb.type = 'button';
      sb.addEventListener('click', () => account?.signIn());
    }
  }
  async function open() {
    cheers = loadCheers();
    root.classList.remove('hidden');
    await load();
  }

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && !root.classList.contains('hidden')) { e.preventDefault(); close(); }
  });

  return { open, close, isOpen: () => !root.classList.contains('hidden') };
}

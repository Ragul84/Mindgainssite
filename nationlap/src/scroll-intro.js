// The study scroll: a parchment that unfurls from a rod above the track while the karts sit on
// the grid, before the lights go out.
//
// Why here rather than a separate screen before the race: the reading should feel like part of
// the event, not a menu you clear on the way to one. The scroll drops into the world, everyone
// on the grid waits the same fixed time, and the race starts whether or not you used it — so
// reading is rewarded (the quizzes come from exactly this) without being a wall.
//
// It owns no lesson rendering of its own; tapping it opens the existing lesson reader, which
// runs on a clock here instead of open-ended.

import { bus } from './events.js';

function el(tag, cls, parent, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
}

/** Seconds the grid waits for everyone to study before the countdown starts regardless. */
export const STUDY_SECONDS = 45;


/** Whole lines: the list scrolls now, so nothing needs cutting to fit. */
function briefLine(card, max = Infinity) {
  // The stamp is authored lowercase ("rbi repo rate"). Capitalising the first letter in JS
  // produced "Rbi", "Pmla", "Cop31" — worse than leaving it alone. CSS text-transform handles
  // the whole run, so acronyms come out right.
  const head = (card.stamp || '').trim();
  const why = (card.why || '').trim();
  if (!why) return { head, tail: '' };
  let tail = why;
  if (tail.length > max) {
    const cut = tail.slice(0, max);
    const space = cut.lastIndexOf(' ');
    tail = (space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[,;:\s]+$/, '') + '…';
  }
  return { head, tail };
}

export function createScrollIntro({ uiRoot, onStudy, onDone }) {
  const root = el('div', 'scroll-intro hidden', uiRoot);
  root.innerHTML = `
    <div class="si-stage">
      <div class="si-rod"><span class="si-cap left"></span><span class="si-cap right"></span></div>
      <div class="si-cords"><span></span><span></span></div>
      <div class="si-parchment" role="button" tabindex="0">
        <span class="si-grain"></span>
        <span class="si-subject"></span>
        <span class="si-title"></span>
        <span class="si-rule"></span>
        <span class="si-cta">TAP TO STUDY</span>
        <span class="si-seal"><b class="si-seal-num"></b><i>SEC</i></span>
        <span class="si-foot">The quiz comes from this. Race starts either way.</span>
        <span class="si-affairs">
          <i class="si-aff-meta"></i>
          <span class="si-aff-how"></span>
          <ol class="si-aff-list"></ol>
        </span>
      </div>
      <button type="button" class="si-start">START</button>
      <span class="si-skip"><b>ESC</b> SKIP</span>
      <div class="si-roller"></div>
    </div>`;

  const parchment = root.querySelector('.si-parchment');
  const subjectEl = root.querySelector('.si-subject');
  const titleEl = root.querySelector('.si-title');
  const sealNum = root.querySelector('.si-seal-num');
  const affMeta = root.querySelector('.si-aff-meta');
  const affList = root.querySelector('.si-aff-list');
  const affHow = root.querySelector('.si-aff-how');
  const startBtn = root.querySelector('.si-start');
  const skipHint = root.querySelector('.si-skip');

  let ticker = null;
  let left = 0;
  let closing = false;
  let mode = 'lesson';
  let readToken = false;        // earned by starting from the scroll rather than skipping it
  let onStart = null;

  /* Long enough that the three lines have actually been looked at, short enough that it never
     feels like a lock on a game. The countdown keeps running underneath, so a player who reads
     properly and one who waits both reach the grid at the same time. */
  const READ_SECONDS = 4;

  function stopTicker() { if (ticker) { clearInterval(ticker); ticker = null; } }

  /** Roll the parchment back up, then hand control back so the countdown can start. */
  function dismiss(viaStart) {
    if (closing) return;
    closing = true;
    readToken = mode === 'affairs' ? !!viaStart : true;
    stopTicker();
    root.classList.add('rolling');
    setTimeout(() => {
      root.classList.add('hidden');
      root.classList.remove('rolling');
      onDone?.({ read: readToken });
    }, 620);
  }

  function tick() {
    left -= 1;
    sealNum.textContent = Math.max(0, left);
    root.classList.toggle('urgent', left <= 10);
    if (mode === 'affairs' && left <= STUDY_SECONDS - READ_SECONDS) root.classList.add('si-ready');
    if (left <= 0) dismiss();
  }

  async function study() {
    if (closing) return;
    stopTicker();                       // the reader owns the clock while it's open
    root.classList.add('reading');
    await onStudy?.(left);
    // the reader either ran the clock out or the player finished early; either way we're done
    dismiss();
  }

  parchment.addEventListener('click', (e) => {
    e.preventDefault();
    if (mode === 'lesson') study();          // affairs are already on the parchment to read
  });

  startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!root.classList.contains('si-ready')) return;
    onStart?.();
    dismiss(true);
  });

  // ESC leaves without the boost token — a skip, not a shortcut.
  function onKey(e) {
    if (e.key !== 'Escape' || closing || root.classList.contains('hidden')) return;
    if (mode !== 'affairs') return;
    e.preventDefault();
    dismiss(false);
  }
  window.addEventListener('keydown', onKey);

  function show(zone) {
    mode = 'lesson';
    root.classList.remove('si-affairs-mode', 'si-ready');
    closing = false;
    left = STUDY_SECONDS;
    subjectEl.textContent = (zone?.subject || '').toUpperCase();
    titleEl.textContent = zone?.topic || '';
    sealNum.textContent = left;
    root.classList.remove('hidden', 'rolling', 'reading', 'urgent');
    // restart the unfurl animation on every show
    root.querySelector('.si-stage').style.animation = 'none';
    void root.offsetWidth;
    root.querySelector('.si-stage').style.animation = '';
    stopTicker();
    ticker = setInterval(tick, 1000);
    bus.emit?.('scroll:open', { zoneId: zone?.id });
  }

  /**
   * The briefing: three lines from the day's affairs, then START.
   * `cards` are already ordered by yield, so these are the three most askable things today.
   */
  function showAffairs(cards, { label = 'UPSC · SSC', laps = 1, lap = 1, howTo = false, onStart: started } = {}) {
    mode = 'affairs';
    onStart = started;
    closing = false;
    readToken = false;
    left = STUDY_SECONDS;

    subjectEl.textContent = '';
    const archive = label && label !== 'UPSC · SSC';
    // One compact line of context, so the facts get the parchment rather than the chrome.
    titleEl.textContent = laps > 1 ? `LAP ${lap} / ${laps}` : (archive ? label.toUpperCase() : "TODAY'S RACE");
    const yatra = cards[0] && cards[0].cat === 'bharat';
    affMeta.textContent = `${yatra ? 'Bharat Yatra' : archive ? label : "Today's affairs"} · ${cards.length} facts`;
    // The rules as one line, not a four-step box: shown on a player's first two races only.
    let seen = 0;
    try { seen = parseInt(localStorage.getItem('nl_howto_seen') || '0', 10) || 0; } catch (e) {}
    const showHow = howTo && seen < 2;
    if (showHow) { try { localStorage.setItem('nl_howto_seen', String(seen + 1)); } catch (e) {} }
    affHow.innerHTML = showHow
      ? `<span>Read the ★ lines</span><i>→</i><span>Steer through the right gate <em class="ha">◀ blue</em> <em class="hb">orange ▶</em></span><i>→</i><span>Right = boost</span>`
      : '';
    affHow.hidden = !showHow;
    affList.innerHTML = '';
    for (const c of cards) {
      const li = document.createElement('li');
      // The stamp is the headline, `why` the line that makes it matter. Both arrive at full
      // newspaper length, which overran the parchment and clipped the third item — so each is
      // cut to a coach's sentence. The whole card is still read later on the recap.
      const { head, tail } = briefLine(c);
      const b = document.createElement('b');
      b.textContent = head;
      li.appendChild(b);
      if (tail) li.appendChild(document.createTextNode(' — ' + tail));
      // The gate asks the background fact ("Kuno is in which state?"), not the headline, so
      // the line you must remember is printed under it. Read this, get asked this.
      const key = (c.staticFact || '').split(/(?<=\.)\s/)[0];
      if (key) {
        const k = document.createElement('span');
        k.className = 'si-key';
        k.textContent = '★ ' + key;
        li.appendChild(k);
      }
      affList.appendChild(li);
    }
    sealNum.textContent = left;

    root.classList.remove('hidden', 'rolling', 'reading', 'urgent', 'si-ready');
    root.classList.add('si-affairs-mode');
    root.querySelector('.si-stage').style.animation = 'none';
    void root.offsetWidth;
    root.querySelector('.si-stage').style.animation = '';
    stopTicker();
    ticker = setInterval(tick, 1000);
    bus.emit?.('scroll:open', { mode: 'affairs', count: cards.length });
  }

  return {
    show,
    showAffairs,
    dismiss,
    isOpen: () => !root.classList.contains('hidden'),
  };
}

// On-screen controls for phones/tablets. Without these the game is unplayable on touch —
// there's no way to steer at all.
//
// Layout follows what mobile kart racers settled on, because it's the least fiddly:
//   * throttle is automatic while racing — no pedal to hold down
//   * steering is drag-anywhere on the left of the screen, analog and relative to wherever
//     the finger landed, so there's no tiny target to hit
//   * DRIFT and ITEM are big thumb-reachable buttons on the right
//   * a small BRAKE sits bottom-left for the rare time it's wanted
// Everything only appears while actually racing, and only on touch devices.
import { bus } from './events.js';

const STEER_RANGE = 78; // px of drag for full lock

function el(tag, cls, parent, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}

export function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  try {
    if (window.matchMedia?.('(hover: none) and (pointer: coarse)').matches) return true;
  } catch (e) { /* older browsers */ }
  return 'ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0;
}

export function createTouchControls({ uiRoot, input, onPause }) {
  // lets the stylesheet rearrange the HUD out from under the thumbs
  document.body.classList.add('touch-mode');
  const root = el('div', 'touch-controls hidden', uiRoot);
  root.innerHTML = `
    <div class="tc-steer">
      <div class="tc-wheel"><span class="tc-wheel-dot"></span></div>
      <div class="tc-hint">DRAG TO STEER</div>
    </div>
    <div class="tc-right">
      <button type="button" class="tc-btn tc-brake">BRAKE</button>
      <button type="button" class="tc-btn tc-item">ITEM</button>
      <button type="button" class="tc-btn tc-drift">DRIFT</button>
    </div>
    <button type="button" class="tc-pause" aria-label="Pause">II</button>`;

  // there's no Escape key on a phone — without this there's no way to pause or quit a race
  root.querySelector('.tc-pause').addEventListener('click', (e) => {
    e.preventDefault();
    onPause?.();
  });

  const steerZone = root.querySelector('.tc-steer');
  const wheel = root.querySelector('.tc-wheel');
  const dot = root.querySelector('.tc-wheel-dot');
  const hint = root.querySelector('.tc-hint');
  const driftBtn = root.querySelector('.tc-drift');
  const itemBtn = root.querySelector('.tc-item');
  const brakeBtn = root.querySelector('.tc-brake');

  let steerId = null;
  let startX = 0;
  let enabled = false;

  function setSteer(v) {
    const s = Math.max(-1, Math.min(1, v));
    input.setTouch({ steer: s });
    dot.style.transform = `translateX(${(s * 26).toFixed(1)}px)`;
    wheel.style.transform = `rotate(${(s * 22).toFixed(1)}deg)`;
  }

  steerZone.addEventListener('pointerdown', (e) => {
    if (!enabled || steerId !== null) return;
    steerId = e.pointerId;
    startX = e.clientX;
    steerZone.setPointerCapture?.(e.pointerId);
    wheel.classList.add('on');
    hint.classList.add('fade');
    e.preventDefault();
  });
  steerZone.addEventListener('pointermove', (e) => {
    if (e.pointerId !== steerId) return;
    setSteer((e.clientX - startX) / STEER_RANGE);
    e.preventDefault();
  });
  const endSteer = (e) => {
    if (e.pointerId !== steerId) return;
    steerId = null;
    setSteer(0);
    wheel.classList.remove('on');
  };
  steerZone.addEventListener('pointerup', endSteer);
  steerZone.addEventListener('pointercancel', endSteer);

  // hold-style buttons
  const holdBtn = (node, key) => {
    const down = (e) => { if (!enabled) return; node.classList.add('on'); input.setTouch({ [key]: true }); e.preventDefault(); };
    const up = (e) => { node.classList.remove('on'); input.setTouch({ [key]: false }); e.preventDefault(); };
    node.addEventListener('pointerdown', down);
    node.addEventListener('pointerup', up);
    node.addEventListener('pointercancel', up);
    node.addEventListener('pointerleave', up);
  };
  holdBtn(driftBtn, 'drift');
  holdBtn(brakeBtn, 'brake');

  // item is a one-shot press
  itemBtn.addEventListener('pointerdown', (e) => {
    if (!enabled) return;
    itemBtn.classList.add('on');
    input.setTouch({ item: true });
    e.preventDefault();
  });
  const itemUp = () => itemBtn.classList.remove('on');
  itemBtn.addEventListener('pointerup', itemUp);
  itemBtn.addEventListener('pointercancel', itemUp);

  function show() {
    if (enabled) return;
    enabled = true;
    root.classList.remove('hidden');
    // auto-throttle: nothing to hold, the kart just goes
    input.setTouch({ active: true, throttle: 1, steer: 0, brake: 0, drift: false });
  }
  function hide() {
    if (!enabled) return;
    enabled = false;
    root.classList.add('hidden');
    steerId = null;
    input.setTouch({ active: false, throttle: 0, steer: 0, brake: 0, drift: false });
  }

  // only during actual racing — not menus, not while a quiz/learn card is up
  bus.on('game:state', (d) => {
    if (d.state === 'racing') show();
    else hide();
  });

  return { show, hide, dispose() { root.remove(); } };
}

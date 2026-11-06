// Turbo Kart Rally — bootstrap, renderer, post-processing, game state machine and main loop.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { bus } from './events.js';
import { CHARACTERS, RACE, PHYSICS, CUPS } from './config.js';
import { hasProfile, playerCharacter, rivalRoster, mentorFor, mentorLine } from './player.js';
import { RaceManager } from './race.js';
import { HUD } from './hud.js';
import { Menu } from './menu.js';
import { AudioEngine } from './audio.js';
import { createQuizSystem } from './quiz.js';
import { createLeaderboard } from './lb.js';
import { createLeaderboardScreen } from './leaderboard-screen.js';
import { createLearnBillboards } from './billboards.js';
import { createCupRun, loadActiveRun, clearActiveRun } from './cup.js';
import { TOPIC_ZONES } from './learn-facts.js';
import { preloadMiga } from './assets-preload.js';
import { createJourneyMap } from './journey-map.js';
import { createLessonReader, lessonCards, loadLesson } from './lesson-reader.js';
import { createScrollIntro } from './scroll-intro.js';
import { loadLatest, loadMonth, availableMonths, monthLabel, splitLaps, quizItem, FACTS_PER_LAP } from './affairs.js';
import { newsStreak, bumpNewsStreak } from './news-streak.js';
import { createYatra, recordStateRun, stampedCount, STAMP_AT, stateLaps } from './bharat.js';
import { STATES, myState, isFamily, applyFamily, deviceId } from './prefs.js';
import { formatTime } from './race.js';
import { createFactGates } from './fact-gates.js';
import { createHallOfFame, fetchToppers } from './hall-of-fame.js';
import { createTouchControls, isTouchDevice } from './touch-controls.js';
import { recordCorrect, recordWrong, getJourney, COMPLETE_THRESHOLD, rawZones, replaceZones } from './progress.js';
import * as account from './account.js';
import { createRecorder, createGhost, loadPersonalBest, savePersonalBest } from './ghost.js';

// ---------------------------------------------------------------------------------------------
// Error isolation: one failing subsystem must never freeze the loop. Log once per error type.
// ---------------------------------------------------------------------------------------------
const seenErrors = new Set();
function report(tag, err) {
  const key = tag + '|' + (err && err.message);
  if (seenErrors.has(key)) return;
  seenErrors.add(key);
  console.error(`[${tag}]`, err);
}
function safe(tag, fn) {
  try { return fn(); } catch (err) { report(tag, err); return undefined; }
}

// ---------------------------------------------------------------------------------------------
// Renderer / camera / post
// ---------------------------------------------------------------------------------------------
const canvas = document.getElementById('game-canvas');
const uiRoot = document.getElementById('ui-root');
// Phones are usually 2-3x DPI, and rendering this scene at full device resolution is enough
// GPU pressure to drop frames or lose the context outright on mid-range hardware. Cap lower
// on touch — at phone screen size the difference is hard to see, the frame rate isn't.
const MAX_DPR = isTouchDevice() ? 1.5 : 2;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isTouchDevice(), powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// far plane covers the mountain ring, which environment.js scales out with the (long) track
const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 12000);
camera.position.set(0, 30, 60);

const fallbackScene = new THREE.Scene();
fallbackScene.background = new THREE.Color(0x2a6fdb);

const composer = new EffectComposer(renderer);
composer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
composer.setSize(window.innerWidth, window.innerHeight);
const renderPass = new RenderPass(fallbackScene, camera);
composer.addPass(renderPass);
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.32, 0.45, 0.88);
composer.addPass(bloom);
composer.addPass(new OutputPass());

function onResize() {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
  bloom.setSize(w, h);
}
window.addEventListener('resize', onResize);
// mobile browsers report the pre-rotation size for a moment after orientationchange, so
// re-measure once the new layout has settled as well as on the immediate event
window.addEventListener('orientationchange', () => {
  onResize();
  setTimeout(onResize, 250);
});

// ---------------------------------------------------------------------------------------------
// Modules from other agents are loaded dynamically so a broken file degrades instead of killing the game.
// ---------------------------------------------------------------------------------------------
const mods = {};
async function loadModules() {
  const specs = {
    track: './track.js', kart: './kart.js', ai: './ai.js', input: './input.js',
    items: './items.js', effects: './effects.js', models: './models.js', camera: './camera.js',
  };
  await Promise.all(Object.entries(specs).map(async ([k, p]) => {
    try { mods[k] = await import(p); } catch (e) { console.error(`[main] failed to load ${p}`, e); }
  }));
}

// ---- fallbacks -------------------------------------------------------------------------------
function fallbackKartModel(character) {
  const root = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: character ? character.color : 0xff0000 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 2.4), mat);
  body.position.y = 0.5; body.castShadow = true; root.add(body);
  const anchors = {};
  for (const [n, x, y, z] of [['exhaustL', 0.4, 0.5, -1.3], ['exhaustR', -0.4, 0.5, -1.3], ['wheelRL', 0.8, 0.3, -0.8], ['wheelRR', -0.8, 0.3, -0.8],
    ['wheelFL', 0.8, 0.3, 0.8], ['wheelFR', -0.8, 0.3, 0.8], ['itemHold', 0, 0.6, -1.8]]) {
    const o = new THREE.Object3D(); o.position.set(x, y, z); root.add(o); anchors[n] = o;
  }
  return { root, anchors, animate() {}, setShrunk(s) { root.scale.setScalar(s); }, dispose() { body.geometry.dispose(); mat.dispose(); } };
}
function makeKartModel(character) {
  if (mods.models && mods.models.createKartModel) {
    try { return mods.models.createKartModel(character); } catch (e) { report('models.createKartModel', e); }
  }
  return fallbackKartModel(character);
}

class FallbackAI {
  constructor(kart, track) { this.kart = kart; this.track = track; }
  update() {
    const k = this.kart, tr = this.track;
    const p = tr.getPointAt(((k.trackT || 0) + 25 / (tr.length || 2000)) % 1);
    const dx = p.x - k.position.x, dz = p.z - k.position.z;
    const want = Math.atan2(dx, dz);
    let d = want - k.heading; d = Math.atan2(Math.sin(d), Math.cos(d));
    k.input = { throttle: 1, brake: 0, steer: THREE.MathUtils.clamp(-d * 2, -1, 1), drift: false, item: !!k.item && Math.random() < 0.01, lookBack: false };
  }
}

class FallbackCamera {
  constructor(cam) { this.cam = cam; this.pos = new THREE.Vector3(); this.look = new THREE.Vector3(); }
  snap(k) { this._target(k, this.pos, this.look); this.cam.position.copy(this.pos); this.cam.lookAt(this.look); }
  _target(k, pos, look) {
    const h = k.heading || 0;
    pos.set(k.position.x - Math.sin(h) * 9, k.position.y + 4, k.position.z - Math.cos(h) * 9);
    look.set(k.position.x + Math.sin(h) * 4, k.position.y + 1.2, k.position.z + Math.cos(h) * 4);
  }
  update(dt, k) {
    const p = new THREE.Vector3(), l = new THREE.Vector3();
    this._target(k, p, l);
    const a = 1 - Math.exp(-dt * 6);
    this.pos.lerp(p, a); this.look.lerp(l, a);
    this.cam.position.copy(this.pos); this.cam.lookAt(this.look);
  }
}

// ---------------------------------------------------------------------------------------------
// UI + audio
// ---------------------------------------------------------------------------------------------
const audio = new AudioEngine();
const hud = new HUD(uiRoot);
const lb = createLeaderboard();
// storage can throw (blocked cookies, some in-app webviews) - the game must still boot
const progress = { xp: (() => { try { return parseInt(localStorage.getItem('tkr_xp') || '0', 10) || 0; } catch (e) { return 0; } })(), streak: 0 };
function awardXp(n) {
  progress.xp = Math.max(0, progress.xp + n);
  try { localStorage.setItem('tkr_xp', String(progress.xp)); } catch (e) { /* storage unavailable */ }
  lb.setStreak(progress.streak);
  lb.submitScore(progress.xp);
  hud.toast?.((n >= 0 ? '+' : '') + n + ' XP');
  syncProgress();
}

// ---- account sync ---------------------------------------------------------------------------
// Coalesced: XP is awarded several times a race (a lesson, each correct answer, the finish), and
// each one must not become its own round trip. Signed out this is a no-op and the game is
// exactly as it was — local storage only.
let syncTimer = null;
function syncProgress() {
  if (!account.isSignedIn()) return;
  clearTimeout(syncTimer);
  // xp and zones only: reading now happens on the grid scroll every race, so there is no
  // "lessons already read" set to carry any more
  syncTimer = setTimeout(() => {
    account.push({ xp: progress.xp, zones: rawZones() });
    account.boardSubmit(progress.xp, progress.streak);
  }, 2500);
}

/** On sign-in, fold the account's saved progress into this device's before anything is written. */
async function adoptAccount() {
  const remote = await account.pull();
  if (!remote) { syncProgress(); return; }   // first time on this account: seed it from here
  const merged = account.merge({ xp: progress.xp, zones: rawZones() }, remote);
  progress.xp = merged.xp;
  try { localStorage.setItem('tkr_xp', String(progress.xp)); } catch (e) { /* storage unavailable */ }
  replaceZones(merged.zones);
  lb.submitScore(progress.xp);
}

// Billboards are opt-in reading, not forced: passing one silently banks its fact (shown in
// full on the post-race recap either way) AND, while you're in range, shows a small "L — LEARN"
// hint. Press L to open the full fact right now if you want to; ignore it and keep racing if
// you don't. Nothing ever pops up on its own — only the quiz (which has real stakes) does that.
const FACT_TRIGGER_R = 15, FACT_RESET_R = 42;
// No in-race LEARN prompt any more. Reading happens on the grid scroll before the lights go
// out, and the boards are now recall PROMPTS (the flashcard's question) — offering the answer
// mid-corner both undoes the recall and asks the player to read while steering.
function updateFactBillboards(w) {
  const list = w.billboards && w.billboards.list;
  const player = w.player;
  if (!list || !player || !player.position) return;
  if (!w.factsSeen) w.factsSeen = [];
  for (const b of list) {
    const dx = player.position.x - b.position.x, dz = player.position.z - b.position.z;
    const d2 = dx * dx + dz * dz;
    if (!b.triggered && d2 < FACT_TRIGGER_R * FACT_TRIGGER_R) {
      b.triggered = true;
      if (!w.factsSeen.includes(b.fact)) w.factsSeen.push(b.fact);
    } else if (b.triggered && d2 > FACT_RESET_R * FACT_RESET_R) {
      b.triggered = false;
    }
  }
}

/* Hall of Fame strip: today's India top names, readable on any screen. Shown on the title
   screen and during the countdown (CSS keys off body[data-state]); the 3D gantry down the
   straight is the landmark, this is where the names are actually read. */
let hofStrip = null;
async function refreshHofStrip() {
  if (!hofStrip) {
    hofStrip = document.createElement('div');
    hofStrip.className = 'hof-strip';
    uiRoot.appendChild(hofStrip);
  }
  const rows = await fetchToppers('today', 5);
  const esc = (t) => String(t).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  // One quiet line of the top three. An empty board says nothing rather than "no names yet".
  hofStrip.classList.toggle('empty', !rows.length);
  hofStrip.innerHTML = rows.length
    ? `<b>Today's toppers</b>${rows.slice(0, 3).map((r, i) => `<span class="hs-row${i < 3 ? ' top' : ''}"><i>#${r.rank}</i> ${esc(r.name)}</span>`).join('')}`
    : '';
}
setTimeout(() => safe('hofStrip', refreshHofStrip), 2500);
setInterval(() => { if (state === 'title') safe('hofStrip', refreshHofStrip); }, 120000);

/* Flashcards (front/back) -> multiple choice. The right option is the card's own answer; the
   three wrong ones are answers to OTHER cards in the same lesson, so they are on-topic and
   plausible rather than random. Long answers make unreadable buttons, so those cards are
   left to the billboards. */
function lessonQuizItems(cards) {
  const usable = (cards || []).filter((c) => c && c.front && c.back && c.back.length <= 90);
  if (usable.length < 4) return [];
  const backs = [...new Set(usable.map((c) => c.back.trim()))];
  return usable.map((c, i) => {
    const right = c.back.trim();
    // Wrong options that LOOK like the right one ("Article 12." beside "Article 26.", not
    // beside a full sentence), so the shape of an option never gives the answer away.
    const head = (t) => t.toLowerCase().split(/[\s,.]+/)[0];
    const score = (b) => (head(b) === head(right) ? 0 : 1) + Math.abs(b.length - right.length) / 40 + Math.random() * 0.3;
    const wrong = backs.filter((b) => b !== right).sort((x, y) => score(x) - score(y)).slice(0, 3);
    if (wrong.length < 3) return null;
    const opts = shuffle([right, ...wrong]);
    return { id: 'lesson:' + (focusedZone?.id || '') + ':' + i, q: c.front, opts, ans: opts.indexOf(right), explain: right };
  }).filter(Boolean);
}

/* The revision card for an affairs race. A gate never driven through counts as missed: that is
   the honest reading, and the reason the card is worth screenshotting. */
function affairsRecap() {
  if (!affairsRun) return null;
  const byId = new Map(affairsRun.results.map((r) => [r.id, r]));
  const rows = affairsRun.allGates.map((c) => ({ stamp: c.stamp, correct: !!byId.get(c.id)?.correct }));
  const clean = rows.filter((r) => r.correct).length;
  const firstMiss = affairsRun.allGates.find((c) => !byId.get(c.id)?.correct);
  const revise = firstMiss ? (firstMiss.trap || firstMiss.myth || `${firstMiss.gate.a} vs ${firstMiss.gate.b}`) : '';
  return { rows, revise, clean, total: rows.length };
}

/* India board. The server grades the picks (ca-score) — the browser only says which lane it
   drove through — so a rank shown here is one that was earned. */
const SCORE_FN = 'https://yuntwerxahgmaoduxvqc.supabase.co/functions/v1/ca-score';
async function showLeague(run) {
  const box = uiRoot.querySelector('[data-league]');
  if (!box) return;
  const esc = (t) => String(t).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const pushBtn = '<button class="btn small" data-act="push">🔔 5AM ALERT</button>';
  const wire = () => {
    box.querySelector('[data-act="signin"]')?.addEventListener('click', () => account.signIn());
    const pb = box.querySelector('[data-act="push"]');
    pb?.addEventListener('click', async () => {
      pb.disabled = true; pb.textContent = '…';
      try {
        const { enablePush } = await import('/assets/push.js');
        const st = await enablePush(await account.accessToken?.());
        pb.textContent = st === 'on' ? '🔔 ALERT ON · 5:10 AM' : st === 'denied' ? 'BLOCKED IN BROWSER' : st === 'unsupported' ? 'ADD TO HOME SCREEN FIRST' : '🔔 TRY AGAIN';
        pb.disabled = st === 'on';
      } catch { pb.textContent = '🔔 TRY AGAIN'; pb.disabled = false; }
    });
  };
  if (run.monthKey) { box.innerHTML = `<div class="lg-line">Archive laps are revision — only today's race counts for the India board.</div>${pushBtn}`; wire(); return; }
  const token = await account.accessToken?.();
  if (!token) {
    const r = affairsRecap();
    box.innerHTML = `<div class="lg-line">Sign in to put your <b>${r.clean}/${r.total}</b> on the <b>India board</b> — today's top 10 go on the Hall of Fame.</div>
      <button class="btn small primary" data-act="signin">SIGN IN WITH GOOGLE</button>${pushBtn}`;
    wire(); return;
  }
  box.innerHTML = '<div class="lg-line">Grading on the server…</div>';
  try {
    const res = await fetch(SCORE_FN, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token },
      body: JSON.stringify({ date: run.date, picks: run.results.map((r) => ({ id: r.id, picked: r.picked })) }),
    });
    const d = await res.json();
    if (!res.ok) throw new Error(d.error || res.status);
    box.innerHTML = `<div class="lg-line"><b>+${d.runXp} XP</b> · ${d.correct}/${d.total} correct${d.rank ? ` · <b>#${d.rank} in India today</b>` : ''}</div>
      <div class="lg-sub">${d.rank && d.rank <= 10 ? '🏛 You are on today’s Hall of Fame.' : 'Top 10 every day go on the Hall of Fame at the start line.'}</div>${pushBtn}`;
  } catch (e) {
    box.innerHTML = `<div class="lg-line">${e.message === 'only today counts' ? 'Only today’s race counts for the board.' : 'Could not reach the board — your result is safe on this device.'}</div>${pushBtn}`;
  }
  wire();
}

/* The finish card for today's race: the streak, and one tap to send the result on WhatsApp.
   The link opens straight into today's race, so whoever gets it plays the same news. */
function showFinishShare(run, results) {
  const st = bumpNewsStreak();
  menu.setNewsStreak?.(newsStreak());
  const panel = uiRoot.querySelector('.res-recap');
  if (!panel) return;
  const me = results.find((r) => r.isPlayer);
  const r = affairsRecap();
  const time = me && Number.isFinite(me.time) ? formatTime(me.time) : '';
  let link = location.origin + '/nationlap/?affairs=1';
  // Upload the lap now, while the player reads the card, so the share link can carry it.
  // A friend who opens it races today's news against this exact kart.
  const lap = lastLap; lastLap = null;
  if (lap) {
    fetch('/api/game/ghost', { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ rec: lap, kind: 'affairs', name: account.accountName?.() || playerCharacter().name || 'A friend' }) })
      .then((x) => x.json()).then((j) => { if (j && j.code) link += '&ghost=' + j.code; }).catch(() => {});
  }
  const text = `Today's India${time ? ' in ' + time : ''} · ${r.clean}/${r.total} stories ✓${st.n > 1 ? ` · 🔥 ${st.n}-day streak` : ''}
${lap ? 'Race my ghost through' : 'Race'} today's news on NationLap:`;
  const box = document.createElement('div');
  box.className = 'res-share';
  box.innerHTML = `<div class="rs-streak">${st.n ? `🔥 <b>${st.n}</b>-day news streak${st.bumped && st.n > 1 ? ' · +1 today' : ''}` : ''}</div>
    <div class="rs-state"></div>
    <div class="rs-btns"><button class="btn small rs-wa">SHARE ON WHATSAPP</button><button class="btn small rs-more">SHARE</button></div>`;
  panel.appendChild(box);
  // Most Informed State: today's finish counts for the player's state (turnout, one per day).
  const stEl = box.querySelector('.rs-state'), st0 = myState();
  if (!st0) {
    stEl.innerHTML = `<button class="rs-link">Pick your state</button> to count for it on the Most Informed State board`;
    stEl.querySelector('.rs-link').addEventListener('click', (e) => { e.stopPropagation(); hud.hideResults(); menu.showAvatar({ first: false }); });
  } else {
    fetch('/api/game/informed', { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ state: st0, device: deviceId(), clean: r.clean, total: r.total }) })
      .then((x) => x.json()).then((j) => {
        const row = (j.states || []).find((s) => s.code === st0);
        if (row) stEl.textContent = `🗺 ${STATES[st0]} is #${row.rank} of ${j.states.length} most informed states this week`;
      }).catch(() => {});
  }
  const fire = (to) => { try { bus.emit('ui:confirm'); } catch (e) {} };
  box.querySelector('.rs-wa').addEventListener('click', (e) => { e.stopPropagation(); fire('wa'); window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + link), '_blank', 'noopener'); });
  box.querySelector('.rs-more').addEventListener('click', async (e) => {
    e.stopPropagation(); fire('native');
    try { if (navigator.share) { await navigator.share({ text, url: link }); return; } } catch (err) { if (err && err.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text + ' ' + link); e.target.textContent = 'COPIED'; } catch (err) { /* nothing more to do */ }
  });
}

/* This lap's gates, rebuilt when the lap changes so lap 2 asks lap 2's facts. */
function buildLapGates(w) {
  safe('factGates.dispose', () => w.factGates?.dispose());
  w.factGates = affairsRun.gates.length
    ? safe('factGates.ctor', () => createFactGates(w.scene, w.track, affairsRun.gates))
    : null;
  hud.setGateMarks?.(w.factGates
    ? w.factGates.gates.map((g) => ({ id: g.card.id, x: g.position.x, z: g.position.z, state: 'open' }))
    : null);
  gatePromptFor = null;
}

/* Crossing the line into the next lap: pause, unroll the next batch of facts, then race on. */
bus.on('race:lap', (d) => {
  if (!affairsRun || !d?.kart?.isPlayer || !world) return;
  const next = affairsRun.lapIdx + 1;
  if (next >= affairsRun.lapsFacts.length || d.lap !== next + 1) return;
  affairsRun.lapIdx = next;
  affairsRun.brief = affairsRun.lapsFacts[next];
  affairsRun.gates = affairsRun.brief.filter((c) => c.gate);
  buildLapGates(world);
  affairsRun.midBrief = true;
  prevState = state;
  setState('paused');
  audio.setPaused(true);
  scrollIntro.showAffairs(affairsRun.brief, { laps: affairsRun.lapsFacts.length, lap: next + 1, label: affairsRun.label || undefined });
});

/* The gate question. An arch only shows two answers, which on its own reads as two random
   words; the question has to be on screen before you reach it. */
let gatePromptEl = null, gatePromptFor = null;
function updateGatePrompt(w) {
  if (!gatePromptEl) {
    gatePromptEl = document.createElement('div');
    gatePromptEl.className = 'gate-prompt';
    uiRoot.appendChild(gatePromptEl);
  }
  const p = w?.player, fg = w?.factGates, len = w?.track?.length;
  let best = null, bestD = Infinity;
  if (affairsRun && fg && p && len && state === 'racing') {
    for (const g of fg.gates) {
      if (g.triggered) continue;
      const dist = forwardGapM(p.trackT, g.t, len);
      if (dist < bestD) { bestD = dist; best = g; }
    }
  }
  const show = best && bestD < 380;
  /* Slow motion only for the last few seconds before the arch. It used to start 170 m out at
     30% speed — about 19 seconds of crawling. Now it starts when the arch is ~4 s away at the
     slowed speed (at least 25 m, so a slow kart still gets a moment), at 45% speed. */
  const v = Math.max(8, Math.abs(p?.speed || 0));
  const slow = show && bestD < Math.max(25, v * 0.45 * 4);
  slowTarget = slow ? 0.45 : 1;
  document.body.classList.toggle('gate-slowmo', !!slow);
  if (!show) { if (gatePromptFor) { gatePromptEl.classList.remove('show'); gatePromptFor = null; } return; }
  if (gatePromptFor !== best) {
    gatePromptFor = best;
    const c = best.card;
    const esc = (t) => String(t).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
    // Only the question: the two answers are already written on the arches ahead.
    // On a phone the arch signs are small, so the two answers ride under the question there.
    gatePromptEl.innerHTML = `<b>${esc(c.ask || c.stamp)}</b>` + (document.body.classList.contains('touch-mode') && c.gate
      ? `<div class="gp-row"><i class="gp-a">◀ ${esc(c.gate.a)}</i><i class="gp-b">${esc(c.gate.b)} ▶</i></div>` : '');
    gatePromptEl.classList.add('show');
  }
}

/* Driving through a lane is the answer. Right gets the mini-turbo, wrong bogs you down — the
   same payoffs the roulette quiz already uses, so the mode feels native rather than bolted on.
   Nothing pauses: the choice was made at speed and the consequence arrives at speed. */
function onGatePick({ card, pickedA, correct }) {
  if (!affairsRun) return;
  const kart = world?.player;
  affairsRun.results.push({
    id: card.id,
    stamp: card.stamp,
    picked: pickedA ? card.gate.a : card.gate.b,
    answer: pickedA === (card.gate.answer === 'a') ? null : (card.gate.answer === 'a' ? card.gate.a : card.gate.b),
    correct,
    trap: card.trap,
  });

  // the minimap mark flips the moment the lane is chosen, so the next lap already shows it
  hud.gateMarks?.forEach?.((m) => { if (m.id === card.id) m.state = correct ? 'clean' : 'missed'; });
  // Spin out after a miss and the sign states the fact rather than the obvious.
  /* `trap` describes the confusion in the third person and runs past 90 characters — unreadable
     on a sign you see for about a second mid-spin. `myth` is the belief itself, struck down:
     "NHRC is a constitutional body - false". The lane pair is the fallback; the trap never is. */
  if (!correct) hud.setWrongWayLine?.(card.myth || `${card.gate.a} or ${card.gate.b}?`);

  if (correct) {
    progress.streak++;
    awardXp(20 + Math.min(30, progress.streak * 5));
    const bonus = Math.min(5, progress.streak - 1);
    kart?.applyBoost?.(PHYSICS.mushroomBoostTime + bonus * 0.18, 1 + bonus * 0.12, 'quizCorrect');
    hud.banner?.(card.stamp.toUpperCase(), 'good');
  } else {
    progress.streak = 0;
    awardXp(4);
    kart?.applyHit?.('tumble');
    // The wrong-way style line the player actually needs: the fact, not a scolding.
    hud.banner?.((card.gate.answer === 'a' ? card.gate.a : card.gate.b).toUpperCase(), 'bad');
  }
}

const quiz = createQuizSystem({
  uiRoot,
  onResult: ({ correct, kart }) => {
    const items = world && world.items;
    if (items) items.roulettes.delete(kart);
    if (correct === true) {
      progress.streak++;
      awardXp(20 + Math.min(30, progress.streak * 5));
      const rec = isZoneUnlocked(pendingZone?.id) ? recordCorrect(pendingZone.id) : null;
      if (rec?.justCompleted) hud.toast?.((pendingZone?.topic || 'Topic') + ' cleared! Next one unlocked.');
      // correct answer = instant, guaranteed speed payoff — no waiting to press the item
      // button. Streak makes it stronger, so a hot run genuinely pulls away from the pack.
      const streakBonus = Math.min(5, progress.streak - 1);
      const seconds = PHYSICS.mushroomBoostTime + streakBonus * 0.18;
      const strength = 1 + streakBonus * 0.12;
      kart.applyBoost?.(seconds, strength, 'quizCorrect');
      // still roll a strategic item on top — the boost rewards knowledge immediately,
      // the item rewards banking it for later.
      if (items && kart.item == null) {
        const final = items._rollItem ? items._rollItem(kart) : 'mushroom';
        kart.item = final;
        kart.itemCount = final === 'triple_mushroom' ? 3 : 1;
        bus.emit('item:got', { kart, item: final });
      }
    } else if (correct === false) {
      progress.streak = 0;
      awardXp(4); // small consolation XP for attempting
      // a wrong answer costs ground on the zone, so it can't be cleared by guessing through
      if (isZoneUnlocked(pendingZone?.id)) recordWrong(pendingZone.id);
      // wrong answer = confused/dazed hit: kart spins out and loses most of its speed,
      // same physical reaction as getting shelled — the quiz has real stakes on track.
      kart.applyHit?.('tumble');
    }
    // correct === null (proxy offline): leave the roulette already cleared — items.js
    // won't re-roll it, so just hand a default item so the race never stalls.
    if (correct === null && items && kart.item == null) {
      kart.item = 'mushroom';
      kart.itemCount = 1;
      bus.emit('item:got', { kart, item: 'mushroom' });
    }
    if (state === 'quiz') { setState(prevQuizState || 'racing'); clock.getDelta(); }
  },
});
let prevQuizState = null;
let pendingZone = null;
// Quiz answers only ever count toward a stop the player has already unlocked on the journey
// map. A quick race takes its zone from wherever the kart is on the lap, which can be a locked
// stop; crediting that would mark upcoming stops cleared (and open the one after) out of order.
function isZoneUnlocked(zoneId) {
  if (!zoneId) return false;
  return !!getJourney().find((z) => z.id === zoneId)?.unlocked;
}
function zoneForT(t, zones) {
  if (!zones || !zones.length || t == null) return null;
  const tt = ((t % 1) + 1) % 1;
  for (const z of zones) if (tt >= z.tStart && tt < z.tEnd) return z;
  return null;
}
// Quizzes are gated by distance, not by how many item boxes you happen to hit. Boxes can sit
// close together, and back-to-back popups turn a race into a worksheet. One question per
// MIN_QUIZ_GAP_M at most; boxes inside that window still hand out an item, just no question —
// so the driving never stops for the studying.
const MIN_QUIZ_GAP_M = 600;
let lastQuizT = null; // lap position (0..1) of the last question asked

/** Metres travelled forward around the loop since t0 — wrap-safe, so it needs no lap counter. */
function forwardGapM(t0, t1, len) {
  const a = (((t0 % 1) + 1) % 1), b = (((t1 % 1) + 1) % 1);
  return (((b - a) % 1) + 1) % 1 * len;
}

bus.on('item:pickup', (d) => {
  if (!d || !d.kart || !d.kart.isPlayer || quiz.isOpen()) return;
  // One quiz per mode: in the affairs race the gates are the quiz, boxes just give items.
  if (affairsRun) return;
  if (state !== 'racing') return;
  const len = world?.track?.length;
  const t = d.kart.trackT;
  if (len && t != null) {
    if (lastQuizT != null && forwardGapM(lastQuizT, t, len) < MIN_QUIZ_GAP_M) return; // too soon
    lastQuizT = t;
  }
  // a map-selected focus always wins — that's the whole point of picking a node: every
  // question this race asks comes from that exact topic, not wherever you happen to be
  // driving. Otherwise fall back to whatever zone the track physically has you in.
  const zones = world && world.billboards && world.billboards.zones;
  // A map-picked topic asks from its own lesson's flashcards — what the player just read.
  const lessonItems = focusedZone ? lessonQuizItems(focusedCards) : [];
  pendingZone = lessonItems.length >= 4
    ? { ...focusedZone, items: lessonItems }
    : (focusedZone || zoneForT(d.kart.trackT, zones));
  prevQuizState = state;
  setState('quiz');
});
bus.on('game:state', (d) => {
  if (d.state === 'quiz') {
    const w = world;
    const k = w && w.player;
    if (k) quiz.ask(k, pendingZone);
  }
});
let focusedZone = null;
let focusedCards = null;  // recall prompts for focusedZone, from its lesson's flashcards
/* The affairs race runs on a shorter loop: a lap carries ~6 facts, not 24 boards, and the full
   9.5 km circuit was a 4-minute lap of nothing to read. */
const AFFAIRS_TRACK_SCALE = 2.4;
let pendingAffairs = false;
let affairsRun = null;   // set only while a Today's Affairs race is in flight

/* One race whose content is the day's cards rather than a syllabus topic. Reached from the
   menu button and from the map marker, so it lives here rather than inside either handler. */
async function startAffairsRace(monthKey) {
  // A month ride is the same race with a wider pool: the brief and the gates are drawn from
  // that whole month rather than one morning, so an archive lap is a revision lap.
  let cards, label, date;
  if (monthKey) {
    cards = await loadMonth(monthKey);
    label = monthLabel(monthKey);
    date = monthKey;
  } else {
    const day = await loadLatest();
    cards = day.cards; date = day.date; label = '';
  }
  if (!cards.length) {
    hud.toast?.(monthKey ? 'Nothing recorded for that month.' : 'No affairs yet — the page fills at 5am.');
    return;
  }
  hud.setWrongWayLine?.(null);   // a fresh race starts with the ordinary sign
  /* Items as schemes. Each name is chosen so the mechanic explains the fact: a short boost for
     a direct transfer, brief invincibility for the thing that is hard to undo, a shield for a
     safeguard. You remember it because it happened to you at speed. */
  hud.setItemNames?.({
    mushroom: 'PM-KISAN — a direct transfer, straight to you',
    triple_mushroom: 'MGNREGA — guaranteed, three times over',
    star: 'Constitutional amendment — hard to undo',
    banana: 'Judicial review — someone else trips on it',
    green_shell: 'Ordinance — fired straight, lapses fast',
    red_shell: 'Writ — it finds who you aimed at',
    lightning: 'Demonetisation — everyone shrinks at once',
    blue_shell: 'No-confidence motion — it is coming for the leader',
  });
  /* Read a lap, race a lap. The day is split into laps of up to six facts; each lap's brief,
     gates and item-box questions come only from that lap's facts, so what you are asked is
     always what you just read. */
  const lapsFacts = splitLaps(cards);
  affairsRun = {
    date,
    label,
    monthKey: monthKey || null,
    lapsFacts,
    lapIdx: 0,
    brief: lapsFacts[0],
    gates: lapsFacts[0].filter((c) => c.gate),
    allGates: lapsFacts.flat().filter((c) => c.gate),
    results: [],   // filled by the gates as they are driven through
    boost: false,  // earned by starting from the scroll rather than skipping it
  };
  focusedZone = null; focusedCards = null; focusedLesson = null;
  cupRun = null;
  /* Three laps over the same eight gates. You already know the corners by the second lap, so
     the only thing still being tested is the fact — and a gate you fluffed first time round
     comes back, which is the revision the mode exists for. */
  startRace({ difficulty: isFamily() ? 'easy' : 'hard', laps: lapsFacts.length });
}
/* Bharat Yatra: one race per state, on the affairs machinery (brief, gates, recap). A state's
   cards are one lap; the result stamps the passport instead of touching the news streak or the
   India board, which are for today's news only. */
function startStateRace(code, name, cards) {
  if (!cards.length) { hud.toast?.('That state is not ready yet.'); return; }
  hud.setWrongWayLine?.(null);
  hud.setItemNames?.(null);
  const laps = stateLaps(cards);
  affairsRun = {
    date: '', label: name, monthKey: null, state: code, stateCards: cards,
    lapsFacts: laps, lapIdx: 0, brief: laps[0], gates: laps[0].filter((c) => c.gate),
    allGates: cards.filter((c) => c.gate), results: [], boost: false,
  };
  focusedZone = null; focusedCards = null; focusedLesson = null;
  cupRun = null;
  startRace({ difficulty: isFamily() ? 'easy' : 'normal', laps: laps.length });
}
const yatra = createYatra({ uiRoot, onRace: (code, name, cards) => startStateRace(code, name, cards), onClose: () => {} });

/* The stamp, under the recap of a state race. */
function showStateResult(run) {
  const panel = uiRoot.querySelector('.res-recap');
  const r = affairsRecap();
  const fresh = recordStateRun(run.state, r.clean, r.total);
  if (!panel) return;
  const ok = r.total && r.clean / r.total >= STAMP_AT;
  const box = document.createElement('div');
  box.className = 'res-share';
  box.innerHTML = `<div class="rs-streak">${ok ? (fresh ? `✓ ${run.label} stamped! ${stampedCount()} of 36 in your passport` : `✓ ${run.label} is in your passport`) : `${Math.round(STAMP_AT * 100)}% stamps ${run.label}. Race it again`}</div>
    <div class="rs-btns"><button class="btn small rs-map">BHARAT YATRA MAP</button></div>`;
  panel.appendChild(box);
  box.querySelector('.rs-map').addEventListener('click', (e) => { e.stopPropagation(); hud.hideResults(); goToTitle(); setTimeout(() => yatra.open(), 600); });
}

let focusedLesson = null; // whether this zone has a lesson at all — decides if the scroll drops
const lessonReader = createLessonReader({ uiRoot, awardXp });
// The study scroll that unfurls over the grid. Reading happens here, inside the race, on a
// shared clock — not on a menu screen before it.
const scrollIntro = createScrollIntro({
  uiRoot,
  onStudy: () => lessonReader.show(focusedZone),
  onDone: ({ read } = {}) => {
    // Skipping the brief costs the boost token. It is a real choice, not a shortcut.
    if (affairsRun?.midBrief) {
      affairsRun.midBrief = false;
      if (state === 'paused') { setState('racing'); audio.setPaused(false); clock.getDelta(); }
      return;
    }
    if (affairsRun) affairsRun.boost = !!read;
    if (state === 'intro') beginCountdown();
  },
});
const journeyMap = createJourneyMap({
  uiRoot,
  onAffairs: (monthKey) => startAffairsRace(monthKey),
  onMonths: async () => {
    // The current month stays in the list. Riding a whole month is a different race from
    // riding today — 35 cards against 16 — and filtering it out left the archive looking
    // broken until the calendar turned over.
    const keys = await availableMonths(12);
    return keys.map((k) => ({ key: k, label: monthLabel(k) }));
  },
  onSelectZone: async (zone) => {
    affairsRun = null;
    hud.setItemNames?.(null); hud.setWrongWayLine?.(null); hud.setGateMarks?.(null);
    focusedZone = zone;
    // Both fetched here rather than at world-build time, because building the world is
    // synchronous. The lesson JSON is cached, so the grid scroll re-reads it for free.
    focusedCards = await lessonCards(zone.id);
    focusedLesson = await loadLesson(zone.id);
    // the map already picked the topic, so no racer picker: a short Ready card, then race
    menu.showReady(readyInfo(zone));
    setState('title');
  },
  onClose: () => {},
  // small round mentor portrait beside each subject's header bar
  mentorPortrait: (subject) => {
    const m = mentorFor(subject);
    if (!m || !mods.models || !mods.models.createCharacterPortrait) return null;
    try { return { name: m.name, url: mods.models.createCharacterPortrait(m) }; } catch (e) { return null; }
  },
});
/** Everything the Ready card shows for a map-picked stop. */
function readyInfo(zone) {
  const sp = stopProgress(zone.id);
  const cup = CUPS[0];
  return {
    topic: zone.topic,
    subject: zone.subject,
    mentor: mentorFor(zone.subject),
    mentorLine: mentorLine(zone.subject),
    correct: sp ? sp.zone.correct : 0,
    threshold: COMPLETE_THRESHOLD,
    completed: !!(sp && sp.zone.completed),
    nextTopic: sp && sp.next ? sp.next.topic : null,
    cupName: cup ? cup.name : '',
    heats: cup ? cup.heats : [],
  };
}
const menu = new Menu(uiRoot, {
  onStart: () => startCupRace(),
  // ESC / back on the Ready card returns to the map
  onReadyBack: () => { menu.showTitle(); setState('title'); journeyMap.open(); },
  onEditRacer: () => menu.showAvatar({ first: false }),
  onAvatarDone: () => {
    menu.showTitle(); setState('title');
    if (pendingAffairs) { pendingAffairs = false; startAffairsRace(); }
  },
  onResume: () => resume(),
  onRestart: () => { menu.hideAll(); startRace(lastSettings); },
  onQuit: () => goToTitle(),
  // The title's map is Bharat Yatra now; the syllabus journey stays reachable from a Ready card.
  onMap: () => yatra.open(),
  onJourney: () => journeyMap.open(),
  // quick race is topic-less on purpose: clear any zone left over from a previous journey run,
  // or its billboards and quiz pool would leak into a race the player didn't pick a topic for
  // ...and it goes straight onto the track: a single race, no cup, no topic, no Ready card
  onQuickRace: () => {
    affairsRun = null;
    hud.setItemNames?.(null); hud.setWrongWayLine?.(null); hud.setGateMarks?.(null);
    focusedZone = null; focusedCards = null; focusedLesson = null;
    cupRun = null;
    startRace({ difficulty: isFamily() ? 'easy' : 'normal', laps: RACE.laps });
  },
  // Today's affairs: one race whose content is the day's cards rather than a syllabus topic.
  onAffairs: () => startAffairsRace(),
  onResumeRun: () => resumeCupRace(),
  onBoard: () => boardScreen.open(),
  onScreen: (s) => { setState(s === 'select' ? 'select' : 'title'); },
});
const boardScreen = createLeaderboardScreen({ uiRoot, lb, account, getXp: () => progress.xp });
let input = null;

// ---------------------------------------------------------------------------------------------
// Game state
// ---------------------------------------------------------------------------------------------
let state = 'boot';
let prevState = null;
let world = null;
let lastSettings = { characterIndex: 0, difficulty: 'normal', laps: RACE.laps };
let introTimer = 0;
let resultsShown = false;
let time = 0;
const clock = new THREE.Clock();
const NEUTRAL = Object.freeze({ throttle: 0, brake: 0, steer: 0, drift: false, item: false, lookBack: false });

function setState(s) {
  if (state === s) return;
  state = s;
  document.body.dataset.state = s;
  bus.emit('game:state', { state: s });
}

const RACE_STATES = new Set(['intro', 'countdown', 'racing', 'finished']);

// ---------------------------------------------------------------------------------------------
// World lifecycle
// ---------------------------------------------------------------------------------------------
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

function buildWorld({ mode, characterIndex = 0, difficulty = 'normal', laps = RACE.laps }) {
  if (!mods.track || !mods.track.createTrack) throw new Error('track.js unavailable');
  if (!mods.kart || !mods.kart.Kart) throw new Error('kart.js unavailable');
  const w = { mode, difficulty, laps, karts: [], ais: [], playerAI: null, player: null, scene: new THREE.Scene() };
  w.track = mods.track.createTrack(w.scene, renderer, (mode === 'race' && affairsRun) ? { scale: AFFAIRS_TRACK_SCALE } : undefined);
  // The race is about one topic — the one picked on the journey map, if any.
  // Attract mode skips the boards entirely: with no focus zone they'd place all 49 topics,
  // which is 591 extra meshes built synchronously behind the title screen. That build was the
  // ~2s hitch (and the ~11fps first seconds) on the menu, for signage nobody can read from
  // the orbiting attract camera anyway.
  // Not in the affairs race: headline boards fly past too fast to read and compete with the
  // gate question for attention.
  w.billboards = (mode === 'race' && !affairsRun)
    ? safe('billboards.ctor', () => createLearnBillboards({ scene: w.scene, track: w.track, focusZone: focusedZone, recallCards: focusedCards, affairs: affairsRun ? affairsRun.allGates : null }))
    : { list: [], zones: [], dispose() {} };

  // Lane gates only exist in an affairs race: they ARE the quiz for that mode, so a topic race
  // keeps its roulette quiz and never gets both.
  // Today's India top 10, beside the grid in every race: read standing still, before the lights.
  w.hallOfFame = mode === 'race' ? safe('hallOfFame', () => createHallOfFame(w.scene, w.track)) : null;
  w.factGates = null;
  if (mode === 'race' && affairsRun) buildLapGates(w);
  else hud.setGateMarks?.(null);

  // roster: attract mode = every character in order (kart index == character index)
  let chars;
  // The player races as themselves (their saved name, face and kart colour, balanced stats);
  // the 7 rivals are the themed characters as fellow aspirants - the current subject's mentor
  // always among them, one character sitting the race out so the grid stays at 8.
  if (mode === 'race') {
    chars = [playerCharacter(), ...rivalRoster(focusedZone?.subject, RACE.racers - 1)];
  } else chars = CHARACTERS.slice();
  void characterIndex;

  // The title screen is a camera orbiting a moving pack — it does not need a full grid. Eight
  // karts there cost ~350k triangles and eight AI+physics updates a frame, for a scene nobody
  // races. Four still reads as a pack from the attract camera, and the startup freeze this was
  // causing was the single worst thing about opening the game.
  const { Kart } = mods.kart;
  const kartCount = mode === 'race' ? RACE.racers : 4;
  for (let i = 0; i < kartCount; i++) {
    const character = chars[i % chars.length];
    const isPlayer = mode === 'race' && i === 0;
    const model = makeKartModel(character);
    const kart = new Kart({ scene: w.scene, track: w.track, character, isPlayer, index: i, model });
    w.karts.push(kart);
    if (isPlayer) w.player = kart;
  }

  // grid order: player mid-pack (slot 4 or 5), others shuffled.
  // Sized to the karts that actually exist, not RACE.racers — the attract screen runs a
  // shorter grid, and a fixed length left undefined slots that RaceManager then tried to
  // place, throwing before the title scene could finish building.
  const gridOrder = new Array(w.karts.length);
  const rest = shuffle(w.karts.filter((k) => k !== w.player));
  if (w.player) {
    const slot = Math.min(gridOrder.length - 1, 4 + ((Math.random() * 2) | 0));
    gridOrder[slot] = w.player;
  }
  for (let i = 0; i < gridOrder.length; i++) if (!gridOrder[i]) gridOrder[i] = rest.shift();

  w.race = new RaceManager({ track: w.track, karts: w.karts, player: w.player, laps, silent: mode !== 'race' });
  w.race.placeOnGrid(gridOrder);

  const AIClass = (mods.ai && mods.ai.AIDriver) || null;
  for (const k of w.karts) {
    if (k === w.player) continue;
    let ai = null;
    if (AIClass) ai = safe('ai.ctor', () => new AIClass(k, w.track, { difficulty: mode === 'race' ? difficulty : 'hard' }));
    w.ais.push(ai || new FallbackAI(k, w.track));
  }

  // Item boxes and the effects pool exist to be driven into; on the attract screen they are
  // ~120 meshes and a particle system built for a race that never happens.
  if (mode === 'race') {
    if (mods.items && mods.items.ItemSystem) w.items = safe('items.ctor', () => new mods.items.ItemSystem({ scene: w.scene, track: w.track, karts: w.karts }));
    if (mods.effects && mods.effects.Effects) w.effects = safe('effects.ctor', () => new mods.effects.Effects(w.scene, camera));
  }
  w.chase = (mods.camera && mods.camera.ChaseCamera && safe('camera.ctor', () => new mods.camera.ChaseCamera(camera))) || new FallbackCamera(camera);
  w.ctx = { karts: w.karts, player: w.player || w.karts[0], itemSystem: w.items || null, time: 0 };
  if (w.player) safe('camera.snap', () => w.chase.snap(w.player));

  renderPass.scene = w.scene;
  // Compile every material up front. Three.js otherwise compiles a shader the first frame a
  // material becomes visible, and one such compile cost a 1.4s frozen frame mid-title as the
  // attract camera orbited new scenery into view. Paying it here puts the cost inside the
  // loading moment, where a screen is already up, instead of as a hitch during play.
  //
  // compile() walks only what is visible, so anything that starts hidden — item boxes waiting
  // to respawn, effect particles — would still compile late, on the frame it first shows. So
  // everything is forced visible for the pass and restored straight after.
  //
  // Synchronous compile, not compileAsync: the async form only restores visibility when its
  // promise settles, which left item boxes and particles that are meant to be hidden showing
  // on screen for however long compilation took. Nothing awaits this any more, so there is
  // nothing to gain from the async form and a visible glitch to lose.
  safe('renderer.compile', () => {
    const hidden = [];
    w.scene.traverse((o) => { if (o.visible === false) { hidden.push(o); o.visible = true; } });
    try { renderer.compile(w.scene, camera); }
    finally { for (const o of hidden) o.visible = false; }
  });
  return w;
}

function disposeWorld() {
  disposeGhost();
  const w = world;
  world = null;
  renderPass.scene = fallbackScene;
  if (!w) return;
  safe('dispose.billboards', () => w.billboards && w.billboards.dispose && w.billboards.dispose());
  safe('dispose.hallOfFame', () => w.hallOfFame?.dispose());
  safe('dispose.items', () => w.items && w.items.dispose && w.items.dispose());
  safe('dispose.effects', () => w.effects && w.effects.dispose && w.effects.dispose());
  for (const k of w.karts) safe('dispose.kart', () => k.dispose && k.dispose());
  safe('dispose.track', () => w.track && w.track.dispose && w.track.dispose());
  safe('dispose.race', () => w.race && w.race.dispose());
  safe('dispose.ai', () => { for (const a of [...w.ais, w.playerAI]) a && a.dispose && a.dispose(); });
  safe('dispose.chase', () => w.chase && w.chase.dispose && w.chase.dispose());
  // sweep anything left in the scene graph
  safe('dispose.scene', () => {
    const seen = new Set();
    const dispTex = (m) => {
      for (const key in m) {
        const v = m[key];
        if (v && v.isTexture && !seen.has(v)) { seen.add(v); v.dispose(); }
      }
    };
    w.scene.traverse((o) => {
      if (o.geometry && !seen.has(o.geometry)) { seen.add(o.geometry); o.geometry.dispose(); }
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of mats) if (!seen.has(m)) { seen.add(m); dispTex(m); m.dispose(); }
      if (o.isLight && o.shadow && o.shadow.map) o.shadow.map.dispose();
    });
    if (w.scene.background && w.scene.background.isTexture) w.scene.background.dispose();
    if (w.scene.environment && w.scene.environment.isTexture) w.scene.environment.dispose();
    w.scene.clear();
  });
  renderer.renderLists.dispose();
}

// ---------------------------------------------------------------------------------------------
// Flow
// ---------------------------------------------------------------------------------------------
function buildAttract() {
  disposeWorld();
  try {
    world = buildWorld({ mode: 'attract' });
    world.race.startImmediately();
    // stagger: let them drive for a few seconds instantly so the title shows a spread-out pack
    attractCam.targetIndex = 0; attractCam.switchT = 0;
    uiRoot.classList.remove('no-world');
  } catch (e) {
    report('attract', e);
    disposeWorld();
    uiRoot.classList.add('no-world');
  }
}

function goToTitle() {
  hud.hide(); hud.hideResults();
  audio.setPaused(false);
  audio.setGameplayActive(false);
  resultsShown = false;
  focusedZone = null;
  menu.showLoading('LOADING');
  setTimeout(() => {
    buildAttract();
    menu.showTitle();
    refreshResumeButton();
    setState('title');
    audio.playMusic('menu');
  }, 30);
}

/** Offer to continue an interrupted cup, if one was saved. */
function refreshResumeButton() {
  const saved = loadActiveRun();
  menu.setResumeAvailable?.(saved ? { heat: saved.heatIndex + 1, total: saved.totalHeats } : null);
}

let cupRun = null;
function startCupRace() {
  cupRun = createCupRun('upsc-sprint');
  cupRun.setMeta({ focusZoneId: focusedZone?.id || null });
  const heat = cupRun.currentHeat();
  startRace({ difficulty: heat.difficulty, laps: heat.laps });
}
/** Pick a saved run back up at the heat it was interrupted on. */
async function resumeCupRace() {
  const saved = loadActiveRun();
  if (!saved) return;
  cupRun = createCupRun(saved.cupId, saved);
  lastSettings = { ...lastSettings, characterIndex: saved.characterIndex || 0 };
  // resume on the heat's own zone (not heat 1's), with its cards + lesson loaded too
  if (saved.focusZoneId) await setFocusZone(zoneForHeat(saved.focusZoneId, cupRun.heatIndex));
  const heat = cupRun.currentHeat();
  startRace({ characterIndex: saved.characterIndex || 0, difficulty: heat.difficulty, laps: heat.laps });
}
// Each heat of a cup is its own lesson: heat 1 is the zone picked on the journey map, and every
// later heat moves one stop further along that subject's path — but ONLY among stops the player
// has already unlocked (progress.js rules), so a cup never skips ahead to a locked stop. With
// too few unlocked stops it cycles through the unlocked ones (just heat 1's topic if that's the
// only one). Read at heat start, so a stop genuinely earned during the previous heat counts.
// Before this, focusedZone/focusedCards were only ever set by the map pick, so every heat
// rebuilt the world with heat 1's billboards, recall cards, study scroll and quiz pool.
function zoneForHeat(startZoneId, heatIndex) {
  if (!startZoneId) return null; // cup started without a topic (quick race): stays topic-less
  const journey = getJourney();
  const start = journey.find((z) => z.id === startZoneId);
  if (!start) return null;
  const path = journey.filter((z) => z.subject === start.subject && z.unlocked);
  const i0 = path.findIndex((z) => z.id === start.id);
  if (i0 < 0) return start; // start stop itself isn't unlocked (shouldn't happen) - stay on it
  return path[(i0 + Math.max(0, heatIndex | 0)) % path.length] || start;
}
/** Live map state for a stop plus the next stop on its subject path (null at the path's end). */
function stopProgress(zoneId) {
  if (!zoneId) return null;
  const journey = getJourney();
  const i = journey.findIndex((z) => z.id === zoneId);
  if (i < 0) return null;
  const next = journey[i + 1] && journey[i + 1].subject === journey[i].subject ? journey[i + 1] : null;
  return { zone: journey[i], next };
}
// Cup messaging, so a repeated topic reads as "not cleared yet" rather than a bug.
let raceStartCleared = null; // was this race's topic already cleared when the race began?
let pendingIntroNote = '';   // one-shot line for the next intro card (set by startHeat)
/** Results-screen line for the heat's topic: progress toward clearing it, or what it opened. */
function heatTopicNote() {
  const sp = focusedZone && stopProgress(focusedZone.id);
  if (!sp) return '';
  if (!sp.zone.completed) return `Get ${COMPLETE_THRESHOLD} right to unlock the next stop — ${sp.zone.correct}/${COMPLETE_THRESHOLD} correct`;
  if (raceStartCleared === false) {
    return sp.next && sp.next.unlocked ? `New stop unlocked: ${sp.next.topic}!` : `Topic cleared: ${sp.zone.topic}!`;
  }
  return '';
}

/** Point the race at a zone: its billboards, recall cards, study scroll and quiz pool. */
async function setFocusZone(zone) {
  focusedZone = zone || null;
  focusedCards = zone ? await lessonCards(zone.id) : null;
  focusedLesson = zone ? await loadLesson(zone.id) : null;
}
async function startHeat() {
  const heat = cupRun.currentHeat();
  const startZoneId = cupRun.meta.focusZoneId;
  const prevZoneId = focusedZone?.id || null;
  if (startZoneId) await setFocusZone(zoneForHeat(startZoneId, cupRun.heatIndex));
  pendingIntroNote = '';
  if (startZoneId && focusedZone) {
    const sp = stopProgress(focusedZone.id);
    if (focusedZone.id === prevZoneId) {
      if (sp && !sp.zone.completed) pendingIntroNote = `Replay: clear this topic to unlock the next stop (${sp.zone.correct}/${COMPLETE_THRESHOLD})`;
    } else if (prevZoneId) {
      pendingIntroNote = 'New topic';
    }
  }
  startRace({ ...lastSettings, difficulty: heat.difficulty, laps: heat.laps });
}

function startRace(settings) {
  lastSettings = { ...lastSettings, ...settings };
  raceStartCleared = focusedZone ? !!stopProgress(focusedZone.id)?.zone.completed : null;
  hud.hide(); hud.hideResults();
  menu.showLoading('GET READY!');
  audio.setPaused(false);
  audio.stopMusic();
  setState('loading');
  setTimeout(() => {
    disposeWorld();
    try {
      world = buildWorld({ mode: 'race', ...lastSettings });
    } catch (e) {
      report('buildWorld', e);
      menu.showLoading('RACE FAILED TO LOAD — SEE CONSOLE');
      setTimeout(goToTitle, 2500);
      return;
    }
    resultsShown = false;
    introTimer = 0;
    lastQuizT = null; // fresh race: the first box is allowed to ask straight away
    seenErrors.clear();
    hud.reset({ player: world.player, track: world.track, laps: lastSettings.laps });
    hud.show();
    menu.hideAll();
    audio.setGameplayActive(true);
    uiRoot.classList.remove('no-world');
    setState('intro');
    showIntroCard();
    safe('ghost.spawn', () => spawnGhost(world));
  }, 40);
}

let introCard = null;
function showIntroCard() {
  if (!introCard) introCard = Object.assign(document.createElement('div'), { className: 'intro-card' });
  uiRoot.appendChild(introCard);
  const name = (world && world.track && world.track.name) || 'Grand Circuit';
  const d = { easy: '50cc', normal: '100cc', hard: '150cc' }[lastSettings.difficulty] || '';
  const focusLine = affairsRun
    ? `<div class="ic-focus">TODAY'S AFFAIRS</div>`
    : focusedZone ? `<div class="ic-focus">FOCUS: ${focusedZone.topic}</div>` : '';
  const note = focusedZone ? pendingIntroNote : '';
  pendingIntroNote = ''; // one-shot: never carries into a later race
  const noteLine = note ? `<div class="ic-note${note === 'New topic' ? ' new' : ''}">${note}</div>` : '';
  introCard.innerHTML = `<div class="ic-sub">${d} · ${lastSettings.laps} LAP${lastSettings.laps > 1 ? 'S' : ''}</div><div class="ic-name">${name}</div>${focusLine}${noteLine}<div class="ic-skip">ENTER · SKIP</div>`;
  introCard.classList.remove('show'); void introCard.offsetWidth; introCard.classList.add('show');
  // With a topic picked, the study scroll drops over the grid after the track card has had a
  // beat to read. Without a lesson (quick race, or a zone the vault doesn't cover) nothing
  // drops and ENTER starts the race as before.
  // An affairs race has no zone and no vault lesson — its reading is the briefing — so the
  // scroll has to drop on that condition too, or the one race built around reading is the one
  // race that never shows anything to read.
  if (affairsRun || (focusedZone && focusedLesson)) {
    // a replay/new-topic line needs a moment longer on screen before the scroll covers it
    setTimeout(() => {
      if (state !== 'intro') return;
      hideIntroCard();
      if (affairsRun) scrollIntro.showAffairs(affairsRun.brief, { laps: affairsRun.lapsFacts.length, lap: 1, label: affairsRun.label || undefined, howTo: true });
      else scrollIntro.show(focusedZone);
    }, noteLine ? 2400 : 1100);
  }
}
function hideIntroCard() { if (introCard) introCard.classList.remove('show'); }

function beginCountdown() {
  if (state !== 'intro' || !world) return;
  hideIntroCard();
  world.race.startCountdown();
  setState('countdown');
  safe('camera.snap', () => world.chase.snap(world.player));
}

function pause() {
  if (!RACE_STATES.has(state) || resultsShown) return;
  prevState = state;
  setState('paused');
  menu.showPause();
  audio.setPaused(true);
}
function resume() {
  if (state !== 'paused') return;
  menu.hideAll();
  setState(prevState || 'racing');
  audio.setPaused(false);
  clock.getDelta();
}

// ---------------------------------------------------------------------------------------------
// Ghost racing: record every lap, race the best one back next time.
// ---------------------------------------------------------------------------------------------
let recorder = null;
let ghost = null;
let friendGhost = null;   // {name, rec} from a ?ghost= share link
let lastLap = null;       // today's-race lap, kept so the finish card can share it
let raceElapsedMs = 0;

function disposeGhost() { try { ghost?.dispose(); } catch (e) {} ghost = null; }

/** Spawn the lap to race against: a rival's from the board if there is one, else your own best. */
async function spawnGhost(w) {
  disposeGhost();
  const zoneId = focusedZone?.id || null;
  let rec = null, label = 'Your best';
  // A friend's shared lap comes first on today's race: that is the race the link was sent for.
  const rival = friendGhost && affairsRun ? null : await account.bestGhost(zoneId).catch(() => null);
  if (friendGhost && affairsRun) { rec = friendGhost.rec; label = friendGhost.name + "'s lap"; }
  else if (rival?.recording) { rec = rival.recording; label = rival.player_name || 'Rival'; }
  else rec = loadPersonalBest(zoneId);
  if (!rec) return;
  ghost = safe('ghost.spawn', () => createGhost({
    scene: w.scene, track: w.track, recording: rec, makeModel: makeKartModel,
    // a neutral rival look, so the ghost is never mistaken for your own kart
    character: { id: 'ghost', name: label, color: 0x8fb6ff, accent: 0xffffff, skin: 0xffe0bd, hat: 'cap', stats: { speed: 3, accel: 3, handling: 3, weight: 3 } },
    label,
  })) || null;
  if (ghost) hud.toast?.('Ghost: ' + label);
}

/* Drift coaching. A tap of DRIFT on a straight only hops, which reads as a broken button, so
   the first few times it happens we say what the button is for; the first real drift and the
   first boost get one line each. Remembered per browser, so regulars never see it. */
const DRIFT_TIPS_KEY = 'nl_drift_tips';
let driftTips = (() => { try { return JSON.parse(localStorage.getItem(DRIFT_TIPS_KEY)) || {}; } catch { return {}; } })();
function driftTip(key, msg, max = 1) {
  if (state !== 'racing' || (driftTips[key] || 0) >= max) return;
  driftTips[key] = (driftTips[key] || 0) + 1;
  try { localStorage.setItem(DRIFT_TIPS_KEY, JSON.stringify(driftTips)); } catch {}
  hud.toast?.(msg);
}
bus.on('kart:hop', ({ kart }) => {
  if (!kart.isPlayer) return;
  setTimeout(() => {
    if (!kart.drifting) driftTip('hop', 'DRIFT is for corners: hold it + steer into the turn, let go when sparks glow = BOOST', 3);
  }, 650);
});
const isTouch = () => document.body.classList.contains('touch-mode');
bus.on('kart:driftStart', ({ kart }) => {
  if (kart.isPlayer) driftTip('start', isTouch()
    ? 'Drifting! Hold the turn till sparks go purple, then ease off for a boost'
    : 'Keep holding… blue → orange → purple sparks, then release');
});
bus.on('kart:miniTurbo', ({ kart, level }) => {
  if (kart.isPlayer) driftTip('turbo', level >= 3 ? 'ULTRA BOOST! Longer drift = bigger boost' : 'Drift boost! Hold longer for a bigger one');
});

bus.on('race:go', () => {
  if (state === 'countdown' || (state === 'paused' && prevState === 'countdown')) {
    if (state === 'paused') prevState = 'racing'; else setState('racing');
    audio.playMusic('race');
    raceElapsedMs = 0;
    recorder = world?.track ? createRecorder(world.track) : null;
  }
});
bus.on('race:finish', (d) => {
  if (!world || !d || !d.kart || !d.kart.isPlayer) return;
  setState('finished');
  // bank the lap: a new personal best always, and the account's ghost when signed in
  const rec = recorder?.finish(raceElapsedMs);
  recorder = null;
  if (rec && affairsRun && !affairsRun.monthKey && !affairsRun.state) lastLap = rec;
  if (rec) {
    const zoneId = focusedZone?.id || null;
    if (savePersonalBest(zoneId, rec)) hud.toast?.('New best lap saved');
    account.submitGhost(zoneId, rec);
  }
  // hand the player's kart to an AI so it keeps cruising during the finish camera
  const AIClass = mods.ai && mods.ai.AIDriver;
  world.playerAI = (AIClass && safe('ai.player', () => new AIClass(world.player, world.track, { difficulty: 'easy' }))) || new FallbackAI(world.player, world.track);
});
bus.on('race:end', (d) => {
  if (!world || world.mode !== 'race') return;
  resultsShown = true;
  const results = (d && d.results) || world.race.computeResults();
  if (state === 'paused') resume();
  setTimeout(() => {
    if (!world || !resultsShown) return;
    audio.playMusic('menu');
    if (cupRun) {
      const me = results.find((r) => r.isPlayer);
      const place = me ? me.place : results.length;
      const heatPoints = cupRun.recordHeat(place);
      if (cupRun.isLastHeat()) {
        cupRun.finish();
        // An affairs race grades the gates it offered, not the gates it happened to reach: a
        // gate you never drove through is a miss, which is the honest reading and the reason
        // the card is worth screenshotting.
        const recap = affairsRecap();

        hud.showResults(results, {
          recap,
          laps: world.race.laps,
          facts: world.factsSeen || [],
          cup: {
            mode: 'podium',
            cupName: cupRun.cup.name,
            totalPoints: cupRun.totalPoints,
            maxPoints: cupRun.totalHeats * 15,
            placesByHeat: cupRun.placesByHeat,
            topicNote: heatTopicNote(),
          },
          onMenu: () => { cupRun = null; goToTitle(); },
        });
      } else {
        const finishedHeatIndex = cupRun.heatIndex;
        hud.showResults(results, {
          laps: world.race.laps,
          facts: world.factsSeen || [],
          cup: {
            mode: 'heat',
            cupName: cupRun.cup.name,
            heatIndex: finishedHeatIndex,
            totalHeats: cupRun.totalHeats,
            heatPoints,
            cupTotal: cupRun.totalPoints,
            topicNote: heatTopicNote(),
          },
          onRestart: () => { cupRun.advance(); startHeat(); },
        });
      }
    } else {
      hud.showResults(results, {
        recap: affairsRecap(),
        laps: world.race.laps,
        facts: world.factsSeen || [],
        onRestart: () => (affairsRun?.state ? startStateRace(affairsRun.state, affairsRun.label, affairsRun.stateCards)
          : affairsRun ? startAffairsRace(affairsRun.monthKey) : startRace(lastSettings)),
        onMenu: () => goToTitle(),
      });
      if (affairsRun?.state) safe('passport', () => showStateResult(affairsRun));
      else if (affairsRun) safe('league', () => showLeague(affairsRun));
      if (affairsRun && !affairsRun.monthKey && !affairsRun.state) safe('share', () => showFinishShare(affairsRun, results));
    }
  }, 200);
});

// ---------------------------------------------------------------------------------------------
// Keyboard (global)
// ---------------------------------------------------------------------------------------------
window.addEventListener('keydown', (e) => {
  // typing a racer name: M must not mute, Space/arrows must not be swallowed
  const tg = e.target;
  if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.isContentEditable)) return;
  if (e.code === 'KeyM' && !e.repeat) {
    const muted = audio.toggleMute();
    hud.toast(muted ? 'SOUND OFF' : 'SOUND ON');
    return;
  }
  if ((e.code === 'Escape' || e.code === 'KeyP') && !e.repeat) {
    if (state === 'paused') { if (e.code === 'Escape' || e.code === 'KeyP') { bus.emit('ui:back'); resume(); } }
    else if (RACE_STATES.has(state)) pause();
    return;
  }
  if (state === 'intro' && (e.code === 'Enter' || e.code === 'Space' || e.code === 'NumpadEnter') && !e.repeat) {
    // with the scroll down, skipping means "don't study" — let it roll up and start the race,
    // rather than starting underneath it and leaving it hanging over the track
    if (scrollIntro.isOpen()) scrollIntro.dismiss(); else beginCountdown();
  }
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code) && state !== 'boot') e.preventDefault();
});
canvas.addEventListener('click', () => { if (state === 'intro' && !scrollIntro.isOpen()) beginCountdown(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && (state === 'racing' || state === 'countdown')) pause(); });

// ---------------------------------------------------------------------------------------------
// Attract-mode camera (title / select): cinematic orbit around a kart, or around the track centre
// ---------------------------------------------------------------------------------------------
const attractCam = {
  targetIndex: 0, switchT: 0, angle: 0,
  pos: new THREE.Vector3(0, 40, 80), look: new THREE.Vector3(), init: false,
  _p: new THREE.Vector3(), _l: new THREE.Vector3(),
};
function updateAttractCamera(dt) {
  const w = world;
  const ac = attractCam;
  ac.angle += dt * (state === 'select' ? 0.28 : 0.16);
  let target = null;
  if (w && w.karts.length) {
    if (state === 'select') target = w.karts[menu.charIndex] || w.karts[0];
    else {
      ac.switchT -= dt;
      if (ac.switchT <= 0) {
        ac.switchT = 9;
        const st = w.race.standings;
        const pick = st[(Math.random() * Math.min(4, st.length)) | 0];
        ac.targetIndex = w.karts.indexOf(pick);
      }
      target = w.karts[ac.targetIndex] || w.karts[0];
    }
  }
  if (target) {
    const close = state === 'select';
    const r = close ? 7.5 : 14 + Math.sin(ac.angle * 0.7) * 3;
    const h = target.heading || 0;
    const a = h + (close ? Math.PI * 0.75 + Math.sin(ac.angle) * 0.5 : ac.angle);
    ac._p.set(target.position.x + Math.sin(a) * r, target.position.y + (close ? 2.6 : 5 + Math.sin(ac.angle * 0.5) * 2), target.position.z + Math.cos(a) * r);
    ac._l.set(target.position.x, target.position.y + (close ? 1.1 : 1.5), target.position.z);
    // lead by velocity so the exponential smoothing below has no steady-state lag behind a moving kart
    const v = target.velocity;
    if (v) { const lead = 1 / 2.5; ac._p.addScaledVector(v, lead); ac._l.addScaledVector(v, lead); }
  } else {
    let cx = 0, cz = 0, span = 200;
    const mm = w && w.track && w.track.minimap && w.track.minimap.bounds;
    if (mm) { cx = (mm.minX + mm.maxX) / 2; cz = (mm.minZ + mm.maxZ) / 2; span = Math.max(mm.maxX - mm.minX, mm.maxZ - mm.minZ); }
    ac._p.set(cx + Math.cos(ac.angle) * span * 0.6, span * 0.3, cz + Math.sin(ac.angle) * span * 0.6);
    ac._l.set(cx, 0, cz);
  }
  const k = ac.init ? 1 - Math.exp(-dt * 2.5) : 1;
  ac.init = true;
  ac.pos.lerp(ac._p, k); ac.look.lerp(ac._l, k);
  camera.position.copy(ac.pos);
  camera.lookAt(ac.look);
  if (camera.fov !== 55) { camera.fov = 55; camera.updateProjectionMatrix(); }
}

// ---------------------------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------------------------
let playerInput = null;
const debug = { autopilot: false };
function simulate(w, dt) {
  time += dt;
  w.ctx.time = time;
  const racing = w.mode === 'race';
  const player = w.player;

  if (racing && player && state === 'racing') safe('billboards.update', () => updateFactBillboards(w));
  if (affairsRun || gatePromptFor) safe('gatePrompt', () => updateGatePrompt(w));
  if (racing && player && state === 'racing' && w.factGates) {
    safe('factGates.update', () => w.factGates.update(player, onGatePick));
  }
  if (racing && player && state === 'racing') {
    raceElapsedMs += dt * 1000;
    safe('ghost.record', () => recorder?.sample(player, dt));
    safe('ghost.update', () => ghost?.update(raceElapsedMs));
  }

  // player input (always drain the controller so edge-triggered presses don't queue up)
  if (racing && player) {
    let raw = null;
    if (input) raw = safe('input.getInput', () => input.getInput());
    if (input) safe('input.pause', () => input.consumePressed && input.consumePressed('pause'));
    playerInput = raw || NEUTRAL;
    if (debug.autopilot && !w.playerAI && !player.controlsLocked) {
      const AIClass = mods.ai && mods.ai.AIDriver;
      w.playerAI = (AIClass && safe('ai.player', () => new AIClass(player, w.track, { difficulty: 'hard' }))) || new FallbackAI(player, w.track);
    }
    if ((player.finished || debug.autopilot) && w.playerAI) {
      safe('ai.player', () => w.playerAI.update(dt, w.ctx));
    } else if (player.controlsLocked) {
      player.input = { ...NEUTRAL };
    } else {
      player.input = raw || { ...NEUTRAL };
    }
  }

  for (let i = 0; i < w.ais.length; i++) {
    const ai = w.ais[i];
    try { ai.update(dt, w.ctx); } catch (e) { report('ai.update', e); }
  }
  for (let i = 0; i < w.karts.length; i++) {
    try { w.karts[i].update(dt); } catch (e) { report('kart.update', e); }
  }
  if (mods.kart && mods.kart.resolveKartCollisions) safe('resolveKartCollisions', () => mods.kart.resolveKartCollisions(w.karts));
  if (w.items) safe('items.update', () => w.items.update(dt, time));
  safe('race.update', () => w.race.update(dt));
  if (w.effects) safe('effects.update', () => w.effects.update(dt, w.karts));
  safe('track.update', () => w.track.update && w.track.update(dt, time));
  // keep the sun's shadow frustum centred on whatever the camera is following
  const focus = racing ? player : (w.karts[attractCam.targetIndex] || w.karts[0]);
  if (focus && w.track.setShadowFocus) safe('track.setShadowFocus', () => w.track.setShadowFocus(focus.position));

  // The intro card times out on its own after 4s — but not while the study scroll is down,
  // which runs its own clock and starts the countdown when it rolls up.
  if (racing && state === 'intro' && !scrollIntro.isOpen()) {
    introTimer += dt;
    if (introTimer > 4.0) beginCountdown();
  }
}

let timeScale = 1, slowTarget = 1;
function frame() {
  requestAnimationFrame(frame);
  const rawDt = clock.getDelta();
  if (state !== 'racing') slowTarget = 1;
  timeScale += (slowTarget - timeScale) * Math.min(1, rawDt * 5);
  const dt = Math.min(rawDt, 1 / 30) * timeScale;
  safe('menu.update', () => menu.update(rawDt, resultsShown ? 'results' : state));

  const w = world;
  if (w) {
    const running = state !== 'paused' && state !== 'loading' && state !== 'boot' && state !== 'quiz';
    if (running) simulate(w, dt);

    if (w.mode === 'race' && w.player) {
      if (state !== 'paused') {
        const mode = state === 'intro' ? 'intro' : state === 'countdown' ? 'countdown' : state === 'finished' ? 'finish' : 'race';
        const lookBack = !!(state === 'racing' && playerInput && playerInput.lookBack);
        safe('camera.update', () => w.chase.update(dt, w.player, { lookBack, mode }));
      }
      safe('hud.update', () => hud.update(dt, { player: w.player, karts: w.karts, race: w.race, itemSystem: w.items, track: w.track, time }));
    } else {
      updateAttractCamera(dt);
    }
    safe('audio.update', () => audio.update(dt, { player: w.player, karts: w.karts, camera }));
  } else {
    updateAttractCamera(dt);
    safe('audio.update', () => audio.update(dt, { camera }));
  }

  try { composer.render(dt); } catch (e) { report('render', e); }
}

// ---------------------------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------------------------
async function boot() {
  document.body.dataset.state = 'boot';
  menu.showLoading('LOADING');
  requestAnimationFrame(frame);
  await Promise.all([loadModules(), preloadMiga()]);
  if (mods.input && mods.input.InputController) input = safe('input.ctor', () => new mods.input.InputController());
  // phones/tablets have no keyboard — without on-screen controls the game can't be steered
  if (input && isTouchDevice()) safe('touch.ctor', () => createTouchControls({ uiRoot, input, onPause: () => pause() }));
  if (mods.models && mods.models.createCharacterPortrait) {
    const fn = (c) => mods.models.createCharacterPortrait(c);
    safe('portraits', () => menu.setPortraitProvider(fn));
    hud.setPortraitProvider(fn);
  }
  buildAttract();
  // The title goes up as soon as the world exists and the attract lap plays from the start.
  // An earlier version held LOADING here until every shader had compiled — technically fewer
  // hitches afterwards, but it traded a title that plays for a loading screen that sits there,
  // which is worse to sit through. Shaders are precompiled inside buildWorld instead.
  applyFamily();
  menu.showTitle();
  menu.setNewsStreak?.(newsStreak());
  refreshResumeButton();
  setState('title');
  audio.playMusic('menu');
  // first launch: set up "you" (name, face, kart colour) before anything else
  // mindgains.ai's "Current affairs" links land here with ?affairs: straight into today's race
  // (after the one-time racer setup, if this is a first visit).
  const qs = new URLSearchParams(location.search);
  pendingAffairs = qs.has('affairs') || qs.has('ghost');
  // ?ghost=CODE: a friend's lap from a share link. Fetched before the race builds its world;
  // if it is slow or gone, the race simply runs with the usual ghost.
  const ghostCode = (qs.get('ghost') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  if (ghostCode) {
    await fetch('/api/game/ghost?code=' + ghostCode).then((x) => (x.ok ? x.json() : null)).then((j) => {
      if (j && j.rec) { friendGhost = { name: String(j.name || 'A friend').slice(0, 20), rec: j.rec }; hud.toast?.(`Racing ${friendGhost.name}'s lap`); }
    }).catch(() => {});
  }
  if (!hasProfile()) menu.showAvatar({ first: true });
  else if (pendingAffairs) { pendingAffairs = false; startAffairsRace(); }

  // Account last, and never awaited by anything above it: the game has to be playable whether
  // or not the player is signed in, or online at all. When a session does exist, the saved
  // progress is merged into this device's and kept in sync from then on.
  account.init().then((u) => {
    const bind = (next) => {
      const name = account.accountName();
      lb.setAccountIdentity(next ? { id: next.id, name } : null);
      // show the signed-in identity on the title screen — otherwise signing in on the site and
      // opening the game looked like it hadn't carried across
      const m = (next && next.user_metadata) || {};   // next is null when signed out
      menu.setAccount?.(next ? { name, photoURL: m.avatar_url || m.picture || null } : null);
      if (next) adoptAccount();
    };
    bind(u);
    account.onChange(bind);
  });
}
boot();

// ---------------------------------------------------------------------------------------------
// Debug / test hook
// ---------------------------------------------------------------------------------------------
window.__game = {
  get state() { return state; },
  get world() { return world; },
  get mods() { return mods; },
  audio, hud, menu, renderer, camera, bus,
  startRace: (s = {}) => startRace({ ...lastSettings, ...s }),
  goToTitle,
  skipIntro: () => beginCountdown(),
  errors: () => [...seenErrors],
  /** Put the player on its final lap just behind the line; drive on to finish. */
  toFinalLap() {
    const w = world; if (!w || !w.player) return;
    w.race.debugSetLap(w.player, w.race.laps);
    if (w.race.laps > 1) bus.emit('race:finalLap', {});
  },
  /** Instantly finish the player's race in the current place. */
  finishPlayer() {
    const w = world; if (!w || !w.player) return;
    w.race.debugSetLap(w.player, w.race.laps + 1);
    w.race._finish(w.player);
  },
  PHYSICS,
  debug,
};

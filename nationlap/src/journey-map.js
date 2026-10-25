// The journey map — a faithful Candy Crush-style level path, then re-skinned to our content.
//
// Structural lessons taken directly from the reference screenshot:
//  * it is a NARROW VERTICAL COLUMN (~460px) with framed side borders, not a wide landscape
//    spread — this is why the reference feels dense and its nodes feel big
//  * node colors CYCLE per node (blue/teal/purple/orange/pink), they are not one flat color
//    per region — that repetition was what made ours read as dull
//  * each node is a glossy disc with a big number and a star cluster underneath
//  * the path is a WIDE candy-striped ribbon, roughly a node-diameter across
//  * ground is dense: mounds, props and small detail fill nearly every gap
//
// Nodes are locked/unlocked/completed per progress.js. Tapping an unlocked node picks it as
// the "focus" for the next race — every item box that race asks from that exact zone's pool
// (see main.js's focusedZone wiring), and correct answers there unlock the next node.
import { CHARACTERS } from './config.js';
import { getJourney, overallStats, SUBJECT_ORDER } from './progress.js';
import { iconSvg } from './icons.js';

const SUBJECT_COLOR = new Map(CHARACTERS.map((c) => [c.subject, c.color]));
const hex = (c) => '#' + (c >>> 0).toString(16).padStart(6, '0').slice(-6);

// per-node cycling palette — the reference alternates disc colors level to level
const NODE_COLORS = ['#3d9bfc', '#2ec4a6', '#a85fe8', '#f2913d', '#ee5f9b', '#5fc74a'];

const SUBJECT_ART = {
  Polity: 'assets/icons/polity-icon.png',
  History: 'assets/icons/history-icon.png',
  Geography: 'assets/icons/geography-icon.png',
  Science: 'assets/icons/science-icon.png',
  Quant: 'assets/icons/quant-icon.png',
};

/**
 * Biomes — the world-map idea the big platformers all lean on: a journey doesn't read as a
 * journey when every stop sits on the same green field. Donut Plains has to look nothing like
 * Vanilla Dome. So each subject owns a terrain: its own ground ramp, its own mix of props, its
 * own haze. Colours stay inside the 3D world's soft low-poly range (sampled greens around
 * #9acd72, haze #b3c3c0) so the map still reads as the same game, just a different stretch of
 * it — `tint` is a hue-rotate/saturate filter applied to the shared prop art rather than a
 * separate set of images to author.
 */
const BIOMES = {
  Polity:            { near: '#93c46e', far: '#a9c791', haze: '#b7c6bd', props: ['tree', 'tree', 'bush', 'rock'],  tint: 'none' },
  History:           { near: '#d8bd84', far: '#e2d0a6', haze: '#ddd3bb', props: ['rock', 'bush', 'rock', 'tree'],  tint: 'sepia(0.45) saturate(1.15) hue-rotate(-18deg)' },
  Geography:         { near: '#9dc3a4', far: '#b3cdbd', haze: '#c2d2d0', props: ['pine', 'rock', 'pine', 'rock'],  tint: 'saturate(0.85) hue-rotate(8deg)' },
  Economy:           { near: '#d9c46f', far: '#e6d693', haze: '#dfd6b4', props: ['bush', 'tree', 'bush', 'rock'],  tint: 'saturate(1.2) hue-rotate(-28deg)' },
  Science:           { near: '#86c2b6', far: '#a5d0c8', haze: '#bcd2ce', props: ['tree', 'rock', 'bush', 'tree'],  tint: 'hue-rotate(38deg) saturate(0.95)' },
  Quant:             { near: '#9fb6cf', far: '#b6c7da', haze: '#c4d0dc', props: ['rock', 'pine', 'rock', 'bush'],  tint: 'hue-rotate(120deg) saturate(0.6)' },
  Reasoning:         { near: '#ae9ecb', far: '#c3b6d9', haze: '#ccc4dd', props: ['pine', 'rock', 'pine', 'bush'],  tint: 'hue-rotate(196deg) saturate(0.75)' },
  'Current Affairs': { near: '#8cc0d2', far: '#a8d1de', haze: '#bcd5dd', props: ['bush', 'rock', 'bush', 'tree'],  tint: 'hue-rotate(150deg) saturate(0.8)' },
};
const DEFAULT_BIOME = BIOMES.Polity;
const biomeFor = (subject) => BIOMES[subject] || DEFAULT_BIOME;

function el(tag, cls, parent, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}

// deterministic pseudo-random per index, so scenery scatter is stable across re-renders
function rnd(seed) {
  const s = Math.sin(seed * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

const ROW_H = 118;
const REGION_GAP = 130; // breathing room between subjects, where the region banner sits
// the opening landmark's art rises ~72px above its node centre, so the banner has to clear
// that much plus its own height or it lands on top of the artwork
// (art top sits ~72px above the node centre; banner is 30px tall -> RISE 122 leaves ~20px clear)
const BANNER_RISE = REGION_GAP - 8;
// Top of the column: sky + the NATIONLAP start banner, kept clear of the sticky header,
// so the first region gate and its landmark are fully on screen. Bottom: room for the finish.
const TOP_PAD = 300;
const BOTTOM_PAD = 230;
// x positions as % of the COLUMN (not the screen) — a tight winding S, like the reference
const WIND_X = [28, 52, 74, 60, 34, 22, 40, 66];
const SCENERY = ['tree', 'pine', 'bush', 'rock'];
const SCENERY_SIZE = { tree: 52, pine: 52, bush: 46, rock: 38 };

function catmullRomPath(pts) {
  if (pts.length < 2) return '';
  const p = pts;
  let d = `M ${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

// Stars are a reward, so they only appear once there's something to show. Rendering three
// grey ones under all 49 stops put a row of dead pips under every locked node and was most
// of what made the map feel cluttered and samey.
function starRow(filled) {
  if (!filled) return '';
  const s = iconSvg('star');
  return `<span class="jn-stars">${[0, 1, 2]
    .map((i) => `<span class="jn-star${i < filled ? ' on' : ''}">${s}</span>`)
    .join('')}</span>`;
}

export function createJourneyMap({ uiRoot, onAffairs, onMonths, onSelectZone, onClose, mentorPortrait }) {
  // subject mentor's round portrait (from main.js / models.js), or '' when unavailable
  const mentorHtml = (subject, cls) => {
    let m = null;
    try { m = mentorPortrait?.(subject) || null; } catch (e) { m = null; }
    if (!m || !m.url) return '';
    return `<span class="${cls}" title="Mentor: ${m.name}"><img src="${m.url}" alt="${m.name}" /></span>`;
  };
  const root = el('div', 'journey-screen hidden', uiRoot);
  root.innerHTML = `
    <div class="journey-backdrop"></div>
    <button type="button" class="journey-back">←</button>
    <div class="journey-affairs-wrap">
      <button type="button" class="journey-affairs" title="Today's affairs">
        <span class="ja-badge"></span>
        <span class="ja-label">TODAY'S<br>AFFAIRS</span>
      </button>
      <button type="button" class="ja-more" aria-label="Earlier months" aria-expanded="false">⌄</button>
      <div class="ja-months hidden" role="menu"></div>
    </div>
    <div class="journey-stats-pill"></div>
    <div class="journey-scroll">
      <div class="journey-column">
        <div class="journey-edge left"></div>
        <div class="journey-edge right"></div>
        <div class="journey-track">
          <div class="journey-biomes"></div>
          <div class="journey-scenery"></div>
          <svg class="journey-svg"></svg>
          <div class="journey-nodes"></div>
        </div>
      </div>
    </div>
    <div class="journey-rail"></div>
    <div class="journey-header"><span class="jh-mentor-slot"></span><span class="jh-beam"><span class="jh-flags"></span><span class="jh-plate"></span></span></div>
    <div class="journey-more" aria-hidden="true"><span class="jmo-chip">▼ SCROLL</span></div>
    <div class="journey-hint" role="status" aria-live="polite"></div>`;
  const statsEl = root.querySelector('.journey-stats-pill');
  const columnEl = root.querySelector('.journey-column');
  const trackEl = root.querySelector('.journey-track');
  const svgEl = root.querySelector('.journey-svg');
  const nodesEl = root.querySelector('.journey-nodes');
  const sceneryEl = root.querySelector('.journey-scenery');
  const biomesEl = root.querySelector('.journey-biomes');
  const railEl = root.querySelector('.journey-rail');
  const scrollEl = root.querySelector('.journey-scroll');
  root.querySelector('.journey-back').addEventListener('click', () => close());
  // The day's affairs are not a stop on the journey — they change every morning and belong to
  // no zone — so they get their own standing marker rather than a node on the path.
  root.querySelector('.journey-affairs').addEventListener('click', (e) => {
    e.stopPropagation();
    close();
    onAffairs?.();
  });

  /* The archive sits behind a chevron rather than in front of it: today is the thing that
     changed this morning and stays one tap, and a month list in the main path would make the
     daily habit cost a choice every day. */
  const moreBtn = root.querySelector('.ja-more');
  const monthsEl = root.querySelector('.ja-months');
  let monthsLoaded = false;

  async function toggleMonths(e) {
    e.stopPropagation();
    const opening = monthsEl.classList.contains('hidden');
    monthsEl.classList.toggle('hidden', !opening);
    moreBtn.setAttribute('aria-expanded', opening ? 'true' : 'false');
    if (!opening || monthsLoaded) return;

    monthsLoaded = true;
    monthsEl.innerHTML = '<span class="jam-note">loading…</span>';
    const months = (await onMonths?.()) || [];
    if (!months.length) { monthsEl.innerHTML = '<span class="jam-note">no archive yet</span>'; return; }
    monthsEl.innerHTML = '';
    for (const m of months) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'jam-item';
      b.textContent = m.label;
      b.addEventListener('click', (ev) => { ev.stopPropagation(); close(); onAffairs?.(m.key); });
      monthsEl.appendChild(b);
    }
  }
  moreBtn.addEventListener('click', toggleMonths);
  // clicking anywhere else closes it, so it never sits open over the map
  root.addEventListener('click', () => {
    monthsEl.classList.add('hidden');
    moreBtn.setAttribute('aria-expanded', 'false');
  });
  let lastYByIdx = [];
  let activeSubject = null;   // which region the map is showing; the rail switches it
  let lastSpans = [];
  let lastGates = []; // [{el, top}] so a gate can hide once the sticky header has taken it over
  const headerEl = root.querySelector('.journey-header');
  const headerPlate = root.querySelector('.jh-plate');
  const headerMentor = root.querySelector('.jh-mentor-slot');
  const moreEl = root.querySelector('.journey-more');
  let headerSubject = null;
  // Sticky header shows the region you're scrolled into; the bottom fade + chip shows only
  // while there's more path below.
  function updateChrome() {
    const y = scrollEl.scrollTop;
    const probe = y + 70; // header's bottom edge: a region takes over once its gate passes under
    let span = null;
    for (const s of lastSpans) if (lastYByIdx[s.startIdx] - BANNER_RISE <= probe) span = s;
    if (!span && headerSubject !== '') {
      // above the first gate the start banner is on screen - the header names the whole path
      headerSubject = '';
      headerEl.style.setProperty('--bc', '#1e6fe8');
      headerPlate.innerHTML = '<span>YOUR JOURNEY</span>';
      headerMentor.innerHTML = '';
    }
    if (span && span.subject !== headerSubject) {
      headerSubject = span.subject;
      const art = SUBJECT_ART[span.subject];
      headerEl.style.setProperty('--bc', hex(SUBJECT_COLOR.get(span.subject) ?? 0x2f8bff));
      headerPlate.innerHTML = `<span class="jb-icon">${art ? `<img src="${art}" alt="" />` : iconSvg(span.subject)}</span><span>${span.subject.toUpperCase()}</span>`;
      headerMentor.innerHTML = mentorHtml(span.subject, 'jh-mentor');
    }
    // a gate that has scrolled under the sticky header would otherwise peek out below it as
    // a doubled bar; the header now shows that subject, so hide the in-flow copy
    for (const g of lastGates) g.el.classList.toggle('jg-passed', g.top <= probe);
    const atEnd = y + scrollEl.clientHeight >= scrollEl.scrollHeight - 60;
    moreEl.classList.toggle('show', !atEnd);
  }
  // short "why can't I play this" hint, shown when a locked stop is tapped
  const hintEl = root.querySelector('.journey-hint');
  let hintTimer = 0;
  function showHint(text) {
    hintEl.textContent = text;
    hintEl.classList.remove('show'); void hintEl.offsetWidth; hintEl.classList.add('show');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => hintEl.classList.remove('show'), 2400);
  }

  function close() {
    window.removeEventListener('resize', updateChrome);
    root.classList.add('hidden');
    onClose?.();
  }

  function render() {
    const full = getJourney();
    const stats = overallStats();
    statsEl.textContent = `${stats.completed} / ${stats.total}`;

    // ONE SUBJECT AT A TIME.
    //
    // All 49 stops on a single column is ~6,800px of scrolling — you can't see the journey at
    // that length, you just scroll past it, and every prop and label in between reads as
    // clutter. The rail already lets you move between subjects, so the map shows the subject
    // you're in and nothing else: about 1,000px, one screenful of scroll.
    if (!activeSubject) {
      const here = full.find((z) => z.due) || full.find((z) => z.unlocked && !z.completed) || full[0];
      activeSubject = here ? here.subject : SUBJECT_ORDER[0];
    }
    const journey = full.filter((z) => z.subject === activeSubject);
    if (!journey.length) return;

    nodesEl.innerHTML = '';
    sceneryEl.innerHTML = '';
    biomesEl.innerHTML = '';
    railEl.innerHTML = '';

    const spans = [];
    journey.forEach((z, i) => {
      const last = spans[spans.length - 1];
      if (!last || last.subject !== z.subject) spans.push({ subject: z.subject, startIdx: i, endIdx: i });
      else last.endIdx = i;
    });

    // Extra vertical gap at each region change so the region banner gets clear space of its
    // own — without it the banner lands on top of the region's opening landmark and hides it.
    const yByIdx = [];
    let cursor = TOP_PAD;
    journey.forEach((z, i) => {
      if (i > 0 && journey[i - 1].subject !== z.subject) cursor += REGION_GAP;
      yByIdx[i] = cursor;
      cursor += ROW_H;
    });
    const totalH = cursor + BOTTOM_PAD;
    lastYByIdx = yByIdx;
    lastSpans = spans;
    lastGates = [];
    headerSubject = null;
    columnEl.style.height = totalH + 'px';
    trackEl.style.height = totalH + 'px';

    // fractional index -> y, so scenery scattered "between" nodes still lands correctly
    const yAt = (t) => {
      const i = Math.max(0, Math.min(journey.length - 1, Math.floor(t)));
      const j = Math.min(journey.length - 1, i + 1);
      return yByIdx[i] + (yByIdx[j] - yByIdx[i]) * (t - i);
    };

    const pts = journey.map((z, i) => ({
      x: WIND_X[i % WIND_X.length],
      y: yByIdx[i],
    }));

    // ---- ground: mounds first (props sit on them), then props, then detail ----
    spans.forEach((s, si) => {
      const color = hex(SUBJECT_COLOR.get(s.subject) ?? 0x2f8bff);
      const biome = biomeFor(s.subject);
      const top = yByIdx[s.startIdx] - REGION_GAP * 0.72;
      const bottom = yByIdx[s.endIdx] + ROW_H * 0.55;
      const zonesInSpan = s.endIdx - s.startIdx + 1;

      // ---- the region's own terrain: each subject is a distinct stretch of country, and the
      // band overlaps its neighbour so one biome dissolves into the next instead of butting
      // up against it in a hard line ----
      const bandTop = si === 0 ? 0 : top - 60;
      const bandBottom = si === spans.length - 1 ? totalH : bottom + 60;
      const band = el('div', 'journey-biome', biomesEl);
      band.style.top = bandTop + 'px';
      band.style.height = (bandBottom - bandTop) + 'px';
      band.style.setProperty('--near', biome.near);
      band.style.setProperty('--far', biome.far);
      band.style.setProperty('--haze', biome.haze);

      const region = el('div', 'journey-region', sceneryEl);
      region.style.top = top + 'px';
      region.style.height = (bottom - top) + 'px';
      region.style.setProperty('--rc', color);

      // ---- region gate: the checkered gantry you drive under at the start of a real circuit,
      // instead of a flat UI pill. It marks entering a new country. ----
      const gate = el('div', 'journey-gate', nodesEl);
      gate.style.top = (yByIdx[s.startIdx] - BANNER_RISE) + 'px';
      lastGates.push({ el: gate, top: yByIdx[s.startIdx] - BANNER_RISE });
      gate.style.setProperty('--bc', color);
      const art = SUBJECT_ART[s.subject];
      gate.innerHTML =
        mentorHtml(s.subject, 'jg-mentor') +
        `<span class="jg-beam">` +
          `<span class="jg-flags"></span>` +
          `<span class="jg-plate">` +
            `<span class="jb-icon">${art ? `<img src="${art}" alt="" />` : iconSvg(s.subject)}</span>` +
            `<span>${s.subject.toUpperCase()}</span>` +
          `</span>` +
        `</span>`;

      // raised grass mounds — the reference seats its props on lighter elevated ground
      const moundCount = zonesInSpan * 2;
      for (let k = 0; k < moundCount; k++) {
        const t = s.startIdx + rnd(s.startIdx * 2.7 + k * 1.9) * zonesInSpan;
        const m = el('div', 'journey-mound', sceneryEl);
        // raised ground belongs to its biome — green hillocks sitting on History's sand was
        // the giveaway that the terrain was painted but the detail on it wasn't
        m.style.setProperty('--mound-hi', biome.far);
        m.style.setProperty('--mound-lo', biome.near);
        m.style.left = (8 + rnd(k * 4.8 + s.startIdx) * 84) + '%';
        m.style.top = (yAt(t) + (rnd(k * 2.2) - 0.5) * ROW_H * 0.8) + 'px';
        m.style.width = (70 + rnd(k * 6.1) * 110) + 'px';
        m.style.height = (26 + rnd(k * 3.4) * 22) + 'px';
      }

      // thinned from 6 per stop: at that density the trees closed over the path and the whole
      // column read as texture rather than as somewhere you travel through
      const propCount = Math.round(zonesInSpan * 3.5);
      for (let k = 0; k < propCount; k++) {
        const t = s.startIdx + rnd(s.startIdx * 3.1 + k) * zonesInSpan;
        const idx = Math.max(0, Math.min(journey.length - 1, Math.floor(t)));
        const baseX = WIND_X[idx % WIND_X.length];
        const side = rnd(s.startIdx * 5.3 + k * 2.2) > 0.5 ? 1 : -1;
        const propX = Math.max(3, Math.min(97, baseX + side * (18 + rnd(k * 9.1) * 30)));
        const propY = yAt(t) + (rnd(k * 4.4) - 0.5) * ROW_H * 0.85;
        // props come from the region's own mix and carry its tint, so History reads as dry
        // scrub and Geography as alpine pine off the same handful of rendered meshes
        const kind = biome.props[Math.floor(rnd(s.startIdx * 2.1 + k) * biome.props.length)];
        const scale = 0.7 + rnd(k * 6.6) * 0.6;
        const prop = el('img', 'journey-prop', sceneryEl);
        prop.src = `assets/scenery/${kind}.png`;
        prop.alt = '';
        prop.style.left = propX + '%';
        prop.style.top = propY + 'px';
        prop.style.width = SCENERY_SIZE[kind] + 'px';
        prop.style.transform = `translate(-50%, -92%) scale(${scale.toFixed(2)})`;
        prop.style.zIndex = String(Math.round(propY));
        if (biome.tint !== 'none') prop.style.filter = biome.tint + ' drop-shadow(0 4px 3px rgba(0,0,0,0.28))';
        // every prop sways on its own offset and tempo, so the roadside is never a still frame
        prop.style.setProperty('--sway', (2.8 + rnd(k * 7.7) * 2.4).toFixed(2) + 's');
        prop.style.setProperty('--sway-delay', (rnd(k * 3.9) * -4).toFixed(2) + 's');
        prop.style.setProperty('--sway-deg', (1.1 + rnd(k * 2.4) * 1.6).toFixed(2) + 'deg');
        prop.style.setProperty('--prop-scale', scale.toFixed(2));
      }

      const cloudCount = 1 + Math.round(rnd(s.startIdx * 1.7) * 1);
      for (let k = 0; k < cloudCount; k++) {
        const cy = top + rnd(s.startIdx * 8.8 + k) * (bottom - top);
        const cloud = el('img', 'journey-cloud', sceneryEl);
        cloud.src = 'assets/scenery/cloud.png';
        cloud.alt = '';
        cloud.style.left = (8 + rnd(k * 3.3 + s.startIdx) * 80) + '%';
        cloud.style.top = cy + 'px';
        cloud.style.width = (64 + rnd(k * 5.5) * 40) + 'px';
        cloud.style.animationDelay = (rnd(k * 9.9) * -20).toFixed(1) + 's';
      }

      // Sparse pale wildflowers, not confetti. The hot pink/cyan dots read as UI sparkle —
      // nothing in the 3D world is that saturated except manmade signage.
      const flowerCount = zonesInSpan * 4;
      const HUES = ['#f2f6ee', '#e8edd8', '#fff3c4', '#dfe9d6'];
      for (let k = 0; k < flowerCount; k++) {
        const t = s.startIdx + rnd(s.startIdx * 4.4 + k * 1.3) * zonesInSpan;
        const f = el('div', 'journey-flower', sceneryEl);
        f.style.left = (3 + rnd(k * 7.2 + s.startIdx) * 94) + '%';
        f.style.top = (yAt(t) + (rnd(k * 5.1) - 0.5) * ROW_H) + 'px';
        f.style.background = HUES[Math.floor(rnd(k * 3.7 + s.startIdx) * HUES.length)];
      }
    });

    // ---- the track: asphalt with red/white racing kerbs and a dashed centreline, matching
    // the kerbs and road surface of the actual 3D circuit rather than a candy ribbon ----
    if (pts.length > 1) {
      const d = catmullRomPath(pts);
      svgEl.setAttribute('viewBox', `0 0 100 ${totalH}`);
      svgEl.setAttribute('preserveAspectRatio', 'none');
      svgEl.innerHTML = `
        <path d="${d}" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" transform="translate(0,4)" />
        <path d="${d}" fill="none" stroke="#ffffff" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
        <path d="${d}" fill="none" stroke="#e8352f" stroke-width="30" stroke-linecap="butt" stroke-dasharray="7 7" vector-effect="non-scaling-stroke" />
        <path d="${d}" fill="none" stroke="#3c4152" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
        <path d="${d}" fill="none" stroke="#4a5063" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
        <path class="jsvg-centre" d="${d}" fill="none" stroke="#ffd23f" stroke-width="2" stroke-dasharray="6 7" stroke-linecap="round" vector-effect="non-scaling-stroke" />
        <path class="jsvg-flow" d="${d}" fill="none" stroke="#fff5cc" stroke-width="17" stroke-linecap="round" stroke-dasharray="22 760" vector-effect="non-scaling-stroke" />`;
    }

    // ---- start + finish: the same barrier banner as the 3D track (NATION / LAP / START /
    // GO!), so the map opens on the game's own start line and closes on a chequered finish ----
    const sky = el('div', 'journey-sky', sceneryEl);
    sky.style.height = (TOP_PAD - 40) + 'px';
    const start = el('div', 'journey-start', nodesEl,
      '<span class="js-panel b">NATION</span><span class="js-panel y">LAP</span>'
      + '<span class="js-panel r">START</span><span class="js-panel w">★ GO! ★</span>');
    start.style.top = (TOP_PAD - 175) + 'px';
    if (journey.length) {
      const fin = el('div', 'journey-finish', nodesEl, '<span class="jf-plate">FINISH</span>');
      fin.style.top = (yByIdx[journey.length - 1] + 120) + 'px';
    }

    // ---- nodes ----
    journey.forEach((z, i) => {
      const span = spans.find((s) => i >= s.startIdx && i <= s.endIdx);
      const stepNum = i - span.startIdx + 1;
      const color = NODE_COLORS[i % NODE_COLORS.length];
      const stateCls = z.completed ? 'completed' : z.unlocked ? 'unlocked' : 'locked';
      // the first stop of each subject is a landmark, using that subject's illustrated art —
      // it marks the region opening the way the reference uses distinct set-piece buildings
      const isOpener = i === span.startIdx;
      // The last stop of a region is its set-piece — the castle at the end of a Mario world.
      // Three node kinds instead of 49 identical discs is most of what gives a map a shape.
      const isFinale = i === span.endIdx && span.endIdx !== span.startIdx;
      const art = isOpener ? SUBJECT_ART[z.subject] : null;
      // a cleared zone that has come round for spaced review gets a badge, so the map tells you
      // what to go back to instead of only what's next
      const node = el('div', 'journey-node ' + stateCls + (art ? ' has-art' : '')
        + (isFinale ? ' finale' : '') + (z.due ? ' due' : ''), nodesEl);
      node.style.left = pts[i].x + '%';
      node.style.top = pts[i].y + 'px';
      node.style.setProperty('--nc', color);

      const btn = el('button', 'jn-btn', node);
      btn.type = 'button';
      btn.title = z.topic;
      // A locked stop still shows its number (dimmed) so you can see how far along it sits,
      // plus a small padlock badge in the corner so "locked" reads at a glance.
      let face;
      if (art) face = `<span class="jn-art"><img src="${art}" alt="" /></span>`;
      else if (isFinale) face = `<span class="jn-cup">${iconSvg('trophy')}</span>`;
      else face = `<span class="jn-num">${stepNum}</span>`;
      // three stars = cleared. Review progress rides on the node itself (a crown once every
      // spaced review is passed, a ↻ badge when one has come due) rather than on more stars,
      // which don't fit under a node this size.
      btn.innerHTML = `${face}${starRow(z.completed ? 3 : 0)}`
        + (z.mastered ? '<span class="jn-crown" title="Mastered">★</span>' : '')
        + (z.due ? '<span class="jn-due" title="Due for review">↻</span>' : '')
        + (!z.unlocked ? `<span class="jn-lock" title="Locked">${iconSvg('lock')}</span>` : '');
      if (z.unlocked) btn.addEventListener('click', () => { onSelectZone?.(z); close(); });
      else {
        // not disabled (a disabled button swallows the tap), but never starts the stop
        btn.setAttribute('aria-disabled', 'true');
        btn.title = z.topic + ' (locked)';
        const prev = i > 0 && journey[i - 1].subject === z.subject ? journey[i - 1] : null;
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          showHint(prev ? `Clear "${prev.topic}" to unlock` : 'Locked - clear the stop before it to unlock');
        });
      }

      // Labels only where they earn their place: the region's landmark, its closing cup, and
      // wherever you are right now. 49 dark caption chips down the path was the single
      // heaviest thing on screen, and the numbered stops read fine without one — the name is
      // still one tap away, and on the title attribute for hover.
      if (isOpener || isFinale) el('div', 'journey-node-label', node, z.topic);
      node.dataset.topic = z.topic;

      // staggered pop-in, so the path builds itself as the map opens instead of appearing
      node.style.setProperty('--pop-delay', (Math.min(i, 14) * 0.035).toFixed(3) + 's');
    });

    // ---- the player's marker. Mario stands on the map; you should too — without it the map
    // is a list of places rather than somewhere you are. It sits on the next stop to play:
    // a review that's come due first, otherwise the furthest unlocked-but-uncleared stop. ----
    const dueIdx = journey.findIndex((z) => z.due);
    const nextIdx = journey.findIndex((z) => z.unlocked && !z.completed);
    const hereIdx = dueIdx >= 0 ? dueIdx : (nextIdx >= 0 ? nextIdx : journey.length - 1);
    if (pts[hereIdx]) {
      const me = el('div', 'journey-me', nodesEl);
      me.style.left = pts[hereIdx].x + '%';
      me.style.top = pts[hereIdx].y + 'px';
      me.innerHTML = `<span class="jm-kart">${iconSvg('kart')}</span><span class="jm-pin"></span>`;
      // the "you are here" stop is the one place a caption is always worth its weight
      const hereNode = nodesEl.querySelectorAll('.journey-node')[hereIdx];
      if (hereNode && !hereNode.querySelector('.journey-node-label')) {
        el('div', 'journey-node-label', hereNode, journey[hereIdx].topic);
      }
      if (hereNode) hereNode.classList.add('here');
    }

    // ---- region rail: eight crests down the edge. Doubles as the overview a long scroll
    // otherwise has no room for — where you are in the whole journey, and a way to jump. ----
    // rail is built from the FULL journey so every subject is reachable, not just the open one
    const allSpans = [];
    full.forEach((z, i) => {
      const last = allSpans[allSpans.length - 1];
      if (!last || last.subject !== z.subject) allSpans.push({ subject: z.subject, startIdx: i, endIdx: i });
      else last.endIdx = i;
    });
    allSpans.forEach((s) => {
      const done = full.slice(s.startIdx, s.endIdx + 1).filter((z) => z.completed).length;
      const total = s.endIdx - s.startIdx + 1;
      // indices here address the FULL journey, not the filtered region on screen — reading
      // them out of `journey` returned undefined for every subject after the first
      const open = full[s.startIdx].unlocked;
      const isHere = s.subject === activeSubject;
      const b = el('button', 'jr-chip' + (open ? '' : ' locked') + (isHere ? ' here' : ''), railEl);
      b.type = 'button';
      b.title = `${s.subject} — ${done}/${total}`;
      b.style.setProperty('--rc', hex(SUBJECT_COLOR.get(s.subject) ?? 0x2f8bff));
      const art = SUBJECT_ART[s.subject];
      b.innerHTML = `<span class="jr-face">${art ? `<img src="${art}" alt="" />` : iconSvg(s.subject)}</span>`
        + `<span class="jr-count">${done}/${total}</span>`;
      b.addEventListener('click', () => {
        if (!open) return;                       // locked subjects stay locked
        activeSubject = s.subject;
        render();
        scrollEl.scrollTop = 0;
      });
    });
  }

  // Parallax: clouds drift faster than the ground, scenery lags slightly behind the path.
  // Cheap depth — it's the difference between scrolling a picture and moving through a place.
  let parallaxQueued = false;
  scrollEl.addEventListener('scroll', () => {
    if (parallaxQueued) return;
    parallaxQueued = true;
    requestAnimationFrame(() => {
      parallaxQueued = false;
      updateChrome();
      const y = scrollEl.scrollTop;
      trackEl.style.setProperty('--par-far', (y * 0.06).toFixed(1) + 'px');
      trackEl.style.setProperty('--par-near', (y * -0.03).toFixed(1) + 'px');
    });
  }, { passive: true });

  function open() {
    render();
    root.classList.remove('hidden');
    root.classList.remove('entered');
    window.addEventListener('resize', updateChrome);
    requestAnimationFrame(() => root.classList.add('entered'));
    requestAnimationFrame(() => {
      const journey = getJourney();
      const idx = journey.findIndex((z) => z.unlocked && !z.completed);
      const targetY = lastYByIdx[Math.max(0, idx)] ?? 0;
      root.querySelector('.journey-scroll').scrollTop = idx <= 0 ? 0 : Math.max(0, targetY - 300);
      updateChrome();
    });
  }

  return { open, close, isOpen: () => !root.classList.contains('hidden') };
}

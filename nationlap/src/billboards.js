// Roadside subject-zone billboards — ambient signage marking which exam subject the current
// stretch is themed to (facts themselves are collected silently and shown on the post-race
// recap, see main.js's updateFactBillboards). Built entirely against track.js's public
// contract (getPointAt/getTangentAt/roadWidth), no edits to track.js itself.
import * as THREE from 'three';
import { CHARACTERS } from './config.js';
import { TOPIC_ZONES } from './learn-facts.js';
import { migaImg } from './assets-preload.js';

const SUBJECT_COLOR = new Map(CHARACTERS.map((c) => [c.subject, c.color]));
const DEFAULT_COLOR = 0x2f8bff;

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function hex(color) { return '#' + (color >>> 0).toString(16).padStart(6, '0').slice(-6); }

// A sign you pass in under a second while driving can't teach anything — not even a short
// citation like "Art. 32" means anything without its explanation, and there's no time to read
// that explanation either. So the billboard doesn't try: it's a subject-zone marker, exactly
// like a highway sign ("POLITY ZONE") — recognized instantly, nothing to actually read. The
// real facts (title + explanation) still get collected as you pass and shown fully, readably,
// on the post-race recap screen — that's where the actual teaching happens.
function makeBillboardTexture(subject) {
  const W = 640, H = 360;
  const [c, ctx] = canvas(W, H);
  const color = SUBJECT_COLOR.get(subject) ?? DEFAULT_COLOR;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, hex(color)); g.addColorStop(1, '#0a0c1e');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 10; ctx.strokeRect(5, 5, W - 10, H - 10);

  // MIGA anchored left, peeking above the panel top like a real mascot cutout sign
  const migaW = migaImg ? 190 : 0;
  if (migaImg) {
    const ar = migaImg.naturalHeight / migaImg.naturalWidth;
    const dh = migaW * ar;
    ctx.drawImage(migaImg, 8, H - dh + 16, migaW, dh);
  }

  const textX = migaW + 26;
  const maxW = W - textX - 20;
  // subject name is the whole message — big, bold, needs zero reading time to register
  let size = 74;
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  const label = subject.toUpperCase();
  do {
    ctx.font = `bold ${size}px "Lilita One", "Arial Black", Impact, sans-serif`;
    size -= 2;
  } while (ctx.measureText(label).width > maxW && size > 30);
  ctx.lineWidth = 7; ctx.strokeStyle = '#0a0c1e';
  ctx.strokeText(label, textX, 175);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(label, textX, 175);

  ctx.font = '700 22px "Nunito", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText('NATIONLAP', textX, H - 26);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// Small, frequent, right-at-the-barrier boards — pure brand, no fact, the way a real sponsor
// board sits trackside: mascot + wordmark, nothing to read, just recognized at a glance.
let _sponsorTex = null;
function makeSponsorTexture() {
  if (_sponsorTex) return _sponsorTex;
  const W = 512, H = 220;
  const [c, ctx] = canvas(W, H);
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, '#1e2a5c'); g.addColorStop(1, '#2f8bff');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8; ctx.strokeRect(4, 4, W - 8, H - 8);
  if (migaImg) {
    const ar = migaImg.naturalHeight / migaImg.naturalWidth;
    const dh = H - 16;
    const dw = dh / ar;
    ctx.drawImage(migaImg, 14, 8, dw, dh);
    ctx.font = 'bold 46px "Lilita One", "Arial Black", Impact, sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 6; ctx.strokeStyle = '#0a0c1e'; ctx.fillStyle = '#ffffff';
    ctx.strokeText('MIGA', dw + 34, H / 2 - 14);
    ctx.fillText('MIGA', dw + 34, H / 2 - 14);
    ctx.font = '700 22px "Nunito", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText('NationLap', dw + 34, H / 2 + 26);
  } else {
    ctx.font = 'bold 40px "Lilita One", "Arial Black", Impact, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#ffffff';
    ctx.fillText('NATIONLAP', W / 2, H / 2);
  }
  _sponsorTex = new THREE.CanvasTexture(c);
  _sponsorTex.colorSpace = THREE.SRGBColorSpace;
  _sponsorTex.anisotropy = 8;
  return _sponsorTex;
}

/**
 * A race covers ONE topic, not the whole syllabus.
 *
 * Putting all 49 topic zones on one lap meant ~190 boards, nearly all of them on subjects the
 * player wasn't studying — noise, not teaching. Instead the focused topic (picked on the
 * journey map) owns the entire ~9.5km lap: its prompts are spaced evenly right around it,
 * roughly 400m apart, repeating two or three times so the repetition does some work, and the
 * quiz draws from that same topic all race. With no focus set (a free race off the title
 * screen) every zone is sampled, so there's still something to learn.
 *
 * @param {object} opts
 * @param {THREE.Scene} opts.scene
 * @param {object} opts.track — Track object per ARCHITECTURE.md §1
 * @param {object} [opts.focusZone] — the topic zone this race is about, if any
 */
// A lesson's flashcards are question/answer pairs, so when they're available the focused zone's
// boards ask the question and the learn card holds the answer — the board becomes a recall
// prompt for what you just read, instead of a label restating it. Capped because a zone's
// lesson can carry 45 cards and a lap only has room for a readable handful.
const MAX_RECALL_BOARDS = 12;
// Boards placed when one topic owns the whole lap. At ~9.5km that is a board roughly every
// 400m — close enough to keep the topic in front of you, far enough apart to read one at a
// time. Below the distinct-card count it would just truncate, so it only ever repeats.
const BOARDS_PER_SOLO_LAP = 24;

function factsForZone(zone, isFocus, recallCards, soloLap) {
  const base = isFocus && recallCards?.length
    ? recallCards.slice(0, MAX_RECALL_BOARDS).map((c) => ({ title: c.front, blurb: c.back }))
    : zone.facts;
  if (!soloLap || base.length >= BOARDS_PER_SOLO_LAP) return base;
  // cycle the list so each card comes round two or three times per lap
  const out = [];
  for (let i = 0; i < BOARDS_PER_SOLO_LAP; i++) out.push(base[i % base.length]);
  return out;
}


/* The affairs board. The subject marker exists to be recognised, not read — but a headline is
   the one piece of trackside text a player genuinely wants, and it is the same line they were
   briefed on, so recognition is all it has to carry. Two short lines, big, on a newspaper
   masthead rather than a highway sign. */
function makeHeadlineTexture(card) {
  const W = 640, H = 360;
  const [c, ctx] = canvas(W, H);

  ctx.fillStyle = '#f5efdf'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#17213a'; ctx.fillRect(0, 0, W, 78);
  ctx.strokeStyle = '#17213a'; ctx.lineWidth = 9; ctx.strokeRect(4, 4, W - 8, H - 8);

  ctx.fillStyle = '#ffd23f';
  ctx.font = '800 34px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('TODAY', W / 2, 40);

  // wrap the stamp across at most two lines, shrinking to fit rather than clipping
  const words = String(card.stamp || '').toUpperCase().split(/\s+/);
  let size = 52;
  let lines = [];
  for (; size >= 26; size -= 3) {
    ctx.font = `800 ${size}px Inter, system-ui, sans-serif`;
    lines = [];
    let line = '';
    for (const w of words) {
      const next = line ? line + ' ' + w : w;
      if (ctx.measureText(next).width > W - 70 && line) { lines.push(line); line = w; }
      else line = next;
    }
    if (line) lines.push(line);
    if (lines.length <= 2) break;
  }
  ctx.fillStyle = '#17213a';
  const startY = 78 + (H - 78) / 2 - ((lines.length - 1) * size * 0.58);
  lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, W / 2, startY + i * size * 1.16));

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

export function createLearnBillboards({ scene, track, focusZone, recallCards, affairs }) {
  const group = new THREE.Group();
  group.name = 'LearnBillboards';
  if (scene) scene.add(group);

  const panelGeo = new THREE.PlaneGeometry(6.2, 3.5);
  const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.6, 8);
  const postMat = new THREE.MeshStandardMaterial({ color: 0x3a3f55, roughness: 0.6 });
  const texBySubject = new Map();
  const materials = [];
  const list = []; // { position: THREE.Vector3, fact, triggered } — for proximity-based read-out
  const zones = []; // { id, subject, topic, pool, tStart, tEnd } — for quiz topic-linking

  const roadHalf = (track?.roadWidth || 24) / 2;

  // One race = one topic. Putting all 49 zones on a single lap meant ~190 boards flying past on
  // subjects you weren't studying, which is noise, not teaching. So the focused zone (picked on
  // the journey map) owns the entire lap, and its cards repeat around it — seeing the same
  // prompt two or three times in a race is the repetition that makes it stick.
  // With no focus (a quick race straight off the title screen) the old spread stands, so every
  // subject still gets a showing.
  // An affairs race replaces the subject markers outright: two sets of trackside text would
  // be the reading-list problem this mode exists to avoid.
  if (affairs && affairs.length) {
    const n = affairs.length;
    affairs.forEach((card, k) => {
      if (!track?.getPointAt || !track?.getTangentAt) return;
      // offset from the gates so a headline and its gate are not read at the same instant
      const t = ((k + 0.2) / n) % 1;
      let p, tan;
      try { p = track.getPointAt(t); tan = track.getTangentAt(t); } catch (_) { return; }
      if (!p || !tan) return;

      const side = k % 2 === 0 ? 1 : -1;
      const rightX = -tan.z, rightZ = tan.x;
      const off = roadHalf + 8.5;
      const tex = makeHeadlineTexture(card);
      const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, emissive: 0x11132a, emissiveIntensity: 0.18 });
      materials.push(mat);

      const holder = new THREE.Group();
      holder.position.set(p.x + rightX * side * off, p.y, p.z + rightZ * side * off);
      holder.rotation.y = Math.atan2(-tan.x, -tan.z);
      const post1 = new THREE.Mesh(postGeo, postMat); post1.position.set(-2.2, 2.3, 0); post1.castShadow = true;
      const post2 = new THREE.Mesh(postGeo, postMat); post2.position.set(2.2, 2.3, 0); post2.castShadow = true;
      const panel = new THREE.Mesh(panelGeo, mat); panel.position.set(0, 5.0, 0); panel.castShadow = true;
      holder.add(post1, post2, panel);
      group.add(holder);

      list.push({
        position: holder.position.clone(),
        fact: { id: card.id, title: card.stamp, blurb: card.why || card.staticFact || '' },
        triggered: false,
      });
    });
    // Its own cleanup: the shared `dispose` below is an object method that does not exist as a
    // binding here, and the sponsor geometry it frees is declared further down — referencing
    // either from this early return would throw.
    return {
      group,
      list,
      zones,
      dispose() {
        scene?.remove(group);
        panelGeo.dispose();
        postGeo.dispose();
        postMat.dispose();
        for (const m of materials) { m.map?.dispose?.(); m.dispose(); }
      },
    };
  }

  let activeZones = TOPIC_ZONES.slice();
  if (focusZone) {
    const zone = TOPIC_ZONES.find((z) => z.id === focusZone.id);
    if (zone) activeZones = [zone];
  }

  const slice = 1 / Math.max(1, activeZones.length);
  activeZones.forEach((zone, zi) => {
    if (!track?.getPointAt || !track?.getTangentAt) return;
    const tStart = zi * slice;
    const tEnd = (zi + 1) * slice;
    zones.push({ id: zone.id, subject: zone.subject, topic: zone.topic, pool: zone.pool, tStart, tEnd });

    // spread this topic's facts evenly across its whole share of the lap
    const facts = factsForZone(zone, focusZone && zone.id === focusZone.id, recallCards, activeZones.length === 1);
    const n = facts.length;
    facts.forEach((factDef, k) => {
      const t = tStart + ((k + 0.5) / n) * slice;
      let p, tan;
      try { p = track.getPointAt(t); tan = track.getTangentAt(t); } catch (_) { return; }
      if (!p || !tan) return;

      const side = k % 2 === 0 ? 1 : -1; // alternate sides so they don't all line up on one
      const rightX = -tan.z, rightZ = tan.x; // driver's-right convention: (-cos h, 0, sin h)
      const off = roadHalf + 8.5;
      const x = p.x + rightX * side * off;
      const z = p.z + rightZ * side * off;

      let tex = texBySubject.get(zone.subject);
      if (!tex) { tex = makeBillboardTexture(zone.subject); texBySubject.set(zone.subject, tex); }
      const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, emissive: 0x11132a, emissiveIntensity: 0.18 });
      materials.push(mat);

      const holder = new THREE.Group();
      holder.position.set(x, p.y, z);
      holder.rotation.y = Math.atan2(-tan.x, -tan.z); // face oncoming traffic

      const post1 = new THREE.Mesh(postGeo, postMat); post1.position.set(-2.2, 2.3, 0); post1.castShadow = true;
      const post2 = new THREE.Mesh(postGeo, postMat); post2.position.set(2.2, 2.3, 0); post2.castShadow = true;
      const panel = new THREE.Mesh(panelGeo, mat); panel.position.set(0, 5.0, 0); panel.castShadow = true;
      holder.add(post1, post2, panel);
      group.add(holder);

      const fact = { ...factDef, subject: zone.subject, topic: zone.topic, pool: zone.pool };
      list.push({ position: holder.position.clone(), fact, triggered: false });
    });
  });

  // ---- sponsor boards: occasional trackside brand boards, no facts. Deliberately sparse —
  // at ~88 of these the roadside read as advertising spam rather than a racetrack ----
  const sponsorGeo = new THREE.PlaneGeometry(3.4, 1.5);
  const sponsorPostGeo = new THREE.CylinderGeometry(0.07, 0.07, 2.0, 6);
  const sponsorMat = new THREE.MeshStandardMaterial({ map: makeSponsorTexture(), roughness: 0.5, emissive: 0x0a1030, emissiveIntensity: 0.12 });
  const sponsorCount = 24;
  for (let i = 0; i < sponsorCount; i++) {
    if (!track?.getPointAt || !track?.getTangentAt) break;
    const t = (i + 0.5) / sponsorCount;
    let p, tan;
    try { p = track.getPointAt(t); tan = track.getTangentAt(t); } catch (_) { continue; }
    if (!p || !tan) continue;

    const side = i % 2 === 0 ? -1 : 1;
    const rightX = -tan.z, rightZ = tan.x;
    const off = roadHalf + 2.4;
    const x = p.x + rightX * side * off;
    const z = p.z + rightZ * side * off;

    const holder = new THREE.Group();
    holder.position.set(x, p.y, z);
    holder.rotation.y = Math.atan2(-tan.x, -tan.z);
    const post = new THREE.Mesh(sponsorPostGeo, postMat); post.position.set(0, 1.0, 0); post.castShadow = true;
    const panel = new THREE.Mesh(sponsorGeo, sponsorMat); panel.position.set(0, 2.05, 0); panel.castShadow = true;
    holder.add(post, panel);
    group.add(holder);
  }

  return {
    list,
    zones,
    dispose() {
      scene?.remove(group);
      panelGeo.dispose();
      postGeo.dispose();
      postMat.dispose();
      sponsorGeo.dispose();
      sponsorPostGeo.dispose();
      sponsorMat.dispose(); // the shared canvas texture itself is intentionally kept — see makeSponsorTexture
      for (const m of materials) m.dispose();
      for (const tex of texBySubject.values()) tex.dispose();
    },
  };
}

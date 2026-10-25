// Ghost racers — the competitive layer, without netcode.
//
// A ghost is a recording of someone's lap, replayed as a translucent kart you race against.
// It gives you an opponent who is genuinely faster than you, visibly, in your lane — which is
// the thing that makes you want to go again — with no server tick, no matchmaking, no lag
// compensation and nobody who can grief you.
//
// Recording format: the kart is always on the track, so a lap is stored as (t, lateral) pairs
// at a fixed interval rather than full world coordinates. t is the position around the lap
// (0..1) and lateral is the offset from the centreline in metres, both straight out of
// track.getSurfaceInfo(). Two floats every 200ms is ~4KB for a four-minute lap, against ~50KB
// for raw transforms, and it reconstructs the exact racing line because the track supplies the
// curve. Heading comes from the tangent, so it never has to be stored.

import * as THREE from 'three';

/** Milliseconds between samples. 200ms is under a kart length at full speed. */
export const SAMPLE_MS = 200;
const MAX_SAMPLES = 3000;   // 10 minutes; a lap that long is a stuck player, not a record

export function createRecorder(track) {
  const t = [];
  const lat = [];
  let acc = 0;

  return {
    /** Call every frame while racing. dt in seconds. */
    sample(kart, dt) {
      if (!kart || !track?.getSurfaceInfo) return;
      acc += dt * 1000;
      if (acc < SAMPLE_MS || t.length >= MAX_SAMPLES) return;
      acc = 0;
      let info;
      try { info = track.getSurfaceInfo(kart.position); } catch (e) { return; }
      if (!info) return;
      t.push(+(info.t ?? 0).toFixed(5));
      lat.push(+(info.lateral ?? 0).toFixed(2));
    },
    get length() { return t.length; },
    /** null when the lap is too short to be worth replaying. */
    finish(timeMs) {
      if (t.length < 10) return null;
      return { v: 1, ms: Math.round(timeMs || 0), step: SAMPLE_MS, t, lat };
    },
  };
}

/**
 * A translucent kart replaying a recording.
 * `makeModel` is main.js's makeKartModel, so a ghost is built by the same code as a real kart
 * rather than a separate stand-in that would drift out of sync with the art.
 */
export function createGhost({ scene, track, recording, makeModel, character, label }) {
  if (!recording || !Array.isArray(recording.t) || recording.t.length < 2) return null;

  const model = makeModel(character);
  const root = model.root;
  root.name = 'ghost';

  // Translucent and shadowless so it reads as "not really there" and never occludes your line.
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = false;
    o.receiveShadow = false;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    o.material = mats.map((m) => {
      if (!m) return m;
      const c = m.clone();
      c.transparent = true;
      c.opacity = 0.42;
      c.depthWrite = false;      // stops the ghost carving holes in what's behind it
      if (c.emissive) c.emissive.setHex(0x2a4a8a);
      return c;
    });
    if (o.material.length === 1) o.material = o.material[0];
    o.renderOrder = 2;
  });
  scene.add(root);

  const { t: ts, lat: lats, step } = recording;
  const _p = new THREE.Vector3(), _tan = new THREE.Vector3();
  let visible = true;

  function at(ms) {
    const f = ms / (step || SAMPLE_MS);
    const i = Math.floor(f);
    if (i < 0) return { t: ts[0], lat: lats[0], done: false };
    if (i >= ts.length - 1) return { t: ts[ts.length - 1], lat: lats[lats.length - 1], done: true };
    const a = f - i;
    // t wraps at the finish line, so interpolate the short way round or the ghost snaps
    // backwards across the whole lap on the frame it crosses
    let t0 = ts[i], t1 = ts[i + 1];
    if (t1 - t0 > 0.5) t1 -= 1; else if (t0 - t1 > 0.5) t1 += 1;
    return { t: t0 + (t1 - t0) * a, lat: lats[i] + (lats[i + 1] - lats[i]) * a, done: false };
  }

  return {
    root,
    /** Position the ghost for `elapsedMs` since the lights went out. */
    update(elapsedMs) {
      const s = at(elapsedMs);
      if (s.done !== visible) { /* keep showing the finished pose rather than popping out */ }
      let p, tan;
      try { p = track.getPointAt(s.t); tan = track.getTangentAt(s.t); } catch (e) { return; }
      if (!p || !tan) return;
      // driver's right, matching the kart convention: (-cos h, 0, sin h)
      const rx = -tan.z, rz = tan.x;
      _p.set(p.x + rx * s.lat, p.y, p.z + rz * s.lat);
      root.position.copy(_p);
      _tan.copy(tan);
      root.rotation.y = Math.atan2(_tan.x, _tan.z);
      model.animate?.(1 / 60, { speed: 30 });
    },
    setVisible(v) { visible = v; root.visible = v; },
    dispose() {
      scene.remove(root);
      root.traverse((o) => {
        if (!o.isMesh) return;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) m && m.dispose && m.dispose();
      });
      model.dispose?.();
    },
    label: label || 'Ghost',
    timeMs: recording.ms || 0,
  };
}

// ---------------------------------------------------------------------------------------------
// Local personal bests. Kept per zone, so "beat your own lap on Fundamental Rights" works
// offline and signed out — the server ghosts in account.js are the same shape.
// ---------------------------------------------------------------------------------------------
const PB_KEY = 'tkr_ghost_pb';

function loadAll() {
  try { return JSON.parse(localStorage.getItem(PB_KEY) || '{}') || {}; } catch (e) { return {}; }
}

export function loadPersonalBest(zoneId) {
  const all = loadAll();
  return all[zoneId || '_quick'] || null;
}

/** Saves only if it beats the stored lap. Returns true when a new best was written. */
export function savePersonalBest(zoneId, recording) {
  if (!recording) return false;
  const key = zoneId || '_quick';
  const all = loadAll();
  const prev = all[key];
  if (prev && prev.ms && recording.ms >= prev.ms) return false;
  all[key] = recording;
  try { localStorage.setItem(PB_KEY, JSON.stringify(all)); } catch (e) { return false; }
  return true;
}

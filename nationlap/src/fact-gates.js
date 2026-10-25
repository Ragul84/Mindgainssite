// Lane gates: the day's facts, chosen at speed.
//
// A quiz that stops the race is a quiz with a pause button. These are two labelled arches
// straddling the racing line — drive through the right one and you get the mini-turbo, through
// the wrong one and you bog down. You are not reading at 130km/h, you are recognising, which is
// what a prelims MCQ actually tests.
//
// Built entirely against track.js's public contract (getPointAt/getTangentAt/getSurfaceInfo),
// so no edits to the track itself.

import * as THREE from 'three';

const LANE_A = 0x2f8bff;   // left, blue
const LANE_B = 0xff8a1f;   // right, orange

/** How close to the arch counts as driving through it. */
const TRIGGER_R = 13;
/** Far enough past that the next lap re-arms it, never the same pass. */
const RESET_R = 46;

function labelTexture(text, color) {
  const W = 512, H = 128;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  const hex = '#' + (color >>> 0).toString(16).padStart(6, '0').slice(-6);
  ctx.fillStyle = '#0a0f1c';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = hex; ctx.lineWidth = 8; ctx.strokeRect(4, 4, W - 8, H - 8);

  // Shrink to fit rather than clip: a label that runs off the sign is worse than a small one,
  // and the pairs vary from "Assam" to "Kasturirangan Committee".
  let size = 58;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  do {
    ctx.font = `800 ${size}px Inter, system-ui, sans-serif`;
    if (ctx.measureText(text).width <= W - 56) break;
    size -= 3;
  } while (size > 22);

  ctx.shadowColor = hex; ctx.shadowBlur = 18;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text.toUpperCase(), W / 2, H / 2 + 2);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

/**
 * @param scene      THREE scene
 * @param track      the track (getPointAt/getTangentAt/getSurfaceInfo/roadWidth)
 * @param cards      cards carrying a `.gate` pair, in the order they should appear
 */
export function createFactGates(scene, track, cards) {
  const group = new THREE.Group();
  const gates = [];
  const disposables = [];

  const half = (track?.roadWidth ?? 20) / 2;
  const laneW = Math.max(4.5, half * 0.78);
  const postGeo = new THREE.BoxGeometry(0.55, 6.2, 0.55);
  const beamGeo = new THREE.BoxGeometry(laneW, 0.7, 0.7);
  const postMat = new THREE.MeshStandardMaterial({ color: 0x1b2334, roughness: 0.6 });
  disposables.push(postGeo, beamGeo, postMat);

  const usable = (cards || []).filter((c) => c && c.gate);
  usable.forEach((card, i) => {
    // Spread them round the lap, but never right on the start line where the grid still is.
    const t = (i + 0.7) / usable.length;
    let p, tan;
    try { p = track.getPointAt(t); tan = track.getTangentAt(t); } catch { return; }
    if (!p || !tan) return;

    const rightX = -tan.z, rightZ = tan.x;
    const holder = new THREE.Group();
    holder.position.set(p.x, p.y, p.z);
    holder.rotation.y = Math.atan2(-tan.x, -tan.z);

    // lane A sits left of the centreline, lane B right — matching gate.a / gate.b exactly, so
    // the label a player drives under is the label the recap grades.
    for (const [side, text, color] of [[-1, card.gate.a, LANE_A], [1, card.gate.b, LANE_B]]) {
      const cx = side * laneW / 2;
      const lane = new THREE.Group();
      lane.position.x = cx;

      const l = new THREE.Mesh(postGeo, postMat); l.position.set(-laneW / 2, 3.1, 0);
      const r = new THREE.Mesh(postGeo, postMat); r.position.set(laneW / 2, 3.1, 0);
      const beam = new THREE.Mesh(beamGeo, postMat); beam.position.set(0, 6.2, 0);

      const tex = labelTexture(text, color);
      const signMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
      disposables.push(tex, signMat);
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(laneW * 0.92, laneW * 0.92 / 4), signMat);
      sign.position.set(0, 6.9, 0);

      // a soft curtain so the opening reads as a thing you pass THROUGH, not past
      const curtainMat = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.17, side: THREE.DoubleSide, depthWrite: false,
      });
      disposables.push(curtainMat);
      const curtain = new THREE.Mesh(new THREE.PlaneGeometry(laneW * 0.95, 5.8), curtainMat);
      curtain.position.set(0, 2.9, 0);

      lane.add(l, r, beam, sign, curtain);
      holder.add(lane);
    }

    group.add(holder);
    gates.push({
      card,
      t,
      position: holder.position.clone(),
      triggered: false,
      // lane A is left of centre, so a negative lateral means the player chose A
      answerIsA: card.gate.answer === 'a',
    });
  });

  scene.add(group);

  /**
   * Call each frame with the player. Fires `onPick` once per pass with
   * { card, pickedA, correct }.
   */
  function update(player, onPick) {
    if (!player?.position) return;
    for (const g of gates) {
      const dx = player.position.x - g.position.x;
      const dz = player.position.z - g.position.z;
      const d2 = dx * dx + dz * dz;

      if (!g.triggered && d2 < TRIGGER_R * TRIGGER_R) {
        g.triggered = true;
        let lateral = 0;
        try { lateral = track.getSurfaceInfo(player.position.x, player.position.z)?.lateral ?? 0; } catch { /* keep 0 */ }
        const pickedA = lateral < 0;
        onPick?.({ card: g.card, pickedA, correct: pickedA === g.answerIsA });
      } else if (g.triggered && d2 > RESET_R * RESET_R) {
        g.triggered = false;
      }
    }
  }

  function dispose() {
    scene.remove(group);
    group.traverse((o) => { if (o.geometry && o.geometry !== postGeo && o.geometry !== beamGeo) o.geometry.dispose?.(); });
    for (const d of disposables) d.dispose?.();
  }

  return { group, gates, update, dispose, count: gates.length };
}

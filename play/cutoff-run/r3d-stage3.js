// Cut-Off Run 3D, stage 3: the cut-off rival batch, ambush batches, the climb steps, LBSNAA at the end,
// students cheering on the steps, and anyone knocked flying. Bosses and Doubt Attack monsters stay as the
// game's own 2D characters for now; they are drawn on top of this world.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function stage3({ scene, mat, student, K }) {
  const shirtMat = new Map();
  const colour = (hex) => { if (!shirtMat.has(hex)) shirtMat.set(hex, mat(new THREE.Color(hex), .65)); return shirtMat.get(hex); };
  // a pool of figures per role; each frame we hand out the first n and hide the rest
  function pool(face) {
    const list = [];
    return {
      get(i, look) {
        while (list.length <= i) { const s = student(300 + list.length + (face ? 50 : 0)); s.rotation.y = face ? Math.PI : 0; scene.add(s); list.push(s); }
        const s = list[i]; s.visible = true;
        if (look && s.userData.look !== look.shirt) { const m = colour(look.shirt); s.userData.shirtParts.forEach((p) => (p.material = m)); s.userData.look = look.shirt; }
        return s;
      },
      hideFrom(n) { for (let i = n; i < list.length; i++) list[i].visible = false; },
    };
  }
  // Doubt monsters: the ambush batches. Hunched blobs with one glowing eye, horns, claws and a toothy grin.
  const MON = [[0x5b2a86, 0x3a1857], [0x2d5f6b, 0x173a42], [0x8a2a3c, 0x55172a], [0x4a3a8f, 0x2b2160]].map(([a, b]) => [mat(a, .55), mat(b, .6)]);
  const eyeM = new THREE.MeshStandardMaterial({ color: 0xfff27a, emissive: 0xffe14a, emissiveIntensity: 2.2, roughness: .3 });
  const pupilM = mat(0x111111, .2), toothM = mat(0xfaf5e6, .4), hornM = mat(0xe8dcc0, .5), mouthM = mat(0x1a0610, .8);
  const mg = { body: new THREE.SphereGeometry(.55, 22, 16), belly: new THREE.SphereGeometry(.36, 16, 12), eye: new THREE.SphereGeometry(.26, 16, 12), pupil: new THREE.SphereGeometry(.09, 10, 8),
    horn: new THREE.ConeGeometry(.09, .36, 8), leg: new THREE.CapsuleGeometry(.12, .18, 3, 8), arm: new THREE.CapsuleGeometry(.09, .34, 3, 8), claw: new THREE.ConeGeometry(.05, .14, 6),
    mouth: new RoundedBoxGeometry(.42, .12, .1, 2, .04), tooth: new THREE.ConeGeometry(.035, .08, 5) };
  function monster(i) {
    const g = new THREE.Group(), [skin, dark] = MON[i % MON.length], limbs = [];
    const sh = (m) => { m.castShadow = true; return m; };
    for (const sx of [-1, 1]) { const leg = new THREE.Group(); leg.position.set(sx * .24, .32, 0); const l = sh(new THREE.Mesh(mg.leg, dark)); l.position.y = -.14; leg.add(l); g.add(leg); limbs.push(leg); }
    const body = sh(new THREE.Mesh(mg.body, skin)); body.scale.set(1, 1.05, .9); body.position.y = .82; body.rotation.x = .25; g.add(body);
    const belly = new THREE.Mesh(mg.belly, dark); belly.position.set(0, .74, .32); belly.scale.set(1, 1, .5); g.add(belly);
    const eye = new THREE.Mesh(mg.eye, eyeM); eye.position.set(0, 1.0, .44); g.add(eye);
    const pu = new THREE.Mesh(mg.pupil, pupilM); pu.position.set(0, 1.0, .68); g.add(pu);
    const mouth = new THREE.Mesh(mg.mouth, mouthM); mouth.position.set(0, .7, .5); g.add(mouth);
    for (let t = 0; t < 4; t++) { const tt = new THREE.Mesh(mg.tooth, toothM); tt.position.set(-.13 + t * .087, .73, .55); tt.rotation.x = Math.PI; g.add(tt); }
    for (const sx of [-1, 1]) { const h = new THREE.Mesh(mg.horn, hornM); h.position.set(sx * .3, 1.36, 0); h.rotation.z = -sx * .45; g.add(h); }
    for (const sx of [-1, 1]) {
      const arm = new THREE.Group(); arm.position.set(sx * .5, 1.0, .1);
      const a = sh(new THREE.Mesh(mg.arm, skin)); a.position.y = -.2; arm.add(a);
      for (let c = -1; c <= 1; c++) { const cl = new THREE.Mesh(mg.claw, hornM); cl.position.set(c * .05, -.45, .03); cl.rotation.x = Math.PI; arm.add(cl); }
      arm.rotation.set(-1.1, 0, sx * .35); g.add(arm); limbs.push(arm);
    }
    g.scale.setScalar(K * 1.75); g.userData = { limbs, shirtParts: [], bag: null, monster: true };
    return g;
  }
  function monPool() {
    const list = [];
    return {
      get(i) { while (list.length <= i) { const m = monster(list.length); m.rotation.y = 0; scene.add(m); list.push(m); } const m = list[i]; m.visible = true; return m; },
      hideFrom(n) { for (let i = n; i < list.length; i++) list[i].visible = false; },
    };
  }
  const rivals = pool(true), ambush = monPool(), standers = pool(true), flyers = pool(true);
  const swing = (s, ph, a) => { const L = s.userData.limbs; L[0].rotation.x = Math.sin(ph) * .75 * a; L[1].rotation.x = -Math.sin(ph) * .75 * a; L[2].rotation.x = -Math.sin(ph) * .7 * a; L[3].rotation.x = Math.sin(ph) * .7 * a; };
  const cheer = (s, ph) => { const L = s.userData.limbs; L[0].rotation.x = L[1].rotation.x = 0; L[2].rotation.z = 2.6 + Math.sin(ph) * .3; L[3].rotation.z = -2.6 - Math.sin(ph) * .3; };
  const relax = (s) => { const L = s.userData.limbs; L[2].rotation.z = .12; L[3].rotation.z = -.12; };

  // climb steps: rebuilt when a run's ladder moves
  const STEP_COL = [0xff4d5e, 0xff8a1f, 0xffd23f, 0x9be15d, 0x3ddc84, 0x2ec4ff, 0x2f6bff, 0x8a5cff, 0xd14dff, 0xff4da6];
  let ladder = null, ladderZ = null;
  function buildLadder(S) {
    if (ladder) scene.remove(ladder);
    ladder = new THREE.Group(); ladderZ = S.ladderZ;
    const steps = window.STEPS, D = window.STEP_D;
    steps.forEach((_, i) => {
      const y = (i + 1) * .3, z0 = S.ladderZ + i * D;
      const st = new THREE.Mesh(new RoundedBoxGeometry(4, y, D, 2, .05), mat(STEP_COL[i], .45)); st.position.set(0, y / 2, -(z0 + D / 2)); st.castShadow = st.receiveShadow = true; ladder.add(st);
    });
    // LBSNAA: the academy the run climbs toward
    const end = S.ladderEnd + 2, top = steps.length * .3;
    const lb = new THREE.Group(); lb.position.set(0, top, -end);
    const body = new THREE.Mesh(new RoundedBoxGeometry(6, 2.2, 1.6, 2, .08), mat(0xf3f6fb, .6)); body.position.y = 1.1; body.castShadow = true; lb.add(body);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(4.2, 1.4, 4), mat(0xc84b31, .6)); roof.position.y = 2.9; roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, .45); lb.add(roof);
    for (let k = -2; k <= 2; k++) { const w = new THREE.Mesh(new THREE.BoxGeometry(.5, .7, .05), mat(0x8aa0c8, .3)); w.position.set(k * 1.1, 1.2, .82); lb.add(w); }
    const c = document.createElement('canvas'); c.width = 512; c.height = 96; const g = c.getContext('2d'); g.fillStyle = '#14213d'; g.beginPath(); g.roundRect(0, 0, 512, 96, 18); g.fill(); g.fillStyle = '#ffd23f'; g.font = '64px "Lilita One", Arial Black'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('LBSNAA', 256, 52);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.2, .6), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); sign.position.set(0, 2.45, .83); lb.add(sign);
    ladder.add(lb);
    scene.add(ladder);
  }

  return function update(S) {
    if (!S) { rivals.hideFrom(0); ambush.hideFrom(0); standers.hideFrom(0); flyers.hideFrom(0); if (ladder) ladder.visible = false; return; }
    const t = S.t;
    // the cut-off batch, facing us, angry
    let n = 0;
    if (S.rivalZ - (S.dist - 6) < 50) for (const r of S.rivals) { const s = rivals.get(n++, r.look); s.position.set(r.x, 0, -(S.rivalZ + r.z)); swing(s, t * 9 + r.ph, S.phase === 'battle' ? 1 : .1); relax(s); }
    rivals.hideFrom(n);
    // ambush batches on the road
    n = 0;
    for (const it of S.items) if (it.type === 'ambush' && it.init && it.n > 0 && it.z - S.dist < 46 && it.z > S.dist - 6) for (const e of it.crowd) { const s = ambush.get(n++), ph = t * 9 + e.ph, L = s.userData.limbs; s.position.set(it.x + e.ox, Math.abs(Math.sin(ph)) * .06, -(it.z + e.oz)); L[0].rotation.x = Math.sin(ph) * .6; L[1].rotation.x = -Math.sin(ph) * .6; L[2].rotation.x = -1.2 + Math.sin(ph * (it.fighting ? 1.6 : .4)) * .5; L[3].rotation.x = -1.2 - Math.sin(ph * (it.fighting ? 1.6 : .4)) * .5; }
    ambush.hideFrom(n);
    // students left cheering on the steps
    n = 0;
    for (const st of S.standers) { const s = standers.get(n++, st.look); s.position.set(st.x, st.y + Math.abs(Math.sin(t * 6 + st.ph)) * .08, -st.z); cheer(s, t * 8 + st.ph); }
    standers.hideFrom(n);
    // knocked flying
    n = 0;
    for (const f of S.flyers) { const s = flyers.get(n++, f.look); s.position.set(f.x, f.y, -f.z); s.rotation.set(0, Math.PI, f.rot); }
    flyers.hideFrom(n);
    // ladder + LBSNAA
    if (S.ladderZ != null && S.ladderZ !== ladderZ) buildLadder(S);
    if (ladder) ladder.visible = S.ladderZ - S.dist < 120;
  };
}

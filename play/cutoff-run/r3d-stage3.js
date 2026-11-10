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
  // Doubt ghouls: the ambush batches. Tall, hunched, grey-violet skin, ragged hood, two glowing eyes,
  // long arms reaching for the batch. Our own design for the game.
  const SKINS = [0x9a8fb3, 0x8fa39a, 0xa8949c, 0x8d93ad].map((c) => mat(c, .7));
  const HOODS = [0x3b2f5c, 0x2f4a45, 0x5a2a3a, 0x2c3256].map((c) => mat(c, .85));
  const pantM = mat(0x2a2633, .9);
  const eyeM = new THREE.MeshStandardMaterial({ color: 0xfff27a, emissive: 0xffd23f, emissiveIntensity: 3, roughness: .3 });
  const mg = {
    leg: new THREE.CapsuleGeometry(.1, .5, 3, 8), foot: new RoundedBoxGeometry(.18, .1, .3, 2, .04),
    torso: new RoundedBoxGeometry(.56, .66, .36, 3, .12), rag: new THREE.ConeGeometry(.36, .3, 6, 1, true),
    upper: new THREE.CapsuleGeometry(.075, .42, 3, 8), fore: new THREE.CapsuleGeometry(.065, .42, 3, 8), hand: new THREE.SphereGeometry(.09, 10, 8),
    head: new THREE.SphereGeometry(.24, 18, 14), hood: new THREE.SphereGeometry(.3, 18, 12, 0, Math.PI * 2, 0, Math.PI * .62),
    eye: new THREE.SphereGeometry(.055, 10, 8), jaw: new RoundedBoxGeometry(.2, .08, .1, 2, .03),
  };
  const jawM = mat(0x1a0d14, .8);
  function monster(i) {
    const g = new THREE.Group(), skin = SKINS[i % 4], hood = HOODS[(i >> 1) % 4], limbs = [];
    const sh = (m) => { m.castShadow = true; return m; };
    for (const sx of [-1, 1]) {
      const leg = new THREE.Group(); leg.position.set(sx * .15, .82, 0);
      const l = sh(new THREE.Mesh(mg.leg, pantM)); l.position.y = -.36; leg.add(l);
      const f = new THREE.Mesh(mg.foot, skin); f.position.set(0, -.74, -.06); leg.add(f);
      g.add(leg); limbs.push(leg);
    }
    const body = new THREE.Group(); body.position.y = .86; body.rotation.x = -.45; g.add(body);   // hunched forward
    const torso = sh(new THREE.Mesh(mg.torso, hood)); torso.position.y = .32; body.add(torso);
    const rag = new THREE.Mesh(mg.rag, hood); rag.position.y = -.04; rag.rotation.y = .3; body.add(rag);
    const head = sh(new THREE.Mesh(mg.head, skin)); head.position.set(0, .82, -.08); body.add(head);
    const hd = new THREE.Mesh(mg.hood, hood); hd.position.set(0, .86, -.02); hd.rotation.x = -.5; body.add(hd);
    for (const sx of [-1, 1]) { const e = new THREE.Mesh(mg.eye, eyeM); e.position.set(sx * .09, .84, -.3); body.add(e); }
    const jaw = new THREE.Mesh(mg.jaw, jawM); jaw.position.set(0, .68, -.27); body.add(jaw);
    for (const sx of [-1, 1]) {
      const arm = new THREE.Group(); arm.position.set(sx * .34, .58, 0);
      const u = sh(new THREE.Mesh(mg.upper, hood)); u.position.y = -.24; arm.add(u);
      const fo = sh(new THREE.Mesh(mg.fore, skin)); fo.position.y = -.66; arm.add(fo);
      const h = new THREE.Mesh(mg.hand, skin); h.position.y = -.92; arm.add(h);
      body.add(arm); limbs.push(arm);
    }
    g.scale.setScalar(K * 1.45); g.userData = { limbs, shirtParts: [], bag: null, monster: true };
    return g;
  }
  function monPool() {
    const list = [];
    return {
      get(i) { while (list.length <= i) { const m = monster(list.length); m.rotation.y = Math.PI; scene.add(m); list.push(m); } const m = list[i]; m.visible = true; return m; },
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
    for (const it of S.items) if (it.type === 'ambush' && it.init && it.n > 0 && it.z - S.dist < 46 && it.z > S.dist - 6) for (const e of it.crowd) { const s = ambush.get(n++), ph = t * 9 + e.ph, L = s.userData.limbs; s.position.set(it.x + e.ox, Math.abs(Math.sin(ph)) * .06, -(it.z + e.oz)); L[0].rotation.x = Math.sin(ph) * .6; L[1].rotation.x = -Math.sin(ph) * .6; L[2].rotation.x = 1.5 + Math.sin(ph * (it.fighting ? 1.6 : .5)) * .35; L[3].rotation.x = 1.5 - Math.sin(ph * (it.fighting ? 1.6 : .5)) * .35; }
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

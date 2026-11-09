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
  const rivals = pool(true), ambush = pool(true), standers = pool(true), flyers = pool(true);
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
    for (const it of S.items) if (it.type === 'ambush' && it.init && it.n > 0 && it.z - S.dist < 46 && it.z > S.dist - 6) for (const e of it.crowd) { const s = ambush.get(n++, e.look); s.position.set(it.x + e.ox, 0, -(it.z + e.oz)); swing(s, t * 9 + e.ph, it.fighting ? 1 : .1); relax(s); }
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

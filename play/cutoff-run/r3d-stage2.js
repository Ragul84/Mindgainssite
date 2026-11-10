// Cut-Off Run 3D, stage 2: the lead student, waiting recruits, ramps, water gaps and every obstacle.
// Each obstacle reuses the 2D game's own motion function (hammerHead, sliderX, pressH, fanA, cowX,
// autoX, msawX), so the 3D model is exactly where the collision check thinks it is.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function stage2({ scene, mat, student, K }) {
  const objs = new Map();               // item -> { g, update }
  const textTex = new Map();
  function label(text, bg, fg = '#fff', w = 256, h = 128) {
    const key = text + bg + w; if (textTex.has(key)) return textTex.get(key);
    const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
    g.fillStyle = bg; g.beginPath(); g.roundRect(0, 0, w, h, h * .2); g.fill();
    g.fillStyle = fg; let fs = h * .42; g.font = `${fs}px "Lilita One", Arial Black`; while (g.measureText(text).width > w * .88 && fs > 10) { fs -= 2; g.font = `${fs}px "Lilita One", Arial Black`; }
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w / 2, h / 2 + 2);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; textTex.set(key, t); return t;
  }
  const sh = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };
  const metal = mat(0x5b6478, .35, { metalness: .5 });

  // ---- builders: each returns { g, update(it, S) } in game units
  const B = {
    recruit(it) {
      const g = new THREE.Group(), n = Math.min(it.n, 8), people = [];
      for (let k = 0; k < n; k++) { const s = student(100 + k, true); s.rotation.y = Math.PI; g.add(s); people.push(s); }
      return { g, update(it, S) { g.visible = !it.done; const t = S.t; people.forEach((p, k) => { const o = window.phylN(k, n); p.position.set(it.x + o[0], Math.abs(Math.sin(t * 5 + k)) * .05, -(it.z + o[1])); }); } };
    },
    ramp(it) {
      const g = new THREE.Group(), z0 = it.z, z1 = it.z + 3, g1 = z1 + it.air;
      const shape = new THREE.Shape(); shape.moveTo(0, 0); shape.lineTo(3, 1); shape.lineTo(3, 0); shape.closePath();
      const wedge = sh(new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 4.1, bevelEnabled: false }), mat(0xff8a1f, .5)));
      wedge.rotation.y = Math.PI / 2; wedge.position.set(-2.05, 0, -z0); g.add(wedge);   // slope rises with z
      for (let k = 0; k < 3; k++) { const st = new THREE.Mesh(new THREE.BoxGeometry(4.12, .02, .35), mat(0xffd23f, .5)); const zz = z0 + k + .45; st.position.set(0, (zz - z0) / 3 + .02, -zz); st.rotation.x = Math.atan(1 / 3); g.add(st); }
      const water = new THREE.Mesh(new THREE.PlaneGeometry(4.8, Math.max(.1, g1 - z1)), new THREE.MeshStandardMaterial({ color: 0x2fbaf7, roughness: .15, metalness: .1, emissive: 0x0b6fbf, emissiveIntensity: .25 }));
      water.rotation.x = -Math.PI / 2; water.position.set(0, -.02, -(z1 + g1) / 2); g.add(water);
      return { g, update() {} };
    },
    hole(it) {
      const x0 = it.side < 0 ? -2 : .7, x1 = it.side < 0 ? -.7 : 2;
      const w = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, it.z1 - it.z), new THREE.MeshStandardMaterial({ color: 0x1aa3ee, roughness: .15, emissive: 0x0b6fbf, emissiveIntensity: .3 }));
      w.rotation.x = -Math.PI / 2; w.position.set((x0 + x1) / 2, .01, -(it.z + it.z1) / 2);
      return { g: w, update() {} };
    },
    saw(it) {
      const g = new THREE.Group(), blades = [];
      for (const cx of [it.side * .55, it.side * 1.45]) { const b = sawBlade(.45); b.position.set(cx, .45, -it.z); g.add(b); blades.push(b); }
      return { g, update(it, S) { blades.forEach((b, i) => (b.rotation.z = -S.t * 9 - i)); } };
    },
    msaw(it) {
      const g = new THREE.Group(), slot = new THREE.Mesh(new THREE.BoxGeometry(3.8, .03, .12), mat(0x5a0c18)); slot.position.set(0, .02, -it.z); g.add(slot);
      const b = sawBlade(.55); g.add(b);
      return { g, update(it, S) { b.position.set(window.msawX(it), .55, -it.z); b.rotation.z = -S.t * 10; } };
    },
    hammer(it) {
      const g = new THREE.Group();
      for (const x of [-2.2, 2.2]) { const p = sh(new THREE.Mesh(new THREE.CylinderGeometry(.08, .1, 3.4, 10), metal)); p.position.set(x, 1.7, -it.z); g.add(p); }
      const bar = sh(new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 4.4, 10), metal)); bar.rotation.z = Math.PI / 2; bar.position.set(0, 3.4, -it.z); g.add(bar);
      const arm = new THREE.Group(); arm.position.set(0, 3.3, -it.z); g.add(arm);
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 2.6, 8), metal); rod.position.y = -1.3; arm.add(rod);
      const phone = sh(new THREE.Mesh(new RoundedBoxGeometry(.76, 1.2, .18, 3, .1), mat(0x14213d, .3))); phone.position.y = -2.6; arm.add(phone);
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(.64, 1.04), new THREE.MeshBasicMaterial({ color: 0xc04bff, toneMapped: false })); scr.position.set(0, -2.6, .1); arm.add(scr);
      return { g, update(it) { arm.rotation.z = Math.atan2(window.hammerHead(it).x, 2.6); } };
    },
    slider(it) {
      const g = new THREE.Group(), blk = sh(new THREE.Mesh(new RoundedBoxGeometry(1.4, 1.1, .5, 3, .1), mat(0xe50914, .45))); g.add(blk);
      const t = new THREE.Mesh(new THREE.PlaneGeometry(1.25, .62), new THREE.MeshBasicMaterial({ map: label(it.label || 'BINGE', '#e50914'), toneMapped: false, transparent: true })); t.visible = false; blk.add(t);
      const rail = new THREE.Mesh(new THREE.BoxGeometry(4, .04, .1), mat(0x14213d, .5)); rail.position.set(0, .03, -it.z); g.add(rail);
      return { g, update(it) { blk.position.set(window.sliderX(it), .55, -it.z); } };
    },
    press(it) {
      const g = new THREE.Group(), x0 = it.side < 0 ? -2 : 0, x1 = it.side < 0 ? 0 : 2, cx = (x0 + x1) / 2;
      for (const x of [x0, x1]) { const p = sh(new THREE.Mesh(new THREE.CylinderGeometry(.08, .1, 3.1, 10), metal)); p.position.set(x, 1.55, -it.z); g.add(p); }
      const top = sh(new THREE.Mesh(new RoundedBoxGeometry(x1 - x0 + .2, .2, .5, 2, .05), metal)); top.position.set(cx, 3.1, -it.z); g.add(top);
      const blk = sh(new THREE.Mesh(new RoundedBoxGeometry(x1 - x0 - .2, .8, .9, 3, .1), mat(0xc0283a, .45))); g.add(blk);
      const t = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0 - .4, .5), new THREE.MeshBasicMaterial({ map: label('EXAM PRESSURE', '#c0283a'), toneMapped: false })); t.visible = false; blk.add(t);
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0 - .2, 1), new THREE.MeshBasicMaterial({ color: 0x14213d, transparent: true, opacity: .2, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.set(cx, .02, -it.z); g.add(shadow);
      return { g, update(it) { const h = window.pressH(it); blk.position.set(cx, h + .4, -it.z); shadow.material.opacity = .12 + .35 * (1 - h / 2.2); } };
    },
    fan(it) {
      const g = new THREE.Group(), pole = sh(new THREE.Mesh(new THREE.CylinderGeometry(.06, .08, .55, 8), metal)); pole.position.set(it.px, .27, -it.z); g.add(pole);
      const rot = new THREE.Group(); rot.position.set(it.px, .55, -it.z); g.add(rot);
      const blade = sh(new THREE.Mesh(new RoundedBoxGeometry(1.9, .08, .22, 2, .04), mat(0x8b5a2b, .5))); rot.add(blade);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, .14, 14), mat(0xc9ccd4, .3, { metalness: .4 })); rot.add(hub);
      return { g, update(it) { rot.rotation.y = -window.fanA(it); } };
    },
    cow(it) {
      const g = new THREE.Group(), white = mat(0xffffff, .7), dark = mat(0x2a2220, .7);
      const body = sh(new THREE.Mesh(new THREE.CapsuleGeometry(.24, .5, 4, 12), white)); body.rotation.z = Math.PI / 2; body.position.y = .5; g.add(body);
      for (const [x, y, z] of [[-.1, .62, .2], [.18, .55, -.22], [-.25, .45, -.18]]) { const s = new THREE.Mesh(new THREE.SphereGeometry(.1, 10, 8), dark); s.position.set(x, y, z); s.scale.set(1, .7, .4); g.add(s); }
      const head = sh(new THREE.Mesh(new RoundedBoxGeometry(.28, .26, .3, 3, .08), white)); head.position.set(.5, .7, 0); g.add(head);
      const nose = new THREE.Mesh(new RoundedBoxGeometry(.14, .14, .26, 2, .05), mat(0xffb3c1, .6)); nose.position.set(.64, .64, 0); g.add(nose);
      for (const z of [-.1, .1]) { const h = new THREE.Mesh(new THREE.ConeGeometry(.035, .14, 6), mat(0xe0b060, .5)); h.position.set(.48, .88, z); g.add(h); }
      const legs = [];
      for (const [x, z] of [[-.3, .12], [-.3, -.12], [.28, .12], [.28, -.12]]) { const l = sh(new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .32, 8), dark)); l.position.set(x, .16, z); g.add(l); legs.push(l); }
      return { g, update(it, S) { const x = window.cowX(it), dir = Math.cos(S.t * .8 + it.ph) >= 0 ? 1 : -1; g.position.set(x, 0, -it.z); g.rotation.y = dir > 0 ? 0 : Math.PI; legs.forEach((l, i) => (l.rotation.z = Math.sin(S.t * 6 + i * 2) * .3)); } };
    },
    auto(it) {
      const g = new THREE.Group();
      const base = sh(new THREE.Mesh(new RoundedBoxGeometry(.9, .32, .6, 3, .08), mat(0x1f8a3a, .5))); base.position.y = .32; g.add(base);
      const roof = sh(new THREE.Mesh(new RoundedBoxGeometry(.86, .42, .62, 3, .14), mat(0xffd23f, .45))); roof.position.set(-.04, .74, 0); g.add(roof);
      const glass = new THREE.Mesh(new THREE.PlaneGeometry(.5, .3), mat(0xbfe9ff, .1)); glass.position.set(.43, .66, 0); glass.rotation.y = Math.PI / 2; g.add(glass);
      for (const [x, z] of [[-.3, .3], [-.3, -.3], [.36, 0]]) { const w = sh(new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .1, 14), mat(0x222222, .6))); w.rotation.x = Math.PI / 2; w.position.set(x, .13, z); g.add(w); }
      return { g, update(it, S) { const x = window.autoX(it), dir = Math.cos(S.t * 1.5 + it.ph) >= 0 ? 1 : -1; g.position.set(x, 0, -it.z); g.rotation.y = dir > 0 ? 0 : Math.PI; } };
    },
  };
  function sawBlade(R) {
    const g = new THREE.Group();
    const disc = sh(new THREE.Mesh(new THREE.CylinderGeometry(R, R, .06, 28), mat(0xd7dbe3, .2, { metalness: .7 }))); disc.rotation.x = Math.PI / 2; g.add(disc);
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, tth = new THREE.Mesh(new THREE.ConeGeometry(.06, .14, 4), mat(0xb8bec9, .2, { metalness: .7 })); tth.position.set(Math.cos(a) * R, Math.sin(a) * R, 0); tth.rotation.z = a - Math.PI / 2; g.add(tth); }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(R * .25, R * .25, .1, 14), mat(0xff4b4b, .4)); hub.rotation.x = Math.PI / 2; g.add(hub);
    return g;
  }

  // ---- the lead student: bigger, saffron bag, gold ring under the feet
  const lead = student(7, false, true); lead.scale.setScalar(K * 1.18); scene.add(lead);
  const ring = new THREE.Mesh(new THREE.RingGeometry(.22, .36, 28), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: .75, side: THREE.DoubleSide, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2; scene.add(ring);

  let lastCount = null, hop = 0, droop = 0;
  return function update(S, miga) {
    const live = new Set();
    if (S) for (const it of S.items) {
      if (!B[it.type]) continue;
      if (it.z < S.dist - 6 || it.z - S.dist > 70) continue;
      live.add(it);
      let o = objs.get(it); if (!o) { o = B[it.type](it); scene.add(o.g); objs.set(it, o); }
      o.update(it, S);
    }
    for (const [it, o] of objs) if (!live.has(it)) { scene.remove(o.g); objs.delete(it); }

    const show = S && S.members.length && ['run', 'battle', 'shoot', 'boss', 'climb'].includes(S.phase);
    lead.visible = ring.visible = !!show;
    if (show) {
      const hz = S.dist - window.clusterR() * S.tight - .35, air = S.phase === 'run' ? window.airAt(hz) : S.airY, ph = S.t * 9;
      lead.position.set(S.x, air + Math.abs(Math.sin(ph)) * .03, -hz); ring.position.set(S.x, air + .02, -hz);
      const L = lead.userData.limbs, a = S.phase === 'run' || S.phase === 'climb' ? 1 : .15;
      L[0].rotation.x = Math.sin(ph) * .75 * a; L[1].rotation.x = -Math.sin(ph) * .75 * a; L[2].rotation.x = -Math.sin(ph) * .7 * a; L[3].rotation.x = Math.sin(ph) * .7 * a;
    }
    // MIGA reacts: a hop when the batch grows, a droop when it shrinks
    if (S && miga) {
      if (lastCount != null) { if (S.count > lastCount) hop = .6; else if (S.count < lastCount) droop = .8; }
      lastCount = S.count;
      hop = Math.max(0, hop - 1 / 60); droop = Math.max(0, droop - 1 / 60);
      miga.position.y += Math.sin(hop / .6 * Math.PI) * .45 * (hop > 0 ? 1 : 0);
      miga.rotation.z = droop > 0 ? Math.sin(droop * 18) * .12 : 0;
    } else lastCount = null;
  };
}

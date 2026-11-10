// Cut-Off Run 3D: the flyover. The road runs along a raised deck with low walls and pillars; a hazy
// city at dusk sits far below on both sides, with lit windows, water tanks and the odd temple tower.
// Everything is recycled along the road as the camera moves, like the scenery pool.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const CITY = { ground: -16, fog: 0x8f9fcf, skyTop: 0x2f4f9a, skyHz: 0xf2b98f, groundCol: 0x2c3a62 };

function windowTex(wall, lit) {
  const c = document.createElement('canvas'); c.width = 64; c.height = 128; const g = c.getContext('2d');
  g.fillStyle = wall; g.fillRect(0, 0, 64, 128);
  for (let y = 6; y < 124; y += 12) for (let x = 5; x < 60; x += 12) {
    const on = Math.random() < lit; g.fillStyle = on ? (Math.random() < .5 ? '#ffd98a' : '#ffe9b8') : 'rgba(20,28,60,.55)'; g.fillRect(x, y, 7, 7);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}

export function makeCity({ scene, mat }) {
  const root = new THREE.Group(); scene.add(root);
  const G = CITY.ground;

  // deck: a thick slab under the road, low walls on both edges, pillars down to the city
  const SEG = 12, NSEG = 16;
  const slabM = mat(0x9aa3b8, .85), wallM = mat(0xc9cfdc, .7), stripeM = mat(0xffc24b, .5), pillarM = mat(0x7f889e, .9);
  const segs = [];
  for (let i = 0; i < NSEG; i++) {
    const s = new THREE.Group();
    const slab = new THREE.Mesh(new THREE.BoxGeometry(4.9, 1.1, SEG), slabM); slab.position.y = -.56; slab.receiveShadow = true; s.add(slab);
    for (const sx of [-1, 1]) {
      const w = new THREE.Mesh(new RoundedBoxGeometry(.28, .5, SEG, 2, .05), wallM); w.position.set(sx * 2.35, .25, 0); w.castShadow = w.receiveShadow = true; s.add(w);
      const st = new THREE.Mesh(new THREE.BoxGeometry(.3, .07, SEG), stripeM); st.position.set(sx * 2.35, .53, 0); s.add(st);
    }
    const p = new THREE.Mesh(new THREE.CylinderGeometry(.75, .9, -G, 12), pillarM); p.position.y = G / 2 - 1; s.add(p);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(4.4, .5, 1.6), pillarM); cap.position.y = -1.3; s.add(cap);
    root.add(s); segs.push(s);
  }

  // ground far below
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), mat(CITY.groundCol, 1)); ground.rotation.x = -Math.PI / 2; ground.position.y = G; root.add(ground);
  // a river crossing now and then
  const river = new THREE.Mesh(new THREE.PlaneGeometry(400, 14), new THREE.MeshStandardMaterial({ color: 0x5f86c9, roughness: .15, metalness: .2 }));
  river.rotation.x = -Math.PI / 2; river.position.y = G + .05; root.add(river);

  // buildings: a fixed pool of blocks that recycle as the camera passes
  const WALLS = ['#6f86b8', '#8d9ccc', '#5f74a6', '#a58fb8', '#7f95c4', '#c49a8a', '#d3a98c'];
  const texs = WALLS.map((w) => windowTex(w, .35));
  const mats = texs.map((t) => new THREE.MeshStandardMaterial({ map: t, roughness: .8, emissive: 0xffd58a, emissiveMap: t, emissiveIntensity: .35 }));
  const roofM = mat(0x56648c, .9), tankM = mat(0x2b2b2b, .6), gopM = mat(0xd9a05b, .7);
  const DEPTH = 220, blocks = [];
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 90; i++) {
    const side = i % 2 ? 1 : -1, w = 3 + rnd() * 4, d = 3 + rnd() * 4;
    const h = 6 + Math.pow(rnd(), 1.5) * 20;                          // most stay below the deck, a few rise past it
    const m = mats[(rnd() * mats.length) | 0].clone(); m.map = m.map.clone(); m.map.repeat.set(Math.max(1, Math.round(w / 2)), Math.max(1, Math.round(h / 5))); m.map.needsUpdate = true; m.emissiveMap = m.map;
    const b = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); body.position.y = h / 2; b.add(body);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(w + .2, .3, d + .2), roofM); roof.position.y = h + .15; b.add(roof);
    if (rnd() < .5) { const t = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, .8, 10), tankM); t.position.set((rnd() - .5) * w * .5, h + .7, (rnd() - .5) * d * .5); b.add(t); }
    if (rnd() < .06) { const gp = new THREE.Mesh(new THREE.CylinderGeometry(.6, 2, 5, 4), gopM); gp.position.y = h + 2.8; gp.rotation.y = Math.PI / 4; b.add(gp); }
    const x = side * (6 + rnd() * 34);
    b.userData = { x, off: rnd() * DEPTH };
    b.position.set(x, G, 0); root.add(b); blocks.push(b);
  }
  // far skyline band so the horizon is never empty
  const far = [];
  for (let i = 0; i < 40; i++) {
    const w = 6 + rnd() * 10, h = 10 + rnd() * 30, m = mats[i % mats.length];
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 6), m); b.userData = { x: (rnd() - .5) * 260, h };
    root.add(b); far.push(b);
  }

  function setVisible(v) { root.visible = v; }
  function update(camZ) {
    const base = Math.floor(camZ / SEG) * SEG;
    segs.forEach((s, i) => s.position.z = -(base + i * SEG - SEG));
    for (const b of blocks) { const z = camZ - 10 + ((b.userData.off - camZ) % DEPTH + DEPTH) % DEPTH; b.position.set(b.userData.x, G, -z); }
    const rz = 140 - ((camZ % 160) + 160) % 160; river.position.z = -(camZ + rz);
    for (const b of far) b.position.set(b.userData.x, G + b.userData.h / 2, -(camZ + 230));
    ground.position.z = -camZ;
  }
  return { update, setVisible };
}

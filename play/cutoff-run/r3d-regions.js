// Cut-Off Run 3D, stage 4: each story chapter gets its own roadside, ground, road and sky.
// A region is { sky:[top,horizon], fog, ground:[base,...spots], road:[base,...spots], kerb, props:[[builder, weight, dx, scale]] }.
// Builders take (h) — a per-slot hash — so the same slot always gets the same prop.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function makeRegions({ mat, tree, palm, house, flowers }) {
  const sh = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };
  const at = (m, x, y, z) => { m.position.set(x, y, z); return m; };
  const texCache = new Map();
  function signTex(text, bg, fg = '#fff') {
    const key = text + bg; if (texCache.has(key)) return texCache.get(key);
    const c = document.createElement('canvas'); c.width = 512; c.height = 128; const g = c.getContext('2d');
    g.fillStyle = bg; g.fillRect(0, 0, 512, 128); g.fillStyle = fg; let fs = 70; g.font = `${fs}px "Lilita One", Arial Black`;
    while (g.measureText(text).width > 470) { fs -= 4; g.font = `${fs}px "Lilita One", Arial Black`; }
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 256, 68);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; texCache.set(key, t); return t;
  }
  const sign = (text, bg, w, h) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: signTex(text, bg), toneMapped: false }));

  // ---- props
  const COACH = [['NOTES POINT', '#ff5a5f'], ['MOCK TESTS', '#2f6bff'], ['CURRENT AFFAIRS', '#16a34a'], ['PG ROOMS', '#f59e0b'], ['TEST SERIES', '#8a5cff']];
  function coachingBuilding(h) {
    const g = new THREE.Group(), floors = 2 + h % 3, [txt, col] = COACH[h % COACH.length];
    const b = sh(new THREE.Mesh(new RoundedBoxGeometry(3.2, floors * 1.4, 2.6, 2, .06), mat([0xe6d5bf, 0xf1e6d6, 0xd9c7b0][h % 3], .85))); b.position.y = floors * .7; g.add(b);
    for (let f = 0; f < floors; f++) for (const x of [-.9, 0, .9]) { const w = new THREE.Mesh(new THREE.BoxGeometry(.55, .6, .04), mat(0x9fc7e6, .25)); w.position.set(x, .8 + f * 1.4, 1.31); g.add(w); }
    const board = sign(txt, col, 3, .62); board.position.set(0, floors * 1.4 - .1, 1.34); g.add(board);
    return g;
  }
  function chaiStall() {
    const g = new THREE.Group();
    g.add(at(sh(new THREE.Mesh(new RoundedBoxGeometry(2.2, 1.1, 1.3, 2, .06), mat(0xb5651d))), 0, .55, 0));
    const aw = sh(new THREE.Mesh(new RoundedBoxGeometry(2.6, .12, 1.7, 2, .04), mat(0xffcc33))); aw.position.y = 2; g.add(aw);
    for (const x of [-1.1, 1.1]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 2, 6), mat(0x6b4520)); p.position.set(x, 1, .65); g.add(p); }
    const s = sign('CHAI', '#c0392b', 1.2, .34); s.position.set(0, 1.55, .66); g.add(s);
    return g;
  }
  function xerox() {
    const g = coachingBuilding(3); const s = sign('PHOTOCOPY', '#2f6bff', 2.4, .5); s.position.set(0, 1.9, 1.35); g.add(s); return g;
  }
  function lamp() {
    const g = new THREE.Group();
    g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.06, .08, 2.6, 8), mat(0x3a3a46, .5)), 0, 1.3, 0));
    g.add(at(new THREE.Mesh(new THREE.SphereGeometry(.2, 12, 8), mat(0xffe08a, .3, { emissive: 0xffd36a, emissiveIntensity: .6 })), 0, 2.65, 0));
    return g;
  }
  const BOOK = [0xc0392b, 0x2f6bff, 0x16a34a, 0xe8b923, 0x8a5cff, 0xf5f0e6];
  function shelf(h) {
    const g = new THREE.Group();
    const frame = sh(new THREE.Mesh(new RoundedBoxGeometry(2.6, 3.4, .7, 2, .05), mat(0x5a3620, .7))); frame.position.y = 1.7; g.add(frame);
    for (let r = 0; r < 4; r++) for (let k = 0; k < 9; k++) {
      const hgt = .5 + ((h + k * 7 + r * 3) % 4) * .06, bk = new THREE.Mesh(new THREE.BoxGeometry(.22, hgt, .5), mat(BOOK[(k * 3 + r + h) % 6], .7));
      bk.position.set(-1.05 + k * .26, .35 + r * .8 + hgt / 2, .12); g.add(bk);
    }
    return g;
  }
  function readDesk() {
    const g = new THREE.Group();
    const top = sh(new THREE.Mesh(new RoundedBoxGeometry(2, .12, 1, 2, .04), mat(0x8a5a2b, .6))); top.position.y = .8; g.add(top);
    for (const [x, z] of [[-.85, -.4], [.85, -.4], [-.85, .4], [.85, .4]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .8, 6), mat(0x3a2412)); l.position.set(x, .4, z); g.add(l); }
    const book = new THREE.Mesh(new THREE.BoxGeometry(.5, .06, .36), mat(0xf5f0e6, .6)); book.position.set(-.3, .89, 0); g.add(book);
    const lampG = new THREE.Mesh(new THREE.ConeGeometry(.18, .22, 12, 1, true), mat(0x16a34a, .4, { side: THREE.DoubleSide })); lampG.position.set(.6, 1.25, 0); g.add(lampG);
    return g;
  }
  function globe() {
    const g = new THREE.Group();
    g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.06, .2, .9, 8), mat(0x6b4520)), 0, .45, 0));
    const s = sh(new THREE.Mesh(new THREE.SphereGeometry(.45, 20, 14), mat(0x4fb3ff, .5))); s.position.y = 1.35; g.add(s);
    for (const [y, r] of [[1.5, .3], [1.2, .25]]) { const c = new THREE.Mesh(new THREE.SphereGeometry(r * .7, 10, 8), mat(0x4caf50, .6)); c.position.set(.12, y, .3); c.scale.set(1, .6, .4); g.add(c); }
    return g;
  }
  function examDesk(h) {
    const g = readDesk(); g.children[3].visible = false; g.children[g.children.length - 1].visible = false;
    const chair = sh(new THREE.Mesh(new RoundedBoxGeometry(.6, .7, .5, 2, .05), mat(0x5d6b80, .6))); chair.position.set(0, .35, 1); g.add(chair);
    const sheet = new THREE.Mesh(new THREE.BoxGeometry(.42, .01, .56), mat(0xffffff, .7)); sheet.position.set(0, .87, .1); g.add(sheet);
    g.scale.setScalar(.8 + (h % 3) * .05); return g;
  }
  function cooler() {
    const g = new THREE.Group();
    g.add(at(sh(new THREE.Mesh(new RoundedBoxGeometry(.7, 1.3, .6, 2, .08), mat(0xe9eef5, .4))), 0, .65, 0));
    g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .55, 16), mat(0x7fd0ff, .1, { transparent: true, opacity: .8 })), 0, 1.58, 0));
    return g;
  }
  function plant() {
    const g = new THREE.Group();
    g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.3, .22, .5, 12), mat(0xc0603a, .7)), 0, .25, 0));
    for (let i = 0; i < 6; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(.3, 10, 6), mat(0x2f9a4a, .7)); l.scale.set(.35, 1.2, .35); const a = i / 6 * Math.PI * 2; l.position.set(Math.cos(a) * .15, .9, Math.sin(a) * .15); l.rotation.set(Math.sin(a) * .5, 0, Math.cos(a) * .5); g.add(l); }
    return g;
  }
  function pine(h) {
    const g = new THREE.Group(), k = .8 + (h % 4) * .1;
    g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.14 * k, .2 * k, 1 * k, 8), mat(0x6b4520)), 0, .5 * k, 0));
    for (let i = 0; i < 4; i++) { const c = sh(new THREE.Mesh(new THREE.ConeGeometry((1.3 - i * .25) * k, 1.4 * k, 10), mat(i % 2 ? 0x2f6d4a : 0x3a805a, .8))); c.position.y = (1.2 + i * .75) * k; g.add(c); }
    const snow = new THREE.Mesh(new THREE.ConeGeometry(.42 * k, .5 * k, 10), mat(0xffffff, .6)); snow.position.y = 4.05 * k; g.add(snow);
    return g;
  }
  function rock(h) {
    const r = sh(new THREE.Mesh(new THREE.DodecahedronGeometry(.6 + (h % 3) * .2, 0), mat(0x9aa3ad, .9))); r.position.y = .3; r.rotation.set(h % 3, h % 5, 0); r.scale.y = .6;
    const g = new THREE.Group(); g.add(r); return g;
  }
  function snowMound() {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xffffff, .7)); m.scale.set(1.6, .5, 1.2); m.receiveShadow = true;
    const g = new THREE.Group(); g.add(m); return g;
  }
  function chhatri() {
    const g = new THREE.Group();
    g.add(at(sh(new THREE.Mesh(new RoundedBoxGeometry(2.6, .25, 2.6, 2, .05), mat(0xc98f58, .7))), 0, .12, 0));
    for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const c = sh(new THREE.Mesh(new THREE.CylinderGeometry(.1, .12, 2, 10), mat(0xe3b07a, .6))); c.position.set(x, 1.25, z); g.add(c); }
    const slab = sh(new THREE.Mesh(new RoundedBoxGeometry(2.8, .22, 2.8, 2, .05), mat(0xd9a066, .7))); slab.position.y = 2.35; g.add(slab);
    const dome = sh(new THREE.Mesh(new THREE.SphereGeometry(1.15, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xe8bb86, .6))); dome.position.y = 2.45; g.add(dome);
    const fin = new THREE.Mesh(new THREE.SphereGeometry(.12, 10, 8), mat(0xffcf3f, .3, { metalness: .4 })); fin.position.y = 3.7; g.add(fin);
    return g;
  }
  function fountain() {
    const g = new THREE.Group();
    g.add(at(sh(new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, .4, 24), mat(0xd9a066, .7))), 0, .2, 0));
    g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, .05, 24), mat(0x5fc6f0, .1)), 0, .38, 0));
    g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.12, .16, 1.1, 10), mat(0xe3b07a, .6)), 0, .9, 0));
    g.add(at(new THREE.Mesh(new THREE.SphereGeometry(.35, 14, 10), mat(0xbfe9ff, .1, { transparent: true, opacity: .6 })), 0, 1.55, 0));
    return g;
  }
  function hedge() {
    const g = new THREE.Group(), b = sh(new THREE.Mesh(new RoundedBoxGeometry(2.4, .8, .8, 3, .3), mat(0x3f7a35, .8))); b.position.y = .4; g.add(b); return g;
  }
  function cottage(h) {
    const g = house([0xf4efe6, 0xe9e3d6][h % 2], 0x7a3b2e); const ch = sh(new THREE.Mesh(new THREE.BoxGeometry(.4, 1, .4), mat(0x7a3b2e))); ch.position.set(1, 3.6, -.5); g.add(ch); return g;
  }
  function bench() {
    const g = new THREE.Group();
    for (const y of [.45, .8]) { const p = sh(new THREE.Mesh(new RoundedBoxGeometry(1.8, .1, .35, 2, .03), mat(0x8a5a2b, .6))); p.position.set(0, y, y > .5 ? -.15 : 0); if (y > .5) p.rotation.x = -.3; g.add(p); }
    for (const x of [-.75, .75]) { const l = new THREE.Mesh(new THREE.BoxGeometry(.08, .45, .3), mat(0x3a3a46)); l.position.set(x, .22, 0); g.add(l); }
    return g;
  }
  function flag() {
    const g = new THREE.Group();
    g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.05, .06, 4, 8), mat(0xe9eef5, .3, { metalness: .3 })), 0, 2, 0));
    ['#ff9933', '#ffffff', '#138808'].forEach((c, i) => { const s = new THREE.Mesh(new THREE.PlaneGeometry(1.2, .27), new THREE.MeshStandardMaterial({ color: c, side: THREE.DoubleSide })); s.position.set(.62, 3.8 - i * .27, 0); g.add(s); });
    const ch = new THREE.Mesh(new THREE.RingGeometry(.05, .09, 16), new THREE.MeshBasicMaterial({ color: 0x1f3a93, side: THREE.DoubleSide })); ch.position.set(.62, 3.53, .01); g.add(ch);
    return g;
  }
  function boat() {
    const g = new THREE.Group(), hull = sh(new THREE.Mesh(new THREE.CapsuleGeometry(.4, 1.8, 4, 10), mat(0x2f6bff, .5)));
    hull.rotation.z = Math.PI / 2; hull.scale.set(.6, 1, 1); hull.position.y = .25; g.add(hull);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 1.6, 6), mat(0x6b4520)); mast.position.y = 1; g.add(mast);
    const sail = new THREE.Mesh(new THREE.PlaneGeometry(.8, 1.1), new THREE.MeshStandardMaterial({ color: 0xffd23f, side: THREE.DoubleSide })); sail.position.set(.4, 1.1, 0); g.add(sail);
    return g;
  }
  function lighthouse() {
    const g = new THREE.Group();
    for (let k = 0; k < 6; k++) { const s = sh(new THREE.Mesh(new THREE.CylinderGeometry(.55 - k * .05, .6 - k * .05, .9, 14), mat(k % 2 ? 0xffffff : 0xd33c2c, .6))); s.position.y = .45 + k * .9; g.add(s); }
    g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, .5, 12), mat(0xffd23f, .2, { emissive: 0xffd23f, emissiveIntensity: .6 })), 0, 5.65, 0));
    g.add(at(new THREE.Mesh(new THREE.ConeGeometry(.45, .5, 12), mat(0x14213d)), 0, 6.15, 0));
    return g;
  }
  function gopuram() {
    const g = new THREE.Group(); let y = 0;
    for (let i = 0; i < 6; i++) { const w = 3.2 - i * .45, s = sh(new THREE.Mesh(new RoundedBoxGeometry(w, .8, w * .6, 2, .06), mat(i % 2 ? 0xe9a15b : 0xf2b56e))); s.position.y = y + .4; g.add(s); y += .8; }
    g.add(at(new THREE.Mesh(new THREE.SphereGeometry(.25, 12, 8), mat(0xffcf3f, .3, { metalness: .4 })), 0, y + .2, 0));
    return g;
  }

  // weight = how often, dx = distance from the road centre, s = scale
  const R = {
    village: { sky: [0x3a8fe0, 0xd6ecfb], fog: 0xcfe6f5, ground: ['#8fcf63', '#7fbf55', '#a3db74', '#86c75c'], road: ['#efd9ae', '#e6cc9a', '#f6e4c0'], kerb: 0xffffff,
      props: [[(h) => tree(.55 + (h % 5) * .04, ((h >> 4) % 7 - 3) * .01), 2, 3.6, 1], [(h) => palm(.55 + (h % 4) * .04), 2, 3.4, 1], [(h) => house([0xfff4e3, 0xe8f3ff, 0xffe9d6][h % 3], [0xd9573b, 0x3b7bd9, 0xe07a2e][(h >> 3) % 3]), 1, 6.5, .55], [() => flowers(), 2, 2.9, .5]] },
    coaching: { sky: [0xff8f6b, 0xffd7a3], fog: 0xffd9b8, ground: ['#9a938d', '#8f8882', '#a59f99'], road: ['#565c69', '#4b505c', '#60666f'], kerb: 0xffd23f,
      props: [[coachingBuilding, 4, 4.6, .62], [() => chaiStall(), 1, 3.4, .6], [() => xerox(), 1, 4.6, .62], [() => lamp(), 2, 2.6, .8]] },
    library: { sky: [0x4a2c1a, 0x7a4f30], fog: 0x6b4428, ground: ['#7a4a2a', '#6b3f22', '#86552f'], road: ['#a8323e', '#9c2c37', '#b43b47'], kerb: 0xe8b923,
      props: [[shelf, 4, 3.6, .65], [() => readDesk(), 2, 2.9, .6], [() => globe(), 1, 2.8, .6], [() => lamp(), 1, 2.6, .8]] },
    exam: { sky: [0xb9c7d9, 0xf2f6fb], fog: 0xe6ecf3, ground: ['#c9d3df', '#bcc7d4', '#d4dce6'], road: ['#f2f5f9', '#e3e9f1', '#eef2f7'], kerb: 0x5d6b80,
      props: [[examDesk, 4, 3.2, .6], [() => cooler(), 1, 2.8, .6], [() => plant(), 1, 2.7, .7]] },
    mains: { sky: [0x9fc9ef, 0xfff8ea], fog: 0xf3eedf, ground: ['#efe4c8', '#f7f0de', '#e4d7b6', '#ffffff'], road: ['#ffffff', '#f3f6ff', '#e8edf7'], kerb: 0x9aa3ad,
      props: [[pine, 4, 3.8, .7], [rock, 2, 3, .7], [() => snowMound(), 1, 4.2, 1]] },
    interview: { sky: [0xffae66, 0xffe3b8], fog: 0xffdcb0, ground: ['#78b357', '#6ea851', '#86c063'], road: ['#dca46b', '#d0965c', '#e3ae78'], kerb: 0xfff2d6,
      props: [[() => chhatri(), 2, 5, .55], [() => fountain(), 1, 3.6, .6], [(h) => palm(.55 + (h % 4) * .04), 2, 3.4, 1], [() => hedge(), 2, 2.8, .6]] },
    academy: { sky: [0x4f9ee8, 0xe3f5ff], fog: 0xd6ecf7, ground: ['#64a06d', '#5a9463', '#72ad7a'], road: ['#d3d9df', '#c3cbd3', '#dde2e7'], kerb: 0xffffff,
      props: [[pine, 3, 3.8, .7], [cottage, 1, 6.5, .55], [() => bench(), 1, 2.8, .6], [() => flag(), 1, 3, .6]] },
    chennai: { sky: [0xff9d63, 0xffe8cc], fog: 0xffe3c4, ground: ['#f2ddb0', '#e8cf9c', '#f7e6c2'], road: ['#f2ddb0', '#e8cf9c', '#ead4a5'], kerb: 0x36b8e8,
      props: [[(h) => palm(.6 + (h % 4) * .05), 4, 3.4, 1], [() => boat(), 1, 4.2, .6], [() => lighthouse(), 1, 8, .7], [() => gopuram(), 1, 9, .7]] },
  };
  return R;
}

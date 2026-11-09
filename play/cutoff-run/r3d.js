// Cut-Off Run 3D world renderer (stage 1: road, scenery, the batch, gate arches).
//
// The 2D game keeps all its logic and keeps drawing labels, numbers and effects on its own canvas,
// which now sits transparently on top of this one. The camera here reproduces the 2D projection
// exactly (P(): screen = centre + (x - camX) * F / dz, horizon at HOR), so a label the 2D code
// places at a gate lands on the 3D gate. Game coordinates map straight across: X = x, Y = y, Z = -z.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const host = document.getElementById('wrap'), c2d = document.getElementById('c');
const cv = document.createElement('canvas');
cv.id = 'c3';
cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
host.insertBefore(cv, c2d);
c2d.style.position = 'relative';

const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xcfe6f5, 40, 110);
const cam = new THREE.PerspectiveCamera();
const K = 0.45; // the art-test models were built at ~2.2x game scale

const mat = (c, r = .8, extra = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: r, ...extra });

// ---------------------------------------------------------------- sky + light (follow the camera)
const SUN = new THREE.Vector3(.45, .55, -.7).normalize();
const sky = new THREE.Mesh(new THREE.SphereGeometry(250, 32, 16), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { uSun: { value: SUN } },
  vertexShader: 'varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: 'uniform vec3 uSun;varying vec3 d;void main(){float y=d.y;vec3 top=vec3(.20,.55,.95),hz=vec3(.83,.92,.98);vec3 c=mix(hz,top,pow(smoothstep(0.,.6,y),.8));float s=max(dot(normalize(d),uSun),0.);c+=vec3(1.,.93,.75)*(pow(s,80.)*.9+pow(s,6.)*.12);gl_FragColor=vec4(c,1.);}',
}));
sky.renderOrder = -1; scene.add(sky);
scene.add(new THREE.HemisphereLight(0xdff1ff, 0x6f9a52, 1.15));
const sun = new THREE.DirectionalLight(0xfff1d6, 2.2);
sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 10, bottom: -10, near: .5, far: 60 });
sun.shadow.bias = -.0006; sun.shadow.radius = 3;
scene.add(sun, sun.target);

// ---------------------------------------------------------------- ground + road (scroll their textures)
function noiseTex(base, spots, n, size = 512, dashes = false) {
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, size, size);
  for (let i = 0; i < n; i++) { g.fillStyle = spots[i % spots.length]; g.globalAlpha = .18 + Math.random() * .25; g.beginPath(); g.ellipse(Math.random() * size, Math.random() * size, 4 + Math.random() * 26, 3 + Math.random() * 12, Math.random() * 3, 0, 6.3); g.fill(); }
  g.globalAlpha = 1;
  if (dashes) { g.fillStyle = 'rgba(255,255,255,.9)'; g.fillRect(size / 2 - 5, size * .1, 10, size * .4); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
const LEN = 160;
const grassT = noiseTex('#8fcf63', ['#7fbf55', '#a3db74', '#86c75c', '#b3e083'], 900); grassT.repeat.set(12, LEN / 6);
const grass = new THREE.Mesh(new THREE.PlaneGeometry(70, LEN), new THREE.MeshStandardMaterial({ map: grassT, roughness: 1 }));
grass.rotation.x = -Math.PI / 2; grass.position.y = -.01; grass.receiveShadow = true; scene.add(grass);
const roadT = noiseTex('#efd9ae', ['#e6cc9a', '#f6e4c0', '#e9d2a4'], 600, 512, true); const ROAD_TILE = 4; roadT.repeat.set(1, LEN / ROAD_TILE);
const road = new THREE.Mesh(new THREE.PlaneGeometry(4, LEN), new THREE.MeshStandardMaterial({ map: roadT, roughness: .95 }));
road.rotation.x = -Math.PI / 2; road.receiveShadow = true; scene.add(road);
const kerbs = [-1, 1].map((sx) => { const k = new THREE.Mesh(new RoundedBoxGeometry(.22, .1, LEN, 2, .03), mat(0xffffff, .5)); k.position.set(sx * 2.08, .04, 0); k.receiveShadow = true; scene.add(k); return k; });

// ---------------------------------------------------------------- scenery pool (recycled along the road)
const canopyG = new THREE.IcosahedronGeometry(1, 2);
function tree(k, hue) {
  const g = new THREE.Group();
  const t = new THREE.Mesh(new THREE.CylinderGeometry(.18 * k, .26 * k, 2.2 * k, 8), mat(0x8a5a35)); t.position.y = 1.1 * k; t.castShadow = true; g.add(t);
  const cols = [0x4fae55, 0x5cbf5f, 0x3f9a4c].map((c) => new THREE.Color(c).offsetHSL(hue, 0, 0));
  for (const [dx, dy, dz, r] of [[0, 2.9, 0, 1.25], [-.8, 2.5, .2, .9], [.8, 2.6, -.1, .95], [.1, 3.5, .1, .85]]) {
    const c = new THREE.Mesh(canopyG, mat(cols[(dx * 3 + 3 | 0) % 3], .9)); c.position.set(dx * k, dy * k, dz * k); c.scale.setScalar(r * k); c.castShadow = true; g.add(c);
  }
  return g;
}
function palm(k) {
  const g = new THREE.Group(); let px = 0, py = 0;
  for (let i = 0; i < 7; i++) { const s = new THREE.Mesh(new THREE.CylinderGeometry(.16 * k, .2 * k, .7 * k, 7), mat(0xa77b4f)); px += .06 * k; py += .65 * k; s.position.set(px, py, 0); s.rotation.z = -.08; s.castShadow = true; g.add(s); }
  for (let i = 0; i < 7; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 6), mat(0x3f9a4c)); l.scale.set(1.5 * k, .12 * k, .38 * k); const a = i / 7 * Math.PI * 2; l.position.set(px + Math.cos(a) * 1.1 * k, py - .15 * k, Math.sin(a) * 1.1 * k); l.rotation.y = -a; l.rotation.z = -.35; l.castShadow = true; g.add(l); }
  return g;
}
function house(wall, roof) {
  const g = new THREE.Group();
  const b = new THREE.Mesh(new RoundedBoxGeometry(3.4, 2.4, 3, 2, .08), mat(wall)); b.position.y = 1.2; b.castShadow = b.receiveShadow = true; g.add(b);
  const r = new THREE.Mesh(new THREE.ConeGeometry(2.7, 1.6, 4), mat(roof, .7)); r.position.y = 3.2; r.rotation.y = Math.PI / 4; r.castShadow = true; g.add(r);
  const d = new THREE.Mesh(new THREE.BoxGeometry(.8, 1.3, .05), mat(0x7a4a2a)); d.position.set(0, .65, 1.52); g.add(d);
  for (const wx of [-1.05, 1.05]) { const w = new THREE.Mesh(new THREE.BoxGeometry(.6, .6, .05), mat(0x9fd6f2, .2)); w.position.set(wx, 1.45, 1.52); g.add(w); }
  return g;
}
function flowers() {
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.SphereGeometry(.7, 10, 6), mat(0x3f8f3a)); b.scale.set(1.4, .5, 1); b.position.y = .15; g.add(b);
  for (let f = 0; f < 6; f++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.16, 8, 6), mat(f % 2 ? 0xff9f1a : 0xffd23f, .6)); m.position.set((f - 2.5) * .28, .45, Math.sin(f * 2) * .25); g.add(m); }
  return g;
}
const h32 = (n) => { n = Math.imul(n ^ 61 ^ (n >>> 16), 9); n ^= n >>> 4; n = Math.imul(n, 0x27d4eb2d); return (n ^ (n >>> 15)) >>> 0; };
const SLOT = 7, SLOTS = 18;                      // one prop per side every 7 units, 18 slots deep
const pool = [];
for (let i = 0; i < SLOTS * 2; i++) {
  const side = i % 2 ? 1 : -1, h = h32(i * 7 + 3);
  const kind = h % 7;
  let obj;
  if (kind < 2) obj = tree(.55 + (h % 5) * .04, ((h >> 4) % 7 - 3) * .01);
  else if (kind < 4) obj = palm(.55 + (h % 4) * .04);
  else if (kind === 4) obj = house([0xfff4e3, 0xe8f3ff, 0xffe9d6][h % 3], [0xd9573b, 0x3b7bd9, 0xe07a2e][(h >> 3) % 3]);
  else obj = flowers();
  obj.scale.multiplyScalar(kind === 4 ? .55 : kind > 4 ? .5 : 1);
  obj.userData = { side, kind, off: (h % 100) / 100 * SLOT * .6, dx: kind === 4 ? 6 + (h % 3) : kind > 4 ? 2.9 : 3.3 + (h % 4) * .5 };
  if (kind === 4) obj.rotation.y = side < 0 ? .5 : -.5;
  scene.add(obj); pool.push(obj);
}

// ---------------------------------------------------------------- students (pool, synced to S.members)
const SKIN = [0xc98e62, 0xb57a52, 0xd9a27a, 0xa86d47, 0xc08458];
const HAIRC = [0x1d1410, 0x2a1d14, 0x16100c, 0x3a2618];
const shirtG = new THREE.LatheGeometry([[0, 0], [.26, 0], [.29, .12], [.3, .42], [.27, .6], [.16, .7], [0, .72]].map((q) => new THREE.Vector2(q[0], q[1])), 14);
const geo = {
  leg: new THREE.CapsuleGeometry(.1, .5, 3, 8), shoe: new RoundedBoxGeometry(.18, .12, .3, 2, .05), bag: new RoundedBoxGeometry(.44, .5, .2, 2, .09),
  sleeve: new THREE.CapsuleGeometry(.085, .16, 3, 8), fore: new THREE.CapsuleGeometry(.07, .3, 3, 8), head: new THREE.SphereGeometry(.24, 18, 14),
  ear: new THREE.SphereGeometry(.055, 8, 6), cap: new THREE.SphereGeometry(.255, 18, 10, 0, Math.PI * 2, 0, Math.PI * .58), plait: new THREE.CapsuleGeometry(.06, .42, 3, 6),
};
const M = { pants: mat(0x2b3a67, .7), shoe: mat(0x222222, .4), shirt: mat(0xffffff, .65), bags: [0x2f6bff, 0x16a34a, 0x7c3aed, 0x0ea5e9, 0xff7a45].map((c) => mat(c, .55)),
  skin: SKIN.map((c) => mat(c, .55)), hair: HAIRC.map((c) => mat(c, .45)) };
function student(i) {
  const g = new THREE.Group(), skin = M.skin[i % SKIN.length], hairM = M.hair[i % 4], girl = i % 3 === 1, limbs = [];
  const sh = (m) => { m.castShadow = true; return m; };
  for (const sx of [-1, 1]) {
    const leg = new THREE.Group(); leg.position.set(sx * .12, .72, 0);
    const l = sh(new THREE.Mesh(geo.leg, M.pants)); l.position.y = -.33; leg.add(l);
    const s = new THREE.Mesh(geo.shoe, M.shoe); s.position.set(0, -.68, -.04); leg.add(s);
    g.add(leg); limbs.push(leg);
  }
  const shirt = sh(new THREE.Mesh(shirtG, M.shirt)); shirt.position.y = .66; shirt.scale.set(1, 1, .72); g.add(shirt);
  const bag = sh(new THREE.Mesh(geo.bag, M.bags[i % M.bags.length])); bag.position.set(0, 1.0, .27); g.add(bag);
  for (const sx of [-1, 1]) {
    const arm = new THREE.Group(); arm.position.set(sx * .31, 1.26, 0);
    const sl = new THREE.Mesh(geo.sleeve, M.shirt); sl.position.y = -.12; arm.add(sl);
    const fo = new THREE.Mesh(geo.fore, skin); fo.position.y = -.42; arm.add(fo);
    arm.rotation.z = sx * .12; g.add(arm); limbs.push(arm);
  }
  const head = sh(new THREE.Mesh(geo.head, skin)); head.scale.set(1, 1.08, 1); head.position.y = 1.7; g.add(head);
  for (const sx of [-1, 1]) { const e = new THREE.Mesh(geo.ear, skin); e.position.set(sx * .24, 1.69, 0); g.add(e); }
  const cap = new THREE.Mesh(geo.cap, hairM); cap.position.y = 1.72; cap.rotation.x = .38; g.add(cap);
  if (girl) { const p = new THREE.Mesh(geo.plait, hairM); p.position.set(0, 1.38, .2); p.rotation.x = .25; g.add(p); }
  g.scale.setScalar(K); g.userData = { limbs };
  return g;
}
const crowd = [];
function ensureCrowd(n) { while (crowd.length < n) { const s = student(crowd.length); scene.add(s); crowd.push(s); } }

// ---------------------------------------------------------------- MIGA running beside the batch
function makeMiga() {
  const g = new THREE.Group(), blue = mat(0x2cb7ec, .45), light = mat(0xeaf7ff, .5), dark = mat(0x1b2340, .3);
  const add = (geo2, m, x, y, z, sx = 1, sy = 1, sz = 1) => { const o = new THREE.Mesh(geo2, m); o.position.set(x, y, z); o.scale.set(sx, sy, sz); o.castShadow = true; g.add(o); return o; };
  add(new THREE.SphereGeometry(.42, 20, 14), blue, 0, .62, 0, 1, 1.1, .95);
  add(new THREE.SphereGeometry(.46, 22, 16), blue, 0, 1.28, 0);
  add(new THREE.SphereGeometry(.24, 16, 10), light, 0, 1.16, .34, 1.1, .8, .8);
  add(new THREE.SphereGeometry(.07, 10, 8), dark, 0, 1.22, .55);
  for (const sx of [-1, 1]) {
    add(new THREE.SphereGeometry(.1, 12, 8), dark, sx * .17, 1.36, .38, .85, 1.1, .6);
    const ear = add(new THREE.ConeGeometry(.16, .42, 4), blue, sx * .3, 1.72, 0); ear.rotation.z = -sx * .35;
    add(new THREE.SphereGeometry(.06, 8, 6), mat(0xff9ec4, .6), sx * .3, 1.18, .36);
  }
  const tuft = add(new THREE.ConeGeometry(.16, .4, 6), mat(0x8b5cf6, .45), .05, 1.78, .1); tuft.rotation.z = -.4;
  const tail = add(new THREE.CapsuleGeometry(.11, .4, 3, 8), blue, .1, .7, -.42); tail.rotation.x = -.9;
  const legs = [[-.18, .12], [.18, .12], [-.18, -.12], [.18, -.12]].map(([x, z]) => add(new THREE.CapsuleGeometry(.09, .2, 3, 6), blue, x, .2, z));
  g.userData = { legs, tail }; g.scale.setScalar(K * 1.1); g.rotation.y = Math.PI + .35;
  return g;
}
const miga = makeMiga(); scene.add(miga);

// ---------------------------------------------------------------- gates (one arch per lane)
const LANE_COL = [0x1cb0f6, 0x58cc02, 0xffc800, 0xff4b8b];
const archGeo = new Map();
function archGeometry(w) {
  const key = w.toFixed(2); if (archGeo.has(key)) return archGeo.get(key);
  const h = 2.1, r = Math.min(.55, w * .3), t = .14, s = new THREE.Shape(), x = w / 2;
  s.moveTo(-x, 0); s.lineTo(-x, h - r); s.absarc(-x + r, h - r, r, Math.PI, Math.PI / 2, true); s.lineTo(x - r, h); s.absarc(x - r, h - r, r, Math.PI / 2, 0, true); s.lineTo(x, 0); s.lineTo(x - t, 0);
  s.lineTo(x - t, h - r); s.absarc(x - r, h - r, r - t, 0, Math.PI / 2, false); s.lineTo(-x + r, h - t); s.absarc(-x + r, h - r, r - t, Math.PI / 2, Math.PI, false); s.lineTo(-x + t, 0); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: .18, bevelEnabled: true, bevelSize: .03, bevelThickness: .03, bevelSegments: 2 }); g.translate(0, 0, -.09);
  archGeo.set(key, g); return g;
}
const gateObjs = new Map(); // item -> group
function gateGroup(it) {
  const n = it.type === 'branch' ? 2 : it.ans.length, lw = 4 / n, g = new THREE.Group(), lanes = [];
  for (let i = 0; i < n; i++) {
    let col = LANE_COL[i % 4];
    if (it.type === 'math') { const o = it.ops[i]; col = (o[0] === '-' || o[0] === '÷') ? 0xff4b4b : o[0] === '×' ? 0xffc800 : 0x58cc02; }
    if (it.type === 'branch') col = i ? 0xff9f43 : 0x8b5cf6;
    const c = new THREE.Color(col);
    const frame = new THREE.Mesh(archGeometry(lw - .1), mat(c.clone().lerp(new THREE.Color(0xffffff), .15), .3)); frame.castShadow = true;
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(lw - .34, 1.95), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: .35, transparent: true, opacity: .32, roughness: .1, side: THREE.DoubleSide, depthWrite: false }));
    glass.position.y = 1.0;
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(lw - .2, .3), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .5 })); strip.rotation.x = -Math.PI / 2; strip.position.set(0, .02, .3);
    const lane = new THREE.Group(); lane.add(frame, glass, strip); lane.position.x = -2 + lw * (i + .5);
    g.add(lane); lanes.push({ glass, base: c });
  }
  g.userData = { lanes }; scene.add(g); return g;
}

// ---------------------------------------------------------------- per-frame sync
function project(o) {
  const { W, H, F, HOR } = o, near = .3, far = 260;
  cam.projectionMatrix.makePerspective(-(W / 2) / F * near, (W / 2) / F * near, HOR / F * near, -(H - HOR) / F * near, near, far);
  cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
  cam.position.set(o.camX, o.camY, -o.camZ); cam.rotation.set(0, 0, 0); cam.updateMatrixWorld();
}
let lastW = 0, lastH = 0;
function frame(o) {
  const { S, W, H } = o;
  if (W !== lastW || H !== lastH) { renderer.setSize(W, H, false); lastW = W; lastH = H; }
  project(o);
  const cz = o.camZ, mid = cz + LEN / 2 - 8;
  sky.position.copy(cam.position);
  grass.position.z = -mid; road.position.z = -mid; kerbs.forEach((k) => (k.position.z = -mid));
  roadT.offset.y = (mid % ROAD_TILE) / ROAD_TILE; grassT.offset.y = (mid % 6) / 6;
  // scenery: slot index from the camera so props stream past
  const first = Math.floor(cz / SLOT);
  for (let i = 0; i < pool.length; i++) {
    const p = pool[i], s = Math.floor(i / 2), slot = first + ((s - first) % SLOTS + SLOTS) % SLOTS;
    p.position.set(p.userData.side * p.userData.dx, 0, -(slot * SLOT + p.userData.off));
  }
  // batch
  const ms = S ? S.members : [], t = S ? S.t : 0, running = S && (S.phase === 'run' || S.phase === 'climb');
  ensureCrowd(ms.length);
  for (let i = 0; i < crowd.length; i++) {
    const st = crowd[i], m = ms[i];
    st.visible = !!m; if (!m) continue;
    const air = o.air ? o.air(m) : 0;
    st.position.set(S.x + m.x, (m.y || 0) + air, -(S.dist + m.z));
    const ph = t * 9 + (m.ph || 0), L = st.userData.limbs, a = running ? 1 : .15;
    L[0].rotation.x = Math.sin(ph) * .75 * a; L[1].rotation.x = -Math.sin(ph) * .75 * a; L[2].rotation.x = -Math.sin(ph) * .7 * a; L[3].rotation.x = Math.sin(ph) * .7 * a;
    st.position.y += running ? Math.abs(Math.sin(ph)) * .03 : 0;
  }
  // MIGA trots beside the batch, on the side away from the centre
  if (S && ms.length) {
    const side = S.x > 0 ? -1 : 1, ph = t * 10;
    miga.visible = true; miga.position.set(Math.max(-1.85, Math.min(1.85, S.x + side * 1.25)), Math.abs(Math.sin(ph)) * .07, -(S.dist + .4));
    miga.userData.legs.forEach((l, i) => (l.rotation.x = Math.sin(ph + i * Math.PI / 2) * .8)); miga.userData.tail.rotation.z = Math.sin(t * 6) * .4;
  } else miga.visible = false;
  // gates
  const live = new Set();
  if (S) for (const it of S.items) {
    if (it.type !== 'quiz' && it.type !== 'math' && it.type !== 'branch') continue;
    if (it.z < cz - 1 || it.z - cz > 70) continue;
    live.add(it);
    let g = gateObjs.get(it); if (!g) { g = gateGroup(it); gateObjs.set(it, g); }
    g.position.z = -it.z;
    if (it.type === 'quiz' && it.done) g.userData.lanes.forEach((l, i) => { const ok = i === it.correct; l.glass.material.color.set(ok ? 0x58cc02 : 0xff4b4b); l.glass.material.emissive.set(ok ? 0x58cc02 : 0xff4b4b); });
  }
  for (const [it, g] of gateObjs) if (!live.has(it)) { scene.remove(g); gateObjs.delete(it); }
  // shadow camera follows the batch
  const fz = S ? S.dist : cz + 6;
  sun.target.position.set(S ? S.x : 0, 0, -fz - 4); sun.position.copy(sun.target.position).addScaledVector(SUN, 30);
  renderer.render(scene, cam);
}

window.R3D = { on: true, frame };
window.__r3on = true;

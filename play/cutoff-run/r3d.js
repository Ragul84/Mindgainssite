// Cut-Off Run 3D world renderer (stage 1: road, scenery, the batch, gate arches).
//
// The 2D game keeps all its logic and keeps drawing labels, numbers and effects on its own canvas,
// which now sits transparently on top of this one. The camera here reproduces the 2D projection
// exactly (P(): screen = centre + (x - camX) * F / dz, horizon at HOR), so a label the 2D code
// places at a gate lands on the 3D gate. Game coordinates map straight across: X = x, Y = y, Z = -z.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { stage2 } from './r3d-stage2.js?v=3';
import { stage3 } from './r3d-stage3.js?v=4';
import { makeRegions } from './r3d-regions.js?v=1';
import { makeCity, CITY } from './r3d-city.js?v=1';

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
scene.fog = new THREE.Fog(CITY.fog, 30, 250);
const cam = new THREE.PerspectiveCamera();
const K = 0.45; // the art-test models were built at ~2.2x game scale

const mat = (c, r = .8, extra = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: r, ...extra });

// ---------------------------------------------------------------- sky + light (follow the camera)
const SUN = new THREE.Vector3(.45, .55, -.7).normalize();
const sky = new THREE.Mesh(new THREE.SphereGeometry(250, 32, 16), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { uSun: { value: SUN }, uTop: { value: new THREE.Color(0x3a8fe0) }, uHz: { value: new THREE.Color(0xd6ecfb) } },
  vertexShader: 'varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: 'uniform vec3 uSun;uniform vec3 uTop;uniform vec3 uHz;varying vec3 d;void main(){float y=d.y;vec3 top=uTop,hz=uHz;vec3 c=mix(hz,top,pow(smoothstep(0.,.6,y),.8));float s=max(dot(normalize(d),uSun),0.);c+=vec3(1.,.93,.75)*(pow(s,80.)*.9+pow(s,6.)*.12);gl_FragColor=vec4(c,1.);}',
}));
sky.renderOrder = -1; scene.add(sky);
scene.add(new THREE.HemisphereLight(0xa9bfff, 0x3a3048, 1.1));
const sun = new THREE.DirectionalLight(0xffd2a8, 2.0);
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
grass.rotation.x = -Math.PI / 2; grass.position.y = -.01; grass.receiveShadow = true; grass.visible = false; scene.add(grass);
const city = makeCity({ scene, mat });
const roadT = noiseTex('#efd9ae', ['#e6cc9a', '#f6e4c0', '#e9d2a4'], 600, 512, true); const ROAD_TILE = 4; roadT.repeat.set(1, LEN / ROAD_TILE);
const road = new THREE.Mesh(new THREE.PlaneGeometry(4, LEN), new THREE.MeshStandardMaterial({ map: roadT, roughness: .95 }));
road.rotation.x = -Math.PI / 2; road.receiveShadow = true; scene.add(road);
const kerbMat = mat(0xffffff, .5);
const kerbs = [-1, 1].map((sx) => { const k = new THREE.Mesh(new RoundedBoxGeometry(.22, .1, LEN, 2, .03), kerbMat); k.position.set(sx * 2.08, .04, 0); k.receiveShadow = true; scene.add(k); return k; });

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
const REGIONS = makeRegions({ mat, tree, palm, house, flowers });
let pool = [], regionKey = null;
function retex(tex, cols, dashes) {
  const fresh = noiseTex(cols[0], cols.slice(1), dashes ? 600 : 900, 512, dashes);
  tex.image = fresh.image; tex.needsUpdate = true;
}
function setRegion(k) {
  const R = REGIONS[k] || REGIONS.village; regionKey = k;
  for (const o of pool) scene.remove(o);
  pool = [];
  const bag = []; R.props.forEach((p, idx) => { for (let w = 0; w < p[1]; w++) bag.push(idx); });
  for (let i = 0; i < SLOTS * 2; i++) {
    const side = i % 2 ? 1 : -1, h = h32(i * 7 + 3), [build, , dx, sc] = R.props[bag[h % bag.length]];
    const obj = build(h >>> 3); obj.scale.multiplyScalar(sc);
    obj.traverse((m) => { if (m.isMesh) m.castShadow = true; });
    obj.userData = { side, off: (h % 100) / 100 * SLOT * .6, dx: dx + ((h >>> 5) % 3) * .35 };
    obj.rotation.y = (side < 0 ? .45 : -.45) + (((h >>> 7) % 5) - 2) * .08;
    pool.push(obj);
  }
  sky.material.uniforms.uTop.value.set(R.sky[0]); sky.material.uniforms.uHz.value.set(R.sky[1]);
  // the flyover keeps one dusk look across chapters
  sky.material.uniforms.uTop.value.set(CITY.skyTop); sky.material.uniforms.uHz.value.set(CITY.skyHz);
  scene.fog.color.set(CITY.fog);
  retex(roadT, ['#4a5068', '#525a74', '#454b62', '#4e566e'], true);
  kerbMat.color.set(0xe8ecf4);
}
setRegion('village');

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
const greyShirt = mat(0xb9c0cc, .7), greyPants = mat(0x8a93a3, .7), saffronBag = mat(0xff8a1f, .5);
// chibi students: big head, short body, own shirt colour, braid or tuft, schoolbag. Same hooks as before:
// limbs = [legL, legR, armL, armR], shirtParts (recoloured for rival batches), bag.
const SHIRTS = [0xffffff, 0xf4d35e, 0x7cc6fe, 0xff8fa3, 0xb8e986, 0xffb26b].map((c) => mat(c, .6));
const PANTS = [0x2b3a67, 0x3d405b, 0x22223b].map((c) => mat(c, .7));
const geoC = {
  leg: new THREE.CapsuleGeometry(.11, .26, 3, 8), shoe: new RoundedBoxGeometry(.2, .13, .32, 2, .06), body: new RoundedBoxGeometry(.5, .5, .34, 3, .14),
  skirt: new THREE.CylinderGeometry(.2, .32, .26, 14), bag: new RoundedBoxGeometry(.42, .44, .2, 2, .08), flap: new RoundedBoxGeometry(.38, .16, .06, 2, .03),
  sleeve: new THREE.CapsuleGeometry(.09, .12, 3, 8), hand: new THREE.SphereGeometry(.085, 10, 8), head: new THREE.SphereGeometry(.3, 22, 16),
  ear: new THREE.SphereGeometry(.07, 8, 6), cap: new THREE.SphereGeometry(.32, 22, 12, 0, Math.PI * 2, 0, Math.PI * .5), braid: new THREE.CapsuleGeometry(.08, .4, 3, 8),
  bow: new THREE.SphereGeometry(.07, 8, 6), tuft: new THREE.ConeGeometry(.12, .2, 7),
};
const shoeM = mat(0xf5f5f5, .5), flapM = mat(0xffffff, .5), bowM = mat(0xff4d6d, .4);
const HAIRL = [0x4a2e1c, 0x5a3622, 0x3a2416].map((c) => mat(c, .3));
function student(i, grey = false, lead = false) {
  const g = new THREE.Group(), skin = M.skin[i % SKIN.length], hairM = HAIRL[i % 3], girl = i % 2 === 1, limbs = [];
  const SHIRT = grey ? greyShirt : SHIRTS[i % SHIRTS.length], PANT = grey ? greyPants : PANTS[i % 3];
  const sh = (m) => { m.castShadow = true; return m; };
  for (const sx of [-1, 1]) {
    const leg = new THREE.Group(); leg.position.set(sx * .13, .5, 0);
    const l = sh(new THREE.Mesh(geoC.leg, girl && !grey ? skin : PANT)); l.position.y = -.2; leg.add(l);
    const s = new THREE.Mesh(geoC.shoe, shoeM); s.position.set(0, -.42, -.05); leg.add(s);
    g.add(leg); limbs.push(leg);
  }
  const body = sh(new THREE.Mesh(geoC.body, SHIRT)); body.position.y = .76; g.add(body);
  if (girl) { const sk = new THREE.Mesh(geoC.skirt, PANT); sk.position.y = .5; g.add(sk); }
  const bag = sh(new THREE.Mesh(geoC.bag, lead ? saffronBag : grey ? greyPants : M.bags[i % M.bags.length])); bag.position.set(0, .82, .25); g.add(bag);
  const flap = new THREE.Mesh(geoC.flap, flapM); flap.position.set(0, .72, .36); g.add(flap);
  const sleeves = [];
  for (const sx of [-1, 1]) {
    const arm = new THREE.Group(); arm.position.set(sx * .3, .95, 0);
    const sl = new THREE.Mesh(geoC.sleeve, SHIRT); sl.position.y = -.08; arm.add(sl); sleeves.push(sl);
    const h = new THREE.Mesh(geoC.hand, skin); h.position.y = -.26; arm.add(h);
    arm.rotation.z = sx * .18; g.add(arm); limbs.push(arm);
  }
  const head = sh(new THREE.Mesh(geoC.head, skin)); head.position.y = 1.3; g.add(head);
  for (const sx of [-1, 1]) { const e = new THREE.Mesh(geoC.ear, skin); e.position.set(sx * .3, 1.28, 0); g.add(e); }
  const cap = new THREE.Mesh(geoC.cap, hairM); cap.position.y = 1.33; cap.rotation.x = .3; g.add(cap);
  if (girl) { const br = new THREE.Mesh(geoC.braid, hairM); br.position.set(0, 1.0, .28); br.rotation.x = .35; g.add(br); const bw = new THREE.Mesh(geoC.bow, bowM); bw.position.set(0, 1.22, .33); g.add(bw); }
  else if (i % 4 === 0) { const t = new THREE.Mesh(geoC.tuft, hairM); t.position.set(.05, 1.66, -.05); t.rotation.z = -.4; g.add(t); }
  g.scale.setScalar(K * 1.25); g.userData = { limbs, shirtParts: [body, ...sleeves], bag };
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
const stage2Update = stage2({ scene, mat, student, K });
const stage3Update = stage3({ scene, mat, student, K });

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
  city.update(cz);
  roadT.offset.y = (mid % ROAD_TILE) / ROAD_TILE; grassT.offset.y = (mid % 6) / 6;
  // scenery: slot index from the camera so props stream past
  const rk = (S && S.story && S.story.ch && S.story.ch.k) || 'village'; if (rk !== regionKey) setRegion(rk);
  const first = Math.floor(cz / SLOT);
  for (let i = 0; i < pool.length; i++) {
    const p = pool[i], s = Math.floor(i / 2), slot = first + ((s - first) % SLOTS + SLOTS) % SLOTS;
    p.position.set(p.userData.side * p.userData.dx, 0, -(slot * SLOT + p.userData.off));
    p.visible = (window.__r3props || 1) >= 1 || (s % 2 === 0);
  }
  // batch
  const ms = S ? S.members : [], t = S ? S.t : 0, running = S && (S.phase === 'run' || S.phase === 'climb');
  ensureCrowd(ms.length);
  for (let i = 0; i < crowd.length; i++) {
    const st = crowd[i], m = ms[i];
    st.visible = !!m && i < (window.__r3crowd || 36); if (!st.visible) continue;
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
  stage2Update(S, miga);
  stage3Update(S);
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
  if (!readySent) { readySent = true; dispatchEvent(new Event('r3d-ready')); }
  perf();
}
let readySent = false;

// ---------------------------------------------------------------- speed: three quality tiers, then 2D
// Every 2 s of play we look at the average frame time. Too slow steps down a tier (sharpness, shadows,
// scenery, crowd size); still too slow on the lowest tier hands the race back to 2D for good on this
// device. Fast enough for a while steps back up one tier.
let tier = -1, acc = 0, nF = 0, lastT = 0, goodRuns = 0, slowAtLowest = 0;
const TIERS = [
  { dpr: Math.min(2, devicePixelRatio || 1), shadow: 1024, shadows: true, props: 1, crowd: 36 },
  { dpr: Math.min(1.5, devicePixelRatio || 1), shadow: 512, shadows: true, props: 1, crowd: 28 },
  { dpr: 1, shadow: 512, shadows: false, props: .5, crowd: 20 },
];
function setTier(t) {
  tier = t; const T = TIERS[t];
  renderer.setPixelRatio(T.dpr); lastW = 0;
  renderer.shadowMap.enabled = T.shadows; sun.castShadow = T.shadows;
  if (T.shadows) { sun.shadow.mapSize.set(T.shadow, T.shadow); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; } }
  scene.traverse((o) => { if (o.material) { const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach((m) => (m.needsUpdate = true)); } });
  window.__r3crowd = T.crowd; window.__r3props = T.props;
  try { localStorage.setItem('cor_r3d_tier', String(t)); } catch (e) {}
}
setTier(Math.min(2, +(localStorage.getItem('cor_r3d_tier') || 0)));
function perf() {
  const now = performance.now(), dt = lastT ? now - lastT : 16; lastT = now;
  if (dt > 250) return;                         // tab was hidden or paused: not a real frame
  acc += dt; nF++;
  if (acc < 2000) return;
  const avg = acc / nF; acc = 0; nF = 0;
  if (avg > 30) {                              // under ~33 fps
    goodRuns = 0;
    if (tier < TIERS.length - 1) setTier(tier + 1);
    else if (avg > 40 && ++slowAtLowest >= 2) fallBack('slow');
  } else if (avg < 19 && tier > 0 && ++goodRuns >= 5) { goodRuns = 0; setTier(tier - 1); }
  else slowAtLowest = 0;
}
function fallBack(why) {
  window.__r3on = false; window.R3D = null;
  cv.style.display = 'none';
  try { localStorage.setItem('cor_r3d', 'fail'); } catch (e) {}
  if (window.track) try { track('r3d_fallback', { why }); } catch (e) {}
  renderer.dispose();
}
cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); fallBack('context'); });

window.R3D = { on: true, frame };
window.__r3on = true;
if (window.camRig) window.camRig(7.5, 10);   // flyover: higher and further back than the 2D view

// "Shades Flip": the racer flicks a pair of sunglasses into the air, they spin, and land on the face
// with a sparkle and a chin-up nod. One self-contained stage (its own small renderer) so NationLap
// (1st-place celebration) and the theatre (first visit) can both play it over whatever is on screen.
import * as THREE from 'three';
import { createKartModel } from './models.js';

function makeShades() {
  const g = new THREE.Group();
  const lens = new THREE.MeshPhysicalMaterial({ color: 0x0b0b10, metalness: .3, roughness: .08, clearcoat: 1, clearcoatRoughness: .05 });
  const frame = new THREE.MeshStandardMaterial({ color: 0xffd23f, metalness: .8, roughness: .25 });
  for (const sx of [-1, 1]) {
    const l = new THREE.Mesh(new THREE.BoxGeometry(.26, .15, .03), lens); l.position.x = sx * .155; g.add(l);
    const rim = new THREE.Mesh(new THREE.BoxGeometry(.28, .025, .04), frame); rim.position.set(sx * .155, .085, 0); g.add(rim);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(.02, .02, .3), frame); arm.position.set(sx * .29, .07, -.15); g.add(arm);
  }
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(.07, .025, .03), frame); bridge.position.y = .05; g.add(bridge);
  // a glint that sweeps across the lenses once they land
  const glint = new THREE.Mesh(new THREE.PlaneGeometry(.05, .2), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
  glint.position.z = .02; glint.rotation.z = -.5; g.add(glint); g.userData.glint = glint;
  return g;
}

function ching() {
  try {
    const A = new (window.AudioContext || window.webkitAudioContext)(), t = A.currentTime;
    for (const [f, d] of [[1568, 0], [2349, .06], [3136, .12]]) {
      const o = A.createOscillator(), v = A.createGain(); o.type = 'sine'; o.frequency.value = f;
      v.gain.setValueAtTime(0, t + d); v.gain.linearRampToValueAtTime(.12, t + d + .01); v.gain.exponentialRampToValueAtTime(.001, t + d + .5);
      o.connect(v).connect(A.destination); o.start(t + d); o.stop(t + d + .55);
    }
    setTimeout(() => A.close(), 1200);
  } catch (e) {}
}

const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3));

/**
 * Play the Shades Flip over the page. Returns a promise that resolves when it is done (about 3 s,
 * or on tap). opts: { title, sub, ticket } for the caption under the racer.
 */
export function playShadesFlip(character, opts = {}) {
  return new Promise((resolve) => {
    const wrap = document.createElement('div');
    wrap.className = 'shf';
    wrap.innerHTML = `<style>
      .shf{position:fixed;inset:0;z-index:300;display:grid;place-items:center;background:radial-gradient(60% 50% at 50% 42%,rgba(255,210,63,.28),rgba(8,8,20,.86));animation:shfIn .25s ease-out;cursor:pointer}
      .shf.out{animation:shfOut .35s ease-in forwards}@keyframes shfIn{from{opacity:0}}@keyframes shfOut{to{opacity:0}}
      .shf canvas{width:min(92vw,520px)!important;height:min(92vw,520px)!important}
      .shf-cap{position:absolute;left:0;right:0;top:calc(50% + min(46vw,260px) - 40px);text-align:center;color:#fff;pointer-events:none}
      .shf-t{font:900 clamp(34px,9vw,58px)/1 "Lilita One",Impact,system-ui;letter-spacing:.02em;color:#ffd23f;text-shadow:0 4px 0 #8a5a00,0 0 30px rgba(255,210,63,.6);opacity:0;transform:scale(2.4) rotate(-6deg)}
      .shf-t.on{animation:shfStamp .35s cubic-bezier(.2,1.6,.4,1) forwards}@keyframes shfStamp{to{opacity:1;transform:scale(1) rotate(-4deg)}}
      .shf-s{margin-top:8px;font:800 14px/1.4 system-ui;color:#ffe9b0;opacity:0;transition:opacity .4s}.shf-s.on{opacity:1}
      .shf-k{display:inline-block;margin-top:10px;padding:6px 14px;border:2px dashed #ffd23f;border-radius:10px;font:900 13px system-ui;letter-spacing:.14em;color:#ffd23f;opacity:0;transition:opacity .4s .2s}.shf-k.on{opacity:1}
    </style><div class="shf-cap"><div class="shf-t">${opts.title || 'STYLE!'}</div><div class="shf-s">${opts.sub || ''}</div>${opts.ticket ? `<div class="shf-k">${opts.ticket}</div>` : ''}</div>`;
    document.body.appendChild(wrap);

    const S = Math.min(innerWidth * .92, 520);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(S, S); renderer.setClearColor(0, 0);
    wrap.prepend(renderer.domElement);
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, .1, 50);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x334, 1.6));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(2, 4, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffd23f, 2.5); rim.position.set(-3, 2, -3); scene.add(rim);

    // just the driver from the player's own kart, standing and facing us
    const kart = createKartModel(character), driver = kart.parts.driver, head = kart.parts.head;
    driver.parent && driver.parent.remove(driver);
    driver.position.set(0, 0, 0); driver.rotation.set(0, 0, 0);
    const stage = new THREE.Group(); stage.add(driver); scene.add(stage);
    stage.updateMatrixWorld(true);
    const hb = new THREE.Box3().setFromObject(head), hc = hb.getCenter(new THREE.Vector3()), hs = hb.getSize(new THREE.Vector3());
    const db = new THREE.Box3().setFromObject(driver), dc = db.getCenter(new THREE.Vector3()), dsz = db.getSize(new THREE.Vector3());
    cam.position.set(dc.x, hc.y - dsz.y * .05, hc.z + dsz.y * 3.1); cam.lookAt(dc.x, hc.y - dsz.y * .18, dc.z);

    const shades = makeShades(), sc = hs.x / .58; shades.scale.setScalar(sc); scene.add(shades);
    const face = new THREE.Vector3(hc.x, hc.y - hs.y * .04, hb.max.z + .01 * sc);
    const hand = new THREE.Vector3(hc.x + hs.x * .9, hc.y - hs.y * .9, hc.z + hs.z * .6);
    const peak = new THREE.Vector3(hc.x + hs.x * .2, hc.y + hs.y * 2.6, hc.z + hs.z * .8);
    const sparks = [];
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xfff1a8, transparent: true });
    const headRot = head.rotation.x;

    let t0 = performance.now(), done = false, landed = false, raf = 0;
    const T = 3.0;
    const end = () => { if (done) return; done = true; wrap.classList.add('out'); setTimeout(() => { cancelAnimationFrame(raf); renderer.dispose(); wrap.remove(); resolve(); }, 340); };
    wrap.addEventListener('click', end);
    (function loop(now) {
      const t = (now - t0) / 1000;
      stage.rotation.y = Math.sin(t * 1.3) * .12;
      if (t < .35) { const k = ease(t / .35); shades.position.copy(hand); shades.scale.setScalar(sc * k); shades.rotation.set(0, 0, -.6); }
      else if (t < 1.3) { // flick up, spin three times, drop onto the face
        const k = (t - .35) / .95, a = k < .5 ? ease(k * 2) : 1, b = k < .5 ? 0 : ease((k - .5) * 2);
        shades.position.copy(hand).lerp(peak, a).lerp(face, b);
        shades.rotation.set(-Math.PI * 6 * ease(k), Math.sin(k * 9) * .3, -.6 * (1 - k)); shades.scale.setScalar(sc);
      } else {
        shades.position.copy(face); shades.rotation.set(head.rotation.x - headRot, 0, 0);
        if (!landed) { landed = true; ching(); wrap.querySelector('.shf-t').classList.add('on'); wrap.querySelector('.shf-s').classList.add('on'); wrap.querySelector('.shf-k')?.classList.add('on');
          for (let i = 0; i < 14; i++) { const m = new THREE.Mesh(new THREE.OctahedronGeometry(.03 * sc), sparkMat); m.position.copy(face); m.userData.v = new THREE.Vector3((Math.random() - .5) * 2.4, Math.random() * 1.8, (Math.random() - .2)).multiplyScalar(hs.x * 1.6); scene.add(m); sparks.push(m); } }
        const n = t - 1.3; head.rotation.x = headRot - .22 * Math.sin(Math.min(1, n / .45) * Math.PI); // chin-up nod
        shades.position.y = face.y + (head.rotation.x - headRot) * -hs.y * .3;
        const gl = shades.userData.glint; gl.material.opacity = n < .6 ? Math.sin(n / .6 * Math.PI) * .9 : 0; gl.position.x = -.3 + n / .6 * .6;
        for (const m of sparks) { m.position.addScaledVector(m.userData.v, 1 / 60); m.userData.v.y -= hs.x * .05; m.rotation.x += .2; m.material.opacity = Math.max(0, 1 - n / 1.2); }
      }
      renderer.render(scene, cam);
      if (t > T) return end();
      raf = requestAnimationFrame(loop);
    })(t0);
  });
}

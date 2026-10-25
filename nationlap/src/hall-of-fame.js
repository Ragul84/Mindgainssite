// Hall of Fame: today's India top 10 carved into a monument beside the starting grid.
//
// Billboards at speed are unreadable, but every race starts with the grid standing still and
// the camera looking straight down the road — so the names go there, where every player sits
// and reads them before every race. The point is the itch: "my name should be on that wall".
//
// Names come from ca_board (server-graded XP, see ca-score), never from the browser.
import * as THREE from 'three';

const RPC = 'https://yuntwerxahgmaoduxvqc.supabase.co/rest/v1/rpc/ca_board';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bnR3ZXJ4YWhnbWFvZHV4dnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTk4OTMsImV4cCI6MjA3MTM3NTg5M30.1mFUH9yp55uxN8n9tyRHLFbve36_kpaJs41nPU85S74';

let cached = null, cachedAt = 0;
export async function fetchToppers(period = 'today', lim = 10) {
  if (period === 'today' && cached && Date.now() - cachedAt < 60_000) return cached;
  try {
    const r = await fetch(RPC, {
      method: 'POST',
      headers: { apikey: ANON, authorization: 'Bearer ' + ANON, 'content-type': 'application/json' },
      body: JSON.stringify({ period, lim }),
    });
    const rows = r.ok ? await r.json() : [];
    if (period === 'today') { cached = rows; cachedAt = Date.now(); }
    return rows;
  } catch { return []; }
}

function drawWall(ctx, W, H, rows) {
  // carved stone
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#3b3f4a'); g.addColorStop(1, '#22252c');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#d4a93a'; ctx.lineWidth = 14; ctx.strokeRect(10, 10, W - 20, H - 20);
  ctx.strokeStyle = 'rgba(212,169,58,.45)'; ctx.lineWidth = 3; ctx.strokeRect(30, 30, W - 60, H - 60);

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffd34d';
  ctx.font = '900 64px Inter, system-ui, sans-serif';
  ctx.fillText('HALL OF FAME', W / 2, 92);
  ctx.fillStyle = '#e8e2cf';
  ctx.font = '700 30px Inter, system-ui, sans-serif';
  ctx.fillText("INDIA · TODAY'S CURRENT AFFAIRS TOP 10", W / 2, 146);

  if (!rows.length) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 46px Inter, system-ui, sans-serif';
    ctx.fillText('No names yet today.', W / 2, H / 2 + 10);
    ctx.fillStyle = '#ffd34d';
    ctx.font = '700 34px Inter, system-ui, sans-serif';
    ctx.fillText("Race today's affairs, sign in — the first name here could be yours.", W / 2, H / 2 + 80);
    return;
  }
  const top = 196, rowH = (H - top - 50) / 10;
  rows.slice(0, 10).forEach((r, i) => {
    const y = top + rowH * (i + 0.5);
    const medal = ['#ffd34d', '#d9dde3', '#e0965a'][i];
    ctx.textAlign = 'left';
    ctx.fillStyle = medal || '#9aa3b2';
    ctx.font = `900 ${i < 3 ? 46 : 38}px Inter, system-ui, sans-serif`;
    ctx.fillText(`#${r.rank ?? i + 1}`, 90, y);
    ctx.fillStyle = i < 3 ? '#ffffff' : '#e8e2cf';
    ctx.font = `800 ${i < 3 ? 46 : 38}px Inter, system-ui, sans-serif`;
    ctx.fillText(String(r.name || 'Aspirant').slice(0, 22), 210, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffd34d';
    ctx.font = `800 ${i < 3 ? 40 : 34}px Inter, system-ui, sans-serif`;
    ctx.fillText(`${r.xp} XP · ${r.accuracy}%`, W - 90, y);
  });
}

/** Builds the monument right of the grid, angled toward the cars. Fills in when names load. */
export function createHallOfFame(scene, track) {
  const group = new THREE.Group();
  group.name = 'HallOfFame';
  const disposables = [];

  const W = 1600, H = 1000;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  drawWall(ctx, W, H, []);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  disposables.push(tex);

  // A gantry over the road just ahead of the grid: dead centre in view on a portrait phone,
  // where anything at the roadside is cropped off.
  const t = 0.03;
  const p = track.getPointAt(t), tan = track.getTangentAt(t);
  const half = (track.roadWidth ?? 24) / 2;
  const holder = new THREE.Group();
  holder.position.set(p.x, p.y, p.z);
  holder.rotation.y = Math.atan2(-tan.x, -tan.z);

  const stone = new THREE.MeshStandardMaterial({ color: 0x4a4f5c, roughness: 0.85 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xd4a93a, metalness: 0.7, roughness: 0.35 });
  disposables.push(stone, gold);
  const slabW = half * 2 + 6, slabH = slabW * H / W;
  const clear = 7;                                   // karts pass underneath
  const yMid = clear + slabH / 2;
  const back = new THREE.Mesh(new THREE.BoxGeometry(slabW + 1.4, slabH + 1.4, 1.2), stone); back.position.set(0, yMid, -0.7);
  const cap = new THREE.Mesh(new THREE.BoxGeometry(slabW + 2.6, 0.8, 2.2), gold); cap.position.set(0, clear + slabH + 1.1, -0.5);
  const pillarGeo = new THREE.BoxGeometry(2.2, clear + slabH + 1.5, 2.2);
  const lp = new THREE.Mesh(pillarGeo, stone); lp.position.set(-(slabW / 2 + 1.2), (clear + slabH + 1.5) / 2, -0.7);
  const rp = new THREE.Mesh(pillarGeo, stone); rp.position.set(slabW / 2 + 1.2, (clear + slabH + 1.5) / 2, -0.7);
  const faceMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
  disposables.push(faceMat, pillarGeo);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(slabW, slabH), faceMat); face.position.set(0, yMid, 0.01);
  for (const m of [back, cap, face]) { disposables.push(m.geometry); holder.add(m); }
  holder.add(lp, rp);
  group.add(holder);
  scene.add(group);

  let alive = true;
  fetchToppers('today', 10).then((rows) => {
    if (!alive) return;
    drawWall(ctx, W, H, rows);
    tex.needsUpdate = true;
  });

  return {
    group,
    dispose() {
      alive = false;
      scene.remove(group);
      for (const d of disposables) d.dispose?.();
    },
  };
}

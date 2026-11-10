import fs from 'node:fs';
const env = Object.fromEntries(fs.readFileSync('C:/mindwhite/.env', 'utf8').split(/\r?\n/).filter(l => /^\s*[A-Z_]+=/.test(l)).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; }));
const r = async (...a) => { const res = await fetch(env.UPSTASH_REDIS_REST_URL, { method: 'POST', headers: { Authorization: 'Bearer ' + env.UPSTASH_REDIS_REST_TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(a) }); const j = await res.json(); if (j.error) throw new Error(j.error); return j.result; };
const B = JSON.parse(fs.readFileSync('C:/mindgains-waitlist/scripts/quiz-review/redis-backup-samacheer-2026-11-11.json', 'utf8'));
let before = 0, after = 0, markers = 0, mism = 0, degen = 0, bad = 0, mcqFromMatch = 0;
for (const k of Object.keys(B)) {
  before += B[k].length; const L = await r('LRANGE', k, 0, -1); after += L.length;
  for (const raw of L) { if (raw.startsWith('__mg_remove__')) { markers++; continue; } let o; try { o = JSON.parse(raw); } catch { bad++; continue; }
    if (String(o.question_type).toLowerCase() === 'match') { const t = String(o.question || o.question_text || ''); const P = (o.pairs || []).filter(p => p && p.left && p.right);
      if (!/\bmatch|\bpair|பொருத்து/i.test(t)) mism++;
      else if (P.length) { const R = P.map(p => String(p.right).trim().toLowerCase()); if (P.length < 2 || new Set(R).size === 1) degen++; } } }
}
console.log({ before, after, removed: before - after, leftoverMarkers: markers, unparsable: bad, mismatchedLeft: mism, degenerateLeft: degen });

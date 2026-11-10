// Verify rebuilt match questions with the game's own parser (play/cutoff-run/index.html matchSpec):
// every rebuilt question must parse, and every parsed pair must equal the pair written in rebuild/<set>.json.
// Usage: node scripts/quiz-review/mverify.mjs
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', '..');
const html = fs.readFileSync(path.join(ROOT, 'play/cutoff-run/index.html'), 'utf8');
const grab = (a, b) => { const i = html.indexOf(a), j = html.indexOf(b, i); if (i < 0 || j < 0) throw new Error('missing ' + a); return html.slice(i, j); };
const { matchSpec } = new Function(grab('// ---------- Match the following', '\nlet MS=null') + '\nreturn {matchSpec};')();
let ok = 0, bad = 0;
for (const f of fs.readdirSync(path.join(ROOT, 'scripts/quiz-review/rebuild'))) {
  const rb = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/quiz-review/rebuild', f), 'utf8'));
  const dec = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/quiz-review/decisions', f), 'utf8'));
  const set = f.slice(0, -5).replace(/__/g, '/');
  const orig = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/quiz-data', set + '.json'), 'utf8')).questions;
  for (const [i, spec] of Object.entries(rb)) {
    if (spec === 'retire') continue;
    const q = dec.fix[i]; const m = matchSpec({ q: q.question, ans: q.options, correct: q.answer_index });
    const want = []; spec.L.forEach((l, k) => { if (l != null) want.push([l.trim().replace(/\.$/,''), String((spec.R || orig[i].options)[k]).trim().replace(/\.$/,'')]); });
    const got = m ? m.L.map((x, k) => [x.v, m.R[m.key[k]].v]) : null;
    if (got && JSON.stringify(got) === JSON.stringify(want)) ok++;
    else { bad++; console.log('FAIL', set, i, '\n  want', JSON.stringify(want), '\n  got ', JSON.stringify(got), '\n  q   ', q.question); }
  }
}
console.log('verified', ok, 'failed', bad);

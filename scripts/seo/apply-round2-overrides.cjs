#!/usr/bin/env node
/**
 * apply-round2-overrides.cjs
 *
 * 1. Reads scripts/seo/round2-apply-plan.csv, keeps EDIT rows with priority A/B/C.
 * 2. Writes scripts/seo/round2-title-overrides.json  (route -> {title,h1,description}).
 * 3. Patches each route's index.html in place: <title>, <meta description>,
 *    og:title, og:description, twitter:title, twitter:description, first <h1>.
 *
 * Idempotent — safe to re-run. Metadata only; no structural/route/link/canonical change.
 * Run with:  node scripts/seo/apply-round2-overrides.cjs [--dry]
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const DRY = process.argv.includes('--dry');

function parseCsv(t) {
  const R = []; let r = [], c = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const x = t[i];
    if (q) { if (x === '"') { if (t[i + 1] === '"') { c += '"'; i++; } else q = false; } else c += x; }
    else { if (x === '"') q = true; else if (x === ',') { r.push(c); c = ''; } else if (x === '\n') { r.push(c); R.push(r); r = []; c = ''; } else if (x === '\r') { } else c += x; }
  }
  if (c !== '' || r.length) { r.push(c); R.push(r); }
  return R;
}
const attrEsc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const textEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const rows = parseCsv(fs.readFileSync(path.join(ROOT, 'scripts/seo/round2-apply-plan.csv'), 'utf8'));
const H = rows.shift();
const gi = n => H.indexOf(n);

const overrides = {};
for (const c of rows) {
  if (c[gi('action')] !== 'EDIT') continue;
  if (!['A', 'B', 'C'].includes(c[gi('priority')])) continue;
  const route = c[gi('route')];
  overrides[route] = {
    title: c[gi('new_title')].trim(),
    h1: c[gi('new_h1')].trim(),
    description: c[gi('new_meta_description')].trim(),
  };
}

fs.writeFileSync(
  path.join(ROOT, 'scripts/seo/round2-title-overrides.json'),
  JSON.stringify(overrides, null, 2) + '\n', 'utf8'
);
console.log('wrote round2-title-overrides.json —', Object.keys(overrides).length, 'routes');

let patched = 0, skipped = 0, missing = 0;
for (const [route, o] of Object.entries(overrides)) {
  const file = path.join(ROOT, route.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(file)) { console.warn('  MISSING', route); missing++; continue; }
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  const T = attrEsc(o.title), D = attrEsc(o.description), H1 = textEsc(o.h1);

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${textEsc(o.title)}</title>`);
  html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/i, `$1${D}$2`);
  html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/i, `$1${T}$2`);
  html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/i, `$1${D}$2`);
  html = html.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/i, `$1${T}$2`);
  html = html.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/i, `$1${D}$2`);
  // first <h1> only
  html = html.replace(/<h1([^>]*)>[\s\S]*?<\/h1>/i, `<h1$1>${H1}</h1>`);

  if (html === before) { skipped++; continue; }
  if (!DRY) fs.writeFileSync(file, html, 'utf8');
  patched++;
}
console.log(`${DRY ? '[dry-run] ' : ''}patched ${patched}, unchanged ${skipped}, missing ${missing}`);

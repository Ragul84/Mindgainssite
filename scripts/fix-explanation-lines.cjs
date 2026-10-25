// One-off: restore line breaks in static worked-example explanations (MG_STATIC_PREVIEW blocks)
// and make build-static-seo-content.cjs keep them. Usage: node fix-explanation-lines.cjs [--apply]
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), APPLY = process.argv.includes('--apply');
function esc(v) { return String(v ?? '').replace(/\s+/g, ' ').trim().replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function escLines(v) { return String(v ?? '').split(/\r?\n/).map(esc).filter(Boolean).join('<br>'); }
// 1. generator
const gen = path.join(ROOT, 'scripts', 'build-static-seo-content.cjs');
let g = fs.readFileSync(gen, 'utf8'); const g0 = g;
if (!g.includes('function escLines')) {
  g = g.replace(/(function esc\(value\) \{\r?\n[^\n]*\n\})/, `$1\nfunction escLines(value) {\n  return String(value ?? '').split(/\\r?\\n/).map(esc).filter(Boolean).join('<br>');\n}`);
  g = g.replace('<p><strong>Explanation:</strong> ${esc(q.explanation)}</p>', '<p><strong>Explanation:</strong> ${escLines(q.explanation)}</p>');
}
console.log('generator', g !== g0 ? 'patched' : 'unchanged', g.includes('${escLines(q.explanation)}'));
if (APPLY && g !== g0) fs.writeFileSync(gen, g);
// 2. built pages
let pages = 0, fixes = 0; const jcache = {};
function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (['node_modules', '.git', '.wrangler', 'nationlap', 'quiz-data'].includes(e.name)) continue; const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name === 'index.html') page(p); } }
function page(p) {
  let h = fs.readFileSync(p, 'utf8'); if (!h.includes('MG_STATIC_PREVIEW')) return;
  const m = h.match(/data-quiz-src="\/assets\/quiz-data\/([^"]+\.json)"/); if (!m) return;
  const jf = path.join(ROOT, 'assets', 'quiz-data', m[1]); if (!fs.existsSync(jf)) return;
  const qs = (jcache[jf] ||= JSON.parse(fs.readFileSync(jf, 'utf8')).questions || []); const h0 = h;
  for (const q of qs) { if (!q.explanation || !/\n/.test(q.explanation)) continue;
    const a = '<strong>Explanation:</strong> ' + esc(q.explanation) + '</p>', b = '<strong>Explanation:</strong> ' + escLines(q.explanation) + '</p>';
    if (a !== b && h.includes(a)) { h = h.split(a).join(b); fixes++; } }
  if (h !== h0) { pages++; if (APPLY) fs.writeFileSync(p, h); }
}
walk(ROOT); console.log('pages', pages, 'explanations', fixes, APPLY ? 'APPLIED' : 'dry run');

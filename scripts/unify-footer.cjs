/**
 * Replaces every page's footer with one shared, compact footer (assets/site-footer.css).
 *
 * Why: the site had at least five different footers. The homepage one stacked every link on
 * its own line (~970px tall on a phone), others linked to /terms.html which does not exist.
 *
 *   node scripts/unify-footer.cjs [--dry]
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry');
const SKIP = new Set(['node_modules', '.git', '.wrangler', 'scripts', 'assets', 'content', 'nationlap', 'current-affairs', 'worker', 'auth']);
const YEAR = new Date().getFullYear();

const FOOTER = `<footer class="mg-foot">
  <div class="mg-foot-in">
    <div class="mg-foot-brand">
      <a href="/"><img src="/assets/icons/mindgains-logo-192.png" alt="" width="28" height="28" loading="lazy">MindGains</a>
      <p>Textbook-aware practice for India's competitive exams. Daily current affairs, quizzes and NationLap.</p>
    </div>
    <nav class="mg-foot-exams" aria-label="Exams"><h4>Exams</h4><ul>
      <li><a href="/upsc/">UPSC</a></li><li><a href="/tnpsc/">TNPSC</a></li><li><a href="/ssc/">SSC</a></li>
      <li><a href="/rrb/">RRB</a></li><li><a href="/ncert/">NCERT</a></li><li><a href="/samacheer/">Samacheer</a></li>
    </ul></nav>
    <nav aria-label="Practice"><h4>Practice</h4><ul>
      <li><a href="/nationlap/?affairs=1">Current affairs</a></li><li><a href="/quiz/">Quiz Hub</a></li>
      <li><a href="/nationlap/">NationLap</a></li><li><a href="/editorial/">Editorial</a></li>
    </ul></nav>
    <nav aria-label="Company"><h4>Company</h4><ul>
      <li><a href="/about/">About MindGains</a></li><li><a href="/get/">Get the app</a></li><li><a href="/blog/">Blog</a></li>
      <li><a href="/privacy/">Privacy</a></li><li><a href="/data-deletion/">Delete my data</a></li>
    </ul></nav>
  </div>
  <div class="mg-foot-legal"><span>© ${YEAR} MindGains Labs Private Limited</span><a href="/privacy/">Privacy</a><a href="/data-deletion/">Data deletion</a><a href="/sitemap.xml">Sitemap</a><a href="https://www.instagram.com/mindgains_ai/" rel="me noopener" target="_blank">Instagram</a><a href="https://www.linkedin.com/company/mindgains-ai" rel="me noopener" target="_blank">LinkedIn</a><a href="https://x.com/MindgainsIndia" rel="me noopener" target="_blank">X</a></div>
</footer>`;
const LINK = '<link rel="stylesheet" href="/assets/site-footer.css?v=1">';

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(p, out); } else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let changed = 0, noFooter = [];
for (const f of walk(ROOT)) {
  let s = fs.readFileSync(f, 'utf8');
  const a = s.search(/<footer[\s>]/i);
  if (a < 0) {
    const rel = path.relative(ROOT, f).split(path.sep).join('/');
    // app-like pages (chat, sign-up, waitlist form) stay footer-free; articles get one
    if (/^(chat|get)\/|^waitlist\.html$/.test(rel) || !/<\/body>/i.test(s)) { noFooter.push(rel); continue; }
    s = s.replace(/<\/body>/i, FOOTER + '\n</body>');
    if (!s.includes('/assets/site-footer.css')) s = s.replace(/<\/head>/i, `  ${LINK}\n</head>`);
    if (!DRY) fs.writeFileSync(f, s);
    changed++;
    continue;
  }
  // outermost footer: match nested <footer> tags so an inner one does not end it early
  const re = /<\/?footer[\s>]/gi; re.lastIndex = a;
  let depth = 0, end = -1, m;
  while ((m = re.exec(s))) {
    if (m[0][1] === '/') { if (--depth === 0) { end = s.indexOf('>', m.index) + 1; break; } } else depth++;
  }
  if (end < 0) continue;
  s = s.slice(0, a) + FOOTER + s.slice(end);
  if (!s.includes('/assets/site-footer.css')) s = s.replace(/<\/head>/i, `  ${LINK}\n</head>`);
  if (!DRY) fs.writeFileSync(f, s);
  changed++;
}
console.log(`${DRY ? '[dry] ' : ''}footers replaced: ${changed}; pages without a footer: ${noFooter.length}`);
if (noFooter.length) console.log(noFooter.slice(0, 15).join('\n'));

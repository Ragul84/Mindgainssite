/**
 * Search Console coverage fix (2026-10-06).
 *
 * Why: Google indexed 489 pages and refused ~625. The causes were on our side:
 *   1. 376 /quiz/<x>/ pages duplicated /<x>/ word for word, each claiming to be canonical,
 *      so Google picked one and dropped the other ("Google chose different canonical").
 *   2. 322 thin /mcq-questions/ pages, one template, titles without the subject
 *      ("Class11 MCQ Questions for Samacheer" on 11 subjects) - "Discovered, not indexed".
 *   3. A handful of links and canonicals that pointed at redirects.
 *
 * What it does:
 *   1. /quiz/<x>/ copies point their canonical (and og:url) at /<x>/; the sitemap builder
 *      already skips pages whose canonical is elsewhere.
 *   2. /mcq-questions/ pages fold into their hub: 301 in _redirects, directory removed,
 *      internal links rewritten to the hub.
 *   3. Links to the redirected SSC English pages go straight to their targets.
 *
 *   node scripts/fix-index-coverage.cjs [--dry]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://mindgains.ai';
const DRY = process.argv.includes('--dry');
const SKIP = new Set(['node_modules', '.git', '.wrangler', 'scripts', 'assets', 'content', 'nationlap', 'current-affairs']);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(p, out); }
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}
const urlOf = (file) => '/' + path.relative(ROOT, file).split(path.sep).join('/').replace(/index\.html$/, '');
const write = (file, s) => { if (!DRY) fs.writeFileSync(file, s); };

// 1. quiz mirrors
let mirrors = 0;
for (const file of walk(path.join(ROOT, 'quiz'))) {
  const url = urlOf(file);                       // /quiz/ncert/polity/class7/
  const hub = url.replace(/^\/quiz\//, '/');     // /ncert/polity/class7/
  if (hub === '/' || !fs.existsSync(path.join(ROOT, hub, 'index.html'))) continue;
  let s = fs.readFileSync(file, 'utf8');
  const before = s;
  s = s.replace(/(<link[^>]+rel=["']canonical["'][^>]+href=["'])[^"']+(["'])/i, `$1${ORIGIN}${hub}$2`);
  s = s.replace(/(<meta[^>]+property=["']og:url["'][^>]+content=["'])[^"']+(["'])/i, `$1${ORIGIN}${hub}$2`);
  if (s !== before) { mirrors++; write(file, s); }
}

// 2. mcq-questions -> hub
const mcqDirs = [];
(function find(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.name === 'mcq-questions' && fs.existsSync(path.join(p, 'index.html'))) mcqDirs.push(p);
    else find(p);
  }
})(ROOT);
const mcqMap = new Map(); // /x/mcq-questions/ -> /x/
for (const d of mcqDirs) {
  const url = urlOf(path.join(d, 'index.html'));
  const hub = url.replace(/mcq-questions\/$/, '');
  if (fs.existsSync(path.join(ROOT, hub, 'index.html'))) mcqMap.set(url, hub);
}
const redirectTargets = new Map([
  ['/ssc/english/error-spotting/', '/ssc/english/grammar/'],
  ['/ssc/english/sentence-correction/', '/ssc/english/grammar/'],
  ['/ssc/english/fill-blanks/', '/ssc/english/grammar/'],
  ['/ssc/english/cloze-test/', '/ssc/english/grammar/'],
  ['/ssc/english/idioms-phrases/', '/ssc/english/vocabulary/'],
  ['/ssc/english/one-word/', '/ssc/english/vocabulary/'],
  ['/ssc/english/synonyms-antonyms/', '/ssc/english/vocabulary/'],
  ['/upsc/csat-english/comprehension/', '/upsc/csat-english/'],
  ['/upsc/csat-english/logical-deduction/', '/upsc/csat-english/'],
]);
const linkMap = new Map([...mcqMap, ...redirectTargets]);

let linkFiles = 0, links = 0;
for (const file of walk(ROOT)) {
  if (mcqDirs.some((d) => file.startsWith(d + path.sep))) continue;
  let s = fs.readFileSync(file, 'utf8');
  let n = 0;
  s = s.replace(/href="(https:\/\/mindgains\.ai)?(\/[^"#?]*)"/g, (m, o, h) => {
    const k = h.endsWith('/') ? h : h + '/';
    if (linkMap.has(k)) { n++; return `href="${o || ''}${linkMap.get(k)}"`; }
    return m;
  });
  if (n) { links += n; linkFiles++; write(file, s); }
}

const redirectsFile = path.join(ROOT, '_redirects');
let red = fs.readFileSync(redirectsFile, 'utf8');
if (!red.includes('# mcq-questions folded into hubs')) {
  const lines = ['', '# mcq-questions folded into hubs (2026-10-06): thin template pages Google would not index'];
  for (const [from, to] of mcqMap) lines.push(`${from}  ${to}  301`, `${from.slice(0, -1)}  ${to}  301`);
  red = red.trimEnd() + '\n' + lines.join('\n') + '\n';
  write(redirectsFile, red);
}
if (!DRY) for (const d of mcqDirs) if (mcqMap.has(urlOf(path.join(d, 'index.html')))) fs.rmSync(d, { recursive: true });

console.log(`${DRY ? '[dry] ' : ''}quiz mirrors re-canonicalised: ${mirrors}`);
console.log(`mcq-questions folded: ${mcqMap.size} of ${mcqDirs.length}`);
console.log(`links rewritten: ${links} in ${linkFiles} files`);

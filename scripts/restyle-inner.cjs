/**
 * Moves the subject + topic quiz pages (everything loading quiz-hub.css) onto the 2026 light chrome:
 * shared header, breadcrumb, and one compact three-tile block in place of the waitlist pitch and the
 * two stacked CTA boxes. Styling lives in assets/inner-v2.css. Safe to re-run.
 *
 *   node scripts/restyle-inner.cjs [--dry]
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry');
const V = '20261017b';
const EXAMS = { upsc: 'UPSC', tnpsc: 'TNPSC', ssc: 'SSC', rrb: 'RRB', ncert: 'NCERT', samacheer: 'Samacheer', quiz: 'Quiz Hub' };
const LABEL = { 'csat-quant': 'CSAT Quant', 'csat-english': 'CSAT English', 'general-aware': 'General Awareness', quant: 'Quant' };
const title = (s) => LABEL[s] || s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const HEADER = `<header class="hh">
  <div class="wrap hin">
    <a class="brand" href="/"><img src="/assets/icons/mindgains-logo-192.png" alt="" width="28" height="28">MindGains</a>
    <div class="hnav">
      <a class="lnk" href="/">All exams</a>
      <a class="lnk" href="/quiz/">Quiz Hub</a>
      <a class="lnk" href="/nationlap/?affairs=1">Current affairs</a>
      <a class="lnk" href="/nationlap/">NationLap</a>
      <a class="btn sm hbtn" href="/get/">Get the app</a>
    </div>
  </div>
</header>`;

const BENTO = `<!-- inner-bento:start -->
<section class="ibento" aria-label="More ways to practise">
  <a class="itile it-ca" href="/nationlap/?affairs=1"><b>Every morning · 5am</b><strong>Today's current affairs</strong><span>The day's exam-worthy news, each fact with its source.</span><i>Race today's affairs →</i></a>
  <a class="itile it-nl" href="/nationlap/"><b>Game</b><strong>NationLap</strong><span>Read a topic, then race it and answer at speed.</span><i>Play free →</i></a>
  <a class="itile it-app" href="/get/"><b>MindGains app</b><strong>Mistakes come back</strong><span>Daily Dose, revision and Quiz Rooms with friends.</span><i>Get the app →</i></a>
</section>
<!-- inner-bento:end -->`;

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!['node_modules', '.git', 'nationlap', 'assets', 'scripts'].includes(e.name)) walk(p, out); }
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

let n = 0;
for (const f of walk(ROOT)) {
  let s = fs.readFileSync(f, 'utf8');
  if (!s.includes('/assets/quiz-hub.css')) continue;
  const rel = path.relative(ROOT, path.dirname(f)).split(path.sep);

  s = s.replace(/<div class="bg"><\/div>\s*/, '');
  s = s.replace(/<header class="(site-nav|hh)">[\s\S]*?<\/header>/, HEADER);
  s = s.replace(/<body(?: class="[^"]*")?>/, '<body class="inner-v2">');

  // breadcrumb: Home › Exam › Subject
  const crumbs = [['/', 'Home']];
  if (EXAMS[rel[0]]) crumbs.push([`/${rel[0]}/`, EXAMS[rel[0]]]);
  if (rel.length > 2) crumbs.push([`/${rel[0]}/${rel[1]}/`, title(rel[1])]);
  const nav = `<nav class="crumbs" aria-label="Breadcrumb">${crumbs.map(([h, t]) => `<a href="${h}">${t}</a>`).join('<span>›</span>')}</nav>`;
  s = s.replace(/<nav class="crumbs"[\s\S]*?<\/nav>/, '');
  s = s.replace('<main>', `<main>${nav}`);

  // one compact block instead of the waitlist pitch + two CTA boxes
  s = s.replace(/<section class="app-bridge">[\s\S]*?<\/section>/, '');
  s = s.replace(/<!-- current-affairs-cta:start -->[\s\S]*?<!-- current-affairs-cta:end -->\n?/, '');
  s = s.replace(/<!-- nationlap-cta:start -->[\s\S]*?<!-- nationlap-cta:end -->\n?/, '');
  s = s.replace(/<!-- inner-bento:start -->[\s\S]*?<!-- inner-bento:end -->\n?/, '');
  s = s.replace('</main>', `${BENTO}\n</main>`);

  // fonts + stylesheet (last, so it wins)
  if (!s.includes('family=Inter+Tight')) s = s.replace('</head>', '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&display=swap">\n</head>');
  s = s.replace(/<link rel="stylesheet" href="\/assets\/inner-v2\.css[^"]*">\n?/, '');
  s = s.replace('</head>', `<link rel="stylesheet" href="/assets/inner-v2.css?v=${V}">\n</head>`);
  s = s.replace('<meta name="theme-color" content="#00d4c7"', '<meta name="theme-color" content="#fbfcfd"');

  if (!DRY) fs.writeFileSync(f, s);
  n++;
}
console.log(`${DRY ? '[dry] ' : ''}restyled ${n} pages`);

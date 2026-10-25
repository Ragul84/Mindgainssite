/**
 * Round 2 of the "one route, one shuffled pool, no sub-topics" consolidation,
 * scope = true format-clusters only (user decision 2026-08-31):
 *
 *   A. SSC English Vocabulary — fold one-word + synonyms-antonyms into
 *      /ssc/english/vocabulary/ (idioms already folded in round 1).
 *   B. UPSC CSAT English — fold comprehension + logical-deduction into
 *      /upsc/csat-english/  (convert that page from a cards page to a hub).
 *
 * Per cluster: merge+dedupe data, (re)build the hub page, delete leaf dirs +
 * merged data files, add 301s, prune sitemap + round2-title-overrides, and
 * strip any leaf cards from the parent subject index.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const R = (...p) => path.join(ROOT, ...p);
const norm = (q) => q.question.toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/g, '').trim();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const readQ = (p) => JSON.parse(fs.readFileSync(R(p), 'utf8')).questions;

let sitemap = fs.readFileSync(R('sitemap.xml'), 'utf8');
let redirects = fs.readFileSync(R('_redirects'), 'utf8').replace(/\s*$/, '\n') + '\n# format-cluster consolidation round 2 (2026-08-31)\n';
const ovPath = R('scripts/seo/round2-title-overrides.json');
const ov = JSON.parse(fs.readFileSync(ovPath, 'utf8'));
const log = [];

function mergePool(hubDataRel, sourceRels, meta) {
  const seen = new Set();
  const out = [];
  const tally = {};
  for (const rel of [hubDataRel, ...sourceRels]) {
    let kept = 0;
    for (const q of readQ(rel)) {
      const k = norm(q);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ question: q.question, options: q.options, answer_index: q.answer_index, explanation: q.explanation, difficulty: q.difficulty || 'medium' });
      kept++;
    }
    tally[path.basename(rel)] = kept;
  }
  fs.writeFileSync(R(hubDataRel), JSON.stringify({ ...meta, questions: out }));
  return { count: out.length, tally };
}

function pruneSitemap(routes) {
  for (const r of routes) {
    sitemap = sitemap.replace(new RegExp(`\\s*<url><loc>https://mindgains\\.ai${r}</loc>[^<]*<changefreq>[^<]*</changefreq>[^<]*<priority>[^<]*</priority></url>`, 'g'), '');
  }
}
function add301(fromRoutes, to) {
  for (const r of fromRoutes) {
    const bare = r.replace(/\/$/, '');
    for (const s of [bare, bare + '/']) if (!redirects.includes(`\n${s} `)) redirects += `${s}  ${to}  301\n`;
  }
}

// ---------- A. SSC English Vocabulary ----------
{
  const hub = 'assets/quiz-data/ssc/english/vocabulary.json';
  const { count, tally } = mergePool(hub, ['assets/quiz-data/ssc/english/one-word.json', 'assets/quiz-data/ssc/english/synonyms-antonyms.json'], {
    title: 'SSC English Vocabulary Quiz', exam: 'SSC', subject: 'English', topic: 'Vocabulary',
    note: 'One shuffled pool: synonyms, antonyms, one-word substitution, idioms & phrases, spelling.',
  });
  const SEO = {
    title: 'SSC CGL English Vocabulary Questions with Answers — Free Practice | MindGains',
    h1: 'SSC CGL English Vocabulary Questions',
    description: 'Practice SSC CGL English vocabulary in one shuffled set — synonyms, antonyms, one-word substitution, idioms & phrases and spelling — with answers and explanations.',
  };
  let page = fs.readFileSync(R('ssc/english/vocabulary/index.html'), 'utf8');
  page = page.replace(/<title>[^<]*<\/title>/, `<title>${esc(SEO.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(SEO.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(SEO.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(SEO.description)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(SEO.title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(SEO.description)}$2`)
    .replace(/<h1>[^<]*<\/h1>/, `<h1>${esc(SEO.h1)}</h1>`)
    .replace(/<p>Practice Vocabulary one question at a time\.[^<]*<\/p>/,
      '<p>One shuffled set covering SSC vocabulary — synonyms, antonyms, one-word substitution, idioms &amp; phrases and spelling. Every attempt is shuffled and explanations appear after you answer.</p>')
    .replace(/Question 1 \/ \d+/, `Question 1 / ${count}`)
    .replace(/<section><div class="section-head"><h2>Related Topics<\/h2><\/div><div class="related">.*?<\/div><\/section>/s, '');
  fs.writeFileSync(R('ssc/english/vocabulary/index.html'), page);

  for (const slug of ['one-word', 'synonyms-antonyms']) {
    fs.rmSync(R('ssc/english', slug), { recursive: true, force: true });
    fs.rmSync(R('assets/quiz-data/ssc/english', slug + '.json'), { force: true });
    delete ov[`/ssc/english/${slug}/`];
  }
  ov['/ssc/english/vocabulary/'] = SEO;
  pruneSitemap(['/ssc/english/one-word/', '/ssc/english/synonyms-antonyms/']);
  add301(['/ssc/english/one-word/', '/ssc/english/synonyms-antonyms/'], '/ssc/english/vocabulary/');

  let ix = fs.readFileSync(R('ssc/english/index.html'), 'utf8');
  for (const slug of ['one-word', 'synonyms-antonyms']) ix = ix.replace(new RegExp(`<a class="card" href="/ssc/english/${slug}/">.*?</a>`, 's'), '');
  fs.writeFileSync(R('ssc/english/index.html'), ix);
  log.push(`A. SSC vocabulary: ${JSON.stringify(tally)} => ${count} Q; one-word + synonyms-antonyms deleted/301'd`);
}

// ---------- B. UPSC CSAT English ----------
{
  const hub = 'assets/quiz-data/upsc/csat-english/csat-english.json';
  // hub file doesn't exist yet — seed the merge from the two sources
  fs.writeFileSync(R(hub), JSON.stringify({ title: 'CSAT English Quiz', exam: 'UPSC', subject: 'CSAT English', topic: 'CSAT English', questions: [] }));
  const { count, tally } = mergePool(hub, ['assets/quiz-data/upsc/csat-english/comprehension.json', 'assets/quiz-data/upsc/csat-english/logical-deduction.json'], {
    title: 'CSAT English Quiz', exam: 'UPSC', subject: 'CSAT English', topic: 'CSAT English',
    note: 'One shuffled pool: reading comprehension passages + logical deduction / critical reasoning from passages (CSAT Paper II, Class X level).',
  });
  const SEO = {
    title: 'UPSC CSAT English Comprehension Questions with Answers — Free Practice | MindGains',
    h1: 'UPSC CSAT English Comprehension Questions',
    description: 'Practice UPSC CSAT Paper II English — reading comprehension passages and passage-based logical deduction — in one shuffled set with answers and explanations.',
  };
  // build the hub page by cloning a working topic page (comprehension)
  let page = fs.readFileSync(R('upsc/csat-english/comprehension/index.html'), 'utf8');
  page = page.replace(/<title>[^<]*<\/title>/, `<title>${esc(SEO.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(SEO.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(SEO.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(SEO.description)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(SEO.title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(SEO.description)}$2`)
    .replace(/https:\/\/mindgains\.ai\/upsc\/csat-english\/comprehension\//g, 'https://mindgains.ai/upsc/csat-english/')
    .replace(/{"@type":"ListItem","position":5,"name":"[^"]*","item":"https:\/\/mindgains\.ai\/upsc\/csat-english\/"},?/, '')
    .replace(/<h1>[^<]*<\/h1>/, `<h1>${esc(SEO.h1)}</h1>`)
    .replace(/<p>Practice Comprehension one question at a time\.[^<]*<\/p>/,
      '<p>One shuffled set covering CSAT Paper II English — reading-comprehension passages and passage-based logical deduction, at Class X level. Every attempt is shuffled and explanations appear after you answer.</p>')
    .replace(/data-quiz-src="[^"]*"/, 'data-quiz-src="/assets/quiz-data/upsc/csat-english/csat-english.json"')
    .replace(/Question 1 \/ \d+/, `Question 1 / ${count}`)
    .replace(/<section><div class="section-head"><h2>Related Topics<\/h2><\/div><div class="related">.*?<\/div><\/section>/s, '');
  fs.writeFileSync(R('upsc/csat-english/index.html'), page);

  for (const slug of ['comprehension', 'logical-deduction']) {
    fs.rmSync(R('upsc/csat-english', slug), { recursive: true, force: true });
    fs.rmSync(R('assets/quiz-data/upsc/csat-english', slug + '.json'), { force: true });
    delete ov[`/upsc/csat-english/${slug}/`];
  }
  ov['/upsc/csat-english/'] = SEO;
  pruneSitemap(['/upsc/csat-english/comprehension/', '/upsc/csat-english/logical-deduction/']);
  add301(['/upsc/csat-english/comprehension/', '/upsc/csat-english/logical-deduction/'], '/upsc/csat-english/');
  log.push(`B. UPSC csat-english: ${JSON.stringify(tally)} => ${count} Q; comprehension + logical-deduction deleted/301'd`);
}

fs.writeFileSync(R('sitemap.xml'), sitemap);
fs.writeFileSync(R('_redirects'), redirects);
fs.writeFileSync(ovPath, JSON.stringify(ov, null, 2) + '\n');
console.log(log.join('\n'));

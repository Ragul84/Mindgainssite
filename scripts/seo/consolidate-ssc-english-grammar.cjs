/**
 * Collapse the SSC English grammar sub-topics into ONE route + one shuffled pool.
 * Decision (2026-08-31): /ssc/english/grammar/ is the only grammar practice page.
 * error-spotting / sentence-correction / fill-blanks / cloze-test leaf pages are
 * deleted and 301'd to the hub. idioms-phrases folds into /ssc/english/vocabulary/.
 *
 *   1. merge grammar + error-spotting(vetted) + sentence-correction + fill-blanks
 *      + cloze-test  ->  assets/quiz-data/ssc/english/grammar.json  (text-deduped)
 *   2. merge idioms-phrases -> assets/quiz-data/ssc/english/vocabulary.json
 *   3. rewrite /ssc/english/grammar/index.html as the hub (title/H1/meta/count)
 *   4. delete the 5 leaf page dirs + their now-merged data files
 *   5. add 301s to _redirects
 *   6. drop the 5 routes from sitemap.xml + round2-title-overrides.json,
 *      rebuild the /ssc/english/ index cards
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const R = (...p) => path.join(ROOT, ...p);
const QD = (f) => R('assets/quiz-data/ssc/english', f);
const readQ = (f) => JSON.parse(fs.readFileSync(QD(f), 'utf8')).questions;

const norm = (q) => q.question.toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/g, '').trim();

// ---- 1. grammar pool ----
const GRAMMAR_SOURCES = ['grammar.json', 'error-spotting.json', 'sentence-correction.json', 'fill-blanks.json', 'cloze-test.json'];
const seen = new Set();
let grammar = [];
const tally = {};
for (const f of GRAMMAR_SOURCES) {
  let kept = 0;
  for (const q of readQ(f)) {
    const k = norm(q);
    if (seen.has(k)) continue;
    seen.add(k);
    grammar.push({ question: q.question, options: q.options, answer_index: q.answer_index, explanation: q.explanation, difficulty: q.difficulty || 'medium' });
    kept++;
  }
  tally[f] = kept;
}
fs.writeFileSync(QD('grammar.json'), JSON.stringify({
  title: 'SSC English Grammar Quiz', exam: 'SSC', subject: 'English', topic: 'Grammar',
  note: 'One shuffled pool: spot the error, sentence improvement, fill in the blanks, active/passive voice, direct/indirect narration, para-jumbles, cloze.',
  questions: grammar,
}));

// ---- 2. vocabulary pool gets idioms ----
const vocab = JSON.parse(fs.readFileSync(QD('vocabulary.json'), 'utf8'));
const vseen = new Set(vocab.questions.map(norm));
let vAdded = 0;
for (const q of readQ('idioms-phrases.json')) {
  const k = norm(q);
  if (vseen.has(k)) continue;
  vseen.add(k);
  vocab.questions.push({ question: q.question, options: q.options, answer_index: q.answer_index, explanation: q.explanation, difficulty: q.difficulty || 'medium' });
  vAdded++;
}
fs.writeFileSync(QD('vocabulary.json'), JSON.stringify(vocab));

// ---- 3. grammar hub page ----
const HUB = {
  title: 'SSC CGL English Grammar Questions with Answers — Free Practice | MindGains',
  h1: 'SSC CGL English Grammar Questions',
  description: 'Practice SSC CGL English grammar in one shuffled set — spot the error, sentence improvement, active/passive voice, narration, fill in the blanks, para-jumbles and cloze — with answers and explanations.',
};
let hub = fs.readFileSync(R('ssc/english/grammar/index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// title/desc across head (multiple spots) — replace whatever is currently in <title>
hub = hub.replace(/<title>[^<]*<\/title>/, `<title>${esc(HUB.title)}</title>`);
hub = hub.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(HUB.description)}$2`);
hub = hub.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(HUB.title)}$2`);
hub = hub.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(HUB.description)}$2`);
hub = hub.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(HUB.title)}$2`);
hub = hub.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(HUB.description)}$2`);
hub = hub.replace(/<h1>[^<]*<\/h1>/, `<h1>${esc(HUB.h1)}</h1>`);
hub = hub.replace(/<p>Practice Grammar one question at a time\.[^<]*<\/p>/,
  '<p>One shuffled set covering every SSC grammar question type — spot the error, sentence improvement, active &amp; passive voice, direct &amp; indirect narration, fill in the blanks, para-jumbles and cloze. Every attempt is shuffled and explanations appear after you answer.</p>');
hub = hub.replace(/Question 1 \/ \d+/, `Question 1 / ${grammar.length}`);
// strip the Related Topics block (sub-topics no longer exist)
hub = hub.replace(/<section><div class="section-head"><h2>Related Topics<\/h2><\/div><div class="related">.*?<\/div><\/section>/s, '');
fs.writeFileSync(R('ssc/english/grammar/index.html'), hub);

// ---- 4. delete leaf pages + merged data files ----
const KILL_PAGES = ['error-spotting', 'sentence-correction', 'fill-blanks', 'cloze-test', 'idioms-phrases'];
const KILL_DATA = ['error-spotting.json', 'sentence-correction.json', 'fill-blanks.json', 'cloze-test.json', 'idioms-phrases.json'];
for (const d of KILL_PAGES) fs.rmSync(R('ssc/english', d), { recursive: true, force: true });
for (const f of KILL_DATA) fs.rmSync(QD(f), { force: true });

// ---- 5. _redirects ----
let red = fs.readFileSync(R('_redirects'), 'utf8').replace(/\s*$/, '\n');
const rules = [
  ['/ssc/english/error-spotting', '/ssc/english/grammar/'],
  ['/ssc/english/sentence-correction', '/ssc/english/grammar/'],
  ['/ssc/english/fill-blanks', '/ssc/english/grammar/'],
  ['/ssc/english/cloze-test', '/ssc/english/grammar/'],
  ['/ssc/english/idioms-phrases', '/ssc/english/vocabulary/'],
];
red += '\n# SSC English grammar/vocab consolidation (2026-08-31)\n';
for (const [from, to] of rules) {
  for (const s of [from, from + '/']) if (!red.includes(`\n${s} `) && !red.includes(`\n${s}\t`)) red += `${s}  ${to}  301\n`;
}
fs.writeFileSync(R('_redirects'), red);

// ---- 6. sitemap + overrides + english index ----
let sm = fs.readFileSync(R('sitemap.xml'), 'utf8');
for (const slug of KILL_PAGES) sm = sm.replace(new RegExp(`\\s*<url><loc>https://mindgains\\.ai/ssc/english/${slug}/</loc>[^<]*<changefreq>[^<]*</changefreq>[^<]*<priority>[^<]*</priority></url>`, 'g'), '');
fs.writeFileSync(R('sitemap.xml'), sm);

const ovPath = R('scripts/seo/round2-title-overrides.json');
const ov = JSON.parse(fs.readFileSync(ovPath, 'utf8'));
for (const slug of KILL_PAGES) delete ov[`/ssc/english/${slug}/`];
ov['/ssc/english/grammar/'] = HUB;
fs.writeFileSync(ovPath, JSON.stringify(ov, null, 2) + '\n');

let ix = fs.readFileSync(R('ssc/english/index.html'), 'utf8');
for (const slug of KILL_PAGES) {
  ix = ix.replace(new RegExp(`<a class="card" href="/ssc/english/${slug}/">.*?</a>`, 's'), '');
}
fs.writeFileSync(R('ssc/english/index.html'), ix);

console.log('grammar pool merge:', JSON.stringify(tally), '=> total', grammar.length);
console.log('vocabulary += idioms:', vAdded, '=> total', vocab.questions.length);
console.log('deleted pages:', KILL_PAGES.join(', '));
console.log('grammar hub Question count set to', grammar.length);

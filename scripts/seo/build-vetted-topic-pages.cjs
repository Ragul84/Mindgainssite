/**
 * build-vetted-topic-pages.cjs
 *
 * Publishes the vetted first-batch content as live SSC topic pages, WITHOUT the
 * Redis pipeline. Source of truth for these topics is the reviewed JSON in
 * scripts/seo/ (Error Spotting = external "CONTINUE" verdict; the four cross-topic
 * sets = in-house subject-validator pass).
 *
 * For each topic it:
 *   1. writes assets/quiz-data/ssc/<subject>/<slug>.json  (player format)
 *   2. writes ssc/<subject>/<slug>/index.html             (cloned template)
 *   3. adds a card to ssc/<subject>/index.html
 *   4. adds a <url> to sitemap.xml
 *   5. adds the route to scripts/seo/round2-title-overrides.json
 *
 * Idempotent: re-running overwrites the data + page, and skips list/patch edits
 * that are already present.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const R = (...p) => path.join(ROOT, ...p);

// Error Spotting: production bank (30 reviewed seed + 50 new) built by
// scripts/seo/content/ssc-english-error-spotting.build.cjs. The sample-batch
// file stays frozen as the reviewed 30-question reference.
const errorSpotting = JSON.parse(fs.readFileSync(R('scripts/seo/content/ssc-english-error-spotting.json'), 'utf8'));
const crossTopic = JSON.parse(fs.readFileSync(R('scripts/seo/cross-topic-validation-batch-ssc.json'), 'utf8'));

const TOPICS = [
  {
    subject: 'english', subjectLabel: 'English', pill: 'English',
    slug: 'error-spotting', topicName: 'Error Spotting',
    questions: errorSpotting.questions,
    title: 'SSC CGL Error Spotting Questions with Answers — Free Practice | MindGains',
    h1: 'SSC CGL Error Spotting Questions',
    description: 'Practice SSC CGL Spot the Error questions one at a time with answers and rule-based explanations. Shuffled attempts, mistakes saved for review.',
    related: [
      ['/ssc/english/idioms-phrases/', 'Idioms & Phrases'],
      ['/ssc/english/sentence-correction/', 'Sentence Correction'],
      ['/ssc/english/fill-blanks/', 'Fill Blanks'],
      ['/ssc/english/grammar/', 'Grammar'],
      ['/ssc/english/cloze-test/', 'Cloze Test'],
      ['/ssc/english/synonyms-antonyms/', 'Synonyms Antonyms'],
    ],
  },
  {
    subject: 'english', subjectLabel: 'English', pill: 'English',
    slug: 'idioms-phrases', topicName: 'Idioms & Phrases',
    questions: crossTopic.sections['ssc-english-idioms-phrases'].questions,
    title: 'SSC CGL Idioms & Phrases with Meanings — Questions with Answers | MindGains',
    h1: 'SSC CGL Idioms & Phrases Questions',
    description: 'Practice SSC CGL idioms and phrases with meanings, answers and examples. One question at a time, shuffled, with explanations.',
    related: [
      ['/ssc/english/error-spotting/', 'Error Spotting'],
      ['/ssc/english/one-word/', 'One Word'],
      ['/ssc/english/synonyms-antonyms/', 'Synonyms Antonyms'],
      ['/ssc/english/vocabulary/', 'Vocabulary'],
      ['/ssc/english/sentence-correction/', 'Sentence Correction'],
    ],
  },
  {
    subject: 'reasoning', subjectLabel: 'Reasoning', pill: 'Reasoning',
    slug: 'classification', topicName: 'Classification',
    questions: crossTopic.sections['ssc-reasoning-classification'].questions,
    title: 'SSC CGL Classification Questions (Odd One Out) with Answers | MindGains',
    h1: 'SSC CGL Classification Questions',
    description: 'Practice SSC CGL classification and odd-one-out questions with answers and explanations — words, numbers, number pairs and letter clusters.',
    related: [
      ['/ssc/reasoning/analogy/', 'Analogy'],
      ['/ssc/reasoning/series/', 'Series'],
      ['/ssc/reasoning/coding-decoding/', 'Coding Decoding'],
      ['/ssc/reasoning/blood-relations/', 'Blood Relations'],
      ['/ssc/reasoning/syllogism/', 'Syllogism'],
    ],
  },
  {
    subject: 'quant', subjectLabel: 'Quantitative Aptitude', pill: 'Quantitative Aptitude',
    slug: 'average', topicName: 'Average',
    questions: crossTopic.sections['ssc-quant-average'].questions,
    title: 'SSC CGL Average Questions with Answers — Free Practice | MindGains',
    h1: 'SSC CGL Average Questions',
    description: 'Practice SSC CGL average questions with fully worked solutions — averages of numbers, ages, weights, speed and overlapping groups.',
    related: [
      ['/ssc/quant/percentage/', 'Percentage'],
      ['/ssc/quant/ratio-proportion/', 'Ratio & Proportion'],
      ['/ssc/quant/speed-distance/', 'Speed & Distance'],
      ['/ssc/quant/profit-loss/', 'Profit & Loss'],
      ['/ssc/quant/number-system/', 'Number System'],
    ],
  },
  {
    subject: 'polity', subjectLabel: 'Polity', pill: 'Polity',
    slug: 'fundamental-rights', topicName: 'Fundamental Rights & DPSP',
    questions: crossTopic.sections['ssc-polity-fundamental-rights'].questions,
    title: 'SSC CGL Fundamental Rights & DPSP Questions with Answers | MindGains',
    h1: 'SSC CGL Fundamental Rights & DPSP Questions',
    description: 'Practice SSC CGL questions on Fundamental Rights, DPSP and Fundamental Duties with answers and Article-referenced explanations.',
    related: [
      ['/ssc/polity/constitution/', 'Constitution'],
      ['/ssc/polity/governance/', 'Governance'],
      ['/ssc/polity/current-gk/', 'Current GK'],
    ],
  },
];

// ---- template (cloned from a known-good topic page) ----
const TEMPLATE = fs.readFileSync(R('ssc/english/sentence-correction/index.html'), 'utf8');
const TAIL = TEMPLATE.slice(TEMPLATE.indexOf('<section class="app-bridge">')); // app-bridge + </main> + footer + </body></html>
const HEAD = TEMPLATE.slice(0, TEMPLATE.indexOf('<main>'));

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function buildHead(t) {
  let h = HEAD;
  // breadcrumb first — it contains the sentence-correction URL, so it must be
  // rewritten before the generic URL swap below or its literal match breaks.
  h = h.replace(
    '{"@type":"ListItem","position":4,"name":"English","item":"https://mindgains.ai/ssc/english/"},{"@type":"ListItem","position":5,"name":"Sentence Correction","item":"https://mindgains.ai/ssc/english/sentence-correction/"}',
    `{"@type":"ListItem","position":4,"name":"${t.subjectLabel}","item":"https://mindgains.ai/ssc/${t.subject}/"},{"@type":"ListItem","position":5,"name":"${t.topicName.replace(/&/g, 'and')}","item":"https://mindgains.ai/ssc/${t.subject}/${t.slug}/"}`
  );
  h = h.split('Sentence Correction Quiz | SSC English | MindGains').join(esc(t.title));
  h = h.split('Practice 400 Sentence Correction MCQs for SSC. Shuffle questions, answer one at a time, and review explanations.').join(esc(t.description));
  h = h.split('https://mindgains.ai/ssc/english/sentence-correction/').join(`https://mindgains.ai/ssc/${t.subject}/${t.slug}/`);
  if (h.includes('name":"Sentence Correction"')) throw new Error('breadcrumb not rewritten for ' + t.slug);
  return h;
}

function buildMain(t, n) {
  const rel = t.related.map(([href, label]) => `<a href="${href}">${label}</a>`).join('');
  return `<main><section class="topic-hero">
    <div class="eyebrow-chip">
      <span class="dot-pulse"></span>
      SSC · ${t.subjectLabel}
    </div>
    <h1>${esc(t.h1)}</h1>
    <p>Practice ${esc(t.topicName)} one question at a time. Every attempt is shuffled, explanations appear after you answer, and mistakes are saved for review in this session.</p>
    <div class="start-wrapper">
      <button class="start" type="button" data-start-quiz><span class="material-symbols-outlined" style="font-size:18px;color:#7BE3B0;">play_arrow</span><span>Start Quiz</span></button>
    </div>
  </section><section class="quiz-player" id="quiz-player" data-quiz-src="/assets/quiz-data/ssc/${t.subject}/${t.slug}.json" hidden><div class="quiz-shell"><div class="quiz-status"><span data-progress>Question 1 / ${n}</span><span data-score>Score 0</span></div><div class="quiz-meter"><span data-meter></span></div><h2 data-question></h2><div class="quiz-options" data-options></div><div class="quiz-feedback" data-feedback hidden></div><div class="quiz-actions"><button type="button" data-next disabled>Next</button></div></div></section><section><div class="section-head"><h2>Related Topics</h2></div><div class="related">${rel}</div></section>`;
}

const overridesPath = R('scripts/seo/round2-title-overrides.json');
const overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
let sitemap = fs.readFileSync(R('sitemap.xml'), 'utf8');
const log = [];

for (const t of TOPICS) {
  const qs = t.questions.map((q) => ({
    question: q.question,
    options: q.options,
    answer_index: q.answer_index,
    explanation: q.explanation,
    difficulty: q.difficulty,
  }));
  const n = qs.length;

  // 1. quiz-data
  const dataDir = R('assets/quiz-data/ssc', t.subject);
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(
    path.join(dataDir, `${t.slug}.json`),
    JSON.stringify({ title: `${t.topicName} Quiz`, exam: 'SSC', subject: t.subjectLabel, topic: t.topicName, questions: qs })
  );

  // 2. page
  const pageDir = R('ssc', t.subject, t.slug);
  fs.mkdirSync(pageDir, { recursive: true });
  fs.writeFileSync(path.join(pageDir, 'index.html'), buildHead(t) + buildMain(t, n) + TAIL);

  // 3. subject-index card
  const idxPath = R('ssc', t.subject, 'index.html');
  let idx = fs.readFileSync(idxPath, 'utf8');
  const href = `/ssc/${t.subject}/${t.slug}/`;
  if (!idx.includes(`href="${href}"`)) {
    const card = `<a class="card" href="${href}">
    <span class="pill">${t.pill}</span>
    <h2>${esc(t.topicName)}</h2>
    <p>${esc(t.topicName)} quiz questions for SSC.</p>
    <div class="meta">Start practice</div>
  </a>`;
    idx = idx.replace('</a></div></section></main>', `</a>${card}</div></section></main>`);
    fs.writeFileSync(idxPath, idx);
    log.push(`card added -> ssc/${t.subject}/index.html`);
  } else {
    log.push(`card already present -> ssc/${t.subject}/index.html`);
  }

  // 4. sitemap
  const loc = `https://mindgains.ai/ssc/${t.subject}/${t.slug}/`;
  if (!sitemap.includes(loc)) {
    const entry = `  <url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
    // insert after the subject's first existing entry, else before </urlset>
    const anchorRe = new RegExp(`(  <url><loc>https://mindgains\\.ai/ssc/${t.subject}/[^<]+</loc>[^\\n]*\\n)`);
    if (anchorRe.test(sitemap)) sitemap = sitemap.replace(anchorRe, `$1${entry}`);
    else sitemap = sitemap.replace('</urlset>', `${entry}</urlset>`);
    log.push(`sitemap += ${loc}`);
  } else {
    log.push(`sitemap already has ${loc}`);
  }

  // 5. overrides
  overrides[href] = { title: t.title, h1: t.h1, description: t.description };

  log.push(`page written -> ssc/${t.subject}/${t.slug}/index.html  (${n} Q)`);
}

fs.writeFileSync(R('sitemap.xml'), sitemap);
fs.writeFileSync(overridesPath, JSON.stringify(overrides, null, 2) + '\n');

console.log(log.join('\n'));
console.log(`\noverrides file now has ${Object.keys(overrides).length} routes`);

#!/usr/bin/env node
/*
 * Adds crawlable study content to canonical quiz pages and creates distinct
 * MCQ landing pages. It intentionally does not manufacture PYQ pages: the
 * local question-bank format has no verified year/source field.
 *
 * Safe to run repeatedly. Existing page copy and metadata are preserved; only
 * blocks between the MG SEO markers are replaced. SEO title overrides remain
 * owned by scripts/seo/round2-title-overrides.json and are never rewritten.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://mindgains.ai';
const DATA_ROOT = path.join(ROOT, 'assets', 'quiz-data');
const EXAM_NAMES = { upsc: 'UPSC', tnpsc: 'TNPSC', ssc: 'SSC', rrb: 'RRB', ncert: 'NCERT', samacheer: 'Samacheer Kalvi' };
const SUBJECT_NAMES = { csat_quant: 'CSAT Quantitative Aptitude', csat_english: 'CSAT Comprehension', maths: 'Mathematics', quant: 'Quantitative Aptitude', economy: 'Economy', general_aware: 'General Awareness' };

function esc(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function humanize(value) {
  const special = { dpsp: 'DPSP', ncert: 'NCERT', upsc: 'UPSC', tnpsc: 'TNPSC', ssc: 'SSC', rrb: 'RRB', si: 'SI', ci: 'CI', pyq: 'PYQ' };
  return String(value).replace(/_/g, '-').split('-').filter(Boolean).map((word) => special[word.toLowerCase()] || word[0].toUpperCase() + word.slice(1)).join(' ');
}
function subjectName(slug) { return SUBJECT_NAMES[slug.replace(/-/g, '_')] || humanize(slug); }
function readJsonFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? readJsonFiles(full) : entry.name.endsWith('.json') ? [full] : [];
  });
}
function replaceBlock(html, start, end, content, anchor) {
  const from = html.indexOf(start), to = html.indexOf(end);
  if (from >= 0 && to > from) return html.slice(0, from) + content + html.slice(to + end.length);
  const position = html.indexOf(anchor);
  if (position < 0) throw new Error(`Anchor not found: ${anchor}`);
  return html.slice(0, position) + content + html.slice(position);
}
function previewMarkup(item) {
  const preview = item.questions.slice(0, 5);
  return `<!-- MG_STATIC_PREVIEW_START -->
<section class="mg-seo-study" aria-labelledby="mg-study-title">
  <p class="mg-seo-kicker">${esc(item.examName)} ${esc(item.subjectName)} practice</p>
  <h2 id="mg-study-title">${esc(item.topic)} MCQs with answers</h2>
  <p>Use these ${preview.length} worked ${esc(item.topic)} questions to revise the ${esc(item.examName)} ${esc(item.subjectName)} syllabus. Each answer includes an explanation; the full practice set contains ${item.questions.length.toLocaleString('en-IN')} questions.</p>
  <div class="mg-seo-questions">${preview.map((q, index) => `<article class="mg-seo-question"><h3>${index + 1}. ${esc(q.question)}</h3><ol type="A">${(q.options || []).map((option) => `<li>${esc(option)}</li>`).join('')}</ol><p><strong>Answer:</strong> ${esc((q.options || [])[q.answer_index] || 'See explanation')}</p>${q.explanation ? `<p><strong>Explanation:</strong> ${esc(q.explanation)}</p>` : ''}</article>`).join('')}</div>
  <p class="mg-seo-note">Start the interactive quiz below to practise every question in a shuffled order.</p>
</section>
<!-- MG_STATIC_PREVIEW_END -->
`;
}
function schemaMarkup(item) {
  const questions = item.questions.slice(0, 5).map((q) => ({
    '@type': 'Question', name: q.question,
    acceptedAnswer: { '@type': 'Answer', text: (q.options || [])[q.answer_index] || q.explanation || '' },
  }));
  const schema = {
    '@context': 'https://schema.org', '@type': ['LearningResource', 'Quiz'],
    name: `${item.topic} MCQs for ${item.examName}`,
    description: `${item.questions.length} ${item.topic} practice questions with answers for ${item.examName} ${item.subjectName}.`,
    url: `${SITE}/${item.exam}/${item.subject}/${item.topicSlug}/`,
    inLanguage: 'en-IN', educationalLevel: item.level,
    learningResourceType: 'Practice questions', teaches: `${item.topic} for ${item.examName} ${item.subjectName}`,
    numberOfItems: item.questions.length, hasPart: questions,
  };
  return `<!-- MG_LEARNING_SCHEMA_START --><script type="application/ld+json">${JSON.stringify(schema)}</script><!-- MG_LEARNING_SCHEMA_END -->`;
}
function styleMarkup() {
  return `<!-- MG_SEO_STYLE_START --><style>.mg-seo-study{margin:24px 0;padding:24px;border:1px solid rgba(255,255,255,.16);border-radius:22px;background:rgba(255,255,255,.045)}.mg-seo-kicker{margin:0 0 8px;color:#67e8f9;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}.mg-seo-study h2{margin:0 0 12px;font-size:clamp(26px,4vw,38px)}.mg-seo-study>p{max-width:860px;color:#dbeafe;line-height:1.6}.mg-seo-questions{display:grid;gap:12px;margin-top:18px}.mg-seo-question{padding:18px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:rgba(0,0,0,.16)}.mg-seo-question h3{margin:0 0 12px;font-size:18px;line-height:1.4}.mg-seo-question ol{padding-left:26px;color:#dbeafe;line-height:1.6}.mg-seo-question p{color:#cbd5e1;line-height:1.55}.mg-seo-note{font-weight:700}@media(max-width:700px){.mg-seo-study{padding:17px}.mg-seo-question{padding:14px}}</style><!-- MG_SEO_STYLE_END -->`;
}
function mcqPage(item) {
  const url = `${SITE}/${item.exam}/${item.subject}/${item.topicSlug}/mcq-questions/`;
  const title = `${item.topic} MCQ Questions for ${item.examName} with Answers | MindGains`;
  const description = `Practice ${item.questions.length.toLocaleString('en-IN')} ${item.topic} MCQ questions for ${item.examName} ${item.subjectName}, with answers and explanations.`;
  const body = previewMarkup(item).replace('<!-- MG_STATIC_PREVIEW_START -->', '').replace('<!-- MG_STATIC_PREVIEW_END -->', '');
  const schema = schemaMarkup(item).replace('<!-- MG_LEARNING_SCHEMA_START -->', '').replace('<!-- MG_LEARNING_SCHEMA_END -->', '');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="/assets/quiz-hub.css">${styleMarkup()}${schema}</head><body><header class="site-nav"><a class="brand" href="/">MindGains</a><nav><a href="/quiz/">Quiz Hub</a><a href="/${item.exam}/${item.subject}/${item.topicSlug}/">Interactive quiz</a></nav></header><main><section class="topic-hero"><p class="eyebrow">${esc(item.examName)} · ${esc(item.subjectName)}</p><h1>${esc(item.topic)} MCQ Questions</h1><p>${esc(description)}</p></section>${body}<section class="app-bridge"><h2>Practise the complete set</h2><p>Take the full ${item.questions.length.toLocaleString('en-IN')}-question ${esc(item.topic)} quiz in a shuffled, interactive format.</p><a class="start" href="/${item.exam}/${item.subject}/${item.topicSlug}/">Start ${esc(item.topic)} quiz</a></section></main></body></html>`;
}
function updateSitemap(urls) {
  const file = path.join(ROOT, 'sitemap.xml');
  const old = fs.readFileSync(file, 'utf8');
  const retained = [...old.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((url) => !url.includes('/mcq-questions/'));
  const all = [...new Set([...retained, ...urls])].sort();
  const entries = all.map((url) => `  <url><loc>${esc(url)}</loc><changefreq>weekly</changefreq><priority>${url.includes('/mcq-questions/') ? '0.7' : '0.8'}</priority></url>`).join('\n');
  fs.writeFileSync(file, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`);
}

// These are syllabus-cluster landing nodes, assembled only from existing local
// TNPSC banks. They make Unit VIII and Unit IX discoverable as named intents
// without inventing questions or PYQ provenance.
const CLUSTER_BANKS = [
  {
    exam: 'tnpsc', subject: 'history', slug: 'unit-viii-tamil-nadu-history-culture',
    title: 'TNPSC Unit VIII: Tamil Nadu History, Culture & Socio-Political Movements',
    sources: ['history/tamil-history', 'history/social-reform', 'history/art-culture', 'history/chola-pandya'],
    parent: 'tnpsc/history/index.html',
  },
  {
    exam: 'tnpsc', subject: 'economics', slug: 'unit-ix-development-administration',
    title: 'TNPSC Unit IX: Development Administration in Tamil Nadu',
    sources: ['economics/current-schemes', 'economics/tn-economy', 'economics/poverty-welfare', 'polity/tn-polity'],
    parent: 'tnpsc/economics/index.html',
  },
];
const CLUSTER_PATHS = new Set(CLUSTER_BANKS.map((cluster) => `${cluster.exam}/${cluster.subject}/${cluster.slug}`));

function createClusterBanks() {
  for (const cluster of CLUSTER_BANKS) {
    const questions = [], seen = new Set();
    for (const source of cluster.sources) {
      const [subject, slug] = source.split('/');
      const sourceFile = path.join(DATA_ROOT, cluster.exam, subject, `${slug}.json`);
      const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
      for (const question of sourceData.questions || []) {
        const key = String(question.question || '').trim().toLowerCase();
        if (key && !seen.has(key)) { seen.add(key); questions.push(question); }
        if (questions.length >= 80) break;
      }
      if (questions.length >= 80) break;
    }
    const target = path.join(DATA_ROOT, cluster.exam, cluster.subject, `${cluster.slug}.json`);
    fs.writeFileSync(target, JSON.stringify({
      title: `${cluster.title} Quiz`, exam: 'TNPSC',
      subject: cluster.subject === 'history' ? 'History' : 'Economy', topic: cluster.title,
      questions,
    }));
  }
}
function createCanonicalPage(item) {
  const url = `${SITE}/${item.exam}/${item.subject}/${item.topicSlug}/`;
  const title = `${item.topic} MCQs with Answers | MindGains`;
  const description = `Practice ${item.topic} MCQs for TNPSC with answers and explanations.`;
  const src = `/assets/quiz-data/${item.exam}/${item.subject}/${item.topicSlug}.json`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="/assets/quiz-hub.css"></head><body><header class="site-nav"><a class="brand" href="/">MindGains</a><nav><a href="/tnpsc/">TNPSC</a><a href="/quiz/">Quiz Hub</a></nav></header><main><section class="topic-hero"><p class="eyebrow">TNPSC · ${esc(item.subjectName)}</p><h1>${esc(item.topic)} MCQs</h1><p>${esc(description)}</p><button class="start" type="button" data-start-quiz>Start Quiz</button></section><section class="quiz-player" id="quiz-player" data-quiz-src="${src}" hidden><div class="quiz-shell"><div class="quiz-status"><span data-progress>Question 1 / ${item.questions.length}</span><span data-score>Score 0</span></div><div class="quiz-meter"><span data-meter></span></div><h2 data-question></h2><div class="quiz-options" data-options></div><div class="quiz-feedback" data-feedback hidden></div><div class="quiz-actions"><button type="button" data-next disabled>Next</button></div></div></section></main><script src="/assets/quiz-search.js" defer></script></body></html>`;
}
function addClusterLink(cluster) {
  const file = path.join(ROOT, cluster.parent);
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  const marker = `MG_CLUSTER_LINK_${cluster.slug}`;
  if (html.includes(marker)) return;
  const href = `/tnpsc/${cluster.subject}/${cluster.slug}/`;
  const block = `<!-- ${marker} --><section class="app-bridge"><h2>${esc(cluster.title)}</h2><p>Follow the complete TNPSC syllabus cluster with focused questions, answers and explanations.</p><a class="start" href="${href}">Open Unit practice</a></section>`;
  html = html.replace('</main>', `${block}</main>`);
  fs.writeFileSync(file, html);
}

createClusterBanks();
const sitemapUrls = [];
let canonicalUpdated = 0, mcqCreated = 0, skipped = 0;
for (const dataFile of readJsonFiles(DATA_ROOT)) {
  const rel = path.relative(DATA_ROOT, dataFile).split(path.sep);
  if (rel.length !== 3) { skipped++; continue; }
  const [exam, subject, filename] = rel;
  const topicSlug = filename.replace(/\.json$/, '');
  const pageFile = path.join(ROOT, exam, subject, topicSlug, 'index.html');
  let item;
  try { item = JSON.parse(fs.readFileSync(dataFile, 'utf8')); } catch { skipped++; continue; }
  if (!Array.isArray(item.questions) || !item.questions.length) { skipped++; continue; }
  const context = { exam, subject, topicSlug, examName: item.exam || EXAM_NAMES[exam] || humanize(exam), subjectName: item.subject || subjectName(subject), topic: item.topic || humanize(topicSlug), questions: item.questions, level: /^class\d+$/i.test(topicSlug) ? topicSlug.replace(/class/i, 'Class ') : `${EXAM_NAMES[exam] || humanize(exam)} preparation` };
  if (!fs.existsSync(pageFile)) {
    if (!CLUSTER_PATHS.has(`${exam}/${subject}/${topicSlug}`)) { skipped++; continue; }
    fs.mkdirSync(path.dirname(pageFile), { recursive: true });
    fs.writeFileSync(pageFile, createCanonicalPage(context));
  }
  let html = fs.readFileSync(pageFile, 'utf8');
  html = replaceBlock(html, '<!-- MG_SEO_STYLE_START -->', '<!-- MG_SEO_STYLE_END -->', styleMarkup(), '</head>');
  html = replaceBlock(html, '<!-- MG_LEARNING_SCHEMA_START -->', '<!-- MG_LEARNING_SCHEMA_END -->', schemaMarkup(context), '</head>');
  html = replaceBlock(html, '<!-- MG_STATIC_PREVIEW_START -->', '<!-- MG_STATIC_PREVIEW_END -->', previewMarkup(context), '<section class="quiz-player"');
  fs.writeFileSync(pageFile, html);
  canonicalUpdated++;
  const dir = path.join(ROOT, exam, subject, topicSlug, 'mcq-questions');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), mcqPage(context));
  sitemapUrls.push(`${SITE}/${exam}/${subject}/${topicSlug}/`, `${SITE}/${exam}/${subject}/${topicSlug}/mcq-questions/`);
  mcqCreated++;
}
for (const cluster of CLUSTER_BANKS) addClusterLink(cluster);
updateSitemap(sitemapUrls);
console.log(JSON.stringify({ canonicalUpdated, mcqCreated, skipped, sitemapUrls: sitemapUrls.length, pyqPages: 0, note: 'PYQ pages skipped because current local banks have no verified year/source metadata.' }, null, 2));

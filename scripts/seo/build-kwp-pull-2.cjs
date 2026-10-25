#!/usr/bin/env node
/**
 * Builds scripts/seo/kwp-pull-2-upload.csv — a Google Keyword Planner SEED file for the
 * tiers the first export under-covered: UPSC/TNPSC/SSC/RRB subjects + topics, NCERT class x
 * subject (+ representative chapters), Samacheer class x subject.
 *
 * Seeds only. Not an SEO implementation. Production metadata is not touched.
 * Excludes: competitor brands, year-stamped queries, bare exam names, PDF/download variants.
 * Book-back / textbook exercise Q&A IS included for NCERT and Samacheer class pages — the app
 * genuinely provides book-back questions and answers for those, so that intent matches the page.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const rows = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets', 'quiz-index.json'), 'utf8'));

const seeds = new Set();
const add = (s) => {
  s = s.trim().replace(/\s+/g, ' ').toLowerCase();
  if (!s || s.length >= 80) return;
  seeds.add(s);
};

/* readable name from a URL slug */
const ABBR = { eco: 'economy', geo: 'geography', msme: 'msme', tn: 'tamil nadu', 'sci': 'science', 'tech': 'technology', aware: 'awareness', govt: 'government', intl: 'international', ir: 'international relations', pyq: '' };
function name(slug) {
  return slug.split('-').map((w) => (ABBR[w] !== undefined ? ABBR[w] : w)).join(' ').replace(/\s+/g, ' ').trim();
}
const seg = (u) => u.replace(/^\/|\/$/g, '').split('/');

/* ------------------------------------------------ subject-tier seeds -------- */
const SUBJ = {
  'upsc/polity': ['indian polity mcq for upsc', 'indian polity questions for upsc prelims'],
  'upsc/history': ['modern history mcq for upsc', 'history mcq for upsc prelims', 'art and culture mcq for upsc'],
  'upsc/geography': ['geography mcq for upsc', 'indian geography mcq for upsc prelims'],
  'upsc/economics': ['indian economy mcq for upsc', 'economy mcq for upsc prelims'],
  'upsc/environment': ['environment and ecology mcq for upsc', 'environment mcq for upsc prelims'],
  'upsc/science': ['science and technology mcq for upsc', 'science and tech mcq for upsc prelims'],
  'upsc/csat-quant': ['csat maths questions', 'csat quant questions for upsc prelims'],
  'upsc/csat-english': ['csat comprehension questions for upsc', 'csat english questions for upsc prelims'],

  'tnpsc/tamil': ['tnpsc general tamil questions and answers', 'general tamil questions for tnpsc group 4'],
  'tnpsc/history': ['tnpsc history questions and answers', 'history questions for tnpsc group 4'],
  'tnpsc/polity': ['tnpsc polity questions and answers', 'indian polity questions for tnpsc'],
  'tnpsc/geography': ['tnpsc geography questions and answers', 'geography questions for tnpsc group 4'],
  'tnpsc/science': ['tnpsc general science questions and answers', 'general science questions for tnpsc'],
  'tnpsc/economics': ['indian economy questions for tnpsc', 'tnpsc economics questions and answers'],
  'tnpsc/maths': ['tnpsc aptitude and mental ability questions', 'aptitude questions for tnpsc group 4'],

  'ssc/quant': ['ssc cgl maths practice questions', 'quantitative aptitude questions for ssc cgl'],
  'ssc/reasoning': ['ssc cgl reasoning questions', 'reasoning questions for ssc cgl'],
  'ssc/english': ['ssc cgl english questions', 'english practice questions for ssc cgl'],
  'ssc/history': ['ssc history gk questions', 'history questions for ssc cgl'],
  'ssc/polity': ['ssc polity gk questions', 'indian polity questions for ssc cgl'],
  'ssc/geography': ['ssc geography gk questions', 'geography questions for ssc cgl'],
  'ssc/science': ['ssc general science questions', 'general science questions for ssc cgl'],
  'ssc/economy': ['ssc economy gk questions', 'economy questions for ssc cgl'],

  'rrb/general-aware': ['rrb ntpc general awareness questions', 'rrb ntpc gk questions'],
  'rrb/maths': ['rrb ntpc maths questions', 'railway maths questions'],
  'rrb/polity': ['rrb ntpc polity questions', 'polity questions for rrb ntpc'],
  'rrb/reasoning': ['rrb ntpc reasoning questions', 'railway reasoning questions'],
  'rrb/science': ['rrb group d general science questions', 'general science questions for rrb ntpc'],
};

/* SSC General Awareness umbrella (no dedicated URL yet, but real intent to size) */
['ssc cgl general awareness questions', 'ssc gk gs questions for cgl'].forEach(add);

/* ------------------------------------------------ per-row generation ------- */
for (const r of rows) {
  if (r.type !== 'Subject' && r.type !== 'Topic') continue;
  const s = seg(r.url);
  const exam = s[0];
  const subSlug = s[1];
  const leaf = s[2] || '';

  if (r.type === 'Subject') {
    (SUBJ[`${exam}/${subSlug}`] || []).forEach(add);
    continue;
  }

  // Topic rows -------------------------------------------------------------
  const cls = leaf.match(/^class(\d+)$/i);

  if ((exam === 'ncert') && cls) {
    const N = cls[1];
    const sub = name(subSlug === 'social-science' ? 'social science' : subSlug);
    add(`class ${N} ${sub} mcq`);
    add(`ncert class ${N} ${sub} mcq`);
    add(`class ${N} ${sub} mcq chapter wise`);
    if (['science', 'maths', 'social science', 'biology', 'chemistry', 'physics', 'history', 'geography', 'economics'].includes(sub)) {
      add(`cbse class ${N} ${sub} mcq`);
    }
    if (['biology', 'chemistry', 'physics'].includes(sub) && ['11', '12'].includes(N)) {
      add(`class ${N} ${sub} mcq for neet`);
    }
    // book-back / textbook exercise Q&A — app supports this for NCERT class pages
    add(`ncert class ${N} ${sub} exercise solutions`);
    add(`ncert class ${N} ${sub} textbook questions and answers`);
    add(`class ${N} ${sub} ncert back exercise questions`);
    continue;
  }

  if (exam === 'samacheer' && cls) {
    const N = cls[1];
    const sub = name(subSlug === 'social-science' ? 'social science' : subSlug);
    add(`${N}th samacheer ${sub} important questions`);
    add(`samacheer kalvi ${N}th ${sub} important questions`);
    add(`samacheer kalvi ${N}th ${sub} online test`);
    // book-back Q&A — app supports this for Samacheer class pages
    add(`${N}th samacheer ${sub} book back questions`);
    add(`samacheer kalvi ${N}th ${sub} book back answers`);
    add(`${N}th ${sub} book back questions and answers`);
    if (subSlug === 'tamil') add(`${N}th tamil online test tnpsc`);
    if (['history', 'geography', 'science', 'economics', 'polity'].includes(subSlug)) {
      add(`${N}th ${sub} questions for tnpsc`);
    }
    continue;
  }

  // real chapter / skill topics (upsc/tnpsc/ssc/rrb)
  const t = name(leaf);
  if (!t) continue;
  if (exam === 'upsc') {
    if (subSlug.startsWith('csat')) {
      add(`${t} questions for upsc csat`);
      add(`csat ${t} practice questions`);
    } else {
      add(`${t} mcq for upsc`);
      add(`${t} questions for upsc prelims`);
    }
  } else if (exam === 'tnpsc') {
    add(`${t} questions for tnpsc`);
    add(`${t} tnpsc questions and answers`);
    if (subSlug === 'tamil') add(`${t} questions in tamil for tnpsc`);
  } else if (exam === 'ssc') {
    add(`${t} questions for ssc cgl`);
    add(`${t} practice questions for ssc cgl`);
  } else if (exam === 'rrb') {
    add(`${t} questions for rrb ntpc`);
    add(`${t} questions for rrb group d`);
  }
}

/* ------------------------------------------------ representative NCERT chapters */
[
  'photosynthesis class 11 mcq', 'cell the unit of life class 11 mcq', 'laws of motion class 11 mcq',
  'chemical bonding class 11 mcq', 'the living world class 11 mcq',
  'human reproduction class 12 mcq', 'electrochemistry class 12 mcq', 'current electricity class 12 mcq',
  'principles of inheritance class 12 mcq', 'solutions class 12 chemistry mcq',
  'life processes class 10 mcq', 'chemical reactions and equations class 10 mcq',
  'the human eye class 10 mcq', 'real numbers class 10 mcq', 'nationalism in india class 10 mcq',
  'resources and development class 10 mcq', 'light reflection and refraction class 10 mcq',
  'motion class 9 mcq', 'matter in our surroundings class 9 mcq',
  'the fundamental unit of life class 9 mcq', 'the french revolution class 9 mcq',
  'nutrition in plants class 7 mcq', 'the indian constitution class 8 mcq',
].forEach(add);

/* ------------------------------------------------ write ------------------- */
const out = [...seeds].sort();
fs.writeFileSync(path.join(__dirname, 'kwp-pull-2-upload.csv'), 'Keyword\n' + out.join('\n') + '\n', 'utf8');
console.log('wrote scripts/seo/kwp-pull-2-upload.csv —', out.length, 'unique seeds');
const byExam = {};
for (const k of out) {
  const e = /\bupsc\b/.test(k) ? 'upsc' : /\btnpsc\b/.test(k) ? 'tnpsc' : /\bssc\b|\bcgl\b/.test(k) ? 'ssc'
    : /\brrb\b|railway/.test(k) ? 'rrb' : /samacheer|\d+th /.test(k) ? 'samacheer'
    : /class \d+|cbse|ncert|neet/.test(k) ? 'ncert' : 'other';
  byExam[e] = (byExam[e] || 0) + 1;
}
console.log(byExam);
console.log('longest:', out.reduce((a, b) => (b.length > a.length ? b : a)).length, 'chars');

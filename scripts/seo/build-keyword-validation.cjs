#!/usr/bin/env node
/**
 * Builds scripts/seo/keyword-validation.csv — one row per existing indexable
 * exam / subject / topic / class URL, from assets/quiz-index.json.
 *
 * SERP-intent pass only. india_monthly_volume + keyword_difficulty stay empty.
 * Every row: status = PENDING_VOLUME_VALIDATION, serp_geo_flag = directional_non_india_geo.
 * Production metadata is NOT touched. No new URLs are invented.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const INDEX = path.join(ROOT, 'assets', 'quiz-index.json');
const OUT = path.join(__dirname, 'keyword-validation.csv');

const rows = JSON.parse(fs.readFileSync(INDEX, 'utf8'));

/* ---- helpers ---- */
const cap = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());
const titlecase = (s) => s.split(' ').map((w) => (/^(and|for|the|of|in|to|a|with|&)$/i.test(w) ? w : cap(w))).join(' ');
function seg(url) { return url.replace(/^\/|\/$/g, '').split('/'); }
function readFile(url) {
  const p = path.join(ROOT, url.replace(/^\//, ''), 'index.html');
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}
function currentTitle(html) { const m = html.match(/<title>([^<]*)<\/title>/i); return m ? m[1].trim() : ''; }
function currentH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}
function currentCanonical(html, url) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  return m ? m[1] : `https://mindgains.ai${url}`;
}
const csv = (v) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/* ---- per-exam config (chosen primary from the SERP-intent pass, directional) ---- */
const EXAM_HUB = {
  upsc: { kw: 'upsc prelims practice questions', var: 'upsc daily quiz|upsc prelims mcq|upsc online test|upsc prelims quiz', h1: 'UPSC Prelims Practice — Daily Quiz & Topic-wise MCQs' },
  tnpsc: { kw: 'tnpsc online test', var: 'tnpsc free online test|tnpsc questions and answers|tnpsc mock test tamil and english|tnpsc group 4 mock test', h1: 'TNPSC Online Test — Free Practice Questions in Tamil & English' },
  ssc: { kw: 'ssc cgl practice questions', var: 'ssc cgl previous year questions topic wise|ssc questions and answers|ssc cgl mock test|ssc cgl chapter wise questions', h1: 'SSC CGL & CHSL Practice — Topic-wise Questions & Mock Tests' },
  rrb: { kw: 'rrb ntpc practice questions', var: 'rrb group d practice questions|rrb ntpc mock test|railway exam questions|rrb group d gk questions', h1: 'RRB NTPC & Group D Practice — Questions & Mock Tests' },
  ncert: { kw: 'ncert mcq questions for class 6 to 12', var: 'ncert mcq with answers|mcq questions for class 6 to 12|cbse ncert mcq chapter wise|ncert exemplar mcq', h1: 'NCERT / CBSE MCQ Questions for Class 6–12 (with Answers)' },
  samacheer: { kw: 'samacheer kalvi important questions', var: 'samacheer kalvi book back questions and answers|samacheer kalvi mcq|samacheer kalvi online test|samacheer kalvi question bank', h1: 'Samacheer Kalvi Class 6–12 — Important Questions & Practice' },
};

/* subject primary overrides, keyed by exam/subjectSlug */
const SUBJECT_KW = {
  'upsc/polity': 'indian polity mcq for upsc',
  'upsc/history': 'modern history mcq for upsc',
  'upsc/geography': 'geography mcq for upsc',
  'upsc/economics': 'indian economy mcq for upsc',
  'upsc/environment': 'environment and ecology mcq for upsc',
  'upsc/science': 'science and technology mcq for upsc',
  'upsc/csat-quant': 'csat maths questions',
  'upsc/csat-english': 'csat comprehension practice',
  'tnpsc/tamil': 'tnpsc general tamil questions and answers',
  'tnpsc/history': 'tnpsc history questions in tamil',
  'tnpsc/polity': 'tnpsc polity questions',
  'tnpsc/geography': 'tnpsc geography questions and answers',
  'tnpsc/science': 'tnpsc general science important questions',
  'tnpsc/economics': 'tnpsc indian economy questions',
  'tnpsc/maths': 'tnpsc aptitude and mental ability questions',
  'ssc/quant': 'ssc cgl maths questions',
  'ssc/reasoning': 'ssc reasoning questions with answers',
  'ssc/english': 'ssc cgl english questions',
  'ssc/history': 'ssc history gk questions',
  'ssc/polity': 'ssc polity gk questions',
  'ssc/geography': 'ssc geography gk questions',
  'ssc/science': 'ssc general science gk questions',
  'ssc/economy': 'ssc economy gk questions',
  'rrb/maths': 'rrb ntpc maths questions',
  'rrb/reasoning': 'rrb ntpc reasoning questions',
  'rrb/science': 'rrb group d general science questions',
  'rrb/general-aware': 'rrb ntpc general awareness questions',
  'rrb/polity': 'rrb ntpc polity questions',
};

const EXAM_LABEL = { upsc: 'UPSC', tnpsc: 'TNPSC', ssc: 'SSC', rrb: 'RRB', ncert: 'NCERT', samacheer: 'Samacheer Kalvi' };

function subjectName(indexTitle, exam) {
  // index title like "UPSC Polity" / "NCERT Biology" / "Railway Mathematics"
  return indexTitle.replace(/^(UPSC|TNPSC|SSC|RRB|Railway|NCERT|Samacheer)\s+/i, '').trim();
}

function buildSubject(r) {
  const s = seg(r.url); const exam = s[0]; const subSlug = s[1];
  const key = `${exam}/${subSlug}`;
  const subName = subjectName(r.title, exam);
  const primary = SUBJECT_KW[key] || `${exam} ${subSlug.replace(/-/g, ' ')} questions`;
  let h1, title, variants, note = '';
  if (exam === 'upsc') {
    h1 = `${subName} MCQs for UPSC Prelims`;
    title = `${subName} MCQs for UPSC Prelims — Topic-wise Practice | MindGains`;
    variants = `${subSlug.replace(/-/g,' ')} mcq for upsc prelims|mcq on ${subName.toLowerCase()}|${subName.toLowerCase()} questions for upsc|${subName.toLowerCase()} previous year questions upsc`;
  } else if (exam === 'tnpsc') {
    h1 = `TNPSC ${subName} — Questions & Answers (Tamil & English)`;
    title = `TNPSC ${subName} Questions & Answers — Tamil & English | MindGains`;
    variants = `tnpsc ${subSlug} important questions and answers|${subName.toLowerCase()} questions for tnpsc group 4|${subName.toLowerCase()} questions in tamil tnpsc|tnpsc ${subSlug} mcq`;
    if (subSlug === 'tamil') note = 'CANNIBALISATION vs /samacheer/tamil/ (book-back intent) — keep exam-prep framing.';
    if (subSlug === 'maths') note = 'Native subject name is "Aptitude & Mental Ability", not "Mathematics".';
  } else if (exam === 'ssc') {
    const gk = ['history','polity','geography','science','economy'].includes(subSlug);
    h1 = gk ? `${subName} Questions for SSC (General Awareness)` : `${subName} Questions for SSC CGL & CHSL`;
    title = gk ? `SSC ${subName} GK Questions — General Awareness Practice | MindGains` : `SSC ${subName} Questions & Practice | MindGains`;
    variants = `${subSlug} questions for ssc cgl|ssc ${subSlug} practice questions|ssc cgl ${subSlug} previous year questions|${subSlug} mcq for ssc`;
    if (gk) note = 'GAP: umbrella "ssc cgl general awareness questions" has no page — recommend new /ssc/general-awareness/; demote this to a child topic.';
  } else if (exam === 'rrb') {
    h1 = `${subName} Questions for RRB NTPC & Group D`;
    title = `RRB NTPC ${subName} Questions — Practice | MindGains`;
    variants = `railway ${subSlug} questions|${subName.toLowerCase()} questions for rrb group d|rrb ntpc ${subSlug} practice|rrb ${subSlug} questions and answers`;
    if (subSlug === 'polity') note = 'THIN: no dedicated ranking pages in SERP — merge into /rrb/general-aware/ as a child topic.';
  } else if (exam === 'ncert') {
    h1 = `NCERT ${subName} MCQs — Class 6 to 12, Chapter-wise`;
    title = `NCERT ${subName} MCQs Class 6–12 — Chapter-wise Practice | MindGains`;
    variants = `${subName.toLowerCase()} mcq for class 11 and 12|ncert ${subName.toLowerCase()} objective questions|${subName.toLowerCase()} mcq chapter wise|class 6 to 12 ${subName.toLowerCase()} mcq`;
    note = 'Subject hub stays broad and links DOWN to class pages; must not compete for "class N subject mcq".';
  } else if (exam === 'samacheer') {
    h1 = `Samacheer Kalvi ${subName} — Important Questions & MCQ Practice`;
    title = `Samacheer Kalvi ${subName} Important Questions & Practice | MindGains`;
    variants = `samacheer kalvi ${subSlug} important questions|${subName.toLowerCase()} book back questions samacheer|samacheer ${subSlug} question and answer|samacheer kalvi ${subSlug} guide`;
    note = '"book back answers" is a solutions intent — only claim where the page reproduces textbook exercises.';
  }
  return { exam, tier: 'subject', parent: `/${exam}/`, primary, variants, h1, title,
    intent: exam === 'samacheer' ? 'transactional / solutions' : 'transactional', note };
}

function buildTopic(r) {
  const s = seg(r.url); const exam = s[0]; const subSlug = s[1]; const leaf = s[2] || '';
  const parent = `/${exam}/${subSlug}/`;
  const classMatch = leaf.match(/^class(\d+)$/i);
  if ((exam === 'ncert' || exam === 'samacheer') && classMatch) {
    const N = classMatch[1];
    const subName = cap(subSlug);
    if (exam === 'ncert') {
      const neet = ['biology', 'chemistry', 'physics'].includes(subSlug) && ['11', '12'].includes(N);
      return {
        exam, tier: 'class', parent, intent: 'transactional',
        primary: `class ${N} ${subSlug} mcq chapter wise`,
        variants: `mcq questions for class ${N} ${subSlug} with answers|ncert class ${N} ${subSlug} mcq|class ${N} ${subSlug} mcq online test${neet ? `|class ${N} ${subSlug} mcq for neet` : ''}`,
        h1: `Class ${N} ${subName} MCQs — Chapter-wise (with Answers)`,
        title: `Class ${N} ${subName} MCQ Questions with Answers — Chapter-wise | MindGains`,
        note: `Workhorse tier.${neet ? ' NEET is a strong secondary intent for this class/subject.' : ''}`,
      };
    }
    return {
      exam, tier: 'class', parent, intent: 'transactional / solutions',
      primary: `${N}th samacheer ${subSlug} important questions`,
      variants: `samacheer kalvi ${N}th ${subSlug} book back questions|${N}th ${subSlug} question and answer samacheer|${N}th samacheer ${subSlug} model question paper|${N}th ${subSlug} quiz tamil english`,
      h1: `Samacheer Kalvi Class ${N} ${subName} — Important Questions & MCQ Practice`,
      title: `Samacheer Kalvi ${N}th ${subName} Important Questions & Practice | MindGains`,
      note: subSlug === 'tamil' ? 'CANNIBALISATION vs /tnpsc/tamil/ — school/book-back framing here.' : 'Only use "book back" wording if the page reproduces textbook exercises.',
    };
  }
  // real chapter topic
  const topicName = r.title.replace(/\s+Quiz$/i, '').trim();
  const tl = topicName.toLowerCase();
  const map = {
    upsc: { p: `${tl} mcq for upsc`, v: `mcq on ${tl}|${tl} questions for upsc|${tl} mcq with answers|${tl} pyq upsc`, h: `${topicName} MCQs for UPSC` },
    tnpsc: { p: `${tl} questions for tnpsc`, v: `${tl} tnpsc questions and answers|${tl} quiz tnpsc|${tl} important questions tnpsc|${tl} questions in tamil`, h: `${topicName} Questions for TNPSC` },
    ssc: { p: `${tl} questions for ssc cgl`, v: `${tl} for ssc cgl|${tl} mcq ssc|${tl} practice questions ssc|${tl} ssc cgl previous year questions`, h: `${topicName} Questions for SSC CGL` },
    rrb: { p: `${tl} questions for rrb ntpc`, v: `${tl} for rrb group d|${tl} railway exam questions|${tl} rrb ntpc previous year questions`, h: `${topicName} Questions for RRB NTPC` },
  }[exam] || { p: `${tl} mcq`, v: `${tl} questions with answers|${tl} practice questions|${tl} quiz`, h: `${topicName} Practice Questions` };
  return {
    exam, tier: 'topic', parent, intent: 'transactional',
    primary: map.p, variants: map.v, h1: map.h,
    title: `${map.h} — Practice MCQs | MindGains`,
    note: '',
  };
}

/* ---- assemble ---- */
const HEADER = [
  'status', 'serp_geo_flag', 'exam', 'tier', 'canonical_url', 'parent_url',
  'proposed_primary_keyword', 'close_variants', 'intent',
  'proposed_seo_title', 'title_locked', 'proposed_search_h1',
  'current_title', 'current_h1', 'pyq_safe',
  'india_monthly_volume', 'keyword_difficulty', 'notes',
];
const out = [HEADER.join(',')];
let counts = { exam: 0, subject: 0, topic: 0, class: 0, hub: 0, skipped: 0 };

for (const r of rows) {
  if (r.type === 'Hub') {
    // /quiz/ — product search surface, kept for completeness, not a keyword target
    const html = readFile(r.url);
    out.push([
      'PENDING_VOLUME_VALIDATION', 'directional_non_india_geo', '-', 'quiz-hub',
      currentCanonical(html, r.url), '/', '(none — product search surface)', '', 'navigational',
      '(keep current)', 'yes', '',
      currentTitle(html), currentH1(html), 'false', '', '',
      'Internal search hub — not a keyword target. Low sitemap priority; canonical self.',
    ].map(csv).join(','));
    counts.hub++;
    continue;
  }
  if (r.type === 'Exam') {
    const exam = seg(r.url)[0];
    const cfg = EXAM_HUB[exam];
    if (!cfg) { counts.skipped++; continue; }
    const html = readFile(r.url);
    out.push([
      'PENDING_VOLUME_VALIDATION', 'directional_non_india_geo', exam, 'exam-hub',
      currentCanonical(html, r.url), '/', cfg.kw, cfg.var, 'transactional',
      currentTitle(html) || '(current, locked)', 'yes', cfg.h1,
      currentTitle(html), currentH1(html), 'false', '', '',
      'SEO <title>/<meta> LOCKED to live values — do not change. Do NOT target bare "' + exam + '" (navigational). Hybrid search-H1 already in build-exam-hubs.cjs.',
    ].map(csv).join(','));
    counts.exam++;
    continue;
  }
  if (r.type === 'Subject') {
    const b = buildSubject(r);
    const html = readFile(r.url);
    out.push([
      'PENDING_VOLUME_VALIDATION', 'directional_non_india_geo', b.exam, 'subject',
      currentCanonical(html, r.url), b.parent, b.primary, b.variants, b.intent,
      b.title, 'no', b.h1,
      currentTitle(html), currentH1(html), 'false', '', '',
      b.note,
    ].map(csv).join(','));
    counts.subject++;
    continue;
  }
  if (r.type === 'Topic') {
    const b = buildTopic(r);
    const html = readFile(r.url);
    out.push([
      'PENDING_VOLUME_VALIDATION', 'directional_non_india_geo', b.exam, b.tier,
      currentCanonical(html, r.url), b.parent, b.primary, b.variants, b.intent,
      b.title, 'no', b.h1,
      currentTitle(html), currentH1(html), 'false', '', '',
      b.note,
    ].map(csv).join(','));
    counts[b.tier]++;
    continue;
  }
  counts.skipped++;
}

fs.writeFileSync(OUT, out.join('\n') + '\n', 'utf8');
console.log('Wrote', path.relative(ROOT, OUT));
console.log(counts, 'total rows:', out.length - 1);

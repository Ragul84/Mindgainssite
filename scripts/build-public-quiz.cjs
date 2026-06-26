#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENV_PATH = process.env.MINDGAINS_ENV || 'D:/mindwhite/.env';
const SITE_URL = (process.env.BASE_URL || process.env.SITE_URL || 'https://mindgains.ai').replace(/\/$/, '');

function readEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i > 0) out[line.slice(0, i)] = line.slice(i + 1);
  }
  return out;
}

const env = { ...readEnv(ENV_PATH), ...process.env };
const REDIS_URL = env.UPSTASH_REDIS_REST_URL || env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = env.UPSTASH_REDIS_REST_TOKEN || env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
if (!REDIS_URL || !REDIS_TOKEN) {
  throw new Error('Missing Upstash Redis REST URL/token');
}

const EXAMS = {
  upsc: { name: 'UPSC', desc: 'Union Public Service Commission prelims practice', color: '#37e0ff' },
  tnpsc: { name: 'TNPSC', desc: 'Tamil Nadu Public Service Commission practice', color: '#00d4c7' },
  ssc: { name: 'SSC', desc: 'CGL, CHSL, MTS, CPO and GD practice', color: '#f59e0b' },
  rrb: { name: 'Railway', desc: 'RRB NTPC, Group D, ALP and JE practice', color: '#f43f5e' },
  samacheer: { name: 'Samacheer', desc: 'Tamil Nadu school curriculum quizzes', color: '#6366f1' },
  ncert: { name: 'NCERT', desc: 'Class 6 to 12 NCERT foundation quizzes', color: '#f97316' },
};

const EXAM_HUBS = {
  upsc: '/upsc/',
  tnpsc: '/tnpsc/',
  ssc: '/ssc/',
  ncert: '/ncert/',
  samacheer: '/samacheer/',
};

const SUBJECT_NAMES = {
  maths: 'Mathematics',
  quant: 'Quantitative Aptitude',
  history: 'History',
  geography: 'Geography',
  polity: 'Polity',
  economics: 'Economy',
  economy: 'Economy',
  science: 'Science',
  environment: 'Environment',
  english: 'English',
  tamil: 'Tamil',
  reasoning: 'Reasoning',
  current_affairs: 'Current Affairs',
  physics: 'Physics',
  chemistry: 'Chemistry',
  biology: 'Biology',
  computer: 'Computer Science',
  banking: 'Banking Awareness',
  csat_quant: 'CSAT Quantitative Aptitude',
  csat_english: 'CSAT Comprehension',
};

function htmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function attr(value) {
  return htmlEscape(value).replace(/\n/g, ' ');
}

function slugText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'quiz';
}

function titleize(value) {
  return String(value || '')
    .replace(/_/g, '-')
    .split('-')
    .filter(Boolean)
    .map((word) => {
      const upper = { dpsp: 'DPSP', gk: 'GK', rbi: 'RBI', isro: 'ISRO', ncert: 'NCERT', tnpsc: 'TNPSC', upsc: 'UPSC', ssc: 'SSC', rrb: 'RRB', si: 'SI', ci: 'CI', di: 'DI' };
      return upper[word] || word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function cleanSubject(key) {
  const normalized = String(key || '').replace(/-/g, '_');
  return SUBJECT_NAMES[normalized] || titleize(key);
}

function normalizeQuestion(raw) {
  let parsed = raw;
  try {
    parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
  const question = parsed.question_text || parsed.question || parsed.prompt || parsed.passage;
  const options = Array.isArray(parsed.options) ? parsed.options : [];
  const answerIndex = Number.isInteger(parsed.answer_index) ? parsed.answer_index : Number.isInteger(parsed.correctIndex) ? parsed.correctIndex : -1;
  if (!question || options.length < 2 || answerIndex < 0 || answerIndex >= options.length) return null;
  const text = String(question).trim();
  if (!text || /textbook|publisher|qr code|answer key|preface|foreword/i.test(text)) return null;
  return {
    question: text,
    options: options.map((x) => String(x).trim()).filter(Boolean),
    answer_index: answerIndex,
    explanation: String(parsed.explanation || parsed.reason || parsed.solution || '').trim(),
    difficulty: String(parsed.difficulty || '').trim(),
  };
}

async function redis(...args) {
  const res = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + REDIS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  const text = await res.text();
  if (!res.ok) throw new Error('Redis ' + res.status + ': ' + text);
  const json = JSON.parse(text);
  return json.result;
}

async function scanKeys(pattern) {
  const keys = [];
  let cursor = '0';
  do {
    const result = await redis('SCAN', cursor, 'MATCH', pattern, 'COUNT', '1000');
    cursor = String(result[0]);
    keys.push(...result[1]);
  } while (cursor !== '0');
  return [...new Set(keys)].sort();
}

function parseQuizKey(key) {
  const prefix = 'quiz:subject:';
  if (!key.startsWith(prefix)) return null;
  const parts = key.slice(prefix.length).split(':');
  if (parts.length < 3) return null;
  const subjectKey = parts[0];
  const exam = parts[1];
  const topicId = parts.slice(2).join('-');
  if (!EXAMS[exam]) return null;
  return { key, subjectKey, exam, topicId };
}

function canonical(pathname) {
  return SITE_URL + pathname;
}

function iconMeta() {
  return `<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#37e0ff" />`;
}

function pageShell({ title, description, pathname, body, crumbs = [] }) {
  const url = canonical(pathname);
  const crumbItems = [{ name: 'Home', url: SITE_URL + '/' }, { name: 'Quiz', url: SITE_URL + '/quiz/' }, ...crumbs];
  const breadcrumbJson = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbItems.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  };
  const orgJson = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MindGains',
    url: SITE_URL,
    slogan: "India's daily learning habit",
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${htmlEscape(title)}</title>
<meta name="description" content="${attr(description)}" />
<link rel="canonical" href="${attr(url)}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${attr(title)}" />
<meta property="og:description" content="${attr(description)}" />
<meta property="og:url" content="${attr(url)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${attr(title)}" />
<meta name="twitter:description" content="${attr(description)}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/quiz-hub.css" />
${iconMeta()}
<script type="application/ld+json">${JSON.stringify(orgJson)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbJson)}</script>
</head>
<body>
<div class="bg"></div>
<header class="site-nav">
  <a class="brand" href="/">MindGains</a>
  <nav><a href="/quiz/">Quiz Hub</a><a href="/#join">Waitlist</a></nav>
</header>
<main>${body}</main>
<script src="/assets/quiz-search.js" defer></script>
</body>
</html>`;
}

function writePage(pathname, html, urls) {
  const out = path.join(ROOT, pathname.replace(/^\//, ''), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html, 'utf8');
  urls.push(pathname.endsWith('/') ? pathname : pathname + '/');
}

function statLine(items) {
  const topics = items.length;
  const questions = items.reduce((sum, item) => sum + item.questions.length, 0);
  return { topics, questions };
}

function searchBox() {
  return `<section class="search-panel">
    <label for="quiz-search">Search exams, subjects, topics</label>
    <input id="quiz-search" type="search" autocomplete="off" placeholder="Try DPSP, photosynthesis, percentage, class 10 science" />
    <div id="quiz-search-results" class="search-results" hidden></div>
  </section>`;
}

function cards(items) {
  return `<div class="grid">${items.map((item) => `<a class="card" href="${attr(item.href)}">
    <span class="pill">${htmlEscape(item.kicker || '')}</span>
    <h2>${htmlEscape(item.title)}</h2>
    <p>${htmlEscape(item.copy || '')}</p>
    <div class="meta">${htmlEscape(item.meta || '')}</div>
  </a>`).join('')}</div>`;
}

function writeQuizData(examId, subjectId, topicSlug, topic, questions) {
  const rel = `/assets/quiz-data/${examId}/${subjectId}/${topicSlug}.json`;
  const out = path.join(ROOT, rel.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({
    title: `${topic.topicName} Quiz`,
    exam: EXAMS[examId].name,
    subject: topic.subjectName,
    topic: topic.topicName,
    questions,
  }), 'utf8');
  return rel;
}

function updateHomeLink() {
  const home = path.join(ROOT, 'index.html');
  if (!fs.existsSync(home)) return;
  let html = fs.readFileSync(home, 'utf8');
  if (!html.includes('.nav-links')) {
    html = html.replace("  .tag{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#c9d2e3;border:1px solid rgba(255,255,255,.16);padding:7px 13px;border-radius:999px}", "  .tag{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#c9d2e3;border:1px solid rgba(255,255,255,.16);padding:7px 13px;border-radius:999px}\n  .nav-links{display:flex;align-items:center;gap:12px;font-size:13px;color:#c9d2e3}\n  .nav-links a{color:#dffbff;text-decoration:none;border:1px solid rgba(55,224,255,.28);background:rgba(55,224,255,.08);padding:8px 12px;border-radius:999px;transition:.18s}\n  .nav-links a:hover{border-color:rgba(55,224,255,.65);background:rgba(55,224,255,.14)}");
  }
  if (!html.includes('href="/quiz/"')) {
    html = html.replace('<nav>\n  <div class="brand">MindGains</div>\n</nav>', '<nav>\n  <div class="brand">MindGains</div>\n  <div class="nav-links"><a href="/quiz/">Quiz Hub</a></div>\n</nav>');
  }
  fs.writeFileSync(home, html, 'utf8');
}

function existingNonQuizSitemapPaths() {
  const sitemap = path.join(ROOT, 'sitemap.xml');
  if (!fs.existsSync(sitemap)) return [];
  const xml = fs.readFileSync(sitemap, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1])
    .filter((url) => url.startsWith(SITE_URL))
    .map((url) => {
      const pathname = url.slice(SITE_URL.length) || '/';
      return pathname.endsWith('/') || pathname.includes('.') ? pathname : pathname + '/';
    })
    .filter((pathname) => !pathname.startsWith('/quiz/'));
}

async function main() {
  const urls = [];
  const keys = (await scanKeys('quiz:subject:*')).map(parseQuizKey).filter(Boolean);
  const topicEntries = [];
  for (const item of keys) {
    const raw = await redis('LRANGE', item.key, 0, -1);
    const questions = (raw || []).map(normalizeQuestion).filter(Boolean);
    if (!questions.length) continue;
    const subjectId = slugText(item.subjectKey);
    const topicSlug = slugText(item.topicId);
    topicEntries.push({
      ...item,
      subjectId,
      subjectName: cleanSubject(item.subjectKey),
      topicSlug,
      topicName: titleize(item.topicId),
      questions,
      difficulty: questions.find((q) => q.difficulty)?.difficulty || 'mixed',
    });
  }

  const byExam = new Map();
  for (const t of topicEntries) {
    if (!byExam.has(t.exam)) byExam.set(t.exam, []);
    byExam.get(t.exam).push(t);
  }

  const searchIndex = [];

  const totalQuestions = topicEntries.reduce((sum, t) => sum + t.questions.length, 0);
  const homeCards = Object.entries(EXAMS)
    .filter(([id]) => byExam.has(id))
    .map(([id, exam]) => {
      const s = statLine(byExam.get(id));
      return { title: exam.name, kicker: 'Exam', copy: exam.desc, meta: `${s.topics.toLocaleString('en-IN')} topics · ${s.questions.toLocaleString('en-IN')} questions`, href: `/quiz/${id}/` };
    });

  writePage('/quiz/', pageShell({
    title: 'MindGains Quiz Hub | Public Exam Quiz Library',
    description: `Practice ${totalQuestions.toLocaleString('en-IN')} exam questions across UPSC, TNPSC, SSC, Railway, Samacheer and NCERT.`,
    pathname: '/quiz/',
    body: `<section class="hero"><p class="eyebrow">Public Quiz Hub</p><h1>India's searchable exam quiz library.</h1><p>Practice real MCQs from the same QuizHub content system used inside MindGains. Pick an exam, choose a topic, and start answering immediately.</p></section>${searchBox()}<section><div class="section-head"><h2>Popular Exams</h2><p>${topicEntries.length.toLocaleString('en-IN')} topic pages generated from Upstash Redis.</p></div>${cards(homeCards)}</section>`,
  }), urls);
  searchIndex.push({ title: 'Quiz Hub', type: 'Hub', url: '/quiz/', copy: 'Search exams, subjects and topics.' });

  for (const [examId, entries] of byExam) {
    const exam = EXAMS[examId];
    const subjectMap = new Map();
    for (const t of entries) {
      if (!subjectMap.has(t.subjectId)) subjectMap.set(t.subjectId, []);
      subjectMap.get(t.subjectId).push(t);
    }
    const s = statLine(entries);
    const subjectCards = [...subjectMap.entries()].map(([subjectId, list]) => {
      const st = statLine(list);
      const first = list[0];
      return { title: first.subjectName, kicker: exam.name, copy: `${first.subjectName} practice for ${exam.name}.`, meta: `${st.topics} topics · ${st.questions.toLocaleString('en-IN')} questions`, href: `/quiz/${examId}/${subjectId}/` };
    });
    writePage(`/quiz/${examId}/`, pageShell({
      title: `${exam.name} Quiz Practice | MindGains`,
      description: `${exam.name} quiz practice by subject. ${s.questions.toLocaleString('en-IN')} MCQs across ${s.topics} topics.`,
      pathname: `/quiz/${examId}/`,
      crumbs: [{ name: exam.name, url: canonical(`/quiz/${examId}/`) }],
      body: `<section class="hero compact"><p class="eyebrow">${htmlEscape(exam.name)}</p><h1>${htmlEscape(exam.name)} Quiz Practice</h1><p>${htmlEscape(exam.desc)}. Browse subjects and start focused practice.</p>${EXAM_HUBS[examId] ? `<a class="hub-link" href="${EXAM_HUBS[examId]}">Explore MindGains for ${htmlEscape(exam.name)} &rarr;</a>` : ''}</section>${searchBox()}<section>${cards(subjectCards)}</section>`,
    }), urls);
    searchIndex.push({ title: exam.name, type: 'Exam', url: `/quiz/${examId}/`, copy: exam.desc });

    for (const [subjectId, list] of subjectMap) {
      const subjectName = list[0].subjectName;
      const topicCards = list.map((t) => ({
        title: t.topicName,
        kicker: subjectName,
        copy: `${t.topicName} quiz questions for ${exam.name}.`,
        meta: 'Start practice',
        href: `/quiz/${examId}/${subjectId}/${t.topicSlug}/`,
      }));
      const st = statLine(list);
      writePage(`/quiz/${examId}/${subjectId}/`, pageShell({
        title: `${exam.name} ${subjectName} Quizzes | MindGains`,
        description: `${st.questions.toLocaleString('en-IN')} ${exam.name} ${subjectName} MCQs across ${st.topics} topics.`,
        pathname: `/quiz/${examId}/${subjectId}/`,
        crumbs: [{ name: exam.name, url: canonical(`/quiz/${examId}/`) }, { name: subjectName, url: canonical(`/quiz/${examId}/${subjectId}/`) }],
        body: `<section class="hero compact"><p class="eyebrow">${htmlEscape(exam.name)} · ${htmlEscape(subjectName)}</p><h1>${htmlEscape(subjectName)} Quizzes</h1><p>Choose a focused topic and practice all available questions.</p></section>${searchBox()}<section>${cards(topicCards)}</section>`,
      }), urls);
      searchIndex.push({ title: `${exam.name} ${subjectName}`, type: 'Subject', url: `/quiz/${examId}/${subjectId}/`, copy: `${st.topics} topics.` });

      for (const t of list) {
        const related = list.filter((x) => x !== t).slice(0, 6).map((x) => ({ title: x.topicName, href: `/quiz/${examId}/${subjectId}/${x.topicSlug}/` }));
        const dataPath = writeQuizData(examId, subjectId, t.topicSlug, t, t.questions);
        writePage(`/quiz/${examId}/${subjectId}/${t.topicSlug}/`, pageShell({
          title: `${t.topicName} Quiz | ${exam.name} ${subjectName} | MindGains`,
          description: `Practice ${t.questions.length.toLocaleString('en-IN')} ${t.topicName} MCQs for ${exam.name}. Shuffle questions, answer one at a time, and review explanations.`,
          pathname: `/quiz/${examId}/${subjectId}/${t.topicSlug}/`,
          crumbs: [
            { name: exam.name, url: canonical(`/quiz/${examId}/`) },
            { name: subjectName, url: canonical(`/quiz/${examId}/${subjectId}/`) },
            { name: t.topicName, url: canonical(`/quiz/${examId}/${subjectId}/${t.topicSlug}/`) },
          ],
          body: `<section class="topic-hero"><p class="eyebrow">${htmlEscape(exam.name)} · ${htmlEscape(subjectName)}</p><h1>${htmlEscape(t.topicName)} Quiz</h1><p>Practice ${htmlEscape(t.topicName)} one question at a time. Every attempt is shuffled, explanations appear after you answer, and mistakes are saved for review in this session.</p><button class="start" type="button" data-start-quiz>Start Quiz</button></section><section class="quiz-player" id="quiz-player" data-quiz-src="${attr(dataPath)}" hidden><div class="quiz-shell"><div class="quiz-status"><span data-progress>Question 1 / ${t.questions.length}</span><span data-score>Score 0</span></div><div class="quiz-meter"><span data-meter></span></div><h2 data-question></h2><div class="quiz-options" data-options></div><div class="quiz-feedback" data-feedback hidden></div><div class="quiz-actions"><button type="button" data-next disabled>Next</button></div></div></section>${related.length ? `<section><div class="section-head"><h2>Related Topics</h2></div><div class="related">${related.map((r) => `<a href="${attr(r.href)}">${htmlEscape(r.title)}</a>`).join('')}</div></section>` : ''}<section class="app-bridge"><h2>Finished this quiz?</h2><p>Imagine doing this every day with personalized lessons, revision, streaks, AI guidance and a growing community of learners across India.</p><p>Join the MindGains Early Access Waitlist and be among the first to experience India's daily learning habit platform.</p><ul><li>Daily Dose - one focused lesson every day</li><li>Personalized AI-generated learning from any PDF, YouTube video or topic</li><li>AI companion MIGA in 5 Indian languages</li><li>200,000+ quizzes with mistake revision</li><li>XP, streaks and state leaderboards</li><li>Current affairs, flashcards and smart practice</li></ul><a class="start" href="/#join">Join the Waitlist</a></section>`,
        }), urls);
        searchIndex.push({ title: `${t.topicName} Quiz`, type: 'Topic', url: `/quiz/${examId}/${subjectId}/${t.topicSlug}/`, copy: `${exam.name} ${subjectName} · ${t.questions.length} questions` });
      }
    }
  }

  const css = `*,*:before,*:after{box-sizing:border-box}body{margin:0;background:#05060a;color:#f8fbff;font-family:Inter,Barlow,sans-serif;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}.bg{position:fixed;inset:0;z-index:-1;background:radial-gradient(circle at 50% 0%,rgba(55,224,255,.22),transparent 34%),radial-gradient(circle at 10% 10%,rgba(125,108,255,.16),transparent 32%),linear-gradient(180deg,#05060a,#08111c 55%,#030407)}.site-nav{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:14px clamp(16px,4vw,56px);backdrop-filter:blur(22px);background:rgba(5,6,10,.72);border-bottom:1px solid rgba(255,255,255,.08)}.brand{display:flex;align-items:center;font-weight:700}.site-nav nav{display:flex;gap:18px;color:#cbd5e1;font-size:14px}main{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:0 0 48px}.hero,.topic-hero{padding:12px 0 18px}.hero.compact{padding-top:10px}.eyebrow{margin:0 0 8px;color:#67e8f9;text-transform:uppercase;letter-spacing:2.4px;font-size:12px;font-weight:700}.hero h1,.topic-hero h1{font-family:"Instrument Serif",serif;font-style:italic;font-size:clamp(38px,6.4vw,72px);line-height:.92;margin:0;letter-spacing:0;font-weight:400}.hero p,.topic-hero p{max-width:760px;color:rgba(248,251,255,.74);font-size:clamp(15px,1.6vw,18px);line-height:1.5;margin:12px 0 0}.hub-link{display:inline-flex;margin-top:18px;padding:12px 14px;border-radius:14px;background:rgba(55,224,255,.1);border:1px solid rgba(55,224,255,.24);color:#dffbff;font-weight:800}.search-panel{margin:8px 0 22px;padding:14px;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:rgba(255,255,255,.045);backdrop-filter:blur(26px)}.search-panel label{display:block;margin:0 0 10px;color:#91a4bd;font-size:13px}.search-panel input{width:100%;border:1px solid rgba(255,255,255,.15);border-radius:16px;background:rgba(0,0,0,.22);padding:16px 18px;color:#fff;font:inherit;outline:none}.search-panel input:focus{border-color:#37e0ff;box-shadow:0 0 0 3px rgba(55,224,255,.13)}.search-results{display:grid;gap:8px;margin-top:12px}.search-results a,.search-empty{display:flex;justify-content:space-between;gap:14px;padding:12px;border-radius:14px;background:rgba(255,255,255,.06);color:#eaf8ff}.search-empty{color:#91a4bd}.section-head{display:flex;align-items:end;justify-content:space-between;gap:14px;margin:0 0 12px}.section-head h2{font-size:28px;margin:0}.section-head p{margin:0;color:#91a4bd}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.card{min-height:150px;padding:18px;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035));transition:transform .18s,border-color .18s,background .18s}.card:hover{transform:translateY(-3px);border-color:rgba(55,224,255,.45);background:rgba(55,224,255,.08)}.pill{display:inline-flex;margin-bottom:14px;padding:7px 10px;border-radius:999px;background:rgba(55,224,255,.1);color:#67e8f9;font-size:12px;font-weight:700}.card h2{font-size:23px;line-height:1.1;margin:0 0 10px}.card p{color:#b8c4d6;line-height:1.45;margin:0 0 12px}.meta{color:#e8fbff;font-size:13px}.stats{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}.stats span{padding:10px 13px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);color:#dffbff}.start{display:inline-flex;padding:14px 20px;border-radius:16px;background:#37e0ff;color:#001014;font-weight:800}.questions{display:grid;gap:12px}.question{padding:18px;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:rgba(255,255,255,.05)}.qtop{display:flex;justify-content:space-between;color:#67e8f9;font-size:12px;text-transform:uppercase;letter-spacing:1.5px}.qtop em{font-style:normal;color:#91a4bd}.question h2{font-size:20px;line-height:1.3;margin:8px 0 12px}.question ol{display:grid;gap:8px;margin:0 0 12px;padding-left:24px}.question li{padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.045);color:#dbeafe}.question li.answer{border:1px solid rgba(52,211,153,.45);background:rgba(52,211,153,.12);color:#ecfdf5}details{border-top:1px solid rgba(255,255,255,.1);padding-top:10px;color:#cbd5e1}summary{cursor:pointer;color:#67e8f9;font-weight:700}.related{display:flex;flex-wrap:wrap;gap:10px}.related a{padding:11px 13px;border-radius:999px;background:rgba(255,255,255,.08);color:#dffbff}@media(max-width:820px){.grid{grid-template-columns:1fr}.site-nav{padding:12px 16px}.site-nav nav{gap:10px}.hero,.topic-hero{padding-top:10px}.card{min-height:auto}.section-head{display:block}.question{padding:16px}}`;
  const extraCss = `.start{position:relative;display:inline-flex;align-items:center;justify-content:center;margin-top:30px;border:1px solid rgba(103,232,249,.65);cursor:pointer;overflow:hidden;isolation:isolate;padding:16px 24px;min-height:54px;border-radius:18px;background:linear-gradient(135deg,#37e0ff,#00d4c7);color:#001014;font-weight:900;box-shadow:0 0 0 1px rgba(55,224,255,.28),0 18px 46px rgba(0,212,199,.2),0 0 32px rgba(55,224,255,.2);transition:transform .18s ease,box-shadow .18s ease}.start:before{content:'';position:absolute;inset:-2px;border-radius:inherit;background:conic-gradient(from 0deg,rgba(255,255,255,.2),#37e0ff,#00d4c7,#7d6cff,#37e0ff,rgba(255,255,255,.2));z-index:-2;transform-origin:center;animation:startGlow 4.5s linear infinite}.start:after{content:'';position:absolute;inset:2px;border-radius:16px;background:linear-gradient(135deg,#37e0ff,#00d4c7);z-index:-1}.start:hover{transform:translateY(-2px);box-shadow:0 0 0 1px rgba(55,224,255,.4),0 22px 56px rgba(0,212,199,.28),0 0 44px rgba(55,224,255,.3)}@keyframes startGlow{to{transform:rotate(1turn)}}.quiz-player{margin:22px 0 22px}.quiz-shell,.app-bridge{border:1px solid rgba(255,255,255,.12);border-radius:22px;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.04));padding:20px}.quiz-status{display:flex;align-items:center;justify-content:space-between;gap:12px;color:#dffbff;font-size:14px;font-weight:700}.quiz-meter{height:8px;margin:14px 0 18px;border-radius:999px;background:rgba(255,255,255,.1);overflow:hidden}.quiz-meter span{display:block;height:100%;width:0;background:linear-gradient(90deg,#37e0ff,#00d4c7);transition:width .25s}.quiz-shell h2{font-size:clamp(22px,3vw,34px);line-height:1.22;margin:0 0 18px}.quiz-options{display:grid;gap:10px}.quiz-options button{width:100%;text-align:left;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:rgba(255,255,255,.055);color:#f8fbff;padding:14px 16px;font:inherit;cursor:pointer;transition:.16s}.quiz-options button:hover{border-color:rgba(55,224,255,.45);background:rgba(55,224,255,.08)}.quiz-options button.correct{border-color:rgba(52,211,153,.68);background:rgba(52,211,153,.14)}.quiz-options button.wrong{border-color:rgba(248,113,113,.7);background:rgba(248,113,113,.12)}.quiz-options button:disabled{cursor:default}.quiz-feedback{margin-top:14px;padding:14px;border-radius:16px;background:rgba(255,255,255,.07);color:#dbeafe;line-height:1.48}.quiz-feedback strong{color:#fff}.quiz-actions{display:flex;justify-content:flex-end;margin-top:14px}.quiz-actions button,.result-actions button{border:0;border-radius:14px;background:#37e0ff;color:#001014;font-weight:800;padding:12px 16px;cursor:pointer}.quiz-actions button:disabled{opacity:.45;cursor:not-allowed}.result-card{display:grid;gap:12px}.result-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.result-grid div{padding:14px;border-radius:16px;background:rgba(255,255,255,.065)}.result-grid strong{display:block;font-size:24px;color:#fff}.result-actions{display:flex;flex-wrap:wrap;gap:10px}.mistake-list{display:grid;gap:10px;margin-top:8px}.mistake-list article{padding:14px;border-radius:16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1)}.app-bridge{margin:18px 0 0}.app-bridge h2{font-size:30px;margin:0 0 10px}.app-bridge p{max-width:780px;color:#cbd5e1;line-height:1.55}.app-bridge ul{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 18px;padding-left:20px;color:#dffbff}@media(max-width:820px){.start{width:100%;margin-top:26px}.quiz-shell,.app-bridge{padding:16px}.quiz-status,.result-grid{grid-template-columns:1fr;display:grid}.app-bridge ul{grid-template-columns:1fr}.quiz-actions{justify-content:stretch}.quiz-actions button{width:100%}}`;
  fs.writeFileSync(path.join(ROOT, 'assets', 'quiz-hub.css'), css + extraCss, 'utf8');

  const js = `(() => {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  let data = [];
  let indexLoaded = false;
  const input = document.getElementById('quiz-search');
  const box = document.getElementById('quiz-search-results');

  function searchable(item) {
    return [item.title, item.copy, item.type, item.url].join(' ').replace(/[/-]/g, ' ').toLowerCase();
  }

  function runSearch() {
    if (!input || !box) return;
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }
    if (!indexLoaded) {
      box.hidden = false;
      box.innerHTML = '<div class="search-empty">Loading quiz index...</div>';
      return;
    }
    const terms = q.split(/\\s+/).filter(Boolean);
    const hits = data
      .map((item) => ({ item, haystack: searchable(item) }))
      .filter(({ haystack }) => terms.every((term) => haystack.includes(term)))
      .slice(0, 10)
      .map(({ item }) => item);

    box.hidden = false;
    box.innerHTML = hits.length
      ? hits.map((i) => '<a href="' + esc(i.url) + '"><span><strong>' + esc(i.title) + '</strong><small> - ' + esc(i.copy) + '</small></span><em>' + esc(i.type) + '</em></a>').join('')
      : '<div class="search-empty">No matching quiz found. Try a topic like DPSP, photosynthesis, polity, or percentage.</div>';
  }

  if (input && box) {
    fetch('/assets/quiz-index.json')
      .then((r) => r.ok ? r.json() : Promise.reject(new Error('Search index unavailable')))
      .then((x) => { data = Array.isArray(x) ? x : []; indexLoaded = true; runSearch(); })
      .catch(() => { indexLoaded = true; data = []; runSearch(); });
    input.addEventListener('input', runSearch);
    input.addEventListener('focus', runSearch);
  }

  const player = document.getElementById('quiz-player');
  const start = document.querySelector('[data-start-quiz]');
  if (!player || !start) return;
  const src = player.dataset.quizSrc;
  const qEl = player.querySelector('[data-question]');
  const optsEl = player.querySelector('[data-options]');
  const feedback = player.querySelector('[data-feedback]');
  const next = player.querySelector('[data-next]');
  const progress = player.querySelector('[data-progress]');
  const scoreEl = player.querySelector('[data-score]');
  const meter = player.querySelector('[data-meter]');
  let quiz = null, order = [], idx = 0, score = 0, mistakes = [], started = 0, answered = false;
  const shuffle = (a) => { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
  async function load() { if (quiz) return quiz; const res = await fetch(src); quiz = await res.json(); return quiz; }
  function current() { return quiz.questions[order[idx]]; }
  function render() { const q = current(); answered = false; feedback.hidden = true; feedback.innerHTML = ''; next.disabled = true; progress.textContent = 'Question ' + (idx + 1) + ' / ' + order.length; scoreEl.textContent = 'Score ' + score; meter.style.width = Math.round((idx / order.length) * 100) + '%'; qEl.textContent = q.question; optsEl.innerHTML = q.options.map((o, i) => '<button type="button" data-option="' + i + '"><strong>' + String.fromCharCode(65 + i) + '.</strong> ' + esc(o) + '</button>').join(''); optsEl.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => answer(Number(b.dataset.option)))); }
  function answer(choice) { if (answered) return; answered = true; const q = current(); const buttons = [...optsEl.querySelectorAll('button')]; buttons.forEach((b, i) => { b.disabled = true; if (i === q.answer_index) b.classList.add('correct'); if (i === choice && i !== q.answer_index) b.classList.add('wrong'); }); const ok = choice === q.answer_index; if (ok) score++; else mistakes.push({ q, choice }); const correct = q.options[q.answer_index]; feedback.hidden = false; feedback.innerHTML = '<strong>' + (ok ? 'Correct!' : 'Incorrect') + '</strong>' + (ok ? '' : '<p>Correct Answer: ' + esc(correct) + '</p>') + (q.explanation ? '<p>' + esc(q.explanation) + '</p>' : ''); scoreEl.textContent = 'Score ' + score; next.disabled = false; }
  function finish() { const seconds = Math.max(1, Math.round((Date.now() - started) / 1000)); const accuracy = Math.round((score / order.length) * 100); meter.style.width = '100%'; qEl.textContent = 'Score'; optsEl.innerHTML = '<div class="result-card"><div class="result-grid"><div><span>Score</span><strong>' + score + ' / ' + order.length + '</strong></div><div><span>Time Taken</span><strong>' + Math.floor(seconds / 60) + 'm ' + (seconds % 60) + 's</strong></div><div><span>Accuracy</span><strong>' + accuracy + '%</strong></div></div><div class="result-actions"><button type="button" data-review>Review Mistakes</button><button type="button" data-retake>Retake Quiz</button></div><div class="mistake-list" data-mistakes hidden></div></div>'; feedback.hidden = true; next.disabled = true; next.textContent = 'Done'; optsEl.querySelector('[data-retake]').addEventListener('click', begin); optsEl.querySelector('[data-review]').addEventListener('click', () => { const list = optsEl.querySelector('[data-mistakes]'); list.hidden = !list.hidden; list.innerHTML = mistakes.length ? mistakes.map((m, i) => '<article><strong>Q' + (i + 1) + '. ' + esc(m.q.question) + '</strong><p>Your answer: ' + esc(m.q.options[m.choice] || 'Not answered') + '</p><p>Correct answer: ' + esc(m.q.options[m.q.answer_index]) + '</p>' + (m.q.explanation ? '<p>' + esc(m.q.explanation) + '</p>' : '') + '</article>').join('') : '<article>No mistakes in this attempt.</article>'; }); }
  function goNext() { if (idx >= order.length - 1) { finish(); return; } idx++; render(); }
  async function begin() { start.disabled = true; start.textContent = 'Loading quiz...'; await load(); order = shuffle(quiz.questions.map((_, i) => i)); idx = 0; score = 0; mistakes = []; started = Date.now(); next.textContent = 'Next'; player.hidden = false; start.textContent = 'Restart Quiz'; start.disabled = false; render(); player.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  start.addEventListener('click', begin);
  next.addEventListener('click', goNext);
})();`;
  fs.writeFileSync(path.join(ROOT, 'assets', 'quiz-search.js'), js, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'assets', 'quiz-index.json'), JSON.stringify(searchIndex, null, 2), 'utf8');

  fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`, 'utf8');
  const sitemapUrls = [...new Set([...urls, ...existingNonQuizSitemapPaths()])];
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map((u) => `  <url><loc>${htmlEscape(canonical(u))}</loc><changefreq>weekly</changefreq><priority>${u === '/quiz/' ? '0.9' : u.split('/').length > 5 ? '0.7' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`, 'utf8');
  updateHomeLink();
  console.log(`Generated ${urls.length} quiz pages from ${topicEntries.length} Redis topics with ${totalQuestions} questions.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

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
  <a class="brand" href="/"><span></span>MindGains</a>
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

function renderQuestion(q, index) {
  const answer = q.options[q.answer_index];
  return `<article class="question" id="q${index + 1}">
    <div class="qtop"><span>Question ${index + 1}</span>${q.difficulty ? `<em>${htmlEscape(q.difficulty)}</em>` : ''}</div>
    <h2>${htmlEscape(q.question)}</h2>
    <ol type="A">${q.options.map((option, i) => `<li${i === q.answer_index ? ' class="answer"' : ''}>${htmlEscape(option)}</li>`).join('')}</ol>
    <details><summary>Show answer</summary><p><strong>Answer:</strong> ${htmlEscape(answer)}</p>${q.explanation ? `<p>${htmlEscape(q.explanation)}</p>` : ''}</details>
  </article>`;
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
      body: `<section class="hero compact"><p class="eyebrow">${htmlEscape(exam.name)}</p><h1>${htmlEscape(exam.name)} Quiz Practice</h1><p>${htmlEscape(exam.desc)}. Browse subjects and start focused practice.</p></section>${searchBox()}<section>${cards(subjectCards)}</section>`,
    }), urls);
    searchIndex.push({ title: exam.name, type: 'Exam', url: `/quiz/${examId}/`, copy: exam.desc });

    for (const [subjectId, list] of subjectMap) {
      const subjectName = list[0].subjectName;
      const topicCards = list.map((t) => ({
        title: t.topicName,
        kicker: subjectName,
        copy: `${t.topicName} quiz questions for ${exam.name}.`,
        meta: `${t.questions.length.toLocaleString('en-IN')} questions · ${Math.max(5, Math.ceil(t.questions.length * 0.65))} min`,
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
        const duration = Math.max(5, Math.ceil(t.questions.length * 0.65));
        writePage(`/quiz/${examId}/${subjectId}/${t.topicSlug}/`, pageShell({
          title: `${t.topicName} Quiz | ${exam.name} ${subjectName} | MindGains`,
          description: `Practice all ${t.questions.length.toLocaleString('en-IN')} ${t.topicName} MCQs for ${exam.name}. Answers and explanations included.`,
          pathname: `/quiz/${examId}/${subjectId}/${t.topicSlug}/`,
          crumbs: [
            { name: exam.name, url: canonical(`/quiz/${examId}/`) },
            { name: subjectName, url: canonical(`/quiz/${examId}/${subjectId}/`) },
            { name: t.topicName, url: canonical(`/quiz/${examId}/${subjectId}/${t.topicSlug}/`) },
          ],
          body: `<section class="topic-hero"><p class="eyebrow">${htmlEscape(exam.name)} · ${htmlEscape(subjectName)}</p><h1>${htmlEscape(t.topicName)} Quiz</h1><p>Practice every available ${htmlEscape(t.topicName)} question from MindGains QuizHub. Answers and explanations are included for quick self-checking.</p><div class="stats"><span>${t.questions.length.toLocaleString('en-IN')} questions</span><span>${duration} min</span><span>${htmlEscape(t.difficulty)}</span></div><a class="start" href="#q1">Start Quiz</a></section><section class="questions">${t.questions.map(renderQuestion).join('')}</section>${related.length ? `<section><div class="section-head"><h2>Related Topics</h2></div><div class="related">${related.map((r) => `<a href="${attr(r.href)}">${htmlEscape(r.title)}</a>`).join('')}</div></section>` : ''}`,
        }), urls);
        searchIndex.push({ title: `${t.topicName} Quiz`, type: 'Topic', url: `/quiz/${examId}/${subjectId}/${t.topicSlug}/`, copy: `${exam.name} ${subjectName} · ${t.questions.length} questions` });
      }
    }
  }

  const css = `*,*:before,*:after{box-sizing:border-box}body{margin:0;background:#05060a;color:#f8fbff;font-family:Inter,Barlow,sans-serif;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}.bg{position:fixed;inset:0;z-index:-1;background:radial-gradient(circle at 50% 0%,rgba(55,224,255,.22),transparent 34%),radial-gradient(circle at 10% 10%,rgba(125,108,255,.16),transparent 32%),linear-gradient(180deg,#05060a,#08111c 55%,#030407)}.site-nav{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:14px clamp(16px,4vw,56px);backdrop-filter:blur(22px);background:rgba(5,6,10,.72);border-bottom:1px solid rgba(255,255,255,.08)}.brand{display:flex;align-items:center;gap:10px;font-weight:700}.brand span{width:10px;height:10px;border-radius:99px;background:linear-gradient(135deg,#37e0ff,#7d6cff);box-shadow:0 0 22px #37e0ff}.site-nav nav{display:flex;gap:18px;color:#cbd5e1;font-size:14px}main{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:18px 0 48px}.hero,.topic-hero{padding:18px 0 18px}.hero.compact{padding-top:14px}.eyebrow{margin:0 0 8px;color:#67e8f9;text-transform:uppercase;letter-spacing:2.4px;font-size:12px;font-weight:700}.hero h1,.topic-hero h1{font-family:"Instrument Serif",serif;font-style:italic;font-size:clamp(38px,6.4vw,72px);line-height:.92;margin:0;letter-spacing:0;font-weight:400}.hero p,.topic-hero p{max-width:760px;color:rgba(248,251,255,.74);font-size:clamp(15px,1.6vw,18px);line-height:1.5;margin:12px 0 0}.search-panel{margin:8px 0 22px;padding:14px;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:rgba(255,255,255,.045);backdrop-filter:blur(26px)}.search-panel label{display:block;margin:0 0 10px;color:#91a4bd;font-size:13px}.search-panel input{width:100%;border:1px solid rgba(255,255,255,.15);border-radius:16px;background:rgba(0,0,0,.22);padding:16px 18px;color:#fff;font:inherit;outline:none}.search-panel input:focus{border-color:#37e0ff;box-shadow:0 0 0 3px rgba(55,224,255,.13)}.search-results{display:grid;gap:8px;margin-top:12px}.search-results a{display:flex;justify-content:space-between;gap:14px;padding:12px;border-radius:14px;background:rgba(255,255,255,.06);color:#eaf8ff}.section-head{display:flex;align-items:end;justify-content:space-between;gap:14px;margin:0 0 12px}.section-head h2{font-size:28px;margin:0}.section-head p{margin:0;color:#91a4bd}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.card{min-height:150px;padding:18px;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035));transition:transform .18s,border-color .18s,background .18s}.card:hover{transform:translateY(-3px);border-color:rgba(55,224,255,.45);background:rgba(55,224,255,.08)}.pill{display:inline-flex;margin-bottom:14px;padding:7px 10px;border-radius:999px;background:rgba(55,224,255,.1);color:#67e8f9;font-size:12px;font-weight:700}.card h2{font-size:23px;line-height:1.1;margin:0 0 10px}.card p{color:#b8c4d6;line-height:1.45;margin:0 0 12px}.meta{color:#e8fbff;font-size:13px}.stats{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}.stats span{padding:10px 13px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);color:#dffbff}.start{display:inline-flex;padding:14px 20px;border-radius:16px;background:#37e0ff;color:#001014;font-weight:800}.questions{display:grid;gap:12px}.question{padding:18px;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:rgba(255,255,255,.05)}.qtop{display:flex;justify-content:space-between;color:#67e8f9;font-size:12px;text-transform:uppercase;letter-spacing:1.5px}.qtop em{font-style:normal;color:#91a4bd}.question h2{font-size:20px;line-height:1.3;margin:8px 0 12px}.question ol{display:grid;gap:8px;margin:0 0 12px;padding-left:24px}.question li{padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.045);color:#dbeafe}.question li.answer{border:1px solid rgba(52,211,153,.45);background:rgba(52,211,153,.12);color:#ecfdf5}details{border-top:1px solid rgba(255,255,255,.1);padding-top:10px;color:#cbd5e1}summary{cursor:pointer;color:#67e8f9;font-weight:700}.related{display:flex;flex-wrap:wrap;gap:10px}.related a{padding:11px 13px;border-radius:999px;background:rgba(255,255,255,.08);color:#dffbff}@media(max-width:820px){.grid{grid-template-columns:1fr}.site-nav{padding:12px 16px}.site-nav nav{gap:10px}.hero,.topic-hero{padding-top:12px}.card{min-height:auto}.section-head{display:block}.question{padding:16px}}`;
  fs.writeFileSync(path.join(ROOT, 'assets', 'quiz-hub.css'), css, 'utf8');

  const js = `(()=>{let data=[];const input=document.getElementById('quiz-search');const box=document.getElementById('quiz-search-results');if(!input||!box)return;fetch('/assets/quiz-index.json').then(r=>r.json()).then(x=>data=x).catch(()=>{});input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();if(q.length<2){box.hidden=true;box.innerHTML='';return;}const hits=data.filter(i=>(i.title+' '+i.copy+' '+i.type).toLowerCase().includes(q)).slice(0,8);box.innerHTML=hits.map(i=>'<a href="'+i.url+'"><span><strong>'+i.title+'</strong><small> · '+i.copy+'</small></span><em>'+i.type+'</em></a>').join('');box.hidden=!hits.length;});})();`;
  fs.writeFileSync(path.join(ROOT, 'assets', 'quiz-search.js'), js, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'assets', 'quiz-index.json'), JSON.stringify(searchIndex, null, 2), 'utf8');

  fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${htmlEscape(canonical(u))}</loc><changefreq>weekly</changefreq><priority>${u === '/quiz/' ? '0.9' : u.split('/').length > 5 ? '0.7' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`, 'utf8');
  updateHomeLink();
  console.log(`Generated ${urls.length} quiz pages from ${topicEntries.length} Redis topics with ${totalQuestions} questions.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

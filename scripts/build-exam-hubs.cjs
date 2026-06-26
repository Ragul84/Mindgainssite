#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = (process.env.BASE_URL || process.env.SITE_URL || 'https://mindgains.ai').replace(/\/$/, '');

const HUBS = {
  upsc: {
    exam: 'UPSC',
    title: 'Best AI for UPSC Preparation | MindGains',
    description: 'Prepare for UPSC with MindGains, an AI-powered daily learning platform with Daily Dose lessons, quizzes, revision tools, current affairs, Study Lab and MIGA.',
    audience: 'UPSC aspirants',
    scope: 'Polity, History, Economy, Geography, Environment and Current Affairs',
    exams: 'Prelims-focused daily preparation',
    quiz: '/quiz/upsc/',
    quizLabel: 'Explore UPSC Quizzes',
    subjects: ['Polity', 'History', 'Economy', 'Geography', 'Environment', 'Current Affairs'],
    related: [
      ['/quiz/upsc/polity/fundamental-rights/', 'Fundamental Rights Quiz'],
      ['/quiz/upsc/polity/dpsp/', 'DPSP Quiz'],
      ['/quiz/upsc/history/national-movement/', 'National Movement Quiz'],
      ['/blog/india-learning-crisis', 'Why learning gaps persist'],
    ],
    faqs: [
      ['Is MindGains useful for UPSC preparation?', 'MindGains is designed to help UPSC aspirants build a daily learning habit with lessons, quizzes, revision and current-affairs-aware practice.'],
      ['Does MindGains replace standard UPSC books?', 'No. MindGains works best as a daily practice and revision layer alongside standard books, classes and notes.'],
      ['Can I practice UPSC quizzes on the website?', 'Yes. The public Quiz Hub includes UPSC topic quizzes, while the app experience adds Daily Dose, revision and AI study tools.'],
    ],
  },
  tnpsc: {
    exam: 'TNPSC',
    title: 'Best AI for TNPSC Preparation | MindGains',
    description: 'Prepare for TNPSC Group 1, Group 2 and Group 4 with MindGains, an AI-powered learning app for daily lessons, quizzes, Tamil, General Studies and revision.',
    audience: 'TNPSC aspirants',
    scope: 'Group 1, Group 2, Group 4, Tamil, History, Polity and General Studies',
    exams: 'Group 1, Group 2 and Group 4 preparation',
    quiz: '/quiz/tnpsc/',
    quizLabel: 'Explore TNPSC Quizzes',
    subjects: ['Tamil', 'History', 'Polity', 'General Studies', 'Maths', 'Science'],
    related: [
      ['/quiz/tnpsc/history/freedom-struggle/', 'Freedom Struggle Quiz'],
      ['/quiz/tnpsc/tamil/thirukkural/', 'Thirukkural Quiz'],
      ['/quiz/tnpsc/polity/fundamental-rights/', 'Fundamental Rights Quiz'],
      ['/blog/india-learning-crisis', 'Why learning gaps persist'],
    ],
    faqs: [
      ['Is MindGains useful for TNPSC Group exams?', 'MindGains supports TNPSC learners with daily lessons, public quizzes and AI-powered revision workflows for Group exam preparation.'],
      ['Does MindGains support Tamil preparation?', 'The TNPSC pathway includes Tamil-focused topics in the public Quiz Hub and app-oriented daily learning support.'],
      ['Can I use MindGains for Group 4 basics?', 'Yes. MindGains is positioned for consistent daily preparation across TNPSC Group 1, Group 2 and Group 4 learning needs.'],
    ],
  },
  ssc: {
    exam: 'SSC',
    title: 'Best AI for SSC Preparation | MindGains',
    description: 'Prepare for SSC with MindGains, an AI-powered daily learning app for Quant, Reasoning, English, General Awareness, quizzes and revision.',
    audience: 'SSC aspirants',
    scope: 'Reasoning, Quant, English and General Awareness',
    exams: 'CGL, CHSL, MTS, CPO and GD practice',
    quiz: '/quiz/ssc/',
    quizLabel: 'Explore SSC Quizzes',
    subjects: ['Reasoning', 'Quant', 'English', 'General Awareness', 'Science', 'Economy'],
    related: [
      ['/quiz/ssc/quant/percentage/', 'Percentage Quiz'],
      ['/quiz/ssc/reasoning/coding-decoding/', 'Coding Decoding Quiz'],
      ['/quiz/ssc/english/grammar/', 'English Grammar Quiz'],
      ['/blog/india-learning-crisis', 'Why learning gaps persist'],
    ],
    faqs: [
      ['Is MindGains useful for SSC preparation?', 'MindGains helps SSC learners practice daily with quizzes, revision workflows and AI-generated study support.'],
      ['Which SSC subjects does MindGains cover?', 'The public Quiz Hub includes SSC Quant, Reasoning, English, General Awareness and Science topic pages.'],
      ['Can MindGains help with daily SSC practice?', 'Yes. The product is built around a daily learning habit, which fits SSC practice and revision routines well.'],
    ],
  },
  ncert: {
    exam: 'NCERT',
    title: 'Best AI Study App for NCERT Learning | MindGains',
    description: 'Study NCERT with MindGains, an AI-powered learning platform for Class 6 to 12 Science, Maths, Social Science, quizzes, notes and revision.',
    audience: 'NCERT school students',
    scope: 'Class 6 to 12 Science, Maths and Social Science',
    exams: 'Class 6 to 12 concept practice',
    quiz: '/quiz/ncert/',
    quizLabel: 'Explore NCERT Quizzes',
    subjects: ['Science', 'Maths', 'Social Science', 'History', 'Geography', 'Economics'],
    related: [
      ['/quiz/ncert/science/class10/', 'Class 10 Science Quiz'],
      ['/quiz/ncert/maths/class10/', 'Class 10 Maths Quiz'],
      ['/quiz/ncert/history/class10/', 'Class 10 History Quiz'],
      ['/blog/india-learning-crisis', 'Why learning gaps persist'],
    ],
    faqs: [
      ['Is MindGains useful for NCERT students?', 'MindGains helps NCERT learners practice concepts with quizzes and AI-powered study workflows for notes, flashcards and revision.'],
      ['Which classes are supported?', 'The public Quiz Hub includes NCERT Class 6 to 12 topic pages across major school subjects.'],
      ['Can students generate quizzes from their own notes?', 'Study Lab is designed to help learners turn topics, PDFs, YouTube links or text into study material and practice.'],
    ],
  },
  samacheer: {
    exam: 'Samacheer',
    title: 'Best AI Study App for Samacheer Students | MindGains',
    description: 'Study Samacheer with MindGains, an AI-powered learning platform for Tamil Nadu Class 6 to 12 students with quizzes, daily lessons, notes and revision.',
    audience: 'Tamil Nadu school students',
    scope: 'Class 6 to 12 Science, Maths, Social Science and Tamil',
    exams: 'Tamil Nadu school curriculum practice',
    quiz: '/quiz/samacheer/',
    quizLabel: 'Explore Samacheer Quizzes',
    subjects: ['Tamil', 'Science', 'Maths', 'Social Science', 'History', 'Computer Science'],
    related: [
      ['/quiz/samacheer/science/class10/', 'Class 10 Science Quiz'],
      ['/quiz/samacheer/tamil/class10/', 'Class 10 Tamil Quiz'],
      ['/quiz/samacheer/maths/class10/', 'Class 10 Maths Quiz'],
      ['/blog/india-learning-crisis', 'Why learning gaps persist'],
    ],
    faqs: [
      ['Is MindGains useful for Samacheer students?', 'MindGains supports Tamil Nadu school learners with Samacheer quizzes and app-oriented daily lessons and revision tools.'],
      ['Which Samacheer classes are covered?', 'The public Quiz Hub includes Samacheer Class 6 to 12 topic pages across major subjects.'],
      ['Does MindGains support Tamil learning?', 'Samacheer and TNPSC pathways include Tamil-focused quiz and learning experiences.'],
    ],
  },
};

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function attr(value) {
  return esc(value).replace(/\n/g, ' ');
}

function readQuizCounts() {
  const indexFile = path.join(ROOT, 'assets', 'quiz-index.json');
  if (!fs.existsSync(indexFile)) return {};
  const index = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
  const counts = {};
  for (const id of Object.keys(HUBS)) {
    const exam = index.find((item) => item.type === 'Exam' && item.url === `/quiz/${id}/`);
    const topics = index.filter((item) => item.type === 'Topic' && item.url.startsWith(`/quiz/${id}/`)).length;
    counts[id] = { topics, label: exam?.copy || '' };
  }
  return counts;
}

function iconMeta() {
  return `<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#37e0ff" />`;
}

function pageShell(id, hub, body) {
  const url = `${SITE_URL}/${id}/`;
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: hub.exam, item: url },
    ],
  };
  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: hub.title.replace(' | MindGains', ''),
    description: hub.description,
    url,
    isPartOf: { '@type': 'WebSite', name: 'MindGains', url: `${SITE_URL}/` },
  };
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: hub.faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(hub.title)}</title>
<meta name="description" content="${attr(hub.description)}" />
<link rel="canonical" href="${attr(url)}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${attr(hub.title)}" />
<meta property="og:description" content="${attr(hub.description)}" />
<meta property="og:url" content="${attr(url)}" />
<meta property="og:image" content="${SITE_URL}/assets/icons/mindgains-logo-512.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${attr(hub.title)}" />
<meta name="twitter:description" content="${attr(hub.description)}" />
<meta name="twitter:image" content="${SITE_URL}/assets/icons/mindgains-logo-512.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/exam-hubs.css" />
${iconMeta()}
<script type="application/ld+json">${JSON.stringify(webPage)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
<script type="application/ld+json">${JSON.stringify(faq)}</script>
</head>
<body>
<div class="bg"></div>
<header class="site-nav">
  <a class="brand" href="/">MindGains</a>
  <nav><a href="/upsc/">UPSC</a><a href="/tnpsc/">TNPSC</a><a href="/ssc/">SSC</a><a href="/quiz/">Quiz Hub</a><a href="/#join">Waitlist</a></nav>
</header>
${body}
</body>
</html>`;
}

function hubPage(id, hub, count) {
  const subjectPills = hub.subjects.map((item) => `<span>${esc(item)}</span>`).join('');
  const related = hub.related.map(([href, label]) => `<a href="${attr(href)}">${esc(label)}<span>Open</span></a>`).join('');
  const faq = hub.faqs.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join('');
  const topicText = count?.topics ? `${count.topics.toLocaleString('en-IN')} topic pages` : 'Topic-wise public quizzes';
  const body = `<main>
  <section class="hero">
    <p class="eyebrow">${esc(hub.exam)} AI Learning Hub</p>
    <h1>Best AI for ${esc(hub.exam)} Preparation</h1>
    <p class="dek">MindGains helps ${esc(hub.audience)} build a daily learning habit through personalized lessons, quizzes, revision, current affairs and AI-powered study tools.</p>
    <div class="hero-actions"><a class="button" href="/#join">Join Waitlist</a><a class="button secondary" href="${attr(hub.quiz)}">${esc(hub.quizLabel)}</a></div>
  </section>
  <section class="section two">
    <div>
      <p class="eyebrow">Beyond content</p>
      <h2>Why ${esc(hub.exam)} preparation needs more than content</h2>
    </div>
    <p>Most learners already have videos, PDFs, notes and question banks. The gap is turning that content into a repeatable system: one focused lesson, one practice set, one revision loop and one visible reason to return tomorrow.</p>
  </section>
  <section class="section daily">
    <div>
      <p class="eyebrow">Daily Dose</p>
      <h2>Daily Dose for ${esc(hub.exam)}</h2>
      <p>Build a personalized path with one focused lesson every day, revision notes, flashcards, practice questions and exam-aware current affairs where relevant.</p>
      <div class="pill-row">${subjectPills}</div>
    </div>
    <div class="mini-phone">
      <div class="phone-top"><span>MindGains</span><span>${esc(hub.exams)}</span></div>
      <div class="mission"><b>Today's Lesson</b><p>${esc(hub.scope)}</p></div>
      <div class="metric-grid"><div><b>1</b><span>Lesson</span></div><div><b>50</b><span>XP</span></div><div><b>Daily</b><span>Revision</span></div></div>
    </div>
  </section>
  <section class="section quiz-preview">
    <div>
      <p class="eyebrow">Quiz Hub</p>
      <h2>Practice ${esc(hub.exam)} questions topic by topic</h2>
      <p>The public Quiz Hub gives learners a searchable route into focused practice before they join the full app experience.</p>
    </div>
    <a class="stat-card" href="${attr(hub.quiz)}"><strong>${esc(topicText)}</strong><span>${esc(hub.quizLabel)}</span></a>
  </section>
  <section class="cards">
    <article><h2>Study Lab preview</h2><p>Enter a topic, PDF, YouTube link or text and generate reading notes, flashcards, mindmaps and quizzes for exam revision or school learning.</p><a href="/study-lab/">Explore Study Lab</a></article>
    <article><h2>MIGA preview</h2><p>MIGA is the multilingual AI learning companion inside MindGains. It is designed to guide, explain and keep learners moving through their daily study loop.</p><a href="/misa/">Explore MISA</a></article>
  </section>
  <section class="section">
    <p class="eyebrow">Comparison</p>
    <h2>Why MindGains vs generic AI tools</h2>
    <div class="compare">
      <div><h3>Generic AI chatbot</h3><p>Flexible answers, but no exam path, habit loop, quiz history or structured revision system.</p></div>
      <div><h3>Random notes/videos</h3><p>Useful content, but easy to consume passively and forget without practice or feedback.</p></div>
      <div class="highlight"><h3>MindGains</h3><p>Exam-specific learning paths, Daily Dose, quizzes, revision, current affairs, school and exam support, and a mobile app experience.</p></div>
    </div>
  </section>
  <section class="section links">
    <p class="eyebrow">Continue practicing</p>
    <h2>Start with a quiz or a deeper read</h2>
    <div class="link-grid">${related}</div>
  </section>
  <section class="section faq">
    <p class="eyebrow">FAQ</p>
    <h2>${esc(hub.exam)} preparation FAQs</h2>
    ${faq}
  </section>
  <section class="cta">
    <p class="eyebrow">Early access</p>
    <h2>Start building your daily learning habit with MindGains.</h2>
    <p>Join the early access waitlist and be among the first learners to try Daily Dose, Study Lab, MIGA and the full app experience.</p>
    <a class="button" href="/#join">Join the Waitlist</a>
  </section>
</main>`;
  return pageShell(id, hub, body);
}

function writeCss() {
  const css = `*,*:before,*:after{box-sizing:border-box}body{margin:0;background:#05060a;color:#f8fbff;font-family:Inter,Barlow,sans-serif;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}.bg{position:fixed;inset:0;z-index:-1;background:radial-gradient(circle at 50% 0%,rgba(55,224,255,.2),transparent 34%),radial-gradient(circle at 12% 16%,rgba(8,145,178,.14),transparent 32%),linear-gradient(180deg,#05060a,#08111c 56%,#030407)}.site-nav{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:14px clamp(16px,4vw,56px);backdrop-filter:blur(22px);background:rgba(5,6,10,.74);border-bottom:1px solid rgba(255,255,255,.08)}.brand{font-weight:800}.site-nav nav{display:flex;gap:16px;flex-wrap:wrap;justify-content:flex-end;color:#cbd5e1;font-size:14px}.site-nav nav a:hover{color:#fff}main{width:min(1120px,calc(100% - 32px));margin:0 auto;padding:0 0 72px}.hero{padding:18px 0 26px}.eyebrow{margin:0 0 10px;color:#67e8f9;text-transform:uppercase;letter-spacing:2.4px;font-size:12px;font-weight:800}.hero h1,.section h2,.cta h2{max-width:980px;font-family:"Instrument Serif",serif;font-style:italic;font-size:clamp(42px,7vw,84px);line-height:.95;margin:0;font-weight:400}.dek{max-width:780px;color:rgba(248,251,255,.78);font-size:clamp(16px,1.8vw,20px);line-height:1.58;margin:16px 0 0}.hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}.button{display:inline-flex;align-items:center;justify-content:center;padding:14px 18px;border-radius:16px;background:#0891b2;color:#fff;font-weight:850}.button.secondary{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#e8fbff}.section,.cta,.cards article{border:1px solid rgba(255,255,255,.12);border-radius:24px;background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035));padding:24px;margin-top:22px}.section.two,.section.daily,.section.quiz-preview{display:grid;grid-template-columns:minmax(0,.82fr) minmax(300px,1fr);gap:26px;align-items:center}.section h2,.cta h2{font-size:clamp(32px,4.5vw,54px)}.section p,.cta p,.cards p,.faq p{color:#d7e2f2;font-size:17px;line-height:1.68}.pill-row{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px}.pill-row span{padding:9px 12px;border-radius:999px;background:rgba(55,224,255,.09);border:1px solid rgba(55,224,255,.2);color:#dffbff;font-size:13px}.mini-phone,.stat-card{border:1px solid rgba(255,255,255,.13);border-radius:24px;background:radial-gradient(circle at 50% 0%,rgba(55,224,255,.18),transparent 42%),rgba(5,6,10,.45);padding:18px}.phone-top{display:flex;justify-content:space-between;color:#91a4bd;font-size:12px;margin-bottom:18px}.mission{border-radius:18px;background:rgba(255,255,255,.06);padding:18px}.mission b{display:block;font-size:18px;margin-bottom:8px}.mission p{margin:0;color:#aebbd0}.metric-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.metric-grid div{padding:12px;border-radius:16px;background:rgba(55,224,255,.08);border:1px solid rgba(55,224,255,.18);text-align:center}.metric-grid b{display:block;color:#67e8f9}.metric-grid span{display:block;color:#91a4bd;font-size:11px;margin-top:4px}.stat-card{display:grid;align-content:center;gap:8px;min-height:160px}.stat-card strong{font-size:30px;color:#fff}.stat-card span{color:#67e8f9;font-weight:800}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:22px}.cards article{margin-top:0}.cards h2{font-size:28px;margin:0 0 12px}.cards a{display:inline-flex;margin-top:10px;color:#67e8f9;font-weight:800}.compare{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px}.compare div{padding:18px;border-radius:18px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.1)}.compare .highlight{background:rgba(55,224,255,.09);border-color:rgba(55,224,255,.25)}.compare h3{margin:0 0 8px;font-size:18px}.compare p{font-size:15px;margin:0}.link-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px}.link-grid a{display:flex;justify-content:space-between;gap:12px;padding:16px;border-radius:16px;background:rgba(55,224,255,.08);border:1px solid rgba(55,224,255,.18);color:#e8fbff;font-weight:800}.link-grid span{color:#67e8f9}.faq details{border-top:1px solid rgba(255,255,255,.1);padding:16px 0}.faq details:first-of-type{margin-top:12px}.faq summary{cursor:pointer;font-weight:850;color:#fff}.faq p{margin:10px 0 0}.cta{text-align:left;padding:28px}.cta h2{max-width:760px}.cta p{max-width:720px}@media(max-width:860px){.site-nav{align-items:flex-start}.site-nav nav{gap:10px;font-size:13px}.section.two,.section.daily,.section.quiz-preview,.cards,.compare,.link-grid{grid-template-columns:1fr}.hero{padding-top:14px}.site-nav nav a:nth-child(1),.site-nav nav a:nth-child(2),.site-nav nav a:nth-child(3){display:none}.metric-grid{grid-template-columns:1fr}.hero-actions{display:grid}.button{width:100%}.section,.cta,.cards article{padding:20px}}`;
  fs.writeFileSync(path.join(ROOT, 'assets', 'exam-hubs.css'), css, 'utf8');
}

function updateSitemap(ids) {
  const sitemap = path.join(ROOT, 'sitemap.xml');
  if (!fs.existsSync(sitemap)) return;
  let xml = fs.readFileSync(sitemap, 'utf8');
  const lines = ids.map((id) => `  <url><loc>${SITE_URL}/${id}/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`).join('\n');
  for (const id of ids) {
    xml = xml.replace(new RegExp(`\\n  <url><loc>${SITE_URL}/${id}/</loc>[^\\n]+</url>`, 'g'), '');
  }
  xml = xml.replace('\n</urlset>', `\n${lines}\n</urlset>`);
  fs.writeFileSync(sitemap, xml, 'utf8');
}

function updateHome() {
  const file = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('/upsc/')) {
    html = html.replace('<a href="/daily-dose/">Daily Dose</a>', '<a href="/upsc/">UPSC</a><a href="/tnpsc/">TNPSC</a><a href="/daily-dose/">Daily Dose</a>');
  }
  if (!html.includes('class="exam-teaser"')) {
    const css = `\n  .exam-teaser{position:fixed;left:30px;bottom:154px;z-index:24;width:min(330px,calc(100vw - 60px));border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:16px;background:rgba(5,6,10,.52);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);box-shadow:0 18px 60px rgba(0,0,0,.34)}\n  .exam-teaser .k{font-size:10px;letter-spacing:1.7px;text-transform:uppercase;color:#67e8f9;font-weight:700;margin-bottom:10px}\n  .exam-links{display:flex;flex-wrap:wrap;gap:8px}.exam-links a{color:#dffbff;text-decoration:none;font-size:12px;border:1px solid rgba(55,224,255,.22);border-radius:999px;padding:7px 9px;background:rgba(55,224,255,.08)}\n  @media (max-width:860px){.exam-teaser{display:none}}\n`;
    html = html.replace('  @media (max-width:560px){', `${css}\n  @media (max-width:560px){`);
    html = html.replace('<aside class="editorial-teaser">', '<aside class="exam-teaser"><div class="k">Explore by Exam</div><div class="exam-links"><a href="/upsc/">UPSC</a><a href="/tnpsc/">TNPSC</a><a href="/ssc/">SSC</a><a href="/ncert/">NCERT</a><a href="/samacheer/">Samacheer</a></div></aside>\n\n<aside class="editorial-teaser">');
  }
  fs.writeFileSync(file, html, 'utf8');
}

function main() {
  const counts = readQuizCounts();
  writeCss();
  for (const [id, hub] of Object.entries(HUBS)) {
    const dir = path.join(ROOT, id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), hubPage(id, hub, counts[id]), 'utf8');
  }
  updateSitemap(Object.keys(HUBS));
  updateHome();
  console.log(`Generated ${Object.keys(HUBS).length} exam hub pages.`);
}

main();

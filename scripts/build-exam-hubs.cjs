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
  'know-your-india': {
    exam: 'Know Your India',
    title: 'Know Your India | MindGains',
    description: 'Explore India facts, constitution, states, rivers, history and civic knowledge with MindGains.',
    audience: 'students and exam aspirants',
    scope: 'Constitution, states, rivers, freedom movement, parliament and current affairs',
    exams: 'Civics and India knowledge practice',
    quiz: '/quiz/upsc/',
    quizLabel: 'Open India Quizzes',
    subjects: ['Constitution', 'States', 'Rivers', 'History', 'Geography', 'Current Affairs'],
    heroEyebrow: 'Public India Knowledge Hub',
    heroTitle: 'Know Your India',
    heroDek: 'A premium public space from MindGains for learners who want to understand India deeply and practice civic knowledge daily.',
    beyondTitle: 'Why India knowledge needs more than content',
    dailyTitle: 'Know Your India',
    dailyCopy: 'Build a reusable civic memory with one India fact every day, quick revision, quiz practice and map-minded recall.',
    quizHeading: 'Practice India questions topic by topic',
    continueTitle: 'Start with a quiz or a deeper read',
    faqTitle: 'Know Your India FAQs',
    related: [
      ['/quiz/upsc/polity/preamble/', 'Preamble Quiz'],
      ['/quiz/tnpsc/history/freedom-struggle/', 'Freedom Struggle Quiz'],
      ['/quiz/ncert/social-science/class10/', 'Class 10 Social Science Quiz'],
      ['/blog/india-learning-crisis', 'Why learning gaps persist'],
    ],
    faqs: [
      ['What is Know Your India?', 'Know Your India is a public MindGains page for India facts, civics and connected learning across states, constitution and history.'],
      ['Is it useful for exams?', 'Yes. The page connects well with UPSC, TNPSC and school social science foundations.'],
      ['Where should I start?', 'Begin with the India quizzes, then move into the editorial and the app experience when you want deeper daily practice.'],
    ],
  },
};

const INDIA_REGIONS = [
  {
    name: 'North',
    items: ['Haryana', 'Himachal Pradesh', 'Punjab', 'Rajasthan', 'Uttarakhand', 'Uttar Pradesh', 'Delhi', 'Chandigarh', 'Jammu and Kashmir', 'Ladakh'],
  },
  {
    name: 'West',
    items: ['Goa', 'Gujarat', 'Maharashtra', 'Dadra and Nagar Haveli and Daman and Diu'],
  },
  {
    name: 'Central',
    items: ['Chhattisgarh', 'Madhya Pradesh'],
  },
  {
    name: 'East',
    items: ['Bihar', 'Jharkhand', 'Odisha', 'West Bengal', 'Andaman and Nicobar Islands'],
  },
  {
    name: 'Northeast',
    items: ['Arunachal Pradesh', 'Assam', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'],
  },
  {
    name: 'South',
    items: ['Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana', 'Lakshadweep', 'Puducherry'],
  },
];

const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand',
  'Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'
];

const INDIA_UTS = [
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi',
  'Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
];

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
  <nav><a href="/upsc/">UPSC</a><a href="/tnpsc/">TNPSC</a><a href="/ssc/">SSC</a><a href="/quiz/">Quiz Hub</a><a href="/know-your-india/">Know India</a><a href="/#join">Waitlist</a></nav>
</header>
${body}
</body>
</html>`;
}

function orbMarkup() {
  return `<div class="india-orb">
    <div class="orb-shell">
      <div class="orb-container">
        <div class="orb">
          <div class="orb-inner"></div>
          <div class="orb-inner"></div>
        </div>
      </div>
      <div class="orb-labels">
        <span>States</span>
        <span>Union Territories</span>
        <span>Capitals</span>
        <span>Rivers</span>
      </div>
    </div>
  </div>`;
}

function atlasCards(items) {
  return items.map((item) => `<span class="atlas-chip">${esc(item)}</span>`).join('');
}

function indiaAtlasPage(id, hub) {
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
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
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
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/exam-hubs.css" />
${iconMeta()}
<script type="application/ld+json">${JSON.stringify(webPage)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
<script src="https://cdn.jsdelivr.net/npm/topojson-client@3"></script>
<script src="https://cdn.jsdelivr.net/npm/globe.gl"></script>
<script>
  window.addEventListener('DOMContentLoaded', function () {
    var s = document.createElement('script');
    s.src = '/assets/kyi-app.js';
    document.head.appendChild(s);
  }, { once: true });
</script>
<style>
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#05070F}
body{font-family:Inter,system-ui,sans-serif}
.site-nav{position:fixed;top:0;left:0;right:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:14px clamp(16px,4vw,56px);backdrop-filter:blur(22px);background:rgba(5,6,10,.62);border-bottom:1px solid rgba(255,255,255,.08)}
.site-nav .brand{font-weight:800;color:#fff;text-decoration:none}
.site-nav nav{display:flex;gap:16px;flex-wrap:wrap;justify-content:flex-end;color:#cbd5e1;font-size:14px}
.site-nav nav a{color:inherit;text-decoration:none}
.site-nav nav a:hover{color:#fff}
.kyi-stage{position:fixed;inset:0;background:
  radial-gradient(circle at 50% 38%, rgba(55,224,255,.16), transparent 28%),
  radial-gradient(circle at 50% 50%, rgba(18,24,40,.22), transparent 62%),
  linear-gradient(180deg,#04050a 0%, #060914 42%, #04050a 100%)}
#g{position:absolute;inset:0}
#ld{position:absolute;inset:0;display:flex;flex-direction:column;gap:14px;align-items:center;justify-content:center;color:#aab3c9;font-size:14px;letter-spacing:.2px}
.sp{width:36px;height:36px;border:3px solid rgba(255,255,255,.14);border-top-color:#37e0ff;border-radius:50%;animation:s .9s linear infinite}
@keyframes s{to{transform:rotate(360deg)}}
</style>
</head>
<body>
<header class="site-nav">
  <a class="brand" href="/">MindGains</a>
  <nav><a href="/upsc/">UPSC</a><a href="/tnpsc/">TNPSC</a><a href="/ssc/">SSC</a><a href="/quiz/">Quiz Hub</a><a href="/know-your-india/">Know India</a><a href="/#join">Waitlist</a></nav>
</header>
<div class="kyi-stage">
  <div id="g"></div>
  <div id="ld"><div class="sp"></div></div>
</div>
<script>
  var post=function(m){try{if(window.__kyiBridge){var t=m&&m.type; if(t==='ready')window.__kyiBridge.indiaReady&&window.__kyiBridge.indiaReady(); else if(t==='level'&&m.level==='states')window.__kyiBridge.indiaView&&window.__kyiBridge.indiaView(); else if(t==='statePreview')window.__kyiBridge.statePreview&&window.__kyiBridge.statePreview(m.state); else if(t==='stateSelected')window.__kyiBridge.stateSelected&&window.__kyiBridge.stateSelected(m.state); else if(t==='districtClick')window.__kyiBridge.district&&window.__kyiBridge.district({district:m.district,state:m.state}); else if(t==='pcClick')window.__kyiBridge.pc&&window.__kyiBridge.pc({pc:m.pc,state:m.state}); else if(t==='acClick')window.__kyiBridge.ac&&window.__kyiBridge.ac({ac:m.ac,district:m.district,parentPc:m.parentPc,state:m.state}); else if(t==='acLoading')window.__kyiBridge.acLoading&&window.__kyiBridge.acLoading(); else if(t==='acReady')window.__kyiBridge.acReady&&window.__kyiBridge.acReady(); else if(t==='acError')window.__kyiBridge.acError&&window.__kyiBridge.acError({state:m.state}); else if(t==='pcLoading')window.__kyiBridge.pcLoading&&window.__kyiBridge.pcLoading(); else if(t==='error')window.__kyiBridge.hint&&window.__kyiBridge.hint('Could not load the map. Check connection.'); }}catch(e){}};
  var world,states=[],districts=[],pcAll=[],pcByState={},acCache={},mode='dist',kind='states',selectedState=null;
  var GRAPHITE='rgba(74,82,138,0.50)',GRAPHITE_DIM='rgba(48,52,82,0.36)',VIOLET='rgba(143,104,255,0.78)',TINT='rgba(122,94,248,0.26)';
  function nrm(s){return (s||'').toUpperCase().replace(/&/g,'AND').replace(/[^A-Z0-9]+/g,'');}
  var selFeat=null;
  function featKey(f){ if(kind==='ac')return f.properties.AC_NAME; if(kind==='pc')return f.properties.pc_name; if(kind==='districts')return f.properties.district; return null; }
  function isSelFeat(f){ return selFeat && kind!=='states' && featKey(f)===selFeat; }
  function reapply(){ if(world) world.polygonCapColor(ck).polygonSideColor(sd).polygonStrokeColor(st).polygonAltitude(al); }
  function ck(f){ if(kind==='states'){ if(selectedState) return f.properties.st_nm===selectedState?VIOLET:GRAPHITE_DIM; return GRAPHITE; } return isSelFeat(f)?'rgba(150,112,255,0.88)':TINT; }
  function sd(f){ if(kind==='states'&&selectedState===f.properties.st_nm) return 'rgba(124,92,252,0.5)'; if(kind==='states') return 'rgba(96,106,166,0.35)'; return isSelFeat(f)?'rgba(124,92,252,0.55)':'rgba(70,80,140,0.22)'; }
  function st(f){ if(kind==='states'&&selectedState===f.properties.st_nm) return 'rgba(214,200,255,1)'; if(kind==='states') return 'rgba(172,184,236,0.62)'; return isSelFeat(f)?'rgba(222,210,255,1)':'rgba(200,208,244,0.4)'; }
  function al(f){ if(kind==='states') return selectedState===f.properties.st_nm?0.05:0.006; return isSelFeat(f)?0.045:0.006; }
  function nameOf(f){ if(kind==='states')return f.properties.st_nm; if(kind==='districts')return f.properties.district; if(kind==='ac')return (f.properties.AC_NAME||'').replace(/\\s*\\((SC|ST)\\)/i,''); return f.properties.pc_name; }
  function polys(f){var g=f.geometry;if(!g)return [];return g.type==='Polygon'?[g.coordinates]:g.coordinates;}
  function ringArea(r){var a=0;for(var i=0,n=r.length-1;i<n;i++){a+=r[i][0]*r[i+1][1]-r[i+1][0]*r[i][1];}return a/2;}
  function ringCentroid(r){var a=0,cx=0,cy=0;for(var i=0,n=r.length-1;i<n;i++){var ff=r[i][0]*r[i+1][1]-r[i+1][0]*r[i][1];a+=ff;cx+=(r[i][0]+r[i+1][0])*ff;cy+=(r[i][1]+r[i+1][1])*ff;}a=a/2;if(Math.abs(a)<1e-9)return [r[0][0],r[0][1]];return [cx/(6*a),cy/(6*a)];}
  function centerOf(f){var best=null,bestA=-1;polys(f).forEach(function(p){var r=p[0];var a=Math.abs(ringArea(r));if(a>bestA){bestA=a;best=r;}});if(!best)return {lat:22,lng:80};var c=ringCentroid(best);return {lat:c[1],lng:c[0]};}
  var curSorted=[];
  function area(f){var best=0;polys(f).forEach(function(p){var a=Math.abs(ringArea(p[0]));if(a>best)best=a;});return best;}
  function makeLabel(d){
    var el=document.createElement('div');el.textContent=d.t;
    el.style.cssText='white-space:nowrap;transform:translate(-50%,-50%);font-family:Inter,system-ui,sans-serif;';
    el.style.cssText+='pointer-events:none;font-size:'+(d.sel?13:10.5)+'px;font-weight:'+(d.sel?'700':'600')+';color:'+(d.sel?'#fff':'rgba(232,236,248,0.92)')+';text-shadow:0 1px 5px rgba(0,0,0,0.98);padding:5px 7px;';
    return el;
  }
  function refreshLabels(){
    if(!world)return;
    if(!curSorted.length){world.htmlElementsData([]);return;}
    var pov=world.pointOfView();var alt=pov.altitude||1.25;
    var coslat=Math.max(0.3,Math.cos(pov.lat*Math.PI/180));
    var half=Math.max(2.5,alt*42);
    var cap=Math.max(8,Math.min(40,Math.round(28/alt)));
    var arr=[];
    for(var i=0;i<curSorted.length && arr.length<cap;i++){
      var d=curSorted[i];
      if(Math.abs(d.lat-pov.lat)<half && Math.abs(d.lng-pov.lng)<half/coslat){
        arr.push({lat:d.lat,lng:d.lng,t:d.t,st:d.st,k:d.k,sel:(d.k==='states'&&d.st===selectedState),small:d.small});
      }
    }
    if(kind==='states'&&selectedState){var has=false,a2;for(a2=0;a2<arr.length;a2++){if(arr[a2].st===selectedState){arr[a2].sel=true;has=true;break;}}if(!has){for(a2=0;a2<curSorted.length;a2++){if(curSorted[a2].st===selectedState){var sf=curSorted[a2];arr.push({lat:sf.lat,lng:sf.lng,t:sf.t,st:sf.st,k:'states',sel:true,small:sf.small});break;}}}}
    world.htmlElementsData(arr).htmlLat('lat').htmlLng('lng').htmlAltitude(function(d){return d.sel?0.055:0.008;}).htmlElement(makeLabel);
  }
  function setLabels(fs){
    curSorted=fs.map(function(f){var c=centerOf(f);return {f:f,lat:c.lat,lng:c.lng,t:nameOf(f),st:f.properties.st_nm,k:kind,ar:area(f),small:false};}).sort(function(a,b){return b.ar-a.ar;});
    if(kind==='states'){for(var i=0;i<curSorted.length;i++)curSorted[i].small=(i>=16);}
    refreshLabels();
  }
  function draw(fs){world.polygonsData(fs).polygonAltitude(al).polygonCapColor(ck).polygonSideColor(sd).polygonStrokeColor(st).polygonLabel(function(){return '';});setLabels(fs);}
  function fitFly(fs,ms,latShift,tighten){
    var mnx=180,mny=90,mxx=-180,mxy=-90;
    fs.forEach(function(f){polys(f).forEach(function(p){p[0].forEach(function(c){if(c[0]<60||c[0]>100||c[1]<5||c[1]>40)return;if(c[0]<mnx)mnx=c[0];if(c[0]>mxx)mxx=c[0];if(c[1]<mny)mny=c[1];if(c[1]>mxy)mxy=c[1];});});});
    if(mxx<mnx){world.pointOfView({lat:27.5,lng:81,altitude:1.35},ms||1200);return;}
    var midLat=(mny+mxy)/2,midLng=(mnx+mxx)/2;
    var dx=(mxx-mnx)*Math.cos(midLat*Math.PI/180),dy=mxy-mny,span=Math.max(dx,dy);
    var alt=Math.max(0.14,Math.min(1.35,span/26)); if(tighten)alt*=0.78;
    var shift=latShift?dy*0.22:0;
    world.pointOfView({lat:midLat+shift,lng:midLng,altitude:alt},ms||1300);
    setTimeout(refreshLabels,(ms||1300)+80);
  }
  function showStates(){kind='states';selectedState=null;draw(states);world.pointOfView({lat:27.5,lng:81,altitude:1.35},1100);}
  function stateFeat(s){return states.filter(function(f){return f.properties.st_nm===s;});}
  function districtsFor(s){return districts.filter(function(f){return f.properties.st_nm===s;});}
  function pcsFor(s){var k=nrm(s);if(pcByState[k])return pcByState[k];for(var kk in pcByState){if(kk.indexOf(k)>=0||k.indexOf(kk)>=0)return pcByState[kk];}return [];}
  function previewState(s){selectedState=s;kind='states';draw(states);var c=centerOf(stateFeat(s)[0]||states[0]);world.pointOfView({lat:c.lat-2.5,lng:c.lng,altitude:1.0},1100);}
  function openSecond(s){
    selectedState=s;selFeat=null;
    if(mode==='dist'){kind='districts';var d=districtsFor(s);draw(d);fitFly(d.length?d:stateFeat(s),1400,0.4);}
    else if(mode==='pc'){kind='pc';ensurePC(function(){var p=pcsFor(s);draw(p);fitFly(p.length?p:districtsFor(s),1400,0.4);});}
    else if(mode==='ac'){loadAC(s);}
  }
  function ensurePC(cb){if(pcAll.length){cb();return;}fetch('https://cdn.jsdelivr.net/gh/datameet/maps@master/parliamentary-constituencies/india_pc_2019_simplified.geojson').then(function(r){return r.json();}).then(function(g){pcAll=g.features||[];pcAll.forEach(function(f){var k=nrm(f.properties.st_name);(pcByState[k]=pcByState[k]||[]).push(f);});cb();}).catch(function(){});}
  function stKey(name){var k=(name||'').toLowerCase().replace(/&/g,'').replace(/\\band\\b/g,'').replace(/[^a-z]/g,'');var ov={jammuandkashmir:'jammukashmir',nctofdelhi:'delhi',orissa:'odisha',pondicherry:'puducherry',uttaranchal:'uttarakhand',dadraandnagarhavelianddamananddiu:'dadranagarhaveli'};return ov[k]||k;}
  function loadAC(s){kind='ac';selFeat=null;var key=stKey(s);if(acCache[key]){draw(acCache[key]);fitFly(acCache[key],1400,0.3,1);return;}fetch('https://cdn.jsdelivr.net/gh/HindustanTimesLabs/shapefiles@master/state_ut/'+key+'/assembly/'+key+'_AC.json').then(function(r){if(!r.ok)throw 0;return r.json();}).then(function(g){acCache[key]=g.features||[];draw(acCache[key]);fitFly(acCache[key],1400,0.3,1);}).catch(function(){mode='dist';openSecond(s);});}
  function onClick(f){
    if(kind==='states'){previewState(f.properties.st_nm);return;}
    selFeat=featKey(f);reapply();fitFly([f],800,0);
  }
  var bootTimer=setTimeout(function(){var ld=document.getElementById('ld');if(ld)ld.innerHTML='<div class="sp"></div><div>Loading the map is taking longer than usual.</div>';},12000);
  fetch('https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@main/topojson/india.json').then(function(r){return r.json();}).then(function(topo){
    states=topojson.feature(topo,topo.objects.states).features;
    districts=topojson.feature(topo,topo.objects.districts).features;
    world=Globe()(document.getElementById('g'))
      .globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
      .backgroundColor('rgba(0,0,0,0)').showAtmosphere(true).atmosphereColor('#7aa2ff').atmosphereAltitude(0.18)
      .polygonsTransitionDuration(0).onPolygonClick(onClick);
    draw(states);
    var c=world.controls();c.autoRotate=false;c.enableDamping=true;c.minDistance=101;c.maxDistance=700;c.zoomSpeed=1.3;
    var lastLbl=0;world.onZoom(function(){var t=Date.now();if(t-lastLbl>120){lastLbl=t;refreshLabels();}});
    world.pointOfView({lat:0,lng:0,altitude:2.9},0);
    setTimeout(function(){world.pointOfView({lat:27.5,lng:81,altitude:1.15},2900);},450);
    document.getElementById('ld').style.display='none';
    clearTimeout(bootTimer);
  }).catch(function(){clearTimeout(bootTimer);var ld=document.getElementById('ld');if(ld)ld.innerHTML='<div class="sp"></div><div>Map load failed. Please refresh.</div>';});
  window.__kyi={explore:function(){if(selectedState)openSecond(selectedState);},back:function(){showStates();},setMode:function(m){mode=m;if(kind!=='states'&&selectedState)openSecond(selectedState);},zoom:function(fac){var p=world.pointOfView();world.pointOfView({lat:p.lat,lng:p.lng,altitude:Math.max(0.15,Math.min(2.4,p.altitude*fac))},420);},clearSel:function(){selFeat=null;reapply();}};
</script>
</body>
</html>`;
}

function hubPage(id, hub, count) {
  if (id === 'know-your-india') return indiaAtlasPage(id, hub, count);
  const heroEyebrow = hub.heroEyebrow || `${hub.exam} AI Learning Hub`;
  const heroTitle = hub.heroTitle || `Best AI for ${hub.exam} Preparation`;
  const heroDek = hub.heroDek || `MindGains helps ${hub.audience} build a daily learning habit through personalized lessons, quizzes, revision, current affairs and AI-powered study tools.`;
  const beyondTitle = hub.beyondTitle || `Why ${hub.exam} preparation needs more than content`;
  const dailyTitle = hub.dailyTitle || `Daily Dose for ${hub.exam}`;
  const dailyCopy = hub.dailyCopy || 'Build a personalized path with one focused lesson every day, revision notes, flashcards, practice questions and exam-aware current affairs where relevant.';
  const quizHeading = hub.quizHeading || `Practice ${hub.exam} questions topic by topic`;
  const compareTitle = hub.compareTitle || 'Why MindGains vs generic AI tools';
  const continueTitle = hub.continueTitle || 'Start with a quiz or a deeper read';
  const faqTitle = hub.faqTitle || `${hub.exam} preparation FAQs`;
  const ctaTitle = hub.ctaTitle || 'Start building your daily learning habit with MindGains.';
  const ctaCopy = hub.ctaCopy || 'Join the early access waitlist and be among the first learners to try Daily Dose, Study Lab, MIGA and the full app experience.';
  const subjectPills = hub.subjects.map((item) => `<span>${esc(item)}</span>`).join('');
  const related = hub.related.map(([href, label]) => `<a href="${attr(href)}">${esc(label)}<span>Open</span></a>`).join('');
  const faq = hub.faqs.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join('');
  const topicText = count?.topics ? `${count.topics.toLocaleString('en-IN')} topic pages` : 'Topic-wise public quizzes';
  const body = `<main>
  <section class="hero">
    <p class="eyebrow">${esc(heroEyebrow)}</p>
    <h1>${esc(heroTitle)}</h1>
    <p class="dek">${esc(heroDek)}</p>
    <div class="hero-actions"><a class="button" href="/#join">Join Waitlist</a><a class="button secondary" href="${attr(hub.quiz)}">${esc(hub.quizLabel)}</a></div>
  </section>
  <section class="section two">
    <div>
      <p class="eyebrow">Beyond content</p>
      <h2>${esc(beyondTitle)}</h2>
    </div>
    <p>Most learners already have videos, PDFs, notes and question banks. The gap is turning that content into a repeatable system: one focused lesson, one practice set, one revision loop and one visible reason to return tomorrow.</p>
  </section>
  <section class="section daily">
    <div>
      <p class="eyebrow">Daily Dose</p>
      <h2>${esc(dailyTitle)}</h2>
      <p>${esc(dailyCopy)}</p>
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
      <h2>${esc(quizHeading)}</h2>
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
    <h2>${esc(compareTitle)}</h2>
    <div class="compare">
      <div><h3>Generic AI chatbot</h3><p>Flexible answers, but no exam path, habit loop, quiz history or structured revision system.</p></div>
      <div><h3>Random notes/videos</h3><p>Useful content, but easy to consume passively and forget without practice or feedback.</p></div>
      <div class="highlight"><h3>MindGains</h3><p>Exam-specific learning paths, Daily Dose, quizzes, revision, current affairs, school and exam support, and a mobile app experience.</p></div>
    </div>
  </section>
  <section class="section links">
    <p class="eyebrow">Continue practicing</p>
    <h2>${esc(continueTitle)}</h2>
    <div class="link-grid">${related}</div>
  </section>
  <section class="section faq">
    <p class="eyebrow">FAQ</p>
    <h2>${esc(faqTitle)}</h2>
    ${faq}
  </section>
  <section class="cta">
    <p class="eyebrow">Early access</p>
    <h2>${esc(ctaTitle)}</h2>
    <p>${esc(ctaCopy)}</p>
    <a class="button" href="/#join">Join the Waitlist</a>
  </section>
</main>`;
  return pageShell(id, hub, body);
}

function writeCss() {
  const css = `*,*:before,*:after{box-sizing:border-box}body{margin:0;background:#05060a;color:#f8fbff;font-family:Inter,Barlow,sans-serif;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}.bg{position:fixed;inset:0;z-index:-1;background:radial-gradient(circle at 50% 0%,rgba(55,224,255,.2),transparent 34%),radial-gradient(circle at 12% 16%,rgba(8,145,178,.14),transparent 32%),linear-gradient(180deg,#05060a,#08111c 56%,#030407)}.site-nav{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:14px clamp(16px,4vw,56px);backdrop-filter:blur(22px);background:rgba(5,6,10,.74);border-bottom:1px solid rgba(255,255,255,.08)}.brand{font-weight:800}.site-nav nav{display:flex;gap:16px;flex-wrap:wrap;justify-content:flex-end;color:#cbd5e1;font-size:14px}.site-nav nav a:hover{color:#fff}main{width:min(1120px,calc(100% - 32px));margin:0 auto;padding:0 0 72px}.hero{padding:18px 0 26px}.eyebrow{margin:0 0 10px;color:#67e8f9;text-transform:uppercase;letter-spacing:2.4px;font-size:12px;font-weight:800}.hero h1,.section h2,.cta h2{max-width:980px;font-family:"Instrument Serif",serif;font-style:italic;font-size:clamp(42px,7vw,84px);line-height:.95;margin:0;font-weight:400}.dek{max-width:780px;color:rgba(248,251,255,.78);font-size:clamp(16px,1.8vw,20px);line-height:1.58;margin:16px 0 0}.hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}.button{display:inline-flex;align-items:center;justify-content:center;padding:14px 18px;border-radius:16px;background:#0891b2;color:#fff;font-weight:850}.button.secondary{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#e8fbff}.section,.cta,.cards article{border:1px solid rgba(255,255,255,.12);border-radius:24px;background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035));padding:24px;margin-top:22px}.section.two,.section.daily,.section.quiz-preview{display:grid;grid-template-columns:minmax(0,.82fr) minmax(300px,1fr);gap:26px;align-items:center}.section h2,.cta h2{font-size:clamp(32px,4.5vw,54px)}.section p,.cta p,.cards p,.faq p{color:#d7e2f2;font-size:17px;line-height:1.68}.pill-row{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px}.pill-row span{padding:9px 12px;border-radius:999px;background:rgba(55,224,255,.09);border:1px solid rgba(55,224,255,.2);color:#dffbff;font-size:13px}.mini-phone,.stat-card{border:1px solid rgba(255,255,255,.13);border-radius:24px;background:radial-gradient(circle at 50% 0%,rgba(55,224,255,.18),transparent 42%),rgba(5,6,10,.45);padding:18px}.phone-top{display:flex;justify-content:space-between;color:#91a4bd;font-size:12px;margin-bottom:18px}.mission{border-radius:18px;background:rgba(255,255,255,.06);padding:18px}.mission b{display:block;font-size:18px;margin-bottom:8px}.mission p{margin:0;color:#aebbd0}.metric-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.metric-grid div{padding:12px;border-radius:16px;background:rgba(55,224,255,.08);border:1px solid rgba(55,224,255,.18);text-align:center}.metric-grid b{display:block;color:#67e8f9}.metric-grid span{display:block;color:#91a4bd;font-size:11px;margin-top:4px}.stat-card{display:grid;align-content:center;gap:8px;min-height:160px}.stat-card strong{font-size:30px;color:#fff}.stat-card span{color:#67e8f9;font-weight:800}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:22px}.cards article{margin-top:0}.cards h2{font-size:28px;margin:0 0 12px}.cards a{display:inline-flex;margin-top:10px;color:#67e8f9;font-weight:800}.compare{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px}.compare div{padding:18px;border-radius:18px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.1)}.compare .highlight{background:rgba(55,224,255,.09);border-color:rgba(55,224,255,.25)}.compare h3{margin:0 0 8px;font-size:18px}.compare p{font-size:15px;margin:0}.link-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px}.link-grid a{display:flex;justify-content:space-between;gap:12px;padding:16px;border-radius:16px;background:rgba(55,224,255,.08);border:1px solid rgba(55,224,255,.18);color:#e8fbff;font-weight:800}.link-grid span{color:#67e8f9}.faq details{border-top:1px solid rgba(255,255,255,.1);padding:16px 0}.faq details:first-of-type{margin-top:12px}.faq summary{cursor:pointer;font-weight:850;color:#fff}.faq p{margin:10px 0 0}.cta{text-align:left;padding:28px}.cta h2{max-width:760px}.cta p{max-width:720px}.atlas-hero{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(320px,.9fr);gap:24px;align-items:center}.atlas-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:22px;max-width:520px}.atlas-stats div{padding:14px 12px;border-radius:18px;background:rgba(55,224,255,.08);border:1px solid rgba(55,224,255,.16);text-align:center}.atlas-stats strong{display:block;font-size:28px;color:#fff}.atlas-stats span{display:block;color:#91a4bd;font-size:12px;margin-top:2px}.atlas-section{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:22px;align-items:start}.atlas-side{display:grid;gap:14px}.atlas-panel{padding:18px;border-radius:20px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}.atlas-panel h3,.atlas-region h3{margin:0 0 12px;font-size:16px;color:#f4fbff}.atlas-chip-row{display:flex;flex-wrap:wrap;gap:8px}.atlas-chip-row.dense{gap:7px}.atlas-chip{padding:9px 11px;border-radius:999px;background:rgba(55,224,255,.08);border:1px solid rgba(55,224,255,.18);color:#e7fbff;font-size:12px;line-height:1.1}.atlas-regions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:22px}.atlas-region{padding:18px;border-radius:20px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}.india-orb{display:flex;justify-content:center;align-items:center}.orb-shell{display:flex;flex-direction:column;align-items:center;gap:14px}.orb-container{position:relative;width:240px;height:240px;display:flex;justify-content:center;align-items:center;overflow:hidden;border-radius:50%;cursor:pointer;filter:drop-shadow(0 0 10px #ff3e1c66) drop-shadow(0 0 10px #1c8cff66);transition:all .3s ease;animation:orbFloat 8s ease-in-out infinite}.orb{position:absolute;width:240px;aspect-ratio:1;border-radius:50%;background:#060606;filter:blur(24px);transition:all .3s ease}.orb-container:hover .orb,.orb-container:focus-within .orb{width:260px;animation:rotatePulse 6s infinite}.orb-inner{position:absolute;left:-120%;top:-25%;width:160%;aspect-ratio:1;border-radius:50%;background:#ff3e1c;clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);animation:rotateSpin 6s linear infinite;transition:all .3s ease}.orb-inner:nth-child(2){left:auto;right:-120%;top:auto;bottom:-25%;background:#1c8cff;animation-duration:8s;clip-path:polygon(20% 0%,0% 20%,30% 50%,0% 80%,20% 100%,50% 70%,80% 100%,100% 80%,70% 50%,100% 20%,80% 0%,50% 30%)}.orb-container:hover .orb .orb-inner,.orb-container:focus-within .orb .orb-inner{width:170%}.orb-labels{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;max-width:340px}.orb-labels span{padding:7px 10px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#d8e7ff;font-size:11px;letter-spacing:.2px}@keyframes rotateSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes rotatePulse{50%{transform:rotate(180deg)}}@keyframes orbFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@media(max-width:860px){.site-nav{align-items:flex-start}.site-nav nav{gap:10px;font-size:13px}.section.two,.section.daily,.section.quiz-preview,.cards,.compare,.link-grid,.atlas-hero,.atlas-section,.atlas-regions{grid-template-columns:1fr}.hero{padding-top:14px}.site-nav nav a:nth-child(1),.site-nav nav a:nth-child(2),.site-nav nav a:nth-child(3){display:none}.metric-grid{grid-template-columns:1fr}.hero-actions{display:grid}.button{width:100%}.section,.cta,.cards article{padding:20px}.atlas-stats{grid-template-columns:1fr 1fr}.orb-container{width:210px;height:210px}.orb{width:210px}.orb-labels{max-width:none}}`;
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
  if (!html.includes('/know-your-india/')) {
    html = html.replace('<a href="/quiz/">Quiz Hub</a>', '<a href="/quiz/">Quiz Hub</a><a href="/know-your-india/">Know India</a>');
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

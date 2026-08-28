#!/usr/bin/env node
/**
 * Builds the per-exam landing pages (/upsc/, /tnpsc/, /ssc/, /rrb/, /ncert/, /samacheer/)
 * in the "connected" style: hero + Daily Dose scene, the connected loop, a Quiz Rooms
 * scene, an Ask-Miga scene, a live in-page question, an Android band and an FAQ.
 *
 * /know-your-india/ is a separate globe experience and is NOT generated here.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = (process.env.BASE_URL || process.env.SITE_URL || 'https://mindgains.ai').replace(/\/$/, '');

/* ---------------------------------------------------------------- config ---- */

const HUBS = {
  upsc: {
    exam: 'UPSC',
    code: 'UPSC · Civil Services — Prelims &amp; Mains',
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │ SEO — keyword-optimised. This block is the ONLY place page <title>  │
    // │ and <meta description> come from. Edit deliberately; check Search   │
    // │ Console after any change. Keep <title> ≤ ~60 chars, description     │
    // │ ~150–160. Do not add brand fluff — lead with the query intent.     │
    // └─────────────────────────────────────────────────────────────────────┘
    title: 'UPSC Prelims Practice — PYQs & Topic Quizzes | MindGains',
    description: 'Free UPSC Prelims practice: previous-year questions and topic-wise quizzes across Polity, History, Economy, Geography, Environment and CSAT. No sign-up needed.',
    h1: 'Your UPSC preparation, connected.',
    heroP: 'Textbooks, verified PYQs, Miga in your language, smart revision and competition with friends — one loop, built around the exam you’re actually preparing for.',
    quizStart: '/upsc/polity/',
    quizHub: ['/upsc/polity/', 'Open UPSC Quiz Hub'],
    source: 'NCERT / standard sources',
    dose: {
      day: 14, streak: 12,
      topic: 'Judicial Review &amp; the Basic Structure',
      mins: 5,
      learn: 'Arts. 13 &amp; 368 — grounded in NCERT XI Indian Constitution at Work',
      pyq: 'UPSC 2021 PYQ · which case established the Basic Structure doctrine?',
    },
    miga: {
      title: 'Ask Miga. In your language.',
      langOn: 'हिंदी',
      q: 'बेसिक स्ट्रक्चर डॉक्ट्रिन का मतलब क्या है, आसान शब्दों में?',
      a: 'संविधान का एक "मूल ढाँचा" है जिसे संसद संशोधन से भी नहीं बदल सकती — जैसे न्यायिक समीक्षा, संघवाद, धर्मनिरपेक्षता। ये केशवानंद भारती (1973) में तय हुआ।',
      p: 'Say the doubt out loud and get a clear, exam-focused answer back — in Hindi, Tamil, Telugu, Kannada, Malayalam or English. Grounded in your books, not a guess.',
    },
    liveQ: {
      tag: 'UPSC · Polity · Judicial Review',
      q: 'The ‘Basic Structure’ doctrine of the Constitution was propounded by the Supreme Court in which case?',
      opts: ['Golaknath v. State of Punjab (1967)', 'Kesavananda Bharati v. State of Kerala (1973)', 'Minerva Mills v. Union of India (1980)', 'Maneka Gandhi v. Union of India (1978)'],
      answer: 1,
      expl: 'Kesavananda Bharati (1973) held that Parliament can amend the Constitution but cannot alter its ‘basic structure’. Minerva Mills later reinforced it; Golaknath preceded and was overruled on this point.',
      next: ['/upsc/polity/', 'Keep going in the Quiz Hub →'],
    },
    chips: [
      ['/upsc/polity/fundamental-rights/', 'Fundamental Rights'],
      ['/upsc/polity/dpsp/', 'DPSP'],
      ['/upsc/history/national-movement/', 'National Movement'],
      ['/upsc/polity/', 'Polity'],
      ['/upsc/history/', 'History'],
      ['/upsc/geography/', 'Geography'],
    ],
    androidP: 'Daily Dose, connected revision, Miga in your language and Quiz Rooms with friends — the full loop. Private beta, opening soon.',
    faqs: [
      ['How is this different from a normal UPSC quiz app?', 'MindGains connects the whole loop: a textbook explanation leads into a previous-year question, a wrong answer becomes spaced revision, revision earns XP, and XP feeds live Quiz Rooms with friends. Nothing you study is thrown away.'],
      ['Does MindGains replace standard UPSC books?', 'No. It works as a daily practice and revision layer alongside NCERT, standard books and classes — connecting what you read to real previous-year questions and keeping your mistakes coming back until they stick.'],
      ['Can I use MindGains for free?', 'Yes. Every UPSC topic quiz on the website is free with no sign-up. The Android app adds the Daily Dose, connected revision, Miga and Quiz Rooms.'],
    ],
  },

  tnpsc: {
    exam: 'TNPSC',
    code: 'TNPSC · Group 1, 2, 2A, 4 &amp; VAO',
    // SEO — see the banner in the UPSC block above.
    title: 'TNPSC Group 1, 2 & 4 Practice — PYQs & Quizzes | MindGains',
    description: 'Free TNPSC practice for Group 1, 2, 2A & 4: previous-year questions and topic-wise quizzes in Tamil and English — Tamil, History, Polity, GS and Aptitude.',
    h1: 'Your TNPSC preparation, connected.',
    heroP: 'Textbooks, verified PYQs, Miga in Tamil, smart revision and competition with friends — one loop, built around the exam you’re actually preparing for.',
    quizStart: '/tnpsc/tamil/',
    quizHub: ['/tnpsc/tamil/', 'Open TNPSC Quiz Hub'],
    source: 'Samacheer / NCERT',
    dose: {
      day: 9, streak: 8,
      topic: 'Directive Principles &amp; the Amendment Map',
      mins: 4,
      learn: 'Part IV, Articles 36–51 — grounded in Samacheer XI Polity',
      pyq: 'TNPSC 2022 PYQ · which amendment added Art. 51A?',
    },
    miga: {
      title: 'Ask Miga. In Tamil.',
      langOn: 'தமிழ்',
      q: 'டைரக்டிவ் ப்ரின்சிபிள்ஸ் ஏன் நீதிமன்றத்தில் அமல்படுத்த முடியாது?',
      a: '"Non-justiciable" — அதாவது அரசுக்கு வழிகாட்டுதல்கள், ஆனால் மீறினால் நீதிமன்றம் தலையிடாது. Art. 37 இதை தெளிவாக சொல்கிறது.',
      p: 'Say the doubt out loud and get a clear, exam-focused answer back — in Tamil, Hindi, Telugu, Kannada, Malayalam or English. Grounded in your books, not a guess.',
    },
    liveQ: {
      tag: 'TNPSC · Polity · Directive Principles',
      q: 'The Directive Principles of State Policy are contained in which Part of the Constitution?',
      opts: ['Part III', 'Part IV', 'Part IVA', 'Part II'],
      answer: 1,
      expl: 'Part IV (Articles 36–51) holds the Directive Principles. Part III is Fundamental Rights; Part IVA (Article 51A) is Fundamental Duties.',
      next: ['/tnpsc/polity/', 'Keep going in the Quiz Hub →'],
    },
    chips: [
      ['/tnpsc/tamil/thirukkural/', 'Thirukkural'],
      ['/tnpsc/history/freedom-struggle/', 'Freedom Struggle'],
      ['/tnpsc/polity/fundamental-rights/', 'Fundamental Rights'],
      ['/tnpsc/tamil/', 'Tamil'],
      ['/tnpsc/history/', 'History'],
      ['/tnpsc/polity/', 'Polity'],
    ],
    androidP: 'Daily Dose for TNPSC, verified PYQs, Miga you can call in Tamil, and the State League. Private beta on Android.',
    faqs: [
      ['How is this different from a normal TNPSC quiz app?', 'MindGains connects the whole loop: a textbook explanation leads into a previous-year question, a wrong answer becomes spaced revision, revision earns XP, and XP feeds live Quiz Rooms with friends. Nothing you study is thrown away.'],
      ['Does MindGains support Tamil preparation?', 'Tamil is a first-class TNPSC track. Thirukkural, Sangam literature, grammar and modern Tamil all have dedicated topic quizzes, and you can ask Miga to explain in Tamil.'],
      ['Can I use MindGains for free?', 'Yes. Every TNPSC topic quiz on the website is free with no sign-up. The Android app adds the Daily Dose, connected revision, Miga and Quiz Rooms.'],
    ],
  },

  ssc: {
    exam: 'SSC',
    code: 'SSC · CGL, CHSL, MTS, CPO &amp; GD',
    // SEO — see the banner in the UPSC block above.
    title: 'SSC CGL, CHSL & MTS Practice — PYQs & Mock Quizzes | MindGains',
    description: 'Free SSC practice for CGL, CHSL, MTS, CPO and GD: previous-year questions and topic-wise mock quizzes across Reasoning, Quant, English and General Awareness.',
    h1: 'Your SSC preparation, connected.',
    heroP: 'Concepts, verified PYQs, Miga in your language, smart revision and speed rounds with friends — one loop, built around the exam you’re actually preparing for.',
    quizStart: '/ssc/quant/',
    quizHub: ['/ssc/quant/', 'Open SSC Quiz Hub'],
    source: 'standard quant &amp; GK sources',
    dose: {
      day: 11, streak: 10,
      topic: 'Number System — remainders &amp; divisibility',
      mins: 4,
      learn: 'The remainder theorem, cyclicity and last-digit tricks — with worked shortcuts',
      pyq: 'SSC CGL 2023 PYQ · find the remainder when 7^103 is divided by 5',
    },
    miga: {
      title: 'Ask Miga. In your language.',
      langOn: 'हिंदी',
      q: '7 की घात का last digit कैसे निकालें जल्दी से?',
      a: '7 की घातों का आखिरी अंक हर 4 पर दोहराता है: 7, 9, 3, 1। तो घात को 4 से भाग दो, शेषफल देखो — शेष 1→7, 2→9, 3→3, 0→1।',
      p: 'Say the doubt out loud and get the method, the working and a shortcut — in Hindi, Tamil, Telugu, Kannada, Malayalam or English.',
    },
    liveQ: {
      tag: 'SSC · Quant · Number System',
      q: 'What is the remainder when 7¹⁰³ is divided by 5?',
      opts: ['1', '2', '3', '4'],
      answer: 2,
      expl: 'The last digit of powers of 7 cycles every 4: 7, 9, 3, 1. 103 ÷ 4 leaves remainder 3, so the last digit is 3, and 3 mod 5 = 3.',
      next: ['/ssc/quant/', 'Keep going in the Quiz Hub →'],
    },
    chips: [
      ['/ssc/quant/number-system/', 'Number System'],
      ['/ssc/reasoning/syllogism/', 'Syllogism'],
      ['/ssc/english/synonyms-antonyms/', 'Synonyms &amp; Antonyms'],
      ['/ssc/quant/', 'Quant'],
      ['/ssc/reasoning/', 'Reasoning'],
      ['/ssc/history/', 'History'],
    ],
    androidP: 'Daily Dose for SSC, verified PYQs, Miga you can call in your language, and Quiz Rooms for speed rounds with friends. Private beta on Android.',
    faqs: [
      ['How is this different from a normal SSC quiz app?', 'MindGains connects the loop: a concept explanation leads into a real previous-year question, a wrong answer becomes spaced revision, revision earns XP, and XP feeds live Quiz Rooms with friends. Practice never goes to waste.'],
      ['Which SSC subjects are covered?', 'The public quizzes cover SSC Quant, Reasoning, English, General Awareness, Science, History and Economy — topic by topic.'],
      ['Is it free?', 'Yes. Every SSC topic quiz on the website is free with no sign-up. The Android app adds the Daily Dose, connected revision, Miga and Quiz Rooms.'],
    ],
  },

  rrb: {
    exam: 'RRB / Railway',
    code: 'RRB · NTPC, Group D &amp; ALP',
    // SEO — see the banner in the UPSC block above.
    title: 'RRB NTPC & Group D Practice — PYQs & Mock Quizzes | MindGains',
    description: 'Free RRB NTPC, Group D and ALP practice: previous-year questions and topic-wise mock quizzes across Maths, Reasoning, Science and General Awareness.',
    h1: 'Your RRB preparation, connected.',
    heroP: 'Concepts, verified PYQs, Miga in your language, smart revision and speed rounds with friends — one loop, built around the exam you’re actually preparing for.',
    quizStart: '/rrb/maths/',
    quizHub: ['/rrb/maths/', 'Open RRB Quiz Hub'],
    source: 'standard maths &amp; science sources',
    dose: {
      day: 7, streak: 6,
      topic: 'Time, Speed &amp; Distance — the ratio trick',
      mins: 4,
      learn: 'When time is constant, distance ∝ speed — solve trains and boats without equations',
      pyq: 'RRB NTPC 2021 PYQ · two trains, relative speed and crossing time',
    },
    miga: {
      title: 'Ask Miga. In your language.',
      langOn: 'हिंदी',
      q: 'Relative speed कब जोड़ते हैं और कब घटाते हैं?',
      a: 'उलटी दिशा में चल रहे हों तो speeds जोड़ो; एक ही दिशा में हों तो घटाओ। फिर समय = कुल लंबाई ÷ relative speed।',
      p: 'Say the doubt out loud and get the method, the working and a shortcut — in Hindi, Tamil, Telugu, Kannada, Malayalam or English.',
    },
    liveQ: {
      tag: 'RRB · Maths · Time, Speed &amp; Distance',
      q: 'Two trains 120 m and 130 m long run towards each other at 40 km/h and 50 km/h. How long do they take to cross?',
      opts: ['8 seconds', '10 seconds', '12 seconds', '15 seconds'],
      answer: 1,
      expl: 'Relative speed = 40 + 50 = 90 km/h = 25 m/s. Total length = 120 + 130 = 250 m. Time = 250 ÷ 25 = 10 seconds.',
      next: ['/rrb/maths/', 'Keep going in the Quiz Hub →'],
    },
    chips: [
      ['/rrb/maths/time-work/', 'Time &amp; Work'],
      ['/rrb/reasoning/series/', 'Series'],
      ['/rrb/science/physics/', 'Physics'],
      ['/rrb/maths/', 'Maths'],
      ['/rrb/reasoning/', 'Reasoning'],
      ['/rrb/science/', 'Science'],
    ],
    androidP: 'Daily Dose for RRB, verified PYQs, Miga you can call in your language, and Quiz Rooms for speed rounds with friends. Private beta on Android.',
    faqs: [
      ['How is this different from a normal railway exam app?', 'MindGains connects the loop: a concept leads into a real previous-year question, a wrong answer becomes spaced revision, revision earns XP, and XP feeds live Quiz Rooms with friends. Nothing you practise is wasted.'],
      ['Which RRB subjects are covered?', 'The public quizzes cover RRB Maths, Reasoning, Science and General Awareness — topic by topic, for NTPC, Group D and ALP.'],
      ['Is it free?', 'Yes. Every RRB topic quiz on the website is free with no sign-up. The Android app adds the Daily Dose, connected revision, Miga and Quiz Rooms.'],
    ],
  },

  ncert: {
    exam: 'NCERT Foundation',
    code: 'NCERT · Class 6–12 · UPSC-aligned',
    // SEO — see the banner in the UPSC block above.
    title: 'NCERT Class 6–12 MCQs — Chapter-wise Practice Quizzes | MindGains',
    description: 'Free chapter-wise NCERT MCQ practice for Class 6 to 12: objective questions with answers across Science, Maths, Social Science, History and Geography.',
    h1: 'Your NCERT foundation, connected.',
    heroP: 'Chapter explanations, questions, Miga in your language, smart revision and quizzes with friends — one loop, built around the books your exam is actually based on.',
    quizStart: '/ncert/science/',
    quizHub: ['/ncert/science/', 'Open NCERT Quiz Hub'],
    source: 'NCERT textbooks',
    dose: {
      day: 6, streak: 5,
      topic: 'Photosynthesis — light &amp; dark reactions',
      mins: 4,
      learn: 'Where each stage happens and what it makes — grounded in NCERT XI Biology, Ch. 13',
      pyq: 'NCERT-based PYQ · in which part of the chloroplast does the Calvin cycle occur?',
    },
    miga: {
      title: 'Ask Miga. In your language.',
      langOn: 'हिंदी',
      q: 'Light reaction और dark reaction में फर्क क्या है?',
      a: 'Light reaction thylakoid में होती है, प्रकाश चाहिए, ATP और NADPH बनते हैं। Dark reaction (Calvin cycle) stroma में होती है, प्रकाश की जरूरत नहीं, ग्लूकोज़ बनता है।',
      p: 'Ask any chapter doubt out loud and get a clear answer — in Hindi, Tamil, Telugu, Kannada, Malayalam or English. Cited to the NCERT line.',
    },
    liveQ: {
      tag: 'NCERT · Class 11 Biology · Photosynthesis',
      q: 'In which part of the chloroplast does the Calvin cycle (dark reaction) take place?',
      opts: ['Thylakoid membrane', 'Stroma', 'Outer membrane', 'Intermembrane space'],
      answer: 1,
      expl: 'The Calvin cycle occurs in the stroma, the fluid around the thylakoids. The light reactions happen on the thylakoid membranes.',
      next: ['/ncert/science/', 'Keep going in the Quiz Hub →'],
    },
    chips: [
      ['/ncert/science/class10/', 'Class 10 Science'],
      ['/ncert/history/class9/', 'Class 9 History'],
      ['/ncert/geography/class11/', 'Class 11 Geography'],
      ['/ncert/science/', 'Science'],
      ['/ncert/maths/', 'Maths'],
      ['/ncert/social-science/', 'Social Science'],
    ],
    androidP: 'Daily Dose from your NCERT chapters, connected revision, Miga in your language, and Quiz Rooms with friends. Private beta on Android.',
    faqs: [
      ['Which classes are covered?', 'The public quizzes cover NCERT Class 6 to 12 across Science, Maths, Social Science, History, Geography and Economics — chapter by chapter.'],
      ['Is this useful for UPSC?', 'Yes. NCERT is the foundation of the UPSC syllabus, and every quiz here is tagged so you can move from a class chapter into UPSC-level practice.'],
      ['Is it free?', 'Yes. Every NCERT topic quiz on the website is free with no sign-up. The Android app adds the Daily Dose, connected revision, Miga and Quiz Rooms.'],
    ],
  },

  samacheer: {
    exam: 'Samacheer Kalvi',
    code: 'Samacheer Kalvi · TN Board · Class 6–12',
    // SEO — see the banner in the UPSC block above.
    title: 'Samacheer Kalvi Class 6–12 Questions & MCQ Quizzes | MindGains',
    description: 'Free Samacheer Kalvi practice for Class 6 to 12: topic-wise questions and MCQ quizzes in Tamil and English — Tamil, Science, Maths and Social Science. TNPSC-aligned.',
    h1: 'Your Samacheer prep, connected.',
    heroP: 'Chapter explanations, questions, Miga in Tamil, smart revision and quizzes with friends — one loop, built around the Tamil Nadu board syllabus.',
    quizStart: '/samacheer/tamil/',
    quizHub: ['/samacheer/tamil/', 'Open Samacheer Quiz Hub'],
    source: 'Samacheer Kalvi textbooks',
    dose: {
      day: 5, streak: 4,
      topic: 'Tamil Nadu — rivers &amp; major dams',
      mins: 4,
      learn: 'Cauvery, Vaigai, Thamirabarani and the dams on them — grounded in Samacheer X Geography',
      pyq: 'Samacheer / TNPSC-style PYQ · the Mettur dam is built across which river?',
    },
    miga: {
      title: 'Ask Miga. In Tamil.',
      langOn: 'தமிழ்',
      q: 'மேட்டூர் அணை எந்த ஆற்றில் கட்டப்பட்டுள்ளது?',
      a: 'மேட்டூர் அணை காவிரி (Cauvery) ஆற்றில் கட்டப்பட்டது, சேலம் மாவட்டத்தில். இது உலகின் மிகப்பெரிய அணைகளில் ஒன்று.',
      p: 'Ask any chapter doubt out loud and get a clear answer back in Tamil — or Hindi, Telugu, Kannada, Malayalam and English.',
    },
    liveQ: {
      tag: 'Samacheer · Class 10 Geography · Tamil Nadu',
      q: 'The Mettur Dam in Tamil Nadu is built across which river?',
      opts: ['Vaigai', 'Cauvery', 'Thamirabarani', 'Palar'],
      answer: 1,
      expl: 'The Mettur Dam (Stanley Reservoir) is built across the Cauvery in Salem district — one of the largest dams in India.',
      next: ['/samacheer/tamil/', 'Keep going in the Quiz Hub →'],
    },
    chips: [
      ['/samacheer/tamil/class10/', 'Class 10 Tamil'],
      ['/samacheer/science/class9/', 'Class 9 Science'],
      ['/samacheer/social-science/class10/', 'Class 10 Social Science'],
      ['/samacheer/tamil/', 'Tamil'],
      ['/samacheer/maths/', 'Maths'],
      ['/samacheer/science/', 'Science'],
    ],
    androidP: 'Daily Dose from your Samacheer chapters, connected revision, Miga in Tamil, and Quiz Rooms with friends. Private beta on Android.',
    faqs: [
      ['Which Samacheer classes are covered?', 'The public quizzes cover Samacheer Kalvi Class 6 to 12 across Tamil, Science, Maths, Social Science, History and Computer Science — chapter by chapter.'],
      ['Does it help with TNPSC?', 'Yes. The Samacheer syllabus is the base of the TNPSC General Studies paper, and quizzes are tagged so you can move from a school chapter into TNPSC-level practice.'],
      ['Is it free?', 'Yes. Every Samacheer topic quiz on the website is free with no sign-up. The Android app adds the Daily Dose, connected revision, Miga and Quiz Rooms.'],
    ],
  },
};

/* --------------------------------------------------------------- helpers ---- */

function esc(v) {
  return String(v ?? '')
    .replace(/&(?!(amp|lt|gt|quot|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function attr(v) {
  return String(v ?? '').replace(/&(?!(amp|lt|gt|quot|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;').replace(/"/g, '&quot;').replace(/\n/g, ' ');
}
// text that is already trusted markup-lite (kept from config, may contain &amp; / entities)
function raw(v) { return String(v ?? ''); }

function stripTags(v) { return String(v ?? '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&'); }

function readQuizCounts() {
  const f = path.join(ROOT, 'assets', 'quiz-index.json');
  if (!fs.existsSync(f)) return {};
  const idx = JSON.parse(fs.readFileSync(f, 'utf8'));
  const out = {};
  for (const id of Object.keys(HUBS)) {
    out[id] = idx.filter((it) => it.type === 'Topic' && it.url.startsWith(`/${id}/`)).length;
  }
  return out;
}

/* SVG glyphs (stroke, currentColor) */
const IC = {
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 0 2 2h13"/>',
  check: '<path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  loop: '<path d="M3 12a9 9 0 1 0 9-9M3 12V6M3 12h6"/>',
  star: '<path d="m12 3 2.5 5 5.5.8-4 3.9 1 5.5L12 21l-5 -2.9 1-5.5-4-3.9 5.5-.8Z"/>',
  users: '<path d="M16 3a4 4 0 0 1 0 8M8 3a4 4 0 0 0 0 8M2 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M18 15h.5a3.5 3.5 0 0 1 3.5 3.5V21"/>',
  spark: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>',
  mic: '<path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>',
  flag: '<path d="M4 21V4h9l1 2h6v9h-7l-1-2H4"/>',
};
function svg(paths, cls) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ''}>${paths}</svg>`;
}

/* --------------------------------------------------------------- template --- */

function page(id, hub, count) {
  const url = `${SITE}/${id}/`;
  const jsonld = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: stripTags(hub.exam), item: url },
    ] },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: hub.faqs.map(([q, a]) => ({
      '@type': 'Question', name: stripTags(q), acceptedAnswer: { '@type': 'Answer', text: stripTags(a) },
    })) },
  ];

  const verbs = ['Learn', 'Ask', 'Practise', 'Fix', 'Challenge', 'Climb']
    .map((v) => `<span><b>${v}</b></span>`).join('');

  const loopNodes = [
    ['n1', IC.book, 'Textbook', `A cited explanation from ${hub.source}.`],
    ['n2', IC.check, 'PYQ', 'A real past question on that exact idea.'],
    ['n3', IC.target, 'Mistake', "Get it wrong? It's saved, not forgotten."],
    ['n4', IC.loop, 'Revision', 'It returns on a spaced schedule until it sticks.'],
    ['n5', IC.star, 'XP', 'Every correct answer counts toward your score.'],
    ['n6', IC.users, 'Quiz Rooms', 'Your XP feeds a live match against friends.'],
  ].map(([c, ic, h, p], i, arr) => `      <div class="node">
        <span class="nt ${c}" aria-hidden="true">${svg(ic)}</span>
        <h4>${h}</h4><p>${p}</p>${i < arr.length - 1 ? '\n        <span class="lead" aria-hidden="true">→</span>' : ''}
      </div>`).join('\n');

  const opts = hub.liveQ.opts.map((o, i) => `        <button class="opt" data-i="${i}">${esc(o)}</button>`).join('\n');
  const chips = hub.chips.map(([href, label]) => `      <a href="${attr(href)}">${raw(label)}</a>`).join('\n');
  const faqs = hub.faqs.map(([q, a]) => `    <details>
      <summary>${raw(q)}</summary>
      <p>${raw(a)}</p>
    </details>`).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(hub.title)}</title>
<meta name="description" content="${attr(hub.description)}">
<link rel="canonical" href="${attr(url)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${attr(hub.title)}">
<meta property="og:description" content="${attr(hub.description)}">
<meta property="og:url" content="${attr(url)}">
<meta property="og:image" content="${SITE}/assets/icons/mindgains-logo-512.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;450;500;600&display=swap" rel="stylesheet">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#00d4c7">
<link rel="stylesheet" href="/assets/exam-hubs.css">
<script type="application/ld+json">${JSON.stringify(jsonld[0])}</script>
<script type="application/ld+json">${JSON.stringify(jsonld[1])}</script>
</head>
<body>

<header>
  <div class="wrap hin">
    <a class="brand" href="/"><span class="dot" aria-hidden="true"></span>MindGains</a>
    <div class="hnav">
      <a class="lnk" href="/">All exams</a>
      <a class="lnk" href="${attr(hub.quizStart)}">Quizzes</a>
      <a class="btn sm" href="/get/">Get the app</a>
    </div>
  </div>
</header>

<main>

  <section class="wrap hero">
    <span class="kick">${raw(hub.code)}</span>
    <h1>${esc(hub.h1)}</h1>
    <p>${raw(hub.heroP)}</p>
    <div class="hero-actions">
      <a class="btn" href="${attr(hub.quizStart)}">Start practising free</a>
      <a class="btn ghost" href="/get/">MindGains for Android — coming soon</a>
    </div>
    <div class="verbs" aria-hidden="true">${verbs}</div>
  </section>

  <section class="wrap sec">
    <div class="sec-head">
      <span class="kick">Every day</span>
      <h2>It starts with today's dose.</h2>
      <p>One focused lesson from the ${stripTags(hub.exam)} syllabus, a recall card and a real question — chosen for where you are, waiting when you open the app.</p>
    </div>
    <div class="scene split" style="margin-top:26px">
      <div class="dose" aria-label="Example ${stripTags(hub.exam)} daily dose">
        <div class="dtop"><span>${stripTags(hub.exam)} · Daily Dose · Day ${hub.dose.day}</span><span class="streak">🔥 ${hub.dose.streak}-day streak</span></div>
        <h3>${raw(hub.dose.topic)}</h3>
        <p class="sub">${hub.dose.mins}-min lesson · 1 recall card · 1 question</p>
        <div class="row">
          <span class="ic" aria-hidden="true">${svg(IC.book)}</span>
          <span class="tx">Learn <span>${raw(hub.dose.learn)}</span></span>
        </div>
        <div class="row">
          <span class="ic" aria-hidden="true">${svg(IC.check)}</span>
          <span class="tx">Practise <span>${raw(hub.dose.pyq)}</span></span>
        </div>
        <div class="bar"><i></i></div>
      </div>
      <div>
        <h3 style="font-family:Poppins,sans-serif;font-weight:600;font-size:19px;letter-spacing:-.02em;margin:0 0 8px">Not another feed to scroll.</h3>
        <p style="margin:0;color:var(--ink-2);font-size:15px">The dose knows what you've done, what you got wrong, and what the exam actually asks. Miss a day and your streak reminds you — in your language.</p>
      </div>
    </div>
  </section>

  <section class="wrap sec">
    <div class="sec-head">
      <span class="kick">The part that matters</span>
      <h2>Nothing you study is thrown away.</h2>
      <p>Your textbook explanation shouldn't disappear after you read it. It should lead somewhere. In MindGains, every step feeds the next.</p>
    </div>
    <div class="loop">
${loopNodes}
    </div>
  </section>

  <section class="wrap sec">
    <div class="scene split">
      <div>
        <span class="kick">With friends</span>
        <h2 class="scene-h">Studying is better with competition.</h2>
        <p class="scene-p">Create a Quiz Room on any topic. Invite your friends. See who actually knows it — live, question by question.</p>
        <a class="btn" href="/get/">Create a Quiz Room</a>
      </div>
      <div class="room" aria-label="Example live Quiz Room">
        <div class="rt"><b>Constitution Challenge ⚡</b></div>
        <div class="rmeta">6 players · 10 questions</div>
        <div class="lb">
          <div class="lr me"><span class="av" style="background:#6d63ff">R</span> Ragul <span class="xp">820 XP</span></div>
          <div class="lr"><span class="av" style="background:#f43f5e">A</span> Arun <span class="xp">760 XP</span></div>
          <div class="lr"><span class="av" style="background:#f59e0b">N</span> Naveen <span class="xp">690 XP</span></div>
        </div>
        <div class="q">Question 7 / 10</div>
        <div class="reacts" aria-hidden="true"><span>🔥</span><span>😮</span><span>😅</span><span>👏</span></div>
      </div>
    </div>
  </section>

  <section class="wrap sec">
    <div class="scene split">
      <div class="miga-card" aria-label="Asking Miga">
        <div class="mrow"><span class="mav" aria-hidden="true"></span><span class="bubble">${raw(hub.miga.q)}</span></div>
        <div class="mrow"><span class="bubble you">${raw(hub.miga.a)}</span></div>
        <div class="mic" aria-hidden="true">🎙️ Tap to ask out loud</div>
        <div class="langs" aria-hidden="true"><span class="on">${raw(hub.miga.langOn)}</span><span>हिंदी</span><span>தமிழ்</span><span>తెలుగు</span><span>ಕನ್ನಡ</span><span>English</span></div>
      </div>
      <div>
        <span class="kick">When you're stuck</span>
        <h2 class="scene-h">${esc(hub.miga.title)}</h2>
        <p class="scene-p">${raw(hub.miga.p)}</p>
      </div>
    </div>
  </section>

  <section class="wrap sec">
    <div class="sec-head">
      <span class="kick">Already live</span>
      <h2>You don't have to wait for the app.</h2>
      <p>The Quiz Hub is open now — free, no sign-up. Try a real ${stripTags(hub.exam)} question:</p>
    </div>
    <div class="qz" style="margin-top:22px">
      <span class="qtag">${raw(hub.liveQ.tag)}</span>
      <p class="qq">${esc(hub.liveQ.q)}</p>
      <div id="qz-opts">
${opts}
      </div>
      <div class="expl" id="qz-expl">${esc(hub.liveQ.expl)}</div>
      <a class="btn next" id="qz-next" href="${attr(hub.liveQ.next[0])}">${raw(hub.liveQ.next[1])}</a>
    </div>
  </section>

  <section class="wrap sec practice-chips">
    <div class="sec-head">
      <span class="kick">Practise free</span>
      <h2>Popular ${stripTags(hub.exam)} topics</h2>
    </div>
    <div class="chips" style="margin-top:18px">
${chips}
    </div>
    <a class="btn" style="margin-top:16px" href="${attr(hub.quizHub[0])}">${raw(hub.quizHub[1])}</a>
  </section>

  <section class="wrap sec" style="padding-bottom:44px">
    <div class="band">
      <div>
        <h2>MindGains for Android</h2>
        <p>${raw(hub.androidP)}</p>
      </div>
      <a class="btn" href="/get/">Get early access</a>
    </div>
  </section>

  <section class="wrap faq sec" style="padding-top:8px">
    <h2>${stripTags(hub.exam)} FAQs</h2>
${faqs}
  </section>

</main>

<footer>
  <div class="wrap fin">
    <span class="fb">MindGains</span>
    <nav>
      <a href="/upsc/">UPSC</a>
      <a href="/tnpsc/">TNPSC</a>
      <a href="/ssc/">SSC</a>
      <a href="/rrb/">RRB</a>
      <a href="/ncert/">NCERT</a>
      <a href="/samacheer/">Samacheer</a>
      <a href="/quiz/">Quiz Hub</a>
      <a href="/editorial/">Editorial</a>
      <a href="/get/">Get the app</a>
      <a href="/privacy.html">Privacy</a>
      <a href="/terms.html">Terms</a>
    </nav>
    <span class="cc">© 2026 MindGains Labs Private Limited</span>
  </div>
</footer>

<script>
  (function(){
    var ANSWER = ${hub.liveQ.answer}, done = false;
    var opts = document.querySelectorAll('#qz-opts .opt');
    var expl = document.getElementById('qz-expl');
    var next = document.getElementById('qz-next');
    opts.forEach(function(b){
      b.addEventListener('click', function(){
        if(done) return;
        done = true;
        var i = +b.dataset.i;
        opts.forEach(function(o){ o.disabled = true; });
        opts[ANSWER].classList.add('right');
        if(i !== ANSWER) b.classList.add('wrong');
        expl.classList.add('show');
        next.classList.add('show');
      });
    });
  })();
</script>

</body>
</html>
`;
}

/* ------------------------------------------------------------------ build --- */

function updateSitemap(ids) {
  const f = path.join(ROOT, 'sitemap.xml');
  if (!fs.existsSync(f)) return;
  let xml = fs.readFileSync(f, 'utf8');
  const lines = ids.map((id) => `  <url><loc>${SITE}/${id}/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`).join('\n');
  for (const id of ids) {
    xml = xml.replace(new RegExp(`\\n  <url><loc>${SITE}/${id}/</loc>[^\\n]*</url>`, 'g'), '');
  }
  xml = xml.replace('\n</urlset>', `\n${lines}\n</urlset>`);
  fs.writeFileSync(f, xml, 'utf8');
}

function main() {
  const counts = readQuizCounts();
  const ids = Object.keys(HUBS);
  for (const id of ids) {
    const dir = path.join(ROOT, id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), page(id, HUBS[id], counts[id]), 'utf8');
  }
  updateSitemap(ids);
  console.log(`Generated ${ids.length} exam pages: ${ids.join(', ')}`);
}

main();

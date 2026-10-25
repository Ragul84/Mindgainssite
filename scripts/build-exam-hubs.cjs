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
    code: 'UPSC · CIVIL SERVICES',
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │ SEO — keyword-optimised. This block is the ONLY place page <title>  │
    // │ and <meta description> come from. Edit deliberately; check Search   │
    // │ Console after any change. Keep <title> ≤ ~60 chars, description     │
    // │ ~150–160. Do not add brand fluff — lead with the query intent.     │
    // └─────────────────────────────────────────────────────────────────────┘
    title: 'UPSC Prelims Practice — PYQs & Topic Quizzes | MindGains',
    description: 'Free UPSC Prelims practice: previous-year questions and topic-wise quizzes across Polity, History, Economy, Geography, Environment and CSAT. No sign-up needed.',
    h1: 'Master the UPSC Civil Services Examination',
    lede: 'Prepare for UPSC.',
    heroP: 'Learn with textbook-grounded AI that cites its sources. Practise unlimited topic quizzes and real Previous Year Questions. Simulate Mains with answer evaluation and full-length mocks. Study alongside Miga, your AI companion — while MindGains tracks every mistake, finds your weak areas, and brings them back at the right time until they stick.',
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
      title: 'Stuck? Ask Miga.',
      langOn: 'हिंदी',
      q: 'बेसिक स्ट्रक्चर डॉक्ट्रिन का मतलब क्या है, आसान शब्दों में?',
      a: 'संविधान का एक "मूल ढाँचा" है जिसे संसद संशोधन से भी नहीं बदल सकती — जैसे न्यायिक समीक्षा, संघवाद, धर्मनिरपेक्षता। ये केशवानंद भारती (1973) में तय हुआ।',
      p: 'Ask the follow-up you would normally keep to yourself. Ask why your answer was wrong. Ask for it simpler. Ask for a harder one. In Hindi, Tamil, Telugu, Kannada, Malayalam or English — typed or out loud.',
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
    androidP: 'Daily Dose. Textbook-aware Miga. PYQs. Mocks. Revision. Quiz Rooms. One learning history that doesn’t reset every time you close the app. MindGains for Android · Private beta.',
    faqs: [
      ['How is this different from a normal UPSC quiz app?', 'MindGains connects the whole loop: a textbook explanation leads into a previous-year question, a wrong answer becomes spaced revision, revision earns XP, and XP feeds live Quiz Rooms with friends. Nothing you learn is thrown away.'],
      ['Does MindGains replace standard UPSC books?', 'No. It works as a daily practice and revision layer alongside NCERT, standard books and classes — connecting what you read to real previous-year questions and keeping your mistakes coming back until they stick.'],
      ['Can I use MindGains for free?', 'Yes. Every UPSC topic quiz on the website is free with no sign-up. The Android app adds the Daily Dose, connected revision, Miga and Quiz Rooms.'],
    ],
  },

  tnpsc: {
    exam: 'TNPSC',
    code: 'TNPSC · GROUP 1, 2, 2A, 4 &amp; VAO',
    // SEO — see the banner in the UPSC block above.
    title: 'TNPSC Group 1, 2 & 4 Practice — PYQs & Quizzes | MindGains',
    description: 'Free TNPSC practice for Group 1, 2, 2A & 4: previous-year questions and topic-wise quizzes in Tamil and English — Tamil, History, Polity, GS and Aptitude.',
    h1: 'TNPSC Preparation — PYQs, Samacheer Notes &amp; Mock Tests',
    lede: 'Prepare for TNPSC.',
    heroP: 'Learn from Samacheer. Practise real PYQs in Tamil or English. Take mocks. Ask Miga. And when you get something wrong, MindGains brings it back until it sticks.',
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
      title: 'Stuck? Ask Miga.',
      langOn: 'தமிழ்',
      q: 'டைரக்டிவ் ப்ரின்சிபிள்ஸ் ஏன் நீதிமன்றத்தில் அமல்படுத்த முடியாது?',
      a: '"Non-justiciable" — அதாவது அரசுக்கு வழிகாட்டுதல்கள், ஆனால் மீறினால் நீதிமன்றம் தலையிடாது. Art. 37 இதை தெளிவாக சொல்கிறது.',
      p: 'Ask the follow-up you would normally keep to yourself. Ask why your answer was wrong. Ask for it simpler. Ask for a harder one. In Tamil, or Hindi, Telugu, Kannada, Malayalam and English — typed or out loud.',
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
    androidP: 'Daily Dose. Textbook-aware Miga in Tamil. PYQs. Mocks. Revision. Quiz Rooms. One learning history that doesn’t reset every time you close the app. MindGains for Android · Private beta.',
    faqs: [
      ['How is this different from a normal TNPSC quiz app?', 'MindGains connects the whole loop: a textbook explanation leads into a previous-year question, a wrong answer becomes spaced revision, revision earns XP, and XP feeds live Quiz Rooms with friends. Nothing you learn is thrown away.'],
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
    h1: 'SSC Preparation — CGL &amp; CHSL PYQs, Mock Tests &amp; Revision',
    lede: 'Prepare for SSC.',
    heroP: 'Learn the method. Practise real PYQs. Sit timed mocks. Ask Miga for the shortcut. And when you get something wrong, MindGains brings it back until it sticks.',
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
      title: 'Stuck? Ask Miga.',
      langOn: 'हिंदी',
      q: '7 की घात का last digit कैसे निकालें जल्दी से?',
      a: '7 की घातों का आखिरी अंक हर 4 पर दोहराता है: 7, 9, 3, 1। तो घात को 4 से भाग दो, शेषफल देखो — शेष 1→7, 2→9, 3→3, 0→1।',
      p: 'Ask why your answer was wrong. Ask for the shortcut. Ask for it simpler, or for a harder one. In Hindi, Tamil, Telugu, Kannada, Malayalam or English — typed or out loud.',
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
      ['/ssc/general-awareness/', 'General Awareness'],
    ],
    androidP: 'Daily Dose. Miga for the shortcut. PYQs. Timed mocks. Revision. Quiz Rooms. One learning history that doesn’t reset every time you close the app. MindGains for Android · Private beta.',
    faqs: [
      ['How is this different from a normal SSC quiz app?', 'MindGains connects the loop: a concept explanation leads into a real previous-year question, a wrong answer becomes spaced revision, revision earns XP, and XP feeds live Quiz Rooms with friends. Nothing you learn is wasted.'],
      ['Which SSC subjects are covered?', 'The public quizzes cover SSC Quant, Reasoning, English, General Awareness, Science, History and Economy — topic by topic.'],
      ['Is it free?', 'Yes. Every SSC topic quiz on the website is free with no sign-up. The Android app adds the Daily Dose, connected revision, Miga and Quiz Rooms.'],
    ],
  },

  rrb: {
    exam: 'RRB / Railway',
    code: 'RRB · NTPC, GROUP D &amp; ALP',
    // SEO — see the banner in the UPSC block above.
    title: 'RRB NTPC & Group D Practice — PYQs & Mock Quizzes | MindGains',
    description: 'Free RRB NTPC, Group D and ALP practice: previous-year questions and topic-wise mock quizzes across Maths, Reasoning, Science and General Awareness.',
    h1: 'RRB Preparation — NTPC &amp; Group D PYQs and Mock Tests',
    lede: 'Prepare for RRB.',
    heroP: 'Learn the method. Practise real PYQs. Sit timed mocks. Ask Miga for the shortcut. And when you get something wrong, MindGains brings it back until it sticks.',
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
      title: 'Stuck? Ask Miga.',
      langOn: 'हिंदी',
      q: 'Relative speed कब जोड़ते हैं और कब घटाते हैं?',
      a: 'उलटी दिशा में चल रहे हों तो speeds जोड़ो; एक ही दिशा में हों तो घटाओ। फिर समय = कुल लंबाई ÷ relative speed।',
      p: 'Ask why your answer was wrong. Ask for the shortcut. Ask for it simpler, or for a harder one. In Hindi, Tamil, Telugu, Kannada, Malayalam or English — typed or out loud.',
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
    androidP: 'Daily Dose. Miga for the shortcut. PYQs. Timed mocks. Revision. Quiz Rooms. One learning history that doesn’t reset every time you close the app. MindGains for Android · Private beta.',
    faqs: [
      ['How is this different from a normal railway exam app?', 'MindGains connects the loop: a concept leads into a real previous-year question, a wrong answer becomes spaced revision, revision earns XP, and XP feeds live Quiz Rooms with friends. Nothing you learn is wasted.'],
      ['Which RRB subjects are covered?', 'The public quizzes cover RRB Maths, Reasoning, Science and General Awareness — topic by topic, for NTPC, Group D and ALP.'],
      ['Is it free?', 'Yes. Every RRB topic quiz on the website is free with no sign-up. The Android app adds the Daily Dose, connected revision, Miga and Quiz Rooms.'],
    ],
  },

  ncert: {
    exam: 'NCERT Foundation',
    code: 'NCERT · CLASS 6–12',
    // SEO — see the banner in the UPSC block above.
    title: 'NCERT Class 6–12 MCQs — Chapter-wise Practice Quizzes | MindGains',
    description: 'Free chapter-wise NCERT MCQ practice for Class 6 to 12: objective questions with answers across Science, Maths, Social Science, History and Geography.',
    h1: 'NCERT Class 6–12 — Chapter-wise MCQs, Notes &amp; PYQs',
    lede: 'Build your NCERT foundation.',
    heroP: 'Learn straight from the NCERT chapter. Practise chapter questions and PYQs. Take exam-pattern tests. Ask Miga in your language. And when you get something wrong, MindGains brings it back until it sticks.',
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
      title: 'Stuck? Ask Miga.',
      langOn: 'हिंदी',
      q: 'Light reaction और dark reaction में फर्क क्या है?',
      a: 'Light reaction thylakoid में होती है, प्रकाश चाहिए, ATP और NADPH बनते हैं। Dark reaction (Calvin cycle) stroma में होती है, प्रकाश की जरूरत नहीं, ग्लूकोज़ बनता है।',
      p: 'Ask the chapter doubt you would normally skip. Ask why your answer was wrong. Ask for it simpler. In Hindi, Tamil, Telugu, Kannada, Malayalam or English — typed or out loud, cited to the NCERT line.',
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
    androidP: 'Daily Dose from your chapters. Textbook-aware Miga in your language. PYQs. Exam-pattern tests. Revision. Quiz Rooms. One learning history that doesn’t reset every time you close the app. MindGains for Android · Private beta.',
    faqs: [
      ['Which classes are covered?', 'The public quizzes cover NCERT Class 6 to 12 across Science, Maths, Social Science, History, Geography and Economics — chapter by chapter.'],
      ['Is this useful for UPSC?', 'Yes. NCERT is the foundation of the UPSC syllabus, and every quiz here is tagged so you can move from a class chapter into UPSC-level practice.'],
      ['Is it free?', 'Yes. Every NCERT topic quiz on the website is free with no sign-up. The Android app adds the Daily Dose, connected revision, Miga and Quiz Rooms.'],
    ],
  },

  samacheer: {
    exam: 'Samacheer Kalvi',
    code: 'SAMACHEER KALVI · TN BOARD · CLASS 6–12',
    // SEO — see the banner in the UPSC block above.
    title: 'Samacheer Kalvi Class 6–12 Questions & MCQ Quizzes | MindGains',
    description: 'Free Samacheer Kalvi practice for Class 6 to 12: topic-wise questions and MCQ quizzes in Tamil and English — Tamil, Science, Maths and Social Science. TNPSC-aligned.',
    h1: 'Samacheer Kalvi Class 6–12 — Book-back Questions &amp; MCQ Practice',
    lede: 'Learn your Samacheer.',
    heroP: 'Learn straight from the Samacheer chapter, in Tamil. Practise chapter questions. Take exam-pattern tests. Ask Miga. And when you get something wrong, MindGains brings it back until it sticks.',
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
      title: 'Stuck? Ask Miga.',
      langOn: 'தமிழ்',
      q: 'மேட்டூர் அணை எந்த ஆற்றில் கட்டப்பட்டுள்ளது?',
      a: 'மேட்டூர் அணை காவிரி (Cauvery) ஆற்றில் கட்டப்பட்டது, சேலம் மாவட்டத்தில். இது உலகின் மிகப்பெரிய அணைகளில் ஒன்று.',
      p: 'Ask the chapter doubt you would normally skip. Ask why your answer was wrong. Ask for it simpler. In Tamil, or Hindi, Telugu, Kannada, Malayalam and English — typed or out loud.',
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
    androidP: 'Daily Dose from your chapters. Miga in Tamil. PYQs. Exam-pattern tests. Revision. Quiz Rooms. One learning history that doesn’t reset every time you close the app. MindGains for Android · Private beta.',
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
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4M8 15h3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pen: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
};
function svg(paths, cls) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ''}>${paths}</svg>`;
}

/* --------------------------------------------------------------- template --- */

const BUILD_V = '20261017d';
const NL_SHOWCASE = fs.readFileSync(path.join(__dirname, 'partials', 'nationlap-showcase.html'), 'utf8');
const FOOTER = `<footer class="mg-foot">
  <div class="mg-foot-in">
    <div class="mg-foot-brand">
      <a href="/"><img src="/assets/icons/mindgains-logo-192.png" alt="" width="28" height="28" loading="lazy">MindGains</a>
      <p>Textbook-aware practice for India's competitive exams. Daily current affairs, quizzes and NationLap.</p>
    </div>
    <nav class="mg-foot-exams" aria-label="Exams"><h4>Exams</h4><ul>
      <li><a href="/upsc/">UPSC</a></li><li><a href="/tnpsc/">TNPSC</a></li><li><a href="/ssc/">SSC</a></li>
      <li><a href="/rrb/">RRB</a></li><li><a href="/ncert/">NCERT</a></li><li><a href="/samacheer/">Samacheer</a></li>
    </ul></nav>
    <nav aria-label="Practice"><h4>Practice</h4><ul>
      <li><a href="/nationlap/?affairs=1">Current affairs</a></li><li><a href="/quiz/">Quiz Hub</a></li>
      <li><a href="/nationlap/">NationLap</a></li><li><a href="/editorial/">Editorial</a></li>
    </ul></nav>
    <nav aria-label="Company"><h4>Company</h4><ul>
      <li><a href="/about/">About MindGains</a></li><li><a href="/get/">Get the app</a></li><li><a href="/blog/">Blog</a></li>
      <li><a href="/privacy/">Privacy</a></li><li><a href="/data-deletion/">Delete my data</a></li>
    </ul></nav>
  </div>
  <div class="mg-foot-legal"><span>© ${new Date().getFullYear()} MindGains Labs Private Limited</span><a href="/privacy/">Privacy</a><a href="/data-deletion/">Data deletion</a><a href="/sitemap.xml">Sitemap</a><a href="https://www.instagram.com/mindgains_ai/" rel="me noopener" target="_blank">Instagram</a><a href="https://www.linkedin.com/company/mindgains-ai" rel="me noopener" target="_blank">LinkedIn</a><a href="https://x.com/MindgainsIndia" rel="me noopener" target="_blank">X</a></div>
</footer>`;

const TAGLINE = {
  upsc: 'Previous-year questions and topic quizzes for Prelims, every answer explained from the books you already read.',
  tnpsc: 'Group 1, 2, 2A &amp; 4 practice: PYQs and topic quizzes, explained from your Samacheer books.',
  ssc: 'CGL &amp; CHSL practice across Quant, Reasoning, English and GA, with every answer explained.',
  rrb: 'NTPC &amp; Group D practice across Maths, Reasoning, Science and GA, with every answer explained.',
  ncert: 'Chapter-wise MCQs for Class 6–12, every answer traced back to the NCERT chapter.',
  samacheer: 'Book-back questions and chapter MCQs for TN Board Class 6–12, free.',
};
const SUBJECT_LABEL = {
  'csat-quant': 'CSAT Quant', 'csat-english': 'CSAT English', 'general-aware': 'General Awareness',
  'general-awareness': 'General Awareness', 'social-science': 'Social Science', computer: 'Computer Science',
  quant: 'Quantitative Aptitude', maths: 'Maths', economy: 'Economy', economics: 'Economics',
};
const SUBJECT_ICON = {
  polity: '<path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M2 10 12 3l10 7Z"/>',
  history: '<path d="M8 3h11v15a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2h13"/><path d="M8 3a3 3 0 0 0-3 3v10M12 8h4M12 12h4"/>',
  geography: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  economics: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
  environment: '<path d="M11 20A7 7 0 0 1 4 13c0-6 7-10 16-10-1 9-5 16-11 16Z"/><path d="M4 21c4-6 8-9 12-11"/>',
  science: '<path d="M9 3h6M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>',
  physics: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
  chemistry: '<path d="M9 3h6M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><circle cx="10" cy="16" r="1"/><circle cx="14" cy="18" r="1"/>',
  biology: '<path d="M6 3c0 6 12 6 12 12M18 3c0 6-12 6-12 12M6 21c0-2 1-3 2.5-4M18 21c0-2-1-3-2.5-4M8 7h8M8 13h8"/>',
  maths: '<path d="M18 4H6l6 8-6 8h12"/>',
  quant: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/>',
  reasoning: '<path d="M12 5a3 3 0 1 0-5.9.8A3 3 0 0 0 4 11a3 3 0 0 0 1.5 5.2A3 3 0 0 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.9.8A3 3 0 0 1 20 11a3 3 0 0 1-1.5 5.2A3 3 0 0 1 12 18Z"/>',
  english: '<path d="M4 18 9 5l5 13M5.5 14h7M17 10a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm3 0v8"/>',
  tamil: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 0 2 2h13M9 8h6M9 12h4"/>',
  computer: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  'general-awareness': '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3Z"/>',
  'social-science': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a5 5 0 0 1 3.5 6"/>',
};
SUBJECT_ICON.economy = SUBJECT_ICON.economics; SUBJECT_ICON['general-aware'] = SUBJECT_ICON['general-awareness'];
SUBJECT_ICON['csat-quant'] = SUBJECT_ICON.quant; SUBJECT_ICON['csat-english'] = SUBJECT_ICON.english;
const TINTS = ['#0b7a72', '#4f46e5', '#b45309', '#be185d', '#0369a1', '#15803d', '#7c3aed', '#c2410c'];

function subjectsOf(id) {
  const dir = path.join(ROOT, id);
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== 'preview' && fs.existsSync(path.join(dir, e.name, 'index.html')))
    .map((e) => {
      const sub = path.join(dir, e.name);
      const topics = fs.readdirSync(sub, { withFileTypes: true })
        .filter((t) => t.isDirectory() && fs.existsSync(path.join(sub, t.name, 'index.html'))).length;
      const label = SUBJECT_LABEL[e.name] || e.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      return { slug: e.name, label, topics };
    })
    .sort((a, b) => b.topics - a.topics);
}

const ARROW = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function page(id, hub) {
  const url = `${SITE}/${id}/`;
  const exam = stripTags(hub.exam);
  const subjects = subjectsOf(id);
  const topicTotal = subjects.reduce((n, s) => n + s.topics, 0);
  const SCHOOL = id === 'ncert' || id === 'samacheer';
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: exam, item: url },
    ] },
    { '@type': 'FAQPage', mainEntity: hub.faqs.map(([q, a]) => ({
      '@type': 'Question', name: stripTags(q), acceptedAnswer: { '@type': 'Answer', text: stripTags(a) },
    })) },
  ] };

  const subjectCards = subjects.map((s, i) => `      <a class="subj" href="/${id}/${s.slug}/" style="--tint:${TINTS[i % TINTS.length]}">
        <span class="subj-ic">${svg(SUBJECT_ICON[s.slug] || IC.book)}</span>
        <span class="subj-t">${esc(s.label)}</span>
        <span class="subj-n">${s.topics ? `${s.topics} topic${s.topics === 1 ? '' : 's'}` : 'Practice set'}</span>
        ${ARROW}
      </a>`).join('\n');
  const opts = hub.liveQ.opts.map((o, i) => `          <button class="opt" data-i="${i}"><span class="opt-k">${'ABCD'[i]}</span><span>${esc(o)}</span></button>`).join('\n');
  const chips = hub.chips.map(([href, label]) => `        <a href="${attr(href)}">${raw(label)}</a>`).join('\n');
  const faqs = hub.faqs.map(([q, a]) => `      <details>
        <summary>${raw(q)}</summary>
        <p>${raw(a)}</p>
      </details>`).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(hub.title)}</title>
<meta name="description" content="${attr(hub.description)}">
<link rel="canonical" href="${attr(url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="MindGains AI">
<meta property="og:title" content="${attr(hub.title)}">
<meta property="og:description" content="${attr(hub.description)}">
<meta property="og:url" content="${attr(url)}">
<meta property="og:image" content="${SITE}/assets/icons/mindgains-logo-512.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#fbfcfd">
<link rel="stylesheet" href="/assets/exam-hub-v2.css?v=${BUILD_V}">
<link rel="stylesheet" href="/assets/site-footer.css?v=3">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body class="hub-v2">

<header class="hh">
  <div class="wrap hin">
    <a class="brand" href="/"><img src="/assets/icons/mindgains-logo-192.png" alt="" width="28" height="28">MindGains</a>
    <div class="hnav">
      <a class="lnk" href="/">All exams</a>
      <a class="lnk" href="#subjects">Subjects</a>
      <a class="lnk" href="/nationlap/?affairs=1">Current affairs</a>
      <a class="lnk" href="/nationlap/">NationLap</a>
      <a class="btn sm" href="/get/">Get the app</a>
    </div>
  </div>
</header>

<main>
  <section class="hero">
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="wrap hero-in">
      <div class="hero-copy">
        <span class="pill"><i></i>${raw(hub.code)}</span>
        <h1>${esc(hub.h1)}</h1>
        <p class="lede">${raw(TAGLINE[id] || '')}</p>
        <div class="cta-row">
          <a class="btn" href="#subjects">Start practising ${ARROW}</a>
          <a class="btn ghost" href="/nationlap/?affairs=1">Today's current affairs</a>
        </div>
        <ul class="stats">
          <li><b>${topicTotal}</b><span>topic quizzes</span></li>
          <li><b>${subjects.length}</b><span>subjects</span></li>
          <li><b>Free</b><span>no sign-up</span></li>
        </ul>
      </div>

      <div class="qcard" aria-label="Try a real ${esc(exam)} question">
        <div class="qcard-top"><span class="qtag">${raw(hub.liveQ.tag)}</span><span class="qlive">Try one</span></div>
        <p class="qq">${esc(hub.liveQ.q)}</p>
        <div id="qz-opts">
${opts}
        </div>
        <div class="expl" id="qz-expl">${esc(hub.liveQ.expl)}</div>
        <a class="qnext" id="qz-next" href="${attr(hub.liveQ.next[0])}">More like this ${ARROW}</a>
      </div>
    </div>
  </section>

  <section class="wrap sec" id="subjects">
    <div class="sec-head">
      <h2>Pick a subject</h2>
      <p>Every quiz is free. Each answer comes with the reason it's right.</p>
    </div>
    <div class="subjects">
${subjectCards}
    </div>
    <div class="popular">
      <span>Popular</span>
      <div class="chips">
${chips}
      </div>
    </div>
  </section>

  ${NL_SHOWCASE.replace('a {{EXAM}}', ({ upsc: 'a UPSC ', tnpsc: 'a TNPSC ', ssc: 'an SSC ', rrb: 'an RRB ', ncert: 'an NCERT ', samacheer: 'a Samacheer ' })[id] || 'a ')}

  <section class="wrap sec">
    <div class="bento">
      <a class="tile tile-ca" href="/nationlap/?affairs=1">
        <span class="tile-k">Every morning · 5am</span>
        <h3>Today's current affairs</h3>
        <p>The day's exam-worthy news, each fact with its source. Race it in two minutes.</p>
        <span class="tile-go">Race today's affairs ${ARROW}</span>
      </a>
      <a class="tile tile-nl" href="/quiz/">
        <span class="tile-k">160,000+ questions</span>
        <h3>Quiz Hub</h3>
        <p>Search any topic across every exam and practise with answers explained.</p>
        <span class="tile-go">Open Quiz Hub ${ARROW}</span>
      </a>
    </div>
  </section>

  <section class="wrap sec">
    <div class="sec-head"><h2>Why it sticks</h2></div>
    <div class="feats">
      <div class="feat"><span class="feat-ic">${svg(IC.book)}</span><h3>Answers from your textbook</h3><p>Miga, the AI tutor, explains from ${raw(hub.source)} and shows where the answer came from.</p></div>
      <div class="feat"><span class="feat-ic">${svg(IC.loop)}</span><h3>Mistakes come back</h3><p>Every question you miss returns as revision at the right time, until you get it right.</p></div>
      <div class="feat"><span class="feat-ic">${svg(IC.target)}</span><h3>${SCHOOL ? 'Real exam questions' : 'Real PYQs'}</h3><p>${SCHOOL ? 'Practise the way your board exam asks, with every option explained.' : `See how ${esc(exam)} actually asked each topic, with every option explained.`}</p></div>
    </div>
  </section>

  <section class="wrap sec">
    <div class="band">
      <picture class="band-art">
        <source srcset="/assets/miga/miga-hero.webp" type="image/webp">
        <img src="/assets/miga/miga-hero.png" alt="" width="104" height="104" loading="lazy">
      </picture>
      <div class="band-copy">
        <h2>Take it with you</h2>
        <p>Daily Dose, revision, mocks and Quiz Rooms with friends, in the MindGains app.</p>
      </div>
      <a class="btn" href="/get/">Get the app</a>
    </div>
  </section>

  <section class="wrap sec faq">
    <div class="sec-head"><h2>${esc(exam)} FAQs</h2></div>
    <div class="faq-list">
${faqs}
    </div>
  </section>
</main>

${FOOTER}

<script>
(function(){
  var ANSWER = ${hub.liveQ.answer}, done = false;
  var opts = document.querySelectorAll('#qz-opts .opt');
  opts.forEach(function(b){
    b.addEventListener('click', function(){
      if(done) return; done = true;
      opts.forEach(function(o){ o.disabled = true; });
      opts[ANSWER].classList.add('right');
      if(+b.dataset.i !== ANSWER) b.classList.add('wrong');
      document.getElementById('qz-expl').classList.add('show');
      document.getElementById('qz-next').classList.add('show');
    });
  });
})();
</script>
<script defer src="/assets/pv.js"></script>
<script defer src="/assets/nav-mobile.js"></script>
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
    fs.writeFileSync(path.join(dir, 'index.html'), page(id, HUBS[id]), 'utf8');
  }
  // sitemap entries are managed by build-sitemap.cjs
  console.log(`Generated ${ids.length} exam pages: ${ids.join(', ')}`);
}

main();

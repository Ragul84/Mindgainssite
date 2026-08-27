/**
 * 🏆 GOLD TOPIC REGISTRY — MindGains Mission Curriculum
 * The definitive 30-day topic map for UPSC, SSC, TNPSC ecosystems.
 * Every topic here gets FULL coaching-grade content — no recycling, no filler.
 */

const GOLD_REGISTRY = {
  upsc_ecosystem: [
    // POLITY BLOCK (Days 1–15)
    { day: 1, topic: 'The Preamble', subject: 'Polity' },
    { day: 2, topic: 'Articles 12-13: State & Judicial Review', subject: 'Polity' },
    { day: 3, topic: 'Right to Equality (Art 14-18)', subject: 'Polity' },
    { day: 4, topic: 'Right to Freedom (Art 19-22)', subject: 'Polity' },
    { day: 5, topic: 'Rights Against Exploitation & Religion (Art 23-28)', subject: 'Polity' },
    { day: 6, topic: 'Cultural, Educational Rights & Art 32', subject: 'Polity' },
    { day: 7, topic: 'DPSP: Socialistic, Gandhian & Liberal Principles', subject: 'Polity' },
    { day: 8, topic: 'Fundamental Duties (Art 51A)', subject: 'Polity' },
    { day: 9, topic: 'Basic Structure Doctrine', subject: 'Polity' },
    { day: 10, topic: 'Parliament: Lok Sabha & Rajya Sabha', subject: 'Polity' },
    { day: 11, topic: 'Legislative Process: Money Bill vs Financial Bill', subject: 'Polity' },
    { day: 12, topic: 'President: Powers & Emergency Provisions', subject: 'Polity' },
    { day: 13, topic: 'Federalism: Union-State Relations', subject: 'Polity' },
    { day: 14, topic: 'Supreme Court & Judicial Review', subject: 'Polity' },
    { day: 15, topic: 'Constitutional Bodies: EC, CAG, UPSC', subject: 'Polity' },
    // HISTORY BLOCK (Days 16–25)
    { day: 16, topic: 'Indus Valley Civilisation', subject: 'Ancient History' },
    { day: 17, topic: 'Buddhism: Philosophy, Councils & Spread', subject: 'Ancient History' },
    { day: 18, topic: 'Mauryan Empire: Ashoka & Administration', subject: 'Ancient History' },
    { day: 19, topic: 'Gupta Empire: Golden Age of India', subject: 'Ancient History' },
    { day: 20, topic: 'Delhi Sultanate: Dynasties & Administration', subject: 'Medieval History' },
    { day: 21, topic: 'Mughal Empire: Akbar to Aurangzeb', subject: 'Medieval History' },
    { day: 22, topic: 'Bhakti & Sufi Movements', subject: 'Medieval History' },
    { day: 23, topic: '1857 Revolt: Causes & Consequences', subject: 'Modern History' },
    { day: 24, topic: 'Socio-Religious Reform Movements (19th Century)', subject: 'Modern History' },
    { day: 25, topic: 'Indian National Congress: Foundation to 1920', subject: 'Modern History' },
    // ECONOMY BLOCK (Days 26–30)
    { day: 26, topic: 'National Income: GDP, GNP, NNP', subject: 'Economy' },
    { day: 27, topic: 'Inflation: CPI, WPI & RBI Monetary Policy', subject: 'Economy' },
    { day: 28, topic: 'Banking: RBI, CRR, SLR, Repo Rate', subject: 'Economy' },
    { day: 29, topic: 'Fiscal Policy: Budget, FRBM & Deficits', subject: 'Economy' },
    { day: 30, topic: 'International Trade: WTO, IMF & Balance of Payments', subject: 'Economy' },
  ],

  ssc_ecosystem: [
    // QUANTITATIVE APTITUDE (Days 1–15)
    { day: 1, topic: 'Unit Digit & Cyclicity Rules', subject: 'Quant' },
    { day: 2, topic: 'LCM & HCF: Word Problem Strategies', subject: 'Quant' },
    { day: 3, topic: 'Surds, Indices & Simplification', subject: 'Quant' },
    { day: 4, topic: 'Percentage: Fraction Mastery List', subject: 'Quant' },
    { day: 5, topic: 'Profit, Loss & Discount', subject: 'Quant' },
    { day: 6, topic: 'Simple Interest & Compound Interest', subject: 'Quant' },
    { day: 7, topic: 'Ratio, Proportion & Partnership', subject: 'Quant' },
    { day: 8, topic: 'Average, Mixture & Alligation', subject: 'Quant' },
    { day: 9, topic: 'Time & Work + Pipes & Cisterns', subject: 'Quant' },
    { day: 10, topic: 'Time, Speed & Distance + Trains & Boats', subject: 'Quant' },
    { day: 11, topic: 'Algebra: Identities & Value Substitution', subject: 'Quant' },
    { day: 12, topic: 'Geometry: Lines, Angles & Triangles', subject: 'Quant' },
    { day: 13, topic: 'Trigonometry: Ratios, Tables & Heights', subject: 'Quant' },
    { day: 14, topic: 'Mensuration: 2D Shapes Formulae', subject: 'Quant' },
    { day: 15, topic: 'Mensuration: 3D Shapes & Volume', subject: 'Quant' },
    // REASONING (Days 16–22)
    { day: 16, topic: 'Analogy & Classification', subject: 'Reasoning' },
    { day: 17, topic: 'Coding-Decoding: Letter Shift Patterns', subject: 'Reasoning' },
    { day: 18, topic: 'Blood Relations: Family Tree Method', subject: 'Reasoning' },
    { day: 19, topic: 'Syllogism: 100-50 Method & Venn Diagrams', subject: 'Reasoning' },
    { day: 20, topic: 'Direction & Distance + Clock Problems', subject: 'Reasoning' },
    { day: 21, topic: 'Number Series & Missing Term', subject: 'Reasoning' },
    { day: 22, topic: 'Mirror Image, Water Image & Paper Folding', subject: 'Reasoning' },
    // ENGLISH (Days 23–30)
    { day: 23, topic: 'Tenses: 12-Tense Framework', subject: 'English' },
    { day: 24, topic: 'Subject-Verb Agreement: The 15 Rules', subject: 'English' },
    { day: 25, topic: 'Active & Passive Voice: Switch Formula', subject: 'English' },
    { day: 26, topic: 'Direct & Indirect Speech: Reporting Rules', subject: 'English' },
    { day: 27, topic: 'Articles (a, an, the): Usage Rules', subject: 'English' },
    { day: 28, topic: 'Prepositions: Fixed Phrases List', subject: 'English' },
    { day: 29, topic: 'Idioms & Phrases: High-Frequency 50', subject: 'English' },
    { day: 30, topic: 'One Word Substitution & Synonyms-Antonyms', subject: 'English' },
  ],

  tnpsc_ecosystem: [
    // TAMIL LANGUAGE (Days 1–10)
    { day: 1, topic: 'இலக்கணம்: எழுத்து — முதல் & சார்பு எழுத்துக்கள்', subject: 'Tamil' },
    { day: 2, topic: 'இலக்கணம்: சொல் — பெயர்ச்சொல், வினைச்சொல், இடைச்சொல்', subject: 'Tamil' },
    { day: 3, topic: 'வேற்றுமை உருபுகள் (8 Case Markers)', subject: 'Tamil' },
    { day: 4, topic: 'திருக்குறள்: அறத்துப்பால் — Key Chapters', subject: 'Tamil' },
    { day: 5, topic: 'நாலடியார் & பழமொழி நானூறு', subject: 'Tamil' },
    { day: 6, topic: 'சங்க இலக்கியம்: எட்டுத்தொகை Overview', subject: 'Tamil' },
    { day: 7, topic: 'பாரதியார் & பாரதிதாசன்: இலக்கியம் & வாழ்க்கை', subject: 'Tamil' },
    { day: 8, topic: 'மரபுச்சொற்கள் & திணை இலக்கியம்', subject: 'Tamil' },
    { day: 9, topic: 'தமிழ் அறிஞர்கள்: யார் எந்த நூல்?', subject: 'Tamil' },
    { day: 10, topic: 'இலக்கண பிழை நீக்கம் & பிரித்தெழுதுதல்', subject: 'Tamil' },
    // UNIT 8 — TN HISTORY & CULTURE (Days 11–20)
    { day: 11, topic: 'கீழடி அகழாய்வு & சங்க காலம்', subject: 'Unit 8' },
    { day: 12, topic: 'சோழர் வரலாறு: ராஜராஜன் & ராஜேந்திரன்', subject: 'Unit 8' },
    { day: 13, topic: 'பாண்டியர் & பல்லவர் கட்டடக்கலை', subject: 'Unit 8' },
    { day: 14, topic: 'நீதிக்கட்சி & முதல் கம்யூனல் G.O. (1921)', subject: 'Unit 8' },
    { day: 15, topic: 'ஈ.வெ.ரா பெரியார் & சுயமரியாதை இயக்கம்', subject: 'Unit 8' },
    { day: 16, topic: 'வ.உ.சி, சுப்பிரமணிய சிவா & தமிழ் விடுதலை', subject: 'Unit 8' },
    { day: 17, topic: 'இரட்டை ஆட்சி & 1919 Montagu-Chelmsford Reform', subject: 'Unit 8' },
    { day: 18, topic: 'தமிழ்நாடு சமூக சீர்திருத்தவாதிகள்', subject: 'Unit 8' },
    { day: 19, topic: 'தாகூர், திலகர், அன்னி பெசன்ட் — TN Connection', subject: 'Unit 8' },
    { day: 20, topic: 'Keezhadi, Adichanallur & TN Archaeology', subject: 'Unit 8' },
    // UNIT 9 — POLITY & GOVERNANCE (Days 21–25)
    { day: 21, topic: 'இந்திய அரசியலமைப்பு: முகவுரை & சிறப்புகள்', subject: 'Unit 9' },
    { day: 22, topic: 'அடிப்படை உரிமைகள்: கோட்பாடுகளும் வரம்புகளும்', subject: 'Unit 9' },
    { day: 23, topic: 'மாநில அரசு: ஆளுநர், முதலமைச்சர், சட்டமன்றம்', subject: 'Unit 9' },
    { day: 24, topic: 'உள்ளாட்சி: பஞ்சாயத்து ராஜ் & நகராட்சி', subject: 'Unit 9' },
    { day: 25, topic: 'தேர்தல் ஆணையம் & அலுவல் மொழிகள்', subject: 'Unit 9' },
    // GENERAL SCIENCE & ECONOMY (Days 26–30)
    { day: 26, topic: 'தாவரவியல்: தாவர உறுப்புகள் & ஒளிச்சேர்க்கை', subject: 'Science' },
    { day: 27, topic: 'விலங்கியல்: செல் கட்டமைப்பு & இனப்பெருக்கம்', subject: 'Science' },
    { day: 28, topic: 'இயற்பியல்: விசை, இயக்கம் & நியூட்டன் விதிகள்', subject: 'Science' },
    { day: 29, topic: 'தமிழ்நாட்டின் பொருளியல் & மனிதவள மேம்பாடு', subject: 'Economy' },
    { day: 30, topic: 'தமிழ்நாட்டின் நதிகள், மாவட்டங்கள் & புவியியல்', subject: 'Geography' },
  ]
};

console.log('Gold Registry Loaded.');
console.log('UPSC Topics:', GOLD_REGISTRY.upsc_ecosystem.length);
console.log('SSC Topics:', GOLD_REGISTRY.ssc_ecosystem.length);
console.log('TNPSC Topics:', GOLD_REGISTRY.tnpsc_ecosystem.length);
console.log('\nSample UPSC:', GOLD_REGISTRY.upsc_ecosystem[19].topic);
console.log('Sample SSC:', GOLD_REGISTRY.ssc_ecosystem[18].topic);
console.log('Sample TNPSC:', GOLD_REGISTRY.tnpsc_ecosystem[14].topic);

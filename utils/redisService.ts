/**
 * redisService.ts
 * Upstash Redis client — quiz data layer.
 * Uses HTTP REST API (works on web, iOS, Android).
 *
 * Actual Redis structure (already seeded externally):
 *   quiz:subject:{key}  LIST  — JSON question strings
 *   quiz:ids:{key}      SET   — question IDs (for dedup)
 *   quiz:textnorm:{key} SET   — normalised text (for dedup)
 *
 * Navigation structure (seeded by this file on first load):
 *   quiz:exams          STRING JSON — QuizExam[]
 *   quiz:subjects:{id}  STRING JSON — QuizSubject[]
 *   quiz:topics:{id}:{id} STRING JSON — QuizTopic[]
 */

const REDIS_URL   = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL!;
const REDIS_TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN!;

// ── Raw REST helpers ───────────────────────────────────────────────────────
async function redisCmd<T = any>(...args: (string | number)[]): Promise<T | null> {
  try {
    const res = await fetch(`${REDIS_URL}/${args.map(encodeURIComponent).join('/')}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    });
    const json = await res.json();
    return json.result ?? null;
  } catch (e) {
    console.warn('[Redis] cmd failed:', args[0], e);
    return null;
  }
}

async function redisCmdPost<T = any>(command: (string | number)[]): Promise<T | null> {
  try {
    const res = await fetch(REDIS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });
    const json = await res.json();
    return json.result ?? null;
  } catch (e) {
    console.warn('[Redis] POST failed:', e);
    return null;
  }
}

async function getJson<T>(key: string): Promise<T | null> {
  const raw = await redisCmd<string>('GET', key);
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return raw as unknown as T; }
}

async function setJson(key: string, value: unknown, exSeconds?: number): Promise<void> {
  const str = JSON.stringify(value);
  if (exSeconds) {
    await redisCmdPost(['SET', key, str, 'EX', String(exSeconds)]);
  } else {
    await redisCmdPost(['SET', key, str]);
  }
}

// ── Types ─────────────────────────────────────────────────────────────────
export interface QuizExam {
  id: string;
  name: string;
  icon: string;
  color: string;
  desc: string;
}

export interface QuizSubject {
  id: string;
  name: string;
  icon: string;
  /** Suffix of the Redis list key: quiz:subject:{redisKey} */
  redisKey: string;
}

export interface QuizTopic {
  id: string;
  name: string;
  questionCount?: number;
  /** Override the parent subject's redisKey for this specific topic */
  redisKey?: string;
  /** Filter questions by difficulty — easy=Class6-8, medium=Class9-10, hard=Class11-12/competitive */
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface RedisQuestion {
  id?: string;
  question: string;
  options: string[];
  answer_index: number;
  explanation: string;
  difficulty?: string;
}

// ── Navigation seed data ───────────────────────────────────────────────────
// Redis keys that EXIST: tamil, history, maths, polity, economics, geography, science, english
// Keys marked (🔜) need questions pushed to Redis before they return results.

const DEFAULT_EXAMS: QuizExam[] = [
  { id: 'tnpsc',      name: 'TNPSC',        icon: 'university',    color: '#00D4C7', desc: 'Tamil Nadu Public Service Commission' },
  { id: 'upsc',       name: 'UPSC',          icon: 'landmark',      color: '#8B5CF6', desc: 'Union Public Service Commission' },
  { id: 'ssc',        name: 'SSC',           icon: 'gavel',         color: '#F59E0B', desc: 'CGL · CHSL · MTS · CPO · GD' },
  { id: 'banking',    name: 'Banking',        icon: 'piggy-bank',    color: '#10B981', desc: 'IBPS PO/Clerk · SBI PO/Clerk · RBI' },
  { id: 'rrb',        name: 'RRB / Railway',  icon: 'train',         color: '#F43F5E', desc: 'NTPC · Group D · ALP · JE' },
  { id: 'samacheer',  name: 'Samacheer 6–12', icon: 'book-open',     color: '#6366F1', desc: 'Tamil Nadu School Curriculum' },
  { id: 'ncert',      name: 'NCERT 6–12',     icon: 'graduation-cap', color: '#F97316', desc: 'National School Curriculum (UPSC Foundation)' },
  { id: 'defence',    name: 'Defence Exams',  icon: 'shield-alt',    color: '#334155', desc: 'NDA · CDS · AFCAT · CAPF' },
  { id: 'teaching',   name: 'Teaching Exams', icon: 'chalkboard-teacher', color: '#EC4899', desc: 'CTET · TET · KVS · NVS' },
  { id: 'management', name: 'MBA Entrance',   icon: 'user-tie',      color: '#0EA5E9', desc: 'CAT · MAT · CMAT · XAT' },
];

// redisKey maps to actual quiz:subject:{redisKey} list in Redis
const DEFAULT_SUBJECTS: Record<string, QuizSubject[]> = {

  // ── TNPSC (Group 1 / 2 / 2A / 4 / VAO — 2024 Syllabus) ──────────────────
  tnpsc: [
    { id: 'aptitude',      name: 'Aptitude & Mental Ability', icon: 'calculator',    redisKey: 'maths'      },
    { id: 'tamil',         name: 'Tamil Language & Literature', icon: 'book',         redisKey: 'tamil'      },
    { id: 'history',       name: 'History & Culture',          icon: 'monument',      redisKey: 'history'    },
    { id: 'geography',     name: 'Geography',                  icon: 'globe-asia',    redisKey: 'geography'  },
    { id: 'polity',        name: 'Indian Polity',              icon: 'balance-scale', redisKey: 'polity'     },
    { id: 'economy',       name: 'Economy & Development',      icon: 'chart-line',    redisKey: 'economics'  },
    { id: 'science',       name: 'General Science',            icon: 'flask',         redisKey: 'science'    },
    { id: 'current',       name: 'Current Affairs',            icon: 'newspaper',     redisKey: 'current_affairs' },
  ],

  // ── UPSC (Prelims GS + CSAT — 2024 Syllabus) ─────────────────────────────
  upsc: [
    { id: 'history',       name: 'History & Art & Culture',   icon: 'history',       redisKey: 'history'    },
    { id: 'geography',     name: 'Geography (India & World)', icon: 'globe-asia',    redisKey: 'geography'  },
    { id: 'polity',        name: 'Polity & Governance',       icon: 'balance-scale', redisKey: 'polity'     },
    { id: 'economy',       name: 'Economy & Agriculture',     icon: 'chart-line',    redisKey: 'economics'  },
    { id: 'science',       name: 'Science & Technology',      icon: 'flask',         redisKey: 'science'    },
    { id: 'environment',   name: 'Environment & Ecology',     icon: 'leaf',          redisKey: 'science'    },
    { id: 'csat-quant',    name: 'CSAT — Quantitative',       icon: 'calculator',    redisKey: 'maths'      },
    { id: 'csat-english',  name: 'CSAT — Comprehension',      icon: 'language',      redisKey: 'english'    },
  ],

  // ── SSC (CGL / CHSL / MTS / CPO / GD — 2024 Syllabus) ───────────────────
  ssc: [
    { id: 'quant',         name: 'Quantitative Aptitude',     icon: 'percentage',    redisKey: 'maths'      },
    { id: 'reasoning',     name: 'General Intelligence',      icon: 'brain',         redisKey: 'reasoning'  },
    { id: 'english',       name: 'English Language',          icon: 'language',      redisKey: 'english'    },
    { id: 'history',       name: 'General Awareness — History', icon: 'history',     redisKey: 'history'    },
    { id: 'geography',     name: 'General Awareness — Geography', icon: 'globe-asia',redisKey: 'geography'  },
    { id: 'polity',        name: 'General Awareness — Polity', icon: 'balance-scale',redisKey: 'polity'     },
    { id: 'science',       name: 'General Awareness — Science', icon: 'flask',       redisKey: 'science'    },
    { id: 'economy',       name: 'General Awareness — Economy', icon: 'chart-line',  redisKey: 'economics'  },
  ],

  // ── Banking (IBPS PO/Clerk · SBI PO/Clerk — 2024 Syllabus) ──────────────
  banking: [
    { id: 'quant',         name: 'Quantitative Aptitude',     icon: 'calculator',    redisKey: 'maths'      },
    { id: 'reasoning',     name: 'Reasoning Ability',         icon: 'brain',         redisKey: 'reasoning'  },
    { id: 'english',       name: 'English Language',          icon: 'language',      redisKey: 'english'    },
    { id: 'general-aware', name: 'General & Banking Awareness', icon: 'landmark',    redisKey: 'banking'    },
    { id: 'current-affairs', name: 'Current Affairs',         icon: 'newspaper',     redisKey: 'current_affairs' },
    { id: 'computer',      name: 'Computer & Technology',     icon: 'laptop',        redisKey: 'computer'   },
  ],

  // ── RRB (NTPC / Group D / ALP — 2024 Syllabus) ───────────────────────────
  rrb: [
    { id: 'maths',         name: 'Mathematics',               icon: 'calculator',    redisKey: 'maths'      },
    { id: 'reasoning',     name: 'General Intelligence',      icon: 'brain',         redisKey: 'reasoning'  },
    { id: 'science',       name: 'General Science',           icon: 'flask',         redisKey: 'science'    },
    { id: 'general-aware', name: 'General Awareness',         icon: 'newspaper',     redisKey: 'current_affairs' },
    { id: 'polity',        name: 'Polity & History',          icon: 'history',       redisKey: 'polity'     },
    { id: 'physics',       name: 'Physics',                   icon: 'atom',          redisKey: 'physics'    },
    { id: 'chemistry',     name: 'Chemistry',                 icon: 'flask',         redisKey: 'chemistry'  },
    { id: 'biology',       name: 'Biology',                   icon: 'dna',           redisKey: 'biology'    },
  ],

  // ── Samacheer Kalvi 6–12 (Class -> Subject Flow) ──────────────────────
  samacheer: [
    { id: 'class6',  name: 'Class 6',  icon: 'school', redisKey: 'samacheer' },
    { id: 'class7',  name: 'Class 7',  icon: 'school', redisKey: 'samacheer' },
    { id: 'class8',  name: 'Class 8',  icon: 'school', redisKey: 'samacheer' },
    { id: 'class9',  name: 'Class 9',  icon: 'school', redisKey: 'samacheer' },
    { id: 'class10', name: 'Class 10', icon: 'school', redisKey: 'samacheer' },
    { id: 'class11', name: 'Class 11', icon: 'school', redisKey: 'samacheer' },
    { id: 'class12', name: 'Class 12', icon: 'school', redisKey: 'samacheer' },
  ],

  // ── NCERT (Class -> Subject Flow) ──────────────────────────────────────
  ncert: [
    { id: 'class6',  name: 'Class 6',  icon: 'book-reader', redisKey: 'ncert' },
    { id: 'class7',  name: 'Class 7',  icon: 'book-reader', redisKey: 'ncert' },
    { id: 'class8',  name: 'Class 8',  icon: 'book-reader', redisKey: 'ncert' },
    { id: 'class9',  name: 'Class 9',  icon: 'book-reader', redisKey: 'ncert' },
    { id: 'class10', name: 'Class 10', icon: 'book-reader', redisKey: 'ncert' },
    { id: 'class11', name: 'Class 11', icon: 'book-reader', redisKey: 'ncert' },
    { id: 'class12', name: 'Class 12', icon: 'book-reader', redisKey: 'ncert' },
  ],

  // ── Defence (NDA / CDS / AFCAT) ──────────────────────────────────────────
  defence: [
    { id: 'gk',        name: 'General Knowledge', icon: 'globe',         redisKey: 'current_affairs' },
    { id: 'english',   name: 'English Ability',   icon: 'language',      redisKey: 'english' },
    { id: 'maths',     name: 'Mathematics',       icon: 'calculator',    redisKey: 'maths' },
  ],

  // ── Teaching (CTET / TET) ────────────────────────────────────────────────
  teaching: [
    { id: 'cdp',       name: 'Child Development', icon: 'child',         redisKey: 'child_development' },
    { id: 'evs',       name: 'Environmental Sci', icon: 'leaf',          redisKey: 'science' },
    { id: 'language',  name: 'Language Ability',  icon: 'language',      redisKey: 'english' },
  ],

  // ── Management (CAT / MAT) ───────────────────────────────────────────────
  management: [
    { id: 'varc',      name: 'Verbal Ability',    icon: 'book',          redisKey: 'english' },
    { id: 'quants',    name: 'Quant Ability',     icon: 'calculator',    redisKey: 'maths' },
    { id: 'dilr',      name: 'Logic & Data',      icon: 'th-large',      redisKey: 'general_intelligence' },
  ],
};

const DEFAULT_TOPICS: Record<string, QuizTopic[]> = {
  // NCERT Class Topics — difficulty + count scale with class level
  ...[6,7,8,9,10,11,12].reduce((acc, cls) => {
    const difficulty: 'easy' | 'medium' | 'hard' = cls <= 8 ? 'easy' : cls <= 10 ? 'medium' : 'hard';
    const count = cls <= 8 ? 30 : cls <= 10 ? 40 : 50;
    const base = [
      { id: 'maths',    name: 'Mathematics',     redisKey: 'maths',    difficulty, questionCount: count },
      { id: 'science',  name: 'Science',         redisKey: 'science',  difficulty, questionCount: count },
      { id: 'history',  name: 'History',         redisKey: 'history',  difficulty, questionCount: count },
      { id: 'geography',name: 'Geography',       redisKey: 'geography',difficulty, questionCount: count },
      { id: 'polity',   name: 'Civics & Polity', redisKey: 'polity',   difficulty, questionCount: count },
      { id: 'english',  name: 'English',         redisKey: 'english',  difficulty, questionCount: count },
    ];
    const mid = cls >= 9 ? [
      { id: 'economics',name: 'Economics',       redisKey: 'economics',difficulty, questionCount: count },
      { id: 'computer', name: 'Computer Science',redisKey: 'computer', difficulty, questionCount: count },
    ] : [];
    const senior = cls >= 11 ? [
      { id: 'physics',  name: 'Physics',         redisKey: 'physics',  difficulty, questionCount: count },
      { id: 'chemistry',name: 'Chemistry',       redisKey: 'chemistry',difficulty, questionCount: count },
      { id: 'biology',  name: 'Biology',         redisKey: 'biology',  difficulty, questionCount: count },
    ] : [];
    acc[`ncert:class${cls}`] = [...base, ...mid, ...senior];
    return acc;
  }, {} as Record<string, QuizTopic[]>),

  // Samacheer Class Topics — difficulty + count scale with class level
  ...[6,7,8,9,10,11,12].reduce((acc, cls) => {
    const difficulty: 'easy' | 'medium' | 'hard' = cls <= 8 ? 'easy' : cls <= 10 ? 'medium' : 'hard';
    const count = cls <= 8 ? 30 : cls <= 10 ? 40 : 50;
    const base = [
      { id: 'tamil',    name: 'Tamil',           redisKey: 'tamil',    difficulty, questionCount: count },
      { id: 'maths',    name: 'Mathematics',     redisKey: 'maths',    difficulty, questionCount: count },
      { id: 'science',  name: 'Science / EVS',   redisKey: 'science',  difficulty, questionCount: count },
      { id: 'history',  name: 'History',         redisKey: 'history',  difficulty, questionCount: count },
      { id: 'geography',name: 'Geography',       redisKey: 'geography',difficulty, questionCount: count },
      { id: 'polity',   name: 'Civics & Polity', redisKey: 'polity',   difficulty, questionCount: count },
      { id: 'english',  name: 'English',         redisKey: 'english',  difficulty, questionCount: count },
    ];
    const mid = cls >= 9 ? [
      { id: 'economics',name: 'Economics',       redisKey: 'economics',difficulty, questionCount: count },
      { id: 'computer', name: 'Computer Science',redisKey: 'computer', difficulty, questionCount: count },
    ] : [];
    const senior = cls >= 11 ? [
      { id: 'physics',  name: 'Physics',         redisKey: 'physics',  difficulty, questionCount: count },
      { id: 'chemistry',name: 'Chemistry',       redisKey: 'chemistry',difficulty, questionCount: count },
      { id: 'biology',  name: 'Biology',         redisKey: 'biology',  difficulty, questionCount: count },
    ] : [];
    acc[`samacheer:class${cls}`] = [...base, ...mid, ...senior];
    return acc;
  }, {} as Record<string, QuizTopic[]>),

  // ═══════════════════════════════════════════════════════════════════
  // TNPSC
  // ═══════════════════════════════════════════════════════════════════
  'tnpsc:aptitude': [
    { id: 'number-system',    name: 'Number System',           questionCount: 20 },
    { id: 'simplification',   name: 'Simplification & BODMAS', questionCount: 20 },
    { id: 'hcf-lcm',          name: 'HCF & LCM',              questionCount: 15 },
    { id: 'percentage',       name: 'Percentage',              questionCount: 18 },
    { id: 'ratio-proportion', name: 'Ratio & Proportion',      questionCount: 16 },
    { id: 'profit-loss',      name: 'Profit & Loss',           questionCount: 16 },
    { id: 'simple-interest',  name: 'Simple & Compound Interest', questionCount: 15 },
    { id: 'time-work',        name: 'Time & Work',             questionCount: 16 },
    { id: 'time-distance',    name: 'Time, Speed & Distance',  questionCount: 16 },
    { id: 'algebra',          name: 'Algebra',                 questionCount: 15 },
    { id: 'geometry',         name: 'Geometry & Mensuration',  questionCount: 18 },
    { id: 'data-interpretation', name: 'Data Interpretation',  questionCount: 15 },
    { id: 'logical-reasoning',name: 'Logical Reasoning',       questionCount: 20 },
    { id: 'series',           name: 'Number & Letter Series',  questionCount: 15 },
    { id: 'coding-decoding',  name: 'Coding & Decoding',       questionCount: 15 },
  ],

  'tnpsc:tamil': [
    { id: 'ezhuthu-ilakkanam',name: 'எழுத்து இலக்கணம் (Phonology)', questionCount: 20 },
    { id: 'sol-ilakkanam',    name: 'சொல் இலக்கணம் (Morphology)',   questionCount: 20 },
    { id: 'porul-ilakkanam',  name: 'பொருள் இலக்கணம (Semantics)',  questionCount: 15 },
    { id: 'tolkappiyam',      name: 'தொல்காப்பியம் (Tolkappiyam)',  questionCount: 15 },
    { id: 'sangam',           name: 'சங்க இலக்கியம் (Sangam Lit.)',  questionCount: 18 },
    { id: 'thirukkural',      name: 'திருக்குறள் (Thirukkural)',     questionCount: 20 },
    { id: 'epic-literature',  name: 'காப்பியங்கள் (Epics — Silappathikaram etc.)', questionCount: 15 },
    { id: 'post-sangam',      name: 'பதினென்கீழ்க்கணக்கு',          questionCount: 12 },
    { id: 'bhakti-literature',name: 'பக்தி இலக்கியம் (Bhakti Lit.)',questionCount: 12 },
    { id: 'modern-tamil',     name: 'நவீன தமிழ் இலக்கியம்',         questionCount: 15 },
    { id: 'proverbs',         name: 'பழமொழி & மரபுத்தொடர்',         questionCount: 12 },
    { id: 'translation',      name: 'மொழிபெயர்ப்பு & பொருள்',       questionCount: 10 },
  ],

  'tnpsc:history': [
    { id: 'indus-valley',     name: 'Indus Valley Civilisation',    questionCount: 15 },
    { id: 'vedic-age',        name: 'Vedic Age',                    questionCount: 12 },
    { id: 'jainism-buddhism', name: 'Jainism & Buddhism',          questionCount: 15 },
    { id: 'mauryan',          name: 'Mauryan Empire',               questionCount: 15 },
    { id: 'gupta-post-gupta', name: 'Gupta & Post-Gupta Period',   questionCount: 14 },
    { id: 'medieval-india',   name: 'Medieval India (Delhi Sultanate)', questionCount: 15 },
    { id: 'mughal',           name: 'Mughal Empire',                questionCount: 16 },
    { id: 'maratha',          name: 'Maratha & Sikh Kingdoms',      questionCount: 12 },
    { id: 'british-rule',     name: 'British Rule & Administration',questionCount: 18 },
    { id: 'freedom-struggle', name: 'Indian Freedom Struggle',      questionCount: 22 },
    { id: 'post-independence',name: 'Post-Independence India',      questionCount: 15 },
    { id: 'tamil-history',    name: 'Tamil History (Sangam–Medieval)',questionCount: 18 },
    { id: 'chola-pandya',     name: 'Chola, Pandya & Chera Dynasties', questionCount: 16 },
    { id: 'vijayanagara',     name: 'Vijayanagara & Nayak Period', questionCount: 12 },
    { id: 'art-culture',      name: 'Indian Art, Architecture & Culture', questionCount: 15 },
    { id: 'social-reform',    name: 'Social Reform Movements',      questionCount: 14 },
  ],

  'tnpsc:geography': [
    { id: 'earth-universe',   name: 'Earth & Universe',             questionCount: 12 },
    { id: 'india-physical',   name: 'India — Physical Features',   questionCount: 18 },
    { id: 'india-climate',    name: 'India — Climate & Monsoon',   questionCount: 16 },
    { id: 'india-rivers',     name: 'India — Rivers & Lakes',      questionCount: 16 },
    { id: 'india-soils',      name: 'India — Soils & Vegetation',  questionCount: 14 },
    { id: 'india-resources',  name: 'India — Natural Resources',   questionCount: 15 },
    { id: 'tn-geography',     name: 'Tamil Nadu Geography',         questionCount: 18 },
    { id: 'tn-districts',     name: 'TN Districts & Administration',questionCount: 16 },
    { id: 'world-geography',  name: 'World Geography — Continents',questionCount: 15 },
    { id: 'world-oceans',     name: 'Oceans, Seas & Straits',      questionCount: 12 },
    { id: 'transport-trade',  name: 'Transport, Trade & Tourism',  questionCount: 12 },
  ],

  'tnpsc:polity': [
    { id: 'constitution-making', name: 'Making of Indian Constitution', questionCount: 12 },
    { id: 'preamble',         name: 'Preamble & Key Features',     questionCount: 14 },
    { id: 'fundamental-rights', name: 'Fundamental Rights & Duties', questionCount: 20 },
    { id: 'dpsp',             name: 'DPSP & Amendments',           questionCount: 15 },
    { id: 'parliament',       name: 'Parliament & Central Legislature', questionCount: 18 },
    { id: 'president-pm',     name: 'President, PM & Council of Ministers', questionCount: 16 },
    { id: 'judiciary',        name: 'Supreme Court & Judiciary',   questionCount: 16 },
    { id: 'state-govt',       name: 'State Government & Legislature', questionCount: 15 },
    { id: 'local-bodies',     name: 'Local Bodies (Panchayat & Municipality)', questionCount: 15 },
    { id: 'elections',        name: 'Elections & Electoral System',questionCount: 14 },
    { id: 'governance',       name: 'Governance, RTI & Public Policy', questionCount: 12 },
    { id: 'tn-polity',        name: 'Tamil Nadu Government & Admin',questionCount: 14 },
  ],

  'tnpsc:economy': [
    { id: 'national-income',  name: 'National Income & GDP',       questionCount: 16 },
    { id: 'planning',         name: 'Planning & Five-Year Plans',  questionCount: 15 },
    { id: 'agriculture',      name: 'Agriculture & Green Revolution', questionCount: 16 },
    { id: 'industry',         name: 'Industries & Industrial Policy', questionCount: 14 },
    { id: 'banking-finance',  name: 'Banking & Financial System',  questionCount: 16 },
    { id: 'budget-taxation',  name: 'Budget, Taxation & GST',      questionCount: 15 },
    { id: 'international-trade', name: 'International Trade & WTO',questionCount: 12 },
    { id: 'poverty-welfare',  name: 'Poverty, Employment & Welfare Schemes', questionCount: 16 },
    { id: 'tn-economy',       name: 'Tamil Nadu Economy',          questionCount: 16 },
    { id: 'current-schemes',  name: 'Government Schemes & Programs',questionCount: 18 },
  ],

  'tnpsc:science': [
    { id: 'physics-motion',   name: 'Physics — Motion & Force',    questionCount: 16 },
    { id: 'physics-electricity', name: 'Physics — Electricity & Magnetism', questionCount: 16 },
    { id: 'physics-optics',   name: 'Physics — Light & Sound',     questionCount: 14 },
    { id: 'chemistry-matter', name: 'Chemistry — Matter & Atoms',  questionCount: 15 },
    { id: 'chemistry-reactions', name: 'Chemistry — Chemical Reactions', questionCount: 15 },
    { id: 'chemistry-acids',  name: 'Chemistry — Acids, Bases & Salts', questionCount: 14 },
    { id: 'biology-cells',    name: 'Biology — Cell & Life Processes', questionCount: 16 },
    { id: 'biology-human',    name: 'Biology — Human Physiology',  questionCount: 16 },
    { id: 'biology-plants',   name: 'Biology — Plant Science',     questionCount: 14 },
    { id: 'environment',      name: 'Environment & Ecology',       questionCount: 16 },
    { id: 'computer-basics',  name: 'Computer Science Basics',     questionCount: 14 },
    { id: 'science-tech',     name: 'Science in Everyday Life & Inventions', questionCount: 15 },
  ],

  'tnpsc:current': [
    { id: 'national-events',  name: 'National Current Affairs',    questionCount: 20 },
    { id: 'tn-events',        name: 'Tamil Nadu Current Affairs',  questionCount: 18 },
    { id: 'international',    name: 'International Affairs',       questionCount: 15 },
    { id: 'awards-honours',   name: 'Awards, Prizes & Honours',    questionCount: 15 },
    { id: 'sports',           name: 'Sports & Games',              questionCount: 14 },
    { id: 'science-tech-news',name: 'Science, Tech & Space News',  questionCount: 14 },
    { id: 'govt-schemes',     name: 'New Government Schemes',      questionCount: 15 },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // UPSC
  // ═══════════════════════════════════════════════════════════════════
  'upsc:history': [
    { id: 'prehistoric',      name: 'Prehistoric & Indus Valley',  questionCount: 12 },
    { id: 'ancient-kingdoms', name: 'Ancient Kingdoms & Empires',  questionCount: 16 },
    { id: 'medieval-india',   name: 'Medieval India (Sultanate & Mughal)', questionCount: 18 },
    { id: 'british-conquest', name: 'British Conquest & Administration', questionCount: 16 },
    { id: '1857-revolt',      name: '1857 Revolt & Aftermath',     questionCount: 14 },
    { id: 'national-movement',name: 'National Freedom Movement',   questionCount: 20 },
    { id: 'gandhi-era',       name: 'Gandhi & Mass Movements',     questionCount: 16 },
    { id: 'post-1947',        name: 'Post-Independence Consolidation', questionCount: 14 },
    { id: 'art-culture',      name: 'Indian Art, Architecture & Music', questionCount: 16 },
    { id: 'world-history',    name: 'World History (Revolutions, Wars)', questionCount: 15 },
  ],

  'upsc:geography': [
    { id: 'physical-world',   name: 'World Physical Geography',    questionCount: 16 },
    { id: 'physical-india',   name: 'India Physical Geography',    questionCount: 18 },
    { id: 'climate',          name: 'Climate, Monsoon & El Niño', questionCount: 16 },
    { id: 'rivers-drainage',  name: 'Rivers, Drainage & Water Bodies', questionCount: 16 },
    { id: 'natural-resources',name: 'Natural Resources & Mining',  questionCount: 14 },
    { id: 'agriculture-geo',  name: 'Agriculture & Cropping Patterns', questionCount: 14 },
    { id: 'transport-infra',  name: 'Transport & Infrastructure',  questionCount: 12 },
    { id: 'population',       name: 'Population & Urbanisation',   questionCount: 14 },
    { id: 'environment-eco',  name: 'Environment & Ecosystems',    questionCount: 16 },
    { id: 'map-based',        name: 'Map-Based & Locational Facts',questionCount: 15 },
  ],

  'upsc:polity': [
    { id: 'constitution-features', name: 'Constitution — Features & Sources', questionCount: 14 },
    { id: 'fundamental-rights',    name: 'Fundamental Rights & FDs', questionCount: 18 },
    { id: 'dpsp',                  name: 'DPSP & Constitutional Amendments', questionCount: 15 },
    { id: 'parliament',            name: 'Parliament — Lok Sabha & Rajya Sabha', questionCount: 18 },
    { id: 'executive',             name: 'Executive — President, PM & Cabinet', questionCount: 16 },
    { id: 'judiciary',             name: 'Supreme Court & Judicial Review', questionCount: 16 },
    { id: 'federalism',            name: 'Federalism & Centre-State Relations', questionCount: 14 },
    { id: 'local-govt',            name: 'Local Government (73rd & 74th Amendments)', questionCount: 14 },
    { id: 'constitutional-bodies', name: 'Constitutional Bodies (EC, CAG, etc.)', questionCount: 16 },
    { id: 'int-relations',         name: 'International Relations & Organisations', questionCount: 15 },
  ],

  'upsc:economy': [
    { id: 'national-income',  name: 'National Income, GDP & Growth', questionCount: 16 },
    { id: 'money-banking',    name: 'Money, Banking & RBI Policy',  questionCount: 16 },
    { id: 'budget-fiscal',    name: 'Union Budget & Fiscal Policy', questionCount: 15 },
    { id: 'inflation',        name: 'Inflation & Monetary Policy',  questionCount: 14 },
    { id: 'agriculture-eco',  name: 'Agriculture & Rural Economy',  questionCount: 15 },
    { id: 'industry-msme',    name: 'Industry, MSME & Make in India', questionCount: 14 },
    { id: 'trade-balance',    name: 'Foreign Trade & Balance of Payments', questionCount: 14 },
    { id: 'poverty-inclusion',name: 'Poverty, Inequality & Inclusion', questionCount: 15 },
    { id: 'economic-reforms', name: 'Economic Reforms (1991 & Beyond)', questionCount: 14 },
  ],

  'upsc:science': [
    { id: 'physics',          name: 'Physics — Key Concepts',      questionCount: 15 },
    { id: 'chemistry',        name: 'Chemistry — Elements & Reactions', questionCount: 14 },
    { id: 'biology',          name: 'Biology — Cell to Organism',  questionCount: 16 },
    { id: 'biotech',          name: 'Biotechnology & Genetics',    questionCount: 14 },
    { id: 'space-tech',       name: 'Space Science & ISRO',        questionCount: 15 },
    { id: 'defence-tech',     name: 'Defence Technology',          questionCount: 12 },
    { id: 'energy',           name: 'Energy — Renewable & Nuclear',questionCount: 14 },
    { id: 'disease-health',   name: 'Diseases & Public Health',    questionCount: 14 },
  ],

  'upsc:environment': [
    { id: 'ecology-basics',   name: 'Ecology & Ecosystems',        questionCount: 16 },
    { id: 'biodiversity',     name: 'Biodiversity & Conservation', questionCount: 16 },
    { id: 'climate-change',   name: 'Climate Change & Agreements', questionCount: 15 },
    { id: 'pollution',        name: 'Pollution & Waste Management',questionCount: 14 },
    { id: 'protected-areas',  name: 'National Parks & Sanctuaries',questionCount: 14 },
    { id: 'env-laws',         name: 'Environmental Laws & Conventions', questionCount: 13 },
  ],

  'upsc:csat-quant': [
    { id: 'number-system',    name: 'Number System & Simplification', questionCount: 18 },
    { id: 'percentage',       name: 'Percentage, Profit & Loss',    questionCount: 16 },
    { id: 'time-work',        name: 'Time, Work & Pipes',           questionCount: 15 },
    { id: 'speed-distance',   name: 'Speed, Distance & Trains',     questionCount: 15 },
    { id: 'data-sufficiency', name: 'Data Interpretation & Sufficiency', questionCount: 15 },
    { id: 'logical-reasoning',name: 'Analytical & Logical Reasoning', questionCount: 20 },
  ],

  'upsc:csat-english': [
    { id: 'comprehension',    name: 'Reading Comprehension',        questionCount: 20 },
    { id: 'logical-deduction',name: 'Logical Deduction & Critical Reasoning', questionCount: 18 },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // SSC
  // ═══════════════════════════════════════════════════════════════════
  'ssc:quant': [
    { id: 'number-system',    name: 'Number System',               questionCount: 18 },
    { id: 'percentage',       name: 'Percentage',                  questionCount: 16 },
    { id: 'profit-loss',      name: 'Profit & Loss',               questionCount: 16 },
    { id: 'ratio-proportion', name: 'Ratio, Proportion & Mixture', questionCount: 15 },
    { id: 'si-ci',            name: 'Simple & Compound Interest',  questionCount: 15 },
    { id: 'time-work',        name: 'Time & Work',                 questionCount: 15 },
    { id: 'speed-distance',   name: 'Speed, Distance & Trains',    questionCount: 15 },
    { id: 'geometry',         name: 'Geometry & Mensuration',      questionCount: 18 },
    { id: 'trigonometry',     name: 'Trigonometry',                questionCount: 15 },
    { id: 'algebra',          name: 'Algebra',                     questionCount: 16 },
    { id: 'statistics',       name: 'Statistics & DI',             questionCount: 14 },
  ],

  'ssc:reasoning': [
    { id: 'analogy',          name: 'Analogy',                     questionCount: 16 },
    { id: 'series',           name: 'Series (Number & Letter)',     questionCount: 16 },
    { id: 'coding-decoding',  name: 'Coding & Decoding',           questionCount: 16 },
    { id: 'blood-relations',  name: 'Blood Relations',             questionCount: 14 },
    { id: 'direction-sense',  name: 'Direction & Distance',        questionCount: 14 },
    { id: 'syllogism',        name: 'Syllogism',                   questionCount: 15 },
    { id: 'matrix-puzzle',    name: 'Matrix & Puzzles',            questionCount: 14 },
    { id: 'venn-diagram',     name: 'Venn Diagrams',               questionCount: 12 },
    { id: 'non-verbal',       name: 'Non-Verbal Reasoning',        questionCount: 16 },
  ],

  'ssc:english': [
    { id: 'synonyms-antonyms',name: 'Synonyms & Antonyms',         questionCount: 20 },
    { id: 'vocabulary',       name: 'Vocabulary & Idioms',         questionCount: 18 },
    { id: 'grammar',          name: 'Grammar (Parts of Speech)',   questionCount: 18 },
    { id: 'sentence-correction', name: 'Sentence Correction',      questionCount: 18 },
    { id: 'fill-blanks',      name: 'Fill in the Blanks',          questionCount: 16 },
    { id: 'comprehension',    name: 'Reading Comprehension',       questionCount: 15 },
    { id: 'cloze-test',       name: 'Cloze Test',                  questionCount: 14 },
    { id: 'one-word',         name: 'One-Word Substitution',       questionCount: 16 },
  ],

  'ssc:history': [
    { id: 'ancient',          name: 'Ancient India',               questionCount: 16 },
    { id: 'medieval',         name: 'Medieval India',              questionCount: 16 },
    { id: 'modern',           name: 'Modern India & Freedom',      questionCount: 18 },
    { id: 'world',            name: 'World History',               questionCount: 14 },
  ],

  'ssc:geography': [
    { id: 'india-geo',        name: 'India Geography',             questionCount: 18 },
    { id: 'world-geo',        name: 'World Geography',             questionCount: 16 },
    { id: 'environment',      name: 'Environment & Ecology',       questionCount: 14 },
  ],

  'ssc:polity': [
    { id: 'constitution',     name: 'Constitution & Polity',       questionCount: 20 },
    { id: 'governance',       name: 'Governance & Public Policy',  questionCount: 15 },
    { id: 'current-gk',       name: 'Static GK',                  questionCount: 18 },
  ],

  'ssc:science': [
    { id: 'physics',          name: 'Physics',                     questionCount: 18 },
    { id: 'chemistry',        name: 'Chemistry',                   questionCount: 18 },
    { id: 'biology',          name: 'Biology',                     questionCount: 18 },
    { id: 'science-tech',     name: 'Science & Technology',        questionCount: 14 },
  ],

  'ssc:economy': [
    { id: 'economy',          name: 'Economy & Finance',           questionCount: 18 },
    { id: 'banking',          name: 'Banking & RBI',               questionCount: 14 },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // Banking
  // ═══════════════════════════════════════════════════════════════════
  'banking:quant': [
    { id: 'number-system',    name: 'Number System',               questionCount: 16 },
    { id: 'percentage',       name: 'Percentage & Profit-Loss',    questionCount: 16 },
    { id: 'si-ci',            name: 'Simple & Compound Interest',  questionCount: 16 },
    { id: 'time-work',        name: 'Time, Work & Pipes',          questionCount: 15 },
    { id: 'speed-distance',   name: 'Speed, Distance & Boats',     questionCount: 15 },
    { id: 'di',               name: 'Data Interpretation',         questionCount: 18 },
    { id: 'quadratic',        name: 'Quadratic Equations',         questionCount: 14 },
    { id: 'probability',      name: 'Probability & Permutations',  questionCount: 14 },
  ],

  'banking:reasoning': [
    { id: 'puzzles-seating',  name: 'Puzzles & Seating Arrangement', questionCount: 20 },
    { id: 'syllogism',        name: 'Syllogism',                   questionCount: 15 },
    { id: 'inequality',       name: 'Inequality',                  questionCount: 14 },
    { id: 'coding-decoding',  name: 'Coding & Decoding',           questionCount: 14 },
    { id: 'blood-direction',  name: 'Blood Relations & Direction', questionCount: 14 },
    { id: 'critical-reasoning', name: 'Critical Reasoning',        questionCount: 15 },
  ],

  'banking:english': [
    { id: 'reading-comp',     name: 'Reading Comprehension',       questionCount: 18 },
    { id: 'error-correction', name: 'Error Spotting & Correction', questionCount: 16 },
    { id: 'fill-blanks',      name: 'Fill in the Blanks',          questionCount: 16 },
    { id: 'para-jumbles',     name: 'Para Jumbles',                questionCount: 14 },
    { id: 'cloze-test',       name: 'Cloze Test',                  questionCount: 14 },
    { id: 'vocabulary',       name: 'Vocabulary & Idioms',         questionCount: 15 },
  ],

  'banking:general-aware': [
    { id: 'banking-basics',   name: 'Banking Fundamentals & RBI', questionCount: 20 },
    { id: 'financial-market', name: 'Financial Markets & SEBI',   questionCount: 16 },
    { id: 'govt-schemes',     name: 'Government Banking Schemes',  questionCount: 16 },
    { id: 'current-affairs',  name: 'Current Affairs — Banking',  questionCount: 18 },
    { id: 'static-gk',       name: 'Static GK (Capitals, HQs)',   questionCount: 15 },
  ],

  'banking:polity': [
    { id: 'economy',          name: 'Indian Economy & Budget',     questionCount: 16 },
    { id: 'constitution',     name: 'Polity & Constitution',       questionCount: 14 },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // RRB
  // ═══════════════════════════════════════════════════════════════════
  'rrb:maths': [
    { id: 'number-system',    name: 'Number System',               questionCount: 16 },
    { id: 'arithmetic',       name: 'Arithmetic (%, Profit, SI/CI)', questionCount: 18 },
    { id: 'geometry',         name: 'Geometry & Mensuration',      questionCount: 16 },
    { id: 'time-work',        name: 'Time, Work & Speed',          questionCount: 15 },
    { id: 'algebra',          name: 'Algebra & Trigonometry',      questionCount: 15 },
    { id: 'statistics',       name: 'Statistics & DI',             questionCount: 14 },
  ],

  'rrb:reasoning': [
    { id: 'analogy',          name: 'Analogy & Classification',    questionCount: 15 },
    { id: 'series',           name: 'Number & Alphabet Series',    questionCount: 15 },
    { id: 'coding',           name: 'Coding & Decoding',           questionCount: 14 },
    { id: 'direction',        name: 'Direction & Distance',        questionCount: 14 },
    { id: 'non-verbal',       name: 'Non-Verbal Reasoning',        questionCount: 15 },
  ],

  'rrb:science': [
    { id: 'physics',          name: 'Physics',                     questionCount: 18 },
    { id: 'chemistry',        name: 'Chemistry',                   questionCount: 16 },
    { id: 'biology',          name: 'Biology & Health',            questionCount: 16 },
    { id: 'env-science',      name: 'Environmental Science',       questionCount: 14 },
  ],

  'rrb:general-aware': [
    { id: 'history',          name: 'History & Culture',           questionCount: 16 },
    { id: 'geography',        name: 'Geography',                   questionCount: 15 },
    { id: 'current-affairs',  name: 'Current Affairs',             questionCount: 18 },
    { id: 'sports-awards',    name: 'Sports, Awards & Schemes',    questionCount: 15 },
  ],

  'rrb:polity': [
    { id: 'polity',           name: 'Polity & Constitution',       questionCount: 16 },
    { id: 'economy',          name: 'Economy & Development',       questionCount: 14 },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // Samacheer Kalvi — Subject-based (new navigation structure)
  // ═══════════════════════════════════════════════════════════════════
  'samacheer:tamil': [
    { id: 'class6',  name: 'Tamil — Class 6',  redisKey: 'tamil', difficulty: 'easy',   questionCount: 30 },
    { id: 'class7',  name: 'Tamil — Class 7',  redisKey: 'tamil', difficulty: 'easy',   questionCount: 30 },
    { id: 'class8',  name: 'Tamil — Class 8',  redisKey: 'tamil', difficulty: 'easy',   questionCount: 30 },
    { id: 'class9',  name: 'Tamil — Class 9',  redisKey: 'tamil', difficulty: 'medium', questionCount: 40 },
    { id: 'class10', name: 'Tamil — Class 10', redisKey: 'tamil', difficulty: 'medium', questionCount: 40 },
    { id: 'class11', name: 'Tamil — Class 11', redisKey: 'tamil', difficulty: 'hard',   questionCount: 50 },
    { id: 'class12', name: 'Tamil — Class 12', redisKey: 'tamil', difficulty: 'hard',   questionCount: 50 },
  ],
  'samacheer:english': [
    { id: 'class6',  name: 'English — Class 6',  redisKey: 'english', difficulty: 'easy',   questionCount: 30 },
    { id: 'class7',  name: 'English — Class 7',  redisKey: 'english', difficulty: 'easy',   questionCount: 30 },
    { id: 'class8',  name: 'English — Class 8',  redisKey: 'english', difficulty: 'easy',   questionCount: 30 },
    { id: 'class9',  name: 'English — Class 9',  redisKey: 'english', difficulty: 'medium', questionCount: 40 },
    { id: 'class10', name: 'English — Class 10', redisKey: 'english', difficulty: 'medium', questionCount: 40 },
    { id: 'class11', name: 'English — Class 11', redisKey: 'english', difficulty: 'hard',   questionCount: 50 },
    { id: 'class12', name: 'English — Class 12', redisKey: 'english', difficulty: 'hard',   questionCount: 50 },
  ],
  'samacheer:maths': [
    { id: 'class6',  name: 'Mathematics — Class 6',  redisKey: 'maths', difficulty: 'easy',   questionCount: 30 },
    { id: 'class7',  name: 'Mathematics — Class 7',  redisKey: 'maths', difficulty: 'easy',   questionCount: 30 },
    { id: 'class8',  name: 'Mathematics — Class 8',  redisKey: 'maths', difficulty: 'easy',   questionCount: 30 },
    { id: 'class9',  name: 'Mathematics — Class 9',  redisKey: 'maths', difficulty: 'medium', questionCount: 40 },
    { id: 'class10', name: 'Mathematics — Class 10', redisKey: 'maths', difficulty: 'medium', questionCount: 40 },
    { id: 'class11', name: 'Mathematics — Class 11', redisKey: 'maths', difficulty: 'hard',   questionCount: 50 },
    { id: 'class12', name: 'Mathematics — Class 12', redisKey: 'maths', difficulty: 'hard',   questionCount: 50 },
  ],
  'samacheer:science': [
    { id: 'class6',  name: 'Science — Class 6',  redisKey: 'science', difficulty: 'easy',   questionCount: 30 },
    { id: 'class7',  name: 'Science — Class 7',  redisKey: 'science', difficulty: 'easy',   questionCount: 30 },
    { id: 'class8',  name: 'Science — Class 8',  redisKey: 'science', difficulty: 'easy',   questionCount: 30 },
    { id: 'class9',  name: 'Science — Class 9',  redisKey: 'science', difficulty: 'medium', questionCount: 40 },
    { id: 'class10', name: 'Science — Class 10', redisKey: 'science', difficulty: 'medium', questionCount: 40 },
  ],
  'samacheer:physics': [
    { id: 'class11', name: 'Physics — Class 11', redisKey: 'physics', difficulty: 'hard', questionCount: 50 },
    { id: 'class12', name: 'Physics — Class 12', redisKey: 'physics', difficulty: 'hard', questionCount: 50 },
  ],
  'samacheer:chemistry': [
    { id: 'class11', name: 'Chemistry — Class 11', redisKey: 'chemistry', difficulty: 'hard', questionCount: 50 },
    { id: 'class12', name: 'Chemistry — Class 12', redisKey: 'chemistry', difficulty: 'hard', questionCount: 50 },
  ],
  'samacheer:biology': [
    { id: 'class11', name: 'Biology — Class 11', redisKey: 'biology', difficulty: 'hard', questionCount: 50 },
    { id: 'class12', name: 'Biology — Class 12', redisKey: 'biology', difficulty: 'hard', questionCount: 50 },
  ],
  'samacheer:history': [
    { id: 'class6',  name: 'History & Civics — Class 6',  redisKey: 'history', difficulty: 'easy',   questionCount: 30 },
    { id: 'class7',  name: 'History & Civics — Class 7',  redisKey: 'history', difficulty: 'easy',   questionCount: 30 },
    { id: 'class8',  name: 'History & Civics — Class 8',  redisKey: 'history', difficulty: 'easy',   questionCount: 30 },
    { id: 'class9',  name: 'History & Civics — Class 9',  redisKey: 'history', difficulty: 'medium', questionCount: 40 },
    { id: 'class10', name: 'History & Civics — Class 10', redisKey: 'history', difficulty: 'medium', questionCount: 40 },
    { id: 'class11', name: 'History — Class 11',          redisKey: 'history', difficulty: 'hard',   questionCount: 50 },
    { id: 'class12', name: 'History — Class 12',          redisKey: 'history', difficulty: 'hard',   questionCount: 50 },
  ],
  'samacheer:geography': [
    { id: 'class6',  name: 'Geography — Class 6',  redisKey: 'geography', difficulty: 'easy',   questionCount: 30 },
    { id: 'class7',  name: 'Geography — Class 7',  redisKey: 'geography', difficulty: 'easy',   questionCount: 30 },
    { id: 'class8',  name: 'Geography — Class 8',  redisKey: 'geography', difficulty: 'easy',   questionCount: 30 },
    { id: 'class9',  name: 'Geography — Class 9',  redisKey: 'geography', difficulty: 'medium', questionCount: 40 },
    { id: 'class10', name: 'Geography — Class 10', redisKey: 'geography', difficulty: 'medium', questionCount: 40 },
    { id: 'class11', name: 'Geography — Class 11', redisKey: 'geography', difficulty: 'hard',   questionCount: 50 },
    { id: 'class12', name: 'Geography — Class 12', redisKey: 'geography', difficulty: 'hard',   questionCount: 50 },
  ],
  'samacheer:polity': [
    { id: 'class6',  name: 'Civics — Class 6',             redisKey: 'polity', difficulty: 'easy',   questionCount: 30 },
    { id: 'class7',  name: 'Civics — Class 7',             redisKey: 'polity', difficulty: 'easy',   questionCount: 30 },
    { id: 'class8',  name: 'Civics — Class 8',             redisKey: 'polity', difficulty: 'easy',   questionCount: 30 },
    { id: 'class9',  name: 'Civics — Class 9',             redisKey: 'polity', difficulty: 'medium', questionCount: 40 },
    { id: 'class10', name: 'Civics — Class 10',            redisKey: 'polity', difficulty: 'medium', questionCount: 40 },
    { id: 'class11', name: 'Political Science — Class 11', redisKey: 'polity', difficulty: 'hard',   questionCount: 50 },
    { id: 'class12', name: 'Political Science — Class 12', redisKey: 'polity', difficulty: 'hard',   questionCount: 50 },
  ],
  'samacheer:economics': [
    { id: 'class11', name: 'Economics — Class 11', redisKey: 'economics', difficulty: 'hard', questionCount: 50 },
    { id: 'class12', name: 'Economics — Class 12', redisKey: 'economics', difficulty: 'hard', questionCount: 50 },
  ],
  'samacheer:computer': [
    { id: 'class6',  name: 'Computer Science — Class 6',  redisKey: 'computer', difficulty: 'easy',   questionCount: 30 },
    { id: 'class7',  name: 'Computer Science — Class 7',  redisKey: 'computer', difficulty: 'easy',   questionCount: 30 },
    { id: 'class8',  name: 'Computer Science — Class 8',  redisKey: 'computer', difficulty: 'easy',   questionCount: 30 },
    { id: 'class9',  name: 'Computer Science — Class 9',  redisKey: 'computer', difficulty: 'medium', questionCount: 40 },
    { id: 'class10', name: 'Computer Science — Class 10', redisKey: 'computer', difficulty: 'medium', questionCount: 40 },
    { id: 'class11', name: 'Computer Science — Class 11', redisKey: 'computer', difficulty: 'hard',   questionCount: 50 },
    { id: 'class12', name: 'Computer Science — Class 12', redisKey: 'computer', difficulty: 'hard',   questionCount: 50 },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // Samacheer Kalvi — Class-based (legacy, kept for safety)
  // ═══════════════════════════════════════════════════════════════════
  'samacheer:class6': [
    { id: 'tamil',   name: 'Tamil (6th)',          redisKey: 'tamil',     questionCount: 20 },
    { id: 'english', name: 'English (6th)',        redisKey: 'english',   questionCount: 20 },
    { id: 'maths',   name: 'Mathematics (6th)',    redisKey: 'maths',     questionCount: 20 },
    { id: 'science', name: 'Science (6th)',        redisKey: 'science',   questionCount: 20 },
    { id: 'social',  name: 'Social Science (6th)', redisKey: 'history',   questionCount: 20 },
  ],
  'samacheer:class7': [
    { id: 'tamil',   name: 'Tamil (7th)',          redisKey: 'tamil',     questionCount: 20 },
    { id: 'english', name: 'English (7th)',        redisKey: 'english',   questionCount: 20 },
    { id: 'maths',   name: 'Mathematics (7th)',    redisKey: 'maths',     questionCount: 20 },
    { id: 'science', name: 'Science (7th)',        redisKey: 'science',   questionCount: 20 },
    { id: 'social',  name: 'Social Science (7th)', redisKey: 'history',   questionCount: 20 },
  ],
  'samacheer:class8': [
    { id: 'tamil',   name: 'Tamil (8th)',          redisKey: 'tamil',     questionCount: 20 },
    { id: 'english', name: 'English (8th)',        redisKey: 'english',   questionCount: 20 },
    { id: 'maths',   name: 'Mathematics (8th)',    redisKey: 'maths',     questionCount: 20 },
    { id: 'science', name: 'Science (8th)',        redisKey: 'science',   questionCount: 20 },
    { id: 'social',  name: 'Social Science (8th)', redisKey: 'history',   questionCount: 20 },
  ],
  'samacheer:class9': [
    { id: 'tamil',   name: 'Tamil (9th)',          redisKey: 'tamil',     questionCount: 20 },
    { id: 'english', name: 'English (9th)',        redisKey: 'english',   questionCount: 20 },
    { id: 'maths',   name: 'Mathematics (9th)',    redisKey: 'maths',     questionCount: 25 },
    { id: 'science', name: 'Science (9th)',        redisKey: 'science',   questionCount: 25 },
    { id: 'social',  name: 'Social Science (9th)', redisKey: 'history',   questionCount: 20 },
  ],
  'samacheer:class10': [
    { id: 'tamil',   name: 'Tamil (10th)',         redisKey: 'tamil',     questionCount: 20 },
    { id: 'english', name: 'English (10th)',       redisKey: 'english',   questionCount: 20 },
    { id: 'maths',   name: 'Mathematics (10th)',   redisKey: 'maths',     questionCount: 25 },
    { id: 'science', name: 'Science (10th)',       redisKey: 'science',   questionCount: 25 },
    { id: 'social',  name: 'Social Science (10th)',redisKey: 'history',   questionCount: 25 },
  ],
  'samacheer:class11': [
    { id: 'tamil',    name: 'Tamil (11th)',            redisKey: 'tamil',      questionCount: 20 },
    { id: 'english',  name: 'English (11th)',          redisKey: 'english',    questionCount: 20 },
    { id: 'maths',    name: 'Mathematics (11th)',      redisKey: 'maths',      questionCount: 25 },
    { id: 'physics',  name: 'Physics (11th)',          redisKey: 'physics',    questionCount: 25 },
    { id: 'chemistry',name: 'Chemistry (11th)',        redisKey: 'chemistry',  questionCount: 25 },
    { id: 'biology',  name: 'Biology (11th)',          redisKey: 'biology',    questionCount: 25 },
    { id: 'cs',       name: 'Computer Science (11th)', redisKey: 'computer',  questionCount: 20 },
    { id: 'commerce', name: 'Commerce (11th)',         redisKey: 'economics',  questionCount: 20 },
    { id: 'history',  name: 'History (11th)',          redisKey: 'history',    questionCount: 20 },
    { id: 'geography',name: 'Geography (11th)',        redisKey: 'geography',  questionCount: 20 },
    { id: 'polity',   name: 'Political Science (11th)',redisKey: 'polity',     questionCount: 18 },
  ],
  'samacheer:class12': [
    { id: 'tamil',    name: 'Tamil (12th)',            redisKey: 'tamil',      questionCount: 20 },
    { id: 'english',  name: 'English (12th)',          redisKey: 'english',    questionCount: 20 },
    { id: 'maths',    name: 'Mathematics (12th)',      redisKey: 'maths',      questionCount: 25 },
    { id: 'physics',  name: 'Physics (12th)',          redisKey: 'physics',    questionCount: 25 },
    { id: 'chemistry',name: 'Chemistry (12th)',        redisKey: 'chemistry',  questionCount: 25 },
    { id: 'biology',  name: 'Biology (12th)',          redisKey: 'biology',    questionCount: 25 },
    { id: 'cs',       name: 'Computer Science (12th)', redisKey: 'computer',  questionCount: 20 },
    { id: 'commerce', name: 'Commerce & Accountancy (12th)', redisKey: 'economics', questionCount: 20 },
    { id: 'economics',name: 'Economics (12th)',        redisKey: 'economics',  questionCount: 20 },
    { id: 'history',  name: 'History (12th)',          redisKey: 'history',    questionCount: 20 },
    { id: 'geography',name: 'Geography (12th)',        redisKey: 'geography',  questionCount: 20 },
    { id: 'polity',   name: 'Political Science (12th)',redisKey: 'polity',     questionCount: 18 },
  ],
};

const TTL_NAV = 3600;

// ── Question normaliser ────────────────────────────────────────────────────
function normaliseQuestion(raw: any): RedisQuestion | null {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const question = parsed.question_text || parsed.question;
    const answer_index =
      parsed.correct_answer !== undefined ? parsed.correct_answer : parsed.answer_index;
    if (!question || !Array.isArray(parsed.options) || typeof answer_index !== 'number') return null;
    return {
      id: parsed.id,
      question,
      options: parsed.options,
      answer_index,
      explanation: parsed.explanation || '',
      difficulty: parsed.difficulty,
    };
  } catch {
    return null;
  }
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── Public API ────────────────────────────────────────────────────────────
export const RedisService = {
  async ping(): Promise<boolean> {
    const r = await redisCmd<string>('PING');
    return r === 'PONG';
  },

  /** Fetch questions from quiz:subject:{redisKey} list, shuffle, return up to `count`.
   *  If `difficulty` is supplied, prefer questions matching that level (falls back to full
   *  pool when not enough filtered questions exist). */
  async getQuestions(redisKey: string, count = 15, difficulty?: string): Promise<RedisQuestion[]> {
    const raw = await redisCmd<string[]>('LRANGE', `quiz:subject:${redisKey}`, 0, -1);
    if (!raw || raw.length === 0) return [];
    const all = raw.map(normaliseQuestion).filter(Boolean) as RedisQuestion[];
    let pool = all;
    if (difficulty) {
      const filtered = all.filter(q => q.difficulty === difficulty);
      if (filtered.length >= Math.min(count, 15)) pool = filtered;
    }
    return shuffle(pool).slice(0, count);
  },

  // Navigation data is bundled — return from defaults directly, no Redis roundtrip needed.
  async getExams(): Promise<QuizExam[]> {
    return DEFAULT_EXAMS;
  },

  async getSubjects(examId: string): Promise<QuizSubject[]> {
    return DEFAULT_SUBJECTS[examId] || [];
  },

  async getTopics(examId: string, subjectId: string): Promise<QuizTopic[]> {
    return DEFAULT_TOPICS[`${examId}:${subjectId}`] || [];
  },

  async getDailyCurrentAffairs(dateStr: string): Promise<RedisQuestion[] | null> {
    const raw = await redisCmd<string>('GET', `daily:current_affairs:${dateStr}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as RedisQuestion[];
    } catch {
      return null;
    }
  },

  async setDailyCurrentAffairs(dateStr: string, questions: RedisQuestion[]): Promise<void> {
    const str = JSON.stringify(questions);
    // Expire in 2 days (172800 seconds) to be safe across timezones
    await redisCmdPost(['SET', `daily:current_affairs:${dateStr}`, str, 'EX', '172800']);
  }
};

export default RedisService;

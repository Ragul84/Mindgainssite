const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const REDIS_URL = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const TRACKS = ['upsc_ecosystem', 'tnpsc_ecosystem', 'ssc_ecosystem'];
const TARGETS = {
  upsc_ecosystem: 12,
  tnpsc_ecosystem: 12,
  ssc_ecosystem: 25,
};

const SUBJECTS = [
  'polity',
  'geography',
  'science',
  'history',
  'physics',
  'chemistry',
  'biology',
  'maths',
  'economics',
  'english',
  'reasoning',
  'current_affairs',
  'banking',
  'tamil',
  'computer',
];

const EXAM_FILTER = {
  upsc_ecosystem: 'upsc',
  tnpsc_ecosystem: 'tnpsc',
  ssc_ecosystem: 'ssc',
};

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase URL or service role key.');
}

if (!REDIS_URL || !REDIS_TOKEN) {
  throw new Error('Missing Upstash Redis URL or token.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function parsePayload(raw) {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return raw;
}

function hashString(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function normalizeQuestion(q, subject) {
  const question = q.question || q.question_text || q.prompt;
  const options = q.options || q.choices;
  const answerIndex = Number.isInteger(q.answer_index)
    ? q.answer_index
    : Number.isInteger(q.correct_answer)
      ? q.correct_answer
      : Number.isInteger(q.correctIndex)
        ? q.correctIndex
        : 0;

  if (!question || !Array.isArray(options) || options.length < 2) return null;

  return {
    question,
    options,
    answer_index: answerIndex >= 0 && answerIndex < options.length ? answerIndex : 0,
    explanation: q.explanation || q.rationale || `Review the core ${subject.replace('_', ' ')} concept behind this question.`,
    source: q.source || `MindGains ${subject.replace('_', ' ')} question bank`,
    difficulty: q.difficulty || 'medium',
    exam_types: q.exam_types || q.exams || [],
  };
}

async function redisLrange(key) {
  const url = `${REDIS_URL}/lrange/${encodeURIComponent(key)}/0/-1`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  if (!response.ok) {
    throw new Error(`Redis fetch failed for ${key}: ${response.status}`);
  }
  const json = await response.json();
  return Array.isArray(json.result) ? json.result : [];
}

async function loadBanks() {
  const banks = {};
  for (const subject of SUBJECTS) {
    const rawItems = await redisLrange(`quiz:subject:${subject}`);
    banks[subject] = rawItems
      .map((item) => {
        try {
          return typeof item === 'string' ? JSON.parse(item) : item;
        } catch {
          return null;
        }
      })
      .map((item) => item && normalizeQuestion(item, subject))
      .filter(Boolean);
    console.log(`${subject.padEnd(16)} ${String(banks[subject].length).padStart(4)} loaded`);
  }
  return banks;
}

function inferSubject(trackId, title, payload) {
  const text = `${title || ''} ${payload.topic_title || ''} ${(payload.curriculum_metadata?.ecosystem_tags || []).join(' ')}`.toLowerCase();
  const hasTamil = /[\u0B80-\u0BFF]/.test(text);

  if (hasTamil || text.includes('tamil') || text.includes('thirukkural') || text.includes('grammar')) return 'tamil';
  if (text.includes('constitution') || text.includes('article') || text.includes('rights') || text.includes('parliament') || text.includes('polity') || text.includes('governance')) return 'polity';
  if (text.includes('history') || text.includes('freedom') || text.includes('movement') || text.includes('sangam') || text.includes('medieval') || text.includes('ancient')) return 'history';
  if (text.includes('geography') || text.includes('climate') || text.includes('river') || text.includes('soil') || text.includes('monsoon') || text.includes('map')) return 'geography';
  if (text.includes('economy') || text.includes('budget') || text.includes('inflation') || text.includes('bank') || text.includes('finance') || text.includes('tax')) return 'economics';
  if (text.includes('physics') || text.includes('light') || text.includes('electric') || text.includes('force') || text.includes('motion')) return 'physics';
  if (text.includes('chemistry') || text.includes('acid') || text.includes('base') || text.includes('metal') || text.includes('compound')) return 'chemistry';
  if (text.includes('biology') || text.includes('plant') || text.includes('human') || text.includes('cell') || text.includes('disease')) return 'biology';
  if (text.includes('science') || text.includes('environment') || text.includes('ecology')) return 'science';
  if (text.includes('english') || text.includes('vocabulary') || text.includes('sentence') || text.includes('comprehension')) return 'english';
  if (text.includes('reasoning') || text.includes('series') || text.includes('analogy') || text.includes('coding') || text.includes('direction')) return 'reasoning';
  if (text.includes('current') || text.includes('affairs') || text.includes('scheme')) return 'current_affairs';
  if (text.includes('computer') || text.includes('digital')) return 'computer';
  if (text.includes('math') || text.includes('aptitude') || text.includes('percentage') || text.includes('profit') || text.includes('ratio') || text.includes('number') || text.includes('algebra') || text.includes('geometry')) return 'maths';

  if (trackId === 'ssc_ecosystem') return 'maths';
  if (trackId === 'tnpsc_ecosystem') return 'tamil';
  return 'polity';
}

function pickQuestions({ banks, subject, trackId, seed, needed, existingQuestions }) {
  const exam = EXAM_FILTER[trackId];
  const primary = banks[subject] || [];
  const fallbackSubjects = trackId === 'ssc_ecosystem'
    ? ['maths', 'reasoning', 'english', 'current_affairs', 'polity', 'science']
    : trackId === 'tnpsc_ecosystem'
      ? ['tamil', 'polity', 'history', 'geography', 'science', 'maths', 'current_affairs']
      : ['polity', 'history', 'geography', 'economics', 'science', 'current_affairs'];

  const pools = [
    primary.filter((q) => q.exam_types.length === 0 || q.exam_types.includes(exam)),
    primary,
    ...fallbackSubjects.map((s) => (banks[s] || []).filter((q) => q.exam_types.length === 0 || q.exam_types.includes(exam))),
    ...fallbackSubjects.map((s) => banks[s] || []),
  ];

  const seen = new Set(existingQuestions.map((q) => String(q.question || q.question_text || '').trim().toLowerCase()));
  const selected = [];

  for (const pool of pools) {
    if (selected.length >= needed) break;
    if (!pool.length) continue;
    const start = seed % pool.length;
    for (let i = 0; i < pool.length && selected.length < needed; i += 1) {
      const q = pool[(start + i) % pool.length];
      const key = q.question.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      selected.push({
        question: q.question,
        options: q.options,
        answer_index: q.answer_index,
        explanation: q.explanation,
        source: q.source,
      });
    }
  }

  return selected;
}

function ensureQuizTarget(row, banks) {
  const payload = parsePayload(row.content_json);
  const target = TARGETS[row.track_id] || 12;
  const existing = [
    ...(payload.quiz?.questions || []),
    ...(payload.pyq_quiz || []).map((q) => ({
      question: q.question,
      options: q.options,
      answer_index: q.answer_index,
      explanation: q.explanation,
      source: q.source,
    })),
  ]
    .map((q) => normalizeQuestion(q, 'mission'))
    .filter(Boolean);

  const seen = new Set();
  const deduped = existing.filter((q) => {
    const key = q.question.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (deduped.length >= target) {
    payload.quiz = { questions: deduped.slice(0, target) };
    return { payload, added: 0, subject: inferSubject(row.track_id, row.topic_title, payload), finalCount: target };
  }

  const subject = inferSubject(row.track_id, row.topic_title, payload);
  const seed = hashString(`${row.track_id}:${row.day_number}:${row.topic_title}:${subject}`);
  const selected = pickQuestions({
    banks,
    subject,
    trackId: row.track_id,
    seed,
    needed: target - deduped.length,
    existingQuestions: deduped,
  });

  payload.quiz = { questions: [...deduped, ...selected].slice(0, target) };
  payload.track = payload.track || row.track_id;
  payload.day_number = payload.day_number || row.day_number;
  payload.topic_title = payload.topic_title || row.topic_title;
  payload.curriculum_metadata = {
    ...(payload.curriculum_metadata || {}),
    daily_question_target: target,
    quiz_source: 'MindGains subject question bank',
    quiz_hydrated_at: new Date().toISOString(),
  };

  return { payload, added: selected.length, subject, finalCount: payload.quiz.questions.length };
}

async function loadMissionRows() {
  const { data, error } = await supabase
    .from('master_content_vault')
    .select('track_id, day_number, topic_title, content_json')
    .in('track_id', TRACKS)
    .order('track_id', { ascending: true })
    .order('day_number', { ascending: true });

  if (error) throw error;
  return data || [];
}

async function updateRow(row, payload) {
  const { error } = await supabase
    .from('master_content_vault')
    .update({
      content_json: payload,
      updated_at: new Date().toISOString(),
    })
    .eq('track_id', row.track_id)
    .eq('day_number', row.day_number);
  if (error) throw error;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const banks = await loadBanks();
  const rows = await loadMissionRows();
  const backupDir = path.resolve(__dirname, '../scratch');
  fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `daily-mission-before-quiz-fill-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(rows, null, 2));

  const report = {};
  let updated = 0;
  let totalAdded = 0;
  let belowTarget = 0;

  for (const row of rows) {
    const result = ensureQuizTarget(row, banks);
    const target = TARGETS[row.track_id] || 12;
    report[row.track_id] ||= { rows: 0, updated: 0, added: 0, min: Infinity, subjects: {} };
    report[row.track_id].rows += 1;
    report[row.track_id].min = Math.min(report[row.track_id].min, result.finalCount);
    report[row.track_id].subjects[result.subject] = (report[row.track_id].subjects[result.subject] || 0) + 1;

    if (result.finalCount < target) belowTarget += 1;
    if (result.added > 0 || result.finalCount !== (parsePayload(row.content_json).quiz?.questions || []).length) {
      updated += 1;
      totalAdded += result.added;
      report[row.track_id].updated += 1;
      report[row.track_id].added += result.added;
      if (!dryRun) {
        await updateRow(row, result.payload);
      }
    }
  }

  console.log(JSON.stringify({ dryRun, backupPath, updated, totalAdded, belowTarget, report }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

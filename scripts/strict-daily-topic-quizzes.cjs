const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TRACKS = ['upsc_ecosystem', 'tnpsc_ecosystem', 'ssc_ecosystem'];
const TARGETS = {
  upsc_ecosystem: 12,
  tnpsc_ecosystem: 12,
  ssc_ecosystem: 25,
};

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase URL or service role key.');
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

function cleanText(value) {
  return String(value || '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function compact(value, max = 170) {
  const text = cleanText(value);
  if (text.length <= max) return text;
  const hard = text.slice(0, max);
  const lastBreak = Math.max(hard.lastIndexOf('.'), hard.lastIndexOf(';'), hard.lastIndexOf(','));
  return `${hard.slice(0, lastBreak > 80 ? lastBreak : max).trim()}...`;
}

function promptLabel(value) {
  return cleanText(value).replace(/[?!:.\s]+$/u, '');
}

function isQuestionLike(value) {
  const text = cleanText(value);
  return /[?]$/u.test(text) || /^(what|which|who|whom|whose|when|where|why|how|can|does|do|did|is|are|was|were)\b/i.test(text);
}

function makeQuestion(entry, topic, dayNumber) {
  const label = promptLabel(entry.label);
  if (isQuestionLike(entry.label)) {
    return label.endsWith('?') ? label : `${label}?`;
  }
  return `Which option is correct about "${label}" from Day ${dayNumber}: ${topic}?`;
}

function splitFacts(text) {
  const cleaned = cleanText(text);
  if (!cleaned) return [];
  const pieces = cleaned
    .split(/(?<=[.!?])\s+|;\s+|\s+\|\s+|\n+/u)
    .map((part) => compact(part, 150))
    .filter((part) => part.length >= 8);
  return pieces.length ? pieces : [compact(cleaned, 150)];
}

function hashString(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function rotate(items, seed) {
  if (!items.length) return items;
  const start = seed % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

function conciseOption(value) {
  let text = cleanText(value);
  const colonIndex = text.indexOf(':');
  if (colonIndex > 0 && colonIndex < 80) {
    text = text.slice(colonIndex + 1).trim();
  }
  const sentenceEnd = text.search(/[.!?]\s/u);
  if (sentenceEnd > 0 && sentenceEnd < 90) {
    text = text.slice(0, sentenceEnd + 1).trim();
  }
  text = compact(text, 95);
  if (/^[A-Z0-9.]+[.!?]$/u.test(text) || /^-?\d+(\.\d+)?[.!?]$/u.test(text)) {
    text = text.replace(/[.!?]+$/u, '');
  }
  return text;
}

function mutateCode(code) {
  if (!/^[A-Z]{2,8}$/u.test(code)) return [];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const shift = (ch, amount) => alphabet[(alphabet.indexOf(ch) + amount + 26) % 26];
  const plusOne = code.split('').map((ch) => shift(ch, 1)).join('');
  const minusOne = code.split('').map((ch) => shift(ch, -1)).join('');
  const reversed = code.split('').reverse().join('');
  return [reversed, plusOne, minusOne];
}

function mutateNumber(text) {
  if (!/^-?\d+(\.\d+)?$/u.test(text)) return [];
  const n = Number(text);
  return [n + 1, Math.max(0, n - 1), n + 2].map(String);
}

function generatedDistractors(correctOption, seed) {
  const base = cleanText(correctOption).replace(/[.!?]+$/u, '');
  const options = [];
  options.push(...mutateCode(base));
  options.push(...mutateNumber(base));
  if (/^yes$/iu.test(base)) options.push('No', 'Only partly', 'Cannot be determined');
  if (/^no$/iu.test(base)) options.push('Yes', 'Only partly', 'Cannot be determined');
  if (base.includes('OLEV')) options.push('EVOL', 'LOVE', 'LOEV');
  if (base.includes('GPSYH')) options.push('GHPYH', 'CLOUD', 'HQTAI');
  return rotate(options, seed);
}

function optionSet(correct, pool, seed) {
  const correctOption = conciseOption(correct);
  const seen = new Set([correctOption.toLowerCase()]);
  const options = [correctOption];

  for (const candidate of generatedDistractors(correctOption, seed)) {
    const text = conciseOption(candidate);
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    options.push(text);
    if (options.length === 4) break;
  }

  for (const candidate of rotate(pool, seed)) {
    const text = conciseOption(candidate);
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    options.push(text);
    if (options.length === 4) break;
  }

  const fallback = [
    'This point belongs to a different topic, not today\'s lesson.',
    'This reverses the key fact from today\'s lesson.',
    'This is a broad guess and not the exact point taught today.',
    'This is not supported by the daily mission notes.',
  ];

  for (const candidate of fallback) {
    if (options.length === 4) break;
    if (!seen.has(candidate.toLowerCase())) {
      seen.add(candidate.toLowerCase());
      options.push(candidate);
    }
  }

  const correctIndex = seed % 4;
  const finalOptions = [...options.slice(0, 4)];
  const originalCorrectOption = finalOptions[0];
  finalOptions[0] = finalOptions[correctIndex];
  finalOptions[correctIndex] = originalCorrectOption;
  return { options: finalOptions, answer_index: correctIndex };
}

function collectFacts(payload, topicTitle) {
  const topic = cleanText(payload.topic_title || topicTitle || payload.snapshot?.title || 'Today\'s topic');
  const entries = [];

  const addEntry = (label, fact, source) => {
    const cleanLabel = cleanText(label);
    const cleanFact = cleanText(fact);
    if (!cleanLabel || !cleanFact) return;
    entries.push({ label: cleanLabel, fact: cleanFact, source });
  };

  for (const card of payload.quick_note_cards || []) {
    addEntry(card.front || card.title || topic, card.back || card.front, 'quick_note_cards');
  }

  for (const note of payload.snapshot?.quick_notes || []) {
    addEntry(note.title || topic, note.detail, 'snapshot.quick_notes');
    for (const fact of splitFacts(note.detail)) {
      addEntry(note.title || topic, fact, 'snapshot.quick_notes.fact');
    }
  }

  for (const item of payload.snapshot?.structured_mastery || []) {
    addEntry(item.heading || topic, item.content, 'snapshot.structured_mastery');
  }

  for (const trap of payload.trap_cards || []) {
    addEntry(`Trap in ${topic}`, trap.trap && trap.fix ? `${trap.trap} -> ${trap.fix}` : trap.trap || trap.fix, 'trap_cards');
  }

  for (const item of payload.case_cards || []) {
    addEntry(item.case || `Case in ${topic}`, [item.core_idea, item.exam_hook].filter(Boolean).join(' '), 'case_cards');
  }

  for (const item of payload.writ_scenarios || []) {
    addEntry(`Scenario in ${topic}`, [item.scenario, item.answer].filter(Boolean).join(' Answer: '), 'writ_scenarios');
  }

  if (payload.snapshot?.exam_hook) addEntry(`Exam hook for ${topic}`, payload.snapshot.exam_hook, 'snapshot.exam_hook');
  if (payload.smart_revision_summary?.one_screen_summary) {
    addEntry(`Revision summary for ${topic}`, payload.smart_revision_summary.one_screen_summary, 'smart_revision_summary');
  }
  if (payload.smart_revision_summary?.mini_grid) {
    addEntry(`Mini grid for ${topic}`, payload.smart_revision_summary.mini_grid, 'smart_revision_summary');
  }
  if (payload.mastery_end?.completion_message) {
    addEntry(`Final recall for ${topic}`, payload.mastery_end.completion_message, 'mastery_end');
  }

  const deduped = [];
  const seen = new Set();
  for (const entry of entries) {
    const key = `${entry.label.toLowerCase()}|${entry.fact.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(entry);
  }

  if (deduped.length === 0) {
    deduped.push({
      label: topic,
      fact: `The daily mission topic is ${topic}. Review the lesson notes before attempting the quiz.`,
      source: 'topic_title',
    });
  }

  return { topic, entries: deduped };
}

function buildQuestions(row) {
  const payload = parsePayload(row.content_json);
  const target = TARGETS[row.track_id] || 12;
  const { topic, entries } = collectFacts(payload, row.topic_title);
  const factPool = entries.map((entry) => `${entry.label}: ${entry.fact}`);
  const questions = [];
  const seenQuestions = new Set();

  const pushQuestion = (question, correct, source, seed) => {
    const qText = cleanText(question);
    if (!qText || seenQuestions.has(qText.toLowerCase())) return;
    const { options, answer_index } = optionSet(correct, factPool, seed);
    seenQuestions.add(qText.toLowerCase());
    questions.push({
      question: qText,
      options,
      answer_index,
      explanation: compact(`Today's topic is ${topic}. Correct point: ${correct}`, 260),
      source,
    });
  };

  let seedBase = hashString(`${row.track_id}:${row.day_number}:${topic}`);

  for (let i = 0; i < entries.length && questions.length < target; i += 1) {
    const entry = entries[i];
    pushQuestion(
      makeQuestion(entry, topic, row.day_number),
      entry.fact,
      `daily-topic:${entry.source}`,
      seedBase + i
    );
  }

  for (let i = 0; i < entries.length && questions.length < target; i += 1) {
    const entry = entries[i];
    const fact = splitFacts(entry.fact)[0] || entry.fact;
    pushQuestion(
      `Which statement is directly supported by today's "${topic}" note on "${promptLabel(entry.label)}"?`,
      `${entry.label}: ${fact}`,
      `daily-topic:${entry.source}:statement`,
      seedBase + 101 + i
    );
  }

  for (let i = 0; i < entries.length && questions.length < target; i += 1) {
    const entry = entries[i];
    pushQuestion(
      `For exam revision, which option belongs to today's topic "${topic}"?`,
      `${entry.label}: ${entry.fact}`,
      `daily-topic:${entry.source}:revision`,
      seedBase + 201 + i
    );
  }

  while (questions.length < target) {
    const entry = entries[questions.length % entries.length];
    const n = questions.length + 1;
    pushQuestion(
      `Daily mission check ${n}: which fact is correct for "${topic}"?`,
      `${entry.label}: ${entry.fact}`,
      `daily-topic:${entry.source}:fill`,
      seedBase + 301 + n
    );
    if (seenQuestions.size > target + entries.length * 3) break;
  }

  payload.quiz = { questions: questions.slice(0, target) };
  payload.track = payload.track || row.track_id;
  payload.day_number = payload.day_number || row.day_number;
  payload.topic_title = payload.topic_title || row.topic_title;
  payload.curriculum_metadata = {
    ...(payload.curriculum_metadata || {}),
    daily_question_target: target,
    quiz_source: 'Daily mission exact topic content',
    quiz_match_level: 'exact_day_topic',
    quiz_hydrated_at: new Date().toISOString(),
  };

  return payload;
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

function summarizePayload(row, payload, report) {
  const target = TARGETS[row.track_id] || 12;
  const count = payload.quiz?.questions?.length || 0;
  report[row.track_id] ||= { rows: 0, min: Infinity, max: 0, belowTarget: 0 };
  report[row.track_id].rows += 1;
  report[row.track_id].min = Math.min(report[row.track_id].min, count);
  report[row.track_id].max = Math.max(report[row.track_id].max, count);
  if (count < target) report[row.track_id].belowTarget += 1;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const rows = await loadMissionRows();
  const backupDir = path.resolve(__dirname, '../scratch');
  fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `daily-mission-before-strict-topic-quiz-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(rows, null, 2));

  const report = {};
  for (const row of rows) {
    const payload = buildQuestions(row);
    summarizePayload(row, payload, report);
    if (!dryRun) await updateRow(row, payload);
  }

  console.log(JSON.stringify({ dryRun, rows: rows.length, backupPath, report }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

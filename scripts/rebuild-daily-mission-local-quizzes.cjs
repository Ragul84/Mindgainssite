const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TRACKS = ['upsc_ecosystem', 'tnpsc_ecosystem', 'ssc_ecosystem'];
const TARGETS = {
  upsc_ecosystem: 12,
  tnpsc_ecosystem: 12,
  ssc_ecosystem: 25,
};

function clean(value) {
  return String(value || '')
    .replace(/\*\*/g, '')
    .replace(/…/g, '')
    .replace(/\.\.\./g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

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

function rotate(items, seed) {
  if (!items.length) return items;
  const start = seed % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

function firstSentence(text, max = 240) {
  const value = clean(text);
  if (value.length <= max) return value.replace(/[.]+$/u, '');
  const hard = value.slice(0, max);
  const stops = [hard.lastIndexOf('.'), hard.lastIndexOf(';'), hard.lastIndexOf(',')].filter((idx) => idx > 25);
  const stop = stops.length ? Math.max(...stops) : -1;
  return hard.slice(0, stop > 50 ? stop : max).trim().replace(/[.]+$/u, '');
}

function labelToStem(label) {
  return clean(label).replace(/[?!.:]+$/u, '');
}

function conciseAnswer(value) {
  return firstSentence(value, 240);
}

function splitFacts(text) {
  return clean(text)
    .split(/(?<=[.!?])\s+|;\s+|\s+\|\s+/u)
    .map((part) => firstSentence(part, 140))
    .filter((part) => part.length >= 6);
}

function collectEntries(payload, row) {
  const topic = clean(payload.topic_title || row.topic_title || payload.snapshot?.title);
  const entries = [];
  const add = (label, fact, source) => {
    const l = labelToStem(label || topic);
    const f = clean(fact);
    if (!l || !f) return;
    entries.push({ label: l, fact: f, source });
  };

  for (const card of payload.quick_note_cards || []) {
    add(card.front || card.title, card.back || card.front, 'quick_card');
  }
  for (const note of payload.snapshot?.quick_notes || []) {
    add(note.title || topic, note.detail, 'quick_note');
    for (const fact of splitFacts(note.detail)) add(note.title || topic, fact, 'quick_note_fact');
  }
  for (const item of payload.snapshot?.structured_mastery || []) {
    add(item.heading || topic, item.content, 'structured_mastery');
  }
  for (const trap of payload.trap_cards || []) {
    add(`Trap in ${topic}`, [trap.trap, trap.fix].filter(Boolean).join(' -> '), 'trap');
  }
  for (const item of payload.case_cards || []) {
    add(item.case || `Case in ${topic}`, [item.core_idea, item.exam_hook].filter(Boolean).join(' '), 'case');
  }
  if (payload.snapshot?.exam_hook) add(`Exam hook for ${topic}`, payload.snapshot.exam_hook, 'exam_hook');
  if (payload.smart_revision_summary?.one_screen_summary) add(`Revision summary for ${topic}`, payload.smart_revision_summary.one_screen_summary, 'summary');

  const seen = new Set();
  const deduped = entries.filter((entry) => {
    const key = `${entry.label.toLowerCase()}|${entry.fact.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { topic, entries: deduped.length ? deduped : [{ label: topic, fact: `Core facts of ${topic}`, source: 'topic' }] };
}

function numericDistractors(answer) {
  const m = clean(answer).match(/^-?\d+(\.\d+)?/u);
  if (!m) return [];
  const n = Number(m[0]);
  const suffix = clean(answer).slice(m[0].length);
  return [n + 1, Math.max(0, n - 1), n + 2].map((v) => `${v}${suffix}`);
}

function codeDistractors(answer) {
  const value = clean(answer).replace(/[.]+$/u, '');
  if (!/^[A-Z]{2,8}$/u.test(value)) return [];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const shift = (ch, by) => alphabet[(alphabet.indexOf(ch) + by + 26) % 26];
  return [
    value.split('').reverse().join(''),
    value.split('').map((ch) => shift(ch, 1)).join(''),
    value.split('').map((ch) => shift(ch, -1)).join(''),
  ];
}

function genericDistractors(answer, pool, seed) {
  const correct = clean(answer);
  const seen = new Set([correct.toLowerCase()]);
  const options = [correct];
  const generated = [...numericDistractors(correct), ...codeDistractors(correct)];
  for (const candidate of rotate(generated, seed)) {
    const text = clean(candidate);
    if (!text || seen.has(text.toLowerCase())) continue;
    seen.add(text.toLowerCase());
    options.push(text);
    if (options.length === 4) return options;
  }
  for (const candidate of rotate(pool, seed)) {
    const text = conciseAnswer(candidate);
    if (!text || seen.has(text.toLowerCase())) continue;
    seen.add(text.toLowerCase());
    options.push(text);
    if (options.length === 4) return options;
  }
  for (const fallback of ['Only the first statement is correct', 'Only the second statement is correct', 'Both statements are correct', 'Neither statement is correct']) {
    if (!seen.has(fallback.toLowerCase())) {
      seen.add(fallback.toLowerCase());
      options.push(fallback);
      if (options.length === 4) return options;
    }
  }
  return options.slice(0, 4);
}

function shuffleWithAnswer(options, seed) {
  const correct = options[0];
  const final = options.slice(0, 4);
  const idx = seed % 4;
  final[0] = final[idx];
  final[idx] = correct;
  return { options: final, answer_index: idx };
}

function makeDirectQuestion(trackId, row, topic, entry, pool, seed) {
  const label = labelToStem(entry.label);
  const answer = conciseAnswer(entry.fact);
  let question;
  if (/\?$/.test(clean(entry.label))) {
    question = clean(entry.label);
  } else if (trackId === 'upsc_ecosystem') {
    question = `With reference to ${topic}, which of the following is correct regarding ${label}?`;
  } else if (trackId === 'tnpsc_ecosystem') {
    question = `${topic} தொடர்பாக "${label}" குறித்து சரியான விடை எது?`;
  } else {
    question = `In ${topic}, choose the correct answer for ${label}.`;
  }
  const { options, answer_index } = shuffleWithAnswer(genericDistractors(answer, pool, seed), seed);
  return {
    question,
    options,
    answer_index,
    explanation: `From Day ${row.day_number} lesson "${topic}": ${label} -> ${answer}.`,
    source: 'local_exam_style_daily_topic_rebuild',
  };
}

function makeStatementQuestion(row, topic, entry, other, seed) {
  const correctFact = conciseAnswer(entry.fact);
  const wrongFact = conciseAnswer(other.fact);
  const question = `Consider the following statements about ${topic}:\n1. ${labelToStem(entry.label)}: ${correctFact}.\n2. ${labelToStem(other.label)}: ${wrongFact}.\nWhich of the statements given above is/are correct?`;
  const options = ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'];
  return {
    question,
    options,
    answer_index: 2,
    explanation: `Both statements are drawn from Day ${row.day_number}: ${topic}.`,
    source: 'local_exam_style_daily_topic_rebuild',
  };
}

function makeSscProblem(row, topic, entry, pool, seed) {
  const label = labelToStem(entry.label);
  const answer = conciseAnswer(entry.fact);
  const hasCode = /code|coded|letter|shift|opposite/i.test(label);
  const hasNumber = /\d|sum|value|percentage|ratio|profit|loss|hcf|lcm|unit digit|angle|area|time|speed|work/i.test(`${label} ${answer}`);
  let question = clean(entry.label).endsWith('?') ? clean(entry.label) : `Solve this ${topic} question: ${label}.`;
  if (!hasCode && !hasNumber && !/choose|find|solve|which|what|how/i.test(question)) {
    question = `Which option correctly applies the rule "${label}" in ${topic}?`;
  }
  const { options, answer_index } = shuffleWithAnswer(genericDistractors(answer, pool, seed), seed);
  return {
    question,
    options,
    answer_index,
    explanation: `Use the Day ${row.day_number} rule from ${topic}: ${label} -> ${answer}.`,
    source: 'local_exam_style_daily_topic_rebuild',
  };
}

function validateQuestion(q) {
  if (!q.question || q.question.length < 12) return false;
  if (!Array.isArray(q.options) || q.options.length !== 4) return false;
  if (!Number.isInteger(q.answer_index) || q.answer_index < 0 || q.answer_index > 3) return false;
  if (new Set(q.options.map((o) => clean(o).toLowerCase())).size !== 4) return false;
  const all = [q.question, ...q.options, q.explanation].join(' ');
  if (/\.\.\.|not supported|different topic|closest answer|accepting|wait:/i.test(all)) return false;
  return true;
}

function buildQuiz(row) {
  const payload = parsePayload(row.content_json);
  const { topic, entries } = collectEntries(payload, row);
  const target = TARGETS[row.track_id];
  const pool = entries.map((entry) => entry.fact);
  const questions = [];
  const seen = new Set();
  const seedBase = hashString(`${row.track_id}:${row.day_number}:${topic}`);

  const addQuestion = (q) => {
    const key = clean(q.question).toLowerCase();
    if (seen.has(key)) return;
    if (!validateQuestion(q)) return;
    seen.add(key);
    questions.push(q);
  };

  for (let i = 0; i < entries.length && questions.length < target; i += 1) {
    const entry = entries[i];
    if (row.track_id === 'ssc_ecosystem') addQuestion(makeSscProblem(row, topic, entry, pool, seedBase + i));
    else addQuestion(makeDirectQuestion(row.track_id, row, topic, entry, pool, seedBase + i));
  }

  if (row.track_id === 'upsc_ecosystem') {
    for (let i = 0; i < entries.length - 1 && questions.length < target; i += 2) {
      addQuestion(makeStatementQuestion(row, topic, entries[i], entries[i + 1], seedBase + 100 + i));
    }
  }

  let loop = 0;
  while (questions.length < target && loop < target * 5) {
    const entry = entries[loop % entries.length];
    addQuestion(makeDirectQuestion(row.track_id, row, topic, entry, pool, seedBase + 500 + loop));
    loop += 1;
  }

  let filler = 1;
  while (questions.length < target && filler < 50) {
    const entry = entries[(filler - 1) % entries.length];
    const answer = conciseAnswer(entry.fact);
    const question = row.track_id === 'ssc_ecosystem'
      ? `Practice ${filler}: In ${topic}, which option correctly matches ${labelToStem(entry.label)}?`
      : row.track_id === 'tnpsc_ecosystem'
        ? `Practice ${filler}: ${topic} - "${labelToStem(entry.label)}" என்பதற்கான சரியான பொருத்தம் எது?`
        : `Practice ${filler}: With reference to ${topic}, which match is correct for ${labelToStem(entry.label)}?`;
    const { options, answer_index } = shuffleWithAnswer(
      genericDistractors(answer, pool, seedBase + 900 + filler),
      seedBase + 900 + filler
    );
    addQuestion({
      question,
      options,
      answer_index,
      explanation: `This is based only on Day ${row.day_number} lesson "${topic}": ${labelToStem(entry.label)} -> ${answer}.`,
      source: 'local_exam_style_daily_topic_rebuild',
    });
    filler += 1;
  }

  payload.quiz = { questions: questions.slice(0, target) };
  payload.curriculum_metadata = {
    ...(payload.curriculum_metadata || {}),
    daily_question_target: target,
    quiz_source: 'Local exam-style daily topic rebuild',
    quiz_match_level: 'day_topic_exam_style_local',
    quiz_rebuilt_at: new Date().toISOString(),
  };
  payload.track = payload.track || row.track_id;
  payload.day_number = payload.day_number || row.day_number;
  payload.topic_title = payload.topic_title || row.topic_title;
  return payload;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const { data, error } = await supabase
    .from('master_content_vault')
    .select('track_id, day_number, topic_title, content_json')
    .in('track_id', TRACKS)
    .order('track_id', { ascending: true })
    .order('day_number', { ascending: true });
  if (error) throw error;

  const outDir = path.resolve(__dirname, '../scratch');
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(outDir, `daily-mission-before-local-rebuild-${stamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

  const report = { dryRun, backupPath, rows: data.length, ok: 0, failed: 0, failures: [], byTrack: {} };
  for (const row of data) {
    const payload = buildQuiz(row);
    const expected = TARGETS[row.track_id];
    const count = payload.quiz?.questions?.length || 0;
    report.byTrack[row.track_id] ||= { ok: 0, failed: 0 };
    if (count !== expected) {
      report.failed += 1;
      report.byTrack[row.track_id].failed += 1;
      report.failures.push({ track_id: row.track_id, day_number: row.day_number, topic_title: row.topic_title, count, expected });
      continue;
    }
    if (!dryRun) {
      const { error: updateError } = await supabase
        .from('master_content_vault')
        .update({ content_json: payload, updated_at: new Date().toISOString() })
        .eq('track_id', row.track_id)
        .eq('day_number', row.day_number);
      if (updateError) throw updateError;
    }
    report.ok += 1;
    report.byTrack[row.track_id].ok += 1;
  }

  const reportPath = path.join(outDir, `daily-mission-local-rebuild-report-${stamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ reportPath, ...report }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

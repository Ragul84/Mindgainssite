const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENROUTER_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
const MODEL = process.env.DAILY_QUIZ_MODEL || 'openai/gpt-4o-mini';

const TRACKS = ['upsc_ecosystem', 'tnpsc_ecosystem', 'ssc_ecosystem'];
const TARGETS = {
  upsc_ecosystem: 12,
  tnpsc_ecosystem: 12,
  ssc_ecosystem: 25,
};

const TRACK_NAMES = {
  upsc_ecosystem: 'UPSC Civil Services Prelims',
  tnpsc_ecosystem: 'TNPSC Group exams',
  ssc_ecosystem: 'SSC CGL/CHSL Tier 1',
};

const BAD_TEXT = [
  /\.\.\./u,
  /which option is correct about/i,
  /what should you remember/i,
  /daily mission check/i,
  /today'?s topic/i,
  /not supported by/i,
  /different topic/i,
  /closest answer/i,
  /accepting/i,
  /wait:/i,
  /hmm/i,
  /cannot be determined/i,
  /all of the above/i,
  /none of the above/i,
];

if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Missing Supabase credentials.');
if (!OPENROUTER_KEY) throw new Error('Missing OpenRouter key.');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function argValue(name, fallback = null) {
  const idx = process.argv.indexOf(name);
  if (idx === -1 || idx === process.argv.length - 1) return fallback;
  return process.argv[idx + 1];
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
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

function trimContext(text, max = 9000) {
  const cleaned = clean(text);
  if (cleaned.length <= max) return cleaned;
  return cleaned.slice(0, max);
}

function collectLesson(payload, topicTitle) {
  const lines = [];
  const add = (label, value) => {
    const text = clean(value);
    if (text) lines.push(`${label}: ${text}`);
  };

  add('Topic', topicTitle || payload.topic_title || payload.snapshot?.title);
  add('Lesson intro', payload.lesson_intro);
  add('Exam hook', payload.snapshot?.exam_hook);

  for (const note of payload.snapshot?.quick_notes || []) {
    add(`Quick note - ${note.title || 'point'}`, note.detail);
  }
  for (const card of payload.quick_note_cards || []) {
    add(`Recall card - ${card.front || card.title || 'card'}`, card.back || card.front);
  }
  for (const item of payload.snapshot?.structured_mastery || []) {
    add(`Structured mastery - ${item.heading || 'point'}`, item.content);
  }
  for (const trap of payload.trap_cards || []) {
    add(`Trap - ${trap.trap || 'trap'}`, trap.fix || trap.trap);
  }
  for (const item of payload.case_cards || []) {
    add(`Case - ${item.case || 'case'}`, [item.core_idea, item.exam_hook].filter(Boolean).join(' '));
  }
  for (const item of payload.writ_scenarios || []) {
    add(`Scenario - ${item.scenario || 'scenario'}`, item.answer);
  }
  add('Revision summary', payload.smart_revision_summary?.one_screen_summary);
  add('Mini grid', payload.smart_revision_summary?.mini_grid);

  return trimContext(lines.join('\n'));
}

function trackInstructions(trackId, topicTitle) {
  if (trackId === 'upsc_ecosystem') {
    return [
      'Write UPSC Prelims-style MCQs.',
      'Use statement-based, correctly matched, incorrect/correct, source/committee/article/schedule/case style when suitable.',
      'Avoid one-word flashcard prompts. A good question can test application or elimination, but must stay inside the lesson topic.',
      'Options should be plausible and comparable; explanations should explain why the answer is right.',
    ].join('\n');
  }
  if (trackId === 'ssc_ecosystem') {
    const isProblemTopic = /(quant|qa|number|percentage|profit|loss|ratio|average|time|work|speed|distance|geometry|mensuration|algebra|trigonometry|reasoning|coding|series|blood|direction|analogy)/i.test(topicTitle);
    return [
      'Write SSC Tier-1 style MCQs.',
      isProblemTopic
        ? 'For Quant/Reasoning topics, make actual solvable problems or realistic pattern questions. Do not ask only definitions. Keep each question under 140 characters where possible.'
        : 'For GA/English topics, use direct SSC-style factual, vocabulary, grammar, or error-identification questions.',
      'Options must be short, clean, and same type. For numerical questions, all options should be numbers/values. Avoid long explanations inside options.',
      'No vague memory prompts. No explanation fragments as options.',
    ].join('\n');
  }
  return [
    'Write TNPSC objective-style MCQs.',
    'Use direct factual Tamil/GS/state-specific questions, classification questions, year/person/book/article matching, and simple aptitude where relevant.',
    'Tamil questions may use Tamil text when the lesson is Tamil. Keep options clean and comparable.',
    'Avoid vague memory prompts. The wording should look like a real TNPSC practice question.',
  ].join('\n');
}

function promptFor(row, payload, targetOverride = null, avoidQuestions = []) {
  const target = targetOverride || TARGETS[row.track_id];
  const lesson = collectLesson(payload, row.topic_title);
  const avoidBlock = avoidQuestions.length
    ? ['Already generated question stems. Do not repeat or lightly rephrase these:', ...avoidQuestions.map((q) => `- ${q}`)].join('\n')
    : '';
  return [
    `Generate exactly ${target} production-quality multiple-choice questions for ${TRACK_NAMES[row.track_id]}.`,
    `Day ${row.day_number}: ${row.topic_title}`,
    '',
    trackInstructions(row.track_id, row.topic_title),
    '',
    'Hard rules:',
    '- Return only valid JSON. No markdown.',
      '- JSON shape: {"questions":[{"question":"...","options":["...","...","...","..."],"answer_index":0,"explanation":"..."}]}',
      `- Generate exactly ${target} questions in this response, not more and not fewer.`,
    '- Exactly 4 unique options per question.',
    '- answer_index must be 0, 1, 2, or 3.',
    '- No "all of the above" or "none of the above".',
    '- No ellipses, truncated text, filler, or generic prompts like "what should you remember".',
    '- Question and options must be complete and understandable without reading the lesson screen.',
    '- The quiz must test this day topic. Broad exam-style application is allowed only when it is clearly from this day topic.',
    '- If the lesson contains a suspicious fact, avoid it rather than repeating it.',
    '',
    'Lesson content:',
    lesson,
    avoidBlock,
  ].join('\n');
}

function extractJson(text) {
  const raw = clean(text);
  try {
    return JSON.parse(raw);
  } catch {}
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start >= 0 && end > start) return JSON.parse(raw.slice(start, end + 1));
  throw new Error('No JSON object found in model response.');
}

async function callOpenRouter(messages) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.EXPO_PUBLIC_APP_URL || 'https://mindgains.app',
      'X-Title': process.env.EXPO_PUBLIC_APP_NAME || 'MindGains',
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.18,
      max_tokens: Number(process.env.DAILY_QUIZ_MAX_TOKENS || '5000'),
      response_format: { type: 'json_object' },
      messages,
    }),
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(`OpenRouter ${response.status}: ${JSON.stringify(json).slice(0, 600)}`);
  }
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error(`Empty OpenRouter response: ${JSON.stringify(json).slice(0, 600)}`);
  return extractJson(content);
}

function validateQuestions(trackId, questions) {
  const target = TARGETS[trackId];
  const errors = [];
  if (!Array.isArray(questions)) errors.push('questions is not an array');
  if (!Array.isArray(questions)) return errors;
  if (questions.length !== target) errors.push(`expected ${target} questions, got ${questions.length}`);

  const seenQuestions = new Set();
  questions.forEach((q, index) => {
    const prefix = `Q${index + 1}`;
    const question = clean(q.question);
    const options = Array.isArray(q.options) ? q.options.map(clean) : [];
    const answerIndex = q.answer_index;
    const explanation = clean(q.explanation);
    const allText = [question, ...options, explanation].join(' ');

    if (question.length < 18) errors.push(`${prefix}: question too short`);
    if (BAD_TEXT.some((pattern) => pattern.test(allText))) errors.push(`${prefix}: bad/filler/truncated text`);
    if (seenQuestions.has(question.toLowerCase())) errors.push(`${prefix}: duplicate question`);
    seenQuestions.add(question.toLowerCase());
    if (options.length !== 4) errors.push(`${prefix}: expected 4 options`);
    if (new Set(options.map((o) => o.toLowerCase())).size !== options.length) errors.push(`${prefix}: duplicate options`);
    if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 3) errors.push(`${prefix}: bad answer_index`);
    if (!explanation || explanation.length < 20) errors.push(`${prefix}: explanation too short`);
    if (options.some((option) => option.length > 240)) errors.push(`${prefix}: option too long`);
  });
  return errors;
}

function sanitizeQuestions(trackId, questions) {
  if (!Array.isArray(questions)) return [];
  const target = TARGETS[trackId];
  const seenQuestions = new Set();
  const cleanQuestions = [];
  for (const q of questions) {
    const question = clean(q.question);
    const options = Array.isArray(q.options) ? q.options.map(clean).filter(Boolean) : [];
    const answerIndex = q.answer_index;
    const explanation = clean(q.explanation);
    const allText = [question, ...options, explanation].join(' ');
    if (!question || seenQuestions.has(question.toLowerCase())) continue;
    if (BAD_TEXT.some((pattern) => pattern.test(allText))) continue;
    if (options.length !== 4) continue;
    if (new Set(options.map((o) => o.toLowerCase())).size !== 4) continue;
    if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 3) continue;
    seenQuestions.add(question.toLowerCase());
    cleanQuestions.push({
      question,
      options,
      answer_index: answerIndex,
      explanation,
    });
    if (cleanQuestions.length === target) break;
  }
  return cleanQuestions;
}

async function generateQuiz(row) {
  const payload = parsePayload(row.content_json);
  const buildMessages = (targetOverride = null, avoidQuestions = []) => [
    { role: 'system', content: 'You are a strict Indian competitive-exam question setter. You write clean, factual, exam-style MCQs only.' },
    { role: 'user', content: promptFor(row, payload, targetOverride, avoidQuestions) },
  ];

  let parsed;
  let questions;

  if (row.track_id === 'ssc_ecosystem') {
    const first = await callOpenRouter(buildMessages(18));
    const firstQuestions = Array.isArray(first.questions) ? first.questions : [];
    const avoid = firstQuestions.map((q) => clean(q.question)).filter(Boolean);
    const second = await callOpenRouter(buildMessages(18, avoid));
    questions = [...firstQuestions, ...(Array.isArray(second.questions) ? second.questions : [])];
    parsed = { questions };
  } else {
    parsed = await callOpenRouter(buildMessages());
    questions = parsed.questions;
  }

  questions = sanitizeQuestions(row.track_id, questions);
  let errors = validateQuestions(row.track_id, questions);

  if (errors.length) {
    parsed = await callOpenRouter([
      ...buildMessages(),
      { role: 'assistant', content: JSON.stringify(parsed) },
      {
        role: 'user',
        content: [
          'Repair the JSON. Keep the same day topic, but fix these validation errors:',
          errors.slice(0, 30).join('\n'),
          'Return only the corrected JSON object with exactly the required number of questions.',
        ].join('\n'),
      },
    ]);
    questions = sanitizeQuestions(row.track_id, parsed.questions);
    errors = validateQuestions(row.track_id, questions);
  }

  if (errors.length) {
    return { ok: false, errors, questions: Array.isArray(questions) ? questions : [] };
  }

  const nextPayload = payload;
  nextPayload.quiz = {
    questions: questions.map((q) => ({
      question: clean(q.question),
      options: q.options.map(clean),
      answer_index: q.answer_index,
      explanation: clean(q.explanation),
      source: 'ai_exam_style_daily_topic_rebuild',
    })),
  };
  nextPayload.curriculum_metadata = {
    ...(nextPayload.curriculum_metadata || {}),
    daily_question_target: TARGETS[row.track_id],
    quiz_source: 'AI exam-style daily topic rebuild',
    quiz_match_level: 'day_topic_exam_style',
    quiz_rebuilt_at: new Date().toISOString(),
    quiz_model: MODEL,
  };
  nextPayload.track = nextPayload.track || row.track_id;
  nextPayload.day_number = nextPayload.day_number || row.day_number;
  nextPayload.topic_title = nextPayload.topic_title || row.topic_title;
  return { ok: true, payload: nextPayload, errors: [] };
}

async function loadRows() {
  const track = argValue('--track');
  const day = argValue('--day');
  const from = Number(argValue('--from', '1'));
  const to = Number(argValue('--to', '100'));
  let query = supabase
    .from('master_content_vault')
    .select('track_id, day_number, topic_title, content_json')
    .in('track_id', track ? [track] : TRACKS)
    .gte('day_number', day ? Number(day) : from)
    .lte('day_number', day ? Number(day) : to)
    .order('track_id', { ascending: true })
    .order('day_number', { ascending: true });
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function updateRow(row, payload) {
  const { error } = await supabase
    .from('master_content_vault')
    .update({ content_json: payload, updated_at: new Date().toISOString() })
    .eq('track_id', row.track_id)
    .eq('day_number', row.day_number);
  if (error) throw error;
}

async function main() {
  const apply = hasFlag('--apply');
  const limit = Number(argValue('--limit', '0'));
  const rows = await loadRows();
  const selectedRows = limit > 0 ? rows.slice(0, limit) : rows;
  const outDir = path.resolve(__dirname, '../scratch');
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(outDir, `daily-mission-exam-rebuild-${stamp}.json`);
  const backupPath = path.join(outDir, `daily-mission-before-exam-rebuild-${stamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(selectedRows, null, 2));

  const report = {
    generated_at: new Date().toISOString(),
    model: MODEL,
    apply,
    backupPath,
    rows: selectedRows.length,
    ok: 0,
    failed: 0,
    failures: [],
  };

  for (const row of selectedRows) {
    const label = `${row.track_id} day ${row.day_number} ${row.topic_title}`;
    console.log(`GENERATING ${label}`);
    try {
      const result = await generateQuiz(row);
      if (!result.ok) {
        report.failed += 1;
        report.failures.push({ track_id: row.track_id, day_number: row.day_number, topic_title: row.topic_title, errors: result.errors });
        console.log(`FAILED ${label}: ${result.errors.slice(0, 3).join(' | ')}`);
        continue;
      }
      if (apply) await updateRow(row, result.payload);
      report.ok += 1;
      console.log(`OK ${label}`);
    } catch (error) {
      report.failed += 1;
      report.failures.push({ track_id: row.track_id, day_number: row.day_number, topic_title: row.topic_title, errors: [error.message] });
      console.log(`ERROR ${label}: ${error.message}`);
    }
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ reportPath, ...report }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

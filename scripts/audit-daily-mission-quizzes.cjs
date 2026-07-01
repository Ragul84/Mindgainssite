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

const HARD_BAD_PATTERNS = [
  /GHPYH/u,
  /EVOL\.\s*\(L-O/u,
  /Accepting /iu,
  /Closest answer/iu,
  /Hmm\s*-/iu,
  /Wait:/iu,
  /not in choices/iu,
  /cannot be determined/i,
  /different topic, not today/i,
  /not supported by the daily mission/i,
];

const GENERIC_PROMPTS = [
  /^Which option is correct about /i,
  /^Which statement is directly supported by today/i,
  /^For exam revision, which option belongs to today/i,
  /^Daily mission check \d+/i,
  /what should you remember about/i,
];

const FRAGMENT_PATTERNS = [
  /\.\.\.$/u,
  /\.\.\./u,
  /: [A-Z][A-Za-z ]+ Hook:/u,
  /Coding-Decoding —/u,
  /REVISION:/u,
];

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalize(value) {
  return clean(value).toLowerCase();
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

function collectLessonText(payload, topicTitle) {
  const parts = [
    topicTitle,
    payload.topic_title,
    payload.snapshot?.title,
    payload.snapshot?.exam_hook,
    payload.lesson_intro,
    payload.smart_revision_summary?.mini_grid,
    payload.smart_revision_summary?.one_screen_summary,
  ];
  for (const card of payload.quick_note_cards || []) {
    parts.push(card.title, card.front, card.back);
  }
  for (const note of payload.snapshot?.quick_notes || []) {
    parts.push(note.title, note.detail);
  }
  for (const item of payload.snapshot?.structured_mastery || []) {
    parts.push(item.heading, item.content);
  }
  for (const trap of payload.trap_cards || []) {
    parts.push(trap.trap, trap.fix);
  }
  for (const item of payload.case_cards || []) {
    parts.push(item.case, item.core_idea, item.exam_hook);
  }
  return normalize(parts.filter(Boolean).join(' '));
}

function hasPattern(patterns, text) {
  return patterns.some((pattern) => pattern.test(text));
}

function answerInLesson(answer, lessonText) {
  const ans = normalize(answer);
  if (!ans) return false;
  if (ans.length <= 3) return lessonText.includes(ans);
  const slice = ans.slice(0, Math.min(60, ans.length));
  if (lessonText.includes(slice)) return true;
  const tokens = ans
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/u)
    .filter((token) => token.length > 2);
  if (tokens.length === 0) return false;
  const matched = tokens.filter((token) => lessonText.includes(token)).length;
  return matched / tokens.length >= 0.6;
}

function isAtomicAnswer(answer) {
  const text = clean(answer);
  return /^-?\d+(\.\d+)?(%|°| cm| km| m| years?)?$/iu.test(text)
    || /^[A-Z]{1,8}$/u.test(text)
    || /^[\u0B80-\u0BFF]{1,12}$/u.test(text)
    || /^(yes|no)$/iu.test(text);
}

function isWeakShortAnswer(question, answer) {
  const q = normalize(question);
  const a = clean(answer);
  if (a.length >= 4) return false;
  if (isAtomicAnswer(a) && /(code|letter|sum|number|how many|pH|article|schedule|year|date|ratio|value|formula)/i.test(q)) return false;
  return true;
}

function questionLooksExamStyle(trackId, question) {
  const q = clean(question);
  if (trackId === 'upsc_ecosystem') {
    return /(which of the following|consider the following|with reference to|correctly matched|statement|not correct|incorrect|article|schedule|case|committee|movement|reason)/i.test(q);
  }
  if (trackId === 'ssc_ecosystem') {
    return /(find|solve|value|code|series|ratio|percentage|profit|loss|which|choose|error|synonym|antonym|next|distance|time|work|angle|triangle)/i.test(q);
  }
  return /(எது|யார்|எத்தனை|which|choose|find|article|year|correct|not correct|formula|தமிழ்|tnpsc)/i.test(q);
}

function auditQuestion(row, payload, lessonText, question, index) {
  const issues = [];
  const qText = clean(question.question);
  const options = Array.isArray(question.options) ? question.options.map(clean) : [];
  const answerIndex = question.answer_index;
  const answer = options[answerIndex];
  const allText = [qText, ...options, question.explanation].map(clean).join(' ');

  if (!qText) issues.push({ severity: 'hard', code: 'EMPTY_QUESTION' });
  if (options.length !== 4) issues.push({ severity: 'hard', code: 'OPTION_COUNT', detail: `${options.length}` });
  if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= options.length) {
    issues.push({ severity: 'hard', code: 'BAD_ANSWER_INDEX', detail: `${answerIndex}` });
  }
  if (new Set(options.map(normalize)).size !== options.length) {
    issues.push({ severity: 'hard', code: 'DUPLICATE_OPTIONS' });
  }
  if (hasPattern(HARD_BAD_PATTERNS, allText)) {
    issues.push({ severity: 'hard', code: 'KNOWN_BAD_OR_FALLBACK_TEXT' });
  }
  const isStatementAnswer = /consider the following statements/i.test(qText)
    && /^(1 only|2 only|both 1 and 2|neither 1 nor 2)$/i.test(clean(answer));
  if (answer && !isStatementAnswer && !answerInLesson(answer, lessonText)) {
    issues.push({ severity: 'hard', code: 'ANSWER_NOT_FOUND_IN_LESSON', detail: answer.slice(0, 100) });
  }

  if (hasPattern(GENERIC_PROMPTS, qText)) {
    issues.push({ severity: 'soft', code: 'GENERIC_PROMPT' });
  }
  if (!questionLooksExamStyle(row.track_id, qText)) {
    issues.push({ severity: 'soft', code: 'WEAK_EXAM_STYLE' });
  }
  if (options.some((option) => option.length > 140)) {
    issues.push({ severity: 'soft', code: 'OVERLONG_OPTION' });
  }
  if (options.some((option) => hasPattern(FRAGMENT_PATTERNS, option))) {
    issues.push({ severity: 'soft', code: 'FRAGMENT_OR_TRUNCATED_OPTION' });
  }
  if (answer && isWeakShortAnswer(qText, answer)) {
    issues.push({ severity: 'soft', code: 'AMBIGUOUS_SHORT_ANSWER', detail: answer });
  }
  if (qText.length < 18) {
    issues.push({ severity: 'soft', code: 'QUESTION_TOO_SHORT' });
  }
  if ((question.source || '').includes(':statement') || (question.source || '').includes(':revision') || (question.source || '').includes(':fill')) {
    issues.push({ severity: 'soft', code: 'REUSED_FACT_VARIANT' });
  }

  return issues.length
    ? {
        index,
        question: qText,
        answer,
        source: question.source,
        issues,
      }
    : null;
}

function classifyDay(dayIssues, row, payload) {
  const hardCount = dayIssues.reduce((sum, q) => sum + q.issues.filter((i) => i.severity === 'hard').length, 0);
  const softCount = dayIssues.reduce((sum, q) => sum + q.issues.filter((i) => i.severity === 'soft').length, 0);
  const genericCount = dayIssues.reduce((sum, q) => sum + q.issues.filter((i) => i.code === 'GENERIC_PROMPT').length, 0);
  const reusedCount = dayIssues.reduce((sum, q) => sum + q.issues.filter((i) => i.code === 'REUSED_FACT_VARIANT').length, 0);
  const target = TARGETS[row.track_id];
  const count = payload.quiz?.questions?.length || 0;

  if (count !== target || hardCount > 0) return 'fail';
  if (genericCount > Math.ceil(count * 0.35) || reusedCount > Math.ceil(count * 0.35) || softCount > count) return 'rewrite';
  if (softCount > 0) return 'review';
  return 'pass';
}

async function main() {
  const { data, error } = await supabase
    .from('master_content_vault')
    .select('track_id, day_number, topic_title, content_json')
    .in('track_id', TRACKS)
    .order('track_id', { ascending: true })
    .order('day_number', { ascending: true });
  if (error) throw error;

  const report = {
    generated_at: new Date().toISOString(),
    totals: { rows: 0, pass: 0, review: 0, rewrite: 0, fail: 0, hardIssues: 0, softIssues: 0 },
    byTrack: {},
    issueCounts: {},
    days: [],
  };

  for (const row of data || []) {
    const payload = parsePayload(row.content_json);
    const lessonText = collectLessonText(payload, row.topic_title);
    const questions = payload.quiz?.questions || [];
    const dayIssues = [];

    if (questions.length !== TARGETS[row.track_id]) {
      dayIssues.push({
        index: 0,
        question: '__day__',
        answer: '',
        source: '',
        issues: [{ severity: 'hard', code: 'COUNT_MISMATCH', detail: `${questions.length}/${TARGETS[row.track_id]}` }],
      });
    }

    questions.forEach((question, idx) => {
      const result = auditQuestion(row, payload, lessonText, question, idx + 1);
      if (result) dayIssues.push(result);
    });

    const status = classifyDay(dayIssues, row, payload);
    const trackReport = report.byTrack[row.track_id] ||= { rows: 0, pass: 0, review: 0, rewrite: 0, fail: 0, hardIssues: 0, softIssues: 0 };
    report.totals.rows += 1;
    report.totals[status] += 1;
    trackReport.rows += 1;
    trackReport[status] += 1;

    let hardIssues = 0;
    let softIssues = 0;
    for (const q of dayIssues) {
      for (const issue of q.issues) {
        report.issueCounts[issue.code] = (report.issueCounts[issue.code] || 0) + 1;
        if (issue.severity === 'hard') hardIssues += 1;
        else softIssues += 1;
      }
    }
    report.totals.hardIssues += hardIssues;
    report.totals.softIssues += softIssues;
    trackReport.hardIssues += hardIssues;
    trackReport.softIssues += softIssues;

    if (status !== 'pass') {
      report.days.push({
        track_id: row.track_id,
        day_number: row.day_number,
        topic_title: row.topic_title,
        status,
        count: questions.length,
        hardIssues,
        softIssues,
        samples: dayIssues.slice(0, 8),
      });
    }
  }

  const outDir = path.resolve(__dirname, '../scratch');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `daily-mission-quiz-audit-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    outPath,
    totals: report.totals,
    byTrack: report.byTrack,
    issueCounts: report.issueCounts,
    firstProblemDays: report.days.slice(0, 12).map((d) => ({
      track_id: d.track_id,
      day_number: d.day_number,
      status: d.status,
      hardIssues: d.hardIssues,
      softIssues: d.softIssues,
      topic_title: d.topic_title,
    })),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

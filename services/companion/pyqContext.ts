import { supabase } from '@/utils/supabaseService';

type PyqQuestion = {
  year?: number;
  question?: string;
  question_text?: string;
  correct_answer?: number;
  options?: string[];
  answer_index?: number;
  explanation?: string;
  source?: string;
  note?: string;
  pyq?: {
    year?: number;
    exam?: string;
    qno?: string;
  };
};

type VaultRow = {
  track_id: string;
  day_number: number;
  topic_title: string | null;
  content_json: any;
};

type PyqDbRow = {
  id: string;
  source_id: string;
  exam: string;
  year?: number;
  subject?: string | null;
  topic?: string | null;
  question_number?: string | null;
  question_text: string;
  options?: string[] | null;
  answer_text?: string | null;
  explanation?: string | null;
  page_start?: number | null;
};

const PYQ_HINT_RE = /\b(pyq|previous\s+year|past\s+year|real\s+question|asked\s+in|year\s+question)\b/i;

const TRACKS = [
  { id: 'upsc_ecosystem', label: 'UPSC', aliases: ['upsc', 'ias', 'prelims', 'mains'] },
  { id: 'tnpsc_ecosystem', label: 'TNPSC', aliases: ['tnpsc', 'group 1', 'group 2', 'group 4', 'vao'] },
  { id: 'ssc_ecosystem', label: 'SSC', aliases: ['ssc', 'cgl', 'chsl', 'mts', 'cpo', 'gd'] },
];

const STOPWORDS = new Set([
  'show', 'give', 'me', 'real', 'verified', 'pyq', 'pyqs', 'previous', 'year', 'questions',
  'question', 'of', 'on', 'for', 'from', 'the', 'a', 'an', 'and', 'with', 'practice',
  'upsc', 'tnpsc', 'ssc', 'ias', 'prelims', 'mains', 'group', 'cgl', 'chsl',
]);

function parsePayload(raw: any): any {
  if (!raw) return null;
  if (typeof raw !== 'string') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalize(value: unknown) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function words(value: string) {
  return normalize(value)
    .split(' ')
    .filter((word) => word.length >= 3 && !STOPWORDS.has(word));
}

function detectTrackIds(prompt: string) {
  const text = normalize(prompt);
  const matched = TRACKS.filter((track) =>
    track.aliases.some((alias) => text.includes(normalize(alias))),
  ).map((track) => track.id);
  return matched.length ? matched : TRACKS.map((track) => track.id);
}

function detectExams(prompt: string) {
  const trackIds = detectTrackIds(prompt);
  return trackIds.map(trackLabel);
}

function trackLabel(trackId: string) {
  return TRACKS.find((track) => track.id === trackId)?.label || trackId.replace('_ecosystem', '').toUpperCase();
}

function scoreRow(row: VaultRow, promptWords: string[]) {
  if (!promptWords.length) return 1;
  const payload = parsePayload(row.content_json);
  const haystack = normalize([
    row.topic_title,
    payload?.topic_title,
    payload?.snapshot?.title,
    payload?.snapshot?.exam_hook,
    ...(payload?.snapshot?.quick_notes || []).flatMap((note: any) => [note?.title, note?.detail]),
  ].filter(Boolean).join(' '));
  return promptWords.reduce((score, word) => score + (haystack.includes(word) ? 1 : 0), 0);
}

function collectPyqs(row: VaultRow): Array<PyqQuestion & { track_id: string; day_number: number; topic_title: string }> {
  const payload = parsePayload(row.content_json);
  const direct = Array.isArray(payload?.pyq_quiz) ? payload.pyq_quiz : [];
  const merged = Array.isArray(payload?.quiz?.questions)
    ? payload.quiz.questions.filter((q: any) => q?.pyq || /pyq|previous year/i.test(String(q?.source || q?.note || '')))
    : [];
  return [...direct, ...merged]
    .filter((q: PyqQuestion) => String(q?.question || q?.question_text || '').trim().length > 0)
    .map((q: PyqQuestion) => ({
      ...q,
      track_id: row.track_id,
      day_number: row.day_number,
      topic_title: row.topic_title || payload?.topic_title || payload?.snapshot?.title || `Day ${row.day_number}`,
    }));
}

function formatPyqContext(questions: Array<PyqQuestion & { track_id: string; day_number: number; topic_title: string }>) {
  const lines = questions.slice(0, 5).map((q, index) => {
    const answerIndex =
      typeof q.answer_index === 'number'
        ? q.answer_index
        : typeof q.correct_answer === 'number'
          ? q.correct_answer
          : undefined;
    const answer = answerIndex !== undefined && q.options?.[answerIndex] ? q.options[answerIndex] : 'Answer key unavailable';
    const options = (q.options || []).map((option, idx) => `${String.fromCharCode(65 + idx)}. ${option}`).join(' | ');
    const year = q.year || q.pyq?.year;
    const source = q.source || q.pyq?.exam;
    return [
      `PYQ ${index + 1}: ${trackLabel(q.track_id)} Day ${q.day_number} - ${q.topic_title}`,
      year ? `Year: ${year}` : undefined,
      source ? `Source: ${source}` : undefined,
      `Question: ${q.question || q.question_text}`,
      options ? `Options: ${options}` : undefined,
      `Correct answer: ${answer}`,
      q.explanation ? `Explanation: ${q.explanation}` : undefined,
    ].filter(Boolean).join('\n');
  });

  return [
    'VERIFICATION_STATUS: VERIFIED_PYQ_CONTEXT',
    'Use only these verified previous-year questions when answering the user. Do not invent exam year, paper, wording, options, or answer keys.',
    'If the user asks for more than these, say more verified PYQs can be opened in Quiz Hub / Daily Dose instead of fabricating.',
    ...lines,
  ].join('\n\n');
}

function formatDbPyqContext(rows: PyqDbRow[]) {
  const lines = rows.slice(0, 5).map((q, index) => {
    const options = Array.isArray(q.options) ? q.options.map((option, idx) => `${String.fromCharCode(65 + idx)}. ${option}`).join(' | ') : '';
    return [
      `PYQ ${index + 1}: ${q.exam}${q.year ? ` ${q.year}` : ''}${q.question_number ? ` Q${q.question_number}` : ''}`,
      q.subject ? `Subject: ${q.subject}` : undefined,
      q.topic ? `Topic: ${q.topic}` : undefined,
      `Source: ${q.source_id}${q.page_start ? ` page ${q.page_start}` : ''}`,
      `Question: ${q.question_text}`,
      options ? `Options: ${options}` : undefined,
      q.answer_text ? `Answer: ${q.answer_text}` : undefined,
      q.explanation ? `Explanation: ${q.explanation}` : undefined,
    ].filter(Boolean).join('\n');
  });

  return [
    'VERIFICATION_STATUS: VERIFIED_PYQ_DATABASE_CONTEXT',
    'Use only these verified previous-year questions from the PYQ database. Do not invent exam year, paper, wording, options, or answer keys.',
    ...lines,
  ].join('\n\n');
}

function isDisplayableDbPyq(row: PyqDbRow) {
  const sourceId = String(row.source_id || '').toLowerCase();
  const text = String(row.question_text || '').trim();
  if (text.length < 30) return false;
  if (/[�¤£§©®±¶¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]/.test(text)) return false;
  if (/(general-tamil|geneal-tamil|pothu-tamil|gs-gt|gt-with|g1p-gs)/i.test(sourceId)) return false;
  if (/\b(combined graduate level examination|exam date|exam time|turn over)\b/i.test(text)) return false;
  if (/^only conclusions?\b/i.test(text)) return false;
  return true;
}

async function getDatabasePyqs(prompt: string): Promise<PyqDbRow[]> {
  const exams = detectExams(prompt);
  const promptWords = words(prompt).slice(0, 4);
  let query = supabase
    .from('pyq_questions')
    .select('id, source_id, exam, year, subject, topic, question_number, question_text, options, answer_text, explanation, page_start')
    .in('exam', exams)
    .gte('confidence', 0.45)
    .order('year', { ascending: false })
    .limit(40);

  if (promptWords.length) {
    const filters = promptWords.flatMap((word) => [
      `question_text.ilike.%${word}%`,
      `topic.ilike.%${word}%`,
      `subject.ilike.%${word}%`,
    ]);
    query = query.or(filters.join(','));
  }

  const { data, error } = await query;
  if (error || !data?.length) return [];
  return (data as PyqDbRow[]).filter(isDisplayableDbPyq).slice(0, 5);
}

export function isPyqRequest(prompt: string) {
  return PYQ_HINT_RE.test(prompt);
}

export async function buildPyqContext(prompt: string) {
  if (!isPyqRequest(prompt)) return '';

  const databasePyqs = await getDatabasePyqs(prompt);
  if (databasePyqs.length) {
    return formatDbPyqContext(databasePyqs);
  }

  const trackIds = detectTrackIds(prompt);
  const promptWords = words(prompt);
  const { data, error } = await supabase
    .from('master_content_vault')
    .select('track_id, day_number, topic_title, content_json')
    .in('track_id', trackIds)
    .order('day_number', { ascending: true })
    .limit(360);

  if (error || !data?.length) {
    return [
      'VERIFICATION_STATUS: NO_VERIFIED_PYQ_SOURCE',
      'The user asked for previous-year questions, but the verified PYQ source could not be loaded. Do not create fake PYQs.',
      'Say that you cannot verify a real PYQ for this request right now, then offer to practice generated questions clearly marked as practice.',
    ].join('\n');
  }

  const ranked = (data as VaultRow[])
    .map((row) => ({ row, score: scoreRow(row, promptWords) }))
    .filter(({ row }) => collectPyqs(row).length > 0)
    .sort((a, b) => b.score - a.score || a.row.day_number - b.row.day_number);

  const questions = ranked.flatMap(({ row }) => collectPyqs(row)).slice(0, 5);
  if (!questions.length) {
    return [
      'VERIFICATION_STATUS: NO_VERIFIED_PYQ_MATCH',
      `Supported verified PYQ lanes right now: ${TRACKS.map((track) => track.label).join(', ')} Daily Dose PYQs.`,
      'The user asked for PYQs, but no matching verified PYQ was found in those lanes. Do not invent past-year questions.',
      'Offer the closest supported PYQ categories or generated practice questions clearly marked as practice.',
    ].join('\n');
  }

  return formatPyqContext(questions);
}

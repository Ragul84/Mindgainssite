import { supabase } from '@/utils/supabaseService';
import { PYQ_SOURCE_CATALOG } from '@/services/companion/pyqSourceCatalog';

type VaultRow = {
  track_id: string;
  day_number: number;
  topic_title: string | null;
  content_json: any;
};

type TopicFrequency = {
  topic: string;
  trackId: string;
  exam: string;
  questionCount: number;
  dayCount: number;
  years: number[];
  days: number[];
};

type FrequencyRow = {
  exam: string;
  subject: string;
  topic: string;
  question_count: number;
  years?: number[];
  source_count?: number;
};

const PATTERN_HINT_RE = /\b(important|importance|focus|high[-\s]?yield|pattern|trend|frequency|frequent|asked|weightage|what\s+should\s+i\s+study|what\s+to\s+study|examiner)\b/i;

const TRACKS = [
  { id: 'upsc_ecosystem', exam: 'UPSC', aliases: ['upsc', 'ias', 'cse', 'prelims', 'mains'] },
  { id: 'tnpsc_ecosystem', exam: 'TNPSC', aliases: ['tnpsc', 'group 1', 'group 2', 'group 4', 'vao'] },
  { id: 'ssc_ecosystem', exam: 'SSC', aliases: ['ssc', 'cgl', 'chsl', 'mts', 'cpo', 'gd'] },
];

const SUBJECT_WORDS: Record<string, string[]> = {
  polity: ['polity', 'constitution', 'rights', 'dpsp', 'parliament', 'judiciary', 'president', 'governance'],
  history: ['history', 'freedom', 'movement', 'ancient', 'medieval', 'modern', 'gandhi', 'revolt'],
  geography: ['geography', 'climate', 'river', 'soil', 'monsoon', 'map', 'earth'],
  economy: ['economy', 'economic', 'budget', 'banking', 'inflation', 'gdp', 'tax', 'finance'],
  science: ['science', 'physics', 'chemistry', 'biology', 'environment', 'ecology', 'technology'],
  tamil: ['tamil', 'literature', 'grammar', 'thirukkural'],
  maths: ['maths', 'math', 'quant', 'aptitude', 'reasoning', 'csat'],
  english: ['english', 'comprehension', 'grammar', 'vocabulary'],
};

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

function detectTrackIds(prompt: string, fallbackTrackId?: string | null) {
  const text = normalize(prompt);
  const matched = TRACKS.filter((track) =>
    track.aliases.some((alias) => text.includes(normalize(alias))),
  ).map((track) => track.id);
  if (matched.length) return matched;
  if (fallbackTrackId && TRACKS.some((track) => track.id === fallbackTrackId)) return [fallbackTrackId];
  return TRACKS.map((track) => track.id);
}

function trackExam(trackId: string) {
  return TRACKS.find((track) => track.id === trackId)?.exam || trackId.replace('_ecosystem', '').toUpperCase();
}

function detectSubject(prompt: string) {
  const text = normalize(prompt);
  return Object.entries(SUBJECT_WORDS).find(([, words]) => words.some((word) => text.includes(word)))?.[0] || null;
}

function rowMatchesSubject(row: VaultRow, subject: string | null) {
  if (!subject) return true;
  const payload = parsePayload(row.content_json);
  const haystack = normalize([
    row.topic_title,
    payload?.topic_title,
    payload?.snapshot?.title,
    payload?.snapshot?.exam_hook,
    payload?.track,
    ...(payload?.curriculum_metadata?.ecosystem_tags || []),
  ].filter(Boolean).join(' '));
  return SUBJECT_WORDS[subject]?.some((word) => haystack.includes(word)) || haystack.includes(subject);
}

function collectVerifiedPyqs(row: VaultRow) {
  const payload = parsePayload(row.content_json);
  const direct = Array.isArray(payload?.pyq_quiz) ? payload.pyq_quiz : [];
  const merged = Array.isArray(payload?.quiz?.questions)
    ? payload.quiz.questions.filter((q: any) => q?.pyq || /pyq|previous year/i.test(String(q?.source || q?.note || '')))
    : [];
  return [...direct, ...merged].filter((q: any) => String(q?.question || q?.question_text || '').trim().length > 0);
}

async function getFallbackTrackId(userId?: string) {
  if (!userId || userId === 'guest') return null;
  const { data } = await supabase
    .from('user_protocols')
    .select('track_id')
    .eq('user_id', userId)
    .maybeSingle();
  return typeof data?.track_id === 'string' ? data.track_id : null;
}

function summarizeRows(rows: VaultRow[], subject: string | null): TopicFrequency[] {
  const byTopic = new Map<string, TopicFrequency>();
  for (const row of rows) {
    if (!rowMatchesSubject(row, subject)) continue;
    const pyqs = collectVerifiedPyqs(row);
    if (!pyqs.length) continue;
    const payload = parsePayload(row.content_json);
    const topic = String(row.topic_title || payload?.topic_title || payload?.snapshot?.title || `Day ${row.day_number}`).trim();
    const key = `${row.track_id}:${topic.toLowerCase()}`;
    const current = byTopic.get(key) || {
      topic,
      trackId: row.track_id,
      exam: trackExam(row.track_id),
      questionCount: 0,
      dayCount: 0,
      years: [],
      days: [],
    };
    current.questionCount += pyqs.length;
    current.dayCount += 1;
    current.days.push(row.day_number);
    for (const q of pyqs) {
      const year = Number(q?.year || q?.pyq?.year);
      if (Number.isFinite(year) && !current.years.includes(year)) current.years.push(year);
    }
    byTopic.set(key, current);
  }
  return [...byTopic.values()]
    .map((item) => ({ ...item, years: item.years.sort(), days: item.days.sort((a, b) => a - b) }))
    .sort((a, b) => b.questionCount - a.questionCount || b.dayCount - a.dayCount || a.topic.localeCompare(b.topic))
    .slice(0, 10);
}

function coverageFor(trackIds: string[]) {
  const exams = trackIds.map(trackExam);
  return PYQ_SOURCE_CATALOG.coverage.filter((item) => exams.includes(item.exam));
}

async function getSqlFrequencyContext(trackIds: string[], subject: string | null) {
  const exams = trackIds.map(trackExam);
  let query = supabase
    .from('pyq_topic_frequencies')
    .select('exam, subject, topic, question_count, years, source_count')
    .in('exam', exams)
    .neq('topic', 'untagged')
    .order('question_count', { ascending: false })
    .limit(10);

  if (subject) {
    query = query.or(`subject.ilike.%${subject}%,topic.ilike.%${subject}%`);
  }

  const { data, error } = await query;
  if (error || !data?.length) return '';

  return [
    'VERIFICATION_STATUS: VERIFIED_SQL_PATTERN_CONTEXT',
    'Use this SQL frequency view as source of truth. Explain the pattern; do not estimate or add unsupported counts.',
    `Exam context: ${exams.join(', ')}`,
    `Subject filter: ${subject || 'all subjects'}`,
    'Top verified PYQ topics from pyq_topic_frequencies:',
    ...(data as FrequencyRow[]).map((item, index) =>
      `${index + 1}. ${item.topic} | ${item.exam} | subject: ${item.subject} | ${item.question_count} verified PYQ question(s) | source papers: ${item.source_count || 0} | years: ${Array.isArray(item.years) && item.years.length ? item.years.join(', ') : 'not tagged'}`,
    ),
  ].join('\n');
}

export function isExamPatternRequest(prompt: string) {
  return PATTERN_HINT_RE.test(prompt);
}

export async function buildExamPatternContext(prompt: string, userId?: string) {
  if (!isExamPatternRequest(prompt)) return '';

  const fallbackTrackId = await getFallbackTrackId(userId);
  const trackIds = detectTrackIds(prompt, fallbackTrackId);
  const subject = detectSubject(prompt);
  const sqlContext = await getSqlFrequencyContext(trackIds, subject);
  if (sqlContext) return sqlContext;

  const { data, error } = await supabase
    .from('master_content_vault')
    .select('track_id, day_number, topic_title, content_json')
    .in('track_id', trackIds)
    .order('day_number', { ascending: true })
    .limit(360);

  const coverage = coverageFor(trackIds);
  if (error || !data?.length) {
    return [
      'VERIFICATION_STATUS: NO_PATTERN_ROWS',
      'The user asked for exam importance/pattern data, but tagged PYQ rows could not be loaded. Do not estimate topic frequency.',
      coverage.length ? `Raw PYQ PDF coverage available: ${coverage.map((c) => `${c.exam}: ${c.paperCount} papers (${c.earliestYear || '?'}-${c.latestYear || '?'})`).join('; ')}` : '',
    ].filter(Boolean).join('\n');
  }

  const topics = summarizeRows(data as VaultRow[], subject);
  if (!topics.length) {
    return [
      'VERIFICATION_STATUS: NO_PATTERN_MATCH',
      `Requested subject filter: ${subject || 'none'}.`,
      'No verified tagged PYQ frequency rows matched. Do not invent counts.',
      coverage.length ? `Raw PYQ PDF coverage available: ${coverage.map((c) => `${c.exam}: ${c.paperCount} papers (${c.earliestYear || '?'}-${c.latestYear || '?'})`).join('; ')}` : '',
    ].filter(Boolean).join('\n');
  }

  return [
    'VERIFICATION_STATUS: VERIFIED_EXAM_PATTERN_CONTEXT',
    'Use the raw counts below as the source of truth. Explain the pattern; do not estimate or add unsupported counts.',
    `Exam context: ${trackIds.map(trackExam).join(', ')}`,
    `Subject filter: ${subject || 'all subjects'}`,
    `Raw PYQ PDF coverage: ${coverage.map((c) => `${c.exam}: ${c.paperCount} papers (${c.earliestYear || '?'}-${c.latestYear || '?'})`).join('; ') || 'not available in app catalog'}`,
    'Top verified Daily Dose PYQ topics:',
    ...topics.map((item, index) =>
      `${index + 1}. ${item.topic} | ${item.exam} | ${item.questionCount} verified PYQ question(s) | ${item.dayCount} day(s) | years: ${item.years.length ? item.years.join(', ') : 'not tagged'} | days: ${item.days.join(', ')}`,
    ),
  ].join('\n');
}

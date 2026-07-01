import { supabase } from './supabaseService';

export type MissionSnapshot = {
  title?: string;
  priority?: string;
  scraped_label?: string;
  official_source?: {
    title?: string;
    url?: string;
  };
  quick_notes?: Array<{
    title: string;
    detail: string;
  }>;
  bilingual_terms?: Array<{
    en: string;
    local: string;
  }>;
  common_mistakes?: string[];
  mastery_depth?: string;
  structured_mastery?: Array<{
    heading: string;
    content: string;
    importance?: 'high' | 'medium' | 'low';
  }>;
};

export type MissionFlashcard = {
  front: string;
  back: string;
};

export type MissionVideo = {
  title: string;
  url: string;
  summary?: string;
  mnemonic?: string;
  duration_sec?: number;
};

export type MissionQuizQuestion = {
  question: string;
  options: string[];
  answer_index?: number;
  explanation?: string;
  pyq?: {
    year?: number;
    qno?: string;
    exam?: string;
  };
  source?: string;
  note?: string;
};

export type MissionIntroHook = {
  headline?: string;
  story?: string;
  visual_hint?: string;
};

export type MissionQuickNoteCard = {
  title?: string;
  front?: string;
  back?: string;
};

export type MissionRightsGrid = {
  items?: Array<{
    right?: string;
    articles?: string;
    icon?: string;
  }>;
};

export type MissionCaseCard = {
  case?: string;
  core_idea?: string;
  exam_hook?: string;
  source?: string;
};

export type MissionWritMnemonic = {
  mnemonic?: string;
  expanded?: string;
  visual_hint?: string;
};

export type MissionWritScenario = {
  scenario?: string;
  answer?: string;
};

export type MissionTrapCard = {
  trap?: string;
  fix?: string;
};

export type MissionVideoRecommendation = {
  title?: string;
  url?: string;
  why?: string;
  summary?: string;
  mnemonic?: string;
  duration_sec?: number;
};

export type MissionMasteryEnd = {
  badge?: string;
  completion_message?: string;
};

export type MissionLessonPage = {
  title: string;
  type?: 'overview' | 'concept' | 'timeline' | 'table' | 'formula' | 'comparison' | 'facts';
  intro?: string;
  color?: string;
  blocks?: Array<{
    type: 'text' | 'fact_grid' | 'timeline' | 'table' | 'formula' | 'trap' | 'checklist';
    title?: string;
    text?: string;
    items?: Array<{ label?: string; value?: string; detail?: string }>;
    headers?: string[];
    rows?: string[][];
  }>;
};

export type MissionPayload = {
  topic_title?: string;
  snapshot?: MissionSnapshot;
  lesson_pages?: MissionLessonPage[];
  flashcards?: MissionFlashcard[];
  videos?: MissionVideo[];
  quiz?: {
    questions?: MissionQuizQuestion[];
  };
  track?: string;
  day_number?: number;
  ui_flow?: string[];
  intro_hook?: MissionIntroHook;
  quick_note_cards?: MissionQuickNoteCard[];
  rights_grid?: MissionRightsGrid;
  case_cards?: MissionCaseCard[];
  writ_mnemonic_card?: MissionWritMnemonic;
  writ_scenarios?: MissionWritScenario[];
  trap_cards?: MissionTrapCard[];
  video_recommendations?: MissionVideoRecommendation[];
  pyq_quiz?: Array<{
    year?: number;
    question: string;
    options: string[];
    answer_index?: number;
    explanation?: string;
    source?: string;
    note?: string;
  }>;
  mastery_end?: MissionMasteryEnd;
  curriculum_metadata?: {
    ecosystem_tags?: string[];
    yield_category?: 'high_yield' | 'medium_yield' | 'low_yield';
    exam_relevance?: Record<string, number>;
    pyq_frequency?: string;
    weightage?: number;
    revision_priority?: number;
    is_premium?: boolean;
    estimated_time?: string;
    is_long_day?: boolean;
    is_pattern_practice?: boolean;
    time_boxed_sprint?: {
      duration: number;
      type: 'PYQ' | 'Mock';
    };
    spaced_repetition_config?: {
      intervals: number[];
      focus_type: string;
    };
  };
};

export type UserProtocol = {
  user_id: string;
  track_id: string;
  current_day_number: number;
  progress_phase?: number;
  last_unlock_at?: string | null;
};

const TRACK_MAX_DAYS: Record<string, number> = {
  upsc_ecosystem: 100,
  tnpsc_ecosystem: 100,
  ssc_ecosystem: 100,
};

const TRACK_DAILY_QUESTION_TARGETS: Record<string, number> = {
  upsc_ecosystem: 12,
  tnpsc_ecosystem: 12,
  ssc_ecosystem: 25,
};

export function getDailyQuestionTarget(trackId?: string) {
  if (!trackId) return 12;
  return TRACK_DAILY_QUESTION_TARGETS[trackId] || 12;
}

async function getTrackMaxDay(trackId: string) {
  const { data, error } = await supabase
    .from('master_content_vault')
    .select('day_number')
    .eq('track_id', trackId)
    .order('day_number', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.warn('Failed to fetch max day for track:', error);
    return TRACK_MAX_DAYS[trackId];
  }
  return data?.day_number || TRACK_MAX_DAYS[trackId];
}

const normalizeMissionPayload = (payload: MissionPayload): MissionPayload => {
  if (!payload) return payload;
  const normalized: MissionPayload = { ...payload };

  const quickNoteCards = normalized.quick_note_cards || [];
  if ((!normalized.snapshot || !normalized.snapshot.quick_notes) && quickNoteCards.length > 0) {
    normalized.snapshot = {
      ...(normalized.snapshot || {}),
      quick_notes: quickNoteCards.map((card) => ({
        title: card.title || card.front || 'Quick Note',
        detail: card.back || card.front || '',
      })),
    };
  }

  if ((!normalized.flashcards || normalized.flashcards.length === 0) && quickNoteCards.length > 0) {
    normalized.flashcards = quickNoteCards
      .map((card) => ({
        front: card.front || card.title || 'Recall this concept',
        back: card.back || card.front || card.title || '',
      }))
      .filter((card) => card.front.trim().length > 0 && card.back.trim().length > 0);
  }

  if (
    (!normalized.flashcards || normalized.flashcards.length === 0) &&
    normalized.snapshot?.quick_notes &&
    normalized.snapshot.quick_notes.length > 0
  ) {
    normalized.flashcards = normalized.snapshot.quick_notes
      .map((note) => ({
        front: note.title || 'Recall this concept',
        back: note.detail || '',
      }))
      .filter((card) => card.front.trim().length > 0 && card.back.trim().length > 0);
  }

  if (
    normalized.snapshot?.structured_mastery &&
    normalized.snapshot.structured_mastery.length > 0
  ) {
    const existingFronts = new Set((normalized.flashcards || []).map((card) => card.front));
    const structuredCards = normalized.snapshot.structured_mastery
      .map((item) => ({
        front: item.heading || 'Explain this exam concept',
        back: item.content || '',
      }))
      .filter((card) => card.front.trim().length > 0 && card.back.trim().length > 0 && !existingFronts.has(card.front));
    normalized.flashcards = [...(normalized.flashcards || []), ...structuredCards];
  }

  if (
    normalized.trap_cards &&
    normalized.trap_cards.length > 0 &&
    (!normalized.snapshot?.common_mistakes || normalized.snapshot.common_mistakes.length === 0)
  ) {
    normalized.snapshot = {
      ...(normalized.snapshot || {}),
      common_mistakes: normalized.trap_cards.map((trap) => {
        if (trap.trap && trap.fix) return `${trap.trap} — ${trap.fix}`;
        return trap.trap || trap.fix || '';
      }).filter(Boolean),
    };
  }

  if ((!normalized.videos || normalized.videos.length === 0) && normalized.video_recommendations) {
    normalized.videos = normalized.video_recommendations
      .filter((video) => !!video?.url)
      .map((video) => ({
        title: video.title || 'Curated Video',
        url: video.url || '',
        summary: video.summary || video.why,
        mnemonic: video.mnemonic,
        duration_sec: video.duration_sec,
      }));
  }

  const quizQuestions = normalized.quiz?.questions || [];
  const pyqQuestions = (normalized.pyq_quiz || []).map((q) => ({
        question: q.question,
        options: q.options,
        answer_index: q.answer_index,
        explanation: q.explanation,
        source: q.source,
        note: q.note,
        pyq: {
          year: q.year,
        },
      }));

  const seenQuestions = new Set<string>();
  const mergedQuestions = [...quizQuestions, ...pyqQuestions]
    .filter((q) => q?.question && Array.isArray(q.options) && q.options.length >= 2)
    .map((q) => ({
      ...q,
      answer_index:
        typeof q.answer_index === 'number' && q.answer_index >= 0 && q.answer_index < q.options.length
          ? q.answer_index
          : 0,
    }))
    .filter((q) => {
      const key = q.question.trim().toLowerCase();
      if (seenQuestions.has(key)) return false;
      seenQuestions.add(key);
      return true;
    });

  normalized.quiz = {
    questions: mergedQuestions,
  };

  return normalized;
};

const parsePayload = (raw: any): MissionPayload | null => {
  if (!raw) return null;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as MissionPayload;
      return normalizeMissionPayload(parsed);
    } catch (e) {
      console.warn('Failed to parse mission payload JSON:', e);
      return null;
    }
  }
  return normalizeMissionPayload(raw as MissionPayload);
};

export async function getUserProtocol(userId: string): Promise<UserProtocol | null> {
  const { data, error } = await supabase
    .from('user_protocols')
    .select('user_id, track_id, current_day_number, progress_phase, last_unlock_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to load user protocol:', error);
    return null;
  }

  return data || null;
}

export async function getMissionPayload(trackId: string, dayNumber: number) {
  const { data, error } = await supabase
    .from('master_content_vault')
    .select('track_id, day_number, topic_title, content_json')
    .eq('track_id', trackId)
    .eq('day_number', dayNumber)
    .maybeSingle();

  if (error) {
    console.error('Failed to load mission payload:', error);
    return { payload: null, topicTitle: null };
  }

  const payload = parsePayload(data?.content_json);
  return {
    payload,
    topicTitle: data?.topic_title || payload?.topic_title || null,
  };
}

export async function updateProtocolPhase(userId: string, phase: number) {
  const { error } = await supabase
    .from('user_protocols')
    .update({
      progress_phase: phase,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to update protocol phase:', error);
    return false;
  }
  return true;
}

export async function upsertUserProtocol(userId: string, trackId: string) {
  const { data, error } = await supabase
    .from('user_protocols')
    .upsert({
      user_id: userId,
      track_id: trackId,
      current_day_number: 1,
      progress_phase: 1,
      updated_at: new Date().toISOString(),
    })
    .select('user_id, track_id, current_day_number, progress_phase, last_unlock_at')
    .maybeSingle();

  if (error) {
    console.error('Failed to upsert user protocol:', error);
    return null;
  }
  return data as UserProtocol | null;
}

export function getMissionWindowKey(dateInput: Date | string) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return null;
  // Mission unlocks at 6:00 AM daily
  if (date.getHours() < 6) {
    date.setDate(date.getDate() - 1);
  }
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

export function getMissionCountdown(nowInput: Date | string) {
  const now = new Date(nowInput);
  const unlock = new Date(now);
  unlock.setHours(6, 0, 0, 0);
  if (now >= unlock) {
    unlock.setDate(unlock.getDate() + 1);
  }
  const diff = Math.max(0, unlock.getTime() - now.getTime());
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export async function syncProtocolForToday(userId: string, protocol: UserProtocol | null) {
  if (!protocol) return { protocol: null, locked: true };
  const now = new Date();
  const currentWindow = getMissionWindowKey(now);
  const lastWindow = protocol.last_unlock_at ? getMissionWindowKey(protocol.last_unlock_at) : null;

  if (!currentWindow) {
    return { protocol, locked: true };
  }

  if (!lastWindow) {
    // New user or first time accessing mission - unlock immediately
    const { data, error } = await supabase
      .from('user_protocols')
      .update({
        last_unlock_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('user_id', userId)
      .select('user_id, track_id, current_day_number, progress_phase, last_unlock_at')
      .maybeSingle();
    if (error) {
      console.error('Failed to set protocol unlock for new user:', error);
      return { protocol, locked: false };
    }
    return { protocol: (data as UserProtocol) || protocol, locked: false };
  }

  if (currentWindow === lastWindow) {
    return { protocol, locked: false };
  }

  const lastDate = new Date(lastWindow);
  const currentDate = new Date(currentWindow);
  const diffDays = Math.max(0, Math.round((currentDate.getTime() - lastDate.getTime()) / 86400000));
  // Do not skip missed missions. A learner should continue with the next
  // unfinished day, not jump ahead because the app was opened after a gap.
  const rawNextDay = protocol.current_day_number + (diffDays > 0 ? 1 : 0);
  const maxDays = (await getTrackMaxDay(protocol.track_id)) || rawNextDay;
  const nextDayNumber = Math.min(rawNextDay, maxDays);

  const { data, error } = await supabase
    .from('user_protocols')
    .update({
      current_day_number: nextDayNumber,
      progress_phase: 1,
      last_unlock_at: now.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq('user_id', userId)
    .select('user_id, track_id, current_day_number, progress_phase, last_unlock_at')
    .maybeSingle();

  if (error) {
    console.error('Failed to sync protocol day:', error);
    return { protocol, locked: false };
  }

  return { protocol: (data as UserProtocol) || protocol, locked: false };
}

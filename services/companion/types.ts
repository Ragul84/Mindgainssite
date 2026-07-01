import type { SubscriptionTier } from '@/services/rewardService';

export type MascotEmotion =
  | 'idle'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'thinking'
  | 'confused'
  | 'excited'
  | 'listening'
  | 'playful'
  | 'proud'
  | 'speaking'
  | 'neutral'
  | 'teaching'
  | 'encouraging'
  | 'warning'
  | 'waiting'
  | 'sleepy'
  | 'celebrate';

export type StudyChannel = 'app' | 'whatsapp' | 'telegram';

export type GoalProfile = {
  exam: string;
  targetDate?: string;
  sprintDays: number;
  weekdayMinutes: number;
  weekendMinutes: number;
  language: 'English' | 'Tamil' | 'Hinglish' | 'Mix';
  explanationStyle: 'Simple' | 'Normal' | 'Exam-smart';
  defaultSessionTime: number | 'Flexible';
  messagingChannel: 'App only' | 'App+WhatsApp' | 'App+Telegram';
  messagingWindow: 'Morning' | 'Afternoon' | 'Evening' | 'Any';
  phone?: string;
  telegramHandle?: string;
  nightMode: boolean;
  coachStyle: 'Strict' | 'Gentle' | 'Silent';
};

export type MessagingPreference = {
  whatsapp?: {
    enabled: boolean;
    preferredWindows: { start: string; end: string }[];
  };
  telegram?: {
    enabled: boolean;
    preferredWindows: { start: string; end: string }[];
  };
  quietHours?: { start: string; end: string };
};

export type MemorySnapshot = {
  activeCards?: any[]; 
  goal?: GoalProfile;
  today?: DailyPlan;
  preferences?: {
    tone?: 'strict' | 'friendly' | 'drill';
    focusMode?: boolean;
    language?: string;
  };
  messaging?: MessagingPreference;
  streak?: {
    current: number;
    best: number;
    lastActive?: string;
  };
  mastery?: Record<string, { score: number; lastReviewed?: string }>;
  weakTopics?: { topic: string; reason: string; lastSeen: string }[];
  summaryNotes?: string;
  onboardingCompleted?: boolean;
  lastSessions?: Array<{
    topic: string;
    score?: number;
    completedAt: string;
    events?: string[];
  }>;
  activeTopic?: {
    topic: string;
    outlineId: string;
    currentLessonId: string;
    startedAt: string;
    language: string;
  };
};

export type DailyTask = {
  id: string;
  title: string;
  context: string;
  minutes: number;
  channel: StudyChannel[];
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  type: 'lesson' | 'quiz' | 'focus' | 'whatsapp' | 'telegram' | 'reflection';
};

export type DailyPlan = {
  date: string;
  availableMinutes: number;
  tasks: DailyTask[];
};

export type SprintPlan = {
  id: string;
  startDate: string;
  durationDays: number;
  focusTopics: string[];
  structure: Array<{
    day: number;
    objective: string;
    keyTask: string;
  }>;
};

export type MemoryAdapter = {
  hydrate(userId: string): Promise<MemorySnapshot | null>;
  persist(userId: string, snapshot: MemorySnapshot): Promise<void>;
};

export type PlannerInput = {
  userId: string;
  memory: MemorySnapshot;
};

export type PlannerOutput = {
  sprint: SprintPlan;
  today: DailyPlan;
};

export type LearningBlueprint = {
  topic: string;
  blueprint_id: string;
  blueprint_focus: string;
  learning_goal: string;
  prime: {
    duration_seconds: number;
    message: string;
  };
  guided_discovery: {
    type: 'ordering' | 'matching' | 'classification' | 'cause_effect';
    items: Array<{ label: string; hint: string }>;
    feedback_rules: {
      on_wrong: string;
      on_correct: string;
    };
  };
  core_facts: Array<{
    fact: string;
    tag: 'timeline' | 'administration' | 'economy' | 'culture' | 'reform' | 'failure' | string;
  }>;
  checkpoint_quiz: Array<{
    question: string;
    options: string[];
    answer: string;
    why: string;
  }>;
  memory_lock: {
    title: string;
    bullets: string[];
  };
  progression: {
    status_after_completion: 'completed';
    unlocks_next: Array<{
      blueprint_id: string;
      blueprint_focus: string;
    }>;
    resume_hint: string;
  };
};

export type TutorPayload = {
  topic: string;
  focus?: string;
  exam: string;
  language: string;
  progress?: string[];
};

export type TutorResponse = {
  blueprint: LearningBlueprint;
  audio?: {
    url: string;
    transcript: string;
  };
};

export type QuizResult = {
  id: string;
  topic: string;
  total: number;
  correct: number;
  mistakes: Array<{ question: string; explanation: string }>;
};

export type MessengerJob = {
  id: string;
  channel: StudyChannel;
  template: 'morning' | 'focus' | 'retention' | 'streak';
  payload: Record<string, unknown>;
  scheduledFor: string;
};

export type MotivationProfile = {
  tier: SubscriptionTier;
  respondsTo: 'short' | 'analytics' | 'strict';
  lastNudgedAt?: string;
};

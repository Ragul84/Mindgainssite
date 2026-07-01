import { memoryAdapter } from './memory';
import type {
  DailyPlan,
  DailyTask,
  GoalProfile,
  MemorySnapshot,
  PlannerInput,
  PlannerOutput,
  SprintPlan,
} from './types';
import { runRoutedPrompt } from './modelRouter';
import { supabase } from '@/utils/supabase';

const DEFAULT_TASKS: DailyTask[] = [
  {
    id: 'focus-checkin',
    title: 'Focus Shield Check-in',
    context: 'Confirm distractions off & mindset primed.',
    minutes: 5,
    channel: ['app'],
    status: 'pending',
    type: 'focus',
  },
];

function deriveSprintDuration(goal?: GoalProfile): number {
  if (!goal?.targetDate) return goal?.sprintDays ?? 21;
  const target = new Date(goal.targetDate);
  const diff = Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff <= 15) return 15;
  if (diff <= 30) return 30;
  return goal?.sprintDays ?? 21;
}

function deriveFocusTopics(memory?: MemorySnapshot): string[] {
  if (memory?.weakTopics && memory.weakTopics.length > 0) {
    return memory.weakTopics.slice(0, 5).map((w) => w.topic);
  }
  if (memory?.mastery) {
    return Object.entries(memory.mastery)
      .sort((a, b) => a[1].score - b[1].score)
      .slice(0, 5)
      .map(([topic]) => topic);
  }
  return ['Polity Basics', 'Economy Current Affairs', 'History – Modern India'];
}

function buildDefaultSprintPlan(goal: GoalProfile, memory?: MemorySnapshot): SprintPlan {
  const duration = deriveSprintDuration(goal);
  const focusTopics = deriveFocusTopics(memory);
  const structure = Array.from({ length: duration }).map((_, idx) => {
    const topic = focusTopics[idx % focusTopics.length];
    return {
      day: idx + 1,
      objective: `Deepen ${topic}`,
      keyTask: idx % 3 === 0 ? 'Mock quiz + error analysis' : 'Micro-lesson + recall',
    };
  });

  return {
    id: `${goal.exam}-${Date.now()}`,
    startDate: new Date().toISOString(),
    durationDays: duration,
    focusTopics,
    structure,
  };
}

function buildDefaultDailyPlan(goal: GoalProfile, memory?: MemorySnapshot): DailyPlan {
  const weekdayMinutes = goal.weekdayMinutes || 60;
  const weekendMinutes = goal.weekendMinutes || weekdayMinutes;
  const today = new Date();
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;
  const minutes = isWeekend ? weekendMinutes : weekdayMinutes;
  const tasks: DailyTask[] = [
    ...DEFAULT_TASKS,
    {
      id: 'lesson-core',
      title: 'Core Lesson',
      context: 'Tutor-led breakdown of high-leverage topic.',
      minutes: Math.max(20, Math.round(minutes * 0.4)),
      channel: ['app', 'whatsapp'],
      status: 'pending',
      type: 'lesson',
    },
    {
      id: 'quiz-sprint',
      title: 'Retention Quiz',
      context: '3 questions to lock learning.',
      minutes: Math.max(10, Math.round(minutes * 0.2)),
      channel: ['app'],
      status: 'pending',
      type: 'quiz',
    },
    {
      id: 'reflection',
      title: 'Reflection Drop',
      context: 'Share summary with WhatsApp or keep private.',
      minutes: 5,
      channel: ['app', 'whatsapp'],
      status: 'pending',
      type: 'reflection',
    },
  ];

  if (memory?.weakTopics?.length) {
    tasks.splice(1, 0, {
      id: 'weakness-pack',
      title: 'Weak Topic Rescue',
      context: `10-min fix on ${memory.weakTopics[0].topic}`,
      minutes: 10,
      channel: ['app', 'telegram'],
      status: 'pending',
      type: 'lesson',
    });
  }

  return {
    date: today.toISOString().split('T')[0],
    availableMinutes: minutes,
    tasks,
  };
}

async function persistSprint(userId: string, plan: SprintPlan) {
  const { error } = await supabase
    .from('missions')
    .insert({
      user_id: userId,
      title: `Sprint (${plan.durationDays} days)`,
      description: plan.focusTopics.join(', '),
      content_type: 'planning',
      content_summary: `Focus on ${plan.focusTopics.slice(0, 2).join(', ')}`,
      content_text: JSON.stringify(plan.structure),
      subject_name: plan.focusTopics[0],
      estimated_time: plan.durationDays * 60,
      status: 'planning',
      content_analysis: { sprintPlan: plan },
    });

  if (error) {
    console.warn('[Planner] persist sprint failed', error);
  }
}

export const planner = {
  async generate(input: PlannerInput): Promise<PlannerOutput> {
    const memory = input.memory || (await memoryAdapter.hydrate(input.userId)) || {};
    const goal =
      memory.goal ||
      ({
        exam: 'UPSC',
        sprintDays: 21,
        weekdayMinutes: 60,
        weekendMinutes: 90,
        language: 'English',
      } as GoalProfile);

    const sprint = buildDefaultSprintPlan(goal, memory);
    
    // Check if we already have a plan for today in memory
    const todayDate = new Date().toISOString().split('T')[0];
    let daily = memory.today;
    
    if (!daily || daily.date !== todayDate) {
      console.log('[Planner] Generating new daily plan for', todayDate);
      daily = buildDefaultDailyPlan(goal, memory);
    } else {
      console.log('[Planner] Resuming existing daily plan for', todayDate);
    }

    await persistSprint(input.userId, sprint);
    await memoryAdapter.persist(input.userId, {
      ...memory,
      goal,
      today: daily,
      lastSessions: [
        {
          topic: sprint.focusTopics[0],
          completedAt: new Date().toISOString(),
        },
        ...(memory.lastSessions || []).slice(0, 10),
      ],
    });

    return { sprint, today: daily };
  },

  async summarizeDay(userId: string, plan: DailyPlan, notes: string) {
    try {
      const result = await runRoutedPrompt({
        systemPrompt:
          'You are a meticulous study planner summarizing daily progress. Return 2 bullet points.',
        userPrompt: `Plan: ${JSON.stringify(plan)}\nNotes:${notes}`,
        strength: 'cheap',
        maxTokens: 200,
      });

      await memoryAdapter.persist(userId, {
        ...(await memoryAdapter.hydrate(userId)),
        summaryNotes: result,
      });
    } catch (error) {
      console.warn('[Planner] summarizeDay failed', error);
    }
  },
};

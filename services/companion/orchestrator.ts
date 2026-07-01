import { planner } from './planner';
import { memoryAdapter } from './memory';
import { tutor } from './tutor';
import { generateQuiz } from './examiner';
import { messenger } from './messenger';
import { topicOutliner, TopicOutline, TopicLesson } from './topicOutliner';
import { deepLessonGenerator, DeepLesson } from './deepLessonGenerator';
import type {
  DailyPlan,
  GoalProfile,
  MascotEmotion,
  MemorySnapshot,
  TutorPayload,
  LearningBlueprint,
  QuizResult,
  SprintPlan,
} from './types';
import { guru } from './guru';
import { RewardService } from '../rewardService';
import { createMissionPlan } from '@/services/missionService';

type CompanionState = {
  memory: MemorySnapshot;
  sprintPlan?: SprintPlan;
  today?: DailyPlan;
  onboardingStep: number;
  onboardingAnswers: Partial<GoalProfile>;
  emotion: MascotEmotion;
  cards: Array<CompanionCard>;
};

export type CompanionCard =
  | { id: string; type: 'coach'; title: string; body: string; chips?: string[]; suggestionObjects?: Array<{ focus: string; label: string; type: string }> }
  | { id: string; type: 'plan'; plan: DailyPlan }
  | { id: string; type: 'blueprint'; blueprint: LearningBlueprint; status?: 'active' | 'completed' }
  | { id: string; type: 'quiz'; quiz: QuizResult }
  | { id: string; type: 'weakness'; topic: string; reason: string }
  | { id: string; type: 'topicPath'; outline: TopicOutline; currentLessonId: string | null; deepLessons: Record<string, DeepLesson> }
  | { id: string; type: 'messaging'; status: string }
  | { id: string; type: 'focus'; minutes: number }
  | { id: string; type: 'loading'; title: string; body: string; topic?: string; shouldSpeak?: boolean; voiceText?: string };

export class CompanionOrchestrator {
  private state: CompanionState;
  private readonly userId: string;
  private readonly supabase: any;
  private readonly api: any;
  private stateChangeHandler: ((state: { emotion: MascotEmotion; subtitles: string; audio?: string }) => void) | null = null;

  private readonly onboardingPrompts: any[] = [];

  constructor(userId: string, supabase: any, api: any) {
    this.userId = userId;
    this.supabase = supabase;
    this.api = api;
    this.state = {
      memory: {},
      onboardingStep: 0,
      onboardingAnswers: {},
      emotion: 'idle',
      cards: [],
    };
  }

  onStateChange(handler: (state: any) => void) {
    this.stateChangeHandler = handler;
  }

  getSnapshot() {
    return this.state;
  }

  private triggerStateChange(subtitles: string, audio?: string) {
    if (this.stateChangeHandler) {
      this.stateChangeHandler({
        emotion: this.state.emotion,
        subtitles,
        audio
      });
    }
  }

  async hydrate() {
    const memory = (await memoryAdapter.hydrate(this.userId)) || {};
    this.state.memory = memory;
    this.state.cards = (memory.activeCards || []).filter(c => c.type !== 'loading' && c.type !== 'error');
    
    // RESTORE: If we have an active topic but no card, try to recover or prompt
    if (memory.activeTopic && !this.state.cards.some(c => c.type === 'topicPath')) {
       console.log('[Orchestrator] Found active topic in memory but no card. Adding recovery card.');
       this.state.cards.unshift({
         id: `recovery-${Date.now()}`,
         type: 'coach',
         title: 'Resuming Session',
         body: `We were working on **${memory.activeTopic.topic}**. Ready to continue?`,
         chips: ['Continue'] // Logic in mascot.tsx needs to handle this
       });
    }
    
    const hasGoal = Boolean(memory.goal);
    const isFinished = Boolean(memory.onboardingCompleted);
    
    console.log('[Orchestrator] Hydrating. hasGoal:', hasGoal, 'isFinished:', isFinished, 'cards:', this.state.cards.length);

    if (!hasGoal && !isFinished) {
      // ... same default goal logic ...
      const defaultGoal: GoalProfile = {
        exam: 'UPSC',
        sprintDays: 30,
        weekdayMinutes: 60,
        weekendMinutes: 120,
        language: 'English',
        explanationStyle: 'Exam-smart',
        defaultSessionTime: 'Flexible',
        messagingChannel: 'App only',
        messagingWindow: 'Morning',
        phone: '',
        telegramHandle: '',
        nightMode: true,
        coachStyle: 'Gentle',
      };
      
      this.state.memory.goal = defaultGoal;
      this.state.memory.onboardingCompleted = true;
      this.state.onboardingStep = 0;
      
      await this.persistState();
    } else {
      if (this.state.cards.length === 0) {
        await this.buildDailyPlan();
      }
      await this.checkSmartReminders();
      await this.persistState(); // Save reminders
    }
  }

  async init() {
    await this.hydrate();
  }

  async sendLiveMessage(message: string, mode: 'tutor' | 'story' = 'tutor') {
    this.state.emotion = 'thinking';
    this.triggerStateChange('Thinking...');

    try {
      let fullText = '';
      await this.api.streamChat(
        this.userId,
        [{ role: 'user', content: message }],
        'chat',
        (token: string) => {
          fullText += token;
          this.triggerStateChange(fullText);
        },
        async (finalText: string) => {
          this.state.emotion = 'happy';
          const audio = await this.api.getTTS(finalText);
          this.triggerStateChange(finalText, audio);
        },
        (err: any) => {
          console.error('Live Message Error:', err);
          this.state.emotion = 'warning';
          this.triggerStateChange('Neural Lag... try again?');
        }
      );
      return { text: fullText };
    } catch (e) {
      this.state.emotion = 'warning';
      this.triggerStateChange('Connection lost.');
      throw e;
    }
  }

  private async persistState() {
    await memoryAdapter.persist(this.userId, {
      ...this.state.memory,
      activeCards: this.state.cards
    });
  }

  private async checkSmartReminders() {
    // 1. Topic Left Reminder
    const lastSession = this.state.memory.lastSessions?.[this.state.memory.lastSessions.length - 1];
    const hoursSinceLast = lastSession
      ? (Date.now() - new Date(lastSession.completedAt).getTime()) / (1000 * 60 * 60)
      : 999;

    // Check if reminder already exists to avoid duplicates
    const hasTopicReminder = this.state.cards.some(c => c.id.startsWith('reminder-topic-'));
    const hasTimingReminder = this.state.cards.some(c => c.id.startsWith('reminder-timing-'));

    if (hoursSinceLast > 12 && lastSession && !hasTopicReminder) {
      const topic = lastSession.topic.split(':')[0]; // Clean topic name
      this.state.cards.unshift({
        id: `reminder-topic-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: 'coach',
        title: '🐺 Pick up the pace?',
        body: `It's been a while since we touched **${topic}**. Ready to unlock the next dimension?`,
        chips: ['Resume Dimension', 'Start New']
      });
    }

    // 2. Session Timing Reminder (Peak mode)
    const currentHour = new Date().getHours();
    if (currentHour >= 19 && currentHour <= 23 && !hasTimingReminder) {
      this.state.cards.unshift({
        id: `reminder-timing-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: 'coach',
        title: '🌙 Peak Retention Mode',
        body: 'The evening window is your brain\'s best time for deep encoding. Shall we tackle one Blueprint?',
        chips: ['20-min Session', 'Maybe later']
      });
    }
  }

  private pushOnboardingCard() {
    const config = this.onboardingPrompts.find((q) => q.step === this.state.onboardingStep);
    if (!config) return;
    this.state.cards = [
      {
        id: `onboard-${config.step}`,
        type: 'coach',
        title: config.title,
        body: 'Pick one to proceed.',
        chips: config.options,
      },
    ];
  }

  public async buildDailyPlan() {
    this.state.emotion = 'thinking';
    try {
      // 1. Generate the actual Roadmap via Planner
      const plan = await planner.generate({ userId: this.userId, memory: this.state.memory });
      this.state.sprintPlan = plan.sprint;
      this.state.today = plan.today;

      // 2. Populate cards (Preserve active blueprints AND topic paths)
      const currentBlueprints = this.state.cards.filter(c => c.type === 'blueprint');
      const currentTopicPaths = this.state.cards.filter(c => c.type === 'topicPath');
      
      this.state.cards = [
        ...currentTopicPaths,
        ...currentBlueprints,
        {
          id: 'daily-plan-card',
          type: 'plan',
          plan: plan.today
        }
      ];
      await this.persistState();
    } catch (error) {
      console.warn('[Orchestrator] buildDailyPlan failed, using fallbacks', error);
      this.state.cards = [
        {
          id: 'goal-summary',
          type: 'coach',
          title: `${this.state.memory.goal?.exam} Path`,
          body: 'Ready to continue your journey?',
          chips: ['Continue Sprint']
        }
      ];
    } finally {
      this.state.emotion = 'idle';
    }
  }

  getCards() {
    return this.state.cards;
  }

  getEmotion() {
    return this.state.emotion;
  }

  hasGoal() {
    return Boolean(this.state.memory.goal);
  }

  async answerOnboarding(step: number, value: string) {
    if (step === 1) this.state.onboardingAnswers.exam = value;
    if (step === 2) this.state.onboardingAnswers.targetDate = value;
    if (step === 3) this.state.onboardingAnswers.explanationStyle = value as any;
    if (step === 4) this.state.onboardingAnswers.language = value as any;
    if (step === 5) this.state.onboardingAnswers.defaultSessionTime = value === 'Flexible' ? 'Flexible' : parseInt(value, 10);
    if (step === 6) {
      this.state.onboardingAnswers.messagingChannel = value as any;
      if (value === 'App only') {
        await this.finalizeGoal();
        return;
      }
      this.state.onboardingStep = 7;
      this.pushOnboardingCard();
      return;
    }

    if (step === 7) {
      if (this.state.onboardingAnswers.messagingChannel === 'App+WhatsApp') {
        this.state.onboardingAnswers.phone = value;
      } else {
        this.state.onboardingAnswers.telegramHandle = value;
      }
      await this.finalizeGoal();
      return;
    }

    if (step === 0) return; // Prevent loop

    this.state.onboardingStep = step + 1;
    this.pushOnboardingCard();
  }

  private async finalizeGoal() {
    const goal: GoalProfile = {
      exam: this.state.onboardingAnswers.exam || 'UPSC',
      targetDate: this.state.onboardingAnswers.targetDate,
      sprintDays: 21,
      weekdayMinutes: 60,
      weekendMinutes: 90,
      language: this.state.onboardingAnswers.language || 'English',
      explanationStyle: this.state.onboardingAnswers.explanationStyle || 'Normal',
      defaultSessionTime: this.state.onboardingAnswers.defaultSessionTime || 20,
      messagingChannel: this.state.onboardingAnswers.messagingChannel || 'App only',
      messagingWindow: 'Any',
      phone: this.state.onboardingAnswers.phone,
      telegramHandle: this.state.onboardingAnswers.telegramHandle,
      nightMode: true,
      coachStyle: 'Gentle',
    };
    
    this.state.memory.goal = goal;
    this.state.memory.onboardingCompleted = true;
    
    console.log('[Orchestrator] Finalizing goal for', this.userId);
    await memoryAdapter.persist(this.userId, { 
      ...this.state.memory, 
      goal, 
      onboardingCompleted: true 
    });
    
    this.state.emotion = 'proud';
    this.state.cards = [
      {
        id: 'onboard-finish',
        type: 'coach',
        title: 'Your Guru is Ready 🧘',
        body: 'I have mapped your exam syllabus and synchronized your memory. Your high-performance learning path is ready.',
        chips: ['Begin Journey'],
      },
    ];
    this.state.onboardingStep = 0;
    
    // Proactive event log (Native Guru)
    console.log('[Orchestrator] Onboarding complete for user', this.userId);
    // await emitMemuEvent(this.userId, 'onboarding_complete', { goal }); 
    
    // In Native Guru, we trigger the first plan immediately
    await this.buildDailyPlan();
  }

  getOnboardingStep() {
    return this.state.onboardingStep;
  }

  async requestLesson(topic: string, focus?: string) {
    this.state.emotion = 'thinking';
    try {
      // 1. Check Tier Limits
      const check = await RewardService.canUnlockLesson();
      if (!check.allowed) {
        this.state.emotion = 'warning';
        this.state.cards.unshift({
          id: `limit-${Date.now()}`,
          type: 'coach',
          title: 'Daily Limit Reached 🐺',
          body: `You've unlocked ${check.total} blueprints today (Free tier). Ready to go Pro for unlimited deep dives?`,
          chips: ['Upgrade to Pro', 'Maybe later']
        });
        return;
      }

      // 2. Loading state
      const tempId = `loading-${Date.now()}`;
      this.state.cards.unshift({
        id: tempId,
        type: 'loading',
        title: `Formulating Dimension: ${topic}`,
        body: focus ? `Focusing on ${focus}...` : 'Diving into the core dimensions...',
        topic: topic
      });

      // 3. Fetch Blueprint from Tutor Engine
      const res = await tutor.generate({
        topic,
        focus,
        exam: this.state.memory.goal?.exam || 'UPSC',
        language: this.state.memory.goal?.language || 'English',
        progress: this.state.memory.lastSessions?.map(s => s.topic)
      });

      // 4. Update UI with the Blueprint Card
      this.state.cards = this.state.cards.filter(c => c.id !== tempId);
      
      this.state.cards.unshift({
        id: `blueprint-${Date.now()}`,
        type: 'blueprint',
        blueprint: res.blueprint,
        status: 'active'
      });

      this.state.emotion = 'teaching';
      
      // Update usage count for limits
      await RewardService.updateLessonProgress(res.blueprint.blueprint_id, 'unlocked');
      await memoryAdapter.persist(this.userId, this.state.memory);

    } catch (error) {
      console.warn('[Orchestrator] requestLesson failed', error);
      this.state.emotion = 'warning';
      this.state.cards.unshift({
        id: `error-${Date.now()}`,
        type: 'coach',
        title: 'Neural Lag',
        body: `I couldn't map out that topic right now. Let's try again?`,
        chips: ['Retry']
      });
    }
  }

  /**
   * New Topic-First Architecture: Generate full topic path
   * 1. Generate topic outline (5-8 lessons)
   * 2. Display all lessons in My Path
   * 3. Generate first lesson content
   * 4. Background-generate remaining lessons as user progresses
   */
  async requestTopicPath(topic: string, language: string = 'English', onProgress?: (p: number) => void) {
    this.state.emotion = 'thinking';
    if (onProgress) onProgress(5);
    
    try {
      // 0. Check for incomplete lessons first
      /* 
      const incompletePath = this.state.cards.find(c => c.type === 'topicPath');
      
      if (incompletePath) {
        this.state.emotion = 'encouraging';
        this.state.cards.unshift({
          id: `incomplete-reminder-${Date.now()}`,
          type: 'coach',
          title: '📚 You Have an Ongoing Lesson',
          body: `You're currently learning "${(incompletePath as any).outline.topic}". Would you like to complete it first or start a new topic?`,
          chips: ['Continue Current', 'Start New Topic'],
          shouldSpeak: false,
          voiceText: `You have an ongoing lesson on ${(incompletePath as any).outline.topic}. Would you like to continue or start a new topic?`
        } as any);
        if (onProgress) onProgress(0);
        return null;
      }
      */
      
      console.log('[MISSION CONTROL] Initializing Mission for:', topic);
      
      // 1. Check Tier Limits
      const check = await RewardService.canUnlockLesson();
      if (!check.allowed) {
        this.state.emotion = 'warning';
        this.state.cards.unshift({
          id: `limit-${Date.now()}`,
          type: 'coach',
          title: 'Daily Limit Reached 🐺',
          body: `You've unlocked ${check.total} topics today (Free tier). Ready to go Pro for unlimited deep dives?`,
          chips: ['Upgrade to Pro', 'Maybe later']
        });
        if (onProgress) onProgress(0);
        return null;
      }

      if (onProgress) onProgress(15);

      // 2. Loading state with voice feedback
      const tempId = `loading-path-${Date.now()}`;
      this.state.emotion = 'teaching';
      this.state.cards.unshift({
        id: tempId,
        type: 'loading',
        title: `Preparing your lesson...`,
        body: `Please hop on while I prepare the lesson for ${topic}`,
        topic: topic,
        shouldSpeak: false,
        voiceText: `Please hop on while I prepare the lesson for ${topic}`
      });

      // 3. Generate Topic Outline (5-8 lessons)
      const exam = this.state.memory.goal?.exam || 'UPSC';
      console.log('[Orchestrator] requestTopicPath called with topic:', topic);
      
      if (onProgress) onProgress(30);

      // Wrapper for timeout/hang protection
      const withTimeout = (promise: Promise<any>, timeoutMs: number, label: string) => {
        return Promise.race([
          promise,
          new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs))
        ]);
      };

      console.log('[Orchestrator] Calling topicOutliner.generate');
      const outline = await withTimeout(topicOutliner.generate(topic, exam), 45000, 'Topic Outline Generator');
      console.log('[Orchestrator] Generated outline successfully');

      if (onProgress) onProgress(50);

      // 4. Generate first lesson content (deep lesson)
      const firstLesson = outline.lessons[0];
      console.log('[Orchestrator] Generating first lesson:', firstLesson.title, 'in', language);
      
      if (onProgress) onProgress(65);
      const deepLesson = await withTimeout(deepLessonGenerator.generate(topic, firstLesson, exam, language), 90000, 'Deep Lesson Generator');
      console.log('[Orchestrator] Generated first lesson successfully');

      if (onProgress) onProgress(85);

      // Mark all lessons in outline as AI-owned
      outline.lessons = outline.lessons.map((l: any) => ({ ...l, isAI: true }));

      // 5. Remove loading, add topic path card
      this.state.cards = this.state.cards.filter(c => c.id !== tempId);
      
      const pathCard = {
        id: `topicPath-${Date.now()}`,
        type: 'topicPath' as const,
        outline,
        currentLessonId: firstLesson.id,
        deepLessons: {
          [firstLesson.id]: deepLesson
        }
      };
      
      // Ensure no other topicPaths exist
      this.state.cards = this.state.cards.filter(c => c.type !== 'topicPath');
      this.state.cards.unshift(pathCard);
      this.state.emotion = 'teaching';

      // 6. Save to memory for resume capability
      this.state.memory.activeTopic = {
        topic,
        outlineId: pathCard.id,
        currentLessonId: firstLesson.id,
        startedAt: new Date().toISOString(),
        language
      };
      
      if (onProgress) onProgress(95);
      await RewardService.updateLessonProgress(outline.lessons[0].id, 'unlocked');
      await this.persistState();
      
      if (onProgress) onProgress(100);
      console.log('[Orchestrator] requestTopicPath completed successfully');
      return { outline, firstLesson: deepLesson };

    } catch (error) {
      console.error('[Orchestrator] requestTopicPath failed:', error);
      
      // Remove loading card
      const loadingCard = this.state.cards.find(c => c.type === 'loading');
      if (loadingCard) {
        this.state.cards = this.state.cards.filter(c => c.id !== loadingCard.id);
      }
      
      // Show error card
      this.state.emotion = 'warning';
      this.state.cards.unshift({
        id: `error-${Date.now()}`,
        type: 'coach',
        title: '⚠️ Generation Failed',
        body: `I couldn't generate the lesson for "${topic}" right now. The AI service might be overloaded. Please try again in a moment.`,
        chips: ['Retry', 'Try Different Topic'],
        shouldSpeak: true,
        voiceText: `Sorry, I couldn't generate the lesson for ${topic}. Please try again.`
      } as any);
      
      
      return null;
    }
  }

  /**
   * Generate next lesson in background
   */
  async generateNextLesson(pathCardId: string, lessonToGenerate: TopicLesson) {
    const pathCard = this.state.cards.find(c => c.id === pathCardId && c.type === 'topicPath');
    if (!pathCard || pathCard.type !== 'topicPath') return null;

    try {
      const exam = this.state.memory.goal?.exam || 'UPSC';
      const language = this.state.memory.activeTopic?.language || 'English';
      const deepLesson = await deepLessonGenerator.generate(pathCard.outline.topic, lessonToGenerate, exam, language);
      
      // Update the card with new lesson content
      pathCard.deepLessons[lessonToGenerate.id] = deepLesson;
      
      console.log('[Orchestrator] Background-generated lesson:', lessonToGenerate.title);
      return deepLesson;
    } catch (error) {
      console.warn('[Orchestrator] Background lesson generation failed:', error);
      return null;
    }
  }

  /**
   * Mark lesson as complete and unlock next
   */
  async completeLesson(pathCardId: string, lessonId: string) {
    const pathCard = this.state.cards.find(c => c.id === pathCardId && c.type === 'topicPath');
    if (!pathCard || pathCard.type !== 'topicPath') return;

    // Find and update lesson status
    const lesson = pathCard.outline.lessons.find(l => l.id === lessonId);
    if (lesson) {
      lesson.status = 'completed';
    }

    // Unlock next lesson
    const nextLessonIndex = pathCard.outline.lessons.findIndex(l => l.id === lessonId) + 1;
    if (nextLessonIndex < pathCard.outline.lessons.length) {
      const nextLesson = pathCard.outline.lessons[nextLessonIndex];
      nextLesson.status = 'pending';
      pathCard.currentLessonId = nextLesson.id;
      
      // Start background generation if not already done
      if (!pathCard.deepLessons[nextLesson.id]) {
        this.generateNextLesson(pathCardId, nextLesson);
      }
    }

    // Award XP
    const xp = await RewardService.awardBlueprintXP(this.userId, `${pathCard.outline.topic}:${lessonId}`);
    
    this.state.emotion = 'proud';
    await memoryAdapter.persist(this.userId, this.state.memory);
  }

  async completeBlueprint(blueprint: LearningBlueprint) {
    this.state.emotion = 'proud';
    const xp = await RewardService.awardBlueprintXP(this.userId, blueprint.topic);
    
    // Log completion in memory
    this.state.memory.lastSessions = [
      ...(this.state.memory.lastSessions || []),
      { topic: `${blueprint.topic}: ${blueprint.blueprint_focus}`, completedAt: new Date().toISOString() }
    ].slice(-20); // Keep more history now

    await RewardService.updateLessonProgress(blueprint.blueprint_id, 'completed', xp);
    await memoryAdapter.persist(this.userId, this.state.memory);

    // Update card status to completed
    this.state.cards = this.state.cards.map(c => {
      if (c.type === 'blueprint' && c.blueprint.blueprint_id === blueprint.blueprint_id) {
        return { ...c, status: 'completed' };
      }
      return c;
    });

    await RewardService.updateLessonProgress(blueprint.blueprint_id, 'completed', xp);
    await this.persistState();
  }

  async requestQuiz(topic: string) {
    this.state.emotion = 'thinking';
    const quiz = await generateQuiz(topic, this.state.memory.goal?.exam || 'UPSC');
    this.state.cards.unshift({ id: quiz.id, type: 'quiz', quiz });
    this.state.emotion = 'encouraging';
    const weakTopics = this.state.memory.weakTopics || [];
    if (quiz.mistakes.length > 0) {
      weakTopics.unshift({
        topic,
        reason: quiz.mistakes[0].explanation,
        lastSeen: new Date().toISOString(),
      });
      this.state.memory.weakTopics = weakTopics.slice(0, 10);
      await memoryAdapter.persist(this.userId, this.state.memory);
    }
  }

  async toggleFocusMode(enable: boolean) {
    if (enable) {
      this.state.emotion = 'teaching';
      this.state.cards.unshift({
        id: 'focus-mode',
        type: 'focus',
        minutes: 45,
      });
    } else {
      this.state.emotion = 'proud';
    }
  }

  async scheduleMessenger(template: 'morning' | 'focus' | 'retention' | 'streak') {
    await messenger.sendDrop(this.userId, 'whatsapp', template);
    this.state.cards.unshift({
      id: `msg-${Date.now()}`,
      type: 'messaging',
      status: `Scheduled ${template} drop`,
    });
  }

  async logTaskCompletion(taskId: string) {
    if (!this.state.today) return;

    // 1. Update task status in memory
    const taskIndex = this.state.today.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      this.state.today.tasks[taskIndex].status = 'completed';
      console.log('[Orchestrator] Task marked completed:', taskId);

      // 2. Update the Plan card in the UI list if it exists
      const planCardIndex = this.state.cards.findIndex(c => c.type === 'plan');
      if (planCardIndex !== -1) {
        this.state.cards[planCardIndex] = {
          id: 'daily-plan-card',
          type: 'plan',
          plan: { ...this.state.today }
        };
      }

      // 3. Persist progress
      await planner.summarizeDay(
        this.userId,
        this.state.today,
        `Task ${this.state.today.tasks[taskIndex].title} completed.`
      );
      
      this.state.emotion = 'proud';
    }
  }

  async sendReflection(notes: string) {
    await memoryAdapter.persist(this.userId, {
      ...this.state.memory,
      summaryNotes: notes,
    });
    await this.scheduleMessenger('retention');
  }

  async resetTopicPath() {
    console.log('[Orchestrator] Resetting topic path for user:', this.userId);
    
    // 1. Clear from memory
    this.state.memory.activeTopic = undefined;
    
    // 2. Remove topicPath cards from UI state
    this.state.cards = this.state.cards.filter(c => c.type !== 'topicPath');
    
    // 3. Clear recovery cards if any
    this.state.cards = this.state.cards.filter(c => !c.id.startsWith('recovery') && !c.id.startsWith('incomplete-reminder'));

    this.state.emotion = 'idle';
    
    // 4. Persist
    await memoryAdapter.persist(this.userId, this.state.memory);
    await this.persistState();
    
    console.log('[Orchestrator] Path reset completed.');
  }

  async resumeSession() {
    const active = this.state.memory.activeTopic;
    if (!active) return;
    
    console.log('[Orchestrator] Resuming session for:', active.topic);
    
    // Remove recovery card
    this.state.cards = this.state.cards.filter(c => !c.id.startsWith('recovery') && !c.id.startsWith('incomplete-reminder'));
    
    // Re-trigger path generation
    // Ideally we would load from a 'topic_states' table, but for now we regenerate
    // and rely on the fact that if it's the same topic, it's "resuming"
    await this.requestTopicPath(active.topic);
  }

  async getBlueprintQuota() {
    return { allowed: true, tier: 'free' };
  }

  async getChatQuota() {
    return { allowed: true, tier: 'free' };
  }

  getCurrentTopicId() {
    return this.state.memory.activeTopic?.topic || null;
  }

  destroy() {
    this.stateChangeHandler = null;
  }
}

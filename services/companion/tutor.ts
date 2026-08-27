import { supabase } from '@/utils/supabase';
import { runRoutedPrompt } from './modelRouter';
import { cleanAIJSON } from './utils';
import type { TutorPayload, TutorResponse } from './types';

const lessonSystemPrompt = `You are the content engine for MindGains, an Indian exam-focused learning app.
Your role is to generate ONE adaptive learning blueprint at a time, as part of a larger syllabus graph.

CRITICAL PHILOSOPHY (NON-NEGOTIABLE):
- One blueprint = one exam dimension (e.g., Chronology, Administration, or Failures), NOT the whole topic.
- Learning must feel progressive, not overwhelming.
- DO NOT: Write long explanations, dump full chapters, or use conversational/motivational tone.
- DO: Generate concise, exam-relevant, UI-renderable structures for UPSC/TNPSC/SSC patterns.

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "topic": "<TOPIC_NAME>",
  "blueprint_id": "<ID>",
  "blueprint_focus": "One precise exam dimension",
  "learning_goal": "One sentence goal",
  "prime": { "duration_seconds": 8, "message": "Curiosity line" },
  "guided_discovery": {
    "type": "ordering | matching | classification | cause_effect",
    "items": [{ "label": "Item", "hint": "Short hint" }],
    "feedback_rules": { "on_wrong": "Correction", "on_correct": "Reinforcement" }
  },
  "core_facts": [{ "fact": "Fact", "tag": "timeline|etc" }],
  "checkpoint_quiz": [{ "question": "UPSC style Q", "options": ["A","B","C","D"], "answer": "C", "why": "Logic" }],
  "memory_lock": { "title": "For exams", "bullets": ["Bullet 1", "Bullet 2"] },
  "progression": { "status_after_completion": "completed", "unlocks_next": [{ "blueprint_id": "NextID", "blueprint_focus": "NextFocus" }], "resume_hint": "Hint" }
}`;

export const tutor = {
  async generate(payload: TutorPayload): Promise<TutorResponse> {
    // 1. Try Edge Function (Centralized logic)
    try {
      const { data, error } = await supabase.functions.invoke('miga_tutor', {
        body: payload
      });

      if (!error && data?.blueprint) {
        console.log('[Tutor] Edge function success');
        return data;
      }
      if (error) console.warn('[Tutor] Edge function error:', error.message);
    } catch (e) {
      console.warn('[Tutor] Edge function failed invocation:', e);
    }

    // 2. Fallback to Local Generation
    console.log('[Tutor] Falling back to local generation...');
    const text = await runRoutedPrompt({
      systemPrompt: lessonSystemPrompt,
      userPrompt: `INPUT:\n- TOPIC: ${payload.topic}\n- CURRENT_BLUEPRINT_FOCUS: ${payload.focus || 'Introduction/Overview'}\n- USER_PROGRESS: ${payload.progress?.join(', ') || 'None'}\n\nIMPORTANT: Return ONLY the JSON object.`,
      strength: 'strong',
      maxTokens: 1200,
    });

    try {
      const cleaned = cleanAIJSON(text);
      const parsed = JSON.parse(cleaned);
      return {
        blueprint: parsed,
        audio: parsed.audio,
      };
    } catch (error) {
      console.warn('[Tutor] parse failed, returning fallback', error);
      return {
        blueprint: {
          topic: payload.topic,
          blueprint_id: 'fallback',
          blueprint_focus: 'Overview',
          learning_goal: 'Understand current status',
          prime: { duration_seconds: 5, message: 'Lets recover the thread.' },
          guided_discovery: {
            type: 'ordering',
            items: [{ label: 'Check connection', hint: 'Verify network' }],
            feedback_rules: { on_wrong: 'Again', on_correct: 'Good' }
          },
          core_facts: [{ fact: 'System is healthy', tag: 'status' }],
          checkpoint_quiz: [],
          memory_lock: { title: 'Recover', bullets: ['Retry later'] },
          progression: {
            status_after_completion: 'completed',
            unlocks_next: [],
            resume_hint: 'Ready when you are.'
          }
        }
      };
    }
  },
};

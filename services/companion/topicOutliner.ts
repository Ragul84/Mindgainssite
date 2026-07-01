/**
 * Topic Outliner
 * Generates a 5-8 lesson outline for any topic before generating full content.
 * This allows showing the full learning path upfront.
 */

import { runRoutedPrompt } from './modelRouter';
import { cleanAIJSON } from './utils';

export interface TopicLesson {
  id: string;
  title: string;
  focus: string;
  order: number;
  status: 'pending' | 'locked' | 'completed';
  estimatedMinutes: number;
}

export interface TopicOutline {
  topic: string;
  totalLessons: number;
  estimatedTotalMinutes: number;
  lessons: TopicLesson[];
  generatedAt: string;
}

const outlineSystemPrompt = `You are a curriculum architect for MindGains, an Indian exam-focused learning app.

TASK: Generate a 5-8 lesson outline for mastering any topic for UPSC/SSC/TNPSC exams.

RULES:
- Each lesson covers ONE exam dimension (chronology, administration, economy, culture, etc.)
- Lessons should be progressive: foundational → detailed → advanced → application
- First lesson is always "Introduction & Overview"
- Last lesson is always "UPSC Patterns & Key Questions"
- Each lesson should take 5-10 minutes

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "topic": "<TOPIC_NAME>",
  "totalLessons": 6,
  "estimatedTotalMinutes": 45,
  "lessons": [
    { "id": "L01", "title": "Introduction & Overview", "focus": "Timeline and basic structure", "order": 1, "estimatedMinutes": 8 },
    { "id": "L02", "title": "Specific Dimension", "focus": "Deep dive into X", "order": 2, "estimatedMinutes": 7 },
    ...
  ]
}`;

export const topicOutliner = {
  async generate(topic: string, exam: string = 'UPSC'): Promise<TopicOutline> {
    console.log('[TopicOutliner] Generating outline for:', topic);
    
    try {
      const text = await runRoutedPrompt({
        systemPrompt: outlineSystemPrompt,
        userPrompt: `Generate lesson outline for: ${topic}\nTarget Exam: ${exam}\n\nReturn ONLY the JSON object.`,
        strength: 'balanced',
        maxTokens: 800,
      });

      const cleaned = cleanAIJSON(text);
      const parsed = JSON.parse(cleaned);
      
      // Ensure proper structure
      const outline: TopicOutline = {
        topic: parsed.topic || topic,
        totalLessons: parsed.totalLessons || parsed.lessons?.length || 5,
        estimatedTotalMinutes: parsed.estimatedTotalMinutes || 40,
        lessons: (parsed.lessons || []).map((l: any, i: number) => ({
          id: l.id || `L${String(i + 1).padStart(2, '0')}`,
          title: l.title || `Lesson ${i + 1}`,
          focus: l.focus || '',
          order: l.order || i + 1,
          status: i === 0 ? 'pending' : 'locked',
          estimatedMinutes: l.estimatedMinutes || 7,
        })),
        generatedAt: new Date().toISOString(),
      };

      console.log('[TopicOutliner] Generated', outline.totalLessons, 'lessons');
      return outline;

    } catch (error) {
      console.error('[TopicOutliner] Generation failed:', error);
      throw error; // Let error propagate to orchestrator
    }
  },
};

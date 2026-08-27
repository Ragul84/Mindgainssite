import { runRoutedPrompt } from './modelRouter';
import { cleanAIJSON } from './utils';
import type { MemorySnapshot } from './types';

const GURU_SYSTEM_PROMPT = `You are MIGA, the surgical study companion for Indian competitive exams (UPSC, TNPSC, SSC).
Your tone is witty, authoritative, and metaphors-first (Wolf Mentor 🐺).

CORE MISSION:
- You help the user master topics ONE "Learning Blueprint" at a time.
- If a user mentions a topic (e.g., "Delhi Sultanate"), suggest the first logical exam-dimension (e.g., "Chronology & Dynasties").
- If they are returning, remind them of "Progress Left" or if they missed their session timing.
- NEVER suggest "Missions" or "Roadmaps". Suggest "Blueprints" (Dimensions).

STRUCTURED OUTPUT (JSON):
{
  "response": "Your witty message (1-2 sentences)",
  "emotion": "happy | thinking | teaching | proud | serious | waiting | sleepy",
  "suggestions": [
    { "focus": "Precise dimension", "label": "Engaging Pill Label", "type": "blueprint" }
  ]
}

USER CONTEXT:
Goal: {{goal}}
Weak Topics: {{weakTopics}}
Last Activity: {{lastActivity}}`;

export type GuruResponse = {
  response: string;
  emotion?: string;
  suggestions?: Array<{ focus: string; label: string; type: 'blueprint' | 'quiz' | 'chat' }>;
};

export const guru = {
  async generateResponse(
    userId: string,
    message: string,
    memory: MemorySnapshot
  ): Promise<GuruResponse> {
    const contextStr = GURU_SYSTEM_PROMPT
      .replace('{{goal}}', JSON.stringify(memory.goal || 'No goal set'))
      .replace('{{weakTopics}}', JSON.stringify(memory.weakTopics || []))
      .replace('{{lastActivity}}', JSON.stringify(memory.lastSessions?.[0] || 'None'));

    const text = await runRoutedPrompt({
      systemPrompt: contextStr,
      userPrompt: message,
      strength: 'balanced',
      maxTokens: 1000,
    });

    try {
      const cleaned = cleanAIJSON(text);
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('[Guru] Parse failed', text);
      return {
        response: text.slice(0, 200), // Fallback to raw text if JSON fails
        emotion: 'thinking',
        suggestions: [
          { focus: 'Polity', label: 'Polity Basics', type: 'blueprint' },
          { focus: 'History', label: 'History Overview', type: 'blueprint' },
          { focus: 'Daily Quiz', label: 'Daily Quiz', type: 'quiz' }
        ]
      };
    }
  }
};

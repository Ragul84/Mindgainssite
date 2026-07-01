/**
 * Blueprint Lesson Generator
 * Structured, exam-grade lesson flow with mandatory interactions.
 */

import { runRoutedPrompt } from './modelRouter';
import { cleanAIJSON } from './utils';
import type { TopicLesson } from './topicOutliner';

export type BlueprintBlock =
  | {
      blockId: string;
      type: 'concept_build';
      title: string;
      content: string[];
      sections?: Array<{
        title: string;
        bullets: string[];
      }>;
      compare?: {
        leftTitle: string;
        rightTitle: string;
        rows: Array<{ left: string; right: string }>;
      };
      flow?: {
        title?: string;
        steps: string[];
      };
      timeline?: {
        title?: string;
        items: Array<{ year: string; note: string }>;
      };
      keyUnderstanding?: string[];
      deepFocus?: string[];
      clarityLayer?: string[];
      unlockCondition?: string;
    }
  | {
      blockId: string;
      type: 'checkpoint_quiz';
      question: string;
      options: string[];
      answer: string;
      explanation: string;
    }
  | {
      blockId: string;
      type: 'interactive_match';
      instruction: string;
      pairs: Array<{ left: string; right: string }>;
    }
  | {
      blockId: string;
      type: 'analytical_question';
      question: string;
      expectedPoints: string[];
    }
  | {
      blockId: string;
      type: 'prelims_mcq';
      question: string;
      options: string[];
      answer: string;
      explanation: string;
    }
  | {
      blockId: string;
      type: 'mains_practice';
      question: string;
      wordLimit: number;
    }
  | {
      blockId: string;
      type: 'final_consolidation';
      summaryPoints: string[];
    };

export interface DeepLesson {
  lessonId: string;
  topic: string;
  title: string;
  focus: string;
  timeline?: string;
  hook?: string;
  mode: 'sequential_unlock';
  blocks: BlueprintBlock[];
  estimatedMinutes: number;
  generatedAt: string;
}

const deepLessonPrompt = `You are MIGA, an exam-grade curriculum designer for UPSC + TNPSC.

TASK: Generate a structured Blueprint Lesson for "{TOPIC}: {FOCUS}".
LANGUAGE: {LANG} (use the language for all text fields, but keep JSON keys in English).

QUALITY RULES:
1. No fluff. No decorative labels. No motivational slogans.
2. Clear progression: Build → Check → Build → Check → Consolidate.
3. Use simple, precise exam language suitable for UPSC/TNPSC.
4. No Markdown, no **bold**, no backticks, no lists with bullets inside strings.
5. Each concept block must have 2–3 short paragraphs (full sentences), not fragments.
6. Avoid labels like "Key understanding" inside text. Keep content continuous and clear.
7. Use structured fields when helpful:
   - sections: for grouped bullets under a heading
   - compare: when contrasting two regions/policies
   - flow: for cause → response → outcome
   - timeline: for chronological sequencing
8. Do not repeat the same list in multiple forms. If you use timeline, do not repeat the same dynasty list in content/sections.
9. Questions must be precise and exam-focused.

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "lessonId": "ID",
  "topic": "TOPIC",
  "title": "Lesson Title",
  "focus": "Focus Area",
  "timeline": "Optional timeline (e.g., 1206–1526)",
  "hook": "One-line wonder-driven intro hook (max 120 chars)",
  "mode": "sequential_unlock",
  "blocks": [
    {
      "blockId": "B1",
      "type": "concept_build",
      "title": "Concept title",
      "content": ["Paragraph 1", "Paragraph 2"],
      "sections": [
        { "title": "Core Territories & Strategic Features", "bullets": ["Point 1", "Point 2"] }
      ],
      "compare": {
        "leftTitle": "Hill Fort Regions",
        "rightTitle": "Plain Regions",
        "rows": [
          { "left": "Defensive advantage", "right": "Easier agriculture" }
        ]
      },
      "flow": {
        "title": "Geography → Strategy → Outcome",
        "steps": ["Natural barriers", "Fortified settlements", "Long-term resilience"]
      },
      "timeline": {
        "title": "Territorial Evolution",
        "items": [
          { "year": "1200s", "note": "Initial consolidation" }
        ]
      },
      "keyUnderstanding": ["Key point"],
      "deepFocus": ["Exam angle"],
      "clarityLayer": ["Common confusion clarified"],
      "unlockCondition": "User reads and continues"
    },
    {
      "blockId": "B2",
      "type": "checkpoint_quiz",
      "question": "Question",
      "options": ["A", "B", "C", "D"],
      "answer": "B",
      "explanation": "Why B is correct"
    },
    {
      "blockId": "B3",
      "type": "concept_build",
      "title": "Next concept",
      "content": ["Line 1", "Line 2"]
    },
    {
      "blockId": "B4",
      "type": "interactive_match",
      "instruction": "Match the items",
      "pairs": [
        {"left": "Item 1", "right": "Match 1"},
        {"left": "Item 2", "right": "Match 2"}
      ]
    },
    {
      "blockId": "B5",
      "type": "concept_build",
      "title": "Administration",
      "content": ["Line 1", "Line 2"]
    },
    {
      "blockId": "B6",
      "type": "analytical_question",
      "question": "Why did X fail?",
      "expectedPoints": ["Point 1", "Point 2"]
    },
    {
      "blockId": "B7",
      "type": "prelims_mcq",
      "question": "MCQ",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "explanation": "Reason"
    },
    {
      "blockId": "B8",
      "type": "mains_practice",
      "question": "Mains question",
      "wordLimit": 150
    },
    {
      "blockId": "B9",
      "type": "final_consolidation",
      "summaryPoints": ["Point 1", "Point 2"]
    }
  ],
  "estimatedMinutes": 18
}
`;

export const deepLessonGenerator = {
  async generate(
    topic: string,
    lesson: TopicLesson,
    exam: string = 'UPSC',
    language: string = 'English'
  ): Promise<DeepLesson> {
    console.log('[DeepLesson] Generating Blueprint Lesson:', topic, '-', lesson.title, 'in', language);

    try {
      const prompt = deepLessonPrompt
        .replace('{TOPIC}', topic)
        .replace('{FOCUS}', lesson.focus || lesson.title)
        .replace('{LANG}', language);

      const text = await runRoutedPrompt({
        systemPrompt: prompt,
        userPrompt: `Generate a blueprint lesson for:
TOPIC: ${topic}
LESSON: ${lesson.title}
FOCUS: ${lesson.focus}
TARGET EXAM: ${exam}

Return ONLY the JSON object.`,
        strength: 'strong',
        maxTokens: 2800,
      });

      const cleaned = cleanAIJSON(text);
      const parsed = JSON.parse(cleaned);

      const result: DeepLesson = {
        lessonId: lesson.id,
        topic: parsed.topic || topic,
        title: parsed.title || lesson.title,
        focus: parsed.focus || lesson.focus,
        timeline: parsed.timeline,
        hook: parsed.hook,
        hook: parsed.hook,
        mode: 'sequential_unlock',
        blocks: (parsed.blocks || []).map((b: any, i: number) => ({
          blockId: b.blockId || `B${i + 1}`,
          ...b,
        })),
        estimatedMinutes: parsed.estimatedMinutes || 18,
        generatedAt: new Date().toISOString(),
      };

      console.log(`[DEEP GEN] Generated ${result.blocks.length} blueprint blocks`);
      return result;

    } catch (error) {
      console.warn('[DeepLesson] Generation failed:', error);

      return {
        lessonId: lesson.id,
        topic,
        title: lesson.title,
        focus: lesson.focus,
        timeline: undefined,
        hook: undefined,
        mode: 'sequential_unlock',
        blocks: [
          {
            blockId: 'B1',
            type: 'concept_build',
            title: 'Overview',
            content: [
              `This lesson introduces ${lesson.title}.`,
              'Key concepts will be built step by step.',
              'Use the next blocks to test and consolidate.',
            ],
            keyUnderstanding: ['Focus on high-yield exam points.'],
            unlockCondition: 'User reads and continues',
          },
          {
            blockId: 'B2',
            type: 'final_consolidation',
            summaryPoints: ['Core timeline', 'Key reforms', 'Exam-ready takeaways'],
          },
        ],
        estimatedMinutes: 10,
        generatedAt: new Date().toISOString(),
      };
    }
  },
};

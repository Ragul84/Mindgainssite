import type { QuizResult } from './types';
import { runRoutedPrompt } from './modelRouter';
import { cleanAIJSON } from './utils';

const quizSystemPrompt = `You are an exam coach. Produce a quiz JSON with:
- questions: array of { question, options, answer, explanation }
- summary: short diagnostic
Keep MCQs tuned to Indian exams.`;

export async function generateQuiz(topic: string, exam: string): Promise<QuizResult> {
  const response = await runRoutedPrompt({
    systemPrompt: quizSystemPrompt,
    userPrompt: `Topic:${topic}\nExam:${exam}\nNeed 3 MCQs.`,
    strength: 'cheap',
    maxTokens: 600,
  });

  try {
    const cleaned = cleanAIJSON(response);
    const payload = JSON.parse(cleaned);
    const questions = payload.questions ?? [];
    const correct = questions.reduce(
      (count: number, q: any) => (q.userCorrect ? count + 1 : count),
      0,
    );

    return {
      id: `quiz-${Date.now()}`,
      topic,
      total: questions.length,
      correct,
      mistakes: questions
        .filter((q: any) => !q.userCorrect)
        .map((q: any) => ({
          question: q.question,
          explanation: q.explanation ?? 'Review this concept again.',
        })),
    };
  } catch (error) {
    console.warn('[Examiner] parse failed', error);
    return {
      id: `quiz-${Date.now()}`,
      topic,
      total: 3,
      correct: 0,
      mistakes: [],
    };
  }
}

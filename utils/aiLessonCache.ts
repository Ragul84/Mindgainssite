/**
 * AI Lesson Cache
 * A simple utility to pass generated AI lessons between screens
 */

import type { DeepLesson } from '@/services/companion/deepLessonGenerator';

class AILessonCache {
  private currentLesson: DeepLesson | null = null;

  setLesson(lesson: DeepLesson) {
    this.currentLesson = lesson;
  }

  getLesson() {
    return this.currentLesson;
  }

  clear() {
    this.currentLesson = null;
  }
}

export const aiLessonCache = new AILessonCache();

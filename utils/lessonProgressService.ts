// Lesson Progress Service for tracking completion
import { supabase } from './supabaseService';

export class LessonProgressService {
  static async markLessonCompleted(userId: string, lessonId: string, lessonIndex: number) {
    try {
      // Get current user progress
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('completed_lessons')
        .eq('id', userId)
        .single();

      const completedLessons = profile?.completed_lessons || [];
      
      // Add lesson if not already completed
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
        
        // Update user profile
        await supabase
          .from('user_profiles')
          .update({ 
            completed_lessons: completedLessons,
            current_lesson_index: lessonIndex + 1
          })
          .eq('id', userId);
      }
      
      return { success: true, totalCompleted: completedLessons.length };
    } catch (error) {
      console.error('Failed to mark lesson completed:', error);
      return { success: false, error };
    }
  }

  static async getCompletedLessonsCount(userId: string): Promise<number> {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('completed_lessons')
        .eq('id', userId)
        .single();

      return profile?.completed_lessons?.length || 0;
    } catch (error) {
      console.error('Failed to get completed lessons:', error);
      return 0;
    }
  }

  static async getLastUnlockedLesson(userId: string): Promise<number> {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('current_lesson_index, completed_lessons')
        .eq('id', userId)
        .single();

      // Return the next lesson after last completed
      return (profile?.completed_lessons?.length || 0) + 1;
    } catch (error) {
      console.error('Failed to get last unlocked lesson:', error);
      return 1; // Start from first lesson
    }
  }
}
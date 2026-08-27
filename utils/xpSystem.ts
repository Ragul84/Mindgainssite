// 🏆 XP System - Standardized experience points across MindGains
import { supabase } from './supabaseService';

export interface XPReward {
  base: number;
  bonus?: number;
  total: number;
  reason: string;
}

export class XPSystem {
  // Standardized XP values
  static readonly XP_VALUES = {
    // Lessons
    LESSON_COMPLETION: 50,
    QUIZ_COMPLETION: 30,
    PERFECT_QUIZ: 20, // Bonus for 100% score
    
    // Daily activities
    DAILY_DOSE: 25,
    DAILY_SNACK: 15,
    STREAK_BONUS: 10, // Per day of streak
    
    // Special activities
    BATTLE_WIN: 40,
    BATTLE_PARTICIPATION: 10,
    TOPIC_COMPLETION: 100, // When all lessons in topic are done
    
    // Milestones
    FIRST_LESSON: 25, // Bonus for very first lesson
    WEEK_STREAK: 50,
    MONTH_STREAK: 200,
  };

  /**
   * Calculate XP reward for lesson completion
   */
  static calculateLessonXP(params: {
    isFirstLesson?: boolean;
    streakDays?: number;
    quizScore?: number;
    totalQuestions?: number;
  } = {}): XPReward {
    const { isFirstLesson = false, streakDays = 0, quizScore, totalQuestions } = params;
    
    let base = this.XP_VALUES.LESSON_COMPLETION;
    let bonus = 0;
    let reasons: string[] = ['Lesson completion'];

    // First lesson bonus
    if (isFirstLesson) {
      bonus += this.XP_VALUES.FIRST_LESSON;
      reasons.push('First lesson bonus');
    }

    // Streak bonus
    if (streakDays > 0) {
      const streakBonus = Math.min(streakDays * this.XP_VALUES.STREAK_BONUS, 50); // Cap at 50
      bonus += streakBonus;
      reasons.push(`${streakDays}-day streak bonus`);
    }

    // Perfect quiz bonus
    if (quizScore && totalQuestions && quizScore === totalQuestions) {
      bonus += this.XP_VALUES.PERFECT_QUIZ;
      reasons.push('Perfect quiz score');
    }

    return {
      base,
      bonus,
      total: base + bonus,
      reason: reasons.join(' + ')
    };
  }

  /**
   * Calculate XP for quiz completion
   */
  static calculateQuizXP(score: number, totalQuestions: number): XPReward {
    const base = this.XP_VALUES.QUIZ_COMPLETION;
    const isPerfect = score === totalQuestions;
    const bonus = isPerfect ? this.XP_VALUES.PERFECT_QUIZ : 0;

    return {
      base,
      bonus,
      total: base + bonus,
      reason: isPerfect ? 'Quiz completion + Perfect score' : 'Quiz completion'
    };
  }

  /**
   * Calculate daily dose XP
   */
  static calculateDailyDoseXP(streakDays: number = 0): XPReward {
    const base = this.XP_VALUES.DAILY_DOSE;
    const streakBonus = Math.min(streakDays * this.XP_VALUES.STREAK_BONUS, 30);

    return {
      base,
      bonus: streakBonus,
      total: base + streakBonus,
      reason: streakDays > 0 ? `Daily dose + ${streakDays}-day streak` : 'Daily dose'
    };
  }

  /**
   * Award XP to user profile in database
   */
  static async awardXP(userId: string, xpReward: XPReward): Promise<boolean> {
    try {
      console.log('🏆 Awarding XP:', xpReward);
      
      // Get current user profile
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('total_xp')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('❌ Error fetching profile for XP award:', fetchError);
        return false;
      }

      const currentXP = profile?.total_xp || 0;
      const newTotalXP = currentXP + xpReward.total;

      // Update user profile with new XP
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          total_xp: newTotalXP
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Error updating XP:', updateError);
        return false;
      }

      console.log(`✅ XP awarded! ${currentXP} → ${newTotalXP} (+${xpReward.total})`);
      return true;

    } catch (error) {
      console.error('❌ Error in XP award system:', error);
      return false;
    }
  }

  /**
   * Get user's current XP
   */
  static async getCurrentXP(userId: string): Promise<number> {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('total_xp')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        console.log('No profile found, returning 0 XP');
        return 0;
      }

      return profile.total_xp || 0;
    } catch (error) {
      console.error('Error fetching current XP:', error);
      return 0;
    }
  }

  /**
   * Get XP progress to next level (for progress bars)
   */
  static getXPProgress(currentXP: number): { level: number; progressXP: number; nextLevelXP: number; progress: number } {
    // Simple level calculation: 100 XP per level
    const XP_PER_LEVEL = 100;
    const level = Math.floor(currentXP / XP_PER_LEVEL) + 1;
    const progressXP = currentXP % XP_PER_LEVEL;
    const nextLevelXP = XP_PER_LEVEL;
    const progress = progressXP / nextLevelXP;

    return { level, progressXP, nextLevelXP, progress };
  }
}
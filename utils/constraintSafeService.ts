/**
 * 🛡️ CONSTRAINT-SAFE SERVICE
 * 
 * This service prevents "duplicate key value violates unique constraint" errors
 * by implementing safe upsert operations for user_stats and other tables.
 * 
 * ✅ Prevents: duplicate key value violates unique constraint "user_stats_user_id_key"
 * ✅ Handles: Race conditions and concurrent operations
 * ✅ Provides: Graceful error handling and retry logic
 */

import { supabase } from './supabaseService';

export interface XPAwardResult {
  success: boolean;
  action?: 'created' | 'updated' | 'updated_after_conflict';
  xpGained?: number;
  totalXP?: number;
  leveledUp?: boolean;
  newLevel?: number;
  quizCount?: number;
  streakDays?: number;
  error?: string;
  data?: any;
}

export interface UserStatsData {
  user_id: string;
  total_xp: number;
  current_level: number;
  streak_days: number;
  total_quizzes_taken: number;
  total_quizzes_completed: number;
  total_correct_answers: number;
  total_questions_answered: number;
  last_activity_date: string;
  total_study_time: number;
  coins: number;
  gems: number;
}

/**
 * Safe XP awarding function that prevents constraint violations
 * @param userId - The user's UUID
 * @param xpAmount - Amount of XP to award
 * @param source - Source of XP (quiz, daily, etc.)
 * @returns Promise<XPAwardResult>
 */
export async function safeAwardUserXP(
  userId: string, 
  xpAmount: number, 
  source: string = 'general'
): Promise<XPAwardResult> {
  try {
    console.log(`🏆 Awarding ${xpAmount} XP to user ${userId} from source: ${source}`);
    
    const isQuizSource = ['daily', 'topic', 'subject', 'battle', 'mission', 'adaptive', 'quiz'].includes(source);
    
    // First, try to get existing stats
    const { data: existingStats, error: fetchError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }
    
    if (existingStats) {
      // Record exists, update it
      const newXp = (existingStats.total_xp || 0) + xpAmount;
      const oldLevel = existingStats.current_level || 1;
      const newLevel = Math.floor(Math.sqrt(newXp / 100.0)) + 1;
      const newQuizCount = (existingStats.total_quizzes_taken || 0) + (isQuizSource ? 1 : 0);
      
      const { data, error } = await supabase
        .from('user_stats')
        .update({
          total_xp: newXp,
          current_level: newLevel,
          total_quizzes_taken: newQuizCount,
          last_activity_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        success: true,
        action: 'updated',
        xpGained: xpAmount,
        totalXP: data.total_xp,
        leveledUp: newLevel > oldLevel,
        newLevel: data.current_level,
        quizCount: data.total_quizzes_taken,
        streakDays: data.streak_days,
        data
      };
      
    } else {
      // Record doesn't exist, create new one
      const newXp = xpAmount;
      const newLevel = Math.floor(Math.sqrt(newXp / 100.0)) + 1;
      
      const { data, error } = await supabase
        .from('user_stats')
        .insert({
          user_id: userId,
          total_xp: newXp,
          current_level: newLevel,
          streak_days: 0,
          total_quizzes_taken: isQuizSource ? 1 : 0,
          total_quizzes_completed: 0,
          total_correct_answers: 0,
          total_questions_answered: 0,
          last_activity_date: new Date().toISOString().split('T')[0],
          total_study_time: 0,
          coins: 0,
          gems: 0
        })
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') {
          // Duplicate key violation - someone else created the record
          console.log('⚠️  Constraint violation detected, retrying as update...');
          return await safeAwardUserXP(userId, xpAmount, source);
        }
        throw error;
      }
      
      return {
        success: true,
        action: 'created',
        xpGained: xpAmount,
        totalXP: data.total_xp,
        leveledUp: true,
        newLevel: data.current_level,
        quizCount: data.total_quizzes_taken,
        streakDays: data.streak_days,
        data
      };
    }
    
  } catch (error) {
    console.error('❌ Error in safeAwardUserXP:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}

/**
 * Safe user stats upsert that handles all constraint violations
 * @param userId - The user's UUID
 * @param updates - Partial user stats to update
 * @returns Promise<XPAwardResult>
 */
export async function safeUpsertUserStats(
  userId: string, 
  updates: Partial<UserStatsData>
): Promise<XPAwardResult> {
  try {
    console.log(`📊 Safely upserting user stats for ${userId}`);
    
    // Ensure user_id is set
    updates.user_id = userId;
    
    // First attempt: try INSERT with ON CONFLICT handling
    const { data, error } = await supabase
      .from('user_stats')
      .upsert(updates, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        // Even with upsert, we got a constraint violation
        // This can happen in high-concurrency situations
        console.log('⚠️  Upsert constraint violation, retrying with update...');
        
        const { data: updateData, error: updateError } = await supabase
          .from('user_stats')
          .update(updates)
          .eq('user_id', userId)
          .select()
          .single();
        
        if (updateError) throw updateError;
        
        return {
          success: true,
          action: 'updated_after_conflict',
          data: updateData
        };
      }
      throw error;
    }
    
    return {
      success: true,
      action: 'updated',
      data
    };
    
  } catch (error) {
    console.error('❌ Error in safeUpsertUserStats:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}

/**
 * Initialize user stats safely (won't create duplicates)
 * @param userId - The user's UUID
 * @returns Promise<XPAwardResult>
 */
export async function safeInitializeUserStats(userId: string): Promise<XPAwardResult> {
  try {
    console.log(`🏁 Safely initializing user stats for ${userId}`);
    
    // Check if stats already exist
    const { data: existing, error: checkError } = await supabase
      .from('user_stats')
      .select('user_id')
      .eq('user_id', userId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existing) {
      return {
        success: true,
        action: 'updated',
        data: existing
      };
    }
    
    // Stats don't exist, create them
    const { data, error } = await supabase
      .from('user_stats')
      .insert({
        user_id: userId,
        total_xp: 0,
        current_level: 1,
        streak_days: 0,
        total_quizzes_taken: 0,
        total_quizzes_completed: 0,
        total_correct_answers: 0,
        total_questions_answered: 0,
        last_activity_date: new Date().toISOString().split('T')[0],
        total_study_time: 0,
        coins: 0,
        gems: 0
      })
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        // Someone else created the record, that's fine
        console.log('✅ User stats already initialized by another process');
        return {
          success: true,
          action: 'updated',
          data: null
        };
      }
      throw error;
    }
    
    return {
      success: true,
      action: 'created',
      data
    };
    
  } catch (error) {
    console.error('❌ Error in safeInitializeUserStats:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}

/**
 * Get user stats safely with fallback to initialization
 * @param userId - The user's UUID
 * @returns Promise<UserStatsData | null>
 */
export async function safeGetUserStats(userId: string): Promise<UserStatsData | null> {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // Stats don't exist, initialize them
      console.log(`📊 User stats not found for ${userId}, initializing...`);
      const initResult = await safeInitializeUserStats(userId);
      return initResult.data;
    } else if (error) {
      throw error;
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Error in safeGetUserStats:', error);
    return null;
  }
}

// Export a simplified interface for backward compatibility
export const constraintSafeService = {
  awardXP: safeAwardUserXP,
  upsertStats: safeUpsertUserStats,
  initializeStats: safeInitializeUserStats,
  getStats: safeGetUserStats
};

export default constraintSafeService;
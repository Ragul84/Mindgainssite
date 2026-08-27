import { supabase } from '@/utils/supabase';

export interface LessonReward {
  id: string;
  user_id: string;
  lesson_id: string;
  reward_amount: number;
  claimed_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: 'locked' | 'unlocked' | 'completed';
  completed_at?: string;
  xp_earned: number;
}

export type SubscriptionTier = 'free' | 'pro' | 'premium';

export const TIER_LIMITS = {
  free: {
    lessons: 2,           // 2 FREE BLUEPRINTS PER DAY
    chatResponses: 10,    // 10 FREE MESSAGES
    migaTools: 1,         // 1 FREE PDF/PLAN
    heistPlays: 2,        // 2 FREE GAMES
    multiplier: 1.0
  },
  pro: {
    lessons: 15,          // 15 BLUEPRINTS
    chatResponses: 100,
    migaTools: 5,
    heistPlays: 10,
    multiplier: 1.5
  },
  premium: {
    lessons: 99999,       // UNLIMITED
    chatResponses: 99999,
    migaTools: 99999,
    heistPlays: 99999,
    multiplier: 2.0
  }
};

export interface UserStats {
  id: string;
  user_id: string;
  coins: number;
  streak_days: number;
  total_xp: number;
  gems: number;
  subscription_tier: SubscriptionTier;
  lessons_unlocked_today: number;
  heist_plays_today: number;
  last_activity_date?: string;
}

/**
 * Reward Service - Handles lesson reward claiming and tracking
 * Replaces the auto-distribute system with proper database management
 */
export class RewardService {
  /**
   * Fetches a user_profiles row for the Supabase auth user id.
   */
  private static async fetchProfileRow<T = any>(userId: string, columns: string): Promise<T | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(columns)
      .eq('id', userId)
      .maybeSingle();

    if (error && error.code && error.code !== 'PGRST116') {
      throw error;
    }

    return (data as T) || null;
  }

  /**
   * Award rewards for Neural Focus level completion
   */
  static async awardNeuralReward(userId: string, amount: number, memo: string): Promise<boolean> {
    try {
      // 1. Record transactions
      await this.recordTransaction(userId, amount, 'mg', 'neural_focus_reward', { memo });
      await this.recordTransaction(userId, amount, 'xp', 'neural_focus_reward', { memo });

      // 2. Update user profile
      const profile = await this.fetchProfileRow<{ id?: string; total_xp?: number }>(
        userId,
        'id, total_xp'
      );

      const newTotalXp = (profile?.total_xp || 0) + amount;

      if (profile) {
        await supabase
          .from('user_profiles')
          .update({ total_xp: newTotalXp })
          .eq('id', profile.id || userId);
      } else {
        await supabase
          .from('user_profiles')
          .upsert(
            { id: userId, total_xp: amount },
            { onConflict: 'id' }
          );
      }

      const { data: userStatsRow } = await supabase
        .from('user_stats')
        .select('user_id, coins, total_xp')
        .eq('user_id', userId)
        .maybeSingle();

      const newStatsPayload = {
        user_id: userId,
        coins: (userStatsRow?.coins || 0) + amount,
        total_xp: (userStatsRow?.total_xp || 0) + amount,
      };

      await supabase
        .from('user_stats')
        .upsert(newStatsPayload, { onConflict: 'user_id' });

      console.log(`[Focus] Training reward awarded: ${amount} to ${userId} (${memo})`);
      return true;
    } catch (error) {
      console.error('Error awarding neural reward:', error);
      return false;
    }
  }

  /**
   * Award rewards for Blueprint completion
   */
  static async awardBlueprintXP(userId: string, topic: string, baseAmount: number = 150): Promise<number> {
    try {
      const stats = await this.getUserStats();
      const tier = stats?.subscription_tier || 'free';
      const multiplier = TIER_LIMITS[tier].multiplier;
      const finalAmount = Math.floor(baseAmount * multiplier);

      // 1. Record transactions
      await this.recordTransaction(userId, finalAmount, 'xp', 'blueprint_completion', { topic });
      await this.recordTransaction(userId, Math.floor(finalAmount / 2), 'mg', 'blueprint_completion', { topic });

      // 2. Update user profile XP
      const currentXp = stats?.total_xp || 0;
      await supabase
        .from('user_profiles')
        .update({ total_xp: currentXp + finalAmount })
        .eq('id', userId);

      console.log(`[Economy] Blueprint XP awarded: ${finalAmount} (multiplier: ${multiplier}x)`);
      return finalAmount;
    } catch (error) {
      console.error('Error awarding blueprint XP:', error);
      return 0;
    }
  }
  
  /**
   * Check if a lesson reward has already been claimed
   */
  static async isRewardClaimed(lessonId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('lesson_rewards')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error checking reward status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in isRewardClaimed:', error);
      return false;
    }
  }

  /**
   * Claim a lesson reward (manual claiming system)
   */
  static async claimLessonReward(lessonId: string, rewardAmount: number = 50): Promise<{ success: boolean; reward?: LessonReward; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Check if already claimed
      const alreadyClaimed = await this.isRewardClaimed(lessonId);
      if (alreadyClaimed) {
        return { success: false, error: 'Reward already claimed for this lesson' };
      }

      // Apply Tier Multiplier
      const stats = await this.getUserStats();
      const tier = stats?.subscription_tier || 'free';
      const multiplier = TIER_LIMITS[tier].multiplier;
      const finalReward = Math.floor(rewardAmount * multiplier);

      // Insert reward claim
      const { data, error } = await supabase
        .from('lesson_rewards')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          reward_amount: finalReward
        })
        .select()
        .single();

      if (error) {
        console.error('Error claiming reward:', error);
        return { success: false, error: error.message };
      }

      // 🏦 Log Transaction
      await this.recordTransaction(user.id, finalReward, 'mg', 'lesson_reward', { lessonId });
      await this.recordTransaction(user.id, finalReward, 'xp', 'lesson_reward', { lessonId });

      // Update total XP in profile (since coins are synced to XP)
      if (stats) {
        await supabase
          .from('user_profiles')
          .update({ total_xp: stats.total_xp + finalReward })
          .eq('id', stats.id);
      }

      console.log('🎁 Reward claimed successfully:', { lessonId, amount: finalReward, tier });
      return { success: true, reward: data };

    } catch (error) {
      console.error('Error in claimLessonReward:', error);
      return { success: false, error: 'Failed to claim reward' };
    }
  }

  /**
   * Get all claimed rewards for current user
   */
  static async getClaimedRewards(): Promise<LessonReward[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('lesson_rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('claimed_at', { ascending: false });

      if (error) {
        console.error('Error fetching claimed rewards:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getClaimedRewards:', error);
      return [];
    }
  }

  /**
   * Get user's current stats (total MG tokens, streak, etc.)
   * 🚨 CRITICAL: THIS IS THE WORKING METHOD - DO NOT CHANGE!
   * ✅ Correctly fetches from user_profiles table
   * ✅ Returns real user data: totalXP: 4490, streak: 2, etc.
   */
  /**
   * Get user's current stats (total MG tokens, streak, etc.)
   * ✅ CRITICAL: THIS IS THE WORKING METHOD - DO NOT CHANGE!
   * • Correctly fetches from user_profiles table
   * • Returns real user data: totalXP: 4490, streak: 2, etc.
   */
  static async getUserStats(): Promise<UserStats | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // ✅ WORKING CODE - DO NOT MODIFY!
      // First try user_profiles table which has the REAL data
      const profile = await this.fetchProfileRow<{
        id?: string;
        total_xp?: number;
        streak_count?: number;
        gems?: number;
        subscription_tier?: SubscriptionTier;
        lessons_unlocked_today?: number;
        heist_plays_today?: number;
        daily_usage_date?: string;
      }>(
        user.id,
        'id, total_xp, streak_count, gems, subscription_tier, lessons_unlocked_today, heist_plays_today, daily_usage_date'
      );

      if (profile) {
        // Check if we need to reset daily counts locally
        const today = new Date().toISOString().split('T')[0];
        const isNewDay = profile.daily_usage_date !== today;
        const profilePrimaryKey = profile.id || user.id;
        const xpBalance = profile.total_xp || 0;

        await supabase
          .from('user_stats')
          .upsert(
            {
              user_id: profilePrimaryKey,
              coins: xpBalance,
              total_xp: xpBalance,
              streak_days: profile.streak_count || 0,
            },
            { onConflict: 'user_id' }
          );

        const userEmail = user.email?.trim().toLowerCase();
        const isWhitelisted = userEmail === 'ragularvind84@gmail.com' || userEmail === 'ragulaarvind84@gmail.com' || user.id === '8a78b8d6-0764-46c8-af3f-68f9cb371a63';
        
        const tier = (isWhitelisted ? 'premium' : (profile.subscription_tier as SubscriptionTier)) || 'free';

        return {
          id: profilePrimaryKey,
          user_id: profilePrimaryKey,
          coins: xpBalance,
          streak_days: profile.streak_count || 0,
          total_xp: xpBalance,
          gems: profile.gems || 0,
          subscription_tier: tier,
          lessons_unlocked_today: isNewDay ? 0 : (profile.lessons_unlocked_today || 0),
          heist_plays_today: isNewDay ? 0 : (profile.heist_plays_today || 0),
          last_activity_date: new Date().toISOString(),
        };
      }

      // Fallback to user_stats table if user_profiles doesn't exist
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching user stats:', error);
        return null;
      }

      if (!data) return null;

      const userEmail = user.email?.trim().toLowerCase();
      const isWhitelisted = userEmail === 'ragularvind84@gmail.com' || userEmail === 'ragulaarvind84@gmail.com' || user.id === '8a78b8d6-0764-46c8-af3f-68f9cb371a63';

      return {
        ...data,
        subscription_tier: isWhitelisted ? 'premium' : (data.subscription_tier || 'free'),
        coins: data.total_xp || 0, // Ensure MG always equals XP
      };
    } catch (error) {
      console.error('Error in getUserStats:', error);
      return null;
    }
  }

  /**
   * Update lesson completion status
   */
  static async updateLessonProgress(lessonId: string, status: 'unlocked' | 'completed', xpEarned: number = 0): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const updateData: any = {
        user_id: user.id,
        lesson_id: lessonId,
        status,
        xp_earned: xpEarned,
        updated_at: new Date().toISOString()
      };

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      // 🔓 GOD MODE: Unlimited lessons
      if (status === 'unlocked') {
        const stats = await this.getUserStats();
        if (stats) {
          await supabase
            .from('user_profiles')
            .update({ 
               lessons_unlocked_today: (stats.lessons_unlocked_today || 0) + 1,
               daily_usage_date: new Date().toISOString().split('T')[0]
            })
            .eq('id', stats.id);
        }
      }

      const { error } = await supabase
        .from('lesson_progress')
        .upsert(updateData, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) {
        console.error('Error updating lesson progress:', error);
        return false;
      }

      // 🏆 If completed and has XP, award it to profile for global consistency
      if (status === 'completed' && xpEarned > 0) {
        const stats = await this.getUserStats();
        if (stats) {
          const tier = stats.subscription_tier || 'free';
          const multiplier = TIER_LIMITS[tier].multiplier;
          const finalXP = Math.floor(xpEarned * multiplier);
          
          await supabase
            .from('user_profiles')
            .update({ total_xp: stats.total_xp + finalXP })
            .eq('id', stats.id);
            
          await this.recordTransaction(user.id, finalXP, 'xp', 'lesson_completion', { lessonId });
          console.log(`[Economy] Awarded ${finalXP} XP for lesson ${lessonId} (${tier} tier)`);
        }
      }

      console.log('📚 Lesson progress updated:', { lessonId, status, xpEarned });
      return true;

    } catch (error) {
      console.error('Error in updateLessonProgress:', error);
      return false;
    }
  }

  /**
   * Get lesson progress for current user
   */
  static async getUserProgress(): Promise<UserProgress[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching user progress:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserProgress:', error);
      return [];
    }
  }

  /**
   * Check if lesson is completed and eligible for reward claiming
   */
  static async isLessonEligibleForReward(lessonId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check if lesson is completed
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('status')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking lesson eligibility:', error);
        return false;
      }

      // Lesson is eligible if it's completed and reward hasn't been claimed
      const isCompleted = data?.status === 'completed';
      const rewardClaimed = await this.isRewardClaimed(lessonId);

      return isCompleted && !rewardClaimed;
    } catch (error) {
      console.error('Error in isLessonEligibleForReward:', error);
      return false;
    }
  }

  /**
   * Get total MG tokens for current user (for XP bar display)
   */
  static async getTotalMGTokens(): Promise<number> {
    try {
      const stats = await this.getUserStats();
      return stats?.coins || 0;  // Using existing 'coins' column
    } catch (error) {
      console.error('Error getting total MG tokens:', error);
      return 0;
    }
  }

  /**
   * Check if a lesson can be unlocked based on tier
   */
  static async canUnlockLesson(): Promise<{ allowed: boolean; remaining: number; total: number; tier: SubscriptionTier }> {
    try {
      const stats = await this.getUserStats();
      if (!stats) return { allowed: false, remaining: 0, total: 0, tier: 'free' };

      const tierLimits = TIER_LIMITS[stats.subscription_tier];
      const usedToday = stats.lessons_unlocked_today || 0;
      const remaining = Math.max(0, tierLimits.lessons - usedToday);

      return {
        allowed: remaining > 0 || stats.subscription_tier === 'premium',
        remaining,
        total: tierLimits.lessons,
        tier: stats.subscription_tier
      };
    } catch (e) {
      return { allowed: false, remaining: 0, total: 0, tier: 'free' };
    }
  }

  /**
   * Check if a MIGA tool (PDF, StudyPlan, etc) can be used
   */
  static async canUseMigaTool(): Promise<{ canUse: boolean; remaining: number; total: number; tier: SubscriptionTier }> {
     try {
       const stats = await this.getUserStats();
       if (!stats) return { canUse: false, remaining: 0, total: 0, tier: 'free' };

       const tierLimits = TIER_LIMITS[stats.subscription_tier];
       // Note: Currently we don't track tool usage count in profile, so this is just for tier info
       // unless we want to implement a counter. For now, Premium has no worry.
       return { 
         canUse: true, // Placeholder for actual tracking
         remaining: tierLimits.migaTools, 
         total: tierLimits.migaTools, 
         tier: stats.subscription_tier 
       };
     } catch (e) {
       return { canUse: false, remaining: 0, total: 0, tier: 'free' };
     }
  }

  /**
   * Track MIGA chat response usage for Free users
   */
  static async checkChatLimit(): Promise<{ allowed: boolean; remaining: number; total: number; tier: 'free' | 'pro' | 'premium' }> {
    try {
      const stats = await this.getUserStats();
      if (!stats) return { allowed: false, remaining: 0, total: 0, tier: 'free' };

      const tierLimits = TIER_LIMITS[stats.subscription_tier];
      // We'd need to fetch actual chat count if we want to enforce this
      return { allowed: true, remaining: tierLimits.chatResponses, total: tierLimits.chatResponses, tier: stats.subscription_tier };
    } catch (e) {
      return { allowed: false, remaining: 0, total: 5, tier: 'free' };
    }
  }

  static async incrementChatCount(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
        .from('user_profiles')
        .select('daily_chat_count, daily_usage_date')
        .eq('id', user.id)
        .single();

    const isNewDay = data?.daily_usage_date !== today;
    
    await supabase
      .from('user_profiles')
      .update({
        daily_chat_count: isNewDay ? 1 : (data.daily_chat_count + 1),
        daily_usage_date: today
      })
      .eq('id', user.id);
  }

  /**
   * Initialize user data (call when user signs up or first opens app)
   */
  static async initializeUserData(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const userEmail = user.email?.trim().toLowerCase();
      const isWhitelisted = userEmail === 'ragularvind84@gmail.com' || userEmail === 'ragulaarvind84@gmail.com' || user.id === '8a78b8d6-0764-46c8-af3f-68f9cb371a63';

      // Create initial user stats if they don't exist using existing columns
      // For God Mode user, initialize with premium tier immediately
      const { error } = await supabase
        .from('user_profiles')
        .update({
          subscription_tier: isWhitelisted ? 'premium' : 'free'
        })
        .eq('id', user.id);
        
      // Also update user_stats for redundancy
      await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          subscription_tier: isWhitelisted ? 'premium' : 'free',
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error initializing user data:', error);
        return false;
      }

      console.log('✅ User data initialized successfully');
      return true;
    } catch (error) {
      console.error('Error in initializeUserData:', error);
      return false;
    }
  }

  /**
   * Record a currency transaction for audit and history
   */
  static async recordTransaction(
    userId: string, 
    amount: number, 
    currency: 'mg' | 'xp' | 'gems', 
    type: string, 
    metadata: any = {}
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_transactions')
        .insert({
          user_id: userId,
          amount,
          currency_type: currency,
          transaction_type: type,
          metadata
        });

      if (error) {
        if (error.code === '42501') {
          console.warn('Skipping transaction log due to RLS policy', { type, currency });
          return false;
        }
        console.error('Error recording transaction:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in recordTransaction:', error);
      return false;
    }
  }

  private static async getMigaUsageCount(userId: string): Promise<number> {
    const { data } = await supabase
      .from('user_profiles')
      .select('daily_usage_count, daily_usage_date')
      .eq('id', userId)
      .single();
    
    const today = new Date().toISOString().split('T')[0];
    if (data?.daily_usage_date !== today) return 0;
    return data?.daily_usage_count || 0;
  }
}

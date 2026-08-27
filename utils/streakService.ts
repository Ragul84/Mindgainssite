import { supabase } from './supabaseService';

export class StreakService {
  /**
   * Update user's streak when they open the app for the first time today
   */
  static async updateStreakOnAppEntry(userId: string): Promise<number> {
    try {
      // Get current streak data
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('streak_count, last_activity_date')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // Ignore "no rows" error for new users
        throw fetchError;
      }

      const todayString = new Date().toDateString();
      const lastDate = profile?.last_activity_date ? new Date(profile.last_activity_date).toDateString() : null;

      let newStreakCount = 0;

      if (lastDate === todayString) {
        // Already updated today, keep the same streak
        return profile.streak_count || 0;
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();

      const dayBeforeYesterday = new Date();
      dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
      const dayBeforeYesterdayString = dayBeforeYesterday.toDateString();

      if (lastDate === yesterdayString) {
        // Continue streak from yesterday
        newStreakCount = (profile?.streak_count || 0) + 1;
      } else if (lastDate === dayBeforeYesterdayString) {
        // STREAK FORGIVENESS: User missed 1 day, let the streak continue
        console.log(`🛡️ Streak Forgiveness applied for user ${userId}`);
        newStreakCount = (profile?.streak_count || 0) + 1;
      } else if (!lastDate || (lastDate !== todayString && lastDate !== yesterdayString && lastDate !== dayBeforeYesterdayString)) {
        // Start new streak (more than 1 day missed or first time)
        newStreakCount = 1;
      }

      // Update the streak in database (user must exist)
      const today = new Date();
      const todayDateString = today.getFullYear() + '-' + 
        String(today.getMonth() + 1).padStart(2, '0') + '-' + 
        String(today.getDate()).padStart(2, '0');
        
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          streak_count: newStreakCount,
          last_activity_date: todayDateString,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      console.log(`📈 Daily streak updated for user ${userId}: ${newStreakCount} days`);
      return newStreakCount;

    } catch (error) {
      console.error('Error updating streak:', error);
      return 0;
    }
  }

  /**
   * Get current streak for a user
   */
  static async getCurrentStreak(userId: string): Promise<{ count: number; isActive: boolean }> {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('streak_count, last_activity_date')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        return { count: 0, isActive: false };
      }

      const today = new Date().toDateString();
      const lastDate = profile.last_activity_date ? new Date(profile.last_activity_date).toDateString() : null;
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();

      // Check if streak is still active
      const isActive = lastDate === today || lastDate === yesterdayString;
      const count = isActive ? (profile.streak_count || 0) : 0;

      return { count, isActive };
    } catch (error) {
      console.error('Error getting streak:', error);
      return { count: 0, isActive: false };
    }
  }

  /**
   * Optional: Update streak when user completes a lesson (if not already done today)
   * This is secondary - main streak happens on app entry
   */
  static async updateStreakOnLessonComplete(userId: string): Promise<number> {
    // Just call the main app entry method - no difference now
    return this.updateStreakOnAppEntry(userId);
  }

  /**
   * Get comprehensive streak status for user
   */
  static async getStreakStatus(userId: string): Promise<{
    currentStreak: number;
    hasDailyDose: boolean;
    hasDailySnack: boolean;
    hasRegisteredToday: boolean;
  }> {
    try {
      const { count, isActive } = await this.getCurrentStreak(userId);
      
      // For now, return basic status - can be expanded later
      return {
        currentStreak: count,
        hasDailyDose: isActive,
        hasDailySnack: false, // Can be implemented later
        hasRegisteredToday: isActive
      };
    } catch (error) {
      console.error('Error getting streak status:', error);
      return {
        currentStreak: 0,
        hasDailyDose: false,
        hasDailySnack: false,
        hasRegisteredToday: false
      };
    }
  }

  /**
   * Check and reset streak if user missed a day
   */
  static async checkAndResetStreak(userId: string): Promise<boolean> {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('streak_count, last_activity_date')
        .eq('id', userId)
        .single();

      if (error || !profile || !profile.last_activity_date) {
        return false;
      }

      const lastDate = new Date(profile.last_activity_date).toDateString();
      const today = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();

      // If last activity was not today or yesterday, reset the streak
      if (lastDate !== today && lastDate !== yesterdayString) {
        await supabase
          .from('user_profiles')
          .update({
            streak_count: 0
          })
          .eq('id', userId);
        
        console.log(`🔄 Streak reset for user ${userId} - missed day`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking streak:', error);
      return false;
    }
  }
}
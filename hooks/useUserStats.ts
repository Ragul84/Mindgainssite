import { useState, useEffect } from 'react';
import { RewardService, UserStats } from '@/services/rewardService';

/**
 * Custom hook to manage user statistics and MG tokens
 * Provides real-time updates from the database
 * 
 * 🚨 CRITICAL: THIS IS WORKING CODE - DO NOT CHANGE!
 * ✅ Correctly fetches from user_profiles via RewardService.getUserStats()
 * ✅ Returns real data: totalMGTokens (4490), currentStreak (2), etc.
 */
export const useUserStats = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial user stats
  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await RewardService.getUserStats();
      console.log('📊 Loaded user stats:', stats);
      
      // Set the stats directly from database
      setUserStats(stats);
    } catch (err) {
      console.error('Error loading user stats:', err);
      setError('Failed to load user stats');
      // Don't set fake values - let it be null
    } finally {
      setLoading(false);
    }
  };

  // Refresh stats after reward claims
  const refreshStats = async () => {
    try {
      const stats = await RewardService.getUserStats();
      setUserStats(stats);
      return stats;
    } catch (err) {
      console.error('Error refreshing user stats:', err);
      return null;
    }
  };

  // 🎯 WORKING: Extract values from userStats
  // Get total MG tokens (using existing 'coins' column)
  const totalMGTokens = userStats?.coins || 0;

  // Get current streak (using existing 'streak_days' column)
  const currentStreak = userStats?.streak_days || 0;

  // Get total XP (using existing 'total_xp' column)
  const totalXP = userStats?.total_xp || 0;
  
  return {
    userStats,
    totalMGTokens,
    currentStreak,
    totalXP,
    loading,
    error,
    refreshStats,
    reload: loadUserStats
  };
};
// 🚀 Streak Cache Service - Fast loading with no 0 animation
// Caches streak data locally to show instantly on page load

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_CACHE_KEY = 'mindgains:streakCache';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes cache

export interface CachedStreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakFrozen: boolean;
  freezeDaysLeft: number;
  cachedAt: number;
  userId: string;
}

export class StreakCache {
  // Get cached streak data immediately (no await needed for initial display)
  static getCachedStreakSync(): CachedStreakData | null {
    // For web/React Native Web, try localStorage first
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const cached = window.localStorage.getItem(STREAK_CACHE_KEY);
        if (cached) {
          const data = JSON.parse(cached) as CachedStreakData;
          
          // Check if cache is still valid (5 minutes)
          if (Date.now() - data.cachedAt < CACHE_EXPIRY_MS) {
            return data;
          }
        }
      } catch (e) {
        console.log('Error reading streak cache:', e);
      }
    }
    return null;
  }

  // Get cached streak data (async for mobile)
  static async getCachedStreak(userId: string): Promise<CachedStreakData | null> {
    try {
      // First try sync method for web
      const syncCache = this.getCachedStreakSync();
      if (syncCache && syncCache.userId === userId) {
        return syncCache;
      }

      // Then try AsyncStorage for mobile
      const cached = await AsyncStorage.getItem(STREAK_CACHE_KEY);
      if (!cached) return null;

      const data = JSON.parse(cached) as CachedStreakData;
      
      // Verify it's for the correct user
      if (data.userId !== userId) return null;
      
      // Check if cache is still valid
      if (Date.now() - data.cachedAt < CACHE_EXPIRY_MS) {
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting cached streak:', error);
      return null;
    }
  }

  // Save streak data to cache
  static async cacheStreakData(
    userId: string,
    streakData: {
      currentStreak: number;
      longestStreak: number;
      lastActivityDate: string;
      streakFrozen?: boolean;
      freezeDaysLeft?: number;
    }
  ): Promise<void> {
    try {
      const cacheData: CachedStreakData = {
        ...streakData,
        streakFrozen: streakData.streakFrozen || false,
        freezeDaysLeft: streakData.freezeDaysLeft || 0,
        cachedAt: Date.now(),
        userId
      };

      const serialized = JSON.stringify(cacheData);

      // Save to both localStorage (web) and AsyncStorage (mobile)
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STREAK_CACHE_KEY, serialized);
      }
      
      await AsyncStorage.setItem(STREAK_CACHE_KEY, serialized);
    } catch (error) {
      console.error('Error caching streak data:', error);
    }
  }

  // Clear cache (useful for logout)
  static async clearCache(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STREAK_CACHE_KEY);
      }
      await AsyncStorage.removeItem(STREAK_CACHE_KEY);
    } catch (error) {
      console.error('Error clearing streak cache:', error);
    }
  }

  // Get streak with smart caching - returns cached immediately, then updates
  static async getStreakWithCache(
    userId: string,
    fetchFunction: () => Promise<any>
  ): Promise<{
    cached: CachedStreakData | null;
    fresh: Promise<any>;
  }> {
    // Get cached data immediately
    const cached = await this.getCachedStreak(userId);
    
    // Start fetching fresh data in background
    const fresh = fetchFunction().then(async (data) => {
      // Cache the fresh data
      if (data) {
        await this.cacheStreakData(userId, {
          currentStreak: data.current_streak || data.currentStreak || 0,
          longestStreak: data.longest_streak || data.longestStreak || 0,
          lastActivityDate: data.last_activity_date || data.lastActivityDate || '',
          streakFrozen: data.streak_frozen || data.streakFrozen || false,
          freezeDaysLeft: data.freeze_days_left || data.freezeDaysLeft || 0,
        });
      }
      return data;
    });

    return { cached, fresh };
  }
}

// Hook helper for React components

export function useStreakCache(userId: string | null) {
  const [streak, setStreak] = React.useState<number | null>(() => {
    // Get cached value immediately on mount
    if (!userId) return null;
    const cached = StreakCache.getCachedStreakSync();
    return cached?.userId === userId ? cached.currentStreak : null;
  });

  React.useEffect(() => {
    if (!userId) {
      setStreak(null);
      return;
    }

    let cancelled = false;

    // Load cached first, then fetch fresh
    (async () => {
      const cached = await StreakCache.getCachedStreak(userId);
      if (cached && !cancelled) {
        setStreak(cached.currentStreak);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const updateStreak = React.useCallback(async (newStreak: number) => {
    if (!userId) return;
    
    setStreak(newStreak);
    await StreakCache.cacheStreakData(userId, {
      currentStreak: newStreak,
      longestStreak: newStreak,
      lastActivityDate: new Date().toISOString().split('T')[0],
    });
  }, [userId]);

  return { streak, updateStreak };
}
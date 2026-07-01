// 🏆 Battle Analytics & Statistics Service - Production Ready
// Comprehensive battle tracking and user insights

import { supabase } from './supabaseService';

export interface BattleSessionData {
  userId: string;
  battleId: string;
  roomId?: string;
  opponentId?: string;
  battleType: 'quick' | 'ranked' | 'practice' | 'tournament';
  questionsCorrect: number;
  totalQuestions: number;
  timeTaken: number;
  avgResponseTime: number;
  subjects: string[];
  strongestSubject?: string;
  weakestSubject?: string;
  result: 'win' | 'loss' | 'draw';
  xpGained: number;
  coinsWon: number;
  betAmount?: number;
}

export interface BattleInsights {
  totalBattles: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  avgAccuracy: number;
  avgResponseTime: number;
  strongestSubjects: string[];
  weakestSubjects: string[];
  totalXpEarned: number;
  totalCoinsWon: number;
  favoriteOpponentType: 'human' | 'bot';
  peakRating: number;
  currentRating: number;
}

export class BattleAnalyticsService {
  
  // 📊 Record comprehensive battle session data
  static async recordBattleSession(sessionData: BattleSessionData): Promise<boolean> {
    try {
      console.log('📊 Recording battle session analytics...');
      
      // 1. Record detailed analytics
      const { error: analyticsError } = await supabase
        .from('battle_analytics')
        .insert({
          user_id: sessionData.userId,
          battle_id: sessionData.battleId,
          room_id: sessionData.roomId,
          battle_type: sessionData.battleType,
          questions_correct: sessionData.questionsCorrect,
          total_questions: sessionData.totalQuestions,
          accuracy: (sessionData.questionsCorrect / sessionData.totalQuestions) * 100,
          time_taken: sessionData.timeTaken,
          avg_response_time: sessionData.avgResponseTime,
          subjects_played: sessionData.subjects,
          strongest_subject: sessionData.strongestSubject,
          weakest_subject: sessionData.weakestSubject,
          result: sessionData.result,
          xp_gained: sessionData.xpGained,
          coins_won: sessionData.coinsWon,
          bet_amount: sessionData.betAmount || 0,
          created_at: new Date().toISOString()
        });

      if (analyticsError) {
        console.error('❌ Error recording battle analytics:', analyticsError);
        return false;
      }

      // 2. Update user battle statistics
      await this.updateUserBattleStats(sessionData);
      
      console.log('✅ Battle session analytics recorded successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error in recordBattleSession:', error);
      return false;
    }
  }

  // 📈 Update user's overall battle statistics
  static async updateUserBattleStats(sessionData: BattleSessionData): Promise<void> {
    try {
      // Get current user stats
      const { data: currentStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', sessionData.userId)
        .single();

      if (!currentStats) return;

      // Calculate new statistics
      const totalBattles = (currentStats.total_battles_played || 0) + 1;
      const totalWins = (currentStats.total_battles_won || 0) + (sessionData.result === 'win' ? 1 : 0);
      const winRate = (totalWins / totalBattles) * 100;
      
      // Calculate streak
      let currentStreak = currentStats.current_win_streak || 0;
      let bestStreak = currentStats.best_win_streak || 0;
      
      if (sessionData.result === 'win') {
        currentStreak += 1;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else if (sessionData.result === 'loss') {
        currentStreak = 0;
      }

      // Update battle rating (simplified ELO-like system)
      let newRating = currentStats.battle_rating || 1000;
      if (sessionData.battleType === 'ranked') {
        const ratingChange = this.calculateRatingChange(
          sessionData.result,
          sessionData.questionsCorrect,
          sessionData.totalQuestions
        );
        newRating = Math.max(800, Math.min(2400, newRating + ratingChange));
      }

      // Update user_stats
      const { error } = await supabase
        .from('user_stats')
        .update({
          total_battles_played: totalBattles,
          total_battles_won: totalWins,
          current_win_streak: currentStreak,
          best_win_streak: bestStreak,
          win_rate: winRate,
          battle_rating: newRating,
          total_battle_xp: (currentStats.total_battle_xp || 0) + sessionData.xpGained,
          total_coins_won: (currentStats.total_coins_won || 0) + sessionData.coinsWon,
          last_battle_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', sessionData.userId);

      if (error) {
        console.error('❌ Error updating user battle stats:', error);
      }
      
    } catch (error) {
      console.error('❌ Error in updateUserBattleStats:', error);
    }
  }

  // 🎯 Calculate rating change based on performance
  static calculateRatingChange(result: string, correct: number, total: number): number {
    const baseChange = 25;
    const accuracyBonus = (correct / total) * 10;
    
    if (result === 'win') {
      return baseChange + accuracyBonus;
    } else if (result === 'loss') {
      return -(baseChange - accuracyBonus);
    } else {
      return 0; // Draw
    }
  }

  // 📊 Get comprehensive user battle insights
  static async getUserBattleInsights(userId: string): Promise<BattleInsights | null> {
    try {
      // Get user stats
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!userStats) return null;

      // Get recent battle analytics for detailed insights
      const { data: recentBattles } = await supabase
        .from('battle_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      // Calculate insights
      const totalBattles = userStats.total_battles_played || 0;
      const wins = userStats.total_battles_won || 0;
      const losses = totalBattles - wins; // Simplified for now
      const draws = 0; // Can be calculated from battle_analytics if needed

      // Calculate subject performance from recent battles
      const subjectPerformance = this.analyzeSubjectPerformance(recentBattles || []);
      
      // Calculate average metrics
      const avgAccuracy = recentBattles?.length > 0 
        ? recentBattles.reduce((sum, battle) => sum + (battle.accuracy || 0), 0) / recentBattles.length
        : 0;

      const avgResponseTime = recentBattles?.length > 0
        ? recentBattles.reduce((sum, battle) => sum + (battle.avg_response_time || 0), 0) / recentBattles.length
        : 0;

      return {
        totalBattles,
        wins,
        losses,
        draws,
        winRate: userStats.win_rate || 0,
        currentStreak: userStats.current_win_streak || 0,
        bestStreak: userStats.best_win_streak || 0,
        avgAccuracy,
        avgResponseTime,
        strongestSubjects: subjectPerformance.strongest,
        weakestSubjects: subjectPerformance.weakest,
        totalXpEarned: userStats.total_battle_xp || 0,
        totalCoinsWon: userStats.total_coins_won || 0,
        favoriteOpponentType: 'bot', // Can be calculated from battle data
        peakRating: userStats.peak_battle_rating || userStats.battle_rating || 1000,
        currentRating: userStats.battle_rating || 1000
      };

    } catch (error) {
      console.error('❌ Error getting user battle insights:', error);
      return null;
    }
  }

  // 📊 Analyze subject performance
  static analyzeSubjectPerformance(battles: any[]): { strongest: string[], weakest: string[] } {
    if (!battles.length) return { strongest: [], weakest: [] };

    const subjectStats: { [key: string]: { total: number, correct: number } } = {};

    battles.forEach(battle => {
      if (battle.strongest_subject) {
        if (!subjectStats[battle.strongest_subject]) {
          subjectStats[battle.strongest_subject] = { total: 0, correct: 0 };
        }
        subjectStats[battle.strongest_subject].total += 1;
        subjectStats[battle.strongest_subject].correct += 1;
      }

      if (battle.weakest_subject && battle.weakest_subject !== battle.strongest_subject) {
        if (!subjectStats[battle.weakest_subject]) {
          subjectStats[battle.weakest_subject] = { total: 0, correct: 0 };
        }
        subjectStats[battle.weakest_subject].total += 1;
      }
    });

    // Calculate accuracy rates and sort
    const subjects = Object.entries(subjectStats)
      .map(([subject, stats]) => ({
        subject,
        accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
      }))
      .sort((a, b) => b.accuracy - a.accuracy);

    return {
      strongest: subjects.slice(0, 3).map(s => s.subject),
      weakest: subjects.slice(-3).map(s => s.subject).reverse()
    };
  }

  // 📈 Get battle history with pagination
  static async getBattleHistory(userId: string, limit: number = 20, offset: number = 0): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('battle_results')
        .select(`
          *,
          battle_rooms (
            battle_type,
            subject,
            difficulty
          )
        `)
        .or(`winner_id.eq.${userId},loser_id.eq.${userId}`)
        .order('completed_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('❌ Error fetching battle history:', error);
        return [];
      }

      return data || [];
      
    } catch (error) {
      console.error('❌ Error in getBattleHistory:', error);
      return [];
    }
  }

  // 🏆 Get global battle leaderboard
  static async getBattleLeaderboard(timeframe: 'daily' | 'weekly' | 'monthly' | 'all' = 'all', limit: number = 50): Promise<any[]> {
    try {
      let query = supabase
        .from('user_stats')
        .select(`
          user_id,
          total_battles_played,
          total_battles_won,
          win_rate,
          battle_rating,
          current_win_streak,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .gt('total_battles_played', 0)
        .order('battle_rating', { ascending: false })
        .limit(limit);

      // Apply timeframe filter if needed
      if (timeframe !== 'all') {
        const dateThreshold = new Date();
        if (timeframe === 'daily') {
          dateThreshold.setDate(dateThreshold.getDate() - 1);
        } else if (timeframe === 'weekly') {
          dateThreshold.setDate(dateThreshold.getDate() - 7);
        } else if (timeframe === 'monthly') {
          dateThreshold.setMonth(dateThreshold.getMonth() - 1);
        }
        
        query = query.gte('last_battle_at', dateThreshold.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching battle leaderboard:', error);
        return [];
      }

      return data || [];
      
    } catch (error) {
      console.error('❌ Error in getBattleLeaderboard:', error);
      return [];
    }
  }

  // 🎯 Get user's ranking position
  static async getUserRankingPosition(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_battle_rank', { p_user_id: userId });

      if (error) {
        console.error('❌ Error getting user ranking:', error);
        return 0;
      }

      return data || 0;
      
    } catch (error) {
      console.error('❌ Error in getUserRankingPosition:', error);
      return 0;
    }
  }
}
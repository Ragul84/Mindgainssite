// 🎖️ XP and Battle Completion System - World Class Experience
import { supabase, SupabaseService } from './supabaseService';
import { safeAwardUserXP, safeUpsertUserStats } from './constraintSafeService';

export class XPService {
  // 📚 Award XP for StudyHub topic completion
  static async awardStudyXP(userId: string, data: {
    topicId: string;
    subjectName: string;
    readingTime: number; // in seconds
    sectionsRead: number;
    totalSections: number;
  }) {
    try {
      console.log(`📚 Awarding study XP to user ${userId} for topic ${data.topicId}`);
      
      // Calculate XP based on completion
      let xpAmount = 0;
      
      // Base study XP
      xpAmount += 25;
      
      // Completion bonus (if read 80%+ sections)
      const completionRate = data.sectionsRead / data.totalSections;
      if (completionRate >= 0.8) {
        xpAmount += 15; // Full completion bonus
      } else if (completionRate >= 0.5) {
        xpAmount += 10; // Partial completion bonus
      }
      
      // Time spent bonus (engagement reward)
      if (data.readingTime > 120) { // 2+ minutes
        xpAmount += 10;
      }
      
      console.log(`📖 Study XP calculation: ${xpAmount} (completion: ${Math.round(completionRate * 100)}%, time: ${data.readingTime}s)`);
      
      // Award XP using constraint-safe service
      const result = await safeAwardUserXP(userId, xpAmount, 'study');
      
      // Record study session in progress tracking
      await this.recordStudySession(userId, data, xpAmount);
      
      return result;
    } catch (error) {
      console.error('Error awarding study XP:', error);
      throw error;
    }
  }
  
  // 📝 Record study session for tracking
  static async recordStudySession(userId: string, data: {
    topicId: string;
    subjectName: string;
    readingTime: number;
    sectionsRead: number;
    totalSections: number;
  }, xpEarned: number) {
    try {
      const { error } = await supabase
        .from('quiz_history')
        .insert({
          user_id: userId,
          quiz_type: 'study_notes',
          subject: data.subjectName,
          topic: data.topicId,
          score: data.sectionsRead,
          total_questions: data.totalSections,
          correct_answers: data.sectionsRead,
          time_taken: data.readingTime,
          xp_earned: xpEarned,
          questions_data: [{
            type: 'study_completion',
            sections_read: data.sectionsRead,
            total_sections: data.totalSections,
            completion_rate: data.sectionsRead / data.totalSections
          }]
        });
      
      if (error) throw error;
      console.log('✅ Study session recorded in quiz_history');
    } catch (error) {
      console.error('Error recording study session:', error);
      // Don't throw - XP was already awarded
    }
  }
  // 📊 Award XP for quiz completion across all tools
  static async awardQuizXP(userId: string, data: {
    quizType: 'daily' | 'topic' | 'subject' | 'battle' | 'mission' | 'adaptive';
    score: number;
    totalQuestions: number;
    timeTaken: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    subjectName?: string;
    topicId?: string;
  }) {
    try {
      console.log(`🎯 Awarding quiz XP to user ${userId} for ${data.quizType} quiz`);
      
      // Calculate XP based on performance
      let xpAmount = 0;
      
      // Base quiz completion XP
      xpAmount += 50;
      
      // Accuracy bonus (5-15 XP per correct answer based on difficulty)
      const accuracyXP = data.difficulty === 'hard' ? 15 : data.difficulty === 'easy' ? 5 : 10;
      xpAmount += data.score * accuracyXP;
      
      // Perfect score bonus
      if (data.score === data.totalQuestions) {
        xpAmount += 25;
      }
      
      // Speed bonus (quick completion)
      const avgTimePerQuestion = data.timeTaken / data.totalQuestions;
      if (avgTimePerQuestion < 30) {
        xpAmount += Math.floor(xpAmount * 0.1); // 10% speed bonus
      }
      
      // Quiz type multipliers
      if (data.quizType === 'mission') {
        xpAmount = Math.floor(xpAmount * 1.5); // 50% bonus for missions
      } else if (data.quizType === 'battle') {
        xpAmount = Math.floor(xpAmount * 1.2); // 20% bonus for battles
      }
      
      console.log(`🎮 Quiz XP calculation: ${xpAmount} (${data.score}/${data.totalQuestions}, ${data.timeTaken}s)`);
      
      // Award XP using constraint-safe service
      const result = await safeAwardUserXP(userId, xpAmount, data.quizType);
      
      // Record in quiz history using ProgressService
      if (data.quizType !== 'battle') { // Battles are recorded separately
        await this.recordQuizHistory(userId, data, xpAmount);
      }
      
      return result;
    } catch (error) {
      console.error('Error awarding quiz XP:', error);
      throw error;
    }
  }
  
  // 📝 Record quiz history
  static async recordQuizHistory(userId: string, data: {
    quizType: string;
    score: number;
    totalQuestions: number;
    timeTaken: number;
    subjectName?: string;
    topicId?: string;
  }, xpEarned: number) {
    try {
      const { error } = await supabase
        .from('quiz_history')
        .insert({
          user_id: userId,
          quiz_type: data.quizType,
          subject: data.subjectName,
          topic: data.topicId,
          score: data.score,
          total_questions: data.totalQuestions,
          correct_answers: data.score,
          time_taken: data.timeTaken,
          xp_earned: xpEarned
        });
      
      if (error) throw error;
      console.log('✅ Quiz result recorded in quiz_history');
    } catch (error) {
      console.error('Error recording quiz history:', error);
      // Don't throw - XP was already awarded
    }
  }
  
  // 🎯 Award XP with level progression and comprehensive tracking
  static async addUserXP(userId: string, xpAmount: number, source: string = 'general') {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        console.log(`🎯 Awarding ${xpAmount} XP to user ${userId} from ${source} (attempt ${retryCount + 1})`);
        
        // Get current user stats
        const { data: currentStats, error: fetchError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

      const currentXP = currentStats?.total_xp || 0;
      const currentLevel = currentStats?.current_level || 1;
      const newXP = currentXP + xpAmount;
      
      // Calculate level progression (100 XP per level, scaling)
      const calculateLevel = (xp: number) => {
        return Math.floor(Math.sqrt(xp / 100)) + 1;
      };
      
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > currentLevel;
      
      // Calculate streak days based on last activity
      const today = new Date().toISOString().split('T')[0];
      const lastActivityDate = currentStats?.last_activity_date;
      let streakDays = currentStats?.streak_days || 0;
      
      if (lastActivityDate) {
        const lastDate = new Date(lastActivityDate);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          // Consecutive day - increment streak
          streakDays += 1;
        } else if (daysDiff === 0) {
          // Same day - keep current streak
          // Don't change streakDays
        } else {
          // Gap in activity - reset streak to 1
          streakDays = 1;
        }
      } else {
        // First time - start streak at 1
        streakDays = 1;
      }
      
      // Increment quiz count if source indicates quiz completion
      const isQuizSource = ['daily', 'topic', 'subject', 'battle', 'mission', 'adaptive', 'quiz'].includes(source);
      const currentQuizCount = currentStats?.total_quizzes_taken || 0;
      const newQuizCount = isQuizSource ? currentQuizCount + 1 : currentQuizCount;
      
      // Update user stats with comprehensive tracking
      const updateData = {
        user_id: userId,
        total_xp: newXP,
        current_level: newLevel,
        total_quizzes_taken: newQuizCount,
        streak_days: streakDays,
        last_activity_date: today,
        updated_at: new Date().toISOString(),
        ...(currentStats ? {} : { 
          total_battles_played: 0,
          total_battles_won: 0,
          rank: 'Novice',
          coins: 0,
          gems: 0,
          created_at: new Date().toISOString()
        })
      };

      const { error: updateError } = await supabase
        .from('user_stats')
        .upsert(updateData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        });

      if (updateError) throw updateError;
      
      console.log(`✅ XP awarded! ${currentXP} → ${newXP} (Level ${currentLevel} → ${newLevel})`);
      console.log(`📊 Updated stats: Quizzes ${currentQuizCount} → ${newQuizCount}, Streak: ${streakDays} days`);
      
        return {
          xpGained: xpAmount,
          totalXP: newXP,
          leveledUp,
          oldLevel: currentLevel,
          newLevel,
          quizCount: newQuizCount,
          streakDays: streakDays,
          source
        };
      } catch (error: any) {
        retryCount++;
        console.error(`Error adding user XP (attempt ${retryCount}):`, error);
        
        // If it's a duplicate key error and we have retries left, wait and retry
        if (error.code === '23505' && retryCount < maxRetries) {
          console.log(`🔄 Retrying in ${retryCount * 100}ms due to constraint violation...`);
          await new Promise(resolve => setTimeout(resolve, retryCount * 100));
          continue;
        }
        
        // Otherwise throw the error
        throw error;
      }
    }
    
    // If we get here, all retries failed
    throw new Error(`Failed to award XP after ${maxRetries} attempts`);
  }

  // 🏆 Complete Battle with XP & Stats - World Class Implementation!
  static async completeBattleWithRewards(battleData: {
    roomId?: string;
    userId: string;
    opponentId?: string;
    userScore: number;
    opponentScore: number;
    questionsTotal: number;
    questionsCorrect: number;
    timeTaken: number;
    battleType: string;
    betAmount?: number;
  }) {
    try {
      const isWinner = battleData.userScore > battleData.opponentScore;
      const isDraw = battleData.userScore === battleData.opponentScore;
      
      console.log(`🏆 Completing battle: ${isWinner ? 'WIN' : isDraw ? 'DRAW' : 'LOSS'}`);
      
      // Calculate XP based on performance
      let xpGained = 0;
      
      // Base XP for participation
      xpGained += 10;
      
      // Performance bonuses
      if (isWinner) xpGained += 25; // Win bonus
      if (isDraw) xpGained += 15; // Draw bonus
      
      // Accuracy bonus (1 XP per correct answer)
      xpGained += battleData.questionsCorrect;
      
      // Speed bonus (if completed quickly)
      if (battleData.timeTaken < 180) xpGained += 10; // Under 3 minutes
      
      // Perfect game bonus
      if (battleData.questionsCorrect === battleData.questionsTotal) {
        xpGained += 20;
      }
      
      console.log(`💎 Calculated XP reward: ${xpGained}`);
      
      // Calculate coin rewards
      let coinsWon = 0;
      if (battleData.betAmount && battleData.betAmount > 0) {
        if (isWinner) {
          // Winner gets their bet back + opponent's bet (2x bet amount)
          coinsWon = battleData.betAmount * 2;
        } else if (isDraw) {
          // Draw: get your bet back
          coinsWon = battleData.betAmount;
        }
        // Loser gets nothing (already deducted when betting)
      }
      
      console.log(`💰 Calculated coin reward: ${coinsWon} coins`);
      
      // Award XP and get progression info using constraint-safe service
      const xpResult = await safeAwardUserXP(battleData.userId, xpGained, 'battle');
      
      // Award coins if won any
      let finalCoinBalance = 0;
      if (coinsWon > 0) {
        finalCoinBalance = await SupabaseService.addCoins(coinsWon, battleData.userId);
        console.log(`💰 Awarded ${coinsWon} coins. New balance: ${finalCoinBalance}`);
      }
      
      // Save battle result to database
      const resultData = {
        room_id: battleData.roomId || null,
        winner_id: isWinner ? battleData.userId : battleData.opponentId,
        loser_id: isWinner ? battleData.opponentId : battleData.userId,
        winner_score: isWinner ? battleData.userScore : battleData.opponentScore,
        loser_score: isWinner ? battleData.opponentScore : battleData.userScore,
        questions_count: battleData.questionsTotal,
        battle_duration: battleData.timeTaken,
        completed_at: new Date().toISOString()
      };
      
      const { data: savedResult, error: saveError } = await supabase
        .from('battle_results')
        .insert(resultData)
        .select()
        .single();
        
      if (saveError) {
        console.error('Error saving battle result:', saveError);
        // Don't throw - XP was already awarded
      } else {
        console.log('✅ Battle result saved to database');
      }
      
      // Record comprehensive battle analytics
      const result = isWinner ? 'win' : isDraw ? 'draw' : 'loss';
      
      // Import and use the new BattleAnalyticsService
      const BattleAnalyticsServiceModule = require('./battleAnalyticsService');
      const BattleAnalyticsService = BattleAnalyticsServiceModule.BattleAnalyticsService;
      await BattleAnalyticsService.recordBattleSession({
        userId: battleData.userId,
        battleId: savedResult?.id || `battle_${Date.now()}`,
        roomId: battleData.roomId,
        opponentId: battleData.opponentId,
        battleType: battleData.battleType as any,
        questionsCorrect: battleData.questionsCorrect,
        totalQuestions: battleData.questionsTotal,
        timeTaken: battleData.timeTaken,
        avgResponseTime: battleData.timeTaken / battleData.questionsTotal * 1000, // Convert to ms
        subjects: [], // Can be populated from question data
        result: result as any,
        xpGained: xpResult.xpGained,
        coinsWon,
        betAmount: battleData.betAmount
      });
      
      // Update legacy battle statistics (kept for backward compatibility)
      await this.updateBattleStats(battleData.userId, {
        won: isWinner,
        score: battleData.userScore,
        questionsCorrect: battleData.questionsCorrect,
        questionsTotal: battleData.questionsTotal,
        timeTaken: battleData.timeTaken
      });
      
      return {
        result,
        xpGained: xpResult.xpGained,
        totalXP: xpResult.totalXP,
        leveledUp: xpResult.leveledUp,
        oldLevel: (xpResult as any).oldLevel || (xpResult.newLevel ? xpResult.newLevel - (xpResult.leveledUp ? 1 : 0) : 1),
        newLevel: xpResult.newLevel,
        coinsWon,
        finalCoinBalance,
        battleId: savedResult?.id
      };
    } catch (error) {
      console.error('Error completing battle with rewards:', error);
      throw error;
    }
  }

  // 📊 Enhanced Battle Stats Update
  static async updateBattleStats(userId: string, battleData: {
    won: boolean;
    score: number;
    questionsCorrect: number;
    questionsTotal: number;
    timeTaken: number;
  }) {
    try {
      // Get current user stats
      const { data: currentStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      // Calculate new battle stats - handling missing columns gracefully
      const currentBattlesPlayed = 0; // Column doesn't exist in current schema
      const currentBattlesWon = 0; // Column doesn't exist in current schema
      
      const battlesPlayed = currentBattlesPlayed + 1;
      const battlesWon = currentBattlesWon + (battleData.won ? 1 : 0);
      
      // Use constraint-safe upsert for battle stats
      // Since total_battles_played and total_battles_won don't exist in the schema,
      // we'll just update the last_activity_date to show recent activity
      const result = await safeUpsertUserStats(userId, {
        last_activity_date: new Date().toISOString().split('T')[0]
      } as any);
      
      if (result.success) {
        console.log(`📊 Battle activity recorded for user ${userId}`);
      } else {
        console.error('Error updating battle stats:', result.error);
      }
      
    } catch (error) {
      console.error('Error updating battle stats:', error);
      // Don't throw - this is not critical for the battle completion
    }
  }
  
  // 🌟 Award XP for general achievements
  static async awardAchievementXP(userId: string, data: {
    achievementName: string;
    xpReward: number;
    category: string;
  }) {
    try {
      console.log(`🌟 Awarding achievement XP: ${data.achievementName} (+${data.xpReward})`);
      
      const result = await safeAwardUserXP(userId, data.xpReward, 'achievement');
      
      return result;
    } catch (error) {
      console.error('Error awarding achievement XP:', error);
      throw error;
    }
  }

  // 🎯 General purpose XP award method
  static async awardXP(userId: string, amount: number, source: string = 'general') {
    try {
      console.log(`🎯 Awarding ${amount} XP to user ${userId} from ${source}`);
      
      const result = await safeAwardUserXP(userId, amount, source);
      
      return result;
    } catch (error) {
      console.error('Error awarding XP:', error);
      throw error;
    }
  }
}
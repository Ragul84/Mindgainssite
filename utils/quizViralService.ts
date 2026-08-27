import { supabase, SupabaseService } from './supabaseService';
import HapticService from './hapticService';

export interface ViralQuiz {
  id: string;
  creator_id: string;
  title: string;
  prize_pool: number;
  winner_count: number;
  status: 'active' | 'completed';
  created_at: string;
}

export interface Participant {
  user_id: string;
  user_name: string;
  score: number;
  time_taken: number;
  rank: number;
}

export class QuizViralService {
  /**
   * Staking coins and creating the viral quiz
   */
  static async createViralQuiz(data: {
    title: string;
    prizePool: number;
    winnerCount: number;
    questions: any[];
  }) {
    try {
      const user = await SupabaseService.getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      // 1. Check if user can afford the prize pool
      const canAfford = await SupabaseService.checkCanAfford(data.prizePool);
      if (!canAfford) throw new Error('Insufficient coins to stake this prize pool');

      // 2. Deduct coins from creator
      const deducted = await SupabaseService.deductCoins(data.prizePool);
      if (!deducted) throw new Error('Failed to stake coins');

      // 3. Create quiz record in 'user_quizzes' (Assume this table exists or will be created)
      const { data: quiz, error } = await supabase
        .from('user_quizzes')
        .insert({
          creator_id: user.id,
          title: data.title,
          prize_pool: data.prizePool,
          winner_count: data.winnerCount,
          questions_data: data.questions,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      HapticService.notification('success');
      return quiz;
    } catch (error) {
      console.error('Error creating viral quiz:', error);
      throw error;
    }
  }

  /**
   * Fetches the real-time leaderboard for a specific viral quiz
   */
  static async getLeaderboard(quizId: string): Promise<Participant[]> {
    try {
      // Query quiz_history for entries related to this viral quiz
      const { data, error } = await supabase
        .from('quiz_history')
        .select(`
          user_id,
          score,
          time_taken,
          profiles:user_id ( full_name )
        `)
        .eq('quiz_type', 'viral')
        .eq('topic', quizId)
        .order('score', { ascending: false })
        .order('time_taken', { ascending: true })
        .limit(50);

      if (error) throw error;

      return data.map((item: any, index: number) => ({
        user_id: item.user_id,
        user_name: item.profiles?.full_name || 'Anonymous Warrior',
        score: item.score,
        time_taken: item.time_taken,
        rank: index + 1
      }));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  /**
   * Distributes the prize pool to the top winners
   */
  static async distributeRewards(quizId: string) {
    try {
      // 1. Get quiz details to know prize pool and winner count
      const { data: quiz, error: quizError } = await supabase
        .from('user_quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (quizError || !quiz) throw new Error('Quiz not found');
      if (quiz.status === 'completed') throw new Error('Rewards already distributed');

      // 2. Get top participants
      const participants = await this.getLeaderboard(quizId);
      const winners = participants.slice(0, quiz.winner_count);

      if (winners.length === 0) throw new Error('No participants to reward');

      // 3. Logic for splitting the pool (Simple split for now)
      // Rank 1: 50%, Rank 2: 30%, Rank 3: 20% (if winner_count is 3)
      // For now, let's just do an equal split or a weighted one if count is small
      const rewards = this.calculateSplits(quiz.prize_pool, winners.length);

      // 4. Distribute coins to each winner
      const distributionPromises = winners.map((winner, index) => {
        const amount = rewards[index] || 0;
        return SupabaseService.addCoins(amount, winner.user_id);
      });

      await Promise.all(distributionPromises);

      // 5. Mark quiz as completed
      await supabase
        .from('user_quizzes')
        .update({ status: 'completed' })
        .eq('id', quizId);

      HapticService.notification('success');
      return true;
    } catch (error) {
      console.error('Error distributing rewards:', error);
      throw error;
    }
  }

  private static calculateSplits(total: number, count: number): number[] {
    if (count === 1) return [total];
    if (count === 3) return [Math.floor(total * 0.5), Math.floor(total * 0.3), Math.floor(total * 0.2)];
    
    // Equal split fallback
    const base = Math.floor(total / count);
    return new Array(count).fill(base);
  }
}

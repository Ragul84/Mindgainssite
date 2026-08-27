import { supabase } from './supabaseService';
import { SupabaseService } from './supabaseService';
import HapticService from './hapticService';
import RedisService from './redisService';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuizRoom {
  id: string;
  creator_id: string;
  creator_name: string;
  title: string;
  topic: string;
  exam_category: string | null;
  question_count: number;
  time_per_question: number; // seconds
  prize_pool: number;
  winner_count: number;           // Top 3 or Top 5
  prize_splits: number[];         // e.g. [50, 30, 20]
  questions_data: QuizQuestion[];
  status: 'waiting' | 'active' | 'completed';
  join_code: string;
  participant_count: number;
  created_at: string;
  ended_at: string | null;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer_index: number;
  explanation?: string;
}

export interface RoomParticipant {
  id: string;
  room_id: string;
  user_id: string | null;
  display_name: string;
  score: number;
  time_taken: number; // total seconds
  rank: number | null;
  coin_reward: number;
  answers: ParticipantAnswer[];
  joined_at: string;
  completed_at: string | null;
}

export interface ParticipantAnswer {
  question_index: number;
  selected_index: number;
  is_correct: boolean;
  time_taken: number; // seconds for this question
}

export interface LeaderboardEntry {
  rank: number;
  display_name: string;
  score: number;
  time_taken: number;
  coin_reward: number;
  is_me: boolean;
}

// ─── Room CRUD ─────────────────────────────────────────────────────────────────

export class QuizRoomsService {

  // Generate a short human-readable join code like "TIGER42"
  static generateJoinCode(): string {
    const words = ['STAR', 'BOLT', 'LION', 'NOVA', 'BLAZE', 'APEX', 'WOLF', 'SAGE', 'HAWK', 'TIDE'];
    const word = words[Math.floor(Math.random() * words.length)];
    const num = Math.floor(10 + Math.random() * 90);
    return `${word}${num}`;
  }

  // Calculate prize splits for winner_count
  static calculatePrizeSplits(prizePool: number, winnerCount: number): number[] {
    if (winnerCount === 1) return [prizePool];
    if (winnerCount === 3) return [
      Math.floor(prizePool * 0.50),
      Math.floor(prizePool * 0.30),
      Math.floor(prizePool * 0.20),
    ];
    if (winnerCount === 5) return [
      Math.floor(prizePool * 0.40),
      Math.floor(prizePool * 0.25),
      Math.floor(prizePool * 0.17),
      Math.floor(prizePool * 0.10),
      Math.floor(prizePool * 0.08),
    ];
    // Equal split fallback
    const base = Math.floor(prizePool / winnerCount);
    return Array(winnerCount).fill(base);
  }

  // ── Create a new quiz room (escrows coins from creator) ──────────────────────
  static async createRoom(data: {
    title: string;
    topic: string;
    examCategory?: string;
    questionCount: number;
    timePerQuestion: number;
    prizePool: number;
    winnerCount: number;
    questions: QuizQuestion[];
  }): Promise<QuizRoom> {
    const user = await SupabaseService.getCurrentUser();
    if (!user) throw new Error('Please log in to create a room');

    // Escrow: check & deduct coins
    if (data.prizePool > 0) {
      const canAfford = await SupabaseService.checkCanAfford(data.prizePool);
      if (!canAfford) throw new Error('Insufficient coins for this prize pool');
      const deducted = await SupabaseService.deductCoins(data.prizePool);
      if (!deducted) throw new Error('Failed to escrow prize coins');
    }

    const joinCode = this.generateJoinCode();
    const prizeSplits = this.calculatePrizeSplits(data.prizePool, data.winnerCount);

    // Get creator display name
    let creatorName = 'Host';
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      creatorName = profile?.full_name || 'Host';
    } catch {}

    const { data: room, error } = await supabase
      .from('quiz_rooms')
      .insert({
        creator_id: user.id,
        creator_name: creatorName,
        title: data.title,
        topic: data.topic,
        exam_category: data.examCategory || null,
        question_count: data.questionCount,
        time_per_question: data.timePerQuestion,
        prize_pool: data.prizePool,
        winner_count: data.winnerCount,
        prize_splits: prizeSplits,
        questions_data: data.questions,
        status: 'waiting',
        join_code: joinCode,
        participant_count: 0,
      })
      .select()
      .single();

    if (error) throw error;
    HapticService.success();
    return room as QuizRoom;
  }

  // ── Fetch room by ID ──────────────────────────────────────────────────────────
  static async getRoomById(roomId: string): Promise<QuizRoom | null> {
    const { data, error } = await supabase
      .from('quiz_rooms')
      .select('*')
      .eq('id', roomId)
      .single();
    if (error) return null;
    return data as QuizRoom;
  }

  // ── Fetch room by join code ────────────────────────────────────────────────
  static async getRoomByCode(code: string): Promise<QuizRoom | null> {
    const { data, error } = await supabase
      .from('quiz_rooms')
      .select('*')
      .eq('join_code', code.toUpperCase().trim())
      .single();
    if (error) return null;
    return data as QuizRoom;
  }

  // ── My created rooms ───────────────────────────────────────────────────────
  static async getMyRooms(): Promise<QuizRoom[]> {
    const user = await SupabaseService.getCurrentUser();
    if (!user) return [];
    const { data } = await supabase
      .from('quiz_rooms')
      .select('*')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    return (data || []) as QuizRoom[];
  }

  // ── Join a room (create participant record) ────────────────────────────────
  static async joinRoom(roomId: string, displayName: string): Promise<RoomParticipant> {
    const user = await SupabaseService.getCurrentUser();

    const { data: participant, error } = await supabase
      .from('quiz_room_participants')
      .insert({
        room_id: roomId,
        user_id: user?.id || null,
        display_name: displayName,
        score: 0,
        time_taken: 0,
        answers: [],
        coin_reward: 0,
      })
      .select()
      .single();

    if (error) throw error;

    // Increment participant count
    await supabase.rpc('increment_room_participants', { room_id: roomId });

    HapticService.success();
    return participant as RoomParticipant;
  }

  // ── Submit final score for a participant ──────────────────────────────────
  static async submitScore(participantId: string, data: {
    score: number;
    timeTaken: number;
    answers: ParticipantAnswer[];
  }): Promise<void> {
    const { error } = await supabase
      .from('quiz_room_participants')
      .update({
        score: data.score,
        time_taken: data.timeTaken,
        answers: data.answers,
        completed_at: new Date().toISOString(),
      })
      .eq('id', participantId);

    if (error) throw error;
  }

  // ── Get leaderboard for a room ─────────────────────────────────────────────
  static async getLeaderboard(roomId: string, currentParticipantId?: string): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
      .from('quiz_room_participants')
      .select('id, display_name, score, time_taken, rank, coin_reward')
      .eq('room_id', roomId)
      .not('completed_at', 'is', null)
      .order('score', { ascending: false })
      .order('time_taken', { ascending: true })
      .limit(50);

    if (error) return [];

    return (data || []).map((p: any, index: number) => ({
      rank: p.rank ?? index + 1,
      display_name: p.display_name,
      score: p.score,
      time_taken: p.time_taken,
      coin_reward: p.coin_reward,
      is_me: p.id === currentParticipantId,
    }));
  }

  // ── Live participant count (poll this) ─────────────────────────────────────
  static async getParticipantCount(roomId: string): Promise<number> {
    const { count } = await supabase
      .from('quiz_room_participants')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', roomId);
    return count || 0;
  }

  // ── Close room & distribute coins to winners (creator calls this) ──────────
  static async closeAndDistribute(roomId: string): Promise<{ success: boolean; message: string }> {
    const user = await SupabaseService.getCurrentUser();
    if (!user) return { success: false, message: 'Not authenticated' };

    const room = await this.getRoomById(roomId);
    if (!room) return { success: false, message: 'Room not found' };
    if (room.creator_id !== user.id) return { success: false, message: 'Only the creator can close this room' };
    if (room.status === 'completed') return { success: false, message: 'Prizes already distributed' };

    // Get ranked participants (completed ones only)
    const { data: participants, error } = await supabase
      .from('quiz_room_participants')
      .select('id, user_id, display_name, score, time_taken')
      .eq('room_id', roomId)
      .not('completed_at', 'is', null)
      .order('score', { ascending: false })
      .order('time_taken', { ascending: true });

    if (error) return { success: false, message: 'Failed to fetch participants' };

    const winners = (participants || []).slice(0, room.winner_count);
    const splits = room.prize_splits;

    // Assign ranks & distribute coins
    const updatePromises = (participants || []).map(async (p: any, index: number) => {
      const rank = index + 1;
      const coinReward = index < splits.length ? splits[index] : 0;

      await supabase
        .from('quiz_room_participants')
        .update({ rank, coin_reward: coinReward })
        .eq('id', p.id);

      // Credit coins to winner's wallet
      if (coinReward > 0 && p.user_id) {
        await SupabaseService.addCoins(coinReward, p.user_id);
      }
    });

    await Promise.all(updatePromises);

    // Mark room completed
    await supabase
      .from('quiz_rooms')
      .update({ status: 'completed', ended_at: new Date().toISOString() })
      .eq('id', roomId);

    HapticService.success();
    return { success: true, message: `Coins distributed to top ${winners.length} winners!` };
  }

  // Helper to map free-text topics to existing Redis database keys
  static matchRedisKey(topic: string): string | null {
    const t = topic.toLowerCase().trim();
    if (t.includes('tamil')) return 'tamil';
    if (t.includes('history') || t.includes('ancient') || t.includes('medieval') || t.includes('modern') || t.includes('freedom') || t.includes('national movement')) return 'history';
    if (t.includes('math') || (t.includes('quant') && !t.includes('quantum')) || t.includes('aptitude') || t.includes('algebra') || t.includes('simplification') || t.includes('lcm') || t.includes('hcf') || t.includes('interest') || t.includes('work') || t.includes('ratio')) return 'maths';
    if (t.includes('polity') || t.includes('constitution') || t.includes('parliament') || t.includes('civics') || t.includes('governance') || t.includes('government')) return 'polity';
    if (t.includes('econ') || t.includes('budget') || t.includes('gdp') || t.includes('tax') || t.includes('gst')) return 'economics';
    if (t.includes('geography') || t.includes('earth') || t.includes('soil') || t.includes('river') || t.includes('climate') || t.includes('monsoon') || t.includes('ocean')) return 'geography';
    if (t.includes('science') || t.includes('physics') || t.includes('chemistry') || t.includes('biology') || t.includes('flask') || t.includes('disease') || t.includes('health') || t.includes('atom') || t.includes('cell') || t.includes('plant') || t.includes('environment') || t.includes('ecology') || t.includes('quantum')) return 'science';
    if (t.includes('english') || t.includes('comprehension') || t.includes('grammar') || t.includes('vocab')) return 'english';
    if (t.includes('current') || t.includes('affair') || t.includes('news') || t.includes('event')) return 'current_affairs';
    if (t.includes('reasoning') || t.includes('intelligence') || t.includes('puzzle') || t.includes('series') || t.includes('coding')) return 'reasoning';
    return null;
  }

  static async generateQuestions(topic: string, count: number): Promise<QuizQuestion[]> {
    const cleanTopic = topic.trim();
    if (!cleanTopic) return [];

    try {
      // 1. Try to search in the Redis database from Quiz Hub first (High-yield free source!)
      const matchedKey = this.matchRedisKey(cleanTopic);
      if (matchedKey) {
        console.log(`🔍 Redis Lookup: Matched topic "${cleanTopic}" to Redis key "${matchedKey}". Fetching random quiz questions...`);
        try {
          const redisQuestions = await RedisService.getQuestions(matchedKey, count);
          if (redisQuestions && redisQuestions.length > 0) {
            console.log(`🎯 Redis Hit! Chosen ${redisQuestions.length} random questions from Quiz Hub database.`);
            return redisQuestions.map((q: any) => ({
              question: q.question_text || q.question || 'Sample Question',
              options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
              answer_index: typeof q.correct_answer === 'number' ? q.correct_answer : (typeof q.answer_index === 'number' ? q.answer_index : 0),
              explanation: q.explanation || '',
            }));
          }
        } catch (redisErr) {
          console.warn('⚠️ Redis fetch failed, proceeding to next fallbacks. Error:', redisErr);
        }
      }

      // 2. Try to find a past quiz room matching the topic in Postgres database
      console.log('🔍 Database Caching: Checking for existing quiz rooms on topic:', cleanTopic);
      const { data: existingRooms, error: dbError } = await supabase
        .from('quiz_rooms')
        .select('questions_data')
        .ilike('topic', `%${cleanTopic}%`)
        .order('created_at', { ascending: false })
        .limit(10); // Check the 10 most recent rooms

      if (!dbError && existingRooms && existingRooms.length > 0) {
        // Iterate through rooms to find one with enough questions
        for (const room of existingRooms) {
          const qList = (room.questions_data || []) as QuizQuestion[];
          if (qList.length >= count) {
            console.log(`🎯 DB Cache Hit! Reusing ${count} existing questions in DB for topic: "${cleanTopic}"`);
            return qList.slice(0, count).map((q: any) => ({
              question: q.question || q.q || 'Sample Question',
              options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
              answer_index: typeof q.answer_index === 'number' ? q.answer_index : 0,
              explanation: q.explanation || q.explain_short || '',
            }));
          }
        }
      }

      // 3. Fallback to live AI Edge Function generation
      console.log('🤖 Cache Miss! Invoking AI Quiz Generator (miga_quiz_burst_generate) for:', cleanTopic);
      const { data, error } = await supabase.functions.invoke('miga_quiz_burst_generate', {
        body: { topic: cleanTopic, count },
      });
      if (error) throw error;
      
      const rawQuestions = data?.questions || [];
      console.log('🤖 Edge function returned', rawQuestions.length, 'questions');
      
      return rawQuestions.map((q: any) => ({
        question: q.q || q.question || 'Sample Question',
        options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
        answer_index: typeof q.answer_index === 'number' ? q.answer_index : 0,
        explanation: q.explain_short || q.explanation || '',
      }));
    } catch (err) {
      console.warn('🤖 generateQuestions failed completely, falling back to local placeholders. Error:', err);
      return [];
    }
  }

  // ── Format seconds as mm:ss ────────────────────────────────────────────────
  static formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  // ── Get share URL for a room ────────────────────────────────────────────────
  static getRoomShareUrl(roomId: string, joinCode: string): string {
    return `https://mindgains.app/room/${joinCode}`;
  }

  // ── Get share message ──────────────────────────────────────────────────────
  static getShareMessage(room: QuizRoom): string {
    const url = this.getRoomShareUrl(room.id, room.join_code);
    const prize = room.prize_pool > 0 ? ` Win ${room.prize_pool} coins!` : '';
    return `🎯 ${room.creator_name} challenged you to "${room.title}"!${prize}\n\n` +
      `${room.question_count} questions • ${room.time_per_question}s each\n\n` +
      `Join code: ${room.join_code}\n${url}`;
  }
}

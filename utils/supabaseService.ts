import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '../utils/asyncStorage'

// Support multiple env naming conventions (Expo and React-style)
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.REACT_APP_SUPABASE_URL ||
  undefined

let supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  (process.env.REACT_APP_SUPABASE_KEY as string | undefined) ||
  (process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string | undefined) ||
  undefined

// Warn if provided key does not look like a Supabase anon JWT
if (supabaseAnonKey && !supabaseAnonKey.startsWith('ey')) {
  console.warn('[Supabase] Provided key does not look like an anon JWT. Ensure you set EXPO_PUBLIC_SUPABASE_ANON_KEY with the anon key from your Supabase project (starts with "ey").')
}

if (!supabaseUrl || !supabaseAnonKey) {
  // Surface a clear error early in development. In production, this should be configured in app config/env.
  console.error('Supabase environment variables missing: EXPO_PUBLIC_SUPABASE_URL and/or EXPO_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  preferred_language?: string;
  state?: string;
  district?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_xp: number;
  current_level: number;
  missions_completed: number;
  streak_days: number;
  last_activity_date: string;
  rank: string;
  total_study_time: number;
  created_at: string;
  updated_at: string;
}

export interface StudyNotes {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  source_type: 'youtube' | 'pdf' | 'text' | 'camera' | 'image';
  source_url?: string;
  notes_content: any;
  reading_time: number;
  subject_id?: string;
  subject_name?: string;
  quality_score: number;
  exam_relevance: number;
  difficulty: 'easy' | 'medium' | 'hard';
  key_concepts: string[];
  definitions_count: number;
  examples_count: number;
  views_count: number;
  bookmarked: boolean;
  shared_count: number;
  video_metadata?: any;
  status: 'active' | 'archived' | 'draft';
  is_public: boolean;
  created_at: string;
  updated_at: string;
  last_viewed_at?: string;
}

export interface StudyNotesProgress {
  id: string;
  user_id: string;
  study_notes_id: string;
  completed: boolean;
  reading_time_spent: number;
  bookmarked: boolean;
  notes_rating?: number;
  last_position: number;
  visit_count: number;
  started_at: string;
  completed_at?: string;
  last_accessed_at: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  created_at: string;
  topic_count?: number;
  question_count?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  required_value: number;
  xp_reward: number;
  badge_color: string;
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface UserMemory {
  id: string;
  user_id: string;
  topic: string;
  subject: string;
  subtopic?: string;
  proficiency_score: number;
  attempts_count: number;
  correct_answers: number;
  total_questions: number;
  last_interacted: string;
  weak_areas: string[];
  strong_areas: string[];
  learning_pattern: Record<string, any>;
  difficulty_preference: string;
  created_at: string;
  updated_at: string;
}

export interface LearningStats {
  total_xp: number;
  current_level: number;
  missions_completed: number;
  streak_days: number;
  total_study_time: number;
  rank: string;
}

export interface DailyQuiz {
  id: string;
  date: string;
  questions: DailyQuizQuestion[];
  total_points: number;
  difficulty_distribution: Record<string, number>;
  subjects_covered: string[];
  is_active: boolean;
  created_at: string;
}

export interface DailyQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  subject: string;
  subtopic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface DailyQuizAttempt {
  id: string;
  user_id: string;
  daily_quiz_id: string;
  quiz_date: string;
  answers: any[];
  correct_answers: number;
  total_questions: number;
  score_percentage: number;
  total_points: number;
  time_spent: number;
  completed_at: string;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface UserMemory {
  id: string;
  user_id: string;
  topic: string;
  subject: string;
  subtopic?: string;
  proficiency_score: number;
  attempts_count: number;
  correct_answers: number;
  total_questions: number;
  last_interacted: string;
  weak_areas: string[];
  strong_areas: string[];
  learning_pattern: Record<string, any>;
  difficulty_preference: string;
  created_at: string;
  updated_at: string;
}

export interface MascotRecommendation {
  id: string;
  user_id: string;
  recommendation_text: string;
  recommendation_type: string;
  subject?: string;
  priority: number;
  is_shown: boolean;
  shown_at?: string;
  expires_at: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface IndianSubject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  exam_importance: string;
  total_topics: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subtopic {
  id: string;
  topic_id: string;
  name: string;
  description?: string;
  order_index?: number;
  is_active: boolean;
  created_at: string;
  topic?: {
    name: string;
    subject?: {
      name: string;
    };
  };
}

export interface SubjectTopic {
  id: string;
  subject_id: string;
  name: string;
  description: string;
  importance_level: 'high' | 'medium' | 'low';
  exam_frequency: 'frequent' | 'moderate' | 'rare';
  total_questions: number;
  difficulty_distribution: Record<string, number>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TopicQuestion {
  id: string;
  topic_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  exam_relevance?: string;
  source?: string;
  tags?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserTopicProgress {
  id: string;
  user_id: string;
  topic_id: string;
  questions_attempted: number;
  questions_correct: number;
  best_score: number;
  total_time_spent: number;
  last_attempted?: string;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  weak_areas: string[];
  strong_areas: string[];
  created_at: string;
  updated_at: string;
}

export class SupabaseService {
  // Authentication
  static async signUp(email: string, password: string, fullName?: string, userState?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          state: userState,
        },
      },
    })

    if (error) throw error

    // Create profile using Edge Function
    if (data.user) {
      try {
        const { data: profileData, error: profileError } = await supabase.functions.invoke('create-user-profile', {
          body: {
            userId: data.user.id,
            email,
            fullName,
            state: userState
          }
        })

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
      } catch (profileError) {
        console.error('Profile creation failed:', profileError)
      }
    }

    return data
  }

  static async signIn(email: string, password: string) {
    try {
      console.log('🔐 Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('❌ Sign in error:', error.message);
        throw error;
      }
      
      if (data.user && data.session) {
        console.log('✅ Sign in successful:', data.user.id);
        console.log('✅ Session created:', data.session.access_token.substring(0, 10) + '...');
        
        // Verify session is stored
        setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          console.log('🔍 Session verification:', session ? 'Found' : 'Not found');
        }, 100);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Sign in failed:', error);
      throw error;
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      // First try to get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError.message);
        return null;
      }
      
      if (session?.user) {
        // Check if session is still valid
        const now = Date.now() / 1000;
        const expiresAt = session.expires_at || 0;
        
        if (expiresAt > now) {
          console.log('✅ Found valid user in session:', session.user.id, 'expires:', new Date(expiresAt * 1000).toISOString());
          return session.user;
        } else {
          console.log('⚠️ Session expired, attempting refresh...');
          try {
            const { data: refreshData } = await supabase.auth.refreshSession();
            if (refreshData?.session?.user) {
              console.log('✅ Session refreshed successfully:', refreshData.session.user.id);
              return refreshData.session.user;
            }
          } catch (refreshError) {
            console.error('❌ Session refresh failed:', refreshError);
          }
        }
      }
      
      // If no session, try to get user (this will check for stored session)
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Auth error:', error.message);
        return null;
      }
      
      if (user) {
        console.log('✅ Found user via getUser:', user.id);
      } else {
        console.log('❌ No user found in session or storage');
      }
      
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Profile Management
  static async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching profile:', error)
      throw error
    }

    return data
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ 
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // User Stats
  static async getUserStats(userId: string): Promise<UserStats | null> {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching user stats:', error)
      throw error
    }

    return data
  }

  // Subjects and Topics with counts
  static async getSubjects(): Promise<Subject[]> {
    try {
      // Try to get subjects with topic counts using a proper join
      const { data, error } = await supabase
        .from('subjects')
        .select(`
          id,
          name,
          description,
          icon,
          color,
          created_at,
          topics(id)
        `)
        .order('name')

      if (error) {
        console.error('Error fetching subjects with topics:', error)
        throw error
      }

      // Transform the data to include topic counts
      const subjects = data?.map(subject => ({
        id: subject.id,
        name: subject.name,
        description: subject.description,
        icon: subject.icon,
        color: subject.color,
        created_at: subject.created_at,
        topic_count: subject.topics?.length || 0
      })) || []

      console.log('📚 Subjects loaded with topic counts:', subjects.map(s => ({ name: s.name, topics: s.topic_count })))
      return subjects

    } catch (error) {
      console.error('Error in getSubjects:', error)
      // Fallback to basic subjects without counts
      const { data: basicData, error: basicError } = await supabase
        .from('subjects')
        .select('*')
        .order('name')
      
      if (basicError) {
        throw basicError
      }
      
      const subjects = basicData?.map(subject => ({
        ...subject,
        topic_count: 0
      })) || []

      console.log('📚 Fallback subjects loaded (no counts):', subjects.map(s => s.name))
      return subjects
    }
  }

  // Daily Quiz
  static async getTodayQuiz(): Promise<DailyQuiz | null> {
    const today = new Date().toISOString().split('T')[0]
    
    console.log('📅 Getting today quiz for date:', today)
    
    const { data, error } = await supabase
      .from('daily_quizzes')
      .select('*')
      .eq('date', today)
      .eq('is_active', true)
      .maybeSingle()

    if (error) {
      console.error('❌ Error fetching daily quiz from database:', error)
      console.log('🔄 Trying public function as fallback...')
      
      // Try using the built-in function that should work with proper RLS
      const { data: functionData, error: functionError } = await supabase
        .rpc('get_todays_daily_quiz')
      
      if (functionError) {
        console.error('❌ Function fallback also failed:', functionError)
        return null
      }
      
      if (functionData && functionData.available) {
        console.log('✅ Got quiz data from function')
        return {
          id: functionData.quiz_id,
          title: functionData.title,
          description: functionData.description,
          date: today,
          questions: functionData.questions || [],
          total_questions: functionData.total_questions,
          exam_types: functionData.exam_types,
          subjects_covered: functionData.subjects_covered,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
      
      return null
    }

    console.log('📊 Database query result:', {
      found: data ? 'Yes' : 'No',
      questionsCount: data?.questions?.length || 0,
      date: data?.date || 'N/A'
    });
    
    return data
  }

  static async generateDailyQuiz(): Promise<DailyQuiz | null> {
    try {
      console.log('🚀 Starting daily quiz generation process...');
      
      // First try to get existing quiz for today
      const today = new Date().toISOString().split('T')[0];
      console.log('📅 Today date:', today);
      
      const { data: existingQuiz } = await supabase
        .from('daily_quizzes')
        .select('*')
        .eq('date', today)
        .eq('is_active', true)
        .single();

      if (existingQuiz) {
        console.log('✅ Found existing quiz in database');
        return existingQuiz;
      }

      console.log('🤖 No existing quiz, generating with AI...');
      
      // Try multiple AI providers in sequence
      try {
        console.log('🎯 Attempting daily-quiz-generator edge function...');
        const { data, error } = await supabase.functions.invoke('daily-quiz-generator', {
          body: { force: true, test_mode: true }
        });
        
        if (error) {
          console.error('❌ Edge Function error:', error);
          throw new Error(`Edge Function failed: ${error.message}`);
        }
        
        if (data?.success && data?.quiz) {
          console.log('✅ Edge Function generated quiz successfully:', {
            questionsCount: data.quiz.questions?.length || 0,
            subjects: data.quiz.subjects_covered || [],
            method: data.generation_method
          });
          return data.quiz;
        }
        
        console.error('❌ Invalid Edge Function response:', data);
        throw new Error(`Invalid response: ${JSON.stringify(data)}`);
      } catch (edgeFunctionError) {
        console.error('❌ Edge Function completely failed:', edgeFunctionError.message);
        
        // Try direct AI generation as fallback
        console.log('🔄 Trying direct AI generation fallback...');
        try {
          const directQuiz = await this.generateQuizDirectly();
          if (directQuiz) {
            console.log('✅ Direct AI generation successful');
            return directQuiz;
          }
        } catch (directError) {
          console.error('❌ Direct AI generation failed:', directError.message);
        }
        
        console.log('🎲 Using demo quiz as final fallback');
        return this.createDemoQuiz();
      }
    } catch (error) {
      console.error('❌ Complete failure in generateDailyQuiz:', error);
      console.log('🎲 Returning demo quiz as emergency fallback');
      return this.createDemoQuiz();
    }
  }

  static async generateQuizDirectly(): Promise<DailyQuiz | null> {
    try {
      console.log('🤖 Attempting direct AI generation...');
      
      // Try OpenAI first
      const openaiKey = process.env.OPENAI_API_KEY;
      if (openaiKey) {
        console.log('🔥 Trying OpenAI direct generation...');
        try {
          const quiz = await this.generateWithOpenAIDirect(openaiKey);
          if (quiz) return quiz;
        } catch (openaiError) {
          console.error('❌ OpenAI direct failed:', openaiError.message);
        }
      }
      
      // Try Grok as fallback
      const grokKey = process.env.GROK_API_KEY;
      if (grokKey) {
        console.log('🚀 Trying Grok AI as fallback...');
        try {
          const quiz = await this.generateWithGrokDirect(grokKey);
          if (quiz) return quiz;
        } catch (grokError) {
          console.error('❌ Grok AI failed:', grokError.message);
        }
      }
      
      // Try Claude as final AI attempt
      const claudeKey = process.env.CLAUDE_API_KEY;
      if (claudeKey) {
        console.log('🧠 Trying Claude as final AI attempt...');
        try {
          const quiz = await this.generateWithClaudeDirect(claudeKey);
          if (quiz) return quiz;
        } catch (claudeError) {
          console.error('❌ Claude failed:', claudeError.message);
        }
      }
      
      console.log('❌ All AI providers failed');
      return null;
    } catch (error) {
      console.error('❌ Direct AI generation error:', error);
      return null;
    }
  }

  private static async generateWithOpenAIDirect(apiKey: string): Promise<DailyQuiz | null> {
    const today = new Date().toISOString().split('T')[0];
    
    const prompt = `Generate exactly 20 high-quality multiple-choice questions for Indian competitive exam preparation (UPSC, SSC, Banking).

IMPORTANT: This is for a 3-4 minute daily habit quiz focused on exam aspirants.

SUBJECT DISTRIBUTION (exactly):
- History: 4 questions (Freedom Movement, Ancient India, Medieval India)
- Polity: 4 questions (Constitution, Governance, Rights)
- Geography: 3 questions (Physical, Economic, Indian Geography)
- Economy: 3 questions (Indian Economy, Banking, Policies)
- Science & Technology: 3 questions (Space, Defense, IT)
- Current Affairs: 3 questions (Recent 6 months, Government Schemes)

DIFFICULTY: 10 easy, 8 medium, 2 hard (designed for daily habit building)

Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correct_answer": 0,
      "explanation": "Detailed explanation",
      "subject": "History|Polity|Geography|Economy|Science & Technology|Current Affairs",
      "subtopic": "Specific subtopic",
      "difficulty": "easy|medium|hard",
      "points": 5
    }
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in Indian competitive exams. Generate high-quality questions for UPSC, SSC, Banking preparation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 8000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = JSON.parse(aiResponse.choices[0].message.content);
    
    if (!content.questions || !Array.isArray(content.questions)) {
      throw new Error('Invalid questions format from OpenAI');
    }

    const questions = content.questions.slice(0, 20).map((q: any, index: number) => ({
      id: `openai_${index + 1}`,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      subject: q.subject,
      subtopic: q.subtopic,
      difficulty: q.difficulty,
      points: q.points || (q.difficulty === 'easy' ? 5 : q.difficulty === 'hard' ? 15 : 10)
    }));

    const quiz = {
      id: `openai_quiz_${today}`,
      date: today,
      questions,
      total_points: questions.reduce((sum, q) => sum + q.points, 0),
      difficulty_distribution: {
        easy: questions.filter(q => q.difficulty === 'easy').length,
        medium: questions.filter(q => q.difficulty === 'medium').length,
        hard: questions.filter(q => q.difficulty === 'hard').length
      },
      subjects_covered: [...new Set(questions.map(q => q.subject))],
      generated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      created_at: new Date().toISOString()
    };

    console.log('✅ OpenAI generated quiz with', questions.length, 'questions');
    return quiz;
  }

  private static async generateWithGrokDirect(apiKey: string): Promise<DailyQuiz | null> {
    const today = new Date().toISOString().split('T')[0];
    
    const prompt = `Generate exactly 20 multiple-choice questions for Indian competitive exams (UPSC, SSC, Banking).

Include questions from:
- History (4): Freedom fighters, Ancient/Medieval India
- Polity (4): Constitution, Governance
- Geography (3): Physical features, Economic geography
- Economy (3): Indian economy, Banking
- Science & Technology (3): ISRO, Defense, IT
- Current Affairs (3): Recent government schemes, international relations

Difficulty: 8 easy, 8 medium, 4 hard questions

Return JSON format:
{
  "questions": [
    {
      "question": "Question about Indian topics",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Why this answer is correct",
      "subject": "Subject name",
      "subtopic": "Specific topic",
      "difficulty": "easy|medium|hard",
      "points": 5
    }
  ]
}`;

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in Indian education creating questions for competitive exam preparation. Focus on UPSC, SSC, Banking exam patterns.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`);
    }

    const grokResponse = await response.json();
    const content = JSON.parse(grokResponse.choices[0].message.content);
    
    if (!content.questions || !Array.isArray(content.questions)) {
      throw new Error('Invalid questions format from Grok');
    }

    const questions = content.questions.slice(0, 20).map((q: any, index: number) => ({
      id: `grok_${index + 1}`,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      subject: q.subject,
      subtopic: q.subtopic,
      difficulty: q.difficulty,
      points: q.points || (q.difficulty === 'easy' ? 5 : q.difficulty === 'hard' ? 15 : 10)
    }));

    const quiz = {
      id: `grok_quiz_${today}`,
      date: today,
      questions,
      total_points: questions.reduce((sum, q) => sum + q.points, 0),
      difficulty_distribution: {
        easy: questions.filter(q => q.difficulty === 'easy').length,
        medium: questions.filter(q => q.difficulty === 'medium').length,
        hard: questions.filter(q => q.difficulty === 'hard').length
      },
      subjects_covered: [...new Set(questions.map(q => q.subject))],
      generated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      created_at: new Date().toISOString()
    };

    console.log('✅ Grok generated quiz with', questions.length, 'questions');
    return quiz;
  }

  private static async generateWithClaudeDirect(apiKey: string): Promise<DailyQuiz | null> {
    const today = new Date().toISOString().split('T')[0];
    
    const prompt = `Generate exactly 20 multiple-choice questions for Indian competitive exam preparation.

Subject distribution:
- History: 4 questions (Ancient India, Freedom Movement, Medieval India)
- Polity: 4 questions (Constitution, Governance, Rights, Amendments)
- Geography: 3 questions (Physical features, Economic geography, Indian states)
- Economy: 3 questions (Indian economy, Banking, Government policies)
- Science & Technology: 3 questions (ISRO missions, Defense, IT developments)
- Current Affairs: 3 questions (Recent events, Government schemes, International relations)

Difficulty: 8 easy, 8 medium, 4 hard

Return JSON:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correct_answer": 0,
      "explanation": "Explanation",
      "subject": "Subject",
      "subtopic": "Subtopic",
      "difficulty": "easy|medium|hard",
      "points": 5
    }
  ]
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 8000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: `You are an expert in Indian competitive exams. ${prompt}`
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const claudeResponse = await response.json();
    const content = JSON.parse(claudeResponse.content[0].text);
    
    if (!content.questions || !Array.isArray(content.questions)) {
      throw new Error('Invalid questions format from Claude');
    }

    const questions = content.questions.slice(0, 20).map((q: any, index: number) => ({
      id: `claude_${index + 1}`,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      subject: q.subject,
      subtopic: q.subtopic,
      difficulty: q.difficulty,
      points: q.points || (q.difficulty === 'easy' ? 5 : q.difficulty === 'hard' ? 15 : 10)
    }));

    const quiz = {
      id: `claude_quiz_${today}`,
      date: today,
      questions,
      total_points: questions.reduce((sum, q) => sum + q.points, 0),
      difficulty_distribution: {
        easy: questions.filter(q => q.difficulty === 'easy').length,
        medium: questions.filter(q => q.difficulty === 'medium').length,
        hard: questions.filter(q => q.difficulty === 'hard').length
      },
      subjects_covered: [...new Set(questions.map(q => q.subject))],
      generated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      created_at: new Date().toISOString()
    };

    console.log('✅ Claude generated quiz with', questions.length, 'questions');
    return quiz;
  }

  private static createDemoQuiz(): DailyQuiz {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // High-quality Indian exam questions for demo
      const questionBank = [
        {
          id: 'demo1',
          question: "Who was known as the 'Father of Indian Constitution'?",
          options: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"],
          correct_answer: 1,
          explanation: "Dr. B.R. Ambedkar is known as the Father of Indian Constitution for his pivotal role in drafting it.",
          subject: "Polity",
          subtopic: "Constitutional History",
          difficulty: "easy",
          points: 10
        },
        {
          id: 'demo2',
          question: "Article 370 of the Indian Constitution was related to which state?",
          options: ["Punjab", "Jammu and Kashmir", "Himachal Pradesh", "Uttarakhand"],
          correct_answer: 1,
          explanation: "Article 370 granted special autonomous status to Jammu and Kashmir, which was abrogated in 2019.",
          subject: "Polity",
          subtopic: "Constitutional Provisions",
          difficulty: "medium",
          points: 15
        },
        {
          id: 'demo3',
          question: "Bhagat Singh was executed on which date?",
          options: ["March 23, 1931", "March 24, 1931", "March 25, 1931", "March 26, 1931"],
          correct_answer: 0,
          explanation: "Bhagat Singh, along with Rajguru and Sukhdev, was executed on March 23, 1931.",
          subject: "History",
          subtopic: "Freedom Fighters",
          difficulty: "medium",
          points: 15
        },
        {
          id: 'demo4',
          question: "Which mission was India's first Mars mission?",
          options: ["Chandrayaan-1", "Mangalyaan", "Gaganyaan", "Aditya-L1"],
          correct_answer: 1,
          explanation: "Mangalyaan (Mars Orbiter Mission) was India's first successful Mars mission launched in 2013.",
          subject: "Science & Technology",
          subtopic: "Space Missions",
          difficulty: "easy",
          points: 10
        },
        {
          id: 'demo5',
          question: "The Reserve Bank of India was established in which year?",
          options: ["1934", "1935", "1936", "1937"],
          correct_answer: 1,
          explanation: "The Reserve Bank of India was established on April 1, 1935, under the RBI Act of 1934.",
          subject: "Economy",
          subtopic: "Banking",
          difficulty: "medium",
          points: 15
        },
        {
          id: 'demo6',
          question: "Which fundamental right was removed by the 44th Amendment?",
          options: ["Right to Education", "Right to Property", "Right to Privacy", "Right to Work"],
          correct_answer: 1,
          explanation: "The Right to Property was removed as a fundamental right by the 44th Amendment in 1978.",
          subject: "Polity",
          subtopic: "Fundamental Rights",
          difficulty: "hard",
          points: 20
        },
        {
          id: 'demo7',
          question: "India hosted the G20 Summit in 2023 in which city?",
          options: ["Mumbai", "New Delhi", "Bangalore", "Hyderabad"],
          correct_answer: 1,
          explanation: "India hosted the G20 Summit in New Delhi in September 2023 under its presidency.",
          subject: "Current Affairs",
          subtopic: "International Relations",
          difficulty: "easy",
          points: 10
        },
        {
          id: 'demo8',
          question: "The Quit India Movement was launched in which year?",
          options: ["1940", "1941", "1942", "1943"],
          correct_answer: 2,
          explanation: "The Quit India Movement was launched by Mahatma Gandhi on August 8, 1942.",
          subject: "History",
          subtopic: "Freedom Movement",
          difficulty: "easy",
          points: 10
        },
        {
          id: 'demo9',
          question: "Which Article of the Constitution deals with the Right to Constitutional Remedies?",
          options: ["Article 30", "Article 31", "Article 32", "Article 33"],
          correct_answer: 2,
          explanation: "Article 32 is known as the 'Heart and Soul' of the Constitution and deals with Right to Constitutional Remedies.",
          subject: "Polity",
          subtopic: "Fundamental Rights",
          difficulty: "hard",
          points: 20
        },
        {
          id: 'demo10',
          question: "The Chandrayaan-3 mission successfully landed on which part of the Moon?",
          options: ["North Pole", "South Pole", "Equator", "Far Side"],
          correct_answer: 1,
          explanation: "Chandrayaan-3 successfully landed near the Moon's South Pole in August 2023, making India the first country to do so.",
          subject: "Science & Technology",
          subtopic: "Space Missions",
          difficulty: "medium",
          points: 15
        },
        {
          id: 'demo11',
          question: "Which Indian state has the longest coastline?",
          options: ["Tamil Nadu", "Gujarat", "Maharashtra", "Andhra Pradesh"],
          correct_answer: 1,
          explanation: "Gujarat has the longest coastline in India, stretching over 1,600 kilometers.",
          subject: "Geography",
          subtopic: "Physical Geography",
          difficulty: "medium",
          points: 15
        },
        {
          id: 'demo12',
          question: "The Indian National Congress was founded in which year?",
          options: ["1884", "1885", "1886", "1887"],
          correct_answer: 1,
          explanation: "The Indian National Congress was founded in 1885 by A.O. Hume.",
          subject: "History",
          subtopic: "Political Organizations",
          difficulty: "easy",
          points: 10
        },
        {
          id: 'demo13',
          question: "Which is India's highest civilian award?",
          options: ["Padma Vibhushan", "Bharat Ratna", "Padma Bhushan", "Padma Shri"],
          correct_answer: 1,
          explanation: "Bharat Ratna is India's highest civilian honor, instituted in 1954.",
          subject: "General Knowledge",
          subtopic: "Awards",
          difficulty: "easy",
          points: 10
        },
        {
          id: 'demo14',
          question: "The Battle of Plassey was fought in which year?",
          options: ["1756", "1757", "1758", "1759"],
          correct_answer: 1,
          explanation: "The Battle of Plassey was fought on June 23, 1757, establishing British dominance in India.",
          subject: "History",
          subtopic: "British Period",
          difficulty: "medium",
          points: 15
        },
        {
          id: 'demo15',
          question: "Which commission recommended the establishment of Public Service Commissions?",
          options: ["Montagu-Chelmsford Commission", "Lee Commission", "Macaulay Committee", "Aitchison Commission"],
          correct_answer: 1,
          explanation: "The Lee Commission (1924) recommended the establishment of Public Service Commissions in India.",
          subject: "Polity",
          subtopic: "Administrative Reforms",
          difficulty: "hard",
          points: 20
        },
        {
          id: 'demo16',
          question: "Which river is known as the 'Sorrow of Bengal'?",
          options: ["Ganga", "Damodar", "Hooghly", "Brahmaputra"],
          correct_answer: 1,
          explanation: "The Damodar River is called the 'Sorrow of Bengal' due to its frequent floods before dam construction.",
          subject: "Geography",
          subtopic: "Rivers",
          difficulty: "medium",
          points: 15
        },
        {
          id: 'demo17',
          question: "The Digital India Mission was launched in which year?",
          options: ["2014", "2015", "2016", "2017"],
          correct_answer: 1,
          explanation: "Digital India Mission was launched on July 1, 2015, to transform India into a digitally empowered society.",
          subject: "Current Affairs",
          subtopic: "Government Schemes",
          difficulty: "easy",
          points: 10
        },
        {
          id: 'demo18',
          question: "Which Five Year Plan introduced the concept of 'Rolling Plan'?",
          options: ["Fifth Plan", "Sixth Plan", "Seventh Plan", "Eighth Plan"],
          correct_answer: 2,
          explanation: "The Seventh Five Year Plan (1985-90) introduced the concept of Rolling Plan in India.",
          subject: "Economy",
          subtopic: "Planning",
          difficulty: "hard",
          points: 20
        },
        {
          id: 'demo19',
          question: "The INS Vikrant, India's first indigenous aircraft carrier, was commissioned in which year?",
          options: ["2021", "2022", "2023", "2024"],
          correct_answer: 1,
          explanation: "INS Vikrant was commissioned in September 2022, making India the fifth nation to build an aircraft carrier indigenously.",
          subject: "Science & Technology",
          subtopic: "Defense",
          difficulty: "medium",
          points: 15
        },
        {
          id: 'demo20',
          question: "The Salt Satyagraha started from which place?",
          options: ["Sabarmati Ashram", "Dandi", "Ahmedabad", "Surat"],
          correct_answer: 0,
          explanation: "The Salt Satyagraha started from Sabarmati Ashram on March 12, 1930, and ended at Dandi on April 6, 1930.",
          subject: "History",
          subtopic: "Freedom Movement",
          difficulty: "easy",
          points: 10
        },
        {
          id: 'demo21',
          question: "Which Article provides for the establishment of Finance Commission?",
          options: ["Article 280", "Article 281", "Article 282", "Article 283"],
          correct_answer: 0,
          explanation: "Article 280 provides for the establishment of Finance Commission every five years.",
          subject: "Polity",
          subtopic: "Constitutional Bodies",
          difficulty: "hard",
          points: 20
        },
        {
          id: 'demo22',
          question: "The Western Ghats is a biodiversity hotspot primarily located in which states?",
          options: ["Gujarat, Maharashtra, Karnataka", "Maharashtra, Karnataka, Kerala", "Karnataka, Tamil Nadu, Andhra Pradesh", "All of the above"],
          correct_answer: 3,
          explanation: "The Western Ghats runs through Gujarat, Maharashtra, Goa, Karnataka, Kerala, and Tamil Nadu, making it one of the world's biodiversity hotspots.",
          subject: "Geography",
          subtopic: "Biodiversity",
          difficulty: "medium",
          points: 15
        },
        {
          id: 'demo23',
          question: "The Pradhan Mantri Jan Dhan Yojana was launched in which year?",
          options: ["2013", "2014", "2015", "2016"],
          correct_answer: 1,
          explanation: "PM Jan Dhan Yojana was launched on August 28, 2014, for financial inclusion and providing bank accounts to all.",
          subject: "Economy",
          subtopic: "Financial Inclusion",
          difficulty: "easy",
          points: 10
        },
        {
          id: 'demo24',
          question: "Which Indian scientist is known as the 'Father of India's Space Programme'?",
          options: ["Dr. A.P.J. Abdul Kalam", "Dr. Vikram Sarabhai", "Dr. Satish Dhawan", "Dr. U.R. Rao"],
          correct_answer: 1,
          explanation: "Dr. Vikram Sarabhai is known as the Father of India's Space Programme and founded ISRO.",
          subject: "Science & Technology",
          subtopic: "Space Program",
          difficulty: "medium",
          points: 15
        },
        {
          id: 'demo25',
          question: "The Chipko Movement originated in which state?",
          options: ["Himachal Pradesh", "Uttarakhand", "Sikkim", "Assam"],
          correct_answer: 1,
          explanation: "The Chipko Movement originated in Uttarakhand (then Uttaranchal) in the 1970s to protect forests.",
          subject: "Current Affairs",
          subtopic: "Environmental Movements",
          difficulty: "medium",
          points: 15
        }
      ];

      // Create a daily seed based on the date to ensure consistent daily quizzes
      // but different questions each day
      const dateNumber = new Date(today).getTime() / (24 * 60 * 60 * 1000); // Days since epoch
      const dailySeed = Math.floor(dateNumber) % 1000; // Create a daily seed
      
      // Shuffle questions based on daily seed for consistent daily randomization
      const shuffledQuestions = [...questionBank].sort((a, b) => {
        const aIndex = questionBank.findIndex(q => q.id === a.id);
        const bIndex = questionBank.findIndex(q => q.id === b.id);
        return ((aIndex + dailySeed) % questionBank.length) - ((bIndex + dailySeed) % questionBank.length);
      });
      
      // Select 20 questions for 3-4 minute daily habit (optimal for exam preparation)
      const selectedQuestions = shuffledQuestions.slice(0, 20);

      // Create quiz object
      const quiz = {
        id: `quiz-${today}`,
        date: today,
        questions: selectedQuestions,
        total_points: selectedQuestions.reduce((sum, q) => sum + q.points, 0),
        difficulty_distribution: {
          easy: selectedQuestions.filter(q => q.difficulty === 'easy').length,
          medium: selectedQuestions.filter(q => q.difficulty === 'medium').length,
          hard: selectedQuestions.filter(q => q.difficulty === 'hard').length
        },
        subjects_covered: ['History', 'Polity', 'Geography', 'Economy', 'Science & Technology', 'Current Affairs'],
        generated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        created_at: new Date().toISOString()
      };

      return quiz;
    } catch (error) {
      console.error('Error creating demo quiz:', error);
      throw new Error('Failed to create demo quiz');
    }
  }

  static async generateDailyQuizManual(): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('daily-quiz-generator', {
        body: { 
          force: true,
          admin_trigger: true 
        }
      });

      if (error) {
        console.error('Error generating daily quiz:', error);
        return { success: false, message: error.message || 'Failed to generate daily quiz' };
      }

      return { success: true, message: 'Daily quiz generated successfully!' };
    } catch (error) {
      console.error('Error in generateDailyQuizManual:', error);
      return { success: false, message: 'Failed to generate daily quiz' };
    }
  }

  static async ensureTodayQuiz(): Promise<DailyQuiz | null> {
    try {
      console.log('🔍 Checking for existing daily quiz...');
      
      // Check if Supabase is configured
      if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
        console.log('⚠️ Supabase not configured, using demo quiz');
        return this.createDemoQuiz();
      }
      
      // First try to get existing quiz from database
      console.log('📅 Getting today quiz from database...');
      let quiz = await this.getTodayQuiz();
      
      if (!quiz) {
        console.log('📝 No existing quiz found, generating with AI...');
        
        try {
          quiz = await this.generateDailyQuiz();
        } catch (edgeError) {
          console.error('⚠️ Edge Function failed, using demo quiz:', edgeError.message);
          quiz = this.createDemoQuiz();
        }
      } else {
        console.log('✅ Found existing quiz in database:', {
          questionsCount: quiz.questions?.length || 0,
          date: quiz.date
        });
      }
      
      console.log('✅ Final quiz loaded successfully');
      return quiz;
    } catch (error) {
      console.error('❌ Error ensuring today quiz:', error);
      // Return demo quiz as ultimate fallback
      return this.createDemoQuiz();
    }
  }

  static async submitDailyQuiz(dailyQuizId: string, answers: number[], timeSpent: number) {
    try {
      const { data: attemptId, error } = await supabase.rpc('submit_daily_quiz_attempt', {
        p_quiz_id: dailyQuizId,
        p_answers: answers.map((answer, index) => ({
          question_id: `q_${index + 1}`,
          answer: answer
        })),
        p_time_taken: timeSpent
      })
      
      if (error) throw error
      
      // Fetch the attempt details to get full results
      const { data: attemptData, error: fetchError } = await supabase
        .from('daily_quiz_attempts')
        .select('*')
        .eq('id', attemptId)
        .single()
      
      if (fetchError) {
        console.error('Error fetching attempt details:', fetchError)
        return { success: true, attempt_id: attemptId }
      }
      
      // Format results for frontend
      const results = {
        correct_answers: attemptData.score,
        total_questions: attemptData.total_questions,
        score_percentage: Math.round(attemptData.accuracy_percentage),
        total_points: attemptData.score * 10,
        time_spent: attemptData.time_taken,
        xp_earned: attemptData.xp_earned,
        rank: attemptData.rank,
        subject_wise_scores: attemptData.subject_wise_scores,
        mascot_message: this.getMascotMessage(
          Math.round(attemptData.accuracy_percentage),
          attemptData.score,
          attemptData.total_questions
        )
      }
      
      return { 
        success: true, 
        attempt_id: attemptId,
        results 
      }
    } catch (error) {
      console.error('Error submitting daily quiz:', error)
      return { success: false, error: error.message || error.toString() }
    }
  }
  
  private static getMascotMessage(percentage: number, correct: number, total: number): string {
    if (percentage === 100) {
      return "🎉 Perfect score! You're absolutely brilliant!";
    } else if (percentage >= 90) {
      return "⭐ Outstanding! You're on fire today!";
    } else if (percentage >= 80) {
      return "🔥 Excellent work! Keep it up!";
    } else if (percentage >= 70) {
      return "👏 Good job! You're making great progress!";
    } else if (percentage >= 60) {
      return "📚 Nice effort! Keep studying and you'll improve!";
    } else {
      return "💪 Don't give up! Every attempt makes you stronger!";
    }
  }

  static async getDailyQuizAttempt(userId: string, date?: string): Promise<DailyQuizAttempt | null> {
    const targetDate = date || new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('daily_quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('quiz_date', targetDate)
      .maybeSingle()

    if (error) {
      console.error('Error fetching daily quiz attempt:', error)
      return null
    }

    return data
  }

  // Journey System Functions
  static async getUserJourneyProgress(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_journey_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // No progress yet, create initial progress
        const { data: newProgress, error: createError } = await supabase
          .from('user_journey_progress')
          .insert({
            user_id: userId,
            current_day: 1,
            current_streak: 0,
            longest_streak: 0,
            total_xp_earned: 0
          })
          .select()
          .single();

        if (createError) throw createError;
        return newProgress;
      }

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting journey progress:', error);
      throw error;
    }
  }

  static async getJourneyDaysWithProgress(userId: string, currentDay: number): Promise<any[]> {
    try {
      // Get first 10 days (or more based on current progress)
      const daysToLoad = Math.max(currentDay + 5, 10);
      
      const { data: days, error } = await supabase
        .from('journey_days')
        .select(`
          id,
          day_number,
          daily_doses!inner (
            id,
            title
          ),
          daily_snacks!inner (
            id,
            title
          ),
          daily_topics!inner (
            topic_id,
            order_index,
            topics!inner (
              id,
              name
            )
          ),
          daily_journey_quizzes!inner (
            id,
            quiz_title,
            order_index
          ),
          daily_chests!inner (
            id,
            chest_type,
            xp_reward
          )
        `)
        .lte('day_number', daysToLoad)
        .order('day_number');

      if (error) throw error;

      // Get user's completion status for these days
      const { data: completions } = await supabase
        .from('user_daily_completions')
        .select('journey_day_id, activity_type')
        .eq('user_id', userId);

      // Map completion status to days
      const daysWithProgress = days?.map(day => {
        const dayCompletions = completions?.filter(c => c.journey_day_id === day.id) || [];
        
        return {
          ...day,
          daily_dose: {
            ...day.daily_doses,
            completed: dayCompletions.some(c => c.activity_type === 'dose')
          },
          daily_snack: {
            ...day.daily_snacks,
            completed: dayCompletions.some(c => c.activity_type === 'snack')
          },
          topics: day.daily_topics.map((dt: any) => ({
            ...dt.topics,
            order_index: dt.order_index,
            completed: dayCompletions.some(c => 
              c.activity_type === `topic_${dt.order_index}`
            )
          })),
          quizzes: day.daily_journey_quizzes.map((q: any) => ({
            ...q,
            completed: dayCompletions.some(c => 
              c.activity_type === `quiz_${q.order_index}`
            )
          })),
          chest: {
            ...day.daily_chests,
            completed: dayCompletions.some(c => c.activity_type === 'chest')
          }
        };
      }) || [];

      return daysWithProgress;
    } catch (error) {
      console.error('Error getting journey days:', error);
      throw error;
    }
  }

  static async completeDailyActivity(
    userId: string,
    journeyDayId: number,
    activityType: string,
    xpEarned: number = 0
  ): Promise<void> {
    try {
      // Record completion
      const { error: completionError } = await supabase
        .from('user_daily_completions')
        .insert({
          user_id: userId,
          journey_day_id: journeyDayId,
          activity_type: activityType,
          xp_earned: xpEarned,
          completed_at: new Date().toISOString()
        });

      if (completionError && completionError.code !== '23505') { // Ignore duplicate key error
        throw completionError;
      }

      // Update user progress
      await this.updateUserProgress(userId);
      
      // Check if day is complete and unlock next day
      await this.checkDayCompletion(userId, journeyDayId);
      
    } catch (error) {
      console.error('Error completing activity:', error);
      throw error;
    }
  }

  static async checkDayCompletion(userId: string, journeyDayId: number): Promise<boolean> {
    try {
      // Check if all 7 activities are completed
      const { count, error } = await supabase
        .from('user_daily_completions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('journey_day_id', journeyDayId);

      if (error) throw error;

      if (count === 7) {
        // All activities completed, update current day
        const { data: dayData } = await supabase
          .from('journey_days')
          .select('day_number')
          .eq('id', journeyDayId)
          .single();

        if (dayData) {
          const today = new Date().toISOString().split('T')[0];
          let journeyUpdate: Record<string, any> | null = null;

          try {
            const { data: currentJourney } = await supabase
              .from('user_journey_progress')
              .select('*')
              .eq('user_id', userId)
              .single();

            if (currentJourney) {
              const lastCompletion =
                currentJourney.last_completed_date ||
                currentJourney.last_day_completed ||
                currentJourney.last_completion_date ||
                currentJourney.last_activity_date ||
                null;

              let journeyStreak = currentJourney.current_streak ?? 0;
              if (lastCompletion) {
                const diffDays = Math.floor(
                  (new Date(today).getTime() - new Date(lastCompletion).getTime()) / (1000 * 60 * 60 * 24)
                );

                if (diffDays === 0) {
                  journeyStreak = journeyStreak || 1;
                } else if (diffDays === 1) {
                  journeyStreak = (journeyStreak || 0) + 1;
                } else if (diffDays > 1) {
                  journeyStreak = 1;
                }
              } else {
                journeyStreak = Math.max(1, journeyStreak || 1);
              }

              const longestStreak = Math.max(journeyStreak, currentJourney.longest_streak || 0);

              journeyUpdate = {
                current_day: dayData.day_number + 1,
                total_days_completed: dayData.day_number,
              };

              if (Object.prototype.hasOwnProperty.call(currentJourney, 'current_streak')) {
                journeyUpdate.current_streak = journeyStreak;
              }
              if (Object.prototype.hasOwnProperty.call(currentJourney, 'longest_streak')) {
                journeyUpdate.longest_streak = longestStreak;
              }
              if (Object.prototype.hasOwnProperty.call(currentJourney, 'last_completed_date')) {
                journeyUpdate.last_completed_date = today;
              }
              if (Object.prototype.hasOwnProperty.call(currentJourney, 'last_day_completed')) {
                journeyUpdate.last_day_completed = today;
              }
              if (Object.prototype.hasOwnProperty.call(currentJourney, 'last_completion_date')) {
                journeyUpdate.last_completion_date = today;
              }
              if (Object.prototype.hasOwnProperty.call(currentJourney, 'last_activity_date')) {
                journeyUpdate.last_activity_date = today;
              }
            }
          } catch (journeyFetchError: any) {
            console.warn('Error loading journey progress for streak update:', journeyFetchError?.message || journeyFetchError);
          }

          try {
            await supabase
              .from('user_journey_progress')
              .update(journeyUpdate ?? {
                current_day: dayData.day_number + 1,
                total_days_completed: dayData.day_number,
              })
              .eq('user_id', userId);
          } catch (journeyUpdateError: any) {
            console.warn('Error updating journey progress streak data:', journeyUpdateError?.message || journeyUpdateError);
          }

          await this.ensureDailyStreak(userId, today);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking day completion:', error);
      return false;
    }
  }

  static async updateUserProgress(userId: string): Promise<void> {
    try {
      // Update streak with safe fallback logic so missing RPC/functions don't break flow
      await this.ensureDailyStreak(userId);
      
      // Update total XP
      const { data: totalXP } = await supabase
        .from('user_daily_completions')
        .select('xp_earned')
        .eq('user_id', userId);

      const total = totalXP?.reduce((sum, item) => sum + (item.xp_earned || 0), 0) || 0;

      await supabase
        .from('user_journey_progress')
        .update({ total_xp_earned: total })
        .eq('user_id', userId);

    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  static async ensureDailyStreak(userId: string, activityDate?: string): Promise<number | null> {
    const today = activityDate || new Date().toISOString().split('T')[0];

    try {
      const { data, error } = await supabase.rpc('update_user_streak', { p_user_id: userId });

      if (error) {
        throw error;
      }

      return (data as any)?.streak_days ?? null;
    } catch (rpcError: any) {
      if (rpcError?.code && rpcError?.code !== 'PGRST201') {
        console.warn('[SupabaseService] Falling back to manual streak update:', rpcError?.message || rpcError);
      }

      try {
        const existingStats = await this.getUserStats(userId);
        const todayDate = new Date(today);
        const lastActivityRaw =
          (existingStats as any)?.last_active_date ||
          (existingStats as any)?.lastActivityDate ||
          null;

        let streakDays = existingStats?.streak_days ?? 0;

        if (lastActivityRaw) {
          const lastActivityDate = new Date(lastActivityRaw);
          const diffInDays = Math.floor(
            (todayDate.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diffInDays === 0) {
            // Already counted for today – no change
            streakDays = streakDays || 1;
          } else if (diffInDays === 1) {
            streakDays = (streakDays || 0) + 1;
          } else if (diffInDays > 1) {
            streakDays = 1;
          }
        } else {
          streakDays = 1;
        }

        if (!streakDays || streakDays < 1) {
          streakDays = 1;
        }

        const now = new Date().toISOString();

        const upsertPayload: Record<string, any> = {
          user_id: userId,
          streak_days: streakDays,
          last_active_date: today,
          updated_at: now,
        };

        if (!existingStats) {
          upsertPayload.total_xp = 0;
          upsertPayload.current_level = 1;
          upsertPayload.total_quizzes_completed = 0;
          upsertPayload.total_correct_answers = 0;
          upsertPayload.total_questions_answered = 0;
          upsertPayload.created_at = now;
        }

        const { error: upsertError } = await supabase
          .from('user_stats')
          .upsert(upsertPayload, { onConflict: 'user_id', ignoreDuplicates: false });

        if (upsertError) {
          throw upsertError;
        }

        return streakDays;
      } catch (fallbackError) {
        console.error('Error ensuring daily streak with fallback logic:', fallbackError);
        return null;
      }
    }
  }

  static async saveDailyQuizAttempt(attemptData: {
    user_id: string;
    daily_quiz_id: number;
    score: number;
    total_questions: number;
    time_taken: number;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('daily_quiz_attempts')
        .insert({
          ...attemptData,
          quiz_date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving daily quiz attempt:', error);
      throw error;
    }
  }

  // Subject Quizzes
  static async getSubjectQuiz(subject: string, subtopic?: string): Promise<QuizQuestion[]> {
    const { data, error } = await supabase.functions.invoke('generate-subject-quiz', {
      body: { subject, subtopic }
    })

    if (error) throw error
    return data.questions || []
  }

  // User Memory & Personalization
  static async getUserMemory(userId: string): Promise<UserMemory[]> {
    try {
      const { data, error } = await supabase
        .from('user_memory')
        .select('*')
        .eq('user_id', userId)
        .order('proficiency_score', { ascending: true })

      if (error) {
        // Handle missing table (PGRST204/404)
        if ((error as any).code === 'PGRST204' || (error as any).message?.includes('not found')) {
          console.warn('⚠️ user_memory table missing. Returning fallback empty state.');
          return [];
        }
        console.error('Error fetching user memory:', error);
        return [];
      }

      return data || [];
    } catch (e) {
      console.error('getUserMemory exception:', e);
      return [];
    }
  }

  static async updateUserMemory(
    userId: string, 
    topic: string, 
    subject: string, 
    proficiencyData: {
      score: number;
      correctAnswers: number;
      totalQuestions: number;
      weakAreas?: string[];
      strongAreas?: string[];
      difficulty?: string;
    }
  ) {
    const { score, correctAnswers, totalQuestions, weakAreas = [], strongAreas = [], difficulty = 'medium' } = proficiencyData
    
    const { data, error } = await supabase
      .from('user_memory')
      .upsert({
        user_id: userId,
        topic,
        subject,
        subtopic: topic !== subject ? topic : undefined,
        proficiency_score: score,
        attempts_count: 1,
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        weak_areas: weakAreas,
        strong_areas: strongAreas,
        difficulty_preference: difficulty,
        last_interacted: new Date().toISOString(),
        learning_pattern: {
          last_score: score,
          performance_trend: score >= 70 ? 'improving' : 'needs_focus',
          last_attempt_date: new Date().toISOString().split('T')[0]
        },
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,topic'
      })

    if (error) throw error
    return data
  }

  // Mascot Recommendations
  static async getMascotRecommendations(userId: string): Promise<string[]> {
    try {
      // 1. Try RPC first
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_mascot_recommendations', {
        p_user_id: userId
      });

      if (!rpcError && rpcData && rpcData.length > 0) {
        return rpcData.map((rec: any) => rec.recommendation_text);
      }

      // 2. Intelligent Client-Side Fallback using user_memory
      const memory = await this.getUserMemory(userId);
      const recommendations: string[] = [];

      if (memory.length > 0) {
        const weakAreas = memory.filter(m => m.proficiency_score < 60);
        const recentTopic = memory.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime())[0];

        if (weakAreas.length > 0) {
          recommendations.push(`Hey! I noticed you're struggling a bit with **${weakAreas[0].topic}**. Want a quick review? 🐺`);
          recommendations.push(`Don't let **${weakAreas[0].topic}** slow you down. Let's crush a practice set! 💪`);
        } else if (recentTopic) {
          recommendations.push(`You're doing great with **${recentTopic.topic}**! Ready for a harder challenge? 🚀`);
          recommendations.push(`Consistency is key! Shall we continue with your ${recentTopic.subject} prep? ✨`);
        }
      }

      // 3. Generic Fallbacks
      if (recommendations.length === 0) {
        recommendations.push("Ready to boost your knowledge today? 🚀");
        recommendations.push("Every expert was once a beginner. Keep learning! 🌟");
        recommendations.push("Knowledge is power. You're building yours every day! 💪");
      }

      return recommendations;
    } catch (error) {
      console.error('Error getting mascot recommendations:', error);
      return ["Ready to boost your knowledge today? 🚀", "Let's make today count! 💪"];
    }
  }

  static async getPersonalizedStudyPlan(userId: string) {
    try {
      // Get user memory to identify weak areas
      const userMemory = await this.getUserMemory(userId)
      const weakAreas = userMemory
        .filter(m => m.proficiency_score < 60)
        .sort((a, b) => a.proficiency_score - b.proficiency_score)
        .slice(0, 3)

      return {
        weakAreas: weakAreas.map(area => ({
          subject: area.subject,
          topic: area.topic,
          proficiency: area.proficiency_score,
          recommendation: `PYQ of ${area.topic} - Current proficiency: ${area.proficiency_score}%`
        })),
        nextSteps: [
          "Take today's daily quiz to track progress",
          "Create focused missions on weak topics",
          "Review flashcards for better retention"
        ]
      }
    } catch {
      return { weakAreas: [], nextSteps: [] }
    }
  }

  // Progress Tracking
  static async updateQuizProgress(userId: string, quizData: {
    quiz_type: 'daily' | 'subject';
    subject?: string;
    subtopic?: string;
    score: number;
    total_questions: number;
    time_spent: number;
  }) {
    const { data, error } = await supabase.functions.invoke('update-quiz-progress', {
      body: { userId, ...quizData }
    })

    if (error) throw error
    return data
  }

  // Enhanced Mission Content with AI
  static async getMissionContent(missionId: string, roomType: string) {
    try {
      const { data, error } = await supabase.functions.invoke('get-mission-content', {
        body: { mission_id: missionId, room_type: roomType }
      })
      
      if (error) throw error
      return { success: true, ...data }
    } catch (error) {
      console.error('Error getting mission content:', error)
      return { success: false, error: error.message }
    }
  }

  static async updateProgress(progressData: {
    mission_id: string;
    room_type: string;
    score: number;
    max_score: number;
    time_spent: number;
    completed: boolean;
  }) {
    try {
      const { data, error } = await supabase.functions.invoke('update-progress', {
        body: progressData
      })
      
      if (error) throw error
      return { success: true, ...data }
    } catch (error) {
      console.error('Error updating progress:', error)
      return { success: false, error: error.message }
    }
  }

  // Enhanced Study Notes Creation with Database Integration
  static async createStudyNotes(notesData: {
    title: string;
    description?: string;
    source_type: 'youtube' | 'pdf' | 'text' | 'camera' | 'image';
    source_url?: string;
    notes_content: any;
    subject_name?: string;
    quality_score?: number;
    exam_relevance?: number;
    video_metadata?: any;
  }) {
    console.log('📚 Creating study notes with database integration:', notesData.title);
    
    try {
      // Use the database function to create study notes
      const { data: studyNotesId, error } = await supabase
        .rpc('create_study_notes', {
          p_title: notesData.title,
          p_description: notesData.description || `Study notes: ${notesData.title}`,
          p_source_type: notesData.source_type,
          p_source_url: notesData.source_url,
          p_notes_content: notesData.notes_content,
          p_subject_name: notesData.subject_name,
          p_quality_score: notesData.quality_score || 0,
          p_exam_relevance: notesData.exam_relevance || 0,
          p_video_metadata: notesData.video_metadata || {}
        });

      if (error) {
        console.error('❌ Database function error:', error);
        throw error;
      }

      console.log('✅ Study notes created with ID:', studyNotesId);

      // Get the complete study notes with progress
      const { data: completeStudyNotes, error: fetchError } = await supabase
        .rpc('get_study_notes_with_progress', {
          p_study_notes_id: studyNotesId
        });

      if (fetchError) {
        console.warn('⚠️ Failed to fetch complete study notes:', fetchError);
        // Return basic success with study notes ID
        return { 
          success: true, 
          study_notes: { id: studyNotesId },
          id: studyNotesId
        };
      }

      return { 
        success: true, 
        study_notes: completeStudyNotes,
        id: studyNotesId
      };

    } catch (error: any) {
      console.error('❌ Study notes creation failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Get study notes by ID with progress information
  static async getStudyNotesById(studyNotesId: string) {
    try {
      console.log('📖 Getting study notes by ID:', studyNotesId);
      
      const result = await this.callEdgeFunction('get_study_notes_with_progress', {
        study_notes_id: studyNotesId
      });

      if (!result.data) {
        throw new Error('Study notes not found');
      }

      console.log('✅ Study notes retrieved successfully');
      return { success: true, data: result.data };
    } catch (error: any) {
      console.error('❌ Failed to get study notes:', error);
      return { success: false, error: error.message };
    }
  }

  // Bookmark/unbookmark study notes
  static async toggleStudyNotesBookmark(studyNotesId: string, bookmarked: boolean) {
    try {
      const result = await this.updateStudyProgress(studyNotesId, {
        bookmarked
      });

      return result;
    } catch (error: any) {
      console.error('❌ Failed to toggle bookmark:', error);
      return { success: false, error: error.message };
    }
  }

  // Mark study notes as completed
  static async markStudyNotesCompleted(studyNotesId: string, readingTimeSpent: number) {
    try {
      const result = await this.updateStudyProgress(studyNotesId, {
        completed: true,
        reading_time_spent: readingTimeSpent,
        last_position: 1.0
      });

      return result;
    } catch (error: any) {
      console.error('❌ Failed to mark as completed:', error);
      return { success: false, error: error.message };
    }
  }

  // Achievements
  static async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements:achievement_id (
          name,
          description,
          icon,
          badge_color
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching achievements:', error)
      throw error
    }

    return data || []
  }

  static async getAllAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })

    if (error) {
      console.error('Error fetching achievements:', error)
      throw error
    }

    return data || []
  }

  // Leaderboard - Fixed without user_profiles relationship
  static async getLeaderboard(timeframe: 'daily' | 'weekly' | 'monthly' | 'all_time' = 'weekly') {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Error fetching leaderboard:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in getLeaderboard:', error)
      throw error
    }
  }

  // Analytics for marketing
  static async trackUserActivity(userId: string, activity: string, metadata?: any) {
    try {
      // Update last activity date
      await supabase
        .from('user_stats')
        .update({ 
          last_activity_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      // Log activity for analytics
      console.log(`User ${userId} performed: ${activity}`, metadata)
    } catch (error) {
      console.error('Error tracking activity:', error)
    }
  }

  // App Stats for marketing
  static async getAppStats() {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      // Get active users (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { count: activeUsers } = await supabase
        .from('user_stats')
        .select('*', { count: 'exact', head: true })
        .gte('last_activity_date', sevenDaysAgo.toISOString().split('T')[0])

      // Get total quizzes taken
      const { count: totalQuizzes } = await supabase
        .from('quiz_attempts')
        .select('*', { count: 'exact', head: true })

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalQuizzes: totalQuizzes || 0,
      }
    } catch (error) {
      console.error('Error fetching app stats:', error)
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalQuizzes: 0,
      }
    }
  }

  // Indian Subjects System
  static async getIndianSubjects(): Promise<IndianSubject[]> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) {
        console.error('Error fetching Indian subjects:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in getIndianSubjects:', error)
      return []
    }
  }

  static async getSubtopics(): Promise<Subtopic[]> {
    try {
      const { data, error } = await supabase
        .from('subtopics')
        .select(`
          *,
          topic:topics(
            name,
            subject:subjects(name)
          )
        `)
        .eq('is_active', true)
        .order('order_index')

      if (error) {
        console.error('Error fetching subtopics:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error in getSubtopics:', error)
      return []
    }
  }

  static async getQuestionsBySubtopicName(subtopicName: string, limit: number = 20) {
    try {
      console.log('🔍 Getting questions for subtopic name:', subtopicName);
      
      // Use the SQL function we created
      const { data, error } = await supabase.rpc('get_subtopic_questions', {
        subtopic_name_param: subtopicName,
        limit_param: limit
      });

      if (error) {
        console.error('❌ Error getting questions by subtopic name:', error);
        // Fallback to direct query
        const fallback = await supabase
          .from('questions')
          .select(`
            id,
            question_text,
            options,
            correct_answer,
            explanation,
            difficulty,
            points
          `)
          .eq('is_active', true)
          .or(`question_text.ilike.%${subtopicName}%`)
          .limit(limit);
        
        return fallback.data || [];
      }

      console.log('✅ Found', data?.length || 0, 'questions for', subtopicName);
      return data || [];
    } catch (error) {
      console.error('Error in getQuestionsBySubtopicName:', error);
      return [];
    }
  }

  // Indian Subjects System - Enhanced Methods
  static async getSubjectProgress(userId: string, subjectId: string) {
    try {
      const { data, error } = await supabase
        .from('user_topic_progress')
        .select(`
          *,
          subject_topics!inner(subject_id)
        `)
        .eq('user_id', userId)
        .eq('subject_topics.subject_id', subjectId)

      if (error) throw error

      if (!data || data.length === 0) {
        return {
          topics_attempted: 0,
          average_score: 0,
          total_time_spent: 0,
          proficiency_level: 'beginner'
        }
      }

      const totalScore = data.reduce((sum, p) => sum + p.best_score, 0)
      const totalTime = data.reduce((sum, p) => sum + p.total_time_spent, 0)
      const averageScore = Math.round(totalScore / data.length)
      
      let proficiencyLevel = 'beginner'
      if (averageScore >= 90) proficiencyLevel = 'expert'
      else if (averageScore >= 75) proficiencyLevel = 'advanced'
      else if (averageScore >= 60) proficiencyLevel = 'intermediate'

      return {
        topics_attempted: data.length,
        average_score: averageScore,
        total_time_spent: Math.round(totalTime / 60), // Convert to hours
        proficiency_level: proficiencyLevel
      }
    } catch (error) {
      console.error('Error getting subject progress:', error)
      return {
        topics_attempted: 0,
        average_score: 0,
        total_time_spent: 0,
        proficiency_level: 'beginner'
      }
    }
  }

  static async getLearningStats(userId: string): Promise<LearningStats> {
    try {
      const [userStats, topicProgress, subjects] = await Promise.all([
        this.getUserStats(userId),
        supabase
          .from('user_topic_progress')
          .select('*')
          .eq('user_id', userId),
        this.getIndianSubjects()
      ])

      const completedTopics = topicProgress.data?.filter(p => p.best_score >= 70).length || 0
      const totalScore = topicProgress.data?.reduce((sum, p) => sum + p.best_score, 0) || 0
      const averageScore = topicProgress.data?.length ? Math.round(totalScore / topicProgress.data.length) : 0
      const totalTimeSpent = topicProgress.data?.reduce((sum, p) => sum + p.total_time_spent, 0) || 0

      return {
        totalSubjects: subjects.length,
        completedTopics,
        averageScore,
        totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert to hours
        currentStreak: userStats?.streak_days || 0,
        weeklyGoal: 10 // Default weekly goal
      }
    } catch (error) {
      console.error('Error getting learning stats:', error)
      return {
        totalSubjects: 6,
        completedTopics: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        currentStreak: 0,
        weeklyGoal: 10
      }
    }
  }

  static async getSubjectTopics(subjectId: string): Promise<SubjectTopic[]> {
    try {
      const { data, error } = await supabase
        .from('subject_topics')
        .select('*')
        .eq('subject_id', subjectId)
        .eq('is_active', true)
        .order('importance_level', { ascending: false })

      if (error) {
        console.error('Error fetching subject topics:', error)
        throw error
      }

      // Get user progress for each topic if user is authenticated
      try {
        const user = await this.getCurrentUser()
        if (user) {
          const topicIds = data?.map(t => t.id) || []
          const { data: progressData } = await supabase
            .from('user_topic_progress')
            .select('*')
            .eq('user_id', user.id)
            .in('topic_id', topicIds)

          // Merge progress data with topics
          return (data || []).map(topic => ({
            ...topic,
            user_progress: progressData?.find(p => p.topic_id === topic.id)
          }))
        }
      } catch (progressError) {
        console.error('Error fetching user progress:', progressError)
      }

      return data || []
    } catch (error) {
      console.error('Error in getSubjectTopics:', error)
      return []
    }
  }

  static async getTopicQuestions(topicId: string): Promise<TopicQuestion[]> {
    try {
      if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
        console.log('Using demo topic questions - Supabase not configured')
        return [];
      }
      const requireVerified = (process.env.EXPO_PUBLIC_REQUIRE_VERIFIED_QUESTIONS || 'false').toLowerCase() === 'true';
      let { data, error } = await supabase
        .from('topic_questions')
        .select('*')
        .eq('topic_id', topicId)
        .eq('is_active', true)
        .eq('is_verified', true)
        .order('created_at');

      if (error) {
        console.error('Error fetching topic questions:', error)
        throw error
      }
      if ((!data || data.length === 0) && !requireVerified) {
        const fb = await supabase
          .from('topic_questions')
          .select('*')
          .eq('topic_id', topicId)
          .eq('is_active', true)
          .order('created_at');
        if (!fb.error) data = fb.data || [];
      }
      return data || []
    } catch (error) {
      console.error('Error in getTopicQuestions:', error)
      return []
    }
  }

  // Generate questions for all topics using AI
  static async generateAllTopicQuestions(progressCallback?: (progress: number, topic: string) => void) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-topic-questions', {
        body: { force_regenerate: false }
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error generating topic questions:', error)
      throw error
    }
  }

  // Validate daily quiz using traditional + AI methods
  static async validateDailyQuiz(quizDate?: string) {
    try {
      const { data, error } = await supabase.functions.invoke('validate-daily-quiz', {
        body: { quiz_date: quizDate }
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error validating daily quiz:', error)
      throw error
    }
  }

  static async updateTopicProgress(progressData: {
    topic_id: string;
    questions_attempted: number;
    questions_correct: number;
    score_percentage: number;
    total_points: number;
    time_spent: number;
    detailed_results: any[];
  }) {
    try {
      const user = await this.getCurrentUser()
      if (!user) throw new Error('User not authenticated')

      // Calculate proficiency level
      const proficiencyLevel = this.calculateProficiencyLevel(progressData.score_percentage)
      
      // Analyze weak and strong areas
      const weakAreas = progressData.detailed_results
        .filter(r => !r.is_correct)
        .map(r => r.difficulty)
        .filter(Boolean)
      
      const strongAreas = progressData.detailed_results
        .filter(r => r.is_correct)
        .map(r => r.difficulty)
        .filter(Boolean)

      // Update or insert progress
      const { data, error } = await supabase
        .from('user_topic_progress')
        .upsert({
          user_id: user.id,
          topic_id: progressData.topic_id,
          questions_attempted: progressData.questions_attempted,
          questions_correct: progressData.questions_correct,
          best_score: progressData.score_percentage,
          total_time_spent: progressData.time_spent,
          last_attempted: new Date().toISOString(),
          proficiency_level: proficiencyLevel,
          weak_areas: [...new Set(weakAreas)],
          strong_areas: [...new Set(strongAreas)],
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,topic_id'
        })

      if (error) throw error

      // Update user memory for personalized recommendations
      await this.updateUserMemoryFromTopicQuiz(user.id, progressData)

      return data
    } catch (error) {
      console.error('Error updating topic progress:', error)
      throw error
    }
  }

  private static calculateProficiencyLevel(scorePercentage: number): string {
    if (scorePercentage >= 90) return 'expert'
    if (scorePercentage >= 75) return 'advanced'
    if (scorePercentage >= 60) return 'intermediate'
    return 'beginner'
  }

  private static async updateUserMemoryFromTopicQuiz(userId: string, progressData: any) {
    try {
      // Get topic and subject info
      const { data: topicInfo } = await supabase
        .from('subject_topics')
        .select('name, indian_subjects(name)')
        .eq('id', progressData.topic_id)
        .single()

      if (!topicInfo) return

      const topicName = topicInfo.name
      const subjectName = topicInfo.indian_subjects.name

      // Update user memory
      await this.updateUserMemory(userId, topicName, subjectName, {
        score: progressData.score_percentage,
        correctAnswers: progressData.questions_correct,
        totalQuestions: progressData.questions_attempted,
        weakAreas: progressData.detailed_results
          .filter((r: any) => !r.is_correct)
          .map((r: any) => r.difficulty),
        strongAreas: progressData.detailed_results
          .filter((r: any) => r.is_correct)
          .map((r: any) => r.difficulty)
      })
    } catch (error) {
      console.error('Error updating user memory from topic quiz:', error)
    }
  }

  // Generate topic quiz on-demand with AI
  static async generateTopicQuiz(topicName: string, subjectName: string, difficulty: string = 'mixed', questionCount: number = 15) {
    try {
      // Ensure minimum 15 questions
      const finalQuestionCount = Math.max(15, questionCount);
      
      console.log('🎯 Generating topic quiz:', topicName, subjectName, difficulty, finalQuestionCount);
      
      // Call AI function to generate questions
      const { data, error } = await supabase.functions.invoke('daily-quiz-generator', {
        body: {
          topic: topicName,
          subject: subjectName,
          difficulty,
          questionCount: finalQuestionCount,
          type: 'topic_quiz'
        }
      });

      if (error) {
        console.error('❌ Error generating topic quiz:', error);
        throw error;
      }

      if (!data?.questions?.length) {
        throw new Error('No questions generated');
      }

      console.log('✅ Generated', data.questions.length, 'questions for', topicName);
      return data.questions;
      
    } catch (error) {
      console.error('Error in generateTopicQuiz:', error);
      throw error;
    }
  }

  // 🔗 Get Subtopic Questions by identifier: accepts UUID, slug, or name (with optional hint)
  static async getQuestionsBySubtopicSlug(identifier: string, limit: number = 20, hintName?: string) {
    let subtopicRecord: { id: string; name: string } | null = null;
    const slugify = (s?: string) =>
      String(s || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    try {
      console.log('🔍 Loading questions for subtopic identifier:', identifier, 'hintName:', hintName);
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

      // 1) UUID lookup
      if (isUUID) {
        const { data, error } = await supabase
          .from('subtopics')
          .select('id, name')
          .eq('id', identifier)
          .limit(1)
          .maybeSingle();
        if (error) console.warn('subtopics by id error (non-fatal):', error);
        if (data) subtopicRecord = data as any;
      }

      // 2) Slug lookup (prefer hintName -> identifier)
      if (!subtopicRecord) {
        const hintSlug = slugify(hintName);
        if (hintSlug) {
          const { data, error } = await supabase
            .from('subtopics')
            .select('id, name')
            .eq('slug', hintSlug)
            .limit(1)
            .maybeSingle();
          if (error) console.warn('subtopics by slug(hint) error (non-fatal):', error);
          if (data) subtopicRecord = data as any;
        }
      }
      if (!subtopicRecord && !isUUID) {
        const idSlug = slugify(identifier);
        if (idSlug) {
          const { data, error } = await supabase
            .from('subtopics')
            .select('id, name')
            .eq('slug', idSlug)
            .limit(1)
            .maybeSingle();
          if (error) console.warn('subtopics by slug(id) error (non-fatal):', error);
          if (data) subtopicRecord = data as any;
        }
      }

      // 3) Name lookup (hintName first)
      if (!subtopicRecord && hintName) {
        const { data, error } = await supabase
          .from('subtopics')
          .select('id, name')
          .ilike('name', `%${hintName}%`)
          .limit(1)
          .maybeSingle();
        if (error) console.warn('subtopics by hintName error (non-fatal):', error);
        if (data) subtopicRecord = data as any;
      }

      // 4) Name lookup using identifier-as-text
      if (!subtopicRecord && !isUUID) {
        const text = decodeURIComponent(String(identifier || '')).replace(/[-_]+/g, ' ').trim();
        if (text && text.length >= 2) {
          const { data, error } = await supabase
            .from('subtopics')
            .select('id, name')
            .ilike('name', `%${text}%`)
            .limit(1)
            .maybeSingle();
          if (error) console.warn('subtopics by text error (non-fatal):', error);
          if (data) subtopicRecord = data as any;
        }
      }

      if (!subtopicRecord) {
        throw new Error(`Subtopic with identifier "${identifier}" not found`);
      }

      console.log('✅ Found subtopic:', subtopicRecord);

      // Now get questions using the UUID (prefer verified)
      const requireVerified = (process.env.EXPO_PUBLIC_REQUIRE_VERIFIED_QUESTIONS || 'false').toLowerCase() === 'true';
      let { data: questionsData, error } = await supabase
        .from('questions')
        .select(`
          id,
          question_text,
          options,
          correct_answer,
          explanation,
          difficulty,
          points
        `)
        .eq('subtopic_id', subtopicRecord.id)
        .eq('is_active', true)
        .eq('is_verified', true)
        .limit(limit);

      if (error) {
        console.error('❌ Questions error:', error);
        throw error;
      }

      if ((questionsData?.length || 0) === 0 && !requireVerified) {
        console.warn(`⚠️ No verified questions for ${subtopicRecord.name}. Falling back to active-only.`);
        const fb = await supabase
          .from('questions')
          .select(`
            id,
            question_text,
            options,
            correct_answer,
            explanation,
            difficulty,
            points
          `)
          .eq('subtopic_id', subtopicRecord.id)
          .eq('is_active', true)
          .limit(limit);
        if (!fb.error) questionsData = fb.data || [];
      }

      // Alias fallback: if still none, try questions linked to subtopics with the same name (handles legacy IDs)
      if (!questionsData || questionsData.length === 0) {
        console.warn(`⚠️ No questions found by subtopic_id. Trying alias subtopics by name: ${subtopicRecord.name}`);
        const { data: aliasSubs, error: aliasErr } = await supabase
          .from('subtopics')
          .select('id')
          .ilike('name', subtopicRecord.name)
          .limit(10);
        if (!aliasErr && aliasSubs && aliasSubs.length > 0) {
          const ids = aliasSubs.map(s => s.id);
          // Try verified first over aliases
          const { data: aliasQuestions, error: aliasQErr } = await supabase
            .from('questions')
            .select(`
              id, question_text, options, correct_answer, explanation, difficulty, points
            `)
            .in('subtopic_id', ids)
            .eq('is_active', true)
            .eq('is_verified', true)
            .limit(limit);
          if (!aliasQErr && aliasQuestions && aliasQuestions.length > 0) {
            questionsData = aliasQuestions;
          } else if (!requireVerified) {
            const { data: aliasActive, error: aliasActErr } = await supabase
              .from('questions')
              .select(`
                id, question_text, options, correct_answer, explanation, difficulty, points
              `)
              .in('subtopic_id', ids)
              .eq('is_active', true)
              .limit(limit);
            if (!aliasActErr) questionsData = aliasActive || [];
          }
        }
      }

      // Final fallback: try direct name search if still no questions
      if (!questionsData || questionsData.length === 0) {
        console.warn(`⚠️ Final fallback: trying direct name search for: ${subtopicRecord.name}`);
        if (hintName) {
          questionsData = await this.getQuestionsBySubtopicName(hintName, limit);
        }
        if ((!questionsData || questionsData.length === 0) && subtopicRecord.name !== hintName) {
          questionsData = await this.getQuestionsBySubtopicName(subtopicRecord.name, limit);
        }
      }

      console.log(`✅ Found ${questionsData?.length || 0} questions for ${subtopicRecord.name}`);
      
      // Map question_text to question for consistency
      const mappedQuestions = questionsData?.map(q => ({
        ...q,
        question: q.question_text
      })) || [];
      
      return {
        subtopic: subtopicRecord,
        questions: mappedQuestions
      };
      
    } catch (error) {
      console.error('Error loading subtopic questions:', error);
      throw error;
    }
  }

  // Battle System Functions
  static async addToBattleQueue(battleType = 'quick', betAmount = 50) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('match_or_queue_battle', {
        p_user_id: user.id,
        p_battle_type: battleType,
        p_bet_amount: betAmount,
        p_difficulty: 'medium',
      });

      if (error) {
        console.error('RPC match_or_queue_battle error:', error);
        throw error;
      }

      return data || { type: 'queued' };
    } catch (error) {
      console.error('Error in addToBattleQueue:', error);
      throw error;
    }
  }

  // Get User Profile (alias for compatibility)
  static async getUserProfile(userId: string) {
    return await this.getProfile(userId);
  }

  // Check user limits for premium features
  static async checkUserLimits(userId: string) {
    try {
      // This is a placeholder function that can be extended later
      // For now, always return that user has access
      return {
        hasAccess: true,
        remainingQuizzes: 10,
        isPremium: false,
        dailyQuizAccess: true,
        topicQuizAccess: true,
        subtopicQuizAccess: true
      };
    } catch (error) {
      console.error('Error checking user limits:', error);
      // Return default access on error
      return {
        hasAccess: true,
        remainingQuizzes: 5,
        isPremium: false,
        dailyQuizAccess: true,
        topicQuizAccess: true,
        subtopicQuizAccess: true
      };
    }
  }

  // Get subject question count
  static async getSubjectQuestionCount(subjectId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('subject_id', subjectId)
        .eq('is_active', true);

      if (error) {
        console.error('Error getting subject question count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting subject question count:', error);
      return 0;
    }
  }

  // Get topics by subject
  static async getTopicsBySubject(subjectId: string) {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('subject_id', subjectId)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching topics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching topics:', error);
      return [];
    }
  }

  // Get subtopics by topic
  static async getSubtopicsByTopic(topicId: string) {
    try {
      const { data, error } = await supabase
        .from('subtopics')
        .select('*')
        .eq('topic_id', topicId)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching subtopics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching subtopics:', error);
      return [];
    }
  }

  // Get questions by subtopic
  static async getQuestionsBySubtopic(subtopicId: string, limit = 20) {
    try {
      const requireVerified = (process.env.EXPO_PUBLIC_REQUIRE_VERIFIED_QUESTIONS || 'false').toLowerCase() === 'true';
      let { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          question_text,
          options,
          correct_answer,
          explanation,
          difficulty,
          points,
          subtopic_id,
          subtopics (
            name,
            topics (
              name,
              subjects (name)
            )
          )
        `)
        .eq('subtopic_id', subtopicId)
        .eq('is_active', true)
        .eq('is_verified', true)
        .limit(limit);

      if (error) {
        console.error('Error fetching questions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  }

  // Resolve a topic by name (optional subject filter)
  static async getTopicByName(topicName: string, subjectId?: string) {
    try {
      let query = supabase
        .from('topics')
        .select('id, name, subject_id')
        .ilike('name', `%${topicName}%`)
        .limit(1)
        .maybeSingle();

      if (subjectId) {
        // refetch with subject filter to improve accuracy
        const { data, error } = await supabase
          .from('topics')
          .select('id, name, subject_id')
          .eq('subject_id', subjectId)
          .ilike('name', `%${topicName}%`)
          .limit(1)
          .maybeSingle();
        if (!error && data) return data;
      }

      const { data, error } = await query;
      if (error) {
        console.warn('getTopicByName error (non-fatal):', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error resolving topic by name:', error);
      return null;
    }
  }

  // Get questions by subject
  static async getQuestionsBySubject(subjectId: string, limit = 20) {
    try {
      const requireVerified = (process.env.EXPO_PUBLIC_REQUIRE_VERIFIED_QUESTIONS || 'false').toLowerCase() === 'true';
      let { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          question_text,
          options,
          correct_answer,
          explanation,
          difficulty,
          points,
          subject_id,
          subtopics (
            name,
            topics (
              name,
              subjects (name)
            )
          )
        `)
        .eq('subject_id', subjectId)
        .eq('is_active', true)
        .eq('is_verified', true)
        .limit(limit);

      if (error) {
        console.error('Error fetching questions by subject:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching questions by subject:', error);
      return [];
    }
  }

  // Edge Function wrapper method
  static async callEdgeFunction(functionName: string, body: any) {
    try {
      console.log(`🚀 Calling edge function: ${functionName}`, body);
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body
      });

      if (error) {
        console.error(`❌ Edge function ${functionName} error:`, error);
        throw error;
      }

      console.log(`✅ Edge function ${functionName} response:`, data);
      return { success: true, data };
    } catch (error) {
      console.error(`❌ Edge function ${functionName} failed:`, error);
      throw error;
    }
  }

  // Process YouTube video and create study notes
  static async processYouTube(youtubeUrl: string, options: {
    title: string;
    description?: string;
    subject_name?: string;
    difficulty?: string;
    extractedData?: any;
  }) {
    try {
      console.log('📹 Processing YouTube video:', youtubeUrl);
      
      // Extract video ID from URL
      const videoId = this.extractVideoId(youtubeUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // Use extracted data if available, otherwise try to get video metadata
      let videoData = options.extractedData;
      
      if (!videoData) {
        try {
          const response = await this.callEdgeFunction('extract-youtube', {
            videoId,
            url: youtubeUrl,
          });
          videoData = response.data;
        } catch (error) {
          console.warn('Edge function failed, using provided options:', error);
          videoData = {
            title: options.title,
            description: options.description || 'Educational video content',
            duration: '10:00',
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            studyNotes: {
              overview: 'Educational content extracted from YouTube video',
              keyPoints: ['Educational video content'],
              definitions: [],
              examples: [],
              examTips: [],
              quickFacts: []
            }
          };
        }
      }

      // Create study notes using the createStudyNotes method
      const studyNotesResult = await this.createStudyNotes({
        title: videoData.title || options.title,
        description: options.description || `Study notes from: ${videoData.title}`,
        source_type: 'youtube',
        source_url: youtubeUrl,
        notes_content: videoData.studyNotes || videoData,
        subject_name: options.subject_name || 'Video Learning',
        quality_score: 85,
        exam_relevance: 75,
        video_metadata: {
          videoId,
          duration: videoData.duration,
          thumbnail: videoData.thumbnail,
          channelTitle: videoData.channelTitle || 'Unknown Channel'
        }
      });

      if (studyNotesResult.success) {
        return {
          success: true,
          study_notes_id: studyNotesResult.id,
          study_notes: studyNotesResult.study_notes,
          video_data: videoData
        };
      } else {
        throw new Error(studyNotesResult.error || 'Failed to create study notes');
      }
    } catch (error) {
      console.error('❌ YouTube processing failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to process YouTube video'
      };
    }
  }

  // Helper method to extract video ID from YouTube URL
  private static extractVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Update study progress helper method
  static async updateStudyProgress(studyNotesId: string, progressData: {
    completed?: boolean;
    reading_time_spent?: number;
    bookmarked?: boolean;
    notes_rating?: number;
    last_position?: number;
  }) {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('study_notes_progress')
        .upsert({
          user_id: user.id,
          study_notes_id: studyNotesId,
          ...progressData,
          last_accessed_at: new Date().toISOString(),
          visit_count: 1
        }, {
          onConflict: 'user_id,study_notes_id'
        });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('❌ Failed to update study progress:', error);
      return { success: false, error: error.message };
    }
  }

  // Battle System Methods
  static battleRoomsCache: any[] = [];
  static battleRoomsCacheTime: number = 0;
  static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async getBattleRooms() {
    try {
      // Check cache first
      const now = Date.now();
      if (this.battleRoomsCache.length > 0 && (now - this.battleRoomsCacheTime) < this.CACHE_DURATION) {
        console.log('✅ Returning cached battle rooms');
        return this.battleRoomsCache;
      }

      console.log('🔄 Fetching battle rooms from database...');
      
      const { data, error } = await supabase
        .from('battle_rooms')
        .select(`
          *,
          player1:player1_id(id, email),
          player2:player2_id(id, email)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('❌ Error fetching battle rooms:', error);
        throw error;
      }

      // Update cache
      this.battleRoomsCache = data || [];
      this.battleRoomsCacheTime = now;

      console.log(`✅ Fetched ${data?.length || 0} battle rooms`);
      return data || [];
    } catch (error) {
      console.error('❌ Error in getBattleRooms:', error);
      return [];
    }
  }

  static clearBattleRoomsCache() {
    console.log('🗑️ Clearing battle rooms cache');
    this.battleRoomsCache = [];
    this.battleRoomsCacheTime = 0;
  }

  // Get active battle room for user
  static async getUserActiveBattleRoom(userId: string) {
    try {
      const { data, error } = await supabase
        .from('battle_rooms')
        .select(`
          *,
          player1:player1_id(id, email),
          player2:player2_id(id, email)
        `)
        .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching user battle room:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Error in getUserActiveBattleRoom:', error);
      return null;
    }
  }

  // Start a battle room with authoritative timing and frozen questions
  static async startBattleRoom(
    roomId: string,
    options: { subjectId?: string | null; numQuestions?: number } = {}
  ): Promise<{ started_at: string; questions: any[] } | null> {
    try {
      const { subjectId = null, numQuestions = 10 } = options || {};

      // 1) Generate/fetch a frozen question set
      const dbQuestions = await this.getRandomBattleQuestions({ subjectId: subjectId || null, limit: numQuestions, difficulty: 'mixed' });
      if (!dbQuestions || dbQuestions.length === 0) {
        console.error('❌ startBattleRoom: No questions available');
        return null;
      }

      const frozen = dbQuestions.map((q: any) => ({
        id: q.id,
        question_text: q.question_text || q.question,
        options: Array.isArray(q.options) ? q.options : [],
        correct_answer: q.correct_answer,
        explanation: q.explanation || '',
        difficulty: q.difficulty || 'medium',
        points: q.points || (q.difficulty === 'easy' ? 10 : q.difficulty === 'hard' ? 30 : 20),
      }));

      // 2) Server-authoritative start timestamp
      const startedAt = new Date().toISOString();

      // 3) Persist to battle_rooms (triggers realtime for other clients)
      const { error } = await supabase
        .from('battle_rooms')
        .update({
          status: 'active',
          started_at: startedAt,
          num_questions: frozen.length,
          questions: frozen,
        })
        .eq('id', roomId);

      if (error) {
        console.error('❌ startBattleRoom update failed:', error);
        return null;
      }

      return { started_at: startedAt, questions: frozen };
    } catch (e: any) {
      console.error('❌ startBattleRoom failed:', e);
      return null;
    }
  }

  // Create battle room
  static async createBattleRoom(player1Id: string, player2Id: string, battleType = 'quick', betAmount = 50) {
    try {
      const { data, error } = await supabase
        .from('battle_rooms')
        .insert({
          player1_id: player1Id,
          player2_id: player2Id,
          battle_type: battleType,
          bet_amount: betAmount,
          status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating battle room:', error);
        throw error;
      }

      // Clear cache to refresh data
      this.clearBattleRoomsCache();

      console.log('✅ Battle room created:', data.id);
      return data;
    } catch (error) {
      console.error('❌ Error in createBattleRoom:', error);
      throw error;
    }
  }

  // Battle: robust random question intake aligned to topic/subtopic/subject bank
  static async getRandomBattleQuestions(params: {
    topicId?: string | null;
    subtopicId?: string | null;
    subjectId?: string | null;
    difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
    limit?: number;
  }) {
    const { topicId = null, subtopicId = null, subjectId = null, difficulty = 'mixed', limit = 10 } = params || {};
    try {
      const shuffle = <T,>(arr: T[]) => arr.map(v => [Math.random(), v] as const).sort((a, b) => a[0] - b[0]).map(([, v]) => v);
      const selectCols = 'id,question_text,options,correct_answer,explanation,difficulty,points,subtopic_id,subject_id';

      if (subtopicId) {
        let q = supabase.from('questions').select(selectCols).eq('is_active', true).eq('subtopic_id', subtopicId);
        if (difficulty !== 'mixed') q = q.eq('difficulty', difficulty);
        const { data, error } = await q.limit(limit * 3);
        if (error) throw error;
        return shuffle(data || []).slice(0, limit);
      }

      if (topicId) {
        const subs = await this.getSubtopicsByTopic(topicId);
        const subIds = (subs || []).map((s: any) => s.id);
        if (subIds.length === 0) return [];
        let q = supabase.from('questions').select(selectCols).eq('is_active', true).in('subtopic_id', subIds);
        if (difficulty !== 'mixed') q = q.eq('difficulty', difficulty);
        const { data, error } = await q.limit(limit * 5);
        if (error) throw error;
        return shuffle(data || []).slice(0, limit);
      }

      if (subjectId) {
        let q = supabase.from('questions').select(selectCols).eq('is_active', true).eq('subject_id', subjectId);
        if (difficulty !== 'mixed') q = q.eq('difficulty', difficulty);
        const { data, error } = await q.limit(limit * 5);
        if (error) throw error;
        return shuffle(data || []).slice(0, limit);
      }

      let q = supabase.from('questions').select(selectCols).eq('is_active', true);
      if (difficulty !== 'mixed') q = q.eq('difficulty', difficulty);
      const { data, error } = await q.limit(limit * 5);
      if (error) throw error;
      return shuffle(data || []).slice(0, limit);
    } catch (error) {
      console.error('Error fetching random battle questions:', error);
      return [];
    }
  }

  // Battle: fetch random questions with optional difficulty
  static async getBattleQuestions(subject: string | null = null, difficulty: 'easy' | 'medium' | 'hard' | 'mixed' = 'mixed', limit = 10) {
    try {
      let query = supabase
        .from('questions')
        .select('id,question_text,options,correct_answer,explanation,difficulty,points')
        .eq('is_active', true);

      // Subject filter is optional and column name varies across schemas; skip to avoid errors.
      if (difficulty !== 'mixed') {
        query = query.eq('difficulty', difficulty);
      }

      const { data, error } = await query.order('created_at', { ascending: false }).limit(limit);
      if (error) {
        console.error('Error fetching battle questions:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching battle questions:', error);
      return [];
    }
  }

  // (dedupe removed) — keeping the subject-aware version above

  // 💰 Coin Management Functions
  static async getUserCoins(userId?: string): Promise<number> {
    try {
      const currentUser = userId ? { id: userId } : await this.getCurrentUser();
      if (!currentUser?.id) return 0;

      const { data, error } = await supabase.rpc('get_user_coins', {
        p_user_id: currentUser.id
      });

      if (error) {
        console.error('Error getting user coins:', error);
        return 0;
      }

      return data || 0;
    } catch (error) {
      console.error('Error fetching user coins:', error);
      return 0;
    }
  }

  static async deductCoins(amount: number, userId?: string): Promise<boolean> {
    try {
      const currentUser = userId ? { id: userId } : await this.getCurrentUser();
      if (!currentUser?.id) return false;

      const { data, error } = await supabase.rpc('deduct_user_coins', {
        p_user_id: currentUser.id,
        p_amount: amount
      });

      if (error) {
        console.error('Error deducting coins:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error deducting coins:', error);
      return false;
    }
  }

  static async addCoins(amount: number, userId?: string): Promise<number> {
    try {
      const currentUser = userId ? { id: userId } : await this.getCurrentUser();
      if (!currentUser?.id) return 0;

      const { data, error } = await supabase.rpc('add_user_coins', {
        p_user_id: currentUser.id,
        p_amount: amount
      });

      if (error) {
        console.error('Error adding coins:', error);
        return 0;
      }

      return data || 0;
    } catch (error) {
      console.error('Error adding coins:', error);
      return 0;
    }
  }

  static async checkCanAfford(amount: number, userId?: string): Promise<boolean> {
    try {
      const balance = await this.getUserCoins(userId);
      return balance >= amount;
    } catch (error) {
      console.error('Error checking affordability:', error);
      return false;
    }
  }

  // 🏆 Battle Analytics & Statistics Functions
  static async getBattleInsights(userId?: string): Promise<any> {
    try {
      const currentUser = userId ? { id: userId } : await this.getCurrentUser();
      if (!currentUser?.id) return null;

      const { data, error } = await supabase.rpc('get_user_battle_insights', {
        p_user_id: currentUser.id
      });

      if (error) {
        console.error('Error getting battle insights:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching battle insights:', error);
      return null;
    }
  }

  static async getBattleHistory(userId?: string, limit: number = 20): Promise<any[]> {
    try {
      const currentUser = userId ? { id: userId } : await this.getCurrentUser();
      if (!currentUser?.id) return [];

      const { BattleAnalyticsService } = await import('./battleAnalyticsService');
      return await BattleAnalyticsService.getBattleHistory(currentUser.id, limit);
    } catch (error) {
      console.error('Error fetching battle history:', error);
      return [];
    }
  }

  static async getBattleLeaderboard(timeframe: string = 'all', limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('get_battle_leaderboard', {
        p_timeframe: timeframe,
        p_limit: limit
      });

      if (error) {
        console.error('Error getting battle leaderboard:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching battle leaderboard:', error);
      return [];
    }
  }

  static async getUserBattleRank(userId?: string): Promise<number> {
    try {
      const currentUser = userId ? { id: userId } : await this.getCurrentUser();
      if (!currentUser?.id) return 0;

      const { BattleAnalyticsService } = await import('./battleAnalyticsService');
      return await BattleAnalyticsService.getUserRankingPosition(currentUser.id);
    } catch (error) {
      console.error('Error fetching user battle rank:', error);
      return 0;
    }
  }

  // 🏆 State Leaderboard Functions
  static async getStateLeaderboard(): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('get_state_leaderboard');

      if (error) {
        console.error('Error getting state leaderboard:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching state leaderboard:', error);
      return [];
    }
  }

  static async getUserStateRank(userId?: string): Promise<any> {
    try {
      const currentUser = userId ? { id: userId } : await this.getCurrentUser();
      if (!currentUser?.id) return null;

      const { data, error } = await supabase.rpc('get_user_state_rank', {
        p_user_id: currentUser.id
      });

      if (error) {
        console.error('Error getting user state rank:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user state rank:', error);
      return null;
    }
  }

  static async getStateTopPerformers(state: string, limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('get_state_top_performers', {
        p_state: state,
        p_limit: limit
      });

      if (error) {
        console.error('Error getting state top performers:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching state top performers:', error);
      return [];
    }
  }

  static async refreshStateLeaderboardCache(): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('refresh_state_leaderboard_cache');

      if (error) {
        console.error('Error refreshing state leaderboard cache:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error refreshing cache:', error);
      return false;
    }
  }

  // Get user progress data
  static async getUserProgress(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user progress:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  }

  // Get recent chat history
  static async getRecentChats(userId: string, limit: number = 5) {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('user_message, ai_response, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent chats:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching recent chats:', error);
      return [];
    }
  }

  // Save chat interaction
  static async saveChat(userId: string, chatData: {
    user_message: string;
    ai_response: string;
    language: string;
    timestamp: string;
  }) {
    try {
      const { error } = await supabase
        .from('chat_history')
        .insert({
          user_id: userId,
          user_message: chatData.user_message,
          ai_response: chatData.ai_response,
          language: chatData.language,
          created_at: chatData.timestamp
        });

      if (error) {
        console.error('Error saving chat:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving chat:', error);
      return false;
    }
  }

  // Update user progress
  static async updateUserProgress(userId: string, updates: {
    lessons_completed_today?: number;
    total_xp?: number;
    daily_streak?: number;
    level?: number;
    last_active?: string;
  }) {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating user progress:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating user progress:', error);
      return false;
    }
  }

  // Get the Supabase client instance
  static getClient() {
    return supabase;
  }

  static async addXP(userId: string, xp: number) {
    try {
      console.log(`✨ Adding ${xp} XP to user ${userId}`);
      
      // Get current XP first
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('total_xp')
        .eq('user_id', userId)
        .single();
        
      if (statsError && statsError.code !== 'PGRST116') throw statsError;
      
      const currentXP = stats?.total_xp || 0;
      const newXP = currentXP + xp;
      
      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: userId,
          total_xp: newXP,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      
      return { success: true, newXP };
    } catch (error) {
      console.error('Error adding XP:', error);
      return { success: false, error: (error as any).message };
    }
  }
}

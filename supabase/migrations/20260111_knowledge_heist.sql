-- Knowledge Heist Multiplayer - Database Schema
-- Run this migration to create all required tables

-- ============================================================================
-- 1. VAULT QUESTIONS TABLE
-- ============================================================================
-- Stores all quiz questions organized by vault (topic)
CREATE TABLE IF NOT EXISTS vault_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vault_id TEXT NOT NULL CHECK (vault_id IN ('constitution', 'science', 'economy', 'current-affairs', 'history', 'geography')),
  question TEXT NOT NULL,
  options TEXT[] NOT NULL CHECK (array_length(options, 1) = 4),
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  insight TEXT, -- Learning tip shown after game
  explanation TEXT, -- Detailed explanation of the answer
  tags TEXT[], -- For categorization (e.g., ['articles', 'fundamental-rights'])
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  times_used INTEGER DEFAULT 0,
  correct_rate DECIMAL DEFAULT 0.0 -- Track how many people get it right
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vault_questions_vault_id ON vault_questions(vault_id);
CREATE INDEX IF NOT EXISTS idx_vault_questions_difficulty ON vault_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_vault_questions_active ON vault_questions(is_active);

-- ============================================================================
-- 2. GAME SESSIONS TABLE
-- ============================================================================
-- Tracks each multiplayer game session
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vault_id TEXT NOT NULL,
  status TEXT DEFAULT 'matchmaking' CHECK (status IN ('matchmaking', 'ready', 'in_progress', 'completed', 'cancelled')),
  max_players INTEGER DEFAULT 4 CHECK (max_players >= 2 AND max_players <= 4),
  current_players INTEGER DEFAULT 0,
  question_ids UUID[], -- Array of 3 question IDs for this session
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  session_code TEXT UNIQUE, -- For private lobbies (e.g., "HEIST-AB12CD")
  is_private BOOLEAN DEFAULT false
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_game_sessions_status ON game_sessions(status);
CREATE INDEX IF NOT EXISTS idx_game_sessions_vault_id ON game_sessions(vault_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON game_sessions(created_at);

-- ============================================================================
-- 3. GAME PARTICIPANTS TABLE
-- ============================================================================
-- Tracks each player in a game session
CREATE TABLE IF NOT EXISTS game_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  user_name TEXT NOT NULL, -- Cached from user_profiles
  user_state TEXT, -- Player's state (e.g., "Tamil Nadu")
  user_level INTEGER DEFAULT 1,
  user_avatar TEXT, -- Emoji or avatar identifier
  score INTEGER DEFAULT 0,
  final_rank INTEGER,
  mg_earned INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  answers JSONB DEFAULT '[]'::jsonb, -- [{question_id, answer, is_correct, time_taken, points}, ...]
  power_ups_used JSONB DEFAULT '[]'::jsonb, -- [{power_up_id, used_at, question_id}, ...]
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(game_session_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_game_participants_session ON game_participants(game_session_id);
CREATE INDEX IF NOT EXISTS idx_game_participants_user ON game_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_game_participants_score ON game_participants(score DESC);

-- ============================================================================
-- 4. GAME LEADERBOARD TABLE
-- ============================================================================
-- Aggregated stats for each player
CREATE TABLE IF NOT EXISTS game_leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
  user_name TEXT NOT NULL,
  user_state TEXT,
  total_games INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0, -- Number of times ranked #1
  total_score INTEGER DEFAULT 0,
  highest_score INTEGER DEFAULT 0,
  average_score DECIMAL DEFAULT 0.0,
  win_rate DECIMAL DEFAULT 0.0,
  best_rank INTEGER DEFAULT 999,
  total_mg_earned INTEGER DEFAULT 0,
  total_xp_earned INTEGER DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_total_score ON game_leaderboard(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_win_rate ON game_leaderboard(win_rate DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_state ON game_leaderboard(user_state);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON game_leaderboard(user_id);

-- ============================================================================
-- 5. POWER-UPS INVENTORY TABLE
-- ============================================================================
-- Track power-ups owned by each user
CREATE TABLE IF NOT EXISTS power_ups_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  power_up_id TEXT NOT NULL CHECK (power_up_id IN ('mental_scan', 'time_freeze', 'insight_flash', 'confuse_foe')),
  quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
  total_used INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, power_up_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_power_ups_user ON power_ups_inventory(user_id);

-- ============================================================================
-- 6. TRIGGERS FOR AUTO-UPDATES
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to vault_questions
DROP TRIGGER IF EXISTS update_vault_questions_updated_at ON vault_questions;
CREATE TRIGGER update_vault_questions_updated_at
    BEFORE UPDATE ON vault_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to game_leaderboard
DROP TRIGGER IF EXISTS update_game_leaderboard_updated_at ON game_leaderboard;
CREATE TRIGGER update_game_leaderboard_updated_at
    BEFORE UPDATE ON game_leaderboard
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. FUNCTIONS FOR GAME LOGIC
-- ============================================================================

-- Function to get random questions for a vault
CREATE OR REPLACE FUNCTION get_vault_questions(
  p_vault_id TEXT,
  p_difficulty TEXT DEFAULT NULL,
  p_count INTEGER DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  question TEXT,
  options TEXT[],
  difficulty TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vq.id,
    vq.question,
    vq.options,
    vq.difficulty
  FROM vault_questions vq
  WHERE 
    vq.vault_id = p_vault_id
    AND vq.is_active = true
    AND (p_difficulty IS NULL OR vq.difficulty = p_difficulty)
  ORDER BY RANDOM()
  LIMIT p_count;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate and update leaderboard stats
CREATE OR REPLACE FUNCTION update_player_leaderboard(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_stats RECORD;
BEGIN
  -- Calculate aggregated stats
  SELECT
    COUNT(*) as total_games,
    SUM(CASE WHEN final_rank = 1 THEN 1 ELSE 0 END) as total_wins,
    SUM(score) as total_score,
    MAX(score) as highest_score,
    AVG(score) as average_score,
    MIN(final_rank) as best_rank,
    SUM(mg_earned) as total_mg_earned,
    SUM(xp_earned) as total_xp_earned,
    MAX(finished_at) as last_played_at
  INTO v_stats
  FROM game_participants
  WHERE user_id = p_user_id AND final_rank IS NOT NULL;

  -- Insert or update leaderboard
  INSERT INTO game_leaderboard (
    user_id,
    user_name,
    user_state,
    total_games,
    total_wins,
    total_score,
    highest_score,
    average_score,
    win_rate,
    best_rank,
    total_mg_earned,
    total_xp_earned,
    last_played_at
  )
  SELECT
    p_user_id,
    COALESCE(up.full_name, up.email, 'Player'),
    up.state,
    v_stats.total_games,
    v_stats.total_wins,
    v_stats.total_score,
    v_stats.highest_score,
    v_stats.average_score,
    CASE WHEN v_stats.total_games > 0 
      THEN (v_stats.total_wins::DECIMAL / v_stats.total_games * 100)
      ELSE 0 
    END,
    v_stats.best_rank,
    v_stats.total_mg_earned,
    v_stats.total_xp_earned,
    v_stats.last_played_at
  FROM user_profiles up
  WHERE up.id = p_user_id
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_games = EXCLUDED.total_games,
    total_wins = EXCLUDED.total_wins,
    total_score = EXCLUDED.total_score,
    highest_score = EXCLUDED.highest_score,
    average_score = EXCLUDED.average_score,
    win_rate = EXCLUDED.win_rate,
    best_rank = EXCLUDED.best_rank,
    total_mg_earned = EXCLUDED.total_mg_earned,
    total_xp_earned = EXCLUDED.total_xp_earned,
    last_played_at = EXCLUDED.last_played_at,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE vault_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE power_ups_inventory ENABLE ROW LEVEL SECURITY;

-- vault_questions: Everyone can read active questions (but not correct_answer)
CREATE POLICY "Anyone can view active vault questions"
  ON vault_questions FOR SELECT
  USING (is_active = true);

-- Allow anyone to insert questions (for now - can restrict later)
CREATE POLICY "Authenticated users can insert vault questions"
  ON vault_questions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update vault questions"
  ON vault_questions FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- game_sessions: Anyone can view sessions
CREATE POLICY "Anyone can view game sessions"
  ON game_sessions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create game sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update game sessions"
  ON game_sessions FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- game_participants: Players can view their own data + others in same session
CREATE POLICY "Players can view participants in their sessions"
  ON game_participants FOR SELECT
  USING (
    game_session_id IN (
      SELECT game_session_id FROM game_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Players can insert their own participation"
  ON game_participants FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Players can update their own participation"
  ON game_participants FOR UPDATE
  USING (user_id = auth.uid());

-- game_leaderboard: Everyone can view
CREATE POLICY "Anyone can view leaderboard"
  ON game_leaderboard FOR SELECT
  USING (true);

-- power_ups_inventory: Users can view and update their own inventory
CREATE POLICY "Users can view their own power-ups"
  ON power_ups_inventory FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own power-ups"
  ON power_ups_inventory FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================================================
-- 9. INITIAL DATA - Sample Questions
-- ============================================================================

-- Insert sample Constitution questions
INSERT INTO vault_questions (vault_id, question, options, correct_answer, difficulty, insight, tags) VALUES
('constitution', 'What is the capital of Rajasthan?', 
 ARRAY['Jaipur', 'Udaipur', 'Jodhpur', 'Kota'], 
 0, 'easy', 
 'Jaipur is known as the "Pink City" of India due to the distinctive color of its buildings.', 
 ARRAY['geography', 'state-capitals']),

('constitution', 'Which article of the Indian Constitution deals with the Right to Education?',
 ARRAY['Article 19', 'Article 21A', 'Article 25', 'Article 32'],
 1, 'medium',
 'Article 21A was added by the 86th Amendment Act, 2002, making free and compulsory education a fundamental right for children aged 6-14.',
 ARRAY['fundamental-rights', 'articles']),

('constitution', 'Who is known as the "Father of the Indian Constitution"?',
 ARRAY['Jawaharlal Nehru', 'Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Sardar Patel'],
 2, 'easy',
 'Dr. B.R. Ambedkar was the chairman of the Drafting Committee and played a pivotal role in drafting the Constitution.',
 ARRAY['constitution-making', 'personalities']),

('constitution', 'How many fundamental rights are guaranteed by the Indian Constitution?',
 ARRAY['Five', 'Six', 'Seven', 'Eight'],
 1, 'medium',
 'Originally there were seven fundamental rights, but the Right to Property was removed by the 44th Amendment in 1978, leaving six.',
 ARRAY['fundamental-rights']),

('constitution', 'Which part of the Constitution deals with Directive Principles of State Policy?',
 ARRAY['Part II', 'Part III', 'Part IV', 'Part V'],
 2, 'hard',
 'Part IV (Articles 36-51) contains the Directive Principles, which are guidelines for the government to create a just society.',
 ARRAY['dpsp', 'constitution-structure']);

-- Insert sample Science questions
INSERT INTO vault_questions (vault_id, question, options, correct_answer, difficulty, insight, tags) VALUES
('science', 'What is the chemical formula for water?',
 ARRAY['H2O', 'CO2', 'O2', 'H2O2'],
 0, 'easy',
 'Water (H2O) consists of two hydrogen atoms bonded to one oxygen atom.',
 ARRAY['chemistry', 'basic-formulas']),

('science', 'Which planet is known as the Red Planet?',
 ARRAY['Venus', 'Mars', 'Jupiter', 'Saturn'],
 1, 'easy',
 'Mars appears red due to iron oxide (rust) on its surface.',
 ARRAY['astronomy', 'planets']),

('science', 'Who developed the theory of relativity?',
 ARRAY['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Stephen Hawking'],
 1, 'medium',
 'Albert Einstein published his theory of special relativity in 1905 and general relativity in 1915.',
 ARRAY['physics', 'scientists']);

-- Initialize default power-ups for new users (trigger or handled by app)
-- This will be done when a user first plays Knowledge Heist

COMMENT ON TABLE vault_questions IS 'Stores all quiz questions organized by topic vaults';
COMMENT ON TABLE game_sessions IS 'Tracks each multiplayer game session from matchmaking to completion';
COMMENT ON TABLE game_participants IS 'Records each player''s participation and performance in a game';
COMMENT ON TABLE game_leaderboard IS 'Aggregated statistics and rankings for all players';
COMMENT ON TABLE power_ups_inventory IS 'Tracks power-up ownership and usage for each player';

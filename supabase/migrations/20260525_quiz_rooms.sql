-- ============================================================
-- Quiz Rooms Feature: Tables, Functions & Policies
-- ============================================================

-- 1. Quiz Rooms table
CREATE TABLE IF NOT EXISTS quiz_rooms (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_name      TEXT NOT NULL DEFAULT 'Host',
  title             TEXT NOT NULL,
  topic             TEXT NOT NULL,
  exam_category     TEXT,
  question_count    INT NOT NULL DEFAULT 10,
  time_per_question INT NOT NULL DEFAULT 20, -- seconds
  prize_pool        INT NOT NULL DEFAULT 0,
  winner_count      INT NOT NULL DEFAULT 3,
  prize_splits      INT[] NOT NULL DEFAULT '{}',
  questions_data    JSONB NOT NULL DEFAULT '[]',
  status            TEXT NOT NULL DEFAULT 'waiting'
                      CHECK (status IN ('waiting', 'active', 'completed')),
  join_code         TEXT NOT NULL UNIQUE,
  participant_count INT NOT NULL DEFAULT 0,
  ended_at          TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_rooms_creator    ON quiz_rooms(creator_id);
CREATE INDEX IF NOT EXISTS idx_quiz_rooms_join_code  ON quiz_rooms(join_code);
CREATE INDEX IF NOT EXISTS idx_quiz_rooms_status     ON quiz_rooms(status);

-- 2. Quiz Room Participants table
CREATE TABLE IF NOT EXISTS quiz_room_participants (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id        UUID NOT NULL REFERENCES quiz_rooms(id) ON DELETE CASCADE,
  user_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name   TEXT NOT NULL,
  score          INT NOT NULL DEFAULT 0,
  time_taken     INT NOT NULL DEFAULT 0, -- total seconds
  rank           INT,
  coin_reward    INT NOT NULL DEFAULT 0,
  answers        JSONB NOT NULL DEFAULT '[]',
  joined_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_room_participants_room    ON quiz_room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_user    ON quiz_room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_score   ON quiz_room_participants(room_id, score DESC, time_taken ASC);

-- 3. RPC: Safely increment participant_count
CREATE OR REPLACE FUNCTION increment_room_participants(room_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE quiz_rooms
  SET participant_count = participant_count + 1
  WHERE id = room_id AND status != 'completed';
END;
$$;

-- 4. RLS Policies
ALTER TABLE quiz_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_room_participants ENABLE ROW LEVEL SECURITY;

-- Quiz rooms: public read (anyone can view a room to join)
CREATE POLICY "Anyone can view quiz rooms"
  ON quiz_rooms FOR SELECT USING (true);

-- Quiz rooms: only creator can insert
CREATE POLICY "Creator can create quiz rooms"
  ON quiz_rooms FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Quiz rooms: only creator can update (end quiz, etc.)
CREATE POLICY "Creator can update own quiz rooms"
  ON quiz_rooms FOR UPDATE
  USING (auth.uid() = creator_id);

-- Participants: anyone can read (public leaderboard)
CREATE POLICY "Anyone can view participants"
  ON quiz_room_participants FOR SELECT USING (true);

-- Participants: anyone can join (with or without account)
CREATE POLICY "Anyone can join a room"
  ON quiz_room_participants FOR INSERT
  WITH CHECK (true);

-- Participants: only the participant row owner (or anon row) can update score
CREATE POLICY "Participant can update own score"
  ON quiz_room_participants FOR UPDATE
  USING (
    user_id = auth.uid()
    OR user_id IS NULL  -- anonymous participants
  );

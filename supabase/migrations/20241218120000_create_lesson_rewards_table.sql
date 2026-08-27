-- Migration: Create lesson_rewards table for proper reward tracking
-- This replaces the auto-distribute system with manual claiming

-- Create lesson_rewards table
CREATE TABLE IF NOT EXISTS public.lesson_rewards (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id text NOT NULL,
    reward_amount integer NOT NULL DEFAULT 50,
    claimed_at timestamp with time zone DEFAULT NOW(),
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW(),
    
    -- Prevent duplicate claims for same user/lesson
    UNIQUE(user_id, lesson_id)
);

-- Create user_progress table to track lesson completion
CREATE TABLE IF NOT EXISTS public.user_progress (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id text NOT NULL,
    status text NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked', 'completed')),
    completed_at timestamp with time zone,
    xp_earned integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW(),
    
    -- Prevent duplicate entries for same user/lesson
    UNIQUE(user_id, lesson_id)
);

-- Create user_stats table to track total MG tokens
CREATE TABLE IF NOT EXISTS public.user_stats (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    total_mg_tokens integer DEFAULT 0,
    current_streak integer DEFAULT 0,
    longest_streak integer DEFAULT 0,
    lessons_completed integer DEFAULT 0,
    last_activity_date date,
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_lesson_rewards_user_id ON public.lesson_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_rewards_lesson_id ON public.lesson_rewards(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON public.user_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.lesson_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Users can only see their own records
CREATE POLICY "Users can view own lesson rewards"
    ON public.lesson_rewards FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson rewards"
    ON public.lesson_rewards FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own progress"
    ON public.user_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON public.user_progress FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own stats"
    ON public.user_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
    ON public.user_stats FOR ALL
    USING (auth.uid() = user_id);

-- Create function to update user_stats when rewards are claimed
CREATE OR REPLACE FUNCTION update_user_stats_on_reward_claim()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total MG tokens
    INSERT INTO public.user_stats (user_id, total_mg_tokens, last_activity_date)
    VALUES (NEW.user_id, NEW.reward_amount, CURRENT_DATE)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        total_mg_tokens = public.user_stats.total_mg_tokens + NEW.reward_amount,
        last_activity_date = CURRENT_DATE,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update stats when reward is claimed
CREATE TRIGGER trigger_update_stats_on_reward
    AFTER INSERT ON public.lesson_rewards
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats_on_reward_claim();

-- Create function to update lesson completion count
CREATE OR REPLACE FUNCTION update_lesson_completion_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        -- Increment lessons completed count
        INSERT INTO public.user_stats (user_id, lessons_completed, last_activity_date)
        VALUES (NEW.user_id, 1, CURRENT_DATE)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
            lessons_completed = public.user_stats.lessons_completed + 1,
            last_activity_date = CURRENT_DATE,
            updated_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for lesson completion tracking
CREATE TRIGGER trigger_update_lesson_completion
    AFTER INSERT OR UPDATE ON public.user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_lesson_completion_count();

-- Insert initial user_stats for existing users (if any)
INSERT INTO public.user_stats (user_id, total_mg_tokens, lessons_completed)
SELECT 
    id as user_id,
    0 as total_mg_tokens,
    0 as lessons_completed
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
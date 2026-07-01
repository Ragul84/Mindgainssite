-- Migration: Create user_memory table for personalized learning
-- This table stores proficiency levels for specific topics to drive the Mascot's intelligence.

CREATE TABLE IF NOT EXISTS public.user_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    subject TEXT NOT NULL,
    subtopic TEXT,
    proficiency_score INTEGER DEFAULT 0,
    attempts_count INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    last_interacted TIMESTAMPTZ DEFAULT now(),
    weak_areas TEXT[] DEFAULT '{}',
    strong_areas TEXT[] DEFAULT '{}',
    learning_pattern JSONB DEFAULT '{}'::jsonb,
    difficulty_preference TEXT DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, topic)
);

-- Enable RLS
ALTER TABLE public.user_memory ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_memory' AND policyname = 'Users can manage their own memory'
    ) THEN
        CREATE POLICY "Users can manage their own memory" ON public.user_memory
            FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_memory_user_id ON public.user_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memory_topic ON public.user_memory(topic);

-- Trigger for updated_at
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'user_memory_touch') THEN
        CREATE TRIGGER user_memory_touch
        BEFORE UPDATE ON public.user_memory
        FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
    END IF;
END $$;

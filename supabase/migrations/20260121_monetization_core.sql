-- 💰 MONETIZATION CORE - Transactions & Usage Reset
-- This script unifies the existing subscription schema with the refined monetization plan.

-- 1. Ensure Transactions table exists for audit logs
CREATE TABLE IF NOT EXISTS public.user_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL, -- positive for credit, negative for debit
    currency_type TEXT NOT NULL CHECK (currency_type IN ('mg', 'xp', 'gems')),
    transaction_type TEXT NOT NULL, -- 'lesson_reward', 'heist_entry', 'heist_win', 'store_purchase', 'daily_streak'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for transaction history
CREATE INDEX IF NOT EXISTS idx_user_transactions_user_date ON public.user_transactions(user_id, created_at DESC);

-- 2. Enhance user_profiles with usage tracking if not present
-- (Note: subscription_tier and daily_usage_count are already present from previous migrations)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS total_lessons_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS heist_plays_today INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lessons_unlocked_today INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_chat_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS unlocked_vaults TEXT[] DEFAULT '{}';

-- 3. Create a unified usage reset function
CREATE OR REPLACE FUNCTION public.reset_daily_usage_unified(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.user_profiles
    SET 
        daily_usage_count = 0, -- Legacy column from 2025 migration
        heist_plays_today = 0,
        lessons_unlocked_today = 0,
        daily_chat_count = 0,
        daily_usage_date = CURRENT_DATE
    WHERE id = p_user_id;

    -- Also clear the more granular feature_usage table for the new day
    -- This ensures the UI reflects fresh limits
    DELETE FROM public.feature_usage 
    WHERE user_id = p_user_id AND date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Unified Reward Function (XP + MG + Transaction Log)
-- This ensures that whenever XP/MG is given, it's logged correctly
CREATE OR REPLACE FUNCTION public.award_user_rewards(
    p_user_id UUID,
    p_mg_amount INTEGER,
    p_xp_amount INTEGER,
    p_reason TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS VOID AS $$
BEGIN
    -- Update Profile
    UPDATE public.user_profiles
    SET 
        total_xp = COALESCE(total_xp, 0) + p_xp_amount
        -- coins are usually synced to total_xp in this app based on rewardService.ts
    WHERE id = p_user_id;

    -- Log MG Transaction
    IF p_mg_amount != 0 THEN
        INSERT INTO public.user_transactions (user_id, amount, currency_type, transaction_type, metadata)
        VALUES (p_user_id, p_mg_amount, 'mg', p_reason, p_metadata);
    END IF;

    -- Log XP Transaction
    IF p_xp_amount != 0 THEN
        INSERT INTO public.user_transactions (user_id, amount, currency_type, transaction_type, metadata)
        VALUES (p_user_id, p_xp_amount, 'xp', p_reason, p_metadata);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS
ALTER TABLE public.user_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.user_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- 💰 MIGA Voice Subscription Tiers - Pro ₹199, Premium ₹399
-- Add subscription tiers for new feature system

-- Create enum for subscription tiers
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'premium');

-- Add subscription tier column to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN subscription_tier subscription_tier DEFAULT 'free',
ADD COLUMN subscription_expires_at TIMESTAMPTZ,
ADD COLUMN subscription_created_at TIMESTAMPTZ,
ADD COLUMN subscription_payment_id TEXT,
ADD COLUMN daily_usage_count INTEGER DEFAULT 0,
ADD COLUMN daily_usage_date DATE DEFAULT CURRENT_DATE;

-- Create subscription_logs table for tracking
CREATE TABLE subscription_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tier subscription_tier NOT NULL,
  action TEXT NOT NULL, -- 'subscribe', 'cancel', 'expire', 'upgrade', 'downgrade'
  payment_id TEXT,
  amount INTEGER, -- in paise (₹199 = 19900 paise)
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create feature_usage table for tracking feature usage
CREATE TABLE feature_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature_type TEXT NOT NULL, -- 'pdf', 'quiz', 'flashcards', 'schedule', 'tutor'
  usage_count INTEGER DEFAULT 1,
  date DATE DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Unique constraint to track daily usage per feature
  UNIQUE(user_id, feature_type, date)
);

-- Create function to check daily usage limit
CREATE OR REPLACE FUNCTION check_daily_usage_limit(
  p_user_id UUID
) RETURNS JSONB AS $$
DECLARE
  user_tier subscription_tier;
  is_expired BOOLEAN;
  current_usage INTEGER;
  usage_date DATE;
  daily_limit INTEGER;
  can_use BOOLEAN;
BEGIN
  -- Get user subscription tier and current usage
  SELECT 
    subscription_tier,
    CASE 
      WHEN subscription_expires_at IS NULL THEN FALSE
      WHEN subscription_expires_at < now() THEN TRUE
      ELSE FALSE
    END,
    daily_usage_count,
    daily_usage_date
  INTO user_tier, is_expired, current_usage, usage_date
  FROM user_profiles 
  WHERE id = p_user_id;
  
  -- If subscription expired, treat as free
  IF is_expired THEN
    user_tier := 'free';
    
    -- Update user profile to reflect expired status
    UPDATE user_profiles 
    SET subscription_tier = 'free'
    WHERE id = p_user_id;
  END IF;
  
  -- Reset usage count if new day
  IF usage_date != CURRENT_DATE THEN
    UPDATE user_profiles 
    SET 
      daily_usage_count = 0,
      daily_usage_date = CURRENT_DATE
    WHERE id = p_user_id;
    current_usage := 0;
  END IF;
  
  -- Set daily limits based on tier
  CASE user_tier
    WHEN 'free' THEN daily_limit := 0;  -- Free users get no access
    WHEN 'pro' THEN daily_limit := 3;   -- Pro users get 3 uses per day
    WHEN 'premium' THEN daily_limit := 10; -- Premium users get 10 uses per day
    ELSE daily_limit := 0;
  END CASE;
  
  -- Check if user can use features
  can_use := current_usage < daily_limit;
  
  RETURN jsonb_build_object(
    'can_use', can_use,
    'usage_count', current_usage,
    'daily_limit', daily_limit,
    'remaining', GREATEST(0, daily_limit - current_usage),
    'tier', user_tier,
    'resets_at', (CURRENT_DATE + INTERVAL '1 day')::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to use a feature (increments usage count)
CREATE OR REPLACE FUNCTION use_miga_feature(
  p_user_id UUID,
  p_feature_type TEXT,
  p_metadata JSONB DEFAULT '{}'
) RETURNS JSONB AS $$
DECLARE
  usage_status JSONB;
  can_use BOOLEAN;
BEGIN
  -- Check if user can use features
  usage_status := check_daily_usage_limit(p_user_id);
  can_use := (usage_status->>'can_use')::BOOLEAN;
  
  -- If user cannot use features, return status
  IF NOT can_use THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Daily usage limit reached',
      'usage_status', usage_status
    );
  END IF;
  
  -- Increment usage count
  UPDATE user_profiles 
  SET daily_usage_count = daily_usage_count + 1
  WHERE id = p_user_id;
  
  -- Log the feature usage
  INSERT INTO feature_usage (user_id, feature_type, metadata)
  VALUES (p_user_id, p_feature_type, p_metadata)
  ON CONFLICT (user_id, feature_type, date)
  DO UPDATE SET 
    usage_count = feature_usage.usage_count + 1,
    metadata = p_metadata;
  
  -- Return updated status
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Feature used successfully',
    'usage_status', check_daily_usage_limit(p_user_id)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to upgrade subscription
CREATE OR REPLACE FUNCTION upgrade_subscription(
  p_user_id UUID,
  p_tier subscription_tier,
  p_payment_id TEXT,
  p_amount INTEGER
) RETURNS VOID AS $$
DECLARE
  current_tier subscription_tier;
  expires_at TIMESTAMPTZ;
BEGIN
  -- Get current tier
  SELECT subscription_tier INTO current_tier
  FROM user_profiles WHERE id = p_user_id;
  
  -- Calculate expiry (30 days from now)
  expires_at := now() + INTERVAL '30 days';
  
  -- Update user profile
  UPDATE user_profiles 
  SET 
    subscription_tier = p_tier,
    subscription_expires_at = expires_at,
    subscription_created_at = COALESCE(subscription_created_at, now()),
    subscription_payment_id = p_payment_id
  WHERE id = p_user_id;
  
  -- Log the subscription change
  INSERT INTO subscription_logs (user_id, tier, action, payment_id, amount)
  VALUES (p_user_id, p_tier, 'subscribe', p_payment_id, p_amount);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RLS policies
ALTER TABLE subscription_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;

-- Subscription logs - users can only see their own
CREATE POLICY "subscription_logs_select_own" ON subscription_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Feature usage - users can only see their own
CREATE POLICY "feature_usage_select_own" ON feature_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "feature_usage_insert_own" ON feature_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "feature_usage_update_own" ON feature_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_subscription_logs_user_id ON subscription_logs(user_id);
CREATE INDEX idx_subscription_logs_created_at ON subscription_logs(created_at DESC);
CREATE INDEX idx_feature_usage_user_date ON feature_usage(user_id, date DESC);
CREATE INDEX idx_feature_usage_feature_type ON feature_usage(feature_type);

-- Add helpful comments
COMMENT ON TYPE subscription_tier IS 'MIGA Voice subscription tiers: free (0 uses), pro (3 uses/day, ₹199), premium (10 uses/day, ₹399)';
COMMENT ON TABLE subscription_logs IS 'Track subscription changes and payments';
COMMENT ON TABLE feature_usage IS 'Track daily feature usage per user';
COMMENT ON FUNCTION check_daily_usage_limit IS 'Check if user can use MIGA features based on daily limits';
COMMENT ON FUNCTION use_miga_feature IS 'Use a MIGA feature and track usage count';
COMMENT ON FUNCTION upgrade_subscription IS 'Upgrade user subscription tier with payment tracking';
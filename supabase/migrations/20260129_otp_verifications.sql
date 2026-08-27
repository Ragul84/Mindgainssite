-- OTP Verifications table for WhatsApp/SMS OTP flow
-- Run this migration in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL UNIQUE,
  otp TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_verifications(phone);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_verifications(expires_at);

-- Auto-cleanup expired OTPs (optional - run via cron)
-- DELETE FROM otp_verifications WHERE expires_at < NOW() - INTERVAL '1 hour';

-- Add phone_number column to user_profiles if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN phone_number TEXT;
    CREATE INDEX idx_profiles_phone ON user_profiles(phone_number);
  END IF;
END $$;

-- RLS Policies
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- Only service role can access OTP table (edge functions use service role)
CREATE POLICY "Service role full access" ON otp_verifications
  FOR ALL USING (auth.role() = 'service_role');

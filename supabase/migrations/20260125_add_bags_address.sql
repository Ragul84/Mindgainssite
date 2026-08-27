-- Add bags_address to user_profiles for KnowledgeHeist rewards
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS bags_address TEXT;

-- Validation check (lightweight)
-- Accept single wallet address string
-- Min length threshold >= 20 characters
ALTER TABLE public.user_profiles
DROP CONSTRAINT IF EXISTS check_bags_address_format;

ALTER TABLE public.user_profiles
ADD CONSTRAINT check_bags_address_format 
CHECK (bags_address IS NULL OR (length(bags_address) >= 20 AND bags_address ~ '^[a-zA-Z0-9]+$'));

COMMENT ON COLUMN public.user_profiles.bags_address IS 'Bags wallet address for gifting KnowledgeHeist rewards';

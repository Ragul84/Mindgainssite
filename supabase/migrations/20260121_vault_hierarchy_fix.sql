-- 🏛️ RE-ORGANIZING VAULTS: Constitution -> Polity
-- This migration updates the vault names to follow a proper subject hierarchy.

-- 1. Drop existing constraint
ALTER TABLE public.vault_questions 
DROP CONSTRAINT IF EXISTS vault_questions_vault_id_check;

-- 2. Migrate existing 'constitution' data to 'polity' BEFORE adding new constraint
UPDATE public.vault_questions 
SET vault_id = 'polity' 
WHERE vault_id = 'constitution';

-- 3. Update game_sessions table
UPDATE public.game_sessions 
SET vault_id = 'polity' 
WHERE vault_id = 'constitution';

-- 4. Migrate any 'pyq-archives' to 'general'
UPDATE public.vault_questions 
SET vault_id = 'general' 
WHERE vault_id = 'pyq-archives';

UPDATE public.game_sessions 
SET vault_id = 'general' 
WHERE vault_id = 'pyq-archives';

-- 5. Add the new strict constraint
ALTER TABLE public.vault_questions 
ADD CONSTRAINT vault_questions_vault_id_check 
CHECK (vault_id IN ('polity', 'science', 'economy', 'current-affairs', 'history', 'geography', 'general'));

-- 6. Update the get_vault_questions function fallback
CREATE OR REPLACE FUNCTION public.get_vault_questions(
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
  FROM public.vault_questions vq
  WHERE 
    (p_vault_id = 'general' OR vq.vault_id = p_vault_id)
    AND vq.is_active = true
    AND (p_difficulty IS NULL OR vq.difficulty = p_difficulty)
  ORDER BY RANDOM()
  LIMIT p_count;
END;
$$ LANGUAGE plpgsql;

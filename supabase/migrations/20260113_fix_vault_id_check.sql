-- Add pyq-archives to allowed vault_ids
ALTER TABLE vault_questions DROP CONSTRAINT IF EXISTS vault_questions_vault_id_check;
ALTER TABLE vault_questions ADD CONSTRAINT vault_questions_vault_id_check 
CHECK (vault_id IN ('constitution', 'science', 'economy', 'current-affairs', 'history', 'geography', 'pyq-archives'));

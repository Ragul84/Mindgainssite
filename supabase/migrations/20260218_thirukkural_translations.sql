-- Daily Thirukkural translations cache (multi-language)
CREATE TABLE IF NOT EXISTS public.thirukkural_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kural_number INTEGER NOT NULL,
  lang TEXT NOT NULL,
  meaning TEXT,
  explanation_modern TEXT,
  life_application TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (kural_number, lang)
);

CREATE INDEX IF NOT EXISTS idx_thirukkural_translations_kural_lang
  ON public.thirukkural_translations (kural_number, lang);

ALTER TABLE public.thirukkural_translations ENABLE ROW LEVEL SECURITY;

-- Allow read for all authenticated users
CREATE POLICY "thirukkural_translations_read"
  ON public.thirukkural_translations
  FOR SELECT
  USING (auth.role() = 'authenticated');

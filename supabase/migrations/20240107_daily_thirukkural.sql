-- Create Daily Thirukkural table
CREATE TABLE IF NOT EXISTS thirukkural (
    id SERIAL PRIMARY KEY,
    kural_number INT UNIQUE NOT NULL CHECK (kural_number BETWEEN 1 AND 1330),
    chapter_tamil VARCHAR(100) NOT NULL,
    chapter_english VARCHAR(100) NOT NULL,
    section_tamil VARCHAR(100) NOT NULL,
    section_english VARCHAR(100) NOT NULL,
    kural_tamil TEXT NOT NULL,
    kural_transliteration TEXT NOT NULL,
    meaning_tamil TEXT NOT NULL,
    meaning_english TEXT NOT NULL,
    explanation_modern TEXT, -- Modern context explanation
    life_application TEXT, -- How to apply in daily life
    keywords TEXT[], -- For search and discovery
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Daily Selection table
CREATE TABLE IF NOT EXISTS daily_thirukkural_selection (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    kural_id INT REFERENCES thirukkural(id),
    theme VARCHAR(100), -- Daily theme (success, friendship, wisdom, etc.)
    special_occasion VARCHAR(200), -- Festival, event, etc.
    view_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create User Interactions table
CREATE TABLE IF NOT EXISTS thirukkural_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    kural_id INT REFERENCES thirukkural(id),
    interaction_type VARCHAR(50) CHECK (interaction_type IN ('viewed', 'liked', 'shared', 'saved')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, kural_id, interaction_type)
);

-- Insert sample Thirukkural data
INSERT INTO thirukkural (
    kural_number, 
    chapter_tamil, 
    chapter_english,
    section_tamil,
    section_english,
    kural_tamil,
    kural_transliteration,
    meaning_tamil,
    meaning_english,
    explanation_modern,
    life_application,
    keywords
) VALUES 
(1, 
 'கடவுள் வாழ்த்து', 
 'Praise of God',
 'அறத்துப்பால்',
 'Virtue',
 'அகர முதல எழுத்தெல்லாம் ஆதி
பகவன் முதற்றே உலகு',
 'Agara mudhala ezhuthellam aadhi
Bhagavan mudhatre ulagu',
 'எழுத்துக்கள் எல்லாம் அகரத்தில் தொடங்குவது போல, உலகம் கடவுளில் தொடங்குகிறது',
 'As the letter A is the first of all letters, so the eternal God is first in the world',
 'Just as ''A'' is the foundation of all language and communication, having a strong foundation (whether spiritual, moral, or educational) is essential for any meaningful achievement in life.',
 'Start every important task with proper planning and foundation. In studies, master basics before advancing. In career, build core skills first.',
 ARRAY['foundation', 'beginning', 'god', 'wisdom', 'first principles']
),
(2,
 'கடவுள் வாழ்த்து',
 'Praise of God',
 'அறத்துப்பால்',
 'Virtue',
 'கற்றதனால் ஆய பயனென்கொல் வாலறிவன்
நற்றாள் தொழாஅர் எனின்',
 'Katradhanaal aaya payanenkol vaalarivan
Natraal thozhaaar enin',
 'கற்ற கல்வியால் என்ன பயன், தூய அறிவின் இறைவனை வணங்காவிட்டால்?',
 'What profit have those derived from learning, who worship not the good feet of Him who is pure knowledge?',
 'Education without values and humility is incomplete. True knowledge includes understanding our place in the larger scheme of things and respecting higher principles.',
 'Balance academic excellence with character development. Success without ethics is hollow. Stay humble despite achievements.',
 ARRAY['education', 'humility', 'values', 'knowledge', 'worship']
),
(391,
 'கல்வி',
 'Learning',
 'அறத்துப்பால்',
 'Virtue', 
 'கற்க கசடறக் கற்பவை கற்றபின்
நிற்க அதற்குத் தக',
 'Karka kasadara karpavai kattrapin
Nirka adharku thaga',
 'கற்க வேண்டியவற்றை முழுமையாகக் கற்று, கற்றதற்கு ஏற்ப நடந்து கொள்ள வேண்டும்',
 'Learn thoroughly what should be learned, and then live according to what you have learned',
 'Don''t just accumulate knowledge - apply it. True learning transforms behavior. The gap between knowing and doing is where most people fail.',
 'After learning any concept, immediately practice it. Apply classroom knowledge in real situations. Let your actions reflect your education.',
 ARRAY['learning', 'practice', 'application', 'integrity', 'education']
),
(1330,
 'ஊழ்',
 'Fate',
 'ஊழியல்',
 'Fate',
 'ஊழிற் பெருவலி யாவுள மற்றொன்று
சூழினும் தான்முந் துறும்',
 'Ozhir peruvali yaavula matronru
Sozhinum thaan mundhurum',
 'விதியை விட வலிமையானது எதுவும் இல்லை; திட்டமிட்டாலும் விதியே முந்திக்கொள்ளும்',
 'What is stronger than fate? Even if we plan otherwise, fate will prevail',
 'While fate plays a role, this doesn''t mean being passive. It means accepting what you cannot control while focusing fully on what you can control - your effort and attitude.',
 'Focus on your effort, not just results. Control what you can (preparation, attitude, persistence) and accept what you cannot. Success = Preparation + Opportunity.',
 ARRAY['fate', 'destiny', 'effort', 'acceptance', 'planning']
);

-- Create function to get daily Thirukkural
CREATE OR REPLACE FUNCTION get_daily_thirukkural(p_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    kural_number INT,
    chapter_tamil VARCHAR,
    chapter_english VARCHAR,
    kural_tamil TEXT,
    kural_transliteration TEXT,
    meaning_tamil TEXT,
    meaning_english TEXT,
    explanation_modern TEXT,
    life_application TEXT,
    theme VARCHAR,
    special_occasion VARCHAR
) AS $$
BEGIN
    -- First check if we have a selection for this date
    IF EXISTS (SELECT 1 FROM daily_thirukkural_selection WHERE date = p_date) THEN
        RETURN QUERY
        SELECT 
            t.kural_number,
            t.chapter_tamil,
            t.chapter_english,
            t.kural_tamil,
            t.kural_transliteration,
            t.meaning_tamil,
            t.meaning_english,
            t.explanation_modern,
            t.life_application,
            d.theme,
            d.special_occasion
        FROM daily_thirukkural_selection d
        JOIN thirukkural t ON d.kural_id = t.id
        WHERE d.date = p_date;
    ELSE
        -- Generate a deterministic "random" selection based on date
        RETURN QUERY
        WITH selected AS (
            SELECT * FROM thirukkural
            ORDER BY id
            LIMIT 1
            OFFSET (EXTRACT(DOY FROM p_date)::INT - 1) % (SELECT COUNT(*) FROM thirukkural)
        )
        SELECT 
            s.kural_number,
            s.chapter_tamil,
            s.chapter_english,
            s.kural_tamil,
            s.kural_transliteration,
            s.meaning_tamil,
            s.meaning_english,
            s.explanation_modern,
            s.life_application,
            'Daily Wisdom'::VARCHAR as theme,
            NULL::VARCHAR as special_occasion
        FROM selected s;
        
        -- Also insert this selection for future reference
        INSERT INTO daily_thirukkural_selection (date, kural_id, theme)
        SELECT p_date, id, 'Daily Wisdom'
        FROM thirukkural
        ORDER BY id
        LIMIT 1
        OFFSET (EXTRACT(DOY FROM p_date)::INT - 1) % (SELECT COUNT(*) FROM thirukkural);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX idx_thirukkural_number ON thirukkural(kural_number);
CREATE INDEX idx_daily_selection_date ON daily_thirukkural_selection(date);
CREATE INDEX idx_interactions_user ON thirukkural_interactions(user_id);
CREATE INDEX idx_thirukkural_keywords ON thirukkural USING GIN(keywords);

-- Grant permissions
GRANT SELECT ON thirukkural TO authenticated;
GRANT SELECT, INSERT, UPDATE ON daily_thirukkural_selection TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON thirukkural_interactions TO authenticated;
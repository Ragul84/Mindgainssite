-- Create Daily Dose table for facts, laws, and interesting information
CREATE TABLE IF NOT EXISTS daily_dose (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type VARCHAR(50) CHECK (content_type IN ('fact', 'law', 'history', 'science', 'culture', 'achievement')),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    explanation TEXT,
    source VARCHAR(200),
    category VARCHAR(100),
    tags TEXT[],
    importance_level INT CHECK (importance_level BETWEEN 1 AND 5),
    is_india_specific BOOLEAN DEFAULT false,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Daily Dose Schedule table
CREATE TABLE IF NOT EXISTS daily_dose_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    dose_id UUID REFERENCES daily_dose(id),
    special_occasion VARCHAR(200),
    view_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create User Interactions table for daily dose
CREATE TABLE IF NOT EXISTS daily_dose_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dose_id UUID REFERENCES daily_dose(id),
    interaction_type VARCHAR(50) CHECK (interaction_type IN ('viewed', 'liked', 'shared', 'saved', 'learned')),
    quiz_score INT,
    time_spent INT, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, dose_id, interaction_type)
);

-- Insert sample daily dose content
INSERT INTO daily_dose (content_type, title, content, explanation, source, category, tags, importance_level, is_india_specific) VALUES
-- Facts
('fact', 
 'Did You Know? The Human Brain''s Storage Capacity',
 'The human brain can store approximately 2.5 petabytes of information - that''s equivalent to 3 million hours of TV shows!',
 'Your brain has about 86 billion neurons, each forming thousands of connections. This creates a storage capacity far beyond any computer. Every time you learn something new, you''re literally reshaping your brain''s physical structure.',
 'Scientific American, 2024',
 'Science',
 ARRAY['brain', 'memory', 'neuroscience', 'learning'],
 5,
 false
),

('fact',
 'India''s Chandrayaan-3 Made History',
 'India became the first country to successfully land near the Moon''s south pole and only the fourth nation to achieve a soft lunar landing.',
 'The mission cost only ₹615 crores ($75 million) - less than the budget of many Hollywood movies. This achievement demonstrates India''s cost-effective space technology and positions us as a global space power.',
 'ISRO, 2023',
 'Achievement',
 ARRAY['space', 'ISRO', 'technology', 'india', 'moon'],
 5,
 true
),

-- Laws
('law',
 'Know Your Rights: Right to Education',
 'Under Article 21-A of the Indian Constitution, every child aged 6-14 has the fundamental right to free and compulsory education.',
 'This means no school can deny admission based on economic status, and government must provide free education. Private schools must reserve 25% seats for economically weaker sections under RTE Act.',
 'Constitution of India, RTE Act 2009',
 'Legal Rights',
 ARRAY['education', 'rights', 'constitution', 'RTE'],
 5,
 true
),

('law',
 'Digital Privacy: Your Data, Your Right',
 'Under India''s Digital Personal Data Protection Act 2023, companies must get your explicit consent before collecting personal data and you can demand deletion of your data anytime.',
 'You have the right to know what data is collected, how it''s used, and can withdraw consent anytime. Companies face penalties up to ₹250 crores for violations.',
 'DPDP Act 2023',
 'Digital Rights',
 ARRAY['privacy', 'digital', 'data', 'rights'],
 4,
 true
),

-- History
('history',
 'The Zero That Changed Mathematics',
 'Indian mathematician Aryabhata (476 CE) introduced the concept of zero as a number, revolutionizing mathematics forever.',
 'Before this, civilizations used empty spaces or dots. Aryabhata''s zero enabled complex calculations, algebra, and eventually computer science. Every digital device today works on binary (0 and 1) - India''s gift to the world.',
 'History of Mathematics',
 'History',
 ARRAY['mathematics', 'india', 'invention', 'zero', 'aryabhata'],
 5,
 true
),

-- Science
('science',
 'Your Smartphone Has More Power Than NASA''s 1969 Computer',
 'The computer that guided Apollo 11 to the moon had 2KB of RAM and 32KB storage. Your smartphone has millions of times more power!',
 'The Apollo Guidance Computer ran at 0.043 MHz. Today''s phones run at 2000+ MHz with 8GB+ RAM. This shows how exponentially technology has advanced in just 50 years.',
 'NASA Archives',
 'Technology',
 ARRAY['technology', 'space', 'computers', 'progress'],
 4,
 false
),

-- Culture
('culture',
 'Tamil: World''s Oldest Living Language',
 'Tamil is recognized as the world''s oldest living classical language, with literature dating back to 300 BCE.',
 'While Sanskrit, Greek, and Latin are older, Tamil is unique as it''s still spoken by 80+ million people daily. The Tolkappiyam, a Tamil grammar text, predates many world literary works.',
 'UNESCO, Linguistic Studies',
 'Culture',
 ARRAY['tamil', 'language', 'culture', 'heritage'],
 5,
 true
),

-- Achievement
('achievement',
 'India''s UPI Revolution',
 'India processes 46% of global real-time digital payments - more than the next four countries combined!',
 'UPI handles 10+ billion transactions monthly. What took decades in other countries, India achieved in 7 years. Even developed nations are now studying India''s digital payment model.',
 'NPCI, World Bank Report 2024',
 'Technology',
 ARRAY['UPI', 'fintech', 'digital', 'india', 'innovation'],
 5,
 true
),

-- Shocking Fact
('fact',
 'Plastic in Your Blood?',
 'Microplastics have been found in human blood for the first time - 80% of people tested had plastic particles in their bloodstream.',
 'These particles come from water bottles, food packaging, and even the air we breathe. Scientists are studying long-term health effects. Using steel bottles and avoiding single-use plastics can reduce exposure.',
 'Environment International Journal, 2022',
 'Environment',
 ARRAY['health', 'plastic', 'environment', 'shocking'],
 4,
 false
),

-- Important Law
('law',
 'Recording Without Consent is Illegal',
 'Recording someone''s private conversation without consent is punishable with up to 3 years imprisonment under IT Act Section 66E.',
 'This includes phone calls, video calls, and private meetings. However, recording in public places or your own conversations for evidence is generally legal. Always inform before recording.',
 'Information Technology Act, 2000',
 'Digital Law',
 ARRAY['privacy', 'recording', 'legal', 'digital'],
 4,
 true
);

-- Create function to get daily dose
CREATE OR REPLACE FUNCTION get_daily_dose(p_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    id UUID,
    content_type VARCHAR,
    title VARCHAR,
    content TEXT,
    explanation TEXT,
    source VARCHAR,
    category VARCHAR,
    tags TEXT[],
    importance_level INT,
    is_india_specific BOOLEAN,
    image_url TEXT,
    special_occasion VARCHAR
) AS $$
BEGIN
    -- First check if we have a scheduled dose for this date
    IF EXISTS (SELECT 1 FROM daily_dose_schedule WHERE date = p_date) THEN
        RETURN QUERY
        SELECT 
            d.id,
            d.content_type,
            d.title,
            d.content,
            d.explanation,
            d.source,
            d.category,
            d.tags,
            d.importance_level,
            d.is_india_specific,
            d.image_url,
            s.special_occasion
        FROM daily_dose_schedule s
        JOIN daily_dose d ON s.dose_id = d.id
        WHERE s.date = p_date;
        
        -- Update view count
        UPDATE daily_dose_schedule 
        SET view_count = view_count + 1 
        WHERE date = p_date;
    ELSE
        -- Generate a deterministic "random" selection based on date
        RETURN QUERY
        WITH selected AS (
            SELECT * FROM daily_dose
            ORDER BY id
            LIMIT 1
            OFFSET (EXTRACT(DOY FROM p_date)::INT - 1) % (SELECT COUNT(*) FROM daily_dose)
        )
        SELECT 
            s.id,
            s.content_type,
            s.title,
            s.content,
            s.explanation,
            s.source,
            s.category,
            s.tags,
            s.importance_level,
            s.is_india_specific,
            s.image_url,
            NULL::VARCHAR as special_occasion
        FROM selected s;
        
        -- Also insert this selection for future reference
        INSERT INTO daily_dose_schedule (date, dose_id)
        SELECT p_date, id
        FROM daily_dose
        ORDER BY id
        LIMIT 1
        OFFSET (EXTRACT(DOY FROM p_date)::INT - 1) % (SELECT COUNT(*) FROM daily_dose)
        ON CONFLICT (date) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to get multiple daily doses (for different types)
CREATE OR REPLACE FUNCTION get_daily_dose_bundle(p_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    content_type VARCHAR,
    title VARCHAR,
    content TEXT,
    explanation TEXT,
    source VARCHAR,
    category VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    WITH type_selection AS (
        SELECT DISTINCT ON (content_type)
            content_type,
            title,
            content,
            explanation,
            source,
            category
        FROM daily_dose
        WHERE content_type IN ('fact', 'law', 'history')
        ORDER BY content_type, 
                 EXTRACT(DOY FROM p_date) + LENGTH(content) % 100
    )
    SELECT * FROM type_selection;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX idx_daily_dose_type ON daily_dose(content_type);
CREATE INDEX idx_daily_dose_category ON daily_dose(category);
CREATE INDEX idx_daily_dose_tags ON daily_dose USING GIN(tags);
CREATE INDEX idx_dose_schedule_date ON daily_dose_schedule(date);
CREATE INDEX idx_dose_interactions_user ON daily_dose_interactions(user_id);

-- Grant permissions
GRANT SELECT ON daily_dose TO authenticated;
GRANT SELECT, INSERT, UPDATE ON daily_dose_schedule TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON daily_dose_interactions TO authenticated;
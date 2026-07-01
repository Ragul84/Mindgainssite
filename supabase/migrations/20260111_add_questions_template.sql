-- Knowledge Heist - Quick Add Questions Template
-- Copy this template to easily add new questions to any vault

-- ============================================================================
-- TEMPLATE: Copy and modify for each new question
-- ============================================================================

INSERT INTO vault_questions (
  vault_id,           -- 'constitution', 'science', 'economy', 'current-affairs', 'history', 'geography'
  question,           -- The question text
  options,            -- Array of 4 options
  correct_answer,     -- Index 0-3 of correct option
  difficulty,         -- 'easy', 'medium', 'hard'
  insight,            -- Learning tip shown after game
  explanation,        -- Detailed explanation (optional)
  tags                -- Array of tags for categorization
) VALUES (
  'constitution',
  'Your question here?',
  ARRAY['Option A', 'Option B', 'Option C', 'Option D'],
  0,  -- 0 = First option is correct
  'medium',
  'This is the learning insight that appears after the game.',
  'Optional detailed explanation of why this answer is correct.',
  ARRAY['tag1', 'tag2']
);

-- ============================================================================
-- CONSTITUTION VAULT - Additional Questions
-- ============================================================================

-- Question Set 1: Fundamental Rights
INSERT INTO vault_questions (vault_id, question, options, correct_answer, difficulty, insight, tags) VALUES
('constitution', 'Which article abolished untouchability?',
 ARRAY['Article 14', 'Article 15', 'Article 17', 'Article 19'],
 2, 'medium',
 'Article 17 abolishes untouchability and forbids its practice in any form.',
 ARRAY['fundamental-rights', 'articles']),

('constitution', 'The Preamble of the Indian Constitution declares India as:',
 ARRAY['Federal Republic', 'Sovereign Socialist Secular Democratic Republic', 'Parliamentary Democracy', 'Constitutional Monarchy'],
 1, 'easy',
 'The Preamble describes India as Sovereign, Socialist, Secular, Democratic Republic.',
 ARRAY['preamble', 'basics']),

('constitution', 'How many schedules are there in the Indian Constitution?',
 ARRAY['10', '11', '12', '13'],
 2, 'hard',
 'The Indian Constitution currently has 12 schedules covering various administrative aspects.',
 ARRAY['constitution-structure', 'schedules']);

-- Question Set 2: Governance
INSERT INTO vault_questions (vault_id, question, options, correct_answer, difficulty, insight, tags) VALUES
('constitution', 'The President of India is elected by:',
 ARRAY['Direct election by people', 'Electoral College', 'Parliament', 'Supreme Court'],
 1, 'medium',
 'The President is elected by an Electoral College consisting of elected members of Parliament and State Legislative Assemblies.',
 ARRAY['president', 'election']),

('constitution', 'What is the term of a Rajya Sabha member?',
 ARRAY['4 years', '5 years', '6 years', '7 years'],
 2, 'easy',
 'Rajya Sabha members serve a term of 6 years, with one-third retiring every 2 years.',
 ARRAY['rajya-sabha', 'parliament']),

('constitution', 'The concept of Judicial Review in India is borrowed from:',
 ARRAY['UK', 'USA', 'France', 'Canada'],
 1, 'medium',
 'India adopted the concept of Judicial Review from the United States Constitution.',
 ARRAY['judiciary', 'borrowed-features']);

-- ============================================================================
-- SCIENCE VAULT - Additional Questions
-- ============================================================================

INSERT INTO vault_questions (vault_id, question, options, correct_answer, difficulty, insight, tags) VALUES
('science', 'The process by which plants make food is called:',
 ARRAY['Respiration', 'Photosynthesis', 'Transpiration', 'Fermentation'],
 1, 'easy',
 'Photosynthesis is the process where plants use sunlight to convert CO2 and water into glucose and oxygen.',
 ARRAY['biology', 'plants']),

('science', 'What is the speed of light in vacuum?',
 ARRAY['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10¹⁰ m/s', '3 × 10⁷ m/s'],
 0, 'medium',
 'The speed of light in vacuum is approximately 3 × 10⁸ meters per second (300,000 km/s).',
 ARRAY['physics', 'constants']),

('science', 'Which gas makes up most of Earths atmosphere?',
 ARRAY['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
 2, 'easy',
 'Nitrogen makes up about 78% of Earths atmosphere, followed by oxygen at 21%.',
 ARRAY['atmosphere', 'chemistry']),

('science', 'The unit of electric current is:',
 ARRAY['Volt', 'Ampere', 'Ohm', 'Watt'],
 1, 'easy',
 'Ampere (A) is the SI unit of electric current, named after André-Marie Ampère.',
 ARRAY['physics', 'electricity', 'units']),

('science', 'DNA stands for:',
 ARRAY['Deoxyribonucleic Acid', 'Dinitrogen Acid', 'Dual Nucleic Acid', 'Dynamic Nuclear Acid'],
 0, 'medium',
 'DNA (Deoxyribonucleic Acid) carries genetic information in all living organisms.',
 ARRAY['biology', 'genetics']);

-- ============================================================================
-- ECONOMY VAULT - Sample Questions
-- ============================================================================

INSERT INTO vault_questions (vault_id, question, options, correct_answer, difficulty, insight, tags) VALUES
('economy', 'What does GDP stand for?',
 ARRAY['Gross Domestic Product', 'General Development Plan', 'Global Debt Product', 'Government Deficit Plan'],
 0, 'easy',
 'GDP is the total value of all goods and services produced within a countrys borders in a year.',
 ARRAY['basics', 'gdp']),

('economy', 'The Reserve Bank of India was established in:',
 ARRAY['1935', '1947', '1950', '1955'],
 0, 'medium',
 'RBI was established on April 1, 1935, under the Reserve Bank of India Act, 1934.',
 ARRAY['rbi', 'banking']),

('economy', 'GST stands for:',
 ARRAY['General Sales Tax', 'Goods and Services Tax', 'Government Service Tax', 'Global Standard Tax'],
 1, 'easy',
 'GST is a comprehensive indirect tax on manufacture, sale, and consumption of goods and services.',
 ARRAY['taxation', 'gst']),

('economy', 'The currency of India is managed by:',
 ARRAY['Ministry of Finance', 'Reserve Bank of India', 'NITI Aayog', 'Supreme Court'],
 1, 'easy',
 'RBI is responsible for issuing and managing Indias currency under the RBI Act, 1934.',
 ARRAY['rbi', 'currency']),

('economy', 'What is inflation?',
 ARRAY['Decrease in prices', 'Increase in general price level', 'Stable prices', 'Government budget'],
 1, 'medium',
 'Inflation is the rate at which the general level of prices for goods and services rises.',
 ARRAY['inflation', 'basics']);

-- ============================================================================
-- CURRENT AFFAIRS VAULT - Sample Questions (Update regularly!)
-- ============================================================================

INSERT INTO vault_questions (vault_id, question, options, correct_answer, difficulty, insight, tags) VALUES
('current-affairs', 'Who is the current Chief Justice of India (as of 2026)?',
 ARRAY['D.Y. Chandrachud', 'Sanjiv Khanna', 'N.V. Ramana', 'U.U. Lalit'],
 1, 'hard',
 'Keep track of current appointments and leadership changes in government institutions.',
 ARRAY['judiciary', '2026']),

('current-affairs', 'Which Indian city hosted the G20 Summit in 2023?',
 ARRAY['Mumbai', 'Bangalore', 'New Delhi', 'Hyderabad'],
 2, 'medium',
 'India held the G20 Presidency in 2023, with the main summit held in New Delhi.',
 ARRAY['g20', '2023', 'international']),

('current-affairs', 'What is Indias mission to the Moon called?',
 ARRAY['Mangalyaan', 'Chandrayaan', 'Gaganyaan', 'Aditya'],
 1, 'easy',
 'Chandrayaan is Indias lunar exploration program. Chandrayaan-3 successfully landed in 2023.',
 ARRAY['isro', 'space']);

-- ============================================================================
-- HISTORY VAULT - Sample Questions
-- ============================================================================

INSERT INTO vault_questions (vault_id, question, options, correct_answer, difficulty, insight, tags) VALUES
('history', 'Who was the first President of India?',
 ARRAY['Jawaharlal Nehru', 'Dr. Rajendra Prasad', 'Sardar Patel', 'Dr. S. Radhakrishnan'],
 1, 'easy',
 'Dr. Rajendra Prasad served as the first President from 1950 to 1962.',
 ARRAY['presidents', 'post-independence']),

('history', 'The Battle of Plassey was fought in:',
 ARRAY['1757', '1764', '1857', '1947'],
 0, 'medium',
 'The Battle of Plassey (1757) marked the beginning of British political control in India.',
 ARRAY['battles', 'british-rule']),

('history', 'Who founded the Maurya Empire?',
 ARRAY['Ashoka', 'Chandragupta Maurya', 'Bindusara', 'Chanakya'],
 1, 'medium',
 'Chandragupta Maurya founded the Maurya Empire around 321 BCE with Chanakyas guidance.',
 ARRAY['ancient-india', 'maurya']);

-- ============================================================================
-- GEOGRAPHY VAULT - Sample Questions
-- ============================================================================

INSERT INTO vault_questions (vault_id, question, options, correct_answer, difficulty, insight, tags) VALUES
('geography', 'Which is the longest river in India?',
 ARRAY['Yamuna', 'Brahmaputra', 'Ganga', 'Godavari'],
 2, 'easy',
 'The Ganga (Ganges) is the longest river in India at approximately 2,525 km.',
 ARRAY['rivers', 'physical-geography']),

('geography', 'The Tropic of Cancer passes through how many Indian states?',
 ARRAY['6', '8', '10', '12'],
 1, 'hard',
 'The Tropic of Cancer passes through 8 Indian states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram.',
 ARRAY['tropics', 'states']),

('geography', 'What is the southernmost point of India called?',
 ARRAY['Kanyakumari', 'Indira Point', 'Point Calimere', 'Dhanushkodi'],
 1, 'medium',
 'Indira Point in the Andaman & Nicobar Islands is the southernmost point of India.',
 ARRAY['extremities', 'islands']);

-- ============================================================================
-- QUICK STATS QUERY
-- ============================================================================

-- Check question count by vault
SELECT 
  vault_id,
  COUNT(*) as total_questions,
  COUNT(*) FILTER (WHERE difficulty = 'easy') as easy,
  COUNT(*) FILTER (WHERE difficulty = 'medium') as medium,
  COUNT(*) FILTER (WHERE difficulty = 'hard') as hard
FROM vault_questions
WHERE is_active = true
GROUP BY vault_id
ORDER BY vault_id;

-- ============================================================================
-- NOTES FOR CONTENT CREATORS
-- ============================================================================

/*
TIPS FOR WRITING GOOD QUIZ QUESTIONS:

1. Make questions CLEAR and UNAMBIGUOUS
2. Ensure all 4 options are plausible (no obvious wrong answers)
3. Write insights that are EDUCATIONAL, not just "answer was X"
4. Use tags for categorization and future filtering
5. Mix difficulty levels within each vault
6. Keep current affairs updated regularly
7. Verify facts before adding questions

TARGET DISTRIBUTION:
- Easy: 40% (for confidence building)
- Medium: 40% (core learning)
- Hard: 20% (challenge advanced users)

MINIMUM PER VAULT:
- 50 questions for good variety
- 100+ for excellent experience
*/

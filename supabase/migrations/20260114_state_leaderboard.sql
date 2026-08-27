-- State-level XP Aggregation for Knowledge Heist (Robust with 0 XP Defaults)
CREATE OR REPLACE FUNCTION get_state_leaderboard()
RETURNS TABLE (
  rank BIGINT,
  name TEXT,
  code TEXT,
  xp BIGINT,
  badge TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH all_states (s_name, s_code, s_badge) AS (
    VALUES 
      ('Maharashtra', 'MH', '🌆'),
      ('Karnataka', 'KA', '💻'),
      ('Tamil Nadu', 'TN', '🏺'),
      ('Gujarat', 'GJ', '🧵'),
      ('Delhi', 'DL', '🏛️'),
      ('West Bengal', 'WB', '🐅'),
      ('Rajasthan', 'RJ', '🏜️'),
      ('Uttar Pradesh', 'UP', '🕌'),
      ('Andhra Pradesh', 'AP', '💎'),
      ('Telangana', 'TS', '🏗️'),
      ('Madhya Pradesh', 'MP', '🏰'),
      ('Kerala', 'KL', '🌴'),
      ('Punjab', 'PB', '🌾'),
      ('Haryana', 'HR', '🐄'),
      ('Bihar', 'BR', '☸️'),
      ('Odisha', 'OR', '🌊'),
      ('Assam', 'AS', '🍃'),
      ('Jharkhand', 'JH', '⛰️'),
      ('Chhattisgarh', 'CH', '🌳'),
      ('Himachal Pradesh', 'HP', '❄️'),
      ('Uttarakhand', 'UK', '🏔️'),
      ('Goa', 'GA', '🏖️')
  ),
  state_stats AS (
    SELECT 
      user_state,
      SUM(total_xp_earned)::BIGINT as total_xp
    FROM game_leaderboard
    WHERE user_state IS NOT NULL
    GROUP BY user_state
  )
  SELECT 
    ROW_NUMBER() OVER (ORDER BY COALESCE(ss.total_xp, 0) DESC, ast.s_name ASC) as rank,
    ast.s_name as name,
    ast.s_code as code,
    COALESCE(ss.total_xp, 0) as xp,
    ast.s_badge as badge
  FROM all_states ast
  LEFT JOIN state_stats ss ON ast.s_name = ss.user_state
  ORDER BY xp DESC, name ASC;
END;
$$ LANGUAGE plpgsql;

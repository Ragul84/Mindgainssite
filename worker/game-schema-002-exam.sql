-- Migration for an existing game_league table (Hall of Fame exam filter).
ALTER TABLE game_league ADD COLUMN exam TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS game_league_week_city ON game_league (week, city);

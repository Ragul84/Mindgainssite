-- D1 schema for the Cut-Off Run league (binding GAME_DB).
-- Create:  npx wrangler d1 create mindgains-game   (then paste the database_id into wrangler.jsonc)
-- Apply:   npx wrangler d1 execute mindgains-game --remote --file worker/game-schema.sql
CREATE TABLE IF NOT EXISTS game_rounds_used (rid TEXT PRIMARY KEY, uid TEXT NOT NULL, used_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS game_runs (
  rid TEXT NOT NULL, uid TEXT NOT NULL, week INTEGER NOT NULL, day INTEGER NOT NULL,
  points INTEGER NOT NULL, correct INTEGER NOT NULL, wrong INTEGER NOT NULL, flagged INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS game_runs_uid_day ON game_runs (uid, day);
CREATE TABLE IF NOT EXISTS game_league (
  uid TEXT NOT NULL, week INTEGER NOT NULL, name TEXT NOT NULL, city TEXT NOT NULL DEFAULT '',
  score INTEGER NOT NULL DEFAULT 0, guest INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL,
  exam TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (uid, week));
CREATE INDEX IF NOT EXISTS game_league_week_score ON game_league (week, score DESC);
-- Housekeeping (cron or manual): DELETE FROM game_rounds_used WHERE used_at < (strftime('%s','now') - 86400) * 1000;

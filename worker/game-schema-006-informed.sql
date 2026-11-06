-- NationLap "Most Informed State": one row per player per IST day that they finished today's race.
-- Apply:  npx wrangler d1 execute mindgains-game --remote --file worker/game-schema-006-informed.sql
CREATE TABLE IF NOT EXISTS nl_informed (day INTEGER NOT NULL, uid TEXT NOT NULL, state TEXT NOT NULL, clean INTEGER NOT NULL, total INTEGER NOT NULL, at INTEGER NOT NULL, PRIMARY KEY (day, uid));
CREATE INDEX IF NOT EXISTS nl_informed_day_state ON nl_informed (day, state);

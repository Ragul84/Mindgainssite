-- NationLap friend ghosts: a shared lap, raced back by whoever opens the link (worker/game-social.js).
-- Apply:  npx wrangler d1 execute mindgains-game --remote --file worker/game-schema-005-ghosts.sql
CREATE TABLE IF NOT EXISTS nl_ghost (code TEXT PRIMARY KEY, name TEXT NOT NULL, kind TEXT NOT NULL, ms INTEGER NOT NULL, rec TEXT NOT NULL, at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS nl_ghost_at ON nl_ghost (at);

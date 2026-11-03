-- Cut-Off Run: questions a player has already been served, so rounds do not repeat (30 day window).
CREATE TABLE IF NOT EXISTS game_seen (uid TEXT NOT NULL, qid TEXT NOT NULL, at INTEGER NOT NULL, PRIMARY KEY (uid, qid));
CREATE INDEX IF NOT EXISTS game_seen_uid_at ON game_seen (uid, at);

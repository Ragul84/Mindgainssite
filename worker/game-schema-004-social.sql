-- Cut-Off Run social layer: Daily Paper, All-India Mock, groups, Bharat Board (worker/game-social.js).
-- Apply:  npx wrangler d1 execute mindgains-game --remote --file worker/game-schema-004-social.sql
ALTER TABLE game_league ADD COLUMN state TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS game_league_week_state ON game_league (week, state);
-- One row per player per paper (ev = 'p:<IST day>') or mock (ev = 'm:<week>'). The first submit counts.
CREATE TABLE IF NOT EXISTS game_event (
  ev TEXT NOT NULL, uid TEXT NOT NULL, name TEXT NOT NULL, state TEXT NOT NULL DEFAULT '',
  pts INTEGER NOT NULL, ms INTEGER NOT NULL, correct INTEGER NOT NULL, wrong INTEGER NOT NULL, skipped INTEGER NOT NULL,
  grid TEXT NOT NULL DEFAULT '', at INTEGER NOT NULL, PRIMARY KEY (ev, uid));
CREATE INDEX IF NOT EXISTS game_event_rank ON game_event (ev, pts DESC, ms ASC);
CREATE INDEX IF NOT EXISTS game_event_state ON game_event (ev, state);
CREATE TABLE IF NOT EXISTS game_event_join (ev TEXT NOT NULL, uid TEXT NOT NULL, at INTEGER NOT NULL, PRIMARY KEY (ev, uid));
-- Groups: kind is friends | coaching | college | creator.
CREATE TABLE IF NOT EXISTS game_group (code TEXT PRIMARY KEY, name TEXT NOT NULL, kind TEXT NOT NULL, owner TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS game_group_owner ON game_group (owner);
CREATE TABLE IF NOT EXISTS game_group_member (code TEXT NOT NULL, uid TEXT NOT NULL, joined_at INTEGER NOT NULL, PRIMARY KEY (code, uid));
CREATE INDEX IF NOT EXISTS game_group_member_uid ON game_group_member (uid);

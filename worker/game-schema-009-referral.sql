-- Refer-a-friend: 5 new friends who join the Live Theatre = 3 days of Pro for the referrer.
CREATE TABLE IF NOT EXISTS ref_code (uid TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE, at INTEGER NOT NULL);
-- one row per invitee, ever: an account can only be "brought" once
CREATE TABLE IF NOT EXISTS ref_join (invitee TEXT PRIMARY KEY, referrer TEXT NOT NULL, at INTEGER NOT NULL, rewarded INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS ref_join_by ON ref_join (referrer, rewarded);
CREATE TABLE IF NOT EXISTS ref_reward (uid TEXT NOT NULL, at INTEGER NOT NULL, days INTEGER NOT NULL);

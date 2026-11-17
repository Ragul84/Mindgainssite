-- Batch rooms: private study theatres (Pro owner, free members, optional teachers)
CREATE TABLE IF NOT EXISTS room (code TEXT PRIMARY KEY, name TEXT NOT NULL, owner TEXT NOT NULL, tkey TEXT NOT NULL, created INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS room_owner ON room(owner);
CREATE TABLE IF NOT EXISTS room_member (code TEXT NOT NULL, uid TEXT NOT NULL, name TEXT, role TEXT NOT NULL DEFAULT 'member', joined INTEGER NOT NULL, PRIMARY KEY (code, uid));
CREATE INDEX IF NOT EXISTS room_member_uid ON room_member(uid);
-- a member studied 10+ minutes in the room that day (batch streak)
CREATE TABLE IF NOT EXISTS room_day (code TEXT NOT NULL, day TEXT NOT NULL, uid TEXT NOT NULL, PRIMARY KEY (code, day, uid));
-- a member was in the room that day (streak needs everyone who showed up to reach 10 min)
CREATE TABLE IF NOT EXISTS room_seen (code TEXT NOT NULL, day TEXT NOT NULL, uid TEXT NOT NULL, PRIMARY KEY (code, day, uid));
-- quiz points per batch per week (batch vs batch rank)
CREATE TABLE IF NOT EXISTS room_week (code TEXT NOT NULL, wk TEXT NOT NULL, pts INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (code, wk));

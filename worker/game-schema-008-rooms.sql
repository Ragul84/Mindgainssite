-- Batch rooms: private study theatres (Pro owner, free members, optional teachers)
CREATE TABLE IF NOT EXISTS room (code TEXT PRIMARY KEY, name TEXT NOT NULL, owner TEXT NOT NULL, tkey TEXT NOT NULL, created INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS room_owner ON room(owner);
CREATE TABLE IF NOT EXISTS room_member (code TEXT NOT NULL, uid TEXT NOT NULL, name TEXT, role TEXT NOT NULL DEFAULT 'member', joined INTEGER NOT NULL, banned INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (code, uid));
CREATE INDEX IF NOT EXISTS room_member_uid ON room_member(uid);
-- minutes each member studied in the room per IST day (streak: >=50% of members at 10+ min)
CREATE TABLE IF NOT EXISTS room_day (code TEXT NOT NULL, day TEXT NOT NULL, uid TEXT NOT NULL, minutes INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (code, day, uid));
-- correct quiz answers per batch per week (weekly score = (minutes + correct*2) / members)
CREATE TABLE IF NOT EXISTS room_week (code TEXT NOT NULL, wk TEXT NOT NULL, pts INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (code, wk));
-- chat reports for review; 3 reporters in an hour auto-mute for 10 min
CREATE TABLE IF NOT EXISTS room_report (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL, reporter TEXT NOT NULL, uid TEXT NOT NULL, msg TEXT, created INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS room_report_uid ON room_report(code, uid, created);
-- failed joins per IP (unknown room codes) to stop code guessing
CREATE TABLE IF NOT EXISTS room_fail (ip TEXT NOT NULL, at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS room_fail_ip ON room_fail(ip, at);
ALTER TABLE pro_sub ADD COLUMN teacher_until INTEGER NOT NULL DEFAULT 0;

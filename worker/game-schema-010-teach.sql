-- Teach on MindGains (30% teacher referral). Already live in GAME_DB (created 21 Nov 2026); the Worker also
-- creates these lazily (teachEnsure in worker/teach.js), so running this file is optional and safe (IF NOT EXISTS).
CREATE TABLE IF NOT EXISTS teach_app (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, exam TEXT NOT NULL, channel TEXT NOT NULL DEFAULT '', audience TEXT NOT NULL DEFAULT '', note TEXT NOT NULL DEFAULT '', uid TEXT, status TEXT NOT NULL DEFAULT 'pending', code TEXT UNIQUE, claim_hash TEXT, at INTEGER NOT NULL, decided_at INTEGER);
CREATE INDEX IF NOT EXISTS teach_app_status ON teach_app (status, at);
CREATE INDEX IF NOT EXISTS teach_app_uid ON teach_app (uid);
CREATE TABLE IF NOT EXISTS teach_ref (uid TEXT PRIMARY KEY, code TEXT NOT NULL, clicked_at INTEGER NOT NULL, at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS teach_ref_code ON teach_ref (code, at);
CREATE TABLE IF NOT EXISTS teach_comm (order_id TEXT PRIMARY KEY, code TEXT NOT NULL, uid TEXT NOT NULL, plan TEXT NOT NULL, amount INTEGER NOT NULL, commission INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending', at INTEGER NOT NULL, paid_at INTEGER, payout_ref TEXT);
CREATE INDEX IF NOT EXISTS teach_comm_code ON teach_comm (code, status);
CREATE TABLE IF NOT EXISTS teach_click (code TEXT NOT NULL, day TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (code, day));

-- MindGains Pro: subscriptions, Razorpay payments, free watch allowance, synced streaks, quiz history.
-- Apply:  npx wrangler d1 execute mindgains-game --remote --file worker/game-schema-007-pro.sql
CREATE TABLE IF NOT EXISTS pro_sub (uid TEXT PRIMARY KEY, plan TEXT NOT NULL, until INTEGER NOT NULL, rzp_order TEXT, rzp_payment TEXT, at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS pro_pay (order_id TEXT PRIMARY KEY, uid TEXT NOT NULL, plan TEXT NOT NULL, amount INTEGER NOT NULL, status TEXT NOT NULL, payment_id TEXT, at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS pro_pay_uid ON pro_pay (uid);
CREATE TABLE IF NOT EXISTS watch_day (who TEXT NOT NULL, day TEXT NOT NULL, secs INTEGER NOT NULL, PRIMARY KEY (who, day));
CREATE TABLE IF NOT EXISTS streak (uid TEXT PRIMARY KEY, days TEXT NOT NULL, freezes INTEGER NOT NULL, month TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS quiz_hist (uid TEXT NOT NULL, qid TEXT NOT NULL, chapter TEXT NOT NULL, ok INTEGER NOT NULL, ms INTEGER NOT NULL, at INTEGER NOT NULL, PRIMARY KEY (uid, qid));
CREATE INDEX IF NOT EXISTS quiz_hist_uid ON quiz_hist (uid, at);
-- 2026-11-17: Night Race tickets (one-use, server-timed)
CREATE TABLE IF NOT EXISTS night_run (run TEXT PRIMARY KEY, uid TEXT NOT NULL, wk INTEGER NOT NULL, at INTEGER NOT NULL, used INTEGER NOT NULL);

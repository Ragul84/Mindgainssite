-- Cut-Off Run nationwide-launch telemetry and question-trust tables.
-- Apply: npx wrangler d1 execute mindgains-game --remote --file worker/game-schema-012-launch.sql
-- Analytics deliberately stores no IP address, account id, device id, name, city or free-form player text.
CREATE TABLE IF NOT EXISTS game_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT NOT NULL,
  session TEXT NOT NULL,
  at INTEGER NOT NULL,
  version TEXT NOT NULL DEFAULT '',
  exam TEXT NOT NULL DEFAULT '',
  data TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS game_analytics_event_at ON game_analytics (event, at);
CREATE INDEX IF NOT EXISTS game_analytics_session_at ON game_analytics (session, at);

CREATE TABLE IF NOT EXISTS game_question_report (
  qid TEXT NOT NULL,
  reporter TEXT NOT NULL,
  reason TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  at INTEGER NOT NULL,
  PRIMARY KEY (qid, reporter)
);
CREATE INDEX IF NOT EXISTS game_question_report_qid ON game_question_report (qid, at);

-- Runtime cleanup keeps anonymous product analytics and question reports for at most 365 days.

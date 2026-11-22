-- Cut-Off Run launch dashboard queries (read-only).
-- Run against GAME_DB, for example with Wrangler D1 execute --remote --command.

-- 1. Seven-day opt-in funnel by event.
SELECT event, COUNT(*) AS events, COUNT(DISTINCT session) AS sessions
FROM game_analytics
WHERE at >= (unixepoch('now', '-7 days') * 1000)
GROUP BY event
ORDER BY sessions DESC;

-- 2. Run completion and win rate by exam over the last seven days.
SELECT exam,
       COUNT(*) AS completed_runs,
       ROUND(100.0 * AVG(CASE WHEN json_extract(data, '$.win') THEN 1 ELSE 0 END), 1) AS win_rate_pct,
       ROUND(AVG(json_extract(data, '$.right')), 1) AS avg_correct
FROM game_analytics
WHERE event = 'level_end' AND at >= (unixepoch('now', '-7 days') * 1000)
GROUP BY exam
ORDER BY completed_runs DESC;

-- 3. Operational retention from server-scored runs (works for signed-in and hashed guest ids).
WITH first_day AS (
  SELECT uid, MIN(day) AS cohort_day FROM game_runs WHERE flagged = 0 GROUP BY uid
), activity AS (
  SELECT DISTINCT uid, day FROM game_runs WHERE flagged = 0
)
SELECT f.cohort_day,
       COUNT(*) AS new_players,
       SUM(EXISTS(SELECT 1 FROM activity a WHERE a.uid=f.uid AND a.day=f.cohort_day+1)) AS d1_players,
       SUM(EXISTS(SELECT 1 FROM activity a WHERE a.uid=f.uid AND a.day BETWEEN f.cohort_day+6 AND f.cohort_day+8)) AS d7_players
FROM first_day f
GROUP BY f.cohort_day
ORDER BY f.cohort_day DESC
LIMIT 30;

-- 4. Weekly exam and state mix from the real league.
SELECT exam, state, COUNT(*) AS players, ROUND(AVG(score), 1) AS avg_score
FROM game_league
WHERE week = (SELECT MAX(week) FROM game_league) AND score > 0
GROUP BY exam, state
ORDER BY players DESC
LIMIT 100;

-- 5. Question-quality queue; three distinct reports trigger automatic quarantine.
SELECT qid, COUNT(DISTINCT reporter) AS reporters, GROUP_CONCAT(DISTINCT reason) AS reasons, MAX(at) AS last_reported_at
FROM game_question_report
GROUP BY qid
ORDER BY reporters DESC, last_reported_at DESC
LIMIT 100;

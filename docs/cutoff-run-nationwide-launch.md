# Cut-Off Run nationwide launch

## Launch promise

“Beat today’s cut-off in three minutes.” One free, mobile-first practice run with immediate explanations, mistake review, exam-specific questions, and real ranks only in server-scored events.

The launch audience is adult UPSC, TNPSC, SSC, RRB and banking aspirants. NEET/JEE and other under-18 players use local web practice until a verifiable parental-consent flow exists in the signed-in app.

## Go-live gates

- Apply `worker/game-schema-012-launch.sql` to the production `GAME_DB`.
- Add the production `SUPABASE_PYQ_KEY` service-role secret; never expose it in client code.
- Verify `SUPABASE_URL`, `QUIZ_SECRET`, both game rate-limit bindings and `GAME_DB` in the production Worker.
- Deploy to a preview URL, then test onboarding, one correct/wrong/skipped answer, a completed run, a question report, Daily Paper, share link, install prompt and deletion on Android Chrome and iPhone Safari.
- Confirm no `/api/game/*` request occurs before adult onboarding. Confirm under-18 web sessions make no game API request.
- Run `node scripts/test-cutoff-run.cjs` and inspect `worker/game-launch-kpis.sql` after a seeded internal run.
- Obtain Indian privacy counsel’s sign-off on the updated privacy wording and the future parental-consent mechanism before marketing live social features to minors.

## Four-week rollout

### Week 0: controlled beta

- Invite 200 adult aspirants across five exam cohorts and at least eight states.
- Watch 20 first sessions live or by screen recording. Fix any point where a player cannot reach question one in 30 seconds.
- Exit gate: at least 60% reach question one, 45% finish a run, crash-free sessions exceed 99%, and fewer than 1% of served questions are reported.

### Week 1: exam communities

- Publish one daily challenge link for UPSC, TNPSC, SSC, RRB and banking at a consistent time.
- Recruit 20 small educators or Telegram/WhatsApp admins. Give each a Creator Board link; report their activated players and seven-day return rate, not clicks.
- Turn the strongest wrong-answer explanation from each day into a short vertical video with the run link as the only CTA.
- Target: 1,000 activated players and 30% day-one return.

### Week 2: campus and coaching leagues

- Enrol 25 coaching batches or colleges into named Group boards.
- Run a Sunday All-India Mock with a fixed start time and a shareable, server-scored result.
- Give winning groups recognition and digital badges, not cash prizes.
- Target: 35% of new players arrive through a group/creator link; 20% invite at least one peer.

### Week 3–4: repeat what retains

- Rank acquisition sources by activated players, completed first runs and D7—not impressions.
- Double down on the best two exam/source combinations; stop channels below half the median activation rate.
- Publish state and group stories only where the board has enough real players to be meaningful.
- Target: first-question median under 30 seconds, first-run completion above 50%, D7 above 15%, and question reports resolved within 24 hours.

## Weekly product loop

1. Monday: review KPI queries, reported questions and device failures.
2. Tuesday: fix the largest activation or trust issue.
3. Wednesday: ship five new verified challenge sets.
4. Thursday: give creators their board links and ready-to-post assets.
5. Sunday: run the All-India Mock, publish genuine ranks, and invite players into next week’s group race.

Never advertise a simulated rank, “official” answer, or national player count. Ranks come only from server-scored events; PYQ labels come only from `pyq_verified_clean` rows that meet the verified-key filter.

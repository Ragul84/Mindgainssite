// Cut-Off Run runtime config. Loaded by index.html before the game script.
// Leave a value empty to turn that feature off. With everything empty, the game uses its built-in question bank.
// The anon key is public by design. Row Level Security in supabase/schema.sql protects the data.
window.CUTOFF_CONFIG = {
  supabase: {
    url: '',            // e.g. 'https://YOUR-PROJECT.supabase.co'
    anonKey: '',        // Supabase anon (public) key. NEVER put the service_role key here.
    table: 'cor_quiz_feed',      // view that maps your quiz + PYQ tables to the game's row format
    progressTable: 'cor_progress',
    leagueTable: 'cor_league'
  },
  questionsEndpoint: '', // optional alternative to Supabase: GET -> [{question, options[], answer_index, subject, ...}] (e.g. Redis-backed API)
  analyticsEndpoint: '', // optional: POST {events:[...]} (use a Supabase Edge Function, see HANDOFF)
  tuningEndpoint: '',    // optional: GET JSON that overrides game tuning (speed, cut-off, read time)
  leagueEndpoint: '',    // optional: replaces the Supabase league table calls
  saveEndpoint: '',       // optional: replaces the Supabase progress table calls
  gameApi: '/api/game'  // mindgains.ai Worker
};

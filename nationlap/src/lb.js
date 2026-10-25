// Daily XP leaderboard — same Supabase project/table as the other RTW build, separate heat_id
// so scores don't mix with the canvas/rtw3 games' distance-based scores.
const LB_URL = 'https://yuntwerxahgmaoduxvqc.supabase.co/rest/v1/nationlap_scores';
const LB_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bnR3ZXJ4YWhnbWFvZHV4dnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTk4OTMsImV4cCI6MjA3MTM3NTg5M30.1mFUH9yp55uxN8n9tyRHLFbve36_kpaJs41nPU85S74';
const HEAT_ID = 'turbo-kart-rally';

// Set by account.js once a Supabase session is known. When present, the board uses the real
// account identity, so a player's scores follow them between devices instead of being tied to
// a random id in one browser's storage.
let accountIdentity = null;
export function setAccountIdentity(v) { accountIdentity = v && v.id ? v : null; }

export function getPlayerId() {
  if (accountIdentity) return accountIdentity.id;
  let id = null;
  try { id = localStorage.getItem('nl_player_id'); } catch (e) { /* storage blocked */ }
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()) + Math.random();
    try { localStorage.setItem('nl_player_id', id); } catch (e) { /* storage blocked */ }
  }
  return id;
}

/**
 * The name shown on the board is the racer profile's name — the one the player actually chose
 * and sees on their own kart. Before this it was a throwaway "Racer4821", so the board was a
 * list of strangers with no connection to anyone's identity in-game.
 * Falls back to the old generated handle only when no profile has been set up yet.
 */
export function getPlayerName() {
  if (accountIdentity && accountIdentity.name) return String(accountIdentity.name).slice(0, 24);
  try {
    const p = JSON.parse(localStorage.getItem('tkr_player_profile') || 'null');
    if (p && p.name) return String(p.name).slice(0, 12);
  } catch (e) { /* fall through to the generated handle */ }
  let n = null;
  try { n = localStorage.getItem('nl_player_name'); } catch (e) { /* storage blocked */ }
  if (!n) {
    n = 'Racer' + Math.floor(1000 + Math.random() * 9000);
    try { localStorage.setItem('nl_player_name', n); } catch (e) { /* storage blocked */ }
  }
  return n;
}

export function createLeaderboard() {
  const LB_DATE = new Date().toISOString().slice(0, 10);
  let lastRows = [];
  let streak = 0;

  function submitScore(xp) {
    fetch(LB_URL, {
      method: 'POST',
      headers: {
        apikey: LB_KEY,
        Authorization: 'Bearer ' + LB_KEY,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        player_id: getPlayerId(),
        player_name: getPlayerName(),
        heat_id: HEAT_ID,
        date_key: LB_DATE,
        score: Math.round(xp || 0),
        streak,
      }),
    }).then(refresh).catch((err) => console.warn('[TKR] LB submit failed:', err));
  }

  function refresh() {
    // player_id comes back too so the board can mark which row is you — matching on name alone
    // would highlight the wrong row whenever two players pick the same name.
    const qs = 'heat_id=eq.' + HEAT_ID + '&date_key=eq.' + LB_DATE + '&order=score.desc&limit=25&select=player_id,player_name,score';
    return fetch(LB_URL + '?' + qs, { headers: { apikey: LB_KEY, Authorization: 'Bearer ' + LB_KEY } })
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((rows) => { lastRows = Array.isArray(rows) ? rows : []; return lastRows; })
      .catch((err) => { console.warn('[TKR] LB fetch failed:', err); return lastRows; });
  }

  /**
   * Your place on today's board, even when you're nowhere near the top 25 — asking the server
   * how many scores beat yours is one cheap counted request, rather than pulling the whole
   * table down to count locally.
   */
  function myRank(myScore) {
    const qs = 'heat_id=eq.' + HEAT_ID + '&date_key=eq.' + LB_DATE + '&score=gt.' + Math.round(myScore || 0) + '&select=player_id';
    return fetch(LB_URL + '?' + qs, {
      headers: { apikey: LB_KEY, Authorization: 'Bearer ' + LB_KEY, Prefer: 'count=exact', Range: '0-0' },
    }).then((r) => {
      const cr = r.headers.get('content-range') || '';
      const total = Number(cr.split('/')[1]);
      return Number.isFinite(total) ? total + 1 : null;
    }).catch(() => null);
  }

  refresh();
  setInterval(refresh, 20000);

  return {
    submitScore,
    refresh,
    myRank,
    getRows: () => lastRows,
    getMyId: getPlayerId,
    setStreak: (s) => { streak = s; },
    // exposed on the instance as well as the module, since main.js only holds the instance
    setAccountIdentity,
  };
}

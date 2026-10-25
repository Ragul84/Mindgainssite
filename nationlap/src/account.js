// Account bridge: signs NationLap into the same Supabase session the rest of mindgains.ai uses,
// and syncs progress so XP, mastery and spaced-review follow a player between devices.
//
// Everything degrades to exactly the old behaviour when signed out or offline: the game keeps
// running entirely on localStorage. Nothing here is allowed to block play.
//
// The shared client lives at /assets/auth.js on the site. The game is loaded from /nationlap/,
// so it is the same origin and the same session — signing in on the homepage signs you into
// the game with no second login.

const PROJECT = 'https://yuntwerxahgmaoduxvqc.supabase.co';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bnR3ZXJ4YWhnbWFvZHV4dnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTk4OTMsImV4cCI6MjA3MTM3NTg5M30.1mFUH9yp55uxN8n9tyRHLFbve36_kpaJs41nPU85S74';
const TABLE = 'nationlap_progress';
const SDK = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

let client = null;
let user = null;
let ready = null;
const listeners = [];

function emit() {
  for (const fn of listeners) { try { fn(user); } catch (e) { console.warn('[account]', e); } }
}

/** Resolves to the signed-in user, or null. Never rejects — the game must start regardless. */
export function init() {
  if (ready) return ready;
  ready = (async () => {
    try {
      const { createClient } = await import(/* @vite-ignore */ SDK);
      client = createClient(PROJECT, ANON, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      });
      client.auth.onAuthStateChange((_e, session) => { user = session?.user || null; emit(); });
      const { data } = await client.auth.getSession();
      user = data?.session?.user || null;
      emit();
    } catch (e) {
      console.warn('[account] auth unavailable, staying local', e);
      client = null; user = null;
    }
    return user;
  })();
  return ready;
}

export function currentUser() { return user; }
/** The current session's access token, for calling edge functions as this user. */
export async function accessToken() {
  if (!client || !user) return null;
  try { const { data } = await client.auth.getSession(); return data?.session?.access_token || null; } catch { return null; }
}
export function isSignedIn() { return !!user; }
export function onChange(fn) { if (typeof fn === 'function') { listeners.push(fn); fn(user); } }

/** Display name for the board: their Google name, falling back to the email handle. */
export function accountName() {
  if (!user) return null;
  const m = user.user_metadata || {};
  return (m.full_name || m.name || (user.email || '').split('@')[0] || 'Learner').slice(0, 24);
}

/** Send the player to the site's sign-in, returning here afterwards. */
export function signIn() {
  if (!client) return;
  try { sessionStorage.setItem('mg_return_to', location.pathname); } catch (e) {}
  client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: location.origin + '/auth/', queryParams: { prompt: 'select_account' } },
  }).catch((e) => console.warn('[account] signIn', e));
}

export function signOut() {
  if (!client) return Promise.resolve();
  return client.auth.signOut().catch(() => {});
}

// ---------------------------------------------------------------------------------------------
// Progress sync
// ---------------------------------------------------------------------------------------------

/** The server's row for this player, or null when signed out / unreachable / not yet created. */
export async function pull() {
  if (!client || !user) return null;
  try {
    const { data, error } = await client
      .from(TABLE).select('xp, zones').eq('user_id', user.id).maybeSingle();
    if (error) { console.warn('[account] pull', error.message); return null; }
    return data || null;
  } catch (e) { console.warn('[account] pull', e); return null; }
}

/**
 * Write the local state up. Upsert on user_id, so the first save creates the row.
 * Fire-and-forget by design: a failed sync must never interrupt a race.
 */
export async function push({ xp, zones }) {
  if (!client || !user) return false;
  try {
    const { error } = await client.from(TABLE).upsert({
      user_id: user.id,
      xp: Math.max(0, Math.round(xp || 0)),
      zones: zones || {},
    }, { onConflict: 'user_id' });
    if (error) { console.warn('[account] push', error.message); return false; }
    return true;
  } catch (e) { console.warn('[account] push', e); return false; }
}

// ---------------------------------------------------------------------------------------------
// Trusted daily board
//
// The old board writes to nationlap_scores, which four games share with the anon key — anyone
// can POST any score for any name. These reads/writes go to nationlap_board instead, where RLS
// only lets you write your own row, so a position on it has to be earned.
// ---------------------------------------------------------------------------------------------
const BOARD = 'nationlap_board';
const today = () => new Date().toISOString().slice(0, 10);

/** Top of today's board. Returns [] when signed out — an untrusted board isn't worth showing. */
export async function boardTop(limit = 25) {
  if (!client || !user) return [];
  try {
    const { data, error } = await client
      .from(BOARD).select('user_id, player_name, score')
      .eq('date_key', today()).order('score', { ascending: false }).limit(limit);
    if (error) { console.warn('[account] boardTop', error.message); return []; }
    return data || [];
  } catch (e) { console.warn('[account] boardTop', e); return []; }
}

/** How many players are ahead of `score` today, +1 — i.e. your place. */
export async function boardRank(score) {
  if (!client || !user) return null;
  try {
    const { count, error } = await client
      .from(BOARD).select('user_id', { count: 'exact', head: true })
      .eq('date_key', today()).gt('score', Math.round(score || 0));
    if (error) return null;
    return (count || 0) + 1;
  } catch (e) { return null; }
}

/** Put today's score up. Only ever writes this account's own row. */
export async function boardSubmit(score, streak) {
  if (!client || !user) return false;
  try {
    const { error } = await client.from(BOARD).upsert({
      user_id: user.id,
      date_key: today(),
      player_name: accountName() || 'Learner',
      score: Math.max(0, Math.round(score || 0)),
      streak: Math.max(0, Math.round(streak || 0)),
    }, { onConflict: 'user_id,date_key' });
    if (error) { console.warn('[account] boardSubmit', error.message); return false; }
    return true;
  } catch (e) { console.warn('[account] boardSubmit', e); return false; }
}

// ---------------------------------------------------------------------------------------------
// Ghost laps
//
// One row per player per topic, holding their fastest lap. Reads are open to any signed-in
// player (you need other people's laps to race them); writes are RLS-limited to your own row.
// ---------------------------------------------------------------------------------------------
const GHOSTS = 'nationlap_ghosts';

/** The fastest lap anyone has set on this topic, or null. */
export async function bestGhost(zoneId) {
  if (!client || !user) return null;
  try {
    let q = client.from(GHOSTS).select('user_id, player_name, time_ms, recording')
      .order('time_ms', { ascending: true }).limit(1);
    q = zoneId ? q.eq('zone_id', zoneId) : q.is('zone_id', null);
    const { data, error } = await q;
    if (error || !data?.length) return null;
    const row = data[0];
    // racing your own ghost is what the local personal best is for; from the server you want
    // someone else's lap, so skip your own row and let the caller fall back
    if (row.user_id === user.id) return null;
    return row;
  } catch (e) { return null; }
}

/** Upload a lap, but only when it beats what this account already has for the topic. */
export async function submitGhost(zoneId, recording) {
  if (!client || !user || !recording?.ms) return false;
  try {
    const { data: prev } = await client.from(GHOSTS).select('time_ms')
      .eq('user_id', user.id).eq('zone_id', zoneId ?? null).maybeSingle();
    if (prev && prev.time_ms <= recording.ms) return false;
    const { error } = await client.from(GHOSTS).upsert({
      user_id: user.id,
      zone_id: zoneId ?? null,
      player_name: accountName() || 'Learner',
      time_ms: Math.round(recording.ms),
      recording,
    }, { onConflict: 'user_id,zone_id' });
    if (error) { console.warn('[account] submitGhost', error.message); return false; }
    return true;
  } catch (e) { console.warn('[account] submitGhost', e); return false; }
}

/**
 * Merge the server's row into what's on this device, keeping the better of the two per field.
 *
 * Signing in on a second device must not wipe progress made on the first, and a fresh device
 * must not overwrite the account with its empty state. So: XP takes the higher number, and each
 * zone takes whichever side is further along (more correct answers, then a later review stage).
 * Wrong answers take the higher count too — that record shouldn't be erasable by switching phone.
 */
export function merge(local, remote) {
  if (!remote) return local;
  const out = {
    xp: Math.max(local.xp || 0, remote.xp || 0),
    zones: { ...(local.zones || {}) },
  };
  const rz = remote.zones || {};
  for (const id of Object.keys(rz)) {
    const a = out.zones[id];
    const b = rz[id];
    if (!a) { out.zones[id] = b; continue; }
    out.zones[id] = {
      correct: Math.max(a.correct || 0, b.correct || 0),
      wrong: Math.max(a.wrong || 0, b.wrong || 0),
      stage: Math.max(a.stage || 0, b.stage || 0),
      // the later date wins: whichever device reviewed most recently pushed it furthest out
      reviewAt: Math.max(a.reviewAt || 0, b.reviewAt || 0),
    };
  }
  return out;
}

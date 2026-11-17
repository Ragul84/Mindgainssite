// A signed-in mindgains.ai user: check the Supabase access token, return the account id (cached briefly).
export const SB = 'https://yuntwerxahgmaoduxvqc.supabase.co';
export const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bnR3ZXJ4YWhnbWFvZHV4dnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTk4OTMsImV4cCI6MjA3MTM3NTg5M30.1mFUH9yp55uxN8n9tyRHLFbve36_kpaJs41nPU85S74';
const cache = new Map();
export async function verifyUser(token) {
  if (!token || token.length > 4000) return null;
  const c = cache.get(token); if (c && c.exp > Date.now()) return c.id;
  try {
    const r = await fetch(SB + '/auth/v1/user', { headers: { apikey: SB_ANON, Authorization: 'Bearer ' + token } });
    if (!r.ok) return null;
    const u = await r.json(), id = (u && u.id) || null;
    if (id) { if (cache.size > 500) cache.clear(); cache.set(token, { id, exp: Date.now() + 5 * 60e3 }); }
    return id;
  } catch { return null; }
}
export function bearer(request) { const h = request.headers.get('authorization') || ''; return h.startsWith('Bearer ') ? h.slice(7) : ''; }

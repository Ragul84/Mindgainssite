// Two layers: Cloudflare's rate-limit binding (shared across the edge, but lenient and
// eventually consistent) and a per-isolate window that catches a burst from one client,
// which almost always lands on the same isolate.
const windows = new Map();
export function localLimited(key, max) {
  const now = Date.now();
  let w = windows.get(key);
  if (!w || now - w.t > 60000) { w = { t: now, n: 0 }; windows.set(key, w); }
  w.n++;
  if (windows.size > 5000) windows.clear();
  return w.n > max;
}
export async function limited(binding, key, max) {
  if (localLimited(key, max)) return true;
  if (!binding) return false;
  try { const { success } = await binding.limit({ key }); return !success; } catch { return false; }
}

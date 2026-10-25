// Browser push for the 5am "today's facts are ready" alert. No app, no phone number.
// Usage: import { pushState, enablePush } from '/assets/push.js';
const VAPID = 'BEy6D1MvxBYXQHqX_gZcuJh-HKHHoC3lMbL7Po-luNg0Mfi05ETx0HqbLN7vM_Jc_gYNTpBYjeBjQOPCKO9S2cU';
const FN = 'https://yuntwerxahgmaoduxvqc.supabase.co/functions/v1/ca-push';

const b64ToBytes = (s) => {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const raw = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};

/** 'unsupported' | 'denied' | 'on' | 'off' (iPhone outside a home-screen app is 'unsupported'). */
export async function pushState() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  try {
    const reg = await navigator.serviceWorker.getRegistration('/');
    const sub = reg && await reg.pushManager.getSubscription();
    return sub ? 'on' : 'off';
  } catch { return 'off'; }
}

/** Ask permission, subscribe, and register with the server. Resolves to the new pushState. */
export async function enablePush(accessToken) {
  if ((await pushState()) === 'unsupported') return 'unsupported';
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return perm === 'denied' ? 'denied' : 'off';
  const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  await navigator.serviceWorker.ready;
  const sub = (await reg.pushManager.getSubscription())
    || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(VAPID) });
  const res = await fetch(FN, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(accessToken ? { authorization: 'Bearer ' + accessToken } : {}) },
    body: JSON.stringify({ subscription: sub.toJSON() }),
  });
  return res.ok ? 'on' : 'off';
}

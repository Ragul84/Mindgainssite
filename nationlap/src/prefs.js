// Small per-device preferences: the state you race for (Most Informed State) and Family mode.
// Kept apart from the racer profile, whose saver keeps only the fields it knows.

export const STATES = {
  AN: 'Andaman and Nicobar', AP: 'Andhra Pradesh', AR: 'Arunachal Pradesh', AS: 'Assam', BR: 'Bihar', CH: 'Chandigarh',
  CT: 'Chhattisgarh', DH: 'Dadra, Nagar Haveli, Daman and Diu', DL: 'Delhi', GA: 'Goa', GJ: 'Gujarat', HR: 'Haryana',
  HP: 'Himachal Pradesh', JK: 'Jammu and Kashmir', JH: 'Jharkhand', KA: 'Karnataka', KL: 'Kerala', LA: 'Ladakh',
  LD: 'Lakshadweep', MP: 'Madhya Pradesh', MH: 'Maharashtra', MN: 'Manipur', ML: 'Meghalaya', MZ: 'Mizoram',
  NL: 'Nagaland', OR: 'Odisha', PY: 'Puducherry', PB: 'Punjab', RJ: 'Rajasthan', SK: 'Sikkim', TN: 'Tamil Nadu',
  TG: 'Telangana', TR: 'Tripura', UP: 'Uttar Pradesh', UK: 'Uttarakhand', WB: 'West Bengal',
};
const get = (k) => { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } };
const set = (k, v) => { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch (e) { /* storage unavailable */ } };

export const myState = () => (STATES[get('nl_state')] ? get('nl_state') : '');
export const setMyState = (c) => set('nl_state', STATES[c] ? c : '');

/** Family mode: gentler rivals and bigger reading text, so a parent and a child can race together. */
export const isFamily = () => get('nl_family') === '1';
export function setFamily(on) {
  set('nl_family', on ? '1' : '');
  document.body.classList.toggle('family-mode', !!on);
}
export function applyFamily() { document.body.classList.toggle('family-mode', isFamily()); }

/** A random id for this device, for one-per-day counts. Not tied to the person. */
export function deviceId() {
  let d = get('nl_dev');
  if (!d) { d = Math.random().toString(36).slice(2, 12) + Date.now().toString(36); set('nl_dev', d); }
  return d;
}

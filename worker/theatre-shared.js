// Shared by the TheatreHall Durable Object (./theatre.js) and its engagement hooks (./theatre-hooks.js).
export const PRO_SEATS = new Set(); for (const r of 'EFG') for (let n = 7; n <= 12; n++) PRO_SEATS.add(r + n);
export const SEAT_RE = /^[A-L]([1-9]|1[0-8])$/;
export const clean = (s, n) => String(s || '').replace(/[<>]/g, '').trim().slice(0, n);

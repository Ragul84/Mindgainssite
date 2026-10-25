// The player races as themselves: a name, a face and a kart colour, saved locally.
// The 8 themed characters are no longer picked - they're the subject mentors and the rival
// aspirants on track. Stats are deliberately balanced (3/3/3/3) so the race is about the
// quiz, not about which card you tapped.
import { CHARACTERS } from './config.js';

const KEY = 'tkr_player_profile';

// Faces reuse the existing character portrait/model art (skin tone + headwear), so the
// player's kart driver and HUD chip are drawn by the same code as everyone else's.
export const AVATARS = [
  { skin: 0xffcc99, hat: 'cap' },
  { skin: 0xf1c08b, hat: 'cap' },
  { skin: 0xc68a5a, hat: 'cap' },
  { skin: 0x8d5a3b, hat: 'cap' },
  { skin: 0xffe0bd, hat: 'bow' },
  { skin: 0xc68a5a, hat: 'bow' },
];
export const KART_COLORS = [0xe53935, 0xff8a1f, 0xfdd835, 0x43a047, 0x00acc1, 0x1e88e5, 0x8e24aa, 0xf06292];
export const NAME_MAX = 12;
const DEFAULT = { name: 'You', avatar: 0, color: 5 };

/** Names end up in innerHTML (results table), so keep them to plain text. */
export function cleanName(raw) {
  const s = String(raw ?? '').replace(/[<>&"'`]/g, '').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX);
  return s || DEFAULT.name;
}

export function hasProfile() {
  try { return !!localStorage.getItem(KEY); } catch (e) { return false; }
}
export function loadProfile() {
  let p = {};
  try { p = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { p = {}; }
  return {
    name: cleanName(p.name ?? DEFAULT.name),
    avatar: Number.isInteger(p.avatar) && p.avatar >= 0 && p.avatar < AVATARS.length ? p.avatar : DEFAULT.avatar,
    color: Number.isInteger(p.color) && p.color >= 0 && p.color < KART_COLORS.length ? p.color : DEFAULT.color,
  };
}
export function saveProfile(p) {
  const clean = { name: cleanName(p.name), avatar: p.avatar | 0, color: p.color | 0 };
  try { localStorage.setItem(KEY, JSON.stringify(clean)); } catch (e) { /* storage unavailable */ }
  return clean;
}

/** A character-shaped object for the player's kart, HUD chip and results row. */
export function playerCharacter(p = loadProfile()) {
  const face = AVATARS[p.avatar] || AVATARS[0];
  const color = KART_COLORS[p.color] ?? KART_COLORS[0];
  return {
    // id carries face + colour so every portrait cache (models, HUD, menu) redraws after an edit
    id: `you-${p.avatar}-${p.color}`,
    name: cleanName(p.name),
    subject: null,
    isYou: true,
    color,
    accent: color === 0xfdd835 ? 0x1e88e5 : 0xffffff,
    skin: face.skin,
    hat: face.hat,
    stats: { speed: 3, accel: 3, handling: 3, weight: 3 },
  };
}

export function mentorFor(subject) {
  return (subject && CHARACTERS.find((c) => c.subject === subject)) || null;
}

// One friendly line per subject mentor, shown on the Ready card.
export const MENTOR_LINES = {
  'Polity': "The Constitution is our rulebook — read it like a race map and you'll never take a wrong turn.",
  'History': "Every era has a story. Hold the timeline in your head and the answers line up like a grid.",
  'Geography': "Rivers, ranges, monsoons — picture the map and the questions answer themselves.",
  'Economy': "Follow the money: budgets, banks and the RBI. Keep it simple and you'll keep up.",
  'Quant': "Numbers love a shortcut. Spot the pattern, trust the method, then floor it.",
  'Science': "Stay curious! Every question is just an experiment you already know the result of.",
  'Reasoning': "Slow is smooth, smooth is fast. Find the rule first — then race through the rest.",
  'Current Affairs': "Headlines move fast, so do we. Keep your eyes up and your facts fresh.",
};
export function mentorLine(subject) {
  return MENTOR_LINES[subject] || "Read the boards, answer sharp, and the road opens up. You've got this!";
}

/**
 * The 7 rivals beside the player: the current subject's mentor always races (if there is one),
 * the rest are drawn at random, so one character sits each race out and the grid stays at 8.
 */
export function rivalRoster(subject, count = CHARACTERS.length - 1) {
  const mentor = mentorFor(subject);
  const pool = CHARACTERS.filter((c) => c !== mentor);
  for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const out = mentor ? [mentor, ...pool] : pool;
  return out.slice(0, count);
}

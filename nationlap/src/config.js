// Shared tuning + roster. Every module reads from here; do not duplicate these values.

export const GAME_TITLE = 'NationLap';

export const RACE = {
  // One lap is the default because the circuit is ~9.5km — long enough to space every topic's
  // billboards out readably, which means a single lap is already a few minutes of driving.
  laps: 1,
  racers: 8,
  countdownSeconds: 3,
};

// World scale: 1 unit = 1 meter. Y is up. Track lies roughly in the XZ plane.
export const PHYSICS = {
  gravity: 38,
  kartRadius: 1.3,          // collision radius (kart vs kart / wall / items)
  maxSpeed: 38,             // base top speed on road (units/s) before stat modifiers
  reverseMaxSpeed: 12,
  accel: 22,
  brakeDecel: 45,
  coastDecel: 8,
  offroadMaxSpeedFactor: 0.45,
  boostSpeedBonus: 16,      // added to max speed while boosting
  miniTurboTimes: [0.55, 0.45, 0.5], // blue, orange, purple boost durations (s)
  driftChargeThresholds: [0.9, 1.9, 3.0], // seconds of drifting needed to reach each level
  mushroomBoostTime: 1.3,
  starTime: 7.5,
  spinOutTime: 1.1,
  tumbleTime: 1.6,
  lightningShrinkTime: 5,
};

// stats are 1..5. speed -> top speed, accel -> acceleration, handling -> turn rate/drift,
// weight -> bump resolution (heavier pushes lighter).
// Each racer is themed to an exam subject — subject shows in menus/HUD ("Priya · Polity").
export const CHARACTERS = [
  { id: 'priya',   name: 'Priya',   subject: 'Polity',          color: 0xe53935, accent: 0xffffff, skin: 0xffcc99, hat: 'cap',      stats: { speed: 3, accel: 3, handling: 3, weight: 3 } },
  { id: 'vetri',   name: 'Vetri',   subject: 'History',         color: 0x43a047, accent: 0xffffff, skin: 0xffcc99, hat: 'cap',      stats: { speed: 3, accel: 4, handling: 3, weight: 2 } },
  { id: 'divya',   name: 'Divya',   subject: 'Geography',       color: 0xf06292, accent: 0xfff176, skin: 0xffe0bd, hat: 'crown',    stats: { speed: 2, accel: 4, handling: 5, weight: 2 } },
  { id: 'karthik', name: 'Karthik', subject: 'Economy',         color: 0x1e88e5, accent: 0xffffff, skin: 0xffe0bd, hat: 'mushroom', stats: { speed: 2, accel: 5, handling: 4, weight: 1 } },
  { id: 'arjun',   name: 'Arjun',   subject: 'Quant',           color: 0x2e7d32, accent: 0xff8f00, skin: 0x9ccc65, hat: 'horns',    stats: { speed: 5, accel: 1, handling: 2, weight: 5 } },
  { id: 'meera',   name: 'Meera',   subject: 'Science',         color: 0xfdd835, accent: 0x6a1b9a, skin: 0xffcc99, hat: 'cap',      stats: { speed: 4, accel: 2, handling: 2, weight: 4 } },
  { id: 'rahul',   name: 'Rahul',   subject: 'Reasoning',       color: 0x00acc1, accent: 0xfff9c4, skin: 0xaed581, hat: 'shell',    stats: { speed: 3, accel: 3, handling: 4, weight: 2 } },
  { id: 'ananya',  name: 'Ananya',  subject: 'Current Affairs', color: 0x8e24aa, accent: 0xffeb3b, skin: 0xffe0bd, hat: 'bow',      stats: { speed: 2, accel: 4, handling: 4, weight: 1 } },
];

export const ITEMS = ['mushroom', 'triple_mushroom', 'banana', 'green_shell', 'red_shell', 'star', 'lightning', 'blue_shell'];

// Standard kart-racer points table, indexed by place-1 (1st..8th).
export const POINTS_TABLE = [15, 12, 10, 8, 6, 4, 2, 1];

// Cups group several heats (races) into one progression arc with a podium at the end.
// Today there's a single physical track, so a cup just runs it multiple times with rising
// difficulty — the data model is what matters: adding a real second track later is just
// adding a `track` field per heat and a new cup entry, no rework of the cup/points flow.
export const CUPS = [
  {
    id: 'upsc-sprint',
    name: 'Nation Cup',
    subjectFocus: 'Polity',
    heats: [
      { difficulty: 'easy', laps: 1 },
      { difficulty: 'normal', laps: 1 },
      { difficulty: 'hard', laps: 1 },
    ],
    unlock: null, // first cup, always available
  },
];

export const DIFFICULTY = {
  easy:   { aiSpeedFactor: 0.86, aiSkill: 0.55, rubberBand: 0.08 },
  normal: { aiSpeedFactor: 0.97, aiSkill: 0.84, rubberBand: 0.15 },
  hard:   { aiSpeedFactor: 1.02, aiSkill: 0.96, rubberBand: 0.2 },
};

export const KEYS = {
  accelerate: ['ArrowUp', 'KeyW'],
  brake: ['ArrowDown', 'KeyS'],
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  drift: ['Space', 'ShiftRight'],
  item: ['KeyE', 'ShiftLeft', 'KeyX'],
  lookBack: ['KeyC'],
  pause: ['Escape', 'KeyP'],
};

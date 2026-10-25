// Custom inline-SVG icon set — bold, flat, single-color silhouettes matching the game's chunky
// cartoon style, instead of relying on OS emoji fonts (which render inconsistently and read as
// generic/cheap). Icons are white silhouettes designed to sit on a colored circular badge.
const ICONS = {
  lock: `<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2.5" fill="#fff"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="16" r="1.8" fill="#3a3f55"/></svg>`,
  star: `<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.1 6.7.8-4.9 4.6 1.3 6.7L12 17.4 6 20.7l1.3-6.7-4.9-4.6 6.7-.8L12 2.5z" fill="#fff"/></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="#fff"/></svg>`,
  // marks the set-piece stop that closes a subject's region on the journey map
  trophy: `<svg viewBox="0 0 24 24" fill="#fff"><path d="M7 3h10v5.2a5 5 0 0 1-10 0V3z"/><path d="M7 4.6H4.6a.9.9 0 0 0-.9.9v1.2a3.4 3.4 0 0 0 3.4 3.4M17 4.6h2.4a.9.9 0 0 1 .9.9v1.2a3.4 3.4 0 0 1-3.4 3.4" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round"/><rect x="10.7" y="12.6" width="2.6" height="3.6"/><rect x="7.6" y="16" width="8.8" height="2.5" rx="0.7"/><rect x="6.3" y="18.9" width="11.4" height="2.6" rx="0.9"/></svg>`,
  // the player's own marker, standing on whichever stop is next
  kart: `<svg viewBox="0 0 24 24" fill="#fff"><path d="M4.6 14.2h14.8a1 1 0 0 0 1-1.2l-.5-2.3a1.6 1.6 0 0 0-1.2-1.2l-3-.6-1.7-2a1.7 1.7 0 0 0-1.3-.6H8.7a1.7 1.7 0 0 0-1.6 1.2L6.3 9.6l-2 .8A1.7 1.7 0 0 0 3.2 12v1.2a1 1 0 0 0 1 1z"/><circle cx="7.3" cy="16.4" r="2.6"/><circle cx="16.8" cy="16.4" r="2.6"/></svg>`,
  // subject icons
  Polity: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v17M7 20h10M6 6h12M6 6l-3 6a3 3 0 0 0 6 0L6 6zM18 6l-3 6a3 3 0 0 0 6 0l-3-6z"/></svg>`,
  History: `<svg viewBox="0 0 24 24" fill="#fff"><rect x="3.5" y="2.5" width="17" height="2.4" rx="0.5"/><rect x="3.5" y="19.1" width="17" height="2.4" rx="0.5"/><rect x="5.5" y="6" width="2.6" height="12"/><rect x="10.7" y="6" width="2.6" height="12"/><rect x="15.9" y="6" width="2.6" height="12"/></svg>`,
  Geography: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="3.8" ry="9"/><path d="M3.3 9.5h17.4M3.3 14.5h17.4"/></svg>`,
  Economy: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#fff"/><text x="12" y="16.8" font-size="12" font-weight="900" text-anchor="middle" fill="#2b2e42" font-family="Arial">₹</text></svg>`,
  Science: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round"><path d="M9.5 2.8h5M10.3 2.8v6.4l-5.8 9.3a1.4 1.4 0 0 0 1.2 2.2h12.6a1.4 1.4 0 0 0 1.2-2.2l-5.8-9.3V2.8"/><path d="M7.3 15.2h9.4"/></svg>`,
  Quant: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.3" stroke-linejoin="round" stroke-linecap="round"><rect x="4" y="3" width="16" height="18" rx="2.2"/><path d="M7.5 8h9" stroke-width="2.4"/><circle cx="8" cy="12.3" r="1.15" fill="#fff" stroke="none"/><circle cx="12" cy="12.3" r="1.15" fill="#fff" stroke="none"/><circle cx="16" cy="12.3" r="1.15" fill="#fff" stroke="none"/><circle cx="8" cy="16.3" r="1.15" fill="#fff" stroke="none"/><circle cx="12" cy="16.3" r="1.15" fill="#fff" stroke="none"/><circle cx="16" cy="16.3" r="1.15" fill="#fff" stroke="none"/></svg>`,
  Reasoning: `<svg viewBox="0 0 24 24" fill="#fff"><path d="M5 4h5.2a1 1 0 0 1 1 1v1.55a1.85 1.85 0 1 1 0 3.6V12a1 1 0 0 1-1 1H8.15a1.85 1.85 0 1 1-3.6 0H3.5a1 1 0 0 1-1-1V6.8a1.85 1.85 0 1 0 0-3.6V2a1 1 0 0 1 1-1H5z" transform="translate(1 1) scale(0.92)"/></svg>`,
  'Current Affairs': `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round"><rect x="3" y="5" width="13.5" height="14" rx="1.2"/><path d="M16.5 8.2h2.8a1.2 1.2 0 0 1 1.2 1.2v8.1a1.7 1.7 0 0 1-1.7 1.7H6.5"/><path d="M6 9h7.5M6 12h7.5M6 15h4.5"/></svg>`,
};

export function iconSvg(name) {
  return ICONS[name] || ICONS.target;
}

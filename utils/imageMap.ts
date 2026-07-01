/**
 * imageMap.ts
 *
 * Maps lesson header_image_url strings (stored in the DB) to local
 * bundled image assets. Metro requires all `require()` calls to be
 * static at bundle time, so they must ALL be listed here.
 *
 * Usage:
 *   const imageSource = getImageForLesson(data.header_image_url);
 *   <Image source={imageSource} />
 */

// ─── Local asset registry ───────────────────────────────────────────────────
// Add new mappings here whenever you add a new header image to assets/images/.

const IMAGE_MAP: Record<string, any> = {
  // Heist / game assets
  'vault_bg':       require('@/assets/images/heist/vault_bg.png'),
  'store_bg':       require('@/assets/images/heist/store_bg.png'),
  'gem_pile':       require('@/assets/images/heist/gem_pile.png'),
  'mg_tokens':      require('@/assets/images/heist/mg_tokens.png'),
  'powerup_pack':   require('@/assets/images/heist/powerup_pack.png'),
  'knowledgeheist': require('@/assets/images/knowledgeheist.png'),

  // Generic / mascot assets used as lesson headers
  'mascot_hero':    require('@/assets/mascot/mascot_hero.png'),
  'mascot_read':    require('@/assets/mascot/read.png'),
  'mascot_think':   require('@/assets/mascot/think.png'),
  'head':           require('@/assets/images/head.png'),
};

// ─── Fallback ────────────────────────────────────────────────────────────────
// Used when the DB returns a key that isn't mapped above, or null/undefined.
const FALLBACK_IMAGE = require('@/assets/mascot/mascot_hero.png');

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Resolves a DB `header_image_url` string to a local require() asset.
 * Performs key matching against:
 *   1. Exact key match   e.g. "vault_bg"
 *   2. Partial filename  e.g. "images/vault_bg.png" → matched via substring
 * Falls back to FALLBACK_IMAGE if no match is found.
 */
export function getImageForLesson(key?: string | null): any {
  if (!key) return FALLBACK_IMAGE;

  // 1. Direct key lookup (fast path)
  if (IMAGE_MAP[key]) return IMAGE_MAP[key];

  // 2. Partial match — DB stores full paths like "public/images/vault_bg.png"
  for (const mapKey of Object.keys(IMAGE_MAP)) {
    if (key.includes(mapKey)) return IMAGE_MAP[mapKey];
  }

  // 3. Nothing matched — return fallback
  return FALLBACK_IMAGE;
}

export default IMAGE_MAP;

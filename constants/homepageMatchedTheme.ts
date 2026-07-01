// 🎨 Homepage-Matched Premium Theme
// Perfect colors for Learn/Battle tabs that harmonize with homepage gradient
// Background: ['#021f58ff', '#021c50ff', '#06296eff']

export const homepageMatchedTheme = {
  // 🏠 Homepage-Matched Card Colors
  cards: {
    // Premium glass cards that pop against homepage gradient
    primary: {
      background: ['rgba(77, 201, 255, 0.15)', 'rgba(78, 205, 196, 0.12)'], // Turquoise glass
      border: 'rgba(78, 205, 196, 0.35)',
      shadow: 'rgba(78, 205, 196, 0.4)',
    },
    
    // Secondary cards with blue accent
    secondary: {
      background: ['rgba(29, 78, 216, 0.18)', 'rgba(8, 40, 99, 0.15)'], // Deep blue glass
      border: 'rgba(77, 201, 255, 0.25)',
      shadow: 'rgba(77, 201, 255, 0.3)',
    },
    
    // Premium elevated cards
    elevated: {
      background: ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.08)'], // White glass
      border: 'rgba(255, 255, 255, 0.18)',
      shadow: 'rgba(255, 255, 255, 0.15)',
    },
    
    // Action cards with energy
    action: {
      background: ['rgba(26, 149, 253, 0.16)', 'rgba(35, 48, 133, 0.12)'], // Electric blue
      border: 'rgba(26, 149, 253, 0.3)',
      shadow: 'rgba(26, 149, 253, 0.25)',
    },
  },

  // 🎯 Premium Button Styles
  buttons: {
    primary: {
      background: ['#4ECDC4', '#4dc9ff'], // Homepage turquoise to blue
      text: '#041024',
      shadow: 'rgba(78, 205, 196, 0.4)',
    },
    
    secondary: {
      background: ['rgba(77, 201, 255, 0.15)', 'rgba(78, 205, 196, 0.1)'],
      border: 'rgba(78, 205, 196, 0.35)',
      text: '#4ECDC4',
      shadow: 'rgba(78, 205, 196, 0.2)',
    },
    
    accent: {
      background: ['rgba(57, 48, 173, 0.85)', 'rgba(24, 22, 133, 0.75)'], // Homepage purple
      text: '#ffffff',
      shadow: 'rgba(57, 48, 173, 0.4)',
    },
  },

  // ✨ Interactive States
  interactive: {
    hover: 'rgba(78, 205, 196, 0.08)',
    pressed: 'rgba(78, 205, 196, 0.12)',
    focus: 'rgba(78, 205, 196, 0.2)',
    disabled: 'rgba(255, 255, 255, 0.05)',
  },

  // 📝 Text Colors (Homepage-matched)
  text: {
    primary: '#ffffff',
    secondary: 'rgba(203, 213, 255, 0.88)', // Homepage subtitle color
    tertiary: 'rgba(203, 213, 255, 0.72)',  // Homepage muted color
    accent: '#4ECDC4',                       // Homepage accent
    onCard: '#ffffff',
    onAccent: '#041024',
  },

  // 🎭 Effects & Overlays
  effects: {
    glass: 'rgba(255, 255, 255, 0.08)',
    shimmer: 'rgba(78, 205, 196, 0.15)',
    glow: 'rgba(78, 205, 196, 0.25)',
    backdrop: 'rgba(2, 31, 88, 0.85)',
  },

  // 🌈 Status Colors (Homepage-harmonized)
  status: {
    success: '#4ECDC4',     // Homepage turquoise
    warning: '#4dc9ff',     // Homepage blue
    error: '#ff6b6b',       // From homepage flame color
    info: '#4d8bffff',      // Homepage progress blue
  },
};

// 🏗️ Pre-built Component Styles
export const homepageMatchedComponents = {
  // Mode cards for Learn page
  modeCard: {
    background: homepageMatchedTheme.cards.primary.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: homepageMatchedTheme.cards.primary.border,
    padding: 20,
    shadowColor: homepageMatchedTheme.cards.primary.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },

  // Tool cards for Learn page
  toolCard: {
    background: homepageMatchedTheme.cards.secondary.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: homepageMatchedTheme.cards.secondary.border,
    padding: 16,
    shadowColor: homepageMatchedTheme.cards.secondary.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },

  // Battle stats cards
  battleCard: {
    background: homepageMatchedTheme.cards.elevated.background,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: homepageMatchedTheme.cards.elevated.border,
    padding: 18,
    shadowColor: homepageMatchedTheme.cards.elevated.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  // Action buttons
  actionButton: {
    background: homepageMatchedTheme.buttons.primary.background,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: homepageMatchedTheme.buttons.primary.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
};

export default homepageMatchedTheme;
// 🎨 MINDGAINS UNIFIED BRAND DESIGN SYSTEM
// Professional, consistent colors and components across the entire app

export const brandTheme = {
  // 🎯 CORE BRAND COLORS - Based on MindGains Mascot Turquoise (Like Duolingo's Green)
  brand: {
    signature: '#00D4C7',    // 🐺 MindGains Turquoise - THE signature brand color
    primary: '#22D3EE',      // Electric cyan - primary accents  
    secondary: '#38BDF8',    // Neon blue - secondary actions
    accent: '#7C3AED',       // Cyber purple - premium highlights
    mascot: {
      turquoise: '#00D4C7',  // Main mascot turquoise
      lightTeal: '#4ADED9',  // Light mascot teal
      deepPurple: '#5B2C87', // Mascot purple accents
      navyBlue: '#1E3A8A',   // Mascot navy details
    },
    gradient: {
      mascot: ['#00D4C7', '#4ADED9'],      // 🐺 Signature mascot gradient
      primary: ['#22D3EE', '#38BDF8'],     // Cyan to neon blue
      secondary: ['#38BDF8', '#7C3AED'],   // Blue to purple
      success: ['#00D4C7', '#22C55E'],     // Turquoise to green (India success)
      premium: ['#FACC15', '#F97316'],     // Hyper gold gradient
      dark: ['#020817', '#041024'],        // Deep space background
      patriotic: ['#FF9933', '#FFFFFF', '#138808'], // India flag colors
    }
  },

  // 🌟 CONSISTENT BACKGROUNDS
  backgrounds: {
    primary: '#020817',      // Main app background
    secondary: '#041024',    // Secondary surfaces
    card: '#0B1F3E',         // Neon card panels
    modal: 'rgba(2, 8, 23, 0.94)',
    glass: 'rgba(10, 37, 74, 0.68)',
    overlay: 'rgba(3, 7, 15, 0.82)',
  },

  // 📝 UNIFIED TEXT COLORS
  text: {
    primary: '#F8FAFC',      // Main headings
    secondary: '#C7D2FE',    // Body text, descriptions
    muted: '#94A3B8',        // Supporting text
    inverse: '#020817',      // Text on light surfaces
    accent: '#22D3EE',       // Branded text, links
  },

  // 🎪 SEMANTIC COLORS
  semantic: {
    success: '#22C55E',     // Correct answers
    warning: '#FACC15',     // Warnings
    error: '#F43F5E',       // Errors
    info: '#38BDF8',        // Information
  },

  // 🏆 GAMIFICATION COLORS
  gamification: {
    gold: '#FACC15',        // Premium
    silver: '#CBD5F5',      // Advanced
    bronze: '#F59E0B',      // Basic
    streak: '#F43F5E',      // Streak fire
    xp: '#22C55E',          // Experience points
    level: '#38BDF8',       // Level progress
  },

  // 🎨 DIFFICULTY COLORS
  difficulty: {
    easy: '#22C55E',        // Easy
    medium: '#FACC15',      // Medium
    hard: '#F43F5E',        // Hard
  },

  // 🔲 CONSISTENT SPACING
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // 🔘 BORDER RADIUS
  radius: {
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    full: 9999,
  },

  // 🎭 PROFESSIONAL SHADOWS
  shadows: {
    card: {
      boxShadow: '0px 4px 12px 0px rgba(34, 211, 238, 0.1)',
      elevation: 4,
    },
    button: {
      boxShadow: '0px 2px 8px 0px rgba(56, 189, 248, 0.15)',
      elevation: 3,
    },
    header: {
      boxShadow: '0px 2px 8px 0px #0000001A',
      elevation: 4,
    }
  },

  // 📱 COMPONENT STYLES
  components: {
    header: {
      background: ['rgba(34, 211, 238, 0.12)', 'rgba(124, 58, 237, 0.08)'],
      height: 100,
      paddingTop: 40,
      paddingHorizontal: 20,
    },
    card: {
      background: '#0B1F3E',
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
    },
    button: {
      primary: {
        background: ['#22D3EE', '#38BDF8'],
        textColor: '#ffffff',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 24,
      },
      secondary: {
        background: 'rgba(34, 211, 238, 0.12)',
        textColor: '#22D3EE',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: 'rgba(34, 211, 238, 0.24)',
      }
    },
    input: {
      background: 'rgba(148, 163, 184, 0.08)',
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: 'rgba(56, 189, 248, 0.18)',
      textColor: '#F8FAFC',
      placeholderColor: '#64748B',
    }
  },

  // 📊 STATUS COLORS
  status: {
    online: '#22C55E',
    studying: '#38BDF8',
    offline: '#475569',
    premium: '#FACC15',
    free: '#94A3B8',
  },

  // 🎮 INTERACTIVE STATES
  states: {
    pressed: 0.8,           // Opacity for pressed state
    disabled: 0.5,          // Opacity for disabled state
    loading: 0.7,           // Opacity for loading state
  }
};

// 🎨 BRANDED GRADIENT PRESETS - Featuring MindGains Signature Turquoise
export const brandGradients = {
  // 🐺 SIGNATURE MASCOT GRADIENTS (Like Duolingo's Green)
  mascotPrimary: ['#00D4C7', '#4ADED9'],     // THE signature brand gradient
  mascotSecondary: ['#4ADED9', '#00D4C7'],   // Reversed mascot gradient
  
  // BUTTON GRADIENTS
  primaryButton: ['#00D4C7', '#22D3EE'],     // Signature turquoise to cyan
  secondaryButton: ['#38BDF8', '#7C3AED'],
  successButton: ['#00D4C7', '#22C55E'],     // Turquoise to green (India success)
  premiumButton: ['#FACC15', '#F97316'],
  patrioticButton: ['#FF9933', '#138808'],   // India flag gradient
  
  // BACKGROUNDS  
  background: ['#020817', '#041024'],
  cardBackground: ['rgba(0, 212, 199, 0.12)', 'rgba(124, 58, 237, 0.08)'], // Turquoise tint
  header: ['rgba(0, 212, 199, 0.12)', 'rgba(124, 58, 237, 0.08)'],         // Turquoise header
  
  // SPECIAL GRADIENTS
  indiaSuccess: ['#FF9933', '#00D4C7', '#138808'], // Full India flag with turquoise
  brainPower: ['#00D4C7', '#7C3AED', '#22C55E'],   // Learning energy gradient
};

// 🏗️ COMPONENT PRESET STYLES
export const brandComponents = {
  // Modern Professional Header
  header: {
    background: brandGradients.header,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  // Branded Cards
  card: {
    backgroundColor: brandTheme.backgrounds.card,
    borderRadius: brandTheme.radius.lg,
    padding: brandTheme.spacing.lg,
    ...brandTheme.shadows.card,
  },

  // Professional Buttons
  primaryButton: {
    borderRadius: brandTheme.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 24,
    ...brandTheme.shadows.button,
  },

  // Consistent Input Fields
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: brandTheme.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: brandTheme.text.primary,
  },

  // Section Headers
  sectionHeader: {
    marginBottom: brandTheme.spacing.lg,
  },

  // Consistent spacing
  section: {
    paddingHorizontal: brandTheme.spacing.lg,
    paddingVertical: brandTheme.spacing.lg,
  },
};

// 🎯 BRAND TYPOGRAPHY
export const brandTypography = {
  display: {
    fontSize: 32,
    fontWeight: '700',
    color: brandTheme.text.primary,
    lineHeight: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: brandTheme.text.primary,
    lineHeight: 32,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '500',
    color: brandTheme.text.secondary,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: brandTheme.text.secondary,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: brandTheme.text.muted,
    lineHeight: 20,
  },
};

// 🎪 ANIMATION PRESETS
export const brandAnimations = {
  fadeIn: {
    duration: 300,
    easing: 'ease-out',
  },
  slideUp: {
    duration: 250,
    easing: 'ease-out',
  },
  spring: {
    damping: 20,
    stiffness: 300,
  },
};

export default brandTheme;

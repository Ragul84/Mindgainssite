// 🎮 MindGains Premium Neon Dark - AAA Gaming UI Color System
// Material 3-inspired, milky, adaptive theme system for 2026 flagship UI
import { Platform, Appearance } from 'react-native';

// Material 3 Design Tokens (partial, expand as needed)
export const M3Tokens = {
  color: {
    background: {
      light: '#F6F7F9', // Soft warm light, not pure white
      dark: '#181C20',  // Soft dark, not pure black
      surface: 'rgba(255,255,255,0.12)', // Milky overlay
      glass: 'rgba(255,255,255,0.18)',
      overlay: 'rgba(24,28,32,0.92)',
    },
    primary: '#00D4C7', // Calm turquoise
    secondary: '#00D4C7', // Soft purple
    tertiary: '#FACC15', // Gold accent
    error: '#F43F5E',
    outline: 'rgba(78,205,196,0.35)',
    onPrimary: '#041024',
    onSecondary: '#ffffff',
    onBackground: '#181C20',
    onSurface: '#181C20',
    onError: '#ffffff',
    shadow: 'rgba(78,205,196,0.15)',
    shimmer: 'rgba(78,205,196,0.15)',
    glow: 'rgba(78,205,196,0.25)',
  },
  shape: {
    extraSmall: 8,
    small: 12,
    medium: 16,
    large: 20,
    extraLarge: 28,
    full: 9999,
  },
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  typography: {
    displayLarge: { fontSize: 57, fontWeight: '400', lineHeight: 64, letterSpacing: -0.25 },
    displayMedium: { fontSize: 45, fontWeight: '400', lineHeight: 52, letterSpacing: 0 },
    displaySmall: { fontSize: 36, fontWeight: '400', lineHeight: 44, letterSpacing: 0 },
    headlineLarge: { fontSize: 32, fontWeight: '400', lineHeight: 40, letterSpacing: 0 },
    headlineMedium: { fontSize: 28, fontWeight: '400', lineHeight: 36, letterSpacing: 0 },
    headlineSmall: { fontSize: 24, fontWeight: '400', lineHeight: 32, letterSpacing: 0 },
    titleLarge: { fontSize: 22, fontWeight: '400', lineHeight: 28, letterSpacing: 0 },
    titleMedium: { fontSize: 16, fontWeight: '500', lineHeight: 24, letterSpacing: 0.15 },
    titleSmall: { fontSize: 14, fontWeight: '500', lineHeight: 20, letterSpacing: 0.1 },
    bodyLarge: { fontSize: 16, fontWeight: '400', lineHeight: 24, letterSpacing: 0.5 },
    bodyMedium: { fontSize: 14, fontWeight: '400', lineHeight: 20, letterSpacing: 0.25 },
    bodySmall: { fontSize: 12, fontWeight: '400', lineHeight: 16, letterSpacing: 0.4 },
    labelLarge: { fontSize: 14, fontWeight: '500', lineHeight: 20, letterSpacing: 0.1 },
    labelMedium: { fontSize: 12, fontWeight: '500', lineHeight: 16, letterSpacing: 0.5 },
    labelSmall: { fontSize: 11, fontWeight: '500', lineHeight: 16, letterSpacing: 0.5 },
  },
  motion: {
    spring: {
      standard: { damping: 24, stiffness: 320 },
      expressive: { damping: 18, stiffness: 260 },
      hero: { damping: 14, stiffness: 180 },
    },
    timing: {
      fast: 120,
      normal: 240,
      slow: 400,
    },
  },
};

// Dynamic color scheme (light/dark)
export const getDynamicColorScheme = () => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? {
    ...M3Tokens.color,
    background: M3Tokens.color.background.light,
    surface: M3Tokens.color.background.surface,
    onBackground: M3Tokens.color.onBackground,
    onSurface: '#F6F7F9',
  } : {
    ...M3Tokens.color,
    background: M3Tokens.color.background.light,
    surface: M3Tokens.color.background.surface,
    onBackground: M3Tokens.color.onBackground,
    onSurface: '#181C20',
  };
};

// Main theme object for app usage
export const theme = {
  tokens: M3Tokens,
  getColorScheme: getDynamicColorScheme,
  // ⚡ Compatibility Aliases for legacy component support
  spacing: M3Tokens?.spacing || {
    xxs: 2, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64
  },
  colors: {
    ...(M3Tokens?.color || {}),
    text: {
      primary: M3Tokens?.color?.onBackground || '#181C20',
      secondary: 'rgba(255,255,255,0.7)',
    },
    accent: {
      blue: '#3B82F6',
      green: '#10B981',
      purple: '#8B5CF6',
    }
  },
  borderRadius: {
    sm: M3Tokens?.shape?.extraSmall || 8,
    md: M3Tokens?.shape?.small || 12,
    lg: M3Tokens?.shape?.medium || 16,
    xl: M3Tokens?.shape?.large || 20,
    full: M3Tokens?.shape?.full || 9999,
  },
  fonts: {
    heading: 'Poppins-Bold',
    subheading: 'Poppins-SemiBold',
    body: 'Inter-Regular',
    caption: 'Inter-Medium',
  },
};

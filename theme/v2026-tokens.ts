import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const V2026 = {
  colors: {
    primary: '#00D4C7',
    primaryGlow: 'rgba(0, 212, 199, 0.4)',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    textMuted: '#64748B',
    glass: 'rgba(255, 255, 255, 0.85)',
    border: 'rgba(0, 0, 0, 0.05)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 12,
    md: 20,
    lg: 28,
    xl: 36,
    full: 9999,
  },
  shadows: {
    milky: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 8,
    },
    primary: {
      shadowColor: '#00D4C7',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 12,
    }
  }
};

export const GlassTheme = StyleSheet.create({
  card: {
    backgroundColor: V2026.colors.glass,
    borderRadius: V2026.radius.lg,
    borderWidth: 1.5,
    borderColor: V2026.colors.border,
    padding: V2026.spacing.md,
    ...V2026.shadows.milky,
  } as ViewStyle,
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: V2026.colors.text,
    letterSpacing: -0.5,
  } as TextStyle,
  body: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: V2026.colors.textMuted,
    lineHeight: 20,
  } as TextStyle,
});

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// M3 Typography Scale
export const M3Typography = {
  displayLarge: { fontFamily: 'Poppins-Bold', fontSize: 57, lineHeight: 64, letterSpacing: -0.25 },
  displayMedium: { fontFamily: 'Poppins-Bold', fontSize: 45, lineHeight: 52, letterSpacing: 0 },
  displaySmall: { fontFamily: 'Poppins-Bold', fontSize: 36, lineHeight: 44, letterSpacing: 0 },
  
  headlineLarge: { fontFamily: 'Poppins-SemiBold', fontSize: 32, lineHeight: 40, letterSpacing: 0 },
  headlineMedium: { fontFamily: 'Poppins-SemiBold', fontSize: 28, lineHeight: 36, letterSpacing: 0 },
  headlineSmall: { fontFamily: 'Poppins-SemiBold', fontSize: 24, lineHeight: 32, letterSpacing: 0 },
  
  titleLarge: { fontFamily: 'Poppins-Medium', fontSize: 22, lineHeight: 28, letterSpacing: 0 },
  titleMedium: { fontFamily: 'Inter-Medium', fontSize: 16, lineHeight: 24, letterSpacing: 0.15 },
  titleSmall: { fontFamily: 'Inter-Medium', fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
  
  labelLarge: { fontFamily: 'Inter-SemiBold', fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
  labelMedium: { fontFamily: 'Inter-SemiBold', fontSize: 12, lineHeight: 16, letterSpacing: 0.5 },
  labelSmall: { fontFamily: 'Inter-SemiBold', fontSize: 11, lineHeight: 16, letterSpacing: 0.5 },
  
  bodyLarge: { fontFamily: 'Inter-Regular', fontSize: 16, lineHeight: 24, letterSpacing: 0.5 },
  bodyMedium: { fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 20, letterSpacing: 0.25 },
  bodySmall: { fontFamily: 'Inter-Regular', fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
};

// Milky White + Turquoise Blue M3 Theme
export const M3Colors = {
  // Primary - Electric Turquoise
  primary: '#00D4C7',
  onPrimary: '#FFFFFF',
  primaryContainer: '#E5FAF8',
  onPrimaryContainer: '#003733',
  
  // Secondary - Soft Deep Blue
  secondary: '#3B82F6',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#EFF6FF',
  onSecondaryContainer: '#1E3A8A',
  
  // Tertiary - Modern Purple/Cyan
  tertiary: '#8B5CF6',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#F5F3FF',
  onTertiaryContainer: '#4C1D95',

  // Error
  error: '#EF4444',
  onError: '#FFFFFF',
  errorContainer: '#FEF2F2',
  onErrorContainer: '#991B1B',

  // Backgrounds - The "Milky White" Look
  background: '#F8FAFC',
  onBackground: '#0F172A',
  
  surface: '#FFFFFF',
  onSurface: '#0F172A',
  
  surfaceVariant: '#F1F5F9', // Soft milky cards
  onSurfaceVariant: '#475569',
  
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F8FAFC',
  surfaceContainer: '#F1F5F9',
  surfaceContainerHigh: '#E2E8F0',
  surfaceContainerHighest: '#CBD5E1',
  
  surfaceTint: 'rgba(0, 212, 199, 0.08)', // Electric wash
  
  outline: '#E2E8F0',
  outlineVariant: '#F1F5F9',
  
  // Glassmorphism - Milky
  glassSoft: 'rgba(255, 255, 255, 0.85)',
  glassHover: 'rgba(0, 0, 0, 0.02)',
  glassBorder: 'rgba(0, 0, 0, 0.05)',
};

// Shapes
export const M3Shapes = {
  extraSmall: 8,
  small: 12,
  medium: 16,
  large: 24,
  extraLarge: 32,
  full: 9999, // Pills
};

// Elevation (Shadows & Tonal Overlays) - Soft Milky Dropshadows
export const M3Elevation = {
  level0: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  level1: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  level2: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  level3: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  level4: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  level5: {
    shadowColor: '#00D4C7',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 16,
  }
};

export const M3Motion = {
  expressive: {
    type: 'spring',
    damping: 18,
    stiffness: 150,
    mass: 1,
  },
  productive: {
    type: 'spring',
    damping: 22,
    stiffness: 280,
    mass: 1,
  },
  fluid: {
    type: 'timing',
    duration: 500,
    easing: (t) => t * t * (3.0 - 2.0 * t),
  },
  spatial: {
    type: 'spring',
    damping: 26,
    stiffness: 200,
    mass: 1,
  }
};

export const M3Layout = {
  windowWidth: width,
  windowHeight: height,
  horizontalMargin: 20,
  gutter: 16,
};

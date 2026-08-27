// 🧭 Safe Navigation Helper - Prevents GO_BACK errors with instant transitions
import { router } from 'expo-router';

/**
 * Instantly navigate back with fallback to home - no animations
 * Prevents "GO_BACK action was not handled" errors and white flash
 */
export const safeGoBack = (fallbackRoute: string = '/(tabs)/') => {
  try {
    // Check if we can go back
    if ((router as any).canGoBack?.()) {
      router.back();
    } else {
      // No previous screen, go to fallback route instantly
      router.replace(fallbackRoute as any);
    }
  } catch (error) {
    console.warn('Navigation error, falling back to home:', error);
    router.replace(fallbackRoute as any);
  }
};

/**
 * Instant navigation - no exit animations or delays
 */
export const instantGoBack = (fallbackRoute: string = '/(tabs)/') => {
  try {
    if ((router as any).canGoBack?.()) {
      router.back();
    } else {
      router.replace(fallbackRoute as any);
    }
  } catch (error) {
    router.replace(fallbackRoute as any);
  }
};

/**
 * Navigate back to learning section - instant
 */
export const goBackToLearn = () => {
  instantGoBack('/(tabs)/learn');
};

/**
 * Navigate back to quiz section - instant  
 */
export const goBackToQuiz = () => {
  instantGoBack('/(tabs)/');
};

/**
 * Navigate back to home - instant
 */
export const goBackToHome = () => {
  instantGoBack('/(tabs)/');
};
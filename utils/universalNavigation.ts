import { router } from 'expo-router';
import { Href } from 'expo-router/build/link/href';
import HapticService from './hapticService';

// Universal Premium Navigation System
// Provides consistent navigation experience throughout the app
// Similar to GPay/Spotify navigation feel

interface UniversalNavigationOptions {
  haptic?: boolean;
  direction?: 'slide_from_right' | 'slide_from_left' | 'slide_from_bottom' | 'slide_from_top' | 'scale' | 'instant';
  delay?: number;
}

class UniversalNavigation {
  // Navigate to new screen with premium transition
  static navigateTo(href: Href, options: UniversalNavigationOptions = {}) {
    const { haptic = true, delay = 0 } = options;
    
    if (haptic) {
      HapticService.light();
    }

    if (delay > 0) {
      setTimeout(() => {
        router.push(href);
      }, delay);
    } else {
      router.push(href);
    }
  }

  // Replace current screen (no back history)
  static replaceTo(href: Href, options: UniversalNavigationOptions = {}) {
    const { haptic = true, delay = 0 } = options;
    
    if (haptic) {
      HapticService.light();
    }

    if (delay > 0) {
      setTimeout(() => {
        router.replace(href);
      }, delay);
    } else {
      router.replace(href);
    }
  }

  // Go back with premium transition
  static goBack(options: UniversalNavigationOptions = {}) {
    const { haptic = true, delay = 0 } = options;
    
    if (haptic) {
      HapticService.light();
    }

    if (delay > 0) {
      setTimeout(() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/home');
        }
      }, delay);
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/home');
      }
    }
  }

  // Navigate to home tab with premium transition
  static goHome(options: UniversalNavigationOptions = {}) {
    const { haptic = true } = options;
    
    if (haptic) {
      HapticService.medium();
    }

    router.replace('/home');
  }

  // Premium tab switch (for custom tab handling)
  static switchTab(tabName: string, options: UniversalNavigationOptions = {}) {
    const { haptic = true } = options;
    
    if (haptic) {
      HapticService.light();
    }

    const tabRoutes: { [key: string]: Href } = {
      'home': '/home',
      'learn': '/(tabs)/learn',
      'leaderboard': '/(tabs)/leaderboard',
      'battle': '/(tabs)/battle',
      'profile': '/(tabs)/profile',
    };

    const route = tabRoutes[tabName];
    if (route) {
      router.replace(route);
    }
  }

  // Batch navigation for multiple screens
  static batchNavigate(routes: { href: Href; delay: number }[], options: UniversalNavigationOptions = {}) {
    const { haptic = true } = options;
    
    if (haptic) {
      HapticService.light();
    }

    routes.forEach(({ href, delay }) => {
      setTimeout(() => {
        router.push(href);
      }, delay);
    });
  }
}

export default UniversalNavigation;

// Export convenience functions for cleaner imports
export const { navigateTo, replaceTo, goBack, goHome, switchTab, batchNavigate } = UniversalNavigation;
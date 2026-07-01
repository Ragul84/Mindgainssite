import * as ReanimatedModule from 'react-native-reanimated';

// 🚀 ULTRA-SAFE REANIMATED WRAPPER
// This file is designed to handle different versions of Reanimated and break require cycles.

// 1. Export all named exports from the original module
export * from 'react-native-reanimated';

// 2. Identify the main Animated object (handles default vs namespace)
const AnimatedBase = (ReanimatedModule as any).default || ReanimatedModule || {};

// 3. Define the fallbacks
const fallback = (anim: any) => anim || {};
const noop = () => ({});

// 4. Create safe versions of core functions
export const withRepeat = ReanimatedModule.withRepeat || AnimatedBase.withRepeat || ((a: any) => a);
export const withTiming = ReanimatedModule.withTiming || AnimatedBase.withTiming || ((a: any) => a);
export const withSpring = ReanimatedModule.withSpring || AnimatedBase.withSpring || ((a: any) => a);
export const withDelay = ReanimatedModule.withDelay || AnimatedBase.withDelay || ((d: any, a: any) => a);
export const withSequence = ReanimatedModule.withSequence || AnimatedBase.withSequence || ((...args: any[]) => args[0]);
export const useSharedValue = ReanimatedModule.useSharedValue || AnimatedBase.useSharedValue || ((v: any) => ({ value: v }));
export const useAnimatedStyle = ReanimatedModule.useAnimatedStyle || AnimatedBase.useAnimatedStyle || ((f: any) => ({}));
export const useAnimatedProps = ReanimatedModule.useAnimatedProps || AnimatedBase.useAnimatedProps || ((f: any) => ({}));
export const useDerivedValue = ReanimatedModule.useDerivedValue || AnimatedBase.useDerivedValue || ((f: any) => ({ value: f() }));
export const interpolate = ReanimatedModule.interpolate || AnimatedBase.interpolate || ((x: any) => x);
export const Extrapolate = ReanimatedModule.Extrapolate || AnimatedBase.Extrapolate || { CLAMP: 'clamp', IDENTITY: 'identity', EXTEND: 'extend' };
export const Easing = ReanimatedModule.Easing || AnimatedBase.Easing || { linear: (t: any) => t, inOut: (f: any) => f, ease: (t: any) => t, out: (f: any) => f };

// 5. Build a robust Animated object for default export
// We use a Proxy if available to prevent property access errors, or a safe object literal
const SafeAnimated = {
  ...AnimatedBase,
  withRepeat,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  useDerivedValue,
  interpolate,
  Extrapolate,
  Easing,
};

export default SafeAnimated;

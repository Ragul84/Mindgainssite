import * as Reanimated from 'react-native-reanimated';

// 🛡️ REANIMATED POLYFILL
const Animated = Reanimated.default || Reanimated;

if (Animated && typeof (Animated as any).withRepeat !== 'function') {
  (Animated as any).withRepeat = Reanimated.withRepeat || ((a: any) => a);
}

export default Animated;

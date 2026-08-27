import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface PageTransitionProps {
  children: React.ReactNode;
  mode?: 'slide' | 'fade';
  duration?: number;
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  mode = 'fade', 
  duration = 500 
}) => {
  const transition = useSharedValue(0);

  useEffect(() => {
    transition.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [duration]);

  const animatedStyle = useAnimatedStyle(() => {
    if (mode === 'slide') {
      return {
        opacity: transition.value,
        transform: [
          { translateX: interpolate(transition.value, [0, 1], [width * 0.1, 0]) }
        ],
      };
    }
    return {
      opacity: transition.value,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PageTransition;

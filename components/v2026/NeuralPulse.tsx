import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolate,
  Easing
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const NeuralPulse = () => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
      -1,
      false
    );
  }, []);

  const pulseStyle = (delay: number) => useAnimatedStyle(() => {
    const scale = interpolate(pulse.value, [0, 1], [0.8, 1.5]);
    const opacity = interpolate(pulse.value, [0, 0.5, 1], [0, 0.3, 0]);
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      {[0, 1, 2].map((i) => (
        <Animated.View 
          key={i} 
          style={[
            styles.ring, 
            { position: 'absolute' }, 
            useAnimatedStyle(() => {
              const progress = (pulse.value + i * 0.33) % 1;
              return {
                transform: [{ scale: interpolate(progress, [0, 1], [0.8, 2.5]) }],
                opacity: interpolate(progress, [0, 0.5, 1], [0, 0.4, 0]),
              };
            })
          ]} 
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
  },
  ring: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#00D4C7',
  },
});

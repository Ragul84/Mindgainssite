import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, DimensionValue } from 'react-native';

interface ContentPlaceholderProps {
  lines?: number;
  style?: any;
  width?: DimensionValue;
  height?: number;
}

/**
 * Modern Pulse Skeleton Loader
 * Premium loading states for V2026.
 */

export const ContentPlaceholder = ({ lines = 1, style, width = '100%', height = 12 }: ContentPlaceholderProps) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: lines }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.line,
            { width: i === lines - 1 && lines > 1 ? '60%' : width, height, opacity: pulseAnim },
          ]}
        />
      ))}
    </View>
  );
};

export default {
  ContentPlaceholder,
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  line: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 6,
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface UnifiedBackgroundProps {
  withParticles?: boolean;
  particleIntensity?: 'subtle' | 'moderate' | 'vibrant';
}

export const UnifiedBackground: React.FC<UnifiedBackgroundProps> = ({ 
  withParticles = false,
  particleIntensity = 'subtle' 
}) => (
  <View style={styles.root} pointerEvents="none">
    <LinearGradient
      colors={[
        '#FFFFFF',
        '#F8FAFC',
        '#F1F5F9'
      ]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      locations={[0, 0.55, 1]}
      style={styles.gradient}
    />
    <LinearGradient
      colors={[
        `rgba(14, 165, 233, 0.05)`, // Subtle blue glow
        `rgba(139, 92, 246, 0.03)`, // Subtle purple glow
        'transparent'
      ]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.softGlow}
    />
  </View>
);

const styles = StyleSheet.create({
  root: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  gradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  softGlow: {
    position: 'absolute',
    top: -120,
    left: -80,
    right: -80,
    bottom: -160,
    opacity: 0.8,
  }
});

export default UnifiedBackground;

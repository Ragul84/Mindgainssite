// Professional 3D Card Component for MindGains Premium Brand
import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ViewStyle,
  Platform,
} from 'react-native';

interface Professional3DCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: 'low' | 'medium' | 'high';
  variant?: 'default' | 'premium' | 'accent';
  disabled?: boolean;
}

export default function Professional3DCard({
  children,
  style,
  onPress,
  elevation = 'medium',
  variant = 'default',
  disabled = false,
}: Professional3DCardProps) {
  const animatedValue = useRef(new Animated.Value(1)).current;
  const shadowAnimated = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnimated, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnimated, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const elevationStyles = {
    low: styles.elevationLow,
    medium: styles.elevationMedium,
    high: styles.elevationHigh,
  };

  const variantStyles = {
    default: styles.variantDefault,
    premium: styles.variantPremium,
    accent: styles.variantAccent,
  };

  const animatedShadow = {
    shadowOpacity: shadowAnimated.interpolate({
      inputRange: [0.8, 1],
      outputRange: [0.15, 0.25],
    }),
    elevation: shadowAnimated.interpolate({
      inputRange: [0.8, 1],
      outputRange: [Platform.OS === 'android' ? 4 : 0, Platform.OS === 'android' ? 8 : 0],
    }),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={1}
        disabled={disabled}
      >
        <Animated.View
          style={[
            styles.card,
            elevationStyles[elevation],
            variantStyles[variant],
            animatedShadow,
            {
              transform: [{ scale: animatedValue }],
              opacity: disabled ? 0.6 : 1,
            },
            style,
          ]}
        >
          {children}
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View
      style={[
        styles.card,
        elevationStyles[elevation],
        variantStyles[variant],
        animatedShadow,
        { opacity: disabled ? 0.6 : 1 },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    // Professional backdrop
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    // Subtle gradient overlay
    backgroundImage: Platform.OS === 'web' 
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)'
      : undefined,
  },
  
  // Elevation Levels
  elevationLow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  elevationMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  elevationHigh: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  
  // Card Variants
  variantDefault: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  variantPremium: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  variantAccent: {
    backgroundColor: 'rgba(249, 250, 251, 0.95)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
});
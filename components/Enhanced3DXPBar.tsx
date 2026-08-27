// Enhanced 3D XP Bar - Duolingo-style with proper database integration
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';
import { V2026 } from '@/theme/v2026-tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#00D4C7',
  success: '#48C586',
  streak: '#FF9500', // Vibrant streak orange
  text: '#0F172A',
  textMuted: '#64748B',
  surface: 'rgba(255, 255, 255, 0.9)',
};

interface Enhanced3DXPBarProps {
  totalXP: number;
  streak: number;
  animated?: boolean;
  isLoading?: boolean;
  onXPIncrease?: (amount: number) => void;
}

const ShimmerBlock = ({ style }: { style?: any }) => {
  const shimmerValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerValue]);

  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View style={[styles.shimmerBase, style]}>
      <Animated.View
        style={[
          styles.shimmerHighlightContainer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.45)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const AnimatedXPCounter = ({ value, previousValue, animated = true }: { value: number; previousValue: number; animated?: boolean }) => {
  const safeValue = (typeof value === 'number' && !isNaN(value)) ? value : 0;
  const safePreviousValue = (typeof previousValue === 'number' && !isNaN(previousValue)) ? previousValue : 0;

  const countAnim = React.useRef(new Animated.Value(safePreviousValue)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const [displayValue, setDisplayValue] = React.useState(safePreviousValue);

  React.useEffect(() => {
    if (animated && safeValue !== safePreviousValue) {
      Animated.parallel([
        Animated.timing(countAnim, {
          toValue: safeValue,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]),
      ]).start();

      const listener = countAnim.addListener(({ value: animValue }) => {
        setDisplayValue(Math.floor(animValue));
      });
      return () => countAnim.removeListener(listener);
    } else {
      setDisplayValue(safeValue);
      countAnim.setValue(safeValue);
    }
  }, [safeValue, safePreviousValue, animated]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Text style={styles.xpNumber}>{displayValue.toLocaleString()}</Text>
    </Animated.View>
  );
};

const Enhanced3DXPBar = ({ totalXP = 0, streak = 0, animated = true, isLoading = false, onXPIncrease }: Enhanced3DXPBarProps) => {
  const safeTotalXP = (typeof totalXP === 'number' && !isNaN(totalXP)) ? totalXP : 0;
  const safeStreak = (typeof streak === 'number' && !isNaN(streak)) ? streak : 0;

  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const [previousXP, setPreviousXP] = React.useState(safeTotalXP);
  
  const currentLevelXP = safeTotalXP % 100;
  const progress = currentLevelXP / 100;

  useEffect(() => {
    if (safeTotalXP > previousXP && onXPIncrease) {
      onXPIncrease(safeTotalXP - previousXP);
    }
    setPreviousXP(safeTotalXP);

    if (animated) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(progress);
    }
  }, [safeTotalXP, streak, animated]);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.glassContainer}>
        {/* Streak Section */}
        <TouchableOpacity 
          style={styles.section}
          onPress={() => router.push('/(tabs)/streak')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#FFD76F', '#FF9500']}
            style={styles.iconCircle}
          >
            <Ionicons name="flame" size={14} color="#FFF" />
          </LinearGradient>
          <View style={styles.textContainer}>
            {isLoading ? (
              <ShimmerBlock style={{ width: 20, height: 14, borderRadius: 4, marginVertical: 2 }} />
            ) : (
              <Text style={styles.valueText}>{safeStreak}</Text>
            )}
            <Text style={styles.labelText}>STREAK</Text>
          </View>
        </TouchableOpacity>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.track}>
            {isLoading ? (
              <ShimmerBlock style={StyleSheet.absoluteFill} />
            ) : (
              <Animated.View
                style={[
                  styles.fill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              >
                <LinearGradient
                  colors={['#00D4C7', '#0EA5E9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            )}
          </View>
        </View>

        {/* XP Section */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#A78BFA', '#7C3AED']}
            style={styles.iconCircle}
          >
            <Ionicons name="flash" size={14} color="#FFF" />
          </LinearGradient>
          <View style={styles.textContainer}>
            {isLoading ? (
              <ShimmerBlock style={{ width: 32, height: 14, borderRadius: 4, marginVertical: 2 }} />
            ) : (
              <AnimatedXPCounter 
                value={safeTotalXP} 
                previousValue={previousXP} 
                animated={animated} 
              />
            )}
            <Text style={styles.labelText}>TOTAL XP</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    height: 52,
    width: '100%',
  },
  glassContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 26,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    ...V2026.shadows.milky,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  valueText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    lineHeight: 18,
  },
  xpNumber: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    lineHeight: 18,
  },
  labelText: {
    fontSize: 8,
    fontFamily: 'Poppins-SemiBold',
    color: '#64748B',
    marginTop: -2,
  },
  progressSection: {
    flex: 1,
    marginHorizontal: 12,
  },
  track: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  shimmerBase: {
    backgroundColor: '#E2E8F0', // slate-200
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerHighlightContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Enhanced3DXPBar;


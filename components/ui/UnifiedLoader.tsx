// 🔄 Unified Loading Component - Consistent loading animation across all screens
// Uses loading.json from mascot folder for all subpages

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { theme } from '@/constants/theme';
import { UnifiedBackground } from './UnifiedBackground';

const { width, height } = Dimensions.get('window');

interface UnifiedLoaderProps {
  message?: string;
  context?: 'daily' | 'snack' | 'quiz' | 'content' | 'battle' | 'learn' | 'study' | 'analysis' | 'general';
  fullScreen?: boolean;
  showBackground?: boolean;
  size?: 'small' | 'medium' | 'large';
}

// Adaptive loading messages based on context
const ADAPTIVE_MESSAGES = {
  daily: [
    'Preparing your daily dose of knowledge',
    'Curating today\'s learning experience',
    'Crafting your intellectual journey',
    'Loading your brain-boosting challenge',
  ],
  snack: [
    'Preparing your daily snack for your brain',
    'Cooking up bite-sized wisdom',
    'Serving fresh knowledge nuggets',
    'Brewing your mental refresher',
  ],
  quiz: [
    'Preparing your adaptive quiz experience',
    'Calibrating questions to your level',
    'Loading your personalized challenge',
    'Assembling your knowledge test',
  ],
  content: [
    'Loading premium learning content',
    'Preparing your study materials',
    'Curating educational resources',
    'Building your knowledge foundation',
  ],
  battle: [
    'Preparing for intellectual combat',
    'Loading your competitive arena',
    'Calibrating battle parameters',
    'Initializing knowledge warfare',
  ],
  learn: [
    'Crafting your learning pathway',
    'Preparing interactive lessons',
    'Loading educational excellence',
    'Building your skill foundation',
  ],
  study: [
    'Organizing your study session',
    'Preparing focus-enhancing materials',
    'Loading concentration boosters',
    'Calibrating learning efficiency',
  ],
  analysis: [
    'Analyzing your learning patterns',
    'Processing cognitive insights',
    'Generating intelligence reports',
    'Calculating knowledge metrics',
  ],
  general: [
    'Loading exceptional content',
    'Preparing premium experience',
    'Calibrating system excellence',
    'Initializing smart features',
  ],
};

// Get adaptive message based on context
const getAdaptiveMessage = (context: string, customMessage?: string): string => {
  if (customMessage !== undefined) return customMessage; // Return exactly what was passed, including empty string
  
  const messages = ADAPTIVE_MESSAGES[context as keyof typeof ADAPTIVE_MESSAGES] || ADAPTIVE_MESSAGES.general;
  return messages[Math.floor(Math.random() * messages.length)];
};

// Animated Dot Component
const AnimatedDot: React.FC<{ delay: number }> = ({ delay }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

export const UnifiedLoader: React.FC<UnifiedLoaderProps> = ({
  message,
  context = 'general',
  fullScreen = true,
  showBackground = true,
  size = 'medium',
}) => {
  const adaptiveMessage = getAdaptiveMessage(context, message);
  // Initialize animations with proper values
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set visible after mount to avoid animation issues
    setIsVisible(true);
    
    // Start animations
    fadeAnim.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
    
    scaleAnim.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.back(1.1)),
    });

    textOpacity.value = withDelay(
      200,
      withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      })
    );

    return () => {
      // Reset values on unmount
      fadeAnim.value = 0;
      scaleAnim.value = 0.8;
      textOpacity.value = 0;
    };
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: scaleAnim.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const getLottieSize = () => {
    switch (size) {
      case 'small': return 80;
      case 'large': return 200;
      default: return 150;
    }
  };

  const content = (
    <Animated.View style={[styles.animationContainer, containerAnimatedStyle]}>
      {/* Lottie Animation - Same position and style for all screens */}
      <View style={styles.lottieWrapper}>
        {isVisible && (
          <LottieView
            source={require('@/assets/lotties/loadingscreen.json')}
            autoPlay
            loop
            style={[
              styles.lottie,
              {
                width: getLottieSize(),
                height: getLottieSize(),
              },
            ]}
          />
        )}
      </View>

      {/* Adaptive Loading message - only show if message exists */}
      {adaptiveMessage && adaptiveMessage.trim() && (
        <Animated.View style={[styles.messageContainer, textAnimatedStyle]}>
          <Text style={styles.messageText}>{adaptiveMessage}</Text>
          <View style={styles.progressDots}>
            <AnimatedDot delay={0} />
            <AnimatedDot delay={100} />
            <AnimatedDot delay={200} />
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );

  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        {showBackground && <UnifiedBackground />}
        <View style={styles.centerContainer}>
          {content}
        </View>
      </View>
    );
  }

  return <View style={styles.inlineContainer}>{content}</View>;
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  inlineContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  lottie: {
    // Consistent size and position for all screens
  },
  messageContainer: {
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8b5cf6', // Subdued purple
  },
});

export default UnifiedLoader;
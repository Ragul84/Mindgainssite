import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CelebrationScreen() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  
  const xpEarned = parseInt(params.xpEarned as string) || 50;
  const topicName = (params.topicName as string) || "Lesson";
  
  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const starsAnim = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Star animations
    starsAnim.forEach((anim, index) => {
      Animated.sequence([
        Animated.delay(index * 200),
        Animated.spring(anim, {
          toValue: 1,
          tension: 30,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Trophy rotation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleContinue = () => {
    router.push('/(tabs)');
  };

  const handleNextLesson = () => {
    // Navigate to next lesson in the journey
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#FFD700', '#FFA500', '#FF6347']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          <Animated.View 
            style={[
              styles.contentContainer,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
            ]}
          >
            {/* Trophy Animation */}
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Text style={styles.trophy}>🏆</Text>
            </Animated.View>

            {/* Success Message */}
            <Text style={styles.title}>Brilliant Work!</Text>
            <Text style={styles.subtitle}>You've completed</Text>
            <Text style={styles.topicName}>{topicName}</Text>

            {/* Stars */}
            <View style={styles.starsContainer}>
              {[0, 1, 2].map((index) => (
                <Animated.View
                  key={index}
                  style={{
                    transform: [
                      { scale: starsAnim[index] },
                      {
                        rotate: starsAnim[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '720deg'],
                        }),
                      },
                    ],
                  }}
                >
                  <Text style={styles.star}>⭐</Text>
                </Animated.View>
              ))}
            </View>

            {/* XP Card */}
            <LinearGradient
              colors={['#fff', '#f0f0f0']}
              style={styles.xpCard}
            >
              <Text style={styles.xpLabel}>XP Earned</Text>
              <Text style={styles.xpValue}>+{xpEarned}</Text>
              <View style={styles.xpBar}>
                <View style={[styles.xpFill, { width: `${Math.min(100, (xpEarned / 100) * 100)}%` }]} />
              </View>
            </LinearGradient>

            {/* Achievement Badges */}
            <View style={styles.badgesContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeIcon}>🎯</Text>
                <Text style={styles.badgeText}>Focused</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeIcon}>⚡</Text>
                <Text style={styles.badgeText}>Quick Learner</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeIcon}>🔥</Text>
                <Text style={styles.badgeText}>On Fire!</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={styles.nextButton}
                activeOpacity={1} onPress={handleNextLesson}>
                <LinearGradient
                  colors={['#00aeff', '#174cfcd8']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.nextButtonText}>Next Lesson →</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.homeButton}
                activeOpacity={1} onPress={handleContinue}>
                <Text style={styles.homeButtonText}>Back to Home</Text>
              </TouchableOpacity>
            </View>

            {/* Premium Lottie Confetti */}
            <LottieView
              source={require("@/assets/lotties/confetti.json")}
              autoPlay
              loop={false}
              style={styles.confettiLottie}
              resizeMode="cover"
            />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  trophy: {
    fontSize: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  topicName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 5,
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  star: {
    fontSize: 40,
    marginHorizontal: 5,
  },
  xpCard: {
    width: '90%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  xpLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  xpValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 15,
    textShadowColor: 'rgba(255,215,0,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  xpBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 6,
  },
  badgesContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nextButton: {
    width: '90%',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 15,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  homeButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  confettiLottie: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    pointerEvents: 'none',
  },
});
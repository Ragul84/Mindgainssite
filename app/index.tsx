import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from '@/utils/reanimated';
import { useAuthContext } from '@/components/AuthProvider';
import { SupabaseService, supabase } from '@/utils/supabaseService';
import { getUserProtocol } from '@/utils/protocolService';
import LottieView from 'lottie-react-native';
import { MotiView } from 'moti';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { isAuthenticated, loading, initialized } = useAuthContext();
  const lottieRef = useRef<LottieView>(null);
  
  // Animation Values
  const contentOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.9);
  const textOpacity = useSharedValue(0);

  // Navigation Logic
  const handleNavigation = async () => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/auth');
        return;
      }

      const [profile, protocol] = await Promise.all([
        SupabaseService.getUserProfile(user.id),
        getUserProtocol(user.id),
      ]);

      const needsOnboarding = !profile?.full_name || !protocol?.track_id;
      router.replace(needsOnboarding ? '/profile-setup' : '/home');
    } catch (error) {
      console.error('Failed to resolve launch route:', error);
      router.replace('/home');
    }
  };

  useEffect(() => {
    // Entrance Animations
    contentOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) });
    contentScale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.back(1.5)) });
    textOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));

    // Navigation Trigger
    if (initialized && !loading) {
      // Allow the Lottie and animations to play
      const timer = setTimeout(handleNavigation, 4000); 
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, initialized]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ scale: contentScale.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: interpolate(textOpacity.value, [0, 1], [20, 0]) }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* 🌌 Premium Milky Background */}
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.glowContainer} pointerEvents="none">
        <LinearGradient
          colors={['rgba(0, 212, 199, 0.12)', 'transparent']}
          style={styles.glowOrb}
        />
      </View>

      <View style={styles.content}>
        {/* 🎨 Super Stylish Welcome Lottie */}
        <Animated.View style={[styles.lottieContainer, animatedContentStyle]}>
          <LottieView
            ref={lottieRef}
            source={require('@/assets/lotties/welcomescreen.json')}
            autoPlay
            loop
            style={styles.lottie}
            resizeMode="contain"
          />
        </Animated.View>

        {/* 🏷️ Clean Brand (No BS terms) */}
        <Animated.View style={[styles.textWrapper, animatedTextStyle]}>
          <Text style={styles.brandName}>MindGains</Text>
          <Text style={styles.tagline}>India's Greatest Knowledge Wave</Text>
        </Animated.View>
      </View>

      {/* ⚡ Loading Indicator */}
      <View style={styles.footer}>
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1500, type: 'timing' }}
          style={styles.loadingRow}
        >
          <ActivityIndicator size="small" color="#00D4C7" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </MotiView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOrb: {
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    position: 'absolute',
    top: -width * 0.3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieContainer: {
    width: width * 0.85,
    height: width * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  textWrapper: {
    alignItems: 'center',
    marginTop: -20,
  },
  brandName: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    letterSpacing: -1.5,
  },
  badge: {
    backgroundColor: 'rgba(0, 212, 199, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 99,
    marginTop: 8,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 212, 199, 0.3)',
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#00D4C7',
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 20,
    letterSpacing: 0.8,
  },
  footer: {
    paddingBottom: height * 0.1,
    alignItems: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
  },
});


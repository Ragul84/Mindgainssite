import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  Share,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { Canvas, Image as SkiaImage, RoundedRect, Text as SkiaText, matchFont, useImage } from '@shopify/react-native-skia';
import { SupabaseService } from '@/utils/supabaseService';
import HapticService from '@/utils/hapticService';

type Phase = 'intro' | 'animation' | 'celebration' | 'success';

type ProfileBits = {
  fullName: string;
  state: string;
};

const DEFAULT_PROFILE: ProfileBits = {
  fullName: 'Learner',
  state: 'India',
};

function MisaCertificateGraphic({ name, state }: { name: string; state: string }) {
  const image = useImage(require('@/assets/finaloath.jpg'));
  const nameFont = useMemo(
    () => matchFont({ fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontSize: 48 }),
    []
  );
  const stateFont = useMemo(
    () => matchFont({ fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontSize: 30 }),
    []
  );

  if (!image) {
    return <View style={{ flex: 1, backgroundColor: '#FFFDF8' }} />;
  }

  return (
    <Canvas style={StyleSheet.absoluteFillObject}>
      <SkiaImage image={image} x={0} y={0} width={1024} height={1536} />
      <SkiaText text={name} x={512} y={1168} font={nameFont} color="#0F172A" />
      <SkiaText text={state} x={512} y={1245} font={stateFont} color="#166534" />
    </Canvas>
  );
}

export default function MisaScreen() {
  const { width, height } = useWindowDimensions();
  const [phase, setPhase] = useState<Phase>('intro');
  const [profile, setProfile] = useState<ProfileBits>(DEFAULT_PROFILE);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const celebrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const introCertificateHeight = Math.min(Math.max(height * 0.57, 440), (width - 36) * 1.56);
  const successCertificateHeight = Math.min(Math.max(height * 0.50, 360), (width - 36) * 1.40);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const user = await SupabaseService.getCurrentUser();
        if (!mounted || !user) return;

        const meta = user.user_metadata ?? {};
        setProfile({
          fullName:
            (meta.full_name as string) ||
            (meta.name as string) ||
            user.email?.split('@')[0] ||
            DEFAULT_PROFILE.fullName,
          state:
            (meta.state as string) ||
            (meta.user_state as string) ||
            DEFAULT_PROFILE.state,
        });
      } catch (error) {
        console.error('Failed to load profile for MISA movement:', error);
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const shareText = useMemo(
    () =>
      [
        `${profile.fullName} · ${profile.state}`,
        'Make India Smarter Again!',
        'I took the Learner’s Oath and joined the movement for daily learning.',
      ].join('\n\n'),
    [profile.fullName, profile.state]
  );
  const shareImageUri = useMemo(
    () => RNImage.resolveAssetSource(require('@/assets/finaloath.jpg')).uri,
    []
  );

  const startOath = () => {
    HapticService.heavy();
    if (phase !== 'intro') return;
    setPhase('animation');
    if (timerRef.current) clearTimeout(timerRef.current);
    if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
  };

  const onShare = async () => {
    HapticService.selection();
    try {
      await Share.share({
        title: 'MISA Movement',
        message: shareText,
        url: shareImageUri,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const onBack = () => {
    HapticService.selection();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
    router.back();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
    };
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#FFFDF8', '#F9F4E8', '#EEF8F3']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topGlow} pointerEvents="none">
        <LinearGradient
          colors={['rgba(245,158,11,0.20)', 'rgba(124,58,237,0.09)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.topGlowFill}
        />
      </View>

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.page}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.kicker}>MISA Movement</Text>
              <Text style={styles.title}>The Learner's Oath</Text>
            </View>
            <Pressable onPress={onBack} hitSlop={10} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#0F172A" />
            </Pressable>
          </View>

          <View style={styles.content}>
            {phase === 'intro' && (
              <Animated.View
                entering={FadeIn.duration(220)}
                exiting={FadeOut.duration(180)}
                style={styles.stage}
              >
                <View style={[styles.oathCardShell, { height: introCertificateHeight }]}>
                  <MisaCertificateGraphic
                    name={loadingProfile ? '...' : profile.fullName}
                    state={loadingProfile ? '...' : profile.state}
                  />
                </View>

                <View style={styles.oathButtonBlock}>
                  <Text style={styles.buttonCaption}>Join the movement</Text>
                    <Pressable onPress={startOath} style={styles.oathButton}>
                      <LinearGradient
                      colors={['#00D4C7', '#1D4ED8', '#7C3AED']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.oathButtonFill}
                    >
                      <Text style={styles.oathButtonText}>Take the oath</Text>
                      <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    </LinearGradient>
                  </Pressable>
                </View>
              </Animated.View>
            )}

            {phase === 'animation' && (
              <Animated.View
                entering={ZoomIn.duration(200)}
                exiting={FadeOut.duration(180)}
                style={styles.animationStage}
              >
                <View style={styles.animationCard}>
                  <LottieView
                    source={require('@/assets/lotties/welcomescreen.json')}
                    autoPlay
                    loop={false}
                    resizeMode="cover"
                    style={styles.animationLottie}
                    onAnimationFinish={() => {
                      if (timerRef.current) clearTimeout(timerRef.current);
                      setPhase('celebration');
                      if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
                      celebrationTimerRef.current = setTimeout(() => setPhase('success'), 1300);
                    }}
                  />
                </View>
                <Text style={styles.animationTitle}>The movement begins</Text>
                <Text style={styles.animationSub}>Your oath is being recorded.</Text>
              </Animated.View>
            )}

            {phase === 'celebration' && (
              <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(180)}
                style={styles.successStage}
              >
                <View style={styles.celebrationWrap}>
                  <LottieView
                    source={require('@/assets/lotties/splashscreen.json')}
                    autoPlay
                    loop
                    resizeMode="cover"
                    style={styles.celebrationLottie}
                  />
                </View>
              </Animated.View>
            )}

            {phase === 'success' && (
              <Animated.View
                entering={FadeIn.duration(220)}
                style={styles.successStage}
              >
                <View style={styles.successConfetti} pointerEvents="none">
                  <LottieView
                    source={require('@/assets/lotties/splashscreen.json')}
                    autoPlay
                    loop
                    resizeMode="cover"
                    style={styles.successConfettiLottie}
                  />
                </View>
                <View style={styles.successCard}>
                  <View style={styles.successBadgeRow}>
                    <View style={styles.successBadge}>
                      <Ionicons name="checkmark-circle" size={18} color="#00D4C7" />
                      <Text style={styles.successBadgeText}>Oath complete</Text>
                    </View>
                  </View>

                  <View style={[styles.successCardShell, { height: successCertificateHeight }]}>
                    <MisaCertificateGraphic
                      name={loadingProfile ? '...' : profile.fullName}
                      state={loadingProfile ? '...' : profile.state}
                    />
                  </View>

                  <Text style={styles.successTitle}>Joined the movement successfully</Text>
                  <Text style={styles.successCopy}>
                    {profile.fullName} from {profile.state} is now part of the learning movement.
                  </Text>

                  <View style={styles.shareRow}>
                    <Pressable onPress={onShare} style={styles.shareBtn}>
                      <Ionicons name="logo-whatsapp" size={18} color="#16A34A" />
                      <Text style={styles.shareBtnText}>Share on WhatsApp</Text>
                    </Pressable>
                    <Pressable onPress={onShare} style={styles.shareBtn}>
                      <Ionicons name="logo-facebook" size={18} color="#2563EB" />
                      <Text style={styles.shareBtnText}>Share on Facebook</Text>
                    </Pressable>
                  </View>

                  <Pressable onPress={onBack} style={styles.doneBtn}>
                    <Text style={styles.doneBtnText}>Done</Text>
                  </Pressable>
                </View>
              </Animated.View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFDF8',
  },
  safe: {
    flex: 1,
  },
  topGlow: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  topGlowFill: {
    position: 'absolute',
    top: -140,
    left: -60,
    right: -60,
    height: 260,
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 180,
  },
  page: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  kicker: {
    color: '#64748B',
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 4,
    color: '#0F172A',
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    letterSpacing: -0.6,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  stage: {
    flex: 1,
    justifyContent: 'space-between',
  },
  oathCardShell: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
    aspectRatio: 0.78,
  },
  oathCardImage: {
    width: '100%',
    height: '100%',
  },
  oathButtonBlock: {
    paddingTop: 16,
    paddingBottom: 6,
  },
  buttonCaption: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 12,
  },
  oathButton: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  oathButtonFill: {
    height: 56,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  oathButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
  },
  animationStage: {
    flex: 1,
    justifyContent: 'center',
  },
  animationCard: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
    height: 380,
  },
  celebrationWrap: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  celebrationLottie: {
    width: '100%',
    height: '100%',
  },
  animationLottie: {
    width: '100%',
    height: '100%',
  },
  animationTitle: {
    marginTop: 18,
    color: '#0F172A',
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  animationSub: {
    marginTop: 8,
    color: '#64748B',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  successStage: {
    flex: 1,
    justifyContent: 'center',
  },
  successConfetti: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
    opacity: 0.32,
  },
  successConfettiLottie: {
    width: '100%',
    height: '100%',
  },
  successCard: {
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 7,
  },
  successBadgeRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(0,212,199,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(0,212,199,0.18)',
  },
  successBadgeText: {
    color: '#0F766E',
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  successCardShell: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.12)',
    aspectRatio: 0.78,
  },
  successCardImage: {
    width: '100%',
    height: '100%',
  },
  successOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  overlayName: {
    color: '#0F172A',
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    backgroundColor: 'rgba(255,253,248,0.92)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    overflow: 'hidden',
  },
  overlayState: {
    marginTop: 8,
    color: '#166534',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1.2,
    textAlign: 'center',
    textTransform: 'uppercase',
    backgroundColor: 'rgba(255,253,248,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: 'hidden',
  },
  successTitle: {
    marginTop: 16,
    color: '#0F172A',
    fontSize: 21,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  successCopy: {
    marginTop: 8,
    color: '#475569',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    lineHeight: 21,
    textAlign: 'center',
  },
  shareRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  shareBtn: {
    flex: 1,
    borderRadius: 18,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  shareBtnText: {
    color: '#0F172A',
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
  },
  doneBtn: {
    marginTop: 14,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
});

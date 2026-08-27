// pages/index.js (MindGainsHomePage) - updated to use LearningPathNoSvg + patched LessonBubblePopup
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
  StyleSheet,
  RefreshControl,
  Easing,
  Modal,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
  ScrollView,
  Platform,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import UniversalNavigation from '@/utils/universalNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import { useVoiceContext } from './_layout';

// Services & Utils
import { useAuthContext } from '@/components/AuthProvider';
import { SupabaseService, supabase } from '@/utils/supabaseService';
import HapticService from '@/utils/hapticService';
import LearningProgressService from '@/utils/learningProgressService';
import { getAllTopicsByPriority } from '@/constants/examPriorityTopics';
import { RealDatabaseContentService, DatabaseTopic } from '@/utils/realDatabaseContentService';
import { XPSystem } from '@/utils/xpSystem';
import { StreakService } from '@/utils/streakService';
import { StreakCache } from '@/utils/streakCache';
import { ClearProgressCache } from '@/utils/clearProgressCache';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { RewardService } from '@/services/rewardService';
import { useUserStats } from '@/hooks/useUserStats';
import { getMissionPayload, getUserProtocol, syncProtocolForToday, getMissionCountdown } from '@/utils/protocolService';

type MindGainsHomePageProps = {
  showLearningPath?: boolean;
};

type CurrentAffair = {
  headline: string;
  summary: string;
  updatedAt: string;
  tag?: string;
};

type KuralLanguage = 'ta' | 'hi' | 'te' | 'kn' | 'ml';
// Components (using clean elevated learning path)
import LessonBubblePopup from '@/components/ui/LessonBubblePopup';
// import CleanLearningPath from '@/components/CleanLearningPath_EXPERIMENTAL';
import CleanLearningPath from '@/components/CleanLearningPath_Timeline';
import XPBar from '@/components/newhome/XPBar';
import Enhanced3DXPBar from '@/components/Enhanced3DXPBar';
import ThreeDButton from '@/components/ThreeDButton';
import { DayStreakModal, type DayStreakMode } from '@/components/ui/DayStreakModal';
import { PillIcon, CookieIcon } from '@/components/icons/Icons';
import GeminiVoiceGradients from '@/components/ui/GeminiVoiceGradients';
import PremiumContentCard from '@/components/ui/PremiumContentCard';
import { GoldenFrame, SubtleHexPattern, DeepSpaceNebula } from '@/components/decor/PremiumDecor';
import { BentoCard } from '@/components/v2026/BentoCard';
import { V2026 } from '@/theme/v2026-tokens';
import { Image } from 'react-native';

// Assets
// @ts-ignore - Image module exists in json.d.ts but IDE may need refresh
import headImage from '@/assets/images/head.png';
import mindClashBannerImage from '@/assets/images/mindclash_banner.jpg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  primaryBlue: '#00D4C7',
  secondaryBlue: '#00D4C7',
  backgroundDark: '#F8FAFC', // Milky White
  cardDark: '#FFFFFF',
  successMint: '#48C586',
  warmAccent: '#FFD76F',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  borders: '#E2E8F0',
};

// Professional 8px spacing grid
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const TOOL_CARD_WIDTH = (SCREEN_WIDTH - 56) / 2;
// Prevents repeated 404 XHRs when current_affairs_daily table doesn't exist yet
let _currentAffairsTableMissing = false;
const studyToolsConfig = [
  {
    id: 'quiz-hub',
    title: 'Quiz Hub',
    subtitle: 'Practice tests organized by subjects',
    icon: 'bullseye',
    gradient: ['#1695fd', '#023480'] as [string, string],
    route: '/quiz-hub',
  },
  {
    id: 'quick-sprint',
    title: 'Quick Sprint',
    subtitle: '10-question rapid fire overall test',
    icon: 'bolt',
    gradient: ['#F59E0B', '#D97706'] as [string, string],
    route: '/quiz/reader?mode=quick-sprint',
  },
  {
    id: 'generate-lesson',
    title: 'Generate Lesson',
    subtitle: 'Blueprint any topic into a clean path',
    icon: 'map-signs',
    gradient: ['#EC4899', '#F472B6'] as [string, string],
    route: '/learn/blueprint',
  },
  {
    id: 'mind-clash',
    title: 'Quiz Rooms',
    subtitle: 'Create, share & play with friends',
    icon: 'gamepad',
    gradient: ['#8B5CF6', '#6D28D9'] as [string, string],
    route: '/quiz-rooms',
  },
];

// Styles (Standardized for Deep Space Flat Glass Aesthetic)
const ArenaEnterButton = () => {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, { toValue: 1, duration: 1600, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);
  const shimmerX = shimmer.interpolate({ inputRange: [0, 1], outputRange: [-100, 180] });
  const metaText = '';

  const [dayMeta, phaseMeta] = metaText.split('Ã¢â‚¬Â¢').map((part: string) => part.trim());

  return (
    <MotiView
      from={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ type: 'timing', duration: 900, loop: true }}
      style={styles.arenaEnterBtn}
    >
      <LinearGradient
        colors={['#00D4C7', '#6366F1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.arenaEnterGradient}
      >
        <Ionicons name="flash" size={14} color="#FFFFFF" />
        <Text style={styles.arenaEnterText}>ENTER ARENA</Text>
        <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { transform: [{ translateX: shimmerX }] }]}
        >
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: 70, height: '100%', transform: [{ skewX: '-15deg' }] }}
          />
        </Animated.View>
      </LinearGradient>
    </MotiView>
  );
};

const GoldShineOverlay = () => (
  <MotiView
    from={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 1500, type: 'timing' }}
    style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255, 215, 111, 0.1)', zIndex: 9999 }]}
    pointerEvents="none"
  >
    <LinearGradient
      colors={['transparent', 'rgba(255, 215, 111, 0.2)', 'transparent']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  </MotiView>
);

export default function HomeTabScreen() {
  return <MindGainsHomePage showLearningPath={false} />;
}

export function AdminHomeScreen() {
  return <MindGainsHomePage showLearningPath />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  homeBandTop: {
    position: 'absolute',
    top: -120,
    left: -40,
    right: -40,
    height: 240,
    backgroundColor: 'rgba(255, 153, 51, 0.08)',
    transform: [{ rotate: '-7deg' }],
  },
  homeBandMid: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.34,
    left: -60,
    right: -60,
    height: 150,
    backgroundColor: 'rgba(14, 165, 233, 0.045)',
    transform: [{ rotate: '5deg' }],
  },
  homeBandBottom: {
    position: 'absolute',
    bottom: -90,
    left: -50,
    right: -50,
    height: 230,
    backgroundColor: 'rgba(19, 136, 8, 0.07)',
    transform: [{ rotate: '6deg' }],
  },
  homeGridPanel: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.18,
    right: -20,
    width: SCREEN_WIDTH * 0.55,
    height: SCREEN_HEIGHT * 0.28,
    opacity: 0.45,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.04)',
    overflow: 'hidden',
  },
  homeGridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.05)',
  },
  homeGridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.045)',
  },
  commandHeader: { 
    paddingHorizontal: 16,
    zIndex: 100,
  },
  headerGlassContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: '#F8FAFC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 3,
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 8,
    height: 44,
    justifyContent: 'center',
  },
  proActionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  


  // Path Styles
  duolingoNodeContainer: { position: 'relative', marginBottom: 60, minHeight: 120 },
  duolingoConnectorLine: { position: 'absolute', left: '50%', top: 60, bottom: -60, width: 6, backgroundColor: '#F8FAFC', opacity: 0.2, marginLeft: -3, borderRadius: 3 },
  mascotContainer: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#F8FAFC', borderWidth: 2, borderColor: '#00D4C7', alignItems: 'center', justifyContent: 'center', shadowColor: '#00D4C7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 10, elevation: 8, overflow: 'hidden' },
  mascotImage: { width: 60, height: 60 },

  // Overlays
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  celebrationAnimation: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  trophyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  trophyAnimation: {
    width: 200,
    height: 200,
  },
  celebrationText: {
    alignItems: 'center',
    marginTop: 20,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  celebrationSubtitle: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: '600',
  },
  celebrationCoinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  
  // Generic Utilities
  mainContent: { flex: 1 },
  learningPathWrapper: { 
    flex: 1, 
    marginTop: 0,
  },
  compactCardContainer: {
    paddingHorizontal: 12,
    marginTop: 8,
    position: 'relative',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flyingXP: {
    position: 'absolute',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flyingXPGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  flyingXPText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
  },
  flyingCoinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionHeading: {
    // Use Material 3 headlineMedium
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 36,
    letterSpacing: 0,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    marginTop: 8,
    marginHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
    letterSpacing: 1.2,
    marginLeft: 4,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  gameHubBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  gameHubContent: {
    width: '100%',
    borderRadius: 28,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
  },
  gameHubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  gameHubTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '800',
  },
  gameHubSubtitle: {
    color: '#475569',
    fontSize: 13,
    marginBottom: 18,
    lineHeight: 18,
  },
  gameHubDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  gameHubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 12,
  },
  skeletonLearningCard: {
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  gameIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gameText: {
    flex: 1,
  },
  gameCardTitle: {
    color: '#0F172A',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
  },
  gameCardSubtitle: {
    color: '#475569',
    fontSize: 12,
    marginTop: 2,
  },
  missionReminderCard: {
    marginHorizontal: 24,
    marginTop: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(0,212,199,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  missionReminderGlow: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,212,199,0.35)',
    opacity: 0.5,
  },
  missionReminderTitle: {
    color: '#0F172A',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  missionReminderHeadline: {
    color: '#00D4C7',
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
  missionReminderCopy: {
    color: '#475569',
  },

  currentAffairCard: {
    marginTop: 12,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  currentAffairHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentAffairTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 212, 199, 0.08)',
  },
  currentAffairTagText: {
    color: '#00D4C7',
    fontWeight: '700',
    fontSize: 11,
  },
  currentAffairRefresh: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  currentAffairHeadline: {
    color: '#0F172A',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  currentAffairSummary: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
  currentAffairMeta: {
    color: '#94A3B8',
    fontSize: 11,
  },
  currentAffairButton: {
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentAffairButtonText: {
    color: '#334155',
    fontWeight: '700',
  },
  whatsAppBanner: {
    marginTop: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  whatsAppBannerTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
  },
  whatsAppBannerCopy: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 16,
  },
  whatsAppBannerButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  whatsAppBannerButtonText: {
    color: '#00D4C7',
    fontWeight: '700',
    fontSize: 12,
  },
  arenaPremiumCard: {
    marginHorizontal: 0,
    marginTop: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    backgroundColor: '#FFFFFF',
    shadowColor: '#00D4C7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  arenaPremiumInner: {
    padding: 20,
    gap: 12,
  },
  arenaPremiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  arenaPremiumIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 212, 199, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arenaPremiumTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  arenaPremiumSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: -2,
  },
  arenaPremiumCopy: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter-Medium',
    color: '#475569',
  },
  arenaPremiumFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  arenaPremiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 212, 199, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  arenaPremiumBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#00D4C7',
  },
  arenaPremiumCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  arenaPremiumCtaText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#00D4C7',
    letterSpacing: 0.5,
  },

  // Skeleton Loader Styles
  skeletonWrapper: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 18,
  },
  skeletonHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 18,
  },
  skeletonHeaderTiny: {
    width: 96,
    height: 11,
    borderRadius: 8,
    marginBottom: 8,
  },
  skeletonHeaderTitle: {
    width: 132,
    height: 20,
    borderRadius: 10,
  },
  skeletonIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  skeletonXPBar: {
    width: 118,
    height: 26,
    borderRadius: 16,
  },
  skeletonQuotaRow: {
    alignItems: 'flex-end',
  },
  skeletonQuotaPill: {
    width: 150,
    height: 24,
    borderRadius: 14,
  },
  skeletonMissionCard: {
    borderRadius: 26,
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    gap: 12,
    ...V2026.shadows.milky,
  },
  skeletonMissionPretitle: {
    width: 90,
    height: 10,
    borderRadius: 6,
  },
  skeletonMissionTitle: {
    width: '80%',
    height: 18,
    borderRadius: 10,
  },
  skeletonMissionMetaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  skeletonMissionMetaShort: {
    width: 60,
    height: 12,
    borderRadius: 10,
  },
  skeletonMissionMetaLong: {
    width: 110,
    height: 12,
    borderRadius: 10,
  },
  skeletonMissionDesc: {
    width: '90%',
    height: 12,
    borderRadius: 8,
  },
  skeletonMissionSubtitle: {
    width: '85%',
    height: 14,
    borderRadius: 8,
  },
  skeletonMissionFooter: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonRewardChip: {
    width: 90,
    height: 32,
    borderRadius: 16,
  },
  skeletonPrimaryButton: {
    width: 150,
    height: 40,
    borderRadius: 20,
  },
  skeletonDailyCard: {
    width: '100%',
    height: 110,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    ...V2026.shadows.milky,
  },
  skeletonToolsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  skeletonToolCard: {
    flex: 1,
    height: 132,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  skeletonMindClash: {
    width: '100%',
    height: 170,
    borderRadius: 24,
    marginTop: -4,
    marginBottom: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  skeletonMindClashBase: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  skeletonMindClashTagWrap: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  skeletonMindClashTag: {
    width: 140,
    height: 18,
    borderRadius: 12,
  },
  skeletonMindClashButtonWrap: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  skeletonMindClashButton: {
    width: 160,
    height: 36,
    borderRadius: 999,
  },
  skeletonSectionHeader: {
    marginTop: 4,
  },
  skeletonSectionLabel: {
    width: 140,
    height: 14,
    borderRadius: 8,
  },
  skeletonTimelineWrapper: {
    gap: 20,
    paddingBottom: 40,
  },
  skeletonTimelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  skeletonTimelineGutter: {
    width: 28,
    alignItems: 'center',
  },
  skeletonTimelineNode: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  skeletonTimelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 6,
    marginBottom: -6,
    alignSelf: 'center',
  },
  skeletonLessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skeletonLessonIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
  },
  skeletonLessonTitle: {
    width: '80%',
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  skeletonLessonLine: {
    width: '60%',
    height: 10,
    borderRadius: 6,
  },
  skeletonLessonLineWide: {
    width: '72%',
    height: 10,
    borderRadius: 6,
  },
  shimmerBase: {
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  shimmerHighlightContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.2,
  },
  arenaWrapper: {
    marginTop: 24,
    marginBottom: 32,
  },
  arenaCard: {
    borderRadius: 28,
    padding: 1.5,
    backgroundColor: 'rgba(0, 212, 199, 0.15)',
    overflow: 'hidden',
    shadowColor: '#00D4C7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  arenaInner: {
    width: '100%',
    height: 130,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 12,
  },
  arenaDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  arenaEnterBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#00D4C7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 10,
  },
  arenaEnterGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    overflow: 'hidden',
  },
  arenaEnterText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  arenaGlowEffect: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 212, 199, 0.08)',
  },
  arenaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  arenaIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 212, 199, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arenaTitle: {
    fontSize: 19,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  arenaSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: -2,
  },
  arenaAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  arenaActionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#00D4C7',
  },
  sectionSeparatorContainer: {
    paddingHorizontal: 40,
    marginTop: 12,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separatorLine: {
    width: '100%',
    height: 1,
    opacity: 0.8,
  },
  v2026Header: {
    paddingHorizontal: 0,
    width: '100%',
    marginBottom: 8,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 2,
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerDivider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
    marginTop: 10,
  },
  headerXpWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerRightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  handwaveLottie: {
    width: 38,
    height: 38,
  },
  forhomeLottie: {
    width: 48,
    height: 48,
    marginRight: -10,
  },
  skeletonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  skeletonLottie: {
    width: 250,
    height: 250,
  },
  skeletonText: {
    marginTop: 20,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    textAlign: 'center',
  },
  avatarMini: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#00D4C7',
  },
  greetingText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userNameText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    marginTop: -2,
  },

  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  kuralCard: {
    width: '100%',
    borderRadius: V2026.radius.lg,
    padding: 16,
    backgroundColor: V2026.colors.surface,
    borderWidth: 1.5,
    borderColor: V2026.colors.border,
    ...V2026.shadows.milky,
    overflow: 'hidden',
  },
  kuralHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  kuralBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  },
  kuralBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    letterSpacing: 0.6,
  },
  kuralNumber: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#475569',
  },
  kuralGrid: {
    gap: 6,
  },
  kuralLine: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#0F172A',
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  kuralLinePremium: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.4,
    color: '#0F172A',
    textShadowColor: 'rgba(0,0,0,0.04)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0.5,
  },
  kuralLineMuted: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    fontStyle: 'italic',
  },
  kuralFooter: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kuralFooterText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#475569',
    textTransform: 'capitalize',
  },
  pathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  pathTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#00D4C7',
  },
  pathContainer: {
    width: '100%',
    minHeight: 300,
  },
  stateRankCard: {
    marginTop: 12,
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  stateRankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stateRankLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 1.3,
    color: '#94A3B8',
  },
  stateRankTitle: {
    marginTop: 4,
    fontSize: 19,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  stateRankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 212, 199, 0.10)',
  },
  stateRankBadgeText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#00D4C7',
  },
  stateRankCopy: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  stateRankFooter: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stateRankXp: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  stateRankCta: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#00D4C7',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  thiruEtherealContainer: {
    marginHorizontal: 8,
    marginTop: 36,
    marginBottom: 36,
    alignItems: 'center',
    position: 'relative',
  },
  thiruEtherealQuoteIcon: {
    marginBottom: 4,
    opacity: 0.6,
  },
  thiruEtherealNumber: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  thiruEtherealLines: {
    alignItems: 'center',
    gap: 4,
    position: 'relative',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  thiruEtherealQuoteMark: {
    fontSize: 48,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: 'rgba(51, 65, 85, 0.2)',
    position: 'absolute',
    lineHeight: 48,
  },
  thiruEtherealText: {
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontStyle: 'italic',
    color: '#334155',
    lineHeight: 22,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  kuralLanguageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  kuralLanguageChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  kuralLanguageChipActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.28)',
  },
  kuralLanguageText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  kuralLanguageTextActive: {
    color: '#10B981',
  },
  kuralMeaningBox: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  kuralMeaningLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#0F766E',
    marginBottom: 4,
  },
  kuralMeaningText: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    color: '#475569',
    fontFamily: 'Inter-Medium',
  },
  toolsSection: {
    marginTop: 28,
    marginBottom: 6,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  toolInner: {
    padding: 16,
    borderRadius: 24,
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  toolIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  toolSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    lineHeight: 16,
  },
  toolWrapper: {
    marginBottom: 12,
  },
  toolsSeparatorLineWrapper: {
    marginTop: 8,
    marginHorizontal: 4,
  },
  toolsSeparatorLine: {
    height: 1,
    borderRadius: 1,
  },
  v2026Celebration: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 10000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationTextV2: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    marginTop: 20,
  },
  celebrationXPV2: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#FFD76F',
    marginTop: 8,
  },
  // Enhanced Mission Card Styles
  // Ã°Å¸â€œÂ¡ V2026 SEXY MISSION CARD STYLES
  proCardContainer: {
    width: '100%',
    borderRadius: 28,
    padding: 0,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  proCardGlowBorder: {
    position: 'absolute',
    width: '300%',
    height: '300%',
    top: '-100%',
    left: '-100%',
  },
  proMeshOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  meshOrb1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#1695fd', // from mind2025 theme
    top: -40,
    left: -30,
  },
  meshOrb2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#023480', // from mind2025 theme
    bottom: -60,
    right: -30,
  },
  proContent: {
    borderRadius: 26,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    flexDirection: 'column',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  proHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  proMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  proDayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  proDayText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  proPhaseText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  proTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    lineHeight: 26,
  },
  proDescription: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#475569',
    lineHeight: 19,
    marginTop: 8,
  },
  timerBadgeV2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(244, 63, 94, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.1)',
  },
  timerText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#F43F5E',
  },
  proFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.04)',
    marginTop: 6,
  },
  rewardValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 212, 199, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  rewardText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#0D9488',
  },
  missionActionButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...V2026.shadows.milky,
  },
  missionActionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
  },
  ambientGlow: {
    position: 'absolute',
    top: -SCREEN_WIDTH * 0.4,
    left: -SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH * 1.2,
    height: SCREEN_WIDTH * 1.2,
    backgroundColor: '#E0F2FE', 
    borderRadius: SCREEN_WIDTH,
    opacity: 0.12,
  },
  ambientGlowSecondary: {
    position: 'absolute',
    bottom: -SCREEN_WIDTH * 0.4,
    right: -SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH * 1.0,
    height: SCREEN_WIDTH * 1.0,
    backgroundColor: '#FDE68A',
    borderRadius: SCREEN_WIDTH,
    opacity: 0.08,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    borderRadius: 999,
  },
});

interface UserProgressData {
  completedLessons: string[];
  currentUnit: number;
  currentLesson: string;
  totalXP: number;
  streak: number;
  dailyDoseCompleted: boolean;
  dailySnackCompleted: boolean;
  lastSeen: string;
  unlockedUnits: number[];
}

interface FlyingXPItem {
  id: number;
  amount: number;
  startPosition: { x: number; y: number };
}

interface PathLesson {
  id: string;
  title: string;
  subtitle: string;
  topicTitle: string;
  topicId: string;
  description: string;
  xp: number;
  completed: boolean;
  current: boolean;
  locked: boolean;
  status: string;
  unit: number;
  section: number;
  topicColor: string;
  topicSubject: string;
  route: string;
  priority: number;
  isChest: boolean;
  topicIndex: number;
  lessonIndexInTopic: number;
  isFirstInTopic: boolean;
  isLastInTopic: boolean;
  subtopicId?: string;
}
// Ambient Particles Component for Alive World Feeling
const AmbientParticles = () => {
  // Use stable particle configs
  const particles = useMemo(() => Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    initialX: Math.random() * SCREEN_WIDTH,
    initialY: Math.random() * SCREEN_HEIGHT,
    scale: 0.2 + Math.random() * 0.4,
    speed: 12000 + Math.random() * 12000,
    color: ['#00D4C7', '#00D4C7', '#FFD76F', '#FFFFFF'][i % 4],
    size: 4 + Math.random() * 4,
  })), []);

  return (
    <View style={styles.particlesContainer} pointerEvents="none">
      {particles.map((p, idx) => {
        const { id, ...rest } = p;
        return <Particle key={`p-${idx}`} {...rest} />;
      })}
    </View>
  );
};

// Individual Particle for smooth independent lifecycle
const Particle = ({ initialX, initialY, scale, speed, color, size }: any) => {
  const translateY = useRef(new Animated.Value(initialY)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 0.4 + Math.random() * 0.4,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    const loop = () => {
      translateY.setValue(SCREEN_HEIGHT + 50);
      Animated.timing(translateY, {
        toValue: -50,
        duration: speed,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(loop);
    };

    const remainingDistance = initialY + 50;
    const totalDistance = SCREEN_HEIGHT + 100;
    const firstDuration = (remainingDistance / totalDistance) * speed;

    Animated.timing(translateY, {
      toValue: -50,
      duration: firstDuration,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(loop);
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: initialX,
          width: size,
          height: size,
          backgroundColor: color,
          shadowColor: color,
          transform: [{ translateY }, { scale }],
          opacity: opacity
        }
      ]}
    />
  );
};

// Enhanced Power Action Button
interface PowerActionButtonProps {
  icon: string;
  onPress: () => void;
}

const PowerActionButton = ({ icon, onPress }: PowerActionButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 8,
      tension: 400,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 400,
      useNativeDriver: true,
    }).start();
  };
  
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View style={styles.proActionButton}>
          <FontAwesome5 name={icon} size={16} color="#FFFFFF" solid />
        </View>

      </Animated.View>
    </TouchableOpacity>
  );
};

// Flying XP Animation Component
interface FlyingXPProps {
  amount: number;
  startPosition: { x: number; y: number };
  onComplete: () => void;
}

const FlyingXP = ({ amount, startPosition, onComplete }: FlyingXPProps) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -80,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: Math.random() * 40 - 20,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.2, duration: 200, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.8, duration: 1000, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.delay(800),
        Animated.timing(opacity, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
    ]).start(() => {
      if (onComplete) onComplete();
    });
  }, []);
  
  return (
    <Animated.View
      style={[
        styles.flyingXP,
        {
          left: startPosition?.x || SCREEN_WIDTH / 2,
          top: startPosition?.y || SCREEN_HEIGHT / 2,
          transform: [{ translateX }, { translateY }, { scale }],
          opacity,
        }
      ]}
      pointerEvents="none"
    >
      <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.flyingXPGradient}>
        <View style={styles.flyingCoinContainer}>
          <FontAwesome5 name="coins" size={12} color="#F1F5F9" solid />
          <Text style={styles.flyingXPText}>+{amount}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const ShimmerBlock = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

// Ã°Å¸â€ºÂ¸ Sexy V2026 Mission Card
const cleanMissionTitle = (title?: string) => {
  const value = String(title || '').replace(/\s+/g, ' ').trim();
  return value.replace(/\s*\((?:Days?|Day)\s+\d+\s*(?:[-â€“]\s*\d+)?\)\s*$/i, '').trim();
};

const CompactTopicCard = ({ lesson, locked, countdownLabel, onStart, isLoading }: { lesson: any, locked: boolean, countdownLabel: string, onStart: (lesson: any) => void, isLoading?: boolean }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const meshAnim = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Halo Rotation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Mesh Flow
    Animated.loop(
      Animated.sequence([
        Animated.timing(meshAnim, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(meshAnim, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    // Pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, { toValue: 1.015, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseScale, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const orb1TranslateX = meshAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 18]
  });

  const orb2TranslateY = meshAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [11, -11]
  });

  if (isLoading) {
    return (
      <View style={styles.proCardContainer}>
        <View style={styles.proContent}>
          <View style={styles.proHeaderRow}>
            <ShimmerBlock style={{ width: '80%', height: 22, borderRadius: 6, marginBottom: 8 }} />
            <ShimmerBlock style={{ width: '40%', height: 16, borderRadius: 4 }} />
          </View>
          <View style={styles.proFooter}>
            <ShimmerBlock style={{ width: 60, height: 18, borderRadius: 4 }} />
            <ShimmerBlock style={{ width: 110, height: 36, borderRadius: 18 }} />
          </View>
        </View>
      </View>
    );
  }

  const accentColor = lesson?.topicColor || '#00D4C7';
  const displayTitle = cleanMissionTitle(lesson?.title || 'Daily Lesson');
  const missionMetaText = lesson?.subtitle || '';
  const missionMetaParts = missionMetaText.includes('Ã¢â‚¬Â¢')
    ? missionMetaText.split('Ã¢â‚¬Â¢').map((part: string) => part.trim())
    : missionMetaText.split('â€¢').map((part: string) => part.trim());
  const missionDayMeta = missionMetaParts[0] || 'Daily Lesson';
  const missionDescription = lesson?.description || '';

  return (
    <View style={styles.proCardContainer}>
      <View style={styles.proContent}>
        {/* Ã°Å¸Â§Â¬ Animated Mesh Background Orbs */}
        <View style={styles.proMeshOverlay} pointerEvents="none">
          <Animated.View style={[styles.meshOrb1, { transform: [{ translateX: orb1TranslateX }] }]} />
          <Animated.View style={[styles.meshOrb2, { transform: [{ translateY: orb2TranslateY }] }]} />
        </View>

        {/* Ã°Å¸â€œâ€¹ Modern Bento Content */}
        <View style={styles.proHeaderRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.proMetaRow}>
              <View style={[styles.proDayPill, { borderColor: `${accentColor}55`, backgroundColor: `${accentColor}14` }]}>
                <Ionicons name="calendar-clear-outline" size={12} color={accentColor} />
                <Text style={[styles.proDayText, { color: accentColor }]}>{missionDayMeta}</Text>
              </View>
            </View>
            <Text style={styles.proTitle} numberOfLines={4}>
              {locked ? 'Upcoming Lesson' : displayTitle}
            </Text>
            {!!missionDescription && (
              <Text style={styles.proDescription} numberOfLines={3}>
                {missionDescription}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.proFooter}>
          <View style={styles.rewardValueRow}>
            <Ionicons name="flash" size={16} color="#00D4C7" />
            <Text style={styles.rewardText}>{lesson?.xp || 50} XP</Text>
          </View>

          <TouchableOpacity 
            onPress={() => onStart(lesson)} 
            style={[styles.missionActionButton, locked && { opacity: 0.4, backgroundColor: '#94A3B8', shadowOpacity: 0 }]} 
            activeOpacity={1}
            disabled={locked}
          >
            <Text style={styles.missionActionButtonText}>{locked ? 'Lesson Locked' : 'Start Lesson'}</Text>
            <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const DailyCurrentAffairCard = ({
  loading,
  affair,
  status,
  onRefresh,
  onSend,
}: {
  loading: boolean;
  affair: CurrentAffair | null;
  status: 'idle' | 'sending' | 'sent' | 'error';
  onRefresh: () => void;
  onSend: () => void;
}) => {
  if (!affair) return null;
  const dateLabel = new Date(affair.updatedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  const sendLabel =
    status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent to WhatsApp' : status === 'error' ? 'Retry' : 'Send to WhatsApp';

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8FAFC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.currentAffairCard}
    >
      <View style={styles.currentAffairHeader}>
        <View style={styles.currentAffairTag}>
          <FontAwesome5 name="globe-asia" size={10} color={'#00D4C7'} />
          <Text style={[styles.currentAffairTagText, { fontFamily: 'Inter-SemiBold' }]}>{affair.tag || 'National'}</Text>
        </View>
        <TouchableOpacity onPress={onRefresh} activeOpacity={1} style={styles.currentAffairRefresh}>
          {loading ? (
            <ActivityIndicator color="#64748B" size="small" />
          ) : (
            <Ionicons name="refresh" size={18} color="#64748B" />
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.currentAffairHeadline}>{affair.headline}</Text>
      <Text style={styles.currentAffairSummary}>{affair.summary}</Text>
      <Text style={styles.currentAffairMeta}>Updated {dateLabel}</Text>
      <TouchableOpacity
        style={[
          styles.currentAffairButton,
          status === 'sent' && { backgroundColor: 'rgba(0, 212, 199, 0.08)', borderColor: 'rgba(0, 212, 199, 0.2)' },
        ]}
        activeOpacity={1}
        onPress={onSend}
        disabled={status === 'sending'}
      >
        {status === 'sending' ? (
          <ActivityIndicator color="#64748B" />
        ) : (
          <>
            <Ionicons
              name="logo-whatsapp"
              size={16}
              color={status === 'sent' ? '#00D4C7' : '#64748B'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.currentAffairButtonText,
                { fontFamily: 'Inter-SemiBold', color: status === 'sent' ? '#00D4C7' : '#334155' },
              ]}
            >
              {sendLabel}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

const WhatsAppSyncBanner = ({
  status,
  onShare,
}: {
  status: 'idle' | 'sending' | 'sent' | 'error';
  onShare: () => void;
}) => {
  const label =
    status === 'sending' ? 'Sharing...' : status === 'sent' ? 'Shared today' : status === 'error' ? 'Retry share' : 'Send summary';
  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8FAFC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.whatsAppBanner}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={styles.whatsAppBannerTitle}>Sync with WhatsApp</Text>
        <Text style={styles.whatsAppBannerCopy}>Get a clean summary of todayâ€™s work delivered to your WhatsApp.</Text>
      </View>
      <TouchableOpacity
        style={styles.whatsAppBannerButton}
        onPress={onShare}
        activeOpacity={1}
        disabled={status === 'sending'}
      >
        {status === 'sending' ? (
          <ActivityIndicator color="#00D4C7" />
        ) : (
          <Text style={styles.whatsAppBannerButtonText}>{label}</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};


const HomePremiumBackground = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <LinearGradient
      colors={['#F8FAFC', '#FFFFFF', '#EEF7F2']}
      locations={[0, 0.52, 1]}
      style={StyleSheet.absoluteFill}
    />
    <View style={styles.homeBandTop} />
    <View style={styles.homeBandMid} />
    <View style={styles.homeBandBottom} />
    <View style={styles.homeGridPanel}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={`home-grid-h-${i}`} style={[styles.homeGridLineH, { top: 18 + i * 28 }]} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <View key={`home-grid-v-${i}`} style={[styles.homeGridLineV, { left: `${18 + i * 20}%` }]} />
      ))}
    </View>
  </View>
);

const HomeSkeleton = () => (
  <View style={styles.skeletonWrapper}>
    <View style={styles.skeletonHeaderRow}>
      <View>
        <ShimmerBlock style={styles.skeletonHeaderTiny} />
        <ShimmerBlock style={styles.skeletonHeaderTitle} />
      </View>
      <ShimmerBlock style={styles.skeletonXPBar} />
    </View>

    <ShimmerBlock style={styles.skeletonSectionLabel} />
    <View style={styles.skeletonMissionCard}>
      <ShimmerBlock style={styles.skeletonMissionPretitle} />
      <ShimmerBlock style={styles.skeletonMissionTitle} />
      <View style={styles.skeletonMissionMetaRow}>
        <ShimmerBlock style={styles.skeletonMissionMetaShort} />
        <ShimmerBlock style={styles.skeletonMissionMetaLong} />
      </View>
      <ShimmerBlock style={styles.skeletonMissionDesc} />
      <ShimmerBlock style={styles.skeletonMissionSubtitle} />
      <View style={styles.skeletonMissionFooter}>
        <ShimmerBlock style={styles.skeletonRewardChip} />
        <ShimmerBlock style={styles.skeletonPrimaryButton} />
      </View>
    </View>

    <ShimmerBlock style={styles.skeletonSectionLabel} />
    <View style={styles.skeletonToolsGrid}>
      <ShimmerBlock style={styles.skeletonToolCard} />
      <ShimmerBlock style={styles.skeletonToolCard} />
    </View>

    <ShimmerBlock style={styles.skeletonDailyCard} />
    <ShimmerBlock style={styles.skeletonSectionLabel} />
    <View style={styles.skeletonTimelineWrapper}>
      {[0, 1, 2].map((i) => (
        <View key={`sk-row-${i}`} style={styles.skeletonTimelineRow}>
          <View style={styles.skeletonTimelineGutter}>
            <ShimmerBlock style={styles.skeletonTimelineNode} />
            {i < 2 && <View style={styles.skeletonTimelineLine} />}
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.skeletonLessonHeader}>
              <ShimmerBlock style={styles.skeletonLessonIcon} />
              <View style={{ flex: 1 }}>
                <ShimmerBlock style={styles.skeletonLessonTitle} />
                <ShimmerBlock style={styles.skeletonLessonLine} />
              </View>
            </View>
            <ShimmerBlock style={styles.skeletonLessonLineWide} />
          </View>
        </View>
      ))}
    </View>
  </View>
);

// Global cache to prevent skeleton on tab switch
let globalExamTopicsCache: any[] = [];
let globalInitialLoadingFinished = false;

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

function MindGainsHomePage({ showLearningPath = false }: MindGainsHomePageProps) {
  const router = useRouter();
  const { user } = useAuthContext();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const streakNavTimeoutRef = useRef<any>(null);
  const streakNavInFlightRef = useRef(false);
  
  // Local state for path visibility (to allow toggling)
  const [isPathVisible, setIsPathVisible] = useState(showLearningPath);

  // Check if this is the first visit to streak page today
  const checkFirstStreakPageVisitToday = async () => {
    try {
      const today = new Date().toDateString();
      const lastVisit = await AsyncStorage.getItem('lastStreakPageVisit');
      
      return !lastVisit || lastVisit !== today;
    } catch (error) {
      return true; // Default to showing if error
    }
  };

  // Play daystreak sound
  const playDaystreakSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/daystreak.mp3')
      );
      await sound.playAsync();
      // Unload sound from memory after playing
      setTimeout(() => {
        sound.unloadAsync();
      }, 3000);
    } catch (error) {
      console.log('Error playing daystreak sound:', error);
    }
  };

  const playLessonCelebrationSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/xpcollect.mp3')
      );
      await sound.playAsync();
      await sound.unloadAsync();
    } catch (error) {
      console.log('Error playing lesson celebration sound:', error);
    }
  };

  // Show streak celebration on homepage then navigate
  const showStreakCelebration = async (streakCount: number) => {
    setCelebrationStreak(streakCount);
    setCelebrationXP(0);
    setCelebrationMessage('STREAK SECURED!');
    setShowCelebration(true);
    playDaystreakSound();
    
    Animated.parallel([
      Animated.spring(celebrationScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true
      }),
      Animated.timing(celebrationOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      })
    ]).start(() => {
      // Hide celebration and navigate to streak page
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(celebrationScale, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true
          }),
          Animated.timing(celebrationOpacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true
          })
        ]).start(() => {
          setShowCelebration(false);
          // Navigate to streak page after celebration
          UniversalNavigation.navigateTo('/(tabs)/streak');
        });
      }, 3000); // Show for 3 seconds
    });
  };

  // animations
  const pathGlowAnim = useRef(new Animated.Value(0)).current;
  const currentLessonPulse = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Celebration overlay animations
  const celebrationScale = useRef(new Animated.Value(0)).current;
  const celebrationOpacity = useRef(new Animated.Value(0)).current;

  // state
  const [refreshing, setRefreshing] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<PathLesson | null>(null);
  const [bubblePosition, setBubblePosition] = useState({ x: SCREEN_WIDTH * 0.12, y: SCREEN_HEIGHT * 0.28 });
  const [topicCardExpanded, setTopicCardExpanded] = useState(false);
  
  // Celebration state for homepage animations
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationXP, setCelebrationXP] = useState(0);
  const [celebrationStreak, setCelebrationStreak] = useState<number | null>(null);
  const [celebrationMessage, setCelebrationMessage] = useState('Excellent Work!');
  const [animatingXP, setAnimatingXP] = useState(false);
  


  // Flying XP animations state
  const [flyingXPList, setFlyingXPList] = useState<FlyingXPItem[]>([]);
  const [showGameHub, setShowGameHub] = useState(false);
  
  // Lesson quota for tier limits
  const [lessonQuota, setLessonQuota] = useState({ remaining: 1, total: 1, tier: 'free' as 'free' | 'pro' | 'premium' });
  const [lessonQuotaLoaded, setLessonQuotaLoaded] = useState(false);

  const [missionSummary, setMissionSummary] = useState({
    dayNumber: 1,
    title: 'Daily Lesson',
    progressPhase: 1,
    locked: false,
    loading: true,
  });
  const [missionNowTick, setMissionNowTick] = useState(Date.now());
  const [stateRankSnapshot, setStateRankSnapshot] = useState<{
    state: string;
    rank: number;
    xp: number;
  } | null>(null);
  const [selectedKuralLanguage, setSelectedKuralLanguage] = useState<KuralLanguage>('ta');
  
  const loadLessonQuota = async () => {
    setLessonQuotaLoaded(false);
    try {
      const stats = await RewardService.getUserStats();
      if (stats) {
        const { TIER_LIMITS } = require('@/services/rewardService');
        const limit = TIER_LIMITS[stats.subscription_tier].lessons;
        const used = stats.lessons_unlocked_today || 0;
        setLessonQuota({ remaining: Math.max(0, limit - used), total: limit, tier: stats.subscription_tier });
        setLessonQuotaLoaded(true);
      }
    } catch (e) {
      console.error('Failed to load lesson quota:', e);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadDailyMission = async () => {
      if (!user?.id) return;
      setMissionSummary((prev) => ({ ...prev, loading: true }));
      const protocolRow = await getUserProtocol(user.id);
      const synced = await syncProtocolForToday(user.id, protocolRow);
      if (!isMounted) return;
      if (!synced.protocol) {
        setMissionSummary((prev) => ({ ...prev, loading: false, locked: true }));
        return;
      }
      if (synced.locked) {
        setMissionSummary({
          dayNumber: synced.protocol.current_day_number || 1,
          title: 'Daily Lesson',
          progressPhase: synced.protocol.progress_phase || 1,
          locked: true,
          loading: false,
        });
        return;
      }
      const { payload, topicTitle } = await getMissionPayload(
        synced.protocol.track_id,
        synced.protocol.current_day_number
      );
      if (!isMounted) return;
      setMissionSummary({
        dayNumber: synced.protocol.current_day_number || 1,
        title: topicTitle || payload?.topic_title || 'Daily Lesson',
        progressPhase: synced.protocol.progress_phase || 1,
        locked: false,
        loading: false,
      });
    };
    loadDailyMission();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    const timer = setInterval(() => setMissionNowTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Animation refs for celebration
  const trophyOpacity = useRef(new Animated.Value(0)).current;
  const trophyScale = useRef(new Animated.Value(0.5)).current;
  const xpCounterAnim = useRef(new Animated.Value(0)).current;

  // Use real database stats for MG tokens and streak
  const { userStats, totalMGTokens, currentStreak: dbStreak, refreshStats, loading: statsLoading } = useUserStats();
  
  const [currentXP, setCurrentXP] = useState(() => {
    // Initialize from cached data if available
    if (!user?.id) return 0;
    // You could expand this to check cached progress data
    return 0;
  });
  const [currentStreak, setCurrentStreak] = useState(() => {
    if (!user?.id) return 0;
    const cached = StreakCache.getCachedStreakSync ? StreakCache.getCachedStreakSync() : null;
    return cached?.userId === user.id ? cached.currentStreak : 0;
  });

  // Update currentXP from database MG tokens
  useEffect(() => {
    if (totalMGTokens !== undefined && totalMGTokens > 0) {
      setCurrentXP(totalMGTokens);
    }
  }, [totalMGTokens, dbStreak, userStats, statsLoading]);

  // Initialize user data on mount
  useEffect(() => {
    const initializeUser = async () => {
      if (user?.id) {
        try {
          await RewardService.initializeUserData();
          loadLessonQuota();
          console.log('Ã¢Å“â€¦ User data initialized for:', user.id);
        } catch (error) {
          console.error('Error initializing user data:', error);
        }
      }
    };

    initializeUser();
  }, [user?.id]);

  const [userProgress, setUserProgress] = useState<UserProgressData>({
    completedLessons: [],
    currentUnit: 1,
    currentLesson: 'daily-dose',
    totalXP: 0,
    streak: 0,
    dailyDoseCompleted: false,
    dailySnackCompleted: false,
    lastSeen: new Date().toDateString(),
    unlockedUnits: [1],
  });

  const [streakModalVisible, setStreakModalVisible] = useState(false);
  const [streakModalMode, setStreakModalMode] = useState<DayStreakMode>('prompt');
  const [streakStatus, setStreakStatus] = useState({
    currentStreak: 0,
    hasDailyDose: false,
    hasDailySnack: false,
    hasRegisteredToday: false,
  });

  // State for Supabase topics
  const [examTopics, setExamTopics] = useState<DatabaseTopic[]>(globalExamTopicsCache);
  const [topicsCache, setTopicsCache] = useState<{ data: DatabaseTopic[]; timestamp: number } | null>(
    globalExamTopicsCache.length > 0 ? { data: globalExamTopicsCache, timestamp: Date.now() } : null
  );
  
  const [streakLoading, setStreakLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(!globalInitialLoadingFinished);
  const [currentAffair, setCurrentAffair] = useState<CurrentAffair | null>(null);
  const [currentAffairLoading, setCurrentAffairLoading] = useState(false);
  const [currentAffairStatus, setCurrentAffairStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [progressShareStatus, setProgressShareStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [showKuralMeaning, setShowKuralMeaning] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  
  const isTester = user?.email === 'ragularvind84@gmail.com' || user?.id === '8a78b8d6-0764-46c8-af3f-68f9cb371a63';

  // Initial load without blocking UI
  useEffect(() => {
    if (user?.id && examTopics.length === 0) {
      // Load data in background without showing loader
      loadTopicsFromSupabase().catch(console.error);
      loadUserData().catch(console.error);
    }
  }, [user?.id]);

  const pathLessons = useMemo<PathLesson[]>(() => {
    const flatItems = [];
    let globalIndex = 0;
    
    examTopics.forEach((topic, topicIndex) => {
      // Track topic start for proper grouping
      const topicStartIndex = flatItems.length;
      
      // Use lessons directly from database instead of subtopics
      const lessons = topic.lessons || [];
      
      // Create lessons from database lessons
      lessons.forEach((lesson, lessonIndex) => {
        const lessonId = lesson.id; // Use real lesson UUID
        
        // Determine lesson status based on user progress
        const isCompleted = userProgress.completedLessons.includes(lessonId);
        
        // Current lesson logic: first non-completed lesson
        const completedCount = userProgress.completedLessons.length;
        const isCurrent = !isCompleted && (globalIndex === completedCount);
        
        // If no lessons completed, first lesson is current
        const isCurrentFirstLesson = completedCount === 0 && globalIndex === 0;
        const finalIsCurrent = isCurrent || isCurrentFirstLesson;
        
        // MASTER UNLOCK for Admin/Tester: ragularvind84@gmail.com
        const isLocked = !isCompleted && !finalIsCurrent && !isTester;

        const statusValue = isCompleted ? 'completed' : (finalIsCurrent ? 'current' : (isTester ? 'current' : 'locked'));

        flatItems.push({
          id: lessonId,
          title: lesson.title,
          subtitle: lesson.subtitle || topic.name,
          topicTitle: topic.name,
          topicId: topic.id,
          description: lesson.description || 'Learn important concepts step by step',
          xp: lesson.xp_reward || 10,
          completed: isCompleted,
          current: finalIsCurrent || (isTester && !isCompleted),
          locked: isLocked,
          status: statusValue,
          unit: Math.floor(topicIndex / 10) + 1,
          section: lessonIndex + 1,
          topicColor: '#00D4C7',
          topicSubject: topic.subject?.name || 'General Studies',
          route: '/study/reading-interface',
          priority: topicIndex + 1,
          isChest: false,
          // Topic grouping info for LearningPathNoSvg
          topicIndex,
          lessonIndexInTopic: lessonIndex,
          isFirstInTopic: lessonIndex === 0,
          isLastInTopic: lessonIndex === lessons.length - 1,
        });
        globalIndex++;
      });
      
    });
    if (flatItems.length === 0) {
      flatItems.push({
        id: 'placeholder',
        title: 'No lessons yet',
        subtitle: 'Create your first topic',
        topicTitle: 'General',
        topicId: 'none',
        description: 'Create your first topic to start learning',
        xp: 0,
        completed: false,
        current: true,
        locked: false,
        status: 'locked',
        unit: 1,
        section: 1,
        topicColor: '#00D4C7',
        topicSubject: 'General',
        route: '',
        priority: 0,
        isChest: false,
        topicIndex: 0,
        lessonIndexInTopic: 0,
        isFirstInTopic: true,
        isLastInTopic: true,
      });
    }
    return flatItems;
  }, [examTopics, userProgress]);

  const currentLesson = pathLessons.find(l => l.status === 'current') || pathLessons[0] || null;
  const isMissionFinished = useMemo(() => missionSummary.progressPhase > 4, [missionSummary.progressPhase]);
  const missionLock = useMemo(() => {
    const label = getMissionCountdown(new Date(missionNowTick));
    return { locked: missionSummary.locked || isMissionFinished, label };
  }, [missionNowTick, missionSummary.locked, isMissionFinished]);

  const missionLesson: PathLesson = useMemo(() => ({
    id: 'daily-mission',
    title: missionSummary.loading ? 'Loading...' : missionSummary.title,
    subtitle: missionLock.locked
      ? (isMissionFinished ? `Complete Ã¢â‚¬Â¢ Next in ${missionLock.label}` : `Unlocks at 6:00 PM Ã¢â‚¬Â¢ ${missionLock.label}`)
      : `Day ${missionSummary.dayNumber}`,
    topicTitle: 'Daily Lesson',
    topicId: 'daily-mission',
    description: '4-step lesson: Quick Notes, Memory Cards, Best Videos, Ranker Quiz.',
    xp: 50,
    completed: false,
    current: true,
    locked: missionLock.locked,
    status: 'current',
    unit: 1,
    section: 1,
    topicColor: '#00D4C7',
    topicSubject: 'Daily Lesson',
    route: '/daily-mission',
    priority: 0,
    isChest: false,
    topicIndex: 0,
  }), [missionSummary, missionLock]);

  const skipNextLoadRef = useRef(false);
  const lastLoadTime = useRef(0);
  const CACHE_DURATION = 15000; // 15 seconds cache for faster updates
  
  // load user data on focus and user change - with smart caching
  useFocusEffect(
    useCallback(() => { 
      const now = Date.now();
      const timeSinceLastLoad = now - lastLoadTime.current;
      
      // Force reload if lesson was just completed
      if (skipNextLoadRef.current) {
        console.log('Ã°Å¸â€â€ž Lesson completed - reloading progress to show unlocked content');
        skipNextLoadRef.current = false;
        lastLoadTime.current = now;
        loadUserData();
        loadTopicsFromSupabase();
        return;
      }
      
      // Skip if recently loaded (within cache duration)
      if (timeSinceLastLoad < CACHE_DURATION) {
        console.log('Ã¢Å¡Â¡ Using cached data - last loaded', Math.round(timeSinceLastLoad/1000), 'seconds ago');
        return;
      }
      
      console.log('Ã°Å¸â€â€ž Cache expired - reloading data');
      lastLoadTime.current = now;
      loadUserData();
      loadTopicsFromSupabase();
    }, [user?.id])
  );
  const loadUserData = async () => {
    try {
      if (!user?.id) return;
      
      // Load progress data from database
      const progress = await LearningProgressService.getUserProgress(user.id);
      if (progress) {
        console.log('Ã°Å¸â€Â DEBUG: Progress data structure:', {
          completedLessons: progress.completedLessons,
          completedLessonsType: typeof progress.completedLessons,
          completedLessonsLength: progress.completedLessons?.length || 0,
          completedLessonsContent: progress.completedLessons
        });
        setUserProgress(progress);
        setCurrentXP(progress.totalXP || 0);
        
        // Also refresh the user stats hook to get latest data
        await refreshStats();
        
        // Update streak if different
        if (progress.streak !== undefined && progress.streak !== currentStreak) {
          setCurrentStreak(progress.streak);
          if (user.id && progress.streak > 0 && StreakCache.cacheStreakData) {
            await StreakCache.cacheStreakData(user.id, {
              currentStreak: progress.streak,
              longestStreak: progress.streak,
              lastActivityDate: new Date().toISOString().split('T')[0],
            });
          }
        }
      }

      // Update daily streak on app entry (first time today)
      if (user?.id) {
        const newStreak = await StreakService.updateStreakOnAppEntry(user.id);
        setCurrentStreak(newStreak);
        
        // Auto-navigate to streak page if it's first visit today and user has a streak
        if (newStreak > 0) {
          const isFirstVisit = await checkFirstStreakPageVisitToday();
          if (isFirstVisit && !streakNavInFlightRef.current) {
            console.log('Ã°Å¸Å½â€° First visit today! Redirecting to streak page...');
            streakNavInFlightRef.current = true;
            try {
              const today = new Date().toDateString();
              await AsyncStorage.setItem('lastStreakPageVisit', today);
            } catch {}
            if (streakNavTimeoutRef.current) {
              clearTimeout(streakNavTimeoutRef.current);
            }
            // Direct redirect to streak page without animation
            streakNavTimeoutRef.current = setTimeout(() => {
              UniversalNavigation.navigateTo('/(tabs)/streak');
              streakNavInFlightRef.current = false;
            }, 800);
          }
        }
      }

      // Also refresh streak status to get latest data  
      await refreshStreakStatus();
      
    } catch (err) {
      console.warn('loadUserData error', err);
    }
  };

  // Track if celebration has been triggered to prevent infinite loop
  const celebrationTriggeredRef = useRef(false);

  useEffect(() => {
    return () => {
      if (streakNavTimeoutRef.current) {
        clearTimeout(streakNavTimeoutRef.current);
      }
    };
  }, []);
  
  // Check for celebration trigger from lesson completion - ONLY ONCE
  useEffect(() => {
    const showCelebrationParam = Array.isArray(params.showCelebration)
      ? params.showCelebration[0]
      : params.showCelebration;
    const xpEarnedParam = Array.isArray(params.xpEarned)
      ? params.xpEarned[0]
      : params.xpEarned;
    const messageParam = Array.isArray(params.celebrationMessage)
      ? params.celebrationMessage[0]
      : params.celebrationMessage;

    if (
      showCelebrationParam === 'true' &&
      xpEarnedParam &&
      !celebrationTriggeredRef.current
    ) {
      celebrationTriggeredRef.current = true;
      const xpAmount = parseInt(xpEarnedParam.toString(), 10) || 0;
      const fallbackMessage =
        (Array.isArray(params.fromLesson) ? params.fromLesson[0] : params.fromLesson) === 'true'
          ? 'Lesson Complete!'
          : 'Excellent Work!';
      const messageToUse = messageParam || fallbackMessage;

      console.log('Ã°Å¸Ââ€  Starting homepage celebration with XP:', xpAmount);

      // Clear params to prevent re-triggering
      router.setParams({
        showCelebration: undefined,
        xpEarned: undefined,
        fromLesson: undefined,
        celebrationMessage: undefined,
      });

      // Start celebration immediately
      startCelebrationSequence(xpAmount, messageToUse);
    }
  }, [params.showCelebration, params.xpEarned, params.celebrationMessage, params.fromLesson]);

  const startCelebrationSequence = async (xpAmount: number, message?: string) => {
    if (!xpAmount || xpAmount <= 0) {
      celebrationTriggeredRef.current = false;
      return;
    }

    setCelebrationXP(xpAmount);
    setCelebrationStreak(null);
    setCelebrationMessage(message || 'Excellent Work!');
    setShowCelebration(true);
    playLessonCelebrationSound();

    try {
      await refreshStats();
    } catch (error) {
      console.log('Error refreshing stats after celebration:', error);
    }
    
    // Store the starting XP before animation
    const startingXP = currentXP;
    const targetXP = startingXP + xpAmount;
    
    // 1. Trophy animation enters
    Animated.parallel([
      Animated.timing(trophyOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(trophyScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();

    // 2. After 1 second, start XP counter
    setTimeout(() => {
      setAnimatingXP(true);
      
      // Reset animation value
      xpCounterAnim.setValue(0);
      
      Animated.timing(xpCounterAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start();

      // Animate XP counter numbers
      const listener = xpCounterAnim.addListener(({ value }) => {
        const animatedXP = Math.floor(startingXP + (xpAmount * value));
        setCurrentXP(animatedXP);
      });

      // 3. After XP animation, hide trophy and trigger lesson unlock
      setTimeout(() => {
        xpCounterAnim.removeListener(listener);
        setAnimatingXP(false);
        setCurrentXP(targetXP); // Set to final value
        
        // Hide trophy
        Animated.parallel([
          Animated.timing(trophyOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(trophyScale, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowCelebration(false);
          // Reset celebration trigger for future use
          celebrationTriggeredRef.current = false;
          // Trigger lesson unlock animation
          triggerLessonUnlockAnimation();
          console.log('Ã°Å¸Å½Å  Celebration sequence complete!');
        });
      }, 2500);
    }, 1000);
  };

  // Trigger Flying XP animation
  const triggerFlyingXP = (amount: number, startPosition: { x: number; y: number }) => {
    const xpId = Date.now() + Math.random();
    const newFlyingXP = {
      id: xpId,
      amount,
      startPosition: startPosition || { x: SCREEN_WIDTH * 0.8, y: 100 }, // Default to XP bar area
    };
    
    setFlyingXPList(prev => [...prev, newFlyingXP]);
    
    // Remove flying XP after animation completes
    setTimeout(() => {
      setFlyingXPList(prev => prev.filter(xp => xp.id !== xpId));
    }, 2000);
  };

  const triggerLessonUnlockAnimation = () => {
    console.log('Ã°Å¸â€â€œ Triggering lesson unlock animation...');
    
    // Haptic feedback for lesson unlock
    HapticService.medium();
    
    // Reload data to recalculate lesson statuses
    loadUserData().then(() => {
      loadTopicsFromSupabase();
      console.log('Ã°Å¸Å½Â¯ Data reloaded - lesson statuses updated');
    });
    
    // Add a subtle pulse effect to the current lesson pulse animation
    Animated.sequence([
      Animated.timing(currentLessonPulse, { 
        toValue: 1.2, 
        duration: 300, 
        useNativeDriver: true 
      }),
      Animated.timing(currentLessonPulse, { 
        toValue: 1, 
        duration: 300, 
        useNativeDriver: true 
      }),
    ]).start();
  };

  const [dailyKural, setDailyKural] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const loadStateSnapshot = async () => {
      if (!user?.id) return;
      try {
        const rankData = await SupabaseService.getUserStateRank(user.id);
        const stateEntry = Array.isArray(rankData) ? rankData[0] : rankData;
        if (!isMounted || !stateEntry) return;
        setStateRankSnapshot({
          state: stateEntry.state || stateEntry.user_state || 'Your State',
          rank: stateEntry.rank || stateEntry.state_rank || 0,
          xp: stateEntry.xp || stateEntry.total_xp || 0,
        });
      } catch (error) {
        if (isMounted) {
          setStateRankSnapshot(null);
        }
      }
    };
    loadStateSnapshot();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Fetch Daily Kural for Homepage
  useEffect(() => {
    const fetchKural = async () => {
      const getFallbackKural = () => ({
        kural_number: 0,
        kural_tamil: 'Daily Kural unavailable',
        meaning_tamil: '',
        meaning_english: '',
        meaning_hi: '',
        meaning_te: '',
        meaning_kn: '',
        meaning_ml: '',
      });
      try {
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const kuralNumber = ((dayOfYear - 1) % 1330) + 1;
        const { data, error } = await supabase
          .from('thirukkural')
          .select('kural_tamil, kural_number, meaning_tamil, meaning_english, meaning_hi, meaning_te, meaning_kn, meaning_ml')
          .eq('kural_number', kuralNumber)
          .maybeSingle();
        if (data && !error) {
          setDailyKural(data);
        } else {
          setDailyKural(getFallbackKural());
        }
      } catch (e) {
        console.warn('Failed to fetch lead Kural', e);
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        setDailyKural(getFallbackKural());
      }
    };
    fetchKural();
  }, []);

  const refreshStreakStatus = useCallback(async () => {
    if (!user?.id) return null;
    try {
      setStreakLoading(true);
      const status = await StreakService.getStreakStatus(user.id);
      if (status && StreakCache.cacheStreakData) {
        await StreakCache.cacheStreakData(user.id, {
          currentStreak: status.currentStreak,
          longestStreak: status.currentStreak,
          lastActivityDate: new Date().toISOString().split('T')[0],
        });
      }
      setStreakStatus({
        currentStreak: status.currentStreak,
        hasDailyDose: status.hasDailyDose,
        hasDailySnack: status.hasDailySnack,
        hasRegisteredToday: status.hasRegisteredToday,
      });
      setCurrentStreak(status.currentStreak);
      setStreakLoading(false);
      return status;
    } catch (err) {
      console.warn('refreshStreakStatus error', err);
      setStreakLoading(false);
      return null;
    }
  }, [user?.id]);

  // Load topics from Supabase with caching
  const loadTopicsFromSupabase = async (forceRefresh = false) => {
    try {
      // Check cache first (10 minutes cache for better performance)
      // Exception: Testers get a much shorter cache (10 seconds) for instant content testing
      const CACHE_DURATION = isTester ? 10 * 1000 : 10 * 60 * 1000;
      const now = Date.now();
      
      if (!forceRefresh && topicsCache && (now - topicsCache.timestamp < CACHE_DURATION)) {
        console.log(`Ã°Å¸Å¡â‚¬ Using cached topics data (${isTester ? 'Tester Mode' : 'Normal'})`);
        setExamTopics(topicsCache.data);
        setInitialLoading(false);
        return;
      }
      
      console.log('Ã°Å¸â€â€ž Loading topics from Supabase...' + (forceRefresh ? ' (force refresh)' : ''));
      
      const topics = await RealDatabaseContentService.getAllTopicsWithSubtopics();
      console.log('Ã¢Å“â€¦ Loaded topics from Supabase:', topics.length);
      
      // Cache the data
      setTopicsCache({ data: topics, timestamp: now });
      setExamTopics(topics);
      globalExamTopicsCache = topics;
      globalInitialLoadingFinished = true;
      setInitialLoading(false);
    } catch (error) {
      console.error('Ã¢ÂÅ’ Error loading topics from Supabase:', error);
      
      // Use cached data as fallback if available
      if (topicsCache) {
        setExamTopics(topicsCache.data);
      } else {
        setExamTopics([]);
      }
      globalInitialLoadingFinished = true;
      setInitialLoading(false);
    }
  };

  // Animations: glow + pulse
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pathGlowAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
      Animated.timing(pathGlowAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.timing(currentLessonPulse, { toValue: 1.08, duration: 1500, useNativeDriver: true }),
      Animated.timing(currentLessonPulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
    ])).start();
  }, []);

  const handleFlip = () => {
    HapticService.selection();
    const nextVal = showKuralMeaning ? 0 : 180;
    Animated.spring(flipAnim, {
      toValue: nextVal,
      friction: 8,
      tension: 15,
      useNativeDriver: true,
    }).start();
    setShowKuralMeaning(!showKuralMeaning);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  const fetchCurrentAffair = useCallback(async () => {
    if (currentAffairLoading || _currentAffairsTableMissing) return;
    setCurrentAffairLoading(true);
    try {
      const { data, error } = await supabase
        .from('current_affairs_daily')
        .select('headline, summary, published_at, tag')
        .order('published_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setCurrentAffair({
          headline: data.headline || 'India Headlines',
          summary: data.summary || 'Your curated brief is ready.',
          updatedAt: data.published_at || new Date().toISOString(),
          tag: data.tag || 'National',
        });
      } else {
        setCurrentAffair({
          headline: 'Digital India Bill clears Parliament',
          summary: 'New framework modernises cyber security, digital signatures, and data-sharing rules.',
          updatedAt: new Date().toISOString(),
          tag: 'Parliament',
        });
      }
      setCurrentAffairStatus('idle');
    } catch (err: any) {
      if (err?.code === 'PGRST205') { _currentAffairsTableMissing = true; } // stop all future requests
      setCurrentAffair({
        headline: 'RBI holds repo rate at 6.5%',
        summary: 'Central bank prioritises inflation control while keeping an accommodative stance on growth.',
        updatedAt: new Date().toISOString(),
        tag: 'Economy',
      });
      setCurrentAffairStatus('idle');
    } finally {
      setCurrentAffairLoading(false);
    }
  }, [currentAffairLoading]);

  useEffect(() => {
    fetchCurrentAffair();
  }, [fetchCurrentAffair]);

  // Handle lesson selection - show as inline lesson card only for unlocked lessons
  const handleLessonPressById = (lessonId: string) => {
    const lesson = pathLessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    // Check if locked
    if (lesson.locked && !isTester) {
      console.log('Ã°Å¸â€â€™ Lesson is locked');
      HapticService.error();
      return;
    }
    
    setSelectedLesson(lesson);
    setBubblePosition({ x: SCREEN_WIDTH * 0.12, y: SCREEN_HEIGHT * 0.28 });
    setBubbleVisible(true);
    // User requested no expansion on selection
    setTopicCardExpanded(false);
  };

  const handleManualOpenLesson = (lessonId: string) => {
    handleLessonPressById(lessonId);
  };

  const todaysLessonTitle = useMemo(
    () => selectedLesson?.title || currentLesson?.title || 'Your mission',
    [selectedLesson?.title, currentLesson?.title],
  );
  const kuralLines = useMemo(() => {
    const raw = dailyKural?.kural_tamil?.trim();
    if (!raw) return [];
    if (raw.includes('\n')) {
      return raw.split('\n').map((line: string) => line.trim()).filter(Boolean).slice(0, 2);
    }
    const words = raw.split(/\s+/).filter(Boolean);
    if (words.length < 7) {
      return [raw];
    }
    return [
      words.slice(0, 4).join(' '),
      words.slice(4, 7).join(' '),
    ];
  }, [dailyKural]);
  const kuralMeaning = useMemo(() => {
    if (!dailyKural) return '';
    const fallbackMeaning = dailyKural.meaning_english || dailyKural.meaning_tamil || '';
    const meaningMap: Record<KuralLanguage, string> = {
      ta: dailyKural.meaning_tamil || fallbackMeaning,
      hi: dailyKural.meaning_hi || fallbackMeaning,
      te: dailyKural.meaning_te || fallbackMeaning,
      kn: dailyKural.meaning_kn || fallbackMeaning,
      ml: dailyKural.meaning_ml || fallbackMeaning,
    };
    return meaningMap[selectedKuralLanguage] || '';
  }, [dailyKural, selectedKuralLanguage]);
  const missionLessonCard = useMemo(
    () => ({
      ...missionLesson,
      title: cleanMissionTitle(missionSummary.title) || "Today's Lesson",
      subtitle: missionLock.locked
        ? (isMissionFinished ? `Complete Ã¢â‚¬Â¢ Next in ${missionLock.label}` : `Unlocks at 6:00 PM Ã¢â‚¬Â¢ ${missionLock.label}`)
        : `Day ${missionSummary.dayNumber}`,
      description: missionSummary.title ? `Full daily mission: ${cleanMissionTitle(missionSummary.title)}` : missionLesson.description,
    }),
    [missionLesson, missionSummary, missionLock, isMissionFinished]
  );

  // Handle lesson completion - update database progress
  const handleLessonComplete = async (lessonId: string, xpEarned: number = 50) => {
    try {
      if (!user?.id) return;
      
      // Update lesson progress in database
      await RewardService.updateLessonProgress(lessonId, 'completed', xpEarned);
      
      // Refresh user stats to update MG tokens display
      await refreshStats();
      
      console.log('Ã¢Å“â€¦ Lesson completed:', lessonId, 'XP:', xpEarned);
    } catch (error) {
      console.error('Error handling lesson completion:', error);
    }
  };

  // starting a lesson -> update progress and navigate (preserve all route logic)
  const handleLessonStart = (lesson: PathLesson) => {
    setBubbleVisible(false);
    
    // Non-blocking progress updates (Fire and Forget)
    if (user?.id) {
      LearningProgressService.updateLessonProgress(user.id, lesson.id, 'started').catch(err => console.warn(err));
      RewardService.updateLessonProgress(lesson.id, 'unlocked', 0).catch(err => console.warn(err));
    }

    // Navigate immediately
    console.log('Ã°Å¸â€œÂ Navigating to lesson intro:', {
      lessonId: lesson.id,
      topicName: lesson.topicTitle,
      topicId: lesson.topicId,
      title: lesson.title
    });
    
    UniversalNavigation.navigateTo({
      pathname: '/study/lesson-intro',
      params: {
        topicId: lesson.topicId,
        topicName: lesson.topicTitle,
        lessonId: lesson.id,
        subtopicId: lesson.subtopicId || undefined,
        subjectName: lesson.topicSubject,
        subject: lesson.topicSubject,
        // Pass rich metadata for intro screen
        lessonTitle: lesson.title, // Explicitly pass lesson title
        description: lesson.description || lesson.subtitle,
        subtitle: lesson.subtitle,
        xp: lesson.xp?.toString() || '50'
      }
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    // Clear AsyncStorage cache to reset to lesson 1
    await ClearProgressCache.resetToLesson1(user?.id || 'guest');
    
    await loadUserData();
    await loadTopicsFromSupabase(true); // Force refresh topics
    await refreshStreakStatus();
    setTimeout(() => setRefreshing(false), 900);
  }, [refreshStreakStatus, user?.id]);

  const sendCurrentAffairToWhatsApp = useCallback(async () => {
    if (!user?.id || !currentAffair || currentAffairStatus === 'sending') return;
    setCurrentAffairStatus('sending');
    try {
      await supabase.functions.invoke('miga_whatsapp_send', {
        body: {
          user_id: user.id,
          delivery_type: 'current_affairs',
          payload: currentAffair,
        },
      });
      HapticService.success();
      setCurrentAffairStatus('sent');
    } catch (err) {
      console.error('Failed to send current affairs to WhatsApp', err);
      setCurrentAffairStatus('error');
    }
  }, [user?.id, currentAffair, currentAffairStatus]);

  const shareProgressToWhatsApp = useCallback(async () => {
    if (!user?.id || progressShareStatus === 'sending') return;
    setProgressShareStatus('sending');
    try {
      const summary = `Today's focus: ${todaysLessonTitle}. Streak: ${currentStreak} day${currentStreak === 1 ? '' : 's'}.`;
      await supabase.functions.invoke('miga_whatsapp_send', {
        body: {
          user_id: user.id,
          delivery_type: 'progress_digest',
          payload: {
            headline: 'MindGains Daily Brief',
            summary,
          },
        },
      });
      HapticService.success();
      setProgressShareStatus('sent');
    } catch (err) {
      console.error('Failed to share progress', err);
      setProgressShareStatus('error');
    }
  }, [user?.id, progressShareStatus, todaysLessonTitle, currentStreak]);

  // Show skeleton loader during initial data loading
  const isLoading = initialLoading;
  const glowScale = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [1, 0.35],
    extrapolate: 'clamp',
  });
  const glowOpacity = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [0.32, 0],
    extrapolate: 'clamp',
  });
  const glowTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -120],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Ã°Å¸Å’Å’ Atmospheric Backdrop */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View
          style={[
            styles.ambientGlow,
            {
              opacity: glowOpacity,
              transform: [{ scale: glowScale }, { translateY: glowTranslateY }],
            },
          ]}
        />
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.12, scale: 1 }}
          transition={{ type: 'timing', duration: 4000, loop: true }}
          style={styles.ambientGlowSecondary}
        />
      </View>

      <HomePremiumBackground />

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: insets.top + 16,
          paddingBottom: 150,
          paddingHorizontal: 20 
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00D4C7" />}
      >
        {isLoading ? (
          <HomeSkeleton />
        ) : (
          <>
        {/* Ã°Å¸Å¡â‚¬ 2026 Floating Header - Premium Grid Style */}
        <View style={styles.v2026Header}>
            <View style={styles.headerLeft}>
              <View>
                <Text style={styles.greetingText}>{getTimeGreeting()}</Text>
                <Text style={styles.userNameText}>{user?.user_metadata?.full_name?.split(' ')[0] || 'Warrior'}</Text>
              </View>
            </View>
            <View style={styles.headerRightContainer}>
              <View style={styles.headerXpWrap}>
                <Enhanced3DXPBar 
                  totalXP={totalMGTokens || currentXP || 0}
                  streak={dbStreak || currentStreak || 0}
                  animated={true}
                  isLoading={statsLoading || streakLoading}
                />
              </View>
            </View>
          <View style={styles.headerDivider} />
        </View>

        <Text style={[styles.sectionTitle, { fontSize: 11, letterSpacing: 1.5, marginBottom: 0, marginTop: 4 }]}>TODAY'S MISSION</Text>

        <View style={[styles.compactCardContainer, { paddingTop: 10 }]}>
          {!missionSummary.loading && (
            <LottieView
              source={require('@/assets/lotties/forhome.json')}
              autoPlay
              loop
              style={{ position: 'absolute', top: -170, right: -100, width: 320, height: 320, zIndex: 10 }}
            />
          )}
          <CompactTopicCard
            lesson={missionLessonCard}
            locked={missionLock.locked}
            countdownLabel={missionLock.label}
            onStart={(lesson) => {
              if (missionLock.locked) return;
              UniversalNavigation.navigateTo(lesson.route || '/daily-mission');
            }}
            isLoading={missionSummary.loading}
          />
        </View>

        <View style={styles.toolsSection}>
          <Text style={[styles.sectionTitle, { fontSize: 11, letterSpacing: 1.5, marginBottom: 12 }]}>STUDY TOOLS</Text>
          <View style={styles.toolsGrid}>
            {studyToolsConfig.map((tool, index) => (
              <View
                key={tool.id}
                style={styles.toolWrapper}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  style={[styles.toolCard, { width: TOOL_CARD_WIDTH }]}
                  onPress={() => router.push(tool.route)}
                >
                  <LinearGradient
                    colors={['#FFFFFF', '#F8FAFC']}
                    style={styles.toolInner}
                  >
                    <LinearGradient
                      colors={tool.gradient}
                      style={styles.toolIcon}
                    >
                      <FontAwesome5 name={tool.icon} size={18} color="#FFF" />
                    </LinearGradient>
                    <Text numberOfLines={1} style={styles.toolTitle}>{tool.title}</Text>
                    <Text numberOfLines={2} style={styles.toolSubtitle}>{tool.subtitle}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={styles.toolsSeparatorLineWrapper}>
            <LinearGradient
              colors={['rgba(0,0,0,0.0)', 'rgba(15, 23, 42, 0.08)', 'rgba(0,0,0,0.0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.toolsSeparatorLine}
            />
          </View>
        </View>

        {stateRankSnapshot && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.stateRankCard}
            onPress={() => UniversalNavigation.navigateTo('/(tabs)/leaderboard')}
          >
            <View style={styles.stateRankHeader}>
              <View>
                <Text style={styles.stateRankLabel}>MY STATE RANK</Text>
                <Text style={styles.stateRankTitle}>{stateRankSnapshot.state}</Text>
              </View>
              <View style={styles.stateRankBadge}>
                <Ionicons name="flag" size={16} color="#00D4C7" />
                <Text style={styles.stateRankBadgeText}>#{stateRankSnapshot.rank || '--'}</Text>
              </View>
            </View>
            <Text style={styles.stateRankCopy}>
              Keep studying to push {stateRankSnapshot.state} higher on the national board.
            </Text>
            <View style={styles.stateRankFooter}>
              <Text style={styles.stateRankXp}>{(stateRankSnapshot.xp || 0).toLocaleString()} XP</Text>
              <Text style={styles.stateRankCta}>Open leaderboard</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ðŸŒŸ Daily Thirukkural (Premium 3D Flip Card Quote) */}
        <View style={styles.thiruEtherealContainer}>
          <View style={styles.thiruEtherealQuoteIcon}>
            <Ionicons name="leaf" size={24} color="#10B981" />
          </View>
          {!dailyKural ? (
            <View style={{ alignItems: 'center', width: '100%', gap: 12 }}>
              <ShimmerBlock style={{ width: 140, height: 12, borderRadius: 4, marginVertical: 4 }} />
              <View style={[styles.thiruEtherealLines, { width: '100%', alignItems: 'center', gap: 8 }]}>
                <ShimmerBlock style={{ width: '85%', height: 18, borderRadius: 4 }} />
                <ShimmerBlock style={{ width: '70%', height: 18, borderRadius: 4 }} />
              </View>
              <View style={{ height: 32 }} />
            </View>
          ) : (
            <>
              <Text style={styles.thiruEtherealNumber}>THIRUKKURAL â€¢ {dailyKural.kural_number}</Text>
              
              {/* 3D Flip Interactive Card Wrapper */}
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={handleFlip}
                style={{ width: '100%', minHeight: 165, position: 'relative', marginTop: 8 }}
              >
                {/* Front Side: Thirukkural Quote Lines */}
                <Animated.View
                  style={[
                    { width: '100%', alignItems: 'center', backfaceVisibility: 'hidden' },
                    { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacity }
                  ]}
                >
                  <View style={styles.thiruEtherealLines}>
                    <Text style={[styles.thiruEtherealQuoteMark, { top: -24, left: -5 }]}>â€œ</Text>
                    {kuralLines.map((line: string, idx: number) => (
                      <Text key={idx} style={styles.thiruEtherealText}>
                        {line.trim()}
                      </Text>
                    ))}
                    <Text style={[styles.thiruEtherealQuoteMark, { bottom: -32, right: -5 }]}>â€</Text>
                  </View>
                </Animated.View>

                {/* Back Side: Reflection / Meaning */}
                <Animated.View
                  style={[
                    StyleSheet.absoluteFillObject,
                    { justifyContent: 'center', alignItems: 'center', backfaceVisibility: 'hidden' },
                    { transform: [{ rotateY: backInterpolate }], opacity: backOpacity }
                  ]}
                >
                  {!!kuralMeaning && (
                    <View style={[styles.kuralMeaningBox, { marginTop: 0, width: '100%', paddingVertical: 18, paddingHorizontal: 16 }]}>
                      <Text style={[styles.kuralMeaningText, { marginTop: 0, fontStyle: 'italic', fontSize: 13, lineHeight: 19 }]}>
                        {kuralMeaning}
                      </Text>
                    </View>
                  )}
                </Animated.View>
              </TouchableOpacity>



              {/* Language Selector (placed below the 3D flip card area for seamless configuration) */}
              <View style={[styles.kuralLanguageRow, { marginTop: 12 }]}>
                {([
                  { id: 'ta', label: 'Tamil' },
                  { id: 'hi', label: 'Hindi' },
                  { id: 'te', label: 'Telugu' },
                  { id: 'kn', label: 'Kannada' },
                  { id: 'ml', label: 'Malayalam' },
                ] as Array<{ id: KuralLanguage; label: string }>).map((lang) => (
                  <TouchableOpacity
                    key={lang.id}
                    activeOpacity={1}
                    onPress={() => {
                      setSelectedKuralLanguage(lang.id);
                    }}
                    style={[
                      styles.kuralLanguageChip,
                      selectedKuralLanguage === lang.id && styles.kuralLanguageChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.kuralLanguageText,
                        selectedKuralLanguage === lang.id && styles.kuralLanguageTextActive,
                      ]}
                    >
                      {lang.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        {/* ðŸ—ºï¸ Study Journey Header */}
        <View style={styles.pathHeader}>
          <Text style={styles.pathTitle}>Mindgames</Text>
          <TouchableOpacity activeOpacity={1} onPress={() => setIsPathVisible(!isPathVisible)}>
            <Ionicons name={isPathVisible ? "chevron-up" : "chevron-down"} size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {isPathVisible && (
          <View style={styles.pathContainer}>
            <CleanLearningPath
              topics={examTopics}
              lessons={pathLessons}
              currentLessonId={currentLesson?.id}
              onOpenLesson={(id: string) => handleLessonPressById(id)}
              onLessonComplete={(id: string, xp: number) => handleLessonComplete(id, xp)}
            />
          </View>
        )}
        
        <View style={styles.arenaWrapper}>
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => UniversalNavigation.navigateTo('/knowledge-heist')}
          >
            <ImageBackground
              source={mindClashBannerImage}
              style={styles.arenaInner}
              imageStyle={{ borderRadius: 20 }}
              resizeMode="cover"
            >
              <View style={styles.arenaDarkOverlay} />
              <ArenaEnterButton />
            </ImageBackground>
          </TouchableOpacity>
        </View>
          </>
        )}
      </Animated.ScrollView>

      {/* Ã°Å¸Å½Â­ Celebration & Modals */}
      <AnimatePresence>
        {showCelebration && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.v2026Celebration}
          >
            <LottieView
              source={require('@/assets/lotties/confetti.json')}
              autoPlay
              loop
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <LottieView
              source={require('@/assets/mascot/Trophy.json')}
              autoPlay
              loop={false}
              style={{ width: 300, height: 300 }}
            />
            <Text style={styles.celebrationTextV2}>{celebrationMessage}</Text>
            {celebrationXP > 0 && <Text style={styles.celebrationXPV2}>+{celebrationXP} XP</Text>}
            {celebrationStreak !== null && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
                <Ionicons name="flame" size={24} color="#F97316" />
                <Text style={{ fontSize: 24, fontFamily: 'Poppins-Bold', color: '#F97316' }}>{celebrationStreak} DAY STREAK!</Text>
              </View>
            )}
          </MotiView>
        )}
      </AnimatePresence>

      <DayStreakModal
        visible={streakModalVisible}
        mode={streakModalMode}
        currentStreak={currentStreak}
        onClose={() => setStreakModalVisible(false)}
        onCtaPress={() => setStreakModalVisible(false)}
      />

      {/* Flying XP Animations */}
      {flyingXPList.map((fxp: FlyingXPItem) => (
        <FlyingXP
          key={`fxp-${fxp.id}`}
          amount={fxp.amount}
          startPosition={fxp.startPosition}
          onComplete={() => {
            setFlyingXPList(prev => prev.filter(xp => xp.id !== fxp.id));
          }}
        />
      ))}
    </View>
  );
}

// End of MindGainsHomePage







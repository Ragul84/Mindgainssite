import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import { BlurView } from 'expo-blur';

import { useAuthContext } from '@/components/AuthProvider';
import {
  getMissionPayload,
  getUserProtocol,
  getDailyQuestionTarget,
  MissionPayload
} from '@/utils/protocolService';
import HapticService from '@/utils/hapticService';
import { SupabaseService } from '@/utils/supabaseService';
import UnifiedLoader from '@/components/ui/UnifiedLoader';
import NotificationService from '@/utils/notificationService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const cleanMissionTitle = (title?: string | null) => {
  const value = String(title || '').replace(/\s+/g, ' ').trim();
  return value.replace(/\s*\((?:Days?|Day)\s+\d+\s*(?:[-–]\s*\d+)?\)\s*$/i, '').trim();
};

type PhaseStatus = 'locked' | 'current' | 'completed';

interface PhaseConfig {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  gradient: [string, string];
  type: 'snapshot' | 'flashcards' | 'videos' | 'quiz';
}

const PHASES: PhaseConfig[] = [
  {
    id: 1,
    title: 'Reading Notes',
    subtitle: 'Full topic learning section',
    icon: 'book-open',
    gradient: ['#4285F4', '#34A853'],
    type: 'snapshot',
  },
  {
    id: 2,
    title: 'Recall Cards',
    subtitle: 'Exam-focused active recall',
    icon: 'clone',
    gradient: ['#EA4335', '#FBBC05'],
    type: 'flashcards',
  },
  {
    id: 3,
    title: 'Video Lessons',
    subtitle: 'Curated reference tutorials',
    icon: 'play-circle',
    gradient: ['#FF9900', '#FFCC00'],
    type: 'videos',
  },
  {
    id: 4,
    title: 'Exam Practice',
    subtitle: 'Timed questions from today',
    icon: 'check-circle',
    gradient: ['#10B981', '#059669'],
    type: 'quiz',
  },
];

export default function DailyMissionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [missionData, setMissionData] = useState<{
    payload: MissionPayload | null;
    topicTitle: string | null;
    currentPhase: number;
  }>({
    payload: null,
    topicTitle: null,
    currentPhase: 1,
  });
  const [weakFocus, setWeakFocus] = useState<{ topic: string; recommendation: string } | null>(null);

  const loadMission = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const protocol = await getUserProtocol(user.id);
      if (protocol) {
        const { payload, topicTitle } = await getMissionPayload(
          protocol.track_id,
          protocol.current_day_number
        );
        setMissionData({
          payload,
          topicTitle,
          currentPhase: protocol.progress_phase || 1,
        });
        
        // Dynamically reschedule daily reminders based on whether today's self-assessment is cleared
        const isTodayComplete = protocol.progress_phase >= 5;
        NotificationService.scheduleDailyNotifications(isTodayComplete);
      }

      const studyPlan = await SupabaseService.getPersonalizedStudyPlan(user.id);
      const topWeakArea = studyPlan?.weakAreas?.[0];
      setWeakFocus(
        topWeakArea
          ? {
              topic: topWeakArea.topic,
              recommendation: topWeakArea.recommendation,
            }
          : null
      );
    } catch (error) {
      console.error('Failed to load mission:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadMission();
  }, [loadMission]);

  const handlePhasePress = (phase: PhaseConfig) => {
    const status = getPhaseStatus(phase.id);
    if (status === 'locked') {
      HapticService.error();
      return;
    }

    HapticService.medium();
    
    // Navigate to specific reader for each phase
    // For now, let's create a unified reader or redirect to specific ones
    router.push({
      pathname: '/daily-mission/reader',
      params: { 
        phaseId: phase.id,
        phaseType: phase.type,
        topicTitle: missionData.topicTitle || 'Daily Lesson'
      }
    });
  };

  const getPhaseStatus = (phaseId: number): PhaseStatus => {
    if (phaseId < missionData.currentPhase) return 'completed';
    if (phaseId === missionData.currentPhase) return 'current';
    return 'locked';
  };

  const recallCount = missionData.payload?.flashcards?.length || 0;
  const quizCount = missionData.payload?.quiz?.questions?.length || 0;
  const targetQuizCount = getDailyQuestionTarget(missionData.payload?.track);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <UnifiedLoader context="learn" message="Loading your daily lesson…" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 🌌 Background Decoration */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
        <View style={styles.topAmbientGlow} />
      </View>

      <SafeAreaView style={styles.content}>
        {/* 🏔️ Header */}
        <MotiView 
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.header}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/home')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.dayLabel}>Day {missionData.payload?.day_number || 1}</Text>
            <Text style={styles.topicTitle} numberOfLines={2}>
              {cleanMissionTitle(missionData.topicTitle) || 'Loading...'}
            </Text>
          </View>
        </MotiView>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 📰 Daily Current Affairs - First Mission of the Day */}
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={styles.currentAffairsCard}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.currentAffairsTouch}
              onPress={() => {
                HapticService.medium();
                router.push({
                  pathname: '/daily-mission/reader',
                  params: {
                    phaseId: 0,
                    phaseType: 'current_affairs',
                    topicTitle: 'Daily Current Affairs Quiz'
                  }
                });
              }}
            >
              <LinearGradient
                colors={['#1E293B', '#0F172A']}
                style={styles.currentAffairsGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.currentAffairsHeaderRow}>
                  <View style={styles.currentAffairsBadge}>
                    <Ionicons name="newspaper" size={12} color="#FBBF24" />
                    <Text style={styles.currentAffairsBadgeText}>DAILY NEWS UPDATE</Text>
                  </View>
                  <View style={[styles.caPill, { backgroundColor: 'rgba(251,191,36,0.15)' }]}>
                    <Ionicons name="flash" size={10} color="#FBBF24" />
                    <Text style={[styles.caPillText, { color: '#FBBF24' }]}>Highly Recommended</Text>
                  </View>
                </View>
                <Text style={styles.currentAffairsTitle}>Current Affairs Practice</Text>
                <Text style={styles.currentAffairsSub}>Quick 15-question review to stay up-to-date with high-yield dynamic topics.</Text>
                <View style={styles.currentAffairsFooter}>
                  <View style={styles.caPill}>
                    <Ionicons name="list" size={12} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.caPillText}>15 Questions</Text>
                  </View>
                  <View style={styles.caPill}>
                    <Ionicons name="time" size={12} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.caPillText}>15 mins</Text>
                  </View>
                  <View style={styles.caCta}>
                    <Text style={styles.caCtaText}>Start Quiz</Text>
                    <Ionicons name="arrow-forward" size={12} color="#00D4C7" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          {weakFocus && (
            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              style={styles.weakFocusCard}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={styles.weakFocusTouch}
                onPress={() => router.push('/quiz-hub')}
              >
                <View style={styles.weakFocusIcon}>
                  <Ionicons name="pulse" size={18} color="#F59E0B" />
                </View>
                <View style={styles.weakFocusInfo}>
                  <Text style={styles.weakFocusLabel}>TOPIC TO REVISE</Text>
                  <Text style={styles.weakFocusTitle}>{weakFocus.topic}</Text>
                  <Text style={styles.weakFocusCopy}>{weakFocus.recommendation}</Text>
                </View>
                <View style={styles.weakFocusCta}>
                  <Text style={styles.weakFocusCtaText}>Practice Quiz</Text>
                  <Ionicons name="arrow-forward" size={14} color="#F59E0B" />
                </View>
              </TouchableOpacity>
            </MotiView>
          )}

          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={styles.metricsRow}
          >
            <View style={styles.metricTile}>
              <Text style={styles.metricValue}>{recallCount}</Text>
              <Text style={styles.metricLabel}>Practice Cards</Text>
            </View>
            <View style={styles.metricTile}>
              <Text style={styles.metricValue}>{quizCount}/{targetQuizCount}</Text>
              <Text style={styles.metricLabel}>Daily Target</Text>
            </View>
            <View style={styles.metricTile}>
              <Text style={styles.metricValue}>70%</Text>
              <Text style={styles.metricLabel}>Passing Standard</Text>
            </View>
          </MotiView>

          {/* 🎯 Journey Tracker */}
          <View style={styles.phasesContainer}>
            {PHASES.map((phase, index) => {
              const status = getPhaseStatus(phase.id);
              const isLast = index === PHASES.length - 1;

              return (
                <View key={phase.id} style={styles.phaseItemWrapper}>
                  {/* Progress Line */}
                  {!isLast && (
                    <View 
                      style={[
                        styles.progressLine,
                        status === 'completed' && { backgroundColor: '#00D4C7' }
                      ]} 
                    />
                  )}

                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handlePhasePress(phase)}
                    style={[
                      styles.phaseCard,
                      status === 'locked' && styles.phaseCardLocked,
                      status === 'current' && styles.phaseCardActive
                    ]}
                  >
                    <LinearGradient
                      colors={status === 'locked' ? ['#E2E8F0', '#CBD5E1'] : phase.gradient}
                      style={styles.phaseIconContainer}
                    >
                      <FontAwesome5 
                        name={status === 'completed' ? 'check' : phase.icon} 
                        size={18} 
                        color={status === 'locked' ? '#94A3B8' : '#FFFFFF'} 
                      />
                    </LinearGradient>

                    <View style={styles.phaseInfo}>
                      <Text style={[
                        styles.phaseTitle,
                        status === 'locked' && { color: '#94A3B8' }
                      ]}>
                        {phase.title}
                      </Text>
                      <Text style={styles.phaseSubtitle}>{phase.subtitle}</Text>
                    </View>

                    {status === 'locked' ? (
                      <Ionicons name="lock-closed" size={18} color="#94A3B8" />
                    ) : (
                      <Ionicons 
                        name="chevron-forward" 
                        size={18} 
                        color={status === 'completed' ? '#00D4C7' : '#64748B'} 
                      />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* 🎁 Completion Reward Preview */}
          <MotiView 
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 400 }}
            style={styles.rewardCard}
          >
            <BlurView intensity={20} tint="light" style={styles.rewardBlur}>
              <View style={styles.rewardIconBg}>
                <FontAwesome5 name="gem" size={24} color="#F59E0B" />
              </View>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardTitle}>Daily Progress Goal</Text>
                <Text style={styles.rewardDescription}>Review practice cards and achieve 70% on self-assessments to clear your daily goal.</Text>
              </View>
            </BlurView>
          </MotiView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  topAmbientGlow: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#00D4C7',
    opacity: 0.08,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitleContainer: {
    flex: 1,
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#00D4C7',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  topicTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  progressBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#0F172A',
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  weakFocusCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 18,
  },
  weakFocusTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.18)',
  },
  weakFocusIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  weakFocusInfo: {
    flex: 1,
  },
  weakFocusLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#F59E0B',
    letterSpacing: 1.1,
  },
  weakFocusTitle: {
    marginTop: 4,
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  weakFocusCopy: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  weakFocusCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  weakFocusCtaText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#F59E0B',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  metricTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  metricLabel: {
    marginTop: 2,
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  phasesContainer: {
    gap: 0,
  },
  phaseItemWrapper: {
    position: 'relative',
    paddingBottom: 24,
  },
  progressLine: {
    position: 'absolute',
    left: 27,
    top: 56,
    bottom: 0,
    width: 2,
    backgroundColor: '#E2E8F0',
    zIndex: -1,
  },
  phaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 3,
    gap: 16,
  },
  phaseCardActive: {
    borderColor: 'rgba(0, 212, 199, 0.3)',
    backgroundColor: '#FFFFFF',
    shadowColor: '#00D4C7',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  phaseCardLocked: {
    backgroundColor: '#F8FAFC',
    opacity: 0.7,
  },
  phaseIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseInfo: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  phaseSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 2,
  },
  rewardCard: {
    marginTop: 12,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  rewardBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    gap: 16,
  },
  rewardIconBg: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#92400E',
  },
  rewardDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#B45309',
    marginTop: 2,
    lineHeight: 18,
  },
  currentAffairsCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  currentAffairsTouch: {
    width: '100%',
  },
  currentAffairsGrad: {
    padding: 22,
    borderRadius: 24,
  },
  currentAffairsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  currentAffairsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251,191,36,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  currentAffairsBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#FBBF24',
    letterSpacing: 1,
  },
  currentAffairsTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 28,
  },
  currentAffairsSub: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
    marginBottom: 20,
  },
  currentAffairsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  caPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 5,
  },
  caPillText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: 'rgba(255,255,255,0.8)',
  },
  caCta: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  caCtaText: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#00D4C7',
  },
});

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Modal,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { SupabaseService } from '@/utils/supabaseService';
import { CompanionOrchestrator, CompanionCard } from '@/services/companion/orchestrator';
import { supabase } from '@/utils/supabase';
import { mascotApi } from '@/services/mascotApi';
import LessonPreviewModal from '@/components/ui/LessonPreviewModal';
import CustomToast from '@/components/ui/CustomToast';
import { V2026 } from '@/theme/v2026-tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STATUS_COLORS = {
  completed: ['#10B981', '#059669'],
  current: ['#0EA5E9', '#0284C7'],
  locked: ['#94A3B8', '#64748B'],
};

const BlueprintPath = ({ outline, onLessonPress, onReset, onLayout }: any) => {
  const [shakeId, setShakeId] = useState<string | null>(null);
  
  if (!outline) {
    return (
      <View style={styles.emptyCard} onLayout={onLayout}>
        <View style={styles.emptyIconBg}>
          <Ionicons name="map-outline" size={32} color={V2026.colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>No lesson path yet</Text>
        <Text style={styles.emptyText}>Enter a topic and generate your first lesson.</Text>
      </View>
    );
  }

  const completed = outline.lessons.filter((l: any) => l.status === 'completed').length;
  const total = outline.totalLessons || outline.lessons.length || 0;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  
  const firstLocked = outline.lessons.find((l: any, idx: number) => {
    const isCompleted = l.status === 'completed';
    const isCurrent = l.status === 'pending' && (idx === 0 || outline.lessons[idx - 1]?.status === 'completed');
    return !isCompleted && !isCurrent;
  })?.id;

  return (
    <View style={styles.pathCard} onLayout={onLayout}>
      <View style={styles.pathHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.pathTitle} numberOfLines={2}>{outline.topic}</Text>
          <Text style={styles.pathSubtitle}>{total} lessons</Text>
        </View>
        <TouchableOpacity onPress={onReset} style={styles.headerResetBtn} activeOpacity={1} >
          <Ionicons name="refresh-outline" size={18} color={V2026.colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressMeta}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValue}>{progress}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <MotiView 
            animate={{ width: `${progress}%` }}
            transition={{ type: 'timing', duration: 1000 }}
            style={styles.progressFill} 
          >
            <LinearGradient 
              colors={[V2026.colors.primary, V2026.colors.secondary]} 
              start={{x:0, y:0}} 
              end={{x:1, y:0}} 
              style={StyleSheet.absoluteFill} 
            />
          </MotiView>
        </View>
        <Text style={styles.lessonCountText}>{completed} of {total} complete</Text>
      </View>

      <View style={styles.lessonList}>
        {outline.lessons.map((lesson: any, idx: number) => {
          const isCompleted = lesson.status === 'completed';
          const isCurrent = lesson.status === 'pending' && (idx === 0 || outline.lessons[idx - 1]?.status === 'completed');
          const variant = isCompleted ? 'completed' : isCurrent ? 'current' : 'locked';
          const icon = isCompleted ? 'checkmark-circle' : isCurrent ? 'play-circle' : 'lock-closed';
          
          const onPress = () => {
            if (variant === 'locked') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              setShakeId(lesson.id);
              setTimeout(() => setShakeId(null), 500);
              return;
            }
            onLessonPress(lesson);
          };

          return (
            <MotiView
              key={lesson.id}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ 
                opacity: 1, 
                translateX: shakeId === lesson.id ? [0, -10, 10, -8, 8, 0] : 0 
              }}
              transition={{ delay: idx * 100 }}
            >
              <TouchableOpacity
                style={[
                  styles.lessonRow,
                  isCurrent && styles.lessonRowCurrent
                ]}
                onPress={onPress}
                activeOpacity={1}
              >
                <View style={styles.lessonThumb}>
                  <LinearGradient
                    colors={
                      variant === 'completed'
                        ? ['#0F172A', '#334155']
                        : variant === 'current'
                          ? ['#0EA5E9', '#0369A1']
                          : ['#CBD5E1', '#94A3B8']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.lessonThumbOverlay} />
                  <View style={styles.lessonThumbFrame}>
                    <View style={styles.lessonThumbLine} />
                    <View style={[styles.lessonThumbLine, styles.lessonThumbLineShort]} />
                    <View style={[styles.lessonThumbLine, styles.lessonThumbLineTiny]} />
                  </View>
                  <View style={[styles.lessonThumbBadge, { backgroundColor: STATUS_COLORS[variant][0] }]}>
                    <Ionicons name={icon as any} size={11} color="#FFFFFF" />
                  </View>
                </View>
                
                <View style={styles.lessonBody}>
                  <Text style={[styles.lessonTitle, variant === 'locked' && { color: V2026.colors.textMuted }]}>
                    {lesson.title}
                  </Text>
                  <Text style={styles.lessonMeta} numberOfLines={1}>
                    {variant === 'locked' ? 'Locked' : lesson.summary || 'Ready'}
                  </Text>
                </View>

                {variant !== 'locked' && (
                  <View style={styles.lessonChevron}>
                    <Ionicons name="chevron-forward" size={16} color={V2026.colors.textMuted} />
                  </View>
                )}
              </TouchableOpacity>
            </MotiView>
          );
        })}
      </View>
    </View>
  );
};

export default function BlueprintScreen() {
  const params = useLocalSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [cards, setCards] = useState<CompanionCard[]>([]);
  const [activeSection, setActiveSection] = useState<'blueprint' | 'lessons'>('blueprint');
  const [pathInput, setPathInput] = useState('');
  const [pathStatus, setPathStatus] = useState<string | null>(null);
  const [pathProgress, setPathProgress] = useState(0);
  const [isPathGenerating, setIsPathGenerating] = useState(false);
  const [didGenerate, setDidGenerate] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [lessonListOffset, setLessonListOffset] = useState<number | null>(null);
  
  const orchestratorRef = useRef<CompanionOrchestrator | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const toastTriggeredRef = useRef(false);
  const scrollTriggeredRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const user = await SupabaseService.getCurrentUser();
      if (!user) {
        router.replace('/auth');
        return;
      }
      if (!mounted) return;
      setUserId(user.id);
    })();
    return () => { mounted = false; };
  }, []);

  const syncCards = useCallback(() => {
    if (orchestratorRef.current) {
      const current = orchestratorRef.current.getCards();
      setCards([...current]);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    const initOrchestrator = async () => {
      try {
        orchestratorRef.current = new CompanionOrchestrator(userId, supabase, mascotApi);
        await orchestratorRef.current.init();
        if (mounted) syncCards();
      } catch (err) {
        console.error('[Blueprint] Orchestrator init failed', err);
      }
    };
    initOrchestrator();
    return () => {
      mounted = false;
      orchestratorRef.current?.destroy();
    };
  }, [userId, syncCards]);

  const generateTopicPath = useCallback(async (topic: string) => {
    const trimmed = topic.trim();
    if (!trimmed || !orchestratorRef.current) return;
    Keyboard.dismiss();

    const snapshot = orchestratorRef.current.getSnapshot();
    const activeTopic = snapshot?.memory?.activeTopic;
    const currentPath = snapshot?.cards?.find(c => c.type === 'topicPath');
    
    if (activeTopic && currentPath && !trimmed.toLowerCase().startsWith('continue')) {
      setPendingTopic(trimmed);
      setShowResetModal(true);
      return;
    }

    setIsPathGenerating(true);
    setPathProgress(5);
    setPathStatus(`Analyzing ${trimmed}...`);
    try {
      const result = await orchestratorRef.current.requestTopicPath(
        trimmed,
        'English',
        (progress) => {
          setPathProgress(progress);
          if (progress < 30) setPathStatus('Researching topic...');
          else if (progress < 60) setPathStatus('Architecting path...');
          else if (progress < 90) setPathStatus('Generating lessons...');
          else setPathStatus('Polishing blueprint...');
        }
      );
      if (result) {
        setPathStatus('Blueprint complete!');
        setPathInput('');
        setDidGenerate(true);
        setTimeout(() => setPathStatus(null), 2000);
      } else {
        setPathStatus(null);
      }
    } finally {
      setIsPathGenerating(false);
      syncCards();
    }
  }, [syncCards]);

  const onLessonPress = useCallback((lesson: any) => {
    let richLesson = { ...lesson };
    if (lesson.isAI) {
      const pathCard = cards.find(c => c.type === 'topicPath') as any;
      const deepLesson = pathCard?.deepLessons?.[lesson.id];
      if (deepLesson) richLesson.deepLesson = deepLesson;
    }
    setSelectedLesson(richLesson);
    setIsPreviewVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [cards]);

  const handleResetPath = useCallback(() => {
    setShowResetModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const confirmReset = useCallback(async () => {
    if (!orchestratorRef.current) return;
    const topicToStart = pendingTopic;
    await orchestratorRef.current.resetTopicPath();
    syncCards();
    setShowResetModal(false);
    setPendingTopic(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (topicToStart) {
      setTimeout(() => generateTopicPath(topicToStart), 200);
    }
  }, [generateTopicPath, pendingTopic, syncCards]);

  const pathCard = cards.find(c => c.type === 'topicPath') as any;

  useEffect(() => {
    if (didGenerate && activeSection === 'blueprint') {
      const t = setTimeout(() => {
        setActiveSection('lessons');
        setDidGenerate(false);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [didGenerate, activeSection]);

  useEffect(() => {
    const target = typeof params.section === 'string' ? params.section : null;
    if (target === 'lessons') setActiveSection('lessons');
    if (target === 'blueprint') setActiveSection('blueprint');
  }, [params.section]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#F8FAFC', '#FFFFFF', '#EEF7F2']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.topHeader}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={V2026.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Generate Lesson</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            activeOpacity={1} onPress={() => setActiveSection('blueprint')}
            style={[styles.tabItem, activeSection === 'blueprint' && styles.tabItemActive]}
          >
            <Text style={[styles.tabText, activeSection === 'blueprint' && styles.tabTextActive]}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={1} onPress={() => setActiveSection('lessons')}
            style={[styles.tabItem, activeSection === 'lessons' && styles.tabItemActive]}
          >
            <Text style={[styles.tabText, activeSection === 'lessons' && styles.tabTextActive]}>Lessons</Text>
          </TouchableOpacity>
          <MotiView 
            animate={{ translateX: activeSection === 'blueprint' ? 0 : (SCREEN_WIDTH - 48)/2 }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            style={styles.tabIndicator}
          />
        </View>

        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        >
          {activeSection === 'blueprint' && (
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <View style={styles.genesisCard}>
                <LinearGradient 
                  colors={['rgba(14, 165, 233, 0.05)', 'rgba(124, 58, 237, 0.05)']} 
                  style={StyleSheet.absoluteFill} 
                />
                
                <Text style={styles.genesisTitle}>What should we build?</Text>
                <Text style={styles.genesisSubtitle}>Enter any topic. MIGA creates a lesson path.</Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    value={pathInput}
                    onChangeText={setPathInput}
                    placeholder="e.g. World War II, percentages, polity"
                    placeholderTextColor={V2026.colors.textMuted}
                    style={styles.input}
                    editable={!isPathGenerating}
                  />
                  <View style={styles.inputGlow} />
                </View>

                <TouchableOpacity
                  style={[styles.generateBtn, (!pathInput.trim() || isPathGenerating) && styles.generateBtnDisabled]}
                  activeOpacity={1} onPress={() => generateTopicPath(pathInput)}
                  disabled={isPathGenerating || !pathInput.trim()}
                >
                  <LinearGradient 
                    colors={[V2026.colors.primary, V2026.colors.secondary]} 
                    start={{x:0, y:0}} 
                    end={{x:1, y:1}} 
                    style={StyleSheet.absoluteFill} 
                  />
                  {isPathGenerating ? (
                    <View style={styles.btnContent}>
                      <ActivityIndicator size="small" color="#FFF" />
                      <Text style={styles.generateBtnText}>{pathStatus} ({pathProgress}%)</Text>
                    </View>
                  ) : (
                    <View style={styles.btnContent}>
                      <Ionicons name="sparkles" size={18} color="#FFF" style={{marginRight: 8}} />
                      <Text style={styles.generateBtnText}>Generate</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {pathCard && (
                  <TouchableOpacity onPress={handleResetPath} style={styles.resetLink} activeOpacity={1}>
                    <Text style={styles.resetLinkText}>Start over</Text>
                  </TouchableOpacity>
                )}
              </View>
            </MotiView>
          )}

          {activeSection === 'lessons' && (
            <BlueprintPath
              outline={pathCard?.outline || null}
              onLessonPress={onLessonPress}
              onReset={handleResetPath}
              onLayout={(e: any) => setLessonListOffset(e.nativeEvent.layout.y)}
            />
          )}
        </ScrollView>

        <LessonPreviewModal
          visible={isPreviewVisible}
          lesson={selectedLesson}
          onClose={() => setIsPreviewVisible(false)}
          onStart={() => {
            setIsPreviewVisible(false);
            if (selectedLesson?.isAI) {
              const deepLesson = pathCard?.deepLessons?.[selectedLesson.id];
              if (deepLesson) {
                const { aiLessonCache } = require('@/utils/aiLessonCache');
                aiLessonCache.setLesson(deepLesson);
              }
              router.push({
                pathname: '/study/ai-lesson',
                params: {
                  topicId: orchestratorRef.current?.getCurrentTopicId() || 'ai-session',
                  lessonId: selectedLesson.id,
                  topicName: selectedLesson.title,
                  isAI: 'true'
                }
              });
            } else {
              router.push('/learn/content-viewer');
            }
          }}
        />

        <Modal visible={showResetModal} transparent animationType="fade">
          <BlurView intensity={30} style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={[styles.modalIconBg, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <Ionicons name="alert-circle" size={32} color={V2026.colors.error} />
              </View>
              <Text style={styles.modalTitle}>Start over?</Text>
              <Text style={styles.modalBody}>This replaces the current lesson path.</Text>
              
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalBtnSecondary} activeOpacity={1} onPress={() => setShowResetModal(false)}>
                  <Text style={styles.modalBtnSecondaryText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalBtnPrimary} activeOpacity={1} onPress={confirmReset}>
                  <LinearGradient colors={[V2026.colors.error, '#B91C1C']} style={StyleSheet.absoluteFill} />
                  <Text style={styles.modalBtnPrimaryText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>

        <CustomToast
          visible={toastVisible}
          message={toastMessage}
          type="success"
          onHide={() => setToastVisible(false)}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  safe: { flex: 1 },
  
  // Header
  topHeader: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    ...V2026.shadows.milky,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 23,
    fontFamily: 'Poppins-Bold',
    color: V2026.colors.text,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -2,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  activeText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: V2026.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 8,
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    padding: 4,
    position: 'relative',
  },
  tabItem: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabItemActive: {},
  tabText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: V2026.colors.textMuted,
  },
  tabTextActive: {
    color: V2026.colors.text,
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    width: (SCREEN_WIDTH - 36 - 8) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    ...V2026.shadows.milky,
  },

  // Create card
  genesisCard: {
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 18,
    overflow: 'hidden',
    ...V2026.shadows.milky,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  genesisTitle: {
    fontSize: 19,
    fontFamily: 'Poppins-Bold',
    color: V2026.colors.text,
  },
  genesisSubtitle: {
    fontSize: 13,
    color: V2026.colors.textMuted,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  inputContainer: {
    marginTop: 18,
    position: 'relative',
  },
  input: {
    height: 52,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: V2026.colors.text,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  inputGlow: {
    position: 'absolute',
    bottom: -10,
    left: 20,
    right: 20,
    height: 20,
    backgroundColor: V2026.colors.primary,
    opacity: 0.1,
    filter: 'blur(10px)',
  },
  generateBtn: {
    marginTop: 16,
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    ...V2026.shadows.milky,
  },
  generateBtnDisabled: {
    opacity: 0.6,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  generateBtnText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  resetLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  resetLinkText: {
    fontSize: 13,
    color: V2026.colors.error,
    fontFamily: 'Inter-SemiBold',
    textDecorationLine: 'underline',
  },

  // Info Grid
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...V2026.shadows.milky,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: V2026.colors.text,
  },

  // Path Card
  pathCard: {
    marginTop: 8,
  },
  pathHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  pathTitle: {
    fontSize: 21,
    fontFamily: 'Poppins-Bold',
    color: V2026.colors.text,
  },
  pathSubtitle: {
    fontSize: 14,
    color: V2026.colors.textMuted,
    fontFamily: 'Inter-Medium',
  },
  headerResetBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Progress
  progressContainer: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    ...V2026.shadows.milky,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: V2026.colors.text,
  },
  progressValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: V2026.colors.primary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  lessonCountText: {
    marginTop: 10,
    fontSize: 12,
    color: V2026.colors.textMuted,
    fontFamily: 'Inter-Medium',
  },

  // Lesson List
  lessonList: {
    gap: 10,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    gap: 10,
    ...V2026.shadows.milky,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  lessonRowCurrent: {
    borderColor: V2026.colors.primary,
    backgroundColor: '#F0F9FF',
  },
  lessonThumb: {
    width: 54,
    height: 62,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  lessonThumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  lessonThumbFrame: {
    width: '100%',
    paddingHorizontal: 8,
    gap: 4,
  },
  lessonThumbLine: {
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.78)',
    width: '80%',
  },
  lessonThumbLineShort: {
    width: '56%',
  },
  lessonThumbLineTiny: {
    width: '40%',
    backgroundColor: 'rgba(255,255,255,0.58)',
  },
  lessonThumbBadge: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonBody: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: V2026.colors.text,
  },
  lessonMeta: {
    fontSize: 12,
    color: V2026.colors.textMuted,
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
  lessonChevron: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty State
  emptyCard: {
    marginTop: 24,
    alignItems: 'center',
    padding: 28,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...V2026.shadows.milky,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: V2026.colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: V2026.colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Inter-Medium',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    ...V2026.shadows.milky,
  },
  modalIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: V2026.colors.text,
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 14,
    color: V2026.colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter-Medium',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtnPrimary: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnPrimaryText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },
  modalBtnSecondary: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnSecondaryText: {
    color: V2026.colors.text,
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },
});

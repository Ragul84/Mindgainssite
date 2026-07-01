import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { supabase } from '@/utils/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import { safeGoBack } from '@/utils/navigationHelper';
import UniversalCompletion from '@/components/ui/UniversalCompletion';
import { RealDatabaseContentService } from '@/utils/realDatabaseContentService';
import { UnifiedLoader } from '@/components/ui/UnifiedLoader';
import FlashcardLessonInterface from '@/components/ui/FlashcardLessonInterface';

export default function ReadingInterfaceDB() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [lessonContent, setLessonContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const [sectionIndex, setSectionIndex] = useState(0);

  const sessionStartRef = useRef(Date.now());

  const topicName = params.topicName as string;
  const subject = (params.subject as string) || 'General Studies';

  const heroFade = useRef(new Animated.Value(0)).current;
  const heroRise = useRef(new Animated.Value(20)).current;
  const chipPulse = useRef(new Animated.Value(1)).current;
  const glowShift = useRef(new Animated.Value(0)).current;
  const sectionFade = useRef(new Animated.Value(1)).current;
  const sectionRise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadLessonContent();
  }, [topicName]);

  useEffect(() => {
    if (isLoading || !lessonContent || !showLaunchScreen) return;

    Animated.parallel([
      Animated.timing(heroFade, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(heroRise, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(chipPulse, {
          toValue: 1.04,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(chipPulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(glowShift, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [isLoading, lessonContent, showLaunchScreen, chipPulse, glowShift, heroFade, heroRise]);

  useEffect(() => {
    if (showLaunchScreen) return;
    sectionFade.setValue(0);
    sectionRise.setValue(16);
    Animated.parallel([
      Animated.timing(sectionFade, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sectionRise, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [sectionIndex, sectionFade, sectionRise, showLaunchScreen]);

  const loadLessonContent = async () => {
    setIsLoading(true);

    try {
      const lessonParts = await RealDatabaseContentService.getLessonPartsForTopic(topicName);

      if (lessonParts && lessonParts.length > 0) {
        const firstPart = lessonParts[0];
        const partWithPages = await RealDatabaseContentService.getLessonPartWithPages(firstPart.id);

        if (partWithPages) {
          const formattedContent = convertToFlashcardFormat(partWithPages, topicName);
          setLessonContent(formattedContent);
        } else {
          setLessonContent(createFallbackContent(topicName));
        }
      } else {
        const topicContent = await RealDatabaseContentService.getTopicByName(topicName);
        if (topicContent) {
          const formattedContent = convertTopicToFlashcardFormat(topicContent);
          setLessonContent(formattedContent);
        } else {
          setLessonContent(createFallbackContent(topicName));
        }
      }
    } catch (error) {
      console.error('Error loading lesson content:', error);
      setLessonContent(createFallbackContent(topicName));
    }

    setShowLaunchScreen(false);
    setIsLoading(false);
  };

  const convertToFlashcardFormat = (partWithPages: any, topicLabel: string) => {
    const { part, pages } = partWithPages;

    const sections =
      pages?.map((page: any, index: number) => ({
        id: `page-${page.id}`,
        title: page.page_title || `Section ${index + 1}`,
        subtitle: page.page_description || '',
        content:
          page.content_points?.map((point: any) => ({
            title: point.title || '',
            content: point.full || point.description || '',
            keyPoints: point.key_points || [],
          })) || [],
        icon: 'book-open',
        gradient: ['#4F46E5', '#06B6D4'],
      })) || [];

    return {
      topicId: part.topic_id,
      title: part.part_title || topicLabel,
      subtitle: part.short_description || `Learn about ${topicLabel}`,
      overview: part.detailed_intro?.what_youll_master?.join(' ') || part.short_description,
      sections,
      totalLessons: pages?.length || 1,
      estimatedTime: part.estimated_time_minutes || 15,
      xpReward: part.xp_reward || 50,
      difficulty: part.difficulty_level || 'medium',
    };
  };

  const convertTopicToFlashcardFormat = (topic: any) => {
    return {
      topicId: topic.id,
      title: topic.name,
      subtitle: topic.description || 'Master this topic',
      overview: topic.description || 'Comprehensive study guide',
      sections: [
        {
          id: 'intro',
          title: 'Introduction',
          subtitle: 'Get started with the basics',
          content: [
            {
              title: 'Overview',
              content: topic.description || 'Learn the fundamentals of this topic',
              keyPoints: ['Core concept', 'Key applications', 'Exam-ready recall'],
            },
          ],
          icon: 'sparkles',
          gradient: ['#4F46E5', '#06B6D4'],
        },
      ],
      totalLessons: 1,
      estimatedTime: 15,
      xpReward: 50,
      difficulty: 'medium',
    };
  };

  const createFallbackContent = (topicLabel: string) => {
    return {
      topicId: 'fallback',
      title: topicLabel,
      subtitle: 'Study Guide',
      overview: `Learn about ${topicLabel}`,
      sections: [
        {
          id: 'section-1',
          title: 'Introduction',
          subtitle: 'Getting Started',
          content: [
            {
              title: 'Overview',
              content: `Welcome to the study of ${topicLabel}. This lesson covers essential concepts and important details.`,
              keyPoints: ['Understand the basics', 'Learn key concepts', 'Master fundamentals'],
            },
          ],
          icon: 'book-open',
          gradient: ['#4F46E5', '#06B6D4'],
        },
      ],
      totalLessons: 1,
      estimatedTime: 15,
      xpReward: 50,
      difficulty: 'medium',
    };
  };

  const handleLessonCompletion = async () => {
    setShowCompletion(true);

    if (user?.id && lessonContent?.topicId) {
      try {
        await supabase.from('user_topic_progress').upsert({
          user_id: user.id,
          topic_id: lessonContent.topicId,
          lessons_completed: 1,
          last_accessed: new Date().toISOString(),
          xp_earned: lessonContent.xpReward || 50,
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }

    setTimeout(() => {
      router.back();
    }, 2500);
  };

  if (isLoading) {
    return <UnifiedLoader message="Preparing premium lesson" context="study" fullScreen />;
  }

  if (!lessonContent) {
    return (
      <View style={styles.emptyRoot}>
        <Text style={styles.emptyText}>No content available</Text>
      </View>
    );
  }

  return (
    <>
      <FlashcardLessonInterface
        topicName={lessonContent.title}
        subjectName={subject}
        content={lessonContent}
        topicId={lessonContent.topicId}
        overview={lessonContent.overview}
        estimatedTime={lessonContent.estimatedTime}
        xpReward={lessonContent.xpReward}
        difficulty={lessonContent.difficulty}
        onBack={() => safeGoBack('/(tabs)/learn')}
        onComplete={handleLessonCompletion}
      />

      <UniversalCompletion
        visible={showCompletion}
        onClose={() => setShowCompletion(false)}
        levelUp={false}
        xpEarned={lessonContent.xpReward || 50}
        streakDays={1}
        completionTime={Math.max(1, Math.round((Date.now() - sessionStartRef.current) / 60000))}
      />
    </>
  );

  if (showLaunchScreen) {
    const shiftX = glowShift.interpolate({
      inputRange: [0, 1],
      outputRange: [-40, 40],
    });

    return (
      <View style={styles.launchRoot}>
        <StatusBar barStyle="light-content" />

        <LinearGradient
          colors={['#070A14', '#0C1324', '#101B34']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <Animated.View style={[styles.glowA, { transform: [{ translateX: shiftX }] }]} />
        <Animated.View style={[styles.glowB, { transform: [{ translateX: Animated.multiply(shiftX, -1) }] }]} />

        <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}> 
          <TouchableOpacity activeOpacity={1} onPress={() => safeGoBack('/(tabs)/learn')} style={styles.iconBtn}>
            <FontAwesome5 name="arrow-left" size={14} color="#E7ECFF" />
          </TouchableOpacity>
          <View style={styles.topTitleWrap}>
            <Text style={styles.topOverline}>MATERIAL YOU • READING</Text>
            <Text style={styles.topTitle}>Premium Lesson</Text>
          </View>
          <View style={styles.iconBtnGhost} />
        </View>

        <Animated.View style={[styles.heroCard, { opacity: heroFade, transform: [{ translateY: heroRise }] }]}> 
          <View style={styles.subjectChip}>
            <FontAwesome5 name="layer-group" size={11} color="#67E8F9" />
            <Text style={styles.subjectChipText}>{subject}</Text>
          </View>

          <Text style={styles.lessonTitle}>{lessonContent.title}</Text>
          <Text style={styles.lessonSubtitle}>{lessonContent.subtitle || lessonContent.overview}</Text>

          <Animated.View style={[styles.statsRow, { transform: [{ scale: chipPulse }] }]}> 
            <View style={styles.statChip}>
              <FontAwesome5 name="clock" size={11} color="#A5B4FC" />
              <Text style={styles.statText}>{lessonContent.estimatedTime || 15} min</Text>
            </View>
            <View style={styles.statChip}>
              <FontAwesome5 name="coins" size={11} color="#FCD34D" />
              <Text style={styles.statText}>{lessonContent.xpReward || 50} XP</Text>
            </View>
            <View style={styles.statChip}>
              <FontAwesome5 name="book-open" size={11} color="#86EFAC" />
              <Text style={styles.statText}>{lessonContent.totalLessons || 1} blocks</Text>
            </View>
          </Animated.View>

          <View style={styles.featureGrid}>
            <View style={styles.featureCard}>
              <FontAwesome5 name="brain" size={14} color="#C4B5FD" />
              <Text style={styles.featureTitle}>Focused Recall</Text>
              <Text style={styles.featureBody}>Active prompts and memory cues.</Text>
            </View>
            <View style={styles.featureCard}>
              <FontAwesome5 name="bolt" size={14} color="#67E8F9" />
              <Text style={styles.featureTitle}>Micro Motion</Text>
              <Text style={styles.featureBody}>Smooth interactions and transitions.</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.startBtn} activeOpacity={1} onPress={() => setShowLaunchScreen(false)}>
            <LinearGradient
              colors={['#67E8F9', '#22D3EE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startBtnGradient}
            >
              <FontAwesome5 name="play" size={12} color="#062236" />
              <Text style={styles.startBtnText}>Start Immersive Reading</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  const sections = Array.isArray(lessonContent.sections) ? lessonContent.sections : [];
  const currentSection = sections[sectionIndex];
  const totalSections = sections.length || 1;
  const progress = ((sectionIndex + 1) / totalSections) * 100;

  return (
    <View style={styles.readerRoot}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#060A16', '#0A1327', '#0B1832']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity activeOpacity={1} onPress={() => safeGoBack('/(tabs)/learn')} style={styles.iconBtn}>
          <FontAwesome5 name="arrow-left" size={14} color="#E7ECFF" />
        </TouchableOpacity>
        <View style={styles.topTitleWrap}>
          <Text style={styles.topOverline}>{subject.toUpperCase()}</Text>
          <Text style={styles.topTitle} numberOfLines={1}>{lessonContent.title}</Text>
        </View>
        <View style={styles.sectionCounterChip}>
          <Text style={styles.sectionCounterText}>{sectionIndex + 1}/{totalSections}</Text>
        </View>
      </View>

      <View style={styles.progressRail}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <Animated.View
        style={[
          styles.sectionCard,
          {
            opacity: sectionFade,
            transform: [{ translateY: sectionRise }],
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sectionScroll}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconWrap}>
              <FontAwesome5 name="book-open" size={13} color="#7DD3FC" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitleText}>{currentSection?.title || 'Key Section'}</Text>
              {!!currentSection?.subtitle && <Text style={styles.sectionSubtitleText}>{currentSection.subtitle}</Text>}
            </View>
          </View>

          {(currentSection?.content || []).map((block: any, idx: number) => (
            <View key={`${block?.title || 'block'}-${idx}`} style={styles.contentBlock}>
              {!!block?.title && (
                <View style={styles.blockTitleRow}>
                  <FontAwesome5 name="sparkles" size={11} color="#C4B5FD" />
                  <Text style={styles.blockTitle}>{block.title}</Text>
                </View>
              )}
              {!!block?.content && <Text style={styles.blockBody}>{block.content}</Text>}
              {Array.isArray(block?.keyPoints) && block.keyPoints.length > 0 && (
                <View style={styles.keyPointsWrap}>
                  {block.keyPoints.map((point: string, kIdx: number) => (
                    <View key={`${point}-${kIdx}`} style={styles.keyPointChip}>
                      <FontAwesome5 name="check-circle" size={10} color="#67E8F9" />
                      <Text style={styles.keyPointText}>{point}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          {(!currentSection?.content || currentSection.content.length === 0) && (
            <Text style={styles.emptyText}>No content blocks for this section.</Text>
          )}
        </ScrollView>
      </Animated.View>

      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={[styles.ghostBtn, sectionIndex === 0 && styles.btnDisabled]}
          onPress={() => setSectionIndex((prev) => Math.max(0, prev - 1))}
          disabled={sectionIndex === 0}
        >
          <FontAwesome5 name="chevron-left" size={12} color="#D8E1FF" />
          <Text style={styles.ghostBtnText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.startBtn}
          activeOpacity={1}
          onPress={() => {
            if (sectionIndex >= totalSections - 1) {
              handleLessonCompletion();
              return;
            }
            setSectionIndex((prev) => Math.min(totalSections - 1, prev + 1));
          }}
        >
          <LinearGradient
            colors={['#67E8F9', '#22D3EE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startBtnGradient}
          >
            <Text style={styles.startBtnText}>{sectionIndex >= totalSections - 1 ? 'Finish Lesson' : 'Next Section'}</Text>
            <FontAwesome5 name={sectionIndex >= totalSections - 1 ? 'check' : 'chevron-right'} size={12} color="#062236" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <UniversalCompletion
        visible={showCompletion}
        onClose={() => setShowCompletion(false)}
        levelUp={false}
        xpEarned={lessonContent.xpReward || 50}
        streakDays={1}
        completionTime={Math.max(1, Math.round((Date.now() - sessionStartRef.current) / 60000))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#070A14',
  },
  emptyText: {
    color: '#B4BED8',
    fontSize: 15,
    fontWeight: '600',
  },
  launchRoot: {
    flex: 1,
    backgroundColor: '#070A14',
  },
  readerRoot: {
    flex: 1,
    backgroundColor: '#060A16',
  },
  glowA: {
    position: 'absolute',
    top: -40,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(56, 189, 248, 0.16)',
  },
  glowB: {
    position: 'absolute',
    bottom: 120,
    left: -70,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(167, 139, 250, 0.12)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  iconBtnGhost: {
    width: 38,
    height: 38,
  },
  topTitleWrap: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  topOverline: {
    color: 'rgba(206, 219, 255, 0.62)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  topTitle: {
    color: '#F6F8FF',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
    maxWidth: '90%',
  },
  sectionCounterChip: {
    minWidth: 48,
    height: 34,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCounterText: {
    color: '#D8E1FF',
    fontSize: 12,
    fontWeight: '700',
  },
  progressRail: {
    paddingHorizontal: 16,
    marginTop: 6,
  },
  progressTrack: {
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#22D3EE',
  },
  sectionCard: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(16, 27, 52, 0.78)',
  },
  sectionScroll: {
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  sectionIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.35)',
    backgroundColor: 'rgba(125, 211, 252, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  sectionTitleText: {
    color: '#F4F7FF',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 25,
  },
  sectionSubtitleText: {
    marginTop: 4,
    color: 'rgba(219, 229, 255, 0.74)',
    fontSize: 13,
    lineHeight: 18,
  },
  contentBlock: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 12,
    gap: 8,
  },
  blockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  blockTitle: {
    color: '#EDE9FE',
    fontSize: 14,
    fontWeight: '700',
  },
  blockBody: {
    color: '#E9EEFF',
    fontSize: 14,
    lineHeight: 21,
  },
  keyPointsWrap: {
    gap: 7,
    marginTop: 2,
  },
  keyPointChip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(103, 232, 249, 0.22)',
    backgroundColor: 'rgba(103, 232, 249, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  keyPointText: {
    flex: 1,
    color: '#CFFAFE',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  ghostBtn: {
    minWidth: 110,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  ghostBtnText: {
    color: '#D8E1FF',
    fontSize: 13,
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.45,
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(16, 27, 52, 0.82)',
  },
  subjectChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(103, 232, 249, 0.35)',
    backgroundColor: 'rgba(103, 232, 249, 0.10)',
  },
  subjectChipText: {
    color: '#B8F7FF',
    fontSize: 12,
    fontWeight: '700',
  },
  lessonTitle: {
    marginTop: 14,
    color: '#F8FAFF',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  lessonSubtitle: {
    marginTop: 8,
    color: 'rgba(216, 225, 255, 0.78)',
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  statText: {
    color: '#E6EBFF',
    fontSize: 12,
    fontWeight: '700',
  },
  featureGrid: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
  },
  featureCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 12,
  },
  featureTitle: {
    marginTop: 8,
    color: '#F2F5FF',
    fontSize: 13,
    fontWeight: '700',
  },
  featureBody: {
    marginTop: 4,
    color: 'rgba(220, 228, 255, 0.72)',
    fontSize: 12,
    lineHeight: 17,
  },
  startBtn: {
    marginTop: 18,
    borderRadius: 16,
    overflow: 'hidden',
  },
  startBtnGradient: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startBtnText: {
    color: '#05263A',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});

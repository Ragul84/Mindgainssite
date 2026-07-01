import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import Animated, {
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from '@/utils/reanimated';
import { useRef, memo } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import { brandTheme, brandGradients } from '../constants/brandTheme';
import HapticService from '../utils/hapticService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  background: brandTheme.backgrounds.primary,
  surface: brandTheme.backgrounds.card,
  glass: brandTheme.backgrounds.glass,
  accent: brandTheme.brand.signature,
  textPrimary: brandTheme.text.primary,
  textSecondary: brandTheme.text.secondary,
  border: 'rgba(255, 255, 255, 0.1)',
  borderAccent: 'rgba(0, 212, 199, 0.3)',
};

const LessonCard = memo(({ 
  lesson, 
  isCurrent, 
  isCompleted, 
  isLocked, 
  onPress, 
  index, 
  scrollX 
}) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0.4);
  const shake = useSharedValue(0);
  const iconScale = useSharedValue(1);
  const cardWidthWithMargin = 230;

  useEffect(() => {
    if (isCurrent) {
      glow.value = withRepeat(
        withSequence(withTiming(0.8, { duration: 1500 }), withTiming(0.4, { duration: 1500 })),
        -1,
        true
      );
      iconScale.value = withRepeat(
        withSequence(withTiming(1.2, { duration: 800 }), withTiming(1, { duration: 800 })),
        -1,
        true
      );
    } else {
      iconScale.value = 1;
    }
  }, [isCurrent]);

  const animatedStyle = useAnimatedStyle(() => {
    // Focal scaling based on scroll position
    const input = [
      (index - 1) * cardWidthWithMargin,
      index * cardWidthWithMargin,
      (index + 1) * cardWidthWithMargin
    ];

    const focalScale = interpolate(
      scrollX.value,
      input,
      [0.96, 1, 0.96],
      Extrapolate.CLAMP
    );

    const focalOpacity = interpolate(
      scrollX.value,
      input,
      [0.85, 1, 0.85],
      Extrapolate.CLAMP
    );

    return {
      opacity: focalOpacity,
      transform: [
        { scale: scale.value * focalScale },
        { translateX: shake.value }
      ],
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 120 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  const handlePress = () => {
    if (isLocked) {
      HapticService.error();
      shake.value = withSequence(
        withTiming(-10, { duration: 45 }),
        withTiming(10, { duration: 45 }),
        withTiming(-8, { duration: 45 }),
        withTiming(8, { duration: 45 }),
        withTiming(0, { duration: 45 })
      );
      scale.value = withSequence(
        withTiming(0.92, { duration: 70 }),
        withTiming(1.02, { duration: 90 }),
        withTiming(1, { duration: 90 })
      );
      return;
    }
    // Haptic removed for non-locked lessons per user request
    onPress?.(lesson.id);
  };

  const iconName = isLocked ? 'lock' : (isCompleted ? 'check-circle' : 'play-circle');
  const iconColor = isLocked
    ? COLORS.textSecondary
    : (isCurrent || isCompleted ? '#FFFFFF' : COLORS.textSecondary);
  const iconSolid = isLocked || isCompleted || isCurrent;
  const statusLabel = isLocked ? 'Locked • Finish previous lesson' : (isCompleted ? 'Completed' : 'Ready to Start');

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        <Animated.View 
          style={[
            styles.cardContainer, 
            animatedStyle,
            isCurrent && styles.currentCard,
            isLocked && styles.lockedCard
          ]}
        >
          {/* Gradient Border for Current Card */}
          {isCurrent && (
            <LinearGradient
              colors={[COLORS.accent, brandTheme.brand.primary, COLORS.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBorderLayer}
            />
          )}

          {/* Side Accents for Current Card */}
          {isCurrent && (
            <>
              <LinearGradient
                colors={['transparent', COLORS.accent, 'transparent']}
                style={[styles.sideAccent, styles.sideAccentLeft]}
              />
              <LinearGradient
                colors={['transparent', COLORS.accent, 'transparent']}
                style={[styles.sideAccent, styles.sideAccentRight]}
              />
            </>
          )}

          <View style={[
            styles.cardInnerContent,
            isCurrent && styles.currentCardInner
          ]}>
            <LinearGradient
              colors={
                isCurrent 
                  ? ['rgba(0, 212, 199, 0.08)', 'rgba(0, 212, 199, 0.02)']
                  : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
              }
              style={styles.cardMain}
            >
              <View style={styles.cardContent}>
                <Animated.View style={[styles.iconBox, isCurrent && styles.iconBoxCurrent, isCompleted && styles.iconBoxCompleted, iconAnimatedStyle]}>
                  <FontAwesome5
                    name={iconName}
                    size={16}
                    color={iconColor}
                    solid={iconSolid}
                  />
                </Animated.View>
                
                <View style={styles.textContainer}>
                  <Text numberOfLines={1} style={[styles.lessonTitle, isCurrent && styles.lessonTitleCurrent]}>
                    {lesson.title || lesson.name}
                  </Text>
                  <Text style={styles.lessonStatus}>{statusLabel}</Text>
                </View>

                {isCurrent && (
                  <View style={styles.activeTag}>
                    <Text style={styles.activeTagText}>CURRENT</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
});

const TopicSection = ({ group, currentLessonId, onOpenLesson }) => {
  const scrollRef = useRef(null);
  const scrollX = useSharedValue(0);
  const cardWidthWithMargin = 230;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  useEffect(() => {
    const lessons = group.lessons || [];
    const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
    
    if (currentIndex >= 0 && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          x: Math.max(0, currentIndex * cardWidthWithMargin - 20),
          animated: true,
        });
      }, 500);
    }
  }, [currentLessonId, group.lessons]);

  return (
    <View style={styles.topicSection}>
      <View style={styles.topicHeader}>
        <Text style={styles.topicTitleText}>{(group.title || 'General Topic').toUpperCase()}</Text>
        <View style={styles.titleLine} />
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardRow}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        decelerationRate={0.85} // Slow down momentum for deliberate swipes
        snapToInterval={cardWidthWithMargin}
        snapToAlignment="start"
        disableIntervalMomentum={true} // Only advance by a single card per swipe
        bounces={false}
        overScrollMode="never"
        removeClippedSubviews={true}
      >
        {(group.lessons || []).map((lesson, index) => {
          const lessonLocked =
            lesson.locked === true ||
            lesson.status === 'locked' ||
            (!lesson.completed && !lesson.current && lesson.id !== currentLessonId);

          return (
            <LessonCard
              key={lesson.id}
              index={index}
              scrollX={scrollX}
              lesson={lesson}
              isCurrent={lesson.id === currentLessonId}
              isCompleted={!!lesson.completed}
              isLocked={lessonLocked}
              onPress={onOpenLesson}
            />
          );
        })}
        <View style={{ width: 80 }} />
      </Animated.ScrollView>
    </View>
  );
};

const groupLessons = (lessons, topics) => {
  const safeLessons = Array.isArray(lessons) ? lessons : [];
  const safeTopics = Array.isArray(topics) ? topics : [];
  const map = new Map();
  
  safeTopics.forEach(t => {
    map.set(t.id || t.topic_id || 'general', { 
      ...t, 
      title: t.title || t.name || 'General Topic',
      lessons: [] 
    });
  });

  safeLessons.forEach((lesson) => {
    const topicId = lesson.topicId || lesson.topic_id || 'general';
    if (!map.has(topicId)) {
      map.set(topicId, { 
        id: topicId, 
        title: lesson.topicTitle || lesson.topic || 'General Topics', 
        lessons: [] 
      });
    }
    map.get(topicId).lessons.push(lesson);
  });
  
  return Array.from(map.values()).filter(g => g.lessons && g.lessons.length > 0);
};

export default function CleanLearningPath({
  topics = [],
  lessons = [],
  currentLessonId,
  onOpenLesson,
  onScroll,
  refreshControl,
  additionalHeader,
}) {
  const grouped = useMemo(() => groupLessons(lessons, topics), [lessons, topics]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {additionalHeader}
        <View style={styles.headerSpacer} />
        {grouped.map((group) => (
          <TopicSection
            key={group.id || Math.random().toString()}
            group={group}
            currentLessonId={currentLessonId}
            onOpenLesson={onOpenLesson}
          />
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingTop: 8,
  },
  headerSpacer: {
    height: 4,
  },
  topicSection: {
    marginBottom: 16,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  topicTitleText: {
    color: brandTheme.text.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  titleLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginLeft: 12,
  },
  cardRow: {
    paddingLeft: 20,
    paddingVertical: 4,
  },
  cardWrapper: {
    marginRight: 10,
  },
  cardContainer: {
    width: 220,
    height: 64,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  currentCard: {
    borderColor: 'transparent', // Handled by gradientBorderLayer
    backgroundColor: 'rgba(0, 212, 199, 0.05)',
  },
  lockedCard: {
    opacity: 0.6,
  },
  gradientBorderLayer: {
    ...StyleSheet.absoluteFillObject,
    padding: 1.5, // The "border width"
    borderRadius: 14,
  },
  cardInnerContent: {
    flex: 1,
    borderRadius: 13,
    backgroundColor: '#020817', // Solid background matching app theme
    overflow: 'hidden',
  },
  currentCardInner: {
    backgroundColor: '#021014',
  },
  sideAccent: {
    position: 'absolute',
    width: 2.5,
    height: '100%',
    zIndex: 20,
    top: 0,
  },
  sideAccentLeft: {
    left: 0,
  },
  sideAccentRight: {
    right: 0,
  },
  cardMain: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconBoxCurrent: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  iconBoxCompleted: {
    backgroundColor: brandTheme.semantic.success,
    borderColor: brandTheme.semantic.success,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  lessonTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  lessonTitleCurrent: {
    color: COLORS.accent,
  },
  lessonStatus: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  activeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 212, 199, 0.15)',
    marginLeft: 8,
  },
  activeTagText: {
    color: COLORS.accent,
    fontSize: 8,
    fontWeight: '900',
  },
});


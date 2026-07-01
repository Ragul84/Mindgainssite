import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MotiView, useAnimationState } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { TopicOutline, TopicLesson } from '@/services/companion/topicOutliner';

const SCREEN = Dimensions.get('window');

const COLORS = {
  primary: '#00D4C7', // Signature Teal
  secondary: '#7C3AED', // Premium Violet
  success: '#48C586',
  locked: 'rgba(255, 255, 255, 0.02)',
  surface: 'transparent', // Let parent handle background
  glass: 'rgba(255, 255, 255, 0.04)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  text: '#FFFFFF',
  textMuted: '#8FA1B4',
};

interface PathFlowProps {
  outline: TopicOutline | null;
  onLessonPress: (lesson: TopicLesson) => void;
  onReset?: () => void;
}

const sanitizeText = (text: string) => {
  if (!text) return '';
  return text
    .replace(/\*\*/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .trim();
};

export const PathFlow: React.FC<PathFlowProps> = ({ outline, onLessonPress, onReset }) => {
  if (!outline) {
    return (
      <View style={styles.emptyContainer}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.emptyContent}
        >
          <LinearGradient
            colors={['rgba(0, 212, 199, 0.05)', 'rgba(0, 212, 199, 0.02)']}
            style={StyleSheet.absoluteFill}
          />
          <Ionicons name="map-outline" size={60} color="rgba(0, 212, 199, 0.2)" />
          <Text style={styles.emptyText}>Generate a blueprint above to chart your next mission.</Text>
        </MotiView>
      </View>
    );
  }

  const completedCount = outline.lessons.filter(l => l.status === 'completed').length;
  const progress = completedCount / outline.totalLessons;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.missionLabel}>CURRENT MISSION</Text>
          {onReset && (
            <TouchableOpacity onPress={onReset} style={styles.headerResetBtn}>
              <Ionicons name="refresh-outline" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.topicTitle}>{sanitizeText(outline.topic)}</Text>
        
        <View style={styles.progressCard}>
          <View style={styles.progressDetails}>
            <View style={styles.progressMain}>
              <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
              <Text style={styles.progressLabel}>INTEGRATED</Text>
            </View>
            <View style={styles.progressStats}>
              <Text style={styles.statsValue}>{completedCount}/{outline.totalLessons}</Text>
              <Text style={styles.statsLabel}>MODULES</Text>
            </View>
          </View>
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarTrack}>
              <MotiView 
                animate={{ width: `${progress * 100}%` }}
                transition={{ type: 'timing', duration: 1500, delay: 300 }}
                style={styles.progressBarFill} 
              >
                <LinearGradient
                  colors={[COLORS.primary, '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </MotiView>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.pathList}>
        {outline.lessons.map((lesson, index) => {
          const isCompleted = lesson.status === 'completed';
          const isCurrent = lesson.status === 'pending' && (index === 0 || outline.lessons[index - 1]?.status === 'completed');
          const isLocked = !isCompleted && !isCurrent;
          const isLast = index === outline.lessons.length - 1;

          return (
            <PathCard 
              key={lesson.id}
              index={index}
              lesson={lesson}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              isLocked={isLocked}
              isLast={isLast}
              onPress={() => onLessonPress(lesson)}
            />
          );
        })}
        <View style={{ height: 160 }} />
      </View>
    </View>
  );
};

const PathCard = ({ lesson, index, isCompleted, isCurrent, isLocked, isLast, onPress }: any) => {
  const interactionAnimation = useAnimationState({
    idle: { scale: 1, opacity: isLocked ? 0.4 : 1 },
    pressed: { scale: 0.96 },
    shake: {
      translateX: [-4, 4, -4, 4, 0],
    },
  });

  const handlePress = () => {
    if (isLocked) {
      interactionAnimation.transitionTo('shake');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  return (
    <View style={styles.cardWrapper}>
      {/* Cinematic Timeline Path */}
      <View style={styles.timelineContainer}>
        <View style={[
          styles.timelineTrack,
          isCompleted && styles.timelineTrackCompleted,
          isLast && { height: 40 }
        ]} />
        <MotiView 
          animate={{ 
            backgroundColor: isCompleted ? COLORS.primary : isCurrent ? COLORS.primary : 'rgba(255,255,255,0.05)',
            scale: isCurrent ? 1.25 : 1,
            shadowOpacity: isCurrent ? 0.5 : 0,
          }}
          style={[
            styles.timelineNode,
            isCompleted && { borderColor: COLORS.primary },
            isCurrent && { borderColor: '#FFF', borderWidth: 3 }
          ]} 
        >
          {isCompleted ? (
            <Ionicons name="checkmark" size={14} color="#000" />
          ) : isCurrent ? (
            <View style={styles.activeNodeInner} />
          ) : (
            <Text style={styles.nodeIndex}>{index + 1}</Text>
          )}
        </MotiView>
      </View>

      <MotiView 
        state={interactionAnimation}
        transition={{ type: 'spring', damping: 15 }}
        style={styles.cardContent}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={() => !isLocked && interactionAnimation.transitionTo('pressed')}
          onPressOut={() => !isLocked && interactionAnimation.transitionTo('idle')}
          onPress={handlePress}
          style={[
            styles.premiumCard,
            isCurrent && styles.premiumCardCurrent,
            isLocked && styles.premiumCardLocked
          ]}
        >
          <View style={styles.cardBody}>
            <View style={styles.textStack}>
              <View style={styles.cardMetaRow}>
                <Text style={styles.cardMeta}>MODULE {index + 1}</Text>
                {isCompleted && <Text style={styles.completedBadge}>MASTERED</Text>}
              </View>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {sanitizeText(lesson.title)}
              </Text>
            </View>

            <View style={[
              styles.actionBox,
              isCompleted && styles.actionBoxDone,
              isCurrent && styles.actionBoxCurrent
            ]}>
              {isCompleted ? (
                <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
              ) : isLocked ? (
                <Ionicons name="lock-closed" size={14} color="rgba(255,255,255,0.1)" />
              ) : (
                <Ionicons name="rocket" size={16} color={COLORS.primary} />
              )}
            </View>
          </View>
          
          {isCurrent && (
            <LinearGradient
              colors={['rgba(0, 212, 199, 0.12)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGlow}
            />
          )}
        </TouchableOpacity>
      </MotiView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: {
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  missionLabel: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    opacity: 0.8,
  },
  topicTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 32,
    marginBottom: 20,
  },
  headerResetBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  progressMain: {
    gap: 2,
  },
  progressPercent: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  progressLabel: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  progressStats: {
    alignItems: 'flex-end',
    gap: 2,
  },
  statsValue: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '800',
  },
  statsLabel: {
    color: COLORS.textMuted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  progressBarWrapper: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarTrack: {
    flex: 1,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  pathList: { paddingHorizontal: 20 },
  cardWrapper: { 
    flexDirection: 'row',
  },
  timelineContainer: {
    width: 40,
    alignItems: 'center',
  },
  timelineTrack: {
    position: 'absolute',
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: 0,
    bottom: 0,
  },
  timelineTrackCompleted: {
    backgroundColor: COLORS.primary,
    opacity: 0.2,
  },
  timelineNode: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    marginTop: 24,
    zIndex: 1,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
  },
  activeNodeInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  nodeIndex: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    fontWeight: '900',
  },

  cardContent: { flex: 1, paddingLeft: 8, paddingBottom: 24 },
  premiumCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 20,
    minHeight: 100,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  premiumCardCurrent: {
    backgroundColor: 'rgba(0, 212, 199, 0.05)',
    borderColor: 'rgba(0, 212, 199, 0.2)',
  },
  premiumCardLocked: {
    opacity: 1, // Let interactionAnimation handle opacity
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  cardGlow: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textStack: { flex: 1, gap: 4 },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardMeta: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  completedBadge: {
    color: '#10B981',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 24,
  },
  actionBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  actionBoxDone: { 
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.1)',
  },
  actionBoxCurrent: { 
    backgroundColor: 'rgba(0, 212, 199, 0.1)',
    borderColor: 'rgba(0, 212, 199, 0.2)',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#020617',
  },
  emptyContent: {
    width: '100%',
    alignItems: 'center',
    padding: 40,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 24,
    fontWeight: '600',
    paddingHorizontal: 20,
  },
});

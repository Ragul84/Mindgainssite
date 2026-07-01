// 🌟 Universal Celebration Modal - Shared across Study Hub, Quizzes, Battles, Snacks, etc.

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieAnimation, { MascotCelebrationAnimation } from '@/components/ui/LottieAnimation';

const { width } = Dimensions.get('window');

// Default spacing values
const S = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

interface UniversalCompletionProps {
  visible: boolean;
  score: number;
  totalQuestions: number;
  xpEarned: number;
  streakDays?: number;
  level?: number;
  onContinue: () => void;
  onShare?: () => void;
  context?:
    | 'quiz'
    | 'daily_snack'
    | 'battle'
    | 'daily_quiz'
    | 'subtopic_quiz'
    | 'study_hub'
    | 'achievement'
    | 'mission';
  contextData?: {
    title?: string;
    subject?: string;
    achievement?: string;
    activityType?: string;
    missionName?: string;
    achievementType?: string;
    isWinner?: boolean;
    opponentName?: string;
    readingTime?: number;
    sectionsCompleted?: number;
    totalSections?: number;
  };
}

interface StatChip {
  icon: string;
  value: string;
}

const focusHeadlines = [
  'Brain Mode: ON',
  'No Notifications Survived',
  'Focus? Achieved.',
  'Mind: 1, Distractions: 0',
  'Zen Master Certified',
  'Full Brain Sync',
  'Concentration Unlocked!',
  'Mission: Focus Accomplished',
  'Level-headed Legend',
  'Neurons Stayed Loyal',
];

const focusSubtitles = [
  'You studied like Wi-Fi never existed.',
  'Brain just saved progress — autosave ON.',
  'Knowledge secured in cloud storage: Brain.',
  'You actually focused? History will remember this.',
  'No reels, no regrets, only retention.',
  'You ghosted distractions like a pro.',
  'Knowledge uploaded to long-term memory.',
  'That dopamine hit was pure education.',
  'You studied harder than your phone battery.',
  'Neural download complete — 100% charged.',
];

const quizHeadlines = [
  'Download complete.',
  'Knowledge flexed.',
  'Mind leveled up!',
  'Lesson conquered!',
  'Upgrade successful.',
  'XP absorbed.',
  'Synapses celebrating!',
  'Grey cells doing push-ups!',
  'Brain buffed up!',
  'Quiz conquered like a legend.',
];

const quizSubtitles = [
  'Smartness_v2.0.zip successfully installed.',
  "You're officially smarter than five minutes ago.",
  'Your neurons are high-fiving each other.',
  'New fact added to your mental playlist.',
  'Brain firmware now running smoother.',
  'Legend mode learning streak unlocked.',
  "Einstein's getting nervous right now.",
  'That topic never stood a chance.',
  'Brains gains delivered — zero side quests.',
  'Another badge on the knowledge sash.',
];

const battleHeadlines = [
  'Victory loaded!',
  'Arena conquered!',
  'Battle brain online!',
  'Trophy secured!',
  'You outplayed the grid.',
];

const battleSubtitles = [
  'Opponent left on read.',
  'Neurons executed a perfect combo.',
  'Zero lag. Pure dominance.',
  'XP raining like confetti.',
  'Leaderboard climb officially underway.',
];

const defaultHeadlines = [
  'Mission accomplished!',
  'XP secured!',
  'Level up locked in!',
];

const defaultSubtitles = [
  'Brain gains synced to the cloud.',
  'Momentum unlocked — keep the streak alive.',
  'Celebrate now, conquer the next one shortly.',
];

const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const getCopy = (
  context: UniversalCompletionProps['context']
): { headline: string; subtitle: string } => {
  switch (context) {
    case 'study_hub':
      return {
        headline: pickRandom(focusHeadlines),
        subtitle: pickRandom(focusSubtitles),
      };
    case 'battle':
      return {
        headline: pickRandom(battleHeadlines),
        subtitle: pickRandom(battleSubtitles),
      };
    case 'quiz':
    case 'daily_quiz':
    case 'subtopic_quiz':
      return {
        headline: pickRandom(quizHeadlines),
        subtitle: pickRandom(quizSubtitles),
      };
    default:
      return {
        headline: pickRandom(defaultHeadlines),
        subtitle: pickRandom(defaultSubtitles),
      };
  }
};

const formatMinutes = (value?: number) => {
  if (!value) return '1m';
  const minutes = Math.max(1, Math.round(value));
  return `${minutes}m`;
};

export default function UniversalCompletion(props: UniversalCompletionProps) {
  const {
    visible,
    score,
    totalQuestions,
    xpEarned,
    streakDays = 0,
    onContinue,
    onShare,
    context = 'quiz',
    contextData,
  } = props;

  const insets = useSafeAreaInsets();

  const { headline, subtitle } = useMemo(() => getCopy(context), [context, visible]);

  const accuracy = useMemo(() => {
    if (!totalQuestions) return null;
    const raw = Math.round((score / Math.max(totalQuestions, 1)) * 100);
    return `${raw}%`;
  }, [score, totalQuestions]);

  const headerLabel = useMemo(() => {
    return (
      contextData?.title ||
      contextData?.missionName ||
      contextData?.achievement ||
      contextData?.subject ||
      null
    );
  }, [contextData]);

  const statItems: StatChip[] = useMemo(() => {
    const items: StatChip[] = [];

    if (context === 'study_hub' && contextData) {
      const completed = contextData.sectionsCompleted ?? 0;
      const total = contextData.totalSections ?? Math.max(completed, 1);
      items.push({ icon: 'book', value: `${completed}/${total}` });

      if (total) {
        const pct = Math.round((completed / Math.max(total, 1)) * 100);
        items.push({ icon: 'percent', value: `${pct}%` });
      }

      if (contextData.readingTime) {
        items.push({ icon: 'clock', value: formatMinutes(contextData.readingTime) });
      }
    } else {
      if (totalQuestions > 0) {
        items.push({ icon: 'check', value: `${score}/${totalQuestions}` });
      }

      if (accuracy) {
        items.push({ icon: 'percent', value: accuracy });
      }

      if (context === 'battle') {
        const label = contextData?.isWinner ? 'Win' : 'Next Time';
        items.unshift({ icon: 'trophy', value: label });
        if (contextData?.opponentName) {
          items.push({ icon: 'user', value: `vs ${contextData.opponentName}` });
        }
      }
    }

    if (streakDays > 0) {
      items.push({ icon: 'fire', value: `${streakDays} day` });
    }

    return items.slice(0, 3);
  }, [context, contextData, totalQuestions, score, accuracy, streakDays]);

  if (!visible) return null;

  return (
    <View style={[styles.overlay, { paddingTop: insets.top + S.xl, paddingBottom: insets.bottom + S.xl }] }>
      <LottieAnimation
        source={require('@/assets/animations/celebration.json')}
        loop
        size="fill"
        containerStyle={styles.backgroundCelebration}
        style={{ opacity: 0.45 }}
      />

      <View style={styles.cardContainer}>
        <LinearGradient
          colors={['rgba(20,28,48,0.95)', 'rgba(12,18,33,0.95)']}
          style={styles.card}
        >
          <View style={styles.headerRow}>
            {headerLabel && (
              <Text style={styles.subjectLabel}>{headerLabel}</Text>
            )}
          </View>

          <View style={styles.mascotContainer}>
            <MascotCelebrationAnimation size={Math.min(width * 0.5, 220)} />
          </View>

          <LinearGradient
            colors={['#8b5cf6', '#3b82f6']}
            style={styles.xpPill}
          >
            <FontAwesome5 name="bolt" size={16} color="#FFFFFF" />
            <Text style={styles.xpLabel}>+{xpEarned} XP</Text>
          </LinearGradient>

          <View style={styles.messageBlock}>
            <Text style={styles.messageTitle}>{headline}</Text>
            <Text style={styles.messageSubtitle}>{subtitle}</Text>
          </View>

          {statItems.length > 0 && (
            <View style={styles.metricsRow}>
              {statItems.map((stat, index) => (
                <View key={`${stat.icon}-${index}`} style={styles.metricChip}>
                  <FontAwesome5 name={stat.icon} size={14} color="#A5B4FC" />
                  <Text style={styles.metricValue}>{stat.value}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity onPress={onContinue} activeOpacity={0.9} style={styles.ctaButton}>
            <LinearGradient
              colors={['#8b5cf6', '#3b82f6']}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaLabel}>Continue</Text>
              <FontAwesome5 name="arrow-right" size={14} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          {onShare && (
            <TouchableOpacity onPress={onShare} style={styles.shareButton}>
              <FontAwesome5 name="share-alt" size={14} color="#94A3B8" />
              <Text style={styles.shareLabel}>Share victory</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(4, 7, 14, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: S.lg,
  },
  backgroundCelebration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 380,
  },
  card: {
    padding: S.xl,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.15)',
    gap: S.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mascotContainer: {
    alignItems: 'center',
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: S.xl,
    paddingVertical: S.sm,
    borderRadius: 14,
  },
  xpLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontWeight: '600',
  },
  messageBlock: {
    gap: 4,
    alignItems: 'center',
  },
  messageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  messageSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: S.md,
  },
  metricChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(15,23,42,0.78)',
    borderRadius: 14,
    paddingVertical: S.sm,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.12)',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: S.md,
  },
  ctaLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  shareButton: {
    marginTop: S.sm,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: S.sm,
    paddingHorizontal: S.md,
  },
  shareLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontFamily: 'Inter-Medium',
  },
});

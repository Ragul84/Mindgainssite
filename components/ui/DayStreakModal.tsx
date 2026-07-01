import React, { useEffect, useMemo, useRef } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LottieView from 'lottie-react-native';

import { useM3Theme } from '@/theme/M3ThemeProvider';

type DayStreakMode = 'prompt' | 'celebration';

interface DayStreakModalProps {
  visible: boolean;
  mode: DayStreakMode;
  currentStreak: number;
  needsDailyDose?: boolean;
  needsDailySnack?: boolean;
  onClose: () => void;
  onCtaPress?: () => void;
}

const dayStreakAnimation = require('@/assets/mascot/daystreak.json');
const fireLoopAnimation = require('@/assets/mascot/Fire.json');

export function DayStreakModal({
  visible,
  mode,
  currentStreak,
  needsDailyDose = false,
  needsDailySnack = false,
  onClose,
  onCtaPress,
}: DayStreakModalProps) {
  const theme = useM3Theme();
  const animationRef = useRef<LottieView>(null);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: 'rgba(4, 16, 36, 0.85)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        },
        card: {
          width: '100%',
          borderRadius: 28,
          paddingHorizontal: 22,
          paddingBottom: 24,
          paddingTop: 18,
          backgroundColor: 'rgba(12, 26, 46, 0.96)',
          borderWidth: 1,
          borderColor: 'rgba(34, 211, 238, 0.24)',
          alignItems: 'center',
        },
        animation: {
          width: 220,
          height: 220,
          marginBottom: 12,
        },
        promptAnimation: {
          width: 160,
          height: 160,
          marginBottom: 4,
        },
        headline: {
          fontFamily: theme.typography.headlineSmall.fontFamily,
          fontSize: 22,
          color: theme.colors.onSurface,
          textAlign: 'center',
          marginBottom: 8,
        },
        subtext: {
          fontFamily: theme.typography.bodyMedium.fontFamily,
          fontSize: 14,
          lineHeight: 20,
          color: theme.colors.onSurfaceVariant,
          textAlign: 'center',
          marginBottom: 20,
        },
        primaryButton: {
          width: '100%',
          borderRadius: 16,
          paddingVertical: 14,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.primary,
          marginBottom: 12,
        },
        primaryLabel: {
          fontFamily: theme.typography.labelLarge.fontFamily,
          fontWeight: '700',
          fontSize: 16,
          color: theme.colors.onPrimary,
        },
        secondaryButton: {
          paddingVertical: 6,
          paddingHorizontal: 12,
        },
        secondaryLabel: {
          fontFamily: theme.typography.bodyMedium.fontFamily,
          fontSize: 14,
          color: theme.colors.onSurfaceVariant,
        },
      }),
    [theme]
  );

  useEffect(() => {
    if (visible && mode === 'celebration') {
      animationRef.current?.reset();
      animationRef.current?.play();
    }
  }, [visible, mode]);

  const formattedDayLabel = useMemo(() => {
    const day = Math.max(currentStreak || 0, 1);
    return `DAY-${day}`;
  }, [currentStreak]);

  const headline = useMemo(() => {
    if (mode === 'celebration') {
      return `${formattedDayLabel} secured!`;
    }

    return currentStreak > 0
      ? `Protect your ${formattedDayLabel} streak`
      : 'Launch your DAY-1 streak';
  }, [mode, currentStreak, formattedDayLabel]);

  const subtext = useMemo(() => {
    if (mode === 'celebration') {
      return 'Daily Dose + Daily Snack complete. Turn up tomorrow to keep the flame burning and make it another productive day.';
    }

    const pending: string[] = [];
    if (needsDailyDose) pending.push('Daily Dose');
    if (needsDailySnack) pending.push('Daily Snack');

    const pendingCopy = pending.length
      ? `Finish ${pending.join(' & ')} to register today’s streak.`
      : 'Complete both Daily Dose and Daily Snack today to lock in your progress.';

    return `${pendingCopy} Miss a day and the flame resets, so stay on it.`;
  }, [mode, needsDailyDose, needsDailySnack]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {mode === 'celebration' ? (
            <LottieView
              ref={animationRef}
              source={dayStreakAnimation}
              loop={false}
              autoPlay
              style={styles.animation}
            />
          ) : (
            <LottieView
              source={fireLoopAnimation}
              autoPlay
              loop
              style={styles.promptAnimation}
            />
          )}

          <Text style={styles.headline}>{headline}</Text>
          <Text style={styles.subtext}>{subtext}</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.9}
            onPress={() => {
              onCtaPress?.();
              onClose();
            }}
          >
            <Text style={styles.primaryLabel}>
              {mode === 'celebration' ? 'See you tomorrow!' : 'I’ll finish now'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryLabel}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export type { DayStreakMode, DayStreakModalProps };

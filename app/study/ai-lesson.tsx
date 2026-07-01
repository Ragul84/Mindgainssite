import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import UniversalNavigation from '@/utils/universalNavigation';
import { useAuth } from '@/hooks/useAuth';
import PremiumDeepLessonReader from '@/components/ui/PremiumDeepLessonReader';
import { UnifiedLoader } from '@/components/ui/UnifiedLoader';
import { XPSystem } from '@/utils/xpSystem';
import { StreakService } from '@/utils/streakService';
import HapticService from '@/utils/hapticService';

export default function AILessonScreen() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [aiLesson, setAiLesson] = useState<any>(null);

  useEffect(() => {
    async function initLesson() {
      if (!user?.id) return;

      const { aiLessonCache } = require('@/utils/aiLessonCache');
      const lesson = aiLessonCache.getLesson();

      if (lesson) {
        setAiLesson(lesson);
        setTimeout(() => {
          setIsLoading(false);
          HapticService.light();
        }, 1500);
      } else {
        console.warn('No AI lesson found in cache');
        UniversalNavigation.goBack();
      }
    }
    initLesson();
  }, [user?.id]);

  const handleComplete = async () => {
    console.log('🎊 AI lesson completed!');

    if (user?.id) {
      try {
        const xpReward = XPSystem.calculateLessonXP({
          isFirstLesson: false,
          streakDays: 0,
        });
        await XPSystem.awardXP(user.id, xpReward);
        await StreakService.updateStreakOnLessonComplete(user.id);

        const { CompanionOrchestrator } = require('@/services/companion/orchestrator');
        const { supabase } = require('@/utils/supabase');
        const { mascotApi } = require('@/services/mascotApi');
        const orchestrator = new CompanionOrchestrator(user.id, supabase, mascotApi);
        await orchestrator.hydrate();

        const cards = orchestrator.getCards();
        const pathCard = cards.find(c => c.type === 'topicPath');
        if (pathCard && aiLesson?.lessonId) {
          await orchestrator.completeLesson(pathCard.id, aiLesson.lessonId);
        }
      } catch (error) {
        console.error('Error in AI lesson completion logic:', error);
      }
    }

    UniversalNavigation.replaceTo({
      pathname: '/learn/blueprint',
      params: {
        section: 'lessons',
        fromLesson: 'true',
        celebrationMessage: `${aiLesson?.title || 'Lesson'} Complete!`,
      },
    });
  };

  const handleBack = () => {
    UniversalNavigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <UnifiedLoader
          message="Preparing your lesson..."
          context="study"
          fullScreen={true}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PremiumDeepLessonReader
        lesson={aiLesson}
        onComplete={handleComplete}
        onBack={handleBack}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
  },
});

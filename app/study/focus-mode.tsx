import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import FocusModeLesson from '@/components/ui/FocusModeLesson';
import { tutor } from '@/services/companion/tutor';
import { useAuthContext } from '@/components/AuthProvider';
import { RewardService } from '@/services/rewardService';

export default function FocusModeScreen() {
  const { topic } = useLocalSearchParams();
  const { user } = useAuthContext();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topic || !user) return;

    async function fetchLesson() {
      try {
        const stats = await RewardService.getUserStats();
        const res = await tutor.generate({
          topic: topic as string,
          exam: stats?.subscription_tier === 'premium' ? 'UPSC' : 'General',
          language: 'English',
        });
        
        if (res.blueprint) {
          // Map LearningBlueprint to FocusModeLesson format
          const bp = res.blueprint;
          const mappedLesson = {
            sections: [
              {
                id: 'intro',
                title: bp.blueprint_focus,
                content: bp.learning_goal,
              },
              {
                id: 'prime',
                title: 'The Hook',
                content: bp.prime.message,
              },
              ...bp.core_facts.map((f, i) => ({
                id: `fact-${i}`,
                title: f.tag.toUpperCase(),
                content: f.fact,
                interaction: {
                  type: 'flashcard' as const,
                  data: { revealedText: 'Mastered!' }
                }
              })),
              {
                id: 'lock',
                title: bp.memory_lock.title,
                content: bp.memory_lock.bullets.join('\n• '),
              }
            ],
            quiz: bp.checkpoint_quiz.map(q => ({
              question: q.question,
              options: q.options,
              answer: q.answer,
              explanation: q.why
            }))
          };
          setLesson(mappedLesson);
        } else {
          console.warn('No blueprint returned from Tutor');
          router.back();
        }
      } catch (error) {
        console.error('Failed to start Focus Mode:', error);
        router.back();
      } finally {
        setLoading(false);
      }
    }

    fetchLesson();
  }, [topic, user]);

  const handleComplete = async (score: number, weakTopics: string[]) => {
    // Award XP if applicable - for now just log
    console.log('[FocusMode] Completed', { score, weakTopics });
    
    router.replace({
      pathname: '/(tabs)/mascot',
      params: { lastScore: score, topic }
    });
  };

  const handleEvent = (event: string, data?: any) => {
    console.log('[FocusMode] Event:', event, data);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00D4C7" />
        <Text style={styles.loadingText}>Coaching MIGA to prepare your story...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {lesson && (
        <FocusModeLesson 
          lesson={lesson} 
          onComplete={handleComplete}
          onEvent={handleEvent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  loading: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 20, color: '#94A3B8', fontWeight: '600' }
});

// Concept Fighter - Main Tab Screen Wrapper
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { KnowledgeHeistContainer } from '@/components/ui/knowledge-heist';
import { useAuthContext } from '@/components/AuthProvider';
import { useUserStats } from '@/hooks/useUserStats';
import { SupabaseService } from '@/utils/supabaseService';

const SUBJECT_TO_VAULT: Record<string, { id: string; name: string }> = {
  polity: { id: 'polity', name: 'Polity' },
  science: { id: 'science', name: 'Science' },
  history: { id: 'history', name: 'History' },
  economy: { id: 'economy', name: 'Economy' },
  'current affairs': { id: 'current-affairs', name: 'Current Affairs' },
};

export default function ArenaTab() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { userStats, totalMGTokens, currentStreak, refreshStats } = useUserStats();
  const [recommendedVault, setRecommendedVault] = useState<{ id: string; name: string; reason: string } | null>(null);

  // Refresh stats on page focus
  useFocusEffect(
    React.useCallback(() => {
      refreshStats();
    }, [])
  );

  useEffect(() => {
    let isMounted = true;
    const loadRecommendedVault = async () => {
      if (!user?.id) return;
      try {
        const studyPlan = await SupabaseService.getPersonalizedStudyPlan(user.id);
        const weakest = studyPlan?.weakAreas?.[0];
        const normalizedSubject = String(weakest?.subject || '').trim().toLowerCase();
        const mappedVault = SUBJECT_TO_VAULT[normalizedSubject];
        if (!isMounted) return;
        if (mappedVault) {
          setRecommendedVault({
            id: mappedVault.id,
            name: mappedVault.name,
            reason: 'based on your weakest recent quiz area',
          });
        } else {
          setRecommendedVault(null);
        }
      } catch (error) {
        if (isMounted) {
          setRecommendedVault(null);
        }
      }
    };

    loadRecommendedVault();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleExit = () => {
    // Navigating back to home when exiting the game
    router.replace('/home');
  };

  const heistUserStats = {
    level: 1,
    mgTokens: totalMGTokens || 0, // Will be overridden by container's localMGTokens
    gamesPlayed: 0,
    winRate: 0,
    winStreak: currentStreak || 0,
    battlesRemaining: 5,
    dailyMission: {
      title: "Complete 2 Concept Battles for deep assessment",
      progress: 0,
      total: 2,
    },
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <KnowledgeHeistContainer 
        onExit={handleExit}
        refreshStats={refreshStats}
        recommendedVaultId={recommendedVault?.id || null}
        recommendedVaultName={recommendedVault?.name || null}
        recommendedReason={recommendedVault?.reason || null}
        userStats={heistUserStats}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});

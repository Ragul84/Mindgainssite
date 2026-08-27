// MindClash - Main Container (Connected to Real Backend)

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, BackHandler, Alert } from 'react-native';
import HeistLandingScreen from './HeistLandingScreen';
import VaultSelection from './VaultSelection';
import VaultSelectionPremium from './VaultSelectionPremium';
import Matchmaking from './Matchmaking';
import MatchmakingPremium from './MatchmakingPremium';
import TeamReady from './TeamReady';
import TeamReadyPremium from './TeamReadyPremium';
import GameStartAnimation from './GameStartAnimation';
import GameScreenComponent from './GameScreen';
import BattleArena from './BattleArena';
import GameResults from './GameResults';
import HeistResultsPremium from './HeistResultsPremium';
import Leaderboard from './Leaderboard';
import HeistStore from './HeistStore';
import HeistTutorial from './HeistTutorial';
import { MindClashGameService } from '@/services/knowledgeHeistService';

import { useAuthContext } from '@/components/AuthProvider';
import { supabase } from '@/utils/supabase';
import ExitConfirmationSheet from '../ExitConfirmationSheet';
import { HeistSoundService } from '@/services/heistSoundService';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RewardService } from '@/services/rewardService';

type GameScreen = 
  | 'entry' 
  | 'vault-selection' 
  | 'matchmaking' 
  | 'team-ready'
  | 'game-start' 
  | 'game' 
  | 'results' 
  | 'leaderboard'
  | 'store';

interface KnowledgeHeistContainerProps {
  onExit: () => void;
  refreshStats: () => void;
  recommendedVaultId?: string | null;
  recommendedVaultName?: string | null;
  recommendedReason?: string | null;
  userStats: {
    level: number;
    mgTokens: number;
    gamesPlayed: number;
    winRate: number;
    winStreak: number;
    battlesRemaining: number;
    dailyMission: {
      title: string;
      progress: number;
      total: number;
    };
  };
}

interface UserProfile {
  userName: string;
  userState: string | null;
  userLevel: number;
  userAvatar: string;
}

export default function KnowledgeHeistContainer({
  onExit,
  refreshStats,
  userStats,
  recommendedVaultId,
  recommendedVaultName,
  recommendedReason,
}: KnowledgeHeistContainerProps): React.JSX.Element {
  // Debug: Log received stats
  console.log('[MindClash] KnowledgeHeistContainer received stats:', userStats);

  
  const { user } = useAuthContext();
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('entry');
  const [selectedVault, setSelectedVault] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<'pvp' | 'pvq'>('pvp');
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameRank, setGameRank] = useState<number>(0);
  const [mgEarned, setMgEarned] = useState<number>(0);
  const [xpEarned, setXpEarned] = useState<number>(0);
  const [gameInsight, setGameInsight] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [gameQuestions, setGameQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialGameLoading, setInitialGameLoading] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Fetch real user profile on mount
  useEffect(() => {
    // Show splash for 2.5s
    const timer = setTimeout(() => {
      setInitialGameLoading(false);
    }, 2500);

    loadUserProfile();
    checkTutorialStatus();
    
    // Initialize sound service
    HeistSoundService.initialize().then(() => {
      HeistSoundService.preloadGameSounds();
      // Start background music
      HeistSoundService.play('background', { volume: 0.3 });
    });

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleRequestExit();
      return true; // Prevent default behavior
    });

    return () => {
      // Cleanup on unmount
      backHandler.remove();
      HeistSoundService.cleanup();
      clearTimeout(timer);
    };
  }, [user, currentScreen]);

  // Local MG coins state - fetched from database
  const [localMGTokens, setLocalMGTokens] = useState<number | null>(null);
  const effectiveMGTokens = localMGTokens ?? userStats.mgTokens ?? 0;

  useEffect(() => {
    if (typeof userStats.mgTokens === 'number' && userStats.mgTokens !== localMGTokens) {
      setLocalMGTokens(userStats.mgTokens);
    }
  }, [userStats.mgTokens, localMGTokens]);

  const loadUserProfile = async () => {
    if (!user?.id) return;

    try {

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('full_name, state, email, total_xp, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      const stats = await RewardService.getUserStats();
      const mgBalance =
        profile?.total_xp ??
        stats?.total_xp ??
        stats?.coins ??
        userStats.mgTokens ??
        0;

      if (profile) {
        console.log('[MindClash] Loaded profile:', { total_xp: profile.total_xp });

        setUserProfile({
          userName: profile.full_name || profile.email || 'Player',
          userState: profile.state,
          userLevel: userStats.level || 1,
          userAvatar: profile.avatar_url || '',
        });

        const dailyResult = await MindClashGameService.checkAndGrantDailyBoosters(user.id);
        if (dailyResult.granted) {
          console.log('Daily boosters granted!');
        }
      } else if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      } else {
        setUserProfile({
          userName: user.email || 'Player',
          userState: null,
          userLevel: userStats.level || 1,
          userAvatar: '',
        });
      }

      setLocalMGTokens(mgBalance);

    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };


  const checkTutorialStatus = async () => {
    try {
      const hasSeenTutorial = await AsyncStorage.getItem('mindclash_tutorial_seen');

      if (!hasSeenTutorial) {
        setShowTutorial(true);
      }
    } catch (e) {
      console.error('Tutorial status error:', e);
    }
  };

  const handleTutorialComplete = async () => {
    try {
      await AsyncStorage.setItem('mindclash_tutorial_seen', 'true');

      setShowTutorial(false);
    } catch (e) {
      console.error('Error saving tutorial status:', e);
      setShowTutorial(false);
    }
  };
  const handleStartClash = (mode: 'pvp' | 'pvq' = 'pvp') => {
    setSelectedMode(mode);
    HeistSoundService.playTransition();
    setCurrentScreen('vault-selection');
  };

  const handleVaultSelect = async (vaultId: string) => {
    if (!user?.id) {
      Alert.alert('Error', 'Please log in to play');
      return;
    }

    setLoading(true);

    try {
      // Find a match (joins or creates a session)
      const result = await MindClashGameService.findMatch(vaultId, user.id);
      
      if (result.sessionId) {
        setSelectedVault(vaultId);
        setCurrentScreen('matchmaking');
        setGameSessionId(result.sessionId);
        const sessionId = result.sessionId;
        
        // Poll for game status (wait for other players)
        const pollInterval = setInterval(async () => {
          const session = await MindClashGameService.getGameSession(sessionId);
          
          if (session && session.status === 'ready') {
            clearInterval(pollInterval);
            
            // Fetch questions for this session
            const questions = await MindClashGameService.getSessionQuestions(sessionId);
            setGameQuestions(questions);
            
            setLoading(false);
            setCurrentScreen('team-ready');
          }
        }, 1000);

        // Auto-advance
        const matchTimeout = (selectedMode === 'pvq' || sessionId.startsWith('local_')) ? 500 : 15000;
        setTimeout(async () => {
          clearInterval(pollInterval);
          // Initialize session correctly for solo/pvq play
          await MindClashGameService.forceStartWithBots(sessionId, vaultId);
          const questions = await MindClashGameService.getSessionQuestions(sessionId);
          setGameQuestions(questions);
          setLoading(false);
          setCurrentScreen('team-ready');
        }, matchTimeout);
      } else {
        // Handle Errors (locked vault, insufficient MG, limit reached)
        if (result.error?.includes('Vault Locked')) {
          Alert.alert(
            "Vault Locked",
            "This is the Elite General Vault. Requires a one-time unlock of 10,000 MG. Unlock now?",
            [
              { text: "Later", style: "cancel" },
              { 
                text: "Unlock 10k MG", 
                onPress: async () => {
                   const unlockResult = await MindClashGameService.unlockVault(vaultId, user.id);
                   if (unlockResult.success) {
                     Alert.alert("Success!", "Vault unlocked. Ready to CLASH!");

                     refreshStats(); // Update MG balance
                     handleVaultSelect(vaultId); // Try entering again
                   } else {
                     Alert.alert("Failed", unlockResult.error || "Check your MG balance.");
                   }
                } 
              }
            ]
          );
        } else {
          Alert.alert("Access Denied", result.error || "Matchmaking failed. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error in matchmaking:', error);
      Alert.alert('Matchmaking error', 'Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchFound = () => {
    setCurrentScreen('team-ready');
  };

  const handleTeamReady = () => {
    setCurrentScreen('game');
  };

  const handleGameComplete = async (score: number) => {
    if (!user?.id || !gameSessionId) {
      setCurrentScreen('results');
      return;
    }

    setGameScore(score);

    try {
      // Complete game and get results from backend
      const result = await MindClashGameService.completeGameSession(
        gameSessionId,
        user.id,
        score
      );

      if (result) {
        setGameRank(result.rank);
        setMgEarned(result.mgEarned);
        setXpEarned(result.xpEarned);
        setGameInsight(result.insight);
        // Refresh global stats to show updated XP/Coins
        refreshStats();
      }
    } catch (error) {
      console.error('Error completing game:', error);
    }

    setCurrentScreen('results');
  };

  const handlePlayAgain = () => {
    setGameSessionId(null);
    setGameScore(0);
    setGameRank(0);
    setCurrentScreen('vault-selection');
  };

  const handleShowLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };

  const handleCloseLeaderboard = () => {
    setCurrentScreen('game');
  };

  const handleExit = () => {
    HeistSoundService.stopBackground();
    setShowExitConfirm(false);
    onExit();
  };

  const handleAbandonClash = () => {

    setShowExitConfirm(false);
    HeistSoundService.playTransition();
    setGameSessionId(null);
    setGameQuestions([]);
    setCurrentScreen('entry');
  };

  const handleRequestExit = () => {
    if (currentScreen === 'entry') {
      handleExit();
      return;
    }

    if (currentScreen === 'results' || currentScreen === 'leaderboard' || currentScreen === 'store') {
      HeistSoundService.playTransition();
      setCurrentScreen('entry');
      return;
    }

    if (currentScreen === 'vault-selection') {
      HeistSoundService.playTransition();
      setCurrentScreen('entry');
      return;
    }

    setShowExitConfirm(true);
  };

  const handleOpenStore = () => {
    setCurrentScreen('store');
  };

  const handlePurchase = async (item: any) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const result = await MindClashGameService.purchaseItem(user.id, item);
      
      if (result.success) {
        HeistSoundService.play('correct', { volume: 0.8 });
        Alert.alert('Success', result.message);
        await refreshStats();
      } else {
        Alert.alert('Purchase Failed', result.message);
      }
    } catch (error) {
      console.error('Purchase flow error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVaultName = () => {
    const vaultNames: Record<string, string> = {
      'polity': 'Polity Vault',
      'science': 'Science Vault',
      'economy': 'Economy Vault',
      'history': 'History Vault',
      'geography': 'Geography Vault',
      'current-affairs': 'Current Affairs Vault',
      'general': 'The Elite Vault (General)',
    };
    return vaultNames[selectedVault] || 'Knowledge Vault';

  };

  if (initialGameLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <LottieView
          source={require('@/assets/lotties/loadingscreen.json')}
          autoPlay
          loop
          style={styles.loadingLottie}
        />
        <Text style={styles.loadingText}>
          {selectedMode === 'pvq' ? 'ENTERING DUNGEON ARENA...' : 'MATCHING DUELING ASPIRANTS...'}
        </Text>

      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentScreen === 'entry' && (
        <HeistLandingScreen
          onStartClash={handleStartClash}
          onExit={handleRequestExit}
          onOpenStore={handleOpenStore}
          onShowLeaderboard={handleShowLeaderboard}
          recommendedVaultName={recommendedVaultName}
          recommendedReason={recommendedReason}
          userStats={{
            ...userStats,
            mgTokens: effectiveMGTokens,
            winStreak: userStats.winStreak || 0,
            battlesRemaining: userStats.battlesRemaining || 5,
            dailyMission: userStats.dailyMission || {
                progress: 1,
                total: 2
            }
          }}
        />
      )}

      {currentScreen === 'vault-selection' && (
        <VaultSelectionPremium
          onSelectVault={handleVaultSelect}
          onBack={() => setCurrentScreen('entry')}
          recommendedVaultId={recommendedVaultId}
        />
      )}

      {currentScreen === 'matchmaking' && (
        <MatchmakingPremium
          onMatchFound={handleMatchFound}
          onExit={handleRequestExit}
          vaultName={getVaultName()}
          mode={selectedMode}
        />
      )}

      {currentScreen === 'team-ready' && (
        <TeamReadyPremium 
          vaultName={getVaultName()}
          onStart={handleTeamReady}
          onExit={handleRequestExit}
          mode={selectedMode}
        />
      )}

      {currentScreen === 'game' && (
        <BattleArena 
          onComplete={handleGameComplete}
          onExit={handleExit}
          onOpenStore={() => setCurrentScreen('store')}
          onOpenLeaderboard={() => setCurrentScreen('leaderboard')}
          effectiveCoins={effectiveMGTokens}
          onCoinsUpdated={(newCoins) => setLocalMGTokens(newCoins)}
          vaultName={getVaultName()}
          questions={gameQuestions}
          userId={user?.id}
          sessionId={gameSessionId}
          mode={selectedMode}
          userAvatarUrl={userProfile?.userAvatar || ''}
        />
      )}


      {currentScreen === 'results' && (
        <HeistResultsPremium
          score={gameScore}
          rank={gameRank}
          mgEarned={mgEarned}
          xpEarned={xpEarned}
          insight={gameInsight}
          vaultName={getVaultName()}
          onPlayAgain={handlePlayAgain}
          onExit={handleExit}
        />
      )}

      {currentScreen === 'leaderboard' && (
        <Leaderboard
          onClose={handleCloseLeaderboard}
          currentUserRank={userStats.rank ?? null}
        />
      )}

      {currentScreen === 'store' && (
        <HeistStore
          userMg={effectiveMGTokens}
          onBack={() => setCurrentScreen('game')}
          onPurchase={handlePurchase}
        />
      )}

      <ExitConfirmationSheet
        visible={showExitConfirm}
        onConfirm={handleAbandonClash}

        onCancel={() => setShowExitConfirm(false)}
        title="Exit Battle?"
        description="Your progress will be lost. Are you sure you want to stop playing?"
        confirmLabel="Exit Now"
        cancelLabel="Stay and Win"

      />

      {showTutorial && (
        <HeistTutorial onComplete={handleTutorialComplete} />
      )}

      {loading && (
        <View style={styles.overlayLoading}>
          <ActivityIndicator size="large" color="#0EA5E9" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // V2026 Minimal Background
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#0EA5E9',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  loadingLottie: {
    width: 200,
    height: 200,
  },
  overlayLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});


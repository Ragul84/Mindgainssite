import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { HeistSoundService } from '@/services/heistSoundService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GameResultsProps {
  score: number;
  rank: number;
  mgEarned: number;
  xpEarned: number;
  insight: string;
  onPlayAgain: () => void;
  onExit: () => void;
}

export default function GameResults({
  score,
  rank,
  mgEarned,
  xpEarned,
  insight,
  onPlayAgain,
  onExit,
}: GameResultsProps) {
  const isVictory = rank === 1;
  const rankColor = isVictory ? '#FACC15' : (rank === 2 ? '#9CA3AF' : (rank === 3 ? '#B45309' : '#4B5563'));

  // Animations
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.8)).current;
  const cardRotate = useRef(new Animated.Value(-5)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const rewardPop = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sound logic
    if (isVictory) {
      HeistSoundService.playVictory();
    } else {
      HeistSoundService.playDefeat();
    }
    
    // Play reward sound after a delay
    setTimeout(() => {
      HeistSoundService.playReward();
    }, 1200);

    // Initial sequence
    Animated.sequence([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(cardScale, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(cardRotate, {
          toValue: 0,
          tension: 60,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(contentFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(rewardPop, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();

    // Pulse animation for victory
    if (isVictory) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.gridOverlay} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        
        {/* Confetti / Ray effects can go here behind the card */}

        <Animated.View 
          style={[
            styles.cardContainer, 
            { 
              opacity: backdropOpacity,
              transform: [
                { scale: cardScale },
                { rotate: cardRotate.interpolate({
                  inputRange: [-5, 0],
                  outputRange: ['-5deg', '0deg']
                })}
              ]
            }
          ]}
        >
          {/* Top Glass Ribbon */}
          <View style={styles.glassBannerContainer}>
              <View style={styles.glassBanner}>
                  <Text style={styles.resultTitle}>
                      {isVictory ? "VICTORY!" : "MATCH OVER"}
                  </Text>
              </View>
          </View>

          {/* Top Rank Badge */}
          <Animated.View style={[styles.rankBadgeWrapper, { transform: [{ scale: pulseAnim }] }]}>
            <View style={[styles.rankBadge, { backgroundColor: isVictory ? '#FEF08A' : '#F1F5F9' }]}>
               <FontAwesome5 name="trophy" size={40} color={isVictory ? '#D97706' : '#94A3B8'} solid />
            </View>
          </Animated.View>

          {/* Stats Box */}
          <Animated.View style={[styles.statsRow, { opacity: contentFade }]}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>SCORE</Text>
              <Text style={[styles.statValue, { color: '#0F172A' }]}>{score}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>RANK</Text>
              <Text style={[styles.statValue, { color: '#0EA5E9' }]}>#{rank}</Text>
            </View>
          </Animated.View>

          {/* Rewards Section */}
          <Animated.View style={[styles.rewardsContainer, { transform: [{ scale: rewardPop }] }]}>
            <Text style={styles.sectionHeader}>REWARDS EARNED</Text>
            <View style={styles.rewardsGrid}>
              <RewardCard 
                icon="coins" 
                value={mgEarned} 
                label="GOLD" 
                color="#F59E0B" 
              />
              <RewardCard 
                icon="star" 
                value={xpEarned} 
                label="EXP" 
                color="#0EA5E9" 
              />
            </View>
          </Animated.View>

          {/* Direct Actions */}
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              onPress={() => {
                HeistSoundService.playButtonClick();
                onPlayAgain();
              }}
              style={styles.actionBtnPrimary}
            >
               <Text style={styles.btnTextLight}>BATTLE AGAIN</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onExit} style={styles.actionBtnOutline}>
              <Text style={styles.btnTextDark}>EXIT</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

function RewardCard({ icon, value, label, color }: any) {
  return (
    <View style={styles.rewardCard}>
        <FontAwesome5 name={icon} size={24} color={color} solid />
        <View style={styles.rewardContent}>
          <Text style={styles.rewardVal}>+{value}</Text>
          <Text style={styles.rewardLab}>{label}</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassBannerContainer: {
    position: 'absolute',
    top: -30,
    zIndex: 20,
    alignItems: 'center',
    width: '100%',
  },
  glassBanner: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    paddingTop: 48,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    marginTop: 30,
  },
  rankBadgeWrapper: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    letterSpacing: 2,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  statDivider: {
    width: 1.5,
    height: 48,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  rewardsContainer: {
    width: '100%',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
    letterSpacing: 1.5,
    marginBottom: 16,
    textAlign: 'center',
  },
  rewardsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  rewardContent: {
    marginLeft: 12,
  },
  rewardVal: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  rewardLab: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  actionGrid: {
    width: '100%',
    gap: 12,
  },
  actionBtnPrimary: {
    width: '100%',
    backgroundColor: '#00D4C7',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#00D4C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  btnTextLight: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  actionBtnOutline: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  btnTextDark: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
    letterSpacing: 1,
  },
});


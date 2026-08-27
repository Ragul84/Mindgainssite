import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeistSoundService } from '@/services/heistSoundService';
import { V2026 } from '@/theme/v2026-tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HeistResultsPremiumProps {
  score: number;
  rank: number;
  mgEarned: number;
  xpEarned: number;
  insight: string;
  vaultName: string;
  onPlayAgain: () => void;
  onExit: () => void;
}

export default function HeistResultsPremium({
  score,
  rank,
  mgEarned,
  xpEarned,
  insight,
  vaultName,
  onPlayAgain,
  onExit,
}: HeistResultsPremiumProps) {
  const insets = useSafeAreaInsets();
  const isVictory = rank <= 2;

  useEffect(() => {
    if (isVictory) {
      HeistSoundService.playVictory();
    } else {
      HeistSoundService.playDefeat();
    }
  }, []);

  const handleShare = async () => {
    try {
      const message = `🏆 ARENA TRIUMPH! 🏆\n\nI just secured Rank #${rank} in the ${vaultName} Arena!\n🔥 Score: ${score}\n⚡ XP Gained: ${xpEarned}\n💰 Loot: ${mgEarned} MG Tokens\n\nJoin the MindClash on MindGains! 🚀`;
      await Share.share({
        message,
        title: 'My MindClash Result',
      });
    } catch (error) {
      console.error('Error sharing result:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={StyleSheet.absoluteFill} />

      <View style={styles.content}>
        {/* 🏆 Result Banner */}
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.header}
        >
          <Text style={[styles.resultTitle, { color: isVictory ? '#10B981' : '#94A3B8' }]}>
            {isVictory ? 'ARENA TRIUMPH' : 'MISSION COMPLETE'}
          </Text>
          <View style={[styles.rankBadge, { borderColor: isVictory ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)' }]}>
            <Text style={[styles.rankLabel, { color: isVictory ? '#10B981' : '#94A3B8' }]}>RANK</Text>
            <Text style={styles.rankValue}>#{rank}</Text>
          </View>
        </MotiView>

        {/* 📊 Summary Stats */}
        <View style={styles.statsGrid}>
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300 }}
            style={styles.statCard}
          >
            <View style={styles.statInner}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
              <Text style={styles.statVal}>{score}</Text>
              <Text style={styles.statLab}>FINAL SCORE</Text>
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 400 }}
            style={styles.statCard}
          >
            <View style={styles.statInner}>
              <Ionicons name="flash" size={24} color="#00D4C7" />
              <Text style={styles.statVal}>{xpEarned}</Text>
              <Text style={styles.statLab}>XP GAINED</Text>
            </View>
          </MotiView>
        </View>

        {/* 💰 Reward Extraction */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 600 }}
          style={styles.rewardSection}
        >
          <View style={styles.rewardInner}>
            <View style={styles.rewardHeader}>
              <Text style={styles.rewardTitle}>LOOT SECURED</Text>
            </View>
            <Text style={styles.mgValue}>+{mgEarned} MG Tokens</Text>
            <View style={styles.rewardBar}>
              <MotiView
                from={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ type: 'timing', duration: 1500, delay: 800 }}
                style={styles.rewardFill}
              />
            </View>
          </View>
        </MotiView>

        {/* 📝 Insight */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1000 }}
          style={styles.insightBox}
        >
          <Text style={styles.insightTitle}>ARENA INSIGHT</Text>
          <Text style={styles.insightText}>
            {insight || 'Great performance. Your tactical precision is improving.'}
          </Text>
        </MotiView>
      </View>

      {/* 🚀 Actions */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={1}
          onPress={() => {
            HeistSoundService.playButtonClick();
            onPlayAgain();
          }}
        >
          <LinearGradient colors={['#00D4C7', '#0EA5E9']} style={styles.btnGradient}>
            <Text style={styles.btnTextLight}>START NEXT CLASH</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.shareBtn} 
          activeOpacity={1}
          onPress={handleShare}
        >
           <FontAwesome5 name="share-alt" size={16} color="#00D4C7" />
           <Text style={styles.shareBtnText}>SHARE VICTORY</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={onExit} activeOpacity={1}>
          <Text style={styles.btnTextDark}>BACK TO LOBBY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  resultTitle: { fontSize: 11, fontFamily: 'Poppins-SemiBold', letterSpacing: 3, marginBottom: 20 },
  rankBadge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    ...V2026.shadows.milky,
  },
  rankLabel: { fontSize: 10, fontFamily: 'Poppins-SemiBold', letterSpacing: 1.5 },
  rankValue: { fontSize: 52, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statCard: {
    flex: 1,
    height: 120,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
    ...V2026.shadows.milky,
  },
  statInner: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  statVal: { fontSize: 26, fontFamily: 'Poppins-Bold', color: '#0F172A', marginTop: 4 },
  statLab: { fontSize: 9, fontFamily: 'Poppins-SemiBold', color: '#94A3B8', letterSpacing: 0.5, marginTop: 2 },
  rewardSection: {
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
    ...V2026.shadows.milky,
    marginBottom: 24,
  },
  rewardInner: { padding: 24, alignItems: 'center' },
  rewardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  rewardTitle: { fontSize: 10, fontFamily: 'Poppins-SemiBold', color: '#94A3B8', letterSpacing: 1.5 },
  mgValue: { fontSize: 30, fontFamily: 'Poppins-Bold', color: '#00D4C7', marginBottom: 16 },
  rewardBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  rewardFill: { height: '100%', backgroundColor: '#00D4C7', borderRadius: 3 },
  insightBox: { alignItems: 'center', paddingHorizontal: 20 },
  insightTitle: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: { paddingHorizontal: 24, gap: 10 },
  primaryBtn: { borderRadius: 20, overflow: 'hidden', ...V2026.shadows.milky },
  btnGradient: { paddingVertical: 18, alignItems: 'center' },
  btnTextLight: { fontSize: 15, fontFamily: 'Poppins-Bold', color: '#FFFFFF', letterSpacing: 1 },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0, 212, 199, 0.2)', ...V2026.shadows.milky },
  shareBtnText: { fontSize: 13, fontFamily: 'Poppins-Bold', color: '#00D4C7', letterSpacing: 0.5 },
  secondaryBtn: { paddingVertical: 12, alignItems: 'center' },
  btnTextDark: { fontSize: 13, fontFamily: 'Poppins-Bold', color: '#94A3B8', letterSpacing: 0.5 },
});


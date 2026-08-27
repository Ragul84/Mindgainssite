import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { HeistSoundService } from '@/services/heistSoundService';
import { V2026 } from '@/theme/v2026-tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TeamReadyPremiumProps {
  onStart: () => void;
  onExit: () => void;
  vaultName: string;
  mode: 'pvp' | 'pvq';
}

const SHADOW_AGENTS = [
  { name: 'Arjun_K', level: 12, avatar: '👤', status: 'READY' },
  { name: 'Priya_M', level: 15, avatar: '👤', status: 'READY' },
  { name: 'Rahul_S', level: 10, avatar: '👤', status: 'CONNECTING' },
  { name: 'You', level: 8, avatar: '👤', isCurrentUser: true, status: 'READY' },
];

export default function TeamReadyPremium({ onStart, onExit, vaultName, mode }: TeamReadyPremiumProps) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onStart();
          return 0;
        }
        HeistSoundService.playCountdown();
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.countdownBox}
        >
          <Text style={styles.countdownTitle}>
            {mode === 'pvq' ? 'DUNGEON BATTLE IN' : 'BATTLE COMMENCING IN'}
          </Text>
          <Text style={styles.countdownTimer}>{countdown}</Text>
        </MotiView>

        <View style={styles.agentGrid}>
          {SHADOW_AGENTS.map((agent, i) => (
            <MotiView
              key={agent.name}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: i * 150 }}
              style={styles.agentCard}
            >
              <View style={[styles.agentInner, agent.isCurrentUser && styles.currentUserGlow]}>
                 <View style={styles.agentAvatar}>
                    <FontAwesome5 name="user" size={16} color={agent.isCurrentUser ? '#00D4C7' : '#94A3B8'} />
                 </View>
                 <View style={styles.agentInfo}>
                    <Text style={styles.agentName}>{agent.name}</Text>
                    <Text style={styles.agentStatus}>{agent.status}</Text>
                 </View>
                 {agent.isCurrentUser && (
                   <View style={styles.youBadge}>
                      <Text style={styles.youText}>YOU</Text>
                   </View>
                 )}
              </View>
            </MotiView>
          ))}
        </View>

        <View style={styles.footerInfo}>
          <View style={styles.targetBadge}>
            <Ionicons name="trophy" size={14} color="#00D4C7" />
            <Text style={styles.targetText}>{vaultName.toUpperCase()}</Text>
          </View>
          <Text style={styles.missionText}>Answer correctly to strike the boss. Defend your Shield HP!</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  countdownBox: { alignItems: 'center', marginBottom: 48 },
  countdownTitle: { fontSize: 11, fontFamily: 'Poppins-SemiBold', color: '#94A3B8', letterSpacing: 2 },
  countdownTimer: { fontSize: 84, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  agentGrid: { width: '100%', gap: 12 },
  agentCard: { 
    borderRadius: 24, 
    backgroundColor: '#FFFFFF',
    borderWidth: 1, 
    borderColor: 'rgba(15, 23, 42, 0.05)',
    ...V2026.shadows.milky,
  },
  agentInner: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  currentUserGlow: { backgroundColor: 'rgba(0, 212, 199, 0.03)', borderColor: 'rgba(0, 212, 199, 0.2)' },
  agentAvatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  agentInfo: { flex: 1 },
  agentName: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  agentStatus: { fontSize: 10, fontFamily: 'Poppins-SemiBold', color: '#94A3B8', marginTop: 2 },
  youBadge: { backgroundColor: '#00D4C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  youText: { fontSize: 10, fontFamily: 'Poppins-SemiBold', color: '#FFFFFF' },
  footerInfo: { marginTop: 60, alignItems: 'center', gap: 12 },
  targetBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0, 212, 199, 0.05)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  targetText: { fontSize: 12, fontFamily: 'Poppins-Bold', color: '#00D4C7' },
  missionText: { fontSize: 12, fontFamily: 'Inter-Medium', color: '#64748B', textAlign: 'center', paddingHorizontal: 40, lineHeight: 18 },
});


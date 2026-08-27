import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { HeistSoundService } from '@/services/heistSoundService';
import { V2026 } from '@/theme/v2026-tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MatchmakingPremiumProps {
  onMatchFound: () => void;
  onExit: () => void;
  vaultName: string;
  mode: 'pvp' | 'pvq';
}

export default function MatchmakingPremium({ onMatchFound, onExit, vaultName, mode }: MatchmakingPremiumProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
      
      {/* 📡 Radar Scanning Effect */}
      <View style={styles.radarWrapper}>
        <MotiView
          from={{ opacity: 0.2, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1.5 }}
          transition={{ type: 'timing', duration: 2000, loop: true }}
          style={styles.radarCircle}
        />
        <MotiView
          from={{ opacity: 0.1, scale: 0.5 }}
          animate={{ opacity: 0.2, scale: 2.5 }}
          transition={{ type: 'timing', duration: 4000, loop: true }}
          style={styles.radarCircle}
        />
        
        <Animated.View style={[styles.scannerBeam, { transform: [{ rotate: spin }] }]}>
          <LinearGradient
            colors={['rgba(0, 212, 199, 0.2)', 'transparent']}
            style={styles.beamGradient}
          />
        </Animated.View>

        <View style={styles.centerOrb}>
          <Ionicons name="search" size={32} color="#00D4C7" />
        </View>
      </View>

      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.statusBox}
        >
          <Text style={styles.statusLabel}>PREPARING ARENA</Text>
          <Text style={styles.vaultTitle}>{vaultName}</Text>
          <View style={styles.loaderRow}>
             <View style={styles.dot} />
             <Text style={styles.loaderText}>
               {mode === 'pvq' ? 'ENTERING DUNGEON ARENA' : 'SEARCHING FOR ASPIRANTS'}
             </Text>
          </View>
        </MotiView>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>SIGNAL</Text>
            <Text style={styles.infoValue}>STRONG</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>MODE</Text>
            <Text style={styles.infoValue}>2D RPG</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.abortBtn} onPress={onExit} activeOpacity={1}>
        <Text style={styles.abortText}>CANCEL SEARCH</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  radarWrapper: { width: 300, height: 300, justifyContent: 'center', alignItems: 'center' },
  radarCircle: { position: 'absolute', width: 300, height: 300, borderRadius: 150, borderWidth: 1, borderColor: 'rgba(0, 212, 199, 0.2)' },
  scannerBeam: { position: 'absolute', width: 300, height: 300, borderRadius: 150, overflow: 'hidden' },
  beamGradient: { width: 150, height: 300, borderTopLeftRadius: 150, borderBottomLeftRadius: 150 },
  centerOrb: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(15, 23, 42, 0.05)', ...V2026.shadows.milky },
  content: { marginTop: 60, alignItems: 'center', width: '100%', paddingHorizontal: 40 },
  statusBox: { alignItems: 'center', gap: 8, marginBottom: 40 },
  statusLabel: { fontSize: 10, fontFamily: 'Poppins-SemiBold', color: '#94A3B8', letterSpacing: 2.5 },
  vaultTitle: { fontSize: 26, fontFamily: 'Poppins-Bold', color: '#0F172A', textAlign: 'center' },
  loaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00D4C7' },
  loaderText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: '#64748B' },
  infoGrid: { flexDirection: 'row', gap: 20 },
  infoCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(15, 23, 42, 0.05)', alignItems: 'center', ...V2026.shadows.milky },
  infoLabel: { fontSize: 9, fontFamily: 'Poppins-SemiBold', color: '#94A3B8', marginBottom: 4 },
  infoValue: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  abortBtn: { position: 'absolute', bottom: 60, paddingVertical: 14, paddingHorizontal: 32 },
  abortText: { fontSize: 13, fontFamily: 'Poppins-Bold', color: '#94A3B8', letterSpacing: 1 },
});


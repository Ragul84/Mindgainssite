import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HapticService from '@/utils/hapticService';
import { V2026 } from '@/theme/v2026-tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HeistLandingScreenProps {
  onStartClash: (mode: 'pvp' | 'pvq') => void;
  onExit: () => void;
  onOpenStore: () => void;
  onShowLeaderboard: () => void;
  userStats: any;
  recommendedVaultName?: string | null;
  recommendedReason?: string | null;
}

export default function HeistLandingScreen({
  onStartClash,
  onExit,
  onOpenStore,
  onShowLeaderboard,
  userStats,
  recommendedVaultName,
  recommendedReason,
}: HeistLandingScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
      <View style={styles.ambientGlow} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.exitBtn} onPress={onExit} activeOpacity={0.8}>
          <Ionicons name="close" size={22} color="#64748B" />
        </TouchableOpacity>

        <View style={styles.currencyBadge}>
          <Ionicons name="flash" size={15} color="#00D4C7" />
          <Text style={styles.currencyText}>{(userStats.mgTokens || 0).toLocaleString()} MG</Text>
        </View>

        <TouchableOpacity style={styles.iconBtn} onPress={onShowLeaderboard} activeOpacity={0.8}>
          <Ionicons name="trophy" size={20} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}>

        {/* Hero */}
        <MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }} style={styles.hero}>
          <Text style={styles.heroTitle}>Concept Fighter</Text>
          <Text style={styles.heroSub}>Aspirant's Quest: 2D Turn-Based Battle RPG</Text>
          {recommendedVaultName && (
            <View style={styles.recBar}>
              <Ionicons name="sparkles" size={12} color="#00D4C7" />
              <Text style={styles.recText}>Suggested: {recommendedVaultName}</Text>
            </View>
          )}
        </MotiView>

        {/* Stats Row */}
        <MotiView
          from={{ opacity: 0, translateY: 8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 100 }}
          style={styles.statsRow}
        >
          {[
            { label: 'WIN STREAK', value: userStats.winStreak || 0, icon: 'flame', color: '#F59E0B' },
            { label: 'BATTLES LEFT', value: userStats.battlesRemaining ?? 5, icon: 'flash', color: '#00D4C7' },
            { label: 'WIN RATE', value: `${Math.round((userStats.winRate || 0) * 100)}%`, icon: 'trophy', color: '#8B5CF6' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statPill}>
              <Ionicons name={stat.icon as any} size={14} color={stat.color} />
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </MotiView>

        {/* Squad Clash — Primary */}
        <MotiView from={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 150 }}>
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => { HapticService.medium(); onStartClash('pvp'); }}
            style={styles.mainCard}
          >
            <LinearGradient colors={['#FFFFFF', '#F0FFFE']} style={styles.mainCardInner}>
              <View style={styles.mainCardGlow} />
              <View style={styles.mainCardBody}>
                <View style={styles.mainIconWrap}>
                  <Ionicons name="people" size={28} color="#00D4C7" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mainCardTitle}>SQUAD DUEL</Text>
                  <Text style={styles.mainCardSub}>1v1 Real-time RPG Battle</Text>
                </View>
                <View style={styles.mainCardCta}>
                  <LinearGradient colors={['#00D4C7', '#6366F1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaGradient}>
                    <Text style={styles.ctaText}>DUEL</Text>
                    <Ionicons name="flash" size={14} color="#fff" />
                  </LinearGradient>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>

        {/* Bottom Row */}
        <MotiView
          from={{ opacity: 0, translateY: 8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
          style={styles.rowCards}
        >
          {/* PvQ Solo */}
          <TouchableOpacity
            style={styles.halfCard}
            activeOpacity={0.92}
            onPress={() => { HapticService.medium(); onStartClash('pvq'); }}
          >
            <View style={[styles.halfIcon, { backgroundColor: 'rgba(139,92,246,0.08)' }]}>
              <Ionicons name="shield-checkmark" size={22} color="#8B5CF6" />
            </View>
            <Text style={styles.halfTitle}>BOSS DUNGEON</Text>
            <Text style={styles.halfSub}>2D RPG Boss Fight</Text>
            <View style={[styles.halfBadge, { backgroundColor: 'rgba(139,92,246,0.08)' }]}>
              <Text style={[styles.halfBadgeText, { color: '#8B5CF6' }]}>SOLO</Text>
            </View>
          </TouchableOpacity>

          {/* Store */}
          <TouchableOpacity
            style={styles.halfCard}
            activeOpacity={0.92}
            onPress={onOpenStore}
          >
            <View style={[styles.halfIcon, { backgroundColor: 'rgba(245,158,11,0.08)' }]}>
              <Ionicons name="cart" size={22} color="#F59E0B" />
            </View>
            <Text style={styles.halfTitle}>STORE</Text>
            <Text style={styles.halfSub}>Power-ups & Boosts</Text>
            <View style={[styles.halfBadge, { backgroundColor: 'rgba(245,158,11,0.08)' }]}>
              <Text style={[styles.halfBadgeText, { color: '#F59E0B' }]}>SHOP</Text>
            </View>
          </TouchableOpacity>
        </MotiView>

        {/* Daily Mission Progress */}
        {userStats.dailyMission && (
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 250 }}
            style={styles.missionCard}
          >
            <View style={styles.missionRow}>
              <Ionicons name="calendar" size={16} color="#00D4C7" />
              <Text style={styles.missionLabel}>DAILY MISSION</Text>
              <Text style={styles.missionCount}>
                {userStats.dailyMission.progress}/{userStats.dailyMission.total} battles
              </Text>
            </View>
            <View style={styles.missionBarBg}>
              <View
                style={[
                  styles.missionBarFill,
                  { width: `${(userStats.dailyMission.progress / userStats.dailyMission.total) * 100}%` },
                ]}
              />
            </View>
          </MotiView>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  ambientGlow: {
    position: 'absolute', top: -80, right: -80,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(0,212,199,0.06)',
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 8,
  },
  exitBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(15,23,42,0.06)', ...V2026.shadows.milky,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(15,23,42,0.06)', ...V2026.shadows.milky,
  },
  currencyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(15,23,42,0.06)', ...V2026.shadows.milky,
  },
  currencyText: { fontFamily: 'Poppins-Bold', fontSize: 13, color: '#0F172A' },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  hero: { alignItems: 'center', marginBottom: 20 },
  heroTitle: { fontSize: 30, fontFamily: 'Poppins-Bold', color: '#0F172A', letterSpacing: -0.5 },
  heroSub: { fontSize: 13, fontFamily: 'Inter-Medium', color: '#64748B', marginTop: 4, textAlign: 'center' },
  recBar: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12,
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 99,
    backgroundColor: 'rgba(0,212,199,0.06)', borderWidth: 1, borderColor: 'rgba(0,212,199,0.15)',
  },
  recText: { fontSize: 11, fontFamily: 'Poppins-SemiBold', color: '#00D4C7', textTransform: 'uppercase' },
  statsRow: {
    flexDirection: 'row', gap: 12, marginBottom: 20,
  },
  statPill: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16,
    paddingVertical: 12, alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: 'rgba(15,23,42,0.05)', ...V2026.shadows.milky,
  },
  statValue: { fontSize: 16, fontFamily: 'Poppins-Bold' },
  statLabel: { fontSize: 8, fontFamily: 'Poppins-SemiBold', color: '#94A3B8', letterSpacing: 0.8 },
  mainCard: {
    borderRadius: 24, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: 'rgba(0,212,199,0.15)',
    overflow: 'hidden', marginBottom: 16, ...V2026.shadows.primary,
  },
  mainCardInner: { padding: 20 },
  mainCardGlow: {
    position: 'absolute', top: -60, right: -60,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(0,212,199,0.04)',
  },
  mainCardBody: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  mainIconWrap: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: 'rgba(0,212,199,0.08)', justifyContent: 'center', alignItems: 'center',
  },
  mainCardTitle: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  mainCardSub: { fontSize: 12, fontFamily: 'Inter-Medium', color: '#64748B', marginTop: 2 },
  mainCardCta: { borderRadius: 14, overflow: 'hidden' },
  ctaGradient: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14,
  },
  ctaText: { fontSize: 13, fontFamily: 'Poppins-Bold', color: '#FFFFFF' },
  rowCards: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  halfCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: 16, borderWidth: 1, borderColor: 'rgba(15,23,42,0.05)',
    alignItems: 'center', gap: 6, ...V2026.shadows.milky,
  },
  halfIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  halfTitle: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  halfSub: { fontSize: 11, fontFamily: 'Inter-Medium', color: '#64748B', textAlign: 'center' },
  halfBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  halfBadgeText: { fontSize: 9, fontFamily: 'Poppins-SemiBold' },
  missionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: 'rgba(0,212,199,0.12)', ...V2026.shadows.milky,
  },
  missionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  missionLabel: { flex: 1, fontSize: 11, fontFamily: 'Poppins-SemiBold', color: '#94A3B8', letterSpacing: 1 },
  missionCount: { fontSize: 12, fontFamily: 'Poppins-Bold', color: '#00D4C7' },
  missionBarBg: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  missionBarFill: { height: '100%', backgroundColor: '#00D4C7', borderRadius: 3 },
});


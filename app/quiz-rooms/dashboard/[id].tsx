import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, StatusBar, Share, ActivityIndicator, Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QuizRoomsService, QuizRoom, LeaderboardEntry } from '@/utils/quizRoomsService';
import HapticService from '@/utils/hapticService';
import { V2026 } from '@/theme/v2026-tokens';

const { width: W } = Dimensions.get('window');

export default function QuizRoomDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [room, setRoom] = useState<QuizRoom | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [distributing, setDistributing] = useState(false);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    const r = await QuizRoomsService.getRoomById(id as string);
    if (r) {
      setRoom(r);
      setParticipantCount(r.participant_count);
    }
    const lb = await QuizRoomsService.getLeaderboard(id as string);
    setLeaderboard(lb);
    setLoading(false);
  }, [id]);

  useFocusEffect(useCallback(() => {
    load();
    // Poll every 5s while room is active
    const interval = setInterval(load, 5000);
    setPollInterval(interval);
    return () => clearInterval(interval);
  }, [load]));

  const handleShare = async () => {
    if (!room) return;
    HapticService.selection();
    const msg = QuizRoomsService.getShareMessage(room);
    Share.share({ message: msg });
  };

  const handleDistribute = async () => {
    if (!room) return;
    Alert.alert(
      'End Quiz & Pay Winners',
      `This will close the quiz and distribute ${room.prize_pool} coins to the top ${room.winner_count} participants. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Pay Winners', style: 'default',
          onPress: async () => {
            setDistributing(true);
            HapticService.medium();
            const result = await QuizRoomsService.closeAndDistribute(room.id);
            setDistributing(false);
            if (result.success) {
              HapticService.notification('success');
              Alert.alert('Done! 🎉', result.message);
              load();
            } else {
              Alert.alert('Failed', result.message);
            }
          },
        },
      ]
    );
  };

  const splits = room ? QuizRoomsService.calculatePrizeSplits(room.prize_pool, room.winner_count) : [];
  const isCompleted = room?.status === 'completed';

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  if (!room) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }]}>
        <StatusBar barStyle="dark-content" />
        <Text style={{ fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#64748B', textAlign: 'center' }}>Room not found.</Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
          <Text style={{ color: '#8B5CF6', fontFamily: 'Poppins-SemiBold' }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#F8FAFC', '#FFFFFF']} style={StyleSheet.absoluteFill} />
      <View style={styles.glow1} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{room.title}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: isCompleted ? '#94A3B8' : '#10B981' }]} />
            <Text style={styles.statusText}>{isCompleted ? 'Ended' : 'Live'}</Text>
            {!isCompleted && <Text style={styles.livePulse}>●</Text>}
          </View>
        </View>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
          <Ionicons name="share-social" size={18} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>

        {/* Join code card */}
        <MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }} style={styles.codeCard}>
          <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.codeGrad}>
            <View>
              <Text style={styles.codeLabel}>JOIN CODE</Text>
              <Text style={styles.codeValue}>{room.join_code}</Text>
            </View>
            <TouchableOpacity style={styles.shareCodeBtn} onPress={handleShare} activeOpacity={0.8}>
              <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.shareCodeGrad}>
                <Ionicons name="share-social" size={14} color="#FFF" />
                <Text style={styles.shareCodeText}>Share</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </MotiView>

        {/* Stats row */}
        <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 80 }} style={styles.statsRow}>
          {[
            { label: 'Joined', value: String(participantCount), icon: 'people', color: '#0EA5E9', bg: '#E0F2FE' },
            { label: 'Completed', value: String(leaderboard.length), icon: 'checkmark-done', color: '#10B981', bg: '#DCFCE7' },
            { label: 'Questions', value: String(room.question_count), icon: 'help-circle', color: '#8B5CF6', bg: '#F3E8FF' },
            { label: 'Time/Q', value: `${room.time_per_question}s`, icon: 'timer-outline', color: '#F59E0B', bg: '#FFFBEB' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.bg }]}>
                <Ionicons name={stat.icon as any} size={16} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </MotiView>

        {/* Prize pool card */}
        {room.prize_pool > 0 && (
          <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 140 }} style={styles.prizeCard}>
            <View style={styles.prizeLeft}>
              <FontAwesome5 name="coins" size={22} color="#F59E0B" />
              <View style={{ marginLeft: 14 }}>
                <Text style={styles.prizeLabel}>Prize Pool</Text>
                <Text style={styles.prizeValue}>{room.prize_pool} coins</Text>
                <Text style={styles.prizeSplitText}>
                  {splits.map((s, i) => `${['🥇', '🥈', '🥉', '4th', '5th'][i]} ${s}`).join(' · ')}
                </Text>
              </View>
            </View>
            {!isCompleted && room.prize_pool > 0 && (
              <TouchableOpacity
                style={[styles.distributeBtn, distributing && { opacity: 0.5 }]}
                onPress={handleDistribute}
                disabled={distributing}
                activeOpacity={0.85}
              >
                <LinearGradient colors={['#10B981', '#059669']} style={styles.distributeBtnGrad}>
                  <Text style={styles.distributeBtnText}>{distributing ? '...' : 'Pay Winners'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            {isCompleted && (
              <View style={styles.paidBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.paidText}>Distributed</Text>
              </View>
            )}
          </MotiView>
        )}

        {/* Leaderboard */}
        <View style={styles.lbSection}>
          <View style={styles.lbHeader}>
            <Text style={styles.lbTitle}>Live Leaderboard</Text>
            {!isCompleted && (
              <View style={styles.liveTag}>
                <View style={styles.liveDot} />
                <Text style={styles.liveTagText}>LIVE</Text>
              </View>
            )}
          </View>

          {leaderboard.length === 0 ? (
            <View style={styles.emptyLb}>
              <Ionicons name="hourglass-outline" size={32} color="#CBD5E1" />
              <Text style={styles.emptyLbText}>Waiting for participants to finish…</Text>
            </View>
          ) : leaderboard.map((entry, i) => (
            <MotiView
              key={i}
              from={{ opacity: 0, translateX: -12 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: i * 50 }}
              style={styles.lbRow}
            >
              <View style={[
                styles.rankBadge,
                i === 0 ? styles.gold : i === 1 ? styles.silver : i === 2 ? styles.bronze : styles.normal
              ]}>
                <Text style={styles.rankText}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${entry.rank}`}
                </Text>
              </View>

              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.lbName}>{entry.display_name}</Text>
                <Text style={styles.lbMeta}>
                  {entry.score}/{room.question_count} correct · {QuizRoomsService.formatTime(entry.time_taken)}
                </Text>
              </View>

              {entry.coin_reward > 0 && (
                <View style={styles.lbCoin}>
                  <FontAwesome5 name="coins" size={10} color="#F59E0B" />
                  <Text style={styles.lbCoinText}>{entry.coin_reward}</Text>
                </View>
              )}
            </MotiView>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  glow1: { position: 'absolute', top: -80, right: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(139,92,246,0.07)' },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(15,23,42,0.07)', ...V2026.shadows.milky },
  headerTitle: { fontSize: 17, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: '#64748B' },
  livePulse: { fontSize: 10, color: '#10B981' },
  shareBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center' },

  scroll: { paddingHorizontal: 20, paddingTop: 4 },

  codeCard: { borderRadius: 24, overflow: 'hidden', marginBottom: 16, ...V2026.shadows.primary },
  codeGrad: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  codeLabel: { fontSize: 10, fontFamily: 'Poppins-SemiBold', color: 'rgba(255,255,255,0.5)', letterSpacing: 2, marginBottom: 6 },
  codeValue: { fontSize: 32, fontFamily: 'Poppins-Bold', color: '#FFFFFF', letterSpacing: 5 },
  shareCodeBtn: { borderRadius: 14, overflow: 'hidden' },
  shareCodeGrad: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10 },
  shareCodeText: { fontSize: 13, fontFamily: 'Poppins-Bold', color: '#FFFFFF' },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 12, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(15,23,42,0.06)', ...V2026.shadows.milky },
  statIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  statLabel: { fontSize: 9, fontFamily: 'Poppins-SemiBold', color: '#94A3B8', letterSpacing: 0.5, textAlign: 'center' },

  prizeCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(251,191,36,0.25)', ...V2026.shadows.milky },
  prizeLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  prizeLabel: { fontSize: 11, fontFamily: 'Poppins-SemiBold', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 },
  prizeValue: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  prizeSplitText: { fontSize: 10, fontFamily: 'Inter-Medium', color: '#94A3B8', marginTop: 2 },
  distributeBtn: { borderRadius: 14, overflow: 'hidden' },
  distributeBtnGrad: { paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center' },
  distributeBtnText: { fontSize: 12, fontFamily: 'Poppins-Bold', color: '#FFFFFF' },
  paidBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  paidText: { fontSize: 11, fontFamily: 'Poppins-SemiBold', color: '#059669' },

  lbSection: { gap: 10 },
  lbHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  lbTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  liveTag: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  liveTagText: { fontSize: 9, fontFamily: 'Poppins-Bold', color: '#059669', letterSpacing: 1 },

  emptyLb: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 32, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(15,23,42,0.06)' },
  emptyLbText: { fontSize: 13, fontFamily: 'Inter-Medium', color: '#94A3B8', textAlign: 'center' },

  lbRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: 'rgba(15,23,42,0.06)', ...V2026.shadows.milky },
  rankBadge: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  gold: { backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FEF3C7' },
  silver: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9' },
  bronze: { backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: '#FFEDD5' },
  normal: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' },
  rankText: { fontSize: 16 },
  lbName: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: '#0F172A' },
  lbMeta: { fontSize: 11, fontFamily: 'Inter-Medium', color: '#94A3B8', marginTop: 1 },
  lbCoin: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  lbCoinText: { fontSize: 12, fontFamily: 'Poppins-Bold', color: '#D97706' },
});

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QuizRoomsService, QuizRoom } from '@/utils/quizRoomsService';
import HapticService from '@/utils/hapticService';
import { V2026 } from '@/theme/v2026-tokens';

const { width: W } = Dimensions.get('window');

export default function QuizRoomsHub() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [myRooms, setMyRooms] = useState<QuizRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rooms = await QuizRoomsService.getMyRooms();
      setMyRooms(rooms);
    } catch {}
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    HapticService.medium();
    setJoining(true);
    try {
      const room = await QuizRoomsService.getRoomByCode(joinCode.trim());
      if (!room) { Alert.alert('Not found', 'No quiz room with that code. Check and try again.'); return; }
      if (room.status === 'completed') { Alert.alert('Ended', 'This quiz has already ended.'); return; }
      router.push(`/quiz-rooms/${room.id}`);
    } catch {
      Alert.alert('Error', 'Could not find that room. Try again.');
    } finally {
      setJoining(false);
    }
  };

  const statusColor = (s: QuizRoom['status']) =>
    s === 'waiting' ? '#10B981' : s === 'active' ? '#F59E0B' : '#94A3B8';
  const statusLabel = (s: QuizRoom['status']) =>
    s === 'waiting' ? 'WAITING' : s === 'active' ? 'LIVE' : 'ENDED';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#F8FAFC', '#FFFFFF']} style={StyleSheet.absoluteFill} />

      {/* Ambient glow */}
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.headerTitle}>Quiz Rooms</Text>
          <Text style={styles.headerSub}>Host or join a private quiz challenge</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Create Room CTA */}
          <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} style={styles.createCard}>
            <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.createGradient}>
              <View style={styles.createLeft}>
                <View style={styles.createIconWrap}>
                  <Ionicons name="rocket" size={26} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.createTitle}>Host a Quiz Room</Text>
                  <Text style={styles.createSub}>AI questions · Coin prizes · Shareable link</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.createBtn}
                activeOpacity={0.85}
                onPress={() => { HapticService.medium(); router.push('/quiz-rooms/create'); }}
              >
                <Text style={styles.createBtnText}>CREATE</Text>
                <Ionicons name="add" size={16} color="#7C3AED" />
              </TouchableOpacity>
            </LinearGradient>
          </MotiView>

          {/* Join by Code */}
          <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 80 }} style={styles.joinCard}>
            <View style={styles.joinHeader}>
              <View style={styles.joinIconWrap}>
                <Ionicons name="enter-outline" size={20} color="#0EA5E9" />
              </View>
              <Text style={styles.joinTitle}>Join with Code</Text>
            </View>
            <Text style={styles.joinDesc}>Got an invite? Enter the join code below.</Text>
            <View style={styles.joinRow}>
              <TextInput
                style={styles.joinInput}
                placeholder="e.g. TIGER42"
                placeholderTextColor="#94A3B8"
                value={joinCode}
                onChangeText={(t) => setJoinCode(t.toUpperCase())}
                autoCapitalize="characters"
                maxLength={8}
              />
              <TouchableOpacity
                style={[styles.joinBtn, (!joinCode.trim() || joining) && { opacity: 0.5 }]}
                onPress={handleJoin}
                disabled={!joinCode.trim() || joining}
                activeOpacity={0.85}
              >
                <LinearGradient colors={['#00D4C7', '#0EA5E9']} style={styles.joinBtnGrad}>
                  <Text style={styles.joinBtnText}>{joining ? '...' : 'JOIN'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </MotiView>

          {/* My Rooms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MY ROOMS</Text>
            {loading ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Loading…</Text>
              </View>
            ) : myRooms.length === 0 ? (
              <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.emptyBox}>
                <Ionicons name="albums-outline" size={36} color="#CBD5E1" />
                <Text style={styles.emptyText}>No rooms yet. Create your first!</Text>
              </MotiView>
            ) : myRooms.map((room, i) => (
              <MotiView
                key={room.id}
                from={{ opacity: 0, translateX: -12 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: i * 60 }}
                style={styles.roomCard}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.roomTopRow}>
                    <Text style={styles.roomTitle} numberOfLines={1}>{room.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor(room.status) + '18', borderColor: statusColor(room.status) + '55' }]}>
                      <View style={[styles.statusDot, { backgroundColor: statusColor(room.status) }]} />
                      <Text style={[styles.statusText, { color: statusColor(room.status) }]}>{statusLabel(room.status)}</Text>
                    </View>
                  </View>
                  <Text style={styles.roomMeta}>
                    {room.question_count}Q · {room.time_per_question}s each · {room.participant_count} joined
                    {room.prize_pool > 0 ? ` · 🏆 ${room.prize_pool} coins` : ''}
                  </Text>
                  <Text style={styles.roomCode}>Code: <Text style={styles.roomCodeVal}>{room.join_code}</Text></Text>
                </View>
                <TouchableOpacity
                  style={styles.roomBtn}
                  onPress={() => { HapticService.selection(); router.push(`/quiz-rooms/dashboard/${room.id}`); }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="stats-chart" size={18} color="#8B5CF6" />
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  glow1: { position: 'absolute', top: -80, right: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(139,92,246,0.07)' },
  glow2: { position: 'absolute', bottom: 100, left: -60, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(14,165,233,0.06)' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(15,23,42,0.07)', ...V2026.shadows.milky },
  headerTitle: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  headerSub: { fontSize: 12, fontFamily: 'Inter-Medium', color: '#64748B', marginTop: -1 },

  scroll: { paddingHorizontal: 20, paddingTop: 4 },

  createCard: { borderRadius: 24, overflow: 'hidden', marginBottom: 16, ...V2026.shadows.primary },
  createGradient: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  createLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  createIconWrap: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  createTitle: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#FFFFFF' },
  createSub: { fontSize: 11, fontFamily: 'Inter-Medium', color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  createBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14 },
  createBtnText: { fontSize: 13, fontFamily: 'Poppins-Bold', color: '#7C3AED' },

  joinCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 28, borderWidth: 1, borderColor: 'rgba(15,23,42,0.06)', ...V2026.shadows.milky },
  joinHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  joinIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center' },
  joinTitle: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  joinDesc: { fontSize: 13, fontFamily: 'Inter-Medium', color: '#64748B', marginBottom: 14 },
  joinRow: { flexDirection: 'row', gap: 10 },
  joinInput: { flex: 1, height: 52, backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, fontSize: 18, fontFamily: 'Poppins-Bold', color: '#0F172A', borderWidth: 1, borderColor: '#E2E8F0', letterSpacing: 2 },
  joinBtn: { borderRadius: 14, overflow: 'hidden' },
  joinBtnGrad: { height: 52, paddingHorizontal: 22, justifyContent: 'center', alignItems: 'center' },
  joinBtnText: { fontSize: 15, fontFamily: 'Poppins-Bold', color: '#FFFFFF', letterSpacing: 1 },

  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 11, fontFamily: 'Poppins-SemiBold', color: '#94A3B8', letterSpacing: 1.5, marginBottom: 12 },

  emptyBox: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 32, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(15,23,42,0.06)' },
  emptyText: { fontSize: 14, fontFamily: 'Inter-Medium', color: '#94A3B8', textAlign: 'center' },

  roomCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(15,23,42,0.06)', ...V2026.shadows.milky },
  roomTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, gap: 8 },
  roomTitle: { fontSize: 15, fontFamily: 'Poppins-SemiBold', color: '#0F172A', flex: 1 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  statusDot: { width: 5, height: 5, borderRadius: 3 },
  statusText: { fontSize: 9, fontFamily: 'Poppins-Bold', letterSpacing: 0.8 },
  roomMeta: { fontSize: 11, fontFamily: 'Inter-Medium', color: '#64748B', marginBottom: 4 },
  roomCode: { fontSize: 11, fontFamily: 'Inter-Medium', color: '#94A3B8' },
  roomCodeVal: { fontFamily: 'Poppins-Bold', color: '#8B5CF6', letterSpacing: 1 },
  roomBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Modal,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HapticService from '@/utils/hapticService';
import UnifiedLoader from '@/components/ui/UnifiedLoader';
import { QuizRoomsService } from '@/utils/quizRoomsService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 20;
const CARD_GAP = 12;
const WAR_CARD_WIDTH = Math.floor((SCREEN_WIDTH - H_PADDING * 2 - CARD_GAP) / 2);

const LIVE_BATTLES = [
  { id: '1', title: "UPSC Prelims '24 War", creator: 'Khan Sir Academy', prize: '1,500', participants: 842, accentColor: '#0D9488', bg: '#F0FDFA', live: true },
  { id: '2', title: 'Modern History Blitz', creator: 'StudyWithRahul', prize: '500', participants: 1200, accentColor: '#2563EB', bg: '#EFF6FF', live: false },
  { id: '3', title: 'SSC Math Marathon', creator: 'Abhinay Maths', prize: '2,000', participants: 3100, accentColor: '#D97706', bg: '#FFFBEB', live: true },
  { id: '4', title: 'Biology Sprint', creator: 'BioCrew', prize: '750', participants: 640, accentColor: '#7C3AED', bg: '#F5J3FF', live: false },
];

export default function KnowledgeHeistPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isLoading] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [roomCode, setRoomCode] = useState('');

  const handleJoinByCode = async () => {
    if (!roomCode.trim()) return;
    HapticService.medium();
    const code = roomCode.trim().toUpperCase();
    setRoomCode('');
    setJoinModalVisible(false);
    try {
      const room = await QuizRoomsService.getRoomByCode(code);
      if (!room) {
        Alert.alert('Not found', 'No quiz room with that code. Check and try again.');
        return;
      }
      if (room.status === 'completed') {
        Alert.alert('Ended', 'This quiz has already ended.');
        return;
      }
      router.push(`/quiz-rooms/${room.id}`);
    } catch {
      Alert.alert('Error', 'Could not find that room. Try again.');
    }
  };

  const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

  if (isLoading) {
    return <UnifiedLoader context="battle" message="Opening Lobby..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient colors={['#F8FAFC', '#FFFFFF']} style={StyleSheet.absoluteFill} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Quiz Arena Lobby</Text>
          <Text style={styles.headerSubtitle}>Create, Share & Play Quiz Rooms</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/quiz-hub')}>
          <MaterialCommunityIcons name="sword-cross" size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <View style={styles.heroWrap}>
          <LinearGradient
            colors={['#09101D', '#111827', '#0B1020']}
            style={styles.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>Quiz Rooms</Text>
              <Text style={styles.heroSubtitle}>
                Challenge friends, study together, and dominate the boards!
              </Text>
            </View>
            <Image
              source={require('../assets/arena2.png')}
              style={styles.heroMascot}
              resizeMode="contain"
            />
          </LinearGradient>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.88}
            onPress={() => {
              HapticService.medium();
              router.push('/quiz-rooms/create');
            }}
          >
            <LinearGradient colors={['#0F172A', '#111827', '#1E293B']} style={styles.actionInnerDark}>
              <View style={styles.actionCardGlowDark} />
              <View style={[styles.actionIcon, styles.actionIconDark]}>
                <Ionicons name="add" size={18} color="#38BDF8" />
              </View>
              <Text style={styles.actionTitleDark}>Create Room</Text>
              <Text style={styles.actionSubDark}>Start a new battle with friends</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.88}
            onPress={() => {
              HapticService.medium();
              setJoinModalVisible(true);
            }}
          >
            <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.actionInnerLight}>
              <View style={styles.actionCardGlowLight} />
              <View style={[styles.actionIcon, styles.actionIconLight]}>
                <Ionicons name="log-in-outline" size={18} color="#10B981" />
              </View>
              <Text style={styles.actionTitle}>Join Room</Text>
              <Text style={styles.actionSub}>Enter code to join battle</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Community Wars</Text>
          <TouchableOpacity onPress={() => router.push('/quiz-hub')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.warGrid}>
          {LIVE_BATTLES.map((war) => (
            <TouchableOpacity
              key={war.id}
              style={[styles.warCard, { width: WAR_CARD_WIDTH }]}
              activeOpacity={0.88}
              onPress={() => router.push({ pathname: '/quiz-hub/join', params: { id: war.id } })}
            >
              <View style={[styles.warCardInner, { backgroundColor: war.bg }]}>
                <View style={war.live ? styles.liveDot : styles.liveDotMuted} />
                <View style={[styles.warIconCircle, { backgroundColor: war.accentColor + '18' }]}>
                  <MaterialCommunityIcons name="sword-cross" size={17} color={war.accentColor} />
                </View>
                <Text style={styles.warTitle} numberOfLines={2}>
                  {war.title}
                </Text>
                <Text style={styles.warCreator} numberOfLines={1}>
                  by {war.creator}
                </Text>
                <View style={styles.warFooter}>
                  <View style={styles.statPill}>
                    <Ionicons name="trophy-outline" size={11} color="#0F172A" />
                    <Text style={styles.prizeText}>{war.prize} MG</Text>
                  </View>
                  <View style={styles.statPill}>
                    <Ionicons name="people-outline" size={11} color="#64748B" />
                    <Text style={styles.participantText}>{formatCount(war.participants)}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.sectionHeader, { marginTop: 26 }]}>
          <Text style={styles.sectionTitle}>Daily Challenge</Text>
        </View>

        <TouchableOpacity
          style={styles.challengeCard}
          activeOpacity={0.88}
          onPress={() => router.push({ pathname: '/quiz-hub', params: { mode: 'daily' } })}
        >
          <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.challengeInner}>
            <View style={styles.challengeLeft}>
              <View style={styles.trophyIcon}>
                <MaterialCommunityIcons name="trophy-award" size={22} color="#FBBF24" />
              </View>
              <View>
                <Text style={styles.challengeTitle}>100-Question Blitz</Text>
                <Text style={styles.challengeSubtitle}>Win 2x tokens • Top 10 only</Text>
              </View>
            </View>
            <View style={styles.challengeArrow}>
              <Ionicons name="chevron-forward" size={18} color="#0F172A" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={joinModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setJoinModalVisible(false)}
        >
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Enter Room Code</Text>
            <TextInput
              style={styles.codeInput}
              placeholder="e.g. AB1234"
              placeholderTextColor="#CBD5E1"
              value={roomCode}
              onChangeText={(t) => setRoomCode(t.toUpperCase())}
              autoCapitalize="characters"
              maxLength={8}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.joinCodeBtn, !roomCode.trim() && { opacity: 0.4 }]}
              onPress={handleJoinByCode}
              disabled={!roomCode.trim()}
            >
              <LinearGradient colors={['#0F172A', '#334155']} style={styles.joinCodeBtnInner}>
                <Text style={styles.joinCodeBtnText}>Join Battle</Text>
                <Ionicons name="flash" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PADDING,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  heroWrap: {
    paddingHorizontal: H_PADDING,
    marginBottom: 24,
  },
  heroCard: {
    minHeight: 136,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    shadowColor: '#0EA5E9',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  heroCopy: {
    flex: 1,
    paddingRight: 120,
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 17,
  },
  heroMascot: {
    position: 'absolute',
    right: -8,
    bottom: -18,
    width: 180,
    height: 150,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: H_PADDING,
    marginBottom: 18,
  },
  actionCard: {
    flex: 1,
    minHeight: 136,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  actionInnerDark: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  actionInnerLight: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  actionCardGlowDark: {
    position: 'absolute',
    top: -18,
    right: -12,
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'rgba(56,189,248,0.12)',
  },
  actionCardGlowLight: {
    position: 'absolute',
    top: -18,
    right: -12,
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'rgba(16,185,129,0.10)',
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  actionIconDark: {
    backgroundColor: 'rgba(15,23,42,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.24)',
  },
  actionIconLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  actionTitleDark: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  actionSub: {
    marginTop: 3,
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  actionSubDark: {
    marginTop: 3,
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.68)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: H_PADDING,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  seeAll: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#0EA5E9',
  },
  warGrid: {
    paddingHorizontal: H_PADDING,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  warCard: {
    marginBottom: 12,
  },
  warCardInner: {
    minHeight: 154,
    borderRadius: 20,
    padding: 14,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  liveDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveDotMuted: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  warIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  warTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    lineHeight: 19,
  },
  warCreator: {
    marginTop: 2,
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  warFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
  },
  prizeText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
  },
  participantText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  challengeCard: {
    marginHorizontal: H_PADDING,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.12)',
    marginTop: 6,
  },
  challengeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  challengeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trophyIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.18)',
  },
  challengeTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  challengeSubtitle: {
    marginTop: 2,
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  challengeArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.28)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  codeInput: {
    height: 58,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    textAlign: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(15,23,42,0.08)',
    letterSpacing: 4,
  },
  joinCodeBtn: {
    marginTop: 16,
    borderRadius: 18,
    overflow: 'hidden',
  },
  joinCodeBtnInner: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinCodeBtnText: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
});

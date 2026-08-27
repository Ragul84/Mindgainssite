import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Alert, StatusBar, Dimensions, Animated, Easing,
  ScrollView, Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  QuizRoomsService, QuizRoom, RoomParticipant, ParticipantAnswer, LeaderboardEntry,
} from '@/utils/quizRoomsService';
import HapticService from '@/utils/hapticService';
import { V2026 } from '@/theme/v2026-tokens';

const { width: W, height: H } = Dimensions.get('window');
type Phase = 'loading' | 'lobby' | 'name-entry' | 'playing' | 'results';

export default function JoinQuizRoom() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [phase, setPhase] = useState<Phase>('loading');
  const [room, setRoom] = useState<QuizRoom | null>(null);
  const [participant, setParticipant] = useState<RoomParticipant | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [joining, setJoining] = useState(false);

  // Playing state
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answers, setAnswers] = useState<ParticipantAnswer[]>([]);
  const [qStartTime, setQStartTime] = useState(Date.now());
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  // Results state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);

  // Load room
  useEffect(() => {
    if (!id) return;
    (async () => {
      const r = await QuizRoomsService.getRoomById(id as string);
      if (!r) { Alert.alert('Not found', 'This quiz room does not exist.'); router.back(); return; }
      if (r.status === 'completed') {
        setRoom(r);
        setPhase('results');
        const lb = await QuizRoomsService.getLeaderboard(r.id);
        setLeaderboard(lb);
        return;
      }
      setRoom(r);
      setPhase('name-entry');
    })();
  }, [id]);

  // Timer
  const startTimer = useCallback(() => {
    if (!room) return;
    const secs = room.time_per_question;
    setTimeLeft(secs);
    progressAnim.setValue(1);
    Animated.timing(progressAnim, { toValue: 0, duration: secs * 1000, useNativeDriver: false }).start();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { stopTimer(); handleTimeout(); return 0; }
        return prev - 1;
      });
    }, 1000);
    setQStartTime(Date.now());
  }, [room, currentQ]);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    progressAnim.stopAnimation();
  };

  useEffect(() => {
    if (phase === 'playing' && !showResult && room) startTimer();
    return () => stopTimer();
  }, [phase, currentQ, showResult]);

  const handleTimeout = () => {
    HapticService.error();
    const q = room!.questions_data[currentQ];
    const elapsed = Math.round((Date.now() - qStartTime) / 1000);
    setAnswers(prev => [...prev, { question_index: currentQ, selected_index: -1, is_correct: false, time_taken: elapsed }]);
    setSelectedOption(-1);
    setShowResult(true);
  };

  const handleOption = (idx: number) => {
    if (showResult || selectedOption !== null) return;
    stopTimer();
    const q = room!.questions_data[currentQ];
    const correct = idx === q.answer_index;
    const elapsed = Math.round((Date.now() - qStartTime) / 1000);
    if (correct) { HapticService.success(); setScore(s => s + 1); }
    else { HapticService.error(); }
    setAnswers(prev => [...prev, { question_index: currentQ, selected_index: idx, is_correct: correct, time_taken: elapsed }]);
    setSelectedOption(idx);
    setShowResult(true);
  };

  const handleNext = async () => {
    if (!room) return;
    if (currentQ < room.questions_data.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      await finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!participant || !room) return;
    const total = answers.reduce((s, a) => s + a.time_taken, 0);
    setTotalTime(total);
    try {
      await QuizRoomsService.submitScore(participant.id, {
        score,
        timeTaken: total,
        answers,
      });
      const lb = await QuizRoomsService.getLeaderboard(room.id, participant.id);
      setLeaderboard(lb);
      const me = lb.find(e => e.is_me) || null;
      setMyEntry(me);
    } catch {}
    HapticService.notification('success');
    setPhase('results');
  };

  const handleJoin = async () => {
    if (!displayName.trim() || !room) return;
    setJoining(true);
    try {
      const p = await QuizRoomsService.joinRoom(room.id, displayName.trim());
      setParticipant(p);
      setPhase('playing');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not join. Try again.');
    } finally {
      setJoining(false);
    }
  };

  const handleShareRank = () => {
    if (!myEntry || !room) return;
    const msg = `I ranked #${myEntry.rank} in "${room.title}" with ${myEntry.score}/${room.question_count} correct!\n🏆 Can you beat me? Join code: ${room.join_code}`;
    Share.share({ message: msg });
  };

  const timerColor = progressAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: ['#F43F5E', '#F59E0B', '#00D4C7'] });
  const timerWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar barStyle="dark-content" />
        <MotiView from={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <View style={styles.loadingIcon}><Ionicons name="hourglass" size={32} color="#8B5CF6" /></View>
          <Text style={styles.loadingText}>Finding room…</Text>
        </MotiView>
      </View>
    );
  }

  // ── NAME ENTRY ─────────────────────────────────────────────────────────────
  if (phase === 'name-entry') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient colors={['#F8FAFC', '#FFFFFF']} style={StyleSheet.absoluteFill} />
        <View style={styles.glow1} />

        <View style={[styles.lobbyWrap, { paddingTop: insets.top + 30 }]}>
          <MotiView from={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }} style={styles.roomBadge}>
            <Text style={styles.invitedLabel}>YOU'RE INVITED TO</Text>
            <Text style={styles.roomBadgeTitle} numberOfLines={2}>{room?.title}</Text>
            <View style={styles.roomBadgeMeta}>
              <Text style={styles.metaBadge}>{room?.question_count} Questions</Text>
              <Text style={styles.metaBadge}>{room?.time_per_question}s each</Text>
              {room && room.prize_pool > 0 && <Text style={[styles.metaBadge, { backgroundColor: '#FFFBEB', color: '#B45309' }]}>🏆 {room.prize_pool} coins</Text>}
            </View>
            <Text style={styles.hostedBy}>Hosted by {room?.creator_name}</Text>
          </MotiView>

          <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 200 }} style={styles.nameCard}>
            <Text style={styles.nameLabel}>YOUR NAME</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter your name…"
              placeholderTextColor="#94A3B8"
              value={displayName}
              onChangeText={setDisplayName}
              maxLength={24}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.joinBtn, (!displayName.trim() || joining) && { opacity: 0.45 }]}
              onPress={handleJoin}
              disabled={!displayName.trim() || joining}
              activeOpacity={0.85}
            >
              <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.joinBtnGrad}>
                <Ionicons name="flash" size={18} color="#FFF" />
                <Text style={styles.joinBtnText}>{joining ? 'Joining…' : 'Join Challenge'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        </View>
      </View>
    );
  }

  // ── PLAYING ────────────────────────────────────────────────────────────────
  if (phase === 'playing' && room) {
    const q = room.questions_data[currentQ];
    if (!q) return null;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient colors={['#F8FAFC', '#FFFFFF']} style={StyleSheet.absoluteFill} />

        {/* Header */}
        <View style={[styles.playHeader, { paddingTop: insets.top + 8 }]}>
          <View style={styles.playProgress}>
            <Text style={styles.playQNum}>Q{currentQ + 1}/{room.questions_data.length}</Text>
          </View>
          <View style={styles.playScore}>
            <Ionicons name="flame" size={14} color="#F59E0B" />
            <Text style={styles.playScoreText}>{score}</Text>
          </View>
          <View style={styles.playTimer}>
            <Text style={[styles.playTimerText, timeLeft <= 5 && { color: '#F43F5E' }]}>{timeLeft}</Text>
          </View>
        </View>

        {/* Timer bar */}
        <View style={styles.timerTrack}>
          <Animated.View style={[styles.timerFill, { width: timerWidth, backgroundColor: timerColor }]} />
        </View>

        <ScrollView contentContainerStyle={[styles.playScroll, { paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
          {/* Question */}
          <MotiView key={currentQ} from={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} style={styles.questionCard}>
            <Text style={styles.questionText}>{q.question}</Text>
          </MotiView>

          {/* Options */}
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.answer_index;
            const isSelected = idx === selectedOption;
            let cardStyle: any = styles.optionCard;
            if (showResult) {
              if (isCorrect) cardStyle = [styles.optionCard, styles.optionCorrect];
              else if (isSelected) cardStyle = [styles.optionCard, styles.optionWrong];
              else cardStyle = [styles.optionCard, { opacity: 0.4 }];
            }
            return (
              <TouchableOpacity key={idx} style={cardStyle} onPress={() => handleOption(idx)} disabled={showResult} activeOpacity={0.85}>
                <View style={styles.optionLetter}>
                  <Text style={styles.optionLetterText}>{String.fromCharCode(65 + idx)}</Text>
                </View>
                <Text style={styles.optionText}>{opt}</Text>
                {showResult && isCorrect && <Ionicons name="checkmark-circle" size={22} color="#10B981" />}
                {showResult && isSelected && !isCorrect && <Ionicons name="close-circle" size={22} color="#F43F5E" />}
              </TouchableOpacity>
            );
          })}

          {/* Explanation + Next */}
          {showResult && (
            <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} style={styles.explanationBox}>
              {q.explanation && (
                <>
                  <View style={styles.explanationHead}>
                    <Ionicons name="bulb" size={16} color="#00D4C7" />
                    <Text style={styles.explanationLabel}>EXPLANATION</Text>
                  </View>
                  <Text style={styles.explanationText}>{q.explanation}</Text>
                </>
              )}
              <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
                <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.nextGrad}>
                  <Text style={styles.nextBtnText}>{currentQ === room.questions_data.length - 1 ? 'FINISH' : 'NEXT'}</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>
          )}
        </ScrollView>
      </View>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  if (phase === 'results' && room) {
    const myRank = myEntry?.rank;
    const coinWon = myEntry?.coin_reward || 0;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient colors={['#F8FAFC', '#FFFFFF']} style={StyleSheet.absoluteFill} />
        <View style={styles.glow1} />

        <ScrollView contentContainerStyle={[styles.resultsScroll, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
          {/* Your result */}
          {myEntry && (
            <MotiView from={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }} style={styles.myResultCard}>
              <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.myResultGrad}>
                <Text style={styles.myResultLabel}>YOUR RESULT</Text>
                <Text style={styles.myRank}>#{myRank}</Text>
                <Text style={styles.myScore}>{score}/{room.questions_data.length} correct</Text>
                <Text style={styles.myTime}>{QuizRoomsService.formatTime(totalTime)} total time</Text>
                {coinWon > 0 && (
                  <View style={styles.coinWonBadge}>
                    <FontAwesome5 name="coins" size={16} color="#F59E0B" />
                    <Text style={styles.coinWonText}>+{coinWon} coins won!</Text>
                  </View>
                )}
              </LinearGradient>
            </MotiView>
          )}

          {/* Share rank */}
          {myEntry && (
            <TouchableOpacity style={styles.shareRankBtn} onPress={handleShareRank} activeOpacity={0.85}>
              <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.shareRankGrad}>
                <Ionicons name="share-social" size={18} color="#FFF" />
                <Text style={styles.shareRankText}>Share My Rank</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Leaderboard */}
          <Text style={styles.lbTitle}>Leaderboard</Text>
          {leaderboard.map((entry, i) => (
            <MotiView key={i} from={{ opacity: 0, translateX: -12 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: i * 50 }}
              style={[styles.lbRow, entry.is_me && styles.lbRowMe]}>
              <Text style={styles.lbRankIcon}>
                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.lbName}>{entry.display_name}{entry.is_me ? ' (You)' : ''}</Text>
                <Text style={styles.lbMeta}>{entry.score}/{room.question_count} · {QuizRoomsService.formatTime(entry.time_taken)}</Text>
              </View>
              {entry.coin_reward > 0 && (
                <View style={styles.lbCoin}>
                  <FontAwesome5 name="coins" size={10} color="#F59E0B" />
                  <Text style={styles.lbCoinText}>{entry.coin_reward}</Text>
                </View>
              )}
            </MotiView>
          ))}

          <TouchableOpacity style={styles.doneBtn} onPress={() => router.replace('/quiz-rooms')} activeOpacity={0.85}>
            <Text style={styles.doneBtnText}>Back to Quiz Rooms</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { justifyContent: 'center', alignItems: 'center' },
  glow1: { position: 'absolute', top: -80, right: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(139,92,246,0.07)' },

  loadingIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16 },
  loadingText: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#64748B', textAlign: 'center' },

  // Name entry
  lobbyWrap: { flex: 1, paddingHorizontal: 24, alignItems: 'center' },
  roomBadge: { backgroundColor: '#0F172A', borderRadius: 24, padding: 24, width: '100%', marginBottom: 20, alignItems: 'center' },
  invitedLabel: { fontSize: 10, fontFamily: 'Poppins-SemiBold', color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginBottom: 8 },
  roomBadgeTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 14 },
  roomBadgeMeta: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 },
  metaBadge: { fontSize: 11, fontFamily: 'Poppins-SemiBold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' },
  hostedBy: { fontSize: 12, fontFamily: 'Inter-Medium', color: 'rgba(255,255,255,0.4)' },
  nameCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: '100%', ...V2026.shadows.milky, borderWidth: 1, borderColor: 'rgba(15,23,42,0.07)' },
  nameLabel: { fontSize: 11, fontFamily: 'Poppins-SemiBold', color: '#94A3B8', letterSpacing: 1, marginBottom: 10 },
  nameInput: { height: 56, backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 18, fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#0F172A', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  joinBtn: { borderRadius: 16, overflow: 'hidden' },
  joinBtnGrad: { height: 56, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  joinBtnText: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#FFFFFF' },

  // Playing
  playHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12, gap: 12 },
  playProgress: { flex: 1 },
  playQNum: { fontSize: 13, fontFamily: 'Poppins-SemiBold', color: '#64748B' },
  playScore: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(245,158,11,0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  playScoreText: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#F59E0B' },
  playTimer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  playTimerText: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  timerTrack: { height: 5, backgroundColor: 'rgba(15,23,42,0.06)', marginHorizontal: 20, borderRadius: 3, overflow: 'hidden', marginBottom: 20 },
  timerFill: { height: '100%', borderRadius: 3 },
  playScroll: { paddingHorizontal: 20, gap: 12 },
  questionCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(15,23,42,0.06)', ...V2026.shadows.milky },
  questionText: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#0F172A', lineHeight: 27, textAlign: 'center' },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: 'rgba(15,23,42,0.06)', gap: 14, ...V2026.shadows.milky },
  optionCorrect: { backgroundColor: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.25)' },
  optionWrong: { backgroundColor: 'rgba(244,63,94,0.06)', borderColor: 'rgba(244,63,94,0.25)' },
  optionLetter: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  optionLetterText: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#64748B' },
  optionText: { flex: 1, fontSize: 14, fontFamily: 'Inter-SemiBold', color: '#334155' },
  explanationBox: { backgroundColor: 'rgba(0,212,199,0.05)', borderRadius: 20, padding: 18, borderLeftWidth: 4, borderLeftColor: '#00D4C7', gap: 8 },
  explanationHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  explanationLabel: { fontSize: 10, fontFamily: 'Poppins-Bold', color: '#00D4C7', letterSpacing: 1 },
  explanationText: { fontSize: 13, fontFamily: 'Inter-Medium', color: '#64748B', lineHeight: 20 },
  nextBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  nextGrad: { height: 52, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  nextBtnText: { fontSize: 15, fontFamily: 'Poppins-Bold', color: '#FFFFFF', letterSpacing: 1 },

  // Results
  resultsScroll: { paddingHorizontal: 20, gap: 12 },
  myResultCard: { borderRadius: 24, overflow: 'hidden', ...V2026.shadows.primary },
  myResultGrad: { padding: 28, alignItems: 'center' },
  myResultLabel: { fontSize: 10, fontFamily: 'Poppins-SemiBold', color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginBottom: 8 },
  myRank: { fontSize: 56, fontFamily: 'Poppins-Bold', color: '#FFFFFF' },
  myScore: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  myTime: { fontSize: 12, fontFamily: 'Inter-Medium', color: 'rgba(255,255,255,0.5)', marginBottom: 16 },
  coinWonBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(251,191,36,0.15)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14 },
  coinWonText: { fontSize: 15, fontFamily: 'Poppins-Bold', color: '#FBBF24' },
  shareRankBtn: { borderRadius: 18, overflow: 'hidden' },
  shareRankGrad: { height: 52, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  shareRankText: { fontSize: 15, fontFamily: 'Poppins-Bold', color: '#FFFFFF' },
  lbTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#0F172A', marginTop: 8 },
  lbRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(15,23,42,0.06)', gap: 12, ...V2026.shadows.milky },
  lbRowMe: { borderColor: '#8B5CF6', backgroundColor: '#FAFAF9' },
  lbRankIcon: { fontSize: 20, width: 36, textAlign: 'center' },
  lbName: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: '#0F172A' },
  lbMeta: { fontSize: 11, fontFamily: 'Inter-Medium', color: '#94A3B8' },
  lbCoin: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  lbCoinText: { fontSize: 12, fontFamily: 'Poppins-Bold', color: '#D97706' },
  doneBtn: { height: 52, borderRadius: 16, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  doneBtnText: { fontSize: 15, fontFamily: 'Poppins-SemiBold', color: '#7C3AED' },
});

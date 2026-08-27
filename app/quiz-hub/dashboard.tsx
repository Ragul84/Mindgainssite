import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HapticService from '../../utils/hapticService';
import ShareService from '../../utils/shareService';
import { QuizViralService, Participant } from '../../utils/quizViralService';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PARTICIPANTS = [
  { id: '1', name: 'Arjun Kumar', score: 98, time: '2:30', rank: 1, avatar: 'ðŸ‘¤' },
  { id: '2', name: 'Sriya Reddy', score: 95, time: '2:45', rank: 2, avatar: 'ðŸ‘¤' },
  { id: '3', name: 'Rahul Sharma', score: 92, time: '3:10', rank: 3, avatar: 'ðŸ‘¤' },
  { id: '4', name: 'Anita Desai', score: 88, time: '3:05', rank: 4, avatar: 'ðŸ‘¤' },
  { id: '5', name: 'Vikram Singh', score: 85, time: '3:40', rank: 5, avatar: 'ðŸ‘¤' },
];

export default function QuizDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [participants, setParticipants] = React.useState<Participant[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [distributed, setDistributed] = React.useState(false);
  
  const meshAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadLeaderboard();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(meshAnim, { toValue: 1, duration: 5000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(meshAnim, { toValue: 0, duration: 5000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await QuizViralService.getLeaderboard('viral-123');
      setParticipants(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const orbTranslateX = meshAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 40]
  });

  const handleDistribute = async () => {
    try {
      await QuizViralService.distributeRewards('viral-123');
      setDistributed(true);
      HapticService.notification('success');
      alert('Coins distributed successfully to the Top winners!');
    } catch (error: any) {
      alert(error.message || 'Failed to distribute rewards');
    }
  };

  return (
    <View style={styles.container}>
      {/* ðŸŒŒ Premium Backdrop */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
        <Animated.View 
          style={[
            styles.meshOrb, 
            { transform: [{ translateX: orbTranslateX }, { scale: 1.2 }] }
          ]} 
        />
      </View>

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          onPress={() => router.canGoBack() ? router.back() : router.replace('/quiz-hub')} 
          style={styles.backBtn} 
          activeOpacity={0.8}
        >
          <BlurView intensity={20} style={styles.backBtnBlur}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </BlurView>
        </TouchableOpacity>
        <MotiText 
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.headerTitle}
        >
          Analytics
        </MotiText>
        <TouchableOpacity 
          style={styles.shareBtn} 
          activeOpacity={0.8}
          onPress={() => ShareService.shareQuiz('dashboard-id', 'My Viral Quiz', '1,500')}
        >
          <Ionicons name="share-social" size={20} color="#0EA5E9" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ðŸ“Š Premium Stat Cards */}
        <View style={styles.statsGrid}>
          <MotiView 
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.statCard}
          >
            <View style={styles.statIconWrap}>
              <Ionicons name="people" size={18} color="#0EA5E9" />
            </View>
            <Text style={styles.statValue}>1.2k</Text>
            <Text style={styles.statLabel}>Participants</Text>
          </MotiView>
          
          <MotiView 
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 100 }}
            style={styles.statCard}
          >
            <View style={[styles.statIconWrap, { backgroundColor: 'rgba(0, 212, 199, 0.1)' }]}>
              <Ionicons name="flash" size={18} color="#00D4C7" />
            </View>
            <Text style={styles.statValue}>84%</Text>
            <Text style={styles.statLabel}>Avg. Accuracy</Text>
          </MotiView>
        </View>

        {/* ðŸ’° Prize Card (Pro Style) */}
        <MotiView 
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
          style={styles.prizeCard}
        >
          <LinearGradient
            colors={['#0F172A', '#1E293B']}
            style={styles.prizeBg}
          >
            <View style={styles.prizeContent}>
              <View>
                <Text style={styles.prizeLabel}>Staked Pool</Text>
                <View style={styles.prizeValueRow}>
                  <FontAwesome5 name="coins" size={20} color="#FBBF24" />
                  <Text style={styles.prizeValue}>1,500</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.distributeBtn, distributed && { opacity: 0.7 }]}
                onPress={handleDistribute}
                disabled={distributed}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={distributed ? ['#64748B', '#94A3B8'] : ['#00D4C7', '#0EA5E9']}
                  style={styles.distributeBtnGradient}
                >
                  <Text style={styles.distributeBtnText}>
                    {distributed ? 'Distributed' : 'Pay Winners'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </MotiView>

        {/* ðŸ† High-Fidelity Leaderboard */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hall of Fame</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        
        {loading ? (
          <ActivityIndicator size="small" color="#0EA5E9" style={{ marginTop: 20 }} />
        ) : participants.map((p, idx) => (
          <MotiView
            key={p.user_id}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 300 + (idx * 100) }}
            style={styles.rankCard}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC']}
              style={styles.rankCardInner}
            >
              <View style={[
                styles.rankBadge,
                p.rank === 1 ? styles.gold : p.rank === 2 ? styles.silver : p.rank === 3 ? styles.bronze : styles.normal
              ]}>
                <Text style={[
                  styles.rankText,
                  p.rank > 3 && { color: '#64748B' }
                ]}>
                  {p.rank}
                </Text>
              </View>
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{p.user_name}</Text>
                <Text style={styles.userMeta}>{p.time_taken}s â€¢ {p.score} points</Text>
              </View>

              {p.rank <= 3 && (
                <View style={styles.rewardBadge}>
                  <FontAwesome5 name="coins" size={10} color="#FBBF24" />
                  <Text style={styles.rewardText}>
                    {p.rank === 1 ? '750' : p.rank === 2 ? '450' : '300'}
                  </Text>
                </View>
              )}
            </LinearGradient>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  meshOrb: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    borderRadius: SCREEN_WIDTH / 2,
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    bottom: -150,
    left: -100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    zIndex: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
  },
  backBtnBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 4,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  prizeCard: {
    marginBottom: 32,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  prizeBg: {
    padding: 24,
  },
  prizeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prizeLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
  },
  prizeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  prizeValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  distributeBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  distributeBtnGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  distributeBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF4B4B',
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#64748B',
  },
  rankCard: {
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  rankCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gold: { backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FEF3C7' },
  silver: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9' },
  bronze: { backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: '#FFEDD5' },
  normal: { backgroundColor: '#FFFFFF', borderStyle: 'dashed', borderWidth: 1, borderColor: '#E2E8F0' },
  rankText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#D97706',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
  },
  userMeta: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    marginTop: 1,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  rewardText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#D97706',
    marginLeft: 6,
  },
});

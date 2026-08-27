import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { HeistSoundService } from '@/services/heistSoundService';
import { KnowledgeHeistGameService } from '@/services/knowledgeHeistService';
import { V2026 } from '@/theme/v2026-tokens';

interface LeaderboardProps {
  onClose: () => void;
  currentUserRank: number;
}

interface Player {
  rank: number;
  name: string;
  state: string;
  score: number;
  wins?: number;
  isCurrentUser?: boolean;
  avatar?: string;
}

type Tab = 'global' | 'weekly' | 'state';

export default function Leaderboard({ onClose, currentUserRank }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('global');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      let data: any[] = [];
      if (activeTab === 'global') {
        data = await KnowledgeHeistGameService.getGlobalLeaderboard();
      } else if (activeTab === 'weekly') {
        data = await KnowledgeHeistGameService.getWeeklyLeaderboard();
      } else {
        const stateData = await KnowledgeHeistGameService.getStateLeaderboard();
        data = stateData.map(s => ({
          rank: s.rank,
          name: s.name,
          state: s.code,
          score: s.xp,
          avatar: s.badge
        }));
      }

      setPlayers(data.map(p => ({
        rank: p.rank,
        name: p.userName || p.name,
        state: p.userState || p.state || 'IN',
        score: p.totalScore || p.score,
        wins: p.totalWins || 0,
        avatar: p.userAvatar || p.avatar || '👤'
      })));

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } catch (e) {
      console.error('Leaderboard load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#94A3B8';
    if (rank === 3) return '#B45309';
    return '#64748B';
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={1}>
            <FontAwesome5 name="chevron-left" size={20} color="#64748B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Arena Rankings</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.tabBar}>
          {(['global', 'weekly', 'state'] as Tab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                HeistSoundService.playButtonClick();
                setActiveTab(tab);
              }}
              style={[styles.tabItem, activeTab === tab && styles.tabActive]}
              activeOpacity={1}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator color="#00D4C7" />
          </View>
        ) : (
          <Animated.ScrollView 
            style={{ opacity: fadeAnim }}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {players.map((player, i) => (
              <View key={i} style={[styles.playerRow, player.isCurrentUser && styles.currentUserRow]}>
                <View style={styles.rankBadge}>
                   {player.rank <= 3 ? (
                     <FontAwesome5 name="crown" size={14} color={getRankColor(player.rank)} solid />
                   ) : (
                     <Text style={styles.rankText}>{player.rank}</Text>
                   )}
                </View>

                <View style={styles.avatarBox}>
                   <Text style={{fontSize: 20}}>{player.avatar}</Text>
                </View>

                <View style={styles.playerInfo}>
                   <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
                   <Text style={styles.playerState}>{player.state}</Text>
                </View>

                <View style={styles.scoreBox}>
                   <Text style={styles.scoreValue}>{player.score.toLocaleString()}</Text>
                   <Text style={styles.scoreLabel}>XP</Text>
                </View>
              </View>
            ))}
          </Animated.ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
    ...V2026.shadows.milky,
  },
  headerTitle: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: '#FFFFFF', ...V2026.shadows.milky },
  tabText: { fontSize: 11, fontFamily: 'Poppins-SemiBold', color: '#64748B', letterSpacing: 1 },
  tabTextActive: { color: '#00D4C7' },
  loader: { flex: 1, justifyContent: 'center' },
  listContent: { paddingHorizontal: 24, paddingBottom: 40 },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
    ...V2026.shadows.milky,
  },
  currentUserRow: { borderColor: '#00D4C7', backgroundColor: 'rgba(0, 212, 199, 0.02)' },
  rankBadge: { width: 30, alignItems: 'center' },
  rankText: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#64748B' },
  avatarBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 15, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  playerState: { fontSize: 11, fontFamily: 'Inter-Medium', color: '#94A3B8' },
  scoreBox: { alignItems: 'flex-end' },
  scoreValue: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  scoreLabel: { fontSize: 9, fontFamily: 'Poppins-SemiBold', color: '#00D4C7', letterSpacing: 1 },
});


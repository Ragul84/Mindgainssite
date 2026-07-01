import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeistSoundService } from '@/services/heistSoundService';
import { V2026 } from '@/theme/v2026-tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Vault {
  id: string;
  name: string;
  icon: string;
  color: string;
  reward: number;
  entryFee: number;
  playersCount: number;
  difficulty: string;
  isSpecial?: boolean;
}

const VAULTS: Vault[] = [
  { id: 'polity', name: 'Polity', icon: 'landmark', color: '#3B82F6', reward: 500, entryFee: 100, playersCount: 1247, difficulty: 'MEDIUM' },
  { id: 'science', name: 'Science', icon: 'flask', color: '#10B981', reward: 350, entryFee: 100, playersCount: 892, difficulty: 'EASY' },
  { id: 'history', name: 'History', icon: 'scroll', color: '#D946EF', reward: 450, entryFee: 100, playersCount: 756, difficulty: 'MEDIUM' },
  { id: 'geography', name: 'Geography', icon: 'globe-americas', color: '#14B8A6', reward: 300, entryFee: 150, playersCount: 512, difficulty: 'MEDIUM' },
  { id: 'economy', name: 'Economy', icon: 'chart-line', color: '#F59E0B', reward: 1200, entryFee: 250, playersCount: 634, difficulty: 'HARD' },
  { id: 'current-affairs', name: 'Current Affairs', icon: 'newspaper', color: '#F97316', reward: 2500, entryFee: 400, playersCount: 423, difficulty: 'ELITE' },
  { id: 'general', name: 'Elite Vault', icon: 'crown', color: '#8B5CF6', reward: 5000, entryFee: 500, playersCount: 105, difficulty: 'GOD-MODE', isSpecial: true },
];

interface VaultSelectionPremiumProps {
  onSelectVault: (vaultId: string) => void;
  onBack: () => void;
  recommendedVaultId?: string | null;
}

export default function VaultSelectionPremium({ onSelectVault, onBack, recommendedVaultId }: VaultSelectionPremiumProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 🌌 Premium Milky Backdrop */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={1}>
          <Ionicons name="chevron-back" size={24} color="#64748B" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Choose Your Vault</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {VAULTS.map((vault, i) => (
            <MotiView
              key={vault.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: i * 100 }}
              style={[
                styles.cardContainer,
                vault.isSpecial && styles.specialCardContainer,
              ]}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  HeistSoundService.playButtonClick();
                  onSelectVault(vault.id);
                }}
                style={styles.cardTouch}
              >
                <View style={styles.cardInner}>
                  <View style={styles.cardHeader}>
                     <View style={[styles.difficultyBadge, { backgroundColor: `${vault.color}10` }]}>
                        <Text style={[styles.difficultyText, { color: vault.color }]}>{vault.difficulty}</Text>
                     </View>
                     {vault.id === recommendedVaultId && (
                       <View style={styles.recommendedBadge}>
                         <Ionicons name="sparkles" size={10} color="#00D4C7" />
                       </View>
                     )}
                     <View style={styles.playerCount}>
                        <View style={styles.liveDot} />
                        <Text style={styles.countText}>{vault.playersCount}</Text>
                     </View>
                  </View>

                  <View style={styles.cardBody}>
                    <View style={[styles.iconGlow, { backgroundColor: `${vault.color}08`, borderColor: `${vault.color}20` }]}>
                      <FontAwesome5 name={vault.icon} size={24} color={vault.color} solid />
                    </View>
                    <Text style={styles.vaultName}>{vault.name}</Text>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.statBox}>
                       <Text style={styles.statLabel}>ENTRY</Text>
                       <Text style={styles.statValue}>{vault.entryFee}</Text>
                    </View>
                    <View style={[styles.statBox, { alignItems: 'flex-end' }]}>
                       <Text style={styles.statLabel}>REWARD</Text>
                       <Text style={[styles.statValue, { color: '#00D4C7' }]}>{vault.reward}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </MotiView>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
    gap: 16,
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
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', color: '#0F172A', letterSpacing: -0.5 },
  scrollContent: { padding: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  cardContainer: { width: (SCREEN_WIDTH - 64) / 2, height: 210 },
  specialCardContainer: { width: '100%', height: 160 },
  cardTouch: { 
    flex: 1, 
    borderRadius: 24, 
    backgroundColor: '#FFFFFF',
    borderWidth: 1, 
    borderColor: 'rgba(15, 23, 42, 0.05)',
    ...V2026.shadows.milky,
  },
  cardInner: { flex: 1, padding: 16, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  difficultyBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  difficultyText: { fontSize: 9, fontFamily: 'Poppins-SemiBold' },
  recommendedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 212, 199, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerCount: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#10B981' },
  countText: { fontSize: 10, fontFamily: 'Inter-Medium', color: '#94A3B8' },
  cardBody: { alignItems: 'center', gap: 10 },
  iconGlow: { width: 52, height: 52, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  vaultName: { fontSize: 15, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { gap: 2 },
  statLabel: { fontSize: 8, fontFamily: 'Poppins-SemiBold', color: '#94A3B8', letterSpacing: 0.5 },
  statValue: { fontSize: 13, fontFamily: 'Poppins-Bold', color: '#0F172A' },
});


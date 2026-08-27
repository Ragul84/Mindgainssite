import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { HeistSoundService } from '@/services/heistSoundService';
import { VAULT_CONFIG } from '@/services/knowledgeHeistService';

interface VaultSelectionProps {
  onSelectVault: (vaultId: string) => void;
  onBack: () => void;
}

interface Vault {
  id: string;
  name: string;
  icon: string;
  color1: string;
  color2: string;
  reward: number;
  entryFee: number;
  playersCount: number;
  isSpecial?: boolean;
}

const VAULTS: Vault[] = [
  { id: 'polity', name: 'Polity', icon: 'landmark', color1: '#1E3A8A', color2: '#3B82F6', reward: 500, entryFee: 100, playersCount: 1247 },
  { id: 'science', name: 'Science', icon: 'flask', color1: '#14532D', color2: '#22C55E', reward: 350, entryFee: 100, playersCount: 892 },
  { id: 'history', name: 'History', icon: 'scroll', color1: '#701A75', color2: '#D946EF', reward: 450, entryFee: 100, playersCount: 756 },
  { id: 'geography', name: 'Geography', icon: 'globe-asia', color1: '#064E3B', color2: '#10B981', reward: 400, entryFee: 150, playersCount: 923 },
  { id: 'economy', name: 'Economy', icon: 'chart-line', color1: '#B45309', color2: '#F59E0B', reward: 1200, entryFee: 250, playersCount: 634 },
  { id: 'current-affairs', name: 'Current Affairs', icon: 'newspaper', color1: '#9A3412', color2: '#F97316', reward: 2500, entryFee: 400, playersCount: 423 },
  { id: 'general', name: 'The Elite Vault', icon: 'crown', color1: '#4C1D95', color2: '#8B5CF6', reward: 10000, entryFee: 1000, playersCount: 105, isSpecial: true },
];

export default function VaultSelection({ onSelectVault, onBack }: VaultSelectionProps) {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Render a single Vault card
  const renderVault = (vault: Vault, index: number) => {
    return (
      <TouchableOpacity 
        key={vault.id} 
        style={[styles.vaultCardWrapper, vault.isSpecial && styles.vaultCardWrapperSpecial]}
        onPress={() => {
          HeistSoundService.playButtonClick();
          onSelectVault(vault.id);
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={[styles.vaultCard, vault.isSpecial && styles.vaultCardSpecial]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Top Info Bar */}
          <View style={styles.vaultCardHeader}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveCountText}>{vault.playersCount}</Text>
            </View>
            {vault.isSpecial && (
               <View style={styles.specialBadge}>
                   <Text style={styles.specialBadgeText}>ELITE</Text>
               </View>
            )}
          </View>

          {/* Center Icon & Name */}
          <View style={styles.vaultCenter}>
              <View style={[styles.iconCircle, { shadowColor: vault.color2 }]}>
                  <FontAwesome5 name={vault.icon} size={28} color={vault.color2} solid />
              </View>
              <Text style={styles.vaultName}>{vault.name}</Text>
          </View>

          {/* Bottom Stats (Entry & Reward) */}
          <View style={styles.vaultStats}>
             <View style={styles.statPillBlue}>
                 <Text style={styles.pillLabel}>ENTRY</Text>
                 <Text style={styles.pillValue}>{vault.entryFee}</Text>
             </View>
             <View style={styles.statPillGold}>
                 <Text style={styles.pillLabelDark}>REWARD</Text>
                 <Text style={[styles.pillValueDark, { color: vault.color2 }]}>{vault.reward}</Text>
             </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Minimal Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.gridOverlay} />
      </View>

      {/* Header Banner */}
      <View style={styles.headerRow}>
         <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <FontAwesome5 name="chevron-left" size={16} color="#64748B" />
         </TouchableOpacity>

         <View style={styles.glassBanner}>
             <Text style={styles.bannerText}>SELECT VAULT</Text>
         </View>
         <View style={{ width: 44 }} />
      </View>

      {/* Grid of Vaults */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.grid}>
          {VAULTS.map((vault, index) => renderVault(vault, index))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    zIndex: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  glassBanner: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  bannerText: {
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    fontSize: 14,
    letterSpacing: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vaultCardWrapper: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 24,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  vaultCardWrapperSpecial: {
    width: '100%',
    shadowColor: '#8B5CF6',
  },
  vaultCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    alignItems: 'center',
    minHeight: 180,
  },
  vaultCardSpecial: {
    paddingVertical: 24,
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  vaultCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'flex-start',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  liveCountText: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  specialBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  specialBadgeText: {
    color: '#9333EA',
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    letterSpacing: 1,
  },
  vaultCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  vaultName: {
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    fontSize: 16,
    textAlign: 'center',
  },
  vaultStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },
  statPillBlue: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginRight: 6,
    alignItems: 'center',
  },
  statPillGold: {
    flex: 1,
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginLeft: 6,
    alignItems: 'center',
  },
  pillLabel: {
    color: '#64748B',
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 1,
  },
  pillValue: {
    color: '#0F172A',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  pillLabelDark: {
    color: '#D97706',
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 1,
  },
  pillValueDark: {
    color: '#D97706',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
});


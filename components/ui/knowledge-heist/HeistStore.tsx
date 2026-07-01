// MindClash - Academy Store (Ultra High Fidelity)

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { HeistSoundService } from '@/services/heistSoundService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'mg';
  icon: string;
  color: string;
  quantity?: number;
  tag?: string;
}

interface HeistStoreProps {
  userMg: number;
  onBack: () => void;
  onPurchase: (item: StoreItem) => void;
}

const DAILY_DEALS: StoreItem[] = [
  { id: 'scan_3', name: 'Mental Scan Pack', description: 'x3 Mental Scans to reveal answers', price: 450, currency: 'mg', icon: 'brain', color: '#00D4C7', tag: '20% OFF' },
  { id: 'freeze_2', name: 'Time Freeze Set', description: 'x2 Freeze items for tight timers', price: 300, currency: 'mg', icon: 'snowflake', color: '#0EA5E9' },
  { id: 'ins_flash', name: 'Insight Flash', description: 'x1 Instant question skip', price: 150, currency: 'mg', icon: 'bolt', color: '#F59E0B', tag: 'DAILY' },
];

const SPECIAL_ACCESS: StoreItem[] = [
  { 
    id: 'general', 
    name: 'ELITE VAULT ACCESS', 
    description: 'Permanent unlock for Elite Arena', 
 
    price: 10000, 
    currency: 'mg', 
    icon: 'crown', 
    color: '#0EA5E9',
    tag: 'ULTIMATE'
  },
];

export default function HeistStore({ userMg, onBack, onPurchase }: HeistStoreProps) {
  return (
    <View style={styles.container}>
      {/* Integrated Tactical Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <FontAwesome5 name="chevron-left" size={16} color="#94A3B8" />
        </TouchableOpacity>
        <View style={styles.headerTitleGroup}>
            <Text style={styles.headerLabel}>LOGISTICS HUB</Text>
            <Text style={styles.headerTitle}>ACADEMY STORE</Text>

        </View>
        <View style={styles.currencyGroup}>
          <View style={styles.currencyBox}>
            <FontAwesome5 name="medal" size={10} color="#F59E0B" solid />

            <Text style={styles.currencyText}>{userMg}</Text>
          </View>
        </View>
      </View>

      <View style={styles.mainContent}>
        {/* Compact Gear Grid */}
        <StoreSection title="TACTICAL GEAR" icon="shield-alt">
          <View style={styles.dealsGrid}>
            {DAILY_DEALS.map(item => (
              <StoreCard key={item.id} item={item} onPress={() => onPurchase(item)} />
            ))}
          </View>
        </StoreSection>

        {/* Special Access */}
        <StoreSection title="SPECIAL ACCESS" icon="crown">
          <View style={styles.tokenGrid}>
            {SPECIAL_ACCESS.map(item => (
              <CompactTokenCard key={item.id} item={item} onPress={() => onPurchase(item)} />
            ))}
          </View>
        </StoreSection>

        <View style={styles.footer}>
          <Text style={styles.footerText}>NEXT LOGISTICS RE-STOCK IN 14H</Text>
        </View>
      </View>
    </View>
  );
}

function StoreSection({ title, icon, children }: any) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <FontAwesome5 name={icon} size={10} color="#0EA5E9" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function StoreCard({ item, onPress }: { item: StoreItem, onPress: () => void }) {
  return (
    <TouchableOpacity onPress={() => { HeistSoundService.playButtonClick(); onPress(); }} activeOpacity={0.8} style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
            <FontAwesome5 name={item.icon} size={20} color={item.color} solid />
        </View>
        <Text style={styles.cardName} numberOfLines={1}>{item.name.toUpperCase()}</Text>
        <View style={styles.priceTag}>
          <FontAwesome5 name="medal" size={8} color="#F59E0B" solid />

          <Text style={styles.priceText}>{item.price}</Text>
        </View>
    </TouchableOpacity>
  );
}

function CompactTokenCard({ item, onPress }: { item: StoreItem, onPress: () => void }) {
  return (
    <TouchableOpacity onPress={() => { HeistSoundService.playButtonClick(); onPress(); }} activeOpacity={0.8} style={styles.tokenCard}>
        <View style={styles.tokenInfo}>
            <Text style={styles.tokenName}>{item.name}</Text>
            <Text style={styles.tokenDesc}>{item.description}</Text>
        </View>
        <View style={styles.tokenBuy}>
            <FontAwesome5 name="medal" size={10} color="#F59E0B" solid />

            <Text style={styles.tokenPrice}>{item.price}</Text>
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  headerTitleGroup: {
    alignItems: 'center',
    gap: 2,
  },
  headerLabel: {
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
    color: '#94A3B8',
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    letterSpacing: 1,
  },
  currencyGroup: {
    flexDirection: 'row',
  },
  currencyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  currencyText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'flex-start',
    gap: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
    letterSpacing: 2,
  },
  dealsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    width: (SCREEN_WIDTH - 40 - 16) / 3,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 9,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#D97706',
  },
  tokenGrid: {
    gap: 8,
  },
  tokenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'space-between',
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  tokenDesc: {
    fontSize: 9,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  tokenBuy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  tokenPrice: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#D97706',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
    color: '#94A3B8',
    letterSpacing: 2,
  },
});


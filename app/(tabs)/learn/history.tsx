// 🎞️ Lab History – Premium Milky White Redesign
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SupabaseService, supabase } from '@/utils/supabaseService';
import { MotiView } from 'moti';
import HapticService from '@/utils/hapticService';
import UniversalNavigation from '@/utils/universalNavigation';
import { V2026 } from '@/theme/v2026-tokens';

export default function LabHistoryScreen() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const user = await SupabaseService.getCurrentUser();
      if (!user) return;

      const { data: notes } = await supabase
        .from('study_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const mapped = notes?.map(n => ({
        id: n.id,
        title: n.title,
        subtitle: `Analyzed ${n.source_type.toUpperCase()}`,
        type: 'study_notes',
        timestamp: n.created_at,
        source: n.source_type,
        gradient: getGradient(n.source_type),
        icon: getIcon(n.source_type)
      })) || [];

      setActivities(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getGradient = (source: string) => {
    const maps: any = {
      youtube: ['#FEE2E2', '#EF4444'],
      pdf: ['#FEF3C7', '#F59E0B'],
      camera: ['#EFF6FF', '#3B82F6']
    };
    return maps[source] || ['#F3E8FF', '#8B5CF6'];
  };

  const getIcon = (source: string) => {
    const maps: any = { youtube: 'logo-youtube', pdf: 'document-text-outline', camera: 'camera-outline' };
    return maps[source] || 'sparkles-outline';
  };

  const getIconColor = (source: string) => {
    const maps: any = { youtube: '#DC2626', pdf: '#D97706', camera: '#2563EB' };
    return maps[source] || '#7C3AED';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => { HapticService.light(); router.back(); }} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lab History</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={fetchHistory} 
              tintColor="#6366F1" 
              colors={['#6366F1']} 
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <ActivityIndicator color="#6366F1" size="large" style={{ marginTop: 40 }} />
          ) : activities.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="archive-outline" size={40} color="#64748B" />
              </View>
              <Text style={styles.emptyText}>No history found</Text>
              <Text style={styles.emptySub}>Your compiled study materials will appear here</Text>
            </View>
          ) : (
            activities.map((item, i) => (
              <MotiView
                key={item.id}
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: i * 40 }}
              >
                <TouchableOpacity 
                  style={styles.card} 
                  activeOpacity={0.8} 
                  onPress={() => {
                    HapticService.light();
                    UniversalNavigation.navigateTo({
                      pathname: '/learn/content-viewer',
                      params: { contentId: item.id, contentType: 'study_notes', source: item.source, title: item.title }
                    });
                  }}
                >
                  <View style={[styles.iconBox, { backgroundColor: item.gradient[0] }]}>
                    <Ionicons name={item.icon} size={20} color={getIconColor(item.source)} />
                  </View>
                  <View style={styles.info}>
                    <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="rgba(15, 23, 42, 0.3)" />
                </TouchableOpacity>
              </MotiView>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    ...V2026.shadows.milky,
  },
  headerTitle: { color: '#0F172A', fontSize: 16, fontFamily: 'Poppins-Bold' },
  content: { paddingHorizontal: 16, paddingVertical: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
    ...V2026.shadows.milky,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  info: { flex: 1 },
  title: { color: '#0F172A', fontSize: 14, fontFamily: 'Poppins-Bold' },
  subtitle: { color: '#64748B', fontSize: 11, fontFamily: 'Inter-Medium', marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: { color: '#0F172A', fontSize: 16, fontFamily: 'Poppins-Bold' },
  emptySub: { color: '#64748B', fontSize: 12, fontFamily: 'Inter-Medium', textAlign: 'center', marginTop: 4, lineHeight: 18 },
});
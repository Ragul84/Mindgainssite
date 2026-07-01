// 📚 Study Notes – Premium Milky White & Exam POV Redesign
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Share,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import { SupabaseService } from '@/utils/supabaseService';
import HapticService from '@/utils/hapticService';
import { V2026 } from '@/theme/v2026-tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function StudyNotesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadNotes();
  }, [id]);

  const loadNotes = async () => {
    try {
      const res = await SupabaseService.getStudyNotesWithProgress(id);
      if (res.success) setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={styles.loader}>
      <ActivityIndicator color="#6366F1" size="large" />
    </View>
  );

  const notes = data?.notes_content || {};
  const overviewText = notes.overview || notes.summary || 'Overview not available.';
  const points = notes.keyPoints || notes.key_points || [];
  const traps = notes.exam_traps || notes.traps || [
    'Always read the prompt keywords carefully (e.g., "NOT", "EXCEPT").',
    'Do not confuse core concepts with temporary anomalies in exam scenarios.',
  ];

  const handleShare = () => {
    HapticService.light();
    Share.share({
      message: `Study Notes: ${data?.title || 'Notes'}\n\n${overviewText}`,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => { HapticService.light(); router.back(); }} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={20} color="#0F172A" />
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.headerTitle}>{data?.title || 'Study Notes'}</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={handleShare} style={styles.headerBtn}>
            <Ionicons name="share-outline" size={18} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Quick Stats Box */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={styles.statsCard}
          >
            <View style={styles.stat}>
              <Text style={styles.statVal}>{data?.quality_score || 98}%</Text>
              <Text style={styles.statLab}>EXAM MATCH</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>{data?.reading_time || 5}m</Text>
              <Text style={styles.statLab}>READ TIME</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>{data?.difficulty?.toUpperCase() || 'MED'}</Text>
              <Text style={styles.statLab}>LEVEL</Text>
            </View>
          </MotiView>

          {/* Section 1: Overview & Syllabus Scope Card */}
          <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 100 }}
            style={styles.sectionCard}
          >
            <View style={styles.cardHeader}>
              <LinearGradient colors={['#EFF6FF', '#DBEAFE']} style={styles.cardIconBg}>
                <Ionicons name="compass-outline" size={16} color="#2563EB" />
              </LinearGradient>
              <View>
                <Text style={styles.cardSectionLabel}>SECTION 01</Text>
                <Text style={styles.cardTitle}>Syllabus Scope & Overview</Text>
              </View>
            </View>
            <Text style={styles.bodyText}>{overviewText}</Text>
          </MotiView>

          {/* Section 2: High-Yield Facts Card */}
          {points.length > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 15 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 200 }}
              style={styles.sectionCard}
            >
              <View style={styles.cardHeader}>
                <LinearGradient colors={['#FEF3C7', '#FDE68A']} style={styles.cardIconBg}>
                  <Ionicons name="star" size={16} color="#D97706" />
                </LinearGradient>
                <View>
                  <Text style={styles.cardSectionLabel}>SECTION 02</Text>
                  <Text style={styles.cardTitle}>High-Yield Facts (Must-Remember)</Text>
                </View>
              </View>
              <View style={styles.bulletList}>
                {points.map((p: string, i: number) => (
                  <View key={i} style={styles.pointRow}>
                    <FontAwesome name="star" size={12} color="#FBBF24" style={styles.starBullet} />
                    <Text style={styles.pointText}>{p}</Text>
                  </View>
                ))}
              </View>
            </MotiView>
          )}

          {/* Section 3: Common Exam Traps & Pitfalls Card */}
          <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300 }}
            style={[styles.sectionCard, styles.trapCard]}
          >
            <View style={styles.cardHeader}>
              <LinearGradient colors={['#FEE2E2', '#FECACA']} style={styles.cardIconBg}>
                <Ionicons name="warning" size={16} color="#DC2626" />
              </LinearGradient>
              <View>
                <Text style={[styles.cardSectionLabel, { color: '#DC2626' }]}>EXAM ALERTS</Text>
                <Text style={styles.cardTitle}>Common Exam Traps & Pitfalls</Text>
              </View>
            </View>
            <View style={styles.trapBox}>
              {traps.map((trap: string, i: number) => (
                <View key={i} style={styles.trapRow}>
                  <Text style={styles.trapBullet}>⚠️</Text>
                  <Text style={styles.trapText}>{trap}</Text>
                </View>
              ))}
            </View>
          </MotiView>

          {/* Complete Button */}
          <TouchableOpacity
            style={styles.completeBtn}
            activeOpacity={0.9}
            onPress={() => {
              HapticService.success();
              router.back();
            }}
          >
            <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.completeGrad}>
              <Text style={styles.completeText}>FINISH STUDYING</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loader: { flex: 1, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
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
  headerBtn: {
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
  headerTitle: {
    flex: 1,
    color: '#0F172A',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  content: { paddingHorizontal: 16, paddingVertical: 20 },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
    ...V2026.shadows.milky,
  },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { color: '#6366F1', fontSize: 16, fontFamily: 'Poppins-Bold' },
  statLab: { color: '#64748B', fontSize: 8.5, fontFamily: 'Poppins-Bold', letterSpacing: 0.5, marginTop: 2 },
  statDivider: { width: 1, height: '60%', backgroundColor: 'rgba(15, 23, 42, 0.08)', alignSelf: 'center' },
  
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
    ...V2026.shadows.milky,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  cardIconBg: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSectionLabel: { color: '#6366F1', fontSize: 8.5, fontFamily: 'Poppins-Bold', letterSpacing: 1 },
  cardTitle: { color: '#0F172A', fontSize: 13, fontFamily: 'Poppins-Bold', marginTop: 1 },
  bodyText: { color: '#334155', fontSize: 13.5, fontFamily: 'Inter-Medium', lineHeight: 22 },
  
  bulletList: { gap: 10 },
  pointRow: { flexDirection: 'row', alignItems: 'flex-start' },
  starBullet: { marginTop: 4, marginRight: 10 },
  pointText: { flex: 1, color: '#334155', fontSize: 13.5, fontFamily: 'Inter-Medium', lineHeight: 20 },
  
  trapCard: { borderColor: 'rgba(239, 68, 68, 0.15)', backgroundColor: 'rgba(254, 242, 242, 0.5)' },
  trapBox: { gap: 10 },
  trapRow: { flexDirection: 'row', alignItems: 'flex-start' },
  trapBullet: { marginRight: 8, fontSize: 12, marginTop: 1 },
  trapText: { flex: 1, color: '#475569', fontSize: 13, fontFamily: 'Inter-SemiBold', lineHeight: 18 },
  
  completeBtn: { marginTop: 16, borderRadius: 20, overflow: 'hidden', ...V2026.shadows.milky },
  completeGrad: { paddingVertical: 15, alignItems: 'center' },
  completeText: { color: '#FFFFFF', fontSize: 13, fontFamily: 'Poppins-Bold', letterSpacing: 0.8 },
});

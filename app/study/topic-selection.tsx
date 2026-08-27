// 📚 Study Topic Selection Screen - Exact Quiz Hub Style
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from '@/utils/reanimated';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '@/constants/theme';
import { UnifiedBackground } from '@/components/ui/UnifiedBackground';
import CompactTopBar from '@/components/ui/CompactTopBar';
import PressableScale from '@/components/ui/PressableScale';
import { ContentPlaceholder } from '@/components/ui/SkeletonLoader';

const { width } = Dimensions.get('window');

// ---- Spacing & sizing tokens (8pt grid) ----
const S = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;
const RADIUS = 14; // calmer rounding

// Hardcoded study topics for fast loading
const STUDY_TOPICS: { [key: string]: any[] } = {
  'ae5759bb-f924-4daf-a431-00af568b4fd4': [
    { id: 'ancient-india', name: 'Ancient India', description: 'Indus Valley to Gupta Period', icon: 'landmark', color: '#EF4444' },
    { id: 'delhi-sultanate', name: 'Delhi Sultanate', description: '1206-1526 CE', icon: 'fort-awesome', color: '#DC2626' },
    { id: 'mughal-empire', name: 'Mughal Empire', description: 'Babur to Aurangzeb', icon: 'crown', color: '#B91C1C' },
    { id: 'maratha-empire', name: 'Maratha Empire', description: 'Shivaji to Peshwas', icon: 'horse-head', color: '#991B1B' },
    { id: 'british-india', name: 'British India', description: 'Company Rule to Crown Rule', icon: 'chess-rook', color: '#7F1D1D' },
    { id: 'freedom-struggle', name: 'Freedom Struggle', description: '1857-1947', icon: 'fist-raised', color: '#EF4444' },
    { id: 'post-independence', name: 'Post Independence', description: '1947 onwards', icon: 'flag', color: '#DC2626' },
    { id: 'art-culture', name: 'Art & Culture', description: 'Literature, Music, Dance', icon: 'palette', color: '#B91C1C' },
  ],
  '711f7198-da6f-43fc-b3ae-92b10739b5d6': [
    { id: 'constitution-basics', name: 'Constitution Basics', description: 'Making, Sources & Features', icon: 'scroll', color: '#10B981' },
    { id: 'fundamental-rights', name: 'Fundamental Rights', description: 'Articles 12-35', icon: 'shield-alt', color: '#059669' },
    { id: 'dpsp', name: 'DPSP', description: 'Directive Principles', icon: 'compass', color: '#047857' },
    { id: 'parliament', name: 'Parliament', description: 'Lok Sabha & Rajya Sabha', icon: 'university', color: '#065F46' },
    { id: 'judiciary', name: 'Judiciary', description: 'Supreme Court System', icon: 'balance-scale', color: '#064E3B' },
    { id: 'executive', name: 'Executive', description: 'President & PM', icon: 'user-tie', color: '#10B981' },
    { id: 'federalism', name: 'Federalism', description: 'Centre-State Relations', icon: 'sitemap', color: '#059669' },
    { id: 'local-govt', name: 'Local Government', description: 'Panchayati Raj', icon: 'home', color: '#047857' },
  ],
  'c08028e1-282e-466d-add2-c258504ad670': [
    { id: 'physical-geography', name: 'Physical Geography', description: 'Earth & Landforms', icon: 'mountain', color: '#3B82F6' },
    { id: 'indian-geography', name: 'Indian Geography', description: 'Physical Features', icon: 'map', color: '#2563EB' },
    { id: 'world-geography', name: 'World Geography', description: 'Continents & Oceans', icon: 'globe', color: '#1D4ED8' },
    { id: 'climate-weather', name: 'Climate & Weather', description: 'Monsoons & Seasons', icon: 'cloud-rain', color: '#1E40AF' },
    { id: 'resources', name: 'Natural Resources', description: 'Minerals & Energy', icon: 'gem', color: '#1E3A8A' },
    { id: 'agriculture', name: 'Agriculture', description: 'Crops & Farming', icon: 'seedling', color: '#3B82F6' },
    { id: 'industries', name: 'Industries', description: 'Manufacturing Hubs', icon: 'industry', color: '#2563EB' },
    { id: 'transport', name: 'Transport', description: 'Roads, Ports', icon: 'truck', color: '#1D4ED8' },
  ],
  'f3c8b2a1-9e4d-4b7c-8a6f-1d3e5g7h9i0j': [
    { id: 'basic-concepts', name: 'Basic Concepts', description: 'GDP, Inflation, etc.', icon: 'chart-line', color: '#F59E0B' },
    { id: 'indian-economy', name: 'Indian Economy', description: 'Structure & Growth', icon: 'chart-bar', color: '#D97706' },
    { id: 'planning', name: 'Economic Planning', description: 'Five Year Plans', icon: 'calendar-alt', color: '#B45309' },
    { id: 'agriculture-economy', name: 'Agriculture', description: 'Rural Economy', icon: 'tractor', color: '#92400E' },
    { id: 'industry-economy', name: 'Industry', description: 'Manufacturing Sector', icon: 'cogs', color: '#78350F' },
    { id: 'services', name: 'Services Sector', description: 'IT, Banking, etc.', icon: 'laptop', color: '#F59E0B' },
    { id: 'banking', name: 'Banking & Finance', description: 'RBI, Commercial Banks', icon: 'university', color: '#D97706' },
    { id: 'budget', name: 'Union Budget', description: 'Fiscal Policy', icon: 'file-invoice-dollar', color: '#B45309' },
  ],
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890': [
    { id: 'physics', name: 'Physics', description: 'Mechanics, Optics, etc.', icon: 'atom', color: '#8B5CF6' },
    { id: 'chemistry', name: 'Chemistry', description: 'Organic, Inorganic', icon: 'flask', color: '#7C3AED' },
    { id: 'biology', name: 'Biology', description: 'Life Sciences', icon: 'dna', color: '#6D28D9' },
    { id: 'space-tech', name: 'Space Technology', description: 'ISRO & Missions', icon: 'rocket', color: '#5B21B6' },
    { id: 'defense-tech', name: 'Defense Technology', description: 'Military Innovations', icon: 'fighter-jet', color: '#4C1D95' },
    { id: 'it-computers', name: 'IT & Computers', description: 'AI, Internet, etc.', icon: 'microchip', color: '#8B5CF6' },
    { id: 'biotechnology', name: 'Biotechnology', description: 'Genetic Engineering', icon: 'microscope', color: '#7C3AED' },
    { id: 'renewable-energy', name: 'Renewable Energy', description: 'Solar, Wind Power', icon: 'solar-panel', color: '#6D28D9' },
  ],
  'z9y8x7w6-v5u4-3210-zyxw-vu9876543210': [
    { id: 'national-affairs', name: 'National Affairs', description: 'India Politics', icon: 'flag', color: '#06B6D4' },
    { id: 'international-affairs', name: 'International', description: 'Global Events', icon: 'globe-americas', color: '#0891B2' },
    { id: 'economy-current', name: 'Economy News', description: 'Latest Economic Trends', icon: 'chart-line', color: '#0E7490' },
    { id: 'science-current', name: 'Science & Tech', description: 'Latest Discoveries', icon: 'atom', color: '#155E75' },
    { id: 'sports-current', name: 'Sports', description: 'Recent Achievements', icon: 'medal', color: '#164E63' },
    { id: 'awards-honors', name: 'Awards & Honors', description: 'Nobel, Padma, etc.', icon: 'trophy', color: '#06B6D4' },
  ],
  'q1w2e3r4-t5y6-7890-qwer-ty1234567890': [
    { id: 'ecology', name: 'Ecology', description: 'Ecosystems & Biodiversity', icon: 'leaf', color: '#059669' },
    { id: 'climate-change', name: 'Climate Change', description: 'Global Warming', icon: 'thermometer-half', color: '#047857' },
    { id: 'pollution', name: 'Pollution', description: 'Air, Water, Soil', icon: 'smog', color: '#065F46' },
    { id: 'conservation', name: 'Conservation', description: 'Wildlife Protection', icon: 'tree', color: '#064E3B' },
    { id: 'renewable-resources', name: 'Renewable Resources', description: 'Sustainable Energy', icon: 'solar-panel', color: '#059669' },
    { id: 'environmental-laws', name: 'Environmental Laws', description: 'Acts & Policies', icon: 'balance-scale', color: '#047857' },
  ],
  'm1n2b3v4-c5x6-7890-mnbv-cx1234567890': [
    { id: 'indian-art', name: 'Indian Art', description: 'Paintings & Sculptures', icon: 'palette', color: '#EC4899' },
    { id: 'music-dance', name: 'Music & Dance', description: 'Classical Forms', icon: 'music', color: '#DB2777' },
    { id: 'literature', name: 'Literature', description: 'Classical & Modern', icon: 'book', color: '#BE185D' },
    { id: 'architecture', name: 'Architecture', description: 'Temples & Monuments', icon: 'monument', color: '#9D174D' },
    { id: 'festivals', name: 'Festivals', description: 'Religious & Cultural', icon: 'calendar-day', color: '#831843' },
    { id: 'languages', name: 'Languages', description: 'Regional Diversity', icon: 'language', color: '#EC4899' },
  ],
};

export default function TopicSelection() {
  const { subjectId, subjectName } = useLocalSearchParams();
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const enter = useSharedValue(0);
  const aPage = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: interpolate(enter.value, [0, 1], [8, 0]) }],
  }));

  useEffect(() => {
    const init = async () => {
      // Simulate loading for better UX
      setTimeout(() => {
        const subjectTopics = STUDY_TOPICS[subjectId as string] || [];
        setTopics(subjectTopics);
        setLoading(false);
        setInitialLoading(false);
        enter.value = withTiming(1, { duration: 450 });
      }, 800);
    };
    
    init();
  }, [subjectId]);

  const handleTopicSelect = (topic: any) => {
    router.push({
      pathname: '/study/reading-interface',
      params: {
        subjectId,
        subjectName,
        topicId: topic.id,
        topicName: topic.name,
      },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/study-hub');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <UnifiedBackground />

      <SafeAreaView style={styles.safe} edges={['left','right','bottom']}>
        <View style={styles.headerContainer}>
          <CompactTopBar
            title={subjectName as string || 'Topics'}
            subtitle="Choose a topic to study"
            onBack={handleBack}
          />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: S.xxxl, paddingTop: S.xl, paddingBottom: 96 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                setTimeout(() => setRefreshing(false), 600);
              }}
              colors={[theme.colors.accent.purple]}
              tintColor={theme.colors.accent.purple}
              progressBackgroundColor="rgba(139,92,246,0.10)"
            />
          }
        >
          {initialLoading ? (
            <View>
              <ContentPlaceholder lines={1} style={{ marginBottom: S.xl, width: '60%', height: 24 }} />
              <View style={styles.grid}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.modeCard,
                      { 
                        width: (width - S.xxxl * 2 - S.xl) / 2,
                        height: 160,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.08)',
                      }
                    ]}
                  >
                    <ContentPlaceholder lines={2} style={{ margin: S.xl }} />
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Animated.View style={aPage}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Select Topic</Text>
              </View>

              <View style={styles.grid}>
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.modeCard,
                        { 
                          width: (width - S.xxxl * 2 - S.xl) / 2,
                          height: 160,
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          borderWidth: 1,
                          borderColor: 'rgba(255,255,255,0.08)',
                        }
                      ]}
                    >
                      <ContentPlaceholder lines={2} style={{ margin: S.xl }} />
                    </View>
                  ))
                ) : topics.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No topics found for this subject</Text>
                  </View>
                ) : (
                  topics.map((topic) => (
                  <PressableScale
                    key={topic.id}
                    style={[styles.modeCard, { width: (width - S.xxxl * 2 - S.xl) / 2 }]}
                    onPress={() => handleTopicSelect(topic)}
                    accessibilityLabel={`${topic.name}. ${topic.description}`}
                  >
                    <LinearGradient
                      colors={[`rgba(255,255,255,0.05)`, `rgba(255,255,255,0.02)`]}
                      style={styles.modeInner}
                    >
                      <LinearGradient 
                        colors={[topic.color || '#667eea', topic.color ? `${topic.color}AA` : '#764ba2']} 
                        style={styles.modeIconBg}
                      >
                        <FontAwesome5 name={topic.icon || 'book'} size={18} color="#FFFFFF" />
                      </LinearGradient>
                      <Text numberOfLines={2} style={styles.modeTitle}>{topic.name}</Text>
                      <Text numberOfLines={2} style={styles.modeSubtitle}>
                        {topic.description || 'Study this topic'}
                      </Text>
                    </LinearGradient>
                  </PressableScale>
                ))
              )}
            </View>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.primary },
  safe: { flex: 1 },

  // Header Container with proper spacing
  headerContainer: {
    paddingTop: S.xl,
    paddingBottom: S.lg,
    paddingHorizontal: S.xxxl,
  },

  // Sections
  sectionHeader: { marginBottom: S.xl },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    fontWeight: '800',
    color: theme.colors.text.primary,
    letterSpacing: -0.2,
    marginBottom: S.xs,
  },

  // Modes grid (2‑up) - MATCHING Quiz Hub exactly
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: S.xl },
  modeCard: {
    borderRadius: RADIUS,
    overflow: 'hidden',
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    // Fixed height for all cards - matching QuizHub
    height: 160,
  },
  modeInner: { 
    paddingVertical: S.xl, 
    paddingHorizontal: S.lg, 
    alignItems: 'flex-start', 
    gap: S.sm,
    height: '100%',
    justifyContent: 'space-between',
  },
  modeIconBg: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  modeTitle: {
    fontSize: 15,
    fontFamily: theme.fonts.heading,
    fontWeight: '700',
    color: theme.colors.text.primary,
    letterSpacing: -0.1,
    lineHeight: 20,
  },
  modeSubtitle: { fontSize: 12, fontFamily: theme.fonts.body, color: theme.colors.text.secondary },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: S.xxxl,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

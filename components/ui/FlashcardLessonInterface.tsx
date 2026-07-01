import React, { useState, useRef } from 'react';
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
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HapticService from '@/utils/hapticService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FlashcardContent {
  title: string;
  content: string;
  keyPoints: string[];
}

interface FlashcardSection {
  id: string;
  title: string;
  subtitle: string;
  content: FlashcardContent[];
  icon: string;
  gradient: string[];
}

interface FlashcardLessonInterfaceProps {
  topicName: string;
  subjectName: string;
  content: {
    sections: FlashcardSection[];
  };
  topicId: string;
  onBack: () => void;
  onComplete: () => void;
  overview?: string;
  estimatedTime?: number;
  xpReward?: number;
  difficulty?: string;
}

export default function FlashcardLessonInterface({
  topicName,
  subjectName,
  content,
  onBack,
  onComplete,
  overview,
  estimatedTime,
  xpReward,
  difficulty,
}: FlashcardLessonInterfaceProps) {
  const insets = useSafeAreaInsets();
  const [activeSection, setActiveSection] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const sections = content.sections || [];
  const currentSection = sections[activeSection];

  const handleNext = () => {
    if (activeSection < sections.length - 1) {
      setActiveSection(prev => prev + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      HapticService.light();
    } else {
      HapticService.success();
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 🌌 Modern Study Gradient */}
      <LinearGradient
        colors={['#0F172A', '#020617']}
        style={StyleSheet.absoluteFill}
      />

      {/* 🏛️ Compact Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerLabel}>{subjectName.toUpperCase()}</Text>
          <Text style={styles.headerTitle}>{topicName}</Text>
        </View>
        <View style={styles.progressContainer}>
           <Text style={styles.progressText}>{activeSection + 1}/{sections.length}</Text>
        </View>
      </View>

      <View style={styles.heroWrap}>
        <View style={styles.heroFrame}>
          <LinearGradient
            colors={['rgba(15, 23, 42, 0.95)', 'rgba(30, 41, 59, 0.94)', 'rgba(7, 89, 133, 0.92)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroGlowLeft} />
          <View style={styles.heroGlowRight} />
          <View style={styles.heroIconWrap}>
            <Ionicons name="image-outline" size={28} color="#E2E8F0" />
          </View>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroLabel}>Visual slot</Text>
            <Text style={styles.heroTitle}>{overview || 'Clean study view'}</Text>
            <Text style={styles.heroSub}>
              Add a cover image or diagram later. For now this keeps the page visually grounded.
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="time-outline" size={12} color="#A5B4FC" />
            <Text style={styles.metaText}>{estimatedTime || 15} min</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="trophy-outline" size={12} color="#FCD34D" />
            <Text style={styles.metaText}>{xpReward || 50} XP</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="layers-outline" size={12} color="#86EFAC" />
            <Text style={styles.metaText}>{difficulty || 'medium'}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      >
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={activeSection}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -20 }}
            transition={{ type: 'timing', duration: 400 }}
          >
            <View style={styles.sectionHeader}>
               <View style={styles.iconBox}>
                  <Text style={styles.sectionIcon}>{currentSection?.icon || '📚'}</Text>
               </View>
               <View>
                  <Text style={styles.sectionTitle}>{currentSection?.title}</Text>
                  <Text style={styles.sectionSubtitle}>{currentSection?.subtitle}</Text>
               </View>
            </View>

            {currentSection?.content.map((point, idx) => (
              <View key={idx} style={styles.pointCard}>
                 <Text style={styles.pointTitle}>{point.title}</Text>
                 <Text style={styles.pointBody}>{point.content}</Text>
                 
                 {point.keyPoints && point.keyPoints.length > 0 && (
                   <View style={styles.keyPointsList}>
                      {point.keyPoints.map((kp, kpIdx) => (
                        <View key={kpIdx} style={styles.kpItem}>
                           <View style={styles.kpDot} />
                           <Text style={styles.kpText}>{kp}</Text>
                        </View>
                      ))}
                   </View>
                 )}
              </View>
            ))}
          </MotiView>
        </AnimatePresence>
      </ScrollView>

      {/* 🚀 Sticky Bottom Action */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleNext}>
          <LinearGradient
            colors={['#00D4C7', '#009B91']}
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>
              {activeSection === sections.length - 1 ? 'FINISH REVISION' : 'NEXT SECTION'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#0F172A" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: { flex: 1 },
  headerLabel: { fontSize: 10, fontFamily: 'Poppins-SemiBold', color: '#00D4C7', letterSpacing: 1.5 },
  headerTitle: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#FFFFFF' },
  progressContainer: {
    backgroundColor: 'rgba(0, 212, 199, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: '#00D4C7' },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  heroWrap: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
  },
  heroFrame: {
    minHeight: 132,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
  },
  heroGlowLeft: {
    position: 'absolute',
    left: -16,
    top: -18,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(0, 212, 199, 0.16)',
  },
  heroGlowRight: {
    position: 'absolute',
    right: -10,
    bottom: -14,
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(129, 140, 248, 0.14)',
  },
  heroIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
    marginBottom: 10,
  },
  heroTextWrap: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  heroLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: 'rgba(226, 232, 240, 0.72)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    lineHeight: 23,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(226, 232, 240, 0.8)',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  metaChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  metaText: {
    color: '#E6EBFF',
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionIcon: { fontSize: 24 },
  sectionTitle: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#FFFFFF' },
  sectionSubtitle: { fontSize: 14, fontFamily: 'Inter-Medium', color: '#94A3B8' },
  pointCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  pointTitle: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#00D4C7', marginBottom: 10 },
  pointBody: { fontSize: 15, fontFamily: 'Inter-Medium', color: '#F1F5F9', lineHeight: 24, marginBottom: 14 },
  keyPointsList: { gap: 8 },
  kpItem: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  kpDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00D4C7' },
  kpText: { fontSize: 13, fontFamily: 'Inter-Medium', color: '#94A3B8', flex: 1 },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
  },
  actionBtn: { borderRadius: 16, overflow: 'hidden' },
  btnGradient: { paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  btnText: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#0F172A', letterSpacing: 0.4 },
});


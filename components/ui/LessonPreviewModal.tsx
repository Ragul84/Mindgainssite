import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MotiView, AnimatePresence } from 'moti';

import HapticService from '@/utils/hapticService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { V2026 } from '@/theme/v2026-tokens';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Language configuration
const AUDIO_LANGUAGES = {
  english: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  hindi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  tamil: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  kannada: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  malayalam: { name: 'Malayalam', nativeName: 'மலையாளம்', flag: '🇮🇳' }
};

interface LessonPreviewModalProps {
  visible: boolean;
  lesson: any;
  onClose: () => void;
  onStart: () => void;
  onPractice?: () => void;
}

export default function LessonPreviewModal({
  visible,
  lesson,
  onClose,
  onStart,
  onPractice,
}: LessonPreviewModalProps) {
  const [audioLanguage, setAudioLanguage] = useState('english');

  useEffect(() => {
    if (visible) {
      loadAudioLanguage();
    }
  }, [visible]);

  const loadAudioLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('audioLanguage');
      if (savedLanguage && AUDIO_LANGUAGES[savedLanguage as keyof typeof AUDIO_LANGUAGES]) {
        setAudioLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading audio language:', error);
    }
  };

  if (!lesson) return null;

  const getPreviewContent = () => {
    if (lesson.isAI && lesson.deepLesson?.blocks) {
      const blocks = lesson.deepLesson.blocks;
      const conceptTitles = blocks
        .filter((b: any) => b.type === 'concept_build')
        .slice(0, 4)
        .map((b: any) => b.title)
        .filter((t: string) => t && t.length > 0);

      if (conceptTitles.length > 0) return conceptTitles;
    }

    return [
      'Key concepts',
      'Guided practice',
      'Exam-focused notes',
      'Quick check'
    ];
  };

  const previewPoints = getPreviewContent();

  const handleStart = async () => {
    await HapticService.success();
    onStart();
  };

  const showLanguageSelector = () => {
    const languageOptions = Object.entries(AUDIO_LANGUAGES).map(([key, lang]) => ({
      text: `${lang.flag} ${lang.nativeName}`,
      onPress: () => {
        setAudioLanguage(key);
        AsyncStorage.setItem('audioLanguage', key);
        HapticService.light();
      },
    }));

    Alert.alert(
      'Voice language',
      'Choose narration language',
      [
        ...languageOptions.map(opt => ({ text: opt.text, onPress: opt.onPress })),
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const xpReward = lesson.xpReward || 50;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          activeOpacity={1} 
          onPress={onClose} 
        />
        
        <AnimatePresence>
          {visible && (
            <MotiView
              from={{ translateY: 100, opacity: 0, scale: 0.9 }}
              animate={{ translateY: 0, opacity: 1, scale: 1 }}
              exit={{ translateY: 100, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 150 }}
              style={styles.modalContent}
            >
              <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
              
              <View style={styles.header}>
                 <View style={styles.lessonTypeBadge}>
                    <Ionicons name="sparkles" size={14} color={V2026.colors.primary} />
                    <Text style={styles.lessonTypeText}>Lesson</Text>
                 </View>
                 <TouchableOpacity onPress={showLanguageSelector} style={styles.langBtn}>
                    <Text style={styles.langFlag}>{AUDIO_LANGUAGES[audioLanguage as keyof typeof AUDIO_LANGUAGES]?.flag}</Text>
                    <Ionicons name="chevron-down" size={12} color={V2026.colors.textMuted} />
                  </TouchableOpacity>
              </View>

              <Text style={styles.title}>{lesson.title}</Text>
              
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Inside</Text>
                {previewPoints.slice(0, 4).map((point, idx) => (
                  <View key={idx} style={styles.pointRow}>
                    <View style={styles.pointDot} />
                    <Text style={styles.pointText} numberOfLines={1}>{point}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.footer}>
                 <View style={styles.rewardInfo}>
                    <View style={styles.xpCircle}>
                       <Text style={styles.xpText}>{xpReward}</Text>
                    </View>
                    <Text style={styles.rewardLabel}>XP</Text>
                 </View>

                 <TouchableOpacity 
                    style={styles.startBtn} 
                    onPress={handleStart}
                    activeOpacity={0.8}
                 >
                    <LinearGradient
                       colors={[V2026.colors.primary, V2026.colors.secondary]}
                       start={{x:0, y:0}}
                       end={{x:1, y:0}}
                       style={styles.startBtnGrad}
                    >
                       <Text style={styles.startBtnText}>Start</Text>
                       <Ionicons name="arrow-forward" size={18} color="white" />
                    </LinearGradient>
                 </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                 <Ionicons name="close" size={24} color={V2026.colors.textMuted} />
              </TouchableOpacity>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 28,
  },
  modalContent: {
    width: '92%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    ...V2026.shadows.milky,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lessonTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  lessonTypeText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: V2026.colors.primary,
    letterSpacing: 0.5,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    ...V2026.shadows.milky,
  },
  langFlag: {
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: V2026.colors.text,
    lineHeight: 30,
    marginBottom: 14,
  },
  summaryBox: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: V2026.colors.textMuted,
    marginBottom: 10,
    letterSpacing: 1,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 7,
  },
  pointDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: V2026.colors.primary,
  },
  pointText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: V2026.colors.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  xpCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  xpText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#D97706',
  },
  rewardLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: V2026.colors.textMuted,
    width: 24,
  },
  startBtn: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    overflow: 'hidden',
    ...V2026.shadows.milky,
  },
  startBtnGrad: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  startBtnText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


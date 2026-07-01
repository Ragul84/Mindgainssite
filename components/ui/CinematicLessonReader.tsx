import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import HapticService from '@/utils/hapticService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Scene {
  id: string;
  type: string;
  background: string;
  narration: string;
  content: string;
  subContent?: string;
  interaction_config?: any;
}

interface CinematicLessonReaderProps {
  lessonId: string;
  topicId: string;
  lessonTitle: string;
  onComplete: () => void;
  isFirstTime: boolean;
  externalScenes: Scene[] | null;
  lessonType: 'cinematic' | 'deep' | 'interactive';
}

export default function CinematicLessonReader({
  lessonTitle,
  onComplete,
  externalScenes,
}: CinematicLessonReaderProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const scenes = externalScenes || [];
  const currentScene = scenes[currentSceneIndex];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [currentSceneIndex]);

  const handleNext = () => {
    if (currentSceneIndex < scenes.length - 1) {
      fadeAnim.setValue(0);
      setCurrentSceneIndex(prev => prev + 1);
      HapticService.light();
    } else {
      setIsFinished(true);
      HapticService.success();
      setTimeout(onComplete, 2000);
    }
  };

  if (!scenes.length) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No scenes found for this cinematic journey.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 🎬 Cinematic Background Layer */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#0F172A', '#020617', '#000000']}
          style={StyleSheet.absoluteFill}
        />
        {/* Dynamic Glow based on scene background type */}
        <MotiView
          from={{ opacity: 0.2, scale: 1 }}
          animate={{ opacity: 0.4, scale: 1.5 }}
          transition={{ type: 'timing', duration: 8000, loop: true }}
          style={[styles.ambientGlow, { backgroundColor: currentSceneIndex % 2 === 0 ? '#00D4C7' : '#8B5CF6' }]}
        />
      </View>

      {/* 🎞️ Content Layer */}
      <AnimatePresence exitBeforeEnter>
        <MotiView
          key={currentSceneIndex}
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -20 }}
          transition={{ type: 'timing', duration: 800 }}
          style={styles.sceneContainer}
        >
          <View style={styles.sceneHeader}>
            <Text style={styles.lessonTitle}>{lessonTitle}</Text>
            <View style={styles.sceneProgress}>
              <Text style={styles.progressText}>{currentSceneIndex + 1} / {scenes.length}</Text>
            </View>
          </View>

          <View style={styles.mainVisual}>
            <View style={styles.visualPlaceholder}>
              <Ionicons 
                name={currentSceneIndex % 2 === 0 ? "images" : "color-filter"} 
                size={80} 
                color="rgba(255,255,255,0.1)" 
              />
            </View>
            <BlurView intensity={30} tint="dark" style={styles.narrationBox}>
              <Text style={styles.narrationText}>{currentScene.narration}</Text>
            </BlurView>
          </View>

          <View style={styles.textOverlay}>
            <Text style={styles.contentTitle}>{currentScene.content}</Text>
            {currentScene.subContent && (
              <Text style={styles.subContentText}>{currentScene.subContent}</Text>
            )}
          </View>
        </MotiView>
      </AnimatePresence>

      {/* 🏔️ Sticky Control Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <LinearGradient
            colors={['#00D4C7', '#009B91']}
            style={styles.nextGradient}
          >
            <Text style={styles.nextLabel}>
              {currentSceneIndex === scenes.length - 1 ? 'COMPLETE JOURNEY' : 'CONTINUE NARRATIVE'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#0F172A" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* 🏆 Completion Overlay */}
      <AnimatePresence>
        {isFinished && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.finishOverlay}
          >
            <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
            <MotiView
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
              style={styles.finishCard}
            >
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark-done" size={50} color="#00D4C7" />
              </View>
              <Text style={styles.finishTitle}>Voyage Complete</Text>
              <Text style={styles.finishSubtitle}>The knowledge has been fully imprinted.</Text>
            </MotiView>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  ambientGlow: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    filter: 'blur(80px)',
  },
  sceneContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  sceneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  lessonTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#00D4C7',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sceneProgress: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    color: '#94A3B8',
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  mainVisual: {
    height: SCREEN_HEIGHT * 0.45,
    width: '100%',
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  visualPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  narrationBox: {
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  narrationText: {
    color: '#E2E8F0',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  textOverlay: {
    marginTop: 32,
    gap: 12,
  },
  contentTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    lineHeight: 36,
  },
  subContentText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  nextBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#00D4C7',
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  nextGradient: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  nextLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    letterSpacing: 1,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#94A3B8',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  finishOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  finishCard: {
    alignItems: 'center',
    gap: 20,
  },
  checkIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 212, 199, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 199, 0.3)',
  },
  finishTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  finishSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
  },
});


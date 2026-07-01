import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HapticService from '@/utils/hapticService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// MindGains Brand Theme Colors
const COLORS = {
  primaryBlue: '#00D4C7',
  secondaryBlue: '#00D4C7', 
  backgroundDark: '#0A0F1A',
  cardDark: '#101726',
  successMint: '#48C586',
  warmAccent: '#FFD76F',
  textPrimary: '#FFFFFF',
  textSecondary: '#8FA1B4',
  borders: '#2A3240',
};

interface LessonBubblePopupProps {
  visible: boolean;
  lesson: any;
  position: { x: number; y: number };
  onClose: () => void;
  onStart: (lesson: any) => void;
}

export default function LessonBubblePopup({
  visible,
  lesson,
  position,
  onClose,
  onStart,
}: LessonBubblePopupProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animation values
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      
      // Super fast entrance - no delay
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 400,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Lightning fast exit
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!lesson || !visible) return null;

  const handleStart = () => {
    HapticService.success();
    onStart(lesson);
  };

  const handleClose = () => {
    HapticService.light();
    onClose();
  };

  // Use the exact position passed from parent (already calculated)
  const bubbleX = position.x;
  const bubbleY = position.y;

  return (
    <TouchableOpacity
      style={styles.fullScreenOverlay}
      activeOpacity={1}
      onPress={handleClose}
    >
      <Animated.View
        style={[
          styles.stylishPopup,
          {
            left: Math.max(20, bubbleX - 120),
            top: bubbleY - 80,
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Main popup card */}
        <LinearGradient
          colors={['#1F2937', '#374151']}
          style={styles.popupCard}
        >
          {/* Glow effect */}
          <View style={styles.glowEffect} />
          
          {/* Title */}
          <Text style={styles.stylishTitle} numberOfLines={2}>
            {lesson.title || lesson.name || 'Lesson'}
          </Text>
          
          {/* XP Badge */}
          <LinearGradient
            colors={['#FBBF24', '#F59E0B']}
            style={styles.xpBadge}
          >
            <FontAwesome5 name="star" size={10} color="#FFFFFF" solid />
            <Text style={styles.xpBadgeText}>+{lesson.xp || lesson.xpReward || 35} XP</Text>
          </LinearGradient>

          {/* Start button with gradient */}
          <TouchableOpacity
            style={styles.stylishStartButton}
            onPress={handleStart}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.startButtonGradient}
            >
              <Text style={styles.stylishStartText}>Start Lesson</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
        
        {/* Pointing triangle */}
        <View style={styles.pointingTriangle} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999,
  },
  
  stylishPopup: {
    position: 'absolute',
    zIndex: 1000,
  },
  
  popupCard: {
    width: 220,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    position: 'relative',
    overflow: 'hidden',
  },
  
  glowEffect: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  
  stylishTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  xpBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  
  stylishStartButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  
  startButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  stylishStartText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  pointingTriangle: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
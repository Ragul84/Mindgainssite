// Google Gemini-inspired Minimal Voice Gradient - Clean & Professional
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GeminiVoiceGradientsProps {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  voiceLevel?: number;
}

export default function GeminiVoiceGradients({
  isListening,
  isProcessing,
  isSpeaking,
  voiceLevel = 0
}: GeminiVoiceGradientsProps) {
  const gradientOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isListening || isProcessing || isSpeaking) {
      // Subtle fade in
      Animated.timing(gradientOpacity, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: false,
      }).start();
    } else {
      // Fade out
      Animated.timing(gradientOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [isListening, isProcessing, isSpeaking]);

  return (
    <Animated.View 
      style={[
        styles.container,
        { opacity: gradientOpacity }
      ]} 
      pointerEvents="none"
    >
      <LinearGradient
        colors={[
          'transparent',
          isListening ? 'rgba(34, 211, 238, 0.1)' : 
          isProcessing ? 'rgba(168, 85, 247, 0.1)' : 
          isSpeaking ? 'rgba(34, 211, 238, 0.08)' : 
          'transparent',
          'transparent'
        ]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});
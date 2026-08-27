// Game Start Countdown - Clean & Powerful
// 3-2-1-GO! - No fancy stuff, just pure hype

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HeistSoundService } from '@/services/heistSoundService';

interface GameStartAnimationProps {
  onComplete: () => void;
  vaultName: string;
}

export default function GameStartAnimation({ onComplete, vaultName }: GameStartAnimationProps) {
  const [count, setCount] = useState(3);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const runCount = (num: number) => {
      setCount(num);
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);

      // Removed sitar sound here as requested
      
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }, 350);
    };

    // 3... 2... 1... (Snappier 500ms intervals)
    runCount(3);
    setTimeout(() => runCount(2), 500);
    setTimeout(() => runCount(1), 1000);
    
    // GO! - WITH AWESOME REVEAL
    setTimeout(() => {
      setCount(0);
      // Removed playGameStart sound
      scaleAnim.setValue(0);
      
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 2.5, // Much larger for impact
          tension: 110,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
      
      setTimeout(() => onComplete(), 600);
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
        style={StyleSheet.absoluteFill}
      />

      {/* Background Pulse / Flash during reveal */}
      {count === 0 && (
        <Animated.View 
          style={[
            StyleSheet.absoluteFill, 
            { 
              backgroundColor: '#0EA5E9',
              opacity: opacityAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.2]
              })
            }
          ]} 
        />
      )}

      {/* Vault name */}
      <View style={styles.vaultBadge}>
        <Text style={styles.vaultText}>{vaultName}</Text>
      </View>

      {/* Countdown */}
      <Animated.View
        style={[
          styles.countContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: count === 0 ? scaleAnim.interpolate({
              inputRange: [0, 2.5],
              outputRange: [1, 0]
            }) : opacityAnim,
          },
        ]}
      >
        {count > 0 ? (
          <Text style={styles.countText}>{count}</Text>
        ) : (
          <LinearGradient
            colors={['#0EA5E9', '#0284C7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.goGradient}
          >
            <Text style={styles.goText}>GO!</Text>
          </LinearGradient>
        )}
      </Animated.View>

      {/* Ready text */}
      <Text style={styles.readyText}>Get Ready! 🔥</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vaultBadge: {
    position: 'absolute',
    top: 100,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  vaultText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#0EA5E9',
    letterSpacing: 1,
  },
  countContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 120,
    fontFamily: 'Poppins-Black',
    color: '#0F172A',
  },
  goGradient: {
    paddingHorizontal: 60,
    paddingVertical: 24,
    borderRadius: 24,
  },
  goText: {
    fontSize: 80,
    fontFamily: 'Poppins-Black',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  readyText: {
    position: 'absolute',
    bottom: 120,
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
  },
});

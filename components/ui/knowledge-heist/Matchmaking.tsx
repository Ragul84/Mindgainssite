import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { HeistSoundService } from '@/services/heistSoundService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MatchmakingProps {
  onMatchFound: () => void;
  onExit: () => void;
  vaultName: string;
}

export default function Matchmaking({ onMatchFound, onExit, vaultName }: MatchmakingProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsing radar
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Spinning swords background
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const [dots, setDots] = useState('');

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(dotInterval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={[styles.ambientGlow, { transform: [{ scale: pulseAnim }] }]} />
      </View>

      {/* Top Banner */}
      <View style={styles.headerBanner}>
         <View style={styles.glassBadge}>
             <Text style={styles.headerTitle}>SEARCHING{dots}</Text>
         </View>
      </View>

      <View style={styles.mainContent}>
          {/* Radar / Matchmaking Circle */}
          <View style={styles.radarContainer}>
              <Animated.View style={[styles.radarGlow, { transform: [{ scale: pulseAnim }] }]} />
              
              <Animated.View style={[styles.spinContainer, { transform: [{ rotate: spin }] }]}>
                  <View style={styles.orbitCircle1} />
                  <View style={styles.orbitCircle2} />
              </Animated.View>

              <View style={styles.radarInner}>
                 <MaterialCommunityIcons name="radar" size={40} color="#00D4C7" />
                 <Text style={styles.vaultText}>{vaultName}</Text>
                 <Text style={styles.estimatedTimeText}>EST: 0:03</Text>
              </View>
          </View>

          {/* Quick Stats Panel */}
          <View style={styles.statsPanel}>
              <View style={styles.statBox}>
                 <MaterialCommunityIcons name="sword-cross" size={18} color="#0F172A" />
                 <Text style={styles.statLabel}>1 v 1</Text>
              </View>
              <View style={styles.statBox}>
                 <FontAwesome5 name="trophy" size={16} color="#0F172A" />
                 <Text style={styles.statLabel}>CLASH</Text>
              </View>
          </View>
      </View>

      {/* Cancel Button */}
      <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={() => {
              HeistSoundService.playButtonClick();
              onExit();
            }}
          >
            <Text style={styles.cancelBtnText}>CANCEL</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  ambientGlow: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.2,
    left: -SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH * 1.4,
    height: SCREEN_WIDTH * 1.4,
    backgroundColor: '#00D4C7',
    borderRadius: SCREEN_WIDTH,
    opacity: 0.1,
  },
  headerBanner: {
    alignItems: 'center',
    marginTop: 80,
  },
  glassBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 32,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    fontSize: 14,
    letterSpacing: 2,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarContainer: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  radarGlow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(0, 212, 199, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 199, 0.3)',
  },
  spinContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitCircle1: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B5CF6',
  },
  orbitCircle2: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0EA5E9',
  },
  radarInner: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  vaultText: {
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  estimatedTimeText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 1,
  },
  statsPanel: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  statLabel: {
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    fontSize: 14,
  },
  bottomBar: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 60,
  },
  cancelBtnText: {
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
    fontSize: 14,
    letterSpacing: 1.5,
  },
});


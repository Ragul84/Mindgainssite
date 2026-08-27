import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { HeistSoundService } from '@/services/heistSoundService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TeamReadyProps {
  onStart: () => void;
  onExit: () => void;
  vaultName: string;
}

const MOCK_PLAYERS = [
  { name: 'Arjun_K', level: 12, state: 'Tamil Nadu', avatar: '🎯', rank: 'MASTER' },
  { name: 'Priya_M', level: 15, state: 'Delhi', avatar: '⚡', rank: 'ELITE' },
  { name: 'Rahul_S', level: 10, state: 'Maharashtra', avatar: '🔥', rank: 'PRO' },
  { name: 'You', level: 8, state: 'Karnataka', avatar: '👤', isCurrentUser: true, rank: 'PLAYER' },
];

// Countdown Timer Component with Sound
const CountdownTimer = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(3);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          HeistSoundService.playGameStart(); // Game start sound
          setTimeout(onComplete, 500); // Small delay after "GO!"
          return 0;
        }
        HeistSoundService.playCountdown(); // Countdown tick sound
        
        // Animate number scale
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.5, duration: 200, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true })
        ]).start();
        
        return prev - 1;
      });
    }, 1000);

    // Pulse animation for urgency
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true })
      ])
    ).start();

    return () => clearInterval(timer);
  }, []);

  return (
    <Animated.View style={[styles.countdownContainer, { transform: [{ scale: pulseAnim }] }]}>
      {count > 0 ? (
        <Animated.Text style={[styles.countdownText, { transform: [{ scale: scaleAnim }] }]}>
          {count}
        </Animated.Text>
      ) : (
        <Animated.Text style={styles.goText}>
          VS
        </Animated.Text>
      )}
    </Animated.View>
  );
};

export default function TeamReady({ onStart, onExit, vaultName }: TeamReadyProps) {
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const playerAnims = useRef(MOCK_PLAYERS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // 1. Fade in container
    Animated.timing(containerOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // 2. Faster reveal of all players
    const animations = playerAnims.map((anim, index) => {
      return Animated.spring(anim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
        delay: index * 150, // Much faster staggered reveal
      });
    });

    Animated.parallel(animations).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.gridOverlay} />
      </View>

      <Animated.View style={[styles.content, { opacity: containerOpacity }]}>
        
        {/* Header Ribbon */}
        <View style={styles.headerRibbonContainer}>
           <View style={styles.glassBanner}>
               <Text style={styles.headerTitle}>MATCH FOUND!</Text>
           </View>
        </View>

        <CountdownTimer onComplete={onStart} />

        {/* Squad Grid - Clash Royale Style List */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
              <Text style={styles.listTitle}>{vaultName.toUpperCase()} SQUAD</Text>
          </View>

          <View style={styles.listBody}>
              {MOCK_PLAYERS.map((player, index) => (
                <Animated.View 
                  key={index} 
                  style={[
                    styles.playerSlot,
                    {
                      opacity: playerAnims[index],
                      transform: [{ 
                        translateY: playerAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [10, 0]
                        })
                      }]
                    }
                  ]}
                >
                  <View style={[styles.playerCard, player.isCurrentUser && styles.currentUserCard]}>
                    <View style={styles.avatarBox}>
                       <Text style={styles.avatar}>{player.avatar}</Text>
                    </View>
                    
                    <View style={styles.playerInfo}>
                      <Text style={[styles.playerName, player.isCurrentUser && {color: '#0EA5E9'}]} numberOfLines={1}>{player.name}</Text>
                      <Text style={[styles.playerRank, player.isCurrentUser && {color: '#64748B'}]}>{player.rank}</Text>
                    </View>

                    {player.isCurrentUser && (
                      <View style={styles.selfLabel}>
                        <Text style={styles.selfLabelText}>YOU</Text>
                      </View>
                    )}
                  </View>
                </Animated.View>
              ))}
          </View>
        </View>

        {/* Equipment Ready Section */}
        <View style={styles.boosterSection}>
          <Text style={styles.boosterTitle}>BOOSTERS EQUIPPED</Text>
          <View style={styles.boosterRow}>
            <BoosterIcon icon="brain" />
            <BoosterIcon icon="snowflake" />
            <BoosterIcon icon="bolt" />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

function BoosterIcon({ icon }: any) {
  return (
    <View style={styles.boosterCircle}>
       <View style={styles.boosterInner}>
          <FontAwesome5 name={icon} size={14} color="#0EA5E9" />
       </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRibbonContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  glassBanner: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#00D4C7',
    letterSpacing: 2,
  },
  countdownContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  countdownText: {
    fontSize: 40,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  goText: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#EF4444',
  },
  listContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 40,
    overflow: 'hidden',
  },
  listHeader: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: '#FFFFFF',
  },
  listTitle: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 2,
  },
  listBody: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  playerSlot: {
    width: '100%',
    marginBottom: 12,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  currentUserCard: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatar: {
    fontSize: 20,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playerName: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  playerRank: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#94A3B8',
    marginTop: 2,
  },
  selfLabel: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  selfLabelText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  boosterSection: {
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  boosterTitle: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
    letterSpacing: 2,
  },
  boosterRow: {
    flexDirection: 'row',
    gap: 20,
  },
  boosterCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  boosterInner: {
     width: 36,
     height: 36,
     borderRadius: 18,
     backgroundColor: '#FFFFFF',
     justifyContent: 'center',
     alignItems: 'center',
     borderWidth: 1.5,
     borderColor: 'rgba(0,0,0,0.02)',
  }
});


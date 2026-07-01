import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HapticService from '../../utils/hapticService';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function JoinQuizScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  
  // Mock Data (In a real app, fetch from Supabase using 'id')
  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
    // Simulate fetching quiz data
    const timer = setTimeout(() => {
      setQuizData({
        id: id || 'viral-123',
        title: 'Modern Indian History War',
        creator: 'Khan Sir Academy',
        prizePool: '1,500',
        participants: 842,
        examName: 'UPSC 2024',
        questionCount: 20,
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleJoin = () => {
    HapticService.notification('success');
    router.replace({
      pathname: '/quiz/reader',
      params: { 
        topicId: quizData.id, 
        topicName: quizData.title,
        isViral: 'true'
      }
    });
  };

  const meshAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(meshAnim, { toValue: 1, duration: 6000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(meshAnim, { toValue: 0, duration: 6000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const orbTranslateY = meshAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 50]
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00D4C7" />
        <MotiText 
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ loop: true, duration: 1000 }}
          style={styles.loadingText}
        >
          Validating Invitation...
        </MotiText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ðŸŒŒ Atmospheric Backdrop */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
        <Animated.View 
          style={[
            styles.meshOrb, 
            { transform: [{ translateY: orbTranslateY }, { scale: 1.4 }] }
          ]} 
        />
      </View>

      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <MotiView
          from={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' }}
          style={styles.creatorBadge}
        >
          <Text style={styles.invitedBy}>INVITED BY</Text>
          <View style={styles.creatorRow}>
            <View style={styles.creatorAvatar}>
              <Ionicons name="person" size={20} color="#0EA5E9" />
            </View>
            <Text style={styles.creatorName}>{quizData.creator}</Text>
          </View>
        </MotiView>

        <MotiText
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ delay: 200 }}
          style={styles.quizTitle}
        >
          {quizData.title}
        </MotiText>

        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ delay: 300 }}
          style={styles.statsContainer}
        >
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{quizData.questionCount}</Text>
            <Text style={styles.statLab}>Questions</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{quizData.participants}</Text>
            <Text style={styles.statLab}>Joined</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: '#FBBF24' }]}>{quizData.examName}</Text>
            <Text style={styles.statLab}>Target</Text>
          </View>
        </MotiView>

        <MotiView
          from={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 500 }}
          style={styles.prizeCard}
        >
          <LinearGradient
            colors={['#0F172A', '#1E293B']}
            style={styles.prizeBg}
          >
            <FontAwesome5 name="trophy" size={40} color="#FBBF24" />
            <Text style={styles.prizeLabel}>Total Prize Pool</Text>
            <View style={styles.prizeValueRow}>
              <FontAwesome5 name="coins" size={24} color="#FBBF24" />
              <Text style={styles.prizeValue}>{quizData.prizePool} Coins</Text>
            </View>
            <Text style={styles.prizeDesc}>Top 3 participants will share the rewards!</Text>
          </LinearGradient>
        </MotiView>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 40 }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleJoin}
          style={styles.joinBtn}
        >
          <LinearGradient
            colors={['#00D4C7', '#0EA5E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.joinBtnGradient}
          >
            <Text style={styles.joinBtnText}>Join Challenge</Text>
            <Ionicons name="flash" size={20} color="#FFFFFF" style={{ marginLeft: 10 }} />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => router.replace('/quiz-hub')}
          style={styles.skipBtn}
        >
          <Text style={styles.skipText}>Not now, take me to Hub</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
  },
  meshOrb: {
    position: 'absolute',
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_WIDTH * 1.5,
    borderRadius: SCREEN_WIDTH,
    backgroundColor: 'rgba(0, 212, 199, 0.05)',
    top: -SCREEN_WIDTH * 0.5,
    left: -SCREEN_WIDTH * 0.25,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  creatorBadge: {
    alignItems: 'center',
    marginBottom: 24,
  },
  invitedBy: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#94A3B8',
    letterSpacing: 2,
    marginBottom: 8,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
  },
  creatorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  creatorName: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  quizTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginBottom: 40,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#0EA5E9',
  },
  statLab: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(15, 23, 42, 0.05)',
    marginHorizontal: 10,
  },
  prizeCard: {
    width: '100%',
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  prizeBg: {
    padding: 32,
    alignItems: 'center',
  },
  prizeLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 16,
  },
  prizeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  prizeValue: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  prizeDesc: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 32,
  },
  joinBtn: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  joinBtnGradient: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinBtnText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  skipBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
});

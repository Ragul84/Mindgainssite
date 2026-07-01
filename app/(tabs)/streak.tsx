import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated as RNAnimated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from '@/utils/reanimated';
import { useM3Theme } from '@/theme/M3ThemeProvider';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useUserStats } from '@/hooks/useUserStats';
import { useAuthContext } from '@/components/AuthProvider';
import { getUserProtocol } from '@/utils/protocolService';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function StreakScreen() {
  const insets = useSafeAreaInsets();
  const theme = useM3Theme();
  const router = useRouter();
  const { user } = useAuthContext();

  const { currentStreak: dbStreak, loading: statsLoading } = useUserStats();
  const streakDays = dbStreak || 0;
  
  const countAnim = React.useRef(new RNAnimated.Value(0)).current;
  const [displayStreak, setDisplayStreak] = React.useState(0);
  
  const [isTodayComplete, setIsTodayComplete] = useState(false);
  const [checkingProtocol, setCheckingProtocol] = useState(true);

  useEffect(() => {
    async function checkTodayStatus() {
      if (!user?.id) return;
      try {
        const protocol = await getUserProtocol(user.id);
        if (protocol) {
          setIsTodayComplete((protocol.progress_phase ?? 0) >= 5);
        }
      } catch (err) {
        console.error('Failed to load protocol for streak banner:', err);
      } finally {
        setCheckingProtocol(false);
      }
    }
    checkTodayStatus();
  }, [user?.id]);

  React.useEffect(() => {
    if (!statsLoading) {
      RNAnimated.timing(countAnim, {
        toValue: streakDays,
        duration: 1500,
        useNativeDriver: false,
      }).start();

      const listener = countAnim.addListener(({ value }) => {
        setDisplayStreak(Math.floor(value));
      });
      return () => countAnim.removeListener(listener);
    }
  }, [streakDays, statsLoading]);

  const renderDayNode = (day: number, active: boolean, future: boolean) => (
    <View key={day} style={styles.dayNodeContainer}>
      <View style={[
        styles.dayNode,
        active && styles.dayNodeActive,
        future && styles.dayNodeFuture
      ]}>
        <FontAwesome5 
          name={active ? 'fire' : (future ? 'lock' : 'check')} 
          size={16} 
          color={active ? '#F97316' : (future ? '#CBD5E1' : '#10B981')} 
          solid 
        />
      </View>
      <Text style={styles.dayText}>Day {day}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 100 }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={1} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Streak</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {!checkingProtocol && (
          <Animated.View entering={FadeInDown.delay(50).springify()} style={isTodayComplete ? styles.protectedBanner : styles.dangerBanner}>
            <View style={isTodayComplete ? styles.bannerIconSafe : styles.bannerIconDanger}>
              <Ionicons name={isTodayComplete ? 'checkmark' : 'time-outline'} size={18} color={isTodayComplete ? '#059669' : '#E11D48'} />
            </View>
            <View style={styles.bannerCopy}>
              <Text style={isTodayComplete ? styles.protectedTitle : styles.dangerTitle}>
                {isTodayComplete ? 'Streak saved today' : 'Save before midnight'}
              </Text>
              <Text style={isTodayComplete ? styles.protectedDesc : styles.dangerDesc}>
                {isTodayComplete ? 'Today is complete.' : 'Finish today\'s mission to keep your streak alive!'}
              </Text>
            </View>
            {!isTodayComplete && (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.bannerCta}
                onPress={() => router.push('/daily-mission')}
              >
                <Text style={styles.bannerCtaText}>Start</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}

        {/* Streak Main Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.mainCard}>
          <LinearGradient
            colors={['#FFF1F2', '#FFE4E6']}
            style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
          />
          <View style={styles.fireRing}>
            <LottieView
              source={require('@/assets/lotties/daystreak.json')}
              autoPlay
              loop
              style={{ width: 120, height: 120 }}
            />
          </View>
          <Text style={styles.streakCount}>{displayStreak}</Text>
          <Text style={styles.streakLabel}>Days Long!</Text>
          <Text style={styles.streakSub}>You're on a roll. Keep up the daily learning routine!</Text>
        </Animated.View>

        {/* Milestone Tracker */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.milestoneSection}>
           <Text style={styles.sectionTitle}>Your Progress</Text>
           <View style={styles.timeline}>
             <View style={styles.timelineLine} />
              <View style={styles.timelineNodesRow}>
                {[1, 7, 14, 30].map(milestone => (
                  renderDayNode(milestone, streakDays >= milestone, streakDays < milestone)
                ))}
              </View>
           </View>
        </Animated.View>

        {/* Weekly Goals */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.goalsCard}>
           <View style={styles.cardHeader}>
             <Text style={styles.cardTitle}>This Week's Record</Text>
           </View>
           <View style={styles.weekGrid}>
             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
               <View key={day} style={styles.weekDayCol}>
                 <Text style={styles.weekDayLabel}>{day}</Text>
                 <View style={[styles.weekDayCircle, idx < 4 && styles.weekDayCompleted, idx === 4 && styles.weekDayCurrent]}>
                    <FontAwesome5 name={idx < 4 ? 'check' : (idx === 4 ? 'fire' : 'circle')} size={12} color={idx < 4 ? '#FFF' : (idx === 4 ? '#FFF' : '#CBD5E1')} solid />
                 </View>
               </View>
             ))}
           </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Milky white premium background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  placeholder: {
    width: 44,
  },
  scrollContent: {
    padding: 24,
    gap: 18,
  },
  mainCard: {
    width: '100%',
    padding: 30,
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.1)',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  fireRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  streakCount: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    color: '#E11D48',
  },
  streakLabel: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#4C1D95',
    marginBottom: 12,
  },
  streakSub: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  milestoneSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
    marginBottom: 20,
  },
  timeline: {
    position: 'relative',
    height: 60,
    justifyContent: 'center',
  },
  timelineLine: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    zIndex: 1,
  },
  timelineNodesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  dayNodeContainer: {
    alignItems: 'center',
  },
  dayNode: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  dayNodeActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  dayNodeFuture: {
    backgroundColor: '#F8FAFC',
    borderColor: '#F1F5F9',
  },
  dayText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  goalsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDayCol: {
    alignItems: 'center',
    gap: 8,
  },
  weekDayLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
  },
  weekDayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekDayCompleted: {
    backgroundColor: '#10B981',
  },
  weekDayCurrent: {
    backgroundColor: '#F43F5E',
  },
  protectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dangerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF7F7',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bannerIconSafe: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
  },
  bannerIconDanger: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE4E6',
  },
  bannerCopy: {
    flex: 1,
    minWidth: 0,
  },
  bannerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  protectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  dangerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  protectedBadgeText: {
    color: '#10B981',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.8,
  },
  dangerBadgeText: {
    color: '#F43F5E',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.8,
  },
  freezeWarn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  freezeWarnText: {
    color: '#D97706',
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
  },
  protectedTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#065F46',
  },
  dangerTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#991B1B',
  },
  protectedDesc: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#047857',
    lineHeight: 15,
  },
  dangerDesc: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#B91C1C',
    lineHeight: 15,
  },
  bannerCta: {
    backgroundColor: '#E11D48',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  bannerCtaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
});

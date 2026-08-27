import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence, MotiText } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HapticService from '../../utils/hapticService';
import ShareService from '../../utils/shareService';
import { QuizViralService } from '../../utils/quizViralService';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STEPS = [
  { id: 'topic', title: 'The Topic', icon: 'auto-fix' },
  { id: 'prizes', title: 'Rewards', icon: 'trophy' },
  { id: 'confirm', title: 'Launch', icon: 'rocket' },
];

export default function CreateQuizScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Animation Values
  const spinValue = useRef(new Animated.Value(0)).current;
  const meshAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(meshAnim, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(meshAnim, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const orb1TranslateX = meshAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 30]
  });

  // Form State
  const [title, setTitle] = useState('');
  const [examName, setExamName] = useState('');
  const [className, setClassName] = useState('');
  const [prizePool, setPrizePool] = useState('100');
  const [winnerCount, setWinnerCount] = useState(3);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      HapticService.medium();
      setCurrentStep(currentStep + 1);
    } else {
      handlePublish();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      HapticService.selection();
      setCurrentStep(currentStep - 1);
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/quiz-hub');
      }
    }
  };

  const handlePublish = async () => {
    try {
      HapticService.selection();
      const quiz = await QuizViralService.createViralQuiz({
        title,
        prizePool: parseInt(prizePool),
        winnerCount: parseInt(winnerCount),
        questions: [] // Questions would be added here
      });
      
      HapticService.notification('success');
      await ShareService.shareQuiz(quiz.id, title, prizePool);
      router.replace('/quiz-hub');
    } catch (error: any) {
      alert(error.message || 'Failed to publish quiz. Check your balance!');
    }
  };

  return (
    <View style={styles.container}>
      {/* ðŸŒŒ Atmospheric Backdrop */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
        <Animated.View 
          style={[
            styles.meshOrb1, 
            { transform: [{ translateX: orb1TranslateX }, { scale: 1.5 }] }
          ]} 
        />
      </View>

      {/* ðŸ” Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={prevStep} style={styles.backBtn} activeOpacity={0.8}>
          <BlurView intensity={20} style={styles.backBtnBlur}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </BlurView>
        </TouchableOpacity>
        <MotiText 
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.headerTitle}
        >
          Creator Studio
        </MotiText>
        <View style={{ width: 44 }} />
      </View>

      {/* ðŸ Progress Bar (Premium Design) */}
      <View style={styles.progressWrapper}>
        <View style={styles.progressBarBase}>
          <MotiView
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ type: 'spring', damping: 20 }}
            style={styles.progressBarFill}
          >
            <LinearGradient
              colors={['#00D4C7', '#0EA5E9']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
          </MotiView>
        </View>
        <View style={styles.stepsContainer}>
          {STEPS.map((step, idx) => (
            <View key={step.id} style={styles.stepItem}>
              <MotiView 
                animate={{ 
                  scale: currentStep === idx ? 1.2 : 1,
                  opacity: currentStep >= idx ? 1 : 0.5
                }}
                style={[
                  styles.stepIconCircle,
                  currentStep >= idx ? styles.stepIconActive : styles.stepIconInactive
                ]}
              >
                <MaterialCommunityIcons 
                  name={step.icon as any} 
                  size={14} 
                  color={currentStep >= idx ? '#FFFFFF' : '#94A3B8'} 
                />
              </MotiView>
              <Text style={[
                styles.stepLabel,
                currentStep >= idx ? styles.stepLabelActive : styles.stepLabelInactive
              ]}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AnimatePresence exitBeforeEnter>
            {currentStep === 0 && (
              <MotiView
                key="step-topic"
                from={{ opacity: 0, translateX: 50 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: -50 }}
                style={styles.stepContent}
              >
                <View style={styles.stepHeaderRow}>
                  <View style={styles.dotIndicator} />
                  <Text style={styles.sectionTitle}>What's the topic?</Text>
                </View>
                <Text style={styles.sectionDesc}>AI will auto-generate questions for your community.</Text>

                <View style={styles.proInputWrapper}>
                  <Text style={styles.inputLabel}>Quiz Topic *</Text>
                  <TextInput
                    style={styles.proInput}
                    placeholder="e.g. Modern Physics Masterclass"
                    placeholderTextColor="#94A3B8"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.proInputWrapper, { flex: 1.5, marginRight: 12 }]}>
                    <Text style={styles.inputLabel}>Exam Target</Text>
                    <TextInput
                      style={styles.proInput}
                      placeholder="e.g. JEE Main"
                      placeholderTextColor="#94A3B8"
                      value={examName}
                      onChangeText={setExamName}
                    />
                  </View>
                  <View style={[styles.proInputWrapper, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Class</Text>
                    <TextInput
                      style={styles.proInput}
                      placeholder="e.g. 12th"
                      placeholderTextColor="#94A3B8"
                      value={className}
                      onChangeText={setClassName}
                    />
                  </View>
                </View>
              </MotiView>
            )}

            {currentStep === 1 && (
              <MotiView
                key="step-prizes"
                from={{ opacity: 0, translateX: 50 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: -50 }}
                style={styles.stepContent}
              >
                <View style={styles.stepHeaderRow}>
                  <View style={[styles.dotIndicator, { backgroundColor: '#FBBF24' }]} />
                  <Text style={styles.sectionTitle}>Reward Mastery</Text>
                </View>
                <Text style={styles.sectionDesc}>Quizzes with prizes go wildfire 10x faster!</Text>

                <MotiView 
                  animate={{ translateY: [0, -5, 0] }}
                  transition={{ loop: true, duration: 3000 }}
                  style={styles.proPrizeCard}
                >
                  <Animated.View style={[styles.proCardGlowBorder, { transform: [{ rotate: spin }] }]}>
                    <LinearGradient
                      colors={['#FBBF24', 'transparent', '#D97706', 'transparent', '#FBBF24']}
                      style={StyleSheet.absoluteFill}
                    />
                  </Animated.View>
                  
                  <View style={styles.proPrizeInner}>
                    <View style={styles.prizeIconCircle}>
                      <FontAwesome5 name="coins" size={24} color="#FBBF24" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                      <Text style={styles.proPrizeLabel}>Total Prize Pool</Text>
                      <TextInput
                        style={styles.proPrizeInput}
                        keyboardType="numeric"
                        value={prizePool}
                        onChangeText={setPrizePool}
                        placeholder="0"
                        placeholderTextColor="rgba(15, 23, 42, 0.2)"
                      />
                    </View>
                  </View>
                </MotiView>

                <Text style={styles.inputLabel}>Winner Distribution</Text>
                <View style={styles.proWinnerOptions}>
                  {[3, 5, 10].map((num) => (
                    <TouchableOpacity
                      key={num}
                      onPress={() => {
                        HapticService.selection();
                        setWinnerCount(num);
                      }}
                      style={[
                        styles.proWinnerBtn,
                        winnerCount === num && styles.proWinnerBtnActive
                      ]}
                    >
                      <Text style={[
                        styles.proWinnerBtnText,
                        winnerCount === num && styles.proWinnerBtnTextActive
                      ]}>
                        Top {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </MotiView>
            )}

            {currentStep === 2 && (
              <MotiView
                key="step-confirm"
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                style={styles.stepContent}
              >
                <View style={styles.launchCard}>
                  <LinearGradient
                    colors={['#0F172A', '#1E293B']}
                    style={styles.launchCardBg}
                  >
                    <MotiView
                      from={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 200 }}
                      style={styles.launchIconWrap}
                    >
                      <Ionicons name="rocket" size={40} color="#00D4C7" />
                    </MotiView>
                    <Text style={styles.launchTitle}>Ready to Go Wildfire!</Text>
                    <Text style={styles.launchDesc}>
                      Your community challenge is optimized and ready for deployment.
                    </Text>

                    <View style={styles.proSummary}>
                      <View style={styles.summaryItem}>
                        <Ionicons name="book" size={16} color="#64748B" />
                        <Text style={styles.summaryText}>{title || 'Untitled Quiz'}</Text>
                      </View>
                      <View style={styles.summaryItem}>
                        <FontAwesome5 name="coins" size={14} color="#FBBF24" />
                        <Text style={styles.summaryText}>{prizePool} Coins Pool</Text>
                      </View>
                      <View style={styles.summaryItem}>
                        <Ionicons name="people" size={16} color="#0EA5E9" />
                        <Text style={styles.summaryText}>Top {winnerCount} Winners</Text>
                      </View>
                    </View>

                    <TouchableOpacity 
                      style={styles.shareNowBtn}
                      onPress={() => ShareService.shareQuiz('preview-id', title, prizePool)}
                    >
                      <Ionicons name="share-social" size={18} color="#FFFFFF" />
                      <Text style={styles.shareNowText}>Share Now</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </MotiView>
            )}
          </AnimatePresence>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ðŸš€ Pro Footer Action */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={nextStep}
          disabled={currentStep === 0 && !title}
          style={[styles.mainProBtn, currentStep === 0 && !title && { opacity: 0.5 }]}
        >
          <LinearGradient
            colors={['#00D4C7', '#0EA5E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.mainProGradient}
          >
            <Text style={styles.mainProBtnText}>
              {currentStep === STEPS.length - 1 ? 'Launch Community Quiz' : 'Continue'}
            </Text>
            <Ionicons 
              name={currentStep === STEPS.length - 1 ? 'flash' : 'chevron-forward'} 
              size={18} 
              color="#FFFFFF" 
              style={{ marginLeft: 8 }} 
            />
          </LinearGradient>
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
  meshOrb1: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    borderRadius: SCREEN_WIDTH / 2,
    backgroundColor: 'rgba(0, 212, 199, 0.05)',
    top: -100,
    right: -100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    zIndex: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
  },
  backBtnBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  progressWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 25,
  },
  progressBarBase: {
    height: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.05)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  stepIconActive: {
    backgroundColor: '#0EA5E9',
  },
  stepIconInactive: {
    backgroundColor: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  stepLabelActive: {
    color: '#0EA5E9',
  },
  stepLabelInactive: {
    color: '#94A3B8',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  stepContent: {
    flex: 1,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dotIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00D4C7',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  sectionDesc: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 30,
  },
  proInputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  proInput: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
  },
  proPrizeCard: {
    width: '100%',
    borderRadius: 28,
    padding: 1.5,
    overflow: 'hidden',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    marginBottom: 30,
  },
  proCardGlowBorder: {
    position: 'absolute',
    width: '300%',
    height: '300%',
    top: '-100%',
    left: '-100%',
  },
  proPrizeInner: {
    borderRadius: 26,
    padding: 24,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  prizeIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  proPrizeLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  proPrizeInput: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    marginTop: -2,
  },
  proWinnerOptions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  proWinnerBtn: {
    flex: 1,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
  },
  proWinnerBtnActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0EA5E9',
  },
  proWinnerBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
  },
  proWinnerBtnTextActive: {
    color: '#0EA5E9',
  },
  launchCard: {
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  launchCardBg: {
    padding: 32,
    alignItems: 'center',
  },
  launchIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  launchTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  launchDesc: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  proSummary: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  mainProBtn: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  mainProGradient: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainProBtnText: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  shareNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 199, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 199, 0.3)',
  },
  shareNowText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#00D4C7',
    marginLeft: 8,
  },
});

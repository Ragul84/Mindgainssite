import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  Easing,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { supabase } from '../../utils/supabaseService';
import { SupabaseService } from '../../utils/supabaseService';
import HapticService from '../../utils/hapticService';
import { MissionQuizQuestion } from '../../utils/protocolService';
import { useAuthContext } from '@/components/AuthProvider';
import LottieView from 'lottie-react-native';
import { XPService } from '@/utils/xpService';
import { safeAwardUserXP } from '@/utils/constraintSafeService';
import UnifiedLoader from '@/components/ui/UnifiedLoader';
import RedisService from '@/utils/redisService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TIMER_SECONDS = 10;
const XP_PER_CORRECT = 10;

type QuizQuestion = MissionQuizQuestion & {
  id?: string;
  difficulty?: string;
};

type QuizResultEntry = {
  question: string;
  is_correct: boolean;
  selected_index: number;
  correct_index: number;
  difficulty?: string;
  timed_out?: boolean;
};

// 🌌 V2026 Sexy Dark Background Orbs Component
const QuizBackgroundOrbs = () => {
  const meshAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(meshAnim, { toValue: 1, duration: 8000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(meshAnim, { toValue: 0, duration: 8000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const orb1TranslateX = meshAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 60]
  });

  const orb2TranslateY = meshAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, -40]
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View 
        style={[
          styles.ambientOrb1, 
          { transform: [{ translateX: orb1TranslateX }] }
        ]} 
      />
      <Animated.View 
        style={[
          styles.ambientOrb2, 
          { transform: [{ translateY: orb2TranslateY }] }
        ]} 
      />
    </View>
  );
};

export default function QuizPlayerScreen() {
  const { track, day, mode, topicId, subjectId, topicName, subjectName, questionCount, redisKey, difficulty } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const normalizedTopicName = typeof topicName === 'string' ? topicName : '';
  const normalizedSubjectName = typeof subjectName === 'string' ? subjectName : '';
  
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [complete, setComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [resultEntries, setResultEntries] = useState<QuizResultEntry[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnim = useRef(new Animated.Value(1)).current;
  const quizStartedAtRef = useRef(Date.now());

  useEffect(() => {
    loadQuestions();
  }, [track, day, mode, topicId, subjectId, redisKey]);

  const normalizeQuestions = (items: any[]): QuizQuestion[] => {
    return (items || [])
      .filter((item) => Array.isArray(item.options) && item.options.length >= 2)
      .map((item) => ({
        id: item.id,
        question: item.question_text || item.question,
        options: item.options,
        answer_index: item.correct_answer !== undefined ? item.correct_answer : item.answer_index,
        explanation: item.explanation || 'Perfectly explained in your study materials!',
        difficulty: item.difficulty,
      }))
      .filter((item) => typeof item.answer_index === 'number');
  };

  const shuffleAndLimitQuestions = (items: QuizQuestion[], limit: number) => {
    return [...items].sort(() => 0.5 - Math.random()).slice(0, limit);
  };

  useEffect(() => {
    // Timer logic
    if (!loading && !complete && !showResult && questions.length > 0) {
      startTimer();
    }
    return () => stopTimer();
  }, [loading, complete, showResult, currentIndex, questions]);

  const startTimer = () => {
    stopTimer();
    setTimeLeft(TIMER_SECONDS);
    progressAnim.setValue(1);
    
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: TIMER_SECONDS * 1000,
      useNativeDriver: false,
    }).start();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    progressAnim.stopAnimation();
  };

  const handleTimeout = () => {
    HapticService.error();
    setShowResult(true);
    setSelectedOption(-1); // indicates timeout
    const currentQ = questions[currentIndex];
    if (currentQ) {
      setResultEntries((prev) => [
        ...prev,
        {
          question: currentQ.question,
          is_correct: false,
          selected_index: -1,
          correct_index: currentQ.answer_index,
          difficulty: currentQ.difficulty,
          timed_out: true,
        },
      ]);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setCurrentIndex(0);
      setSelectedOption(null);
      setShowResult(false);
      setComplete(false);
      setScore(0);
      setResultEntries([]);
      quizStartedAtRef.current = Date.now();
      const requestedCount = Number(questionCount || (mode === 'quick-sprint' ? 10 : 15)) || 10;

      // 0. Redis path — used by Quiz Hub (always preferred)
      if (redisKey) {
        const key = typeof redisKey === 'string' ? redisKey : redisKey[0];
        const diff = typeof difficulty === 'string' && difficulty ? difficulty : undefined;
        const qs = await RedisService.getQuestions(key, requestedCount, diff);
        setQuestions(qs as QuizQuestion[]);
        return;
      }

      // 1. Topic/Subject Database Fetch (legacy Supabase)
      if (topicId || subjectId) {
        if (topicId) {
          const subtopics = await SupabaseService.getSubtopicsByTopic(String(topicId));
          const subtopicIds = subtopics.map((subtopic: any) => subtopic.id).filter(Boolean);

          let topicQuestions: any[] = [];

          if (subtopicIds.length > 0) {
            const { data, error } = await supabase
              .from('questions')
              .select('question_text, question, options, correct_answer, answer_index, explanation')
              .in('subtopic_id', subtopicIds)
              .eq('is_active', true)
              .limit(Math.max(requestedCount * 2, 20));

            if (error) throw error;
            topicQuestions = data || [];
          }

          if (topicQuestions.length === 0 && subjectId) {
            const subjectQuestions = await SupabaseService.getQuestionsBySubject(String(subjectId), Math.max(requestedCount * 2, 20));
            setQuestions(shuffleAndLimitQuestions(normalizeQuestions(subjectQuestions), requestedCount));
          } else {
            setQuestions(shuffleAndLimitQuestions(normalizeQuestions(topicQuestions), requestedCount));
          }
        } else if (subjectId) {
          const subjectQuestions = await SupabaseService.getQuestionsBySubject(String(subjectId), Math.max(requestedCount * 2, 20));
          setQuestions(shuffleAndLimitQuestions(normalizeQuestions(subjectQuestions), requestedCount));
        }
      } 
      // 2. Quick Sprint (Legacy Vault Fetch)
      else if (mode === 'quick-sprint') {
        const { data } = await supabase.from('master_content_vault').select('content_json');
        let allQuestions: MissionQuizQuestion[] = [];
        if (data) {
          data.forEach(item => {
            const p = typeof item.content_json === 'string' ? JSON.parse(item.content_json) : item.content_json;
            if (p?.quiz?.questions?.length) {
              allQuestions = [...allQuestions, ...p.quiz.questions];
            } else if (p?.pyq_quiz?.length) {
              allQuestions = [...allQuestions, ...p.pyq_quiz];
            }
          });
        }
        setQuestions(shuffleAndLimitQuestions(allQuestions, requestedCount));
      } 
      // 3. Track/Topic (Vault Fetch)
      else if (track && (day || topicName)) {
        try {
          let query = supabase
            .from('master_content_vault')
            .select('content_json, topic_title')
            .eq('track_id', track);
          
          if (day) {
            query = query.eq('day_number', day);
          } else if (topicName) {
            query = query.eq('topic_title', topicName);
          }

          let { data, error } = await query.limit(1).maybeSingle();
          
          // Fuzzy matching fallback if exact topicName match fails
          if (!data && !day && topicName) {
            console.log(`🔍 [QuizReader] Exact match failed for "${topicName}", trying fuzzy...`);
            const { data: fuzzyData } = await supabase
              .from('master_content_vault')
              .select('content_json, topic_title')
              .eq('track_id', track)
              .ilike('topic_title', `%${topicName}%`)
              .limit(1)
              .maybeSingle();
            
            if (fuzzyData) {
              console.log(`✅ [QuizReader] Fuzzy match found: "${fuzzyData.topic_title}"`);
              data = fuzzyData;
            }
          }

          if (error) {
            console.error('Error fetching topic-vault:', error);
          }

          if (data) {
            const p = typeof data.content_json === 'string' ? JSON.parse(data.content_json) : data.content_json;
            if (p?.quiz?.questions) setQuestions(shuffleAndLimitQuestions(p.quiz.questions, requestedCount));
            else if (p?.pyq_quiz) setQuestions(shuffleAndLimitQuestions(p.pyq_quiz, requestedCount));
          } else {
            console.warn('No vault data found for:', { track, day, topicName });
          }
        } catch (err) {
          console.error('Vault fetch exception:', err);
        }
      }
    } catch (e) {
      console.warn('Error loading quiz', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionPress = (idx: number) => {
    if (showResult) return;
    stopTimer();
    setSelectedOption(idx);
    setShowResult(true);
    const currentQ = questions[currentIndex];
    const isCorrect = idx === currentQ.answer_index;
    
    if (isCorrect) {
      HapticService.success();
      setScore(s => s + 1);
    } else {
      HapticService.error();
    }

    setResultEntries((prev) => [
      ...prev,
      {
        question: currentQ.question,
        is_correct: isCorrect,
        selected_index: idx,
        correct_index: currentQ.answer_index,
        difficulty: currentQ.difficulty,
      },
    ]);
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setComplete(true);
    const xpEarned = score * XP_PER_CORRECT;
    const totalTimeSeconds = Math.max(1, Math.floor((Date.now() - quizStartedAtRef.current) / 1000));
    const finalScorePercentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const weakAreas = resultEntries
      .filter((entry) => !entry.is_correct)
      .map((entry) => entry.difficulty || 'revision')
      .filter(Boolean);
    const strongAreas = resultEntries
      .filter((entry) => entry.is_correct)
      .map((entry) => entry.difficulty || 'core')
      .filter(Boolean);

    if (user) {
      try {
        // 1. Update user_profiles.total_xp (what rewardService reads)
        const { data: currData } = await supabase
          .from('user_profiles')
          .select('total_xp')
          .eq('id', user.id)
          .single();
        const newXP = (currData?.total_xp || 0) + xpEarned;
        await supabase
          .from('user_profiles')
          .upsert({ id: user.id, total_xp: newXP }, { onConflict: 'id' });

        // 2. Also update user_stats (safeAwardUserXP handles race conditions)
        await safeAwardUserXP(user.id, xpEarned, mode === 'quick-sprint' ? 'quiz' : 'topic');

        // 3. Record quiz history
        await XPService.recordQuizHistory(user.id, {
          quizType: mode === 'quick-sprint' ? 'quick-sprint' : 'topic',
          score,
          totalQuestions: questions.length,
          timeTaken: totalTimeSeconds,
          subjectName: normalizedSubjectName || undefined,
          topicId: typeof topicId === 'string' ? topicId : undefined,
        }, xpEarned);

        if (typeof topicId === 'string' && topicId) {
          await supabase
            .from('user_topic_progress')
            .upsert({
              user_id: user.id,
              topic_id: topicId,
              questions_attempted: questions.length,
              questions_correct: score,
              best_score: finalScorePercentage,
              total_time_spent: totalTimeSeconds,
              last_attempted: new Date().toISOString(),
              proficiency_level: finalScorePercentage >= 90
                ? 'expert'
                : finalScorePercentage >= 75
                  ? 'advanced'
                  : finalScorePercentage >= 60
                    ? 'intermediate'
                    : 'beginner',
              weak_areas: [...new Set(weakAreas)],
              strong_areas: [...new Set(strongAreas)],
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id,topic_id',
            });
        }

        if (normalizedTopicName && normalizedSubjectName) {
          await SupabaseService.updateUserMemory(user.id, normalizedTopicName, normalizedSubjectName, {
            score: finalScorePercentage,
            correctAnswers: score,
            totalQuestions: questions.length,
            weakAreas: [...new Set(weakAreas)],
            strongAreas: [...new Set(strongAreas)],
            difficulty: 'mixed',
          });
        }
      } catch (e) {
        console.warn('Failed to persist quiz progress', e);
      }
    }
  };

  if (loading) {
    return <UnifiedLoader context="quiz" message="Loading your quiz…" />;
  }

  if (questions.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
          style={StyleSheet.absoluteFillObject}
        />
        <Ionicons name="help-circle-outline" size={56} color="#CBD5E1" />
        <Text style={styles.loadingText}>No questions found for this topic.</Text>
        <TouchableOpacity style={styles.exitBtn} activeOpacity={1} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/home')}>
          <Text style={styles.exitBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (complete) {
    const xpEarned = score * XP_PER_CORRECT;
    const weakCount = resultEntries.filter((entry) => !entry.is_correct).length;
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
          style={StyleSheet.absoluteFillObject}
        />
        <QuizBackgroundOrbs />
        
        {/* Confetti Background */}
        <View style={[StyleSheet.absoluteFillObject, { zIndex: 10, pointerEvents: 'none' }]}>
          <LottieView
            source={require('../../assets/animations/confetti.json')}
            autoPlay
            loop={false}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.completeCenter}>
          <MotiView
            from={{ opacity: 0, scale: 0.8, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            style={styles.completedCard}
          >
            <View style={styles.trophyContainer}>
              <Ionicons name="trophy" size={54} color="#facc15" />
            </View>
            <Text style={styles.completedTitle}>Quiz Complete!</Text>
            <Text style={styles.completedStats}>You scored {score} / {questions.length}</Text>
            <Text style={styles.completedSubstats}>
              {weakCount > 0 ? `${weakCount} to revise` : 'All correct! Great work.'}
            </Text>

            <View style={styles.xpBadge}>
              <Ionicons name="flash" size={18} color="#00D4C7" />
              <Text style={styles.xpText}>+{xpEarned} XP</Text>
            </View>

            <TouchableOpacity
              style={styles.actionBtn}
              activeOpacity={1} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/home')}
            >
              <LinearGradient colors={['#00D4C7', '#0EA5E9']} style={styles.actionGradient} start={{x:0, y:0}} end={{x:1, y:1}}>
                <Text style={styles.actionBtnText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        </View>
      </View>
    );
  }

  const currentQ = questions[currentIndex];
  
  // Interpolations for timer
  const timerWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  const timerColor = progressAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: ['#F43F5E', '#F59E0B', '#00D4C7'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
        style={StyleSheet.absoluteFillObject}
      />
      <QuizBackgroundOrbs />

      <View style={[styles.header, { paddingTop: insets.top + 5 }]}>
        <TouchableOpacity 
          activeOpacity={1} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/home')}
          style={styles.circleClose}
        >
          <Ionicons name="close" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitleSmall}>
            {mode === 'quick-sprint' ? 'Quick Sprint' : (topicName || subjectName || 'Quiz')}
          </Text>
          <Text style={styles.stepIndicator}>Question {currentIndex + 1} of {questions.length}</Text>
        </View>
        <View style={styles.scoreBadgeV2}>
          <Ionicons name="flame" size={16} color="#F59E0B" />
          <Text style={styles.scoreTextV2}>{score}</Text>
        </View>
      </View>

      <View style={styles.timerTrackV2}>
        <Animated.View style={[styles.timerFillV2, { width: timerWidth, backgroundColor: timerColor }]} />
      </View>

      <MotiView
        key={currentIndex}
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'timing', duration: 400 }}
        style={styles.questionSection}
      >
        <View style={styles.questionGlassCard}>
          <Text style={styles.questionTextV2}>{currentQ.question}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.optionsListV2} showsVerticalScrollIndicator={false}>
          {currentQ.options.map((option, idx) => {
            const isCorrect = idx === currentQ.answer_index;
            const isSelected = idx === selectedOption;
            
            let cardStyle: any = styles.optionGlass;
            let textStyle: any = styles.optionTextV2;
            
            if (showResult) {
              if (isCorrect) {
                  cardStyle = [styles.optionGlass, styles.optionGlassCorrect];
                  textStyle = [styles.optionTextV2, styles.optionTextResultV2];
              } else if (isSelected && !isCorrect) {
                  cardStyle = [styles.optionGlass, styles.optionGlassWrong];
                  textStyle = [styles.optionTextV2, styles.optionTextResultV2];
              } else {
                  cardStyle = [styles.optionGlass, { opacity: 0.4 }];
              }
            }

            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={1} onPress={() => handleOptionPress(idx)}
                style={cardStyle}
                activeOpacity={1}
                disabled={showResult}
              >
                <View style={styles.optionContentRow}>
                  <View style={[styles.optionIndex, showResult && isCorrect && { backgroundColor: '#10B98120' }]}>
                    <Text style={[styles.optionIndexText, showResult && isCorrect && { color: '#10B981' }]}>
                      {String.fromCharCode(65 + idx)}
                    </Text>
                  </View>
                  <Text style={textStyle}>{option}</Text>
                </View>
                {showResult && isCorrect && <Ionicons name="checkmark-circle" size={24} color="#10B981" />}
                {showResult && isSelected && !isCorrect && <Ionicons name="close-circle" size={24} color="#F43F5E" />}
              </TouchableOpacity>
            );
          })}

          {showResult && (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              style={styles.explanationBoxV2}
            >
              <View style={styles.explanationHeader}>
                <Ionicons name="bulb" size={18} color="#00D4C7" />
                <Text style={styles.explanationLabel}>EXPLANATION</Text>
              </View>
              <Text style={styles.explanationTextV2}>
                {currentQ.explanation
                  ? currentQ.explanation
                  : (selectedOption === currentQ.answer_index
                      ? 'Correct!'
                      : `The correct answer is ${String.fromCharCode(65 + currentQ.answer_index)}: ${currentQ.options[currentQ.answer_index || 0]}`)}
              </Text>

              <TouchableOpacity style={styles.nextBtnV2} activeOpacity={1} onPress={handleNext}>
                <LinearGradient colors={['#00D4C7', '#0EA5E9']} style={styles.nextGradientV2} start={{x:0,y:0}} end={{x:1,y:1}}>
                  <Text style={styles.nextBtnTextV2}>
                    {currentIndex === questions.length - 1 ? 'FINISH' : 'NEXT'}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>
          )}
        </ScrollView>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ambientOrb1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 212, 199, 0.08)',
  },
  ambientOrb2: {
    position: 'absolute',
    bottom: -150,
    left: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(14, 165, 233, 0.08)',
  },
  loadingText: {
    marginTop: 20,
    color: '#64748B',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    letterSpacing: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    zIndex: 10,
  },
  circleClose: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitleSmall: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#00D4C7',
    textTransform: 'uppercase',
  },
  stepIndicator: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  scoreBadgeV2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 6,
  },
  scoreTextV2: {
    color: '#F59E0B',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  timerTrackV2: {
    height: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.05)',
    marginHorizontal: 24,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 20,
  },
  timerFillV2: {
    height: '100%',
  },
  questionSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  questionGlassCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  questionTextV2: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    lineHeight: 30,
    textAlign: 'center',
  },
  optionsListV2: {
    gap: 12,
    paddingBottom: 32,
  },
  optionGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  optionGlassCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  optionGlassWrong: {
    backgroundColor: 'rgba(244, 63, 94, 0.05)',
    borderColor: 'rgba(244, 63, 94, 0.2)',
  },
  optionContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIndex: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionIndexText: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  optionTextV2: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#334155',
    flex: 1,
  },
  optionTextResultV2: {
    color: '#0F172A',
    fontFamily: 'Poppins-SemiBold',
  },
  explanationBoxV2: {
    backgroundColor: 'rgba(0, 212, 199, 0.05)',
    borderRadius: 22,
    padding: 20,
    marginTop: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#00D4C7',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  explanationLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#00D4C7',
    letterSpacing: 1,
  },
  explanationTextV2: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    lineHeight: 22,
  },
  bottomBarV2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: 'transparent',
  },
  nextBtnV2: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 16,
  },
  nextGradientV2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  nextBtnTextV2: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  completeCenter: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  completedCard: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
  trophyContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(250, 204, 21, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  completedTitle: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  completedStats: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  completedSubstats: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 199, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    marginBottom: 32,
  },
  xpText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#0D9488',
    letterSpacing: 1,
  },
  actionBtn: {
    width: '100%',
  },
  actionGradient: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  exitBtn: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  exitBtnText: {
    color: '#475569',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  }
});


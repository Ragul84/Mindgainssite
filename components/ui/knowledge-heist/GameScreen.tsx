import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeistSoundService } from '@/services/heistSoundService';
import { MindClashGameService } from '@/services/knowledgeHeistService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const isShortDevice = SCREEN_HEIGHT < 700;

interface Participant {
  name: string;
  score: number;
  avatar: string;
  isCurrentUser?: boolean;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface GameScreenProps {
  onComplete: (score: number) => void;
  onExit: () => void;
  vaultName: string;
  totalXp: number;
  questions?: Question[];
  userId?: string;
  sessionId?: string | null;
}

const FALLBACK_QUESTIONS: Question[] = [
  {
    id: 'loading-1',
    question: 'Loading questions... Please wait a moment.',
    options: ['Understood', 'Connect', 'Start', 'Secure'],
    correctAnswer: 0,
  }
];

export default function GameScreen({ 
  onComplete, 
  onExit, 
  vaultName, 
  totalXp,
  questions = [],
  userId,
  sessionId
}: GameScreenProps) {

  const insets = useSafeAreaInsets();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Power-up state
  const [powerUps, setPowerUps] = useState({
    fifty_fifty: 2,
    time_freeze: 1,
    show_insight: 1,
    second_chance: 0,
  });
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [timerPaused, setTimerPaused] = useState(false);
  const [showInsightPopup, setShowInsightPopup] = useState(false);
  const [hasSecondChance, setHasSecondChance] = useState(false);
  const [insightText, setInsightText] = useState('');
  
  // Subscribe to real-time participant updates
  useEffect(() => {
    if (!sessionId) return;
    MindClashGameService.getGameSession(sessionId).then(session => {
      if (session) {
        setParticipants(session.participants.map(p => ({
          name: p.userName,
          score: p.score || 0,
          avatar: p.userAvatar,
          isCurrentUser: p.userId === userId
        })).sort((a, b) => b.score - a.score));
      }
    });

    const subscription = MindClashGameService.subscribeToParticipants(sessionId, (updatedPlayers) => {
      setParticipants(updatedPlayers.map(p => ({
        name: p.user_name,
        score: p.score || 0,
        avatar: p.user_avatar,
        isCurrentUser: p.user_id === userId
      })));
    });

    return () => { subscription.unsubscribe(); };
  }, [sessionId, userId]);

  useEffect(() => {
    if (sessionId && userId && score > 0) {
      MindClashGameService.updateParticipantScore(sessionId, userId, score);
    }
  }, [score, sessionId, userId]);

  const momentumAnim = useRef(new Animated.Value(0)).current; 
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const questionSlide = useRef(new Animated.Value(20)).current;
  const contentFade = useRef(new Animated.Value(0)).current;

  const currentQuestions = questions.length > 0 ? questions : FALLBACK_QUESTIONS;
  const currentQuestion = currentQuestions[currentQuestionIndex];

  useEffect(() => {
    contentFade.setValue(0);
    questionSlide.setValue(20);
    
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(contentFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(questionSlide, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true })
    ]).start();

    HeistSoundService.playQuestion();
    resetTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      HeistSoundService.stopWarning();
    };
  }, [currentQuestionIndex]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      HeistSoundService.stopWarning();
    };
  }, []);

  const stopTimerAndWarning = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    HeistSoundService.stopWarning();
  };

  const resetTimer = () => {
    stopTimerAndWarning();
    setTimeLeft(15);
    setEliminatedOptions([]); 
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (timerPaused) return prev;
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        if (prev <= 6) {
          HeistSoundService.playWarning();
        } else {
          HeistSoundService.playCountdown();
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (answered) return;
    HeistSoundService.stopWarning();
    setAnswered(true);
    HeistSoundService.playWrong();
    setTimeout(handleNextQuestion, 1500);
  };

  const handleOptionSelect = (index: number) => {
    if (answered) return;

    stopTimerAndWarning();
    setSelectedOption(index);

    const isCorrect = index === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setAnswered(true);
      const points = 100;
      setScore(prev => prev + points);
      setParticipants(prev => prev.map(p => 
        p.isCurrentUser ? { ...p, score: p.score + points } : p
      ).sort((a,b) => b.score - a.score));
      HeistSoundService.playCorrect();
      
      Animated.spring(momentumAnim, {
        toValue: Math.min(100, (momentumAnim as any)._value + 25),
        useNativeDriver: true,
      }).start();
      
      setHasSecondChance(false);
      setTimeout(handleNextQuestion, 1800);
    } else {
      if (hasSecondChance) {
        HeistSoundService.playButtonClick();
        setHasSecondChance(false); 
        setSelectedOption(null); 
        setEliminatedOptions(prev => [...prev, index]);
        return; 
      }
      
      setAnswered(true);
      HeistSoundService.playWrong();
      
      Animated.spring(momentumAnim, {
        toValue: Math.max(-100, (momentumAnim as any)._value - 25),
        useNativeDriver: true,
      }).start();
      
      setTimeout(handleNextQuestion, 1800);
    }
  };

  const handleNextQuestion = () => {
    stopTimerAndWarning();
    if (currentQuestionIndex < currentQuestions.length - 1) {
      Animated.timing(contentFade, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
      });
    } else {
      stopTimerAndWarning();
      onComplete(score);
    }
  };

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

      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Top HUD Area */}
      <View style={[styles.appBar, { paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : 4) }]}>
         <View style={styles.glassBanner}>
            <TouchableOpacity onPress={onExit} style={styles.closeBtn}>
               <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
               <Text style={styles.vaultTitle}>{vaultName}</Text>
               <View style={styles.scoreContainer}>
                 <FontAwesome5 name="trophy" size={10} color="#F59E0B" />
                 <Text style={styles.scoreText}>{score}</Text>
               </View>
            </View>

            <View style={styles.opponentBox}>
               <FontAwesome5 name="user" size={14} color="#64748B" />
            </View>
         </View>
      </View>

      <View style={[styles.mainContent, { paddingBottom: insets.bottom + 100 }]}>
        <Animated.View style={[styles.animatedContent, { opacity: contentFade, transform: [{ translateY: questionSlide }] }]}>
          
          {/* Momentum Bar - Clean UI */}
          <View style={styles.momentumContainer}>
            <View style={styles.momentumBox}>
               <FontAwesome5 name="frown" size={12} color="#EF4444" />
            </View>
            <View style={styles.momentumTrack}>
              <View style={styles.momentumCenter} />
              <Animated.View 
                style={[
                  styles.momentumIndicator, 
                  { 
                    transform: [{ 
                      translateX: momentumAnim.interpolate({
                        inputRange: [-100, 100],
                        outputRange: [-SCREEN_WIDTH * 0.35, SCREEN_WIDTH * 0.35]
                      }) 
                    }] 
                  }
                ]} 
              >
              </Animated.View>
            </View>
            <View style={styles.momentumBox}>
               <FontAwesome5 name="smile" size={12} color="#00D4C7" />
            </View>
          </View>

          {/* Progress Header */}
          <View style={styles.progressHeader}>
            <Text style={styles.objectiveLabel}>MATCH {currentQuestionIndex + 1}/{currentQuestions.length}</Text>
            
            <View style={[styles.timerCircle, timeLeft <= 5 && styles.timerCircleUrgent, timerPaused && styles.timerCircleFrozen]}>
               <Text style={[styles.timerText, timeLeft <= 5 && styles.timerTextUrgent, timerPaused && styles.timerTextFrozen]}>
                 {timeLeft}
               </Text>
            </View>
          </View>

          {/* Question Card */}
          <View style={[styles.questionCard, isShortDevice && styles.questionCardShort]}>
            <Text style={[styles.questionMainText, isShortDevice && styles.questionMainTextShort]}>
              {currentQuestion.question}
            </Text>
          </View>

          {/* Options Grid */}
          <View style={styles.optionsGrid}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showResult = answered;
              const isEliminated = eliminatedOptions.includes(index);

              let cardStyle: any = styles.optionBtn;
              let textStyle: any = styles.optionBtnText;

              if (isEliminated && !showResult) {
                cardStyle = [styles.optionBtn, styles.optionEliminated];
                textStyle = [styles.optionBtnText, styles.optionEliminatedText];
              } else if (showResult) {
                if (isCorrect) {
                  cardStyle = [styles.optionBtn, styles.optionBtnCorrect];
                  textStyle = [styles.optionBtnText, { color: '#FFF' }];
                } else if (isSelected && !isCorrect) {
                  cardStyle = [styles.optionBtn, styles.optionBtnWrong];
                  textStyle = [styles.optionBtnText, { color: '#FFF' }];
                } else {
                  cardStyle = [styles.optionBtn, styles.optionBtnDimmed];
                  textStyle = [styles.optionBtnText, styles.optionBtnTextDimmed];
                }
              } else if (isSelected) {
                cardStyle = [styles.optionBtn, styles.optionBtnSelected];
              }

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  onPress={() => handleOptionSelect(index)}
                  disabled={answered || isEliminated}
                  style={[cardStyle, isShortDevice && styles.optionBtnShort]}
                >
                  <Text numberOfLines={2} style={[textStyle, isShortDevice && styles.optionBtnTextShort]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>

      {/* Powerups Bottom Bar */}
      <View style={[styles.powerupRibbon, { paddingBottom: insets.bottom + (isShortDevice ? 10 : 20) }]}>
        <BottomPower icon="cut" count={powerUps.fifty_fifty} powerId="fifty_fifty" color="#00D4C7"
          onActivate={async (id: string) => {
            if (answered || eliminatedOptions.length > 0) return;
            setPowerUps(prev => ({ ...prev, [id]: Math.max(0, prev[id as keyof typeof prev] - 1) }));
            setActivePowerUp(id);
            const wrongOptions = currentQuestion.options.map((_, i) => i).filter(i => i !== currentQuestion.correctAnswer);
            const toEliminate = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
            setEliminatedOptions(toEliminate);
            setTimeout(() => setActivePowerUp(null), 1000);
            if (userId) MindClashGameService.usePowerUp(userId, id);
          }}
        />
        
        <BottomPower icon="snowflake" count={powerUps.time_freeze} powerId="time_freeze" color="#0EA5E9"
          onActivate={async (id: string) => {
            if (timerPaused) return;
            setPowerUps(prev => ({ ...prev, [id]: Math.max(0, prev[id as keyof typeof prev] - 1) }));
            setActivePowerUp(id);
            setTimerPaused(true);
            setTimeout(() => { setTimerPaused(false); setActivePowerUp(null); }, 8000);
            if (userId) MindClashGameService.usePowerUp(userId, id);
          }}
        />
        
        <BottomPower icon="eye" count={powerUps.show_insight} powerId="show_insight" color="#8B5CF6"
          onActivate={async (id: string) => {
            setPowerUps(prev => ({ ...prev, [id]: Math.max(0, prev[id as keyof typeof prev] - 1) }));
            setActivePowerUp(id);
            setInsightText((currentQuestion as any).insight || 'Focus on the key terms in the question.');
            setShowInsightPopup(true);
            setTimeout(() => { setShowInsightPopup(false); setActivePowerUp(null); }, 5000);
            if (userId) MindClashGameService.usePowerUp(userId, id);
          }}
        />
        
        <BottomPower icon="undo" count={powerUps.second_chance} powerId="second_chance" color="#F59E0B"
          onActivate={async (id: string) => {
            setPowerUps(prev => ({ ...prev, [id]: Math.max(0, prev[id as keyof typeof prev] - 1) }));
            setActivePowerUp(id);
            setHasSecondChance(true);
            setTimeout(() => setActivePowerUp(null), 1000);
            if (userId) MindClashGameService.usePowerUp(userId, id);
          }}
        />
      </View>
      
      {showInsightPopup && (
        <View style={styles.insightOverlay}>
          <Animated.View style={styles.insightPopup}>
            <Text style={styles.insightTitle}>HINT</Text>
            <Text style={styles.insightText}>{insightText}</Text>
          </Animated.View>
        </View>
      )}
      
      {timerPaused && (
        <View style={styles.freezeOverlay}>
          <FontAwesome5 name="snowflake" size={30} color="#0EA5E9" />
          <Text style={styles.freezeText}>FROZEN</Text>
        </View>
      )}
    </View>
  );
}

function BottomPower({ icon, count, onActivate, powerId, color }: any) {
  const disabled = count === 0;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (disabled) return;
    HeistSoundService.playPowerup();
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      onActivate?.(powerId);
    });
  };

  return (
    <TouchableOpacity 
      style={[styles.powerItem, disabled && styles.powerDisabled]} 
      disabled={disabled}
      onPress={handlePress}
    >
      <Animated.View style={[styles.powerCircle, { transform: [{ scale: pulseAnim }], borderColor: color }]}>
         <FontAwesome5 name={icon} size={20} color={color} />
         <View style={[styles.powerBadge, { backgroundColor: color }]}>
            <Text style={styles.powerBadgeText}>{count}</Text>
         </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  appBar: {
    paddingBottom: 4,
    zIndex: 100,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  glassBanner: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  vaultTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    letterSpacing: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  scoreText: {
    color: '#D97706',
    fontFamily: 'Poppins-Bold',
    marginLeft: 6,
    fontSize: 12,
  },
  opponentBox: {
    backgroundColor: '#F1F5F9',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  animatedContent: {
    flex: 1,
  },
  momentumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
    paddingHorizontal: 16,
  },
  momentumBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  momentumTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  momentumCenter: {
    position: 'absolute',
    alignSelf: 'center',
    width: 2,
    height: '100%',
    backgroundColor: '#CBD5E1',
    zIndex: 1,
  },
  momentumIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    width: 8,
    height: 8,
    backgroundColor: '#00D4C7',
    borderRadius: 4,
    zIndex: 2,
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  objectiveLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
    letterSpacing: 1.5,
  },
  timerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
    zIndex: 10,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  timerCircleUrgent: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  timerCircleFrozen: { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' },
  timerText: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  timerTextUrgent: { color: '#EF4444' },
  timerTextFrozen: { color: '#0EA5E9' },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    minHeight: isShortDevice ? 100 : 130,
    justifyContent: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
  },
  questionCardShort: {
    padding: 16,
    minHeight: 80,
    marginBottom: 16,
  },
  questionMainText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 28,
  },
  questionMainTextShort: {
    fontSize: 16,
    lineHeight: 24,
  },
  optionsGrid: {
    gap: 12,
  },
  optionBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  optionBtnShort: {
    paddingVertical: 14,
  },
  optionBtnSelected: {
    backgroundColor: '#F8FAFC',
    borderColor: '#00D4C7',
  },
  optionBtnCorrect: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  optionBtnWrong: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
  },
  optionBtnDimmed: {
    opacity: 0.6,
  },
  optionBtnText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    textAlign: 'center',
  },
  optionBtnTextShort: {
    fontSize: 14,
  },
  optionBtnTextDimmed: { color: '#64748B' },
  powerupRibbon: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  powerItem: {
    alignItems: 'center',
  },
  powerDisabled: {
    opacity: 0.3,
  },
  powerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  powerBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  powerBadgeText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
  },
  insightOverlay: {
    position: 'absolute',
    top: '30%',
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  insightPopup: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 10,
  },
  insightTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#8B5CF6',
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  insightText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 24,
  },
  freezeOverlay: {
    position: 'absolute',
    top: 150,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 4,
  },
  freezeText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#0EA5E9',
    marginTop: 4,
    letterSpacing: 2,
  },
  optionEliminated: {
    opacity: 0.4,
    backgroundColor: '#F1F5F9',
  },
  optionEliminatedText: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
});


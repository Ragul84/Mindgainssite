import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HapticService from '@/utils/hapticService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FocusSection {
  id: string;
  title: string;
  content: string;
  interaction?: {
    type: 'flashcard';
    data: { revealedText: string };
  };
}

interface FocusQuiz {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface FocusModeLessonProps {
  lesson: {
    sections: FocusSection[];
    quiz: FocusQuiz[];
  };
  onComplete: (score: number, weakTopics: string[]) => void;
  onEvent?: (event: string, data?: any) => void;
}

type Phase = 'reading' | 'quiz' | 'celebration';

export default function FocusModeLesson({
  lesson,
  onComplete,
  onEvent,
}: FocusModeLessonProps) {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>('reading');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Transitions
  const handleCardNext = () => {
    if (activeCardIndex < lesson.sections.length - 1) {
      setActiveCardIndex(prev => prev + 1);
      setIsFlipped(false);
      HapticService.light();
      onEvent?.('section_complete', { sectionId: lesson.sections[activeCardIndex].id });
    } else {
      setPhase('quiz');
      HapticService.impact();
      onEvent?.('reading_complete');
    }
  };

  const handleQuizNext = (isCorrect: boolean) => {
    if (isCorrect) setScore(prev => prev + 1);
    
    if (quizIndex < lesson.quiz.length - 1) {
      setTimeout(() => {
        setQuizIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowExplanation(false);
        HapticService.light();
      }, 1500);
    } else {
      setTimeout(() => {
        setPhase('celebration');
        HapticService.success();
      }, 1500);
    }
  };

  const handleFinalFinish = () => {
    const finalScore = Math.round((score / lesson.quiz.length) * 100);
    onComplete(finalScore, []);
  };

  const currentSection = lesson.sections[activeCardIndex];
  const currentQuiz = lesson.quiz[quizIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 🌌 Abyss Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#020617', '#000000']}
          style={StyleSheet.absoluteFill}
        />
        <MotiView
          from={{ opacity: 0.1, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1.2 }}
          transition={{ type: 'timing', duration: 10000, loop: true }}
          style={styles.ambientGlow}
        />
      </View>

      {/* 🏛️ Focused Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.progressBar}>
          <MotiView 
            animate={{ 
              width: phase === 'reading' 
                ? `${((activeCardIndex + 1) / lesson.sections.length) * 100}%`
                : `${((quizIndex + 1) / lesson.quiz.length) * 100}%`
            }}
            style={[
              styles.progressFill, 
              { backgroundColor: phase === 'quiz' ? '#F59E0B' : '#00D4C7' }
            ]} 
          />
        </View>
        <Text style={styles.headerLabel}>
          {phase === 'reading' ? `SECTION ${activeCardIndex + 1}/${lesson.sections.length}` : `QUESTION ${quizIndex + 1}/${lesson.quiz.length}`}
        </Text>
      </View>

      <View style={styles.content}>
        <AnimatePresence exitBeforeEnter>
          {phase === 'reading' && (
            <MotiView
              key={`section-${activeCardIndex}`}
              from={{ opacity: 0, translateX: 50 }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: -50 }}
              style={styles.cardContainer}
            >
              <View style={styles.card}>
                <Text style={styles.cardCategory}>{currentSection.title}</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.cardContent}>{currentSection.content}</Text>
                  
                  {currentSection.interaction?.type === 'flashcard' && (
                    <TouchableOpacity 
                      style={styles.flashcardBtn} 
                      onPress={() => {
                        setIsFlipped(!isFlipped);
                        HapticService.impact();
                      }}
                    >
                      <LinearGradient
                        colors={isFlipped ? ['#1E293B', '#0F172A'] : ['#00D4C7', '#00B8AD']}
                        style={styles.flashcardGradient}
                      >
                        <Text style={[styles.flashcardText, isFlipped && { color: '#00D4C7' }]}>
                          {isFlipped ? currentSection.interaction.data.revealedText : 'TAP TO INTERNALIZE'}
                        </Text>
                        <Ionicons 
                          name={isFlipped ? "checkmark-circle" : "eye-outline"} 
                          size={18} 
                          color={isFlipped ? '#00D4C7' : '#0F172A'} 
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </View>

              <TouchableOpacity 
                style={styles.nextBtn} 
                onPress={handleCardNext}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#0F172A', '#1E293B']}
                  style={styles.nextGradient}
                >
                  <Text style={styles.nextText}>
                    {activeCardIndex === lesson.sections.length - 1 ? 'START CHALLENGE' : 'NEXT PROTOCOL'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#00D4C7" />
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>
          )}

          {phase === 'quiz' && (
            <MotiView
              key={`quiz-${quizIndex}`}
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              style={styles.cardContainer}
            >
              <View style={[styles.card, { borderColor: 'rgba(245, 158, 11, 0.2)' }]}>
                <Text style={[styles.cardCategory, { color: '#F59E0B' }]}>CHECKPOINT</Text>
                <Text style={styles.quizQuestion}>{currentQuiz.question}</Text>
                
                <View style={styles.optionsList}>
                  {currentQuiz.options.map((opt, i) => {
                    const isCorrect = opt === currentQuiz.answer;
                    const isSelected = selectedOption === i;
                    const showResult = selectedOption !== null;

                    let optionBg = 'rgba(255, 255, 255, 0.05)';
                    let borderCol = 'rgba(255, 255, 255, 0.1)';
                    if (showResult) {
                      if (isCorrect) {
                        optionBg = 'rgba(16, 185, 129, 0.15)';
                        borderCol = '#10B981';
                      } else if (isSelected) {
                        optionBg = 'rgba(244, 63, 94, 0.15)';
                        borderCol = '#F43F5E';
                      }
                    }

                    return (
                      <TouchableOpacity
                        key={i}
                        style={[styles.option, { backgroundColor: optionBg, borderColor: borderCol }]}
                        onPress={() => {
                          if (selectedOption !== null) return;
                          setSelectedOption(i);
                          setShowExplanation(true);
                          handleQuizNext(isCorrect);
                        }}
                        disabled={selectedOption !== null}
                      >
                        <Text style={styles.optionText}>{opt}</Text>
                        {showResult && isCorrect && <Ionicons name="checkmark-circle" size={18} color="#10B981" />}
                        {showResult && isSelected && !isCorrect && <Ionicons name="close-circle" size={18} color="#F43F5E" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {showExplanation && (
                  <MotiView from={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={styles.explanationBox}>
                    <Text style={styles.explanationTitle}>EXPLANATION</Text>
                    <Text style={styles.explanationText}>{currentQuiz.explanation}</Text>
                  </MotiView>
                )}
              </View>
            </MotiView>
          )}

          {phase === 'celebration' && (
            <MotiView
              key="celebration"
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.celebrationContainer}
            >
              <View style={styles.succesIconBg}>
                <Ionicons name="trophy" size={60} color="#F59E0B" />
              </View>
              <Text style={styles.celebTitle}>Session Perfected</Text>
              <Text style={styles.celebSubtitle}>You've successfully completed the focus protocol for the topic.</Text>
              
              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Score</Text>
                  <Text style={styles.statValue}>{score}/{lesson.quiz.length}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Accuracy</Text>
                  <Text style={styles.statValue}>{Math.round((score / lesson.quiz.length) * 100)}%</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.finishBtn} onPress={handleFinalFinish}>
                <LinearGradient
                  colors={['#00D4C7', '#00B8AD']}
                  style={styles.finishGradient}
                >
                  <Text style={styles.finishText}>CONCLUDE MISSION</Text>
                  <Ionicons name="checkmark-done" size={20} color="#0F172A" />
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  ambientGlow: {
    position: 'absolute',
    top: -150,
    right: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#00D4C7',
  },
  header: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  headerLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#94A3B8',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    maxHeight: SCREEN_HEIGHT * 0.65,
  },
  cardCategory: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#00D4C7',
    letterSpacing: 1.5,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  cardContent: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#F1F5F9',
    lineHeight: 28,
  },
  flashcardBtn: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  flashcardGradient: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  flashcardText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    letterSpacing: 1,
  },
  nextBtn: {
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  nextGradient: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  nextText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  quizQuestion: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  optionsList: {
    gap: 12,
  },
  option: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#CBD5E1',
    flex: 1,
  },
  explanationBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
  },
  explanationTitle: {
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
    color: '#94A3B8',
    marginBottom: 6,
  },
  explanationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    lineHeight: 20,
  },
  celebrationContainer: {
    alignItems: 'center',
  },
  succesIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  celebTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  celebSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    padding: 20,
    marginTop: 32,
    width: '100%',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  finishBtn: {
    marginTop: 40,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  finishGradient: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  finishText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    letterSpacing: 2,
  },
});


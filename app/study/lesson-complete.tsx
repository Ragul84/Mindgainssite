import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { ContentService } from '@/utils/contentService';
import LearningProgressService from '@/utils/learningProgressService';
import { useAuth } from '@/hooks/useAuth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Hearts Component for lives system
const HeartsDisplay = ({ hearts = 3, maxHearts = 3 }) => {
  return (
    <View style={styles.heartsContainer}>
      {[...Array(maxHearts)].map((_, index) => (
        <Text key={index} style={[styles.heart, index >= hearts && styles.heartEmpty]}>
          {index < hearts ? '❤️' : '🤍'}
        </Text>
      ))}
    </View>
  );
};

// Quiz Component with hearts system
const QuizContainer = ({ quiz, onAnswer, hearts }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    if (showFeedback) return;
    
    setSelectedOption(optionIndex);
    const correct = optionIndex === quiz.correct;
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer(correct);
      setSelectedOption(null);
      setShowFeedback(false);
    }, 1500);
  };

  return (
    <View style={styles.quizContainer}>
      <Text style={styles.quizQuestion}>{quiz.question}</Text>
      
      {quiz.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={1} onPress={() => handleAnswer(index)}
          disabled={showFeedback}
          style={[
            styles.optionButton,
            selectedOption === index && (isCorrect ? styles.correctOption : styles.wrongOption),
            quiz.correct === index && showFeedback && styles.correctOption
          ]}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}

      {showFeedback && (
        <View style={styles.feedbackBox}>
          <Text style={[styles.feedbackText, isCorrect ? styles.correctText : styles.wrongText]}>
            {isCorrect ? '✅ Correct!' : '❌ Wrong!'}
          </Text>
          <Text style={styles.explanationText}>{quiz.explanation}</Text>
        </View>
      )}
    </View>
  );
};

// Content Section Component
const ContentSection = ({ section, isExpanded, onToggle }) => {
  const animatedHeight = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const height = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={onToggle} style={styles.sectionHeader} activeOpacity={1} >
        <LinearGradient
          colors={section.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.sectionGradient}
        >
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Animated.View style={[styles.sectionContent, { height }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {section.content.map((item, index) => (
            <View key={index} style={styles.contentItem}>
              <Text style={[styles.contentSubtitle, { color: item.color }]}>
                {item.subtitle}
              </Text>
              {item.points.map((point, pointIndex) => (
                <Text key={pointIndex} style={styles.pointText}>
                  • {point.replace(/\*\*/g, '')}
                </Text>
              ))}
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default function LessonCompleteScreen() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const topicName = (params.topicName as string) || "Making of Constitution";
  const lessonId = (params.lessonId as string) || 'default-lesson';
  const topicId = (params.topicId as string) || 'default-topic';

  // States
  const [currentStage, setCurrentStage] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [totalXP, setTotalXP] = useState(0);

  // Get content and structure lesson flow
  const realContent = ContentService.getContentByTopicName(topicName);
  const [lessonFlow, setLessonFlow] = useState<any[]>([]);

  useEffect(() => {
    // Build lesson flow: Content → Quiz → Content → Quiz → Final Quiz
    const flow = [];
    
    // Default lesson flow — quizzes come from the DB via the lesson itself
    flow.push({
      type: 'content',
      section: {
        title: 'Introduction',
        gradient: ['#FF6B6B', '#FF8E53'],
        content: [{
          subtitle: 'Key Concepts',
          color: '#8B5CF6',
          points: ['Understanding the basics', 'Core principles', 'Important applications']
        }]
      },
      stageIndex: 0
    });

    flow.push({
      type: 'final-quiz',
      questions: [],
      title: 'Final Challenge',
      stageIndex: 1
    });

    setLessonFlow(flow);
  }, [realContent, topicId]);

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (!isCorrect) {
      const newHearts = hearts - 1;
      setHearts(newHearts);
      
      if (newHearts === 0) {
        Alert.alert(
          '💔 Out of Hearts!',
          'You need to review the content again before attempting the quiz.',
          [
            {
              text: 'Review Content',
              onPress: () => {
                setHearts(3);
                setCurrentStage(0);
                setCompletedStages([]);
              }
            }
          ]
        );
        return false;
      }
    } else {
      setTotalXP(totalXP + 10);
    }
    return true;
  };

  const handleStageComplete = () => {
    const stage = lessonFlow[currentStage];
    if (!stage) return;

    setCompletedStages([...completedStages, currentStage]);

    if (currentStage === lessonFlow.length - 1) {
      // Lesson complete!
      handleLessonComplete();
    } else {
      setCurrentStage(currentStage + 1);
    }
  };

  const handleLessonComplete = async () => {
    try {
      if (user?.id) {
        const xpReward = totalXP + 50; // Bonus XP for completion
        
        await LearningProgressService.completeLesson(
          lessonId, 
          topicId, 
          xpReward, 
          user.id
        );
        
        console.log('✅ Lesson completed with XP:', xpReward);
      }
      
      // Navigate to celebration or home
      router.push({
        pathname: '/study/celebration',
        params: { xpEarned: totalXP + 50, topicName }
      });
    } catch (error) {
      console.error('❌ Error completing lesson:', error);
      router.push('/(tabs)');
    }
  };

  const currentStageData = lessonFlow[currentStage];
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#123f94ff', '#000f2963']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header with Hearts */}
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <HeartsDisplay hearts={hearts} />
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentStage + 1) / lessonFlow.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              Stage {currentStage + 1} of {lessonFlow.length}
            </Text>
          </View>

          {/* Main Content Area */}
          <ScrollView style={styles.contentArea} showsVerticalScrollIndicator={false}>
            {currentStageData?.type === 'content' && (
              <View>
                <ContentSection
                  section={currentStageData.section}
                  isExpanded={true}
                  onToggle={() => {}}
                />
                <TouchableOpacity 
                  style={styles.continueButton}
                  activeOpacity={1} onPress={handleStageComplete}>
                  <LinearGradient
                    colors={['#00aeff', '#174cfcd8']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>Continue →</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {(currentStageData?.type === 'quiz' || currentStageData?.type === 'final-quiz') && (
              <View>
                <Text style={styles.quizTitle}>{currentStageData.title}</Text>
                {currentStageData.questions.map((quiz, index) => (
                  <QuizContainer
                    key={index}
                    quiz={quiz}
                    hearts={hearts}
                    onAnswer={(isCorrect) => {
                      const canContinue = handleQuizAnswer(isCorrect);
                      if (canContinue && index === currentStageData.questions.length - 1) {
                        handleStageComplete();
                      }
                    }}
                  />
                ))}
              </View>
            )}
          </ScrollView>

          {/* XP Display */}
          <View style={styles.xpDisplay}>
            <Text style={styles.xpText}>XP Earned: {totalXP}</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  heartsContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  heart: {
    fontSize: 24,
  },
  heartEmpty: {
    opacity: 0.5,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00aeff',
    borderRadius: 4,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  sectionHeader: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  sectionGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  expandIcon: {
    color: '#fff',
    fontSize: 16,
  },
  sectionContent: {
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  contentItem: {
    padding: 15,
  },
  contentSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  pointText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 5,
    color: '#333',
  },
  quizContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  quizTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  quizQuestion: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  correctOption: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
    borderWidth: 2,
  },
  wrongOption: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
    borderWidth: 2,
  },
  feedbackBox: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  correctText: {
    color: '#28a745',
  },
  wrongText: {
    color: '#dc3545',
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  continueButton: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  xpDisplay: {
    backgroundColor: 'rgba(0,174,255,0.2)',
    padding: 15,
    alignItems: 'center',
  },
  xpText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
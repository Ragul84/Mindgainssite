import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  BackHandler,
  Alert,
  Pressable,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from 'expo-router';
import LottieView from "lottie-react-native";
import { theme, M3Tokens } from '@/constants/theme';
import { SupabaseService } from '@/utils/supabaseService';
import { AppHeader } from '@/components/ui/AppHeader';
import PressableScale from '@/components/ui/PressableScale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import UnifiedLoader from '@/components/ui/UnifiedLoader';
import MascotAvatar from '@/components/ui/MascotAvatar';

const { width, height } = Dimensions.get('window');

export default function LessonReaderScreen() {
  const params = useLocalSearchParams();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [lessonData, setLessonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadLessonData();
    
    // Add back handler
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    // Animate content entry
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentSectionIndex]);

  const loadLessonData = async () => {
    try {
      const topicId = params.topicId;
      const title = params.title as string;
      const subject = params.subject as string;
      const contentData = params.contentData as string;
      
      let lessonSections = [];
      
      // If we have content data from the flashcard intro, use it
      if (contentData && contentData !== 'undefined') {
        try {
          const parsedContent = JSON.parse(contentData);
          
          // Convert the flashcard content sections to lesson reader format
          if (parsedContent && parsedContent.sections) {
            lessonSections = parsedContent.sections.map((section: any) => ({
              title: section.title,
              content: convertContentToText(section.content),
              keyPoints: extractKeyPoints(section.content),
            }));
          }
        } catch (parseError) {
          console.warn('Failed to parse content data:', parseError);
        }
      }
      
      // Fallback: create sections from topic title and subject
      if (lessonSections.length === 0) {
        lessonSections = [
          {
            title: "Introduction",
            content: `Welcome to the comprehensive study of ${title}. This lesson covers the essential concepts, important facts, and key details you need to master this topic in ${subject}.

This structured approach ensures you understand both the foundational concepts and the practical applications of ${title}. Each section builds upon the previous one to create a comprehensive understanding.`,
            keyPoints: [
              "Comprehensive coverage of the topic",
              "Essential concepts explained clearly",
              "Important facts and details",
              "Practical applications included"
            ],
          },
          {
            title: "Key Concepts",
            content: `The fundamental concepts of ${title} form the backbone of understanding in ${subject}. These core principles are essential for grasping the broader implications and applications.

Understanding these key concepts will enable you to analyze complex scenarios and apply your knowledge effectively in various contexts. Each concept is interconnected and builds upon the others.`,
            keyPoints: [
              "Foundation concepts explained",
              "Core principles identified",
              "Interconnected understanding",
              "Real-world applications"
            ],
          },
          {
            title: "Important Details",
            content: `This section delves into the specific details, facts, and information about ${title} that are crucial for thorough understanding. These details are often tested and form the basis for advanced study.

Pay special attention to the relationships between different aspects and how they contribute to the overall understanding of ${title} in the context of ${subject}.`,
            keyPoints: [
              "Detailed facts and information",
              "Critical examination points",
              "Relationship analysis",
              "Context understanding"
            ],
          },
          {
            title: "Summary & Applications",
            content: `This final section consolidates your learning about ${title} and explores its practical applications. Understanding how this knowledge applies in real-world scenarios is crucial for mastery.

The applications of ${title} extend beyond theoretical knowledge and have practical implications in ${subject}. This integrated approach ensures lasting comprehension and practical utility.`,
            keyPoints: [
              "Comprehensive summary",
              "Practical applications",
              "Real-world relevance", 
              "Integrated understanding"
            ],
          },
        ];
      }

      const lesson = {
        id: topicId || params.lessonId || 'lesson',
        title: title,
        subject: subject,
        sections: lessonSections,
        totalSections: lessonSections.length,
        estimatedTime: Math.max(10, lessonSections.length * 4),
        xpReward: Math.max(75, lessonSections.length * 30),
      };
      
      setLessonData(lesson);
      setProgress(0);
      setLoading(false);
    } catch (error) {
      console.error('Error loading lesson:', error);
      setLoading(false);
    }
  };


  // Helper function to convert content array to readable text
  const convertContentToText = (content: any[]): string => {
    if (!Array.isArray(content)) return 'Content not available.';
    
    return content.map(item => {
      if (typeof item === 'string') return item;
      if (item.subtitle) return `**${item.subtitle}**`;
      if (item.points && Array.isArray(item.points)) {
        return item.points.join('\n\n');
      }
      return '';
    }).filter(text => text.length > 0).join('\n\n');
  };

  // Helper function to extract key points from content
  const extractKeyPoints = (content: any[]): string[] => {
    if (!Array.isArray(content)) return [];
    
    const points: string[] = [];
    content.forEach(item => {
      if (item.points && Array.isArray(item.points)) {
        item.points.forEach((point: string) => {
          if (typeof point === 'string' && point.length > 10) {
            // Clean up the point (remove markdown formatting)
            const cleanPoint = point.replace(/\*\*/g, '').trim();
            if (cleanPoint.length > 0) {
              points.push(cleanPoint);
            }
          }
        });
      }
    });
    
    return points.slice(0, 4); // Limit to 4 key points per section
  };


  const handleBackPress = () => {
    Alert.alert(
      'Exit Lesson',
      'Are you sure you want to exit? Your progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', onPress: () => router.back() },
      ]
    );
    return true;
  };

  const handleNext = () => {
    if (!lessonData) return;
    
    if (currentSectionIndex < lessonData.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      const newProgress = ((currentSectionIndex + 1) / lessonData.sections.length) * 100;
      setProgress(newProgress);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      
      // Reset and replay animations
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
    } else {
      // Lesson completed
      completeLesson();
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      const newProgress = ((currentSectionIndex - 1) / lessonData.sections.length) * 100;
      setProgress(newProgress);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      
      // Reset and replay animations
      fadeAnim.setValue(0);
      slideAnim.setValue(-30);
    }
  };

  const completeLesson = async () => {
    try {
      // Award XP and update progress
      const user = await SupabaseService.getCurrentUser();
      if (user) {
        await SupabaseService.addXP(user.id, lessonData.xpReward);
      }
      
      Alert.alert(
        '🎉 Lesson Complete!',
        `You've earned ${lessonData.xpReward} XP!`,
        [
          {
            text: 'Continue Learning',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error completing lesson:', error);
      router.back();
    }
  };

  if (loading || !lessonData) {
    return (
      <UnifiedLoader
        message="Preparing your lesson..."
        context="study"
        fullScreen={true}
      />
    );
  }



  const currentSection = lessonData.sections[currentSectionIndex];

  return (
    <LinearGradient colors={['#0A0F1A', '#101726', '#0A0F1A']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
        <AppHeader
          title={lessonData.title}
          subtitle={`Section ${currentSectionIndex + 1} of ${lessonData.sections.length}`}
          compact
          leftAction={{
            key: 'back',
            element: (
              <View style={styles.iconBtn}>
                <FontAwesome5 name="arrow-left" size={18} color="#FFFFFF" />
              </View>
            ),
            onPress: handleBackPress,
          }}
          rightActions={[
            {
              key: 'progress',
              element: (
                <View style={styles.progressPill}>
                  <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                </View>
              ),
            },
          ]}
        />

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[M3Tokens.color.primary, M3Tokens.color.tertiary]}
              style={[styles.progressFill, { width: `${progress}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </View>

        {/* Floating Mascot */}
        <View style={styles.mascotWrapper}>
          <MascotAvatar
            emotion="wave"
            size={80}
            style={styles.mascot}
          />
        </View>

        {/* Content Card */}
        <Animated.View 
          style={[
            styles.contentWrapper,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient 
            colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']} 
            style={styles.card}
          >
            <Text style={styles.sectionTitle}>{currentSection.title}</Text>
            
            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.content}>{currentSection.content}</Text>
              
              {currentSection.keyPoints && currentSection.keyPoints.length > 0 && (
                <View style={styles.keyPointsContainer}>
                  <Text style={styles.keyPointsTitle}>Key Points</Text>
                  {currentSection.keyPoints.map((point: string, index: number) => (
                    <View key={index} style={styles.keyPointItem}>
                      <FontAwesome5 name="check-circle" size={14} color={M3Tokens.color.primary} solid />
                      <Text style={styles.keyPointText}>{point}</Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            {/* Navigation Buttons */}
            <View style={styles.navigationRow}>
              <TouchableOpacity 
                style={[styles.navButton, currentSectionIndex === 0 && styles.navButtonDisabled]}
                onPress={handlePrevious}
                disabled={currentSectionIndex === 0}
                activeOpacity={1}
              >
                <LinearGradient
                  colors={currentSectionIndex === 0 
                    ? ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']
                    : ['#667eea', '#764ba2']
                  }
                  style={styles.navButtonGradient}
                >
                  <FontAwesome5 name="arrow-left" size={16} color="#FFFFFF" />
                  <Text style={styles.navButtonText}>Previous</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.sectionIndicator}>
                {lessonData.sections.map((_: any, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.sectionDot,
                      index === currentSectionIndex && styles.sectionDotActive,
                      index < currentSectionIndex && styles.sectionDotCompleted,
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity 
                style={styles.navButton}
                onPress={handleNext}
                activeOpacity={1}
              >
                <LinearGradient
                  colors={currentSectionIndex === lessonData.sections.length - 1
                    ? ['#43e97b', '#38f9d7']
                    : ['#667eea', '#764ba2']
                  }
                  style={styles.navButtonGradient}
                >
                  <Text style={styles.navButtonText}>
                    {currentSectionIndex === lessonData.sections.length - 1 ? 'Complete' : 'Next'}
                  </Text>
                  <FontAwesome5 
                    name={currentSectionIndex === lessonData.sections.length - 1 ? "check" : "arrow-right"} 
                    size={16} 
                    color="#FFFFFF" 
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: M3Tokens.color.background.dark,
  },
  safe: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: M3Tokens.color.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 200,
    height: 200,
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  progressText: {
    color: '#fff',
    // fontFamily: theme.fonts.heading,
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  mascotWrapper: {
    position: 'absolute',
    top: 120,
    right: 20,
    zIndex: 10,
  },
  mascot: {
    width: 80,
    height: 80,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    fontSize: 24,
    // fontFamily: theme.fonts.heading,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  content: {
    fontSize: 16,
    // fontFamily: theme.fonts.body,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 26,
    marginBottom: 20,
  },
  keyPointsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  keyPointsTitle: {
    fontSize: 18,
    // fontFamily: theme.fonts.heading,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 4,
  },
  keyPointText: {
    fontSize: 14,
    // fontFamily: theme.fonts.body,
    color: 'rgba(255,255,255,0.85)',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  navButton: {
    flex: 0.35,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  navButtonText: {
    fontSize: 14,
    // fontFamily: theme.fonts.heading,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionDotActive: {
    width: 24,
    backgroundColor: M3Tokens.color.primary,
  },
  sectionDotCompleted: {
    backgroundColor: M3Tokens.color.primary,
  },
});
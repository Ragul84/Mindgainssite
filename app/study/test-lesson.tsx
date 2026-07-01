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
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { router } from 'expo-router';
import LottieView from "lottie-react-native";
import { theme, M3Tokens } from '@/constants/theme';
import { AppHeader } from '@/components/ui/AppHeader';
import MascotAvatar from '@/components/ui/MascotAvatar';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width, height } = Dimensions.get('window');

// Dummy lesson data to test the UI
const DUMMY_LESSON = {
  id: 'test-lesson',
  title: 'Delhi Sultanate',
  subject: 'History',
  sections: [
    {
      title: "Formation & Timeline",
      content: `The Delhi Sultanate (1206-1526 CE) was a Muslim sultanate based in Delhi, ruled by five successive dynasties. It marked the beginning of Muslim political dominance in the Indian subcontinent.

The Sultanate was founded by Qutb ud-Din Aibak in 1206 CE after the defeat of the last Hindu king, Prithviraj Chauhan. The five dynasties that ruled were: Slave Dynasty, Khilji Dynasty, Tughlaq Dynasty, Sayyid Dynasty, and Lodhi Dynasty.

This period saw significant architectural developments, including the construction of the Qutub Minar, and the introduction of new administrative systems that would influence Indian governance for centuries.`,
      keyPoints: [
        "Founded in 1206 CE by Qutb ud-Din Aibak",
        "Five successive dynasties ruled for 320 years",
        "First Muslim political dominance in India",
        "Significant architectural and administrative developments"
      ],
    },
    {
      title: "Major Dynasties",
      content: `The Slave Dynasty (1206-1290) was the first dynasty, established by Turkish slaves who had served the Ghurids. Notable rulers included Qutb ud-Din Aibak, Iltutmish, and Raziya Sultan.

The Khilji Dynasty (1290-1320) was known for its military expansion, particularly under Alauddin Khilji who repelled Mongol invasions and conquered much of southern India.

The Tughlaq Dynasty (1320-1414) reached its greatest territorial extent but also faced significant challenges, including the transfer of the capital from Delhi to Daulatabad by Muhammad bin Tughlaq.`,
      keyPoints: [
        "Slave Dynasty: First Muslim dynasty in India",
        "Khilji Dynasty: Expanded to southern India",
        "Tughlaq Dynasty: Largest territorial control",
        "Each dynasty brought unique administrative changes"
      ],
    },
    {
      title: "Administration & Culture",
      content: `The Delhi Sultanate developed a sophisticated administrative system combining Islamic governance with local Indian traditions. The Sultan was the supreme authority, supported by ministers and provincial governors.

The period saw significant cultural synthesis, with Persian, Arabic, and Indian influences merging in art, architecture, and literature. The Sultanate period introduced new architectural styles, including the use of arches, domes, and minarets.

Trade flourished during this period, with the Sultanate controlling important trade routes and encouraging commerce. This led to increased urbanization and the growth of a merchant class.`,
      keyPoints: [
        "Sophisticated administrative system developed",
        "Cultural synthesis of Persian, Arabic, and Indian traditions",
        "New architectural styles with Islamic features",
        "Flourishing trade and increased urbanization"
      ],
    },
    {
      title: "Legacy & Impact",
      content: `The Delhi Sultanate left a lasting impact on Indian history, culture, and society. It established the foundation for later Muslim rule in India, particularly influencing the Mughal Empire.

The architectural legacy includes numerous monuments like the Qutub Minar, Alai Darwaza, and various mosques and tombs that showcase Indo-Islamic architecture. These structures influenced subsequent architectural developments.

The administrative and military innovations of the Sultanate, including the iqta system and military organization, were adopted and refined by later rulers. The period also saw the development of Hindustani as a lingua franca.`,
      keyPoints: [
        "Foundation for later Muslim rule in India",
        "Rich architectural legacy with Indo-Islamic style",
        "Administrative and military innovations",
        "Development of Hindustani language"
      ],
    },
  ],
  totalSections: 4,
  estimatedTime: 15,
  xpReward: 120,
};

export default function TestLessonScreen() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
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
    if (currentSectionIndex < DUMMY_LESSON.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      const newProgress = ((currentSectionIndex + 1) / DUMMY_LESSON.sections.length) * 100;
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
      const newProgress = ((currentSectionIndex - 1) / DUMMY_LESSON.sections.length) * 100;
      setProgress(newProgress);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      
      // Reset and replay animations
      fadeAnim.setValue(0);
      slideAnim.setValue(-30);
    }
  };

  const completeLesson = async () => {
    Alert.alert(
      '🎉 Lesson Complete!',
      `You've earned ${DUMMY_LESSON.xpReward} XP!`,
      [
        {
          text: 'Continue Learning',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const currentSection = DUMMY_LESSON.sections[currentSectionIndex];

  return (
    <LinearGradient colors={['#0A0F1A', '#101726', '#0A0F1A']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
        <AppHeader
          title={DUMMY_LESSON.title}
          subtitle={`Section ${currentSectionIndex + 1} of ${DUMMY_LESSON.sections.length}`}
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
                {DUMMY_LESSON.sections.map((_: any, index: number) => (
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
                  colors={currentSectionIndex === DUMMY_LESSON.sections.length - 1
                    ? ['#43e97b', '#38f9d7']
                    : ['#667eea', '#764ba2']
                  }
                  style={styles.navButtonGradient}
                >
                  <Text style={styles.navButtonText}>
                    {currentSectionIndex === DUMMY_LESSON.sections.length - 1 ? 'Complete' : 'Next'}
                  </Text>
                  <FontAwesome5 
                    name={currentSectionIndex === DUMMY_LESSON.sections.length - 1 ? "check" : "arrow-right"} 
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
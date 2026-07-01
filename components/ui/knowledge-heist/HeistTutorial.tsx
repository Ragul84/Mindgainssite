import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TutorialStep {
  title: string;
  description: string;
  icon: string;
  color: string;
  details?: { icon: string; text: string; color: string }[];
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: 'THE MISSION',
    description: 'Enter MindClash Arenas and engage in speed-thinking battles. Solve competitive questions to earn XP Medals.',

    icon: 'user-secret',
    color: '#0EA5E9',
  },
  {
    title: 'SPEED & ACCURACY',
    description: 'The faster you answer, the higher your score. Quick responses yield maximum XP. Consistency ensures your ranking rise.',

    icon: 'bolt',
    color: '#F97316',
  },
  {
    title: 'GAME BOOSTERS',
    description: 'Use your boosters to get an edge during difficult questions. You get a limited free supply daily!',
    icon: 'rocket',
    color: '#A855F7',
    details: [
      { icon: 'brain', text: 'MENTAL SCAN: Removes two incorrect options.', color: '#10B981' },
      { icon: 'snowflake', text: 'TIME FREEZE: Freezes the timer.', color: '#0EA5E9' },
      { icon: 'bolt', text: 'INSIGHT FLASH: Skips the current question.', color: '#F59E0B' },
    ]
  },
  {
    title: 'GLOBAL RANKING',
    description: 'Compete against thousands of students. Rise through your state leaderboard and become India’s top ranker.',

    icon: 'trophy',
    color: '#F59E0B',
  },
  {
    title: 'BAGS REWARDS',
    description: 'Connect your Bags wallet address to receive special token rewards. Winning high-stakes clashes earns you exclusive airdrops!',

    icon: 'wallet',
    color: '#0EA5E9',
  }
];

interface HeistTutorialProps {
  onComplete: () => void;
}

export default function HeistTutorial({ onComplete }: HeistTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep + 1);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      onComplete();
    }
  };

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <View style={styles.overlay}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.9)', 'rgba(248, 250, 252, 0.95)']}
        style={StyleSheet.absoluteFill}
      />
      
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.card}>
          <LinearGradient
            colors={[step.color + '20', 'transparent']}
            style={styles.cardGradient}
          />
          
          <View style={[styles.iconContainer, { borderColor: step.color }]}>
            <FontAwesome5 name={step.icon} size={40} color={step.color} solid />
          </View>

          <Text style={[styles.title, { color: step.color }]}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>

          {step.details && (
            <View style={styles.detailsList}>
              {step.details.map((detail, idx) => (
                <View key={idx} style={styles.detailItem}>
                  <View style={[styles.detailIcon, { backgroundColor: detail.color + '20' }]}>
                    <FontAwesome5 name={detail.icon} size={12} color={detail.color} solid />
                  </View>
                  <Text style={styles.detailText}>{detail.text}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.pagination}>
            {TUTORIAL_STEPS.map((_, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.dot, 
                  idx === currentStep && { backgroundColor: step.color, width: 20 }
                ]} 
              />
            ))}
          </View>

          <TouchableOpacity 
            onPress={handleNext}
            activeOpacity={0.8}
            style={styles.nextButton}
          >
            <LinearGradient
              colors={[step.color, step.color + 'CC']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {currentStep === TUTORIAL_STEPS.length - 1 ? 'START BATTLE' : 'NEXT INTEL'}

              </Text>
              <FontAwesome5 
                name={currentStep === TUTORIAL_STEPS.length - 1 ? 'check' : 'arrow-right'} 
                size={16} 
                color="#FFFFFF" 
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 340,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  detailsList: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.03)',
    padding: 12,
    borderRadius: 16,
  },
  detailIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
  },
  pagination: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 30,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  nextButton: {
    width: '100%',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
  },
});


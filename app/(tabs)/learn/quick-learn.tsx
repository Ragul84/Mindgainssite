import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Vibration,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withSequence,
  withRepeat,
  Easing,
  interpolate,
  runOnJS,
} from '@/utils/reanimated';
import {
  ArrowLeft,
  Clock,
  Zap,
  Brain,
  Target,
  Copy,
  Share2,
  Eye,
  Lightbulb,
  Briefcase,
  Globe,
  BookOpen,
} from 'lucide-react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { theme } from '@/constants/theme';
import PageTransition from '@/components/ui/PageTransition';
import GradientButton from '@/components/ui/GradientButton';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import { SupabaseService } from '@/utils/supabaseService';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

interface LearningMode {
  id: '60second' | 'visual' | 'problem' | 'analogy';
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  gradient: string[];
  features: string[];
  prompt: string;
}

const LEARNING_MODES: LearningMode[] = [
  {
    id: '60second',
    title: '60-Second Science',
    subtitle: 'Learn any concept in under a minute',
    description: 'Get straight to the point with concise explanations, real-world connections, and practical applications.',
    icon: Clock,
    gradient: ['#00D4C7', '#00B8B1'],
    features: ['Ultra-concise', 'Real applications', 'Career connections', 'Memory hooks'],
    prompt: `Create a 60-second explanation following this exact structure:

**The Concept:**
[2-3 sentences explaining what it is in simple terms, using everyday analogies]

**Real-Life Connection:**
[2 sentences showing how this affects daily life with specific examples]

**Indian Context:**
[2 sentences with examples from Indian agriculture, technology, or daily life]

**Career Opportunities:**
[1-2 sentences about jobs/careers that use this knowledge with approximate salaries]

**Remember This:**
[1 powerful sentence that captures the essence]

Keep it under 150 words total. Use simple English. Make it memorable and practical.`,
  },
  {
    id: 'visual',
    title: 'Visual Journey',
    subtitle: 'See the process from inside',
    description: 'Take a microscopic journey through the concept, visualizing each step as if you were there.',
    icon: Eye,
    gradient: ['#00B8B1', '#00D4C7'],
    features: ['Vivid descriptions', 'Step-by-step', 'Sensory details', 'Easy visualization'],
    prompt: `Create a visual journey as if the reader is shrunk down and traveling through the process:

**The Journey Begins:**
[Set the scene - where are we starting?]

**What You See:**
[Describe the process visually, step by step, as if watching it happen]

**The Transformation:**
[Show the key moment of change/action]

**The Result:**
[What does the end look like?]

Use vivid, sensory language. Make it feel like a documentary. Keep it under 200 words.`,
  },
  {
    id: 'problem',
    title: 'Problem Solver',
    subtitle: 'Learn by solving real problems',
    description: 'Understand concepts by seeing how they solve actual problems in agriculture, health, or technology.',
    icon: Target,
    gradient: ['#00D4C7', '#00B8B1'],
    features: ['Real problems', 'Practical solutions', 'Aha moments', 'Direct application'],
    prompt: `Present the concept through a problem-solving narrative:

**The Problem:**
[A real problem faced in India - farming, health, technology, environment]

**The Challenge:**
[Why is this problem difficult to solve?]

**The Science Solution:**
[How understanding this concept provides the solution]

**Real Success Story:**
[An actual example where this was applied successfully in India]

**You Can Use This:**
[How the reader can apply this knowledge]

Keep it practical and inspiring. Under 200 words.`,
  },
  {
    id: 'analogy',
    title: 'Smart Analogies',
    subtitle: 'Complex ideas made simple',
    description: 'Understand difficult concepts through familiar everyday comparisons that stick in your mind.',
    icon: Lightbulb,
    gradient: ['#00B8B1', '#00D4C7'],
    features: ['Familiar comparisons', 'Multiple angles', 'Building blocks', 'Instant clarity'],
    prompt: `Explain this concept using powerful analogies:

**It's Just Like:**
[Main analogy comparing to something everyone knows]

**Breaking It Down:**
[2-3 smaller analogies for different parts of the concept]

**The Big Picture:**
[How all the analogies connect to show the complete concept]

**Now You Get It:**
[Summary using the simplest analogy]

Use comparisons to everyday Indian life - cooking, cricket, smartphones, etc. Under 150 words.`,
  },
];

const DEFAULT_MODEL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_TUTOR_MODEL ||
  process.env.EXPO_PUBLIC_TUTOR_MODEL ||
  'google/gemini-2.0-flash-001';

// AI Processing Function
const processWithAI = async (text: string, mode: LearningMode): Promise<string> => {
  console.log('🤖 Processing with AI - Mode:', mode.id);
  
  try {
    const { data } = await SupabaseService.callEdgeFunction('learn_ai', {
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 500,
      feature_type: 'ai_generation',
      metadata: { tool: 'quick-learn', mode: mode.id },
      messages: [
        {
          role: 'system',
          content: `You are an expert educator who explains complex topics in simple, memorable ways for Indian learners. Focus on clarity, practical applications, and real-world connections. Use simple English accessible to all Indians.`,
        },
        {
          role: 'user',
          content: `Topic: ${text}\n\n${mode.prompt}`,
        },
      ],
    });

    if (!data?.content) {
      throw new Error('Empty response from AI service.');
    }

    return data.content;
  } catch (error) {
    console.error('❌ Learn AI failed:', error);
    throw new Error('Unable to generate content. Please try again.');
  }
};

export default function QuickLearnScreen() {
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState<LearningMode>(LEARNING_MODES[0]);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Animation values
  const fadeIn = useSharedValue(0);
  const headerScale = useSharedValue(0.9);
  const progressWidth = useSharedValue(0);
  const resultOpacity = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 800 });
    headerScale.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  const generateContent = async () => {
    if (!inputText.trim()) {
      Alert.alert('Empty Input', 'Please enter a topic to learn about!');
      return;
    }

    setIsProcessing(true);
    setShowResult(false);
    
    progressWidth.value = withTiming(90, { duration: 2000, easing: Easing.out(Easing.exp) });

    try {
      const result = await processWithAI(inputText, selectedMode);
      setGeneratedContent(result);
      
      progressWidth.value = withTiming(100, { duration: 300 }, () => {
        runOnJS(setShowResult)(true);
        progressWidth.value = 0;
      });
      
      resultOpacity.value = withTiming(1, { duration: 600 });
      Vibration.vibrate(50);
      
    } catch (error) {
      let errorMessage = 'Failed to generate content. ';
      if ((error as any)?.message?.includes('401')) {
        errorMessage += 'API authentication failed. Please check your API keys.';
      } else {
        errorMessage += (error as any)?.message || 'Unknown error occurred.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ scale: headerScale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const resultAnimatedStyle = useAnimatedStyle(() => ({
    opacity: resultOpacity.value,
    transform: [{ translateY: interpolate(resultOpacity.value, [0, 1], [20, 0]) }],
  }));

  return (
    <PageTransition mode="slide" duration={350}>
      <LinearGradient
        colors={['#0A0F1A', '#101726', '#1A2333']}
        style={styles.container}
      >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Professional Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.title}>Quick Learn</Text>
            <Text style={styles.subtitle}>Master concepts in 60 seconds</Text>
          </View>
          
          <View style={styles.headerPlaceholder} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Mode Selection */}
            <View style={styles.modesSection}>
              <Text style={styles.sectionTitle}>Choose Your Learning Style</Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.modesScroll}
              >
                {LEARNING_MODES.map((mode) => (
                  <TouchableOpacity
                    key={mode.id}
                    activeOpacity={1} onPress={() => setSelectedMode(mode)}
                    activeOpacity={1}
                    style={[
                      styles.modeCard,
                      selectedMode.id === mode.id && styles.selectedModeCard,
                    ]}
                  >
                    <LinearGradient
                      colors={mode.gradient}
                      style={styles.modeGradient}
                    >
                      <mode.icon size={28} color={'#FFFFFF'} />
                      <Text style={styles.modeTitle}>{mode.title}</Text>
                      <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
                      
                      {selectedMode.id === mode.id && (
                        <View style={styles.selectedBadge}>
                          <FontAwesome5 name="check-circle" size={16} color={'#FFFFFF'} solid />
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {/* Selected Mode Features */}
              <View style={styles.featuresContainer}>
                {selectedMode.features.map((feature, index) => (
                  <View key={index} style={styles.featureChip}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Input Section */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>What do you want to learn?</Text>
              
              <TextInput
                style={styles.textInput}
                placeholder="E.g., Photosynthesis, Indian Constitution, Quantum Physics..."
                placeholderTextColor={'#8FA1B4'}
                value={inputText}
                onChangeText={setInputText}
                maxLength={100}
              />
              
              <View style={styles.inputFooter}>
                <Text style={styles.charCount}>{inputText.length}/100</Text>
              </View>
            </View>

            {/* Generate Button */}
            <View style={styles.actionSection}>
              <GradientButton
                title={isProcessing ? "Generating..." : `Generate ${selectedMode.title}`}
                onPress={generateContent}
                size="large"
                fullWidth
                disabled={!inputText.trim() || isProcessing}
                icon={isProcessing ? (
                  <ActivityIndicator size="small" color={'#FFFFFF'} />
                ) : (
                  <selectedMode.icon size={20} color={'#FFFFFF'} />
                )}
                colors={selectedMode.gradient}
              />
              
              {isProcessing && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
                  </View>
                  <Text style={styles.progressText}>Creating your {selectedMode.title}...</Text>
                </View>
              )}
            </View>

            {/* Result Section */}
            {showResult && (
              <Animated.View style={[styles.resultSection, resultAnimatedStyle]}>
                <View style={styles.resultHeader}>
                  <View style={styles.resultTitleContainer}>
                    <selectedMode.icon size={20} color={'#FFFFFF'} />
                    <Text style={styles.resultTitle}>{inputText}</Text>
                  </View>
                  <View style={styles.resultActions}>
                    <TouchableOpacity style={styles.resultAction} activeOpacity={1} >
                      <Copy size={20} color={'#FFFFFF'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.resultAction} activeOpacity={1} >
                      <Share2 size={20} color={'#FFFFFF'} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <ScrollView style={styles.resultContent} nestedScrollEnabled>
                  <MarkdownRenderer content={generatedContent} />
                </ScrollView>
                
                <View style={styles.resultFooter}>
                  <TouchableOpacity 
                    style={styles.tryAgainButton}
                    activeOpacity={1} onPress={() => {
                      setShowResult(false);
                      resultOpacity.value = 0;
                    }}
                  >
                    <Text style={styles.tryAgainText}>Try Different Style</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      </LinearGradient>
    </PageTransition>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  // Professional header - matches quiz pages
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  headerPlaceholder: {
    width: 44,
    height: 44,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  modesSection: {
    paddingVertical: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.subheading,
    color: '#FFFFFF',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  modesScroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  modeCard: {
    marginRight: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    width: width * 0.4,
  },
  selectedModeCard: {
    transform: [{ scale: 1.05 }],
  },
  modeGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
    position: 'relative',
  },
  modeTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.subheading,
    color: '#FFFFFF',
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  modeSubtitle: {
    fontSize: 11,
    fontFamily: theme.fonts.caption,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  selectedBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  featureChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  featureText: {
    fontSize: 12,
    fontFamily: theme.fonts.caption,
    color: '#FFFFFF',
  },
  inputSection: {
    marginHorizontal: theme.spacing.lg,
    backgroundColor: '#101726',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: theme.spacing.xl,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.subheading,
    color: '#FFFFFF',
    marginBottom: theme.spacing.md,
  },
  textInput: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: '#FFFFFF',
    paddingVertical: theme.spacing.sm,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.sm,
  },
  charCount: {
    fontSize: 12,
    fontFamily: theme.fonts.caption,
    color: '#8FA1B4',
  },
  actionSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  progressContainer: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.accent.blue,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontFamily: theme.fonts.caption,
    color: '#8FA1B4',
    marginTop: theme.spacing.sm,
  },
  resultSection: {
    marginHorizontal: theme.spacing.lg,
    backgroundColor: '#101726',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: theme.spacing.xl,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  resultTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.subheading,
    color: '#FFFFFF',
  },
  resultActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  resultAction: {
    padding: theme.spacing.sm,
  },
  resultContent: {
    maxHeight: 400,
    marginBottom: theme.spacing.md,
  },
  resultFooter: {
    alignItems: 'center',
  },
  tryAgainButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: theme.borderRadius.md,
  },
  tryAgainText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: '#FFFFFF',
  },
});

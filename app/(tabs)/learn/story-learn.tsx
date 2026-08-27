import React, { useState, useEffect, useRef } from 'react';
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
  ChevronLeft,
  BookOpen,
  Sparkles,
  Zap,
  Brain,
  Film,
  Trophy,
  Target,
  Copy,
  Share2,
  Eye,
  Settings,
  Mic,
  Camera,
  FileText,
  Star,
  Crown,
  Wand2,
} from 'lucide-react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { theme } from '@/constants/theme';
import GradientButton from '@/components/ui/GradientButton';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';
import { PremiumGateModal } from '@/components/ui/PremiumGateModal';
import { SupabaseService } from '@/utils/supabaseService';
import Constants from 'expo-constants';

// Generate Bollywood Story
const generateBollywoodStory = (topic: string): string => {
  const topics = topic.toLowerCase();
  
  if (topics.includes('photosynthesis') || topics.includes('plant')) {
    return `🎬 **CHLOROPHYLL: THE GREEN WARRIOR**

🌟 *A Bollywood Epic of Survival*

In the kingdom of Plant-istan, our hero **CHLOROPHYLL** (played by the green superstar) lives peacefully in the Leaf Palace. But danger lurks...

🦹‍♂️ **THE VILLAIN ARRIVES**
Enter **CARBON DIOXIDE** - the suffocating villain who wants to take over the world! "Muahahaha! I will make everyone breathe poison!" he declares.

💚 **THE HERO'S POWER**
But Chlorophyll has a secret weapon - the power of SUNLIGHT! When the Sun God blesses him with golden rays, he transforms into...

⚡ **THE TRANSFORMATION SCENE**
*Dramatic music plays*
"Main hoon Chlorophyll, main hoon shakti!"
He combines 6 Carbon Dioxide molecules with 6 Water molecules in an epic battle scene!

🎭 **THE CLIMAX**
With a powerful dance sequence, Chlorophyll creates:
- 1 Glucose (the sweet victory!)
- 6 Oxygen molecules (fresh air for everyone!)

🏆 **THE ENDING**
The kingdom is saved! Everyone can breathe freely! Chlorophyll becomes the hero of Plant-istan!

*"Yeh hai photosynthesis ki kahani, jahan science meets filmy deewani!"*

📚 **Moral of the Story:** Plants are the real heroes saving our planet every day!`;
  }
  
  // Generic Bollywood template
  return `🎬 **${topic.toUpperCase()}: A BOLLYWOOD EPIC**

🌟 Once upon a time in the kingdom of Knowledge...

Our hero faces challenges, meets allies, fights villains, and emerges victorious through the power of understanding!

🎭 *Featuring dramatic plot twists, emotional moments, and a happy ending where knowledge triumphs over ignorance!*

💫 The moral: Every topic has a story waiting to be told!`;
};

// Generate Exam Crusher Content
const generateExamCrusherContent = (topic: string): string => {
  const topics = topic.toLowerCase();
  
  // Fundamental Rights
  if (topics.includes('fundamental rights') || topics.includes('articles') || topics.includes('constitution')) {
    return `🎯 **FUNDAMENTAL RIGHTS - EXAM CRUSHER MODE**

⚡ **QUICK MEMORY TRICK:**
**"Every Person Can Rest, Freedom & Equality"**
- **E**quality (Art 14-18)
- **P**olitical Freedom (Art 19-22) 
- **C**ultural Rights (Art 29-30)
- **R**eligion Freedom (Art 25-28)
- **F**reedom from Exploitation (Art 23-24)
- **E**ducation Right (Art 21A)

🧠 **SUPER MNEMONICS:**
**Articles 12-35:** "Fundamental Rights ka Ghar"
**6 Categories:** EPCRFE (Remember: "Every Person Can Really Fight Evil")

📝 **EXAM GOLD POINTS:**
1. **Art 32** = "Heart & Soul" of Constitution (Dr. Ambedkar)
2. **Art 21** = Right to Life (Most Important!)
3. **Art 19** = 6 Freedoms (Speech, Assembly, Movement, etc.)
4. **Art 14** = Equality before Law

💡 **SCORING SHORTCUTS:**
- **Always write Article numbers** (+2 marks)
- **Mention Dr. Ambedkar for Art 32** (+1 mark)
- **Give real-life examples** (+3 marks)
- **Connect to current events** (+2 marks)

🎯 **GUARANTEED EXAM QUESTIONS:**
1. "List 6 Fundamental Rights" - 6 marks (Easy scoring!)
2. "Explain Art 21 with cases" - 10 marks
3. "Difference between Rights & Duties" - 5 marks

⭐ **EXAM HACKS:**
- **Kesavananda Bharati case** (1973) - Always mention for Constitutional Law
- **Maneka Gandhi case** (1978) - Expands Art 21
- **Shah Bano case** - Religion vs Gender rights

📊 **WEIGHTAGE:** 15-20 marks in UPSC/State PSC
🏆 **SUCCESS RATE:** 95% students score full marks!

✅ **LAST-MINUTE REVISION:**
Art 12-35 = Fundamental Rights
Art 36-51 = Directive Principles  
Art 52-151 = Union Government`;
  }
  
  // Photosynthesis
  if (topics.includes('photosynthesis') || topics.includes('plant')) {
    return `🎯 **PHOTOSYNTHESIS - EXAM CRUSHER MODE**

⚡ **MAGIC FORMULA:**
**6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂**

🧠 **MEMORY BOMB:**
**"6-6-1-6 Pattern"** = 6 Carbon, 6 Water, 1 Glucose, 6 Oxygen
**"Sunlight Se Glucose"** (Like Bollywood dialogue!)

📝 **EXAM GOLDMINE:**
1. **Location:** Chloroplasts (Green plastids in leaves)
2. **Pigment:** Chlorophyll (Green color pigment) 
3. **Process:** Light → Chemical energy conversion
4. **Phases:** Light Reaction + Dark Reaction (Calvin Cycle)

💡 **KILLER MNEMONICS:**
- **CHLOROPHYLL** = "CHief Light Obtaining Radiant Oxygen Production Helper for Life Leaves"
- **GLUCOSE** = "Green Leaves Use CO2 to Create Oxygen & Sugar Energy"

⭐ **INSTANT SCORING TIPS:**
- **Always draw the equation** (+2 marks guaranteed)
- **Mention "6CO2 + 6H2O"** (Most students forget numbers)
- **Write "Chloroplast organelle"** (+1 mark)
- **Add "Oxygen as by-product"** (+1 mark)

🎯 **FREQUENT EXAM QUESTIONS:**
1. "Write photosynthesis equation" - 2 marks (Free marks!)
2. "Explain light and dark reactions" - 5 marks
3. "Importance of photosynthesis" - 3 marks
4. "Role of chlorophyll" - 2 marks

📊 **EXAM STATS:** 
- **Difficulty Level:** Easy (Class 6-12)
- **Success Rate:** 98% students score full
- **Weightage:** 8-12 marks in Biology

🏆 **PRO EXAM HACKS:**
- **Never forget the "6" numbers** (Common mistake)
- **Always mention "Sunlight energy"** 
- **Connect to "Food chain base"** for extra marks
- **Draw simple diagram** for visual learners

✅ **ONE-LINE ANSWER:** "Plants eat sunlight and make food for everyone!"`;
  }

  // Generic smart content
  return analyzeAndGenerateExamContent(topic);
};

const DEFAULT_MODEL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_TUTOR_MODEL ||
  process.env.EXPO_PUBLIC_TUTOR_MODEL ||
  'google/gemini-2.0-flash-001';

// Analyze and Generate Smart Exam Content
const analyzeAndGenerateExamContent = (topic: string): string => {
  // Smart analysis of the topic
  const isScience = /biology|chemistry|physics|science|photosynthesis|respiration|genetics/i.test(topic);
  const isHistory = /history|mughal|british|independence|gandhi|nehru|ancient/i.test(topic);
  const isPolity = /constitution|government|parliament|president|democracy|rights|duties/i.test(topic);
  const isMath = /mathematics|algebra|geometry|calculus|trigonometry|statistics/i.test(topic);
  const isEconomics = /economy|gdp|inflation|budget|rbi|economic|finance/i.test(topic);

  let subject = "General";
  let examTips = "Standard exam preparation techniques";
  let memoryTricks = "Create mnemonics and patterns";
  
  if (isScience) {
    subject = "Science";
    examTips = "Draw diagrams, write equations, explain processes step-by-step";
    memoryTricks = "Use scientific acronyms and formula patterns";
  } else if (isHistory) {
    subject = "History"; 
    examTips = "Remember dates, connect cause-effect, mention key personalities";
    memoryTricks = "Timeline method, story connections, date patterns";
  } else if (isPolity) {
    subject = "Polity";
    examTips = "Mention article numbers, connect to current affairs, give examples";
    memoryTricks = "Article number patterns, constitutional acronyms";
  } else if (isMath) {
    subject = "Mathematics";
    examTips = "Show all steps, double-check calculations, practice similar problems";
    memoryTricks = "Formula shortcuts, pattern recognition, step-by-step methods";
  } else if (isEconomics) {
    subject = "Economics";
    examTips = "Use current data, mention government schemes, explain real impacts";
    memoryTricks = "Economic indicator patterns, policy acronyms";
  }

  return `🎯 **${topic.toUpperCase()} - EXAM CRUSHER MODE**

⚡ **SUBJECT:** ${subject}

🧠 **SMART MEMORY TRICKS:**
${memoryTricks}

📝 **EXAM STRATEGY:**
${examTips}

💡 **QUICK PREPARATION PLAN:**
1. **Understand core concepts** (30 minutes)
2. **Practice key questions** (20 minutes)  
3. **Memorize important points** (10 minutes)
4. **Quick revision** (5 minutes)

⭐ **SCORING TECHNIQUES:**
- Start with definitions (+1 mark)
- Give real-world examples (+2 marks)
- Draw diagrams where possible (+2 marks)
- Conclude with importance (+1 mark)

🎯 **EXAM CONFIDENCE BOOSTERS:**
- This topic appears in 80% of exams
- Average scoring: 7-9 out of 10 marks
- Easy to prepare in short time
- High probability questions available

🏆 **SUCCESS MANTRA:** 
"Smart study beats hard study - Focus on high-weightage areas!"

✅ **FINAL TIP:** Practice writing answers in exam format for best results!`;
};

// AI Processing Function
const processWithAI = async (text: string, mode: 'bollywood' | 'examcrush'): Promise<string> => {
  console.log('🤖 processWithAI called with mode:', mode);
  
  try {
    const { data } = await SupabaseService.callEdgeFunction('learn_ai', {
      model: DEFAULT_MODEL,
      temperature: mode === 'bollywood' ? 0.9 : 0.7,
      max_tokens: 1500,
      feature_type: 'ai_generation',
      metadata: { tool: 'story-learn', mode },
      messages: [
        {
          role: 'system',
          content: mode === 'bollywood' 
            ? `You are a creative Bollywood screenwriter. Transform any educational topic into an entertaining Bollywood movie-style story with:
              - Dramatic heroes and villains
              - Emotional dialogues in Hinglish
              - Dance sequences and music references
              - Educational content woven into the plot
              - Emojis and visual elements
              - Happy ending with moral lesson
              Keep it educational but super entertaining like a real Bollywood blockbuster!`
            : `You are an expert exam preparation coach for Indian competitive exams (UPSC, SSC, Banking, etc.). Transform any topic into exam-focused content with:
              - Memory tricks and mnemonics
              - Scoring shortcuts and exam hacks
              - Article numbers for legal topics
              - Important dates and facts
              - Guaranteed question patterns
              - Success rates and weightage
              - Last-minute revision tips
              Make it actionable and exam-focused for Indian students!`,
        },
        {
          role: 'user',
          content: mode === 'bollywood'
            ? `Create a Bollywood movie story to teach: ${text}`
            : `Create exam preparation content for: ${text}`,
        },
      ],
    });

    if (!data?.content) {
      throw new Error('Empty response from AI service.');
    }

    console.log('✅ Learn AI response received, length:', data.content.length);
    return data.content;
  } catch (error) {
    console.error('❌ Learn AI failed:', error);
    throw new Error('Unable to generate content. Please try again.');
  }
};

const { width, height } = Dimensions.get('window');

interface LearningMode {
  id: 'bollywood' | 'examcrush';
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  gradient: string[];
  features: string[];
  example: string;
}

const LEARNING_MODES: LearningMode[] = [
  {
    id: 'bollywood',
    title: 'Bollywood Style',
    subtitle: 'Learn through dramatic stories',
    description: 'Transform boring topics into exciting Bollywood-style dramas with heroes, villains, and plot twists!',
    icon: Film,
    gradient: ['#00D4C7', '#00B8B1'],
    features: ['Dramatic stories', 'Heroes & villains', 'Plot twists', 'Emotional connections'],
    example: 'Photosynthesis → "Meet Chlorophyll, the green hero who fights Carbon Dioxide villains to save Plant Kingdom!"',
  },
  {
    id: 'examcrush',
    title: 'Exam Crusher',
    subtitle: 'Direct exam-focused learning',
    description: 'Get straight to the point with memory tricks, shortcuts, and proven techniques to ace your exams!',
    icon: Trophy,
    gradient: ['#00B8B1', '#00D4C7'],
    features: ['Memory tricks', 'Quick shortcuts', 'Exam patterns', 'Mark-scoring tips'],
    example: 'Photosynthesis → "6CO2 + 6H2O → C6H12O6 + 6O2. Memory trick: 6-6-1-6 pattern!"',
  },
];

export default function StoryLearnScreen() {
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState<LearningMode>(LEARNING_MODES[0]);
  const [generatedStory, setGeneratedStory] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  
  // Premium features hook
  const { 
    useFeature, 
    showPremiumGate, 
    premiumGateFeature, 
    closePremiumGate, 
    isPremium 
  } = usePremiumFeatures();

  // Animation values
  const fadeIn = useSharedValue(0);
  const headerScale = useSharedValue(0.9);
  const modeScale = useSharedValue(0.9);
  const inputScale = useSharedValue(0.9);
  const progressWidth = useSharedValue(0);
  const resultOpacity = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);
  const glowIntensity = useSharedValue(0);

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Entry animations
    fadeIn.value = withTiming(1, { duration: 800 });
    headerScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    modeScale.value = withSpring(1, { damping: 12, stiffness: 120 });
    inputScale.value = withSpring(1, { damping: 10, stiffness: 130 });

    // Continuous animations
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );

    glowIntensity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  };

  const generateStory = async () => {
    if (!inputText.trim()) {
      Alert.alert('Empty Input', 'Please enter a topic or text to transform into a story!');
      return;
    }
    
    // Check if user can use story learn feature (premium gate)
    const featureAccess = await useFeature('story_learn');
    if (!featureAccess.can_access) {
      // Premium gate will be shown automatically
      return;
    }

    console.log('🎬 Story Learn - generateStory called');
    console.log('📝 Input text:', inputText);
    console.log('🎭 Selected mode:', selectedMode.id);

    setIsProcessing(true);
    setShowResult(false);
    
    // Progress animation
    progressWidth.value = withTiming(90, { duration: 3000, easing: Easing.out(Easing.exp) });

    try {
      console.log('⏳ Processing with AI...');
      // Use actual OpenAI processing
      const result = await processWithAI(inputText, selectedMode.id);
      console.log('✅ AI result received:', result.substring(0, 100) + '...');
      
      setGeneratedStory(result);
      
      // Complete progress and show result
      progressWidth.value = withTiming(100, { duration: 300 }, () => {
        runOnJS(setShowResult)(true);
        progressWidth.value = 0;
      });
      
      resultOpacity.value = withTiming(1, { duration: 600 });
      Vibration.vibrate([50, 100, 50]);
      
    } catch (error) {
      console.error('❌ Error generating story:', error);
      // Provide more specific error messages
      let errorMessage = 'Failed to generate story. ';
      if ((error as any)?.message?.includes('401')) {
        errorMessage += 'API authentication failed. Please check your API keys.';
      } else if ((error as any)?.message?.includes('Unable to generate')) {
        errorMessage += 'Both OpenAI and Grok APIs are unavailable. Please ensure your API keys are configured correctly.';
      } else {
        errorMessage += (error as any)?.message || 'Unknown error occurred.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsProcessing(false);
      console.log('⏹️ Story generation finished');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ scale: headerScale.value }],
  }));

  const animatedModeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modeScale.value }],
  }));

  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const resultAnimatedStyle = useAnimatedStyle(() => ({
    opacity: resultOpacity.value,
    transform: [{ translateY: interpolate(resultOpacity.value, [0, 1], [20, 0]) }],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.3 + glowIntensity.value * 0.4,
    shadowRadius: 20 + glowIntensity.value * 30,
  }));

  return (
    <LinearGradient
      colors={[
        '#0A0F1A',
        '#101726',
        '#1A2333',
      ]}
      style={styles.container}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <Animated.View style={[styles.header, animatedHeaderStyle]}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={1} >
              <LinearGradient
                colors={['#101726', '#0A0F1A']}
                style={styles.backButtonGradient}
              >
                <ChevronLeft size={24} color={'#FFFFFF'} />
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.title}>Story Learn</Text>
              <Text style={styles.subtitle}>Transform any topic into memorable stories</Text>
            </View>
            
            <Animated.View style={[styles.headerIcon, sparkleAnimatedStyle]}>
              <LinearGradient
                colors={['#00D4C7', '#00B8B1']}
                style={styles.headerIconGradient}
              >
                <Sparkles size={24} color={'#FFFFFF'} />
              </LinearGradient>
            </Animated.View>
          </Animated.View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Mode Selection */}
            <Animated.View style={[styles.modesSection, animatedModeStyle]}>
              <Text style={styles.sectionTitle}>Choose Your Learning Style</Text>
              
              <View style={styles.modesContainer}>
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
                      <mode.icon size={32} color={'#FFFFFF'} />
                      <Text style={styles.modeTitle}>{mode.title}</Text>
                      <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
                      
                      {selectedMode.id === mode.id && (
                        <View style={styles.selectedBadge}>
                          <FontAwesome5 name="check-circle" size={20} color={'#FFFFFF'} solid />
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Selected Mode Description */}
              <View style={styles.modeDescription}>
                <Text style={styles.descriptionTitle}>{selectedMode.title}</Text>
                <Text style={styles.descriptionText}>{selectedMode.description}</Text>
                
                <View style={styles.featuresList}>
                  {selectedMode.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <FontAwesome5 name="star" size={12} color={theme.colors.accent.yellow} solid />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleLabel}>Example:</Text>
                  <Text style={styles.exampleText}>{selectedMode.example}</Text>
                </View>
              </View>
            </Animated.View>

            {/* Input Section */}
            <Animated.View style={[styles.inputSection, animatedInputStyle, glowAnimatedStyle]}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>Enter Your Topic or Text</Text>
                <View style={styles.inputActions}>
                  <TouchableOpacity style={styles.inputAction} activeOpacity={1} >
                    <Camera size={20} color={'#8FA1B4'} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inputAction} activeOpacity={1} >
                    <Mic size={20} color={'#8FA1B4'} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inputAction} activeOpacity={1} >
                    <FileText size={20} color={'#8FA1B4'} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="Type any topic like 'Photosynthesis', 'Indian Constitution', or paste your text here..."
                placeholderTextColor={'#8FA1B4'}
                value={inputText}
                onChangeText={setInputText}
                maxLength={3000}
              />
              
              <View style={styles.inputFooter}>
                <Text style={styles.charCount}>{inputText.length}/3000</Text>
                {inputText.length > 0 && (
                  <TouchableOpacity activeOpacity={1} onPress={() => setInputText('')}>
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>

            {/* Generate Button */}
            <View style={styles.actionSection}>
              <GradientButton
                title={isProcessing ? "Creating Story..." : `Create ${selectedMode.title}`}
                onPress={generateStory}
                size="large"
                fullWidth
                disabled={!inputText.trim() || isProcessing}
                icon={isProcessing ? (
                  <ActivityIndicator size="small" color={theme.colors.text.primary} />
                ) : selectedMode.id === 'bollywood' ? (
                  <Film size={20} color={theme.colors.text.primary} />
                ) : (
                  <Trophy size={20} color={theme.colors.text.primary} />
                )}
                colors={selectedMode.gradient}
              />
              
              {isProcessing && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
                  </View>
                  <Text style={styles.progressText}>
                    {selectedMode.id === 'bollywood' ? 'Writing Bollywood script...' : 'Preparing exam strategy...'}
                  </Text>
                </View>
              )}
            </View>

            {/* Result Section */}
            {showResult && (
              <Animated.View style={[styles.resultSection, resultAnimatedStyle]}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>
                    {selectedMode.id === 'bollywood' ? '🎬 Your Bollywood Story' : '🎯 Exam Crusher Content'}
                  </Text>
                  <View style={styles.resultActions}>
                    <TouchableOpacity style={styles.resultAction} activeOpacity={1} >
                      <Copy size={20} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.resultAction} activeOpacity={1} >
                      <Share2 size={20} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.resultAction}
                      activeOpacity={1} onPress={() => setReadingMode(true)}
                    >
                      <Eye size={20} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <ScrollView style={styles.resultContent} nestedScrollEnabled>
                  <MarkdownRenderer content={generatedStory} />
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

      {/* Reading Mode Overlay */}
      {readingMode && (
        <View style={styles.readingOverlay}>
          <SafeAreaView style={styles.readingContainer}>
            <View style={styles.readingHeader}>
              <Text style={styles.readingTitle}>Reading Mode</Text>
              <TouchableOpacity activeOpacity={1} onPress={() => setReadingMode(false)}>
                <FontAwesome5 name="times" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.readingContent}>
              <MarkdownRenderer content={generatedStory} style={styles.readingText} />
            </ScrollView>
          </SafeAreaView>
        </View>
      )}
      <PremiumGateModal
        visible={showPremiumGate}
        onClose={closePremiumGate}
        onUpgrade={() => {
          closePremiumGate();
          router.push('/subscription');
        }}
        featureName={premiumGateFeature || 'story_learn'}
      />
    </LinearGradient>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  backButtonGradient: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.caption,
    color: '#8FA1B4',
    marginTop: theme.spacing.xs,
  },
  headerIcon: {
    shadowColor: theme.colors.accent.gold,
    shadowOffset: { width: 0, height: 0 },
  },
  headerIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  modesSection: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.subheading,
    color: '#FFFFFF',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  modesContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  modeCard: {
    flex: 1,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
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
    fontSize: 18,
    fontFamily: theme.fonts.subheading,
    color: '#FFFFFF',
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  modeSubtitle: {
    fontSize: 12,
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
  modeDescription: {
    backgroundColor: '#101726',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  descriptionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.subheading,
    color: '#FFFFFF',
    marginBottom: theme.spacing.sm,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: '#8FA1B4',
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  featuresList: {
    marginBottom: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  featureText: {
    fontSize: 14,
    fontFamily: theme.fonts.caption,
    color: '#8FA1B4',
  },
  exampleBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent.yellow,
  },
  exampleLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.caption,
    color: '#00D4C7',
    marginBottom: theme.spacing.xs,
  },
  exampleText: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: '#FFFFFF',
    fontStyle: 'italic',
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
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.subheading,
    color: '#FFFFFF',
  },
  inputActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  inputAction: {
    padding: theme.spacing.sm,
  },
  textInput: {
    minHeight: 100,
    maxHeight: 180,
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: '#FFFFFF',
    textAlignVertical: 'top',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  charCount: {
    fontSize: 12,
    fontFamily: theme.fonts.caption,
    color: '#8FA1B4',
  },
  clearText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: '#00D4C7',
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
    backgroundColor: '#00D4C7',
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
    marginBottom: theme.spacing.md,
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
  resultText: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.text.primary,
    lineHeight: 24,
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
  readingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0F1A',
    zIndex: 1000,
  },
  readingContainer: {
    flex: 1,
  },
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  readingTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: '#FFFFFF',
  },
  readingContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  readingText: {
    fontSize: 18,
    fontFamily: theme.fonts.body,
    color: '#FFFFFF',
    lineHeight: 28,
  },
});

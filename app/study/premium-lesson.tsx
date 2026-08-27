// 🎓 Premium Lesson Interface - World-class Material Design with Gluestack UI
import React, { useState, useRef, useEffect } from 'react';
import {
  StatusBar,
  ScrollView,
  Animated,
  Dimensions,
  Pressable,
  Alert,
  BackHandler,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  Box, 
  Text, 
  Button, 
  VStack, 
  HStack, 
  Center,
  Icon,
  Divider,
  Fab,
  FabIcon,
  Progress,
  ProgressFilledTrack,
  Badge,
  BadgeText,
  Avatar,
  AvatarImage,
  AvatarFallbackText,
  Card,
  CardHeader,
  CardBody,
  LinearGradient,
  Heading,
} from '@gluestack-ui/themed';
import { 
  ArrowLeft, 
  BookOpen, 
  Heart, 
  Focus, 
  Zap, 
  Target,
  CheckCircle,
  Star,
  Share,
  Bookmark,
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Settings,
  MessageCircle,
} from 'lucide-react-native';
import { 
  MGCard,
  MGGlassCard, 
  MGTopBarShell,
  MGSectionTitle,
  MGChip,
  MGChipText,
  MGStatBadge,
  MGStatValue,
  MGStatLabel,
} from '@/components/ui/MindGainsPrimitives';
import { theme } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

// Mock lesson data - replace with real content
const LESSON_DATA = {
  id: 'focus-mastery',
  title: 'Focus & Concentration Mastery',
  subject: 'Psychology',
  duration: 15,
  difficulty: 'Intermediate',
  points: 250,
  progress: 65,
  sections: [
    {
      id: 1,
      title: 'Understanding Focus',
      content: `Focus is the cognitive process of selectively concentrating on one aspect of information while filtering out other perceivable information. It's like a mental spotlight that illuminates what's important while dimming distractions.

In today's hyperconnected world, maintaining focus has become both more critical and more challenging than ever before. Research shows that the average person checks their phone 96 times per day, fundamentally rewiring our brain's attention circuits.

The neuroscience of focus involves the prefrontal cortex, which acts as the brain's CEO, making decisions about what deserves attention. When we focus, this region coordinates with other brain areas to maintain sustained attention on our chosen target.`,
      keyPoints: [
        'Focus is selective attention to relevant information',
        'Digital distractions rewire our attention circuits',
        'Prefrontal cortex coordinates focused attention',
        'Practice strengthens neural attention pathways',
      ],
      completed: true,
    },
    {
      id: 2,
      title: 'The Science of Concentration',
      content: `Concentration involves sustained attention over time. Unlike focus, which can be momentary, concentration requires maintaining cognitive effort for extended periods.

Studies reveal that our brains operate in two main modes: focused attention and default mode. The default mode network (DMN) activates when we're not actively concentrating, often leading to mind-wandering.

Flow states represent peak concentration where time seems to disappear and performance peaks. Research by Mihaly Csikszentmihalyi shows that flow occurs when challenge and skill are optimally balanced.`,
      keyPoints: [
        'Concentration = sustained attention over time',
        'Default mode network causes mind-wandering',
        'Flow states optimize performance and experience',
        'Challenge-skill balance triggers flow',
      ],
      completed: false,
    },
    {
      id: 3,
      title: 'Practical Focus Techniques',
      content: `The Pomodoro Technique breaks work into 25-minute focused intervals followed by 5-minute breaks. This leverages our natural attention cycles and prevents mental fatigue.

Meditation trains the attention muscle. Just 10 minutes daily of mindfulness practice can significantly improve sustained attention within 8 weeks.

Environment design matters crucially. Research shows that visual complexity reduces focus, while organized, minimal environments enhance concentration by up to 42%.`,
      keyPoints: [
        'Pomodoro Technique optimizes attention cycles',
        'Daily meditation strengthens attention muscle',
        'Minimal environments boost focus by 42%',
        'Regular breaks prevent mental fatigue',
      ],
      completed: false,
    },
  ],
  relatedLessons: [
    { id: 'memory-palace', title: 'Memory Palace Techniques', difficulty: 'Advanced' },
    { id: 'stress-management', title: 'Stress & Performance', difficulty: 'Beginner' },
    { id: 'peak-performance', title: 'Peak Performance States', difficulty: 'Expert' },
  ],
};

export default function PremiumLessonInterface() {
  const params = useLocalSearchParams();
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(1.0);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const progressAnim = useRef(new Animated.Value(LESSON_DATA.progress)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      handleExit();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const handleExit = () => {
    Alert.alert(
      "Save Progress?",
      "Your progress will be automatically saved.",
      [
        { text: "Continue Learning", style: "cancel" },
        { text: "Exit", onPress: () => router.back() },
      ]
    );
  };

  const handleSectionComplete = (sectionId: number) => {
    LESSON_DATA.sections[sectionId].completed = true;
    const newProgress = ((sectionId + 1) / LESSON_DATA.sections.length) * 100;
    
    Animated.timing(progressAnim, {
      toValue: newProgress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  };

  const nextSection = () => {
    if (currentSection < LESSON_DATA.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const currentSectionData = LESSON_DATA.sections[currentSection];

  return (
    <Box flex={1} bg={isDarkMode ? "$coolGray900" : "$coolGray50"}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor="transparent" 
        translucent 
      />
      
      {/* Premium Top Bar with Material Design elevation */}
      <LinearGradient
        colors={isDarkMode 
          ? ['rgba(15,23,42,0.95)', 'rgba(30,41,59,0.9)'] 
          : ['rgba(248,250,252,0.95)', 'rgba(241,245,249,0.9)']
        }
        style={{
          paddingTop: StatusBar.currentHeight || 40,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }}
      >
        <HStack 
          alignItems="center" 
          justifyContent="space-between" 
          px="$4" 
          py="$3"
        >
          {/* Left Section */}
          <HStack alignItems="center" space="md">
            <Pressable onPress={handleExit}>
              <Box 
                bg="rgba(255,255,255,0.1)" 
                p="$2" 
                borderRadius="$full"
                borderWidth={1}
                borderColor="rgba(255,255,255,0.2)"
              >
                <Icon as={ArrowLeft} size="lg" color="$white" />
              </Box>
            </Pressable>
            
            <VStack>
              <Heading size="md" color="$white" fontWeight="$bold">
                {LESSON_DATA.title}
              </Heading>
              <Text size="sm" color="rgba(255,255,255,0.7)">
                {LESSON_DATA.subject} • {LESSON_DATA.duration} min
              </Text>
            </VStack>
          </HStack>

          {/* Right Section */}
          <HStack alignItems="center" space="sm">
            <Pressable onPress={() => setIsBookmarked(!isBookmarked)}>
              <Icon 
                as={Bookmark} 
                size="md" 
                color={isBookmarked ? "$amber400" : "rgba(255,255,255,0.7)"} 
              />
            </Pressable>
            
            <Pressable onPress={() => setShowNotes(!showNotes)}>
              <Icon as={MessageCircle} size="md" color="rgba(255,255,255,0.7)" />
            </Pressable>
            
            <Pressable>
              <Icon as={Share} size="md" color="rgba(255,255,255,0.7)" />
            </Pressable>
          </HStack>
        </HStack>
        
        {/* Progress Bar */}
        <Box px="$4" pb="$3">
          <HStack alignItems="center" justifyContent="space-between" mb="$2">
            <Text size="xs" color="rgba(255,255,255,0.6)">
              Section {currentSection + 1} of {LESSON_DATA.sections.length}
            </Text>
            <Text size="xs" color="$amber400" fontWeight="$semibold">
              {Math.round((currentSection + 1) / LESSON_DATA.sections.length * 100)}% Complete
            </Text>
          </HStack>
          
          <Progress value={(currentSection + 1) / LESSON_DATA.sections.length * 100} size="sm">
            <ProgressFilledTrack 
              bg="linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)" 
            />
          </Progress>
        </Box>
      </LinearGradient>

      {/* Main Content Area */}
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Section Header Card */}
          <MGGlassCard mb="$4">
            <HStack alignItems="center" justifyContent="space-between" mb="$3">
              <VStack flex={1}>
                <HStack alignItems="center" space="sm" mb="$2">
                  <Badge 
                    size="sm" 
                    variant="solid" 
                    bg="$emerald500"
                    borderRadius="$full"
                  >
                    <BadgeText color="$white" fontSize="$xs">
                      {currentSectionData.completed ? 'COMPLETED' : 'IN PROGRESS'}
                    </BadgeText>
                  </Badge>
                  
                  <Text size="xs" color="rgba(255,255,255,0.6)">
                    {Math.ceil(currentSectionData.content.length / 200)} min read
                  </Text>
                </HStack>
                
                <Heading size="lg" color="$white" fontWeight="$bold" mb="$1">
                  {currentSectionData.title}
                </Heading>
              </VStack>
              
              {/* Audio Controls */}
              <HStack space="sm">
                <Pressable onPress={() => setIsPlaying(!isPlaying)}>
                  <Box 
                    bg="$blue500" 
                    p="$3" 
                    borderRadius="$full"
                    shadowColor="$blue500"
                    shadowOffset={{ width: 0, height: 4 }}
                    shadowOpacity={0.3}
                    shadowRadius={8}
                    elevation={8}
                  >
                    <Icon 
                      as={isPlaying ? PauseCircle : PlayCircle} 
                      size="lg" 
                      color="$white" 
                    />
                  </Box>
                </Pressable>
                
                <Pressable onPress={() => setIsMuted(!isMuted)}>
                  <Box 
                    bg="rgba(255,255,255,0.1)" 
                    p="$3" 
                    borderRadius="$full"
                    borderWidth={1}
                    borderColor="rgba(255,255,255,0.2)"
                  >
                    <Icon 
                      as={isMuted ? VolumeX : Volume2} 
                      size="md" 
                      color="$white" 
                    />
                  </Box>
                </Pressable>
              </HStack>
            </HStack>
          </MGGlassCard>

          {/* Main Content Card */}
          <MGCard mb="$4">
            <Text 
              size="md" 
              color="$coolGray100" 
              lineHeight="$xl"
              fontWeight="$normal"
              letterSpacing="$sm"
            >
              {currentSectionData.content}
            </Text>
          </MGCard>

          {/* Key Points Card */}
          <MGGlassCard mb="$4">
            <HStack alignItems="center" mb="$3">
              <Icon as={Target} size="sm" color="$amber400" mr="$2" />
              <Heading size="sm" color="$white" fontWeight="$semibold">
                Key Takeaways
              </Heading>
            </HStack>
            
            <VStack space="sm">
              {currentSectionData.keyPoints.map((point, index) => (
                <HStack key={index} alignItems="flex-start" space="sm">
                  <Box 
                    w="$6" 
                    h="$6" 
                    bg="$emerald500" 
                    borderRadius="$full"
                    alignItems="center"
                    justifyContent="center"
                    mt="$1"
                  >
                    <Text size="xs" color="$white" fontWeight="$bold">
                      {index + 1}
                    </Text>
                  </Box>
                  <Text 
                    size="sm" 
                    color="$coolGray200" 
                    flex={1}
                    lineHeight="$lg"
                  >
                    {point}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </MGGlassCard>

          {/* Progress Stats */}
          <HStack space="md" mb="$6">
            <MGStatBadge>
              <MGStatValue>{LESSON_DATA.points}</MGStatValue>
              <MGStatLabel>XP Points</MGStatLabel>
            </MGStatBadge>
            
            <MGStatBadge>
              <MGStatValue>{currentSection + 1}/{LESSON_DATA.sections.length}</MGStatValue>
              <MGStatLabel>Sections</MGStatLabel>
            </MGStatBadge>
            
            <MGStatBadge>
              <MGStatValue>{LESSON_DATA.difficulty}</MGStatValue>
              <MGStatLabel>Level</MGStatLabel>
            </MGStatBadge>
          </HStack>

          {/* Related Lessons */}
          <VStack space="md">
            <HStack alignItems="center" mb="$2">
              <Icon as={BookOpen} size="sm" color="$blue400" mr="$2" />
              <Heading size="sm" color="$white" fontWeight="$semibold">
                Continue Learning
              </Heading>
            </HStack>
            
            {LESSON_DATA.relatedLessons.map((lesson, index) => (
              <Pressable key={lesson.id}>
                <MGGlassCard>
                  <HStack alignItems="center" justifyContent="space-between">
                    <VStack flex={1}>
                      <Text size="sm" color="$white" fontWeight="$semibold" mb="$1">
                        {lesson.title}
                      </Text>
                      <Badge size="sm" variant="outline" alignSelf="flex-start">
                        <BadgeText color="$blue400" fontSize="$xs">
                          {lesson.difficulty}
                        </BadgeText>
                      </Badge>
                    </VStack>
                    <Icon as={ArrowLeft} size="sm" color="$coolGray400" style={{ transform: [{ rotate: '180deg' }] }} />
                  </HStack>
                </MGGlassCard>
              </Pressable>
            ))}
          </VStack>
        </Animated.View>
      </ScrollView>

      {/* Bottom Navigation with Material Design FAB */}
      <Box 
        position="absolute" 
        bottom="$0" 
        left="$0" 
        right="$0"
        bg="rgba(15,23,42,0.95)"
        borderTopWidth={1}
        borderTopColor="rgba(255,255,255,0.1)"
        py="$3"
        px="$4"
      >
        <HStack alignItems="center" justifyContent="space-between">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="md"
            borderColor="rgba(255,255,255,0.2)"
            bg="rgba(255,255,255,0.05)"
            onPress={prevSection}
            disabled={currentSection === 0}
            opacity={currentSection === 0 ? 0.5 : 1}
          >
            <HStack alignItems="center" space="sm">
              <Icon as={ArrowLeft} size="sm" color="$white" />
              <Text color="$white" fontWeight="$semibold">Previous</Text>
            </HStack>
          </Button>

          {/* Section Indicator */}
          <HStack space="xs">
            {LESSON_DATA.sections.map((_, index) => (
              <Box
                key={index}
                w="$2"
                h="$2"
                borderRadius="$full"
                bg={index === currentSection ? "$blue500" : 
                    index < currentSection ? "$emerald500" : 
                    "rgba(255,255,255,0.3)"}
              />
            ))}
          </HStack>

          {/* Next/Complete Button */}
          <Button
            variant="solid"
            size="md"
            bg="linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%)"
            onPress={currentSection === LESSON_DATA.sections.length - 1 ? 
              () => handleSectionComplete(currentSection) : nextSection}
          >
            <HStack alignItems="center" space="sm">
              <Text color="$white" fontWeight="$semibold">
                {currentSection === LESSON_DATA.sections.length - 1 ? 'Complete' : 'Next'}
              </Text>
              <Icon 
                as={currentSection === LESSON_DATA.sections.length - 1 ? CheckCircle : ArrowLeft} 
                size="sm" 
                color="$white" 
                style={currentSection !== LESSON_DATA.sections.length - 1 ? 
                  { transform: [{ rotate: '180deg' }] } : undefined}
              />
            </HStack>
          </Button>
        </HStack>
      </Box>

      {/* Floating Action Button for Quick Actions */}
      <Fab
        size="md"
        placement="bottom right"
        bg="$amber500"
        shadowColor="$amber500"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.3}
        shadowRadius={12}
        elevation={12}
        mr="$4"
        mb="$20"
      >
        <FabIcon as={Star} color="$white" />
      </Fab>
    </Box>
  );
}
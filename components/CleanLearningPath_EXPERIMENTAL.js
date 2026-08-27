// 🎮 Adventure Quest Learning Map - Viral Game Experience
import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Vibration,
  Alert,
  Image,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import Svg, { Path, Ellipse, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Audio } from 'expo-av';
import { RewardService } from '@/services/rewardService';
// Temporarily disabled Rive imports for Expo compatibility
// import WebRiveChest from './WebRiveChest';
// import RiveChestNative from './RiveChestNative';

const { width: W, height: H } = Dimensions.get('window');

const QUEST_COLORS = {
  // Adventure Map Theme
  mysticTeal: '#00D4C7',
  deepOcean: '#0A0F1A', 
  islandGreen: '#48C586',
  treasureGold: '#FFD76F',
  magicPurple: '#8B5CF6',
  fireOrange: '#F97316',
  iceBlue: '#60A5FA',
  shadowGray: '#374151',
  
  // Progression States
  locked: '#4B5563',
  available: '#10B981',
  active: '#3B82F6',
  completed: '#F59E0B',
  mastered: '#8B5CF6',
  
  // Island Types
  grassland: ['#34D399', '#059669'],
  volcano: ['#F87171', '#DC2626'],
  crystal: ['#A78BFA', '#7C3AED'],
  desert: ['#FBBF24', '#D97706'],
  arctic: ['#93C5FD', '#2563EB'],
};

// 🏝️ Enhanced Quest Island Component - Premium Learning Territory
const QuestIsland = ({ lesson = {}, position = { x: 0, y: 0 }, isUnlocked = false, isActive = false, onPress = () => {}, animValue }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Continuous floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -12, duration: 3000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 12, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
    
    // Enhanced pulse for active islands
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    }

    // Shine sweep effect for unlocked islands
    if (isUnlocked) {
      Animated.loop(
        Animated.sequence([
          Animated.delay(Math.random() * 3000),
          Animated.timing(shineAnim, { 
            toValue: 1, 
            duration: 1500, 
            useNativeDriver: true 
          }),
          Animated.timing(shineAnim, { 
            toValue: 0, 
            duration: 500, 
            useNativeDriver: true 
          }),
        ])
      ).start();
    }

    // Sparkle animation for completed lessons
    if (lesson?.completed) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, { 
            toValue: 1, 
            duration: 2000, 
            useNativeDriver: true 
          }),
          Animated.delay(1000),
          Animated.timing(sparkleAnim, { 
            toValue: 0, 
            duration: 1000, 
            useNativeDriver: true 
          }),
        ])
      ).start();
    }
  }, [isActive, isUnlocked, lesson?.completed]);

  const getIslandType = () => {
    const types = ['grassland', 'volcano', 'crystal', 'desert', 'arctic'];
    const lessonId = lesson?.id || 0;
    return types[lessonId % types.length];
  };

  const getIslandIcon = () => {
    const islandType = getIslandType();
    const icons = {
      grassland: 'tree',
      volcano: 'fire',
      crystal: 'gem',
      desert: 'sun',
      arctic: 'snowflake'
    };
    return icons[islandType] || 'tree';
  };

  const getProgressColor = () => {
    if (!isUnlocked) return UNIFIED_QUEST_COLORS.locked;
    if (lesson?.isCompleted) return QUEST_COLORS.completed;
    if (isActive) return QUEST_COLORS.active;
    return QUEST_COLORS.available;
  };

  const shineOpacity = shineAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 0]
  });

  const sparkleRotation = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Animated.View 
      style={[
        styles.questIsland,
        {
          left: position.x - 35, // Center the 70px wide island
          top: position.y - 35,  // Center the 70px tall island
          transform: [
            { translateY: floatAnim },
            { scale: pulseAnim },
            { scale: animValue }
          ]
        }
      ]}
    >
      {/* Enhanced Sparkle Ring for Completed Lessons */}
      {lesson?.completed && (
        <Animated.View
          style={[
            questStyles.sparkleRing,
            {
              opacity: sparkleAnim,
              transform: [{ rotate: sparkleRotation }]
            }
          ]}
        >
          <View style={[questStyles.sparkle, { top: 5, left: '50%', marginLeft: -2 }]} />
          <View style={[questStyles.sparkle, { top: '50%', right: 5, marginTop: -2 }]} />
          <View style={[questStyles.sparkle, { bottom: 5, left: '50%', marginLeft: -2 }]} />
          <View style={[questStyles.sparkle, { top: '50%', left: 5, marginTop: -2 }]} />
        </Animated.View>
      )}

      <TouchableOpacity 
        onPress={() => isUnlocked && onPress(lesson)}
        disabled={!isUnlocked}
        activeOpacity={0.8}
        style={questStyles.islandTouchable}
      >
        {/* Enhanced Island Base */}
        <Svg width={70} height={70} style={styles.islandSvg}>
          <Defs>
            <RadialGradient id={`island-${lesson?.id || 0}`} cx="50%" cy="30%">
              <Stop offset="0%" stopColor={QUEST_COLORS[getIslandType()]?.[0] || QUEST_COLORS.grassland[0]} />
              <Stop offset="100%" stopColor={QUEST_COLORS[getIslandType()]?.[1] || QUEST_COLORS.grassland[1]} />
            </RadialGradient>
          </Defs>
          
          {/* Enhanced Island Shadow */}
          <Ellipse cx={35} cy={62} rx={32} ry={8} fill="rgba(0,0,0,0.4)" />
          
          {/* Main Island with Enhanced Border */}
          <Circle 
            cx={35} 
            cy={35} 
            r={28} 
            fill={`url(#island-${lesson?.id || 0})`}
            stroke={getProgressColor()}
            strokeWidth={isActive ? 3 : 2.5}
            opacity={isUnlocked ? 1 : 0.4}
          />
          
          {/* Shine Sweep Effect */}
          {isUnlocked && (
            <Animated.View
              style={[
                questStyles.islandShine,
                {
                  opacity: shineOpacity,
                  transform: [{ rotate: '45deg' }]
                }
              ]}
            />
          )}
          
          {/* Enhanced Glow Effect for Active Islands */}
          {isActive && (
            <>
              <Circle 
                cx={35} 
                cy={35} 
                r={33} 
                fill="none"
                stroke={QUEST_COLORS.mysticTeal}
                strokeWidth={2}
                opacity={0.8}
              />
              <Circle 
                cx={35} 
                cy={35} 
                r={38} 
                fill="none"
                stroke={QUEST_COLORS.mysticTeal}
                strokeWidth={1}
                opacity={0.4}
              />
            </>
          )}
        </Svg>

        {/* Island Content */}
        <View style={styles.islandContent}>
          <FontAwesome5 
            name={getIslandIcon()} 
            size={24} 
            color={isUnlocked ? '#FFFFFF' : '#6B7280'}
            style={questStyles.islandIcon}
          />
          
          {/* Quest Level */}
          <View style={[questStyles.questLevel, { backgroundColor: getProgressColor() }]}>
            <Text style={questStyles.questLevelText}>{(lesson?.id || 0) + 1}</Text>
          </View>
          
          {/* Completion Stars */}
          {lesson?.isCompleted && (
            <View style={questStyles.completionStars}>
              {[1, 2, 3].map(star => (
                <FontAwesome5 
                  key={star}
                  name="star" 
                  size={8} 
                  color={QUEST_COLORS.treasureGold} 
                  solid
                />
              ))}
            </View>
          )}
          
          {/* Lock Overlay */}
          {!isUnlocked && (
            <View style={questStyles.lockOverlay}>
              <FontAwesome5 name="lock" size={20} color="#6B7280" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 🧭 Quest Path Connector - Animated Trails Between Islands
const QuestPath = ({ start = { x: 0, y: 0 }, end = { x: 0, y: 0 }, isUnlocked = false, progress = 0 }) => {
  const pathAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (isUnlocked) {
      Animated.timing(pathAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [isUnlocked]);

  const pathLength = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );

  return (
    <Animated.View 
      style={[
        styles.questPath,
        {
          left: start.x + 40,
          top: start.y + 40,
          width: pathLength,
          transform: [
            { 
              rotate: `${Math.atan2(end.y - start.y, end.x - start.x)}rad` 
            }
          ]
        }
      ]}
    >
      <Animated.View 
        style={[
          styles.pathLine,
          {
            width: pathAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, pathLength]
            }),
            backgroundColor: isUnlocked ? QUEST_COLORS.mysticTeal : QUEST_COLORS.locked
          }
        ]}
      />
      
      {/* Animated Particles */}
      {isUnlocked && (
        <View style={styles.pathParticles}>
          {[1, 2, 3].map(particle => (
            <Animated.View
              key={particle}
              style={[
                styles.pathParticle,
                {
                  left: (pathLength / 4) * particle,
                }
              ]}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
};

// Professional SVG Speech Bubble Component
const QuestBubble = ({ text, pointDirection = 'left', width = 70, height = 28 }) => {
  const tailOffset = 12;
  const borderRadius = 12;
  
  // Create perfect rounded rectangle with speech bubble tail
  const bubblePath = pointDirection === 'left' 
    ? // Left-pointing tail
      `M ${borderRadius} 0
       L ${width - borderRadius} 0
       Q ${width} 0 ${width} ${borderRadius}
       L ${width} ${height - borderRadius}
       Q ${width} ${height} ${width - borderRadius} ${height}
       L ${tailOffset + 8} ${height}
       L ${tailOffset} ${height + 6}
       L ${tailOffset + 4} ${height}
       L ${borderRadius} ${height}
       Q 0 ${height} 0 ${height - borderRadius}
       L 0 ${borderRadius}
       Q 0 0 ${borderRadius} 0 Z`
    : // Right-pointing tail  
      `M ${borderRadius} 0
       L ${width - borderRadius} 0
       Q ${width} 0 ${width} ${borderRadius}
       L ${width} ${height - borderRadius}
       Q ${width} ${height} ${width - borderRadius} ${height}
       L ${width - tailOffset - 4} ${height}
       L ${width - tailOffset} ${height + 6}
       L ${width - tailOffset - 8} ${height}
       L ${borderRadius} ${height}
       Q 0 ${height} 0 ${height - borderRadius}
       L 0 ${borderRadius}
       Q 0 0 ${borderRadius} 0 Z`;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={width + 4} height={height + 8} style={{ position: 'absolute' }}>
        <Path
          d={bubblePath}
          fill={QUEST_COLORS.mysticTeal}
          stroke="#FFFFFF"
          strokeWidth={1.5}
        />
      </Svg>
      <View style={{
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
      }}>
        <Text style={{
          color: '#FFFFFF',
          fontSize: 10,
          fontWeight: '700',
          textAlign: 'center',
          lineHeight: 12,
        }}>
          {text}
        </Text>
      </View>
    </View>
  );
};


// Temporary fallback chest component until Rive is properly configured
const ChestComponent = ({ topicIndex, item, lessons, index }) => {
  const topicStartIndex = Math.floor(index / 5) * 5;
  const topicLessons = lessons.slice(topicStartIndex, topicStartIndex + 5);
  const isUnlocked = topicLessons.every(lesson => lesson.status === 'completed');
  const { width: screenWidth } = Dimensions.get('window');

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        if (isUnlocked) {
          console.log('🎁 Chest opened! (Rive temporarily disabled)');
          Alert.alert('Treasure Chest', 'Congratulations! You completed this topic! 🎉');
        }
      }}
      style={{
        position: 'absolute',
        bottom: 135,
        left: topicIndex % 2 === 0 ? -60 : screenWidth - 140,
        alignItems: 'center',
        zIndex: 10,
      }}
    >
      <View style={{
        width: 120,
        height: 120,
        transform: [{ scaleX: topicIndex % 2 === 0 ? 1 : -1 }]
      }}>
        <LinearGradient
          colors={isUnlocked ? ['#FFD700', '#FFA500'] : ['#666666', '#444444']}
          style={{
            width: 120,
            height: 120,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <Text style={{ fontSize: 48 }}>
            {isUnlocked ? '🎁' : '🔒'}
          </Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

export default function CleanLearningPath({
  topics = [],
  lessons = [],
  currentLessonId,
  onOpenLesson,
  onScroll = null,
  refreshControl = null,
  onLessonComplete = null,
  xpBarPosition = { x: 50, y: 50 },
}) {
  const scrollRef = useRef(null);
  const [pressedIndex, setPressedIndex] = useState(null);
  const animatedValues = useRef({});
  
  // Play daystreak sound for rewards
  const playRewardSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/daystreak.mp3')
      );
      await sound.playAsync();
      setTimeout(() => {
        sound.unloadAsync();
      }, 3000);
    } catch (error) {
      console.log('Error playing reward sound:', error);
    }
  };
  
  // State for reward overlay
  const [showRewardOverlay, setShowRewardOverlay] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [claimedRewards, setClaimedRewards] = useState(new Set());
  const [userStats, setUserStats] = useState(null);
  const [eligibleLessons, setEligibleLessons] = useState(new Set());
  
  // Trophy animation for rewards  
  const triggerTrophyAnimation = (amount) => {
    setRewardAmount(amount);
    setShowRewardOverlay(true);
    console.log('🏆 Trophy animation triggered for', amount, 'MG');
  };
  
  // Quest Animation State
  const [questAnimation, setQuestAnimation] = useState({
    visible: false,
    startPosition: { x: 0, y: 0 },
    endPosition: { x: 0, y: 0 },
    xpAmount: 35,
  });

  // Quest Map State
  const [activeIsland, setActiveIsland] = useState(null);
  const [unlockedIslands, setUnlockedIslands] = useState(new Set([0])); // First island unlocked

  // Generate proper learning path layout with topics and lessons
  const learningPathStructure = useMemo(() => {
    if (!lessons || !Array.isArray(lessons) || lessons.length === 0) {
      return [];
    }
    
    // Group lessons by topic
    const topicGroups = {};
    lessons.forEach(lesson => {
      const topicId = lesson.topicId || 'general';
      const topicTitle = lesson.topicTitle || 'General Topics';
      
      if (!topicGroups[topicId]) {
        topicGroups[topicId] = {
          id: topicId,
          title: topicTitle,
          lessons: []
        };
      }
      topicGroups[topicId].lessons.push(lesson);
    });
    
    // Create clean vertical layout
    const structure = [];
    let currentIndex = 0;
    
    Object.values(topicGroups).forEach((topic, topicIndex) => {
      // Add topic header
      structure.push({
        type: 'topic',
        id: topic.id,
        title: topic.title,
        index: currentIndex++,
        lessons: topic.lessons
      });
      
      // Add lessons for this topic
      topic.lessons.forEach((lesson, lessonIndex) => {
        structure.push({
          type: 'lesson',
          ...lesson,
          // Don't override topicTitle from the original lesson data
          index: currentIndex++,
          lessonIndex: lessonIndex,
          topicIndex: topicIndex
        });
      });
    });
    
    return structure;
  }, [lessons]);

  // Quest progression logic
  const handleQuestComplete = (lessonIndex) => {
    // Unlock next island
    setUnlockedIslands(prev => new Set([...prev, lessonIndex + 1]));
    
    // Trigger XP collection animation
    const islandPosition = questIslandPositions[lessonIndex];
    if (islandPosition) {
      setQuestAnimation({
        visible: true,
        startPosition: { x: islandPosition.x + 40, y: islandPosition.y + 40 },
        endPosition: xpBarPosition,
        xpAmount: 35,
      });
      
      setTimeout(() => {
        setQuestAnimation(prev => ({ ...prev, visible: false }));
      }, 1500);
    }
    
    // Call original callback
    onLessonComplete?.(lessonIndex);
  };

  const handleIslandPress = (lesson = {}) => {
    setActiveIsland(lesson?.id || null);
    // Premium UX: Removed vibration for smoother feel
    onOpenLesson?.(lesson?.id || null);
  };

  // Game-style reward claiming with proper database integration
  const handleClaimReward = async (item) => {
    const lessonId = item.id || item.lessonId;
    
    // Prevent multiple claims using lesson ID
    if (claimedRewards.has(lessonId)) {
      console.log('Reward already claimed for lesson:', lessonId);
      return;
    }

    try {
      // Premium UX: Removed aggressive vibration for smoother feel
      
      // Check if lesson is eligible for reward (completed + not claimed)
      const isEligible = await RewardService.isLessonEligibleForReward(lessonId);
      if (!isEligible) {
        console.log('Lesson not eligible for reward:', lessonId);
        Alert.alert('Reward Not Available', 'This lesson is not eligible for reward claiming.');
        return;
      }

      // Claim reward in database
      const rewardAmount = item.xp_reward || 50;
      const result = await RewardService.claimLessonReward(lessonId, rewardAmount);
      
      if (!result.success) {
        console.error('Failed to claim reward:', result.error);
        Alert.alert('Claim Failed', result.error || 'Unable to claim reward');
        return;
      }

      // Play reward collection sound and trophy animation
      playRewardSound();
      triggerTrophyAnimation(rewardAmount);
      
      // Update local state to persist across refreshes
      setClaimedRewards(prev => new Set([...prev, lessonId]));
      
      // Update user stats
      const updatedStats = await RewardService.getUserStats();
      setUserStats(updatedStats);
      
      // Also mark on the item object for immediate UI update
      item.claimed = true;
      
      console.log('🎁 Reward claimed successfully:', { lessonId, amount: rewardAmount, totalMG: updatedStats?.total_mg_tokens });
      
    } catch (error) {
      console.error('Error claiming reward:', error);
      Alert.alert('Claim Failed', 'An unexpected error occurred. Please try again.');
    }
  };

  // Load claimed rewards and check lesson eligibility on mount
  useEffect(() => {
    const loadRewardData = async () => {
      try {
        // Load claimed rewards
        const rewards = await RewardService.getClaimedRewards();
        const claimedSet = new Set(rewards.map(reward => reward.lesson_id));
        setClaimedRewards(claimedSet);
        
        // Load user progress to check eligibility
        const progress = await RewardService.getUserProgress();
        const eligibleSet = new Set();
        
        // Check each lesson for eligibility
        for (const progressItem of progress) {
          if (progressItem.status === 'completed' && !claimedSet.has(progressItem.lesson_id)) {
            eligibleSet.add(progressItem.lesson_id);
          }
        }
        setEligibleLessons(eligibleSet);
        
        // Also load user stats
        const stats = await RewardService.getUserStats();
        setUserStats(stats);
        
        console.log('✅ Loaded reward data:', { claimed: claimedSet.size, eligible: eligibleSet.size });
      } catch (error) {
        console.error('Error loading reward data:', error);
      }
    };

    loadRewardData();
  }, []);

  // Create animated values for each lesson
  useEffect(() => {
    if (!lessons || !Array.isArray(lessons)) return;
    
    lessons.forEach((lesson, index) => {
      if (!animatedValues.current[index]) {
        animatedValues.current[index] = {
          scale: new Animated.Value(1),
          opacity: new Animated.Value(0),
          translateY: new Animated.Value(20),
        };
      }
    });

    // Entrance animation
    const animations = Object.values(animatedValues.current).map((anims, index) => 
      Animated.parallel([
        Animated.timing(anims.opacity, {
          toValue: 1,
          duration: 400,
          delay: index * 50,
          useNativeDriver: true,
        }),
        Animated.timing(anims.translateY, {
          toValue: 0,
          duration: 400,
          delay: index * 50,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(50, animations).start();
  }, [lessons]);

  // Track if initial autoscroll has happened
  const hasAutoScrolled = useRef(false);

  // Auto-scroll to current lesson - Faster & Smoother Premium Feel
  useEffect(() => {
    // Only auto-scroll on first mount, not every navigation back
    if (hasAutoScrolled.current) return;
    if (!lessons || !Array.isArray(lessons)) return;
    
    const idx = lessons.findIndex(l => l?.id === currentLessonId);
    if (idx >= 0 && scrollRef.current && lessons.length > 0) {
      hasAutoScrolled.current = true; // Mark as done
      
      // Monitor layout measurement to ensure we scroll to correct spot
      const attemptScroll = (attempt = 0) => {
        if (attempt > 3) return; // Give up after 3 tries
        
        try {
          if (scrollRef.current) {
            const lessonHeight = 70;
            const spacing = 12;
            const topicSpacing = 60;
            
            let targetPosition = idx * (lessonHeight + spacing);
            const topicBoundaries = Math.floor(idx / 5);
            targetPosition += topicBoundaries * (topicSpacing - spacing);
            
            // Allow a bit of offset so the current lesson is centered, not at extreme top
            targetPosition = Math.max(0, targetPosition - H / 3);
            
            // QUICKER SMOOTH SCROLL (1.5 seconds)
            const duration = 1500; 
            const startTime = Date.now();
            const startY = 0; // Ideally we'd read current offset but 0 is safe for initial load
            
            // Exponential easing for that "snap" feel at the end
            const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
            
            const animateScroll = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easedProgress = easeOutExpo(progress);
              
              const currentY = startY + (targetPosition - startY) * easedProgress;
              
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ y: currentY, animated: false });
              }
              
              if (progress < 1) {
                requestAnimationFrame(animateScroll);
              }
            };
            
            requestAnimationFrame(animateScroll);
          }
        } catch (error) {
          console.warn('ScrollToIndex error:', error);
          setTimeout(() => attemptScroll(attempt + 1), 500);
        }
      };

      // Slight delay to allow layout to compute
      setTimeout(() => attemptScroll(), 500);
    }
  }, [lessons]); // Only depend on lessons

  const handlePressIn = (index) => {
    // Premium UX: Removed vibration for GPay/Cred-level smoothness
    setPressedIndex(index);
    if (animatedValues.current[index]) {
      Animated.spring(animatedValues.current[index].scale, {
        toValue: 0.92,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  // Trigger XP Collection Animation
  const triggerXPCollection = (lessonIndex, xpAmount = 35) => {
    const position = nodePositions[lessonIndex];
    if (position) {
      setXpAnimation({
        visible: true,
        startPosition: { x: position.x, y: position.y },
        endPosition: xpBarPosition,
        xpAmount,
      });
    }
  };

  const handlePressOut = (index, item) => {
    setPressedIndex(null);
    if (animatedValues.current[index]) {
      Animated.sequence([
        Animated.spring(animatedValues.current[index].scale, {
          toValue: 1.05,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.spring(animatedValues.current[index].scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
      ]).start();
    }
    
    if (item?.status !== 'locked') {
      onOpenLesson?.(item.id);
      
      // Trigger XP animation if lesson is being completed
      if (item.status === 'unlocked') {
        // Delay to simulate lesson completion
        setTimeout(() => {
          triggerXPCollection(index, 35);
          onLessonComplete?.(item.id, 35);
        }, 1000);
      }
    }
  };

  const renderItem = ({ item, index }) => {
    const lessonPosition = index % 5; // 0, 1, 2, 3, 4 (including quiz)
    const topicIndex = Math.floor(index / 5);
    const isLastInGroup = lessonPosition === 4; // Last is now the quiz
    const isQuiz = lessonPosition === 4; // 5th icon is quiz
    const isCurrent = item.id === currentLessonId;
    
    // Use pre-calculated position from nodePositions
    const position = nodePositions[index] || { x: W / 2, y: 60 + index * 70 };
    const xOffset = position.x;
    
    // Determine if mascot should appear - only at 3rd lesson of each topic
    const showMascot = lessonPosition === 2; // 3rd lesson (index 2)
    let mascotSide = 'right'; // default
    let mascotAnimation = null;
    
    if (showMascot) {
      // Determine mascot position based on curve direction
      if (topicIndex % 2 === 0) {
        // Even topics: C-curve opening to RIGHT, so mascot on LEFT
        mascotSide = lessonPosition <= 2 ? 'left' : 'right';
      } else {
        // Odd topics: C-curve opening to LEFT, so mascot on RIGHT  
        mascotSide = lessonPosition <= 2 ? 'right' : 'left';
      }
      
      // Choose animation based on topic index
      try {
        // Use different lottie animations for different topics
        switch (topicIndex % 4) {
          case 0:
            mascotAnimation = require('@/components/newhome/assets/lottie/lottie1.json');
            break;
          case 1:
            mascotAnimation = require('@/components/newhome/assets/lottie/lottie2.json');
            break;
          case 2:
            mascotAnimation = require('@/components/newhome/assets/lottie/lottie3.json');
            break;
          case 3:
            mascotAnimation = require('@/components/newhome/assets/lottie/lottie4.json');
            break;
        }
      } catch (e) {
        console.log('Animation load error:', e);
        // Fallback to main animations folder
        try {
          mascotAnimation = require('@/assets/animations/diamond.json');
        } catch (e2) {
          mascotAnimation = null;
        }
      }
    }

    const anims = animatedValues.current[index] || {
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
    };

    return (
      <Animated.View
        style={[
          styles.lessonWrapper,
          {
            opacity: anims.opacity,
            transform: [
              { translateY: anims.translateY },
            ],
            // Add gap after every 5th lesson (quiz) + extra gap for topics  
            marginBottom: isLastInGroup ? 60 : (lessonPosition === 0 ? 15 : 12),
          },
        ]}
      >
        {/* Topic Header - Show before first lesson of each topic (except very first lesson) */}
        {lessonPosition === 0 && index !== 0 && (
          <View style={styles.topicHeaderContainer}>
            {/* Left dotted line */}
            <View style={[styles.dottedLine, styles.leftDottedLine]} />
            
            {/* Topic pill with gradient */}
            <LinearGradient
              colors={[QUEST_COLORS.locked, QUEST_COLORS.locked]}
              style={styles.topicPill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.topicText}>
                {item.topicTitle || `Topic ${topicIndex + 1}`}
              </Text>
            </LinearGradient>
            
            {/* Right dotted line */}
            <View style={[styles.dottedLine, styles.rightDottedLine]} />
          </View>
        )}

        {/* 3D Lesson Node - Duolingo Style */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={() => handlePressIn(index)}
          onPressOut={() => handlePressOut(index, item)}
          style={[
            styles.lessonNodeContainer,
            { left: xOffset - 30 }
          ]}
        >
          <Animated.View
            style={[
              styles.lesson3DContainer,
              {
                transform: [{ scale: anims.scale }],
              },
            ]}
          >
            {/* 3D Shadow Layer */}
            <View style={[
              styles.shadowLayer,
              {
                backgroundColor: '#101726',
              }
            ]} />
            
            {/* Main 3D Node with Gradient */}
            <LinearGradient
              colors={['#101726', '#0A0F1A']}
              style={styles.lessonNode3D}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Top Shine Effect */}
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'transparent']}
                style={styles.topShine}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.5 }}
              />
              
              {/* Icon */}
              <View style={styles.iconContainer}>
                {isQuiz ? (
                  // Quiz/Exercise icon for 5th position
                  <FontAwesome5 name="dumbbell" size={18} color={
                    item.status === 'completed' ? '#FFFFFF' : 
                    item.status === 'unlocked' ? '#FFFFFF' : 
                    '#8FA1B4'
                  } />
                ) : isCurrent ? (
                  <FontAwesome5 name="star" size={22} color="#FFFFFF" solid />
                ) : item.status === 'completed' ? (
                  <FontAwesome5 name="check" size={20} color="#FFFFFF" solid />
                ) : item.status === 'unlocked' ? (
                  <FontAwesome5 name="book-open" size={16} color="#FFFFFF" />
                ) : (
                  <FontAwesome5 name="lock" size={16} color="#8FA1B4" />
                )}
              </View>

              {/* Progress Ring for Current */}
              {isCurrent && (
                <View style={styles.progressRing} />
              )}
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        {/* Animated Mascot - Duolingo Style */}
        {showMascot && mascotAnimation && (
          <Animated.View
            style={[
              styles.mascotContainer,
              {
                position: 'absolute',
                top: 0-10,
                left: mascotSide === 'left' ? xOffset - 200 : xOffset + 110,
                opacity: anims.opacity,
                transform: [
                  { scale: anims.scale },
                  { translateY: anims.translateY }
                ]
              }
            ]}
          >
            <View style={[
              styles.mascotWrapper,
              { transform: [{ scaleX: mascotSide === 'right' ? -1 : 1 }] }
            ]}>
              <LottieView
                source={mascotAnimation}
                autoPlay
                loop
                style={styles.mascotLottie}
              />
            </View>
            
            {/* Professional SVG Speech Bubble */}
            <View style={[
              styles.speechBubbleContainer,
              { 
                position: 'absolute',
                top: -30,
                [mascotSide === 'left' ? 'right' : 'left']: mascotSide === 'left' ? -20 : -20,
              }
            ]}>
              <SvgSpeechBubble 
                text={(() => {
                  const messages = [
                    'Amazing!', 'Fantastic!', 'Brilliant!', 'Excellent!', 'Perfect!',
                    'You Rock!', 'Superb!', 'Outstanding!', 'Incredible!', 'Awesome!',
                    'Well Done!', 'Marvelous!', 'Spectacular!', 'Phenomenal!', 'Terrific!',
                    'Keep Going!', 'On Fire!', 'Crushing It!', 'Unstoppable!', 'Champion!',
                    'Legendary!', 'Impressive!', 'Remarkable!', 'Wonderful!', 'Magnificent!',
                    'Genius!', 'Stellar!', 'Epic Win!', 'Mind Blown!', 'Next Level!',
                    'Pro Mode!', 'Beast Mode!', 'Flying High!', 'Nailed It!', 'So Smart!',
                    'Power Up!', 'Level Up!', 'Victory!', 'Dominating!', 'Flawless!'
                  ];
                  return messages[topicIndex % messages.length];
                })()}
                pointDirection={mascotSide === 'left' ? 'left' : 'right'}
                width={70}
                height={28}
              />
            </View>
          </Animated.View>
        )}

        {/* Chest temporarily removed */}
      </Animated.View>
    );
  };

  return (
    <View style={questStyles.questContainer}>
      {/* Consistent Homepage Background */}
      <LinearGradient 
        colors={[QUEST_COLORS.deepOcean, QUEST_COLORS.deepOcean]}
        style={questStyles.oceanBackground}
      >
        <ScrollView
          ref={scrollRef}
          style={questStyles.questMap}
          contentContainerStyle={[
            questStyles.mapContent,
            { minHeight: Math.max(H, (learningPathStructure?.length || 0) * 70 + 200) }
          ]}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          refreshControl={refreshControl}
        >
          {/* Clean Learning Path */}
          <View style={questStyles.cleanLearningPath}>
            
            {/* Simple vertical list */}
            {learningPathStructure.map((item, index) => {
              if (item.type === 'topic') {
                return (
                  <View key={`topic-${item.id}`} style={questStyles.compactTopicSection}>
                    <View style={questStyles.topicLine} />
                    <View style={questStyles.tricolorTitleContainer}>
                      <LinearGradient
                        colors={['#FF9933', '#FFFFFF', '#138808']} // Indian Tricolor
                        style={questStyles.tricolorBackground}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={questStyles.compactTopicTitle}>{item.title}</Text>
                      </LinearGradient>
                      <View style={questStyles.tricolorBorder} />
                    </View>
                    <View style={questStyles.topicLine} />
                  </View>
                );
              } else {
                // Clean lesson card
                const isActive = item.id === currentLessonId;
                const isCompleted = item.completed || false;
                const isLocked = item.locked !== undefined ? item.locked : (!isCompleted && !isActive);
                
                return (
                  <View key={`lesson-${item.id}`} style={questStyles.lessonContainer}>
                    {/* Premium 3D Shadow */}
                    <View style={questStyles.lessonShadow} />
                    
                    <TouchableOpacity 
                      style={questStyles.lessonTouchable}
                      onPress={() => handleIslandPress(item)}
                      activeOpacity={0.8}
                    >
                      {/* Main lesson card with premium styling */}
                      <LinearGradient
                        colors={['#101726', '#0A0F1A', '#0A0F1A']} // Match top bar and compact card colors
                        style={questStyles.lessonCard3D}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        {/* Top shine effect */}
                        <LinearGradient
                          colors={['rgba(255,255,255,0.12)', 'transparent']}
                          style={questStyles.lessonCardShine}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 0.6 }}
                        />
                        
                        {/* Glass overlay for premium effect */}
                        <View style={questStyles.lessonGlassOverlay} />
                        
                        <View style={questStyles.lessonCardContent}>
                          {/* Enhanced icon with multiple layers */}
                          <View style={questStyles.iconWrapper}>
                            <View style={questStyles.iconShadow} />
                            <LinearGradient
                              colors={
                                isCompleted ? ['#10B981', '#059669'] :
                                isActive ? ['#3B82F6', '#2563EB'] :
                                isLocked ? ['#1F2937', '#111827'] : ['#374151', '#262F3F'] // Darker for locked
                              }
                              style={questStyles.lessonIconGradient}
                            >
                              <View style={questStyles.iconShine} />
                              {isCompleted ? (
                                <FontAwesome5 name="check-circle" size={16} color="white" solid />
                              ) : isActive ? (
                                <FontAwesome5 name="play-circle" size={14} color="white" solid />
                              ) : (
                                <FontAwesome5 name="book-open" size={14} color="#9CA3AF" />
                              )}
                            </LinearGradient>
                          </View>
                          
                          {/* Enhanced text section */}
                          <View style={questStyles.lessonTextContainer}>
                            <Text style={[questStyles.lesson3DTitle, {
                              color: isCompleted ? '#FFFFFF' : isActive ? '#FFFFFF' : '#F3F4F6'
                            }]}>{item.title}</Text>
                          </View>
                          
                          {/* Game-style Reward/Status Indicator */}
                          <View style={questStyles.rewardIndicator}>
                            {/* Only show gift for truly eligible lessons (completed + not claimed + in eligibleLessons set) */}
                            {eligibleLessons.has(item.id) && (
                              <AnimatedGiftIcon 
                                onPress={() => handleClaimReward(item)}
                                size={14}
                              />
                            )}
                            {/* Show nothing if already claimed - clean minimal approach */}
                            {isLocked && !isCompleted && !isActive && (
                              <View style={questStyles.lockedBadge}>
                                <FontAwesome5 name="lock" size={12} color="#4B5563" solid />
                              </View>
                            )}
                          </View>
                          
                        </View>
                        
                        {/* Bottom accent line */}
                        <LinearGradient
                          colors={
                            isCompleted ? ['transparent', '#10B981', 'transparent'] :
                            isActive ? ['transparent', '#3B82F6', 'transparent'] :
                            ['transparent', '#374151', 'transparent']
                          }
                          style={questStyles.bottomAccent}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                );
              }
            })}
            
            {/* Mascot removed for clean design */}
            
          </View>
        </ScrollView>
      </LinearGradient>
      
      {/* Beautiful Reward Claim Overlay */}
      {showRewardOverlay && (
        <RewardOverlay 
          amount={rewardAmount}
          onClose={() => setShowRewardOverlay(false)}
        />
      )}
    </View>
  );
}

// Beautiful Duolingo-Style Gift Animation Component
const AnimatedGiftIcon = ({ onPress, size = 14 }) => {
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const wiggleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wiggle animation every few seconds
    const wiggleInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(wiggleAnim, {
          toValue: -5,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(wiggleAnim, {
          toValue: 5,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(wiggleAnim, {
          toValue: -3,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(wiggleAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000 + Math.random() * 2000);

    // Glow pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Gentle float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -3,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 3,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      clearInterval(wiggleInterval);
    };
  }, []);

  return (
    <TouchableOpacity
      style={questStyles.animatedGiftContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          questStyles.animatedGiftWrapper,
          {
            transform: [
              { scale: bounceAnim },
              { rotate: wiggleAnim.interpolate({
                inputRange: [-5, 5],
                outputRange: ['-5deg', '5deg'],
              })},
              { translateY: floatAnim },
            ],
          },
        ]}
      >
        {/* Glowing background */}
        <Animated.View
          style={[
            questStyles.giftGlowBackground,
            {
              opacity: glowAnim,
            },
          ]}
        />
        
        {/* Main gift icon */}
        <LinearGradient
          colors={['#FFD700', '#FFA500', '#FF8C00']}
          style={questStyles.animatedGiftGradient}
        >
          <FontAwesome5 name="gift" size={size} color="white" solid />
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Beautiful Game-Style Reward Overlay Component
const RewardOverlay = ({ amount, onClose }) => {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const trophyScale = useRef(new Animated.Value(0.3)).current;
  const coinsScale = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start reward animation sequence
    Animated.sequence([
      // Fade in overlay
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Trophy entrance with bounce
      Animated.spring(trophyScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      // Coins collection animation after 1 second
      Animated.timing(coinsScale, {
        toValue: 1,
        duration: 800,
        delay: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Shimmer effect loop
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Auto close after 4 seconds
    const timeout = setTimeout(() => {
      handleClose();
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Animated.View 
      style={[
        rewardOverlayStyles.overlay,
        { opacity: overlayOpacity }
      ]}
    >
      <TouchableOpacity 
        style={rewardOverlayStyles.backdrop} 
        onPress={handleClose}
        activeOpacity={1}
      >
        <View style={rewardOverlayStyles.container}>
          
          {/* Shimmer Background Effect */}
          <Animated.View 
            style={[
              rewardOverlayStyles.shimmer,
              {
                opacity: shimmerAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 0.7, 0.3],
                })
              }
            ]} 
          />
          
          {/* Trophy Animation */}
          <Animated.View 
            style={[
              rewardOverlayStyles.trophyContainer,
              { transform: [{ scale: trophyScale }] }
            ]}
          >
            <LottieView
              source={require('@/assets/animations/trophy2.json')}
              autoPlay
              loop={false}
              style={rewardOverlayStyles.trophyLottie}
            />
          </Animated.View>

          {/* Reward Text */}
          <View style={rewardOverlayStyles.textContainer}>
            <Text style={rewardOverlayStyles.rewardTitle}>Reward Claimed!</Text>
            
            {/* Coins Collection Animation */}
            <Animated.View 
              style={[
                rewardOverlayStyles.coinsContainer,
                { transform: [{ scale: coinsScale }] }
              ]}
            >
              <LottieView
                source={require('@/assets/animations/xpcollect.json')}
                autoPlay
                loop={false}
                style={rewardOverlayStyles.coinsLottie}
              />
              <View style={rewardOverlayStyles.amountContainer}>
                <FontAwesome5 name="coins" size={14} color="#FFD700" solid />
                <Text style={rewardOverlayStyles.rewardAmount}>+{amount}</Text>
                <Text style={rewardOverlayStyles.mgText}>MG</Text>
              </View>
            </Animated.View>
          </View>

        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Beautiful Reward Overlay Styles
const rewardOverlayStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 40,
  },
  shimmer: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    transform: [{ scale: 2 }],
  },
  trophyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  trophyLottie: {
    width: 120,
    height: 120,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  coinsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  coinsLottie: {
    width: 80,
    height: 80,
    position: 'absolute',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.25)',
    marginTop: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
    marginLeft: 5,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mgText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 3,
    opacity: 0.85,
    letterSpacing: 0.3,
  },
  tapHint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 30,
    textAlign: 'center',
    fontWeight: '500',
  },
});

const questStyles = StyleSheet.create({
  // 🎮 Quest Adventure Map Styles
  questContainer: {
    flex: 1,
    backgroundColor: QUEST_COLORS.deepOcean,
  },
  
  oceanBackground: {
    flex: 1,
  },
  
  questMap: {
    flex: 1,
  },
  
  mapContent: {
    minHeight: H * 1.5,
    paddingTop: 0,
    paddingBottom: 150,
    paddingHorizontal: 0,
  },
  
  adventureWorld: {
    position: 'relative',
    flex: 1,
  },
  
  // 📚 Proper Learning Path Styles

  
  // Central spine connecting all elements
  centralSpine: {
    position: 'absolute',
    left: '50%',
    top: 20,
    width: 4,
    backgroundColor: '#6366F1',
    marginLeft: -2,
    zIndex: 1,
    borderRadius: 2,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  
  topicSection: {
    position: 'absolute',
    left: 20,
    right: 20,

    zIndex: 10,
  },
  
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  
  topicTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.5,
  },
  
  lessonCount: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 28,
    alignItems: 'center',
    opacity:0,
  },
  
  lessonCountText: {
    fontSize: 1,
    fontWeight: '700',
    color: 'white',
  },
  
  // Lesson branch connections
  lessonBranch: {
    position: 'absolute',
    top: 0,
    height: 3,
    zIndex: 2,
    borderRadius: 1.5,
  },
  
  animatedDots: {
    position: 'absolute',
    top: -2,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  movingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.8,
  },
  
  lessonNode: {
    position: 'absolute',
    zIndex: 15,
  },
  
  lessonCard: {
    top: 0,
    flexDirection: 'row',
    width: 140,
    height: 70,
    borderRadius: 16,
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  
  activeLesson: {
    transform: [{ scale: 1.08 }],
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  
  lessonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  lessonContent: {
    flex: 1,
  },
  
  lessonTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
    lineHeight: 16,
  },
  
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  lessonXP: {
    fontSize: 10,
    color: '#FCD34D',
    fontWeight: '700',
  },
  
  lessonNumber: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  lessonNumberText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  
  // 🏢 Enterprise-Grade Progress Indicators
  topicProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  
  progressText: {
    fontSize: 9,
    fontWeight: '800',
    color: 'white',
  },
  
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  
  // Enhanced Lesson Meta Elements
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  
  lessonIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  completedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  activePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#60A5FA',
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  
  lessonDuration: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  
  // 📊 Enterprise Learning Dashboard
  learningDashboard: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  
  dashboardCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  
  dashboardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#60A5FA',
    marginBottom: 4,
  },
  
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 8,
  },
  
  // 🎯 Clean Learning Path Styles
  cleanLearningPath: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
  },
  
  // Compact Topic Header Styles
  compactTopicSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    marginHorizontal: 20,
  },
  
  topicLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  
  // Indian Tricolor Topic Title Design
  tricolorTitleContainer: {
    position: 'relative',
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginVertical: 8,
  },

  tricolorBackground: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tricolorBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.6)', // Golden border
  },

  compactTopicTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1A2333',
    textAlign: 'center',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  cleanTopicHeader: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  
  cleanTopicTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  
  cleanLessonItem: {
    marginBottom: 12,
  },
  
  cleanLessonCard: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  
  cleanCompletedCard: {
    backgroundColor: '#065F46',
    borderColor: '#10B981',
  },
  
  cleanActiveCard: {
    backgroundColor: '#1E3A8A',
    borderColor: '#3B82F6',
  },
  
  cleanLessonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  cleanLessonContent: {
    flex: 1,
  },
  
  cleanLessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  
  cleanLessonXP: {
    fontSize: 14,
    color: '#FBBF24',
    fontWeight: '500',
  },
  
  // 🎨 Modern Topic Banner Styles (Distinguished from lessons)
  topicBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  topicIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  topicTextContainer: {
    flex: 1,
  },
  
  topicBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    marginBottom: 2,
  },
  
  topicLessonCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  
  topicDecor: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // 🎮 Compact 3D Lesson Card Styles (Like CompactTopicCard)
  lessonContainer: {
    marginBottom: 8, // Reduced from 16
    marginTop: 0, // Ensure no top margin
  },
  
  lessonCard3D: {
    borderRadius: 12, // Modern, less rounded for cleaner look
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 8, // Reduced from 12
  },
  
  activeLesson3D: {
    shadowOpacity: 0.4,
    shadowRadius: 12, // Reduced from 16
    elevation: 12, // Reduced from 16
    // Remove transform scale to match CompactTopicCard no-animation style
  },
  
  lessonCardDepth: {
    position: 'absolute',
    top: 3, // Reduced from 4
    left: 3,
    right: 3,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 18, // Match reduced border radius
  },
  
  lessonCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18, // Match CompactTopicCard style
    padding: 12, // Reduced from 16
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minHeight: 56, // Compact height like CompactTopicCard
  },
  
  lessonIconGradient: {
    width: 36, // Reduced from 48
    height: 36, // Reduced from 48
    borderRadius: 18, // Reduced from 24
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12, // Reduced from 16
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  lessonTextContainer: {
    flex: 1,
  },
  
  lesson3DTitle: {
    fontSize: 15, // Reduced from 16 to match CompactTopicCard compact style  
    fontWeight: '700',
    color: 'white',
    marginBottom: 2, // Reduced from 4
    letterSpacing: 0.2, // Add premium letter spacing
  },
  
  lessonMeta3D: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  
  lesson3DXP: {
    fontSize: 13,
    color: '#FBBF24',
    fontWeight: '600',
  },
  
  // Game-style Reward System
  rewardIndicator: {
    marginLeft: 'auto',
    marginRight: 8,
  },
  giftBox: {
    position: 'relative',
  },
  giftGradient: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  giftGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    zIndex: -1,
  },
  claimedBadge: {
    opacity: 0.7,
  },
  lockedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Enhanced Stylish Lesson Card Styles
  lessonShadow: {
    position: 'absolute',
    bottom: -3,
    left: 3,
    right: -3,
    height: '92%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    transform: [{ scaleX: 0.96 }],
  },
  lessonTouchable: {
    flex: 1,
  },
  lessonGlassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 18,
  },
  iconWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  iconShadow: {
    position: 'absolute',
    bottom: -1,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  iconShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  lessonMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lessonXP: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FBBF24',
    letterSpacing: 0.2,
  },
  lessonDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 6,
  },
  lessonType: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.1,
  },
  statusWrapper: {
    position: 'relative',
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.8,
  },
  
  // Premium styles for inactive lessons
  lessonCardShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  
  lessonCardEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  
  // 🏝️ Quest Island Styles
  questIsland: {
    position: 'absolute',
    zIndex: 10,
  },
  
  islandSvg: {
    position: 'absolute',
  },
  
  islandContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  islandIcon: {
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  questLevel: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  
  questLevelText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  
  completionStars: {
    position: 'absolute',
    top: -8,
    flexDirection: 'row',
    gap: 2,
  },
  
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 40,
  },
  
  // 🧭 Quest Path Styles
  questPath: {
    position: 'absolute',
    height: 4,
    zIndex: 5,
  },
  
  pathLine: {
    height: 4,
    borderRadius: 2,
    shadowColor: QUEST_COLORS.mysticTeal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  
  pathParticles: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  
  pathParticle: {
    position: 'absolute',
    top: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: QUEST_COLORS.mysticTeal,
    opacity: 0.8,
  },
  
  // 🧙‍♂️ Flying Mascot Guide
  mascotGuide: {
    position: 'absolute',
    top: 50,
    left: W / 2 - 40,
    alignItems: 'center',
    zIndex: 20,
  },
  
  flyingMascot: {
    width: 80,
    height: 80,
  },
  
  // 🎁 Duolingo-style Animated Gift Icon Styles
  animatedGiftContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  animatedGiftWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  giftGlowBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  
  animatedGiftGradient: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
});

// Legacy styles (keeping for compatibility)  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: QUEST_COLORS.deepOcean,
  },
  
  listContent: {
    paddingTop: 100,
    paddingBottom: 150,
  },
  
  lessonWrapper: {
    position: 'relative',
    width: W,
    minHeight: 70,
  },
  
  topicHeaderContainer: {
    position: 'absolute',
    top: -85, // Even more space above first icon
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  
  topicPill: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: QUEST_COLORS.mysticTeal,
    shadowColor: QUEST_COLORS.mysticTeal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    // Modern gradient effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    marginHorizontal: 20,
  },
  
  topicText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.6,
    textAlign: 'center',
    textShadowColor: QUEST_COLORS.mysticTeal,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  
  dottedLine: {
    height: 1,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: QUEST_COLORS.mysticTeal,
    borderStyle: 'dotted',
    opacity: 0.4,
  },
  
  leftDottedLine: {
    marginRight: 15,
  },
  
  rightDottedLine: {
    marginLeft: 15,
  },
  
  lessonNodeContainer: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  
  lesson3DContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  shadowLayer: {
    position: 'absolute',
    bottom: -3,
    width: 56,
    height: 56,
    borderRadius: 28,
    opacity: 0.3,
  },
  
  lessonNode3D: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  
  topShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  
  progressRing: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: QUEST_COLORS.treasureGold,
    opacity: 0.5,
  },
  
  chestContainer: {
    position: 'absolute',
    bottom: 135,
    right: 100,
    alignItems: 'center',
  },
  
  chestAnimation: {
    width: 200,
    height: 200
  },
  
  chestAnimationWrapper: {
    width: 200,
    height: 200,
  },
  
  chestGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    left: -20,
    top: -20,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 215, 111, 0.15)',
    shadowColor: '#FFD76F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 10,
  },
  
  fallbackChest: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 111, 0.1)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 111, 0.3)',
  },
  
  chestEmoji: {
    fontSize: 80,
  },
  
  chestStatus: {
    fontSize: 12,
    color: '#FFD76F',
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Animated Mascot Styles
  mascotContainer: {
    zIndex: 20,
    width: 100,
    height: 100,
  },
  
  mascotWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 50,
  },
  
  mascotLottie: {
    width: 90,
    height: 90,
  },
  
  speechBubbleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Enhanced Island Effects
  sparkleRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    top: -10,
    left: -10,
    zIndex: 5,
  },

  sparkle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: QUEST_COLORS.treasureGold,
    borderRadius: 2,
    shadowColor: QUEST_COLORS.treasureGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },

  islandTouchable: {
    borderRadius: 35,
  },

  islandShine: {
    position: 'absolute',
    width: 20,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: 5,
    left: 25,
    borderRadius: 10,
  },
});


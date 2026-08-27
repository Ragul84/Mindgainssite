import React, { useEffect, useRef } from 'react';
import {
  Pressable,
  Text,
  View,
  ScrollView,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import chest from '../assets/lottie/Chest.json';
import lottie1 from '../assets/lottie/lottie1.json';
import lottie2 from '../assets/lottie/lottie2.json';
import lottie3 from '../assets/lottie/lottie3.json';
import lottie4 from '../assets/lottie/lottie4.json';
import XPBar from './components/xpBar';
import styles from './components/styles/mainStyles';
import PillIcon from '../assets/icons/pill.svg';
import BookIcon from '../assets/icons/book.svg';
import CookieIcon from '../assets/icons/cookie.svg';
import PathLineActive from '../assets/svg/PathLine.svg';
import PathLineInactive from '../assets/svg/PathLineInactive.svg';


export default function App() {
  const pattern = ['Daily Dose', 'Daily Snack', 'Topic', 'Topic'];
  const lessons = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    title: pattern[i % pattern.length],
  }));

  const todayLimit = 4;

  const gradientColors = {
    'Daily Dose': ['#0d9ab3ff', '#0689d4ff'],
    'Daily Snack': ['#0077d8be', '#023480ff'],
    'Topic': ['#022b68ff', '#023480ff'],
  };
  const gradientStroke = {
    'Daily Dose': ['#04d9ffff', '#0689d4ff', '#0689d4ff'],
    'Daily Snack': ['#1695fdff', '#023480ff', '#023480ff'],
    'Topic': ['#064cb4ff', '#023480ff', '#023480ff'],
  };

  const glowAnim = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(glowAnim, {
          toValue: 0.2,
          duration: 2000,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, [glowAnim]);

  const animatedGlow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.35)'],
  });

  const getIcon = (lessonTitle, isLast, isActive) => {
    const color = isActive ? '#fff' : '#777777d8';
    const size = 38;

    // Locked state → always lock icon
    if (!isActive) {
      return <Ionicons name="lock-closed" size={size} color={color} />;
    }

    // Active icons

    switch (lessonTitle) {
      case 'Daily Dose':
        return <PillIcon width={size} height={size} fill={color} />;
      case 'Daily Snack':
        return <CookieIcon width={size} height={size} fill={color} />;
      default:
        return <BookIcon width={size} height={size} fill={color} />;
    }
  };

  const decorations = [lottie1, lottie2, lottie3, lottie4];

  return (
    <LinearGradient colors={['#021f58ff', '#021c50ff', '#06296eff']} style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={{ flex: 1, justifyContent: 'center', }}>
          <XPBar progress={0.65} streak={3} />
        </View>
      </View>

      {/* Scrollable Lessons */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Array.from({ length: Math.ceil(lessons.length / 4) }, (_, dayIndex) => {
          const startIndex = dayIndex * 4;
          const dayLessons = lessons.slice(startIndex, startIndex + 4);
          const isInverted = dayIndex % 2 !== 0;
          const deco = decorations[dayIndex % decorations.length];

          const isActiveDay = startIndex < todayLimit;
          return (
            <View key={dayIndex} style={{ position: 'relative', marginBottom: 100 }}>
              {/* Floating Background Lottie */}
              <LottieView
                source={deco}
                autoPlay
                loop
                style={{
                  position: 'absolute',
                  top: isInverted ? 250 : 260,
                  left: isInverted ? 'auto' : 10,
                  right: isInverted ? 10 : 'auto',
                  width: 180,
                  height: 180,
                  opacity: 1,
                  zIndex: -1,
                }}
              />
              
{ isActiveDay ? (
  <PathLineActive
    width="140%"
    height="500"
    style={{
      position: 'absolute',
      top: 180,
      left: -120,
      right: 0,
      zIndex: -2,
      opacity: 0.95,
      transform: [{ scaleX: isInverted ? -1 : 1 }],
    }}
  />
) : (
  <PathLineInactive
    width="140%"
    height="500"
    style={{
      position: 'absolute',
      top: 180,
      left: -120,
      right: 0,
      zIndex: -2,
      opacity: 0.6,
      transform: [{ scaleX: isInverted ? -1 : 1 }],
    }}
  />
)}

              {/* Divider with Day title */}
              <View style={styles.dividerContainer}>
                <Animated.View style={[styles.line, { backgroundColor: animatedGlow }]} />
                <LinearGradient colors={['#3930adff', '#181685ff']} style={styles.day}>
                  <Text style={styles.dayText}>Day {dayIndex + 1}</Text>
                </LinearGradient>
                <Animated.View style={[styles.line, { backgroundColor: animatedGlow }]} />
              </View>

              {/* Lesson path */}
              {[...dayLessons, { id: `chest-${dayIndex}`, title: 'Chest', isChest: true }].map(
                (lesson, i) => {
                  const isActive = startIndex + i < todayLimit;
                  const isLast = lesson.isChest;

                  // 👇 Define manual positions (tweak these visually until they fit your PathLine)
                  const basePositions = [
                    { x: 130, y: 0 },     // first button
                    { x: 130, y: 100 },   // second
                    { x: 60, y: 130 },  // third
                    { x: -130, y: -55 },  // fourth
                    { x: 95, y: 40 },    // chest
                  ];

                  const pos = basePositions[i] || { x: 0, y: 0 };
                  const xOffset = isInverted ? -pos.x : pos.x;
                  const yOffset = pos.y;

                  if (lesson.isChest) {
                    return (
                      <Animated.View
                        key={lesson.id}
                        style={[
                          styles.lessonContainer,
                          { transform: [{ translateX: xOffset }, { translateY: yOffset }] },
                        ]}
                      >
                        <LottieView
                          source={chest}
                          autoPlay={false}
                          loop={false}
                          style={[{ width: 250, height: 250, transform: [{ scaleX: isInverted ? 1 : -1 }] }, styles.chestAnimation]}
                        />
                      </Animated.View>
                    );
                  }

                  return (
                    <Animated.View
                      key={lesson.id}
                      style={[
                        styles.lessonContainer,
                        { transform: [{ translateX: xOffset }, { translateY: yOffset }] },
                      ]}
                    >
                      <Pressable
                        disabled={!isActive}
                        onPress={() => isActive && Alert.alert('Lesson Clicked', lesson.title)}
                        style={styles.neonWrapper}
                      >
                        <LinearGradient
                            colors={
                              isActive
                                ? gradientStroke[lesson.title]
                                : ['#5a5a5aff', '#222222ff', '#222222ff']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} style={styles.topicIcon}>
                          <LinearGradient
                            colors={
                              isActive
                                ? gradientColors[lesson.title]
                                : ['#333333ff', '#222222ff']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.neonButton}
                          >
                            {getIcon(lesson.title, isLast, isActive)}
                          </LinearGradient>
                        </LinearGradient>
                      </Pressable>
                    </Animated.View>
                  );
                }
              )}
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

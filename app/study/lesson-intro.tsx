import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import UniversalNavigation from '@/utils/universalNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import Animated, { FadeInUp, FadeInDown } from '@/utils/reanimated';
import { supabase } from '@/utils/supabase';
import { getImageForLesson } from '@/utils/imageMap';

const { width, height } = Dimensions.get('window');

// 🎯 Mapping for "Crispy" Learning Objectives
// 🎯 Dynamic Lesson Intro with Database Fetching
export default function LessonIntro() {
  const params = useLocalSearchParams();
  const title = params.lessonTitle as string || params.subtitle as string || "Lesson Preview";
  const lessonId = params.lessonId as string;
  const topicName = params.topicName as string;

  // State for dynamic content
  const [objectives, setObjectives] = useState<string[]>([
    "Core Concept Mastery",
    "Real-world Applications",
    "Practical Case Studies"
  ]);
  const [headerImage, setHeaderImage] = useState<any>(require('@/assets/mascot/mascot_hero.png')); // Default fallback
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessonDetails() {
      console.log("🔍 Fetching details for lessonId:", lessonId);
      if (!lessonId) return;
      
      try {
        const { data, error } = await supabase
          .from('mind_lessons')
          .select('learning_objectives, header_image_url')
          .eq('id', lessonId)
          .single();

        console.log("📥 DB Response:", data, error);
          
        if (data) {
          if (data.learning_objectives && Array.isArray(data.learning_objectives)) {
            console.log("✅ Setting objectives:", data.learning_objectives);
            setObjectives(data.learning_objectives);
          }
          
          // Map DB image string to local asset using Registry
          if (data.header_image_url) {
             console.log("✅ Mapping image:", data.header_image_url);
             const imageSource = getImageForLesson(data.header_image_url);
             console.log("🖼️ Resolved source:", imageSource);
             setHeaderImage(imageSource);
          }
        }
      } catch (e) {
        console.error("Failed to fetch lesson details:", e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLessonDetails();
  }, [lessonId]);

  const handleStartLesson = () => {
    UniversalNavigation.navigateTo({
      pathname: '/study/cinematic-lesson',
      params: { ...params },
    });
  };

  const handleBack = () => {
    UniversalNavigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* 🖼️ Premium Header Image Background - Reduced Height */}
      <View style={styles.imageContainer}>
        <Image 
          source={headerImage} 
          style={styles.headerImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', '#020617']}
          style={styles.imageOverlay}
          locations={[0.2, 1]}
        />
        
        {/* Back Button Only */}
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity style={styles.backButton} activeOpacity={1} onPress={handleBack}>
            <BlurView intensity={20} tint="dark" style={styles.iconBlur}>
              <FontAwesome5 name="arrow-left" size={16} color="#FFFFFF" />
            </BlurView>
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* 📄 Modern Glass Content Card - Single Page Fit */}
      <View style={styles.contentContainer}>
        <View style={styles.mainContent}>
          
          {/* Top Row: Topic + Reward */}
          <Animated.View style={styles.metaRow} entering={FadeInUp.delay(200).duration(600)}>
            <LinearGradient
              colors={['rgba(56, 189, 248, 0.1)', 'rgba(56, 189, 248, 0.02)']}
              style={styles.topicPill}
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.topicText}>{topicName}</Text>
            </LinearGradient>

            {/* Compact Reward Badge */}
            <View style={styles.rewardBadge}>
              <FontAwesome5 name="coins" size={12} color="#F59E0B" />
              <Text style={styles.rewardText}>{params.xp || 100}</Text>
            </View>
          </Animated.View>
          
          {/* Compact Title */}
          <Animated.View entering={FadeInUp.delay(300).duration(600)}>
            <Text style={styles.lessonTitle} numberOfLines={2}>
              {title}
            </Text>
          </Animated.View>

          {/* ⚡ Compact Objectives */}
          <Animated.View style={styles.objectivesResult} entering={FadeInUp.delay(400).duration(600)}>
            <Text style={styles.sectionHeader}>YOU WILL MASTER</Text>
            <View style={styles.objectivesList}>
              {objectives.map((obj, index) => (
                <View key={index} style={styles.objectiveRow}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.objectiveText}>{obj}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

        </View>

        {/* 🚀 Compact Floating Start Button */}
        <Animated.View style={styles.footer} entering={FadeInDown.delay(500).duration(600)}>
          <TouchableOpacity 
            style={styles.startBtnTouch}
            onPress={handleStartLesson}
            activeOpacity={1}
          >
            <LinearGradient
              colors={['#00D4C7', '#009B91']}
              style={styles.startBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.startBtnText}>START LESSON</Text>
              <FontAwesome5 name="arrow-right" size={14} color="#0F172A" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  imageContainer: {
    height: height * 0.35, // Reduced height for single page fit
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0, 
    right: 0,
    bottom: 0,
    height: '100%', // Full gradient for smoother blend
  },
  safeArea: {
    zIndex: 10,
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButton: {
    // 
  },
  iconBlur: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  contentContainer: {
    flex: 1,
    marginTop: -30,
    backgroundColor: '#020617',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  mainContent: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  topicPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  topicText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F59E0B',
  },
  lessonTitle: {
    fontSize: 24, // Reduced from 28
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 24,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  objectivesResult: {
    // No background box, just clean text to save space/reduce clutter
    marginTop: 0,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  objectivesList: {
    gap: 16, // Consistent spacing
  },
  objectiveRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
    marginTop: 7, // Alignment fix
  },
  objectiveText: {
    fontSize: 15,
    color: '#E2E8F0',
    flex: 1,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  footer: {
    marginBottom: 40, // Bottom padding for safety
    marginTop: 'auto', // Push to bottom
  },
  startBtnTouch: {
    width: '100%',
    shadowColor: '#00D4C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  startBtnGradient: {
    paddingVertical: 16, // Slightly reduced
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
});

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RealDatabaseContentService } from '../../utils/realDatabaseContentService';

const { width } = Dimensions.get('window');

// Simple fallback content generator
const generateFallbackLessonContent = (topicName: string) => {
  return {
    title: topicName,
    subtitle: "Expert Level Content",
    overview: "Comprehensive study of this important topic.",
    sections: [{
      id: 'fallback-1',
      title: 'Overview',
      icon: 'book',
      gradient: ['#FF6B6B', '#FF8E53'],
      content: [{
        id: 'fallback-content',
        subtitle: 'Key Learning Points',
        color: '#8B5CF6',
        points: [
          'Study this topic thoroughly',
          'Focus on important concepts',
          'Practice with examples'
        ]
      }]
    }],
    estimatedTime: "15 min",
    xpReward: 50,
    difficulty: "medium",
    info: []
  };
};

// ONLY conversion function we need - converts lesson_parts data to display format
const convertLessonPartToFormat = (partWithPages: any, topicName: string) => {
  const { part, pages } = partWithPages || {};
  
  if (!part) {
    return generateFallbackLessonContent(topicName);
  }
  
  // Handle pages array safely
  const pageArray = Array.isArray(pages) ? pages : [];
  
  // Convert lesson pages to lesson sections
  const sections = pageArray.length > 0 ? pageArray.map((page, index) => ({
    id: `page-${page?.page_number || index + 1}`,
    title: page?.page_title || `Page ${index + 1}`,
    icon: 'book',
    gradient: ['#FF6B6B', '#FF8E53'],
    content: Array.isArray(page?.content_points) ? page.content_points.map((point, pointIndex) => ({
      id: `point-${pointIndex}`,
      subtitle: point?.title || `Point ${pointIndex + 1}`,
      color: '#8B5CF6',
      points: [point?.full || 'Content point']
    })) : [{
      id: 'default-point',
      subtitle: 'Key Learning',
      color: '#8B5CF6', 
      points: [page?.page_description || 'Learn important concepts']
    }]
  })) : [{
    id: 'default-section',
    title: 'Overview',
    icon: 'book',
    gradient: ['#FF6B6B', '#FF8E53'],
    content: [{
      id: 'default-content',
      subtitle: 'Study Guide',
      color: '#8B5CF6',
      points: [part.short_description || 'Important content to learn']
    }]
  }];
  
  return {
    title: part.part_title || topicName,
    subtitle: `${topicName} - Part ${part.part_number || 1}`,
    overview: part.short_description || 'Comprehensive study of this topic.',
    sections: sections,
    estimatedTime: `${part.estimated_time_minutes || 15} min`,
    xpReward: part.xp_reward || 50,
    difficulty: part.difficulty_level || 'medium',
    info: [] // Add empty info array to prevent map error
  };
};

export default function LessonSimple() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const [lessonContent, setLessonContent] = useState(null);
  const [realContent, setRealContent] = useState(null);
  const [currentLessonPart, setCurrentLessonPart] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const topicName = params.topic as string;
  
  useEffect(() => {
    loadLessonContent();
  }, [topicName]);

  const loadLessonContent = async () => {
    if (!topicName) return;
    
    console.log('🔍 Loading content for topic:', topicName);
    setIsLoading(true);

    try {
      // Use ONLY lesson_parts system - no fallbacks to old systems
      console.log('🔍 Searching for lesson parts:', topicName);
      let lessonParts = await RealDatabaseContentService.getLessonPartsForTopic(topicName);
      
      if (lessonParts && lessonParts.length > 0) {
        console.log('✅ Found lesson parts:', lessonParts.length, 'parts available');
        
        // Use the first lesson part
        const firstPart = lessonParts[0];
        const partWithPages = await RealDatabaseContentService.getLessonPartWithPages(firstPart.id);
        
        if (partWithPages) {
          console.log('✅ Found lesson part with', partWithPages.pages?.length || 0, 'pages');
          
          // Load user progress
          const progress = await RealDatabaseContentService.getUserLessonProgress(firstPart.id);
          if (progress) {
            console.log('📊 User progress:', progress.current_page, '/', partWithPages.pages?.length || 0);
            setUserProgress(progress);
            setCurrentPage(progress.current_page || 1);
          }
          
          // Debug the raw data structure
          console.log('🔍 Raw partWithPages data:', JSON.stringify(partWithPages, null, 2));
          console.log('🔍 Part data:', partWithPages.part);
          console.log('🔍 Pages data:', partWithPages.pages);
          
          const formattedContent = convertLessonPartToFormat(partWithPages, topicName);
          console.log('🔍 Formatted content result:', JSON.stringify(formattedContent, null, 2));
          
          setLessonContent(formattedContent);
          setCurrentLessonPart(partWithPages.part);
          setRealContent(partWithPages);
        } else {
          console.log('❌ No lesson part with pages found');
          setLessonContent(generateFallbackLessonContent(topicName));
        }
      } else {
        console.log('❌ No lesson parts found for:', topicName);
        setLessonContent(generateFallbackLessonContent(topicName));
      }
    } catch (error) {
      console.error('❌ Error loading lesson content:', error);
      setLessonContent(generateFallbackLessonContent(topicName));
    }
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F23' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 18 }}>Loading lesson content...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!lessonContent) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F23' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 18 }}>No content available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F23' }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)'
      }}>
        <TouchableOpacity 
          activeOpacity={1} onPress={() => router.back()}
          style={{ 
            padding: 8,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.1)' 
          }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            {lessonContent.title}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 2 }}>
            +{lessonContent.xpReward} XP
          </Text>
        </View>
        
        <TouchableOpacity style={{ 
          padding: 8,
          borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.1)' 
        }} activeOpacity={1} >
          <Ionicons name="bookmark-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Overview */}
        <View style={{ 
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: 'rgba(139, 92, 246, 0.3)'
        }}>
          <Text style={{ 
            color: '#8B5CF6', 
            fontSize: 16, 
            fontWeight: 'bold', 
            marginBottom: 8 
          }}>
            📖 Overview
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, lineHeight: 22 }}>
            {lessonContent.overview}
          </Text>
        </View>

        {/* Sections */}
        {lessonContent.sections && lessonContent.sections.map((section, sectionIndex) => (
          <View key={section.id} style={{ marginBottom: 24 }}>
            <View style={{ 
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: 'rgba(255, 107, 107, 0.3)'
            }}>
              <Text style={{ 
                color: '#FF6B6B', 
                fontSize: 18, 
                fontWeight: 'bold', 
                marginBottom: 16 
              }}>
                📚 {section.title}
              </Text>
              
              {section.content && section.content.map((contentItem, contentIndex) => (
                <View key={contentItem.id} style={{ marginBottom: 16 }}>
                  <Text style={{ 
                    color: contentItem.color, 
                    fontSize: 16, 
                    fontWeight: '600', 
                    marginBottom: 8 
                  }}>
                    {contentItem.subtitle}
                  </Text>
                  
                  {contentItem.points && contentItem.points.map((point, pointIndex) => (
                    <Text 
                      key={pointIndex}
                      style={{ 
                        color: 'rgba(255,255,255,0.9)', 
                        fontSize: 14, 
                        lineHeight: 20, 
                        marginLeft: 8,
                        marginBottom: 4 
                      }}
                    >
                      • {point}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Progress indicator */}
        {currentLessonPart && (
          <View style={{ 
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderRadius: 16,
            padding: 20,
            marginTop: 10,
            borderWidth: 1,
            borderColor: 'rgba(34, 197, 94, 0.3)'
          }}>
            <Text style={{ 
              color: '#22C55E', 
              fontSize: 16, 
              fontWeight: 'bold', 
              marginBottom: 8 
            }}>
              📊 Your Progress
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
              Part {currentLessonPart.part_number} of {topicName}
            </Text>
            {userProgress && (
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 }}>
                Page {currentPage} • {userProgress.completion_percentage || 0}% complete
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
// 📖 Reading Interface with Database Content
import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/utils/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import { safeGoBack } from '@/utils/navigationHelper';
import FlashcardLessonInterface from '@/components/ui/FlashcardLessonInterface';
import UniversalCompletion from '@/components/ui/UniversalCompletion';
import { RealDatabaseContentService } from '@/utils/realDatabaseContentService';
import { UnifiedLoader } from '@/components/ui/UnifiedLoader';

export default function ReadingInterfaceDB() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [lessonContent, setLessonContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const sessionStartRef = useRef(Date.now());

  const topicName = params.topicName as string;
  const topicId = params.topicId as string;
  const subject = params.subject as string;

  useEffect(() => {
    loadLessonContent();
  }, [topicName]);

  const loadLessonContent = async () => {
    console.log('📚 Loading lesson content for:', topicName);
    setIsLoading(true);

    try {
      // Get lesson parts for the topic
      const lessonParts = await RealDatabaseContentService.getLessonPartsForTopic(topicName);
      
      if (lessonParts && lessonParts.length > 0) {
        console.log('✅ Found', lessonParts.length, 'lesson parts');
        
        // Get the first lesson part with pages
        const firstPart = lessonParts[0];
        const partWithPages = await RealDatabaseContentService.getLessonPartWithPages(firstPart.id);
        
        if (partWithPages) {
          console.log('📖 Loaded lesson part with', partWithPages.pages?.length || 0, 'pages');
          
          // Convert database content to FlashcardLessonInterface format
          const formattedContent = convertToFlashcardFormat(partWithPages, topicName);
          setLessonContent(formattedContent);
        } else {
          // Fallback content
          setLessonContent(createFallbackContent(topicName));
        }
      } else {
        // Try loading from topics table directly
        const topicContent = await RealDatabaseContentService.getTopicByName(topicName);
        if (topicContent) {
          const formattedContent = convertTopicToFlashcardFormat(topicContent);
          setLessonContent(formattedContent);
        } else {
          setLessonContent(createFallbackContent(topicName));
        }
      }
    } catch (error) {
      console.error('Error loading lesson content:', error);
      setLessonContent(createFallbackContent(topicName));
    }

    setIsLoading(false);
  };

  // Convert lesson_parts database content to flashcard format
  const convertToFlashcardFormat = (partWithPages: any, topicName: string) => {
    const { part, pages } = partWithPages;
    
    const sections = pages?.map((page: any, index: number) => ({
      id: `page-${page.id}`,
      title: page.page_title || `Section ${index + 1}`,
      subtitle: page.page_description || '',
      content: page.content_points?.map((point: any) => ({
        title: point.title || '',
        content: point.full || point.description || '',
        keyPoints: point.key_points || []
      })) || [],
      icon: '📖',
      gradient: ['#3A8DFF', '#2E7FDE']
    })) || [];

    return {
      topicId: part.topic_id,
      title: part.part_title || topicName,
      subtitle: part.short_description || `Learn about ${topicName}`,
      overview: part.detailed_intro?.what_youll_master?.join(' ') || part.short_description,
      sections: sections,
      totalLessons: pages?.length || 1,
      estimatedTime: part.estimated_time_minutes || 15,
      xpReward: part.xp_reward || 50,
      difficulty: part.difficulty_level || 'medium'
    };
  };

  // Convert topic content to flashcard format
  const convertTopicToFlashcardFormat = (topic: any) => {
    return {
      topicId: topic.id,
      title: topic.name,
      subtitle: topic.description || 'Master this topic',
      overview: topic.description || 'Comprehensive study guide',
      sections: [
        {
          id: 'intro',
          title: 'Introduction',
          subtitle: 'Get started with the basics',
          content: [
            {
              title: 'Overview',
              content: topic.description || 'Learn the fundamentals of this topic',
              keyPoints: ['Key concept 1', 'Key concept 2', 'Key concept 3']
            }
          ],
          icon: '📚',
          gradient: ['#3A8DFF', '#2E7FDE']
        }
      ],
      totalLessons: 1,
      estimatedTime: 15,
      xpReward: 50,
      difficulty: 'medium'
    };
  };

  // Create fallback content
  const createFallbackContent = (topicName: string) => {
    return {
      topicId: 'fallback',
      title: topicName,
      subtitle: 'Study Guide',
      overview: `Learn about ${topicName}`,
      sections: [
        {
          id: 'section-1',
          title: 'Introduction',
          subtitle: 'Getting Started',
          content: [
            {
              title: 'Overview',
              content: `Welcome to the study of ${topicName}. This lesson covers essential concepts and important details.`,
              keyPoints: [
                'Understand the basics',
                'Learn key concepts',
                'Master the fundamentals'
              ]
            }
          ],
          icon: '📖',
          gradient: ['#3A8DFF', '#2E7FDE']
        }
      ],
      totalLessons: 1,
      estimatedTime: 15,
      xpReward: 50,
      difficulty: 'medium'
    };
  };

  const handleLessonCompletion = async (completedQuiz: boolean = false) => {
    console.log('✅ Lesson completed!');
    setShowCompletion(true);
    
    // Update progress in database
    if (user?.id && lessonContent?.topicId) {
      try {
        // Update user progress
        await supabase
          .from('user_topic_progress')
          .upsert({
            user_id: user.id,
            topic_id: lessonContent.topicId,
            lessons_completed: 1,
            last_accessed: new Date().toISOString(),
            xp_earned: lessonContent.xpReward || 50
          });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }

    // Navigate back after 3 seconds
    setTimeout(() => {
      router.back();
    }, 3000);
  };

  if (isLoading) {
    return (
      <UnifiedLoader 
        message="Loading lesson content"
        context="study"
        fullScreen={true}
      />
    );
  }

  if (!lessonContent) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F0F23', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#AAB2BD' }}>No content available</Text>
      </View>
    );
  }

  return (
    <>
      <FlashcardLessonInterface
        topicName={lessonContent.title}
        subjectName={subject || 'General Studies'}
        content={lessonContent}
        topicId={lessonContent.topicId}
        overview={lessonContent.overview}
        estimatedTime={lessonContent.estimatedTime}
        xpReward={lessonContent.xpReward}
        difficulty={lessonContent.difficulty}
        onBack={() => safeGoBack('/(tabs)/learn')}
        onComplete={handleLessonCompletion}
      />

      <UniversalCompletion
        visible={showCompletion}
        onClose={() => setShowCompletion(false)}
        levelUp={false}
        xpEarned={lessonContent.xpReward || 50}
        streakDays={1}
        completionTime={Math.max(1, Math.round((Date.now() - sessionStartRef.current) / 60000))}
      />
    </>
  );
}

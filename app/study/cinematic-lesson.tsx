// 🎬 Revolutionary Cinematic Reading Interface
import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import UniversalNavigation from '@/utils/universalNavigation';
import { useAuth } from '@/hooks/useAuth';
import CinematicLessonReader from '@/components/ui/CinematicLessonReader';
import { UnifiedLoader } from '@/components/ui/UnifiedLoader';
import { XPSystem } from '@/utils/xpSystem';
import { StreakService } from '@/utils/streakService';
import HapticService from '@/utils/hapticService';
import { supabase } from '@/utils/supabaseService';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';
import { PremiumGateModal } from '@/components/ui/PremiumGateModal';

export default function CinematicReadingInterface() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { 
    useFeature, 
    isLoading: isPremiumLoading, 
    showPremiumGate, 
    closePremiumGate, 
    premiumGateFeature 
  } = usePremiumFeatures();
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [hasCheckedStatus, setHasCheckedStatus] = useState(false);
  const [dbLessonType, setDbLessonType] = useState<string | null>(null);
  const [externalScenes, setExternalScenes] = useState<any[] | null>(null);
  const topicName = params.topicName as string;
  const topicId = params.topicId as string;
  const lessonId = params.lessonId as string;
  const subtopicId = params.subtopicId as string;
  const subject = params.subject as string;
  const lessonCelebrationMessage = topicName ? `${topicName} Complete!` : 'Lesson Complete!';
  
  console.log('🎬 Cinematic Lesson Route Params:', { topicName, topicId, lessonId, subject });

  useEffect(() => {
    // Initialize the cinematic experience
    async function initLesson() {
      const startTime = Date.now();
      if (!user?.id) return;

      // 0. CHECK FOR AI CONTENT
      if (params.isAI === 'true') {
        const { aiLessonCache } = require('@/utils/aiLessonCache');
        const aiLesson = aiLessonCache.getLesson();
        if (aiLesson && aiLesson.cards) {
          console.log('🤖 Loading AI Cinematic Lesson:', aiLesson.title);
          const mappedScenes = aiLesson.cards.map((card: any) => ({
             id: card.id,
             type: card.type || 'cinematic',
             background: card.visual_config?.primary_asset || 'historical-visual',
             narration: card.narration || '',
             content: card.content || '',
             subContent: card.subContent || '',
             interaction_config: card.interaction_config
          }));
          setExternalScenes(mappedScenes);
          setDbLessonType('cinematic');
          setIsFirstTime(true);
          setHasCheckedStatus(true);
          setIsLoading(false);
          return;
        }
      }

      // 1. CHECK PREMIUM ACCESS
      console.log('🛡️ Checking topic_completion access...');
      const access = await useFeature('topic_completion');
      
      if (!access.can_access) {
        console.log('🚫 Access Denied: Daily topic limit reached.');
        return; 
      }

      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('completed_lessons')
          .eq('id', user.id)
          .single();
        
        const completedLessons = profile?.completed_lessons || [];
        const lessonIdentifier = lessonId || 'constitution-making';
        setIsFirstTime(!completedLessons.includes(lessonIdentifier));
      } catch (error) {
        console.error('Error checking lesson status:', error);
        setIsFirstTime(false);
      }

      // Fetch external scenes from NEW perfect tables
      try {
        console.log('📡 Fetching high-fidelity scenes for:', lessonId);
        
        // Build the query - check by id (UUID) or title slug if it's the legacy one
        let query = supabase.from('mind_lessons').select('id, lesson_type, mind_lesson_scenes(*)');
        
        if (lessonId && lessonId.length > 20) { // Likely a UUID
          query = query.eq('id', lessonId);
        } else {
          // Fallback to topic_id if lessonId is not a UUID (or is missing)
          query = query.eq('topic_id', topicId);
        }

        const { data: lessonDataRaw, error: lError } = await query.limit(1);
        const lessonData = Array.isArray(lessonDataRaw) ? lessonDataRaw[0] : lessonDataRaw;

        if (lessonData && !lError) {
          console.log('✅ Found custom scenes in DB:', lessonData.mind_lesson_scenes.length);
          console.log('✅ DB Lesson Type:', lessonData.lesson_type);
          const sortedScenes = lessonData.mind_lesson_scenes.sort((a: any, b: any) => a.order_index - b.order_index);
          setExternalScenes(sortedScenes);
          setDbLessonType(lessonData.lesson_type);
        } else {
          // 🚑 EMERGENCY SELF-HEALING FALLBACK
          console.warn('⚠️ ID fetch failed. Attempting fallback by TOPIC ID due to potential stale cache:', topicId);
          
          if (topicId) {
             // Try to find the MAIN CINEMATIC lesson for this topic
             const { data: fallbackDataRaw, error: fError } = await supabase
               .from('mind_lessons')
               .select('id, lesson_type, mind_lesson_scenes(*)')
               .eq('topic_id', topicId)
               .eq('lesson_type', 'cinematic') // ⚡ FIX: Explicitly request cinematic type
               .limit(1);

             const fallbackData = Array.isArray(fallbackDataRaw) ? fallbackDataRaw[0] : fallbackDataRaw;

             if (fallbackData && !fError) {
                console.log('🩹 SELF-HEALED: Found valid lesson via Topic ID:', fallbackData.id);
                const sortedScenes = fallbackData.mind_lesson_scenes.sort((a: any, b: any) => a.order_index - b.order_index);
                setExternalScenes(sortedScenes);
                setDbLessonType(fallbackData.lesson_type);
             } else {
                // 🕵️‍♂️ LEVEL 3: LEGACY NAME REDIRECT
                // If the Topic ID itself is stale (e.g. "Constitution Basics" old ID), find the NEW Topic ID by name
                console.warn('⚠️ Topic ID fallback failed. Attempting Name Redirect:', topicName);
                
                let targetTopicName = null;
                if (topicName === 'Constitution Basics') targetTopicName = 'Indian Constitution';
                if (topicName === 'Sultanate Era') targetTopicName = 'Delhi Sultanate';

                if (targetTopicName) {
                   const { data: realTopic } = await supabase
                     .from('topics')
                     .select('id')
                     .eq('name', targetTopicName)
                     .single();
                   
                   if (realTopic) {
                      const { data: redirectDataRaw } = await supabase
                        .from('mind_lessons')
                        .select('id, lesson_type, mind_lesson_scenes(*)')
                        .eq('topic_id', realTopic.id)
                        .eq('lesson_type', 'cinematic') // ⚡ FIX: Explicitly request cinematic type
                        .limit(1);

                      const redirectData = Array.isArray(redirectDataRaw) ? redirectDataRaw[0] : redirectDataRaw;

                      if (redirectData) {
                         console.log('🔄 REDIRECTED: Found lesson via Legacy mappings:', redirectData.id);
                         const sortedScenes = redirectData.mind_lesson_scenes.sort((a: any, b: any) => a.order_index - b.order_index);
                         setExternalScenes(sortedScenes);
                         setDbLessonType(redirectData.lesson_type);
                      }
                   }
                } else {
                   console.error('❌ All fallbacks failed:', fError?.message);
                }
             }
          }
        }
      } catch (err) {
        console.warn('⚠️ Fetch exception:', err);
      }

      setHasCheckedStatus(true);
      
      // Ensure minimum 3s cinematic loader for "premium feel"
      const timeElapsed = Date.now() - startTime;
      const minDuration = 3000;
      const remainingTime = Math.max(0, minDuration - timeElapsed);
      
      setTimeout(() => {
        setIsLoading(false);
        HapticService.light();
      }, remainingTime);
    }
    
    initLesson();
  }, [user?.id, lessonId]);

  const handleLessonComplete = async () => {
    console.log('🎊 Cinematic lesson completed!');
    
    let xpAwarded = 0;

    if (user?.id && isFirstTime) {
      try {
        // AWARD MG/XP ONLY IF FIRST TIME
        const xpReward = XPSystem.calculateLessonXP({ 
          isFirstLesson: false,
          streakDays: 0
        });
        xpAwarded = xpReward.total;
        await XPSystem.awardXP(user.id, xpReward);
        
        // Update streak
        await StreakService.updateStreakOnLessonComplete(user.id);
        
        // Update completed lessons in profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('completed_lessons')
          .eq('id', user.id)
          .single();
        
        const completedLessons = profile?.completed_lessons || [];
        const lessonIdentifier = lessonId || 'constitution-making';
        
        if (!completedLessons.includes(lessonIdentifier)) {
          completedLessons.push(lessonIdentifier);
          await supabase
            .from('user_profiles')
            .update({ completed_lessons: completedLessons })
            .eq('id', user.id);
        }
            
        console.log('✅ First time completion: Rewards awarded and profile updated');
      } catch (error) {
        console.error('Error in lesson completion rewards:', error);
      }
    }

    const shouldCelebrate = xpAwarded > 0;

    // Navigate back with celebration params
    UniversalNavigation.replaceTo({
      pathname: '/(tabs)',
      params: {
        showCelebration: shouldCelebrate ? 'true' : 'false',
        xpEarned: xpAwarded.toString(),
        fromLesson: 'true',
        celebrationMessage: shouldCelebrate ? lessonCelebrationMessage : undefined
      }
    });
  };

  if (isLoading || isPremiumLoading || !hasCheckedStatus) {
    return (
      <View style={{ flex: 1, backgroundColor: '#020617' }}>
        <UnifiedLoader
          message="Preparing cinematic experience..."
          context="study"
          fullScreen={true}
        />
      </View>
    );
  }

  return (
    <>
      <CinematicLessonReader
        lessonId={lessonId || 'constitution-making'}
        topicId={topicId || 'indian-constitution'}
        lessonTitle={topicName}
        onComplete={handleLessonComplete}
        isFirstTime={isFirstTime}
        externalScenes={externalScenes}
        lessonType={(dbLessonType as any) || (params.lessonType as any) || 'cinematic'}
      />

      <PremiumGateModal
        visible={showPremiumGate}
        onClose={() => {
          closePremiumGate();
          UniversalNavigation.goBack(); // Take user back if they don't upgrade
        }}
        onUpgrade={() => {
          // In a real app, this would trigger the payment flow
          // For now, we'll just allow them to close and maybe see a success message
          console.log('💎 User clicked upgrade!');
          closePremiumGate();
          UniversalNavigation.goBack();
        }}
        featureName={premiumGateFeature || 'topic_completion'}
      />
    </>
  );
}

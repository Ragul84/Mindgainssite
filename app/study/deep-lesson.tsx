import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import PremiumDeepLessonReader from '@/components/ui/PremiumDeepLessonReader';
import type { DeepLesson } from '@/services/companion/deepLessonGenerator';

export default function DeepLessonScreen() {
  const params = useLocalSearchParams();
  
  // Parse lesson data from params
  const lesson: DeepLesson = JSON.parse(params.lessonData as string);
  const pathCardId = params.pathCardId as string;

  const handleComplete = () => {
    // TODO: Mark lesson complete in orchestrator
    // For now, just navigate back
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <PremiumDeepLessonReader
      lesson={lesson}
      onComplete={handleComplete}
      onBack={handleBack}
    />
  );
}

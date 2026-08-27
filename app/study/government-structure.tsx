import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import ConceptImprintInterface from '@/components/ui/ConceptImprintInterface';

export default function GovernmentStructureScreen() {
  const handleBack = () => {
    router.back();
  };

  const handleComplete = () => {
    console.log('Government Structure lesson completed!');
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <ConceptImprintInterface
        topicName="Government Structure"
        onBack={handleBack}
        onComplete={handleComplete}
      />
    </View>
  );
}
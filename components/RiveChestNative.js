import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Dimensions, Platform } from 'react-native';

// Conditional Rive import with fallback
let Rive = null;
try {
  Rive = require('rive-react-native').default || require('rive-react-native');
} catch (error) {
  console.log('Rive not available in this environment:', error.message);
}

const { width: screenWidth } = Dimensions.get('window');

const RiveChestNative = ({ topicIndex, item, lessons, index }) => {
  const [isOpened, setIsOpened] = useState(false);
  const riveRef = useRef(null);

  // Check if all lessons in this topic are completed
  const topicStartIndex = Math.floor(index / 5) * 5;
  const topicLessons = lessons.slice(topicStartIndex, topicStartIndex + 5);
  const isUnlocked = true; // Temporarily unlocked for testing // topicLessons.every(lesson => lesson.status === 'completed');

  const handleChestPress = () => {
    console.log('🎁 Chest tapped!', { isUnlocked, isOpened });
    
    if (!isUnlocked || isOpened) {
      console.log('🔒 Chest is locked or already opened');
      return;
    }

    console.log('🎉 Opening treasure chest!');
    setIsOpened(true);

    // Try to trigger Rive state machine if available
    if (Rive && riveRef.current) {
      try {
        // Fire the tap input on the state machine
        console.log('🎯 Triggering Rive tap input...');
        riveRef.current.fireState('State Machine 1', 'tap');
      } catch (error) {
        console.warn('Rive interaction error:', error);
      }
    } else {
      console.log('🎁 Fallback chest animation - Rive not available');
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleChestPress}
      style={[
        styles.chestContainer,
        {
          left: topicIndex % 2 === 0 ? -60 : screenWidth - 140,
        }
      ]}
    >
      <View style={[
        styles.chestWrapper,
        {
          transform: [{ scaleX: topicIndex % 2 === 0 ? 1 : -1 }]
        }
      ]}>
        {/* Rive Animation with fallback */}
        {Rive ? (
          <Rive
            ref={riveRef}
            resourceName="chest1"
            stateMachineName="State Machine 1"
            style={styles.riveAnimation}
          />
        ) : (
          <View style={[styles.riveAnimation, styles.fallbackContainer]}>
            <Text style={styles.fallbackText}>🎁</Text>
            <Text style={styles.fallbackSubtext}>Chest</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chestContainer: {
    position: 'absolute',
    bottom: 135,
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  
  chestWrapper: {
    width: 200,
    height: 200,
    position: 'relative',
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
  },
  
  riveAnimation: {
    width: 200,
    height: 200,
    backgroundColor: 'transparent',
    // Remove any default backgrounds
    borderWidth: 0,
    borderColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  
  fallbackText: {
    fontSize: 48,
    textAlign: 'center',
  },
  
  fallbackSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default RiveChestNative;
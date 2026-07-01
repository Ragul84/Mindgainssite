// 🎁 Web-Only Rive Chest - Works immediately in browser
import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';

interface WebRiveChestProps {
  topicIndex: number;
  item: any;
  lessons: any[];
  index: number;
}

const WebRiveChest: React.FC<WebRiveChestProps> = ({ topicIndex, item, lessons, index }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [riveInstance, setRiveInstance] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if all lessons in this topic are completed
  const topicStartIndex = Math.floor(index / 5) * 5;
  const topicLessons = lessons.slice(topicStartIndex, topicStartIndex + 5);
  const isUnlocked = topicLessons.every(lesson => lesson.status === 'completed');

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const loadWebRive = async () => {
      try {
        // Load Rive for web
        const { Rive } = await import('@rive-app/canvas');
        
        if (canvasRef.current) {
          const rive = new Rive({
            src: '/assets/animations/chest.riv',
            canvas: canvasRef.current,
            autoplay: true,
            stateMachines: 'State Machine 1',
            onLoad: () => {
              console.log('🎁 Rive chest loaded successfully!');
              rive.resizeDrawingSurfaceToCanvas();
              setIsLoaded(true);
            },
            onLoadError: (error) => {
              console.warn('Failed to load Rive:', error);
              setIsLoaded(false);
            },
            onStateChange: (event) => {
              console.log('🎮 Chest state changed:', event.data);
            },
          });
          
          setRiveInstance(rive);
        }
      } catch (error) {
        console.warn('Rive loading error:', error);
        setIsLoaded(false);
      }
    };

    loadWebRive();

    return () => {
      if (riveInstance) {
        try {
          riveInstance.cleanup();
        } catch (e) {}
      }
    };
  }, []);

  const handleChestPress = () => {
    if (!isUnlocked || isOpened) {
      if (!isUnlocked) {
        console.log('🔒 Chest is locked! Complete all lessons first.');
        // Try to trigger locked animation
        if (riveInstance && isLoaded) {
          try {
            const inputs = riveInstance.getStateMachineInputs('State Machine 1') || [];
            const tapInput = inputs.find((input: any) => input.name === 'tap');
            if (tapInput) {
              tapInput.fire();
              console.log('🎯 Triggered locked chest animation');
            }
          } catch (e) {
            console.log('Could not trigger animation:', e);
          }
        }
      }
      return;
    }

    // Open chest
    console.log('🎉 Opening treasure chest!');
    setIsOpened(true);
    
    if (riveInstance && isLoaded) {
      try {
        const inputs = riveInstance.getStateMachineInputs('State Machine 1') || [];
        const tapInput = inputs.find((input: any) => input.name === 'tap');
        if (tapInput) {
          tapInput.fire();
          console.log('🎯 Triggered chest opening animation');
        }
        
        // Try to set opened state
        const openInput = inputs.find((input: any) => input.name === 'isOpen');
        if (openInput) {
          openInput.value = true;
        }
      } catch (e) {
        console.log('Animation trigger error:', e);
      }
    }

    // Award rewards
    setTimeout(() => {
      console.log('💎 Chest opened! Rewards awarded:');
      console.log('   +50 XP');
      console.log('   +5 Blue Gems 💙');
      console.log('   +1 Bonus Item 🎁');
    }, 1500);
  };

  const W = typeof window !== 'undefined' ? window.innerWidth : 400;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleChestPress}
      style={[
        styles.chestContainer,
        {
          left: topicIndex % 2 === 0 ? -60 : W - 140,
        }
      ]}
    >
      <View style={[
        styles.chestWrapper,
        {
          transform: [{ scaleX: topicIndex % 2 === 0 ? 1 : -1 }]
        }
      ]}>
        {/* Canvas for Rive Animation */}
        {Platform.OS === 'web' && (
          <canvas
            ref={canvasRef}
            width={200}
            height={200}
            style={{
              width: 200,
              height: 200,
              borderRadius: 20,
              backgroundColor: 'transparent',
            }}
          />
        )}
        
        {/* Status overlay */}
        <View style={styles.statusOverlay}>
          <Text style={styles.statusText}>
            {isOpened ? '✨ Opened!' : isUnlocked ? '🌟 Ready!' : '🔒 Locked'}
          </Text>
          {isLoaded && (
            <Text style={styles.riveStatus}>🎬 Rive Active</Text>
          )}
        </View>
      </View>

      {/* Glow effect when unlocked */}
      {isUnlocked && !isOpened && (
        <View style={styles.chestGlow} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chestContainer: {
    position: 'absolute',
    bottom: 135,
    alignItems: 'center',
    zIndex: 10,
  },
  
  chestWrapper: {
    width: 200,
    height: 200,
    position: 'relative',
  },
  
  statusOverlay: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  
  statusText: {
    fontSize: 14,
    color: '#FFD76F',
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  
  riveStatus: {
    fontSize: 10,
    color: '#48C586',
    marginTop: 4,
    fontWeight: '600',
  },
  
  chestGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    left: -20,
    top: -20,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 215, 111, 0.2)',
    shadowColor: '#FFD76F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
  },
});

export default WebRiveChest;
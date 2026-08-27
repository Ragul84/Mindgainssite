import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { theme } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export interface LottieAnimationProps {
  source: any; // Lottie JSON source
  size?: number | 'small' | 'medium' | 'large' | 'fill';
  loop?: boolean;
  autoPlay?: boolean;
  speed?: number;
  onComplete?: () => void;
  style?: any;
  containerStyle?: any;
  renderMode?: 'AUTOMATIC' | 'HARDWARE' | 'SOFTWARE';
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  source,
  size = 'medium',
  loop = true,
  autoPlay = true,
  speed = 1,
  onComplete,
  style,
  containerStyle,
  renderMode = 'AUTOMATIC'
}) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (autoPlay && animationRef.current) {
      animationRef.current.play();
    }
  }, [autoPlay]);

  const getSizeValue = () => {
    if (typeof size === 'number') return size;
    
    switch (size) {
      case 'small': return Math.min(width * 0.15, 60);
      case 'medium': return Math.min(width * 0.25, 100);
      case 'large': return Math.min(width * 0.4, 160);
      case 'fill': return '100%';
      default: return Math.min(width * 0.25, 100);
    }
  };

  const sizeValue = getSizeValue();

  return (
    <View style={[
      styles.container,
      {
        width: sizeValue,
        height: sizeValue,
      },
      containerStyle
    ]}>
      <LottieView
        ref={animationRef}
        source={source}
        style={[
          {
            width: '100%',
            height: '100%',
          },
          style
        ]}
        loop={loop}
        speed={speed}
        autoPlay={autoPlay}
        renderMode={renderMode}
        onAnimationFinish={onComplete}
        resizeMode="contain"
      />
    </View>
  );
};

// Predefined animation components for easy use
export const BrainLoadingAnimation: React.FC<Omit<LottieAnimationProps, 'source'>> = (props) => (
  <LottieAnimation
    source={require('@/assets/animations/brain-loading.json')}
    loop={true}
    speed={1.0}
    style={{ backgroundColor: 'transparent' }}
    containerStyle={{ 
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    }}
    {...props}
  />
);

export const CelebrationAnimation: React.FC<Omit<LottieAnimationProps, 'source'>> = (props) => (
  <LottieAnimation
    source={require('@/assets/animations/celebration.json')}
    loop={false}
    {...props}
  />
);

export const MascotCelebrationAnimation: React.FC<Omit<LottieAnimationProps, 'source'>> = (props) => (
  <LottieAnimation
    source={require('@/assets/mascot/celebration.json')}
    loop={true}
    {...props}
  />
);

export const FireStreakAnimation: React.FC<Omit<LottieAnimationProps, 'source'>> = (props) => (
  <LottieAnimation
    source={require('@/assets/animations/fire-streak.json')}
    {...props}
  />
);

export const TrophyWinAnimation: React.FC<Omit<LottieAnimationProps, 'source'>> = (props) => (
  <LottieAnimation
    source={require('@/assets/animations/trophy-win.json')}
    loop={false}
    {...props}
  />
);

export const TrophyAnimation: React.FC<Omit<LottieAnimationProps, 'source'>> = (props) => (
  <LottieAnimation
    source={require('@/assets/animations/trophy.json')}
    {...props}
  />
);

export const CoinsCollectAnimation: React.FC<Omit<LottieAnimationProps, 'source'>> = (props) => (
  <LottieAnimation
    source={require('@/assets/animations/coins-collect.json')}
    loop={false}
    {...props}
  />
);

export const SuccessAnimation: React.FC<Omit<LottieAnimationProps, 'source'>> = (props) => (
  <LottieAnimation
    source={require('@/assets/animations/success.json')}
    loop={false}
    {...props}
  />
);

export const SuccessCheckmarkAnimation: React.FC<Omit<LottieAnimationProps, 'source'>> = (props) => (
  <LottieAnimation
    source={require('@/assets/animations/success-checkmark.json')}
    loop={false}
    {...props}
  />
);

export const LoadingDotsAnimation: React.FC<Omit<LottieAnimationProps, 'source'>> = (props) => (
  <LottieAnimation
    source={require('@/assets/animations/loading-dots.json')}
    size="small"
    {...props}
  />
);

// Mascot Animations
export const MascotEntryAnimation: React.FC<Omit<LottieAnimationProps, 'source'>> = (props) => (
  <LottieAnimation
    source={require('@/assets/animations/mascot/entry.json')}
    loop={false}
    size="large"
    {...props}
  />
);

export const QuizCelebrationAnimation: React.FC<Omit<LottieAnimationProps, 'source'>> = (props) => (
  <LottieAnimation
    source={require('@/assets/animations/mascot/quizcelebration.json')}
    loop={false}
    size="large"
    {...props}
  />
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', // Center within parent
  },
});

export default LottieAnimation;

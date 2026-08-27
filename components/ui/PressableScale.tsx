import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from '@/utils/reanimated';

type Props = {
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  accessibilityLabel?: string;
  activeOpacity?: number;
};

export default function PressableScale({ onPress, children, style, disabled, accessibilityLabel, activeOpacity = 1 }: Props) {
  const scale = useSharedValue(1);

  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const onPressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.97, { damping: 22, stiffness: 350 });
  };
  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 300 });
  };

  return (
    <Animated.View style={aStyle}>
      <TouchableOpacity
        style={style as any}
        activeOpacity={activeOpacity}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}



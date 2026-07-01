import React from 'react';
import { View, StyleSheet, Image, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';

interface MascotAvatarProps {
  emotion?: 'happy' | 'excited' | 'curious' | 'thinking' | 'wave' | 'celebrate';
  size?: number;
  style?: ViewStyle;
}

const MascotAvatar: React.FC<MascotAvatarProps> = ({
  emotion = 'happy',
  size = 100,
  style,
}) => {
  const getLottieSource = () => {
    switch (emotion) {
      case 'excited':
        return require('@/assets/mascot/celebration.json');
      case 'celebrate':
        return require('@/assets/mascot/win.json');
      case 'wave':
        return require('@/assets/mascot/wave.json');
      case 'thinking':
        return require('@/assets/mascot/loading.json');
      default:
        return require('@/assets/mascot/wave.json');
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <LottieView
        source={getLottieSource()}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MascotAvatar;

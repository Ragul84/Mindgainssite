// 🎨 Custom Toast - Beautiful Notifications

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from '@/utils/reanimated';
import { theme } from '@/constants/theme';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  onHide: () => void;
}

const CustomToast: React.FC<ToastProps> = ({ 
  visible, 
  message, 
  type = 'success', 
  onHide 
}) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Show animation
      translateY.value = withTiming(0, { duration: 400 });
      opacity.value = withTiming(1, { duration: 400 });
      
      // Auto hide after 3 seconds
      translateY.value = withDelay(3000, 
        withTiming(-100, { duration: 400 }, (finished) => {
          if (finished) {
            runOnJS(onHide)();
          }
        })
      );
      opacity.value = withDelay(3000, withTiming(0, { duration: 400 }));
    } else {
      translateY.value = withTiming(-100, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          gradient: ['#43e97b', '#38f9d7'],
          icon: 'check-circle',
          bgColor: 'rgba(67, 233, 123, 0.1)',
        };
      case 'info':
        return {
          gradient: ['#4facfe', '#00f2fe'],
          icon: 'info-circle',
          bgColor: 'rgba(79, 172, 254, 0.1)',
        };
      case 'warning':
        return {
          gradient: ['#f093fb', '#f5576c'],
          icon: 'exclamation-triangle',
          bgColor: 'rgba(240, 147, 251, 0.1)',
        };
      case 'error':
        return {
          gradient: ['#ff4757', '#ff3742'],
          icon: 'times-circle',
          bgColor: 'rgba(255, 71, 87, 0.1)',
        };
      default:
        return {
          gradient: ['#43e97b', '#38f9d7'],
          icon: 'check-circle',
          bgColor: 'rgba(67, 233, 123, 0.1)',
        };
    }
  };

  const config = getToastConfig();

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={['rgba(10, 15, 26, 0.95)', 'rgba(16, 23, 38, 0.95)']}
        style={styles.toastCard}
      >
        <View style={styles.toastContent}>
          <LinearGradient colors={config.gradient} style={styles.iconBg}>
            <FontAwesome5 name={config.icon as any} size={16} color="#FFF" solid />
          </LinearGradient>
          
          <Text style={styles.message}>{message}</Text>
        </View>
        
        {/* Subtle border glow */}
        <View style={[styles.borderGlow, { backgroundColor: config.gradient[0] }]} />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 60,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  toastCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  borderGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.6,
  },
});

export default CustomToast;

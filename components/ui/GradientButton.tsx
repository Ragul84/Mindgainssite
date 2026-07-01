import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  colors?: string[];
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  colors = ['#00D4C7', '#174cfc'],
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  size = 'medium',
  fullWidth = false,
}) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      <LinearGradient
        colors={disabled ? ['#BFC9D2', '#BFC9D2'] : colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradient,
          isLarge ? styles.largePadding : isSmall ? styles.smallPadding : styles.mediumPadding,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <View style={styles.content}>
            {icon && icon}
            <Text
              style={[
                styles.text,
                isLarge ? styles.largeText : isSmall ? styles.smallText : styles.mediumText,
                textStyle,
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00D4C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.7,
    shadowOpacity: 0,
    elevation: 0,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallPadding: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumPadding: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largePadding: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});

export default GradientButton;

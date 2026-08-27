import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { V2026 } from '@/theme/v2026-tokens';
import { MotiView } from 'moti';

interface BentoCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'tall' | 'wide';
  gradient?: string[];
  onPress?: () => void;
  style?: ViewStyle;
}

export const BentoCard = ({ title, subtitle, icon, size = 'medium', gradient, onPress, style }: BentoCardProps) => {
  const getCardStyle = () => {
    switch (size) {
      case 'small': return { width: '48%', height: 120 };
      case 'medium': return { width: '48%', height: 160 };
      case 'large': return { width: '100%', height: 200 };
      case 'tall': return { width: '48%', height: 336 }; // 160*2 + 16
      case 'wide': return { width: '100%', height: 160 };
      default: return { width: '48%', height: 160 };
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onPress} 
      style={[styles.container, getCardStyle(), style]}
    >
      <MotiView
        from={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        style={styles.inner}
      >
        {gradient ? (
          <LinearGradient colors={gradient} style={StyleSheet.absoluteFill} borderRadius={V2026.radius.lg} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.glassBackground]} />
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            {icon && <View style={styles.iconWrapper}>{icon}</View>}
          </View>
          
          <View style={styles.footer}>
            <Text style={[styles.title, gradient ? { color: '#FFF' } : {}]} numberOfLines={2}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, gradient ? { color: 'rgba(255,255,255,0.7)' } : {}]} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
      </MotiView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inner: {
    flex: 1,
    borderRadius: V2026.radius.lg,
    overflow: 'hidden',
    ...V2026.shadows.milky,
  },
  glassBackground: {
    backgroundColor: V2026.colors.surface,
    borderColor: V2026.colors.border,
    borderWidth: 1.5,
  },
  content: {
    flex: 1,
    padding: V2026.spacing.md,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 212, 199, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 'auto',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: V2026.colors.text,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: V2026.colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

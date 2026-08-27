// Premium Content Card for MindGains Homepage
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Professional3DCard from './Professional3DCard';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface PremiumContentCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'premium' | 'accent';
  elevation?: 'low' | 'medium' | 'high';
  showArrow?: boolean;
}

export default function PremiumContentCard({
  title,
  subtitle,
  icon,
  iconColor = '#6366f1',
  children,
  onPress,
  style,
  variant = 'default',
  elevation = 'medium',
  showArrow = false,
}: PremiumContentCardProps) {
  return (
    <Professional3DCard
      onPress={onPress}
      style={[styles.container, style]}
      variant={variant}
      elevation={elevation}
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
              <FontAwesome5 
                name={icon} 
                size={18} 
                color={iconColor} 
                solid={false}
              />
            </View>
          )}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        
        {(onPress || showArrow) && (
          <FontAwesome5 
            name="chevron-right" 
            size={14} 
            color="#64748b" 
          />
        )}
      </View>
      
      {children && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </Professional3DCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  textContainer: {
    flex: 1,
  },
  
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: 0.3,
  },
  
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  
  content: {
    marginTop: 16,
  },
});
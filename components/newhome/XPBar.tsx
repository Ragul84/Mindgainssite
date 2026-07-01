// 🎯 XP Bar - Exact copy from newhome with beautiful design
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface XPBarProps {
  progress?: number;
  streak?: number;
  totalXP?: number;
  animated?: boolean;
}

const XPBar = ({ progress = 0.6, streak = 3, totalXP, animated }: XPBarProps) => {
  // Calculate progress from totalXP if provided
  const calculatedProgress = totalXP ? (totalXP % 1000) / 1000 : progress;
  
  return (
    <LinearGradient 
      colors={['rgba(6, 182, 212, 0.35)', 'rgba(14, 165, 233, 0.25)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Left: XP icon and label */}
      <View style={styles.left}>
        <FontAwesome5 name="cat" size={20} color="#041024" />
        <Text style={styles.xpText}>XP</Text>
      </View>

      {/* Center: Progress bar */}
      <View style={styles.barContainer}>
        <LinearGradient
          colors={['#0EA5E9', '#22D3EE', '#0891B2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barFill, { width: `${calculatedProgress * 100}%` }]}
        />
      </View>

      {/* Right: Flame icon and streak count */}
      <View style={styles.right}>
        <Ionicons name="flame" size={20} color="#F97316" />
        <Text style={styles.streakText}>{streak}</Text>
      </View>
    </LinearGradient>
  );
};

// Exact same styles as original newhome
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 6,
    width: '90%',
    height: 50,
    alignSelf: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.5)',
    shadowColor: 'rgba(14, 165, 233, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 25,
    shadowOpacity: 1,
    elevation: 15,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  xpText: {
    color: '#041024',
    fontWeight: '700',
    marginLeft: 4,
    fontSize: 14,
  },
  barContainer: {
    flex: 1,
    height: 15,
    backgroundColor: 'rgba(11, 15, 44, 0.8)',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.2)',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  streakText: {
    color: '#041024',
    marginLeft: 4,
    fontWeight: '700',
    fontSize: 14,
  },
});

export default XPBar;
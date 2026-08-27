import React from 'react';
import { View, Text, StyleSheet, OutlinedText } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // works with Expo or bare RN
import CatIcon from '../../assets/icons/cat.svg'
import FlameIcon from '../../assets/icons/flame.svg'

const XPBar = ({ progress = 0.6, streak = 3 }) => {
  return (
    <LinearGradient 
    colors={['#0828638f', '#000f2963']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}>
      {/* Left: XP icon and label */}
      <View style={styles.left}>
        <CatIcon width={25} height={25} />
        <Text style={styles.xpText}>XP</Text>
      </View>

      {/* Center: Progress bar */}
      <View style={styles.barContainer}>
        <LinearGradient
          colors={['#4dc9ff', '#4d8bffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barFill, { width: `${progress * 100}%` }]}
        />
      </View>

      {/* Right: Flame icon and streak count */}
      <View style={styles.right}>
        <FlameIcon width={25} height={25} />
        <Text style={styles.streakText}>{streak}</Text>
      </View>
    </LinearGradient>
  );
};

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
    borderColor: '#7f839963',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  xpText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 4,
    fontSize: 14,
  },
  barContainer: {
    flex: 1,
    height: 15,
    backgroundColor: '#1a3661dc',
    borderRadius: 10,
    overflow: 'hidden',
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
    color: '#fff',
    marginLeft: 4,
    fontWeight: '700',
    fontSize: 14,
  },
});

export default XPBar;

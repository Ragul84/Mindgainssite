// 📞 SIMPLE CALL NOTIFICATION
// Minimal call overlay with timer and end button

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CallOverlayProps {
  isVisible: boolean;
  onEndCall: () => void;
  isListening: boolean;
  duration: string;
}

export default function CallOverlay({ isVisible, onEndCall, isListening, duration }: CallOverlayProps) {
  if (!isVisible) return null;

  return (
    <>
      {/* Android-style status bar notification */}
      <View style={styles.statusBarNotification}>
        <View style={styles.callIcon}>
          <FontAwesome5 name="phone" size={12} color="#FFF" />
        </View>
        <Text style={styles.callStatusText}>MIGA CALL • {duration}</Text>
        <View style={[styles.recordingDot, { backgroundColor: isListening ? '#00FF00' : '#FF4757' }]} />
      </View>

      {/* Minimal floating call bar */}
      <View style={styles.floatingCallBar}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.95)', 'rgba(0, 0, 0, 0.85)']}
          style={styles.callBarGradient}
        >
          <View style={styles.callInfo}>
            <Text style={styles.callLabel}>📞 MIGA AI</Text>
            <Text style={styles.callTimer}>{duration}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.endButton}
            onPress={onEndCall}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF4757', '#FF3838']}
              style={styles.endButtonGradient}
            >
              <FontAwesome5 
                name="phone" 
                size={16} 
                color="#FFF" 
                style={{ transform: [{ rotate: '135deg' }] }} 
              />
              <Text style={styles.endButtonText}>END</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // Android-style status bar notification
  statusBarNotification: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StatusBar.currentHeight || 24,
    backgroundColor: '#00D4C7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    zIndex: 9999,
  },
  
  callIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  
  callStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
    flex: 1,
  },
  
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  // Floating call bar
  floatingCallBar: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 9998,
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  callBarGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 199, 0.2)',
  },
  
  callInfo: {
    flex: 1,
  },
  
  callLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
  },
  
  callTimer: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00D4C7',
  },
  
  endButton: {
    borderRadius: 20,
  },
  
  endButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  
  endButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
});
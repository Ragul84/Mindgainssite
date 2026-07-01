import React, { useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring } from "@/utils/reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { MotiView } from "moti";

interface ExitConfirmationSheetProps {
  visible: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const { width: SCREEN_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const TARGET_SHEET_HEIGHT = Math.max(400, Math.round(WINDOW_HEIGHT * 0.6));

// Homepage design system colors
const COLORS = {
  primaryBlue: '#00D4C7',
  secondaryBlue: '#00D4C7',
  backgroundDark: '#0A0F1A',
  cardDark: '#101726',
  successMint: '#48C586',
  warmAccent: '#FFD76F',
  textPrimary: '#FFFFFF',
  textSecondary: '#8FA1B4',
  borders: '#2A3240',
};

const ExitConfirmationSheet: React.FC<ExitConfirmationSheetProps> = ({
  visible,
  title = "Leave this session?",
  description = "Your progress for this attempt will be lost. Are you sure you want to exit?",
  confirmLabel = "Exit anyway",
  cancelLabel = "Stay here",
  onConfirm,
  onCancel,
}) => {
  const insets = useSafeAreaInsets();
  const translate = useSharedValue(TARGET_SHEET_HEIGHT + 40);
  const opacity = useSharedValue(0);
  const bottomPadding = Math.max(48, insets.bottom + 36);

  useEffect(() => {
    if (visible) {
      translate.value = withTiming(0, { duration: 250 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translate.value = withTiming(TARGET_SHEET_HEIGHT + 40, { duration: 200 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible, translate, opacity]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translate.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onCancel}>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onCancel} />
        
        <Animated.View style={[styles.sheet, { paddingBottom: bottomPadding }, sheetStyle]}>
          {/* Premium Background with Gradient */}
          <LinearGradient
            colors={[COLORS.cardDark, COLORS.backgroundDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sheetGradient}
          >
            {/* Top Section */}
            <View style={styles.topSection}>
              {/* Handle */}
              <View style={styles.handle} />
              
              {/* Header with Mascot */}
              <View style={styles.header}>
                {/* Warning Icon */}
                <View style={styles.warningIconContainer}>
                  <LinearGradient
                    colors={[COLORS.warmAccent, '#FF8A00']}
                    style={styles.warningIconGradient}
                  >
                    <FontAwesome5 name="exclamation" size={16} color="#000" />
                  </LinearGradient>
                </View>
                
                {/* Mascot */}
                <Image
                  source={require('@/assets/mascot/think.png')}
                  resizeMode="contain"
                  style={styles.mascot}
                />
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              {/* Cancel Button */}
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={onCancel} 
                activeOpacity={0.8}
              >
                <Text style={styles.cancelLabel}>{cancelLabel}</Text>
              </TouchableOpacity>

              {/* Confirm Button */}
              <TouchableOpacity 
                style={styles.confirmBtn}
                onPress={onConfirm} 
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FF6B6B', '#EE5A52']}
                  style={styles.confirmGradient}
                >
                  <Text style={styles.confirmLabel}>{confirmLabel}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 26, 0.92)',
    justifyContent: 'flex-end',
  },
  sheet: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    width: 'auto',
    minHeight: TARGET_SHEET_HEIGHT,
    borderRadius: 24,
    marginTop: 'auto',
    overflow: 'hidden',
  },
  sheetGradient: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    justifyContent: 'space-between',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.primaryBlue + '20',
    shadowColor: COLORS.primaryBlue,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.primaryBlue + '60',
    alignSelf: 'center',
    marginBottom: 32,
  },
  header: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 24,
  },
  warningIconContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 2,
  },
  warningIconGradient: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: {
    width: 90,
    height: 90,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    paddingHorizontal: 8,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borders,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLabel: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ExitConfirmationSheet;


// 🎯 Haptic Feedback Service - Premium vibration patterns for mobile interactions
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export class HapticService {
  // Check if haptics are supported
  static isSupported = Platform.OS !== 'web';

  // Light tap for button presses
  static light = async () => {
    if (!HapticService.isSupported) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Medium tap for lesson selections
  static medium = async () => {
    if (!HapticService.isSupported) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Heavy tap for important actions
  static heavy = async () => {
    if (!HapticService.isSupported) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  // Selection changed feedback
  static selection = async () => {
    if (!HapticService.isSupported) return;
    await Haptics.selectionAsync();
  };

  // Success notification
  static success = async () => {
    if (!HapticService.isSupported) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Warning notification
  static warning = async () => {
    if (!HapticService.isSupported) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  // Error notification
  static error = async () => {
    if (!HapticService.isSupported) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  // Custom pattern for lesson path clicks
  static lessonTap = async () => {
    if (!HapticService.isSupported) return;
    // Quick double tap pattern
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 50);
  };

  // Custom pattern for chest opening
  static chestOpen = async () => {
    if (!HapticService.isSupported) return;
    // Build up pattern
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 100);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 200);
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 300);
  };

  // Custom pattern for navigation
  static navigate = async () => {
    if (!HapticService.isSupported) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Tab bar selection
  static tabSelect = async () => {
    if (!HapticService.isSupported) return;
    await Haptics.selectionAsync();
  };
}

export default HapticService;
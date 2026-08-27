import React, { useMemo } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface PremiumGateModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName?: string;
}

const getFeatureCopy = (featureName?: string) => {
  if (featureName === 'topic_completion') {
    return {
      title: 'Daily Limit Reached',
      message: 'You have used your free lesson quota for today. Upgrade to continue learning without interruptions.',
    };
  }

  if (featureName === 'story_learn') {
    return {
      title: 'Unlock Story Learn',
      message: 'Upgrade your plan to unlock unlimited story-based learning and advanced AI transforms.',
    };
  }

  return {
    title: 'Premium Feature',
    message: 'Upgrade your plan to continue with this feature.',
  };
};

export function PremiumGateModal({
  visible,
  onClose,
  onUpgrade,
  featureName,
}: PremiumGateModalProps) {
  const copy = useMemo(() => getFeatureCopy(featureName), [featureName]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.badge}>PREMIUM</Text>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.message}>{copy.message}</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Not now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onUpgrade}>
              <Text style={styles.buttonText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 18,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0f766e',
    color: '#e6fffb',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  title: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  primaryButton: {
    backgroundColor: '#14b8a6',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0f172a',
  },
  buttonText: {
    color: '#042f2e',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#e2e8f0',
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Clipboard from 'expo-clipboard';
import { HeistSoundService } from '@/services/heistSoundService';

interface BagsAddressModalProps {
  visible: boolean;
  currentAddress: string | null;
  onSave: (address: string) => Promise<void>;
  onClose: () => void;
  onRemove?: () => Promise<void>;
}

export default function BagsAddressModal({
  visible,
  currentAddress,
  onSave,
  onClose,
  onRemove,
}: BagsAddressModalProps) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setAddress(currentAddress || '');
    }
  }, [visible, currentAddress]);

  const handlePaste = async () => {
    const content = await Clipboard.getStringAsync();
    setAddress(content.trim());
    HeistSoundService.play('correct', { volume: 0.5 });
  };

  const validate = (addr: string) => {
    const trimmed = addr.trim();
    if (!trimmed) return "Address cannot be empty.";
    if (trimmed.length < 20) return "Address must be at least 20 characters.";
    if (!/^[a-zA-Z0-9]+$/.test(trimmed)) return "Invalid characters in address. Use only alphanumeric characters.";
    return null;
  };

  const handleSave = async () => {
    const error = validate(address);
    if (error) {
      Alert.alert("Invalid Address", error);
      return;
    }

    setLoading(true);
    try {
      await onSave(address.trim());
    } catch (e: any) {
        Alert.alert("Error", e.message || "Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!onRemove) return;
    
    Alert.alert(
      "Remove Address",
      "Are you sure you want to remove your Bags wallet address? You won't be able to receive rewards.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await onRemove();
              onClose();
            } catch (e: any) {
                Alert.alert("Error", e.message || "Failed to remove address.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <BlurView intensity={30} tint="light" style={styles.blur}>
          <View style={styles.card}>
            <LinearGradient
              colors={['#F0F9FF', '#FFFFFF']}
              style={styles.cardGradient}
            />
            
            <View style={styles.header}>
              <View style={styles.iconBox}>
                <FontAwesome5 name="wallet" size={24} color="#0EA5E9" solid />
              </View>
              <Text style={styles.title}>BAGS WALLET</Text>
              <Text style={styles.subtitle}>Enter your address to receive rewards</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Paste wallet address here..."
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={handlePaste} style={styles.pasteBtn}>
                <Text style={styles.pasteText}>PASTE</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity 
                onPress={onClose} 
                style={[styles.btn, styles.cancelBtn]}
                disabled={loading}
              >
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleSave} 
                style={[styles.btn, styles.saveBtn]}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#0EA5E9', '#0284C7']}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.saveText}>{loading ? 'SAVING...' : 'SAVE'}</Text>
              </TouchableOpacity>
            </View>

            {currentAddress && onRemove && (
              <TouchableOpacity onPress={handleRemove} style={styles.removeBtn}>
                <Text style={styles.removeText}>Remove address</Text>
              </TouchableOpacity>
            )}
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 20,
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#0F172A',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  pasteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
  },
  pasteText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#0EA5E9',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cancelBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  saveBtn: {
    position: 'relative',
  },
  cancelText: {
    color: '#64748B',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  saveText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  removeBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  removeText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
});


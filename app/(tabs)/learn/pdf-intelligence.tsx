import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { SupabaseService } from '@/utils/supabaseService';
import HapticService from '@/utils/hapticService';
import UniversalNavigation from '@/utils/universalNavigation';
import { V2026 } from '@/theme/v2026-tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FileInfo {
  name: string;
  size: number;
  uri: string;
}

export default function PDFIntelligenceScreen() {
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setSelectedFile({
          name: file.name,
          size: file.size || 0,
          uri: file.uri,
        });
        HapticService.light();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    HapticService.medium();
    setLoading(true);
    setProcessingStep('Reading PDF...');

    try {
      setProcessingStep('Neural Extraction...');
      const base64 = await FileSystem.readAsStringAsync(selectedFile.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setProcessingStep('Synthesizing Knowledge...');
      const { data } = await SupabaseService.callEdgeFunction('process_pdf', {
        file_base64: base64,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
      });

      if (data) {
          HapticService.success();
          UniversalNavigation.navigateTo({
            pathname: '/learn/content-viewer',
            params: { 
                contentId: data.studyNotesId || '', 
                contentType: 'study_notes', 
                source: 'pdf', 
                title: selectedFile.name || 'PDF Notes', 
                directContent: data.extracted_text || '' 
            }
          });
      } else {
          throw new Error("Processing failed");
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process the PDF. Please try a smaller or text-based file.');
    } finally {
      setLoading(false);
      setProcessingStep('');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>PDF Intelligence</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>DOCUMENT AI</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <MotiView 
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', damping: 20 }}
            >
                <View style={styles.heroCard}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="document-text" size={32} color="#F59E0B" />
                    </View>
                    <Text style={styles.heroTitle}>Deep Book Synthesis</Text>
                    <Text style={styles.heroSubtitle}>Convert massive PDFs into concise study sessions and interactive summaries in seconds.</Text>
                </View>

                {!selectedFile ? (
                    <TouchableOpacity style={styles.uploadArea} activeOpacity={1} onPress={handlePickDocument}>
                        <View style={styles.uploadInner}>
                            <View style={styles.uploadIconCircle}>
                                <Ionicons name="cloud-upload" size={32} color="#F59E0B" />
                            </View>
                            <Text style={styles.uploadTitle}>SELECT PDF DOCUMENT</Text>
                            <Text style={styles.uploadSubtitle}>Supports up to 20MB files</Text>
                        </View>
                        <View style={styles.uploadBorder} />
                    </TouchableOpacity>
                ) : (
                    <MotiView 
                        from={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.fileCard}
                    >
                        <View style={styles.fileIconBox}>
                            <Ionicons name="file-tray-full" size={28} color="#F59E0B" />
                        </View>
                        <View style={styles.fileInfo}>
                            <Text style={styles.fileName} numberOfLines={1}>{selectedFile.name}</Text>
                            <Text style={styles.fileSize}>{formatFileSize(selectedFile.size)}</Text>
                        </View>
                        <TouchableOpacity style={styles.removeBtn} activeOpacity={1} onPress={() => setSelectedFile(null)}>
                            <Ionicons name="close" size={20} color="#94A3B8" />
                        </TouchableOpacity>
                    </MotiView>
                )}

                <TouchableOpacity 
                    style={[styles.processBtn, (!selectedFile || loading) && styles.disabledBtn]} 
                    onPress={handleProcess}
                    disabled={!selectedFile || loading}
                 activeOpacity={1} >
                    <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.processGrad} start={{x:0, y:0}} end={{x:1, y:0}}>
                        {loading ? (
                            <View style={styles.loadingRow}>
                                <ActivityIndicator color="#FFF" />
                                <Text style={styles.loadingStepText}>{processingStep.toUpperCase()}</Text>
                            </View>
                        ) : (
                            <View style={styles.btnContent}>
                                <Text style={styles.processText}>INITIALIZE ANALYSIS</Text>
                                <Ionicons name="flash" size={18} color="#FFF" />
                            </View>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.capabilitiesContainer}>
                    <Text style={styles.capLabel}>WHAT WE EXTRACT</Text>
                    <View style={styles.capGrid}>
                        <View style={styles.capItem}>
                            <View style={styles.capIcon}>
                              <Ionicons name="key" size={18} color="#F59E0B" />
                            </View>
                            <Text style={styles.capText}>Core Logic</Text>
                        </View>
                        <View style={styles.capItem}>
                            <View style={styles.capIcon}>
                              <Ionicons name="checkbox" size={18} color="#F59E0B" />
                            </View>
                            <Text style={styles.capText}>Quizzes</Text>
                        </View>
                        <View style={styles.capItem}>
                            <View style={styles.capIcon}>
                              <Ionicons name="git-network" size={18} color="#F59E0B" />
                            </View>
                            <Text style={styles.capText}>Concepts</Text>
                        </View>
                    </View>
                </View>
            </MotiView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  backBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center',
    ...V2026.shadows.milky,
  },
  headerTitleContainer: { flex: 1 },
  headerTitle: { color: '#1E293B', fontSize: 24, fontFamily: 'Poppins-Bold' },
  badge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: -2,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#D97706',
  },
  content: { paddingHorizontal: 24, paddingBottom: 100 },
  heroCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    ...V2026.shadows.milky,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  iconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(245, 158, 11, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
  },
  heroTitle: {
      fontSize: 22,
      fontFamily: 'Poppins-Bold',
      color: '#1E293B',
      marginBottom: 8,
      textAlign: 'center',
  },
  heroSubtitle: {
      fontSize: 14,
      color: '#64748B',
      fontFamily: 'Inter-Medium',
      lineHeight: 20,
      textAlign: 'center',
  },
  uploadArea: {
    backgroundColor: 'white',
    borderRadius: 28,
    height: 180,
    ...V2026.shadows.milky,
    overflow: 'hidden',
  },
  uploadInner: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
  },
  uploadIconCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#FEF3C7',
      alignItems: 'center',
      justifyContent: 'center',
  },
  uploadTitle: {
      color: '#1E293B',
      fontSize: 13,
      fontFamily: 'Poppins-Bold',
      letterSpacing: 0.5,
  },
  uploadSubtitle: {
      color: '#94A3B8',
      fontSize: 11,
      fontFamily: 'Inter-SemiBold',
  },
  uploadBorder: {
      ...StyleSheet.absoluteFillObject,
      borderWidth: 2,
      borderColor: '#FEF3C7',
      borderStyle: 'dashed',
      borderRadius: 28,
      margin: 4,
  },
  fileCard: {
      backgroundColor: 'white',
      borderRadius: 24,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      ...V2026.shadows.milky,
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.1)',
  },
  fileIconBox: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: '#FEF3C7',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
  },
  fileInfo: {
      flex: 1,
  },
  fileName: {
      color: '#1E293B',
      fontSize: 15,
      fontFamily: 'Poppins-Bold',
  },
  fileSize: {
      color: '#94A3B8',
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      marginTop: 2,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processBtn: {
    marginTop: 24,
    borderRadius: 18,
    overflow: 'hidden',
    ...V2026.shadows.milky,
  },
  disabledBtn: { opacity: 0.5 },
  processGrad: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  loadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  loadingStepText: {
      color: '#FFF',
      fontSize: 12,
      fontFamily: 'Poppins-Bold',
      letterSpacing: 0.5,
  },
  btnContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
  },
  processText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },
  capabilitiesContainer: {
      marginTop: 32,
  },
  capLabel: {
      color: '#94A3B8',
      fontSize: 11,
      fontFamily: 'Poppins-Bold',
      letterSpacing: 2,
      marginBottom: 20,
      textAlign: 'center',
  },
  capGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      borderRadius: 24,
      padding: 20,
      ...V2026.shadows.milky,
  },
  capItem: {
      alignItems: 'center',
      flex: 1,
      gap: 8,
  },
  capIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capText: {
      color: '#1E293B',
      fontSize: 12,
      fontFamily: 'Poppins-SemiBold',
  }
});


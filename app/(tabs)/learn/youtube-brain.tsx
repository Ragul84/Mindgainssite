import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
import { SupabaseService } from '@/utils/supabaseService';
import HapticService from '@/utils/hapticService';
import UniversalNavigation from '@/utils/universalNavigation';
import { V2026 } from '@/theme/v2026-tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function YouTubeBrainScreen() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (!url.trim()) return Alert.alert("Required", "Please paste a YouTube URL.");
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        return Alert.alert("Invalid URL", "Please provide a valid YouTube link.");
    }

    HapticService.medium();
    setLoading(true);
    
    try {
        const { data } = await SupabaseService.callEdgeFunction('learn_ai', {
            feature_type: 'youtube_intelligence',
            video_url: url
        });

        if (data?.studyNotesId) {
            HapticService.success();
            UniversalNavigation.navigateTo({
                pathname: '/learn/content-viewer',
                params: { 
                    contentId: data.studyNotesId, 
                    contentType: 'study_notes', 
                    source: 'youtube', 
                    title: data.videoMetadata?.title || 'Video Notes',
                    directContent: data.content || ''
                }
            });
        } else {
            throw new Error("Notes generation failed");
        }
    } catch (e: any) {
        Alert.alert("Error", e.message || "Failed to process video. Please try another one.");
    } finally {
        setLoading(false);
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
            <Text style={styles.headerTitle}>YouTube Master</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>VIDEO SYNTHESIS</Text>
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
                        <Ionicons name="logo-youtube" size={32} color="#EF4444" />
                    </View>
                    <Text style={styles.heroTitle}>Vid-to-Mind Transfer</Text>
                    <Text style={styles.heroSubtitle}>Paste any educational video link to extract structured study logic and concise notes.</Text>
                </View>

                <View style={styles.inputCard}>
                    <View style={styles.inputHeader}>
                        <Ionicons name="link" size={16} color="#EF4444" />
                        <Text style={styles.inputLabel}>VIDEO URL</Text>
                    </View>
                    <TextInput 
                        style={styles.textInput}
                        placeholder="https://www.youtube.com/watch?v=..."
                        placeholderTextColor="#94A3B8"
                        value={url}
                        onChangeText={setUrl}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.processBtn, loading && styles.disabledBtn]} 
                    onPress={handleProcess}
                    disabled={loading}
                 activeOpacity={1} >
                    <LinearGradient 
                      colors={['#EF4444', '#DC2626']} 
                      style={styles.processGrad}
                      start={{x:0, y:0}}
                      end={{x:1, y:0}}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <View style={styles.btnContent}>
                                <Text style={styles.processText}>EXTRACT KNOWLEDGE</Text>
                                <Ionicons name="flash" size={18} color="#FFF" />
                            </View>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>POWER TIPS</Text>
                    <View style={styles.tipBox}>
                        <View style={styles.tipRow}>
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <Text style={styles.tipText}>Works best with lectures and tutorials.</Text>
                        </View>
                        <View style={styles.tipRow}>
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <Text style={styles.tipText}>Extracts core timelines and formulas automatically.</Text>
                        </View>
                        <View style={styles.tipRow}>
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <Text style={styles.tipText}>Supports chapters and deep analysis.</Text>
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
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: -2,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#EF4444',
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
      backgroundColor: 'rgba(239, 68, 68, 0.05)',
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
  inputCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    ...V2026.shadows.milky,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  inputHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
  },
  inputLabel: {
      color: '#94A3B8',
      fontSize: 11,
      fontFamily: 'Poppins-Bold',
      letterSpacing: 1.5,
  },
  textInput: {
    color: '#1E293B',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    paddingVertical: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  processBtn: {
    marginTop: 24,
    borderRadius: 18,
    overflow: 'hidden',
    ...V2026.shadows.milky,
  },
  disabledBtn: { opacity: 0.6 },
  processGrad: {
    paddingVertical: 18,
    alignItems: 'center',
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
  tipsContainer: {
      marginTop: 32,
  },
  tipsTitle: {
      color: '#94A3B8',
      fontSize: 11,
      fontFamily: 'Poppins-Bold',
      letterSpacing: 2,
      marginBottom: 16,
  },
  tipBox: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    ...V2026.shadows.milky,
    gap: 16,
  },
  tipRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  tipText: {
      color: '#475569',
      fontSize: 13,
      fontFamily: 'Inter-Medium',
  }
});


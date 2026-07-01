// 🧠 Smart Explain – Elegant & Premium
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
  Share,
  StatusBar,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView, AnimatePresence } from 'moti';
import { SupabaseService } from '@/utils/supabaseService';
import HapticService from '@/utils/hapticService';
import { V2026 } from '@/theme/v2026-tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MODES = [
  { id: 'simple', title: 'Simple', icon: 'bulb', gradient: ['#F59E0B', '#D97706'], prompt: 'Explain this concept very simply.' },
  { id: 'deep', title: 'Deep Dive', icon: 'layers', gradient: ['#3B82F6', '#2563EB'], prompt: 'Provide a very detailed explanation.' },
  { id: 'analogy', title: 'Analogy', icon: 'link', gradient: ['#8B5CF6', '#7C3AED'], prompt: 'Use analogies to explain this.' },
  { id: 'exam', title: 'Exam Focus', icon: 'ribbon', gradient: ['#10B981', '#059669'], prompt: 'Explain focusing on exam relevance.' },
];

export default function SmartExplainScreen() {
  const [topic, setTopic] = useState('');
  const [selectedMode, setSelectedMode] = useState(MODES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleProcess = async () => {
    if (!topic.trim()) return Alert.alert("Empty", "Please enter a topic first.");
    HapticService.medium();
    setLoading(true);
    setResult('');
    
    try {
        const { data } = await SupabaseService.callEdgeFunction('learn_ai', {
            feature_type: 'ai_generation',
            messages: [
                { role: 'system', content: `You are an expert tutor. ${selectedMode.prompt}` },
                { role: 'user', content: topic }
            ]
        });
        if (data?.content) {
          setResult(data.content);
          HapticService.success();
        }
        else throw new Error("No response");
    } catch (e) {
        Alert.alert("Error", "Failed to get explanation. Try again.");
    } finally {
        setLoading(false);
    }
  }

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
            <Text style={styles.headerTitle}>Smart Explain</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>CONCEPT MASTERY</Text>
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
                    <Text style={styles.heroTitle}>Deep Concept Analysis</Text>
                    <Text style={styles.heroSubtitle}>Understand complex topics through simplified logic, deep dives, or analogies.</Text>
              </View>

              <View style={styles.modeSection}>
                  <Text style={styles.sectionLabel}>EXPLANATION STYLE</Text>
                  <View style={styles.modeGrid}>
                      {MODES.map(mode => (
                          <TouchableOpacity 
                              key={mode.id} 
                              activeOpacity={1} onPress={() => { HapticService.light(); setSelectedMode(mode); }}
                              style={styles.modeTab}
                          >
                                <MotiView 
                                  animate={{ 
                                    scale: selectedMode.id === mode.id ? 1.05 : 1,
                                    backgroundColor: selectedMode.id === mode.id ? 'white' : 'transparent'
                                  }}
                                  style={[styles.modeIconBox, selectedMode.id === mode.id && styles.activeModeBox]}
                                >
                                    <LinearGradient 
                                        colors={selectedMode.id === mode.id ? mode.gradient as any : ['#F1F5F9', '#F1F5F9'] as any} 
                                        style={styles.modeIconGrad}
                                    >
                                        <Ionicons name={mode.icon as any} size={20} color={selectedMode.id === mode.id ? '#FFF' : '#64748B'} />
                                    </LinearGradient>
                                </MotiView>
                                <Text style={[styles.modeLabel, selectedMode.id === mode.id && styles.activeModeLabel]}>{mode.title}</Text>
                          </TouchableOpacity>
                      ))}
                  </View>
              </View>

              <View style={styles.inputCard}>
                  <TextInput 
                      style={styles.textInput}
                      placeholder="What concept do you want to understand?"
                      placeholderTextColor="#94A3B8"
                      multiline
                      value={topic}
                      onChangeText={setTopic}
                      textAlignVertical="top"
                  />
              </View>

              <TouchableOpacity 
                  style={[styles.processBtn, loading && styles.disabledBtn]} 
                  onPress={handleProcess}
                  disabled={loading}
               activeOpacity={1} >
                  <LinearGradient colors={selectedMode.gradient as any} style={styles.processGrad} start={{x:0, y:0}} end={{x:1, y:0}}>
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <View style={styles.btnContent}>
                            <Text style={styles.processText}>EXPLAIN TO ME</Text>
                            <Ionicons name="flash" size={18} color="#FFF" />
                        </View>
                    )}
                  </LinearGradient>
              </TouchableOpacity>

              <AnimatePresence>
                {result ? (
                  <MotiView 
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={styles.resultCard}
                  >
                      <View style={styles.resultHeader}>
                        <Text style={styles.resultTitle}>EXPLANATION</Text>
                        <View style={styles.resultActions}>
                            <TouchableOpacity style={styles.resIconBtn} activeOpacity={1} onPress={() => { Clipboard.setStringAsync(result); Alert.alert("Copied!"); }}>
                              <Ionicons name="copy-outline" size={18} color={V2026.colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.resIconBtn} activeOpacity={1} onPress={() => Share.share({ message: result })}>
                              <Ionicons name="share-outline" size={18} color={V2026.colors.primary} />
                            </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.divider} />
                      <Text style={styles.resultText}>{result}</Text>
                  </MotiView>
                ) : null}
              </AnimatePresence>
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
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: -2,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#0EA5E9',
  },
  content: { paddingHorizontal: 24, paddingBottom: 100 },
  heroCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    ...V2026.shadows.milky,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  heroTitle: {
      fontSize: 22,
      fontFamily: 'Poppins-Bold',
      color: '#1E293B',
      marginBottom: 8,
  },
  heroSubtitle: {
      fontSize: 14,
      color: '#64748B',
      fontFamily: 'Inter-Medium',
      lineHeight: 20,
  },
  modeSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  modeGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  modeTab: { alignItems: 'center', flex: 1 },
  modeIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    padding: 2,
    marginBottom: 8,
  },
  activeModeBox: {
    ...V2026.shadows.milky,
  },
  modeIconGrad: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeLabel: { color: '#94A3B8', fontSize: 12, fontFamily: 'Poppins-SemiBold' },
  activeModeLabel: { color: '#1E293B' },
  inputCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    minHeight: 120,
    ...V2026.shadows.milky,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  textInput: { 
    color: '#1E293B', 
    fontSize: 16, 
    fontFamily: 'Poppins-SemiBold', 
    minHeight: 80,
    lineHeight: 24,
  },
  processBtn: { marginTop: 24, borderRadius: 18, overflow: 'hidden', ...V2026.shadows.milky },
  disabledBtn: { opacity: 0.6 },
  processGrad: { paddingVertical: 18, alignItems: 'center' },
  btnContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
  },
  processText: { color: '#FFF', fontSize: 15, fontFamily: 'Poppins-Bold', letterSpacing: 0.5 },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginTop: 24,
    ...V2026.shadows.milky,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  resultTitle: { color: '#94A3B8', fontSize: 11, fontFamily: 'Poppins-Bold', letterSpacing: 1.5 },
  resultActions: { flexDirection: 'row', gap: 12 },
  resIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  resultText: { color: '#1E293B', fontSize: 15, lineHeight: 24, fontFamily: 'Inter-Medium' },
});


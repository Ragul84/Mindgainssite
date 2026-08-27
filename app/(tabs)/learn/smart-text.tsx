// 🤖 AI Text Master – Minimal & Powerful
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
  { id: 'summarize', title: 'Summary', icon: 'list', gradient: ['#8B5CF6', '#7C3AED'], prompt: 'Summarize this precisely.' },
  { id: 'explain', title: 'Explain', icon: 'bulb', gradient: ['#F59E0B', '#D97706'], prompt: 'Explain this like I am 5.' },
  { id: 'notes', title: 'Notes', icon: 'journal', gradient: ['#3B82F6', '#2563EB'], prompt: 'Extract key study notes.' },
  { id: 'quiz', title: 'Quiz', icon: 'help-circle', gradient: ['#10B981', '#059669'], prompt: 'Make 3 quick questions.' },
];

export default function SmartTextScreen() {
  const [input, setInput] = useState('');
  const [selectedMode, setSelectedMode] = useState(MODES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleProcess = async () => {
    if (!input.trim()) return Alert.alert("Empty", "Please paste some text first.");
    HapticService.medium();
    setLoading(true);
    setResult('');
    
    try {
        const { data } = await SupabaseService.callEdgeFunction('learn_ai', {
            feature_type: 'ai_generation',
            messages: [
                { role: 'system', content: `You are a study assistant. ${selectedMode.prompt}` },
                { role: 'user', content: input }
            ]
        });
        if (data?.content) {
          setResult(data.content);
          HapticService.success();
        }
        else throw new Error("No response");
    } catch (e) {
        Alert.alert("Error", "Failed to process text. Try again.");
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
            <Text style={styles.headerTitle}>AI Text Master</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>SMART RECALL</Text>
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
                    <Text style={styles.heroTitle}>Text-to-Knowledge</Text>
                    <Text style={styles.heroSubtitle}>Paste any material to instantly synthesize key insights and practice units.</Text>
                </View>

                {/* Mode Selection */}
                <View style={styles.modeSection}>
                    <Text style={styles.sectionLabel}>SYNTHESIS MODE</Text>
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
                                        <Ionicons name={mode.icon as any} size={22} color={selectedMode.id === mode.id ? '#FFF' : '#64748B'} />
                                    </LinearGradient>
                                </MotiView>
                                <Text style={[styles.modeLabel, selectedMode.id === mode.id && styles.activeModeLabel]}>{mode.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Input Box */}
                <View style={styles.inputCard}>
                    <TextInput 
                        style={styles.textInput}
                        placeholder="Paste your study material here..."
                        placeholderTextColor="#94A3B8"
                        multiline
                        value={input}
                        onChangeText={setInput}
                        textAlignVertical="top"
                    />
                    <View style={styles.inputFooter}>
                        <Text style={styles.charCount}>{input.length} chars</Text>
                        <TouchableOpacity 
                          style={styles.pasteIconBtn}
                          activeOpacity={1} onPress={async () => {
                            const text = await Clipboard.getStringAsync();
                            setInput(text);
                            HapticService.light();
                        }}>
                            <Ionicons name="clipboard-outline" size={16} color={V2026.colors.primary} />
                            <Text style={styles.pasteBtnText}>PASTE</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Action */}
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
                                <Text style={styles.processText}>SYNTHESIZE {selectedMode.title.toUpperCase()}</Text>
                                <Ionicons name="sparkles" size={18} color="#FFF" />
                            </View>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                {/* Result Area */}
                <AnimatePresence>
                    {result ? (
                        <MotiView 
                            from={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={styles.resultCard}
                        >
                            <View style={styles.resultHeader}>
                                <Text style={styles.resultTitle}>NEURAL OUTPUT</Text>
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
  modeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeTab: {
    alignItems: 'center',
    flex: 1,
  },
  modeIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    padding: 2,
    marginBottom: 8,
  },
  activeModeBox: {
    ...V2026.shadows.milky,
  },
  modeIconGrad: {
    flex: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  activeModeLabel: {
    color: '#1E293B',
  },
  inputCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    ...V2026.shadows.milky,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
    minHeight: 200,
  },
  textInput: {
    color: '#1E293B',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    minHeight: 120,
    lineHeight: 22,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  charCount: { color: '#94A3B8', fontSize: 12, fontFamily: 'Inter-SemiBold' },
  pasteIconBtn: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pasteBtnText: { color: '#0EA5E9', fontSize: 11, fontFamily: 'Poppins-Bold', letterSpacing: 0.5 },
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
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginTop: 24,
    ...V2026.shadows.milky,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: { 
    color: '#94A3B8', 
    fontSize: 11, 
    fontFamily: 'Poppins-Bold', 
    letterSpacing: 1.5 
  },
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
  resultText: {
    color: '#1E293B',
    fontSize: 15,
    lineHeight: 24,
    fontFamily: 'Inter-Medium',
  },
});


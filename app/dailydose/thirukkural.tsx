import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Share,
  StatusBar,
  Animated,
  Easing,
  Platform,
  Image,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { supabase, SupabaseService } from '@/utils/supabaseService';
import { theme } from '@/constants/theme';

import { mascotApi } from '@/services/mascotApi';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- CONSTANTS & THEME ---
const COLORS = {
  backgroundDark: '#F8FAFC',
  primaryTurquoise: '#00D4C7',
  secondaryViolet: '#6366f1',
  textPrimary: '#0F172A',
  textSecondary: '#94a3b8',
  quoteColor: 'rgba(0, 212, 199, 0.4)',
};

import { V2026 } from '@/theme/v2026-tokens';

// --- TYPES ---
interface ThirukkuralData {
  kural_number: number;
  chapter_tamil: string;
  chapter_english: string;
  kural_tamil: string;
  kural_transliteration: string;
  meaning_tamil: string;
  meaning_english: string;
  explanation_modern: string;
  life_application: string;
  theme?: string;
  special_occasion?: string;
  [key: string]: any; 
}

const LANGUAGES = [
  { label: 'Tamil', code: 'ta', sarvam: 'ta-IN' },
  { label: 'English', code: 'en', sarvam: 'en-IN' },
  { label: 'Hindi', code: 'hi', sarvam: 'hi-IN' },
  { label: 'Telugu', code: 'te', sarvam: 'te-IN' },
  { label: 'Kannada', code: 'kn', sarvam: 'kn-IN' },
  { label: 'Malayalam', code: 'ml', sarvam: 'ml-IN' },
  { label: 'Marathi', code: 'mr', sarvam: 'mr-IN' },
  { label: 'Bengali', code: 'bn', sarvam: 'bn-IN' },
  { label: 'Gujarati', code: 'gu', sarvam: 'gu-IN' },
];
// --- ANIMATIONS & EFFECTS (REMOVED FOR V2026 MINIMALISM) ---
// Ambient particle and sparkle effects have been replaced by the sleek CSS-driven glass UI.

// --- MAIN SCREEN ---
export default function ThirukkuralScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [data, setData] = useState<ThirukkuralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to English meaning
  const [translatedData, setTranslatedData] = useState<Partial<ThirukkuralData>>({});
  const [kuralOffset, setKuralOffset] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [sparkles, setSparkles] = useState<{id: number; x: number; y: number}[]>([]);

  // Animations
  const lottieRef = useRef<LottieView>(null);
  const cardScale = useRef(new Animated.Value(0.95)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const sparkleIdRef = useRef(0);

  useEffect(() => {
    // Enable audio playback in silent mode (iOS)
    async function configureAudio() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true, // Critical for iOS
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        console.error('Failed to set audio mode', e);
      }
    }
    configureAudio();

    loadDailyThirukkural();
    Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 600, useNativeDriver: true })
    ]).start();
    return () => { if (sound) sound.unloadAsync(); };
  }, []);

  // Auto-play on load
  useEffect(() => {
    if (data && !loading) {
      setTimeout(() => {
        handleAudio();
      }, 500);
    }
  }, [data, loading]);

  const loadDailyThirukkural = async (overrideOffset?: number) => {
    try {
      setLoading(true);
      // Synchronize with homepage dayOfYear logic
      const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      const offset = overrideOffset ?? kuralOffset;
      const offsetIndex = ((dayOfYear + offset) % 1330 + 1330) % 1330;
      
      const { data: result, error } = await supabase
        .from('thirukkural')
        .select('*')
        .eq('kural_number', offsetIndex + 1) // Cycle through all kurals
        .single();

      if (error || !result) {
        setData(getFallbackThirukkural(offset));
      } else {
        setData(result as ThirukkuralData);
        checkIfLiked(result.kural_number);
        trackInteraction('viewed', result.kural_number);
      }
    } catch {
      setData(getFallbackThirukkural(overrideOffset ?? kuralOffset));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (kuralOffset !== 0) {
      loadDailyThirukkural(kuralOffset);
    }
  }, [kuralOffset]);

  const handleNextKural = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setIsPlaying(false);
    setTranslatedData({});
    const nextOffset = kuralOffset + 1;
    setKuralOffset(nextOffset);
    loadDailyThirukkural(nextOffset);
  };

  const checkIfLiked = async (kuralId: number) => {
    try {
      const user = await SupabaseService.getCurrentUser();
      if (!user) return;
      const { data } = await supabase.from('thirukkural_interactions').select('*')
        .eq('user_id', user.id).eq('kural_id', kuralId).eq('interaction_type', 'liked').single();
      if (data) setLiked(true);
    } catch {}
  };

  // Handle finger drag for sparkle effect
  const handleTouch = (event: any) => {
    const { locationX, locationY, pageX, pageY } = event.nativeEvent;
    const newSparkle = {
      id: sparkleIdRef.current++,
      x: pageX || locationX,
      y: pageY || locationY
    };
    
    setSparkles(prev => [...prev, newSparkle]);
    
    // Clean up old sparkles after animation completes
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 600);
  };

  const trackInteraction = async (type: string, kuralId?: number) => {
    try {
      const user = await SupabaseService.getCurrentUser();
      if (!user) return;
      await supabase.from('thirukkural_interactions').upsert({
        user_id: user.id, kural_id: kuralId || data?.kural_number, interaction_type: type
      }, { onConflict: 'user_id,kural_id,interaction_type' });
    } catch {}
  };

  const getFallbackThirukkural = (offset: number = 0): ThirukkuralData => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const kurals = [
      {
        kural_number: 1,
        chapter_tamil: 'கடவுள் வாழ்த்து', chapter_english: 'Praise of God',
        kural_tamil: 'அகர முதல எழுத்தெல்லாம் ஆதி\nபகவன் முதற்றே உலகு',
        kural_transliteration: 'Agara mudhala ezhuthellam aadhi\nBhagavan mudhatre ulagu',
        meaning_tamil: 'எழுத்துக்கள் எல்லாம் அகரத்தில் தொடங்குவது போல, உலகம் கடவுளில் தொடங்குகிறது',
        meaning_english: 'As text A is the first of all letters, so the eternal God is first in the world',
        explanation_modern: 'Foundations are key to everything.',
        life_application: 'Start with basics.',
        theme: 'Foundation',
      },
      {
        kural_number: 391,
        chapter_tamil: 'கல்வி', chapter_english: 'Learning',
        kural_tamil: 'கற்க கசடறக் கற்பவை கற்றபின்\nநிற்க அதற்குத் தக',
        kural_transliteration: 'Karka kasadara karpavai kattrapin\nNirka adharku thaga',
        meaning_tamil: 'கற்க வேண்டியவற்றை பிழையறக் கற்க வேண்டும்; கற்றபின் அதன்படி நடக்க வேண்டும்.',
        meaning_english: 'Learn thoroughly what should be learned, and then live according to what you have learned.',
        explanation_modern: 'Walk the talk. Knowledge without action is useless.',
        life_application: 'Practice what you learn immediately.',
        theme: 'Integrity',
      }
    ];
    return kurals[(dayOfYear + offset) % kurals.length];
  };

  const handleLike = () => { 
    setLiked(!liked); 
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    trackInteraction(!liked ? 'liked' : 'viewed'); 
  };
  const handleShare = async () => {
    if (!data || isSharing) return;
    
    setIsSharing(true);
    
    // Animate share button
    Animated.sequence([
      Animated.spring(cardScale, { toValue: 0.98, tension: 100, friction: 10, useNativeDriver: true }),
      Animated.spring(cardScale, { toValue: 1, tension: 100, friction: 10, useNativeDriver: true })
    ]).start();
    
    // Create a beautiful formatted message with meaning only
    const shareMessage = `✨ திருக்குறள் | Thirukkural #${data.kural_number}
━━━━━━━━━━━━━━━━━━

📜 *குறள்:*
${data.kural_tamil}

📖 *பொருள் | Meaning:*
${data.meaning_english}

━━━━━━━━━━━━━━━━━━
🧠 MindGains - Daily Tamil Wisdom
📱 Download: mindgains.app`;
    
    try {
      const result = await Share.share({ 
        message: shareMessage,
        title: `Thirukkural #${data.kural_number}`
      });
      
      // Show success animation
      if (result.action === Share.sharedAction) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        trackInteraction('shared');
      }
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setIsSharing(false);
    }
  };
  
  const handleAudio = async () => {
    if (!data) return;
    
    // If playing, stop it
    if (isPlaying) {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
      setIsPlaying(false);
      return;
    }
    
    setIsPlaying(true);
    
    try {
      // Always read the Tamil Kural using Mascot TTS
      const textToSpeak = data.kural_tamil
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .join(' ... ');

      const audioFilePath = await mascotApi.getTTS(textToSpeak);
      
      if (audioFilePath) {
         if (sound) await sound.unloadAsync();

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioFilePath },
          { shouldPlay: true, rate: 1.0, volume: 1.0 }
        );
        
        setSound(newSound);
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            newSound.unloadAsync();
            setSound(null);
          }
        });
      } else {
        setIsPlaying(false);
      }
    } catch (e) {
      console.error('Audio error:', e);
      setIsPlaying(false);
    }
  };

  const handleLanguageChange = async (langCode: string) => {
    setSelectedLanguage(langCode);
    setShowLangPicker(false);
    
    if (langCode === 'ta' || langCode === 'en' || !data) return;

    if (data[`meaning_${langCode}`] || data[`explanation_modern_${langCode}`] || data[`life_application_${langCode}`]) {
      return;
    }
    
    // Check if already translated
    if (translatedData[`meaning_${langCode}` as keyof typeof translatedData]) return;

    try {
      setIsTranslating(true);
      const targetSarvam = LANGUAGES.find(l => l.code === langCode)?.sarvam || 'hi-IN';

      console.log(`🌐 [Thirukkural] Translating to ${langCode} (${targetSarvam})...`);

      const { data: cacheResult } = await SupabaseService.callEdgeFunction('thirukkural_translate_table', {
        kural_number: data.kural_number,
        target_language_code: targetSarvam,
        lang: langCode
      });

      const cached = cacheResult?.data;
      if (cached) {
        setTranslatedData(prev => ({
          ...prev,
          [`meaning_${langCode}`]: cached.meaning || data.meaning_english,
          [`app_${langCode}`]: cached.life_application || data.life_application,
          [`modern_${langCode}`]: cached.explanation_modern || data.explanation_modern
        }));
      } else {
        console.warn(`[Thirukkural] Translation cache missing for ${langCode}, using English fallback`);
      }
    } catch (err) {
      console.error('Translation failed', err);
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primaryTurquoise} />
      </View>
    );
  }

  if (!data) return null;

  const displayChapter = selectedLanguage === 'ta' ? data.chapter_tamil : data.chapter_english;
  const currentMeaning = selectedLanguage === 'ta' ? data.meaning_tamil :
                        (selectedLanguage === 'en' ? data.meaning_english :
                        (data[`meaning_${selectedLanguage}`] || translatedData[`meaning_${selectedLanguage}` as keyof typeof translatedData] || data.meaning_english));
  const baseLife = data.life_application || data.meaning_english;
  const baseModern = data.explanation_modern || data.meaning_english;
  const currentLifeApp = selectedLanguage === 'ta' ? baseLife :
                        (selectedLanguage === 'en' ? baseLife :
                        (data[`life_application_${selectedLanguage}`] || translatedData[`app_${selectedLanguage}` as keyof typeof translatedData] || baseLife));
  const currentModern = selectedLanguage === 'ta' ? baseModern :
                        (selectedLanguage === 'en' ? baseModern :
                        (data[`explanation_modern_${selectedLanguage}`] || translatedData[`modern_${selectedLanguage}` as keyof typeof translatedData] || baseModern));

  return (
    <View 
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={styles.ambientGlow} />
      </View>

      <View style={[styles.header, { marginTop: insets.top + 10 }]}>
        <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
          <LinearGradient colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)']} style={styles.backButtonGradient}>
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedLanguage === 'ta' ? 'தினசரி அறிவுரை' : 'Daily Wisdom'}</Text>
        <TouchableOpacity activeOpacity={1} onPress={() => setShowLangPicker(true)} style={styles.langButton}>
           <MaterialIcons name="translate" size={22} color={selectedLanguage !== 'ta' ? COLORS.primaryTurquoise : '#64748B'} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Clean minimal mascot layout */}
        <View style={styles.mascotContainer}>
          {!loading && (
            <LottieView
              source={require('@/assets/animations/mascot/thiruvalluvar.json')}
              autoPlay 
              loop 
              style={styles.mascot}
              renderMode="SOFTWARE"
              cacheComposition={false}
            />
          )}
        </View>

        {/* Reduced Glass Card - Homepage Style */}
        <Animated.View style={[styles.mainCard, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
          <View style={styles.cardGradient}>
             {/* Header Row */}
             <View style={styles.topRow}>
               <View style={styles.numberBadge}>
                 <Ionicons name="book-outline" size={14} color="#64748B" />
                 <Text style={styles.numberText}>KURAL #{data.kural_number}</Text>
               </View>
               <View style={styles.topActions}>
                 {isTranslating && <ActivityIndicator size="small" color={COLORS.primaryTurquoise} />}
                 <TouchableOpacity onPress={handleNextKural} style={styles.nextKuralButton} activeOpacity={1} >
                   <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                 </TouchableOpacity>
               </View>
             </View>
 
             {/* Kural Text - Minimalist like Homepage */}
             <View style={styles.quoteContainer}>
               <View style={{ gap: 4 }}>
                  {data.kural_tamil.split('\n').map((line, idx) => (
                    <Text key={idx} style={styles.kuralText} numberOfLines={1}>
                      {line.trim()}
                    </Text>
                  ))}
               </View>
              <View style={{ height: 16 }} />
            </View>
 
             <View style={styles.divider} />
 
             {/* Integrated Actions */}
             <View style={styles.bottomBar}>
                <View style={styles.leftActions}>
                  <TouchableOpacity onPress={handleLike} style={styles.actionIconButton} activeOpacity={1} >
                    <Ionicons name={liked ? "heart" : "heart-outline"} size={22} color={liked ? "#F43F5E" : "#64748B"} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleShare} style={styles.actionIconButton} activeOpacity={1} >
                    <Ionicons name="share-social-outline" size={22} color="#64748B" />
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity onPress={handleAudio} disabled={isPlaying && !sound} activeOpacity={1} >
                   <View style={styles.playButtonCompact}>
                     {isPlaying ? (
                       <ActivityIndicator size="small" color="#0F172A" />
                     ) : (
                       <Ionicons name="play" size={20} color="#0F172A" />
                     )}
                   </View>
                </TouchableOpacity>
             </View>
          </View>
        </Animated.View>

        {/* Info Cards */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionHeader}>{selectedLanguage === 'ta' ? 'அறிவுரை' : 'Insight'}</Text>
          <InfoCard 
            title={selectedLanguage === 'ta' ? "பொருள்" : "Meaning"} 
            icon="menu-book" 
            content={currentMeaning} 
            color="#6366f1" 
          />
          <InfoCard 
            title={selectedLanguage === 'ta' ? "வாழ்க்கை பயன்பாடு" : "Life Application"} 
            icon="lightbulb" 
            content={currentLifeApp} 
            color="#f59e0b" 
          />
          <InfoCard 
            title={selectedLanguage === 'ta' ? "நவீன சூழல்" : "Modern Context"} 
            icon="trending-up" 
            content={currentModern} 
            color="#00D4C7" 
          />
        </View>

      </ScrollView>

      {/* Language Picker Modal */}
      <Modal visible={showLangPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>Select Language</Text>
               <TouchableOpacity activeOpacity={1} onPress={() => setShowLangPicker(false)}>
                 <Ionicons name="close" size={24} color="#FFF" />
               </TouchableOpacity>
             </View>
             <ScrollView style={{ maxHeight: 400 }}>
               {LANGUAGES.map(lang => (
                 <TouchableOpacity 
                   key={lang.code} 
                   style={[styles.langOption, selectedLanguage === lang.code && styles.langOptionActive]}
                   activeOpacity={1} onPress={() => handleLanguageChange(lang.code)}
                 >
                   <Text style={[styles.langOptionText, selectedLanguage === lang.code && styles.langOptionTextActive]}>
                     {lang.label}
                   </Text>
                   {selectedLanguage === lang.code && <Ionicons name="checkmark" size={20} color={COLORS.primaryTurquoise} />}
                 </TouchableOpacity>
               ))}
             </ScrollView>
           </View>
        </View>
      </Modal>
    </View>
  );
}

const InfoCard = ({ title, icon, content, color }: any) => (
  <View style={styles.infoCard}>
    <View style={styles.infoCardInner}>
      <View style={styles.infoHeader}>
        <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
          <MaterialIcons name={icon} size={16} color={color} />
        </View>
        <Text style={[styles.infoTitle, { color: '#0F172A' }]}>{title}</Text>
      </View>
      <Text style={styles.infoContent}>{content}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  ambientGlow: {
    position: 'absolute',
    top: -SCREEN_WIDTH * 0.4,
    left: -SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH * 1.2,
    height: SCREEN_WIDTH * 1.2,
    backgroundColor: '#00D4C7',
    borderRadius: SCREEN_WIDTH,
    opacity: 0.1,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 10, zIndex: 10
  },
  headerTitle: { fontSize: 18, color: '#0F172A', fontFamily: 'Poppins-Bold', letterSpacing: 0.5 },
  backButton: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', ...V2026.shadows.milky },
  backButtonGradient: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  langButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F1F5F9', ...V2026.shadows.milky },
  
  mascotContainer: { 
    height: 180, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 0, 
    marginBottom: 0,
    position: 'relative'
  },
  mascot: { 
    width: 140, 
    height: 140,
    zIndex: 2
  },
  
  // Main Card - Homepage Style
  mainCard: {
    marginHorizontal: 20, 
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    ...V2026.shadows.milky,
  },
  cardGradient: { 
    padding: 20,
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  topRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16,
  },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nextKuralButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9'
  },
  numberBadge: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 6
  },
  numberText: { 
    color: '#64748B', 
    fontSize: 11, 
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },
  
  quoteContainer: { 
    marginVertical: 0, 
    position: 'relative', 
    paddingHorizontal: 6,
    justifyContent: 'center'
  },
  kuralText: {
    fontSize: 16, 
    color: '#0F172A', 
    textAlign: 'left', 
    fontFamily: 'Poppins-Bold',
    lineHeight: 26, 
  },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12, width: '100%' },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 },
  leftActions: { flexDirection: 'row', gap: 12 },
  actionIconButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#F8FAFC', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  playButtonCompact: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#00D4C7',
    ...V2026.shadows.primary,
  },
  
  infoContainer: { paddingHorizontal: 20, gap: 12, paddingBottom: 40 },
  sectionHeader: { fontSize: 11, color: '#64748B', fontFamily: 'Poppins-SemiBold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, paddingLeft: 4 },
  infoCard: { borderRadius: 20, overflow: 'hidden', borderWidth: 1.5, borderColor: '#F1F5F9', backgroundColor: '#FFFFFF', ...V2026.shadows.milky },
  infoCardInner: { padding: 18 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  iconBox: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  infoTitle: { fontSize: 13, fontFamily: 'Poppins-Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoContent: { color: '#475569', fontSize: 14, lineHeight: 22, fontFamily: 'Inter-Medium' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, ...V2026.shadows.milky },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, color: '#0F172A', fontFamily: 'Poppins-Bold' },
  langOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 16, marginBottom: 8, backgroundColor: '#F8FAFC' },
  langOptionActive: { backgroundColor: 'rgba(0, 212, 199, 0.1)', borderWidth: 1, borderColor: 'rgba(0, 212, 199, 0.2)' },
  langOptionText: { fontSize: 16, color: '#64748B', fontFamily: 'Inter-Medium' },
  langOptionTextActive: { color: '#00D4C7', fontFamily: 'Poppins-SemiBold' },
});


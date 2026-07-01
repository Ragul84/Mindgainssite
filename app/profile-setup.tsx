import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
// @ts-ignore
import headImage from '@/assets/images/head.png';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MotiView, AnimatePresence } from 'moti';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '@/components/AuthProvider';
import { upsertUserProtocol } from '@/utils/protocolService';
import { supabase } from '@/utils/supabaseService';
import HapticService from '@/utils/hapticService';
import { V2026 } from '@/theme/v2026-tokens';

const { width, height } = Dimensions.get('window');

type ExamTrack = 'upsc_ecosystem' | 'ssc_ecosystem' | 'tnpsc_ecosystem' | 'other';

interface TrackOption {
  id: ExamTrack;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  gradient: [string, string];
}

const TRACKS: TrackOption[] = [
  {
    id: 'upsc_ecosystem',
    title: 'UPSC Ecosystem',
    subtitle: 'Prelims, Mains & State PCS Foundation',
    icon: 'landmark',
    color: '#00D4C7',
    gradient: ['#00D4C7', '#009B91'],
  },
  {
    id: 'ssc_ecosystem',
    title: 'SSC Ecosystem',
    subtitle: 'CGL, CHSL, MTS, CPO & GD',
    icon: 'graduation-cap',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED'],
  },
  {
    id: 'tnpsc_ecosystem',
    title: 'TNPSC Ecosystem',
    subtitle: 'Group 1, 2, 2A, 4 & VAO',
    icon: 'fort-awesome',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#D97706'],
  },
  {
    id: 'other',
    title: 'Other Exams',
    subtitle: 'Curating the best path for you',
    icon: 'compass',
    color: '#64748B',
    gradient: ['#64748B', '#475569'],
  },
];

const AVATAR_STYLES = [
  { id: 'adventurer', name: 'Adventurer', logo: 'https://api.dicebear.com/7.x/adventurer/png?seed=Felix&backgroundColor=b4f4f0' },
  { id: 'bottts', name: 'Robots', logo: 'https://api.dicebear.com/7.x/bottts/png?seed=Bleep&backgroundColor=ffd1dc' },
  { id: 'lorelei', name: 'Chibi', logo: 'https://api.dicebear.com/7.x/lorelei/png?seed=Lily&backgroundColor=dbeafe' },
  { id: 'avataaars', name: 'Persona', logo: 'https://api.dicebear.com/7.x/avataaars/png?seed=Tom&backgroundColor=ffedd5' },
  { id: 'pixel-art', name: 'Retro Pixel', logo: 'https://api.dicebear.com/7.x/pixel-art/png?seed=Mario&backgroundColor=e2e8f0' },
];

const STYLE_SEEDS: Record<string, string[]> = {
  adventurer: ['Felix', 'Jasmine', 'Leo', 'Mia', 'Oliver', 'Sophia', 'Jack', 'Aneka'],
  bottts: ['Bleep', 'Bloop', 'Robo', 'Rusty', 'Sparky', 'Gear', 'Bolt', 'Widget'],
  lorelei: ['Lily', 'Sakura', 'Chibi', 'Momo', 'Yuki', 'Koko', 'Hana', 'Rin'],
  avataaars: ['Tom', 'Jane', 'Alex', 'Sarah', 'Mike', 'Emma', 'David', 'Olivia'],
  'pixel-art': ['Mario', 'Zelda', 'Link', 'Cloud', 'Peach', 'Yoshi', 'Sonic', 'Samus'],
};

// Generate highly optimized dicebear avatar link
const getAvatarUrl = (style: string, seed: string) => {
  return `https://api.dicebear.com/7.x/${style}/png?seed=${seed}&backgroundColor=b4f4f0,dbeafe,ffedd5,ffd1dc,e2e8f0`;
};

export default function ProfileSetup() {
  const { user } = useAuthContext();
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<ExamTrack | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCuratingMessage, setShowCuratingMessage] = useState(false);

  // Step 2 Avatar State
  const [selectedStyle, setSelectedStyle] = useState('adventurer');
  const [currentSeed, setCurrentSeed] = useState('Felix');

  const handleSelect = async (track: ExamTrack) => {
    setSelected(track);
    HapticService.medium();
  };

  const handleShuffle = () => {
    HapticService.selection();
    const randomSeed = Math.random().toString(36).substring(7);
    setCurrentSeed(randomSeed);
  };

  const handleContinue = async () => {
    if (step === 1) {
      if (!selected) return;
      HapticService.success();
      setStep(2);
      return;
    }

    if (!user?.id) return;
    
    setLoading(true);
    try {
      let finalTrack: string = selected;
      if (selected === 'other') {
        finalTrack = 'upsc_ecosystem';
        setShowCuratingMessage(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // 1. Save track to user_protocols
      await upsertUserProtocol(user.id, finalTrack);

      // 2. Save avatar URL
      const avatarUrl = getAvatarUrl(selectedStyle, currentSeed);
      
      // Update Supabase Auth user metadata
      await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl }
      });

      // 3. Update user profile with full_name and avatar_url
      await supabase
        .from('user_profiles')
        .update({ 
          full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Learner',
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      HapticService.success();
      router.replace('/home');
    } catch (error) {
      console.error('Failed to save profile setup:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Ambient Milky White Glow Background */}
      <View style={styles.ambientGlow1} pointerEvents="none" />
      <View style={styles.ambientGlow2} pointerEvents="none" />

      <View style={styles.content}>
        {step === 1 ? (
          // STEP 1: CHOOSE TARGET GOAL
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800 }}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <View style={styles.header}>
              <View style={styles.mascotRow}>
                <View style={styles.mascotWrapper}>
                  <Image source={headImage} style={styles.mascotImage} resizeMode="contain" />
                  <View style={styles.mascotGlow} />
                </View>
              </View>
              <Text style={styles.title}>Choose Your Goal</Text>
              <Text style={styles.subtitle}>Choose your target exam to personalize your daily study plan.</Text>
            </View>

            <View style={styles.tracksGrid}>
              {TRACKS.map((track, index) => (
                <TouchableOpacity
                  key={track.id}
                  activeOpacity={1}
                  onPress={() => handleSelect(track.id)}
                  style={[
                    styles.trackCard,
                    selected === track.id && { borderColor: track.color, borderWidth: 1.5, ...styles.trackSelectedShadow }
                  ]}
                >
                  <LinearGradient
                    colors={selected === track.id ? track.gradient : ['rgba(248,250,252,0.8)', 'rgba(241,245,249,0.5)']}
                    style={styles.trackIconBg}
                  >
                    <FontAwesome5
                      name={track.icon}
                      size={22}
                      color={selected === track.id ? '#FFFFFF' : '#64748B'}
                    />
                  </LinearGradient>
                  <View style={styles.trackInfo}>
                    <Text style={[
                      styles.trackTitle,
                      selected === track.id && { color: track.color }
                    ]}>
                      {track.title}
                    </Text>
                    <Text style={styles.trackSubtitle}>{track.subtitle}</Text>
                  </View>
                  {selected === track.id && (
                    <View style={[styles.checkCircle, { backgroundColor: track.color }]}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </MotiView>
        ) : (
          // STEP 2: CHOOSE PROFILE AVATAR
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 600 }}
            style={{ flex: 1, paddingTop: 40 }}
          >
            {/* Header Row */}
            <View style={styles.stepHeaderRow}>
              <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton} activeOpacity={0.8}>
                <Ionicons name="arrow-back" size={22} color="#475569" />
              </TouchableOpacity>
              <Text style={styles.stepTitle}>Customize Avatar</Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity onPress={handleShuffle} style={styles.compactShuffleBtn}>
                <Ionicons name="shuffle" size={14} color="#0D9488" />
                <Text style={styles.compactShuffleText}>Shuffle Random</Text>
              </TouchableOpacity>
            </View>

            {/* Dynamic Preview Container (Always Visible at Top!) */}
            <View style={styles.previewContainer}>
              <LinearGradient colors={['#EFF6FF', '#DBEAFE']} style={styles.previewGradient}>
                <Image
                  source={{ uri: getAvatarUrl(selectedStyle, currentSeed) }}
                  style={styles.previewImage}
                />
              </LinearGradient>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

              {/* Avatar Categories Row */}
              <Text style={styles.customSectionLabel}>AVATAR COLLECTION</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.categoriesRow}
              >
                {AVATAR_STYLES.map((style) => {
                  const isSelected = selectedStyle === style.id;
                  return (
                    <TouchableOpacity
                      key={style.id}
                      activeOpacity={0.82}
                      onPress={() => {
                        HapticService.selection();
                        setSelectedStyle(style.id);
                        setCurrentSeed(STYLE_SEEDS[style.id][0]);
                      }}
                      style={[
                        styles.styleChip,
                        isSelected && styles.styleChipActive
                      ]}
                    >
                      <Image source={{ uri: style.logo }} style={styles.styleChipLogo} />
                      <Text style={[
                        styles.styleChipText,
                        isSelected && styles.styleChipTextActive
                      ]}>
                        {style.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Pre-defined Seeds Grid */}
              <Text style={styles.customSectionLabel}>POPULAR PICKS</Text>
              <View style={styles.seedsGrid}>
                {STYLE_SEEDS[selectedStyle]?.map((seed) => {
                  const isSelected = currentSeed === seed;
                  const itemUrl = getAvatarUrl(selectedStyle, seed);
                  return (
                    <TouchableOpacity
                      key={seed}
                      activeOpacity={0.8}
                      onPress={() => {
                        HapticService.selection();
                        setCurrentSeed(seed);
                      }}
                      style={[
                        styles.seedCard,
                        isSelected && styles.seedCardActive
                      ]}
                    >
                      <Image source={{ uri: itemUrl }} style={styles.seedThumbnail} />
                      <Text style={[
                        styles.seedCardText,
                        isSelected && styles.seedCardTextActive
                      ]} numberOfLines={1}>
                        {seed}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </MotiView>
        )}

        {/* Global Action Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, !selected && styles.disabledButton]}
            onPress={handleContinue}
            disabled={(!selected && step === 1) || loading}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={selected ? ['#00D4C7', '#009B91'] : ['#E2E8F0', '#CBD5E1']}
              style={styles.continueGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={[styles.continueText, !selected && { color: '#94A3B8' }]}>
                    {step === 1 ? 'CONTINUE' : 'COMPLETE SETUP ✨'}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color={selected ? '#FFFFFF' : '#94A3B8'} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  ambientGlow1: {
    position: 'absolute',
    top: -60,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#00D4C7',
    opacity: 0.05,
  },
  ambientGlow2: {
    position: 'absolute',
    bottom: 80,
    left: -100,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#7C3AED',
    opacity: 0.03,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  mascotRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mascotWrapper: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mascotImage: {
    width: 82,
    height: 82,
  },
  mascotGlow: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -24,
    width: 48,
    height: 16,
    borderRadius: 24,
    backgroundColor: '#00D4C7',
    opacity: 0.2,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 8,
    lineHeight: 21,
    textAlign: 'center',
  },
  tracksGrid: {
    gap: 14,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EEF2F7',
    gap: 16,
    ...V2026.shadows.milky,
  },
  trackSelectedShadow: {
    shadowColor: '#00D4C7',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  trackIconBg: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#334155',
  },
  trackSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 2,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  curatingMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 199, 0.06)',
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 199, 0.15)',
  },
  curatingText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#00D4C7',
    lineHeight: 18,
  },
  footer: {
    marginTop: 28,
    marginBottom: 20,
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    ...V2026.shadows.primary,
  },
  disabledButton: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  continueText: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },

  // Step 2 Avatar Customizer Styles
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    ...V2026.shadows.milky,
  },
  stepTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  previewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  previewGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#00D4C7',
    ...V2026.shadows.milky,
  },
  previewImage: {
    width: 124,
    height: 124,
    borderRadius: 62,
  },
  compactShuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    borderWidth: 1.2,
    borderColor: '#99F6E4',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4.5,
  },
  compactShuffleText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#0D9488',
  },
  customSectionLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: 14,
    marginBottom: 10,
  },
  categoriesRow: {
    gap: 8,
    paddingBottom: 4,
  },
  styleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EEF2F7',
  },
  styleChipActive: {
    backgroundColor: 'rgba(0, 212, 199, 0.12)',
    borderColor: '#00D4C7',
  },
  styleChipLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
  },
  styleChipText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#475569',
  },
  styleChipTextActive: {
    fontFamily: 'Poppins-Bold',
    color: '#00D4C7',
  },
  seedsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  seedCard: {
    width: '22%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EEF2F7',
    borderRadius: 14,
    padding: 6,
    alignItems: 'center',
    ...V2026.shadows.milky,
  },
  seedCardActive: {
    backgroundColor: 'rgba(0, 212, 199, 0.12)',
    borderColor: '#00D4C7',
  },
  seedThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 6,
  },
  seedCardText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#475569',
    textAlign: 'center',
  },
  seedCardTextActive: {
    fontFamily: 'Inter-Bold',
    color: '#00D4C7',
  },
});

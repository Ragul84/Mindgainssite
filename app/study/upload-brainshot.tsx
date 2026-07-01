import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
// import { Video } from 'expo-av';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { SupabaseService, supabase } from '@/utils/supabaseService';
import MascotAvatar from '@/components/ui/MascotAvatar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withRepeat,
  withTiming,
} from '@/utils/reanimated';
import LottieView from 'lottie-react-native';

// Simplified quick tags instead of complex subject/topic selection
const QUICK_TAGS = [
  { id: 'math', label: '🧮 Math Trick', color: '#8B5CF6' },
  { id: 'science', label: '🔬 Science Hack', color: '#10B981' },
  { id: 'study', label: '📚 Study Tip', color: '#3B82F6' },
  { id: 'exam', label: '📝 Exam Prep', color: '#F59E0B' },
  { id: 'life', label: '💡 Life Hack', color: '#EF4444' },
  { id: 'quick', label: '⚡ Quick Facts', color: '#06B6D4' },
  { id: 'memory', label: '🧠 Memory Trick', color: '#8B5CF6' },
  { id: 'funny', label: '😂 Fun Learning', color: '#EC4899' },
];

export default function UploadBrainShot() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mascot animations
  const mascotScale = useSharedValue(1);
  const mascotRotation = useSharedValue(0);
  const cameraFlash = useSharedValue(0);

  useEffect(() => {
    // Continuous gentle animation
    mascotScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const pickVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your media library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [9, 16], // Vertical format
        quality: 0.8,
        videoMaxDuration: 30, // 30 seconds max
      });

      if (!result.canceled && result.assets[0]) {
        const video = result.assets[0];
        
        // Check file size (50MB limit)
        if (video.fileSize && video.fileSize > 50 * 1024 * 1024) {
          Alert.alert('Video too large', 'Please select a video under 50MB.');
          return;
        }

        setVideoUri(video.uri);
        setVideoDuration(video.duration || 30);

        // Animate mascot excitement
        mascotRotation.value = withSequence(
          withTiming(10, { duration: 100 }),
          withTiming(-10, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video. Please try again.');
    }
  };

  const uploadVideo = async () => {
    if (!videoUri || selectedTags.length === 0 || !title.trim()) {
      Alert.alert('Missing information', 'Please add video, select tags, and add a title.');
      return;
    }

    if (title.length > 50) {
      Alert.alert('Title too long', 'Title must be 50 characters or less.');
      return;
    }

    try {
      setIsUploading(true);
      
      const user = await SupabaseService.getCurrentUser();
      if (!user) {
        router.replace('/auth');
        return;
      }

      const userProfile = await SupabaseService.getUserProfile(user.id);
      const creatorName = userProfile?.full_name || user.email?.split('@')[0] || 'Anonymous';

      // Camera flash animation
      cameraFlash.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 200 })
      );

      // Upload video to Supabase storage
      const videoFileName = `brainshots/${user.id}/${Date.now()}_main.mp4`;
      const previewFileName = `brainshots/${user.id}/${Date.now()}_preview.mp4`;
      
      // For now, we'll use the same video for preview (in production, you'd create a 5s preview)
      const { data: videoData, error: videoError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, {
          uri: videoUri,
          type: 'video/mp4',
          name: 'video.mp4',
        } as any);

      if (videoError) throw videoError;

      const { data: previewData, error: previewError } = await supabase.storage
        .from('videos')
        .upload(previewFileName, {
          uri: videoUri,
          type: 'video/mp4',
          name: 'preview.mp4',
        } as any);

      if (previewError) throw previewError;

      // Get public URLs
      const { data: { publicUrl: videoUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(videoFileName);

      const { data: { publicUrl: previewUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(previewFileName);

      // Create BrainShot record with tags
      const { data: brainShot, error: dbError } = await supabase
        .from('brainshots')
        .insert({
          creator_id: user.id,
          creator_name: creatorName,
          creator_avatar: userProfile?.avatar_url,
          subject: selectedTags[0] || 'General', // Use first tag as subject
          topic: selectedTags.join(', '), // All tags as topic
          title: title.trim(),
          description: selectedTags.join(' • '), // Tags as description
          video_url: videoUrl,
          preview_url: previewUrl,
          duration: Math.min(videoDuration, 30),
          unlock_price: 0, // Free to watch, earn from views
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Check if first upload for achievement
      const { count } = await supabase
        .from('brainshots')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', user.id);

      if (count === 1) {
        // Award first upload achievement
        await awardFirstUploadAchievement(user.id);
      } else {
        // Award regular upload coins (5-10)
        await awardUploadCoins(user.id, 5);
      }

      // Update creator stats
      await supabase
        .from('brainshots_creator_stats')
        .insert({
          creator_id: user.id,
          total_uploads: 1,
          weekly_uploads: 1,
        })
        .on_conflict('creator_id')
        .merge({
          total_uploads: supabase.raw('total_uploads + 1'),
          weekly_uploads: supabase.raw('weekly_uploads + 1'),
        });

      // Show success
      setShowSuccess(true);
      
      // Mascot celebration
      mascotScale.value = withSequence(
        withSpring(1.5),
        withSpring(1)
      );

      setTimeout(() => {
        router.replace('/study/brainshots-feed');
      }, 3000);

    } catch (error) {
      console.error('Error uploading BrainShot:', error);
      Alert.alert('Upload failed', 'Please try again later.');
    } finally {
      setIsUploading(false);
    }
  };

  const awardFirstUploadAchievement = async (userId: string) => {
    try {
      // Award achievement
      const { error: achievementError } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: 'first_brainshot_uploaded',
          progress: 1,
          completed: true,
          completed_at: new Date().toISOString(),
        });

      // Award 30 BrainCoins
      const { error: coinError } = await supabase
        .from('user_stats')
        .update({
          brain_coins: supabase.raw('brain_coins + 30'),
        })
        .eq('user_id', userId);

      if (!achievementError && !coinError) {
        Alert.alert(
          '🎉 Achievement Unlocked!',
          'First BrainShot Creator! You earned 30 BrainCoins!'
        );
      }
    } catch (error) {
      console.error('Error awarding achievement:', error);
    }
  };

  const awardUploadCoins = async (userId: string, coins: number) => {
    try {
      await supabase
        .from('user_stats')
        .update({
          brain_coins: supabase.raw(`brain_coins + ${coins}`),
        })
        .eq('user_id', userId);

      Alert.alert('Upload Reward!', `You earned ${coins} BrainCoins!`);
    } catch (error) {
      console.error('Error awarding coins:', error);
    }
  };

  if (showSuccess) {
    return (
      <View style={styles.successContainer}>
        <LinearGradient
          colors={[theme.colors.background.primary, theme.colors.background.secondary]}
          style={StyleSheet.absoluteFillObject}
        />
        
        <LottieView
          source={require('@/assets/animations/success.json')}
          autoPlay
          loop={false}
          style={styles.successAnimation}
        />
        
        <Text style={styles.successTitle}>BrainShot Uploaded! 🎉</Text>
        <Text style={styles.successSubtitle}>
          Your educational video is now live!
        </Text>
        
        <View style={styles.successMascot}>
          <MascotAvatar emotion="celebrate" size={120} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background.primary, theme.colors.background.secondary]}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={1} onPress={() => router.back()}
            >
              <FontAwesome5 name="arrow-left" size={16} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Upload BrainShot</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Mascot with camera */}
          <Animated.View
            style={[
              styles.mascotSection,
              useAnimatedStyle(() => ({
                transform: [
                  { scale: mascotScale.value },
                  { rotate: `${mascotRotation.value}deg` },
                ],
              })),
            ]}
          >
            <MascotAvatar emotion="excited" size={80} />
            <Animated.View
              style={[
                styles.cameraFlash,
                useAnimatedStyle(() => ({
                  opacity: cameraFlash.value,
                })),
              ]}
            />
            <View style={styles.cameraIcon}>
              <FontAwesome5 name="video" size={24} color={theme.colors.accent.purple} />
            </View>
          </Animated.View>

          <Text style={styles.instructions}>
            Record • Tag • Share • Earn! Just 2 taps to post 🚀
          </Text>

          {/* Video Selection */}
          {!videoUri ? (
            <TouchableOpacity style={styles.videoSelector} activeOpacity={1} onPress={pickVideo}>
              <LinearGradient
                colors={['rgba(139,92,246,0.1)', 'rgba(59,130,246,0.1)']}
                style={styles.videoSelectorGradient}
              >
                <FontAwesome5 name="cloud-upload-alt" size={32} color={theme.colors.accent.purple} />
                <Text style={styles.videoSelectorText}>Select Video (Max 30s)</Text>
                <Text style={styles.videoSelectorSubtext}>MP4, Vertical format, &lt;50MB</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.videoPreview}>
              <Video
                source={{ uri: videoUri }}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.changeVideoButton}
                activeOpacity={1} onPress={pickVideo}>
                <Text style={styles.changeVideoText}>Change Video</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Tags */}
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Pick up to 3 tags (tap to select) ✨</Text>
              <View style={styles.tagsContainer}>
                {QUICK_TAGS.map((tag) => (
                  <TouchableOpacity
                    key={tag.id}
                    style={[
                      styles.tagChip,
                      selectedTags.includes(tag.id) && styles.tagChipSelected,
                      { borderColor: tag.color + '40' }
                    ]}
                    activeOpacity={1} onPress={() => {
                      if (selectedTags.includes(tag.id)) {
                        setSelectedTags(prev => prev.filter(t => t !== tag.id));
                      } else if (selectedTags.length < 3) {
                        setSelectedTags(prev => [...prev, tag.id]);
                      }
                    }}
                    disabled={!selectedTags.includes(tag.id) && selectedTags.length >= 3}
                  >
                    <Text style={[
                      styles.tagText,
                      selectedTags.includes(tag.id) && { color: tag.color }
                    ]}>
                      {tag.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Simple Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>One-line description ({title.length}/50)</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Solve any math problem in 10 seconds!"
                placeholderTextColor={theme.colors.text.muted}
                maxLength={50}
              />
            </View>
          </View>

          {/* Upload Button */}
          <TouchableOpacity
            style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
            onPress={uploadVideo}
            disabled={isUploading}
           activeOpacity={1} >
            <LinearGradient
              colors={[theme.colors.accent.purple, theme.colors.accent.blue]}
              style={styles.uploadGradient}
            >
              {isUploading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <FontAwesome5 name="upload" size={16} color="#FFF" />
                  <Text style={styles.uploadText}>Upload BrainShot</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <FontAwesome5 name="gift" size={14} color={theme.colors.accent.yellow} />
            <Text style={styles.infoText}>
              Post = +10 coins • Every 10 views = +5 coins • Trending = +100 coins! 🎁
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  mascotSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    position: 'relative',
  },
  cameraFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFF',
    borderRadius: 100,
  },
  cameraIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.accent.purple,
  },
  instructions: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  videoSelector: {
    marginHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
  },
  videoSelectorGradient: {
    padding: theme.spacing.xl * 2,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.accent.purple + '30',
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.lg,
  },
  videoSelectorText: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  videoSelectorSubtext: {
    fontSize: 13,
    fontFamily: theme.fonts.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  videoPreview: {
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    borderRadius: theme.borderRadius.lg,
  },
  changeVideoButton: {
    marginTop: theme.spacing.md,
    alignSelf: 'center',
  },
  changeVideoText: {
    fontSize: 14,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.accent.purple,
  },
  form: {
    paddingHorizontal: theme.spacing.xl,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    fontFamily: theme.fonts.subheading,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 15,
    fontFamily: theme.fonts.body,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dropdown: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: theme.fonts.body,
    color: theme.colors.text.primary,
  },
  uploadButton: {
    marginHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.xl,
    borderRadius: 25,
    overflow: 'hidden',
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: 16,
  },
  uploadText: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    fontWeight: '700',
    color: '#FFF',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.accent.yellow + '10',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.accent.yellow + '20',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: theme.fonts.caption,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tagChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tagChipSelected: {
    backgroundColor: 'rgba(139,92,246,0.2)',
    borderWidth: 2,
  },
  tagText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.text.secondary,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  successAnimation: {
    width: 200,
    height: 200,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xl,
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
  },
  successMascot: {
    marginTop: theme.spacing.xl * 2,
  },
});

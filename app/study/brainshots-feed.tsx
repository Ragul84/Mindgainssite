import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
// import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { SupabaseService, supabase } from '@/utils/supabaseService';
import MascotAvatar from '@/components/ui/MascotAvatar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
} from '@/utils/reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BrainShot {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_avatar?: string;
  subject: string;
  topic: string;
  title: string;
  description?: string;
  video_url: string;
  preview_url: string;
  thumbnail_url?: string;
  unlock_price: number;
  unlock_count: number;
  view_count: number;
  like_count: number;
  avg_rating: number;
  is_unlocked: boolean;
  is_liked: boolean;
  user_rating?: number;
  created_at: string;
}

export default function BrainShotsFeed() {
  const [brainShots, setBrainShots] = useState<BrainShot[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoins, setUserCoins] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const videoRefs = useRef<{ [key: string]: Video | null }>({});
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  // Mascot animations
  const mascotScale = useSharedValue(1);
  const mascotRotation = useSharedValue(0);
  const coinGlow = useSharedValue(0);

  useEffect(() => {
    loadFeed();
    loadUserCoins();
  }, []);

  const loadFeed = async () => {
    try {
      const user = await SupabaseService.getCurrentUser();
      if (!user) {
        router.replace('/auth');
        return;
      }

      const { data, error } = await supabase.rpc('get_brainshots_feed', {
        p_user_id: user.id,
        p_limit: 20,
        p_offset: 0,
      });

      if (error) throw error;
      setBrainShots(data || []);
    } catch (error) {
      console.error('Error loading BrainShots feed:', error);
      Alert.alert('Error', 'Failed to load feed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserCoins = async () => {
    try {
      const user = await SupabaseService.getCurrentUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_stats')
        .select('brain_coins')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setUserCoins(data.brain_coins || 0);
      }
    } catch (error) {
      console.error('Error loading user coins:', error);
    }
  };

  const handleUnlock = async (brainShot: BrainShot) => {
    try {
      const user = await SupabaseService.getCurrentUser();
      if (!user) return;

      if (userCoins < brainShot.unlock_price) {
        Alert.alert(
          'Insufficient BrainCoins',
          `You need ${brainShot.unlock_price} BrainCoins to unlock this video. You have ${userCoins}.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Get Coins', onPress: () => router.push('/subscription') },
          ]
        );
        return;
      }

      // Animate mascot handing coin
      coinGlow.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 300 })
      );
      mascotScale.value = withSequence(
        withSpring(1.2),
        withSpring(1)
      );

      const { data, error } = await supabase.rpc('unlock_brainshot', {
        p_user_id: user.id,
        p_brainshot_id: brainShot.id,
      });

      if (error) throw error;

      if (data.success) {
        // Update local state
        setUserCoins(data.new_balance);
        setBrainShots(prev =>
          prev.map(bs =>
            bs.id === brainShot.id ? { ...bs, is_unlocked: true } : bs
          )
        );

        // Show success animation
        Alert.alert('Unlocked! 🎉', 'You can now watch the full video.');
      } else {
        Alert.alert('Error', data.error || 'Failed to unlock video.');
      }
    } catch (error) {
      console.error('Error unlocking BrainShot:', error);
      Alert.alert('Error', 'Failed to unlock video. Please try again.');
    }
  };

  const handleLike = async (brainShot: BrainShot) => {
    try {
      const user = await SupabaseService.getCurrentUser();
      if (!user) return;

      const { error } = await supabase
        .from('brainshots_unlocked')
        .update({ liked: !brainShot.is_liked })
        .eq('user_id', user.id)
        .eq('brainshot_id', brainShot.id);

      if (error) throw error;

      // Update local state
      setBrainShots(prev =>
        prev.map(bs =>
          bs.id === brainShot.id
            ? {
                ...bs,
                is_liked: !bs.is_liked,
                like_count: bs.is_liked ? bs.like_count - 1 : bs.like_count + 1,
              }
            : bs
        )
      );

      // Animate mascot
      mascotRotation.value = withSequence(
        withTiming(15, { duration: 100 }),
        withTiming(-15, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    } catch (error) {
      console.error('Error liking BrainShot:', error);
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);

      // Pause all videos except current
      Object.entries(videoRefs.current).forEach(([id, video]) => {
        if (video) {
          if (id === viewableItems[0].item.id) {
            video.playAsync();
          } else {
            video.pauseAsync();
          }
        }
      });
    }
  }, []);

  const renderBrainShot = ({ item }: { item: BrainShot }) => {
    return (
      <View style={styles.videoContainer}>
        <Video
          ref={(ref) => {
            if (ref) videoRefs.current[item.id] = ref;
          }}
          source={{ uri: item.is_unlocked ? item.video_url : item.preview_url }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={currentIndex === brainShots.indexOf(item)}
          isLooping={!item.is_unlocked}
          isMuted={!item.is_unlocked}
          onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
            if (status.isLoaded && !item.is_unlocked && status.didJustFinish) {
              // Loop preview
              videoRefs.current[item.id]?.replayAsync();
            }
          }}
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />

        {/* Content Overlay */}
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={1} onPress={() => router.back()}
            >
              <FontAwesome5 name="arrow-left" size={16} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.coinBalance} activeOpacity={1} >
              <FontAwesome5 name="coins" size={14} color={theme.colors.accent.yellow} />
              <Text style={styles.coinText}>{userCoins}</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Content */}
          <View style={styles.content}>
            {/* Creator Info */}
            <View style={styles.creatorRow}>
              <View style={styles.creatorAvatar}>
                {item.creator_avatar ? (
                  <Image source={{ uri: item.creator_avatar }} style={styles.avatarImage} />
                ) : (
                  <FontAwesome5 name="user" size={16} color="#FFF" />
                )}
              </View>
              <View style={styles.creatorInfo}>
                <Text style={styles.creatorName}>{item.creator_name}</Text>
                <Text style={styles.uploadTime}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity style={styles.followButton} activeOpacity={1} >
                <Text style={styles.followText}>Follow</Text>
              </TouchableOpacity>
            </View>

            {/* Video Info */}
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{item.title}</Text>
              {item.description && (
                <Text style={styles.videoDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
              <View style={styles.tagRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.subject}</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.topic}</Text>
                </View>
              </View>
            </View>

            {/* Unlock Button or Actions */}
            {!item.is_unlocked ? (
              <View style={styles.unlockSection}>
                <BlurView intensity={80} style={styles.blurContainer}>
                  <View style={styles.previewBadge}>
                    <FontAwesome5 name="eye" size={12} color="#FFF" />
                    <Text style={styles.previewText}>5s Preview</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.unlockButton}
                    activeOpacity={1} onPress={() => handleUnlock(item)}
                  >
                    <LinearGradient
                      colors={[theme.colors.accent.purple, theme.colors.accent.blue]}
                      style={styles.unlockGradient}
                    >
                      <FontAwesome5 name="lock-open" size={14} color="#FFF" />
                      <Text style={styles.unlockText}>
                        Unlock for {item.unlock_price} BrainCoins
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </BlurView>
              </View>
            ) : null}
          </View>

          {/* Side Actions */}
          <View style={styles.sideActions}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={1} onPress={() => handleLike(item)}
            >
              <FontAwesome5
                name="heart"
                size={24}
                color={item.is_liked ? theme.colors.accent.pink : '#FFF'}
                solid={item.is_liked}
              />
              <Text style={styles.actionCount}>{item.like_count}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} activeOpacity={1} >
              <FontAwesome5 name="comment" size={24} color="#FFF" />
              <Text style={styles.actionCount}>0</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} activeOpacity={1} >
              <FontAwesome5 name="share" size={24} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} activeOpacity={1} >
              <FontAwesome5 name="star" size={24} color={theme.colors.accent.yellow} />
              <Text style={styles.actionCount}>
                {item.avg_rating > 0 ? item.avg_rating.toFixed(1) : '-'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mascot Animation */}
        <Animated.View
          style={[
            styles.mascotContainer,
            {
              transform: [
                { scale: mascotScale },
                { rotate: `${mascotRotation.value}deg` },
              ],
            },
          ]}
        >
          <MascotAvatar emotion="excited" size={60} />
          <Animated.View
            style={[
              styles.coinGlowEffect,
              {
                opacity: coinGlow,
                transform: [{ scale: interpolate(coinGlow.value, [0, 1], [0.8, 1.2]) }],
              },
            ]}
          >
            <FontAwesome5 name="coins" size={24} color={theme.colors.accent.yellow} />
          </Animated.View>
        </Animated.View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent.purple} />
        <Text style={styles.loadingText}>Loading BrainShots...</Text>
      </View>
    );
  }

  // Empty state when no videos
  if (brainShots.length === 0 && !isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={[theme.colors.background.primary, theme.colors.background.secondary]}
          style={StyleSheet.absoluteFillObject}
        />
        
        <View style={styles.emptyContainer}>
          <MascotAvatar emotion="curious" size={100} />
          
          <Text style={styles.emptyTitle}>Share Your Knowledge! 🎬</Text>
          <Text style={styles.emptySubtitle}>
            Create a 30-second trick and earn coins instantly
          </Text>
          
          <TouchableOpacity
            style={styles.emptyUploadButton}
            activeOpacity={1} onPress={() => router.push('/study/upload-brainshot')}
          >
            <LinearGradient
              colors={[theme.colors.accent.purple, theme.colors.accent.pink]}
              style={styles.emptyUploadGradient}
            >
              <FontAwesome5 name="video" size={20} color="#FFF" />
              <Text style={styles.emptyUploadText}>Create & Earn Coins</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.emptyInfoBox}>
            <FontAwesome5 name="gift" size={16} color={theme.colors.accent.yellow} />
            <Text style={styles.emptyInfoText}>
              Post = 10 coins • Views = 5 coins • Trending = 100 coins! 🎁
            </Text>
          </View>
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          style={styles.uploadButton}
          activeOpacity={1} onPress={() => router.push('/study/upload-brainshot')}
        >
          <LinearGradient
            colors={[theme.colors.accent.purple, theme.colors.accent.pink]}
            style={styles.uploadGradient}
          >
            <FontAwesome5 name="plus" size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <FlatList
        data={brainShots}
        renderItem={renderBrainShot}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig.current}
        refreshing={refreshing}
        onRefresh={loadFeed}
      />

      {/* Upload Button */}
      <TouchableOpacity
        style={styles.uploadButton}
        activeOpacity={1} onPress={() => router.push('/study/upload-brainshot')}
      >
        <LinearGradient
          colors={[theme.colors.accent.purple, theme.colors.accent.pink]}
          style={styles.uploadGradient}
        >
          <FontAwesome5 name="plus" size={20} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.text.secondary,
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
  },
  coinText: {
    fontSize: 14,
    fontFamily: theme.fonts.heading,
    fontWeight: '600',
    color: '#FFF',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 44,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  creatorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    fontSize: 15,
    fontFamily: theme.fonts.heading,
    fontWeight: '600',
    color: '#FFF',
  },
  uploadTime: {
    fontSize: 12,
    fontFamily: theme.fonts.caption,
    color: 'rgba(255,255,255,0.6)',
  },
  followButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.accent.purple,
    borderRadius: 20,
  },
  followText: {
    fontSize: 13,
    fontFamily: theme.fonts.heading,
    fontWeight: '600',
    color: '#FFF',
  },
  videoInfo: {
    marginBottom: theme.spacing.lg,
  },
  videoTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: theme.spacing.xs,
  },
  videoDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: theme.spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 15,
  },
  tagText: {
    fontSize: 12,
    fontFamily: theme.fonts.caption,
    color: '#FFF',
  },
  unlockSection: {
    marginBottom: theme.spacing.xl,
  },
  blurContainer: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  previewText: {
    fontSize: 12,
    fontFamily: theme.fonts.caption,
    color: '#FFF',
  },
  unlockButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  unlockGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  unlockText: {
    fontSize: 15,
    fontFamily: theme.fonts.heading,
    fontWeight: '600',
    color: '#FFF',
  },
  sideActions: {
    position: 'absolute',
    right: theme.spacing.xl,
    bottom: 120,
    gap: theme.spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  actionCount: {
    fontSize: 12,
    fontFamily: theme.fonts.caption,
    color: '#FFF',
    marginTop: theme.spacing.xs,
  },
  uploadButton: {
    position: 'absolute',
    right: 24,
    bottom: 96,
    borderRadius: 27,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex: 50,
  },
  uploadGradient: {
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  mascotContainer: {
    position: 'absolute',
    bottom: 200,
    left: theme.spacing.xl,
  },
  coinGlowEffect: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl * 2,
  },
  emptyUploadButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
  },
  emptyUploadGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  emptyUploadText: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    fontWeight: '600',
    color: '#FFF',
  },
  emptyInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background.card,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.accent.yellow + '30',
  },
  emptyInfoText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.text.secondary,
  },
});

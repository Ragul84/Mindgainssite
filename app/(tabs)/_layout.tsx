// 🚀 Ultra-Modern Premium TabBar - Aura Dock Design
import React, { useRef, useEffect, useState, createContext, useContext } from 'react';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  View, 
  StyleSheet, 
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { useRouter, usePathname, Stack } from 'expo-router';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import CallOverlay from '@/components/ui/CallOverlay';
import { 
  HomeDecor, 
  LearnDecor, 
  MigaDecor, 
  RanksDecor, 
  ProfileDecor 
} from '@/components/decor/PremiumDecor';
import { MotiView, AnimatePresence } from 'moti';
import { useM3Theme } from '@/theme/M3ThemeProvider';

// Voice Recording Context with Call State
interface VoiceContextType {
  startVoiceRecording: () => Promise<void>;
  stopVoiceRecording: () => Promise<string | null>;
  isRecording: boolean;
  isInCall: boolean;
  startCall: () => void;
  endCall: () => void;
  callDuration: string;
}

const VoiceContext = createContext<VoiceContextType | null>(null);

export const useVoiceContext = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    return {
      startVoiceRecording: async () => {},
      stopVoiceRecording: async () => null,
      isRecording: false,
      isInCall: false,
      startCall: () => {},
      endCall: () => {},
      callDuration: '00:00'
    };
  }
  return context;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TAB_CONFIG = {
  home: { icon: 'house-user' },
  learn: { icon: 'graduation-cap' },
  mascot: { icon: 'microphone', isCenter: true },
  arena: { icon: 'sword-cross', iconSet: 'material' },
  profile: { icon: 'user-circle' },
};

const TAB_ORDER = ['home', 'learn', 'mascot', 'arena', 'profile'];

const TAB_BAR_VISIBLE_ROUTES = new Set([
  'home',
  'learn',
  'mascot',
  'arena',
  'profile',
]);

const shouldShowAppTabBar = (segments: string[]) => {
  const [root, child] = segments;
  if (!root) return true;
  if (!TAB_BAR_VISIBLE_ROUTES.has(root)) return false;
  if (root === 'learn') return !child || child === 'index';
  return !child;
};

// Enhanced M3 Tab Icon Component
const CleanTabIcon = ({
  route,
  focused,
  onPress,
}: {
  route: any;
  focused: boolean;
  onPress: () => void;
}) => {
  const config = TAB_CONFIG[route.name as keyof typeof TAB_CONFIG];
  const isCenter = Boolean((config as any).isCenter);
  const theme = useM3Theme();
  const iconColor = focused ? theme.colors.primary : theme.colors.onSurfaceVariant;
  const iconSize = 20;

  const renderIcon = () => {
    if (isCenter) {
      return (
        <View style={[styles.centerFab, focused ? styles.centerFabActive : styles.centerFabIdle]}>
          {focused && (
            <LinearGradient
              colors={['#19D3C6', '#0F766E']}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}
          {focused && <View style={styles.centerFabSheen} pointerEvents="none" />}
          <MaterialCommunityIcons
            name={config.icon as any}
            size={24}
            color={focused ? '#FFFFFF' : theme.colors.onSurfaceVariant}
          />
        </View>
      );
    }

    if ('iconSet' in config && config.iconSet === 'material') {
      return (
        <MaterialCommunityIcons
          name={config.icon as any}
          size={iconSize + 2}
          color={iconColor}
        />
      );
    }

    return (
      <FontAwesome5
        name={config.icon as any}
        size={iconSize}
        color={iconColor}
        solid={focused}
      />
    );
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.geminiTabButton,
        isCenter && styles.centerTabButton,
        isCenter && focused && styles.centerTabButtonActive,
        pressed && styles.geminiTabPressed,
      ]}
    >
      <View style={[styles.geminiIconWrapper, isCenter && styles.centerIconWrapper]}>
        {!isCenter && (
          <AnimatePresence>
            {focused && (
              <MotiView
                from={{ opacity: 0, scale: 0.5, translateY: 10 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, translateY: 10 }}
                transition={theme.motion.expressive as any}
                style={[
                  styles.geminiActiveGlow,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              />
            )}
          </AnimatePresence>
        )}

        <MotiView
          animate={{
            scale: isCenter ? (focused ? 1.08 : 1) : (focused ? 1.05 : 0.95),
            translateY: isCenter ? 0 : (focused ? -4 : -2),
          }}
          transition={theme.motion.expressive as any}
          style={styles.geminiIconStack}
        >
          {renderIcon()}
        </MotiView>
      </View>
    </Pressable>
  );
};


const TabBarReplacement = ({ activeIndex }: { activeIndex: number }) => {
  const insets = useSafeAreaInsets();
  const navigationRouter = useRouter();
  
  const dockWidth = SCREEN_WIDTH * 0.94;
  const tabWidth = (dockWidth - 20) / TAB_ORDER.length;

  const handleTabPress = (tab: string, index: number) => {
    if (activeIndex !== index) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const routes: Record<string, string> = {
        home: '/home',
        learn: '/learn',
        mascot: '/mascot',
        arena: '/arena',
        profile: '/profile'
      };
      navigationRouter.replace(routes[tab] as any);
    }
  };

  return (
    <View style={styles.geminiNavWrapper}>
      <BlurView intensity={90} tint="light" style={[styles.geminiNavInner, { backgroundColor: 'rgba(255,255,255,0.85)' }]}>
        <View style={[styles.geminiNavContent, { paddingBottom: insets.bottom > 0 ? insets.bottom - 10 : 0 }]}>
          {TAB_ORDER.map((tab, index) => (
            <CleanTabIcon
              key={tab}
              route={{ name: tab }}
              focused={activeIndex === index}
              onPress={() => handleTabPress(tab, index)}
            />
          ))}
        </View>
      </BlurView>
    </View>
  );
};

// Layout content
function TabLayoutContent() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const currentTab = TAB_ORDER.find(tab => {
    if (tab === 'home') return segments.length === 0 || segments[0] === 'home';
    return segments[0] === tab;
  }) || 'home';
  const currentIndex = TAB_ORDER.indexOf(currentTab);
  const showTabBar = shouldShowAppTabBar(segments);
  const lastIndex = useRef(currentIndex);
  const [dir, setDir] = useState(1);

  if (currentIndex !== lastIndex.current) {
    setDir(currentIndex > lastIndex.current ? 1 : -1);
    lastIndex.current = currentIndex;
  }

  const theme = useM3Theme();

  useEffect(() => {
    if (Platform.OS === 'android' && NavigationBar.setBackgroundColorAsync) {
      NavigationBar.setBackgroundColorAsync(theme.colors.background);
      NavigationBar.setButtonStyleAsync('light');
    }
  }, [theme]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: dir > 0 ? 'slide_from_right' : 'slide_from_left',
          animationDuration: 500, // Matching M3 fluid
          gestureEnabled: true,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="learn/index" options={{ title: 'Learn' }} />
        <Stack.Screen name="learn/blueprint" options={{ title: 'Blueprint' }} />
        <Stack.Screen name="learn/content-viewer" options={{ title: 'Content' }} />
        <Stack.Screen name="arena" options={{ title: 'Arena' }} />
        <Stack.Screen name="mascot" options={{ title: 'MIGA' }} />
        <Stack.Screen name="leaderboard" options={{ title: 'Ranks', animation: 'slide_from_right' }} />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
        <Stack.Screen name="streak" options={{ title: 'Streak' }} />
        <Stack.Screen name="misa" options={{ title: 'MISA Movement' }} />
      </Stack>
      {showTabBar ? <TabBarReplacement activeIndex={currentIndex} /> : null}
    </View>
  );
}

// Main Layout
export default function TabLayout() {
  return (
    <VoiceContextProvider>
      <TabLayoutContent />
    </VoiceContextProvider>
  );
}

// Voice Context Implementation
function VoiceContextProvider({ children }: { children: React.ReactNode }) {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const isGlobalRecordingRef = useRef(false);
  const isProcessingRef = useRef(false);
  
  const [isGlobalRecording, setIsGlobalRecording] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [callDuration, setCallDuration] = useState('00:00');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall && callStartTime) {
      interval = setInterval(() => {
        const diff = Math.floor((Date.now() - callStartTime.getTime()) / 1000);
        setCallDuration(`${Math.floor(diff/60).toString().padStart(2,'0')}:${(diff%60).toString().padStart(2,'0')}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInCall, callStartTime]);

  const startCall = () => { setIsInCall(true); setCallStartTime(new Date()); };
  const endCall = async () => { setIsInCall(false); setCallStartTime(null); if (isGlobalRecording) await stopVoiceRecording(); };

  const startVoiceRecording = async () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    try {
      if (recordingRef.current) await recordingRef.current.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true, staysActiveInBackground: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      recordingRef.current = recording;
      setIsGlobalRecording(true);
    } catch (e) { console.error(e); } finally { isProcessingRef.current = false; }
  };

  const stopVoiceRecording = async (): Promise<string | null> => {
    if (isProcessingRef.current || !recordingRef.current) return null;
    isProcessingRef.current = true;
    try {
      const uri = recordingRef.current.getURI();
      await recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;
      setIsGlobalRecording(false);
      return uri;
    } catch (e) { console.error(e); return null; } finally { isProcessingRef.current = false; }
  };

  return (
    <VoiceContext.Provider value={{ startVoiceRecording, stopVoiceRecording, isRecording: isGlobalRecording, isInCall, startCall, endCall, callDuration }}>
      {children}
      <CallOverlay isVisible={isInCall} onEndCall={endCall} isListening={isGlobalRecording} duration={callDuration} />
    </VoiceContext.Provider>
  );
}

const styles = StyleSheet.create({
  geminiNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2000,
  },
  geminiNavInner: {
    height: 90, // Slightly taller for traditional bar
    overflow: 'hidden',
    borderTopWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  geminiNavContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  geminiTabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  geminiTabPressed: {
    opacity: 0.85,
  },
  geminiIconWrapper: {
    width: 52,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerIconWrapper: {
    width: 64,
  },
  centerTabButton: {
    borderRadius: 18,
    alignSelf: 'center',
    marginHorizontal: 2,
    marginTop: 4,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  centerTabButtonActive: {
    backgroundColor: 'transparent',
  },
  centerFab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  centerFabIdle: {
    backgroundColor: '#F1F5F4',
    borderWidth: 1,
    borderColor: '#E2E8E6',
  },
  centerFabActive: {
    borderWidth: 0,
    shadowColor: '#0F766E',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  // soft top highlight for a glassy 3D dome
  centerFabSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  geminiIconStack: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  geminiActiveGlow: {
    position: 'absolute',
    width: 48,
    height: 36,
    borderRadius: 20,
    top: 13,
    alignSelf: 'center',
    zIndex: -1,
  },
});

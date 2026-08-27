import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Platform,
  StatusBar,
  UIManager,
  Modal,
  ScrollView,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { mascotApi } from '@/services/mascotApi';
import { supabase, SupabaseService } from '@/utils/supabaseService';
import RedisService from '@/utils/redisService';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import MascotRig, { MascotRigRef } from '@/components/MascotRig';
import { useMascotAudio } from '@/hooks/useMascotAudio';
import type { VisemeFrame } from '@/hooks/useMascotAudio';
import type { MascotEmotion } from '@/services/companion/types';
import { MotiView, AnimatePresence } from 'moti';
import { useAuthContext } from '@/components/AuthProvider';
import Voice from '@react-native-voice/voice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { StoryUploadModal } from '@/components/ui/StoryUploadModal';
import { V2026 } from '@/theme/v2026-tokens';
import { useFocusEffect } from 'expo-router';
import { connectMascotSocket } from '@/utils/mascotTransport';

const SCREEN = Dimensions.get('window');

const LANGUAGES_MAP = [
  { label: 'Tamil', code: 'ta', sarvam: 'ta-IN' },
  { label: 'Hindi', code: 'hi', sarvam: 'hi-IN' },
  { label: 'Telugu', code: 'te', sarvam: 'te-IN' },
  { label: 'Kannada', code: 'kn', sarvam: 'kn-IN' },
  { label: 'Malayalam', code: 'ml', sarvam: 'ml-IN' },
];

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const sanitizeText = (text: string) => {
  if (!text) return '';
  return text
    .replace(/\*\*|__|`/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .trim();
};

type ExperienceMode = 'tutor' | 'story';
type StoryPhase = 'idle' | 'ingesting' | 'generating' | 'speaking' | 'awaiting';
type LiveMessage = { id: string; role: 'user' | 'assistant'; text: string; timestamp: number };
type WordTiming = { word: string; start_ms: number; end_ms?: number };
type VisualBoard = {
  title?: string;
  subtitle?: string;
  rows?: Array<{ label?: string; value?: string; note?: string }>;
  bullets?: string[];
};
type StudentStoryProfile = {
  name: string;
  exam_goal: string;
  language_code: string;
  language_label: string;
  preferred_style: 'family drama' | 'school' | 'cinema' | 'roast' | 'emotional' | 'village';
  personal_anchor?: string;
  pending_topic?: string;
  needs_anchor?: boolean;
  current_topic?: string;
  current_module_number?: number;
  current_module?: string;
  expected_answer?: string;
};

const getTimeGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const buildLearnModePrompt = (userText: string, lang: string) => [
  'SYSTEM: You are MIGA, a live voice tutor, not a long-form chatbot.',
  'FLOW: If the user only greets you, reply with a warm one-line intro and ask what they want to learn. Do not teach a random topic.',
  'FLOW: If the user asks a topic, explain in 2-3 short spoken sentences, then ask exactly ONE check question.',
  'RULES: No long lists. No jargon. No random topic switches. No Markdown. Keep the whole turn under 45 words unless the user asks for detail.',
  'IMPORTANT: After asking your check question, stop and wait for the user.',
  `LANGUAGE: ${lang || 'English'}. If the user mixes English/${lang}, respond in the same mix.`,
  `USER: ${userText}`,
].join('\n');

const defaultProfileName = (user: any) => {
  const metaName = user?.user_metadata?.full_name || user?.user_metadata?.name;
  if (metaName) return String(metaName).split(' ')[0];
  const emailName = user?.email ? String(user.email).split('@')[0] : '';
  return emailName || 'friend';
};

const isGreetingOnly = (text: string) => /^(hi|hii+|hello|hey|yo|vanakkam|namaste|namaskar|வணக்கம்|नमस्ते)[\s!.?]*$/i.test(text.trim());

// ── Boot loading screen ────────────────────────────────────────────────────
const BootLoader = () => (
  <View style={boot.root} pointerEvents="none">
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#F8FAFC' }]} />
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20 }}
      style={{ alignItems: 'center' }}
    >
      <LottieView
        source={require('@/assets/lotties/loadingscreen.json')}
        autoPlay
        loop
        style={{ width: 140, height: 140 }}
      />
      <MotiView
        from={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ loop: true, type: 'timing', duration: 1200 }}
      >
        <Text style={{ fontSize: 13, fontFamily: 'Poppins-Bold', color: '#64748B', marginTop: 12, letterSpacing: 2 }}>
          WAKING UP MIGA
        </Text>
      </MotiView>
    </MotiView>
  </View>
);

const boot = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 900,
  },
  ring: {
    position: 'absolute',
    width: SCREEN.width * 0.6,
    height: SCREEN.width * 0.6,
    borderRadius: SCREEN.width * 0.3,
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 199, 0.2)',
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dotRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00D4C7',
  },
  label: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

// ── Main screen ────────────────────────────────────────────────────────────
export default function MascotScreen() {
  const { user, loading } = useAuthContext();
  const insets = useSafeAreaInsets();

  const [askInput, setAskInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [subtitles, setSubtitles] = useState('');
  const [emotion, setEmotion] = useState<MascotEmotion>('idle');
  const [isMascotBooted, setIsMascotBooted] = useState(false);
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>('tutor');
  const [liveMessages, setLiveMessages] = useState<LiveMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [recommendedPrompt, setRecommendedPrompt] = useState<string | null>(null);
  const [storyPhase, setStoryPhase] = useState<StoryPhase>('idle');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);
  const [storyLanguage, setStoryLanguage] = useState('en-IN');
  const [isStoryStreaming, setIsStoryStreaming] = useState(false);
  const [isStoryListening, setIsStoryListening] = useState(false);
  const [isTutorListening, setIsTutorListening] = useState(false);
  const [isTutorStreaming, setIsTutorStreaming] = useState(false);
  const [storyAwaitingUser, setStoryAwaitingUser] = useState(false);
  const [isLangPickerOpen, setIsLangPickerOpen] = useState(false);
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [stageIntroKey, setStageIntroKey] = useState(0);
  const [visualBoard, setVisualBoard] = useState<VisualBoard | null>(null);

  // ── Interactive Mascot Suggestion States ──────────────────────────────────
  const [kuralFlowState, setKuralFlowState] = useState<'idle' | 'couplet' | 'ask_meaning' | 'choose_meaning_lang' | 'choose_kural_lang' | 'reading_explanation'>('idle');
  const [currentKural, setCurrentKural] = useState<any | null>(null);
  
  const [currentAffairsState, setCurrentAffairsState] = useState<'idle' | 'question' | 'explanation'>('idle');
  const [caQuestions, setCaQuestions] = useState<any[]>([]);
  const [caIndex, setCaIndex] = useState<number>(0);
  const [studentProfile, setStudentProfile] = useState<StudentStoryProfile>(() => ({
    name: defaultProfileName(user),
    exam_goal: 'Competitive exams',
    language_code: 'en-IN',
    language_label: 'English',
    preferred_style: 'family drama',
  }));

  const greetedRef = useRef(false);
  const mascotRef = useRef<MascotRigRef>(null);
  const storyWsRef = useRef<WebSocket | null>(null);
  const storyTranscriptRef = useRef('');
  const storyLanguageRef = useRef(storyLanguage);
  const studentProfileRef = useRef<StudentStoryProfile>(studentProfile);
  const sessionIdRef = useRef(`miga-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  
  // High-fidelity word-by-word subtitle synchronization refs and hooks
  const subtitleIntervalRef = useRef<any>(null);
  const startSubtitleReveal = useCallback((fullText: string, durationMs: number, wordTimings?: WordTiming[]) => {
    if (subtitleIntervalRef.current) {
      if (Array.isArray(subtitleIntervalRef.current)) subtitleIntervalRef.current.forEach((timer) => clearTimeout(timer));
      else clearInterval(subtitleIntervalRef.current);
      subtitleIntervalRef.current = null;
    }
    const cleanText = sanitizeText(fullText);
    const words = cleanText.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      setSubtitles('');
      return;
    }
    const validTimings = Array.isArray(wordTimings)
      ? wordTimings.filter((item) => item && typeof item.word === 'string' && Number.isFinite(Number(item.start_ms)))
      : [];
    if (validTimings.length > 0) {
      const timingDuration = Math.max(...validTimings.map((item) => Number(item.end_ms ?? item.start_ms ?? 0)), 1);
      const scale = durationMs && timingDuration ? durationMs / timingDuration : 1;
      const revealedWords = validTimings.map((item) => sanitizeText(item.word)).filter(Boolean);
      subtitleIntervalRef.current = validTimings.map((item, index) => {
        const delay = Math.max(0, Math.floor(Number(item.start_ms || 0) * scale));
        return setTimeout(() => {
          const sourceWords = revealedWords.length >= Math.min(index + 1, words.length) ? revealedWords : words;
          setSubtitles(sourceWords.slice(0, index + 1).join(' '));
        }, delay);
      });
      return;
    }
    setSubtitles(words[0]);
    const duration = durationMs || Math.max(1500, words.length * 320);
    const intervalTime = Math.max(150, Math.floor(duration / words.length));
    
    let currentIndex = 1;
    subtitleIntervalRef.current = setInterval(() => {
      if (currentIndex >= words.length) {
        clearInterval(subtitleIntervalRef.current);
        subtitleIntervalRef.current = null;
        return;
      }
      setSubtitles((prev) => words.slice(0, currentIndex + 1).join(' '));
      currentIndex++;
    }, intervalTime);
  }, []);

  const clearSubtitleReveal = useCallback(() => {
    if (subtitleIntervalRef.current) {
      if (Array.isArray(subtitleIntervalRef.current)) subtitleIntervalRef.current.forEach((timer) => clearTimeout(timer));
      else clearInterval(subtitleIntervalRef.current);
      subtitleIntervalRef.current = null;
    }
    setSubtitles('');
  }, []);
  const streamModeRef = useRef<ExperienceMode>('story');
  const storyQueueEmptyRef = useRef(false);
  const storyWaitFlagRef = useRef(false);
  const startStoryListeningRef = useRef<(() => Promise<void>) | null>(null);
  const hadStreamResponseRef = useRef(false);
  const subtitleRunningRef = useRef(false);
  const subtitleTextQueueRef = useRef<string[]>([]);
  const subtitleDurationQueueRef = useRef<number[]>([]);
  const subtitleTimerRef = useRef<any>(null);
  const nudgeForSubtitleRef = useRef('');
  const currentAudioDurationRef = useRef<number | null>(null);
  const currentAudioWordTimingsRef = useRef<WordTiming[] | null>(null);

  const { isPlaying, speak, stopAudio, playUri } = useMascotAudio({
    onAudioStart: (text) => {
      setIsThinking(false);
      setStatusMessage(null);
      if (experienceMode === 'story') setStoryPhase('speaking');
      const estimated = Math.max(1500, text.split(/\s+/).length * 320);
      startSubtitleReveal(text, currentAudioDurationRef.current || estimated, currentAudioWordTimingsRef.current || undefined);
      currentAudioDurationRef.current = null;
      currentAudioWordTimingsRef.current = null;
    },
    onAudioStop: () => {
      mascotRef.current?.stopSpeaking();
      mascotRef.current?.resetAudioQueue();
      mascotRef.current?.setMouth(0);
      setStatusMessage(null);
      clearSubtitleReveal();
      if (experienceMode === 'story') {
        setStoryPhase('awaiting');
      }
      setIsSending(false);
      setIsThinking(false);
    },
    onVisemeFrame: (val, form) => {
      mascotRef.current?.setMouth(val, form);
    },
    onAudioMeta: (durationMs) => {
      currentAudioDurationRef.current = durationMs;
    },
  });

  const resetSubtitles = useCallback(() => {
    setSubtitles('');
  }, []);

  const pushLiveMessage = useCallback((role: 'user' | 'assistant', text: string) => {
    setLiveMessages((prev) => [...prev, { id: Date.now().toString(), role, text, timestamp: Date.now() }]);
  }, []);

  const profileStorageKey = useCallback(() => `miga_story_profile_${user?.id || 'guest'}`, [user?.id]);

  const persistStudentProfile = useCallback(async (next: StudentStoryProfile) => {
    studentProfileRef.current = next;
    setStudentProfile(next);
    try {
      await AsyncStorage.setItem(profileStorageKey(), JSON.stringify(next));
    } catch (err) {
      console.warn('[mascot] profile save failed:', err);
    }
  }, [profileStorageKey]);

  const mergeStudentProfile = useCallback((patch: Partial<StudentStoryProfile>) => {
    const next = {
      ...studentProfileRef.current,
      ...patch,
    };
    persistStudentProfile(next);
  }, [persistStudentProfile]);

  const getTutorLangCode = useCallback(() => {
    const map: Record<string, string> = {
      English: 'en-IN', Hindi: 'hi-IN', Tamil: 'ta-IN',
      Telugu: 'te-IN', Malayalam: 'ml-IN', Kannada: 'kn-IN',
    };
    return map[selectedLanguage] || 'en-IN';
  }, [selectedLanguage]);

  const pendingSentenceRef = useRef('');
  const sentenceBySeqRef = useRef<Record<string, string>>({});
  const streamAudioQueueRef = useRef<{ chunk: string; text: string; emotion: MascotEmotion; isFinal: boolean; visemes?: VisemeFrame[]; wordTimings?: WordTiming[]; durationMs?: number }[]>([]);
  const isStreamingPlaybackActiveRef = useRef(false);
  const streamFinalPendingRef = useRef(false);

  const finishCurrentStream = useCallback((waitForUser = false, fallbackMessage?: string) => {
    setIsSending(false);
    setIsThinking(false);
    setIsTutorStreaming(false);
    setIsStoryStreaming(false);
    setIsStoryListening(false);
    setIsTutorListening(false);
    void Voice.stop().catch(() => {});
    setEmotion(waitForUser ? 'listening' : 'idle');
    mascotRef.current?.stopSpeaking();
    mascotRef.current?.setMouth(0);
    currentAudioDurationRef.current = null;
    currentAudioWordTimingsRef.current = null;
    void stopAudio();

    if (streamModeRef.current === 'story') {
      setStoryAwaitingUser(waitForUser);
      setStoryPhase(waitForUser ? 'awaiting' : 'idle');
      if (waitForUser) startStoryListeningRef.current?.();
    } else if (waitForUser) {
      setEmotion('listening');
      setStatusMessage(null);
    }

    if (fallbackMessage && !hadStreamResponseRef.current) {
      if (streamModeRef.current === 'story') {
        setStatusMessage(fallbackMessage);
      } else {
        setSubtitles(fallbackMessage);
      }
      pushLiveMessage('assistant', fallbackMessage);
    }
  }, [pushLiveMessage, stopAudio]);

  const processStreamPlaybackQueue = useCallback(async () => {
    if (isStreamingPlaybackActiveRef.current || streamAudioQueueRef.current.length === 0) return;
    
    isStreamingPlaybackActiveRef.current = true;
    const item = streamAudioQueueRef.current.shift();
    if (!item) {
      isStreamingPlaybackActiveRef.current = false;
      return;
    }

    try {
      if (item.chunk) {
        const dataUri = `data:audio/mp3;base64,${item.chunk}`;
        
        // Native audio playback using playUri
        setEmotion(item.emotion || 'speaking');
        currentAudioWordTimingsRef.current = Array.isArray(item.wordTimings) ? item.wordTimings : null;
        currentAudioDurationRef.current = item.durationMs || null;
        await playUri(dataUri, () => {
          // onStart
          mascotRef.current?.setExpression(item.emotion || 'speaking');
          if (streamModeRef.current === 'story') {
            setStoryPhase('speaking');
          }
        }, item.text || '', item.visemes);
      } else if (item.text) {
        setEmotion(item.emotion || 'speaking');
        await new Promise<void>((resolve) => {
          speak(item.text, () => {
            mascotRef.current?.setExpression(item.emotion || 'speaking');
            if (streamModeRef.current === 'story') setStoryPhase('speaking');
          });
          const timeoutMs = Math.max(1200, Math.min(9000, item.text.split(/\s+/).filter(Boolean).length * 320));
          setTimeout(resolve, timeoutMs);
        });
      }
    } catch (err) {
      console.warn('[mascot] Native stream playback error:', err);
    } finally {
      mascotRef.current?.stopSpeaking();
      mascotRef.current?.setMouth(0);
      
      const isFinalItem = item.isFinal || (streamFinalPendingRef.current && streamAudioQueueRef.current.length === 0);
      if (isFinalItem) {
        streamFinalPendingRef.current = false;
        if (streamModeRef.current === 'story') {
          if (storyWaitFlagRef.current) {
            setStoryPhase('awaiting');
            startStoryListeningRef.current?.();
          } else {
            setStoryPhase('idle');
            setEmotion('idle');
          }
        } else {
          setIsTutorStreaming(false);
          setIsThinking(false);
          setEmotion(storyWaitFlagRef.current ? 'listening' : 'idle');
        }
      }
      
      isStreamingPlaybackActiveRef.current = false;
      // Loop to next item
      processStreamPlaybackQueue();
    }
  }, [playUri, speak]);

  const handleStorySocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(String(event.data));
      if (data.type === 'emotion') {
        const nextEmotion = String(data.emotion || data.value || 'teaching') as MascotEmotion;
        setEmotion(nextEmotion);
        mascotRef.current?.setExpression(nextEmotion);
      } else if (data.type === 'sentence') {
        const sentence = String(data.text || '').trim();
        if (sentence) {
          const nextEmotion = String(data.emotion || 'teaching') as MascotEmotion;
          hadStreamResponseRef.current = true;
          pendingSentenceRef.current = sentence;
          sentenceBySeqRef.current[String(data.seq ?? 'latest')] = sentence;
          storyTranscriptRef.current += `${sentence} `;
          pushLiveMessage('assistant', sentence);
          setEmotion(nextEmotion);
          mascotRef.current?.setExpression(nextEmotion);
          if (streamModeRef.current === 'story') setSubtitles('');
          else setSubtitles(sentence);
        }
      } else if (data.type === 'audio') {
        const chunk = data.chunk || '';
        const isFinal = Boolean(data.is_final || data.isFinal);
        const seqKey = String(data.seq ?? 'latest');
        const text = sentenceBySeqRef.current[seqKey] || pendingSentenceRef.current || '';
        const nextEmotion = String(data.emotion || emotion || 'speaking') as MascotEmotion;
        if (pendingSentenceRef.current === text) pendingSentenceRef.current = '';

        if (chunk) {
          hadStreamResponseRef.current = true;
          streamAudioQueueRef.current.push({
            chunk,
            text,
            emotion: nextEmotion,
            isFinal,
            visemes: Array.isArray(data.visemes) ? data.visemes : undefined,
            wordTimings: Array.isArray(data.word_timings) ? data.word_timings : undefined,
            durationMs: Number(data.duration_ms || 0) || undefined,
          });
          processStreamPlaybackQueue();
        } else if (text) {
          hadStreamResponseRef.current = true;
          streamAudioQueueRef.current.push({
            chunk: '',
            text,
            emotion: nextEmotion,
            isFinal,
            visemes: Array.isArray(data.visemes) ? data.visemes : undefined,
            wordTimings: Array.isArray(data.word_timings) ? data.word_timings : undefined,
            durationMs: Number(data.duration_ms || 0) || undefined,
          });
          processStreamPlaybackQueue();
        } else if (isFinal) {
          if (streamAudioQueueRef.current.length > 0) {
            streamAudioQueueRef.current[streamAudioQueueRef.current.length - 1].isFinal = true;
          } else if (isStreamingPlaybackActiveRef.current) {
            streamFinalPendingRef.current = true;
          } else {
            finishCurrentStream(storyWaitFlagRef.current);
          }
        }
      } else if (data.type === 'done') {
        const wait = Boolean(data.wait_for_user);
        storyWaitFlagRef.current = wait;
        if (streamAudioQueueRef.current.length === 0 && !isStreamingPlaybackActiveRef.current) {
          finishCurrentStream(wait);
        }
      } else if (data.type === 'choices') {
        const nextChoices = Array.isArray(data.choices) ? data.choices.filter(Boolean).slice(0, 4).map(String) : [];
        setChoices(nextChoices);
      } else if (data.type === 'visual_board') {
        if (streamModeRef.current !== 'story' && data.board && typeof data.board === 'object') {
          setVisualBoard(data.board);
        }
      } else if (data.type === 'memory_update') {
        if (data.patch && typeof data.patch === 'object') {
          mergeStudentProfile(data.patch);
        }
      } else if (data.type === 'error') {
        finishCurrentStream(false, String(data.message || 'MIGA stream failed. Try again.'));
      }
    } catch (err) {
      console.warn('[mascot] WS onmessage error:', err);
    }
  }, [emotion, finishCurrentStream, mergeStudentProfile, processStreamPlaybackQueue, pushLiveMessage]);

  const ensureStorySocket = useCallback(async () => {
    if (storyWsRef.current?.readyState === WebSocket.OPEN) return storyWsRef.current;
    if (storyWsRef.current?.readyState === WebSocket.CONNECTING) {
      try { storyWsRef.current.close(); } catch {}
      storyWsRef.current = null;
    }

    const ws = await connectMascotSocket('/ws_story', {
      onMessage: handleStorySocketMessage,
      onError: () => {
        finishCurrentStream(false, 'MIGA stream failed. Try again.');
        void stopAudio();
        setIsStoryListening(false);
        setIsTutorListening(false);
        void Voice.stop().catch(() => {});
        mascotRef.current?.stopSpeaking();
        mascotRef.current?.setMouth(0);
        mascotRef.current?.setExpression('idle');
        storyWsRef.current = null;
      },
      onClose: () => {
        setIsStoryStreaming(false);
        setIsTutorStreaming(false);
        setIsThinking(false);
        setIsStoryListening(false);
        setIsTutorListening(false);
        void Voice.stop().catch(() => {});
        void stopAudio();
        mascotRef.current?.stopSpeaking();
        mascotRef.current?.setMouth(0);
        mascotRef.current?.setExpression('idle');
        storyWsRef.current = null;
      },
    });

    if (!ws) {
      storyWsRef.current = null;
      finishCurrentStream(false, 'MIGA server is not reachable. Start the local server on port 7860 and try again.');
      return null;
    }

    storyWsRef.current = ws;
    return ws;
  }, [finishCurrentStream, handleStorySocketMessage, stopAudio]);

  const resetStreamState = useCallback(() => {
    storyQueueEmptyRef.current = false;
    storyWaitFlagRef.current = false;
    setChoices([]);
    mascotRef.current?.resetAudioQueue();
    setIsStoryListening(false);
    setIsTutorListening(false);
    void Voice.stop().catch(() => {});
    resetSubtitles();
    streamAudioQueueRef.current = [];
    streamFinalPendingRef.current = false;
    sentenceBySeqRef.current = {};
    pendingSentenceRef.current = '';
    hadStreamResponseRef.current = false;
    isStreamingPlaybackActiveRef.current = false;
    stopAudio();
  }, [resetSubtitles, stopAudio]);

  const interruptCurrentStream = useCallback(() => {
    if (storyWsRef.current) {
      storyWsRef.current.close();
      storyWsRef.current = null;
    }
    resetStreamState();
    setIsSending(false);
    setIsThinking(false);
    setIsTutorStreaming(false);
    setIsStoryStreaming(false);
    setIsStoryListening(false);
    setIsTutorListening(false);
    void Voice.stop().catch(() => {});
    setStoryPhase('awaiting');
    setEmotion('listening');
    mascotRef.current?.stopSpeaking();
    mascotRef.current?.setMouth(0);
    mascotRef.current?.setExpression('listening');
  }, [resetStreamState]);

  const startStoryStream = useCallback((input: string) => {
    const text = input.trim();
    if (!text) return;
    setIsStoryStreaming(true);
    setIsThinking(true);
    setStoryAwaitingUser(false);
    setStoryPhase('generating');
    setVisualBoard(null);
    setSubtitles('');
    setStatusMessage('Thinking...');
    setEmotion('thinking');
    mascotRef.current?.setExpression('thinking');
    mascotRef.current?.setMouth(0.08, 0.15);
    resetStreamState();
    hadStreamResponseRef.current = false;
    streamModeRef.current = 'story';
    const payload: any = {
      action: 'start',
      query: text,
      language_code: storyLanguageRef.current,
      mode: 'story',
      session_id: sessionIdRef.current,
      student_profile: studentProfileRef.current,
    };
    if (currentStoryId) payload.upload_id = currentStoryId;
    pushLiveMessage('user', text);
    void (async () => {
      const ws = await ensureStorySocket();
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify(payload));
    })();
  }, [ensureStorySocket, currentStoryId, pushLiveMessage, resetStreamState]);

  const startTutorStream = useCallback((input: string) => {
    const text = input.trim();
    if (!text) return;
    setIsTutorStreaming(true);
    setIsThinking(true);
    setStatusMessage('Thinking...');
    setEmotion('thinking');
    mascotRef.current?.setExpression('thinking');
    mascotRef.current?.setMouth(0.08, 0.15);
    resetStreamState();
    hadStreamResponseRef.current = false;
    streamModeRef.current = 'tutor';
    pushLiveMessage('user', text);
    const payload = {
      action: 'start',
      query: text,
      tutor_instruction: buildLearnModePrompt(text, selectedLanguage),
      language_code: getTutorLangCode(),
      mode: 'tutor',
      session_id: sessionIdRef.current,
      student_profile: studentProfileRef.current,
    };
    void (async () => {
      const ws = await ensureStorySocket();
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify(payload));
    })();
  }, [ensureStorySocket, getTutorLangCode, pushLiveMessage, resetStreamState, selectedLanguage]);

  const stopStoryListening = useCallback(async () => {
    setIsStoryListening(false);
    try { await Voice.stop(); } catch {}
  }, []);

  const startStoryListening = useCallback(async () => {
    if (isStoryListening || isStoryStreaming || storyPhase === 'speaking') return;
    setIsStoryListening(true);
    try {
      if (Platform.OS === 'android') {
        const { PermissionsAndroid } = require('react-native');
        const g = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        if (g !== PermissionsAndroid.RESULTS.GRANTED) { setIsStoryListening(false); return; }
      }
      await Voice.start(storyLanguageRef.current || 'en-IN');
    } catch {
      setIsStoryListening(false);
      const message = 'Mic is not available in this Expo build. Type your reply here, or use a dev build for voice.';
      setSubtitles(message);
      setStatusMessage('Mic unavailable');
    }
  }, [isStoryListening, isStoryStreaming, storyPhase]);

  useEffect(() => {
    startStoryListeningRef.current = startStoryListening;
  }, [startStoryListening]);

  const startTutorListening = useCallback(async () => {
    if (isTutorListening || isTutorStreaming || isThinking) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsTutorListening(true);
    try {
      if (Platform.OS === 'android') {
        const { PermissionsAndroid } = require('react-native');
        const g = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        if (g !== PermissionsAndroid.RESULTS.GRANTED) { setIsTutorListening(false); return; }
      }
      await Voice.start(getTutorLangCode());
    } catch {
      setIsTutorListening(false);
      const message = 'Mic is not available in this Expo build. Type your question here, or use a dev build for voice.';
      setSubtitles(message);
      setStatusMessage('Mic unavailable');
    }
  }, [isTutorListening, isTutorStreaming, isThinking, getTutorLangCode]);

  const stopTutorListening = useCallback(async () => {
    setIsTutorListening(false);
    try { await Voice.stop(); } catch {}
  }, []);

  // Fixed: no premature isThinking reset in finally
  const handleSendAsk = useCallback(async (override?: string) => {
    const raw = (typeof override === 'string' ? override : askInput).trim();
    if (!raw) return;
    Keyboard.dismiss();
    if (isThinking || isTutorStreaming || isStoryStreaming || isPlaying || isStoryListening || isTutorListening) {
      interruptCurrentStream();
    }
    storyWaitFlagRef.current = false;
    setAskInput('');
    setIsThinking(true);
    setStatusMessage('Thinking...');
    setEmotion('thinking');
    mascotRef.current?.setExpression('thinking');
    if (experienceMode === 'tutor' && isGreetingOnly(raw)) {
      setIsSending(true);
      startTutorStream(raw);
      setIsSending(false);
      return;
    }
    setIsSending(true);
    if (experienceMode === 'story') {
      setChoices([]);
      startStoryStream(raw);
    } else {
      startTutorStream(raw);
    }
    setIsSending(false);
  }, [askInput, experienceMode, interruptCurrentStream, isPlaying, isStoryStreaming, isThinking, isTutorStreaming, startStoryStream, startTutorStream]);

  const handleExperienceChange = useCallback((mode: ExperienceMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setExperienceMode(mode);
    if (mode === 'tutor') {
      setEmotion('idle'); setChoices([]); setStoryPhase('idle'); setCurrentStoryId(null);
      resetSubtitles(); setStatusMessage(null); setIsSending(false);
      setIsThinking(false); setIsTutorStreaming(false);
      stopStoryListening(); setStoryAwaitingUser(false);
      if (storyWsRef.current) { storyWsRef.current.close(); storyWsRef.current = null; }
      mascotRef.current?.setMouth(0);
    } else {
      setEmotion('idle'); setLiveMessages([]); setAskInput(''); setChoices([]);
      setStoryPhase('idle'); setIsTutorStreaming(false); resetSubtitles(); setStatusMessage(null);
      setVisualBoard(null);
    }
  }, [resetSubtitles, stopStoryListening]);

  const handleMicToggle = useCallback(async () => {
    if (experienceMode === 'story') {
      if ((storyPhase === 'speaking' || isStoryStreaming || isPlaying) && !isStoryListening) {
        interruptCurrentStream();
      }
      isStoryListening ? await stopStoryListening() : await startStoryListening();
    } else {
      if ((isTutorStreaming || isThinking || isPlaying) && !isTutorListening) {
        interruptCurrentStream();
      }
      isTutorListening ? await stopTutorListening() : await startTutorListening();
    }
  }, [experienceMode, isStoryListening, isStoryStreaming, isTutorListening, storyPhase,
      isTutorStreaming, isThinking, isPlaying, interruptCurrentStream,
      startStoryListening, stopStoryListening, startTutorListening, stopTutorListening]);

  const handleUploadSuccess = useCallback(async (uploadId: string) => {
    setCurrentStoryId(uploadId);
    setIsThinking(true);
    setStoryPhase('generating');
    setChoices([]);
    try { startStoryStream('Start the interactive story now based on the document.'); }
    catch { pushLiveMessage('assistant', 'Error starting story.'); setStoryPhase('awaiting'); }
    finally { setIsThinking(false); }
  }, [pushLiveMessage, startStoryStream]);

  const handleStageTouch = (event: any) => {
    mascotRef.current?.lookAt(event.nativeEvent.pageX, event.nativeEvent.pageY);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // ── Local Interactive Mascot Narration & Suggestion Handlers ──────────────
  const playMascotTTS = useCallback(async (text: string, emotionalExpr: MascotEmotion = 'speaking') => {
    try {
      setIsThinking(true);
      setEmotion('thinking');
      mascotRef.current?.setExpression('thinking');
      setSubtitles(text);
      
      const cleanInput = sanitizeText(text);
      const base64Audio = await mascotApi.getTTS(cleanInput);
      const dataUri = `data:audio/mp3;base64,${base64Audio.replace(/^data:audio\/mp3;base64,/, '')}`;
      
      setIsThinking(false);
      setEmotion(emotionalExpr);
      mascotRef.current?.setExpression(emotionalExpr);
      
      await playUri(dataUri, () => {
        if (experienceMode === 'story') {
          setStoryPhase('speaking');
        }
      }, cleanInput);
    } catch (err) {
      console.warn('[mascot] Local TTS play failed:', err);
      setIsThinking(false);
      setEmotion(emotionalExpr);
      mascotRef.current?.setExpression(emotionalExpr);
      speak(text, () => {});
    }
  }, [playUri, speak, experienceMode]);

  const handleThirukkuralSuggestion = useCallback(async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      interruptCurrentStream();
      setKuralFlowState('couplet');
      setIsThinking(true);
      setEmotion('thinking');
      mascotRef.current?.setExpression('thinking');

      // Fetch the daily Kural strictly from database
      const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local time
      
      let { data: selection, error: selError } = await supabase
        .from('daily_thirukkural_selection')
        .select('kural_id')
        .eq('date', todayStr)
        .maybeSingle();

      let kuralId: number;
      if (selection && selection.kural_id) {
        kuralId = selection.kural_id;
        console.log(`[Thirukkural] Found saved Kural of the day: Kural ID ${kuralId} for ${todayStr}`);
      } else {
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const offsetIndex = (dayOfYear % 1330 + 1330) % 1330;
        kuralId = offsetIndex + 1; // 1-indexed

        const { error: insertError } = await supabase
          .from('daily_thirukkural_selection')
          .insert({
            date: todayStr,
            kural_id: kuralId,
            theme: 'Daily Wisdom'
          });

        if (insertError) {
          const { data: retrySelection } = await supabase
            .from('daily_thirukkural_selection')
            .select('kural_id')
            .eq('date', todayStr)
            .maybeSingle();
          if (retrySelection && retrySelection.kural_id) {
            kuralId = retrySelection.kural_id;
          }
        }
        console.log(`[Thirukkural] Saved new Kural of the day: Kural ID ${kuralId} for ${todayStr}`);
      }

      const { data: result, error } = await supabase
        .from('thirukkural')
        .select('*')
        .eq('kural_number', kuralId)
        .single();

      if (error || !result) {
        throw new Error("Strict fetch error - couplet not found");
      }

      setCurrentKural(result);
      setIsThinking(false);
      
      setChoices(['Meaning in English', 'Meaning in another language', 'Thirukkural in another language', 'Exit Kural Mode']);
      
      await playMascotTTS(`Today's Thirukkural Couplet number ${result.kural_number} is: ${result.kural_transliteration}. Do you want to know the meaning of this?`, "teaching");
    } catch (err) {
      console.warn('[mascot] Thirukkural fetch failed:', err);
      setIsThinking(false);
      setKuralFlowState('idle');
      await playMascotTTS("Apologies, I couldn't connect to the wisdom database to fetch today's Thirukkural. Please check your network.", "idle");
    }
  }, [interruptCurrentStream, playMascotTTS]);

  const handleKuralChoicePress = useCallback(async (choice: string) => {
    if (!currentKural) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (choice === 'Exit Kural Mode') {
      setKuralFlowState('idle');
      setCurrentKural(null);
      setChoices([]);
      setEmotion('idle');
      mascotRef.current?.setExpression('idle');
      await playMascotTTS("Exited Thirukkural mode. What else can I help you learn today?", "idle");
      return;
    }

    if (choice === 'Learn another Kural') {
      setKuralFlowState('idle');
      try {
        setKuralFlowState('couplet');
        setIsThinking(true);
        setEmotion('thinking');
        mascotRef.current?.setExpression('thinking');

        const randomOffset = Math.floor(Math.random() * 1330);
        const { data: result, error } = await supabase
          .from('thirukkural')
          .select('*')
          .eq('kural_number', randomOffset + 1)
          .single();

        if (error || !result) {
          throw new Error("Strict random fetch error");
        }

        setCurrentKural(result);
        setIsThinking(false);
        setChoices(['Meaning in English', 'Meaning in another language', 'Thirukkural in another language', 'Exit Kural Mode']);
        await playMascotTTS(`Here is another Thirukkural Couplet number ${result.kural_number}: ${result.kural_transliteration}. Do you want to know the meaning of this?`, "teaching");
      } catch (err) {
        setIsThinking(false);
        setKuralFlowState('idle');
        await playMascotTTS("Apologies, I couldn't load another Thirukkural. Please check your network.", "idle");
      }
      return;
    }

    if (kuralFlowState === 'couplet' || kuralFlowState === 'ask_meaning' || kuralFlowState === 'reading_explanation') {
      if (choice === 'Meaning in English') {
        setKuralFlowState('reading_explanation');
        const englishExplanation = `The English meaning of this Kural is: ${currentKural.meaning_english}. Modern life application: ${currentKural.life_application || currentKural.explanation_modern || 'Apply standard integrity principles.'}`;
        setChoices(['Learn another Kural', 'Exit Kural Mode']);
        await playMascotTTS(englishExplanation, "teaching");
      } else if (choice === 'Meaning in another language') {
        setKuralFlowState('choose_meaning_lang');
        setChoices(['Tamil', 'Hindi', 'Telugu', 'Kannada', 'Malayalam', 'Go Back']);
        await playMascotTTS("Sure! Which language would you like to hear the meaning in?", "teaching");
      } else if (choice === 'Thirukkural in another language') {
        setKuralFlowState('choose_kural_lang');
        setChoices(['Hindi', 'Telugu', 'Kannada', 'Malayalam', 'Go Back']);
        await playMascotTTS("Of course! Which language would you like to hear the Thirukkural couplet in?", "teaching");
      }
    } else if (kuralFlowState === 'choose_meaning_lang') {
      if (choice === 'Go Back') {
        setKuralFlowState('couplet');
        setChoices(['Meaning in English', 'Meaning in another language', 'Thirukkural in another language', 'Exit Kural Mode']);
        await playMascotTTS("Going back. Do you want to hear the meaning in English or another language?", "teaching");
        return;
      }

      const langObj = LANGUAGES_MAP.find(l => l.label === choice);
      if (!langObj) return;
      const langCode = langObj.code;
      const targetSarvam = langObj.sarvam;

      try {
        setIsThinking(true);
        setEmotion('thinking');
        mascotRef.current?.setExpression('thinking');
        
        let translatedText = '';
        
        if (currentKural[`meaning_${langCode}`]) {
          translatedText = currentKural[`meaning_${langCode}`];
        } else {
          const { data: dbTrans } = await supabase
            .from('thirukkural_translations')
            .select('meaning')
            .eq('kural_number', currentKural.kural_number)
            .eq('lang', langCode)
            .maybeSingle();

          if (dbTrans && dbTrans.meaning) {
            translatedText = dbTrans.meaning;
            currentKural[`meaning_${langCode}`] = dbTrans.meaning;
          } else {
            const { data: cacheResult } = await SupabaseService.callEdgeFunction('thirukkural_translate_table', {
              kural_number: currentKural.kural_number,
              target_language_code: targetSarvam,
              lang: langCode
            });
            const cached = cacheResult?.data;
            if (cached && cached.meaning) {
              translatedText = cached.meaning;
              currentKural[`meaning_${langCode}`] = cached.meaning;
              
              await supabase.from('thirukkural_translations').upsert({
                kural_number: currentKural.kural_number,
                lang: langCode,
                meaning: cached.meaning,
                explanation_modern: cached.explanation_modern || '',
                life_application: cached.life_application || ''
              }, { onConflict: 'kural_number,lang' });
            } else {
              throw new Error("Strict edge function translation failed");
            }
          }
        }

        setKuralFlowState('reading_explanation');
        setChoices(['Learn another Kural', 'Exit Kural Mode']);
        await playMascotTTS(`The meaning in ${choice} is: ${translatedText}`, "teaching");
      } catch (err) {
        console.warn('[mascot] Translation error:', err);
        setKuralFlowState('reading_explanation');
        setChoices(['Learn another Kural', 'Exit Kural Mode']);
        await playMascotTTS(`Apologies, I couldn't translate the meaning to ${choice} right now. Please try again.`, "teaching");
      } finally {
        setIsThinking(false);
      }
    } else if (kuralFlowState === 'choose_kural_lang') {
      if (choice === 'Go Back') {
        setKuralFlowState('couplet');
        setChoices(['Meaning in English', 'Meaning in another language', 'Thirukkural in another language', 'Exit Kural Mode']);
        await playMascotTTS("Going back. Do you want to hear the meaning in English or another language?", "teaching");
        return;
      }

      const langObj = LANGUAGES_MAP.find(l => l.label === choice);
      if (!langObj) return;
      const langCode = langObj.code;
      const targetSarvam = langObj.sarvam;

      try {
        setIsThinking(true);
        setEmotion('thinking');
        mascotRef.current?.setExpression('thinking');
        
        let translatedCouplet = '';
        
        const { data: dbTrans } = await supabase
          .from('thirukkural_translations')
          .select('meaning')
          .eq('kural_number', currentKural.kural_number)
          .eq('lang', langCode)
          .maybeSingle();

        if (dbTrans && dbTrans.meaning) {
          translatedCouplet = dbTrans.meaning;
        } else {
          const { data: translateResult } = await SupabaseService.callEdgeFunction('thirukkural_translate_table', {
            kural_number: currentKural.kural_number,
            target_language_code: targetSarvam,
            lang: langCode
          });

          const cached = translateResult?.data;
          if (cached && cached.meaning) {
            translatedCouplet = cached.meaning;
            await supabase.from('thirukkural_translations').upsert({
              kural_number: currentKural.kural_number,
              lang: langCode,
              meaning: cached.meaning,
              explanation_modern: cached.explanation_modern || '',
              life_application: cached.life_application || ''
            }, { onConflict: 'kural_number,lang' });
          } else {
            throw new Error("Strict couplet translation failed");
          }
        }

        setKuralFlowState('reading_explanation');
        setChoices(['Learn another Kural', 'Exit Kural Mode']);
        await playMascotTTS(`The translated couplet in ${choice} is: ${translatedCouplet}`, "teaching");
      } catch (err) {
        console.warn('[mascot] Couplet translation error:', err);
        setKuralFlowState('reading_explanation');
        setChoices(['Learn another Kural', 'Exit Kural Mode']);
        await playMascotTTS(`Apologies, I couldn't translate the couplet to ${choice} right now. Please try again.`, "teaching");
      } finally {
        setIsThinking(false);
      }
    }
  }, [currentKural, kuralFlowState, playMascotTTS]);

  const handleCurrentAffairsSuggestion = useCallback(async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      interruptCurrentStream();
      setCurrentAffairsState('question');
      setIsThinking(true);
      setEmotion('thinking');
      mascotRef.current?.setExpression('thinking');

      // Fetch dynamic Current Affairs questions strictly from Redis (Upstash)
      const todayStr = new Date().toLocaleDateString('en-CA');
      let qList = await RedisService.getDailyCurrentAffairs(todayStr);
      
      if (!qList || qList.length === 0) {
        qList = await RedisService.getQuestions('current_affairs', 15);
        if (qList && qList.length > 0) {
          await RedisService.setDailyCurrentAffairs(todayStr, qList);
        }
      }

      if (qList && qList.length > 0) {
        setCaQuestions(qList);
        setCaIndex(0);
        setIsThinking(false);

        const currentQ = qList[0];
        const cleanOpts = currentQ.options.map((opt: string) => opt.split('. ').slice(1).join('. ') || opt).map((opt: string) => opt.length > 25 ? opt.substring(0, 22) + '...' : opt);
        setChoices([...cleanOpts, 'Exit Current Affairs']);

        await playMascotTTS(`Let's discuss today's Current Affairs! Question 1: ${currentQ.question}`, "teaching");
      } else {
        throw new Error("Strict fetch error - Current affairs questions list empty");
      }
    } catch (err) {
      console.warn('[mascot] Current Affairs fetch failed:', err);
      setIsThinking(false);
      setCurrentAffairsState('idle');
      await playMascotTTS("I couldn't fetch today's Current Affairs questions. Please make sure your internet is working properly.", "idle");
    }
  }, [interruptCurrentStream, playMascotTTS]);

  const handleCurrentAffairsChoicePress = useCallback(async (choice: string) => {
    if (caQuestions.length === 0) return;
    const currentQ = caQuestions[caIndex];
    if (!currentQ) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (choice === 'Exit Current Affairs') {
      setCurrentAffairsState('idle');
      setCaQuestions([]);
      setChoices([]);
      setEmotion('idle');
      mascotRef.current?.setExpression('idle');
      await playMascotTTS("Exited Current Affairs. What would you like to study next?", "idle");
      return;
    }

    if (choice === 'Next Question') {
      const nextIdx = caIndex + 1;
      if (nextIdx < caQuestions.length) {
        setCaIndex(nextIdx);
        setCurrentAffairsState('question');
        const nextQ = caQuestions[nextIdx];
        
        const cleanOpts = nextQ.options.map((opt: string) => opt.split('. ').slice(1).join('. ') || opt).map((opt: string) => opt.length > 25 ? opt.substring(0, 22) + '...' : opt);
        setChoices([...cleanOpts, 'Exit Current Affairs']);
        
        await playMascotTTS(`Question ${nextIdx + 1}: ${nextQ.question}`, "teaching");
      } else {
        setCurrentAffairsState('idle');
        setCaQuestions([]);
        setChoices([]);
        await playMascotTTS("Awesome job! We have completed today's Current Affairs discussion. You are fully updated!", "idle");
      }
      return;
    }

    // Process user answer choice
    const cleanOpts = currentQ.options.map((opt: string) => opt.split('. ').slice(1).join('. ') || opt).map((opt: string) => opt.length > 25 ? opt.substring(0, 22) + '...' : opt);
    const selectedIdx = cleanOpts.indexOf(choice);
    const actualIdx = selectedIdx >= 0 ? selectedIdx : currentQ.options.findIndex((opt: string) => opt.includes(choice));

    setCurrentAffairsState('explanation');
    setChoices(['Next Question', 'Exit Current Affairs']);

    if (actualIdx === currentQ.answer_index) {
      await playMascotTTS(`Spot on! That is absolutely correct. ${currentQ.explanation}`, "teaching");
    } else {
      const correctOptionLetter = String.fromCharCode(65 + currentQ.answer_index); // A, B, C, D
      await playMascotTTS(`Ah, that's not quite right. The correct answer is Option ${correctOptionLetter}. ${currentQ.explanation}`, "teaching");
    }
  }, [caQuestions, caIndex, playMascotTTS]);

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => { storyLanguageRef.current = storyLanguage; }, [storyLanguage]);
  useEffect(() => { studentProfileRef.current = studentProfile; }, [studentProfile]);

  useEffect(() => {
    let live = true;
    (async () => {
      const fallback: StudentStoryProfile = {
        name: defaultProfileName(user),
        exam_goal: 'Competitive exams',
        language_code: storyLanguage,
        language_label: selectedLanguage,
        preferred_style: 'family drama',
      };
      try {
        const raw = await AsyncStorage.getItem(profileStorageKey());
        if (!live) return;
        if (raw) {
          const saved = JSON.parse(raw);
          const next = { ...fallback, ...saved, name: saved?.name || fallback.name };
          studentProfileRef.current = next;
          setStudentProfile(next);
        } else {
          studentProfileRef.current = fallback;
          setStudentProfile(fallback);
        }
      } catch {
        if (!live) return;
        studentProfileRef.current = fallback;
        setStudentProfile(fallback);
      }
    })();
    return () => { live = false; };
  }, [profileStorageKey, user]);

  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      const spoken = e.value?.[0]?.trim();
      if (!spoken) return;
      if (experienceMode === 'story' && isStoryListening) {
        stopStoryListening();
        startStoryStream(spoken);
      } else if (experienceMode === 'tutor' && isTutorListening) {
        setIsTutorListening(false);
        Voice.stop().catch(() => {});
        handleSendAsk(spoken);
      }
    };
    Voice.onSpeechError = () => {
      setIsStoryListening(false);
      setIsTutorListening(false);
      setSubtitles('I could not hear that. Type it here, or use a dev build for voice mic support.');
      setStatusMessage('Mic unavailable');
    };
    return () => { Voice.destroy().then(Voice.removeAllListeners).catch(() => {}); };
  }, [experienceMode, isStoryListening, isTutorListening, startStoryStream, stopStoryListening, handleSendAsk]);

  useEffect(() => {
    if (experienceMode !== 'story' || !storyAwaitingUser || isStoryListening) return;
    const t = setTimeout(() => {
      if (experienceMode === 'story' && storyAwaitingUser && !isStoryListening) startStoryListening();
    }, 500);
    return () => clearTimeout(t);
  }, [experienceMode, storyAwaitingUser, isStoryListening, startStoryListening]);

  useEffect(() => {
    if (experienceMode !== 'tutor' || isResponding || isTutorListening || !subtitles.trim().endsWith('?')) return;
    if (nudgeForSubtitleRef.current === subtitles) return;
    const currentQuestion = subtitles;
    const t = setTimeout(() => {
      if (nudgeForSubtitleRef.current === currentQuestion) return;
      nudgeForSubtitleRef.current = currentQuestion;
      const nudge = 'Still there? Want me to repeat the question?';
      setEmotion('listening');
      setSubtitles(nudge);
      speak(nudge, () => mascotRef.current?.setExpression('listening'));
    }, 14000);
    return () => clearTimeout(t);
  }, [experienceMode, isResponding, isTutorListening, speak, subtitles]);

  useEffect(() => {
    if (experienceMode !== 'tutor' || greetedRef.current || isThinking || isSending || subtitles) return;
    const greeting = getTimeGreeting();
    setStatusMessage(greeting);
    greetedRef.current = true;
    const t = setTimeout(() => setStatusMessage((p) => (p === greeting ? null : p)), 3000);
    return () => clearTimeout(t);
  }, [experienceMode, isThinking, isSending, subtitles]);

  useEffect(() => {
    if (!user?.id) return;
    let live = true;
    (async () => {
      try {
        const [recs, plan] = await Promise.all([
          SupabaseService.getMascotRecommendations(user.id),
          SupabaseService.getPersonalizedStudyPlan(user.id),
        ]);
        if (!live) return;
        const weak = plan?.weakAreas?.[0]?.topic;
        setRecommendedPrompt(weak ? `Revise ${weak} with MIGA` : recs?.[0] || null);
      } catch { if (live) setRecommendedPrompt(null); }
    })();
    return () => { live = false; };
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      setStageIntroKey((prev) => prev + 1);
    }, [])
  );

  // Fallback: dismiss boot overlay if onReady never fires (web, CDN fail, etc.)
  useEffect(() => {
    const t = setTimeout(() => setIsMascotBooted(true), 15000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => () => {
    if (storyWsRef.current) { storyWsRef.current.close(); storyWsRef.current = null; }
  }, []);

  if (!user && !loading) return <View style={s.root} />;

  const isInputLocked = isSending;
  const isListening = experienceMode === 'story' ? isStoryListening : isTutorListening;
  const assistantStatus = isListening
    ? 'Listening'
      : isPlaying || storyPhase === 'speaking'
        ? 'Speaking'
        : isThinking || isTutorStreaming || isStoryStreaming
          ? 'Thinking'
        : statusMessage || 'Ready';
  const phaseLabel: Record<StoryPhase, string> = {
    idle: 'Ready', ingesting: 'Reading doc…', generating: 'Thinking…', speaking: 'Speaking…', awaiting: 'Your turn…',
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={s.environment} pointerEvents="none">
        <LinearGradient
          colors={['#F8FAFC', '#FFFFFF', '#EEF7F2']}
          style={StyleSheet.absoluteFill}
        />
        <View style={s.cleanTopWash} />
        <View style={s.cleanBottomWash} />
      </View>

      <SafeAreaView edges={['top']} style={s.safeArea}>
        <View style={s.iconHeader}>
            <TouchableOpacity
              style={s.headerIconButton}
              onPress={() => setIsLangPickerOpen(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="language" size={18} color="#0F172A" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                s.headerIconButton,
                s.modeIconButton,
                experienceMode === 'story' && s.modeIconButtonStory,
              ]}
              onPress={() => handleExperienceChange(experienceMode === 'tutor' ? 'story' : 'tutor')}
              activeOpacity={0.8}
            >
              <Ionicons
                name={experienceMode === 'tutor' ? 'school' : 'chatbubbles'}
                size={19}
                color="#FFFFFF"
              />
              <View style={s.modeIconDot} />
            </TouchableOpacity>
        </View>

        {/* ── Immersion stage ─────────────────────────────────────────────── */}
        <View style={s.stage}>
          <View style={[StyleSheet.absoluteFill, { zIndex: -1 }]} pointerEvents="none">
             <View style={s.flagMedallionShadow} />
             <View style={s.flagSplitWrap}>
               <MotiView
                 key={`flag-left-${stageIntroKey}-${isMascotBooted ? 'ready' : 'booting'}`}
                 from={{ translateX: -92 }}
                 animate={{ translateX: 0 }}
                 transition={{ type: 'timing', duration: 540, delay: 60 }}
                 style={[s.flagHalf, s.flagHalfLeft]}
               >
                 <View style={[s.flagHalfContent, s.flagHalfContentLeft]}>
                   <View style={s.flagSaffron} />
                   <View style={s.flagWhite} />
                   <View style={s.flagGreen} />
                 </View>
               </MotiView>
               <MotiView
                 key={`flag-right-${stageIntroKey}-${isMascotBooted ? 'ready' : 'booting'}`}
                 from={{ translateX: 92 }}
                 animate={{ translateX: 0 }}
                 transition={{ type: 'timing', duration: 540, delay: 60 }}
                 style={[s.flagHalf, s.flagHalfRight]}
               >
                 <View style={[s.flagHalfContent, s.flagHalfContentRight]}>
                   <View style={s.flagSaffron} />
                   <View style={s.flagWhite} />
                   <View style={s.flagGreen} />
                 </View>
               </MotiView>
               <MotiView
                 key={`chakra-${stageIntroKey}-${isMascotBooted ? 'ready' : 'booting'}`}
                 from={{ opacity: 0, scale: 0.7 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ type: 'spring', damping: 18, delay: 420 }}
                 style={s.chakra}
               >
                 {Array.from({ length: 12 }).map((_, i) => (
                   <View
                     key={`chakra-${i}`}
                     style={[s.chakraSpoke, { transform: [{ rotate: `${i * 15}deg` }] }]}
                   />
                 ))}
                 <View style={s.chakraHub} />
               </MotiView>
             </View>
             <MotiView
               key={`flag-ring-${stageIntroKey}-${isMascotBooted ? 'ready' : 'booting'}`}
               from={{ opacity: 0, scale: 0.86 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ type: 'spring', damping: 22, delay: 450 }}
               style={s.flagMedallionRing}
             />
          </View>

          {/* Mascot Container - No vertical clipping */}
          <MotiView
            key={`mascot-pop-${stageIntroKey}-${isMascotBooted ? 'ready' : 'booting'}`}
            from={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 300, delay: 520 }}
            style={s.mascotWrapper}
          >
            <MascotRig
              key="mascot-rig-stable"
              ref={mascotRef}
              size={Math.min(SCREEN.width * 1.15, 520)}
              onReady={() => setIsMascotBooted(true)}
              onError={() => setIsMascotBooted(true)}
              emotion={emotion}
              onAudioQueueEmpty={() => {
                mascotRef.current?.stopSpeaking();
                mascotRef.current?.setMouth(0);
              }}
            />
          </MotiView>

          {/* Persistent visual board for timelines, formulas, lists */}
          <AnimatePresence>
            {experienceMode !== 'story' && !!visualBoard && (
              <MotiView
                key={`visual-board-${visualBoard.title || 'board'}`}
                from={{ opacity: 0, translateY: -10, scale: 0.97 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                exit={{ opacity: 0, translateY: -6, scale: 0.98 }}
                transition={{ type: 'timing', duration: 260 }}
                style={s.visualBoard}
              >
                {!!visualBoard.title && <Text style={s.visualBoardTitle}>{visualBoard.title}</Text>}
                {!!visualBoard.subtitle && <Text style={s.visualBoardSub}>{visualBoard.subtitle}</Text>}
                {!!visualBoard.rows?.length && (
                  <View style={s.visualRows}>
                    {visualBoard.rows.slice(0, 6).map((row, idx) => (
                      <View key={`${row.label}-${idx}`} style={s.visualRow}>
                        <View style={s.visualRowTop}>
                          <Text style={s.visualRowLabel} numberOfLines={1}>{row.label}</Text>
                          {!!row.value && <Text style={s.visualRowValue} numberOfLines={1}>{row.value}</Text>}
                        </View>
                        {!!row.note && <Text style={s.visualRowNote} numberOfLines={2}>{row.note}</Text>}
                      </View>
                    ))}
                  </View>
                )}
                {!!visualBoard.bullets?.length && (
                  <View style={s.visualBullets}>
                    {visualBoard.bullets.slice(0, 4).map((item, idx) => (
                      <Text key={`${item}-${idx}`} style={s.visualBullet} numberOfLines={2}>- {item}</Text>
                    ))}
                  </View>
                )}
              </MotiView>
            )}
          </AnimatePresence>

                    {/* Subtitle bubble - Premium Fading Style (Always bottom, full text visible) */}
          <AnimatePresence>
            {!!subtitles && (
              <MotiView
                key="sub"
                from={{ opacity: 0, translateY: 15, scale: 0.95 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                exit={{ opacity: 0, translateY: 5, scale: 0.98 }}
                transition={{ type: 'timing', duration: 400 }}
                style={[
                  s.subtitleContainer,
                  { bottom: Math.max(insets.bottom + 115, 125) },
                  visualBoard ? s.subtitleContainerBoardAware : null,
                ]}
              >
                <BlurView intensity={68} tint="light" style={s.subtitleBlur}>
                  <Text style={s.subtitleText}>
                    {sanitizeText(subtitles)}
                  </Text>
                </BlurView>
              </MotiView>
            )}
          </AnimatePresence>

          {/* Choice pills */}
          <AnimatePresence>
            {choices.length > 0 && (
              <MotiView
                key="choices"
                from={{ opacity: 0, translateY: 18 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0 }}
                style={[
                  s.choicesWrap, 
                  { bottom: insets.bottom + 160 }
                ]}
              >
                {choices.map((c) => {
                  const isLengthyOrMany = choices.length > 2 || choices.some(x => x.length > 18);
                  return (
                    <TouchableOpacity
                      key={c}
                      style={[
                        s.choicePill,
                        isLengthyOrMany ? { width: '48%', alignItems: 'center' } : null
                      ]}
                      activeOpacity={0.8}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        if (kuralFlowState !== 'idle') {
                          handleKuralChoicePress(c);
                        } else if (currentAffairsState !== 'idle') {
                          handleCurrentAffairsChoicePress(c);
                        } else {
                          handleSendAsk(c);
                        }
                      }}
                    >
                      <Text style={s.choiceText} numberOfLines={1} adjustsFontSizeToFit>{c}</Text>
                    </TouchableOpacity>
                  );
                })}
              </MotiView>
            )}
          </AnimatePresence>
        </View>

        {/* ── Control dock ──────────────────────────────────────────────── */}
        {/* ── Premium Floating Dock ────────────────────────────────────────── */}
        <View style={[s.floatingDockWrap, { bottom: Math.max(insets.bottom + 52, 64) }]}>
          {/* Mascot Idle Suggestion Buttons */}
          {kuralFlowState === 'idle' && currentAffairsState === 'idle' && !subtitles && (
            <View style={s.suggestionsRow}>
              <TouchableOpacity
                style={s.suggestionBtn}
                onPress={handleThirukkuralSuggestion}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="book-open-page-variant" size={15} color="#0F172A" />
                <Text style={s.suggestionBtnText}>Learn Thirukkural of the day</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={s.suggestionBtn}
                onPress={handleCurrentAffairsSuggestion}
                activeOpacity={0.8}
              >
                <Ionicons name="newspaper-outline" size={15} color="#0F172A" />
                <Text style={s.suggestionBtnText}>Discuss Today's Current Affairs</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Phase indicator */}
          {experienceMode === 'story' && storyPhase !== 'idle' && (
            <MotiView 
              from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }}
              style={s.phaseContainer}
            >
              <View style={[s.phaseBadge, storyPhase === 'speaking' && s.phaseBadgeActive]}>
                <ActivityIndicator size="small" color="#00D4C7" style={{ marginRight: 6 }} />
                <Text style={s.phaseLabel}>{phaseLabel[storyPhase]}</Text>
              </View>
            </MotiView>
          )}

          <View style={s.floatingInputBar}>
            {experienceMode === 'story' && (
              <TouchableOpacity
                style={s.floatingActionBtn}
                onPress={() => setShowUploadModal(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={24} color="#64748B" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleMicToggle}
              disabled={isSending && !isListening}
              style={[s.premiumMicBtn, isListening && s.premiumMicBtnActive]}
              activeOpacity={0.82}
            >
              <Ionicons
                name={isListening ? 'mic' : 'mic-outline'}
                size={20}
                color={isListening ? '#FFFFFF' : '#0F172A'}
              />
            </TouchableOpacity>

            <TextInput
              placeholder={
                experienceMode === 'story'
                  ? storyAwaitingUser ? 'Reply to MIGA...' : 'Type here...'
                  : 'Ask MIGA anything...'
              }
              placeholderTextColor="#94A3B8"
              style={s.premiumInput}
              value={askInput}
              onChangeText={setAskInput}
              onSubmitEditing={() => handleSendAsk()}
              editable={!isInputLocked}
              returnKeyType="send"
            />
            
            <View style={s.inputActions}>
              <TouchableOpacity
                style={[s.premiumSendBtn, (isSending || !askInput.trim()) && s.premiumSendBtnDisabled]}
                onPress={() => handleSendAsk()}
                disabled={isSending || !askInput.trim()}
              >
                {isResponding ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Boot overlay */}
      {!isMascotBooted && (
        <View style={s.bootOverlay}>
          <BootLoader />
        </View>
      )}

      {/* ── Language sheet ─────────────────────────────────────────────── */}
      <Modal
        visible={isLangPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLangPickerOpen(false)}
      >
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setIsLangPickerOpen(false)}>
          <MotiView
            from={{ translateY: 300, opacity: 0.9 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 220 }}
            style={[s.sheet, { paddingBottom: insets.bottom + 24 }]}
          >
            <View style={s.sheetHandle} />
            <Text style={s.sheetTitle}>Voice Language</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { id: 'en-IN', label: 'English' },
                { id: 'hi-IN', label: 'Hindi' },
                { id: 'ta-IN', label: 'Tamil' },
                { id: 'te-IN', label: 'Telugu' },
                { id: 'ml-IN', label: 'Malayalam' },
                { id: 'kn-IN', label: 'Kannada' },
              ].map((lang) => {
                const active = selectedLanguage === lang.label;
                return (
                  <TouchableOpacity
                    key={lang.id}
                    style={[s.langRow, active && s.langRowOn]}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedLanguage(lang.label);
                      setStoryLanguage(lang.id);
                      mergeStudentProfile({
                        language_code: lang.id,
                        language_label: lang.label,
                        name: studentProfileRef.current.name || defaultProfileName(user),
                      });
                      setIsLangPickerOpen(false);
                    }}
                  >
                    <Text style={[s.langRowText, active && s.langRowTextOn]}>{lang.label}</Text>
                    {active && <Ionicons name="checkmark-circle" size={20} color="#00D4C7" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </MotiView>
        </TouchableOpacity>
      </Modal>

      {/* ── Story upload modal ─────────────────────────────────────────── */}
      <StoryUploadModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
        onUploadStart={() => setStoryPhase('ingesting')}
        onUploadEnd={() => setStoryPhase('idle')}
      />
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  safeArea: { flex: 1 },
  environment: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  cleanTopWash: {
    position: 'absolute',
    top: -SCREEN.width * 0.42,
    alignSelf: 'center',
    width: SCREEN.width * 1.15,
    height: SCREEN.width * 1.15,
    borderRadius: SCREEN.width * 0.575,
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
  },
  cleanBottomWash: {
    position: 'absolute',
    bottom: -SCREEN.width * 0.36,
    alignSelf: 'center',
    width: SCREEN.width * 1.22,
    height: SCREEN.width * 1.22,
    borderRadius: SCREEN.width * 0.61,
    backgroundColor: 'rgba(19, 136, 8, 0.08)',
  },
  // Header
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    paddingVertical: 12,
  },
  headerBrand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 24, fontFamily: 'Poppins-Bold', color: '#0F172A', letterSpacing: -1 },
  accent: { color: '#00D4C7' },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 212, 199, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00D4C7' },
  liveText: { fontSize: 10, fontFamily: 'Poppins-Bold', color: '#00D4C7', letterSpacing: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconHeader: {
    position: 'absolute',
    top: 84,
    right: 14,
    zIndex: 120,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    ...V2026.shadows.milky,
  },
  modeIconButton: {
    backgroundColor: '#0F172A',
    borderColor: 'rgba(15, 23, 42, 0.18)',
  },
  modeIconButtonStory: {
    backgroundColor: '#138808',
    borderColor: 'rgba(19, 136, 8, 0.22)',
  },
  modeIconDot: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF9933',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  newHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 110,
    width: '100%',
  },
  headerBrandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 199, 0.15)',
    ...V2026.shadows.milky,
  },
  brandMainText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    lineHeight: 16,
  },
  brandStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  brandStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  brandStatusDotHot: {
    backgroundColor: '#EF4444',
  },
  brandStatusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiMascotTab: {
    position: 'absolute',
    top: 48,
    left: 16,
    zIndex: 110,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: 154,
    height: 54,
    paddingHorizontal: 11,
    borderRadius: 27,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    ...V2026.shadows.milky,
  },
  aiMark: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
  },
  aiCopy: { flex: 1, minWidth: 0 },
  aiTitle: { fontSize: 13, fontFamily: 'Poppins-Bold', color: '#0F172A', lineHeight: 16 },
  aiStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  aiStatusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34D399' },
  aiStatusDotHot: { backgroundColor: '#EF4444' },
  aiStatusText: { flexShrink: 1, fontSize: 11, fontFamily: 'Inter-SemiBold', color: '#64748B' },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.36)',
    ...V2026.shadows.milky,
  },
  langPillText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: '#0F172A' },
  modeToggle: {
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    ...V2026.shadows.milky,
  },
  modeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  modeLabel: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: '#FFFFFF' },

  // Mode Title
  modeTitleContainer: { paddingHorizontal: 20, marginTop: 4 },
  modeTitle: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  modeSubtitle: { fontSize: 12, fontFamily: 'Inter-Medium', color: '#64748B', marginTop: -2 },

  // Stage
  stage: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    position: 'relative',
  },
  flagMedallionShadow: {
    position: 'absolute',
    top: SCREEN.height * 0.075,
    width: Math.min(SCREEN.width * 0.78, 360),
    height: Math.min(SCREEN.width * 0.78, 360),
    borderRadius: Math.min(SCREEN.width * 0.39, 180),
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.04)',
    transform: [{ translateY: 14 }, { scale: 0.98 }],
  },
  flagSplitWrap: {
    position: 'absolute',
    top: SCREEN.height * 0.07,
    width: Math.min(SCREEN.width * 0.76, 350),
    height: Math.min(SCREEN.width * 0.76, 350),
    borderRadius: Math.min(SCREEN.width * 0.38, 175),
    alignSelf: 'center',
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 8,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    ...V2026.shadows.milky,
  },
  flagHalf: {
    width: '50%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  flagHalfLeft: {
    borderTopLeftRadius: Math.min(SCREEN.width * 0.38, 175),
    borderBottomLeftRadius: Math.min(SCREEN.width * 0.38, 175),
  },
  flagHalfRight: {
    borderTopRightRadius: Math.min(SCREEN.width * 0.38, 175),
    borderBottomRightRadius: Math.min(SCREEN.width * 0.38, 175),
  },
  flagHalfContent: {
    position: 'absolute',
    top: 0,
    width: Math.min(SCREEN.width * 0.76, 350) - 16,
    height: Math.min(SCREEN.width * 0.76, 350) - 16,
  },
  flagHalfContentLeft: {
    left: 0,
  },
  flagHalfContentRight: {
    right: 0,
  },
  flagSaffron: {
    flex: 1,
    backgroundColor: '#FF9933',
  },
  flagWhite: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagGreen: {
    flex: 1,
    backgroundColor: '#138808',
  },
  chakra: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -22,
    marginLeft: -22,
    zIndex: 4,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#000080',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chakraSpoke: {
    position: 'absolute',
    width: 1,
    height: 38,
    backgroundColor: '#000080',
  },
  chakraHub: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#000080',
  },
  flagMedallionRing: {
    position: 'absolute',
    top: SCREEN.height * 0.057,
    width: Math.min(SCREEN.width * 0.82, 378),
    height: Math.min(SCREEN.width * 0.82, 378),
    borderRadius: Math.min(SCREEN.width * 0.41, 189),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  floatingHeader: {
    position: 'absolute',
    top: 112,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 100,
    alignItems: 'center',
  },
  bootOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 999, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  pulseWrap: {
    position: 'absolute',
    width: SCREEN.width, height: SCREEN.width,
    alignItems: 'center', justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: SCREEN.width * 0.6, height: SCREEN.width * 0.6,
    borderRadius: SCREEN.width * 0.3,
    borderWidth: 2, borderColor: 'rgba(0, 212, 199, 0.15)',
  },
  mascotWrapper: { 
    width: SCREEN.width,
    height: SCREEN.height * 0.66, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: -65,
  },

  // Recommendation Pill
  recPillContainer: { position: 'absolute', top: 20, alignSelf: 'center' },
  recPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 199, 0.2)',
    ...V2026.shadows.primary,
  },
  recPillText: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: '#0F172A' },

  // Status pill
  statusPill: {
    position: 'absolute', bottom: 40, alignSelf: 'center',
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 25, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#E2E8F0',
    ...V2026.shadows.milky,
  },
  statusPillText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: '#64748B' },

  visualBoard: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    width: '92%',
    maxWidth: 520,
    maxHeight: 280,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    zIndex: 120,
    ...V2026.shadows.milky,
  },
  visualBoardTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    lineHeight: 17,
  },
  visualBoardSub: {
    marginTop: 1,
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    lineHeight: 14,
  },
  visualRows: {
    marginTop: 8,
    gap: 6,
  },
  visualRow: {
    minHeight: 42,
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 7,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  visualRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  visualRowLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    minWidth: 0,
    flex: 1,
    flexShrink: 1,
    lineHeight: 15,
  },
  visualRowValue: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#138808',
    flexShrink: 0,
    lineHeight: 14,
  },
  visualRowNote: {
    marginTop: 3,
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    lineHeight: 13,
  },
  visualBullets: {
    marginTop: 8,
    gap: 3,
  },
  visualBullet: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#334155',
    lineHeight: 14,
  },

  // Subtitle
  subtitleContainer: {
    position: 'absolute', 
    alignSelf: 'center',
    width: '92%',
    maxWidth: 520,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    ...V2026.shadows.milky,
  },
  subtitleContainerBoardAware: {
    width: '92%',
  },
  subtitleBlur: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  subtitleText: { 
    color: '#0F172A', 
    fontSize: 14, 
    textAlign: 'center', 
    lineHeight: 22, 
    fontFamily: 'Inter-SemiBold' 
  },

  // Choices
  choicesWrap: {
    position: 'absolute',
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', gap: 8, paddingHorizontal: 20,
  },
  choicePill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 1, borderColor: 'rgba(236, 253, 245, 0.24)',
    ...V2026.shadows.milky,
  },
  choiceText: { color: '#0F172A', fontSize: 13, fontFamily: 'Poppins-Bold' },

  // Floating Dock Redesign
  floatingDockWrap: {
    position: 'absolute',
    left: 14,
    right: 14,
    alignItems: 'center',
    zIndex: 100,
  },
  phaseContainer: { marginBottom: 16, alignItems: 'center' },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    ...V2026.shadows.milky,
  },
  phaseBadgeActive: { borderColor: 'rgba(19, 136, 8, 0.24)', backgroundColor: 'rgba(236, 253, 245, 0.95)' },
  phaseLabel: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: '#0F172A' },
  
  floatingInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 26,
    paddingLeft: 7,
    paddingRight: 6,
    height: 56,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    ...V2026.shadows.milky,
  },
  floatingActionBtn: {
    marginRight: 10,
  },
  premiumInput: { 
    flex: 1, 
    color: '#0F172A', 
    fontSize: 15, 
    fontFamily: 'Inter-Medium', 
    height: '100%',
    paddingHorizontal: 10,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  premiumMicBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#EEF7F2',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(19, 136, 8, 0.14)',
  },
  premiumMicBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
    ...V2026.shadows.primary,
  },
  premiumSendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#063F33', 
    alignItems: 'center', justifyContent: 'center',
  },
  premiumSendBtnDisabled: { backgroundColor: '#CBD5D1' },

  // Sheet
  overlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36, borderTopRightRadius: 36,
    paddingHorizontal: 28, paddingTop: 16,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0', alignSelf: 'center', marginBottom: 22 },
  sheetTitle: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#0F172A', marginBottom: 16 },
  langRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 15, paddingHorizontal: 16, borderRadius: 16, marginBottom: 6,
    backgroundColor: '#F8FAFC',
  },
  langRowOn: { backgroundColor: 'rgba(0,212,199,0.08)' },
  langRowText: { fontSize: 15, fontFamily: 'Inter-Medium', color: '#0F172A' },
  langRowTextOn: { fontFamily: 'Poppins-SemiBold', color: '#00D4C7' },
  suggestionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    justifyContent: 'center',
    width: '100%',
  },
  suggestionBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  suggestionBtnText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginLeft: 6,
  },
});

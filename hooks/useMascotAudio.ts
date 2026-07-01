import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { mascotApi } from '@/services/mascotApi';
import { migaVoice, VoiceProvider } from '../services/migaAI/voice';

interface MascotAudioOptions {
  voiceEnabled?: boolean;
   onAudioStart?: (text: string) => void;
   onAudioStop?: () => void;
   onVisemeFrame?: (value: number, form?: number) => void;
   onAudioMeta?: (durationMs: number) => void;
}

export type VisemeFrame = {
  time_ms: number;
  open: number;
  form?: number;
  value?: string;
};

type SpeechJob = {
  text: string;
  onStart?: () => void;
};

const SUPABASE_TIMEOUT_MS = 3000;

// Helper to convert Data URI to Local File for stable Expo AV playback
const toFileUri = async (uri: string) => {
  if (uri.startsWith('http')) return { uri, tempPath: null, rawUri: null };
  if (uri.startsWith('data:')) {
    try {
        const parts = uri.split(',');
        if (parts.length < 2) throw new Error('Invalid data URI');
        const base64 = parts[1];
        const mime = parts[0].split(';')[0].replace('data:', '');
        const ext = mime.includes('wav') ? 'wav' : mime.includes('aac') ? 'aac' : 'mp3';
        const filename = `miga-${Date.now()}.${ext}`;
        const fileUri = `${(FileSystem as any).cacheDirectory || ''}${filename}`;
        
        // Use string literal 'base64' to be defensive against different Expo versions
        await FileSystem.writeAsStringAsync(fileUri, base64, { 
          encoding: ((FileSystem as any).EncodingType?.Base64 || 'base64') as any 
        });
        
        return { uri: fileUri, tempPath: fileUri, rawUri: uri };
    } catch (err) {
        console.warn('[useMascotAudio] toFileUri failed:', err);
        return { uri, tempPath: null, rawUri: null };
    }
  }
  return { uri, tempPath: null, rawUri: null };
};

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('tts-timeout')), timeoutMs);
  });
  const result = await Promise.race([promise, timeoutPromise]);
  clearTimeout(timeoutId);
  return result;
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const waitForPlaybackStart = async (sound: Audio.Sound, timeoutMs = 2500) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) return true;
      if (status.isLoaded && status.didJustFinish) return false;
    } catch {
      return false;
    }
    await sleep(100);
  }
  return false;
};

const estimateSpeechDurationMs = (text: string) => {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1100, Math.min(12000, 520 + words * 185));
};

const buildTextVisemes = (text: string, durationMs: number): VisemeFrame[] => {
  const words = (text || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const step = Math.max(120, Math.floor(durationMs / words.length));
  const frames: VisemeFrame[] = [];
  words.forEach((word, idx) => {
    const clean = word.replace(/[^a-zA-Z\u0900-\u097F\u0B80-\u0BFF\u0C80-\u0CFF\u0D00-\u0D7F]/g, '');
    const vowels = (clean.match(/[aeiouAEIOU]/g) || []).length;
    const vowelRatio = clean.length ? vowels / clean.length : 0.35;
    const open = Math.max(0.12, Math.min(0.78, 0.18 + vowelRatio * 0.85));
    const form = Math.max(0.08, Math.min(0.5, 0.12 + (clean.length % 4) * 0.06));
    const ts = idx * step;
    frames.push({ time_ms: ts, open, form });
    frames.push({ time_ms: ts + Math.floor(step * 0.55), open: Math.max(0.05, open * 0.18), form: 0.12 });
  });
  frames.push({ time_ms: durationMs + 60, open: 0, form: 0.1 });
  return frames;
};

export const useMascotAudio = ({
  voiceEnabled = true,
  onAudioStart,
   onAudioStop,
   onVisemeFrame,
   onAudioMeta,
}: MascotAudioOptions = {}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const queueRef = useRef<SpeechJob[]>([]);
  const processingRef = useRef(false);
  const playbackLipSyncTimerRef = useRef<any>(null);
  const activeSoundRef = useRef<Audio.Sound | null>(null);
  const visemeTimersRef = useRef<any[]>([]);
  const visemeActiveRef = useRef(false);

  // Stable handlers ref to prevent identity-change loops
  const handlersRef = useRef({
    onAudioStart,
    onAudioStop,
    onVisemeFrame,
    onAudioMeta,
  });
  useEffect(() => {
    handlersRef.current = {
      onAudioStart,
      onAudioStop,
      onVisemeFrame,
      onAudioMeta,
    };
  }, [onAudioStart, onAudioStop, onVisemeFrame, onAudioMeta]);

  const setMouth = useCallback(
    (value: number, form?: number) => handlersRef.current.onVisemeFrame?.(Math.max(0, Math.min(1, value)), form),
    [],
  );

  const stopVisemeTimeline = useCallback(() => {
    visemeTimersRef.current.forEach((t) => clearTimeout(t));
    visemeTimersRef.current = [];
    visemeActiveRef.current = false;
    setMouth(0, 0);
  }, [setMouth]);

  const startVisemeTimeline = useCallback(
    (visemes?: VisemeFrame[]) => {
      stopVisemeTimeline();
      if (!visemes || visemes.length === 0) return;
      visemeActiveRef.current = true;
      const startTs = Date.now();
      visemes.forEach((v) => {
        const delay = Math.max(0, (v.time_ms || 0));
        const t = setTimeout(() => {
          setMouth(v.open ?? 0, v.form ?? 0);
        }, delay);
        visemeTimersRef.current.push(t);
      });
      const last = visemes[visemes.length - 1];
      const endDelay = Math.max(0, (last?.time_ms || 0) + 120);
      visemeTimersRef.current.push(setTimeout(() => setMouth(0, 0), endDelay));
    },
    [setMouth, stopVisemeTimeline],
  );

  useEffect(() => {
    // @ts-ignore - Deprecated constant locations in newer Expo AV
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      // @ts-ignore
      interruptionModeIOS: 1, // DoNotMix
      shouldDuckAndroid: true,
      // @ts-ignore
      interruptionModeAndroid: 1, // DoNotMix
      playThroughEarpieceAndroid: false,
    });

    return () => {
      queueRef.current = [];
      processingRef.current = false;
      if (activeSoundRef.current) {
        activeSoundRef.current.stopAsync().catch(() => {});
        activeSoundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const stopFallbackViseme = useCallback(() => {
    setMouth(0);
  }, [setMouth]);

  const startPlaybackLipSync = useCallback(() => {
    if (!handlersRef.current.onVisemeFrame) return;
    if (playbackLipSyncTimerRef.current) {
      clearInterval(playbackLipSyncTimerRef.current);
      playbackLipSyncTimerRef.current = null;
    }
    let startAt = Date.now();
    playbackLipSyncTimerRef.current = setInterval(() => {
      const t = Date.now() - startAt;
      const phase = t / 110;
      const value = 0.06 + Math.abs(Math.sin(phase)) * 0.16 + Math.abs(Math.sin(phase * 0.5)) * 0.03;
      handlersRef.current.onVisemeFrame?.(Math.max(0, Math.min(1, value)), 0.15);
    }, 70);
  }, []);

  const stopPlaybackLipSync = useCallback(() => {
    if (playbackLipSyncTimerRef.current) {
      clearInterval(playbackLipSyncTimerRef.current);
      playbackLipSyncTimerRef.current = null;
    }
    handlersRef.current.onVisemeFrame?.(0, 0);
  }, []);

  const triggerStart = useCallback(
    (text: string, custom?: () => void) => {
      setIsPlaying(true);
      handlersRef.current.onAudioStart?.(text);
      custom?.();
    },
    [],
  );

  const triggerStop = useCallback(() => {
    setIsPlaying(false);
    handlersRef.current.onAudioStop?.();
    stopPlaybackLipSync();
    stopFallbackViseme();
    stopVisemeTimeline();
  }, [stopFallbackViseme, stopPlaybackLipSync, stopVisemeTimeline]);

  const waitForPlaybackEnd = useCallback(async (sound: Audio.Sound, durationMillis?: number) => {
    let finished = false;
    let timeoutId: any = null;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      try {
        sound.setOnPlaybackStatusUpdate(null as any);
      } catch {}
    };

    const endPromise = new Promise<void>((resolve) => {
      if (typeof durationMillis === 'number' && Number.isFinite(durationMillis) && durationMillis > 0) {
        timeoutId = setTimeout(() => {
          if (!finished) resolve();
        }, Math.min(durationMillis + 1500, 30000));
      } else {
        timeoutId = setTimeout(() => {
          if (!finished) resolve();
        }, 30000);
      }

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) resolve();
      });
    });

    await endPromise;
    finished = true;
    cleanup();
  }, []);

  const playSupabaseAudio = useCallback(
    async (text: string, onStart?: () => void) => {
      // 1. Fetch TTS
      console.log('🔊 [useMascotAudio] Requesting Supabase TTS for:', text.slice(0, 30));
      const uriOrFallback = await Promise.race([
        withTimeout(mascotApi.getTTS(text), SUPABASE_TIMEOUT_MS),
        sleep(900).then(() => '__LOCAL_FALLBACK__'),
      ]);

      if (uriOrFallback === '__LOCAL_FALLBACK__') {
        const estimated = estimateSpeechDurationMs(text);
        const visemes = buildTextVisemes(text, estimated);
        await new Promise<void>((resolve) => {
          migaVoice.speak(text, {
            provider: VoiceProvider.LOCAL,
            onStart: () => {
              triggerStart(text, onStart);
              if (visemes.length) startVisemeTimeline(visemes);
              else startPlaybackLipSync();
            },
            onEnd: () => resolve(),
          });
        });
        stopFallbackViseme();
        stopVisemeTimeline();
        triggerStop();
        return;
      }

      const uri = uriOrFallback;
      
      // 2. Convert DataURI to File (more stable for playback)
      const { uri: resolvedUri, tempPath } = await toFileUri(uri);
      
      // 3. Load & Play
      const { sound } = await Audio.Sound.createAsync(
        { uri: resolvedUri },
        { shouldPlay: false },
      );
      activeSoundRef.current = sound;
      await sound.setProgressUpdateIntervalAsync(50);
      const status = await sound.getStatusAsync();
      const durationMillis = status.isLoaded && typeof status.durationMillis === 'number'
        ? status.durationMillis
        : undefined;
      const visemes = buildTextVisemes(text, durationMillis || estimateSpeechDurationMs(text));
      await sound.playAsync();
      await waitForPlaybackStart(sound, 1200);
      triggerStart(text, onStart);
      if (visemes.length) startVisemeTimeline(visemes);
      else startPlaybackLipSync();
      // 5. Wait for finish with a hard timeout fallback
      await waitForPlaybackEnd(sound, durationMillis);

      // 6. Cleanup
      await sound.stopAsync();
      await sound.unloadAsync();
      activeSoundRef.current = null;

      if (tempPath) {
        try {
          await FileSystem.deleteAsync(tempPath, { idempotent: true });
        } catch {
          // ignore cleanup error
        }
      }
    },
    [startPlaybackLipSync, startVisemeTimeline, triggerStart, waitForPlaybackEnd, stopFallbackViseme, stopVisemeTimeline],
  );

  const processQueue = useCallback(async () => {
    if (!voiceEnabled || processingRef.current || queueRef.current.length === 0) return;
    processingRef.current = true;

    while (queueRef.current.length > 0) {
      const job = queueRef.current.shift();
      if (!job || !job.text.trim()) continue;
      const { text, onStart } = job;
      let usedFallback = false;

      try {
        await playSupabaseAudio(text, onStart);
      } catch (err) {
        console.warn('[useMascotAudio] Premium TTS failed; using local fallback:', err);
        usedFallback = true;
        const fallbackVisemes = buildTextVisemes(text, estimateSpeechDurationMs(text));
        await new Promise<void>((resolve) => {
          migaVoice.speak(text, {
            provider: VoiceProvider.LOCAL,
            onStart: () => {
              triggerStart(text, onStart);
              if (fallbackVisemes.length) startVisemeTimeline(fallbackVisemes);
              else startPlaybackLipSync();
            },
            onEnd: () => resolve(),
          });
        });
      }

      if (usedFallback) {
        stopPlaybackLipSync();
        stopFallbackViseme();
      }

      triggerStop();
    }

    processingRef.current = false;
  }, [voiceEnabled, playSupabaseAudio, triggerStop, startPlaybackLipSync, stopFallbackViseme, stopPlaybackLipSync]);

  const playUri = useCallback(async (uri: string, onStart?: () => void, textOverride?: string, visemes?: VisemeFrame[]) => {
    const hasVisemes = !!(visemes && visemes.length);
    // 1. Setup Audio
    const { uri: resolvedUri, tempPath, rawUri } = await toFileUri(uri);
    
    // 2. Load
    const { sound } = await Audio.Sound.createAsync(
      { uri: resolvedUri },
      { shouldPlay: false },
    );
     activeSoundRef.current = sound;
     await sound.setProgressUpdateIntervalAsync(50);
     const status = await sound.getStatusAsync();
     if (status.isLoaded && typeof status.durationMillis === 'number') {
       handlersRef.current.onAudioMeta?.(status.durationMillis);
     }
     const generatedVisemes = buildTextVisemes(textOverride ?? uri, (status.isLoaded && typeof status.durationMillis === 'number' ? status.durationMillis : estimateSpeechDurationMs(textOverride ?? uri)));
     // 3. Play
     await sound.playAsync();
     await waitForPlaybackStart(sound, 1200);
     triggerStart(textOverride ?? "Audio Playback", onStart);
     if (hasVisemes) startVisemeTimeline(visemes);
     else if (generatedVisemes.length) startVisemeTimeline(generatedVisemes);
     else startPlaybackLipSync();

     // 4. Wait with a hard timeout fallback
     await waitForPlaybackEnd(sound, status.isLoaded && typeof status.durationMillis === 'number' ? status.durationMillis : undefined);

    // 5. Cleanup
    try {
      if (activeSoundRef.current) {
        await activeSoundRef.current.stopAsync();
        await activeSoundRef.current.unloadAsync();
      }
    } catch (e) {}
    activeSoundRef.current = null;
    triggerStop();
    if (!hasVisemes) stopFallbackViseme();

    if (tempPath) {
      try {
        await FileSystem.deleteAsync(tempPath, { idempotent: true });
      } catch {}
    }
  }, [startPlaybackLipSync, startVisemeTimeline, triggerStart, triggerStop, stopFallbackViseme, stopPlaybackLipSync, waitForPlaybackEnd]);

  const stopAudio = useCallback(async () => {
    queueRef.current = [];
    if (activeSoundRef.current) {
      try {
        await activeSoundRef.current.stopAsync();
        await activeSoundRef.current.unloadAsync();
      } catch (err) {
        // ignore
      }
      activeSoundRef.current = null;
    }
    stopPlaybackLipSync();
    stopFallbackViseme();
    triggerStop();
    processingRef.current = false;
  }, [stopPlaybackLipSync, triggerStop, stopFallbackViseme]);

  const speak = useCallback((text: string, onStart?: () => void) => {
    if (!text.trim()) return;
    // If we accidentally receive audio data instead of text, play it directly
    if (text.startsWith('data:')) {
      playUri(text, onStart, 'Audio Playback').catch(() => {});
      return;
    }
    // Keep TTS requests under provider limits
    const safeText = text.length > 3800 ? `${text.slice(0, 3800)}...` : text;
    queueRef.current.push({ text: safeText, onStart });
    processQueue();
  }, [processQueue, playUri]);

  return { isPlaying, speak, stopAudio, playUri };
};

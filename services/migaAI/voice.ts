import Voice from '@react-native-voice/voice';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import { supabase, supabaseUrl, supabaseAnonKey } from '@/utils/supabase';
import HapticService from '../../utils/hapticService';

/**
 * MIGA VOICE ARCHITECTURE - SCALE 100K+ USERS
 * 
 * Strategy:
 * 1. LOCAL FIRST: Use device native TTS for 90% of basic conversational tasks (₹0 cost).
 * 2. NVIDIA RIVA / NIM: Primary engine for high-throughput, low-latency premium voice (Ultra-fast).
 * 3. ALIBABA COSYVOICE: Secondary engine for emotional/cross-lingual nuances (Highest quality).
 */

export enum VoiceProvider {
  LOCAL = 'local',
  PIPER = 'piper',     // High-speed neural (Standard)
  VIBE = 'vibevoice',  // Ultra-emotional (Premium)
  ALIBABA = 'alibaba',
  NVIDIA = 'nvidia',
  ELEVENLABS = 'elevenlabs',
}

export class MigaVoice {
  private isListening = false;
  private currentSound: Audio.Sound | null = null;
  private provider: VoiceProvider = VoiceProvider.LOCAL;
  private isSpeaking = false;

  constructor() {
    this.initializeVoice();
  }

  private async initializeVoice() {
    try {
      if (!Voice) return;
      
      Voice.onSpeechStart = () => {
        this.isListening = true;
        HapticService.selection();
      };
      
      Voice.onSpeechEnd = () => {
        this.isListening = false;
      };

      Voice.onSpeechError = (e) => {
        console.error('[MigaVoice] Speech recognition error:', e);
        this.isListening = false;
      };
    } catch (e) {
      console.warn('[MigaVoice] Voice recognition not available:', e);
    }
  }

  /**
   * Primary speaking function with cost-optimized routing
   */
  async speak(text: string, options: {
    usePremium?: boolean;
    provider?: VoiceProvider;
    onStart?: () => void;
    onEnd?: () => void;
  } = {}) {
    try {
      await this.stop();

      const activeProvider = options.provider || (options.usePremium ? VoiceProvider.VIBE : VoiceProvider.PIPER);
      
      options.onStart?.();

      if (activeProvider === VoiceProvider.LOCAL) {
        await this.speakLocal(text, options.onEnd);
      } else {
        await this.speakCloud(text, activeProvider, options.onEnd);
      }
    } catch (error) {
      console.error('[MigaVoice] Speak failed:', error);
      // Fallback to local if anything fails
      await this.speakLocal(text, options.onEnd);
    }
  }

  /**
   * ZERO-COST LOCAL TTS (Expo Speech)
   * High performance, no latency, no server cost.
   */
  private async speakLocal(text: string, onEnd?: () => void) {
    Speech.speak(text, {
      language: 'en-IN',
      pitch: 1.15, // Higher pitch for a "mascot/animated" feel
      rate: 1.1,   // Slightly faster for a "witty/sharp" conversational pace
      onDone: () => onEnd?.(),
      onError: () => onEnd?.(),
    });
  }

  /**
   * HIGH-THROUGHPUT CLOUD TTS (NVIDIA Riva / Alibaba CosyVoice)
   * Optimized for 100k+ users with sub-200ms latency
   */
  private async speakCloud(text: string, provider: VoiceProvider, onEnd?: () => void) {
    try {
      this.isSpeaking = true;
      // 1. Fetch neural audio via POST
      console.log(`[MigaVoice] 🎭 Neural Waveform: Requesting ${provider.toUpperCase()}`);


      const baseUrl = supabaseUrl + "/functions/v1/miga_tts";
      const { data: { session } } = await supabase.auth.getSession();
      const anonKey = supabaseAnonKey;

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || anonKey}`,
          'apikey': anonKey,
        },
        body: JSON.stringify({
          text,
          provider
        })
      });

      if (!response.ok) {
        const errType = await response.text().catch(() => "Unknown");
        throw new Error(`Cloud TTS Server Error ${response.status}: ${errType}`);
      }

      const blob = await response.blob();
      
      // In React Native, we might need a better way to handle blobs for expo-av if URL.createObjectURL fails
      // However, for many platforms it works or we can use base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      
      const dataUrl = await base64Promise;

      // 2. Load and Play
      const { sound } = await Audio.Sound.createAsync(
        { uri: dataUrl },
        { shouldPlay: true, volume: 1.0 }
      );

      this.currentSound = sound;
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          this.isSpeaking = false;
          onEnd?.();
        }
      });

      await sound.playAsync();
    } catch (err) {
      console.error('[MigaVoice] Cloud TTS Failed:', err);
      console.log('🔄 MigaVoice: Falling back to LOCAL engine due to cloud error.');
      // Failover to local
      await this.speakLocal(text, onEnd);
    }
  }

  /**
   * Backend Orchestrator - Interacting with self-hosted Alibaba/NVIDIA instances
   */
  private async getAudioUrlFromBackend(text: string, provider: VoiceProvider): Promise<string> {
    // Orchestrator for our self-hosted neural GPU cluster
    // URL would be your Supabase Edge Function or dedicated GPU endpoint
    const baseUrl = supabaseUrl + "/functions/v1/miga_tts";
    
    // In production, we'd pass the provider to the backend to switch models
    console.log(`[MigaVoice] 🎭 Neural Waveform: Using ${provider.toUpperCase()} for "${text.slice(0, 20)}..."`);
    
    // For now, we return a mock high-quality asset if not in production
    // or call the real endpoint if configured.
    return `${baseUrl}?text=${encodeURIComponent(text)}&provider=${provider}`;
  }

  /**
   * STOP ALL SPEECH (Local and Cloud)
   */
  async stop() {
    try {
      // 1. Stop Expo Speech
      await Speech.stop();
      
      // 2. Stop Cloud Audio
      if (this.currentSound) {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
        this.currentSound = null;
      }
      
      this.isSpeaking = false;
    } catch (e) {
      console.error('[MigaVoice] Stop failed:', e);
    }
  }

  /**
   * START LISTENING (Wake word or Push-to-Talk)
   */
  async startListening(onResult: (text: string) => void) {
    try {
      await Voice.start('en-IN');
      Voice.onSpeechResults = (e) => {
        if (e.value && e.value[0]) {
          onResult(e.value[0]);
        }
      };
    } catch (e) {
      console.error('[MigaVoice] Failed to start listening:', e);
    }
  }

  async stopListening() {
    try {
      await Voice.stop();
      this.isListening = false;
    } catch (e) {
      console.error('[MigaVoice] Failed to stop listening:', e);
    }
  }

  /**
   * Miga's "Wake Word" Logic
   */
  async listenForWakeWord(onDetected: () => void) {
    // Continuous light-weight monitoring
    // In prod, use a small TFLite model on-device for battery efficiency
    Voice.onSpeechResults = (e) => {
      const result = e.value?.[0]?.toLowerCase() || '';
      if (result.includes('miga') || result.includes('megga')) {
        HapticService.heavy();
        onDetected();
      }
    };
    await Voice.start('en-IN');
  }
}

export const migaVoice = new MigaVoice();
export default migaVoice;
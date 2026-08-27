import * as FileSystem from 'expo-file-system/legacy';
import Constants from 'expo-constants';

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || 
                     Constants.expoConfig?.extra?.SARVAM_API_KEY || 
                     'sk_ga05rey8_MznZoTCdInnyc7oIbIeRjJS3'; // Fallback from .env

const SARVAM_BASE_URL = 'https://api.sarvam.ai';

export const sarvamService = {
  /**
   * Generates high-quality TTS audio for Indian languages.
   * Returns local file path to the audio file.
   */
  async textToSpeech(
    text: string,
    languageCode: string = 'hi-IN',
    options?: { speaker?: string; model?: string }
  ): Promise<string | null> {
    if (!SARVAM_API_KEY) {
      console.warn('[SarvamService] Missing API Key');
      return null;
    }

    try {
      console.log(`[SarvamService] Generating TTS for: "${text.substring(0, 30)}..." in ${languageCode}`);

      const speakerMap: Record<string, string> = {
        'ta-IN': 'anushka',
        'hi-IN': 'simran',
        'te-IN': 'simran',
        'kn-IN': 'simran',
        'ml-IN': 'simran',
      };
      const speaker = options?.speaker || speakerMap[languageCode] || 'vidya';
      const model = options?.model || 'bulbul:v3';
      
      const response = await fetch(`${SARVAM_BASE_URL}/text-to-speech`, {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: languageCode,
          speaker,
          model,
          speech_sample_rate: 22050,
          enable_preprocessing: true,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Sarvam TTS failed: ${response.status} - ${err}`);
      }

      const data = await response.json();
      if (!data.audios || data.audios.length === 0) {
        throw new Error('No audio returned from Sarvam');
      }

      const base64Audio = data.audios[0];
      
      // Save to temporary file for playback
      const fileName = `miga_voice_${Date.now()}.wav`;
      const fs = FileSystem as any;
      const filePath = `${fs.cacheDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(filePath, base64Audio, {
        encoding: 'base64',
      });

      console.log('[SarvamService] Audio saved to:', filePath);
      return filePath;
    } catch (error) {
      console.error('[SarvamService] TTS Error:', error);
      return null;
    }
  },

  /**
   * Translates text between Indian languages.
   */
  async translateText(text: string, sourceLang: string = 'ta-IN', targetLang: string = 'en-IN'): Promise<string | null> {
    if (!SARVAM_API_KEY) return null;
    try {
      const response = await fetch(`${SARVAM_BASE_URL}/translate`, {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          source_language_code: sourceLang,
          target_language_code: targetLang,
          model: 'mayura:v1',
        }),
      });

      if (!response.ok) throw new Error(`Translate failed: ${response.status}`);
      const data = await response.json();
      return data.translated_text || null;
    } catch (error) {
      console.error('[SarvamService] Translation Error:', error);
      return null;
    }
  },

  /**
   * Maps friendly names to Sarvam language codes.
   */
  getLanguageCode(language: string): string {
    const map: Record<string, string> = {
      'English': 'en-IN',
      'Hindi': 'hi-IN',
      'Tamil': 'ta-IN',
      'Telugu': 'te-IN',
      'Kannada': 'kn-IN',
      'Malayalam': 'ml-IN',
      'Marathi': 'mr-IN',
      'Bengali': 'bn-IN',
      'Gujarati': 'gu-IN',
      'Punjabi': 'pa-IN',
    };
    return map[language] || 'en-IN';
  }
};

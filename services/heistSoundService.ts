// Knowledge Heist Sound Service - Optimized for FAST Playback
import { Audio } from 'expo-av';

class KnowledgeHeistSoundService {
  private sounds: Map<string, Audio.Sound> = new Map();
  private backgroundSound: Audio.Sound | null = null;
  private isMuted: boolean = false;

  // Map all your sound files properly with relative paths for reliability
  private soundFiles = {
    buttonClick: require('../assets/sounds/button-click.mp3'),
    transition: require('../assets/sounds/transition.mp3'),
    select: require('../assets/sounds/select.mp3'),
    matchFound: require('../assets/sounds/match-found.mp3'),
    gameStart: require('../assets/sounds/game-start.mp3'),
    scanning: require('../assets/sounds/scanning.mp3'),
    question: require('../assets/sounds/question.mp3'),
    correct: require('../assets/sounds/quizcorrect.mp3'),
    wrong: require('../assets/sounds/quizwrong.mp3'),
    victory: require('../assets/sounds/victory.mp3'),
    victoryDhol: require('../assets/sounds/dhol-victory.mp3'),
    defeat: require('../assets/sounds/defeat.mp3'),
    reward: require('../assets/sounds/reward.mp3'),
    sitar: require('../assets/sounds/sitar-pluck.mp3'),
    powerup: require('../assets/sounds/powerup.mp3'),
    warning: require('../assets/sounds/warning.mp3'),
    background: require('../assets/sounds/background.mp3'),
  };

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      console.log('🔊 Knowledge Heist Sound Service initialized');
    } catch (error) {
      console.error('Sound init error:', error);
    }
  }

  async play(soundKey: keyof typeof this.soundFiles, options?: { volume?: number, shouldLoop?: boolean }) {
    if (this.isMuted) return;

    const volume = options?.volume ?? 1.0;

    try {
      // For background music, we handle it separately to allow looping and stopping
      if (soundKey === 'background') {
        const currentBg = this.backgroundSound;
        if (currentBg) {
          this.backgroundSound = null;
          try {
            await currentBg.stopAsync();
            await currentBg.unloadAsync();
          } catch (e) {
            console.warn('Error unloading background sound:', e);
          }
        }
        const { sound } = await Audio.Sound.createAsync(this.soundFiles[soundKey], {
          shouldPlay: true,
          volume,
          isLooping: true,
        });
        this.backgroundSound = sound;
        return;
      }

      // Check if we have a pre-loaded instance to restart (faster)
      const preloadedSound = this.sounds.get(soundKey);
      if (preloadedSound) {
        await preloadedSound.replayAsync();
        return;
      }

      // Otherwise create and play
      const { sound } = await Audio.Sound.createAsync(this.soundFiles[soundKey], {
        shouldPlay: true,
        volume,
      });

      // Simple cleanup for one-shot sounds that aren't preloaded
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.warn(`Error playing ${soundKey}:`, error);
    }
  }

  // Convenience methods
  playButtonClick() { this.play('buttonClick', { volume: 0.5 }); }
  playTransition() { this.play('transition', { volume: 0.6 }); }
  playSelect() { this.play('select', { volume: 0.5 }); }
  playMatchFound() { this.play('matchFound', { volume: 0.8 }); }
  playGameStart() { this.play('gameStart', { volume: 0.9 }); }
  playScanning() { this.play('scanning', { volume: 0.4 }); }
  playQuestion() { this.play('question', { volume: 0.6 }); }
  playCorrect() { this.play('correct', { volume: 0.7 }); }
  playWrong() { this.play('wrong', { volume: 0.6 }); }
  playVictory() { 
    this.play('victory', { volume: 0.9 });
    // Play dhol as well for impact
    setTimeout(() => this.play('victoryDhol', { volume: 0.8 }), 500);
  }

  playSitar() {
    this.play('sitar', { volume: 0.6 });
  }

  playDefeat() {
 this.play('defeat', { volume: 0.6 }); }
  playReward() { this.play('reward', { volume: 0.7 }); }
  playPowerup() { this.play('powerup', { volume: 0.6 }); }
  playCountdown() { this.play('buttonClick', { volume: 0.8 }); }
  private warningSound: Audio.Sound | null = null;

  async playWarning() {
    // If already playing, don't restart
    if (this.warningSound) return;

    try {
      const { sound } = await Audio.Sound.createAsync(this.soundFiles.warning, {
        shouldPlay: true,
        volume: 0.5,
      });
      this.warningSound = sound;
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          this.warningSound = null;
        }
      });
    } catch (e) {
      console.warn('Error playing warning:', e);
    }
  }

  async stopWarning() {
    if (this.warningSound) {
      try {
        await this.warningSound.stopAsync();
        await this.warningSound.unloadAsync();
      } catch (e) {}
      this.warningSound = null;
    }
  }

  async stopBackground() {
    const currentBg = this.backgroundSound;
    if (currentBg) {
      this.backgroundSound = null;
      try {
        await currentBg.stopAsync();
        await currentBg.unloadAsync();
      } catch (e) {}
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.backgroundSound) {
      this.backgroundSound.setVolumeAsync(0);
    } else if (!muted && this.backgroundSound) {
      this.backgroundSound.setVolumeAsync(0.3);
    }
  }

  async preloadGameSounds() {
    const essential: (keyof typeof this.soundFiles)[] = [
      'buttonClick', 'gameStart', 'correct', 'wrong', 'victory', 'reward', 'question'
    ];

    for (const key of essential) {
      try {
        const { sound } = await Audio.Sound.createAsync(this.soundFiles[key]);
        this.sounds.set(key, sound);
      } catch (error) {
        console.warn(`Failed to preload ${key}`);
      }
    }
    console.log('🎵 Essential game sounds preloaded');
  }

  async cleanup() {
    await this.stopBackground();
    for (const sound of this.sounds.values()) {
      try { await sound.unloadAsync(); } catch (e) {}
    }
    this.sounds.clear();
  }
}

export const HeistSoundService = new KnowledgeHeistSoundService();

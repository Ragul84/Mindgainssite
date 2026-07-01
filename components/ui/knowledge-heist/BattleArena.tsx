import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { HeistSoundService } from '@/services/heistSoundService';
import HapticService from '@/utils/hapticService';
import { MindClashGameService } from '@/services/knowledgeHeistService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Participant {
  name: string;
  score: number;
  avatar: string;
  isCurrentUser?: boolean;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface BattleArenaProps {
  onComplete: (score: number) => void;
  onExit: () => void;
  onOpenStore?: () => void;
  onOpenLeaderboard?: () => void;
  effectiveCoins: number;
  onCoinsUpdated: (newCoins: number) => void;
  vaultName: string;
  questions: Question[];
  userId?: string;
  sessionId?: string | null;
  mode: 'pvp' | 'pvq';
  userAvatarUrl?: string;
}

export default function BattleArena({
  onComplete,
  onExit,
  onOpenStore,
  onOpenLeaderboard,
  effectiveCoins,
  onCoinsUpdated,
  vaultName: initialVaultName,
  questions: initialQuestions,
  userId,
  sessionId: initialSessionId,
  mode,
  userAvatarUrl = '',
}: BattleArenaProps) {
  const insets = useSafeAreaInsets();

  // Dynamic 2D Game states
  const [internalQuestions, setInternalQuestions] = useState<Question[]>([]);
  const [internalSessionId, setInternalSessionId] = useState<string | null>(null);
  const [internalVaultName, setInternalVaultName] = useState<string>('Knowledge Vault');
  const [isDungeonLoading, setIsDungeonLoading] = useState(false);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [shieldHealth, setShieldHealth] = useState(100);
  const [bossHealth, setBossHealth] = useState(100);
  const [streak, setStreak] = useState(0);
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdownValue, setCountdownValue] = useState(3);
  const [announcerText, setAnnouncerText] = useState('');

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const webviewRef = useRef<WebView>(null);

  const showGameplay = internalQuestions.length > 0;

  const currentQuestion = internalQuestions[currentIdx] || {
    question: 'Loading Question...',
    options: ['...', '...', '...', '...'],
    correctAnswer: 0,
  };

  // Determine avatar style key
  const getAvatarStyleKey = () => {
    const url = userAvatarUrl.toLowerCase();
    if (url.includes('adventurer')) return 'adventurer';
    if (url.includes('bottts') || url.includes('robot')) return 'robots';
    if (url.includes('lorelei') || url.includes('chibi') || url.includes('pixel')) return 'chibi';
    if (url.includes('avataaars') || url.includes('persona')) return 'persona';
    return 'pixel';
  };

  // Determine boss name based on Vault Name
  const getBossInfo = () => {
    const name = internalVaultName.toLowerCase();
    if (name.includes('polity') || name.includes('general')) {
      return { name: 'Veto Golem 🗿', style: 'golem' };
    }
    if (name.includes('history') || name.includes('affairs')) {
      return { name: 'Mughal Overlord 👑', style: 'overlord' };
    }
    if (name.includes('economy')) {
      return { name: 'Inflation Beast 📈', style: 'dragon' };
    }
    return { name: 'Quantum Hydra 🧬', style: 'hydra' };
  };

  const bossInfo = getBossInfo();
  const avatarKey = getAvatarStyleKey();

  useEffect(() => {
    if (showCountdown && showGameplay) {
      const cd = setInterval(() => {
        setCountdownValue(prev => {
          if (prev <= 1) {
            clearInterval(cd);
            setTimeout(() => {
              setShowCountdown(false);
              // Inform webview game start
              webviewRef.current?.postMessage(JSON.stringify({ action: 'START_GAME' }));
            }, 500);
            return 0;
          }
          HeistSoundService.playCountdown();
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(cd);
    }
  }, [showCountdown, showGameplay]);

  useEffect(() => {
    if (!showCountdown && showGameplay) {
      startTimer();
      HeistSoundService.playQuestion();
    }
    return () => stopTimer();
  }, [currentIdx, showCountdown, showGameplay]);

  // Bot score simulation
  useEffect(() => {
    if (!internalSessionId || showCountdown || !showGameplay) return;
    const botInterval = setInterval(() => {
      setParticipants(prev => {
        return prev.map(p => {
          if (!p.isCurrentUser && Math.random() > 0.7) {
            return { ...p, score: p.score + Math.floor(Math.random() * 50) + 50 };
          }
          return p;
        }).sort((a, b) => b.score - a.score);
      });
    }, 3000);
    return () => clearInterval(botInterval);
  }, [internalSessionId, showCountdown, showGameplay]);

  const startTimer = () => {
    stopTimer();
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        if (prev <= 4) HeistSoundService.playWarning();
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTimeUp = () => {
    if (answered) return;
    setAnswered(true);
    setStreak(0);
    triggerDamage();
    triggerAnnouncer('TIME UP!');
    // Trigger WebView hurt animation
    webviewRef.current?.postMessage(JSON.stringify({ action: 'HURT', damage: 20 }));
    setTimeout(nextQuestion, 1500);
  };

  const triggerAnnouncer = (text: string) => {
    setAnnouncerText(text);
    setTimeout(() => setAnnouncerText(''), 1500);
  };

  const triggerDamage = () => {
    HapticService.error();
    setShieldHealth(prev => Math.max(0, prev - 20));
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleOptionSelect = (idx: number) => {
    if (answered) return;
    stopTimer();
    setSelectedOpt(idx);
    setAnswered(true);

    const isCorrect = idx === currentQuestion.correctAnswer;
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(s => s + 100 + (newStreak * 10));
      const damageAmt = 100 / internalQuestions.length;
      setBossHealth(prev => Math.max(0, prev - damageAmt));
      HeistSoundService.playCorrect();
      HapticService.success();
      
      // Trigger WebView attack
      webviewRef.current?.postMessage(JSON.stringify({ 
        action: 'ATTACK', 
        damage: Math.floor(damageAmt),
        combo: newStreak 
      }));

      if (newStreak >= 3) triggerAnnouncer(`${newStreak}X COMBO!`);
      else if (currentIdx === internalQuestions.length - 1) triggerAnnouncer('FINISH HIM!');
    } else {
      setStreak(0);
      triggerDamage();
      triggerAnnouncer('SHIELD HIT!');
      HeistSoundService.playWrong();

      // Trigger WebView hurt
      webviewRef.current?.postMessage(JSON.stringify({ 
        action: 'HURT', 
        damage: 20 
      }));
    }

    setTimeout(nextQuestion, 2000);
  };

  const nextQuestion = () => {
    if (currentIdx < internalQuestions.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelectedOpt(null);
      setAnswered(false);
      // Trigger WebView next round
      webviewRef.current?.postMessage(JSON.stringify({
        action: 'NEXT_ROUND',
        index: currentIdx + 1,
        total: internalQuestions.length
      }));
    } else {
      const isVictory = bossHealth <= 30 || shieldHealth > 0;
      
      // Calculate reward coins dynamically in local matchmaking fallback
      const finalScore = score;
      const parts = (internalSessionId || '').split('_');
      const vaultId = parts[1] || 'polity';
      const config = MindClashGameService.VAULT_CONFIG[vaultId] || { reward: 500 };
      
      // Simulate bots to determine rank
      const botScores = [
        Math.floor(Math.random() * 200 + 450),
        Math.floor(Math.random() * 200 + 300),
        Math.floor(Math.random() * 200 + 150),
      ];
      let rank = 1;
      for (const bScore of botScores) {
        if (finalScore < bScore) rank++;
      }
      const multipliers: Record<number, number> = { 1: 1.0, 2: 0.6, 3: 0.4, 4: 0.2 };
      const earned = Math.floor(config.reward * (multipliers[rank] || 0.1));

      webviewRef.current?.postMessage(JSON.stringify({
        action: isVictory ? 'VICTORY' : 'DEFEAT',
        finalScore: finalScore,
        finalReward: earned
      }));
    }
  };

  const gameHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; overflow: hidden; user-select: none; }
        body, html { width: 100%; height: 100%; background: #070b19; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        canvas { display: block; width: 100vw; height: 100vh; }
      </style>
    </head>
    <body>
      <canvas id="gameCanvas"></canvas>
      <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        // Dynamic Profile Avatar SVG Loader
        const playerImg = new Image();
        playerImg.crossOrigin = "anonymous";
        let playerImgLoaded = false;
        playerImg.onload = () => { playerImgLoaded = true; };
        playerImg.onerror = () => { playerImgLoaded = false; };
        playerImg.src = "${userAvatarUrl || ''}";

        // Web Audio Synth for retro-modern game sound FX
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        function synthAttack() {
          try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(550, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.12);
          } catch(e) {}
        }

        function synthHit() {
          try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(40, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
          } catch(e) {}
        }

        function synthHurt() {
          try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(15, audioCtx.currentTime + 0.22);
            gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.22);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.22);
          } catch(e) {}
        }

        function synthCombo(count) {
          try {
            const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
            const baseIdx = Math.min(count, 5);
            const scale = [notes[baseIdx], notes[baseIdx + 2], notes[baseIdx + 4]];
            scale.forEach((freq, idx) => {
              setTimeout(() => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.15);
              }, idx * 80);
            });
          } catch(e) {}
        }

        function synthVictory() {
          try {
            const chords = [
              [261.63, 329.63, 392.00], // C
              [349.23, 440.00, 261.63], // F
              [392.00, 493.88, 293.66], // G
              [523.25, 659.25, 783.99]  // C high
            ];
            chords.forEach((chord, step) => {
              setTimeout(() => {
                chord.forEach(freq => {
                  const osc = audioCtx.createOscillator();
                  const gain = audioCtx.createGain();
                  osc.connect(gain);
                  gain.connect(audioCtx.destination);
                  osc.type = 'sine';
                  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                  gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
                  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                  osc.start();
                  osc.stop(audioCtx.currentTime + 0.3);
                });
              }, step * 180);
            });
          } catch(e) {}
        }

        function synthDefeat() {
          try {
            const notes = [392.00, 369.99, 349.23, 311.13];
            notes.forEach((freq, step) => {
              setTimeout(() => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.35);
              }, step * 250);
            });
          } catch(e) {}
        }

        // Game Setup & Viewport Dimensions
        let canvasW = canvas.width = window.innerWidth;
        let canvasH = canvas.height = window.innerHeight;

        const playerStyle = "${avatarKey}";
        let bossStyle = "${bossInfo.style}";

        // Dynamic State Machine: 'menu', 'matching', 'battle', 'victory', 'defeat'
        let gameState = 'menu'; 
        let playerCoins = ${effectiveCoins};
        let selectedDungeon = null;
        let matchingTimer = 0;
        let finalScore = 0;
        let finalReward = 0;

        // Combat Parameters
        let playerShield = 100;
        let bossHP = 100;
        let roundIdx = 1;
        let totalRounds = 5;

        // Dungeons Database
        const dungeons = [
          { id: 'polity', name: 'Polity', color: '#3B82F6', fee: 100, reward: 500, x: 0, y: 0, w: 0, h: 0, icon: '🏛️' },
          { id: 'science', name: 'Science', color: '#10B981', fee: 100, reward: 350, x: 0, y: 0, w: 0, h: 0, icon: '🧪' },
          { id: 'history', name: 'History', color: '#D946EF', fee: 100, reward: 450, x: 0, y: 0, w: 0, h: 0, icon: '📜' },
          { id: 'geography', name: 'Geography', color: '#14B8A6', fee: 150, reward: 300, x: 0, y: 0, w: 0, h: 0, icon: '🌍' },
          { id: 'economy', name: 'Economy', color: '#F59E0B', fee: 250, reward: 1200, x: 0, y: 0, w: 0, h: 0, icon: '📊' },
          { id: 'current-affairs', name: 'Current Affairs', color: '#F97316', fee: 400, reward: 2500, x: 0, y: 0, w: 0, h: 0, icon: '📰' },
          { id: 'general', name: 'Elite Vault', color: '#8B5CF6', fee: 500, reward: 5000, x: 0, y: 0, w: 0, h: 0, icon: '👑', isSpecial: true }
        ];

        function updateDungeonPositions() {
          const startY = 75;
          const cardW = (canvasW - 40) / 2;
          const cardH = 82;
          dungeons.forEach((d, idx) => {
            if (d.isSpecial) {
              d.x = 15;
              d.y = startY + Math.floor(idx / 2) * (cardH + 12);
              d.w = canvasW - 30;
              d.h = 75;
            } else {
              const col = idx % 2;
              const row = Math.floor(idx / 2);
              d.x = 15 + col * (cardW + 10);
              d.y = startY + row * (cardH + 12);
              d.w = cardW;
              d.h = cardH;
            }
          });
        }
        updateDungeonPositions();

        // Responsive Combat Coordinates & Spring Inertia Parameters
        let playerBaseX = 75;
        let playerBaseY = canvasH - 85;
        let bossBaseX = canvasW - 75;
        let bossBaseY = canvasH - 95;

        let playerX = playerBaseX;
        let playerY = playerBaseY;
        let bossX = bossBaseX;
        let bossY = bossBaseY;

        let playerTargetX = playerBaseX;
        let playerTargetY = playerBaseY;
        let bossTargetX = bossBaseX;
        let bossTargetY = bossBaseY;

        let playerVX = 0;
        let playerVY = 0;
        let bossVX = 0;
        let bossVY = 0;

        // Squash-and-Stretch Scale Variables
        let playerScaleX = 1.0;
        let playerScaleY = 1.0;
        let bossScaleX = 1.0;
        let bossScaleY = 1.0;

        let screenShake = 0;
        let playerSlash = null;
        let bossSlash = null;
        let floatTexts = [];
        let particles = [];
        let timeCount = 0;

        // Background Atmosphere Clouds & Starfield
        let clouds = [
          { x: 30, y: 35, s: 0.1, w: 70 },
          { x: 190, y: 55, s: 0.15, w: 95 },
          { x: 340, y: 28, s: 0.08, w: 50 }
        ];

        function updateScreenSize() {
          canvasW = canvas.width = window.innerWidth;
          canvasH = canvas.height = window.innerHeight;

          // Re-evaluate base locations based on updated viewport size
          playerBaseX = 75;
          playerBaseY = canvasH - 85;
          bossBaseX = canvasW - 75;
          bossBaseY = canvasH - 95;

          if (gameState === 'battle' || gameState === 'idle') {
            playerTargetX = playerBaseX;
            playerTargetY = playerBaseY;
            bossTargetX = bossBaseX;
            bossTargetY = bossBaseY;
          }

          updateDungeonPositions();
        }
        window.addEventListener('resize', updateScreenSize);
        updateScreenSize();

        // RoundRect Canvas Path Utility
        function drawRoundRect(x, y, width, height, radius) {
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          ctx.lineTo(x + radius, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
        }

        // Particle Emitter
        function spawnImpactParticles(x, y, color) {
          for (let i = 0; i < 45; i++) {
            particles.push({
              x: x,
              y: y,
              vx: (Math.random() - 0.5) * 14,
              vy: (Math.random() - 0.5) * 14 - 3, // Initial upward burst direction
              size: Math.random() * 4.5 + 2,
              color: color,
              life: 1.0,
              decay: 0.02 + Math.random() * 0.02,
              gravity: 0.28,
              friction: 0.96
            });
          }
        }

        function spawnFloatingText(x, y, text, color) {
          floatTexts.push({
            x: x,
            y: y,
            vy: 1.4,
            text: text,
            color: color,
            alpha: 1.0
          });
        }

        // HIGH-FIDELITY VECTOR RENDERERS

        function drawPlayerAvatar(ctx, x, y, size, scaleX, scaleY, time) {
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scaleX, scaleY);

          // Neon Backdrop Aura Glow
          let radialG = ctx.createRadialGradient(0, 0, size/3, 0, 0, size/2 + 8);
          radialG.addColorStop(0, "rgba(0, 212, 199, 0.3)");
          radialG.addColorStop(0.7, "rgba(0, 212, 199, 0.08)");
          radialG.addColorStop(1, "rgba(0, 212, 199, 0)");
          ctx.fillStyle = radialG;
          ctx.beginPath();
          ctx.arc(0, 0, size/2 + 10, 0, Math.PI*2);
          ctx.fill();

          // Double Glowing Neon Outer Ring
          ctx.strokeStyle = "#00D4C7";
          ctx.lineWidth = 3.5;
          ctx.shadowColor = "#00D4C7";
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, size/2 - 2, 0, Math.PI*2);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Inner card background
          ctx.fillStyle = "#0f172a";
          ctx.beginPath();
          ctx.arc(0, 0, size/2 - 4, 0, Math.PI*2);
          ctx.fill();

          // Clip and draw image or initial fallback
          if (playerImgLoaded) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, size/2 - 5, 0, Math.PI*2);
            ctx.clip();
            ctx.drawImage(playerImg, -size/2, -size/2, size, size);
            ctx.restore();
          } else {
            // Elegant gradient initials plate fallback
            let initialG = ctx.createLinearGradient(-size/2, -size/2, size/2, size/2);
            initialG.addColorStop(0, "#00D4C7");
            initialG.addColorStop(1, "#8B5CF6");
            ctx.fillStyle = initialG;
            ctx.beginPath();
            ctx.arc(0, 0, size/2 - 5, 0, Math.PI*2);
            ctx.fill();

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold " + Math.floor(size * 0.45) + "px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("A", 0, 0);
          }
          ctx.restore();
        }

        function drawInflationBeast(ctx, x, y, size, scaleX, scaleY, time) {
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scaleX, scaleY);

          // Stock market rise background indicator lines
          ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-size/2, size/2);
          ctx.lineTo(-size/4, -size/6 + Math.sin(time*2)*4);
          ctx.lineTo(0, size/6);
          ctx.lineTo(size/2, -size/2 + Math.cos(time*2)*4);
          ctx.stroke();

          // Flaming wings
          const wingPulse = Math.sin(time * 3) * 8;
          let wGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, size * 0.6);
          wGrad.addColorStop(0, "rgba(239, 68, 68, 0.7)");
          wGrad.addColorStop(0.6, "rgba(245, 158, 11, 0.5)");
          wGrad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = wGrad;
          
          // Left wing
          ctx.beginPath();
          ctx.moveTo(-10, 0);
          ctx.bezierCurveTo(-size*0.7, -size/2.5 - wingPulse, -size*0.8, size/5, -10, 15);
          ctx.fill();
          
          // Right wing
          ctx.beginPath();
          ctx.moveTo(10, 0);
          ctx.bezierCurveTo(size*0.7, -size/2.5 - wingPulse, size*0.8, size/5, 10, 15);
          ctx.fill();

          // Dragon Core body
          let bodyGrad = ctx.createLinearGradient(0, -size/2.5, 0, size/2.5);
          bodyGrad.addColorStop(0, "#EF4444");
          bodyGrad.addColorStop(1, "#7F1D1D");
          ctx.fillStyle = bodyGrad;
          ctx.strokeStyle = "#F59E0B";
          ctx.lineWidth = 2.5;
          ctx.shadowColor = "#EF4444";
          ctx.shadowBlur = 10;

          // Tail path
          ctx.beginPath();
          ctx.arc(0, 10, size/4, 0, Math.PI, false);
          ctx.stroke();
          ctx.fill();

          // Head Ellipse
          ctx.beginPath();
          ctx.ellipse(0, -6, size/4.5, size/5.5, 0, 0, Math.PI*2);
          ctx.fill();
          ctx.stroke();

          // Golden Crown
          ctx.fillStyle = "#F59E0B";
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-12, -20);
          ctx.lineTo(-16, -30);
          ctx.lineTo(-6, -25);
          ctx.lineTo(0, -35);
          ctx.lineTo(6, -25);
          ctx.lineTo(16, -30);
          ctx.lineTo(12, -20);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Horns
          ctx.strokeStyle = "#FBBF24";
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(-8, -16);
          ctx.bezierCurveTo(-18, -32, -10, -35, -3, -22);
          ctx.moveTo(8, -16);
          ctx.bezierCurveTo(18, -32, 10, -35, 3, -22);
          ctx.stroke();

          // Glowing Eyes
          ctx.fillStyle = "#FBBF24";
          ctx.beginPath();
          ctx.arc(-7, -8, 3, 0, Math.PI*2);
          ctx.arc(7, -8, 3, 0, Math.PI*2);
          ctx.fill();

          ctx.restore();
          ctx.shadowBlur = 0;
        }

        function drawVetoGolem(ctx, x, y, size, scaleX, scaleY, time) {
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scaleX, scaleY);

          // Shield rotating energy arcs
          ctx.strokeStyle = "rgba(0, 212, 199, 0.4)";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, size * 0.55, time * 1.5, time * 1.5 + Math.PI / 2.2);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, size * 0.55, time * 1.5 + Math.PI, time * 1.5 + Math.PI * 1.4);
          ctx.stroke();

          // Monolith Slab
          let golemGrad = ctx.createLinearGradient(-size/2.5, -size/2.5, size/2.5, size/2.5);
          golemGrad.addColorStop(0, "#475569");
          golemGrad.addColorStop(1, "#0F172A");
          ctx.fillStyle = golemGrad;
          ctx.strokeStyle = "#00D4C7";
          ctx.lineWidth = 3;
          ctx.shadowColor = "#00D4C7";
          ctx.shadowBlur = 12;

          ctx.beginPath();
          ctx.moveTo(-size/4, -size/2.5);
          ctx.lineTo(size/4, -size/2.5);
          ctx.lineTo(size/3, -size/5);
          ctx.lineTo(size/3, size/3);
          ctx.lineTo(-size/3, size/3);
          ctx.lineTo(-size/3, -size/5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Glowing Core Eye
          let corePulse = 7 + Math.sin(time * 3.5) * 1.8;
          let coreGrad = ctx.createRadialGradient(0, -6, 2, 0, -6, corePulse);
          coreGrad.addColorStop(0, "#FFFFFF");
          coreGrad.addColorStop(0.5, "#00D4C7");
          coreGrad.addColorStop(1, "rgba(0, 212, 199, 0)");
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(0, -6, corePulse, 0, Math.PI*2);
          ctx.fill();

          // Circuit lines
          ctx.strokeStyle = "rgba(0, 212, 199, 0.85)";
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(-15, 6);
          ctx.lineTo(-8, 14);
          ctx.lineTo(-16, 22);
          ctx.moveTo(15, 6);
          ctx.lineTo(8, 14);
          ctx.lineTo(16, 22);
          ctx.stroke();

          ctx.restore();
          ctx.shadowBlur = 0;
        }

        function drawMughalOverlord(ctx, x, y, size, scaleX, scaleY, time) {
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scaleX, scaleY);

          // Hovering royal gems spinning in 3D-like ellipse
          for (let i = 0; i < 3; i++) {
            let angle = time * 1.2 + (i * Math.PI * 2 / 3);
            let gemX = Math.cos(angle) * (size * 0.5);
            let gemY = Math.sin(angle) * (size * 0.3) - 8;

            ctx.fillStyle = "#FBBF24";
            ctx.shadowColor = "#FBBF24";
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.moveTo(gemX, gemY - 6);
            ctx.lineTo(gemX + 4, gemY);
            ctx.lineTo(gemX, gemY + 6);
            ctx.lineTo(gemX - 4, gemY);
            ctx.closePath();
            ctx.fill();
          }

          // Robe contour
          let robeGrad = ctx.createLinearGradient(0, -size/2.5, 0, size/2.5);
          robeGrad.addColorStop(0, "#701A75");
          robeGrad.addColorStop(1, "#3B0764");
          ctx.fillStyle = robeGrad;
          ctx.strokeStyle = "#F59E0B";
          ctx.lineWidth = 2.8;
          ctx.shadowColor = "#F59E0B";
          ctx.shadowBlur = 10;

          ctx.beginPath();
          ctx.moveTo(0, -size/4);
          ctx.bezierCurveTo(-size/2.5, -size/7, -size/2.5, size/2.8, -size/4, size/2.8);
          ctx.lineTo(size/4, size/2.8);
          ctx.bezierCurveTo(size/2.5, size/2.8, size/2.5, -size/7, 0, -size/4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Face Shadow & Crown
          ctx.fillStyle = "#1E293B";
          ctx.beginPath();
          ctx.arc(0, -size/6, 12, 0, Math.PI*2);
          ctx.fill();

          // Majestic crown
          ctx.fillStyle = "#FBBF24";
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-12, -size/6 - 6);
          ctx.lineTo(-16, -size/6 - 20);
          ctx.lineTo(-6, -size/6 - 14);
          ctx.lineTo(0, -size/6 - 26);
          ctx.lineTo(6, -size/6 - 14);
          ctx.lineTo(16, -size/6 - 20);
          ctx.lineTo(12, -size/6 - 6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Crown Ruby
          ctx.fillStyle = "#EF4444";
          ctx.beginPath();
          ctx.arc(0, -size/6 - 16, 2.5, 0, Math.PI*2);
          ctx.fill();

          ctx.restore();
          ctx.shadowBlur = 0;
        }

        function drawQuantumHydra(ctx, x, y, size, scaleX, scaleY, time) {
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scaleX, scaleY);

          // Double Helix Wave Rings
          ctx.strokeStyle = "rgba(20, 184, 166, 0.4)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let sx = -size*0.55; sx <= size*0.55; sx += 3) {
            let sy1 = Math.sin(time*2.5 + sx*0.09) * 10;
            let sy2 = -Math.sin(time*2.5 + sx*0.09) * 10;
            ctx.fillRect(sx, sy1, 1.8, 1.8);
            ctx.fillRect(sx, sy2, 1.8, 1.8);
            if (Math.round(sx) % 12 === 0) {
              ctx.moveTo(sx, sy1);
              ctx.lineTo(sx, sy2);
            }
          }
          ctx.stroke();

          // Triple serpent necks
          let bodyGrad = ctx.createLinearGradient(0, size/2.8, 0, -size/5);
          bodyGrad.addColorStop(0, "#0F766E");
          bodyGrad.addColorStop(1, "#14B8A6");

          ctx.strokeStyle = "#14B8A6";
          ctx.lineWidth = 6.5;
          ctx.shadowColor = "#14B8A6";
          ctx.shadowBlur = 10;

          const heads = [
            { dx: -20, dy: -24, angle: -0.3, bob: Math.sin(time * 2) * 4 },
            { dx: 0, dy: -32, angle: 0, bob: Math.cos(time * 2.2) * 5 },
            { dx: 20, dy: -24, angle: 0.3, bob: Math.sin(time * 2.4) * 4 }
          ];

          heads.forEach(h => {
            ctx.beginPath();
            ctx.moveTo(0, 15);
            ctx.quadraticCurveTo(h.dx * 0.5, -6, h.dx, h.dy + h.bob);
            ctx.stroke();
          });

          // Serpent Heads
          heads.forEach(h => {
            ctx.save();
            ctx.translate(h.dx, h.dy + h.bob);
            ctx.rotate(h.angle);

            ctx.fillStyle = bodyGrad;
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.ellipse(0, 0, 11, 8, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();

            // Laser Eye
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(3, -2, 2.2, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = "#00D4C7";
            ctx.beginPath();
            ctx.arc(3, -2, 1.1, 0, Math.PI*2);
            ctx.fill();

            ctx.restore();
          });

          // Base pod core
          ctx.fillStyle = "#0F766E";
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(0, 16, 16, 0, Math.PI*2);
          ctx.fill();
          ctx.stroke();

          ctx.restore();
          ctx.shadowBlur = 0;
        }

        // Canvas Click Listener
        canvas.addEventListener('click', (e) => {
          const rect = canvas.getBoundingClientRect();
          const touchX = e.clientX - rect.left;
          const touchY = e.clientY - rect.top;

          if (gameState === 'menu') {
            // Check Store button (x: 15 to 110, y: 15 to 45)
            if (touchX >= 15 && touchX <= 110 && touchY >= 15 && touchY <= 45) {
              synthAttack();
              window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'OPEN_STORE' }));
              return;
            }
            // Check Leaderboard button (x: 120 to 220, y: 15 to 45)
            if (touchX >= 120 && touchX <= 220 && touchY >= 15 && touchY <= 45) {
              synthAttack();
              window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'OPEN_LEADERBOARD' }));
              return;
            }

            // Check dungeons
            dungeons.forEach(d => {
              if (touchX >= d.x && touchX <= d.x + d.w && touchY >= d.y && touchY <= d.y + d.h) {
                if (playerCoins < d.fee) {
                  synthHurt();
                  spawnFloatingText(touchX, touchY, "NEED " + d.fee + " MG!", "#EF4444");
                  return;
                }

                synthAttack();
                gameState = 'matching';
                selectedDungeon = d;
                matchingTimer = 0;
                
                // Notify React Native to load
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  action: 'SELECT_VAULT',
                  vaultId: d.id
                }));
              }
            });
          } else if (gameState === 'victory' || gameState === 'defeat') {
            // Precise Continue button claim region check
            const btnX = canvasW / 2 - 80;
            const btnY = canvasH / 2 + 60;
            const btnW = 160;
            const btnH = 44;
            if (touchX >= btnX && touchX <= btnX + btnW && touchY >= btnY && touchY <= btnY + btnH) {
              synthAttack();
              
              // Post complete
              window.ReactNativeWebView.postMessage(JSON.stringify({
                action: 'COMPLETE_BATTLE',
                score: finalScore
              }));
              
              gameState = 'menu';
            }
          }
        });

        // Main Rendering and Physics Damping Loop
        function loop() {
          timeCount += 0.055;

          // Background Gradient base
          let backG = ctx.createLinearGradient(0, 0, 0, canvasH);
          backG.addColorStop(0, "#080c1e");
          backG.addColorStop(1, "#0f172a");
          ctx.fillStyle = backG;
          ctx.fillRect(0, 0, canvasW, canvasH);

          // Atmospheric Tech Cyber Grid FX
          ctx.strokeStyle = "rgba(0, 212, 199, " + (0.02 + Math.abs(Math.sin(timeCount)) * 0.02) + ")";
          ctx.lineWidth = 1;
          for (let x = 0; x < canvasW; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasH);
            ctx.stroke();
          }
          for (let y = 0; y < canvasH; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasW, y);
            ctx.stroke();
          }

          // Atmospheric bobbing dust clouds
          ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
          clouds.forEach(c => {
            c.x += c.s;
            if (c.x > canvasW + 50) c.x = -c.w - 20;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.w / 2, 0, Math.PI * 2);
            ctx.arc(c.x + c.w / 3, c.y - 8, c.w / 2.4, 0, Math.PI * 2);
            ctx.arc(c.x - c.w / 3, c.y + 4, c.w / 3, 0, Math.PI * 2);
            ctx.fill();
          });

          if (gameState === 'menu') {
            // STATE 1: DUNGEON HUB PORTALS LOBBY
            
            // Premium Flat Lobby Buttons (Consistent with app look and feel)
            // Store
            ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
            ctx.strokeStyle = "#F59E0B";
            ctx.lineWidth = 1;
            drawRoundRect(15, 15, 95, 30, 8);
            ctx.fill();
            ctx.stroke();
            ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🛒 STORE", 15 + 47.5, 30);

            // Leaders
            ctx.strokeStyle = "#8B5CF6";
            drawRoundRect(120, 15, 100, 30, 8);
            ctx.fill();
            ctx.stroke();
            ctx.fillText("🏆 RANKS", 120 + 50, 30);

            // Balance
            ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
            ctx.fillStyle = "#00D4C7";
            ctx.textAlign = "right";
            ctx.fillText(playerCoins.toLocaleString() + " MG", canvasW - 15, 30);

            // Portals List
            dungeons.forEach((d) => {
              ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
              ctx.strokeStyle = d.color;
              ctx.lineWidth = d.isSpecial ? 2.0 : 1.0;
              drawRoundRect(d.x, d.y, d.w, d.h, 16);
              ctx.fill();
              ctx.stroke();

              // Info Text layouts
              ctx.textAlign = "left";
              ctx.textBaseline = "alphabetic";
              ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
              ctx.fillStyle = "#FFFFFF";
              ctx.fillText(d.icon + " " + d.name.toUpperCase(), d.x + 16, d.y + 26);

              ctx.font = "10px system-ui, -apple-system, sans-serif";
              ctx.fillStyle = "rgba(255,255,255,0.6)";
              ctx.fillText("COST: " + d.fee + " MG", d.x + 16, d.y + 44);
              ctx.fillStyle = "#00d4c7";
              ctx.fillText("LOOT: " + d.reward + " MG", d.x + 16, d.y + 60);

              // Pulsing dynamic glowing orbs
              const pulse = 10 + Math.abs(Math.sin(timeCount * 2.5)) * 3;
              const centerX = d.x + d.w - 30;
              const centerY = d.y + d.h / 2;
              
              ctx.fillStyle = d.color + "18";
              ctx.beginPath();
              ctx.arc(centerX, centerY, pulse + 4, 0, Math.PI * 2);
              ctx.fill();

              ctx.fillStyle = d.color;
              ctx.beginPath();
              ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
              ctx.fill();
            });

            // Draw bobbing player miniature disc at footer
            drawPlayerAvatar(ctx, canvasW / 2, canvasH - 72 + Math.sin(timeCount * 1.5) * 2, 54, 1.0, 1.0, timeCount);

          } else if (gameState === 'matching') {
            // STATE 2: MATCHING SCANNER
            matchingTimer += 0.05;
            if (matchingTimer > 5.0) matchingTimer = 5.0;

            // Sweeping dynamic radar tracker
            const centerX = canvasW / 2;
            const centerY = canvasH / 2 - 20;

            ctx.strokeStyle = "rgba(0, 212, 199, 0.15)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(centerX, centerY, 90, 0, Math.PI * 2);
            ctx.stroke();

            // Active rotating line
            ctx.strokeStyle = "rgba(0, 212, 199, 0.5)";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(timeCount * 2) * 90, centerY + Math.sin(timeCount * 2) * 90);
            ctx.stroke();

            ctx.font = "bold 14px system-ui, -apple-system, sans-serif";
            ctx.fillStyle = "#00D4C7";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("MATCHING DUELING ASPIRANTS...", canvasW / 2, centerY + 130);

            ctx.font = "11px system-ui, -apple-system, sans-serif";
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fillText("Securing " + selectedDungeon.name.toUpperCase() + " Vault", canvasW / 2, centerY + 152);

          } else {
            // STATE 3: ACTIVE BATTLE / COMBAT
            
            // Screen Shake translation
            let shakeX = 0, shakeY = 0;
            if (screenShake > 0) {
              shakeX = (Math.random() - 0.5) * screenShake;
              shakeY = (Math.random() - 0.5) * screenShake;
              screenShake *= 0.86;
              if (screenShake < 0.1) screenShake = 0;
            }

            ctx.save();
            ctx.translate(shakeX, shakeY);

            // Render Arena Floor dividing line
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(0, canvasH - 35, canvasW, 35);
            ctx.strokeStyle = "rgba(0, 212, 199, 0.6)";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(0, canvasH - 35);
            ctx.lineTo(canvasW, canvasH - 35);
            ctx.stroke();

            // Solve physical spring movements
            const stiffness = 0.16;
            const damping = 0.72;

            let ax = (playerTargetX - playerX) * stiffness;
            playerVX = (playerVX + ax) * damping;
            playerX += playerVX;

            let ay = (playerTargetY - playerY) * stiffness;
            playerVY = (playerVY + ay) * damping;
            playerY += playerVY;

            let bx = (bossTargetX - bossX) * stiffness;
            bossVX = (bossVX + bx) * damping;
            bossX += bossVX;

            let by = (bossTargetY - bossY) * stiffness;
            bossVY = (bossVY + by) * damping;
            bossY += bossVY;

            // Decay squash scale dampening back to normal
            playerScaleX += (1.0 - playerScaleX) * 0.16;
            playerScaleY += (1.0 - playerScaleY) * 0.16;
            bossScaleX += (1.0 - bossScaleX) * 0.16;
            bossScaleY += (1.0 - bossScaleY) * 0.16;

            // Organically Bobbing idle vectors
            let pBob = Math.sin(timeCount * 1.5) * 3;
            let bBob = Math.cos(timeCount * 1.3) * 3.5;

            // RENDER PLAYER DISC
            if (gameState !== 'defeat') {
              drawPlayerAvatar(ctx, playerX, playerY + pBob, 64, playerScaleX, playerScaleY, timeCount);
            } else {
              // Draw fallen player tilted disk
              ctx.save();
              ctx.translate(playerX, playerY + pBob);
              ctx.rotate(Math.PI / 2.2);
              drawPlayerAvatar(ctx, 0, 0, 64, playerScaleX, playerScaleY, timeCount);
              ctx.restore();
            }

            // RENDER DYNAMIC VECTOR BOSS
            if (bossHP > 0) {
              if (bossStyle === 'golem') {
                drawVetoGolem(ctx, bossX, bossY + bBob, 80, bossScaleX, bossScaleY, timeCount);
              } else if (bossStyle === 'overlord') {
                drawMughalOverlord(ctx, bossX, bossY + bBob, 80, bossScaleX, bossScaleY, timeCount);
              } else if (bossStyle === 'hydra') {
                drawQuantumHydra(ctx, bossX, bossY + bBob, 80, bossScaleX, bossScaleY, timeCount);
              } else {
                drawInflationBeast(ctx, bossX, bossY + bBob, 80, bossScaleX, bossScaleY, timeCount);
              }
            } else {
              // Boss explosion dissolver sparks
              if (Math.random() > 0.45) {
                spawnImpactParticles(bossX, bossY, "#F59E0B");
              }
            }

            // Glowing Dual-Layered Neon Slashes
            if (playerSlash) {
              ctx.save();
              ctx.strokeStyle = "rgba(0, 212, 199, " + playerSlash.life + ")";
              ctx.lineWidth = 7;
              ctx.shadowColor = "#00D4C7";
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(playerSlash.x, playerSlash.y, 48, -Math.PI / 4, Math.PI / 2.2);
              ctx.stroke();

              ctx.strokeStyle = "rgba(255, 255, 255, " + playerSlash.life + ")";
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(playerSlash.x, playerSlash.y, 45, -Math.PI / 4, Math.PI / 2.2);
              ctx.stroke();
              ctx.restore();

              playerSlash.life -= 0.12;
              if (playerSlash.life <= 0) playerSlash = null;
            }

            if (bossSlash) {
              ctx.save();
              ctx.strokeStyle = "rgba(239, 68, 68, " + bossSlash.life + ")";
              ctx.lineWidth = 8;
              ctx.shadowColor = "#EF4444";
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.arc(bossSlash.x, bossSlash.y, 54, Math.PI / 2.2, Math.PI * 1.25);
              ctx.stroke();

              ctx.strokeStyle = "rgba(255, 255, 255, " + bossSlash.life + ")";
              ctx.lineWidth = 3.5;
              ctx.beginPath();
              ctx.arc(bossSlash.x, bossSlash.y, 50.5, Math.PI / 2.2, Math.PI * 1.25);
              ctx.stroke();
              ctx.restore();

              bossSlash.life -= 0.1;
              if (bossSlash.life <= 0) bossSlash = null;
            }

            ctx.restore();

            // HUD indicators overlay
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.font = "bold 10px Courier New, monospace";
            ctx.textAlign = "left";
            ctx.fillText("ROUND " + roundIdx + "/" + totalRounds, 12, 22);

            // ENDGAME SCREENS SHOW
            if (gameState === 'victory' || gameState === 'defeat') {
              ctx.fillStyle = "rgba(7, 10, 24, 0.94)";
              ctx.fillRect(0, 0, canvasW, canvasH);

              ctx.font = "bold 24px Courier New, Courier, monospace";
              ctx.fillStyle = (gameState === 'victory') ? "#00D4C7" : "#EF4444";
              ctx.textAlign = "center";
              ctx.fillText((gameState === 'victory') ? "VICTORY!" : "DEFEATED!", canvasW / 2, canvasH / 2 - 50);

              // Confetti falling loops
              if (gameState === 'victory' && Math.random() > 0.4) {
                particles.push({
                  x: Math.random() * canvasW,
                  y: -10,
                  vx: (Math.random() - 0.5) * 5,
                  vy: Math.random() * 3 + 2.5,
                  size: Math.random() * 4 + 4,
                  color: ["#00d4c7", "#f59e0b", "#8b5cf6", "#ec4899"][Math.floor(Math.random() * 4)],
                  life: 1.0,
                  decay: 0.012,
                  gravity: 0.08,
                  friction: 0.99
                });
              }

              ctx.font = "13px system-ui, -apple-system, sans-serif";
              ctx.fillStyle = "#FFFFFF";
              ctx.fillText("FINAL SCORE: " + finalScore + " XP", canvasW / 2, canvasH / 2 - 8);
              ctx.fillStyle = "#00D4C7";
              ctx.fillText("LOOT SECURED: +" + finalReward + " MG", canvasW / 2, canvasH / 2 + 16);

              // Flat Premium Claim continue button
              const btnX = canvasW / 2 - 80;
              const btnY = canvasH / 2 + 60;
              ctx.fillStyle = "#1e293b";
              ctx.strokeStyle = "#00D4C7";
              ctx.lineWidth = 1;
              drawRoundRect(btnX, btnY, 160, 44, 12);
              ctx.fill();
              ctx.stroke();

              ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
              ctx.fillStyle = "#FFFFFF";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText("CLAIM LOOT", canvasW / 2, btnY + 22);
            }
          }

          // Active gravity physical sparks updates
          particles.forEach((p, idx) => {
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            ctx.save();
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });
          particles = particles.filter(p => p.life > 0.02);

          // Rising combat floating text indicators
          floatTexts.forEach((ft, i) => {
            ft.y -= ft.vy;
            ft.alpha -= 0.025;
            ctx.save();
            ctx.fillStyle = ft.color;
            ctx.globalAlpha = Math.max(0, ft.alpha);
            ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();
          });
          floatTexts = floatTexts.filter(ft => ft.alpha > 0.05);

          requestAnimationFrame(loop);
        }

        // PHYSICAL COLLISION ACTION TRIGGERS

        function triggerPlayerAttack(damage, combo) {
          if (gameState === 'victory' || gameState === 'defeat') return;
          synthAttack();
          
          // Windup: Pull back leftwards
          playerTargetX = playerBaseX - 35;

          setTimeout(() => {
            // High speed physical Slam
            playerTargetX = bossBaseX - 50;

            let checkColl = setInterval(() => {
              if (Math.abs(playerX - playerTargetX) < 25) {
                clearInterval(checkColl);
                
                // Slam Impact!
                synthHit();
                screenShake = 22;

                // Scale distortion squash & stretch
                bossScaleX = 0.65;
                bossScaleY = 1.35;
                playerScaleX = 1.35;
                playerScaleY = 0.65;

                spawnImpactParticles(bossX, bossY, "#00D4C7");
                bossSlash = { x: bossX, y: bossY, life: 1.0 };
                bossHP = Math.max(0, bossHP - damage);

                spawnFloatingText(bossX, bossY - 22, "-" + damage + " CONCEPT SLAM!", "#00D4C7");

                if (combo >= 3) {
                  synthCombo(combo);
                  spawnFloatingText(bossX - 12, bossY - 48, combo + "X STRIKE!", "#FBBF24");
                }

                // Recoil back home
                setTimeout(() => {
                  playerTargetX = playerBaseX;
                }, 150);
              }
            }, 10);

            // Safety clear watchdog
            setTimeout(() => clearInterval(checkColl), 500);

          }, 150);
        }

        function triggerPlayerHurt(damage) {
          if (gameState === 'victory' || gameState === 'defeat') return;

          // Windup: Pull back rightwards
          bossTargetX = bossBaseX + 35;

          setTimeout(() => {
            // High speed physical Slam
            bossTargetX = playerBaseX + 50;

            let checkColl = setInterval(() => {
              if (Math.abs(bossX - bossTargetX) < 25) {
                clearInterval(checkColl);

                // Slam Impact!
                synthHurt();
                screenShake = 24;

                // Scale distortion squash & stretch
                playerScaleX = 0.65;
                playerScaleY = 1.35;
                bossScaleX = 1.35;
                bossScaleY = 0.65;

                spawnImpactParticles(playerX, playerY, "#EF4444");
                playerSlash = { x: playerX, y: playerY, life: 1.0 };
                playerShield = Math.max(0, playerShield - damage);

                spawnFloatingText(playerX, playerY - 22, "-" + damage + " SHIELD BURST!", "#EF4444");

                // Recoil back home
                setTimeout(() => {
                  bossTargetX = bossBaseX;
                }, 150);
              }
            }, 10);

            // Safety clear watchdog
            setTimeout(() => clearInterval(checkColl), 500);

          }, 150);
        }

        function updateRound(idx, total) {
          roundIdx = idx;
          totalRounds = total;
        }

        function triggerVictory() {
          gameState = 'victory';
          synthVictory();
          bossHP = 0;
          spawnImpactParticles(bossBaseX, bossBaseY, "#F59E0B");
        }

        function triggerDefeat() {
          gameState = 'defeat';
          synthDefeat();
        }

        // WebView bridge messaging protocol
        window.addEventListener('message', (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.action === 'START_BATTLE') {
              playerShield = 100;
              bossHP = 100;
              roundIdx = 1;
              totalRounds = data.questions.length;
              gameState = 'battle';
              
              const name = data.vaultName.toLowerCase();
              if (name.includes('polity') || name.includes('general')) {
                bossStyle = 'golem';
              } else if (name.includes('history') || name.includes('affairs')) {
                bossStyle = 'overlord';
              } else if (name.includes('economy')) {
                bossStyle = 'dragon';
              } else {
                bossStyle = 'hydra';
              }
              
              screenShake = 10;
            } else if (data.action === 'UPDATE_COINS') {
              playerCoins = data.coins;
            } else if (data.action === 'ATTACK') {
              triggerPlayerAttack(data.damage, data.combo);
            } else if (data.action === 'HURT') {
              triggerPlayerHurt(data.damage);
            } else if (data.action === 'NEXT_ROUND') {
              updateRound(data.index, data.total);
            } else if (data.action === 'VICTORY') {
              triggerVictory();
              finalScore = data.finalScore;
              finalReward = data.finalReward;
            } else if (data.action === 'DEFEAT') {
              triggerDefeat();
              finalScore = data.finalScore;
              finalReward = data.finalReward;
            }
          } catch(e) {}
        });

        loop();
      </script>
    </body>
    </html>
  `;

  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('[BattleArena Bridge] Message received:', data);
      
      if (data.action === 'SELECT_VAULT') {
        const vId = data.vaultId;
        setIsDungeonLoading(true);
        try {
          const result = await MindClashGameService.findMatch(vId, userId || '');
          if (result.sessionId) {
            setInternalSessionId(result.sessionId);
            
            const vaultNames: Record<string, string> = {
              'polity': 'Polity Vault',
              'science': 'Science Vault',
              'economy': 'Economy Vault',
              'history': 'History Vault',
              'geography': 'Geography Vault',
              'current-affairs': 'Current Affairs Vault',
              'general': 'The Elite Vault (General)',
            };
            const vName = vaultNames[vId] || 'Knowledge Vault';
            setInternalVaultName(vName);

            // Fetch questions
            const qs = await MindClashGameService.getSessionQuestions(result.sessionId);
            setInternalQuestions(qs);
            
            // Reset gameplay states
            setScore(0);
            setCurrentIdx(0);
            setSelectedOpt(null);
            setAnswered(false);
            setShieldHealth(100);
            setBossHealth(100);
            setStreak(0);
            setShowCountdown(true);
            setCountdownValue(3);
            
            // Notify Webview to start battle
            webviewRef.current?.postMessage(JSON.stringify({
              action: 'START_BATTLE',
              questions: qs,
              sessionId: result.sessionId,
              vaultName: vName
            }));
          } else {
            console.error('Matchmaking failed:', result.error);
          }
        } catch (err) {
          console.error('Error selecting dungeon:', err);
        } finally {
          setIsDungeonLoading(false);
        }
      } else if (data.action === 'OPEN_STORE') {
        onOpenStore?.();
      } else if (data.action === 'OPEN_LEADERBOARD') {
        onOpenLeaderboard?.();
      } else if (data.action === 'EXIT_GAME') {
        onExit?.();
      } else if (data.action === 'COMPLETE_BATTLE') {
        // Sync battle rewards!
        if (internalSessionId && userId) {
          try {
            const result = await MindClashGameService.completeGameSession(
              internalSessionId,
              userId,
              data.score
            );
            if (result) {
              // Update coins in React Native and Webview
              const newCoins = effectiveCoins + result.mgEarned;
              onCoinsUpdated(newCoins);
              
              webviewRef.current?.postMessage(JSON.stringify({
                action: 'UPDATE_COINS',
                coins: newCoins
              }));
            }
          } catch (err) {
            console.error('Error completing battle:', err);
          }
        }
        
        // Return to Dungeon Select Hub!
        setInternalQuestions([]);
        setInternalSessionId(null);
      }
    } catch (e) {
      console.warn('Error parsing WebView message:', e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Dynamic Viewport: Full-screen for 2D Portal menu, Collapsed (290) for battle MCQ */}
      <View style={showGameplay ? [styles.gameViewport, { height: 290, paddingTop: insets.top }] : [styles.gameViewport, { flex: 1, paddingTop: insets.top }]}>
        <View style={styles.viewportHeader}>
          <TouchableOpacity style={styles.exitBtn} onPress={onExit}>
            <Ionicons name="close" size={20} color="#64748B" />
          </TouchableOpacity>
          <Text style={styles.vaultTitle}>{showGameplay ? internalVaultName.toUpperCase() : 'DUNGEON HUB'}</Text>
          <View style={styles.scoreContainer}>
            <FontAwesome5 name="coins" size={12} color="#D97706" />
            <Text style={styles.scoreText}>{showGameplay ? score : effectiveCoins}</Text>
          </View>
        </View>

        {/* High Performance HTML5 Game WebView */}
        <WebView
          ref={webviewRef}
          source={{ html: gameHTML }}
          style={styles.webView}
          scrollEnabled={false}
          overScrollMode="never"
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={handleWebViewMessage}
        />

        {/* Floating Health HUD Layer */}
        {showGameplay && (
          <View style={styles.healthLayer}>
            <View style={styles.hudBar}>
              <Text style={styles.hudLabel}>SHIELD (YOU)</Text>
              <View style={styles.barFrame}>
                <MotiView
                  animate={{ width: `${shieldHealth}%` }}
                  transition={{ type: 'timing', duration: 300 }}
                  style={[
                    styles.barFill,
                    { backgroundColor: shieldHealth < 30 ? '#F43F5E' : '#00D4C7' }
                  ]}
                />
              </View>
            </View>

            <View style={styles.hudBar}>
              <Text style={[styles.hudLabel, { textAlign: 'right' }]}>{bossInfo.name}</Text>
              <View style={styles.barFrame}>
                <MotiView
                  animate={{ width: `${bossHealth}%` }}
                  transition={{ type: 'timing', duration: 300 }}
                  style={[styles.barFill, { backgroundColor: '#F43F5E', alignSelf: 'flex-end' }]}
                />
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Premium Milky White / Slate flat revision card bottom half */}
      {showGameplay && (
        <Animated.View style={[styles.revisionArea, { transform: [{ translateX: shakeAnim }] }]}>
          <AnimatePresence>
            {announcerText !== '' && (
              <MotiView
                from={{ opacity: 0, scale: 0.5, translateY: 10 }}
                animate={{ opacity: 1, scale: 1.1, translateY: 0 }}
                exit={{ opacity: 0, scale: 1.3 }}
                style={styles.announcerContainer}
              >
                <BlurView intensity={30} style={styles.announcerBlur}>
                  <Text style={styles.announcerText}>{announcerText}</Text>
                </BlurView>
              </MotiView>
            )}
          </AnimatePresence>

          {/* MCQ Question Plate */}
          <MotiView
            key={currentIdx}
            from={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.questionCard}
          >
            <Text style={styles.questionIndexText}>CONCEPT BATTLE • ROUND {currentIdx + 1}</Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </MotiView>

          {/* Options List */}
          <ScrollView contentContainerStyle={styles.optionsList} showsVerticalScrollIndicator={false}>
            {currentQuestion.options.map((opt, i) => {
              const isCorrect = i === currentQuestion.correctAnswer;
              const isSelected = selectedOpt === i;

              let cardStyle: any = styles.optionBtn;
              let textStyle: any = styles.optionText;

              if (isSelected) {
                cardStyle = isCorrect ? styles.optionCorrect : styles.optionWrong;
                textStyle = styles.optionTextSelected;
              } else if (answered && isCorrect) {
                cardStyle = styles.optionShowCorrect;
              }

              return (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.8}
                  onPress={() => handleOptionSelect(i)}
                  disabled={answered}
                  style={cardStyle}
                >
                  <View style={styles.optionInner}>
                    <Text style={textStyle}>{opt}</Text>
                    {answered && isCorrect && (
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    )}
                    {answered && isSelected && !isCorrect && (
                      <Ionicons name="close-circle" size={20} color="#F43F5E" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>
      )}

      {/* Opponents Leaderboard Ticker */}
      {showGameplay && (
        <View style={[styles.ticker, { paddingBottom: insets.bottom + 8 }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tickerContent}>
            {participants.map((p, i) => (
              <View key={i} style={styles.tickerItem}>
                <View style={styles.tickerAvatar}>
                  <Text style={{ fontSize: 11 }}>{p.avatar || '👤'}</Text>
                </View>
                <Text style={styles.tickerName}>{p.name}</Text>
                <Text style={styles.tickerScore}>{p.score} XP</Text>
              </View>
            ))}
            {participants.length === 0 && (
              <Text style={styles.waitingText}>SCANNING SQUAD BATTLE PARTICIPANTS...</Text>
            )}
          </ScrollView>
        </View>
      )}

      {/* Initial Countdown Overlay */}
      {showGameplay && showCountdown && (
        <View style={styles.countdownOverlay}>
          <MotiView
            from={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={countdownValue}
            style={styles.countdownCircle}
          >
            <Text style={styles.countdownValue}>{countdownValue === 0 ? 'FIGHT!' : countdownValue}</Text>
          </MotiView>
          <Text style={styles.countdownSub}>PREPARE YOUR SYLLABUS REVISION</Text>
        </View>
      )}

      {/* Full-Screen Activity Indicator for loading dungeons */}
      {isDungeonLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00D4C7" />
          <Text style={styles.loadingOverlayText}>LOADING SYLLABUS DUNGEON...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Premium Milky White
  },
  gameViewport: {
    backgroundColor: '#0c1020',
    position: 'relative',
  },
  viewportHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 24,
    left: 0,
    right: 0,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 999,
  },
  exitBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vaultTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#FBBF24',
  },
  webView: {
    flex: 1,
    backgroundColor: '#0c1020',
  },
  healthLayer: {
    position: 'absolute',
    bottom: 8,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    zIndex: 999,
  },
  hudBar: {
    flex: 1,
  },
  hudLabel: {
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
    letterSpacing: 0.8,
  },
  barFrame: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  revisionArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#F8FAFC',
  },
  announcerContainer: {
    position: 'absolute',
    top: -24,
    alignSelf: 'center',
    zIndex: 1000,
  },
  announcerBlur: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  announcerText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0', // Flat border, no shadows
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  questionIndexText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    lineHeight: 24,
  },
  optionsList: {
    gap: 10,
    paddingBottom: 80,
  },
  optionBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Flat border, no shadows
  },
  optionInner: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#334155',
    flex: 1,
  },
  optionCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: '#10B981',
    borderRadius: 16,
    borderWidth: 1.5,
  },
  optionWrong: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderColor: '#F43F5E',
    borderRadius: 16,
    borderWidth: 1.5,
  },
  optionShowCorrect: {
    borderColor: '#10B981',
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  optionTextSelected: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    flex: 1,
  },
  ticker: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0', // Flat border, no shadows
    zIndex: 998,
  },
  tickerContent: {
    padding: 12,
    gap: 16,
    alignItems: 'center',
  },
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.03)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tickerAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickerName: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#475569',
  },
  tickerScore: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  waitingText: {
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
    color: '#94A3B8',
    letterSpacing: 2,
  },
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 15, 25, 0.98)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  countdownCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: '#00D4C7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00D4C7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  countdownValue: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#00D4C7',
  },
  countdownSub: {
    marginTop: 24,
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#64748B',
    letterSpacing: 3,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 16, 32, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  loadingOverlayText: {
    marginTop: 16,
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#00D4C7',
    letterSpacing: 2,
  },
});

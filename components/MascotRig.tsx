
// 🎭 MascotRig - Enterprise High-Fidelity Rig
// Full-featured mascot with WebAudio LipSync and Asset-Driven Expressions.

import React, { useRef, useImperativeHandle, useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ENABLE_MASCOTRIG_LOGS = true; // Debug: enable to surface WebView errors

export type MascotExpression = 'idle' | 'happy' | 'sad' | 'angry' | 'thinking' | 'confused' | 'excited' | 'listening' | 'playful' | 'proud' | 'speaking' | 'neutral' | 'teaching' | 'encouraging' | 'warning' | 'waiting' | 'sleepy' | 'celebrate';

type ResolvedWolfAssets = {
  moc: string;
  texture: string;
  physics: string;
  expressions: Record<'sad' | 'proud' | 'angry' | 'playful' | 'happy', string>;
};

const LOCAL_WOLF_ASSETS = {
  moc: require('@/assets/mascot/mascotrig/wolf_live2d/wolf.moc3'),
  texture: require('@/assets/mascot/mascotrig/wolf_live2d/wolf.4096/texture_00.png'),
  physics: require('@/assets/mascot/mascotrig/wolf_live2d/wolf.physics3'),
  expressions: {
    sad: require('@/assets/mascot/mascotrig/wolf_live2d/sad.exp3'),
    proud: require('@/assets/mascot/mascotrig/wolf_live2d/proud.exp3'),
    angry: require('@/assets/mascot/mascotrig/wolf_live2d/angry.exp3'),
    playful: require('@/assets/mascot/mascotrig/wolf_live2d/playful.exp3'),
    happy: require('@/assets/mascot/mascotrig/wolf_live2d/happy.exp3'),
  },
};

export interface MascotRigRef {

  setExpression: (expression: MascotExpression) => void;
  startListening: () => void;
  stopListening: () => void;
  lookAt: (x: number, y: number) => void;
  startSpeaking: () => void;
  stopSpeaking: () => void;
  startAudioSync: (url: string) => void;
  enqueueAudioChunk: (base64Audio: string, isFinal?: boolean) => void;
  resetAudioQueue: () => void;
  setMouth: (value: number, form?: number) => void;
  joinPipecatSession: (url: string, token: string) => void;
  leavePipecatSession: () => void;
  reset: () => void;
}

interface MascotRigProps {
  size?: number;
  baseUrl?: string;
  onReady?: () => void;
  onError?: (error: string) => void;
  onTouch?: (zone: 'head' | 'body') => void;
  emotion?: MascotExpression;
  showGlow?: boolean;
  onAudioQueueEmpty?: () => void;
}

const generateLive2DHTML = (size: number, baseUrl?: string, showGlow: boolean = false, resolvedAssets?: ResolvedWolfAssets | null) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: transparent !important; overflow: hidden; touch-action: none; }
    canvas { 
        display: block; 
        width: 100% !important; 
        height: 100% !important; 
        position: absolute; 
        top: 0; 
        left: 0;
    }
  </style>
</head>
<body>
  <script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js" onerror="window.__cdnError='cubismcore'"></script>
  <script src="https://cdn.jsdelivr.net/npm/pixi.js@7.3.2/dist/pixi.min.js" onerror="window.__cdnError='pixi'"></script>
  <script src="https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.4.0/dist/cubism4.min.js" onerror="window.__cdnError='pixi-live2d'"></script>
  
  <script>
    let model = null;
    let app = null;
    let isSpeaking = false;
    let isAutoLipSync = false;
    let mouthValue = 0;
    let mouthForm = 0.15;
    let mouthTarget = 0;
    let mouthFormTarget = 0.15;
    let lastExternalMouthTs = 0;
    let currentExpression = 'idle';
    let expressionTimeout = null;

    // Smooth organic gaze tracking variables
    let gaze = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    };
    
    // Auto-blinking variables
    let blinkState = 'open'; // 'open', 'closing', 'closed', 'opening'
    let blinkTimer = 0;
    let blinkDuration = 2.0 + Math.random() * 4.0;
    let eyeOpenRatio = 1.0;

    // WebAudio API state
    let audioCtx = null;
    let analyser = null;
    let source = null;
    let audio = null;
    let audioQueue = [];
    let currentSource = null;
    let isQueuePlaying = false;
    let queueFinalReceived = false;
    let queueEmptyNotified = false;

    window.onerror = function(msg, url, line, col, error) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ 
        type: 'error', 
        data: 'Global Error: ' + msg + ' at ' + line + ':' + col 
      }));
      return false;
    };

    // Remote Log Bridge
    const originalLog = console.log;
    console.log = function() {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', data: Array.from(arguments).join(' ') }));
      }
      originalLog.apply(console, arguments);
    };

    const originalError = console.error;
    console.error = function() {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', data: Array.from(arguments).join(' ') }));
      }
      originalError.apply(console, arguments);
    };

    const propSize = ${size};
    const propBaseUrl = '${baseUrl || ''}';
    const localAssets = ${JSON.stringify(resolvedAssets || null)};
    const fallbackUrl = 'https://yuntwerxahgmaoduxvqc.supabase.co/storage/v1/object/public/mascot/wolf_live2d/';
    let rawBaseUrl = (propBaseUrl && propBaseUrl.startsWith('http')) ? propBaseUrl : fallbackUrl;

    // Hardened Auto-Correction for known project typos
    rawBaseUrl = rawBaseUrl.replace('vqqc.supabase.co', 'vqc.supabase.co');
    rawBaseUrl = rawBaseUrl.replace('/masccot/', '/mascot/');
    rawBaseUrl = rawBaseUrl.replace('/objectt/', '/object/');
    
    // Ensure trailing slash
    const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl : rawBaseUrl + '/';

    const DEBUG = true; // Debug: enable WebView console forwarding
    if (DEBUG) console.log('Live2D: Resolved and cleaned baseUrl:', baseUrl);

    function assetPath(relativePath, localValue) {
      if (localValue && typeof localValue === 'string') return localValue;
      return baseUrl + relativePath;
    }

    function setCoreParam(id, value) {
      if (!model || !model.internalModel || !model.internalModel.coreModel) return;
      const cm = model.internalModel.coreModel;
      if (typeof cm.setParameterValueById === 'function') {
        cm.setParameterValueById(id, value);
      } else if (typeof cm.setParamFloat === 'function') {
        cm.setParamFloat(id, value);
      } else if (typeof cm._setParamFloat === 'function') {
        cm._setParamFloat(id, value);
      } else if (cm._parameterIds && cm._parameterValues) {
        const idx = cm._parameterIds.indexOf(id);
        if (idx !== -1) cm._parameterValues[idx] = value;
      }
    }

    function applyMouth(value, formValue) {
      setCoreParam('ParamMouthOpenY', value);
      setCoreParam('ParamMouthForm', formValue);
    }

    let gazeResetTimer = null;

    function resetGaze() {
      gaze.targetX = 0;
      gaze.targetY = 0;
    }

    function scheduleGazeReset() {
      if (gazeResetTimer) clearTimeout(gazeResetTimer);
      gazeResetTimer = setTimeout(resetGaze, 1800);
    }

    // Sparkle Particle System
    const sparkles = [];
    function createSparkle(x, y, layer) {
      const sparkle = new PIXI.Graphics();
      sparkle.beginFill(0x00D4C7, 0.8);
      sparkle.drawCircle(0, 0, 4); // fall-back to circle
      sparkle.endFill();
      sparkle.x = x;
      sparkle.y = y;
      sparkle.alpha = 1;
      sparkle.scale.set(Math.random() * 0.5 + 0.5);
      sparkle.vx = (Math.random() - 0.5) * 2;
      sparkle.vy = (Math.random() - 0.5) * 2;
      layer.addChild(sparkle);
      sparkles.push(sparkle);
    }

    function updateSparkles(layer) {
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= 0.03;
        s.scale.set(s.scale.x * 0.95);
        if (s.alpha <= 0) {
          layer.removeChild(s);
          sparkles.splice(i, 1);
        }
      }
    }

    let attemptLocalLoad = localAssets !== null;

    // Watchdog: if scripts don't load within 15s, report error
    let initAttempts = 0;
    const MAX_INIT_ATTEMPTS = 75; // 75 * 200ms = 15 seconds
    
    async function init() {
      if (DEBUG) console.log('Live2D: Init started. Checking dependencies... attempt=' + initAttempts);
      
      if (window.__cdnError) {
        console.error('Live2D: CDN script failed to load: ' + window.__cdnError);
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', data: 'CDN_LOAD_FAIL: ' + window.__cdnError }));
        return;
      }
      
      initAttempts++;
      if (initAttempts > MAX_INIT_ATTEMPTS) {
        console.error('Live2D: Timed out waiting for PIXI/Live2D scripts after 15s. typeof PIXI=' + typeof PIXI);
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', data: 'INIT_TIMEOUT: scripts did not load after 15s' }));
        return;
      }
      
      if (typeof PIXI === 'undefined') {
        if (DEBUG) console.log('Live2D: PIXI not detected, retrying in 200ms...');
        setTimeout(init, 200);
        return;
      }
      if (!PIXI.live2d) {
        if (DEBUG) console.log('Live2D: PIXI.live2d (from fork) not detected yet, retrying in 200ms...');
        setTimeout(init, 200);
        return;
      }

      if (DEBUG) console.log('Live2D: Dependencies OK. Creating PIXI app...');
      
      // Clean up previous app view if retrying
      if (app) {
        try {
          app.destroy(true, { children: true, texture: true, baseTexture: true });
        } catch(e) {}
        app = null;
        const canvas = document.querySelector('canvas');
        if (canvas) canvas.remove();
      }

      app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        antialias: true,
      });
      document.body.appendChild(app.view);

      const activeAssets = attemptLocalLoad ? localAssets : null;

      const modelConfig = {
        "Version": 3,
        "FileReferences": {
          "Moc": assetPath("wolf.moc3", activeAssets && activeAssets.moc),
          "Textures": [assetPath("wolf.4096/texture_00.png", activeAssets && activeAssets.texture)],
          "Physics": assetPath("wolf.physics3", activeAssets && activeAssets.physics),
          "Expressions": [
            { "Name": "sad", "File": assetPath("sad.exp3", activeAssets && activeAssets.expressions && activeAssets.expressions.sad) },
            { "Name": "proud", "File": assetPath("proud.exp3", activeAssets && activeAssets.expressions && activeAssets.expressions.proud) },
            { "Name": "angry", "File": assetPath("angry.exp3", activeAssets && activeAssets.expressions && activeAssets.expressions.angry) },
            { "Name": "playful", "File": assetPath("playful.exp3", activeAssets && activeAssets.expressions && activeAssets.expressions.playful) },
            { "Name": "happy", "File": assetPath("happy.exp3", activeAssets && activeAssets.expressions && activeAssets.expressions.happy) }
          ]
        }
      };

      try {
        if (DEBUG) console.log('Live2D: Model config paths resolved to absolute URLs');
      } catch (pathErr) {
        console.error('Live2D: Path resolution failed: ' + pathErr.message);
      }

      const blob = new Blob([JSON.stringify(modelConfig)], { type: 'application/json' });
      const blobUrl = URL.createObjectURL(blob);

      if (DEBUG) console.log('Live2D: Loading model from blob config...');
      try {
        if (PIXI.Assets && PIXI.Assets.settings) PIXI.Assets.settings.crossOrigin = 'anonymous';

        model = await PIXI.live2d.Live2DModel.from(blobUrl, { 
          autoInteract: false,
          basePath: baseUrl,
        });
      } catch (e) {
        console.error('Live2D model load failed: ' + e.message + ' | ' + JSON.stringify(e));
        if (attemptLocalLoad) {
          console.warn('Local load failed, falling back to remote Supabase URL...');
          attemptLocalLoad = false;
          init(); // Retry with remote URL!
          return;
        }
        return;
      }
      
      // Dimension-Based Centering and Anchoring
      function resizeModel() {
        if (!model) return;
        const cw = window.innerWidth;
        const ch = window.innerHeight;
        const im = model.internalModel;
        const mw = (im && im.originalWidth) || model.width || 1;
        const mh = (im && im.originalHeight) || model.height || 1;
        const scale = Math.min(cw / mw, ch / mh) * 0.86;
        model.scale.set(scale);
        model.anchor.set(0, 0);
        model.x = (cw - mw * scale) / 2;
        model.y = ch - mh * scale;
      }
      
      resizeModel();
      window.addEventListener('resize', resizeModel);
      
      app.stage.addChild(model);

      const sparkleLayer = new PIXI.Container();
      app.stage.addChild(sparkleLayer);

      // Track finger drag with smooth interpolation target
      const handleDrag = (e) => {
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        
        gaze.targetX = (x / window.innerWidth) * 2 - 1;
        gaze.targetY = (y / window.innerHeight) * 2 - 1;
        
        scheduleGazeReset();
        createSparkle(x, y, sparkleLayer);
      };

      window.addEventListener('mousemove', handleDrag, { passive: true });
      window.addEventListener('touchmove', handleDrag, { passive: true });
      window.addEventListener('mousedown', handleDrag, { passive: true });
      window.addEventListener('touchstart', handleDrag, { passive: true });

      app.ticker.add(() => {
        updateSparkles(sparkleLayer);
      });

      model.on('pointertap', (e) => {
        const localPoint = e.data.getLocalPosition(model);
        const relativeY = (localPoint.y - (model.y - model.height/2)) / model.height;
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'touch', zone: relativeY < 0.35 ? 'head' : 'body' }));
      });

      let lastTime = Date.now();
      const attack = 0.55;
      const release = 0.18;

      function animate() {
        const now = Date.now();
        const dt = (now - lastTime) / 1000;
        lastTime = now;

        if (model && model.internalModel && model.internalModel.coreModel) {
          model.update(dt * 1000);  // Update physics/motions first

          const core = model.internalModel.coreModel;

          // 1. Gaze smoothing (head & eyes follow smoothly)
          gaze.x += (gaze.targetX - gaze.x) * 0.08;
          gaze.y += (gaze.targetY - gaze.y) * 0.08;
          
          setCoreParam('ParamEyeBallX', gaze.x);
          setCoreParam('ParamEyeBallY', -gaze.y);
          setCoreParam('ParamAngleX', gaze.x * 25);
          setCoreParam('ParamAngleY', -gaze.y * 20);
          setCoreParam('ParamBodyAngleX', gaze.x * 8);

          // 2. Dynamic state-based blinking engine
          if (currentExpression !== 'sleepy') {
            blinkTimer += dt;
            if (blinkState === 'open') {
              if (blinkTimer > blinkDuration) {
                blinkState = 'closing';
                blinkTimer = 0;
              }
            } else if (blinkState === 'closing') {
              eyeOpenRatio -= dt * 10; // closes in ~100ms
              if (eyeOpenRatio <= 0) {
                eyeOpenRatio = 0;
                blinkState = 'closed';
                blinkTimer = 0;
                blinkDuration = 0.04 + Math.random() * 0.08; // stay closed briefly
              }
            } else if (blinkState === 'closed') {
              if (blinkTimer > blinkDuration) {
                blinkState = 'opening';
                blinkTimer = 0;
              }
            } else if (blinkState === 'opening') {
              eyeOpenRatio += dt * 8; // opens in ~125ms
              if (eyeOpenRatio >= 1) {
                eyeOpenRatio = 1;
                blinkState = 'open';
                blinkTimer = 0;
                blinkDuration = 2.0 + Math.random() * 4.0; // blink every 2-6s
              }
            }
          } else {
            // Sleepy mode: eyes semi-closed & heavy
            eyeOpenRatio = 0.35 + Math.sin(now * 0.0015) * 0.05;
          }
          setCoreParam('ParamEyeLOpen', eyeOpenRatio);
          setCoreParam('ParamEyeROpen', eyeOpenRatio);

          // 3. Smooth Lip Sync with fine-tuned envelopes
          const externalActive = lastExternalMouthTs && (now - lastExternalMouthTs < 220);
          if (isAutoLipSync) {
            // PIXI model fork handles automatically during fallback audio playing
          } else if (!externalActive) {
            if (analyser) {
              const freqData = new Uint8Array(analyser.frequencyBinCount);
              analyser.getByteFrequencyData(freqData);
              let low = 0;
              let mid = 0;
              let high = 0;
              let total = 0;
              let weighted = 0;
              const third = Math.max(1, Math.floor(freqData.length / 3));
              for (let i = 0; i < freqData.length; i++) {
                const value = freqData[i] / 255;
                total += value;
                weighted += value * i;
                if (i < third) low += value;
                else if (i < third * 2) mid += value;
                else high += value;
              }
              const avg = total / freqData.length;
              const centroid = total > 0 ? weighted / total / Math.max(1, freqData.length - 1) : 0.25;
              const energy = Math.max(0, avg - 0.045);
              mouthTarget = Math.min(1, Math.max(0, energy * 4.8 + mid * 0.18));
              mouthFormTarget = Math.max(0.08, Math.min(0.42, 0.12 + centroid * 0.24 + high * 0.05 - low * 0.03));
            } else {
              mouthTarget = 0;
              mouthFormTarget = 0.15;
            }
          }

          // Smooth interpolation towards targets (attack/release filters)
          const coeff = mouthTarget > mouthValue ? attack : release;
          mouthValue += (mouthTarget - mouthValue) * coeff;
          mouthForm += (mouthFormTarget - mouthForm) * 0.15;

          const openVal = Math.max(0, Math.min(1, mouthValue));
          const formVal = mouthForm;
          if (!isAutoLipSync || externalActive) {
            applyMouth(openVal, formVal);
          }

          // 4. Custom animated expressions
          if (currentExpression === 'thinking' || currentExpression === 'waiting') {
            const t = now * 0.001;
            const eyeX = 0.3 + Math.sin(t * 0.8) * 0.05;
            const eyeY = 0.45 + Math.cos(t * 0.8) * 0.05;
            const headX = 6 + Math.sin(t * 0.5) * 1.5;
            const headY = 10 + Math.cos(t * 0.5) * 1.5;
            const headZ = 3 + Math.sin(t * 0.5) * 1;
            
            setCoreParam('ParamEyeBallX', eyeX);
            setCoreParam('ParamEyeBallY', eyeY);
            setCoreParam('ParamAngleX', headX);
            setCoreParam('ParamAngleY', headY);
            setCoreParam('ParamAngleZ', headZ);
          } else if (currentExpression === 'confused') {
            const t = now * 0.001;
            const eyeX = -0.25 + Math.sin(t * 0.6) * 0.04;
            const eyeY = 0.15 + Math.cos(t * 0.6) * 0.04;
            const headX = -8 + Math.sin(t * 0.4) * 1.5;
            const headY = 3 + Math.cos(t * 0.4) * 1;
            const headZ = -5 + Math.sin(t * 0.4) * 1;
            
            setCoreParam('ParamEyeBallX', eyeX);
            setCoreParam('ParamEyeBallY', eyeY);
            setCoreParam('ParamAngleX', headX);
            setCoreParam('ParamAngleY', headY);
            setCoreParam('ParamAngleZ', headZ);
          } else if (currentExpression === 'sleepy') {
            const t = now * 0.001;
            const headY = -12 + Math.sin(t * 0.4) * 2;
            
            setCoreParam('ParamEyeBallX', 0);
            setCoreParam('ParamEyeBallY', -0.25);
            setCoreParam('ParamAngleX', 0);
            setCoreParam('ParamAngleY', headY);
            setCoreParam('ParamAngleZ', 0);
          }

          // 5. Continuous natural breathing
          setCoreParam('ParamBreath', (Math.sin(now * 0.002) + 1) / 2);
          if (currentExpression !== 'thinking' && currentExpression !== 'waiting' && currentExpression !== 'sleepy' && currentExpression !== 'confused') {
            setCoreParam('ParamBodyAngleX', Math.sin(now * 0.001) * 2 + gaze.x * 6);
          }
        }
        requestAnimationFrame(animate);
      }
      
      animate();

      if (DEBUG) console.log('Live2D: Init complete. Sending ready signal.');
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));

      try {
        const ids = model?.internalModel?.coreModel?._parameterIds || [];
        const paramNames = ids.slice(0, 40).map(id => id?.toString?.() || String(id));
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'params', data: paramNames }));
      } catch (e) {}
    }

    const setExpression = (name) => {
      if (!model || !name) return;
      try {
        if (name === 'thinking' || name === 'waiting' || name === 'sleepy') {
          model.expression(null);
        } else if (name === 'confused') {
          model.expression('sad');
        } else {
          model.expression(name);
        }
        currentExpression = name;
        clearTimeout(expressionTimeout);
      } catch(e) {}
    };

    function fallbackAudioPlay(url) {
      isAutoLipSync = false;
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.85;
      }
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
      if (audio) { audio.pause(); audio = null; }
      audio = new Audio(url);
      audio.crossOrigin = "anonymous";
      source = audioCtx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      audio.muted = true;
      audio.onended = () => {
        isSpeaking = false;
        mouthTarget = 0;
        mouthFormTarget = 0.15;
      };
      audio.onerror = () => {
        isSpeaking = false;
        mouthTarget = 0;
        mouthFormTarget = 0.15;
      };
      audio.play().catch(e => console.error('Fallback play failed:', e.message));
      isSpeaking = true;
    }

    function analyzeAudioOnly(url) {
      isAutoLipSync = false;
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.85;
      }
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
      if (audio) {
        try {
          audio.pause();
          audio.currentTime = 0;
          audio.src = '';
        } catch (e) {}
        audio = null;
      }
      if (source) {
        try { source.disconnect(); } catch (e) {}
        source = null;
      }
      audio = new Audio(url);
      audio.crossOrigin = "anonymous";
      audio.preload = "auto";
      source = audioCtx.createMediaElementSource(audio);
      source.connect(analyser);
      audio.onended = () => {
        isSpeaking = false;
        mouthTarget = 0;
        mouthFormTarget = 0.15;
      };
      audio.onerror = () => {
        isSpeaking = false;
        mouthTarget = 0;
        mouthFormTarget = 0.15;
      };
      audio.play().catch(e => console.error('Analyzer play failed:', e.message));
      isSpeaking = true;
    }

    function initQueueAudio() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.85;
      }
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    }

    function decodeBase64ToBuffer(base64Str) {
      const clean = base64Str.includes(',') ? base64Str.split(',')[1] : base64Str;
      const binaryString = window.atob(clean);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
      return bytes.buffer;
    }

    function stopCurrentAudioPlayback() {
      if (audio) {
        try {
          audio.pause();
          audio.currentTime = 0;
          audio.src = '';
        } catch (e) {}
        audio = null;
      }
      if (currentSource) {
        try { currentSource.stop(); } catch (e) {}
        currentSource = null;
      }
      audioQueue = [];
      isQueuePlaying = false;
      queueFinalReceived = false;
      isSpeaking = false;
      isAutoLipSync = false;
      mouthTarget = 0;
      mouthFormTarget = 0.15;
    }

    async function enqueueAudioChunk(base64Str, isFinal) {
      if (isFinal) queueFinalReceived = true;
      if (!base64Str) {
        if (!isQueuePlaying && audioQueue.length === 0 && !queueEmptyNotified) {
          queueEmptyNotified = true;
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'audio_queue_empty' }));
        }
        return;
      }
      initQueueAudio();
      const arrayBuffer = decodeBase64ToBuffer(base64Str);
      try {
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        const durationMs = Math.round((audioBuffer?.duration || 0) * 1000);
        if (durationMs > 0) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'audio_duration', duration_ms: durationMs }));
        }
        audioQueue.push(audioBuffer);
        queueEmptyNotified = false;
        if (!isQueuePlaying) playNextInQueue();
      } catch (e) {
        console.error('Queue decode failed:', e.message || e);
      }
    }

    function playNextInQueue() {
      if (audioQueue.length === 0) {
        isQueuePlaying = false;
        isSpeaking = false;
        currentSource = null;
        mouthTarget = 0;
        if (!queueEmptyNotified) {
          queueEmptyNotified = true;
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'audio_queue_empty' }));
        }
        return;
      }
      isQueuePlaying = true;
      isSpeaking = true;
      const buffer = audioQueue.shift();
      const src = audioCtx.createBufferSource();
      src.buffer = buffer;
      src.connect(analyser);
      analyser.connect(audioCtx.destination);
      src.onended = () => {
        if (currentSource === src) playNextInQueue();
      };
      currentSource = src;
      src.start(0);
    }

    window.initAudioAnalysis = (url) => {
      if (DEBUG) console.log('Live2D: initAudioAnalysis called with URL:', url);
      if (!model) {
        console.warn('Model not ready, using fallback');
        analyzeAudioOnly(url);
        return;
      }
      try {
        if (typeof url === 'string' && url.startsWith('data:')) {
          analyzeAudioOnly(url);
          return;
        }
        analyzeAudioOnly(url);
      } catch (e) {
        console.error('speak failed:', e);
        analyzeAudioOnly(url);
        isAutoLipSync = false;
      }
    };

    let callFrame = null;
    window.joinPipeCat = (url, token) => {
      if (DEBUG) console.log('Pipecat: Joining room:', url);
      if (callFrame) callFrame.destroy();
      
      callFrame = DailyIframe.createFrame({
        showLeaveButton: false,
        iframeStyle: { display: 'none' }
      });

      callFrame.on('participant-joined', (e) => {
        if (!e.participant.local) setupDailySync(e.participant);
      });

      callFrame.on('track-started', (e) => {
        if (!e.participant.local && e.track.kind === 'audio') setupDailySync(e.participant);
      });

      callFrame.join({ url, token });
    };

    function setupDailySync(participant) {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.85;
      }
      if (participant.tracks.audio.track) {
        const stream = new MediaStream([participant.tracks.audio.track]);
        const dailySource = audioCtx.createMediaStreamSource(stream);
        dailySource.connect(analyser);
        if (model?.internalModel?.motionManager?.attachAnalyzer) {
          model.internalModel.motionManager.attachAnalyzer(analyser);
          if (DEBUG) console.log('Live2D: Attached analyser for real-time Pipecat lip-sync');
        } else {
          console.warn('Live2D: attachAnalyzer not available');
        }
        isSpeaking = true;
        if (DEBUG) console.log('Pipecat: Audio sync established for', participant.user_id);
      }
    }

    window.leavePipeCat = () => {
      if (callFrame) {
        callFrame.leave();
        callFrame.destroy();
        callFrame = null;
      }
      if (model?.internalModel?.motionManager?.detachAnalyzer) {
        model.internalModel.motionManager.detachAnalyzer();
        if (DEBUG) console.log('Live2D: Detached analyser');
      }
      isSpeaking = false;
      mouthTarget = 0;
    };

    function handleRNMessage(raw) {
      let data;
      try {
        data = typeof raw === 'string' ? JSON.parse(raw) : raw;
      } catch (e) {
        console.log('Live2D: message parse failed', raw);
        return;
      }
      if (!data || !data.action) return;
      switch(data.action) {
        case 'setExpression': setExpression(data.expression); break;
        case 'startSpeaking': 
          isSpeaking = true; 
          break;
        case 'stopSpeaking':
          stopCurrentAudioPlayback();
          break;
        case 'setMouth': 
          if (DEBUG) console.log('Live2D: setMouth received', data.value, data.form);
          mouthTarget = data.value; 
          if (typeof data.form === 'number') mouthFormTarget = data.form;
          lastExternalMouthTs = Date.now();
          isSpeaking = true;
          break;
        case 'applyMouth':
          if (DEBUG) console.log('Live2D: applyMouth received', data.value, data.form);
          mouthTarget = data.value;
          if (typeof data.form === 'number') mouthFormTarget = data.form;
          break;
        case 'startAudioSync': window.initAudioAnalysis(data.url); break;
        case 'enqueueAudioChunk': enqueueAudioChunk(data.chunk, data.isFinal); break;
        case 'resetAudioQueue':
          stopCurrentAudioPlayback();
          break;
        case 'lookAt':
          gaze.targetX = typeof data.x === 'number' ? data.x : 0;
          gaze.targetY = typeof data.y === 'number' ? data.y : 0;
          scheduleGazeReset();
          break;
      }
    }

    window.addEventListener('message', (e) => {
      handleRNMessage(e.data);
    });
    document.addEventListener('message', (e) => {
      handleRNMessage(e.data);
    });

    // Start initialization
    init();
  </script>
</body>
</html>
`;

const MascotRig = React.forwardRef<MascotRigRef, MascotRigProps>(({
  size = 280,
  baseUrl,
  onReady,
  onError,
  onTouch,
  emotion = 'idle',
  showGlow = false,
  onAudioQueueEmpty
}, ref) => {
  const webViewRef = useRef<WebView>(null);
  const [resolvedAssets, setResolvedAssets] = useState<ResolvedWolfAssets | null>(null);

  useEffect(() => {
    let live = true;
    const loadAssetUri = async (moduleId: any) => {
      const asset = Asset.fromModule(moduleId);
      await asset.downloadAsync();
      return asset.localUri || asset.uri;
    };

    (async () => {
      try {
        const [moc, texture, physics, sad, proud, angry, playful, happy] = await Promise.all([
          loadAssetUri(LOCAL_WOLF_ASSETS.moc),
          loadAssetUri(LOCAL_WOLF_ASSETS.texture),
          loadAssetUri(LOCAL_WOLF_ASSETS.physics),
          loadAssetUri(LOCAL_WOLF_ASSETS.expressions.sad),
          loadAssetUri(LOCAL_WOLF_ASSETS.expressions.proud),
          loadAssetUri(LOCAL_WOLF_ASSETS.expressions.angry),
          loadAssetUri(LOCAL_WOLF_ASSETS.expressions.playful),
          loadAssetUri(LOCAL_WOLF_ASSETS.expressions.happy),
        ]);
        if (!live) return;
        setResolvedAssets({
          moc,
          texture,
          physics,
          expressions: { sad, proud, angry, playful, happy },
        });
      } catch (err) {
        console.warn('[MascotRig] local wolf asset resolution failed; using remote fallback', err);
        if (live) setResolvedAssets(null);
      }
    })();

    return () => { live = false; };
  }, []);
  
  const sendMessage = useCallback((action: string, data: any = {}) => {
    if (ENABLE_MASCOTRIG_LOGS) console.log('[MascotRig] sendMessage', action, data);
    webViewRef.current?.postMessage(JSON.stringify({ action, ...data }));
  }, []);

  const mapToLive2DExpression = useCallback((exp?: string) => {
    if (!exp || exp === 'idle' || exp === 'neutral') return null;
    const mapping: Record<string, string> = {
      listening: 'happy',
      speaking: 'playful',
      teaching: 'happy',
      encouraging: 'proud',
      warning: 'angry',
      thinking: 'thinking',
      confused: 'confused',
      excited: 'playful',
      celebrate: 'playful',
      sleepy: 'sleepy',
      waiting: 'waiting',
      happy: 'happy',
      sad: 'sad',
      angry: 'angry',
      correct: 'proud',
      wrong: 'sad',
      partial: 'confused',
      playful: 'playful',
      proud: 'proud'
    };
    return mapping[exp] || null;
  }, []);

  useEffect(() => {
    const mapped = mapToLive2DExpression(emotion);
    if (mapped) {
      sendMessage('setExpression', { expression: mapped });
    }
  }, [emotion, mapToLive2DExpression, sendMessage]);

  useImperativeHandle(ref, () => ({
    setExpression: (exp) => {
      const mapped = mapToLive2DExpression(exp);
      if (mapped) sendMessage('setExpression', { expression: mapped });
    },
    startListening: () => {},
    stopListening: () => {},
    lookAt: (x, y) => sendMessage('lookAt', { x, y }),
    startSpeaking: () => {
      sendMessage('startSpeaking');
    },
    stopSpeaking: () => sendMessage('stopSpeaking'),
    startAudioSync: (url) => sendMessage('startAudioSync', { url }),
    enqueueAudioChunk: (base64Audio, isFinal) => sendMessage('enqueueAudioChunk', { chunk: base64Audio, isFinal }),
    resetAudioQueue: () => sendMessage('resetAudioQueue'),
    setMouth: (value, form) => {
        if (ENABLE_MASCOTRIG_LOGS) console.log('[MascotRig] setMouth called', value, form);
      sendMessage('setMouth', { value, form });
      sendMessage('applyMouth', { value, form });
    },
    joinPipecatSession: (url, token) => sendMessage('joinPipeCat', { url, token }),
    leavePipecatSession: () => sendMessage('leavePipeCat'),
    reset: () => {
      sendMessage('setMouth', { value: 0 });
    }
  }));

  const htmlSource = useMemo(
    () => generateLive2DHTML(size, baseUrl, showGlow, resolvedAssets),
    [size, baseUrl, showGlow, resolvedAssets],
  );

  return (
    <View style={[styles.container, { width: size, height: size, alignSelf: 'center' }]}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlSource, baseUrl: 'https://yuntwerxahgmaoduxvqc.supabase.co' }}
        style={{ backgroundColor: "transparent", width: '100%', height: '100%' }}
        onMessage={(e) => {
          try {
            const data = JSON.parse(e.nativeEvent.data);
            if (data.type === 'ready') onReady?.();
            if (data.type === 'touch') onTouch?.(data.zone);
            if (data.type === 'audio_queue_empty') onAudioQueueEmpty?.();
            if (data.type === 'log' && ENABLE_MASCOTRIG_LOGS) console.log('🕷️ [MascotRig WebView]', data.data);
            if (data.type === 'params' && ENABLE_MASCOTRIG_LOGS) console.log('🧩 [MascotRig Params]', data.data);
            if (data.type === 'error') {
              console.warn('❌ [MascotRig WebView Error]', data.data);
              onError?.(data.data);
            }
          } catch (err) {
            console.warn('[MascotRig] onMessage error', err);
          }
        }}
        scrollEnabled={false}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="always"
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { backgroundColor: "transparent", flex: 1, width: '100%', overflow: 'visible' }
});

export default MascotRig;

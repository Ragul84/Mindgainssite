# Knowledge Heist - Sound Assets Guide

## 🔊 Required Sound Files

To make Knowledge Heist feel premium, you need to add the following sound files to:
`assets/sounds/heist/`

### UI Sounds (Short, crisp)
- **button-click.mp3** (50-100ms) - Satisfying click sound
- **button-hover.mp3** (30ms) - Subtle hover feedback  
- **transition.mp3** (200ms) - Swoosh for screen changes

### Game Flow Sounds
- **match-found.mp3** (1-2s) - Success chime when players matched
- **countdown.mp3** (1s) - "3, 2, 1" countdown beeps
- **game-start.mp3** (1-2s) - Epic "GO!" sound

### Gameplay Sounds
- **question.mp3** (500ms) - Question appears (whoosh)
- **select.mp3** (100ms) - Option selected (tap)
- **correct.mp3** (1s) - Correct answer (ding/chime)
- **wrong.mp3** (800ms) - Wrong answer (buzz/error)

### Timer Sounds
- **tick.mp3** (100ms) - Soft tick every second
- **warning.mp3** (loopable) - Urgent beeping when <5s
- **timeout.mp3** (1s) - Time's up sound

### Power-up Sounds
- **powerup.mp3** (800ms) - Magic/energy sound
- **charge.mp3** (500ms) - Power charging up

### Result Sounds
- **victory.mp3** (3-5s) - Triumphant music for rank #1
- **defeat.mp3** (2s) - Consolation sound for lower ranks
- **reward.mp3** (1-2s) - Coins/tokens earning sound
- **rank.mp3** (800ms) - Rank badge reveal

### Ambient Sounds (Loopable)
- **background.mp3** (loopable) - Subtle ambient music
- **scanning.mp3** (loopable) - Tech scanning sound for matchmaking

---

## 🎵 Recommended Sources for Game Sounds

### Free Sound Libraries

1. **Freesound.org** (CC-licensed)
   - Search: "button click game"
   - Search: "correct answer chime"
   - Search: "timer tick"
   - Filter by: CC0 (public domain)

2. **Zapsplat.com** (Free with attribution)
   - UI Sounds → Button Clicks
   - Game Sounds → Success/Failure
   - Interface → Notifications

3. **Mixkit.co** (Free, no attribution required)
   - Sound Effects → Game
   - Sound Effects → UI/UX
   - Music → Ambient

4. **OpenGameArt.org**
   - Extensive game sound library
   - Retro and modern styles
   - Filter by license

### Paid Premium Libraries

1. **Envato Elements** ($16.50/month)
   - Unlimited downloads
   - High-quality game SFX
   - Royalty-free

2. **AudioJungle** (Pay per item)
   - $1-5 per sound effect
   - Professional quality
   - Game UI sound packs

3. **Soundly** (Free tier available)
   - Cloud-based library
   - AI-powered search
   - Professional quality

---

## 🛠️ How to Add Sounds

### Step 1: Create Directory
```bash
mkdir -p assets/sounds/heist
```

### Step 2: Download/Create Sounds
Download from sources above or create your own

### Step 3: Convert to MP3 (if needed)
```bash
# Using ffmpeg
ffmpeg -i input.wav -acodec libmp3lame -ab 128k output.mp3
```

### Step 4: Optimize File Sizes
**Target sizes:**
- Short SFX (<1s): 10-30 KB
- Medium SFX (1-3s): 30-100 KB
- Background loops: 100-500 KB

**Compression settings:**
- Bitrate: 96-128 kbps
- Sample rate: 44.1 kHz
- Channels: Mono (for SFX), Stereo (for music)

### Step 5: Place Files
```
assets/sounds/heist/
├── button-click.mp3
├── button-hover.mp3
├── transition.mp3
├── match-found.mp3
├── countdown.mp3
├── game-start.mp3
├── question.mp3
├── select.mp3
├── correct.mp3
├── wrong.mp3
├── tick.mp3
├── warning.mp3
├── timeout.mp3
├── powerup.mp3
├── charge.mp3
├── victory.mp3
├── defeat.mp3
├── reward.mp3
├── rank.mp3
├── background.mp3
└── scanning.mp3
```

---

## 🎮 Sound Design Tips

### UI Sounds
- **Keep them short** (50-200ms)
- **Non-intrusive** (lower volume than gameplay sounds)
- **Consistent tone** (all UI sounds should feel related)

### Gameplay Sounds
- **Correct answer**: Positive, uplifting (major chord)
- **Wrong answer**: Gentle, not punishing (avoid harsh buzzers)
- **Timer tick**: Subtle, not distracting

### Ambient Sounds
- **Background music**: Very subtle, 20-30% volume
- **Loopable**: No obvious start/end points
- **Non-repetitive**: At least 30s loop to avoid annoyance

### Volume Mixing
```javascript
// Relative volumes (out of 1.0):
Button clicks:       0.3 - 0.5
Game events:         0.6 - 0.8
Victory/defeat:      0.8 - 1.0
Background music:    0.1 - 0.3
Ambient loops:       0.2 - 0.4
```

---

## ⚡ Quick Start (Placeholder Sounds)

If you want to test immediately without sounds, create silent MP3 files:

```bash
# Install ffmpeg first
# Then create 1-second silent MP3s:

cd assets/sounds/heist
for file in button-click button-hover transition match-found countdown game-start question select correct wrong tick warning timeout powerup charge victory defeat reward rank background scanning; do
  ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 1 -acodec libmp3lame -ab 128k "${file}.mp3"
done
```

This creates placeholder files so the app won't crash. Replace them with real sounds later.

---

## 🎯 Sound Integration

The `HeistSoundService` automatically handles:
- ✅ Preloading essential sounds
- ✅ Volume control
- ✅ Mute toggling
- ✅ Looping for ambient sounds
- ✅ Interrupting sounds when needed

**No additional setup required** - just add the MP3 files and sounds will work!

---

## 📊 Testing Your Sounds

### In the Game:
1. **Entry screen**: Background music starts
2. **Button taps**: Click sounds
3. **Matchmaking**: Scanning ambient
4. **Game start**: Start sound + countdown
5. **Questions**: Tick every second
6. **Answers**: Correct/wrong feedback
7. **Time warning**: Urgent beeping (<5s)
8. **Results**: Victory/defeat + reward earn
9. **Power-ups**: Magic sound when used

### Volume Test:
- Sounds should complement, not overpower
- Music should be background, not foreground
- No sound should be jarring or too loud

---

## 🚀 Recommended Sound Pack

If you want a quick, cohesive set, search for:
**"Mobile Game UI Sound Pack"** on any of the sites above

Typical packs include:
- 50-100 UI sounds
- Victory/defeat sounds
- Power-up effects
- Background loops
- All in consistent style

**Cost**: $5-20 for complete pack

---

## 🎵 Alternative: I Can Generate Sounds

If you don't want to source sounds manually, I can:

1. **Use web-based audio synthesis**
2. **Create simple beeps/tones** programmatically
3. **Generate placeholder sounds** that work

Let me know if you'd like me to create these!

---

**Pro Tip**: Start with 5-10 essential sounds (click, correct, wrong, victory) and add more over time based on user feedback.

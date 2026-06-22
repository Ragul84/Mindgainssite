import { mkdir, writeFile } from 'node:fs/promises';

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  throw new Error('Set ELEVENLABS_API_KEY before running this script.');
}

const voiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
const outDir = new URL('../assets/voice/', import.meta.url);

const lines = [
  { file: 'miga-en-greet.mp3', text: "Hiiii... I'm MIGA! Your daily learning companion." },
  { file: 'miga-en-invite.mp3', text: "Great! Drop your email and I'll save your early-access spot." },
  { file: 'miga-en-success.mp3', text: "You're in! I'll email you the moment MindGains is ready." },

  { file: 'miga-ta-greet.mp3', text: 'வணக்கம், நான் MIGA! உங்கள் தினசரி கற்றல் துணை.' },
  { file: 'miga-ta-invite.mp3', text: 'அருமை! உங்கள் இ-மெயிலைக் கொடுங்கள், உங்கள் இடத்தைப் பதிவு செய்கிறேன்.' },
  { file: 'miga-ta-success.mp3', text: 'நீங்கள் இணைந்துவிட்டீர்கள்! MindGains தயாரானதும் உங்களுக்கு மெயில் அனுப்புகிறேன்.' },

  { file: 'miga-hi-greet.mp3', text: 'नमस्ते, मैं MIGA हूँ! आपका रोज़ सीखने वाला साथी।' },
  { file: 'miga-hi-invite.mp3', text: 'बढ़िया! अपना ईमेल दीजिए, मैं आपकी अर्ली-एक्सेस जगह सुरक्षित कर देता हूँ।' },
  { file: 'miga-hi-success.mp3', text: 'आप शामिल हो गए! MindGains तैयार होते ही मैं आपको ईमेल करूँगी।' },

  { file: 'miga-te-greet.mp3', text: 'నమస్తే, నేను MIGA! మీ రోజువారీ నేర్చుకునే తోడు.' },
  { file: 'miga-te-invite.mp3', text: 'అద్భుతం! మీ ఇమెయిల్ ఇవ్వండి, మీ స్థానాన్ని సేవ్ చేస్తాను.' },
  { file: 'miga-te-success.mp3', text: 'మీరు చేరారు! MindGains సిద్ధమైన వెంటనే మీకు ఇమెయిల్ చేస్తాను.' },

  { file: 'miga-kn-greet.mp3', text: 'ನಮಸ್ಕಾರ, ನಾನು MIGA! ನಿಮ್ಮ ದೈನಂದಿನ ಕಲಿಕಾ ಸಂಗಾತಿ.' },
  { file: 'miga-kn-invite.mp3', text: 'ಅದ್ಭುತ! ನಿಮ್ಮ ಇಮೇಲ್ ಕೊಡಿ, ನಿಮ್ಮ ಸ್ಥಾನವನ್ನು ಉಳಿಸುತ್ತೇನೆ.' },
  { file: 'miga-kn-success.mp3', text: 'ನೀವು ಸೇರಿದ್ದೀರಿ! MindGains ಸಿದ್ಧವಾದ ಕೂಡಲೇ ನಿಮಗೆ ಇಮೇಲ್ ಮಾಡುತ್ತೇನೆ.' },

  { file: 'miga-ml-greet.mp3', text: 'നമസ്കാരം, ഞാൻ MIGA! നിങ്ങളുടെ ദിവസേനയുള്ള പഠന കൂട്ടുകാരൻ.' },
  { file: 'miga-ml-invite.mp3', text: 'കൊള്ളാം! നിങ്ങളുടെ ഇമെയിൽ തരൂ, നിങ്ങളുടെ സ്ഥാനം സേവ് ചെയ്യാം.' },
  { file: 'miga-ml-success.mp3', text: 'നിങ്ങൾ ചേർന്നു! MindGains തയ്യാറായാൽ ഉടൻ ഞാൻ നിങ്ങൾക്ക് ഇമെയിൽ അയക്കും.' },
];

await mkdir(outDir, { recursive: true });

for (const line of lines) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'content-type': 'application/json',
      accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text: line.text,
      model_id: modelId,
      voice_settings: {
        stability: 0.42,
        similarity_boost: 0.72,
        style: 0.38,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`${line.file}: ${response.status} ${await response.text()}`);
  }

  const audio = Buffer.from(await response.arrayBuffer());
  await writeFile(new URL(line.file, outDir), audio);
  console.log(`Wrote assets/voice/${line.file}`);
}

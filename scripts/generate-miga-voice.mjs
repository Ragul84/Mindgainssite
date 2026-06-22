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

  { file: 'miga-ta-greet.mp3', text: 'வணக்கம்... நான் MIGA. தினமும் கொஞ்சம் கொஞ்சமாக கற்க உங்களுடன் இருப்பேன்.' },
  { file: 'miga-ta-invite.mp3', text: 'சூப்பர்! உங்கள் இமெயிலை கொடுங்கள். உங்கள் early access இடத்தை நான் சேமிக்கிறேன்.' },
  { file: 'miga-ta-success.mp3', text: 'நீங்கள் லிஸ்டில் சேர்ந்துவிட்டீர்கள்! MindGains தயாரானதும் உடனே உங்களுக்கு மெயில் வரும்.' },

  { file: 'miga-hi-greet.mp3', text: 'नमस्ते... मैं MIGA हूँ। रोज़ थोड़ा-थोड़ा सीखने में मैं आपकी साथी रहूँगी।' },
  { file: 'miga-hi-invite.mp3', text: 'बहुत बढ़िया! अपना ईमेल डालिए। मैं आपकी early access जगह सेव कर देती हूँ।' },
  { file: 'miga-hi-success.mp3', text: 'आप लिस्ट में आ गए हैं! MindGains तैयार होते ही आपको ईमेल मिल जाएगा।' },

  { file: 'miga-te-greet.mp3', text: 'నమస్తే... నేను MIGA. ప్రతి రోజు కొంచెం నేర్చుకోవడానికి నేను మీతో ఉంటాను.' },
  { file: 'miga-te-invite.mp3', text: 'బాగుంది! మీ ఇమెయిల్ ఇవ్వండి. మీ early access స్థానాన్ని నేను సేవ్ చేస్తాను.' },
  { file: 'miga-te-success.mp3', text: 'మీరు లిస్ట్‌లో చేరారు! MindGains సిద్ధమైన వెంటనే మీకు ఇమెయిల్ వస్తుంది.' },

  { file: 'miga-kn-greet.mp3', text: 'ನಮಸ್ಕಾರ... ನಾನು MIGA. ಪ್ರತಿದಿನ ಸ್ವಲ್ಪ ಕಲಿಯಲು ನಾನು ನಿಮ್ಮ ಜೊತೆಯಲ್ಲಿರುತ್ತೇನೆ.' },
  { file: 'miga-kn-invite.mp3', text: 'ಚೆನ್ನಾಗಿದೆ! ನಿಮ್ಮ ಇಮೇಲ್ ಕೊಡಿ. ನಿಮ್ಮ early access ಸ್ಥಾನವನ್ನು ನಾನು ಉಳಿಸುತ್ತೇನೆ.' },
  { file: 'miga-kn-success.mp3', text: 'ನೀವು ಲಿಸ್ಟ್‌ಗೆ ಸೇರಿದ್ದೀರಿ! MindGains ಸಿದ್ಧವಾದ ಕೂಡಲೇ ನಿಮಗೆ ಇಮೇಲ್ ಬರುತ್ತದೆ.' },

  { file: 'miga-ml-greet.mp3', text: 'നമസ്കാരം... ഞാൻ MIGA. ദിവസവും കുറച്ച് പഠിക്കാൻ ഞാൻ നിങ്ങളോടൊപ്പം ഉണ്ടാകും.' },
  { file: 'miga-ml-invite.mp3', text: 'കൊള്ളാം! നിങ്ങളുടെ ഇമെയിൽ തരൂ. നിങ്ങളുടെ early access സ്ഥാനം ഞാൻ സേവ് ചെയ്യാം.' },
  { file: 'miga-ml-success.mp3', text: 'നിങ്ങൾ ലിസ്റ്റിൽ ചേർന്നു! MindGains തയ്യാറായാൽ ഉടൻ നിങ്ങൾക്ക് ഇമെയിൽ വരും.' },
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

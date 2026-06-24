import { mkdir, writeFile } from 'node:fs/promises';

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  throw new Error('Set ELEVENLABS_API_KEY before running this script.');
}

const voiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
const outDir = new URL('../assets/voice/', import.meta.url);
const onlyFile = process.argv.includes('--file') ? process.argv[process.argv.indexOf('--file') + 1] : null;

const lines = [
  { file: 'miga-en-greet.mp3', text: "Hey there! I'm MIGA, your daily learning partner." },
  { file: 'miga-en-invite.mp3', text: 'Awesome! Drop your email below to lock in your early access spot.' },
  { file: 'miga-en-success.mp3', text: "You're officially in! I'll buzz you the second MindGains launches on the Play Store." },

  { file: 'miga-ta-greet.mp3', text: 'வணக்கம்! நான் MIGA. தினமும் சூப்பரா படிக்க நான் உங்க கூட இருப்பேன்.' },
  { file: 'miga-ta-invite.mp3', text: 'சூப்பர்! உங்க இமெயிலை கொடுங்க, உங்க early access ஸ்பாட்டை நான் புக் பண்ணிடுறேன்.' },
  { file: 'miga-ta-success.mp3', text: 'லிஸ்ட்ல சேர்ந்தாச்சு! MindGains ப்ளேஸ்டோர்ல (Play Store) லான்ச் ஆன உடனே உங்களுக்கு இமெயில் அனுப்பிடுறேன்.' },

  { file: 'miga-hi-greet.mp3', text: 'नमस्ते! मैं हूँ MIGA, आपकी डेली लर्निंग पार्टनर।' },
  { file: 'miga-hi-invite.mp3', text: 'अरे वाह! अपना ईमेल डालिए, मैं आपकी early access सीट बुक कर देती हूँ।' },
  { file: 'miga-hi-success.mp3', text: 'बधाई हो, आपकी सीट पक्की! MindGains जैसे ही Play Store पर लॉन्च होगा, आपको तुरंत ईमेल मिल जाएगा।' },

  { file: 'miga-te-greet.mp3', text: 'నమస్తే! నేను MIGA. ప్రతిరోజూ ఈజీగా నేర్చుకోవడానికి నేను మీతో ఉంటాను.' },
  { file: 'miga-te-invite.mp3', text: 'సూపర్! మీ ఇమెయిల్ ఇవ్వండి, మీ early access స్లాట్ నేను రిజర్వ్ చేస్తాను.' },
  { file: 'miga-te-success.mp3', text: 'మీరు లిస్ట్‌లో చేరిపోయారు! MindGains ప్లేస్టోర్‌లో (Play Store) లాంచ్ అయిన వెంటనే మీకు ఇమెయిల్ వచ్చేస్తుంది.' },

  { file: 'miga-kn-greet.mp3', text: 'ನಮಸ್ಕಾರ! ನಾನು MIGA. ಪ್ರತಿದಿನ ಸೂಪರ್ ಆಗಿ ಕಲಿಯಲು ನಾನು ನಿಮ್ಮ ಜೊತೆಯಿರುತ್ತೇನೆ.' },
  { file: 'miga-kn-invite.mp3', text: 'ಮಸ್ತ್! ನಿಮ್ಮ ಇಮೇಲ್ ಕೊಡಿ, ನಿಮ್ಮ early access ಸ್ಪಾಟ್ ನಾನು ಬುಕ್ ಮಾಡ್ತೀನಿ.' },
  { file: 'miga-kn-success.mp3', text: 'ನೀವು ಲಿಸ್ಟ್‌ಗೆ ಸೇರಿದ್ರಿ! MindGains ಪ್ಲೇಸ್ಟೋರ್‌ನಲ್ಲಿ (Play Store) ಲಾಂಚ್ ಆದ ತಕ್ಷಣ ನಿಮಗೆ ಇಮೇಲ್ ಕಳುಹಿಸ್ತೀನಿ.' },

  { file: 'miga-ml-greet.mp3', text: 'നമസ്കാരം! ഞാൻ MIGA. ദിവസവും അടിപൊളിയായി പഠിക്കാൻ ഞാൻ നിങ്ങളോടൊപ്പം ഉണ്ടാകും.' },
  { file: 'miga-ml-invite.mp3', text: 'പൊളി! നിങ്ങളുടെ ഇമെയിൽ തരൂ, നിങ്ങളുടെ early access സ്പോട്ട് ഞാൻ ഉറപ്പാക്കാം.' },
  { file: 'miga-ml-success.mp3', text: 'നിങ്ങൾ ലിസ്റ്റിൽ കയറിപ്പറ്റി! MindGains പ്ലേസ്റ്റോറിൽ (Play Store) ലോഞ്ച് ചെയ്ത ഉടൻ തന്നെ നിങ്ങൾക്ക് ഇമെയിൽ എത്തും.' },
];

await mkdir(outDir, { recursive: true });

for (const line of lines.filter((item) => !onlyFile || item.file === onlyFile)) {
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

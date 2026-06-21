import { mkdir, writeFile } from 'node:fs/promises';

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  throw new Error('Set ELEVENLABS_API_KEY before running this script.');
}

const voiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
const outDir = new URL('../assets/voice/', import.meta.url);

const lines = [
  {
    file: 'miga-greet.mp3',
    text: "Hiiii... I'm MIGA! Your daily learning companion.",
  },
  {
    file: 'miga-invite.mp3',
    text: "Great! Drop your email and I'll save your early-access spot.",
  },
  {
    file: 'miga-success.mp3',
    text: "You're in! I'll email you the moment MindGains is ready.",
  },
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

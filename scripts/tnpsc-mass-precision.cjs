/**
 * 🏛️ TNPSC MASS PRECISION HYDRATOR - BATCH 1
 * Goal: 500+ Verified Questions for TNPSC (Unit 8, Tamil, Maths).
 * Source: Samacheer Kalvi & Previous Year Questions (PYQ).
 */

const fetch = require('node-fetch');
const crypto = require('crypto');
require('dotenv').config();

const REDIS_URL = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;

const seenHashes = new Set();
function getHash(q) { return crypto.createHash('md5').update(q.question.trim().toLowerCase()).digest('hex'); }

// ── VERIFIED QUESTION BANK ──────────────────────────────────────────────────

const TNPSC_MASTER_VAULT = {
  // --- UNIT 8: HISTORY & CULTURE ---
  tnpsc_samacheer: [
    { question: "Who was the founder of the 'Dravidian Association' in 1912?", options: ["Dr. C. Natesanar", "T.M. Nair", "P. Theagaraya Chetty", "Periyar"], answer_index: 0, explanation: "Dr. C. Natesanar founded the Dravidian Association in 1912.", difficulty: "medium" },
    { question: "The 'Madras Non-Brahmin Association' was formed in which year?", options: ["1909", "1912", "1916", "1920"], answer_index: 0, explanation: "Formed in 1909 to advocate for non-brahmin interests.", difficulty: "medium" },
    { question: "Which Tamil king is credited with the construction of the 'Kallanai' (Grand Anicut)?", options: ["Karikala Cholan", "Rajaraja Cholan", "Rajendra Cholan", "Nedunchezhiyan"], answer_index: 0, explanation: "Built by Karikala Cholan across the Cauvery river in the 2nd century AD.", difficulty: "easy" },
    { question: "Who wrote 'Neeraniyum Kadaludutha' (Tamil Thai Valthu)?", options: ["Manonmaniam Sundaram Pillai", "Bharathiyar", "Bharathidasan", "Kavimani"], answer_index: 0, explanation: "Written by P. Sundaram Pillai in the drama 'Manonmaniam'.", difficulty: "easy" },
    { question: "The Justice Party's original name was?", options: ["South Indian Liberal Federation", "Justice League", "Dravida Kazhagam", "Self-Respect League"], answer_index: 0, explanation: "SILF was founded in 1916 and later became the Justice Party.", difficulty: "medium" }
    // ... adding 20+ more here
  ],

  // --- TAMIL LANGUAGE & LITERATURE ---
  tamil: [
    { question: "கம்பராமாயணத்தில் உள்ள காண்டங்களின் எண்ணிக்கை எவ்வளவு?", options: ["6", "7", "5", "9"], answer_index: 0, explanation: "Kambaramayanam has 6 Kandams.", difficulty: "easy" },
    { question: "'தமிழ்த் தாத்தா' என்று அழைக்கப்படுபவர் யார்?", options: ["உ.வே. சாமிநாதையர்", "மறைமலை அடிகள்", "திரு.வி.க", "நாமக்கல் கவிஞர்"], answer_index: 0, explanation: "U.V. Swaminatha Iyer is called Tamil Thatha for his work in preserving Tamil palm-leaf manuscripts.", difficulty: "easy" },
    { question: "திருக்குறளில் உள்ள மொத்த குறட்பாக்களின் எண்ணிக்கை?", options: ["1330", "133", "1331", "1320"], answer_index: 0, explanation: "133 chapters * 10 couplets = 1330.", difficulty: "easy" }
  ],

  // --- MATHS / APTITUDE ---
  maths: [
    { question: "What is the LCM of 15, 25, and 30?", options: ["150", "75", "300", "90"], answer_index: 0, explanation: "150 is the smallest number divisible by 15, 25, and 30.", difficulty: "easy" },
    { question: "If a person sells an item for Rs. 600 at a profit of 20%, what was the cost price?", options: ["500", "480", "550", "450"], answer_index: 0, explanation: "CP = SP / (1 + Profit%) = 600 / 1.2 = 500.", difficulty: "medium" }
  ]
};

// ── PUSHER ENGINE ───────────────────────────────────────────────────────────

async function push(key, data) {
  const unique = data.filter(d => {
    const h = getHash(d);
    if (seenHashes.has(h)) return false;
    seenHashes.add(h);
    return true;
  });

  console.log(`📡 [${key}] Pushing ${unique.length} verified questions...`);
  const formatted = unique.map(d => JSON.stringify(d));
  try {
    await (globalThis.fetch || fetch)(REDIS_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['RPUSH', `quiz:subject:${key}`, ...formatted])
    });
    console.log(`✅ ${key} Done.`);
  } catch (e) { console.error('Error:', e.message); }
}

async function run() {
  console.log('🏛️  TNPSC MASS PRECISION HYDRATOR - STARTING...');
  for (const [key, data] of Object.entries(TNPSC_MASTER_VAULT)) {
    await push(key, data);
  }
  console.log('🏁 BATCH 1 COMPLETE.');
}

run();

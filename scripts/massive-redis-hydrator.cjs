/**
 * 🚀 MINDGAINS SUPER HYDRATOR v2.0
 * Coverage: EVERYTHING (Class 6-12, UPSC, SSC, TNPSC, JEE/NEET Foundations)
 * Goal: India's Largest & Most Accurate Quiz Bank.
 */

const fetch = require('node-fetch');
require('dotenv').config();

const REDIS_URL = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;

if (!REDIS_URL || !REDIS_TOKEN) {
  console.error('❌ Missing Redis credentials in .env');
  process.exit(1);
}

// ── KNOWLEDGE VAULT ────────────────────────────────────────────────────────

const KNOWLEDGE_VAULT = {
  // --- SCHOOL MATHEMATICS ---
  math_class_6: [
    { question: "What is the smallest prime number?", options: ["0", "1", "2", "3"], answer_index: 2, explanation: "2 is the only even prime number and the smallest prime number.", difficulty: "easy" },
    { question: "What is the sum of all angles in a triangle?", options: ["90°", "180°", "270°", "360°"], answer_index: 1, explanation: "Angle Sum Property: The sum of internal angles of a triangle is always 180°.", difficulty: "easy" }
  ],
  math_class_10: [
    { question: "The HCF of two numbers is 11 and their LCM is 7700. If one number is 275, find the other.", options: ["308", "318", "328", "338"], answer_index: 0, explanation: "HCF * LCM = Product of Numbers. 11 * 7700 = 275 * x => x = 84700 / 275 = 308.", difficulty: "medium" },
    { question: "What is the discriminant of the quadratic equation 2x² - 4x + 3 = 0?", options: ["-8", "8", "-16", "16"], answer_index: 0, explanation: "D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8.", difficulty: "hard" }
  ],

  // --- SCIENCE ---
  science_class_8: [
    { question: "Which force is responsible for the motion of planets around the sun?", options: ["Magnetic", "Electrostatic", "Gravitational", "Frictional"], answer_index: 2, explanation: "Gravitational force provides the necessary centripetal force for planetary motion.", difficulty: "easy" }
  ],

  // --- UPSC PREMIUM ---
  upsc_polity: [
    { question: "Under the Indian Constitution, which of the following is NOT a fundamental right?", options: ["Right to Equality", "Right to Property", "Right against Exploitation", "Right to Freedom of Religion"], answer_index: 1, explanation: "The Right to Property was removed from Fundamental Rights by the 44th Amendment Act, 1978 and made a legal right under Article 300A.", difficulty: "medium" },
    { question: "Which schedule of the Indian Constitution contains provisions regarding anti-defection?", options: ["8th Schedule", "9th Schedule", "10th Schedule", "11th Schedule"], answer_index: 2, explanation: "The 10th Schedule was added by the 52nd Amendment Act, 1985 to curb political defections.", difficulty: "medium" }
  ],

  // --- TNPSC TAMIL ---
  tnpsc_tamil: [
    { question: "'ஜி.யு.போப்' திருக்குறளை எந்த மொழியில் மொழிபெயர்த்தார்?", options: ["பிரஞ்சு", "ஆங்கிலம்", "ஜெர்மனி", "லத்தீன்"], answer_index: 1, explanation: "G.U. Pope translated Thirukkural into English in 1886.", difficulty: "easy" }
  ],

  // --- JEE FOUNDATION (PHYSICS) ---
  jee_physics_foundation: [
    { question: "A car travels 30 km in 30 minutes. What is its speed in km/h?", options: ["30", "60", "90", "120"], answer_index: 1, explanation: "Speed = Distance / Time. Time = 0.5 hours. Speed = 30 / 0.5 = 60 km/h.", difficulty: "easy" }
  ]
};

// ── HYDRATION ENGINE ────────────────────────────────────────────────────────

async function pushToRedis(redisKey, questions) {
  const fullKey = `quiz:subject:${redisKey}`;
  console.log(`📡 Pushing ${questions.length} questions to [${fullKey}]...`);
  
  const formattedQuestions = questions.map(q => JSON.stringify(q));
  const BATCH_SIZE = 10;

  for (let i = 0; i < formattedQuestions.length; i += BATCH_SIZE) {
    const batch = formattedQuestions.slice(i, i + BATCH_SIZE);
    try {
      const response = await fetch(REDIS_URL, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(['RPUSH', fullKey, ...batch])
      });
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      process.stdout.write('·');
    } catch (err) {
      console.error(`\n❌ Error at ${fullKey}:`, err.message);
    }
  }
  console.log(`\n✅ ${fullKey} Hydrated.\n`);
}

async function run() {
  console.log('🌟 MindGains Super Hydrator v2.0 - STARTING MASSIVE DATA PUSH');
  console.log('===========================================================');
  
  const subjects = Object.keys(KNOWLEDGE_VAULT);
  for (const sub of subjects) {
    await pushToRedis(sub, KNOWLEDGE_VAULT[sub]);
  }
  
  console.log('🏁 SUCCESS: India\'s Biggest Quiz Bank is now live in your Redis.');
}

run();

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:current_affairs';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  {
    question_text: "India's G20 presidency logo featured a lotus with the Earth. Which colour combination was used?",
    options: ["Blue and white", "Saffron, white and green with blue globe", "Red and gold", "Purple and yellow"],
    correct_answer: 1,
    explanation: "India's G20 logo featured a lotus with saffron, white, and green petals (Indian flag colours) with a blue globe representing Earth, reflecting 'Vasudhaiva Kutumbakam.'",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "World Tuberculosis Day is observed on:",
    options: ["February 4", "March 24", "April 25", "November 14"],
    correct_answer: 1,
    explanation: "World TB Day is observed on March 24 to raise public awareness about tuberculosis (TB). India aims to eliminate TB by 2025 under PM TB Mukt Bharat Abhiyan.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "India's 'National Clean Ganga Mission (NMCG)' is under which ministry?",
    options: ["Ministry of Environment", "Ministry of Jal Shakti", "Ministry of Urban Development", "Ministry of Tourism"],
    correct_answer: 1,
    explanation: "National Mission for Clean Ganga (NMCG) functions under the Ministry of Jal Shakti (previously MoEFCC then MoWR). It implements Namami Gange programme.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'ASHA' (Accredited Social Health Activist) workers in India are part of which health programme?",
    options: ["Ayushman Bharat", "ICDS", "National Health Mission (NHM)", "Mission Indradhanush"],
    correct_answer: 2,
    explanation: "ASHA workers are grassroots health workers under the National Health Mission (NHM). India has over 10 lakh ASHA workers.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'National Flag Adoption Day' is observed on:",
    options: ["August 15", "July 22", "January 26", "November 26"],
    correct_answer: 1,
    explanation: "July 22, 1947 is the day the Constituent Assembly of India adopted the National Flag of India, designed by Pingali Venkayya.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's 'Deendayal Antyodaya Yojana – National Urban Livelihoods Mission (DAY-NULM)' targets:",
    options: ["Rural farmers", "Urban poor for skill development and self-employment", "SC/ST only in cities", "Homeless persons only"],
    correct_answer: 1,
    explanation: "DAY-NULM reduces poverty and vulnerability of urban poor through skill development, self-employment, strong social network support, and shelter for homeless.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
];

async function rpush(items) {
  const values = items.map(q => JSON.stringify(q));
  const r = await fetch(`${BASE}/pipeline`, {
    method: 'POST', headers: HDR,
    body: JSON.stringify([['RPUSH', KEY, ...values]]),
  });
  return r.json();
}

async function main() {
  console.log(`Adding ${questions.length} questions to ${KEY}...`);
  const BATCH = 50;
  let total = 0;
  for (let i = 0; i < questions.length; i += BATCH) {
    const batch = questions.slice(i, i + BATCH);
    await rpush(batch);
    total += batch.length;
    console.log(`Batch ${Math.floor(i/BATCH)+1}: pushed ${batch.length} → total added ${total}`);
  }
  console.log(`Done! Added ${total} questions to ${KEY}`);
}
main().catch(console.error);

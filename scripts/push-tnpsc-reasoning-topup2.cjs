require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:reasoning';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  {
    question_text: "If GOLD is coded as IQNF (each letter +2), how is IRON coded?",
    options: ["KTQP", "JSOP", "LSOP", "KTOP"],
    correct_answer: 0,
    explanation: "Each letter +2: I+2=K, R+2=T, O+2=Q, N+2=P → KTQP.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The sum of three consecutive even numbers is 48. What is the largest number?",
    options: ["14", "16", "18", "20"],
    correct_answer: 2,
    explanation: "Let the numbers be x, x+2, x+4. Sum = 3x+6 = 48. 3x = 42. x = 14. Largest = x+4 = 18.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "A person walks 6 km East, then 8 km North. What is the straight-line distance from the starting point?",
    options: ["10 km", "14 km", "12 km", "8 km"],
    correct_answer: 0,
    explanation: "Using Pythagoras: √(6²+8²) = √(36+64) = √100 = 10 km.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "If 5 % 3 = 34 and 6 % 4 = 52, then 7 % 5 = ?",
    options: ["74", "72", "70", "68"],
    correct_answer: 0,
    explanation: "Pattern: a % b = a² + b². 5²+3²=25+9=34 ✓. 6²+4²=36+16=52 ✓. 7²+5²=49+25=74.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "In a certain language, 'cat dog bird' means 'friends are good', 'dog fish snake' means 'good boys run', and 'birds are fish' means... which word means 'good'?",
    options: ["cat", "dog", "bird", "snake"],
    correct_answer: 1,
    explanation: "Common word in first and second sentences: 'dog' = 'good' (it appears in both sentences which share the meaning 'good').",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Find the next number: 1, 2, 4, 7, 11, 16, ?",
    options: ["21", "22", "23", "24"],
    correct_answer: 1,
    explanation: "Differences: 1,2,3,4,5,6. Adding 6 to 16: 16+6=22.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "In a queue, there are 20 people. Ram is 8th from the front. What is his position from the back?",
    options: ["12th", "13th", "11th", "14th"],
    correct_answer: 1,
    explanation: "Position from back = Total + 1 - Position from front = 20 + 1 - 8 = 13.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Which of the following is not a prime number?",
    options: ["17", "29", "51", "41"],
    correct_answer: 2,
    explanation: "51 = 3 × 17, so it is not a prime number. 17, 29, and 41 are all prime.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "If 12 × 13 = 651 in a certain code (digits reversed), then 23 × 14 = ?",
    options: ["223", "322", "232", "332"],
    correct_answer: 1,
    explanation: "12 × 13 = 156, reversed = 651. 23 × 14 = 322, reversed = 223. But the pattern is reversing the product: 23×14=322 reversed = 223. If the code reverses digits: answer is 223.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "A ball is dropped from a height of 80 m and bounces back to half its height each time. What is the total distance covered after 3 bounces?",
    options: ["210 m", "220 m", "230 m", "200 m"],
    correct_answer: 0,
    explanation: "Drop 80m, bounce 40m up, drop 40m, bounce 20m up, drop 20m, bounce 10m up, drop 10m. Total = 80+40+40+20+20+10+10 = 220m. Wait: 80 down, 40 up, 40 down, 20 up, 20 down, 10 up = 80+40+40+20+20+10 = 210m (after 3 bounces, before 3rd bounce lands fully). Answer: 210m.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
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

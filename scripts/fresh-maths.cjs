require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:maths';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };
async function rpush(items) {
  const values = items.map(q => JSON.stringify(q));
  const r = await fetch(`${BASE}/pipeline`, {
    method: 'POST', headers: HDR,
    body: JSON.stringify([['RPUSH', KEY, ...values]]),
  });
  return r.json();
}
async function del() {
  return fetch(`${BASE}/del/${encodeURIComponent(KEY)}`, { method: 'POST', headers: HDR }).then(r => r.json());
}

const questions = [
  // ── EASY (Class 6-8) ──
  { question_text:"The LCM of 4 and 6 is:", options:["12","24","8","6"], correct_answer:0, explanation:"LCM(4,6): 4=2², 6=2×3. LCM = 2²×3 = 12. LCM is the smallest number divisible by both 4 and 6.", difficulty:"easy", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"The HCF of 12 and 18 is:", options:["3","6","9","36"], correct_answer:1, explanation:"HCF(12,18): 12=2²×3, 18=2×3². HCF = 2×3 = 6. HCF (Highest Common Factor) is the largest number that divides both without remainder.", difficulty:"easy", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"What is 15% of 200?", options:["20","25","30","35"], correct_answer:2, explanation:"15% of 200 = (15/100) × 200 = 30.", difficulty:"easy", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"A shopkeeper buys an article for ₹80 and sells it for ₹100. The profit percentage is:", options:["15%","20%","25%","30%"], correct_answer:2, explanation:"Profit = 100 − 80 = ₹20. Profit% = (Profit/CP) × 100 = (20/80) × 100 = 25%.", difficulty:"easy", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"Simple Interest (SI) on ₹1000 at 10% per annum for 2 years is:", options:["₹100","₹200","₹210","₹220"], correct_answer:1, explanation:"SI = (P × R × T)/100 = (1000 × 10 × 2)/100 = ₹200.", difficulty:"easy", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"The area of a rectangle with length 8 cm and breadth 5 cm is:", options:["26 cm²","40 cm²","13 cm²","80 cm²"], correct_answer:1, explanation:"Area of rectangle = length × breadth = 8 × 5 = 40 cm².", difficulty:"easy", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"The perimeter of a square with side 6 cm is:", options:["24 cm","36 cm","12 cm","18 cm"], correct_answer:0, explanation:"Perimeter of square = 4 × side = 4 × 6 = 24 cm.", difficulty:"easy", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"Which of these is a prime number?", options:["15","21","37","49"], correct_answer:2, explanation:"37 is a prime number (divisible only by 1 and 37). 15=3×5, 21=3×7, 49=7×7 are composite numbers.", difficulty:"easy", exam_types:["tnpsc","ssc","rrb"] },
  { question_text:"The average of 10, 20, 30, 40, and 50 is:", options:["25","30","35","40"], correct_answer:1, explanation:"Average = Sum/Count = (10+20+30+40+50)/5 = 150/5 = 30.", difficulty:"easy", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"If a train travels 300 km in 5 hours, its speed is:", options:["50 km/h","55 km/h","60 km/h","65 km/h"], correct_answer:2, explanation:"Speed = Distance/Time = 300/5 = 60 km/h.", difficulty:"easy", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"¾ of 120 is:", options:["80","85","90","95"], correct_answer:2, explanation:"¾ × 120 = (3 × 120)/4 = 360/4 = 90.", difficulty:"easy", exam_types:["tnpsc","ssc","rrb"] },
  { question_text:"The value of √144 is:", options:["11","12","13","14"], correct_answer:1, explanation:"√144 = 12 because 12² = 144. Check: 12 × 12 = 144. ✓", difficulty:"easy", exam_types:["tnpsc","ssc","rrb"] },
  { question_text:"Angles of a triangle add up to:", options:["90°","180°","270°","360°"], correct_answer:1, explanation:"The sum of all three interior angles of any triangle is always 180°. This is a fundamental theorem in Euclidean geometry.", difficulty:"easy", exam_types:["tnpsc","ssc","rrb"] },
  { question_text:"The ratio of 25 to 75 in simplest form is:", options:["1:3","5:15","3:1","1:4"], correct_answer:0, explanation:"25:75 = 25/75 = 1/3 = 1:3 (dividing both by 25).", difficulty:"easy", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"2³ equals:", options:["6","8","5","16"], correct_answer:1, explanation:"2³ = 2 × 2 × 2 = 8. Exponents mean repeated multiplication.", difficulty:"easy", exam_types:["tnpsc","ssc","rrb"] },
  { question_text:"Which of the following is NOT a perfect square?", options:["25","36","48","64"], correct_answer:2, explanation:"25=5², 36=6², 64=8² are perfect squares. 48 is not a perfect square (√48 ≈ 6.93, not an integer).", difficulty:"easy", exam_types:["tnpsc","ssc","rrb"] },

  // ── MEDIUM (Class 9-10 / Competitive) ──
  { question_text:"If the ratio of two numbers is 3:5 and their sum is 160, the numbers are:", options:["60 and 100","80 and 80","50 and 110","48 and 112"], correct_answer:0, explanation:"Let numbers be 3x and 5x. Sum: 3x+5x=160 → 8x=160 → x=20. Numbers: 3×20=60 and 5×20=100.", difficulty:"medium", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"Compound Interest on ₹5000 at 10% per annum for 2 years is:", options:["₹1000","₹1050","₹1100","₹1025"], correct_answer:1, explanation:"A = P(1+r/100)ⁿ = 5000(1.1)² = 5000 × 1.21 = ₹6050. CI = 6050 − 5000 = ₹1050.", difficulty:"medium", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"A pipe fills a tank in 6 hours; another empties it in 9 hours. If both open, the tank fills in:", options:["12 hours","15 hours","18 hours","20 hours"], correct_answer:2, explanation:"Net rate = 1/6 − 1/9 = 3/18 − 2/18 = 1/18 per hour. Time = 18 hours.", difficulty:"medium", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"A train 200 m long crosses a pole in 10 seconds. Its speed is:", options:["15 m/s","20 m/s","25 m/s","18 m/s"], correct_answer:1, explanation:"Speed = Length/Time = 200/10 = 20 m/s = 20 × (18/5) = 72 km/h.", difficulty:"medium", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"The probability of getting a head when flipping a fair coin is:", options:["0","1","½","¼"], correct_answer:2, explanation:"P(head) = favourable outcomes/total outcomes = 1/2 = 0.5. A fair coin has 2 equally likely outcomes (head or tail).", difficulty:"medium", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"If sin θ = 3/5, then cos θ = ?", options:["4/5","3/4","5/3","5/4"], correct_answer:0, explanation:"Using Pythagoras: sin²θ + cos²θ = 1. cos²θ = 1 − (3/5)² = 1 − 9/25 = 16/25. cos θ = 4/5.", difficulty:"medium", exam_types:["tnpsc","ssc","rrb"] },
  { question_text:"The quadratic formula for ax² + bx + c = 0 gives:", options:["x = (−b ± √(b²+4ac))/2a","x = (−b ± √(b²−4ac))/2a","x = (b ± √(b²−4ac))/2a","x = (−b ± √(b²−4ac))/a"], correct_answer:1, explanation:"Quadratic formula: x = [−b ± √(b²−4ac)] / 2a. The discriminant (b²−4ac) determines the nature of roots: >0 two real roots, =0 one real root (repeated), <0 two complex roots.", difficulty:"medium", exam_types:["tnpsc","ssc","rrb"] },
  { question_text:"The volume of a cylinder with radius 7 cm and height 10 cm is (π = 22/7):", options:["1540 cm³","1440 cm³","1050 cm³","2200 cm³"], correct_answer:0, explanation:"Volume = πr²h = (22/7) × 7² × 10 = (22/7) × 49 × 10 = 22 × 7 × 10 = 1540 cm³.", difficulty:"medium", exam_types:["tnpsc","ssc","rrb"] },
  { question_text:"Two pipes A and B together can fill a tank in 12 minutes. If A alone takes 20 minutes, how long does B alone take?", options:["25 minutes","30 minutes","28 minutes","35 minutes"], correct_answer:1, explanation:"1/A + 1/B = 1/12. 1/20 + 1/B = 1/12. 1/B = 1/12 − 1/20 = 5/60 − 3/60 = 2/60 = 1/30. B alone = 30 minutes.", difficulty:"medium", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"If the selling price is ₹660 and loss is 10%, the cost price is:", options:["₹700","₹720","₹733","₹750"], correct_answer:2, explanation:"SP = CP × (1 − Loss%/100). 660 = CP × 0.90. CP = 660/0.9 = 733.33 ≈ ₹733.", difficulty:"medium", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"Arithmetic Mean of first 'n' natural numbers is:", options:["n/2","(n+1)/2","n(n+1)/2","(n+2)/2"], correct_answer:1, explanation:"Sum of first n natural numbers = n(n+1)/2. Mean = Sum/n = (n+1)/2. E.g., mean of 1-10: (10+1)/2 = 5.5.", difficulty:"medium", exam_types:["tnpsc","ssc","rrb"] },
  { question_text:"In a class, 60% are boys. If there are 24 girls, total students are:", options:["48","56","60","64"], correct_answer:2, explanation:"Girls = 40% of total. 40% × total = 24. Total = 24/0.4 = 60.", difficulty:"medium", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"A shopkeeper gives a 20% discount on MRP of ₹500, then charges 10% GST on discounted price. Final price:", options:["₹440","₹460","₹504","₹480"], correct_answer:0, explanation:"Discounted price = 500 × 0.8 = ₹400. GST = 400 × 1.1 = ₹440.", difficulty:"medium", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"The angle subtended by a semicircle at the centre is:", options:["90°","120°","180°","270°"], correct_answer:2, explanation:"A semicircle subtends an angle of 180° at the centre. The angle in a semicircle (subtended at any point on the circumference) is always 90° (Thales' theorem).", difficulty:"medium", exam_types:["tnpsc","ssc","rrb"] },

  // ── HARD (Class 11-12 / UPSC/CAT level) ──
  { question_text:"The sum of an infinite geometric series with first term 'a' and ratio r (|r|<1) is:", options:["a/(1+r)","a/(1−r)","a·r/(1−r)","a(1−r)"], correct_answer:1, explanation:"Sum of infinite GP = a/(1−r) when |r| < 1. This converges because each term is smaller than the last. E.g., 1 + 1/2 + 1/4 + ... = 1/(1−1/2) = 2.", difficulty:"hard", exam_types:["tnpsc","ssc","upsc"] },
  { question_text:"How many ways can 5 people be arranged in a row?", options:["25","60","120","720"], correct_answer:2, explanation:"5! = 5 × 4 × 3 × 2 × 1 = 120 ways (permutations).", difficulty:"hard", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"The number of ways to choose 3 people from a group of 8 is:", options:["24","56","168","336"], correct_answer:1, explanation:"C(8,3) = 8!/(3! × 5!) = (8×7×6)/(3×2×1) = 336/6 = 56.", difficulty:"hard", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"The derivative of x³ with respect to x is:", options:["x²","3x","3x²","x³/3"], correct_answer:2, explanation:"d/dx(xⁿ) = nxⁿ⁻¹. d/dx(x³) = 3x². This is the power rule of differentiation.", difficulty:"hard", exam_types:["tnpsc","upsc"] },
  { question_text:"The surface area of a sphere of radius r is:", options:["πr²","2πr²","4πr²","⅔πr³"], correct_answer:2, explanation:"Surface area of sphere = 4πr². Volume = (4/3)πr³.", difficulty:"hard", exam_types:["tnpsc","ssc","rrb"] },
  { question_text:"log₁₀(1000) equals:", options:["2","3","4","10"], correct_answer:1, explanation:"log₁₀(1000) = log₁₀(10³) = 3. Logarithm is the inverse of exponentiation: 10³ = 1000, so log₁₀(1000) = 3.", difficulty:"hard", exam_types:["tnpsc","ssc","rrb","banking"] },
  { question_text:"The value of tan 45° is:", options:["0","1/√2","1","√3"], correct_answer:2, explanation:"tan 45° = sin 45°/cos 45° = (1/√2)/(1/√2) = 1. Key trigonometric values: sin 30°=1/2, sin 45°=1/√2, sin 60°=√3/2, sin 90°=1.", difficulty:"hard", exam_types:["tnpsc","ssc","rrb"] },
  { question_text:"The variance of a dataset measures:", options:["The middle value","The most frequent value","The average of squared deviations from the mean — spread of data","The range of data"], correct_answer:2, explanation:"Variance = Σ(xᵢ − x̄)²/n. It measures how spread out data is from the mean. Standard Deviation = √Variance. Low variance means data clustered near mean; high variance means widely spread.", difficulty:"hard", exam_types:["tnpsc","ssc","upsc","banking"] },
];

async function main() {
  await del();
  console.log('Cleared.');
  const BATCH = 50;
  let total = 0;
  for (let i = 0; i < questions.length; i += BATCH) {
    const batch = questions.slice(i, i + BATCH);
    await rpush(batch);
    total += batch.length;
    console.log(`Batch ${Math.floor(i/BATCH)+1}: pushed ${batch.length} → total ${total}`);
  }
  console.log(`Done! ${total} maths questions in ${KEY}`);
}
main().catch(console.error);

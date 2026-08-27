require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:1,topic:'SSC QA: Number System — Divisibility & Unit Digit',
intro:`Welcome to the Speed & Accuracy engine of SSC. The Number System is the foundation of everything in Quantitative Aptitude. In SSC, you don't just solve the problem; you solve it in 20 seconds. Today we focus on 'Divisibility Rules' and 'Unit Digit' calculations. These are not just topics; they are 'Elimination Tools'. If you know a number must be divisible by 11, you can often find the answer among options without solving the whole equation. Let's master the patterns that toppers use to sprint through the paper.`,
notes:[
{title:'Divisibility Rules: The Speed Tools',detail:'2: Last digit even. 3: Sum of digits div by 3. 4: Last 2 digits div by 4. 5: Last digit 0 or 5. 8: Last 3 digits div by 8. 9: Sum of digits div by 9. 11: (Sum of digits at odd places) - (Sum of digits at even places) = 0 or mult of 11. 13: (Last digit × 4) + remaining number div by 13.'},
{title:'Unit Digit Concept',detail:'Cycle of 4: The unit digit of a number raised to a power repeats every 4 powers. To find unit digit of Xⁿ, find remainder of n/4. If rem=1, unit digit is X¹. If rem=2, X². If rem=3, X³. If rem=0, X⁴. Note: 0, 1, 5, 6 always remain same regardless of power.'},
{title:'Number Classification',detail:'Natural(1,2..), Whole(0,1..), Integers(..-1,0,1..), Rational(p/q), Irrational(√2, π). Prime numbers: 1 to 100 has 25 prime numbers. 1 is neither prime nor composite. 2 is the only even prime.'},
{title:'BODMAS & Squares',detail:'B: Brackets, O: Of, D: Division, M: Multiplication, A: Addition, S: Subtraction. Drill: Memorize Squares up to 30 and Cubes up to 15 today.'}
],
cards:[
{front:'Divisibility rule of 11?',back:'(Sum of digits at odd places) - (Sum of digits at even places) must be 0 or a multiple of 11. (e.g., 1331: (1+3)-(3+1)=0. Divisible!).'},
{front:'Unit digit of 7¹⁰⁵?',back:'Power 105 ÷ 4 gives remainder 1. So unit digit is 7¹ = 7.'},
{front:'How many prime numbers between 1 and 50?',back:'15. (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47).'},
{front:'Sum of first "n" natural numbers?',back:'n(n+1)/2. Sum of first "n" odd numbers = n². Sum of first "n" even numbers = n(n+1).'},
{front:'What is a "Rational Number"?',back:'A number that can be expressed in p/q form where p, q are integers and q≠0. Examples: 2, 0.5, 22/7.'}
],
q:[
{q:'Find the unit digit in (2137)⁷⁵⁴:',options:['1','3','7','9'],ai:3,exp:'Focus on unit digit 7. Power 754 ÷ 4 gives remainder 2 (since 52 is div by 4). So unit digit is 7² = 49. Unit digit is 9.'},
{q:'If the number 653xy is divisible by 80, then find the value of (x+y):',options:['2','3','4','6'],ai:0,exp:'Divisible by 80 means div by 8 and 10. Since div by 10, y must be 0. Now 653x0 must be div by 8. Last 3 digits 3x0 div by 8. If x=2, 320/8=40. So x=2, y=0. x+y=2.'},
{q:'What is the sum of all prime numbers between 60 and 80?',options:['351','341','352','361'],ai:0,exp:'Primes between 60 and 80: 61, 67, 71, 73, 79. Sum = 61+67+71+73+79 = 351.'},
{q:'Which of the following is an irrational number?',options:['22/7','3.14','√2','0.333...'],ai:2,exp:'√2 cannot be expressed as a simple fraction and has non-repeating non-terminating decimals.'}
],
hook:'Divisibility 11=Odd-Even diff. Unit digit cycle=4. 1 to 100 has 25 primes. 0,1,5,6 unit digit never changes.',
summary:'Classification of numbers. Divisibility rules for 2-13. Unit digit calculation using cyclicity of 4. Sum of series formulas.'},

{day:2,topic:'SSC QA: HCF & LCM — Pattern Recognition',
intro:`Today we tackle HCF and LCM. In SSC, you don't just calculate these; you recognize the 'Application Pattern'. Whether it's bells ringing at intervals, tiles on a floor, or finding the greatest number that leaves a specific remainder—it's all HCF/LCM. Toppers don't use the long division method; they use 'Prime Factorization' or simply check the options. Today we learn how to convert a word problem into a simple HCF or LCM equation in seconds.`,
notes:[
{title:'HCF & LCM: The Basics',detail:'HCF (Highest Common Factor): Greatest number that divides the given numbers. LCM (Least Common Multiple): Smallest number divisible by the given numbers. Relationship: HCF × LCM = Product of two numbers (a × b). Note: This ONLY applies to 2 numbers, not 3.'},
{title:'Fraction HCF & LCM',detail:'HCF of Fractions = (HCF of Numerators) / (LCM of Denominators). LCM of Fractions = (LCM of Numerators) / (HCF of Denominators). Concept: Always focus on what you want (HCF or LCM) for the top part.'},
{title:'Word Problem Templates: HCF',detail:'1. Greatest number that divides a, b, c exactly: HCF(a, b, c). 2. Greatest number that divides a, b, c leaving remainder R in each: HCF(a-R, b-R, c-R). 3. Greatest number that divides a, b, c leaving diff remainders x, y, z: HCF(a-x, b-y, c-z).'},
{title:'Word Problem Templates: LCM',detail:'1. Smallest number divisible by a, b, c exactly: LCM(a, b, c). 2. Smallest number div by a, b, c leaving same rem R: LCM(a, b, c) + R. 3. Smallest number div by a, b, c leaving diff rem x, y, z: LCM(a, b, c) - K (where K = a-x = b-y = c-z).'},
{title:'Application: Bells & Lights',detail:'Bells ringing at intervals of 10s, 15s, 20s. When will they ring together? Find LCM(10, 15, 20) = 60s. So every 60 seconds.'}
],
cards:[
{front:'HCF × LCM = ?',back:'Product of the two numbers (a × b). This formula is ONLY valid for exactly two numbers.'},
{front:'How to find LCM of fractions?',back:'(LCM of Numerators) / (HCF of Denominators).'},
{front:'How to find HCF of fractions?',back:'(HCF of Numerators) / (LCM of Denominators).'},
{front:'What to find for "greatest length of tape to measure X, Y, Z"?',back:'HCF of X, Y, Z.'},
{front:'Pattern: 3 bells ring at 6, 8, 12 min. Together at?',back:'LCM(6, 8, 12) = 24. Together every 24 minutes.'}
],
q:[
{q:'The HCF of two numbers is 11 and their LCM is 7700. If one number is 275, the other is:',options:['279','308','318','280'],ai:1,exp:'Formula: HCF × LCM = a × b. 11 × 7700 = 275 × b. b = (11 × 7700) / 275 = 308.'},
{q:'Find the HCF of 2/3, 8/9, 16/81 and 10/27:',options:['2/3','2/81','160/3','80/81'],ai:1,exp:'HCF = HCF(2,8,16,10) / LCM(3,9,81,27). HCF(2,8,16,10) = 2. LCM(3,9,81,27) = 81. Answer = 2/81.'},
{q:'Three bells chime at intervals of 18, 24 and 32 minutes. If they chime together at 8:00 AM, when will they next chime together?',options:['12:48 PM','11:48 AM','1:48 PM','10:48 AM'],ai:0,exp:'LCM(18, 24, 32) = 288 minutes. 288 mins = 4 hours 48 minutes. 8:00 AM + 4:48 = 12:48 PM.'},
{q:'Find the greatest number that will divide 148, 246 and 623 leaving remainders 4, 6 and 11 respectively.',options:['12','14','16','18'],ai:0,exp:'Numbers: 148-4=144, 246-6=240, 623-11=612. Find HCF(144, 240, 612). HCF = 12.'}
],
hook:'HCF×LCM=Product (2 numbers). Fraction HCF=Top HCF/Bottom LCM. Word problems: "Greatest"=HCF, "Smallest/Interval"=LCM.',
summary:'Methods to find HCF and LCM. Formula for product of two numbers. HCF/LCM of fractions. Word problem templates for specific remainder cases.'},

{day:3,topic:'SSC QA: Simplification & Surds/Indices',
intro:`Today we master 'Calculation Speed'. Simplification in SSC is not just about BODMAS; it's about seeing shortcuts in powers and roots. Toppers don't calculate (√3 + √2)²; they know the algebraic identity. Today we cover the Laws of Indices (powers) and the properties of Surds (roots). If you can manipulate powers of 2, 3, and 5 quickly, you win half the battle in the Math section. We also learn 'Rationalization'—the trick to getting rid of roots in the denominator.`,
notes:[
{title:'Laws of Indices (Powers)',detail:'1. aᵐ × aⁿ = aᵐ⁺ⁿ. 2. aᵐ / aⁿ = aᵐ⁻ⁿ. 3. (aᵐ)ⁿ = aᵐⁿ. 4. (ab)ⁿ = aⁿbⁿ. 5. a⁰ = 1. 6. a⁻ⁿ = 1/aⁿ. Skill: Learn to recognize powers—2¹⁰=1024, 3⁵=243, 5⁴=625.'},
{title:'Laws of Surds (Roots)',detail:'1. ⁿ√a = a¹/ⁿ. 2. ⁿ√ab = ⁿ√a × ⁿ√b. 3. ⁿ√(a/b) = ⁿ√a / ⁿ√b. 4. (ⁿ√a)ⁿ = a. 5. mth root of nth root of a = mnth root of a.'},
{title:'Rationalization Trick',detail:'To simplify 1/(√a + √b), multiply numerator and denominator by (√a - √b). Result = (√a - √b) / (a - b). Extremely common in SSC to simplify nested roots.'},
{title:'BODMAS Precision',detail:'Brackets (), {}, [] → Of → Division / Multiplication (left to right) → Addition / Subtraction (left to right). TRAP: "Of" is calculated BEFORE division.'},
{title:'Vedic Math Shortcut: Digital Sum',detail:'Sum of digits of a number. (e.g., 123 = 1+2+3 = 6). In multiplication/addition, the digital sum of the question must equal the digital sum of the answer. Use this to check options without full calculation!'}
],
cards:[
{front:'What is (aᵐ)ⁿ ?',back:'aᵐⁿ. (e.g., (2³)² = 2⁶ = 64). Note: 2³² is different, it is 2⁹ = 512.'},
{front:'Laws of Indices: aᵐ / aⁿ = ?',back:'aᵐ⁻ⁿ.'},
{front:'How to rationalize 1/(√7 + √5)?',back:'Multiply by (√7 - √5). Result = (√7 - √5) / (7 - 5) = (√7 - √5)/2.'},
{front:'Digital sum of 158?',back:'1+5+8 = 14 → 1+4 = 5. (Note: ignore 9s, they don\'t change the sum).'},
{front:'Value of 5⁰ ?',back:'1. Any non-zero number raised to power 0 is 1.'}
],
q:[
{q:'Simplify: (256)⁰.¹⁶ × (256)⁰.⁰⁹',options:['4','16','64','256'],ai:0,exp:'Base is same, so add powers: 0.16 + 0.09 = 0.25. (256)⁰.²⁵ = (256)¹/⁴ = (4⁴)¹/⁴ = 4.'},
{q:'Find the value of (√8)¹/³:',options:['2','√2','4','8'],ai:1,exp:'√8 = (2³)¹/² = 2³/². So (2³/²)¹/³ = 2¹/² = √2.'},
{q:'Which is greater: ³√4 or ⁴√6?',options:['³√4','⁴√6','Equal','Cannot determine'],ai:0,exp:'LCM of indices 3 and 4 is 12. ³√4 = ¹²√4⁴ = ¹²√256. ⁴√6 = ¹²√6³ = ¹²√216. So ³√4 is greater.'},
{q:'Simplify: 1 / (√3 + √2)',options:['√3 + √2','√3 - √2','1','5'],ai:1,exp:'Rationalize: multiply by (√3 - √2). Result = (√3 - √2) / (3 - 2) = √3 - √2.'}
],
hook:'aᵐ×aⁿ=aᵐ⁺ⁿ. (aᵐ)ⁿ=aᵐⁿ. Rationalize with conjugate. Digital sum for verification. Memorize powers of 2/3/5.',
summary:'Laws of indices and surds. Rationalization of denominators. BODMAS application. Digital sum method for quick verification of answers.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Very High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Speed Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Speed Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL '+d.topic+' shortcuts'),why:'Fast calculation techniques for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Speed focus',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('SSC Days 1-3 v2 COMPLETE');
}
push();

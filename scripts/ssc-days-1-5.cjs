require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const days = [
{
  day:1, topic:'Unit Digit & Cyclicity Rules',
  notes:[
    {title:'Cyclicity Rule', detail:'2,3,7,8 repeat unit digits every 4 powers. Find unit digit: divide power by 4, use remainder. Remainder 1→same as base^1, Rem 2→base^2, Rem 3→base^3, Rem 0→base^4.'},
    {title:'Fixed Unit Digits', detail:'0,1,5,6: ALWAYS retain their unit digit regardless of power. e.g. 6^100 ends in 6. 5^99 ends in 5. 1^999 ends in 1.'},
    {title:'4 and 9 Rule', detail:'4: ODD power→4, EVEN power→6. 9: ODD power→9, EVEN power→1. e.g. 4^13→4, 4^12→6, 9^7→9, 9^8→1.'},
    {title:'Perfect Square Unit Digit', detail:'Perfect squares NEVER end in 2, 3, 7, or 8. Use this to ELIMINATE options immediately. If an option ends in 3 and question asks for a perfect square — cut it instantly.'}
  ],
  hook:'⚡ Hall Trick: To find unit digit of 7^95 — 95÷4=23 remainder 3. So 7^3=343. Unit digit=3. Time taken: 4 seconds. For (....5)^n + (....6)^n: unit digit always 5+6=11→1. No calculation needed.',
  cards:[
    {front:'Unit digit of 7^98?', back:'98÷4=24 R2. 7^2=49. Unit digit=9. Time: 3 seconds.'},
    {front:'Unit digit of 4^101?', back:'101 is ODD. 4 with odd power=4. Unit digit=4. No calculation needed.'},
    {front:'Can a perfect square end in 7?', back:'NO. Perfect squares end only in 0,1,4,5,6,9. Use this to eliminate answer choices in 2 seconds.'}
  ],
  q:[
    {q:'What is the unit digit of (1234)^1234?', options:['2','4','6','8'], answer_index:2, explanation:'Base ends in 4. Power 1234 is EVEN. 4 with even power always ends in 6. Answer: 6. No need to calculate anything.'},
    {q:'Which of the following CANNOT be a perfect square?', options:['144','169','172','196'], answer_index:2, explanation:'172 ends in 2. Perfect squares NEVER end in 2,3,7,8. So 172 cannot be a perfect square. This elimination takes 1 second.'}
  ],
  pyq:'Every CGL/CHSL paper — 1-2 questions guaranteed.',
  summary:'Cyclicity: 2,3,7,8→power÷4→remainder decides. 0,1,5,6→always same. 4: odd=4,even=6. 9: odd=9,even=1. Perfect squares NEVER end in 2,3,7,8. Use elimination before calculation always.'
},
{
  day:2, topic:'LCM & HCF: Word Problem Strategies',
  notes:[
    {title:'Core Formulas', detail:'HCF × LCM = Product of two numbers (only for TWO numbers — NOT three or more). LCM is always ≥ HCF. HCF always divides LCM completely.'},
    {title:'HCF Speed Rule', detail:'HCF of fractions = HCF of numerators / LCM of denominators. LCM of fractions = LCM of numerators / HCF of denominators.'},
    {title:'Word Problem Patterns', detail:'Pattern 1: "When does X meet again?" → LCM. Pattern 2: "Cut ropes into equal pieces (no waste)" → HCF. Pattern 3: "Fill tank from two pipes" → LCM. Pattern 4: "Largest tile to pave floor" → HCF of dimensions.'},
    {title:'Divisibility Quick Rules', detail:'Div by 11: Alternate digit sum difference (even-odd). Div by 7: Double last digit, subtract from rest. Div by 13: Similar but add (4× last digit). Div by 4: Last two digits divisible by 4.'}
  ],
  hook:'⚡ Hall Trick: HCF × LCM = Product ONLY for two numbers. For 3 numbers: calculate separately. Common SSC trap — applying the formula to 3 numbers. Also: LCM of consecutive integers from 1 to n = product of highest powers of all primes up to n.',
  cards:[
    {front:'HCF of 2/3 and 4/9?', back:'HCF = HCF(2,4)/LCM(3,9) = 2/9. Remember: HCF of fractions = HCF of numerators over LCM of denominators.'},
    {front:'Three bells ring at 15, 20, 25 min intervals. When do they ring together?', back:'LCM(15,20,25) = 300 minutes = 5 hours. Classic meeting/coincidence problem → always LCM.'},
    {front:'What is the largest tile (square) to pave 12m × 8m floor without cutting?', back:'HCF(12,8) = 4m. The tile side must divide BOTH dimensions. Largest common divisor = HCF.'}
  ],
  q:[
    {q:'HCF of two numbers is 12, LCM is 180. One number is 36. What is the other?', options:['48','60','72','84'], answer_index:1, explanation:'HCF × LCM = N1 × N2. 12 × 180 = 36 × N2. N2 = 2160/36 = 60. Direct formula application — takes 15 seconds.'},
    {q:'Which divisibility rule correctly tests if a number is divisible by 11?', options:['Sum of all digits divisible by 11','Last two digits divisible by 11','Difference of alternate digit sums divisible by 11','Last digit is 0 or 1'], answer_index:2, explanation:'Rule for 11: (Sum of digits at odd positions) - (Sum at even positions) must be 0 or divisible by 11. e.g. 121: (1+1)-2=0. Divisible. 132: (1+2)-3=0. Divisible.'}
  ],
  pyq:'CGL Tier 1 and Tier 2 — 2-3 questions. Word problems are higher yield than direct calculation.',
  summary:'HCF×LCM=Product of TWO numbers only. HCF of fractions: HCF(num)/LCM(den). LCM of fractions: LCM(num)/HCF(den). Word problems: Meet again→LCM, Max size→HCF, Equal cuts→HCF. Div by 11: alternate sum difference. Div by 4: last two digits.'
},
{
  day:3, topic:'Surds, Indices & Simplification',
  notes:[
    {title:'Index Laws (Must Know)', detail:'a^m × a^n = a^(m+n). a^m ÷ a^n = a^(m-n). (a^m)^n = a^(mn). a^0 = 1 (for a≠0). a^(-n) = 1/a^n. a^(1/n) = nth root of a. (ab)^n = a^n × b^n.'},
    {title:'Surd Rationalization', detail:'To rationalize 1/(√a + √b): multiply by (√a - √b)/(√a - √b). Result: (√a - √b)/(a-b). Used to simplify complex surd expressions. Key: √a × √a = a (always).'},
    {title:'Approximation Speed', detail:'√2 ≈ 1.414. √3 ≈ 1.732. √5 ≈ 2.236. √6 ≈ 2.449. √7 ≈ 2.646. These values appear in geometry and simplification. BODMAS: Brackets → Orders → Division → Multiplication → Addition → Subtraction.'},
    {title:'Value Substitution Trick', detail:'For complex algebraic expressions: substitute simple values (x=1, x=0, x=2) to quickly check which option equals the expression. Saves 60+ seconds vs full algebraic simplification.'}
  ],
  hook:'⚡ Hall Trick: If question has (a+b+c=0), then a³+b³+c³ = 3abc. This formula eliminates 90% of cube simplification questions in 5 seconds. Also: (x + 1/x)=k → x² + 1/x² = k²-2. These are SSC favorite identity traps.',
  cards:[
    {front:'If a+b+c=0, what is a³+b³+c³?', back:'3abc. This is a direct formula — no calculation needed. UPSC/SSC both test this. Memorize: Sum=0 → Cubes = 3×product.'},
    {front:'Simplify 1/(√5+√3)?', back:'Rationalize: ×(√5-√3)/(√5-√3) = (√5-√3)/(5-3) = (√5-√3)/2. Answer in 10 seconds.'},
    {front:'What is the value of (x+1/x) if x²+1/x²=7?', back:'x²+1/x²=(x+1/x)²-2=7. So (x+1/x)²=9. x+1/x=3. Remember: x²+1/x² = (x+1/x)² - 2.'}
  ],
  q:[
    {q:'If x + 1/x = 5, what is x² + 1/x²?', options:['23','25','27','21'], answer_index:0, explanation:'x²+1/x²=(x+1/x)²-2 = 5²-2 = 25-2 = 23. This identity saves 40 seconds vs expanding the square. Memorize this — appears in every CGL Tier 1 paper.'},
    {q:'Simplify: (√5+√3)/(√5-√3)', options:['4+√15','4-√15','4+2√15','(8+2√15)/2'], answer_index:0, explanation:'Multiply numerator and denominator by (√5+√3): (√5+√3)²/(5-3) = (5+2√15+3)/2 = (8+2√15)/2 = 4+√15.'}
  ],
  pyq:'CGL Tier 2 and Advanced Maths — identity-based questions are high yield.',
  summary:'Index laws: product rule(add powers)+quotient(subtract)+power of power(multiply). Rationalization: multiply by conjugate. Approximations: √2=1.414,√3=1.732,√5=2.236. Key identities: a+b+c=0→a³+b³+c³=3abc. x²+1/x²=(x+1/x)²-2. Value substitution for complex expressions.'
},
{
  day:4, topic:'Percentage: Fraction Mastery & Successive Change',
  notes:[
    {title:'Fraction-Percentage Master Table', detail:'1/2=50%, 1/3=33.33%, 1/4=25%, 1/5=20%, 1/6=16.67%, 1/7=14.28%, 1/8=12.5%, 1/9=11.11%, 1/10=10%, 1/11=9.09%, 1/12=8.33%, 1/13=7.69%, 1/16=6.25%, 1/20=5%, 1/25=4%.'},
    {title:'Symmetry Trick', detail:'x% of y = y% of x. Example: 17% of 50 = 50% of 17 = 8.5. Use when one number is simpler as a percentage. Saves 20 seconds per question.'},
    {title:'Successive % Change Formula', detail:'Net % change when A changes by x% then y%: Net = x + y + xy/100. Example: Increase 25% then decrease 20%: 25+(-20)+(25×-20)/100 = 5-5 = 0%. Back to original. For successive increases: always yields more than simple sum.'},
    {title:'% More vs % Less Trap', detail:'If A is x% MORE than B → B is x/(100+x)×100 % LESS than A. If A is 25% more than B → B is 25/125×100 = 20% less than A. ALWAYS different numbers. The most common SSC English/Quant trap.'}
  ],
  hook:'⚡ Hall Trick: 20% of anything = just divide by 5. 25% = divide by 4. 33.33% = divide by 3. 12.5% = divide by 8. These avoid all decimal calculations. For the "% more vs % less" trap: draw a fraction — if A=125, B=100, then B is 25/125=20% less than A, not 25% less.',
  cards:[
    {front:'A is 20% more than B. By what % is B less than A?', back:'16.67%. Formula: x/(100+x)×100 = 20/120×100 = 16.67%. NOT 20%. This distinction kills thousands of SSC aspirants every year.'},
    {front:'Price increases 20% then decreases 20%. Net change?', back:'-4%. Use formula: 20+(-20)+(20×-20)/100 = 0-400/100 = -4%. Price does NOT return to original — it falls by 4%. Classic successive % trap.'},
    {front:'What is 37.5% of 240?', back:'37.5% = 3/8. 240×3/8 = 90. Use fraction conversion instead of calculating 0.375×240. 5 seconds vs 20 seconds.'}
  ],
  q:[
    {q:'A\'s salary is 25% more than B\'s. By what percent is B\'s salary less than A\'s?', options:['25%','20%','16.67%','22%'], answer_index:1, explanation:'A=125, B=100 (if B=100). B is (25/125)×100 = 20% less than A. NOT 25%. The asymmetry between "more than" and "less than" is the #1 SSC percentage trap.'},
    {q:'A number is increased by 30% and then decreased by 30%. The net change is?', options:['0%','9% increase','-9%','3% increase'], answer_index:2, explanation:'Net = 30+(-30)+(30×(-30)/100) = 0 - 900/100 = -9%. Net DECREASE of 9%. Symmetrical increase-decrease NEVER returns to original — always a net loss. Formula: net = -x²/100 for equal ±x%.'}
  ],
  pyq:'Every SSC paper — 3-5 questions. % more vs % less is the single most repeated trap.',
  summary:'Fraction table: 1/8=12.5%,1/7=14.28%,1/6=16.67%,1/9=11.11%. Symmetry: x% of y = y% of x. Successive: x+y+xy/100. % more/less trap: 25% more → 20% less(not 25%). Equal ±x% → net=-x²/100 always negative. Use fraction conversion instead of decimal multiplication.'
},
{
  day:5, topic:'Profit, Loss & Discount',
  notes:[
    {title:'Core Framework', detail:'CP = Cost Price, SP = Selling Price, MP = Marked Price. Profit% = (SP-CP)/CP × 100. Loss% = (CP-SP)/CP × 100. SP = CP × (100+P%)/100. CP = SP × 100/(100+P%).'},
    {title:'Discount Framework', detail:'Discount = MP - SP. Discount% = Discount/MP × 100. SP after discount = MP × (100-D%)/100. For two successive discounts d1% and d2%: Net = d1+d2-d1×d2/100 (same as successive % formula).'},
    {title:'Dishonest Dealer Trick', detail:'Dealer claims to sell at cost price but uses false weights (e.g., 900g weight labeled 1000g). Profit% = (True weight - False weight)/False weight × 100 = (1000-900)/900 × 100 = 11.11%.'},
    {title:'CP from MP formula', detail:'If item has Profit% and Discount%: SP = MP×(100-D)/100. SP = CP×(100+P)/100. Therefore: CP = MP × (100-D)/(100+P). This single formula solves 80% of complex P&L questions.'}
  ],
  hook:'⚡ Hall Trick: If a trader sells TWO items at same SP — one at x% profit and one at x% loss → ALWAYS a net LOSS of x²/100 %. Example: Two items each at ₹1000, one 20% profit and one 20% loss → Net loss = 20²/100 = 4%. This trap appears in EVERY CGL paper.',
  cards:[
    {front:'Two articles sold at ₹1200 each, one at 20% profit and one at 20% loss. Net result?', back:'Net LOSS = x²/100 = 20²/100 = 4% loss. Total CP = 1000+1500 = 2500. Total SP = 2400. Loss = 100. Loss% = 100/2500×4%. Formula gives instant answer.'},
    {front:'A dealer marks 40% above CP and gives 25% discount. Profit%?', back:'SP = MP×0.75 = 1.4CP×0.75 = 1.05CP. Profit = 5%. Formula: (100+P%) = (100+Markup%)×(100-D%)/100 = 140×75/100 = 105. Profit=5%.'},
    {front:'A man uses 900g weight instead of 1kg. Profit%?', back:'Profit% = (1000-900)/900×100 = 100/900×100 = 11.11%. He sells 900g at the price of 1000g.'}
  ],
  q:[
    {q:'A trader sells two cycles at ₹1188 each, gaining 10% on one and losing 10% on the other. Overall result?', options:['No profit no loss','1% gain','1% loss','2% gain'], answer_index:2, explanation:'Two items at same SP, one +x% one -x% → Net loss = x²/100 = 10²/100 = 1% loss. This formula eliminates the need for any calculation. Classic CGL trap.'},
    {q:'A shopkeeper marks his goods 40% above cost and allows a 25% discount. His profit percent is?', options:['5%','8%','10%','15%'], answer_index:0, explanation:'SP = MP × 0.75 = 1.4CP × 0.75 = 1.05CP. Profit = 5CP/100CP × 100 = 5%. Direct formula: Profit% = (100+m)(100-d)/100 - 100 = (140×75)/100 - 100 = 105-100 = 5%.'}
  ],
  pyq:'Every CGL/CHSL paper — 2-4 questions. Same-SP-opposite-profit trap appears in 80% of papers.',
  summary:'P%=(SP-CP)/CP×100. SP=CP(100+P)/100. Two items same SP ±x%→net loss=x²/100. Dishonest dealer: Profit%=(true-false)/false×100. Successive discounts: d1+d2-d1d2/100. CP from MP: CP=MP(100-D)/(100+P). Markup 40%+discount 25%→profit 5%.'
}
];

async function push() {
  for(const d of days){
    const payload = {
      topic_title:d.topic, day_number:d.day, track:'ssc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ **SSC Hall Trick**: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Speed Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC Speed Master: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL '+d.topic+' shortcut tricks'),why:'Best shortcut tutorial for exam hall use.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const {error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:payload,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error) console.error('Day '+d.day+':',error.message);
    else console.log('SSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('SSC Days 1-5 COMPLETE');
}
push();

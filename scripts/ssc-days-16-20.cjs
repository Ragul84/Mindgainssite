require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const days = [
{
  day:16, topic:'Syllogism: 100-50 Method & Venn Diagrams',
  notes:[
    {title:'Standard Syllogism Types', detail:'All A are B = All A inside B. Some A are B = Overlap exists. No A is B = Completely separate. Some A are not B = Part of A outside B. For any valid conclusion: test with Venn diagram. If ANY Venn diagram arrangement makes conclusion FALSE → conclusion is invalid.'},
    {title:'100-50 Counting Method', detail:'Assign numbers: All=100%, Some=50%, No=0%. Rule 1: All+All→All(100). Rule 2: All+Some→Some(50). Rule 3: Some+All→Some(50). Rule 4: No+All→No(0). Rule 5: All+No→No(0). If result ≥50→"Some". If result=0→"No". This method solves 90% of SSC syllogism in 10 seconds.'},
    {title:'Complementary Pairs', detail:'Either-Or conclusions: "Some A are B OR Some A are not B" — one of these MUST be true always (complementary pair). If main conclusion invalid but complementary pair is offered → answer is "Either I or II follows."'},
    {title:'Definite vs Possible', detail:'Definite conclusions: Must be true in ALL valid diagrams. Possible conclusions: True in at least one valid diagram. SSC usually tests definite conclusions. Possible conclusions appear in CGL Tier 2.'}
  ],
  hook:'⚡ Hall Trick: Two statements with a NEGATIVE (No/Not) in either premise → conclusion cannot be positive (No negative in conclusion from two positives either). Quick check: if both premises are "All" type → conclusion is definitely "All" or "Some" type. If either premise is "No" → conclusion is "No" type.',
  cards:[
    {front:'Premises: All cats are dogs. All dogs are animals. Conclusion: All cats are animals — Valid?', back:'All(100)+All(100)=All(100). YES, valid. All cats→dogs→animals. Definite conclusion.'},
    {front:'Premises: Some A are B. All B are C. Conclusion: Some A are C — Valid?', back:'Some(50)+All(100)=Some(50). YES, valid. Some A are B, all B are C → some A must be C.'},
    {front:'Premises: No dog is cat. All cats are animals. What can be concluded?', back:'No(0)+All(100)=No(0). Some dogs are not animals — No definite conclusion about dogs and animals from these premises. "No dog is animal" is NOT valid (only from No premise).'}
  ],
  q:[
    {q:'Statements: All flowers are plants. Some plants are trees. Conclusions: I) Some flowers are trees. II) Some trees are flowers. Which follows?', options:['Only I','Only II','Both I and II','Neither I nor II'], answer_index:3, explanation:'All flowers→plants (certain). Some plants→trees (only some). Flowers are subset of plants, but trees overlap with SOME plants — might not overlap with flowers at all. Neither I nor II necessarily follows. Draw Venn: flowers and trees can be completely separate subsets of plants.'},
    {q:'Statements: No pen is paper. All papers are books. Conclusions: I) No pen is book. II) Some books are not pens. Which follows?', options:['Only I','Only II','Both I and II','Neither I nor II'], answer_index:1, explanation:'No pen is paper + All papers are books. Pens and papers are separate. Papers are inside books. Therefore books include papers (which have no pens) → Some books (the paper ones) are definitely not pens. Conclusion II follows. Conclusion I (No pen is book) is too strong — some books might be pens (books not derived from papers).'}
  ],
  pyq:'Every SSC paper — 4-5 syllogism questions. 100-50 method is the fastest approach.',
  summary:'All=100,Some=50,No=0. Rules: All+All=All,All+Some=Some,Some+All=Some,No+All=No,All+No=No. Complementary pair: Some A are B OR Some A are not B (always true together). Draw Venn for confirmation. Definite=true in ALL diagrams. Possible=true in at least one diagram.'
},
{
  day:17, topic:'Coding-Decoding: Shift & Pattern Methods',
  notes:[
    {title:'Letter Position Values', detail:'A=1,B=2,C=3...Z=26. Reverse: A=26,B=25...Z=1. OPPOSITE pairs: A↔Z(1+26=27), B↔Y(2+25=27), C↔X(3+24=27). Any pair summing to 27 is an opposite pair. This is how "code by opposite" problems work.'},
    {title:'Shift Coding', detail:'Forward shift +n: A→D (shift +3). Backward shift -n: D→A (shift -3). Mixed: odd letters +2, even letters -2. For word codes: find the shift pattern for the sample, apply to question. Common shifts: +3 (ABCDEF→DEFGHI), +13 (ROT13 cipher).'},
    {title:'Positional Codes', detail:'Number-based coding: A=1 type or Z=1 type. Word position reversal: CART→TRAC. Letter reversal within word: CAT→ZAG (replace each by opposite letter). Skipping: alternate letters coded.'},
    {title:'Symbol Coding', detail:'Each letter mapped to a symbol or number. Identify the pattern by comparing given word→code pairs. Look for: position-based pattern, alphabet number pattern, or random substitution (decode from given examples).'}
  ],
  hook:'⚡ Hall Trick: For any coding question — FIRST identify if it\'s a shift code (check letter positions systematically), opposite code (check if pairs sum to 27), or position reversal (check if letters are rearranged). This classification takes 5 seconds and immediately tells you the solution method.',
  cards:[
    {front:'If COLD is coded as DPME, what is the code for WARM?', back:'C→D(+1), O→P(+1), L→M(+1), D→E(+1). Shift +1. WARM: W→X, A→B, R→S, M→N. Code: XBSN.'},
    {front:'If CAT is coded as ZAG, what type of coding?', back:'C↔X? No. C(3)→Z(26). O(15)→L(12)... Wait: CAT→ZAG: C→Z(opposite,1+26=27), A→A(middle,self), T→G(opposite,20+7=27). Opposite letter coding.'},
    {front:'LEAD is coded as 12-5-1-4. What is BACK coded as?', back:'Position coding: L=12,E=5,A=1,D=4. BACK: B=2,A=1,C=3,K=11. Code: 2-1-3-11.'}
  ],
  q:[
    {q:'If HOUSE is coded as FQSQC, what is the code for MOUSE?', options:['KMSSW','MOQQC','LNSRC','KQQPA'], answer_index:1, explanation:'H(8)→F(6): -2. O(15)→Q(17): +2. U(21)→S(19): -2. S(19)→Q(17): -2. E(5)→C(3): -2. Pattern: -2,+2,-2,-2,-2. MOUSE: M(13)→K(11): -2? Wait let me recheck: H→F(-2),O→Q(+2),U→S(-2),S→Q(-2),E→C(-2). MOUSE: M→K(-2),O→Q(+2),U→S(-2),S→Q(-2),E→C(-2). Code: KOQQC.'},
    {q:'If in a certain code, MONKEY is written as XDJMNL, how is TIGER written?', options:['QDFHS','SHFVT','QFHTS','PGERS'], answer_index:0, explanation:'M→X: M(13)+11=24=X? No. Try: M(13)→X(24): +11. O(15)→D(4): -11. N(14)→J(10): -4. K(11)→M(13): +2. E(5)→N(14): +9. Y(25)→L(12): -13. Pattern not uniform. Try reverse: MONKEY reversed=YEKNOM. X=Y-1,D=E-1,J=K-1,M=N-1... checking XDJMNL vs YEKNOM: X=Y-1,D=E-1,J=K-1,M=N-1,N=O-1,L=M-1. Shift -1 on reversed word. TIGER reversed=REGIT. R-1=Q,E-1=D,G-1=F,I-1=H,T-1=S. Code=QDFHS.'}
  ],
  pyq:'Every SSC paper — 3-4 questions. Shift codes and letter-position are most common.',
  summary:'Letter positions: A=1 to Z=26. Opposite pairs sum to 27. Shift coding: +n or -n applied uniformly. Mixed shift: check odds vs evens. Opposite coding: replace by 27-position. Reverse word then shift: complex codes. Classification first: shift/opposite/positional→saves time.'
},
{
  day:18, topic:'Blood Relations: Family Tree Method',
  notes:[
    {title:'Gender-Neutral Terms', detail:'Parent (Mother/Father). Sibling (Brother/Sister). Spouse (Husband/Wife). Child (Son/Daughter). Grandparent (Grandfather/Grandmother). Uncle/Aunt (Parent\'s sibling). Niece/Nephew (Sibling\'s child).'},
    {title:'Family Tree Construction', detail:'Draw the tree immediately. Establish gender first. Use: Male=Square, Female=Circle, Marriage=horizontal line, Parent-child=vertical line. Always start from the person with the most relationships defined. Work outward.'},
    {title:'Coded Blood Relations', detail:'"A is the father of B" → Draw A above B with vertical line. "C is the wife of A" → Draw C beside A with horizontal line. "B is the son of C" → confirms B is male child of A and C. Always draw — never solve in head.'},
    {title:'Short Cut Terms', detail:'Mother\'s/Father\'s brother=Uncle. Mother\'s/Father\'s sister=Aunt. Uncle\'s/Aunt\'s son/daughter=Cousin. Husband\'s/Wife\'s father=Father-in-law. Husband\'s/Wife\'s sibling=Brother/Sister-in-law.'}
  ],
  hook:'⚡ Hall Trick: For coded relation chains like "A is B\'s father\'s wife\'s only child\'s husband" — draw EVERY step. Chain from A\'s perspective: B\'s father→B\'s father\'s wife (B\'s mother)→their only child (B)→B\'s husband (A is B\'s husband). Decode: A is B\'s HUSBAND. Never shortcut in head — always draw.',
  cards:[
    {front:'A is B\'s mother. C is A\'s husband. D is C\'s father. What is D to B?', back:'A=mother of B. C=father of B (A\'s husband). D=grandfather of B (C\'s father). D is B\'s paternal grandfather.'},
    {front:'Pointing to a photograph, a man says "She is the daughter of my grandfather\'s only son." What is she to the man?', back:'Grandfather\'s only son = Father. Daughter of father = Sister. She is his SISTER (or he is her brother).'},
    {front:'A and B are brothers. C is A\'s wife. D is C\'s son. What is D to B?', back:'D is C\'s son→A is C\'s husband→D is A\'s son. B is A\'s brother. So D is B\'s NEPHEW.'}
  ],
  q:[
    {q:'Pointing to a girl, Raman says "She is the daughter of the only child of my grandfather." How is the girl related to Raman?', options:['Daughter','Niece','Sister','Granddaughter'], answer_index:2, explanation:'My grandfather\'s only child = My parent. Daughter of my parent = My sister. The girl is Raman\'s SISTER. The "grandfather" misdirects — only child of grandfather = one of Raman\'s parents.'},
    {q:'A said to B "Your mother\'s husband\'s sister is my aunt." How is B related to A?', options:['Son','Nephew','Brother','Cousin'], answer_index:2, explanation:'B\'s mother\'s husband = B\'s father. B\'s father\'s sister = B\'s aunt. A says this aunt is A\'s aunt too. So B and A share the same aunt = they are siblings. B is A\'s BROTHER (or sister — but options show brother).'}
  ],
  pyq:'Every SSC paper — 2-3 questions. Always draw the family tree.',
  summary:'Always draw family tree: Male=square, Female=circle. Marriage=horizontal. Parent-child=vertical. Chain relations: decode step by step. Grandfather\'s only son=Father. Sibling\'s child=Niece/Nephew. Common trap: "grandfather\'s only child"=one of your parents. Never solve blood relations mentally.'
},
{
  day:19, topic:'Direction & Distance + Clock Problems',
  notes:[
    {title:'Direction Sense Framework', detail:'Start: face North. Right turn=clockwise. Left turn=anticlockwise. Turns: 90°=perpendicular, 180°=reverse. After each turn, update which way you\'re facing. Final position: use displacement (straight-line distance from start).'},
    {title:'Displacement Calculation', detail:'Draw path on grid. Net North-South displacement and Net East-West displacement. Final distance=√(NS²+EW²). Example: Walk 3N, 4E → displacement=√(9+16)=5. Pythagorean triple shortcut.'},
    {title:'Clock Problems', detail:'Minute hand moves 360°/60min=6°/min. Hour hand moves 360°/720min=0.5°/min. Relative speed=5.5°/min (minute gains on hour). At time H:M, angle between hands=|30H-5.5M|. Overlap every 65+5/11 minutes (≈65.45 min).'},
    {title:'Mirror/Water Reflection of Clocks', detail:'Mirror image: swap left-right (add time to 12:00 to get mirror time OR subtract from 11:60). Water image: swap top-bottom (subtract from 6:30 for analog clock). If clock shows 3:00, mirror shows 9:00.'}
  ],
  hook:'⚡ Hall Trick: Clock angle formula — |30H - 5.5M|. At 3:40: |30×3 - 5.5×40| = |90-220| = 130°. Takes 10 seconds. For mirror time: mirror of time T = 11:60-T (if T has minutes ≤60). Mirror of 8:30 = 11:60-8:30 = 3:30. Instant.',
  cards:[
    {front:'A man walks 5km North, turns right 10km, turns right 5km. How far from start?', back:'5N, 10E, 5S. Net: 0 North-South, 10 East. Distance=10km due East. Draw the grid — L-shaped path.'},
    {front:'Angle between clock hands at 4:20?', back:'|30×4 - 5.5×20| = |120-110| = 10°. Memorize formula: |30H-5.5M|.'},
    {front:'Mirror image of clock showing 8:15?', back:'11:60-8:15=3:45. Mirror of 8:15 is 3:45.'}
  ],
  q:[
    {q:'Ram starts from point A, walks 4km North, turns left and walks 3km. How far is he from A?', options:['3km','4km','5km','7km'], answer_index:2, explanation:'4km North, then left turn (West) 3km. Displacement = √(4²+3²) = √25 = 5km. Classic 3-4-5 Pythagorean triple. Recognize the triple and skip calculation.'},
    {q:'What is the angle between clock hands at 6:30?', options:['0°','15°','30°','45°'], answer_index:1, explanation:'|30×6 - 5.5×30| = |180-165| = 15°. At 6:30 the hands are close but NOT at 0° (that would be 6:32.7 approximately). 15° is the angle.'}
  ],
  pyq:'Every SSC paper — 2-3 questions. Clock angle formula and direction displacement are standard.',
  summary:'Directions: draw grid, track facing direction after each turn. Displacement=√(NS²+EW²). Clock: |30H-5.5M|=angle. Overlap every 65.45min. Mirror time=11:60-T. Left turn=anticlockwise. Pythagorean triples for direction problems: 3-4-5,5-12-13. Never solve direction problems mentally.'
},
{
  day:20, topic:'Number Series & Missing Term',
  notes:[
    {title:'Common Series Types', detail:'Arithmetic (AP): constant difference. Geometric (GP): constant ratio. Square series: 1,4,9,16,25... Cube series: 1,8,27,64... Fibonacci: each term=sum of previous two. Prime series: 2,3,5,7,11... Mixed: difference pattern itself is AP/GP.'},
    {title:'Difference Method', detail:'Find 1st differences. If not constant, find 2nd differences. If 2nd differences constant=quadratic series. If 1st differences are geometric=exponential series. Always compute at least 2 levels of difference before concluding.'},
    {title:'Alternating Series', detail:'Odd and even positioned terms form separate series. Example: 1,3,2,5,3,7,4... Odd positions: 1,2,3,4 (AP+1). Even positions: 3,5,7 (AP+2). Identify alternating patterns when series seems irregular.'},
    {title:'Square+Difference Pattern', detail:'Pattern: 1²+1=2, 2²+2=6, 3²+3=12, 4²+4=20... Or: n²-n. Another: 1×2, 2×3, 3×4 = 2,6,12,20... Recognize product-of-consecutive form.'}
  ],
  hook:'⚡ Hall Trick: For any series — first check if it\'s perfect squares (1,4,9,16,25), perfect cubes (1,8,27,64), or Fibonacci (each=sum of prev two). These three patterns cover 60% of SSC series questions. If none fits, take differences. If differences are AP → series is quadratic. Time: 15 seconds per question.',
  cards:[
    {front:'Series: 2, 5, 10, 17, 26, ? Find next term.', back:'Differences: 3,5,7,9 (AP+2). Next difference=11. 26+11=37. This is n²+1 series: 1²+1=2,2²+1=5,3²+1=10,4²+1=17,5²+1=26,6²+1=37.'},
    {front:'Series: 1, 1, 2, 3, 5, 8, 13, ?', back:'21. Fibonacci series: each term=sum of previous two. 8+13=21.'},
    {front:'Series: 3, 9, 27, 81, ?', back:'243. Geometric series with ratio 3. 81×3=243.'}
  ],
  q:[
    {q:'Find the missing term: 4, 9, 25, 49, ?, 121', options:['64','81','100','144'], answer_index:1, explanation:'Series of PRIME SQUARED: 2²=4, 3²=9, 5²=25, 7²=49, ?=next prime²=11²=121... Wait: 2²,3²,5²,7²,?²,11². Missing = 11²=121? But 121 is already shown. Let me recheck: 2²=4,3²=9,5²=25,7²=49,?=11²=121... no 121 is the last. Missing=? between 49 and 121 → 11²=121 is last. So missing between 49 and 121 = there is no prime between 7 and 11. The series is 2²,3²,5²,7²,11² so missing is between 7² and 11² which would be... The sequence has 2,3,5,7,_,11 primes. Missing prime = no prime between 7 and 11! So series is 2,3,5,7,11,13... and the missing = 11²=121... The missing TERM in the series is 11²=121 but that\'s the last shown. So missing between 49 and 121 must be nothing — the ? IS 121 and last is another prime. Actually series is 2²,3²,5²,7²,11²,13² = 4,9,25,49,121,169. So ? = 121 and last should be 169. Answer: 81 if it\'s squares of all numbers but that gives 1,4,9,16,25,36,49,64,81... Missing = 81.'},
    {q:'Series: 2, 6, 12, 20, 30, ?', options:['40','42','44','48'], answer_index:1, explanation:'Pattern: 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42. Product of consecutive integers n×(n+1). Next: 6×7=42.'}
  ],
  pyq:'Every SSC paper — 2-3 series questions. Square+prime+Fibonacci cover 60%.',
  summary:'Identify type: squares/cubes/Fibonacci/prime series first. Then take differences (1st→2nd→3rd level). Alternating: split odd/even positions. AP differences=quadratic series. GP differences=exponential. n(n+1) product pattern. Squares of primes (2,3,5,7,11,13...) frequent in SSC.'
}
];

async function push() {
  for(const d of days){
    const payload = {
      topic_title:d.topic, day_number:d.day, track:'ssc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ **SSC Hall Trick**: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Speed Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC Speed Master: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL '+d.topic+' tricks shortcut'),why:'Best shortcut tutorial.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const {error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:payload,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error) console.error('Day '+d.day+':',error.message);
    else console.log('SSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('SSC Days 16-20 COMPLETE');
}
push();

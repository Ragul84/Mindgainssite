require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:15,topic:'SSC Reasoning: Analogy & Classification',
intro:`Welcome to the 'Logic' section of SSC. Reasoning is where you score 50/50 in 12 minutes. Today we start with Analogy (Comparison) and Classification (Odd One Out). These chapters test your General Knowledge, Vocabulary, and Mathematical logic simultaneously. In SSC, a question could link a capital to a country, a scientist to an invention, or a number to its cube. Toppers solve these in 5 seconds because they recognize the 'Relationship Pattern'. Let's sharpen your mental associations today.`,
notes:[
{title:'Types of Analogy',detail:'1. Word Analogy: Country-Capital, State-CM, Animal-Young one, Tool-Worker. 2. Number Analogy: Squares, Cubes, Multiples, Prime numbers. 3. Alphabet Analogy: Positions (A=1, Z=26) and Opposites (A-Z, B-Y, C-X).'},
{title:'Types of Classification',detail:'Find the odd one out. 1. Word based: 3 fruits, 1 vegetable. 2. Number based: 3 squares, 1 non-square. 3. Letter based: Based on position gaps.'},
{title:'Alphabet Position Shortcut (EJOTY)',detail:'Memorize positions using E=5, J=10, O=15, T=20, Y=25. Also remember opposites (Sum of positions = 27). A(1)+Z(26)=27. H(8)+S(19)=27.'},
{title:'Common Patterns in Number Analogy',detail:'(n : n²), (n : n³), (n : n²+1), (n : n²-1), (n : n³+n). If 4:64, then 5:? (125). If 4:17, then 5:? (26).'},
{title:'Relationship Logic',detail:'Master associations: Spider:Web (Animal:Home), Cobbler:Leather (Worker:Material), Seismograph:Earthquake (Instrument:Measure).'}
],
cards:[
{front:'Alphabet opposite of H?',back:'S. (H=8, 27-8=19. S=19).'},
{front:'What is "EJOTY"?',back:'Memory tool for alphabet positions: 5, 10, 15, 20, 25.'},
{front:'Opposite of K?',back:'P. (K=11, 27-11=16. P=16).'},
{front:'Analogy: Clock:Time :: Thermometer:?',back:'Temperature.'},
{front:'Odd one out: 64, 125, 216, 256?',back:'256. (The others are cubes: 4³, 5³, 6³. 256 is 16²).'}
],
q:[
{q:'Select the related word: Medicine : Patient :: Education : ?',options:['Teacher','School','Student','Tuition'],ai:2,exp:'Medicine is for patients; Education is for students.'},
{q:'Find the related number: 8 : 81 :: 64 : ?',options:['125','137','525','625'],ai:3,exp:'8 = 2³. 81 = 3⁴. 64 = 4³. Next is 5⁴ = 625.'},
{q:'Find the odd one out:',options:['Lucknow','Patna','Bhopal','Indore'],ai:3,exp:'Lucknow (UP), Patna (Bihar), Bhopal (MP) are capitals. Indore is a city in MP but not a capital.'},
{q:'If A=1 and FAT=27, then FAITH=?',options:['44','42','40','36'],ai:0,exp:'F(6)+A(1)+I(9)+T(20)+H(8) = 44.'}
],
hook:'EJOTY=5,10,15,20,25. Opposite sum=27. Squares/Cubes=Analogy gold. GK knowledge is used in Word Analogy.',
summary:'Introduction to Analogy and Classification. Alphabet position and opposite memory techniques. Pattern recognition for numbers and words. Identifying the odd one out.'},

{day:16,topic:'SSC Reasoning: Series — Number & Alphabet',
intro:`Today we master 'Sequences'. Series questions are a staple of SSC. The goal is to find the hidden rule that connects the numbers or letters. It could be an addition series, a multiplication series, or a combination (×2 +1). For toppers, if the numbers increase slowly, they check the 'Difference'. If they increase rapidly, they check 'Multiplication'. Today we learn how to spot the logic in less than 10 seconds.`,
notes:[
{title:'Number Series Types',detail:'1. Difference Series: Constant diff or increasing diff. 2. Double Difference: The differences themselves form a series. 3. Multiplication/Division: Usually rapid growth. 4. Square/Cube Series: (n²+1), (n³-1). 5. Alternate Series: Two series mixed in one.'},
{title:'Difference Method (Universal)',detail:'If you can\'t find the logic, find the difference between consecutive terms. If that doesn\'t work, find the difference of differences. 90% of SSC series solve this way.'},
{title:'Alphabet Series',detail:'Based on position gaps. Example: A, C, E, G, ? (+2 each). A, D, G, J, ? (+3 each). Use the EJOTY values to calculate gaps quickly.'},
{title:'Repeating Letter Series',detail:'E.g., ab_ba_aba_ba. Shortcut: Count total letters (including blanks). If 12, group as 3 or 4. If 15, group as 3 or 5. Look for the pattern in the groups.'},
{title:'Fibonacci & Prime Series',detail:'Fibonacci: 1, 1, 2, 3, 5, 8... (sum of prev two). Prime: 2, 3, 5, 7, 11, 13, 17... (Be careful, 1 is NOT prime).'}
],
cards:[
{front:'What to check first in a slowly increasing series?',back:'Difference between consecutive terms.'},
{front:'What to check in a rapidly increasing series?',back:'Multiplication or Squares/Cubes.'},
{front:'Pattern for: 2, 3, 5, 7, 11, ?',back:'13. (Prime number series).'},
{front:'How to solve "ab_ba_aba"?',back:'Count total spots and divide into equal groups (3, 4, or 5).'},
{front:'Alphabet pattern: Z, X, V, T, ?',back:'R. (-2 gap).'}
],
q:[
{q:'Find the missing term: 7, 12, 19, 28, 39, ?',options:['52','50','51','48'],ai:0,exp:'Diff: 5, 7, 9, 11... next diff is 13. 39 + 13 = 52.'},
{q:'Find the missing term: 1, 8, 27, 64, 125, ?',options:['216','225','256','343'],ai:0,exp:'Cube series: 1³, 2³, 3³, 4³, 5³. Next is 6³ = 216.'},
{q:'Find the missing term: BDF, HJL, NPR, ?',options:['TVX','TUV','STU','VXY'],ai:0,exp:'Gap of 2 in letters and gap of 6 between starts (B+6=H, H+6=N, N+6=T). T+2=V, V+2=X.'},
{q:'Find the missing term: 2, 6, 12, 20, 30, ?',options:['40','42','44','46'],ai:1,exp:'n² + n series: 1²+1, 2²+2, 3²+3, 4²+4, 5²+5. Next is 6²+6 = 42.'}
],
hook:'Slow series=Diff. Fast series=Mult. Grouping for letter series. 1 is not prime. EJOTY for alphabet gaps.',
summary:'Strategies for Number and Alphabet series. Difference and double difference methods. Repeating letter series patterns. Common mathematical sequences.'},

{day:17,topic:'SSC Reasoning: Coding-Decoding — Pattern Cracking',
intro:`Today we become 'Code Breakers'. Coding-Decoding is the logic of transforming a word into a code using a specific rule. It could be shifting positions (+1, -2), using opposites (A-Z), or using numbers. In SSC, 'Fictitious Language' coding (where "sky is blue" means "la pa ta") is a common pattern. Toppers don't write the whole alphabet; they use the numeric positions to solve the logic. Let's master the 'Shift' and 'Substitution' rules today.`,
notes:[
{title:'Letter Coding (Shifting)',detail:'Each letter shifted by a constant. E.g., CAT -> DBU (+1 shift). Trap: Look for reverse shifts (last letter becomes first) or cross-shifts (C goes to middle, etc.).'},
{title:'Opposite Word Coding',detail:'A is coded as Z, B as Y. Example: KING -> PRMT. Shortcut: If the sum of positions is 27, it\'s an opposite code.'},
{title:'Number Coding',detail:'1. Direct Position: A=1, B=2. 2. Reverse Position: A=26, B=25. 3. Sum of Positions: CAT = 3+1+20 = 24.'},
{title:'Fictitious Language (Chinese Coding)',detail:'"Sun is bright" = "lo mo po", "Bright and hot" = "po ta sa". Since "Bright" is common, its code is "po". Use the elimination method to find codes for specific words.'},
{title:'Substitution Coding',detail:'"If red is called blue, blue is called green..." What is the color of grass? Since grass is green and green is called X, the answer is X. TRAP: Don\'t overthink, just find the next word in the chain.'}
],
cards:[
{front:'If CLOUD is written as GHPYH, what is the shift?',back:'C(3)->G(7)=+4, L(12)->H(8)=-4... Pattern is +4, -4.'},
{front:'What is opposite code of LOVE?',back:'EVOL. (L-O, O-L, V-E, E-V). Sum is 27.'},
{front:'How to solve "A is B, B is C" coding?',back:'Substitution method. Find the real answer first, then look for its "called as" name.'},
{front:'Sum of positions for "DOG"?',back:'D(4)+O(15)+G(7) = 26.'},
{front:'Opposite of G?',back:'T. (G=7, 27-7=20. T=20).'}
],
q:[
{q:'In a code language, TEACHER is written as VGCEJGT. How is CHILDREN written?',options:['EJKNFTGP','EJKNFITP','EJKNGITP','EJKNFGTP'],ai:0,exp:'Shift is +2 for each letter. C+2=E, H+2=J, I+2=K, L+2=N... results in EJKNFTGP.'},
{q:'If CAT=24 and SAD=24, then SHE=?',options:['32','30','33','28'],ai:0,exp:'S(19)+H(8)+E(5) = 32.'},
{q:'In a code, "pit na sa" means "you are good", "na da la" means "good and bad". Code for "good"?',options:['pit','na','sa','da'],ai:1,exp:'"na" is common in both codes; "good" is common in both meanings.'},
{q:'If sky is star, star is cloud, cloud is earth, earth is tree, where do birds fly?',options:['sky','star','cloud','tree'],ai:1,exp:'Birds fly in the sky. But sky is called "star". So answer is "star".'}
],
hook:'Shifting (+x/-x). Opposites (Sum 27). Fictitious coding=Elimination. Substitution=Direct next name.',
summary:'Letter shifting and cross-coding. Opposite letter logic. Numeric coding methods. Fictitious language decoding. Substitution logic.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Very High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Speed Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Logic Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL '+d.topic+' tricks'),why:'Cracking reasoning patterns for SSC speed.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Reasoning',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('SSC Days 15-17 v2 COMPLETE');
}
push();

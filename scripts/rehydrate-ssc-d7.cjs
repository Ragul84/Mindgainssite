require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:7,topic:'SSC REVISION: Arithmetic Foundation (Days 1–6)',
intro:`You have finished the most important week of your SSC preparation. Everything from here on—Time & Work, Speed & Distance, Geometry—will rely on your ability to calculate percentages, divide numbers, and find HCF/LCM in your head. Today is for 'Mental Calibration'. We don't learn new concepts today. We drill the 'Fraction Table', the 'Square Table', and the 'Divisibility Rules' until they are muscle memory. If you can't tell that 1/8 is 12.5% in 1 second, you are losing 10 seconds on every arithmetic question. Let's fix that today.`,
notes:[
{title:'Master Fraction-to-% Table (Revision)',detail:'1/2=50% | 1/3=33.3% | 1/4=25% | 1/5=20% | 1/6=16.6% | 1/7=14.2% | 1/8=12.5% | 1/9=11.1% | 1/11=9.09% | 1/12=8.3% | 3/8=37.5% | 5/8=62.5% | 4/7=57.1%.'},
{title:'Calculation Anchors (1-30)',detail:'Squares: 11²=121, 12²=144, 13²=169, 14²=196, 15²=225, 16²=256, 17²=289, 18²=324, 19²=361, 21²=441, 24²=576, 25²=625. Cubes: 6³=216, 7³=343, 8³=512, 9³=729, 11³=1331, 12³=1728.'},
{title:'Arithmetic Master Formulas',detail:'1. Successive: x + y + xy/100. 2. Price/Consumption: x/(100+x). 3. Profit/Discount: MP/CP = (100+p)/(100-d). 4. SI/CI Diff: D₂ = P(R/100)². 5. HCF/LCM: HCF × LCM = a × b.'},
{title:'Divisibility Speed Check',detail:'3/9: Sum of digits. 4: Last 2 digits. 8: Last 3 digits. 11: Odd-Even difference. 13: (Last*4)+Remaining. 7: (Last*2)-Remaining.'}
],
cards:[
{front:'What is 5/8 as a percentage?',back:'62.5%. (1/8=12.5, 12.5*5=62.5).'},
{front:'What is 4/7 as a percentage?',back:'57.14%. (1/7=14.28, 14.28*4=57.12).'},
{front:'Digital sum of 123 × 12?',back:'123 (6) × 12 (3) = 18 → 1+8 = 9. Digital sum is 9.'},
{front:'Formula for 2-year CI vs SI difference?',back:'P(R/100)².'},
{front:'CP:SP ratio if profit is 16.66%?',back:'1/6 profit means CP=6, Profit=1, SP=7. Ratio 6:7.'}
],
q:[
{q:'A shopkeeper gives two successive discounts of 20% and 10%. Find the single equivalent discount.',options:['30%','28%','26%','25%'],ai:1,exp:'20 + 10 - (20*10)/100 = 30 - 2 = 28%.'},
{q:'If the price of petrol increases by 25%, by how much percent must a person reduce consumption so expenditure remains same?',options:['25%','20%','15%','33.33%'],ai:1,exp:'25 / (100+25) * 100 = 25/125 * 100 = 20%.'},
{q:'What is the unit digit of 3⁶⁸?',options:['1','3','7','9'],ai:0,exp:'68 is divisible by 4 (remainder 0). So unit digit is 3⁴ = 81. Unit digit is 1.'},
{q:'The HCF of two numbers is 12 and their sum is 120. How many such pairs are possible?',options:['1','2','3','4'],ai:1,exp:'Let numbers be 12a and 12b. 12a + 12b = 120 → a+b = 10. Co-prime pairs: (1,9) and (3,7). Total 2 pairs.'}
],
hook:'Speed is king. 1/8=12.5%. MP/CP=(100+p)/(100-d). 2-yr diff=P(R/100)². 11²-25² squares must be known. Unit digit cycle=4.',
summary:'Full revision of SSC QA Foundation. Mastery of Fraction tables, Squares/Cubes, and basic Arithmetic templates. Speed drills and mixed problem sets.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Speed Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC Calculation Speed Drill',url:'https://youtube.com/results?search_query=SSC+Math+Calculation+Tricks+Full',why:'Mastering speed before moving to complex arithmetic.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

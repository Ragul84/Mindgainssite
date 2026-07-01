require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:57,topic:'TNPSC Aptitude: Simplification, % & Ratio',
intro:`Today we study the 'Tools of Calculation'. Unit 10 in TNPSC is purely about 'Shortcuts' and 'Accuracy'. From Bodmas to the 1/x percentage table—these are the foundations. Do you know how to find a ratio between three numbers in seconds? Let's master the basics today.`,
notes:[
{title:'BODMAS Rule',detail:'Bracket, Of, Division, Multiplication, Addition, Subtraction. The absolute order of operations.'},
{title:'Percentage Table',detail:'1/2=50%, 1/3=33.3%, 1/4=25%, 1/5=20%, 1/6=16.6%, 1/8=12.5%. Use these for fast calculations.'},
{title:'Ratio & Proportion',detail:'A:B and B:C -> A:B:C calculation. Third/Fourth Proportional. Mean Proportional = sqrt(ab).'},
{title:'Simplification Tricks',detail:'Approximation. Using unit digits. Division by 9/11 rules.'},
{title:'Squares (1-30)',detail:'Memorize: 15^2=225, 25^2=625, 11^2=121, 13^2=169, 17^2=289, 19^2=361.'}
],
cards:[
{front:'BODMAS order?',back:'Bracket, Of, /, *, +, -.'},
{front:'1/8 as percentage?',back:'12.5%.'},
{front:'Mean Proportional of a,b?',back:'sqrt(ab).'},
{front:'1/6 as percentage?',back:'16.66%.'},
{front:'3rd Proportional of a,b?',back:'b^2 / a.'}
],
q:[
{q:'Find the value of: 10 + 5 * 2 - 4 / 2',options:['18','16','12','26'],ai:0,exp:'10 + 10 - 2 = 18.'},
{q:'If A:B = 2:3 and B:C = 4:5, find A:B:C.',options:['8:12:15','2:3:5','4:6:10','None'],ai:0,exp:'(2*4) : (3*4) : (3*5) = 8:12:15.'},
{q:'30% of 400 + 40% of 300 = ?',options:['120','240','360','480'],ai:1,exp:'120 + 120 = 240.'},
{q:'Find the mean proportional between 9 and 16.',options:['12','14','10','15'],ai:0,exp:'sqrt(144) = 12.'}
],
hook:'BODMAS first. Table for %. Ratio cross method. Mean=sqrt(ab). 1/8=12.5%.',
summary:'Application of the BODMAS rule in complex expressions. Fraction-to-percentage conversion techniques. Solving multi-ratio and proportion problems.'},

{day:58,topic:'TNPSC Aptitude: Profit, Loss & Discount',
intro:`Today we study the 'Math of Business'. Profit and Loss is a core chapter for TNPSC. In TNPSC, 'Successive Discounts' and 'Cost Price/Marked Price' relations are high-yield. Do you know why Profit is always calculated on CP? Let's master the market today.`,
notes:[
{title:'Basic Formulas',detail:'Profit = SP-CP. Loss = CP-SP. Profit% = (P/CP)*100.'},
{title:'Marked Price & Discount',detail:'Discount is always on MP. SP = MP - Discount.'},
{title:'The Ratio Trick',detail:'CP/MP = (100-D%)/(100+P%). (e.g., 10% discount and 20% profit -> CP/MP = 90/120 = 3/4).'},
{title:'Successive Discounts',detail:'Formula: x + y - (xy/100). (e.g., 10% and 10% successive = 19% total).'},
{title:'Selling for same price',detail:'If two items sold at same price, one at x% profit and one at x% loss, overall loss = (x/10)^2 %.'}
],
cards:[
{front:'Profit% on?',back:'Cost Price (CP).'},
{front:'Discount on?',back:'Marked Price (MP).'},
{front:'Successive discount of 10% and 10%?',back:'19%.'},
{front:'CP/MP ratio formula?',back:'(100-D)/(100+P).'},
{front:'SP of 10 = CP of 12, Profit%?',back:'20%.'}
],
q:[
{q:'A man sells an article for ₹600 at a loss of 25%. Find the CP.',options:['₹750','₹800','₹900','₹1000'],ai:1,exp:'75% = 600. 100% = 800.'},
{q:'Find the single discount equivalent to successive discounts of 20% and 10%.',options:['30%','28%','25%','32%'],ai:1,exp:'20 + 10 - 2 = 28%.'},
{q:'A shopkeeper marks his goods 20% above CP and gives 10% discount. Profit%?',options:['10%','8%','12%','5%'],ai:1,exp:'100 -> 120 -> 108. Profit = 8%.'},
{q:'If CP of 15 apples = SP of 10 apples, Profit%?',options:['33.33%','50%','25%','20%'],ai:1,exp:'SP/CP = 15/10 = 3/2. Profit=1/2 = 50%.'}
],
hook:'Profit=CP. Discount=MP. CP/MP=(100-D)/(100+P). 10+10-1=19. Same SP, +/-x = Loss (x/10)^2.',
summary:'Fundamental profit and loss formulas. Techniques for solving successive discounts. Application of the CP/MP golden ratio. Problem-solving for price comparison scenarios.'},

{day:59,topic:'TNPSC Aptitude: Simple & Compound Interest',
intro:`Today we study the 'Growth of Capital'. Interest problems are a certainty in TNPSC Group 1, 2, and 4. In TNPSC, 'Difference between CI and SI for 2 years' is a very frequent question. Do you know the 2-year difference formula? Let's master the interest today.`,
notes:[
{title:'Simple Interest (SI)',detail:'SI = (P*R*T)/100. Interest is constant every year.'},
{title:'Compound Interest (CI)',detail:'Interest on Interest. Amount = P(1+R/100)^T. CI = Amount - P.'},
{title:'Difference between CI & SI',detail:'For 2 years: Diff = P(R/100)^2. For 3 years: Diff = PR^2(300+R) / 100^3.'},
{title:'Successive Method for CI',detail:'Use x + y + (xy/100) for effective rate. (e.g., 10% for 2 yrs = 21%).'},
{title:'Half-Yearly & Quarterly',detail:'Half-yearly: R/2, 2T. Quarterly: R/4, 4T.'}
],
cards:[
{front:'SI formula?',back:'(P*R*T)/100.'},
{front:'CI-SI Diff for 2 years?',back:'P(R/100)^2.'},
{front:'Effective CI rate for 10% (2 yrs)?',back:'21%.'},
{front:'In half-yearly, Time becomes?',back:'Double (2T).'},
{front:'Amount at CI formula?',back:'P(1 + R/100)^T.'}
],
q:[
{q:'A sum of ₹10,000 earns ₹2,000 SI in 2 years. Find the rate.',options:['5%','10%','15%','20%'],ai:1,exp:'2000 = (10000 * R * 2) / 100 => 2000 = 200R => R = 10%.'},
{q:'Find the difference between CI and SI for 2 years on ₹5,000 at 10%.',options:['₹50','₹100','₹150','₹200'],ai:0,exp:'5000 * (10/100)^2 = 5000 * 0.01 = 50.'},
{q:'If a sum at CI doubles in 4 years, it will become 8 times in:',options:['8 years','12 years','16 years','20 years'],ai:1,exp:'2^1 in 4 yrs. 8 = 2^3. Time = 4*3 = 12 years.'},
{q:'Find effective CI rate for 5% for 2 years.',options:['10%','10.25%','10.5%','11%'],ai:1,exp:'5 + 5 + 0.25 = 10.25%.'}
],
hook:'SI=PRT/100. CI Diff 2yr=PR^2/100^2. Effective rate x+y+xy/100. Half yr=R/2, T*2.',
summary:'Comparative study of simple and compound interest. Formulas for 2-year and 3-year interest differences. Calculation of effective interest rates. Solving installment and period-change problems.'},

{day:60,topic:'TNPSC Aptitude: Average & Time and Work',
intro:`Today we study the 'Productivity and Mean'. Time and Work is about 'Efficiency', and Average is about 'Balance'. In TNPSC, 'Work done together' and 'Average of AP' are high-yield. Do you know why Efficiency is inversely proportional to Time? Let's master the productivity today.`,
notes:[
{title:'Average Basics',detail:'Average = Sum/Total. Average of AP = (First + Last)/2.'},
{title:'Average of First n Naturals',detail:'(n+1)/2. Average of first n Odd: n. Average of first n Even: n+1.'},
{title:'Time and Work (LCM Method)',detail:'Total Work = LCM of individual times. Efficiency = Work / Time.'},
{title:'Efficiency Rule',detail:'A:B Efficiency 2:3 -> Time 3:2. (e.g., A is twice as fast as B).'},
{title:'Combined Work',detail:'Time (A+B) = (A * B) / (A + B). (Shortcut for two people).'}
],
cards:[
{front:'Average of 1 to 100?',back:'50.5.'},
{front:'Average of first 50 odd numbers?',back:'50.'},
{front:'Work = ? * ?',back:'Efficiency * Time.'},
{front:'Time (A+B) shortcut?',back:'(A*B) / (A+B).'},
{front:'Average of AP?',back:'(First + Last) / 2.'}
],
q:[
{q:'Average of first 10 prime numbers is:',options:['11','12.9','15','10'],ai:1,exp:'Sum(2,3,5,7,11,13,17,19,23,29) = 129. Avg = 12.9.'},
{q:'A can do a work in 10 days and B in 15. Together?',options:['5','6','8','12'],ai:1,exp:'(10*15)/(10+15) = 150/25 = 6.'},
{q:'A is twice as efficient as B. If A takes 20 days, how long does B take?',options:['10','20','40','60'],ai:2,exp:'Eff 2:1 -> Time 1:2. 1 part = 20, 2 parts = 40.'},
{q:'Average of 5 consecutive numbers is 20. Largest?',options:['20','22','24','25'],ai:1,exp:'20 is middle. Next are 21, 22.'}
],
hook:'AP Avg=(F+L)/2. Work=Eff*Time. LCM for work. A*B/(A+B). Efficiency ratio inverse.',
summary:'Shortcut methods for finding averages of numerical series. Application of the LCM technique in time and work. Understanding the reciprocal relationship between efficiency and time.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC Aptitude Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'TN Aptitude Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Aptitude '+d.topic),why:'Mastering aptitude foundation for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Aptitude',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

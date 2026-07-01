require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:61,topic:'SSC Quant: Ratio, Proportion & Partnership',
intro:`Today we study the 'Logic of Distribution'. Ratio is the fundamental way we compare quantities. In SSC, 'Third/Fourth Proportional', 'Mean Proportional', and 'Partnership distribution' are high-yield. Do you know how to find the mean proportional between 4 and 9? Or how profit is divided in a partnership? Let's master the ratios today.`,
notes:[
{title:'Basic Ratio Rules',detail:'If A:B = 2:3 and B:C = 4:5, then A:B:C = (2*4) : (3*4) : (3*5) = 8:12:15.'},
{title:'Proportion',detail:'1. Third Proportional of a, b = b^2/a. 2. Fourth Proportional of a, b, c = (b*c)/a. 3. Mean Proportional of a, b = sqrt(a*b).'},
{title:'Partnership',detail:'Profit Ratio = (Capital_1 × Time_1) : (Capital_2 × Time_2). Profit depends on both money invested and the duration.'},
{title:'Coin Problems',detail:'Total Value = (Number of coins) × (Value of one coin). (e.g., 50p, 25p, 10p coins in ratio x:y:z).'},
{title:'Age Problems',detail:'Usually solved by creating linear equations or checking ratio shifts. "The difference between ages remains constant."'}
],
cards:[
{front:'Mean Proportional of a and b?',back:'sqrt(a*b).'},
{front:'Third Proportional of a and b?',back:'b^2 / a.'},
{front:'Partnership Profit depends on?',back:'Capital and Time.'},
{front:'A:B=2:3, B:C=3:4, A:C=?',back:'2:4 or 1:2.'},
{front:'Fourth Proportional of a, b, c?',back:'(b*c) / a.'}
],
q:[
{q:'Find the "Mean Proportional" between 4 and 64.',options:['16','32','12','24'],ai:0,exp:'sqrt(4 * 64) = sqrt(256) = 16.'},
{q:'A and B invest ₹2000 and ₹3000 in a business. A stays for 12 months and B for 6 months. Profit ratio?',options:['1:1','4:3','2:3','3:4'],ai:1,exp:'(2000*12) : (3000*6) = 24000 : 18000 = 4:3.'},
{q:'Find the "Third Proportional" of 12 and 18.',options:['24','27','30','36'],ai:1,exp:'18^2 / 12 = 324 / 12 = 27.'},
{q:'The ratio of ages of A and B is 3:4. After 5 years, it becomes 4:5. Present age of A?',options:['15','20','25','30'],ai:0,exp:'Diff in ratio parts = 1 unit. 1 unit = 5 years. A = 3 * 5 = 15.'}
],
hook:'Mean=sqrt(ab). Third=b^2/a. Profit=Capital*Time. A:B:C calculation. Age diff=Constant.',
summary:'Concepts of Ratio and Proportion. Formulas for various proportionals. Calculation of profit in partnerships based on capital and time. Solving coin and age-related problems.'},

{day:62,topic:'SSC Quant: Average & Alligation',
intro:`Today we study the 'Balance of Numbers'. Average is the central value of a set. Mixture and Alligation is a 'Speed Tool' that solves complex weighted average problems in seconds. In SSC, 'Average of Arithmetic Progression (AP)' and 'Replacement problems' are frequent. Do you know the trick for the average of first 100 natural numbers? Let's master the balance today.`,
notes:[
{title:'Average Basics',detail:'Average = Sum of observations / Number of observations.'},
{title:'Average of AP',detail:'If numbers are in AP (equal difference), Average = (First term + Last term) / 2.'},
{title:'Average of Natural Numbers',detail:'1 to n: (n+1)/2. Squares 1 to n: [(n+1)(2n+1)]/6.'},
{title:'Mixture & Alligation',detail:'Used to find the ratio in which two components are mixed. Formula: (Cheaper / Dearer) = (d-m) / (m-c). (Cross subtraction method).'},
{title:'Replacement Problem',detail:'Average increases by x when a person of weight W is replaced by a new person. New weight = W + (n * x).'}
],
cards:[
{front:'Average of first 100 natural numbers?',back:'50.5.'},
{front:'Average of AP series?',back:'(First + Last) / 2.'},
{front:'Alligation is used for?',back:'Finding ratios of mixtures / Weighted averages.'},
{front:'New = Old + (n * diff) is for?',back:'Replacement problems.'},
{front:'Average of first 10 even numbers?',back:'11 (n+1).'}
],
q:[
{q:'The average of 7 consecutive numbers is 20. The largest number is:',options:['20','23','24','26'],ai:1,exp:'Average is the middle (4th) number. Largest is 4th + 3 = 23.'},
{q:'Find the average of first 50 natural numbers.',options:['25','25.5','26','26.5'],ai:1,exp:'(1 + 50) / 2 = 25.5.'},
{q:'In what ratio must rice at ₹62/kg be mixed with rice at ₹72/kg to get a mixture worth ₹65/kg?',options:['7:3','3:7','2:3','3:2'],ai:0,exp:'Using Alligation: (72-65) : (65-62) = 7 : 3.'},
{q:'Average age of 10 students increases by 2 years when one student of 20 years is replaced by a new one. Age of new student?',options:['22','30','40','50'],ai:2,exp:'New = 20 + (10 * 2) = 40.'}
],
hook:'AP Average=(F+L)/2. Middle=Average. Alligation=Cross subtract. Replacement=Old + n*diff.',
summary:'Properties of averages for natural and consecutive numbers. Application of Mixture and Alligation for quick calculation. Solving replacement and weighted average problems.'},

{day:63,topic:'SSC REVISION: Arithmetic Part 1 (Days 57–62)',
intro:`Today we consolidate the 'Numerical Core'. You have mastered Numbers, Percentages, Profit/Loss, Interest, Ratios, and Averages. This block forms 60% of the SSC Quant paper. Today, we drill the shortcuts. If you see '1/8', you say '12.5%'. If you see 'CI-SI 2yrs', you say 'PR^2/100^2'. Let's lock in the arithmetic marks today.`,
notes:[
{title:'Numbers Recap',detail:'11 rule (Odd-Even). Zeros (divide by 5). HCF*LCM=Prod. Unit digit (Cyclicity 4).'},
{title:'Percentage Recap',detail:'1/6=16.66%. 1/8=12.5%. x+y+xy/100 (Successive). Price up 1/4 -> Consump down 1/5.'},
{title:'Profit/Loss Recap',detail:'CP/MP=(100-D)/(100+P). Dishonest=Error/(True-Error).'},
{title:'Interest Recap',detail:'CI 2yrs 10%=21%. 5%=10.25%. Diff 2yrs=PR^2/100^2.'},
{title:'Ratio/Average Recap',detail:'Mean=sqrt(ab). Profit=C*T. AP Average=(F+L)/2. Alligation cross method.'}
],
cards:[
{front:'Unit digit of 2^4?',back:'6.'},
{front:'Effective CI for 20% (2 yrs)?',back:'44%.'},
{front:'If SP of 10 = CP of 12, Profit%?',back:'20%.'},
{front:'Average of first 50 odd numbers?',back:'50 (n).'},
{front:'Fraction value of 37.5%?',back:'3/8.'}
],
q:[
{q:'If A:B = 2:3 and B:C = 4:5, what is A:C?',options:['2:5','8:15','4:15','3:5'],ai:1,exp:'(2*4) : (3*5) = 8:15.'},
{q:'The average of 5 numbers is 27. If one is excluded, the average becomes 25. The excluded number?',options:['30','35','40','45'],ai:1,exp:'Sum 5 = 5*27=135. Sum 4 = 4*25=100. Diff = 35.'},
{q:'Successive discount of 20% and 10% is equivalent to:',options:['30%','28%','25%','32%'],ai:1,exp:'20 + 10 - (200/100) = 28%.'},
{q:'A sum doubles itself in 8 years at SI. Rate?',options:['10%','12.5%','15%','8%'],ai:1,exp:'Interest = P. (P*R*8)/100 = P => R = 100/8 = 12.5%.'}
],
hook:'Arithmetic foundation complete. Fact drill. Table of fractions. Successive formula. Ratio cross method.',
summary:'Full revision of Arithmetic foundation. High-speed drill of percentage tables and interest formulas. Comparison of ratio and average shortcuts. Final Quant Part 1 mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Quant Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Quant Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL Quant '+d.topic),why:'Consolidating arithmetic for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

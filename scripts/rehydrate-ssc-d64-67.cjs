require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:64,topic:'SSC Quant: Time and Work / Pipes & Cistern',
intro:`Today we study the 'Effort and Capacity'. Time and Work is a logic-based chapter. In SSC, the 'Efficiency' ratio and the 'LCM method' are your strongest tools. From 'A and B working together' to 'Pipes filling a tank'—the math is identical. Do you know why a negative efficiency is used for a drainage pipe? Let's master the productivity today.`,
notes:[
{title:'LCM Method',detail:'Assume Total Work = LCM of individual times. Efficiency = Work / Time.'},
{title:'Efficiency Rule',detail:'Time is inversely proportional to Efficiency. (e.g., if Efficiency ratio A:B = 2:3, then Time ratio = 3:2).'},
{title:'Chain Rule (MDH)',detail:'(M1 * D1 * H1) / W1 = (M2 * D2 * H2) / W2. (M=Men, D=Days, H=Hours, W=Work).'},
{title:'Pipes & Cistern',detail:'Filling pipe = Positive efficiency. Emptying pipe = Negative efficiency.'},
{title:'Alternate Days',detail:'Find the work done in one cycle (e.g., 2 days) and then divide total work by cycle work.'}
],
cards:[
{front:'Work = ? * ?',back:'Efficiency * Time.'},
{front:'MDH Formula?',back:'(M1*D1*H1)/W1 = (M2*D2*H2)/W2.'},
{front:'If A is 2x efficient as B, Time ratio?',back:'1:2.'},
{front:'Efficiency of emptying pipe?',back:'Negative (-).'},
{front:'Relation between Time and Efficiency?',back:'Inversely proportional.'}
],
q:[
{q:'A can do a work in 10 days and B in 15 days. Together they can do it in:',options:['5 days','6 days','8 days','12 days'],ai:1,exp:'LCM=30. Eff A=3, Eff B=2. Together Eff=5. Time = 30/5 = 6.'},
{q:'12 men can complete a work in 9 days. In how many days can 18 men complete the same work?',options:['4','5','6','8'],ai:2,exp:'12 * 9 = 18 * D2 => D2 = 6.'},
{q:'Pipe A can fill a tank in 6 hours and Pipe B can empty it in 8 hours. If both open, tank fills in:',options:['12 hrs','18 hrs','24 hrs','30 hrs'],ai:2,exp:'LCM=24. Eff A=4, Eff B=-3. Net Eff=1. Time = 24/1 = 24.'},
{q:'A is twice as efficient as B. If together they finish in 14 days, A alone can do it in:',options:['21 days','28 days','35 days','42 days'],ai:0,exp:'Eff A=2, Eff B=1. Total work = (2+1)*14 = 42. A alone = 42/2 = 21.'}
],
hook:'Work=Eff*Time. LCM for total work. MDH/W. Empty pipe=-. A:B Eff=2:1 -> Time=1:2.',
summary:'LCM technique for solving work and tank problems. Application of the efficiency-time inverse relationship. MDH formula for complex man-day problems.'},

{day:65,topic:'SSC Quant: Time, Speed & Distance / Boats',
intro:`Today we study the 'Logic of Motion'. From trains crossing poles to boats moving with the current—TSD is about 'Relative Speed'. In SSC, 'Average Speed' and 'Train vs Platform' are high-yield. Do you know why we add speeds for opposite direction? Or what is 'Downstream' speed? Let's master the speed today.`,
notes:[
{title:'Basic Formula',detail:'Distance = Speed × Time. km/h to m/s: Multiply by 5/18. m/s to km/h: Multiply by 18/5.'},
{title:'Average Speed',detail:'1. (Total Distance / Total Time). 2. If distances are equal: 2xy / (x+y).'},
{title:'Relative Speed',detail:'Same direction: Subtract (x-y). Opposite direction: Add (x+y).'},
{title:'Train Problems',detail:'Train crossing pole: Distance = Length of train. Train crossing platform: Distance = Length of train + Length of platform.'},
{title:'Boats & Streams',detail:'Downstream (with flow) = B + S. Upstream (against flow) = B - S. Speed of Boat B = (D+U)/2. Speed of Stream S = (D-U)/2.'}
],
cards:[
{front:'Average speed for equal distances?',back:'2xy / (x+y).'},
{front:'5/18 is used to convert?',back:'km/h to m/s.'},
{front:'Relative speed in same direction?',back:'Subtract (x-y).'},
{front:'Boat speed formula?',back:'(Downstream + Upstream) / 2.'},
{front:'Stream speed formula?',back:'(Downstream - Upstream) / 2.'}
],
q:[
{q:'A car travels 60 km/h for 2 hours and 40 km/h for 3 hours. Average speed?',options:['50 km/h','48 km/h','45 km/h','52 km/h'],ai:1,exp:'Total dist = 120 + 120 = 240. Total time = 5. Avg = 240/5 = 48.'},
{q:'A 200m train crosses a pole in 10 seconds. Its speed in km/h?',options:['20','72','18','36'],ai:1,exp:'Speed = 200/10 = 20 m/s. 20 * 18/5 = 72 km/h.'},
{q:'Speed of a boat downstream is 12 km/h and upstream is 8 km/h. Speed of stream?',options:['1','2','4','10'],ai:1,exp:'(12-8)/2 = 2 km/h.'},
{q:'Two trains of 100m and 120m are moving towards each other at 50 km/h and 60 km/h. Time to cross?',options:['7.2s','10s','8.4s','12s'],ai:0,exp:'Total dist = 220m. Rel speed = 110 km/h = 110 * 5/18 = 30.55 m/s. Time = 220 / (110*5/18) = 7.2s.'}
],
hook:'D=S*T. 5/18. Avg speed 2xy/(x+y). Down=B+S. Up=B-S. Relative: Same=-, Opp=+.',
summary:'Fundamental TSD formulas and unit conversions. Analysis of relative speed and train crossing scenarios. Mechanics of boat motion in flowing water.'},

{day:66,topic:'SSC Quant: Algebra — Identities & Basics',
intro:`Today we study the 'Alphabet of Math'. Algebra in SSC is dominated by 'Standard Identities'. From (a+b)^2 to the cubic formulas—the game is about 'Substitution'. Do you know the value of (x + 1/x)^2 if x + 1/x = 5? Or the condition for a^3 + b^3 + c^3 = 3abc? Let's master the variables today.`,
notes:[
{title:'Squares & Cubes',detail:'1. (a+b)^2 = a^2+b^2+2ab. 2. (a-b)^2 = a^2+b^2-2ab. 3. a^2-b^2 = (a+b)(a-b). 4. (a+b)^3 = a^3+b^3+3ab(a+b).'},
{title:'The x + 1/x Pattern (SSC Favorite)',detail:'If x + 1/x = k, then: 1. x^2 + 1/x^2 = k^2 - 2. 2. x^3 + 1/x^3 = k^3 - 3k.'},
{title:'The special Case',detail:'If a + b + c = 0, then a^3 + b^3 + c^3 = 3abc. Also, a^3+b^3+c^3-3abc = (a+b+c)(a^2+b^2+c^2-ab-bc-ca).'},
{title:'Reciprocal values',detail:'If x = 2 + sqrt(3), then 1/x = 2 - sqrt(3) (if difference of squares of terms is 1).'},
{title:'Linear Equations',detail:'Solving two variables by elimination or substitution. Focus on finding (x+y) or (x-y) directly.'}
],
cards:[
{front:'(x + 1/x) = k, find x^2 + 1/x^2?',back:'k^2 - 2.'},
{front:'If a+b+c=0, a^3+b^3+c^3 = ?',back:'3abc.'},
{front:'(x - 1/x) = k, find x^2 + 1/x^2?',back:'k^2 + 2.'},
{front:'(a^3 + b^3) = ?',back:'(a+b)(a^2-ab+b^2).'},
{front:'(a^3 - b^3) = ?',back:'(a-b)(a^2+ab+b^2).'}
],
q:[
{q:'If x + 1/x = 3, find the value of x^2 + 1/x^2.',options:['7','9','11','5'],ai:0,exp:'3^2 - 2 = 7.'},
{q:'If x + 1/x = 4, find x^3 + 1/x^3.',options:['64','52','60','48'],ai:1,exp:'4^3 - 3(4) = 64 - 12 = 52.'},
{q:'If a+b+c=0, find (a^3+b^3+c^3) / abc.',options:['1','2','3','0'],ai:2,exp:'Since a^3+b^3+c^3 = 3abc, dividing by abc gives 3.'},
{q:'If x = 3 + 2sqrt(2), then find (x + 1/x).',options:['6','3','2sqrt(2)','1'],ai:0,exp:'1/x = 3 - 2sqrt(2). Sum = 3+3 = 6.'}
],
hook:'x+1/x=k -> x^2+1/x^2=k^2-2. a+b+c=0 -> a^3+b^3+c^3=3abc. Identity mastery. Substitution is king.',
summary:'Detailed study of algebraic identities and their shortcuts. Pattern recognition for x + 1/x problems. Application of the cubic conditional identity.'},

{day:67,topic:'SSC Quant: Algebra — Polynomials & Max/Min',
intro:`Today we study 'Advanced Algebra'. Beyond identities, we explore 'Quadratic Equations', 'Remainder and Factor Theorems', and 'Maxima and Minima'. In SSC, finding the 'Roots' or the 'Value of an expression' using symmetric substitution is a pro-trick. Do you know how to find the minimum value of a sin^2 + b cos^2? Let's master the advanced logic today.`,
notes:[
{title:'Quadratic Equations',detail:'ax^2 + bx + c = 0. Sum of roots (α+β) = -b/a. Product of roots (αβ) = c/a. Nature of roots depends on Discriminant D = b^2 - 4ac.'},
{title:'Factor Theorem',detail:'If (x-a) is a factor of f(x), then f(a) = 0.'},
{title:'Symmetry Principle',detail:'If an expression is symmetric (e.g., f(a,b,c)), try putting a=b=c to get the value quickly.'},
{title:'Maxima & Minima',detail:'For f(x) = ax^2 + bx + c: Min value = (4ac - b^2)/4a (if a > 0). Max value = (4ac - b^2)/4a (if a < 0).'},
{title:'Degree of Polynomial',detail:'The highest power of the variable. Used to eliminate options in complex divisions.'}
],
cards:[
{front:'Sum of roots of ax^2 + bx + c?',back:'-b / a.'},
{front:'Product of roots of ax^2 + bx + c?',back:'c / a.'},
{front:'Discriminant formula?',back:'b^2 - 4ac.'},
{front:'If (x-2) is a factor, then f(2) = ?',back:'0.'},
{front:'Roots are equal if D = ?',back:'0.'}
],
q:[
{q:'Find the sum of roots of 2x^2 - 8x + 6 = 0.',options:['2','4','-4','3'],ai:1,exp:'-(-8)/2 = 4.'},
{q:'Find the product of roots of 3x^2 + 5x - 12 = 0.',options:['4','-4','5/3','-5/3'],ai:1,exp:'-12/3 = -4.'},
{q:'If x^3 + 5x^2 + 10k is divisible by (x-2), find k.',options:['2','-2.8','-3.5','1'],ai:1,exp:'f(2) = 8 + 20 + 10k = 0 => 28 + 10k = 0 => k = -2.8.'},
{q:'The roots of x^2 - 6x + 9 = 0 are:',options:['Real and Distinct','Real and Equal','Imaginary','Rational and Distinct'],ai:1,exp:'D = 36 - 36 = 0. So roots are equal.'}
],
hook:'Sum=-b/a. Prod=c/a. Factor -> f(a)=0. Symmetry trick. D=0 -> Equal roots.',
summary:'Properties of roots in quadratic equations. Remainder and factor theorem applications. Introduction to maxima and minima in algebraic expressions. Symmetric substitution techniques.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Quant Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Quant Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL Quant '+d.topic),why:'Mastering advanced arithmetic and algebra for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Quant',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

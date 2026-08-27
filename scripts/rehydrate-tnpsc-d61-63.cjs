require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:61,topic:'TNPSC Aptitude: TSD & Mensuration 2D',
intro:`Today we study the 'Motion and Space'. Time, Speed and Distance (TSD) and Mensuration 2D are high-scoring chapters. In TNPSC, 'Average Speed' and 'Area of Circle/Triangle' are the most frequent targets. Do you know the conversion for km/h to m/s? Or the area of an equilateral triangle? Let's master the geometry and speed today.`,
notes:[
{title:'TSD Basics',detail:'Dist = Speed * Time. km/h to m/s: Multiply by 5/18. m/s to km/h: Multiply by 18/5.'},
{title:'Average Speed',detail:'1. (Total Distance / Total Time). 2. If distances are equal: 2xy / (x+y).'},
{title:'Mensuration 2D: Triangle',detail:'1. Basic: 1/2*b*h. 2. Equilateral: (sqrt(3)/4) * a^2. 3. Heron\'s: sqrt[s(s-a)(s-b)(s-c)].'},
{title:'Mensuration 2D: Quadrilaterals',detail:'1. Square: a^2. 2. Rectangle: l*w. 3. Rhombus: 1/2*d1*d2. 4. Circle: pi*r^2 (Area), 2*pi*r (Circum).'},
{title:'Percentage change in Area',detail:'Successive formula: x + y + xy/100. (e.g., Side up 10% -> Area up 21%).'}
],
cards:[
{front:'Average speed formula (equal dist)?',back:'2xy / (x+y).'},
{front:'Equilateral triangle area?',back:'(sqrt(3) / 4) * a^2.'},
{front:'Area of Rhombus?',back:'1/2 * d1 * d2.'},
{front:'5/18 is used to convert?',back:'km/h to m/s.'},
{front:'Area of circle if r=7?',back:'154.'}
],
q:[
{q:'A car travels 60 km/h for 2 hours and 40 km/h for 3 hours. Average speed?',options:['50 km/h','48 km/h','45 km/h','52 km/h'],ai:1,exp:'Total dist = 120 + 120 = 240. Total time = 5. Avg = 48.'},
{q:'Find the area of an equilateral triangle with side 4cm.',options:['4sqrt(3)','16sqrt(3)','4','8sqrt(3)'],ai:0,exp:'(sqrt(3)/4) * 16 = 4sqrt(3).'},
{q:'If the radius of a circle is doubled, its area becomes:',options:['Double','Triple','4 times','Remains same'],ai:2,exp:'pi * (2r)^2 = 4 * (pi*r^2).'},
{q:'The diagonals of a rhombus are 10cm and 24cm. Area?',options:['240','120','60','34'],ai:1,exp:'1/2 * 10 * 24 = 120.'}
],
hook:'Avg speed=2xy/(x+y). km/h to m/s=5/18. Equi=(sqrt3/4)a^2. Circle r=7/Area=154. Rhombus=1/2d1d2.',
summary:'Fundamental TSD formulas and unit conversions. Calculation of area and perimeter for triangles and quadrilaterals. Circle properties and percentage change patterns.'},

{day:62,topic:'TNPSC Aptitude: Logical Reasoning & Series',
intro:`Today we study the 'Logic of Patterns'. Reasoning in TNPSC focuses on 'Number Series', 'Coding-Decoding', and 'Visual Logic'. In TNPSC, 'Alphabet rank' and 'Missing number' questions are staple. Do you know the rank of 'M'? Or the logic behind a Fibonacci series? Let's master the logic today.`,
notes:[
{title:'Coding-Decoding',detail:'EJOTY (5-10-15-20-25). Opposite letters sum to 27. (e.g., A=1, Z=26).'},
{title:'Number Series',detail:'Check for: Difference, Double difference, Multiplication, Squares, Cubes, Primes.'},
{title:'Visual Reasoning',detail:'Dice (Opposite faces), Mirror/Water Image, Completion of figures.'},
{title:'Direction Sense',detail:'North-South-East-West. Right turn (90° clockwise). Pythagoras for shortest distance.'},
{title:'Blood Relations',detail:'Generation tree. + (Male), - (Female). = (Couple).'}
],
cards:[
{front:'Rank of "R"?',back:'18.'},
{front:'Opposite of "H"?',back:'S.'},
{front:'EJOTY values?',back:'5, 10, 15, 20, 25.'},
{front:'Direction: Right turn from North?',back:'East.'},
{front:'Sum of opposite ranks?',back:'27.'}
],
q:[
{q:'If COLD is coded as 3-15-12-4, how is HOT coded?',options:['8-15-20','7-14-19','9-16-21','None'],ai:0,exp:'Direct ranking.'},
{q:'Next in series: 2, 5, 11, 23, ?',options:['46','47','45','48'],ai:1,exp:'Pattern is *2 + 1. 23*2 + 1 = 47.'},
{q:'A man walks 3km North, then 4km East. Distance from start?',options:['7km','5km','1km','6km'],ai:1,exp:'sqrt(3^2 + 4^2) = 5km.'},
{q:'Find the odd one out: 121, 169, 225, 250.',options:['121','169','225','250'],ai:3,exp:'Others are perfect squares.'}
],
hook:'EJOTY=5-25. Opposite=27. Series diff. Pythagoras=sqrt(a^2+b^2). Logic tree.',
summary:'Alphabet ranking and coding patterns. Strategy for solving numerical and visual series. Compass rules and directional turn logic. Basics of blood relation mapping.'},

{day:63,topic:'TNPSC REVISION: Aptitude Part 1 (Days 57–62)',
intro:`Today we consolidate the 'Numerical Core'. You have mastered calculation, business math, interest, work, motion, and logic. Unit 10 is the 'Fixed Score' in TNPSC. Today, we drill the shortcuts. If you see '1/8', you say '12.5%'. If you see 'CI-SI 2yrs', you say 'PR^2/100^2'. Let's lock in the Aptitude marks today.`,
notes:[
{title:'Calculation Recap',detail:'BODMAS order. 1/8=12.5%. Mean=sqrt(ab). 3rd Prop=b^2/a.'},
{title:'Business & Interest Recap',detail:'CP/MP=(100-D)/(100+P). SI=PRT/100. CI Diff 2yr=PR^2/100^2.'},
{title:'Work & Motion Recap',detail:'Work=Eff*Time. LCM method. Avg speed=2xy/(x+y). km/h to m/s=5/18.'},
{title:'Mensuration Recap',detail:'Equilateral=(sqrt3/4)a^2. Circle r=7/Area=154. Rhombus=1/2d1d2.'},
{title:'Logic Recap',detail:'EJOTY (5-25). Opp=27. *2+1 series. Pythagoras 3,4,5.'}
],
cards:[
{front:'Unit digit of 3^4?',back:'1.'},
{front:'Effective CI for 10% (2 yrs)?',back:'21%.'},
{front:'If SP of 10 = CP of 12, Profit%?',back:'20%.'},
{front:'Average of 1 to 100?',back:'50.5.'},
{front:'Opposite of "M"?',back:'N.'}
],
q:[
{q:'If A:B = 2:3 and B:C = 4:5, what is A:C?',options:['2:5','8:15','4:15','3:5'],ai:1,exp:'(2*4) : (3*5) = 8:15.'},
{q:'The difference between CI and SI for 2 years at 10% on ₹1000 is:',options:['₹10','₹20','₹5','₹100'],ai:0,exp:'1000 * (10/100)^2 = 10.'},
{q:'A can do a work in 20 days and B in 30. Together?',options:['10','12','15','18'],ai:1,exp:'(20*30)/(20+30) = 600/50 = 12.'},
{q:'Find area of circle with diameter 14cm.',options:['154','616','77','132'],ai:0,exp:'r=7. Area = 154.'}
],
hook:'Aptitude foundation complete. Fact drill. Shortcuts mastery. Accuracy target. Victory.',
summary:'Full revision of basic arithmetic and logical reasoning for TNPSC. High-speed drill of all core formulas. Comparison of percentage and motion shortcuts. Final Aptitude Part 1 mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC Aptitude Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'TN Aptitude Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Aptitude '+d.topic),why:'Consolidating aptitude for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

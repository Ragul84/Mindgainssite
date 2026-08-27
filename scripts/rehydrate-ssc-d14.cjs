require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:14,topic:'SSC REVISION: Advanced Arithmetic & Mensuration (Days 8–13)',
intro:`You have covered the most conceptually dense part of the SSC Quant section. From the 'MDH' formula in Work to the 'Relative Speed' in TSD and the massive 'Formula Sheet' of Mensuration—this week was about building your execution power. Today, we consolidate these formulas. If you can't recall the volume of a sphere or the 3-year SI/CI difference formula in 5 seconds, you are losing time. Today is for 'Formula Speed Drills'. Let's finish the Arithmetic foundation today.`,
notes:[
{title:'Time, Speed & Work Formulas',detail:'Work: M₁D₁H₁/W₁ = M₂D₂H₂/W₂. Together: xy/(x+y). TSD: Distance = Speed * Time. 1 kmph = 5/18 m/s. Relative (Opp: +, Same: -). Boats: x=(D+U)/2, y=(D-U)/2.'},
{title:'Average & Allegation Recap',detail:'Average Speed = Total D / Total T. 2xy/(x+y). Allegation: (H-M):(M-L) = L:H ratio. Use for mixing anything (price, profit, speed).'},
{title:'2D Mensuration Master Table',detail:'Equilateral: √3a²/4. Circle: πr², 2πr. Rhombus: ½d₁d₂. Trapezium: ½(a+b)h. Area change: x+y+xy/100.'},
{title:'3D Mensuration Master Table',detail:'Cube: a³, 6a². Cylinder: πr²h, 2πrh. Cone: ⅓πr²h, πrl. Sphere: 4/3πr³, 4πr². Hemisphere: 2/3πr³, 3πr² (TSA).'},
{title:'Ratio & Proportion Anchors',detail:'a:b :: c:d → ad=bc. Mean Prop: √ab. Third Prop: b²/a. Profit = Capital * Time.'}
],
cards:[
{front:'TSA of a Hemisphere?',back:'3πr².'},
{front:'Relative speed of two trains in opposite direction?',back:'S₁ + S₂.'},
{front:'Formula for 3-year SI/CI difference?',back:'P(R/100)² * (3 + R/100).'},
{front:'In-radius of an equilateral triangle?',back:'a / (2√3).'},
{front:'What stays constant when melting a shape?',back:'Volume.'}
],
q:[
{q:'A is twice as efficient as B and takes 10 days less than B to finish a work. How many days for B?',options:['10','20','15','30'],ai:1,exp:'Eff A:B = 2:1 → Time A:B = 1:2. Diff 1 unit = 10 days. So A takes 10, B takes 20 days.'},
{q:'If the radius of a sphere is doubled, its volume becomes how many times?',options:['2','4','8','16'],ai:2,exp:'Vol ∝ r³. 2³ = 8 times.'},
{q:'A boat covers 24km upstream and 36km downstream in 6 hours each. Speed of boat in still water?',options:['5 kmph','10 kmph','7.5 kmph','2.5 kmph'],ai:0,exp:'U = 24/6=4. D = 36/6=6. x = (6+4)/2 = 5 kmph.'},
{q:'Find the area of a circle whose circumference is 44 cm.',options:['154','176','144','196'],ai:0,exp:'C=44 → r=7. Area = π * 7² = 154.'}
],
hook:'Work=LCM. Relative Speed Opp(+). Sphere Vol=4/3πr³. Ratio ad=bc. Melting=Volume constant. Area change=x+y+xy/100.',
summary:'Full revision of SSC Advanced Arithmetic and Mensuration. Consolidation of Work, TSD, Average, Ratio and Geometry formulas. Cumulative calculation drill.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Speed Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC Advanced Arithmetic Recap',url:'https://youtube.com/results?search_query=SSC+Math+Revision+Arithmetic+Mensuration',why:'Complete formula recall before moving to Algebra.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

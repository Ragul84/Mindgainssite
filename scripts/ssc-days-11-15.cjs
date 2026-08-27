require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const days = [
{
  day:11, topic:'Algebra: Identities & Geometry Basics',
  notes:[
    {title:'Must-Know Algebraic Identities', detail:'(a+b)²=a²+2ab+b². (a-b)²=a²-2ab+b². (a+b)(a-b)=a²-b². (a+b)³=a³+3a²b+3ab²+b³. (a-b)³=a³-3a²b+3ab²-b³. a³+b³=(a+b)(a²-ab+b²). a³-b³=(a-b)(a²+ab+b²). a³+b³+c³-3abc=(a+b+c)(a²+b²+c²-ab-bc-ca).'},
    {title:'Derived Identities for SSC', detail:'If x+y=a and xy=b: x²+y²=a²-2b. x³+y³=a³-3ab. x²+y²+xy=a²-b. If x+1/x=k: x²+1/x²=k²-2. x³+1/x³=k³-3k. x⁴+1/x⁴=(k²-2)²-2.'},
    {title:'Geometry: Triangle Laws', detail:'Sum of angles = 180°. Exterior angle = sum of two non-adjacent interior angles. Pythagoras: a²+b²=c² (right triangle). Common triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25. Median divides triangle into two equal area triangles.'},
    {title:'Circle Properties', detail:'Angle at centre = 2× angle at circumference (same arc). Angle in semicircle = 90°. Equal chords equidistant from centre. Tangent ⊥ radius at point of tangency. Two tangents from external point are equal.'}
  ],
  hook:'⚡ Hall Trick: For x+1/x=3 type questions — x²+1/x²=(3)²-2=7 → x³+1/x³=(3)³-3(3)=27-9=18. Chain formula works upward. For Pythagoras triples: see 3,4 → 5. See 5,12 → 13. Recognize these and save 30 seconds per geometry question.',
  cards:[
    {front:'If x+1/x=4, find x³+1/x³.', back:'x²+1/x²=4²-2=14. x³+1/x³=(x+1/x)(x²-1+1/x²)=4×(14-1)=4×13=52.'},
    {front:'Exterior angle of a triangle is 110°. One interior angle is 50°. Find the other interior angle.', back:'Exterior angle = sum of two non-adjacent interiors. 110° = 50° + x. x = 60°.'},
    {front:'What is the angle subtended by a diameter at the circumference?', back:'90° always. Angle in semicircle = 90°. This is Thales Theorem — any angle inscribed in a semicircle is a right angle.'}
  ],
  q:[
    {q:'If a + b + c = 9 and a² + b² + c² = 35, what is ab + bc + ca?', options:['23','22','46','25'], answer_index:0, explanation:'(a+b+c)²= a²+b²+c²+2(ab+bc+ca). 81 = 35 + 2(ab+bc+ca). 2(ab+bc+ca)=46. ab+bc+ca=23. Identity application — 5 seconds.'},
    {q:'The angle subtended by an arc at the centre of a circle is 80°. What is the angle subtended at any point on the remaining arc?', options:['40°','80°','160°','20°'], answer_index:0, explanation:'Angle at centre = 2 × angle at circumference (same arc). Angle at circumference = 80°/2 = 40°. This is a direct theorem application.'}
  ],
  pyq:'CGL Tier 2 — 4-6 questions on algebra identities alone. High density.',
  summary:'Key identities: (a+b)²,a³+b³. Derived: x+1/x=k→x²+1/x²=k²-2→x³+1/x³=k³-3k. Triangle: exterior=sum of non-adj interiors. Pythagorean triples: 3-4-5,5-12-13,8-15-17. Circle: centre angle=2×circumference angle. Semicircle angle=90°(Thales). Tangent⊥radius.'
},
{
  day:12, topic:'Trigonometry: Ratios, Tables & Heights',
  notes:[
    {title:'Trigonometric Ratios Table', detail:'At 0°: sin=0,cos=1,tan=0. At 30°: sin=1/2,cos=√3/2,tan=1/√3. At 45°: sin=cos=1/√2,tan=1. At 60°: sin=√3/2,cos=1/2,tan=√3. At 90°: sin=1,cos=0,tan=∞. Memory: sin increases 0→1, cos decreases 1→0 as angle 0°→90°.'},
    {title:'Identities', detail:'sin²θ+cos²θ=1. sec²θ=1+tan²θ. cosec²θ=1+cot²θ. Derived: sin²θ=1-cos²θ. tan²θ=sec²θ-1. These three form the backbone of all trig simplification.'},
    {title:'Heights & Distances', detail:'Angle of Elevation: Look UP. Angle of Depression: Look DOWN. tan(angle) = Opposite/Adjacent = Height/Base. For angle of elevation θ from base: Height = Base × tan(θ). Two observation problems: use simultaneous equations with two angles.'},
    {title:'Complementary Angle Rules', detail:'sin(90-θ)=cosθ. cos(90-θ)=sinθ. tan(90-θ)=cotθ. sec(90-θ)=cosecθ. Use these to simplify expressions like sin35°×sec55° = sin35°×cosec35° = 1.'}
  ],
  hook:'⚡ Hall Trick: sin35°=cos55°. So sin35°×cos55° = cos55°×cos55° = cos²55°. Also: if question has sin²+cos²=1 structure buried inside a complex expression — simplify that part first, it collapses to 1. Saves 90 seconds on trig simplification questions.',
  cards:[
    {front:'Value of sin30°+cos60°+tan45°?', back:'1/2 + 1/2 + 1 = 2. These three values are the most tested. At 30°: sin=cos(at 60°)=1/2. At 45°: tan=1.'},
    {front:'From 30m distance, angle of elevation of tower top is 60°. Tower height?', back:'Height = 30×tan60° = 30×√3 = 30√3 ≈ 51.96m. Direct formula: Height = base × tan(elevation angle).'},
    {front:'sin²17° + sin²73° = ?', back:'sin73°=cos17°. So sin²17°+cos²17°=1. Always simplify complementary pairs to 1.'}
  ],
  q:[
    {q:'If tan θ = 4/3, what is sin θ?', options:['4/5','3/5','4/7','3/7'], answer_index:0, explanation:'tan=4/3 means opposite=4, adjacent=3. Hypotenuse=√(16+9)=5 (3-4-5 triple). sin=opposite/hypotenuse=4/5. Always draw the right triangle for trig ratio problems.'},
    {q:'sin(90°-θ) × tan(θ) is equal to?', options:['sinθ','cosθ','sin²θ/cosθ','tanθ'], answer_index:0, explanation:'sin(90°-θ)=cosθ. So cosθ×tanθ = cosθ × sinθ/cosθ = sinθ. Complementary angle substitution simplifies this instantly.'}
  ],
  pyq:'CGL Tier 1 — 2-3 questions. Heights & distances and identity simplification.',
  summary:'Trig table: sin30=1/2,cos30=√3/2,tan45=1,sin60=√3/2. Identities: sin²+cos²=1,sec²=1+tan²,cosec²=1+cot². Heights: Height=base×tan(elevation). Complementary: sin(90-θ)=cosθ. Always convert to sin/cos for complex simplifications. 3-4-5 triple for tan=4/3 type problems.'
},
{
  day:13, topic:'Mensuration: 2D Shapes',
  notes:[
    {title:'Triangle Formulas', detail:'Area=½×base×height. Area=√(s(s-a)(s-b)(s-c)) where s=(a+b+c)/2 (Heron\'s formula). Equilateral: Area=√3/4×a². Perimeter=3a. Right triangle: Area=½×base×height (legs).'},
    {title:'Quadrilateral Formulas', detail:'Square: Area=a². Perimeter=4a. Diagonal=a√2. Rectangle: Area=lb. Perimeter=2(l+b). Diagonal=√(l²+b²). Parallelogram: Area=base×height. Rhombus: Area=½×d1×d2. Trapezium: Area=½×(sum of parallel sides)×height.'},
    {title:'Circle Formulas', detail:'Area=πr². Circumference=2πr=πd. Sector: Area=θ/360×πr². Arc length=θ/360×2πr. Semicircle: Area=πr²/2. Perimeter of semicircle=πr+2r. π=22/7 or 3.14 (use 22/7 for clean answers in SSC).'},
    {title:'Path/Frame Problems', detail:'Outer rectangle-Inner rectangle = Frame area. If uniform path of width w around rectangle l×b: outer dimensions=(l+2w)×(b+2w). Shaded region = Outer area - Inner area. Common in SSC Applied Maths.'}
  ],
  hook:'⚡ Hall Trick: If diagonal of square=d, then Area=d²/2. If area of square=A, diagonal=√(2A). Example: diagonal=10cm, Area=100/2=50cm². No need to find side first. For rhombus: Area=½×d1×d2 regardless of side length — only diagonals matter.',
  cards:[
    {front:'Area of equilateral triangle with side 6cm?', back:'√3/4×6²=√3/4×36=9√3 cm². ≈9×1.732=15.59cm².'},
    {front:'Diagonal of a square is 10cm. Area?', back:'Area=d²/2=100/2=50cm². Or: side=10/√2=5√2. Area=(5√2)²=50cm². Direct formula is faster.'},
    {front:'Radius of circle is 7cm. Area of sector with angle 90°?', back:'Area=90/360×π×7²=1/4×22/7×49=1/4×154=38.5cm².'}
  ],
  q:[
    {q:'A path of width 2m runs around the outside of a rectangular garden 20m × 15m. Area of path?', options:['148m²','152m²','156m²','160m²'], answer_index:0, explanation:'Outer rectangle: (20+4)×(15+4)=24×19=456m². Inner=20×15=300m². Path area=456-300=156m². Wait: 24×19=456, 456-300=156. Answer is 156m².'},
    {q:'The area of a rhombus is 120cm² and one diagonal is 24cm. The other diagonal is?', options:['8cm','10cm','12cm','14cm'], answer_index:1, explanation:'Area=½×d1×d2. 120=½×24×d2. 120=12×d2. d2=10cm.'}
  ],
  pyq:'CGL Tier 1 — 2-3 questions. Path problems and sector area are high-frequency.',
  summary:'Triangle: Heron\'s formula. Equilateral: √3/4×a². Square diagonal=a√2, Area=d²/2. Rectangle diagonal=√(l²+b²). Rhombus: Area=½d1×d2. Circle: Area=πr², Circumference=2πr. Sector: θ/360×πr². Path: outer-inner area. Use π=22/7 in SSC for clean answers.'
},
{
  day:14, topic:'Mensuration: 3D Shapes & Volume',
  notes:[
    {title:'Cube & Cuboid', detail:'Cube: Volume=a³. Surface Area=6a². Diagonal=a√3. Cuboid: Volume=l×b×h. Surface Area=2(lb+bh+lh). Diagonal=√(l²+b²+h²). Lateral Surface Area=2h(l+b).'},
    {title:'Cylinder, Cone, Sphere', detail:'Cylinder: Volume=πr²h. CSA=2πrh. TSA=2πr(r+h). Cone: Volume=⅓πr²h. Slant height l=√(r²+h²). CSA=πrl. TSA=πr(r+l). Sphere: Volume=4/3πr³. SA=4πr². Hemisphere: Volume=⅔πr³. TSA=3πr².'},
    {title:'Conversion Shortcuts', detail:'When cone melted into sphere: volumes equal. When cylinder cut into cones: volume of cylinder = 3× volume of cone (same base and height). Use this ratio to avoid calculation.'},
    {title:'Frustum', detail:'Frustum (truncated cone): Volume=πh/3(R²+r²+Rr). Slant height=√(h²+(R-r)²). CSA=π(R+r)l. TSA=π(R+r)l+π(R²+r²). Appears in CGL Tier 2.'}
  ],
  hook:'⚡ Hall Trick: Cylinder with same base and height as cone has 3× the cone\'s volume. So if cone volume=x, cylinder=3x. Sphere volume=4/3πr³. If radius doubles, volume increases by 2³=8 times. This scaling relationship eliminates calculation: "What happens to volume if radius triples?" → 27 times. No formula needed.',
  cards:[
    {front:'A cone and cylinder have same base radius and height. Ratio of volumes?', back:'Cone:Cylinder = 1:3. Cylinder volume = 3× cone volume (same dimensions). Use to solve "melt cone into cylinders" problems instantly.'},
    {front:'Slant height of cone with r=3cm, h=4cm?', back:'l=√(r²+h²)=√(9+16)=√25=5cm. Pythagorean triple 3-4-5 — instant answer.'},
    {front:'Surface area of sphere with radius 7cm?', back:'4πr²=4×22/7×49=4×154=616cm².'}
  ],
  q:[
    {q:'A cylinder has radius 7cm and height 10cm. Volume?', options:['1540cm³','1460cm³','1640cm³','1380cm³'], answer_index:0, explanation:'V=πr²h=22/7×49×10=22×70=1540cm³. Always use π=22/7 when radius is multiple of 7 — gives exact integer answers.'},
    {q:'If radius of a sphere is doubled, its volume becomes how many times?', options:['2 times','4 times','6 times','8 times'], answer_index:3, explanation:'Volume∝r³. If r doubles: volume = (2r)³/r³ = 8 times. Scale factor cubed for volume, squared for surface area. No formula calculation needed.'}
  ],
  pyq:'CGL Tier 2 — 3-5 questions. Cylinder-cone conversion and sphere scaling are frequent.',
  summary:'Cube: V=a³,SA=6a²,d=a√3. Cylinder: V=πr²h,CSA=2πrh. Cone: V=⅓πr²h,l=√(r²+h²),CSA=πrl. Sphere: V=4/3πr³,SA=4πr². Cone:Cylinder=1:3(same base+height). Scale: Volume∝r³,Area∝r². Radius doubles→volume×8. Use π=22/7 for multiples of 7.'
},
{
  day:15, topic:'Data Interpretation: Bar Graph & Pie Chart',
  notes:[
    {title:'Bar Graph Strategy', detail:'Step 1: Read the scale carefully (y-axis unit). Step 2: Identify what\'s being compared. Step 3: Calculate only what\'s asked — don\'t calculate all bars. Step 4: Use approximation when options are far apart (within 5% is safe).'},
    {title:'Pie Chart Strategy', detail:'Each 1% = 3.6°. Each degree = 1/3.6%. If a sector is x°: value = x/360 × total. If value is y% of total: angle = y×3.6°. Percentage point difference ≠ percentage difference. Percentage change = (New-Old)/Old × 100.'},
    {title:'Table DI Strategy', detail:'Row totals vs Column totals — read carefully. For "what % does X contribute to Y" — always put the PART on top, WHOLE on bottom. For "% change from Year 1 to Year 2" — use (Y2-Y1)/Y1 × 100.'},
    {title:'Approximation in DI', detail:'If options differ by 10+%: use rough approximation. If options are close (within 2-3 units): calculate carefully. SSC DI rarely needs exact calculations — learn to spot approximation opportunities.'}
  ],
  hook:'⚡ Hall Trick: In pie charts, if a sector shows 25%, its value = Total/4. If 33.33%, value = Total/3. Convert % to fraction FIRST — then multiply by total. 10 seconds vs 30 seconds. For bar graphs: estimate visually if options differ by more than 10% — use finger-width technique on the graph.',
  cards:[
    {front:'A pie chart has total sales ₹7,20,000. One sector is 45°. Its value?', back:'45/360 × 7,20,000 = 1/8 × 7,20,000 = ₹90,000. Convert angle to fraction first (45/360=1/8).'},
    {front:'Sales in 2022=₹8 lakh, 2023=₹10 lakh. % increase?', back:'(10-8)/8 × 100 = 2/8 × 100 = 25%. Always: change/original × 100 (not change/new).'},
    {front:'If two departments have 30% and 25% share in a pie chart, what is the difference in degrees?', back:'5% difference = 5×3.6 = 18°. Shortcut: % to degrees = multiply by 3.6.'}
  ],
  q:[
    {q:'In a pie chart, the agriculture sector occupies 108°. If total revenue is ₹50,000, agriculture revenue is?', options:['₹12,000','₹13,000','₹15,000','₹18,000'], answer_index:2, explanation:'108/360 × 50000 = 3/10 × 50000 = ₹15,000. Convert 108°/360° = 3/10. Then multiply by total.'},
    {q:'From a bar graph: City A sales = 2400, City B = 1800. By what percent are City B sales less than City A?', options:['20%','25%','30%','33.33%'], answer_index:1, explanation:'% less = (2400-1800)/2400 × 100 = 600/2400 × 100 = 25%. Base is City A (the reference). % less always uses the LARGER as denominator.'}
  ],
  pyq:'Every CGL paper — entire DI set (5 questions). Highest marks-per-effort section.',
  summary:'Bar graph: read scale, calculate only what\'s asked, approximate when options far apart. Pie chart: angle/360×total. %=degrees/3.6. Table: part/whole×100. % change=(new-old)/old×100. Approximate aggressively when options differ by 10%+. DI set=5 questions=highest-yield SSC section.'
}
];

async function push() {
  for(const d of days){
    const payload = {
      topic_title:d.topic, day_number:d.day, track:'ssc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ **SSC Hall Trick**: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Speed Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC Speed Master: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL '+d.topic+' tricks'),why:'Best shortcut tutorial.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const {error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:payload,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error) console.error('Day '+d.day+':',error.message);
    else console.log('SSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('SSC Days 11-15 COMPLETE');
}
push();

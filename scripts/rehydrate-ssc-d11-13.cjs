require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:11,topic:'SSC QA: Speed, Time & Distance — Trains & Boats',
intro:`Today we master the 'Relative Motion' concept. In SSC, Time, Speed, and Distance (TSD) isn't just about D=ST; it's about how two moving objects interact. Whether it's a train crossing a platform, a thief being chased by a policeman, or a boat fighting against the current—it's all about 'Relative Speed'. Toppers don't solve these with 3 variables; they use the 'Ratio of Speed' to find the 'Ratio of Time'. Let's master the 'Upstream/Downstream' and 'Relative Speed' logic today.`,
notes:[
{title:'TSD Fundamentals',detail:'1. Distance = Speed × Time. 2. Conversion: kmph to m/s (multiply by 5/18), m/s to kmph (multiply by 18/5). 3. If Distance is constant, Speed ∝ 1/Time (Ratio S₁:S₂ = T₂:T₁). 4. Average Speed = Total Distance / Total Time.'},
{title:'Relative Speed Concept',detail:'Same Direction: Relative Speed = S₁ - S₂. Opposite Direction: Relative Speed = S₁ + S₂. Application: Chasing problems, crossing problems.'},
{title:'Trains Special Cases',detail:'1. Train crossing Pole/Man: Distance = Length of Train. 2. Train crossing Platform/Tunnel: Distance = Length of Train + Length of Platform. 3. Two trains crossing each other: Distance = sum of both lengths. Use Relative Speed.'},
{title:'Boats & Streams',detail:'Let Speed of Boat = x, Speed of Stream = y. Downstream Speed (D) = x + y. Upstream Speed (U) = x - y. Boat Speed in still water (x) = (D + U) / 2. Stream Speed (y) = (D - U) / 2.'},
{title:'Escalators & Circular Tracks',detail:'Circular Track: Time to meet for 1st time = Length of track / Relative Speed. Escalators follow the same logic as Boats & Streams (Walking speed ± Escalator speed).'}
],
cards:[
{front:'Conversion factor: kmph to m/s?',back:'5 / 18.'},
{front:'Relative speed in same direction?',back:'S₁ - S₂.'},
{front:'Boat speed formula from D and U?',back:'(Downstream + Upstream) / 2.'},
{front:'Distance when a train (L₁) crosses a bridge (L₂)?',back:'L₁ + L₂.'},
{front:'Ratio of Time if speeds are in ratio 2:3 (dist constant)?',back:'3:2.'}
],
q:[
{q:'A train 150m long is running at 54 kmph. In how much time will it cross a pole?',options:['8 sec','10 sec','12 sec','15 sec'],ai:1,exp:'Speed = 54 * 5/18 = 15 m/s. Distance = 150m. Time = 150/15 = 10 seconds.'},
{q:'A boat goes 40km downstream in 2 hours and 40km upstream in 4 hours. Find the speed of the stream.',options:['10 kmph','5 kmph','15 kmph','7.5 kmph'],ai:1,exp:'D = 40/2 = 20 kmph. U = 40/4 = 10 kmph. Stream Speed (y) = (D-U)/2 = (20-10)/2 = 5 kmph.'},
{q:'Two trains are running at 45 kmph and 30 kmph in opposite directions. Their lengths are 450m and 550m. Time to cross each other?',options:['40 sec','48 sec','50 sec','54 sec'],ai:1,exp:'Total Distance = 450+550 = 1000m. Relative Speed = 45+30 = 75 kmph = 75 * 5/18 = 125/6 m/s. Time = 1000 / (125/6) = 8 * 6 = 48 seconds.'},
{q:'A man can row 6 kmph in still water. If the speed of the current is 2 kmph, it takes him 3 hours to row to a place and back. How far is the place?',options:['6 km','8 km','10 km','12 km'],ai:1,exp:'D = 6+2=8. U = 6-2=4. Distance = d. d/8 + d/4 = 3 → (d+2d)/8 = 3 → 3d/8 = 3 → d = 8 km.'}
],
hook:'5/18 for m/s. Relative Speed Same(-), Opp(+). Boat (x)=(D+U)/2, (y)=(D-U)/2. Avg speed=2xy/(x+y).',
summary:'Basic TSD relations and conversions. Relative motion logic. Train crossing problems. Boats and Streams formulas. Application of ratios in TSD.'},

{day:12,topic:'SSC QA: Mensuration 2D — Area & Perimeter',
intro:`Today we master 'Shapes'. In SSC, 2D Mensuration is about high-speed formula application and 'Ratio of Areas'. If the radius of a circle doubles, the area becomes 4 times. You must have the formulas for Triangles, Quadrilaterals, and Circles at your fingertips. We also cover the 'Area of Paths' and 'In-circle/Circum-circle' of a triangle—highly frequent topics in SSC Tier 1. Let's build your geometry foundation today.`,
notes:[
{title:'Triangles Formula Sheet',detail:'General Area = ½ × Base × Height. Equilateral: Area = (√3/4)a², Height = (√3/2)a. Scalene (Heron\'s): √[s(s-a)(s-b)(s-c)] where s=(a+b+c)/2. Right-angled: ½ × Product of perpendicular sides.'},
{title:'Quadrilaterals',detail:'Square: Area=a², Perimeter=4a, Diagonal=a√2. Rectangle: Area=l*b, Perim=2(l+b), Diag=√(l²+b²). Rhombus: Area=½*d₁*d₂, Perim=4a (Note: side a=½√(d₁²+d₂²)). Trapezium: Area=½*(sum of parallel sides)*h.'},
{title:'Circle Properties',detail:'Area=πr², Circumference=2πr. Area of Sector = (θ/360) * πr². Length of Arc = (θ/360) * 2πr. Semicircle: Area=½πr², Perim=πr + 2r.'},
{title:'In-circle & Circum-circle',detail:'For Equilateral Triangle: In-radius (r) = a/(2√3), Circum-radius (R) = a/√3. Area ratio R:r = 4:1. For Right Triangle: R = Hypotenuse/2.'},
{title:'Percentage Change in Area',detail:'If length increases by x% and breadth by y%, Area changes by [x + y + (xy/100)]%. For Circle/Square: x=y=r%. Radius up 10% → Area up 21%.'}
],
cards:[
{front:'Area of an Equilateral triangle?',back:'(√3 / 4) * a².'},
{front:'Area of a Rhombus?',back:'½ * d₁ * d₂. (Product of diagonals).'},
{front:'Circum-radius of an equilateral triangle?',back:'a / √3.'},
{front:'In-radius of an equilateral triangle?',back:'a / (2√3).'},
{front:'Radius of circle up 20%. Area change?',back:'20 + 20 + 4 = 44%.'}
],
q:[
{q:'The length of a rectangle is increased by 20% and its breadth is decreased by 10%. Find the % change in area.',options:['10% inc','8% inc','12% inc','5% inc'],ai:1,exp:'20 - 10 - (20*10)/100 = 10 - 2 = 8% increase.'},
{q:'Find the area of an equilateral triangle whose side is 8 cm.',options:['16√3','32√3','64√3','8√3'],ai:0,exp:'Area = (√3/4) * 8² = (√3/4) * 64 = 16√3 cm².'},
{q:'The area of a circle is 154 cm². Find its circumference.',options:['22 cm','44 cm','66 cm','88 cm'],ai:1,exp:'πr² = 154 → 22/7 * r² = 154 → r² = 49 → r = 7. Circumference = 2 * 22/7 * 7 = 44 cm.'},
{q:'The diagonals of a rhombus are 10cm and 24cm. Find its perimeter.',options:['48 cm','52 cm','60 cm','68 cm'],ai:1,exp:'Side a = ½√(10² + 24²) = ½√(100 + 576) = ½√676 = 13. Perimeter = 4 * 13 = 52 cm.'}
],
hook:'Equilateral: h=√3a/2, A=√3a²/4. Rhombus=½d₁d₂. Circle r=7 → A=154, C=44 (Standard). R:r=2:1 (radius), 4:1 (area) for equilateral.',
summary:'Area and Perimeter of Triangles, Quadrilaterals, and Circles. Sector and Arc formulas. In-radius and Circum-radius properties. Percentage change in area.'},

{day:13,topic:'SSC QA: Mensuration 3D — Volume & Surface Area',
intro:`Today we enter the '3rd Dimension'. 3D Mensuration in SSC is a formula game. You must memorize the Volume, Lateral Surface Area (LSA), and Total Surface Area (TSA) for 6 shapes: Cube, Cuboid, Cylinder, Cone, Sphere, and Hemisphere. We also look at 'Melting & Recasting'—the logic that Volume remains constant when you melt one shape to make another. For a topper, the trick is to check 'Divisibility by 11' (since π = 22/7) to quickly eliminate wrong options. Let's master the space today.`,
notes:[
{title:'Cube & Cuboid',detail:'Cuboid: Vol=lbh, TSA=2(lb+bh+hl), Diagonal=√(l²+b²+h²). Cube: Vol=a³, TSA=6a², LSA=4a², Diagonal=a√3.'},
{title:'Cylinder & Cone',detail:'Cylinder: Vol=πr²h, LSA=2πrh, TSA=2πr(r+h). Cone: Vol=⅓πr²h, LSA=πrl, TSA=πr(r+l). Slant height l=√(r²+h²).'},
{title:'Sphere & Hemisphere',detail:'Sphere: Vol=4/3πr³, Surface Area=4πr². Hemisphere: Vol=2/3πr³, LSA=2πr², TSA=3πr².'},
{title:'Melting & Recasting',detail:'When a shape is melted to form another, Volume is conserved. Volume of Old = Volume of New (or n × Volume of small). Surface area CHANGES, only volume stays same.'},
{title:'Frustum & Hollow Shapes',detail:'Frustum of Cone: Vol=⅓πh(R²+r²+Rr). Hollow Cylinder: Vol=π(R²-r²)h. SSC Tier 2 often tests these; Tier 1 focuses on standard shapes.'}
],
cards:[
{front:'Volume of a Sphere?',back:'4/3 * π * r³.'},
{front:'TSA of a Hemisphere?',back:'3 * π * r². (LSA is 2πr² + top circle πr²).'},
{front:'Slant height (l) of a cone?',back:'√(r² + h²).'},
{front:'Diagonal of a cuboid?',back:'√(l² + b² + h²).'},
{front:'Volume of a Cylinder vs Cone (same r, h)?',back:'Cylinder is 3 times the Cone.'}
],
q:[
{q:'A solid sphere of radius 6cm is melted and cast into a cylinder of radius 4cm. Find the height of the cylinder.',options:['12 cm','18 cm','24 cm','36 cm'],ai:1,exp:'Vol Sphere = Vol Cylinder. 4/3 * π * 6³ = π * 4² * h → 4/3 * 216 = 16 * h → 288 = 16 * h → h = 18 cm.'},
{q:'How many cubes of side 2cm can be made from a large cube of side 6cm?',options:['3','9','18','27'],ai:3,exp:'n * Vol(small) = Vol(large). n * 2³ = 6³ → n * 8 = 216 → n = 27.'},
{q:'The radius and height of a cone are in ratio 3:4. If its volume is 301.44 cm³, find slant height. (Take π=3.14)',options:['5 cm','10 cm','15 cm','20 cm'],ai:1,exp:'⅓ * 3.14 * (3x)² * (4x) = 301.44 → ⅓ * 3.14 * 9x² * 4x = 301.44 → 37.68x³ = 301.44 → x³ = 8 → x=2. r=6, h=8. Slant height l = √(6²+8²) = 10.'},
{q:'The TSA of a cube is 150 cm². Find its volume.',options:['100','125','150','216'],ai:1,exp:'TSA = 6a² = 150 → a² = 25 → a = 5. Volume = 5³ = 125 cm³.'}
],
hook:'Sphere Vol=4/3πr³. Hemisphere TSA=3πr². Cylinder:Cone Vol=3:1. Melting = Volume conservation. Check options for div by 11 (π factor).',
summary:'Volume and Surface area of 3D shapes. Slant height and diagonal formulas. Logic of melting and recasting. Standard shapes: Cube, Cuboid, Cylinder, Cone, Sphere.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Speed Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Speed Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL '+d.topic+' formulas'),why:'Visualizing 2D and 3D geometry for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High PYQ',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('SSC Days 11-13 v2 COMPLETE');
}
push();

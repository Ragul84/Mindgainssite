require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:71,topic:'SSC Quant: Trigonometry — Ratios & Identities',
intro:`Today we study the 'Angles of Success'. Trigonometry in SSC is about 'Complementary angles' and 'Standard values'. From sin(90-x) = cos x to the Pythagorean identities—the game is about 'Value Putting'. Do you know the value of tan 45°? Or the identity for sin^2 + cos^2? Let's master the triangles today.`,
notes:[
{title:'Basic Ratios (PBP/HHB)',detail:'sin = P/H, cos = B/H, tan = P/B. cosec = 1/sin, sec = 1/cos, cot = 1/tan.'},
{title:'Standard Values (Memorize!)',detail:'0°, 30°, 45°, 60°, 90°. (e.g., sin 30 = 1/2, sin 45 = 1/sqrt(2), sin 60 = sqrt(3)/2, sin 90 = 1).'},
{title:'Identities',detail:'1. sin^2 x + cos^2 x = 1. 2. 1 + tan^2 x = sec^2 x. 3. 1 + cot^2 x = cosec^2 x.'},
{title:'Complementary Angles',detail:'sin(90-x) = cos x, tan(90-x) = cot x, sec(90-x) = cosec x. If A+B=90°, then sin A = cos B, tan A * tan B = 1.'},
{title:'Value Putting Trick',detail:'If options are numerical, try putting x = 45° or 0°/90° (avoiding undefined values) to find the answer in seconds.'}
],
cards:[
{front:'sin^2 x + cos^2 x = ?',back:'1.'},
{front:'Value of tan 45°?',back:'1.'},
{front:'sec^2 x - tan^2 x = ?',back:'1.'},
{front:'If A+B=90°, tan A * tan B = ?',back:'1.'},
{front:'sin 60° = ?',back:'sqrt(3) / 2.'}
],
q:[
{q:'Find the value of: sin 10° / cos 80°',options:['0','1','1/2','sqrt(3)/2'],ai:1,exp:'sin 10 = cos (90-10) = cos 80. So the ratio is 1.'},
{q:'If tan x = 1, then the value of x is:',options:['30°','45°','60°','90°'],ai:1,exp:'Standard value.'},
{q:'Find the value of: tan 1° * tan 2° * ... * tan 89°',options:['0','1','Infinity','1/2'],ai:1,exp:'tan 1 * tan 89 = 1, tan 2 * tan 88 = 1, ..., tan 45 = 1. All pairs give 1.'},
{q:'1 + tan^2 x is equal to:',options:['sin^2 x','cos^2 x','sec^2 x','cosec^2 x'],ai:2,exp:'Standard identity.'}
],
hook:'sin^2+cos^2=1. tan 45=1. A+B=90 -> tanA*tanB=1. Value putting: x=45. sin(90-x)=cos x.',
summary:'Trigonometric ratios and standard value tables. Detailed study of fundamental identities. Application of complementary angle rules and value-putting techniques.'},

{day:72,topic:'SSC Quant: Trigonometry — Heights & Distances',
intro:`Today we study the 'Practical Vision'. Heights and Distances use Trigonometry to find how tall a building is or how far a ship is from a lighthouse. In SSC, '30-60-90' and '45-45-90' triangles are your best friends. Do you know the side ratios for a 30-60-90 triangle? Let's master the elevations today.`,
notes:[
{title:'Angle of Elevation',detail:'Looking UP from horizontal line.'},
{title:'Angle of Depression',detail:'Looking DOWN from horizontal line. Equal to angle of elevation from the object due to alternate interior angles.'},
{title:'The 45-45-90 Triangle',detail:'Ratio of sides (Base : Perp : Hyp) = 1 : 1 : sqrt(2).'},
{title:'The 30-60-90 Triangle',detail:'Ratio of sides (Side opp to 30 : Side opp to 60 : Hyp) = 1 : sqrt(3) : 2.'},
{title:'Multi-triangle problems',detail:'Moving towards or away from an object. Use the tangent ratios of both angles and equate the height.'}
],
cards:[
{front:'Side ratio of 45-45-90 triangle?',back:'1 : 1 : sqrt(2).'},
{front:'Side ratio of 30-60-90 triangle?',back:'1 : sqrt(3) : 2.'},
{front:'Angle of Elevation = ?',back:'Angle of Depression.'},
{front:'tan 30°?',back:'1 / sqrt(3).'},
{front:'tan 60°?',back:'sqrt(3).'}
],
q:[
{q:'A ladder 10m long reaches a window 5m high. Angle of elevation?',options:['30°','45°','60°','90°'],ai:0,exp:'sin x = 5/10 = 1/2. So x = 30°.'},
{q:'The shadow of a tower is sqrt(3) times its height. Angle of elevation of the sun?',options:['30°','45°','60°','90°'],ai:0,exp:'tan x = H / (H * sqrt(3)) = 1/sqrt(3). So x = 30°.'},
{q:'From a point 30m away from a building, the angle of elevation to the top is 45°. Height?',options:['30m','15m','30sqrt(3)m','60m'],ai:0,exp:'tan 45 = H/30 => 1 = H/30 => H = 30m.'},
{q:'A kite is flying at a height of 75m. The string makes an angle of 60° with the ground. Length of string?',options:['50sqrt(3)','75sqrt(3)','150','100'],ai:0,exp:'sin 60 = 75/L => sqrt(3)/2 = 75/L => L = 150/sqrt(3) = 50sqrt(3).'}
],
hook:'30-60-90=1:sqrt(3):2. 45-45-90=1:1:sqrt(2). tan 30=1/sqrt(3). tan 60=sqrt(3). Elev=Depress.',
summary:'Concepts of elevation and depression. Shortcut side ratios for standard right triangles. Solving real-world height and distance scenarios with minimal calculation.'},

{day:73,topic:'SSC Quant: Mensuration 2D — Area & Perimeter',
intro:`Today we study the 'Flat World'. Mensuration 2D is about 'Formulas' for Triangle, Square, Rectangle, Circle, and Rhombus. In SSC, 'Pathway problems' and 'Percentage change in area' are frequent. Do you know how the area changes if the radius of a circle is doubled? Let's master the perimeters today.`,
notes:[
{title:'Triangle Formulas',detail:'1. Basic: 1/2 * b * h. 2. Heron\'s: sqrt[s(s-a)(s-b)(s-c)]. 3. Equilateral: (sqrt(3)/4) * a^2.'},
{title:'Quadrilaterals',detail:'1. Square: a^2 (Area), 4a (Perim). 2. Rectangle: l*w (Area), 2(l+w) (Perim). 3. Rhombus: 1/2 * d1 * d2. 4. Parallelogram: Base * Height.'},
{title:'Circle',detail:'Area = πr^2. Circumference = 2πr. Area of sector = (θ/360) * πr^2. Arc length = (θ/360) * 2πr.'},
{title:'Percentage Change',detail:'If side changes by x%, Area changes by x + x + x^2/100. (e.g., side +10% -> Area +21%).'},
{title:'In-circle & Circum-circle',detail:'Equilateral triangle: In-radius = a/(2*sqrt(3)), Circum-radius = a/sqrt(3). Ratio 1:2.'}
],
cards:[
{front:'Area of Equilateral Triangle?',back:'(sqrt(3) / 4) * a^2.'},
{front:'Area of Rhombus?',back:'1/2 * d1 * d2.'},
{front:'Circumference of a Circle?',back:'2 * pi * r.'},
{front:'If radius doubles, Area increases by?',back:'300% (becomes 4x).'},
{front:'Area of Sector?',back:'(theta / 360) * pi * r^2.'}
],
q:[
{q:'Find the area of an equilateral triangle with side 4cm.',options:['4sqrt(3)','8sqrt(3)','16sqrt(3)','4'],ai:0,exp:'(sqrt(3)/4) * 16 = 4sqrt(3).'},
{q:'The length and breadth of a rectangle are increased by 10% and 20%. Net area change?',options:['30%','32%','28%','35%'],ai:1,exp:'10 + 20 + (200/100) = 32%.'},
{q:'If the circumference of a circle is 44cm, find its area.',options:['154 cm^2','77 cm^2','144 cm^2','132 cm^2'],ai:0,exp:'2 * 22/7 * r = 44 => r = 7. Area = 22/7 * 49 = 154.'},
{q:'The diagonals of a rhombus are 10cm and 24cm. Its perimeter is:',options:['52cm','48cm','60cm','68cm'],ai:0,exp:'Side^2 = 5^2 + 12^2 = 169 => Side=13. Perim = 4*13 = 52.'}
],
hook:'Equi=(sqrt3/4)a^2. Rhombus=1/2d1d2. Side +10% -> Area +21%. r=7 -> Area=154 (Memorize!). r=14 -> Area=616.',
summary:'Comprehensive list of 2D mensuration formulas. Calculation of area and perimeter for triangles and quadrilaterals. Circle properties and percentage change patterns.'},

{day:74,topic:'SSC Quant: Mensuration 3D — Volume & Surface Area',
intro:`Today we study the 'Space of Objects'. Mensuration 3D is about 'Volume' and 'Surface Area' of Cube, Cuboid, Cylinder, Cone, and Sphere. In SSC, 'Melting and Recasting' problems are high-yield. Do you know why Volume remains constant when you melt a sphere to make a cone? Let's master the volumes today.`,
notes:[
{title:'Cube & Cuboid',detail:'Cube: a^3 (Vol), 6a^2 (TSA), a*sqrt(3) (Diag). Cuboid: lbh (Vol), 2(lb+bh+hl) (TSA), sqrt(l^2+b^2+h^2) (Diag).'},
{title:'Cylinder',detail:'Vol = πr^2h. CSA = 2πrh. TSA = 2πr(r+h).'},
{title:'Cone',detail:'Vol = 1/3 * πr^2h. CSA = πrl (l=slant height). l = sqrt(r^2+h^2).'},
{title:'Sphere & Hemisphere',detail:'Sphere: 4/3 * πr^3 (Vol), 4πr^2 (SA). Hemisphere: 2/3 * πr^3 (Vol), 2πr^2 (CSA), 3πr^2 (TSA).'},
{title:'Melting Rule',detail:'When one solid is melted to form another, the TOTAL VOLUME remains the same. (e.g., n * Vol of small = Vol of large).'}
],
cards:[
{front:'Volume of a Cone?',back:'1/3 * pi * r^2 * h.'},
{front:'Total Surface Area of Hemisphere?',back:'3 * pi * r^2.'},
{front:'Diagonal of a Cube?',back:'side * sqrt(3).'},
{front:'Volume of a Sphere?',back:'4/3 * pi * r^3.'},
{front:'If side of cube doubles, Volume increases by?',back:'700% (becomes 8x).'}
],
q:[
{q:'Find the volume of a sphere with radius 3cm.',options:['12pi','24pi','36pi','48pi'],ai:2,exp:'4/3 * pi * 27 = 36pi.'},
{q:'A cylinder and a cone have the same radius and height. Ratio of their volumes?',options:['1:1','1:3','3:1','2:3'],ai:2,exp:'pi*r^2*h : (1/3)*pi*r^2*h = 3 : 1.'},
{q:'How many small cubes of side 2cm can be made from a large cube of side 6cm?',options:['9','27','18','3'],ai:1,exp:'(6*6*6) / (2*2*2) = 3*3*3 = 27.'},
{q:'If the radius of a cylinder is doubled and height is halved, its volume:',options:['Remains same','Doubles','Is halved','Becomes 4 times'],ai:1,exp:'pi * (2r)^2 * (h/2) = pi * 4r^2 * h/2 = 2 * (pi*r^2*h).'}
],
hook:'Cube=a^3. Cone=1/3 Cyl. Sphere=4/3pi r^3. Hemi TSA=3pi r^2. Melting=Volume constant. Diag=sqrt(l^2+b^2+h^2).',
summary:'Detailed list of 3D mensuration formulas for all standard solids. Solving melting and recasting problems. Relationship between radius/height changes and volume.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Quant Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Quant Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL Quant '+d.topic),why:'Mastering formula-based advance quant for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Quant',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

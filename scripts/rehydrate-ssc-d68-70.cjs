require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:68,topic:'SSC Quant: Geometry — Lines, Angles & Triangles',
intro:`Today we study the 'Shape of Logic'. Geometry is about 'Properties' and 'Theorems'. From 'Alternate angles' to the 'Centroid' and 'Incenter' of a triangle—the facts are visual. In SSC, 'Similarity' and 'Congruency' are high-yield. Do you know why the angle in a semi-circle is 90°? Or the property of the 'External Angle' of a triangle? Let's master the triangles today.`,
notes:[
{title:'Lines & Angles',detail:'1. Complementary (Sum=90°). 2. Supplementary (Sum=180°). 3. Parallel lines cut by transversal: Alternate and Corresponding angles are equal.'},
{title:'Triangle Basics',detail:'Sum of angles = 180°. External angle = Sum of opposite interior angles. Sum of two sides > Third side.'},
{title:'Centers of Triangle',detail:'1. Centroid: Intersection of Medians (divides 2:1). 2. Incenter: Intersection of Angle Bisectors. 3. Circumcenter: Intersection of Perpendicular Bisectors. 4. Orthocenter: Intersection of Altitudes.'},
{title:'Similarity & Congruency',detail:'Congruent (Same size and shape - SSS, SAS, ASA, RHS). Similar (Same shape, different size - Ratio of sides is constant). Area ratio = (Side ratio)^2.'},
{title:'Pythagoras Triplets',detail:'(3,4,5), (5,12,13), (7,24,25), (8,15,17), (9,40,41). Memorize these for speed!'}
],
cards:[
{front:'Centroid divides median in what ratio?',back:'2 : 1 (from vertex).'},
{front:'Sum of two sides of triangle is always?',back:'Greater than the third side.'},
{front:'What is the External Angle equal to?',back:'Sum of opposite interior angles.'},
{front:'Pythagoras triplet with 7?',back:'7, 24, 25.'},
{front:'Area ratio of similar triangles?',back:'(Corresponding side ratio)^2.'}
],
q:[
{q:'In a triangle ABC, angle B = 60° and angle C = 40°. Find the external angle at A.',options:['100°','120°','80°','140°'],ai:0,exp:'Ext angle at A = Sum of interior B and C = 60 + 40 = 100°.'},
{q:'If two triangles are similar and their side ratio is 3:5, what is the ratio of their areas?',options:['3:5','6:10','9:25','27:125'],ai:2,exp:'Area ratio = (3/5)^2 = 9/25.'},
{q:'The "Centroid" of a triangle is the point of intersection of:',options:['Altitudes','Angle Bisectors','Medians','Perpendicular Bisectors'],ai:2,exp:'Medians connect vertex to midpoint of opposite side.'},
{q:'Which of the following can be sides of a triangle?',options:['2, 3, 5','3, 4, 8','5, 6, 10','1, 2, 4'],ai:2,exp:'5+6 > 10. For others, sum of two <= third.'}
],
hook:'Centroid=2:1/Medians. Ext angle=Sum of opp int. Similar areas=Side^2. 5,12,13=Triplet. Sum 2 sides > 3rd.',
summary:'Properties of lines and angles. Detailed study of triangle centers and their characteristics. Criteria for similarity and congruency. Practical application of Pythagoras triplets.'},

{day:69,topic:'SSC Quant: Geometry — Circles & Polygons',
intro:`Today we study the 'Curve and the Border'. Circles and Quadrilaterals (Square, Rectangle, Rhombus, Parallelogram) form the bulk of SSC Geometry. Questions focus on 'Tangents', 'Chords', and 'Angle properties'. Do you know the 'Alternate Segment Theorem'? Or why the diagonals of a rhombus bisect at 90°? Let's master the circles today.`,
notes:[
{title:'Circle Properties',detail:'1. Angle in a semi-circle is 90°. 2. Angle at center is double the angle at circumference. 3. Angles in the same segment are equal.'},
{title:'Chords & Tangents',detail:'1. Perpendicular from center bisects the chord. 2. Equal chords are equidistant from center. 3. Tangent is perpendicular to radius. 4. Tangents from external point are equal.'},
{title:'Quadrilaterals',detail:'1. Parallelogram: Opp sides equal/parallel. 2. Rhombus: All sides equal, diagonals bisect at 90°. 3. Trapezium: One pair of parallel sides.'},
{title:'Cyclic Quadrilateral',detail:'All 4 vertices on a circle. Sum of opposite angles = 180°.'},
{title:'Polygons',detail:'Sum of interior angles = (n-2)*180. Sum of exterior angles = 360°. Each exterior angle (Regular) = 360/n.'}
],
cards:[
{front:'Sum of opposite angles in cyclic quad?',back:'180°.'},
{front:'Angle in a semi-circle?',back:'90°.'},
{front:'Diagonals of Rhombus bisect at?',back:'90°.'},
{front:'Sum of exterior angles of any polygon?',back:'360°.'},
{front:'Formula for sum of interior angles?',back:'(n-2) * 180.'}
],
q:[
{q:'A "Cyclic Quadrilateral" has opposite angles in ratio 4:5. Find the larger angle.',options:['80°','100°','90°','120°'],ai:1,exp:'4x + 5x = 180 => 9x = 180 => x = 20. Larger = 5*20 = 100°.'},
{q:'What is the each "Exterior Angle" of a regular Hexagon?',options:['60°','120°','90°','45°'],ai:0,exp:'360 / 6 = 60°.'},
{q:'Two tangents are drawn from a point P to a circle with center O. If angle T1PT2 = 60°, then angle T1OT2 is:',options:['60°','120°','90°','150°'],ai:1,exp:'Angle at center and angle at external point are supplementary (Sum=180). 180 - 60 = 120°.'},
{q:'A chord of length 8cm is at a distance of 3cm from the center. Find the radius.',options:['4cm','5cm','6cm','7cm'],ai:1,exp:'Perp bisects chord (4cm). Triangle with 3 and 4 gives hypotenuse (radius) = 5cm.'}
],
hook:'Cyclic=180. Semi-circle=90. Rhombus=90 diag. Ext sum=360. Int sum=(n-2)*180. Tangent=90 to radius.',
summary:'Fundamental theorems of circles. Properties of special quadrilaterals. Angle calculation for regular polygons. Application of chord and tangent properties.'},

{day:70,topic:'SSC REVISION: Quant Advance Part 1 (Days 64–69)',
intro:`Today we consolidate the 'Geometric and Algebraic' power. You have mastered Time/Work, Speed/Distance, Algebraic Identities, and the entire core of Geometry. In SSC, the 'Advance' section separates the toppers from the rest. Today, we drill the theorems and the identities. If you see 'a+b+c=0', you say '3abc'. If you see 'Centroid', you say '2:1'. Let's lock in the advance marks today.`,
notes:[
{title:'Algebra Recap',detail:'(x+1/x)=k -> x^2+1/x^2=k^2-2. a+b+c=0 -> a^3+b^3+c^3=3abc. Quadratic: Sum=-b/a, Prod=c/a.'},
{title:'Arithmetic Advance Recap',detail:'Time/Work: Eff*Time=Work. LCM method. TSD: km/h to m/s (*5/18). Boat: Down=B+S, Up=B-S.'},
{title:'Triangle Recap',detail:'Centroid (2:1/Medians). Similarity Area ratio = Side ratio squared. Pythagoras triplets (3,4,5), (5,12,13).'},
{title:'Circle/Polygon Recap',detail:'Semi-circle=90. Cyclic Quad=180. Ext sum=360. Int sum=(n-2)*180. Rhombus diag=90.'},
{title:'Efficiency Trick',detail:'Efficiency ratio 3:2 -> Time ratio 2:3. Inverse relationship is crucial.'}
],
cards:[
{front:'If x + 1/x = 2, then x = ?',back:'1 (always).'},
{front:'Area ratio of similar triangles with side 2:3?',back:'4:9.'},
{front:'Sum of roots formula?',back:'-b / a.'},
{front:'Formula for Third Proportional of a,b?',back:'b^2 / a.'},
{front:'Diagonal of a Square?',back:'side * sqrt(2).'}
],
q:[
{q:'If x^2 + 1/x^2 = 7, find x + 1/x (positive).',options:['2','3','4','5'],ai:1,exp:'(x+1/x)^2 = 7+2 = 9. So x+1/x = 3.'},
{q:'A train of length 150m crosses a 250m bridge in 20 seconds. Speed?',options:['20 m/s','40 m/s','10 m/s','25 m/s'],ai:0,exp:'Total dist = 400. Time = 20. Speed = 400/20 = 20 m/s.'},
{q:'The sum of interior angles of a "Pentagon" is:',options:['360°','540°','720°','180°'],ai:1,exp:'(5-2)*180 = 3*180 = 540°.'},
{q:'A is 3 times efficient as B. A can finish a work in 60 days less than B. B alone can do it in:',options:['90 days','120 days','60 days','30 days'],ai:0,exp:'Eff 3:1 -> Time 1:3. Diff 2 units = 60. 1 unit = 30. B = 3 units = 90.'}
],
hook:'Advance complete. Fact drill. Master the formulas. Geometry=Properties. Algebra=Identities.',
summary:'Full revision of advanced arithmetic and core geometry. High-speed drill of algebraic and geometric theorems. Comparison of efficiency and motion shortcuts. Final Quant Part 2 mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Quant Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Quant Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL Quant '+d.topic),why:'Consolidating advanced geometry for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

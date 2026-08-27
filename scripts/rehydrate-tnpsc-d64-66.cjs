require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:64,topic:'TNPSC Aptitude: Mensuration 3D',
intro:`Today we study the 'Geometry of Volume'. 3D Mensuration is a premium chapter in TNPSC. In TNPSC, 'Ratios of Volumes' (e.g., Sphere vs Cylinder) and 'Surface Area' are the most frequent targets. Do you know the volume of a sphere? Or how volume changes if the radius is halved? Let's master the space today.`,
notes:[
{title:'Cube & Cuboid',detail:'Cube: Vol=a^3, TSA=6a^2. Cuboid: Vol=lbh, TSA=2(lb+bh+hl).'},
{title:'Cylinder',detail:'Vol=pi*r^2*h. CSA=2*pi*r*h. TSA=2*pi*r(h+r).'},
{title:'Cone',detail:'Vol=(1/3)pi*r^2*h. CSA=pi*r*l (where l=slant height).'},
{title:'Sphere & Hemisphere',detail:'Sphere: Vol=(4/3)pi*r^3, TSA=4*pi*r^2. Hemisphere: Vol=(2/3)pi*r^3, TSA=3*pi*r^2.'},
{title:'Comparison of Solids',detail:'If a sphere is melted to form a cone, their volumes are equal. Ratio of Vol (Cylinder:Cone:Sphere) for same r/h is 3:1:2.'}
],
cards:[
{front:'Volume of Sphere?',back:'(4/3) * pi * r^3.'},
{front:'Volume of Cone?',back:'(1/3) * pi * r^2 * h.'},
{front:'TSA of Hemisphere?',back:'3 * pi * r^2.'},
{front:'Vol of Cube if side=4?',back:'64.'},
{front:'Cylinder:Cone volume ratio?',back:'3:1.'}
],
q:[
{q:'Find the volume of a sphere with radius 7cm.',options:['1437.33','1500','1300','1600'],ai:0,exp:'(4/3) * (22/7) * 343 = 1437.33.'},
{q:'If the side of a cube is doubled, its volume increases by:',options:['2 times','4 times','8 times','None'],ai:2,exp:'(2a)^3 = 8a^3.'},
{q:'Find the TSA of a cylinder with r=7 and h=10.',options:['748','800','700','650'],ai:0,exp:'2 * (22/7) * 7 * (10+7) = 44 * 17 = 748.'},
{q:'A cone has r=3 and h=4. What is its slant height (l)?',options:['5','7','6','8'],ai:0,exp:'sqrt(3^2 + 4^2) = 5.'}
],
hook:'Sphere=4/3 pir3. Cone=1/3 pir2h. Cube=a3. Melted=Volume same. r=7/Sphere Vol=1437.33.',
summary:'Surface area and volume formulas for major 3D solids. Solving melting and recasting problems. Comparative analysis of cylinder, cone, and sphere volumes.'},

{day:65,topic:'TNPSC Aptitude: HCF & LCM / Probability',
intro:`Today we study the 'Cycles and Chances'. HCF and LCM are the foundation of number theory, and Probability is about 'Total vs Favorable'. In TNPSC, 'Ratio of numbers & their HCF' and 'Dice/Card probability' are staple. Do you know the relation between Product of numbers and HCF/LCM? Let's master the numbers today.`,
notes:[
{title:'HCF & LCM Relation',detail:'HCF * LCM = Product of two numbers. (Applicable only for two numbers).'},
{title:'HCF & LCM of Fractions',detail:'HCF = HCF(Num) / LCM(Den). LCM = LCM(Num) / HCF(Den).'},
{title:'LCM Applications',detail:'Finding when bells ring together or when runners meet. Find the smallest number divisible by x,y,z.'},
{title:'Probability Basics',detail:'P(E) = Favorable / Total. Value is always between 0 and 1.'},
{title:'Dice & Coins',detail:'Coin: 1 (2 outcomes), 2 (4 outcomes). Dice: 1 (6 outcomes), 2 (36 outcomes).'}
],
cards:[
{front:'HCF * LCM = ?',back:'Product of the two numbers.'},
{front:'HCF of fractions?',back:'HCF(Num) / LCM(Den).'},
{front:'Total outcomes of 2 dice?',back:'36.'},
{front:'Probability of a Sure Event?',back:'1.'},
{front:'Probability of an Impossible Event?',back:'0.'}
],
q:[
{q:'The HCF and LCM of two numbers are 12 and 72. If one is 24, find the other.',options:['36','48','60','72'],ai:0,exp:'(12 * 72) / 24 = 36.'},
{q:'Find the HCF of 2/3 and 4/5.',options:['2/15','4/15','1/15','None'],ai:0,exp:'HCF(2,4)=2. LCM(3,5)=15. Result = 2/15.'},
{q:'Three bells ring at intervals of 10, 15, and 20 mins. When will they ring together next?',options:['30 mins','45 mins','60 mins','120 mins'],ai:2,exp:'LCM(10,15,20) = 60.'},
{q:'Probability of getting a sum of 7 when two dice are thrown?',options:['1/6','1/12','5/36','None'],ai:0,exp:'Favorable: (1,6),(6,1),(2,5),(5,2),(3,4),(4,3) = 6. 6/36 = 1/6.'}
],
hook:'HCF*LCM=Prod. Fraction HCF=HCF/LCM. Bell ring=LCM. Prob=Fav/Total. Dice 2=36.',
summary:'Core number theory concepts: HCF and LCM. Formulaic approach to fractional HCF/LCM. Practical application in cyclic events. Introduction to classical probability scenarios.'},

{day:66,topic:'TNPSC Aptitude: DI & Statistics',
intro:`Today we study the 'Summary of Data'. Data Interpretation (DI) and Statistics are calculation-heavy. In TNPSC, 'Mean, Median, Mode' and 'Pie Charts' are the main targets. Do you know the empirical relation between Mean, Median, and Mode? Let's master the data today.`,
notes:[
{title:'Mean, Median, Mode',detail:'Mean = Sum/n. Median = Middle value (when sorted). Mode = Most frequent value.'},
{title:'Empirical Relation',detail:'Mode = 3 Median - 2 Mean. (Golden formula for TNPSC).'},
{title:'Range & Standard Deviation',detail:'Range = Max - Min. SD = sqrt(Variance). Measures of dispersion.'},
{title:'Data Interpretation (Pie Chart)',detail:'Total = 360 degrees = 100%. Convert deg to % by dividing by 3.6.'},
{title:'DI (Bar & Line)',detail:'Focus on Percentage increase/decrease and Averages across years.'}
],
cards:[
{front:'Mode formula?',back:'3 Median - 2 Mean.'},
{front:'Median of 2, 4, 6, 8, 10?',back:'6.'},
{front:'360 degrees in %?',back:'100%.'},
{front:'Range of 10, 20, 5, 40?',back:'35 (40-5).'},
{front:'Measure of central tendency?',back:'Mean/Median/Mode.'}
],
q:[
{q:'If Mean = 10 and Median = 12, find the Mode.',options:['14','16','18','20'],ai:1,exp:'Mode = 3(12) - 2(10) = 36 - 20 = 16.'},
{q:'Find the median of: 7, 5, 10, 12, 4.',options:['7','10','5','None'],ai:0,exp:'Sorted: 4, 5, 7, 10, 12. Middle = 7.'},
{q:'In a pie chart, an item has 72 degrees. What is its percentage?',options:['10%','20%','30%','25%'],ai:1,exp:'72 / 3.6 = 20%.'},
{q:'The mode of the data (5, 5, 5, 6, 6, 7) is:',options:['5','6','7','None'],ai:0,exp:'5 repeats most often.'}
],
hook:'Mode=3Med-2Mean. Median=Sort/Middle. Pie=Deg/3.6. DI=Scan axes. Range=Max-Min.',
summary:'Calculating measures of central tendency. Using the empirical relation between mean, median, and mode. Techniques for rapid data extraction from pie and bar charts.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC Aptitude Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'TN Aptitude Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Aptitude '+d.topic),why:'Mastering advance aptitude for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Aptitude',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:75,topic:'SSC Quant: Data Interpretation (DI)',
intro:`Today we study the 'Language of Charts'. Data Interpretation is about extracting information from Bar, Pie, Line, and Tabular charts. In SSC, DI questions are calculation-heavy but conceptually easy. The key is 'Speed' and 'Approximation'. Do you know how to quickly convert degrees in a pie chart to percentages? Let's master the data today.`,
notes:[
{title:'Pie Chart Trick',detail:'360° = 100%. So, 3.6° = 1%. To convert degrees to %, divide by 3.6. To convert % to degrees, multiply by 3.6.'},
{title:'Bar & Line Graphs',detail:'Read the axes carefully. Watch for the units (thousands, lakhs, millions). Usually involves Percentage Change or Averages.'},
{title:'Tabular DI',detail:'Most common in CGL Tier 2. Requires fast addition and subtraction. Focus on row/column totals.'},
{title:'Ratio & Comparison',detail:'Comparing growth rates or finding ratios between different years/categories.'},
{title:'Approximation',detail:'Don\'t calculate exact values if options are far apart. Round off numbers (e.g., 543 to 540) for speed.'}
],
cards:[
{front:'360 degrees = ? percent?',back:'100%.'},
{front:'1 percent = ? degrees?',back:'3.6 degrees.'},
{front:'Key to DI success?',back:'Speed and Approximation.'},
{front:'DI usually tests which 3 chapters?',back:'Percentage, Ratio, Average.'},
{front:'18 degrees in pie chart = ? %',back:'5% (18 / 3.6).'}
],
q:[
{q:'In a Pie chart, a sector represents 15% of total. Its central angle is:',options:['36°','54°','60°','72°'],ai:1,exp:'15 * 3.6 = 54°.'},
{q:'If the ratio of production in Year 1 to Year 2 is 4:5, what is the % increase?',options:['20%','25%','10%','15%'],ai:1,exp:'(1/4)*100 = 25%.'},
{q:'To find the "Average Production" over 5 years, we:',options:['Add all and divide by 5','Take the middle value','Multiply all','Add first and last'],ai:0,exp:'Standard average definition.'},
{q:'A sector in a pie chart is 72°. What part of the total does it represent?',options:['1/4','1/5','1/3','1/6'],ai:1,exp:'72 / 360 = 1/5.'}
],
hook:'360=100%. 1%=3.6. DI=Perc+Ratio+Avg. Approx for speed. Read units carefully.',
summary:'Techniques for interpreting various chart types. Conversion formulas for pie charts. Strategies for fast calculation and approximation in DI. Role of percentage and ratio in data analysis.'},

{day:76,topic:'SSC Quant: Statistics & Probability',
intro:`Today we study 'Chance and Variation'. With the new CGL pattern, Statistics (Mean, Median, Mode, Std Dev) and Probability have become vital. In SSC, 'Simple Probability' and 'Central Tendency' are frequent. Do you know the relation between Mean, Median, and Mode? Or the probability of getting a sum of 7 with two dice? Let's master the uncertainty today.`,
notes:[
{title:'Central Tendency',detail:'1. Mean: Average. 2. Median: Middle value (arranged in order). 3. Mode: Most frequent value. Empirical Relation: Mode = 3*Median - 2*Mean.'},
{title:'Measures of Dispersion',detail:'Range (Max-Min). Variance (Mean of squares of deviations). Standard Deviation (sqrt of Variance).'},
{title:'Probability Basics',detail:'P(A) = Favorable Outcomes / Total Outcomes. Range: 0 to 1.'},
{title:'Coins & Dice',detail:'Coins: 2^n total outcomes. Dice: 6^n total outcomes. (e.g., 2 dice = 36 outcomes).'},
{title:'Cards',detail:'52 cards. 4 suits (Spade, Heart, Diamond, Club). 13 each. 12 Face cards (J, Q, K).'}
],
cards:[
{front:'Mode = ? * Median - ? * Mean',back:'3 * Median - 2 * Mean.'},
{front:'Standard Deviation = ?',back:'sqrt(Variance).'},
{front:'Total outcomes of 2 dice?',back:'36.'},
{front:'Probability of a certain event?',back:'1.'},
{front:'Median of 2, 5, 8, 3, 10?',back:'5 (Sorted: 2, 3, 5, 8, 10).'}
],
q:[
{q:'The Mean of 5 numbers is 20 and Median is 18. Find the Mode.',options:['12','14','16','18'],ai:1,exp:'Mode = 3(18) - 2(20) = 54 - 40 = 14.'},
{q:'What is the probability of getting a "Head" in a single coin toss?',options:['1/2','1/4','1','0'],ai:0,exp:'Standard probability.'},
{q:'Find the probability of drawing a "Red Card" from a deck of 52.',options:['1/4','1/2','1/13','1/52'],ai:1,exp:'26/52 = 1/2.'},
{q:'Two dice are thrown. What is the probability of getting a sum of 12?',options:['1/6','1/12','1/36','1/18'],ai:2,exp:'Only one outcome (6,6) out of 36.'}
],
hook:'Mode=3Med-2Mean. SD=sqrt(Var). Dice=36. Coins=4. Red cards=26. Face=12.',
summary:'Definitions and formulas for Mean, Median, and Mode. Relationship between measures of central tendency. Calculation of variance and standard deviation. Introduction to basic probability rules.'},

{day:77,topic:'SSC REVISION: Advanced Quant Finale (Days 71–76)',
intro:`Today we wrap up 'SSC Quantitative Aptitude'. You have traveled from the basic numbers to the complex geometry, trigonometry, and the new statistics. SSC Quant is 50% knowledge and 50% 'Shortcuts'. Today, we consolidate the final formulas. If you see '30-60-90', you say '1:sqrt3:2'. If you see '360 deg', you say '100%'. Let's lock in the Quant mastery today.`,
notes:[
{title:'Trig Recap',detail:'sin^2+cos^2=1. tan 45=1. Heights: 30-60-90 (1:sqrt3:2). Value putting trick.'},
{title:'Mensuration Recap',detail:'Equilateral=(sqrt3/4)a^2. Circle r=7/Area=154. Sphere=4/3pi r^3. Hemi TSA=3pi r^2.'},
{title:'DI Recap',detail:'3.6 deg = 1%. Approx is key. Ratio/Perc/Avg application.'},
{title:'Stats Recap',detail:'Mode=3Med-2Mean. SD=sqrt(Var). Prob=Fav/Total.'},
{title:'The Winning Formula',detail:'Accuracy + Speed + Elimination. Don\'t spend >1 min on any question.'}
],
cards:[
{front:'Volume of Cone?',back:'1/3 pi r^2 h.'},
{front:'tan 60°?',back:'sqrt(3).'},
{front:'TSA of Cube?',back:'6a^2.'},
{front:'Prob(Sum of 7 with 2 dice)?',back:'6/36 or 1/6.'},
{front:'Are you a Quant Master?',back:'YES.'}
],
q:[
{q:'If tan x = sqrt(3), find sin x.',options:['1/2','1/sqrt(2)','sqrt(3)/2','1'],ai:2,exp:'x = 60°. sin 60 = sqrt(3)/2.'},
{q:'Find the volume of a cube whose total surface area is 96 cm^2.',options:['64','48','125','32'],ai:0,exp:'6a^2 = 96 => a^2 = 16 => a = 4. Vol = 4^3 = 64.'},
{q:'The median of first 10 prime numbers is:',options:['11','12','12.9','13'],ai:1,exp:'Primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. Median = (11+13)/2 = 12.'},
{q:'In a pie chart, if the total value is 1000, find the value for 36°.',options:['10','100','36','360'],ai:1,exp:'36° = 10%. 10% of 1000 = 100.'}
],
hook:'Quant ecosystem complete. Mastery achieved. 77 days of persistence. Go and solve with speed.',
summary:'Full revision of advanced trigonometry, mensuration, and statistics. High-speed drill of all major formulas. Comparison of DI and probability techniques. Final Quant ecosystem mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Quant Finale Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Quant Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL Quant '+d.topic),why:'Complete mastery of Quant for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | QUANT FINALE',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

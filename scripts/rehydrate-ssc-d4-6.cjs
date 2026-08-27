require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:4,topic:'SSC QA: Percentage — The Fraction Shortcut',
intro:`Percentage is the heart of Arithmetic. If you master Percentage, you automatically master Profit & Loss, SI/CI, and Data Interpretation. In SSC, calculating 37.5% of 800 the long way is a crime. You must know that 37.5% is simply 3/8. Today we focus on the 'Fraction-to-Percentage' table and the 'Successive Change' formula. If you can shift from decimals to fractions, you will solve problems 3x faster than the average student. Let's build the shortcut engine today.`,
notes:[
{title:'Master Fraction Table (Memorize!)',detail:'1/2=50%, 1/3=33.33%, 1/4=25%, 1/5=20%, 1/6=16.66%, 1/7=14.28%, 1/8=12.5%, 1/9=11.11%, 1/11=9.09%, 1/12=8.33%, 3/8=37.5%, 5/8=62.5%. Skill: Convert % to fraction to simplify multiplication.'},
{title:'Successive Percentage Change',detail:'If a value changes by x% and then by y%, the net change is: [x + y + (xy/100)]%. Note: Use negative sign for decrease. Example: 10% increase then 10% decrease = [10 - 10 + (10*-10)/100]% = -1% (net decrease).'},
{title:'The "AB" Rule (Product Constancy)',detail:'If A × B = Constant, and A increases by x%, then B must decrease by [x/(100+x)] * 100 to keep the product same. Example: Price of sugar increases by 25%. Consumption must decrease by 25/125 * 100 = 20% to keep expenditure same.'},
{title:'Population & Depreciating Value',detail:'Population after n years = P(1 + r/100)ⁿ. Value after n years = P(1 - r/100)ⁿ. Note: For SSC, usually n=2 or 3. Use the successive change formula for n=2 instead of the power formula for speed!'},
{title:'Venn Diagram Problems',detail:'Total = n(A) + n(B) - n(A∩B) + n(Neither). Used for: "60% passed in English, 50% in Math, 20% in both".'}
],
cards:[
{front:'Fraction of 37.5%?',back:'3/8. (12.5% is 1/8, so 12.5 * 3 = 37.5).'},
{front:'Fraction of 16.66%?',back:'1/6.'},
{front:'Net change for 20% increase and 20% increase?',back:'20 + 20 + (20*20)/100 = 40 + 4 = 44% increase.'},
{front:'Price increases by 50%. Consumption decrease for same expenditure?',back:'50 / (100+50) * 100 = 50/150 * 100 = 33.33% decrease.'},
{front:'Fraction of 62.5%?',back:'5/8.'}
],
q:[
{q:'If A\'s income is 25% more than B\'s income, then how much percent is B\'s income less than A\'s?',options:['15%','20%','25%','33.33%'],ai:1,exp:'Use AB rule: 25 / (100+25) * 100 = 25/125 * 100 = 20%.'},
{q:'A number is increased by 20% and then decreased by 20%. The net change is:',options:['No change','4% increase','4% decrease','2% decrease'],ai:2,exp:'[20 - 20 + (20 * -20)/100] = -4%. So 4% decrease.'},
{q:'In an examination, 35% students failed in Hindi, 45% failed in English and 20% failed in both. The percentage of those who passed in both subjects is:',options:['40%','50%','30%','20%'],ai:0,exp:'Total failed = 35 + 45 - 20 = 60%. So passed in both = 100 - 60 = 40%.'},
{q:'37.5% of a number is 900. Find 62.5% of that number.',options:['1200','1500','1800','2100'],ai:1,exp:'37.5% = 3/8. 3/8 of X = 900 → X = 2400. 62.5% = 5/8. 5/8 of 2400 = 1500.'}
],
hook:'37.5%=3/8. 62.5%=5/8. Successive: x+y+xy/100. Price up 25% → Cons down 20%. Price up 50% → Cons down 33.33%.',
summary:'Fraction to Percentage conversions. Successive change formula. AB rule for product constancy. Venn diagram applications for pass/fail problems.'},

{day:5,topic:'SSC QA: Profit, Loss & Discount — The Ratio Method',
intro:`Profit and Loss in SSC is all about 'Cost Price' (CP) and 'Selling Price' (SP). Most students get lost in formulas, but toppers use the 'Ratio Method'. If profit is 20%, the CP:SP ratio is 5:6. If discount is 10%, the MP:SP ratio is 10:9. Today we learn how to link CP, SP, and MP (Marked Price) using simple ratios. We also cover the 'Dishonest Shopkeeper' and 'Successive Discount' problems—the two most frequent patterns in SSC CGL Tier 1.`,
notes:[
{title:'Basic Ratios',detail:'Profit% = (P/CP) × 100. Loss% = (L/CP) × 100. (Note: Profit/Loss always on CP). Discount% = (D/MP) × 100. (Note: Discount always on MP). Net Profit Formula: If profit is p% and discount is d%, the relation is: MP/CP = (100+p) / (100-d).'},
{title:'The Ratio Method',detail:'If Profit = 25% (1/4), then CP=4, Profit=1, SP=5. Ratio CP:SP = 4:5. If Discount = 10% (1/10), then MP=10, Discount=1, SP=9. Ratio MP:SP = 10:9. Link them: If SP is common, equalize the SP value in both ratios to find MP:CP:SP.'},
{title:'Successive Discounts',detail:'Two discounts x% and y% = single discount of [x + y - (xy/100)]%. Example: 20% and 10% = 20 + 10 - 2 = 28% (NOT 30%). For 3 discounts, apply formula to first two, then result with third.'},
{title:'Dishonest Shopkeeper Pattern',detail:'Profit% = (Error / True Value - Error) × 100. Or use ratio: Uses 800g instead of 1kg. Ratio of weights 800:1000 = 4:5. So profit ratio is 4:5. Profit% = 1/4 * 100 = 25%.'},
{title:'Selling two items at same SP',detail:'Item 1: x% profit. Item 2: x% loss. Result is ALWAYS a loss of (x/10 depends on formula) x²/100 %. Example: 10% gain and 10% loss = 1% loss.'}
],
cards:[
{front:'Profit% is calculated on which price?',back:'Cost Price (CP).'},
{front:'Discount% is calculated on which price?',back:'Marked Price (MP).'},
{front:'Relation between MP, CP, Profit(p), Discount(d)?',back:'MP / CP = (100 + p) / (100 - d). (Extremely useful for SSC!).'},
{front:'Net discount for 20% and 30%?',back:'20 + 30 - (20*30)/100 = 50 - 6 = 44%.'},
{front:'Shopkeeper uses 900g instead of 1kg. Profit%?',back:'Error = 100g. Profit = 100 / (1000-100) * 100 = 100/900 * 100 = 11.11%.'}
],
q:[
{q:'A shopkeeper allows a discount of 10% and still makes a profit of 20%. By what percent is the MP above the CP?',options:['25%','30%','33.33%','40%'],ai:2,exp:'Use MP/CP formula: MP/CP = (100+20) / (100-10) = 120/90 = 4/3. MP is 1 unit more than CP(3). Profit over CP = 1/3 * 100 = 33.33%.'},
{q:'Two successive discounts of 20% and 5% are equivalent to a single discount of:',options:['25%','24%','15%','18%'],ai:1,exp:'20 + 5 - (20*5)/100 = 25 - 1 = 24%.'},
{q:'A man sells two pipes at Rs. 12 each. He gains 20% on one and loses 20% on the other. In the whole transaction, there is:',options:['No loss no gain','Profit of Rs. 1','Loss of Rs. 1','Loss of 4%'],ai:2,exp:'Loss% = (20²/100) = 4%. Total SP = 24. 96% of CP = 24 → CP = 25. Loss = 25 - 24 = Re. 1.'},
{q:'If CP of 15 articles is equal to SP of 20 articles, find loss percent.',options:['20%','25%','33.33%','50%'],ai:1,exp:'15 CP = 20 SP → CP/SP = 20/15 = 4/3. Loss = 1 unit on CP 4. Loss% = 1/4 * 100 = 25%.'}
],
hook:'MP/CP=(100+p)/(100-d). Successive discount: x+y-xy/100. Same SP + Same % Gain/Loss = x²/100 % Loss always. Dishonest: Error/(True-Error).',
summary:'Ratio method for CP/SP/MP. Profit/Loss vs Discount base. Formula for Mark-up. Successive discounts. Dishonest shopkeeper and Same SP cases.'},

{day:6,topic:'SSC QA: Simple & Compound Interest — The CI Tree',
intro:`Simple Interest (SI) is easy, but Compound Interest (CI) is where SSC filters out the candidates. Today we move away from the long P(1+r/100)ⁿ formula. We will use the 'CI Tree' (or Ratio method) for 2 and 3 years. We also cover the 'Difference between SI and CI'—the most repeated question in SSC history. If you know the direct formulas for 2-year and 3-year differences, you can solve these problems while others are still doing square roots.`,
notes:[
{title:'Simple Interest (SI)',detail:'SI = (P × R × T) / 100. Key: SI remains same for every year. If SI for 1st year is 100, it will be 100 for 2nd, 3rd, and so on.'},
{title:'Compound Interest (CI) - Tree Method',detail:'For 2 years: Profit on P (A) + Profit on P (A) + Profit on A (B). Total CI = 2A + B. For 3 years: 3A + 3B + C. This method avoids high powers and is much faster for SSC.'},
{title:'SI vs CI Difference (Direct Formulas)',detail:'Difference for 2 years (D₂) = P(R/100)². Difference for 3 years (D₃) = P(R/100)² * (3 + R/100) or D₂ * (3 + R/100). Memorize these—they save 2 minutes per problem.'},
{title:'Compound Interest Half-Yearly/Quarterly',detail:'Half-yearly: Rate becomes R/2, Time becomes 2T. Quarterly: Rate becomes R/4, Time becomes 4T. Concept: More frequency = More interest.'},
{title:'Installment Basics',detail:'SSC occasionally asks for SI/CI installments. For SI: Installment = (100A) / [100T + RT(T-1)/2]. For CI: Amount = P / [1/(1+r) + 1/(1+r)²...]. Focus on basic 2-year installments first.'}
],
cards:[
{front:'Formula for SI/CI difference for 2 years?',back:'D₂ = P(R/100)².'},
{front:'If rate is 10%, what is CI for 2 years (Successive)?',back:'10 + 10 + (10*10)/100 = 21%. (SI would be 20%).'},
{front:'What is the Effective Rate for 10% compounded half-yearly?',back:'Rate = 5%, Time = 2. Effective Rate = 5 + 5 + 0.25 = 10.25%.'},
{front:'A sum triples in 4 years (SI). How many years to become 9 times?',back:'Triples means SI = 2P. 2P in 4 yrs → P in 2 yrs. 9 times means SI = 8P. 8P will take 8 * 2 = 16 years.'},
{front:'Ratio for 3-year CI calculation?',back:'3:3:1. (A:B:C from the tree).'}
],
q:[
{q:'The difference between SI and CI on Rs. 4000 for 2 years at 5% per annum is:',options:['Rs. 10','Rs. 20','Rs. 5','Rs. 15'],ai:0,exp:'D₂ = P(R/100)² = 4000 * (5/100)² = 4000 * (1/400) = Rs. 10.'},
{q:'A sum of money doubles itself in 15 years at SI. In how many years will it become 8 times?',options:['105 years','120 years','90 years','75 years'],ai:0,exp:'Doubles means SI = P. P in 15 yrs. 8 times means SI = 7P. 7P takes 7 * 15 = 105 years.'},
{q:'Find the CI on Rs. 10000 for 2 years at 10% per annum, compounded half-yearly.',options:['Rs. 2100','Rs. 2155','Rs. 4641','Rs. 2166'],ai:1,exp:'Half-yearly: R=5%, T=4 periods. Use successive for 4 periods (5,5,5,5). CI for 5% for 4 periods is 21.55%. 21.55% of 10000 = Rs. 2155.'},
{q:'A sum of money placed at CI doubles itself in 5 years. In how many years will it become 8 times?',options:['15 years','10 years','20 years','25 years'],ai:0,exp:'CI Pattern: 1 → 2 (5 yrs). 2 → 4 (another 5 yrs). 4 → 8 (another 5 yrs). Total = 15 years.'}
],
hook:'SI is constant. CI 2yr diff=P(R/100)². CI 2yr @ 10%=21%. CI 3yr @ 10%=33.1%. Half-yearly: R/2, 2T. Doubles in 5yr (CI) → 8x in 15yr.',
summary:'SI formulas and rate calculation. CI Tree/Ratio method. SI vs CI differences. Half-yearly and Quarterly compounding. Installment introduction.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Speed Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Speed Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL '+d.topic+' fraction method'),why:'Arithmetic shortcuts for competitive speed.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Speed focus',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('SSC Days 4-6 v2 COMPLETE');
}
push();

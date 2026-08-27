require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:57,topic:'SSC Quant: Number System & Divisibility',
intro:`Today we study the 'Language of Numbers'. Number system is the root of mathematics. In SSC, questions focus on 'Divisibility Rules', 'Unit Digit', 'Remainder Theorem', and 'HCF/LCM'. Do you know the trick to check divisibility by 11? Or how to find the number of zeros at the end of a factorial? Let's master the numbers today.`,
notes:[
{title:'Divisibility Rules',detail:'2 (Even), 3 (Sum of digits divisible by 3), 4 (Last 2 digits), 5 (Ends in 0/5), 8 (Last 3 digits), 9 (Sum of digits divisible by 9), 11 (Diff of sum of odd and even places is 0 or multiple of 11).'},
{title:'Unit Digit Trick',detail:'Cyclicity of digits. 2, 3, 7, 8 have cyclicity of 4. 0, 1, 5, 6 remain same. 4 and 9 have cyclicity of 2.'},
{title:'Remainder Theorem',detail:'If a polynomial f(x) is divided by (x-a), the remainder is f(a). Positive and Negative remainders concept is useful for large powers.'},
{title:'HCF & LCM',detail:'HCF (Highest Common Factor). LCM (Lowest Common Multiple). Property: Product of two numbers = HCF × LCM.'},
{title:'Number of Zeros',detail:'Number of zeros at the end of n! is determined by the number of pairs of 2 and 5. Since 5s are fewer, count the powers of 5.'}
],
cards:[
{front:'Divisibility of 11?',back:'Sum(odd places) - Sum(even places) = 0 or 11k.'},
{front:'HCF × LCM = ?',back:'Product of the two numbers.'},
{front:'Unit digit of any power of 5?',back:'5.'},
{front:'Cyclicity of 7?',back:'4.'},
{front:'Smallest Prime Number?',back:'2.'}
],
q:[
{q:'If the number 653xy is divisible by 80, then x+y is:',options:['2','3','4','6'],ai:0,exp:'80 = 8 × 10. So y must be 0. 653x0 must be divisible by 8. Last 3 digits 3x0 must be div by 8. x=2. x+y=2.'},
{q:'Find the unit digit of 23^45:',options:['1','3','7','9'],ai:1,exp:'Cyclicity of 3 is 4. 45/4 leaves rem 1. So 3^1 = 3.'},
{q:'The HCF of two numbers is 11 and their LCM is 693. If one number is 77, the other is:',options:['88','99','66','121'],ai:1,exp:'(11 × 693) / 77 = 99.'},
{q:'How many zeros are at the end of 100!?',options:['20','24','25','30'],ai:1,exp:'100/5 + 100/25 = 20 + 4 = 24.'}
],
hook:'11 rule=Odd-Even. HCF*LCM=Prod. Zeros=Divide by 5. Unit digit=Cyclicity 4. 2=Only even prime.',
summary:'Analysis of divisibility rules for 2 to 11. Methods for finding unit digits and remainders. Application of HCF/LCM properties. Calculation of trailing zeros in factorials.'},

{day:58,topic:'SSC Quant: Percentage & Applications',
intro:`Today we study the 'Universal Comparison'. Percentage is the most used tool in arithmetic. In SSC, the 'Fraction-to-Percentage' table is your best friend. From 'Population growth' to 'Successive changes'—these patterns repeat. Do you know how much a 20% increase followed by a 20% decrease changes the value? Let's master the percentages today.`,
notes:[
{title:'Fraction-Percentage Table (Memorize!)',detail:'1/2=50%, 1/3=33.33%, 1/4=25%, 1/5=20%, 1/6=16.66%, 1/7=14.28%, 1/8=12.5%, 1/9=11.11%, 1/11=9.09%.'},
{title:'Basic Formula',detail:'Percentage Change = (Change / Original Value) × 100.'},
{title:'Successive Percentage',detail:'Net change = x + y + (xy/100). If one is decrease, take negative value. (e.g., +20% and -20% net = 20 - 20 - 400/100 = -4%).'},
{title:'Consumption & Price',detail:'If Price increases by x%, and Expenditure is constant, Consumption must decrease. (e.g., Price +25% (1/4), Consumption -20% (1/5)).'},
{title:'Voting/Examination',detail:'Total votes = Valid votes + Invalid votes. Passing marks = Scored marks + Needed marks.'}
],
cards:[
{front:'Fraction value of 12.5%?',back:'1/8.'},
{front:'Fraction value of 16.66%?',back:'1/6.'},
{front:'Net change of +10% and +10%?',back:'21% (10 + 10 + 1).'},
{front:'If A is 25% more than B, B is ? less than A?',back:'20% less.'},
{front:'Fraction value of 14.28%?',back:'1/7.'}
],
q:[
{q:'If A\'s income is 25% more than B\'s, then B\'s income is how much % less than A\'s?',options:['20%','25%','33.33%','15%'],ai:0,exp:'A=125, B=100. Diff=25. (25/125)*100 = 20%.'},
{q:'The population of a town increases by 10% annually. If current is 10,000, what is it after 2 years?',options:['12,000','12,100','11,000','12,200'],ai:1,exp:'10000 * 1.1 * 1.1 = 12100.'},
{q:'A student has to secure 40% marks to pass. He gets 178 marks and fails by 22 marks. Total marks?',options:['400','500','600','800'],ai:1,exp:'40% = 178+22 = 200. 100% = 500.'},
{q:'If the price of sugar is increased by 20%, by what % should consumption be reduced so as not to increase expenditure?',options:['16.66%','20%','25%','15%'],ai:0,exp:'Price 5 to 6. Consumption 6 to 5. Diff 1. (1/6)*100 = 16.66%.'}
],
hook:'1/4 more=1/5 less. 1/x more=1/(x+1) less. x+y+xy/100. Table is key. 1/6=16.66%. 1/8=12.5%.',
summary:'Mastery of fraction-to-percentage conversion. Successive percentage change formula. Application to population, price-consumption, and examination problems.'},

{day:59,topic:'SSC Quant: Profit, Loss & Discount',
intro:`Today we study the 'Arithmetic of Business'. Profit and Loss is a direct application of percentages. In SSC, the 'Marked Price (MP)', 'Selling Price (SP)', and 'Cost Price (CP)' relationship is the core. Do you know the formula connecting CP and MP using Profit and Discount? Or how to solve 'Dishonest Shopkeeper' problems? Let's master the market today.`,
notes:[
{title:'Basic Formulas',detail:'Profit = SP - CP. Loss = CP - SP. Profit% = (P/CP)*100. Always calculate on CP unless mentioned otherwise.'},
{title:'Marked Price & Discount',detail:'Discount is always on MP. SP = MP - Discount. Discount% = (D/MP)*100.'},
{title:'The Golden Ratio',detail:'CP / MP = (100 - D%) / (100 + P%). This formula solves 50% of SSC P&L questions.'},
{title:'Successive Discounts',detail:'Same as successive percentage change. x + y - (xy/100).'},
{title:'Dishonest Shopkeeper',detail:'Profit% = (Error / True value - Error) × 100. (e.g., uses 900g instead of 1kg. Error=100. Profit = 100/900 = 11.11%).'}
],
cards:[
{front:'Profit% is calculated on?',back:'Cost Price (CP).'},
{front:'Discount is calculated on?',back:'Marked Price (MP).'},
{front:'Formula: CP/MP = ?',back:'(100 - D%) / (100 + P%).'},
{front:'Successive discount of 10% and 10%?',back:'19% (10 + 10 - 1).'},
{front:'SP = CP × ? (for Profit)',back:'(100 + P%)/100.'}
],
q:[
{q:'An article is sold for ₹300 at a profit of 20%. Find the CP.',options:['₹240','₹250','₹260','₹280'],ai:1,exp:'120% = 300. 100% = (300/120)*100 = 250.'},
{q:'A trader marks his goods 20% above CP and allows a 10% discount. Find his profit%.',options:['10%','8%','12%','5%'],ai:1,exp:'CP=100, MP=120, SP=120*0.9=108. Profit=8%.'},
{q:'The cost price of 15 articles is equal to the selling price of 10 articles. Profit%?',options:['33.33%','50%','25%','20%'],ai:1,exp:'15 CP = 10 SP => SP/CP = 15/10 = 3/2. Profit=1/2 = 50%.'},
{q:'A shopkeeper uses 800g instead of 1kg. His profit% is?',options:['20%','25%','15%','10%'],ai:1,exp:'Error=200. Profit = 200/800 = 1/4 = 25%.'}
],
hook:'CP/MP=(100-D)/(100+P). Discount on MP. Profit on CP. Error/(True-Error). 10+10-1=19.',
summary:'Relationship between CP, SP, and MP. Application of the CP/MP golden ratio. Techniques for solving successive discounts and dishonest shopkeeper problems.'},

{day:60,topic:'SSC Quant: Simple & Compound Interest',
intro:`Today we study the 'Power of Compounding'. Simple Interest (SI) is constant every year, while Compound Interest (CI) is interest on interest. In SSC, the 'Difference between CI and SI for 2 and 3 years' is a very frequent question. Do you know the 2-year difference formula? Or the 'Tree method' for CI? Let's master the interest today.`,
notes:[
{title:'Simple Interest (SI)',detail:'SI = (P × R × T) / 100. Interest remains same for every year.'},
{title:'Compound Interest (CI)',detail:'Amount = P(1 + R/100)^T. CI = Amount - Principal.'},
{title:'CI vs SI Difference',detail:'For 2 years: Diff = P(R/100)^2. For 3 years: Diff = [P(R/100)^2] × [(300 + R)/100]. (High Yield).'},
{title:'Rate & Time (Installments)',detail:'Quarterly: Rate/4, Time*4. Half-yearly: Rate/2, Time*2.'},
{title:'Successive Method for CI',detail:'Use x + y + (xy/100) for effective rate. (e.g., 10% for 2 yrs = 21%. 5% for 2 yrs = 10.25%).'}
],
cards:[
{front:'Formula for SI?',back:'(P*R*T)/100.'},
{front:'CI-SI Diff for 2 years?',back:'P(R/100)^2.'},
{front:'Effective CI rate for 10% (2 yrs)?',back:'21%.'},
{front:'What happens to rate in half-yearly?',back:'It is halved (R/2).'},
{front:'Effective CI rate for 5% (2 yrs)?',back:'10.25%.'}
],
q:[
{q:'A sum of money doubles itself in 5 years at SI. In how many years will it become 4 times?',options:['10','15','20','25'],ai:1,exp:'Double in 5 => Interest P in 5 yrs. To become 4P, Interest needed is 3P. Time = 3*5 = 15 years.'},
{q:'Find the CI on ₹1000 at 10% for 2 years.',options:['₹100','₹200','₹210','₹220'],ai:2,exp:'Effective rate = 21%. 21% of 1000 = 210.'},
{q:'The difference between CI and SI for 2 years at 5% is ₹25. Find the Principal.',options:['₹5,000','₹10,000','₹15,000','₹20,000'],ai:1,exp:'25 = P(5/100)^2 => 25 = P/400 => P = 10,000.'},
{q:'If a sum at CI becomes 3 times in 4 years, in how many years will it become 27 times?',options:['8','12','16','20'],ai:1,exp:'3^1 in 4 yrs. 27 = 3^3. Time = 4*3 = 12 years.'}
],
hook:'SI=Same. CI=Effective rate x+y+xy/100. Diff 2yr=PR^2/100^2. Half yr=R/2, T*2. 3^x in T -> 3^y in (T/x)*y.',
summary:'Comparison of SI and CI mechanisms. Derivation and use of 2-year and 3-year difference formulas. Application of effective interest rates and installments.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Quant Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Quant Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL Quant '+d.topic),why:'Mastering arithmetic foundation for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Quant',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

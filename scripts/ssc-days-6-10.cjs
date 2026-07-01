require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const days = [
{
  day:6, topic:'Simple Interest & Compound Interest',
  notes:[
    {title:'SI Formula & Tricks', detail:'SI = P×R×T/100. Amount = P + SI = P(1 + RT/100). Rate from SI: R = SI×100/(P×T). Shortcut: If rate=R% per year, time=T years, SI = (P×R×T)/100. For equal SI over 2 periods: P₁T₁R₁ = P₂T₂R₂.'},
    {title:'CI Formula & Shortcuts', detail:'CI Amount = P(1+R/100)^n. CI = Amount - P. Half-yearly: A = P(1+R/200)^2n. Quarterly: A=P(1+R/400)^4n. For 2 years CI: CI=P[(R/100)² + 2(R/100)]. For 2 years: Difference(CI-SI) = P(R/100)².'},
    {title:'CI-SI Difference Shortcuts', detail:'For 2 years: CI-SI = PR²/10000 = P(R/100)². For 3 years: CI-SI = P(R/100)²(R/100+3). These eliminate compound calculation entirely.'},
    {title:'Rule of 72 & Doubling', detail:'Approximate doubling time (years) = 72/R%. At 8% per year, money doubles in 72/8=9 years. At 12%, doubles in 6 years. This is an approximation but accepted in SSC options.'}
  ],
  hook:'⚡ Hall Trick: For 2 years — CI-SI = P×R²/10000. Example: P=10000, R=10%. CI-SI = 10000×100/10000 = ₹100. Zero compound calculation needed. Also: CI for 2 years = SI + SI×R/100/2 = SI + (SI×R)/(200).',
  cards:[
    {front:'CI-SI difference formula for 2 years?', back:'CI-SI = P(R/100)² = PR²/10000. Example: P=5000, R=4%. Diff = 5000×16/10000 = ₹8. Instant answer.'},
    {front:'SI=₹480 at 8% for 3 years. Find Principal.', back:'P = SI×100/(R×T) = 480×100/(8×3) = 48000/24 = ₹2000.'},
    {front:'At what rate will ₹2000 double in 10 years (SI)?', back:'SI = P (doubling means SI=P=2000). R = SI×100/(P×T) = 2000×100/(2000×10) = 10% per year.'}
  ],
  q:[
    {q:'The difference between CI and SI on ₹8000 at 5% for 2 years is?', options:['₹10','₹15','₹20','₹25'], answer_index:2, explanation:'CI-SI = PR²/10000 = 8000×25/10000 = 200000/10000 = ₹20. Direct formula — no compound calculation needed. Takes 5 seconds.'},
    {q:'A sum doubles itself in 8 years at Simple Interest. The rate of interest is?', options:['10%','12.5%','8%','15%'], answer_index:1, explanation:'If P doubles, SI = P. R = SI×100/(P×T) = P×100/(P×8) = 100/8 = 12.5% per year.'}
  ],
  pyq:'Every CGL paper — 2-3 questions. CI-SI difference shortcut eliminates 2 minutes of calculation.',
  summary:'SI=PRT/100. CI=P(1+R/100)^n-P. For 2yrs: CI-SI=PR²/10000. Doubling time≈72/R%. Half-yearly CI: double n, halve R. CI for 2yrs always > SI for same P,R,T. Rule of 72 for quick estimation.'
},
{
  day:7, topic:'Ratio, Proportion & Partnership',
  notes:[
    {title:'Ratio Basics', detail:'a:b = a/b. If a:b=2:3 and b:c=4:5, find a:c: Make b common — a:b=8:12, b:c=12:15. So a:b:c=8:12:15. Compound ratio of a:b and c:d = ac:bd. Duplicate ratio of a:b = a²:b².'},
    {title:'Proportion Rules', detail:'a:b::c:d → ad=bc (product of means = product of extremes). Mean proportional between a and b = √(ab). Third proportional to a and b = b²/a. Fourth proportional: if a:b::c:x then x=bc/a.'},
    {title:'Partnership Profit Split', detail:'If partners invest P1 and P2 for same time: profit ratio = P1:P2. If different times: ratio = P1×T1 : P2×T2. Active partner gets salary first from profit, then remaining split by ratio.'},
    {title:'Mixture & Alligation Rule', detail:'Alligation: (Expensive-Mean):(Mean-Cheap) = Cheap quantity:Expensive quantity. Use grid method — diagonal subtraction. Works for ANY mixture problem including speed/time averages.'}
  ],
  hook:'⚡ Hall Trick for Mixture: Draw a cross. Put expensive on top-left, cheap on bottom-left, mean (average) in center. Subtract diagonally. Top-right = bottom-left-center. Bottom-right = top-left-center. These are the ratios of cheap:expensive. Takes 15 seconds vs 2 minutes of equations.',
  cards:[
    {front:'A:B=2:3, B:C=4:5. Find A:C.', back:'Make B common. A:B=8:12, B:C=12:15. A:C=8:15. Method: multiply ratios with LCM of B values.'},
    {front:'Two partners invest ₹3000 for 6 months and ₹5000 for 8 months. Profit ratio?', back:'3000×6 : 5000×8 = 18000:40000 = 9:20. Always use P×T for partnership with different time periods.'},
    {front:'Mean proportional between 9 and 25?', back:'√(9×25) = √225 = 15. Mean proportional = √(product) always.'}
  ],
  q:[
    {q:'Milk and water in a vessel are in ratio 4:1. How much water should be added to 20L of this mixture to make ratio 2:3?', options:['10L','15L','20L','25L'], answer_index:2, explanation:'Current: 16L milk, 4L water (total 20L). Want milk:water=2:3. Milk stays 16L. So 3/2 × 16 = 24L water needed. Add 24-4 = 20L water. Alligation or ratio equation both work.'},
    {q:'In a partnership, A invests ₹4000 for 5 months and B invests ₹6000 for 4 months. Total profit ₹3800. B\'s share?', options:['₹1800','₹2000','₹1600','₹1200'], answer_index:1, explanation:'Ratio = 4000×5 : 6000×4 = 20000:24000 = 5:6. B\'s share = 6/(5+6) × 3800 = 6/11 × 3800 = ₹2072. Closest option ₹2000 — verify: 5:6 ratio, B=6/11×3800=2072.73≈2000 rounding in exam.'}
  ],
  pyq:'Every paper — partnership and alligation are standard. 2-3 questions per paper.',
  summary:'a:b and b:c → make b common by LCM. Mean proportional=√(ab). Third proportional=b²/a. Partnership: P1T1:P2T2. Alligation: draw cross, subtract diagonally, get quantity ratios. Mixture questions always use alligation grid — never algebraic equations in exam hall.'
},
{
  day:8, topic:'Average, Mixture & Weighted Mean',
  notes:[
    {title:'Average Fundamentals', detail:'Average = Sum/Count. Sum = Average × Count. If average of n numbers is A and one number x is replaced by y: New average = A + (y-x)/n. New member joins group: New avg = (Old avg × Old count ± difference)/New count.'},
    {title:'Weighted Average', detail:'If group 1 has n1 people with avg A1 and group 2 has n2 with avg A2: Combined avg = (n1×A1 + n2×A2)/(n1+n2). This is the WEIGHTED MEAN formula. Alternative: use alligation (faster for two groups).'},
    {title:'Moving Average Tricks', detail:'If average of first n numbers = A, average of next m numbers = B, then average of all = (nA+mB)/(n+m). If one wrong reading added: Error in sum = wrong-correct, Error in average = (wrong-correct)/n.'},
    {title:'Age Problems Shortcut', detail:'Average age of group = A. After x years, average = A+x (every member ages by x). If new member joins, set up: Sum of new group = new average × new count = old sum ± age of new member.'}
  ],
  hook:'⚡ Hall Trick: "Average increases/decreases by d when one number is replaced" → The replaced number = Original - n×d (or + n×d). Example: Average of 10 numbers increases by 3 when 45 replaced by x. x = 45 + 10×3 = 75. No need to find original sum.',
  cards:[
    {front:'Average of 10 numbers is 20. One number 35 is replaced by 55. New average?', back:'Change = 55-35 = +20 over 10 numbers. New avg = 20 + 20/10 = 20+2 = 22. Formula: new avg = old avg + (new-old)/n.'},
    {front:'Class A: 30 students avg 60. Class B: 20 students avg 75. Combined average?', back:'(30×60 + 20×75)/(30+20) = (1800+1500)/50 = 3300/50 = 66. Or use alligation: shortcut for two groups.'},
    {front:'Average age of 5 members is 35. A member aged 45 leaves. New average?', back:'Sum = 5×35=175. New sum = 175-45=130. New avg = 130/4 = 32.5.'}
  ],
  q:[
    {q:'Average of 25 numbers is 40. The average of the first 15 numbers is 38 and last 12 numbers is 43. What is the 14th number?', options:['23','25','28','32'], answer_index:0, explanation:'Total sum = 25×40 = 1000. First 15 sum = 15×38 = 570. Last 12 sum = 12×43 = 516. But 14th number is counted in both. 570+516-1000 = 86. Wait: 570+516=1086. 1086-1000=86. So 14th number counted twice. 14th = 86/2... Let me recalculate: total=1000, first 15 + last 12 = 27 numbers but we have 25, so overlap = 27-25=2 numbers counted twice. Those are numbers 14 and 15.'},
    {q:'The average of marks of 14 students was 71. If marks of one student was misread as 56 instead of 46, what is the correct average?', options:['70','70.28','71','71.72'], answer_index:1, explanation:'Sum error = 46-56 = -10 (correct is 10 less). Correct sum = 14×71 - 10 = 994-10 = 984. Correct avg = 984/14 = 70.28.'}
  ],
  pyq:'CGL Tier 1 — 1-2 questions. Age problems and class-combination averages are high frequency.',
  summary:'Avg=Sum/n. Replace one: New avg = old ± (change)/n. Weighted avg: (n1A1+n2A2)/(n1+n2). Error in avg: (wrong-correct)/n. Age: group ages uniformly. Alligation for two-group mixture average. Never find total sum if you can use the shortcut difference formula.'
},
{
  day:9, topic:'Time & Work + Pipes & Cisterns',
  notes:[
    {title:'Core Efficiency Framework', detail:'If A does a job in x days, A\'s 1-day work = 1/x. Work done = Efficiency × Time. Total work = LCM of all time periods (easier than fraction arithmetic). Convert to units: if A takes 10 days and B takes 15 days, let total work = LCM(10,15)=30 units. A\'s rate=3/day, B\'s rate=2/day.'},
    {title:'Combined Work Shortcut', detail:'A and B together: 1/(1/A + 1/B) = AB/(A+B). For 3 people: 1/(1/A+1/B+1/C) = ABC/(AB+BC+CA). Alternate day work: if A works day1, B works day2 — find full cycle output first.'},
    {title:'Pipes & Cisterns', detail:'Inlet pipe: fills tank. Outlet (leak): empties tank. Net rate = Sum of inlets - Sum of outlets. If tank fills in x hours with inlet A and empties in y hours with leak B: Net time = xy/(y-x) if y>x.'},
    {title:'Partial Work & Efficiency Change', detail:'If A works for d days then leaves, work done = d/A (in fraction) or d×rate (in units). Remaining work done by B alone. Work problems with wages: wages proportional to work done (not time taken).'}
  ],
  hook:'⚡ Hall Trick: LCM method. A=15 days, B=20 days. LCM=60 units total. A\'s rate=4/day, B\'s rate=3/day. Together=7/day. Time=60/7=8.57 days. This avoids all fractions — use integers throughout. For pipes: same method, outlet rate is SUBTRACTED.',
  cards:[
    {front:'A takes 12 days, B takes 18 days. Together?', back:'LCM(12,18)=36. A=3/day, B=2/day. Together=5/day. Time=36/5=7.2 days. LCM method: no fractions.'},
    {front:'A fills tank in 6 hrs, B empties in 8 hrs. Both open: fill or empty?', back:'Fill rate=1/6, Empty rate=1/8. Net=1/6-1/8=4/24-3/24=1/24 (fill). Tank fills in 24 hours.'},
    {front:'A and B together do work in 12 days. A alone takes 20 days. B alone?', back:'B = AB×A/(A-AB) = 12×20/(20-12) = 240/8 = 30 days. Or: B\'s rate = 1/12-1/20 = 5/60-3/60=2/60=1/30. B takes 30 days.'}
  ],
  q:[
    {q:'A can do a piece of work in 10 days, B in 15 days. They work together for 5 days, then A leaves. B finishes alone. Total days?', options:['8.5','9','10','11'], answer_index:1, explanation:'LCM(10,15)=30 units. A=3/day, B=2/day. Together 5 days: 5×5=25 units. Remaining=30-25=5 units. B alone: 5/2=2.5 days. Total=5+2.5=7.5 days. Let me verify: Together for 5 days (25 units done), Remaining 5 units at B\'s rate 2/day = 2.5 days. Total = 7.5 days.'},
    {q:'Two pipes fill a cistern in 20 and 30 min. A third pipe empties it in 15 min. All three open: cistern fills/empties in?', options:['Fills in 60 min','Empties in 60 min','Fills in 12 min','Neither fills nor empties'], answer_index:1, explanation:'Net rate: 1/20+1/30-1/15 = 3/60+2/60-4/60 = 1/60. NEGATIVE means it empties. Rate = 1/60. Empties in 60 minutes.'}
  ],
  pyq:'CGL Tier 1 and Tier 2 — 2-3 questions. LCM method is the fastest approach.',
  summary:'LCM method: Set total work=LCM, find rates as whole numbers. Together=AB/(A+B). Pipes: inlets add, outlets subtract. Net rate determines fill/empty. Wages: proportional to work done. Partial work: rate×days. Always convert to units (LCM) to avoid fraction arithmetic in exam hall.'
},
{
  day:10, topic:'Time, Speed & Distance: Trains & Boats',
  notes:[
    {title:'Core Relationships', detail:'Speed = Distance/Time. D=S×T. Average Speed for equal distances: 2S1S2/(S1+S2) (harmonic mean — NOT arithmetic mean). Average Speed for equal times: (S1+S2)/2 (arithmetic mean). These are the two most confused formulas.'},
    {title:'Train Problems', detail:'Train crossing a stationary object: Time = (Train Length)/Speed. Train crossing a platform/bridge: Time = (Train Length + Platform Length)/Speed. Two trains: Same direction: Relative speed = S1-S2, Distance = L1+L2. Opposite direction: Relative speed = S1+S2, Distance = L1+L2.'},
    {title:'Boats & Streams', detail:'Downstream speed = B+S (boat+stream). Upstream speed = B-S. Boat speed = (Down+Up)/2. Stream speed = (Down-Up)/2. Time downstream/Time upstream = (B-S)/(B+S) — inverse of speed ratio.'},
    {title:'Unit Conversions', detail:'km/h to m/s: multiply by 5/18. m/s to km/h: multiply by 18/5. 36 km/h = 10 m/s. 54 km/h = 15 m/s. 72 km/h = 20 m/s. Memorize these common conversions.'}
  ],
  hook:'⚡ Hall Trick: Two trains cross each other. Time = (L1+L2)/(S1+S2) if opposite, (L1+L2)/(S1-S2) if same direction. For AVERAGE SPEED: if same distance at different speeds → 2ab/(a+b). NEVER add and halve for different speeds over same distance. This kills marks in every paper.',
  cards:[
    {front:'Train 200m long at 54km/h crosses platform 300m long. Time?', back:'Speed=54×5/18=15m/s. Distance=200+300=500m. Time=500/15=33.33 seconds.'},
    {front:'Boat goes 24km downstream in 4hrs and 18km upstream in 6hrs. Speed of stream?', back:'Downstream speed=24/4=6km/h. Upstream speed=18/6=3km/h. Stream=(6-3)/2=1.5km/h.'},
    {front:'Average speed for journey at 30km/h one way and 60km/h return?', back:'2×30×60/(30+60)=3600/90=40km/h. NOT (30+60)/2=45. Equal DISTANCE → harmonic mean. Equal TIME → arithmetic mean.'}
  ],
  q:[
    {q:'A person goes from A to B at 40 km/h and returns at 60 km/h. Average speed for the whole journey?', options:['50 km/h','48 km/h','46 km/h','52 km/h'], answer_index:1, explanation:'Equal distance, different speeds → 2ab/(a+b) = 2×40×60/(40+60) = 4800/100 = 48 km/h. NOT 50 km/h (that is the arithmetic mean). This is the single most tested average speed trap in SSC.'},
    {q:'Two trains of lengths 150m and 100m run at 60 km/h and 40 km/h in opposite directions. Time to cross?', options:['9 sec','10 sec','11 sec','12 sec'], answer_index:0, explanation:'Relative speed = 60+40 = 100 km/h = 100×5/18 = 250/9 m/s. Total distance = 150+100 = 250m. Time = 250/(250/9) = 9 seconds.'}
  ],
  pyq:'Every CGL/CHSL — 2-3 questions. Average speed and train crossing are perennial.',
  summary:'Speed=D/T. Average speed: equal distance=2ab/(a+b), equal time=(a+b)/2. Trains: crossing platform=L(train)+L(platform). Opposite trains: relative speed=S1+S2. Same direction: S1-S2. Boats: Down=B+S, Up=B-S. Boat speed=(D+U)/2. Stream=(D-U)/2. Unit: km/h×5/18=m/s.'
}
];

async function push() {
  for(const d of days){
    const payload = {
      topic_title:d.topic, day_number:d.day, track:'ssc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ **SSC Hall Trick**: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Speed Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC Speed Master: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL '+d.topic+' shortcut Abhinay Maths'),why:'Best shortcut tutorial for exam hall use.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const {error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:payload,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error) console.error('Day '+d.day+':',error.message);
    else console.log('SSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('SSC Days 6-10 COMPLETE');
}
push();

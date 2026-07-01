require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:92,topic:'SSC Static GK: Sports & Trophies',
intro:`Today we study the 'Arena of Glory'. Sports is a massive part of SSC Static GK. From 'Number of players' to 'Trophy names' and 'Olympic history'—these facts are high-yield. Do you know which sport 'Thomas Cup' is associated with? Or who was the first individual Olympic medalist for India? Let's master the sports today.`,
notes:[
{title:'National Sports',detail:'India (Hockey-Unofficial/Field), USA (Baseball), China (Table Tennis), Brazil (Football), Japan (Sumo Wrestling).'},
{title:'Player Counts',detail:'Cricket/Football/Hockey (11), Basketball (5), Volleyball (6), Baseball (9), Polo (4).'},
{title:'Important Trophies',detail:'Badminton (Thomas Cup-Men, Uber Cup-Women), Cricket (Ranji, Duleep, Ashes), Football (Santosh Trophy, Durand Cup), Hockey (Agha Khan Cup).'},
{title:'Sports Terms',detail:'Deuce (Tennis), Bully (Hockey), Gambit (Chess), Googly (Cricket), Birdie (Golf).'},
{title:'Olympic Records',detail:'1st Individual Medal: K.D. Jadhav (Wrestling). 1st Gold: Abhinav Bindra (Shooting). 1st Female Medal: Karnam Malleswari (Weightlifting).'}
],
cards:[
{front:'Thomas Cup is for?',back:'Badminton (Men).'},
{front:'Number of players in Basketball?',back:'5.'},
{front:'"Gambit" is used in?',back:'Chess.'},
{front:'First female Olympic medalist (India)?',back:'Karnam Malleswari.'},
{front:'Durand Cup is for?',back:'Football.'}
],
q:[
{q:'"Thomas Cup" is associated with which of the following sports?',options:['Tennis','Badminton','Cricket','Football'],ai:1,exp:'Uber Cup is the women\'s equivalent.'},
{q:'How many players are there in a "Volleyball" team on the court?',options:['5','6','7','9'],ai:1,exp:'Standard team size.'},
{q:'"K.D. Jadhav" won India\'s first individual Olympic medal in:',options:['Shooting','Wrestling','Boxing','Weightlifting'],ai:1,exp:'Won bronze in 1952 Helsinki Olympics.'},
{q:'The term "Birdie" is associated with:',options:['Polo','Golf','Baseball','Chess'],ai:1,exp:'Score of one stroke under par.'}
],
hook:'Thomas=Badminton. Durand=Football. Jadhav=Wrestling. Birdie=Golf. 5=Basketball. 6=Volleyball.',
summary:'National sports of major countries and player counts. List of prestigious national and international trophies. Common terminology used in different sports. Milestone achievements of Indian athletes.'},

{day:93,topic:'SSC Static GK: Art, Culture & Folk Dances',
intro:`Today we study the 'Rhythm of India'. Art and Culture questions focus on 'Classical Dances', 'Folk Dances', and 'Festivals'. In SSC, identifying the 'State' of a dance is the most common pattern. Do you know which state Bihu belongs to? Or how many classical dances are recognized? Let's master the culture today.`,
notes:[
{title:'Classical Dances (8)',detail:'Bharatnatyam (TN), Kathak (UP), Kathakali (Kerala), Mohiniyattam (Kerala), Kuchipudi (AP), Odissi (Odisha), Manipuri (Manipur), Sattriya (Assam).'},
{title:'Folk Dances (Set 1)',detail:'Bihu (Assam), Garba (Gujarat), Lavani (Maharashtra), Ghoomar (Rajasthan), Nautanki (UP), Yakshagana (Karnataka).'},
{title:'Folk Dances (Set 2)',detail:'Raut Nacha (Chhattisgarh), Cheraw (Mizoram - Bamboo dance), Chhau (WB/Jharkhand/Odisha), Karagam (TN).'},
{title:'Major Festivals',detail:'Onam (Kerala - Boat race), Pongal (TN), Hornbill (Nagaland), Losar (Ladakh/Sikkim), Chapchar Kut (Mizoram).'},
{title:'Musical Instruments',detail:'Sitar (Ravi Shankar), Sarod (Amjad Ali Khan), Flute (Hariprasad Chaurasia), Tabla (Zakir Hussain).'}
],
cards:[
{front:'Sattriya belongs to?',back:'Assam.'},
{front:'Yakshagana is from?',back:'Karnataka.'},
{front:'Who is famous for Flute?',back:'Hariprasad Chaurasia.'},
{front:'Hornbill festival state?',back:'Nagaland.'},
{front:'Bihu dance state?',back:'Assam.'}
],
q:[
{q:'"Sattriya" is a classical dance of which state?',options:['Manipur','Assam','Odisha','Kerala'],ai:1,exp:'Introduced by Mahapurush Srimanta Sankardev.'},
{q:'The "Hornbill Festival" is celebrated in:',options:['Arunachal Pradesh','Nagaland','Mizoram','Meghalaya'],ai:1,exp:'Known as the "Festival of Festivals".'},
{q:'"Yakshagana" is a traditional theater form of:',options:['Tamil Nadu','Andhra Pradesh','Karnataka','Kerala'],ai:2,exp:'Very popular folk drama in Karnataka.'},
{q:'"Hariprasad Chaurasia" is a world-renowned master of:',options:['Sitar','Sarod','Flute','Tabla'],ai:2,exp:'One of the greatest bansuri players.'}
],
hook:'Sattriya=Assam. Bihu=Assam. Hornbill=Nagaland. Yakshagana=Karnataka. Flute=Chaurasia. Zakir=Tabla.',
summary:'State-wise distribution of classical and folk dances. List of regional festivals and their significance. Mastery of famous Indian musicians and their instruments.'},

{day:94,topic:'SSC Static GK: Census 2011 & Schemes',
intro:`Today we study the 'Numbers and Initiatives'. Census 2011 is still the primary source for population questions in SSC. We also look at 'Major Government Schemes'. Do you know which state has the highest literacy? Or which scheme is for 'Financial Inclusion'? Let's master the data today.`,
notes:[
{title:'Census 2011: Population',detail:'Most Populous: UP. Least: Sikkim. Highest Density: Bihar. Lowest: Arunachal.'},
{title:'Census 2011: Literacy & Sex Ratio',detail:'Highest Literacy: Kerala. Lowest: Bihar. Highest Sex Ratio: Kerala. Lowest: Haryana.'},
{title:'Financial Schemes',detail:'PM Jan Dhan Yojana (Financial Inclusion), PM Ujjwala (LPG), PM Awas (Housing), PM Kisan (Direct income).'},
{title:'Social Schemes',detail:'Beti Bachao Beti Padhao (Child sex ratio), Ayushman Bharat (Health), MGNREGA (100 days work).'},
{title:'Misc Facts',detail:'Largest Union Territory (Area): Ladakh. Most Populous UT: Delhi. Highest Literacy UT: Lakshadweep.'}
],
cards:[
{front:'Highest literacy state?',back:'Kerala.'},
{front:'Highest density state?',back:'Bihar.'},
{front:'Lowest sex ratio state?',back:'Haryana.'},
{front:'Jan Dhan Yojana is for?',back:'Financial Inclusion.'},
{front:'Ujjwala Yojana is for?',back:'LPG Connections.'}
],
q:[
{q:'As per Census 2011, which state has the highest population density?',options:['UP','West Bengal','Bihar','Maharashtra'],ai:2,exp:'1106 persons per sq km.'},
{q:'Which state has the highest "Sex Ratio" according to Census 2011?',options:['Tamil Nadu','Kerala','Karnataka','Andhra Pradesh'],ai:1,exp:'1084 females per 1000 males.'},
{q:'"Beti Bachao Beti Padhao" scheme was launched from which state?',options:['UP','Rajasthan','Haryana','Punjab'],ai:2,exp:'Launched in Panipat in 2015.'},
{q:'Which UT has the highest literacy rate?',options:['Delhi','Chandigarh','Puducherry','Lakshadweep'],ai:3,exp:'Census 2011 data.'}
],
hook:'Literacy=Kerala. Density=Bihar. Sex Ratio=Kerala. BBBP=Haryana. Jan Dhan=Banks. Ujjwala=LPG.',
summary:'Detailed breakdown of Census 2011 records for states and UTs. List of major central government schemes and their objectives. Quick facts on literacy, density, and sex ratios.'},

{day:95,topic:'SSC Static GK: Firsts & Superlatives (Recap)',
intro:`Today we study the 'Pioneers and Records'. From 'First PM' to 'Largest Desert' and 'Longest Bridge'—Static GK in SSC loves the 'Firsts'. This is a fast-paced recap of the world and Indian records. Do you know who was the first woman to climb Everest? Or what is the 'Deepest Ocean'? Let's master the records today.`,
notes:[
{title:'First in India (Men)',detail:'1st President: Rajendra Prasad. 1st PM: Nehru. 1st Governor-General (Free India): Rajagopalachari. 1st Cosmonaut: Rakesh Sharma.'},
{title:'First in India (Women)',detail:'1st President: Pratibha Patil. 1st PM: Indira Gandhi. 1st Governor: Sarojini Naidu. 1st IPS: Kiran Bedi. 1st to climb Everest: Bachendri Pal.'},
{title:'World Superlatives',detail:'Largest Desert: Sahara. Largest Lake: Caspian Sea (Saline). Longest River: Nile. Largest Continent: Asia.'},
{title:'Indian Superlatives',detail:'Longest River: Ganga. Largest Fresh Water Lake: Wular. Highest Dam: Tehri. Longest Bridge: Dhola-Sadiya (Bhupen Hazarika).'},
{title:'International Records',detail:'1st man on Moon: Neil Armstrong. 1st in Space: Yuri Gagarin. 1st woman on Everest: Junko Tabei.'}
],
cards:[
{front:'First female PM of India?',back:'Indira Gandhi.'},
{front:'First man on Moon?',back:'Neil Armstrong.'},
{front:'Longest river in the world?',back:'Nile.'},
{front:'Highest dam in India?',back:'Tehri Dam.'},
{front:'First Indian woman on Everest?',back:'Bachendri Pal.'}
],
q:[
{q:'Who was the first female Governor of an Indian state?',options:['Annie Besant','Sarojini Naidu','Sucheta Kripalani','Indira Gandhi'],ai:1,exp:'Governor of Uttar Pradesh.'},
{q:'Which is the largest desert in the world?',options:['Gobi','Thar','Sahara','Atacama'],ai:2,exp:'Located in Africa.'},
{q:'The "Tehri Dam" is built on which river?',options:['Ganga','Bhagirathi','Yamuna','Satluj'],ai:1,exp:'Highest dam in India.'},
{q:'Who was the first Indian to win a Nobel Prize?',options:['C.V. Raman','Mother Teresa','Rabindranath Tagore','Amartya Sen'],ai:2,exp:'Recap from Day 55.'}
],
hook:'1st PM=Nehru. 1st Woman Everest=Bachendri Pal. Longest=Nile. Highest Dam=Tehri. 1st Space=Gagarin.',
summary:'Comprehensive list of first Indian men and women in various fields. Major world and Indian geographical superlatives. Fast drill of historical firsts and global records.'},

{day:96,topic:'SSC Full Syllabus Simulation — Tier 1 Level',
intro:`Today is 'Game Day 1'. We simulate a Tier 1 level mock covering all 4 sections—Math, English, Reasoning, and GK. This is about 'Speed'. You have 15 minutes per section. Focus on easy questions first. Do not get stuck! Let's test your foundation today.`,
notes:[
{title:'Tier 1 Strategy',detail:'1. Reasoning (12-15 mins). 2. GK (5-7 mins). 3. English (10-12 mins). 4. Math (25-30 mins). Total 60 mins.'},
{title:'Target Score',detail:'Aim for 150+ in this mock. Accuracy must be >90% in English and Reasoning.'},
{title:'Section Mix',detail:'Includes: Analogy, Number System, Voice, Narration, Ancient History, Rivers, and Percentage.'},
{title:'Elimination Method',detail:'If you can eliminate two options, take a calculated risk.'},
{title:'Time Management',detail:'If a math question takes >1 min, SKIP and move on.'}
],
cards:[
{front:'Time for Reasoning?',back:'15 mins max.'},
{front:'Time for GK?',back:'7 mins max.'},
{front:'Strategy?',back:'EASY questions first.'},
{front:'Negative marking?',back:'0.50 marks (be careful).'},
{front:'Are you confident?',back:'YES.'}
],
q:[
{q:'Reasoning: Find odd one out.',options:['Lungs','Kidneys','Heart','Eyes'],ai:2,exp:'Others are paired (2), Heart is single.'},
{q:'Math: If x+1/x = 5, find x^2+1/x^2.',options:['23','25','27','21'],ai:0,exp:'5^2 - 2 = 23.'},
{q:'English: "To call off" means:',options:['To visit','To cancel','To shout','To start'],ai:1,exp:'Recap.'},
{q:'GK: Who built the Taj Mahal?',options:['Akbar','Jahangir','Shah Jahan','Aurangzeb'],ai:2,exp:'Basic fact.'}
],
hook:'Speed simulation. 60 mins. 4 sections. No ego. Move fast. Accuracy matters.',
summary:'Comprehensive full-length mock test based on the SSC Tier 1 pattern. Balanced distribution of questions from all four core subjects. Focus on time management and elimination strategies.'},

{day:97,topic:'SSC Full Syllabus Simulation — Tier 2 Level',
intro:`Today is 'Elite Day'. We simulate a Tier 2 level mock with higher difficulty in Math and English, and detailed Reasoning. This is about 'Endurance'. We also add the 'Probability' and 'Statistics' questions. Let's test your depth today.`,
notes:[
{title:'Tier 2 Focus',detail:'More questions on Algebra, Geometry, and Cloze Test. Reasoning includes Critical thinking (Statement-Assumption).'},
{title:'Math Depth',detail:'Check for 3D mensuration and Trigonometric identities.'},
{title:'English Depth',detail:'Longer RCs and complex Narration/Voice shifts.'},
{title:'Reasoning Depth',detail:'Focus on Syllogisms and Data sufficiency.'},
{title:'GK Focus',detail:'Deep facts on Art/Culture and Economy (Recap).'}
],
cards:[
{front:'Math weightage?',back:'Highest.'},
{front:'Reasoning in Tier 2?',back:'Yes, and harder.'},
{front:'Statistics formula?',back:'Mode=3Med-2Mean.'},
{front:'If side of cube increases 100%, Volume?',back:'Increases 700% (becomes 8x).'},
{front:'Are you ready for Tier 2?',back:'YES.'}
],
q:[
{q:'Math: Find volume of a sphere with r=7.',options:['1437.33','1500','1300','1600'],ai:0,exp:'4/3 * 22/7 * 343 = 1437.33.'},
{q:'Reasoning: "All A are B. Some B are C." Conclusion: "Some A are C."',options:['True','False','Maybe','None'],ai:1,exp:'No definite link between A and C.'},
{q:'English: "I said to him, Will you go?" Indirect?',options:['I asked him if he would go','I told him he would go','I asked him will he go','None'],ai:0,exp:'Standard conversion.'},
{q:'GK: "Bihu" is from which state?',options:['Assam','Manipur','Meghalaya','Mizoram'],ai:0,exp:'Fact check.'}
],
hook:'Endurance simulation. Tier 2 level. Accuracy + Depth. Statistics check. Logic drill.',
summary:'Full-length advanced mock test based on the SSC CGL Tier 2 pattern. Higher difficulty levels for quantitative and verbal sections. Includes new pattern topics like statistics and probability.'},

{day:98,topic:'SSC Full Syllabus — Peak Speed Simulation',
intro:`Today is 'Turbo Day'. We do a high-speed mock with a timer set to 45 minutes for the whole set. The goal is to reach 'Flow State'. No thinking, just reacting based on patterns. Let's test your instinct today.`,
notes:[
{title:'Flow State Strategy',detail:'Read question, if pattern recognized -> Mark. If not -> Skip immediately. No second thoughts.'},
{title:'Pattern Recognition',detail:'Math: Unit digits. English: Tense markers. Reasoning: Mirror symmetry.'},
{title:'Instinctive GK',detail:'Don\'t overthink. Your first gut feeling in GK is usually correct.'},
{title:'Avoid Traps',detail:'In speed, one might miss the "NOT" in the question. Read carefully but fast.'},
{title:'Mental Math',detail:'Use 22/7 and 3.6 tricks without writing.'}
],
cards:[
{front:'Unit digit of 3^4?',back:'1.'},
{front:'36 degrees = ?%',back:'10%.'},
{front:'Passive of "Do it"?',back:'"Let it be done".'},
{front:'Capital of Maurya?',back:'Pataliputra.'},
{front:'Are you fast?',back:'YES.'}
],
q:[
{q:'What is 15% of 20% of 1000?',options:['30','40','50','20'],ai:0,exp:'0.15 * 0.20 * 1000 = 30.'},
{q:'Which is NOT a classical dance?',options:['Kathak','Bihu','Odissi','Manipuri'],ai:1,exp:'Bihu is folk.'},
{q:'"He is very weak _____ he can\'t walk."',options:['so','that','as','because'],ai:1,exp:'Structure: so...that.'},
{q:'Mirror image of "A":',options:['Same','Inverted','Backward','None'],ai:0,exp:'Symmetric.'}
],
hook:'Turbo mode. 45 mins. Pattern recognition. Instinct over logic. Speed is mark. Finish fast.',
summary:'Accelerated mock test designed to improve response time. Focus on instinctive pattern recognition and mental math. Stress testing accuracy under severe time constraints.'},

{day:99,topic:'SSC Full Syllabus — Final Victory Simulation',
intro:`Today is the 'Grand Finale'. One final 100-question set covering the entire journey from Day 1 to Day 98. This is your 'Final Dress Rehearsal'. Stay calm, stay focused. You are ready. Let's finish the curriculum today.`,
notes:[
{title:'Balanced Mock',detail:'Carefully curated mix of easy, moderate, and hard questions based on previous 5 years of SSC CGL/CHSL.'},
{title:'Subject Mix',detail:'25 Math, 25 English, 25 Reasoning, 25 GK.'},
{title:'Final Audit',detail:'Use this mock to identify any last-minute weak areas in formulas or rules.'},
{title:'Mental Calm',detail:'Control your breathing. A calm mind scores 10% more.'},
{title:'The Officer Mindset',detail:'You are not a student anymore; you are a candidate ready for selection.'}
],
cards:[
{front:'Total questions?',back:'100.'},
{front:'Total days of study?',back:'99.'},
{front:'Your goal?',back:'SSC Officer.'},
{front:'Formula for everything?',back:'Persistence.'},
{front:'Are you a winner?',back:'DEFINITELY.'}
],
q:[
{q:'The HCF of 12 and 18 is:',options:['3','6','12','36'],ai:1,exp:'Fact.'},
{q:'"Thomas Cup" is Badminton?',options:['Yes','No','Maybe','Only for women'],ai:0,exp:'Fact.'},
{q:'"Each of the boys ____ going."',options:['is','are','were','have'],ai:0,exp:'Grammar.'},
{q:'Opposite of H?',options:['S','I','G','T'],ai:0,exp:'Reasoning.'}
],
hook:'Grand Finale. 100 questions. Full confidence. Full syllabus. The end of the journey is here.',
summary:'Comprehensive final mock exam covering the entire 100-day curriculum. Realistic SSC exam environment simulation. Final performance audit before the victory lap.'},

{day:100,topic:'SSC VICTORY LAP: Officer\'s Mindset',
intro:`CONGRATULATIONS! You have completed the 100-Day Mastery Journey for the SSC Ecosystem. From the basic numbers to the peak simulation—you have outworked the competition. Today is not for study, it is for 'Strategy and Victory'. Let's prepare for the real battle today.`,
notes:[
{title:'The Final Week Strategy',detail:'Review all "Hooks" and "Quick Cards". Don\'t learn anything new. Sleep 8 hours.'},
{title:'Exam Hall Tactics',detail:'1. Reach early. 2. Don\'t discuss questions with others. 3. Read every word of the question. 4. Manage the clock.'},
{title:'The Officer Mindset',detail:'Selection is a process of elimination. Don\'t be the one they eliminate. Be the one who stands till the end.'},
{title:'Believe in the Process',detail:'You have solved 1000+ questions in this curriculum. Trust your training.'},
{title:'Message from Antigravity',detail:'You are ready. Go and conquer.'}
],
cards:[
{front:'Days completed?',back:'100.'},
{front:'Status?',back:'READY.'},
{front:'Mindset?',back:'OFFICER.'},
{front:'Next step?',back:'THE EXAM.'},
{front:'Final Hook?',back:'SUCCESS IS YOURS.'}
],
q:[
{q:'Are you ready to become an SSC Officer?',options:['Yes','Definitely','Absolutely','All of the above'],ai:3,exp:'The only correct mindset.'}
],
hook:'100 DAYS COMPLETE. YOU ARE A MASTER. VICTORY IS INEVITABLE. GO AND WIN.',
summary:'Final strategic guidance for the exam week. Psychological preparation and confidence building. Summary of the 100-day transformation. Graduation from candidate to officer-ready.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Victory Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Victory Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL Strategy '+d.topic),why:'Final preparation for SSC success.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | MISSION COMPLETE',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

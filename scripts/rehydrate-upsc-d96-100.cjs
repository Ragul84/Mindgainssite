require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:96,topic:'UPSC S&T: Nuclear Energy & Particle Physics',
intro:`Today we study the 'Power of the Atom'. Nuclear energy is a vital part of India's low-carbon energy future. We explore India's 'Three-Stage Nuclear Power Program' and the basics of 'Nuclear Fission vs Fusion'. We also look at the frontiers of physics—the 'Higgs Boson' and 'Gravitational Waves'. For UPSC, focus on 'Thorium reserves' and the 'ITER project'. Let's master the subatomic world today.`,
notes:[
{title:'Three-Stage Nuclear Program',detail:'Designed by Homi J. Bhabha. 1. PHWR: Natural Uranium (Pu-239 byproduct). 2. FBR: Pu-239 + Thorium (U-233 byproduct). 3. Advanced: Thorium + U-233. India has the world\'s largest Thorium reserves.'},
{title:'Fission vs Fusion',detail:'Fission: Splitting of heavy nucleus (used in current power plants). Fusion: Joining of light nuclei (Sun\'s energy). ITER (France) is the international project for fusion energy.'},
{title:'Key Nuclear Sites',detail:'Kudankulam (TN - Largest), Tarapur (MH - 1st), Rawatbhata (RJ), Kaiga (KA).'},
{title:'Particle Physics',detail:'CERN (LHC): Discovered Higgs Boson (God Particle). LIGO: Discovered Gravitational Waves (India building LIGO-India in Maharashtra).'},
{title:'Nuclear Agreements',detail:'123 Agreement (India-USA). NSG (Nuclear Suppliers Group) waiver. India is not a signatory to NPT or CTBT but has a "No First Use" policy.'}
],
cards:[
{front:'Who is the "Father of Indian Nuclear Program"?',back:'Homi J. Bhabha.'},
{front:'India\'s main nuclear fuel for the future?',back:'Thorium.'},
{front:'What is "ITER"?',back:'International Thermonuclear Experimental Reactor (Fusion energy).'},
{front:'First nuclear test in India?',back:'Smiling Buddha (1974).'},
{front:'Where is "LIGO-India" being built?',back:'Hingoli, Maharashtra.'}
],
q:[
{q:'"Smiling Buddha" was the code name for:',options:['Gaganyaan mission','First nuclear test in 1974','LIGO project','Operation Blue Star'],ai:1,exp:'Conducted at Pokhran under Indira Gandhi.'},
{q:'The "Three-Stage Nuclear Program" of India aims to utilize:',options:['Uranium-235','Uranium-238','Thorium','Plutonium only'],ai:2,exp:'Thorium is abundant in India\'s monazite sands (Kerala).'},
{q:'The "Higgs Boson" is popularly known as:',options:['Sun Particle','Moon Particle','God Particle','Shadow Particle'],ai:2,exp:'It gives mass to other subatomic particles.'},
{q:'Which of the following is a "Nuclear Fusion" project?',options:['CERN','LIGO','ITER','ISRO'],ai:2,exp:'ITER aims to replicate the energy of the sun on Earth.'}
],
hook:'Thorium=India fuel. 3 Stages=Bhabha. Kudankulam=Largest. Smiling Buddha=1974. ITER=Fusion. Higgs=God particle.',
summary:'India\'s three-stage nuclear strategy. Principles of Fission and Fusion. Major particle physics discoveries (Higgs Boson/Gravitational Waves). Global nuclear governance and India\'s stance.'},

{day:97,topic:'UPSC REVISION: Science & Technology (Days 92–96)',
intro:`Today we wrap up 'Science & Technology'. You have traveled from the depths of the atom to the edges of the universe. S&T is the 'Application-based' pillar of UPSC—it rewards curiosity and awareness of modern trends. Today, we consolidate the tech. Can you explain NavIC? CRISPR? Web3? 3-Stage Nuclear? Let's master the technology that is building the future.`,
notes:[
{title:'Space Tech Recap',detail:'Launchers: PSLV, GSLV (Cryo), LVM3. NavIC (7 sats). Missions: Chandrayaan, Gaganyaan, Aditya-L1.'},
{title:'Biotech Recap',detail:'Gene editing: CRISPR. Vaccines: mRNA, DNA (ZyCoV-D). 3-Parent Baby (Mito). GM Crops (BT Cotton).'},
{title:'IT/AI Recap',detail:'Generative AI (LLMs). Web3 (Blockchain). Quantum (Qubits). 5G/6G. Edge computing.'},
{title:'Nano & Materials Recap',detail:'Graphene (2D Carbon). Nano-urea (Liquid). Targeted drug delivery.'},
{title:'Nuclear Recap',detail:'3-Stages (Thorium). Fission vs Fusion (ITER). LIGO (Gravitational waves). Higgs Boson.'}
],
cards:[
{front:'Which rocket launched Chandrayaan-3?',back:'LVM3 M4.'},
{front:'"National Quantum Mission" target year?',back:'2031.'},
{front:'Is "BT Mustard" legal in India?',back:'Environmental release approved, but contested in court.'},
{front:'What is "Cyber-Physical Systems"?',back:'Integration of computation, networking, and physical processes (IoT).'},
{front:'Highest peak in India? (History recap)',back:'K2.'}
],
q:[
{q:'"SDR" (Special Drawing Rights) is the currency of: (Economy Recap)',options:['World Bank','IMF','WTO','NDB'],ai:1,exp:'IMF\'s reserve asset based on 5 major currencies.'},
{q:'Which of the following is a "Greenhouse Gas" under Kyoto Protocol?',options:['Oxygen','CO2','Methane','Both 2 and 3'],ai:3,exp:'Includes CO2, CH4, N2O, HFCs, PFCs, and SF6.'},
{q:'"Deepfakes" are created using which technology?',options:['Blockchain','Cloud computing','Artificial Intelligence (GANs)','Quantum computing'],ai:2,exp:'Generative Adversarial Networks (GANs) are used to create realistic fakes.'},
{q:'The "10% Law" in ecology was given by: (Env Recap)',options:['Haeckel','Tansley','Lindeman','Darwin'],ai:2,exp:'Relates to energy transfer between trophic levels.'}
],
hook:'S&T complete. High speed drill of apps. NavIC, CRISPR, Web3, Nano, Nuclear. Consolidate and conquer.',
summary:'Full revision of Science and Technology syllabus. High-speed drill of modern technological terms. Interdisciplinary recap of S&T with Economy and Environment. Final S&T mock quiz.'},

{day:98,topic:'UPSC Peak Simulation Mock 1: Full Syllabus Drill',
intro:`Today we begin the 'Peak Simulation'. You have covered the entire 100-day journey. From the Harappans to the Ghadarites, the Himalayas to the Chotanagpur, the GDP to the GST, and the CRISPR to the Cryogenic engines. You are now a generalist with specialist-level clarity. Today, we simulate the 'Cross-disciplinary' thinking required for UPSC. Answer these 10 varied questions with speed and precision.`,
notes:[
{title:'The Simulation Mindset',detail:'1. Elimination Technique: Remove wrong options first. 2. 50-50 Rule: If two options remain, take the risk. 3. Direct Knowledge: Identify the facts you are 100% sure of.'},
{title:'Interdisciplinary Linkages',detail:'History + Polity (Acts). Geography + Economy (Minerals/Agri). Environment + S&T (Pollution control).'},
{title:'High-Frequency Areas',detail:'Fundamental Rights, Modern History Pacts, Indian Drainage, National Parks, Inflation, Biotechnology.'},
{title:'Data & Reports',detail:'WEO (IMF), WDR (WB), HDI (UNDP), SDG Index (NITI).'},
{title:'Logic of Options',detail:'UPSC often uses extreme words (Only, All, Always) in wrong statements. Watch out!'}
],
cards:[
{front:'Art 32?',back:'Heart and Soul of Constitution (Writs).'},
{front:'Battle of Plassey?',back:'1757.'},
{front:'Khadar?',back:'New Alluvium.'},
{front:'Repo Rate?',back:'RBI lends to banks.'},
{front:'Montreux Record?',back:'Threatened wetlands.'}
],
q:[
{q:'"Swaraj is my birthright" was said by:',options:['Gandhi','Tilak','Nehru','Bose'],ai:1,exp:'Lokmanya Tilak in the extremist phase.'},
{q:'The "10 Degree Channel" separates:',options:['Andaman & Nicobar','Lakshadweep & Minicoy','India & Sri Lanka','Sumatra & Java'],ai:0,exp:'Geography staple.'},
{q:'Which act introduced "Dyarchy" in provinces?',options:['1909','1919','1935','1947'],ai:1,exp:'Mont-Chelmsford Reforms.'},
{q:'"BOD" is a measure of:',options:['Air pollution','Water pollution','Soil health','Noise'],ai:1,exp:'Organic pollution in water.'},
{q:'Which of the following is a "Maharatna"?',options:['NTPC','BSNL','Air India','HAL'],ai:0,exp:'Power sector giant.'},
{q:'"Dandi March" started in:',options:['1920','1930','1942','1919'],ai:1,exp:'Start of CDM.'},
{q:'Who publishes the "World Economic Outlook"?',options:['World Bank','WTO','IMF','WEF'],ai:2,exp:'IMF biannual report.'},
{q:'What is "CRISPR-Cas9"?',options:['Satellite','Gene editing tool','Missile','Computer virus'],ai:1,exp:'Biotech high-yield.'},
{q:'The "Himalayas" are which type of mountains?',options:['Block','Volcanic','Fold','Relict'],ai:2,exp:'Young fold mountains.'},
{q:'"GST Council" is headed by:',options:['PM','President','Finance Minister','RBI Governor'],ai:2,exp:'Cooperative federalism body.'}
],
hook:'Elimination is key. Don\'t panic. You know this. Trust the 100-day process.',
summary:'Full-length syllabus simulation. 10 high-stakes questions covering History, Geography, Polity, Economy, and S&T. Detailed logic for each answer. Mindset training for the actual exam day.'},

{day:99,topic:'UPSC Peak Simulation Mock 2: Rapid Elimination Drill',
intro:`Today is the 'Speed Drill'. In UPSC, time management is as important as knowledge. You have 2 hours to solve 100 questions. Today, we practice 'Rapid Elimination'. We will give you statements, and you must find the 'Traps'. Look for extreme words, look for incorrect years, and look for mismatched bodies. Let's sharpen your predatory instincts for the Prelims today.`,
notes:[
{title:'Trap Detection',detail:'1. "ONLY/ALL/ALWAYS": Usually 90% wrong in UPSC. 2. Ministry Mismatch: Putting a scheme in the wrong ministry. 3. Year Swapping: 1919 vs 1935. 4. Body Mismatch: Statutory vs Executive.'},
{title:'Educated Guessing',detail:'If you can eliminate two options, you MUST mark the answer. The probability is in your favor.'},
{title:'Subject Prioritization',detail:'Start with your strongest subject to gain momentum. For most, this is History or Polity.'},
{title:'The "Last 15 Minutes" Rule',detail:'Check your OMR, don\'t make bubbling errors. Verify if you have marked all "Sure" questions.'},
{title:'Mental Equilibrium',detail:'The exam will have 10-15 "Impossible" questions. Leave them. Focus on the 85 you can solve.'}
],
cards:[
{front:'Who publishes HDI?',back:'UNDP.'},
{front:'"Do or Die" slogan?',back:'Gandhi (Quit India).'},
{front:'"Dakshin Ganga" is?',back:'Godavari.'},
{front:'"Gini Coefficient"?',back:'Inequality.'},
{front:'"Paris Agreement" target?',back:'1.5°C.'}
],
q:[
{q:'Statement 1: The Finance Commission is a statutory body.\nStatement 2: It is appointed by the President every 5 years.',options:['Only 1 is correct','Only 2 is correct','Both are correct','None are correct'],ai:1,exp:'FC is CONSTITUTIONAL (Art 280), not statutory.'},
{q:'"BT Cotton" is the ONLY GM crop commercially allowed in India.',options:['True','False'],ai:0,exp:'Correct. Others are still under review or restricted.'},
{q:'"Indira Point" is located in the Kanyakumari district.',options:['True','False'],ai:1,exp:'False. It is in Great Nicobar island.'},
{q:'"Repo Rate" is always higher than "Reverse Repo Rate".',options:['True','False'],ai:0,exp:'True. This creates a "corridor" for liquidity management.'},
{q:'Which of the following was a "Moderate" leader?\n1. Tilak\n2. Naoroji\n3. Bipin Chandra Pal',options:['1 and 3','2 only','All of them','None'],ai:1,exp:'Tilak and Pal were Extremists.'},
{q:'"Ramsar Convention" relates to the conservation of Forests.',options:['True','False'],ai:1,exp:'False. It is for Wetlands.'},
{q:'"GDP Deflator" includes the price of imported goods.',options:['True','False'],ai:1,exp:'False. GDP only covers DOMESTIC production. Imports are in CPI.'},
{q:'The "Governor" of a state is elected by the people.',options:['True','False'],ai:1,exp:'False. Appointed by the President.'},
{q:'"NavIC" uses 24 satellites for navigation.',options:['True','False'],ai:1,exp:'False. It uses 7 satellites. GPS uses 24.'},
{q:'"Poona Pact" gave separate electorates to Dalits.',options:['True','False'],ai:1,exp:'False. It gave RESERVED SEATS, not separate electorates.'}
],
hook:'Extreme words=Caution. Fact check every statement. Don\'t rush, but don\'t crawl. Elimination is your sword.',
summary:'Advanced elimination techniques and trap detection. 10 statement-based questions designed to mimic UPSC complexity. Time management strategies and subject prioritization. Final tactical drill.'},

{day:100,topic:'UPSC FINAL VICTORY LAP: The Officer\'s Mindset',
intro:`Congratulations! You have completed the 100-Day Mastery Curriculum. You have hydrated your mind with the entire spectrum of Indian administration. From the Harappan drainage to 6G technology—you are now ready to face any challenge. Today is not for new facts. It's for 'Confidence'. We will recap the 10 most vital hooks of each subject. You have done the work. Now, go and conquer. You are already an officer in the making.`,
notes:[
{title:'Polity 10-Hooks',detail:'Preamble, FR (14-32), DPSP, President (72/123), Parliament (Joint Sitting), Judiciary (Writs), Federalism (GST/FC), Local Govt (73/74), Constitutional Bodies, Schedules.'},
{title:'History 10-Hooks',detail:'Indus Valley, Ashoka, Gupta (Art), Bhakti, Mughals (Admin), 1857, Moderates/Extremists, Gandhi (3 mass movements), 1935 Act, Partition/Integration.'},
{title:'Geography 10-Hooks',detail:'Himalayas (K-L-Z-P), Plains (Bhabar/Khadar), Plateau (Ghats), Rivers (Ganga/Narmada), Monsoon (SW/NE), Soils (Black/Alluvial), Forests, Minerals (Coal/Iron), Crops (Lead states), Mapping.'},
{title:'Economy 10-Hooks',detail:'GDP/GNP/Real, Inflation (CPI/RBI), Monetary Policy (Repo), Budget (Deficits), Taxation (GST), Poverty (Tendulkar), Planning (NITI), External (BOP/FDI), Agriculture (MSP), Global Orgs (IMF).'},
{title:'S&T + Env 10-Hooks',detail:'ISRO (Launchers), Biotech (CRISPR), AI/Blockchain, Nuclear (3-stages), Nano, Ecosystem (Energy flow), Biodiversity (Hotspots), Climate (Paris/Montreal), Pollution (BOD), WPA 1972.'},
{title:'The Final Message',detail:'"Victory is a habit." You have built the habit of daily learning. In the exam hall, stay calm. Every question is just a fact you\'ve already seen. Trust your 100-day journey.'}
],
cards:[
{front:'Who am I?',back:'A Future Indian Administrative Service Officer.'},
{front:'My Strategy?',back:'Accuracy over Quantity. Elimination over Guesswork.'},
{front:'My Shield?',back:'The 100-Day Mastery Foundation.'},
{front:'My Goal?',back:'Service to the Nation.'},
{front:'Am I ready?',back:'YES.'}
],
q:[
{q:'The 100-Day Mastery Curriculum was designed to:',options:['Bore you','Overwhelm you','Hydrate your mind for success','Just pass time'],ai:2,exp:'You have systematically mastered the syllabus.'},
{q:'Which of the following is the most important for UPSC Prelims?',options:['Rote learning','Speed reading','Conceptual clarity and elimination','Luck'],ai:2,exp:'Knowledge + Logic = Success.'},
{q:'What is the first thing to do in the exam hall?',options:['Panic','Check who is around','Read the instructions and stay calm','Sleep'],ai:2,exp:'Mental equilibrium is 50% of the battle.'},
{q:'Final check: Which article deals with the Preamble?',options:['Article 1','Article 370','Preamble is the prefix (not an article)','Article 12'],ai:2,exp:'It is the identity card of the Constitution.'}
],
hook:'You are ready. The 100 days are in your blood. Stay calm. Be precise. Eliminate. Conquer.',
summary:'Final victory lap and motivational summary. Subject-wise high-yield hook recap. Tactical exam-day advice. Affirmation of mastery. The end of the 100-day journey.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏆 UPSC VICTORY HOOK: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Final Lap Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: Motivation & Final Strategy',url:'https://youtube.com/results?search_query=UPSC+Prelims+Final+Strategy',why:'Mental preparation for the big day.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | DAY 100',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

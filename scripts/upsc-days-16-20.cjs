require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const days = [
{
  day:16, topic:'Indus Valley Civilisation',
  notes:[
    {title:'Urban Planning', detail:'World\'s first urban planners. Grid pattern streets, covered drainage, two-part city: Citadel (upper) + Lower Town. Mohenjo-daro: Great Bath (ritual purification), Granary. Harappa: Granary outside citadel.'},
    {title:'Trade & Economy', detail:'Long-distance trade with Mesopotamia (Meluha = IVC in Sumerian texts). Used Steatite (soapstone) seals with Pashupati motif and unicorn for trade identity — NOT currency. Weights & measures were standardized (binary + decimal system).'},
    {title:'What IVC Did NOT Have', detail:'No Iron (Bronze Age civilization). No Horses (Surkotada remains debated, not widely accepted as domesticated). No temples or evidence of priest-king. No deciphered script (Indus script still undeciphered).'},
    {title:'Decline Theories', detail:'Multiple theories: Aryan Invasion (Wheeler — now discredited), Climate change/drought (most accepted), Tectonic shifts changing river courses, Flooding. No single accepted reason.'}
  ],
  hook:'UPSC Trap: "IVC had a centralized monarchy" — FALSE. No evidence of a single ruler. Likely governed by a merchant/priestly class. Also: IVC script is undeciphered — so any claim about their language/beliefs is speculative and should be treated as "evidence suggests" not "IVC believed."',
  cards:[
    {front:'What are the three most important sites of IVC and their unique features?', back:'Mohenjo-daro: Great Bath + Granary. Harappa: Granary outside citadel + Two-row worker\'s barracks. Dholavira (Gujarat): Water conservation system + Stadium-like structure + Sign-board with Indus script.'},
    {front:'Why is the "Aryan Invasion Theory" no longer accepted for IVC decline?', back:'No archaeological evidence of battle or massacre at IVC sites. Skeletal analysis at Mohenjo-daro showed deaths from disease/flood, not warfare. DNA studies (2019) show no major Central Asian migration during IVC decline period.'},
    {front:'What was the significance of Steatite seals in IVC?', back:'Used as trade identity markers and administrative tokens — NOT currency. Featured animals (unicorn most common), Pashupati figure, and undeciphered script. Found in Mesopotamia too, proving long-distance trade (called Meluha in Sumerian records).'}
  ],
  q:[
    {q:'Which of the following statements about the Indus Valley Civilisation is CORRECT?', options:['IVC people used iron extensively in their tools','IVC had a centralized monarchical political system','IVC had a standardized system of weights and measures','IVC script has been fully deciphered by modern scholars'], answer_index:2, explanation:'Standardized weights (binary ratios: 1,2,4,8,16...) and measures are well-documented. IVC was Bronze Age — NO iron. No evidence of centralized monarchy — likely merchant-governed. IVC script remains undeciphered despite over 400 attempts.'},
    {q:'The term "Meluha" found in Mesopotamian records most likely refers to which civilization?', options:['Vedic civilization','Persian Empire','Indus Valley Civilisation','Egyptian Old Kingdom'], answer_index:2, explanation:'Meluha appears in Sumerian and Akkadian texts as a distant land supplying carnelian beads, copper, and timber. Archaeologists identify it with IVC based on trade goods found at both sites.'}
  ],
  pyq:'High — UPSC 2019, 2021. IVC governance, trade, and material culture tested.',
  summary:'IVC: Bronze Age(No Iron,No Horse). Grid cities: Citadel+Lower Town. Mohenjo-daro(Great Bath+Granary). Harappa(Granary). Dholavira(Water conservation). Steatite seals=trade identity. Meluha=IVC in Sumerian. Script=undeciphered. Decline: Climate change most accepted. Aryan Invasion theory=discredited. Governance=merchant class, NOT monarchy.'
},
{
  day:17, topic:'Buddhism & Jainism: Philosophy & Four Councils',
  notes:[
    {title:'Buddhism — Core Philosophy', detail:'Four Noble Truths: Dukkha (suffering), Samudaya (cause=desire), Nirodha (cessation), Magga (path=Eightfold Path). Middle Path: between extreme asceticism and luxury. Anatman: no permanent self. Anicca: impermanence. Nirvana: extinguishing of desire.'},
    {title:'Four Buddhist Councils', detail:'1st: Rajgir (Ajatashatru, 483 BCE) — compiled Vinaya Pitaka & Sutta Pitaka. 2nd: Vaishali (Kalasoka, 383 BCE) — split into Sthaviravada & Mahasanghika. 3rd: Pataliputra (Ashoka, 250 BCE) — Abhidhamma Pitaka added, missionaries sent. 4th: Kashmir (Kanishka, 72 CE) — Mahayana vs Hinayana formal split, Mahavibhasha compiled.'},
    {title:'Jainism — Key Philosophy', detail:'Triratna: Right Faith, Right Knowledge, Right Conduct. Anekantavada (many-sidedness of truth). Syadvada: "Maybe" theory — all statements are conditional. Ahimsa is absolute. No god concept — Tirthankaras are role models not gods. 24 Tirthankaras, Mahavira was the 24th.'},
    {title:'Nirguna vs Saguna Bhakti', detail:'Nirguna (God without form): Kabir, Guru Nanak, Ravidas. Saguna (God with form): Tulsidas (Ram), Mirabai (Krishna), Surdas (Krishna). Bhakti movement bridged caste — saints came from all social groups.'}
  ],
  hook:'UPSC High-Yield: The 4th Buddhist Council was held in Kashmir under Kanishka and led to the Mahayana-Hinayana split. Mahayana: Buddha as divine being, idol worship, bodhisattva concept. Hinayana: Original Buddhism, no idol worship, personal salvation. This distinction appears in map-based and philosophy questions.',
  cards:[
    {front:'What is the difference between Anekantavada and Syadvada in Jain philosophy?', back:'Anekantavada: Reality has multiple aspects — no single viewpoint captures the whole truth. Syadvada: All assertions are conditional ("maybe" — Syat). Syadvada is the linguistic expression of Anekantavada.'},
    {front:'Which Buddhist Council led to the formal split between Mahayana and Hinayana?', back:'4th Buddhist Council — held in Kashmir under Kanishka (Kushan ruler, ~72 CE). Mahayana: Bodhisattva ideal, Buddha as divine, idol worship spread to China/Japan. Hinayana (Theravada): Personal liberation, no idol worship, spread to Sri Lanka/SE Asia.'},
    {front:'What are the Triratnas (Three Jewels) of Jainism?', back:'Right Faith (Samyak Darshana), Right Knowledge (Samyak Jnana), Right Conduct (Samyak Charitra). Together these lead to liberation (Moksha). Ahimsa is considered the supreme Dharma.'}
  ],
  q:[
    {q:'The Fourth Buddhist Council was presided over by whom and where was it held?', options:['Ashoka at Pataliputra','Moggaliputta Tissa at Pataliputra','Vasumitra at Kundalvana, Kashmir','Mahakassapa at Rajgir'], answer_index:2, explanation:'4th Council: Presided by Vasumitra (VP: Ashvaghosha) at Kundalvana near Kashmir, under Kanishka (Kushan). This led to Mahayana-Hinayana split and compilation of Mahavibhasha. 3rd Council: Moggaliputta Tissa under Ashoka at Pataliputra — classic confusion point.'},
    {q:'Which of the following pairs is correctly matched: Bhakti Saint — Tradition?', options:['Kabir — Saguna Bhakti (Ram devotee)','Mirabai — Nirguna Bhakti','Tulsidas — Saguna Bhakti (Ram devotee)','Guru Nanak — Saguna Bhakti'], answer_index:2, explanation:'Tulsidas: Saguna (Ram — wrote Ramcharitmanas). Kabir: Nirguna (no form, weaver-poet). Mirabai: Saguna (Krishna devotee). Guru Nanak: Nirguna (formless God concept in Sikhism). Classic saint-tradition swap trap.'}
  ],
  pyq:'Very High — UPSC 2013, 2016, 2018, 2021, 2023. Buddhist Councils and Jain philosophy tested every cycle.',
  summary:'Buddhism: 4 Noble Truths+Eightfold Path. 4 Councils: Rajgir(483BCE,Ajatashatru)→Vaishali(383BCE,Kalasoka,split)→Pataliputra(250BCE,Ashoka,Abhidhamma)→Kashmir(72CE,Kanishka,Mahayana-Hinayana split). Jainism: Triratna+Syadvada+Anekantavada. 24 Tirthankaras. Bhakti: Nirguna(Kabir,Nanak) vs Saguna(Tulsidas,Mirabai).'
},
{
  day:18, topic:'Mauryan Empire: Ashoka & Administration',
  notes:[
    {title:'Administrative Structure', detail:'First pan-Indian empire (322-185 BCE). Chandragupta founded, Chanakya (Kautilya) as PM — wrote Arthashastra. Capital: Pataliputra. Divided into: Centre → Provinces (Chakras) → Districts (Ahara) → Villages (Grama). Provincial capitals: Taxila (NW), Ujjain (W), Tosali (E), Suvarnagiri (S).'},
    {title:'Key Officials', detail:'Amatyas: Senior ministers. Samaharta: Chief tax collector. Sannidhata: Chief treasurer. Mahamatra: Inspectors (Ashokan innovation). Rajuka: Rural administrators with judicial powers. Dhamma Mahamattas: Officers for Dhamma propagation (Ashoka\'s unique addition).'},
    {title:'Ashoka\'s Dhamma', detail:'NOT a religion — a socio-ethical code. Principles: Ahimsa, tolerance, respect for all religions, service, truthfulness. Purpose: Administrative unity and social harmony across diverse empire. Dhamma Mahamattas appointed to spread it. Inscribed on Rock Edicts and Pillar Edicts.'},
    {title:'Key Edicts', detail:'Major Rock Edict XIII: Ashoka\'s remorse after Kalinga War (261 BCE). Pillar Edict VII: Summary of Dhamma and Ashoka\'s welfare measures. Minor Rock Edict I: Ashoka\'s conversion to Buddhism. Rock Edict XII: Tolerance of all sects.'}
  ],
  hook:'UPSC Nuance: Ashoka\'s Dhamma was NOT about promoting Buddhism. It was a secular ethical code for ALL subjects. He DID patronize Buddhism personally but Dhamma was deliberately non-sectarian. UPSC tests this distinction in "which of the following is NOT a principle of Ashokan Dhamma" type questions.',
  cards:[
    {front:'What was the role of Dhamma Mahamattas in the Mauryan Empire?', back:'Officers appointed by Ashoka specifically to propagate Dhamma principles across the empire. Monitored welfare of people, ensured tolerance, and reported directly to Ashoka. Unique Ashokan administrative innovation.'},
    {front:'What does Major Rock Edict XIII reveal about Ashoka?', back:'Contains Ashoka\'s remorse over the Kalinga War (261 BCE) — 1,00,000 killed, 1,50,000 captured. Describes his conversion to Buddhism and adoption of Dhamma. Most personal and emotionally significant of all Ashokan inscriptions.'},
    {front:'Distinguish between Samaharta and Sannidhata in Mauryan administration.', back:'Samaharta: Chief tax collector — responsible for revenue collection from all provinces. Sannidhata: Chief treasurer — responsible for storing and maintaining the royal treasury. Both were top financial officers.'}
  ],
  q:[
    {q:'Ashoka\'s Dhamma was primarily aimed at which of the following objectives?', options:['Spreading Buddhism across Asia','Creating a theocratic Buddhist state','Providing a socio-ethical code for administrative unity','Suppressing non-Buddhist religious practices'], answer_index:2, explanation:'Dhamma was a socio-ethical administrative tool — NOT for converting people to Buddhism. It emphasized ahimsa, tolerance, service, and truthfulness across ALL religious communities. Rock Edict XII explicitly asks all sects to honor each other.'},
    {q:'The provincial capital Tosali in the Mauryan Empire was located in which region?', options:['Northwest (modern Pakistan)','Western India','Eastern India (Kalinga region)','Southern India'], answer_index:2, explanation:'Tosali was the provincial capital for the eastern region, which included Kalinga (modern Odisha). After the Kalinga War, Ashoka transformed this province using Dhamma-based governance. Taxila=NW, Ujjain=W, Suvarnagiri=S.'}
  ],
  pyq:'High — UPSC 2014, 2018, 2020. Ashokan edicts, Dhamma concept, and administrative terms tested.',
  summary:'Mauryan Empire(322-185BCE): Chandragupta+Kautilya(Arthashastra). Provincial capitals: Taxila(NW)+Ujjain(W)+Tosali(E)+Suvarnagiri(S). Officials: Samaharta(tax)+Sannidhata(treasury)+Dhamma Mahamattas(Ashokan). Kalinga War(261BCE)=RockEdictXIII(remorse). Dhamma=socio-ethical code(NOT Buddhist proselytization). Rock Edict XII=tolerance of all sects.'
},
{
  day:19, topic:'Gupta Empire: The Decentralized Golden Age',
  notes:[
    {title:'Political Structure', detail:'Gupta Empire (320-550 CE). Founded by Chandragupta I. Peak under Chandragupta II (Vikramaditya). Unlike Mauryas, Guptas had DECENTRALIZED administration — relied on feudal lords (Samantas) and land grants. This flexibility allowed cultural flowering but weakened central control.'},
    {title:'Feudalism & Land Grants', detail:'Agraharas: Tax-free land grants to Brahmins for religious services. This led to rise of local landed gentry. Revenue sharing replaced direct tax collection. The Samanta system (feudal lords) became dominant — seeds of post-Gupta political fragmentation.'},
    {title:'Science & Literature', detail:'Aryabhatta: Value of Pi (3.1416), Earth rotates on axis, solar eclipses explained scientifically. Varahamihira: Brihatsamhita (encyclopedia of natural science). Kalidasa: Abhijnanasakuntalam, Meghaduta, Raghuvamsa. Vishakhadatta: Mudrarakshasa. Amarasimha: Amarakosha (Sanskrit thesaurus).'},
    {title:'Currency & Economy', detail:'Dinara: Gold coins of Guptas. Issued largest number of gold coins in ancient India BUT purity declined over time (Huna invasions pressured economy). Silver coins called Rupyaka. Trade routes to Rome declined after Roman Empire weakened.'}
  ],
  hook:'UPSC Contrast Trap: Mauryan = Centralized (direct tax, rigid bureaucracy). Gupta = Decentralized (land grants, Samanta feudalism). This difference explains why Mauryas collapsed quickly after Ashoka while Guptas faded slowly. UPSC loves "compare Mauryan and Gupta administration" type questions.',
  cards:[
    {front:'What were Agraharas in the Gupta period and why were they significant?', back:'Tax-free land grants given to Brahmins for religious and scholarly services. Led to rise of local landed aristocracy and weakened central revenue collection. Marks the beginning of Indian feudalism.'},
    {front:'What was Aryabhatta\'s most significant contribution relevant to astronomy?', back:'Proposed Earth rotates on its own axis (heliocentric tendencies). Calculated Pi = 3.1416. Explained solar and lunar eclipses scientifically (not as demons). Wrote Aryabhatiya — all before 499 CE.'},
    {front:'What does the declining purity of Gupta gold coins (Dinara) indicate?', back:'Economic stress — likely due to: 1) Decline in Roman trade after 4th century CE. 2) Cost of defending against Huna invasions. 3) Revenue pressure from decentralized feudal system reducing central treasury.'}
  ],
  q:[
    {q:'Which of the following correctly distinguishes Gupta administration from Mauryan administration?', options:['Guptas had stronger central bureaucracy than Mauryas','Guptas relied on feudal Samanta system unlike Mauryan centralization','Mauryas used land grants (Agraharas) while Guptas used direct taxation','Both Maurya and Gupta had identical provincial administration'], answer_index:1, explanation:'Guptas were decentralized — relied on Samantas (feudal lords) and Agraharas (land grants). Mauryas had a highly centralized bureaucracy with paid officials (Amatyas, Rajukas). This is the fundamental administrative contrast UPSC frequently tests.'},
    {q:'Kalidasa\'s Abhijnanasakuntalam is classified as what type of literary work?', options:['Epic poem','Sanskrit play (Nataka)','Grammar treatise','Astronomical text'], answer_index:1, explanation:'Abhijnanasakuntalam is a Sanskrit play (Nataka) — considered the pinnacle of classical Sanskrit drama. Meghaduta is a lyric poem. Raghuvamsa is an epic poem. All three are by Kalidasa, the Gupta-era poet often called the "Shakespeare of Sanskrit."'}
  ],
  pyq:'Medium-High — UPSC 2015, 2019, 2022. Gupta feudalism, Aryabhatta, and Kalidasa tested.',
  summary:'Gupta(320-550CE): Chandragupta I→ChandraguptaII(Vikramaditya). DECENTRALIZED: Samanta feudalism+Agraharas(land grants to Brahmins). Aryabhatta: Pi+Earth rotation+eclipse. Kalidasa: Abhijnanasakuntalam(play)+Meghaduta(poem). Dinara(gold coins, declining purity=Huna pressure+Roman trade decline). Contrast with Mauryan centralization is key UPSC theme.'
},
{
  day:20, topic:'Delhi Sultanate: Dynasties & Administration',
  notes:[
    {title:'Five Dynasties (Memory Chain)', detail:'Slave/Mamluk (1206-1290): Aibak→Iltutmish→Razia→Balban. Khilji (1290-1320): Jalaluddin→Alauddin. Tughlaq (1320-1414): Ghiyasuddin→Muhammad→Firuz. Sayyid (1414-1451): Khizr Khan. Lodi (1451-1526): Bahlul→Sikandar→Ibrahim. Ends with Panipat I (1526).'},
    {title:'Administrative Departments', detail:'Diwan-i-Wizarat: Revenue (Prime Minister heads). Diwan-i-Arz: Military. Diwan-i-Insha: Royal correspondence. Diwan-i-Risalat: Foreign affairs/Religious. Diwan-i-Kohi: Agriculture (Muhammad bin Tughlaq). Diwan-i-Khairat: Charity (Firuz Shah Tughlaq).'},
    {title:'Iqta System', detail:'Revenue assignment system. Started by Iltutmish. Officer (Iqtadar/Muqti) assigned a territory — collects revenue, pays army, sends surplus to Centre. Reformed by Alauddin Khilji — made it hereditary and centralized control. Key: Replaced cash salary system.'},
    {title:'Alauddin Khilji\'s Reforms', detail:'4 Markets in Delhi: Shahna-i-Mandi (grain), Cloth market, Cattle market, General market. Fixed prices controlled by Shahna (market controller). Purpose: Fund large army cheaply. Also introduced: Token currency (copper) — before Tughlaq\'s failed experiment.'}
  ],
  hook:'UPSC Department Trap: Diwan-i-Arz = MILITARY (not revenue). Diwan-i-Wizarat = REVENUE. Diwan-i-Kohi (agriculture) was Muhammad bin Tughlaq\'s innovation. Firuz Shah added Diwan-i-Khairat (charity). These new departments are always used to create wrong-pair traps.',
  cards:[
    {front:'Which Sultanate ruler introduced the Iqta System and what was its purpose?', back:'Iltutmish introduced it (not Aibak). Officers (Iqtadars) assigned revenue territories instead of cash salaries — they collected local revenue, maintained armies from it, and sent surplus to Centre. More efficient than salary system for a large empire.'},
    {front:'What were Alauddin Khilji\'s four markets in Delhi?', back:'1. Shahna-i-Mandi (grain/food market). 2. Cloth market. 3. Cattle and horse market. 4. General commodity market. Controlled by Shahna (market controller) with strict price regulation. Purpose: Maintain large army at low cost.'},
    {front:'Which two new administrative departments were created by Muhammad bin Tughlaq and Firuz Shah Tughlaq respectively?', back:'Muhammad bin Tughlaq: Diwan-i-Kohi (agriculture department — to extend cultivation). Firuz Shah Tughlaq: Diwan-i-Khairat (charity/welfare department — for relief to poor and unemployed). Both are "new department" traps in exams.'}
  ],
  q:[
    {q:'Which of the following pairs of Sultanate department and function is INCORRECTLY matched?', options:['Diwan-i-Wizarat — Revenue administration','Diwan-i-Arz — Military affairs','Diwan-i-Kohi — Foreign affairs','Diwan-i-Insha — Royal correspondence'], answer_index:2, explanation:'Diwan-i-Kohi was the AGRICULTURE department created by Muhammad bin Tughlaq. Foreign affairs were handled by Diwan-i-Risalat. Classic function-swap trap in UPSC.'},
    {q:'The Iqta System in the Delhi Sultanate is best described as which of the following?', options:['A system of direct taxation by the state','Assignment of revenue territories to officers in lieu of salary','A land ownership system for Rajput chiefs','A charity system for poor scholars'], answer_index:1, explanation:'Iqta = Revenue assignment. Officers (Muqtis/Iqtadars) collected revenue from assigned territory, paid their troops, and remitted surplus to the Centre. It replaced the cash salary system and was more administratively efficient.'}
  ],
  pyq:'Very High — UPSC 2016, 2018, 2021. Department-function matching and Iqta System tested in almost every cycle.',
  summary:'Delhi Sultanate: Slave→Khilji→Tughlaq→Sayyid→Lodi(1206-1526). Ends Panipat I(1526). Iqta=Iltutmish(revenue assignment). Depts: Wizarat(revenue)+Arz(military)+Insha(correspondence)+Risalat(foreign)+Kohi(agriculture,MBT)+Khairat(charity,FST). Alauddin: 4 markets+price control. Qutb Minar: Aibak started, Iltutmish completed, Firuz added 5th storey.'
}
];

async function push() {
  for(const d of days){
    const payload = {
      topic_title:d.topic, day_number:d.day, track:'upsc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ **UPSC Ranker Hook**: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Exam Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'Mastering '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC '+d.topic+' history prelims'),why:'Coaching-grade history tutorial.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const {error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:payload,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error) console.error('Day '+d.day+':',error.message);
    else console.log('Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 16-20 COMPLETE');
}
push();

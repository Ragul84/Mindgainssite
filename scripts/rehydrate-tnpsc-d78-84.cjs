require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:78,topic:'TNPSC Geography: Climate & Monsoon',
intro:`Today we study the 'Breath of the Land'. Climate and Monsoon are critical for TNPSC Geography. In TNPSC, 'Retreating Monsoon (NE Monsoon)' and 'El Nino' are high-yield. Do you know why TN gets most of its rain in winter? Let's master the winds today.`,
notes:[
{title:'Climate of India',detail:'Tropical Monsoon Climate. 4 seasons: Winter (Jan-Feb), Summer (Mar-May), SW Monsoon (Jun-Sep), NE Monsoon (Oct-Dec).'},
{title:'SW Monsoon',detail:'Enters via Kerala (June). Two branches: Arabian Sea and Bay of Bengal. Provides 75% rain to India.'},
{title:'NE Monsoon (Retreating)',detail:'Primary source of rain for Tamil Nadu (Oct-Dec). TN gets ~48% of its annual rain from here.'},
{title:'Tamil Nadu Climate',detail:'Tropical Maritime. Hottest: May (Agni Nakshatram). Rainiest: Nov (NE Monsoon).'},
{title:'Agri-Climatic Zones',detail:'TN is divided into 7 zones. Focus on Cauvery Delta and Western zones.'}
],
cards:[
{front:'TN main rain source?',back:'NE Monsoon (Retreating).'},
{front:'SW Monsoon starts in?',back:'June (Kerala).'},
{front:'Hottest month in TN?',back:'May.'},
{front:'NE Monsoon period?',back:'October to December.'},
{front:'India\'s climate type?',back:'Tropical Monsoon.'}
],
q:[
{q:'Which of the following monsoons provides maximum rainfall to Tamil Nadu?',options:['SW Monsoon','NE Monsoon','Winter rain','Mango showers'],ai:1,exp:'TN lies in the rain shadow region of SW monsoon; NE monsoon is the savior.'},
{q:'"Agni Nakshatram" in Tamil Nadu occurs during:',options:['April','May','June','July'],ai:1,exp:'The peak summer period.'},
{q:'The "Retreating Monsoon" is another name for:',options:['SW Monsoon','NE Monsoon','Cyclonic rain','None'],ai:1,exp:'Winds move from land to sea.'},
{q:'Which state is the first to receive the South-West monsoon in India?',options:['Tamil Nadu','Kerala','Karnataka','Maharashtra'],ai:1,exp:'Early June arrival.'}
],
hook:'NE Monsoon=TN Rain. SW Monsoon=India Rain. May=Hot. Oct-Dec=Retreating. Kerala=1st Rain.',
summary:'Analysis of seasonal patterns in India and Tamil Nadu. Importance of the NE monsoon for TN agriculture. Identification of major climatic zones and peak temperature periods.'},

{day:79,topic:'TNPSC Geography: Resources & Energy',
intro:`Today we study the 'Wealth of the Land'. Resources like Lignite, Natural Gas, and Renewable Energy are vital. In TNPSC, 'Solar and Wind energy' records of TN are high-yield. Do you know which state is the leader in Wind energy? Let's master the power today.`,
notes:[
{title:'Mineral Wealth (Recap)',detail:'Lignite (Neyveli - largest in India). Magnesite (Salem). Bauxite (Shevaroy hills).'},
{title:'Renewable Energy',detail:'TN is a global leader. 1st in Wind Energy (Muppandal, Aralvaimozhi). Large Solar plants (Kamuthi, Ramanathapuram).'},
{title:'Thermal & Nuclear',detail:'Nuclear: Kudankulam (Thoothukudi - Indo-Russian), Kalpakkam (MAPS). Thermal: Ennore, Mettur, Thoothukudi.'},
{title:'Forest Resources',detail:'Total Forest Cover ~20.21%. Largest forest area: Dharmapuri. Mangroves: Pichavaram (Cuddalore - 2nd largest in world).'},
{title:'Wildlife',detail:'Mudumalai (Nilgiris), Anaimalai (Top Slip), Guindy (Chennai), Gulf of Mannar (Marine).'}
],
cards:[
{front:'Leader in Wind energy?',back:'Tamil Nadu.'},
{front:'Where is Muppandal?',back:'Kanyakumari (Wind power).'},
{front:'2nd largest Mangrove in world?',back:'Pichavaram.'},
{front:'Nuclear plant in TN (Indo-Russian)?',back:'Kudankulam.'},
{front:'District with most forest area?',back:'Dharmapuri.'}
],
q:[
{q:'Which place in Tamil Nadu is famous for being a world-class "Wind Power" hub?',options:['Neyveli','Muppandal','Salem','Ariyalur'],ai:1,exp:'Located in Kanyakumari district.'},
{q:'"Pichavaram" mangroves are located in which district?',options:['Thanjavur','Cuddalore','Nagapattinam','Chennai'],ai:1,exp:'A major eco-tourism and biodiversity spot.'},
{q:'The "Kudankulam Nuclear Power Plant" was built with assistance from:',options:['USA','Russia','France','Japan'],ai:1,exp:'VVER-1000 reactors.'},
{q:'Which district in Tamil Nadu has the highest "Forest Cover" area?',options:['Nilgiris','Dharmapuri','Erode','Coimbatore'],ai:1,exp:'As per recent reports.'}
],
hook:'Wind=Muppandal. Lignite=Neyveli. Pichavaram=Cuddalore. Kudankulam=Russia. Dharmapuri=Forest.',
summary:'Overview of mineral and renewable energy resources in TN. Significance of nuclear power plants in the state. Analysis of forest cover and mangrove ecosystems. Biodiversity hotspots in Tamil Nadu.'},

{day:80,topic:'TNPSC History: Modern India (TN Focus)',
intro:`Today we study the 'Path to Freedom'. This is a recap of modern history with a heavy tilt towards 'Madras Presidency'. In TNPSC, 'Governor-Generals' and 'TN Leaders' roles are high-yield. Do you know who was the CM of Madras when the first ministry was formed? Let's master the history today.`,
notes:[
{title:'British Entry',detail:'Fort St. George (1639 - Francis Day). Madras Presidency formed in 1801.'},
{title:'Social Reforms',detail:'St. Ramalinga Adigal (Vallalar - Samarasa Suddha Sanmarga Sangam). Ayya Vaikundar (Ayyavazhi).'},
{title:'Leaders (Recap)',detail:'Rajaji (Chakravarthi Rajagopalachari - "Mango of Salem"). K. Kamaraj (Kingmaker). Sathyamurti.'},
{title:'Civil Disobedience',detail:'Vedaranyam Salt Satyagraha (1930) - Led by Rajaji. From Trichy to Vedaranyam.'},
{title:'1937 Elections',detail:'Congress won. Rajaji became Premier. Introduced Prohibition and Temple Entry authorization.'}
],
cards:[
{front:'Founder of Madras (1639)?',back:'Francis Day.'},
{front:'Who led Vedaranyam March?',back:'Rajaji (1930).'},
{front:'"Mango of Salem" is?',back:'Rajaji.'},
{front:'Who founded Samarasa Suddha Sanmarga Sangam?',back:'Ramalinga Adigal (Vallalar).'},
{front:'Year of Madras Presidency formation?',back:'1801.'}
],
q:[
{q:'The "Vedaranyam Salt Satyagraha" was led by:',options:['VOC','Bharathi','Rajaji','Kamaraj'],ai:2,exp:'Started from Trichy to Vedaranyam in April 1930.'},
{q:'"Francis Day" is associated with the founding of which city?',options:['Madurai','Chennai','Trichy','Coimbatore'],ai:1,exp:'Established Fort St. George in 1639.'},
{q:'Who was the founder of "Ayyavazhi" movement?',options:['Periyar','Ayya Vaikundar','Vallalar','M.C. Rajah'],ai:1,exp:'A social reform movement in South TN.'},
{q:'"Rajaji" became the Premier of Madras in which year?',options:['1920','1937','1947','1952'],ai:1,exp:'Leading the first Congress ministry.'}
],
hook:'Francis Day=Chennai. Rajaji=Vedaranyam. Vallalar=Sanmargam. 1801=Presidency. 1937=Rajaji.',
summary:'Historical evolution of the Madras Presidency. Contribution of social reformers like Vallalar and Vaikundar. Detailed analysis of the Vedaranyam Salt Satyagraha and its impact.'},

{day:81,topic:'TNPSC History: National Renaissance',
intro:`Today we study the 'Awakening of India'. The 19th-century renaissance movements in India had a deep impact on Tamil Nadu. In TNPSC, 'Brahmo Samaj', 'Arya Samaj', and 'Theosophical Society' are high-yield. Do you know who shifted the Theosophical Society to Madras? Let's master the awakening today.`,
notes:[
{title:'Brahmo Samaj',detail:'Raja Ram Mohan Roy (1828). "Father of Modern India". Sati abolition (1829).'},
{title:'Arya Samaj',detail:'Dayanand Saraswati (1875). "Go back to Vedas". Slogan: "India for Indians".'},
{title:'Theosophical Society',detail:'Founded by Blavatsky and Olcott (USA). Shifted to Adyar, Madras (1882). Popularized by Annie Besant.'},
{title:'Ramakrishna Mission',detail:'Swami Vivekananda (1897). Chicago speech (1893). Service to humanity.'},
{title:'Prarthana Samaj',detail:'Atmaram Pandurang (1867). Social reform in Maharashtra.'}
],
cards:[
{front:'Father of Modern India?',back:'Raja Ram Mohan Roy.'},
{front:'"Go back to Vedas" - Who said?',back:'Dayanand Saraswati.'},
{front:'Theosophical Society headquarters in India?',back:'Adyar (Madras).'},
{front:'Who abolished Sati (1829)?',back:'Lord William Bentinck.'},
{front:'Year of Chicago Speech?',back:'1893.'}
],
q:[
{q:'In which year was "Sati" abolished in India?',options:['1820','1829','1857','1885'],ai:1,exp:'Due to efforts of Raja Ram Mohan Roy.'},
{q:'The "Theosophical Society" was headquartered in:',options:['Bombay','Calcutta','Adyar','Delhi'],ai:2,exp:'Shifted to Madras in 1882.'},
{q:'Who founded the "Arya Samaj"?',options:['Ram Mohan Roy','Vivekananda','Dayanand Saraswati','Keshab Chandra Sen'],ai:2,exp:'Famous for "Satyarth Prakash".'},
{q:'"Swami Vivekananda" participated in the Parliament of Religions at Chicago in:',options:['1885','1893','1900','1897'],ai:1,exp:'A landmark event for Indian spiritualism.'}
],
hook:'Ram Mohan=Sati 1829. Adyar=Theosophical. Dayanand=Vedas. 1893=Chicago. 1897=RK Mission.',
summary:'Major socio-religious reform movements of the 19th century. Role of Raja Ram Mohan Roy and Dayanand Saraswati. Connection of the Theosophical Society to Madras. Impact of Vivekananda\'s teachings.'},

{day:82,topic:'TNPSC General Awareness: Schemes & Awards',
intro:`Today we study the 'Current Pulse'. TNPSC often asks about 'State Awards' and 'Social Schemes'. In TNPSC, 'Kalaimamani', 'Avvaiyar Award', and 'Naan Mudhalvan' are high-yield. Do you know who receives the 'Thiruvalluvar Award'? Let's master the recognition today.`,
notes:[
{title:'State Awards',detail:'1. Thagaisal Thamizhar (Highest state honor). 2. Avvaiyar Award (Women excellence). 3. Kalaimamani (Arts/Culture). 4. Dr. A.P.J. Abdul Kalam Award.'},
{title:'Educational Schemes',detail:'Naan Mudhalvan (Skilling). Puthumai Penn (Monthly ₹1000 for girls in higher ed). Illam Thedi Kalvi.'},
{title:'Health & Social Welfare',detail:'Makkalai Thedi Maruthuvam (Healthcare at doorstep). Innuyir Kaappom (Road accident victims). Chief Minister\'s Breakfast Scheme.'},
{title:'Infrastructure',detail:'Chennai Metro Rail Phase 2. TIDEL Park expansions. Fintech City (Chennai).'},
{title:'Sports',detail:'44th Chess Olympiad (Mahabalipuram - 2022). Chief Minister\'s Trophy.'}
],
cards:[
{front:'"Puthumai Penn" objective?',back:'Monthly aid for girls\' higher education.'},
{front:'"Makkalai Thedi Maruthuvam" is for?',back:'Healthcare at doorstep.'},
{front:'Where was 44th Chess Olympiad?',back:'Mahabalipuram.'},
{front:'Who receives Avvaiyar Award?',back:'Distinguished women.'},
{front:'"Naan Mudhalvan" focus?',back:'Skill development.'}
],
q:[
{q:'The "Puthumai Penn" scheme provides monthly financial assistance of:',options:['₹500','₹1000','₹1500','₹2000'],ai:1,exp:'To girls who studied in govt schools from 6th to 12th.'},
{q:'Where was the "44th Chess Olympiad" held in 2022?',options:['Chennai','Mahabalipuram','Madurai','Coimbatore'],ai:1,exp:'A massive international event hosted by TN.'},
{q:'"Innuyir Kaappom" scheme in Tamil Nadu is related to:',options:['Child health','Road accident victims','Education','Agriculture'],ai:1,exp:'Free treatment in the first 48 hours for accident victims.'},
{q:'Who was the first recipient of the "Thagaisal Thamizhar" award?',options:['M.S. Swaminathan','N. Sankaraiah','R. Nallakannu','Ki. Rajanarayanan'],ai:1,exp:'Veteran communist leader.'}
],
hook:'Puthumai Penn=1000. Makkalai Thedi=Health. 44th Chess=Mahabs. Innuyir=Accident. Thagaisal=High Honor.',
summary:'Overview of prestigious state awards and recent recipients. Analysis of innovative welfare schemes in TN (Health, Education). Significance of international events hosted by the state.'},

{day:83,topic:'TNPSC Static GK: TN Firsts & Records',
intro:`Today we study the 'Superlatives of TN'. From the 'First Governor' to the 'Largest District' and 'Oldest Dam'—Static GK in TNPSC is a mark-grabber. Do you know which dam is the 'Oldest in the World'? Let's master the records today.`,
notes:[
{title:'First in TN',detail:'1st Governor: Lord Macartney. 1st CM: A. Subbarayulu Reddiar. 1st Woman CM: Janaki Ramachandran. 1st Woman Governor: Fathima Beevi.'},
{title:'Geographical Records',detail:'Largest District (Area): Erode (Recap: used to be Villupuram before bifurcation). Most Populous: Chennai. Highest Peak: Doddabetta (Nilgiris).'},
{title:'Cultural & Heritage',detail:'Oldest Dam: Kallanai (Grand Anicut - Karikala Cholan). Largest Temple Tower: Srirangam (Rajagopuram). Longest Corridor: Ramanathaswamy Temple (Rameswaram).'},
{title:'Logistics',detail:'1st Railway line in TN: Royapuram to Arcot (1856). 1st Corporation: Madras (1688 - Oldest in India).'},
{title:'Bifurcations',detail:'Recent districts: Kallakurichi, Tenkasi, Chengalpattu, Ranipet, Tirupattur, Mayiladuthurai (38 districts total).'}
],
cards:[
{front:'Oldest Dam in world?',back:'Kallanai (Grand Anicut).'},
{front:'Highest peak in TN?',back:'Doddabetta.'},
{front:'Oldest Corporation in India?',back:'Madras (1688).'},
{front:'First CM of Madras Presidency?',back:'A. Subbarayulu Reddiar.'},
{front:'Total districts in TN?',back:'38.'}
],
q:[
{q:'Which of the following is the "Oldest Dam" in the world (still in use)?',options:['Mettur','Kallanai','Vaigai','Bhakra Nangal'],ai:1,exp:'Built by Karikala Cholan across river Cauvery.'},
{q:'"Doddabetta" is the highest peak of which mountain range?',options:['Western Ghats','Nilgiris','Eastern Ghats','Annamalai'],ai:1,exp:'Elevation of 2,637 meters.'},
{q:'In which year was the "Madras Corporation" established?',options:['1688','1788','1888','1947'],ai:0,exp:'The oldest municipal body in India.'},
{q:'Who was the first "Woman Governor" of Tamil Nadu?',options:['Sarojini Naidu','Fathima Beevi','Pratibha Patil','Janaki Ramachandran'],ai:1,exp:'Appointed in 1997.'}
],
hook:'Kallanai=Karikalan. 1688=Madras Corp. Doddabetta=Nilgiris. 38=Districts. Fathima Beevi=1st Gov.',
summary:'Compilation of historical and administrative firsts in TN. Geographical superlatives and mountain peaks. Overview of the 38 districts and recent bifurcations. Legacy of ancient Tamil engineering.'},

{day:84,topic:'TNPSC REVISION: General Studies Finale',
intro:`Today we consolidate the 'Whole Picture'. You have mastered Unit 8, Unit 9, Economy, Polity, and Geography. This is the 'GS Marathon'. Today, we drill the facts. If you see 'Pichavaram', you say 'Mangroves'. If you see '1688', you say 'Madras Corp'. Let's lock in the General Studies marks today.`,
notes:[
{title:'Unit 8 & 9 Recap',detail:'Sangam (Literature). Periyar (Social Justice). 69% (Reservation). TNeGA (Digital).'},
{title:'Geography Recap',detail:'NE Monsoon (TN Rain). Muppandal (Wind). Doddabetta (Nilgiris). Kallanai (Oldest Dam).'},
{title:'History Recap',detail:'Francis Day (Chennai). Rajaji (Vedaranyam). 1801 (Presidency). Adyar (Theosophical).'},
{title:'Polity & Economy Recap',detail:'234 (Seats). 1986 (Council Abolished). 280 (FC). 101st (GST).'},
{title:'Current Recap',detail:'Puthumai Penn (Higher Ed). 44th Chess Olympiad. 38 Districts.'}
],
cards:[
{front:'Main rain source for TN?',back:'NE Monsoon.'},
{front:'Who built Kallanai?',back:'Karikala Chola.'},
{front:'TN Assembly seats?',back:'234.'},
{front:'Article for Finance Commission?',back:'Article 280.'},
{front:'Is your GS ready?',back:'YES.'}
],
q:[
{q:'"Puthumai Penn" scheme is for:',options:['Healthcare','Primary education','Higher education for girls','Marriage'],ai:2,exp:'Recap.'},
{q:'Which district has the highest peak "Doddabetta"?',options:['Coimbatore','Nilgiris','Dharmapuri','Theni'],ai:1,exp:'Fact check.'},
{q:'"Article 279A" is related to:',options:['Election','GST Council','UPSC','Finance Commission'],ai:1,exp:'Recap.'},
{q:'The "Justice Party" was renamed as DK in which year?',options:['1916','1925','1944','1949'],ai:2,exp:'Recap.'}
],
hook:'GS complete. Everything connected. History to Digital. Accuracy is key. Victory.',
summary:'Full revision of the TNPSC General Studies syllabus. High-speed drill of years, articles, and places. Comparison of developmental and historical milestones. Final GS ecosystem mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC GS Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'TN GS Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC GS '+d.topic),why:'Consolidating General Studies for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

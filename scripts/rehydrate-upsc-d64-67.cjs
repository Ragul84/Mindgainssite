require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:64,topic:'UPSC Geography: Physical Geography — Himalayas & Plains',
intro:`Today we study the 'Northern Frontiers'. The Himalayas are the youngest fold mountains in the world, playing a crucial role in India's climate and security. We also explore the Indo-Gangetic Plains—the most fertile region on Earth. For UPSC, focus on the 'Geological structure', the 'Trans-Himalayan ranges', and the difference between 'Bhabar, Terai, Bhangar, and Khadar'. This is the physical foundation of our subcontinent.`,
notes:[
{title:'Formation of Himalayas',detail:'Result of the collision between the Indian Plate and the Eurasian Plate. Fold mountains. Still rising. 3 Ranges: Himadri (Greater), Himachal (Lesser), Siwaliks (Outer).'},
{title:'Trans-Himalayas',detail:'Located north of the Great Himalayas. Includes Karakoram (K2), Ladakh, and Zanskar ranges. Important glaciers: Siachen, Baltoro.'},
{title:'Regional Divisions',detail:'Punjab Himalayas (between Indus & Sutlej), Kumaon (Sutlej & Kali), Nepal (Kali & Tista), Assam (Tista & Dihang).'},
{title:'Northern Great Plains',detail:'Formed by alluvial deposits of Indus, Ganga, and Brahmaputra. 1. Bhabar: Pebble-studded, rivers disappear. 2. Terai: Marshy, rivers reappear. 3. Bhangar: Older alluvium, calcareous deposits (Kankar). 4. Khadar: New alluvium, very fertile.'},
{title:'Importance',detail:'Himalayas block cold Siberian winds and cause monsoon rain. Plains provide food security for India.'}
],
cards:[
{front:'Highest peak in the world?',back:'Mount Everest (Nepal/Tibet).'},
{front:'Highest peak in India?',back:'K2 (Godwin Austen) in Karakoram.'},
{front:'What is the "Terai"?',back:'A marshy, forested region at the foot of the Himalayas where rivers reappear.'},
{front:'Difference between Bhangar and Khadar?',back:'Bhangar = Old Alluvium. Khadar = New/Fertile Alluvium.'},
{front:'Youngest range of Himalayas?',back:'Siwaliks.'}
],
q:[
{q:'Arrange the following Himalayan ranges from North to South:\n1. Zanskar\n2. Karakoram\n3. Ladakh\n4. Pir Panjal',options:['2-3-1-4','1-2-3-4','2-1-3-4','4-1-3-2'],ai:0,exp:'Karakoram (Northmost) -> Ladakh -> Zanskar -> Pir Panjal.'},
{q:'Which of the following describes the "Bhabar" region?',options:['Marshy land','New fertile soil','Porous belt of pebbles','Older alluvium'],ai:2,exp:'Bhabar is a narrow belt where streams disappear due to high porosity of pebbles.'},
{q:'The "Indo-Gangetic Plain" is which type of plain?',options:['Structural','Depositional','Erosional','Glacial'],ai:1,exp:'It is formed by the deposition of silt by three major river systems.'},
{q:'"Duns" like Dehradun are found in which range?',options:['Himadri','Himachal','Siwaliks','Trans-Himalayas'],ai:2,exp:'Duns are longitudinal valleys found between the Lesser Himalayas and Siwaliks.'}
],
hook:'Himalayas=Fold mountains. Karakoram=K2. Bhabar=Pebbles. Terai=Marsh. Bhangar=Old. Khadar=New. North-South: K-L-Z-P.',
summary:'Geological formation and classification of the Himalayas. Detailed study of Trans-Himalayan ranges and regional divisions. Characteristics of the Northern Plains (Bhabar to Khadar).'},

{day:65,topic:'UPSC Geography: Plateaus, Islands & Coastal Plains',
intro:`Today we study the 'Ancient Core'. The Peninsular Plateau is the oldest and most stable landmass of India, rich in minerals and history. We also explore the long coastline and the exotic islands of Andaman and Lakshadweep. For UPSC, focus on the 'Western vs Eastern Ghats', the 'Deccan Trap', and the 'Strategic importance of the Islands'. This is the heartland of Indian resources.`,
notes:[
{title:'Peninsular Plateau',detail:'Triangular tableland. Oldest landmass (Gondwanaland part). Divided into Central Highlands (Malwa, Chotanagpur) and Deccan Plateau.'},
{title:'The Deccan Trap',detail:'Volcanic origin (Basaltic lava). Rich in Black Soil (Regur). Found in Maharashtra, Gujarat, MP.'},
{title:'Ghats Comparison',detail:'Western Ghats: Continuous, higher (Anaimudi highest), source of major rivers. Eastern Ghats: Discontinuous, lower, eroded by rivers flowing into Bay of Bengal.'},
{title:'Coastal Plains',detail:'Western: Narrower (Konkan, Kanara, Malabar). Features: Lagoons (Kayals) in Kerala. Eastern: Broader (Northern Circars, Coromandel). Fertile deltas (Ganga, Godavari, Krishna).'},
{title:'The Islands',detail:'Andaman & Nicobar: Volcanic, separated by 10° Channel. Indira Point is the southernmost point. Lakshadweep: Coral origin (Atolls), separated by 9° and 11° channels.'}
],
cards:[
{front:'Highest peak in the Peninsular Plateau?',back:'Anaimudi (2,695m).'},
{front:'What is the "Deccan Trap"?',back:'A large volcanic province in Western India with black soil.'},
{front:'Difference between Western and Eastern Ghats?',back:'Western is continuous/higher; Eastern is discontinuous/lower.'},
{front:'Southernmost point of India?',back:'Indira Point (Great Nicobar).'},
{front:'What separates Andaman from Nicobar?',back:'10 Degree Channel.'}
],
q:[
{q:'The "Malabar Coast" is located in which state?',options:['Gujarat','Maharashtra','Kerala','Tamil Nadu'],ai:2,exp:'The Western coastal plain in Kerala is called the Malabar coast.'},
{q:'"Kayals" (backwaters) are a prominent feature of which coast?',options:['Konkan','Coromandel','Malabar','Northern Circars'],ai:2,exp:'Kerala\'s Malabar coast is famous for its interconnected lagoons and backwaters.'},
{q:'Which plateau is called the "Heart of Industrial India"?',options:['Malwa','Deccan','Chotanagpur','Shillong'],ai:2,exp:'Due to its immense mineral wealth (Coal, Iron).'},
{q:'The "9 Degree Channel" separates:',options:['Andaman and Nicobar','Lakshadweep and Minicoy','India and Sri Lanka','Minicoy and Maldives'],ai:1,exp:'Minicoy is the southernmost island of Lakshadweep.'}
],
hook:'Plateau=Oldest. Anaimudi=Highest. 10 Degree=A&N. 9 Degree=L&M. Malabar=Kerala. Coromandel=TN. Black soil=Deccan Trap.',
summary:'Physiography of the Peninsular Plateau. Comparative analysis of Western and Eastern Ghats. Features of the Coastal Plains and the origin of Indian Islands.'},

{day:66,topic:'UPSC Geography: Indian Drainage System',
intro:`Today we master the 'Vessels of Life'. The drainage system of India is divided into the perennial Himalayan rivers and the seasonal Peninsular rivers. We trace the course of the Ganga, the Indus, and the Brahmaputra, along with the East and West-flowing rivers of the South. For UPSC, focus on the 'Tributaries', 'Drainage patterns' (Dendritic, Trellis), and 'Antecedent rivers'. This is a high-yield area for map-based questions.`,
notes:[
{title:'Himalayan Rivers',detail:'Perennial (snow-fed). Antecedent (older than mountains). 1. Indus (Jhelum, Chenab, Ravi, Beas, Sutlej). 2. Ganga (Yamuna, Son, Gomti, Gandak, Kosi). 3. Brahmaputra (Tsangpo, Dihang, Lohit, Subansiri).'},
{title:'Peninsular Rivers',detail:'Seasonal (rain-fed). Mostly flow West to East (Godavari, Krishna, Cauvery). West-flowing (Narmada, Tapti) flow through rift valleys into Arabian Sea.'},
{title:'The Ganga System',detail:'Largest in India. Formed by Alaknanda and Bhagirathi at Devprayag. Yamuna is the longest tributary. Son is the major right-bank tributary.'},
{title:'Drainage Patterns',detail:'1. Dendritic: Tree-like (Ganga). 2. Trellis: Right-angled tributaries (Narmada). 3. Radial: Flows from center (Amarkantak - Narmada, Son).'},
{title:'Inter-state River Disputes',detail:'Cauvery (TN/KA), Krishna (KA/TS/AP/MH), Mahanadi (CG/OD). Important for current affairs link.'}
],
cards:[
{front:'Where do Alaknanda and Bhagirathi meet?',back:'Devprayag.'},
{front:'Longest river in India?',back:'The Ganga.'},
{front:'Longest peninsular river?',back:'The Godavari (Dakshin Ganga).'},
{front:'Which rivers flow through rift valleys?',back:'Narmada and Tapti.'},
{front:'What is an "Antecedent" river?',back:'A river that existed before the mountain range was uplifted (e.g., Indus, Brahmaputra).'}
],
q:[
{q:'Which of the following is a "Right Bank" tributary of the Ganga?',options:['Gomti','Gandak','Son','Kosi'],ai:2,exp:'Son originates from the Amarkantak plateau and joins Ganga from the south.'},
{q:'The "Indus Water Treaty" (1960) gives India control over which rivers?',options:['Indus, Jhelum, Chenab','Ravi, Beas, Sutlej','Ganga, Yamuna, Son','Narmada, Tapti, Mahi'],ai:1,exp:'India has full rights over the three Eastern rivers.'},
{q:'Which river is known as the "Sorrow of Bihar"?',options:['Ganga','Kosi','Damodar','Mahanadi'],ai:1,exp:'Due to its frequent course changes and devastating floods.'},
{q:'The "Majuli" (largest river island) is located in which river?',options:['Ganga','Indus','Brahmaputra','Godavari'],ai:2,exp:'Located in Assam, it is a unique riverine ecosystem.'}
],
hook:'Devprayag=Ganga start. Godavari=Dakshin Ganga. Narmada/Tapti=West/Rift. Kosi=Bihar sorrow. Indus Treaty=RBS (India).',
summary:'Classification of Indian river systems. Course and tributaries of Ganga, Indus, and Brahmaputra. Comparative study of East vs West flowing rivers. Drainage patterns and river islands.'},

{day:67,topic:'UPSC Geography: Climate of India — The Monsoon',
intro:`Today we study the 'Rhythm of India'. The Indian Monsoon is a complex meteorological phenomenon that dictates the life of millions. We explore the mechanism of the South-West and North-East monsoons, the role of the 'Jet Streams', and the impact of 'El-Nino' and 'La-Nina'. For UPSC, focus on the 'Onset and Retreat', the 'Rainfall distribution', and the 'Koppen classification' of Indian climate. This is the most conceptual part of Geography.`,
notes:[
{title:'Mechanism of Monsoon',detail:'Differential heating of land and sea. ITCZ (Inter-Tropical Convergence Zone) shifts north over the Ganga plains. Role of the Tibetan Plateau (thermal engine) and Jet Streams.'},
{title:'South-West Monsoon (June-Sep)',detail:'Enters via Arabian Sea and Bay of Bengal branches. Provides 75% of India\'s rain. Breaks in monsoon (dry spells) are common.'},
{title:'North-East Monsoon (Oct-Dec)',detail:'Retreating monsoon. Picks up moisture from Bay of Bengal. Provides rain to Tamil Nadu and Andhra coast.'},
{title:'El-Nino & La-Nina',detail:'El-Nino (Warming of Pacific): Usually leads to drought/deficient monsoon in India. La-Nina (Cooling): Usually leads to good/excess rainfall.'},
{title:'Koppen\'s Classification',detail:'Amw (Monsoon with short dry season - West Coast), BShw (Semi-arid - NW India), Cwg (Monsoon type with dry winter - Ganga Plains).'}
],
cards:[
{front:'What is "ITCZ"?',back:'Inter-Tropical Convergence Zone (where trade winds meet).'},
{front:'Which monsoon gives rain to Tamil Nadu in winter?',back:'North-East Monsoon.'},
{front:'What is "El-Nino"?',back:'Periodic warming of surface waters in the Eastern Pacific, affecting monsoon.'},
{front:'What is a "Monsoon Break"?',back:'A period of a few weeks when rain fails during the monsoon season.'},
{front:'Most common climatic type in India (Koppen)?',back:'Cwg (Monsoon type with dry winter).'}
],
q:[
{q:'The "Mango Showers" are common in which states?',options:['Punjab and Haryana','Kerala and Karnataka','Bengal and Odisha','Maharashtra and MP'],ai:1,exp:'Pre-monsoon showers that help in the ripening of mangoes.'},
{q:'Which of the following prevents the entry of cold Siberian winds into India?',options:['Aravalis','Himalayas','Western Ghats','Thar Desert'],ai:1,exp:'The Himalayas act as a massive climatic barrier.'},
{q:'In India, the maximum rainfall is received from:',options:['North-East Monsoon','South-West Monsoon','Western Disturbances','Conventional rain'],ai:1,exp:'SW Monsoon is the primary source of rain for the majority of India.'},
{q:'What is "October Heat"?',options:['Forest fires in October','High temp and humidity during monsoon retreat','Heatwaves in North India','Summer peak'],ai:1,exp:'The period of clear skies and high humidity after the monsoon retreat.'}
],
hook:'SW Monsoon=June-Sep. NE=Oct-Dec (TN rain). El-Nino=Bad rain. ITCZ shift=Monsoon onset. Koppen Cwg=Plains.',
summary:'Thermal and dynamic theories of monsoon. Detailed study of SW and NE monsoon cycles. Impact of global factors (El-Nino, IOD). Koppen\'s climate classification for India.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC Geography Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Geography Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Indian Geography '+d.topic),why:'Mastering the physical and climatic foundation of India.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 64-67 v2 COMPLETE');
}
push();

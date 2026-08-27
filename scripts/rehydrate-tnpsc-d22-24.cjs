require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:22,topic:'TNPSC Geography: India — Physical Features',
intro:`Today we study the 'Anatomy of India'. India is a land of great physical diversity—from the towering Himalayas to the fertile Indo-Gangetic plains and the ancient Peninsular plateau. We explore the 5 major physiographic divisions. For TNPSC, knowing the highest peaks (K2, Kanchenjunga), the divisions of the Himalayas (Himadri, Himachal, Siwaliks), and the importance of the Northern Plains is essential. Let's map our country today.`,
notes:[
{title:'Major Divisions',detail:'1. The Himalayan Mountains. 2. The Northern Great Plains. 3. The Peninsular Plateau. 4. The Coastal Plains. 5. The Islands.'},
{title:'The Himalayas (Northern Mountains)',detail:'Himadri (Greater): Highest, perennial snow. Himachal (Lesser): Famous hill stations. Siwaliks (Outer): Foothills, prone to landslides. Trans-Himalayas (Karakoram): Contains K2 (Godwin Austen), the highest peak in India.'},
{title:'The Northern Great Plains',detail:'Formed by Indus, Ganga, and Brahmaputra. Divisions: Bhabar (pebbles), Terai (marshy), Bhangar (old alluvium), Khadar (new fertile alluvium).'},
{title:'The Peninsular Plateau',detail:'Oldest landmass of India. Divided into Central Highlands and Deccan Plateau. Western Ghats (continuous) and Eastern Ghats (discontinuous). Anaimudi is the highest peak in South India.'},
{title:'The Islands',detail:'Andaman & Nicobar (Volcanic origin, Barren island). Lakshadweep (Coral origin). 10 Degree Channel separates Andaman and Nicobar.'}
],
cards:[
{front:'Highest peak in India?',back:'K2 (Godwin Austen). (Kanchenjunga is highest in Himalaya-India).'},
{front:'Old Alluvium soil is called?',back:'Bhangar.'},
{front:'New fertile alluvium soil is called?',back:'Kadar.'},
{front:'Channel separating Andaman and Nicobar?',back:'10 Degree Channel.'},
{front:'Highest peak in South India?',back:'Anaimudi (2,695m).'}
],
q:[
{q:'இந்தியாவின் மிக உயர்ந்த சிகரம் எது?',options:['எவரெஸ்ட்','கஞ்சன்ஜங்கா','காட்வின் ஆஸ்டின் (K2)','ஆனைமுடி'],ai:2,exp:'K2 (8,611m) is the highest in India. Everest is in Nepal.'},
{q:'புதிய வண்டல் மண் படிவுகள் இவ்வாறு அழைக்கப்படுகின்றன:',options:['பாபர்','தராய்','பாங்கர்','காதர்'],ai:3,exp:'Khadar is the fertile new alluvium found in river floodplains.'},
{q:'அந்தமான் மற்றும் நிக்கோபார் தீவுகளைப் பிரிக்கும் கால்வாய் எது?',options:['8 டிகிரி','9 டிகிரி','10 டிகிரி','மன்னார் வளைகுடா'],ai:2,exp:'10 Degree Channel separates the two island groups.'},
{q:'தென்னிந்தியாவின் மிக உயர்ந்த சிகரம் எது?',options:['தொட்டபெட்டா','ஆனைமுடி','மகேந்திரகிரி','குருசிகார்'],ai:1,exp:'Anaimudi (Kerala) is the highest peak in the Peninsular plateau.'}
],
hook:'K2=Highest India. Himadri=Greater. Khadar=New/Fertile. Bhangar=Old. 10 Degree=Andaman/Nicobar. Anaimudi=Highest South.',
summary:'The 5 major physical divisions of India. Structure and peaks of the Himalayas. Classification of the Northern Plains. Features of the Peninsular plateau and Islands.'},

{day:23,topic:'TNPSC Geography: Indian Rivers & Climate',
intro:`Today we master the 'Hydrology and Weather' of India. We study the contrast between the perennial Himalayan rivers (Ganga, Indus, Brahmaputra) and the seasonal Peninsular rivers (Godavari, Krishna, Cauvery). We also explore the 'Monsoon'—the pulse of India—and why it rains differently in different regions. For TNPSC, knowing the 'West-flowing' rivers (Narmada, Tapti) and the characteristics of the Southwest Monsoon is vital.`,
notes:[
{title:'Himalayan Rivers',detail:'Perennial (flow year-round). 1. Indus (origin: Mansarovar). 2. Ganga (formed by Alaknanda & Bhagirathi). 3. Brahmaputra (Tsangpo in Tibet).'},
{title:'Peninsular Rivers',detail:'Seasonal (rain-fed). East-flowing (into Bay of Bengal): Godavari (Dakshin Ganga - longest in South), Krishna, Cauvery. West-flowing (into Arabian Sea): Narmada, Tapti (flow through rift valleys).'},
{title:'Indian Climate (Monsoon)',detail:'4 Seasons: Winter (Jan-Feb), Summer (March-May), SW Monsoon (June-Sep), NE Monsoon (Oct-Dec). SW Monsoon provides 75% of India\'s rain.'},
{title:'Jet Streams & Western Disturbances',detail:'Jet streams influence the arrival of monsoons. Western Disturbances bring winter rain to North India (beneficial for Wheat).'},
{title:'Climatic Facts',detail:'Mawsynram (Meghalaya) is the wettest place in the world. Thar Desert is the driest. "Mango Showers" (Kerala/Karnataka) help in ripening mangoes.'}
],
cards:[
{front:'Which river is called "Dakshin Ganga"?',back:'Godavari.'},
{front:'Two major West-flowing rivers of India?',back:'Narmada and Tapti.'},
{front:'Where is the wettest place on Earth?',back:'Mawsynram (Meghalaya).'},
{front:'Most rain in India comes from which monsoon?',back:'South-West Monsoon (75%).'},
{front:'Name of Brahmaputra in Tibet?',back:'Tsangpo.'}
],
q:[
{q:'"தெட்சண கங்கை" என அழைக்கப்படும் ஆறு எது?',options:['காவிரி','கிருஷ்ணா','கோதாவரி','நர்மதா'],ai:2,exp:'Godavari is the longest peninsular river and called Dakshin Ganga.'},
{q:'கிழக்கிலிருந்து மேற்கு நோக்கி பாயும் ஆறுகள் எவை?',options:['காவிரி, கிருஷ்ணா','நர்மதை, தபதி','கோதாவரி, மகாநதி','பாலார், பெண்ணையாறு'],ai:1,exp:'Narmada and Tapti flow West into the Arabian sea through rift valleys.'},
{q:'இந்தியாவிற்கு அதிக மழையைத் தரும் பருவக்காற்று எது?',options:['தென்மேற்கு பருவக்காற்று','வடகிழக்கு பருவக்காற்று','கோடைக்கால காற்று','சூறாவளி'],ai:0,exp:'SW Monsoon (June-Sep) is the primary source for most of India.'},
{q:'உலகின் அதிக மழை பெறும் இடம் எது?',options:['சிராபுஞ்சி','மௌசின்ராம்','ஊட்டி','ஆகும்பே'],ai:1,exp:'Mawsynram in Meghalaya holds the world record for rainfall.'}
],
hook:'Godavari=Dakshin Ganga. Narmada/Tapti=West flow. SW Monsoon=75% India rain. Tsangpo=Brahmaputra. Mawsynram=Wettest.',
summary:'Himalayan vs Peninsular river systems. Important tributaries and origin points. The mechanism of Indian Monsoons. Factors affecting India\'s climate.'},

{day:24,topic:'TNPSC Geography: Soils & Natural Vegetation of India',
intro:`Today we study the 'Skin and Greenery' of India. India has 8 major soil types, each supporting a different ecosystem. From the vast Alluvial plains to the Black soil of the Deccan and the Laterite of the hills—the diversity is immense. We also explore the forest types—Evergreen, Deciduous, and the Tidal forests. For TNPSC, knowing which soil is best for which crop (e.g., Black for Cotton) is a high-yield area. Let's explore the earth today.`,
notes:[
{title:'Major Soil Types (ICAR)',detail:'1. Alluvial (40%): Most fertile, Ganga-Brahmaputra plains. 2. Black (Regur): Lava soil, Deccan trap, best for Cotton. 3. Red: Iron rich, common in South. 4. Laterite: Leaching in heavy rain, good for Cashew/Tea.'},
{title:'Natural Vegetation (Forests)',detail:'1. Tropical Evergreen: >200cm rain (Western Ghats, NE India). 2. Tropical Deciduous (Monsoon): 70-200cm, most widespread. 3. Thorny: <50cm (Rajasthan). 4. Tidal/Mangrove: Coastal (Sundarbans).'},
{title:'Wildlife Conservation',detail:'Project Tiger (1973). Project Elephant (1992). Biosphere Reserves (18 in India). First National Park: Jim Corbett (Uttarakhand).'},
{title:'Forest Policy',detail:'India aims for 33% forest cover (Current ~24%). "Sandalwood" is famous in Karnataka/TN forests.'},
{title:'Soil Erosion & Conservation',detail:'Causes: Overgrazing, deforestation. Conservation: Terrace farming, contour ploughing, afforestation.'}
],
cards:[
{front:'Most widespread soil type in India?',back:'Alluvial Soil (40%).'},
{front:'Best soil for Cotton cultivation?',back:'Black Soil (Regur).'},
{front:'Project Tiger was launched in which year?',back:'1973.'},
{front:'First National Park in India?',back:'Jim Corbett NP (Uttarakhand).'},
{front:'Most common forest type in India?',back:'Tropical Deciduous (Monsoon) Forest.'}
],
q:[
{q:'இந்தியாவில் அதிக பரப்பளவில் காணப்படும் மண் வகை எது?',options:['கரிசல் மண்','வண்டல் மண்','செம்மண்','சரளை மண்'],ai:1,exp:'Alluvial soil (40%) is the most widespread and fertile.'},
{q:'"பருத்தி" பயிரிட மிகவும் ஏற்ற மண் எது?',options:['வண்டல் மண்','கரிசல் மண்','செம்மண்','உவர் மண்'],ai:1,exp:'Black soil (Regur) is excellent for cotton.'},
{q:'இந்தியாவில் உள்ள காடுகளில் அதிக பரப்பளவில் காணப்படுவது எது?',options:['பசுமை மாறாக் காடுகள்','இலை உதிர் காடுகள்','சதுப்புநிலக் காடுகள்','ஊசி இலைக் காடுகள்'],ai:1,exp:'Tropical Deciduous (Monsoon) forests are the most widespread.'},
{q:'புலிகள் பாதுகாப்புத் திட்டம் (Project Tiger) தொடங்கப்பட்ட ஆண்டு:',options:['1972','1973','1980','1992'],ai:1,exp:'Launched in 1973 to save the Royal Bengal Tiger.'}
],
hook:'Alluvial=40%. Black=Cotton. Deciduous=Most widespread. Tiger=1973. Corbett=1st NP. Sundarbans=Largest Mangrove.',
summary:'ICAR classification of Indian soils. Distribution and characteristics of major soil types. Forest types and their rainfall requirements. Important wildlife conservation projects.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🎯 TNPSC Geography Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Geography Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Indian Geography '+d.topic),why:'Mastering Indian geography for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('TNPSC Days 22-24 v2 COMPLETE');
}
push();

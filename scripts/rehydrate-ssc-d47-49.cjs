require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:47,topic:'SSC Geography: Physical & Indian Facts',
intro:`Today we study the 'Anatomy of our Land'. Geography in SSC is about 'Superlatives' and 'Locations'. From the highest peak (K2) to the longest river (Ganga) and the layers of the Atmosphere—these are the facts that repeat every year. Do you know which state has the longest coastline? Or what is the 'Great Red Spot'? Let's master the physical facts today.`,
notes:[
{title:'Atmosphere Layers',detail:'Troposphere (Weather), Stratosphere (Ozone/Aviation), Mesosphere (Meteorites burn), Thermosphere/Ionosphere (Radio waves), Exosphere.'},
{title:'Structure of Earth',detail:'Crust (Sial - Silica & Alumina), Mantle (Sima), Core (Nife - Nickel & Iron).'},
{title:'Indian Superlatives',detail:'Highest Peak: K2 (Godwin Austen). Longest River: Ganga. Largest Lake: Wular (Fresh), Chilka (Brackish). Highest Waterfall: Kunchikal (KA). Longest Coastline: Gujarat.'},
{title:'Important Passes',detail:'Zojila (J&K), Shipkila (HP), Nathula (Sikkim), Bomdila (Arunachal), Palakkad Gap (Kerala).'},
{title:'River Facts',detail:'Ganga (Padma in Bangladesh). Brahmaputra (Tsangpo in Tibet). Godavari (Dakshin Ganga). Narmada (West flowing/Rift valley).'}
],
cards:[
{front:'Highest peak in India?',back:'K2 (Godwin Austen).'},
{front:'Longest coastline state?',back:'Gujarat.'},
{front:'Layer containing Ozone?',back:'Stratosphere.'},
{front:'"Dakshin Ganga" is?',back:'Godavari.'},
{front:'Pass connecting Sikkim to China?',back:'Nathula.'}
],
q:[
{q:'Which of the following layers of the atmosphere is best for flying jet aircraft?',options:['Troposphere','Stratosphere','Mesosphere','Thermosphere'],ai:1,exp:'Stratosphere is free from weather disturbances and clouds.'},
{q:'"Sial" (Silica and Alumina) is the main component of:',options:['Crust','Mantle','Outer Core','Inner Core'],ai:0,exp:'The uppermost layer of the earth\'s surface.'},
{q:'Which Indian state has the longest coastline?',options:['Tamil Nadu','Maharashtra','Gujarat','Andhra Pradesh'],ai:2,exp:'Gujarat has a coastline of ~1600 km.'},
{q:'The river Brahmaputra is known as _____ in Tibet.',options:['Padma','Dihang','Tsangpo','Jamuna'],ai:2,exp:'It enters India in Arunachal Pradesh where it is called Dihang.'}
],
hook:'Stratosphere=Ozone. K2=Highest India. Gujarat=Coastline. Sial=Crust. Nife=Core. Nathula=Sikkim.',
summary:'Classification of atmospheric and interior layers of Earth. High-speed drill of Indian geographical superlatives. Map-based facts of rivers and mountain passes.'},

{day:48,topic:'SSC Geography: World & Static Facts',
intro:`Today we study the 'Global Landscape'. From the planets in our solar system to the continents and oceans—world geography in SSC is purely factual. We explore 'Highest peaks of continents', 'International boundaries', and 'Solar system records'. Do you know which planet is called 'Morning Star'? Or what is the 'McMahon Line'? Let's master the world facts today.`,
notes:[
{title:'Solar System Records',detail:'Largest: Jupiter. Smallest: Mercury. Brightest/Hottest/Morning Star: Venus. Red Planet: Mars. Blue Planet: Earth. Farthest: Neptune.'},
{title:'Continental Peaks',detail:'Asia (Everest), Africa (Kilimanjaro), N. America (Denali), S. America (Aconcagua), Europe (Elbrus), Antarctica (Vinson).'},
{title:'International Boundaries',detail:'Radcliffe (India-Pak), McMahon (India-China), Durand (Pak-Afghan/India-Afghan), 49th Parallel (USA-Canada), 38th Parallel (N.Korea-S.Korea).'},
{title:'Oceans & Seas',detail:'Largest/Deepest: Pacific (Mariana Trench). S-shaped: Atlantic. Smallest: Arctic. Dead Sea: Highest salinity.'},
{title:'Grasslands',detail:'Steppes (Eurasia), Prairies (USA), Pampas (Argentina), Veld (S.Africa), Downs (Australia), Savanna (Africa).'}
],
cards:[
{front:'Morning/Evening Star?',back:'Venus.'},
{front:'Deepest point in the world?',back:'Mariana Trench (Pacific).'},
{front:'McMahon Line is between?',back:'India and China.'},
{front:'Highest peak in Africa?',back:'Mt. Kilimanjaro.'},
{front:'Grasslands in North America?',back:'Prairies.'}
],
q:[
{q:'Which planet is known as the "Red Planet"?',options:['Venus','Mars','Jupiter','Saturn'],ai:1,exp:'Due to the presence of iron oxide on its surface.'},
{q:'The "Radcliffe Line" is the international boundary between:',options:['India and China','India and Pakistan','India and Nepal','India and Bangladesh'],ai:1,exp:'Drawn in 1947 by Cyril Radcliffe.'},
{q:'Which is the largest and deepest ocean in the world?',options:['Atlantic','Indian','Pacific','Arctic'],ai:2,exp:'Covers 1/3rd of the Earth\'s surface.'},
{q:'"Prairies" are the temperate grasslands found in:',options:['South Africa','Australia','North America','South America'],ai:2,exp:'They are major wheat-producing regions.'}
],
hook:'Venus=Hottest. Mars=Red. Pacific=Mariana. 49th Parallel=USA-Canada. Steppes=Eurasia. Kilimanjaro=Africa.',
summary:'Key facts about the Solar System. Comparison of continental peaks and grasslands. List of major international boundaries and oceanographic records.'},

{day:49,topic:'SSC REVISION: History & Geography (Days 43–48)',
intro:`Today we consolidate the 'Core GK' block. You have mastered the Ancient, Medieval, and Modern facts of India, along with the physical and world geography. In SSC, GK is the 'Time Saver'. If you know the fact, it takes 2 seconds. Today, we drill the years, the kings, and the locations. If you see '1526', you say 'Panipat'. If you see 'Nathula', you say 'Sikkim'. Let's lock in the GK marks today.`,
notes:[
{title:'History Timeline Recap',detail:'IVC (Lothal). Buddha (Sarnath). Panipat 1 (1526). Akbar (Sikri). 1857 (Canning). INC (1885). Dandi (1930). Quit India (1942).'},
{title:'Geography Superlatives Recap',detail:'Atmosphere (Strato=Ozone). Crust (Sial). K2 (Highest India). Gujarat (Coast). Venus (Morning Star). Mariana (Deepest).'},
{title:'Boundary & Peak Recap',detail:'Radcliffe (Pak), McMahon (China), Durand (Afghan). Everest (Asia), Kilimanjaro (Africa), Denali (N.America).'},
{title:'River & Grassland Recap',detail:'Ganga (Padma). Brahmaputra (Tsangpo). Prairies (USA), Steppes (Eurasia), Downs (Australia).'},
{title:'Mughal & Sultanate Recap',detail:'Aibak (Slave). Khilji (Market). Akbar (Jizya). Aurangzeb (Zinda Pir).'}
],
cards:[
{front:'Year of Quit India?',back:'1942.'},
{front:'Pass in Sikkim?',back:'Nathula.'},
{front:'Hottest planet?',back:'Venus.'},
{front:'Who built Buland Darwaza?',back:'Akbar.'},
{front:'"Sorrow of Bihar" river?',back:'Kosi.'}
],
q:[
{q:'The first session of INC was held in:',options:['Calcutta','Bombay','Madras','Allahabad'],ai:1,exp:'Held in 1885 at Gokuldas Tejpal Sanskrit College.'},
{q:'Which layer of atmosphere contains the "Ozone Layer"?',options:['Troposphere','Stratosphere','Mesosphere','Thermosphere'],ai:1,exp:'Geography staple.'},
{q:'The "Battle of Panipat 2nd" was fought between Akbar and:',options:['Ibrahim Lodi','Hemmu','Maharana Pratap','Sher Shah'],ai:1,exp:'Fought in 1556.'},
{q:'"Downs" are the grasslands of:',options:['USA','South Africa','Australia','Eurasia'],ai:2,exp:'Found in the temperate regions of Australia.'}
],
hook:'1526=Panipat 1. 1885=INC. K2=Highest India. Venus=Morning Star. Stratosphere=Ozone. 1942=Quit India.',
summary:'Full revision of History and Geography facts. High-speed drill of years, rulers, and locations. Comparison of world and Indian records. Final GK Part 1 mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC GK Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'GK Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL Geography '+d.topic),why:'Mastering GK facts for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

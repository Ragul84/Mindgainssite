require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:68,topic:'UPSC Geography: Soils, Vegetation & Wildlife',
intro:`Today we study the 'Green and Brown Layers' of India. India's diverse geography supports a wide range of soil types and forest ecosystems. We explore the ICAR classification of soils and the various forest types from Tropical Evergreen to Himalayan Alpine. For UPSC, focus on 'Soil Salinity', 'Endemic Species', and 'Project Tiger/Elephant' locations. This is the ecological heart of the geography syllabus.`,
notes:[
{title:'Indian Soils (ICAR)',detail:'1. Alluvial (40%): Most widespread. 2. Black (Regur): Lava soil, Cotton. 3. Red: Iron rich. 4. Laterite: Leaching, Cashew. 5. Arid: Saline, NW India.'},
{title:'Soil Health Card Scheme',detail:'Current Affairs link. Focus on N-P-K balance (4:2:1) and soil micro-nutrients.'},
{title:'Natural Vegetation',detail:'1. Tropical Evergreen: >250cm rain (WG, NE India). 2. Tropical Deciduous (Monsoon): Most common, 70-200cm rain (Teak, Sal). 3. Tropical Thorn: <50cm (Rajasthan). 4. Montane: Himalayan (Pine, Oak). 5. Mangroves: Sundarbans, Pichavaram.'},
{title:'Biosphere Reserves (18 in India)',detail:'Part of MAB program. First: Nilgiris. Panna, Cold Desert, Agasthyamalai. 12 are under UNESCO World Network.'},
{title:'Wildlife Protection',detail:'Project Tiger (1973), Project Elephant (1992), Project Snow Leopard. Critical Tiger Habitats. Wildlife Protection Act 1972.'}
],
cards:[
{front:'Most common forest type in India?',back:'Tropical Deciduous (Monsoon) Forest.'},
{front:'Regur soil is also called?',back:'Black Soil.'},
{front:'Where are Sundari trees found?',back:'Mangrove/Tidal forests (Sundarbans).'},
{front:'India\'s 1st Biosphere Reserve?',back:'Nilgiris (1986).'},
{front:'Soil best for Tea/Coffee?',back:'Laterite Soil.'}
],
q:[
{q:'"Black Soil" is best suited for which crop?',options:['Paddy','Wheat','Cotton','Sugarcane'],ai:2,exp:'Its high water retention and mineral content make it ideal for cotton.'},
{q:'Which of the following describes "Laterite Soil"?',options:['Formed by lava','Formed by leaching in heavy rain','Wind-blown soil','Found in deltas'],ai:1,exp:'Leaching of silica and lime leads to high iron and aluminum content.'},
{q:'The "Silent Valley National Park" is famous for:',options:['Bengal Tiger','Lion-Tailed Macaque','Snow Leopard','One-horned Rhino'],ai:1,exp:'It is a biodiversity hotspot in Kerala.'},
{q:'What is the correct N-P-K ratio for Indian soils?',options:['1:2:4','4:2:1','2:2:2','1:1:1'],ai:1,exp:'Nitrogen, Phosphorus, and Potassium balance is crucial for productivity.'}
],
hook:'Alluvial=Most widespread. Black=Cotton. Deciduous=Monsoon forest. 1973=Tiger. Nilgiris=1st Biosphere. Laterite=Leaching.',
summary:'ICAR soil classification. Comparative forest types in India. Distribution of National Parks and Biosphere Reserves. Wildlife conservation efforts and laws.'},

{day:69,topic:'UPSC Geography: Agriculture, Minerals & Energy',
intro:`Today we study the 'Resources of the Nation'. India is a land of massive agricultural output and significant mineral wealth. We explore the 'Kharif, Rabi, and Zaid' seasons, the 'Green Revolution', and the mineral-rich belts like Chotanagpur. For UPSC, focus on 'Renewable Energy targets', 'Strategic Minerals', and 'Crop-wise leading states'. This is the economic base of our geography.`,
notes:[
{title:'Indian Agriculture',detail:'Kharif (June-Oct): Rice, Maize. Rabi (Oct-March): Wheat, Mustard. Zaid (April-June): Watermelon. Green Revolution: HYV seeds, Punjab/Haryana focus.'},
{title:'Mineral Belts',detail:'1. NE Plateau (Chotanagpur): Coal, Iron, Mica. 2. SW Plateau (KA/TN): Iron, Gold, Bauxite. 3. NW (Rajasthan): Copper, Zinc, Petroleum.'},
{title:'Energy Resources',detail:'Conventional: Coal (70%), Petroleum (Mumbai High, Digboi). Non-conventional: Solar (ISA HQ in India), Wind (TN leader), Nuclear (Kudankulam, Tarapur).'},
{title:'Major Infrastructure',detail:'Golden Quadrilateral (Metros). Inland Waterways (NW-1 Ganga). Sagarmala (Ports). PM Gati Shakti.'},
{title:'Strategic Minerals',detail:'Lithium (discovered in J&K), Rare Earth Elements (REE). Critical for future electronics and EVs.'}
],
cards:[
{front:'Lead producer of Wheat?',back:'Uttar Pradesh.'},
{front:'"Golden Fiber" of India?',back:'Jute.'},
{front:'HQ of International Solar Alliance?',back:'Gurugram (India).'},
{front:'Largest Coal field in India?',back:'Jharia (Jharkhand).'},
{front:'1st Nuclear Power plant in India?',back:'Tarapur (Maharashtra).'}
],
q:[
{q:'Which state is the largest producer of Coffee in India?',options:['Tamil Nadu','Kerala','Karnataka','Andhra Pradesh'],ai:2,exp:'Karnataka accounts for over 70% of India\'s coffee.'},
{q:'"Jharia" and "Raniganj" are famous for:',options:['Iron Ore','Coal','Gold','Bauxite'],ai:1,exp:'They are the most important coal mining centers in the Damodar valley.'},
{q:'Which of the following is a "Kharif" crop?',options:['Wheat','Gram','Paddy','Mustard'],ai:2,exp:'Paddy (Rice) is the primary monsoon crop.'},
{q:'The "International Solar Alliance" (ISA) was launched at:',options:['Paris (COP21)','Delhi','New York','Glasgow'],ai:0,exp:'Launched jointly by India and France in 2015.'}
],
hook:'Rice=WB/Kharif. Wheat=UP/Rabi. Jharia=Coal. Jamshedpur=Steel. Bengaluru=Silicon Valley. ISA=Gurugram. Jute=WB.',
summary:'Analysis of Indian cropping patterns and lead states. Mineral distribution and the "Ruhr of India". Energy transition towards renewables. Major transport and trade infrastructure.'},

{day:70,topic:'UPSC REVISION: Geography of India (Days 64–69)',
intro:`Today we wrap up 'Indian Geography'. You have analyzed the anatomy of our land—from the Himalayan peaks to the river deltas and the industrial heartlands. Geography is the 'Stage' on which the history and economy of India are played. Today, we consolidate the maps and the data. Can you locate the major Tiger reserves? Do you remember the Koppen codes? Let's master the spatial logic of India today.`,
notes:[
{title:'Physical Recap',detail:'Himalayas (K-L-Z-P). Plains (Bhabar to Khadar). Plateau (Western/Eastern Ghats). Islands (10°/9° Channels).'},
{title:'Drainage & Climate Recap',detail:'Rivers: Ganga/Indus (Antecedent), Narmada (Rift). Climate: SW Monsoon (75%), ITCZ shift, El-Nino impact.'},
{title:'Resources Recap',detail:'Soil: Alluvial (40%), Black (Cotton). Forest: Deciduous (most widespread). Energy: Coal (Jharia), Solar (Gurugram).'},
{title:'Strategic Mapping',detail:'National Parks: Jim Corbett (1st), Kaziranga (Rhino). Minerals: Chotanagpur (NE Belt). Industrial: Mumbai-Pune, Chennai-Bengaluru.'},
{title:'Master Codes',detail:'Koppen: Cwg (Plains), Amw (West Coast). N-P-K: 4:2:1. Forest target: 33%.'}
],
cards:[
{front:'Highest peak in South India?',back:'Anaimudi.'},
{front:'"Dakshin Ganga" is?',back:'Godavari.'},
{front:'Where is the Indira Point?',back:'Great Nicobar Island.'},
{front:'Which soil is "Self-ploughing"?',back:'Black Soil (due to cracks when dry).'},
{front:'First Tiger Reserve in India?',back:'Jim Corbett.'}
],
q:[
{q:'Arrange from North to South:\n1. Narmada\n2. Tapti\n3. Vindhyas\n4. Satpuras',options:['3-1-4-2','1-3-2-4','3-4-1-2','1-2-3-4'],ai:0,exp:'Vindhyas -> Narmada -> Satpuras -> Tapti.'},
{q:'Which river forms the "Dhuan Dhar" falls?',options:['Narmada','Tapti','Krishna','Godavari'],ai:0,exp:'Located at Bhedaghat near Jabalpur on the Narmada river.'},
{q:'The "National Waterway 1" (NW-1) connects:',options:['Sadiya and Dhubri','Haldia and Prayagraj','Kollam and Kottapuram','Kakinada and Puducherry'],ai:1,exp:'It is on the Ganga-Bhagirathi-Hooghly river system.'},
{q:'Which of the following is the southernmost point of mainland India?',options:['Indira Point','Kanyakumari','Dhanushkodi','Port Blair'],ai:1,exp:'Indira Point is the southernmost of the union; Kanyakumari is the mainland tip.'}
],
hook:'V-N-S-T sequence. Narmada=Dhuan Dhar. NW-1=Ganga. Black soil=Self-ploughing. 10 Degree=A&N. Koppen Cwg=Plains.',
summary:'Full revision of Indian Geography syllabus. Map-based drill for rivers, peaks, and parks. Consolidation of climatic and resource data. Final Geography mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC Geography Finale Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC Indian Geography: Full Recap',url:'https://youtube.com/results?search_query=UPSC+Indian+Geography+Full+Revision',why:'Complete mastery of national geography for Prelims.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | GEOGRAPHY FINALE',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

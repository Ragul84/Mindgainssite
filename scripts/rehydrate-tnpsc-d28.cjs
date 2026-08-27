require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:28,topic:'TNPSC REVISION: Geography of India (Days 22–27)',
intro:`You have finished the core Indian Geography block. From the 'Anatomy of the Himalayas' to the 'Economic Engines' of our cities—you now have a macroscopic view of India. In TNPSC, Indian Geography is vital for understanding the national context of state development. Today, we consolidate the facts. Can you link K2 to Karakoram? Black soil to Cotton? Digboi to Oil? Let's lock in the geography marks today.`,
notes:[
{title:'Physical & Rivers Recap',detail:'Highest Peak: K2 (India), Anaimudi (South). Khadar: New alluvium. 10 Degree Channel: Andaman/Nicobar. Perennial: Himalayan (Ganga/Indus). West-flowing: Narmada/Tapti.'},
{title:'Climate & Soil Recap',detail:'SW Monsoon: 75% rain. Wettest: Mawsynram. Alluvial: 40% (most widespread). Black: Regur (Cotton). Laterite: Leaching/Cashew.'},
{title:'Agriculture & Resources Recap',detail:'Green Rev: Swaminathan. Wheat: UP. Rice: WB. Lignite: Neyveli (TN). Coal: Jharia (JH). Ruhr of India: Chotanagpur. Mica: Andhra.'},
{title:'Industries & Trade Recap',detail:'TISCO: 1907. Cottonopolis: Mumbai. Silicon Valley: Bengaluru. Detroit of Asia: Chennai. Golden Quad: 4 Metros.'},
{title:'Nickname Master Table',detail:'Bengaluru: IT Capital/Electronic City. Mumbai: Gateway of India/Cottonopolis. Kolkata: City of Palaces. Jamshedpur: Steel City.'}
],
cards:[
{front:'"Dakshin Ganga" is?',back:'Godavari.'},
{front:'State leading in Coffee?',back:'Karnataka.'},
{front:'First National Park in India?',back:'Jim Corbett.'},
{front:'River Brahmaputra in Tibet?',back:'Tsangpo.'},
{front:'Golden Fiber?',back:'Jute.'}
],
q:[
{q:'இந்தியாவின் மிக பழமையான நிலப்பகுதி எது?',options:['இமயமலை','வடபெரும் சமவெளி','தீபகற்ப பீடபூமி','தீவுக்கூட்டங்கள்'],ai:2,exp:'The Peninsular Plateau is part of the ancient Gondwana landmass.'},
{q:'"தென்மேற்கு பருவக்காற்று" காலம் எது?',options:['ஜனவரி - பிப்ரவரி','மார்ச் - மே','ஜூன் - செப்டம்பர்','அக்டோபர் - டிசம்பர்'],ai:2,exp:'SW Monsoon is June to September.'},
{q:'கரிசல் மண் உருவாவதற்கு காரணமான பாறைகள்:',options:['படிவுப் பாறைகள்','தீப்பாறைகள் (Lava)','உருமாறிய பாறைகள்','சுண்ணாம்புப் பாறைகள்'],ai:1,exp:'Black soil is formed from the weathering of igneous (volcanic) rocks.'},
{q:'வெள்ளைப்புரட்சியின் தந்தை என்று அழைக்கப்படுபவர்:',options:['எம்.எஸ். சுவாமிநாதன்','வர்கீஸ் குரியன்','நார்மன் போர்லாக்','அம்ரிதா படேல்'],ai:1,exp:'Verghese Kurien led the milk revolution (Amul).'},
{q:'"இந்தியாவின் டெட்ராய்ட்" எது?',options:['பெங்களூரு','சென்னை','மும்பை','ஹைதராபாத்'],ai:1,exp:'Chennai is the automobile hub.'}
],
hook:'K2=Highest India. Godavari=Dakshin Ganga. SW Monsoon=75% rain. Alluvial=40%. WB=Rice/Jute. Bengaluru=IT. Chennai=Auto.',
summary:'Full revision of Indian Geography. Consolidation of physical features, rivers, climate, agriculture, and industries. Master table of national nicknames and resource hubs.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🎯 TNPSC Geography Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC Indian Geography: Full Block Revision',url:'https://youtube.com/results?search_query=TNPSC+Indian+Geography+Full+Revision',why:'Complete mastery of national geography before moving to Polity/Economy.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:21,topic:'TNPSC REVISION: Geography of Tamil Nadu (Days 15–20)',
intro:`You have finished the core Geography block of Tamil Nadu. From the '8-point physical map' to the industrial clusters and the green lungs of the Ghats—you now have a 360-degree view of your state. In TNPSC, Geography is highly linked to 'Unit 9' (Administration & Development). Today, we consolidate the facts. Can you link Neyveli to Lignite? Thanjavur to Samba? Chennai to Detroit? Let's lock in the geography marks today.`,
notes:[
{title:'Physical & Water Recap',detail:'Highest Peak: Doddabetta. Coast: 1076km. River Cauvery: Hogenakkal entry. Perennial: Thamirabarani. Dam: Mettur (Stanley).'},
{title:'Climate & Soil Recap',detail:'Rain: NE Monsoon (Oct-Dec). Soil: Red (66%), Black (Cotton), Alluvial (Delta). TN is in the rain shadow of Western Ghats for SW monsoon.'},
{title:'Agriculture & Industry Recap',detail:'Granary: Thanjavur. Rubber: Kanyakumari. Tea: Nilgiris. Lignite: Neyveli. Manchester: Coimbatore. Detroit of Asia: Chennai. Leather: Vellore.'},
{title:'Forests & Wildlife Recap',detail:'State Animal: Nilgiri Tahr. Mangroves: Pichavaram. 1st Biosphere: Nilgiris. Oldest Bird Sanc: Vedanthangal.'},
{title:'Nicknames Master Table',detail:'Sivakasi: Little Japan/Fireworks. Trichy: Rockfort City. Salem: Mango City/Steel City. Madurai: Temple City. Tuticorin: Pearl City.'}
],
cards:[
{front:'District known as "Little Japan"?',back:'Sivakasi.'},
{front:'Only perennial river in TN?',back:'Thamirabarani.'},
{front:'Main monsoon for TN?',back:'North-East Monsoon.'},
{front:'State Animal of TN?',back:'Nilgiri Tahr.'},
{front:'Where is the Stanely Reservoir?',back:'Mettur (Cauvery).'}
],
q:[
{q:'தமிழ்நாட்டின் நெற்களஞ்சியம் என அழைக்கப்படும் மாவட்டம் எது?',options:['திருவாரூர்','தஞ்சாவூர்','மதுரை','திருநெல்வேலி'],ai:1,exp:'Thanjavur is the primary rice producing district.'},
{q:'"தென்னிந்தியாவின் மான்செஸ்டர்" என்று அழைக்கப்படுவது எது?',options:['ஈரோடு','சென்னை','கோயம்புத்தூர்','திருப்பூர்'],ai:2,exp:'Coimbatore is the textile capital.'},
{q:'தமிழகத்தின் மிகப்பழமையான அணை எது?',options:['மேட்டூர் அணை','கல்லணை','பவானிசாகர் அணை','வைகை அணை'],ai:1,exp:'Kallanai (Grand Anicut) built by Karikala Chola is one of the world\'s oldest.'},
{q:'செம்மண் தமிழகத்தில் எத்தனை விழுக்காடு காணப்படுகிறது?',options:['30%','50%','66%','80%'],ai:2,exp:'Red soil (66% or 2/3rd) is the most common soil in TN.'},
{q:'பிச்சாவரம் சதுப்புநிலக்காடு எந்த மாவட்டத்தில் உள்ளது?',options:['திருவாரூர்','நாகப்பட்டினம்','கடலூர்','காஞ்சிபுரம்'],ai:2,exp:'Pichavaram is in Cuddalore district.'}
],
hook:'Doddabetta=2637m. Thamirabarani=Perennial. NE Monsoon=Rain. Red soil=66%. Thanjavur=Paddy. Chennai=Auto. Nilgiris=1st Biosphere.',
summary:'Full revision of TN Geography. Consolidation of physical features, rivers, climate, agriculture, industries, and forests. Master table of district nicknames and leading products.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🎯 TNPSC Geography Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC Geography: Full Block Revision',url:'https://youtube.com/results?search_query=TNPSC+Geography+of+Tamil+Nadu+Full+Revision',why:'Complete mastery of TN geography before moving to Indian Geography/Admin.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:7,topic:'TNPSC REVISION: Tamil Grammar & Sangam Era (Days 1–6)',
intro:`Today is your first Tamil Revision Day. In TNPSC, General Tamil is the make-or-break subject. If you aren't 100% sure about the Maathirai of a letter or the marker of the 4th case, you are leaving marks on the table. Today, we consolidate everything from 'Letters' to 'Sangam Landscapes'. We don't read new things; we drill the tables until you can recite the 8 cases and 5 thinais in your sleep. Let's lock in the first 10 marks of your Tamil section today.`,
notes:[
{title:'Tamil Letters & Maathirai (Recap)',detail:'Kuril: 1 | Nedil: 2 | Mey/Ayutham: 0.5. Total letters: 247. Mudal Eluthu: 30. Sarbu Eluthu: 10 types.'},
{title:'Vetrumai (Case) Sequence',detail:'2-ஐ, 3-ஆல், 4-கு, 5-இன், 6-அது, 7-கண். Cases 1 & 8 have no markers. Case 8 is for calling (Vili).'},
{title:'Word & Sentence Types',detail:'Words: Peyar, Vinai, Idai, Uri. Sentences: Seivinai (Active), Seyappaduvinai (Passive-பட்டது), Thanvinai (Self), Piravinai (Caused).'},
{title:'Sangam Thinai Table',detail:'Kurinji (Mountain)-Murugan | Mullai (Forest)-Thirumal | Marutham (Fields)-Indran | Neithal (Sea)-Varunan | Paalai (Desert)-Kotravai.'},
{title:'Sangam Literatures',detail:'Major 18 (Melkanakku) = Ettuthokai (8) + Pattuppattu (10). Minor 18 (Keelkanakku) = Includes Thirukkural, Naaladiyar.'}
],
cards:[
{front:'What is the Maathirai for a long vowel (Nedil)?',back:'2 Maathirai.'},
{front:'Marker for the 5th case?',back:'இன், இல்.'},
{front:'Which "Ani" uses the word "போல"?',back:'உவமையணி (Uvamai Ani).'},
{front:'Symbol of the Cheras?',back:'Bow and Arrow (வில் அம்பு).'},
{front:'How to identify Piravinai (Caused action)?',back:'Look for suffixes like "வித்தான்" or "பித்தான்" (e.g., செய்வித்தான்).'}
],
q:[
{q:'"ஐ, ஆல், கு, இன், அது, கண்" - இதில் நான்காம் வேற்றுமை உருபு எது?',options:['ஐ','ஆல்','கு','இன்'],ai:2,exp:'2nd-ஐ, 3rd-ஆல், 4th-கு.'},
{q:'சங்க காலத் தினைப் பகுப்பில் "வயலும் வயல் சார்ந்த இடமும்" எது?',options:['குறிஞ்சி','முல்லை','மருதம்','நெய்தல்'],ai:2,exp:'Marutham is the agricultural land.'},
{q:'"பட்டது" என்ற சொல் வாக்கியத்தில் வந்தால் அது?',options:['செய்வினை','செயப்பாட்டுவினை','தன்வினை','பிறவினை'],ai:1,exp:'Passive voice (Seyappaduvinai).'},
{q:'சங்க காலத்தில் மதுரைத் தமிழ்ச் சங்கத்தின் தலைவராக இருந்தவர் யார்? (சிறு குறிப்பு)',options:['அகத்தியர்','நக்கீரர்','இளங்கோ','கபிலர்'],ai:1,exp:'Nakkirar was associated with the Kadai Sangam in Madurai.'}
],
hook:'2-ஐ, 3-ஆல், 4-கு. Active=Seivinai. Passive=பட்டது. Chola=Tiger. Pandya=Fish. Kurinji=Murugan. Marutham=Indran.',
summary:'Full revision of TNPSC General Tamil foundation. Grammar of letters, words, and cases. Recap of Sangam era geography and literature. Cumulative grammar drill.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🎯 TNPSC Revision Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC Tamil Grammar Revision',url:'https://youtube.com/results?search_query=TNPSC+Tamil+Grammar+Full+Revision',why:'Consolidating foundational grammar.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:28,topic:'UPSC REVISION: Ancient India Finale & Map Drill',
intro:`Today we wrap up the 'Ancient' chapter of our journey. You have seen India evolve from the drainage systems of Mohenjo-daro to the philosophical heights of Buddhism, the statecraft of Chanakya, and the artistic splendor of the Guptas and Pallavas. Today is about 'Mental Mapping'. Can you visualize where Dholavira is? Do you remember which king built the Shore Temple? Ancient History in UPSC is heavily linked to 'Art & Culture'. Today, we consolidate the facts to ensure your foundation is unshakeable before we move to Medieval India.`,
notes:[
{title:'Ancient India Timeline Recap',detail:'2500-1750 BCE: IVC. 1500-1000 BCE: Early Vedic. 1000-600 BCE: Late Vedic. 600 BCE: Mahajanapadas & Heterodox sects. 322-185 BCE: Mauryas. 200 BCE-300 AD: Post-Mauryan (Kushanas, Satavahanas). 319-550 AD: Guptas. 600-800 AD: Pallavas, Chalukyas.'},
{title:'Master Site Drill (Map Memory)',detail:'Lothal/Dholavira: Gujarat (Maritime/Water). Sarnath: UP (1st Sermon). Rajgir/Pataliputra: Bihar (Capitals). Mahabalipuram: TN (Shore temples). Badami/Pattadakal: KA (Chalukyas). Ellora: MH (Rashtrakutas).'},
{title:'Religious Comparison Table',detail:'Buddhism: Middle Path, Nirvana, Anatta (No soul). Jainism: Extreme penance, Triratna, Anekantavada. Hinduism: Bhakti, Varna system, Temple architecture evolution.'},
{title:'Art & Architecture Anchors',detail:'Mauryan: Monolithic pillars. Gandhara: Greek Buddha. Mathura: Red sandstone. Gupta: Nagara temples begin. Pallava: Dravidian Rathas. Rashtrakuta: Monolithic Kailasa temple.'},
{title:'Important Travelers',detail:'Megasthenes (Mauryas - Greek). Fa-Hien (Guptas - Chinese). Hiuen Tsang (Harsha - Chinese).'}
],
cards:[
{front:'IVC site famous for water harvesting?',back:'Dholavira.'},
{front:'Which edict mentions the Kalinga War?',back:'Major Rock Edict XIII.'},
{front:'Who deciphered Brahmi script?',back:'James Prinsep (1837).'},
{front:'Which school of art used white marble?',back:'Amravati School.'},
{front:'Who built the temple at Ellora?',back:'Krishna I (Rashtrakuta).'}
],
q:[
{q:'Which of the following sites is NOT associated with Buddhism?',options:['Sarnath','Lumbini','Kushinagar','Khajuraho'],ai:3,exp:'Khajuraho is famous for Hindu and Jain temples (Chandelas).'},
{q:'"Satyameva Jayate" in the National Emblem is taken from which Upanishad?',options:['Chandogya','Mundaka','Katha','Brihadaranyaka'],ai:1,exp:'It is taken from the Mundaka Upanishad.'},
{q:'The "Indika" of Megasthenes describes which of the following?',options:['Gupta administration','Mauryan society and city of Pataliputra','Vedic rituals','South Indian trade'],ai:1,exp:'Megasthenes was a Greek ambassador in the court of Chandragupta Maurya.'},
{q:'Who was the court poet of Pulakeshin II who wrote the Aihole Inscription?',options:['Harisena','Ravikirti','Banabhatta','Kalidasa'],ai:1,exp:'Ravikirti wrote the Aihole prashasti praising Pulakeshin II.'},
{q:'The first evidence of "Sati" is found in which inscription?',options:['Prayag Prashasti','Mehrauli Pillar','Eran Inscription','Bhitari Pillar'],ai:2,exp:'The Eran inscription of 510 AD (Bhanugupta\'s reign) is the first epigraphic evidence of Sati.'}
],
hook:'Lothal=Dockyard. MRE XIII=Kalinga. 4th Council=Kanishka. Samudragupta=Napoleon. Ellora=Rashtrakuta. 31 AD + AD = Valluvar Year.',
summary:'Full revision of Ancient Indian History. Chronological recap of all major dynasties. Map drill of important archaeological and historical sites. Summary of religious and artistic developments.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC History Finale Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC Ancient History: Full Course Recap',url:'https://youtube.com/results?search_query=UPSC+Ancient+History+Full+Revision+for+Prelims',why:'Complete mastery of ancient era before moving to medieval.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | ANCIENT FINALE',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

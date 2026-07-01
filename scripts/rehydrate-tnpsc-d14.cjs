require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:14,topic:'TNPSC REVISION: Tamil Literature Evolution (Days 8–13)',
intro:`Today we celebrate the journey of the Tamil language. From the didactic wisdom of the post-Sangam era to the majestic epics and the modern revolutionary poetry, you have covered over 1500 years of literary history. In TNPSC, the 'Literature' section is about precision—knowing exactly who wrote which epic and which poet edited which magazine. Today is for 'Author-Book Calibration'. Let's lock in the literature marks before we move to Geography and Administration.`,
notes:[
{title:'Thirukkural Master Table (Recap)',detail:'Aram (38), Porul (70), Inbam (25). Total 133 Adhikarams. English: G.U. Pope, Latin: Beschi. Names: Muppaal, Ulaga Podhumarai.'},
{title:'Ettuthokai & Pattuppattu Recap',detail:'Ettuthokai (8): Purananuru (War), Akananuru (Love), Pathitrupathu (Cheras). Pattuppattu (10): Mullaippaattu (Shortest), Maduraikanchi (Longest).'},
{title:'The 5 Great Epics (Recap)',detail:'Silappatikaram (Ilango), Manimekalai (Sathanar), Civaka Cintamani (Thirutthakka Devar). Silappatikaram = First Epic of Commoners.'},
{title:'Bhakti & Medieval Recap',detail:'Nayanmars (63) - Periya Puranam. Alvars (12) - Divya Prabandham. Kamba Ramayanam (Ramavataram).'},
{title:'Modern Poets Recap',detail:'Bharathiyar (Mahakavi, India magazine). Bharathidasan (Pavendar, Puratchikavi). Namakkal Kavignar (State Poet). Kavimani (Asia Jothi).'}
],
cards:[
{front:'Who is called "Pavendar"?',back:'Bharathidasan.'},
{front:'How many chapters in "Porutpaal" of Kural?',back:'70 chapters.'},
{front:'Shortest book in Pattuppattu?',back:'Mullaippaattu.'},
{front:'Who wrote "Kuyil Pattu"?',back:'Bharathiyar.'},
{front:'First epic to use "Virutha Pa" meter?',back:'Civaka Cintamani.'}
],
q:[
{q:'"உலகப் பொதுமறை" என அழைக்கப்படும் நூல் எது?',options:['திருவாசகம்','திருக்குறள்','பெரியபுராணம்','நாலடியார்'],ai:1,exp:'Thirukkural is known as the World Common Law.'},
{q:'சேர மன்னர்களின் வரலாற்றைக் கூறும் எட்டுத்தொகை நூல் எது?',options:['நற்றிணை','பதிற்றுப்பத்து','புறநானூறு','ஐங்குறுநூறு'],ai:1,exp:'Pathitrupathu exclusively deals with Chera kings.'},
{q:'"குடிமக்கள் காப்பியம்" எனப் போற்றப்படும் நூல்?',options:['சிலப்பதிகாரம்','மணிமேகலை','சீவகசிந்தாமணி','குண்டலகேசி'],ai:0,exp:'Silappatikaram is the first epic focused on common citizens.'},
{q:'நாமக்கல் கவிஞரின் சிறப்பினைப் பாராட்டி "அரசவை கவிஞர்" என்று அழைத்தவர் யார்? (குறிப்பு)',options:['பாரதியார்','பெரியார்','இராஜாஜி','அண்ணா'],ai:2,exp:'Rajaji appointed V. Ramalingam Pillai as the first State Poet.'}
],
hook:'Aram 38, Porul 70, Inbam 25. Silappatikaram=Kudimakkal Kaapiyam. Kamba Ramayanam=Ramavataram. Bharathidasan=Pavendar. Semmozhi=2004.',
summary:'Full revision of TNPSC Tamil Literature block. Consolidation of Sangam, Medieval, and Modern literary works. Author and book matching drill. Cumulative literature sprint.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🎯 TNPSC Revision Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC Tamil Literature Revision',url:'https://youtube.com/results?search_query=TNPSC+Tamil+Literature+Full+Revision',why:'Complete overview of literature before moving to next block.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

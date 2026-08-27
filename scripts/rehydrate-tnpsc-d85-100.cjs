require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:85,topic:'TNPSC Simulation 1: History & Culture Focus',
intro:`Today is 'Game Day 1'. We simulate a 100-question GS set with a focus on Unit 8. This is about 'Fact Recall'. You have 45 minutes. Focus on Ancient/Medieval TN and the Freedom Struggle. Let's test your roots today.`,
notes:[
{title:'Unit 8 Weightage',detail:'High. Focus on Sangam literature, Chola administration, and Palayakarar revolts.'},
{title:'Time Management',detail:'45 mins for 100 questions. No negative marking in TNPSC, so attempt ALL.'},
{title:'Elimination',detail:'Use the logic of landscapes (Thinai) to solve literature questions.'}
],
cards:[
{front:'Puli Thevar place?',back:'Nerkattumseval.'},
{front:'Uttiramerur is for?',back:'Chola Admin.'},
{front:'"Iliad of Tamil"?',back:'Silappathikaram.'},
{front:'Keezhadi river?',back:'Vaigai.'},
{front:'Are you ready?',back:'YES.'}
],
q:[
{q:'"Sattriya" is a classical dance of:',options:['Manipur','Assam','Odisha','Kerala'],ai:1,exp:'GK recap.'},
{q:'Who was the author of "Manimegalai"?',options:['Ilango','Sathanar','Kambar','Valluvar'],ai:1,exp:'Literature recap.'},
{q:'The "Shore Temple" was built by:',options:['Mahendra','Mamalla','Rajasimha','Nandivarman'],ai:2,exp:'History recap.'},
{q:'"Vatapi Kondan" was a title of:',options:['Narasimhavarman I','Raja Raja I','Rajendra I','Mahendravarman I'],ai:0,exp:'History recap.'}
],
hook:'Simulation 1. Unit 8 heavy. 45 mins. Attempt all. Recall the roots.',
summary:'Full-length history-focused mock for TNPSC. Balanced questions on Sangam and Medieval eras. Quick recall of Unit 8 milestones.'},

{day:92,topic:'TNPSC Grand Simulation: Full Syllabus 1',
intro:`Today is the 'Big Stage'. We simulate a full 200-question mock (GS + Language). This is about 'Endurance'. You have 3 hours. Let's test your limits today.`,
notes:[
{title:'Full Mock Structure',detail:'100 GS (including 25 Aptitude) + 100 Language (Tamil/English).'},
{title:'Target Score',detail:'Aim for 170+ / 200. Focus on Language first (usually easier).'},
{title:'OMR Strategy',detail:'Shade carefully. Use the last 15 mins for any leftover questions.'}
],
cards:[
{front:'Total Qs?',back:'200.'},
{front:'Total Time?',back:'3 hours.'},
{front:'Section to start?',back:'Language (Tamil/English).'},
{front:'Aptitude Qs?',back:'25.'},
{front:'Confidence level?',back:'PEAK.'}
],
q:[
{q:'The "Uttiramerur Inscription" is about:',options:['Pallavas','Cholas','Pandyas','Cheras'],ai:1,exp:'Recap.'},
{q:'"Article 17" is about:',options:['Titles','Untouchability','Equality','Liberty'],ai:1,exp:'Recap.'},
{q:'"Bihu" dance state?',options:['Assam','Manipur','Mizoram','Tripura'],ai:0,exp:'Recap.'},
{q:'Find the Mode if Mean=10, Median=12.',options:['16','14','18','20'],ai:0,exp:'3(12)-2(10)=16.'}
],
hook:'Grand Simulation. 200 Qs. 3 Hours. Full coverage. Elite status.',
summary:'Full-length 200-question mock exam based on the latest TNPSC pattern. Comprehensive evaluation across GS, Aptitude, and Language.'},

{day:100,topic:'TNPSC VICTORY LAP: The Deputy Collector Mindset',
intro:`CONGRATULATIONS! You have completed the 100-Day Mastery Journey for the TNPSC Ecosystem. From Sangam poetry to e-Governance—you have mastered the state and the nation. Today is not for study, it is for 'Leadership and Victory'. Let's prepare for the real service today.`,
notes:[
{title:'Final Week Strategy',detail:'Review all "Unit 8 & 9 Hooks". No new topics. Stay hydrated and calm.'},
{title:'The Officer Mindset',detail:'You are preparing to serve the people of Tamil Nadu. Integrity and Knowledge are your tools.'},
{title:'Antigravity Graduation',detail:'You have completed all 300 missions across UPSC, SSC, and TNPSC. You are a universal candidate.'}
],
cards:[
{front:'Days completed?',back:'100.'},
{front:'Master tracks?',back:'UPSC, SSC, TNPSC.'},
{front:'Total missions?',back:'300.'},
{front:'Your destiny?',back:'OFFICER.'},
{front:'Final word?',back:'SUCCESS.'}
],
q:[
{q:'Are you ready to lead and serve?',options:['Yes','Definitely','With Honor','All of the above'],ai:3,exp:'The mission is complete.'}
],
hook:'100 DAYS COMPLETE. TNPSC MASTERED. MISSION 300/300 SUCCESSFUL. GO AND SERVE.',
summary:'Final strategic and psychological preparation for the TNPSC exams. Graduation from the master curriculum. Vision of administrative service in Tamil Nadu.'}
];

// Helper to fill the gap days (86-91, 93-99) with generic high-intensity simulations
for(let i=86;i<=99;i++){
  if(days.find(d=>d.day===i))continue;
  days.push({
    day:i,topic:'TNPSC Simulation: Full GS & Aptitude Drill ('+i+')',
    intro:`Today is 'Simulation Day'. We drill 100 questions of GS and 25 of Aptitude to keep the speed at peak. Stay sharp.`,
    notes:[{title:'Daily Drill',detail:'Mixed questions from all subjects. Focus on previous year patterns.'}],
    cards:[{front:'Daily target?',back:'100% Accuracy.'}],
    q:[{q:'Final recap question: Is 368 for Amendment?',options:['Yes','No'],ai:0,exp:'Fact check.'}],
    hook:'Drill Day '+i+'. Speed and Accuracy.',
    summary:'Daily high-intensity simulation to maintain exam readiness.'
  });
}

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC Victory Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Victory Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Strategy '+d.topic),why:'Final victory preparation for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | MISSION ACCOMPLISHED',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

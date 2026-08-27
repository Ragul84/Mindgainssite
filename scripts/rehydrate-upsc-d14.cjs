require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:14,topic:'UPSC REVISION: Block 2 (Days 8–13) + 7th Schedule Drill',
intro:`You have reached the end of the second week. In the last 6 days, you covered the logic of the State (DPSP), the duties of the Citizen (FDs), the machinery of the Parliament, and the power of the Executive (President & PM). Today, we consolidate these high-stakes topics and perform a deep drill on the 7th Schedule. Why? Because UPSC loves asking 'In which list does X fall?' and it is the foundation for federalism. Today is for mastering the 'Grey Areas'—subjects like Education and Forests that moved from State to Concurrent list. Let's finish the Polity foundation strong.`,
notes:[
{title:'DPSP & FD Quick Check',detail:'DPSP (Art 36-51): Art 40(Panchayat), 44(UCC), 50(Judiciary sep). 42nd Amdt added 39A, 43A, 48A. FDs (Art 51A): 11 duties total. 86th Amdt added 11th. Borrowed from USSR.'},
{title:'7th Schedule: The Big List Drill',detail:'Union List (100 sub): Defence, Banking, Foreign Affairs, Railways, Atomic Energy, Census, Insurance, Stock Exchange. State List (61 sub): Police, Public Order, Land, Agriculture, Public Health, Fisheries, Local Govt, Gas. Concurrent List (52 sub): Education, Forests, Marriage/Divorce, Bankruptcy, Drugs, Electricity, Population control.'},
{title:'Parliament & Executive Summary',detail:'Joint Sitting: Art 108 (No Money/Amdt bills). Money Bill: Art 110 (Speaker decides). Ordinance: Art 123 (6m+6w life). President Election: Elected MPs+MLAs. Governor: Pleasure of President. 6 Bicameral States: UP, BI, KA, MH, TS, AP.'},
{title:'The 42nd Amdt Shift (1976)',detail:'5 subjects moved from STATE to CONCURRENT: 1. Education, 2. Forests, 3. Weights and Measures, 4. Protection of Wild Animals and Birds, 5. Administration of Justice (except SC/HC).'}
],
cards:[
{front:'In which list does "Education" fall?',back:'Concurrent List. (It was moved from the State List by the 42nd Amendment, 1976).'},
{front:'In which list does "Police" and "Public Order" fall?',back:'State List. (This is why states control their own police forces).'},
{front:'In which list does "Census" fall?',back:'Union List. (Only the Central Govt conducts the National Census).'},
{front:'Where does "Marriage and Divorce" fall?',back:'Concurrent List.'},
{front:'Where does "Stock Market" and "Banking" fall?',back:'Union List.'}
],
q:[
{q:'Which of the following subjects was moved from the State List to the Concurrent List by the 42nd Amendment?',options:['Police','Agriculture','Forests','Fisheries'],ai:2,exp:'Forests, Education, Weights & Measures, Wild Animal protection, and Admin of Justice were moved by 42nd Amendment.'},
{q:'"Agriculture" is a subject mentioned in the:',options:['Union List','State List','Concurrent List','Residuary List'],ai:1,exp:'Agriculture (including tax on agricultural income) is in the State List.'},
{q:'"Residuary Powers" (subjects not in any list) belong to:',options:['State Government','Central Government','Both equally','Supreme Court'],ai:1,exp:'Article 248 states that Parliament (Centre) has exclusive power to make laws with respect to any matter not enumerated in any of the three lists.'},
{q:'A Joint Sitting of Parliament (Art 108) is presided over by:',options:['President','Chairman of Rajya Sabha','Speaker of Lok Sabha','Prime Minister'],ai:2,exp:'The Speaker of LS presides. If absent, the Deputy Speaker. If both absent, the Deputy Chairman of RS.'}
],
hook:'Education=Concurrent. Police=State. Banking=Union. 42nd Amdt moved 5 subjects. Art 248=Residuary (Centre). Joint Sitting=Art 108. Money Bill=Art 110.',
summary:'Consolidation of Days 8-13. Mastery of 7th Schedule (Union, State, Concurrent). Summary of Bills, Majorities, and Executives. Cumulative quiz included.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC Ranker Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC Revision: 7th Schedule Drill',url:'https://youtube.com/results?search_query=UPSC+7th+Schedule+List+Drill',why:'Crucial for memory-based prelims questions.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

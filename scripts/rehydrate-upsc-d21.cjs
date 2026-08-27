require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:21,topic:'UPSC REVISION: Polity Finale (Block 3) & PYQ Sprint',
intro:`You have finished 3 weeks of intensive Indian Polity. You have mastered the Constitution from its preamble to its governance watchdogs. Today is your 'Polity Finale'. We revise the complex dynamics of federalism, the gravity of emergency powers, and the structural integrity of constitutional bodies. After this day, we shift gears to History. Today, use the 'PYQ Sprint' to test if your knowledge can survive real UPSC questions. If you can distinguish between Art 352 and 356, and correctly place CBI as non-statutory, you are ready to conquer the next ecosystem.`,
notes:[
{title:'Emergency Provisions Master Table',detail:'Art 352 (National): War/External Aggression/Armed Rebellion. Special Majority. 1 month. Art 356 (State): Constitutional failure. Simple Majority. 2 months. Art 360 (Financial): Financial threat. Simple Majority. Indefinite once approved.'},
{title:'Body Classification Drill',detail:'Constitutional: ECI, CAG, UPSC, SPSC, FC, National Commission for SC/ST/BC. Statutory: RTI, Lokpal, CVC, NHRC, SEBI, NGT. Executive: NITI Aayog, CBI.'},
{title:'Federalism & Basic Structure Cases',detail:'Sarkaria/Punchhi: Centre-State. Bommai: Art 356 review. Kesavananda: Basic Structure. Minerva Mills: FR/DPSP Harmony. IR Coelho: 9th Sch review.'},
{title:'Majorities & Amendments Recap',detail:'Art 368: Special Majority (2/3 P&V + Absolute). Joint Sitting: Art 108 (Ordinary/Financial bills only). Money Bill: Art 110 (LS only). 44th Amdt: Restored rights, Art 20/21 protection.'}
],
cards:[
{front:'In which list does "Agriculture" and "Police" fall?',back:'State List. (7th Schedule).'},
{front:'In which list does "Education" and "Forests" fall?',back:'Concurrent List. (Shifted by 42nd Amdt).'},
{front:'Can Parliament amend the "Basic Structure"?',back:'NO. (Kesavananda Bharati Case, 1973).'},
{front:'Who appoints the State Finance Commission?',back:'Governor of the State (every 5 years).'},
{front:'Which body is known as the "Watchdog of Integrity"?',back:'Central Vigilance Commission (CVC).'}
],
q:[
{q:'Which of the following is NOT a part of the "Basic Structure" of the Constitution?',options:['Secularism','Judicial Review','Absolute power of Parliament to amend FRs','Free and Fair Elections'],ai:2,exp:'Parliament does NOT have absolute power; it is limited by the Basic Structure doctrine.'},
{q:'A proclamation of National Emergency (Art 352) must be approved by Parliament by:',options:['Simple Majority','Special Majority (2/3 P&V + Absolute)','Effective Majority','Unanimous vote'],ai:1,exp:'44th Amendment changed the majority requirement for Art 352 to Special Majority.'},
{q:'The power of the Supreme Court to issue writs for enforcement of FRs is provided under:',options:['Article 13','Article 32','Article 226','Article 142'],ai:1,exp:'Art 32 is for SC; Art 226 is for HC.'},
{q:'Which Amendment lowered the voting age from 21 to 18 years?',options:['42nd Amendment','44th Amendment','61st Amendment','86th Amendment'],ai:2,exp:'The 61st Amendment (1988) changed the voting age.'},
{q:'The "carry forward" rule for reservation in promotions was upheld by which Amendment?',options:['77th Amendment','81st Amendment','85th Amendment','103rd Amendment'],ai:1,exp:'81st Amendment (2000) allowed the state to consider "backlog" vacancies as a separate class.'}
],
hook:'Art 352=Special (1m). Art 356=Simple (2m). NHRC=Statutory. NITI Aayog=Executive. Art 32=SC Writs. Art 226=HC Writs. 7th Sch=3 Lists.',
summary:'Full revision of UPSC Polity. Emergency, Federalism, Bodies, and Amendments. Preparation for the transition to History ecosystem. Final Polity PYQ Sprint.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC Ranker Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC Polity: Full Course Recap',url:'https://youtube.com/results?search_query=UPSC+Polity+Full+Revision+for+Prelims',why:'Complete mastery of polity before ecosystem switch.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | POLITY FINALE',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

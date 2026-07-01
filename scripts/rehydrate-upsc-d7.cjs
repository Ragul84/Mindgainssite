require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:7,topic:'UPSC REVISION: Block 1 (Days 1–6)',
intro:`Today is your first Revision Day. In the UPSC journey, studying is 40% of the work, but revising is 60%. If you don't consolidate what you learned in the last 6 days, you will lose the 'Article Number' and 'Schedule Number' precision that Prelims demands. Today is not for new topics. It is for active recall. Can you list all 12 Schedules without looking? Can you recall what Art 21, 25, or 32 specifically says? Use this day to fill the gaps in your memory. We have combined the most high-yield tables from the last 6 days into one master screen.`,
notes:[
{title:'Master Schedule Recitation (1–12)',detail:'1:States/UTs, 2:Salaries, 3:Oaths, 4:RS Seats, 5:Sched Areas, 6:Tribal Areas(AMTM), 7:3 Lists, 8:22 Languages, 9:Judicial Review Protection(1st Amdt), 10:Anti-defection(52nd Amdt), 11:Panchayats(29 subjects), 12:Municipalities(18 subjects).'},
{title:'FR Article Number Map (12–35)',detail:'12-13: Definition+Judicial Review. 14-18: Equality. 19-22: Freedom. 23-24: Exploitation. 25-28: Religion. 29-30: Minority. 32: Writs. 33-35: Specific powers. KEY TRAP: Art 31 (Right to Property) was removed by 44th Amdt 1978 and moved to Art 300A as a legal right.'},
{title:'Sources & CA Summary',detail:'Blueprint: 1946 Cabinet Mission. Adopted: Nov 26, 1949. Signed: 299. Advisor: B.N. Rau. Drafting: Ambedkar. Sources: UK(Parliament), USA(FRs/Review), Ireland(DPSP), USSR(FDs), Germany(Emergency), Australia(Concurrent), Canada(Strong Centre).'},
{title:'Preamble & Citizenship Revision',detail:'Preamble Words: Sovereign, Socialist, Secular, Democratic, Republic. Socialist+Secular+Integrity added by 42nd Amdt. Citizenship Cutoffs: 1987 (1 parent), 2003 (neither parent illegal). CAA 2019: 6 religions, 3 countries, Dec 31 2014 cutoff.'}
],
cards:[
{front:'Quick Recall: What are the 6 freedoms of Art 19?',back:'1. Speech & Expression. 2. Assembly (peaceful). 3. Association (incl. Co-ops). 4. Movement. 5. Residence. 6. Profession.'},
{front:'Quick Recall: Which Article is the "Heart & Soul"?',back:'Article 32 (Right to Constitutional Remedies / Writs).'},
{front:'Quick Recall: Which Schedule deals with Anti-Defection?',back:'10th Schedule (added by 52nd Amendment, 1985).'},
{front:'Quick Recall: Which Amendment added Socialist/Secular?',back:'42nd Amendment (1976).'},
{front:'Quick Recall: Which Article deals with Untouchability?',back:'Article 17 (Absolute right).'}
],
q:[
{q:'Which of the following was NOT added to the Preamble by the 42nd Amendment?',options:['Socialist','Secular','Integrity','Fraternity'],ai:3,exp:'Fraternity was in the original Preamble. Socialist, Secular, and Integrity were added by the 42nd Amendment in 1976.'},
{q:'The 7th Schedule of the Constitution deals with:',options:['Languages','Anti-defection','Division of powers between Centre and States','Panchayati Raj'],ai:2,exp:'7th Schedule contains the Union, State, and Concurrent Lists, dividing legislative powers.'},
{q:'Article 21A, providing Right to Education, was inserted by which Amendment?',options:['42nd Amendment','44th Amendment','86th Amendment','101st Amendment'],ai:2,exp:'86th Amendment (2002) added Art 21A for children aged 6-14.'},
{q:'Habeas Corpus, Mandamus, and Quo-Warranto are examples of:',options:['Directive Principles','Constitutional Amendments','Writs','Schedules'],ai:2,exp:'These are the 5 types of Writs issued by SC (Art 32) and HC (Art 226) for enforcement of rights.'}
],
hook:'Revision is the key. 7th Schedule=3 Lists. 10th=Defection. 11th=Panchayat. Art 13=Review. Art 17=Absolute. Art 32=Soul. 42nd Amdt=Socialist/Secular.',
summary:'Revision of Days 1-6. Mastery of 12 Schedules, Article numbers 12-35, Preamble keywords, CA members, and Sources. Cumulative quiz included.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC Ranker Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC Revision: Polity Part 1',url:'https://youtube.com/results?search_query=UPSC+Polity+Revision+L1-6',why:'Quick recap of foundational polity.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

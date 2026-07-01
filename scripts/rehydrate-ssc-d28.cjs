require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:28,topic:'SSC REVISION: English Foundation (Days 22–27)',
intro:`You have finished the core English block. From the singular/plural traps of Nouns to the complex 'Conditional' tenses and the 'Fixed Prepositions'—you have covered the most vital 20% of the syllabus that accounts for 80% of the marks. Today, we consolidate these rules. In SSC English, the goal is 'Zero Doubt'. If you see 'No sooner', you should immediately look for 'Than'. If you see 'Furniture', you should immediately check for 's'. Let's lock in the rules today.`,
notes:[
{title:'Grammar Master Table (Part 1)',detail:'Nouns: Furniture/Info (Singular), Cattle/People (Plural). Pronouns: 231 order. SVA: Neither/Nor (Nearest), As well as (First). Conditionals: Had+V3...Would have+V3.'},
{title:'Grammar Master Table (Part 2)',detail:'Articles: An Honest, A University. Prepositions: Fond of, Abstain from, Congratulate on. Conjunctions: No sooner...THAN, Hardly...WHEN.'},
{title:'Vocabulary & Errors Recap',detail:'Redundancy: No "return back", no "cousin sister". Unless/Until: No "not" in the clause. Roots: Bene (Good), Mal (Bad), Phil (Love).'},
{title:'Common Exception Checklist',detail:'"I wish I were", "It was I", "Between you and me", "Senior to" (not than), "Old enough" (Enough after adjective).'}
],
cards:[
{front:'Preposition after "Senior" or "Inferior"?',back:'TO. (e.g., Senior to me).'},
{front:'Is "Between you and I" correct?',back:'No. Correct is "Between you and me" (Objective case).'},
{front:'"The more he gets, ____ he wants"?',back:'The more. (Parallel comparison).'},
{front:'Synonym of "Adversity"?',back:'Misfortune / Difficulty.'},
{front:'Antonym of "Candid"?',back:'Devious / Secretive.'}
],
q:[
{q:'Spot the error: No sooner had he entered the room when the light went out.',options:['No sooner','had he entered','the room','when'],ai:3,exp:'"No sooner" is followed by "than", not "when".'},
{q:'I have been waiting for you since two hours.',options:['I have been','waiting for you','since','two hours'],ai:2,exp:'"Two hours" is a duration, so use "for". "Since" is for a specific point in time.'},
{q:'Select the correctly punctuated sentence:',options:['He as well as his friends are going.','He as well as his friends is going.','He and his friends is going.','He along with his friends are going.'],ai:1,exp:'With "as well as", the verb follows the first subject (He).'},
{q:'Unless you do not hurry, you will miss the train.',options:['Unless','you do not','hurry','you will miss'],ai:1,exp:'"Unless" already contains "not". Correct: Unless you hurry...'}
],
hook:'No sooner...THAN. Hardly...WHEN. I wish=WERE. Between+ME. Senior TO. Fond OF. Furniture=Singular. 231 order.',
summary:'Full revision of SSC English foundation. Consolidation of grammar rules, tenses, prepositions, and conjunctions. Cumulative vocabulary drill. Final English Part 1 quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Speed Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC English: Full Block Revision',url:'https://youtube.com/results?search_query=SSC+English+Grammar+Full+Revision',why:'Complete mastery of grammar rules before moving to comprehension.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

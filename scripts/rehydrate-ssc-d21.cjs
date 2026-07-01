require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:21,topic:'SSC REVISION: Reasoning Foundation (Days 15–20)',
intro:`You have finished the core logic block of the SSC Reasoning section. From the 'EJOTY' alphabet positions to the 'Family Tree' and 'Ranking' formulas—you have built the mental machinery needed to score 50/50. Today, we consolidate these patterns. In Reasoning, speed comes from 'Immediate Recognition'. If you see a series or a relationship and your brain immediately thinks 'Square + 1' or 'Mother-in-law', you've won. Let's drill the logic today.`,
notes:[
{title:'Alphabet & Coding Master Table',detail:'Positions: E(5), J(10), O(15), T(20), Y(25). Opposites: A-Z, B-Y, C-X, D-W, E-V, F-U, G-T, H-S, I-R, J-Q, K-P, L-O, M-N (Sum=27).'},
{title:'Family Tree & Direction recap',detail:'Tree: Square(+)=M, Circle(-)=F, Horizontal=Sibling, Double(=)=Married. Compass: N-S-E-W + NE-NW-SE-SW. Shadow: Morning (West), Evening (East).'},
{title:'Ranking & Order Formulas',detail:'Total = L + R - 1. Rank = (Total - Other Rank) + 1. Swap: New L + Old R - 1. Between = Total - (R1 + R2).'},
{title:'Series & Analogy Clues',detail:'Slow change: Difference. Fast change: Multiplication or Squares/Cubes. Fictitious Language: Use elimination. Substitution: Look for "called as".'}
],
cards:[
{front:'Opposite of Q?',back:'J. (Q=17, 27-17=10. J=10).'},
{front:'Formula for ranking total?',back:'L + R - 1.'},
{front:'In-law relations?',back:'Relations by marriage.'},
{front:'Direction facing North, 90° Clockwise turn?',back:'East.'},
{front:'Alphabet opposite of M?',back:'N.'}
],
q:[
{q:'In a row of 50 students, Ravi is 15th from the top. What is his rank from the bottom?',options:['35th','36th','34th','37th'],ai:1,exp:'Bottom = (Total - Top) + 1 = (50 - 15) + 1 = 36th.'},
{q:'Find the odd one out:',options:['3, 9','4, 16','5, 25','6, 32'],ai:3,exp:'All others are (n, n²). 6² is 36, not 32.'},
{q:'If A is B\'s sister, C is B\'s mother, D is C\'s father, E is D\'s mother, then how is A related to D?',options:['Grandmother','Granddaughter','Daughter','Aunt'],ai:1,exp:'C is A\'s mother. D is C\'s father. So D is A\'s maternal grandfather. A is his granddaughter.'},
{q:'One evening before sunset, Rekha and Hema were talking to each other face to face. If Hema\'s shadow was exactly to the right of Hema, which direction was Rekha facing?',options:['North','South','East','West'],ai:0,exp:'Evening shadow is in East. Hema\'s shadow is to her right, so East is her right. This means Hema is facing South. Since they are face to face, Rekha is facing North.'}
],
hook:'EJOTY=5,10,15,20,25. Opposite sum=27. Total=L+R-1. Morning shadow=West. Evening=East. Draw a tree for blood relations.',
summary:'Full revision of SSC Reasoning foundation. Consolidation of coding, series, blood relations, direction, and ranking. Speed drills for alphabet positions and logic patterns.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Speed Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC Reasoning: Full Block Revision',url:'https://youtube.com/results?search_query=SSC+Reasoning+Revision+Full+Course',why:'Complete logic mastery before moving to Verbal/Non-verbal reasoning.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

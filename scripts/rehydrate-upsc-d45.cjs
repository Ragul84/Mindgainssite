require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:45,topic:'UPSC REVISION: British Conquest & Resistance (Days 36–44)',
intro:`Today we wrap up the 'First Phase' of Modern India. You have traced the journey of a trading company that became the master of a continent. From the intrigues of Plassey to the structural exploitation of land revenue systems and the massive outburst of 1857—you now understand the 'Mechanics of Colonialism'. Today is for 'Anchor Revision'. Can you recall the provisions of the 1833 Act? Do you remember who led the Santhal Hool? Let's solidify this foundation before we enter the era of the National Movement.`,
notes:[
{title:'Conquest Master Table',detail:'1757: Plassey. 1764: Buxar. 1765: Allahabad Treaty. 1799: Mysore falls (Tipu). 1818: Marathas fall. 1849: Punjab falls. 1857: Great Revolt.'},
{title:'Land Revenue Recap',detail:'Permanent (Cornwallis - Bengal). Ryotwari (Munro - Madras). Mahalwari (Mackenzie - Punjab). Impact: Poverty, Famine, Rural debt.'},
{title:'Constitutional Acts Recap',detail:'1773: Supreme Court/GG Bengal. 1784: Board of Control. 1813: End of trade monopoly. 1833: GG of India. 1853: Open competition. 1858: Crown Rule.'},
{title:'Resistance Recap',detail:'Sanyasi (Anandamath). Santhal (Sidhu/Kanhu). Indigo (Nil Darpan). 1857 (Bahadur Shah, Nana Saheb, Jhansi Rani, Kunwar Singh).'},
{title:'Governor-Generals Recap',detail:'Cornwallis (Civil Service). Dalhousie (Lapse/Railways). Bentinck (Sati abolition). Canning (1857/Viceroy). Ripon (Local Self-Gov).'}
],
cards:[
{front:'Who was the 1st Viceroy of India?',back:'Lord Canning (1858).'},
{front:'Which act made GG of Bengal into GG of India?',back:'Charter Act of 1833.'},
{front:'Who wrote "Poverty and Un-British Rule in India"?',back:'Dadabhai Naoroji.'},
{front:'Where did the 1857 revolt begin?',back:'Meerut (May 10, 1857).'},
{front:'Who introduced the "Subsidiary Alliance"?',back:'Lord Wellesley.'}
],
q:[
{q:'Match the following systems with their regions:\n1. Permanent Settlement\n2. Ryotwari System\n3. Mahalwari System',options:['1-Bengal, 2-Madras, 3-Punjab','1-Madras, 2-Bengal, 3-Punjab','1-Punjab, 2-Madras, 3-Bengal','1-Bengal, 2-Punjab, 3-Madras'],ai:0,exp:'Permanent (Bengal), Ryotwari (Madras), Mahalwari (North/NW India).'},
{q:'Which of the following acts for the first time made a provision of 1 Lakh for education?',options:['Regulating Act 1773','Charter Act 1813','Charter Act 1833','Wood\'s Despatch 1854'],ai:1,exp:'The 1813 act first allocated funds for the encouragement of literature and education.'},
{q:'The "Black Hole Tragedy" was a precursor to which battle?',options:['Battle of Buxar','Battle of Plassey','Third Carnatic War','1857 Revolt'],ai:1,exp:'It was used by Clive to justify the invasion of Bengal.'},
{q:'Who among the following was called the "Father of Modern India"?',options:['Swami Vivekananda','Raja Ram Mohan Roy','Dadabhai Naoroji','Ishwar Chandra Vidyasagar'],ai:1,exp:'RRM Roy was the pioneer of rationalism and social reform.'},
{q:'The "Doctrine of Lapse" was first applied to which state?',options:['Jhansi','Nagpur','Satara','Sambalpur'],ai:2,exp:'Satara (1848) was the first state to be annexed by Dalhousie using this doctrine.'}
],
hook:'1773=Act. 1757=Plassey. 1793=Permanent. 1857=Revolt. 1858=Crown. RRM Roy=Reform. Munro=Ryotwari. Dalhousie=Lapse.',
summary:'Full revision of the first phase of Modern Indian History. Consolidation of conquest, revenue systems, and resistance movements. Governor-General and Constitutional Act drill. Final Modern History Part 1 quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC History Finale Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC Modern History: Phase 1 Recap',url:'https://youtube.com/results?search_query=UPSC+Modern+History+Full+Revision+Part+1',why:'Complete mastery of conquest and consolidation era.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | MODERN PHASE 1',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

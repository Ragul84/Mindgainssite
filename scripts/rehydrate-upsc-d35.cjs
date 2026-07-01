require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:35,topic:'UPSC REVISION: Medieval India Finale & Terminology Drill',
intro:`Today we wrap up the 'Medieval' chapter. You have navigated through the administrative genius of Alauddin Khalji, the cultural zenith of Vijayanagara, the massive machinery of the Mughal Empire, and the spiritual awakening of the Bhakti saints. Today is about 'Mastering the Dictionary'. In UPSC Medieval History, 'Terminology' is the most frequent source of confusion. Can you tell a Samaharta from a Samanta? An Iqta from an Amara? Let's consolidate the facts and prepare for the transition to the Modern era.`,
notes:[
{title:'Medieval Timeline Recap',detail:'1206-1526: Delhi Sultanate. 1336-1646: Vijayanagara Empire. 1526-1707: Great Mughals. 1674-1818: Maratha Empire. 1707-1757: Rise of Regional Powers.'},
{title:'Administrative Terminology Master List',detail:'Iqta: Land grant (Sultanate). Amara: Land grant (Vijayanagara). Mansab: Rank (Mughal). Chauth/Sardeshmukhi: Tax (Maratha). Diwan-i-Arz: Military (Sultanate). Samaharta: Revenue (Maurya - recap). Ashtapradhan: 8 Ministers (Shivaji).'},
{title:'Religious & Cultural Anchors',detail:'Bhakti: Advaita (Shankara), Vishishtadvaita (Ramanuja). Sufi: Chisti (Auliya), Suhrawardi. Literature: Amir Khusrau (Sultanate), Tulsidas/Abul Fazl (Mughal), Krishnadeva Raya (Telugu).'},
{title:'Mughal Revenue & Ranks',detail:'Zabti/Dahshala: Measured revenue. Zat: Personal rank. Sawar: Horseman count. Polaj: Best land. Banjar: Worst land.'},
{title:'Foreign Travelers Recap',detail:'Ibn Battuta (MBT - Sultanate). Nicolo Conti/Abdur Razzaq (Vijayanagara). Megasthenes (Maurya - recap). Fa-Hien/Hiuen Tsang (Ancient - recap).'}
],
cards:[
{front:'What is "Dagh" and "Chehra"?',back:'Branding of horses and descriptive roll of soldiers (Alauddin Khalji).'},
{front:'Which battle marked the end of Vijayanagara\'s power?',back:'Battle of Talikota (1565).'},
{front:'What is "Din-i-Ilahi"?',back:'Akbar\'s syncretic religious path.'},
{front:'In which list does "Agriculture" fall? (Polity Recap)',back:'State List.'},
{front:'Who was the real founder of the Delhi Sultanate?',back:'Iltutmish.'}
],
q:[
{q:'In the context of medieval India, the term "Sardeshmukhi" refers to:',options:['A royal court ceremony','A type of land revenue tax','A military rank','A religious ritual'],ai:1,exp:'It was an additional 10% tax claimed by Maratha rulers as the head of the land.'},
{q:'Which of the following travelers is correctly matched with the period of visit?',options:['Ibn Battuta - Mauryan Era','Nicolo Conti - Mughal Era','Abdur Razzaq - Vijayanagara Era','Fa-Hien - Delhi Sultanate'],ai:2,exp:'Abdur Razzaq visited Vijayanagara in the 15th century.'},
{q:'The "Ibadat Khana" was established at Fatehpur Sikri by:',options:['Babur','Humayun','Akbar','Shah Jahan'],ai:2,exp:'Akbar used it for religious discussions.'},
{q:'Who among the following was the pioneer of the Bhakti movement in North India?',options:['Ramanuja','Kabir','Ramananda','Chaitanya'],ai:2,exp:'Ramananda is credited with bringing the Bhakti movement from the South to the North.'},
{q:'The "Battle of Panipat I" (1526) was fought between:',options:['Akbar and Hemu','Babur and Ibrahim Lodi','Humayun and Sher Shah','Marathas and Abdali'],ai:1,exp:'This battle marked the beginning of the Mughal Empire in India.'}
],
hook:'Iqta=Sultanate. Amara=Vijayanagara. Mansab=Mughal. Chauth=Maratha. 1526=Mughals. 1565=Talikota. 1707=Decline starts.',
summary:'Full revision of Medieval Indian History. Comparison of administrative and revenue systems. Recap of religious movements and literature. Final Medieval History quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC History Finale Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC Medieval History: Full Course Recap',url:'https://youtube.com/results?search_query=UPSC+Medieval+History+Full+Revision+for+Prelims',why:'Complete mastery of medieval era before moving to modern.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | MEDIEVAL FINALE',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

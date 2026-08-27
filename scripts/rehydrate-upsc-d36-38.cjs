require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:36,topic:'UPSC History: Advent of Europeans & Carnatic Wars',
intro:`Today we study the 'Entry of the West'. It started with Vasco da Gama's arrival in Calicut in 1498 and ended with the British East India Company becoming the dominant power. We study the sequence of arrival (Portuguese, Dutch, English, Danes, French) and the struggle for supremacy between the British and the French—known as the Carnatic Wars. For UPSC, the focus is on 'Why the British succeeded' over other Europeans and the importance of naval power. This is the prologue to the colonial era.`,
notes:[
{title:'Sequence of Arrival',detail:'1. Portuguese (Vasco da Gama 1498). 2. Dutch (1602). 3. English (1608 - Captain Hawkins). 4. Danes (1616). 5. French (1664 - Colbert). Remember: P-D-E-D-F.'},
{title:'Portuguese in India',detail:'Almeida (Blue Water Policy). Albuquerque (Real founder, captured Goa 1510). They introduced Tobacco and Pineapple in India. Their power declined due to religious intolerance and competition.'},
{title:'The Carnatic Wars (British vs French)',detail:'1. First (1746-48): Battle of St. Thome, Treaty of Aix-la-Chapelle. 2. Second (1749-54): Battle of Ambur, Treaty of Pondicherry. 3. Third (1758-63): Battle of Wandiwash (1760 - French defeated), Treaty of Paris.'},
{title:'Dupleix & Robert Clive',detail:'Dupleix (French Governor): Pioneered the idea of interfering in Indian politics. Robert Clive (British): The mastermind behind British victory and the use of the "Sepoy" army.'},
{title:'Causes of British Success',detail:'Strong Naval power. Financial stability of the EIC (Private company vs French State-owned). Industrial Revolution in Britain. Efficient military leadership.'}
],
cards:[
{front:'Who discovered the sea route to India in 1498?',back:'Vasco da Gama (Portuguese).'},
{front:'What is the "Blue Water Policy"?',back:'Almeida\'s policy to control the Indian Ocean through naval power.'},
{front:'Battle of Wandiwash (1760)—significance?',back:'Decisive British victory over the French, ending French challenge in India.'},
{front:'Correct sequence of European arrival?',back:'Portuguese -> Dutch -> English -> Danes -> French.'},
{front:'Treaty that ended the 3rd Carnatic War?',back:'Treaty of Paris (1763).'}
],
q:[
{q:'Which of the following European powers was the LAST to arrive in India?',options:['Portuguese','Dutch','English','French'],ai:3,exp:'French East India Company was formed in 1664, arriving last among major powers.'},
{q:'The "Battle of St. Thome" (1746) was fought between:',options:['British and French','French and Nawab of Carnatic','Portuguese and Dutch','British and Mughals'],ai:1,exp:'This battle during the 1st Carnatic War proved the superiority of disciplined European armies over large Indian forces.'},
{q:'Albuquerque captured Goa from the Sultan of which state in 1510?',options:['Bijapur','Golconda','Ahmednagar','Calicut'],ai:0,exp:'Albuquerque captured Goa from the Sultan of Bijapur, making it the HQ of Portuguese India.'},
{q:'The "Blue Water Policy" is associated with which Portuguese Governor?',options:['Albuquerque','Francisco de Almeida','Nino da Cunha','Vasco da Gama'],ai:1,exp:'Almeida aimed to make Portuguese masters of the sea rather than building land empires.'}
],
hook:'1498=Vasco. 1760=Wandiwash (French end). Clive=British hero. Dupleix=French hero. P-D-E-D-F. Blue Water=Almeida.',
summary:'Timeline of European arrival. Portuguese contribution and decline. Summary of the three Carnatic Wars. Analysis of British victory and Dupleix\'s role.'},

{day:37,topic:'UPSC History: Battle of Plassey & Buxar (Conquest of Bengal)',
intro:`Today we study the 'Birth of British Political Power'. The conquest of Bengal—the richest province of India—was the turning point for the East India Company. From the intrigue of Plassey (1757) to the decisive military victory at Buxar (1764), we trace how a trading company became a sovereign power. For UPSC, the 'Treaty of Allahabad' and the 'Dual Government' system of Robert Clive are critical conceptual areas. This is where 'Colonial Exploitation' begins.`,
notes:[
{title:'Battle of Plassey (June 23, 1757)',detail:'Siraj-ud-Daulah (Nawab of Bengal) vs Robert Clive. Causes: Misuse of Dastaks (trade permits), Fortification of Calcutta. Outcome: Mir Jafar betrayed the Nawab. British became the "Kingmakers".'},
{title:'Battle of Buxar (1764)',detail:'Mir Qasim (Bengal) + Shuja-ud-Daulah (Awadh) + Shah Alam II (Mughal) vs Hector Munro. Decisive military victory. Proved British military superiority over combined Indian forces.'},
{title:'Treaty of Allahabad (1765)',detail:'Ended Buxar. EIC got the "Diwani Rights" (Right to collect revenue) of Bengal, Bihar, and Orissa. This gave them massive financial resources without any administrative responsibility.'},
{title:'Dual Government in Bengal (1765–1772)',detail:'System by Robert Clive. Diwani (Revenue) with EIC, Nizamat (Admin) with Nawab. Resulted in massive corruption, famine (1770), and collapse of Bengal\'s economy.'},
{title:'Key Terms',detail:'Dastak: Trade permit. Diwani: Revenue collection. Nizamat: Police and judicial functions.'}
],
cards:[
{front:'Date of the Battle of Plassey?',back:'June 23, 1757.'},
{front:'Who betrayed Siraj-ud-Daulah at Plassey?',back:'Mir Jafar.'},
{front:'What are "Diwani Rights"?',back:'The right to collect land revenue (granted to EIC in 1765).'},
{front:'Who led the British at the Battle of Buxar?',back:'Major Hector Munro.'},
{front:'Which treaty followed the Battle of Buxar?',back:'Treaty of Allahabad (1765).'}
],
q:[
{q:'The "Dual Government" system in Bengal was abolished by:',options:['Robert Clive','Warren Hastings','Lord Cornwallis','Lord Wellesley'],ai:1,exp:'Warren Hastings abolished it in 1772 and took over direct administration.'},
{q:'Through the Treaty of Allahabad, the East India Company obtained the Diwani of:',options:['Bengal only','Bengal and Bihar','Bengal, Bihar, and Orissa','Awadh'],ai:2,exp:'This granted the EIC the right to collect revenue for the entire province.'},
{q:'Which of the following was the main cause of the Battle of Plassey?',options:['Religious interference','Misuse of trade permits (Dastaks)','Annexation of Awadh','Support to the French'],ai:1,exp:'The misuse of free trade permits by EIC officials was a major source of conflict with the Nawab.'},
{q:'The Black Hole Tragedy is associated with which event?',options:['Battle of Buxar','Siege of Calcutta (1756)','Third Carnatic War','Maratha Invasions'],ai:1,exp:'It was cited by the British as a justification for the war against Siraj-ud-Daulah.'}
],
hook:'1757=Plassey (Intrigue). 1764=Buxar (Military). 1765=Diwani Rights. Allahabad=Treaty. Clive=Dual Gov. Bengal=Richest province.',
summary:'Causes and outcomes of Plassey and Buxar. The shift from "Kingmakers" to "Sovereigns". Detailed analysis of the Treaty of Allahabad and the Dual Government system.'},

{day:38,topic:'UPSC History: Mysore, Maratha & Sikh Wars',
intro:`Today we study the 'Consolidation of Empire'. After Bengal, the British had to defeat three major Indian powers to rule the whole of India: the valiant Mysore under Tipu Sultan, the powerful Maratha confederacy, and the formidable Sikh Empire. We focus on the 'Subsidiary Alliance' and 'Doctrine of Lapse'—the two diplomatic weapons used for expansion. For UPSC, knowing the sequence of wars and the key treaties (like Seringapatam and Salbai) is vital. This is the era of 'Imperialism'.`,
notes:[
{title:'Anglo-Mysore Wars (1767–1799)',detail:'1. 1st: Hyder Ali won. 2. 2nd: Hyder died, Treaty of Mangalore. 3. 3rd: Tipu defeated, Treaty of Seringapatam (lost half territory). 4. 4th (1799): Tipu died at Seringapatam. Wellesley ended Mysore\'s independence.'},
{title:'Anglo-Maratha Wars (1775–1818)',detail:'1. 1st: Treaty of Salbai (20 years of peace). 2. 2nd: Scindia/Holkar defeated, Treaty of Bassein (Subsidiary Alliance). 3. 3rd (1817-18): Peshwaship abolished. Marathas became pensioned off.'},
{title:'Anglo-Sikh Wars (1845–1849)',detail:'Following Ranjit Singh\'s death, internal chaos led to wars. 2nd War (1849): Dalhousie annexed Punjab. Koh-i-Noor diamond taken to Britain.'},
{title:'Subsidiary Alliance (Wellesley)',detail:'Indian states had to: 1. Keep a British army at their cost. 2. Post a British Resident. 3. Not employ other Europeans. 1st state: Hyderabad (1798).'},
{title:'Doctrine of Lapse (Dalhousie)',detail:'If a ruler of a protected state died without a natural heir, the state would be annexed. Used to annex Satara, Jhansi, Nagpur. This was a major cause of the 1857 Revolt.'}
],
cards:[
{front:'Who introduced the "Subsidiary Alliance"?',back:'Lord Wellesley.'},
{front:'Who introduced the "Doctrine of Lapse"?',back:'Lord Dalhousie.'},
{front:'When did Tipu Sultan die?',back:'1799 (4th Anglo-Mysore War).'},
{front:'Which treaty followed the 1st Anglo-Maratha War?',back:'Treaty of Salbai (1782).'},
{front:'First state to accept the Subsidiary Alliance?',back:'Hyderabad (1798).'}
],
q:[
{q:'Which of the following states was NOT annexed under the Doctrine of Lapse?',options:['Satara','Jhansi','Nagpur','Awadh'],ai:3,exp:'Awadh was annexed in 1856 on grounds of "Misgovernance", not Doctrine of Lapse.'},
{q:'The "Treaty of Seringapatam" was signed after which war?',options:['2nd Mysore War','3rd Mysore War','4th Mysore War','2nd Maratha War'],ai:1,exp:'Tipu Sultan had to cede half his territory to the British and their allies.'},
{q:'The "Peshwa" office was abolished after which war?',options:['1st Maratha War','2nd Maratha War','3rd Maratha War','Anglo-Sikh War'],ai:2,exp:'Lord Hastings defeated the Marathas in 1818 and abolished the title of Peshwa.'},
{q:'Who was the "Tiger of Mysore"?',options:['Hyder Ali','Tipu Sultan','Nanjaraj','Krishna Raja Wodeyar'],ai:1,exp:'Tipu Sultan was famously known by this title.'}
],
hook:'Mysore=Tipu (1799). Maratha=Salbai (1782), Bassein (1802). Sikh=Annexed (1849). Wellesley=Alliance. Dalhousie=Lapse.',
summary:'The four Mysore wars and three Maratha wars. Annexation of Punjab. Comparative study of the Subsidiary Alliance and Doctrine of Lapse. Key treaties and turning points.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Very High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC History Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'History Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Modern History '+d.topic),why:'High-stakes foundation for Modern Indian History.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 36-38 v2 COMPLETE');
}
push();

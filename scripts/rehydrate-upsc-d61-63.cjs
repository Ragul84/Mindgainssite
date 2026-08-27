require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:61,topic:'UPSC History: Mountbatten Plan & Independence',
intro:`Today we study the 'Midnight of Freedom'. Lord Mountbatten was sent with a mandate to transfer power by June 1948, but the communal fire forced him to advance the date to August 15, 1947. We study the 'June 3rd Plan', the 'Boundary Commission' of Radcliffe, and the birth of two nations—India and Pakistan. For UPSC, focus on 'Why partition became inevitable' and the provisions of the Indian Independence Act 1947. This is the climax of our freedom struggle.`,
notes:[
{title:'Mountbatten Plan (June 3rd, 1947)',detail:'Proposed the partition of India into two dominions. Bengal and Punjab assemblies to vote on partition. Princely states could choose to join either dominion or stay independent (later revised).'},
{title:'Indian Independence Act 1947',detail:'Based on the Mountbatten Plan. Abolished the title of "Emperor of India". British rule to end on Aug 15, 1947. Sovereignty of the British Parliament over India to cease.'},
{title:'Radcliffe Line',detail:'Sir Cyril Radcliffe chaired the Boundary Commission. He had never visited India and drew the borders in just 5 weeks, leading to massive confusion and violence during migration.'},
{title:'The Price of Freedom',detail:'Massive communal riots, migration of 10-15 million people, and the tragic death of nearly 1 million. Gandhi was in Noakhali (Bengal) trying to stop the violence while India celebrated.'},
{title:'First Government',detail:'Governor-General: Lord Mountbatten (remained at India\'s request). PM: Jawaharlal Nehru. Deputy PM/Home: Sardar Patel.'}
],
cards:[
{front:'What was the "June 3rd Plan"?',back:'The Mountbatten Plan for the partition of India.'},
{front:'Who drew the boundary between India and Pakistan?',back:'Sir Cyril Radcliffe.'},
{front:'When was the Indian Independence Act passed?',back:'July 1947.'},
{front:'Who was the 1st Governor-General of independent India?',back:'Lord Mountbatten.'},
{front:'Who was the 1st Indian Governor-General?',back:'C. Rajagopalachari.'}
],
q:[
{q:'The "Mountbatten Plan" primarily concerned:',options:['Constitutional reforms','Partition of India','Educational policy','Military reorganization'],ai:1,exp:'It laid out the final procedure for the creation of India and Pakistan.'},
{q:'Who among the following was NOT a member of the Boundary Commission?',options:['Cyril Radcliffe','Jawaharlal Nehru','Muslim League representatives','INC representatives'],ai:1,exp:'Radcliffe chaired it; members were judges nominated by INC and League.'},
{q:'Which of the following was abolished by the 1947 Act?',options:['Office of Secretary of State','Federal Court','RBI','INC'],ai:0,exp:'The office of SOS for India was abolished as India became sovereign.'},
{q:'Who was the Prime Minister of Britain during India\'s independence?',options:['Winston Churchill','Clement Attlee','Ramsay MacDonald','Neville Chamberlain'],ai:1,exp:'Clement Attlee (Labour Party) oversaw the transfer of power.'}
],
hook:'1947=Independence. June 3=Mountbatten Plan. Radcliffe=Borders. Attlee=British PM. 15 Aug=Midnight. Sovereignty achieved.',
summary:'Analysis of the Mountbatten Plan and Independence Act. Detailed account of the Partition process and the Radcliffe commission. Impact of communal violence and the birth of two nations.'},

{day:62,topic:'UPSC History: Post-Independence Integration & Nehru Era',
intro:`Today we study the 'Building of a Republic'. After 1947, India faced the massive challenge of integrating 560+ Princely States and framing a Constitution. We study the role of Sardar Patel (The Iron Man), the linguistic reorganization of states, and the 'Nehruvian Era' of planned development and non-alignment. For UPSC, focus on the 'Integration of Junagadh, Hyderabad, and Kashmir' and the 'Panchsheel Principles'. This is the foundation of Modern India.`,
notes:[
{title:'Integration of Princely States',detail:'Sardar Patel and V.P. Menon used "Carrot and Stick" policy. Most joined via "Instrument of Accession". Junagadh: Plebiscite. Hyderabad: Operation Polo (Military action). Kashmir: Accession signed after tribal invasion.'},
{title:'Linguistic Reorganization',detail:'Demand for states based on language. 1. Dhar Commission/JVP Committee (rejected). 2. Potti Sriramulu death (led to 1st state Andhra 1953). 3. Fazl Ali Commission (States Reorganization Act 1956).'},
{title:'The Nehruvian Era (1947–1964)',detail:'Five-Year Plans (Harrod-Domar and Mahalanobis models). Foundation of IITs, IIMs, and heavy industries (Bhilai, Durgapur). Focus on "Socialist pattern of society".'},
{title:'Foreign Policy (Non-Alignment)',detail:'NAM founded at Bandung Conference (1955). Panchsheel (1954): 5 principles of peaceful co-existence with China. India as a moral voice in the Cold War.'},
{title:'Social & Legal Reforms',detail:'Hindu Code Bill (1955-56) - gave rights to women. Adoption of the Constitution (Jan 26, 1950) making India a Republic.'}
],
cards:[
{front:'Who is the "Iron Man of India"?',back:'Sardar Vallabhbhai Patel.'},
{front:'What was "Operation Polo"?',back:'Military action to integrate Hyderabad (1948).'},
{front:'First linguistic state of India?',back:'Andhra State (1953).'},
{front:'What are "Panchsheel" principles?',back:'5 principles of peaceful co-existence with China (1954).'},
{front:'Who chaired the States Reorganization Commission (1953)?',back:'Fazl Ali.'}
],
q:[
{q:'The "Instrument of Accession" was related to:',options:['Election of President','Integration of Princely States','Formation of ministries','Tax collection'],ai:1,exp:'Legal document signed by rulers to join India or Pakistan.'},
{q:'Operation Polo was launched against which princely state?',options:['Junagadh','Kashmir','Hyderabad','Bhopal'],ai:2,exp:'Launched in 1948 after the Nizam refused to join India.'},
{q:'The "Mahalanobis Model" of development was used in which 5-year plan?',options:['First','Second','Third','Fourth'],ai:1,exp:'Focused on heavy industrialization (1956-61).'},
{q:'Who was the "Political Mentor" of Sardar Patel?',options:['Gandhi','Tilak','Gokhale','Dadabhai Naoroji'],ai:0,exp:'Patel was a staunch follower of Gandhi and his methods.'}
],
hook:'Patel=Integration. Hyderabad=Operation Polo. Andhra=1st Linguistic state. 1950=Republic. Nehru=Planning/NAM. Fazl Ali=1956.',
summary:'The process of national integration under Patel. Linguistic reorganization of states. Economic and foreign policy during the Nehru era. Social reforms and the adoption of the Constitution.'},

{day:63,topic:'UPSC REVISION: Modern India (Full Recap)',
intro:`Today we wrap up 'Modern Indian History'. You have traveled from the arrival of Vasco da Gama to the building of the Indian Republic. You have witnessed the transition from colonial exploitation to national awakening and the final triumph of freedom. This is the most heavily weighted section of UPSC Prelims. Today is for 'Synthesizing the Flow'. Let's master the timeline of Acts, Pacts, and Leaders one last time.`,
notes:[
{title:'Master Timeline: 1757 to 1947',detail:'1757-1857: Conquest & Consolidaiton. 1858-1885: Birth of Nationalism. 1885-1905: Moderates. 1905-1915: Extremists. 1915-1947: Gandhian Era.'},
{title:'Constitutional Evolution',detail:'Regulating Act (1773) -> 1833 (GG India) -> 1858 (Crown) -> 1919 (Dyarchy) -> 1935 (Autonomy) -> 1947 (Sovereignty).'},
{title:'Economic Critique Drill',detail:'Naoroji (Drain), R.C. Dutt (Economic History), G.V. Joshi. Key terms: Home Charges, Commercialization of Agri, De-industrialization.'},
{title:'Organizational Mapping',detail:'Brahmo Samaj (RRM Roy), Arya Samaj (Dayanand), INC (Hume), Muslim League (Salimullah), Ghadar (Hardayal), INA (Bose).'},
{title:'Pacts & Treaties Recap',detail:'Allahabad (1765), Seringapatam (1792), Salbai (1782), Lucknow (1916), Gandhi-Irwin (1931), Poona (1932).'}
],
cards:[
{front:'Chronology: Plassey, 1857, INC, Partition of Bengal?',back:'Plassey (1757) -> 1857 -> INC (1885) -> Partition of Bengal (1905).'},
{front:'Father of Civil Services?',back:'Cornwallis.'},
{front:'Father of Local Self Gov?',back:'Ripon.'},
{front:'First Viceroy?',back:'Canning.'},
{front:'Founder of Satyashodhak Samaj?',back:'Jyotiba Phule.'}
],
q:[
{q:'Which of the following acts for the first time separated the Legislative and Executive functions of the GG?',options:['1813','1833','1853','1858'],ai:2,exp:'The Charter Act of 1853 created a separate 12-member Legislative Council.'},
{q:'Who among the following was the founder of the "Indian Association"?',options:['S.N. Banerjee','Dadabhai Naoroji','Ferozeshah Mehta','W.C. Bonnerjee'],ai:0,exp:'Founded in 1876, it was the precursor to the INC.'},
{q:'The "Ilbert Bill" controversy occurred during the tenure of:',options:['Lytton','Ripon','Dufferin','Curzon'],ai:1,exp:'It proposed giving Indian judges power to try Europeans, leading to a white backlash.'},
{q:'In which session did the INC split into Moderates and Extremists?',options:['Calcutta 1906','Surat 1907','Lahore 1909','Lucknow 1916'],ai:1,exp:'The Surat Split happened due to ideological differences.'}
],
hook:'History complete. 1757=Conquest. 1857=Revolt. 1885=INC. 1915=Gandhi. 1947=Independence. 1950=Republic. Master the flow.',
summary:'Comprehensive revision of the entire Modern Indian History syllabus. High-speed chronology drills. Comparison of various administrative and social reform movements. Final Modern History mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC History Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'History Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Modern History '+d.topic),why:'Final mastery of the Modern India syllabus.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:36,topic:'TNPSC Unit 9: Social Justice & Periyar',
intro:`Today we study the 'Ideology of Equality'. Social Justice is the backbone of Tamil Nadu's governance. In TNPSC, 'Periyar E.V. Ramasamy' and the 'Self-Respect Movement' are central. From the Vaikom Satyagraha to the 'Kudi Arasu' journal—this is the foundation of Unit 9. Do you know why Periyar is called 'Vaikom Hero'? Let's master the rationalist history today.`,
notes:[
{title:'Periyar E.V. Ramasamy',detail:'Founder of Self-Respect Movement (1925). Known as "Thanthai Periyar". Fought against caste and for women\'s rights.'},
{title:'Vaikom Satyagraha (1924)',detail:'Fought for the right of untouchables to walk on roads near Vaikom temple (Kerala). Periyar\'s leadership earned him the title "Vaikom Veerar".'},
{title:'Self-Respect Movement',detail:'Objectives: Removal of caste, Self-respect marriages (without Brahmin priests), Women empowerment. Slogan: "No God, No Religion, No Caste".'},
{title:'Journals & Books',detail:'Kudi Arasu (Main journal), Revolt, Puratchi, Viduthalai. Book: "Why Women were Enslaved?".'},
{title:'UNESCO Citation (1970)',detail:'"Prophet of a New Age, Socrates of South East Asia".'}
],
cards:[
{front:'"Vaikom Veerar" title belongs to?',back:'Periyar E.V.R.'},
{front:'Year of Self-Respect Movement?',back:'1925.'},
{front:'Main journal of Periyar?',back:'Kudi Arasu.'},
{front:'"Socrates of SE Asia" title by?',back:'UNESCO (1970).'},
{front:'Where was the first Self-Respect Conference?',back:'Chengalpattu (1929).'}
],
q:[
{q:'In which year did Periyar start the "Self-Respect Movement"?',options:['1916','1924','1925','1944'],ai:2,exp:'Started after leaving the Congress over communal representation issues.'},
{q:'"Kudi Arasu" was a weekly journal published by:',options:['C.N. Annadurai','Periyar','Bharathidasan','M.C. Rajah'],ai:1,exp:'It was the mouthpiece of the Self-Respect movement.'},
{q:'Periyar was awarded the title "Vaikom Veerar" for his role in:',options:['Vaikom Satyagraha','Justice Party','Dravida Kazhagam','Self-Respect Marriages'],ai:0,exp:'He led the movement when local leaders were arrested.'},
{q:'The first provincial conference of the Self-Respect Movement was held at:',options:['Erode','Chengalpattu','Salem','Madras'],ai:1,exp:'Held in 1929 under W.P.A. Soundrapandian.'}
],
hook:'Periyar=1925. Kudi Arasu=Journal. Vaikom=Veerar. Chengalpattu=1929. Socrates=UNESCO.',
summary:'Philosophy and contributions of Thanthai Periyar. Significance of the Self-Respect Movement in TN history. List of journals and literary works by Periyar. Analysis of the Vaikom Satyagraha.'},

{day:37,topic:'TNPSC Unit 9: Justice Party & Dravidian Movement',
intro:`Today we study the 'Political Revolution'. The Justice Party (South Indian Liberal Federation) paved the way for social changes in Madras Presidency. In TNPSC, 'Justice Party Achievements' (Mid-day meal, Hindu Religious Endowment Act) are high-yield. We also look at the transition to 'Dravida Kazhagam'. Do you know who was the first Premier of Madras? Let's master the Dravidian timeline today.`,
notes:[
{title:'Justice Party (SILF)',detail:'Founded in 1916 by T.M. Nair, P. Theagaraya Chetty, and C. Natesa Mudaliar. Published "Justice" (English), "Dravidan" (Tamil).'},
{title:'Elections & Power',detail:'Won the 1st elections under Dyarchy (1920). First Premier: A. Subbarayulu Reddiar. Later: Raja of Panagal.'},
{title:'Landmark Achievements',detail:'1. Communal G.O. (1921/22 - Reservation). 2. Staff Selection Board (1924). 3. Hindu Religious Endowment Act (1926). 4. Women\'s Voting Rights (1921).'},
{title:'Mid-day Meal Scheme',detail:'First introduced in Madras Corporation schools (1923) by P. Theagaraya Chetty.'},
{title:'Dravida Kazhagam (DK)',detail:'Justice Party renamed to DK in Salem Conference (1944) by Periyar, following Annadurai\'s resolution.'}
],
cards:[
{front:'Year of Justice Party formation?',back:'1916.'},
{front:'First Premier of Madras?',back:'A. Subbarayulu Reddiar.'},
{front:'Who introduced Mid-day meal in 1923?',back:'P. Theagaraya Chetty.'},
{front:'Year of Hindu Religious Endowment Act?',back:'1926.'},
{front:'When did DK form (Salem)?',back:'1944.'}
],
q:[
{q:'"South Indian Liberal Federation" is popularly known as:',options:['Congress','Justice Party','Dravida Kazhagam','DMK'],ai:1,exp:'Founded in 1916 to represent non-Brahmins.'},
{q:'The "Staff Selection Board" was established by the Justice Party in:',options:['1920','1924','1926','1929'],ai:1,exp:'Later became the Public Service Commission.'},
{q:'In which conference was the Justice Party renamed as "Dravida Kazhagam"?',options:['Erode','Chengalpattu','Salem','Madurai'],ai:2,exp:'1944 conference under Periyar.'},
{q:'Who among the following was a founder of the Justice Party?',options:['Periyar','C.N. Annadurai','C. Natesa Mudaliar','K. Kamaraj'],ai:2,exp:'One of the three pillars of SILF.'}
],
hook:'Justice=1916. Subbarayulu=1st Premier. 1924=SSB. 1926=HRE Act. 1944=DK (Salem). Mid-day meal=1923.',
summary:'Origins and objectives of the Justice Party. Key legislative achievements of the Justice Party governments. Transition of non-Brahmin politics into the Dravidian movement. Formation of Dravida Kazhagam.'},

{day:38,topic:'TNPSC Unit 9: Reservation Policy & Social Harmony',
intro:`Today we study the 'Shield of Social Justice'. Tamil Nadu has a unique reservation model (69%) protected by the 9th Schedule. In TNPSC, 'Bakthavatsalam Commission', 'Sattanathan Commission', and 'Ambasankar Commission' are high-yield. Do you know which amendment protected TN's reservation? Let's master the policy today.`,
notes:[
{title:'Evolution of Reservation',detail:'Communal G.O. (1921). After Champakam Dorairajan case (1951), 1st Constitutional Amendment added Art 15(4) to allow reservation.'},
{title:'Reservation Commissions',detail:'1. Sattanathan (1970 - 1st BC Commission). 2. Ambasankar (1982). 3. Janarthanam.'},
{title:'The 69% Model',detail:'Current breakup: BC (30%), MBC (20%), SC (18%), ST (1%). MBC includes DNT.'},
{title:'76th Constitutional Amendment',detail:'Passed in 1994 (under J. Jayalalithaa) to place TN\'s 69% reservation in the 9th Schedule (beyond judicial review).'},
{title:'Social Harmony',detail:'Tamil Nadu ranks high in social development due to the Inclusive Growth model and pluralistic culture.'}
],
cards:[
{front:'Current TN Reservation %?',back:'69%.'},
{front:'First BC Commission of TN?',back:'Sattanathan Commission (1970).'},
{front:'Amendment for 9th Schedule protection?',back:'76th Amendment (1994).'},
{front:'Art 15(4) was added by?',back:'1st Amendment (1951).'},
{front:'MBC reservation % in TN?',back:'20%.'}
],
q:[
{q:'Which constitutional amendment protected Tamil Nadu\'s 69% reservation policy?',options:['42nd','69th','76th','81st'],ai:2,exp:'Placed it in the 9th Schedule in 1994.'},
{q:'The "Sattanathan Commission" (1970) was related to:',options:['Education','Agriculture','Backward Classes','Health'],ai:2,exp:'First BC commission appointed by the DMK government.'},
{q:'Tamil Nadu\'s reservation policy was a response to the Supreme Court judgment in:',options:['Kesavananda Bharati','Champakam Dorairajan','Minerva Mills','Golaknath'],ai:1,exp:'Led to the 1st Constitutional Amendment.'},
{q:'What is the percentage of reservation for "Scheduled Castes" in TN?',options:['15%','18%','20%','1%'],ai:1,exp:'Part of the 69% total.'}
],
hook:'69%=TN. 76th Amend=9th Sch. Sattanathan=1970. 1st Amend=1951. MBC=20%. SC=18%.',
summary:'History and legal evolution of reservation in Tamil Nadu. Detailed study of various Backward Class commissions. Significance of the 76th Amendment and the 9th Schedule protection.'},

{day:39,topic:'TNPSC Unit 9: Education & Health in TN',
intro:`Today we study the 'Human Development Capital'. Tamil Nadu is a leader in Education and Health in India. In TNPSC, 'Gross Enrollment Ratio (GER)', 'NEET issues', and 'TN Health Model' are high-yield. Do you know which state has the highest GER in Higher Education? Let's master the human indicators today.`,
notes:[
{title:'Education Milestones',detail:'K. Kamaraj (Kingmaker) introduced Mid-day meals (1956). MGR introduced Nutritious Meal Scheme (1982). High GER (Higher Ed) ~51.4%.'},
{title:'Health Infrastructure',detail:'3-tier system: PHC, District Hospitals, Medical Colleges. 1st State to enact "Right to Health".'},
{title:'Health Indicators',detail:'Infant Mortality Rate (IMR) and Maternal Mortality Ratio (MMR) are significantly lower than the national average.'},
{title:'Samacheer Kalvi',detail:'Uniform system of school education introduced to bridge the gap between different streams.'},
{title:'Important Schemes',detail:'Moovalur Ramamirtham (Higher ed for girls), Illam Thedi Kalvi (Post-pandemic education).'}
],
cards:[
{front:'Who introduced Mid-day meal in 1956?',back:'K. Kamaraj.'},
{front:'Nutritious Meal Scheme year?',back:'1982 (MGR).'},
{front:'Higher Ed GER of TN?',back:'~51.4% (Highest in India).'},
{front:'"Illam Thedi Kalvi" objective?',back:'Learning at doorstep (COVID recovery).'},
{front:'TN ranks ? in Health Index (NITI Aayog)?',back:'Top performing state.'}
],
q:[
{q:'Who expanded the Mid-day meal into the "Nutritious Meal Scheme" in 1982?',options:['Kamaraj','Annadurai','M.G. Ramachandran','M. Karunanidhi'],ai:2,exp:'It significantly improved school attendance and nutrition.'},
{q:'What is the Gross Enrollment Ratio (GER) of Tamil Nadu in higher education (approx)?',options:['25%','35%','51%','10%'],ai:2,exp:'Nearly double the national average.'},
{q:'The "Moovalur Ramamirtham Ammaiyar" scheme now provides:',options:['Marriage assistance','Higher education assistance for girls','Housing','Laptops'],ai:1,exp:'Recently revamped into a monthly incentive for girls pursuing higher education.'},
{q:'Tamil Nadu was the first state to introduce which school system?',options:['CBSE','Samacheer Kalvi','Navodaya','Sainik'],ai:1,exp:'Uniform system of education.'}
],
hook:'Kamaraj=Mid-day. MGR=Nutritious. GER=51%. Health=Top. Illam Thedi Kalvi=Doorstep. Samacheer=Uniform.',
summary:'Overview of Tamil Nadu\'s educational achievements and GER. Success of the noon-meal and nutritious meal schemes. Analysis of health infrastructure and performance indicators.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC Unit 9 Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'TN Admin Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Unit 9 '+d.topic),why:'Mastering TN administration for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Unit 9',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

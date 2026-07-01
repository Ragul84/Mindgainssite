require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:8,topic:'TNPSC General Tamil: திருக்குறள் (Thirukkural Overview)',
intro:`Today we study the 'World Common Law' (Ulaga Podhumarai)—Thirukkural. Composed by Thiruvalluvar, this masterpiece is the soul of Tamil ethics. It is divided into 3 sections (Aram, Porul, Inbam), 133 chapters (Adhikarams), and 1330 couplets. For TNPSC, you must know the structure, the various names given to the book, and the meaning of key Kurals prescribed in the Samacheer syllabus. This is the only book that can get you marks in both General Tamil AND General Studies (Unit 8).`,
notes:[
{title:'Thirukkural Structure',detail:'3 Sections (Paal): 1. Arathuppaal (38 chapters - Virtue). 2. Porutpaal (70 chapters - Wealth/Politics). 3. Kamathuppaal (25 chapters - Love). Total 133 Adhikarams, 1330 Kurals.'},
{title:'Valluvar & Names',detail:'Thiruvalluvar names: Deiva Pulavar, Poyyamozhi Pulavar, Maadhaanubangi. Book names: Ulaga Podhumarai, Tamil Mara, Muppaal, Uttharavedham, Deivannool.'},
{title:'Key Adhikarams for TNPSC',detail:'TNPSC focuses on specific themes: Anbudaimai (Love), Iniyavai Koorald (Speaking sweet words), Seinandri Arithal (Gratitude), Adakkamudaimai (Self-control), Oppuravaridhal (Helpfulness).'},
{title:'Translators of Kural',detail:'English: G.U. Pope (1886), Drew, Lazarus. Latin: Constantius Joseph Beschi (Veeramamunivar). Kural has been translated into more than 107 languages.'},
{title:'Tiruvalluvar Year',detail:'Calculated by adding 31 to the current AD year (e.g., 2024 + 31 = 2055 Thiruvalluvar Year). The TN govt officially uses this.'}
],
cards:[
{front:'How many Kurals and Adhikarams?',back:'1330 Kurals and 133 Adhikarams.'},
{front:'Total chapters in Arathuppaal (Virtue)?',back:'38 chapters.'},
{front:'Who translated Kural into English in 1886?',back:'G.U. Pope.'},
{front:'Other name for Thirukkural?',back:'Ulaga Podhumarai / Muppaal / Tamil Marai.'},
{front:'How many chapters in Porutpaal (Politics)?',back:'70 chapters.'}
],
q:[
{q:'திருக்குறளில் உள்ள மொத்த அதிகாரங்களின் எண்ணிக்கை எவ்வளவு?',options:['133','1330','13','107'],ai:0,exp:'133 Adhikarams, each with 10 Kurals, totaling 1330.'},
{q:'திருக்குறளை ஆங்கிலத்தில் மொழிபெயர்த்தவர் யார்?',options:['வீரமாமுனிவர்','ஜி.யு.போப்','கால்டுவெல்','எல்லிஸ்'],ai:1,exp:'G.U. Pope translated it to English. Veeramamunivar translated it to Latin.'},
{q:'திருவள்ளுவர் ஆண்டு எதனைக் கொண்டு கணக்கிடப்படுகிறது?',options:['AD + 30','AD + 31','AD + 78','AD - 31'],ai:1,exp:'Add 31 years to the English calendar year.'},
{q:'அறத்துப்பாலில் உள்ள அதிகாரங்களின் எண்ணிக்கை யாது?',options:['38','70','25','133'],ai:0,exp:'Arathuppaal 38, Porutpaal 70, Kamathuppaal 25.'}
],
hook:'133 Adhikarams. 1330 Kurals. Aram(38), Porul(70), Inbam(25). G.U. Pope=English. Veeramamunivar=Latin. AD+31=Valluvar Year.',
summary:'Detailed structure of Thirukkural. Various names of the author and the book. Significance of the three sections. Famous translators and global impact.'},

{day:9,topic:'TNPSC History: Sangam Literature Deep Dive',
intro:`Today we go beyond the names and dive into the actual 'Texts' of the Sangam Age. We focus on the 'Ettuthokai' (8 Anthologies) and 'Pattuppattu' (10 Idyls). These works are the primary source for understanding the life, warfare, and love of ancient Tamils. TNPSC frequently asks for the number of songs in a book, the author of specific lines, or the 'Akam vs Puram' classification. This is the scholarly base of Tamil identity.`,
notes:[
{title:'Ettuthokai (8 Anthologies)',detail:'1. Natrinai. 2. Kurunthokai. 3. Akananuru. 4. Purananuru. 5. Pathitrupathu. 6. Kalithokai. 7. Aingurunuru. 8. Paripaadal. Note: Purananuru and Pathitrupathu are PURAM (History/War). Paripaadal is both Akam and Puram. Others are AKAM (Love).'},
{title:'Pattuppattu (10 Idyls)',detail:'Includes: 1. Thirumurugatrupadai (on Lord Murugan). 2. Porunaratrupadai. 3. Sirupanatrupadai. 4. Perumpanatrupadai. 5. Mullaippaattu (shortest). 6. Maduraikanchi (longest). 7. Nedunalvaadai. 8. Kurinchippaattu. 9. Pattinappaalai. 10. Malaipadukadaam.'},
{title:'Atrupadai Literature',detail:'A genre where a poet/artist who has received gifts from a king guides another artist to the same king. "Atrupadai" means "showing the way".'},
{title:'Purananuru (புறநானூறு)',detail:`A compilation of 400 songs on external life (War, Kings, Bravery, Charity). It is the "Mirror of Tamil History". Famous line: "Yadhum Oore Yavarum Kelir" (Kaniyan Pungundranar).`},
{title:'Pathinen Keelkanakku (Minor 18)',detail:'Composed in the post-Sangam (Didactic) period. Mostly focused on morals/ethics. Includes Thirukkural, Naaladiyar, Inna Narpathu, Iniyavai Narpathu.'}
],
cards:[
{front:'Shortest book in Pattuppattu?',back:'Mullaippaattu (103 lines).'},
{front:'Longest book in Pattuppattu?',back:'Maduraikanchi (782 lines).'},
{front:'Which Ettuthokai book is exclusively about Chera kings?',back:'Pathitrupathu (பதிற்றுப்பத்து).'},
{front:'Who said "Yadhum Oore Yavarum Kelir"?',back:'Kaniyan Pungundranar (in Purananuru).'},
{front:'Meaning of "Atrupadai" (ஆற்றுப்படை)?',back:'Showing the way (to a patron/king).'}
],
q:[
{q:'"யாதும் ஊரே யாவரும் கேளிர்" - இப்பாடல் வரி இடம்பெற்றுள்ள நூல் எது?',options:['அகநானூறு','புறநானூறு','நற்றிணை','குறுந்தொகை'],ai:1,exp:'This universal thought is from Purananuru, written by Kaniyan Pungundranar.'},
{q:'பத்துப்பாட்டில் மிகச்சிறிய நூல் எது?',options:['மதுரைக்காஞ்சி','குறிஞ்சிப்பாட்டு','முல்லைப்பாட்டு','பட்டினப்பாலை'],ai:2,exp:'Mullaippaattu is the shortest with 103 lines.'},
{q:'சேர மன்னர்களைப் பற்றி மட்டும் பாடும் எட்டுத்தொகை நூல் எது?',options:['பதிற்றுப்பத்து','புறநானூறு','நற்றிணை','பரிபாடல்'],ai:0,exp:'Pathitrupathu exclusively praises 10 Chera kings (80 songs survive).'},
{q:'அகமும் புறமும் கலந்த எட்டுத்தொகை நூல் எது?',options:['கலித்தொகை','நற்றிணை','பரிபாடல்','ஐங்குறுநூறு'],ai:2,exp:'Paripaadal contains both love and historical themes.'}
],
hook:'Mullaippaattu=Shortest. Maduraikanchi=Longest. Pathitrupathu=Cheras. Purananuru=History/War. Atrupadai=Guiding to king.',
summary:'Analysis of Ettuthokai and Pattuppattu. Classification of Akam and Puram works. Detailed study of Purananuru and Pathitrupathu. Introduction to the Didactic period.'},

{day:10,topic:'TNPSC History: Post-Sangam & The Five Epics',
intro:`Today we study the 'Great Epics' (Kapiyangal) of Tamil. After the Sangam age came the period of 'Aimperum Kaapiyangal' (The 5 Great Epics). We focus on the twin epics: Silappatikaram and Manimekalai. These are not just stories; they are social documents that reflect the rise of Jainism and Buddhism in Tamil Nadu. For TNPSC, knowing the authors, the storylines of Kannagi and Manimekalai, and the unique titles of these books is vital. Let's master the 'Epic Era' today.`,
notes:[
{title:'Aimperum Kaapiyangal (The 5 Epics)',detail:'1. Silappatikaram (Ilango Adigal). 2. Manimekalai (Seethalai Sathanar). 3. Civaka Cintamani (Thirutthakka Devar). 4. Valayapathi. 5. Kundalakesi. First three are Jain/Buddhist works.'},
{title:'Silappatikaram (The Anklet)',detail:'Author: Ilango Adigal (Chera prince). Theme: Kannagi\'s justice for husband Kovalan. Unique titles: Mutthamizh Kaapiyam, Kudimakkal Kaapiyam (First epic of the common people). It spans 3 capitals: Puhar, Madurai, Vanji.'},
{title:'Manimekalai',detail:'Author: Seethalai Sathanar. Protagonist: Manimekalai (daughter of Kovalan & Madhavi). Theme: Her journey to becoming a Buddhist nun. It is a "Religious Epic" (Buddhism).'},
{title:'The Twin Epics (இரட்டைக்காப்பியங்கள்)',detail:'Silappatikaram and Manimekalai are called twin epics because their stories are linked (mother-daughter relation) and they reflect the same historical era.'},
{title:'Civaka Cintamani',detail:'Author: Thirutthakka Devar (Jain monk). First epic to use "Virutha Pa" meter. It describes the life and marriages of Prince Civaka.'}
],
cards:[
{front:'Author of Silappatikaram?',back:'Ilango Adigal.'},
{front:'Author of Manimekalai?',back:'Seethalai Sathanar.'},
{front:'Which epic is called "குடிமக்கள் காப்பியம்" (Epic of the commoners)?',back:'Silappatikaram.'},
{front:'What are the "Twin Epics"?',back:'Silappatikaram and Manimekalai.'},
{front:'Religious affiliation of Manimekalai?',back:'Buddhism.'}
],
q:[
{q:'"சிலப்பதிகாரம்" யாரால் இயற்றப்பட்டது?',options:['சீத்தலைச் சாத்தனார்','திருத்தக்கத் தேவர்','இளங்கோவடிகள்','கம்பர்'],ai:2,exp:'Ilango Adigal, a Chera prince turned monk, wrote Silappatikaram.'},
{q:'இரட்டைக்காப்பியங்கள் என அழைக்கப்படுபவை எவை?',options:['வளையாபதி, குண்டலகேசி','சிலப்பதிகாரம், மணிமேகலை','கம்பராமாயணம், மகாபாரதம்','நாலடியார், திருக்குறள்'],ai:1,exp:'Silappatikaram and Manimekalai are linked stories and called twin epics.'},
{q:'பௌத்த மதக் கருத்துக்களைக் கூறும் காப்பியம் எது?',options:['சிலப்பதிகாரம்','மணிமேகலை','சீவகசிந்தாமணி','குண்டலகேசி'],ai:1,exp:'Manimekalai is a purely Buddhist epic.'},
{q:'"முத்தமிழ்க் காப்பியம்" என அழைக்கப்படும் நூல்?',options:['சிலப்பதிகாரம்','மணிமேகலை','பெரியபுராணம்','சீவகசிந்தாமணி'],ai:0,exp:'Silappatikaram is praised as Mutthamizh Kaapiyam for its combination of Iyal, Isai, and Nadakam.'}
],
hook:'Silappatikaram=Ilango. Manimekalai=Sathanar. Twin Epics=Silampu+Mani. Silappatikaram=Kudimakkal Kaapiyam. Manimekalai=Buddhism.',
summary:'Study of the 5 Great Epics. Detailed analysis of Silappatikaram and Manimekalai. The concept of Twin Epics. Social and religious history reflected in literature.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🎯 TNPSC Literature Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Literature Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC General Tamil '+d.topic),why:'In-depth literary analysis for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('TNPSC Days 8-10 v2 COMPLETE');
}
push();

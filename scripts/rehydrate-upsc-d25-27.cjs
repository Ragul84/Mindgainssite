require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:25,topic:'UPSC History: Post-Mauryan Period & Kushanas',
intro:`Today we study the period of 'Transition and Fusion'. After the decline of the Mauryas, India saw the rise of local dynasties like the Shungas and Satavahanas, and the arrival of foreigners like the Indo-Greeks and Kushanas. This era is most famous for its 'Artistic Explosion'—the birth of the Gandhara and Mathura schools of art. For UPSC, focus on the reign of Kanishka, the 4th Buddhist Council, and the development of Mahayana Buddhism. This is where Indian art begins to represent Buddha in human form.`,
notes:[
{title:'Native Dynasties',detail:'Shungas: Pushyamitra Shunga (revived Brahmanism). Satavahanas: Deccan region, led by Gautamiputra Satakarni. They issued Lead coins and started Land Grants to Brahmins. Sangam Dynasties: Cheras, Cholas, Pandyas in the deep South.'},
{title:'Foreign Dynasties',detail:'Indo-Greeks: Menander (Milinda-panha). Kushanas: Kanishka (78 AD - start of Saka Era). Kanishka\'s capital: Purushpura (Peshawar). He was a great patron of Buddhism.'},
{title:'Mahayana Buddhism',detail:'Emerged during this period. Features: Idol worship of Buddha, Bodhisattvas (compassionate beings who delay nirvana), use of Sanskrit instead of Pali. Supported by Kanishka.'},
{title:'Schools of Art',detail:'Gandhara School: Greek influence (Apollo-like Buddha), bluish-grey schist stone. Mathura School: Indigenous, red sandstone, cheerful Buddha. Amravati School: White marble, focus on narrative scenes (Jataka tales), Satavahana patronage.'},
{title:'Economic Links',detail:'Rise of the "Silk Route" (Kushanas controlled it). Trade with Rome (spices, silk, gold). Growth of Guilds (Shrenis).'}
],
cards:[
{front:'Who started the "Saka Era" in 78 AD?',back:'Kanishka (Kushana dynasty).'},
{front:'What stone was used in Mathura School of Art?',back:'Red Sandstone.'},
{front:'What is "Milinda-panha"?',back:'A dialogue between Indo-Greek king Menander and Buddhist monk Nagasena.'},
{front:'Who was the greatest Satavahana ruler?',back:'Gautamiputra Satakarni.'},
{front:'Gandhara Art is a blend of which two styles?',back:'Indian and Greek/Hellenistic.'}
],
q:[
{q:'Which of the following dynasties started the practice of "Land Grants" to Brahmins and Buddhist monks?',options:['Mauryas','Kushanas','Satavahanas','Guptas'],ai:2,exp:'The Satavahanas in the Deccan were the first to record land grants to religious groups.'},
{q:'The "Silk Route" was controlled and protected by which dynasty in India?',options:['Mauryas','Shungas','Kushanas','Guptas'],ai:2,exp:'Kanishka and the Kushanas controlled the strategic trade routes connecting China and Rome.'},
{q:'Mahayana Buddhism is distinguished by which of the following?',options:['Emphasis on the Middle Path','Belief in Bodhisattvas','Use of Pali language','Rejection of Idol worship'],ai:1,exp:'Mahayana Buddhism introduced the concept of Bodhisattvas and the idol worship of Buddha.'},
{q:'The Amravati School of Art was characterized by the use of:',options:['Grey Schist','Red Sandstone','White Marble','Terracotta'],ai:2,exp:'White marble and the depiction of narrative "Jataka" stories were hallmarks of Amravati art.'}
],
hook:'73 AD=Saka Era (Kanishka). Mathura=Red Sandstone. Gandhara=Greek-like Buddha. Satavahanas=Lead coins/Land grants. Menander=Milinda-panha.',
summary:'Native and foreign dynasties of the post-Mauryan era. Kushana empire and Kanishka\'s contribution. Development of Mahayana Buddhism. Comparison of Gandhara, Mathura, and Amravati schools of art.'},

{day:26,topic:'UPSC History: The Gupta Empire — The Golden Age',
intro:`Today we study the 'Classical Age' of Indian History—the Guptas. This was a period of political stability, economic prosperity, and an unparalleled peak in literature, science, and art. From the conquests of Samudragupta (Napoleon of India) to the cultural court of Chandragupta II (Vikramaditya), the Guptas defined the 'Standard' of Indian civilization. For UPSC, focus on the 'Navaratnas', the scientific works of Aryabhatta and Varahamihira, and the evolution of temple architecture. This is where the Puranas were finalized.`,
notes:[
{title:'Political History',detail:'Chandragupta I (319 AD): Started Gupta Era. Samudragupta: Prayag Prashasti (written by Harisena) describes his vast conquests. Chandragupta II: Defeated Sakas, Fa-Hien (Chinese traveler) visited his court.'},
{title:'Administration & Economy',detail:'Decentralized (unlike Mauryas). Rise of Feudalism (Samantas). High gold coins (Dinars) but lesser in purity than Kushanas. Decline in urban centers towards the end.'},
{title:'Science & Literature',detail:'Aryabhatta: Aryabhatiyam (Zero, Pi, Earth\'s rotation). Varahamihira: Brihat Samhita (Astronomy). Kalidasa: Shakuntalam, Meghadutam. Vishnu Sharma: Panchatantra. Vatsyayana: Kama Sutra.'},
{title:'Art & Architecture',detail:'Birth of Hindu Temple Architecture (Nagara style begins). Dashavatara Temple (Deogarh). Ajanta Caves (Vakataka/Gupta period paintings). Sultanganj Buddha (Copper statue).'},
{title:'Religion',detail:'Revival of Brahmanism (Bhagavatism). Focus on Bhakti towards Vishnu and Shiva. Final compilation of Puranas and Epics (Ramayana/Mahabharata).'}
],
cards:[
{front:'Who is known as the "Napoleon of India"?',back:'Samudragupta.'},
{front:'Which Chinese traveler visited India during Chandragupta II\'s reign?',back:'Fa-Hien.'},
{front:'Who wrote "Abhigyan Shakuntalam"?',back:'Kalidasa.'},
{front:'What are Gupta gold coins called?',back:'Dinars.'},
{front:'Author of "Aryabhatiyam"?',back:'Aryabhatta.'}
],
q:[
{q:'The "Prayag Prashasti" inscription provides information about the conquests of:',options:['Chandragupta I','Samudragupta','Chandragupta II','Skandagupta'],ai:1,exp:'Written by Harisena, it is engraved on an Ashokan pillar at Allahabad (Prayagraj).'},
{q:'Which Gupta ruler is credited with the defeat of the Hunas?',options:['Samudragupta','Chandragupta II','Skandagupta','Kumaragupta'],ai:2,exp:'Skandagupta (Bhitari Pillar inscription) successfully repulsed the Huna invasions.'},
{q:'The Iron Pillar at Mehrauli is associated with which ruler?',options:['Ashoka','Chandragupta Maurya','Chandragupta II','Harshavardhana'],ai:2,exp:'The Mehrauli pillar is widely attributed to "Chandra", identified as Chandragupta II.'},
{q:'In Gupta society, the decline in the status of women was marked by:',options:['Access to education','The first epigraphic evidence of Sati','Right to property','Active role in administration'],ai:1,exp:'The Eran inscription (510 AD) provides the first evidence of Sati during this period.'}
],
hook:'Samudragupta=Napoleon. Fa-Hien=Gupta traveler. Kalidasa=Navaratna. Aryabhatta=Zero. Nagara Temples begin. Eran=1st Sati record.',
summary:'Political consolidation under the Guptas. Cultural and scientific achievements. Literature and the Navaratnas. Evolution of temple architecture. Religious shifts toward Bhakti.'},

{day:27,topic:'UPSC History: South Indian Kingdoms & Sangam Age',
intro:`Today we look South. While the North saw empires rise and fall, the Deccan and South India developed unique cultural and administrative systems. We study the Sangam Age (Tamil academies) and the great dynasties like the Pallavas, Chalukyas, and Rashtrakutas. For UPSC, the focus is heavily on 'Art & Architecture'—the shore temples of Mahabalipuram, the rock-cut caves of Ellora, and the temple-building rivalry between the Pallavas and Chalukyas. This is the foundation of Dravidian culture.`,
notes:[
{title:'Sangam Age (Tamil Nadu)',detail:'Cheras (Kerala), Cholas (Uraiyur), Pandyas (Madurai). Literature: Ettuthokai, Pattuppattu, Silappatikaram. Social: 5 Landscapes (Thinais). Keezhadi excavations proof of urban culture.'},
{title:'Pallavas of Kanchi',detail:'Greatest: Mahendravarman I, Narasimhavarman I. Architecture: Ratha temples (Mahabalipuram), Shore temple, Kailasanathar temple. They pioneered the Dravidian style.'},
{title:'Chalukyas of Badami',detail:'Pulakeshin II: Defeated Harshavardhana (Aihole inscription). Architecture: Pattadakal (UNESCO site), Aihole (Cradle of Indian temple architecture). Vesara style (blend of North and South).'},
{title:'Rashtrakutas',detail:'Greatest: Dantidurga, Amoghavarsha. Architecture: Kailasa Temple at Ellora (Monolithic - carved out of a single rock by Krishna I). This is a masterpiece of world heritage.'},
{title:'Key Terms (South)',detail:'Eripatti: Land for maintenance of village tank. Ghatika: Educational centers (mostly Brahmins). Ur: General village assembly. Sabhai: Brahmin village assembly.'}
],
cards:[
{front:'Who wrote the "Aihole Inscription"?',back:'Ravikirti (court poet of Pulakeshin II).'},
{front:'Who built the monolithic Kailasa Temple at Ellora?',back:'Krishna I (Rashtrakuta dynasty).'},
{front:'Capital of the Pallavas?',back:'Kanchipuram.'},
{front:'Greatest Chola king of the Sangam Age?',back:'Karikala Chola.'},
{front:'What is "Vesara" style?',back:'A hybrid style of temple architecture blending Nagara (North) and Dravida (South) styles.'}
],
q:[
{q:'The "Shore Temple" at Mahabalipuram was built by which dynasty?',options:['Cholas','Pandyas','Pallavas','Chalukyas'],ai:2,exp:'It was built by the Pallava king Narasimhavarman II (Rajasimha).'},
{q:'The "Aihole Inscription" describes the victory of Pulakeshin II over:',options:['Mahendravarman I','Harshavardhana','Narasimhavarman I','Rajendra Chola'],ai:1,exp:'This is a crucial historical source for the conflict between North and South India.'},
{q:'The Chola kingdom was famous for its:',options:['Cavalry','Naval power & Local Self-Govt','Rock-cut caves','Silk production'],ai:1,exp:'The Cholas (especially the Imperial Cholas later) were masters of the sea and pioneered village assemblies (Uttiramerur).'},
{q:'Which of the following is a monolithic structure?',options:['Sanchi Stupa','Kailasa Temple at Ellora','Shore Temple','Brihadisvara Temple'],ai:1,exp:'The Kailasa temple was carved out of a single mountain of rock.'}
],
hook:'Pallavas=Shore Temple. Rashtrakutas=Ellora. Pulakeshin vs Harsha=Aihole. Dravidian style begins. Sangam=3 academies.',
summary:'The three Sangam kingdoms. Pallava contribution to Dravidian architecture. Chalukya-Pallava rivalry. Rashtrakuta achievements (Ellora). Important administrative terms in South India.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC History Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'History Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Ancient History '+d.topic),why:'Crucial for Art & Culture and dynastical history.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 25-27 v2 COMPLETE');
}
push();

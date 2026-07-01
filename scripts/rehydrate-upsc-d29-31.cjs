require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:29,topic:'UPSC History: Delhi Sultanate — The Five Dynasties',
intro:`Today we enter the 'Medieval' era. After the fall of the Rajputs, North India came under the rule of the Delhi Sultanate (1206–1526). We study the five dynasties: Slave, Khalji, Tughlaq, Sayyid, and Lodi. For UPSC, the focus is not just on wars, but on 'Administrative Innovations' (like Alauddin's market reforms and Muhammad bin Tughlaq's experiments) and 'Indo-Islamic Architecture'. This period saw the synthesis of Persian and Indian styles, giving us monuments like the Qutub Minar.`,
notes:[
{title:'The Five Dynasties',detail:'1. Slave (Mamluk): Qutb-ud-din Aibak, Iltutmish (real founder), Razia (1st woman ruler). 2. Khalji: Alauddin Khalji (Market reforms, Dagh & Chehra). 3. Tughlaq: Ghiyasuddin, Muhammad bin Tughlaq (Token currency, Capital shift), Firoz Shah (Canals, Jizya on Brahmins). 4. Sayyid. 5. Lodi: Bahlul, Sikandar (Gaj-i-Sikandari), Ibrahim (defeated in Panipat).'},
{title:'Administrative Terms',detail:'Iqta System: Land grants in lieu of salary (Iltutmish). Diwan-i-Arz: Military dept (Balban). Diwan-i-Kohi: Agriculture dept (M.B. Tughlaq). Diwan-i-Khairat: Charity (Firoz Tughlaq).'},
{title:'Market Reforms (Alauddin Khalji)',detail:'Price control of essential goods. Appointment of Shahna-i-Mandi (market supervisor). It was the most sophisticated economic control system of medieval India.'},
{title:'Architecture',detail:'Qutub Minar (Aibak/Iltutmish). Alai Darwaza (Alauddin). Tomb of Ghiyasuddin Tughlaq. Use of Arch, Dome, and Minaret. Decoration with floral patterns and calligraphy (Arabesque).'},
{title:'Literature',detail:'Amir Khusrau (Tut-i-Hind): Invented Sitar, Tabla, and Qawwali. Ziauddin Barani (Tarikh-i-Firoz Shahi). Ibn Battuta (Rihla): Visited during M.B. Tughlaq\'s reign.'}
],
cards:[
{front:'Who was the "Real Founder" of the Delhi Sultanate?',back:'Iltutmish. (He moved the capital to Delhi and introduced the Iqta system).'},
{front:'What is the "Iqta" system?',back:'Assignment of land revenue to military officers in lieu of cash salary.'},
{front:'Who was "Tut-i-Hind" (Parrot of India)?',back:'Amir Khusrau.'},
{front:'Which Sultan introduced "Token Currency"?',back:'Muhammad bin Tughlaq.'},
{front:'Who built the "Alai Darwaza"?',back:'Alauddin Khalji.'}
],
q:[
{q:'In the Delhi Sultanate, the "Diwan-i-Kohi" was the department of:',options:['Military','Finance','Agriculture','Justice'],ai:2,exp:'Muhammad bin Tughlaq created this department to bring more land under cultivation.'},
{q:'The "Iqta System" was introduced and institutionalized by:',options:['Aibak','Iltutmish','Balban','Alauddin Khalji'],ai:1,exp:'Iltutmish used the Iqta system to decentralize administration and maintain the army.'},
{q:'Which traveler visited India during the reign of Muhammad bin Tughlaq?',options:['Marco Polo','Ibn Battuta','Nicolo Conti','Al-Beruni'],ai:1,exp:'The Moroccan traveler Ibn Battuta visited in 1333 and was appointed as Qazi of Delhi.'},
{q:'The first Sultan to impose Jizya (tax) on Brahmins was:',options:['Alauddin Khalji','Ghiyasuddin Tughlaq','Firoz Shah Tughlaq','Sikandar Lodi'],ai:2,exp:'Firoz Shah Tughlaq was a orthodox ruler who expanded the scope of Jizya.'}
],
hook:'Iqta=Iltutmish. Market=Alauddin. Kohi=Agriculture (MBT). Khusrau=Sitar. Ibn Battuta=Rihla. 1526=End of Sultanate.',
summary:'Dynasties of the Delhi Sultanate. Administrative systems (Iqta, Market reforms). Architecture and literature. Foreign travelers and social impact.'},

{day:30,topic:'UPSC History: Vijayanagara & Bahmani Kingdoms',
intro:`Today we move to South India during the medieval period. While the Sultanate ruled the North, the 'City of Victory'—Vijayanagara—rose in the South as a bastion of Hindu culture, while the Bahmani Sultanate emerged as its rival in the Deccan. We focus on the reign of Krishnadeva Raya, the zenith of Telugu literature, and the unique 'Nayakara' administrative system. For UPSC, the architecture of Hampi (UNESCO site) and the accounts of foreign travelers like Nicolo Conti and Abdur Razzaq are high-priority.`,
notes:[
{title:'Vijayanagara Empire (1336–1646)',detail:'Founded by Harihara and Bukka (Sangama dynasty). Four dynasties: Sangama, Saluva, Tuluva, Aravidu. Greatest King: Krishnadeva Raya (Tuluva). Battle of Talikota (1565): Combined Deccan Sultanates defeated Vijayanagara, leading to its decline.'},
{title:'Administration: Nayakara System',detail:'Similar to Iqta. Military chiefs (Nayakas) were given lands (Amara) for maintenance of troops. They had to pay a portion of revenue to the King and attend the court.'},
{title:'Krishnadeva Raya: The Golden Age',detail:'"Andhra Bhoja". Authored "Amuktamalyada" (Telugu). Patronized "Ashtadiggajas" (8 great poets, including Tenali Rama). Built Vithalaswami and Hazara Rama temples.'},
{title:'Bahmani Sultanate (1347–1527)',detail:'Founded by Alauddin Bahman Shah (Hasan Gangu). Capital: Gulbarga, then Bidar. Mahmud Gawan (Prime Minister) was the most famous administrator. Later split into 5 Sultanates: Bijapur, Golconda, Ahmednagar, Bidar, Berar.'},
{title:'Foreign Travelers to Vijayanagara',detail:'Nicolo Conti (Italian), Abdur Razzaq (Persian - "eyes never saw such a city"), Domingo Paes (Portuguese), Fernao Nuniz (Portuguese). Their accounts are the primary source for the city\'s splendor.'}
],
cards:[
{front:'Who founded the Vijayanagara Empire?',back:'Harihara and Bukka (1336).'},
{front:'What is the "Amara" land in Vijayanagara?',back:'Land assigned to military chiefs (Nayakas).'},
{front:'Who wrote "Amuktamalyada"?',back:'Krishnadeva Raya.'},
{front:'Battle of Talikota (1565) - between whom?',back:'Vijayanagara vs Combined Deccan Sultanates (Bijapur, Golconda, Ahmednagar, Bidar).'},
{front:'Who was Mahmud Gawan?',back:'The brilliant Prime Minister/Administrator of the Bahmani Sultanate.'}
],
q:[
{q:'The "Nayakara System" of the Vijayanagara Empire was inspired by which system of the North?',options:['Zabti','Iqta','Mansabdari','Jagirdari'],ai:1,exp:'The Nayakara system shared similarities with the Iqta system of the Delhi Sultanate.'},
{q:'Which Persian traveler visited Vijayanagara during the reign of Deva Raya II?',options:['Nicolo Conti','Abdur Razzaq','Athanasius Nikitin','Ibn Battuta'],ai:1,exp:'Abdur Razzaq visited in 1443 and left a glowing account of the empire.'},
{q:'The "Ashtadiggajas" (Eight Poets) flourished in the court of:',options:['Harihara II','Deva Raya II','Krishnadeva Raya','Achyuta Raya'],ai:2,exp:'Krishnadeva Raya was a great patron of Telugu and Sanskrit literature.'},
{q:'The ruins of Vijayanagara are found today at which location?',options:['Belur','Halebidu','Hampi','Badami'],ai:2,exp:'Hampi in Karnataka was the capital and is now a UNESCO World Heritage site.'}
],
hook:'Vijayanagara=1336 (H&B). Nayakara=Amara lands. K.D. Raya=Andhra Bhoja. Talikota=1565. Hampi=UNESCO. Razzaq=Persian traveler.',
summary:'Rise and administration of Vijayanagara. Cultural achievements of Krishnadeva Raya. Bahmani Sultanate and Mahmud Gawan. Foreign travelers\' accounts. Architectural legacy of Hampi.'},

{day:31,topic:'UPSC History: The Mughal Empire — Consolidation & Zenith',
intro:`Today we study the 'Great Mughals'. From Babur's arrival in 1526 to the vast expansion under Aurangzeb, the Mughals defined the aesthetics, administration, and political map of India for 200 years. We focus on Akbar's 'Mansabdari' system and his policy of 'Sulh-i-kul' (Universal Peace). For UPSC, the transition from 'Mughal Rajput' cooperation to conflict, and the evolution of architecture (from Humayun's Tomb to the Taj Mahal) is essential. This is the heart of Medieval History.`,
notes:[
{title:'The Great Mughals',detail:'Babur: Founded (1526, Panipat I). Humayun: Exiled by Sher Shah Suri (GT Road founder). Akbar: Real consolidator, Mansabdari, Din-i-Ilahi. Jahangir: Chain of Justice, Painting peak. Shah Jahan: Golden Age of Architecture. Aurangzeb: Maximum expansion, religious orthodoxy.'},
{title:'Mansabdari System',detail:'Rank-based system (Zat and Sawar). Zat = personal rank/salary. Sawar = number of cavalrymen to be maintained. Ranks were not hereditary. It was the backbone of Mughal military-admin.'},
{title:'Land Revenue: Zabti & Dahshala',detail:'Raja Todar Mal (Akbar\'s Finance Minister) introduced the Dahshala system. Land was surveyed and tax fixed based on average yield of last 10 years. Categories: Polaj (annual), Parauti (1-2y gap), Chachar (3-4y), Banjar (5y+).'},
{title:'Religious Policy',detail:'Akbar: Ibadat Khana (House of Worship), Mazhar (Infallibility decree), Sulh-i-Kul. He abolished Jizya and Pilgrimage tax. Aurangzeb: Re-imposed Jizya, destroyed some temples, faced revolts from Marathas, Sikhs, and Rajputs.'},
{title:'Mughal Architecture',detail:'Features: Pietra Dura (stone inlay), Charbagh (four-square garden), Double Dome. Examples: Taj Mahal, Red Fort, Jama Masjid, Fatehpur Sikri (Buland Darwaza).'}
],
cards:[
{front:'Who introduced the "Mansabdari" system?',back:'Akbar.'},
{front:'What is "Zat" and "Sawar"?',back:'Zat: Personal status/salary. Sawar: Military responsibility (number of horses).'},
{front:'Who was the architect of the Taj Mahal?',back:'Ustad Ahmad Lahauri.'},
{front:'What is "Sulh-i-Kul"?',back:'Akbar\'s policy of "Universal Peace" and religious tolerance.'},
{front:'Who wrote "Ain-i-Akbari"?',back:'Abul Fazl.'}
],
q:[
{q:'In the Mughal administrative system, "Zabti" was a system of:',options:['Military rank','Land revenue measurement','Justice','Spying'],ai:1,exp:'Zabti was a land revenue system based on measurement and survey, perfected as Dahshala by Todar Mal.'},
{q:'Which Mughal Emperor shifted the capital from Agra to Delhi?',options:['Akbar','Jahangir','Shah Jahan','Aurangzeb'],ai:2,exp:'Shah Jahan built Shahjahanabad (Old Delhi) and moved the capital there.'},
{q:'The "Ibadat Khana" at Fatehpur Sikri was built by Akbar for:',options:['Royal prayers','Discussion on religious matters by scholars','Display of precious jewels','Public audience'],ai:1,exp:'It was a House of Worship where Akbar invited scholars of all religions for debate.'},
{q:'The "Pietra Dura" technique of stone inlay work reached its peak under:',options:['Akbar','Jahangir','Shah Jahan','Aurangzeb'],ai:2,exp:'While introduced under Jahangir, it was used extensively in the Taj Mahal by Shah Jahan.'}
],
hook:'Mansabdari=Akbar. Dahshala=Todar Mal. Taj Mahal=Pietra Dura. Sulh-i-Kul=Tolerance. 1526-1707=Great Mughals era.',
summary:'Mughal expansion and consolidation. Mansabdari and Land revenue systems. Religious policies of Akbar and Aurangzeb. Mughal art, painting, and architecture. Decline factors.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC History Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'History Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Medieval History '+d.topic),why:'Crucial for administrative and cultural history.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 29-31 v2 COMPLETE');
}
push();

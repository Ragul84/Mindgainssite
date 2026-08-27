require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:43,topic:'SSC History: Ancient India — IVC & Religions',
intro:`Today we study the 'Origins of India'. Ancient history in SSC is about 'Sites' and 'Sects'. From the Great Bath of Harappa to the Four Noble Truths of Buddha and the Tirthankaras of Jainism—these facts are high-yield. Do you know which site had a dockyard? Or where Buddha gave his first sermon? Let's master the ancient facts today.`,
notes:[
{title:'Indus Valley Civilization (IVC)',detail:'Sites: Harappa (Ravi river), Mohenjo-Daro (Indus, Great Bath), Lothal (Dockyard), Kalibangan (Black Bangles). First known as Harappan civilization.'},
{title:'Buddhism',detail:'Founder: Gautam Buddha (Lumbini). First Sermon: Sarnath. Death: Kushinagar. 4 Councils: Rajgriha, Vaishali, Pataliputra, Kashmir.'},
{title:'Jainism',detail:'Founder: Rishabhdev (1st). Mahavira (24th). 5 Vows: Non-violence, Truth, Non-stealing, Non-attachment, Celibacy.'},
{title:'Maurya Empire',detail:'Chandragupta Maurya (Founder). Kautilya (Arthashastra). Ashoka (Greatest, Dhamma, Kalinga War 261 BC). Sanchi Stupa.'},
{title:'Gupta Empire (Golden Age)',detail:'Chandra Gupta I, Samudragupta (Napoleon of India), Chandra Gupta II (Vikramaditya). Kalidasa (poet).'}
],
cards:[
{front:'"Napoleon of India"?',back:'Samudragupta.'},
{front:'Where was the IVC Dockyard?',back:'Lothal.'},
{front:'Buddha\'s first sermon was at?',back:'Sarnath.'},
{front:'Who wrote "Arthashastra"?',back:'Kautilya (Chanakya).'},
{front:'Last Tirthankara of Jainism?',back:'Mahavira.'}
],
q:[
{q:'In which of the following IVC sites was a "Dockyard" found?',options:['Harappa','Lothal','Kalibangan','Ropar'],ai:1,exp:'Lothal in Gujarat was a major maritime trade center.'},
{q:'"Samudragupta" is known as the Napoleon of India by:',options:['V.A. Smith','R.C. Majumdar','Romila Thapar','Sir John Marshall'],ai:0,exp:'Due to his extensive military conquests.'},
{q:'The "Kalinga War" changed the life of which ruler?',options:['Chandragupta Maurya','Ashoka','Harsha','Bindusara'],ai:1,exp:'After the bloodshed in 261 BC, Ashoka embraced non-violence.'},
{q:'Where was the First Buddhist Council held?',options:['Sarnath','Rajgriha','Pataliputra','Vaishali'],ai:1,exp:'Held immediately after Buddha\'s death under the patronage of Ajatshatru.'}
],
hook:'IVC=Lothal Dock. Buddha=Sarnath. Mahavira=24th. Ashoka=261 BC. Samudragupta=Napoleon. Guptas=Golden Age.',
summary:'Major sites and features of the Indus Valley. Life and teachings of Buddha and Mahavira. Key rulers and achievements of the Mauryan and Gupta empires.'},

{day:44,topic:'SSC History: Medieval India — Sultanate & Mughals',
intro:`Today we study the 'Age of Empires'. Medieval history in SSC is dominated by the 'Delhi Sultanate' and the 'Mughals'. Questions focus on 'Rulers', 'Monuments', and 'Administration'. From the Qutub Minar to the Taj Mahal and the reforms of Akbar—these are the markers of our history. Do you know who started the 'Sijda' system? Or which Mughal king was called 'Zinda Pir'? Let's master the medieval timeline today.`,
notes:[
{title:'Delhi Sultanate (5 Dynasties)',detail:'Slave (Qutubuddin Aibak), Khilji (Alauddin - Market reforms), Tughlaq (M.B. Tughlaq - token currency), Sayyid, Lodi (Ibrahim - lost 1st Panipat 1526).'},
{title:'Alauddin Khilji',detail:'Introduced "Dagh" (branding of horses) and "Chehra" (descriptive roll of soldiers). Market control and price regulation.'},
{title:'The Mughal Empire (1526–1857)',detail:'Babur (Founder), Humayun, Akbar (Greatest, Din-i-Ilahi), Jahangir (Chain of Justice), Shah Jahan (Golden age of Architecture), Aurangzeb (Alamgir).'},
{title:'Akbar\'s Reforms',detail:'Abolished Jizya. Introduced Mansabdari system. Built Fatehpur Sikri and Ibadat Khana.'},
{title:'Monuments',detail:'Qutub Minar (Aibak/Iltutmish). Red Fort & Taj Mahal (Shah Jahan). Buland Darwaza (Akbar).'}
],
cards:[
{front:'Founder of the Slave Dynasty?',back:'Qutubuddin Aibak.'},
{front:'Which ruler was called "Lakh Baksh"?',back:'Qutubuddin Aibak.'},
{front:'Who introduced the "Market Control" system?',back:'Alauddin Khilji.'},
{front:'Mughal king called "Zinda Pir"?',back:'Aurangzeb.'},
{front:'Battle of Panipat 1st year?',back:'1526 (Babur vs Ibrahim Lodi).'}
],
q:[
{q:'"Fatehpur Sikri" was founded as a capital by:',options:['Babur','Humayun','Akbar','Shah Jahan'],ai:2,exp:'Akbar built it to celebrate his victory in Gujarat.'},
{q:'Which of the following dynasties was NOT part of the Delhi Sultanate?',options:['Slave','Khilji','Sur','Tughlaq'],ai:2,exp:'Sur dynasty (Sher Shah) ruled between Humayun and Akbar, but was not part of the Sultanate dynasties.'},
{q:'"Jizya" tax was abolished by which Mughal emperor?',options:['Aurangzeb','Akbar','Jahangir','Babur'],ai:1,exp:'Akbar abolished it in 1564 as part of his religious tolerance policy.'},
{q:'Who built the "Moti Masjid" in the Red Fort of Delhi?',options:['Akbar','Shah Jahan','Aurangzeb','Jahangir'],ai:2,exp:'Shah Jahan built the one in Agra; Aurangzeb built the one in Delhi.'}
],
hook:'Slave=Aibak. Khilji=Market. Panipat 1=1526. Akbar=Sikri/Jizya. Shah Jahan=Taj. Aurangzeb=Zinda Pir.',
summary:'Timeline and rulers of the Delhi Sultanate. Expansion and cultural achievements of the Mughal Empire. Important medieval battles and architectural landmarks.'},

{day:45,topic:'SSC History: Modern India — 1857 & Early Phase',
intro:`Today we study the 'Awakening'. Modern history in SSC starts with the 'Revolt of 1857' and the formation of the 'INC'. Questions focus on 'Leaders', 'Locations', and 'Dates'. From Mangal Pandey to A.O. Hume and the Viceroys—this is the transition from Company to Crown rule. Do you know who led the revolt in Bihar? Or who was the 'Grand Old Man'? Let's master the modern facts today.`,
notes:[
{title:'Revolt of 1857',detail:'Started at Meerut. Mangal Pandey (Barrackpore). Leaders: Delhi (Bahadur Shah II), Lucknow (Begum Hazrat Mahal), Jhansi (Laxmibai), Bihar (Kunwar Singh), Kanpur (Nana Saheb).'},
{title:'Viceroys & Governors',detail:'Bengal GG (Warren Hastings), India GG (William Bentinck), Viceroy (Canning). 1857 occurred during Canning\'s time.'},
{title:'Indian National Congress (1885)',detail:'Founder: A.O. Hume. 1st President: W.C. Bonnerjee. 1st session: Bombay. Viceroy during formation: Lord Dufferin.'},
{title:'Social Reforms',detail:'Raja Ram Mohan Roy (Brahmo Samaj, Abolished Sati 1829). Dayanand Saraswati (Arya Samaj, "Go back to Vedas"). Jyotiba Phule (Satyashodhak Samaj).'},
{title:'Partition of Bengal (1905)',detail:'By Lord Curzon. Led to Swadeshi movement. Revoked in 1911 (Hardinge II).'}
],
cards:[
{front:'Who led the 1857 revolt in Bihar?',back:'Kunwar Singh.'},
{front:'First Viceroy of India?',back:'Lord Canning.'},
{front:'Who founded the Arya Samaj?',back:'Dayanand Saraswati.'},
{front:'Year of Sati abolition?',back:'1829 (Bentinck).'},
{front:'First President of INC?',back:'W.C. Bonnerjee.'}
],
q:[
{q:'Who was the Viceroy of India when the INC was formed in 1885?',options:['Lord Ripon','Lord Dufferin','Lord Curzon','Lord Mayo'],ai:1,exp:'Lord Dufferin called INC a "microscopic minority".'},
{q:'The 1857 revolt started from which place?',options:['Delhi','Meerut','Kanpur','Jhansi'],ai:1,exp:'On May 10, 1857, soldiers at Meerut mutinied.'},
{q:'"Go back to Vedas" was the slogan of:',options:['Vivekananda','Dayanand Saraswati','Ram Mohan Roy','Ramakrishna Paramahamsa'],ai:1,exp:'Founder of the Arya Samaj.'},
{q:'The "Permanent Settlement" was introduced by:',options:['Warren Hastings','Lord Cornwallis','William Bentinck','Lord Dalhousie'],ai:1,exp:'Introduced in Bengal in 1793.'}
],
hook:'1857=Canning/Meerut. 1885=Dufferin/Hume. Sati=1829. Arya=Dayanand. Brahmo=RRM Roy. Kunwar=Bihar.',
summary:'Causes and leaders of the 1857 revolt. Early social and religious reform movements. Formation and initial phase of the Indian National Congress.'},

{day:46,topic:'SSC History: Modern India — Gandhian Era',
intro:`Today we study the 'Mass Struggles'. The arrival of Gandhi changed the freedom movement from an elite debate to a common man's fight. We explore the 'Big Three'—Non-Cooperation, Civil Disobedience, and Quit India. In SSC, the 'Years' and 'Pacts' (Gandhi-Irwin, Poona) are high-yield. Do you know who was called 'Frontier Gandhi'? Or which session demanded 'Purna Swaraj'? Let's finish the modern timeline today.`,
notes:[
{title:'Gandhi\'s Arrival',detail:'1915 from South Africa. Early struggles: Champaran (1917), Kheda (1918), Ahmedabad (1918).'},
{title:'Non-Cooperation Movement (1920–1922)',detail:'Withdrawn due to Chauri Chaura incident. Slogan: Swaraj in one year.'},
{title:'Civil Disobedience (1930)',detail:'Started with Dandi March (6 April 1930). Salt Satyagraha. Gandhi-Irwin Pact (1931).'},
{title:'Quit India Movement (1942)',detail:'"Do or Die" (Karo ya Maro). Launched on 8th August 1942 from Bombay.'},
{title:'Key Pacts & Sessions',detail:'Lucknow Pact (1916). Lahore Session (1929 - Purna Swaraj). Poona Pact (1932 - Gandhi & Ambedkar).'}
],
cards:[
{front:'"Do or Die" slogan given in?',back:'Quit India Movement (1942).'},
{front:'"Purna Swaraj" was demanded in which session?',back:'Lahore Session (1929).'},
{front:'Who was "Frontier Gandhi"?',back:'Khan Abdul Ghaffar Khan.'},
{front:'When did the Dandi March end?',back:'6 April 1930.'},
{front:'Who was the President of 1929 Lahore session?',back:'Jawaharlal Nehru.'}
],
q:[
{q:'In which year did the "Dandi March" take place?',options:['1919','1920','1930','1942'],ai:2,exp:'Started on March 12 and ended on April 6, 1930.'},
{q:'"Swaraj is my birthright" was the slogan of:',options:['Gandhi','Bose','Tilak','Nehru'],ai:2,exp:'Bal Gangadhar Tilak, the extremist leader.'},
{q:'Which movement is associated with the slogan "Do or Die"?',options:['Khilafat','Non-Cooperation','Quit India','Civil Disobedience'],ai:2,exp:'Given by Gandhi at the start of the 1942 movement.'},
{q:'The "Poona Pact" was signed between Gandhi and:',options:['Nehru','Jinnah','Ambedkar','Irwin'],ai:2,exp:'In 1932 regarding reserved seats for depressed classes.'}
],
hook:'1915=Gandhi. 1929=Purna Swaraj. 1930=Dandi. 1942=Quit India. Do or Die=1942. Tilak=Swaraj.',
summary:'Evolution of the national movement under Gandhi. Chronology of major mass movements. Significance of key INC sessions and political pacts.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC History Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'History Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL History '+d.topic),why:'Mastering historical facts for SSC exams.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | GK',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

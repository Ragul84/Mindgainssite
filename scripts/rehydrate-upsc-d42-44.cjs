require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:42,topic:'UPSC History: The Revolt of 1857 — The First War',
intro:`Today we study the 'Great Rebellion'. The Revolt of 1857 was the first massive challenge to British authority in India. What started as a sepoy mutiny in Meerut quickly spread into a popular uprising across North and Central India. We explore the multifaceted causes—from the greased cartridges to the Doctrine of Lapse—and the heroic resistance of leaders like Rani Lakshmibai and Kunwar Singh. For UPSC, focus on 'Why the revolt failed' and its 'Long-term Impact' on British policy.`,
notes:[
{title:'Causes of the Revolt',detail:'Political: Doctrine of Lapse, annexation of Awadh. Economic: Heavy taxation, destruction of handicrafts. Social/Religious: Interference in customs, Sati abolition, conversion fears. Military: Greased cartridges (immediate cause), discrimination against Indian sepoys.'},
{title:'Centers & Leaders',detail:'Delhi: Bahadur Shah Zafar (Nominal), Bakht Khan (Real). Kanpur: Nana Saheb, Tantia Tope. Lucknow: Begum Hazrat Mahal. Jhansi: Rani Lakshmibai. Bareilly: Khan Bahadur Khan. Arrah (Bihar): Kunwar Singh.'},
{title:'Suppression of the Revolt',detail:'Delhi: John Nicholson. Lucknow: Colin Campbell. Jhansi: Hugh Rose (who called Rani the "only man among the rebels").'},
{title:'Causes of Failure',detail:'Localized nature (South and West remained quiet). Lack of unified leadership and modern weapons. Support of some Indian rulers (Nizam, Scindia) to the British. Middle class remained neutral.'},
{title:'Impact of the Revolt',detail:'Government of India Act 1858: End of Company rule, India under British Crown. Secretary of State and Viceroy appointed. End of "Doctrine of Lapse". "Divide and Rule" policy intensified.'}
],
cards:[
{front:'Immediate cause of 1857 Revolt?',back:'The use of greased cartridges in the new Enfield rifles.'},
{front:'Who led the revolt in Lucknow?',back:'Begum Hazrat Mahal.'},
{front:'Who led the revolt in Bihar (Arrah)?',back:'Kunwar Singh.'},
{front:'Who called Rani Lakshmibai "the only man among the rebels"?',back:'Sir Hugh Rose.'},
{front:'What was the "Act for the Better Government of India"?',back:'Government of India Act 1858.'}
],
q:[
{q:'Which of the following was NOT a center of the 1857 Revolt?',options:['Delhi','Madras','Lucknow','Jhansi'],ai:1,exp:'The revolt was largely confined to North and Central India; Madras and Bombay presidencies remained quiet.'},
{q:'Who was the British Governor-General during the 1857 Revolt?',options:['Lord Dalhousie','Lord Canning','Lord Bentinck','Lord Wellesley'],ai:1,exp:'Lord Canning was the GG in 1857 and became the first Viceroy in 1858.'},
{q:'"The First Indian War of Independence 1857-59" was written by:',options:['V.D. Savarkar','S.N. Sen','R.C. Majumdar','Karl Marx'],ai:3,exp:'Karl Marx and Friedrich Engels wrote articles using this perspective. V.D. Savarkar called it the "First War of Independence" in his book.'},
{q:'The "Doctrine of Lapse" was a primary reason for the revolt in which center?',options:['Kanpur','Lucknow','Jhansi','Delhi'],ai:2,exp:'Rani Lakshmibai fought against the annexation of Jhansi after her husband\'s death.'}
],
hook:'1857=Meerut start. Jhansi=Rani. Bihar=Kunwar Singh. 1858 Act=Crown Rule. Canning=1st Viceroy. Failed due to lack of unity.',
summary:'Analysis of multi-dimensional causes of the 1857 revolt. Mapping of centers and leaders. Reasons for failure and the shift to Crown rule. Impact on the Indian army and administration.'},

{day:43,topic:'UPSC History: Governor-Generals & Viceroys',
intro:`Today we study the 'Men who Ruled India'. The history of British India is often told through the actions of its Governor-Generals and Viceroys. From the administrative reforms of Cornwallis to the aggressive expansion of Wellesley and the imperialist policies of Curzon—these men shaped the political and economic destiny of the subcontinent. For UPSC, mastering this timeline is the best way to anchor your Modern History facts. Let's build your 'Executive Timeline' today.`,
notes:[
{title:'Governor-Generals of Bengal',detail:'Warren Hastings (1772-85): Regulating Act, Dual Gov abolition. Cornwallis (1786-93): Permanent Settlement, Civil Services father. Wellesley (1798-1805): Subsidiary Alliance.'},
{title:'Governor-Generals of India',detail:'William Bentinck (1828-35): Sati abolition, English education. Dalhousie (1848-56): Doctrine of Lapse, Railways, Telegraph, PWD.'},
{title:'Viceroys (1858 onwards)',detail:'Canning (1st Viceroy): 1857 revolt, portfolio system. Lytton (1876-80): Vernacular Press Act, Arms Act. Ripon (1880-84): Father of Local Self-Gov, Factory Act, Ilbert Bill. Curzon (1899-1905): Partition of Bengal.'},
{title:'Later Viceroys',detail:'Hardinge II: Capital shift to Delhi (1911). Chelmsford: Dyarchy. Irwin: Gandhi-Irwin Pact. Wavell: Shimla Conference. Mountbatten: Partition and Independence.'},
{title:'Key Distinctions',detail:'GG of Bengal (1773). GG of India (1833). Viceroy (1858). Understanding these title shifts is crucial for chronological questions.'}
],
cards:[
{front:'Who is the "Father of Civil Services" in India?',back:'Lord Cornwallis.'},
{front:'Who is the "Father of Local Self-Government"?',back:'Lord Ripon.'},
{front:'Who introduced the "Portfolio System"?',back:'Lord Canning.'},
{front:'Who was the Viceroy during the Partition of Bengal (1905)?',back:'Lord Curzon.'},
{front:'Who was the last British Viceroy?',back:'Lord Mountbatten.'}
],
q:[
{q:'The "Vernacular Press Act" of 1878 was passed by:',options:['Lord Ripon','Lord Lytton','Lord Curzon','Lord Dufferin'],ai:1,exp:'Lytton passed this "Gagging Act" to suppress Indian newspapers.'},
{q:'Which Governor-General introduced the "Permanent Settlement" in Bengal?',options:['Warren Hastings','Lord Cornwallis','Lord Wellesley','Lord Bentinck'],ai:1,exp:'Cornwallis (1793) established the Zamindari system.'},
{q:'The "First Railway Line" in India was opened during the tenure of:',options:['Lord Bentinck','Lord Dalhousie','Lord Canning','Lord Lawrence'],ai:1,exp:'The Bombay-Thane line (1853) was a flagship project of Dalhousie.'},
{q:'Who was the Viceroy of India when the "Indian National Congress" was formed in 1885?',options:['Lord Lytton','Lord Ripon','Lord Dufferin','Lord Lansdowne'],ai:2,exp:'Dufferin was the Viceroy during the birth of INC.'}
],
hook:'Cornwallis=Civil Services. Ripon=Local Self Gov. Dalhousie=Railways/Lapse. Curzon=Partition. Lytton=Gagging Act. Canning=1st Viceroy.',
summary:'Timeline and key contributions of major GGs and Viceroys. Analysis of reformist vs imperialist administrators. Structural changes in British rule over time.'},

{day:44,topic:'UPSC History: Constitutional Developments (1773–1858)',
intro:`Today we study the 'Legal Framework of Empire'. The British didn't just rule by sword; they ruled by Law. We trace the evolution of constitutional acts from the Regulating Act of 1773, which first brought the Company under parliamentary control, to the Government of India Act 1858, which transferred power to the Crown. For UPSC, these acts are the foundation of both History and Polity (M. Laxmikanth Chapter 1). Focus on the 'Key Features' of each act—this is high-yield territory.`,
notes:[
{title:'Regulating Act of 1773',detail:'First step of British Govt to control EIC. Made GG of Bengal. Established Supreme Court at Calcutta (1774). Prohibited EIC servants from private trade.'},
{title:'Pitts India Act of 1784',detail:'Distinguished between commercial and political functions. Created "Board of Control" (Political) and "Court of Directors" (Commercial) - System of Double Government.'},
{title:'Charter Act of 1813',detail:'Ended EIC\'s trade monopoly in India (except Tea and trade with China). Allowed Christian missionaries. 1 Lakh for education.'},
{title:'Charter Act of 1833 (Final Centralization)',detail:'Made GG of Bengal as "GG of India" (Bentinck). Ended EIC as a commercial body. Attempted to introduce open competition for Civil Services.'},
{title:'Charter Act of 1853',detail:'Separated legislative and executive functions of GG Council. Introduced open competition for Civil Services (Macaulay Committee 1854).'},
{title:'Government of India Act 1858',detail:'Following 1857. Transferred power to Crown. GG title changed to Viceroy. New office "Secretary of State" created (Member of British Cabinet).'}
],
cards:[
{front:'Which act established the Supreme Court at Calcutta?',back:'Regulating Act of 1773.'},
{front:'Which act ended EIC\'s trade monopoly in India?',back:'Charter Act of 1813.'},
{front:'Who was the first "Governor-General of India"?',back:'Lord William Bentinck (under Act of 1833).'},
{front:'What is the "Double Government" of 1784?',back:'Board of Control (Political) and Court of Directors (Commercial).'},
{front:'When was the office of "Secretary of State" created?',back:'1858.'}
],
q:[
{q:'The "Board of Control" was established by which act?',options:['Regulating Act 1773','Pitts India Act 1784','Charter Act 1813','Charter Act 1833'],ai:1,exp:'Pitts India Act introduced this to oversee the Company\'s political affairs.'},
{q:'Which act made the Governor-General of Bengal as the Governor-General of India?',options:['Pitts India Act 1784','Charter Act 1813','Charter Act 1833','Charter Act 1853'],ai:2,exp:'This was the final step towards administrative centralization in British India.'},
{q:'The "Open Competition" for Civil Services was introduced by:',options:['Charter Act 1833','Charter Act 1853','Govt of India Act 1858','Indian Councils Act 1861'],ai:1,exp:'The 1853 act finally institutionalized the merit-based entry system.'},
{q:'Which act first separated the Legislative and Executive functions?',options:['Charter Act 1813','Charter Act 1833','Charter Act 1853','Indian Councils Act 1861'],ai:2,exp:'The 1853 act created a separate Legislative Council for the GG.'}
],
hook:'1773=SC/GG Bengal. 1784=Board of Control. 1813=End Monopoly (Tea/China). 1833=GG India. 1853=Legislative council. 1858=Crown Rule.',
summary:'Evolution of British legal control over India. Key provisions of Charter and Council acts. Analysis of centralization vs decentralization. Transition from Company to Crown rule.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC History Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'History Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Modern History '+d.topic),why:'Essential for both History and Polity Prelims.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 42-44 v2 COMPLETE');
}
push();

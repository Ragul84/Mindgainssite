require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:33,topic:'TNPSC Unit 8: Freedom Struggle in TN — Palayakkarar Revolt',
intro:`Today we study the 'First Resistance'. Long before 1857, Tamil Nadu saw the fierce Palayakkarar revolts against the British. In TNPSC, 'Puli Thevar', 'Veerapandiya Kattabomman', and 'Marudu Brothers' are non-negotiable topics. Do you know who was the first to resist British rule in India? Or what happened at the 'Vellore Mutiny'? Let's master the rebellion today.`,
notes:[
{title:'Puli Thevar (Nerkattumseval)',detail:'The first Indian to resist British rule (1755). Defeated Alexander Heron. Later defeated by Yusuf Khan (Khan Sahib).'},
{title:'Veerapandiya Kattabomman',detail:'Palayakkarar of Panchalankurichi. Confrontation with Jackson (Collector). Captured and hanged at Kayathar (Oct 17, 1799).'},
{title:'Marudu Brothers (Sivagangai)',detail:'Periya Marudu and Chinna Marudu. Issued the "Tiruchirappalli Proclamation" (1801). Known as "Lion of Sivagangai". Hanged at Tiruppathur.'},
{title:'Velu Nachiyar',detail:'First woman to fight the British. Reclaimed Sivagangai with help of Hyder Ali and Marudu brothers. Used "Kuyili" (suicide bomber).'},
{title:'Vellore Mutiny (July 10, 1806)',detail:'First major revolt in South India. Cause: New military regulations/turban. Suppressed by Rollo Gillespie.'}
],
cards:[
{front:'First to resist British rule?',back:'Puli Thevar.'},
{front:'Where was Kattabomman hanged?',back:'Kayathar.'},
{front:'Who issued Tiruchirappalli Proclamation?',back:'Marudu Brothers (1801).'},
{front:'"Lion of Sivagangai"?',back:'Chinna Marudu.'},
{front:'Year of Vellore Mutiny?',back:'1806.'}
],
q:[
{q:'"Puli Thevar" was the Palayakkarar of which place?',options:['Panchalankurichi','Nerkattumseval','Sivagangai','Ettayapuram'],ai:1,exp:'He refused to pay tribute to the Nawab and the British.'},
{q:'The "Tiruchirappalli Proclamation" of 1801 was issued by:',options:['Kattabomman','Puli Thevar','Marudu Brothers','Velu Nachiyar'],ai:2,exp:'It was a call for all Indians to unite against the British.'},
{q:'Who was the "Collector of Tirunelveli" who had a confrontation with Kattabomman?',options:['Jackson','Lushington','Edward Clive','Bannerman'],ai:0,exp:'The famous dialogue "Vatti, Kisthi, Thirai" was addressed to him.'},
{q:'"Kuyili", the first woman suicide bomber, was a commander of:',options:['Velu Nachiyar','Jhansi Rani','Abhirami','Marudu Brothers'],ai:0,exp:'She set herself on fire to destroy the British ammunition depot.'}
],
hook:'Puli Thevar=First. Kattabomman=Kayathar. Marudu=Lion. 1801=Proclamation. 1806=Vellore Mutiny. Velu Nachiyar=Heroine.',
summary:'Detailed study of the early Palayakkarar resistance movements. Profiles of Puli Thevar and Kattabomman. Significance of the Marudu Brothers\' Tiruchirappalli Proclamation. Analysis of the Vellore Mutiny of 1806.'},

{day:34,topic:'TNPSC Unit 8: Freedom Struggle in TN — Early Phase',
intro:`Today we study the 'Rise of Nationalism'. Beyond the swords, the fight moved to 'Associations' and 'Mass movements'. In TNPSC, 'V.O. Chidambaranar', 'Subramania Bharati', and 'Vanchinathan' are high-yield. Do you know who founded the 'Swadeshi Steam Navigation Company'? Or who killed Collector Ashe? Let's master the modern Tamil history today.`,
notes:[
{title:'Early Associations',detail:'Madras Native Association (1852 - Gazulu Lakshminarasu Chetty). Madras Mahajana Sabha (1884 - M. Veeraraghavachari, P. Anandacharlu).'},
{title:'V.O. Chidambaranar (VOC)',detail:'"Kappalottiya Thamizhan". Launched SSN Company (Tuticorin to Colombo). Arrested for Coral Mill strike. Known as "Chekkizhutha Semmal".'},
{title:'Subramania Bharati',detail:'National Poet. Editor of "India" and "Vijaya". Composed "Swadesa Geethangal".'},
{title:'Vanchinathan',detail:'Member of Bharatha Matha Association. Shot Collector Ashe at Maniyachi Junction (June 17, 1911) and committed suicide.'},
{title:'Annie Besant & Home Rule',detail:'Home Rule League in Madras (1916). Started "New India" and "Commonweal".'}
],
cards:[
{front:'Founder of SSN Company?',back:'V.O. Chidambaranar.'},
{front:'"Chekkizhutha Semmal" is?',back:'V.O. Chidambaranar.'},
{front:'Who killed Collector Ashe?',back:'Vanchinathan.'},
{front:'Founder of Madras Mahajana Sabha?',back:'M. Veeraraghavachari & others (1884).'},
{front:'Annie Besant\'s newspaper?',back:'New India.'}
],
q:[
{q:'"Swadeshi Steam Navigation Company" was launched by VOC to compete with:',options:['French','Dutch','British Steam Navigation Company','None'],ai:2,exp:'A bold economic challenge to British monopoly.'},
{q:'The "Ashe Murder" took place at which railway station?',options:['Madurai','Maniyachi','Tirunelveli','Chennai Central'],ai:1,exp:'Vanchinathan shot Robert Ashe on June 17, 1911.'},
{q:'Who was known as the "National Poet" of Tamil Nadu?',options:['Bharatidasan','Subramania Bharati','Kavimani','Kannadasan'],ai:1,exp:'His songs inspired thousands to join the freedom struggle.'},
{q:'In which year was the "Madras Mahajana Sabha" founded?',options:['1852','1884','1885','1916'],ai:1,exp:'A precursor to the Indian National Congress.'}
],
hook:'VOC=Steam Ship. Bharati=India/Vijaya. Vanchinathan=Ashe. 1884=MMS. Besant=Home Rule. 1852=MNA.',
summary:'Analysis of early political associations in Madras Presidency. Role of V.O. Chidambaranar in the Swadeshi movement. Contribution of Subramania Bharati to national consciousness. Revolutionary activities of Vanchinathan.'},

{day:35,topic:'TNPSC REVISION: Unit 8 Part 1 (Days 29–34)',
intro:`Today we consolidate the 'Glory and Struggle of Tamil Nadu'. You have mastered the Sangam era, the Pallava/Chola/Pandya empires, and the early phase of the freedom fight. In TNPSC, Unit 8 is the 'Mark Machine'. Today, we drill the titles, the years, and the sites. If you see 'Uttiramerur', you say 'Chola Admin'. If you see 'Kayathar', you say 'Kattabomman'. Let's lock in the Unit 8 marks today.`,
notes:[
{title:'Ancient/Medieval Recap',detail:'Sangam (3rd Madurai). Thinai (Kurinji=Mountain). Silappathikaram (Ilango). Pallava (Vichitrachitta). Chola (Big Temple/Uttiramerur). Pandyas (Marco Polo).'},
{title:'Revolt Recap',detail:'Puli Thevar (1st). Kattabomman (Hanged Kayathar). Marudu (Lion of Sivagangai). 1806 (Vellore Mutiny).'},
{title:'Leaders Recap',detail:'VOC (SSN Company). Bharati (National Poet). Vanchinathan (Ashe Murder). MMS (1884).'},
{title:'Sites Recap',detail:'Keezhadi (Vaigai). Adichanallur (Urns). Mahabalipuram (Pallavas). Gangaikondacholapuram (Rajendra I).'},
{title:'Literary Recap',detail:'Ettuthogai (8). Pathupattu (10). Twin Epics (Silappathikaram/Manimegalai).'}
],
cards:[
{front:'Title of Narasimhavarman I?',back:'Vatapi Kondan.'},
{front:'Author of "Mattavilasa Prahasana"?',back:'Mahendravarman I.'},
{front:'Where was the Vellore Mutiny?',back:'Vellore Fort (1806).'},
{front:'"Iliad of Tamil Poetry"?',back:'Silappathikaram.'},
{front:'Year of MMS foundation?',back:'1884.'}
],
q:[
{q:'"Kudavolai" system of elections was used by:',options:['Pallavas','Pandyas','Cholas','Cheras'],ai:2,exp:'Recap.'},
{q:'Who was the first woman to fight the British in India?',options:['Jhansi Rani','Velu Nachiyar','Mangammal','Abhirami'],ai:1,exp:'She fought in the late 18th century.'},
{q:'"Keezhadi" excavation belongs to which era?',options:['Chola','Pallava','Sangam','Vedic'],ai:2,exp:'Provides evidence of advanced Sangam civilization.'},
{q:'"Collector Jackson" is associated with which leader?',options:['Puli Thevar','Kattabomman','Marudu Brothers','Vanchinathan'],ai:1,exp:'Famous confrontation at Ramanathapuram.'}
],
hook:'Unit 8 Part 1 complete. Fact drill. Titles mastery. Rebellion years. Literature roots. Victory.',
summary:'Full revision of ancient and medieval Tamil history. Chronology of early resistance against the British. Profiles of key freedom fighters from Tamil Nadu. Final Unit 8 Part 1 mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC Unit 8 Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'TN History Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Unit 8 '+d.topic),why:'Consolidating TN history for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

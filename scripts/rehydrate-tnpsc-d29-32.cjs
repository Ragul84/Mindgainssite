require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:29,topic:'TNPSC Unit 8: Sangam Age — Literature & Society',
intro:`Today we study the 'Golden Roots of Tamil'. The Sangam Age is the foundation of Tamil culture. In TNPSC, questions focus on 'Five Landscapes (Thinai)', 'Major Epics', and 'Archaeological Sites'. From Madurai Kanchi to Silappathikaram—this is the soul of Unit 8. Do you know which epic is called the 'Iliad of Tamil Poetry'? Let's master the Sangam facts today.`,
notes:[
{title:'Sangam Assemblies',detail:'1. First (Thenmadurai), 2. Second (Kapatapuram), 3. Third (Madurai - most surviving works from here).'},
{title:'Five Thinai (Landscapes)',detail:'Kurinji (Mountains - Murugan), Mullai (Forest - Thirumal), Marutham (Agricultural - Indiran), Neithal (Coastal - Varunan), Palai (Desert - Korravai).'},
{title:'Pathupattu & Ettuthogai',detail:'The core 18 works. Famous: Maduraikanchi, Nedunalvaadai, Purananuru (Heroism), Agananuru (Love).'},
{title:'Twin Epics',detail:'Silappathikaram (Ilango Adigal - Kovalan/Kannagi) and Manimegalai (Sathanar - daughter of Kovalan).'},
{title:'Archaeological Sites',detail:'Keezhadi (Sivagangai - Urban life), Adichanallur (Thoothukudi - Urns), Arikamedu (Puducherry - Roman trade).'}
],
cards:[
{front:'"Iliad of Tamil"?',back:'Silappathikaram.'},
{front:'Thinai for Mountains?',back:'Kurinji.'},
{front:'Author of Silappathikaram?',back:'Ilango Adigal.'},
{front:'Where was the 3rd Sangam held?',back:'Madurai.'},
{front:'Keezhadi site location?',back:'Sivagangai district.'}
],
q:[
{q:'Which of the following is NOT one of the "Twin Epics" of Tamil literature?',options:['Silappathikaram','Manimegalai','Civaka Cintamani','None'],ai:2,exp:'Silappathikaram and Manimegalai are the twin epics.'},
{q:'"Kurinji" landscape is dedicated to which deity?',options:['Thirumal','Murugan','Indiran','Varunan'],ai:1,exp:'Kurinji represents the mountain region.'},
{q:'Who is the author of "Manimegalai"?',options:['Ilango Adigal','Sithalai Sathanar','Kambar','Thiruvalluvar'],ai:1,exp:'Sathanar wrote the sequel to Silappathikaram.'},
{q:'The "Keezhadi" excavation site is located on the banks of which river?',options:['Cauvery','Vaigai','Tamirabharani','Palar'],ai:1,exp:'Located near Madurai in Sivagangai district.'}
],
hook:'Silappathikaram=Ilango. Kurinji=Murugan. Keezhadi=Vaigai. 3rd Sangam=Madurai. Pathupattu=10 songs.',
summary:'Analysis of the three Sangam assemblies. Classification of the five landscapes (Thinai). Overview of major Sangam literature and the twin epics. Significance of recent archaeological findings in Tamil Nadu.'},

{day:30,topic:'TNPSC Unit 8: Pallavas & Early Pandyas',
intro:`Today we study the 'Age of Temples'. The Pallavas of Kanchi transformed TN history with their rock-cut architecture. In TNPSC, 'Titles of Kings' and 'Mahabalipuram Rathas' are high-yield. We also look at the 'First Pandyan Empire'. Do you know who is called 'Vichitrachitta'? Let's master the medieval transition today.`,
notes:[
{title:'Pallava Dynasty',detail:'Capital: Kanchipuram. Founder: Simhavishnu. Greatest: Mahendravarman I and Narasimhavarman I.'},
{title:'Mahendravarman I',detail:'Titles: Vichitrachitta (Curious-minded), Mattavilasa, Chitrakarapuli. Built rock-cut temples (Mandagapattu).'},
{title:'Narasimhavarman I (Mamalla)',detail:'Defeated Pulakesin II. Built the Shore Temple and Five Rathas at Mahabalipuram.'},
{title:'Pallava Art',detail:'Transition from Rock-cut (Mahendra) to Monolithic (Mamalla) to Structural (Rajasimha - Kailasanathar temple).'},
{title:'Early Pandyas',detail:'Kadungon restored Pandyan rule after Kalabhras. Velvikkudi copper plates are a major source.'}
],
cards:[
{front:'Capital of Pallavas?',back:'Kanchipuram.'},
{front:'"Vichitrachitta" title belongs to?',back:'Mahendravarman I.'},
{front:'Who built Mahabalipuram Rathas?',back:'Narasimhavarman I (Mamalla).'},
{front:'Founder of Early Pandyan Empire?',back:'Kadungon.'},
{front:'"Mattavilasa Prahasana" author?',back:'Mahendravarman I.'}
],
q:[
{q:'Who was the Pallava king who took the title "Vatapi Kondan"?',options:['Mahendravarman I','Narasimhavarman I','Rajasimha','Simhavishnu'],ai:1,exp:'He defeated Pulakesin II and destroyed Vatapi.'},
{q:'The "Shore Temple" at Mahabalipuram was built during the reign of:',options:['Mahendravarman I','Narasimhavarman I','Rajasimha','Nandivarman'],ai:2,exp:'Narasimhavarman II (Rajasimha) built structural temples.'},
{q:'Which dynasty ruled Tamil Nadu during the "Dark Age" before the Pallavas/Pandyas?',options:['Cholas','Kalabhras','Cheras','Nayaks'],ai:1,exp:'The Kalabhra period is often called the dark age due to lack of evidence.'},
{q:'The "Kailasanathar Temple" at Kanchi was built by:',options:['Mahendravarman I','Rajasimha','Narasimhavarman I','Dantivarman'],ai:1,exp:'A masterpiece of structural architecture.'}
],
hook:'Pallava=Kanchi. Mahendra=Vichitrachitta. Mamalla=Vatapi Kondan. Rajasimha=Shore Temple. Kadungon=Pandyan.',
summary:'Political history of the Pallavas and their contribution to architecture. Evolution of temple styles from rock-cut to structural. Restoration of Pandyan power under Kadungon.'},

{day:31,topic:'TNPSC Unit 8: Imperial Cholas — Power & Art',
intro:`Today we study the 'Empire of the Seas'. The Cholas (9th-13th century) represent the peak of Tamil power. In TNPSC, 'Local Administration (Uttiramerur)' and 'Chola Bronze' are the most frequent topics. From Raja Raja's Big Temple to the Naval expeditions to Sumatra—this is the legendary Chola era. Do you know which inscription describes the 'Kudavolai' system? Let's master the Cholas today.`,
notes:[
{title:'Founder',detail:'Vijayalaya Chola (850 AD) captured Thanjavur from Muttaraiyars.'},
{title:'Raja Raja I (The Great)',detail:'Built Brihadeeswarar Temple (Thanjavur). Title: Mummidi Cholan. Naval conquest of Sri Lanka and Maldives.'},
{title:'Rajendra I',detail:'"Gangaikonda Cholan". Founded Gangaikondacholapuram. Naval expedition to Srivijaya (SE Asia).'},
{title:'Local Administration',detail:'Uttiramerur Inscription (Parantaka I) explains the Kudavolai system (lucky draw for village council).'},
{title:'Chola Art',detail:'Big Temple (Thanjavur), Airavateswara (Darasuram). Famous Chola Bronzes (Nataraja).'}
],
cards:[
{front:'Who built the Thanjavur Big Temple?',back:'Raja Raja I.'},
{front:'Inscription for Local Admin?',back:'Uttiramerur.'},
{front:'Title "Gangaikonda Cholan"?',back:'Rajendra I.'},
{front:'Chola village election system?',back:'Kudavolai.'},
{front:'Founder of Imperial Cholas?',back:'Vijayalaya.'}
],
q:[
{q:'The "Uttiramerur Inscription" gives details about the village administration of:',options:['Pallavas','Pandyas','Cholas','Cheras'],ai:2,exp:'It describes the qualifications and election process of the sabha.'},
{q:'Who was the Chola king nicknamed "Gangaikonda Cholan"?',options:['Raja Raja I','Rajendra I','Parantaka I','Aditya I'],ai:1,exp:'To celebrate his victory up to the Ganges river.'},
{q:'The "Airavateswara Temple" at Darasuram was built by:',options:['Raja Raja I','Rajendra I','Raja Raja II','Kulothunga I'],ai:2,exp:'One of the Great Living Chola Temples.'},
{q:'Who captured Thanjavur and made it the Chola capital?',options:['Vijayalaya','Aditya I','Raja Raja I','Rajendra I'],ai:0,exp:'He was a feudatory of the Pallavas who established the empire.'}
],
hook:'Chola=Thanjavur. Raja Raja=Big Temple. Rajendra=Ganges. Uttiramerur=Admin. Kudavolai=Election. Nataraja=Bronze.',
summary:'Rise of the Imperial Cholas from Vijayalaya. Military and naval achievements of Raja Raja and Rajendra. Detailed study of the Uttiramerur administration system. Chola architectural and artistic legacy.'},

{day:32,topic:'TNPSC Unit 8: Later Pandyas & Nayaks',
intro:`Today we study the 'End of an Era'. After the Cholas, the Pandyas returned to power, followed by the rule of the Madurai Nayaks. In TNPSC, 'Foreign Travelers (Marco Polo)' and 'Palayakarar system' origins are high-yield. Do you know which traveler called the Pandyan kingdom the 'Richest in the World'? Let's master the later medieval facts today.`,
notes:[
{title:'Later Pandyas (13th Century)',detail:'Greatest: Jatavarman Sundara Pandyan. Second Pandyan Empire. Control over Pearl fishery.'},
{title:'Foreign Accounts',detail:'Marco Polo (Venetian) and Wassaf (Persian) visited Kayal (Thoothukudi) and praised the wealth and horse trade.'},
{title:'Madurai Nayaks',detail:'Established by Viswanatha Nayak (under Vijayanagar). Introduced the "Palayakarar System" (72 Palayams).'},
{title:'Thirumalai Nayak',detail:'Greatest Nayak ruler. Built the Thirumalai Nayak Mahal at Madurai. Renovated Meenakshi Temple.'},
{title:'Social Structure',detail:'Rise of temple-centric society. Development of Tamil literature under Saiva Siddhanta.'}
],
cards:[
{front:'Who visited Pandyan kingdom twice?',back:'Marco Polo.'},
{front:'Who introduced Palayakarar system?',back:'Viswanatha Nayak.'},
{front:'Total number of Palayams?',back:'72.'},
{front:'Greatest Later Pandyan king?',back:'Jatavarman Sundara Pandyan.'},
{front:'Nayak Mahal location?',back:'Madurai.'}
],
q:[
{q:'"Marco Polo" visited the Pandyan port of _____ in the 13th century.',options:['Korkai','Kayal','Puhar','Musiri'],ai:1,exp:'Kayal in Thoothukudi was a major center for pearl and horse trade.'},
{q:'The "Palayakarar System" was introduced by Viswanatha Nayak with the help of:',options:['Ariyanatha Mudaliar','Yusuf Khan','Puli Thevar','Kattabomman'],ai:0,exp:'Ariyanatha Mudaliar was his famous minister/general.'},
{q:'Who was the Greatest king of the Madurai Nayaks?',options:['Viswanatha Nayak','Thirumalai Nayak','Rani Mangammal','Chokkanatha Nayak'],ai:1,exp:'His palace is a major tourist landmark today.'},
{q:'Which of the following Pandyan kings is known as "Emmandalamum Kondaruliyavar"?',options:['Maravarman Kulasekaran','Jatavarman Sundara Pandyan','Kadungon','Koon Pandiyan'],ai:1,exp:'Title meaning "One who conquered all lands".'}
],
hook:'Sundara Pandyan=Greatest. Marco Polo=Kayal. Nayak=Palayam (72). Ariyanatha=Minister. Madurai=Nayak capital.',
summary:'Political history of the Second Pandyan Empire. Analysis of foreign travel accounts about medieval Tamil Nadu. Origins and structure of the Palayakarar system. Nayak architecture and administration.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC Unit 8 Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'TN Culture Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Unit 8 '+d.topic),why:'Mastering TN history and culture for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Unit 8',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:6,topic:'Pathinenkilkanakku & 18 Lesser Texts',
notes:[
{title:'பதினெண்கீழ்க்கணக்கு',detail:'18 didactic/ethical works written after Sangam period. Shorter and more moralistic than Sangam works. Key texts: Thirukkural(Thiruvalluvar), Naladiyar(Jain monks,400 verses), Pazhamozhi Nanuru(400 proverbs), Inna Narpadu(20 bad things), Iniyavai Narpadu(20 good things), Acharakovai, Thirikadugam.'},
{title:'Key Texts for TNPSC',detail:'Naladiyar: 400 verses on ethics. By Jain monks. Compiled by Panniru Thirumurai. Thirikadugam: Written by Nallatanar. Like a 3-ingredient medicine for soul. Acharakovai: 100 verses on conduct. Inna Narpadu vs Iniyavai Narpadu: contrasting pairs — always tested together.'},
{title:'Pathinenbmelkanakku (18 Major Works)',detail:'8 Anthologies (Ettuthokai): Purananuru, Akananuru, Kuruntokai, Natrinai, Kalittokai, Aingurunuru, Padirruppattu, Paripatal. 10 Idylls (Pattuppattu): Including Tirumurugarruppadai, Maduraikkanji, Sirupanaatruppadai.'},
{title:'Classification Pattern',detail:'TNPSC often asks: "Which of these belongs to Pathinenmelkanakku vs Kilkanakku?" Key distinction: Melkanakku=Sangam era(older,secular). Kilkanakku=Post-Sangam(ethical,didactic,shorter).'}
],
hook:'TNPSC Trap: Thirukkural is in Pathinenkilkanakku (18 lesser/lower texts) — NOT Sangam literature proper. Naladiyar=Jain monks=400 verses. Thirikadugam=3-ingredient soul medicine. Classification question: Kilkanakku=post-Sangam ethical texts. Melkanakku=Sangam secular anthology.',
cards:[
{front:'Naladiyar — யார் எழுதினார்? எத்தனை பாடல்கள்?',back:'Naladiyar=400 verses. Written by Jain monks (பல்புலவர்). Compiled by Panniru Thirumurai. Ethical/didactic content. Part of Pathinenkilkanakku.'},
{front:'Thirukkural எந்த தொகுப்பில் உள்ளது?',back:'Pathinenkilkanakku (18 lesser didactic texts). NOT Sangam era Ettuthokai or Pattuppattu. Post-Sangam ethical literature.'},
{front:'Inna Narpadu vs Iniyavai Narpadu வேறுபாடு?',back:'Inna Narpadu=20 BAD/painful things. Iniyavai Narpadu=20 GOOD/pleasant things. Contrasting pair in Kilkanakku. Both have 20 verses each (Narpadu=40 in each).'}
],
q:[{q:'Naladiyar belongs to which category of Tamil literature?',options:['Ettuthokai (Sangam)','Pattuppattu (Sangam)','Pathinenkilkanakku','Pathinenmelkanakku'],answer_index:2,explanation:'Naladiyar is part of Pathinenkilkanakku (18 lesser/post-Sangam didactic texts). Written by Jain monks. 400 verses on ethics and morality.'},
{q:'Which of the following is correctly matched: Text — Author?',options:['Naladiyar — Thiruvalluvar','Thirukkural — Thiruvalluvar','Thirikadugam — Tolkappiyar','Tolkappiyam — Nallatanar'],answer_index:1,explanation:'Thirukkural=Thiruvalluvar. Naladiyar=Jain monks (many authors). Thirikadugam=Nallatanar. Tolkappiyam=Tolkappiyar. Classic author-text swap trap.'}
],
pyq:'High — TNPSC Tamil literature classification tested in Group 2 and Group 4.',
summary:'Pathinenkilkanakku: 18 post-Sangam ethical texts. Key: Thirukkural(Thiruvalluvar)+Naladiyar(Jain monks,400v)+Thirikadugam(Nallatanar)+Inna Narpadu(20 bad)+Iniyavai Narpadu(20 good). Melkanakku=Sangam(Ettuthokai+Pattuppattu). Kilkanakku=post-Sangam ethical. Classification is core TNPSC question type.'},

{day:7,topic:'Keezhadi Excavations & Ancient Tamil Civilisation',
notes:[
{title:'Keezhadi Discovery',detail:'Keezhadi (கீழடி) is an archaeological site in Sivaganga district, Tamil Nadu, on the banks of Vaigai river. Excavations from 2015 onwards. Conducted by Archaeological Survey of India (ASI), later Tamil Nadu Archaeology Department. Confirmed urban civilization in Tamil Nadu contemporaneous with Indus Valley Civilization.'},
{title:'Key Findings at Keezhadi',detail:'Brick structures with proper drainage. Tamil-Brahmi inscriptions (earliest Tamil writing evidence). Game pieces (dice). Copper artefacts. Graffiti marks on pottery. Spindle whorls (cloth-making). Gold ornaments. Carbon dating: 6th century BCE — pushing Tamil civilization timeline back significantly.'},
{title:'Significance',detail:'Proves urban Tamil civilization existed ~2600 years ago. Tamil-Brahmi script evidence pushes Tamil literacy to 6th century BCE. Connects to Sangam-era Madurai civilization. Challenges earlier assumptions that Tamil civilization was post-Mauryan.'},
{title:'Other Important TN Sites',detail:'Adichanallur: Bronze Age burial site (urn burials). Kodumanal: Gem and bead making centre. Arikkamedu (Pondicherry): Indo-Roman trade site. Marakkanam: Salt pan site. All appear in Samacheer Social Science books.'}
],
hook:'TNPSC Precision: Keezhadi is in SIVAGANGA district (not Madurai, though on Vaigai river). Excavations confirmed Tamil urban civilization at 6th century BCE. Tamil-Brahmi inscriptions here are EARLIEST evidence of written Tamil script. This chronology is the most-tested Keezhadi fact.',
cards:[
{front:'Keezhadi எந்த மாவட்டத்தில் உள்ளது? எந்த நதி கரையில்?',back:'Sivaganga district. Vaigai river bank. NOT Madurai district (though geographically close). Samacheer 6th Std Social Science.'},
{front:'Keezhadi-ல் கண்டுபிடிக்கப்பட்ட முக்கிய ஆதாரங்கள் என்ன?',back:'Tamil-Brahmi inscriptions (earliest Tamil writing), brick structures with drainage, dice/game pieces, copper artefacts, spindle whorls, gold ornaments. Carbon dated to 6th century BCE.'},
{front:'Adichanallur ஏன் முக்கியமானது?',back:'Bronze Age burial site (urn burials=கலசப் புதைகுழி). Ancient Tamil burial practice. Located in Thoothukudi district. Predates Keezhadi findings. Important TN archaeological site.'}
],
q:[{q:'Keezhadi excavations are located on which river bank?',options:['Kaveri','Thamirabarani','Vaigai','Palar'],answer_index:2,explanation:'Keezhadi is on the banks of Vaigai river in Sivaganga district. The Vaigai flows through the historical Madurai region — connecting Keezhadi findings to the ancient Pandya/Sangam-era Madurai civilization.'},
{q:'What is the most significant finding at Keezhadi that pushes Tamil literacy timeline backwards?',options:['Gold ornaments','Bronze tools','Tamil-Brahmi inscriptions','Terracotta figurines'],answer_index:2,explanation:'Tamil-Brahmi inscriptions at Keezhadi are the earliest evidence of written Tamil script — dated to 6th century BCE. This pushes Tamil literary tradition back by several centuries beyond previous estimates.'}
],
pyq:'Very High — TNPSC Unit 8 History. Keezhadi questions appear in every recent TNPSC exam.',
summary:'Keezhadi: Sivaganga district, Vaigai river. Excavations from 2015(ASI then TN Archaeology). Findings: Tamil-Brahmi inscriptions(earliest written Tamil)+brick structures+dice+copper. Carbon dated 6th century BCE. Proves urban Tamil civilization ~2600 years ago. Adichanallur(urn burials,Thoothukudi)+Kodumanal(gems)+Arikkamedu(Indo-Roman trade). Samacheer 6th Std.'},

{day:8,topic:'Chola Administration & Gram Sabha System',
notes:[
{title:'Chola Empire Peak',detail:'Medieval Cholas: Vijayalaya (848 CE) founded dynasty. Peak under Raja Raja Chola I (985-1014 CE) and Rajendra Chola I (1014-1044 CE). Rajendra conquered up to Ganges — earned title Gangaikonda Cholan. Built Gangaikondacholapuram as new capital. Brihadeeswara temple at Thanjavur = Raja Raja Chola I.'},
{title:'Chola Administration',detail:'Well-organized: Emperor at top. Provinces (Mandalams) → Districts (Valanadu/Nadu) → Sub-districts (Kurram) → Villages (Ur). Village self-governance was the hallmark of Chola administration. Central bureaucracy: Perundanam (senior officials), Sirudanam (junior officials).'},
{title:'Gram Sabha System — Uttiramerur Inscriptions',detail:'Uttiramerur (Kanchipuram district) inscriptions of 10th century CE record the MOST detailed ancient Indian village self-governance system. Two bodies: Ur (general village assembly) and Sabha (Brahmin village assembly). Sabha had sub-committees: Variyam. Election by lottery (kudavolai system). Disqualification criteria specified.'},
{title:'Kudavolai System',detail:'Lottery-based election. Names written on palm leaves (olai), put in pot (kuda), drawn out (kudavolai). Elected members served for one year. Clear disqualification rules: corrupt persons, those who had not rendered accounts, close relatives of members excluded. World\'s earliest recorded democratic election system.'}
],
hook:'TNPSC High-Yield: Uttiramerur inscriptions = world\'s earliest evidence of democratic local governance. Kudavolai = lottery election. Raja Raja Chola I = Brihadeeswara temple (Thanjavur, UNESCO). Rajendra Chola = Gangaikonda Cholan = new capital Gangaikondacholapuram. These 4 facts cover 80% of TNPSC Chola questions.',
cards:[
{front:'உத்திரமேரூர் கல்வெட்டு ஏன் முக்கியமானது?',back:'Records world\'s earliest detailed democratic village election system (Kudavolai=lottery). 10th century CE Chola period. Kanchipuram district. Evidence of Gram Sabha self-governance.'},
{front:'ராஜராஜ சோழன் I கட்டிய கோயில் எது?',back:'Brihadeeswara Temple (பெரிய கோயில்), Thanjavur. Built 1010 CE. UNESCO World Heritage Site. Also called Rajarajeswaram.'},
{front:'ராஜேந்திர சோழன் ஏன் "கங்கை கொண்ட சோழன்" என்று அழைக்கப்பட்டார்?',back:'Rajendra Chola I conquered territories up to the Ganges river (1014-1044 CE). Brought Ganga water to TN. Built new capital Gangaikondacholapuram. Title: Gangaikonda Cholan.'}
],
q:[{q:'The Uttiramerur inscriptions record which of the following?',options:['Chola military campaigns','Village self-governance and Kudavolai election system','Land revenue collection methods','Temple construction techniques'],answer_index:1,explanation:'Uttiramerur inscriptions (Kanchipuram, 10th century CE) detail the village Sabha election system including the Kudavolai (lottery) method, committee structure, and disqualification criteria — earliest evidence of structured democratic local governance.'},
{q:'Brihadeeswara temple at Thanjavur was built by which Chola ruler?',options:['Vijayalaya','Kulottunga I','Raja Raja Chola I','Rajendra Chola I'],answer_index:2,explanation:'Brihadeeswara temple (also called Rajarajeswaram/Periya Kovil) at Thanjavur was built by Raja Raja Chola I in 1010 CE. UNESCO World Heritage Site. Rajendra built Gangaikondacholapuram — different temple and city.'}
],
pyq:'Very High — TNPSC Unit 8 and Tamil Culture. Chola administration and Uttiramerur appear frequently.',
summary:'Medieval Cholas: Vijayalaya(848CE)→Raja Raja I(Brihadeeswara Temple,UNESCO)→Rajendra I(Gangaikonda Cholan,Gangaikondacholapuram). Admin: Mandalam→Nadu→Kurram→Ur. Uttiramerur: Kudavolai lottery election, world\'s earliest democracy evidence. Samacheer 7th Std Social Science.'},

{day:9,topic:'Pallava & Pandya Dynasties — Art & Administration',
notes:[
{title:'Pallava Dynasty',detail:'Capital: Kanchipuram. Key rulers: Mahendravarman I (cave temples, converted from Jainism), Narasimhavarman I (Shore Temple era, defeated Pulakesi II — earned title Mamallan/great wrestler), Narasimhavarman II (Shore Temple, Mahabalipuram). UNESCO: Mahabalipuram (Group of Monuments) is Pallava achievement.'},
{title:'Pallava Art & Architecture',detail:'Rock-cut cave temples (Mandapas): Mahendravarman I style. Structural temples (built stone): Narasimhavarman II style. Mahabalipuram (Mamallapuram): Pancha Rathas (5 chariots carved from single rock), Shore Temple, Arjuna\'s Penance (Descent of Ganga — world\'s largest bas-relief). Kailasanatha Temple at Kanchipuram.'},
{title:'Pandya Dynasty',detail:'Capital: Madurai. Ancient dynasty — mentioned in Sangam literature, Ashokan edicts, and Megasthenes\' Indica. Known as the Pearl Fishery kings. Jatavarman Sundara Pandyan (13th century CE) extended Pandya power. Pandyas defeated Cholas in 13th century.'},
{title:'Pandya Contributions',detail:'Patronized 3rd Tamil Sangam. Pearl trade (Gulf of Mannar). Meenakshi Amman Temple (Madurai) associated with Pandya rule. Last Sangam work compiled under Pandya patronage. Pandyas declined after Delhi Sultanate invasions (Malik Kafur, 1311 CE).'}
],
hook:'TNPSC Pattern: Mahabalipuram=Pallava(Narasimhavarman I/II). Pancha Rathas=5 monolithic ratha temples carved from single rock. Shore Temple=structural temple (NOT rock-cut). Kailasanatha Temple(Kanchipuram)=oldest structural temple in TN. Pandyas=Madurai+Pearl fishery+3rd Sangam patronage.',
cards:[
{front:'மாமல்லபுரம் யாரால் கட்டப்பட்டது?',back:'Pallava rulers — mainly Narasimhavarman I (Mamallan) who gave name to Mamallapuram. Shore Temple built by Narasimhavarman II (Rajasimha). UNESCO World Heritage Site.'},
{front:'பஞ்சரதம் என்றால் என்ன?',back:'5 monolithic ratha temples at Mahabalipuram. Carved from a SINGLE granite rock (not built from separate stones). Named after Pandavas. Pallava era. Samacheer 6th Std Social Science.'},
{front:'பாண்டிய அரசர்களின் தலைநகரம் எது? அவர்கள் எதற்கு பிரசித்தம்?',back:'Capital=Madurai. Famous for: Pearl fishing (Gulf of Mannar), patronizing 3rd Tamil Sangam, Meenakshi Amman Temple. Declined after Malik Kafur invasion (1311 CE).'}
],
q:[{q:'The Pancha Rathas at Mahabalipuram are significant because?',options:['Built by using bricks','Carved from a single granite rock','Built during Chola period','Oldest temples in Tamil Nadu'],answer_index:1,explanation:'Pancha Rathas=5 ratha (chariot-shaped) temples at Mahabalipuram. Entirely MONOLITHIC — carved from a single large granite rock. Pallava period. This monolithic technique is their key distinguishing feature in exam questions.'},
{q:'Which dynasty is credited with patronizing the 3rd Tamil Sangam at Madurai?',options:['Chola','Pallava','Pandya','Chera'],answer_index:2,explanation:'Pandya kings of Madurai were the patrons of the Tamil Sangams — including the 3rd Sangam whose works survive. Madurai was the Pandya capital. Pearl fishing (Gulf of Mannar) was their economic backbone.'}
],
pyq:'High — TNPSC Unit 8 TN History and Culture.',
summary:'Pallava: Capital Kanchipuram. Mahendravarman I(cave temples)+Narasimhavarman I(Mamalapuram, title Mamallan)+Narasimhavarman II(Shore Temple). Mahabalipuram: Pancha Rathas(monolithic)+Shore Temple+Arjuna\'s Penance(world\'s largest bas-relief). UNESCO. Pandya: Capital Madurai. Pearl fishery+3rd Sangam patronage+Meenakshi Temple. Declined 1311CE(Malik Kafur).'},

{day:10,topic:'Dravidian Movement: Justice Party & Periyar',
notes:[
{title:'Justice Party (1916)',detail:'Founded 1916 as South Indian Liberal Federation. Later called Justice Party. Founded by: T.M. Nair, P. Thyagaraja Chetty, C. Natesa Mudaliar. Purpose: Non-Brahmin movement for representation in government services. Opposed Brahmin dominance in public service (ICS, law, medicine). Ran Justice newspaper — hence the name.'},
{title:'Self-Respect Movement (1925)',detail:'Founded by Periyar (E.V. Ramasamy Naicker) in 1925. Rejected Brahminical supremacy, casteism, and religious superstition. Self-Respect Marriages (no priest, no rituals). Rationalism: Periyar burned copies of Manu Smriti. Thanthai Periyar = Father Periyar (title from Dravidar Kazhagam members).'},
{title:'Periyar\'s Key Positions',detail:'Opposed Hindi imposition (Anti-Hindi agitation 1937-40). Opposed caste-based discrimination. Atheist — rejected religion as tool of oppression. Founded Dravidar Kazhagam (DK) in 1944 (renamed from Justice Party/Periyar\'s faction). Women\'s rights: supported widow remarriage and female education.'},
{title:'C.N. Annadurai (Anna)',detail:'Disciple of Periyar. Founded Dravida Munnetra Kazhagam (DMK) in 1949 (broke from DK). Chief Minister of Tamil Nadu (1967-1969) — first non-Congress CM of any state in India. Renamed Madras State to Tamil Nadu (1969). Champion of Tamil language rights. Died in office 1969.'}
],
hook:'TNPSC Timeline: Justice Party=1916(non-Brahmin political movement). Self-Respect Movement=1925(Periyar,social reform). DK=1944(Periyar). DMK=1949(Anna,broke from DK). Anti-Hindi agitation=1937-40. Tamil Nadu renamed from Madras State=1969(Anna). These dates and founder names are tested every TNPSC cycle.',
cards:[
{front:'Justice Party எப்போது நிறுவப்பட்டது? யார் நிறுவினார்கள்?',back:'1916. Founders: T.M. Nair, P. Thyagaraja Chetty, C. Natesa Mudaliar. Purpose: Non-Brahmin political representation. Official name: South Indian Liberal Federation.'},
{front:'சுயமரியாதை இயக்கம் எப்போது? யார் நிறுவினார்?',back:'1925. E.V. Ramasamy Naicker (Periyar). Opposed caste system, religious superstition, Brahmin dominance. Promoted rationalism and self-respect marriages (no priest).'},
{front:'அண்ணாதுரை (Anna) முக்கிய பங்களிப்புகள் என்ன?',back:'Founded DMK(1949). First non-Congress CM of any state(1967-Tamil Nadu). Renamed Madras State to Tamil Nadu(1969). Champion of Tamil language rights. Died in office 1969.'}
],
q:[{q:'The Self-Respect Movement was founded in which year and by whom?',options:['1916 by T.M. Nair','1925 by Periyar (E.V.R. Naicker)','1944 by C.N. Annadurai','1949 by Periyar'],answer_index:1,explanation:'Self-Respect Movement=1925, Periyar. Justice Party=1916(T.M.Nair). DK=1944(Periyar). DMK=1949(Anna). Classic year-founder swap trap.'},
{q:'C.N. Annadurai\'s most significant administrative achievement as Chief Minister was?',options:['Founding the Self-Respect Movement','Establishing Dravidar Kazhagam','Renaming Madras State to Tamil Nadu','Launching Anti-Hindi agitation'],answer_index:2,explanation:'Anna renamed Madras State to Tamil Nadu in 1969 as CM. He was the first non-Congress CM of any Indian state (1967). The Anti-Hindi agitation was led by Periyar in 1937-40, before Anna became CM.'}
],
pyq:'Very High — Every TNPSC Unit 8. Dravidian movement is the highest-yield history topic for TNPSC.',
summary:'Justice Party(1916): T.M.Nair+Thyagaraja Chetty — Non-Brahmin political representation. Self-Respect Movement(1925): Periyar — rationalism+anti-caste+self-respect marriages. DK(1944,Periyar). DMK(1949,Anna — broke from DK). Anti-Hindi agitation(1937-40,Periyar). Anna: 1st non-Congress CM(1967)+renamed Tamil Nadu(1969)+died in office. Samacheer 10th Std.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏛️ TNPSC Samacheer Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC History: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC '+d.topic+' samacheer history'),why:'Samacheer-based coaching tutorial.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('TNPSC Days 6-10 COMPLETE');
}
push();

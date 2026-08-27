require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:11,topic:'TNPSC General Tamil: Medieval Literature & Bhakti Movement',
intro:`Today we enter the 'Era of Devotion' and 'Grand Epics'. After the 5 great epics, Tamil literature was dominated by the Bhakti movement (Nayanmars and Alvars) and the majestic 'Kamba Ramayanam'. This period saw the rise of 'Periya Puranam' and the 'Divya Prabandham'. For TNPSC, knowing the 63 Nayanmars, the 12 Alvars, and the unique poetic style of Kambar is essential. These works are the emotional and cultural heartbeat of Tamil Nadu.`,
notes:[
{title:'Kamba Ramayanam',detail:'Author: Kambar (12th Century). Original title: "Ramavataram". It has 6 Kandams (Balakandam to Yutthakandam). Kambar is praised as "Kavi Chakravarthi". The work is famous for its "Virutha Pa" meter and rich metaphors.'},
{title:'Periya Puranam',detail:'Author: Sekkizhar (12th Century). It narrates the lives of the 63 Nayanmars (Saivite saints). It is also known as "Thiruthondar Puranam". Sekkizhar was a minister in the Chola court.'},
{title:'Bhakti Literature (Saivism)',detail:'12 Thirumurais. 1-3: Sambandar, 4-6: Appar, 7: Sundarar (Thevaram). 8: Manickavasagar (Thiruvasakam). 12: Periya Puranam. Nayanmars = 63.'},
{title:'Bhakti Literature (Vaishnavism)',detail:'Naalayira Divya Prabandham (4000 hymns). Composed by the 12 Alvars. Compiled by Nathamuni. Includes "Thiruppavai" by Andal (the only female Alvar).'},
{title:'Other Medieval Works',detail:'Kalingathu Parani (Jayankondar - First Parani), Moovar Ula (Ottakkoothar). This was a period of "Prabandham" (minor literature types like Ula, Parani, Thoothu).'}
],
cards:[
{front:'Original name of Kamba Ramayanam?',back:'Ramavataram.'},
{front:'How many Alvars were there?',back:'12 Alvars.'},
{front:'How many Nayanmars were there?',back:'63 Nayanmars.'},
{front:'Who wrote Periya Puranam?',back:'Sekkizhar.'},
{front:'Who is the only female Alvar?',back:'Andal.'}
],
q:[
{q:'கம்பராமாயணம் எத்தனை காண்டங்களைக் கொண்டது?',options:['5','6','7','9'],ai:1,exp:'Balakandam, Ayodhyakandam, Aranyakandam, Kishkindakandam, Sundarakandam, Yutthakandam.'},
{q:'"பெரியபுராணம்" யாரால் இயற்றப்பட்டது?',options:['சேக்கிழார்','கம்பர்','ஒட்டக்கூத்தர்','புகழேந்தி'],ai:0,exp:'Sekkizhar wrote Periya Puranam describing the lives of 63 Nayanmars.'},
{q:'சைவத் திருமுறைகள் மொத்தம் எத்தனை?',options:['10','12','18','4000'],ai:1,exp:'There are 12 Saivite Thirumurais.'},
{q:'"திருவாவாய்" (Thiruppavai) பாடியவர் யார்?',options:['காரைக்கால் அம்மையார்','ஆண்டால்','வாணிதாசன்','பாரதியார்'],ai:1,exp:'Andal composed Thiruppavai and Nachiyar Thirumozhi.'}
],
hook:'Ramavataram=Kamba Ramayanam. Nayanmars=63. Alvars=12. Periya Puranam=Sekkizhar. Andal=Thiruppavai. Kambar=12th Century.',
summary:'Medieval Tamil Literature overview. Detailed study of Kamba Ramayanam and Periya Puranam. Bhakti movement (Saivism and Vaishnavism). Compilation of Thirumurai and Divya Prabandham.'},

{day:12,topic:'TNPSC General Tamil: Modern Literature & Poets',
intro:`Today we move to the 'Modern Era' of Tamil poetry—the period of social reform and national awakening. We start with the 'Mahakavi' Bharathiyar, who revolutionized Tamil poetry with simple language and powerful themes of freedom and equality. We also study Bharathidasan, the 'Pavendar', who carried forward the Dravidian and social reform ideals. For TNPSC, knowing their works, pseudonyms, and famous lines is crucial. Let's master the 'Poets of the People' today.`,
notes:[
{title:'Subramania Bharathiyar (1882-1921)',detail:'Titles: Mahakavi, Pattu-kk-oru Pulavan, National Poet. Famous works: Panchali Sabatham, Kannan Pattu, Kuyil Pattu. Editor of "India" and "Vijaya". He introduced "Pudhukkavithai" (Modern poetry) in Tamil.'},
{title:'Bharathidasan (1891-1964)',detail:'Real name: Kanakasubburatnam. Titles: Pavendar, Puratchikavi. Famous works: Pandiyan Parisu, Azhagin Sirippu, Kudumba Vilakku. He was a follower of Bharathiyar and a major voice in the Dravidian movement.'},
{title:'Kavimani Desigavinayagam Pillai',detail:'Famous for "Asia Jothi" (Life of Buddha) and "Marumakkal Vazhi Maanmiyam". He is known for simple and sweet poems for children.'},
{title:'Namakkal Kavignar V. Ramalingam Pillai',detail:'The First State Poet of TN. Famous line: "Kathiyindri Raththaminri Yuttham Ondru Varuguthu". He was a staunch Gandhian.'},
{title:'Contemporary Trends',detail:'Rise of Pudhukkavithai (Na. Pichamurthy), Short stories (Pudhumaippithan), and the influence of the Self-Respect movement on literature.'}
],
cards:[
{front:'Real name of Bharathidasan?',back:'Kanakasubburatnam.'},
{front:'Who wrote "Panchali Sabatham"?',back:'Bharathiyar.'},
{front:'Who is the "Puratchikavi" (Revolutionary Poet)?',back:'Bharathidasan.'},
{front:'Who is the "First State Poet" of Tamil Nadu?',back:'Namakkal Kavignar V. Ramalingam Pillai.'},
{front:'Editor of the magazine "India"?',back:'Bharathiyar.'}
],
q:[
{q:'"பாஞ்சாலி சபதம்" யாரால் இயற்றப்பட்டது?',options:['பாரதிதாசன்','பாரதியார்','கவிமணி','நாமக்கல் கவிஞர்'],ai:1,exp:'Bharathiyar wrote Panchali Sabatham as a symbol of India\'s freedom struggle.'},
{q:'பாரதிதாசனின் இயற்பெயர் என்ன?',options:['சுப்பிரமணியன்','கனகசுப்புரத்தினம்','வேங்கடரத்தினம்','இராமானுஜம்'],ai:1,exp:'He changed his name to Bharathidasan out of respect for Bharathiyar.'},
{q:'"கத்தியின்றி இரத்தமின்றி யுத்தம் ஒன்று வருகுது" - பாடியவர் யார்?',options:['பாரதியார்','பாரதிதாசன்','நாமக்கல் கவிஞர்','கவிமணி'],ai:2,exp:'Namakkal Kavignar Ramalingam Pillai, a Gandhian poet, wrote this during the Salt Satyagraha.'},
{q:'"புதுக்கவிதை"யின் தந்தை என அழைக்கப்படுபவர்?',options:['பாரதியார்','ந.பிச்சமூர்த்தி','பாரதிதாசன்','வாணிதாசன்'],ai:1,exp:'Na. Pichamurthy is considered the father of modern "Pudhukkavithai" in Tamil.'}
],
hook:'Bharathiyar=Mahakavi (Panchali Sabatham). Bharathidasan=Pavendar (Kudumba Vilakku). Namakkal Kavignar=State Poet. Kavimani=Asia Jothi.',
summary:'Introduction to modern Tamil literature. Detailed study of Bharathiyar and Bharathidasan. Role of poets in the freedom movement and social reform. Key contemporary writers.'},

{day:13,topic:'TNPSC General Tamil: Classical Status & Language Policy',
intro:`Today we study the 'Global Recognition' of Tamil. In 2004, Tamil became the first language in India to be declared a 'Classical Language' (Semmozhi). We explore the 11 criteria for classical status and the tireless work of scholars like Caldwell and Ellis in proving the antiquity of Tamil. We also look at the Anti-Hindi agitations in Tamil Nadu, which shaped the state's unique 'Two-Language Policy'. For a TNPSC aspirant, this is critical for understanding the socio-political importance of the language you are studying.`,
notes:[
{title:'Classical Language Status (செம்மொழி)',detail:'Declared on Oct 12, 2004. Criteria: High antiquity (1500-2000 years), independent tradition, rich literature. Scholar Parithimaal Kalaignar was the first to call Tamil a classical language in the 19th century.'},
{title:'Robert Caldwell & Dravidian Linguistics',detail:'Authored "A Comparative Grammar of the Dravidian or South-Indian Family of Languages" (1856). He proved that Dravidian languages are an independent family and not derived from Sanskrit.'},
{title:'Anti-Hindi Agitations (மொழிப்போர்)',detail:'Major agitations in 1937 (under C. Rajagopalachari\'s govt) and 1965 (under Congress govt). These movements led to the legal adoption of the Two-Language Policy (Tamil and English) in TN.'},
{title:'Tamil Language Policy',detail:'Official Language Act 1956. Use of Tamil in administration, courts, and education. World Tamil Conferences (Ulaga Thamizh Maanadu) held globally to promote the language.'},
{title:'Scholars who Loved Tamil',detail:'G.U. Pope (wanted "Tamil Student" on his grave), Veeramamunivar (Beschi - compiled Chathurakarathi), Francis Whyte Ellis (first to propose the Dravidian family theory).'}
],
cards:[
{front:'When was Tamil declared a Classical Language?',back:'October 12, 2004.'},
{front:'Who wrote "Comparative Grammar of Dravidian Languages" in 1856?',back:'Robert Caldwell.'},
{front:'Scholar who wanted "Tamil Student" on his grave?',back:'G.U. Pope.'},
{front:'Which policy does TN follow regarding languages?',back:'Two-Language Policy (Tamil and English).'},
{front:'Who was the first to call Tamil a "Classical Language" (Semmozhi)?',back:'Parithimaal Kalaignar.'}
],
q:[
{q:'தமிழ் செம்மொழியாக அறிவிக்கப்பட்ட ஆண்டு எது?',options:['2000','2002','2004','2010'],ai:2,exp:'Tamil was the first language in India to get this status in 2004.'},
{q:'"திராவிட மொழிகளின் ஒப்பிலக்கணம்" என்ற நூலை எழுதியவர்?',options:['கால்டுவெல்','ஜி.யு.போப்','வீரமாமுனிவர்','எல்லிஸ்'],ai:0,exp:'Robert Caldwell (1856) established the independence of Dravidian languages.'},
{q:'தமிழகத்தில் "இருமொழி கொள்கை" (Two-Language Policy) எப்போது சட்டப்பூர்வமானது?',options:['1956','1965','1967','1972'],ai:2,exp:'After the DMK came to power in 1967, following the 1965 agitations.'},
{q:'"தமிழைச் செம்மொழி என்று முதன்முதலில் கூறியவர்?"',options:['கால்டுவெல்','பரிதிமாற்கலைஞர்','மறைமலையடிகள்','உ.வே.சா'],ai:1,exp:'Parithimaal Kalaignar (V.G. Suryanarayana Sastri) proposed this in the 19th century.'}
],
hook:'Classical status=2004. Caldwell=1856. Two-language policy=Tamil+English. Parithimaal Kalaignar=Semmozhi proposer. G.U. Pope=Tamil Student.',
summary:'Criteria and history of Tamil\'s Classical status. Contribution of European scholars (Caldwell, Pope, Beschi). History of language agitations in TN. Current language policy and institutions.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🎯 TNPSC Tamil Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Tamil Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC General Tamil '+d.topic),why:'Samacheer book based content for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('TNPSC Days 11-13 v2 COMPLETE');
}
push();

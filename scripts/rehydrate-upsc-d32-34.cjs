require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:32,topic:'UPSC History: The Maratha Empire & Shivaji',
intro:`Today we study the rise of the 'Mountain Rats'—the Marathas. Under Chhatrapati Shivaji Maharaj, the Marathas challenged the might of the Mughals and established a decentralized but powerful 'Swarajya'. We focus on Shivaji's 'Ashtapradhan' (council of 8 ministers) and the unique Maratha tax system—Chauth and Sardeshmukhi. For UPSC, understanding the transition from Shivaji's kingdom to the 'Peshwa' confederacy and the importance of Maratha guerrilla warfare is essential.`,
notes:[
{title:'Shivaji Maharaj (1627–1680)',detail:'Founded the Maratha Kingdom. Famous for guerrilla warfare (Ganimi Kava). Forts: Raigad (Capital), Pratapgad. Coronation in 1674 at Raigad.'},
{title:'Ashtapradhan (Council of 8)',detail:'1. Peshwa (PM). 2. Amatya (Finance). 3. Mantri (Intelligence). 4. Sachiv (Correspondence). 5. Sumant (Foreign). 6. Senapati (Military). 7. Panditrao (Religious). 8. Nyayadhish (Justice).'},
{title:'Maratha Taxation',detail:'Chauth: 1/4th of revenue paid by non-Maratha territories to avoid Maratha raids. Sardeshmukhi: Additional 10% tax paid to Shivaji as the hereditary head (Sardeshmukh) of the land.'},
{title:'The Peshwas (1713–1818)',detail:'Power shifted from the Chhatrapati to the Peshwa (Brahmin PMs). Balaji Vishwanath, Baji Rao I (Soldier-Statesman), Balaji Baji Rao. Third Battle of Panipat (1761): Marathas (Sadashiv Rao Bhau) defeated by Ahmad Shah Abdali.'},
{title:'Maratha Confederacy',detail:'The empire split into 5 centers: Peshwa (Pune), Scindia (Gwalior), Holkar (Indore), Gaekwad (Baroda), Bhonsle (Nagpur).'}
],
cards:[
{front:'What is the "Ashtapradhan"?',back:'Shivaji\'s council of 8 ministers.'},
{front:'What is "Chauth"?',back:'1/4th land revenue tax paid to Marathas to avoid raids.'},
{front:'What is "Sardeshmukhi"?',back:'Additional 10% tax claimed by Shivaji as head of the land.'},
{front:'Who was the most famous Peshwa (soldier-statesman)?',back:'Baji Rao I.'},
{front:'Battle of Panipat III (1761)—who fought?',back:'Marathas vs Ahmad Shah Abdali (Afghan).'}
],
q:[
{q:'In Shivaji\'s Ashtapradhan, the "Peshwa" was responsible for:',options:['Finance','Foreign Affairs','General Administration','Military'],ai:2,exp:'The Peshwa was the Prime Minister responsible for general administration and representing the King.'},
{q:'The "Chauth" tax was essentially:',options:['A tax on Maratha citizens','A protection fee paid by neighboring states','A tax on religious rituals','A customs duty'],ai:1,exp:'It was 25% of revenue paid by other states to ensure Marathas would not raid them.'},
{q:'The Third Battle of Panipat (1761) resulted in the defeat of:',options:['Mughals','Marathas','Sikhs','British'],ai:1,exp:'Ahmad Shah Abdali defeated the Marathas, significantly weakening their bid for pan-India rule.'},
{q:'Which Maratha dynasty ruled from Gwalior?',options:['Holkar','Scindia','Gaekwad','Bhonsle'],ai:1,exp:'Scindia (Gwalior), Holkar (Indore), Gaekwad (Baroda), Bhonsle (Nagpur), Peshwa (Pune).'}
],
hook:'Ashtapradhan=8 ministers. Chauth=1/4. Sardeshmukhi=10%. Panipat III=1761. Scindia=Gwalior. Holkar=Indore. Peshwa=Pune.',
summary:'Shivaji\'s rise and administration. Ashtapradhan and Tax system (Chauth/Sardeshmukhi). Rise of the Peshwas. Maratha Confederacy and the impact of the Third Battle of Panipat.'},

{day:33,topic:'UPSC History: Bhakti & Sufi Movements',
intro:`Today we study the 'Spiritual Heart' of Medieval India. The Bhakti and Sufi movements were parallel streams of mysticism that emphasized love, devotion, and equality over rigid rituals and caste. From the Alvars and Nayanmars of the South to Kabir, Nanak, and Mirabai in the North, and the Sufi Silsilahs like Chisti and Suhrawardi—these movements shaped India's composite culture (Ganga-Jamuni Tehzeeb). For UPSC, focus on the 'Saints', their 'Philosophy' (Saguna vs Nirguna), and their 'Literary contributions' in regional languages.`,
notes:[
{title:'Sufi Movement',detail:'Mystical dimension of Islam. Key concepts: Pir (Teacher), Murid (Disciple), Khanqah (Hospice), Sama (Music). Silsilahs: 1. Chisti (Moinuddin Chisti, Nizamuddin Auliya - most popular, simple life). 2. Suhrawardi (Orthodox, close to state). 3. Naqshbandi (very orthodox).'},
{title:'Bhakti Movement (North)',detail:'Nirguna (God without form): Kabir (Dohas), Guru Nanak (Sikhism founder). Saguna (God with form): Tulsidas (Ramcharitmanas), Surdas, Mirabai (Krishna devotee), Chaitanya Mahaprabhu (Kirtan).'},
{title:'Bhakti Movement (South/West)',detail:'Alvars (Vaishnava) and Nayanmars (Saiva). Shankaracharya (Advaita - Non-dualism). Ramanuja (Vishishtadvaita). Basavanna (Lingayats/Virashaivas - Karnataka). Vithoba cult (Maharashtra - Tukaram, Namdev, Jnaneshwar).'},
{title:'Common Features',detail:'Discarded rituals and sacrifices. Preached in regional languages (Tamil, Hindi, Marathi, Punjabi). Rejected caste barriers. Emphasized a personal bond with God.'},
{title:'Impact on Literature',detail:'Growth of regional languages. Kabir\'s Bijak, Guru Granth Sahib (Sikhism), Ramcharitmanas, Abhangas (Maharashtra).'}
],
cards:[
{front:'Who founded the Chisti Silsilah in India?',back:'Moinuddin Chisti (Dargah at Ajmer).'},
{front:'What is the difference between Saguna and Nirguna Bhakti?',back:'Saguna: Worship of God WITH form/idols (e.g., Rama, Krishna). Nirguna: Worship of God WITHOUT form (e.g., Kabir\'s universal God).'},
{front:'Who wrote the "Ramcharitmanas"?',back:'Tulsidas.'},
{front:'Who was the "Saint of the Common Man" in Maharashtra?',back:'Tukaram (famous for Abhangas).'},
{front:'What is "Advaita" philosophy?',back:'Non-dualism (Self and Brahman are one), propounded by Shankaracharya.'}
],
q:[
{q:'The "Bijak" is a compilation of the teachings of:',options:['Guru Nanak','Kabir','Tulsidas','Chaitanya'],ai:1,exp:'Bijak is the main scripture for followers of Kabir.'},
{q:'Which Sufi saint was known as "Mahbub-i-Ilahi" (Beloved of God)?',options:['Moinuddin Chisti','Nizamuddin Auliya','Bakhtiyar Kaki','Salim Chisti'],ai:1,exp:'Nizamuddin Auliya of Delhi was highly revered for his spirituality.'},
{q:'The philosophy of "Vishishtadvaita" (Qualified Non-dualism) was propounded by:',options:['Shankaracharya','Ramanuja','Madhvacharya','Vallabhacharya'],ai:1,exp:'Ramanuja (12th century) emphasized devotion to Vishnu.'},
{q:'Which Bhakti saint introduced "Kirtan" (congregational singing) in Bengal?',options:['Kabir','Mirabai','Chaitanya Mahaprabhu','Tukaram'],ai:2,exp:'Chaitanya Mahaprabhu popularized the worship of Krishna through music.'}
],
hook:'Chisti=Ajmer. Kabir=Nirguna. Tulsidas=Saguna. Advaita=Shankara. Vishishtadvaita=Ramanuja. Kirtan=Chaitanya. Regional languages grew.',
summary:'Origins and features of Sufism and Bhakti. Major Sufi Silsilahs and Bhakti saints. Philosophical differences (Saguna/Nirguna, Advaita/Vishishtadvaita). Impact on society and literature.'},

{day:34,topic:'UPSC History: Decline of Mughals & Regional Powers',
intro:`Today we study the 'Great Fragmentation'. After the death of Aurangzeb in 1707, the Mughal Empire rapidly declined, giving way to independent regional powers like Bengal, Awadh, Hyderabad, and the Sikhs. We focus on the 'Later Mughals' (the 'Kings of Delhi') and the causes of decline—from the Jagirdari crisis to the invasions of Nadir Shah and Ahmad Shah Abdali. For UPSC, understanding how these regional states formed is the bridge to Modern History and the British conquest.`,
notes:[
{title:'Causes of Mughal Decline',detail:'Weak successors. Jagirdari Crisis (shortage of land). Financial bankruptcy due to Aurangzeb\'s wars. Invasions: Nadir Shah (1739 - took Peacock Throne), Abdali (Panipat III). Rise of autonomous states.'},
{title:'Successor States',detail:'Hyderabad: Founded by Nizam-ul-Mulk (Asaf Jah) in 1724. Bengal: Murshid Quli Khan. Awadh: Saadat Khan (Burhan-ul-Mulk). These states nominally accepted Mughal authority but were independent.'},
{title:'The Sikhs',detail:'Transformed into a military brotherhood by Guru Gobind Singh (Khalsa). Rise of Ranjit Singh (Sher-e-Punjab) who unified the Misls and established the Sikh Empire in Punjab.'},
{title:'Mysore & Hyder Ali',detail:'Rise of Hyder Ali and Tipu Sultan in the South. They modernised the army and posed a serious challenge to the British.'},
{title:'The Jats & Rajputs',detail:'Jats: Suraj Mal (Plato of the Jats). Rajputs: Amber, Marwar regained independence but faced internal conflicts.'}
],
cards:[
{front:'Who founded the state of Hyderabad in 1724?',back:'Nizam-ul-Mulk (Asaf Jah).'},
{front:'Who took the "Peacock Throne" and Koh-i-Noor to Persia in 1739?',back:'Nadir Shah.'},
{front:'Who founded the "Khalsa" panth?',back:'Guru Gobind Singh (1699).'},
{front:'First independent Nawab of Bengal?',back:'Murshid Quli Khan.'},
{front:'Who is known as the "Plato of the Jat tribe"?',back:'Suraj Mal.'}
],
q:[
{q:'In 1739, the Mughal Emperor who was defeated and captured by Nadir Shah was:',options:['Farrukhsiyar','Muhammad Shah','Shah Alam II','Bahadur Shah I'],ai:1,exp:'Muhammad Shah (Rangeela) was the ruler during Nadir Shah\'s invasion.'},
{q:'The state of Awadh was founded by:',options:['Murshid Quli Khan','Saadat Khan','Chin Qilich Khan','Safdar Jung'],ai:1,exp:'Saadat Khan (Burhan-ul-Mulk) was appointed governor and eventually became independent.'},
{q:'The "Dal Khalsa" was a system of military organization among:',options:['Marathas','Sikhs','Jats','Rajputs'],ai:1,exp:'The Sikhs organized themselves into "Misls" and the combined force was "Dal Khalsa".'},
{q:'Which Mughal Emperor was known as "Shah-i-Bekhabar"?',options:['Bahadur Shah I','Jahandar Shah','Farrukhsiyar','Muhammad Shah'],ai:0,exp:'Bahadur Shah I (Shah Alam I) was given this title due to his neglect of administration.'}
],
hook:'1707=Aurangzeb dies. 1739=Nadir Shah. Hyderabad=Nizam. Awadh=Saadat Khan. Bengal=Murshid Quli. Khalsa=Guru Gobind Singh.',
summary:'Decline of Mughal central authority. Invasions of Nadir Shah and Abdali. Formation of Successor states (Bengal, Awadh, Hyderabad). Rise of the Sikh Empire and Mysore. Background for British entry.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC History Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'History Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Medieval History '+d.topic),why:'Crucial for understanding the transition to Modern India.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 32-34 v2 COMPLETE');
}
push();

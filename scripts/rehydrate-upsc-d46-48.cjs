require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:46,topic:'UPSC History: Formation of INC & The Moderates',
intro:`Today we study the 'Birth of the Nation'. The formation of the Indian National Congress (INC) in 1885 marked the transition from localized protests to a pan-Indian political organization. We study the 'Moderates' (Dadabhai Naoroji, Gokhale)—the pioneers who believed in constitutional methods and 'Prayer, Petition, and Protest'. For UPSC, the focus is on the 'Safety Valve Theory', the 'Drain Theory', and why the Moderates are called the 'Foundational Leaders' of Indian nationalism.`,
notes:[
{title:'Formation of INC (1885)',detail:'Founded at Gokuldas Tejpal Sanskrit College, Bombay. 1st President: W.C. Bonnerjee. Founder: A.O. Hume (Retired British official). "Safety Valve Theory" (Lala Lajpat Rai) vs "Lightning Conductor" (Gokhale).'},
{title:'The Moderates (1885–1905)',detail:'Leaders: Dadabhai Naoroji, G.K. Gokhale, Pherozeshah Mehta, Surendranath Banerjee. Ideology: Liberalism, faith in British sense of justice, constitutional methods (3Ps: Prayer, Petition, Protest).'},
{title:'Moderate Contributions',detail:'1. Economic Critique: Drain of Wealth theory. 2. Administrative: Demand for Civil Service exam in India. 3. Political: Participation in Legislative Councils (Act of 1892). 4. Created a national awakening.'},
{title:'Key INC Sessions',detail:'1885 (Bombay): 1st. 1886 (Calcutta): 2nd, Naoroji. 1887 (Madras): Badruddin Tyabji (1st Muslim President). 1888 (Allahabad): George Yule (1st English President).'},
{title:'Dadabhai Naoroji',detail:'"Grand Old Man of India". 3-time INC President. First Indian to be member of British House of Commons. Wrote "Poverty and Un-British Rule in India".'}
],
cards:[
{front:'Who was the 1st President of INC?',back:'W.C. Bonnerjee.'},
{front:'What is the "Safety Valve Theory"?',back:'Idea that INC was created by British to release Indian political pressure.'},
{front:'Who was the "Grand Old Man of India"?',back:'Dadabhai Naoroji.'},
{front:'Who was the first Muslim President of INC?',back:'Badruddin Tyabji (1887 Madras session).'},
{front:'What are the "3Ps" of Moderates?',back:'Prayer, Petition, and Protest.'}
],
q:[
{q:'The first session of the Indian National Congress was presided over by:',options:['A.O. Hume','W.C. Bonnerjee','Dadabhai Naoroji','S.N. Banerjee'],ai:1,exp:'W.C. Bonnerjee was the president of the 1885 Bombay session.'},
{q:'Who among the following was NOT a "Moderate" leader?',options:['Dadabhai Naoroji','Pherozeshah Mehta','Bal Gangadhar Tilak','G.K. Gokhale'],ai:2,exp:'Tilak was the leader of the Extremist group.'},
{q:'The "Drain of Wealth" theory was mainly focused on:',options:['Religious conversion','Military expansion','Economic exploitation','Educational reforms'],ai:2,exp:'It explained how Indian capital was being transferred to Britain.'},
{q:'Who was the Viceroy of India when INC was formed?',options:['Lord Ripon','Lord Dufferin','Lord Curzon','Lord Lytton'],ai:1,exp:'Lord Dufferin was the Viceroy in 1885.'}
],
hook:'1885=Bombay (Bonnerjee). Hume=Founder. 3Ps=Moderates. Naoroji=Drain Theory. Dufferin=Viceroy. Tyabji=1st Muslim Pres.',
summary:'Circumstances of INC formation. Moderate phase ideology and leadership. Major contributions (Economic critique). Key early sessions and their significance.'},

{day:47,topic:'UPSC History: Partition of Bengal & The Extremists',
intro:`Today we study the 'Rise of Radicalism'. The Partition of Bengal (1905) by Lord Curzon was the spark that ignited the 'Swadeshi Movement'. It led to the rise of the 'Extremists' (Lal-Bal-Pal), who demanded 'Swaraj' as their birthright and rejected the 'Begging' methods of the Moderates. For UPSC, focus on the 'Surat Split' (1907), the concept of 'Passive Resistance', and the differences between Moderate and Extremist ideologies. This is the first mass movement of India.`,
notes:[
{title:'Partition of Bengal (1905)',detail:'By Lord Curzon. Reason given: Administrative convenience. Real reason: "Divide and Rule" (Dividing Hindus/Muslims). Led to the Swadeshi and Boycott Movement.'},
{title:'The Extremists (Lal-Bal-Pal)',detail:'Leaders: Lala Lajpat Rai, Bal Gangadhar Tilak, Bipin Chandra Pal, Aurobindo Ghosh. Ideology: Self-reliance, Swaraj (Self-rule), Boycott of British goods/institutions, Passive Resistance.'},
{title:'Bal Gangadhar Tilak',detail:'"Lokmanya". "Swaraj is my birthright and I shall have it". Started Ganpati (1893) and Shivaji (1895) festivals to mobilize people. Journals: Kesari (Marathi), Mahratta (English).'},
{title:'Swadeshi Movement (1905–1908)',detail:'Mass mobilization. Boycott of foreign cloth, picketing of shops. National education (Bengal National College). Amar Sonar Bangla (Tagore). Women and students participated for the first time.'},
{title:'Surat Split (1907)',detail:'INC split into Moderates and Extremists at the Surat session (Presided by Rash Behari Ghosh). Conflict over extending the Swadeshi movement outside Bengal and presidential candidates.'}
],
cards:[
{front:'Who said "Swaraj is my birthright"?',back:'Bal Gangadhar Tilak.'},
{front:'Who partitioned Bengal in 1905?',back:'Lord Curzon.'},
{front:'What are the "Lal-Bal-Pal" names?',back:'Lala Lajpat Rai, Bal Gangadhar Tilak, Bipin Chandra Pal.'},
{front:'When did the "Surat Split" occur?',back:'1907.'},
{front:'Journals of Tilak?',back:'Kesari and Mahratta.'}
],
q:[
{q:'The "Swadeshi Movement" was a direct result of:',options:['Jallianwala Bagh','Partition of Bengal','Rowlatt Act','Salt Satyagraha'],ai:1,exp:'The movement started as a protest against Curzon\'s decision to divide Bengal.'},
{q:'Who was the President of the 1907 Surat session of INC?',options:['Dadabhai Naoroji','Rash Behari Ghosh','G.K. Gokhale','Tilak'],ai:1,exp:'Rash Behari Ghosh presided over the session where the split happened.'},
{q:'Which extremist leader started the Ganpati and Shivaji festivals?',options:['Aurobindo Ghosh','Lala Lajpat Rai','Bal Gangadhar Tilak','Bipin Chandra Pal'],ai:2,exp:'Tilak used these festivals to bridge the gap between the masses and the political movement.'},
{q:'What was the main difference between Moderates and Extremists regarding the Swadeshi movement?',options:['Moderates wanted total independence','Extremists wanted to limit it to Bengal','Moderates wanted to limit it to Bengal','Both were against the movement'],ai:2,exp:'Moderates wanted to restrict the movement to Bengal; Extremists wanted to make it a pan-India struggle.'}
],
hook:'1905=Partition (Curzon). Swadeshi=Boycott. Tilak=Kesari/Swaraj. 1907=Surat Split. Lal-Bal-Pal=Extremists.',
summary:'Causes and impact of the Partition of Bengal. Rise of Extremist leadership and ideology. Features of the Swadeshi movement. Detailed analysis of the Surat Split.'},

{day:48,topic:'UPSC History: Revolutionary Terrorism & Ghadar',
intro:`Today we study the 'Path of the Bomb'. While the INC followed constitutional and mass-protest methods, a group of young patriots believed that the British could only be expelled through 'Force and Heroic Sacrifice'. From the Anushilan Samiti in Bengal to the Ghadar Party in North America—these revolutionaries inspired a generation. For UPSC, focus on the 'Secret Societies', 'Trials' (like Alipore, Meerut), and the international link of the movement. This is the brave and bloody side of our history.`,
notes:[
{title:'Early Phase (Bengal/Maharashtra)',detail:'Maharashtra: Chapekar brothers (killed Rand), Abhinav Bharat (V.D. Savarkar). Bengal: Anushilan Samiti (Barindra Ghosh), Yugantar. Objective: Assassinate unpopular British officials and inspire youth.'},
{title:'V.D. Savarkar',detail:'Founded Abhinav Bharat (Secret Society). Wrote "The Indian War of Independence 1857". Transported to cellular jail (Andaman) in Nasik Conspiracy Case.'},
{title:'Ghadar Movement (International)',detail:'1913: Founded in San Francisco. Leaders: Lala Hardayal, Sohan Singh Bhakna, Kartar Singh Sarabha. Journal: "Ghadar". Objective: Launch a revolt in India with the help of soldiers.'},
{title:'Komagata Maru Incident (1914)',detail:'A Japanese ship carrying Indian immigrants was turned away from Canada. On return to India, a clash with police led to deaths. It energized the Ghadarites.'},
{title:'Notable Events',detail:'Muzaffarpur Conspiracy (Prafulla Chaki & Khudiram Bose). Alipore Conspiracy. Delhi Conspiracy (Rash Behari Bose - bomb on Hardinge II).'}
],
cards:[
{front:'Who founded the "Abhinav Bharat"?',back:'V.D. Savarkar (1904).'},
{front:'Where was the HQ of the Ghadar Party?',back:'San Francisco (USA).'},
{front:'Who was the main brain behind the Ghadar Party?',back:'Lala Hardayal.'},
{front:'What was "Komagata Maru"?',back:'A Japanese ship involved in a tragic immigration incident (1914).'},
{front:'Who were the "Chapekar Brothers"?',back:'Damodar and Balkrishna (killed Plague Commissioner Rand).'}
],
q:[
{q:'The "Ghadar" journal was published in which language initially?',options:['English','Bengali','Urdu','Marathi'],ai:2,exp:'The first issue was in Urdu, followed by Gurmukhi.'},
{q:'Who threw a bomb at Lord Hardinge II in Delhi (1912)?',options:['Bhagat Singh','Rash Behari Bose','V.D. Savarkar','Khudiram Bose'],ai:1,exp:'Rash Behari Bose escaped to Japan after this attempt.'},
{q:'The "Anushilan Samiti" was a revolutionary secret society in:',options:['Punjab','Maharashtra','Bengal','Madras'],ai:2,exp:'It was the most prominent revolutionary group in Bengal.'},
{q:'"The Indian War of Independence 1857" was authored by:',options:['S.N. Sen','V.D. Savarkar','R.C. Majumdar','Dadabhai Naoroji'],ai:1,exp:'Savarkar wrote this while in London to inspire revolutionaries.'}
],
hook:'Savarkar=Abhinav Bharat. Ghadar=San Francisco/Hardayal. Komagata Maru=1914. Anushilan=Bengal. 1912=Hardinge bomb.',
summary:'Origins of revolutionary movements in India. Secret societies (Abhinav Bharat, Anushilan). Ghadar Party and its global impact. Komagata Maru incident and its significance.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC History Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'History Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Modern History '+d.topic),why:'High-stakes history of the national movement.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 46-48 v2 COMPLETE');
}
push();

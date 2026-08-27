require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:52,topic:'UPSC History: Non-Cooperation & Chauri Chaura',
intro:`Today we study the 'First Mass Strike'. The Non-Cooperation Movement (NCM) was Gandhi's first pan-India struggle, launched in 1920 to undo the 'Punjab Wrongs' and support the Khilafat cause. It saw the surrender of titles, boycott of schools, and the rise of the 'Charkha'. For UPSC, focus on the 'Program of NCM' and the controversial withdrawal after the 'Chauri Chaura' incident. This movement changed the nature of the Indian freedom struggle forever.`,
notes:[
{title:'Launch of NCM (1920)',detail:'Approved at Nagpur session (1920). Objectives: Self-government (Swaraj), redressal of Punjab wrongs, support to Khilafat.'},
{title:'Program of Action',detail:'Surrender of titles (Gandhi gave back Kaiser-i-Hind). Boycott of govt schools, courts, and foreign cloth. Promotion of Khadi and Charkha. National schools like Jamia Millia and Kashi Vidyapeeth founded.'},
{title:'Chauri Chaura (Feb 5, 1922)',detail:'A violent clash in Gorakhpur district where a mob burnt a police station, killing 22 policemen. Gandhi, a staunch believer in non-violence, immediately suspended the movement.'},
{title:'Impact of Withdrawal',detail:'Shocked many leaders like Nehru and Subhas Bose (who called it a "national calamity"). Led to a lull in the movement and the rise of internal divisions.'},
{title:'Economic Impact',detail:'Import of foreign cloth fell by half. Indian textile mills and handlooms got a massive boost.'}
],
cards:[
{front:'When was the NCM launched?',back:'1920 (Nagpur Session).'},
{front:'Why was NCM withdrawn?',back:'Due to the violent Chauri Chaura incident (Feb 1922).'},
{front:'Who called the withdrawal a "national calamity"?',back:'Subhas Chandra Bose.'},
{front:'Name two national schools founded during NCM?',back:'Jamia Millia Islamia and Kashi Vidyapeeth.'},
{front:'What was the " Nagpur Session 1920" significance?',back:'Shifted INC goal to "Swaraj" through peaceful means.'}
],
q:[
{q:'Which of the following was NOT a feature of the Non-Cooperation Movement?',options:['Boycott of courts','Boycott of foreign cloth','Boycott of taxes (initially)','Promotion of Khadi'],ai:2,exp:'No-tax campaign was planned for Bardoli but the movement was withdrawn before it could start.'},
{q:'The Chauri Chaura incident took place in which district?',options:['Champaran','Gorakhpur','Ahmedabad','Lucknow'],ai:1,exp:'It is located in Uttar Pradesh (then United Provinces).'},
{q:'Who renounced the title of "Kaiser-i-Hind" in 1920?',options:['Tagore','Gandhi','Nehru','Patel'],ai:1,exp:'Gandhi returned the medal given to him for his services in South Africa.'},
{q:'The NCM was launched to support which movement?',options:['Home Rule','Khilafat','Wahabi','Akali'],ai:1,exp:'Gandhi saw Khilafat as an opportunity for Hindu-Muslim unity.'}
],
hook:'1920=NCM starts. 1922=Chauri Chaura ends it. Nagpur session=INC shift. Khadi promoted. Foreign cloth burnt.',
summary:'Analysis of NCM goals and programs. Chauri Chaura incident and Gandhi\'s rationale for withdrawal. Impact on Indian economy and national morale.'},

{day:53,topic:'UPSC History: Swarajists, Simon & Nehru Report',
intro:`Today we study the 'Politics of the Lull'. After NCM, the INC split into 'Pro-changers' (who wanted to enter councils) and 'No-changers'. We look at the formation of the Swaraj Party, the arrival of the 'All-White' Simon Commission, and India's first attempt at drafting a constitution—the Nehru Report. For UPSC, focus on the 'Demands of the Nehru Report' and why the youth (Nehru and Bose) were dissatisfied with 'Dominion Status'.`,
notes:[
{title:'Swarajists vs No-Changers',detail:'Pro-Changers (Swaraj Party): C.R. Das, Motilal Nehru. Wanted to "wreck the councils from within". No-Changers: Rajendra Prasad, Vallabhbhai Patel. Wanted to continue constructive work.'},
{title:'Simon Commission (1927)',detail:'"All-White" commission sent to review constitutional reforms. Protested with "Simon Go Back". Lala Lajpat Rai died due to lathi charge during protests in Lahore.'},
{title:'Nehru Report (1928)',detail:'First Indian attempt at a constitution. Drafted by Motilal Nehru. Demands: Dominion Status, Joint Electorates with reserved seats, Fundamental Rights. Rejected by Muslim League (Jinnah\'s 14 Points).'},
{title:'Jinnah\'s 14 Points',detail:'Response to Nehru Report. Demanded 1/3rd representation in Center and Residual powers to provinces. Marked the widening gap between INC and League.'},
{title:'Independence for India League',detail:'Founded by Jawaharlal Nehru and S.C. Bose to demand "Purna Swaraj" (Complete Independence) instead of "Dominion Status".'}
],
cards:[
{front:'Who founded the Swaraj Party?',back:'C.R. Das and Motilal Nehru (1923).'},
{front:'Why was the Simon Commission boycotted?',back:'Because it had no Indian members.'},
{front:'What was the goal of the Nehru Report?',back:'Dominion Status for India.'},
{front:'Who led the Simon protests in Lahore?',back:'Lala Lajpat Rai.'},
{front:'What is "Purna Swaraj"?',back:'Complete Independence.'}
],
q:[
{q:'The Swaraj Party was formed following the failure of:',options:['Quit India','Civil Disobedience','Non-Cooperation','Home Rule'],ai:2,exp:'The lull after NCM led leaders to consider council entry.'},
{q:'Who was the chairman of the committee that drafted the 1928 Nehru Report?',options:['Jawaharlal Nehru','Motilal Nehru','C.R. Das','S.C. Bose'],ai:1,exp:'Motilal Nehru chaired it; Jawaharlal was the secretary.'},
{q:'The Simon Commission was appointed during the viceroyalty of:',options:['Lord Reading','Lord Irwin','Lord Chelmsford','Lord Willingdon'],ai:1,exp:'Lord Irwin was the Viceroy (1926-1931).'},
{q:'Which of the following was NOT a demand of the Nehru Report?',options:['Dominion Status','Separate Electorates','Fundamental Rights','Linguistic Provinces'],ai:1,exp:'It demanded Joint Electorates, which led to conflict with the Muslim League.'}
],
hook:'1923=Swaraj Party. 1927=Simon Commission. 1928=Nehru Report. Motilal=Report head. Lalaji=Simon protest death.',
summary:'Swarajist entry into councils. All-White Simon Commission and its backlash. Drafting and failure of the Nehru Report. Rise of Jinnah\'s 14 points.'},

{day:54,topic:'UPSC History: Civil Disobedience & Salt Satyagraha',
intro:`Today we study the 'Great Defiance'. The Civil Disobedience Movement (CDM) began with the iconic Dandi March in 1930. By picking up a handful of salt, Gandhi challenged the moral authority of the British Empire. This movement saw unprecedented mass participation, especially from women and business classes. For UPSC, focus on the 'Dandi Route', the 'Gandhi-Irwin Pact', and the various regional centers like Dharasana and Vedaranyam. This was the moment the world watched India.`,
notes:[
{title:'Purna Swaraj Declaration (1929)',detail:'Lahore Session. President: Jawaharlal Nehru. Goal: Complete Independence. Jan 26, 1930 declared as Independence Day.'},
{title:'Dandi March (March 12 - April 6, 1930)',detail:'Gandhi + 78 followers. 241 miles from Sabarmati to Dandi. Violated salt law. Marked the start of CDM.'},
{title:'Regional Movements',detail:'TN: C. Rajagopalachari (Trichy to Vedaranyam). Malabar: K. Kelappan. Peshawar: Khan Abdul Ghaffar Khan (Frontier Gandhi - Khudai Khidmatgar). Dharasana: Sarojini Naidu.'},
{title:'Gandhi-Irwin Pact (1931)',detail:'INC agreed to stop CDM and attend 2nd Round Table Conference. British agreed to release political prisoners and allow salt manufacture for personal use. Note: Bhagat Singh\'s execution was NOT stayed.'},
{title:'Features of CDM',detail:'Violation of laws (not just non-cooperation). Massive participation of women. Boycott of foreign cloth and liquor. No-tax and No-rent campaigns.'}
],
cards:[
{front:'When was the Dandi March started?',back:'March 12, 1930.'},
{front:'Who led the Salt Satyagraha in Tamil Nadu?',back:'C. Rajagopalachari (Vedaranyam March).'},
{front:'Who is known as "Frontier Gandhi"?',back:'Khan Abdul Ghaffar Khan.'},
{front:'In which session was "Purna Swaraj" declared?',back:'Lahore Session (1929).'},
{front:'Who led the raid on Dharasana Salt Works?',back:'Sarojini Naidu.'}
],
q:[
{q:'The 1929 Lahore Session of INC is significant because:',options:['It launched NCM','It declared Purna Swaraj','It signed the Lucknow Pact','It split the party'],ai:1,exp:'Under Nehru, INC demanded nothing less than complete independence.'},
{q:'The "Gandhi-Irwin Pact" led to the suspension of which movement?',options:['Non-Cooperation','Quit India','Civil Disobedience','Khilafat'],ai:2,exp:'INC agreed to join the 2nd RTC in London after this pact.'},
{q:'"Khudai Khidmatgars" (Red Shirts) were founded by:',options:['Ali Brothers','Khan Abdul Ghaffar Khan','Maulana Azad','Jinnah'],ai:1,exp:'They were a non-violent group in the NWFP region.'},
{q:'The Dandi March ended on which date?',options:['March 12','April 6','May 1','January 26'],ai:1,exp:'Gandhi reached the coast and made salt on April 6, 1930.'}
],
hook:'1929=Purna Swaraj. 1930=Dandi March. Rajaji=Vedaranyam. Ghaffar Khan=Red Shirts. 1931=Gandhi-Irwin Pact. CDM=Breaking laws.',
summary:'Declaration of Purna Swaraj. Strategic importance of the Dandi March. Spread of Salt Satyagraha across India. Analysis of the Gandhi-Irwin Pact and its consequences.'},

{day:55,topic:'UPSC History: Round Table, Communal Award & Poona Pact',
intro:`Today we study the 'Diplomatic Deadlock'. The three Round Table Conferences in London were the British attempt to finalize a constitution for India. However, the issue of 'Separate Electorates' for Depressed Classes led to a massive crisis, resulting in Gandhi's fast unto death and the historic Poona Pact between Gandhi and B.R. Ambedkar. For UPSC, focus on the 'Provisions of the Communal Award' and why Gandhi opposed separate electorates for Dalits but accepted reserved seats.`,
notes:[
{title:'Round Table Conferences (1930-32)',detail:'1st: Boycotted by INC. 2nd: Gandhi attended (after pact). Failed on communal issues. 3rd: Boycotted by INC. B.R. Ambedkar and Tej Bahadur Sapru attended all three.'},
{title:'Communal Award (1932)',detail:'By Ramsay MacDonald. Provided separate electorates for Muslims, Sikhs, Christians, and DEPRESSED CLASSES (Dalits). Gandhi saw this as an attempt to divide Hindu society permanently.'},
{title:'Poona Pact (1932)',detail:'Agreement between Gandhi and B.R. Ambedkar. Dalits gave up Separate Electorates but got INCREASED Reserved Seats in provincial and central legislatures.'},
{title:'Harijan Campaign',detail:'After the pact, Gandhi focused on social reform. Started "All India Anti-Untouchability League" and the journal "Harijan". Shifted HQ to Wardha.'},
{title:'The Resumption of CDM',detail:'After returning from 2nd RTC, Gandhi resumed CDM (1932-34) but it lacked the earlier momentum and was finally withdrawn.'}
],
cards:[
{front:'Who announced the "Communal Award"?',back:'Ramsay MacDonald.'},
{front:'Who attended all three Round Table Conferences?',back:'B.R. Ambedkar and Tej Bahadur Sapru.'},
{front:'What was the "Poona Pact"?',back:'Agreement between Gandhi and Ambedkar on Dalit representation (1932).'},
{front:'Which RTC did Gandhi attend?',back:'The 2nd Round Table Conference (1931).'},
{front:'What does "Harijan" mean?',back:'"Children of God" (Gandhi\'s term for Dalits).'}
],
q:[
{q:'The "Communal Award" of 1932 was opposed by Gandhi because:',options:['It ignored Muslims','It gave separate electorates to Dalits','It denied Purna Swaraj','It favored the British'],ai:1,exp:'He believed separate electorates would segregate Dalits from the Hindu community forever.'},
{q:'Who among the following was the mediator for the Poona Pact?',options:['Motilal Nehru','Madan Mohan Malaviya','S.C. Bose','Jawaharlal Nehru'],ai:1,exp:'Malaviya and M.R. Jayakar were the key negotiators.'},
{q:'In the 2nd Round Table Conference, the INC was represented by:',options:['Jawaharlal Nehru','Mahatma Gandhi','Sardar Patel','Sarojini Naidu'],ai:1,exp:'Gandhi was the sole representative of the INC.'},
{q:'The journal "Harijan" was started by:',options:['Ambedkar','Gandhi','Jyotiba Phule','Periyar'],ai:1,exp:'Gandhi started it in 1933 to promote the upliftment of the depressed classes.'}
],
hook:'RTC=London. Gandhi=2nd RTC only. Ambedkar=All 3. 1932=Communal Award/Poona Pact. Reserved seats > Separate electorates.',
summary:'Outcomes of the three Round Table Conferences. The Ramsay MacDonald Communal Award. Detailed study of the Poona Pact and its long-term impact on Indian politics and society.'},

{day:56,topic:'UPSC REVISION: The Gandhian Mass Movements (Days 52–55)',
intro:`Today we consolidate the 'Golden Era' of the freedom struggle. You have moved from the non-cooperation of the 20s to the civil disobedience of the 30s. You have seen how Gandhi combined mass mobilization with high-stakes diplomacy. This block is the 'Heart of UPSC Modern History'—almost every year, questions are asked from these specific 15 years. Let's master the sequence of events and the nuances of the pacts today.`,
notes:[
{title:'Timeline Recap',detail:'1920: NCM. 1922: Chauri Chaura. 1923: Swaraj Party. 1927: Simon Commission. 1928: Nehru Report. 1929: Purna Swaraj. 1930: Dandi March/CDM. 1931: Gandhi-Irwin. 1932: Poona Pact.'},
{title:'Key Difference: NCM vs CDM',detail:'NCM (1920): Passive resistance, no-cooperation, within laws. CDM (1930): Active defiance, breaking of laws (Salt, Forest laws). CDM had more women and business class participation.'},
{title:'Organizational Shifts',detail:'INC goals: Swaraj (1920) -> Purna Swaraj (1929). Formation of groups: Swaraj Party (1923), Independence for India League (1928), Khudai Khidmatgar (1929).'},
{title:'Negotiation Failures',detail:'Simon (No Indians) -> Nehru Report (Communal clash) -> RTC (Communal Award) -> Poona Pact (Resolution).'},
{title:'Literature & Icons',detail:'Harijan (Gandhi), New India (Besant - Recap), Kesari (Tilak - Recap), Charkha (Symbol of self-reliance).'}
],
cards:[
{front:'Chronology: NCM, Simon, Dandi, Poona?',back:'NCM (1920) -> Simon (1927) -> Dandi (1930) -> Poona (1932).'},
{front:'Which session declared Purna Swaraj?',back:'Lahore 1929.'},
{front:'Who was "Frontier Gandhi"?',back:'Khan Abdul Ghaffar Khan.'},
{front:'Did Gandhi-Irwin pact stop Bhagat Singh\'s hanging?',back:'No.'},
{front:'What was the result of Poona Pact?',back:'Increased reserved seats for Dalits, no separate electorates.'}
],
q:[
{q:'Consider the following events:\n1. Dandi March\n2. Simon Commission\n3. Poona Pact\n4. Gandhi-Irwin Pact\nCorrect Chronology:',options:['2-1-4-3','1-2-4-3','2-4-1-3','1-4-2-3'],ai:0,exp:'Simon (1927), Dandi (1930), G-I Pact (1931), Poona Pact (1932).'},
{q:'Which movement was suspended after the Gandhi-Irwin pact?',options:['Non-Cooperation','Quit India','Civil Disobedience','Indigo Revolt'],ai:2,exp:'INC agreed to attend the 2nd RTC and stop CDM.'},
{q:'The "Safety Valve Theory" is related to the birth of:',options:['Swaraj Party','INC','Muslim League','Ghadar Party'],ai:1,exp:'Lala Lajpat Rai popularized this theory about the INC\'s formation.'},
{q:'Who was the President of the INC session that authorized NCM?',options:['Gandhi','Lala Lajpat Rai','C. Vijayaraghavachariar','Motilal Nehru'],ai:2,exp:'C. Vijayaraghavachariar presided over the 1920 Nagpur session.'}
],
hook:'1920=NCM. 1929=Lahore. 1930=Dandi. 1932=Poona. Gandhi=2nd RTC. CDM=Break laws. NCM=Boycott.',
summary:'Full revision of mass movements (1920-1934). Comparative study of NCM and CDM. Chronological drilling of acts, commissions, and pacts. Final quiz on the peak Gandhian era.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC History Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'History Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Modern History '+d.topic),why:'Essential for mastering the core of the Indian National Movement.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:57,topic:'UPSC History: GoI Act 1935 & Provincial Elections',
intro:`Today we study the 'Blueprint of the Indian Constitution'. The Government of India Act 1935 was the longest act passed by the British Parliament and is the single largest source for our current Constitution. We also study the 28-month rule of the INC in provinces (1937-39). For UPSC, focus on 'Provisional Autonomy', 'Diarchy at the Center', and 'Why the INC resigned in 1939'. This is the structural transition to self-rule.`,
notes:[
{title:'GoI Act 1935: Key Features',detail:'1. All India Federation (never materialized). 2. Division of subjects (Federal, Provincial, Concurrent). 3. Abolished Diarchy in Provinces; Introduced Autonomy. 4. Introduced Diarchy at the Center. 5. Established RBI and Federal Court.'},
{title:'Provincial Elections (1937)',detail:'INC won absolute majority in 5 provinces and formed ministries in 8 out of 11 provinces. Muslim League performed poorly.'},
{title:'The 28-Month Rule',detail:'Ministries worked on agrarian reforms, untouchability removal, and education. Proved that Indians were capable of administration. Restricted by the powers of the Governors.'},
{title:'Resignation of Ministries (1939)',detail:'INC resigned because the British Govt involved India in World War II without consulting the Indian people or the ministries.'},
{title:'Day of Deliverance',detail:'Muslim League (under Jinnah) celebrated the INC resignation as "Day of Deliverance" on Dec 22, 1939.'}
],
cards:[
{front:'Which act is the main source of the Indian Constitution?',back:'Government of India Act 1935.'},
{front:'Where was "Diarchy" introduced by the 1935 Act?',back:'At the Center.'},
{front:'Why did INC ministries resign in 1939?',back:'Protest against India being dragged into WWII without consent.'},
{front:'What was the "Day of Deliverance"?',back:'Jinnah/League celebration of INC resignation.'},
{front:'How many provinces did INC form ministries in 1937?',back:'8 out of 11.'}
],
q:[
{q:'The Government of India Act 1935 abolished:',options:['Dyarchy at the Center','Dyarchy in the Provinces','Council of India','Federal Court'],ai:1,exp:'It replaced Provincial Dyarchy with Provincial Autonomy.'},
{q:'The "Federal Court" was established in India by which act?',options:['1909 Act','1919 Act','1935 Act','1947 Act'],ai:2,exp:'Established in 1937 under the provisions of the 1935 Act.'},
{q:'Who was the Viceroy when the 1935 Act was implemented?',options:['Lord Irwin','Lord Willingdon','Lord Linlithgow','Lord Wavell'],ai:2,exp:'Linlithgow presided over the 1937 elections and the start of WWII.'},
{q:'In how many provinces did the Muslim League form a majority in 1937?',options:['Zero','Two','Three','Five'],ai:0,exp:'The League did not win a majority in any province, even those with Muslim majorities.'}
],
hook:'1935=Autonomy/RBI/Federal Court. Center Dyarchy=1935. 1937=Elections. 1939=Resignation. Deliverance Day=Jinnah.',
summary:'Detailed provisions of the 1935 Act. Achievements of the INC ministries. Impact of WWII on Indian politics. Rise of the Muslim League as a major force.'},

{day:58,topic:'UPSC History: August Offer & Cripps Mission',
intro:`Today we study the 'WWII Diplomacy'. With the British facing defeat in Europe, they tried to win over Indian support through a series of offers. We study the August Offer (1940), the start of 'Individual Satyagraha' by Vinoba Bhave, and the failed Cripps Mission (1942). For UPSC, focus on why Gandhi called the Cripps offer a 'Post-dated check on a crashing bank'. This is the final diplomatic prelude to the great Quit India struggle.`,
notes:[
{title:'August Offer (1940)',detail:'By Linlithgow. Promised "Dominion Status" after the war and an advisory war council. Rejected by INC because it didn\'t offer independence and by League because it didn\'t offer Pakistan.'},
{title:'Individual Satyagraha (1940)',detail:'Launched to assert the right to free speech against the war. 1st Satyagrahi: Vinoba Bhave. 2nd: Jawaharlal Nehru. It was "limited" to avoid hindering the war effort while protesting.'},
{title:'Cripps Mission (1942)',detail:'Led by Stafford Cripps. Promised "Dominion Status" and a "Constituent Assembly" where provinces could OPT OUT (seed of partition). Gandhi called it a "Post-dated check".'},
{title:'Failure of Cripps',detail:'INC rejected it due to Dominion Status and the "Option to secede". League rejected it because it didn\'t explicitly grant Pakistan.'},
{title:'Impact of Failure',detail:'Led to massive frustration and the realization that the British would not leave voluntarily. Set the stage for "Quit India".'}
],
cards:[
{front:'Who was the 1st Individual Satyagrahi?',back:'Vinoba Bhave.'},
{front:'Who was the 2nd Individual Satyagrahi?',back:'Jawaharlal Nehru.'},
{front:'What did Gandhi call the Cripps Mission?',back:'"A post-dated check on a crashing bank".'},
{front:'When was the "August Offer" made?',back:'1940.'},
{front:'Main reason for refection of Cripps?',back:'Provinces were given the right to secede (threat to unity).'}
],
q:[
{q:'The "August Offer" of 1940 was made by:',options:['Lord Irwin','Lord Linlithgow','Lord Wavell','Stafford Cripps'],ai:1,exp:'Linlithgow made the offer to secure Indian cooperation in WWII.'},
{q:'Who among the following was chosen by Gandhi as the first Individual Satyagrahi?',options:['Jawaharlal Nehru','Vallabhbhai Patel','Vinoba Bhave','C. Rajagopalachari'],ai:2,exp:'Vinoba Bhave started the satyagraha in October 1940.'},
{q:'The Cripps Mission visited India in:',options:['1940','1941','1942','1945'],ai:2,exp:'Sent by the Churchill govt after the fall of Rangoon to Japan.'},
{q:'Which mission offered the right to provinces to secede from the Indian Union?',options:['Simon Commission','August Offer','Cripps Mission','Cabinet Mission'],ai:2,exp:'This provision was a major reason for the INC\'s rejection.'}
],
hook:'1940=August Offer. Vinoba=1st Satyagrahi. 1942=Cripps Mission (Failed). Post-dated check=Gandhi. Secede right=Cripps.',
summary:'Analysis of British diplomatic offers during WWII. Individual Satyagraha and its significance. Detailed study of Cripps Mission proposals and the reasons for their failure.'},

{day:59,topic:'UPSC History: Quit India Movement & INA',
intro:`Today we study the 'Final Blow'. The Quit India Movement (1942) was the most violent and spontaneous mass uprising since 1857. With the slogan 'Do or Die', Gandhi gave a clarion call for the British to leave immediately. Simultaneously, Subhas Chandra Bose led the Indian National Army (INA) from outside. For UPSC, focus on the 'Underground activities' of leaders like Usha Mehta and the significance of the 'Parallel Governments'. This is the endgame of the Raj.`,
notes:[
{title:'Quit India (August 1942)',detail:'"Vardha Resolution". Launched at Gowalia Tank, Bombay. Slogan: "Do or Die" (Karo ya Maro). Most leaders arrested on the first day (Operation Zero Hour).'},
{title:'Spontaneous Uprising',detail:'Leaderless movement. Massive strikes, sabotage of rail lines, and telegraphs. Underground Radio: Started by Usha Mehta in Bombay.'},
{title:'Parallel Governments',detail:'Nationalist govts formed in: 1. Ballia (Chittu Pandey). 2. Tamluk (Jatiya Sarkar). 3. Satara (Prati Sarkar - longest running).'},
{title:'Subhas Chandra Bose & INA',detail:'Left INC (Tripuri Crisis 1939), formed Forward Bloc. Escaped to Germany/Japan. Took over Azad Hind Fauj (founded by Mohan Singh/Rash Behari Bose). Slogan: "Jai Hind", "Delhi Chalo".'},
{title:'Impact of INA',detail:'INA Trials at Red Fort (1945) created a massive wave of sympathy. INC leaders (Nehru, Bhulabhai Desai) defended them. Led to the Royal Indian Navy (RIN) Revolt in 1946.'}
],
cards:[
{front:'Slogan of Quit India?',back:'"Do or Die" (Karo ya Maro).'},
{front:'Who started the underground radio during Quit India?',back:'Usha Mehta.'},
{front:'Where was the longest running parallel government?',back:'Satara (Maharashtra).'},
{front:'Who founded the Forward Bloc?',back:'Subhas Chandra Bose (1939).'},
{front:'What was "Operation Zero Hour"?',back:'The pre-dawn arrest of all top INC leaders on Aug 9, 1942.'}
],
q:[
{q:'Where did Gandhi give the "Do or Die" speech?',options:['Sabarmati','Gowalia Tank (Bombay)','Wardha','Calcutta'],ai:1,exp:'This speech at the AICC session marked the start of the movement.'},
{q:'Who among the following was the real founder of the Indian National Army?',options:['Subhas Bose','Mohan Singh','Rash Behari Bose','Lala Hardayal'],ai:1,exp:'Captain Mohan Singh founded the first INA with Japanese help.'},
{q:'The "Prati Sarkar" (Parallel Govt) of Satara was led by:',options:['Chittu Pandey','Y.B. Chavan and Nana Patil','Matangini Hazra','Usha Mehta'],ai:1,exp:'The Satara govt was the most successful and longest running parallel administration.'},
{q:'The "RIN Mutiny" (Royal Indian Navy) occurred in:',options:['1942','1944','1945','1946'],ai:3,exp:'The 1946 mutiny in Bombay was the final signal that British control over the military had ended.'}
],
hook:'1942=Quit India. Do or Die=Gandhi. Usha Mehta=Radio. Satara=Parallel Gov. Bose=INA/Jai Hind. 1946=RIN Mutiny.',
summary:'Causes and features of the Quit India movement. Role of underground activities and parallel governments. Contribution of Subhas Chandra Bose and the INA. Final impact on British resolve.'},

{day:60,topic:'UPSC History: C.R. Formula, Wavell Plan & Cabinet Mission',
intro:`Today we study the 'Negotiations for Power'. With the war ending, the focus shifted to how power would be transferred. We study the C.R. Formula (the first attempt at an INC-League settlement), the Wavell Plan, and the final Cabinet Mission Plan (1946). For UPSC, focus on 'Why the Cabinet Mission was accepted and then rejected' and the significance of the 'Direct Action Day' called by Jinnah. This is the tragic march towards Partition.`,
notes:[
{title:'C.R. Formula (1944)',detail:'By Rajagopalachari. Suggested a plebiscite in Muslim-majority areas after independence if they wanted to separate. Jinnah rejected it as he wanted "Pakistan" first.'},
{title:'Wavell Plan (Shimla Conference 1945)',detail:'Proposed an Executive Council with equal representation for Caste Hindus and Muslims. Failed because Jinnah insisted that only the League could nominate Muslim members.'},
{title:'Cabinet Mission (1946)',detail:'Members: Pethick-Lawrence, Stafford Cripps, A.V. Alexander. Proposed: 1. A United India (No Pakistan). 2. A weak Center. 3. Grouping of provinces (A, B, C).'},
{title:'Direct Action Day (Aug 16, 1946)',detail:'Called by Jinnah to press the demand for Pakistan. Led to horrific communal riots in Calcutta (Great Calcutta Killings) and Noakhali.'},
{title:'Interim Government (1946)',detail:'Headed by Jawaharlal Nehru. Muslim League joined later but only to obstruct. Proved that a coalition was impossible at that stage.'}
],
cards:[
{front:'What was the C.R. Formula?',back:'A plan for INC-League cooperation and a plebiscite on partition (1944).'},
{front:'When was the Shimla Conference held?',back:'1945 (Wavell Plan).'},
{front:'Who were the members of the Cabinet Mission?',back:'Lawrence, Cripps, Alexander.'},
{front:'What was "Direct Action Day"?',back:'Jinnah\'s call for mass action for Pakistan (Aug 16, 1946).'},
{front:'Who headed the Interim Government of 1946?',back:'Jawaharlal Nehru.'}
],
q:[
{q:'The "Cabinet Mission" rejected the demand for:',options:['Independence','A Constituent Assembly','A separate Pakistan','Provincial Autonomy'],ai:2,exp:'The mission initially favored a united India with a federal structure.'},
{q:'The "Grouping of Provinces" was a key feature of:',options:['Cripps Mission','Wavell Plan','Cabinet Mission','Mountbatten Plan'],ai:2,exp:'Provinces were grouped into 3 categories based on religious majority.'},
{q:'In the 1946 Interim Govt, who was the member for Finance?',options:['Jawaharlal Nehru','Sardar Patel','Liaquat Ali Khan','Rajendra Prasad'],ai:2,exp:'Liaquat Ali Khan (Muslim League) used the finance portfolio to obstruct the govt.'},
{q:'Why did the Shimla Conference fail?',options:['INC rejected the plan','Jinnah insisted on League\'s monopoly over Muslim nominations','The British didn\'t want to leave','Gandhi was not invited'],ai:1,exp:'Jinnah\'s rigid stance on the "only representative" claim led to the breakdown.'}
],
hook:'1944=C.R. Formula. 1945=Wavell/Shimla. 1946=Cabinet Mission. Grouping A,B,C=Cabinet. Jinnah=Direct Action. Nehru=Interim Gov.',
summary:'Post-war diplomatic attempts at settlement. Detailed study of the Cabinet Mission Plan. The descent into communal violence. Formation and functioning of the Interim Government.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC History Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'History Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Modern History '+d.topic),why:'Final stages of the Indian Independence movement.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

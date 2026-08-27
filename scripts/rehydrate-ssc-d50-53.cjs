require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:50,topic:'SSC Polity: Constitution & Preamble',
intro:`Today we study the 'Rulebook of India'. Indian Polity in SSC is about 'Articles', 'Schedules', and 'Sources'. From the borrowed features (like Fundamental Rights from USA) to the key parts of the Preamble—these are the structural facts. Do you know which article is the 'Heart and Soul'? Or who was the chairman of the Drafting Committee? Let's master the foundation today.`,
notes:[
{title:'Making of Constitution',detail:'Constituent Assembly (1946). Drafting Committee Chairman: B.R. Ambedkar. Advisor: B.N. Rau. Adopted: 26 Nov 1949. Implemented: 26 Jan 1950.'},
{title:'Borrowed Features',detail:'USA (FR, Judicial Review). UK (Parliamentary form). Ireland (DPSP). Canada (Federation with strong center). USSR (Fundamental Duties).'},
{title:'The Preamble',detail:'Identity card of the constitution. 42nd Amendment added "Socialist, Secular, Integrity". Non-justiciable.'},
{title:'Schedules (12 Total)',detail:'1 (States/UTs), 3 (Oaths), 4 (Rajya Sabha seats), 8 (Languages - 22), 10 (Anti-defection), 11 (Panchayats).'},
{title:'Parts of Constitution',detail:'Part III (FR), Part IV (DPSP), Part IVA (Duties), Part V (Union), Part XX (Amendment Art 368).'}
],
cards:[
{front:'Chairman of Drafting Committee?',back:'B.R. Ambedkar.'},
{front:'Borrowed DPSP from?',back:'Ireland.'},
{front:'"Socialist, Secular" added by which amendment?',back:'42nd Amendment (1976).'},
{front:'Total Schedules currently?',back:'12.'},
{front:'Language schedule?',back:'8th Schedule.'}
],
q:[
{q:'"Fundamental Rights" in the Indian Constitution were inspired by the constitution of:',options:['UK','USA','Canada','USSR'],ai:1,exp:'Bill of Rights from the USA.'},
{q:'Who is known as the "Father of the Indian Constitution"?',options:['Rajendra Prasad','B.R. Ambedkar','Jawaharlal Nehru','B.N. Rau'],ai:1,exp:'Head of the Drafting Committee.'},
{q:'The 10th Schedule of the Indian Constitution deals with:',options:['Languages','Anti-defection law','Panchayati Raj','Validation of acts'],ai:1,exp:'Added by 52nd Amendment 1985.'},
{q:'Which of the following words was NOT originally in the Preamble?',options:['Sovereign','Democratic','Secular','Republic'],ai:2,exp:'Secular and Socialist were added later in 1976.'}
],
hook:'Ambedkar=Drafting. USA=FR. Ireland=DPSP. 42nd Amend=Socialist/Secular. 8th Sch=Languages. 10th Sch=Defection.',
summary:'Timeline of constitutional development. Sources of the Indian Constitution. Meaning and amendments of the Preamble. Overview of key parts and schedules.'},

{day:51,topic:'SSC Polity: Fundamental Rights & Duties',
intro:`Today we study the 'Rights and Duties of a Citizen'. Fundamental Rights (Part III) are the most tested area in SSC Polity. From Right to Equality (Art 14) to Constitutional Remedies (Art 32)—every article is a potential question. We also look at 'Fundamental Duties' and 'DPSP'. Do you know which right was called 'Heart and Soul' by Ambedkar? Or how many duties we have? Let's master the citizens' charter today.`,
notes:[
{title:'Fundamental Rights (Art 12–35)',detail:'1. Equality (14-18). 2. Freedom (19-22). 3. Against Exploitation (23-24). 4. Religion (25-28). 5. Culture/Edu (29-30). 6. Remedies (32).'},
{title:'Important Articles',detail:'14 (Equality before law), 17 (Abolition of Untouchability), 18 (Abolition of Titles), 19 (6 Freedoms), 21 (Life & Liberty), 32 (Writs).'},
{title:'Fundamental Duties (Art 51A)',detail:'Part IVA. Recommended by Swaran Singh Committee. Added by 42nd Amendment. Total 11 duties (11th added by 86th Amendment).'},
{title:'DPSP (Art 36–51)',detail:'Part IV. Non-justiciable directives for the State. Art 40 (Panchayats), 44 (Uniform Civil Code), 50 (Separation of Judiciary).'},
{title:'Writs (Art 32 & 226)',detail:'Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto. Used by SC/HC for protection of rights.'}
],
cards:[
{front:'Article for "Abolition of Untouchability"?',back:'Article 17.'},
{front:'Article called "Heart and Soul" of Constitution?',back:'Article 32.'},
{front:'Who recommended Fundamental Duties?',back:'Swaran Singh Committee.'},
{front:'Total Fundamental Duties now?',back:'11.'},
{front:'Article for "Uniform Civil Code"?',back:'Article 44.'}
],
q:[
{q:'"Article 17" of the Indian Constitution deals with:',options:['Equality before law','Abolition of titles','Abolition of untouchability','Right to education'],ai:2,exp:'One of the most frequent questions in SSC.'},
{q:'Which Fundamental Right was removed by the 44th Amendment 1978?',options:['Right to Equality','Right to Liberty','Right to Property','Right to Religion'],ai:2,exp:'Now a legal right under Art 300A.'},
{q:'"Fundamental Duties" were added by which amendment?',options:['42nd','44th','52nd','86th'],ai:0,exp:'The 1976 amendment is known as the "Mini Constitution".'},
{q:'The writ of "Habeas Corpus" literally means:',options:['We command','To be informed','To have the body','By what authority'],ai:2,exp:'Used against illegal detention.'}
],
hook:'17=Untouchability. 32=Remedies/Writs. 42nd=Duties. 44=Property out. 51A=Duties. 44=UCC.',
summary:'Detailed breakdown of Fundamental Rights (Art 14-32). Origins and list of Fundamental Duties. Comparison with DPSP. Powers of the Supreme Court through Writs.'},

{day:52,topic:'SSC Polity: Union Executive — President & PM',
intro:`Today we study the 'Executors of the Nation'. The Union Executive consists of the President, Vice-President, PM, and Council of Ministers. In SSC, the 'Powers', 'Tenures', and 'Qualifications' are key. Do you know who is the 'Nominal Head'? Or what are the 'Pardoning Powers' of the President? Let's master the top hierarchy today.`,
notes:[
{title:'The President (Art 52–62)',detail:'Nominal Head. First Citizen. Elected by Electoral College (MPs + MLAs). Term: 5 years. Minimum Age: 35.'},
{title:'Powers of President',detail:'Veto power. Pardoning power (Art 72). Ordinance power (Art 123). Appoints PM, Governors, CJI, CAG.'},
{title:'Prime Minister',detail:'Real Head. Appointed by President. Head of Council of Ministers. Term: Pleasure of President (usually 5 years).'},
{title:'Vice-President (Art 63)',detail:'Ex-officio Chairman of Rajya Sabha. Presides over RS. Term: 5 years.'},
{title:'Attorney General (Art 76)',detail:'Highest Law Officer of India. Right to speak in Parliament but NO vote. Appointed by President.'}
],
cards:[
{front:'Minimum age to be President?',back:'35 years.'},
{front:'Article for President\'s Pardoning power?',back:'Article 72.'},
{front:'"Ex-officio Chairman" of Rajya Sabha?',back:'Vice-President.'},
{front:'Article for Attorney General?',back:'Article 76.'},
{front:'Who appoints the Prime Minister?',back:'The President.'}
],
q:[
{q:'Who is the "Supreme Commander" of the Armed Forces in India?',options:['Prime Minister','Defense Minister','President','Chief of Defense Staff'],ai:2,exp:'A constitutional power of the President.'},
{q:'What is the maximum age limit to be the President of India?',options:['65','70','75','No limit'],ai:3,exp:'There is a minimum age (35) but no maximum.'},
{q:'In the absence of both President and Vice-President, who acts as President?',options:['Speaker of Lok Sabha','Prime Minister','Chief Justice of India','Senior-most Governor'],ai:2,exp:'Hidayatullah is the only CJI to have acted as President.'},
{q:'The "Ordinance" making power of the President is under article:',options:['72','110','123','213'],ai:2,exp:'Governor\'s ordinance power is under 213.'}
],
hook:'35=Age. 72=Pardon. 123=Ordinance. 76=AG. Real head=PM. Nominal head=Pres.',
summary:'Election, qualifications, and powers of the President. Role and functions of the Prime Minister. Constitutional positions of Vice-President and Attorney General.'},

{day:53,topic:'SSC Polity: Parliament & Judiciary',
intro:`Today we study the 'Legislature and Guardian'. The Parliament makes laws, and the Judiciary interprets them. In SSC, 'House composition' (Lok Sabha/Rajya Sabha), 'Speaker', and 'SC/HC Jurisdictions' are high-yield. Do you know what is 'Zero Hour'? Or what is the 'Maximum strength' of Lok Sabha? Let's master the houses today.`,
notes:[
{title:'Parliament (Art 79)',detail:'Comprises President + Lok Sabha (Lower) + Rajya Sabha (Upper).'},
{title:'Lok Sabha (People\'s House)',detail:'Max 550 members. Directly elected. Term: 5 years. Presided by Speaker.'},
{title:'Rajya Sabha (States\' Council)',detail:'Max 250 members. Permanent House (never dissolved). 1/3rd members retire every 2 years. Term: 6 years.'},
{title:'Parliamentary Terms',detail:'Quorum: 1/10th members. Question Hour: 1st hour of sitting. Zero Hour: Starts after Question hour (unique to India). Joint Sitting (Art 108): Called by President, Presided by Speaker.'},
{title:'Judiciary',detail:'Supreme Court (Art 124). CJI + Judges appointed by President. Retirement age: 65 (SC), 62 (HC). High Courts: Currently 25 in India.'}
],
cards:[
{front:'"Permanent House" of Parliament?',back:'Rajya Sabha.'},
{front:'Who presides over a Joint Sitting?',back:'Speaker of Lok Sabha.'},
{front:'Retirement age of SC Judge?',back:'65 years.'},
{front:'Article for "Joint Sitting"?',back:'Article 108.'},
{front:'What is "Quorum"?',back:'Minimum members needed (1/10th).'}
],
q:[
{q:'What is the maximum number of members in the Rajya Sabha?',options:['250','545','552','245'],ai:0,exp:'238 from States/UTs and 12 nominated by President.'},
{q:'The "Zero Hour" in the Indian Parliament starts at:',options:['10 AM','11 AM','12 PM','1 PM'],ai:2,exp:'Immediately following the Question Hour.'},
{q:'Who among the following was the first Speaker of Lok Sabha?',options:['G.V. Mavalankar','S. Radhakrishnan','Hukam Singh','Meira Kumar'],ai:0,exp:'He is known as the "Father of Lok Sabha".'},
{q:'Which article of the constitution deals with the "Supreme Court"?',options:['76','124','148','110'],ai:1,exp:'Polity staple.'}
],
hook:'LS=550. RS=250/Permanent. 108=Joint Sitting. 124=SC. Mavalankar=1st Speaker. Zero Hour=12 PM.',
summary:'Composition and differences between Lok Sabha and Rajya Sabha. Key parliamentary procedures and terminologies. Structure of the Indian Judiciary and appointment of judges.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Polity Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Polity Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL Polity '+d.topic),why:'Mastering constitutional facts for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | GK',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

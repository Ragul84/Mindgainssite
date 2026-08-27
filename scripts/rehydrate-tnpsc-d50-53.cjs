require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:50,topic:'TNPSC Polity: Making of Constitution & Preamble',
intro:`Today we study the 'Foundation of Democracy'. Indian Polity in TNPSC is factual and focuses on 'Borrowed features' and 'Schedules'. From the Drafting Committee to the 42nd Amendment—these are the structural markers. Do you know who was the first person to propose a Constituent Assembly? Let's master the foundation today.`,
notes:[
{title:'Making of Constitution',detail:'1st proposed by M.N. Roy (1934). Constituent Assembly formed under Cabinet Mission (1946). Chairman: Rajendra Prasad. Drafting Head: B.R. Ambedkar.'},
{title:'Borrowed Features',detail:'USA (FR, Preamble). UK (Parliamentary). Ireland (DPSP). USSR (Duties). South Africa (Amendment).'},
{title:'The Preamble',detail:'"Identity Card" of the Constitution (N.A. Palkhivala). Objectives Resolution (Nehru). 42nd Amend added "Socialist, Secular, Integrity".'},
{title:'Schedules (12)',detail:'1 (States/UTs), 3 (Oaths), 4 (RS seats), 8 (Languages), 10 (Anti-defection), 11 (Panchayats).'},
{title:'Salient Features',detail:'Lengthiest written constitution. Secular state. Single citizenship. Independent Judiciary.'}
],
cards:[
{front:'Who proposed CA first?',back:'M.N. Roy (1934).'},
{front:'Chairman of Drafting Committee?',back:'B.R. Ambedkar.'},
{front:'Borrowed DPSP from?',back:'Ireland.'},
{front:'Language Schedule?',back:'8th Schedule.'},
{front:'"Socialist, Secular" added by?',back:'42nd Amendment.'}
],
q:[
{q:'Who was the "Constitutional Advisor" to the Constituent Assembly?',options:['B.R. Ambedkar','B.N. Rau','Rajendra Prasad','Jawaharlal Nehru'],ai:1,exp:'He assisted the assembly in drafting the initial text.'},
{q:'The "Preamble" of the Indian Constitution was inspired by:',options:['UK','USA','France','Germany'],ai:1,exp:'The concept starts with "We the People".'},
{q:'How many "Schedules" were originally in the Constitution?',options:['8','10','12','15'],ai:0,exp:'It started with 8; now there are 12.'},
{q:'"Single Citizenship" in India is borrowed from:',options:['USA','Canada','UK','Ireland'],ai:2,exp:'Unlike the USA, India has only national citizenship.'}
],
hook:'M.N. Roy=1934. Ambedkar=Drafting. 8th Sch=Languages. 42nd=Socialist/Secular. USA=FR. UK=Parliament.',
summary:'Timeline of constitutional formation. List of sources and borrowed features. Overview of the Preamble and its amendments. Classification of the 12 schedules.'},

{day:51,topic:'TNPSC Polity: FR, FD & DPSP',
intro:`Today we study the 'Soul of the Constitution'. Fundamental Rights (Part III), DPSP (Part IV), and Fundamental Duties (Part IVA) are the most tested areas in TNPSC. From Article 32 to the Swaran Singh Committee—every detail counts. Do you know which right was removed by the 44th Amendment? Let's master the rights today.`,
notes:[
{title:'Fundamental Rights (Art 12–35)',detail:'Part III (Magna Carta of India). Art 14 (Equality), 17 (Untouchability), 19 (Freedoms), 21 (Life), 32 (Constitutional Remedies).'},
{title:'DPSP (Art 36–51)',detail:'Part IV. Non-justiciable. Dr. Ambedkar called them "Novel Features". Art 40 (Panchayats), 44 (UCC), 45 (Education).'},
{title:'Fundamental Duties (Art 51A)',detail:'Part IVA. Added by 42nd Amendment (1976) on Swaran Singh Committee recommendation. 11th duty added by 86th Amendment.'},
{title:'Writs (Art 32 & 226)',detail:'Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto. SC (Art 32) and HC (Art 226) power.'},
{title:'Suspension of Rights',detail:'During Emergency (Art 352), all rights can be suspended EXCEPT Art 20 and 21.'}
],
cards:[
{front:'"Magna Carta of India"?',back:'Part III (FR).'},
{front:'Article for "Abolition of Untouchability"?',back:'Article 17.'},
{front:'Which article is "Heart and Soul"?',back:'Article 32.'},
{front:'Fundamental Duties recommendation?',back:'Swaran Singh Committee.'},
{front:'Art 20 & 21 suspension?',back:'NEVER suspended.'}
],
q:[
{q:'Which Fundamental Right was deleted by the 44th Amendment (1978)?',options:['Equality','Liberty','Property','Religion'],ai:2,exp:'Now a legal right under Art 300A.'},
{q:'"Article 17" deals with:',options:['Titles','Untouchability','Education','Equality'],ai:1,exp:'Core TNPSC question.'},
{q:'"Fundamental Duties" are mentioned in which part?',options:['Part III','Part IV','Part IVA','Part V'],ai:2,exp:'Added in 1976.'},
{q:'How many "Writs" can the Supreme Court issue?',options:['3','4','5','6'],ai:2,exp:'Standard types.'}
],
hook:'17=Untouchability. 32=Remedies. 42nd=Duties. 44=Property out. 51A=Duties. 20/21=Safe.',
summary:'Deep dive into Fundamental Rights and Writs. Analysis of Directive Principles and their importance. List of Fundamental Duties and the 86th Amendment change.'},

{day:52,topic:'TNPSC Polity: Union Executive & Parliament',
intro:`Today we study the 'Center of Power'. The President, PM, and the Parliament (Lok Sabha & Rajya Sabha) form the Union government. In TNPSC, 'Powers of President' and 'Parliamentary terms' are high-yield. Do you know who is the 'Nominal Head'? Let's master the top hierarchy today.`,
notes:[
{title:'The President (Art 52)',detail:'Nominal Head. Elected by Electoral College. Pardoning power (Art 72). Ordinance (Art 123). Min Age: 35.'},
{title:'Prime Minister',detail:'Real Head. Appointed by President. Head of Council of Ministers. Term: Pleasure of President.'},
{title:'Parliament (Art 79)',detail:'Lok Sabha (People\'s House - max 550). Rajya Sabha (States\' House - max 250). RS is a permanent house.'},
{title:'Parliamentary Terms',detail:'Joint Sitting (Art 108). Money Bill (Art 110 - only in LS). Annual Financial Statement/Budget (Art 112).'},
{title:'Attorney General (Art 76)',detail:'Highest Law Officer. Appointed by President. Right to speak in both houses but NO vote.'}
],
cards:[
{front:'Minimum age for President?',back:'35 years.'},
{front:'Article for Money Bill?',back:'Article 110.'},
{front:'Article for Joint Sitting?',back:'Article 108.'},
{front:'"Real Head" of India?',back:'Prime Minister.'},
{front:'Who presides over Joint Sitting?',back:'Speaker of Lok Sabha.'}
],
q:[
{q:'Who is the "Supreme Commander" of Defense Forces in India?',options:['PM','Defense Minister','President','CJI'],ai:2,exp:'A constitutional power of the President.'},
{q:'What is the maximum number of members in the Rajya Sabha?',options:['250','545','550','245'],ai:0,exp:'238 (States) + 12 (Nominated).'},
{q:'"Article 72" of the Constitution deals with:',options:['UPSC','Pardoning Power of President','AG','Finance Commission'],ai:1,exp:'Judicial power of the President.'},
{q:'In the absence of both President and Vice-President, who acts as President?',options:['Speaker','PM','Chief Justice of India','Governor'],ai:2,exp:'Succession rule.'}
],
hook:'35=Age. 110=Money. 108=Joint. 76=AG. 123=Ordinance. 72=Pardon.',
summary:'Election and powers of the President and PM. Structure and functions of the two houses of Parliament. Important articles related to bills and procedures.'},

{day:53,topic:'TNPSC Polity: State Executive & Legislature',
intro:`Today we study the 'Governance of Tamil Nadu'. The Governor, Chief Minister, and the State Assembly form the State Executive. In TNPSC, 'Governor\'s powers' and 'TN Legislative history' are high-yield. Do you know how many seats are in the TN Assembly? Let's master the state power today.`,
notes:[
{title:'The Governor (Art 153)',detail:'Nominal Head of State. Appointed by President. Term: 5 years (Pleasure of President). Min Age: 35.'},
{title:'Chief Minister (Art 164)',detail:'Real Head of State. Appointed by Governor. Head of State Council of Ministers.'},
{title:'TN Legislative Assembly',detail:'Unicameral (One house). Total Seats: 234 + 1 (Nominated - now removed). Quorum: 1/10th.'},
{title:'Legislative Council (Abolished)',detail:'TN Legislative Council was abolished on Nov 1, 1986 (MGR government).'},
{title:'Advocate General (Art 165)',detail:'Highest Law Officer of the State. Appointed by Governor.'}
],
cards:[
{front:'Total seats in TN Assembly?',back:'234.'},
{front:'When was TN Legislative Council abolished?',back:'1 Nov 1986.'},
{front:'Article for State Advocate General?',back:'Article 165.'},
{front:'Who appoints the Governor?',back:'The President.'},
{front:'Minimum age for Governor?',back:'35 years.'}
],
q:[
{q:'How many members are there in the "Tamil Nadu Legislative Assembly"?',options:['234','235','245','250'],ai:0,exp:'234 elected members.'},
{q:'Who was the CM when the "Legislative Council" of TN was abolished?',options:['Kamaraj','Annadurai','M.G. Ramachandran','M. Karunanidhi'],ai:2,exp:'Abolished in 1986.'},
{q:'The "Advocate General" of a state is appointed by:',options:['President','Governor','Chief Justice of HC','CM'],ai:1,exp:'Under Article 165.'},
{q:'A person must be at least ____ years old to be a Governor.',options:['25','30','35','40'],ai:2,exp:'Same as President.'}
],
hook:'234=TN Seats. 1986=Council abolished. 165=Advocate General. 35=Age. Governor=Nominal.',
summary:'Role and appointment of the Governor and CM. Detailed study of the Tamil Nadu Legislative Assembly structure. History of the bicameral to unicameral transition in TN.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC Polity Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'TN Polity Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Polity '+d.topic),why:'Mastering polity for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Polity',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

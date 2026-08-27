require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:54,topic:'TNPSC Polity: Local Self Government',
intro:`Today we study the 'Power at the Grassroots'. Panchayati Raj is the 3rd tier of government. In TNPSC, '73rd and 74th Amendments' and the 'TN Panchayat Raj Act 1994' are central. Do you know which committee recommended the 3-tier system? Let's master the local power today.`,
notes:[
{title:'Evolution of PRIs',detail:'Balwant Rai Mehta (1957 - 3 tier). Ashok Mehta (1977 - 2 tier). GVK Rao (1985). L.M. Singhvi (1986 - Constitutional status).'},
{title:'73rd & 74th Amendments (1992)',detail:'73rd (Panchayats - Part IX, Art 243-243O, 11th Sch). 74th (Municipalities - Part IXA, Art 243P-243ZG, 12th Sch).'},
{title:'TN Panchayat Raj Act 1994',detail:'3-tier system: Village (Gram), Block (Union), District (Zilla). Reservation for women (50% in TN).'},
{title:'State Election Commission',detail:'Conducts elections for local bodies. Headed by State Election Commissioner.'},
{title:'Gram Sabha',detail:'The only permanent unit of PRI. Meeting of all adult voters of the village. Meetings held at least 4 times a year (Jan 26, May 1, Aug 15, Oct 2).'}
],
cards:[
{front:'3-tier system recommendation?',back:'Balwant Rai Mehta Committee.'},
{front:'TN Women reservation in PRIs?',back:'50%.'},
{front:'Article for Panchayats?',back:'Article 243.'},
{front:'11th Schedule has ? items?',back:'29 items.'},
{front:'Gram Sabha meetings per year (min)?',back:'4.'}
],
q:[
{q:'"Balwant Rai Mehta Committee" (1957) is associated with:',options:['FR','Panchayati Raj','Banking','Election'],ai:1,exp:'Recommended the 3-tier local government.'},
{q:'Which constitutional amendment gave "Municipalities" legal status?',options:['72nd','73rd','74th','75th'],ai:2,exp:'Passed in 1992.'},
{q:'What is the percentage of reservation for "Women" in TN local bodies?',options:['33%','40%','50%','25%'],ai:2,exp:'TN increased it to 50%.'},
{q:'"Gram Sabha" meetings are held on which of the following days?',options:['Jan 26','Aug 15','May 1','All of the above'],ai:3,exp:'Standard dates in TN.'}
],
hook:'3-tier=Balwant Rai. 243=Panchayat. 11th Sch=29 items. 12th Sch=18 items. 50%=Women TN. 1994=TN Act.',
summary:'Timeline of committee recommendations for local government. Structural details of the 73rd and 74th amendments. Features of the TN Panchayat Raj Act 1994. Roles of Gram Sabha and State Election Commission.'},

{day:55,topic:'TNPSC Polity: Constitutional & Non-Constitutional Bodies',
intro:`Today we study the 'Watchdogs of Democracy'. From the Election Commission (Art 324) to the UPSC and TNPSC—these bodies ensure transparency. In TNPSC, 'CAG', 'Lokpal', and 'Human Rights Commission' are high-yield. Do you know who is the 'Guardian of Public Purse'? Let's master the institutions today.`,
notes:[
{title:'Election Commission (Art 324)',detail:'Free and fair elections. Conducts LS, RS, State Assembly, President, VP elections.'},
{title:'UPSC & TNPSC (Art 315)',detail:'Recruitment for All India and State services. TNPSC was the first provincial PSC in India (est. 1929).'},
{title:'CAG (Art 148)',detail:'Comptroller and Auditor General. Audits govt accounts. Appointed by President for 6 years or 65 age.'},
{title:'Finance Commission (Art 280)',detail:'Already covered in Economy; recap: tax distribution between Center and States.'},
{title:'Non-Constitutional Bodies',detail:'NITI Aayog, NHRC (Human Rights), CIC (Information), CVC (Vigilance), Lokpal & Lokayukta (Anti-corruption).'}
],
cards:[
{front:'Article for Election Commission?',back:'Article 324.'},
{front:'First Provincial PSC in India?',back:'TNPSC (1929).'},
{front:'Article for CAG?',back:'Article 148.'},
{front:'"Guardian of Public Purse"?',back:'CAG.'},
{front:'Article for PSCs?',back:'Article 315.'}
],
q:[
{q:'"Article 324" of the Indian Constitution is related to:',options:['UPSC','Finance Commission','Election Commission','CAG'],ai:2,exp:'Responsible for superintendence of elections.'},
{q:'Who appoints the "CAG of India"?',options:['PM','President','Parliament','CJI'],ai:1,exp:'Under Article 148.'},
{q:'The "TNPSC" was established in which year?',options:['1920','1929','1947','1950'],ai:1,exp:'One of the oldest in the country.'},
{q:'"Lokpal" and "Lokayukta" are associated with:',options:['Election','Anti-corruption','Human Rights','Education'],ai:1,exp:'Ombudsman institutions.'}
],
hook:'324=Election. 148=CAG. 315=PSC. 1929=TNPSC. 280=FC. 6 yr/65=CAG term.',
summary:'Powers and functions of the Election Commission. Constitutional role of CAG and its importance. History of TNPSC and other state service commissions. Overview of anti-corruption and human rights bodies.'},

{day:56,topic:'TNPSC REVISION: Polity Finale (Days 50–55)',
intro:`Today we consolidate the 'Rules of the Republic'. You have mastered the Constitution, the Rights, the Executive (Center and TN), and the Institutions. In TNPSC, Polity is the 'Stability Factor'. Today, we drill the articles. If you see '17', you say 'Untouchability'. If you see '234', you say 'TN Assembly'. Let's lock in the Polity marks today.`,
notes:[
{title:'Constitution Recap',detail:'Borrowed (USA/UK). 42nd Amend (Mini). 8th Sch (Language). 10th Sch (Defection).'},
{title:'Rights Recap',detail:'17 (Untouchability). 32 (Heart/Soul). 51A (Duties). 44 (UCC).'},
{title:'Executive Recap',detail:'President (35 age/72 Pardon). PM (Real head). Governor (Nominal state). TN Assembly (234 seats/Unicameral).'},
{title:'Local Gov Recap',detail:'73rd/74th (1992). Balwant Rai (3 tier). 243 (Panchayat). 50% Women (TN).'},
{title:'Institutions Recap',detail:'324 (Election). 148 (CAG). 315 (PSC). 1929 (TNPSC). 280 (FC).'}
],
cards:[
{front:'Article for Amendment?',back:'Article 368.'},
{front:'Article for Governor?',back:'Article 153.'},
{front:'Number of items in 12th Schedule?',back:'18.'},
{front:'Who was "Vatapi Kondan"? (History recap)',back:'Narasimhavarman I.'},
{front:'Is your Polity ready?',back:'YES.'}
],
q:[
{q:'Which article is known as the "Heart and Soul" of the Constitution?',options:['14','17','21','32'],ai:3,exp:'Recap.'},
{q:'"TN Legislative Council" was abolished in:',options:['1980','1984','1986','1990'],ai:2,exp:'Recap.'},
{q:'"Article 148" deals with:',options:['AG','CAG','UPSC','Election'],ai:1,exp:'Recap.'},
{q:'The "11th Schedule" of the Constitution deals with:',options:['Languages','Municipalities','Panchayats','Oaths'],ai:2,exp:'Recap.'}
],
hook:'Polity complete. Fact drill. Master the articles. Success is in the rulebook.',
summary:'Full revision of Indian and TN polity. High-speed drill of constitutional articles and amendments. Comparison of center and state executive powers. Final Polity ecosystem mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC Polity Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'TN Polity Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Polity '+d.topic),why:'Consolidating polity for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

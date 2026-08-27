require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const days = [
{
  day:11, topic:'Money Bill vs Financial Bill',
  notes:[
    {title:'Money Bill (Art 110)', detail:'Strictly defined — taxation, appropriation, consolidated fund. Certified by Lok Sabha Speaker. Originates ONLY in Lok Sabha. Rajya Sabha can delay 14 days only — suggestions NOT binding.'},
    {title:'Financial Bill Category I (Art 117(1))', detail:'Contains Money Bill matters PLUS other provisions. Must originate in Lok Sabha with Presidential recommendation. Rajya Sabha has FULL powers to reject or amend — unlike Money Bill.'},
    {title:'Financial Bill Category II (Art 117(3))', detail:'No Art 110 matters but involves Consolidated Fund expenditure. Can be introduced in EITHER House. Rajya Sabha has full powers. Presidential recommendation required.'},
    {title:'Rojer Mathew Case (2019)', detail:'SC referred to larger bench the question of whether Speakers certification of a Bill as Money Bill is subject to judicial review. Aadhaar Act (2016) was at the centre of this controversy.'}
  ],
  hook:'UPSC Trap: Rajya Sabha suggestions on a Money Bill are NOT binding. A Joint Sitting is NEVER called for Money Bills. The Aadhaar Act certified as Money Bill was challenged — Rojer Mathew (2019) opened Speakers certification to judicial scrutiny.',
  cards:[
    {front:'What is the key difference between a Money Bill and a Financial Bill Category I?', back:'Money Bill: RS suggestions non-binding, 14-day delay only. Financial Bill Cat I: Same origin rules but Rajya Sabha has FULL powers to reject or amend.'},
    {front:'Can a Joint Sitting be called to resolve a deadlock over a Money Bill?', back:'NO. Joint Sitting (Art 108) is only for ordinary Bills. Money Bills are never subject to joint sitting — Lok Sabha always prevails.'},
    {front:'Who certifies a Bill as a Money Bill and is that decision final?', back:'The Lok Sabha Speaker. Under Art 110(3) the decision is final but the Rojer Mathew case (2019) has referred this to a larger bench for judicial review.'}
  ],
  q:[
    {q:'Consider the statements: 1) Money Bills can only originate in Lok Sabha. 2) Rajya Sabha can amend a Money Bill. 3) Speaker certification of a Money Bill is absolutely non-reviewable. Which are correct?', options:['1 only','1 and 2','2 and 3','All three'], answer_index:0, explanation:'Statement 1 correct. Statement 2 wrong — RS can only suggest (not amend) and suggestions are non-binding. Statement 3 wrong — Rojer Mathew (2019) opened this to judicial review. Only Statement 1 is correct.'},
    {q:'What happens if Rajya Sabha does not return a Money Bill within 14 days?', options:['The Bill lapses','Joint Sitting is convened','Bill goes for Presidential assent in Lok Sabha form','Bill is returned with amendments'], answer_index:2, explanation:'Art 109(5): Money Bill is deemed passed by both Houses in the form passed by Lok Sabha if RS does not return it within 14 days. Presidential assent follows. No Joint Sitting is ever called for Money Bills.'}
  ],
  pyq:'Very High — UPSC 2018, 2020, 2022. Money Bill vs Financial Bill and Rajya Sabha powers tested.',
  summary:'Money Bill(Art110): Lok Sabha origin. Speaker certifies. RS=14-day delay, suggestions non-binding, NO joint sitting. Rojer Mathew(2019)=Speakers certification under judicial scrutiny. Fin Bill Cat I(117(1)): RS full powers. Fin Bill Cat II(117(3)): Either House, RS full powers.'
},
{
  day:12, topic:'President Powers & Emergency Provisions',
  notes:[
    {title:'National Emergency Art 352', detail:'Grounds: War, External Aggression, Armed Rebellion (44th Amdt 1978 changed Internal Disturbance). Cabinet recommendation in writing mandatory. Special majority in BOTH Houses within 1 month. Duration: 6 months, renewable. Art 19 suspended. Art 20+21 CANNOT be suspended.'},
    {title:'Presidents Rule Art 356', detail:'Imposed when State govt cannot function constitutionally. Governor recommends. Parliamentary approval within 2 months by simple majority. Maximum 3 years total. After 1 year: National Emergency must be active AND Election Commission must certify elections cannot be held.'},
    {title:'SR Bommai Case 1994', detail:'Art 356 is subject to JUDICIAL REVIEW. Majority must be tested on floor of House — not Governors satisfaction. Secularism and Federalism are Basic Structure. States dismissed post-Babri Masjid demolition (1992) were upheld as constitutionally valid under this logic.'},
    {title:'Financial Emergency Art 360', detail:'Never invoked in India. Grounds: Financial stability or credit of India threatened. Presidential proclamation approved by both Houses within 2 months by simple majority. President can direct states to reduce salaries including judges of HCs.'}
  ],
  hook:'UPSC Power Trap: Art 356 maximum duration after 1 year requires TWO conditions BOTH to be satisfied: (1) National Emergency must be in force AND (2) Election Commission must certify free elections cannot be held. Missing either condition makes extension unconstitutional.',
  cards:[
    {front:'What did the 44th Amendment (1978) change about National Emergency grounds?', back:'Changed "Internal Disturbance" to "Armed Rebellion" — raising the threshold. Also made Cabinet recommendation in writing mandatory (not just PM advice).'},
    {front:'What were the twin requirements for extending Presidents Rule beyond 1 year?', back:'Both conditions must be met: 1) A National Emergency under Art 352 must be in operation in the whole State. 2) Election Commission must certify that elections cannot be held in that State.'},
    {front:'What was the core constitutional principle established in SR Bommai Case (1994)?', back:'Art 356 is subject to judicial review. Majority tested on House floor (not Governors report). Arbitrary imposition is unconstitutional. Federalism and Secularism are Basic Structure.'}
  ],
  q:[
    {q:'Which of the following changes were made to Art 352 by the 44th Amendment (1978)?', options:['War replaced by External Aggression as ground','Internal Disturbance replaced by Armed Rebellion','Simple majority replaced by special majority','Rajya Sabha given exclusive approval power'], answer_index:1, explanation:'44th Amdt: Internal Disturbance replaced by Armed Rebellion (higher threshold). Cabinet recommendation in writing made mandatory. Special majority requirement existed earlier. Rajya Sabha was not given exclusive power.'},
    {q:'In the SR Bommai Case, which statement correctly reflects the Supreme Court ruling?', options:['Art 356 is beyond judicial review','Governor has absolute discretion','Floor test determines majority not Governors report','President has unfettered power under Art 356'], answer_index:2, explanation:'SR Bommai held that majority must be tested on the floor of the Assembly — not based on Governors satisfaction. Art 356 IS subject to judicial review. Presidential discretion is NOT unfettered. Floor test principle now constitutionally settled.'}
  ],
  pyq:'Very High — UPSC 2014, 2017, 2021. SR Bommai, Emergency effects on FRs, and Art 356 limits.',
  summary:'Art352: Armed Rebellion(44thAmdt). Special majority. Art19 suspended. Art20+21 NEVER suspended. Art356: SR Bommai 1994=Judicial Review+Floor Test. Max 3 yrs(after 1yr: NatEmerg+EC certification both needed). Art360: Financial Emergency(never used). Governor recommends Art356, Parliament approves within 2 months.'
},
{
  day:13, topic:'Federalism: Union-State Relations',
  notes:[
    {title:'Nature of Indian Federalism', detail:'Strong unitary bias. K.C. Wheare called it Quasi-federal. Three lists: Union (100 subjects), State (61 subjects), Concurrent (52 subjects). Residuary powers with Parliament (Art 248) — opposite of USA where residuary powers are with states.'},
    {title:'Parliament over State List', detail:'Art 249: RS passes resolution by 2/3 majority — national interest (1 year, renewable). Art 250: National Emergency. Art 252: Two or more states request (applies only to those states). Art 253: International treaty obligation — Parliament can legislate on ANY subject.'},
    {title:'Sarkaria Commission 1983', detail:'Examined Centre-State relations. Key recommendations: Art 356 should be used as last resort. Permanent Inter-State Council under Art 263. More financial devolution. Governors should be eminent persons from outside the state and not recent politicians.'},
    {title:'Punchhi Commission 2007', detail:'Follow-up to Sarkaria. Recommended: Fixed 5-year tenure for Governors. Lokayukta in all states. Further financial devolution to states. Strengthening of Inter-State Council. Governors should not hold office after term except with SC-level protection.'}
  ],
  hook:'UPSC Concept Trap: India has NO equal division of sovereignty. Centre can reorganize states (Art 3) without state consent — only consultation required. BUT Federalism is Basic Structure (SR Bommai 1994). Centre cannot ABOLISH states completely. The balance is: Centre is stronger, states are not powerless.',
  cards:[
    {front:'How does India differ from the USA on residuary powers?', back:'USA: Residuary powers with STATES (10th Amendment). India: Residuary powers with PARLIAMENT (Art 248 + Union List Entry 97). This reflects Indias stronger central bias.'},
    {front:'Under Art 252, Parliament can legislate on State List subjects if how many states request?', back:'Two or more states must pass resolutions requesting Parliament to legislate. The resulting law applies ONLY to those requesting states (and others who adopt it by resolution).'},
    {front:'What were the Sarkaria Commission recommendations on Art 356?', back:'Use Art 356 sparingly as a last resort. Governor must explore all options before recommending Presidents Rule. Impose only after State government has been given opportunity to respond.'}
  ],
  q:[
    {q:'Under which Article can Parliament legislate on State List subjects to implement international treaties?', options:['Art 249','Art 250','Art 252','Art 253'], answer_index:3, explanation:'Art 253: Parliament can legislate on ANY List including State List to implement international treaties, agreements or conventions. Art 249=National interest RS resolution. Art 250=National Emergency. Art 252=Two state request. Classic article-swap trap.'},
    {q:'Which of the following statements about Art 3 of the Constitution is correct?', options:['States consent is mandatory before Parliament alters boundaries','Parliament can create new states without state consent but must consult','President alone can create new states','Rajya Sabha has veto power over state reorganization'], answer_index:1, explanation:'Art 3: Parliament can form new states, alter boundaries, change names. State legislature is consulted but their consent is NOT required. President refers the Bill to State Legislature for views — Parliament is not bound by those views.'}
  ],
  pyq:'High — UPSC 2016, 2019, 2022. Sarkaria, legislative relations, and residuary powers tested.',
  summary:'Indian Federalism: Quasi-federal(KCWheare). Union(100)+State(61)+Concurrent(52). Residuary=Parliament(Art248). Art249(RS 2/3)+Art250(Emergency)+Art252(2 states)+Art253(treaty)=Parliament over State List. Art254: Centre prevails on Concurrent. Sarkaria(1983)+Punchhi(2007)=restraint on Art356+Governor reform. Federalism=Basic Structure(SR Bommai).'
},
{
  day:14, topic:'Supreme Court & Judicial Independence',
  notes:[
    {title:'Composition and Collegium', detail:'CJI + 33 judges (total 34). Third Judges Case (1998): Collegium = CJI + 4 senior-most SC judges. This is the binding method for appointments to SC and HCs. President appoints but cannot disagree with Collegium recommendations twice.'},
    {title:'NJAC Struck Down 2015', detail:'99th Constitutional Amendment (2014) created National Judicial Appointments Commission. NJAC: CJI + 2 senior SC judges + Law Minister + 2 eminent persons. Struck down in Supreme Court Advocates-on-Record Association case (2015). Ground: Independence of judiciary is Basic Structure.'},
    {title:'Jurisdiction Types', detail:'Original (Art 131): Only SC. Disputes between states or state vs Centre. Appellate (Art 132-136): Constitutional, civil, criminal. Advisory (Art 143): President seeks SC opinion — NOT binding. SLP (Art 136): Discretionary, against any court/tribunal except military courts.'},
    {title:'Removal of Judges', detail:'Only by address of BOTH Houses of Parliament in the SAME session, special majority, on grounds of proved misbehaviour or incapacity. Only failed attempt: Justice V. Ramaswami (1993) — motion failed in Lok Sabha due to Congress abstention.'}
  ],
  hook:'UPSC Precision: Advisory Opinion (Art 143) is NOT binding on the President. President need not act on it. Also — a retired SC judge CANNOT plead before any court in India (unlike HC judges who can plead before other courts after retirement). This distinction appears in ethics questions.',
  cards:[
    {front:'Why was the NJAC struck down in 2015?', back:'Independence of Judiciary is a Basic Structure element. NJAC gave the Law Minister (executive) a veto in judicial appointments — violating judicial independence. SC held Collegium system cannot be replaced by executive-influenced mechanism.'},
    {front:'What is the composition of the Collegium for Supreme Court appointments?', back:'CJI + 4 senior-most SC judges (established by Third Judges Case 1998). For HC appointments: CJI + 2 senior SC judges + Chief Justice of concerned HC.'},
    {front:'Under Art 143, what is the legal status of the SC advisory opinion?', back:'NOT binding on the President. It is purely advisory. The President may or may not act on it. Kerala Education Bill reference (1958) was an early example.'}
  ],
  q:[
    {q:'The NJAC was struck down in 2015 on which constitutional ground?', options:['Separation of powers','Independence of the judiciary as Basic Structure','Parliamentary supremacy','Violation of federal principles'], answer_index:1, explanation:'Independence of judiciary is part of Basic Structure (established in Second Judges Case 1993). NJAC gave Law Minister a veto in appointments — directly threatening judicial independence. SC held this cannot be altered even by constitutional amendment.'},
    {q:'Under Art 136, Special Leave Petition CANNOT be filed against judgments of which courts?', options:['District courts','High Courts','Military tribunals and courts','Revenue courts'], answer_index:2, explanation:'Art 136 covers any court or tribunal in India — but SC itself has excluded military courts from SLP jurisdiction. The exclusion is based on judicial interpretation, not explicit constitutional text. This is a precision trap.'}
  ],
  pyq:'Very High — UPSC 2015, 2018, 2021, 2023. NJAC, Collegium, and advisory jurisdiction tested.',
  summary:'SC: CJI+33 judges. Collegium=CJI+4 senior judges(3rd Judges Case 1998). NJAC(99th Amdt 2014) struck down 2015=Independence of Judiciary is Basic Structure. Art131(Original). Art143(Advisory=non-binding). Art136(SLP=any court except military). Removal: Both Houses same session, special majority. Only attempt: Justice Ramaswami 1993(failed).'
},
{
  day:15, topic:'Constitutional Bodies: EC, CAG & UPSC',
  notes:[
    {title:'Election Commission (Art 324)', detail:'Multi-member since 1989 (2 Election Commissioners added). CEC + Election Commissioners. CEC removed like SC judge — address of both Houses, same session, special majority. Other ECs removed on CEC recommendation only (NOT like SC judge). Superintends elections to Parliament, State Legislatures, President and VP. NOT Panchayats (State Election Commission).'},
    {title:'CAG (Art 148)', detail:'Comptroller and Auditor General — Guardian of Public Purse. Appointed by President. Removed like SC judge. POST-FACTO auditor only — no power to prevent expenditure. Reports placed before Parliament by President and before State Legislatures by Governor. Cannot audit private bodies unless receiving substantial govt grants.'},
    {title:'UPSC (Art 315-323)', detail:'Chairman + members appointed by President. UPSC Chairman removed like SC judge. UPSC Members removed by President after SC inquiry (Art 317) — different from Chairman. UPSC advice is CONSULTATIVE — not binding. Government must record reasons if overruling UPSC recommendations.'},
    {title:'Removal Matrix', detail:'Removed like SC judge: CEC, CAG, UPSC Chairman, CJI/SC judges, HC Chief Justices. Removed by Presidential order after SC inquiry: UPSC members, State PSC Chairmen. This distinction is the most-tested fact in Constitutional Bodies questions.'}
  ],
  hook:'UPSC Master Trap: Other Election Commissioners (not CEC) are NOT removed like SC judges. They are removed only on recommendation of CEC. This deliberate asymmetry protects the CEC from being outvoted or pressured by other ECs appointed by a hostile government.',
  cards:[
    {front:'Who among CEC, Other ECs, CAG and UPSC Members is NOT removed like a Supreme Court judge?', back:'Other Election Commissioners and UPSC Members. Other ECs: removed on CEC recommendation. UPSC Members: removed by President after SC inquiry under Art 317.'},
    {front:'What is the key limitation of the CAG role?', back:'CAG is a post-facto auditor — audits AFTER expenditure happens. Has NO power to prevent or stop any government spending in advance. Cannot audit private companies without substantial government grant nexus.'},
    {front:'Does the Election Commission of India conduct Panchayat elections?', back:'NO. Panchayat and Municipal elections are conducted by State Election Commissions established under Art 243K. ECI covers only Parliament, State Legislatures, President and VP elections.'}
  ],
  q:[
    {q:'Which of the following officers is removed by the President on the recommendation of the Chief Election Commissioner?', options:['CAG','UPSC Chairman','Other Election Commissioners','UPSC Members'], answer_index:2, explanation:'Art 324(5): Other Election Commissioners shall not be removed from office except on the recommendation of the CEC. CEC, CAG, and UPSC Chairman require address of both Houses with special majority — same as SC judge. UPSC Members face Presidential removal after SC inquiry.'},
    {q:'Election Commission of India does NOT supervise elections to which of the following?', options:['Rajya Sabha','President of India','State Legislative Councils','Gram Panchayats'], answer_index:3, explanation:'Gram Panchayat elections fall under the State Election Commission (Art 243K), not the ECI. ECI covers Parliament (LS+RS), State Legislatures (Assemblies+Councils), and offices of President and Vice President.'}
  ],
  pyq:'Very High — UPSC 2015, 2018, 2020, 2023. Removal procedures and ECI vs State EC jurisdiction.',
  summary:'EC(Art324): CEC removed like SC judge. Other ECs removed on CEC recommendation(NOT like SC judge). Covers Parliament+State Legislatures+President+VP(NOT Panchayats=State EC). CAG(Art148): Post-facto auditor only. Removed like SC judge. UPSC: Chairman=like SC judge. Members=Presidential order after SC inquiry(Art317). UPSC advice=consultative,not binding.'
}
];

async function push() {
  for(const d of days){
    const payload = {
      topic_title:d.topic, day_number:d.day, track:'upsc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ **UPSC Ranker Hook**: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Exam Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'Mastering '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC '+d.topic+' Lakshmikanth prelims'),why:'Coaching-grade tutorial.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const {error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:payload,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error) console.error('Day '+d.day+':',error.message);
    else console.log('Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 11-15 COMPLETE');
}
push();

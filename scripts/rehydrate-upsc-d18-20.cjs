require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:18,topic:'Local Government: Panchayats & Municipalities',
intro:`Today we study the 'Third Tier' of Indian Democracy—Local Self-Government. While the dream of 'Gram Swaraj' was part of Gandhi's vision (Art 40), it took 43 years for it to get constitutional status via the 73rd and 74th Amendments in 1992. This system brings government to the doorstep of the citizen. For a UPSC aspirant, understanding the 29 subjects of the 11th Schedule and the 18 subjects of the 12th Schedule, along with the role of the State Election Commission and Finance Commission, is essential for both Prelims and the Governance portion of Mains.`,
notes:[
{title:'73rd Amendment (Panchayati Raj)',detail:'Added Part IX and 11th Schedule (29 subjects). 3-tier system: Gram Panchayat (Village), Panchayat Samiti (Block), Zila Parishad (District). Mandatory Provisions: 3-tier structure, Gram Sabha, 1/3rd reservation for women, 5-year term, State Election Commission, State Finance Commission.'},
{title:'74th Amendment (Municipalities)',detail:'Added Part IX-A and 12th Schedule (18 subjects). 3 types: Nagar Panchayat (transitional), Municipal Council (smaller urban), Municipal Corporation (larger urban). Wards Committees: For municipalities with >3 lakh population. DPC (District Planning Committee): Consolidates plans from Panchayats and Municipalities.'},
{title:'Key Local Government Bodies',detail:'State Election Commission (Art 243K): Appointed by Governor, conducts local polls. State Finance Commission (Art 243I): Appointed by Governor every 5 years to review financial position. Gram Sabha: Foundation of the system, consists of all registered voters in the village.'},
{title:'Pesa Act (1996)',detail:'Provisions of the Panchayats (Extension to Scheduled Areas) Act. Extends Part IX to 5th Schedule areas. Gives significant power to Gram Sabha over minor forest produce, land alienation, and village markets.'},
{title:'Voluntary vs Mandatory Provisions',detail:'Mandatory: Women reservation, direct elections at lower levels. Voluntary: Reservation for OBCs, giving financial powers to Panchayats, allowing MPs/MLAs to be members.'}
],
cards:[
{front:'What is the "Gram Sabha"?',back:'A body consisting of all persons whose names are included in the electoral rolls for the Panchayat at the village level. It is the foundation of the PR system.'},
{front:'Minimum age to contest elections for Panchayats/Municipalities?',back:'21 years. (Note: Voting age is 18, LS is 25, RS is 30). This is a common trap in MCQ exams.'},
{front:'Which states are EXEMPT from 73rd Amendment?',back:'Nagaland, Meghalaya, and Mizoram. Also, the hill areas of Manipur (where District Councils exist) and Darjeeling (Gorkha Hill Council).'},
{front:'What is the District Planning Committee (DPC)?',back:'Article 243ZD. It is responsible for consolidating the plans prepared by Panchayats and Municipalities in the district and preparing a draft development plan for the whole district.'},
{front:'How much reservation is mandatory for women in local bodies?',back:'At least 1/3rd (33%). Many states (like Bihar, MP, Tamil Nadu) have voluntarily increased this to 50%.'}
],
q:[
{q:'Which Constitutional Amendment gave constitutional status to the Panchayati Raj Institutions?',options:['42nd Amendment','44th Amendment','73rd Amendment','74th Amendment'],ai:2,exp:'The 73rd Amendment Act (1992) added Part IX and the 11th Schedule for Panchayats.'},
{q:'The minimum age for contesting a Panchayat election is:',options:['18 years','21 years','25 years','30 years'],ai:1,exp:'Article 243F states that the minimum age to contest local body elections is 21 years.'},
{q:'The State Finance Commission is appointed by the:',options:['President of India','Chief Minister','Governor of the State','Finance Minister'],ai:2,exp:'Article 243I states the Governor shall constitute a Finance Commission every 5 years.'},
{q:'How many subjects are listed in the 11th Schedule (Panchayati Raj)?',options:['18','21','29','32'],ai:2,exp:'The 11th Schedule contains 29 subjects; the 12th Schedule (Municipalities) contains 18.'}
],
hook:'73rd=Panchayat (11th Sch, 29 sub). 74th=Urban (12th Sch, 18 sub). Min age=21. Gram Sabha=Registered voters. State EC/FC=Governor appts.',
summary:'Evolution of Local Self Govt. 73rd & 74th Amendments. Mandatory vs Voluntary provisions. PESA Act 1996. Finance and Election commissions at State level.'},

{day:19,topic:'Constitutional Amendments: Art 368 & Basic Structure',
intro:`Today we study the 'Living nature' of the Constitution—Article 368 and the 'Basic Structure Doctrine'. A constitution that cannot change will break, but a constitution that changes too easily can be destroyed. Article 368 provides the procedure for amendment, balancing flexibility and rigidity. However, the most profound development in Indian Law was the 1973 Kesavananda Bharati judgment, where the Supreme Court ruled that while Parliament can amend the Constitution, it cannot touch its 'Basic Structure'. This doctrine is the ultimate check on absolute power.`,
notes:[
{title:'Procedure for Amendment (Art 368)',detail:'Initiated ONLY in Parliament (not States). Introduced by Minister or Private Member. No prior President permission. Both Houses must pass separately by SPECIAL MAJORITY (no Joint Sitting). If it affects federal features, 1/2 of states must ratify by simple majority. President MUST give assent (24th Amdt).'},
{title:'Types of Amendments',detail:'1. By Simple Majority (not under Art 368): Admission of states, salaries, rules of procedure. 2. By Special Majority (Art 368): FRs, DPSPs, and others. 3. By Special Majority + State Ratification (Art 368): Federal features like election of President, Supreme Court/High Court, Distribution of powers (7th Sch), Art 368 itself.'},
{title:'Evolution of Basic Structure',detail:'Shankari Prasad (1951): Parliament can amend everything. Golak Nath (1967): Parliament CANNOT amend FRs. Kesavananda Bharati (1973): Parliament can amend FRs BUT cannot alter "Basic Structure". This 13-judge bench is the most important case in Indian history.'},
{title:'Elements of Basic Structure',detail:'Supremacy of Constitution, Republican and Democratic form, Secularism, Separation of Powers, Federalism, Unity/Integrity, Judicial Review, Parliamentary System, Rule of Law, Harmony between FRs and DPSPs, Free and Fair Elections.'},
{title:'Key Amendments Drill',detail:'24th (1971): President must sign Amdt bills. 42nd (1976): Socialist/Secular/Integrity, FDs. 44th (1978): Property right removed. 52nd (1985): Anti-defection. 61st (1988): 18 yrs voting. 73rd/74th (1992): Local bodies. 86th (2002): RTE. 101st (2016): GST. 103rd (2019): EWS.'}
],
cards:[
{front:'Can a "Joint Sitting" be held for an Amendment Bill?',back:'NO. Article 368 requires that each House must pass the amendment bill separately by a special majority. If one House rejects it, the bill fails.'},
{front:'What is the "Basic Structure Doctrine"?',back:'A judicial innovation from the Kesavananda Bharati case (1973). It says that certain features of the Constitution (like democracy, secularism, judicial review) are so fundamental that they cannot be removed even by a constitutional amendment.'},
{front:'Which Amendment made it compulsory for the President to give assent to an Amdt Bill?',back:'24th Constitutional Amendment Act (1971).'},
{front:'Is "Judicial Review" part of the Basic Structure?',back:'YES. In Minerva Mills (1980) and L. Chandra Kumar (1997), the SC reaffirmed that Judicial Review is a basic feature.'},
{front:'Majority required for a state to ratify an amendment?',back:'SIMPLE MAJORITY. Even if the Union passes it by Special Majority, the states only need a simple majority of members present and voting to ratify.'}
],
q:[
{q:'The power of Parliament to amend the Constitution is provided under which Article?',options:['Article 356','Article 360','Article 368','Article 370'],ai:2,exp:'Article 368 in Part XX of the Constitution deals with the power of Parliament to amend the Constitution and its procedure.'},
{q:'The "Basic Structure Doctrine" was propounded in which landmark case?',options:['Golak Nath Case','Kesavananda Bharati Case','Minerva Mills Case','S.R. Bommai Case'],ai:1,exp:'The 1973 Kesavananda Bharati case established that Parliament cannot amend the basic structure.'},
{q:'Which Amendment removed the "Right to Property" from the list of Fundamental Rights?',options:['24th Amendment','42nd Amendment','44th Amendment','73rd Amendment'],ai:2,exp:'The 44th Amendment (1978) made the Right to Property a legal right under Art 300A.'},
{q:'If an amendment affects the "Election of the President", what is the procedure?',options:['Special Majority only','Special Majority + Ratification by half of states','Simple Majority','Ordinance by President'],ai:1,exp:'Election of President is a federal feature, requiring Special Majority of Parliament and ratification by half of the states.'}
],
hook:'Art 368=Amendment. No Joint Sitting. Basic Structure (1973)=No touch. 24th Amdt=Binding assent. Federal features need State ratification.',
summary:'Amendment procedure (Art 368). Types of Majorities. Basic Structure Doctrine evolution. Key constitutional cases. Summary of landmark amendments.'},

{day:20,topic:'Governance Bodies: RTI, Lokpal, CVC & NHRC',
intro:`Today we move from the Constitution to 'Governance'. These bodies—some statutory, some executive—are designed to fight corruption and protect human rights. From the Right to Information (RTI) which empowered the common citizen, to the Lokpal which acts as an anti-corruption ombudsman for high officials, these institutions are the watchdogs of our democracy. For a UPSC aspirant, understanding their composition, appointment process (the 'Selection Committees'), and their powers is essential for GS Paper 2.`,
notes:[
{title:'Right to Information (RTI) 2005',detail:'Gives citizens the right to request information from "Public Authorities". Information must be provided within 30 days (48 hours if life/liberty involved). Exemptions (Section 8): Sovereignty, security, strategic interests, intelligence agencies. Central Information Commission (CIC) is the appellate body.'},
{title:'Lokpal & Lokayuktas (2013)',detail:'Lokpal (Union) + Lokayukta (State). Anti-corruption ombudsman. Jurisdiction: PM, Ministers, MPs, Group A/B/C/D officers. Selection Committee: PM (Chair), Speaker of LS, Leader of Opposition in LS, CJI (or nominee), and an eminent jurist.'},
{title:'Central Vigilance Commission (CVC)',detail:'Established 1964 (Santhanam Committee), statutory status in 2003. "Watchdog of integrity" in govt. Advisory body. CVC appointed by President on recommendation of PM, Home Minister, and LoP in LS.'},
{title:'National Human Rights Commission (NHRC)',detail:'Statutory body (PHRA 1993). Investigates violations of human rights. "Toothless Tiger" (advisory powers only). Chairman: Retired CJI or Judge of SC. Selection: PM, Speaker, Deputy Chairman of RS, Home Minister, and LoP in both Houses.'},
{title:'Statutory vs Constitutional vs Executive',detail:'Constitutional: Mentioned in Constitution (ECI, CAG, UPSC). Statutory: Created by Act of Parliament (RTI, Lokpal, CVC, NHRC). Executive: Created by Cabinet resolution (NITI Aayog, CBI).'}
],
cards:[
{front:'Is the CBI a Statutory Body?',back:'NO. The CBI is NOT a statutory body. It derives its powers from the Delhi Special Police Establishment Act, 1946, but was created by an executive resolution of the Ministry of Home Affairs in 1963.'},
{front:'What is the time limit for life and liberty RTI requests?',back:'48 hours. For normal requests, it is 30 days.'},
{front:'Who is the Chairman of the Lokpal Selection Committee?',back:'The Prime Minister.'},
{front:'Does the Lokpal have jurisdiction over the Prime Minister?',back:'YES, but with certain safeguards (e.g., in-camera proceedings, 2/3rd bench approval for inquiry related to international relations, security, etc.).'},
{front:'Is NITI Aayog a Constitutional Body?',back:'NO. It is an executive body (think-tank) created by a Cabinet resolution in 2015, replacing the Planning Commission.'}
],
q:[
{q:'The Central Vigilance Commission (CVC) was established on the recommendation of which committee?',options:['Sarkaria Commission','Santhanam Committee','Punchhi Commission','Dinesh Goswami Committee'],ai:1,exp:'The Santhanam Committee on Prevention of Corruption (1962-64) recommended the setting up of the CVC.'},
{q:'Who is the Chairman of the National Human Rights Commission (NHRC)?',options:['President of India','Chief Justice of India','Retired CJI or Judge of the Supreme Court','Prime Minister'],ai:2,exp:'According to 2019 amendments, the Chairman can be a retired CJI or a retired Judge of the Supreme Court.'},
{q:'The Right to Information Act was passed in the year:',options:['2000','2002','2005','2013'],ai:2,exp:'The RTI Act came into force on 12th October 2005.'},
{q:'Which of the following is NOT a constitutional body?',options:['Election Commission','Finance Commission','National Human Rights Commission','UPSC'],ai:2,exp:'NHRC is a statutory body (created by an Act), while the others are established by the Constitution.'}
],
hook:'RTI=2005 (30 days). Lokpal=2013 (PM included). CVC=Statutory (Santhanam). NHRC=Statutory (Advisory). NITI Aayog=Executive. CBI=Non-statutory.',
summary:'Statutory bodies: RTI, Lokpal, CVC, NHRC. Appointment procedures and powers. Governance mechanisms. Differentiation between Constitutional, Statutory, and Executive bodies.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC Ranker Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Exam Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC '+d.topic+' Polity'),why:'Governance and Constitutional evolution analysis.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High PYQ',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 18-20 v2 COMPLETE');
}
push();

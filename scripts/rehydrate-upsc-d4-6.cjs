require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:4,topic:'Fundamental Rights Block 1: Art 12–18 (Right to Equality)',
intro:`Welcome to Part III of the Constitution—the 'Magna Carta' of India. Fundamental Rights (FRs) are the most critical part of your UPSC Polity preparation because they define the relationship between the citizen and the State. We begin with the 'Right to Equality'. Before you learn about the rights themselves, you must understand Article 12 (which defines who the 'State' is) and Article 13 (which gives the courts the power of Judicial Review). Article 14 to 18 then lay the groundwork for a society free from discrimination, untouchability, and titles of nobility. For a UPSC aspirant, these aren't just articles; they are the tools used to challenge arbitrary state action.`,
notes:[
{title:'Article 12 & 13: The Guardians',detail:'Art 12: Defines "State" to include Govt/Parliament, State Govts/Legislatures, Local authorities (Panchayats/Municipalities), and Statutory/Non-statutory authorities (LIC, ONGC, SAIL). Art 13: Declares that all laws inconsistent with FRs shall be void. This is the explicit basis for Judicial Review by SC (Art 32) and HC (Art 226).'},
{title:'Article 14: Equality Before Law',detail:'Equality Before Law (UK origin - negative concept) + Equal Protection of Laws (USA origin - positive concept). It permits "Reasonable Classification" but prohibits "Class Legislation". Exceptions: President and Governors have immunity under Art 361.'},
{title:'Article 15: Prohibition of Discrimination',detail:'State shall not discriminate against any citizen on grounds ONLY of religion, race, caste, sex, place of birth. Note the word "ONLY"—discrimination on other grounds (like residence) is permitted. Special provisions for women, children, and socially/educationally backward classes (Art 15(4) and (5)) are exceptions.'},
{title:'Article 16: Equality of Opportunity in Public Employment',detail:'No discrimination in state employment. 77th and 81st Amendments added provisions for reservation in promotion and "carry forward" rule. 103rd Amendment added 10% EWS reservation (Art 16(6)).'},
{title:'Article 17 & 18: Social Equality',detail:'Art 17: Abolition of Untouchability. It is an ABSOLUTE right (no exceptions). Art 18: Abolition of Titles. Military and Academic distinctions are NOT titles. Bharat Ratna/Padma awards are not titles to be used as prefixes/suffixes.'}
],
cards:[
{front:'Article 13 and Judicial Review—what is the link?',back:'Art 13 provides the basis for Judicial Review. It says any law (statute, ordinance, custom) that violates Fundamental Rights is VOID. The SC (Art 32) and HC (Art 226) use this power to strike down unconstitutional laws.'},
{front:'Does Art 14 apply to non-citizens?',back:'YES. Article 14 (Equality before law) applies to all persons, whether citizens or foreigners/legal corporations. However, Articles 15, 16, 19, 29, and 30 are available ONLY to citizens.'},
{front:'Article 15: The "ONLY" Trap?',back:'The State cannot discriminate ONLY on grounds of religion, race, caste, sex, place of birth. It CAN discriminate on other grounds like residence (e.g., domicile requirements for state schemes), unless prohibited elsewhere.'},
{front:'Which Fundamental Right is considered "Absolute"?',back:'Article 17 (Abolition of Untouchability). Unlike most other FRs (like Art 19) which have "reasonable restrictions", Art 17 has no exceptions. Practicing untouchability is a crime.'},
{front:'Are Bharat Ratna and Padma Awards "Titles" under Art 18?',back:'NO. The SC in Balaji Raghavan case (1996) ruled they are "National Honours", not titles. However, they cannot be used as prefixes (e.g., "Bharat Ratna X") or suffixes to the name.'}
],
q:[
{q:'Which Article of the Indian Constitution defines the term "State" for the purpose of Fundamental Rights?',options:['Article 11','Article 12','Article 13','Article 14'],ai:1,exp:'Article 12 defines "State". It includes the Government and Parliament of India, State Governments/Legislatures, and all local or other authorities within the territory of India.'},
{q:'Article 13 of the Constitution is significant because it provides the basis for:',options:['Universal Adult Franchise','Judicial Review','Uniform Civil Code','Panchayati Raj'],ai:1,exp:'Article 13 declares that any law inconsistent with or in derogation of Fundamental Rights shall be void, effectively establishing the power of Judicial Review.'},
{q:'Article 17 of the Indian Constitution deals with:',options:['Abolition of Titles','Equality of Opportunity','Right against Exploitation','Abolition of Untouchability'],ai:3,exp:'Article 17 abolishes "Untouchability" and its practice in any form is forbidden. It is an absolute right with no exceptions.'},
{q:'Which of the following Fundamental Rights is available ONLY to citizens of India?',options:['Equality before law (Art 14)','Protection of life and liberty (Art 21)','Equality of opportunity in public employment (Art 16)','Freedom of Religion (Art 25)'],ai:2,exp:'Articles 15, 16, 19, 29, and 30 are exclusive to citizens. Art 14, 20, 21, 23, 25-28 are available to both citizens and foreigners.'}
],
hook:'Art 12 defines "State". Art 13 is the heart of Judicial Review. Art 14 applies to foreigners; Art 15/16 DO NOT. Art 17 is absolute. Art 18 allows military/academic titles.',
summary:'Art 12: State definition. Art 13: Judicial Review. Art 14: Equality before law + Equal protection (President/Governor exceptions). Art 15: No discrimination on 5 grounds (Citizens only). Art 16: Public employment equality (Citizens only). Art 17: Untouchability abolished (Absolute). Art 18: Titles abolished (except Military/Academic).'},

{day:5,topic:'Fundamental Rights Block 2: Art 19–22 (Right to Freedom)',
intro:`The 'Right to Freedom' is the backbone of individual liberty in the Indian Constitution. Article 19 alone provides six fundamental freedoms that allow us to live as free citizens in a democracy. However, these freedoms are not absolute; they come with 'reasonable restrictions'. This block also contains the most expanded article in constitutional history—Article 21 (Protection of Life and Personal Liberty). Through judicial activism, Art 21 has grown to include the right to privacy, clean environment, and even the right to sleep. Understanding this block is crucial for both Prelims (direct articles) and Mains (liberty vs. security debates).`,
notes:[
{title:'Article 19: The Six Freedoms',detail:'Art 19(1) guarantees 6 rights: Speech & Expression, Assembly (peaceful/no arms), Association (includes Co-operatives - 97th Amdt), Movement, Residence, and Profession. Restrictions: These are not absolute and can be restricted for sovereignty, integrity, security, public order, etc.'},
{title:'Article 20: Protection in Conviction',detail:'Three protections: 1. No Ex-post-facto Law (cannot be punished for an act that was not a crime when committed). 2. No Double Jeopardy (cannot be punished twice for same offence). 3. No Self-incrimination (cannot be forced to be a witness against oneself).'},
{title:'Article 21: Life and Personal Liberty',detail:'"No person shall be deprived of his life or personal liberty except according to PROCEDURE ESTABLISHED BY LAW." SC in Maneka Gandhi case (1978) introduced "DUE PROCESS OF LAW" meaning the law itself must be just, fair, and reasonable.'},
{title:'Article 21A: Right to Education',detail:'Added by 86th Constitutional Amendment Act, 2002. State shall provide free and compulsory education to all children of 6 to 14 years. It made education a Fundamental Right.'},
{title:'Article 22: Arrest and Detention',detail:'Two types: 1. Punitive (after trial). 2. Preventive (before trial/to prevent crime). Rights under Punitive: informed of grounds, right to consult lawyer, produced before magistrate in 24 hours. Preventive detention can be for 3 months (can be extended by Advisory Board).'}
],
cards:[
{front:'Which freedoms under Art 19 are suspended during National Emergency?',back:'Art 19 is automatically suspended ONLY if National Emergency is declared on grounds of "WAR or EXTERNAL AGGRESSION". It is NOT suspended if emergency is due to "Armed Rebellion" (44th Amdt).'},
{front:'Can Art 20 and 21 be suspended during Emergency?',back:'NO. Under the 44th Amendment (1978), the enforcement of rights guaranteed by Articles 20 and 21 cannot be suspended even during a National Emergency under Article 359.'},
{front:'"Procedure Established by Law" vs "Due Process of Law"?',back:'Procedure Established: Law must be followed (Art 21 literal). Due Process: The law itself must be "fair, just and reasonable" (SC added this in Maneka Gandhi case). India now effectively follows Due Process.'},
{front:'Is the "Right to Privacy" a Fundamental Right?',back:'YES. In the Justice K.S. Puttaswamy case (2017), a 9-judge bench of the SC ruled that the Right to Privacy is an intrinsic part of the Right to Life and Personal Liberty under Article 21.'},
{front:'Maximum duration of Preventive Detention without Advisory Board?',back:'3 months. To extend beyond 3 months, an Advisory Board (consisting of persons qualified to be HC judges) must report sufficient cause.'}
],
q:[
{q:'Which of the following Fundamental Rights cannot be suspended even during a National Emergency?',options:['Article 19','Articles 20 and 21','Articles 21 and 22','Article 14'],ai:1,exp:'According to the 44th Amendment Act (1978), the rights under Articles 20 and 21 remain enforceable even during an Emergency under Art 359.'},
{q:'Article 21A (Right to Education) was added by which Constitutional Amendment?',options:['42nd Amendment','44th Amendment','86th Amendment','92nd Amendment'],ai:2,exp:'The 86th Constitutional Amendment Act, 2002 added Article 21A, making education a Fundamental Right for children aged 6-14.'},
{q:'The protection against "Double Jeopardy" is provided under which Article?',options:['Article 19','Article 20','Article 21','Article 22'],ai:1,exp:'Article 20(2) states that no person shall be prosecuted and punished for the same offence more than once (Double Jeopardy).'},
{q:'In which landmark case did the Supreme Court rule that the Right to Privacy is a Fundamental Right?',options:['Kesavananda Bharati Case','Maneka Gandhi Case','Justice K.S. Puttaswamy Case','Minerva Mills Case'],ai:2,exp:'The K.S. Puttaswamy case (2017) established the Right to Privacy as a Fundamental Right under Article 21.'}
],
hook:'Art 19 suspended only in External Emergency. Art 20 & 21 NEVER suspended. Art 21 expanded by Maneka Gandhi case. Art 21A=86th Amdt. Art 22=Punitive vs Preventive.',
summary:'Art 19: 6 freedoms (Speech, Assembly, Association, Movement, Residence, Profession). Art 20: No ex-post-facto, No double jeopardy, No self-incrimination. Art 21: Life & Liberty (expanded to Privacy, Environment, etc.). Art 21A: RTE (6-14 years). Art 22: Protection against arrest/detention.'},

{day:6,topic:'Fundamental Rights Block 3: Art 23–35 (Exploitation, Religion, Culture, Remedies)',
intro:`The final block of Fundamental Rights focuses on protecting the vulnerable and ensuring the secular fabric of India. Articles 23 and 24 protect against human trafficking and child labour. Articles 25 to 28 guarantee freedom of religion, which is the heart of Indian secularism. Articles 29 and 30 protect the interests of minorities. Finally, Article 32 is what Dr. Ambedkar called the 'Heart and Soul' of the Constitution—the Right to Constitutional Remedies. Without Article 32, all other rights are just words on paper, because it gives you the right to move the Supreme Court directly for the enforcement of your rights.`,
notes:[
{title:'Right against Exploitation (Art 23–24)',detail:'Art 23: Prohibits human trafficking, "begar" (forced labour), and other forms of forced labour. Exception: State can impose compulsory service for public purposes (like military/social service). Art 24: Prohibits employment of children below 14 in factories, mines, or hazardous activities.'},
{title:'Freedom of Religion (Art 25–28)',detail:'Art 25: Freedom of conscience + right to profess, practice, and propagate religion. Art 26: Right to manage religious affairs. Art 27: Freedom from taxes for promotion of religion. Art 28: Freedom from attending religious instruction in certain educational institutions.'},
{title:'Cultural & Educational Rights (Art 29–30)',detail:'Art 29: Protection of interests of minorities (language, script, culture). Art 30: Right of minorities (religious or linguistic) to establish and administer educational institutions. Note: "Minority" is NOT defined in the Constitution.'},
{title:'Right to Constitutional Remedies (Art 32)',detail:'Right to move SC for enforcement of FRs. SC can issue 5 types of Writs: Habeas Corpus (produce the body), Mandamus (we command), Prohibition (lower court stop), Certiorari (quash order), Quo-Warranto (by what authority). This is a "Basic Structure" of the Constitution.'},
{title:'Articles 33, 34 & 35',detail:'Art 33: Parliament can restrict/abrogate FRs of Armed Forces, Para-military, Police, etc. Art 34: Restriction on FRs while Martial Law is in force. Art 35: Only Parliament (not State Legislatures) has power to make laws to give effect to FRs.'}
],
cards:[
{front:'Art 32 vs Art 226—which is wider?',back:'Art 226 (High Court) is WIDER. SC (Art 32) can issue writs ONLY for Fundamental Rights. HC (Art 226) can issue writs for FRs AND "any other purpose" (legal rights). Also, Art 32 is itself a FR, while Art 226 is a constitutional right.'},
{front:'Can the State compel someone to provide "compulsory service"?',back:'YES. Under Article 23, the State can impose compulsory service for public purposes (like military conscription or social service) without paying, provided it does not discriminate on religion, race, caste, or class.'},
{front:'Does Art 25 allow forced conversions?',back:'NO. Art 25 allows propagation (spreading the message), but the SC in Rev. Stainislaus case (1977) ruled it does NOT include the right to convert another person by force, fraud, or inducement.'},
{front:'Which type of minorities are recognized under Art 30?',back:'RELIGIOUS and LINGUISTIC minorities. The Constitution does not define the term "minority" but recognizes these two types for the purpose of establishing educational institutions.'},
{front:'Habeas Corpus—can it be issued against private individuals?',back:'YES. Unlike most other writs (like Mandamus or Quo-Warranto) which are issued against public authorities, Habeas Corpus can be issued against both public authorities AND private individuals.'}
],
q:[
{q:'Which Article was called the "Heart and Soul of the Constitution" by Dr. B.R. Ambedkar?',options:['Article 14','Article 19','Article 21','Article 32'],ai:3,exp:'Article 32 provides the right to move the Supreme Court for the enforcement of Fundamental Rights, which Ambedkar considered the most important article.'},
{q:'Article 24 of the Indian Constitution prohibits the employment of children below what age in hazardous activities?',options:['12 years','14 years','16 years','18 years'],ai:1,exp:'Article 24 prohibits the employment of children below the age of 14 in factories, mines, or any other hazardous employment.'},
{q:'The writ of "Quo-Warranto" is issued to:',options:['Release a person illegally detained','Command a public official to perform duty','Inquire into the legality of a claim to a public office','Quash an order of a lower court'],ai:2,exp:'Quo-Warranto literally means "by what authority". It is issued to prevent illegal usurpation of a public office by a person.'},
{q:'Under Article 30, the right to establish and administer educational institutions is available to:',options:['Only Religious Minorities','Only Linguistic Minorities','Both Religious and Linguistic Minorities','All citizens of India'],ai:2,exp:'Article 30 specifically guarantees the right to "all minorities, whether based on religion or language" to establish and administer educational institutions.'}
],
hook:'Art 23=Forced labour. Art 24=Child labour (<14). Art 25-28=Secularism. Art 29-30=Minority rights (Religous/Linguistic). Art 32=Writs (Basic Structure).',
summary:'Art 23-24: Against Exploitation. Art 25-28: Religious Freedom. Art 29-30: Minority Rights (Religious/Linguistic). Art 32: Constitutional Remedies (Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto). Art 33-35: Forces, Martial Law, and Legislation power.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Very High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC Ranker Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Exam Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC '+d.topic+' Lakshmikanth'),why:'Detailed FR analysis for UPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Very High PYQ',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 4-6 v2 COMPLETE');
}
push();

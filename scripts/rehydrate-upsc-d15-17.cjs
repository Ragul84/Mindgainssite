require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:15,topic:'Centre-State Relations: Legislative, Administrative & Financial',
intro:`India is a 'Union of States' with a federal structure that leans heavily toward a strong Centre—often called 'Quasi-federal'. Today we explore Part XI and XII of the Constitution, which define the complex power-sharing between the Union and the States. From who can make laws on 'Residual' subjects to how tax revenue is distributed by the Finance Commission, these relations are the friction points of Indian politics. For a UPSC aspirant, mastering the Sarkaria and Punchhi Commission recommendations is the key to answering Mains questions on federalism.`,
notes:[
{title:'Legislative Relations (Art 245–255)',detail:'Parliament can make laws for the whole of India; State Legislatures for their state. Art 248: Residuary powers belong to Parliament. Art 249: Parliament can legislate on State List in national interest (requires RS resolution). Art 250: Parliament legislates on State List during National Emergency. Art 254: In Concurrent List conflict, Central law prevails.'},
{title:'Administrative Relations (Art 256–263)',detail:'Executive power of state must comply with Union laws. Art 257: Union can give directions to states (e.g., protection of railways). Art 262: Adjudication of Inter-state water disputes. Art 263: Inter-State Council (established by President on Sarkaria Commission recommendation).'},
{title:'Financial Relations (Art 268–293)',detail:'GST (Art 246A) gave concurrent power to both for taxation. Art 280: Finance Commission (every 5 years) recommends distribution of net proceeds of taxes. Art 292/293: Borrowing powers of Union and States. Union can borrow from abroad; States can only borrow internally (and need Union permission if they have outstanding debt).'},
{title:'Commissions on Federalism',detail:'Sarkaria Commission (1983): Suggested Inter-State Council, Governor should be a non-political figure. Punchhi Commission (2007): Suggested "Localised Emergency", fixed tenure for Governors. Administrative Reforms Commission (ARC).'}
],
cards:[
{front:'What is "Residuary Power"? (Art 248)',back:'The power to make laws on any subject not mentioned in the Union, State, or Concurrent lists. In India, this power belongs EXCLUSIVELY to the Parliament (Centre). In USA, it belongs to States.'},
{front:'Art 249—how can Parliament legislate on a State subject?',back:'If the Rajya Sabha passes a resolution supported by 2/3rd of members present and voting, declaring that it is in the "national interest" for Parliament to do so. Such a law lasts for 1 year.'},
{front:'Inter-State Council—which Article and who chairs?',back:'Article 263. It is a constitutional body. It is chaired by the Prime Minister. Members include CMs of all states and administrators of UTs.'},
{front:'Finance Commission—Article and Tenure?',back:'Article 280. It is a quasi-judicial body constituted by the President every 5 years (or earlier). It recommends tax devolution between Centre and States.'},
{front:'Can a State borrow from foreign markets?',back:'NO. Under Article 293, a State can only borrow within the territory of India. Only the Union Govt (Art 292) can borrow from international sources.'}
],
q:[
{q:'Residual powers of legislation in India belong to:',options:['State Legislatures','The Parliament','Both Parliament and States','The Supreme Court'],ai:1,exp:'Article 248 gives the Parliament exclusive power to make laws on residuary subjects.'},
{q:'The Finance Commission is constituted under which Article?',options:['Article 248','Article 263','Article 280','Article 312'],ai:2,exp:'Article 280 provides for the Finance Commission to be constituted by the President every 5 years.'},
{q:'Rajya Sabha can authorize Parliament to legislate on a State subject under which Article?',options:['Article 249','Article 250','Article 252','Article 254'],ai:0,exp:'Article 249 allows RS to pass a resolution in national interest to allow Parliament to legislate on State List.'},
{q:'Which Commission recommended the establishment of a permanent Inter-State Council?',options:['Punchhi Commission','Sarkaria Commission','Verma Commission','Shah Commission'],ai:1,exp:'The Sarkaria Commission (1983) on Centre-State relations recommended the Inter-State Council (established 1990).'}
],
hook:'Art 248=Residuary (Centre). Art 249=RS resolution for State list. Art 263=Inter-State Council. Art 280=Finance Commission. States cannot borrow from abroad.',
summary:'Legislative (Art 245-255), Administrative (Art 256-263), and Financial (Art 268-293) relations. Sarkaria and Punchhi Commission reports. Inter-State Council and Finance Commission role.'},

{day:16,topic:'Emergency Provisions: Art 352, 356 & 360',
intro:`Part XVIII of the Constitution contains the 'Emergency Provisions'—the mechanism that allows the Indian federal system to transform into a unitary one during times of crisis. There are three types: National Emergency, President's Rule (State Emergency), and Financial Emergency. While these are necessary for national security, they have often been the subject of intense political debate and judicial scrutiny. Today, we explore how an Emergency is declared, how it is approved by Parliament, and how the 44th Amendment added safeguards to prevent the kind of misuse seen in 1975.`,
notes:[
{title:'National Emergency (Art 352)',detail:'Grounds: War, External Aggression, or Armed Rebellion (word "Armed Rebellion" replaced "Internal Disturbance" by 44th Amdt). Proclaimed by President on WRITTEN advice of Cabinet. Approval: Both Houses by special majority within 1 month. Effects: Art 19 automatically suspended (Art 358). Enforcement of other FRs can be suspended (Art 359), EXCEPT Art 20 & 21.'},
{title:'President\'s Rule (Art 356)',detail:'Grounds: Failure of constitutional machinery in a state (Governor\'s report or otherwise). Art 365: Failure of state to comply with Union directions. Approval: Both Houses by SIMPLE MAJORITY within 2 months. Duration: Max 3 years (extension beyond 1 year requires election commission certification and emergency in force). Judicial Review: Allowed (S.R. Bommai case).'},
{title:'Financial Emergency (Art 360)',detail:'Grounds: Financial stability or credit of India is threatened. Approval: Simple majority within 2 months. Duration: Once approved, it continues indefinitely until revoked (no periodic approval needed). Effects: Reduction of salaries of govt servants and judges. India has NEVER declared a Financial Emergency.'},
{title:'44th Amendment Safeguards (1978)',detail:'1. Replaced "Internal Disturbance" with "Armed Rebellion". 2. Required WRITTEN advice of Cabinet. 3. Reduced approval time from 2 months to 1 month for Art 352. 4. Changed majority to Special Majority for Art 352. 5. Protected Art 20 & 21 from suspension.'}
],
cards:[
{front:'"Armed Rebellion" vs "Internal Disturbance"?',back:'"Internal Disturbance" was a vague term used to justify the 1975 Emergency. The 44th Amendment (1978) replaced it with "Armed Rebellion" to ensure National Emergency can only be declared for violent uprisings, not peaceful protests.'},
{front:'Which FRs can NEVER be suspended during Emergency?',back:'Articles 20 (Protection in conviction) and 21 (Right to Life and Liberty). This safeguard was added by the 44th Amendment.'},
{front:'Art 356 vs Art 365—what is the link?',back:'Art 356 is the power to impose President\'s Rule. Art 365 is a GROUND for it—stating that if a state fails to follow the Union\'s lawful directions, it is a failure of constitutional machinery.'},
{front:'What did the S.R. Bommai Case (1994) rule?',back:'The SC ruled that the proclamation of President\'s Rule is subject to Judicial Review. Secularism is a basic structure, and its violation can be a ground for Art 356. The assembly should not be dissolved until Parliament approves the proclamation.'},
{front:'Has India ever declared a Financial Emergency?',back:'NO. Even during the 1991 economic crisis, Article 360 was not invoked.'}
],
q:[
{q:'A National Emergency under Article 352 must be approved by Parliament within:',options:['1 month','2 months','3 months','6 months'],ai:0,exp:'The 44th Amendment reduced the approval time from 2 months to 1 month.'},
{q:'Which Article is used to impose "President\'s Rule" in a state?',options:['Article 352','Article 356','Article 360','Article 365'],ai:1,exp:'Article 356 is the primary article for President\'s Rule. Art 365 is a related ground.'},
{q:'The enforcement of which Fundamental Rights cannot be suspended even during an Emergency?',options:['Art 14 and 19','Art 19 and 21','Art 20 and 21','Art 21 and 22'],ai:2,exp:'As per the 44th Amendment, Art 20 and 21 cannot be suspended under any circumstances.'},
{q:'Grounds for National Emergency were changed from "Internal Disturbance" to "Armed Rebellion" by which Amendment?',options:['24th Amendment','42nd Amendment','44th Amendment','52nd Amendment'],ai:2,exp:'The 44th Amendment (1978) introduced "Armed Rebellion" to prevent misuse of emergency powers.'}
],
hook:'Art 352=National (Special majority, 1 month). Art 356=State (Simple majority, 2 months). Art 360=Financial (Never used). 44th Amdt protects Art 20/21.',
summary:'Types of Emergency (Art 352, 356, 360). Approval process and majorities. Effects on FRs and Federalism. 44th Amendment safeguards. Landmark Bommai judgment.'},

{day:17,topic:'Constitutional Bodies: ECI, CAG, UPSC & Finance Commission',
intro:`Constitutional Bodies are the 'Pillars of Indian Democracy'. These institutions derive their authority directly from the Constitution, giving them a high degree of independence from the government of the day. Today we study the 'Big Four': the Election Commission of India (ECI), the Comptroller and Auditor General (CAG), the Union Public Service Commission (UPSC), and the Finance Commission. For a UPSC aspirant, understanding their 'Security of Tenure' and 'Functions' is vital, as these bodies are the gatekeepers of fair elections, financial accountability, and meritocracy in the civil services.`,
notes:[
{title:'Election Commission (Art 324)',detail:'Conducts elections to Parliament, State Legislatures, and offices of President/VP. (Note: State Election Commission conducts local body polls). Multi-member body (1 CEC + 2 ECs). CEC has security of tenure like a SC judge (removed by impeachment). ECs can be removed by President on recommendation of CEC.'},
{title:'Comptroller and Auditor General (Art 148)',detail:'"Guardian of the Public Purse". Audits accounts of Union and States. Appointment by President for 6 years or 65 years age. Security of tenure like SC judge. Salary/conditions cannot be varied to disadvantage. Not eligible for further office under Govt after retirement.'},
{title:'UPSC & SPSC (Art 315–323)',detail:'UPSC: Central recruiting agency. Members appointed by President. Security of tenure (removed by President only on SC inquiry for misbehaviour). Advisory role (advice not binding). SPSC: State level. Members appointed by Governor but REMOVED ONLY BY PRESIDENT.'},
{title:'Finance Commission (Art 280)',detail:'Quasi-judicial body. 1 Chairman + 4 Members appointed by President every 5 years. Recommends: 1. Vertical Devolution (Centre to States). 2. Horizontal Devolution (Between States). 3. Grants-in-aid. Recommendations are ADVISORY (not binding). 15th FC (N.K. Singh) recommended 41% share for states.'}
],
cards:[
{front:'Who conducts elections for Panchayats and Municipalities?',back:'The STATE ELECTION COMMISSION (established under Art 243K and 243ZA). The Election Commission of India (ECI) does NOT conduct local body elections.'},
{front:'Can the CAG hold further office after retirement?',back:'NO. Under Article 148, the CAG is not eligible for any further office under the Government of India or any State Government after they cease to hold office. This ensures independence.'},
{front:'Who can remove a member of a State Public Service Commission (SPSC)?',back:'ONLY the PRESIDENT (not the Governor). Although the Governor appoints them, the power of removal is vested in the President to ensure independence from state political pressure.'},
{front:'Are Finance Commission recommendations binding?',back:'NO. They are advisory in nature. However, governments usually accept them as a matter of constitutional convention.'},
{front:'Article 312—what is it?',back:'The power of Rajya Sabha to create one or more All-India Services (like IAS, IPS, IFoS) by passing a resolution by 2/3rd majority.'}
],
q:[
{q:'Which Constitutional Body is known as the "Guardian of the Public Purse"?',options:['Finance Commission','NITI Aayog','Comptroller and Auditor General','Public Accounts Committee'],ai:2,exp:'The CAG (Art 148) is responsible for auditing all government expenditure.'},
{q:'The Finance Commission is constituted by the President every:',options:['3 years','5 years','6 years','1 year'],ai:1,exp:'Article 280 states the FC is constituted every five years or earlier if necessary.'},
{q:'Members of the State Public Service Commission are removed by:',options:['Governor of the State','Chief Minister','President of India','Chief Justice of High Court'],ai:2,exp:'SPSC members are appointed by the Governor but removed only by the President (Art 317).'},
{q:'The Election Commission of India does NOT conduct elections for:',options:['Parliament','State Legislature','President and Vice President','Local Bodies (Panchayats)'],ai:3,exp:'Local body elections are the responsibility of the State Election Commission.'}
],
hook:'ECI=Art 324. CAG=Art 148. UPSC=Art 315. FC=Art 280. SPSC members removed by PRESIDENT only. CAG cannot hold office after retirement.',
summary:'Election Commission (Art 324). CAG (Art 148). UPSC & SPSC (Art 315-323). Finance Commission (Art 280). Functions, appointments, and independence mechanisms.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC Ranker Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Exam Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC '+d.topic+' Polity'),why:'Critical federal and institutional analysis.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High PYQ',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 15-17 v2 COMPLETE');
}
push();

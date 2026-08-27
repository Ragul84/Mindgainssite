require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:8,topic:'UPSC Polity: Directive Principles of State Policy (DPSP)',
intro:`If Fundamental Rights are the 'Individual's Rights', then Directive Principles of State Policy (Part IV, Art 36-51) are the 'State's Duties'. Borrowed from the Irish Constitution, DPSPs are non-justiciable (you cannot go to court to enforce them), but they are 'fundamental in the governance of the country'. UPSC frequently tests the classification of these principles—Socialistic, Gandhian, and Liberal-Intellectual—and the famous legal conflict between FRs and DPSPs that was eventually resolved by the 'Doctrine of Harmony'.`,
notes:[
{title:'Classification of DPSP',detail:'Socialistic: Art 38 (Justice), 39 (Resources), 39A (Free Legal Aid), 41 (Right to Work), 42 (Maternity relief), 43 (Living wage), 43A (Workers mgmt). Gandhian: Art 40 (Panchayats), 43 (Cottage industries), 43B (Co-ops), 46 (SC/ST interests), 47 (Prohibit liquor), 48 (Prohibit cow slaughter). Liberal: Art 44 (UCC), 45 (Early childhood care), 48 (Agriculture/Animal husbandry), 48A (Environment), 49 (Monuments), 50 (Judiciary sep), 51 (International peace).'},
{title:'FR vs DPSP Conflict',detail:'Champakam Dorairajan (1951): FRs prevail. Golak Nath (1967): FRs sacrosanct. Kesavananda (1973): Basic Structure. Minerva Mills (1980): The SC ruled that there must be harmony between FRs and DPSPs; they are like "two wheels of a chariot".'},
{title:'New DPSPs added by Amendments',detail:'42nd Amdt (1976): Added 39 (Children health), 39A (Free legal aid), 43A (Workers participation), 48A (Environment). 44th Amdt (1978): Added Art 38(2) (Minimize inequalities). 86th Amdt (2002): Subject matter of Art 45 changed (Education). 97th Amdt (2011): Added Art 43B (Co-operative societies).'},
{title:'Significance of DPSP',detail:'Instrument of Instructions to the Govt. Facilitate stability and continuity in policies. Supplement FRs. Test for the performance of the government.'}
],
cards:[
{front:'Are DPSPs "Justiciable"?',back:'NO. Art 37 clearly states that DPSPs are non-justiciable (not enforceable by courts). However, they are fundamental in the governance of the country and it is the duty of the State to apply these in making laws.'},
{front:'Which Article deals with the Uniform Civil Code (UCC)?',back:'Article 44. It falls under the Liberal-Intellectual category of DPSPs.'},
{front:'Which Article deals with the separation of Judiciary from Executive?',back:'Article 50. This is a Liberal-Intellectual principle and is essential for the rule of law.'},
{front:'What was the outcome of the Minerva Mills Case (1980)?',back:'The SC ruled that the Indian Constitution is founded on the bedrock of the balance between Fundamental Rights and Directive Principles. They are complementary to each other.'},
{front:'Article 40—what does it prescribe?',back:'Organization of Village Panchayats. This is a Gandhian principle.'}
],
q:[
{q:'Which of the following is NOT a Gandhian Principle in DPSP?',options:['Organization of Village Panchayats (Art 40)','Promotion of cottage industries (Art 43)','Separation of Judiciary from Executive (Art 50)','Prohibition of intoxicating drinks (Art 47)'],ai:2,exp:'Art 50 (Separation of Judiciary) is a Liberal-Intellectual principle. Art 40, 43, and 47 are Gandhian.'},
{q:'Which Constitutional Amendment added "Free Legal Aid" (Art 39A) to the DPSP?',options:['24th Amendment','42nd Amendment','44th Amendment','73rd Amendment'],ai:1,exp:'The 42nd Amendment (1976) added Art 39A (Free Legal Aid), 43A, and 48A to the DPSP.'},
{q:'The concept of "Directive Principles of State Policy" was borrowed from:',options:['USA','United Kingdom','Ireland','Canada'],ai:2,exp:'DPSPs were borrowed from the Irish Constitution (which borrowed them from the Spanish Constitution).'},
{q:'In which case did the Supreme Court state that the Constitution is founded on the balance between FRs and DPSPs?',options:['Kesavananda Bharati Case','Minerva Mills Case','Golak Nath Case','Berubari Union Case'],ai:1,exp:'Minerva Mills case (1980) established the "Harmony" between Part III and Part IV.'}
],
hook:'Art 36-51 (Part IV). Non-justiciable but fundamental. Art 40=Panchayat. Art 44=UCC. Art 50=Judiciary separation. 42nd Amdt added 39A, 43A, 48A. Minerva Mills=Balance.',
summary:'DPSP classification: Socialistic, Gandhian, Liberal. Key articles: 40(Panchayat), 44(UCC), 50(Judiciary sep). Conflict resolution via Minerva Mills (Harmony). Amendments: 42nd, 44th, 86th, 97th added/modified principles.'},

{day:9,topic:'Fundamental Duties & The Amendment Map',
intro:`Today we cover the 'Citizen's Responsibilities'—the Fundamental Duties (Part IV-A, Art 51A). Interestingly, the original Constitution of 1949 did not have Fundamental Duties; they were added during the Emergency on the recommendations of the Swaran Singh Committee. We also dive into the 'Amendment Map' of the Constitution. For a UPSC aspirant, knowing which Amendment did what is not optional—it is the difference between a Ranker and an Aspirant. We will map out the most critical amendments from the 1st to the 106th that changed the course of Indian history.`,
notes:[
{title:'Fundamental Duties (Art 51A)',detail:'Added by 42nd Amdt (1976) on Swaran Singh Committee recommendation. Originally 10 duties. 11th duty (education for children 6-14) added by 86th Amdt (2002). Borrowed from USSR. Non-justiciable but can be used by courts to determine the constitutionality of a law.'},
{title:'List of Key Duties',detail:'Abide by Constitution, Respect National Flag/Anthem. Cherish ideals of freedom struggle. Protect sovereignty/unity/integrity. Defend country/national service. Promote harmony/common brotherhood. Value/preserve rich heritage. Protect natural environment. Develop scientific temper/humanism. Safeguard public property. Strive for excellence. Parent/guardian to provide education (added 2002).'},
{title:'The Amendment Map: The Big 10',detail:'1st (1951): 9th Schedule added. 7th (1956): Reorganization of states. 24th (1971): Parliament can amend FRs. 42nd (1976): "Mini Constitution", Socialist/Secular/Integrity, FDs added. 44th (1978): Restored rights after Emergency, Property right removed from FR. 52nd (1985): Anti-defection (10th Sch). 61st (1988): Voting age 21→18. 73rd/74th (1992): Panchayats/ULB. 86th (2002): RTE. 101st (2016): GST. 103rd (2019): EWS. 104th (2020): Anglo-Indian seats abolished.'},
{title:'Procedure for Amendment (Art 368)',detail:'Initiated ONLY in Parliament (not State Legislatures). No prior permission of President. Simple majority vs Special majority vs Special majority + State ratification (for federal features). President MUST give assent to Constitution Amendment Bill (24th Amdt).'}
],
cards:[
{front:'Were FDs in the original Constitution?',back:'NO. They were added by the 42nd Amendment in 1976 based on the Swaran Singh Committee recommendation. Only the 11th duty was added later by the 86th Amendment in 2002.'},
{front:'Are FDs "Justiciable"?',back:'NO. Similar to DPSPs, Fundamental Duties are non-justiciable. You cannot be punished by a court for not following them, unless there is a specific law made by Parliament (like the Prevention of Insults to National Honour Act).'},
{front:'Which Amendment removed the "Right to Property" from FRs?',back:'44th Amendment (1978). It made it a legal right under Article 300A in Part XII.'},
{front:'Which Amendment lowered the voting age to 18?',back:'61st Amendment (1988, effective 1989).'},
{front:'Can a Constitution Amendment Bill be introduced by a Private Member?',back:'YES. It can be introduced either by a Minister or a private member and does not require prior permission of the President.'}
],
q:[
{q:'Fundamental Duties were added to the Constitution on the recommendation of which Committee?',options:['Sarkaria Committee','Swaran Singh Committee','Verma Committee','Punchhi Committee'],ai:1,exp:'The Swaran Singh Committee (1976) recommended the inclusion of Fundamental Duties.'},
{q:'How many Fundamental Duties were originally added by the 42nd Amendment?',options:['8','10','11','12'],ai:1,exp:'The 42nd Amendment added 10 duties. The 11th was added by the 86th Amendment in 2002.'},
{q:'The 61st Amendment is famous for:',options:['Adding the 10th Schedule','Lowering voting age from 21 to 18','Introducing GST','Making Education a Fundamental Right'],ai:1,exp:'The 61st Amendment (1988) lowered the voting age to 18.'},
{q:'A Constitution Amendment Bill requiring ratification by half of the states deals with:',options:['Admission of new states','Federal structure (like Election of President)','Fundamental Rights','Directive Principles'],ai:1,exp:'Amendments affecting the federal structure (Art 54, 55, 73, 162, 241, 7th Schedule, etc.) require ratification by half of the state legislatures.'}
],
hook:'FDs=Part IV-A, Art 51A. 11 duties total. 86th Amdt added 11th duty. 44th Amdt removed Property right. 61st Amdt=18 yrs voting. 104th=Anglo-Indian seats GONE.',
summary:'Part IV-A (Art 51A): 11 Fundamental Duties (10 from 42nd Amdt, 1 from 86th Amdt). Amendment Map: 1st, 7th, 24th, 42nd, 44th, 52nd, 61st, 73rd, 74th, 86th, 101st-106th. Procedure: Art 368.'},

{day:10,topic:'The Parliament: Structure, Sessions & Speaker',
intro:`We now enter the heart of Indian Democracy—the Parliament (Art 79-122). The Parliament is not just a building; it is a tripartite institution consisting of the President, the Lok Sabha (House of the People), and the Rajya Sabha (Council of States). Today, we focus on the machinery: how members are elected, how the Houses are structured, the crucial role of the Speaker, and the 'Sessions' that keep the government accountable. For a UPSC aspirant, understanding the 'Quorum', 'Adjournment', and 'Dissolution' is the first step toward mastering legislative procedures.`,
notes:[
{title:'Structure of Parliament (Art 79)',detail:'Parliament = President + Lok Sabha + Rajya Sabha. President is NOT a member of either House but is an integral part. LS (Lower House): Max 550 (530 States + 20 UTs) - currently 543 elected. RS (Upper House): Max 250 (238 States/UTs + 12 Nominated by President).'},
{title:'Lok Sabha vs Rajya Sabha',detail:'LS: 5-year term, can be dissolved. Direct election (Universal Adult Franchise). RS: Permanent house, cannot be dissolved. 1/3rd members retire every 2 years. Indirect election by elected MLAs. 12 nominated by President (Art, Science, Literature, Social Service).'},
{title:'Sessions of Parliament',detail:'Summoning (President). Prorogation (President - ends a session). Dissolution (President - ends life of LS only). Adjournment (Speaker/Chairman - suspends a sitting for hours/days). Adjournment Sine Die (terminates sitting indefinitely). Quorum: 1/10th of total membership of the House (including Speaker/Chairman).'},
{title:'The Speaker of Lok Sabha',detail:'Elected by LS members. Doesn\'t resign from party but acts neutrally. Powers: Maintains order, decides if a bill is a Money Bill (Art 110), presides over Joint Sitting (Art 108), decides disqualification under 10th Schedule. Removed only by a resolution passed by effective majority of LS.'},
{title:'Language in Parliament',detail:'Hindi and English (Art 120). Speaker can allow a member to speak in their mother tongue.'}
],
cards:[
{front:'Is the President a member of the Parliament?',back:'NO. The President is NOT a member of either House and does not sit in Parliament. However, the President is an INTEGRAL PART of Parliament because no bill becomes law without presidential assent.'},
{front:'What is a "Quorum"?',back:'The minimum number of members required to be present to conduct the business of the House. It is 1/10th of the total membership (including the presiding officer). For LS, it is ~55; for RS, it is ~25.'},
{front:'Who decides if a Bill is a "Money Bill"?',back:'The Speaker of the Lok Sabha. Their decision is final and cannot be challenged in any court or by the President or the Rajya Sabha.'},
{front:'Difference between Prorogation and Dissolution?',back:'Prorogation ends a SESSION of the House (LS or RS). Dissolution ends the LIFE of the House (ONLY Lok Sabha). Rajya Sabha is a permanent house and is never dissolved.'},
{front:'Who presides over a "Joint Sitting" of Parliament?',back:'The Speaker of the Lok Sabha. If the Speaker is absent, the Deputy Speaker. If they are absent, the Deputy Chairman of Rajya Sabha (NOT the Chairman/VP).'}
],
q:[
{q:'The Parliament of India consists of:',options:['Lok Sabha and Rajya Sabha','Lok Sabha, Rajya Sabha and Prime Minister','Lok Sabha, Rajya Sabha and President','Lok Sabha, Rajya Sabha and Council of Ministers'],ai:2,exp:'According to Article 79, Parliament consists of the President and the two Houses.'},
{q:'The maximum strength of nominated members in the Rajya Sabha is:',options:['2','10','12','15'],ai:2,exp:'The President nominates 12 members to the Rajya Sabha from the fields of Art, Science, Literature, and Social Service.'},
{q:'The "Quorum" to constitute a sitting of either House of Parliament is:',options:['One-fifth','One-tenth','One-eighth','One-fourth'],ai:1,exp:'The Quorum is 1/10th of the total number of members of the House.'},
{q:'Which of the following is NOT a ground for nomination to Rajya Sabha?',options:['Literature','Science','Art','Sports'],ai:3,exp:'The Constitution specifies: Literature, Science, Art, and Social Service. Sports is NOT a constitutional ground for nomination (Sachin Tendulkar was nominated under "Art" interpretation or "Social Service").'}
],
hook:'Parliament=Pres+LS+RS. Quorum=1/10th. Speaker decides Money Bill. RS=Permanent. Joint Sitting=Art 108 (Speaker presides). Nominated members in RS=12.',
summary:'Art 79-122. Composition of LS & RS. Qualifications/Disqualifications. Sessions: Summoning, Prorogation, Dissolution. Officers: Speaker, Chairman. Quorum. Joint Sitting.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC Ranker Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Exam Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC '+d.topic+' Polity'),why:'Core Parliament & Rights coaching.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High PYQ',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 8-10 v2 COMPLETE');
}
push();

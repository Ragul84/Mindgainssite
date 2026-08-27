require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:11,topic:'Parliamentary Procedures: Bills, Majorities & Ordinances',
intro:`Today we go deeper into the 'Functions' of Parliament. A Parliamentarian's primary job is making laws. But not all bills are the same. A 'Money Bill' (Art 110) has a completely different power dynamic than an 'Ordinary Bill'. We also tackle the 'Types of Majorities'—Simple, Absolute, and Special—which is one of the most confusing yet crucial topics for Prelims. Finally, we look at 'Ordinances' (Art 123), the President's legislative power when Parliament is not in session. Understanding these procedures is the key to understanding how the executive is held accountable by the legislature.`,
notes:[
{title:'Types of Bills',detail:'Ordinary Bill (Art 107/108): Can be introduced in either House. Requires simple majority. Money Bill (Art 110): Introduced ONLY in Lok Sabha with President\'s prior recommendation. RS has only 14 days to suggest changes (cannot reject). Financial Bill (I) (Art 117(1)): Like Money Bill but can be rejected by RS. Financial Bill (II) (Art 117(3)): Like Ordinary Bill but involves expenditure from Consolidated Fund.'},
{title:'Joint Sitting (Art 108)',detail:'Called by President to resolve deadlock on Ordinary or Financial Bills. NOT available for Money Bills or Constitution Amendment Bills. Presided by Speaker of LS.'},
{title:'Types of Majorities',detail:'Simple: >50% of members present and voting. Used for ordinary bills, confidence motion. Absolute: >50% of total membership. Effective: >50% of (Total membership - Vacancies). Used to remove Speaker/VP. Special: 2/3rd members present and voting + absolute majority. Used for Constitution Amendment (Art 368). Special (Art 61): 2/3rd of total membership. Used for President\'s Impeachment.'},
{title:'Ordinance Power (Art 123)',detail:'Legislative power of President when both Houses (or one) are not in session. Has same force as an Act. MUST be laid before Parliament when it reassembles. Ceases to operate 6 weeks after reassembly. Max life of an ordinance: 6 months + 6 weeks.'},
{title:'Lapsing of Bills',detail:'A bill pending in LS lapses if LS dissolves. A bill passed by LS but pending in RS lapses. A bill pending in RS but NOT passed by LS does NOT lapse. Bill passed by both Houses pending President\'s assent does NOT lapse.'}
],
cards:[
{front:'What is a "Money Bill"? (Art 110)',back:'A bill dealing exclusively with taxation, borrowing, or expenditure from the Consolidated Fund. The Speaker\'s decision on whether a bill is a Money Bill is FINAL. RS can only delay it for 14 days.'},
{front:'Can a "Joint Sitting" be held for a Constitution Amendment Bill?',back:'NO. Article 368 requires each House to pass the amendment bill separately by a special majority. If there is a deadlock, the bill fails.'},
{front:'Difference between "Absolute Majority" and "Effective Majority"?',back:'Absolute = >50% of TOTAL seats (e.g., 272+ in LS). Effective = >50% of (Total seats - Vacancies). Effective majority is used to remove the Speaker/Deputy Speaker and Vice President.'},
{front:'Maximum life of an Ordinance?',back:'6 months and 6 weeks. 6 months is the maximum gap between two sessions of Parliament, and the ordinance expires 6 weeks after Parliament reassembles unless approved.'},
{front:'Does a bill pending in Rajya Sabha lapse when Lok Sabha dissolves?',back:'ONLY if it was already passed by the Lok Sabha. If it was introduced in Rajya Sabha and is still pending there without having gone to LS, it does NOT lapse.'}
],
q:[
{q:'A Money Bill can be introduced only in:',options:['Rajya Sabha','Lok Sabha','Either House of Parliament','A Joint Sitting'],ai:1,exp:'Article 110(3) and 109 state that a Money Bill must originate in the Lok Sabha.'},
{q:'Who presides over a Joint Sitting of both Houses of Parliament?',options:['President of India','Prime Minister','Chairman of Rajya Sabha','Speaker of Lok Sabha'],ai:3,exp:'According to Art 118, the Speaker presides. If absent, the Deputy Speaker. If both absent, the Deputy Chairman of RS.'},
{q:'An Ordinance issued by the President under Article 123 must be approved by Parliament within:',options:['6 weeks from reassembly','6 months from reassembly','3 months from reassembly','14 days from reassembly'],ai:0,exp:'The ordinance ceases to operate at the expiration of 6 weeks from the reassembly of Parliament.'},
{q:'A Constitution Amendment Bill under Article 368 requires which majority?',options:['Simple Majority','Absolute Majority','Special Majority (2/3 present & voting + Absolute)','Unanimous vote'],ai:2,exp:'Art 368 requires a majority of the total membership of each House and a majority of not less than 2/3rd of members present and voting.'}
],
hook:'Money Bill=Art 110 (LS only). Joint Sitting=Art 108 (No Money/Amdt bills). Max Ordinance life=6m+6w. Effective Majority=Speaker removal. Special Majority=Art 368.',
summary:'Money Bill vs Finance Bill. Joint Sitting procedures. Majorities: Simple, Absolute, Effective, Special. Ordinance Power (Art 123). Lapsing of bills rules.'},

{day:12,topic:'The President: Election, Veto & Pardon',
intro:`The President is the 'Head of the State' and the first citizen of India. While the President is a nominal head (working on the advice of the Council of Ministers), the position carries immense constitutional significance. Today we study the 'Electoral College' (Art 54)—who exactly votes for the President? We also explore the President's 'Veto Powers' (Absolute, Suspensive, Pocket) and the 'Pardoning Power' (Art 72), which is significantly broader than the Governor's. For a UPSC aspirant, understanding the 'Impeachment' process (Art 61) is critical, as it is the only way a President can be removed.`,
notes:[
{title:'Election of President (Art 54 & 55)',detail:'Electoral College = Elected MPs (LS+RS) + Elected MLAs of all States + Elected MLAs of UTs (Delhi+Puducherry+J&K). Note: NO NOMINATED members, NO MLCs (Legislative Councils). Method: Proportional Representation by Single Transferable Vote.'},
{title:'Impeachment of President (Art 61)',detail:'Ground: "Violation of the Constitution" (not defined). Initiated in either House. Requires 1/4th members to sign notice. Passed by SPECIAL MAJORITY of 2/3rd of TOTAL membership of the House. Note: Nominated members CAN participate in impeachment, even though they don\'t vote in the election.'},
{title:'Veto Powers of the President (Art 111)',detail:'Absolute Veto: Withhold assent (ends the bill). Suspensive Veto: Returns bill for reconsideration (if passed again by Parliament with simple majority, President MUST sign). Pocket Veto: Taking no action (bill stays pending indefinitely). Note: President has NO VETO over Constitution Amendment Bills (24th Amdt).'},
{title:'Pardoning Power (Art 72)',detail:'Pardon (completely absolves), Commutation (lighter form), Remission (reduce period), Respite (lesser sentence for special grounds like pregnancy), Reprieve (stay of execution). President can pardon death sentences and court-martial sentences (Governor cannot).'},
{title:'Discretionary Powers of President',detail:'Appointment of PM when no clear majority. Dismissal of CoM when it loses confidence. Dissolution of LS if CoM loses majority. Situational discretion, as President usually acts on advice (Art 74).'}
],
cards:[
{front:'Who votes in the Presidential Election but NOT in the Vice-Presidential Election?',back:'Elected MLAs of States and UTs. The VP election involves ONLY the members of Parliament (both elected and nominated).'},
{front:'What is "Pocket Veto"?',back:'The President keeps the bill pending on his desk for an indefinite period. Since the Constitution does not specify a time limit for the President to give assent, this acts as a veto. Used by Zail Singh in the Post Office Bill (1986).'},
{front:'Can the Governor pardon a death sentence?',back:'NO. Under Article 161, the Governor can suspend, remit or commute a death sentence, but CANNOT PARDON it. ONLY the President has the power to pardon a death sentence (Art 72).'},
{front:'Difference between "Assent" and "Veto"?',back:'Assent makes the bill an Act. Veto prevents the bill from becoming an Act. For Constitution Amendment Bills, the President MUST give assent (24th Amdt 1971).'},
{front:'Impeachment Majority—what is unique?',back:'It requires 2/3rd of the TOTAL membership of the House. This is the highest/toughest majority in the Indian Constitution.'}
],
q:[
{q:'The Electoral College for the election of the President consists of:',options:['All members of Parliament','Elected members of Parliament only','Elected members of Parliament and State Assemblies (including Delhi/Puducherry)','All members of Parliament and State Legislatures'],ai:2,exp:'Art 54: Elected members of LS, RS, and State Legislative Assemblies (MLAs). Nominated members and MLCs are excluded.'},
{q:'Under which Article can the President be impeached?',options:['Article 52','Article 61','Article 72','Article 123'],ai:1,exp:'Article 61 prescribes the procedure for impeachment of the President for violation of the Constitution.'},
{q:'Which of the following powers is NOT possessed by the Governor, but possessed by the President?',options:['Pardoning power','Power to issue ordinances','Power to pardon a death sentence','Power to nominate members to the legislature'],ai:2,exp:'Only the President can pardon (Art 72) a death sentence or a court-martial sentence. Governor (Art 161) cannot.'},
{q:'The President of India can return a bill (other than Money Bill) for reconsideration. This is called:',options:['Absolute Veto','Suspensive Veto','Pocket Veto','Qualified Veto'],ai:1,exp:'Suspensive Veto allows the President to return the bill once. If Parliament passes it again by simple majority, the President must sign.'}
],
hook:'Electoral College=Elected MPs+MLAs. Nominated members participate in Impeachment but NOT Election. Art 72=Pardon (includes Death/Military). Pocket Veto=Indefinite delay. Art 61=Impeachment.',
summary:'Election process (Art 54/55). Impeachment (Art 61). Executive, Legislative, Financial, and Judicial powers. Veto powers (Art 111). Pardoning powers (Art 72). Discretionary powers.'},

{day:13,topic:'Executive & State Legislature: PM, CoM, Governor & CM',
intro:`Today we transition from the Union to the States and look at the 'Real Executives'. In India's parliamentary system, the Prime Minister (at the Union) and the Chief Minister (at the States) are the pivots of power. We explore the principle of 'Collective Responsibility'—the idea that the entire Council of Ministers (CoM) sinks or swims together. We also look at the 'Governor' (Art 153), a position that has often been at the center of political storms. For a UPSC aspirant, understanding the parallels and differences between the Union and State executive is the key to mastering Federalism.`,
notes:[
{title:'PM & Council of Ministers (Art 74 & 75)',detail:'Art 74: CoM with PM at head to aid and advise President (advice is BINDING after 42nd/44th Amdts). Art 75: PM appointed by President. Ministers appointed by President on PM\'s advice. Ministers hold office during the PLEASURE of the President. Collective Responsibility: CoM is collectively responsible to the LOK SABHA (not RS).'},
{title:'The Governor (Art 153–161)',detail:'Appointed by President. Holds office during the PLEASURE of the President (no fixed tenure/security). Acts as a dual agent: Constitutional head of state + Agent of Central Govt. Article 163: CoM to advise Governor (Governor\'s discretionary power is WIDER than President\'s). Art 161: Pardoning power (excludes death/court-martial).'},
{title:'Chief Minister & State CoM',detail:'CM appointed by Governor. Art 164: State CoM is collectively responsible to the STATE LEGISLATIVE ASSEMBLY (Vidhan Sabha). Similar to the Union, the Governor acts on the advice of the State CoM.'},
{title:'State Legislature: Structure',detail:'Unicameral (only Vidhan Sabha) or Bicameral (Vidhan Sabha + Vidhan Parishad). Currently only 6 states have Vidhan Parishad: UP, Bihar, Karnataka, Maharashtra, Telangana, Andhra Pradesh. Art 169: Parliament can create or abolish a Legislative Council if State Assembly passes a resolution by special majority.'},
{title:'Cabinet vs Council of Ministers',detail:'CoM is a wider body (60-70 ministers). Cabinet is a smaller core (15-20 senior ministers). Cabinet meets frequently to take decisions; CoM rarely meets as a whole. Word "Cabinet" was added to Constitution by 44th Amdt (Art 352).'}
],
cards:[
{front:'What does "Collective Responsibility" mean?',back:'It means the Council of Ministers is a team. If a No-Confidence Motion is passed in the Lok Sabha, the entire ministry (including members from Rajya Sabha) must resign. "They swim and sink together".'},
{front:'Is the Governor\'s advice-taking mandatory?',back:'Generally, YES. But Article 163 gives the Governor certain DISCRETIONARY powers where he can act without advice. This discretion is explicitly mentioned in the Constitution for the Governor, but not for the President.'},
{front:'Which states have a Legislative Council (Vidhan Parishad)?',back:'UP, Bihar, Maharashtra, Karnataka, Telangana, Andhra Pradesh (6 states). Tamil Nadu abolished its council in 1986.'},
{front:'Can a person be a Minister without being an MP/MLA?',back:'YES. For a maximum of 6 months. Within this period, they must get elected to either House, otherwise they cease to be a minister.'},
{front:'Who appoints the Governor?',back:'The President. The Governor holds office at the pleasure of the President, meaning he can be removed at any time without a reason/process.'}
],
q:[
{q:'The Council of Ministers is collectively responsible to the:',options:['President','Parliament','Lok Sabha','Prime Minister'],ai:2,exp:'Article 75(3) states that the Council of Ministers shall be collectively responsible to the House of the People (Lok Sabha).'},
{q:'Which Article deals with the appointment of the Prime Minister?',options:['Article 72','Article 74','Article 75','Article 78'],ai:2,exp:'Article 75 states that the Prime Minister shall be appointed by the President.'},
{q:'How many states in India currently have a bicameral legislature (Legislative Council)?',options:['5','6','7','9'],ai:1,exp:'UP, Bihar, Maharashtra, Karnataka, Andhra Pradesh, and Telangana (6 states).'},
{q:'The Governor of a state holds office:',options:['For a fixed term of 5 years','During the pleasure of the President','Until the next assembly election','During the pleasure of the Chief Minister'],ai:1,exp:'Article 156 states the Governor holds office during the pleasure of the President.'}
],
hook:'CoM responsible to LS (Art 75). Governor=Pleasure of President. Only 6 states have LC. Art 74 advice is binding on President. PM=Real Head. Pres=Nominal Head.',
summary:'Appointment and role of PM & CM. Collective vs Individual Responsibility. Governor: Appt, Powers, Discretion. State Legislature: Unicameral vs Bicameral. Cabinet vs CoM.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Very High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC Ranker Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Exam Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC '+d.topic+' Polity'),why:'Critical Parliament & Executive sessions.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Very High PYQ',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 11-13 v2 COMPLETE');
}
push();

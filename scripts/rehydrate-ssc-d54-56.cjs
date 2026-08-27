require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:54,topic:'SSC Polity: Important Articles & Amendments',
intro:`Today we study the 'Tools of Governance'. This is a high-speed drill of the most important 'Article Numbers' and 'Amendment Years'. In SSC, you don't need to analyze the law, you just need to know its number. From Article 368 (Amendment) to the 73rd/74th Amendments (Panchayats)—these are the high-yield facts. Do you know which amendment lowered the voting age to 18? Let's master the codes today.`,
notes:[
{title:'Emergency Provisions',detail:'Art 352 (National), Art 356 (State/President\'s Rule), Art 360 (Financial - Never used in India).'},
{title:'Constitutional Amendments (Art 368)',detail:'1st (9th Schedule), 42nd (Mini Constitution), 44th (Property removed), 52nd (Anti-defection), 61st (Voting age 21 to 18), 73rd/74th (Panchayats/Municipalities), 101st (GST).'},
{title:'Top Articles to Memorize',detail:'108 (Joint Sitting), 110 (Money Bill), 112 (Budget), 148 (CAG), 280 (Finance Commission), 312 (All India Services), 324 (Election Commission).'},
{title:'Official Languages (Art 343)',detail:'Hindi in Devanagari script. 8th Schedule has 22 languages.'},
{title:'Panchayati Raj (73rd Amend)',detail:'Art 243. 3-tier system: Gram, Block, District. Added 11th Schedule. Nagarpalika (74th) added 12th Schedule.'}
],
cards:[
{front:'Article for Constitutional Amendment?',back:'Article 368.'},
{front:'Amendment that lowered voting age to 18?',back:'61st Amendment (1989).'},
{front:'Article for Finance Commission?',back:'Article 280.'},
{front:'Article for Election Commission?',back:'Article 324.'},
{front:'Which amendment is the "Mini Constitution"?',back:'42nd Amendment.'}
],
q:[
{q:'Which article of the constitution deals with "Financial Emergency"?',options:['352','356','360','368'],ai:2,exp:'Article 360 gives power to the President to declare financial emergency.'},
{q:'The "Money Bill" is defined in which article?',options:['110','112','123','108'],ai:0,exp:'It can only be introduced in Lok Sabha.'},
{q:'The 61st Amendment (1989) is famous for:',options:['Anti-defection law','Lowering voting age to 18','Introducing GST','Adding Preamble words'],ai:1,exp:'Reduced age from 21 to 18.'},
{q:'"Article 148" of the Indian Constitution deals with:',options:['AG','CAG','Finance Commission','UPSC'],ai:1,exp:'Comptroller and Auditor General of India.'}
],
hook:'368=Amend. 61st=Vote 18. 110=Money. 148=CAG. 280=FC. 352/356/360=Emergency. 73=Panchayat.',
summary:'List of top 20 articles for SSC exams. Chronology of landmark constitutional amendments. Mechanism of emergency provisions. Introduction to Panchayati Raj.'},

{day:55,topic:'SSC Static GK: Books, Authors & Awards',
intro:`Today we study 'Literature and Recognition'. This is the most unpredictable yet scoring part of SSC. We explore 'Ancient to Modern Books' and the 'Major National & International Awards'. Do you know who wrote "My Experiments with Truth"? Or who was the first Bharat Ratna recipient? Let's master the static records today.`,
notes:[
{title:'Ancient/Medieval Books',detail:'Arthashastra (Kautilya), Indica (Megasthenes), Harshacharita (Banabhatta), Rajatarangini (Kalhana), Ain-i-Akbari (Abul Fazal), Baburnama (Babur).'},
{title:'Modern Books/Authors',detail:'My Experiments with Truth (Gandhi), Discovery of India (Nehru), Unhappy India (Lala Lajpat Rai), Gitanjali (Tagore), Godan (Premchand).'},
{title:'National Awards',detail:'Bharat Ratna (Highest civilian - 1st: C. Rajagopalachari, S. Radhakrishnan, C.V. Raman), Padma Awards, Jnanpith (Literature), Dadasaheb Phalke (Cinema).'},
{title:'Gallantry Awards',detail:'Param Vir Chakra (Highest - 1st: Somnath Sharma), Ashok Chakra.'},
{title:'International Awards',detail:'Nobel Prize (1st Indian: Tagore), Oscar (1st: Bhanu Athaiya), Pulitzer (Journalism), Ramon Magsaysay (Asia\'s Nobel).'}
],
cards:[
{front:'Who wrote "Discovery of India"?',back:'Jawaharlal Nehru.'},
{front:'First Indian to win Nobel Prize?',back:'Rabindranath Tagore (1913).'},
{front:'Who wrote "Arthashastra"?',back:'Kautilya.'},
{front:'First recipient of Bharat Ratna?',back:'C. Rajagopalachari (among 3 in 1954).'},
{front:'Award for Journalism?',back:'Pulitzer Prize.'}
],
q:[
{q:'"Indica" was written by which foreign traveler?',options:['Fa-hien','Hieun Tsang','Megasthenes','Ibn Battuta'],ai:2,exp:'He was an ambassador of Seleucus Nicator to the court of Chandragupta Maurya.'},
{q:'Who is the author of the book "Gitanjali"?',options:['Premchand','Tagore','Sarojini Naidu','Nehru'],ai:1,exp:'He won the Nobel Prize for Literature for this work.'},
{q:'The "Dadasaheb Phalke Award" is given in the field of:',options:['Sports','Science','Cinema','Literature'],ai:2,exp:'Highest award in Indian cinema.'},
{q:'Who was the first Indian woman to win an Oscar?',options:['Priyanka Chopra','Aishwarya Rai','Bhanu Athaiya','Deepika Padukone'],ai:2,exp:'Won for Costume Design in the movie "Gandhi".'}
],
hook:'Tagore=1913. Indica=Megasthenes. Phalke=Cinema. Pulitzer=Journalism. Bhanu Athaiya=Oscar. Nehru=Discovery.',
summary:'Timeline of famous Indian literature and authors. List of highest civilian and gallantry awards. Profile of first Indian achievers in global awards.'},

{day:56,topic:'SSC REVISION: Polity & Static GK (Days 50–55)',
intro:`Today we consolidate the 'Rules and Records'. You have mastered the constitution, the rights, the executive hierarchy, and the world of books and awards. In SSC, this block provides around 4-6 questions. Today, we drill the numbers and names. If you see '324', you say 'Election'. If you see 'Bhanu Athaiya', you say 'Oscar'. Let's lock in the final GK marks today.`,
notes:[
{title:'Polity Facts Recap',detail:'Drafting (Ambedkar). USA (FR). 42nd (Mini Constitution). 17 (Untouchability). 32 (Heart/Soul). 35=Age for Pres. 110=Money. 368=Amend.'},
{title:'Parliament Recap',detail:'LS (550). RS (250/Perm). 108 (Joint). Zero Hour (12 PM). Mavalankar (1st Speaker).'},
{title:'Amendment Recap',detail:'61st (Vote 18). 73rd (Panchayat). 10th Sch (Defection).'},
{title:'Books Recap',detail:'Arthashastra (Kautilya). Indica (Megasthenes). Gitanjali (Tagore). Discovery (Nehru).'},
{title:'Awards Recap',detail:'Bharat Ratna (1954). Nobel (Tagore 1913). Oscar (Bhanu Athaiya). Phalke (Cinema).'}
],
cards:[
{front:'Article for CAG?',back:'Article 148.'},
{front:'Age for voting?',back:'18 years.'},
{front:'"My Experiments with Truth" author?',back:'Mahatma Gandhi.'},
{front:'Permanent house?',back:'Rajya Sabha.'},
{front:'First Nobel in Science (Indian)?',back:'C.V. Raman (1930).'}
],
q:[
{q:'"Article 324" deals with:',options:['UPSC','Election Commission','Finance Commission','CAG'],ai:1,exp:'GK staple.'},
{q:'Which amendment added the words "Socialist" and "Secular"?',options:['42nd','44th','52nd','61st'],ai:0,exp:'1976 mini-constitution.'},
{q:'"Abul Fazal" wrote which book?',options:['Baburnama','Ain-i-Akbari','Indica','Arthashastra'],ai:1,exp:'Biography of Akbar.'},
{q:'The highest gallantry award in India is:',options:['Bharat Ratna','Ashok Chakra','Param Vir Chakra','Vir Chakra'],ai:2,exp:'Awarded for the most conspicuous bravery in the presence of the enemy.'}
],
hook:'Polity+Static complete. Fact drill. Master the articles. Success is in the memory.',
summary:'Full revision of Indian Polity and Static GK facts. High-speed drill of articles, amendments, and awards. Comparison of first achievers in India. Final GK Block 2 mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC GK Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'GK Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL '+d.topic),why:'Consolidating GK and Polity facts for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | GK',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:1,topic:'Tamil Ezhuthu & Phonetics (எழுத்திலக்கணம்)',
notes:[
{title:'உயிர் எழுத்துக்கள் (Vowels)',detail:'12 vowels: அ,ஆ,இ,ஈ,உ,ஊ,எ,ஏ,ஐ,ஒ,ஓ,ஔ. குறில் (short)=5: அ,இ,உ,எ,ஒ. நெடில் (long)=7: ஆ,ஈ,ஊ,ஏ,ஐ,ஓ,ஔ. Samacheer 6th Std Tamil.'},
{title:'மெய் எழுத்துக்கள் (Consonants)',detail:'18 consonants. வல்லினம் (hard/6): க,ச,ட,த,ப,ற. மெல்லினம் (soft/6): ங,ஞ,ண,ந,ம,ன. இடையினம் (mid/6): ய,ர,ல,வ,ழ,ள.'},
{title:'மொத்த எழுத்துக்கள்',detail:'Total Tamil letters=247. Uyir(12)+Mei(18)+Aytham(1)+Uyirmei(216)=247. The Aytham (ஃ) is NEITHER uyir NOR mei — classified separately. Most tested TNPSC Tamil fact.'},
{title:'TNPSC Trap',detail:'Common wrong answer: 246 (forgetting Aytham). Correct: 247. Also: Uyirmei = 12×18=216 (not 12×16). Every TNPSC Group 2 and Group 4 Tamil paper tests this.'}
],
hook:'Total Tamil letters=247. வல்லினம்(க,ச,ட,த,ப,ற)+மெல்லினம்(ங,ஞ,ண,ந,ம,ன)+இடையினம்(ய,ர,ல,வ,ழ,ள)=18 mei. Aytham(ஃ)=special. Samacheer 6th Std.',
cards:[
{front:'மொத்த தமிழ் எழுத்துக்கள் எத்தனை?',back:'247 = Uyir(12)+Mei(18)+Aytham(1)+Uyirmei(216). NEVER 246.'},
{front:'வல்லினம் எழுத்துக்கள் எவை?',back:'க,ச,ட,த,ப,ற — 6 hard consonants. Samacheer 6th Std Tamil.'},
{front:'குறில் vs நெடில் என்றால் என்ன?',back:'குறில்=short vowel(1 unit). நெடில்=long vowel(2 units). 5 குறில்+7 நெடில்=12 uyir.'}
],
q:[
{q:'Total Tamil alphabet letters according to Tamil grammar?',options:['244','246','247','256'],answer_index:2,explanation:'247=12 Uyir+18 Mei+1 Aytham+216 Uyirmei. Aytham counted separately. Common trap=246 (forgetting Aytham).'},
{q:'Which consonant group contains ங,ஞ,ண,ந,ம,ன?',options:['Vallinam','Mellinam','Itayinam','Uyir'],answer_index:1,explanation:'Mellinam (மெல்லினம்)=soft consonants: ங,ஞ,ண,ந,ம,ன. Vallinam=க,ச,ட,த,ப,ற. Itayinam=ய,ர,ல,வ,ழ,ள.'}
],
pyq:'Very High — Every TNPSC Group 2/4 Tamil paper.',
summary:'Uyir(12: 5 kuril+7 nedil)+Mei(18: vallnam6+mellinam6+itayinam6)+Aytham(1)+Uyirmei(216)=247 total. Samacheer 6th Std. Aytham=neither uyir nor mei=special category.'},

{day:2,topic:'Sol Ilakkanam — Tamil Word Types (சொல் வகைகள்)',
notes:[
{title:'4 Tamil Word Types',detail:'1. பெயர்ச்சொல் (Noun). 2. வினைச்சொல் (Verb). 3. இடைச்சொல் (Particle/Connector). 4. உரிச்சொல் (Qualifier). These 4 cover ALL Tamil words. Samacheer 7th Std Tamil Grammar.'},
{title:'பெயர்ச்சொல் — 6 Types',detail:'பொருட்பெயர்(object name), இடப்பெயர்(place), காலப்பெயர்(time), சினைப்பெயர்(body part/part of whole), குணப்பெயர்(quality), தொழிற்பெயர்(verbal noun/gerund).'},
{title:'வினைச்சொல் Types',detail:'முற்றுவினை=finite verb (completes sentence). எச்சவினை=non-finite (links to next element). செய்வினை=active. செயப்படுவினை=passive. 3 tenses: இறந்தகாலம்/நிகழ்காலம்/எதிர்காலம்.'},
{title:'இடைச்சொல் & உரிச்சொல்',detail:'இடைச்சொல்=particles with no independent meaning (உம்,ஆல்,ஐ — connect or modify). உரிச்சொல்=qualifiers that intensify meaning (மிகவும்,கொஞ்சம்,உறு). Only precede nouns or verbs.'}
],
hook:'4 soll vagaigal: Peyar+Vinai+Idai+Uri. TNPSC trap: Idaiccol has NO independent meaning — it connects. Uriccol ONLY qualifies (cannot stand alone). Samacheer 7th Std.',
cards:[
{front:'Tamil grammar-il soll vagaigal etthanai? (சொல் வகைகள் எத்தனை?)',back:'4 types: பெயர்ச்சொல்(Noun), வினைச்சொல்(Verb), இடைச்சொல்(Particle), உரிச்சொல்(Qualifier).'},
{front:'முற்றுவினை vs எச்சவினை வேறுபாடு?',back:'முற்றுவினை=finite verb completing a sentence (predicate). எச்சவினை=non-finite participial form linking to another element.'},
{front:'தொழிற்பெயர் என்றால் என்ன?',back:'Verbal noun (gerund) — a noun derived from a verb. Example: ஓடுதல்(running), படித்தல்(studying). 6th type of peyarccol.'}
],
q:[{q:'இடைச்சொல் எந்த வகை சொல்?',options:['Noun','Verb','Particle/Connector','Qualifier'],answer_index:2,explanation:'இடைச்சொல்=Particle. Has NO independent meaning. Connects or modifies other words. Examples: உம், ஆல், ஐ.'},
{q:'Which verb form completes a sentence as its predicate in Tamil?',options:['எச்சவினை','முற்றுவினை','தொழிற்பெயர்','பண்புப்பெயர்'],answer_index:1,explanation:'முற்றுவினை (Mutruvinnai)=finite verb that forms the predicate and completes the sentence. எச்சவினை is non-finite.'}
],
pyq:'High — TNPSC Group 2 Tamil Grammar section.',
summary:'4 சொல் வகைகள்: பெயர்(6 subtypes)+வினை(முற்று/எச்சம்)+இடை(connectors,no independent meaning)+உரி(qualifiers only). Samacheer 7th Std.'},

{day:3,topic:'Vetrumai Uruppugal — 8 Tamil Cases (வேற்றுமை)',
notes:[
{title:'8 Cases (வேற்றுமைகள்)',detail:'1.எழுவாய்(Nominative,no marker,Subject). 2.ஐ(Accusative,Direct Object). 3.ஆல்/ஆன்(Instrumental,By/With). 4.கு/க்கு(Dative,To/For). 5.இல்/இன்று(Ablative,From). 6.ஓடு/உடன்(Sociative,With/Together). 7.இல்/கண்/இடத்தில்(Locative,In/At). 8.ஏ/ஓ(Vocative,Calling).'},
{title:'Most Tested Cases',detail:'2nd case (ஐ)=direct object. 4th case (க்கு)=direction/benefit. 3rd case (ஆல்)=instrument/agent. 7th case (இல்)=location. These 4 cover 90% of TNPSC case questions. Samacheer 8th Std Tamil Grammar.'},
{title:'Sentence Examples',detail:'2nd: "புத்தகத்தை படித்தான்" (book-ஐ). 4th: "பள்ளிக்கு சென்றான்" (school-க்கு). 3rd: "கத்தியால் வெட்டினான்" (knife-ஆல்). 7th: "மரத்தில் ஏறினான்" (tree-இல்).'},
{title:'TNPSC Question Pattern',detail:'TNPSC gives a sentence, underlines a word, asks: "Which vetrumai?" Always identify the SUFFIX/MARKER first, then match to the case number.'}
],
hook:'Memory: 1=subject(no marker), 2=ஐ(object), 3=ஆல்(by), 4=க்கு(to/for), 5=இல்(from), 6=ஓடு(with), 7=இல்(in/at), 8=ஓ(calling). Cases 5 and 7 both use "இல்" — distinguish by context (from vs in). Samacheer 8th Std.',
cards:[
{front:'8 வேற்றுமைகள் மற்றும் உருபுகள் என்ன?',back:'1.எழுவாய் 2.ஐ 3.ஆல் 4.க்கு 5.இல்(from) 6.ஓடு 7.இல்(in) 8.ஏ/ஓ. Samacheer 8th Std.'},
{front:'"ராமன் பள்ளிக்கு சென்றான்" — பள்ளிக்கு எந்த வேற்றுமை?',back:'4th வேற்றுமை (நான்காம் வேற்றுமை). Dative case. Marker=க்கு. Direction/destination.'},
{front:'"கத்தியால் வெட்டினான்" — எந்த வேற்றுமை?',back:'3rd வேற்றுமை (மூன்றாம் வேற்றுமை). Instrumental case. Marker=ஆல். Means of action.'}
],
q:[{q:'"அவன் மரத்தில் ஏறினான்" — மரத்தில் எந்த வேற்றுமை?',options:['2nd','4th','7th','5th'],answer_index:2,explanation:'மரத்தில்=Locative case (7th வேற்றுமை). Marker=இல். Indicates location where action happens. Not ablative(5th) which means FROM.'},
{q:'Which case marker indicates the DIRECT OBJECT in Tamil?',options:['ஆல்','ஐ','க்கு','இல்'],answer_index:1,explanation:'"ஐ" = 2nd வேற்றுமை (Accusative). Marks direct object of verb. Example: "புத்தகத்தை எடுத்தான்" — புத்தகத்தை is the object.'}
],
pyq:'Very High — Every TNPSC Tamil Grammar section.',
summary:'8 vetrumai: 1.Subject(no marker) 2.ஐ(object) 3.ஆல்(by/instrument) 4.க்கு(to/for) 5.இல்(from/ablative) 6.ஓடு(with) 7.இல்(in/locative) 8.ஏ(vocative). Note: cases 5 and 7 both use "இல்" but differ in meaning. Samacheer 8th Std.'},

{day:4,topic:'Sangam Literature & Thinai System (சங்க இலக்கியம்)',
notes:[
{title:'3 Tamil Sangams (தமிழ் சங்கங்கள்)',detail:'1st Sangam: Madurai (submerged). 4800 years. 4449 poets. Lost. 2nd Sangam: Kapadapuram (submerged). 3700 years. 3700 poets. Lost. 3rd Sangam: Madurai. 1850 years. 449 poets. Works SURVIVED — these are what we study as Sangam Literature.'},
{title:'18 Major Works (பதினெண்மேற்கணக்கு)',detail:'8 Anthologies (எட்டுத்தொகை): Purananuru, Akananuru, Kuruntokai, Natrinai, Kalittokai, Aingurunuru, Padirruppattu, Paripatal. 10 Idylls (பத்துப்பாட்டு): Tirumurugarruppadai, Porunaraatruppadai, Sirupanatruppadai, Perumpanatruppadai, Mullaippattu, Maduraikkanji, Nedunalatai, Kurinjippatu, Pattinappalai, Malaipadukadam.'},
{title:'5 Thinai (திணை) System',detail:'5 landscape-based literary themes: Kurinji(mountain/union/love). Mullai(forest/waiting). Marudam(farmland/infidelity). Neytal(coast/grief). Palai(desert/separation). Each Thinai has: flower, tree, bird, deity, season, time of day assigned.'},
{title:'Tolkappiyam',detail:'Oldest surviving Tamil grammar. Author: Tolkappiyar. Three sections: Ezhuttathikaram(phonology), Solathikaram(morphology), Porulathikaram(poetics/semantics). Covers Thinai system in detail. Samacheer 9th Std Tamil.'}
],
hook:'TNPSC Pattern: 3rd Sangam works SURVIVED. Tolkappiyam = oldest Tamil grammar. 5 Thinai: Kurinji(mountain,union), Mullai(forest,waiting), Marudam(field,infidelity), Neytal(coast,grief), Palai(desert,separation). Each Thinai has a specific flower — Kurinji flower(Kurinji plant), Mullai(jasmine), Marudam(marudam tree flower), Neytal(blue lily), Palai(palai flower).',
cards:[
{front:'எத்தனை தமிழ் சங்கங்கள்? எந்த சங்கம் நூல்கள் தொலைத்தது?',back:'3 சங்கங்கள். 1st and 2nd Sangam works LOST (cities submerged). 3rd Sangam (Madurai) works SURVIVED as Sangam literature.'},
{front:'Tolkappiyam எந்த நூல்? யார் எழுதினார்?',back:'Oldest surviving Tamil grammar. Written by Tolkappiyar. 3 sections: Ezhuttathikaram+Solathikaram+Porulathikaram. Samacheer 9th Std.'},
{front:'5 Thinai மற்றும் அவற்றின் பொருண்மை என்ன?',back:'Kurinji(mountain,union/love), Mullai(forest,waiting/hope), Marudam(farmland,infidelity), Neytal(coast,longing/grief), Palai(desert,separation).'}
],
q:[{q:'Which of the 3 Tamil Sangams had its works surviving to the present day?',options:['1st Sangam at Madurai','2nd Sangam at Kapadapuram','3rd Sangam at Madurai','All three Sangams'],answer_index:2,explanation:'Only 3rd Sangam works survived. 1st and 2nd Sangam cities were submerged by the sea — their works are lost. The 3rd Sangam met at Madurai and its works form what we call Sangam Literature.'},
{q:'Which Thinai (landscape theme) represents the theme of UNION/LOVE in Sangam poetry?',options:['Mullai','Neytal','Kurinji','Palai'],answer_index:2,explanation:'Kurinji=mountain landscape=theme of union/love/meeting. Mullai=forest=waiting. Neytal=coastal=longing/grief. Palai=desert/arid=separation. Marudam=fertile field=infidelity.'}
],
pyq:'High — TNPSC Unit 8 Tamil culture. Sangam literature and Thinai system tested frequently.',
summary:'3 Sangams: 1st+2nd lost(submerged), 3rd(Madurai) survived=Sangam literature. Tolkappiyam=oldest Tamil grammar(Tolkappiyar). 18 major works=8 anthologies(Ettuthokai)+10 idylls(Pattuppattu). 5 Thinai: Kurinji(union)+Mullai(waiting)+Marudam(infidelity)+Neytal(grief)+Palai(separation). Samacheer 9th Std.'},

{day:5,topic:'Thirukkural — Structure & Key Adhikarams (திருக்குறள்)',
notes:[
{title:'Structure of Thirukkural',detail:'Author: Thiruvalluvar. 1330 Kurals (couplets) in 133 Adhikarams (chapters) in 3 Palams (books): Arathupal(Dharma,380 kurals,38 chapters), Porutpal(Wealth/Polity,700 kurals,70 chapters), Kamathupal(Love,250 kurals,25 chapters). Each Kural=2 lines(7+3 syllables).'},
{title:'Key Adhikarams for TNPSC',detail:'Arathupal: Adhikaram 1(Kadavul Vazlthu-Praise of God), 2(Vaan Sirappu-Importance of Rain), 4(Anbu Udaimai-Virtue of Love), 10(Illaram-Domestic Virtue). Porutpal: Adhikaram 39(King), 67(Messengers/Ambassadors). These are TNPSC prescribed adhikarams.'},
{title:'Famous Kurals',detail:'Kural 1: "Akara mudala ezhuttellam adi bhagavan mutratthe ulagu" (God is to all letters as A is first). Kural 391: On learning. Kural 1: establishes God. Kural 2: Rain is nectar of life. Every TNPSC Tamil paper quotes a Kural and asks: which adhikaram? or author/meaning?'},
{title:'Epithets of Thiruvalluvar',detail:'Poyyamozhi Pulavar, Deiva Pulavar, Nayanar, Perunalandar, Valluvar. The text is called: Muppaal(3 books), Muttamizh(3 Tamil arts), Poyyamozhi(words of truth), Uttaravedam. Samacheer 10th Std Tamil.'}
],
hook:'TNPSC Kural Structure: 1330 Kurals, 133 Adhikarams, 3 Palams. Arathupal(38 ch)+Porutpal(70 ch)+Kamathupal(25 ch)=133. 38+70+25=133 chapters. Memory: 3-7-0, 7-0-0, 2-5-0 for kurals per palam. Each chapter=10 kurals(10×133=1330).',
cards:[
{front:'Thirukkural — எத்தனை குறள்கள், அதிகாரங்கள், பால்கள்?',back:'1330 Kurals, 133 Adhikarams, 3 Palams. Each adhikaram=10 kurals. 10×133=1330. Arathupal(38)+Porutpal(70)+Kamathupal(25)=133.'},
{front:'திருக்குறளின் 3 பால்கள் மற்றும் அவற்றின் குறள் எண்ணிக்கை?',back:'அறத்துப்பால்=380 kurals(38 ch). பொருட்பால்=700 kurals(70 ch). காமத்துப்பால்=250 kurals(25 ch). Total=1330.'},
{front:'திருவள்ளுவரின் சிறப்பு பெயர்கள் யாவை?',back:'பொய்யாமொழிப் புலவர், தெய்வப் புலவர், நாயனார், பெருநலனடார். Text also called: Muppaal, Uttaravedam, Poyyamozhi.'}
],
q:[{q:'Thirukkural has how many Adhikarams (chapters)?',options:['100','130','133','140'],answer_index:2,explanation:'133 Adhikarams=38(Arathupal)+70(Porutpal)+25(Kamathupal). Each adhikaram has 10 kurals. 133×10=1330 total kurals.'},
{q:'Which Palam (book) of Thirukkural deals with governance and polity?',options:['Arathupal','Porutpal','Kamathupal','Inbathupal'],answer_index:1,explanation:'Porutpal (பொருட்பால்)=Wealth/Polity book. 70 adhikarams, 700 kurals. Covers governance, king, ministers, army, ambassadors. Arathupal=Dharma/Ethics. Kamathupal=Love.'}
],
pyq:'Very High — Every TNPSC paper. Kural structure and adhikaram identification tested every year.',
summary:'Thirukkural: Thiruvalluvar. 1330 kurals, 133 adhikarams, 3 palams. Arathupal(38ch,380K)+Porutpal(70ch,700K)+Kamathupal(25ch,250K). Each adhikaram=10 kurals. Epithets: Poyyamozhi pulavar+Deiva pulavar. Samacheer 10th Std Tamil.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏛️ TNPSC Samacheer Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC Tamil: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC '+d.topic+' Tamil grammar samacheer'),why:'Samacheer-based coaching.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('TNPSC Days 1-5 COMPLETE');
}
push();

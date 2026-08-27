require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:71,topic:'TNPSC General Tamil: Ilakkanam — Ezhuthu & Sol',
intro:`Today we study the 'Structure of Tamil'. Ilakkanam (Grammar) is the foundation of General Tamil. In TNPSC, 'Classification of letters (Vowels/Consonants)' and 'Types of words' are high-yield. Do you know the difference between 'Uyir' and 'Mei'? Let's master the sounds today.`,
notes:[
{title:'Ezhuthu (Letter)',detail:'1. Mudhal Ezhuthu: 12 Vowels (Uyir) + 18 Consonants (Mei) = 30. 2. Sarbezhuthu (Dependent): 10 types (Uyiralabedai, etc).'},
{title:'Uyir Ezhuthu',detail:'Kuril (Short - 5: a, i, u, e, o). Nedil (Long - 7: aa, ii, uu, ee, ai, oo, au).'},
{title:'Mei Ezhuthu',detail:'Vallinam (Hard: k, c, t, th, p, r), Mellinam (Soft: ng, nj, n, m, n), Idaiyinam (Medium: y, r, l, v, l, l).'},
{title:'Sol (Word)',detail:'4 types: Peyarchol (Noun), Vinayichol (Verb), Idaichol (Particle), Urichol (Adjective/Adverb).'},
{title:'Maathirai (Timing)',detail:'Kuril (1), Nedil (2), Mei/Ayutham (1/2).'}
],
cards:[
{front:'Total Mudhal Ezhuthus?',back:'30.'},
{front:'Maathirai for Kuril?',back:'1.'},
{front:'Maathirai for Nedil?',back:'2.'},
{front:'Maathirai for Mei?',back:'1/2.'},
{front:'Classification of "k, c, t, th, p, r"?',back:'Vallinam.'}
],
q:[
{q:'How many "Mudhal Ezhuthus" are there in Tamil?',options:['12','18','30','247'],ai:2,exp:'12 Uyir + 18 Mei.'},
{q:'"k, c, t, th, p, r" belong to which category?',options:['Vallinam','Mellinam','Idaiyinam','None'],ai:0,exp:'Hard sounds.'},
{q:'The time duration (Maathirai) for a long vowel (Nedil) is:',options:['1','2','1/2','3'],ai:1,exp:'Standard grammatical rule.'},
{q:'How many types of "Sarbezhuthu" are there?',options:['5','8','10','12'],ai:2,exp:'Dependent letters (Uyiralabedai, etc).'}
],
hook:'Uyir=12. Mei=18. Mudhal=30. Nedil=2. Kuril=1. Mei=1/2. Vallinam=Hard.',
summary:'Classification of Tamil letters and their timing (Maathirai). Detailed study of vowels and consonants. Introduction to the four types of Tamil words.'},

{day:72,topic:'TNPSC General Tamil: Ilakkanam — Porul & Yaappu',
intro:`Today we study the 'Essence of Poetry'. Porul (Subject) and Yaappu (Prosody) deal with the themes and rules of Tamil poetry. In TNPSC, 'Agam vs Puram' and 'Types of Paa' (Venba, Asiriyappa) are high-yield. Do you know which landscape is for 'Love'? Let's master the poetic logic today.`,
notes:[
{title:'Porul Ilakkanam',detail:'1. Agam (Inner - Love/Family). 2. Puram (Outer - War/Valor/Virtue).'},
{title:'Agathinai (7 types)',detail:'Kurinji, Mullai, Marutham, Neithal, Palai (already in Unit 8) + Kaikkilai (One-sided), Perunthinai (Unmatched).'},
{title:'Yaappu (Prosody)',detail:'6 parts: Ezhuthu, Asai, Seer, Thalai, Adi, Thodai.'},
{title:'Seer & Asai',detail:'Asai: Ner (Simple), Nirai (Compound). Seer: Combination of Asais.'},
{title:'Types of Paa (Metre)',detail:'Venba (Cheppalosai - Thirukkural), Asiriyappa (Agavalosai), Kalippa (Thullalosai), Vanjippa (Thoongalosai).'}
],
cards:[
{front:'Venba sound?',back:'Cheppalosai.'},
{front:'Asiriyappa sound?',back:'Agavalosai.'},
{front:'Agam deals with?',back:'Love/Inner life.'},
{front:'Puram deals with?',back:'War/Valor/Outer life.'},
{front:'Total Agathinais?',back:'7.'}
],
q:[
{q:'Which sound is associated with "Venba"?',options:['Agavalosai','Cheppalosai','Thullalosai','Thoongalosai'],ai:1,exp:'Thirukkural is written in Venba.'},
{q:'How many "Angas" (parts) does "Yaappilakkanam" have?',options:['4','5','6','7'],ai:2,exp:'Ezhuthu to Thodai.'},
{q:'"Agapporul" mainly deals with:',options:['War','Love','Kings','Charity'],ai:1,exp:'Inner emotional life.'},
{q:'"Thirukkural" is an example of which "Paa"?',options:['Asiriyappa','Venba','Kalippa','Vanjippa'],ai:1,exp:'Specifically "Kural Venba".'}
],
hook:'Venba=Cheppal. Asiriya=Agaval. Kali=Thullal. Vanji=Thoongal. Agam=Love. Puram=War.',
summary:'Differences between Agam and Puram literature. Structural elements of Tamil prosody (Yaappu). Identification of musical sounds associated with different poetic meters.'},

{day:73,topic:'TNPSC General Tamil: Ilakkiam — Pathinen Melkanakku',
intro:`Today we study the 'Upper Eighteen'. Pathinen Melkanakku consists of the heroic and romantic poems of the Sangam age. In TNPSC, 'Ettuthogai' and 'Pathupattu' details are high-yield. Do you know which work is called 'Tamil Veda'? Let's master the classical works today.`,
notes:[
{title:'Ettuthogai (Eight Anthologies)',detail:'Purananuru (War), Agananuru (Love), Natrinai, Kurunthogai, Pathitrupathu (Chera kings), Paripaadal (Music/Gods), Kalithogai, Aingurunuru.'},
{title:'Pathupattu (Ten Idyls)',detail:'Thirumurugatrupadai, Porunaratrupadai, Mullaippaatu, Maduraikanchi (longest), Nedunalvaadai, Kurinjipaatu, Pattinappaalai.'},
{title:'Authors',detail:'Purananuru (Multiple), Maduraikanchi (Mangudi Maruthanar), Pattinappaalai (Kadiyalur Uruthirangannanar).'},
{title:'Themes',detail:'Aham (Love): Kurunthogai, Agananuru. Puram (War): Purananuru, Pathitrupathu.'},
{title:'Oldest Work',detail:'Tholkappiyam (Grammar) is the precursor to these literary works.'}
],
cards:[
{front:'Number of works in Ettuthogai?',back:'8.'},
{front:'Number of works in Pathupattu?',back:'10.'},
{front:'Longest work in Pathupattu?',back:'Maduraikanchi.'},
{front:'Work about Chera kings?',back:'Pathitrupathu.'},
{front:'Is Purananuru Agam or Puram?',back:'Puram.'}
],
q:[
{q:'Which of the following belongs to "Ettuthogai"?',options:['Maduraikanchi','Purananuru','Mullaippaatu','Pattinappaalai'],ai:1,exp:'It is one of the eight anthologies.'},
{q:'"Maduraikanchi" was written by:',options:['Ilango Adigal','Mangudi Maruthanar','Kambar','Nakkirar'],ai:1,exp:'Longest poem in Pathupattu.'},
{q:'"Pathitrupathu" gives information about which dynasty?',options:['Cholas','Pandyas','Cheras','Pallavas'],ai:2,exp:'Dedicated to ten Chera kings.'},
{q:'Which work is known for "Tamil Musical" elements?',options:['Natrinai','Paripaadal','Kalithogai','Agananuru'],ai:1,exp:'Combined music, dance, and poetry.'}
],
hook:'Ettuthogai=8. Pathupattu=10. Maduraikanchi=Longest. Pathitrupathu=Chera. Purananuru=War.',
summary:'Detailed breakdown of the Eight Anthologies and Ten Idyls. Identification of major authors and their central themes. Distinction between Aham and Puram classical works.'},

{day:74,topic:'TNPSC General Tamil: Ilakkiam — Pathinen Keezhkanakku',
intro:`Today we study the 'Lower Eighteen'. This collection is dominated by 'Aram' (Ethics), including the world-famous Thirukkural. In TNPSC, 'Thirukkural structure' and 'Naladiyar' are high-yield. Do you know how many chapters are in Thirukkural? Let's master the ethics today.`,
notes:[
{title:'Pathinen Keezhkanakku',detail:'18 works mostly from the post-Sangam period. 11 Ethics (Aram), 6 Love (Agam), 1 War (Puram).'},
{title:'Thirukkural',detail:'Author: Thiruvalluvar. Total Couplets: 1330. Chapters: 133. Parts: 3 (Aram, Porul, Inbam).'},
{title:'Thirukkural Facts',detail:'Translated into 100+ languages. First translated to Latin by Constantius Beschi (Veeramamunivar).'},
{title:'Naladiyar',detail:'Written by Jain Monks. Often compared to Thirukkural ("Aalum Velum Pallukuruthi, Naalum Rendum Sollukuruthi").'},
{title:'Other Works',detail:'Pazhamozhi Nanooru (Proverbs), Inna Narpathu, Iniyavai Narpathu, Sirupanchamoolam.'}
],
cards:[
{front:'Chapters in Thirukkural?',back:'133.'},
{front:'Total Kurals?',back:'1330.'},
{front:'Author of Naladiyar?',back:'Jain Monks.'},
{front:'Who translated Kural to Latin?',back:'Veeramamunivar.'},
{front:'Parts of Thirukkural?',back:'Aram, Porul, Inbam.'}
],
q:[
{q:'How many couplets (Kurals) are there in the "Thirukkural"?',options:['1000','1330','133','1610'],ai:1,exp:'10 kurals per chapter.'},
{q:'"Naladiyar" was written by:',options:['Thiruvalluvar','Jain Monks','Kambar','Avvaiyar'],ai:1,exp:'A collection of 400 quatrains.'},
{q:'The "Thirukkural" belongs to which category of literature?',options:['Melkanakku','Keezhkanakku','Epics','Grammar'],ai:1,exp:'One of the 18 didactic works.'},
{q:'Who translated the Thirukkural into English?',options:['G.U. Pope','Veeramamunivar','Ellis','Caldwell'],ai:0,exp:'A major scholar of Tamil literature.'}
],
hook:'1330=Kural. 133=Chapters. Naladiyar=Jains. Aram/Porul/Inbam=3 parts. Pope=English. Veera=Latin.',
summary:'Analysis of the 18 didactic works of the post-Sangam era. Structural study of the Thirukkural. Comparison of ethics in Thirukkural and Naladiyar.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC Tamil Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'TN Tamil Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC General Tamil '+d.topic),why:'Mastering General Tamil for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Tamil',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

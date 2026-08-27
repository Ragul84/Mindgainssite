require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:75,topic:'TNPSC General Tamil: Aimperum Kappiyangal (5 Epics)',
intro:`Today we study the 'Pillars of Storytelling'. The Five Great Epics of Tamil literature are the crown jewels of our heritage. In TNPSC, 'Silappathikaram', 'Manimegalai', and 'Civaka Cintamani' are high-yield. Do you know which epic is Jain and which is Buddhist? Let's master the legends today.`,
notes:[
{title:'Silappathikaram (Jain)',detail:'Author: Ilango Adigal. Story of Kovalan, Kannagi, and Madhavi. Focus on "Anklet of Justice".'},
{title:'Manimegalai (Buddhist)',detail:'Author: Sithalai Sathanar. Sequel to Silappathikaram. Story of Kovalan\'s daughter Manimegalai. Focus on social service (Amudhasurabhi).'},
{title:'Civaka Cintamani (Jain)',detail:'Author: Tirutakkatevar. Also called "Mana Nool" (Book of Marriages). Known for Viruthappa style.'},
{title:'Valayapathi & Kundalakesi',detail:'Valayapathi (Jain - fragmentary). Kundalakesi (Buddhist - Nagakuthanar - fragmentary). Only verses survived.'},
{title:'Theme of Epics',detail:'Silappathikaram (Virtue of Justice), Manimegalai (Renunciation), Civaka Cintamani (Pleasures to Renunciation).'}
],
cards:[
{front:'Author of Silappathikaram?',back:'Ilango Adigal.'},
{front:'Which epic is called "Mana Nool"?',back:'Civaka Cintamani.'},
{front:'Manimegalai is a ? epic?',back:'Buddhist.'},
{front:'Who wrote Manimegalai?',back:'Sithalai Sathanar.'},
{front:'Silappathikaram is a ? epic?',back:'Jain.'}
],
q:[
{q:'"Silappathikaram" and "Manimegalai" are known as:',options:['Twin Epics','Aram works','Puram works','None'],ai:0,exp:'They share a continuous story.'},
{q:'"Amudhasurabhi" (The magic bowl) is associated with which character?',options:['Kannagi','Madhavi','Manimegalai','Sita'],ai:2,exp:'Used to feed the hungry.'},
{q:'Which of the following is a Buddhist epic?',options:['Silappathikaram','Civaka Cintamani','Kundalakesi','Valayapathi'],ai:2,exp:'A major polemic Buddhist work.'},
{q:'The author of "Civaka Cintamani" is:',options:['Ilango Adigal','Tirutakkatevar','Sathanar','Kambar'],ai:1,exp:'A Jain monk.'}
],
hook:'Silappathikaram=Kannagi. Manimegalai=Buddhist. Cintamani=Marriages. Twin=Sila/Mani. Jain=Sila/Cinta/Vala.',
summary:'Study of the five great Tamil epics. Religious and moral themes in Silappathikaram and Manimegalai. Technical mastery of Civaka Cintamani. Status of the fragmentary epics.'},

{day:76,topic:'TNPSC General Tamil: Scholars & Poets',
intro:`Today we study the 'Voices of the Soil'. From the ancient Thiruvalluvar to the revolutionary Bharathiyar—these poets shaped the Tamil mind. In TNPSC, 'Bharathi' and 'Bharathidasan' works are extremely frequent. Do you know who is called the 'People\'s Poet'? Let's master the scholars today.`,
notes:[
{title:'Subramania Bharati',detail:'National Poet. Works: Kuyil Paatu, Panchali Sabatham, Kannan Paatu. Journals: India, Vijaya.'},
{title:'Bharathidasan',detail:'"Paavendhar". "Puratchi Kavignar". Works: Pandiyan Parisu, Azhagin Sirippu, Kudumba Vilakku.'},
{title:'Kavimani Desigavinayagam Pillai',detail:'"Kavimani". Famous for children\'s poems and "Asiya Jothi" (Life of Buddha).'},
{title:'Namakkal Kavignar',detail:'V. Ramalingam Pillai. Gandhiya Kavignar. Famous for: "Kathiyindri Raththamindri Varugudhu Oru Yudham".'},
{title:'Avvaiyar',detail:'Sangam and Medieval poets. Famous for Aathichoodi, Kondrai Vendhan (Ethical works for kids).'}
],
cards:[
{front:'"Puratchi Kavignar" title for?',back:'Bharathidasan.'},
{front:'Who wrote "Kuyil Paatu"?',back:'Subramania Bharati.'},
{front:'"Gandhiya Kavignar" is?',back:'Namakkal Kavignar.'},
{front:'"Kudumba Vilakku" author?',back:'Bharathidasan.'},
{front:'Who wrote "Asiya Jothi"?',back:'Kavimani.'}
],
q:[
{q:'Who wrote the famous line "Kathiyindri Raththamindri Varugudhu Oru Yudham"?',options:['Bharathi','Bharathidasan','Namakkal Kavignar','Kavimani'],ai:2,exp:'Written for the Salt Satyagraha in TN.'},
{q:'Which of the following is a work by "Subramania Bharati"?',options:['Azhagin Sirippu','Panchali Sabatham','Pandiyan Parisu','Kudumba Vilakku'],ai:1,exp:'A major nationalistic poem.'},
{q:'"Bharathidasan" was the disciple of:',options:['Kambar','Thiruvalluvar','Subramania Bharati','Periyar'],ai:2,exp:'His pen name itself shows his devotion to Bharati.'},
{q:'"Aathichoodi" is an ethical work by:',options:['Avvaiyar','Valluvar','Kambar','Bharathi'],ai:0,exp:'Alphabetical ethical aphorisms.'}
],
hook:'Bharathi=Kuyil/Panchali. Bharathidasan=Azhagu/Pandiyan. Namakkal=Gandhi poet. Kavimani=Buddha. Avvaiyar=Aathichoodi.',
summary:'Life and works of nationalistic and revolutionary Tamil poets. Analysis of ethics in Avvaiyar\'s poetry. Comparison of Bharati and Bharathidasan\'s styles.'},

{day:77,topic:'TNPSC REVISION: Language Part 1 (Days 71–76)',
intro:`Today we consolidate the 'Tamil Heritage'. You have mastered the grammar, the classical anthologies, the epics, and the modern scholars. In TNPSC, Language is the 'Eligibility and Ranking' factor. Today, we drill the works. If you see 'Panchali Sabatham', you say 'Bharathi'. If you see 'Amudhasurabhi', you say 'Manimegalai'. Let's lock in the Tamil marks today.`,
notes:[
{title:'Grammar Recap',detail:'Mudhal (30). Nedil (2). Venba (Cheppal). Agam (Love). Part III (FR - Polity recap).'},
{title:'Melkanakku Recap',detail:'Ettuthogai (8). Pathupattu (10). Maduraikanchi (Longest). Pathitrupathu (Chera).'},
{title:'Keezhkanakku Recap',detail:'Kural (1330/133). Naladiyar (Jains). Aram (Ethics). G.U. Pope (English).'},
{title:'Epics Recap',detail:'Silappathikaram (Ilango). Manimegalai (Buddhist). Cintamani (Mana Nool).'},
{title:'Poets Recap',detail:'Bharathi (Kuyil). Bharathidasan (Puratchi). Namakkal (Gandhi). Kavimani (Children).'}
],
cards:[
{front:'Author of "Azhagin Sirippu"?',back:'Bharathidasan.'},
{front:'Epic about Kovalan\'s daughter?',back:'Manimegalai.'},
{front:'"Cheppalosai" belongs to?',back:'Venba.'},
{front:'How many chapters in Thirukkural?',back:'133.'},
{front:'Is your Tamil ready?',back:'YES.'}
],
q:[
{q:'Which work is called "Mana Nool"?',options:['Silappathikaram','Manimegalai','Civaka Cintamani','Kundalakesi'],ai:2,exp:'Recap.'},
{q:'Who is the "National Poet" of Tamil Nadu?',options:['Bharathidasan','Subramania Bharati','Kavimani','Kannadasan'],ai:1,exp:'Recap.'},
{q:'"Pathitrupathu" is about:',options:['Cholas','Pandyas','Cheras','Pallavas'],ai:2,exp:'Recap.'},
{q:'The first part of Thirukkural is:',options:['Porul','Inbam','Aram','Veedu'],ai:2,exp:'Ethics is the foundation.'}
],
hook:'Language Part 1 complete. Classical to Modern. Grammar hooks. Epic legends. Scholars drill. Victory.',
summary:'Full revision of General Tamil syllabus (Part 1). High-speed drill of literary works and authors. Comparison of ancient and modern poetic themes. Final Language Part 1 mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC Tamil Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'TN Tamil Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC General Tamil '+d.topic),why:'Consolidating General Tamil for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();

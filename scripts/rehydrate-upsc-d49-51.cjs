require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:49,topic:'UPSC History: Muslim League & Home Rule Movement',
intro:`Today we study the 'Politics of Unity and Division'. While the British were consolidating their rule, the Muslim League (1906) was formed to protect the interests of the elite. However, the period of 1914–1918 saw a unique phase of cooperation—the Home Rule Movement led by Tilak and Annie Besant, and the Lucknow Pact (1916) where the INC and League joined hands. For UPSC, focus on 'Why the Home Rule was popular' and the significance of the 'Lucknow Session' (reunion of Moderates and Extremists).`,
notes:[
{title:'Formation of Muslim League (1906)',detail:'Founded at Dacca. Leaders: Nawab Salimullah, Aga Khan. Objective: To promote loyalty to British govt and protect Muslim rights. Demand for Separate Electorates (granted in 1909 Morly-Minto Reforms).'},
{title:'Home Rule Movement (1916–1918)',detail:'Inspired by the Irish Home Rule League. 1. Tilak\'s League: Maharashtra (except Bombay), Karnataka. 2. Annie Besant\'s League: Rest of India. Objective: Self-government within the British Empire. Mass mobilization through journals (New India, Commonweal).'},
{title:'Lucknow Pact (1916)',detail:'Historic agreement between INC and Muslim League. Joint demand for constitutional reforms. League accepted INC political goal; INC accepted Separate Electorates for Muslims (Criticized later as a compromise with communalism).'},
{title:'Lucknow Session (1916)',detail:'Presided by A.C. Majumdar. Major events: 1. Reunion of Moderates and Extremists (after 10 years). 2. Alliance with Muslim League. 3. First major public appearance of Gandhi after return.'},
{title:'August Declaration (1917)',detail:'Secretary of State Edwin Montagu declared that the British goal was "gradual development of self-governing institutions". Led to the end of the Home Rule movement.'}
],
cards:[
{front:'Who started the Home Rule movement?',back:'Bal Gangadhar Tilak and Annie Besant (1916).'},
{front:'What is the Lucknow Pact?',back:'Agreement between INC and Muslim League in 1916.'},
{front:'Who presided over the 1916 Lucknow session?',back:'Ambica Charan Majumdar.'},
{front:'Journals of Annie Besant?',back:'New India and Commonweal.'},
{front:'When was the Muslim League formed?',back:'1906 (Dacca).'}
],
q:[
{q:'The "Lucknow Pact" of 1916 is famous for:',options:['Complete Independence','Alliance between INC and Muslim League','Split in INC','Demand for Purna Swaraj'],ai:1,exp:'It was a short-lived but significant period of Hindu-Muslim political unity.'},
{q:'Annie Besant\'s Home Rule League was headquartered at:',options:['Pune','Madras (Adyar)','Bombay','Calcutta'],ai:1,exp:'Tilak\'s league was centered in Pune; Besant\'s in Adyar, Madras.'},
{q:'Separate Electorates for Muslims were first introduced by which act?',options:['Regulating Act 1773','Charter Act 1833','Morley-Minto Reforms 1909','Montagu-Chelmsford Reforms 1919'],ai:2,exp:'The 1909 act legally institutionalized communal representation in India.'},
{q:'Who were the primary architects of the reunion of Moderates and Extremists in 1916?',options:['Gandhi and Nehru','Tilak and Annie Besant','Gokhale and Naoroji','Patel and Bose'],ai:1,exp:'Their joint efforts made the Lucknow reunion possible.'}
],
hook:'1906=League. 1916=Lucknow (Unity). Tilak/Besant=Home Rule. 1909=Separate Electorates. 1917=August Declaration.',
summary:'Circumstances of Muslim League formation. Analysis of the Home Rule movement. Significance of the Lucknow Pact and the reunion of INC. Transition towards the Gandhian era.'},

{day:50,topic:'UPSC History: Gandhi\'s Arrival & Early Satyagrahas',
intro:`Today we study the 'Entry of the Mahatma'. After two decades in South Africa, M.K. Gandhi returned to India in 1915. He didn't join politics immediately; instead, he traveled and tested his weapon of 'Satyagraha' (Truth-Force) in three localized struggles: Champaran, Kheda, and Ahmedabad. These 'Triple Victories' established him as a leader of the masses. For UPSC, mastering the 'Sequence' and 'Issues' of these three struggles is a Prelims favorite. Let's trace the birth of Gandhian politics today.`,
notes:[
{title:'Gandhi in South Africa (Brief)',detail:'Techniques developed: Satyagraha, Ahimsa. Founded Natal Indian Congress, Tolstoy Farm. 1915: Returned to India on Jan 9 (Pravasi Bharatiya Divas). G.K. Gokhale was his political mentor.'},
{title:'Champaran Satyagraha (1817 - First Civil Disobedience)',detail:'Bihar. Issue: Tinkathia system (peasants forced to grow Indigo on 3/20th of land). Invited by Rajkumar Shukla. Result: Indigo commission formed, Tinkathia abolished.'},
{title:'Ahmedabad Mill Strike (1918 - First Hunger Strike)',detail:'Issue: Discontinuation of "Plague Bonus". Gandhi used hunger strike as a weapon. Result: Workers got 35% wage hike.'},
{title:'Kheda Satyagraha (1918 - First Non-Cooperation)',detail:'Gujarat. Issue: Crop failure but British demanded full revenue. Result: Govt agreed to collect revenue only from those who could pay.'},
{title:'Core Philosophy',detail:'Satyagraha (Passive resistance based on truth). Ahimsa (Non-violence). Sarvodaya (Upliftment of all). Constructive work (Khadi, Hindu-Muslim unity, untouchability removal).'}
],
cards:[
{front:'Date of Gandhi\'s return to India?',back:'January 9, 1915 (Pravasi Bharatiya Divas).'},
{front:'Who was Gandhi\'s political guru?',back:'Gopal Krishna Gokhale.'},
{front:'First Civil Disobedience movement by Gandhi?',back:'Champaran Satyagraha (1917).'},
{front:'First Hunger Strike by Gandhi?',back:'Ahmedabad Mill Strike (1918).'},
{front:'What is the "Tinkathia System"?',back:'Obligation to grow indigo on 3/20th of land in Champaran.'}
],
q:[
{q:'In which of the following movements did Gandhi use "Hunger Strike" for the first time?',options:['Champaran','Ahmedabad','Kheda','Non-Cooperation'],ai:1,exp:'In the 1918 Ahmedabad mill strike, he went on a fast to support workers\' demands.'},
{q:'Who invited Gandhi to Champaran to investigate the problems of farmers?',options:['Rajendra Prasad','J.B. Kripalani','Rajkumar Shukla','Mahadev Desai'],ai:2,exp:'Rajkumar Shukla, a local peasant, persisted until Gandhi agreed to visit.'},
{q:'The "Kheda Satyagraha" was related to:',options:['Indigo plantation','Textile bonus','Revenue remission during famine','Salt tax'],ai:2,exp:'It was against the rigid revenue collection despite crop failure in Gujarat.'},
{q:'Which of the following was Gandhi\'s "First Non-Cooperation" movement?',options:['Champaran','Ahmedabad','Kheda','Rowlatt Satyagraha'],ai:2,exp:'While the 1920 movement is the "Big" one, Kheda is considered the first instance of non-cooperation.'}
],
hook:'1915=Return. 1917=Champaran (Indigo). 1918=Ahmedabad (Mill/Hunger). 1918=Kheda (Revenue). Gokhale=Guru. C-A-K sequence.',
summary:'Gandhi\'s early career and return to India. Detailed study of Champaran, Ahmedabad, and Kheda satyagrahas. Evolution of Satyagraha as a political tool. The "Triple Success" before the mass movements.'},

{day:51,topic:'UPSC History: Rowlatt Act & Jallianwala Bagh',
intro:`Today we study the 'Darkest Chapter'. The Rowlatt Act (1919), which allowed the British to imprison anyone without trial, led to a nationwide protest (Rowlatt Satyagraha). This culminated in the horrific Jallianwala Bagh Massacre on April 13, 1919. This event changed the course of history, turning Gandhi from a cooperator of the British to an unyielding opponent. For UPSC, focus on the 'Hunter Commission', the 'Khilafat Movement', and why 1919 is a watershed year.`,
notes:[
{title:'Rowlatt Act (1919)',detail:'"Black Act". Official name: Anarchical and Revolutionary Crimes Act. Allowed detention without trial for 2 years. Slogan: "No Dalil, No Vakil, No Appeal". Gandhi called for a nationwide hartal (April 6).'},
{title:'Jallianwala Bagh Massacre (April 13, 1919)',detail:'Amritsar. People gathered to protest the arrest of Saifuddin Kitchlew and Dr. Satyapal. General Dyer opened fire on the trapped crowd. Result: Hundreds killed. Rabindranath Tagore renounced his Knighthood.'},
{title:'Hunter Commission',detail:'Commission of inquiry into the massacre. Dyer was censured but not punished (House of Lords praised him). This further enraged Indians.'},
{title:'Khilafat Movement (1919–1924)',detail:'Led by Ali Brothers (Shaukat & Mohammad Ali). Issue: Protection of the Caliph (Khalifa) of Turkey after WWI. Gandhi saw this as a "golden opportunity" for Hindu-Muslim unity.'},
{title:'Watershed 1919',detail:'Montagu-Chelmsford Reforms (Dyarchy introduced). Rowlatt Act. Jallianwala Bagh. Start of Gandhi\'s first great mass movement (Non-Cooperation).'}
],
cards:[
{front:'What was the Rowlatt Act called?',back:'The "Black Act" (No Dalil, No Vakil, No Appeal).'},
{front:'Date of the Jallianwala Bagh massacre?',back:'April 13, 1919.'},
{front:'Who renounced his "Knighthood" after Jallianwala Bagh?',back:'Rabindranath Tagore.'},
{front:'Who were the leaders of the Khilafat Movement?',back:'The Ali Brothers (Mohammad Ali and Shaukat Ali).'},
{front:'What is the "Hunter Commission"?',back:'Inquiry committee for the Jallianwala Bagh massacre.'}
],
q:[
{q:'Why were people gathered at Jallianwala Bagh on April 13, 1919?',options:['To celebrate Baisakhi','To protest the arrest of Kitchlew and Satyapal','To demand Swaraj','To join the Khilafat movement'],ai:1,exp:'It was a peaceful protest against the arrest of local leaders under the Rowlatt Act.'},
{q:'"Dyarchy" (Dual government in provinces) was introduced by which act?',options:['Morley-Minto 1909','Montagu-Chelmsford 1919','Govt of India Act 1935','Council Act 1892'],ai:1,exp:'The 1919 reforms introduced a division of subjects in the provincial administration.'},
{q:'The "Khilafat Committee" was formed in which city?',options:['Delhi','Calcutta','Lucknow','Bombay'],ai:3,exp:'The committee was formed in Bombay in 1919 to coordinate the movement.'},
{q:'Who was the British officer responsible for the Jallianwala Bagh massacre?',options:['Lord Curzon','General Dyer','Michael O\'Dwyer','General Nicholson'],ai:1,exp:'General Dyer gave the order to shoot; O\'Dwyer was the Lt. Governor of Punjab who supported him.'}
],
hook:'1919=Black Act/Massacre. Tagore=Knighthood return. Dyarchy=1919. Ali Brothers=Khilafat. Dyer=Shooter. 13 April=Baisakhi.',
summary:'Provisions and protest against the Rowlatt Act. Detailed account of the Jallianwala Bagh massacre and its aftermath. The Hunter Commission. Origins and objectives of the Khilafat movement.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Very High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC History Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'History Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Modern History '+d.topic),why:'Essential for understanding the mass mobilization phase.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 49-51 v2 COMPLETE');
}
push();

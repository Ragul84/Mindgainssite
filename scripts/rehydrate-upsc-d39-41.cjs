require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:39,topic:'UPSC History: British Land Revenue Systems',
intro:`Today we study the 'Economic Extraction' of India. The British introduced three different land revenue systems to ensure a steady flow of income. These systems—Permanent Settlement, Ryotwari, and Mahalwari—fundamentally changed the relationship between the peasant and the land, leading to rural indebtedness and frequent famines. For UPSC, mastering 'Who introduced what', 'Which region', and 'What was the feature' is mandatory. This is the structural reason behind the poverty of colonial India.`,
notes:[
{title:'Permanent Settlement (Zamindari)',detail:'1793: Lord Cornwallis (Bengal, Bihar, Odisha). Zamindars became hereditary owners. "Sunset Law": Revenue had to be paid by a fixed date or land was auctioned. Benefit: Steady income for EIC. Loss: No incentive for land improvement, peasant suffering.'},
{title:'Ryotwari System',detail:'1820: Thomas Munro and Alexander Reed (Madras, Bombay, Assam). Revenue fixed directly with the "Ryot" (peasant). No middlemen (Zamindars). Revenue was high and could be revised every 20-30 years.'},
{title:'Mahalwari System',detail:'1822: Holt Mackenzie and Robert Merttins Bird (North-West Province, Punjab, Central India). Unit was "Mahal" (Village). Village community was collectively responsible for payment. Often mediated by the Lambardar (village head).'},
{title:'Commercialization of Agriculture',detail:'Shift from food crops (Paddy, Wheat) to cash crops (Indigo, Cotton, Jute, Tea). Led to the "De-industrialization" of India and frequent famines.'},
{title:'Drain of Wealth Theory',detail:'Propounded by Dadabhai Naoroji ("Poverty and Un-British Rule in India"). Explained how India\'s wealth was being transferred to Britain without any return.'}
],
cards:[
{front:'Who introduced the "Permanent Settlement"?',back:'Lord Cornwallis (1793).'},
{front:'What is the "Sunset Law"?',back:'Law requiring Zamindars to pay revenue by sunset of a fixed date or lose their land.'},
{front:'In which system was revenue fixed with the village community?',back:'Mahalwari System.'},
{front:'Who introduced the "Ryotwari System"?',back:'Thomas Munro and Alexander Reed.'},
{front:'Who wrote "Poverty and Un-British Rule in India"?',back:'Dadabhai Naoroji.'}
],
q:[
{q:'In the Ryotwari system, the land revenue was fixed with:',options:['Zamindars','Village Community (Mahal)','Individual Peasant (Ryot)','The King'],ai:2,exp:'It aimed to eliminate middlemen and establish direct contact with the cultivator.'},
{q:'The "Sunset Law" was a feature of which system?',options:['Ryotwari','Mahalwari','Permanent Settlement','Zabti'],ai:2,exp:'Cornwallis introduced this to ensure timely payment of land revenue from Zamindars.'},
{q:'"Drain of Wealth" theory was first proposed by:',options:['M.G. Ranade','R.C. Dutt','Dadabhai Naoroji','G.K. Gokhale'],ai:2,exp:'Naoroji explained the economic exploitation of India by the British.'},
{q:'The Mahalwari system was primarily implemented in which region?',options:['Bengal','Madras Presidency','Punjab and North-West','Bihar'],ai:2,exp:'It was based on the village community structure prevalent in North India.'}
],
hook:'Permanent=Cornwallis (Bengal). Ryotwari=Munro (Madras). Mahalwari=Mackenzie (Punjab). Naoroji=Drain Theory. Sunset Law=Zamindari.',
summary:'Comparative study of Permanent Settlement, Ryotwari, and Mahalwari. Economic impact on the peasantry. Commercialization of agriculture and the Drain of Wealth theory.'},

{day:40,topic:'UPSC History: Educational & Social Reforms',
intro:`Today we study the 'Intellectual Awakening' of 19th Century India. Faced with the challenge of Western culture, Indian reformers sought to purify their own religions and society. From Raja Ram Mohan Roy (The Father of Modern India) to Ishwar Chandra Vidyasagar and the Prarthana Samaj—these movements fought against Sati, child marriage, and the caste system while promoting Western education. For UPSC, focus on the 'Organizations', 'Journals', and 'Key Legislations' passed during this period.`,
notes:[
{title:'Raja Ram Mohan Roy & Brahmo Samaj',detail:'"Father of Modern India". Founded Brahmo Sabha (1828). Opposed Sati (Abolished 1829 by Bentinck), Idol worship, and Caste system. Published "Sambad Kaumudi" (Bengali).'},
{title:'Educational Reforms',detail:'1. Charter Act 1813 (1 lakh for education). 2. Macaulay\'s Minute (1835 - "English is better than vernacular"). 3. Wood\'s Despatch (1854 - "Magna Carta of English Education"). Focus on primary to university education.'},
{title:'Women\'s Reformers',detail:'Ishwar Chandra Vidyasagar: Championed Widow Remarriage (Act 1856). Jyotiba Phule: Founded Satyashodhak Samaj, worked for lower castes and women ("Gulamgiri"). Pandita Ramabai: Arya Mahila Samaj.'},
{title:'Hindu Revivalist/Reformist',detail:'Arya Samaj (Dayanand Saraswati): "Go back to Vedas", Shuddhi movement. Ramakrishna Mission (Swami Vivekananda): Practical Vedanta, Parliament of Religions (1893).'},
{title:'Socio-Religious Acts',detail:'Sati Abolition (1829), Widow Remarriage Act (1856), Age of Consent Act (1891), Sharda Act (1929 - Child marriage).'}
],
cards:[
{front:'Who is called the "Father of Modern India"?',back:'Raja Ram Mohan Roy.'},
{front:'What is "Wood\'s Despatch"?',back:'The "Magna Carta of English Education in India" (1854).'},
{front:'Who founded the "Satyashodhak Samaj"?',back:'Jyotiba Phule.'},
{front:'Who gave the slogan "Go back to Vedas"?',back:'Dayanand Saraswati.'},
{front:'Widow Remarriage Act 1856—who was the main force behind it?',back:'Ishwar Chandra Vidyasagar.'}
],
q:[
{q:'Which of the following acts legalized the marriage of Hindu widows?',options:['Sati Abolition Act 1829','Charter Act 1833','Widow Remarriage Act 1856','Age of Consent Act 1891'],ai:2,exp:'Vidyasagar\'s efforts led Lord Dalhousie and Lord Canning to pass this act.'},
{q:'"Gulamgiri" is a famous work written by:',options:['B.R. Ambedkar','Jyotiba Phule','E.V. Ramasamy','M.G. Ranade'],ai:1,exp:'Phule wrote this to critique the caste system and social slavery.'},
{q:'The "Wood\'s Despatch" of 1854 was concerned with:',options:['Revenue','Education','Police','Military'],ai:1,exp:'It laid the foundation for the modern educational system in India.'},
{q:'Who founded the "Prarthana Samaj" in Maharashtra?',options:['Jyotiba Phule','Atmaram Pandurang','M.G. Ranade','Dayanand Saraswati'],ai:1,exp:'Founded in 1867, it was a reformist group inspired by the Brahmo Samaj.'}
],
hook:'RRM Roy=Brahmo Samaj. Phule=Gulamgiri. Wood\'s Despatch=Education. 1829=Sati Abolition. 1856=Widow Remarriage.',
summary:'Major socio-religious reform movements and their leaders. Chronology of educational developments (Macaulay to Wood). Key legislations for social reform. Contribution of Phule and Vivekananda.'},

{day:41,topic:'UPSC History: Tribal & Peasant Revolts (Pre-1857)',
intro:`Today we study the 'Resistance from the Grassroots'. Long before the 1857 Revolt, the peasants and tribals of India had been fighting the British and their Indian collaborators (Zamindars/Moneylenders). These revolts were localized, violent, and spontaneous reactions to the loss of land and forest rights. From the Sanyasi Rebellion to the great Santhal Hool and the Indigo Revolt—these movements proved that the British rule was never fully accepted. For UPSC, focus on the 'Leader', 'Region', and 'Cause' of each revolt.`,
notes:[
{title:'Sanyasi & Fakir Rebellion (1763–1800)',detail:'Bengal. Sanyasis and Fakirs against British restrictions and high taxes. Immortalized in Bankim Chandra\'s "Anandamath" (Vande Mataram source).'},
{title:'Santhal Rebellion (1855–56)',detail:'Leaders: Sidhu and Kanhu. Region: Rajmahal Hills (Daman-i-koh). Against Zamindars and "Dikus" (outsiders). It was the most massive tribal uprising before 1857.'},
{title:'Munda Rebellion (Ulgulan)',detail:'Leader: Birsa Munda (1899-1900 - Note: Post-1857 but crucial). Against "Khuntkatti" (collective land) destruction by British. Birsa was called "Dharti Aba".'},
{title:'Indigo Revolt (1859–60)',detail:'Bengal. Peasants refused to grow Indigo under exploitative contracts. Leaders: Digambar and Bishnu Biswas. Described in "Nil Darpan" by Dinabandhu Mitra.'},
{title:'Other Key Revolts',detail:'Paika Rebellion (Odisha 1817 - Bakshi Jagabandhu). Ramosi Revolt (Chittur Singh). Kol Mutiny (Buddho Bhagat). Farazi Movement (Haji Shariatullah).'}
],
cards:[
{front:'Who were the "Sidhu and Kanhu"?',back:'Leaders of the Santhal Rebellion (1855).'},
{front:'Who wrote "Anandamath"?',back:'Bankim Chandra Chattopadhyay.'},
{front:'What is the "Indigo Revolt" (Nil Bidroho)?',back:'Peasant strike against forced indigo cultivation in Bengal (1859).'},
{front:'What was the region of the Santhal rebellion called?',back:'Daman-i-koh.'},
{front:'Who was "Dharti Aba"?',back:'Birsa Munda.'}
],
q:[
{q:'The "Ulgulan" (Great Tumult) is associated with which tribal leader?',options:['Sidhu Murmu','Birsa Munda','Alluri Sitarama Raju','Kanhu'],ai:1,exp:'Birsa Munda led the Munda Ulgulan in the Chotanagpur region.'},
{q:'"Nil Darpan", a play depicting the plight of indigo farmers, was written by:',options:['Bankim Chandra','Dinabandhu Mitra','Rabindranath Tagore','Michael Madhusudan Dutt'],ai:1,exp:'This play drew national attention to the exploitation by British planters.'},
{q:'The "Sanyasi Rebellion" took place in which region?',options:['Punjab','Madras','Bengal','Bombay'],ai:2,exp:'It was one of the earliest challenges to British rule in Bengal after the Battle of Buxar.'},
{q:'The term "Diku" in tribal revolts referred to:',options:['British officials','Outsiders/Moneylenders','Tribal chiefs','Forest guards'],ai:1,exp:'Tribals used this term for the non-tribal exploiters who entered their territories.'}
],
hook:'Santhal=Sidhu/Kanhu. Munda=Birsa. Indigo=Nil Darpan. Sanyasi=Anandamath. Diku=Outsider. Rajmahal Hills=Santhal.',
summary:'Nature and causes of tribal and peasant uprisings. Detailed study of Santhal, Munda, and Indigo revolts. Literary sources like Anandamath and Nil Darpan. Comparison of pre and post-1857 resistance.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC History Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'History Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Modern History '+d.topic),why:'Crucial for understanding social and economic history.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 39-41 v2 COMPLETE');
}
push();

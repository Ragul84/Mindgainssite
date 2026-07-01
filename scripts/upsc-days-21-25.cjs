require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const days = [
{
  day:21, topic:'Mughal Empire: Mansabdari & Land Revenue',
  notes:[
    {title:'Mansabdari System', detail:'Introduced by Akbar. Mansab = Rank. Dual rank: Zat (personal rank/salary) and Sawar (cavalry command). A mansabdar with Zat 5000 Sawar 5000 was a top-tier noble. Three categories: 1-500 (mansabdars), 500-2500 (Amirs), 2500+ (Amir-ul-Umara). No hereditary rights — assigned by Emperor.'},
    {title:'Zabt/Dahshala System (Todar Mal)', detail:'Revenue system under Akbar, implemented by Raja Todar Mal. Dahshala = 10-year average. Land classified by: cultivation status (polaj, parauti, chachar, banjar). Revenue in cash based on measured land and average yield over 10 years. Brought revenue predictability and reduced corruption.'},
    {title:'Mughal Art & Architecture', detail:'Pietra Dura: Semi-precious stone inlay work — used in Taj Mahal (Shah Jahan). Charbagh: Four-quartered garden layout (Humayun\'s Tomb, Taj Mahal). Akbar: Syncretic style — Persian + Indian = Fatehpur Sikri. Jahangir: Peak of Mughal painting (naturalism, portrait work).'},
    {title:'Decline Factors', detail:'Aurangzeb: Extended empire beyond administrative capacity. Abolished Jizyah exemptions on non-Muslims. Deccan wars drained treasury. Succession conflicts weakened central authority. Maratha resistance consumed Mughal military resources.'}
  ],
  hook:'UPSC Distinction Trap: Zabt system calculated revenue based on actual measured land area and CASH payment. Batai system (older) was revenue sharing in kind (share of actual produce). Todar Mal\'s Zabt modernized Mughal revenue and is the direct precursor to British land settlement systems.',
  cards:[
    {front:'In the Mansabdari system, what is the difference between Zat and Sawar ranks?', back:'Zat: Personal rank determining salary and position in imperial hierarchy. Sawar: Number of cavalry a mansabdar must maintain and bring to battle. A mansabdar could have high Zat but low Sawar — indicating administrative role over military.'},
    {front:'What was Todar Mal\'s Dahshala system and its impact?', back:'10-year average revenue calculation. Land surveyed, yields measured, revenue fixed in cash (not kind). Impact: Predictable revenue for Empire, reduced arbitrary local tax collection, benefited peasants with stable demand, model for British land settlements.'},
    {front:'What is Pietra Dura and which Mughal structure is most famous for it?', back:'Pietra Dura: Decorative art using semi-precious stones (lapis lazuli, jade, carnelian) inlaid into marble. Most famous in the Taj Mahal built by Shah Jahan. Also seen in Agra Fort and Fatehpur Sikri but in less elaborate form.'}
  ],
  q:[
    {q:'What did the Sawar component of a Mansabdar\'s rank determine?', options:['His annual salary from the treasury','His personal status in the imperial court','The number of cavalry he must maintain','His right to collect land revenue'], answer_index:2, explanation:'Sawar rank = cavalry command obligation. A mansabdar with Sawar 1000 must maintain 1000 cavalry. Zat determines salary and personal rank. The dual system ensured military readiness tied to rank — not just administrative position.'},
    {q:'Raja Todar Mal is associated with which administrative reform under Akbar?', options:['Mansabdari System','Zabt/Dahshala revenue system','Din-i-Ilahi religious policy','Sulh-i-Kul (peace with all) policy'], answer_index:1, explanation:'Raja Todar Mal implemented the Zabt/Dahshala land revenue system — surveying land, measuring yields, and fixing cash revenue based on 10-year averages. Mansabdari was Akbar\'s own innovation. Din-i-Ilahi and Sulh-i-Kul were Akbar\'s religious policies.'}
  ],
  pyq:'High — UPSC 2015, 2019, 2021. Mansabdari system and Mughal land revenue tested.',
  summary:'Mughal: Mansabdari(Akbar)=Zat(rank/salary)+Sawar(cavalry). No hereditary. Zabt/Dahshala(Todar Mal)=10yr average revenue in CASH. Land classified by cultivation status. Decline: Aurangzeb overextension+Maratha resistance+succession wars. Art: Pietra Dura(Taj Mahal)+Charbagh+Mughal miniature painting(Jahangir peak).'
},
{
  day:22, topic:'Bhakti & Sufi Movements',
  notes:[
    {title:'Bhakti Movement Streams', detail:'Nirguna (formless God): Kabir (weaver, syncretism, "Dohas"), Guru Nanak (Punjab, founded Sikhism), Ravidas (cobbler, equality). Saguna (God with form): Tulsidas (Ram — Ramcharitmanas in Awadhi), Mirabai (Krishna, Rajput queen), Surdas (Krishna — Sursagar). Bhakti saints came from ALL social classes — challenged caste hierarchy.'},
    {title:'Sufi Silsilas (Orders)', detail:'Chishti: Most popular in India. Liberal — used music (qawwali/sama). Moinuddin Chishti (Ajmer), Nizamuddin Auliya (Delhi), Qutbuddin Bakhtiyar Kaki. Naqshbandi: Orthodox/Conservative. Rejected music. Close to royalty. Ahmad Sirhindi (Sheikh-ul-Islam) — Akbar opposition. Suhrawardi: In Punjab/Sind. Qadiri: South India.'},
    {title:'Social Impact', detail:'Both movements challenged orthodox religious hierarchies. Bhakti: Challenged Brahminical dominance — saints from lower castes gained followers across caste lines. Sufi: Challenged rigid Islamic orthodoxy — emphasized personal experience of God (Fana — annihilation of ego in God).'},
    {title:'Syncretism', detail:'Kabir Panthis, Sikh Granth Sahib — included verses of both Hindu Bhakti saints and Muslim Sufi poets. The Granth Sahib includes compositions of Kabir, Ravidas, Farid (Sufi). This is the high-yield exam fact about religious syncretism.'}
  ],
  hook:'UPSC Exam Trap: Ahmad Sirhindi (Naqshbandi Sufi) is sometimes confused with supporting Akbar. He actually OPPOSED Akbar\'s syncretic policies and pushed for strict Sharia — supported by Jahangir initially. Contrast him with Dara Shikoh (Shah Jahan\'s son) who translated Upanishads into Persian (Sirr-i-Akbar).',
  cards:[
    {front:'What distinguishes Chishti Silsila from Naqshbandi Silsila?', back:'Chishti: Liberal, allowed music (qawwali/sama), popular with common people, major figures in Delhi and Ajmer. Naqshbandi: Orthodox, rejected music as un-Islamic, close to royal court, Ahmad Sirhindi opposed Akbar\'s syncretism.'},
    {front:'Which saints are classified as Nirguna Bhakti poets?', back:'Kabir (formless God, Hindu-Muslim syncretism), Guru Nanak (formless God — foundation of Sikhism), Ravidas (cobbler-saint, equality theme). All rejected idol worship and caste distinctions.'},
    {front:'What is the significance of Guru Granth Sahib in the context of Bhakti-Sufi syncretism?', back:'Guru Granth Sahib includes compositions of: Bhakti saints (Kabir, Ravidas, Namdev) AND Sufi saints (Farid). Compiled by Guru Arjan Dev (5th Guru). Represents the highest point of Hindu-Muslim-Sikh synthesis.'}
  ],
  q:[
    {q:'Which Sufi order in India was known for using music (sama/qawwali) as a path to God?', options:['Naqshbandi','Suhrawardi','Chishti','Qadiri'], answer_index:2, explanation:'Chishti order under Moinuddin Chishti popularized sama (devotional music/qawwali) in India. Naqshbandi was the most orthodox and explicitly rejected music. Chishti saints like Nizamuddin Auliya became popular across religious communities.'},
    {q:'Tulsidas wrote Ramcharitmanas in which language?', options:['Sanskrit','Braj Bhasha','Awadhi','Maithili'], answer_index:2, explanation:'Ramcharitmanas was written in Awadhi (eastern Hindi dialect) — making it accessible to common people unlike Sanskrit Ramayana. This was deliberate — Bhakti movement emphasized vernacular languages to reach masses. Surdas wrote in Braj Bhasha. Vidyapati wrote in Maithili.'}
  ],
  pyq:'High — UPSC 2016, 2018, 2022. Bhakti-Sufi saint classification and Sufi order characteristics tested.',
  summary:'Bhakti: Nirguna(Kabir+Nanak+Ravidas=formless God) vs Saguna(Tulsidas+Mirabai+Surdas=God with form). Sufi: Chishti(liberal+music,Ajmer+Delhi) vs Naqshbandi(orthodox,no music,Ahmad Sirhindi opposed Akbar). Granth Sahib=Bhakti+Sufi verses(highest syncretism). Dara Shikoh: Sirr-i-Akbar(Upanishad translation). Fana=ego annihilation in Sufism.'
},
{
  day:23, topic:'1857 Revolt: Causes & Consequences',
  notes:[
    {title:'Immediate Cause', detail:'Greased cartridges (Enfield rifle). Sepoys had to bite the cartridge before loading — rumored to be greased with cow and pig fat (offensive to Hindus and Muslims). Meerut: 85 sepoys refused, arrested. Remaining mutinied on 10 May 1857. March to Delhi, proclaimed Bahadur Shah Zafar as Emperor.'},
    {title:'Underlying Causes', detail:'Political: Doctrine of Lapse (Dalhousie) — Satara, Nagpur, Jhansi, Awadh annexed. Economic: Destruction of Indian handicrafts, drain of wealth, high land revenue. Social: Racial discrimination, threat to Indian customs (widow remarriage act perceived as interference). Military: Low pay, no foreign allowance, general service act.'},
    {title:'Why It Failed', detail:'No unified leadership — Rani Lakshmibai (Jhansi), Tantia Tope (Maratha), Nana Sahib (Kanpur), Bahadur Shah Zafar (Delhi) had no coordinated strategy. Regressive goal: Restore feudal order (not independence in modern sense). Educated class and Sikhs largely did not join. British had superior weapons and communication (telegraph).'},
    {title:'Government of India Act 1858', detail:'MAJOR CONSEQUENCE: Company Rule ended. British Crown assumed direct control. Governor-General became Viceroy (Lord Canning was first Viceroy). Secretary of State for India + Council of India created in London. Queen Victoria\'s Proclamation (1858): Equal treatment, no annexations, respect for Indian customs.'}
  ],
  hook:'UPSC Interpretation Trap: Was it a First War of Independence (V.D. Savarkar) or Sepoy Mutiny (British/early historians)? UPSC sometimes asks about "who called it what." Modern consensus: It had elements of both — widespread popular participation but no unified national consciousness or forward-looking program.',
  cards:[
    {front:'What was the Doctrine of Lapse and which territories were annexed under it?', back:'Policy by Dalhousie: If a ruler died without natural heir, the state "lapsed" to the Company. States annexed: Satara (1848), Nagpur (1853), Jhansi (1854), Awadh (1856 — different ground: "misgovernance"). One of the key political causes of 1857.'},
    {front:'What were the three main reasons why the 1857 Revolt failed?', back:'1. No unified leadership — regional commanders with no coordination. 2. Regressive goal — wanted to restore old feudal order, not create a new India. 3. Educated class, Sikhs, and South India largely did not participate. British had telegraph and faster troop movement.'},
    {front:'What was the significance of Government of India Act 1858?', back:'Ended East India Company rule. British Crown took direct control. Governor-General became Viceroy (Canning was first). Secretary of State + Council of India created in London. Queen Victoria\'s Proclamation promised equal treatment and no more annexations.'}
  ],
  q:[
    {q:'Queen Victoria\'s Proclamation of 1858 promised which of the following to Indians?', options:['Complete self-governance within 10 years','Abolition of the caste system','Equal treatment for all Indian subjects irrespective of religion','Creation of an elected Indian Parliament'], answer_index:2, explanation:'The 1858 Proclamation promised: Equal laws and equal treatment regardless of religion, no more annexations, respect for Indian customs and traditions, and amnesty for rebels (except murderers). It did NOT promise self-governance or political representation.'},
    {q:'Which of the following centers of the 1857 Revolt is correctly matched with its leader?', options:['Delhi — Nana Sahib','Kanpur — Bahadur Shah Zafar','Jhansi — Tantia Tope','Lucknow — Begum Hazrat Mahal'], answer_index:3, explanation:'Lucknow: Begum Hazrat Mahal (wife of Nawab of Awadh). Delhi: Bahadur Shah Zafar. Kanpur: Nana Sahib. Jhansi: Rani Lakshmibai. Tantia Tope was associated with Kanpur and later joined Jhansi. Classic leader-center swap trap.'}
  ],
  pyq:'Very High — UPSC 2017, 2019, 2022. Leader-centre matching and GoI Act 1858 consequences tested.',
  summary:'1857: Greased cartridges(Enfield)→Meerut(10 May)→Delhi(Bahadur Shah Zafar). Doctrine of Lapse(Dalhousie)=Satara+Nagpur+Jhansi+Awadh. Failed: No unified leadership+regressive goals+Sikh/educated class non-participation. GoI Act 1858: Company ends→Crown rule→Viceroy(Canning)→SecState+Council. Victoria Proclamation: Equal treatment+no annexation.'
},
{
  day:24, topic:'Socio-Religious Reform Movements (19th Century)',
  notes:[
    {title:'Brahmo Samaj', detail:'Founded by Ram Mohan Roy (1828, Calcutta). Monotheism — one God. Opposed idol worship, sati, caste discrimination, child marriage. Championed women\'s education and widow remarriage. Keshab Chandra Sen later expanded it. Debendranath Tagore (Rabindranath\'s father) led Adi Brahmo Samaj.'},
    {title:'Arya Samaj', detail:'Founded by Swami Dayananda Saraswati (1875, Bombay). Slogan: Back to the Vedas. Rejected: post-Vedic practices, idol worship, caste by birth. Supported: women\'s education, widow remarriage, Hindi as national language. Shuddhi movement: Reconversion of people who had left Hinduism. DAV schools system.'},
    {title:'Satyashodhak Samaj & Ramakrishna Mission', detail:'Satyashodhak Samaj: Jyotiba Phule (1873, Pune). Anti-Brahmin movement. Championed Dalit and women\'s rights. Ramakrishna Mission: Swami Vivekananda (1897). Neo-Vedanta — service to humans is service to God. Vedanta philosophy with social activism.'},
    {title:'Other Reformers', detail:'Sir Syed Ahmed Khan: Aligarh Movement — modern education for Muslims. Aligarh Muslim University (1875). Moderate, supported British. Periyar (Tamil Nadu): Self-Respect Movement (1925), anti-caste, anti-Brahmin. B.R. Ambedkar: Dalit rights, converted to Buddhism (1956).'}
  ],
  hook:'UPSC Matching Trap: Ram Mohan Roy = Brahmo Samaj (1828). Dayananda Saraswati = Arya Samaj (1875). Vivekananda = Ramakrishna Mission (1897). Jyotiba Phule = Satyashodhak Samaj (1873). These four are frequently shuffled in UPSC options. Also: Ram Mohan Roy campaigned AGAINST Sati — not FOR it. Never confuse the stance.',
  cards:[
    {front:'What was the Shuddhi Movement and who initiated it?', back:'Shuddhi (purification) was a reconversion movement started by Arya Samaj under Dayananda Saraswati. Aimed to bring back Hindus who had converted to Islam or Christianity. Used Vedic rituals for reconversion. Created significant Hindu-Muslim tension in early 20th century.'},
    {front:'What was Sir Syed Ahmed Khan\'s main contribution to Indian social reform?', back:'Founded Muhammadan Anglo-Oriental College at Aligarh (1875) — became Aligarh Muslim University (1920). Advocated modern Western education for Muslims. Urged Muslims to cooperate with British rather than oppose them. Founded Scientific Society (1864) to translate Western works into Urdu.'},
    {front:'What principle did Swami Vivekananda\'s Ramakrishna Mission promote?', back:'Practical Vedanta: Service to humans is service to God (Daridra Narayana — God in the poor). Combined Advaita Vedanta philosophy with social activism. Founded Ramakrishna Mission (1897) for education, healthcare, and disaster relief. Represented India at Parliament of Religions, Chicago (1893).'}
  ],
  q:[
    {q:'Which of the following reformers and their movements is INCORRECTLY matched?', options:['Ram Mohan Roy — Brahmo Samaj','Swami Dayananda Saraswati — Arya Samaj','Swami Vivekananda — Satyashodhak Samaj','Jyotiba Phule — Satyashodhak Samaj'], answer_index:2, explanation:'Swami Vivekananda founded the Ramakrishna Mission (1897), NOT Satyashodhak Samaj. Satyashodhak Samaj was founded by Jyotiba Phule in 1873 in Pune. Classic name-swap trap in UPSC options.'},
    {q:'The Aligarh Movement of Sir Syed Ahmed Khan primarily aimed at which of the following?', options:['Political independence of Muslims from British rule','Promotion of modern Western education among Indian Muslims','Revival of Urdu classical literature','Unification of all Indian Muslims under one political party'], answer_index:1, explanation:'Aligarh Movement: Promote modern English education + scientific temperament among Indian Muslims. Sir Syed believed Muslims had fallen behind due to rejection of Western education. He was PRO-British (loyalist) and AGAINST political agitation — opposite of early Congress approach.'}
  ],
  pyq:'Very High — UPSC 2014, 2017, 2020, 2022. Reformer-movement matching is perennial UPSC question.',
  summary:'Brahmo Samaj(RMR,1828,Calcutta)=Monotheism+anti-Sati+women education. Arya Samaj(Dayananda,1875)=Back to Vedas+Shuddhi+DAV schools. Satyashodhak(Phule,1873)=anti-Brahmin+Dalit rights. Ramakrishna Mission(Vivekananda,1897)=Practical Vedanta+Chicago 1893. Sir Syed(Aligarh,1875)=Muslim education+pro-British. Periyar(1925)=Self-Respect+anti-caste(TN).'
},
{
  day:25, topic:'INC Foundation & Moderate Phase 1885-1905',
  notes:[
    {title:'Foundation of INC (1885)', detail:'Founded by A.O. Hume (retired British civil servant) in 1885, Bombay. First session presided by W.C. Bonnerjee. Safety Valve Theory: Hume believed INC would give educated Indians a peaceful outlet for grievances — preventing violent uprising. Early INC dominated by lawyers, professionals.'},
    {title:'Moderate Ideology', detail:'Believed in constitutional methods — petitions, memorials, resolutions. Trusted British sense of justice. Goal: NOT independence but self-governance within British Empire. Methods: Pray, Petition, Protest (3Ps). Key moderates: Dadabhai Naoroji, Gopal Krishna Gokhale, Pherozeshah Mehta, Surendranath Banerjee.'},
    {title:'Economic Critique — Drain of Wealth', detail:'Dadabhai Naoroji: "Poverty and Un-British Rule in India" (1876) and "Drain of Wealth" — India\'s wealth systematically drained to Britain. R.C. Dutt: "Economic History of India" — showed deindustrialization. This economic analysis was the Moderates\' greatest intellectual contribution.'},
    {title:'Moderate Achievements', detail:'Indian Councils Act 1892: Expanded legislative councils, introduced indirect elections. Persistent lobbying in British Parliament through Indian Parliamentary Committee. Got partition of Bengal (1905) issue on national agenda. Laid the organizational foundation for mass nationalist movement.'}
  ],
  hook:'UPSC Nuance: Moderates are often dismissed as "ineffective" but their economic analysis (Drain of Wealth) created the intellectual foundation for ALL subsequent nationalist arguments. Gokhale was Gandhi\'s political guru — Gandhi explicitly credited Gokhale. The "failure" of Moderation led directly to the rise of Extremism.',
  cards:[
    {front:'Who proposed the "Safety Valve" theory regarding the founding of the INC?', back:'A.O. Hume proposed that INC would serve as a safety valve — giving educated Indians a constitutional outlet for grievances and preventing violent revolution. Lala Lajpat Rai later challenged this theory, arguing INC became the vehicle for independence movement despite British intentions.'},
    {front:'What was Dadabhai Naoroji\'s "Drain of Wealth" theory?', back:'India\'s wealth was systematically transferred to Britain through: Home charges (salaries of British officials), trade surplus not reinvested in India, profits repatriated by British companies, import of British manufactured goods destroying Indian handicrafts. This "drain" kept India poor despite natural wealth.'},
    {front:'What was the Moderate phase\'s most significant constitutional achievement?', back:'Indian Councils Act 1892 — expanded legislative councils and introduced indirect elections (first step toward representative government). Also successfully lobbied British Parliament through Indian Parliamentary Committee, keeping Indian issues on British political agenda.'}
  ],
  q:[
    {q:'The "Safety Valve Theory" in the context of Indian National Congress argues which of the following?', options:['INC was formed to channel Indian nationalism into violent revolution','INC was formed by British sympathizers to provide peaceful outlet for educated Indian grievances','INC was founded to promote cultural unity among Indians','INC was a secret organization working against British rule'], answer_index:1, explanation:'Safety Valve Theory (A.O. Hume): INC was meant to give educated Indians a legal, constitutional channel for grievances — preventing violent uprisings. This theory implies INC served British interests initially. Lala Lajpat Rai criticized this theory.'},
    {q:'Dadabhai Naoroji\'s contribution to the Indian freedom struggle was primarily in which domain?', options:['Armed revolutionary activities','Economic analysis proving British exploitation of India','Military organization of Indian sepoys','Religious reform and Hindu nationalism'], answer_index:1, explanation:'Dadabhai Naoroji (Grand Old Man of India) provided the most powerful economic argument against British rule — Drain of Wealth theory. He proved through data that British rule was systematically extracting Indian resources. He was also first Indian elected to British Parliament (1892).'}
  ],
  pyq:'High — UPSC 2016, 2019, 2021. Moderate ideology, Drain of Wealth theory, and INC foundation tested.',
  summary:'INC(1885,Bombay): A.O.Hume(founder)+W.C.Bonnerjee(1st president). Safety Valve Theory. Moderates: Pray+Petition+Protest. Goal=self-governance NOT independence. Naoroji=Drain of Wealth(poverty+un-British rule). R.C.Dutt=deindustrialization. Indian Councils Act 1892=first indirect elections. Gokhale=Gandhi\'s political guru. Moderation→failure→Extremism rise.'
}
];

async function push() {
  for(const d of days){
    const payload = {
      topic_title:d.topic, day_number:d.day, track:'upsc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ **UPSC Ranker Hook**: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Exam Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'Mastering '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC '+d.topic+' modern history prelims'),why:'Coaching-grade modern history tutorial.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const {error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:payload,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error) console.error('Day '+d.day+':',error.message);
    else console.log('Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 21-25 COMPLETE');
}
push();

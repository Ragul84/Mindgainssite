require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:current_affairs';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // More Indian History
  {
    question_text: "The Non-Cooperation Movement was launched by Gandhi in:",
    options: ["1918", "1920", "1922", "1925"],
    correct_answer: 1,
    explanation: "The Non-Cooperation Movement was launched on August 1, 1920 and was called off after the Chauri Chaura incident (February 1922) where a mob burned a police station.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Indian National Army (INA / Azad Hind Fauj) was led by:",
    options: ["Bhagat Singh", "Subhas Chandra Bose", "Bal Gangadhar Tilak", "Lala Lajpat Rai"],
    correct_answer: 1,
    explanation: "The Indian National Army (INA) was reorganised and led by Subhas Chandra Bose (Netaji), who gave the slogan 'Jai Hind' and marched to liberate India.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Lucknow Pact (1916) was an agreement between the Congress and:",
    options: ["British Government", "Muslim League", "Hindu Mahasabha", "Sikh League"],
    correct_answer: 1,
    explanation: "The Lucknow Pact was signed between the Indian National Congress and the All India Muslim League in 1916 for joint action against British rule.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Montagu-Chelmsford Reforms introduced the Government of India Act in:",
    options: ["1909", "1914", "1919", "1935"],
    correct_answer: 2,
    explanation: "Montagu-Chelmsford Reforms led to the Government of India Act 1919, which introduced dyarchy in provinces and expanded provincial councils.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Polity 3
  {
    question_text: "Who heads the State Public Service Commission?",
    options: ["Chief Minister", "Governor", "Chairman appointed by Governor", "Chief Justice of High Court"],
    correct_answer: 2,
    explanation: "The State Public Service Commission is headed by a Chairman appointed by the Governor of the State under Article 316.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Zero Hour' in Indian Parliament refers to:",
    options: ["Session begins at midnight", "Time for unanticipated issues immediately after Questions Hour", "Time for financial debate", "PM's address to Parliament"],
    correct_answer: 1,
    explanation: "Zero Hour starts immediately after Question Hour (after 12 noon). Members can raise urgent matters of public importance without prior notice.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Gram Sabha is a body consisting of:",
    options: ["Elected Panchayat members", "All persons registered on electoral rolls in a village/ward", "Village headmen", "BDO and officials"],
    correct_answer: 1,
    explanation: "Gram Sabha consists of all persons registered on the electoral rolls of a village or villages in the area comprising a Gram Panchayat.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which schedule of the Indian Constitution contains the list of Fundamental Duties?",
    options: ["First Schedule", "Second Schedule", "Tenth Schedule", "No schedule – Article 51A"],
    correct_answer: 3,
    explanation: "Fundamental Duties are not in any Schedule. They are in Article 51A (Part IV-A), added by the 42nd Amendment 1976. There are now 11 Fundamental Duties.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Economy 3
  {
    question_text: "The term 'fiscal deficit' means:",
    options: ["Trade deficit", "Revenue receipts minus revenue expenditure", "Total expenditure minus total revenue receipts (excluding borrowings)", "Current account deficit"],
    correct_answer: 2,
    explanation: "Fiscal deficit = Total expenditure - Revenue receipts - Non-debt capital receipts. It indicates the amount the government needs to borrow.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'Jan Vishwas Bill 2023' aims to:",
    options: ["Digitise court records", "Decriminalise minor offences in 42 laws", "Reform criminal justice", "Digitise land records"],
    correct_answer: 1,
    explanation: "Jan Vishwas (Amendment of Provisions) Act 2023 decriminalises minor offences across 42 central laws to ease doing business and reduce unnecessary litigation.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'PM DevINE' scheme supports infrastructure development in:",
    options: ["Aspirational districts", "North-East India", "Coastal areas", "Desert regions"],
    correct_answer: 1,
    explanation: "PM-DevINE (PM's Development Initiative for North-East Region) funds infrastructure and social development projects in North-East states.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Sports 4
  {
    question_text: "The 2026 FIFA World Cup will be hosted jointly by:",
    options: ["Brazil, Argentina, Chile", "USA, Canada, Mexico", "Australia, New Zealand, Japan", "Germany, France, Spain"],
    correct_answer: 1,
    explanation: "The 2026 FIFA World Cup will be jointly hosted by the USA, Canada, and Mexico — the first World Cup with 48 teams.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's Satwiksairaj Rankireddy and Chirag Shetty are known for which sport?",
    options: ["Tennis doubles", "Badminton doubles", "Table Tennis doubles", "Squash doubles"],
    correct_answer: 1,
    explanation: "Satwiksairaj Rankireddy and Chirag Shetty are Indian badminton players specialising in men's doubles. They were ranked World No.1 in 2023.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India won the ICC T20 World Cup for the first time in:",
    options: ["2007", "2009", "2011", "2014"],
    correct_answer: 0,
    explanation: "India won the inaugural ICC T20 World Cup in 2007, defeating Pakistan in the final in Johannesburg, South Africa under MS Dhoni's captaincy.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "India won the ODI Cricket World Cup in years:",
    options: ["1983 and 2011", "1983 and 2003", "2003 and 2011", "1975 and 1983"],
    correct_answer: 0,
    explanation: "India has won the ODI Cricket World Cup twice: in 1983 (under Kapil Dev) and in 2011 (under MS Dhoni) — both times defeating the West Indies and Sri Lanka respectively.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // International 3
  {
    question_text: "The International Court of Justice (ICJ) is located in:",
    options: ["New York", "Geneva", "The Hague", "Brussels"],
    correct_answer: 2,
    explanation: "The ICJ (principal judicial organ of the UN) is headquartered in the Peace Palace in The Hague, Netherlands.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The World Food Programme (WFP) won the Nobel Peace Prize in:",
    options: ["2015", "2018", "2020", "2022"],
    correct_answer: 2,
    explanation: "The World Food Programme (WFP) won the Nobel Peace Prize in 2020 for its efforts to combat hunger, bettering conditions for peace in conflict-affected areas.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Interpol (International Criminal Police Organisation) headquarters is in:",
    options: ["London", "Paris", "Lyon", "Brussels"],
    correct_answer: 2,
    explanation: "Interpol's General Secretariat is headquartered in Lyon, France. It facilitates international police cooperation.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The African Union (AU) has its headquarters in:",
    options: ["Nairobi", "Lagos", "Addis Ababa", "Johannesburg"],
    correct_answer: 2,
    explanation: "The African Union headquarters (Headquarters Building) is in Addis Ababa, Ethiopia.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Awards
  {
    question_text: "The Nobel Prize for Economics (The Sveriges Riksbank Prize) was not awarded in the original Alfred Nobel's will. It was first awarded in:",
    options: ["1952", "1960", "1969", "1975"],
    correct_answer: 2,
    explanation: "The Nobel Memorial Prize in Economic Sciences was established by Sveriges Riksbank (Sweden's central bank) in 1968 and first awarded in 1969.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Gallantry awards in India on Republic Day include (in order of precedence):",
    options: ["Arjuna, Dronacharya, Dhyan Chand", "Param Vir Chakra, Maha Vir Chakra, Vir Chakra", "Bharat Ratna, Padma Vibhushan, Padma Bhushan", "None of these"],
    correct_answer: 1,
    explanation: "Military gallantry awards in order: Param Vir Chakra (highest) > Maha Vir Chakra > Vir Chakra (all wartime). During peacetime: Ashok Chakra > Kirti Chakra > Shaurya Chakra.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Key Schemes 3
  {
    question_text: "The Pradhan Mantri Gramin Digital Saksharta Abhiyan (PMGDISHA) aims to:",
    options: ["Build rural roads", "Make rural households digitally literate", "Provide free smartphones", "Set up IT parks in villages"],
    correct_answer: 1,
    explanation: "PMGDISHA aims to impart digital literacy training to at least one person per eligible rural household, targeting 6 crore rural households.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'Har Ghar Nal Se Jal' is a sub-mission of:",
    options: ["Swachh Bharat", "Jal Shakti Abhiyan", "Jal Jeevan Mission", "AMRUT"],
    correct_answer: 2,
    explanation: "'Har Ghar Nal Se Jal' is the goal of Jal Jeevan Mission — to provide functional household tap connections (FHTC) to every rural household.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'SVAMITVA Scheme' (Survey of Villages and Mapping with Improvised Technology in Village Areas) issues:",
    options: ["Aadhaar cards to villagers", "Property cards (rights of record) to rural households", "Kisan credit cards", "Voter ID in villages"],
    correct_answer: 1,
    explanation: "SVAMITVA Scheme (launched April 24, 2020) creates property cards for rural household owners in inhabited areas (aabadi land) using drone survey technology.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Environment 4
  {
    question_text: "India's first 'Dark Sky Reserve' was established at:",
    options: ["Ladakh (Hanle)", "Spiti Valley", "Coorg", "Aravalli Hills"],
    correct_answer: 0,
    explanation: "India's first Dark Sky Reserve was established at Hanle, Ladakh in 2022 to promote astrotourism and protect the night sky from light pollution.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which river is known as the 'National River of India'?",
    options: ["Yamuna", "Ganga", "Godavari", "Brahmaputra"],
    correct_answer: 1,
    explanation: "The Ganga was declared the 'National River of India' in November 2008 by the Government of India.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Tamil Nadu 5
  {
    question_text: "The 'Maalaimalar' Tamil Nadu government scheme provides:",
    options: ["Free medicines", "Evening meals at subsidised rates", "Free textbooks", "Scholarships to students"],
    correct_answer: 1,
    explanation: "Maalaimalar/Amma Canteen scheme provides cooked food at highly subsidised prices to common people in Tamil Nadu.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Tamil Nadu's 'Chief Minister's Breakfast Scheme' provides free breakfast to government school students of which classes?",
    options: ["Classes 1-5", "Classes 1-8", "Classes 1-12", "Only Class 1"],
    correct_answer: 0,
    explanation: "The Chief Minister's Breakfast Scheme in Tamil Nadu provides free breakfast to students from Classes 1 to 5 in government primary schools.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Tamil Nadu government launched 'Makkalai Thedi Maruthuvam' scheme for:",
    options: ["Mobile health services at doorstep", "Free hospital construction", "Doctor training", "Medicine manufacturing"],
    correct_answer: 0,
    explanation: "Makkalai Thedi Maruthuvam (Healthcare to the Doorsteps) is a Tamil Nadu health scheme providing door-to-door health services to senior citizens and bedridden patients.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The TIDEL Park in Chennai is a hub for:",
    options: ["Textile industry", "IT/Software industry", "Automobile manufacturing", "Chemical industry"],
    correct_answer: 1,
    explanation: "TIDEL Park (Tamil Nadu Information Development and Electronics Corporation) in Chennai is one of India's largest IT parks, housing numerous IT/software companies.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  // Recent 2024 Events
  {
    question_text: "India's Lok Sabha election 2024 was won by the NDA coalition. Who became PM for the third consecutive term?",
    options: ["Amit Shah", "Narendra Modi", "Rajnath Singh", "Yogi Adityanath"],
    correct_answer: 1,
    explanation: "Narendra Modi was sworn in as Prime Minister for the third consecutive term on June 9, 2024, after the NDA secured majority in the 18th Lok Sabha elections.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "India's Union Budget 2024-25 abolished the Angel Tax for all classes of investors. Angel Tax was governed under Section ___ of the Income Tax Act.",
    options: ["54", "68", "56(2)(viib)", "80-IC"],
    correct_answer: 2,
    explanation: "Angel Tax was levied under Section 56(2)(viib) of the Income Tax Act on investment in startups above fair market value. Budget 2024-25 abolished it for all investor categories.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 2024 Nobel Prize in Chemistry was awarded for:",
    options: ["Quantum chemistry", "Computational protein design and protein structure prediction", "Battery chemistry", "Carbon capture"],
    correct_answer: 1,
    explanation: "The 2024 Nobel Prize in Chemistry was awarded to David Baker, Demis Hassabis, and John Jumper for computational protein design and protein structure prediction (AlphaFold).",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India formally joined the BRICS-led New Development Bank (NDB) in:",
    options: ["2014", "2015", "2016", "2018"],
    correct_answer: 1,
    explanation: "The NDB (New Development Bank) was established in 2015 by BRICS nations (Brazil, Russia, India, China, South Africa) to fund infrastructure and sustainable development projects.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Unified Command against terrorism in J&K was created after which attack?",
    options: ["Pulwama (2019)", "Uri (2016)", "Pahalgam (2025)", "Pathankot (2016)"],
    correct_answer: 2,
    explanation: "Following the Pahalgam terrorist attack of April 2025, India strengthened its counter-terrorism response and coordination mechanisms in J&K.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India signed the 'Initiative on Critical and Emerging Technology' (iCET) with which country?",
    options: ["Japan", "Australia", "USA", "Israel"],
    correct_answer: 2,
    explanation: "India and USA launched iCET (Initiative on Critical and Emerging Technology) in January 2023 to advance cooperation in areas like semiconductors, space, AI, and defence.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's GDP crossed the milestone of 4 trillion USD (nominal) in:",
    options: ["2022", "2023", "2024", "2025"],
    correct_answer: 2,
    explanation: "India's GDP crossed $4 trillion (nominal) in 2024, solidifying its position as the 5th largest economy globally.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The term 'New India' or 'Viksit Bharat' targets India becoming a developed nation by:",
    options: ["2030", "2035", "2047", "2050"],
    correct_answer: 2,
    explanation: "Viksit Bharat (Developed India) is the government's vision to make India a developed nation by 2047, coinciding with 100 years of independence.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which committee recommended the abolition of the Planning Commission?",
    options: ["Rangarajan Committee", "Kelkar Committee", "No formal committee — PM Modi's decision", "Expenditure Management Commission"],
    correct_answer: 2,
    explanation: "The dissolution of the Planning Commission and creation of NITI Aayog was PM Narendra Modi's personal initiative, announced in his first Independence Day speech in 2014.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'Mission Karmayogi' is a capacity building scheme for:",
    options: ["Students", "Farmers", "Civil servants", "Entrepreneurs"],
    correct_answer: 2,
    explanation: "Mission Karmayogi (2020) is a national programme for civil services capacity building to develop future-ready civil servants with right attitude, skills, and knowledge.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Uniform Civil Code (UCC) was implemented in which state first?",
    options: ["Goa (historical)", "Uttarakhand", "Himachal Pradesh", "Gujarat"],
    correct_answer: 1,
    explanation: "Uttarakhand became the first state to enact a Uniform Civil Code (UCC) in 2024. Note: Goa has had its own UCC (Portuguese Civil Code) since before independence.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Smart Villages' programme is part of which ministry's initiative?",
    options: ["Ministry of Rural Development", "Ministry of Electronics and IT", "Ministry of Panchayati Raj", "Ministry of Agriculture"],
    correct_answer: 1,
    explanation: "Smart Villages initiatives include components from multiple ministries. BharatNet (under MeitY/DoT) aims to connect gram panchayats with broadband as part of Digital Villages.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India ratified the RCEP (Regional Comprehensive Economic Partnership) agreement.",
    options: ["True - India ratified in 2021", "False - India withdrew from RCEP negotiations in 2019", "True - India ratified in 2022", "False - India is observing RCEP"],
    correct_answer: 1,
    explanation: "India pulled out of RCEP negotiations in November 2019, citing concerns about China's manufacturing dominance and possible damage to domestic industries. India is not part of RCEP.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's GDP at current prices (2024-25 budget estimate) is approximately:",
    options: ["₹200 lakh crore", "₹232 lakh crore", "₹295 lakh crore", "₹350 lakh crore"],
    correct_answer: 2,
    explanation: "India's nominal GDP for 2024-25 is estimated at approximately ₹295-300 lakh crore (~$3.7 trillion), making it the world's 5th largest economy.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "National Health Authority (NHA) implements the PM-JAY scheme. NHA was established in:",
    options: ["2016", "2018", "2019", "2020"],
    correct_answer: 2,
    explanation: "National Health Authority (NHA) was established in 2019 as an independent entity to implement PM-JAY (Pradhan Mantri Jan Arogya Yojana).",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'One District One Product' scheme for export promotion is managed by:",
    options: ["Ministry of Commerce and Industry", "Ministry of MSME", "APEDA", "DPIIT"],
    correct_answer: 0,
    explanation: "ODOP for exports is managed under the Ministry of Commerce and Industry (DPIIT), identifying and promoting unique products from each district for global markets.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Chandrayaan-1 discovered water molecules on the Moon in:",
    options: ["2007", "2008", "2009", "2010"],
    correct_answer: 2,
    explanation: "Chandrayaan-1's Moon Impact Probe discovered evidence of water molecules on the Moon's surface in 2009, confirmed by NASA's LCROSS mission.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Eastern Economic Forum' that India participates in is held annually in:",
    options: ["Beijing", "Tokyo", "Vladivostok, Russia", "Seoul"],
    correct_answer: 2,
    explanation: "The Eastern Economic Forum (EEF) is held annually in Vladivostok, Russia. India's PM has participated in EEF as part of Act East Policy engagement with Russia.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's National Monetisation Pipeline (NMP) was launched to:",
    options: ["Build new oil pipelines", "Monetise underutilised public sector assets", "Privatise PSUs", "Attract FDI in infrastructure"],
    correct_answer: 1,
    explanation: "NMP (2021) aims to monetise core assets of the Central Government (roads, railways, power, telecom) to raise ₹6 lakh crore over 4 years (2021-25).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Anti-Drone Technology 'D-4' was developed by:",
    options: ["HAL", "DRDO", "BEL", "ISRO"],
    correct_answer: 1,
    explanation: "DRDO developed the D-4 system (Drone Detect, Deter and Destroy) for anti-drone operations. BEL and other PSUs support production.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
];

async function rpush(items) {
  const values = items.map(q => JSON.stringify(q));
  const r = await fetch(`${BASE}/pipeline`, {
    method: 'POST', headers: HDR,
    body: JSON.stringify([['RPUSH', KEY, ...values]]),
  });
  return r.json();
}

async function main() {
  console.log(`Adding ${questions.length} questions to ${KEY}...`);
  const BATCH = 50;
  let total = 0;
  for (let i = 0; i < questions.length; i += BATCH) {
    const batch = questions.slice(i, i + BATCH);
    await rpush(batch);
    total += batch.length;
    console.log(`Batch ${Math.floor(i/BATCH)+1}: pushed ${batch.length} → total added ${total}`);
  }
  console.log(`Done! Added ${total} questions to ${KEY}`);
}
main().catch(console.error);

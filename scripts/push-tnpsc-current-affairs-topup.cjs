require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:current_affairs';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  {
    question_text: "India's first female President was:",
    options: ["Sonia Gandhi", "Pratibha Patil", "Droupadi Murmu", "Meira Kumar"],
    correct_answer: 1,
    explanation: "Pratibha Patil was India's first female President, serving from 2007 to 2012 as the 12th President of India.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Green Hydrogen Standard notified by India requires green hydrogen to have GHG emissions of less than:",
    options: ["2 kg CO₂/kg H₂", "1 kg CO₂/kg H₂", "4 kg CO₂/kg H₂", "5 kg CO₂/kg H₂"],
    correct_answer: 0,
    explanation: "India's Green Hydrogen Standard (2023) defines green hydrogen as having lifecycle GHG emissions less than 2 kg CO₂ equivalent per kg of hydrogen.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Rozgar Mela' launched by PM Modi aims to:",
    options: ["Provide agricultural employment", "Distribute appointment letters to central government job appointees", "Create MSME jobs", "Build job portals"],
    correct_answer: 1,
    explanation: "Rozgar Mela involves distributing appointment letters to newly recruited central government employees across various departments and ministries.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's National Quantum Mission (NQM) approved in 2023 has a budget of approximately:",
    options: ["₹3,000 crore", "₹6,003 crore", "₹10,000 crore", "₹1,500 crore"],
    correct_answer: 1,
    explanation: "India's National Quantum Mission (2023-2031) was approved with a budget of ₹6,003.65 crore to develop quantum technologies.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which Indian state first implemented 'Mukhyamantri Sikho Kamao Yojana' for youth skill development?",
    options: ["Rajasthan", "Madhya Pradesh", "Uttar Pradesh", "Gujarat"],
    correct_answer: 1,
    explanation: "Madhya Pradesh launched 'Mukhya Mantri Seekho-Kamao Yojana' to provide skill training with stipend to unemployed youth.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Sagarmatha Sambaad is a diplomatic forum hosted by:",
    options: ["India", "Nepal", "Bangladesh", "Sri Lanka"],
    correct_answer: 1,
    explanation: "Sagarmatha Sambaad is a multilateral dialogue forum hosted by Nepal on global issues. Named after Sagarmatha (Mt. Everest in Nepali).",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's coastline (total including islands) is approximately:",
    options: ["5,422 km", "7,516 km", "9,000 km", "6,100 km"],
    correct_answer: 1,
    explanation: "India's total coastline is approximately 7,516.6 km (mainland: 5,422 km + island territories: 2,094 km).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "India's first 'Human Space Flight Centre' is located at:",
    options: ["Sriharikota", "Bengaluru", "Thiruvananthapuram", "Ahmedabad"],
    correct_answer: 1,
    explanation: "ISRO's Human Space Flight Centre (HSFC) is located in Bengaluru, Karnataka. It manages India's Gaganyaan crewed spaceflight programme.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Pariksha Pe Charcha' is an annual event where PM interacts with:",
    options: ["Teachers", "Students about exam stress", "Scientists", "Sportspersons"],
    correct_answer: 1,
    explanation: "Pariksha Pe Charcha is an annual programme where PM Narendra Modi interacts with students, parents, and teachers to address exam-related stress.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's rank in the 2023 Global Innovation Index (GII) was:",
    options: ["30th", "40th", "46th", "52nd"],
    correct_answer: 2,
    explanation: "India ranked 40th in the Global Innovation Index 2023 (published by WIPO), up from 81st in 2015. India is among the top innovation economies.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Constitution (103rd Amendment) Act provides reservation to:",
    options: ["OBCs", "Economically Weaker Sections (EWS) — 10%", "Scheduled Tribes in urban areas", "Women in Parliament"],
    correct_answer: 1,
    explanation: "The 103rd Amendment (2019) introduced 10% reservation for Economically Weaker Sections (EWS) in educational institutions and government jobs.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Semiconductor Mission is modelled after which country's CHIPS Act?",
    options: ["South Korea", "Taiwan", "USA", "Japan"],
    correct_answer: 2,
    explanation: "India's Semiconductor Mission (2021, ₹76,000 crore) was inspired partly by the USA's CHIPS and Science Act to boost domestic semiconductor manufacturing.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which Indian state produces the most cotton?",
    options: ["Punjab", "Maharashtra", "Gujarat", "Rajasthan"],
    correct_answer: 2,
    explanation: "Gujarat is the largest cotton-producing state in India, followed by Maharashtra. Gujarat is often called the 'Cotton Bowl of India.'",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's National Mineral Policy 2019 aims to promote:",
    options: ["Mining prohibition", "Sustainable development of mineral resources", "Only government mining", "Import of minerals"],
    correct_answer: 1,
    explanation: "National Mineral Policy 2019 aims to ensure sustainable development of the mineral sector — balancing mineral extraction with environmental protection.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which Indian state has the highest literacy rate as per Census 2011?",
    options: ["Goa", "Mizoram", "Himachal Pradesh", "Kerala"],
    correct_answer: 3,
    explanation: "Kerala has the highest literacy rate in India at 93.91% (Census 2011), followed by Lakshadweep and Mizoram.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "India's first private rocket launched to space was:",
    options: ["SkyRoot's Vikram-S", "Agnikul's Agnibaan", "Pixxel's satellite", "Bellatrix's rocket"],
    correct_answer: 0,
    explanation: "SkyRoot Aerospace's Vikram-S rocket was India's first privately developed rocket launched into space (sub-orbital) on November 18, 2022 under ISRO's IN-SPACe.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'Jan Aushadhi' scheme provides:",
    options: ["Free medicines to BPL", "Generic medicines at low prices through Pradhan Mantri Bharatiya Janaushadhi Kendras", "Free surgeries", "Traditional medicines"],
    correct_answer: 1,
    explanation: "Pradhan Mantri Bharatiya Janaushadhi Pariyojana provides quality generic medicines at affordable prices through 10,000+ Jan Aushadhi Kendras across India.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The headquarters of the Asian Development Bank (ADB) is in:",
    options: ["Tokyo", "Beijing", "Manila", "Singapore"],
    correct_answer: 2,
    explanation: "ADB headquarters is in Manila, Philippines. ADB was established in 1966 and India is a founding member.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The International Finance Corporation (IFC) is part of:",
    options: ["IMF", "World Bank Group", "WTO", "AIIB"],
    correct_answer: 1,
    explanation: "IFC is the private sector arm of the World Bank Group, providing investments and advisory services to the private sector in developing countries.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's External Affairs Minister (2024) is:",
    options: ["Rajnath Singh", "S. Jaishankar", "Nirmala Sitharaman", "Amit Shah"],
    correct_answer: 1,
    explanation: "Dr. S. Jaishankar has been India's Minister of External Affairs since May 2019 (1st term) and continued in the 2024 government.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Home Minister (2024) is:",
    options: ["Rajnath Singh", "Narendra Modi", "Amit Shah", "Yogi Adityanath"],
    correct_answer: 2,
    explanation: "Amit Shah has been India's Home Minister since May 2019 and continued in the third NDA government formed after 2024 elections.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which is India's largest stock exchange?",
    options: ["BSE", "NSE", "MSEI", "CSE"],
    correct_answer: 1,
    explanation: "National Stock Exchange (NSE) is India's largest stock exchange by trading volumes. BSE (Bombay Stock Exchange) is Asia's oldest stock exchange.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "SENSEX is associated with:",
    options: ["NSE", "BSE", "SEBI", "RBI"],
    correct_answer: 1,
    explanation: "SENSEX (Sensitive Index) is the benchmark index of the Bombay Stock Exchange (BSE), comprising 30 well-established companies.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "India's 'Mission Indradhanush' is related to:",
    options: ["Space exploration", "Universal immunisation of children", "Water conservation", "Solar energy"],
    correct_answer: 1,
    explanation: "Mission Indradhanush (2014) aims to vaccinate children against preventable diseases — covering vaccines for 12 diseases. The intensified version reached 90%+ full immunisation coverage.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India launched the Kisan Drones scheme to use drones for:",
    options: ["Surveillance of farms", "Crop assessment and pesticide spraying", "Weather monitoring", "Crop storage"],
    correct_answer: 1,
    explanation: "Kisan Drones are being promoted for crop assessment, land record digitisation, and spraying insecticides and nutrients on crops to improve agricultural productivity.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'Vizhinjam International Seaport' is located in which state?",
    options: ["Tamil Nadu", "Andhra Pradesh", "Kerala", "Karnataka"],
    correct_answer: 2,
    explanation: "Vizhinjam International Deepwater Multipurpose Seaport is located near Thiruvananthapuram, Kerala. It was developed by Adani Ports and became operational in 2024.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's GIFT City (Gujarat International Finance Tec-City) is located in:",
    options: ["Ahmedabad", "Surat", "Gandhinagar", "Vadodara"],
    correct_answer: 2,
    explanation: "GIFT City is India's first operational greenfield smart city and operational International Financial Services Centre (IFSC), located in Gandhinagar, Gujarat.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'Tubewell Irrigation Schemes' are most prevalent in:",
    options: ["Southern India", "Indo-Gangetic Plains", "Deccan Plateau", "North-East India"],
    correct_answer: 1,
    explanation: "Tubewell/borewell irrigation is most prevalent in the Indo-Gangetic Plains (Punjab, Haryana, UP, Bihar) due to shallow groundwater availability.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "National Legal Services Authority (NALSA) provides free legal services to:",
    options: ["Only SC/ST", "Women only", "Marginalised and vulnerable groups", "Government employees"],
    correct_answer: 2,
    explanation: "NALSA (established under Legal Services Authorities Act 1987) provides free and competent legal services to weaker sections including SC/ST, women, disabled, minorities, and economically weaker people.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'TULIP' (The Urban Learning Internship Programme) provides internship to:",
    options: ["Medical graduates", "Engineering students", "Fresh graduates and students with Urban Local Bodies", "Law graduates"],
    correct_answer: 2,
    explanation: "TULIP provides internship opportunities to fresh graduates with Urban Local Bodies (ULBs) and Smart Cities across India.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's rank in the 2023 Corruption Perceptions Index (CPI) by Transparency International was:",
    options: ["80th", "93rd", "105th", "120th"],
    correct_answer: 1,
    explanation: "India ranked 93rd out of 180 countries in the Corruption Perceptions Index 2023 with a score of 39 (out of 100). Higher score = less corrupt.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's total installed renewable energy capacity (as of 2024) crossed:",
    options: ["100 GW", "150 GW", "200 GW", "250 GW"],
    correct_answer: 2,
    explanation: "India's total installed renewable energy capacity (solar, wind, hydro, bio) crossed 200 GW in 2024. India is targeting 500 GW by 2030.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Pradhan Mantri Van Dhan Yojana' targets which community?",
    options: ["Fisherfolk", "Tribal communities", "Urban poor", "Nomadic tribes"],
    correct_answer: 1,
    explanation: "PM Van Dhan Yojana (2018) aims to enhance tribal income through value addition of tribal produce (minor forest produce), setting up Van Dhan Vikas Kendras.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first All-Women Police Station was established in:",
    options: ["Mumbai", "Delhi", "Chennai", "Bengaluru"],
    correct_answer: 2,
    explanation: "Kerala established India's first All-Women Police Station in 1973. Tamil Nadu also has all-women police stations. Various states have different claims to 'first' based on different parameters.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "NISAR (NASA-ISRO SAR) Mission is designed to measure changes in Earth's surface every:",
    options: ["6 months", "12 days", "30 days", "3 months"],
    correct_answer: 1,
    explanation: "NISAR will use two radar systems (L-band and S-band) to measure changes in Earth's surface every 12 days, tracking ecosystems, ice masses, natural hazards, and more.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Eastern Economic Corridor (EEC)' project connects which two regions of India?",
    options: ["North-East to West", "Amritsar to Kolkata via Delhi", "Ludhiana to Kolkata (Eastern DFC)", "Mumbai to Kolkata"],
    correct_answer: 2,
    explanation: "The Eastern Dedicated Freight Corridor (EDFC) runs from Ludhiana/New Delhi to Kolkata (Dankuni), providing dedicated freight transport along the eastern route.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first 'Green Hydrogen Fuel Cell Boat' was launched at:",
    options: ["Mumbai", "Varanasi", "Kochi", "Chennai"],
    correct_answer: 2,
    explanation: "India's first green hydrogen fuel cell boat 'Aditya' was launched in Kerala, and an advanced hydrogen-powered vessel was unveiled at Kochi as part of India's green hydrogen initiatives.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The 'National Clean Air Programme (NCAP)' targets reducing PM2.5 and PM10 concentrations by ___ % by 2026 (from 2017 baseline).",
    options: ["20%", "30%", "40%", "50%"],
    correct_answer: 2,
    explanation: "India's NCAP (2019) initially targeted 20-30% reduction in PM2.5/PM10 by 2024. The revised target (2023) is 40% reduction by 2026 in 131 non-attainment cities.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Aatmanirbhar Bharat' (Self-Reliant India) initiative was announced in which year?",
    options: ["2018", "2019", "2020", "2021"],
    correct_answer: 2,
    explanation: "PM Modi announced 'Aatmanirbhar Bharat Abhiyan' (Self-Reliant India) in May 2020 as India's economic response to the COVID-19 pandemic, with ₹20 lakh crore stimulus.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "India's Directorate General of Foreign Trade (DGFT) operates under:",
    options: ["Ministry of Finance", "Ministry of External Affairs", "Ministry of Commerce and Industry", "RBI"],
    correct_answer: 2,
    explanation: "DGFT operates under the Ministry of Commerce and Industry. It formulates and implements India's foreign trade policy and issues export-import licences.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Largest River Island 'Majuli' is in which state?",
    options: ["West Bengal", "Bihar", "Assam", "Meghalaya"],
    correct_answer: 2,
    explanation: "Majuli in the Brahmaputra River, Assam is the world's largest river island. It was declared a district in 2016.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Cyber Surakshit Bharat' initiative was launched to:",
    options: ["Ban social media", "Train government officials in cybersecurity", "Block foreign websites", "Create a national firewall"],
    correct_answer: 1,
    explanation: "Cyber Surakshit Bharat was launched in 2018 to spread cybersecurity awareness and train IT officials of government departments in cybersecurity practices.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The NAVIC (Navigation with Indian Constellation) system provides coverage over:",
    options: ["India only", "India and surrounding region up to 1500 km", "Asia", "Global coverage"],
    correct_answer: 1,
    explanation: "NavIC (NDS — Navigation with Indian Constellation, formerly IRNSS) provides accurate positioning over India and a region extending ~1500 km around India.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Tamil Nadu's 'Theneer Kudaneer' scheme ensures:",
    options: ["Canal irrigation", "Safe drinking water through RO plants in rural areas", "Groundwater recharge", "Water meters in urban areas"],
    correct_answer: 1,
    explanation: "Theneer Kudaneer (meaning 'clean water') scheme installs Reverse Osmosis (RO) purification plants in fluoride-affected and salinity-affected rural areas of Tamil Nadu.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's National Broadband Mission targets providing broadband connectivity to all villages by:",
    options: ["2022", "2024", "2025", "2030"],
    correct_answer: 2,
    explanation: "The National Broadband Mission aims to provide high-speed internet to all villages (2,50,000 gram panchayats) through BharatNet by 2025.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Pradhan Mantri Annadata Aay SanraksHan Abhiyan (PM-AASHA) ensures farmers get:",
    options: ["Free seeds", "MSP for crops through price support/deficiency payment", "Free irrigation", "Crop insurance only"],
    correct_answer: 1,
    explanation: "PM-AASHA (2018) is an umbrella scheme to ensure MSP to farmers through Price Support Scheme (PSS), Price Deficiency Payment Scheme (PDPS), and Pilot of Private Procurement & Stockist Scheme.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's FPI (Foreign Portfolio Investment) is regulated by:",
    options: ["RBI", "SEBI", "Ministry of Finance", "DPIIT"],
    correct_answer: 1,
    explanation: "SEBI (Securities and Exchange Board of India) regulates Foreign Portfolio Investors (FPI) who invest in Indian equity, debt, and derivatives markets.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "World Health Day is observed on:",
    options: ["March 22", "April 7", "May 12", "June 5"],
    correct_answer: 1,
    explanation: "World Health Day is observed on April 7, the founding date of the World Health Organisation (WHO) in 1948.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The Constitution (104th Amendment) Act, 2020 abolished:",
    options: ["Triple Talaq", "Section 377", "Reservation for Anglo-Indians in Parliament and State Legislatures", "Article 370"],
    correct_answer: 2,
    explanation: "The 104th Amendment (2020) extended reservations for SC/ST by 10 more years but abolished the provision for nomination of Anglo-Indians to Parliament and State Assemblies.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's PM Vishwakarma Scheme (2023) provides support to:",
    options: ["Farmers", "Traditional artisans and craftspeople (Vishwakarma community)", "Street vendors", "Women entrepreneurs"],
    correct_answer: 1,
    explanation: "PM Vishwakarma Scheme provides recognition, training, credit support (₹3 lakh at concessional rate), and market linkage to 18 categories of traditional artisans and craftspeople.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'SANKALP' programme stands for:",
    options: ["Sustainable Agriculture Network", "Skills Acquisition and Knowledge Awareness for Livelihood Promotion", "Social and National Kalyan Literacy Programme", "Science and Knowledge for Learning and Progress"],
    correct_answer: 1,
    explanation: "SANKALP (Skills Acquisition and Knowledge Awareness for Livelihood Promotion) is a World Bank-assisted scheme for skill development and livelihood promotion.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India became the first country to land near the Moon's south pole. Why is the south pole significant?",
    options: ["Warmest part of Moon", "Presence of permanently shadowed craters that may contain water ice", "Closest to Earth", "Easiest landing zone"],
    correct_answer: 1,
    explanation: "The Moon's south pole contains permanently shadowed regions in craters where temperatures are extremely cold (-200°C), potentially preserving water ice useful for future lunar missions.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Coastal Regulation Zone (CRZ) Notification' in India is issued under the:",
    options: ["Forest Conservation Act", "Environment Protection Act 1986", "Wildlife Protection Act", "Indian Maritime Act"],
    correct_answer: 1,
    explanation: "CRZ Notifications are issued under the Environment (Protection) Act, 1986 to regulate activities along the coastline and protect coastal ecosystems.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)' is a scheme for:",
    options: ["Agricultural skill development", "Rural youth skill development for placement-linked employment", "Urban employment guarantee", "Tribal welfare"],
    correct_answer: 1,
    explanation: "DDU-GKY provides skill and placement-linked training to rural youth (15-35 years) to connect them with employment opportunities in India and abroad.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The SAFTA (South Asian Free Trade Area) agreement was signed in:",
    options: ["2000", "2002", "2004", "2006"],
    correct_answer: 2,
    explanation: "SAFTA agreement was signed at the 12th SAARC Summit in January 2004 in Islamabad and came into force on January 1, 2006.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
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

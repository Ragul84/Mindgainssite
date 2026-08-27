require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:current_affairs';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // Indian History & Freedom Struggle
  {
    question_text: "The Salt March (Dandi March) was led by Mahatma Gandhi in:",
    options: ["1929", "1930", "1931", "1932"],
    correct_answer: 1,
    explanation: "The Dandi March began on March 12, 1930, when Gandhi walked 241 miles to Dandi to make salt and defy British salt laws, igniting the Civil Disobedience Movement.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Indian National Congress was founded in:",
    options: ["1875", "1880", "1885", "1890"],
    correct_answer: 2,
    explanation: "The Indian National Congress was founded on December 28, 1885 in Bombay by A.O. Hume, Dadabhai Naoroji, and Dinshaw Wacha.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "'Do or Die' slogan was given by Gandhi during which movement?",
    options: ["Non-Cooperation Movement", "Civil Disobedience Movement", "Quit India Movement", "Champaran Satyagraha"],
    correct_answer: 2,
    explanation: "'Do or Die' was Gandhi's slogan for the Quit India Movement (August 8, 1942). The movement demanded immediate independence from British rule.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Who gave the slogan 'Swaraj is my birthright'?",
    options: ["Mahatma Gandhi", "Bal Gangadhar Tilak", "Subhas Chandra Bose", "Bhagat Singh"],
    correct_answer: 1,
    explanation: "'Swaraj is my birthright, and I shall have it' is the famous slogan of Bal Gangadhar Tilak.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The first Governor-General of independent India was:",
    options: ["Lord Mountbatten", "C. Rajagopalachari", "Jawaharlal Nehru", "Rajendra Prasad"],
    correct_answer: 0,
    explanation: "Lord Louis Mountbatten was the first Governor-General of independent India (1947-1948). C. Rajagopalachari (Rajaji) was the first and only Indian Governor-General (1948-1950).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Geography
  {
    question_text: "Which is the longest river in India?",
    options: ["Brahmaputra", "Godavari", "Ganga", "Yamuna"],
    correct_answer: 2,
    explanation: "The Ganga is the longest river in India, flowing about 2,525 km from Gangotri glacier to the Bay of Bengal.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Tropic of Cancer passes through how many Indian states/UTs?",
    options: ["6", "7", "8", "9"],
    correct_answer: 2,
    explanation: "The Tropic of Cancer (23.5°N) passes through 8 Indian states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Western Ghats are also known as:",
    options: ["Aravalli", "Sahyadri", "Vindhya", "Satpura"],
    correct_answer: 1,
    explanation: "The Western Ghats are also called Sahyadri. They are a UNESCO World Heritage Site and one of the world's eight biodiversity hotspots.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's highest peak is:",
    options: ["Nanda Devi", "K2", "Kangchenjunga", "Mount Everest"],
    correct_answer: 2,
    explanation: "Kangchenjunga (8,586 m) is India's highest peak (entirely within India). K2 and Mount Everest are not within India's territory.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Sundarbans mangrove forest is located in:",
    options: ["Kerala", "West Bengal and Bangladesh", "Odisha", "Tamil Nadu"],
    correct_answer: 1,
    explanation: "The Sundarbans spans the delta of the Ganges, Brahmaputra, and Meghna rivers across West Bengal (India) and Bangladesh. It is home to the Royal Bengal Tiger.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Indian Economy
  {
    question_text: "India's Goods and Services Tax (GST) was implemented on:",
    options: ["April 1, 2017", "July 1, 2017", "October 1, 2017", "January 1, 2018"],
    correct_answer: 1,
    explanation: "GST was implemented across India on July 1, 2017, replacing multiple indirect taxes. It is a comprehensive, multi-stage, destination-based tax.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "India's currency is managed and issued by:",
    options: ["Ministry of Finance", "State Bank of India", "SEBI", "Reserve Bank of India"],
    correct_answer: 3,
    explanation: "The Reserve Bank of India (RBI) is the central bank responsible for monetary policy and issuing currency notes (except ₹1 coin and note, which the Ministry of Finance issues).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "SEBI (Securities and Exchange Board of India) was established in:",
    options: ["1985", "1988", "1992", "1995"],
    correct_answer: 2,
    explanation: "SEBI was given statutory status in 1992 via the SEBI Act. It was established as a non-statutory body in 1988. It regulates the securities market in India.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Planning Commission was replaced by NITI Aayog in:",
    options: ["2013", "2014", "2015", "2016"],
    correct_answer: 2,
    explanation: "The Planning Commission (established 1950) was replaced by NITI (National Institution for Transforming India) Aayog on January 1, 2015.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's five-year planning era ended with the dissolution of the Planning Commission. The last five-year plan was:",
    options: ["11th Plan", "12th Plan", "13th Plan", "10th Plan"],
    correct_answer: 1,
    explanation: "The 12th Five-Year Plan (2012-2017) was the last five-year plan. NITI Aayog replaced the Planning Commission and shifted to a new approach.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Indian Science & Space
  {
    question_text: "India's Mars Orbiter Mission (Mangalyaan) was launched in:",
    options: ["2012", "2013", "2014", "2015"],
    correct_answer: 1,
    explanation: "Mangalyaan was launched on November 5, 2013 and entered Mars orbit on September 24, 2014. India became the first Asian country to reach Mars orbit.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first satellite Aryabhata was launched in:",
    options: ["1972", "1975", "1980", "1983"],
    correct_answer: 1,
    explanation: "Aryabhata, India's first satellite, was launched on April 19, 1975 by a Soviet rocket from Kapustin Yar, USSR.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "ISRO stands for:",
    options: ["Indian Space Research Organisation", "Indian Satellite Research Organisation", "Indian Science Research Organisation", "International Space Research Organisation"],
    correct_answer: 0,
    explanation: "ISRO stands for Indian Space Research Organisation. It was established in 1969, with its headquarters in Bengaluru.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The PSLV (Polar Satellite Launch Vehicle) made history in 2017 by launching ___ satellites in one mission.",
    options: ["84", "104", "123", "52"],
    correct_answer: 1,
    explanation: "ISRO's PSLV-C37 launched a record 104 satellites in a single mission on February 15, 2017 — the highest ever at that time.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's GSLV-Mk III (LVM3) was used to launch:",
    options: ["Chandrayaan-1", "Mangalyaan", "Chandrayaan-3", "Aditya-L1"],
    correct_answer: 2,
    explanation: "Chandrayaan-3 was launched by LVM3-M4 (formerly GSLV Mk III) on July 14, 2023 from Sriharikota.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Arts & Culture
  {
    question_text: "Bharatanatyam is a classical dance form from:",
    options: ["Kerala", "Andhra Pradesh", "Tamil Nadu", "Karnataka"],
    correct_answer: 2,
    explanation: "Bharatanatyam is a major classical Indian dance form originating in Tamil Nadu. It is one of the eight classical dances recognised by the Sangeet Natak Akademi.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Kuchipudi is a classical dance from:",
    options: ["Tamil Nadu", "Andhra Pradesh", "Odisha", "Manipur"],
    correct_answer: 1,
    explanation: "Kuchipudi is a classical dance from Andhra Pradesh (now also Telangana), named after the village Kuchipudi.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Ajanta Caves are located in:",
    options: ["Rajasthan", "Gujarat", "Maharashtra", "Madhya Pradesh"],
    correct_answer: 2,
    explanation: "The Ajanta Caves in Aurangabad district, Maharashtra, are a UNESCO World Heritage Site containing Buddhist cave monuments dating from the 2nd century BCE.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Khajuraho temples, known for their erotic sculpture, are in:",
    options: ["Rajasthan", "Madhya Pradesh", "Uttar Pradesh", "Bihar"],
    correct_answer: 1,
    explanation: "The Khajuraho group of monuments are in Chhatarpur district, Madhya Pradesh. Built between 950-1050 CE by the Chandela dynasty, they are a UNESCO World Heritage Site.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Pongal festival celebrated in Tamil Nadu corresponds to which festival in other states?",
    options: ["Onam", "Makar Sankranti / Lohri", "Bihu", "Ugadi"],
    correct_answer: 1,
    explanation: "Pongal (Tamil Nadu) is celebrated around January 14-15, coinciding with Makar Sankranti celebrated across India and Lohri in Punjab.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  // Indian Law & Judiciary
  {
    question_text: "The Indian Penal Code (IPC) was replaced by in 2024?",
    options: ["Bharatiya Nyaya Sanhita", "Indian Criminal Code", "New Penal Code", "Bharatiya Dand Sanhita"],
    correct_answer: 0,
    explanation: "The Bharatiya Nyaya Sanhita (BNS) replaced the Indian Penal Code (IPC) 1860. Along with it, BNSS (replacing CrPC) and BSA (replacing Indian Evidence Act) came into force on July 1, 2024.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Right to Information (RTI) Act was enacted in:",
    options: ["2003", "2004", "2005", "2006"],
    correct_answer: 2,
    explanation: "The Right to Information Act 2005 was enacted on June 15, 2005 to promote transparency and accountability in government functioning.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The National Green Tribunal (NGT) was established in:",
    options: ["2008", "2010", "2012", "2014"],
    correct_answer: 1,
    explanation: "The National Green Tribunal was established on October 18, 2010 under the NGT Act 2010 for fast disposal of cases relating to environmental protection.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Data Protection Bill passed by India in 2023 is known as:",
    options: ["Personal Data Protection Act", "Digital Personal Data Protection Act", "Information Technology Amendment Act", "Digital India Data Act"],
    correct_answer: 1,
    explanation: "The Digital Personal Data Protection (DPDP) Act 2023 was passed to regulate the processing of digital personal data in India.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Education
  {
    question_text: "The National Education Policy 2020 proposes a new school curriculum structure of:",
    options: ["10+2", "5+3+3+4", "6+4+2", "4+4+4"],
    correct_answer: 1,
    explanation: "NEP 2020 proposes a 5+3+3+4 structure: Foundational (5 years), Preparatory (3 years), Middle (3 years), and Secondary (4 years) stages.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which Indian university has the highest ranking in the QS World University Rankings 2024?",
    options: ["IIT Bombay", "IIT Delhi", "IISc Bengaluru", "IIT Madras"],
    correct_answer: 2,
    explanation: "IISc Bengaluru is India's top-ranked university in QS World Rankings. IIT Bombay and IIT Delhi also feature prominently.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's National Assessment and Accreditation Council (NAAC) grades are from:",
    options: ["A to D", "A++ to D", "1 to 10", "Grade I to IV"],
    correct_answer: 1,
    explanation: "NAAC grades institutions from A++ (highest) to C, and D for 'Not Accredited'. A++ is the highest grade.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  // Agriculture
  {
    question_text: "India's Green Revolution was primarily associated with:",
    options: ["Rice and cotton", "Wheat and rice", "Sugarcane and jute", "Pulses and oilseeds"],
    correct_answer: 1,
    explanation: "The Green Revolution (1960s-70s) introduced high-yielding variety (HYV) seeds primarily for wheat and rice, transforming India into a food-surplus nation.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "M.S. Swaminathan is known as the 'Father of Green Revolution in India'. He received Bharat Ratna in:",
    options: ["2022", "2023", "2024", "2025"],
    correct_answer: 2,
    explanation: "M.S. Swaminathan was awarded the Bharat Ratna posthumously in February 2024. He passed away on September 28, 2023.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "PM-KISAN scheme was launched in which year?",
    options: ["2016", "2017", "2018", "2019"],
    correct_answer: 3,
    explanation: "PM-KISAN was launched on February 24, 2019 from Gorakhpur, UP by PM Narendra Modi.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India is the world's largest producer of:",
    options: ["Tea", "Wheat", "Rice", "Milk"],
    correct_answer: 3,
    explanation: "India is the world's largest producer of milk, contributing about 24% of global milk production under Operation Flood (White Revolution).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // Health & Medicine
  {
    question_text: "AIIMS (All India Institute of Medical Sciences), New Delhi was established in:",
    options: ["1952", "1956", "1960", "1964"],
    correct_answer: 1,
    explanation: "AIIMS New Delhi was established in 1956 under the AIIMS Act 1956 to serve as a centre of excellence for medical education, research, and healthcare.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India became polio-free and was certified by WHO in:",
    options: ["2012", "2014", "2016", "2018"],
    correct_answer: 1,
    explanation: "India was certified polio-free by the WHO on March 27, 2014, after recording no polio case since January 13, 2011.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Covaxin vaccine was developed by which Indian company?",
    options: ["Serum Institute of India", "Bharat Biotech", "Dr. Reddy's Labs", "Cipla"],
    correct_answer: 1,
    explanation: "Covaxin was indigenously developed by Bharat Biotech in collaboration with ICMR (Indian Council of Medical Research).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "National Immunisation Day (Pulse Polio Immunisation) is observed in India on:",
    options: ["January 18", "October 24", "March 24", "September 5"],
    correct_answer: 0,
    explanation: "Pulse Polio Immunisation Programme National Immunisation Days are held twice a year. January 18 is one of the key observance dates.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  // International Events & Geography
  {
    question_text: "Which country hosts the headquarters of the International Criminal Court (ICC)?",
    options: ["Belgium", "Netherlands", "Switzerland", "USA"],
    correct_answer: 1,
    explanation: "The International Criminal Court is headquartered in The Hague, Netherlands. It is the world's only permanent international criminal court.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Suez Canal connects the Red Sea to the:",
    options: ["Black Sea", "Caspian Sea", "Mediterranean Sea", "Arabian Sea"],
    correct_answer: 2,
    explanation: "The Suez Canal (Egypt, opened 1869) connects the Red Sea (south) to the Mediterranean Sea (north), providing the shortest sea route between Asia and Europe.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Panama Canal connects:",
    options: ["Atlantic and Pacific Oceans", "Atlantic and Indian Oceans", "Pacific and Indian Oceans", "Red Sea and Mediterranean Sea"],
    correct_answer: 0,
    explanation: "The Panama Canal connects the Atlantic Ocean and the Pacific Ocean through the Isthmus of Panama.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The world's largest ocean is:",
    options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
    correct_answer: 2,
    explanation: "The Pacific Ocean is the world's largest and deepest ocean, covering about 165 million square kilometres — more than all land combined.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Which country has the longest coastline in the world?",
    options: ["Russia", "USA", "Canada", "Australia"],
    correct_answer: 2,
    explanation: "Canada has the world's longest coastline at approximately 202,080 km, including its mainland and islands.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Indian Awards & Recognition
  {
    question_text: "The Sahitya Akademi Award is given by the Sahitya Akademi for:",
    options: ["Scientific research", "Literary contributions", "Film making", "Classical music"],
    correct_answer: 1,
    explanation: "Sahitya Akademi Award is India's second highest literary honour, given for the most outstanding book of literary merit published in any of the 24 languages recognised by Sahitya Akademi.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Shankar's International Children's Competition is an annual contest for:",
    options: ["Music", "Dance", "Children's Art", "Science projects"],
    correct_answer: 2,
    explanation: "Shankar's International Children's Competition is an annual international art competition for children, organised by Shankar's Weekly in New Delhi.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  // Governance & Reforms
  {
    question_text: "The 73rd Constitutional Amendment Act, 1992 deals with:",
    options: ["Fundamental Rights", "Panchayati Raj Institutions", "Urban Local Bodies", "Emergency Provisions"],
    correct_answer: 1,
    explanation: "The 73rd Amendment Act, 1992 gave constitutional status to Panchayati Raj Institutions and added the 11th Schedule (29 subjects for Panchayats).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The National Commission for Women (NCW) was established in:",
    options: ["1988", "1990", "1992", "1995"],
    correct_answer: 2,
    explanation: "The National Commission for Women was established in January 1992 under the NCW Act 1990 to review constitutional and legal safeguards for women.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'One District One Product' (ODOP) scheme promotes:",
    options: ["Agricultural diversity", "Local product specialisation and export", "Tourism in each district", "Industrial zones"],
    correct_answer: 1,
    explanation: "ODOP scheme (launched 2018 in UP, national 2020) aims to identify one product per district that reflects its strength and tradition, boosting local economy and exports.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Financial Intelligence Unit (FIU-IND) is responsible for:",
    options: ["Stock market regulation", "Anti-money laundering reporting", "Tax collection", "Banking supervision"],
    correct_answer: 1,
    explanation: "FIU-IND is India's central agency responsible for receiving, processing, and analysing financial transaction reports to combat money laundering and terrorism financing.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Recent News
  {
    question_text: "India launched the 'Amrit Bharat Station Scheme' to modernise:",
    options: ["100 airports", "1300+ railway stations", "500 bus terminals", "200 seaports"],
    correct_answer: 1,
    explanation: "Amrit Bharat Station Scheme aims to redevelop over 1,300 railway stations across India with modern amenities, improved facilities, and better connectivity.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's defence export target set by the government is ₹___ crore by 2025.",
    options: ["15,000", "25,000", "35,000", "50,000"],
    correct_answer: 2,
    explanation: "India set a defence export target of ₹35,000 crore (approximately $5 billion) by 2025. India's defence exports have grown significantly from under ₹2,000 crore in 2016-17.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which Indian city is known as the 'Silicon Valley of India'?",
    options: ["Hyderabad", "Pune", "Bengaluru", "Chennai"],
    correct_answer: 2,
    explanation: "Bengaluru (Bangalore) is known as the Silicon Valley of India due to its concentration of IT/software companies and startups.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The Eastern Dedicated Freight Corridor (EDFC) connects:",
    options: ["Mumbai to Kolkata", "Ludhiana to Dankuni (West Bengal)", "Delhi to Chennai", "Ahmedabad to Kolkata"],
    correct_answer: 1,
    explanation: "The Eastern Dedicated Freight Corridor runs from Ludhiana (Punjab) to Dankuni (West Bengal), spanning about 1,839 km.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's FDI (Foreign Direct Investment) in 2022-23 was approximately:",
    options: ["$30 billion", "$50 billion", "$71 billion", "$100 billion"],
    correct_answer: 2,
    explanation: "India's FDI inflow was approximately $71 billion in 2022-23, making it one of the top FDI destinations globally.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Tamil Nadu Specific 3
  {
    question_text: "The Nilgiris Biosphere Reserve in Tamil Nadu was the first biosphere reserve established in India in:",
    options: ["1979", "1986", "1990", "1988"],
    correct_answer: 1,
    explanation: "Nilgiris Biosphere Reserve was established in 1986 as India's first biosphere reserve under the UNESCO Man and Biosphere programme.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Chennai Metro Rail Phase 2 expansion is expected to add approximately ___ km of new lines.",
    options: ["50 km", "75 km", "116 km", "200 km"],
    correct_answer: 2,
    explanation: "Chennai Metro Phase 2 will add approximately 116 km of new corridors, significantly expanding connectivity across the city.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Tamil Nadu Industrial Investment Corporation (TIIC) primarily provides:",
    options: ["Agricultural loans", "Term loans to industries", "Housing loans", "Export credit"],
    correct_answer: 1,
    explanation: "TIIC is a state-level financial institution providing term loans to small, medium, and large industries in Tamil Nadu to promote industrial development.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Tamil Nadu's 'Puratchi Thalaivar Dr. MGR Scheme' for free rice is distributed through:",
    options: ["Post offices", "Public Distribution System (PDS)", "Banks", "Government hospitals"],
    correct_answer: 1,
    explanation: "Tamil Nadu distributes free rice under this scheme through the Public Distribution System (PDS) / fair price shops to eligible ration card holders.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Tamil Nadu has the highest density of:",
    options: ["Cotton mills", "IT companies", "Handloom weavers", "Auto component manufacturers"],
    correct_answer: 3,
    explanation: "Tamil Nadu (especially Chennai region) hosts the largest concentration of auto component manufacturers in India, housing over 35% of India's auto component industry.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Cauvery water dispute is primarily between Tamil Nadu and:",
    options: ["Andhra Pradesh", "Karnataka", "Kerala", "Both Karnataka and Kerala"],
    correct_answer: 1,
    explanation: "The Cauvery water dispute is primarily between Tamil Nadu and Karnataka, with minor claims from Kerala and Puducherry. The Cauvery Water Management Authority oversees distribution.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  // Miscellaneous 2
  {
    question_text: "India's PRAGATI (Pro-Active Governance And Timely Implementation) platform is used for:",
    options: ["Agricultural data", "Monitoring government projects and grievances", "Tax filing", "Defence procurement"],
    correct_answer: 1,
    explanation: "PRAGATI is a multi-purpose and multi-modal platform launched by PM Modi in 2015 to monitor key government schemes and projects and address public grievances.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which river is called the 'Sorrow of Bengal' due to frequent flooding?",
    options: ["Brahmaputra", "Damodar", "Hooghly", "Mahanadi"],
    correct_answer: 1,
    explanation: "The Damodar River is called the 'Sorrow of Bengal' due to the devastating floods it caused. The Damodar Valley Corporation (DVC) was set up to control floods.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The first Indian woman to go to space was:",
    options: ["Kalpana Chawla", "Sunita Williams", "Bachendri Pal", "P.T. Usha"],
    correct_answer: 0,
    explanation: "Kalpana Chawla was the first Indian-American woman in space, flew on STS-87 (1997). She died in the Space Shuttle Columbia disaster in 2003.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "India launched the 'Mission LiFE' (Lifestyle for Environment) at COP-26 in:",
    options: ["2019", "2020", "2021", "2022"],
    correct_answer: 2,
    explanation: "PM Modi launched Mission LiFE at the COP-26 climate summit in Glasgow in November 2021, promoting individual lifestyle changes to address climate change.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The first Census of India after independence was conducted in:",
    options: ["1947", "1951", "1956", "1961"],
    correct_answer: 1,
    explanation: "The first Census of independent India was conducted in 1951. India's Census is conducted every 10 years.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Census 2021 was postponed due to:",
    options: ["Political reasons", "Budget constraints", "COVID-19 pandemic", "Administrative issues"],
    correct_answer: 2,
    explanation: "India's Census 2021 was postponed indefinitely due to the COVID-19 pandemic. As of 2024, it has not yet been conducted.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Vibrant Gujarat Summit' is held every two years in:",
    options: ["Mumbai", "Surat", "Gandhinagar", "Ahmedabad"],
    correct_answer: 2,
    explanation: "Vibrant Gujarat Global Summit is held biennially in Gandhinagar (Gujarat's capital) to attract investment and promote industrial development.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's National Statistical Office (NSO) released the GDP estimates showing India's economy at what size in 2023-24 (nominal)?",
    options: ["₹200 lakh crore", "₹273 lakh crore", "₹300 lakh crore", "₹350 lakh crore"],
    correct_answer: 1,
    explanation: "India's GDP (at current prices) was approximately ₹273 lakh crore in 2023-24, making it the 5th largest economy globally.",
    difficulty: "hard",
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

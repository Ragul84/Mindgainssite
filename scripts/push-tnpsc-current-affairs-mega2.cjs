require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:current_affairs';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // International Organisations
  {
    question_text: "The United Nations was founded in which year?",
    options: ["1943", "1945", "1947", "1950"],
    correct_answer: 1,
    explanation: "The United Nations was founded on October 24, 1945, after World War II. It currently has 193 member states.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The headquarters of the World Trade Organisation (WTO) is in:",
    options: ["New York", "Washington D.C.", "Geneva", "Brussels"],
    correct_answer: 2,
    explanation: "The WTO headquarters is located in Geneva, Switzerland. India is a founding member of WTO (since 1995).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Who is the Secretary-General of the United Nations (2022-present)?",
    options: ["Ban Ki-moon", "Kofi Annan", "António Guterres", "Dag Hammarskjöld"],
    correct_answer: 2,
    explanation: "António Guterres of Portugal is the 9th Secretary-General of the United Nations, serving since January 1, 2017, re-elected for a second term in 2021.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The International Monetary Fund (IMF) headquarters is in:",
    options: ["Geneva", "Washington D.C.", "New York", "London"],
    correct_answer: 1,
    explanation: "The IMF headquarters is located in Washington D.C., USA. India's current quota and voting share reflect its growing economic importance.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The SAARC (South Asian Association for Regional Cooperation) was established in:",
    options: ["1980", "1985", "1990", "1995"],
    correct_answer: 1,
    explanation: "SAARC was established on December 8, 1985 in Dhaka, Bangladesh. Its headquarters is in Kathmandu, Nepal. It has 8 member countries.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The ASEAN (Association of Southeast Asian Nations) was founded in:",
    options: ["1965", "1967", "1970", "1975"],
    correct_answer: 1,
    explanation: "ASEAN was founded on August 8, 1967 in Bangkok, Thailand by the Bangkok Declaration. It now has 10 member states.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India became a full member of the Shanghai Cooperation Organisation (SCO) in:",
    options: ["2010", "2013", "2017", "2019"],
    correct_answer: 2,
    explanation: "India and Pakistan became full members of the SCO at the Astana summit on June 9, 2017.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Global South' summit was hosted by India in 2023 under what name?",
    options: ["Vasudhaiva Kutumbakam Summit", "Voice of Global South Summit", "G77 Summit", "Development Summit"],
    correct_answer: 1,
    explanation: "India hosted the 'Voice of Global South Summit' virtually in January 2023, bringing together over 120 countries to discuss priorities of developing nations.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Indian Constitution & Governance
  {
    question_text: "The Preamble to the Indian Constitution was amended in which year to add 'Socialist', 'Secular', and 'Integrity'?",
    options: ["1971", "1973", "1976", "1980"],
    correct_answer: 2,
    explanation: "The 42nd Constitutional Amendment (1976) added 'Socialist', 'Secular', and 'Integrity' to the Preamble of the Indian Constitution.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Right to Education (RTE) Act was enacted in:",
    options: ["2005", "2007", "2009", "2010"],
    correct_answer: 2,
    explanation: "The Right of Children to Free and Compulsory Education (RTE) Act was enacted in 2009 and came into force on April 1, 2010.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Article 370 of the Indian Constitution, which gave special status to Jammu & Kashmir, was abrogated in:",
    options: ["2016", "2017", "2019", "2020"],
    correct_answer: 2,
    explanation: "Article 370 was abrogated on August 5, 2019. J&K was bifurcated into two Union Territories: J&K (with legislature) and Ladakh (without legislature).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Citizenship Amendment Act (CAA) was passed by Parliament in:",
    options: ["2018", "2019", "2020", "2021"],
    correct_answer: 1,
    explanation: "The Citizenship Amendment Act was passed by Parliament in December 2019. It provides a path to Indian citizenship for non-Muslim migrants from Pakistan, Bangladesh, and Afghanistan.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'One Nation One Election' concept proposes simultaneous elections for:",
    options: ["Lok Sabha only", "Lok Sabha and Rajya Sabha", "Lok Sabha and all State Assemblies", "All elections including Panchayat"],
    correct_answer: 2,
    explanation: "One Nation One Election proposes simultaneous elections for Lok Sabha and all State Legislative Assemblies to reduce costs and disruptions.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Government of India Act that introduced dyarchy was:",
    options: ["1909 Act", "1919 Act", "1935 Act", "1947 Act"],
    correct_answer: 1,
    explanation: "The Government of India Act 1919 (Montagu-Chelmsford Reforms) introduced dyarchy in provinces, dividing subjects into 'transferred' and 'reserved'.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Economy Fundamentals
  {
    question_text: "The 'EASE of Doing Business' index is published by:",
    options: ["IMF", "World Bank", "WTO", "UNDP"],
    correct_answer: 1,
    explanation: "The Ease of Doing Business index was published by the World Bank Group. India improved significantly — from 142nd (2014) to 63rd (2020) before the index was discontinued.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first Green Budget was presented in which year?",
    options: ["2021-22", "2022-23", "2023-24", "2024-25"],
    correct_answer: 2,
    explanation: "India's Union Budget 2023-24 was the first to incorporate a green taxonomy and focused heavily on green hydrogen, energy transition, and sustainability.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The term 'Amrit Kaal' used in India's budget refers to the period:",
    options: ["2019-2024", "2022-2047", "2025-2030", "2020-2035"],
    correct_answer: 1,
    explanation: "Amrit Kaal refers to the 25-year period from 2022 to 2047 (India's centenary of independence), focused on transforming India into a developed nation.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The National Infrastructure Pipeline (NIP) project was worth approximately:",
    options: ["₹50 lakh crore", "₹100 lakh crore", "₹111 lakh crore", "₹200 lakh crore"],
    correct_answer: 2,
    explanation: "The National Infrastructure Pipeline announced in 2019 comprised infrastructure projects worth ₹111 lakh crore for 2019-2025.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first cryptocurrency regulation framework categorises crypto assets as:",
    options: ["Legal tender", "Securities", "Virtual Digital Assets (VDAs)", "Commodities"],
    correct_answer: 2,
    explanation: "India classified cryptocurrencies as Virtual Digital Assets (VDAs) in the Finance Act 2022. VDAs are taxed at 30% with 1% TDS on transfers.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Science & Technology 2
  {
    question_text: "India's PARAM Ananta supercomputer was installed at which institution?",
    options: ["IIT Delhi", "IIT Gandhinagar", "IISc Bangalore", "IIT Bombay"],
    correct_answer: 1,
    explanation: "PARAM Ananta supercomputer was installed at IIT Gandhinagar in 2022 under the National Supercomputing Mission (NSM).",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The BrahMos missile is a joint venture between India and:",
    options: ["USA", "France", "Russia", "Israel"],
    correct_answer: 2,
    explanation: "BrahMos is a joint venture between India's DRDO and Russia's NPO Mashinostroyeniya. Named after rivers Brahmaputra (India) and Moskva (Russia).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first indigenous aircraft engine 'Kaveri' was developed by:",
    options: ["HAL", "DRDO / GTRE", "NAL", "BEL"],
    correct_answer: 1,
    explanation: "The Kaveri engine was developed by DRDO's Gas Turbine Research Establishment (GTRE) in Bengaluru.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's 'Tejas' light combat aircraft was developed by:",
    options: ["HAL only", "HAL and DRDO", "DRDO only", "NAL"],
    correct_answer: 1,
    explanation: "Tejas was developed jointly by Hindustan Aeronautics Limited (HAL) and DRDO, with ADA (Aeronautical Development Agency) as the nodal agency.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first nuclear power plant was established at:",
    options: ["Kaiga", "Kudankulam", "Tarapur", "Rawatbhata"],
    correct_answer: 2,
    explanation: "Tarapur Atomic Power Station (TAPS) in Maharashtra, established in 1969, is India's first nuclear power plant.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Sports 2
  {
    question_text: "India's Lakshya Sen is associated with which sport?",
    options: ["Tennis", "Badminton", "Shooting", "Archery"],
    correct_answer: 1,
    explanation: "Lakshya Sen is an Indian badminton player who won a bronze medal at the 2022 Commonwealth Games and reached the 2023 World Championships final.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Neeraj Chopra won India's first Olympic gold in Athletics at:",
    options: ["Rio 2016", "Tokyo 2020", "Paris 2024", "Beijing 2008"],
    correct_answer: 1,
    explanation: "Neeraj Chopra won gold in javelin throw at the Tokyo 2020 Olympics (held in 2021) with a throw of 87.58m — India's first athletics Olympic gold.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Which team won the IPL 2024?",
    options: ["Mumbai Indians", "Chennai Super Kings", "Kolkata Knight Riders", "Royal Challengers Bengaluru"],
    correct_answer: 2,
    explanation: "Kolkata Knight Riders (KKR) won the IPL 2024 title, defeating Sunrisers Hyderabad in the final.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "India won the ICC T20 World Cup in 2024. Who was the captain?",
    options: ["Virat Kohli", "Rohit Sharma", "KL Rahul", "Hardik Pandya"],
    correct_answer: 1,
    explanation: "Rohit Sharma captained India to victory in the ICC T20 World Cup 2024, defeating South Africa in the final held in Barbados.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "At Paris Olympics 2024, India's Manu Bhaker became the first Indian to win two medals at a single Olympics. She won medals in:",
    options: ["Archery", "Shooting", "Wrestling", "Boxing"],
    correct_answer: 1,
    explanation: "Manu Bhaker won two bronze medals at the Paris 2024 Olympics in 10m Air Pistol (individual) and 10m Air Pistol (mixed team with Sarabjot Singh).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Deepika Kumari is famous for which sport?",
    options: ["Badminton", "Archery", "Boxing", "Weightlifting"],
    correct_answer: 1,
    explanation: "Deepika Kumari is one of India's top archers, having been ranked World No. 1 multiple times.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Arjuna Award is given for outstanding achievement in:",
    options: ["Literature", "Science", "Sports", "Arts"],
    correct_answer: 2,
    explanation: "Arjuna Award is given by the Government of India for outstanding achievement in sports over four years. It is the second highest sports honour after Rajiv Gandhi Khel Ratna (now Major Dhyan Chand Khel Ratna).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The Major Dhyan Chand Khel Ratna Award (formerly Rajiv Gandhi Khel Ratna) is India's highest sporting honour. Which legendary hockey player's name it now bears?",
    options: ["Milkha Singh", "Major Dhyan Chand", "Sunil Gavaskar", "P.T. Usha"],
    correct_answer: 1,
    explanation: "The award was renamed in 2021 to Major Dhyan Chand Khel Ratna in honour of the legendary Indian hockey player Major Dhyan Chand.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Infrastructure & Urban Development
  {
    question_text: "India's longest expressway is the:",
    options: ["Yamuna Expressway", "Purvanchal Expressway", "Agra-Lucknow Expressway", "Delhi-Mumbai Expressway"],
    correct_answer: 3,
    explanation: "The Delhi-Mumbai Expressway (DMIC corridor), when complete, will be India's longest expressway at about 1,350 km.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's first underwater metro tunnel is in which city?",
    options: ["Mumbai", "Chennai", "Kolkata", "Bengaluru"],
    correct_answer: 2,
    explanation: "Kolkata Metro has India's first underwater tunnel under the Hooghly River, inaugurated in March 2024 on the East-West Metro corridor.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The PM Gati Shakti National Master Plan aims to improve:",
    options: ["Agricultural productivity", "Multi-modal connectivity infrastructure", "Urban water supply", "Digital literacy"],
    correct_answer: 1,
    explanation: "PM Gati Shakti is a digital platform to bring 16 Ministries together for integrated planning of multi-modal infrastructure (roads, railways, ports, airports, waterways).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first bullet train project connects:",
    options: ["Delhi and Agra", "Mumbai and Ahmedabad", "Bengaluru and Chennai", "Hyderabad and Pune"],
    correct_answer: 1,
    explanation: "India's first High Speed Rail (bullet train) project is the Mumbai–Ahmedabad High Speed Rail Corridor, developed with Japan's collaboration using Shinkansen technology.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // Environment & Conservation
  {
    question_text: "India's Biosphere Reserves are recognised by:",
    options: ["IUCN", "UNESCO Man and Biosphere Programme", "WWF", "CITES"],
    correct_answer: 1,
    explanation: "India's Biosphere Reserves are recognised under UNESCO's Man and Biosphere (MAB) Programme. India has 18 biosphere reserves, of which 12 are in the UNESCO World Network.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Cheetah reintroduction in India was done at which national park in 2022?",
    options: ["Jim Corbett National Park", "Kuno National Park", "Bandhavgarh Tiger Reserve", "Gir Forest"],
    correct_answer: 1,
    explanation: "Cheetahs (from Namibia and South Africa) were reintroduced at Kuno National Park in Madhya Pradesh on September 17, 2022 under Project Cheetah.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Ramsar Convention is related to:",
    options: ["Endangered species", "Wetlands conservation", "Marine pollution", "Biodiversity hotspots"],
    correct_answer: 1,
    explanation: "The Ramsar Convention (1971) is an international treaty for the conservation and sustainable use of wetlands. India has over 75 Ramsar sites.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'Green Credit Programme' was launched under the:",
    options: ["Energy Conservation Act 2022", "Environment Protection Act", "Wildlife Protection Act", "Forest Conservation Act"],
    correct_answer: 0,
    explanation: "The Green Credit Programme was notified under the Environment Protection Act 1986, but is an initiative announced under Energy Conservation (Amendment) Act 2022.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Social Schemes
  {
    question_text: "The 'Beti Bachao Beti Padhao' scheme was launched from which state?",
    options: ["Haryana", "Rajasthan", "Uttar Pradesh", "Punjab"],
    correct_answer: 0,
    explanation: "'Beti Bachao Beti Padhao' was launched on January 22, 2015 from Panipat, Haryana, targeting districts with low Child Sex Ratio.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The PM Ujjwala Yojana provides free LPG connections to:",
    options: ["All households", "BPL women", "Farmers", "Tribal communities only"],
    correct_answer: 1,
    explanation: "PM Ujjwala Yojana was launched on May 1, 2016 to provide free LPG connections to women from Below Poverty Line (BPL) households.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The AMRUT (Atal Mission for Rejuvenation and Urban Transformation) scheme focuses on:",
    options: ["Rural roads", "Urban water, sewage, and parks", "Digital literacy", "Agricultural infrastructure"],
    correct_answer: 1,
    explanation: "AMRUT focuses on providing basic urban services including water supply, sewerage, urban transport, and parks in 500 selected cities.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Smart Cities Mission was launched in:",
    options: ["2014", "2015", "2016", "2017"],
    correct_answer: 1,
    explanation: "Smart Cities Mission was launched on June 25, 2015 to develop 100 smart cities across India with citizen-friendly infrastructure and services.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Stand Up India' scheme provides loans to:",
    options: ["Small businesses only", "SC/ST and women entrepreneurs", "Farmers", "Students"],
    correct_answer: 1,
    explanation: "Stand Up India facilitates bank loans between ₹10 lakh and ₹1 crore to at least one SC/ST borrower and one woman borrower per bank branch for setting up greenfield enterprises.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Important Days & Years
  {
    question_text: "January 30 is observed as:",
    options: ["National Science Day", "Martyrs' Day", "National Youth Day", "Republic Day"],
    correct_answer: 1,
    explanation: "January 30 is observed as Martyrs' Day (Shaheed Diwas) to mark the assassination of Mahatma Gandhi in 1948.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "World Environment Day is observed on:",
    options: ["April 22", "June 5", "October 16", "December 11"],
    correct_answer: 1,
    explanation: "World Environment Day is observed on June 5 every year, established by the United Nations Environment Programme (UNEP).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "National Science Day is celebrated on February 28 to commemorate the discovery of:",
    options: ["Periodic Table", "Raman Effect", "Bose-Einstein Condensate", "Nuclear Fission"],
    correct_answer: 1,
    explanation: "National Science Day is observed on February 28 to commemorate the discovery of the Raman Effect by Sir C.V. Raman in 1928, for which he won the Nobel Prize in 1930.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "2024 is the year India celebrates ___ years of independence.",
    options: ["75", "77", "78", "80"],
    correct_answer: 2,
    explanation: "India celebrated 78 years of independence on August 15, 2024.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The UN Sustainable Development Goals (SDGs) aim to be achieved by:",
    options: ["2025", "2030", "2035", "2040"],
    correct_answer: 1,
    explanation: "The 17 Sustainable Development Goals (SDGs) were adopted in 2015 and aim to be achieved by 2030 as part of the 2030 Agenda for Sustainable Development.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Books & Authors
  {
    question_text: "Who wrote 'India: A Million Mutinies Now'?",
    options: ["Amitav Ghosh", "V.S. Naipaul", "Salman Rushdie", "Vikram Seth"],
    correct_answer: 1,
    explanation: "V.S. Naipaul wrote 'India: A Million Mutinies Now' (1990). He won the Nobel Prize in Literature in 2001.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Who is the author of 'The White Tiger' which won the Booker Prize?",
    options: ["Arundhati Roy", "Kiran Desai", "Aravind Adiga", "Vikram Seth"],
    correct_answer: 2,
    explanation: "Aravind Adiga won the Man Booker Prize in 2008 for 'The White Tiger'. It was his debut novel.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Who wrote 'Arthashastra', an ancient Indian treatise on statecraft and economic policy?",
    options: ["Manu", "Chanakya (Kautilya)", "Valmiki", "Vyasa"],
    correct_answer: 1,
    explanation: "Arthashastra was written by Chanakya (also known as Kautilya or Vishnugupta), the adviser to Emperor Chandragupta Maurya.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Recent Events
  {
    question_text: "India's mission to Venus, 'Shukrayaan', is planned for:",
    options: ["2026", "2028", "2031", "2035"],
    correct_answer: 2,
    explanation: "ISRO's Venus mission Shukrayaan-1 is planned for 2031, when Earth and Venus will be in optimal orbital alignment.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India signed the Global Biofuels Alliance (GBA) during the G20 summit in 2023. It was co-founded with:",
    options: ["USA and EU", "USA and Brazil", "UK and Japan", "Saudi Arabia and China"],
    correct_answer: 1,
    explanation: "India, USA, and Brazil co-founded the Global Biofuels Alliance (GBA) at the G20 summit in New Delhi in September 2023.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'ONDC' (Open Network for Digital Commerce) aims to:",
    options: ["Create a government e-commerce platform", "Democratise digital commerce through open protocols", "Regulate cryptocurrency trading", "Digitise government procurement"],
    correct_answer: 1,
    explanation: "ONDC is an initiative to democratise e-commerce by creating open, interoperable protocols — allowing buyers and sellers on different platforms to transact.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's GeM (Government e-Marketplace) platform is used for:",
    options: ["Public procurement by government departments", "Export promotion", "Agricultural market linkage", "Tourism booking"],
    correct_answer: 0,
    explanation: "GeM is a one-stop portal for public procurement by Central and State government departments, PSUs, and autonomous bodies.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Aspirational Districts Programme' was renamed to 'Aspirational Districts and Blocks Programme' in which year?",
    options: ["2020", "2021", "2022", "2023"],
    correct_answer: 3,
    explanation: "The Aspirational Districts Programme (2018) was expanded to Aspirational Blocks Programme in 2023, covering 500 blocks across India for focused development.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Tamil Nadu Specific 2
  {
    question_text: "The Tamil Nadu government's 'Illam Thedi Kalvi' scheme is related to:",
    options: ["Housing for poor", "Evening coaching for students at doorstep", "Farmers' loan waiver", "Free health checkups"],
    correct_answer: 1,
    explanation: "Illam Thedi Kalvi (Education at Doorstep) is a Tamil Nadu scheme that provides evening education support to students aged 6-14 through trained volunteers at nearby locations.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Which Tamil Nadu district became India's first to be fully digitally literate?",
    options: ["Chennai", "Coimbatore", "Erode", "Tiruvannamalai"],
    correct_answer: 1,
    explanation: "Coimbatore was among the early districts in Tamil Nadu with high digital literacy levels. However, specific 'first' claims vary by source.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Tamil Nadu government's 'Murasoli' is:",
    options: ["A flagship welfare scheme", "Official publication of DMK party", "A cultural festival", "A sports programme"],
    correct_answer: 1,
    explanation: "Murasoli is the official publication (newspaper) of the Dravida Munnetra Kazhagam (DMK) party, Tamil Nadu. It was founded by M. Karunanidhi.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The headquarters of the Southern Railway zone is in:",
    options: ["Bengaluru", "Hyderabad", "Chennai", "Coimbatore"],
    correct_answer: 2,
    explanation: "The headquarters of Southern Railway zone is in Chennai (Madras). It covers Tamil Nadu, Kerala, parts of Andhra Pradesh, and Puducherry.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Tamil Nadu's 'Kalaignar Karunanidhi' was cremated at:",
    options: ["Rajaji Hall", "Marina Beach", "Anna Memorial", "Government Estate"],
    correct_answer: 1,
    explanation: "M. Karunanidhi (Kalaignar), former CM of Tamil Nadu who passed away on August 7, 2018, was cremated at Marina Beach, Chennai with full state honours.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Vande Bharat Express connecting Chennai and Mysuru via Bengaluru was launched in:",
    options: ["2022", "2023", "2024", "2021"],
    correct_answer: 1,
    explanation: "The Vande Bharat Express between Chennai and Mysuru was launched in November 2022 as part of expanding high-speed rail services in South India.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  // Miscellaneous
  {
    question_text: "India's first drone delivery service for medical supplies was launched in:",
    options: ["Andaman & Nicobar", "Meghalaya", "Uttarakhand", "Arunachal Pradesh"],
    correct_answer: 1,
    explanation: "India's first medical drone delivery service ('Medicine from the Sky') was launched in Meghalaya in 2022 to reach remote areas.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The 'India Stack' refers to a set of open APIs including:",
    options: ["AI tools", "Aadhaar, UPI, DigiLocker, Account Aggregator", "Cloud computing services", "Defence technologies"],
    correct_answer: 1,
    explanation: "India Stack refers to the suite of open digital infrastructure including Aadhaar (identity), UPI (payments), DigiLocker (documents), and Account Aggregator (financial data sharing).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Digital Rupee' (e-RUPI) launched by India is a:",
    options: ["Cryptocurrency", "Central Bank Digital Currency (CBDC)", "Mobile payment app", "Stablecoin"],
    correct_answer: 1,
    explanation: "The Digital Rupee is India's Central Bank Digital Currency (CBDC) issued by the Reserve Bank of India (RBI), launched in pilot form in 2022.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which organisation releases the 'Human Development Index (HDI)'?",
    options: ["World Bank", "IMF", "UNDP", "WEF"],
    correct_answer: 2,
    explanation: "The Human Development Index (HDI) is published by the United Nations Development Programme (UNDP) in its annual Human Development Report.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "India's rank in the 2023 Human Development Index (HDI) was:",
    options: ["126", "132", "140", "150"],
    correct_answer: 1,
    explanation: "India ranked 134th in the 2023/2024 Human Development Report (HDI value 0.644), placing it in the medium human development category.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Global Hunger Index 2023' ranked India at:",
    options: ["107th", "111th", "105th", "118th"],
    correct_answer: 1,
    explanation: "India ranked 111th out of 125 countries in the Global Hunger Index 2023, with a score indicating 'serious' hunger levels. India has contested the index's methodology.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Pradhan Mantri Awas Yojana – Urban' aims to provide housing for all in urban areas by:",
    options: ["2022", "2024", "2025", "2030"],
    correct_answer: 2,
    explanation: "PMAY-Urban was launched in 2015 with the original target of 'Housing for All by 2022', subsequently extended to 2025.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Semiconductor chip used in most smartphones uses which technology node (as of 2024)?",
    options: ["28nm", "10nm", "3-5nm", "1nm"],
    correct_answer: 2,
    explanation: "Modern flagship smartphones in 2024 use chips built on 3nm or 4nm process nodes (TSMC N3, Samsung 3GAP), with 5nm also widely in use.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's International Year of Millets (IYoM) celebration was in:",
    options: ["2022", "2023", "2024", "2021"],
    correct_answer: 1,
    explanation: "2023 was declared the International Year of Millets (IYoM 2023) by the United Nations at India's initiative. India is the world's largest producer of millets.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India ratified UNCLOS (UN Convention on the Law of the Sea) in which year?",
    options: ["1982", "1995", "2000", "India has not ratified"],
    correct_answer: 1,
    explanation: "India ratified UNCLOS in 1995. UNCLOS defines the rights and responsibilities of nations with respect to their use of the world's oceans.",
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

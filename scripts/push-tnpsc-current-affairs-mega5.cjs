require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:current_affairs';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // Indian History
  {
    question_text: "The Battle of Plassey (1757) was fought between the British East India Company and:",
    options: ["Tipu Sultan", "Siraj-ud-Daulah", "Hyder Ali", "Nizam of Hyderabad"],
    correct_answer: 1,
    explanation: "The Battle of Plassey (June 23, 1757) was fought between Robert Clive's British forces and Siraj-ud-Daulah, Nawab of Bengal. The British victory marked the beginning of British rule in India.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Sepoy Mutiny (First War of Independence) occurred in:",
    options: ["1847", "1857", "1867", "1877"],
    correct_answer: 1,
    explanation: "The Indian Rebellion of 1857 (also called the Sepoy Mutiny or First War of Independence) began on May 10, 1857 in Meerut.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Jallianwala Bagh massacre occurred in which year?",
    options: ["1915", "1917", "1919", "1921"],
    correct_answer: 2,
    explanation: "The Jallianwala Bagh massacre occurred on April 13, 1919 (Baisakhi Day) when General Dyer ordered troops to fire on a peaceful gathering in Amritsar, killing hundreds.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Indian Independence Act was passed by the British Parliament in:",
    options: ["June 1947", "July 1947", "August 1947", "September 1947"],
    correct_answer: 1,
    explanation: "The Indian Independence Act was passed on July 18, 1947, providing for the partition of British India into two independent dominions — India and Pakistan — effective August 15, 1947.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Who is known as the 'Iron Man of India'?",
    options: ["Jawaharlal Nehru", "Subhas Chandra Bose", "Sardar Vallabhbhai Patel", "Bal Gangadhar Tilak"],
    correct_answer: 2,
    explanation: "Sardar Vallabhbhai Patel is known as the 'Iron Man of India' for his role in integrating over 500 princely states into the Indian Union after independence.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Constitution of India came into effect on:",
    options: ["August 15, 1947", "November 26, 1949", "January 26, 1950", "March 1, 1950"],
    correct_answer: 2,
    explanation: "The Constitution of India came into force on January 26, 1950. November 26, 1949 was the date it was adopted, now celebrated as Constitution Day.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // Economy 2
  {
    question_text: "India's Insolvency and Bankruptcy Board of India (IBBI) was established in:",
    options: ["2014", "2016", "2018", "2020"],
    correct_answer: 1,
    explanation: "IBBI was established on October 1, 2016 under the Insolvency and Bankruptcy Code 2016 to regulate insolvency professionals, insolvency professional agencies, and information utilities.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Minimum Support Price (MSP) for crops in India is recommended by:",
    options: ["NABARD", "CACP", "FCI", "Ministry of Agriculture"],
    correct_answer: 1,
    explanation: "The Commission for Agricultural Costs and Prices (CACP), under the Ministry of Agriculture, recommends MSP for various crops to the Government of India.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Operation Flood launched by Verghese Kurien transformed India into the world's largest milk producer. This is also known as:",
    options: ["White Revolution", "Yellow Revolution", "Green Revolution", "Blue Revolution"],
    correct_answer: 0,
    explanation: "Operation Flood (1970-1996) by NDDB and AMUL is called the White Revolution. Verghese Kurien is known as the 'Father of the White Revolution.'",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Blue Revolution in India is related to:",
    options: ["Water conservation", "Fish and aquaculture development", "Sky observation", "River cleaning"],
    correct_answer: 1,
    explanation: "Blue Revolution refers to the rapid development of fisheries and aquaculture sector in India, aiming to double fish production and increase exports.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Science
  {
    question_text: "The discovery of the Higgs Boson ('God Particle') was announced in:",
    options: ["2010", "2012", "2014", "2016"],
    correct_answer: 1,
    explanation: "The discovery of the Higgs boson was announced at CERN on July 4, 2012. Peter Higgs and François Englert won the Nobel Prize in Physics in 2013 for this.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which Indian institution developed the Covaxin vaccine against COVID-19?",
    options: ["AIIMS", "ICMR", "Bharat Biotech", "Serum Institute"],
    correct_answer: 2,
    explanation: "Covaxin was developed by Bharat Biotech in collaboration with ICMR-NIV (National Institute of Virology) using inactivated virus technology.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which country was the first to sequence the human genome?",
    options: ["USA", "The Human Genome Project was international", "UK", "Germany"],
    correct_answer: 1,
    explanation: "The Human Genome Project (HGP) was an international effort involving the USA, UK, France, Germany, Japan, and China. It was completed in 2003.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "DRDO (Defence Research and Development Organisation) was established in:",
    options: ["1948", "1953", "1958", "1962"],
    correct_answer: 2,
    explanation: "DRDO was established in 1958 by merging the Technical Development Establishment and the Directorate of Technical Development & Production with the Defence Science Organisation.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Geography 2
  {
    question_text: "Which state has the longest coastline in India?",
    options: ["Tamil Nadu", "Andhra Pradesh", "Gujarat", "Maharashtra"],
    correct_answer: 2,
    explanation: "Gujarat has the longest coastline in India at approximately 1,600 km, including the Saurashtra and Kutch peninsulas.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Bhor Ghat and Thal Ghat are mountain passes in:",
    options: ["Kerala", "Maharashtra", "Karnataka", "Tamil Nadu"],
    correct_answer: 1,
    explanation: "Bhor Ghat (Khopoli) and Thal Ghat (Kasara) are railway passes in the Western Ghats of Maharashtra.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Chilika Lake,' a Ramsar site, is located in:",
    options: ["Andhra Pradesh", "Odisha", "West Bengal", "Gujarat"],
    correct_answer: 1,
    explanation: "Chilika Lake in Odisha is Asia's largest brackish water lake and India's largest Ramsar site. It is known for migratory birds and Irrawaddy dolphins.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's southernmost point is:",
    options: ["Kanya Kumari", "Indira Point (Great Nicobar)", "Minicoy Island", "Calimere Point"],
    correct_answer: 1,
    explanation: "Indira Point (Pygmalion Point) in Great Nicobar Island is India's southernmost point at 6°45'N latitude.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Palk Strait separates India from:",
    options: ["Maldives", "Sri Lanka", "Myanmar", "Bangladesh"],
    correct_answer: 1,
    explanation: "The Palk Strait is a narrow stretch of water separating Tamil Nadu (India) from the Northern Province of Sri Lanka.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Polity 2
  {
    question_text: "The National Emergency can be proclaimed by the President under Article:",
    options: ["352", "356", "360", "370"],
    correct_answer: 0,
    explanation: "Article 352 deals with National Emergency (on grounds of war, external aggression, or armed rebellion). Article 356 is President's Rule; Article 360 is Financial Emergency.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Comptroller and Auditor General (CAG) of India is appointed by:",
    options: ["Parliament", "Prime Minister", "President", "Finance Minister"],
    correct_answer: 2,
    explanation: "The CAG of India is appointed by the President of India. The CAG audits government accounts and submits reports to Parliament.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which article of the Indian Constitution abolishes untouchability?",
    options: ["Article 14", "Article 17", "Article 21", "Article 25"],
    correct_answer: 1,
    explanation: "Article 17 of the Indian Constitution abolishes 'untouchability' and forbids its practice in any form. The Protection of Civil Rights Act 1955 enforces this.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The term 'secular' was added to the Indian Constitution's Preamble by the ___ Amendment.",
    options: ["38th", "42nd", "44th", "52nd"],
    correct_answer: 1,
    explanation: "The 42nd Amendment Act 1976 (under Emergency, PM Indira Gandhi) added 'Socialist' and 'Secular' to the Preamble.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Under which article can the President of India exercise his/her pardon power?",
    options: ["Article 72", "Article 74", "Article 80", "Article 86"],
    correct_answer: 0,
    explanation: "Article 72 grants the President the power to grant pardons, reprieves, respites, or remissions of punishment to persons convicted of offences.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // International Affairs 2
  {
    question_text: "The World Health Organisation (WHO) headquarters is in:",
    options: ["New York", "Geneva", "London", "Paris"],
    correct_answer: 1,
    explanation: "The WHO headquarters is in Geneva, Switzerland. It was established on April 7, 1948 (now observed as World Health Day).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The OPEC (Organisation of Petroleum Exporting Countries) headquarters is in:",
    options: ["Riyadh", "Dubai", "Vienna", "Geneva"],
    correct_answer: 2,
    explanation: "OPEC headquarters is in Vienna, Austria. OPEC was founded in 1960 by Iraq, Iran, Kuwait, Saudi Arabia, and Venezuela.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The NATO headquarters is located in:",
    options: ["Washington D.C.", "London", "Brussels", "Paris"],
    correct_answer: 2,
    explanation: "NATO (North Atlantic Treaty Organisation) headquarters is in Brussels, Belgium. NATO was founded in 1949.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The COP29 climate summit in 2024 was held in:",
    options: ["Dubai", "Bonn", "Baku, Azerbaijan", "Nairobi"],
    correct_answer: 2,
    explanation: "COP29 was held in Baku, Azerbaijan in November 2024. A key outcome was the New Collective Quantified Goal (NCQG) on climate finance.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's relationship with the USA is described as a '___ Strategic Partnership.'",
    options: ["Allied", "Global", "Comprehensive", "Privileged"],
    correct_answer: 2,
    explanation: "India and the USA have a 'Comprehensive Global Strategic Partnership,' elevated from 'Strategic Partnership' (2004) at the June 2023 state visit.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Sports 3
  {
    question_text: "The Indian Premier League (IPL) was founded in which year?",
    options: ["2005", "2007", "2008", "2010"],
    correct_answer: 2,
    explanation: "IPL was founded by the BCCI in 2008. The inaugural season was played in 2008, with Rajasthan Royals winning the first title.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Who won the most ICC World Test Championship (WTC) Finals as of 2024?",
    options: ["India", "New Zealand", "Australia", "England"],
    correct_answer: 2,
    explanation: "Australia won the ICC World Test Championship 2023 Final, defeating India. New Zealand won the inaugural WTC 2021. Australia also won WTC 2025.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's Vinesh Phogat is associated with which sport?",
    options: ["Boxing", "Judo", "Wrestling", "Kabaddi"],
    correct_answer: 2,
    explanation: "Vinesh Phogat is an Indian freestyle wrestler who became the first Asian woman wrestler to be ranked World No.1.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The 2022 Commonwealth Games were held in:",
    options: ["Melbourne", "Manchester", "Birmingham", "London"],
    correct_answer: 2,
    explanation: "The 2022 Commonwealth Games (XXII) were held in Birmingham, England from July 28 to August 8, 2022.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Who won the Ballon d'Or 2023 for the best footballer?",
    options: ["Kylian Mbappé", "Erling Haaland", "Lionel Messi", "Cristiano Ronaldo"],
    correct_answer: 2,
    explanation: "Lionel Messi won his record 8th Ballon d'Or in October 2023, after leading Argentina to the 2022 FIFA World Cup victory.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  // Environment 3
  {
    question_text: "The Ozone Layer is found in:",
    options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
    correct_answer: 1,
    explanation: "The ozone layer is found in the Stratosphere, approximately 15-35 km above Earth's surface. It absorbs harmful UV-B and UV-C radiation.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Montreal Protocol (1987) was adopted to protect:",
    options: ["Marine species", "Forests", "Ozone Layer", "Freshwater resources"],
    correct_answer: 2,
    explanation: "The Montreal Protocol (1987) is an international treaty to phase out substances that deplete the ozone layer (CFCs, halons, etc.). It is the most successful environmental treaty.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'Panchamrit' commitments at COP26 include becoming net-zero by:",
    options: ["2040", "2047", "2050", "2070"],
    correct_answer: 3,
    explanation: "India's Panchamrit commitments at COP26 (2021) include achieving net-zero carbon emissions by 2070.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Convention on Biological Diversity (CBD) is the framework for:",
    options: ["Wildlife trade", "Conservation of biodiversity, sustainable use, benefit sharing", "Ocean protection", "Climate change"],
    correct_answer: 1,
    explanation: "CBD (1992, Rio Earth Summit) addresses conservation of biological diversity, sustainable use of its components, and fair sharing of benefits from genetic resources.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Project Elephant was launched in which year?",
    options: ["1991", "1992", "1995", "1997"],
    correct_answer: 1,
    explanation: "Project Elephant was launched in 1992 to protect elephants and their habitat. India has the world's largest Asian elephant population.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Key Recent Developments
  {
    question_text: "India's 'PM eBus Sewa' scheme aims to introduce electric buses in how many cities?",
    options: ["50", "100", "169", "200"],
    correct_answer: 2,
    explanation: "PM-eBus Sewa scheme (launched 2023) aims to augment city bus operations with 10,000 electric buses in 169 cities that don't have an organised bus service.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Agnipath' scheme is for recruitment into:",
    options: ["Paramilitary forces", "Armed forces (Army, Navy, Air Force)", "Police forces", "CRPF and BSF"],
    correct_answer: 1,
    explanation: "Agnipath scheme (2022) is for short-term (4-year) recruitment of youth (17.5-21 years) into the Indian Armed Forces as Agniveers.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first female fighter pilot is:",
    options: ["Avani Chaturvedi", "Bhawana Kanth", "Mohana Singh", "All three together were first"],
    correct_answer: 3,
    explanation: "Avani Chaturvedi, Bhawana Kanth, and Mohana Singh were the first three women to become fighter pilots in the Indian Air Force in 2016.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'Scheme for Special Assistance to States for Capital Investment' provides loans to states for:",
    options: ["Social welfare", "Capital expenditure", "Revenue expenditure", "Debt repayment"],
    correct_answer: 1,
    explanation: "This scheme provides 50-year interest-free loans to states for capital expenditure, encouraging infrastructure creation and economic growth.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Tamil Nadu 4
  {
    question_text: "The Tamil Nadu Uniform System of School Education (TNUS) aims to:",
    options: ["Eliminate private schools", "Common curriculum across all school types in TN", "Free education only for girls", "Convert all schools to English medium"],
    correct_answer: 1,
    explanation: "TNUS aims to implement a common curriculum and uniform system across all types of schools in Tamil Nadu (government, private, aided).",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Mettur Dam is built across which river?",
    options: ["Vaigai", "Tamirabarani", "Cauvery", "Palar"],
    correct_answer: 2,
    explanation: "Mettur Dam (Stanley Reservoir) is built across the Cauvery River in Salem district, Tamil Nadu. It is one of the largest dams in India.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "TANGEDCO stands for:",
    options: ["Tamil Nadu Goods and Electricity Corporation", "Tamil Nadu Generation and Distribution Corporation", "Tamil Nadu Government Education Corporation", "Tamil Nadu General Electricity Company"],
    correct_answer: 1,
    explanation: "TANGEDCO stands for Tamil Nadu Generation and Distribution Corporation Limited, the state electricity company.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Tamil Nadu's highest peak Doddabetta is in:",
    options: ["Palani Hills", "Kodaikanal", "Nilgiris", "Anaimalai"],
    correct_answer: 2,
    explanation: "Doddabetta (2,637 m) is the highest peak in Tamil Nadu, located in the Nilgiri Hills near Ooty (Udhagamandalam).",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Coimbatore is known as the 'Manchester of South India' due to its:",
    options: ["IT industry", "Textile industry", "Steel industry", "Automobile industry"],
    correct_answer: 1,
    explanation: "Coimbatore is known as the 'Manchester of South India' due to its large textile and spinning mill industry.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  // Miscellaneous 3
  {
    question_text: "The 'Index of Industrial Production (IIP)' in India is released by:",
    options: ["SEBI", "RBI", "National Statistical Office (NSO)", "Ministry of Finance"],
    correct_answer: 2,
    explanation: "IIP is released by the National Statistical Office (NSO) under the Ministry of Statistics and Programme Implementation (MOSPI).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Wholesale Price Index (WPI) is released by:",
    options: ["RBI", "NSO", "Ministry of Commerce and Industry", "DIPP"],
    correct_answer: 2,
    explanation: "The WPI is released by the Office of the Economic Adviser under the Ministry of Commerce and Industry.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Consumer Price Index (CPI) in India is released by:",
    options: ["RBI", "NSO / MOSPI", "Ministry of Finance", "Planning Commission"],
    correct_answer: 1,
    explanation: "The CPI is released by the National Statistical Office (NSO) under MOSPI. RBI uses CPI as the primary measure for its monetary policy.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which country has the largest number of UNESCO World Heritage Sites?",
    options: ["India", "China", "Italy", "France"],
    correct_answer: 2,
    explanation: "Italy has the most UNESCO World Heritage Sites (58 as of 2023), followed by China (57). India has 42 World Heritage Sites.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 42nd UNESCO World Heritage Site (2023) is:",
    options: ["Sangam Age Sculptures", "Hoysala Temples", "Cheddi Hills", "Ariyalur Fossil Park"],
    correct_answer: 1,
    explanation: "The Hoysala Sacred Ensembles (temples at Belur, Halebid, Somnathapura in Karnataka) were inscribed as India's 42nd UNESCO World Heritage Site in 2023.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "G7 consists of which countries?",
    options: ["USA, UK, France, Germany, Japan, Italy, Canada", "USA, UK, Russia, France, Germany, Japan, China", "USA, UK, France, Germany, Japan, India, Canada", "USA, UK, France, Italy, Spain, Japan, Canada"],
    correct_answer: 0,
    explanation: "G7 consists of Canada, France, Germany, Italy, Japan, United Kingdom, and the United States. The EU also participates. Russia was suspended in 2014.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's UDAN scheme (Ude Desh ka Aam Nagrik) aims to:",
    options: ["Provide free flights to poor", "Develop regional air connectivity", "Build new airports", "Subsidise aviation fuel"],
    correct_answer: 1,
    explanation: "UDAN (Regional Connectivity Scheme) launched in 2016 aims to connect smaller cities and towns with affordable flights, operationalising unserved and underserved airstrips.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Jal Jeevan Mission' aims to provide:",
    options: ["Irrigation to all farms", "Tap water to all rural households by 2024", "Water treatment plants in cities", "Flood management"],
    correct_answer: 1,
    explanation: "Jal Jeevan Mission (launched 2019) aims to provide safe and adequate drinking water through individual household tap connections to all rural households by 2024.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Ease of Doing Business Reforms led to India rising from rank 142 in 2014 to ___ in the 2020 World Bank EODB Index.",
    options: ["50", "63", "72", "85"],
    correct_answer: 1,
    explanation: "India's ranking in World Bank's Ease of Doing Business Index improved from 142nd (2014) to 63rd (2020), a jump of 79 positions.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'PM Surya Ghar: Muft Bijli Yojana' offers free solar power up to ___ units per month.",
    options: ["100", "200", "300", "500"],
    correct_answer: 2,
    explanation: "PM Surya Ghar: Muft Bijli Yojana (2024) provides rooftop solar subsidies to households, aimed at providing 300 units of electricity free per month.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Net Enrolment Ratio (NER) in elementary education is now above:",
    options: ["85%", "90%", "95%", "99%"],
    correct_answer: 2,
    explanation: "India's Net Enrolment Ratio (NER) in elementary education has crossed 95%, reflecting near-universal access to primary and upper primary education.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Key Organisations
  {
    question_text: "India's NCERT (National Council of Educational Research and Training) was established in:",
    options: ["1958", "1961", "1964", "1970"],
    correct_answer: 1,
    explanation: "NCERT was established on September 1, 1961 to advise the central and state governments on educational policies and develop national curriculum frameworks.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "NABARD (National Bank for Agriculture and Rural Development) was established in:",
    options: ["1975", "1978", "1982", "1985"],
    correct_answer: 2,
    explanation: "NABARD was established on July 12, 1982 on the recommendation of the Shivaraman Committee. It provides credit and development support for agriculture.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "SIDBI (Small Industries Development Bank of India) provides financial support to:",
    options: ["Large corporations", "Micro, Small and Medium Enterprises (MSMEs)", "Agricultural sector", "Export units only"],
    correct_answer: 1,
    explanation: "SIDBI (established 1990) is the principal institution for promotion, financing, and development of the MSME sector in India.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Central Board of Direct Taxes (CBDT) operates under the:",
    options: ["RBI", "Ministry of Finance (CBDT is a statutory body)", "SEBI", "Ministry of Corporate Affairs"],
    correct_answer: 1,
    explanation: "CBDT is a statutory authority functioning under the Ministry of Finance. It provides inputs for policy and planning related to direct taxes and administers direct tax laws.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Union Public Service Commission (UPSC) conducts which of the following exams?",
    options: ["JEE and NEET", "Civil Services Examination (IAS/IPS/IFS)", "Banking exams", "Railway exams"],
    correct_answer: 1,
    explanation: "UPSC conducts the Civil Services Examination for recruitment to IAS, IPS, IFS, and other Central Services. It was established under Article 315 of the Constitution.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Recent Events 2
  {
    question_text: "India's G20 presidency theme 'Vasudhaiva Kutumbakam' means:",
    options: ["Truth is God", "Unity in Diversity", "One Earth, One Family, One Future", "Service before Self"],
    correct_answer: 2,
    explanation: "'Vasudhaiva Kutumbakam' is a Sanskrit phrase from Maha Upanishad meaning 'the world is one family.' India's G20 theme expanded this to 'One Earth, One Family, One Future.'",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India launched 'Global Cooperation for Infrastructure and Investment' (GCII) rival to China's Belt and Road Initiative at:",
    options: ["G20 2023", "G7 2022", "BRICS 2023", "SCO 2023"],
    correct_answer: 1,
    explanation: "The G7 Partnership for Global Infrastructure and Investment (PGII) was launched at the G7 Elmau summit in June 2022 as a democratic alternative to China's BRI.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's highest literary honour for Tamil language is the:",
    options: ["Sahitya Akademi Award", "Jnanpith Award", "Kalaimamani Award", "Thiruvalluvar Award"],
    correct_answer: 1,
    explanation: "The Jnanpith Award is India's highest literary honour. For Tamil, eminent recipients include G.U. Pope, T.S. Pillai (Thakazhi), and U.V. Swaminatha Iyer. The Sahitya Akademi Award is also prestigious.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The 'Tamil Nadu Police Mission' was launched to:",
    options: ["Recruit more police", "Modernise and reform police functioning", "Create district police academies", "Increase female police"],
    correct_answer: 1,
    explanation: "Tamil Nadu Police Mission focuses on modernisation, community policing, and reforms to improve law enforcement effectiveness in the state.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India became the world's most populous country in:",
    options: ["2020", "2021", "2022", "2023"],
    correct_answer: 3,
    explanation: "India surpassed China to become the world's most populous country in April 2023, according to UN estimates.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Pradhan Mantri Fasal Bima Yojana (PMFBY) provides:",
    options: ["Crop loans", "Crop insurance to farmers", "Free seeds to farmers", "Agricultural machinery subsidy"],
    correct_answer: 1,
    explanation: "PMFBY (launched 2016) provides comprehensive crop insurance to farmers against crop losses due to natural calamities, pests, and diseases.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first nuclear power reactor for power generation was at:",
    options: ["Kudankulam", "Kaiga", "Narora", "Tarapur"],
    correct_answer: 3,
    explanation: "Tarapur Atomic Power Station (Unit 1 and 2), set up with US assistance, was India's first nuclear power plant for commercial electricity generation (1969).",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Which Indian city is known as the 'Pink City'?",
    options: ["Agra", "Udaipur", "Jaipur", "Jodhpur"],
    correct_answer: 2,
    explanation: "Jaipur is called the 'Pink City' because Maharaja Ram Singh II had the entire old city painted pink (terracotta color) in 1876 to welcome Prince Albert.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "India's Startup Ecosystem is ranked globally among top ___.",
    options: ["3", "5", "8", "10"],
    correct_answer: 0,
    explanation: "India has the world's 3rd largest startup ecosystem (after USA and China), with over 100 unicorns and 100,000+ DPIIT-recognised startups as of 2024.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The National Disaster Management Authority (NDMA) in India was established under the:",
    options: ["Environment Protection Act", "Disaster Management Act 2005", "Civil Defence Act", "National Security Act"],
    correct_answer: 1,
    explanation: "NDMA was established under the Disaster Management Act 2005. The Prime Minister is the ex-officio Chairperson of NDMA.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Khelo India programme is aimed at:",
    options: ["International sports events hosting", "Grassroots sports development", "Athletes' rehabilitation", "Sports infrastructure in metros"],
    correct_answer: 1,
    explanation: "Khelo India is a national programme to revive sports culture at grassroots level in India through identifying and nurturing young talent.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The NIRF (National Institutional Ranking Framework) for higher education was launched by:",
    options: ["UGC", "NAAC", "Ministry of Education", "AICTE"],
    correct_answer: 2,
    explanation: "NIRF was launched in 2016 by the Ministry of Education (then HRD) to rank higher education institutions in India across various categories.",
    difficulty: "medium",
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

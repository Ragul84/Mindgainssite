require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:current_affairs';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // Indian Polity
  {
    question_text: "How many Fundamental Rights are guaranteed to Indian citizens?",
    options: ["5", "6", "7", "8"],
    correct_answer: 1,
    explanation: "The Indian Constitution guarantees 6 Fundamental Rights: Right to Equality, Right to Freedom, Right against Exploitation, Right to Freedom of Religion, Cultural and Educational Rights, and Right to Constitutional Remedies.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The concept of 'Basic Structure' of the Constitution was established in which case?",
    options: ["AK Gopalan case", "Kesavananda Bharati case", "Minerva Mills case", "Maneka Gandhi case"],
    correct_answer: 1,
    explanation: "The 'Basic Structure' doctrine was established in Kesavananda Bharati v. State of Kerala (1973). The Supreme Court held Parliament cannot alter the basic structure of the Constitution.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Directive Principles of State Policy are contained in which part of the Indian Constitution?",
    options: ["Part II", "Part III", "Part IV", "Part V"],
    correct_answer: 2,
    explanation: "Directive Principles of State Policy (DPSP) are contained in Part IV (Articles 36-51) of the Indian Constitution. They are non-justiciable but fundamental to governance.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The minimum age to vote in India is:",
    options: ["16 years", "18 years", "21 years", "25 years"],
    correct_answer: 1,
    explanation: "The voting age in India was lowered from 21 to 18 years by the 61st Constitutional Amendment Act, 1988. Citizens aged 18+ can vote.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "The Election Commission of India is established under:",
    options: ["Representation of People Act", "Article 324 of Constitution", "Parliament Statute", "Presidential Order"],
    correct_answer: 1,
    explanation: "The Election Commission of India is a constitutional body established under Article 324 of the Indian Constitution for superintendence, direction, and control of elections.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Who was India's first Prime Minister?",
    options: ["Sardar Patel", "C. Rajagopalachari", "Jawaharlal Nehru", "B.R. Ambedkar"],
    correct_answer: 2,
    explanation: "Jawaharlal Nehru was India's first Prime Minister, serving from 1947 to 1964.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Indian Parliament consists of:",
    options: ["Lok Sabha only", "Rajya Sabha only", "Lok Sabha and Rajya Sabha", "Lok Sabha, Rajya Sabha, and the President"],
    correct_answer: 3,
    explanation: "The Indian Parliament consists of the President of India, the Lok Sabha (House of People), and the Rajya Sabha (Council of States).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The maximum strength of Lok Sabha is:",
    options: ["543", "545", "550", "552"],
    correct_answer: 3,
    explanation: "The Lok Sabha has a maximum of 552 members: 530 from states, up to 20 from UTs, and 2 Anglo-Indians (though the 2 Anglo-Indian seats were abolished by 104th Amendment, 2020). Current elected strength is 543.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Speaker of Lok Sabha is elected by:",
    options: ["President of India", "Members of Lok Sabha", "All Parliament members", "Prime Minister"],
    correct_answer: 1,
    explanation: "The Speaker of Lok Sabha is elected by the members of Lok Sabha from among themselves by a simple majority.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Current Technology
  {
    question_text: "India's 'Aarogya Setu' app was launched during which event?",
    options: ["Dengue outbreak 2017", "COVID-19 pandemic 2020", "Floods 2019", "Nipah virus 2018"],
    correct_answer: 1,
    explanation: "Aarogya Setu was launched on April 2, 2020 during the COVID-19 pandemic for contact tracing and health status tracking.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The COWIN platform was used for:",
    options: ["Tax filing", "COVID-19 vaccination registration", "Ration card management", "Job registration"],
    correct_answer: 1,
    explanation: "CoWIN (Covid Vaccine Intelligence Network) was India's digital platform for COVID-19 vaccine registration, appointment scheduling, and certificate download.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's 'Digilocker' service allows citizens to:",
    options: ["Store money digitally", "Access official digital documents", "Pay taxes online", "Apply for passports"],
    correct_answer: 1,
    explanation: "DigiLocker is a cloud-based platform launched by MeitY that allows citizens to store, access, and share digital documents officially issued by government agencies.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Who invented the World Wide Web (WWW)?",
    options: ["Bill Gates", "Tim Berners-Lee", "Steve Jobs", "Vint Cerf"],
    correct_answer: 1,
    explanation: "Tim Berners-Lee invented the World Wide Web in 1989 while working at CERN. He is also the founder of W3C (World Wide Web Consortium).",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  // International Affairs
  {
    question_text: "India-Africa Forum Summit (IAFS) has been held ___ times as of 2024.",
    options: ["2", "3", "4", "5"],
    correct_answer: 1,
    explanation: "Three India-Africa Forum Summits have been held: 2008 (New Delhi), 2011 (Addis Ababa), 2015 (New Delhi). The 4th summit was scheduled but not yet held as of 2024.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The African Union (AU) was admitted as a full member of G20 in:",
    options: ["2022", "2023", "2024", "2021"],
    correct_answer: 1,
    explanation: "The African Union (55 member nations) was admitted as a permanent member of the G20 at the New Delhi summit in September 2023.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India assumed the Chairmanship of G20 for 2023 from:",
    options: ["Saudi Arabia", "Italy", "Indonesia", "Argentina"],
    correct_answer: 2,
    explanation: "India took over the G20 Chairmanship from Indonesia on December 1, 2022. Indonesia had hosted the G20 in Bali in 2022.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Russia-Ukraine war began in February:",
    options: ["2021", "2022", "2023", "2020"],
    correct_answer: 1,
    explanation: "Russia launched a full-scale invasion of Ukraine on February 24, 2022, though conflict in eastern Ukraine had been ongoing since 2014.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Gaza-Israel conflict that escalated in October 2023 was triggered by an attack by:",
    options: ["Hezbollah", "Hamas", "Islamic Jihad", "PLO"],
    correct_answer: 1,
    explanation: "Hamas launched a surprise attack on Israel on October 7, 2023, triggering a major conflict. Israel launched military operations in Gaza in response.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Banking & Finance
  {
    question_text: "The Insolvency and Bankruptcy Code (IBC) was enacted in:",
    options: ["2014", "2015", "2016", "2017"],
    correct_answer: 2,
    explanation: "The Insolvency and Bankruptcy Code 2016 was enacted to consolidate laws on insolvency and provide a time-bound process for resolving insolvency of companies and individuals.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's payment system SWIFT alternative 'SFMS' stands for:",
    options: ["Structured Financial Messaging System", "Secure Fund Management System", "Special Financial Messaging Service", "State-owned Finance Management System"],
    correct_answer: 0,
    explanation: "SFMS (Structured Financial Messaging System) is India's domestic alternative to SWIFT for interbank messaging, developed by IDRBT.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's Small Finance Banks were set up to:",
    options: ["Replace commercial banks", "Serve the unserved and underserved populations", "Focus only on agriculture loans", "Provide investment banking services"],
    correct_answer: 1,
    explanation: "Small Finance Banks are licensed by RBI primarily to serve small business units, marginal farmers, micro enterprises, and unorganised sector entities.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The PLI scheme for mobile phones was launched in which year?",
    options: ["2018", "2019", "2020", "2021"],
    correct_answer: 2,
    explanation: "Production Linked Incentive (PLI) scheme for mobile phones was launched in April 2020, attracting companies like Apple (Foxconn, Wistron, Pegatron) and Samsung to manufacture in India.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  // Public Figures
  {
    question_text: "Sundar Pichai is the CEO of:",
    options: ["Microsoft", "Apple", "Alphabet/Google", "Amazon"],
    correct_answer: 2,
    explanation: "Sundar Pichai (born in Chennai, India) is the CEO of Alphabet Inc. and its subsidiary Google since 2015.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Satya Nadella is the CEO of:",
    options: ["Amazon", "Microsoft", "Oracle", "IBM"],
    correct_answer: 1,
    explanation: "Satya Nadella (born in Hyderabad, India) became the CEO of Microsoft in 2014 and Executive Chairman in 2021.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "Indra Nooyi is known for her leadership of which company?",
    options: ["Microsoft", "Coca-Cola", "PepsiCo", "Nestle"],
    correct_answer: 2,
    explanation: "Indra Nooyi (born in Chennai, India) served as the CEO of PepsiCo from 2006 to 2018.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  // Social Issues
  {
    question_text: "The Protection of Children from Sexual Offences (POCSO) Act was enacted in:",
    options: ["2009", "2010", "2012", "2014"],
    correct_answer: 2,
    explanation: "The POCSO Act 2012 was enacted to protect children below 18 years from sexual abuse, harassment, and pornography, with special courts for speedy trials.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The National Food Security Act (NFSA) 2013 covers approximately what percentage of India's population?",
    options: ["50%", "67%", "75%", "80%"],
    correct_answer: 1,
    explanation: "The NFSA 2013 covers up to 75% of rural and 50% of urban population (approximately 67% of the total population), providing subsidised foodgrains.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act was enacted in:",
    options: ["2003", "2005", "2006", "2008"],
    correct_answer: 2,
    explanation: "The Forest Rights Act (FRA) 2006 recognises and vests forest rights in forest-dwelling Scheduled Tribes and other traditional forest dwellers.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Climate & Environment 2
  {
    question_text: "India's first solar city is:",
    options: ["Ahmedabad", "Diu", "Jaisalmer", "Bengaluru"],
    correct_answer: 1,
    explanation: "Diu (Union Territory) became India's first solar-powered union territory — generating more solar power than it consumes, achieving energy surplus.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The 'One Sun One World One Grid' initiative aims to:",
    options: ["Build a single mega solar plant", "Interconnect global solar power grids", "Install solar on every rooftop", "Create a solar powered internet"],
    correct_answer: 1,
    explanation: "'One Sun One World One Grid' (OSOWOG) proposes a global interconnected solar power grid to share clean energy across borders, jointly proposed by India and the UK.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first Floating Solar Plant was installed in:",
    options: ["Assam", "Kerala", "Madhya Pradesh", "Telangana"],
    correct_answer: 3,
    explanation: "India's first commercial floating solar power plant (NTPC's 25 MW) was inaugurated at Ramagundam in Telangana in 2022.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  // Key Committees & Reports
  {
    question_text: "The Rangarajan Committee was associated with:",
    options: ["Defence reforms", "Poverty estimation", "Banking sector reform", "Agricultural policy"],
    correct_answer: 1,
    explanation: "The Rangarajan Committee (2012) re-estimated India's poverty line, suggesting a higher poverty threshold than the Tendulkar Committee.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Uday Kotak Committee report (2017) dealt with:",
    options: ["Banking reforms", "Corporate governance", "Agricultural credit", "Healthcare"],
    correct_answer: 1,
    explanation: "The Uday Kotak Committee (2017) was constituted by SEBI to improve corporate governance standards for listed companies in India.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Important Indian Personalities
  {
    question_text: "C.V. Raman won the Nobel Prize in Physics in:",
    options: ["1928", "1930", "1932", "1935"],
    correct_answer: 1,
    explanation: "Sir C.V. Raman won the Nobel Prize in Physics in 1930 for the discovery of the Raman Effect (inelastic scattering of photons).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Who is known as the 'Missile Man of India'?",
    options: ["Vikram Sarabhai", "Satish Dhawan", "A.P.J. Abdul Kalam", "K. Sivan"],
    correct_answer: 2,
    explanation: "Dr. A.P.J. Abdul Kalam is known as the 'Missile Man of India' for his contributions to India's missile programme. He served as the 11th President (2002-2007).",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Dr. B.R. Ambedkar was the chairman of:",
    options: ["Constituent Assembly", "Drafting Committee of the Constitution", "Planning Commission", "Finance Commission"],
    correct_answer: 1,
    explanation: "Dr. B.R. Ambedkar was the Chairman of the Drafting Committee of the Constituent Assembly, earning the title 'Father of the Indian Constitution'.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Mother Teresa was born in which country?",
    options: ["India", "Albania", "Vatican", "Italy"],
    correct_answer: 1,
    explanation: "Mother Teresa was born Agnes Gonxha Bojaxhiu on August 26, 1910 in Skopje (now North Macedonia, then part of the Ottoman Empire). Albania is often cited as her nationality.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Rabindranath Tagore was awarded the Nobel Prize in Literature in:",
    options: ["1911", "1913", "1915", "1918"],
    correct_answer: 1,
    explanation: "Rabindranath Tagore won the Nobel Prize in Literature in 1913 for his collection 'Gitanjali'. He was the first non-European to win this prize.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // Important Schemes 2
  {
    question_text: "The MUDRA (Micro Units Development and Refinance Agency) loan scheme targets:",
    options: ["Students", "Non-corporate small business sector", "Farmers only", "Housing projects"],
    correct_answer: 1,
    explanation: "MUDRA loans are provided to non-corporate, non-farm small/micro enterprises under Shishu (₹50k), Kishore (₹5L), and Tarun (₹10L) categories.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Pradhan Mantri Suraksha Bima Yojana (PMSBY) provides:",
    options: ["Life insurance", "Accidental insurance", "Health insurance", "Crop insurance"],
    correct_answer: 1,
    explanation: "PMSBY provides accidental death and disability cover of ₹2 lakh for Rs. 20/year premium, for individuals aged 18-70 years.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The FAME India scheme promotes:",
    options: ["Cultural tourism", "Electric and hybrid vehicles", "Food processing", "Skill training"],
    correct_answer: 1,
    explanation: "FAME (Faster Adoption and Manufacturing of Hybrid and Electric vehicles) India scheme promotes electric vehicle adoption through subsidies and charging infrastructure.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The National Pension System (NPS) is regulated by:",
    options: ["SEBI", "IRDA", "PFRDA", "RBI"],
    correct_answer: 2,
    explanation: "The National Pension System is regulated by PFRDA (Pension Fund Regulatory and Development Authority), established in 2003.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Governance – Key Laws
  {
    question_text: "The Prevention of Money Laundering Act (PMLA) was enacted in:",
    options: ["1999", "2000", "2002", "2005"],
    correct_answer: 2,
    explanation: "PMLA was enacted in 2002 (came into force in 2005) to combat money laundering and provide for confiscation of property derived from money laundering.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Competition Commission of India (CCI) was established under the Competition Act:",
    options: ["1999", "2002", "2005", "2007"],
    correct_answer: 1,
    explanation: "CCI was established under the Competition Act 2002 to promote competition, prevent anti-competitive practices, and protect consumer interests.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Important Days 2
  {
    question_text: "World Water Day is observed on:",
    options: ["March 14", "March 22", "April 22", "June 5"],
    correct_answer: 1,
    explanation: "World Water Day is observed on March 22 every year since 1993, declared by the UN to raise awareness about freshwater conservation.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "International Women's Day is observed on:",
    options: ["February 14", "March 8", "March 15", "April 10"],
    correct_answer: 1,
    explanation: "International Women's Day is observed globally on March 8 every year to celebrate women's social, economic, cultural, and political achievements.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "World Diabetes Day is observed on:",
    options: ["September 29", "October 10", "November 14", "December 1"],
    correct_answer: 2,
    explanation: "World Diabetes Day is observed on November 14 (birthday of Sir Frederick Banting, co-discoverer of insulin) to raise awareness about diabetes.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "World AIDS Day is observed on:",
    options: ["October 1", "November 1", "December 1", "January 1"],
    correct_answer: 2,
    explanation: "World AIDS Day is observed on December 1 each year to raise awareness about AIDS/HIV and mourn those who have died.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "National Youth Day (India) is observed on January 12, the birthday of:",
    options: ["Subhas Chandra Bose", "Swami Vivekananda", "Jawaharlal Nehru", "Bhagat Singh"],
    correct_answer: 1,
    explanation: "National Youth Day is observed on January 12, the birthday of Swami Vivekananda (born 1863), to inspire youth through his teachings.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // Recent India News
  {
    question_text: "India hosted the International Olympic Committee (IOC) Session in which year?",
    options: ["2020", "2022", "2023", "2024"],
    correct_answer: 2,
    explanation: "The 141st IOC Session was held in Mumbai, India in October 2023 — the first IOC Session in India in 40 years.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which Indian state launched the 'Ama Gaon Ama Bikash' (Our Village Our Development) programme?",
    options: ["Jharkhand", "Chhattisgarh", "Odisha", "West Bengal"],
    correct_answer: 2,
    explanation: "The Odisha government launched 'Ama Gaon Ama Bikash' for participatory rural development, engaging local communities in planning village development.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's first operational semiconductor facility (Outsourced Semiconductor Assembly and Test – OSAT) was announced in:",
    options: ["Bengaluru", "Sanand, Gujarat", "Hyderabad", "Chennai"],
    correct_answer: 1,
    explanation: "India's first semiconductor OSAT (assembly and testing) facility was announced by Tata Electronics with PSMC (Taiwan) at Dholera, Gujarat in 2024.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India signed the India-Middle East-Europe Economic Corridor (IMEC) MoU at:",
    options: ["COP28", "G20 New Delhi 2023", "SCO Summit 2023", "BRICS 2023"],
    correct_answer: 1,
    explanation: "The IMEC (India-Middle East-Europe Economic Corridor) MoU was signed at the G20 New Delhi Summit in September 2023, connecting India to Europe via Middle East.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's UPI was launched in Singapore for international transactions in:",
    options: ["2020", "2021", "2022", "2023"],
    correct_answer: 2,
    explanation: "NPCI International launched UPI-PayNow linkage between India and Singapore in February 2023, enabling cross-border real-time payments.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Banking 2
  {
    question_text: "The Bank Nationalisation in India took place in which year(s)?",
    options: ["1955 and 1969", "1969 and 1980", "1955 and 1980", "1960 and 1975"],
    correct_answer: 1,
    explanation: "Major bank nationalisations: 14 banks in 1969 (under PM Indira Gandhi) and 6 more in 1980. The State Bank of India was nationalised in 1955.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "IRDAI (Insurance Regulatory and Development Authority of India) is headquartered in:",
    options: ["Mumbai", "New Delhi", "Hyderabad", "Chennai"],
    correct_answer: 2,
    explanation: "IRDAI is headquartered in Hyderabad. It regulates the insurance and reinsurance industries in India.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's first Regional Rural Bank (RRB) was established in:",
    options: ["1973", "1975", "1978", "1980"],
    correct_answer: 1,
    explanation: "Prathama Bank was the first Regional Rural Bank established on October 2, 1975 in Moradabad, Uttar Pradesh.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  // Infrastructure 2
  {
    question_text: "The Bogibeel Bridge, India's longest rail-road bridge, is located in:",
    options: ["West Bengal", "Bihar", "Assam", "Meghalaya"],
    correct_answer: 2,
    explanation: "Bogibeel Bridge (4.94 km) across the Brahmaputra River in Assam was inaugurated in December 2018. It is India's longest rail-road bridge.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Atal Tunnel (Rohtang Tunnel) in Himachal Pradesh is the world's longest road tunnel above 10,000 feet at:",
    options: ["7.5 km", "9.0 km", "8.0 km", "10 km"],
    correct_answer: 1,
    explanation: "Atal Tunnel (Rohtang) is 9.02 km long, inaugurated on October 3, 2020. It provides all-weather connectivity to Lahaul-Spiti valley.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Zoji La tunnel in Jammu & Kashmir, when complete, will connect:",
    options: ["Srinagar and Leh", "Jammu and Srinagar", "Ladakh and Punjab", "Kargil and Drass"],
    correct_answer: 0,
    explanation: "The Zoji La tunnel (approximately 14 km) will provide all-weather road connectivity between Srinagar and Leh by bypassing the Zoji La pass.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Recent Achievements
  {
    question_text: "India became the 4th country to achieve a soft lunar landing in 2023. The previous three were:",
    options: ["USA, Russia, China", "USA, Russia, Japan", "USA, China, Israel", "Russia, China, EU"],
    correct_answer: 0,
    explanation: "Before Chandrayaan-3 (2023), only USA (1966), Russia/USSR (1966), and China (2013) had achieved successful soft landings on the Moon.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Pralay missile has an operational range of approximately:",
    options: ["150 km", "350-500 km", "800 km", "1200 km"],
    correct_answer: 1,
    explanation: "Pralay is India's indigenously developed short-range, surface-to-surface quasi-ballistic missile with a range of 350-500 km, inducted into the Indian Army in 2022.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first drone warfare school was established at:",
    options: ["Delhi", "Jaisalmer", "Bengaluru", "Hyderabad"],
    correct_answer: 1,
    explanation: "The Indian Army established a drone warfare school at Jaisalmer, Rajasthan to train soldiers in drone operations and counter-drone tactics.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Which Indian state has the most tiger reserves as of 2024?",
    options: ["Madhya Pradesh", "Karnataka", "Uttarakhand", "Tamil Nadu"],
    correct_answer: 0,
    explanation: "Madhya Pradesh has the most tiger reserves in India (7), and is known as the 'Tiger State'. It also has one of the highest tiger populations.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'Mission Amrit Sarovar' aims to:",
    options: ["Provide water to all households", "Develop and rejuvenate water bodies", "Clean river Yamuna", "Install water ATMs"],
    correct_answer: 1,
    explanation: "Mission Amrit Sarovar was launched on April 24, 2022 to develop and rejuvenate 75,000 water bodies (ponds/lakes) across India as part of Azadi Ka Amrit Mahotsav.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's GDP per capita crossed $2,000 in which year?",
    options: ["2018", "2019", "2021", "2022"],
    correct_answer: 3,
    explanation: "India's GDP per capita (nominal) crossed the $2,000 mark around 2022. India remains a lower-middle-income country as per World Bank classification.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which ministry oversees the Jan Dhan-Aadhaar-Mobile (JAM) trinity initiative?",
    options: ["Ministry of Electronics and IT", "Ministry of Finance", "Ministry of Rural Development", "Ministry of Labour"],
    correct_answer: 1,
    explanation: "The JAM (Jan Dhan-Aadhaar-Mobile) trinity for direct benefit transfer is primarily overseen by the Ministry of Finance in coordination with other ministries.",
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

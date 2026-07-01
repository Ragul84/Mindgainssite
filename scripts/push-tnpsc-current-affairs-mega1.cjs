require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY   = 'quiz:subject:current_affairs';
const HDR   = { Authorization:`Bearer ${TOKEN}`, 'Content-Type':'application/json' };

const questions = [
  // Indian Government & Politics
  {
    question_text: "Who is the President of India as of 2024?",
    options: ["Ram Nath Kovind", "Droupadi Murmu", "Pranab Mukherjee", "A.P.J. Abdul Kalam"],
    correct_answer: 1,
    explanation: "Droupadi Murmu became the 15th President of India on July 25, 2022. She is the first tribal woman to hold this position.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Who is the Vice President of India (2022-present)?",
    options: ["M. Venkaiah Naidu", "Jagdeep Dhankhar", "Hamid Ansari", "Krishan Kant"],
    correct_answer: 1,
    explanation: "Jagdeep Dhankhar was sworn in as the 14th Vice President of India on August 11, 2022.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Who is the Chief Justice of India (2024)?",
    options: ["D.Y. Chandrachud", "Sanjiv Khanna", "N.V. Ramana", "S.A. Bobde"],
    correct_answer: 1,
    explanation: "Justice Sanjiv Khanna became the 51st Chief Justice of India on November 11, 2024, succeeding D.Y. Chandrachud.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "In which year was the National Education Policy (NEP) launched?",
    options: ["2018", "2019", "2020", "2021"],
    correct_answer: 2,
    explanation: "The National Education Policy 2020 was approved by the Union Cabinet in July 2020, replacing the 1986 policy.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Pradhan Mantri Jan Dhan Yojana (PMJDY) was launched in:",
    options: ["2012", "2013", "2014", "2015"],
    correct_answer: 2,
    explanation: "PMJDY was launched on August 28, 2014, to ensure financial inclusion by providing banking services to all unbanked households.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The 'Startup India' initiative was launched in which year?",
    options: ["2014", "2015", "2016", "2017"],
    correct_answer: 2,
    explanation: "Startup India was launched on January 16, 2016 to foster innovation and build a strong startup ecosystem in India.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Digital India programme was launched in:",
    options: ["2013", "2014", "2015", "2016"],
    correct_answer: 2,
    explanation: "Digital India was launched on July 1, 2015 to transform India into a digitally empowered society and knowledge economy.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana (PM-JAY) was launched in which year?",
    options: ["2016", "2017", "2018", "2019"],
    correct_answer: 2,
    explanation: "PM-JAY was launched on September 23, 2018. It provides health cover of ₹5 lakh per family per year for secondary and tertiary hospitalisation.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first Vande Bharat Express train was launched between which two cities?",
    options: ["Mumbai-Pune", "Delhi-Varanasi", "Chennai-Bengaluru", "Kolkata-Patna"],
    correct_answer: 1,
    explanation: "The first Vande Bharat Express (Train 18) was launched on February 15, 2019 between New Delhi and Varanasi.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The 'Make in India' initiative was launched in which year?",
    options: ["2013", "2014", "2015", "2016"],
    correct_answer: 1,
    explanation: "Make in India was launched on September 25, 2014 to encourage global companies to manufacture their products in India.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Space & Science
  {
    question_text: "India's Chandrayaan-3 mission successfully landed on the Moon's south pole in:",
    options: ["July 2023", "August 2023", "September 2023", "October 2023"],
    correct_answer: 1,
    explanation: "Chandrayaan-3's Vikram lander made a successful soft landing near the Moon's south pole on August 23, 2023, making India the first country to achieve this.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Aditya-L1 mission launched by ISRO in 2023 is a mission to study the:",
    options: ["Mars", "Jupiter", "Sun", "Moon"],
    correct_answer: 2,
    explanation: "Aditya-L1 is India's first solar mission, launched on September 2, 2023. It is stationed at the Lagrange Point 1 (L1) to study the Sun.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's space mission Gaganyaan aims to:",
    options: ["Land on Moon", "Send humans to space", "Study Mars atmosphere", "Place satellite in deep space"],
    correct_answer: 1,
    explanation: "Gaganyaan is India's crewed orbital spacecraft. ISRO plans to launch Indian astronauts (Gagannauts) to low Earth orbit.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "In 2023, which Indian scientist became ISRO Chairman?",
    options: ["K. Sivan", "S. Somnath", "A.S. Kiran Kumar", "Madhavan Nair"],
    correct_answer: 1,
    explanation: "S. Somnath was appointed as the Chairman of ISRO in January 2022 and continued through 2023, overseeing Chandrayaan-3 and Aditya-L1.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Which country launched the first civilian crewed lunar mission as part of the Artemis program?",
    options: ["Russia", "China", "USA", "Japan"],
    correct_answer: 2,
    explanation: "NASA's Artemis program aims to return humans to the Moon. The USA is leading this civilian lunar program.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The NISAR (NASA-ISRO SAR) satellite is a joint Earth observation mission between:",
    options: ["India and USA", "India and Russia", "India and France", "India and Japan"],
    correct_answer: 0,
    explanation: "NISAR is a joint Earth-observing mission between NASA (USA) and ISRO (India) to measure Earth surface changes using advanced radar.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Awards & Honours
  {
    question_text: "Who won the Nobel Peace Prize in 2023?",
    options: ["Malala Yousafzai", "Narges Mohammadi", "Greta Thunberg", "Oleksii Reznikov"],
    correct_answer: 1,
    explanation: "Iranian human rights activist Narges Mohammadi won the Nobel Peace Prize in 2023 for her fight against the oppression of women in Iran.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Bharat Ratna award in 2024 was given to (among others) former Prime Minister:",
    options: ["Atal Bihari Vajpayee", "Manmohan Singh", "P.V. Narasimha Rao", "Chandra Shekhar"],
    correct_answer: 2,
    explanation: "In February 2024, Bharat Ratna was awarded to former PM P.V. Narasimha Rao (posthumously), along with Chaudhary Charan Singh, M.S. Swaminathan, Karpoori Thakur, and L.K. Advani.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Padma Vibhushan is India's:",
    options: ["Highest civilian award", "Second highest civilian award", "Third highest civilian award", "Military award"],
    correct_answer: 1,
    explanation: "Padma Vibhushan is the second highest civilian honour in India, after Bharat Ratna.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Who received the Nobel Prize in Literature in 2023?",
    options: ["Abdulrazak Gurnah", "Annie Ernaux", "Jon Fosse", "Peter Handke"],
    correct_answer: 2,
    explanation: "Norwegian author Jon Fosse received the Nobel Prize in Literature in 2023 'for his innovative plays and prose which give voice to the unsayable.'",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Dadasaheb Phalke Award is associated with which field?",
    options: ["Literature", "Science", "Cinema", "Sports"],
    correct_answer: 2,
    explanation: "Dadasaheb Phalke Award is the highest honour in Indian Cinema, given by the Government of India for lifetime contribution to Indian cinema.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  // International Relations
  {
    question_text: "The G20 summit in 2023 was hosted by:",
    options: ["Indonesia", "India", "Brazil", "South Africa"],
    correct_answer: 1,
    explanation: "India hosted the G20 Leaders' Summit in New Delhi on September 9-10, 2023. The theme was 'Vasudhaiva Kutumbakam – One Earth, One Family, One Future.'",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "India joined which grouping in 2023, expanding it to BRICS+?",
    options: ["India was an original member", "New members joined — not India", "India left BRICS", "India joined SCO instead"],
    correct_answer: 1,
    explanation: "At the BRICS summit in Johannesburg in August 2023, six new countries were invited to join: Argentina, Egypt, Ethiopia, Iran, Saudi Arabia, and UAE (effective January 2024).",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The United Nations Environment Programme (UNEP) headquarters is located in:",
    options: ["Geneva", "New York", "Nairobi", "Vienna"],
    correct_answer: 2,
    explanation: "UNEP headquarters is located in Nairobi, Kenya. It is the only major UN body headquartered in a developing country.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The SCO (Shanghai Cooperation Organisation) summit in 2023 was hosted online by:",
    options: ["China", "Russia", "India", "Pakistan"],
    correct_answer: 2,
    explanation: "India hosted the SCO Council of Heads of State summit virtually on July 4, 2023 in its capacity as the SCO Chair.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which country became the newest member of NATO in 2023?",
    options: ["Ukraine", "Sweden", "Finland", "Georgia"],
    correct_answer: 2,
    explanation: "Finland joined NATO on April 4, 2023 as its 31st member, following Russia's invasion of Ukraine. Sweden joined in 2024 as 32nd member.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Sports
  {
    question_text: "India won how many medals at the 2023 Asian Games held in Hangzhou, China?",
    options: ["78", "107", "115", "88"],
    correct_answer: 1,
    explanation: "India won a record 107 medals (28 gold, 38 silver, 41 bronze) at the 2023 Asian Games in Hangzhou, China.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Who won the ICC Cricket World Cup 2023?",
    options: ["India", "Australia", "South Africa", "England"],
    correct_answer: 1,
    explanation: "Australia won the ICC Cricket World Cup 2023, defeating India by 6 wickets in the final held in Ahmedabad on November 19, 2023.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "Neeraj Chopra won a gold medal in Javelin Throw at which games in 2023?",
    options: ["Asian Games", "World Athletics Championships", "Commonwealth Games", "Olympic Games"],
    correct_answer: 1,
    explanation: "Neeraj Chopra won gold at the World Athletics Championships 2023 in Budapest, Hungary, with a throw of 88.17m.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The FIFA Women's World Cup 2023 was co-hosted by:",
    options: ["USA and Canada", "Australia and New Zealand", "England and Germany", "France and Spain"],
    correct_answer: 1,
    explanation: "The 2023 FIFA Women's World Cup was co-hosted by Australia and New Zealand. Spain won the tournament.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Which country hosted the 2022 FIFA World Cup?",
    options: ["Russia", "Brazil", "Qatar", "UAE"],
    correct_answer: 2,
    explanation: "Qatar hosted the 2022 FIFA World Cup — the first held in the Middle East. Argentina won the tournament, defeating France in the final.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "India's P.V. Sindhu is associated with which sport?",
    options: ["Tennis", "Badminton", "Table Tennis", "Squash"],
    correct_answer: 1,
    explanation: "P.V. Sindhu is an Indian professional badminton player and two-time Olympic medalist (silver 2016, bronze 2020).",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The 2024 Olympic Games were held in:",
    options: ["Tokyo", "Los Angeles", "Paris", "Brisbane"],
    correct_answer: 2,
    explanation: "The 2024 Summer Olympic Games (Paris 2024) were held in Paris, France from July 26 to August 11, 2024.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  // Economy & Finance
  {
    question_text: "India's GDP growth rate for 2023-24 was approximately:",
    options: ["6.5%", "7.6%", "8.2%", "5.8%"],
    correct_answer: 1,
    explanation: "India's GDP growth rate for 2023-24 was 8.2%, making India one of the fastest-growing major economies in the world.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's Union Budget 2024-25 was presented by:",
    options: ["Arun Jaitley", "Piyush Goyal", "Nirmala Sitharaman", "P. Chidambaram"],
    correct_answer: 2,
    explanation: "Nirmala Sitharaman presented the Union Budget 2024-25 on July 23, 2024 — her seventh consecutive budget as Finance Minister.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Unified Payments Interface (UPI) is governed by:",
    options: ["RBI", "SEBI", "NPCI", "Ministry of Finance"],
    correct_answer: 2,
    explanation: "UPI is governed by the National Payments Corporation of India (NPCI). It was launched in 2016 and has become the world's largest real-time payment system.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India became the world's _____ largest economy (nominal GDP) in 2023.",
    options: ["3rd", "4th", "5th", "6th"],
    correct_answer: 2,
    explanation: "India surpassed UK to become the 5th largest economy in the world by nominal GDP in 2022-23.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Environment & Climate
  {
    question_text: "COP28 climate summit in 2023 was held in:",
    options: ["Glasgow", "Sharm El-Sheikh", "Dubai", "Baku"],
    correct_answer: 2,
    explanation: "COP28 was held in Dubai, UAE from November 30 to December 12, 2023. It reached a landmark agreement to 'transition away from fossil fuels.'",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Paris Agreement on Climate Change aims to limit global temperature rise to below:",
    options: ["1°C", "1.5°C", "2°C", "2.5°C"],
    correct_answer: 1,
    explanation: "The Paris Agreement (2015) aims to limit global warming to well below 2°C, preferably to 1.5°C, compared to pre-industrial levels.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Project Tiger in India was launched in which year?",
    options: ["1970", "1973", "1980", "1985"],
    correct_answer: 1,
    explanation: "Project Tiger was launched in 1973 to protect the Bengal Tiger. India now has more than 50 Tiger Reserves.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's target for non-fossil fuel installed electricity capacity by 2030 under NDC is:",
    options: ["40%", "50%", "500 GW", "50 GW"],
    correct_answer: 2,
    explanation: "India's updated NDC (Nationally Determined Contributions) target is to achieve about 500 GW of non-fossil fuel-based energy capacity by 2030.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  // Science & Technology
  {
    question_text: "ChatGPT was developed by which company?",
    options: ["Google", "Microsoft", "OpenAI", "Meta"],
    correct_answer: 2,
    explanation: "ChatGPT is developed by OpenAI. It was launched in November 2022 and became one of the fastest-growing applications in history.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "5G technology in India was launched commercially in:",
    options: ["2020", "2021", "2022", "2023"],
    correct_answer: 2,
    explanation: "India commercially launched 5G services on October 1, 2022, at the India Mobile Congress in New Delhi.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first semiconductor chip fabrication plant will be set up in:",
    options: ["Bengaluru", "Hyderabad", "Gujarat", "Pune"],
    correct_answer: 2,
    explanation: "India's first semiconductor fab plant (Micron Technology) will be set up in Sanand, Gujarat, under the India Semiconductor Mission.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Indian government launched the PLI (Production Linked Incentive) scheme to boost:",
    options: ["Agriculture only", "Manufacturing sectors", "Tourism", "Education"],
    correct_answer: 1,
    explanation: "PLI scheme was launched to boost domestic manufacturing across 14 key sectors including mobile phones, pharmaceuticals, automobiles, and textiles.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  // Health
  {
    question_text: "COVID-19 was declared a pandemic by the WHO in which year?",
    options: ["2019", "2020", "2021", "2022"],
    correct_answer: 1,
    explanation: "The World Health Organisation declared COVID-19 a global pandemic on March 11, 2020.",
    difficulty: "easy",
    exam_types: ["tnpsc","ssc"]
  },
  {
    question_text: "India's COVID-19 vaccination programme was launched on:",
    options: ["January 16, 2021", "March 1, 2021", "April 1, 2021", "December 25, 2020"],
    correct_answer: 0,
    explanation: "India launched its COVID-19 vaccination drive on January 16, 2021. It is the world's largest vaccination programme.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The WHO declared the end of COVID-19 as a global health emergency on:",
    options: ["January 2023", "March 2023", "May 2023", "December 2023"],
    correct_answer: 2,
    explanation: "The WHO declared the end of COVID-19 as a global health emergency (Public Health Emergency of International Concern) on May 5, 2023.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Indian Defence
  {
    question_text: "India's indigenously designed and developed aircraft carrier INS Vikrant was commissioned in:",
    options: ["2020", "2021", "2022", "2023"],
    correct_answer: 2,
    explanation: "INS Vikrant (IAC-1) was commissioned on September 2, 2022 by PM Narendra Modi. It is India's first indigenous aircraft carrier.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Operation Dost was conducted by India to provide disaster relief to which country in 2023?",
    options: ["Nepal", "Turkey", "Sri Lanka", "Bangladesh"],
    correct_answer: 1,
    explanation: "India launched Operation Dost in February 2023 to provide disaster relief to Turkey and Syria following devastating earthquakes.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's missile defence system S-400 was purchased from:",
    options: ["USA", "France", "Russia", "Israel"],
    correct_answer: 2,
    explanation: "India purchased the S-400 Triumf missile defence system from Russia. The deal was signed in 2018 and deliveries began in 2021.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Chief of Defence Staff (CDS) position was created in India in:",
    options: ["2018", "2019", "2020", "2021"],
    correct_answer: 1,
    explanation: "The position of Chief of Defence Staff (CDS) was created on January 1, 2020. General Bipin Rawat was the first CDS.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  // Tamil Nadu Specific
  {
    question_text: "The Chief Minister of Tamil Nadu (as of 2024) is:",
    options: ["Edappadi K. Palaniswami", "M.K. Stalin", "O. Panneerselvam", "J. Jayalalithaa"],
    correct_answer: 1,
    explanation: "M.K. Stalin has been the Chief Minister of Tamil Nadu since May 7, 2021, after DMK's victory in the 2021 Tamil Nadu Legislative Assembly elections.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Tamil Nadu's Government scheme 'Kalaignar Magalir Urimai Thittam' provides monthly financial assistance of ₹___ to eligible women.",
    options: ["500", "750", "1000", "1500"],
    correct_answer: 2,
    explanation: "Kalaignar Magalir Urimai Thittam provides ₹1,000 per month to eligible women heads of households in Tamil Nadu.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Tamil Nadu government's 'Naan Mudhalvan' scheme is focused on:",
    options: ["Farmer welfare", "Skill development for youth", "Senior citizen health", "Rural electrification"],
    correct_answer: 1,
    explanation: "Naan Mudhalvan is a skill development scheme by the Tamil Nadu government to enhance employability of youth through training and internship programmes.",
    difficulty: "easy",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The 2023 International Tamil Conference (World Tamil Conference) was held in:",
    options: ["Chennai", "Colombo", "Malaysia", "Singapore"],
    correct_answer: 0,
    explanation: "The World Tamil Conference was hosted in Chennai, Tamil Nadu in 2023.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "Tamil Nadu topped India's GSDP growth among large states in 2022-23 at approximately:",
    options: ["6%", "7%", "8%", "9%"],
    correct_answer: 2,
    explanation: "Tamil Nadu recorded strong GSDP growth. The state has one of the highest GSDPs in India and consistently ranks among top-performing states.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  // Current Appointments
  {
    question_text: "Who is the Governor of the Reserve Bank of India (RBI) as of 2024?",
    options: ["Urjit Patel", "Shaktikanta Das", "Sanjay Malhotra", "Raghuram Rajan"],
    correct_answer: 2,
    explanation: "Sanjay Malhotra became the 26th Governor of the Reserve Bank of India on December 11, 2024, succeeding Shaktikanta Das.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Who is the Chairman of NITI Aayog (2024)?",
    options: ["Amitabh Kant", "Suman Bery", "Arvind Panagariya", "PM Narendra Modi"],
    correct_answer: 3,
    explanation: "The Prime Minister of India is the ex-officio Chairperson of NITI Aayog. Currently PM Narendra Modi chairs it. The CEO is V.K. Saraswat (interim). Suman Bery is the Vice Chairperson.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first female Defence Secretary was:",
    options: ["Sushma Swaraj", "Radha Kumar", "Nirmala Sitharaman", "Nirmala was first female defence minister"],
    correct_answer: 3,
    explanation: "Nirmala Sitharaman was India's first full-time female Defence Minister (2017-2019), not Defence Secretary. She is currently the Finance Minister.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  // Schemes & Policies
  {
    question_text: "The PM-KISAN scheme provides annual financial assistance of ₹___ to small and marginal farmers.",
    options: ["4000", "5000", "6000", "8000"],
    correct_answer: 2,
    explanation: "Under PM-KISAN (Pradhan Mantri Kisan Samman Nidhi), eligible farmers receive ₹6,000 per year in three equal installments of ₹2,000.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The National Rural Employment Guarantee Act (MGNREGA) guarantees ___ days of employment per year.",
    options: ["50", "75", "100", "150"],
    correct_answer: 2,
    explanation: "MGNREGA guarantees 100 days of wage employment per year to rural households whose adult members are willing to do unskilled manual work.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The Swachh Bharat Mission was launched on Gandhi Jayanti in which year?",
    options: ["2013", "2014", "2015", "2016"],
    correct_answer: 1,
    explanation: "Swachh Bharat Mission was launched on October 2, 2014 (Gandhi Jayanti) with the aim of achieving Open Defecation Free India and proper solid waste management.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The National Health Mission (NHM) was launched in which year?",
    options: ["2003", "2005", "2007", "2009"],
    correct_answer: 1,
    explanation: "The National Rural Health Mission (NRHM) was launched in 2005. It was expanded to National Health Mission (NHM) in 2013 to include urban areas.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's Atal Innovation Mission (AIM) is run under:",
    options: ["Ministry of Education", "NITI Aayog", "Ministry of Finance", "DST"],
    correct_answer: 1,
    explanation: "Atal Innovation Mission (AIM) is run by NITI Aayog to promote innovation and entrepreneurship in India through Atal Tinkering Labs in schools.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  // Important Events 2023-24
  {
    question_text: "Ram Mandir in Ayodhya was consecrated (Prana Pratishtha) on:",
    options: ["December 6, 2023", "January 22, 2024", "March 15, 2024", "November 19, 2023"],
    correct_answer: 1,
    explanation: "The Prana Pratishtha (consecration) ceremony of Ram Mandir in Ayodhya was performed on January 22, 2024, in the presence of PM Narendra Modi.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India conducted its 18th General Elections in:",
    options: ["March 2024", "April-June 2024", "January 2024", "July 2024"],
    correct_answer: 1,
    explanation: "India's 18th Lok Sabha General Elections were held in seven phases from April 19 to June 1, 2024. Results were announced on June 4, 2024.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Who became the Speaker of India's 18th Lok Sabha (2024)?",
    options: ["Om Birla", "Meira Kumar", "P.A. Sangma", "Sumitra Mahajan"],
    correct_answer: 0,
    explanation: "Om Birla was re-elected as the Speaker of the 18th Lok Sabha on June 26, 2024.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Nuclear Power Corporation of India (NPCIL) operates under which ministry?",
    options: ["Ministry of Science", "Department of Atomic Energy", "Ministry of Power", "Ministry of Petroleum"],
    correct_answer: 1,
    explanation: "NPCIL operates under the Department of Atomic Energy (DAE), Government of India, which reports directly to the Prime Minister.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "India's tallest statue, the Statue of Unity, is located in:",
    options: ["Madhya Pradesh", "Rajasthan", "Gujarat", "Maharashtra"],
    correct_answer: 2,
    explanation: "The Statue of Unity, depicting Sardar Vallabhbhai Patel, is located in Kevadia, Gujarat. At 182 metres, it is the world's tallest statue.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc","ssc"]
  },
  {
    question_text: "The new Parliament building of India was inaugurated in:",
    options: ["December 2022", "January 2023", "May 2023", "August 2023"],
    correct_answer: 2,
    explanation: "The new Parliament building of India was inaugurated by PM Narendra Modi on May 28, 2023.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which India-built satellite internet service was launched to provide broadband connectivity to remote areas?",
    options: ["ISRO Sat", "One Web (in collaboration)", "GSAT-20 (2024)", "NeSAT"],
    correct_answer: 2,
    explanation: "GSAT-20 (also called GSAT-N2) launched in 2024 aims to provide high-throughput broadband satellite internet services, especially to remote and northeastern areas of India.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The 'One Nation One Ration Card' scheme allows migrant workers to access food grains from any:",
    options: ["Bank in India", "Post Office", "Fair Price Shop", "Government hospital"],
    correct_answer: 2,
    explanation: "One Nation One Ration Card enables beneficiaries to access PDS entitlements from any Fair Price Shop (FPS) across India.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Namami Gange programme is aimed at:",
    options: ["Cleaning River Yamuna", "Conservation and Rejuvenation of Ganga", "Flood control in Bihar", "Irrigation development"],
    correct_answer: 1,
    explanation: "Namami Gange is the Integrated Ganga Conservation Mission launched in 2014 to clean and conserve the river Ganga.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's National Hydrogen Mission targets producing ___ MMT of green hydrogen by 2030.",
    options: ["3 MMT", "5 MMT", "10 MMT", "15 MMT"],
    correct_answer: 1,
    explanation: "The National Green Hydrogen Mission aims to produce 5 MMT (million metric tonnes) of green hydrogen per annum by 2030.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The QUAD grouping consists of USA, India, Japan, and:",
    options: ["China", "Australia", "South Korea", "UK"],
    correct_answer: 1,
    explanation: "The Quad (Quadrilateral Security Dialogue) consists of the United States, India, Japan, and Australia. It was revived in 2017.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's first green hydrogen-powered bus was launched in which city?",
    options: ["Mumbai", "New Delhi", "Leh", "Chennai"],
    correct_answer: 2,
    explanation: "India's first hydrogen fuel cell bus was launched in Leh, Ladakh by NTPC in 2022 as a pilot project in high-altitude terrain.",
    difficulty: "hard",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The headquarters of the International Solar Alliance (ISA) is located in:",
    options: ["Mumbai", "Gurugram (Gurgaon)", "New Delhi", "Hyderabad"],
    correct_answer: 1,
    explanation: "The International Solar Alliance headquarters is located in Gurugram (Gurgaon), India. ISA was co-founded by India and France in 2015.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Which state in India has the highest installed renewable energy capacity as of 2024?",
    options: ["Maharashtra", "Gujarat", "Rajasthan", "Tamil Nadu"],
    correct_answer: 2,
    explanation: "Rajasthan has the highest installed renewable energy capacity in India, owing to its vast solar and wind potential.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Indian Ocean Rim Association (IORA) has its secretariat in:",
    options: ["New Delhi", "Mauritius", "Perth", "Colombo"],
    correct_answer: 1,
    explanation: "The IORA secretariat is located in Ebène, Mauritius. India is an active member and has hosted chairmanship of IORA.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "Operation Sindoor was conducted by India in:",
    options: ["2023", "2024", "2025", "2022"],
    correct_answer: 2,
    explanation: "Operation Sindoor was conducted by India in May 2025 as a military response to the Pahalgam terrorist attack, targeting terrorist infrastructure in Pakistan and Pakistan-occupied Kashmir.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Pahalgam terrorist attack that killed tourists in Jammu & Kashmir occurred in:",
    options: ["January 2025", "February 2025", "April 2025", "March 2025"],
    correct_answer: 2,
    explanation: "The Pahalgam terror attack occurred on April 22, 2025, killing 26 tourists in the Baisaran meadow area of Pahalgam, Jammu & Kashmir.",
    difficulty: "easy",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's 'Vibrant Villages Programme' focuses on development of border villages in which region?",
    options: ["Western border with Pakistan", "Northern border with China", "Eastern border with Bangladesh", "Southern coastal villages"],
    correct_answer: 1,
    explanation: "Vibrant Villages Programme (VVP) was launched in 2023 to develop border villages on India's northern border with China, particularly in Himachal Pradesh, Uttarakhand, Sikkim, and Arunachal Pradesh.",
    difficulty: "medium",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "India's UPI (Unified Payments Interface) crossed ___ billion transactions in a single month in 2024.",
    options: ["5 billion", "10 billion", "15 billion", "20 billion"],
    correct_answer: 1,
    explanation: "UPI crossed 10 billion transactions in a single month in 2023, and continued growing in 2024, demonstrating the scale of India's digital payments ecosystem.",
    difficulty: "medium",
    exam_types: ["tnpsc"]
  },
  {
    question_text: "The Nobel Prize in Physics 2024 was awarded for contributions to:",
    options: ["Quantum computing", "Artificial Neural Networks and Machine Learning", "Gravitational waves", "Semiconductor physics"],
    correct_answer: 1,
    explanation: "The 2024 Nobel Prize in Physics was awarded to John Hopfield and Geoffrey Hinton for foundational discoveries and inventions that enable machine learning with artificial neural networks.",
    difficulty: "hard",
    exam_types: ["tnpsc","upsc"]
  },
  {
    question_text: "The Katchatheevu island, often in the news, was transferred to Sri Lanka in which year?",
    options: ["1971", "1974", "1976", "1980"],
    correct_answer: 1,
    explanation: "Katchatheevu island was ceded to Sri Lanka by India in 1974 through the Indo-Sri Lanka Maritime Boundary Agreement under PM Indira Gandhi.",
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

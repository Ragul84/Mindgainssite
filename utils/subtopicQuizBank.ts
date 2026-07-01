// 🎯 Subtopic-Specific Quiz Bank - Comprehensive questions for each subtopic
// Each subtopic has 5-10 unique quiz questions with varying difficulty levels

export interface SubtopicQuiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

const SUBTOPIC_QUIZZES: { [key: string]: { [subtopic: string]: SubtopicQuiz[] } } = {
  // ==================== HISTORY ====================
  'ancient-india': {
    'Indus Valley Civilization': [
      {
        question: "What was the most distinctive feature of Indus Valley urban planning?",
        options: [
          "Circular city walls",
          "Grid pattern streets and drainage system",
          "Pyramid structures",
          "Underground temples"
        ],
        correct: 1,
        explanation: "Indus Valley cities like Harappa and Mohenjo-daro had remarkably advanced grid pattern streets and sophisticated drainage systems, showing excellent urban planning.",
        difficulty: 'easy'
      },
      {
        question: "Which animal was NOT depicted on Indus Valley seals?",
        options: [
          "Bull",
          "Elephant",
          "Horse",
          "Rhinoceros"
        ],
        correct: 2,
        explanation: "Horses were not present in the Indus Valley Civilization. They were introduced later by the Aryans. Bulls, elephants, and rhinoceros were commonly depicted on seals.",
        difficulty: 'medium'
      },
      {
        question: "What was the primary occupation of Indus Valley people?",
        options: [
          "Hunting and gathering",
          "Agriculture and trade",
          "Warfare and conquest",
          "Nomadic herding"
        ],
        correct: 1,
        explanation: "The Indus Valley people were primarily agriculturalists who grew wheat, barley, and cotton. They also engaged in extensive trade with Mesopotamia.",
        difficulty: 'easy'
      }
    ],
    'Vedic Period': [
      {
        question: "Which Veda contains the Gayatri Mantra?",
        options: [
          "Rig Veda",
          "Sama Veda",
          "Yajur Veda",
          "Atharva Veda"
        ],
        correct: 0,
        explanation: "The Gayatri Mantra is found in the Rig Veda (3.62.10). It is one of the most sacred mantras in Hinduism.",
        difficulty: 'medium'
      },
      {
        question: "What was the basic unit of Vedic society?",
        options: [
          "Village",
          "Kingdom",
          "Family",
          "Guild"
        ],
        correct: 2,
        explanation: "The family (kula) was the basic unit of Vedic society, with the eldest male as the head (kulapa or grihapati).",
        difficulty: 'easy'
      },
      {
        question: "Which metal was unknown to the Early Vedic people?",
        options: [
          "Gold",
          "Silver",
          "Copper",
          "Iron"
        ],
        correct: 3,
        explanation: "Iron was unknown in the Early Vedic period (1500-1000 BC). It was introduced in the Later Vedic period, leading to agricultural expansion.",
        difficulty: 'hard'
      }
    ],
    'Mauryan Empire': [
      {
        question: "Who was Chandragupta Maurya's advisor and author of Arthashastra?",
        options: [
          "Megasthenes",
          "Chanakya (Kautilya)",
          "Ashoka",
          "Bindusara"
        ],
        correct: 1,
        explanation: "Chanakya, also known as Kautilya or Vishnugupta, was Chandragupta's advisor and wrote the Arthashastra, an ancient Indian treatise on statecraft.",
        difficulty: 'easy'
      },
      {
        question: "After which war did Ashoka embrace Buddhism?",
        options: [
          "Battle of Hydaspes",
          "Kalinga War",
          "Battle of Takshashila",
          "Magadha War"
        ],
        correct: 1,
        explanation: "The Kalinga War (c. 261 BC) was so brutal that it transformed Ashoka, leading him to embrace Buddhism and adopt a policy of non-violence.",
        difficulty: 'easy'
      },
      {
        question: "What was the Mauryan administrative unit below the province level?",
        options: [
          "Ahara",
          "Rashtra",
          "Janapada",
          "Grama"
        ],
        correct: 0,
        explanation: "The Mauryan Empire was divided into provinces (Pradesh), which were further divided into Ahara (districts), and then into smaller units.",
        difficulty: 'hard'
      }
    ],
    'Gupta Period': [
      {
        question: "Who is known as the 'Napoleon of India'?",
        options: [
          "Chandragupta I",
          "Samudragupta",
          "Chandragupta II",
          "Skandagupta"
        ],
        correct: 1,
        explanation: "Samudragupta is called the 'Napoleon of India' by historian V.A. Smith due to his extensive military conquests across India.",
        difficulty: 'medium'
      },
      {
        question: "Which Chinese traveler visited India during Chandragupta II's reign?",
        options: [
          "Fa-Hien (Faxian)",
          "Hiuen Tsang",
          "I-Tsing",
          "Marco Polo"
        ],
        correct: 0,
        explanation: "Fa-Hien visited India during Chandragupta II's reign (405-411 CE) and left valuable accounts of Indian society and Buddhism.",
        difficulty: 'medium'
      },
      {
        question: "What was the Gupta period's greatest contribution to mathematics?",
        options: [
          "Pythagoras theorem",
          "Decimal system and zero",
          "Geometry",
          "Algebra"
        ],
        correct: 1,
        explanation: "The decimal system and the concept of zero were developed during the Gupta period, revolutionizing mathematics worldwide.",
        difficulty: 'easy'
      }
    ]
  },

  'medieval-india': {
    'Delhi Sultanate': [
      {
        question: "Who founded the Slave Dynasty of Delhi Sultanate?",
        options: [
          "Muhammad Ghori",
          "Qutub-ud-din Aibak",
          "Iltutmish",
          "Balban"
        ],
        correct: 1,
        explanation: "Qutub-ud-din Aibak, a slave of Muhammad Ghori, founded the Slave Dynasty in 1206 CE, becoming the first Sultan of Delhi.",
        difficulty: 'easy'
      },
      {
        question: "Which Delhi Sultan introduced the market control policy?",
        options: [
          "Balban",
          "Alauddin Khilji",
          "Muhammad bin Tughlaq",
          "Firoz Shah Tughlaq"
        ],
        correct: 1,
        explanation: "Alauddin Khilji introduced strict market control policies to regulate prices of essential commodities and prevent hoarding.",
        difficulty: 'medium'
      },
      {
        question: "Who built the Qutub Minar?",
        options: [
          "Qutub-ud-din Aibak started it",
          "Iltutmish completed it",
          "Both A and B",
          "Alauddin Khilji"
        ],
        correct: 2,
        explanation: "Qutub-ud-din Aibak started the construction of Qutub Minar, but could only complete the basement. Iltutmish completed the structure.",
        difficulty: 'medium'
      }
    ],
    'Mughal Empire': [
      {
        question: "In which battle did Babur defeat Ibrahim Lodi?",
        options: [
          "Battle of Khanwa",
          "Battle of Panipat (1526)",
          "Battle of Ghaghra",
          "Battle of Chanderi"
        ],
        correct: 1,
        explanation: "Babur defeated Ibrahim Lodi in the First Battle of Panipat (1526), establishing the Mughal Empire in India.",
        difficulty: 'easy'
      },
      {
        question: "Which Mughal emperor is known for religious tolerance and Din-i-Ilahi?",
        options: [
          "Babur",
          "Humayun",
          "Akbar",
          "Jahangir"
        ],
        correct: 2,
        explanation: "Akbar was known for his religious tolerance and founded Din-i-Ilahi, attempting to merge the best elements of various religions.",
        difficulty: 'easy'
      },
      {
        question: "Who built the Taj Mahal and for whom?",
        options: [
          "Akbar for Jodha Bai",
          "Shah Jahan for Mumtaz Mahal",
          "Jahangir for Nur Jahan",
          "Aurangzeb for Rabia Daurani"
        ],
        correct: 1,
        explanation: "Shah Jahan built the Taj Mahal as a mausoleum for his beloved wife Mumtaz Mahal, who died in 1631.",
        difficulty: 'easy'
      },
      {
        question: "Which Mughal emperor re-imposed Jizya tax?",
        options: [
          "Akbar",
          "Jahangir",
          "Shah Jahan",
          "Aurangzeb"
        ],
        correct: 3,
        explanation: "Aurangzeb re-imposed the Jizya tax on non-Muslims in 1679, reversing Akbar's policy of religious tolerance.",
        difficulty: 'medium'
      }
    ],
    'Maratha Empire': [
      {
        question: "What was Shivaji's council of ministers called?",
        options: [
          "Navaratna",
          "Ashta Pradhan",
          "Panchayat",
          "Mantri Parishad"
        ],
        correct: 1,
        explanation: "Shivaji's council of eight ministers was called Ashta Pradhan, with each minister responsible for different administrative functions.",
        difficulty: 'medium'
      },
      {
        question: "Where did Shivaji's coronation take place?",
        options: [
          "Pune",
          "Raigad",
          "Pratapgad",
          "Bijapur"
        ],
        correct: 1,
        explanation: "Shivaji's coronation ceremony took place at Raigad Fort in 1674, where he was crowned as Chhatrapati.",
        difficulty: 'easy'
      },
      {
        question: "Which Maratha confederacy leader signed the Treaty of Bassein with the British?",
        options: [
          "Baji Rao I",
          "Balaji Baji Rao",
          "Baji Rao II",
          "Madhav Rao"
        ],
        correct: 2,
        explanation: "Baji Rao II signed the Treaty of Bassein (1802) with the British, which eventually led to the downfall of Maratha power.",
        difficulty: 'hard'
      }
    ]
  },

  // ==================== POLITY ====================
  'constitution-basics': {
    'Preamble': [
      {
        question: "Which word was NOT originally in the Preamble but added by 42nd Amendment?",
        options: [
          "Sovereign",
          "Democratic",
          "Secular",
          "Republic"
        ],
        correct: 2,
        explanation: "The words 'Socialist' and 'Secular' were added to the Preamble by the 42nd Constitutional Amendment in 1976.",
        difficulty: 'medium'
      },
      {
        question: "The Preamble declares India to be a sovereign, socialist, secular, democratic republic. What does 'sovereign' mean?",
        options: [
          "Dependent on other nations",
          "Independent and supreme authority",
          "Religious state",
          "Monarchy"
        ],
        correct: 1,
        explanation: "Sovereign means India has supreme authority over its territory and is independent in conducting internal and external affairs.",
        difficulty: 'easy'
      }
    ],
    'Fundamental Rights': [
      {
        question: "Which Article abolishes untouchability?",
        options: [
          "Article 14",
          "Article 15",
          "Article 16",
          "Article 17"
        ],
        correct: 3,
        explanation: "Article 17 abolishes untouchability and forbids its practice in any form. It's a punishable offense under law.",
        difficulty: 'easy'
      },
      {
        question: "Which Fundamental Right is available to citizens only and not to foreigners?",
        options: [
          "Right to life",
          "Right to equality before law",
          "Right to freedom of speech",
          "Right against exploitation"
        ],
        correct: 2,
        explanation: "Article 19 (Right to freedom of speech and other freedoms) is available only to Indian citizens, not to foreigners.",
        difficulty: 'medium'
      },
      {
        question: "Right to Education (RTE) was added as a Fundamental Right under which Article?",
        options: [
          "Article 21",
          "Article 21A",
          "Article 22",
          "Article 23"
        ],
        correct: 1,
        explanation: "Article 21A was inserted by the 86th Amendment Act (2002), making education a fundamental right for children aged 6-14 years.",
        difficulty: 'medium'
      }
    ],
    'Fundamental Duties': [
      {
        question: "How many Fundamental Duties are currently in the Indian Constitution?",
        options: [
          "10",
          "11",
          "12",
          "9"
        ],
        correct: 1,
        explanation: "There are 11 Fundamental Duties. Originally 10 were added by the 42nd Amendment (1976), and the 11th was added by the 86th Amendment (2002).",
        difficulty: 'easy'
      },
      {
        question: "Which committee recommended the inclusion of Fundamental Duties?",
        options: [
          "Balwant Rai Mehta Committee",
          "Ashok Mehta Committee",
          "Swaran Singh Committee",
          "L.M. Singhvi Committee"
        ],
        correct: 2,
        explanation: "The Swaran Singh Committee recommended the inclusion of Fundamental Duties, which were added by the 42nd Amendment Act, 1976.",
        difficulty: 'hard'
      }
    ],
    'Directive Principles': [
      {
        question: "Directive Principles are borrowed from which country's constitution?",
        options: [
          "USA",
          "UK",
          "Ireland",
          "Canada"
        ],
        correct: 2,
        explanation: "Directive Principles of State Policy (DPSP) were borrowed from the Irish Constitution of 1937.",
        difficulty: 'medium'
      },
      {
        question: "Which Article directs the state to provide free legal aid?",
        options: [
          "Article 39",
          "Article 39A",
          "Article 40",
          "Article 41"
        ],
        correct: 1,
        explanation: "Article 39A directs the state to provide free legal aid to ensure equal justice for all citizens, especially the poor.",
        difficulty: 'hard'
      }
    ]
  },

  'parliament': {
    'Lok Sabha': [
      {
        question: "What is the maximum strength of Lok Sabha?",
        options: [
          "545",
          "552",
          "550",
          "543"
        ],
        correct: 1,
        explanation: "The maximum strength of Lok Sabha is 552 (530 from states, 20 from Union Territories, and 2 Anglo-Indian members nominated by President).",
        difficulty: 'medium'
      },
      {
        question: "Money Bills can only be introduced in which house?",
        options: [
          "Rajya Sabha",
          "Lok Sabha",
          "Either House",
          "Joint Session"
        ],
        correct: 1,
        explanation: "Money Bills can only be introduced in Lok Sabha as per Article 110. Rajya Sabha can only make recommendations.",
        difficulty: 'easy'
      },
      {
        question: "What is the minimum age to become a Lok Sabha member?",
        options: [
          "21 years",
          "25 years",
          "30 years",
          "35 years"
        ],
        correct: 1,
        explanation: "The minimum age to be elected to Lok Sabha is 25 years, while for Rajya Sabha it is 30 years.",
        difficulty: 'easy'
      }
    ],
    'Rajya Sabha': [
      {
        question: "Rajya Sabha is a permanent house. What fraction retires every two years?",
        options: [
          "One-half",
          "One-third",
          "One-fourth",
          "Two-thirds"
        ],
        correct: 1,
        explanation: "Rajya Sabha is a permanent house and one-third of its members retire every two years, serving a 6-year term.",
        difficulty: 'medium'
      },
      {
        question: "Who is the ex-officio Chairman of Rajya Sabha?",
        options: [
          "President",
          "Prime Minister",
          "Vice President",
          "Speaker"
        ],
        correct: 2,
        explanation: "The Vice President of India is the ex-officio Chairman of Rajya Sabha as per Article 64.",
        difficulty: 'easy'
      }
    ]
  },

  'judiciary': {
    'Supreme Court': [
      {
        question: "How many types of jurisdiction does the Supreme Court have?",
        options: [
          "Two",
          "Three",
          "Four",
          "Five"
        ],
        correct: 3,
        explanation: "Supreme Court has five types of jurisdiction: Original, Appellate, Writ, Advisory, and Review jurisdiction.",
        difficulty: 'hard'
      },
      {
        question: "What is the retirement age of a Supreme Court judge?",
        options: [
          "60 years",
          "62 years",
          "65 years",
          "70 years"
        ],
        correct: 2,
        explanation: "Supreme Court judges retire at 65 years, while High Court judges retire at 62 years.",
        difficulty: 'easy'
      },
      {
        question: "Which Article deals with the 'Basic Structure' doctrine?",
        options: [
          "Article 368",
          "Article 370",
          "Article 356",
          "It's not mentioned in any article"
        ],
        correct: 3,
        explanation: "The 'Basic Structure' doctrine is not mentioned in any article. It was established by the Supreme Court in the Kesavananda Bharati case (1973).",
        difficulty: 'hard'
      }
    ]
  },

  // ==================== GEOGRAPHY ====================
  'physical-geography': {
    'Mountain Systems': [
      {
        question: "Which is the highest peak in India?",
        options: [
          "Mount Everest",
          "K2 (Godwin Austen)",
          "Kanchenjunga",
          "Nanda Devi"
        ],
        correct: 1,
        explanation: "K2 (Godwin Austen) at 8,611m is the highest peak in India, located in the Karakoram Range. Kanchenjunga is the highest peak entirely within India.",
        difficulty: 'medium'
      },
      {
        question: "Which pass connects Manali to Leh?",
        options: [
          "Nathu La",
          "Rohtang Pass",
          "Zoji La",
          "Banihal Pass"
        ],
        correct: 1,
        explanation: "Rohtang Pass connects Manali to Leh and is located on the Manali-Leh highway at an altitude of 3,978 meters.",
        difficulty: 'medium'
      }
    ],
    'River Systems': [
      {
        question: "Which river is known as 'Dakshin Ganga'?",
        options: [
          "Krishna",
          "Kaveri",
          "Godavari",
          "Mahanadi"
        ],
        correct: 2,
        explanation: "Godavari is called 'Dakshin Ganga' (Ganges of the South) as it is the longest river in Peninsular India.",
        difficulty: 'easy'
      },
      {
        question: "Bhakra Nangal Dam is built on which river?",
        options: [
          "Chenab",
          "Ravi",
          "Sutlej",
          "Beas"
        ],
        correct: 2,
        explanation: "Bhakra Nangal Dam is built on the Sutlej River in Himachal Pradesh. It's one of the highest gravity dams in the world.",
        difficulty: 'easy'
      },
      {
        question: "Which river forms the Dhuandhar Falls?",
        options: [
          "Tapti",
          "Narmada",
          "Mahanadi",
          "Godavari"
        ],
        correct: 1,
        explanation: "The Narmada River forms the famous Dhuandhar Falls near Jabalpur in Madhya Pradesh, where the river plunges 30 meters.",
        difficulty: 'medium'
      }
    ],
    'Climate & Monsoons': [
      {
        question: "Which region receives rainfall from retreating monsoon?",
        options: [
          "Western Ghats",
          "Tamil Nadu Coast",
          "Punjab Plains",
          "Assam Valley"
        ],
        correct: 1,
        explanation: "Tamil Nadu coast receives most of its rainfall from the retreating (Northeast) monsoon during October-December.",
        difficulty: 'medium'
      },
      {
        question: "Mawsynram, the wettest place on Earth, is located in which state?",
        options: [
          "Assam",
          "Meghalaya",
          "Arunachal Pradesh",
          "Manipur"
        ],
        correct: 1,
        explanation: "Mawsynram in Meghalaya receives the highest rainfall in the world, averaging about 11,872 mm annually.",
        difficulty: 'easy'
      }
    ],
    'Soil Types': [
      {
        question: "Black soil is most suitable for growing which crop?",
        options: [
          "Rice",
          "Wheat",
          "Cotton",
          "Tea"
        ],
        correct: 2,
        explanation: "Black soil (Regur soil) is ideal for cotton cultivation due to its moisture-retentive capacity and rich in nutrients.",
        difficulty: 'easy'
      },
      {
        question: "Which soil is also known as 'Regur soil'?",
        options: [
          "Alluvial soil",
          "Black soil",
          "Red soil",
          "Laterite soil"
        ],
        correct: 1,
        explanation: "Black soil is also known as Regur soil, found mainly in the Deccan Plateau region and is formed from basaltic lava.",
        difficulty: 'medium'
      }
    ]
  },

  'indian-geography': {
    'States and Capitals': [
      {
        question: "Which is the newest state of India?",
        options: [
          "Jharkhand",
          "Chhattisgarh",
          "Telangana",
          "Uttarakhand"
        ],
        correct: 2,
        explanation: "Telangana became the 29th state of India on June 2, 2014, carved out of Andhra Pradesh.",
        difficulty: 'easy'
      },
      {
        question: "Dispur is the capital of which state?",
        options: [
          "Meghalaya",
          "Assam",
          "Tripura",
          "Manipur"
        ],
        correct: 1,
        explanation: "Dispur is the capital of Assam. It became the capital after Shillong was made the capital of Meghalaya.",
        difficulty: 'medium'
      },
      {
        question: "Which state has the longest coastline in India?",
        options: [
          "Tamil Nadu",
          "Andhra Pradesh",
          "Gujarat",
          "Maharashtra"
        ],
        correct: 2,
        explanation: "Gujarat has the longest coastline among Indian states, stretching about 1,214 km along the Arabian Sea.",
        difficulty: 'medium'
      }
    ]
  },

  // ==================== ECONOMY ====================
  'indian-economy': {
    'Economic Planning': [
      {
        question: "When was NITI Aayog established to replace Planning Commission?",
        options: [
          "January 1, 2014",
          "January 1, 2015",
          "April 1, 2015",
          "January 1, 2016"
        ],
        correct: 1,
        explanation: "NITI Aayog (National Institution for Transforming India) was established on January 1, 2015, replacing the Planning Commission.",
        difficulty: 'easy'
      },
      {
        question: "Which Five Year Plan is known as 'Gadgil Yojana'?",
        options: [
          "Third Plan",
          "Fourth Plan",
          "Fifth Plan",
          "Sixth Plan"
        ],
        correct: 1,
        explanation: "The Fourth Five Year Plan (1969-74) was formulated by D.R. Gadgil and is known as Gadgil Yojana.",
        difficulty: 'hard'
      }
    ],
    'Economic Indicators': [
      {
        question: "India is currently the ___ largest economy in the world by nominal GDP.",
        options: [
          "3rd",
          "4th",
          "5th",
          "6th"
        ],
        correct: 2,
        explanation: "India is the 5th largest economy in the world by nominal GDP, having surpassed the UK in 2022.",
        difficulty: 'medium'
      },
      {
        question: "What does 'LPG' stand for in the context of 1991 economic reforms?",
        options: [
          "Liquified Petroleum Gas",
          "Liberalization, Privatization, Globalization",
          "Liberal Progressive Growth",
          "Local Private Governance"
        ],
        correct: 1,
        explanation: "LPG refers to Liberalization, Privatization, and Globalization - the three pillars of India's 1991 economic reforms.",
        difficulty: 'easy'
      }
    ]
  },

  'banking': {
    'RBI and Banking System': [
      {
        question: "When was the Reserve Bank of India established?",
        options: [
          "1934",
          "1935",
          "1947",
          "1950"
        ],
        correct: 1,
        explanation: "RBI was established on April 1, 1935, under the Reserve Bank of India Act, 1934.",
        difficulty: 'easy'
      },
      {
        question: "What is the current Repo Rate range typically maintained by RBI? (as of 2023)",
        options: [
          "2-4%",
          "4-6.5%",
          "7-9%",
          "10-12%"
        ],
        correct: 1,
        explanation: "RBI typically maintains Repo Rate in the range of 4-6.5% in recent years to balance inflation and growth.",
        difficulty: 'medium'
      },
      {
        question: "Which was the first bank to introduce ATM in India?",
        options: [
          "State Bank of India",
          "ICICI Bank",
          "HSBC",
          "Standard Chartered"
        ],
        correct: 2,
        explanation: "HSBC introduced the first ATM in India in 1987 in Mumbai.",
        difficulty: 'hard'
      }
    ]
  },

  // ==================== SCIENCE & TECHNOLOGY ====================
  'physics': {
    'General Science & Technology': [
      {
        question: "Which color has the longest wavelength in visible light?",
        options: [
          "Violet",
          "Blue",
          "Green",
          "Red"
        ],
        correct: 3,
        explanation: "Red light has the longest wavelength (about 700 nm) in the visible spectrum, while violet has the shortest.",
        difficulty: 'easy'
      },
      {
        question: "What is the speed of sound in air at room temperature?",
        options: [
          "143 m/s",
          "243 m/s",
          "343 m/s",
          "443 m/s"
        ],
        correct: 2,
        explanation: "The speed of sound in air at room temperature (20°C) is approximately 343 meters per second.",
        difficulty: 'medium'
      }
    ]
  },

  'biology': {
    'Photosynthesis': [
      {
        question: "Which pigment is primarily responsible for photosynthesis?",
        options: [
          "Carotene",
          "Xanthophyll",
          "Chlorophyll",
          "Anthocyanin"
        ],
        correct: 2,
        explanation: "Chlorophyll is the primary pigment that absorbs light energy for photosynthesis, giving plants their green color.",
        difficulty: 'easy'
      },
      {
        question: "In which part of the chloroplast does the light reaction occur?",
        options: [
          "Stroma",
          "Thylakoid membrane",
          "Inner membrane",
          "Outer membrane"
        ],
        correct: 1,
        explanation: "Light reactions occur in the thylakoid membrane, while dark reactions (Calvin cycle) occur in the stroma.",
        difficulty: 'medium'
      },
      {
        question: "What is the primary product of photosynthesis?",
        options: [
          "Oxygen",
          "Carbon dioxide",
          "Glucose",
          "Water"
        ],
        correct: 2,
        explanation: "Glucose (C6H12O6) is the primary product of photosynthesis, while oxygen is a by-product.",
        difficulty: 'easy'
      }
    ],
    'Human Body Systems': [
      {
        question: "How many chambers does the human heart have?",
        options: [
          "Two",
          "Three",
          "Four",
          "Five"
        ],
        correct: 2,
        explanation: "The human heart has four chambers: two atria (upper chambers) and two ventricles (lower chambers).",
        difficulty: 'easy'
      },
      {
        question: "Which blood cells are responsible for immunity?",
        options: [
          "Red blood cells",
          "White blood cells",
          "Platelets",
          "Plasma cells"
        ],
        correct: 1,
        explanation: "White blood cells (leukocytes) are responsible for immunity and fighting infections in the body.",
        difficulty: 'easy'
      }
    ]
  },

  'space-technology': {
    'ISRO Missions': [
      {
        question: "What was India's first satellite?",
        options: [
          "Bhaskara",
          "Rohini",
          "Aryabhata",
          "INSAT"
        ],
        correct: 2,
        explanation: "Aryabhata was India's first satellite, launched on April 19, 1975, from the Soviet Union.",
        difficulty: 'easy'
      },
      {
        question: "Chandrayaan-1 discovered which element on the Moon?",
        options: [
          "Helium-3",
          "Water/Hydroxyl",
          "Uranium",
          "Platinum"
        ],
        correct: 1,
        explanation: "Chandrayaan-1 confirmed the presence of water molecules/hydroxyl on the lunar surface in 2009.",
        difficulty: 'medium'
      },
      {
        question: "Which was the first country to successfully reach Mars orbit in its first attempt?",
        options: [
          "USA",
          "Russia",
          "China",
          "India"
        ],
        correct: 3,
        explanation: "India became the first country to successfully reach Mars orbit in its first attempt with Mars Orbiter Mission (Mangalyaan) in 2014.",
        difficulty: 'easy'
      }
    ],
    'Solar System': [
      {
        question: "Which planet has the most moons?",
        options: [
          "Jupiter",
          "Saturn",
          "Uranus",
          "Neptune"
        ],
        correct: 1,
        explanation: "Saturn has the most moons with 82 confirmed satellites, surpassing Jupiter's 79 moons.",
        difficulty: 'medium'
      },
      {
        question: "What is the hottest planet in our solar system?",
        options: [
          "Mercury",
          "Venus",
          "Mars",
          "Jupiter"
        ],
        correct: 1,
        explanation: "Venus is the hottest planet due to its thick atmosphere causing extreme greenhouse effect, despite Mercury being closer to the Sun.",
        difficulty: 'easy'
      }
    ]
  },

  // ==================== CURRENT AFFAIRS ====================
  'national-affairs': {
    'Government Schemes & Policies': [
      {
        question: "PM-KISAN scheme provides how much annual income support to farmers?",
        options: [
          "₹4,000",
          "₹5,000",
          "₹6,000",
          "₹8,000"
        ],
        correct: 2,
        explanation: "PM-KISAN provides ₹6,000 per year to eligible farmers in three equal installments of ₹2,000 each.",
        difficulty: 'easy'
      },
      {
        question: "What is the target year for India to achieve Net Zero emissions?",
        options: [
          "2030",
          "2050",
          "2070",
          "2080"
        ],
        correct: 2,
        explanation: "India has committed to achieving Net Zero emissions by 2070, announced at COP26 Glasgow summit.",
        difficulty: 'medium'
      },
      {
        question: "Under which scheme was JAM Trinity introduced?",
        options: [
          "Digital India",
          "Direct Benefit Transfer",
          "Make in India",
          "Skill India"
        ],
        correct: 1,
        explanation: "JAM (Jan Dhan-Aadhaar-Mobile) Trinity was introduced under Direct Benefit Transfer scheme to ensure targeted delivery of subsidies.",
        difficulty: 'medium'
      }
    ]
  },

  'international-affairs': {
    'Global Politics & Organizations': [
      {
        question: "India is a founding member of which organization?",
        options: [
          "United Nations",
          "World Bank",
          "Asian Development Bank",
          "All of the above"
        ],
        correct: 3,
        explanation: "India is a founding member of the UN (1945), World Bank (1944), and Asian Development Bank (1966).",
        difficulty: 'easy'
      },
      {
        question: "Which countries form the QUAD grouping?",
        options: [
          "USA, Russia, India, China",
          "USA, Japan, India, Australia",
          "USA, UK, France, Germany",
          "Brazil, Russia, India, China"
        ],
        correct: 1,
        explanation: "QUAD consists of USA, Japan, India, and Australia - four democracies committed to a free and open Indo-Pacific.",
        difficulty: 'easy'
      }
    ]
  },

  // ==================== ENVIRONMENT ====================
  'ecology': {
    'Biodiversity & Natural Balance': [
      {
        question: "India is one of the 17 megadiverse countries. What percentage of world's biodiversity does it have?",
        options: [
          "2-3%",
          "5-6%",
          "7-8%",
          "10-12%"
        ],
        correct: 2,
        explanation: "India harbors 7-8% of world's biodiversity despite having only 2.4% of world's land area.",
        difficulty: 'medium'
      },
      {
        question: "Which is India's first National Park?",
        options: [
          "Kanha National Park",
          "Jim Corbett National Park",
          "Gir National Park",
          "Kaziranga National Park"
        ],
        correct: 1,
        explanation: "Jim Corbett National Park (established in 1936 as Hailey National Park) was India's first national park.",
        difficulty: 'easy'
      }
    ]
  },

  'climate-change': {
    'Global Climate Issues': [
      {
        question: "What is India's target for renewable energy capacity by 2030?",
        options: [
          "300 GW",
          "400 GW",
          "500 GW",
          "600 GW"
        ],
        correct: 2,
        explanation: "India has set an ambitious target of 500 GW of renewable energy capacity by 2030.",
        difficulty: 'medium'
      }
    ]
  }
};

// Default fallback quizzes
const DEFAULT_QUIZZES: SubtopicQuiz[] = [
  {
    question: "This topic is important for competitive exams. What should you focus on?",
    options: [
      "Only memorizing facts",
      "Understanding concepts and applications",
      "Skipping this topic",
      "Reading only current affairs"
    ],
    correct: 1,
    explanation: "Understanding concepts and their applications is key to mastering any topic for competitive exams.",
    difficulty: 'easy'
  }
];

// Helper function to get questions for a specific subtopic
export const getSubtopicQuestions = (topicId: string, subtopic: string): SubtopicQuiz[] => {
  const topicQuizzes = SUBTOPIC_QUIZZES[topicId];
  if (!topicQuizzes) {
    return DEFAULT_QUIZZES;
  }
  
  const subtopicQuizzes = topicQuizzes[subtopic];
  if (!subtopicQuizzes || subtopicQuizzes.length === 0) {
    // Try to find a close match
    const closeMatch = Object.keys(topicQuizzes).find(key => 
      key.toLowerCase().includes(subtopic.toLowerCase()) ||
      subtopic.toLowerCase().includes(key.toLowerCase())
    );
    
    if (closeMatch) {
      return topicQuizzes[closeMatch];
    }
    
    return DEFAULT_QUIZZES;
  }
  
  return subtopicQuizzes;
};

// Get random questions from a subtopic
export const getRandomQuestions = (topicId: string, subtopic: string, count: number = 2): SubtopicQuiz[] => {
  const questions = getSubtopicQuestions(topicId, subtopic);
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};
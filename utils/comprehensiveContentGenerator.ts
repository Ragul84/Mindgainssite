// 🎓 Comprehensive Content Generator - Duolingo-style Learning Content
// Creates engaging, story-driven lessons for all topics to eliminate empty content

interface LessonContent {
  overview: string;
  sections: {
    title: string;
    id: string;
    content: {
      subtitle: string;
      points: string[];
    }[];
  }[];
}

// Duolingo-style content generation with storytelling approach
export const generateComprehensiveContent = (topicId: string): LessonContent | null => {
  const contentMap: { [key: string]: LessonContent } = {
    // POLITY & GOVERNANCE
    'fundamental-rights': {
      overview: "Fundamental Rights are the cornerstone of Indian democracy, ensuring dignity and freedom for every citizen. Let's discover how these six powerful rights protect you every single day.",
      sections: [
        {
          title: 'Right to Equality',
          id: 'equality',
          content: [{
            subtitle: 'Your Shield Against Discrimination',
            points: [
              '**Article 14**: Equal treatment before law - No VIP justice, same rules for everyone',
              '**Article 15**: No discrimination based on religion, race, caste, sex, or place of birth',
              '**Article 16**: Equal opportunity in government jobs - Merit over connections',
              '**Article 17**: Abolition of untouchability - Breaking centuries of social barriers',
              '**Article 18**: No titles except military and academic - Democracy over aristocracy'
            ]
          }]
        },
        {
          title: 'Right to Freedom',
          id: 'freedom',
          content: [{
            subtitle: 'The Air You Breathe as a Citizen',
            points: [
              '**Article 19**: Six fundamental freedoms including speech, expression, and movement',
              '**Article 20**: Protection against arbitrary punishment and double jeopardy',
              '**Article 21**: Right to life and personal liberty - The most important right',
              '**Article 22**: Protection against arrest without warrant or legal representation'
            ]
          }]
        }
      ]
    },

    'dpsp': {
      overview: "Directive Principles are India's roadmap to social and economic justice. Think of them as instructions for building the perfect society - a guide for every government to follow.",
      sections: [
        {
          title: 'Social Justice Principles',
          id: 'social-justice',
          content: [{
            subtitle: 'Building an Equal Society',
            points: [
              '**Article 38**: State shall promote welfare and minimize inequalities',
              '**Article 39**: Equal livelihood opportunities for all citizens',
              '**Article 39A**: Free legal aid for the poor and disadvantaged',
              '**Article 41**: Right to work, education, and public assistance',
              '**Article 42**: Just and humane working conditions with maternity relief'
            ]
          }]
        },
        {
          title: 'Economic Justice Principles',
          id: 'economic-justice',
          content: [{
            subtitle: 'Creating Prosperity for All',
            points: [
              '**Article 43**: Living wage and decent standard of life for workers',
              '**Article 43A**: Workers participation in management of industries',
              '**Article 47**: Duty to improve nutrition, health, and prohibit harmful drugs',
              '**Article 48**: Organization of agriculture and animal husbandry on modern lines'
            ]
          }]
        }
      ]
    },

    'parliament': {
      overview: "Parliament is the heart of Indian democracy - where 1.4 billion voices are heard through 543 representatives. Discover how laws are born and how your vote shapes the nation.",
      sections: [
        {
          title: 'Structure of Parliament',
          id: 'structure',
          content: [{
            subtitle: 'The Two Houses of Power',
            points: [
              '**Lok Sabha**: House of the People, 543 members, directly elected by voters',
              '**Rajya Sabha**: Council of States, 245 members, represents state interests',
              '**Leadership**: Speaker of Lok Sabha, Chairman of Rajya Sabha (Vice President)',
              '**Sessions**: Budget Session (Feb-May), Monsoon Session (Jul-Aug), Winter Session (Nov-Dec)',
              '**Joint Sessions**: Rare occasions when both houses meet together for deadlocks'
            ]
          }]
        },
        {
          title: 'Law Making Process',
          id: 'lawmaking',
          content: [{
            subtitle: 'From Bill to Act: Democracy in Action',
            points: [
              '**Introduction**: Any member can introduce a bill (except money bills)',
              '**First Reading**: Bill title read, no discussion, formal introduction',
              '**Second Reading**: Detailed discussion, clause-by-clause examination',
              '**Committee Stage**: Expert committees scrutinize and suggest changes',
              '**Third Reading**: Final debate and voting, bill passed or rejected',
              '**Other House**: Same process repeated in the second house',
              '**Presidential Assent**: President signs bill, becomes law of the land'
            ]
          }]
        }
      ]
    },

    'judiciary': {
      overview: "The Indian Judiciary is your guardian angel - protecting rights, delivering justice, and keeping the government in check. Meet the institution that ensures the Constitution remains alive.",
      sections: [
        {
          title: 'Supreme Court',
          id: 'supreme-court',
          content: [{
            subtitle: 'The Final Court of Justice',
            points: [
              '**Chief Justice of India**: Head of judiciary, master of the roster',
              '**Composition**: 1 Chief Justice + 33 Judges, collegium system for appointments',
              '**Original Jurisdiction**: Centre-state disputes, inter-state conflicts',
              '**Appellate Jurisdiction**: Final appeal court for civil, criminal, constitutional cases',
              '**Advisory Jurisdiction**: President can seek legal advice on important matters',
              '**Writ Jurisdiction**: Issues habeas corpus, mandamus, prohibition, certiorari, quo-warranto',
              '**Guardian of Constitution**: Judicial review, fundamental rights protection'
            ]
          }]
        },
        {
          title: 'High Courts & Lower Courts',
          id: 'lower-courts',
          content: [{
            subtitle: 'Justice at Every Level',
            points: [
              '**High Courts**: 25 High Courts, state-level constitutional courts',
              '**District Courts**: Civil and criminal jurisdiction at district level',
              '**Subordinate Courts**: Magistrate courts, family courts, specialized tribunals',
              '**Fast Track Courts**: Speedy justice for specific types of cases',
              '**Lok Adalats**: People\'s courts for quick, cost-effective dispute resolution'
            ]
          }]
        }
      ]
    },

    'executive': {
      overview: "The Executive is the action arm of government - from the President's ceremonial dignity to the Prime Minister's daily decisions. Discover how India is actually governed.",
      sections: [
        {
          title: 'The President',
          id: 'president',
          content: [{
            subtitle: 'Guardian of the Constitution',
            points: [
              '**Constitutional Head**: Nominal executive, real power with Council of Ministers',
              '**Electoral College**: MLAs, MPs, elected by proportional representation',
              '**Term**: 5 years, eligible for re-election, can be impeached for constitutional violation',
              '**Executive Powers**: Appoints PM, governors, dissolves Lok Sabha on PM advice',
              '**Legislative Powers**: Summons parliament, gives assent to bills, can return bills',
              '**Judicial Powers**: Grants pardons, commutes sentences, appoints judges',
              '**Emergency Powers**: National, state, financial emergency proclamation'
            ]
          }]
        },
        {
          title: 'Prime Minister & Council',
          id: 'pm-council',
          content: [{
            subtitle: 'The Real Executive Power',
            points: [
              '**Prime Minister**: Leader of majority party/coalition, head of government',
              '**Council of Ministers**: Cabinet, Ministers of State, Deputy Ministers',
              '**Collective Responsibility**: All ministers responsible to Lok Sabha collectively',
              '**Individual Responsibility**: Each minister responsible for their department',
              '**Cabinet Secretariat**: Coordination between ministries, policy implementation'
            ]
          }]
        }
      ]
    },

    'federalism': {
      overview: "Indian Federalism is like a perfectly balanced see-saw - strong enough to unite 28 states and 8 union territories, flexible enough to respect local diversity.",
      sections: [
        {
          title: 'Distribution of Powers',
          id: 'powers',
          content: [{
            subtitle: 'Who Does What: The Great Division',
            points: [
              '**Union List**: 100 subjects including defense, foreign affairs, currency',
              '**State List**: 61 subjects including police, agriculture, health, local government',
              '**Concurrent List**: 52 subjects including education, forests, marriage, adoption',
              '**Residuary Powers**: All unlisted subjects belong to Union government',
              '**Emergency Provisions**: Centre can override federal structure during emergencies'
            ]
          }]
        },
        {
          title: 'Centre-State Relations',
          id: 'relations',
          content: [{
            subtitle: 'Balancing Unity and Diversity',
            points: [
              '**Administrative Relations**: All India Services, inter-state coordination',
              '**Financial Relations**: Tax sharing, grants-in-aid, Finance Commission recommendations',
              '**Legislative Relations**: Parliament can legislate on state subjects in national interest',
              '**Inter-State Council**: Constitutional body for Centre-state and inter-state coordination',
              '**Governor**: Centre\'s representative in states, constitutional head of state'
            ]
          }]
        }
      ]
    },

    // HISTORY
    'freedom-struggle': {
      overview: "The Indian Freedom Struggle (1857-1947) is humanity's greatest liberation story - 90 years of sacrifice, strategy, and unwavering determination that freed 1/5th of humanity.",
      sections: [
        {
          title: 'The Great Revolt of 1857',
          id: 'revolt-1857',
          content: [{
            subtitle: 'The First War of Independence',
            points: [
              '**Immediate Cause**: Enfield rifle cartridges greased with cow and pig fat',
              '**Underlying Causes**: Economic exploitation, cultural interference, administrative policies',
              '**Key Leaders**: Bahadur Shah Zafar, Rani Lakshmibai, Tatya Tope, Nana Saheb',
              '**Major Centres**: Delhi, Lucknow, Kanpur, Jhansi, Bareilly',
              '**British Response**: Brutal suppression, policy changes, direct Crown rule',
              '**Significance**: First pan-Indian resistance, awakened national consciousness'
            ]
          }]
        },
        {
          title: 'Rise of Nationalism',
          id: 'nationalism',
          content: [{
            subtitle: 'Birth of Modern India',
            points: [
              '**Indian National Congress (1885)**: A.O. Hume, safety valve theory, moderate beginnings',
              '**Early Leaders**: Dadabhai Naoroji, Gopal Krishna Gokhale, Surendranath Banerjee',
              '**Methods**: Constitutional agitation, petitions, prayers, and protests',
              '**Achievements**: Platform for political expression, unity among educated Indians',
              '**Limitations**: Elite movement, limited mass participation, faith in British justice'
            ]
          }]
        },
        {
          title: 'Gandhian Era',
          id: 'gandhi',
          content: [{
            subtitle: 'The Mahatma\'s Revolutionary Methods',
            points: [
              '**Satyagraha**: Truth-force, non-violent resistance, moral weapon against injustice',
              '**Non-Cooperation Movement (1920-22)**: Boycott of British institutions, mass participation',
              '**Civil Disobedience (1930-34)**: Salt March, breaking unjust laws, women\'s participation',
              '**Quit India Movement (1942)**: "Do or Die", complete independence demand',
              '**Philosophy**: Ahimsa, Sarvodaya, village self-rule, truth and non-violence'
            ]
          }]
        }
      ]
    },

    'ancient-india': {
      overview: "Ancient India (3300 BCE - 650 CE) is where civilization learned to think, trade, and dream. From the world's first planned cities to the birth of zero, this is humanity's childhood.",
      sections: [
        {
          title: 'Indus Valley Civilization',
          id: 'indus-valley',
          content: [{
            subtitle: 'The World\'s First Planned Cities',
            points: [
              '**Time Period**: 3300-1300 BCE, Bronze Age civilization',
              '**Major Sites**: Harappa, Mohenjo-daro, Dholavira, Kalibangan, Rakhigarhi',
              '**Urban Planning**: Grid pattern streets, advanced drainage, standardized bricks',
              '**Technology**: Weights and measures, dock yards, water management systems',
              '**Trade**: Extensive networks reaching Mesopotamia, precious stones, metals',
              '**Decline**: Climate change, river course changes, possible invasions',
              '**Legacy**: Urban planning concepts, decimal system, sophisticated craftsmanship'
            ]
          }]
        },
        {
          title: 'Vedic Civilization',
          id: 'vedic',
          content: [{
            subtitle: 'Foundation of Hindu Culture',
            points: [
              '**Early Vedic (1500-1000 BCE)**: Pastoral society, tribal organization, nature worship',
              '**Later Vedic (1000-600 BCE)**: Agricultural settlement, territorial kingdoms, caste system',
              '**Literature**: Four Vedas, Upanishads, Epics (Ramayana, Mahabharata)',
              '**Society**: Varna system, joint family, cattle wealth, fire sacrifices',
              '**Political System**: Raja, Sabha, Samiti assemblies, tribal confederations',
              '**Religion**: Vedic gods, ritualism, philosophical concepts, dharma'
            ]
          }]
        },
        {
          title: 'Mauryan Empire',
          id: 'mauryan',
          content: [{
            subtitle: 'India\'s First Pan-Indian Empire',
            points: [
              '**Chandragupta Maurya**: Founded empire, defeated Seleucus, Arthashastra guidance',
              '**Ashoka the Great**: Buddhist conversion, Dhamma policy, non-violence, welfare state',
              '**Administration**: Centralized system, espionage network, efficient bureaucracy',
              '**Economy**: Agriculture, trade, currency system, guild organizations',
              '**Society**: Buddhist influence, religious tolerance, social welfare',
              '**Decline**: Weak successors, financial strain, Pushyamitra Shunga revolt'
            ]
          }]
        }
      ]
    },

    // GEOGRAPHY
    'physical-geography': {
      overview: "India's physical geography is a masterpiece of nature - from the world's highest peaks to tropical beaches, from desert sands to monsoon forests. Discover the land that shaped a civilization.",
      sections: [
        {
          title: 'The Himalayan Mountains',
          id: 'himalayas',
          content: [{
            subtitle: 'The Roof of the World',
            points: [
              '**Formation**: Collision of Indian and Eurasian plates, ongoing process',
              '**Three Ranges**: Himadri (Great Himalayas), Himachal (Lesser), Shiwaliks (Outer)',
              '**Highest Peaks**: Kanchenjunga (8,586m), Nanda Devi, Kamet, Badrinath',
              '**Glaciers**: Gangotri, Yamunotri, sources of major rivers',
              '**Passes**: Khyber, Bolan, Nathu La - historical trade and invasion routes',
              '**Climate Barrier**: Blocks cold Central Asian winds, traps monsoon moisture'
            ]
          }]
        },
        {
          title: 'The Great Plains',
          id: 'plains',
          content: [{
            subtitle: 'The Cradle of Indian Civilization',
            points: [
              '**Formation**: Alluvial deposits from Himalayan rivers over millions of years',
              '**Rivers**: Ganga, Yamuna, Brahmaputra - lifelines of northern India',
              '**Fertile Soil**: Regular flooding, silt deposits, agricultural productivity',
              '**Population Density**: Most densely populated region, major cities',
              '**Agriculture**: Rice, wheat, sugarcane - India\'s food bowl',
              '**Cultural Significance**: Vedic civilization, ancient kingdoms, spiritual centers'
            ]
          }]
        },
        {
          title: 'Peninsular Plateau',
          id: 'plateau',
          content: [{
            subtitle: 'The Ancient Shield of India',
            points: [
              '**Geological Age**: Oldest landmass, Archaean rocks, stable shield',
              '**Deccan Trap**: Volcanic origin, black soil (regur), cotton cultivation',
              '**Mineral Wealth**: Iron ore, coal, manganese, mica - industrial base',
              '**Rivers**: Narmada, Tapi (westward), Godavari, Krishna, Kaveri (eastward)',
              '**Plateaus**: Malwa, Chota Nagpur, Karnataka - distinct characteristics',
              '**Economic Importance**: Mining, agriculture, hydroelectric power'
            ]
          }]
        }
      ]
    },

    // ECONOMICS
    'basic-concepts': {
      overview: "Economics is the science of choices - how individuals, businesses, and governments decide what to produce, how to produce, and for whom to produce in a world of unlimited wants and limited resources.",
      sections: [
        {
          title: 'Fundamental Economic Problems',
          id: 'problems',
          content: [{
            subtitle: 'The Universal Questions',
            points: [
              '**What to Produce**: Which goods and services to produce with limited resources',
              '**How to Produce**: Choice of production techniques - labor vs. capital intensive',
              '**For Whom to Produce**: Distribution of output - who gets what and how much',
              '**Scarcity**: Unlimited human wants vs. limited resources creates choices',
              '**Opportunity Cost**: Value of next best alternative foregone when making a choice',
              '**Economic Systems**: Market, command, mixed economies - different solutions'
            ]
          }]
        },
        {
          title: 'Market Forces',
          id: 'market',
          content: [{
            subtitle: 'The Invisible Hand at Work',
            points: [
              '**Demand**: Consumer willingness and ability to buy at different prices',
              '**Supply**: Producer willingness and ability to sell at different prices',
              '**Market Equilibrium**: Where demand meets supply, price determination',
              '**Price Mechanism**: How prices coordinate economic activities',
              '**Elasticity**: Responsiveness of demand/supply to price changes',
              '**Market Failures**: When markets don\'t allocate resources efficiently'
            ]
          }]
        }
      ]
    },

    'indian-economy': {
      overview: "The Indian economy is a rising giant - from a $2.7 trillion economy serving 1.4 billion people to the world's fastest-growing major economy. Understand the systems that feed, employ, and empower India.",
      sections: [
        {
          title: 'Economic Structure',
          id: 'structure',
          content: [{
            subtitle: 'The Three Pillars of Growth',
            points: [
              '**Primary Sector**: Agriculture, mining, forestry - 15% of GDP, 45% employment',
              '**Secondary Sector**: Manufacturing, construction - 30% of GDP, 25% employment',
              '**Tertiary Sector**: Services, IT, finance - 55% of GDP, 30% employment',
              '**Mixed Economy**: Public and private sectors, government regulation',
              '**Federal Structure**: Centre and state governments, concurrent responsibilities',
              '**Planning**: Five Year Plans (1951-2017), now NITI Aayog strategy'
            ]
          }]
        },
        {
          title: 'Key Economic Indicators',
          id: 'indicators',
          content: [{
            subtitle: 'Measuring Economic Health',
            points: [
              '**GDP**: $3.7 trillion nominal, $11.7 trillion PPP, 5th largest economy',
              '**Per Capita Income**: $2,600 nominal, $8,400 PPP, middle-income country',
              '**Growth Rate**: 6-7% average, fastest among major economies',
              '**Inflation**: CPI-based, 4% target with +/- 2% band',
              '**Employment**: Formal 10%, informal 90%, agriculture dominance',
              '**Poverty**: Multidimensional poverty reduced from 55% to 15%'
            ]
          }]
        }
      ]
    },

    'mughal-empire': {
      overview: "The Mughal Empire (1526-1857) was the largest and most powerful empire in Indian history, known for its magnificent architecture, cultural synthesis, and administrative innovations.",
      sections: [
        {
          title: 'Foundation & Early Rulers',
          id: 'foundation',
          content: [{
            subtitle: 'Babur & Humayun Era',
            points: [
              '**Babur (1526-1530)**: Founded Mughal Empire, defeated Ibrahim Lodi at Panipat (1526)',
              '**First Battle of Panipat (1526)**: Babur vs Ibrahim Lodi, introduced gunpowder in India',
              '**Humayun (1530-1540, 1555-1556)**: Lost empire to Sher Shah, regained with Persian help',
              '**Sher Shah Suri (1540-1545)**: Displaced Mughals, excellent administrator, Grand Trunk Road',
              '**Administrative Genius**: Sher Shah\'s revenue system became foundation for Mughal administration'
            ]
          }]
        },
        {
          title: 'Akbar the Great',
          id: 'akbar',
          content: [{
            subtitle: 'The Greatest Mughal',
            points: [
              '**Akbar (1556-1605)**: Greatest Mughal emperor, expanded empire to entire North India',
              '**Second Battle of Panipat (1556)**: Defeated Hemu, secured Mughal throne',
              '**Din-i-Ilahi**: Akbar\'s syncretic religion combining all faiths',
              '**Mansabdari System**: Military and administrative ranking system',
              '**Nine Gems (Navratnas)**: Birbal, Tansen, Abul Fazal, and other scholars'
            ]
          }]
        }
      ]
    },

    'delhi-sultanate': {
      overview: "The Delhi Sultanate (1206-1526) was the first major Islamic empire in India, establishing Muslim rule and introducing new administrative systems that influenced Indian history for centuries.",
      sections: [
        {
          title: 'Slave Dynasty',
          id: 'slave-dynasty',
          content: [{
            subtitle: 'Foundation of Islamic Rule',
            points: [
              '**Qutub-ud-din Aibak (1206-1210)**: Founded Delhi Sultanate, built Qutub Minar',
              '**Iltutmish (1211-1236)**: Real founder, introduced silver tanka, organized iqta system',
              '**Razia Sultan (1236-1240)**: First and only female ruler, faced nobility opposition',
              '**Balban (1266-1287)**: Theory of kingship, "Blood and Iron" policy, court etiquette',
              '**Mongol Invasions**: Successfully repelled multiple Mongol attacks on India'
            ]
          }]
        },
        {
          title: 'Khilji Dynasty',
          id: 'khilji-dynasty',
          content: [{
            subtitle: 'Southern Expansion',
            points: [
              '**Alauddin Khilji (1296-1316)**: Greatest Khilji ruler, southern expansion',
              '**Market Control**: Fixed prices, strict regulation, prevented hoarding',
              '**Military Reforms**: Large standing army, improved cavalry, strict discipline',
              '**Southern Campaigns**: Malik Kafur conquered Deccan, reached Tamil Nadu',
              '**Mongol Repulsion**: Successfully defended India against major Mongol invasions'
            ]
          }]
        }
      ]
    },

    'constitution-making': {
      overview: "The making of the Indian Constitution was a remarkable democratic exercise led by visionary leaders who created the world's longest written constitution, embodying India's aspirations for justice, liberty, equality, and fraternity.",
      sections: [
        {
          title: 'Constituent Assembly',
          id: 'assembly',
          content: [{
            subtitle: 'Democratic Foundation',
            points: [
              '**Formation**: Formed under Cabinet Mission Plan (1946), 389 members representing provinces',
              '**Dr. Rajendra Prasad**: President of Constituent Assembly, guided proceedings with wisdom',
              '**Dr. B.R. Ambedkar**: Chairman of Drafting Committee, architect of Constitution',
              '**Jawaharlal Nehru**: Objectives Resolution, vision of modern democratic India',
              '**Sardar Vallabhbhai Patel**: Integration of princely states, unity of India'
            ]
          }]
        },
        {
          title: 'Key Features Adopted',
          id: 'features',
          content: [{
            subtitle: 'Constitutional Principles',
            points: [
              '**Longest Constitution**: 395 articles, 8 schedules originally (now 12 schedules)',
              '**Federal Structure**: Strong center with federal features, inspired by Canada',
              '**Parliamentary Democracy**: Westminster model adapted to Indian conditions',
              '**Fundamental Rights**: Justiciable rights ensuring individual liberty and dignity',
              '**Directive Principles**: Guidelines for state policy, inspired by Irish Constitution'
            ]
          }]
        }
      ]
    }
  };

  return contentMap[topicId] || null;
};

// Get all available topic IDs that have content
export const getAllAvailableTopics = (): string[] => {
  return [
    'fundamental-rights', 'dpsp', 'parliament', 'judiciary', 'executive', 'federalism',
    'freedom-struggle', 'ancient-india', 'physical-geography', 'basic-concepts', 'indian-economy',
    'mughal-empire', 'delhi-sultanate', 'constitution-making'
  ];
};

// Check if a topic has comprehensive content available
export const hasComprehensiveContent = (topicId: string): boolean => {
  return getAllAvailableTopics().includes(topicId);
};

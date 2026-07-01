// Priority-based topics for competitive exams (UPSC, TNPSC, SSC)
export interface ExamTopic {
  id: string;
  title: string;
  subject: string;
  color: string;
  unitNumber: number;
  description: string;
  totalXP: number;
  icon: string;
  priority: 1 | 2 | 3 | 4 | 5; // 1 = Most Important
  examRelevance: ('UPSC' | 'TNPSC' | 'SSC' | 'Banking' | 'State PSC')[];
  lessons: SubtopicLesson[];
  isCompleteContent: boolean; // Whether content is fully available
}

export interface SubtopicLesson {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'practice';
  completed: boolean;
  locked: boolean;
  description?: string;
  route: string;
  topicId: string;
}

// PRIORITY 1: MUST KNOW - Core subjects for all competitive exams
export const PRIORITY_1_TOPICS: ExamTopic[] = [
  {
    id: 'indian-constitution',
    title: 'Indian Constitution',
    subject: 'Polity',
    color: '#10B981',
    unitNumber: 1,
    description: 'Foundation of Indian Democracy',
    totalXP: 500,
    icon: 'scroll',
    priority: 1,
    examRelevance: ['UPSC', 'TNPSC', 'SSC', 'State PSC'],
    isCompleteContent: true,
    lessons: [
      {
        id: 'constitution-making',
        title: 'Making of Constitution',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Constituent Assembly, Dr. Ambedkar, Features',
        route: '/study/reading-interface',
        topicId: 'constitution-basics'
      },
      {
        id: 'preamble',
        title: 'Preamble & Philosophy',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Socialist, Secular, Democratic Republic',
        route: '/study/reading-interface',
        topicId: 'constitution-basics'
      },
      {
        id: 'fundamental-rights',
        title: 'Fundamental Rights',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Articles 12-35, Right to Equality, Freedom',
        route: '/study/reading-interface',
        topicId: 'fundamental-rights'
      },
      {
        id: 'fundamental-duties',
        title: 'Fundamental Duties',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Article 51A, 11 Duties of Citizens',
        route: '/study/reading-interface',
        topicId: 'fundamental-rights'
      },
      {
        id: 'dpsp',
        title: 'Directive Principles',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Articles 36-51, Social & Economic Justice',
        route: '/study/reading-interface',
        topicId: 'dpsp'
      },
      {
        id: 'constitution-quiz',
        title: 'Constitution Quiz',
        type: 'quiz',
        completed: false,
        locked: false,
        description: 'Test your knowledge',
        route: '/quiz/topic-quiz',
        topicId: 'constitution-basics'
      }
    ]
  },
  {
    id: 'delhi-sultanate',
    title: 'Delhi Sultanate',
    subject: 'History',
    color: '#FF6B6B',
    unitNumber: 2,
    description: '1206-1526 CE - Foundation of Muslim Rule',
    totalXP: 450,
    icon: 'fort',
    priority: 1,
    examRelevance: ['UPSC', 'TNPSC', 'SSC'],
    isCompleteContent: true,
    lessons: [
      {
        id: 'slave-dynasty',
        title: 'Slave Dynasty',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Qutub-ud-din Aibak to Balban',
        route: '/study/reading-interface',
        topicId: 'delhi-sultanate'
      },
      {
        id: 'khilji-dynasty',
        title: 'Khilji Dynasty',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Alauddin Khilji & Market Reforms',
        route: '/study/reading-interface',
        topicId: 'delhi-sultanate'
      },
      {
        id: 'tughlaq-dynasty',
        title: 'Tughlaq Dynasty',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Muhammad bin Tughlaq Experiments',
        route: '/study/reading-interface',
        topicId: 'delhi-sultanate'
      },
      {
        id: 'sayyid-lodi',
        title: 'Sayyid & Lodi Dynasty',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Decline & Fall to Mughals',
        route: '/study/reading-interface',
        topicId: 'delhi-sultanate'
      },
      {
        id: 'sultanate-administration',
        title: 'Administration & Economy',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Iqta System, Revenue, Military',
        route: '/study/reading-interface',
        topicId: 'delhi-sultanate'
      },
      {
        id: 'sultanate-quiz',
        title: 'Sultanate Quiz',
        type: 'quiz',
        completed: false,
        locked: false,
        description: 'Test your knowledge',
        route: '/quiz/topic-quiz',
        topicId: 'delhi-sultanate'
      }
    ]
  },
  {
    id: 'mughal-empire',
    title: 'Mughal Empire',
    subject: 'History',
    color: '#DC2626',
    unitNumber: 3,
    description: 'Babur to Aurangzeb (1526-1707)',
    totalXP: 500,
    icon: 'crown',
    priority: 1,
    examRelevance: ['UPSC', 'TNPSC', 'SSC'],
    isCompleteContent: true,
    lessons: [
      {
        id: 'babur-humayun',
        title: 'Babur & Humayun',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Foundation & Early Challenges',
        route: '/study/reading-interface',
        topicId: 'mughal-empire'
      },
      {
        id: 'akbar-great',
        title: 'Akbar the Great',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Din-i-Ilahi, Mansabdari, Expansion',
        route: '/study/reading-interface',
        topicId: 'mughal-empire'
      },
      {
        id: 'jahangir-shahjahan',
        title: 'Jahangir & Shah Jahan',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Art, Architecture, Taj Mahal',
        route: '/study/reading-interface',
        topicId: 'mughal-empire'
      },
      {
        id: 'aurangzeb',
        title: 'Aurangzeb & Decline',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Religious Policy, Deccan Wars',
        route: '/study/reading-interface',
        topicId: 'mughal-empire'
      },
      {
        id: 'mughal-quiz',
        title: 'Mughal Quiz',
        type: 'quiz',
        completed: false,
        locked: false,
        description: 'Test your knowledge',
        route: '/quiz/topic-quiz',
        topicId: 'mughal-empire'
      }
    ]
  },
  {
    id: 'freedom-struggle',
    title: 'Freedom Struggle',
    subject: 'History',
    color: '#B91C1C',
    unitNumber: 4,
    description: '1857-1947 Independence Movement',
    totalXP: 600,
    icon: 'fist-raised',
    priority: 1,
    examRelevance: ['UPSC', 'TNPSC', 'SSC', 'State PSC'],
    isCompleteContent: true,
    lessons: [
      {
        id: 'revolt-1857',
        title: '1857 Revolt',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'First War of Independence',
        route: '/study/reading-interface',
        topicId: 'freedom-struggle'
      },
      {
        id: 'moderate-phase',
        title: 'Moderate Phase',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'INC Formation, Early Leaders',
        route: '/study/reading-interface',
        topicId: 'freedom-struggle'
      },
      {
        id: 'extremist-phase',
        title: 'Extremist Phase',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Tilak, Lajpat Rai, Bipin Chandra',
        route: '/study/reading-interface',
        topicId: 'freedom-struggle'
      },
      {
        id: 'gandhian-era',
        title: 'Gandhian Era',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Non-Cooperation, Civil Disobedience, Quit India',
        route: '/study/reading-interface',
        topicId: 'freedom-struggle'
      },
      {
        id: 'revolutionaries',
        title: 'Revolutionary Movement',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Bhagat Singh, Azad, Subhas Bose',
        route: '/study/reading-interface',
        topicId: 'freedom-struggle'
      },
      {
        id: 'freedom-quiz',
        title: 'Freedom Struggle Quiz',
        type: 'quiz',
        completed: false,
        locked: false,
        description: 'Test your knowledge',
        route: '/quiz/topic-quiz',
        topicId: 'freedom-struggle'
      }
    ]
  },
  {
    id: 'ancient-india',
    title: 'Ancient India',
    subject: 'History',
    color: '#991B1B',
    unitNumber: 5,
    description: 'Indus Valley to Gupta Period',
    totalXP: 400,
    icon: 'landmark-dome',
    priority: 1,
    examRelevance: ['UPSC', 'TNPSC', 'SSC'],
    isCompleteContent: true,
    lessons: [
      {
        id: 'indus-valley',
        title: 'Indus Valley Civilization',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Harappa, Mohenjo-daro, Urban Planning',
        route: '/study/reading-interface',
        topicId: 'ancient-india'
      },
      {
        id: 'vedic-period',
        title: 'Vedic Period',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Rigveda, Society, Religion',
        route: '/study/reading-interface',
        topicId: 'ancient-india'
      },
      {
        id: 'mahajanapadas',
        title: 'Mahajanapadas',
        type: 'lesson',
        completed: false,
        locked: false,
        description: '16 Kingdoms, Rise of Magadha',
        route: '/study/reading-interface',
        topicId: 'ancient-india'
      },
      {
        id: 'mauryan-empire',
        title: 'Mauryan Empire',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Chandragupta, Ashoka, Buddhism',
        route: '/study/reading-interface',
        topicId: 'ancient-india'
      },
      {
        id: 'gupta-empire',
        title: 'Gupta Empire',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Golden Age, Science, Literature',
        route: '/study/reading-interface',
        topicId: 'ancient-india'
      },
      {
        id: 'ancient-quiz',
        title: 'Ancient India Quiz',
        type: 'quiz',
        completed: false,
        locked: false,
        description: 'Test your knowledge',
        route: '/quiz/topic-quiz',
        topicId: 'ancient-india'
      }
    ]
  }
];

// PRIORITY 2: IMPORTANT - Essential for most exams
export const PRIORITY_2_TOPICS: ExamTopic[] = [
  {
    id: 'parliament-system',
    title: 'Parliament & Legislature',
    subject: 'Polity',
    color: '#059669',
    unitNumber: 6,
    description: 'Lok Sabha, Rajya Sabha, Law Making',
    totalXP: 400,
    icon: 'university',
    priority: 2,
    examRelevance: ['UPSC', 'TNPSC', 'SSC'],
    isCompleteContent: true,
    lessons: [
      {
        id: 'parliament-structure',
        title: 'Parliament Structure',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Houses, Sessions, Committees',
        route: '/study/reading-interface',
        topicId: 'parliament'
      },
      {
        id: 'law-making',
        title: 'Law Making Process',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Bills, Amendments, Procedures',
        route: '/study/reading-interface',
        topicId: 'parliament'
      },
      {
        id: 'parliament-quiz',
        title: 'Parliament Quiz',
        type: 'quiz',
        completed: false,
        locked: false,
        description: 'Test your knowledge',
        route: '/quiz/topic-quiz',
        topicId: 'parliament'
      }
    ]
  },
  {
    id: 'indian-geography',
    title: 'Indian Geography',
    subject: 'Geography',
    color: '#3B82F6',
    unitNumber: 7,
    description: 'Physical Features, Climate, Resources',
    totalXP: 450,
    icon: 'map',
    priority: 2,
    examRelevance: ['UPSC', 'TNPSC', 'SSC'],
    isCompleteContent: true,
    lessons: [
      {
        id: 'physical-features',
        title: 'Physical Features',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Mountains, Rivers, Plains',
        route: '/study/reading-interface',
        topicId: 'indian-geography'
      },
      {
        id: 'climate-monsoon',
        title: 'Climate & Monsoon',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Seasons, Rainfall Patterns',
        route: '/study/reading-interface',
        topicId: 'climate-weather'
      },
      {
        id: 'natural-resources',
        title: 'Natural Resources',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Minerals, Forest, Water',
        route: '/study/reading-interface',
        topicId: 'resources'
      },
      {
        id: 'geography-quiz',
        title: 'Geography Quiz',
        type: 'quiz',
        completed: false,
        locked: false,
        description: 'Test your knowledge',
        route: '/quiz/topic-quiz',
        topicId: 'indian-geography'
      }
    ]
  },
  {
    id: 'indian-economy',
    title: 'Indian Economy',
    subject: 'Economy',
    color: '#F59E0B',
    unitNumber: 8,
    description: 'GDP, Planning, Budget, Banking',
    totalXP: 500,
    icon: 'chart-line',
    priority: 2,
    examRelevance: ['UPSC', 'SSC', 'Banking'],
    isCompleteContent: true,
    lessons: [
      {
        id: 'basic-concepts',
        title: 'Economic Concepts',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'GDP, Inflation, Fiscal Policy',
        route: '/study/reading-interface',
        topicId: 'basic-concepts'
      },
      {
        id: 'planning-niti',
        title: 'Planning & NITI Aayog',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Five Year Plans, Development',
        route: '/study/reading-interface',
        topicId: 'planning'
      },
      {
        id: 'banking-system',
        title: 'Banking System',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'RBI, Monetary Policy, Banks',
        route: '/study/reading-interface',
        topicId: 'banking'
      },
      {
        id: 'union-budget',
        title: 'Union Budget',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Revenue, Expenditure, Deficit',
        route: '/study/reading-interface',
        topicId: 'budget'
      },
      {
        id: 'economy-quiz',
        title: 'Economy Quiz',
        type: 'quiz',
        completed: false,
        locked: false,
        description: 'Test your knowledge',
        route: '/quiz/topic-quiz',
        topicId: 'indian-economy'
      }
    ]
  },
  {
    id: 'current-affairs',
    title: 'Current Affairs',
    subject: 'Current Affairs',
    color: '#06B6D4',
    unitNumber: 9,
    description: 'National & International News',
    totalXP: 300,
    icon: 'newspaper',
    priority: 2,
    examRelevance: ['UPSC', 'TNPSC', 'SSC', 'Banking'],
    isCompleteContent: true,
    lessons: [
      {
        id: 'national-news',
        title: 'National Affairs',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Government Schemes, Politics',
        route: '/study/reading-interface',
        topicId: 'national-affairs'
      },
      {
        id: 'international-news',
        title: 'International Affairs',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Global Events, Summits',
        route: '/study/reading-interface',
        topicId: 'international-affairs'
      },
      {
        id: 'current-quiz',
        title: 'Current Affairs Quiz',
        type: 'quiz',
        completed: false,
        locked: false,
        description: 'Test your knowledge',
        route: '/quiz/topic-quiz',
        topicId: 'current-affairs'
      }
    ]
  }
];

// PRIORITY 3: GOOD TO KNOW - Frequently asked in exams
export const PRIORITY_3_TOPICS: ExamTopic[] = [
  {
    id: 'science-tech',
    title: 'Science & Technology',
    subject: 'Science',
    color: '#8B5CF6',
    unitNumber: 10,
    description: 'Space, Defense, IT, Biotech',
    totalXP: 350,
    icon: 'atom',
    priority: 3,
    examRelevance: ['UPSC', 'SSC'],
    isCompleteContent: true,
    lessons: [
      {
        id: 'space-technology',
        title: 'Space & ISRO',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Missions, Satellites',
        route: '/study/reading-interface',
        topicId: 'space-tech'
      },
      {
        id: 'defense-tech',
        title: 'Defense Technology',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Missiles, Nuclear, DRDO',
        route: '/study/reading-interface',
        topicId: 'defense-tech'
      },
      {
        id: 'science-quiz',
        title: 'Science Quiz',
        type: 'quiz',
        completed: false,
        locked: false,
        description: 'Test your knowledge',
        route: '/quiz/topic-quiz',
        topicId: 'science-tech'
      }
    ]
  },
  {
    id: 'environment',
    title: 'Environment & Ecology',
    subject: 'Environment',
    color: '#059669',
    unitNumber: 11,
    description: 'Climate Change, Conservation',
    totalXP: 300,
    icon: 'leaf',
    priority: 3,
    examRelevance: ['UPSC', 'State PSC'],
    isCompleteContent: true,
    lessons: [
      {
        id: 'climate-change',
        title: 'Climate Change',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Global Warming, Paris Agreement',
        route: '/study/reading-interface',
        topicId: 'climate-change'
      },
      {
        id: 'biodiversity',
        title: 'Biodiversity',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Conservation, National Parks',
        route: '/study/reading-interface',
        topicId: 'conservation'
      },
      {
        id: 'environment-quiz',
        title: 'Environment Quiz',
        type: 'quiz',
        completed: false,
        locked: false,
        description: 'Test your knowledge',
        route: '/quiz/topic-quiz',
        topicId: 'environment'
      }
    ]
  },
  {
    id: 'art-culture',
    title: 'Art & Culture',
    subject: 'Culture',
    color: '#EC4899',
    unitNumber: 12,
    description: 'Heritage, Dance, Music, Architecture',
    totalXP: 250,
    icon: 'palette',
    priority: 3,
    examRelevance: ['UPSC', 'TNPSC'],
    isCompleteContent: true,
    lessons: [
      {
        id: 'indian-architecture',
        title: 'Architecture',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Temples, Monuments, Styles',
        route: '/study/reading-interface',
        topicId: 'architecture'
      },
      {
        id: 'classical-arts',
        title: 'Classical Arts',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Dance, Music Forms',
        route: '/study/reading-interface',
        topicId: 'music-dance'
      },
      {
        id: 'culture-quiz',
        title: 'Culture Quiz',
        type: 'quiz',
        completed: false,
        locked: false,
        description: 'Test your knowledge',
        route: '/quiz/topic-quiz',
        topicId: 'art-culture'
      }
    ]
  }
];

// PRIORITY 4 & 5: Additional topics (less exam-focused)
export const PRIORITY_4_5_TOPICS: ExamTopic[] = [
  {
    id: 'sports',
    title: 'Sports & Games',
    subject: 'General',
    color: '#14B8A6',
    unitNumber: 13,
    description: 'Olympic, Cricket, Traditional Sports',
    totalXP: 150,
    icon: 'medal',
    priority: 4,
    examRelevance: ['SSC'],
    isCompleteContent: false,
    lessons: []
  },
  {
    id: 'daily-practice',
    title: 'Daily Practice',
    subject: 'Practice',
    color: '#4ECDC4',
    unitNumber: 14,
    description: 'Daily Quiz & Revision',
    totalXP: 200,
    icon: 'calendar-check',
    priority: 4,
    examRelevance: ['UPSC', 'TNPSC', 'SSC'],
    isCompleteContent: true,
    lessons: [
      {
        id: 'daily-dose',
        title: 'Daily Dose Quiz',
        type: 'quiz',
        completed: false,
        locked: false,
        description: 'Mixed questions',
        route: '/quiz/daily',
        topicId: 'daily-quiz'
      },
      {
        id: 'daily-snack',
        title: 'Daily Snack',
        type: 'lesson',
        completed: false,
        locked: false,
        description: 'Quick knowledge bite',
        route: '/snacks/today',
        topicId: 'daily-snack'
      }
    ]
  }
];

// Get all topics sorted by priority
export const getAllTopicsByPriority = (): ExamTopic[] => {
  return [
    ...PRIORITY_1_TOPICS,
    ...PRIORITY_2_TOPICS,
    ...PRIORITY_3_TOPICS,
    ...PRIORITY_4_5_TOPICS
  ];
};

// Get topics for specific exam
export const getTopicsForExam = (exam: string): ExamTopic[] => {
  return getAllTopicsByPriority().filter(topic => 
    topic.examRelevance.includes(exam as any)
  );
};

// Get topic by ID
export const getTopicById = (id: string): ExamTopic | undefined => {
  return getAllTopicsByPriority().find(topic => topic.id === id);
};

// Get lessons for a topic
export const getTopicLessons = (topicId: string): SubtopicLesson[] => {
  const topic = getTopicById(topicId);
  return topic?.lessons || [];
};

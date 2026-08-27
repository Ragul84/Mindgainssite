// 🎯 MindGains Completion Messages System
// Adaptive, motivational content that makes users proud and addicted to learning

export interface CompletionMessage {
  headline: string;
  subtitle: string;
  icon?: string;
}

export class CompletionMessageService {
  // 7-day rotating messages for Daily Dose Quiz
  static getDailyQuizMessage(): CompletionMessage {
    const dayOfWeek = new Date().getDay();
    
    const headlines = [
      "Daily Dose Mastered! 🎯", // Sunday
      "Quiz Champion! 🏆", // Monday  
      "Knowledge Warrior! ⚔️", // Tuesday
      "Brain Power Activated! 🧠", // Wednesday
      "Learning Streak On Fire! 🔥", // Thursday
      "Quiz Master Level! 🎖️", // Friday
      "Weekend Brain Builder! 🏗️" // Saturday
    ];
    
    const subtitles = [
      "Your mind is getting stronger every day. Keep this momentum going! 💪",
      "Consistency breeds excellence. Tomorrow's quiz awaits your brilliance! ⭐",
      "Every question conquered builds your knowledge empire. Well done! 🏰",
      "Your dedication to daily learning is reshaping your future! 🚀",
      "India's brightest minds are built one quiz at a time. You're leading! 🇮🇳",
      "Friday victories taste the sweetest. Weekend learning calls! 🎉",
      "Weekend warriors like you become weekday champions! 🥇"
    ];
    
    return {
      headline: headlines[dayOfWeek],
      subtitle: subtitles[dayOfWeek]
    };
  }

  // 7-day rotating messages for Daily Snack
  static getDailySnackMessage(): CompletionMessage {
    const dayOfWeek = new Date().getDay();
    
    const headlines = [
      "Daily Snack Finished! 🎯",
      "Today's Mind Fuel.", 
      "Smart Bite Taken! 🧠",
      "Snack Success! 🎉",
      "Brain Fuel Loaded ⚡",
      "Daily Snack Finished! 🎯",
      "Daily Brilliance Achieved."
    ];
    
    const subtexts = [
      "Great job! Come back tomorrow for your next snack 🥳",
      "One snack a day, a smarter you tomorrow 💡",
      "That's today's brain boost! Don't miss tomorrow 🔥",
      "Small bites, big gains. Keep it up tomorrow 👊",
      "India's future is being built, one snack at a time 🇮🇳",
      "Small bites, big gains. Return tomorrow for your next snack ⚡",
      "Great job! Come back tomorrow for your next snack 🥳"
    ];
    
    return {
      headline: headlines[dayOfWeek],
      subtitle: subtexts[dayOfWeek]
    };
  }

  // Subject-specific completions for subtopic quizzes
  static getSubtopicQuizMessage(subjectName: string, topicTitle: string, score: number, totalQuestions: number): CompletionMessage {
    const percentage = Math.round((score / totalQuestions) * 100);
    const isPerfect = percentage === 100;
    const isExcellent = percentage >= 90;
    const isGood = percentage >= 75;

    // Subject-specific motivational phrases
    const subjectPhrases: { [key: string]: string[] } = {
      'Physics': ['🔬 Physics mastered!', '⚡ Energy unleashed!', '🌟 Laws conquered!'],
      'Chemistry': ['⚗️ Reactions perfected!', '🧪 Elements mastered!', '💫 Bonds understood!'],
      'Mathematics': ['🔢 Numbers conquered!', '📊 Logic mastered!', '🎯 Precision achieved!'],
      'Biology': ['🧬 Life decoded!', '🌱 Nature understood!', '🔬 Biology mastered!'],
      'History': ['📚 Past revealed!', '🏛️ History mastered!', '⏳ Time conquered!'],
      'Geography': ['🌍 World explored!', '🗺️ Maps mastered!', '🏔️ Earth understood!'],
      'English': ['📖 Language mastered!', '✍️ Words conquered!', '🎭 Literature understood!'],
      'Economics': ['💰 Markets understood!', '📈 Economics mastered!', '🏦 Finance decoded!'],
      'Political Science': ['🏛️ Politics decoded!', '⚖️ Governance mastered!', '🗳️ Democracy understood!'],
      'Computer Science': ['💻 Code conquered!', '🖥️ Tech mastered!', '⚡ Logic perfected!']
    };

    // Get subject-specific phrase or fallback
    const phrases = subjectPhrases[subjectName] || ['🎯 Knowledge gained!', '🧠 Concept mastered!', '⭐ Learning achieved!'];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    let headline: string;
    let subtitle: string;

    if (isPerfect) {
      headline = `Perfect! ${randomPhrase}`;
      subtitle = `Flawless mastery of "${topicTitle}"! Your understanding is exceptional. Ready for the next challenge? 🚀`;
    } else if (isExcellent) {
      headline = `Excellent! ${randomPhrase}`;
      subtitle = `Outstanding grasp of "${topicTitle}"! ${percentage}% shows your dedication is paying off. Keep soaring! 🌟`;
    } else if (isGood) {
      headline = `Great Work! ${randomPhrase}`;
      subtitle = `Solid understanding of "${topicTitle}" achieved! ${percentage}% is impressive. You're building expertise! 💪`;
    } else {
      headline = `Progress Made! 📈`;
      subtitle = `You've learned valuable concepts in "${topicTitle}". Every step forward counts. Practice makes perfect! 🎯`;
    }

    return { headline, subtitle };
  }

  // Study Hub completion messages - Witty & Fun variants
  static getStudyHubMessage(activityType: string, contentTitle: string): CompletionMessage {
    const activities: { [key: string]: { headlines: string[], subtitleTemplates: string[] } } = {
      'content-reading': {
        headlines: [
          'Brain buffed up!',
          'Grey cells doing push-ups!',
          'Download complete.',
          'Knowledge flexed.',
          'You just fed your brain.',
          'Mind leveled up!',
          'Lesson conquered!',
          'Upgrade successful.',
          'Synapses celebrating!'
        ],
        subtitleTemplates: [
          'You just added +1 to your IQ armor.',
          'That topic didn\'t stand a chance.',
          'New brain file: "Smartness_v2.0.zip" installed.',
          'You\'re now 0.01% smarter than you were 5 minutes ago.',
          'Calories: 0. Wisdom: infinite.',
          'The neurons are high-fiving each other.',
          'Another fact added to your mental playlist.',
          'Brain firmware now running smoother.',
          'Keep this streak—Einstein\'s getting nervous.'
        ]
      },
      'video-learning': {
        headlines: [
          'Video Mastered! 🎥',
          'Visual Learning Complete! 👁️',
          'Concept Visualized! 🎬',
          'Video Knowledge Gained! 📹'
        ],
        subtitleTemplates: [
          'Visual learning of "{title}" complete! Understanding through sight is powerful! 🎯',
          'Great attention to "{title}". Video learning enhances comprehension! 📊',
          'Excellent focus on "{title}". Visual concepts are now yours! 🧠',
          'Perfect engagement with "{title}". Multi-modal learning works! ⚡'
        ]
      },
      'practice-questions': {
        headlines: [
          'Practice Perfected! 💪',
          'Skills Sharpened! ⚔️',
          'Mastery Achieved! 🏆',
          'Excellence. Practiced.'
        ],
        subtitleTemplates: [
          'Consistent practice on "{title}" builds expertise! Keep this momentum! 🔥',
          'Excellent practice session on "{title}". Repetition breeds mastery! 🎯',
          'Great dedication to "{title}" practice. Your skills are improving! 📈',
          'Perfect practice of "{title}". Practice indeed makes perfect! 🌟'
        ]
      },
      'quick-learn': {
        headlines: [
          'Quick Learning! ⚡',
          'Rapid Mastery! 🚀',
          'Speed Learning! 💨',
          'Fast Track Complete! 🏃‍♂️'
        ],
        subtitleTemplates: [
          'Rapid understanding of "{title}"! Efficient learning is smart learning! 🧠',
          'Quick mastery of "{title}". Your learning speed is impressive! ⭐',
          'Fast comprehension of "{title}". You\'re optimizing your study time! ⏰',
          'Swift learning of "{title}". Efficiency meets effectiveness! 🎯'
        ]
      }
    };

    const activity = activities[activityType] || activities['content-reading'];
    const randomHeadline = activity.headlines[Math.floor(Math.random() * activity.headlines.length)];
    const randomSubtitle = activity.subtitleTemplates[Math.floor(Math.random() * activity.subtitleTemplates.length)]
      .replace('{title}', contentTitle);

    return {
      headline: randomHeadline,
      subtitle: randomSubtitle
    };
  }

  // Battle/Competition completion messages
  static getBattleMessage(isWinner: boolean, opponentName?: string, score?: number): CompletionMessage {
    if (isWinner) {
      const winHeadlines = [
        'Victory Achieved! 🏆',
        'Battle Won! ⚔️',
        'Champion! 👑',
        'Triumphant! 🎉',
        'Victorious! 🥇'
      ];
      
      const winSubtitles = [
        'Outstanding performance! Your knowledge proved superior. Ready for the next challenge? 🚀',
        'Excellent strategy and knowledge! Victory tastes sweet when earned. Well done! 🌟',
        'Brilliant battle! Your preparation and focus led to triumph. Keep winning! 💪',
        'Impressive display of knowledge! Champions are made through dedication like yours! 🎯'
      ];

      const headline = winHeadlines[Math.floor(Math.random() * winHeadlines.length)];
      const subtitle = winSubtitles[Math.floor(Math.random() * winSubtitles.length)];

      return { headline, subtitle };
    } else {
      const loseHeadlines = [
        'Great Effort! 💪',
        'Battle Complete! ⚔️',
        'Learning Opportunity! 📚',
        'Progress Made! 📈'
      ];

      const loseSubtitles = [
        'Every battle teaches valuable lessons. Analyze, learn, and come back stronger! 🧠',
        'Close match! Your knowledge is growing. Victory is within reach! 🎯',
        'Excellent participation! Each battle sharpens your skills. Keep fighting! ⚡',
        'Great sportsmanship! Learning from challenges makes you stronger! 🌟'
      ];

      const headline = loseHeadlines[Math.floor(Math.random() * loseHeadlines.length)];
      const subtitle = loseSubtitles[Math.floor(Math.random() * loseSubtitles.length)];

      return { headline, subtitle };
    }
  }

  // Achievement unlock messages
  static getAchievementMessage(achievementName: string, achievementType: string): CompletionMessage {
    const typeMessages: { [key: string]: { headlines: string[], subtitleTemplates: string[] } } = {
      'streak': {
        headlines: ['Streak Master! 🔥', 'Consistency King! 👑', 'Dedication Warrior! ⚔️'],
        subtitleTemplates: [
          'Achievement unlocked: "{achievement}"! Your consistency is building unstoppable momentum! 🚀',
          'Incredible dedication! "{achievement}" proves your commitment to excellence! 🌟',
          'Consistency achievement: "{achievement}"! You\'re forming habits that lead to success! 💪'
        ]
      },
      'score': {
        headlines: ['High Scorer! 🎯', 'Accuracy Master! 📊', 'Precision Expert! ⚡'],
        subtitleTemplates: [
          'Score achievement: "{achievement}"! Your accuracy is reaching new heights! 🚀',
          'Impressive precision! "{achievement}" showcases your growing expertise! 🏆',
          'Accuracy milestone: "{achievement}"! Excellence is becoming your standard! 🌟'
        ]
      },
      'completion': {
        headlines: ['Champion Status.', 'Unstoppable.', 'Elite Performance.'],
        subtitleTemplates: [
          'Completion badge: "{achievement}"! Your follow-through is exceptional! 💪',
          'Milestone reached: "{achievement}"! Finishing what you start builds character! 🌟',
          'Achievement earned: "{achievement}"! Your persistence pays off! 🚀'
        ]
      }
    };

    const typeData = typeMessages[achievementType] || typeMessages['completion'];
    const headline = typeData.headlines[Math.floor(Math.random() * typeData.headlines.length)];
    const subtitle = typeData.subtitleTemplates[Math.floor(Math.random() * typeData.subtitleTemplates.length)]
      .replace('{achievement}', achievementName);

    return { headline, subtitle };
  }

  // Mission completion messages
  static getMissionMessage(missionName: string, missionType: string): CompletionMessage {
    const missionHeadlines = [
      'Mission Accomplished! 🎯',
      'Mission. Accomplished.',
      'Mission Success! 🚀',
      'Goal Achieved! 🏆'
    ];

    const missionSubtitles = [
      `Mission "${missionName}" complete! Your systematic approach to learning is impressive! 💪`,
      `Objective "${missionName}" achieved! Strategic learning leads to systematic success! 🌟`,
      `Mission "${missionName}" accomplished! You\'re building discipline and knowledge! 🧠`,
      `Goal "${missionName}" reached! Mission-focused learning accelerates growth! ⚡`
    ];

    const headline = missionHeadlines[Math.floor(Math.random() * missionHeadlines.length)];
    const subtitle = missionSubtitles[Math.floor(Math.random() * missionSubtitles.length)];

    return { headline, subtitle };
  }
}
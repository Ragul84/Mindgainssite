import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupabaseService, supabase } from './supabaseService';
import UniversalNavigation from './universalNavigation';

// Notification handler configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  } as any),
});

export interface NotificationTemplate {
  id: string;
  title: string;
  body: string;
  data?: any;
  trigger?: Notifications.NotificationTriggerInput;
}

// Witty, highly-motivating professional traditional notification templates (Duolingo & Zomato DNA)
const NOTIFICATION_TEMPLATES = {
  // Daily reminders
  morning: [
    {
      title: "📰 Your Morning Current Affairs is Ready!",
      body: "Sip your tea and master today's high-yield updates in 3 minutes! ☕"
    },
    {
      title: "🌅 Start Today Smarter: Daily Briefing Live",
      body: "Your daily study dose on MindWhite is ready. Ripe and fresh! 🧠✨"
    },
    {
      title: "🗞️ Today's Headliners are Up!",
      body: "Quick 3-minute review of key national events to crush your exam prep!"
    },
  ],
  
  afternoon: [
    {
      title: "🍛 Lunch break? Try some active recall!",
      body: "Beat the afternoon slump with a quick 2-minute Practice Card review! ⚡"
    },
    {
      title: "😴 Sleepy afternoon? Wake up your brain!",
      body: "A short 5-minute study guide overview keeps your preparation sharp."
    },
    {
      title: "⚡ Quick Study Break!",
      body: "Practice 10 flashcards now. Small steps lead to global ranking success! 🏆"
    },
  ],
  
  evening: [
    {
      title: "⚡ Evening Quick Sprint Challenge is Live!",
      body: "20 random questions from the entire database. Ready for a speed run? 🥊"
    },
    {
      title: "🏃‍♂️ Speed Challenge: Quick Sprint!",
      body: "Test your focus with 20 mixed questions. Complete in 5 minutes! ⏱️"
    },
    {
      title: "🎯 Mixed Bag Review: 20 Questions!",
      body: "Can you score 90%+ on tonight's mixed Quick Sprint challenge? Defend your rank!"
    },
  ],
  
  night: [
    {
      title: "🦉 Save your Streak! Thiru is waiting...",
      body: "Only 2 hours left! Finish today's Self-Assessment to lock in your streak 🔥"
    },
    {
      title: "⏰ Streak Freeze Warning!",
      body: "Your daily streak is about to freeze. Don't let your consistency reset to 0! ❄️"
    },
    {
      title: "🚨 Emergency Study Guide Check!",
      body: "Keep the momentum alive! A quick 2-minute session secures your daily status."
    },
  ],
  
  // Streak notifications
  streak: [
    {
      title: "🔥 Your streak is on fire!",
      body: "{{days}} days of consistent prep! Keep going, success is built daily 💪"
    },
    {
      title: "⚡ {{days}}-Day Consistency Power!",
      body: "You're building an unbeatable daily learning routine. Keep it up!"
    },
  ],
  
  // Missed quiz / Inactivity
  missed: [
    {
      title: "🤔 Thiru the Mascot misses you...",
      body: "Your daily study guide is looking lonely. Let's do a quick 2-minute review!"
    },
    {
      title: "📈 Don't let your consistency slip!",
      body: "Even a small 2-minute study session keeps your exam prep active. Come back now!"
    },
  ],
  
  // Achievement unlocked
  achievement: [
    {
      title: "🏆 New Achievement Unlocked!",
      body: "You earned the '{{achievement}}' badge. Outstanding progress! 🌟"
    },
    {
      title: "🎉 Consistency Milestone Reached!",
      body: "You unlocked '{{achievement}}'. Your daily effort is paying off!"
    },
  ],
  
  // Battle invites (Knowledge Heist or similar)
  battle: [
    {
      title: "⚔️ Peer Revision Challenge!",
      body: "{{opponent}} challenged you to a quick revision battle. Show your speed!"
    },
    {
      title: "🥊 Revision Battle Alert!",
      body: "Test your skills against {{opponent}} in a quick 10-question sprint!"
    },
  ],
};

class NotificationService {
  private static instance: NotificationService;
  private notificationListener: any;
  private responseListener: any;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'MindGains',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#8B5CF6',
      });
    }

    // Add notification listeners
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('📬 Notification received:', notification);
    });

    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', response);
      this.handleNotificationResponse(response);
    });
  }

  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }

  async registerForPushNotifications(): Promise<string | null> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return null;

    try {
      // Only try to get push token if not in Expo Go
      if (!__DEV__ || Platform.OS === 'web') {
        const token = await Notifications.getExpoPushTokenAsync();
        console.log('📱 Push token:', token.data);
        
        // Save token to backend
        const user = await SupabaseService.getCurrentUser();
        if (user) {
          await this.savePushToken(user.id, token.data);
        }
        
        return token.data;
      } else {
        console.log('📱 Push notifications not available in Expo Go - use development build');
        return null;
      }
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  private async savePushToken(userId: string, token: string) {
    try {
      const { error } = await supabase
        .from('user_push_tokens')
        .upsert({
          user_id: userId,
          push_token: token,
          platform: Platform.OS,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  }

  // Schedule daily notifications
  async scheduleDailyNotifications(isTodayComplete: boolean = false) {
    try {
      // Cancel existing scheduled notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Read settings from AsyncStorage
      const savedBriefing = await AsyncStorage.getItem('settings_daily_briefing');
      const savedStreak = await AsyncStorage.getItem('settings_streak_protector');
      const briefingActive = savedBriefing !== null ? savedBriefing === 'true' : true;
      const streakActive = savedStreak !== null ? savedStreak === 'true' : true;

      const hours = [
        { key: 'morning' as const, h: 7, m: 30 },
        { key: 'afternoon' as const, h: 13, m: 30 },
        { key: 'evening' as const, h: 18, m: 30 },
        { key: 'night' as const, h: 20, m: 30 },
      ];

      const now = new Date();

      // Schedule for the next 5 days
      for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
        const targetDate = new Date();
        targetDate.setDate(now.getDate() + dayOffset);

        if (dayOffset === 0 && isTodayComplete) {
          // If today's mission is already complete, skip scheduling for today entirely!
          continue;
        }

        for (const slot of hours) {
          // Skip if user deactivated this notification channel
          if (slot.key === 'morning' && !briefingActive) continue;
          if (slot.key === 'night' && !streakActive) continue;

          const slotTime = new Date(targetDate);
          slotTime.setHours(slot.h, slot.m, 0, 0);

          // If it's today, only schedule if the slot time is in the future
          if (dayOffset === 0 && slotTime <= now) {
            continue;
          }

          const template = this.getRandomTemplate(slot.key);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: template.title,
              body: template.body,
              sound: 'default',
              badge: 1,
              data: { type: slot.key }
            },
            trigger: slotTime as any, // One-shot trigger at exact Date object
          });
        }
      }
      console.log(`✅ Daily notifications scheduled successfully (Today Complete: ${isTodayComplete}, Briefing: ${briefingActive}, Streak Protection: ${streakActive})`);
    } catch (err) {
      console.error('Failed to schedule daily notifications:', err);
    }
  }

  private getRandomTemplate(category: keyof typeof NOTIFICATION_TEMPLATES) {
    const templates = NOTIFICATION_TEMPLATES[category];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  async scheduleNotification(
    template: { title: string; body: string },
    trigger: { hour: number; minute: number; repeats: boolean }
  ) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: template.title,
        body: template.body,
        sound: 'default',
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: trigger.hour,
        minute: trigger.minute,
      },
    });
  }

  // Send immediate notifications
  async sendStreakNotification(days: number) {
    const template = this.getRandomTemplate('streak');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: template.title.replace('{{days}}', days.toString()),
        body: template.body.replace('{{days}}', days.toString()),
        sound: 'default',
      },
      trigger: null,
    });
  }

  async sendMissedQuizNotification() {
    const template = this.getRandomTemplate('missed');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: template.title,
        body: template.body,
        sound: 'default',
      },
      trigger: null,
    });
  }

  async sendAchievementNotification(achievementName: string) {
    const template = this.getRandomTemplate('achievement');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: template.title.replace('{{achievement}}', achievementName),
        body: template.body.replace('{{achievement}}', achievementName),
        sound: 'default',
      },
      trigger: null,
    });
  }

  async sendBattleInviteNotification(opponentName: string) {
    const template = this.getRandomTemplate('battle');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: template.title.replace('{{opponent}}', opponentName),
        body: template.body.replace('{{opponent}}', opponentName),
        sound: 'default',
        data: { type: 'battle_invite', opponent: opponentName },
      },
      trigger: null,
    });
  }

  private handleNotificationResponse(response: Notifications.NotificationResponse) {
    const { notification } = response;
    const data = notification.request.content.data;

    console.log('📬 Notification action received:', data);

    if (data?.type === 'battle_invite') {
      UniversalNavigation.navigateTo('/(tabs)/arena');
    } else if (data?.type === 'evening') {
      // Launch Quick Sprint directly with 20 questions
      UniversalNavigation.navigateTo('/quiz/reader?mode=quick-sprint&questionCount=20');
    } else if (data?.type === 'morning') {
      // Launch Current Affairs quiz
      UniversalNavigation.navigateTo('/daily-mission/reader?phaseId=0&phaseType=current_affairs&topicTitle=Daily%20Current%20Affairs');
    } else if (data?.type === 'night') {
      UniversalNavigation.navigateTo('/(tabs)/streak');
    } else if (data?.type === 'afternoon') {
      UniversalNavigation.navigateTo('/daily-mission');
    } else if (data?.type === 'daily_quiz') {
      UniversalNavigation.navigateTo('/daily-mission');
    }
  }

  cleanup() {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }
  }
}

export default NotificationService.getInstance();
// 🎓 Learning Progress Service - Progress tracking with Supabase and unlock logic
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabaseService';
import { XPSystem } from './xpSystem';

export interface UserProgress {
  completedLessons: string[];
  currentUnit: number;
  currentLesson: string;
  totalXP: number;
  streak: number;
  dailyDoseCompleted: boolean;
  dailySnackCompleted: boolean;
  lastSeen: string;
  unlockedUnits: number[];
}

export interface LessonCompletion {
  lessonId: string;
  completedAt: string;
  xpEarned: number;
  unitId: string;
}

class LearningProgressService {
  private static readonly PROGRESS_KEY = 'learning_progress';
  private static readonly DAILY_PROGRESS_KEY = 'daily_progress';
  
  /**
   * Get user's current learning progress from Supabase
   */
  static async getUserProgress(userId: string = 'guest'): Promise<UserProgress> {
    try {
      console.log('🔍 Loading user progress from Supabase for user:', userId);
      
      // First try to get from Supabase if user is authenticated
      if (userId && userId !== 'guest') {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('completed_lessons, total_xp, streak_count')
          .eq('id', userId)
          .single();
          
        if (!error && profile) {
          console.log('✅ Found user profile in Supabase:', {
            completedLessons: profile.completed_lessons?.length || 0,
            totalXP: profile.total_xp || 0,
            streak: profile.streak_count || 0
          });
          
          // Get updated XP from XPSystem to ensure consistency
          const currentXP = await XPSystem.getCurrentXP(userId);
          
          return {
            completedLessons: profile.completed_lessons || [],
            currentUnit: 1, // Default unit
            currentLesson: 'daily-dose', // Use default since current_lesson column doesn't exist
            totalXP: currentXP, // Use XPSystem to get current XP
            streak: profile.streak_count || 0,
            dailyDoseCompleted: false, // Calculate based on today's date
            dailySnackCompleted: false, // Calculate based on today's date
            lastSeen: new Date().toDateString(),
            unlockedUnits: [1], // Default units
          };
        } else {
          console.log('❌ No user profile found in Supabase:', error);
        }
      }
      
      // Fallback to AsyncStorage for guest users or if Supabase fails
      const progressKey = `${this.PROGRESS_KEY}_${userId}`;
      const savedProgress = await AsyncStorage.getItem(progressKey);
      
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        console.log('📱 Loaded progress from AsyncStorage');
        return {
          completedLessons: parsed.completedLessons || [],
          currentUnit: parsed.currentUnit || 1,
          currentLesson: parsed.currentLesson || 'daily-dose',
          totalXP: parsed.totalXP || 0,
          streak: parsed.streak || 0,
          dailyDoseCompleted: this.isDailyTaskCompleted('dose', parsed.lastSeen),
          dailySnackCompleted: this.isDailyTaskCompleted('snack', parsed.lastSeen),
          lastSeen: parsed.lastSeen || new Date().toDateString(),
          unlockedUnits: parsed.unlockedUnits || [1],
        };
      }
      
      // Default progress for new users
      console.log('🆕 Creating default progress for new user');
      return {
        completedLessons: [],
        currentUnit: 1,
        currentLesson: 'daily-dose',
        totalXP: 0,
        streak: 0,
        dailyDoseCompleted: false,
        dailySnackCompleted: false,
        lastSeen: new Date().toDateString(),
        unlockedUnits: [1],
      };
    } catch (error) {
      console.error('Error loading user progress:', error);
      return this.getDefaultProgress();
    }
  }

  /**
   * Save user progress to AsyncStorage
   */
  static async saveUserProgress(progress: UserProgress, userId: string = 'guest'): Promise<void> {
    try {
      const progressKey = `${this.PROGRESS_KEY}_${userId}`;
      await AsyncStorage.setItem(progressKey, JSON.stringify({
        ...progress,
        lastSeen: new Date().toDateString(),
      }));
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  }

  /**
   * Complete a lesson and update progress
   */
  static async completeLesson(
    lessonId: string, 
    unitId: string, 
    xpEarned: number, 
    userId: string = 'guest'
  ): Promise<UserProgress> {
    try {
      const currentProgress = await this.getUserProgress(userId);
      
      // Check if lesson is already completed
      if (currentProgress.completedLessons.includes(lessonId)) {
        return currentProgress;
      }

      // Add lesson to completed list
      const updatedProgress: UserProgress = {
        ...currentProgress,
        completedLessons: [...currentProgress.completedLessons, lessonId],
        totalXP: currentProgress.totalXP + xpEarned,
        lastSeen: new Date().toDateString(),
      };

      // Check if unit is complete and unlock next unit
      const unitProgress = this.checkUnitCompletion(unitId, updatedProgress.completedLessons);
      if (unitProgress.isComplete && !currentProgress.unlockedUnits.includes(unitProgress.nextUnitNumber)) {
        updatedProgress.unlockedUnits = [...currentProgress.unlockedUnits, unitProgress.nextUnitNumber];
        updatedProgress.currentUnit = unitProgress.nextUnitNumber;
        updatedProgress.currentLesson = this.getFirstLessonOfUnit(unitProgress.nextUnitNumber);
      }

      await this.saveUserProgress(updatedProgress, userId);
      return updatedProgress;
    } catch (error) {
      console.error('Error completing lesson:', error);
      return await this.getUserProgress(userId);
    }
  }

  /**
   * Complete daily dose challenge
   */
  static async completeDailyDose(userId: string = 'guest'): Promise<UserProgress> {
    try {
      const dailyKey = `${this.DAILY_PROGRESS_KEY}_${userId}`;
      const today = new Date().toDateString();
      
      // Save daily dose completion
      const dailyProgress = {
        doseCompletedDate: today,
        doseXPEarned: 50,
      };
      
      await AsyncStorage.setItem(dailyKey + '_dose', JSON.stringify(dailyProgress));
      
      // Update main progress
      const currentProgress = await this.getUserProgress(userId);
      const updatedProgress: UserProgress = {
        ...currentProgress,
        dailyDoseCompleted: true,
        totalXP: currentProgress.totalXP + 50,
        streak: this.calculateStreak(currentProgress.lastSeen),
      };
      
      await this.saveUserProgress(updatedProgress, userId);
      return updatedProgress;
    } catch (error) {
      console.error('Error completing daily dose:', error);
      return await this.getUserProgress(userId);
    }
  }

  /**
   * Complete daily snack challenge
   */
  static async completeDailySnack(userId: string = 'guest'): Promise<UserProgress> {
    try {
      const dailyKey = `${this.DAILY_PROGRESS_KEY}_${userId}`;
      const today = new Date().toDateString();
      
      // Save daily snack completion
      const dailyProgress = {
        snackCompletedDate: today,
        snackXPEarned: 25,
      };
      
      await AsyncStorage.setItem(dailyKey + '_snack', JSON.stringify(dailyProgress));
      
      // Update main progress
      const currentProgress = await this.getUserProgress(userId);
      const updatedProgress: UserProgress = {
        ...currentProgress,
        dailySnackCompleted: true,
        totalXP: currentProgress.totalXP + 25,
        streak: this.calculateStreak(currentProgress.lastSeen),
      };
      
      await this.saveUserProgress(updatedProgress, userId);
      return updatedProgress;
    } catch (error) {
      console.error('Error completing daily snack:', error);
      return await this.getUserProgress(userId);
    }
  }

  /**
   * Check if a lesson is unlocked based on progress
   */
  static isLessonUnlocked(lessonId: string, unitNumber: number, progress: UserProgress): boolean {
    // Unit must be unlocked
    if (!progress.unlockedUnits.includes(unitNumber)) {
      return false;
    }

    // First lesson of unlocked unit is always available
    const firstLessonOfUnit = this.getFirstLessonOfUnit(unitNumber);
    if (lessonId === firstLessonOfUnit) {
      return true;
    }

    // Check if previous lessons in the unit are completed
    const unitLessons = this.getUnitLessons(unitNumber);
    const lessonIndex = unitLessons.findIndex(lesson => lesson.id === lessonId);
    
    if (lessonIndex === 0) {
      return true; // First lesson is always unlocked
    }

    // Check if previous lesson is completed
    const previousLesson = unitLessons[lessonIndex - 1];
    return progress.completedLessons.includes(previousLesson.id);
  }

  /**
   * Check if a daily task was completed today
   */
  private static isDailyTaskCompleted(taskType: 'dose' | 'snack', lastSeen?: string): boolean {
    const today = new Date().toDateString();
    return lastSeen === today;
  }

  /**
   * Calculate streak based on last seen date
   */
  private static calculateStreak(lastSeen: string): number {
    const today = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffTime = Math.abs(today.getTime() - lastSeenDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // If last seen today, maintain streak
    if (diffDays === 0) {
      return 1; // At least 1 day streak
    }
    
    // If missed more than 1 day, reset streak
    if (diffDays > 1) {
      return 0;
    }
    
    return 1; // Yesterday's activity counts
  }

  /**
   * Check if a unit is complete
   */
  private static checkUnitCompletion(unitId: string, completedLessons: string[]): {
    isComplete: boolean;
    nextUnitNumber: number;
  } {
    const unitLessons = this.getUnitLessons(this.getUnitNumberFromId(unitId));
    const completedCount = unitLessons.filter(lesson => 
      completedLessons.includes(lesson.id)
    ).length;
    
    return {
      isComplete: completedCount === unitLessons.length,
      nextUnitNumber: this.getUnitNumberFromId(unitId) + 1,
    };
  }

  /**
   * Get first lesson of a unit
   */
  private static getFirstLessonOfUnit(unitNumber: number): string {
    const unitLessons = this.getUnitLessons(unitNumber);
    return unitLessons[0]?.id || 'indus-valley';
  }

  /**
   * Get all lessons for a unit
   */
  private static getUnitLessons(unitNumber: number): Array<{ id: string; type: string }> {
    // This should match your LEARNING_PATH structure
    const unitLessonsMap: { [key: number]: Array<{ id: string; type: string }> } = {
      1: [
        { id: 'indus-valley', type: 'lesson' },
        { id: 'vedic-period', type: 'lesson' },
        { id: 'ancient-quiz', type: 'quiz' },
        { id: 'mauryan-empire', type: 'lesson' },
        { id: 'history-chest-1', type: 'chest' },
      ],
      2: [
        { id: 'preamble', type: 'lesson' },
        { id: 'fundamental-rights', type: 'lesson' },
        { id: 'polity-quiz', type: 'quiz' },
        { id: 'directive-principles', type: 'lesson' },
        { id: 'polity-chest-1', type: 'chest' },
      ],
      // Add more units as needed
    };
    
    return unitLessonsMap[unitNumber] || [];
  }

  /**
   * Get unit number from unit ID
   */
  private static getUnitNumberFromId(unitId: string): number {
    const unitMap: { [key: string]: number } = {
      'history-ancient': 1,
      'polity-constitution': 2,
      'geography-physical': 3,
      'economy-basics': 4,
      'science-basics': 5,
      'current-affairs': 6,
    };
    
    return unitMap[unitId] || 1;
  }

  /**
   * Get default progress for new users
   */
  private static getDefaultProgress(): UserProgress {
    return {
      completedLessons: [],
      currentUnit: 1,
      currentLesson: 'indus-valley',
      totalXP: 0,
      streak: 0,
      dailyDoseCompleted: false,
      dailySnackCompleted: false,
      lastSeen: new Date().toDateString(),
      unlockedUnits: [1],
    };
  }

  /**
   * Reset daily progress (for testing or new day)
   */
  static async resetDailyProgress(userId: string = 'guest'): Promise<void> {
    try {
      const progress = await this.getUserProgress(userId);
      const updatedProgress: UserProgress = {
        ...progress,
        dailyDoseCompleted: false,
        dailySnackCompleted: false,
        lastSeen: new Date().toDateString(),
      };
      
      await this.saveUserProgress(updatedProgress, userId);
    } catch (error) {
      console.error('Error resetting daily progress:', error);
    }
  }

  /**
   * Update lesson progress when starting/completing lessons
   */
  static async updateLessonProgress(
    userId: string,
    lessonId: string,
    status: 'started' | 'completed',
    xpEarned: number = 0
  ): Promise<void> {
    try {
      if (status === 'started') {
        // Just update current lesson
        const currentProgress = await this.getUserProgress(userId);
        await this.saveUserProgress({
          ...currentProgress,
          currentLesson: lessonId
        }, userId);
      } else if (status === 'completed') {
        // Complete the lesson fully
        await this.completeLesson(lessonId, 'unit-1', xpEarned, userId);
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  }
}

export default LearningProgressService;
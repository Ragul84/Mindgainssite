import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseService';
import { User } from '@supabase/supabase-js';
import NotificationService from '@/utils/notificationService';
import { getUserProtocol } from '@/utils/protocolService';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setUser(session?.user ?? null);
          console.log('🔍 Initial session:', session?.user?.email || 'No user');
          if (session?.user) {
            NotificationService.registerForPushNotifications();
            getUserProtocol(session.user.id).then(protocol => {
              const isTodayComplete = protocol ? protocol.progress_phase >= 5 : false;
              NotificationService.scheduleDailyNotifications(isTodayComplete);
            }).catch(() => {
              NotificationService.scheduleDailyNotifications(false);
            });
          }
        }
      } catch (error) {
        console.error('Session error:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔍 Auth state changed:', event, session?.user?.id || 'No user');
        console.log('📧 User email:', session?.user?.email || 'No email');
        console.log('👤 User data:', session?.user ? 'User exists' : 'No user');
        setUser(session?.user ?? null);
        if (session?.user) {
          NotificationService.registerForPushNotifications();
          getUserProtocol(session.user.id).then(protocol => {
            const isTodayComplete = protocol ? protocol.progress_phase >= 5 : false;
            NotificationService.scheduleDailyNotifications(isTodayComplete);
          }).catch(() => {
            NotificationService.scheduleDailyNotifications(false);
          });
        }
        setLoading(false);
        setInitialized(true);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return { 
    user, 
    loading, 
    initialized,
    isAuthenticated: !!user,
    signOut
  };
}
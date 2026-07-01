import { useEffect, useState } from 'react';
import '@/utils/reanimatedPolyfill';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Platform, UIManager, View } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/components/AuthProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useFonts } from 'expo-font';
import NotificationService from '@/utils/notificationService';
import { mindGainsConfig } from '@/gluestack-ui.config';
import { theme as LegacyTheme } from '@/constants/theme';
import { M3ThemeProvider, useM3Theme } from '@/theme/M3ThemeProvider';

// Enable better logging for Android
if (__DEV__ && Platform.OS === 'android') {
  console.log('🤖 Android Debug Mode - Logging enabled');
}
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Ensure system background is milky
SystemUI.setBackgroundColorAsync('#F8FAFC').catch(() => {});


export default function RootLayout() {
  useFrameworkReady();

  // Material 3-inspired dynamic color scheme (milky, premium, adaptive)
  const legacyColorScheme = LegacyTheme.getColorScheme(); const M3Theme = LegacyTheme;
  const navigationTheme = {
    dark: false,
    colors: {
      primary: legacyColorScheme.primary ?? '#4ECDC4',
      background: '#F8FAFC',
      card: '#FFFFFF',
      text: '#0F172A',
      border: 'rgba(0,0,0,0.05)',
      notification: legacyColorScheme.secondary ?? '#7C3AED',
    },
  };
  

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    // FontAwesome optional: keep commented unless you want vector-icons to use local OTFs
    // 'Font Awesome 5 Pro': require('../assets/fontawesome-pro-7.0.0-desktop/otfs/Font Awesome 7 Pro-Regular-400.otf'),
    // 'Font Awesome 5 Pro Solid': require('../assets/fontawesome-pro-7.0.0-desktop/otfs/Font Awesome 7 Pro-Solid-900.otf'),
    // 'Font Awesome 5 Pro Light': require('../assets/fontawesome-pro-7.0.0-desktop/otfs/Font Awesome 7 Pro-Light-300.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      console.log('📱 Fonts loaded, preparing app');
      // Hide expo splash screen
      SplashScreen.hideAsync();
      // Initialize notification service
      NotificationService.initialize();
    }
  }, [fontsLoaded, fontError]);

  // Enhanced error logging
  useEffect(() => {
    if (fontError) {
      console.error('❌ Font loading error:', fontError);
    }
  }, [fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ErrorBoundary>
      <View
        style={{
          flex: 1,
          backgroundColor: '#F8FAFC',
        }}
      >
        <M3ThemeProvider>
          <GluestackUIProvider config={mindGainsConfig}>
            <AuthProvider>
              <ThemeProvider value={navigationTheme}>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                    animation: Platform.OS === 'ios' ? 'default' : 'fade_from_bottom',
                    animationDuration: 500, // Premium native feel with M3
                    presentation: 'card',
                    animationTypeForReplace: 'push',
                    contentStyle: { backgroundColor: '#F8FAFC' }, // Milky theme
                  }}
                >
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="subscription" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="mission" />
                <Stack.Screen
                  name="quiz"
                  options={{
                    animation: 'slide_from_bottom',
                    animationDuration: M3Theme.tokens.motion.timing.normal,
                  }}
                />
                <Stack.Screen name="admin" />
                <Stack.Screen name="+not-found" />
                {/* Study-related screens with Material Design transitions */}
                <Stack.Screen
                  name="study/reading-interface"
                  options={{
                    animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
                    animationDuration: M3Theme.tokens.motion.timing.normal,
                    gestureDirection: 'horizontal',
                  }}
                />

              </Stack>
            </ThemeProvider>
              <StatusBar
                style={'dark'} // Milky white mode
                backgroundColor={'#F6F7F9'}
                translucent={false}
                networkActivityIndicatorVisible={false}
                animated={true}
              />
            </AuthProvider>
          </GluestackUIProvider>
        </M3ThemeProvider>
      </View>
    </ErrorBoundary>
  );
}

// 🔐 Auth – MindGains Premium
// No-scroll, single-screen auth with WhatsApp OTP + Google
// For everyone in India: students, teachers, parents, citizens, exam aspirants

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Modal,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  Image,
} from 'react-native';
// @ts-ignore
import headImage from '@/assets/images/head.png';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { theme } from '@/constants/theme';
import { SupabaseService } from '@/utils/supabaseService';
import UniversalNavigation from '@/utils/universalNavigation';
import { supabase } from '@/utils/supabaseService';
import { getUserProtocol } from '@/utils/protocolService';
import { useAuthContext } from '@/components/AuthProvider';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  interpolate,
  Easing,
} from '@/utils/reanimated';

const { width = 375, height = 667 } = Dimensions.get('window') || {};

type AuthStep = 'choose' | 'phone' | 'otp' | 'email';

export default function AuthPremium() {
  const isMounted = useRef(true);
  const [step, setStep] = useState<AuthStep>('choose');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { isAuthenticated, loading: authLoading, initialized } = useAuthContext();
  const otpRefs = useRef<(TextInput | null)[]>([]);
  const redirectHandled = useRef(false);

  // Animations
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(30);
  const shimmerPosition = useSharedValue(-1);

  useEffect(() => {
    isMounted.current = true;
    
    // Start animations
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    logoScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 100 }));
    buttonsOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    buttonsTranslateY.value = withDelay(500, withSpring(0, { damping: 15, stiffness: 100 }));
    
    shimmerPosition.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.linear }),
      -1,
      false
    );

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!initialized || authLoading || !isAuthenticated || redirectHandled.current) return;

    let cancelled = false;
    redirectHandled.current = true;

    const routeAuthenticatedUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || cancelled) return;

        const [profile, protocol] = await Promise.all([
          SupabaseService.getUserProfile(user.id),
          getUserProtocol(user.id),
        ]);

        if (cancelled) return;

        const needsOnboarding = !profile?.full_name || !protocol?.track_id;
        router.replace(needsOnboarding ? '/profile-setup' : '/home');
      } catch (err) {
        console.error('Failed to resolve post-auth route:', err);
        if (!cancelled) {
          router.replace('/home');
        }
      }
    };

    routeAuthenticatedUser();

    return () => {
      cancelled = true;
    };
  }, [initialized, authLoading, isAuthenticated]);

  // Countdown for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'mindgains://auth-callback',
          skipBrowserRedirect: Platform.OS !== 'web',
        },
      });
      
      if (error) throw error;
      
      // For mobile, we'd handle the OAuth redirect differently
      // For now, the session listener in _layout will handle navigation
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password) {
      setError('Enter your email and password to continue');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Email sign-in failed');
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handlePhoneSubmit = async () => {
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Call Supabase Edge Function to send OTP via WhatsApp
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phone: `+91${phone}`, channel: 'whatsapp' }
      });
      
      if (error) throw error;
      
      setStep('otp');
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all digits entered
    if (newOtp.every(digit => digit) && newOtp.join('').length === 6) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (code: string) => {
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { phone: `+91${phone}`, code }
      });
      
      if (error) throw error;
      
      // OTP verified - sign in or create user
      if (data?.session) {
        // Session created by edge function
        await supabase.auth.setSession(data.session);
      }
      
      // Update phone in profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_profiles').upsert({
          id: user.id,
          phone_number: `+91${phone}`,
          updated_at: new Date().toISOString(),
        });
      }
      
      // Navigate based on profile status
      const profile = await SupabaseService.getUserProfile(user?.id || '');
      const protocol = await getUserProtocol(user?.id || '');
      if (!profile?.full_name || !protocol?.track_id) {
        UniversalNavigation.replaceTo('/profile-setup');
      } else {
        UniversalNavigation.replaceTo('/home');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    await handlePhoneSubmit();
  };

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerPosition.value,
      [-1, 1],
      [-width * 2, width * 2]
    );
    return { transform: [{ translateX }] };
  });

  const renderChooseStep = () => (
    <Animated.View style={[styles.buttonsContainer, buttonsAnimatedStyle]}>
      {/* WhatsApp Button */}
      <TouchableOpacity
        style={styles.authButton}
        activeOpacity={1} onPress={() => setStep('phone')}
        activeOpacity={1}
      >
        <LinearGradient
          colors={['#25D366', '#128C7E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.authButtonGradient}
        >
          <FontAwesome5 name="whatsapp" size={24} color="#FFFFFF" />
          <Text style={styles.authButtonText}>Continue with WhatsApp</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Google Button */}
      <TouchableOpacity
        style={styles.authButton}
        onPress={handleGoogleSignIn}
        activeOpacity={1}
        disabled={loading}
      >
        <View style={styles.googleButton}>
          <View style={styles.googleIconContainer}>
            <Text style={styles.googleIcon}>G</Text>
          </View>
          <Text style={styles.googleButtonText}>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Email Button */}
      <TouchableOpacity
        style={styles.authButton}
        activeOpacity={1} onPress={() => {
          setStep('email');
          setError('');
        }}
        activeOpacity={1}
      >
        <LinearGradient
          colors={['#6366F1', '#00D4C7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.authButtonGradient}
        >
          <FontAwesome5 name="envelope" size={20} color="#FFFFFF" />
          <Text style={styles.authButtonText}>Continue with Email</Text>
        </LinearGradient>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </Animated.View>
  );

  const renderPhoneStep = () => (
    <View style={styles.phoneContainer}>
      <TouchableOpacity style={styles.backButton} activeOpacity={1} onPress={() => setStep('choose')}>
        <FontAwesome5 name="arrow-left" size={18} color={'#64748B'} />
      </TouchableOpacity>

      <Text style={styles.stepTitle}>Enter your phone number</Text>
      <Text style={styles.stepSubtitle}>
        We'll send you a verification code on WhatsApp
      </Text>

      <View style={styles.phoneInputContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
        </View>
        <TextInput
          style={styles.phoneInput}
          placeholder="Enter 10-digit number"
          placeholderTextColor={'#71717A'}
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={(text) => {
            setPhone(text.replace(/[^0-9]/g, ''));
            setError('');
          }}
          autoFocus
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.submitButton, phone.length < 10 && styles.submitButtonDisabled]}
        onPress={handlePhoneSubmit}
        disabled={phone.length < 10 || loading}
        activeOpacity={1}
      >
        <LinearGradient
          colors={phone.length >= 10 ? ['#25D366', '#128C7E'] : ['#333', '#222']}
          style={styles.submitButtonGradient}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Send OTP</Text>
              <FontAwesome5 name="arrow-right" size={16} color="#FFFFFF" />
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderEmailStep = () => (
    <View style={styles.phoneContainer}>
      <TouchableOpacity style={styles.backButton} activeOpacity={1} onPress={() => setStep('choose')}>
        <FontAwesome5 name="arrow-left" size={18} color={'#64748B'} />
      </TouchableOpacity>
      <Text style={styles.stepTitle}>Sign in with email</Text>
      <Text style={styles.stepSubtitle}>Use the same credentials from the Mascot tab</Text>

      <View style={styles.emailInputGroup}>
        <TextInput
          style={styles.emailInput}
          placeholder="Email address"
          placeholderTextColor={'#71717A'}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setError('');
          }}
        />
        <View style={styles.passwordInputWrapper}>
          <TextInput
            style={[styles.emailInput, { paddingRight: 48 }]}
            placeholder="Password"
            placeholderTextColor={'#71717A'}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setError('');
            }}
          />
          <TouchableOpacity
            style={styles.passwordToggle}
            activeOpacity={1} onPress={() => setPasswordVisible((prev) => !prev)}
          >
            <FontAwesome5
              name={passwordVisible ? 'eye-slash' : 'eye'}
              size={16}
              color={'#A1A1AA'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.submitButton, (!email || !password) && styles.submitButtonDisabled]}
        onPress={handleEmailSignIn}
        disabled={!email || !password || loading}
        activeOpacity={1}
      >
        <LinearGradient
          colors={email && password ? ['#6366F1', '#00D4C7'] : ['#333', '#222']}
          style={styles.submitButtonGradient}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Sign in</Text>
              <FontAwesome5 name="arrow-right" size={16} color="#FFFFFF" />
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderOtpStep = () => (
    <View style={styles.otpContainer}>
      <TouchableOpacity style={styles.backButton} activeOpacity={1} onPress={() => setStep('phone')}>
        <FontAwesome5 name="arrow-left" size={18} color={'#64748B'} />
      </TouchableOpacity>

      <Text style={styles.stepTitle}>Verify your number</Text>
      <Text style={styles.stepSubtitle}>
        Enter the 6-digit code sent to{'\n'}
        <Text style={styles.phoneHighlight}>+91 {phone}</Text>
      </Text>

      <View style={styles.otpInputContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (otpRefs.current[index] = ref)}
            style={[styles.otpInput, digit && styles.otpInputFilled]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleOtpKeyPress(e, index)}
            autoFocus={index === 0}
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
          />
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={'#00D4C7'} />
          <Text style={styles.loadingText}>Verifying...</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.resendButton}
        onPress={resendOtp}
        disabled={countdown > 0}
      >
        <Text style={[styles.resendText, countdown > 0 && styles.resendTextDisabled]}>
          {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Milky White Background */}
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
        style={StyleSheet.absoluteFill}
      />
      {/* Soft ambient glows */}
      <View style={styles.ambientGlow1} pointerEvents="none" />
      <View style={styles.ambientGlow2} pointerEvents="none" />

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.mascotWrapper}>
          <Image source={headImage} style={styles.mascotImage} resizeMode="contain" />
          <View style={styles.mascotGlow} />
        </View>

        <Text style={styles.logoText}>MindGains</Text>
        <Text style={styles.tagline}>Learn Smarter, Grow Faster</Text>
      </Animated.View>

      {/* Content */}
      <View style={styles.content}>
        {step === 'choose' && renderChooseStep()}
        {step === 'phone' && renderPhoneStep()}
        {step === 'otp' && renderOtpStep()}
        {step === 'email' && renderEmailStep()}
      </View>

      {/* Footer */}
      {step === 'choose' && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.footerLink}>Terms</Text> and{' '}
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  ambientGlow1: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#00D4C7',
    opacity: 0.07,
  },
  ambientGlow2: {
    position: 'absolute',
    top: 200,
    right: -100,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#7C3AED',
    opacity: 0.05,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 72 : 56,
    marginBottom: 28,
  },
  mascotWrapper: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  mascotImage: {
    width: 100,
    height: 100,
  },
  mascotGlow: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -28,
    width: 56,
    height: 16,
    borderRadius: 28,
    backgroundColor: '#00D4C7',
    opacity: 0.2,
  },
  logoText: {
    fontSize: 34,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#64748B',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },
  authButton: {
    width: '100%',
    height: 58,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  authButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  authButtonText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  googleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  googleIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#4285F4',
  },
  googleButtonText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#94A3B8',
  },
  errorText: {
    color: '#EF4444',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#00D4C7',
  },
  // Phone Step
  phoneContainer: {
    flex: 1,
    paddingTop: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  stepTitle: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#64748B',
    marginBottom: 32,
    lineHeight: 22,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    height: 62,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  countryCode: {
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    height: '100%',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#0F172A',
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#0F172A',
    letterSpacing: 1,
  },
  emailInputGroup: {
    gap: 14,
    marginBottom: 24,
  },
  emailInput: {
    width: '100%',
    height: 58,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  passwordInputWrapper: {
    position: 'relative',
    width: '100%',
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  submitButton: {
    width: '100%',
    height: 58,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00D4C7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  // OTP Step
  otpContainer: {
    flex: 1,
    paddingTop: 20,
  },
  phoneHighlight: {
    color: '#00D4C7',
    fontFamily: 'Poppins-SemiBold',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: (width - 48 - 50) / 6,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  otpInputFilled: {
    borderColor: '#00D4C7',
    backgroundColor: 'rgba(0, 212, 199, 0.06)',
    shadowColor: '#00D4C7',
    shadowOpacity: 0.15,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#64748B',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 24,
    padding: 12,
  },
  resendText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#00D4C7',
  },
  resendTextDisabled: {
    color: '#94A3B8',
  },
});

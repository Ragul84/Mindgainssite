import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HapticService from '@/utils/hapticService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConceptImprintInterfaceProps {
  topicName: string;
  onBack: () => void;
  onComplete: () => void;
  blueprint?: any;
}

export default function ConceptImprintInterface({
  topicName,
  onBack,
  onComplete,
  blueprint,
}: ConceptImprintInterfaceProps) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [isImprinted, setIsImprinted] = useState(false);

  // Use provided blueprint or fallback to generic data
  const data = blueprint || {
    concepts: [
      { 
        title: "CORE STRUCTURE", 
        detail: "The foundational framework that defines how systems interact and persist." 
      },
      { 
        title: "OPERATIONAL FLOW", 
        detail: "The sequence of actions and delegations that drive the daily process." 
      },
      { 
        title: "STRATEGIC GOVERNANCE", 
        detail: "High-level decision making and policy enforcement within the hierarchy." 
      }
    ]
  };

  const handleNext = () => {
    if (step < data.concepts.length - 1) {
      setStep(prev => prev + 1);
      HapticService.light();
    } else {
      setIsImprinted(true);
      HapticService.success();
      setTimeout(onComplete, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 🌌 Neural Matrix Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#0F172A', '#020617']}
          style={StyleSheet.absoluteFill}
        />
        <MotiView
          from={{ opacity: 0.1, scale: 0.5 }}
          animate={{ opacity: 0.3, scale: 1.5 }}
          transition={{ type: 'timing', duration: 10000, loop: true }}
          style={styles.neuralOrb}
        />
      </View>

      {/* 🏔️ Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerLabel}>NEURAL IMPRINT SESSION</Text>
          <Text style={styles.headerTitle}>{topicName}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={step}
            from={{ opacity: 0, scale: 0.9, rotateY: '90deg' }}
            animate={{ opacity: 1, scale: 1, rotateY: '0deg' }}
            exit={{ opacity: 0, scale: 0.9, rotateY: '-90deg' }}
            transition={{ type: 'spring', damping: 15 }}
            style={styles.imprintCard}
          >
            <LinearGradient
              colors={['#1E293B', '#0F172A']}
              style={styles.cardGradient}
            >
              <View style={styles.stepIndicator}>
                {data.concepts.map((_: any, i: number) => (
                  <View 
                    key={i} 
                    style={[
                      styles.stepDot, 
                      i === step && styles.stepDotActive,
                      i < step && styles.stepDotDone
                    ]} 
                  />
                ))}
              </View>

              <Text style={styles.conceptTitle}>{data.concepts[step].title}</Text>
              <Text style={styles.conceptDetail}>{data.concepts[step].detail}</Text>
              
              <View style={styles.imprintStatus}>
                <Ionicons 
                  name={step > 0 ? "shield-checkmark" : "sync"} 
                  size={40} 
                  color="#00D4C7" 
                  style={{ opacity: 0.2 }}
                />
              </View>
            </LinearGradient>
          </MotiView>
        </AnimatePresence>

        <TouchableOpacity 
          style={styles.imprintBtn} 
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#00D4C7', '#009B91']}
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>
              {step === data.concepts.length - 1 ? 'FINALIZE IMPRINT' : 'IMPRINT CONCEPT'}
            </Text>
            <Ionicons name="finger-print" size={20} color="#0F172A" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* 🎊 Completion Overlay */}
      <AnimatePresence>
        {isImprinted && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.finishOverlay}
          >
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
            <MotiView
              from={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
              style={styles.finishContent}
            >
              <Ionicons name="sparkles" size={60} color="#00D4C7" />
              <Text style={styles.finishTitle}>Neural Sync Complete</Text>
              <Text style={styles.finishSubtitle}>Fundamentals locked into long-term cache.</Text>
            </MotiView>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  neuralOrb: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.2,
    alignSelf: 'center',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#00D4C7',
    filter: 'blur(50px)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: { flex: 1 },
  headerLabel: { fontSize: 10, fontFamily: 'Poppins-SemiBold', color: '#00D4C7', letterSpacing: 2 },
  headerTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#FFFFFF' },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  imprintCard: {
    height: SCREEN_HEIGHT * 0.5,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardGradient: { flex: 1, padding: 32, alignItems: 'center', justifyContent: 'center' },
  stepIndicator: { flexDirection: 'row', gap: 8, marginBottom: 40 },
  stepDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.1)' },
  stepDotActive: { width: 24, backgroundColor: '#00D4C7' },
  stepDotDone: { backgroundColor: '#00D4C7', opacity: 0.5 },
  conceptTitle: { fontSize: 24, fontFamily: 'Poppins-Bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 20 },
  conceptDetail: { fontSize: 16, fontFamily: 'Inter-Medium', color: '#94A3B8', textAlign: 'center', lineHeight: 26 },
  imprintStatus: { marginTop: 40 },
  imprintBtn: { marginTop: 32, borderRadius: 20, overflow: 'hidden' },
  btnGradient: { paddingVertical: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  btnText: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#0F172A', letterSpacing: 1.5 },
  finishOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  finishContent: { alignItems: 'center', gap: 20 },
  finishTitle: { fontSize: 28, fontFamily: 'Poppins-Bold', color: '#FFFFFF' },
  finishSubtitle: { fontSize: 14, fontFamily: 'Inter-Medium', color: '#94A3B8' },
});


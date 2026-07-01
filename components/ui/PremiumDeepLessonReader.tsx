import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DeepLesson, BlueprintBlock } from '@/services/companion/deepLessonGenerator';
import HapticService from '@/utils/hapticService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PremiumDeepLessonReaderProps {
  lesson: DeepLesson;
  onComplete: () => void;
  onBack: () => void;
}

export default function PremiumDeepLessonReader({
  lesson,
  onComplete,
  onBack,
}: PremiumDeepLessonReaderProps) {
  const insets = useSafeAreaInsets();
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // Auto-scroll when new block unlocks
  useEffect(() => {
    if (unlockedIndex > 0) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 500);
    }
  }, [unlockedIndex]);

  const handleNext = () => {
    if (unlockedIndex < lesson.blocks.length - 1) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setUnlockedIndex(prev => prev + 1);
      HapticService.light();
    } else {
      setCompleted(true);
      HapticService.success();
      setTimeout(onComplete, 3000);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#0F172A', '#020617', '#000000']}
          style={StyleSheet.absoluteFill}
        />
        <MotiView
          from={{ opacity: 0.3, scale: 1 }}
          animate={{ opacity: 0.6, scale: 1.2 }}
          transition={{ type: 'timing', duration: 10000, loop: true }}
          style={styles.ambientGlow}
        />
      </View>

      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTopic}>{lesson.topic}</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>{lesson.title}</Text>
          </View>
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>{Math.round(((unlockedIndex + 1) / lesson.blocks.length) * 100)}%</Text>
          </View>
        </View>
        <View style={styles.progressRail}>
          <MotiView 
            animate={{ width: `${((unlockedIndex + 1) / lesson.blocks.length) * 100}%` }}
            style={styles.progressFill} 
          />
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
      >
        {unlockedIndex === 0 && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={styles.hookSection}
          >
            <LinearGradient
              colors={['rgba(0, 212, 199, 0.15)', 'transparent']}
              style={styles.hookGradient}
            >
              <View style={styles.hookBadge}>
                <Ionicons name="sparkles" size={14} color="#00D4C7" />
                <Text style={styles.hookBadgeText}>Start</Text>
              </View>
              <Text style={styles.hookText}>{lesson.hook || "Here is the core idea before we begin."}</Text>
              {lesson.timeline && (
                <View style={styles.timelineContainer}>
                  <Ionicons name="time-outline" size={14} color="#94A3B8" />
                  <Text style={styles.timelineText}>{lesson.timeline}</Text>
                </View>
              )}
            </LinearGradient>
          </MotiView>
        )}

        {lesson.blocks.map((block, index) => {
          if (index > unlockedIndex) return null;
          return (
            <BlockRenderer
              key={block.blockId}
              block={block}
              isLast={index === unlockedIndex}
              onFinish={handleNext}
            />
          );
        })}
      </ScrollView>

      <AnimatePresence>
        {completed && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.completionOverlay}
          >
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
            <LottieView
              source={require('@/assets/lotties/confetti.json')}
              autoPlay
              loop={false}
              style={styles.lottieConfetti}
              resizeMode="cover"
            />
            <MotiView
              from={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              style={styles.successCard}
            >
              <LinearGradient
                colors={['#1E293B', '#0F172A']}
                style={styles.successGradient}
              >
                <View style={styles.successIconWrapper}>
                  <Ionicons name="checkmark-done" size={48} color="#00D4C7" />
                </View>
                <Text style={styles.successTitle}>Lesson complete</Text>
                <Text style={styles.successBody}>
                  You finished {lesson.topic}. Your next lesson is ready.
                </Text>
              </LinearGradient>
            </MotiView>
          </MotiView>
        )}
      </AnimatePresence>
    </KeyboardAvoidingView>
  );
}

/**
 */
function BlockRenderer({ block, isLast, onFinish }: { 
  block: BlueprintBlock; 
  isLast: boolean; 
  onFinish: () => void 
}) {
  const [isInteracted, setIsInteracted] = useState(false);

  const handleInteraction = () => {
    setIsInteracted(true);
    HapticService.impact();
  };

  const renderInner = () => {
    switch (block.type) {
      case 'concept_build': return <ConceptBuild block={block} />;
      case 'checkpoint_quiz':
      case 'prelims_mcq': return <QuizComponent block={block} onComplete={handleInteraction} />;
      case 'analytical_question': return <AnalyticalDeepDive block={block} onComplete={handleInteraction} />;
      case 'mains_practice': return <MainsSimulator block={block} onComplete={handleInteraction} />;
      case 'final_consolidation': return <FinalConsolidation block={block} />;
      case 'interactive_match': return <InteractiveMatch block={block} onComplete={handleInteraction} />;
      default: return null;
    }
  };

  const isInteractionBlock = ['checkpoint_quiz', 'prelims_mcq', 'analytical_question', 'mains_practice', 'interactive_match'].includes(block.type);
  const showContinue = !isInteractionBlock || isInteracted;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95, translateY: 20 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600 }}
      style={styles.blockContainer}
    >
      {renderInner()}

      {isLast && showContinue && (
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.continueWrapper}
        >
          <TouchableOpacity onPress={onFinish} activeOpacity={0.8} style={styles.continueButton}>
            <LinearGradient
              colors={['#00D4C7', '#009B91']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="#0F172A" />
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>
      )}
    </MotiView>
  );
}

/**
 */

function ConceptBuild({ block }: { block: any }) {
  return (
    <View style={styles.conceptBox}>
      <View style={styles.conceptHeader}>
        <View style={styles.labelIndicator} />
        <Text style={styles.conceptLabel}>{block.title.toUpperCase()}</Text>
      </View>
      
      {block.content.map((p: string, i: number) => (
        <Text key={i} style={styles.contentText}>{p}</Text>
      ))}

      {block.sections && block.sections.map((s: any, i: number) => (
        <View key={i} style={styles.subSection}>
          <Text style={styles.subSectionTitle}>{s.title}</Text>
          {s.bullets.map((b: string, j: number) => (
            <View key={j} style={styles.bulletItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.bulletText}>{b}</Text>
            </View>
          ))}
        </View>
      ))}

      {block.compare && (
        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonHeader}>
            <Text style={styles.comparisonHeaderText}>{block.compare.leftTitle}</Text>
            <Text style={styles.comparisonHeaderText}>{block.compare.rightTitle}</Text>
          </View>
          {block.compare.rows.map((row: any, i: number) => (
            <View key={i} style={styles.comparisonRow}>
              <Text style={styles.comparisonCell}>{row.left}</Text>
              <View style={styles.comparisonSpacer} />
              <Text style={styles.comparisonCell}>{row.right}</Text>
            </View>
          ))}
        </View>
      )}

      {(block.keyUnderstanding || block.deepFocus) && (
        <View style={styles.masteryInsight}>
          <View style={styles.insightHeader}>
             <Ionicons name="bulb" size={14} color="#00D4C7" />
             <Text style={styles.insightTitle}>Note</Text>
          </View>
          {block.keyUnderstanding?.map((k: string, i: number) => (
            <Text key={i} style={styles.insightBody}>{k}</Text>
          ))}
          {block.deepFocus?.map((d: string, i: number) => (
            <Text key={i} style={styles.deepFocusText}>⚡ {d}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

function QuizComponent({ block, onComplete }: { block: any, onComplete: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    onComplete();
  };

  return (
    <View style={styles.quizBox}>
      <View style={styles.quizHeader}>
         <Ionicons name="checkbox" size={16} color="#F59E0B" />
         <Text style={styles.quizLabel}>Quick check</Text>
      </View>
      <Text style={styles.questionText}>{block.question}</Text>
      
      <View style={styles.optionsGrid}>
        {block.options.map((opt: string, i: number) => {
          const isCorrect = opt === block.answer;
          const isSelected = selected === i;

          let cardStyle: any = styles.optionCard;
          if (revealed) {
            if (isCorrect) cardStyle = [styles.optionCard, styles.optionCorrect];
            else if (isSelected) cardStyle = [styles.optionCard, styles.optionWrong];
            else cardStyle = [styles.optionCard, { opacity: 0.4 }];
          }

          return (
            <TouchableOpacity 
              key={i} 
              onPress={() => handleSelect(i)}
              activeOpacity={0.7}
              style={cardStyle}
            >
              <Text style={styles.optionText}>{opt}</Text>
              {revealed && isCorrect && <Ionicons name="checkmark-circle" size={18} color="#10B981" />}
              {revealed && isSelected && !isCorrect && <Ionicons name="close-circle" size={18} color="#F43F5E" />}
            </TouchableOpacity>
          );
        })}
      </View>

      {revealed && (
        <MotiView from={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={styles.explanationBox}>
          <Text style={styles.explanationLabel}>Why</Text>
          <Text style={styles.explanationText}>{block.explanation}</Text>
        </MotiView>
      )}
    </View>
  );
}

function AnalyticalDeepDive({ block, onComplete }: { block: any, onComplete: () => void }) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <View style={styles.analyticalBox}>
      <Text style={styles.analyticalLabel}>Analysis</Text>
      <Text style={styles.questionText}>{block.question}</Text>
      
      {!isRevealed ? (
        <TouchableOpacity 
          style={styles.revealButton} 
          onPress={() => { setIsRevealed(true); onComplete(); }}
        >
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            style={styles.revealGradient}
          >
            <Text style={styles.revealButtonText}>Show answer</Text>
            <Ionicons name="flash" size={16} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.pointsList}>
          {block.expectedPoints.map((p: string, i: number) => (
            <View key={i} style={styles.pointItem}>
              <View style={styles.pointDot} />
              <Text style={styles.pointText}>{p}</Text>
            </View>
          ))}
        </MotiView>
      )}
    </View>
  );
}

function MainsSimulator({ block, onComplete }: { block: any, onComplete: () => void }) {
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <View style={styles.mainsBox}>
      <Text style={styles.mainsLabel}>Practice</Text>
      <Text style={styles.questionText}>{block.question}</Text>
      <View style={styles.wordLimitBadge}>
        <Text style={styles.wordLimitText}>{block.wordLimit} words</Text>
      </View>
      
      {!isSubmitted ? (
        <>
          <TextInput
            style={styles.mainsInput}
            placeholder="Write your answer..."
            placeholderTextColor="#475569"
            multiline
            value={answer}
            onChangeText={setAnswer}
          />
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={() => { setIsSubmitted(true); onComplete(); }}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.confirmedBox}>
          <Ionicons name="shield-checkmark" size={24} color="#10B981" />
          <Text style={styles.confirmedText}>Answer saved.</Text>
        </View>
      )}
    </View>
  );
}

function FinalConsolidation({ block }: { block: any }) {
  return (
    <View style={styles.consolidationBox}>
      <LinearGradient
        colors={['rgba(0, 212, 199, 0.1)', 'transparent']}
        style={styles.consolidationCard}
      >
        <Text style={styles.consolidationLabel}>Summary</Text>
        <Text style={styles.consolidationTitle}>Key takeaways</Text>
        {block.summaryPoints.map((p: string, i: number) => (
          <View key={i} style={styles.pillarItem}>
            <View style={styles.pillarIcon}>
              <Ionicons name="analytics" size={14} color="#00D4C7" />
            </View>
            <Text style={styles.pillarText}>{p}</Text>
          </View>
        ))}
      </LinearGradient>
    </View>
  );
}

function InteractiveMatch({ block, onComplete }: { block: any, onComplete: () => void }) {
  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const [completedMatches, setCompletedMatches] = useState<Record<string, string>>({});

  const handleMatch = (right: string) => {
    if (!activeLeft) return;
    HapticService.impact();
    setCompletedMatches(prev => ({ ...prev, [activeLeft]: right }));
    setActiveLeft(null);
    
    if (Object.keys(completedMatches).length + 1 === block.pairs.length) {
      onComplete();
    }
  };

  return (
    <View style={styles.matchBox}>
      <Text style={styles.matchLabel}>Match</Text>
      <Text style={styles.matchInstruction}>{block.instruction}</Text>
      
      <View style={styles.matchFlex}>
        <View style={styles.matchCol}>
          {block.pairs.map((p: any, i: number) => (
            <TouchableOpacity 
              key={i} 
              onPress={() => setActiveLeft(p.left)}
              activeOpacity={0.7}
              style={[
                styles.matchCard,
                activeLeft === p.left && styles.matchActive,
                completedMatches[p.left] && styles.matchDone
              ]}
            >
              <Text style={styles.matchCardText}>{p.left}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.matchCol}>
          {block.pairs.map((p: any, i: number) => (
            <TouchableOpacity 
              key={i} 
              onPress={() => handleMatch(p.right)}
              activeOpacity={0.7}
              style={[
                styles.matchCard,
                Object.values(completedMatches).includes(p.right) && styles.matchDone
              ]}
            >
              <Text style={styles.matchCardText}>{p.right}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  ambientGlow: {
    position: 'absolute',
    top: -150,
    right: -150,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#00D4C7',
    opacity: 0.15,
  },
  headerContainer: {
    paddingBottom: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: { flex: 1 },
  headerTopic: { fontSize: 10, fontFamily: 'Poppins-SemiBold', color: '#00D4C7' },
  headerTitle: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#FFFFFF' },
  progressBadge: { backgroundColor: 'rgba(0, 212, 199, 0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  progressText: { fontSize: 10, fontFamily: 'Poppins-SemiBold', color: '#00D4C7' },
  progressRail: { height: 3, backgroundColor: 'rgba(255,255,255,0.05)', width: '100%' },
  progressFill: { height: '100%', backgroundColor: '#00D4C7' },
  scrollContent: { padding: 16 },
  hookSection: { marginBottom: 18, borderRadius: 18, overflow: 'hidden' },
  hookGradient: { padding: 18, alignItems: 'center', gap: 10 },
  hookBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0, 212, 199, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  hookBadgeText: { fontSize: 11, fontFamily: 'Poppins-Bold', color: '#00D4C7' },
  hookText: { fontSize: 17, fontFamily: 'Inter-Medium', color: '#F1F5F9', textAlign: 'center', lineHeight: 26 },
  timelineContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timelineText: { fontSize: 12, fontFamily: 'Poppins-Bold', color: '#94A3B8' },
  blockContainer: { marginBottom: 18 },
  continueWrapper: { alignItems: 'center', marginTop: 16 },
  continueButton: { width: '100%', borderRadius: 16, overflow: 'hidden', elevation: 12, shadowColor: '#00D4C7', shadowOpacity: 0.2 },
  continueGradient: { paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  continueText: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  conceptBox: { backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)' },
  conceptHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  labelIndicator: { width: 4, height: 16, backgroundColor: '#00D4C7', borderRadius: 2 },
  conceptLabel: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: '#94A3B8' },
  contentText: { fontSize: 15, fontFamily: 'Inter-Medium', color: '#CBD5E1', lineHeight: 25, marginBottom: 16 },
  subSection: { marginTop: 16, gap: 8 },
  subSectionTitle: { fontSize: 17, fontFamily: 'Poppins-Bold', color: '#FFFFFF', marginBottom: 2 },
  bulletItem: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  bulletPoint: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#00D4C7' },
  bulletText: { fontSize: 15, fontFamily: 'Inter-Medium', color: '#94A3B8', flex: 1 },
  comparisonContainer: { marginTop: 24, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  comparisonHeader: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', padding: 12 },
  comparisonHeaderText: { flex: 1, textAlign: 'center', fontSize: 11, fontFamily: 'Poppins-SemiBold', color: '#FFFFFF' },
  comparisonRow: { flexDirection: 'row', borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.05)', padding: 12 },
  comparisonCell: { flex: 1, textAlign: 'center', fontSize: 13, fontFamily: 'Inter-Medium', color: '#94A3B8' },
  comparisonSpacer: { width: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  masteryInsight: { marginTop: 18, backgroundColor: 'rgba(0, 212, 199, 0.06)', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(0, 212, 199, 0.15)' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  insightTitle: { fontSize: 12, fontFamily: 'Poppins-Bold', color: '#00D4C7' },
  insightBody: { fontSize: 14, fontFamily: 'Inter-Medium', color: '#E2E8F0', lineHeight: 22, marginBottom: 8 },
  deepFocusText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: '#00D4C7', fontStyle: 'italic' },
  quizBox: { backgroundColor: 'rgba(245, 158, 11, 0.04)', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.15)' },
  quizHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  quizLabel: { fontSize: 12, fontFamily: 'Poppins-Bold', color: '#F59E0B' },
  questionText: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#FFFFFF', marginBottom: 18, lineHeight: 26 },
  optionsGrid: { gap: 10 },
  optionCard: { backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 15, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  optionText: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: '#FFFFFF', flex: 1 },
  optionCorrect: { borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)' },
  optionWrong: { borderColor: '#F43F5E', backgroundColor: 'rgba(244, 63, 94, 0.12)' },
  explanationBox: { marginTop: 20, padding: 16, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16 },
  explanationLabel: { fontSize: 9, fontFamily: 'Poppins-SemiBold', color: '#94A3B8', marginBottom: 6 },
  explanationText: { fontSize: 14, fontFamily: 'Inter-Medium', color: '#94A3B8', lineHeight: 20 },
  analyticalBox: { backgroundColor: 'rgba(139, 92, 246, 0.04)', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.15)' },
  analyticalLabel: { fontSize: 12, fontFamily: 'Poppins-Bold', color: '#8B5CF6', marginBottom: 14 },
  revealButton: { borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  revealGradient: { paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  revealButtonText: { color: '#FFFFFF', fontSize: 13, fontFamily: 'Poppins-Bold' },
  pointsList: { marginTop: 8, gap: 18 },
  pointItem: { flexDirection: 'row', gap: 12 },
  pointDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#8B5CF6', marginTop: 8 },
  pointText: { flex: 1, fontSize: 15, fontFamily: 'Inter-Medium', color: '#E2E8F0', lineHeight: 24 },
  mainsBox: { backgroundColor: 'rgba(244, 63, 94, 0.04)', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(244, 63, 94, 0.15)' },
  mainsLabel: { fontSize: 12, fontFamily: 'Poppins-Bold', color: '#F43F5E', marginBottom: 14 },
  wordLimitBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(244, 63, 94, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 20 },
  wordLimitText: { fontSize: 11, fontFamily: 'Poppins-SemiBold', color: '#F43F5E' },
  mainsInput: { backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: 20, borderRadius: 20, color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter-Medium', minHeight: 180, textAlignVertical: 'top', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  submitButton: { backgroundColor: '#F43F5E', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  submitButtonText: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Poppins-Bold' },
  confirmedBox: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 18, borderRadius: 18 },
  confirmedText: { flex: 1, fontSize: 14, fontFamily: 'Inter-SemiBold', color: '#10B981' },
  consolidationBox: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0, 212, 199, 0.2)' },
  consolidationCard: { padding: 20 },
  consolidationLabel: { fontSize: 12, fontFamily: 'Poppins-Bold', color: '#00D4C7', marginBottom: 12 },
  consolidationTitle: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#FFFFFF', marginBottom: 16 },
  pillarItem: { flexDirection: 'row', gap: 16, marginBottom: 20, alignItems: 'flex-start' },
  pillarIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(0, 212, 199, 0.15)', justifyContent: 'center', alignItems: 'center' },
  pillarText: { flex: 1, fontSize: 15, fontFamily: 'Inter-Medium', color: '#E2E8F0', lineHeight: 24 },
  matchBox: { backgroundColor: 'rgba(16, 185, 129, 0.04)', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.15)' },
  matchLabel: { fontSize: 12, fontFamily: 'Poppins-Bold', color: '#10B981', marginBottom: 14 },
  matchInstruction: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: '#FFFFFF', marginBottom: 24 },
  matchFlex: { flexDirection: 'row', gap: 12 },
  matchCol: { flex: 1, gap: 12 },
  matchCard: { height: 64, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, justifyContent: 'center', alignItems: 'center', padding: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  matchActive: { borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  matchDone: { opacity: 0.2, backgroundColor: 'rgba(255,255,255,0.02)' },
  matchCardText: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: '#FFFFFF', textAlign: 'center' },
  completionOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 100, justifyContent: 'center', alignItems: 'center' },
  lottieConfetti: { ...StyleSheet.absoluteFillObject, zIndex: 110, pointerEvents: 'none' },
  successCard: { width: SCREEN_WIDTH * 0.85, borderRadius: 32, overflow: 'hidden', zIndex: 120 },
  successGradient: { padding: 40, alignItems: 'center', gap: 20 },
  successIconWrapper: { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(0, 212, 199, 0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(0, 212, 199, 0.2)' },
  successTitle: { fontSize: 28, fontFamily: 'Poppins-Bold', color: '#FFFFFF', textAlign: 'center' },
  successBody: { fontSize: 15, fontFamily: 'Inter-Medium', color: '#94A3B8', textAlign: 'center', lineHeight: 24 },
});


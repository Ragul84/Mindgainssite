import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HapticService from '@/utils/hapticService';
import RedisService, { QuizExam, QuizSubject, QuizTopic } from '@/utils/redisService';
import UnifiedLoader from '@/components/ui/UnifiedLoader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Step = 'exam' | 'subject' | 'topic';

export default function QuizHub() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<Step>('exam');
  const [exam, setExam] = useState<QuizExam | null>(null);
  const [subject, setSubject] = useState<QuizSubject | null>(null);

  const [exams, setExams] = useState<QuizExam[]>([]);
  const [subjects, setSubjects] = useState<QuizSubject[]>([]);
  const [topics, setTopics] = useState<QuizTopic[]>([]);

  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await RedisService.getExams();
        setExams(data);
      } catch (e) {
        console.warn('[QuizHub] Failed to load exams:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelectExam = useCallback(async (e: QuizExam) => {
    HapticService.selection();
    setExam(e);
    setStep('subject');
    setSubLoading(true);
    try {
      const data = await RedisService.getSubjects(e.id);
      setSubjects(data);
    } catch (err) {
      console.warn('[QuizHub] Failed to load subjects:', err);
    } finally {
      setSubLoading(false);
    }
  }, []);

  const handleSelectSubject = useCallback(async (s: QuizSubject) => {
    HapticService.selection();
    setSubject(s);
    setStep('topic');
    setSubLoading(true);
    try {
      const data = await RedisService.getTopics(exam!.id, s.id);
      setTopics(data);
    } catch (err) {
      console.warn('[QuizHub] Failed to load topics:', err);
    } finally {
      setSubLoading(false);
    }
  }, [exam]);

  const handleSelectTopic = useCallback((t: QuizTopic) => {
    HapticService.medium();
    const key = t.redisKey ?? subject?.redisKey;
    router.push({
      pathname: '/quiz/reader',
      params: {
        topicName: t.name,
        subjectName: subject?.name,
        redisKey: key,
        questionCount: String(t.questionCount ?? 30),
        difficulty: t.difficulty ?? '',
      },
    });
  }, [subject, router]);

  const goBack = useCallback(() => {
    HapticService.selection();
    if (step === 'topic') { setStep('subject'); setTopics([]); }
    else if (step === 'subject') { setStep('exam'); setSubjects([]); setExam(null); }
    else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }, [step, router]);

  const isSchool = exam?.id === 'ncert' || exam?.id === 'samacheer';
  const subtitle = step === 'exam'
    ? 'Choose your exam ecosystem'
    : step === 'subject'
    ? (isSchool ? `Select your Class` : `Select Subject`)
    : (isSchool ? `Pick a ${subject?.name} subject` : `Pick a topic`);

  const pathString = exam ? `${exam.name}${subject ? ` › ${subject.name}` : ''}` : '';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>Quiz Hub</Text>
            {pathString ? (
              <Text style={styles.pathText} numberOfLines={1}>{pathString}</Text>
            ) : (
              <Text style={styles.headerSub}>{subtitle}</Text>
            )}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading ? (
          <UnifiedLoader context="quiz" message="Loading quiz hub…" />
        ) : (
          <View>
            {/* Step Subtitle (only if path is shown) */}
            {pathString && <Text style={styles.stepTitle}>{subtitle}</Text>}

            {/* Exam step */}
            {step === 'exam' && (
              <View style={styles.list}>
                {exams.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.examCard}
                    onPress={() => handleSelectExam(item)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.examInner}>
                      <View style={[styles.iconCircle, { backgroundColor: item.color + '10' }]}>
                        <FontAwesome5 name={item.icon} size={22} color={item.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.examName}>{item.name}</Text>
                        <Text style={styles.examDesc} numberOfLines={1}>{item.desc}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Subject step */}
            {step === 'subject' && (
              <View style={styles.list}>
                {subLoading ? (
                  <UnifiedLoader context="quiz" message="Loading subjects…" />
                ) : subjects.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={styles.subjectItem}
                    onPress={() => handleSelectSubject(s)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.subjectInner}>
                      <View style={styles.subjectLeading}>
                        <View style={styles.subIcon}>
                          <FontAwesome5 name={s.icon} size={15} color="#475569" />
                        </View>
                        <Text style={styles.subjectName}>{s.name}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Topic step */}
            {step === 'topic' && (
              <View style={styles.list}>
                {subLoading ? (
                  <UnifiedLoader context="quiz" message="Loading topics…" />
                ) : topics.length === 0 ? (
                  <View style={styles.center}>
                    <Ionicons name="folder-open-outline" size={48} color="#CBD5E1" />
                    <Text style={styles.emptyText}>No topics found</Text>
                  </View>
                ) : topics.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={styles.topicItem}
                    onPress={() => handleSelectTopic(t)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.topicInner}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.topicName}>{t.name}</Text>
                        {t.questionCount != null && (
                          <Text style={styles.topicCount}>{t.questionCount} questions</Text>
                        )}
                      </View>
                      <View style={[styles.playBtn, { backgroundColor: exam?.color ?? '#0F172A' }]}>
                        <Ionicons name="play" size={10} color="#FFFFFF" />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitle: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  headerSub: { fontSize: 13, fontFamily: 'Inter-Medium', color: '#64748B', marginTop: -2 },
  pathText: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: '#00D4C7', marginTop: -2 },
  stepTitle: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#64748B', marginHorizontal: 20, marginTop: 20, marginBottom: 12 },
  scroll: { paddingHorizontal: 20, paddingTop: 10 },
  list: { gap: 10 },

  examCard: { width: '100%' },
  examInner: {
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  examName: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  examDesc: { fontSize: 12, fontFamily: 'Inter-Medium', color: '#94A3B8' },

  subjectItem: { width: '100%' },
  subjectInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subjectLeading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  subIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  subjectName: { fontSize: 15, fontFamily: 'Poppins-SemiBold', color: '#0F172A' },

  topicItem: { width: '100%' },
  topicInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topicName: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: '#1E293B' },
  topicCount: { fontSize: 11, fontFamily: 'Inter-Medium', color: '#94A3B8' },
  playBtn: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  center: { alignItems: 'center', paddingVertical: 60, gap: 16 },
  emptyText: { fontSize: 15, fontFamily: 'Poppins-SemiBold', color: '#64748B' },
});

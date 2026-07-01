import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Share,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import { useAuthContext } from '@/components/AuthProvider';
import PressableScale from '@/components/ui/PressableScale';
import { StoryUploadModal } from '@/components/ui/StoryUploadModal';
import { mascotApi } from '@/services/mascotApi';
import { V2026 } from '@/theme/v2026-tokens';
import { LinearGradient } from 'expo-linear-gradient';
import HapticService from '@/utils/hapticService';
import LottieView from 'lottie-react-native';

// Enable layout animation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ArtifactType = 'podcast' | 'flashcards' | 'quiz' | 'summary' | 'mind_map';
type MaterialType = 'file' | 'url' | 'youtube' | 'text';

type StudyMaterial = {
  id: string;
  title: string;
  type: MaterialType;
  uploadId?: string;
  body?: string;
  createdAt: number;
};

type StudyArtifact = {
  type: ArtifactType;
  title: string;
  data: any;
  createdAt: number;
};

type StudySession = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  revisedAt?: number;
  materials: StudyMaterial[];
  artifacts: Partial<Record<ArtifactType, StudyArtifact>>;
};

const STORAGE_KEY_PREFIX = 'study_lab_sessions_v1_';

const artifactMeta: Record<ArtifactType, { label: string; icon: keyof typeof Ionicons.glyphMap; tint: string; description: string; actionLabel: string }> = {
  podcast: { label: 'Podcast', icon: 'headset-outline', tint: '#0F766E', description: 'Audio lesson', actionLabel: 'Listen' },
  flashcards: { label: 'Flashcards', icon: 'albums-outline', tint: '#D97706', description: 'Conceptual cards', actionLabel: 'Practice' },
  quiz: { label: 'Practice Quiz', icon: 'help-circle-outline', tint: '#DC2626', description: 'MCQ questions', actionLabel: 'Start' },
  summary: { label: 'Revision Notes', icon: 'document-text-outline', tint: '#15803D', description: 'Summary notes', actionLabel: 'Read' },
  mind_map: { label: 'Mind Map', icon: 'git-network-outline', tint: '#475569', description: 'Concept flows', actionLabel: 'View' },
};

const artifactQueries: Record<ArtifactType, string> = {
  podcast: 'Create a natural conversational podcast script from this material for study revision.',
  flashcards: 'Create high-yield flashcards from this material.',
  quiz: 'Create a practice quiz from this material.',
  summary: 'Create concise revision notes from this material.',
  mind_map: 'Create a clean mind map structure from this material.',
};

const artifactProgressSteps: Record<ArtifactType, [string, string, string, string]> = {
  podcast: [
    'Reading your sources and finding the podcast storyline...',
    'Writing a two-host explanation with student doubts...',
    'Generating the spoken audio lesson...',
    'Saving podcast audio and playback cues...',
  ],
  flashcards: [
    'Scanning the source for recall-worthy facts...',
    'Splitting concepts into question-answer cards...',
    'Checking cards for clean answers and tags...',
    'Saving the flashcard deck...',
  ],
  quiz: [
    'Identifying testable concepts from your material...',
    'Building MCQs with close distractor options...',
    'Writing explanations for every answer...',
    'Saving the practice quiz...',
  ],
  summary: [
    'Decoding the source into exam reading sections...',
    'Organizing chronology, definitions, and priority points...',
    'Tightening notes into a revision-first study guide...',
    'Saving the revision notes...',
  ],
  mind_map: [
    'Finding the central idea and major branches...',
    'Grouping related subtopics into a clean map...',
    'Balancing nodes for quick visual revision...',
    'Saving the mind map...',
  ],
};

const LANGUAGE_OPTIONS = [
  { code: 'en-IN', name: 'English' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'te-IN', name: 'Telugu' },
  { code: 'ml-IN', name: 'Malayalam' },
  { code: 'kn-IN', name: 'Kannada' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LearnScreen() {
  const { user, loading } = useAuthContext();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  
  // Modals & Sheets
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [textOpen, setTextOpen] = useState(false);
  
  // Input fields
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceKind, setSourceKind] = useState<'web' | 'youtube'>('web');
  
  // Operational Status
  const [isWorking, setIsWorking] = useState<ArtifactType | 'upload' | 'text' | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStepText, setProgressStepText] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);
  
  // Audio state
  const [podcastPlayingId, setPodcastPlayingId] = useState<string | null>(null);
  const [podcastBusyId, setPodcastBusyId] = useState<string | null>(null);
  const podcastSoundRef = React.useRef<Audio.Sound | null>(null);

  // Async Generation & Languages
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-IN');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [successOverlayMessage, setSuccessOverlayMessage] = useState('');

  // --- Active Tab Formats Selector ---
  const [selectedFormat, setSelectedFormat] = useState<ArtifactType | null>(null);
  // Curated list of high-yield premium tool cards
  const studyTools = [
    {
      type: 'summary',
      title: 'Revision Notes',
      subtitle: 'Clean chapter notes for fast revision.',
      icon: 'file-alt',
      gradient: ['#15803D', '#4ADE80'],
    },
    {
      type: 'podcast',
      title: 'Audio Podcast',
      subtitle: 'Listen to your material as a lesson.',
      icon: 'headset',
      gradient: ['#0F766E', '#2DD4BF'],
    },
    {
      type: 'flashcards',
      title: 'Flashcards',
      subtitle: 'Recall cards from your own sources.',
      icon: 'clone',
      gradient: ['#D97706', '#FBBF24'],
    },
    {
      type: 'quiz',
      title: 'Practice Quiz',
      subtitle: 'MCQs with answers and explanations.',
      icon: 'tasks',
      gradient: ['#DC2626', '#F87171'],
    },
  ];
  const [viewerOpen, setViewerOpen] = useState(false);

  // --- Premium Interactive Sub-States ---
  // Horizontal flip flashcards: active card index and flip state
  const [activeCardIndex, setActiveCardIndex] = useState<Record<string, number>>({});
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const flipAnim = React.useRef(new Animated.Value(0)).current;

  // Interactive Quiz: session -> questionIndex -> selectedOptionIndex
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, Record<number, number>>>({});

  const storageKey = useMemo(() => `${STORAGE_KEY_PREFIX}${user?.id || 'guest'}`, [user?.id]);

  useEffect(() => {
    if (!isWorking) {
      if (progressPercent > 0 && !activeTaskId) {
        setProgressPercent(100);
        setProgressStepText('Success! Updating your study lab...');
        const timer = setTimeout(() => {
          setShowProgressModal(false);
          setProgressPercent(0);
          setProgressStepText('');
        }, 650);
        return () => clearTimeout(timer);
      }
      setShowProgressModal(false);
      return;
    }

    // Skip fake crawl for active async tasks (which get real server-side progress)
    if (activeTaskId) {
      return;
    }

    setProgressPercent(0);
    setShowProgressModal(true);

    let progress = 0;
    const interval = setInterval(() => {
      // Dynamic, realistic logarithmic crawl
      let increment = 1;
      if (progress < 45) {
        increment = Math.floor(Math.random() * 3) + 2; // Fast (2-4%)
      } else if (progress < 75) {
        increment = Math.floor(Math.random() * 2) + 1; // Medium (1-2%)
      } else if (progress < 92) {
        increment = Math.random() < 0.5 ? 1 : 0; // Crawl (0-1%)
      } else {
        increment = Math.random() < 0.15 ? 1 : 0; // Extremely slow hold
      }

      progress += increment;
      if (progress >= 98) {
        progress = 98;
      }
      setProgressPercent(progress);

      if (isWorking === 'upload') {
        if (progress < 25) {
          setProgressStepText('Connecting to source link...');
        } else if (progress < 50) {
          setProgressStepText('Downloading document contents...');
        } else if (progress < 75) {
          setProgressStepText('Scraping content and extracting text...');
        } else {
          setProgressStepText('Indexing references in study database...');
        }
      } else if (isWorking === 'text') {
        if (progress < 33) {
          setProgressStepText('Cleaning and validating pasted notes...');
        } else if (progress < 66) {
          setProgressStepText('Parsing academic structure...');
        } else {
          setProgressStepText('Saving to local notebook folder...');
        }
      } else {
        const steps = artifactProgressSteps[isWorking as ArtifactType] || artifactProgressSteps.summary;
        if (progress < 25) {
          setProgressStepText(steps[0]);
        } else if (progress < 50) {
          setProgressStepText(steps[1]);
        } else if (progress < 75) {
          setProgressStepText(steps[2]);
        } else {
          setProgressStepText(steps[3]);
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isWorking]);

  useEffect(() => {
    (async () => {
      if (!loading && !user) {
        router.replace('/auth');
        return;
      }
      await loadSessions();
    })();
  }, [loading, user]);

  const loadSessions = async () => {
    try {
      const raw = await AsyncStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      setSessions(Array.isArray(parsed) ? parsed : []);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setSelectedSessionId((prev) => prev || parsed[0].id);
      }
    } catch (err) {
      print('[StudyLab] load failed:', err)
    }
  };

  const persistSessions = async (next: StudySession[]) => {
    setSessions(next);
    await AsyncStorage.setItem(storageKey, JSON.stringify(next));
  };

  const updateSession = async (sessionId: string, updater: (session: StudySession) => StudySession) => {
    const next = sessions.map((session) => (session.id === sessionId ? updater(session) : session));
    await persistSessions(next);
  };

  const selectedSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0] || null;

  const createSession = async () => {
    const title = newTitle.trim();
    if (!title) {
      Alert.alert('Required', 'Please enter a name for your study session.');
      return;
    }
    const session: StudySession = {
      id: `lab-${Date.now()}`,
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      materials: [],
      artifacts: {},
    };
    const next = [session, ...sessions];
    await persistSessions(next);
    setSelectedSessionId(session.id);
    setNewTitle('');
    setCreateOpen(false);
  };

  const attachMaterial = async (material: Omit<StudyMaterial, 'id' | 'createdAt'>) => {
    if (!selectedSession) return;
    const nextMaterial: StudyMaterial = {
      ...material,
      id: `mat-${Date.now()}`,
      createdAt: Date.now(),
    };
    await updateSession(selectedSession.id, (session) => ({
      ...session,
      updatedAt: Date.now(),
      materials: [nextMaterial, ...session.materials],
    }));
  };

  const handleUploadSuccess = async (uploadId: string, type?: 'file' | 'url' | 'youtube') => {
    if (!selectedSession) return;
    const label = type === 'youtube' ? 'YouTube link' : type === 'url' ? 'Web link' : 'File document';
    await attachMaterial({ title: label, type: type || 'file', uploadId });
    
    HapticService.success();
    setSuccessOverlayMessage(`${label} attached successfully to this session!`);
    setShowSuccessOverlay(true);
  };

  const uploadTextSource = async () => {
    if (!selectedSession) return;
    const title = sourceTitle.trim() || 'Pasted notes';
    const body = sourceText.trim();
    if (!body) {
      Alert.alert('Required', 'Please paste some text first.');
      return;
    }
    setIsWorking('text');
    try {
      const res = await mascotApi.uploadStudyText(body, title, selectedSession.id);
      await attachMaterial({ title, type: 'text', uploadId: res.upload_id, body });
      setSourceTitle('');
      setSourceText('');
      setTextOpen(false);
      
      HapticService.success();
      setSuccessOverlayMessage(`Pasted notes attached successfully to this session!`);
      setShowSuccessOverlay(true);
    } catch (err) {
      Alert.alert('Upload failed', 'Could not save the text source.');
    } finally {
      setIsWorking(null);
    }
  };

  const uploadUrlSource = async () => {
    if (!selectedSession) return;
    const trimmed = sourceUrl.trim();
    if (!trimmed) {
      Alert.alert('Required', 'Please paste a URL link.');
      return;
    }
    setIsWorking('upload');
    try {
      const res = await mascotApi.uploadStoryUrl(trimmed, sourceKind, selectedSession.id);
      await attachMaterial({ title: sourceKind === 'youtube' ? 'YouTube link' : 'Web link', type: sourceKind === 'youtube' ? 'youtube' : 'url', uploadId: res.upload_id });
      setSourceUrl('');
      setUploadOpen(false);
      
      HapticService.success();
      setSuccessOverlayMessage(`${sourceKind === 'youtube' ? 'YouTube video' : 'Web article'} link attached successfully to this session!`);
      setShowSuccessOverlay(true);
    } catch (err) {
      Alert.alert('Upload failed', 'Could not save the URL link.');
    } finally {
      setIsWorking(null);
    }
  };

  const pollStatus = async (taskId: string, artifactType: ArtifactType, sessionId: string) => {
    let attempts = 0;
    const intervalTime = 2000; // poll every 2s
    
    const check = async () => {
      try {
        const statusData = await mascotApi.getGenerationStatus(taskId);
        if (!statusData) return;

        // Map milestones to friendly status steps
        let stepText = '';
        switch (statusData.milestone) {
          case 'ingesting':
            stepText = 'Reading sources & building context...';
            break;
          case 'segmenting':
            stepText = 'Structuring the revision syllabus...';
            break;
          case 'analyzing':
            stepText = 'Compiling key concepts & study notes...';
            break;
          case 'synthesizing':
            stepText = 'Generating pure audio synthesis...';
            break;
          case 'ready':
            stepText = 'Study material compiled successfully!';
            break;
          case 'cancelled':
            stepText = 'Generation cancelled.';
            break;
          case 'failed':
            stepText = 'Generation failed.';
            break;
          default:
            stepText = 'Processing...';
        }

        setProgressPercent(statusData.progress || 0);
        setProgressStepText(stepText);

        if (statusData.status === 'completed' && statusData.result?.data) {
          // Success! Update local sessions
          await updateSession(sessionId, (session) => ({
            ...session,
            updatedAt: Date.now(),
            artifacts: {
              ...session.artifacts,
              [artifactType]: {
                type: artifactType,
                title: artifactMeta[artifactType].label,
                data: statusData.result.data,
                createdAt: Date.now(),
              },
            },
          }));
          
          setIsWorking(null);
          setActiveTaskId(null);
          setProgressPercent(100);
          setProgressStepText('Success! Chapter notes compiled.');
          
          setTimeout(() => {
            setShowProgressModal(false);
          }, 1000);
          
        } else if (statusData.status === 'failed') {
          Alert.alert('Generation failed', statusData.error || 'Server error during generation.');
          setIsWorking(null);
          setActiveTaskId(null);
          setShowProgressModal(false);
        } else if (statusData.status === 'cancelled') {
          setIsWorking(null);
          setActiveTaskId(null);
          setShowProgressModal(false);
          setIsCancelling(false);
        } else {
          // Continue polling
          setTimeout(check, intervalTime);
        }
      } catch (err) {
        console.warn('Polling error:', err);
        attempts++;
        if (attempts > 10) {
          Alert.alert('Connection Lost', 'Lost connection to background compilation server.');
          setIsWorking(null);
          setActiveTaskId(null);
          setShowProgressModal(false);
        } else {
          setTimeout(check, intervalTime);
        }
      }
    };
    
    setTimeout(check, 500); // start check
  };

  const handleCancelGeneration = async () => {
    if (!activeTaskId) {
      // Local clean up before taskId is even received
      setIsWorking(null);
      setActiveTaskId(null);
      setShowProgressModal(false);
      setIsCancelling(false);
      return;
    }
    setIsCancelling(true);
    setProgressStepText('Cancelling generation...');
    try {
      await mascotApi.cancelGeneration(activeTaskId);
      // Polling loop will catch the 'cancelled' status from the server and clean up state
    } catch (err) {
      console.warn('Failed to cancel on server:', err);
      // Fallback: cleanup local state immediately if server call failed
      setIsWorking(null);
      setActiveTaskId(null);
      setShowProgressModal(false);
      setIsCancelling(false);
    }
  };

  const generateArtifact = async (artifactType: ArtifactType) => {
    if (!selectedSession) return;
    if (selectedSession.materials.length === 0) {
      Alert.alert('Add sources first', 'Please upload at least one source file or link first.');
      return;
    }
    
    setIsWorking(artifactType);
    setProgressPercent(0);
    setProgressStepText('Queuing generation task on the server...');
    setShowProgressModal(true);
    
    try {
      const primaryUploadId = selectedSession.materials.find((m) => m.uploadId)?.uploadId;
      const response = await mascotApi.generateStudyLabArtifactAsync({
        sessionId: selectedSession.id,
        uploadId: primaryUploadId,
        query: artifactQueries[artifactType],
        artifactType,
        languageCode: selectedLanguage, // dynamically selected language code!
        difficulty: 'intermediate',
        title: selectedSession.title,
        sessionTitle: selectedSession.title,
      });
      
      if (response && response.task_id) {
        setActiveTaskId(response.task_id);
        pollStatus(response.task_id, artifactType, selectedSession.id);
      } else {
        throw new Error('No task_id returned from server');
      }
    } catch (err) {
      Alert.alert('Generation failed', 'Could not initiate background study compilation.');
      setIsWorking(null);
      setShowProgressModal(false);
    }
  };

  const getPodcastAudioFile = async (audioUrl: string, sessionId: string) => {
    const cacheName = `study-lab-${sessionId}-${Date.now()}.mp3`;
    const filePath = `${FileSystem.cacheDirectory || ''}${cacheName}`;
    if (!audioUrl) throw new Error('Missing audio URL');
    if (audioUrl.startsWith('data:')) {
      const base64 = audioUrl.includes(',') ? audioUrl.split(',')[1] : '';
      const mime = audioUrl.split(';base64,')[0].replace('data:', '') || 'audio/mpeg';
      const ext = mime.includes('wav') ? 'wav' : mime.includes('aac') ? 'aac' : 'mp3';
      const finalPath = `${FileSystem.cacheDirectory || ''}${cacheName.replace(/\.mp3$/, `.${ext}`)}`;
      await FileSystem.writeAsStringAsync(finalPath, base64, { encoding: FileSystem.EncodingType.Base64 });
      return finalPath;
    }
    const download = await FileSystem.downloadAsync(audioUrl, filePath);
    return download.uri;
  };

  const playPodcast = async (session: StudySession) => {
    const item = session.artifacts.podcast;
    const audioUrl = item?.data?.audio_url;
    if (!audioUrl) {
      Alert.alert('No audio', 'Please generate the podcast audio first.');
      return;
    }
    setPodcastBusyId(session.id);
    try {
      if (podcastSoundRef.current) {
        try {
          await podcastSoundRef.current.stopAsync();
          await podcastSoundRef.current.unloadAsync();
        } catch {}
        podcastSoundRef.current = null;
      }
      const fileUri = await getPodcastAudioFile(audioUrl, session.id);
      const { sound } = await Audio.Sound.createAsync({ uri: fileUri }, { shouldPlay: true });
      podcastSoundRef.current = sound;
      setPodcastPlayingId(session.id);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded || !('didJustFinish' in status)) return;
        if (status.didJustFinish) {
          setPodcastPlayingId((current) => (current === session.id ? null : current));
          if (podcastSoundRef.current === sound) {
            podcastSoundRef.current = null;
          }
          sound.unloadAsync().catch(() => {});
        }
      });
    } catch (err) {
      Alert.alert('Playback failed', 'Could not play the podcast audio.');
    } finally {
      setPodcastBusyId(null);
    }
  };

  const sharePodcast = async (session: StudySession) => {
    const item = session.artifacts.podcast;
    const audioUrl = item?.data?.audio_url;
    try {
      if (!audioUrl) {
        await Share.share({
          message: `${session.title}\n\n${item?.data?.overview || 'Study Lab podcast'}`,
        });
        return;
      }
      const fileUri = await getPodcastAudioFile(audioUrl, session.id);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          dialogTitle: `${session.title} Podcast`,
          mimeType: 'audio/mpeg',
          UTI: 'public.mp3',
        });
      } else {
        await Share.share({ url: fileUri });
      }
    } catch {
      Alert.alert('Share failed', 'Could not share the podcast file.');
    }
  };
    
const downloadPodcast = async (session: StudySession) => {
    const item = session.artifacts.podcast;
    const audioUrl = item?.data?.audio_url;
    if (!audioUrl) return;
    try {
      const fileUri = await getPodcastAudioFile(audioUrl, session.id);
      Alert.alert('Saved', `Podcast downloaded and saved locally.`);
    } catch {
      Alert.alert('Download failed', 'Could not download the audio file.');
    }
  };

  const shareSession = async () => {
    if (!selectedSession) return;
    const lines = [
      `Study Session: ${selectedSession.title}`,
      `Sources: ${selectedSession.materials.length}`,
      `Study Formats: ${Object.keys(selectedSession.artifacts).length}`,
    ];
    try {
      await Share.share({ message: lines.join('\n') });
    } catch {}
  };

  const toggleRevised = () => {
    if (!selectedSession) return;
    const isCurrentlyRevised = !!selectedSession.revisedAt;
    updateSession(selectedSession.id, (session) => ({
      ...session,
      revisedAt: isCurrentlyRevised ? undefined : Date.now(),
      updatedAt: Date.now(),
    }));
  };

  const renderRoadmapPathway = () => {
    if (!selectedSession) return null;
    const hasSources = selectedSession.materials.length > 0;
    const isFormatSelected = !!selectedFormat;
    const isGenerated = isFormatSelected && !!selectedSession.artifacts[selectedFormat];

    return (
      <View style={styles.roadmapBox}>
        <View style={styles.roadmapHeaderRow}>
          <View style={styles.roadmapHeadingGroup}>
            <Ionicons name="compass-outline" size={13} color="#0F766E" />
            <Text style={styles.roadmapHeading}>Workflow</Text>
          </View>
          <Text style={styles.roadmapProgressText}>
            {!hasSources ? 'Add material' : !isFormatSelected ? 'Choose a tool' : !isGenerated ? 'Compile once' : 'Ready'}
          </Text>
        </View>

        <View style={styles.roadmapStepsRow}>
          {/* Step 1: Add Sources */}
          <View style={styles.roadmapStepNode}>
            <View style={[styles.roadmapStepCircle, hasSources && styles.roadmapStepCircleDone]}>
              <Ionicons
                name={hasSources ? 'checkmark' : 'add'}
                size={11}
                color={hasSources ? '#FFFFFF' : '#0F766E'}
              />
            </View>
            <Text style={[styles.roadmapStepLabel, hasSources && styles.roadmapStepLabelDone]}>
              Add
            </Text>
          </View>

          {/* Connection Line 1 */}
          <View style={[styles.roadmapLine, hasSources && styles.roadmapLineDone]} />

          {/* Step 2: Select Format */}
          <View style={styles.roadmapStepNode}>
            <View style={[
              styles.roadmapStepCircle, 
              hasSources && !isFormatSelected && styles.roadmapStepCircleActive,
              isFormatSelected && styles.roadmapStepCircleDone
            ]}>
              <Ionicons
                name={isFormatSelected ? 'checkmark' : 'options-outline'}
                size={11}
                color={isFormatSelected ? '#FFFFFF' : hasSources ? '#00D4C7' : '#94A3B8'}
              />
            </View>
            <Text style={[
              styles.roadmapStepLabel, 
              hasSources && styles.roadmapStepLabelActive,
              isFormatSelected && styles.roadmapStepLabelDone
            ]}>
              Choose
            </Text>
          </View>

          {/* Connection Line 2 */}
          <View style={[styles.roadmapLine, isFormatSelected && styles.roadmapLineDone]} />

          {/* Step 3: Compile AI */}
          <View style={styles.roadmapStepNode}>
            <View style={[
              styles.roadmapStepCircle,
              isFormatSelected && !isGenerated && styles.roadmapStepCircleActive,
              isGenerated && styles.roadmapStepCircleDone
            ]}>
              <Ionicons
                name={isGenerated ? 'school' : 'sparkles-outline'}
                size={11}
                color={isGenerated ? '#FFFFFF' : isFormatSelected ? '#00D4C7' : '#94A3B8'}
              />
            </View>
            <Text style={[
              styles.roadmapStepLabel,
              isFormatSelected && styles.roadmapStepLabelActive,
              isGenerated && styles.roadmapStepLabelDone
            ]}>
              Compile
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // --- Premium Render Component Methods ---

  const renderArtifact = (data: any, type: ArtifactType) => {
    if (!data) return <Text style={styles.outputBody}>No study content generated.</Text>;
    const sessionId = selectedSession?.id || 'temp';

    // ðŸŽ™ï¸ 1. PODCAST AUDIO READER
    if (type === 'podcast') {
      const chapters = Array.isArray(data.chapters) ? data.chapters : [];
      return (
        <View style={styles.podcastWrapper}>
          {/* Active Audio Waveform Mockup */}
          <View style={styles.audioPlayerHud}>
            <View style={styles.waveformContainer}>
              {[5, 12, 19, 26, 16, 8, 12, 18, 28, 22, 10, 16, 25, 20, 14, 8, 15, 22, 16, 8, 5].map((height, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveformBar,
                    {
                      height,
                      backgroundColor: podcastPlayingId === selectedSession?.id ? '#00D4C7' : '#94A3B8',
                      opacity: podcastPlayingId === selectedSession?.id ? (i % 2 === 0 ? 0.9 : 0.6) : 0.4
                    }
                  ]}
                />
              ))}
            </View>
            <View style={styles.audioPlayerControls}>
              <TouchableOpacity
                style={[styles.audioMainBtn, podcastPlayingId === selectedSession?.id && styles.audioMainBtnPlaying]}
                onPress={() => selectedSession && playPodcast(selectedSession)}
                disabled={podcastBusyId === selectedSession?.id}
              >
                {podcastBusyId === selectedSession?.id ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons
                    name={podcastPlayingId === selectedSession?.id ? 'pause' : 'play'}
                    size={22}
                    color="#FFFFFF"
                  />
                )}
              </TouchableOpacity>
              <View style={styles.audioInfo}>
                <Text style={styles.audioMetaLabel}>
                  {podcastPlayingId === selectedSession?.id ? 'PLAYING PODCAST' : 'AUDIO LESSON'}
                </Text>
                <Text style={styles.audioTimeLabel}>
                  {podcastPlayingId === selectedSession?.id ? 'Active audio study guide' : 'Audio lesson ready'}
                </Text>
              </View>
            </View>
          </View>

          {!!data.overview && (
            <View style={styles.podcastQuoteBox}>
              <FontAwesome5 name="quote-left" size={16} color="#0F766E" style={{ opacity: 0.3, marginBottom: 4 }} />
              <Text style={styles.podcastOverviewText}>{data.overview}</Text>
            </View>
          )}

          {chapters.length > 0 && (
            <View style={styles.chapterTrack}>
              <Text style={styles.trackTitle}>Chapters</Text>
              {chapters.slice(0, 4).map((chapter: any, idx: number) => (
                <View key={idx} style={styles.chapterItem}>
                  <View style={styles.chapterNumberBadge}>
                    <Text style={styles.chapterNumberText}>{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.chapterLabel}>{chapter.title}</Text>
                    <Text style={styles.chapterBrief} numberOfLines={2}>{chapter.summary}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      );
    }

       // 🃏 2. TACTILE FLIP FLASHCARDS
    if (type === 'flashcards') {
      const cards = Array.isArray(data.cards) ? data.cards : [];
      if (!cards.length) return <Text style={styles.outputBody}>No flashcards generated.</Text>;
      
      const currentIdx = activeCardIndex[sessionId] || 0;
      const isCompleted = currentIdx === cards.length;
      const card = !isCompleted ? (cards[currentIdx] || cards[0]) : null;

      const handleNextCard = () => {
        if (currentIdx < cards.length) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setActiveCardIndex({ ...activeCardIndex, [sessionId]: currentIdx + 1 });
          setIsCardFlipped(false);
          flipAnim.setValue(0);
          HapticService.selection();
          if (currentIdx + 1 === cards.length) {
            HapticService.success();
          }
        }
      };

      const handlePrevCard = () => {
        if (currentIdx > 0) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setActiveCardIndex({ ...activeCardIndex, [sessionId]: currentIdx - 1 });
          setIsCardFlipped(false);
          flipAnim.setValue(0);
          HapticService.selection();
        }
      };

      const handleRestart = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setActiveCardIndex({ ...activeCardIndex, [sessionId]: 0 });
        setIsCardFlipped(false);
        flipAnim.setValue(0);
        HapticService.heavy();
      };

      const toggleFlip = () => {
        const toValue = isCardFlipped ? 0 : 1;
        HapticService.selection();
        setIsCardFlipped(!isCardFlipped);
        Animated.spring(flipAnim, {
          toValue,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }).start();
      };

      const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
      });
      const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
      });

      const frontAnimatedStyle = {
        transform: [
          { perspective: 1000 },
          { rotateY: frontInterpolate }
        ],
      };
      const backAnimatedStyle = {
        transform: [
          { perspective: 1000 },
          { rotateY: backInterpolate }
        ],
      };

      return (
        <View style={styles.flashcardContainer}>
          {!isCompleted ? (
            <TouchableOpacity 
              activeOpacity={0.95} 
              onPress={toggleFlip} 
              style={styles.flashcardDeckContainer}
            >
              {/* Front Card Face (Question) */}
              <Animated.View style={[
                styles.flashcardDeck, 
                styles.flashcardDeckFront, 
                frontAnimatedStyle,
                { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backfaceVisibility: 'hidden' }
              ]}>
                {/* Header Row */}
                <View style={styles.flashcardHeader}>
                  <Text style={styles.flashcardBadgeQuestion}>QUESTION</Text>
                  <Text style={styles.flashcardRatio}>{currentIdx + 1} of {cards.length}</Text>
                </View>

                {/* Card Main Canvas */}
                <View style={styles.flashcardMain}>
                  <FontAwesome5 name="quote-left" size={32} color="#E2E8F0" style={styles.quoteIconBg} />
                  <Text style={styles.flashcardFrontText}>{card.front}</Text>
                </View>

                {/* Footer Tip */}
                <View style={styles.flashcardFooterTipRow}>
                  <Ionicons name="swap-horizontal" size={13} color="#94A3B8" />
                  <Text style={styles.flashcardTip}>Tap to flip</Text>
                </View>
              </Animated.View>

              {/* Back Card Face (Answer) */}
              <Animated.View style={[
                styles.flashcardDeck, 
                styles.flashcardDeckBack, 
                backAnimatedStyle,
                { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backfaceVisibility: 'hidden' }
              ]}>
                {/* Header Row */}
                <View style={styles.flashcardHeader}>
                  <Text style={styles.flashcardBadgeBack}>ANSWER</Text>
                  <Text style={styles.flashcardRatio}>{currentIdx + 1} of {cards.length}</Text>
                </View>

                {/* Card Main Canvas */}
                <View style={styles.flashcardMain}>
                  <Text style={styles.flashcardBackText}>{card.back}</Text>
                </View>

                {/* Footer Tip */}
                <View style={styles.flashcardFooterTipRow}>
                  <Ionicons name="swap-horizontal" size={13} color="#94A3B8" />
                  <Text style={styles.flashcardTip}>Tap to flip</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          ) : (
            // Deck Mastered Celebration Slide
            <View style={styles.deckCompletionCard}>
              {/* Lottie celebration animations */}
              <LottieView
                source={require('../../../assets/animations/celebration.json')}
                autoPlay
                loop={false}
                pointerEvents="none"
                style={{ width: '100%', height: 260, position: 'absolute', top: -30 }}
              />
              
              <View style={styles.deckCompletionBadgeContainer}>
                <LottieView
                  source={require('../../../assets/animations/success-checkmark.json')}
                  autoPlay
                  loop={false}
                  pointerEvents="none"
                  style={{ width: 100, height: 100 }}
                />
              </View>

              <Text style={styles.deckCompletionTitle}>Deck Mastered! 🎉</Text>
              <Text style={styles.deckCompletionSubtitle}>
                You have reviewed all {cards.length} flashcards in this deck successfully.
              </Text>

              <TouchableOpacity 
                activeOpacity={0.85} 
                onPress={handleRestart} 
                style={styles.deckRestartPracticeBtn}
              >
                <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.deckRestartPracticeBtnText}>Practice Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Flashcard navigation deck */}
          <View style={styles.flashcardControls}>
            <TouchableOpacity
              onPress={handlePrevCard}
              disabled={currentIdx === 0}
              style={[styles.flashcardNavBtn, currentIdx === 0 && styles.flashcardNavBtnDisabled]}
            >
              <Ionicons name="arrow-back" size={18} color={currentIdx === 0 ? '#CBD5E1' : '#0F172A'} />
            </TouchableOpacity>

            <View style={styles.flashcardProgressTrack}>
              <View
                style={[
                  styles.flashcardProgressBar,
                  { width: `${(Math.min(currentIdx + 1, cards.length) / cards.length) * 100}%` }
                ]}
              />
            </View>

            <TouchableOpacity
              onPress={handleNextCard}
              disabled={isCompleted}
              style={[styles.flashcardNavBtn, isCompleted && styles.flashcardNavBtnDisabled]}
            >
              <Ionicons name="arrow-forward" size={18} color={isCompleted ? '#CBD5E1' : '#0F172A'} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // 🎯 3. INTERACTIVE PRACTICE QUIZ
    if (type === 'quiz') {
      const questions = Array.isArray(data.questions) ? data.questions : [];
      if (!questions.length) return <Text style={styles.outputBody}>No questions available.</Text>;

      const sessionAnswers = selectedQuizAnswers[sessionId] || {};

      const selectAnswer = (qIdx: number, optIdx: number) => {
        const next = { ...selectedQuizAnswers, [sessionId]: { ...sessionAnswers, [qIdx]: optIdx } };
        setSelectedQuizAnswers(next);
      };

      return (
        <View style={styles.quizContainer}>
          {questions.slice(0, 5).map((q: any, idx: number) => {
            const chosen = sessionAnswers[idx];
            const hasChosen = typeof chosen === 'number';
            const isCorrect = q.answer_index === chosen;

            return (
              <View key={idx} style={styles.quizBoxCard}>
                <View style={styles.quizHeaderRow}>
                  <Text style={styles.quizNumIndicator}>QUESTION 0{idx + 1}</Text>
                  {hasChosen && (
                    <View style={[styles.quizResultBadge, isCorrect ? styles.quizResultCorrect : styles.quizResultWrong]}>
                      <Ionicons name={isCorrect ? 'checkmark-circle' : 'close-circle'} size={14} color="#FFFFFF" />
                      <Text style={styles.quizResultBadgeText}>{isCorrect ? 'CORRECT' : 'INCORRECT'}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.quizTextTitle}>{q.question}</Text>
                
                <View style={styles.quizOptionsBox}>
                  {Array.isArray(q.options) && q.options.map((opt: string, optIdx: number) => {
                    const alphabet = String.fromCharCode(65 + optIdx);
                    const isSelected = chosen === optIdx;
                    const isChoiceCorrect = q.answer_index === optIdx;

                    let btnStyle: any = styles.quizOptionPressable;
                    let labelStyle: any = styles.quizOptionLabel;
                    let badgeStyle: any = styles.quizOptionAlpha;
                    let badgeTxtStyle: any = styles.quizOptionAlphaText;

                    if (hasChosen) {
                      if (isSelected) {
                        btnStyle = [styles.quizOptionPressable, isChoiceCorrect ? styles.quizOptionPressableCorrect : styles.quizOptionPressableWrong];
                        labelStyle = [styles.quizOptionLabel, styles.quizOptionLabelActive];
                        badgeStyle = [styles.quizOptionAlpha, isChoiceCorrect ? styles.quizOptionAlphaCorrect : styles.quizOptionAlphaWrong];
                        badgeTxtStyle = [styles.quizOptionAlphaText, styles.quizOptionAlphaTextActive];
                      } else if (isChoiceCorrect) {
                        btnStyle = [styles.quizOptionPressable, styles.quizOptionPressableRevealCorrect];
                        badgeStyle = [styles.quizOptionAlpha, styles.quizOptionAlphaCorrect];
                        badgeTxtStyle = [styles.quizOptionAlphaText, styles.quizOptionAlphaTextActive];
                      } else {
                        btnStyle = [styles.quizOptionPressable, styles.quizOptionPressableDimmed];
                      }
                    }

                    return (
                      <TouchableOpacity
                        key={optIdx}
                        activeOpacity={hasChosen ? 1 : 0.7}
                        onPress={() => !hasChosen && selectAnswer(idx, optIdx)}
                        style={btnStyle}
                      >
                        <View style={badgeStyle}>
                          <Text style={badgeTxtStyle}>{alphabet}</Text>
                        </View>
                        <Text style={labelStyle}>{opt}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {hasChosen && !!q.explanation && (
                  <View style={styles.quizExplanationCard}>
                    <Text style={styles.quizExplanationHeading}>Explanation</Text>
                    <Text style={styles.quizExplanationBody}>{q.explanation}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      );
    }

    // 🗺️ 4. CONNECTED DIAGRAM MIND MAP
    if (type === 'mind_map') {
      const branches = Array.isArray(data.branches) ? data.branches : [];
      return (
        <View style={styles.mindMapContainer}>
          <View style={styles.mindMapRootBox}>
            <View style={styles.mindMapRootCircle}>
              <Ionicons name="analytics" size={18} color="#00D4C7" />
            </View>
            <Text style={styles.mindMapRootText} numberOfLines={2}>
              {data.root || selectedSession?.title || 'Main Concept'}
            </Text>
          </View>

          {/* Dotted connecting line down */}
          <View style={styles.mindMapConnectingLine} />

          <View style={styles.mindMapBranchGrid}>
            {branches.map((branch: any, idx: number) => (
              <View key={idx} style={styles.mindMapBranchCard}>
                <View style={styles.mindMapBranchHeader}>
                  <View style={styles.mindMapBranchDot} />
                  <Text style={styles.mindMapBranchLabel} numberOfLines={1}>{branch.label}</Text>
                </View>
                
                <View style={styles.mindMapSubnodesBox}>
                  {Array.isArray(branch.nodes) && branch.nodes.map((node: string, nIdx: number) => (
                    <View key={nIdx} style={styles.mindMapNodeCapsule}>
                      <View style={styles.mindMapNodeBullet} />
                      <Text style={styles.mindMapNodeText}>{node}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      );
    }

    // 📜 5. FORMATTED REVISION NOTES / SUMMARY
    const points = Array.isArray(data.key_points) ? data.key_points : Array.isArray(data.quick_revision) ? data.quick_revision : [];
    const traps = Array.isArray(data.exam_traps) ? data.exam_traps : Array.isArray(data.important_notes) ? data.important_notes : [];
    const sections = Array.isArray(data.sections) ? data.sections : Array.isArray(data.chapters) ? data.chapters : [];
    const takeaways = points.slice(0, 4);
    const detailPoints = points.slice(4, 12);
    
    return (
      <View style={styles.notesContainer}>
        <View style={styles.notesHeroCard}>
          <View style={styles.notesHeroTopRow}>
            <View style={styles.notesHeroIcon}>
              <Ionicons name="document-text-outline" size={19} color="#0F766E" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.notesHeroEyebrow}>Revision Notes</Text>
              <Text style={styles.notesHeroTitle}>Read this first</Text>
            </View>
          </View>
          {!!data.summary && <Text style={styles.notesHeroBody}>{data.summary}</Text>}
        </View>

        {takeaways.length > 0 && (
          <View style={styles.notesPriorityCard}>
            <Text style={styles.notesSectionTitle}>Most important</Text>
            {takeaways.map((p: string, idx: number) => (
              <View key={idx} style={styles.notesPriorityRow}>
                <View style={styles.notesPriorityIndex}><Text style={styles.notesPriorityIndexText}>{idx + 1}</Text></View>
                <Text style={styles.notesPriorityText}>{p}</Text>
              </View>
            ))}
          </View>
        )}

        {sections.length > 0 && (
          <View style={styles.notesReadingStack}>
            {sections.slice(0, 5).map((section: any, idx: number) => {
              const title = section.title || section.heading || section.name || `Section ${idx + 1}`;
              const body = section.summary || section.content || section.description || '';
              const bullets = Array.isArray(section.points) ? section.points : Array.isArray(section.key_points) ? section.key_points : [];
              return (
                <View key={idx} style={styles.notesSectionCard}>
                  <Text style={styles.notesSectionCardTitle}>{title}</Text>
                  {!!body && <Text style={styles.notesSectionBody}>{body}</Text>}
                  {bullets.slice(0, 4).map((point: string, pIdx: number) => (
                    <View key={pIdx} style={styles.notesBulletRow}>
                      <View style={styles.notesBullet} />
                      <Text style={styles.notesBulletText}>{point}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {detailPoints.length > 0 && (
          <View style={styles.notesKeypointsBox}>
            <Text style={styles.notesSectionTitle}>Also remember</Text>
            {detailPoints.map((p: string, idx: number) => (
              <View key={idx} style={styles.notesBulletRow}>
                <View style={styles.notesBullet} />
                <Text style={styles.notesBulletText}>{point}</Text>
              </View>
            ))}
          </View>
        )}

        {traps.length > 0 && (
          <View style={styles.examTrapAlertCard}>
            <View style={styles.examTrapHeader}>
              <Ionicons name="alert-circle-outline" size={17} color="#B91C1C" />
              <Text style={styles.examTrapTitle}>Watch points</Text>
            </View>
            {traps.slice(0, 6).map((trap: string, idx: number) => (
              <Text key={idx} style={styles.examTrapText}>• {trap}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Ambient glassmorphic colored orb washes */}
      <View style={styles.orbTopLeft} />
      <View style={styles.orbCenterRight} />
      <View style={styles.orbBottomLeft} />

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.topBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Study Lab</Text>
          </View>
          <TouchableOpacity style={styles.historyBtn} activeOpacity={0.8} onPress={() => router.push('/learn/history')}>
            <Ionicons name="time-outline" size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Main mascot branding banner */}
          <View style={styles.introCard}>
            <LinearGradient
              colors={['#09101D', '#111827', '#0B1020']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.heroGlow} />
            <View style={styles.introContent}>
              <Text style={styles.introTitle}>AI Study Lab</Text>
              <Text style={styles.introSubtitle}>Upload your material. Get instant notes, quizzes, flashcards, and audio lessons.</Text>
            </View>
            <Image
              source={require('../../../assets/images/learnmascot.png')}
              style={styles.introVisual}
              resizeMode="contain"
            />
          </View>

          {/* Ambient compiling progress resides directly inside the respective Tools grid items */}

          {/* A. SESSIONS TAB SELECTOR */}
          <View style={styles.sessionHeaderCard}>
            <View style={styles.sessionHeaderCopy}>
              <Text style={styles.sectionHeading}>Sessions</Text>
              <Text style={styles.sectionSubheading}>Choose a notebook to build from</Text>
            </View>
            <TouchableOpacity style={styles.sessionNewBtn} onPress={() => setCreateOpen(true)} activeOpacity={0.82}>
              <Text style={styles.sessionNewText}>New</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sessionScrollContainer}>
            {sessions.map((session) => {
              const active = session.id === selectedSessionId;
              return (
                <PressableScale
                  key={session.id}
                  style={[styles.sessionGlassChip, active && styles.sessionGlassChipActive]}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setSelectedSessionId(session.id);
                  }}
                >
                  <Text style={[styles.sessionChipLabel, active && styles.sessionChipLabelActive]} numberOfLines={1}>
                    {session.title}
                  </Text>
                  <View style={[styles.sessionChipIndicator, active && styles.sessionChipIndicatorActive]}>
                    <Text style={[styles.sessionChipCountText, active && styles.sessionChipCountTextActive]}>
                      {session.materials.length}
                    </Text>
                  </View>
                </PressableScale>
              );
            })}
            <PressableScale style={[styles.sessionGlassChip, styles.sessionCreateDashedChip]} onPress={() => setCreateOpen(true)}>
              <Ionicons name="add" size={14} color="#0F172A" />
              <Text style={styles.sessionChipLabel}>New Session</Text>
            </PressableScale>
          </ScrollView>

          {selectedSession ? (
            <>
              {/* B. DYNAMIC COMPACT NOTEBOOK CONTAINER */}
              <View style={styles.notebookCard}>
                {/* Notebook Header */}
                <View style={styles.notebookHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.notebookTitle} numberOfLines={1}>{selectedSession.title}</Text>
                    <Text style={styles.notebookSub}>
                      Added {new Date(selectedSession.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  {/* Revised Status Pill Toggle */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.revisedTogglePill,
                      selectedSession.revisedAt ? styles.revisedPillActive : styles.revisedPillInactive
                    ]}
                    onPress={toggleRevised}
                  >
                    <Ionicons
                      name={selectedSession.revisedAt ? 'checkmark-circle' : 'ellipse-outline'}
                      size={14}
                      color={selectedSession.revisedAt ? '#15803D' : '#64748B'}
                    />
                    <Text style={[styles.revisedPillText, selectedSession.revisedAt && styles.revisedPillTextActive]}>
                      {selectedSession.revisedAt ? 'Revised' : 'Not Revised'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 🎨 PREMIUM SOURCE WORKSPACE (NO OVERLAPPING BUTTONS) */}
                <View style={styles.notebookSection}>
                  <Text style={styles.notebookSectionHeading}>Add material</Text>
                  <View style={styles.addSourceButtonsGrid}>
                    <TouchableOpacity style={styles.sourceGridCard} activeOpacity={0.82} onPress={() => setUploadOpen(true)}>
                      <LinearGradient colors={['#F0FDFA', '#CCFBF1']} style={styles.sourceGridIconBg}>
                        <Ionicons name="link" size={20} color="#0F766E" />
                      </LinearGradient>
                      <Text style={styles.sourceGridText}>Paste Link</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sourceGridCard} activeOpacity={0.82} onPress={() => setFileUploadOpen(true)}>
                      <LinearGradient colors={['#EFF6FF', '#DBEAFE']} style={styles.sourceGridIconBg}>
                        <Ionicons name="document-text" size={20} color="#1D4ED8" />
                      </LinearGradient>
                      <Text style={styles.sourceGridText}>Upload File</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sourceGridCard} activeOpacity={0.82} onPress={() => setTextOpen(true)}>
                      <LinearGradient colors={['#FDF2F8', '#FCE7F3']} style={styles.sourceGridIconBg}>
                        <Ionicons name="clipboard" size={20} color="#DB2777" />
                      </LinearGradient>
                      <Text style={styles.sourceGridText}>Paste Notes</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* ATTACHED SOURCES CAROUSEL CHIPS */}
                {selectedSession.materials.length > 0 && (
                  <View style={[styles.notebookSection, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                    <Text style={styles.notebookSectionHeading}>Sources ({selectedSession.materials.length})</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sourcesBarScroll}>
                      {selectedSession.materials.map((mat) => (
                        <View key={mat.id} style={styles.sourceBubbleItem}>
                          <Ionicons
                            name={mat.type === 'youtube' ? 'logo-youtube' : mat.type === 'url' ? 'link' : mat.type === 'text' ? 'text' : 'document-text'}
                            size={12}
                            color={mat.type === 'youtube' ? '#DC2626' : '#0F766E'}
                          />
                          <Text style={styles.sourceBubbleLabel} numberOfLines={1}>{mat.title}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* ELEGANT STUDY FORMATS LIST (EQUAL TO OLD LEARN TAB CARD STYLES) */}
                <View style={[styles.notebookSection, { borderBottomWidth: 0, paddingBottom: 8 }]}>
                  <Text style={styles.notebookSectionHeading}>Tools</Text>
                  
                  <View style={styles.listWrap}>
                    {studyTools.map((t, idx) => {
                      const isGenerated = selectedSession ? !!selectedSession.artifacts[t.type as ArtifactType] : false;
                      const activeMeta = artifactMeta[t.type as ArtifactType];
                      const isCompiling = activeTaskId && isWorking === t.type;

                      return (
                        <PressableScale
                          key={t.type}
                          disabled={isCompiling}
                          onPress={() => {
                            setSelectedFormat(t.type as ArtifactType);
                            setViewerOpen(true);
                          }}
                          style={[
                            styles.listItem, 
                            idx === studyTools.length - 1 ? { borderBottomWidth: 0 } : {},
                            isCompiling && { opacity: 0.7 }
                          ]}
                        >
                          <LinearGradient colors={t.gradient as [string, string]} style={styles.listIconBg}>
                            {isCompiling ? (
                              <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                              <FontAwesome5 name={t.icon} size={16} color="#FFF" />
                            )}
                          </LinearGradient>

                          <View style={{ flex: 1 }}>
                            <Text style={styles.itemTitle}>{t.title}</Text>
                            <Text style={styles.itemSubtitle}>
                              {isCompiling ? `Assembling Study Guide...` : t.subtitle}
                            </Text>
                          </View>

                          {isCompiling ? (
                            <View style={[styles.badgePill, { backgroundColor: t.gradient[0] + '15' }]}>
                              <Text style={[styles.badgeText, { color: t.gradient[0] }]}>{progressPercent}%</Text>
                            </View>
                          ) : isGenerated ? (
                            <View style={[styles.badgePill, { backgroundColor: t.gradient[0] + '15' }]}>
                              <Text style={[styles.badgeText, { color: t.gradient[0] }]}>Ready</Text>
                            </View>
                          ) : (
                            <View style={styles.chev}>
                              <FontAwesome5 name="chevron-right" size={12} color="#94A3B8" />
                            </View>
                          )}
                        </PressableScale>
                      );
                    })}
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.glassEmptyWorkspace}>
              <Ionicons name="folder-open-outline" size={48} color="#94A3B8" />
              <Text style={styles.emptyWorkspaceHeading}>No Sessions Yet</Text>
              <Text style={styles.emptyWorkspaceSub}>Create a study session to begin.</Text>
              <TouchableOpacity style={styles.emptyWorkspaceBtn} onPress={() => setCreateOpen(true)}>
                <Text style={styles.emptyWorkspaceBtnText}>Create Session</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* MODAL: CREATE STUDY SESSION */}
      <Modal visible={createOpen} transparent animationType="fade" onRequestClose={() => setCreateOpen(false)}>
        <View style={styles.modalBlurBackdrop}>
          <View style={styles.premiumModalCard}>
            <View style={styles.modalCardHeader}>
              <Text style={styles.modalMainTitle}>Create Session</Text>
              <TouchableOpacity style={styles.modalCloseCircle} onPress={() => setCreateOpen(false)}>
                <Ionicons name="close" size={18} color="#0F172A" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalHelperCopy}>
              Enter a name for this study session notebook. You can then add files, reference links, or pasted texts to compile into study formats.
            </Text>

            <TextInput
              style={styles.modalInputField}
              placeholder="e.g. French Revolution Notes"
              placeholderTextColor="#94A3B8"
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
            />
            
            <View style={styles.modalButtonGrid}>
              <TouchableOpacity style={styles.modalDismissBtn} onPress={() => setCreateOpen(false)}>
                <Text style={styles.modalDismissText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmitBtn} onPress={createSession}>
                <Text style={styles.modalSubmitText}>Create Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 🎉 PREMIUM SUCCESS CELEBRATION OVERLAY */}
      <Modal visible={showSuccessOverlay} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.successOverlayBackdrop}>
          <View style={styles.successCard}>
            <LottieView
              source={require('../../../assets/animations/celebration.json')}
              autoPlay
              loop={false}
              style={{ width: 220, height: 220, position: 'absolute', top: -30 }}
            />
            <LottieView
              source={require('../../../assets/animations/success-checkmark.json')}
              autoPlay
              loop={false}
              style={{ width: 100, height: 100, marginBottom: 12, marginTop: 40 }}
            />
            <Text style={styles.successMainTitle}>Source Added!</Text>
            <Text style={styles.successStepText}>{successOverlayMessage}</Text>
            
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => setShowSuccessOverlay(false)}
              style={styles.successDismissBtn}
            >
              <Text style={styles.successDismissBtnText}>AWESOME</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SHEET MODAL: PASTE TEXT */}
      <Modal visible={textOpen} transparent animationType="slide" onRequestClose={() => setTextOpen(false)}>
        <TouchableOpacity activeOpacity={1} style={styles.sheetBlurBackdrop} onPress={() => setTextOpen(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.premiumBottomSheet} onPress={() => {}}>
            <View style={styles.sheetDragHandle} />
            <View style={styles.sheetTitleHeader}>
              <Text style={styles.sheetMainTitle}>Paste Notes</Text>
              <TouchableOpacity onPress={() => setTextOpen(false)} style={styles.sheetCloseCircularBtn}>
                <Ionicons name="close" size={18} color="#0F172A" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.modalInputField, { minHeight: 120, textAlignVertical: 'top', paddingVertical: 12 }]}
              placeholder="Paste raw textbook passages, classes drafts, or notes..."
              placeholderTextColor="#94A3B8"
              value={sourceText}
              onChangeText={setSourceText}
              multiline
            />
            
            <TextInput
              style={[styles.modalInputField, { marginBottom: 16 }]}
              placeholder="Optional title"
              placeholderTextColor="#94A3B8"
              value={sourceTitle}
              onChangeText={setSourceTitle}
            />
            
            <TouchableOpacity style={[styles.sheetSubmitBtn, isWorking === 'text' && styles.sheetSubmitBtnWorking]} onPress={uploadTextSource} disabled={isWorking === 'text'}>
              {isWorking === 'text' ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.sheetSubmitText}>Save Text Source</Text>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* SHEET MODAL: ADD WEB LINKS */}
      <Modal visible={uploadOpen} transparent animationType="slide" onRequestClose={() => setUploadOpen(false)}>
        <TouchableOpacity activeOpacity={1} style={styles.sheetBlurBackdrop} onPress={() => setUploadOpen(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.premiumBottomSheet} onPress={() => {}}>
            <View style={styles.sheetDragHandle} />
            <View style={styles.sheetTitleHeader}>
              <Text style={styles.sheetMainTitle}>Add URL Link</Text>
              <TouchableOpacity onPress={() => setUploadOpen(false)} style={styles.sheetCloseCircularBtn}>
                <Ionicons name="close" size={18} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <View style={styles.segmentToggleBox}>
              <TouchableOpacity
                style={[styles.segmentOption, sourceKind === 'web' && styles.segmentOptionActive]}
                onPress={() => setSourceKind('web')}
              >
                <Text style={[styles.segmentOptionText, sourceKind === 'web' && styles.segmentOptionTextActive]}>Web Page</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentOption, sourceKind === 'youtube' && styles.segmentOptionActive]}
                onPress={() => setSourceKind('youtube')}
              >
                <Text style={[styles.segmentOptionText, sourceKind === 'youtube' && styles.segmentOptionTextActive]}>YouTube Link</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.modalInputField, { marginBottom: 16 }]}
              placeholder={sourceKind === 'youtube' ? 'Paste YouTube video link URL' : 'Paste web page link URL'}
              placeholderTextColor="#94A3B8"
              value={sourceUrl}
              onChangeText={setSourceUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TouchableOpacity style={[styles.sheetSubmitBtn, isWorking === 'upload' && styles.sheetSubmitBtnWorking]} onPress={uploadUrlSource} disabled={isWorking === 'upload'}>
              {isWorking === 'upload' ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.sheetSubmitText}>Save Link</Text>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* STORY UPLOAD MODAL FOR FILE UPLOAD */}
      <StoryUploadModal
        visible={fileUploadOpen}
        onClose={() => setFileUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        onUploadStart={() => setIsWorking('upload')}
        onUploadEnd={() => setIsWorking(null)}
        sessionId={selectedSession?.id}
        allowYouTube={true}
      />

      {/* PREMIUM ACTIONS PROGRESS OVERLAY */}
      <Modal visible={showProgressModal} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.progressOverlayBackdrop}>
          <View style={styles.progressCard}>
            <LottieView
              source={require('../../../assets/mascot/loading.json')}
              autoPlay
              loop
              style={{ width: 140, height: 140, marginBottom: 8 }}
            />
            
            <Text style={styles.progressMainTitle}>
              {isWorking === 'upload' ? 'Ingesting Source Link' : isWorking === 'text' ? 'Ingesting Paste Notes' : `Generating ${artifactMeta[isWorking as ArtifactType]?.label || 'Study Format'}`}
            </Text>
            
            <Text style={styles.progressStepText}>{progressStepText}</Text>
            
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            
            <Text style={styles.progressPercentLabel}>{progressPercent}%</Text>

            {(activeTaskId || (isWorking && isWorking !== 'upload' && isWorking !== 'text')) && (
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 20, width: '100%' }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: 22,
                    borderWidth: 1.5,
                    borderColor: '#EEF2F7',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                  }}
                  activeOpacity={0.82}
                  onPress={() => setShowProgressModal(false)}
                >
                  <Text style={{ fontSize: 12.5, fontFamily: 'Poppins-Bold', color: '#64748B' }}>
                    Background
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: '#EF4444',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  activeOpacity={0.82}
                  onPress={handleCancelGeneration}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={{ fontSize: 12.5, fontFamily: 'Poppins-Bold', color: '#FFFFFF' }}>
                      Cancel
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ðŸ’Ž IMMERSIVE HIGH-FIDELITY ACADEMIC STUDY VIEWER MODAL */}
      <Modal
        visible={viewerOpen}
        animationType="slide"
        onRequestClose={() => setViewerOpen(false)}
      >
        <SafeAreaView style={styles.viewerModalContainer}>
          {/* Header */}
          <View style={styles.viewerModalHeader}>
            <Text style={styles.viewerModalTitle}>
              {selectedFormat === 'summary' ? 'Revision Notes' : selectedFormat === 'podcast' ? 'Podcast Station' : selectedFormat === 'flashcards' ? 'Study Flashcards' : selectedFormat === 'quiz' ? 'Practice Quiz' : 'Study Lab'}
            </Text>
            <TouchableOpacity style={styles.viewerModalClose} onPress={() => setViewerOpen(false)}>
              <Ionicons name="close-circle" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          {selectedSession && selectedFormat && (
            <ScrollView contentContainerStyle={styles.viewerModalContent} showsVerticalScrollIndicator={false}>
              {selectedSession.artifacts[selectedFormat] ? (
                renderArtifact(selectedSession.artifacts[selectedFormat].data, selectedFormat)
              ) : (
                <View style={styles.notGeneratedContainer}>
                  {/* Clean Centered Icon */}
                  <View style={styles.notGeneratedIconWrapper}>
                    <Ionicons name={artifactMeta[selectedFormat].icon} size={36} color={artifactMeta[selectedFormat].tint} />
                  </View>
                  
                  <Text style={styles.notGeneratedHeading}>
                    Generate {artifactMeta[selectedFormat].label}
                  </Text>
                  
                  <Text style={styles.notGeneratedSub}>
                    Select your language to compile this study guide from your attached sources.
                  </Text>

                  {/* Clean Language Selector Card */}
                  <View style={styles.compactSelectorCard}>
                    <Text style={styles.selectorLabel}>Language</Text>
                    <View style={styles.languageChipsGrid}>
                      {LANGUAGE_OPTIONS.map((lang) => {
                        const isSelected = selectedLanguage === lang.code;
                        return (
                          <TouchableOpacity
                            key={lang.code}
                            activeOpacity={0.82}
                            onPress={() => {
                              HapticService.selection();
                              setSelectedLanguage(lang.code);
                            }}
                            style={[
                              styles.languageChip,
                              isSelected && { 
                                backgroundColor: artifactMeta[selectedFormat].tint,
                                borderColor: artifactMeta[selectedFormat].tint 
                              }
                            ]}
                          >
                            <Text style={[
                              styles.languageChipText,
                              isSelected && styles.languageChipTextActive
                            ]}>
                              {lang.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Clean Primary Button */}
                  <TouchableOpacity
                    style={[styles.modalGenerateBtn, { backgroundColor: artifactMeta[selectedFormat].tint }]}
                    activeOpacity={0.8}
                    onPress={() => {
                      HapticService.heavy();
                      setViewerOpen(false);
                      generateArtifact(selectedFormat);
                    }}
                  >
                    <Text style={styles.modalGenerateBtnText}>Generate</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Premium Immersive Study Modal styles
  viewerModalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  viewerModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#EEF2F7',
    backgroundColor: '#FFFFFF',
  },
  viewerModalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  viewerModalClose: {
    padding: 2,
  },
  viewerModalContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Success Overlay Styles
  successOverlayBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)', // Translucent backdrop
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCard: {
    width: SCREEN_WIDTH - 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F0FDFA',
    position: 'relative',
    ...V2026.shadows.primary,
  },
  successMainTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    textAlign: 'center',
    marginTop: 8,
  },
  successStepText: {
    fontSize: 13.5,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 20,
  },
  successDismissBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00D4C7',
    alignItems: 'center',
    justifyContent: 'center',
    ...V2026.shadows.primary,
  },
  successDismissBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Compiler state card
  notGeneratedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  notGeneratedHeading: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    marginTop: 10,
    textAlign: 'center',
  },
  notGeneratedSub: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  modalGenerateBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    ...V2026.shadows.primary,
  },
  modalGenerateBtnText: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },

  // Premium Grid of Source Buttons
  addSourceButtonsGrid: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  sourceGridCard: {
    flex: 1,
    minHeight: 88,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    ...V2026.shadows.milky,
  },
  sourceGridIconBg: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  sourceGridText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  root: { flex: 1, backgroundColor: '#F6F8F7' },
  safe: { flex: 1 },
  
  // Ambient Glowing Shapes for Glassmorphic Depth
  orbTopLeft: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#0F766E',
    opacity: 0.06,
  },
  orbCenterRight: {
    position: 'absolute',
    top: 300,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#F59E0B',
    opacity: 0.045,
  },
    introCard: {
    minHeight: 136,
    borderRadius: 28,
    marginBottom: 10,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    backgroundColor: '#07111F',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    ...V2026.shadows.milky,
  },
  introContent: {
    flex: 1,
    paddingRight: 150,
    zIndex: 1,
  },
  introTitle: {
    color: 'white',
    fontSize: 21,
    fontFamily: 'Poppins-Bold',
    lineHeight: 25,
  },
  introSubtitle: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 11.5,
    fontFamily: 'Inter-Medium',
    marginTop: 5,
    maxWidth: 215,
    lineHeight: 16,
  },
  introVisual: {
    position: 'absolute',
    right: -10,
    bottom: -18,
    width: 210,
    height: 170,
  },
  heroGlow: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: 'rgba(20,184,166,0.16)',
  },
    listWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    ...V2026.shadows.milky,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    overflow: 'hidden',
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(15, 23, 42, 0.06)',
  },
  listIconBg: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  itemTitle: {
    fontSize: 14.5,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
  },
  itemSubtitle: { 
    marginTop: 1, 
    fontSize: 11.3, 
    color: '#64748B', 
    fontFamily: 'Inter-Medium',
    paddingRight: 10,
    lineHeight: 15,
  },
  chev: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#F8FAFC', 
    borderWidth: 1, 
    borderColor: 'rgba(0,0,0,0.02)' 
  },
  badgePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  modalRoot: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
    backgroundColor: '#FFFFFF',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  modalShareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  modalHeaderSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 1,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 80,
  },
  modalNotGeneratedBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#F8FAFC',
  },
  modalNotGeneratedIconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalNotGeneratedHeading: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalNotGeneratedSub: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalGenerateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    ...V2026.shadows.milky,
  },
  modalGenerateBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },  orbBottomLeft: {
    position: 'absolute',
    bottom: 40,
    left: -100,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#15803D',
    opacity: 0.045,
  },

  // Header Styles
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    letterSpacing: -0.8,
  },
  historyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    ...V2026.shadows.milky,
  },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 130,
    gap: 8,
  },

  // Sessions Selector row
  sessionHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 0,
    ...V2026.shadows.milky,
  },
  sessionHeaderCopy: {
    flex: 1,
  },
  sectionHeading: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    letterSpacing: 0,
  },
  sectionSubheading: {
    marginTop: 1,
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  linkText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F766E',
  },
  sessionNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#0F172A',
  },
  sessionNewText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  sessionScrollContainer: {
    gap: 8,
    paddingTop: 4,
    paddingBottom: 2,
  },
  sessionGlassChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 99,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    ...V2026.shadows.milky,
  },
  sessionGlassChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
    ...V2026.shadows.primary,
  },
  sessionCreateDashedChip: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    backgroundColor: 'transparent',
  },
  sessionChipLabel: {
    fontSize: 11.5,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
  },
  sessionChipLabelActive: {
    color: '#FFFFFF',
  },
  sessionChipIndicator: {
    backgroundColor: 'rgba(15,118,110,0.06)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  sessionChipIndicatorActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  sessionChipCountText: {
    fontSize: 9.5,
    fontFamily: 'Inter-SemiBold',
    color: '#0F766E',
  },
  sessionChipCountTextActive: {
    color: '#FFFFFF',
  },

  // --- B. DYNAMIC COMPACT NOTEBOOK CONTAINER ---
  notebookCard: {
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    padding: 14,
    gap: 12,
    ...V2026.shadows.milky,
  },
  notebookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    paddingBottom: 12,
  },
  notebookTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  notebookSub: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 1,
  },
  revisedTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
  },
  revisedPillActive: {
    backgroundColor: 'rgba(21,128,61,0.05)',
    borderColor: 'rgba(21,128,61,0.2)',
  },
  revisedPillInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  revisedPillText: {
    fontSize: 10.5,
    fontFamily: 'Poppins-SemiBold',
    color: '#64748B',
  },
  revisedPillTextActive: {
    color: '#15803D',
  },
  notebookSection: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    paddingBottom: 14,
    gap: 8,
  },
  sectionHeaderLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notebookSectionHeading: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    letterSpacing: 0,
  },
  
  // Sources bar styling
  sourcesBarScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 1,
  },
  sourcesBarEmptyText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    marginRight: 4,
  },
  sourceBubbleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: 140,
  },
  sourceBubbleLabel: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#334155',
  },
  addBarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(15,118,110,0.18)',
    paddingHorizontal: 9,
    paddingVertical: 5.5,
  },
  addBarBtnText: {
    fontSize: 10.5,
    fontFamily: 'Inter-SemiBold',
    color: '#0F766E',
  },

  // Index Tab selector styling
  formatTabsScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  formatTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  formatTabPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
    ...V2026.shadows.primary,
  },
  formatTabPillGenerated: {
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: '#FFFFFF',
  },
  formatTabLabel: {
    fontSize: 11.5,
    fontFamily: 'Poppins-SemiBold',
    color: '#64748B',
  },
  formatTabLabelActive: {
    color: '#FFFFFF',
  },
  tabDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 1,
  },

  // --- C. ACTIVE FORMAT VIEWER BOX ---
  viewerGlassCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    ...V2026.shadows.milky,
  },
  viewerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    paddingBottom: 10,
    marginBottom: 12,
    gap: 12,
  },
  viewerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  viewerTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  viewerShareBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerBody: {
    marginTop: 2,
  },
  outputBody: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#334155',
    lineHeight: 19,
  },

  // Not generated format box state
  notGeneratedBox: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  notGeneratedHeading: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    marginTop: 4,
  },
  notGeneratedSub: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 16,
  },
  generateBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 99,
    paddingHorizontal: 22,
    paddingVertical: 10,
    ...V2026.shadows.primary,
  },
  generateBtnWorking: {
    backgroundColor: '#64748B',
  },
  generateBtnText: {
    fontSize: 11.5,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },

  // --- PODCAST AUDIOS PLAYER ---
  podcastWrapper: {
    gap: 12,
  },
  audioPlayerHud: {
    borderRadius: 18,
    backgroundColor: 'rgba(15, 118, 110, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.1)',
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 30,
    width: '100%',
  },
  waveformBar: {
    width: 3,
    borderRadius: 10,
  },
  audioPlayerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(15, 118, 110, 0.08)',
    paddingTop: 8,
  },
  audioMainBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    ...V2026.shadows.primary,
  },
  audioMainBtnPlaying: {
    backgroundColor: '#00D4C7',
  },
  audioInfo: {
    flex: 1,
  },
  audioMetaLabel: {
    fontSize: 7.5,
    fontFamily: 'Inter-SemiBold',
    color: '#0F766E',
    letterSpacing: 0.8,
  },
  audioTimeLabel: {
    fontSize: 10.5,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
    marginTop: 1,
  },
  podcastQuoteBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  podcastOverviewText: {
    fontSize: 11.5,
    fontFamily: 'Inter-Medium',
    color: '#475569',
    lineHeight: 16,
  },
  chapterTrack: {
    gap: 6,
  },
  trackTitle: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chapterNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(15,118,110,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumberText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#0F766E',
  },
  chapterLabel: {
    fontSize: 11.5,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
  },
  chapterBrief: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    lineHeight: 13,
    marginTop: 1,
  },
  podcastUtilityRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  podcastGhostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  podcastUtilityText: {
    fontSize: 10.5,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
  },

  // --- TACTILE FLASHCARDS DECK ---
  flashcardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 20,
  },
  flashcardDeckContainer: {
    width: '100%',
    height: 440,
    position: 'relative',
  },
  flashcardDeck: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    padding: 24,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  flashcardDeckFront: {
    backgroundColor: '#FCFBF7',
    borderColor: '#E9E6DC',
  },
  flashcardDeckBack: {
    backgroundColor: '#FFFDF9',
    borderColor: '#D97706',
  },
  flashcardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    paddingBottom: 8,
  },
  flashcardBadgeQuestion: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  flashcardBadgeBack: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  flashcardRatio: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
  },
  flashcardMain: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  quoteIconBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.08,
  },
  flashcardFrontText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  flashcardBackText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 8,
  },
  flashcardFooterTipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.03)',
    paddingTop: 8,
  },
  flashcardTip: {
    fontSize: 9.5,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  deckCompletionCard: {
    width: '100%',
    minHeight: 280,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EEF2F7',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...V2026.shadows.milky,
  },
  deckCompletionBadgeContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  deckCompletionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  deckCompletionSubtitle: {
    fontSize: 12.5,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  deckRestartPracticeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 99,
    ...V2026.shadows.primary,
  },
  deckRestartPracticeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },
  flashcardControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
  },
  flashcardNavBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashcardNavBtnDisabled: {
    opacity: 0.4,
  },
  flashcardProgressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  flashcardProgressBar: {
    height: '100%',
    backgroundColor: '#D97706',
    borderRadius: 3,
  },
  mascotStudyHelperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    borderRadius: 20,
    padding: 12,
    marginTop: 6,
  },
  mascotHelperImage: {
    width: 54,
    height: 54,
  },
  mascotHelperTextContent: {
    flex: 1,
    gap: 2,
  },
  mascotHelperTitle: {
    fontSize: 11.5,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  mascotHelperBody: {
    fontSize: 10.5,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    lineHeight: 14,
  },

  // --- PRACTICE QUIZ BLOCKS ---
  quizContainer: {
    gap: 12,
  },
  quizBoxCard: {
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  quizHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  quizNumIndicator: {
    fontSize: 9,
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  quizResultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  quizResultCorrect: {
    backgroundColor: '#10B981',
  },
  quizResultWrong: {
    backgroundColor: '#EF4444',
  },
  quizResultBadgeText: {
    fontSize: 8,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  quizTextTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
    lineHeight: 18,
  },
  quizOptionsBox: {
    gap: 6,
    marginTop: 10,
  },
  quizOptionPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 8,
  },
  quizOptionPressableCorrect: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16,185,129,0.03)',
  },
  quizOptionPressableWrong: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239,68,68,0.03)',
  },
  quizOptionPressableRevealCorrect: {
    borderColor: '#10B981',
    borderStyle: 'dashed',
  },
  quizOptionPressableDimmed: {
    opacity: 0.6,
  },
  quizOptionAlpha: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizOptionAlphaCorrect: {
    backgroundColor: '#10B981',
  },
  quizOptionAlphaWrong: {
    backgroundColor: '#EF4444',
  },
  quizOptionAlphaText: {
    fontSize: 9.5,
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
  },
  quizOptionAlphaTextActive: {
    color: '#FFFFFF',
  },
  quizOptionLabel: {
    fontSize: 11.5,
    fontFamily: 'Inter-Medium',
    color: '#334155',
    flex: 1,
  },
  quizOptionLabelActive: {
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
  },
  quizExplanationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  quizExplanationHeading: {
    fontSize: 9.5,
    fontFamily: 'Poppins-Bold',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  quizExplanationBody: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#475569',
    lineHeight: 14,
    marginTop: 2,
  },

  // --- CONNECTED DIAGRAM MIND MAP ---
  mindMapContainer: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: 2,
  },
  mindMapRootBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#00D4C7',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...V2026.shadows.primary,
    maxWidth: SCREEN_WIDTH * 0.72,
  },
  mindMapRootCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,212,199,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mindMapRootText: {
    fontSize: 11.5,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  mindMapConnectingLine: {
    width: 2,
    height: 14,
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderStyle: 'dashed',
  },
  mindMapBranchGrid: {
    width: '100%',
    gap: 8,
  },
  mindMapBranchCard: {
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
  },
  mindMapBranchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    paddingBottom: 4,
    marginBottom: 4,
  },
  mindMapBranchDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0F766E',
  },
  mindMapBranchLabel: {
    fontSize: 11.5,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
    flex: 1,
  },
  mindMapSubnodesBox: {
    gap: 4,
    paddingLeft: 10,
  },
  mindMapNodeCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  mindMapNodeBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
  },
  mindMapNodeText: {
    fontSize: 10.5,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },

    // --- REVISION NOTES READING LAYOUT ---
  notesContainer: {
    gap: 12,
  },
  notesHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    ...V2026.shadows.milky,
  },
  notesHeroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  notesHeroIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  notesHeroEyebrow: {
    fontSize: 10.5,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F766E',
  },
  notesHeroTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    lineHeight: 23,
  },
  notesHeroBody: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#334155',
    lineHeight: 22,
  },
  notesPriorityCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  notesSectionTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  notesPriorityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  notesPriorityIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
  },
  notesPriorityIndexText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  notesPriorityText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    lineHeight: 19,
  },
  notesReadingStack: {
    gap: 10,
  },
  notesSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  notesSectionCardTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  notesSectionBody: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#334155',
    lineHeight: 21,
    marginBottom: 8,
  },
  notesKeypointsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    gap: 7,
  },
  notesBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 2,
  },
  notesBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0F766E',
    marginTop: 7,
  },
  notesBulletText: {
    fontSize: 12.5,
    fontFamily: 'Inter-Medium',
    color: '#334155',
    lineHeight: 19,
    flex: 1,
  },
  examTrapAlertCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 14,
    gap: 6,
    marginTop: 0,
  },
  examTrapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  examTrapTitle: {
    fontSize: 9.5,
    fontFamily: 'Poppins-Bold',
    color: '#DC2626',
    letterSpacing: 0.8,
  },
  examTrapText: {
    fontSize: 10.5,
    fontFamily: 'Inter-SemiBold',
    color: '#475569',
    lineHeight: 14,
  },

  // Empty states
  glassEmptyWorkspace: {
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    paddingVertical: 34,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    ...V2026.shadows.milky,
  },
  emptyWorkspaceHeading: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  emptyWorkspaceSub: {
    fontSize: 11.5,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
  },
  emptyWorkspaceBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 99,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 6,
  },
  emptyWorkspaceBtnText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },

  // --- PREMIUM SYSTEM MODALS ---
  modalBlurBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  premiumModalCard: {
    width: '100%',
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    padding: 20,
    ...V2026.shadows.milky,
  },
  modalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalMainTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  modalCloseCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHelperCopy: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    lineHeight: 15,
    marginBottom: 14,
  },
  modalInputField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#0F172A',
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    marginBottom: 16,
  },
  modalButtonGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  modalDismissBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  modalDismissText: {
    color: '#0F172A',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
  },
  modalSubmitBtn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#0F172A',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
  },

  // --- PREMIUM SYSTEM BOTTOM SHEETS ---
  sheetBlurBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
    justifyContent: 'flex-end',
  },
  premiumBottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 36,
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    ...V2026.shadows.milky,
  },
  sheetDragHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 99,
    backgroundColor: '#E2E8F0',
    marginBottom: 8,
  },
  sheetTitleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sheetMainTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  sheetCloseCircularBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetSubmitBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    marginTop: 4,
  },
  sheetSubmitBtnWorking: {
    backgroundColor: '#64748B',
  },
  sheetSubmitText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
  },

  segmentToggleBox: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  segmentOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  segmentOptionActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  segmentOptionText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#64748B',
  },
  segmentOptionTextActive: {
    color: '#FFFFFF',
  },
  progressOverlayBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  progressCard: {
    width: '100%',
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    padding: 24,
    alignItems: 'center',
    ...V2026.shadows.milky,
  },
  progressMainTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  progressStepText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    height: 18,
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00D4C7',
    borderRadius: 4,
  },
  progressPercentLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#00D4C7',
    textAlign: 'center',
  },

  // AI Study Pathway
  roadmapBox: {
    backgroundColor: '#F7FBF9',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCEBE6',
    padding: 12,
    marginTop: 2,
    marginBottom: 2,
  },
  roadmapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  roadmapHeadingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roadmapHeading: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#0F766E',
    letterSpacing: 0,
  },
  roadmapProgressText: {
    fontSize: 9.5,
    fontFamily: 'Poppins-SemiBold',
    color: '#64748B',
  },
  roadmapStepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  roadmapStepNode: {
    alignItems: 'center',
    width: 58,
  },
  roadmapStepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  roadmapStepCircleActive: {
    borderColor: '#00D4C7',
    backgroundColor: '#F0FDFA',
  },
  roadmapStepCircleDone: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  roadmapStepLabel: {
    fontSize: 9.5,
    fontFamily: 'Poppins-Medium',
    color: '#94A3B8',
    textAlign: 'center',
  },
  roadmapStepLabelActive: {
    color: '#0F172A',
    fontFamily: 'Poppins-SemiBold',
  },
  roadmapStepLabelDone: {
    color: '#10B981',
    fontFamily: 'Poppins-SemiBold',
  },
  roadmapLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginTop: -16,
  },
  roadmapLineDone: {
    backgroundColor: '#10B981',
  },
});
















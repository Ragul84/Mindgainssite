import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
  Linking,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
  Pressable,
  Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import { BlurView } from 'expo-blur';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mascotApi } from '@/services/mascotApi';

import { useAuthContext } from '@/components/AuthProvider';
import {
  getMissionPayload,
  getUserProtocol,
  getDailyQuestionTarget,
  updateProtocolPhase,
  MissionPayload,
  MissionLessonPage
} from '@/utils/protocolService';
import HapticService from '@/utils/hapticService';
import UnifiedLoader from '@/components/ui/UnifiedLoader';
import RedisService from '@/utils/redisService';
import NotificationService from '@/utils/notificationService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getYouTubeVideoId = (url?: string) => {
  const value = String(url || '').trim();
  if (!value) return '';
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*?[?&]?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) return match[1];
  }
  return '';
};

const buildYouTubeEmbedHtml = (videoId: string, title: string) => `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <style>
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; }
      iframe { width: 100%; height: 100%; border: 0; display: block; }
    </style>
  </head>
  <body>
    <iframe
      title="${String(title || 'Video lesson').replace(/"/g, '&quot;')}"
      src="https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen>
    </iframe>
  </body>
</html>
`;

const buildYouTubeInteractivePlayerHtml = (videoId: string, title: string) => `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <style>
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; }
      #player { width: 100%; height: 100%; border: 0; }
    </style>
  </head>
  <body>
    <div id="player"></div>
    <script>
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '100%',
          width: '100%',
          videoId: '${videoId}',
          playerVars: {
            'playsinline': 1,
            'rel': 0,
            'modestbranding': 1,
            'controls': 1,
            'showinfo': 0
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      function onPlayerReady(event) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
        setInterval(function() {
          if (player && typeof player.getCurrentTime === 'function') {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'timeupdate',
              currentTime: player.getCurrentTime(),
              duration: player.getDuration()
            }));
          }
        }, 500);
      }

      function onPlayerStateChange(event) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'stateChange',
          state: event.data
        }));
      }

      window.seekToTime = function(seconds) {
        if (player && typeof player.seekTo === 'function') {
          player.seekTo(seconds, true);
          player.playVideo();
        }
      };
    </script>
  </body>
</html>
`;

const cleanMissionTitle = (title?: string) => {
  const value = String(title || '').replace(/\s+/g, ' ').trim();
  return value.replace(/\s*\((?:Days?|Day)\s+\d+\s*(?:[-–]\s*\d+)?\)\s*$/i, '').trim();
};

export default function MissionReader() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();

  const phaseId = parseInt(params.phaseId as string || '1', 10);
  const phaseType = params.phaseType as string;
  const topicTitle = params.topicTitle as string;

  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<MissionPayload | null>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const protocol = await getUserProtocol(user.id);
        if (protocol) {
          const { payload: missionPayload } = await getMissionPayload(
            protocol.track_id,
            protocol.current_day_number
          );
          setPayload(missionPayload);
        }
      } catch (error) {
        console.error('Failed to load mission payload:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  const handleComplete = async () => {
    if (!user?.id) return;
    HapticService.success();
    
    // Update phase in DB if it's the current phase
    const protocol = await getUserProtocol(user.id);
    if (protocol && protocol.progress_phase === phaseId) {
      await updateProtocolPhase(user.id, phaseId + 1);
      
      // If completing Phase 4 (Self-Assessment Quiz), today's goal is complete!
      if (phaseId === 4) {
        NotificationService.scheduleDailyNotifications(true);
      }
    }
    
    setComplete(true);
    setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/daily-mission');
      }
    }, 1500);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <UnifiedLoader context="learn" message="Loading your lesson…" />
      </View>
    );
  }

  const renderContent = () => {
    switch (phaseType) {
      case 'snapshot':
        return <SnapshotContent payload={payload} />;
      case 'flashback':
        return <FlashbackContent payload={payload} />;
      case 'flashcards':
        return <FlashcardsContent payload={payload} />;
      case 'videos':
        return <VideosContent payload={payload} userId={user?.id} />;
      case 'quiz':
        return <QuizContent payload={payload} onComplete={handleComplete} />;
      case 'current_affairs':
        return <CurrentAffairsQuizContent onComplete={handleComplete} />;
      default:
        return <Text style={styles.errorText}>Unknown phase type</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 🏔️ Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity activeOpacity={1} onPress={() => router.canGoBack() ? router.back() : router.replace('/daily-mission')} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {cleanMissionTitle(topicTitle)}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* ⚡ v12 Stamina & Density Banners */}
      {payload?.curriculum_metadata?.is_long_day && (
        <View style={styles.longDayBanner}>
          <Ionicons name="timer-outline" size={14} color="#F43F5E" />
          <Text style={styles.longDayText}>LONG DAY: Estimated {payload.curriculum_metadata.estimated_time || '25 min'}</Text>
        </View>
      )}

      {payload?.curriculum_metadata?.time_boxed_sprint && (
        <View style={styles.staminaBanner}>
          <Ionicons name="flash" size={14} color="#EAB308" />
          <Text style={styles.staminaText}>
            {payload.curriculum_metadata.time_boxed_sprint.type} SPRINT: {payload.curriculum_metadata.time_boxed_sprint.duration} min timer active
          </Text>
        </View>
      )}

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderContent()}
      </ScrollView>

      {/* 🚀 Action Button (Except for Quiz which has its own flow) */}
      {phaseType !== 'quiz' && phaseType !== 'current_affairs' && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity 
            style={styles.completeButton} 
            onPress={handleComplete}
            activeOpacity={1}
          >
            <LinearGradient
              colors={['#4285F4', '#357AE8']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.completeButtonText}>MARK AS COMPLETE</Text>
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* 🎊 Completion Overlay */}
      <AnimatePresence>
        {complete && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.completionOverlay}
          >
            <LottieView
              source={require('@/assets/lotties/confetti.json')}
              autoPlay
              loop={false}
              style={styles.confettiLottie}
              resizeMode="cover"
            />
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
            <MotiView
              from={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              style={styles.completionCard}
            >
              <View style={styles.successIconOuter}>
                <Ionicons name="checkmark" size={42} color="#FFFFFF" />
              </View>
              <Text style={styles.successTitle}>Section Completed!</Text>
              <Text style={styles.successSubtitle}>Great progress. Moving to next section...</Text>
            </MotiView>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}

/* --- Phase Content Components --- */

const FlashbackContent = ({ payload }: { payload: MissionPayload | null }) => {
  const config = payload?.curriculum_metadata?.spaced_repetition_config;
  if (!config) return <Text style={styles.errorText}>No flashback data found.</Text>;

  return (
    <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      <View style={styles.flashbackHeader}>
        <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.flashbackIcon}>
          <Ionicons name="refresh" size={20} color="#FFFFFF" />
        </LinearGradient>
        <View>
          <Text style={styles.flashbackTitle}>Daily Flashback</Text>
          <Text style={styles.flashbackSubtitle}>Micro-recall from previous sessions</Text>
        </View>
      </View>

      <View style={styles.flashbackCard}>
        <Text style={styles.flashbackPrompt}>RECALL CHALLENGE</Text>
        <Text style={styles.flashbackQuestion}>
          Can you remember the core logic of Day N-{config.intervals[0] || 3}?
        </Text>
        <View style={styles.flashbackDivider} />
        <Text style={styles.flashbackTip}>
          Tip: Active recall for 1 minute beats 10 minutes of reading.
        </Text>
      </View>

      <View style={styles.recallIndicatorContainer}>
        {config.intervals.map((interval, i) => (
          <View key={i} style={styles.recallBadge}>
            <Text style={styles.recallBadgeText}>N-{interval}</Text>
          </View>
        ))}
      </View>
    </MotiView>
  );
};

const GOOGLE_LESSON_COLORS = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#7C3AED', '#0EA5E9'];

const splitLessonSentences = (detail?: string) => {
  const text = String(detail || '').replace(/\s+/g, ' ').trim();
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
};

const cleanDisplayCell = (value?: string) => String(value || '').trim().replace(/[.。]+$/u, '');

const splitLessonBodyAndTrap = (detail?: string) => {
  const sentences = splitLessonSentences(detail);
  const trapIndex = sentences.findIndex((sentence) => /trap|not\s+\d|not\s+[a-z]/i.test(sentence));
  if (trapIndex < 0) return { body: sentences, trap: '' };
  return {
    body: sentences.filter((_, idx) => idx !== trapIndex),
    trap: sentences[trapIndex],
  };
};

const extractFactPairs = (detail?: string) => {
  return splitLessonSentences(detail)
    .map((sentence) => {
      const match = sentence.match(/^([^:]{2,60}):\s*(.+)$/);
      if (!match) return null;
      return { label: match[1].trim(), value: match[2].trim() };
    })
    .filter(Boolean) as Array<{ label: string; value: string }>;
};

const buildLessonOverview = (title: string, notes: Array<{ title: string; detail: string }>) => {
  const items = notes.slice(0, 5).map((note) => note.title);
  if (!items.length) {
    return `Today you will study ${title}. Move through each concept page, then use recall cards and exam practice to complete the mission.`;
  }
  return [
    `Today you will study ${title}.`,
    `By the end, you should be able to explain: ${items.join(', ')}.`,
    'Use the next pages like coaching notes: read the concept, remember the trap, then test yourself in the exam practice section.',
  ].join(' ');
};

const buildFallbackLessonPages = (title: string, notes: Array<{ title: string; detail: string }>): any[] => {
  return [
    {
      title,
      type: 'overview',
      intro: buildLessonOverview(title, notes),
      blocks: [
        {
          type: 'fact_grid',
          items: notes.slice(0, 6).map((note) => ({ label: note.title, value: 'Study page' })),
        },
      ],
    },
    ...notes.map((note) => {
      const facts = extractFactPairs(note.detail);
      const trap = splitLessonSentences(note.detail).find((sentence) => /trap|not\s+\d|not\s+[a-z]/i.test(sentence));
      return {
        title: note.title,
        type: 'concept',
        blocks: [
          facts.length >= 3
            ? { type: /date|meeting|adopted|enforced|formed|time/i.test(note.detail) ? 'timeline' : 'fact_grid', items: facts }
            : { type: 'text', text: note.detail },
          ...(trap ? [{ type: 'trap' as const, text: trap }] : []),
        ],
      };
    }),
  ];
};

const buildLessonTableRows = (title: string, detail?: string) => {
  if (!/Constitution Structure/i.test(title)) return [];
  const rows = [
    ['Original Constitution', '22 Parts', '395 Articles', '8 Schedules'],
    ['Current structure', '25 Parts', '448+ Articles', '12 Schedules'],
  ];
  return detail ? rows : [];
};

const getPageBlocks = (page: MissionLessonPage, activeColor: string) => {
  const blocks = page.blocks || [];
  const tableRows = buildLessonTableRows(page.title, page.intro || blocks.map((b) => b.text).join(' '));
  if (tableRows.length > 0) {
    return [
      {
        type: 'table' as const,
        headers: ['Section', 'Parts', 'Articles', 'Schedules'],
        rows: tableRows,
      },
    ];
  }
  return blocks.length ? blocks : [{ type: 'text' as const, text: page.intro || '' }];
};

const getVisualPageIntro = (
  page: MissionLessonPage,
  blocks: NonNullable<MissionLessonPage['blocks']>
) => {
  if (page.intro) return page.intro;
  const firstType = blocks[0]?.type;
  if (/Constitution Structure/i.test(page.title)) {
    return 'The Constitution of India began in 1949 with 22 Parts, 395 Articles and 8 Schedules. Amendments have expanded it, so the present structure is larger than the original text.';
  }
  if (firstType === 'table') return '';
  if (firstType === 'timeline') return '';
  if (firstType === 'fact_grid') return '';
  return '';
};

const LessonBlockRenderer = ({
  block,
  activeColor,
  blockIndex,
}: {
  block: NonNullable<MissionLessonPage['blocks']>[number];
  activeColor: string;
  blockIndex: number;
}) => {
  if (block.type === 'table' && block.rows?.length) {
    const headers = block.headers || [];
    return (
      <View style={styles.lessonTable}>
        {headers.length > 0 && (
          <View style={[styles.lessonTableHeader, { backgroundColor: `${activeColor}12` }]}>
            {headers.map((header) => (
              <Text key={header} style={[styles.lessonTableHeaderText, { color: activeColor }]}>{header}</Text>
            ))}
          </View>
        )}
        {block.rows.map((row, rowIdx) => (
          <View key={`${row.join('-')}-${rowIdx}`} style={styles.lessonTableRow}>
            {row.map((cell, cellIdx) => (
              <Text key={`${cell}-${cellIdx}`} style={[styles.lessonTableCell, cellIdx === 0 && styles.lessonTableFirstCell]}>
                {cleanDisplayCell(cell)}
              </Text>
            ))}
          </View>
        ))}
      </View>
    );
  }

  if ((block.type === 'fact_grid' || block.type === 'checklist') && block.items?.length) {
    return (
      <View style={styles.overviewGrid}>
        {block.items.map((item, idx) => {
          const color = GOOGLE_LESSON_COLORS[(blockIndex + idx) % GOOGLE_LESSON_COLORS.length];
          return (
            <View key={`${item.label}-${idx}`} style={styles.overviewTile}>
              <View style={[styles.overviewTileIcon, { backgroundColor: `${color}16` }]}>
                <Text style={[styles.overviewTileNumber, { color }]}>{idx + 1}</Text>
              </View>
              {!!item.label && <Text style={styles.overviewTileTitle}>{cleanDisplayCell(item.label)}</Text>}
              {!!item.value && item.value !== 'Learning page' && <Text style={styles.overviewTileValue}>{cleanDisplayCell(item.value)}</Text>}
              {!!item.detail && <Text style={styles.overviewTileValue}>{cleanDisplayCell(item.detail)}</Text>}
            </View>
          );
        })}
      </View>
    );
  }

  if (block.type === 'timeline' && block.items?.length) {
    return (
      <View style={styles.timelineBlock}>
        {block.items.map((item, idx) => (
          <View key={`${item.label}-${idx}`} style={styles.timelineRow}>
            <View style={styles.timelineRail}>
              <View style={[styles.timelineDot, { backgroundColor: activeColor }]} />
              {idx < (block.items?.length || 0) - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineCard}>
              {!!item.label && <Text style={styles.timelineLabel}>{cleanDisplayCell(item.label)}</Text>}
              {!!item.value && <Text style={styles.timelineValue}>{cleanDisplayCell(item.value)}</Text>}
              {!!item.detail && <Text style={styles.timelineValue}>{cleanDisplayCell(item.detail)}</Text>}
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (block.type === 'trap') {
    return (
      <View style={[styles.lessonTrapCallout, { borderColor: `${activeColor}33`, backgroundColor: `${activeColor}10` }]}>
        <Ionicons name="alert-circle-outline" size={18} color={activeColor} />
        <Text style={styles.lessonTrapText}>{block.text}</Text>
      </View>
    );
  }

  if (block.type === 'formula') {
    return (
      <View style={[styles.formulaBlock, { borderColor: `${activeColor}35` }]}>
        {!!block.title && <Text style={[styles.formulaTitle, { color: activeColor }]}>{block.title}</Text>}
        <Text style={styles.formulaText}>{block.text}</Text>
      </View>
    );
  }

  const sentences = splitLessonSentences(block.text);
  return (
    <>
      {!!block.title && <Text style={styles.blockTitle}>{block.title}</Text>}
      {sentences.length > 1 ? (
        sentences.map((sentence, idx) => (
          <View key={`${sentence}-${idx}`} style={styles.lessonSentenceRow}>
            <View style={[styles.lessonSentenceDot, { backgroundColor: activeColor }]} />
            <Text style={styles.lessonSentence}>{sentence}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.lessonSentence}>{block.text}</Text>
      )}
    </>
  );
};

const SnapshotContent = ({ payload }: { payload: MissionPayload | null }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const snapshot = payload?.snapshot;
  if (!snapshot) return <Text style={styles.errorText}>No snapshot data found.</Text>;
  const notes = snapshot.quick_notes || [];
  const topicName = cleanMissionTitle(payload?.topic_title || snapshot.title || 'this topic');
  const pages = payload?.lesson_pages && payload.lesson_pages.length > 0
    ? payload.lesson_pages
    : buildFallbackLessonPages(topicName, notes);
  const activeNote = pages[pageIndex] || pages[0];
  const activeColor = GOOGLE_LESSON_COLORS[pageIndex % GOOGLE_LESSON_COLORS.length];
  const activeBlocks = getPageBlocks(activeNote, activeColor);
  const activeIntro = getVisualPageIntro(activeNote, activeBlocks);

  return (
    <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }}>
      {pages.length > 0 && activeNote && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lessonTabs}>
            {pages.map((note, idx) => {
              const color = GOOGLE_LESSON_COLORS[idx % GOOGLE_LESSON_COLORS.length];
              const selected = idx === pageIndex;
              return (
                <TouchableOpacity
                  key={`${note.title}-${idx}`}
                  activeOpacity={1}
                  onPress={() => setPageIndex(idx)}
                  style={[styles.lessonTab, selected && { backgroundColor: `${color}14`, borderColor: `${color}55` }]}
                >
                  <View style={[styles.lessonTabDot, { backgroundColor: color }]} />
                  <Text style={[styles.lessonTabText, selected && { color }]} numberOfLines={1}>
                    {idx + 1}. {idx === 0 ? 'Overview' : note.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.lessonPageCard}>
            <View style={[styles.lessonPageAccent, { backgroundColor: activeColor }]} />
            <View style={styles.lessonPageHeader}>
              <View style={[styles.lessonPageNumber, { backgroundColor: `${activeColor}14` }]}>
                <Text style={[styles.lessonPageNumberText, { color: activeColor }]}>
                  {String(pageIndex + 1).padStart(2, '0')}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.lessonPageTitle}>{activeNote.title}</Text>
              </View>
            </View>

            <View style={styles.lessonBodyBlock}>
              {!!activeIntro && <Text style={styles.lessonIntroText}>{activeIntro}</Text>}
              {activeBlocks.map((block, blockIdx) => (
                <LessonBlockRenderer
                  key={`${activeNote.title}-${blockIdx}`}
                  block={block}
                  activeColor={activeColor}
                  blockIndex={blockIdx}
                />
              ))}
            </View>

            <View style={styles.lessonPager}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setPageIndex((prev) => Math.max(0, prev - 1))}
                disabled={pageIndex === 0}
                style={[styles.lessonPagerButton, pageIndex === 0 && styles.lessonPagerButtonDisabled]}
              >
                <Ionicons name="chevron-back" size={18} color={pageIndex === 0 ? '#CBD5E1' : '#0F172A'} />
                <Text style={[styles.lessonPagerText, pageIndex === 0 && styles.lessonPagerTextDisabled]}>Previous</Text>
              </TouchableOpacity>
              <Text style={styles.lessonPagerCount}>{pageIndex + 1}/{pages.length}</Text>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
                disabled={pageIndex === pages.length - 1}
                style={[styles.lessonPagerButton, pageIndex === pages.length - 1 && styles.lessonPagerButtonDisabled]}
              >
                <Text style={[styles.lessonPagerText, pageIndex === pages.length - 1 && styles.lessonPagerTextDisabled]}>Next</Text>
                <Ionicons name="chevron-forward" size={18} color={pageIndex === pages.length - 1 ? '#CBD5E1' : '#0F172A'} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      
      {/* 🌐 Bilingual Terms */}
      {snapshot.bilingual_terms && snapshot.bilingual_terms.length > 0 && (
        <>
          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>TERMINOLOGY MAP</Text>
          <View style={styles.termGrid}>
            {snapshot.bilingual_terms.map((term, idx) => (
              <View key={idx} style={styles.termBadge}>
                <View style={styles.termDot} />
                <View>
                  <Text style={styles.termEn}>{term.en}</Text>
                  <Text style={styles.termLocal}>{term.local}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {/* ⚠️ Common Mistakes */}
      {snapshot.common_mistakes && snapshot.common_mistakes.length > 0 && (
        <>
          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>EXAM CONSIDERATIONS</Text>
          <View style={styles.trapContainer}>
            <LinearGradient
              colors={['#FFFBEB', '#FFFFFF']}
              style={styles.trapGradient}
            >
              <View style={styles.trapHeader}>
                <Ionicons name="warning" size={20} color="#D97706" />
                <Text style={styles.trapTitle}>Key Traps to Avoid</Text>
              </View>
              {snapshot.common_mistakes.map((mistake, idx) => (
                <View key={idx} style={styles.mistakeRow}>
                  <View style={styles.mistakeBullet} />
                  <Text style={styles.mistakeText}>{mistake}</Text>
                </View>
              ))}
            </LinearGradient>
          </View>
        </>
      )}
    </MotiView>
  );
};

const FlashcardsContent = ({ payload }: { payload: MissionPayload | null }) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const cards = payload?.flashcards || [];

  if (cards.length === 0) return <Text style={styles.errorText}>No flashcards found.</Text>;

  const current = cards[index];
  const accent = GOOGLE_LESSON_COLORS[index % GOOGLE_LESSON_COLORS.length];
  const progress = cards.length ? ((index + 1) / cards.length) * 100 : 0;
  const sourceLabel = String((current as any).source || '').includes('trap')
    ? 'Trap'
    : String((current as any).source || '').includes('timeline')
      ? 'Timeline'
      : String((current as any).source || '').includes('table')
        ? 'Pair'
        : 'Recall';

  return (
    <View style={styles.flashcardTool}>
      <View style={styles.flashDeckHeader}>
        <View>
          <Text style={styles.flashDeckEyebrow}>RECALL DECK</Text>
          <Text style={styles.flashDeckTitle}>{index + 1}/{cards.length}</Text>
        </View>
        <View style={[styles.flashDeckChip, { backgroundColor: `${accent}14`, borderColor: `${accent}44` }]}>
          <Ionicons name="layers-outline" size={14} color={accent} />
          <Text style={[styles.flashDeckChipText, { color: accent }]}>{sourceLabel}</Text>
        </View>
      </View>

      <View style={styles.flashProgressTrack}>
        <View style={[styles.flashProgressFill, { width: `${progress}%`, backgroundColor: accent }]} />
      </View>
      
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={() => setFlipped(!flipped)}
        style={styles.cardTouch}
      >
        <MotiView
          transition={{ type: 'timing', duration: 300 }}
          animate={{ rotateY: flipped ? '180deg' : '0deg', scale: flipped ? 1.01 : 1 }}
          style={styles.flashcard}
        >
          <View style={styles.flashLiquidLayer} pointerEvents="none">
            <MotiView
              from={{ translateX: -28, translateY: -18, opacity: 0.45 }}
              animate={{ translateX: [-28, 18, -12], translateY: [-18, 12, -10], opacity: [0.38, 0.58, 0.42] }}
              transition={{ type: 'timing', duration: 5200, loop: true }}
              style={[styles.flashLiquidOrbLarge, { backgroundColor: accent }]}
            />
            <MotiView
              from={{ translateX: 24, translateY: 26, opacity: 0.35 }}
              animate={{ translateX: [24, -10, 18], translateY: [26, 4, 22], opacity: [0.28, 0.48, 0.32] }}
              transition={{ type: 'timing', duration: 6100, loop: true }}
              style={[styles.flashLiquidOrbSmall, { backgroundColor: GOOGLE_LESSON_COLORS[(index + 2) % GOOGLE_LESSON_COLORS.length] }]}
            />
          </View>

          <View style={[styles.flashcardSide, flipped && { opacity: 0 }]}>
            <Text style={styles.flashSideLabel}>Cue</Text>
            <Text style={styles.flashcardText}>{current.front}</Text>
            <View style={styles.flipPrompt}>
              <Ionicons name="finger-print-outline" size={13} color="#64748B" />
              <Text style={styles.flipPromptText}>Tap to reveal fact</Text>
            </View>
          </View>
          
          <View style={[styles.flashcardSide, styles.flashcardBack, !flipped && { opacity: 0 }, { transform: [{ rotateY: '180deg' }] }]}>
            <Text style={[styles.flashSideLabel, { color: accent }]}>Remember</Text>
            <Text style={styles.flashcardText}>{current.back}</Text>
          </View>
        </MotiView>
      </TouchableOpacity>

      {flipped && (
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} style={styles.flashConfidenceRow}>
          {[
            ['repeat-outline', 'Again'],
            ['checkmark-circle-outline', 'Got it'],
            ['flash-outline', 'Strong'],
          ].map(([icon, label], idx) => (
            <TouchableOpacity
              key={label}
              activeOpacity={1}
              style={[styles.flashConfidenceButton, idx === 1 && { borderColor: `${accent}55`, backgroundColor: `${accent}10` }]}
              onPress={() => {
                if (index < cards.length - 1) {
                  setIndex((prev) => prev + 1);
                  setFlipped(false);
                }
              }}
            >
              <Ionicons name={icon as any} size={16} color={idx === 1 ? accent : '#64748B'} />
              <Text style={[styles.flashConfidenceText, idx === 1 && { color: accent }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </MotiView>
      )}

      <View style={styles.flashcardControls}>
        <TouchableOpacity 
          style={styles.controlBtn} 
          activeOpacity={1} onPress={() => {
            setIndex(prev => Math.max(0, prev - 1));
            setFlipped(false);
          }}
          disabled={index === 0}
        >
          <Ionicons name="chevron-back" size={24} color={index === 0 ? '#CBD5E1' : '#0F172A'} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlBtn} 
          activeOpacity={1} onPress={() => {
            if (index < cards.length - 1) {
              setIndex(prev => prev + 1);
              setFlipped(false);
            }
          }}
          disabled={index === cards.length - 1}
        >
          <Ionicons name="chevron-forward" size={24} color={index === cards.length - 1 ? '#CBD5E1' : '#0F172A'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface VideoItem {
  title: string;
  url: string;
  summary?: string;
  duration_sec?: number;
}

const VideosContent = ({ payload, userId }: { payload: MissionPayload | null; userId?: string }) => {
  const videos = payload?.videos || [];
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [cockpitActiveTab, setCockpitActiveTab] = useState<'notes' | 'ai' | 'checklist'>('notes');
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [notesText, setNotesText] = useState<string>('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const inputRef = useRef<TextInput>(null);
  const [migaChat, setMigaChat] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [migaLoading, setMigaLoading] = useState<boolean>(false);
  const chatScrollRef = useRef<ScrollView>(null);
  const [checklistChecked, setChecklistChecked] = useState<Record<number, boolean>>({});
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (selectedVideo) {
      const videoId = getYouTubeVideoId(selectedVideo.url) || selectedVideo.url;
      const loadNotes = async () => {
        try {
          const saved = await AsyncStorage.getItem(`@miga_notes_${videoId}`);
          setNotesText(saved || '');
          setPlaybackTime(0);
          setCockpitActiveTab('notes');
          setChecklistChecked({});
          setMigaChat([
            {
              role: 'assistant',
              content: `Hi there! I am your AI learning assistant. 📚 I am ready to crack any doubt about "${selectedVideo.title}". What would you like me to explain?`
            }
          ]);
        } catch (e) {
          console.error("AsyncStorage error:", e);
        }
      };
      loadNotes();
    }
  }, [selectedVideo]);

  if (videos.length === 0) return <Text style={styles.errorText}>No recommended videos.</Text>;

  const handleNotesChange = async (text: string) => {
    setNotesText(text);
    if (selectedVideo) {
      const videoId = getYouTubeVideoId(selectedVideo.url) || selectedVideo.url;
      try {
        await AsyncStorage.setItem(`@miga_notes_${videoId}`, text);
      } catch (e) {
        console.error("Notes save failure:", e);
      }
    }
  };

  const seekPlayerTo = (seconds: number) => {
    HapticService.selection();
    webViewRef.current?.injectJavaScript(`window.seekToTime(${seconds}); true;`);
  };

  const tagCurrentFrame = () => {
    HapticService.medium();
    const mm = Math.floor(playbackTime / 60);
    const ss = Math.floor(playbackTime % 60);
    const timestampTag = `[${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}]`;
    const before = notesText.substring(0, selection.start);
    const after = notesText.substring(selection.end);
    const updated = before + timestampTag + after;
    handleNotesChange(updated);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const renderParsedNotes = (text: string) => {
    if (!text.trim()) {
      return (
        <View style={styles.notesPlaceholder}>
          <Ionicons name="create-outline" size={32} color="#94A3B8" />
          <Text style={styles.notesPlaceholderText}>
            No notes taken yet. Use the Tag button to link notes to video timeline frames!
          </Text>
        </View>
      );
    }
    const regex = /(\[(\d{2}):(\d{2})\])/g;
    const parts = text.split(regex);
    const elements = [];
    let i = 0;
    while (i < parts.length) {
      if (parts[i]) {
        elements.push(<Text key={`txt-${i}`} style={styles.parsedNotesText}>{parts[i]}</Text>);
      }
      if (i + 1 < parts.length && parts[i + 1]) {
        const fullMatch = parts[i + 1];
        const mm = parseInt(parts[i + 2], 10);
        const ss = parseInt(parts[i + 3], 10);
        const secs = mm * 60 + ss;
        elements.push(
          <TouchableOpacity key={`badge-${i}`} style={styles.timeBadgePill} activeOpacity={0.7} onPress={() => seekPlayerTo(secs)}>
            <Ionicons name="play" size={10} color="#FFFFFF" />
            <Text style={styles.timeBadgeText}>{fullMatch.replace('[', '').replace(']', '')}</Text>
          </TouchableOpacity>
        );
        i += 4;
      } else {
        i += 1;
      }
    }
    return <View style={styles.notesFlowWrap}>{elements}</View>;
  };

  const askMigaQuestion = async (overrideText?: string) => {
    const question = (overrideText || chatInput).trim();
    if (!question || migaLoading || !selectedVideo) return;
    HapticService.light();
    setChatInput('');
    setMigaLoading(true);
    const userMsg = { role: 'user' as const, content: question };
    const initialAssistantMsg = { role: 'assistant' as const, content: '' };
    const updatedHistory = [...migaChat, userMsg];
    setMigaChat([...updatedHistory, initialAssistantMsg]);
    setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 150);
    const systemPrompt = {
      role: 'system',
      content: `You are an expert AI tutor. Student is studying: "${selectedVideo.title}". Answer concisely in 2-3 sentences.`
    };
    const conversationHistory = [systemPrompt, ...migaChat.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: question }];
    let fullAnswerText = '';
    try {
      await mascotApi.streamChat(
        userId || 'anonymous-reader',
        conversationHistory,
        'study',
        (token) => {
          fullAnswerText += token;
          setMigaChat(prev => {
            const next = [...prev];
            if (next.length > 0) next[next.length - 1] = { role: 'assistant', content: fullAnswerText };
            return next;
          });
          chatScrollRef.current?.scrollToEnd({ animated: false });
        },
        () => { setMigaLoading(false); HapticService.success(); },
        (err) => {
          setMigaChat(prev => [...prev.slice(0, -1), { role: 'assistant', content: "Oops, network delay. Please ask again!" }]);
          setMigaLoading(false);
        }
      );
    } catch (e) {
      setMigaLoading(false);
    }
  };

  const getSyllabusChecklist = (summary?: string) => {
    if (!summary) return ["Learn historical background.", "Memorize key articles.", "Correlate with patterns."];
    return summary.split(/[.!?]\s+/).filter(s => s.length > 6).slice(0, 5);
  };

  return (
    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Text style={styles.sectionLabel}>VIDEO LESSONS</Text>
      {videos.map((vid, idx) => (
        <View key={`${vid.url}-${idx}`} style={styles.videoCardShell}>
          <TouchableOpacity style={styles.videoCard} activeOpacity={0.9} onPress={() => setSelectedVideo(vid)}>
            <LinearGradient colors={['#EA4335', '#C53929']} style={styles.videoPlayIcon}>
              <Ionicons name="play" size={18} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{vid.title}</Text>
              <View style={styles.videoMeta}>
                <Ionicons name="tv-outline" size={14} color="#64748B" />
                <Text style={styles.videoDuration}>{vid.duration_sec ? `${Math.floor(vid.duration_sec / 60)} mins` : 'Watch'}</Text>
              </View>
            </View>
            <View style={styles.cardIndicatorBadge}><Text style={styles.cardIndicatorText}>STUDY</Text></View>
          </TouchableOpacity>
        </View>
      ))}

      <Modal visible={!!selectedVideo} animationType="slide" transparent={false} onRequestClose={() => setSelectedVideo(null)}>
        {selectedVideo && (
          <SafeAreaView style={styles.cockpitContainer} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
            <View style={styles.cockpitHeader}>
              <TouchableOpacity style={styles.cockpitCloseBtn} onPress={() => setSelectedVideo(null)} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={24} color="#F8FAFC" />
                <Text style={styles.cockpitCloseText}>Back</Text>
              </TouchableOpacity>
              <View style={styles.cockpitTitleBlock}>
                <Text style={styles.cockpitHeaderTitle} numberOfLines={1}>{selectedVideo.title}</Text>
                <Text style={styles.cockpitSubTitle}>VIDEO LESSON</Text>
              </View>
              <View style={styles.cockpitHeaderRight}><LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.studyPill}><Text style={styles.studyPillText}>LESSON</Text></LinearGradient></View>
            </View>

            <View style={styles.cockpitPlayerWrap}>
              <WebView
                ref={webViewRef}
                source={{ html: buildYouTubeInteractivePlayerHtml(getYouTubeVideoId(selectedVideo.url), selectedVideo.title), baseUrl: 'https://www.youtube-nocookie.com' }}
                style={styles.cockpitPlayer}
                javaScriptEnabled domStorageEnabled allowsFullscreenVideo allowsInlineMediaPlayback
                onMessage={(e) => { try { const d = JSON.parse(e.nativeEvent.data); if (d.type === 'timeupdate') setPlaybackTime(d.currentTime); } catch (err) {} }}
              />
            </View>

            <View style={styles.cockpitTabWrapper}>
              <View style={styles.cockpitTabBar}>
                {['notes', 'ai', 'checklist'].map((tab) => (
                  <TouchableOpacity key={tab} style={[styles.cockpitTab, cockpitActiveTab === tab && styles.cockpitTabActive]} onPress={() => setCockpitActiveTab(tab as any)}>
                    <Text style={[styles.cockpitTabText, cockpitActiveTab === tab && styles.cockpitTabTextActive]}>{tab === 'notes' ? 'NOTES' : tab === 'ai' ? 'ASK AI' : 'CHECKLIST'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <KeyboardAvoidingView behavior="padding" style={styles.cockpitTabContent}>
              {cockpitActiveTab === 'notes' && (
                <ScrollView contentContainerStyle={styles.notesTabWrap}>
                  <View style={styles.notesEditorCard}>
                    <View style={styles.notesEditorHeader}>
                      <Text style={styles.notesEditorTitle}>STUDY NOTES</Text>
                      <TouchableOpacity style={styles.tagFrameBtn} onPress={tagCurrentFrame}><Text style={styles.tagFrameBtnText}>Add Timestamp</Text></TouchableOpacity>
                    </View>
                    <TextInput ref={inputRef} style={styles.notesTextInput} multiline value={notesText} onChangeText={handleNotesChange} onSelectionChange={(e) => setSelection(e.nativeEvent.selection)} />
                  </View>
                  <View style={styles.notesPreviewCard}><Text style={styles.notesPreviewLabel}>SAVED NOTES</Text>{renderParsedNotes(notesText)}</View>
                </ScrollView>
              )}
              {cockpitActiveTab === 'ai' && (
                <View style={styles.migaTabWrap}>
                  <ScrollView ref={chatScrollRef} contentContainerStyle={styles.migaScrollContent}>
                    {migaChat.map((msg, i) => (
                      <View key={i} style={[styles.migaMsgRow, msg.role === 'user' ? styles.migaMsgRowUser : styles.migaMsgRowMiga]}>
                        <View style={[styles.migaMsgBubble, msg.role === 'user' ? styles.migaMsgBubbleUser : styles.migaMsgBubbleMiga]}><Text style={[styles.migaMsgText, msg.role === 'user' ? styles.migaMsgTextUser : styles.migaMsgTextMiga]}>{msg.content}</Text></View>
                      </View>
                    ))}
                  </ScrollView>
                  <View style={styles.migaInputContainer}>
                    <TextInput style={styles.migaTextInput} value={chatInput} onChangeText={setChatInput} onSubmitEditing={() => askMigaQuestion()} />
                    <TouchableOpacity style={styles.migaSendBtn} onPress={() => askMigaQuestion()}><Ionicons name="arrow-up" size={20} color="#FFFFFF" /></TouchableOpacity>
                  </View>
                </View>
              )}
              {cockpitActiveTab === 'checklist' && (
                <ScrollView contentContainerStyle={styles.checklistTabWrap}>
                  {getSyllabusChecklist(selectedVideo.summary).map((item, idx) => (
                    <TouchableOpacity key={idx} style={[styles.checklistCard, checklistChecked[idx] && styles.checklistCardChecked]} onPress={() => setChecklistChecked(prev => ({ ...prev, [idx]: !prev[idx] }))}>
                      <View style={[styles.customCheckbox, checklistChecked[idx] && styles.customCheckboxChecked]} />
                      <Text style={[styles.checklistText, checklistChecked[idx] && styles.checklistTextChecked]}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </KeyboardAvoidingView>
          </SafeAreaView>
        )}
      </Modal>
    </MotiView>
  );
};

const QuizContent = ({ payload, onComplete }: { payload: MissionPayload | null, onComplete: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(600);
  const questions = payload?.quiz?.questions || [];

  const handleOptionPress = (idx: number) => {
    if (showResult || finished) return;
    setSelectedOption(idx);
    setShowResult(true);
    if (idx === questions[currentIndex].answer_index) setCorrectCount(prev => prev + 1);
    HapticService.medium();
  };

  if (questions.length === 0) return <Text style={styles.errorText}>No questions found.</Text>;
  const currentQ = questions[currentIndex];

  return (
    <View style={styles.quizTool}>
      <Text style={styles.quizQuestion}>{currentQ.question}</Text>
      <View style={styles.optionsList}>
        {currentQ.options.map((option, idx) => (
          <TouchableOpacity key={idx} style={[styles.optionCard, showResult && idx === currentQ.answer_index && styles.optionCorrect]} onPress={() => handleOptionPress(idx)}>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {showResult && <TouchableOpacity style={styles.nextButton} onPress={() => { if (currentIndex < questions.length - 1) { setCurrentIndex(p => p + 1); setShowResult(false); } else { setFinished(true); onComplete(); } }}><Text style={styles.nextButtonText}>Next</Text></TouchableOpacity>}
    </View>
  );
};

const CurrentAffairsQuizContent = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <View style={styles.quizTool}>
      <Text style={styles.sectionLabel}>PRACTICE COMPLETED</Text>
      <TouchableOpacity style={styles.nextButton} onPress={onComplete}><Text style={styles.nextButtonText}>FINISH</Text></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  backButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, color: '#0F172A', fontSize: 18, fontFamily: 'Poppins-Bold', marginLeft: 8 },
  headerRight: { width: 44 },
  scrollContent: { padding: 20, paddingBottom: 120, backgroundColor: '#F8FAFC', minHeight: Dimensions.get('window').height - 100 },
  longDayBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF1F2', paddingVertical: 8, paddingHorizontal: 16, gap: 8 },
  longDayText: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: '#F43F5E' },
  staminaBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF9C3', paddingVertical: 8, paddingHorizontal: 16, gap: 8 },
  staminaText: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: '#854D0E' },
  flashbackHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  flashbackIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  flashbackTitle: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  flashbackSubtitle: { fontSize: 14, fontFamily: 'Inter-Medium', color: '#64748B' },
  flashbackCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 },
  flashbackPrompt: { fontSize: 11, fontFamily: 'Poppins-SemiBold', color: '#8B5CF6', letterSpacing: 1, marginBottom: 12 },
  flashbackQuestion: { fontSize: 18, fontFamily: 'Poppins-SemiBold', color: '#1E293B', lineHeight: 26, marginBottom: 20 },
  flashbackDivider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 },
  flashbackTip: { fontSize: 13, fontFamily: 'Inter-Italic', color: '#64748B' },
  recallIndicatorContainer: { flexDirection: 'row', gap: 8, marginTop: 16 },
  recallBadge: { backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#DDD6FE' },
  recallBadgeText: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: '#7C3AED' },
  confettiLottie: { ...StyleSheet.absoluteFillObject, zIndex: 150, pointerEvents: 'none' },
  lessonTabs: { gap: 8, paddingRight: 20, paddingBottom: 14 },
  lessonTab: { flexDirection: 'row', alignItems: 'center', gap: 8, maxWidth: 220, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 999, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  lessonTabDot: { width: 8, height: 8, borderRadius: 4 },
  lessonTabText: { flexShrink: 1, fontSize: 12, fontFamily: 'Poppins-SemiBold', color: '#475569' },
  lessonPageCard: { position: 'relative', overflow: 'hidden', backgroundColor: '#FFFFFF', borderRadius: 28, padding: 20, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24 },
  lessonPageAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 5 },
  lessonPageHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  lessonPageNumber: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  lessonPageNumberText: { fontSize: 16, fontFamily: 'Poppins-Bold' },
  lessonPageTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', color: '#0F172A', lineHeight: 28, marginTop: 2 },
  lessonBodyBlock: { gap: 14 },
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  overviewTile: { width: '47.5%', minHeight: 92, backgroundColor: '#F8FAFC', borderRadius: 18, padding: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  overviewTileIcon: { width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  overviewTileNumber: { fontSize: 13, fontFamily: 'Poppins-Bold' },
  overviewTileTitle: { fontSize: 13, fontFamily: 'Poppins-Bold', color: '#0F172A', lineHeight: 18 },
  overviewTileValue: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: '#475569', lineHeight: 17, marginTop: 6 },
  lessonIntroText: { fontSize: 16, fontFamily: 'Inter-Medium', color: '#334155', lineHeight: 25, backgroundColor: '#F8FAFC', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  lessonTable: { borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#DCE7F3', backgroundColor: '#FFFFFF', marginBottom: 4 },
  lessonTableHeader: { flexDirection: 'row', backgroundColor: '#EFF6FF', borderBottomWidth: 1, borderBottomColor: '#DCE7F3' },
  lessonTableHeaderText: { flex: 1, paddingHorizontal: 8, paddingVertical: 10, fontSize: 11, fontFamily: 'Poppins-Bold', color: '#1D4ED8', textAlign: 'center' },
  lessonTableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEF2F7' },
  lessonTableCell: { flex: 1, paddingHorizontal: 8, paddingVertical: 12, fontSize: 12, fontFamily: 'Inter-SemiBold', color: '#334155', lineHeight: 17, textAlign: 'center' },
  lessonTableFirstCell: { color: '#0F172A', fontFamily: 'Poppins-Bold', textAlign: 'left' },
  lessonSentenceRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  lessonSentenceDot: { width: 7, height: 7, borderRadius: 4, marginTop: 9 },
  lessonSentence: { flex: 1, fontSize: 16, fontFamily: 'Inter-Medium', color: '#1E293B', lineHeight: 25 },
  blockTitle: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#0F172A', marginTop: 4 },
  timelineBlock: { gap: 0 },
  timelineRow: { flexDirection: 'row', alignItems: 'stretch' },
  timelineRail: { width: 26, alignItems: 'center' },
  timelineDot: { width: 11, height: 11, borderRadius: 6, marginTop: 18 },
  timelineLine: { flex: 1, width: 2, backgroundColor: '#E2E8F0' },
  timelineCard: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 14, marginBottom: 10 },
  timelineLabel: { fontSize: 13, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  timelineValue: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: '#475569', lineHeight: 20, marginTop: 4 },
  formulaBlock: { backgroundColor: '#FFFFFF', borderWidth: 1, borderRadius: 20, padding: 18 },
  formulaTitle: { fontSize: 13, fontFamily: 'Poppins-Bold', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  formulaText: { fontSize: 22, fontFamily: 'Poppins-Bold', color: '#0F172A', lineHeight: 30 },
  lessonTrapCallout: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 18, padding: 14, marginTop: 6, borderWidth: 1 },
  lessonTrapText: { flex: 1, fontSize: 14, fontFamily: 'Poppins-SemiBold', color: '#0F172A', lineHeight: 21 },
  lessonPager: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, gap: 10 },
  lessonPagerButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  lessonPagerButtonDisabled: { opacity: 0.55 },
  lessonPagerText: { fontSize: 13, fontFamily: 'Poppins-SemiBold', color: '#0F172A' },
  lessonPagerTextDisabled: { color: '#CBD5E1' },
  lessonPagerCount: { fontSize: 13, fontFamily: 'Poppins-Bold', color: '#64748B' },
  sectionLabel: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: '#94A3B8', letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase' },
  termGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  termBadge: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', gap: 12 },
  termDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34A853' },
  termEn: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: '#0F172A' },
  termLocal: { fontSize: 12, fontFamily: 'Poppins-Medium', color: '#64748B', marginTop: 2 },
  trapContainer: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(217, 119, 6, 0.2)' },
  trapGradient: { padding: 20 },
  trapHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  trapTitle: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#B45309' },
  mistakeRow: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  mistakeBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D97706', marginTop: 8 },
  mistakeText: { flex: 1, fontSize: 14, fontFamily: 'Inter-Medium', color: '#475569', lineHeight: 20 },
  flashcardTool: { flex: 1 },
  flashDeckHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  flashDeckEyebrow: { fontSize: 11, fontFamily: 'Poppins-Bold', color: '#94A3B8', letterSpacing: 1.2 },
  flashDeckTitle: { fontSize: 24, fontFamily: 'Poppins-Bold', color: '#0F172A', marginTop: 2 },
  flashDeckChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  flashDeckChipText: { fontSize: 12, fontFamily: 'Poppins-Bold' },
  flashProgressTrack: { height: 7, borderRadius: 999, backgroundColor: '#E2E8F0', overflow: 'hidden', marginBottom: 14 },
  flashProgressFill: { height: '100%', borderRadius: 999 },
  cardTouch: { width: '100%', height: 430, marginVertical: 12 },
  flashcard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 30, borderWidth: 1, borderColor: '#DCE7F3', shadowColor: '#000', shadowOffset: { width: 0, height: 18 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 8, overflow: 'hidden' },
  flashLiquidLayer: { ...StyleSheet.absoluteFillObject, opacity: 0.18 },
  flashLiquidOrbLarge: { position: 'absolute', width: 250, height: 250, borderRadius: 125, top: -78, right: -70 },
  flashLiquidOrbSmall: { position: 'absolute', width: 190, height: 190, borderRadius: 95, bottom: -64, left: -54 },
  flashcardSide: { flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center' },
  flashcardBack: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(248, 250, 252, 0.96)' },
  flashSideLabel: { position: 'absolute', top: 26, left: 26, fontSize: 11, fontFamily: 'Poppins-Bold', color: '#64748B', letterSpacing: 1.1, textTransform: 'uppercase' },
  flashcardText: { fontSize: 23, fontFamily: 'Poppins-Bold', color: '#0F172A', textAlign: 'center', lineHeight: 33, maxWidth: '96%' },
  flipPrompt: { position: 'absolute', bottom: 28, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255, 255, 255, 0.76)', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  flipPromptText: { fontSize: 12, fontFamily: 'Inter-SemiBold', color: '#64748B' },
  flashConfidenceRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  flashConfidenceButton: { flex: 1, minHeight: 44, borderRadius: 15, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7 },
  flashConfidenceText: { fontSize: 12, fontFamily: 'Poppins-Bold', color: '#64748B' },
  flashcardControls: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 10 },
  controlBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  videoCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 12, alignItems: 'center', gap: 16 },
  videoCardShell: { backgroundColor: '#FFFFFF', borderRadius: 24, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  videoPlayIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  videoInfo: { flex: 1, gap: 4 },
  videoTitle: { fontSize: 15, fontFamily: 'Poppins-Bold', color: '#0F172A' },
  videoDuration: { fontSize: 11, fontFamily: 'Poppins-SemiBold', color: '#64748B' },
  videoMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  cardIndicatorBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  cardIndicatorText: { fontSize: 10, fontFamily: 'Poppins-Bold', color: '#3B82F6' },
  cockpitContainer: { flex: 1, backgroundColor: '#0B0F19' },
  cockpitHeader: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  cockpitCloseBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cockpitCloseText: { color: '#F8FAFC', fontSize: 14, fontFamily: 'Poppins-SemiBold' },
  cockpitTitleBlock: { flex: 1, alignItems: 'center', marginHorizontal: 12 },
  cockpitHeaderTitle: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Poppins-Bold', textAlign: 'center' },
  cockpitSubTitle: { color: '#60A5FA', fontSize: 9, fontFamily: 'Poppins-Bold', letterSpacing: 1.5, marginTop: 1 },
  cockpitHeaderRight: { width: 70, alignItems: 'flex-end' },
  studyPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  studyPillText: { color: '#FFFFFF', fontSize: 10, fontFamily: 'Poppins-Bold' },
  cockpitPlayerWrap: { width: '100%', aspectRatio: 1.77, backgroundColor: '#000000', position: 'relative' },
  cockpitPlayer: { flex: 1 },
  cockpitTabWrapper: { height: 52, backgroundColor: '#0F172A', justifyContent: 'center', paddingHorizontal: 16 },
  cockpitTabBar: { flexDirection: 'row', backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: 12, padding: 3, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  cockpitTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 9 },
  cockpitTabActive: { backgroundColor: '#3B82F6' },
  cockpitTabText: { color: '#94A3B8', fontSize: 12, fontFamily: 'Poppins-SemiBold' },
  cockpitTabTextActive: { color: '#FFFFFF' },
  cockpitTabContent: { flex: 1, backgroundColor: '#0F172A' },
  notesTabWrap: { padding: 16, gap: 16, paddingBottom: 40 },
  notesEditorCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  notesEditorHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  notesEditorTitle: { color: '#94A3B8', fontSize: 10, fontFamily: 'Poppins-Bold', letterSpacing: 1.5 },
  tagFrameBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#3B82F6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  tagFrameBtnText: { color: '#FFFFFF', fontSize: 10, fontFamily: 'Poppins-Bold' },
  notesTextInput: { minHeight: 110, color: '#F8FAFC', fontSize: 14, fontFamily: 'Inter-Medium', textAlignVertical: 'top', padding: 8, backgroundColor: '#0F172A', borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  notesPreviewCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  notesPreviewLabel: { color: '#94A3B8', fontSize: 10, fontFamily: 'Poppins-Bold', letterSpacing: 1, marginBottom: 12 },
  notesPlaceholder: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24, gap: 8 },
  notesPlaceholderText: { color: '#64748B', fontSize: 12, fontFamily: 'Inter-Medium', textAlign: 'center', paddingHorizontal: 20, lineHeight: 18 },
  notesFlowWrap: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4, lineHeight: 22 },
  parsedNotesText: { color: '#E2E8F0', fontSize: 14, fontFamily: 'Inter-Medium', lineHeight: 22 },
  timeBadgePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#3B82F6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, marginHorizontal: 2, transform: [{ translateY: -1 }] },
  timeBadgeText: { color: '#FFFFFF', fontSize: 11, fontFamily: 'Poppins-Bold' },
  migaTabWrap: { flex: 1 },
  migaScrollContent: { padding: 16, gap: 12, paddingBottom: 24 },
  migaMsgRow: { flexDirection: 'row', gap: 10, maxWidth: '85%' },
  migaMsgRowUser: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  migaMsgRowMiga: { alignSelf: 'flex-start' },
  migaMsgBubble: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, lineHeight: 18 },
  migaMsgBubbleUser: { backgroundColor: '#3B82F6', borderTopRightRadius: 2 },
  migaMsgBubbleMiga: { backgroundColor: '#1E293B', borderTopLeftRadius: 2, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  migaMsgText: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter-Medium' },
  migaMsgTextUser: { color: '#FFFFFF' },
  migaMsgTextMiga: { color: '#E2E8F0' },
  migaInputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#1E293B', backgroundColor: '#0B0F19', gap: 10 },
  migaTextInput: { flex: 1, height: 40, backgroundColor: '#1E293B', borderRadius: 20, color: '#F8FAFC', fontSize: 13, fontFamily: 'Inter-Medium', paddingHorizontal: 16, borderWidth: 1, borderColor: '#334155' },
  migaSendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
  checklistTabWrap: { padding: 16, gap: 12, paddingBottom: 40 },
  checklistCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 14, padding: 14, gap: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  checklistCardChecked: { borderColor: 'rgba(16, 185, 129, 0.3)', opacity: 0.8 },
  customCheckbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#334155' },
  customCheckboxChecked: { backgroundColor: '#10B981', borderColor: '#10B981' },
  checklistText: { flex: 1, color: '#E2E8F0', fontSize: 13, fontFamily: 'Inter-Medium' },
  checklistTextChecked: { color: '#64748B', textDecorationLine: 'line-through' },
  quizTool: { flex: 1 },
  quizQuestion: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#0F172A', marginBottom: 24 },
  optionsList: { gap: 12 },
  optionCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, borderWidth: 1.5, borderColor: '#E2E8F0' },
  optionCorrect: { borderColor: '#059669', backgroundColor: '#F0FDF4' },
  optionText: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#0F172A' },
  nextButton: { backgroundColor: '#4285F4', paddingVertical: 14, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  nextButtonText: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Poppins-Bold' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#F8FAFC',
  },
  completeButton: { width: '100%' },
  gradientButton: { height: 56, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  completeButtonText: { fontSize: 15, fontFamily: 'Poppins-Bold', color: '#FFFFFF', letterSpacing: 0.5 },
  errorText: { color: '#EF4444', textAlign: 'center', marginTop: 40, fontFamily: 'Inter-Medium' },
  completionOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  completionCard: { width: SCREEN_WIDTH * 0.8, backgroundColor: '#FFFFFF', borderRadius: 32, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.2, shadowRadius: 30, elevation: 10 },
  successIconOuter: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4285F4', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', color: '#0F172A', textAlign: 'center' },
  successSubtitle: { fontSize: 14, fontFamily: 'Inter-Medium', color: '#64748B', textAlign: 'center', marginTop: 8 },
});

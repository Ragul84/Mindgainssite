import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  Keyboard,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Easing } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { mascotApi, PaperAnswer } from '@/services/mascotApi';
import { AIUsageService } from '@/services/aiUsageService';
import { ChatSessionService, deriveTitle } from '@/services/chatSessionService';
import { buildExamPatternContext } from '@/services/companion/examPatternOracle';
import { buildPyqContext } from '@/services/companion/pyqContext';
import PaperScanModal from '@/components/ui/PaperScanModal';
import ChatHistoryDrawer from '@/components/ui/ChatHistoryDrawer';

/**
 * MigaChat — Material 3 styled text chat for the MIGA tab.
 * Google design language: M3 colour roles, emphasized motion (bubbles spring
 * in with the M3 emphasized-decelerate curve), tonal surfaces, ripple touch.
 * Optimistic send + token streaming (TTS skipped). Composer mirrors the call
 * dock and rises with the keyboard.
 */

// ── MindGains teal brand + M3 colour roles ─────────────────────────────────
const M3 = {
  primary: '#0F766E',          // deep teal — send button, user bubble
  primaryBright: '#14B8A6',
  onPrimary: '#FFFFFF',
  primaryContainer: '#CCFBF1', // teal container — empty badge
  onPrimaryContainer: '#04332E',
  surface: '#FFFFFF',
  surfaceContainer: '#F1F5F4',
  surfaceContainerHigh: '#E6EEEC',
  onSurface: '#0F172A',
  onSurfaceVariant: '#5B6470',
  outlineVariant: '#DCE5E2',
};
// M3 emphasized-decelerate easing (Google motion)
const EMPHASIZED = Easing.bezier(0.05, 0.7, 0.1, 1);

type ChatRole = 'user' | 'assistant';
type ChatMessage = { id: string; role: ChatRole; content: string; imageUri?: string; imageLabel?: string; createdAt?: string };
type ImageAttachment = { uri: string; base64: string; mimeType: string };
type SheetAction = { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; destructive?: boolean };

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const buildChatPrompt = (languageLabel: string) =>
  [
    'SYSTEM: You are MIGA — a sharp, witty, genuinely warm study buddy for Indian exam aspirants (UPSC, TNPSC, SSC, banking, etc.).',
    'This is TEXT chat (not voice). Be fast, direct, and accurate. Lead with the answer, then a tight reason.',
    'Formatting: short paragraphs; a compact list only when it genuinely helps. Bold key terms/articles/years sparingly. No filler preamble.',
    'For MCQs: state the correct option clearly first (e.g. "Answer: C"), then a one-line why.',
    'For PYQs / previous-year questions: use only verified PYQ context provided in the conversation. Never invent exam year, paper, wording, options, or answer keys.',
    'For exam importance / pattern / high-yield questions: use only verified frequency context provided in the conversation. Never estimate occurrence counts.',
    'If verified PYQ context is unavailable, say that you cannot verify a real PYQ for that request and offer generated practice clearly marked as practice.',
    'If unsure, say so briefly rather than inventing. Keep exam relevance front and centre.',
    `Reply in ${languageLabel}. You may mix natural English terms where students do.`,
  ].join('\n');

type Suggestion = { icon: keyof typeof Ionicons.glyphMap; label: string; prefill?: string; scan?: boolean };
const SUGGESTIONS: Suggestion[] = [
  { icon: 'bulb-outline', label: 'Explain a concept', prefill: 'Explain ' },
  { icon: 'trophy-outline', label: 'Verified PYQ', prefill: 'Show me verified PYQs of ' },
  { icon: 'sparkles-outline', label: 'Quick revision', prefill: 'Quick revision of ' },
  { icon: 'scan-outline', label: 'Scan & solve', scan: true },
];

// Three-dot teal thinking wave.
const DOT_COLORS = ['#0F766E', '#14B8A6', '#5EEAD4'];
function TypingDots() {
  return (
    <View style={styles.typingRow}>
      {DOT_COLORS.map((c, i) => (
        <MotiView
          key={i}
          from={{ translateY: 0, opacity: 0.4, scale: 0.8 }}
          animate={{ translateY: -5, opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 460, easing: EMPHASIZED, loop: true, repeatReverse: true, delay: i * 130 }}
          style={[styles.typingDot, { backgroundColor: c }]}
        />
      ))}
    </View>
  );
}

// Inline **bold** and *italic* parsing.
function parseInline(text: string, kp: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g).map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return (
        <Text key={`${kp}-${i}`} style={styles.mdBold}>
          {p.slice(2, -2)}
        </Text>
      );
    }
    if (/^\*[^*\n]+\*$/.test(p)) {
      return (
        <Text key={`${kp}-${i}`} style={styles.mdItalic}>
          {p.slice(1, -1)}
        </Text>
      );
    }
    return p;
  });
}

// Lightweight Markdown for assistant bubbles: headings, bullets, numbered
// lists, bold, blank-line spacing. (The model replies in Markdown.)
function RichMessage({ text }: { text: string }) {
  // Strip the "AI-wrapper" em-dash / double-hyphen tell → natural commas.
  // (En-dash ranges like "Art. 36–51" are left intact.)
  let cleaned = text
    .replace(/\r/g, '')
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s+--\s+/g, ', ');
  // While streaming, an opening ** may not have its closing ** yet — hide the
  // dangling marker so the user never sees raw "**" before it turns bold.
  if (((cleaned.match(/\*\*/g) || []).length) % 2 === 1) {
    const i = cleaned.lastIndexOf('**');
    cleaned = cleaned.slice(0, i) + cleaned.slice(i + 2);
  }
  const lines = cleaned.split('\n');
  return (
    <View>
      {lines.map((line, i) => {
        if (!line.trim()) return <View key={i} style={{ height: 8 }} />;
        const heading = line.match(/^#{1,6}\s+(.*)/);
        const bullet = line.match(/^\s*[-*•]\s+(.*)/);
        const numbered = line.match(/^\s*(\d+)[.)]\s+(.*)/);
        if (heading) {
          return <Text key={i} style={styles.mdHeading}>{parseInline(heading[1], `h${i}`)}</Text>;
        }
        if (bullet) {
          return (
            <View key={i} style={styles.mdBulletRow}>
              <Text style={styles.mdBulletDot}>•</Text>
              <Text style={styles.mdBulletText}>{parseInline(bullet[1], `b${i}`)}</Text>
            </View>
          );
        }
        if (numbered) {
          return (
            <View key={i} style={styles.mdBulletRow}>
              <Text style={styles.mdNum}>{numbered[1]}.</Text>
              <Text style={styles.mdBulletText}>{parseInline(numbered[2], `n${i}`)}</Text>
            </View>
          );
        }
        return <Text key={i} style={styles.textAssistant}>{parseInline(line, `p${i}`)}</Text>;
      })}
    </View>
  );
}

// Remembers the open chat across tab switches (component unmounts on tab change).
let lastSessionId: string | null = null;

export function MigaChat({
  userId,
  languageCode = 'en-IN',
  languageLabel = 'English',
  bottomInset = 0,
  onSwitchToCall,
}: {
  userId: string;
  languageCode?: string;
  languageLabel?: string;
  bottomInset?: number;
  onSwitchToCall?: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<ImageAttachment | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sheet, setSheet] = useState<{ title?: string; actions: SheetAction[] } | null>(null);
  const [copied, setCopied] = useState(false);
  const [kbLift, setKbLift] = useState(0);
  const [usagePct, setUsagePct] = useState<number | null>(null);
  const [usageResetsAt, setUsageResetsAt] = useState<string | undefined>(undefined);
  const scrollRef = useRef<ScrollView>(null);
  const nearBottomRef = useRef(true);
  // Smooth-reveal buffer (ChatGPT-style): tokens land in targetRef; a timer
  // advances shownRef toward it at an even cadence so text never dumps at once.
  const targetRef = useRef('');
  const shownRef = useRef(0);
  const doneRef = useRef(false);
  const revealRef = useRef<any>(null);
  const abortRef = useRef(false); // set by Stop to halt token appends

  // ── Session (cloud history) ──────────────────────────────────────────────
  const sessionIdRef = useRef<string | null>(null);
  const pendingBottomRef = useRef(false);
  const setSession = useCallback((id: string | null) => { sessionIdRef.current = id; lastSessionId = id; }, []);
  const ensureSession = useCallback(async (firstText: string): Promise<string | null> => {
    if (sessionIdRef.current) return sessionIdRef.current;
    const s = await ChatSessionService.create(deriveTitle(firstText));
    if (s) setSession(s.id);
    return s?.id ?? null;
  }, [setSession]);
  const tagCreatedAt = useCallback((localId: string, createdAt?: string) => {
    if (!createdAt) return;
    setMessages((prev) => prev.map((m) => (m.id === localId ? { ...m, createdAt } : m)));
  }, []);
  const persistMsg = useCallback(async (sid: string | null, localId: string, role: ChatRole, content: string) => {
    if (!sid) return;
    const row = await ChatSessionService.addMessage(sid, role, content);
    if (row) tagCreatedAt(localId, row.created_at);
  }, [tagCreatedAt]);

  const newChat = useCallback(() => {
    abortRef.current = true;
    doneRef.current = true;
    if (revealRef.current) { clearInterval(revealRef.current); revealRef.current = null; }
    setStreaming(false);
    setMessages([]);
    setSession(null);
    setInput('');
    setAttachment(null);
  }, [setSession]);

  const openSession = useCallback(async (id: string) => {
    setDrawerOpen(false);
    const rows = await ChatSessionService.loadMessages(id);
    if (!rows.length) return;
    setSession(id);
    setMessages(rows.map((r) => ({ id: r.id, role: r.role, content: r.content, createdAt: r.created_at })));
    nearBottomRef.current = true;
    pendingBottomRef.current = true; // jump to last message once content lays out
  }, [setSession]);

  // Restore the previously open chat when returning to the tab.
  useEffect(() => {
    if (lastSessionId) void openSession(lastSessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let alive = true;
    AIUsageService.getUsage('miga_message')
      .then((usage) => {
        if (!alive) return;
        const pct = usage.limit > 0 ? Math.max(0, Math.min(1, usage.remaining / usage.limit)) : 0;
        setUsagePct(pct);
        setUsageResetsAt(usage.resetsAt);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const onShow = Keyboard.addListener(showEvt, (e: any) =>
      setKbLift(Math.max(0, (e?.endCoordinates?.height || 0) - bottomInset)),
    );
    const onHide = Keyboard.addListener(hideEvt, () => setKbLift(0));
    return () => { onShow.remove(); onHide.remove(); };
  }, [bottomInset]);

  // Only auto-scroll when the user is already at the bottom — lets them scroll
  // up to read without being yanked back down while tokens stream.
  const scrollToEnd = useCallback((force = false) => {
    if (!force && !nearBottomRef.current) return;
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: force }));
  }, []);

  const onScroll = useCallback((e: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    nearBottomRef.current = contentSize.height - (contentOffset.y + layoutMeasurement.height) < 90;
  }, []);

  const stopReveal = useCallback(() => {
    if (revealRef.current) { clearInterval(revealRef.current); revealRef.current = null; }
  }, []);

  const openSheet = useCallback((actions: SheetAction[], title?: string) => {
    Haptics.selectionAsync().catch(() => {});
    setSheet({ actions, title });
  }, []);
  const closeSheet = useCallback(() => setSheet(null), []);

  const doCopy = useCallback((text: string) => {
    Clipboard.setStringAsync(text).catch(() => {});
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }, []);

  const pickAttachment = useCallback(async (source: 'camera' | 'gallery') => {
    try {
      if (source === 'camera') {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Camera needed', 'Allow camera access to attach a photo.');
          return;
        }
      } else {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Photos needed', 'Allow photo library access to attach an image.');
          return;
        }
      }

      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            quality: 0.8,
            base64: true,
            allowsEditing: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            base64: true,
            allowsEditing: true,
          });

      if (result.canceled || !result.assets?.[0]?.base64) return;
      const asset = result.assets[0];
      setAttachment({
        uri: asset.uri,
        base64: asset.base64 as string,
        mimeType: asset.mimeType || 'image/jpeg',
      });
    } catch (err) {
      console.warn('[MigaChat] attachment pick failed', err);
      Alert.alert('Image failed', 'Could not attach the image. Please try again.');
    }
  }, []);

  const pickDocument = useCallback(async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: ['image/*'], copyToCacheDirectory: true });
      if (res.canceled || !res.assets?.[0]) return;
      const a = res.assets[0];
      const base64 = await FileSystem.readAsStringAsync(a.uri, { encoding: 'base64' as any });
      setAttachment({ uri: a.uri, base64, mimeType: a.mimeType || 'image/jpeg' });
    } catch (err) {
      console.warn('[MigaChat] document pick failed', err);
      Alert.alert('File failed', 'Could not attach that file. Please try an image.');
    }
  }, []);

  // "+" menu — Apple-style options sheet.
  const openAttachMenu = useCallback(() => {
    openSheet(
      [
        { icon: 'scan-outline', label: 'Scan & solve', onPress: () => setScanOpen(true) },
        { icon: 'camera-outline', label: 'Camera', onPress: () => { void pickAttachment('camera'); } },
        { icon: 'images-outline', label: 'Photos', onPress: () => { void pickAttachment('gallery'); } },
        { icon: 'document-outline', label: 'Files', onPress: () => { void pickDocument(); } },
      ],
      'Add to chat',
    );
  }, [openSheet, pickAttachment, pickDocument]);

  // Reveal loop: ~60fps; reveals a few chars per tick, eased so it catches up
  // quickly when far behind and slows as it nears the buffer end.
  const startReveal = useCallback((id: string) => {
    targetRef.current = '';
    shownRef.current = 0;
    doneRef.current = false;
    stopReveal();
    revealRef.current = setInterval(() => {
      const target = targetRef.current;
      if (shownRef.current < target.length) {
        const remaining = target.length - shownRef.current;
        const step = Math.max(1, Math.min(8, Math.ceil(remaining * 0.14)));
        shownRef.current += step;
        const shownText = target.slice(0, shownRef.current);
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: shownText } : m)));
        // No autoscroll while words stream — let the user read freely.
      } else if (doneRef.current) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: targetRef.current } : m)));
        stopReveal();
        setStreaming(false);
      }
    }, 16);
  }, [stopReveal]);

  useEffect(() => () => stopReveal(), [stopReveal]);

  // Smart title from the first exchange (ChatGPT-style) — replaces the
  // first-message fallback once we know what the chat is actually about.
  const generateTitle = useCallback(async (sid: string, userText: string, assistantText: string) => {
    try {
      let title = '';
      await new Promise<void>((resolve) => {
        mascotApi.streamChat(
          userId || 'guest',
          [
            {
              role: 'user',
              content:
                'Give a short, specific chat title in Title Case, 3 to 6 words, no quotes, no trailing punctuation. Output ONLY the title.\n\n' +
                `User asked: ${userText}\nAssistant replied: ${assistantText.slice(0, 400)}`,
            },
          ],
          'chat',
          (t) => { title += t; },
          () => resolve(),
          () => resolve(),
          { languageCode, languageLabel },
        );
      });
      title = title.replace(/[\r\n]+/g, ' ').replace(/^["'\s]+|["'\s.]+$/g, '').trim().slice(0, 60);
      if (title) ChatSessionService.rename(sid, title);
    } catch { /* keep fallback title */ }
  }, [userId, languageCode, languageLabel]);

  const runSend = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if ((!clean && !attachment) || streaming) return;

      const isFirstTurn = messages.length === 0;
      const assistantId = newId();
      const userLocalId = newId();
      const userContent = clean || 'Image shared';
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      setMessages((prev) => [
        ...prev,
        {
          id: userLocalId,
          role: 'user',
          content: userContent,
          imageUri: attachment?.uri,
          imageLabel: attachment ? 'Image attachment' : undefined,
        },
        { id: assistantId, role: 'assistant', content: '' },
      ]);
      setInput('');
      setStreaming(true);
      abortRef.current = false;
      nearBottomRef.current = true;
      scrollToEnd(true);
      startReveal(assistantId); // begin the smooth typewriter for this reply

      // Cloud history: create session on first turn + save the user message.
      const sid = await ensureSession(userContent);
      void persistMsg(sid, userLocalId, 'user', userContent);

      try {
        const usage = await AIUsageService.check('miga_message');
        if (!usage.allowed) {
          targetRef.current = `You've reached today's free MIGA limit (${usage.limit}). It resets soon, upgrade for more.`;
          doneRef.current = true;
          return;
        }
      } catch { /* fail-open */ }

      try {
        const [pyqContext, patternContext] = clean
          ? await Promise.all([
              buildPyqContext(clean),
              buildExamPatternContext(clean, userId || 'guest'),
            ])
          : ['', ''];
        await new Promise<void>((resolve, reject) => {
          mascotApi.streamChat(
            userId || 'guest',
            [
              { role: 'system', content: buildChatPrompt(languageLabel) },
              ...(pyqContext ? [{ role: 'system' as const, content: pyqContext }] : []),
              ...(patternContext ? [{ role: 'system' as const, content: patternContext }] : []),
              ...history,
              { role: 'user', content: clean || 'Please analyze the attached image.' },
            ],
            'chat',
          (token) => { if (!abortRef.current) targetRef.current += token; }, // tokens → buffer; reveal loop displays them
          () => resolve(),
          (err) => reject(err),
          {
            languageCode,
            languageLabel,
            attachments: attachment
              ? [{ dataUrl: `data:${attachment.mimeType};base64,${attachment.base64}`, mimeType: attachment.mimeType }]
              : undefined,
          },
        );
      });
      if (!targetRef.current.trim()) targetRef.current = 'Hmm, I blanked on that, try asking again?';
      doneRef.current = true;
      AIUsageService.consume('miga_message').catch(() => {});
      void persistMsg(sid, assistantId, 'assistant', targetRef.current);
      if (isFirstTurn && sid) void generateTitle(sid, userContent, targetRef.current);
      setAttachment(null);
    } catch {
      if (!targetRef.current) targetRef.current = 'Connection hiccup, tap send to try again.';
      doneRef.current = true;
    }
  },
    [streaming, messages, userId, languageCode, languageLabel, scrollToEnd, startReveal, attachment, ensureSession, persistMsg, generateTitle],
  );

  const handleScanResults = useCallback(async (answers: PaperAnswer[], note?: string) => {
    if (!answers.length) return;
    const lines = answers.map((a) => {
      const head = a.answer
        ? `Q${a.q}: ${a.answer}${a.answerText ? ` — ${a.answerText}` : ''}`
        : `Q${a.q}: ${a.answerText || '—'}`;
      return a.reason ? `${head}\n   ${a.reason}` : head;
    });
    const body = `📄 Scanned ${answers.length} question${answers.length > 1 ? 's' : ''}:\n\n${lines.join('\n\n')}${note ? `\n\n${note}` : ''}`;
    const uId = newId();
    const aId = newId();
    setMessages((prev) => [
      ...prev,
      { id: uId, role: 'user', content: 'Scanned a question paper 📄' },
      { id: aId, role: 'assistant', content: body },
    ]);
    nearBottomRef.current = true;
    scrollToEnd(true);
    const sid = await ensureSession('Scanned question paper');
    void persistMsg(sid, uId, 'user', 'Scanned a question paper 📄');
    void persistMsg(sid, aId, 'assistant', body);
  }, [scrollToEnd, ensureSession, persistMsg]);

  // Stop the current generation (keeps what's already revealed).
  const stop = useCallback(() => {
    abortRef.current = true;
    doneRef.current = true;
  }, []);

  // Re-run the model on the conversation up to (and including) the user turn
  // before `assistantIndex`, replacing that assistant reply.
  const regenerate = useCallback(async (assistantIndex: number) => {
    if (streaming) return;
    const sid = sessionIdRef.current;
    const cut = messages[assistantIndex];
    if (sid && cut?.createdAt) ChatSessionService.deleteFrom(sid, cut.createdAt).catch(() => {});
    const kept = messages.slice(0, assistantIndex);
    const history = kept.map((m) => ({ role: m.role, content: m.content }));
    const lastUserText = [...kept].reverse().find((m) => m.role === 'user')?.content || '';
    const assistantId = newId();
    setMessages([...kept, { id: assistantId, role: 'assistant', content: '' }]);
    setStreaming(true);
    abortRef.current = false;
    nearBottomRef.current = true;
    scrollToEnd(true);
    startReveal(assistantId);
    try {
      const [pyqContext, patternContext] = lastUserText
        ? await Promise.all([
            buildPyqContext(lastUserText),
            buildExamPatternContext(lastUserText, userId || 'guest'),
          ])
        : ['', ''];
      await new Promise<void>((resolve, reject) => {
        mascotApi.streamChat(
          userId || 'guest',
          [
            { role: 'system', content: buildChatPrompt(languageLabel) },
            ...(pyqContext ? [{ role: 'system' as const, content: pyqContext }] : []),
            ...(patternContext ? [{ role: 'system' as const, content: patternContext }] : []),
            ...history,
          ],
          'chat',
          (token) => { if (!abortRef.current) targetRef.current += token; },
          () => resolve(),
          (err) => reject(err),
          { languageCode, languageLabel },
        );
      });
      if (!targetRef.current.trim()) targetRef.current = 'Hmm, I blanked on that, try asking again?';
      doneRef.current = true;
      void persistMsg(sid, assistantId, 'assistant', targetRef.current);
    } catch {
      if (!targetRef.current) targetRef.current = 'Connection hiccup, tap send to try again.';
      doneRef.current = true;
    }
  }, [streaming, messages, userId, languageCode, languageLabel, scrollToEnd, startReveal, persistMsg]);

  // Put a user message back in the box to edit and resend; drops it + everything after.
  const editResend = useCallback((userIndex: number) => {
    if (streaming) return;
    const sid = sessionIdRef.current;
    const u = messages[userIndex];
    if (!u) return;
    if (sid && u.createdAt) ChatSessionService.deleteFrom(sid, u.createdAt).catch(() => {});
    setMessages(messages.slice(0, userIndex));
    setInput(u.content);
  }, [streaming, messages]);

  const messageActions = useCallback((m: ChatMessage, index: number) => {
    if (m.role === 'assistant') {
      openSheet([
        { icon: 'copy-outline', label: 'Copy', onPress: () => doCopy(m.content) },
        { icon: 'refresh-outline', label: 'Regenerate', onPress: () => regenerate(index) },
      ]);
    } else {
      openSheet([
        { icon: 'copy-outline', label: 'Copy', onPress: () => doCopy(m.content) },
        { icon: 'create-outline', label: 'Edit & resend', onPress: () => editResend(index) },
      ]);
    }
  }, [regenerate, editResend, openSheet, doCopy]);

  const showEmpty = messages.length === 0;
  const composerBottom = Math.max(bottomInset + 54, 68);
  const canSend = (!!input.trim() || !!attachment) && !streaming;

  return (
    <View style={styles.flex}>
      {/* Header: history (left) · MIGA ⚡ (center) · new chat (right) */}
      <View style={styles.header}>
        <Pressable
          onPress={() => setDrawerOpen(true)}
          android_ripple={{ color: 'rgba(15,118,110,0.15)', borderless: true, radius: 22 }}
          style={({ pressed }) => [styles.headerBtn, pressed && styles.iconBtnPressed]}
          accessibilityLabel="Chat history"
        >
          <Ionicons name="menu" size={24} color={M3.onSurface} />
        </Pressable>
        <View style={styles.headerTitleWrap} pointerEvents="none">
          <Text style={styles.headerTitle}>MIGA</Text>
          <View style={styles.headerSpark}>
            <Ionicons name="flash" size={11} color="#FFFFFF" />
          </View>
        </View>
        <View style={styles.headerRight}>
          {onSwitchToCall && (
            <Pressable
              onPress={onSwitchToCall}
              android_ripple={{ color: 'rgba(15,118,110,0.15)', borderless: true, radius: 22 }}
              style={({ pressed }) => [styles.headerBtn, pressed && styles.iconBtnPressed]}
              accessibilityLabel="Switch to voice call"
            >
              <Ionicons name="call-outline" size={20} color={M3.onSurface} />
            </Pressable>
          )}
          <Pressable
            onPress={newChat}
            android_ripple={{ color: 'rgba(15,118,110,0.15)', borderless: true, radius: 22 }}
            style={({ pressed }) => [styles.headerBtn, pressed && styles.iconBtnPressed]}
            accessibilityLabel="New chat"
          >
            <Ionicons name="create-outline" size={22} color={M3.onSurface} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: composerBottom + 64 },
          showEmpty && styles.scrollContentEmpty,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onContentSizeChange={() => {
          if (pendingBottomRef.current) {
            pendingBottomRef.current = false;
            scrollRef.current?.scrollToEnd({ animated: false });
          }
        }}
      >
        {showEmpty ? (
          <MotiView
            from={{ opacity: 0, translateY: 14 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 420, easing: EMPHASIZED }}
            style={styles.empty}
          >
            <Image
              source={require('@/assets/images/learnmascot.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>
              What would you{'\n'}like to <Text style={styles.emptyTitleAccent}>learn today</Text>?
            </Text>
            <View style={styles.suggGrid}>
              {SUGGESTIONS.map((sg) => (
                <Pressable
                  key={sg.label}
                  onPress={() => (sg.scan ? setScanOpen(true) : setInput(sg.prefill || ''))}
                  android_ripple={{ color: 'rgba(15,118,110,0.12)' }}
                  style={({ pressed }) => [styles.suggChip, pressed && styles.suggChipPressed]}
                >
                  <Ionicons name={sg.icon} size={17} color={M3.primary} />
                  <Text style={styles.suggText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
                    {sg.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </MotiView>
        ) : (
          messages.map((m, index) => (
            <MotiView
              key={m.id}
              from={{ opacity: 0, translateY: 12, scale: 0.97 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: 'timing', duration: 340, easing: EMPHASIZED }}
              style={[styles.msgWrap, m.role === 'user' ? styles.msgWrapUser : styles.msgWrapAssistant]}
            >
              <Pressable
                onLongPress={() => m.content && messageActions(m, index)}
                style={[styles.bubble, m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant]}
              >
                {m.imageUri ? (
                  <View style={styles.imageBubble}>
                    <Image source={{ uri: m.imageUri }} style={styles.attachedImage} resizeMode="cover" />
                    {!!m.imageLabel && <Text style={styles.imageLabel}>{m.imageLabel}</Text>}
                  </View>
                ) : null}
                {m.role === 'assistant' && !m.content ? (
                  <TypingDots />
                ) : m.role === 'user' ? (
                  <Text style={styles.textUser}>{m.content}</Text>
                ) : (
                  <RichMessage text={m.content} />
                )}
              </Pressable>
              {m.role === 'assistant' && !!m.content && (
                <Pressable onPress={() => doCopy(m.content)} hitSlop={8} style={styles.msgCopyBtn}>
                  <Ionicons name="copy-outline" size={14} color={M3.onSurfaceVariant} />
                  <Text style={styles.msgCopyLabel}>Copy</Text>
                </Pressable>
              )}
            </MotiView>
          ))
        )}
      </ScrollView>

      {/* Bottom fade — messages dissolve as they scroll behind the input */}
      <LinearGradient
        colors={['rgba(253,252,255,0)', 'rgba(253,252,255,0.85)', '#FDFCFF']}
        locations={[0, 0.55, 1]}
        style={[styles.bottomFade, { height: composerBottom + 96 }]}
        pointerEvents="none"
      />

      {/* Floating composer — M3 surface, rises with the keyboard */}
      <MotiView
        animate={{ translateY: -kbLift }}
        transition={{ type: 'timing', duration: 240, easing: EMPHASIZED }}
        style={[styles.dock, { bottom: composerBottom }]}
      >
        <View style={styles.inputBar}>
          <Pressable
            onPress={openAttachMenu}
            android_ripple={{ color: 'rgba(11,87,208,0.18)', borderless: true, radius: 22 }}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
            accessibilityLabel="Add to chat"
          >
            <Ionicons name="add" size={24} color={M3.onSurfaceVariant} />
          </Pressable>

          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask MIGA anything…"
            placeholderTextColor="#8A8E96"
            editable={!streaming}
            returnKeyType="send"
            onSubmitEditing={() => runSend(input)}
          />

          <View style={styles.rightActions}>
            <Pressable
              onPress={() => (streaming ? stop() : runSend(input))}
              disabled={!streaming && !canSend}
              android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: false, radius: 24 }}
              style={({ pressed }) => [
                styles.sendBtn,
                !streaming && !canSend && styles.sendBtnDisabled,
                pressed && styles.sendBtnPressed,
              ]}
              accessibilityLabel={streaming ? 'Stop generating' : 'Send message'}
            >
              <LinearGradient
                colors={['#15B8A8', '#0F766E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Ionicons name={streaming ? 'stop' : 'arrow-up'} size={21} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </MotiView>

      <PaperScanModal
        visible={scanOpen}
        onClose={() => setScanOpen(false)}
        languageCode={languageCode}
        onResults={handleScanResults}
      />

      {attachment && (
        <View style={styles.attachmentRail}>
          <View style={styles.attachmentCard}>
            <Image source={{ uri: attachment.uri }} style={styles.attachmentThumb} resizeMode="cover" />
            <View style={styles.attachmentMeta}>
              <Text style={styles.attachmentTitle} numberOfLines={1}>Image attached</Text>
              <Text style={styles.attachmentSubtitle} numberOfLines={1}>Will be sent with your next message</Text>
            </View>
            <Pressable onPress={() => setAttachment(null)} style={styles.attachmentRemove}>
              <Ionicons name="close" size={16} color={M3.onSurfaceVariant} />
            </Pressable>
          </View>
        </View>
      )}

      <ChatHistoryDrawer
        visible={drawerOpen}
        currentSessionId={sessionIdRef.current}
        onClose={() => setDrawerOpen(false)}
        onSelect={openSession}
        onNewChat={newChat}
        onDeletedCurrent={newChat}
        progressPct={usagePct ?? undefined}
        progressResetsAt={usageResetsAt}
      />

      {/* Apple-style options / actions sheet (for "+" and message actions) */}
      <Modal visible={!!sheet} transparent animationType="fade" onRequestClose={closeSheet}>
        <Pressable style={styles.sheetScrim} onPress={closeSheet} />
        <View style={styles.sheetWrap} pointerEvents="box-none">
          <MotiView
            from={{ translateY: 360 }}
            animate={{ translateY: 0 }}
            transition={{ type: 'timing', duration: 280, easing: EMPHASIZED }}
            style={styles.sheet}
          >
            <View style={styles.sheetHandle} />
            {!!sheet?.title && <Text style={styles.sheetTitle}>{sheet.title}</Text>}
            {sheet?.actions.map((a) => (
              <Pressable
                key={a.label}
                onPress={() => { const fn = a.onPress; closeSheet(); setTimeout(fn, 130); }}
                android_ripple={{ color: 'rgba(15,118,110,0.10)' }}
                style={({ pressed }) => [styles.sheetRow, pressed && styles.sheetRowPressed]}
              >
                <View style={[styles.sheetIcon, a.destructive && { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name={a.icon} size={20} color={a.destructive ? '#DC2626' : M3.primary} />
                </View>
                <Text style={[styles.sheetLabel, a.destructive && { color: '#DC2626' }]}>{a.label}</Text>
              </Pressable>
            ))}
            <Pressable onPress={closeSheet} style={styles.sheetCancel} android_ripple={{ color: 'rgba(0,0,0,0.06)' }}>
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </Pressable>
          </MotiView>
        </View>
      </Modal>

      {/* "Copied" toast */}
      <AnimatePresence>
        {copied && (
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'timing', duration: 200 }}
            style={[styles.copiedToastWrap, { bottom: composerBottom + 70 }]}
            pointerEvents="none"
          >
            <View style={styles.copiedToast}>
              <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
              <Text style={styles.copiedToastText}>Copied</Text>
            </View>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 4, paddingBottom: 6 },
  headerBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerTitleWrap: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Poppins-Bold', fontSize: 20, color: M3.onSurface, letterSpacing: -0.4 },
  headerSpark: { width: 18, height: 18, borderRadius: 6, backgroundColor: M3.primary, alignItems: 'center', justifyContent: 'center', marginLeft: 3, marginTop: -4, transform: [{ rotate: '18deg' }] },
  scrollContent: { padding: 16 },
  scrollContentEmpty: { flexGrow: 1, justifyContent: 'center' },

  empty: { alignItems: 'center', paddingHorizontal: 22 },
  logo: { width: 132, height: 132, marginBottom: 18 },
  emptyTitle: { fontFamily: 'Poppins-Bold', fontSize: 28, lineHeight: 36, color: M3.onSurface, letterSpacing: -0.6, textAlign: 'center' },
  emptyTitleAccent: { color: M3.primary },
  suggGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 30 },
  suggChip: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: M3.surface, borderWidth: 1, borderColor: M3.outlineVariant, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 15 },
  suggChipPressed: { backgroundColor: M3.surfaceContainer },
  suggText: { flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 13, color: M3.onSurface },

  msgWrap: { marginBottom: 12 },
  msgWrapUser: { alignItems: 'flex-end' },
  msgWrapAssistant: { alignItems: 'flex-start' },
  msgCopyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 5, paddingHorizontal: 6, marginTop: 3, marginLeft: 4 },
  msgCopyLabel: { fontFamily: 'Inter-Medium', fontSize: 11.5, color: M3.onSurfaceVariant },
  bubble: { maxWidth: '88%', paddingVertical: 12, paddingHorizontal: 16 },
  // M3 asymmetric bubble radii
  bubbleUser: { backgroundColor: M3.primary, borderRadius: 20, borderBottomRightRadius: 6 },
  bubbleAssistant: { backgroundColor: M3.surfaceContainer, borderRadius: 20, borderBottomLeftRadius: 6 },
  textUser: { fontFamily: 'Inter-Medium', fontSize: 15, color: M3.onPrimary, lineHeight: 22, letterSpacing: 0.1 },
  textAssistant: { fontFamily: 'Inter-Regular', fontSize: 15, color: M3.onSurface, lineHeight: 23, letterSpacing: 0.1 },
  mdBold: { fontFamily: 'Inter-Bold', color: M3.onSurface },
  mdItalic: { fontStyle: 'italic', color: M3.onSurface },
  mdHeading: { fontFamily: 'Poppins-Bold', fontSize: 15.5, color: M3.onSurface, lineHeight: 23, marginBottom: 2 },
  mdBulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginVertical: 1 },
  mdBulletDot: { fontFamily: 'Inter-Bold', fontSize: 15, color: M3.primary, lineHeight: 23 },
  mdNum: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: M3.primary, lineHeight: 23, minWidth: 16 },
  mdBulletText: { flex: 1, fontFamily: 'Inter-Regular', fontSize: 15, color: M3.onSurface, lineHeight: 23 },
  imageBubble: { gap: 8, marginBottom: 8 },
  attachedImage: { width: 220, height: 148, borderRadius: 14, backgroundColor: '#E5E7EB' },
  imageLabel: { fontFamily: 'Inter-Medium', fontSize: 12, color: M3.onSurfaceVariant },

  typingRow: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4, paddingHorizontal: 2 },
  typingDot: { width: 8, height: 8, borderRadius: 4 },

  bottomFade: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 50 },
  dock: { position: 'absolute', left: 14, right: 14, zIndex: 100 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingLeft: 7,
    paddingRight: 7,
    height: 58,
    borderWidth: 1,
    borderColor: '#EAF0EE',
    // premium float
    shadowColor: '#0B3B36',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  // Raised, tactile icon buttons (subtle 3D)
  iconBtn: {
    width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F4F8F7',
    borderWidth: 1, borderColor: '#E7EEEC',
    shadowColor: '#0B3B36', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  iconBtnPressed: { backgroundColor: M3.surfaceContainerHigh },
  input: { flex: 1, color: M3.onSurface, fontSize: 13.5, fontFamily: 'Inter-Medium', height: '100%', paddingHorizontal: 8 },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sendBtn: {
    width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    backgroundColor: M3.primary,
    shadowColor: '#0F766E', shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 6,
  },
  sendBtnDisabled: { },
  sendBtnPressed: { opacity: 0.92, transform: [{ scale: 0.96 }] },

  // action / options sheet
  sheetScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,0.4)' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 34 },
  sheetHandle: { alignSelf: 'center', width: 38, height: 4, borderRadius: 2, backgroundColor: '#D8DEE9', marginBottom: 8 },
  sheetTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 13, color: M3.onSurfaceVariant, textAlign: 'center', paddingVertical: 8 },
  sheetRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, paddingHorizontal: 12, borderRadius: 16 },
  sheetRowPressed: { backgroundColor: M3.surfaceContainer },
  sheetIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: M3.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  sheetLabel: { fontFamily: 'Inter-SemiBold', fontSize: 15.5, color: M3.onSurface },
  sheetCancel: { marginTop: 8, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: M3.surfaceContainer },
  sheetCancelText: { fontFamily: 'Poppins-SemiBold', fontSize: 15, color: M3.onSurface },

  // copied toast
  copiedToastWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 120 },
  copiedToast: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0F172A', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999 },
  copiedToastText: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: '#FFFFFF' },
  attachmentRail: { position: 'absolute', left: 14, right: 14, bottom: 122, zIndex: 110 },
  attachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: M3.outlineVariant,
    borderRadius: 18,
    padding: 10,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  attachmentThumb: { width: 54, height: 54, borderRadius: 12, backgroundColor: '#E5E7EB' },
  attachmentMeta: { flex: 1, minWidth: 0 },
  attachmentTitle: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: M3.onSurface },
  attachmentSubtitle: { fontFamily: 'Inter-Regular', fontSize: 12, color: M3.onSurfaceVariant, marginTop: 2 },
  attachmentRemove: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: M3.surfaceContainer },
});

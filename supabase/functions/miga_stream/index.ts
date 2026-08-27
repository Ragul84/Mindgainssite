import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { textbookSourceIndex as textbookSourceIndexJson } from "../_shared/textbook-source-index.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  user_id: string;
  messages: any[];
  mode?: "chat" | "study";
  attachments?: Array<{ dataUrl?: string; mimeType?: string }>;
}

const MAX_VERIFIED_CONTEXT_BLOCKS = 3;
const MAX_VERIFIED_CONTEXT_CHARS = 9000;

const isVerifiedContextMessage = (message: any) => {
  if (message?.role !== "system") return false;
  const content = String(message?.content ?? "");
  return content.includes("VERIFICATION_STATUS:");
};

const collectVerifiedContextMessages = (messages: any[]) =>
  messages
    .filter(isVerifiedContextMessage)
    .slice(0, MAX_VERIFIED_CONTEXT_BLOCKS)
    .map((message) => ({
      role: "system",
      content: String(message.content).slice(0, MAX_VERIFIED_CONTEXT_CHARS),
    }));

const streamPlainText = (text: string, status = 200) => {
  const payload = `event: token\ndata: ${JSON.stringify({ token: text })}\n\nevent: done\ndata: [DONE]\n\n`;
  return new Response(payload, {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
};

const PYQ_HINT_RE = /\b(pyqs?|previous\s+year|past\s+year|real\s+question|asked\s+in|year\s+question)\b/i;
const BOOKBACK_HINT_RE = /\b(bookback|exercise(?:\s*\d+(?:\.\d+)?)?|answer\s+the\s+following|textbook\s+exercise|activity\s+questions?)\b/i;
const QUIZ_HINT_RE = /\b(quiz\s+me|quiz|mock\s+test|practice\s+test|one\s+by\s+one|poll\s+mode|telegram\s+poll|10\s+questions|question\s+by\s+question)\b/i;
const PYQ_STOPWORDS = new Set([
  "show", "give", "real", "verified", "pyq", "pyqs", "previous", "year", "questions",
  "question", "from", "for", "with", "practice", "upsc", "tnpsc", "ssc", "ias", "prelims",
  "mains", "group", "cgl", "chsl", "use", "only", "source", "data", "authentic", "official",
]);

const SUBJECT_HINTS: Record<string, string[]> = {
  polity: ['polity', 'constitution', 'fundamental rights', 'directive principles', 'parliament', 'judiciary', 'president', 'governor', 'panchayat'],
  history: ['history', 'freedom struggle', 'movement', 'revolt', 'modern india', 'ancient', 'medieval'],
  geography: ['geography', 'climate', 'soil', 'river', 'monsoon', 'map'],
  economy: ['economy', 'economic', 'budget', 'inflation', 'banking', 'finance', 'gdp', 'tax'],
  science: ['science', 'physics', 'chemistry', 'biology', 'environment', 'technology'],
  english: ['english', 'grammar', 'comprehension', 'vocabulary', 'poem', 'poet', 'sentence'],
  tamil: ['tamil', 'literature', 'grammar', 'thirukkural'],
  maths: ['math', 'maths', 'quant', 'aptitude', 'reasoning'],
};

const normalizeText = (value: unknown) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stripSyllabusWrapper = (value: string) => {
  let text = String(value || "").trim();
  text = text
    .replace(/\b(?:in|from|for)\s+(?:the\s+)?(?:NCERT|ncert|CBSE|cbse|Samacheer|samacheer|board|syllabus|textbook)\b[^?.!,]*/gi, "")
    .replace(/\bclass\s*\d{1,2}\b/gi, "")
    .replace(/\b(?:NCERT|ncert|CBSE|cbse|Samacheer|samacheer|board|syllabus|textbook)\b/gi, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([?.!,])/g, "$1")
    .trim();
  return text || value.trim();
};

const cleanConceptAnswer = (value: string) => {
  const banned = /\b(ncert|cbse|samacheer|syllabus|textbook|class\s*\d{1,2}|board|not covered|doesn'?t cover|not taught|higher level|higher class|curriculum|verified source|source absence|verification|for your exams|exam purposes|chapter)\b/i;
  const lines = String(value || "")
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !banned.test(line))
    .filter((line) => !/^\s*(but|however|if you want|just let me know|would you like)/i.test(line));
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
};

const rewriteConceptAnswer = async (apiKey: string, userPrompt: string, draft: string) => {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://mindgains.ai',
        'X-Title': 'MindGains',
      },
      body: JSON.stringify({
        model: Deno.env.get('OPENROUTER_MODEL') || 'google/gemini-2.0-flash-001',
        temperature: 0,
        max_tokens: 700,
        messages: [
          {
            role: 'system',
            content: 'Rewrite the answer into a direct concept explanation. Keep the science and exam facts, but remove every sentence that mentions syllabus fit, textbooks, NCERT, class, board coverage, source absence, verification, or that the topic is not taught. Do not mention that this is or is not from a textbook. Return only the rewritten answer.',
          },
          {
            role: 'user',
            content: 'USER QUESTION:\n' + userPrompt + '\n\nDRAFT ANSWER:\n' + draft,
          },
        ],
      }),
    });
    if (!res.ok) return draft;
    const data = await res.json().catch(() => null);
    const content = String(data?.choices?.[0]?.message?.content || '').trim();
    return content || draft;
  } catch {
    return draft;
  }
};

const textWords = (value: string) =>
  normalizeText(value)
    .split(" ")
    .filter((word) => word.length >= 3 && !PYQ_STOPWORDS.has(word))
    .slice(0, 4);

const detectSubjectHint = (prompt: string) =>
  Object.entries(SUBJECT_HINTS).find(([, keywords]) =>
    keywords.some((keyword) => normalizeText(prompt).includes(normalizeText(keyword))),
  )?.[0] || null;

const rowMatchesSubjectHint = (row: any, subjectHint: string | null) => {
  if (!subjectHint) return true;
  const keywords = SUBJECT_HINTS[subjectHint] || [];
  const haystack = normalizeText([
    row?.subject,
    row?.topic,
    row?.question_text,
    row?.source_id,
  ].filter(Boolean).join(' '));
  return keywords.some((keyword) => haystack.includes(normalizeText(keyword)));
};

const dedupeRows = (rows: any[]) => {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = normalizeText(row?.question_text);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const detectPyqExams = (prompt: string) => {
  const text = normalizeText(prompt);
  const exams: string[] = [];
  if (/\b(upsc|ias|cse|prelims|mains)\b/.test(text)) exams.push("UPSC");
  if (/\b(tnpsc|group 1|group 2|group 4|vao)\b/.test(text)) exams.push("TNPSC");
  if (/\b(ssc|cgl|chsl|mts|cpo|gd)\b/.test(text)) exams.push("SSC");
  return exams;
};

const getLastUserText = (messages: any[]) => {
  const last = [...messages].reverse().find((message) => message?.role === "user");
  const content = last?.content;
  if (Array.isArray(content)) {
    return content.map((part) => part?.text || "").filter(Boolean).join(" ").trim();
  }
  return String(content ?? "").trim();
};

const isDisplayablePyqRow = (row: any) => {
  const sourceId = String(row?.source_id || "").toLowerCase();
  const text = String(row?.question_text || "").trim();
  const optionValues = Array.isArray(row?.options)
    ? row.options.map((option: string) => String(option || "").trim()).filter(Boolean)
    : [];
  const exam = String(row?.exam || "").toLowerCase();
  const allowedSource =
    (exam === "upsc" && /(cse|civil-services|prelim|prelims)/i.test(sourceId) && !/(qp-so|steno|geolm|csm|ifsm|iesiss|cmse|esem|enggserv|engineering|literature|optional)/i.test(sourceId)) ||
    (exam === "tnpsc" && /tnpsc-group/i.test(sourceId) && !/general-tamil/i.test(sourceId)) ||
    (exam === "ssc" && /exams-ssc-pyq/i.test(sourceId)) ||
    (exam === "banking" && /exams-banking-pyq/i.test(sourceId)) ||
    (exam === "neet" && /exams-neet-pyq/i.test(sourceId)) ||
    (exam === "jee" && /exams-jee-pyq/i.test(sourceId));
  if (!allowedSource) return false;
  if (String(row?.question_type || "").toLowerCase() === "descriptive") return false;
  if (text.length < 30) return false;
  if (optionValues.length < 4) return false;
  if (!String(row?.answer_text || "").trim()) return false;
  if (/[ï¿½Â¤Â£Â§Â©Â®Â±Â¶Â¿Ã€ÃÃ‚ÃƒÃ„Ã…Ã†Ã‡ÃˆÃ‰ÃŠÃ‹ÃŒÃÃŽÃÃÃ‘Ã’Ã“Ã”Ã•Ã–Ã—Ã˜Ã™ÃšÃ›ÃœÃÃžÃŸÃ Ã¡Ã¢Ã£Ã¤Ã¥Ã¦Ã§Ã¨Ã©ÃªÃ«Ã¬Ã­Ã®Ã¯Ã°Ã±Ã²Ã³Ã´ÃµÃ¶Ã·Ã¸Ã¹ÃºÃ»Ã¼Ã½Ã¾Ã¿]/.test(text)) return false;
  if (/(general-tamil|geneal-tamil|pothu-tamil|gs-gt|gt-with|g1p-gs)/i.test(sourceId)) return false;
  if (/(qp-csm|qp-ifsm|literature-paper|essay|compulsory-language|language-paper)/i.test(sourceId)) return false;
  if (/\b(combined graduate level examination|exam date|exam time|turn over|instructions?|test booklet|penalty|rough work|do not open|roll number|signature|invigilator|booklet series|answer sheet|question booklet|write your|candidate'?s information|application form|aadhaar|digilocker|verified at|disability certificate|single girl child)\b/i.test(text)) return false;
  if (/^(?:\d+\.\s*)?only conclusions?\b/i.test(text)) return false;
  return true;
};

async function buildServerPyqContext(supabaseClient: any, prompt: string) {
  if (!PYQ_HINT_RE.test(prompt)) return "";

  const exams = detectPyqExams(prompt);
  if (!exams.length) {
    return [
      "VERIFICATION_STATUS: NO_VERIFIED_PYQ_MATCH",
      "The user asked for previous-year questions, but the exam was not specified clearly enough to verify a source match.",
      "Do not guess the exam or pull unrelated PYQs.",
      "Ask the user to name the exam, such as UPSC, TNPSC, or SSC.",
    ].join("\n");
  }

  const subjectHint = detectSubjectHint(prompt);
  const promptWords = textWords(prompt);
  const fetchRows = async (usePromptWords: boolean) => {
    let query = supabaseClient
      .from("pyq_questions")
      .select("id, source_id, exam, year, subject, topic, question_number, question_text, options, answer_text, explanation, question_type, page_start")
      .in("exam", exams)
      .gte("confidence", 0.45)
      .order("year", { ascending: false })
      .limit(40);

    if (usePromptWords && promptWords.length) {
      query = query.or(promptWords.flatMap((word) => [
        `question_text.ilike.%${word}%`,
        `topic.ilike.%${word}%`,
        `subject.ilike.%${word}%`,
      ]).join(","));
    }

    const { data, error } = await query;
    return error || !Array.isArray(data)
      ? []
      : dedupeRows(data)
          .filter(isDisplayablePyqRow)
          .filter((row) => rowMatchesSubjectHint(row, subjectHint))
          .slice(0, 5);
  };

  let rows = await fetchRows(true);
  if (rows.length < 3) {
    const broadRows = await fetchRows(false);
    rows = dedupeRows([...rows, ...broadRows])
      .filter((row) => rowMatchesSubjectHint(row, subjectHint))
      .slice(0, 5);
  }
  if (!rows.length) {
    return [
      "VERIFICATION_STATUS: NO_VERIFIED_PYQ_MATCH",
      `Exam filter: ${exams.join(", ")}`,
      "The user asked for previous-year questions, but no verified matching PYQ was found in the database.",
      "Do not invent past-year questions, years, papers, options, or answer keys.",
      "Stop here and ask the user for a different exam or a more specific verified topic.",
    ].join("\n");
  }

  return [
    "VERIFICATION_STATUS: VERIFIED_PYQ_DATABASE_CONTEXT",
    "Use only these verified previous-year questions from the PYQ database. Do not invent exam year, paper, wording, options, or answer keys.",
    "Every PYQ below has stored options and stored answer_text. Do not derive missing answers or use any PYQ outside this context.",
    ...rows.map((row: any, index: number) => {
      const optionValues = Array.isArray(row.options)
        ? row.options.map((option: string) => String(option || "").trim()).filter((option: string) => option.length > 2)
        : [];
      const options = optionValues.length >= 2
        ? optionValues.map((option: string, optionIndex: number) => `${String.fromCharCode(65 + optionIndex)}. ${option}`).join(" | ")
        : "";
      return [
        `PYQ ${index + 1}: ${row.exam}${row.year ? ` ${row.year}` : ""}${row.question_number ? ` Q${row.question_number}` : ""}`,
        row.subject ? `Subject: ${row.subject}` : undefined,
        row.topic ? `Topic: ${row.topic}` : undefined,
        `Source: ${row.source_id}${row.page_start ? ` page ${row.page_start}` : ""}`,
        `Question: ${row.question_text}`,
        options ? `Options: ${options}` : undefined,
        row.answer_text ? `Answer: ${row.answer_text}` : undefined,
        row.explanation ? `Explanation: ${row.explanation}` : undefined,
      ].filter(Boolean).join("\n");
    }),
  ].join("\n\n").slice(0, MAX_VERIFIED_CONTEXT_CHARS);
}

const normalizeImageMimeType = (value: unknown) => {
  const text = String(value ?? "").trim().toLowerCase();
  if (text.startsWith("image/")) return text;
  if (text === "png") return "image/png";
  if (text === "webp") return "image/webp";
  if (text === "heic" || text === "heif") return `image/${text}`;
  return "image/jpeg";
};

const normalizeImageDataUrl = (imageData: unknown, imageType: unknown) => {
  const text = String(imageData ?? "").trim();
  if (!text) return "";
  if (text.startsWith("data:image/")) return text;
  return `data:${normalizeImageMimeType(imageType)};base64,${text}`;
};

type FigureRef = {
  figure_id: string;
  page?: number | null;
  file: string;
  context_type?: string | null;
  context_title?: string | null;
  context_snippet?: string;
};

type TextbookSource = {
  source_id: string;
  board: string;
  class_level: number;
  subject: string;
  chapter: string;
  chapter_slug?: string;
  pdf_path: string;
  page_count: number;
  chunk_count: number;
  question_count: number;
  keywords?: ReadonlyArray<string>;
  lesson_pages?: ReadonlyArray<number>;
  bookback_pages?: ReadonlyArray<number>;
  sample_questions?: ReadonlyArray<{ page?: number; text: string; type: string }>;
  figure_refs?: ReadonlyArray<FigureRef>;
  source_summary?: string;
  source_note?: string;
};

type TextbookIndex = {
  source_count: number;
  sources: ReadonlyArray<TextbookSource>;
};

const TEXTBOOK_INDEX = textbookSourceIndexJson as unknown as TextbookIndex;
const TEXTBOOK_HINT_RE = /\b(textbook|text book|syllabus|chapter|lesson|bookback|exercise|diagram|figure|ncert|samacheer|curriculum|unit|board|class\s*(6|7|8|9|10|11|12)|book page|page\s*\d+)\b/i;
const CONCEPT_QUESTION_RE = /\b(explain|define|describe|why|how|what is|what are|difference|compare|list|write short note)\b/i;
const BRAND_QUERY_RE = /\bmindgains\b/i;
const TEXTBOOK_STOPWORDS = new Set([
  "explain", "simple", "terms", "term", "please", "tell", "about", "give", "overview", "detail", "details",
  "basic", "basics", "study", "learn", "learns", "learning", "question", "questions", "topic", "topics",
  "chapter", "lesson", "textbook", "text", "book", "class", "board", "exam", "for", "from", "the", "a", "an",
  "to", "of", "and", "or", "in", "on", "with", "what", "why", "how", "which", "who", "where", "when", "is",
  "are", "was", "were", "be", "been", "being", "this", "that", "these", "those", "upsc", "tnpsc", "ssc",
  "ncert", "samacheer", "cbse", "state", "school", "schools", "student", "students",
]);

const normalizeTextbook = (value: unknown) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const topicTokens = (value: string) =>
  new Set(
    normalizeTextbook(value)
      .split(/\s+/)
      .filter((token) => token && !TEXTBOOK_STOPWORDS.has(token)),
  );

const asHintSegments = (value: unknown): string[] => {
  if (value == null || value === "") return [];
  if (Array.isArray(value)) return value.flatMap((item) => asHintSegments(item));
  return [String(value)];
};

function scoreTextbookSource(source: TextbookSource, topic: string, exam: string, focus?: string) {
  const tokens = topicTokens(`${topic} ${focus || ""} ${exam}`);
  const haystack = new Set(
    [source.chapter, source.chapter_slug || "", ...(source.keywords || []), ...(source.sample_questions || []).map((question) => question.text), source.source_summary || ""]
      .map(normalizeTextbook)
      .join(" ")
      .split(/\s+/)
      .filter(Boolean),
  );
  let score = 0;
  let matchedTokenCount = 0;
  for (const token of Array.from(tokens)) {
    if (TEXTBOOK_STOPWORDS.has(token)) continue;
    let matchedThisToken = false;
    if (haystack.has(token)) {
      score += 3;
      matchedThisToken = true;
    }
    if ((source.chapter || "").toLowerCase().includes(token)) {
      score += 2;
      matchedThisToken = true;
    }
    if (matchedThisToken) matchedTokenCount += 1;
  }
  const requiredMatches = tokens.size >= 2 ? 2 : 1;
  if (matchedTokenCount < requiredMatches) return 0;
  if (normalizeTextbook(exam).includes(source.board)) score += 2;
  if (normalizeTextbook(topic).includes(normalizeTextbook(source.chapter))) score += 4;
  if (normalizeTextbook(topic).includes(`class ${source.class_level}`)) score += 2;
  return score;
}

function getVerifiedTextbookSources(topic: string, exam: string, focus?: string, mustHaveBookback = false): TextbookSource[] {
  return TEXTBOOK_INDEX.sources
    .filter((source) => !mustHaveBookback || (Array.isArray(source.bookback_pages) && source.bookback_pages.length > 0))
    .map((source) => ({ source, score: scoreTextbookSource(source, topic, exam, focus) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((row) => row.source);
}

function buildServerTextbookContext(topic: string, exam: string, focus?: string, mustHaveBookback = false) {
  const sources = getVerifiedTextbookSources(topic, exam, focus, mustHaveBookback);
  if (!sources.length) {
    return [
      "VERIFICATION_STATUS: NO_VERIFIED_SOURCES",
      `TOPIC: ${topic}`,
      `EXAM: ${exam}`,
      `FOCUS: ${focus || "n/a"}`,
      "SOURCE_NOTE: No matching textbook or exam source was found in the current corpus.",
      "INSTRUCTION: Do not invent board, class, chapter, page, unit, or question details.",
    ].join("\n");
  }

  return [
    "VERIFICATION_STATUS: VERIFIED",
    `MATCHED_SOURCE_COUNT: ${sources.length}`,
    ...sources
      .map((source) => `SOURCE_ID: ${source.source_id} | BOARD: ${source.board} | CLASS: ${source.class_level} | SUBJECT: ${source.subject} | CHAPTER: ${source.chapter}`)
      .slice(0, 3),
    "",
    ...sources
      .map((source) => {
        const figures = (source.figure_refs || []).slice(0, 4).map((figure) => {
          const page = figure.page ? `p.${figure.page}` : "p.?";
          const title = figure.context_title || figure.context_type || "figure";
          return `${title} (${page})`;
        });
        const bookback = (source.bookback_pages || []).slice(0, 4).map((page) => `p.${page}`).join(", ");
        const examples = (source.sample_questions || []).slice(0, 2).map((q) => q.text).join(" | ");

        return [
          `${source.source_note || source.chapter}`,
          `Bookback pages: ${bookback || "n/a"}`,
          `Figure refs: ${figures.join("; ") || "n/a"}`,
          `Sample questions: ${examples || "n/a"}`,
          `Source summary: ${source.source_summary || "n/a"}`,
        ].join("\n");
      })
      .join("\n\n"),
  ].filter(Boolean).join("\n");
}

serve(async (req) => {
const BRAND_MEMORY = `MINDGAINS BRAND MEMORY:
- MindGains is the AI learning platform used by students inside the MindGains app and public website.
- The company behind it is MindGains Labs Private Limited.
- Founder: Ragul Arvind.
- Core public product areas include Daily Dose, Study Lab, MIGA, Quiz Hub, Editorial, and Know Your India.
- If asked about MindGains, the app, the company, or the founder, answer from this memory block. If a detail is not present here, do not invent it.`;

const SOURCE_VERIFICATION_POLICY = `SOURCE VERIFICATION POLICY:
- If verified textbook or exam sources are supplied, answer only from those sources for textbook and syllabus claims.
- Do not mix boards, classes, or syllabi unless the user explicitly asks for a comparison.
- If the user is asking a normal concept or explanation question, answer helpfully even if the exact textbook source is missing. Do not mention source absence unless the user explicitly asked for a verified chapter, bookback, or PYQ.
- Only hard-refuse when the user explicitly asks for a verified textbook, bookback, or PYQ source and the current corpus cannot support it.
- Never present an unverified textbook detail as a fact.`;
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { user_id, messages, mode = "chat", attachments = [] } = await req.json() as ChatRequest;

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const persistHistory = async (content: string) => {
      if (!content) return;
      const lastUser = messages[messages.length - 1]?.content;
      const userMsg = Array.isArray(lastUser)
        ? lastUser.map((part: any) => part?.text || '').filter(Boolean).join(' ').trim()
        : lastUser;
      await supabaseClient.from('chat_history').insert({
        user_id,
        user_message: userMsg,
        ai_response: content,
        language: 'en'
      });
    };

    // Fetch user context for personalization
    const { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', user_id)
      .maybeSingle();

    const userName = profile?.display_name || "there";
    const profileExamHint = [
      ...asHintSegments(profile?.target_exams),
      ...asHintSegments(profile?.exam),
      ...asHintSegments(profile?.exam_type),
      ...asHintSegments(profile?.board),
      ...asHintSegments(profile?.class_level ? `class ${profile.class_level}` : ""),
    ]
      .filter(Boolean)
      .join(" ");
    const hasAttachments = Array.isArray(attachments) && attachments.length > 0;
    
    // Mode-specific System Prompts
    let systemPrompt = "";
    
    if (mode === "chat") {
      systemPrompt = `You are MIGA, a warm, brilliant tutor and study buddy for Indian exam aspirants (UPSC, TNPSC, SSC, banking, state PSCs).
USER_NAME: ${userName}.

${BRAND_MEMORY}


YOU TEACH — you never just give a one-liner when the student wants to understand something.
- When asked to explain or understand a concept: give a proper, well-structured explanation — a clear definition, the key points, a simple example or analogy, and why it matters for the exam. Be genuinely thorough and helpful.
- If the user asks a concept question with curriculum framing, do not judge syllabus fit unless they explicitly ask whether it is covered there. Just answer the concept directly.
- Never volunteer syllabus coverage language unless the user explicitly asks about syllabus coverage.
- For a direct MCQ: lead with "Answer: X", then explain why it is right and, briefly, why a tempting wrong option is wrong.
- For "revise / quick revision": give crisp, organised bullet-style recall points.

STYLE:
- Match length to the need: concise for quick questions, detailed and clear when teaching. Do NOT artificially shorten a real explanation.
- Use short paragraphs and the occasional compact list. Bold key terms, Articles, and years sparingly.
- When you number steps or lists, use 1), 2), 3), not 1., 2., 3.
- Simple, encouraging language. No emojis or mascot/animal roleplay. Just be a great, human tutor.
- Never refuse a genuine study question. If something is off-topic, help briefly and steer back to studies.

WRITING (sound human, never like a generic AI):
- NEVER use em dashes (—) or double hyphens (--). Use commas, full stops, or "(...)" instead. This is important.
- Talk like a real person, not a textbook. Avoid stiff connectors and AI clichés.

LANGUAGE — speak naturally, conversationally, like a real teacher/friend from that region:
- Reply in the user's language. If they write in Tamil, reply in natural spoken Tamil (Tanglish where students mix English exam terms, e.g. "Fiscal deficit nu sollradhu government oda total borrowing..."). Do NOT do stiff, formal, word-by-word textbook translation.
- Same for Hindi and other Indian languages: warm, conversational, the way a good coaching-centre teacher actually talks, mixing common English exam words naturally.
- Keep exam terms (Article, Fundamental Rights, Fiscal Deficit, etc.) in English even within the regional reply, the way real students say them.`;
      if (hasAttachments) {
        systemPrompt += `

IMAGE INPUT:
The user attached one or more images. Inspect them carefully.
If the image contains a textbook page, diagram, or question paper, ground your answer in what is visible.
If details are unclear, say so briefly instead of inventing them.`;
      }
    } else {
      // STUDY Mode: The full orchestrator
      systemPrompt = `You are MIGA, the MindGains Study Session Orchestrator. 
USER_NAME: ${userName}.

${BRAND_MEMORY}


MISSION: Transform user requests into structured, effective study sessions.

CORE RESPONSIBILITIES:
1. SESSION PLANNING: Convert requests (e.g., "Physics for 1h") into blocks: [Topic, Duration, Objective, Method, Quiz].
2. TEACHING: Deliver content in small, digestible chunks. PAUSE after each concept.
3. RECALL MODE: When user says "quiz me on mistakes", fetch their weak topics and quiz them.
4. FOCUS ENFORCEMENT: Mention MindShield for distraction blocking if needed.
5. QUIZ & DIAGNOSIS: Generate MCQs. Adjust focus based on results.

RESPONSE FORMAT:
1. Short confirmation greeting.
2. Clear study plan or content.
3. Next action suggestion.

LIST FORMAT:
- Use 1), 2), 3) instead of 1., 2., 3. for numbered steps.

TONE: Supportive coach, clear and concise. Wolf theme.`;
      if (hasAttachments) {
        systemPrompt += `

IMAGE INPUT:
The user attached one or more images. Use them as part of the study workflow if relevant.`;
      }
    }

    const verifiedContextMessages = collectVerifiedContextMessages(messages);
    const lastUserText = getLastUserText(messages);
    const wantsQuizFlow = QUIZ_HINT_RE.test(lastUserText);
    const wantsPyq = PYQ_HINT_RE.test(lastUserText);
    const wantsBookback = BOOKBACK_HINT_RE.test(lastUserText);
    const wantsTextbookVerification =
      !BRAND_QUERY_RE.test(lastUserText) &&
      !CONCEPT_QUESTION_RE.test(lastUserText) &&
      TEXTBOOK_HINT_RE.test(lastUserText);
    const shouldAttemptTextbookMatch = wantsBookback || wantsTextbookVerification;
    const shouldBufferConceptAnswer = CONCEPT_QUESTION_RE.test(lastUserText) && !wantsPyq && !wantsBookback && !wantsQuizFlow;
    const serverTextbookContext = verifiedContextMessages.length || !shouldAttemptTextbookMatch
      ? ""
      : buildServerTextbookContext(lastUserText, profileExamHint || lastUserText, undefined, wantsBookback);
    const hasVerifiedTextbookContext = serverTextbookContext.startsWith("VERIFICATION_STATUS: VERIFIED");
    const hasMissingTextbookContext = serverTextbookContext.startsWith("VERIFICATION_STATUS: NO_VERIFIED_SOURCES");
    if (wantsBookback && hasMissingTextbookContext) {
      const refusal = "I cannot verify that textbook or syllabus detail from the current verified corpus for that request.";
      return streamPlainText(refusal);
    }
    const serverPyqContext = verifiedContextMessages.length || !wantsPyq
      ? ""
      : await buildServerPyqContext(supabaseClient, lastUserText);
    if (serverPyqContext.startsWith('VERIFICATION_STATUS: NO_VERIFIED_PYQ_MATCH') || serverPyqContext.startsWith('VERIFICATION_STATUS: NO_VERIFIED_PYQ_SOURCE')) {
      const refusal = 'I cannot verify a matching PYQ from the current verified corpus for that request.';
      return streamPlainText(refusal);
    }
    const generalConceptNote = wantsTextbookVerification && !hasVerifiedTextbookContext && !hasMissingTextbookContext
      ? [
          "GENERAL_CONCEPT_MODE:",
          "Answer clearly from subject knowledge anyway. Do not refuse.",
          "The user wants a normal concept explanation. Ignore curriculum framing and answer the concept only.",
          "Do not mention missing sources, corpus limits, syllabus fit, coverage, or verification status unless the user explicitly asks for a verified chapter, bookback, or PYQ.",
          "If helpful, keep it exam-focused and concise. Do not claim a textbook citation.",
        ].join("\n")
      : "";
    const openRouterMessages = messages.filter((m) => m.role !== 'system');
    if (hasAttachments) {
      const lastUserIndex = [...openRouterMessages].map((m) => m?.role).lastIndexOf("user");
      if (lastUserIndex >= 0) {
        const last = openRouterMessages[lastUserIndex];
        const parts: any[] = [];
        const text = shouldBufferConceptAnswer
          ? stripSyllabusWrapper(String(last?.content ?? ""))
          : wantsTextbookVerification && !hasVerifiedTextbookContext && !hasMissingTextbookContext && !wantsBookback && !wantsPyq
          ? stripSyllabusWrapper(String(last?.content ?? ""))
          : String(last?.content ?? "").trim();
        if (text) parts.push({ type: "text", text });
        for (const attachment of attachments) {
          const imageData = normalizeImageDataUrl(attachment?.dataUrl, attachment?.mimeType);
          if (imageData) parts.push({ type: "image_url", image_url: { url: imageData } });
        }
        openRouterMessages[lastUserIndex] = { ...last, content: parts };
      }
    } else {
      const lastUserIndex = [...openRouterMessages].map((m) => m?.role).lastIndexOf("user");
      if (lastUserIndex >= 0 && shouldBufferConceptAnswer) {
        const last = openRouterMessages[lastUserIndex];
        openRouterMessages[lastUserIndex] = { ...last, content: stripSyllabusWrapper(String(last?.content ?? "")) };
      } else if (lastUserIndex >= 0 && wantsTextbookVerification && !hasVerifiedTextbookContext && !hasMissingTextbookContext && !wantsBookback && !wantsPyq) {
        const last = openRouterMessages[lastUserIndex];
        openRouterMessages[lastUserIndex] = { ...last, content: stripSyllabusWrapper(String(last?.content ?? "")) };
      }
    }

    // OpenRouter API call
    const openRouterPayload = {
      model: hasAttachments
        ? (Deno.env.get('OPENROUTER_VISION_MODEL') || 'openai/gpt-4o-mini')
        : (Deno.env.get('OPENROUTER_MODEL') || 'google/gemini-2.0-flash-001'),
      messages: [
        { role: 'system', content: systemPrompt },
        ...verifiedContextMessages,
        ...(generalConceptNote ? [{ role: 'system', content: generalConceptNote }] : []),
        ...(hasVerifiedTextbookContext ? [{ role: 'system', content: serverTextbookContext }] : []),
        ...(serverPyqContext ? [{ role: 'system', content: serverPyqContext }] : []),
        ...(wantsQuizFlow ? [{
          role: 'system',
          content: `QUIZ MODE:
- Ask exactly one question at a time.
- Wait for the user's answer before moving on.
- Use 4 options when applicable and format them as 1), 2), 3), 4).
- After each answer, say whether it was correct, give a short explanation, then ask the next question.
- For PYQ requests in quiz mode, use only verified PYQs from the corpus.
- Keep the quiz to 10 questions unless the user stops earlier.`,
        }] : []),
        ...openRouterMessages
      ],
      stream: true,
      max_tokens: 3000,
      temperature: 0.7
    };

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        'HTTP-Referer': 'https://mindgains.ai',
        'X-Title': 'MindGains'
      },
      body: JSON.stringify(openRouterPayload)
    });

    if (!openRouterResponse.ok) {
      const err = await openRouterResponse.text();
      console.error('OpenRouter Error:', err);
      return new Response(err, { status: openRouterResponse.status, headers: corsHeaders });
    }

    // --- SSE STREAMING ---
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        const reader = openRouterResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let fullContent = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  controller.enqueue(encoder.encode("event: done\ndata: [DONE]\n\n"));
                  break;
                }

                try {
                  const json = JSON.parse(data);
                  const token = json.choices[0]?.delta?.content || "";
                  if (token) {
                    fullContent += token;
                    if (!shouldBufferConceptAnswer) {
                      controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ token })}\n\n`));
                    }
                  }
                } catch (e) {
                  // Ignore partial JSON chunks
                }
              }
            }
          }
          
          if (fullContent) {
            const output = shouldBufferConceptAnswer
              ? await rewriteConceptAnswer(Deno.env.get('OPENROUTER_API_KEY') || '', lastUserText, fullContent)
              : fullContent;
            const cleanedOutput = shouldBufferConceptAnswer
              ? (cleanConceptAnswer(output) || cleanConceptAnswer(fullContent) || output)
              : output;
            if (shouldBufferConceptAnswer) {
              controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ token: cleanedOutput })}\n\n`));
            }
            await persistHistory(cleanedOutput);
          }

        } catch (e) {
          console.error("Stream Error:", e);
          controller.error(e);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

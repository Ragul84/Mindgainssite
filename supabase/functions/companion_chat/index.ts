// Server-side proxy for the app's companion AI (Build Lessons, tutor, examiner, planner, etc.).
// Keeps the OpenRouter/OpenAI key OFF the client — the key lives only in Supabase secrets.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const priceForModel = (model: string) => {
  const id = model.toLowerCase();
  if (id.includes("gemini-3.1-flash-lite")) return { input: 0.25, output: 1.50 };
  if (id.includes("gemini-2.5-flash-lite")) return { input: 0.10, output: 0.40 };
  if (id.includes("deepseek-v4-flash")) return { input: 0.09, output: 0.18 };
  return { input: 0.10, output: 0.40 };
};

const estimateMicros = (model: string, inputChars: number, outputChars: number) => {
  const price = priceForModel(model);
  const inputTokens = Math.ceil(Math.max(0, inputChars) / 4);
  const outputTokens = Math.ceil(Math.max(0, outputChars) / 4);
  return Math.max(1, Math.ceil(inputTokens * price.input + outputTokens * price.output));
};

const resolveUserId = async (req: Request) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!supabaseUrl || !serviceKey || !token) return "";
  const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return "";
  const user = await res.json().catch(() => null);
  return String(user?.id || "");
};

const consumeAiCost = async (userId: string, micros = 0) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey || !userId) return null;
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/consume_ai_cost`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_user_id: userId, p_micros: Math.max(0, Math.ceil(micros)) }),
  });
  if (!res.ok) return null;
  return await res.json().catch(() => null);
};

const BRAND_MEMORY = `MINDGAINS BRAND MEMORY:
- MindGains is the AI learning platform used by students inside the MindGains app and public website.
- The company behind it is MindGains Labs Private Limited.
- Founder: Ragul Arvind.
- Core public product areas include Daily Dose, Study Lab, MIGA, Quiz Hub, Editorial, and Know Your India.
- If asked about MindGains, the app, the company, or the founder, answer from this memory block. If a detail is not present here, do not invent it.`;

const SOURCE_VERIFICATION_POLICY = `SOURCE VERIFICATION POLICY:
- If verified textbook or exam sources are supplied, answer only from those sources for textbook and syllabus claims.
- Do not mix boards, classes, or syllabi unless the user explicitly asks for a comparison.
- If the supplied sources do not support the question and the user explicitly asked for a verified source, say you cannot verify it from the current corpus.
- If the user asked a normal concept question, answer directly from subject knowledge and do not mention source absence.
- If the user asks a normal concept question with curriculum framing, do not judge syllabus fit unless they explicitly ask whether it is covered there.
- Never volunteer syllabus coverage language unless the user explicitly asks about syllabus coverage.
- Never present an unverified textbook detail as a fact.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!apiKey) return json({ error: "Server LLM key not configured" }, 500);

    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : null;
    if (!messages || messages.length === 0) return json({ error: "messages[] is required" }, 400);
    const attachments = Array.isArray(body?.attachments) ? body.attachments : [];
    const hasAttachments = attachments.length > 0;

    const model = String(
      body.model || (hasAttachments ? Deno.env.get("OPENROUTER_VISION_MODEL") || "openai/gpt-4o-mini" : Deno.env.get("OPENROUTER_MODEL") || "deepseek/deepseek-v4-flash"),
    );
    const max_tokens = Math.min(Number(body.maxTokens ?? body.max_tokens ?? 2500) || 2500, 8000);
    const temperature = Number(body.temperature ?? 0.8);
    const userId = await resolveUserId(req);
    if (!userId) return json({ error: "Sign in is required for AI generation" }, 401);
    const budget = await consumeAiCost(userId, 0);
    if (budget && budget.allowed === false) return json({ error: "Daily AI budget reached" }, 402);

    const openRouterMessages = [...messages];
    const firstSystemIndex = openRouterMessages.findIndex((m) => m?.role === "system");
    const brandSystemContent = `${BRAND_MEMORY}\n\n${SOURCE_VERIFICATION_POLICY}`;
    if (firstSystemIndex >= 0) {
      const first = openRouterMessages[firstSystemIndex];
      const existing = String(first?.content ?? "").trim();
      openRouterMessages[firstSystemIndex] = {
        ...first,
        content: existing ? `${existing}\n\n${brandSystemContent}` : brandSystemContent,
      };
    } else {
      openRouterMessages.unshift({ role: "system", content: brandSystemContent });
    }
    if (hasAttachments) {
      const lastUserIndex = [...openRouterMessages].map((m) => m?.role).lastIndexOf("user");
      if (lastUserIndex >= 0) {
        const last = openRouterMessages[lastUserIndex];
        const parts: any[] = [];
        const text = String(last?.content ?? "").trim();
        if (text) parts.push({ type: "text", text });
        for (const attachment of attachments) {
          const imageData = String(attachment?.dataUrl ?? "").trim();
          if (!imageData) continue;
          const url = imageData.startsWith("data:image/") ? imageData : `data:${String(attachment?.mimeType || "image/jpeg")};base64,${imageData}`;
          parts.push({ type: "image_url", image_url: { url } });
        }
        openRouterMessages[lastUserIndex] = { ...last, content: parts };
      }
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://mindgains.app",
        "X-Title": "MindGains Companion",
      },
      body: JSON.stringify({ model, max_tokens, temperature, messages: openRouterMessages }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[companion_chat] upstream", res.status, errText.slice(0, 300));
      return json({ error: `LLM upstream ${res.status}` }, 502);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return json({ error: "Empty LLM response" }, 502);

    const inputChars = JSON.stringify(messages).length;
    await consumeAiCost(userId, estimateMicros(model, inputChars, String(content).length));

    return json({ content });
  } catch (e) {
    console.error("[companion_chat]", e);
    return json({ error: e instanceof Error ? e.message : "companion_chat failed" }, 500);
  }
});

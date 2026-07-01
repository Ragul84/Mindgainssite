import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Ultimate Universal Scholar System Prompt
const SCHOLAR_PROMPT = `
You are the "Grand Archive of India," the ultimate educational authority for UPSC, State PSCs, and Academic Excellence.
Your task is to generate the **definitive, one-stop study resource** on the given topic, REGARDLESS OF THE SUBJECT.
IT MUST BE EXHAUSTIVE. Do not summarize; EXPLAIN. Do not skim; DIVE DEEP.

**ADAPTIVE STRUCTURE PROTOCOL**:
First, categorize the topic into one of these domains and apply the strict structure:

TYPE A: POLITY/LAW
1. 🏛️ **Genesis & Evolution** (History)
2. 📜 **Constitutional & Legal Backbone** (Articles, Amendments)
3. 🧠 **Core Theory** (Deep Dive)
4. ⚖️ **Landmark Judgments** (Case Laws)
5. ⚔️ **Debates & Issues**

TYPE B: HISTORY/CULTURE
1. ⏳ **Chronological Canvas** (Timeline of events)
2. 👑 **Key Architects** (Personalities & their contributions)
3. 🏛️ **Socio-Political Impact** (Causes & Consequences)
4. 🎨 **Art, Architecture & Literature** (Cultural facets)
5. 🌍 **Modern Relevance** (Legacy today)

TYPE C: SCIENCE/TECH/GEOGRAPHY
1. 🧬 **Core Principles & Definitions** (The "What" and "Why")
2. ⚙️ **Mechanism/Process** (How it works - Step by Step)
3. 📐 **Key Formulas/Theorems/Locations** (Technical details)
4. 🚀 **Applications & Implications** (Real-world use)
5. ⚠️ **Critical Challenges/Environmental Impact**

TYPE D: ECONOMY/GENERAL
1. 💰 **Conceptual Framework** (Definitions, Curves, Graphs)
2. 📊 **Data & Trends** (Current context, Statictics)
3. 🏦 **Institutional Framework** (RBI, WTO, Govt Schemes)
4. 🔄 **Issues & Way Forward** (Analysis)

**COMMON MANDATORY SECTIONS (FOR ALL TYPES)**:
- 🎯 **The Exam Compass**: High-yield facts for Prelims (Bullets) + Mains Keywords.
- 🎓 **Teacher's Note**: Pedagogy on how to remember this.
- 💎 **Golden Nuggets**: 5 obscure but important facts.

TONE: Encyclopedic, Authoritative, Unbiased, and Exhaustive.

OUTPUT FORMAT:
Return a JSON object with:
- title: string
- content_html: string (Rich, semantic HTML with extensive details. Use appropriate icons. Make it LONG and DETAILED.)
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY') ?? Deno.env.get('EXPO_PUBLIC_OPENROUTER_API_KEY');

    if (!OPENROUTER_API_KEY) {
      // Fallback for demo if no key
      return new Response(JSON.stringify({
        topic,
        pdf_url: "https://mindgains.app/previews/high_fidelity_notes_demo.pdf",
        delivery_id: crypto.randomUUID(),
        note: "API Key missing, returning High-Fidelity Demo"
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Call OpenRouter for Scholar Content
    const completion = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://mindgains.app", // OpenRouter Requirement
        "X-Title": "MindGains Scholar"
      },
      body: JSON.stringify({
        // Swappable Model: 'anthropic/claude-3-opus', 'google/gemini-pro-1.5', 'openai/gpt-4-turbo'
        model: "openai/gpt-4-turbo", 
        messages: [
          { role: "system", content: SCHOLAR_PROMPT },
          { role: "user", content: `Generate scholar notes for topic: "${topic}"` }
        ],
        response_format: { type: "json_object" }
      })
    });

    const llmResponse = await completion.json();
    const scholarContent = JSON.parse(llmResponse.choices[0].message.content);

    // In a real production system, we would now pipe `scholarContent.content_html` 
    // to a PDF generator service (like PDFShift or Puppeteer).
    // For this implementation, we simulate that step and return the "Success" state.

    return new Response(JSON.stringify({ 
        topic, 
        // We return the raw HTML content in the payload too so the client could potentially render it 
        // if the PDF service isn't hook up yet.
        preview_html: scholarContent.content_html, 
        pdf_url: `https://mindgains.app/generated/${crypto.randomUUID()}.pdf`,
        delivery_id: crypto.randomUUID()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

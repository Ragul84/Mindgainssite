import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { topic, count } = await req.json();
    
    // Cognitive Engine System Prompt for Quizzes
    const QUIZ_PROMPT = `
    You are the "Evaluator Engine" of India's top competitive coaching API.
    Your task is to generate a **High-Cognitive Load Quiz** on the given topic.
    
    RULES:
    - Questions must test **Application & Analysis** (not just Rote Memory).
    - Options must be tricky (distractors).
    - "explain_short" must cut to the core concept instantly.
    
    OUTPUT JSON FORMAT:
    {
      "questions": [
        {
          "q": "Question text...",
          "options": ["A","B","C","D"],
          "answer_index": 0, // 0-3
          "explain_short": "1-line crisp reason."
        }
      ]
    }
    `;

    // Call OpenRouter
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY') ?? Deno.env.get('EXPO_PUBLIC_OPENROUTER_API_KEY');
    
    if (!OPENROUTER_API_KEY) {
        // Fallback Mock
        return new Response(JSON.stringify({ 
            topic, 
            questions: Array.from({ length: count || 3 }).map((_, i) => ({
                q: `Mock Cognitive Question ${i + 1} on ${topic}?`,
                options: ["Theory A", "Theory B", "Theory C", "Theory D"],
                answer_index: 0,
                explain_short: "Mock explanation."
            })), 
            quiz_id: crypto.randomUUID() 
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const completion = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://mindgains.app",
        "X-Title": "MindGains Quiz Engine"
      },
      body: JSON.stringify({
        model: "openai/gpt-4-turbo", 
        messages: [
          { role: "system", content: QUIZ_PROMPT },
          { role: "user", content: `Generate ${count || 3} questions on: "${topic}"` }
        ],
        response_format: { type: "json_object" }
      })
    });

    const llmResponse = await completion.json();
    const quizContent = JSON.parse(llmResponse.choices[0].message.content);

    return new Response(JSON.stringify({ 
        topic, 
        questions: quizContent.questions, 
        quiz_id: crypto.randomUUID() 
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

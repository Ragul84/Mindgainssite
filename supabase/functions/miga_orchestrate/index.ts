import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrchestrateRequest {
  user_id: string;
  transcript: string;
  context?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_id, transcript, context } = await req.json() as OrchestrateRequest;
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Fetch User Context (Parallel) - Use maybeSingle() to prevent crashes if empty
    // ADDED: Fetch Chat History for memory
    const [userProfile, recentProgress, pendingAction, chatHistory] = await Promise.all([
      supabaseClient.from('user_profiles').select('*').eq('id', user_id).maybeSingle(),
      supabaseClient.from('user_progress').select('*').eq('user_id', user_id).order('updated_at', { ascending: false }).limit(1).maybeSingle(),
      supabaseClient.from('miga_pending_actions').select('*').eq('user_id', user_id).gt('expires_at', new Date().toISOString()).maybeSingle(),
      supabaseClient.from('chat_history').select('user_message, ai_response').eq('user_id', user_id).order('created_at', { ascending: false }).limit(5)
    ]);

    const user = userProfile.data;
    const lastLesson = recentProgress.data; // e.g. "Constitution Lesson 3"
    const pending = pendingAction.data;
    const history = chatHistory.data || [];

    // Format history for LLM (Reverse it back to chronological order)
    const formattedHistory = history.reverse().flatMap(h => [
        { role: 'user', content: h.user_message },
        { role: 'assistant', content: h.ai_response || "..." }
    ]);

    // 2. Intent Classification (Deterministic Keywords + Fallback)
    let intent = "GENERAL_CHAT";
    const lowerText = transcript.toLowerCase();

    // Confirm Action Intent
    if (pending && (lowerText.includes("yes") || lowerText.includes("send") || lowerText.includes("do it") || lowerText.includes("sure"))) {
      intent = "CONFIRM_ACTION";
    }
    // Specific requests
    else if (lowerText.includes("pdf") || lowerText.includes("notes") || lowerText.includes("material")) {
      intent = "REQUEST_PDF";
    }
    else if (lowerText.includes("quiz") || lowerText.includes("test") || lowerText.includes("burst")) {
      intent = "REQUEST_QUIZ_BURST";
    }
    else if (lowerText.includes("plan") || lowerText.includes("schedule")) {
      intent = "REQUEST_STUDY_PLAN";
    }
    else if (lowerText.includes("weak") || lowerText.includes("bad at") || lowerText.includes("mistake")) {
      intent = "ASK_WEAK_AREAS";
    }

    // 3. Logic & Decision Making
    let responsePayload = {
      intent,
      speak: "",
      needs_confirmation: false,
      proposed_action: null as any,
      ui_state: { status: "idle", hint_text: "" }
    };

    // --- HANDLE CONFIRMATION ---
    if (intent === "CONFIRM_ACTION") {
      // Trigger the pending action immediately
      const actionType = pending.action_type; 
      
      await supabaseClient.functions.invoke('miga_whatsapp_send', {
        body: {
          user_id,
          delivery_type: actionType === 'SEND_PDF' ? 'pdf' : (actionType === 'SEND_STUDY_PLAN' ? 'study_plan' : 'quiz_burst'),
          payload: pending.params
        }
      });

      // Clear pending action
      await supabaseClient.from('miga_pending_actions').delete().eq('id', pending.id);

      responsePayload.speak = "On it! Sent to your WhatsApp. Check it out now!";
      responsePayload.ui_state = { status: "sent", hint_text: "Sent to WhatsApp ✅" };
      
      // Save interaction
      await saveChatHistory(supabaseClient, user_id, transcript, responsePayload.speak);

      return new Response(JSON.stringify(responsePayload), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // --- HANDLE SPECIFIC REQUESTS ---
    
    if (intent === "REQUEST_QUIZ_BURST") {
      const topic = lastLesson?.topic_id || "General Knowledge";
      responsePayload.speak = `I can send a 5-question rapid fire on ${topic} to your WhatsApp. Want me to send it?`;
      responsePayload.needs_confirmation = true;
      responsePayload.proposed_action = {
        type: "SEND_QUIZ_BURST",
        params: { topic, count: 5 }
      };
      await storePendingAction(supabaseClient, user_id, "SEND_QUIZ_BURST", { topic, count: 5 });
    }

    else if (intent === "REQUEST_PDF") {
      const topic = lastLesson?.topic_id || "Constitution"; 
      responsePayload.speak = `I'll generate a summary PDF for ${topic}. It takes a sec. Should I send it to your WhatsApp?`;
      responsePayload.needs_confirmation = true;
      responsePayload.proposed_action = {
        type: "SEND_PDF",
        params: { topic, format: "exam_notes_short" }
      };
      await storePendingAction(supabaseClient, user_id, "SEND_PDF", { topic, format: "exam_notes_short" });
    }

    else if (intent === "REQUEST_STUDY_PLAN") {
      responsePayload.speak = "I can sketch a quick 1-day study plan based on your recent activity. Send it to WhatsApp?";
      responsePayload.needs_confirmation = true;
      responsePayload.proposed_action = {
        type: "SEND_STUDY_PLAN",
        params: { duration: "1_day" }
      };
      await storePendingAction(supabaseClient, user_id, "SEND_STUDY_PLAN", { duration: "1_day" });
    }

    // --- HANDLE GENERAL CHAT (LLM ENHANCED) ---
    else {
        // 1. Fallback Logic: If totally inactive, prompt habit.
        // BUT ONLY IF transcript is short/greeting AND no history.
        const isGreeting = ["hello", "hi", "hey"].includes(lowerText.replace(/[^a-z]/g, ''));

        if (isGreeting && history.length === 0) {
             if (lastLesson && new Date(lastLesson.updated_at).getDate() === new Date().getDate()) {
                responsePayload.speak = `You crushed ${lastLesson.topic_id} today! Want a quick 3-question quiz on WhatsApp to lock it in?`;
                responsePayload.needs_confirmation = true;
                await storePendingAction(supabaseClient, user_id, "SEND_QUIZ_BURST", { topic: lastLesson.topic_id, count: 3 });
              } else {
                responsePayload.speak = "Hey! Haven't seen you much today. Want a quick 1-minute warmup quiz to get the streak going?";
                responsePayload.needs_confirmation = true;
                await storePendingAction(supabaseClient, user_id, "SEND_QUIZ_BURST", { topic: "General Mixture", count: 3 });
              }
        } else {
            // 2. INTELLIGENT CHAT via OpenRouter (With Memory)
            try {
                const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
                        'HTTP-Referer': 'https://mindgains.ai', // OpenRouter requirements
                        'X-Title': 'MindGains'
                    },
                    body: JSON.stringify({
                        model: 'openai/gpt-4o-mini',
                        messages: [
                            { role: 'system', content: `You are MiGA, a witty and energetic study mascot (Wolf). 
                            Keep responses concise but informative (max 3-4 sentences). 
                            If user asks about the quiz/note offer, clarify what it is.
                            If user seems to agree to an action, say "Say 'Yes' to confirm!".
                            Current Context: User has been offered ${pending ? pending.action_type : 'nothing yet'}.` },
                            // INJECT MEMORY HERE
                            ...formattedHistory,
                            { role: 'user', content: transcript }
                        ],
                        max_tokens: 60
                    })
                });
                
                if (aiResponse.ok) {
                    const aiData = await aiResponse.json();
                    responsePayload.speak = aiData.choices[0].message.content;
                } else {
                    responsePayload.speak = "I didn't quite catch that. Could you say it again?";
                }
            } catch (e) {
                console.error('LLM Error:', e);
                responsePayload.speak = "I'm having a bit of brain fog. Ask me again?";
            }
        }
    }

    // SAVE CHAT HISTORY (Optimized: Don't wait for it)
    // EdgeRuntime.waitUntil allows the response to return while this saves in background
    if ((globalThis as any).EdgeRuntime?.waitUntil) {
       (globalThis as any).EdgeRuntime.waitUntil(
           saveChatHistory(supabaseClient, user_id, transcript, responsePayload.speak)
       );
    } else {
       // Fallback for local testing
       saveChatHistory(supabaseClient, user_id, transcript, responsePayload.speak).catch(e => console.error(e));
    }

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper to save chat
async function saveChatHistory(supabase: any, user_id: string, user_message: string, ai_response: string) {
    if (!ai_response) return;
    try {
        await supabase.from('chat_history').insert({
            user_id,
            user_message,
            ai_response,
            language: 'en'
        });
    } catch (e) {
        console.error("Failed to save history:", e);
    }
}

async function storePendingAction(supabase: any, user_id: string, type: string, params: any) {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 mins
  
  // First delete old pending for this user to keep it clean (Single Active Action Policy)
  await supabase.from('miga_pending_actions').delete().eq('user_id', user_id);

  const { error } = await supabase.from('miga_pending_actions').insert({
    user_id,
    action_type: type,
    params,
    expires_at: expiresAt,
    created_at: new Date().toISOString()
  });
  
  if (error) console.error("StoredPending Error:", error);
}

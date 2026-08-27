import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type LessonRequest = {
  mission_id: string;
  block_sequence: number;
  topic: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as LessonRequest;
    if (!body.mission_id || !body.topic) {
      return new Response(JSON.stringify({ error: "Missing mission_id or topic" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const content = `Mission focus: ${body.topic}

1. Definition & core principle.
2. Real-world implication.
3. Quick recall question.`;

    const recallQuestion = `In one sentence, explain the key insight about ${body.topic}.`;

    const lesson = {
      id: crypto.randomUUID(),
      mission_id: body.mission_id,
      block_sequence: body.block_sequence ?? 1,
      title: `${body.topic} — Core Brief`,
      content,
      recall_question: recallQuestion,
      status: "delivered",
      created_at: new Date().toISOString(),
    };

    return new Response(JSON.stringify({ lesson }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("mission_lessons error", err);
    return new Response(JSON.stringify({ error: err.message ?? "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

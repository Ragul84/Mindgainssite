import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ExamRequest = {
  mission_id: string;
  block_sequence: number;
  topic: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as ExamRequest;
    if (!body.mission_id || !body.topic) {
      return new Response(JSON.stringify({ error: "Missing mission_id or topic" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const questions = [
      {
        question: `What is the core principle behind ${body.topic}?`,
        options: ["Fundamentals", "Taxation", "Judiciary", "Ecology"],
        correct_index: 0,
        explanation: "Focus on the concept introduced in this mission.",
      },
      {
        question: `How does ${body.topic} impact exam strategy?`,
        options: ["Memorization only", "Application-based reasoning", "Not covered", "Purely factual"],
        correct_index: 1,
        explanation: "Most modern questions ask for reasoning + application.",
      },
    ];

    const exam = {
      id: crypto.randomUUID(),
      mission_id: body.mission_id,
      block_sequence: body.block_sequence ?? 1,
      title: `${body.topic} — Mini Quiz`,
      questions,
      status: "pending",
      total_questions: questions.length,
      created_at: new Date().toISOString(),
    };

    return new Response(JSON.stringify({ exam }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("mission_exams error", err);
    return new Response(JSON.stringify({ error: err.message ?? "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

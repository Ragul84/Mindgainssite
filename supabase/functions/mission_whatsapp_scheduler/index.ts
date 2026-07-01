import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type SchedulerRequest = {
  mission_id: string;
  event?: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as SchedulerRequest;
    if (!body.mission_id) {
      return new Response(JSON.stringify({ error: "Missing mission_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: mission, error: missionError } = await supabase
      .from("missions")
      .select("id, user_id, title, content_analysis")
      .eq("id", body.mission_id)
      .single();

    if (missionError) throw missionError;

    const { data: whatsapp, error: whatsappError } = await supabase
      .from("user_whatsapp")
      .select("phone_number")
      .eq("user_id", mission.user_id)
      .maybeSingle();

    if (whatsappError) throw whatsappError;

    const phoneNumber = whatsapp?.phone_number;
    if (!phoneNumber) {
      return new Response(
        JSON.stringify({ queued: 0, message: "User not linked to WhatsApp" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const now = new Date();
    const missionMeta = (mission.content_analysis ?? {}) as {
      whatsapp_plan?: Array<{ at_minute: number; type: string }>;
    };

    const messages = (missionMeta.whatsapp_plan ?? []).map((entry) => {
      let text = `Mission update for ${mission.title ?? "your mission"}: `;
      switch (entry.type) {
        case "plan_ready":
          text += "Plan locked. Tap to start!";
          break;
        case "mid_session":
          text += "You're halfway there. Stay focused!";
          break;
        case "mission_complete":
          text += "Session wrapped. Log your reflection.";
          break;
        default:
          text += "Keep pushing!";
      }
      const scheduledAt = new Date(now.getTime() + entry.at_minute * 60 * 1000);
      return {
        to_phone: phoneNumber,
        message_type: "text",
        text,
        status: "queued",
        scheduled_at: scheduledAt.toISOString(),
      };
    }) ?? [];

    if (messages.length === 0) {
      return new Response(JSON.stringify({ queued: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: queueError } = await supabase.from("whatsapp_queue").insert(messages);
    if (queueError) throw queueError;

    return new Response(JSON.stringify({ queued: messages.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("mission_whatsapp_scheduler error", err);
    return new Response(JSON.stringify({ error: err.message ?? "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

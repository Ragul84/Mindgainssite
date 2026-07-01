import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendRequest {
  user_id: string;
  delivery_type: 'pdf' | 'quiz_burst' | 'study_plan';
  payload: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_id, delivery_type, payload } = await req.json() as SendRequest;
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Get User Phone
    const { data: userLink } = await supabaseClient
      .from('user_whatsapp')
      .select('phone_number')
      .eq('user_id', user_id)
      .single();

    if (!userLink || !userLink.phone_number) {
      throw new Error(`User ${user_id} has no linked WhatsApp number.`);
    }

    const phoneNumber = userLink.phone_number;

    // 2. Construct Message Logic (Reusing logic from WhatsAppService.ts but adapted for Edge)
    // NOTE: In production, you'd use the WhatsApp Graph API directly here with fetch()
    
    const WHATSAPP_ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
    const WHATSAPP_PHONE_ID = Deno.env.get('WHATSAPP_PHONE_ID');

    let textBody = "";

    if (delivery_type === 'quiz_burst') {
      textBody = `🎯 *Rapid Fire Quiz: ${payload.topic}*\n\n` +
                 `Get ready! I'm sending ${payload.count} questions now.\n` +
                 `Reply A, B, C, or D to each!\n\n` +
                 `(Sending 1st question...)`;
        // In a real implementation we would loop and send individual question messages
        // For this V1, we send an intro text.
    } else if (delivery_type === 'pdf') {
       textBody = `📚 *Here are your notes on ${payload.topic}!*\n\n` +
                  `Review this summary to lock in the concepts.\n` + 
                  `[Link to PDF would go here]\n\n` +
                  `Let me know when you're done!`;
    } else if (delivery_type === 'study_plan') {
       textBody = `🗓 *Your 1-Day Study Mission*\n\n` +
                  `1. Review Constitution Preamble (10 mins)\n` +
                  `2. Solve 10 MCQs on Polity (20 mins)\n` + 
                  `3. Read Daily News (5 mins)\n\n` +
                  `Go get it! 🚀`;
    }

    // 3. Send Message
    if (WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_ID) {
        // Real Send
        const res = await fetch(`https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: phoneNumber,
                type: 'text',
                text: { body: textBody }
            })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(`WhatsApp API Error: ${JSON.stringify(err)}`);
        }
    } else {
        // Fallback: Log to 'whatsapp_queue' table (as per existing service logic)
        await supabaseClient.from('whatsapp_queue').insert({
            to_phone: phoneNumber,
            text: textBody,
            status: 'queued',
            created_at: new Date().toISOString()
        });
    }

    return new Response(JSON.stringify({ success: true, status: 'queued' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

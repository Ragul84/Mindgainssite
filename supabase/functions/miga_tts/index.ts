import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TTSRequest {
  text: string;
  voice_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { text, voice_id } = await req.json() as TTSRequest;
    if (!text) throw new Error("Text is required");

    // CONFIGURATION
    const HF_API_KEY = Deno.env.get('HUGGINGFACE_API_KEY') || Deno.env.get('HF_API_KEY');
    // Switched to Facebook MMS as the previous Piper endpoint returned 410 Gone
    const PIPER_MODEL = 'facebook/mms-tts-eng'; 

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Check Cache (Generate SHA-256 hash of text + model)
    const msgUint8 = new TextEncoder().encode(text + PIPER_MODEL);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const fileName = `${hashHex}.mp3`; // Saving as mp3 but Piper returns flac/wav usually, we'll handle blob

    // Try to get from storage
    const { data: existingFile } = await supabaseClient
      .storage
      .from('mascot_audio_cache')
      .getPublicUrl(fileName);

    const headResponse = await fetch(existingFile.publicUrl, { method: 'HEAD' });
    if (headResponse.ok) {
        console.log("📍 TTS Cache Hit:", fileName);
        return new Response(JSON.stringify({ url: existingFile.publicUrl, cached: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    // 2. Cache Miss -> Call OpenAI TTS (Stability & Quality)
    // User demand: "ChatGPT/Siri" quality. StreamElements/Google are too robotic.
    console.log("🔥 TTS Cache Miss -> Calling OpenAI (tts-1)");
    
    // Check for OPENAI_API_KEY (support both names)
    const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OPENAI_KEY');
    
    if (!OPENAI_KEY) {
      throw new Error("Missing OPENAI_API_KEY in Edge Function Secrets");
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: "alloy" // Neutral, clear voice good for a mascot
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI TTS Error:", err);
      throw new Error(`OpenAI API Error: ${response.status} ${err}`);
    }

    const audioBlob = await response.blob();

    // 3. Background: Upload to Cache
    (async () => {
        try {
            await supabaseClient.storage.from('mascot_audio_cache').upload(fileName, audioBlob, {
                contentType: 'audio/mpeg',
                upsert: true
            });
            console.log("✅ TTS Cached Successfully:", fileName);
        } catch (e) {
            console.error("❌ TTS Caching Failed:", e);
        }
    })();

    // 4. Return Blob directly
    return new Response(audioBlob, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'X-Cached': 'false'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

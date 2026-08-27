import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type TranslateRequest = {
  kural_number: number;
  target_language_code: string; // e.g. hi-IN
  lang: string; // e.g. hi
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = (await req.json()) as TranslateRequest;
    const authHeader = req.headers.get('Authorization') ?? '';

    if (!body?.kural_number || !body?.target_language_code || !body?.lang) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: base, error: baseError } = await supabaseAdmin
      .from('thirukkural')
      .select('meaning_english, explanation_modern, life_application')
      .eq('kural_number', body.kural_number)
      .maybeSingle();

    if (baseError || !base) {
      return new Response(JSON.stringify({ error: 'Kural not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sarvamKey = Deno.env.get('SARVAM_API_KEY');
    if (!sarvamKey) {
      return new Response(JSON.stringify({ error: 'Missing SARVAM_API_KEY' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const translate = async (text: string) => {
      const res = await fetch('https://api.sarvam.ai/translate', {
        method: 'POST',
        headers: {
          'api-subscription-key': sarvamKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          source_language_code: 'en-IN',
          target_language_code: body.target_language_code,
          model: 'mayura:v1',
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      const payload = await res.json();
      return payload.translated_text || '';
    };

    const [meaning, modern, application] = await Promise.all([
      translate(base.meaning_english),
      translate(base.explanation_modern),
      translate(base.life_application),
    ]);

    const updates: Record<string, string> = {
      [`meaning_${body.lang}`]: meaning,
      [`explanation_modern_${body.lang}`]: modern,
      [`life_application_${body.lang}`]: application,
    };

    const { data: saved, error: saveError } = await supabaseAdmin
      .from('thirukkural')
      .update(updates)
      .eq('kural_number', body.kural_number)
      .select('*')
      .maybeSingle();

    if (saveError) {
      return new Response(JSON.stringify({ error: 'Update failed', details: saveError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: saved, updated: updates }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unexpected error', details: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

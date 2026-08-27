import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type TranslateCacheRequest = {
  kural_number: number;
  target_language_code: string; // e.g. ta-IN, hi-IN
  lang: string; // app language code e.g. ta, hi
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
    const body = (await req.json()) as TranslateCacheRequest;
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

    // 1) Return cached translation if exists
    const { data: cached } = await supabaseAdmin
      .from('thirukkural_translations')
      .select('*')
      .eq('kural_number', body.kural_number)
      .eq('lang', body.lang)
      .maybeSingle();

    if (cached) {
      return new Response(JSON.stringify({ success: true, cached: true, data: cached }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2) Fetch base content from thirukkural table
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

    const insertPayload = {
      kural_number: body.kural_number,
      lang: body.lang,
      meaning,
      explanation_modern: modern,
      life_application: application,
    };

    const { data: saved } = await supabaseAdmin
      .from('thirukkural_translations')
      .upsert(insertPayload, { onConflict: 'kural_number,lang' })
      .select('*')
      .maybeSingle();

    return new Response(JSON.stringify({ success: true, cached: false, data: saved || insertPayload }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unexpected error', details: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

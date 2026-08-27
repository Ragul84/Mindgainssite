import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type PrefillRequest = {
  start_kural: number;
  end_kural: number;
  langs: string[];
};

const LANG_TO_SARVAM: Record<string, string> = {
  hi: 'hi-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
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
    const body = (await req.json()) as PrefillRequest;
    const authHeader = req.headers.get('Authorization') ?? '';
    const apiKeyHeader = req.headers.get('apikey') ?? '';
    const adminKey = req.headers.get('x-admin-key') ?? '';

    if (!body?.start_kural || !body?.end_kural || !body?.langs?.length) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const prefillAdminKey = Deno.env.get('PREFILL_ADMIN_KEY') ?? '';
    const bearerKey = authHeader.replace('Bearer ', '').trim();
    const allowAdmin = (
      (serviceRoleKey && (adminKey === serviceRoleKey || apiKeyHeader === serviceRoleKey || bearerKey === serviceRoleKey)) ||
      (prefillAdminKey && adminKey === prefillAdminKey)
    );

    if (!allowAdmin) {
      const supabaseAuth = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } },
      );

      const { data: userData, error: userError } = await supabaseAuth.auth.getUser();
      if (userError || !userData?.user) {
        return new Response(JSON.stringify({
          error: 'Unauthorized',
          debug: {
            hasPrefillKey: !!prefillAdminKey,
            hasServiceKey: !!serviceRoleKey,
            adminKeyPresent: !!adminKey,
            apiKeyPresent: !!apiKeyHeader,
            authPresent: !!authHeader,
          }
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const sarvamKey = Deno.env.get('SARVAM_API_KEY');
    if (!sarvamKey) {
      return new Response(JSON.stringify({ error: 'Missing SARVAM_API_KEY' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const translate = async (text: string, target: string) => {
      const res = await fetch('https://api.sarvam.ai/translate', {
        method: 'POST',
        headers: {
          'api-subscription-key': sarvamKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          source_language_code: 'en-IN',
          target_language_code: target,
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

    const results: any[] = [];
    const maxBatch = 5;
    const endKural = Math.min(body.end_kural, body.start_kural + maxBatch - 1);

    for (let k = body.start_kural; k <= endKural; k += 1) {
      const { data: base, error: baseError } = await supabaseAdmin
        .from('thirukkural')
        .select('meaning_english, explanation_modern, life_application')
        .eq('kural_number', k)
        .maybeSingle();

      if (baseError || !base) continue;

      const updates: Record<string, string> = {};

      for (const lang of body.langs) {
        const sarvamLang = LANG_TO_SARVAM[lang];
        if (!sarvamLang) continue;

        const [meaning, modern, application] = await Promise.all([
          translate(base.meaning_english, sarvamLang),
          translate(base.explanation_modern, sarvamLang),
          translate(base.life_application, sarvamLang),
        ]);

        updates[`meaning_${lang}`] = meaning;
        updates[`explanation_modern_${lang}`] = modern;
        updates[`life_application_${lang}`] = application;
      }

      if (Object.keys(updates).length) {
        await supabaseAdmin
          .from('thirukkural')
          .update(updates)
          .eq('kural_number', k);
        results.push({ kural_number: k, updated: Object.keys(updates).length });
      }
    }

    return new Response(JSON.stringify({ success: true, results, next_start: endKural + 1, done: endKural >= body.end_kural }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unexpected error', details: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

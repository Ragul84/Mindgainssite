// Supabase Edge Function — WhatsApp Cloud API Webhook
// - Verifies webhook (GET hub.challenge)
// - Handles inbound messages and sends replies via WhatsApp Cloud API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const WABA_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN') || ''
const WABA_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID') || ''
const VERIFY_TOKEN = Deno.env.get('WHATSAPP_VERIFY_TOKEN') || ''
const GROUP_INVITE_URL = Deno.env.get('WHATSAPP_GROUP_INVITE_URL') || ''
const APP_DEEPLINK_BASE = Deno.env.get('APP_DEEPLINK_BASE') || 'mindgains://'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function sendWhatsAppText(to: string, text: string) {
  if (!WABA_TOKEN || !WABA_PHONE_NUMBER_ID) {
    console.warn('WhatsApp credentials missing; skipping send.')
    return { ok: false, skipped: true }
  }
  const url = `https://graph.facebook.com/v19.0/${WABA_PHONE_NUMBER_ID}/messages`
  const body = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: text },
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WABA_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await res.text()
  if (!res.ok) console.error('WhatsApp send error:', res.status, data)
  return { ok: res.ok, data }
}

function deepLink(path: string) {
  // Works with custom scheme (mindgains://) or universal link if configured
  if (APP_DEEPLINK_BASE.endsWith('://')) return `${APP_DEEPLINK_BASE.replace(/\/$/, '')}${path}`
  return `${APP_DEEPLINK_BASE.replace(/\/$/, '')}${path}`
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const url = new URL(req.url)

  // Webhook verification
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode')
    const token = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return new Response(challenge ?? '', { headers: corsHeaders })
    }
    return new Response('Forbidden', { status: 403, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const body = await req.json()
    // Basic WhatsApp webhook shape: entry -> changes -> value -> messages
    const entries = body?.entry || []
    for (const entry of entries) {
      const changes = entry?.changes || []
      for (const change of changes) {
        const value = change?.value
        const messages = value?.messages || []
        for (const msg of messages) {
          const from = msg?.from // user phone
          const type = msg?.type
          let incoming = ''
          if (type === 'text') incoming = (msg?.text?.body || '').trim().toLowerCase()

          // Simple command router
          // Pairing flow: 6-digit code sent by user
          if (/^\d{6}$/.test(incoming)) {
            const code = incoming
            const { data: codeRow } = await supabase
              .from('whatsapp_codes')
              .select('id, user_id, code, expires_at, used_at')
              .eq('code', code)
              .maybeSingle()
            if (!codeRow) {
              await sendWhatsAppText(from, '❌ Invalid or expired code. Open the app to generate a new code.')
              continue
            }
            if (codeRow.used_at || new Date(codeRow.expires_at) < new Date()) {
              await sendWhatsAppText(from, '⌛ Code expired. Please generate a new code from the app.')
              continue
            }
            // Upsert whatsapp_users mapping
            const upsertRes = await supabase
              .from('whatsapp_users')
              .upsert({
                user_id: codeRow.user_id,
                phone: from,
                wa_id: from,
                consent: true,
                last_seen_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }, { onConflict: 'user_id' })
            if (upsertRes.error) {
              console.error('Upsert whatsapp_users error:', upsertRes.error)
            }
            // Mark code used
            await supabase
              .from('whatsapp_codes')
              .update({ used_at: new Date().toISOString() })
              .eq('id', codeRow.id)

            await sendWhatsAppText(
              from,
              GROUP_INVITE_URL
                ? `✅ Paired! You will now receive Daily Dose and updates.\nJoin the official group: ${GROUP_INVITE_URL}`
                : '✅ Paired! You will now receive Daily Dose and updates.'
            )
            continue
          }

          if (incoming.includes('daily')) {
            const link = deepLink('/quiz/daily')
            await sendWhatsAppText(
              from,
              `🧠 Daily Dose is ready!\nTake today’s 3–4 min quiz: ${link}`
            )
            continue
          }

          if (incoming.includes('battle')) {
            const link = deepLink('/battle/matching')
            await sendWhatsAppText(
              from,
              `⚔️ Quick Battle time!\nFind a match here: ${link}`
            )
            continue
          }

          if (incoming.includes('topic') || incoming.includes('subject')) {
            const link = deepLink('/quiz/topic-quiz')
            await sendWhatsAppText(
              from,
              `📚 Practice by subject/topic: ${link}`
            )
            continue
          }

          // Default menu
          await sendWhatsAppText(
            from,
            [
              '👋 Welcome to MindGains! Reply with:',
              '- Send your 6‑digit code to pair',
              '- daily → today’s 3–4 min quiz',
              '- battle → quick match',
              '- topic → practice by subject/topic',
            ].join('\n')
          )
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

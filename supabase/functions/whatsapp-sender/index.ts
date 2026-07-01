// WhatsApp Sender Edge Function
// Processes scheduled WhatsApp jobs and sends via Meta Cloud API
// Triggered by cron or manually

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const WHATSAPP_TOKEN = Deno.env.get('META_WHATSAPP_TOKEN')
const WHATSAPP_PHONE_ID = Deno.env.get('META_WHATSAPP_PHONE_ID')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface WhatsAppJob {
  id: string;
  user_id: string;
  action_type: 'quiz' | 'reminder' | 'flashcard' | 'final_revision_quiz';
  topic?: string;
  content?: any;
  status: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  try {
    // Get pending jobs
    const { data: jobs, error: fetchError } = await supabase
      .from('whatsapp_jobs')
      .select('*, user_profiles!inner(phone_number, display_name)')
      .eq('status', 'pending')
      .limit(10)

    if (fetchError) throw fetchError
    if (!jobs || jobs.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending jobs' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const results = []

    for (const job of jobs as any[]) {
      const phone = job.user_profiles?.phone_number
      const name = job.user_profiles?.display_name || 'there'

      if (!phone) {
        // Mark as failed - no phone number
        await supabase
          .from('whatsapp_jobs')
          .update({ status: 'failed', error: 'No phone number' })
          .eq('id', job.id)
        continue
      }

      let success = false
      let templateName = ''
      let templateParams: any[] = []

      // Determine message content based on action type
      switch (job.action_type) {
        case 'reminder':
          templateName = 'study_reminder'
          templateParams = [{ type: 'text', text: name }]
          break

        case 'quiz':
          templateName = 'quiz_challenge'
          templateParams = [
            { type: 'text', text: name },
            { type: 'text', text: job.topic || 'your subject' }
          ]
          break

        case 'flashcard':
          templateName = 'flashcard_review'
          templateParams = [
            { type: 'text', text: job.content?.question || 'Review this concept' },
            { type: 'text', text: job.content?.answer || 'Open app for answer' }
          ]
          break

        case 'final_revision_quiz':
          templateName = 'final_revision'
          templateParams = [
            { type: 'text', text: name },
            { type: 'text', text: job.topic || 'your exam' }
          ]
          break

        default:
          templateName = 'general_notification'
          templateParams = [{ type: 'text', text: name }]
      }

      // Send via WhatsApp Cloud API
      if (WHATSAPP_TOKEN && WHATSAPP_PHONE_ID) {
        try {
          const response = await fetch(
            `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: phone.replace('+', ''),
                type: 'template',
                template: {
                  name: templateName,
                  language: { code: 'en' },
                  components: templateParams.length > 0 ? [
                    {
                      type: 'body',
                      parameters: templateParams
                    }
                  ] : undefined
                }
              })
            }
          )

          if (response.ok) {
            success = true
          } else {
            const errorData = await response.json()
            console.error('WhatsApp API Error:', errorData)
          }
        } catch (e) {
          console.error('WhatsApp send error:', e)
        }
      } else {
        // Development mode - just log
        console.log(`[DEV] Would send ${job.action_type} to ${phone}`)
        success = true
      }

      // Update job status
      await supabase
        .from('whatsapp_jobs')
        .update({
          status: success ? 'sent' : 'failed',
          sent_at: success ? new Date().toISOString() : null,
        })
        .eq('id', job.id)

      results.push({ id: job.id, success, action_type: job.action_type })
    }

    return new Response(
      JSON.stringify({ processed: results.length, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

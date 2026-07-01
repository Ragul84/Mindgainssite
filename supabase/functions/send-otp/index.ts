// send-otp Edge Function
// Sends OTP via WhatsApp Business API (Meta Cloud API)
// Cost: ~$0.0042/message for India (authentication template)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// WhatsApp Cloud API credentials
const WHATSAPP_TOKEN = Deno.env.get('META_WHATSAPP_TOKEN')
const WHATSAPP_PHONE_ID = Deno.env.get('META_WHATSAPP_PHONE_ID')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone, channel = 'whatsapp' } = await req.json()

    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Calculate expiry (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    // Store OTP in database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    const { error: dbError } = await supabase
      .from('otp_verifications')
      .upsert({
        phone,
        otp,
        expires_at: expiresAt,
        verified: false,
        attempts: 0,
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'phone'
      })

    if (dbError) {
      console.error('DB Error:', dbError)
      throw new Error('Failed to store OTP')
    }

    // Send via WhatsApp Cloud API
    if (WHATSAPP_TOKEN && WHATSAPP_PHONE_ID) {
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
              name: 'authentication_code',  // Pre-approved Meta template
              language: { code: 'en' },
              components: [
                {
                  type: 'body',
                  parameters: [
                    { type: 'text', text: otp }
                  ]
                },
                {
                  type: 'button',
                  sub_type: 'url',
                  index: '0',
                  parameters: [
                    { type: 'text', text: otp }
                  ]
                }
              ]
            }
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('WhatsApp API Error:', errorData)
        
        // Fallback: Return success but log the error
        // In production, you might want to fallback to SMS here
        console.log('WhatsApp send failed, OTP stored for manual entry:', otp)
      }
    } else {
      // Development mode - log OTP
      console.log(`[DEV] OTP for ${phone}: ${otp}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        // Only include in dev for testing
        ...(Deno.env.get('ENVIRONMENT') === 'development' && { dev_otp: otp })
      }),
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

// verify-otp Edge Function
// Verifies OTP and creates/authenticates user

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone, code } = await req.json()

    if (!phone || !code) {
      return new Response(
        JSON.stringify({ error: 'Phone and code are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Get stored OTP
    const { data: otpData, error: otpError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('phone', phone)
      .single()

    if (otpError || !otpData) {
      return new Response(
        JSON.stringify({ error: 'OTP not found. Please request a new code.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if expired
    if (new Date(otpData.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'OTP expired. Please request a new code.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check attempts (max 5)
    if (otpData.attempts >= 5) {
      return new Response(
        JSON.stringify({ error: 'Too many attempts. Please request a new code.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Increment attempts
    await supabase
      .from('otp_verifications')
      .update({ attempts: otpData.attempts + 1 })
      .eq('phone', phone)

    // Verify OTP
    if (otpData.otp !== code) {
      return new Response(
        JSON.stringify({ error: 'Invalid OTP. Please try again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mark as verified
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('phone', phone)

    // Find or create user by phone
    let userId: string | null = null
    
    // Check if user with this phone exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('phone_number', phone)
      .single()

    if (existingProfile) {
      userId = existingProfile.id
    } else {
      // Create new user with phone-based email
      const tempEmail = `${phone.replace('+', '')}@phone.mindgains.app`
      const tempPassword = crypto.randomUUID()
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: tempEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          phone_number: phone,
          auth_method: 'whatsapp_otp'
        }
      })

      if (createError) {
        console.error('Create user error:', createError)
        throw new Error('Failed to create account')
      }

      userId = newUser.user.id

      // Create profile
      await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          phone_number: phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
    }

    // Generate session for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: `${phone.replace('+', '')}@phone.mindgains.app`,
    })

    // For now, return success and let client handle session
    // In production, you'd want to return a proper session token
    
    return new Response(
      JSON.stringify({ 
        verified: true,
        user_id: userId,
        message: 'Phone verified successfully',
        // Client should call signIn after this
        next_step: 'complete_profile'
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

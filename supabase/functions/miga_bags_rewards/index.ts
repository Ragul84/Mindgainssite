import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const BAGS_API_BASE = "https://public-api-v2.bags.fm/api/v1"

serve(async (req) => {
  const { method } = req

  // Handle CORS
  if (method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const bagsApiKey = Deno.env.get('BAGS_API_KEY')
    const { action, userId, address, amount } = await req.json()

    if (action === 'gift') {
      console.log(`[Bags] Processing gift for ${userId} to ${address} amount ${amount}`)
      
      // Verification logic: ensure user exists and has this address
      const { data: profile } = await supabaseClient
        .from('user_profiles')
        .select('bags_address')
        .eq('id', userId)
        .single()

      if (!profile || profile.bags_address !== address) {
        return new Response(JSON.stringify({ error: "Address mismatch" }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // NOTE: This is where we would call Bags API to either:
      // 1. Launch a small reward transaction
      // 2. Add to a "Fee Share" configuration
      // 3. Just log it for batch airdrop
      
      // For now, we'll log it in a rewards table or transaction log
      await supabaseClient.from('user_transactions').insert({
        user_id: userId,
        amount: amount,
        currency_type: 'mg',
        transaction_type: 'bags_reward_triggered',
        metadata: { address, status: 'pending_airdrop' }
      })

      return new Response(JSON.stringify({ success: true, message: "Reward distribution triggered via Bags" }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (action === 'get_stats') {
      // Proxy to Bags Analytics
      const resp = await fetch(`${BAGS_API_BASE}/get-token-lifetime-fees`, {
        headers: { 'x-api-key': bagsApiKey || '' }
      })
      const data = await resp.json()
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

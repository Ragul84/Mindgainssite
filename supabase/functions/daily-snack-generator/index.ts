// 🍪 Daily Snack Generator - MindGains Viral Content Engine
// Generates exam-relevant 30-60 second brain snacks daily
// Following the strategy: Ultra-short, exam-relevant, viral-worthy

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Snack Categories with rotation schedule
const SNACK_CATEGORIES = {
  'monday': { 
    category: '⚡ Power Move', 
    type: 'elimination_hack',
    icon: 'zap',
    color: '#EF4444'
  },
  'tuesday': { 
    category: '📜 History in a Minute', 
    type: 'history_fact',
    icon: 'monument',
    color: '#8B5CF6'
  },
  'wednesday': { 
    category: '🌍 Current Crunch', 
    type: 'current_affairs',
    icon: 'newspaper',
    color: '#10B981'
  },
  'thursday': { 
    category: '🔢 Math in 30 sec', 
    type: 'math_trick',
    icon: 'calculator',
    color: '#F59E0B'
  },
  'friday': { 
    category: '🧠 Memory Hack', 
    type: 'mnemonic',
    icon: 'brain',
    color: '#06B6D4'
  },
  'saturday': { 
    category: '🎯 GK Sniper', 
    type: 'gk_fact',
    icon: 'bullseye',
    color: '#EC4899'
  },
  'sunday': { 
    category: '⚡ Power Move', 
    type: 'speed_trick',
    icon: 'bolt',
    color: '#EF4444'
  }
}

// Viral snack templates following your exact examples
const SNACK_TEMPLATES = {
  elimination_hack: [
    {
      title: "UPSC Elimination Hack: Rule of 2",
      hook_title: "This trick eliminates 50% options instantly ⚡",
      tldr: "In UPSC MCQs, if 2 options are similar but opposite, one is usually correct.",
      bullets: [
        "Look for options that are exact opposites",
        "Example: 'Increasing' vs 'Decreasing' trends",
        "90% of the time, the answer is one of these two",
        "This saves 30+ seconds per question"
      ],
      did_you_know: "UPSC toppers use this trick to solve 20% more questions in the same time!"
    }
  ],
  history_fact: [
    {
      title: "Battle of Plassey: The Ultimate Betrayal",
      hook_title: "One betrayal changed India's 200-year history 📜",
      tldr: "Battle of Plassey (1757) — Clive + Mir Jafar betrayal → British East India Company dominance begins.",
      bullets: [
        "Siraj-ud-Daulah vs British East India Company",
        "Mir Jafar (Siraj's general) was bribed by British",
        "Jafar didn't fight, ensuring British victory",
        "This single battle gave British control over Bengal"
      ],
      did_you_know: "Mir Jafar got ₹24 lakhs (₹2400 crores today) for this betrayal!"
    }
  ],
  current_affairs: [
    {
      title: "RBI Repo Rate Alert: 6.5% (2025)",
      hook_title: "Tomorrow's exam question is hiding here 🌍",
      tldr: "Today's RBI Repo Rate is 6.5% (2025). Expected exam Q: Who decides repo rate? → RBI's Monetary Policy Committee.",
      bullets: [
        "Repo Rate = Rate at which RBI lends to banks",
        "Decided by Monetary Policy Committee (MPC)",
        "6 members: 3 RBI + 3 Government nominees",
        "Meets 6 times per year, impacts entire economy"
      ],
      did_you_know: "Every 0.25% repo rate change affects your EMIs by ₹200-500 per lakh!"
    }
  ],
  math_trick: [
    {
      title: "Multiply by 11: The Lightning Method",
      hook_title: "Calculate 47×11 in 2 seconds (no calculator) 🔢",
      tldr: "Multiply any number by 11: Write digits with sum in middle. Ex: 35 × 11 → 385.",
      bullets: [
        "Step 1: Write the original number (35)",
        "Step 2: Add the digits (3+5=8)",
        "Step 3: Put sum in middle: 3-8-5 = 385",
        "For 47×11: 4+7=11, so 4-11-7 → 517"
      ],
      did_you_know: "This works because 11 = 10+1, so you're adding the number to itself shifted!"
    }
  ],
  mnemonic: [
    {
      title: "Planets Order: Never Forget Again",
      hook_title: "Remember all 8 planets in correct order 🧠",
      tldr: "Planets order mnemonic: 'My Very Educated Mother Just Served Us Noodles' = Mercury → Neptune.",
      bullets: [
        "My = Mercury (closest to Sun)",
        "Very = Venus (hottest planet)",
        "Educated = Earth (our home)",
        "Mother = Mars (red planet)",
        "Just = Jupiter (largest)",
        "Served = Saturn (rings)",
        "Us = Uranus (sideways)",
        "Noodles = Neptune (farthest)"
      ],
      did_you_know: "This mnemonic works in Hindi too: 'Mera Very Educated Mata Ji Sirf Unko Noodles'!"
    }
  ],
  gk_fact: [
    {
      title: "Indian President Powers: The Hidden Truth",
      hook_title: "One fact that appears in every competitive exam 🎯",
      tldr: "President of India can dismiss state governments under Article 356 (President's Rule).",
      bullets: [
        "Article 356 = State emergency provisions",
        "Used when state government can't function",
        "Governor reports to President → President's Rule",
        "State Assembly suspended, Central rule imposed"
      ],
      did_you_know: "President's Rule has been imposed 125+ times since 1950!"
    }
  ]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get today's day for category rotation
    const today = new Date()
    const dayName = today.toLocaleDateString('en-US', { weekday: 'lowercase' })
    const dateStr = today.toISOString().split('T')[0]

    // Check if today's snack already exists
    const { data: existingSnack } = await supabase
      .from('snacks')
      .select('id')
      .eq('created_at::date', dateStr)
      .eq('is_daily_generated', true)
      .single()

    if (existingSnack) {
      return new Response(
        JSON.stringify({ message: 'Today\'s snack already generated', snack_id: existingSnack.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get today's category
    const todayCategory = SNACK_CATEGORIES[dayName as keyof typeof SNACK_CATEGORIES]
    const templates = SNACK_TEMPLATES[todayCategory.type as keyof typeof SNACK_TEMPLATES]
    
    // Select random template from category
    const template = templates[Math.floor(Math.random() * templates.length)]

    // Generate unique slug
    const slug = `daily-${dateStr}-${todayCategory.type}`

    // Create today's snack
    const { data: newSnack, error } = await supabase
      .from('snacks')
      .insert({
        title: template.title,
        slug: slug,
        category: todayCategory.category,
        hook_title: template.hook_title,
        tldr: template.tldr,
        bullets: template.bullets,
        did_you_know: template.did_you_know,
        icon: todayCategory.icon,
        color: todayCategory.color,
        is_active: true,
        is_verified: true,
        is_daily_generated: true,
        reading_time_seconds: Math.floor(Math.random() * 30) + 30, // 30-60 seconds
        exam_relevance: ['UPSC', 'SSC', 'Banking'],
        social_proof: `${Math.floor(Math.random() * 1000) + 500} students mastered this today!`,
        fomo_badge: '🔥 Trending',
        share_count: 0,
        view_count: 0
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Also create a quick quiz for the snack
    await supabase.from('snack_quizzes').insert({
      snack_id: newSnack.id,
      question: `Based on today's snack about ${template.title.toLowerCase()}, which statement is correct?`,
      options: [
        template.bullets[0],
        "This is a distractor option",
        "This is another distractor", 
        template.bullets[1]
      ],
      correct_answer: 0,
      explanation: template.did_you_know || template.tldr
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Daily snack generated successfully!',
        snack: newSnack,
        category: todayCategory.category,
        reading_time: '30-60 seconds'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating daily snack:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

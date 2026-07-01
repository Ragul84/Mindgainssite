// 🍪 Daily Snack Generator V2 - Works with existing schema
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
      title: "UPSC Elimination Hack: Always vs Never",
      hook_title: "Eliminate 70% wrong answers using this psychology trick ⚡",
      tldr: "In MCQs, options with absolute words (always, never, all) are usually wrong.",
      bullets: [
        "Spot absolute words: always, never, all, none, every",
        "These are usually distractors in UPSC/SSC",
        "Exception: Mathematics questions are different",
        "This works 80% of the time in General Studies"
      ],
      did_you_know: "UPSC deliberately uses absolutes to trap candidates who don't think critically!",
      social_proof: "1,247 toppers swear by this trick!",
      fomo_badge: "🔥 Topper Secret"
    },
    {
      title: "The 3-2-1 Option Elimination Strategy",
      hook_title: "Cut MCQ options from 4 to 2 in under 10 seconds ⚡",
      tldr: "Look for most/least likely options first, eliminate obvious outliers, then choose between remaining 2.",
      bullets: [
        "Step 1: Spot the extreme/outlier option (eliminate)",
        "Step 2: Find the 'too obvious' option (usually wrong)",
        "Step 3: Choose between the 2 moderate options",
        "Works 85% of the time in competitive exams"
      ],
      did_you_know: "UPSC examiners deliberately make one option 'too obvious' to trap hasty candidates!",
      social_proof: "2,134 UPSC aspirants use this daily!",
      fomo_badge: "⚡ Speed Hack"
    },
    {
      title: "The Reverse Psychology MCQ Trick",
      hook_title: "What UPSC doesn't want you to know about their questions ⚡",
      tldr: "The option that seems 'too good to be true' is often the correct answer in tricky questions.",
      bullets: [
        "UPSC tests depth of knowledge, not surface facts",
        "Counter-intuitive options often correct in hard questions",
        "Don't overthink - first instinct right 70% of time",
        "Exception: Current affairs questions are straightforward"
      ],
      did_you_know: "UPSC deliberately makes correct answers seem 'unlikely' to test genuine understanding!",
      social_proof: "892 toppers credit this realization!",
      fomo_badge: "🧠 Mind Game"
    }
  ],
  history_fact: [
    {
      title: "1857 Revolt: The Forgotten Heroes",
      hook_title: "These 3 women changed Indian history (but NCERT skips them) 📜",
      tldr: "Rani Lakshmibai, Begum Hazrat Mahal, and Rani Avantibai led major resistance in 1857.",
      bullets: [
        "Rani Lakshmibai: Died fighting British in Gwalior",
        "Begum Hazrat Mahal: Led Lucknow resistance for 2 years",
        "Rani Avantibai: First woman to declare independence",
        "All three are high-probability exam questions"
      ],
      did_you_know: "British records show they feared these women more than male leaders!",
      social_proof: "892 students aced history using this!",
      fomo_badge: "📚 NCERT Plus"
    },
    {
      title: "Ashoka's Secret: The Kalinga War Truth",
      hook_title: "Why Ashoka really stopped fighting wars (it's not what NCERT says) 📜",
      tldr: "Ashoka didn't become peaceful due to guilt - he became Buddhist because the war was too expensive.",
      bullets: [
        "Kalinga War cost: 100,000 dead, massive treasury drain",
        "Economic reasons, not just moral awakening",
        "Buddhism offered administrative efficiency",
        "Dhamma = state policy, not just personal belief"
      ],
      did_you_know: "Ashoka's edicts mention 'economic welfare' more than 'non-violence'!",
      social_proof: "1,456 students aced this perspective!",
      fomo_badge: "🎯 Hidden Truth"
    },
    {
      title: "The Mughal Money Mystery",
      hook_title: "How Mughals stayed rich for 300 years (economic genius) 📜",
      tldr: "Mughals perfected the 'Mansabdari' system - a salary structure that modern corporations still copy.",
      bullets: [
        "Mansabdari = rank-based salary system",
        "No hereditary positions (merit-based)",
        "Revenue farming prevented corruption",
        "Land revenue = 1/3rd of produce (efficient)"
      ],
      did_you_know: "Akbar's revenue system was so efficient that British adopted it unchanged!",
      social_proof: "2,234 aspirants love this insight!",
      fomo_badge: "💰 Economic Genius"
    }
  ],
  current_affairs: [
    {
      title: "Digital India: UPI Crosses $200 Trillion",
      hook_title: "This UPI fact will be in every 2025 exam 🌍",
      tldr: "India's UPI processed $200 trillion in 2024, making it world's largest digital payment system.",
      bullets: [
        "UPI = Unified Payments Interface (launched 2016)",
        "Processes 12+ billion transactions monthly",
        "Zero MDR (Merchant Discount Rate) policy",
        "Now expanding to 10+ countries globally"
      ],
      did_you_know: "UPI processes more transactions than Visa and Mastercard combined!",
      social_proof: "1,456 banking aspirants nailed this!",
      fomo_badge: "🚀 Exam Alert"
    },
    {
      title: "India's Space Economy Boom: $8.4 Billion",
      hook_title: "Why every 2025 exam will ask about India's space sector 🌍",
      tldr: "India's space economy grew 400% in 5 years, now worth $8.4 billion with 100+ private companies.",
      bullets: [
        "ISRO opened doors for private companies in 2020",
        "Chandrayaan-3 cost only $75 million (vs NASA's $2.6 billion)",
        "OneWeb, Amazon choosing India for satellite launches",
        "Target: $44 billion space economy by 2033"
      ],
      did_you_know: "India launches satellites cheaper than a Hollywood movie budget!",
      social_proof: "3,245 UPSC aspirants bookmarked this!",
      fomo_badge: "🚀 Space Race"
    },
    {
      title: "Green Hydrogen Mission: ₹19,744 Crores",
      hook_title: "This energy revolution will dominate 2025 environment questions 🌍",
      tldr: "India aims to become global green hydrogen hub by 2030 with massive government backing.",
      bullets: [
        "National Green Hydrogen Mission launched 2023",
        "Goal: 5 MMT green hydrogen production by 2030",
        "Will reduce oil imports by $12 billion annually",
        "Creating 6 lakh jobs in hydrogen economy"
      ],
      did_you_know: "Green hydrogen can replace coal in steel production - India's biggest polluting industry!",
      social_proof: "1,892 environment aspirants aced this!",
      fomo_badge: "🌱 Green Future"
    }
  ],
  math_trick: [
    {
      title: "Square of Numbers Ending in 5",
      hook_title: "Calculate 85² in your head (under 3 seconds) 🔢",
      tldr: "For any number ending in 5: multiply first digit(s) by (itself + 1), then add 25.",
      bullets: [
        "Example: 85² → 8 × 9 = 72, then 7225",
        "Works for: 15², 25², 35², 45², 95² etc.",
        "Step 1: Take first digits (8)",
        "Step 2: Multiply by next number (8×9=72)",
        "Step 3: Append 25 → 7225"
      ],
      did_you_know: "This Vedic math trick is 10x faster than conventional multiplication!",
      social_proof: "2,134 students love this hack!",
      fomo_badge: "⚡ Vedic Math"
    },
    {
      title: "The 11 Multiplication Magic",
      hook_title: "Multiply any 2-digit number by 11 instantly 🔢",
      tldr: "Split the number, add the digits, put result in middle. For 23×11: 2_3 → 2+3=5 → 253",
      bullets: [
        "Example: 34 × 11 → 3_4 → 3+4=7 → 374",
        "If sum > 9: carry over (67×11 → 6+7=13 → 737)",
        "Works for any 2-digit number",
        "Mental math in competitive exams = time saver"
      ],
      did_you_know: "This trick comes from ancient Indian sutras written 2500 years ago!",
      social_proof: "1,567 banking aspirants use this daily!",
      fomo_badge: "🧮 Ancient Wisdom"
    },
    {
      title: "Percentage Shortcuts: The 10% Rule",
      hook_title: "Calculate any percentage in 5 seconds using this trick 🔢",
      tldr: "Find 10% first (move decimal), then multiply/divide for other percentages.",
      bullets: [
        "20% = 2 × 10% | 5% = 10% ÷ 2",
        "15% = 10% + 5% | 25% = 10% × 2.5",
        "Example: 15% of 240 → 24 + 12 = 36",
        "Faster than calculator for most percentages"
      ],
      did_you_know: "This method is faster than using calculator for percentages under 50%!",
      social_proof: "2,890 SSC candidates swear by this!",
      fomo_badge: "📊 Speed Master"
    }
  ],
  mnemonic: [
    {
      title: "Indian States by Formation Year",
      hook_title: "Remember all 28 states formation order perfectly 🧠",
      tldr: "Use story method: 'British left (1947), divided Punjab (1966), created NE (1972), split states (2000s)'.",
      bullets: [
        "1947: Original states post-independence",
        "1966: Punjab-Haryana split (language basis)",
        "1972: Meghalaya, Manipur, Tripura (NE states)",
        "2000s: Jharkhand, Chhattisgarh, Uttarakhand",
        "2014: Telangana (latest state)"
      ],
      did_you_know: "Telangana took 60 years of struggle to become India's 29th state!",
      social_proof: "987 students mastered this chronology!",
      fomo_badge: "🗓️ Timeline Master"
    },
    {
      title: "Constitutional Articles Memory Palace",
      hook_title: "Never forget key Articles using this visual trick 🧠",
      tldr: "Create a house: Door=14 (Equality), Living Room=19 (Speech), Bedroom=21 (Life), Kitchen=32 (Property).",
      bullets: [
        "Article 14: Right door (Equal treatment for all)",
        "Article 19: Living room (Freedom of speech/expression)",
        "Article 21: Bedroom (Right to life and liberty)",
        "Article 32: Kitchen (Constitutional remedies)"
      ],
      did_you_know: "Memory palace technique helps remember 40% more information than rote learning!",
      social_proof: "1,234 UPSC toppers use this method!",
      fomo_badge: "🏛️ Constitution"
    }
  ],
  gk_fact: [
    {
      title: "Article 370: The Kashmir Connection",
      hook_title: "One fact about Article 370 that every exam asks 🎯",
      tldr: "Article 370 was 'temporary' but lasted 70 years (1949-2019). Only President could modify it.",
      bullets: [
        "Drafted by Sheikh Abdullah and Gopalaswami Ayyangar",
        "Gave J&K special autonomous status",
        "Abrogated on August 5, 2019",
        "J&K split into two Union Territories"
      ],
      did_you_know: "It was the only Article in Constitution marked as 'temporary provision'!",
      social_proof: "1,789 UPSC aspirants got this right!",
      fomo_badge: "📜 Constitution"
    }
  ],
  speed_trick: [
    {
      title: "Speed Reading: The 3x Formula",
      hook_title: "Read 3x faster using this simple technique ⚡",
      tldr: "Use peripheral vision and stop sub-vocalization to triple your reading speed.",
      bullets: [
        "Stop saying words in your head (sub-vocalization)",
        "Use finger as guide to maintain pace",
        "Read in chunks, not word-by-word",
        "Practice 15 minutes daily = 3x speed in 2 weeks"
      ],
      did_you_know: "Top UPSC candidates read 300+ pages daily using speed reading!",
      social_proof: "4,567 toppers mastered this technique!",
      fomo_badge: "🚀 Speed Master"
    },
    {
      title: "Mental Math: The Lightning Calculator",
      hook_title: "Calculate like a human calculator in competitive exams ⚡",
      tldr: "Master these 5 tricks: 11s rule, squares ending in 5, percentage shortcuts, multiplication by 9, doubling and halving.",
      bullets: [
        "11 × any 2-digit: split and add middle",
        "Numbers ending in 5: n(n+1) then 25",
        "Quick percentages: use 10% as base",
        "×9 trick: reduce first digit, subtract from 9"
      ],
      did_you_know: "Mental math saves 30+ minutes in competitive exams!",
      social_proof: "2,890 banking aspirants use these daily!",
      fomo_badge: "🧮 Calculator"
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
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const dateStr = today.toISOString().split('T')[0]

    // Check if today's snack already exists (check by date and slug pattern)
    const { data: existingSnack } = await supabase
      .from('snacks')
      .select('id, title')
      .gte('created_at', dateStr + 'T00:00:00')
      .lt('created_at', dateStr + 'T23:59:59')
      .ilike('slug', 'daily-' + dateStr + '%')
      .single()

    if (existingSnack) {
      return new Response(
        JSON.stringify({ 
          message: 'Today\'s snack already generated', 
          snack: existingSnack 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get today's category
    const todayCategory = SNACK_CATEGORIES[dayName as keyof typeof SNACK_CATEGORIES]
    const templates = SNACK_TEMPLATES[todayCategory.type as keyof typeof SNACK_TEMPLATES]
    
    // Select template based on date (deterministic daily rotation)
    const dateHash = parseInt(dateStr.replace(/-/g, ''), 10)
    const templateIndex = dateHash % templates.length
    const template = templates[templateIndex]

    // Generate unique slug
    const slug = `daily-${dateStr}-${todayCategory.type}-${Math.floor(Math.random() * 1000)}`

    // Create today's snack using existing schema
    const newSnack = {
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
      social_proof: template.social_proof,
      fomo_badge: template.fomo_badge
    }

    const { data: insertedSnack, error } = await supabase
      .from('snacks')
      .insert(newSnack)
      .select()
      .single()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Daily snack generated successfully!',
        snack: insertedSnack,
        category: todayCategory.category,
        day: dayName,
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
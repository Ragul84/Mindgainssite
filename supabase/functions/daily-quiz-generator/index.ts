// Supabase Edge Function for Daily Quiz Generation
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Daily Quiz Generator Edge Function started')
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request body
    const { force = false, admin_trigger = false } = await req.json()
    console.log('📋 Request params:', { force, admin_trigger })

    // Check if quiz already exists for today
    const today = new Date().toISOString().split('T')[0]
    
    if (!force) {
      const { data: existingQuiz } = await supabaseClient
        .from('daily_quizzes')
        .select('*')
        .eq('date', today)
        .eq('is_active', true)
        .single()

      if (existingQuiz) {
        console.log('✅ Quiz already exists for today')
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Quiz already exists for today',
            quiz: existingQuiz
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Generate quiz using AI
    console.log('🤖 Starting AI quiz generation...')
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Default configuration
    const config = {
      total_questions: 20,
      subjects_distribution: {
        "History": 4,
        "Polity": 4,
        "Geography": 3,
        "Economy": 3,
        "Science & Technology": 3,
        "Current Affairs": 3
      },
      difficulty_distribution: {
        "easy": 6,
        "medium": 10,
        "hard": 4
      },
      exam_focus: 'mixed'
    }

    // Create prompt
    const subjectList = Object.entries(config.subjects_distribution)
      .map(([subject, count]) => `${subject}: ${count} questions`)
      .join('\n')
      
    const difficultyList = Object.entries(config.difficulty_distribution)
      .map(([difficulty, count]) => `${difficulty}: ${count} questions`)
      .join(', ')

    const prompt = `Generate exactly ${config.total_questions} high-quality multiple-choice questions for Indian competitive exams (UPSC, SSC, TNPSC, Banking).

SUBJECT DISTRIBUTION:
${subjectList}

DIFFICULTY: ${difficultyList}

EXAM FOCUS: ${config.exam_focus.toUpperCase()}

Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Detailed explanation",
      "subject": "Subject name from list above",
      "subtopic": "Specific subtopic",
      "difficulty": "easy|medium|hard",
      "points": 5
    }
  ]
}`

    // Call OpenAI API
    console.log('📡 Calling OpenAI API...')
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in Indian competitive exams. Generate high-quality questions for UPSC, SSC, Banking preparation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 8000,
        response_format: { type: "json_object" }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ OpenAI API error:', response.status, errorText)
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
    }

    const aiResponse = await response.json()
    const content = JSON.parse(aiResponse.choices[0].message.content)
    
    if (!content.questions || !Array.isArray(content.questions)) {
      throw new Error('Invalid questions format from OpenAI')
    }

    console.log('✅ AI generated', content.questions.length, 'questions')

    // Create quiz object
    const quiz = {
      date: today,
      title: `Daily Quiz - ${new Date().toLocaleDateString()}`,
      description: `Today's comprehensive quiz covering ${Object.keys(config.subjects_distribution).join(', ')} for competitive exam preparation.`,
      questions: content.questions,
      total_questions: content.questions.length,
      exam_types: ['UPSC', 'SSC', 'State PCS', 'Banking'],
      subjects_covered: [...new Set(content.questions.map((q: any) => q.subject))],
      difficulty_stats: {
        easy: content.questions.filter((q: any) => q.difficulty === 'easy').length,
        medium: content.questions.filter((q: any) => q.difficulty === 'medium').length,
        hard: content.questions.filter((q: any) => q.difficulty === 'hard').length
      },
      is_active: true
    }

    // Save to database using the same RPC function as admin dashboard
    console.log('💾 Saving quiz to database using admin RPC...')
    const { data: savedQuizId, error: insertError } = await supabaseClient.rpc('save_generated_daily_quiz', {
      p_date: today,
      p_title: quiz.title,
      p_description: quiz.description,
      p_questions: quiz.questions,
      p_total_questions: quiz.total_questions,
      p_exam_types: quiz.exam_types,
      p_subjects_covered: quiz.subjects_covered,
      p_difficulty_stats: quiz.difficulty_stats
    });

    if (insertError) {
      console.error('❌ Database save error:', insertError)
      throw new Error(`Database save failed: ${insertError.message}`)
    }

    console.log('✅ Quiz saved successfully!')

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Daily quiz generated successfully',
        quiz_id: savedQuizId,
        generation_method: 'openai_edge_function',
        usage: aiResponse.usage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Edge function error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to generate daily quiz'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
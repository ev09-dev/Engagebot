import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { commentId } = await request.json()

    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 })
    }

    // Fetch comment and user's tone profile
    const [commentRes, toneRes] = await Promise.all([
      supabase.from('comments').select('*').eq('id', commentId).single(),
      supabase.from('tone_profiles').select('*').eq('user_id', user.id).single()
    ])

    if (commentRes.error) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    const comment = commentRes.data
    const toneProfile = toneRes.data || {
      tone: 'friendly and helpful',
      formality: 50,
      emoji_usage: 50,
      response_length: 'medium'
    }

    // Generate AI response (mock implementation)
    const response = await generateAIResponse(comment, toneProfile)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error generating response:', error)
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}

async function generateAIResponse(comment: any, toneProfile: any): Promise<string> {
  const toneDescription = toneProfile.tone || 'friendly and helpful'
  const formalityLevel = toneProfile.formality || 50
  const emojiUsage = toneProfile.emoji_usage || 50
  const responseLength = toneProfile.response_length || 'medium'

  const prompt = `
    Generate a response to the following comment. The response should be ${toneDescription}.
    Comment: "${comment.content}"
    Comment author: ${comment.author_username}
    Platform: ${comment.platform}
    
    Guidelines:
    - Formality level: ${formalityLevel}/100 (0 = very casual, 100 = very formal)
    - Emoji usage: ${emojiUsage}/100 (0 = minimal, 100 = frequent)
    - Response length: ${responseLength}
    
    Generate a natural, engaging response that matches the specified tone.
  `

  // Mock AI response - in reality, this would call the AI service
  const mockResponses = [
    `Thank you so much for your kind words! 😊 We really appreciate your support!`,
    `Hey there! Thanks for taking the time to comment - it means a lot to us! 💜`,
    `We're so glad you enjoyed this! Your feedback is super valuable to us! 🙌`,
    `Thanks for being part of our community! We love hearing from you! ✨`,
    `This made our day! Thank you for your amazing comment! 💫`
  ]

  // Select response based on tone profile
  let response = mockResponses[Math.floor(Math.random() * mockResponses.length)]

  // Adjust based on formality
  if (formalityLevel > 70) {
    response = response.replace(/!/g, '.').replace(/😊|💜|🙌|✨|💫/g, '')
  }

  // Adjust based on emoji usage
  if (emojiUsage < 30) {
    response = response.replace(/[😊💜🙌✨💫]/g, '')
  }

  return response
}
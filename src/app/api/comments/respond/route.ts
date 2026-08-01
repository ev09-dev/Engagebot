import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { commentId, response } = await request.json()

    if (!commentId || !response) {
      return NextResponse.json({ error: 'Comment ID and response are required' }, { status: 400 })
    }

    // Store the response
    const { error } = await supabase
      .from('comment_responses')
      .insert({
        comment_id: commentId,
        user_id: user.id,
        response,
        created_at: new Date().toISOString(),
      })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending response:', error)
    return NextResponse.json({ error: 'Failed to send response' }, { status: 500 })
  }
}
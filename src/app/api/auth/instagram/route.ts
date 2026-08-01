import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const instagramAppId = process.env.INSTAGRAM_APP_ID
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI

    if (!instagramAppId || !redirectUri) {
      return NextResponse.json(
        { error: 'Instagram OAuth not configured' },
        { status: 500 }
      )
    }

    const state = Math.random().toString(36).substring(7)
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${instagramAppId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code&state=${state}`

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Error initiating Instagram OAuth:', error)
    return NextResponse.json(
      { error: 'Failed to initiate Instagram OAuth' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      return NextResponse.redirect(new URL('/auth/signin?error=instagram_failed', request.url))
    }

    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID!,
        client_secret: process.env.INSTAGRAM_APP_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
        code,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    const userId = tokenData.user_id

    // Get user profile
    const profileResponse = await fetch(
      `https://graph.instagram.com/${userId}?fields=username,account_type&access_token=${accessToken}`
    )

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch Instagram profile')
    }

    const profileData = await profileResponse.json()

    // Store account in database (you'll need to implement this)
    // For now, redirect to dashboard with success
    return NextResponse.redirect(new URL('/dashboard?instagram_connected=true', request.url))
  } catch (error) {
    console.error('Error handling Instagram callback:', error)
    return NextResponse.redirect(new URL('/auth/signin?error=instagram_failed', request.url))
  }
}
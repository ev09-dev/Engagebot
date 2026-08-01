import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const tiktokClientId = process.env.TIKTOK_CLIENT_KEY
    const redirectUri = process.env.TIKTOK_REDIRECT_URI

    if (!tiktokClientId || !redirectUri) {
      return NextResponse.json(
        { error: 'TikTok OAuth not configured' },
        { status: 500 }
      )
    }

    const state = Math.random().toString(36).substring(7)
    const authUrl = `https://www.tiktok.com/v2/auth/authorize?client_key=${tiktokClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user.info.basic,video.list&response_type=code&state=${state}`

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Error initiating TikTok OAuth:', error)
    return NextResponse.json(
      { error: 'Failed to initiate TikTok OAuth' },
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
      return NextResponse.redirect(new URL('/auth/signin?error=tiktok_failed', request.url))
    }

    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    const openId = tokenData.open_id

    // Get user profile
    const profileResponse = await fetch(
      `https://open.tiktokapis.com/v2/user/info/?fields=display_name,username&access_token=${accessToken}&open_id=${openId}`
    )

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch TikTok profile')
    }

    const profileData = await profileResponse.json()

    // Store account in database (you'll need to implement this)
    // For now, redirect to dashboard with success
    return NextResponse.redirect(new URL('/dashboard?tiktok_connected=true', request.url))
  } catch (error) {
    console.error('Error handling TikTok callback:', error)
    return NextResponse.redirect(new URL('/auth/signin?error=tiktok_failed', request.url))
  }
}
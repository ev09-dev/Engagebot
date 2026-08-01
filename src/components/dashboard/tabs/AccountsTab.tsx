'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Instagram, MessageCircle, Link as LinkIcon, Trash2 } from 'lucide-react'

interface SocialAccount {
  id: string
  platform: 'instagram' | 'tiktok'
  username: string
  connected_at: string
  user_id: string
}

export function AccountsTab() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<'instagram' | 'tiktok' | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchAccounts()
  }, [user])

  const fetchAccounts = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      setAccounts(data || [])
    } catch (error) {
      console.error('Error fetching accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const connectInstagram = async () => {
    setConnecting('instagram')
    try {
      const response = await fetch('/api/auth/instagram', {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to initiate Instagram OAuth')

      const data = await response.json()
      window.location.href = data.authUrl
    } catch (error) {
      console.error('Error connecting Instagram:', error)
    } finally {
      setConnecting(null)
    }
  }

  const connectTikTok = async () => {
    setConnecting('tiktok')
    try {
      const response = await fetch('/api/auth/tiktok', {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to initiate TikTok OAuth')

      const data = await response.json()
      window.location.href = data.authUrl
    } catch (error) {
      console.error('Error connecting TikTok:', error)
    } finally {
      setConnecting(null)
    }
  }

  const disconnectAccount = async (accountId: string) => {
    try {
      const response = await fetch(`/api/social-accounts/${accountId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to disconnect account')

      setAccounts(accounts.filter(account => account.id !== accountId))
    } catch (error) {
      console.error('Error disconnecting account:', error)
    }
  }

  const getPlatformIcon = (platform: 'instagram' | 'tiktok') => {
    return platform === 'instagram' ? (
      <Instagram size={24} className="text-pink-500" />
    ) : (
      <MessageCircle size={24} className="text-black" />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FA1FF]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <Instagram size={32} className="text-pink-500" />
            <div>
              <h3 className="text-xl font-bold text-gray-800">Instagram</h3>
              <p className="text-sm text-gray-600">Connect your Instagram account</p>
            </div>
          </div>
          {accounts.find(a => a.platform === 'instagram') ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">
                  @{accounts.find(a => a.platform === 'instagram')?.username}
                </p>
                <p className="text-sm text-gray-600">
                  Connected on {new Date(accounts.find(a => a.platform === 'instagram')?.connected_at || '').toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => disconnectAccount(accounts.find(a => a.platform === 'instagram')?.id || '')}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={connectInstagram}
              disabled={connecting === 'instagram'}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#9FA1FF] text-white rounded-lg hover:bg-[#8A8CE8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LinkIcon size={20} />
              {connecting === 'instagram' ? 'Connecting...' : 'Connect Instagram'}
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <MessageCircle size={32} className="text-black" />
            <div>
              <h3 className="text-xl font-bold text-gray-800">TikTok</h3>
              <p className="text-sm text-gray-600">Connect your TikTok account</p>
            </div>
          </div>
          {accounts.find(a => a.platform === 'tiktok') ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">
                  @{accounts.find(a => a.platform === 'tiktok')?.username}
                </p>
                <p className="text-sm text-gray-600">
                  Connected on {new Date(accounts.find(a => a.platform === 'tiktok')?.connected_at || '').toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => disconnectAccount(accounts.find(a => a.platform === 'tiktok')?.id || '')}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={connectTikTok}
              disabled={connecting === 'tiktok'}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#AEE2FF] text-gray-800 rounded-lg hover:bg-[#99CDEE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LinkIcon size={20} />
              {connecting === 'tiktok' ? 'Connecting...' : 'Connect TikTok'}
            </button>
          )}
        </div>
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
          <p className="text-gray-500 mb-4">No social accounts connected yet</p>
          <p className="text-sm text-gray-400">Connect your Instagram and TikTok accounts to start managing your comments</p>
        </div>
      )}
    </div>
  )
}
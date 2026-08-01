'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { MessageSquare, Sparkles, TrendingUp } from 'lucide-react'

export function AnalyticsTab() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalComments: 0,
    respondedComments: 0,
    aiSuggestionsUsed: 0,
    spamFiltered: 0,
  })
  const { user } = useAuth()

  useEffect(() => {
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    if (!user) return

    setLoading(true)
    try {
      const [commentsRes, responsesRes, spamRes] = await Promise.all([
        supabase.from('comments').select('id').eq('user_id', user.id),
        supabase.from('comment_responses').select('id').eq('user_id', user.id),
        supabase.from('comments').select('id').eq('user_id', user.id).eq('is_spam', true),
      ])

      setStats({
        totalComments: commentsRes.data?.length || 0,
        respondedComments: responsesRes.data?.length || 0,
        aiSuggestionsUsed: responsesRes.data?.length || 0,
        spamFiltered: spamRes.data?.length || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="text-[#9FA1FF]" size={24} />
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.totalComments}</h3>
          <p className="text-sm text-gray-600 mt-2">Comments received</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Sparkles className="text-[#AEE2FF]" size={24} />
            <span className="text-sm text-gray-500">Responded</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.respondedComments}</h3>
          <p className="text-sm text-gray-600 mt-2">Comments replied to</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="text-[#D9F9DF]" size={24} />
            <span className="text-sm text-gray-500">AI Used</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.aiSuggestionsUsed}</h3>
          <p className="text-sm text-gray-600 mt-2">AI suggestions used</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xs">!</span>
            </div>
            <span className="text-sm text-gray-500">Spam</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.spamFiltered}</h3>
          <p className="text-sm text-gray-600 mt-2">Spam comments filtered</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Engagement Overview</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Response Rate</span>
              <span className="text-sm font-medium text-gray-800">
                {stats.totalComments > 0
                  ? Math.round((stats.respondedComments / stats.totalComments) * 100)
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#9FA1FF] h-2 rounded-full transition-all"
                style={{
                  width: `${stats.totalComments > 0
                    ? (stats.respondedComments / stats.totalComments) * 100
                    : 0}%`
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">AI Adoption Rate</span>
              <span className="text-sm font-medium text-gray-800">
                {stats.respondedComments > 0
                  ? Math.round((stats.aiSuggestionsUsed / stats.respondedComments) * 100)
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#AEE2FF] h-2 rounded-full transition-all"
                style={{
                  width: `${stats.respondedComments > 0
                    ? (stats.aiSuggestionsUsed / stats.respondedComments) * 100
                    : 0}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import CommentCard from '@/components/dashboard/CommentCard'

interface Comment {
  id: string
  content: string
  author_username: string
  platform: 'instagram' | 'tiktok'
  created_at: string
  relevance_score: number
  is_spam: boolean
  user_id: string
}

export function CommentsTab() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'instagram' | 'tiktok'>('all')
  const { user } = useAuth()

  useEffect(() => {
    fetchComments()
  }, [user, filter])

  const fetchComments = async () => {
    if (!user) return

    setLoading(true)
    try {
      let query = supabase
        .from('comments')
        .select('*')
        .eq('user_id', user.id)
        .order('relevance_score', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('platform', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResponseGenerated = (commentId: string) => {
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, relevance_score: comment.relevance_score + 0.1 }
        : comment
    ))
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
      <div className="flex items-center gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-[#9FA1FF] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Comments
        </button>
        <button
          onClick={() => setFilter('instagram')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'instagram'
              ? 'bg-[#9FA1FF] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Instagram
        </button>
        <button
          onClick={() => setFilter('tiktok')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'tiktok'
              ? 'bg-[#9FA1FF] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          TikTok
        </button>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No comments yet. Connect your social accounts to start receiving comments.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onResponseGenerated={handleResponseGenerated}
            />
          ))}
        </div>
      )}
    </div>
  )
}
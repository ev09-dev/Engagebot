'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Instagram, MessageCircle, Trash2, Sparkles } from 'lucide-react'

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

interface CommentCardProps {
  comment: Comment
  onResponseGenerated: (commentId: string) => void
}

export default function CommentCard({ comment, onResponseGenerated }: CommentCardProps) {
  const [response, setResponse] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const { user } = useAuth()

  const generateResponse = async () => {
    if (!user) return

    setIsGenerating(true)
    try {
      const res = await fetch('/api/ai/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId: comment.id,
        }),
      })

      if (!res.ok) throw new Error('Failed to generate response')

      const data = await res.json()
      setResponse(data.response)
    } catch (error) {
      console.error('Error generating response:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const sendResponse = async () => {
    if (!user || !response) return

    setIsSending(true)
    try {
      const res = await fetch('/api/comments/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId: comment.id,
          response,
        }),
      })

      if (!res.ok) throw new Error('Failed to send response')

      onResponseGenerated(comment.id)
      setResponse('')
    } catch (error) {
      console.error('Error sending response:', error)
    } finally {
      setIsSending(false)
    }
  }

  const markAsSpam = async () => {
    if (!user) return

    try {
      const res = await fetch('/api/comments/spam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId: comment.id,
        }),
      })

      if (!res.ok) throw new Error('Failed to mark as spam')
    } catch (error) {
      console.error('Error marking as spam:', error)
    }
  }

  const getPlatformIcon = () => {
    return comment.platform === 'instagram' ? (
      <Instagram size={16} className="text-pink-500" />
    ) : (
      <MessageCircle size={16} className="text-black" />
    )
  }

  const getRelevanceColor = () => {
    if (comment.relevance_score >= 0.8) return 'text-green-600'
    if (comment.relevance_score >= 0.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#AEE2FF] rounded-full flex items-center justify-center">
            {getPlatformIcon()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">@{comment.author_username}</p>
            <p className="text-sm text-gray-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${getRelevanceColor()}`}>
            Relevance: {Math.round(comment.relevance_score * 100)}%
          </span>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{comment.content}</p>

      {!response ? (
        <div className="flex gap-2">
          <button
            onClick={generateResponse}
            disabled={!user || isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-[#9FA1FF] text-white rounded-lg hover:bg-[#8A8CE8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={16} />
            {isGenerating ? 'Generating...' : 'Generate Response'}
          </button>
          <button
            onClick={markAsSpam}
            disabled={!user}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            Mark as Spam
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FA1FF] resize-none"
            rows={3}
            placeholder="Edit the AI-generated response..."
          />
          <div className="flex gap-2">
            <button
              onClick={sendResponse}
              disabled={isSending}
              className="flex-1 px-4 py-2 bg-[#D9F9DF] text-green-700 rounded-lg hover:bg-[#C8E8D0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Sending...' : 'Send Response'}
            </button>
            <button
              onClick={() => setResponse('')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
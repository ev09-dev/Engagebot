'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Sparkles, Save } from 'lucide-react'

interface ToneProfile {
  id: string
  user_id: string
  tone: string
  formality: number
  emoji_usage: number
  response_length: string
  created_at: string
}

export function ToneTab() {
  const [toneProfile, setToneProfile] = useState<Partial<ToneProfile>>({
    tone: '',
    formality: 50,
    emoji_usage: 50,
    response_length: 'medium',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchToneProfile()
  }, [user])

  const fetchToneProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('tone_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setToneProfile(data)
      }
    } catch (error) {
      console.error('Error fetching tone profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveToneProfile = async () => {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('tone_profiles')
        .upsert({
          user_id: user.id,
          tone: toneProfile.tone,
          formality: toneProfile.formality,
          emoji_usage: toneProfile.emoji_usage,
          response_length: toneProfile.response_length,
        })

      if (error) throw error

      alert('Tone profile saved successfully!')
    } catch (error) {
      console.error('Error saving tone profile:', error)
      alert('Failed to save tone profile')
    } finally {
      setSaving(false)
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
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-[#9FA1FF]" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Voice Tone Calibration</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your communication style
            </label>
            <textarea
              value={toneProfile.tone}
              onChange={(e) => setToneProfile({ ...toneProfile, tone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FA1FF] resize-none"
              rows={4}
              placeholder="e.g., Friendly and casual, professional but approachable, enthusiastic and energetic..."
            />
            <p className="text-sm text-gray-500 mt-2">
              This helps the AI generate responses that match your natural voice
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formality Level: {toneProfile.formality}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={toneProfile.formality}
              onChange={(e) => setToneProfile({ ...toneProfile, formality: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#9FA1FF]"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Casual</span>
              <span>Formal</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emoji Usage: {toneProfile.emoji_usage}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={toneProfile.emoji_usage}
              onChange={(e) => setToneProfile({ ...toneProfile, emoji_usage: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#AEE2FF]"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Minimal</span>
              <span>Frequent</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Length
            </label>
            <select
              value={toneProfile.response_length}
              onChange={(e) => setToneProfile({ ...toneProfile, response_length: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FA1FF]"
            >
              <option value="short">Short (1-2 sentences)</option>
              <option value="medium">Medium (2-3 sentences)</option>
              <option value="long">Long (3+ sentences)</option>
            </select>
          </div>

          <button
            onClick={saveToneProfile}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#9FA1FF] text-white rounded-lg hover:bg-[#8A8CE8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Tone Profile'}
          </button>
        </div>
      </div>

      <div className="bg-[#D9F9DF] rounded-lg p-6 border border-green-200">
        <h4 className="font-semibold text-green-800 mb-2">💡 Tips for Better AI Responses</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Be specific about your communication style</li>
          <li>• Include examples of how you typically respond</li>
          <li>• Mention any phrases or words you frequently use</li>
          <li>• Describe your relationship with your audience</li>
        </ul>
      </div>
    </div>
  )
}
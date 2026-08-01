'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Mail, Calendar, Save } from 'lucide-react'

interface AutomationSettings {
  id: string
  user_id: string
  welcome_dm_enabled: boolean
  welcome_dm_message: string
  weekly_report_enabled: boolean
  weekly_report_day: string
  created_at: string
}

export function AutomationTab() {
  const [settings, setSettings] = useState<Partial<AutomationSettings>>({
    welcome_dm_enabled: false,
    welcome_dm_message: '',
    weekly_report_enabled: false,
    weekly_report_day: 'monday',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchSettings()
  }, [user])

  const fetchSettings = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('automation_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching automation settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('automation_settings')
        .upsert({
          user_id: user.id,
          welcome_dm_enabled: settings.welcome_dm_enabled,
          welcome_dm_message: settings.welcome_dm_message,
          weekly_report_enabled: settings.weekly_report_enabled,
          weekly_report_day: settings.weekly_report_day,
        })

      if (error) throw error

      alert('Automation settings saved successfully!')
    } catch (error) {
      console.error('Error saving automation settings:', error)
      alert('Failed to save automation settings')
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
          <Mail className="text-[#9FA1FF]" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Welcome DM</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">Automatic Welcome DM</h4>
              <p className="text-sm text-gray-600">Send a welcome message to new followers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.welcome_dm_enabled}
                onChange={(e) => setSettings({ ...settings, welcome_dm_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#9FA1FF] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9FA1FF]"></div>
            </label>
          </div>

          {settings.welcome_dm_enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Welcome Message
              </label>
              <textarea
                value={settings.welcome_dm_message}
                onChange={(e) => setSettings({ ...settings, welcome_dm_message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FA1FF] resize-none"
                rows={4}
                placeholder="Thanks for following! I'm excited to connect with you..."
              />
              <p className="text-sm text-gray-500 mt-2">
                This message will be sent automatically to new followers
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-[#AEE2FF]" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Weekly Reports</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">Weekly Email Reports</h4>
              <p className="text-sm text-gray-600">Receive weekly engagement analytics via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.weekly_report_enabled}
                onChange={(e) => setSettings({ ...settings, weekly_report_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#AEE2FF] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#AEE2FF]"></div>
            </label>
          </div>

          {settings.weekly_report_enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Day
              </label>
              <select
                value={settings.weekly_report_day}
                onChange={(e) => setSettings({ ...settings, weekly_report_day: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FA1FF]"
              >
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">
                Choose which day you'd like to receive your weekly report
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={saveSettings}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#9FA1FF] text-white rounded-lg hover:bg-[#8A8CE8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save size={20} />
        {saving ? 'Saving...' : 'Save Automation Settings'}
      </button>
    </div>
  )
}
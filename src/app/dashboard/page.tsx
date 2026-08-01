'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { MainContent } from '@/components/dashboard/MainContent'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('comments')
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FA1FF]"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={() => {
          // Sign out logic will be handled by AuthContext
          router.push('/')
        }}
      />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <MainContent activeTab={activeTab} />
      </div>
    </div>
  )
}
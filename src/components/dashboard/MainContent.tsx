'use client'

import { CommentsTab } from './tabs/CommentsTab'
import { AnalyticsTab } from './tabs/AnalyticsTab'
import { AccountsTab } from './tabs/AccountsTab'
import { ToneTab } from './tabs/ToneTab'
import { AutomationTab } from './tabs/AutomationTab'

interface MainContentProps {
  activeTab: string
}

export function MainContent({ activeTab }: MainContentProps) {
  const renderTab = () => {
    switch (activeTab) {
      case 'comments':
        return <CommentsTab />
      case 'analytics':
        return <AnalyticsTab />
      case 'accounts':
        return <AccountsTab />
      case 'tone':
        return <ToneTab />
      case 'automation':
        return <AutomationTab />
      default:
        return <CommentsTab />
    }
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {renderTab()}
      </div>
    </div>
  )
}
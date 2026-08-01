'use client'

import { User } from 'lucide-react'

interface HeaderProps {
  user: {
    id: string
    email: string
  }
}

export function Header({ user }: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-600">Welcome back, {user.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#9FA1FF] rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
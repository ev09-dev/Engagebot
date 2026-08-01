'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import SignIn from '@/components/auth/SignIn'

export default function SignInPage() {
  return (
    <AuthProvider>
      <SignIn />
    </AuthProvider>
  )
}
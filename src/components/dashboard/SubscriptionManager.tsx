'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Check, CreditCard } from 'lucide-react'

interface Price {
  id: string
  name: string
  price: number
  features: string[]
}

interface SubscriptionManagerProps {
  currentTier?: string
}

export function SubscriptionManager({ currentTier = 'free' }: SubscriptionManagerProps) {
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const PRICES: Price[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        'Up to 50 comments per month',
        'Basic spam filtering',
        'AI response suggestions',
        'Email support',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      features: [
        'Up to 500 comments per month',
        'Advanced spam filtering',
        'Priority AI responses',
        'Welcome DM automation',
        'Weekly reports',
        'Priority support',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      features: [
        'Unlimited comments',
        'Premium spam filtering',
        'Custom AI training',
        'Advanced automation',
        'Daily reports',
        'Dedicated support',
        'API access',
      ],
    },
  ]

  const handleSubscribe = async (priceId: string) => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
        }),
      })

      if (!response.ok) throw new Error('Failed to create checkout session')

      const data = await response.json()
      window.location.href = data.url
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to create checkout session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Plan</h3>
        <p className="text-gray-600">Select the plan that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRICES.map((price) => (
          <div
            key={price.id}
            className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all ${
              currentTier === price.id
                ? 'border-[#9FA1FF] ring-2 ring-[#9FA1FF]'
                : 'border-gray-200 hover:border-[#9FA1FF]'
            }`}
          >
            <div className="text-center mb-6">
              <h4 className="text-xl font-bold text-gray-800 mb-2">{price.name}</h4>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-gray-800">${price.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {price.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(price.id)}
              disabled={loading || currentTier === price.id}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                currentTier === price.id
                  ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                  : 'bg-[#9FA1FF] text-white hover:bg-[#8A8CE8]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Processing...' : currentTier === price.id ? 'Current Plan' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-[#D9F9DF] rounded-lg p-6 border border-green-200">
        <div className="flex items-start gap-3">
          <CreditCard className="text-green-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-semibold text-green-800 mb-2">Secure Payment</h4>
            <p className="text-sm text-green-700">
              Your payment information is secure. We use Stripe for payment processing and never store your card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
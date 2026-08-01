'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0">
            <span className="fixed left-0 top-0 flex h-48 w-full items-center justify-center bg-gradient-to-b from-white via-white to-transparent dark:from-black dark:via-black lg:static lg:bg-transparent">
              <span className="font-bold text-2xl">EngageBot</span>
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <div className="relative dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <h1 className="text-6xl font-bold text-center mb-8">
            Smart Engagement for Content Creators
          </h1>
          <p className="text-xl text-center mb-12 max-w-2xl mx-auto">
            Centralize comments from Instagram and TikTok, prioritize relevant ones, and get AI-powered response suggestions in your own voice.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="px-8 py-4 bg-[#9FA1FF] text-white rounded-lg font-semibold hover:bg-[#8A8CE8] transition-colors"
            >
              Get Started
            </Link>
            <Link 
              href="/auth/signin" 
              className="px-8 py-4 bg-[#AEE2FF] text-gray-800 rounded-lg font-semibold hover:bg-[#99CDEE] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Unified Feed{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              {'->'}
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            All comments from Instagram and TikTok in one place, ordered by relevance.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            AI Responses{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              {'->'}
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Get personalized response suggestions in your own voice tone.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Smart Filters{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              {'->'}
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Automatic spam detection and priority-based comment management.
          </p>
        </div>
      </div>
    </main>
  )
}
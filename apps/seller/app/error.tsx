'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <p className="text-6xl mb-6">⚠️</p>
      <h2 className="font-display font-bold text-2xl text-[#2A1F14] mb-2">Something went wrong</h2>
      <p className="text-[#2A1F14]/50 text-sm max-w-xs leading-relaxed mb-8">
        Don&apos;t worry — your products and orders are safe. Please try again.
      </p>
      <button
        onClick={reset}
        className="bg-[#E27D60] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#c85c3a] transition-colors"
      >
        Try again
      </button>
    </div>
  )
}

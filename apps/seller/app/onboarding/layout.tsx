import type { Metadata } from 'next'
import '../globals.css'


export const metadata: Metadata = {
  title: 'HunarmandAI — Get Started',
}

// Onboarding uses its own layout (no sidebar/nav)
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4ede3] flex flex-col">
      {children}
    </div>
  )
}

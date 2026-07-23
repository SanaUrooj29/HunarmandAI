import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function OnboardingWelcomePage() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-8 max-w-sm mx-auto text-center">
      {/* Spacer */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Logo mark */}
        <div className="w-20 h-20 bg-[#E27D60] rounded-[28px] flex items-center justify-center shadow-xl shadow-[#E27D60]/30">
          <Sparkles size={36} className="text-white" />
        </div>

        <div>
          <h1 className="font-display font-bold text-4xl text-[#2A1F14]">HunarmandAI</h1>
          <p className="text-[#2A1F14]/60 mt-3 leading-relaxed text-base">
            Turn your craft into income — list a product in 10 seconds with a single photo.
          </p>
        </div>

        {/* Hero illustration */}
        <div className="w-64 h-64 bg-[#E27D60] rounded-3xl flex items-center justify-center shadow-lg shadow-[#E27D60]/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E27D60] to-[#c85c3a]" />
          <div className="relative z-10 text-white">
            <Sparkles size={80} strokeWidth={1.2} />
          </div>
          {/* Decorative circles */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full" />
          <div className="absolute bottom-6 left-6 w-10 h-10 bg-white/10 rounded-full" />
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-3 pb-4">
        <Link
          href="/onboarding/language"
          className="block w-full bg-[#E27D60] hover:bg-[#c85c3a] active:scale-[0.98] transition-all text-white font-semibold text-base py-4 rounded-2xl text-center shadow-lg shadow-[#E27D60]/25"
        >
          Get Started
        </Link>
        <Link
          href="/dashboard"
          className="block w-full text-[#2A1F14]/50 text-sm font-medium py-2 hover:text-[#2A1F14] transition-colors"
        >
          I already have an account
        </Link>
      </div>
    </div>
  )
}

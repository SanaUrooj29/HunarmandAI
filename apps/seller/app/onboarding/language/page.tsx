'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'

const languages = [
  { key: 'ur', flag: '🇵🇰', label: 'اردو', sub: 'Urdu', isUrdu: true },
  { key: 'en', flag: '🌐', label: 'English', sub: 'Default', isUrdu: false },
]

export default function LanguagePage() {
  const [selected, setSelected] = useState('ur')
  const router = useRouter()

  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hunarmand_locale', selected)
    }
    router.push('/onboarding/phone')
  }

  return (
    <div className="flex flex-col min-h-screen p-6 max-w-sm mx-auto">
      <div className="flex-1 flex flex-col justify-center gap-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-[#2A1F14]">Choose your language</h1>
          <p className="text-[#2A1F14]/50 mt-2">You can change this anytime in settings.</p>
        </div>

        <div className="space-y-3">
          {languages.map(lang => (
            <button
              key={lang.key}
              onClick={() => setSelected(lang.key)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                selected === lang.key
                  ? 'border-[#E27D60] bg-[#E27D60]/5'
                  : 'border-[#e6d8cc] bg-white hover:border-[#E27D60]/40'
              }`}
            >
              <span className="text-3xl flex-shrink-0">{lang.flag}</span>
              <div className="flex-1">
                <p className={`font-semibold text-lg text-[#2A1F14] ${lang.isUrdu ? 'font-urdu' : ''}`}>
                  {lang.label}
                </p>
                <p className="text-sm text-[#2A1F14]/50">{lang.sub}</p>
              </div>
              {selected === lang.key && (
                <div className="w-6 h-6 bg-[#E27D60] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full bg-[#E27D60] hover:bg-[#c85c3a] active:scale-[0.98] transition-all text-white font-semibold text-base py-4 rounded-2xl shadow-lg shadow-[#E27D60]/25"
      >
        Continue
      </button>
    </div>
  )
}

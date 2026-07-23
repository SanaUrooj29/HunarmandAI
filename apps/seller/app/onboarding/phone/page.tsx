'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { requestOtp } from '@/lib/api/seller-auth'

export default function PhonePage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSend = async () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) {
      setError('Please enter a valid mobile number')
      return
    }
    
    setError('')
    setLoading(true)
    
    try {
      // Format the phone number to match what Postman sent: "+923461777330"
      const formattedPhone = `+92${digits}`
      
      // ACTUALLY call your backend
      await requestOtp(formattedPhone)
      
      // Store phone for OTP page (keep formatting consistent)
      sessionStorage.setItem('hunarmand_phone', formattedPhone)
      router.push('/onboarding/otp')
    } catch (err) {
      console.error(err)
      setError('Failed to send code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`
  }

  return (
    <div className="flex flex-col min-h-screen p-6 max-w-sm mx-auto">
      <Link href="/onboarding/language" className="w-9 h-9 flex items-center justify-center -ml-1 mb-6">
        <ArrowLeft size={20} className="text-[#2A1F14]" />
      </Link>

      <div className="flex-1 flex flex-col justify-center gap-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-[#2A1F14]">Enter your number</h1>
          <p className="text-[#2A1F14]/50 mt-2 leading-relaxed">
            We&apos;ll send a 4-digit code to verify your number. Standard SMS rates apply.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider">Mobile Number</label>
          <div className={`flex items-center gap-2 bg-white border-2 rounded-2xl px-4 py-3 transition-colors ${
            error ? 'border-red-400' : 'border-[#e6d8cc] focus-within:border-[#1F7A8C]'
          }`}>
            <div className="flex items-center gap-2 flex-shrink-0 pr-3 border-r border-[#e6d8cc]">
              <span className="text-lg">🇵🇰</span>
              <span className="font-semibold text-[#2A1F14] text-sm">+92</span>
            </div>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="312 4567890"
              value={phone}
              onChange={e => {
                setError('')
                setPhone(formatPhone(e.target.value))
              }}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent outline-none text-[#2A1F14] text-base font-medium placeholder:text-[#2A1F14]/30"
            />
          </div>
          {error && <p className="text-red-500 text-xs pl-1">{error}</p>}
        </div>

        {/* WhatsApp option */}
        <div className="flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl p-3">
          <span className="text-xl flex-shrink-0">💬</span>
          <p className="text-sm text-[#2A1F14]/70">
            Prefer WhatsApp? We can send the code there instead.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleSend}
          disabled={loading || phone.replace(/\D/g, '').length < 10}
          className="w-full bg-[#E27D60] disabled:bg-[#E27D60]/40 hover:bg-[#c85c3a] active:scale-[0.98] transition-all text-white font-semibold text-base py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#E27D60]/20"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : null}
          {loading ? 'Sending…' : 'Send Code'}
        </button>
        <p className="text-center text-xs text-[#2A1F14]/40 leading-relaxed">
          By continuing you agree to our{' '}
          <a href="#" className="text-[#E27D60] hover:underline">Terms</a>
          {' '}and{' '}
          <a href="#" className="text-[#E27D60] hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}

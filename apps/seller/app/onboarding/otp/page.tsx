'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useVerifyOtp } from '@/features/auth/hooks'
import { requestOtp } from '@/lib/api/seller-auth' // <-- Imported the API function

export default function OtpPage() {
  const OTP_LENGTH = 6
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(42)
  const [isResending, setIsResending] = useState(false) // <-- Added loading state for resend
  const [phone, setPhone] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const { verify, loading } = useVerifyOtp()

  // Normalize phone to +92XXXXXXXXXX format (strip spaces/dashes)
  const normalizePhone = (raw: string): string => {
    const digitsOnly = raw.replace(/[^\d+]/g, '')
    // If it already starts with +92, return as-is (cleaned)
    if (digitsOnly.startsWith('+92')) return digitsOnly
    // If it starts with 92 (no +), add +
    if (digitsOnly.startsWith('92')) return `+${digitsOnly}`
    // If it starts with 0, replace leading 0 with +92
    if (digitsOnly.startsWith('0')) return `+92${digitsOnly.slice(1)}`
    // Otherwise prepend +92
    return `+92${digitsOnly}`
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('hunarmand_phone')
      if (stored) {
        setPhone(normalizePhone(stored))
      }
    }
    inputRefs.current[0]?.focus()
  }, [])

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  const handleDigit = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    setError('')
    const next = [...digits]
    next[i] = val
    setDigits(next)
    if (val && i < OTP_LENGTH - 1) inputRefs.current[i + 1]?.focus()
    // Auto-submit when all digits are filled
    if (val && i === OTP_LENGTH - 1) {
      const full = next.join('')
      if (full.length === OTP_LENGTH) triggerVerify(full)
    }
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (pasted.length === OTP_LENGTH) {
      setDigits(pasted.split(''))
      inputRefs.current[OTP_LENGTH - 1]?.focus()
      triggerVerify(pasted)
    }
    e.preventDefault()
  }

  const triggerVerify = async (code: string) => {
    if (code.length < OTP_LENGTH) {
      setError(`Please enter the ${OTP_LENGTH}-digit code`)
      return
    }

    // Call the backend API to verify OTP
    const result = await verify(phone, code)

    if (result) {
      // Store user data in sessionStorage for next steps
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('hunarmand_user', JSON.stringify(result.user))
        sessionStorage.setItem('hunarmand_is_new_user', String(result.isNewUser))
        // Set auth cookie on the frontend domain so Next.js middleware can detect auth state
        // (The backend's httpOnly cookie lives on port 4000 and is invisible to port 3000 middleware)
        document.cookie = 'hunarmand_auth=1; path=/; max-age=2592000'
      }
      // Navigate to next step
      router.push('/onboarding/profile-setup')
    } else {
      setError('Incorrect code. Please try again.')
      setDigits(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
    }
  }

  const handleVerify = () => {
    const code = digits.join('')
    if (code.length < OTP_LENGTH) { setError(`Please enter the ${OTP_LENGTH}-digit code`); return }
    triggerVerify(code)
  }

  // <-- Added function to handle actual OTP resend
  const handleResend = async () => {
    if (!phone) {
      setError('Phone number not found. Please go back and enter your number.')
      return
    }

    try {
      setIsResending(true)
      setError('')
      
      // Normalize phone number to ensure it matches backend format +92XXXXXXXXXX
      const cleanPhone = normalizePhone(phone)
      
      // Call the backend to trigger a new SMS
      await requestOtp(cleanPhone)
      
      // Reset OTP inputs for the new code
      setDigits(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
      
      // Reset timer only if the request succeeds
      setResendTimer(42)
    } catch (err: any) {
      console.error("Failed to resend OTP:", err)
      const message = err?.response?.data?.message || 'Failed to resend code. Please try again.'
      setError(message)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-6 max-w-sm mx-auto">
      <Link href="/onboarding/phone" className="w-9 h-9 flex items-center justify-center -ml-1 mb-6">
        <ArrowLeft size={20} className="text-[#2A1F14]" />
      </Link>

      <div className="flex-1 flex flex-col justify-center gap-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-[#2A1F14]">Verify your number</h1>
          <p className="text-[#2A1F14]/50 mt-2">
            Code sent to <span className="font-semibold text-[#2A1F14]">{phone || '...'}</span>
          </p>
        </div>

        {/* OTP inputs */}
        <div className="flex gap-3 justify-center" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`w-16 h-16 text-center text-2xl font-bold rounded-2xl border-2 outline-none transition-all bg-white ${
                d ? 'border-[#1F7A8C] text-[#2A1F14]' :
                error ? 'border-red-400' :
                'border-[#e6d8cc] focus:border-[#1F7A8C] text-[#2A1F14]'
              }`}
            />
          ))}
        </div>

        {error && <p className="text-center text-red-500 text-sm">{error}</p>}

        {/* Resend */}
        <div className="text-center space-y-3">
          {resendTimer > 0 ? (
            <p className="text-sm text-[#2A1F14]/50">
              Didn&apos;t get it? Resend in{' '}
              <span className="font-semibold text-[#2A1F14]">0:{String(resendTimer).padStart(2, '0')}</span>
            </p>
          ) : (
            <button
              onClick={handleResend} // <-- Swapped to use the new handleResend function
              disabled={isResending}
              className="text-sm font-semibold text-[#E27D60] hover:underline disabled:opacity-50 disabled:hover:no-underline"
            >
              {isResending ? 'Sending...' : 'Resend code'}
            </button>
          )}

          <button className="flex items-center gap-2 text-sm text-[#1F7A8C] font-medium mx-auto hover:underline">
            <MessageSquare size={14} />
            Try WhatsApp delivery instead
          </button>
        </div>
      </div>

      <button
        onClick={handleVerify}
        disabled={loading || digits.join('').length < OTP_LENGTH}
        className="w-full bg-[#E27D60] disabled:bg-[#E27D60]/40 hover:bg-[#c85c3a] active:scale-[0.98] transition-all text-white font-semibold text-base py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#E27D60]/20"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : null}
        {loading ? 'Verifying…' : 'Verify'}
      </button>
    </div>
  )
}
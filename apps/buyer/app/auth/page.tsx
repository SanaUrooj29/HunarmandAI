'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { requestBuyerOtp, updateBuyerProfile, verifyBuyerOtp, saveBuyerToken } from '@/lib/api'

type Step = 'phone' | 'otp' | 'profile'

export default function AuthPage() {
  const router = useRouter()
  const phoneRef = useRef<HTMLInputElement | null>(null)
  const otpRefs = useRef<Array<HTMLInputElement | null>>([])
  const profileNameRef = useRef<HTMLInputElement | null>(null)
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [profileName, setProfileName] = useState('')
  const [profileAge, setProfileAge] = useState('')
  const [profileToken, setProfileToken] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (step === 'phone' && phoneRef.current) {
      phoneRef.current.focus()
    }
    if (step === 'otp' && otpRefs.current[0]) {
      otpRefs.current[0].focus()
    }
    if (step === 'profile' && profileNameRef.current) {
      profileNameRef.current.focus()
    }
  }, [step])

  const normalizedPhone = `+92${phone}`

  const sendOTP = async () => {
    if (phone.replace(/\D/g, '').length !== 10) {
      setError('Please enter a valid 10-digit number')
      return
    }

    console.log('[BUYER AUTH] sendOTP', { normalizedPhone })
    setError('')
    setLoading(true)

    try {
      await requestBuyerOtp(normalizedPhone)
      console.log('[BUYER AUTH] sendOTP success', { normalizedPhone })
      setStep('otp')
    } catch (err) {
      console.log('[BUYER AUTH] sendOTP error', err)
      setError((err as Error)?.message || 'Failed to send code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const verify = async () => {
    if (otp.join('').length !== 6) return

    console.log('[BUYER AUTH] verifyOTP', { normalizedPhone, code: otp.join('') })
    setError('')
    setLoading(true)

    try {
      const result = await verifyBuyerOtp(normalizedPhone, otp.join(''))
      console.log('[BUYER AUTH] verifyOTP success', { normalizedPhone, buyerId: result.buyer.id, buyer: result.buyer })
      saveBuyerToken(result.token)
      setProfileToken(result.token)

      if (!result.buyer.name || result.buyer.age === undefined || result.buyer.age === null) {
        setProfileName(result.buyer.name || '')
        setProfileAge(result.buyer.age ? String(result.buyer.age) : '')
        setStep('profile')
      } else {
        router.push('/marketplace')
      }
    } catch (err) {
      console.log('[BUYER AUTH] verifyOTP error', err)
      setError((err as Error)?.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const submitProfile = async () => {
    if (!profileName.trim()) {
      setError('Please enter your name.')
      return
    }
    const ageValue = Number(profileAge)
    if (!profileAge.trim() || Number.isNaN(ageValue) || ageValue < 13 || ageValue > 120) {
      setError('Please enter a valid age between 13 and 120.')
      return
    }

    setError('')
    setLoading(true)

    try {
      await updateBuyerProfile({ name: profileName.trim(), age: ageValue }, profileToken)
      console.log('[BUYER AUTH] profile updated', { buyerId: profileName, age: ageValue })
      router.push('/marketplace')
    } catch (err) {
      console.log('[BUYER AUTH] profile update error', err)
      setError((err as Error)?.message || 'Could not complete registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPKey = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[i] = val; setOtp(next)
    if (val && i < 5) {
      otpRefs.current[i + 1]?.focus()
    }
  }

  const handleOTPBackspace = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus()
    }
  }

  // Shared form content
  const renderFormContent = () => (
    <div className="auth-form-container">
      {step === 'phone' ? (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: '#1A150F' }}>Sign in to shop</h2>
          <p style={{ fontSize: 14, color: '#8C7D6B', marginBottom: 24 }}>We&apos;ll send you a 6-digit code on your number</p>

          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A3E33', marginBottom: 8 }}>Mobile number</label>
          <div style={{ display: 'flex', marginBottom: 6 }}>
            <div style={{ padding: '12px 14px', background: '#F5F1EA', border: '1.5px solid #EDE8DF', borderRight: 'none', borderRadius: '12px 0 0 12px', fontSize: 15, fontWeight: 600, color: '#4A3E33', flexShrink: 0 }}>+92</div>
            <input
              ref={phoneRef}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="tel"
              maxLength={10}
              value={phone}
              onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError('') }}
              onKeyDown={e => e.key === 'Enter' && sendOTP()}
              placeholder="3XX XXXXXXX"
              style={{ flex: 1, padding: '12px 14px', border: '1.5px solid #EDE8DF', borderRadius: '0 12px 12px 0', fontSize: 15, outline: 'none', background: 'white', color: '#1A150F' }}
            />
          </div>
          {error && <p style={{ fontSize: 12, color: '#C84A3A', marginBottom: 8 }}>{error}</p>}
          <button
            onClick={sendOTP}
            disabled={loading || phone.length < 10}
            style={{ width: '100%', padding: 14, background: loading || phone.length < 10 ? '#D9D0C4' : '#C8614A', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: phone.length < 10 ? 'not-allowed' : 'pointer', marginTop: 8 }}
          >
            {loading ? 'Sending…' : 'Send Code'}
          </button>
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8C7D6B' }}>
            Don&apos;t have an account? <span style={{ color: '#C8614A', fontWeight: 600, cursor: 'pointer' }}>Sign up as buyer</span>
          </div>
        </>
      ) : step === 'otp' ? (
        <>
          <button onClick={() => setStep('phone')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, padding: 0, display: 'flex', alignItems: 'center', gap: 6, color: '#8C7D6B', fontSize: 13 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#8C7D6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Back
          </button>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: '#1A150F' }}>Enter verification code</h2>
          <p style={{ fontSize: 14, color: '#8C7D6B', marginBottom: 28 }}>Sent to +92 {phone}</p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                ref={(el) => { otpRefs.current[i] = el }}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                value={digit}
                onChange={e => handleOTPKey(i, e.target.value)}
                onKeyDown={e => handleOTPBackspace(i, e)}
                style={{ width: 58, height: 66, textAlign: 'center', fontSize: 28, fontWeight: 800, border: `2px solid ${digit ? '#C8614A' : '#EDE8DF'}`, borderRadius: 14, color: '#1A150F', background: digit ? '#FFF5F3' : 'white', outline: 'none', transition: 'all .12s' }}
              />
            ))}
          </div>

          <button
            onClick={verify}
            disabled={loading || otp.join('').length !== 6}
            style={{ width: '100%', padding: 14, background: otp.join('').length === 6 ? '#C8614A' : '#D9D0C4', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: otp.join('').length === 6 ? 'pointer' : 'not-allowed' }}
          >
            {loading ? 'Verifying…' : 'Verify & Continue'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#8C7D6B' }}>
            Didn&apos;t receive it?{' '}
            <button onClick={() => setOtp(['', '', '', '', '', ''])} style={{ background: 'none', border: 'none', color: '#C8614A', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Resend</button>
          </p>
        </>
      ) : (
        <>
          <button onClick={() => setStep('otp')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, padding: 0, display: 'flex', alignItems: 'center', gap: 6, color: '#8C7D6B', fontSize: 13 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#8C7D6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Back
          </button>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: '#1A150F' }}>Complete your profile</h2>
          <p style={{ fontSize: 14, color: '#8C7D6B', marginBottom: 24 }}>Tell us your name and age so we can personalize your experience</p>

          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A3E33', marginBottom: 8 }}>Full name</label>
          <input
            ref={profileNameRef}
            type="text"
            autoComplete="name"
            value={profileName}
            onChange={e => { setProfileName(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && submitProfile()}
            placeholder="Your full name"
            style={{ width: '100%', marginBottom: 16, padding: '12px 14px', border: '1.5px solid #EDE8DF', borderRadius: 12, fontSize: 15, outline: 'none', background: 'white', color: '#1A150F' }}
          />

          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4A3E33', marginBottom: 8 }}>Age</label>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="bday-year"
            maxLength={3}
            value={profileAge}
            onChange={e => { setProfileAge(e.target.value.replace(/\D/g, '').slice(0, 3)); setError('') }}
            onKeyDown={e => e.key === 'Enter' && submitProfile()}
            placeholder="Your age"
            style={{ width: '100%', marginBottom: 16, padding: '12px 14px', border: '1.5px solid #EDE8DF', borderRadius: 12, fontSize: 15, outline: 'none', background: 'white', color: '#1A150F' }}
          />
          {error && <p style={{ fontSize: 12, color: '#C84A3A', marginBottom: 8 }}>{error}</p>}

          <button
            onClick={submitProfile}
            disabled={loading || !profileName.trim() || !profileAge.trim()}
            style={{ width: '100%', padding: 14, background: !profileName.trim() || !profileAge.trim() ? '#D9D0C4' : '#C8614A', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: !profileName.trim() || !profileAge.trim() ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Saving…' : 'Save & Continue'}
          </button>
        </>
      )}
    </div>
  )

  return (
    <div className="auth-page">
      <div className="auth-page-inner">
        <div className="auth-page-shell">
          <div className="auth-page-header">
            <div className="auth-page-logo">🧵</div>
            <h1 className="auth-page-title">HunarmandAI</h1>
            <p className="auth-page-subtitle">Handmade by Pakistan&apos;s women artisans</p>
          </div>
          <div className="auth-page-card">
            {renderFormContent()}
          </div>
          <p className="auth-page-footer">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}

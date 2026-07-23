/**
 * Authentication Hooks
 * Custom hooks for seller authentication flows
 */

import { useState } from 'react'
import { verifyOtp as verifyOtpApi, requestOtp as requestOtpApi, User } from '@/lib/api/seller-auth'

export function useVerifyOtp() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isNewUser, setIsNewUser] = useState(false)

  const verify = async (phone: string, otp: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await verifyOtpApi(phone, otp)

      if (response.success) {
        setUser(response.data.user)
        setIsNewUser(response.data.isNewUser)
        return response.data
      } else {
        setError('Verification failed')
        return null
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to verify OTP'
      setError(errorMessage)
      console.error('OTP verification error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { verify, loading, error, user, isNewUser }
}

export function useRequestOtp() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = async (phone: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await requestOtpApi(phone)

      if (response.success) {
        return response.data
      } else {
        setError('Failed to request OTP')
        return null
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to request OTP'
      setError(errorMessage)
      console.error('OTP request error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { request, loading, error }
}

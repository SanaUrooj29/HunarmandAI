/**
 * Seller Auth API Endpoints
 * Handles all authentication-related API calls to the backend
 */

import { apiClient } from '../api-client'

export interface RequestOtpPayload {
  phone: string;
  role: 'seller' | 'buyer';
}

export interface RequestOtpResponse {
  success: boolean
  message: string
  data?: {
    requestId: string
    expiresIn: number
  }
}

export interface VerifyOtpPayload {
  phone: string
  otp: string
}

export interface User {
  id: string
  phone: string
  role: 'seller' | 'buyer' | 'admin'
  name?: string
  email?: string
  createdAt: string
}

export interface VerifyOtpResponse {
  success: boolean
  message: string
  data: {
    user: User
    isNewUser: boolean
    token: string
    accessToken?: string
  }
}

export interface RefreshTokenResponse {
  success: boolean
  message: string
  data: {
    token: string
    accessToken?: string
  }
}

/**
 * Request OTP for phone number
 * Step 1 of the authentication flow
 */
export const requestOtp = async (phone: string): Promise<RequestOtpResponse> => {
  // Strip spaces, dashes, and other non-numeric chars (keep + prefix)
  const cleanPhone = phone.replace(/[^\d+]/g, '')
  
  const response = await apiClient.post<RequestOtpResponse>('/auth/otp/request', {
    phone: cleanPhone,
    role: 'seller' //hardcoded role
  })
  return response.data
}

/**
 * Verify OTP and get access token
 * Step 2 of the authentication flow
 * This is the endpoint you mentioned: http://localhost:4000/api/seller/auth/otp/verify
 */
export const verifyOtp = async (phone: string, otp: string): Promise<VerifyOtpResponse> => {
  const response = await apiClient.post<VerifyOtpResponse>('/auth/otp/verify', {
    phone,
    code: otp,
  })

  const accessToken = response.data?.data?.token ?? response.data?.data?.accessToken

  // Store tokens in localStorage for subsequent requests
  if (accessToken) {
    console.log('[Auth] Storing access token:', accessToken.slice(0, 20) + '...')
    localStorage.setItem('hunarmand_access_token', accessToken)
  } else {
    console.warn('[Auth] No access token in response:', response.data)
  }

  return response.data
}

/**
 * Refresh the access token
 * Extends the session without requiring OTP
 */
export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<RefreshTokenResponse>('/auth/token/refresh', {})

  const accessToken = response.data.data.token ?? response.data.data.accessToken
  if (accessToken) {
    localStorage.setItem('hunarmand_access_token', accessToken)
  }

  return response.data
}

/**
 * Logout and clear session
 */
export const logout = async (): Promise<{ status: string }> => {
  const response = await apiClient.post<{ status: string }>('/auth/logout', {})

  // Clear stored tokens
  localStorage.removeItem('hunarmand_access_token')
  localStorage.removeItem('hunarmand_refresh_token')

  return response.data
}

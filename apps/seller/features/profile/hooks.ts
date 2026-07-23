// profile/hooks.ts — Seller profile & auth

import { useState } from 'react'
import { useAsync, fakeFetch } from '@/hooks/useAsync'
import { SELLER } from '@/lib/mock-data'

export function useSellerProfile() {
  return useAsync(() => fakeFetch(SELLER))
}

export function useUpdateProfile() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = async (data: {
    name: string
    city: string
    categories: string[]
  }) => {
    setSaving(true)
    setError(null)
    try {
      // In production: PATCH /api/seller/profile
      await fakeFetch(data, 900)
    } catch (e) {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return { update, saving, error }
}

export function useWalletLink() {
  const [linking, setLinking] = useState(false)

  const linkWallet = async (provider: 'jazzcash' | 'easypaisa', phone: string) => {
    setLinking(true)
    // In production: POST /api/seller/wallet/link
    await fakeFetch({ provider, phone }, 1200)
    setLinking(false)
  }

  return { linkWallet, linking }
}

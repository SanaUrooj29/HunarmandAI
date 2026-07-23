const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
const BUYER_TOKEN_KEY = 'hunarmandai_buyer_token'
const BUYER_TOKEN_CHANGE_EVENT = 'hunarmandai_buyer_token_change'

type ApiFetchOptions = {
  method?: string
  token?: string | null
  body?: any
}

type ApiResponse<T = unknown> = {
  message?: string
  data?: T
  meta?: unknown
}

function getBuyerTokenStorage(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(BUYER_TOKEN_KEY)
}

function setBuyerTokenStorage(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) {
    window.localStorage.setItem(BUYER_TOKEN_KEY, token)
  } else {
    window.localStorage.removeItem(BUYER_TOKEN_KEY)
  }
  window.dispatchEvent(new Event(BUYER_TOKEN_CHANGE_EVENT))
}

function getHeaders(token?: string | null) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const authToken = token ?? getBuyerTokenStorage()
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  return headers
}

async function apiFetch<T = unknown>(path: string, opts: ApiFetchOptions = {}): Promise<ApiResponse<T>> {
  const { method = 'GET', token, body } = opts
  console.log('[BUYER FRONTEND API] request', { method, url: `${API_BASE_URL}${path}`, body, hasAuth: !!token })

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: getHeaders(token),
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  console.log('[BUYER FRONTEND API] response', { method, url: `${API_BASE_URL}${path}`, status: res.status, data })

  if (!res.ok) {
    const message = (data as any)?.message || `${res.status} ${res.statusText}`
    throw new Error(message)
  }

  return data as ApiResponse<T>
}

export interface BuyerAuthResult {
  token: string
  isNewAccount?: boolean
  buyer: {
    id: string
    phone: string
    name?: string
    age?: number
    preferredLanguage?: string
    credibilityScore?: number
  }
}

export async function updateBuyerProfile(updates: { name: string; age?: number }, token?: string | null) {
  const response = await apiFetch('/api/buyer/profile', {
    method: 'PATCH',
    token,
    body: updates,
  })
  return response.data
}

export interface BuyerCartItem {
  id: string
  productId: string
  title: string
  price: number
  quantity: number
  seller: {
    id: string
    name: string
    city: string
    deliveryNote: string
  }
}

function mapCartItem(item: any): BuyerCartItem {
  return {
    id: String(item._id ?? item.id ?? `${item.productId}-${item.quantity}`),
    productId: String(item.productId ?? ''),
    title: item.titleSnapshot ?? item.title ?? 'Untitled product',
    price: item.priceSnapshot ?? item.price ?? 0,
    quantity: item.quantity ?? 1,
    seller: {
      id: String(item.sellerId ?? item.seller?.id ?? 'unknown'),
      name: item.sellerNameSnapshot ?? item.seller?.name ?? 'Seller',
      city: item.sellerCitySnapshot ?? item.seller?.city ?? '',
      deliveryNote: item.deliveryNote ?? 'TCS delivery',
    },
  }
}

export function getBuyerToken() {
  return getBuyerTokenStorage()
}

export function saveBuyerToken(token: string | null) {
  setBuyerTokenStorage(token)
}

export function subscribeBuyerTokenChanges(listener: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(BUYER_TOKEN_CHANGE_EVENT, listener)
  return () => window.removeEventListener(BUYER_TOKEN_CHANGE_EVENT, listener)
}

export async function requestBuyerOtp(phone: string) {
  const response = await apiFetch<{ isNewAccount: boolean; expiresAt: string }>('/api/buyer/auth/otp/request', {
    method: 'POST',
    body: { phone },
  })
  return response.data
}

export async function verifyBuyerOtp(phone: string, code: string): Promise<BuyerAuthResult> {
  const response = await apiFetch<BuyerAuthResult>('/api/buyer/auth/otp/verify', {
    method: 'POST',
    body: { phone, code },
  })
  if (!response.data) {
    throw new Error('Unexpected auth response from server')
  }
  return response.data
}

export async function getBuyerProfile(token?: string | null) {
  const response = await apiFetch<BuyerAuthResult['buyer']>('/api/buyer/profile', {
    method: 'GET',
    token,
  })
  if (!response.data) {
    throw new Error('Unable to fetch buyer profile')
  }
  return response.data
}

export async function logoutBuyer() {
  const token = getBuyerTokenStorage()
  if (!token) return
  await apiFetch('/api/buyer/auth/logout', {
    method: 'POST',
    token,
  })
  saveBuyerToken(null)
}

export async function getBuyerCart(token: string) {
  const response = await apiFetch<{ items: any[] }>('/api/buyer/cart', { token })
  return {
    items: (response.data?.items ?? []).map(mapCartItem),
  }
}

export async function addBuyerCartItem(productId: string, quantity = 1, token: string) {
  const response = await apiFetch<{ items: any[] }>('/api/buyer/cart/items', {
    method: 'POST',
    token,
    body: { productId, quantity },
  })
  return {
    items: (response.data?.items ?? []).map(mapCartItem),
  }
}

export async function updateBuyerCartItem(productId: string, quantity: number, token: string) {
  const response = await apiFetch<{ items: any[] }>(`/api/buyer/cart/items/${productId}`, {
    method: 'PATCH',
    token,
    body: { quantity },
  })
  return {
    items: (response.data?.items ?? []).map(mapCartItem),
  }
}

export async function removeBuyerCartItem(productId: string, token: string) {
  const response = await apiFetch<{ items: any[] }>(`/api/buyer/cart/items/${productId}`, {
    method: 'DELETE',
    token,
  })
  return {
    items: (response.data?.items ?? []).map(mapCartItem),
  }
}

export async function clearBuyerCart(token: string) {
  const response = await apiFetch<{ items: any[] }>('/api/buyer/cart', {
    method: 'DELETE',
    token,
  })
  return {
    items: (response.data?.items ?? []).map(mapCartItem),
  }
}

/**
 * Centralized Axios instance for API calls to backend
 * Pre-configured with base URL and default headers
 */

import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/seller`,
  withCredentials: true, // Include cookies for auth
})

// Public endpoints that do not require auth token
const PUBLIC_API_PATHS = ['/auth/otp/request', '/auth/otp/verify']

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('hunarmand_access_token')
    const requestPath = config.url || ''
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
      console.log('[API] Adding auth token to request:', requestPath)
    } else if (!PUBLIC_API_PATHS.some((path) => requestPath.startsWith(path))) {
      console.warn('[API] No auth token found for request:', requestPath)
    }
  }

  if (config.data && !(config.data instanceof FormData)) {
    config.headers = config.headers ?? {}
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored tokens on unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('hunarmand_access_token')
        localStorage.removeItem('hunarmand_refresh_token')
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient

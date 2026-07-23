'use client'

import { useEffect } from 'react'

export function usePWA() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })
        console.log('[PWA] Service worker registered:', registration.scope)

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available — could show a toast here
              console.log('[PWA] New version available')
            }
          })
        })
      } catch (err) {
        console.warn('[PWA] Service worker registration failed:', err)
      }
    }

    registerSW()
  }, [])
}

'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import clsx from 'clsx'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  const icons = { success: CheckCircle, error: AlertCircle, info: Info }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
        {toasts.map(t => {
          const Icon = icons[t.type]
          return (
            <div key={t.id}
              className={clsx(
                'flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all animate-in slide-in-from-right',
                t.type === 'success' && 'bg-emerald-600 text-white',
                t.type === 'error' && 'bg-red-600 text-white',
                t.type === 'info' && 'bg-[#1F7A8C] text-white',
              )}>
              <Icon size={16} className="flex-shrink-0 mt-0.5" />
              <p className="flex-1">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="flex-shrink-0 opacity-70 hover:opacity-100">
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

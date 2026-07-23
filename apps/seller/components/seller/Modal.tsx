'use client'

import { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  destructive = false, onConfirm, onCancel,
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <button onClick={onCancel} className="absolute top-4 right-4 text-[#2A1F14]/40 hover:text-[#2A1F14]">
          <X size={18} />
        </button>
        <h3 className="font-display font-bold text-xl text-[#2A1F14]">{title}</h3>
        <p className="text-sm text-[#2A1F14]/60 mt-2 leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" size="md" className="flex-1" onClick={onCancel}>{cancelLabel}</Button>
          <button
            onClick={onConfirm}
            className={`flex-1 font-semibold text-sm py-2.5 rounded-xl transition-all active:scale-95 ${
              destructive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#E27D60] hover:bg-[#c85c3a] text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Drawer (bottom sheet) ─────────────────────────────────────────────────────
interface DrawerProps {
  open: boolean
  title?: string
  onClose: () => void
  children: ReactNode
}

export function Drawer({ open, title, onClose, children }: DrawerProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto shadow-xl">
        <div className="w-10 h-1 bg-[#e8ddd0] rounded-full mx-auto mb-4" />
        {title && <h3 className="font-display font-bold text-xl text-[#2A1F14] mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  )
}

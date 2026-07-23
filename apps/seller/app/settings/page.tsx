'use client'

import { useState } from 'react'
import { Globe, Bell, Lock, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { useToast } from '@/components/seller/Toast'
import { useRouter } from 'next/navigation'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={clsx(
        'relative inline-flex items-center rounded-full transition-colors w-11 h-6',
        checked ? 'bg-[#1F7A8C]' : 'bg-[#d1c8bc]'
      )}
    >
      <span className={clsx(
        'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
        checked ? 'translate-x-5' : 'translate-x-0'
      )} />
    </button>
  )
}

export default function SettingsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [lang, setLang] = useState<'ur' | 'en'>('en')
  const [notifs, setNotifs] = useState({
    orders: true,
    earnings: true,
    learn: false,
  })

  const handleLangChange = (l: 'ur' | 'en') => {
    setLang(l)
    if (typeof window !== 'undefined') {
      localStorage.setItem('hunarmand_locale', l)
      document.documentElement.dir = l === 'ur' ? 'rtl' : 'ltr'
      document.documentElement.lang = l
    }
    toast(`Language changed to ${l === 'ur' ? 'Urdu' : 'English'}`, 'success')
  }

  const handleNotifToggle = (key: keyof typeof notifs, val: boolean) => {
    setNotifs(p => ({ ...p, [key]: val }))
    toast(`${val ? 'Enabled' : 'Disabled'} ${key} notifications`, 'info')
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      document.cookie = 'hunarmand_auth=; path=/; max-age=0'
      document.cookie = 'hunarmand_onboarded=; path=/; max-age=0'
    }
    router.push('/onboarding')
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5 pb-8">
      <h1 className="font-display font-bold text-2xl text-[#2A1F14]">Settings</h1>

      {/* Language */}
      <div className="bg-white rounded-2xl border border-[#e6d8cc] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e6d8cc] flex items-center gap-2">
          <Globe size={16} className="text-[#1F7A8C]" />
          <h2 className="font-semibold text-[#2A1F14] text-sm">Language / زبان</h2>
        </div>
        <div className="p-3 space-y-2">
          {[
            { key: 'ur' as const, flag: '🇵🇰', label: 'اردو', sub: 'Urdu', isUrdu: true },
            { key: 'en' as const, flag: '🌐', label: 'English', sub: 'Default', isUrdu: false },
          ].map(opt => (
            <button key={opt.key} onClick={() => handleLangChange(opt.key)}
              className={clsx(
                'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left',
                lang === opt.key ? 'border-[#E27D60] bg-[#E27D60]/5' : 'border-transparent hover:border-[#e6d8cc]'
              )}>
              <span className="text-2xl">{opt.flag}</span>
              <div className="flex-1">
                <p className={clsx('font-semibold text-[#2A1F14]', opt.isUrdu && 'font-urdu')}>{opt.label}</p>
                <p className="text-xs text-[#2A1F14]/50">{opt.sub}</p>
              </div>
              {lang === opt.key && (
                <span className="w-5 h-5 bg-[#E27D60] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-[#e6d8cc] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e6d8cc] flex items-center gap-2">
          <Bell size={16} className="text-[#1F7A8C]" />
          <h2 className="font-semibold text-[#2A1F14] text-sm">Notifications</h2>
        </div>
        <div className="divide-y divide-[#e8ddd0]">
          {[
            { key: 'orders' as const, label: 'New orders & status updates', sub: 'When a buyer places or updates an order' },
            { key: 'earnings' as const, label: 'Payouts & earnings', sub: 'When money is transferred to your wallet' },
            { key: 'learn' as const, label: 'New lessons available', sub: 'When new learning content is unlocked' },
          ].map(n => (
            <div key={n.key} className="flex items-center gap-4 px-4 py-3.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2A1F14]">{n.label}</p>
                <p className="text-xs text-[#2A1F14]/50 mt-0.5">{n.sub}</p>
              </div>
              <Toggle checked={notifs[n.key]} onChange={v => handleNotifToggle(n.key, v)} />
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white rounded-2xl border border-[#e6d8cc] overflow-hidden">
        {[
          { icon: Lock, label: 'Privacy & data', sub: 'Manage your data and privacy settings' },
          { icon: Shield, label: 'Account security', sub: 'OTP settings, session management' },
          { icon: HelpCircle, label: 'Help & support', sub: 'FAQs, contact HunarmandAI team' },
        ].map(({ icon: Icon, label, sub }) => (
          <button key={label}
            className="flex items-center gap-4 w-full px-4 py-3.5 border-b border-[#e6d8cc] last:border-0 hover:bg-[#f4ede3] transition-colors text-left">
            <div className="w-9 h-9 bg-[#F5EBDD] rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-[#1F7A8C]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#2A1F14]">{label}</p>
              <p className="text-xs text-[#2A1F14]/50">{sub}</p>
            </div>
            <ChevronRight size={14} className="text-[#2A1F14]/30 flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* App info */}
      <div className="bg-white rounded-2xl border border-[#e6d8cc] p-4 space-y-2">
        <p className="text-xs text-[#2A1F14]/40 font-medium uppercase tracking-wider">About</p>
        <div className="flex justify-between text-sm">
          <span className="text-[#2A1F14]/60">Version</span>
          <span className="text-[#2A1F14] font-medium">1.0.0</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#2A1F14]/60">Platform</span>
          <span className="text-[#2A1F14] font-medium">PWA / Web</span>
        </div>
        <div className="flex gap-3 pt-1">
          <a href="#" className="text-xs text-[#1F7A8C] hover:underline">Terms of Service</a>
          <a href="#" className="text-xs text-[#1F7A8C] hover:underline">Privacy Policy</a>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-3.5 bg-white border border-[#e6d8cc] rounded-2xl hover:border-red-200 hover:bg-red-50 transition-colors text-left group"
      >
        <div className="w-9 h-9 bg-red-50 group-hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
          <LogOut size={16} className="text-red-500" />
        </div>
        <span className="text-sm font-medium text-red-500">Log out</span>
      </button>
    </div>
  )
}

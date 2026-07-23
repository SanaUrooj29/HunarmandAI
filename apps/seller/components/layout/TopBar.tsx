'use client'

import { Bell, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const pageTitles: Record<string, string> = {
  '/dashboard':       'Home',
  '/store':           'My Store',
  '/orders':          'Orders',
  '/earnings':        'Earnings',
  '/analytics':       'Analytics',
  '/learn':           'Learn',
  '/profile':         'My Account',
  '/settings':        'Settings',
  '/notifications':   'Notifications',
  '/listing/new':     'New Listing',
  '/listing/drafts':  'Drafts',
  '/search':          'Search',
  '/storefront':      'Storefront',
}

export function TopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState('')

  const isDashboard = pathname === '/dashboard'
  const isOnboarding = pathname.startsWith('/onboarding')

  const title =
    Object.entries(pageTitles).find(
      ([k]) => pathname === k || pathname.startsWith(k + '/')
    )?.[1] ?? 'HunarmandAI'

  if (isOnboarding) return null

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search')
    setQuery('')
  }

  return (
    <header className="sticky top-0 z-30 bg-[#f4ede3]/95 backdrop-blur-sm border-b border-[#e6d8cc] h-[57px] flex items-center px-4 md:px-6 gap-3">

      {/* ── Mobile: greeting or title ─────────────── */}
      <div className="flex-1 min-w-0 md:hidden">
        {isDashboard ? (
          <>
            <p className="text-xs text-[#9a8878]">Assalam-u-Alaikum</p>
            <h2 className="font-display font-semibold text-[#2A1F14] text-lg leading-tight">Fatima Aslam</h2>
          </>
        ) : (
          <h2 className="font-semibold text-[#2A1F14] text-base truncate">{title}</h2>
        )}
      </div>

      {/* ── Desktop: page title + search ─────────── */}
      <div className="hidden md:flex flex-1 items-center gap-4 min-w-0">
        <h2 className="font-display font-semibold text-xl text-[#2A1F14] truncate flex-shrink-0">
          {title}
        </h2>
        <form onSubmit={handleSearch} className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a8878] pointer-events-none" />
          <input
            type="text"
            placeholder="Search orders, products…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/70 border border-[#e6d8cc] rounded-xl text-sm text-[#2A1F14] placeholder:text-[#9a8878] focus:outline-none focus:border-[#E27D60] focus:bg-white transition-all"
          />
        </form>
      </div>

      {/* ── Mobile search icon ───────────────────── */}
      <Link href="/search"
        className="md:hidden w-9 h-9 rounded-xl bg-white/60 border border-[#e6d8cc] flex items-center justify-center hover:bg-white transition-colors">
        <Search size={16} className="text-[#6b5a4e]" />
      </Link>

      {/* ── Notification bell ────────────────────── */}
      <Link href="/notifications"
        className="relative w-9 h-9 rounded-xl bg-white/60 border border-[#e6d8cc] flex items-center justify-center hover:bg-white transition-colors">
        <Bell size={16} className="text-[#6b5a4e]" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E27D60] rounded-full ring-1 ring-[#f4ede3]" />
      </Link>

      {/* ── Avatar ───────────────────────────────── */}
      <Link href="/profile"
        className="w-9 h-9 bg-gradient-to-br from-[#E27D60] to-[#c85c3a] rounded-xl flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm">
        FA
      </Link>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Store, ShoppingBag, BookOpen, User, Plus } from 'lucide-react'
import clsx from 'clsx'

const tabs = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/store', label: 'Store', icon: Store },
  null, // FAB placeholder
  { href: '/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/learn', label: 'Learn', icon: BookOpen },
]

export function BottomNav() {
  const pathname = usePathname()

  // Hide on onboarding
  if (pathname.startsWith('/onboarding')) return null

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#e6d8cc] z-50 safe-bottom">
      <div className="flex items-center justify-around px-1 h-16">
        {tabs.map((tab, i) => {
          if (!tab) {
            // Center FAB
            return (
              <Link
                key="fab"
                href="/listing/new"
                className="flex items-center justify-center w-14 h-14 bg-[#E27D60] rounded-full shadow-lg shadow-[#E27D60]/35 -mt-6 ring-4 ring-white transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
              >
                <Plus size={24} className="text-white" />
              </Link>
            )
          }
          const active = isActive(tab.href)
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                'flex flex-col items-center gap-0.5 px-4 py-2 text-xs font-medium transition-colors min-w-0 flex-1',
                active ? 'text-[#E27D60]' : 'text-[#2A1F14]/45 hover:text-[#2A1F14]/70'
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              <span className="truncate">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

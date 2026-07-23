'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Store, ShoppingBag, DollarSign, BookOpen,
  User, Settings, Plus, Sparkles, Bell, BarChart2, Search,
  ExternalLink, ChevronLeft,
} from 'lucide-react'
import clsx from 'clsx'
import { useSidebar } from '@/lib/sidebar-context'

const NAV = [
  { href: '/dashboard',  label: 'Home',      icon: Home,        badge: 0 },
  { href: '/store',      label: 'My Store',  icon: Store,       badge: 0 },
  { href: '/orders',     label: 'Orders',    icon: ShoppingBag, badge: 3 },
  { href: '/earnings',   label: 'Earnings',  icon: DollarSign,  badge: 0 },
  { href: '/analytics',  label: 'Analytics', icon: BarChart2,   badge: 0 },

  { href: '/learn',      label: 'Learn',     icon: BookOpen,    badge: 1 },
]

const BOTTOM_NAV = [
  { href: '/search',        label: 'Search',        icon: Search,   badge: 0 },
  { href: '/notifications', label: 'Notifications', icon: Bell,     badge: 2 },
  { href: '/profile',       label: 'Profile',       icon: User,     badge: 0 },
  { href: '/settings',      label: 'Settings',      icon: Settings, badge: 0 },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { collapsed, toggle } = useSidebar()

  if (pathname.startsWith('/onboarding')) return null

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <aside
      style={{ width: collapsed ? '64px' : '240px' }}
      className="hidden md:flex flex-col fixed left-0 top-0 h-full z-40 bg-[#f4ede3] border-r border-[#e6d8cc] sidebar-transition overflow-hidden"
    >
      {/* Logo row */}
      <div className="flex items-center border-b border-[#e6d8cc] flex-shrink-0 h-[57px] px-4">
        <Link href="/dashboard" className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 bg-[#E27D60] rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <Sparkles size={15} className="text-white" />
          </div>
          <div className="nav-label" style={{ opacity: collapsed ? 0 : 1, maxWidth: collapsed ? 0 : 160, overflow: 'hidden', transition: 'opacity 160ms ease, max-width 220ms cubic-bezier(0.4,0,0.2,1)' }}>
            <h1 className="font-display font-bold text-base text-[#2A1F14] leading-none whitespace-nowrap">HunarmandAI</h1>
            <p className="text-[#9a8878] text-[10px] mt-0.5 whitespace-nowrap">Seller Portal</p>
          </div>
        </Link>
      </div>

      {/* CTA */}
      <div className="px-3 py-3 flex-shrink-0 flex justify-center">
        {collapsed ? (
          <Link href="/listing/new" title="List a new product"
            className="w-9 h-9 bg-[#E27D60] hover:bg-[#c85c3a] rounded-xl flex items-center justify-center transition-colors shadow-sm">
            <Plus size={16} className="text-white" />
          </Link>
        ) : (
          <Link href="/listing/new"
            className="flex items-center gap-2 bg-[#E27D60] hover:bg-[#c85c3a] transition-colors rounded-xl px-3 py-2.5 text-sm font-semibold w-full text-white shadow-sm">
            <Plus size={15} className="flex-shrink-0" />
            <span className="whitespace-nowrap">List a new product</span>
          </Link>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV.map(({ href, label, icon: Icon, badge }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href} title={collapsed ? label : undefined}
              className={clsx(
                'flex items-center rounded-xl text-sm font-medium transition-all relative',
                collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-3 py-2.5',
                active ? 'bg-[#E27D60]/[0.12] text-[#E27D60]' : 'text-[#6b5a4e] hover:text-[#2A1F14] hover:bg-[#ede0d4]'
              )}>
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#E27D60] rounded-r-full" />}
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{label}</span>
                  {badge > 0 && (
                    <span className="bg-[#E27D60] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 flex-shrink-0">
                      {badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && badge > 0 && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#E27D60] rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Storefront pill */}
      {!collapsed && (
        <div className="mx-3 mb-2 border border-[#e6d8cc] rounded-xl flex items-center gap-2 px-3 py-2 bg-white/50">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] text-[#9a8878] uppercase tracking-wide font-semibold">Storefront</p>
            <p className="text-xs text-[#2A1F14] truncate font-medium">hunarmand.ai/fatima-aslam</p>
          </div>
          <Link href="/storefront/fatima-aslam"
            className="w-6 h-6 flex items-center justify-center hover:bg-[#e6d8cc] rounded-lg transition-colors flex-shrink-0">
            <ExternalLink size={11} className="text-[#9a8878]" />
          </Link>
        </div>
      )}

      <div className="border-t border-[#e6d8cc] mx-3" />

      {/* Bottom nav */}
      <div className="px-2 py-2 space-y-0.5 flex-shrink-0">
        {BOTTOM_NAV.map(({ href, label, icon: Icon, badge }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href} title={collapsed ? label : undefined}
              className={clsx(
                'flex items-center rounded-xl text-sm font-medium transition-all relative',
                collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-3 py-2',
                active ? 'bg-[#E27D60]/[0.12] text-[#E27D60]' : 'text-[#6b5a4e] hover:text-[#2A1F14] hover:bg-[#ede0d4]'
              )}>
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{label}</span>
                  {badge > 0 && (
                    <span className="bg-[#E27D60] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 flex-shrink-0">
                      {badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && badge > 0 && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#E27D60] rounded-full" />
              )}
            </Link>
          )
        })}
      </div>

      {/* Seller row */}
      <div className="border-t border-[#e6d8cc] flex-shrink-0">
        <Link href="/profile"
          className={clsx(
            'flex items-center transition-colors hover:bg-[#ede0d4]',
            collapsed ? 'justify-center py-3' : 'gap-3 px-4 py-3'
          )}>
          <div className="w-7 h-7 bg-gradient-to-br from-[#E27D60] to-[#c85c3a] rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
            FA
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#2A1F14] leading-tight truncate">Fatima Aslam</p>
              <p className="text-[#9a8878] text-xs">Lahore · 4.8 ★</p>
            </div>
          )}
        </Link>
      </div>

      {/* Collapse toggle button */}
      <button
        onClick={toggle}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute top-[14px] -right-3 z-50 w-6 h-6 bg-white border border-[#e6d8cc] rounded-full shadow-sm flex items-center justify-center hover:bg-[#F5EBDD] transition-colors"
      >
        <ChevronLeft
          size={12}
          className="text-[#9a8878] transition-transform duration-200"
          style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
    </aside>
  )
}

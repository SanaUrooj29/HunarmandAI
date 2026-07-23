'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cart-context'

const NAV_ITEMS = [
  {
    href: '/marketplace',
    label: 'Shop',
    exact: true,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          stroke={active ? '#C8614A' : '#8C7D6B'}
          strokeWidth="2"
          fill={active ? '#F5E8E4' : 'none'}
        />
        <path d="M9 22V12h6v10" stroke={active ? '#C8614A' : '#8C7D6B'} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/marketplace/search',
    label: 'Search',
    exact: false,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke={active ? '#C8614A' : '#8C7D6B'} strokeWidth="2" />
        <path d="M21 21l-4.35-4.35" stroke={active ? '#C8614A' : '#8C7D6B'} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  // FAB placeholder — handled separately
  {
    href: '/cart',
    label: 'Cart',
    exact: false,
    isCart: true,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
          stroke={active ? '#C8614A' : '#8C7D6B'}
          strokeWidth="2"
          fill={active ? '#F5E8E4' : 'none'}
        />
        <line x1="3" y1="6" x2="21" y2="6" stroke={active ? '#C8614A' : '#8C7D6B'} strokeWidth="2" />
        <path d="M16 10a4 4 0 01-8 0" stroke={active ? '#C8614A' : '#8C7D6B'} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/orders',
    label: 'Orders',
    exact: false,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
          stroke={active ? '#C8614A' : '#8C7D6B'}
          strokeWidth="2"
          fill={active ? '#F5E8E4' : 'none'}
        />
        <polyline points="14 2 14 8 20 8" stroke={active ? '#C8614A' : '#8C7D6B'} strokeWidth="2" />
        <line x1="8" y1="13" x2="16" y2="13" stroke={active ? '#C8614A' : '#8C7D6B'} strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="17" x2="12" y2="17" stroke={active ? '#C8614A' : '#8C7D6B'} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Me',
    exact: false,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
          stroke={active ? '#C8614A' : '#8C7D6B'}
          strokeWidth="2"
        />
        <circle
          cx="12" cy="7" r="4"
          stroke={active ? '#C8614A' : '#8C7D6B'}
          strokeWidth="2"
          fill={active ? '#F5E8E4' : 'none'}
        />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()
  const { totalItems } = useCart()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item, idx) => {
        // Insert FAB between Search and Cart
        const showFab = idx === 2

        const active = isActive(item.href, item.exact ?? false)

        return (
          <div key={item.href} style={{ display: 'flex', alignItems: 'center', gap: showFab ? 0 : 0 }}>
            {/* FAB (+ button) inserted between Search and Cart */}
            {showFab && (
              <Link href="/marketplace/search" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 4px', position: 'relative', top: -14 }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#C8614A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(200,97,74,.45)',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </Link>
            )}

            <Link href={item.href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minWidth: 48, padding: '2px 4px', position: 'relative' }}>
              <span style={{ position: 'relative' }}>
                {item.icon(active)}
                {/* Cart badge */}
                {item.isCart && totalItems > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    background: '#C8614A',
                    color: 'white',
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    fontSize: 9,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white',
                  }}>
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </span>
              <span style={{
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                color: active ? '#C8614A' : '#8C7D6B',
                lineHeight: 1,
              }}>
                {item.label}
              </span>
            </Link>
          </div>
        )
      })}
    </nav>
  )
}

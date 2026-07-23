'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cart-context'

const NAV_LINKS = [
  { href: '/marketplace', label: 'All' },
  { href: '/marketplace/category/embroidery', label: 'Embroidery' },
  { href: '/marketplace/category/food', label: 'Food' },
  { href: '/marketplace/category/crafts', label: 'Crafts' },
  { href: '/marketplace/category/home', label: 'Home' },
  { href: '/marketplace/category/textiles', label: 'Textiles' },
]

export function TopNav() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/marketplace'
      ? pathname === '/marketplace'
      : pathname.startsWith(href)

  const goSearch = () => {
    if (searchQ.trim()) window.location.href = `/marketplace/search?q=${encodeURIComponent(searchQ.trim())}`
  }

  return (
    <>
      {/* Announcement bar */}
      <div style={{
        background: '#2D7A7A', color: 'white', textAlign: 'center',
        padding: '8px 20px', fontSize: 12, fontWeight: 500, lineHeight: 1.4,
      }}>
        🧵 Free pickup available in Lahore, Karachi &amp; Islamabad · Shop handmade, support women artisans
      </div>

      {/* Main nav bar */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #EDE8DF',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 8px rgba(26,21,15,.06)',
      }}>
        {/* Top row */}
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 24px',
          display: 'flex', alignItems: 'center', height: 64, gap: 16,
        }}>
          {/* Logo */}
          <Link href="/marketplace" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg,#C8614A,#2D7A7A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>🧵</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1A150F', lineHeight: 1 }}>HunarmandAI</div>
              <div style={{ fontSize: 10, color: '#8C7D6B', lineHeight: 1.3 }}>Made by women of Pakistan</div>
            </div>
          </Link>

          {/* Desktop search */}
          <div style={{ flex: 1, maxWidth: 520, display: 'flex' }} className="hidden-mobile">
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 8,
              background: '#F5F1EA', border: '1.5px solid #EDE8DF',
              borderRadius: '12px 0 0 12px', padding: '0 14px', borderRight: 'none',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#8C7D6B" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="#8C7D6B" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="search"
                placeholder="Search handmade products..."
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && goSearch()}
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontSize: 14, color: '#1A150F', padding: '11px 0',
                }}
              />
              {searchQ && (
                <button onClick={() => setSearchQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#8C7D6B" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
              )}
            </div>
            <button
              onClick={goSearch}
              style={{
                padding: '0 20px', background: '#C8614A', color: 'white',
                border: 'none', borderRadius: '0 12px 12px 0',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Search
            </button>
          </div>

          <div style={{ flex: 1 }} className="show-mobile" />

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="show-mobile"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'none' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#4A3E33" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Wishlist */}
            <Link href="/profile" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px',
                background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
                color: '#4A3E33', fontSize: 13, fontWeight: 500,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="#4A3E33" strokeWidth="2"/>
                </svg>
                <span className="hidden-mobile">Saved</span>
              </button>
            </Link>

            {/* Orders */}
            <Link href="/orders" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px',
                background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
                color: '#4A3E33', fontSize: 13, fontWeight: 500,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="hidden-mobile">Orders</span>
              </button>
            </Link>

            {/* Cart */}
            <Link href="/cart" style={{ textDecoration: 'none' }}>
              <button style={{
                position: 'relative', display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 14px', background: '#F5F1EA', border: '1px solid #EDE8DF',
                borderRadius: 10, cursor: 'pointer',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="6" x2="21" y2="6" stroke="#4A3E33" strokeWidth="2"/>
                  <path d="M16 10a4 4 0 01-8 0" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {totalItems > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    background: '#C8614A', color: 'white', borderRadius: '50%',
                    width: 18, height: 18, fontSize: 10, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid white',
                  }}>
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
                <span className="hidden-mobile" style={{ fontSize: 13, fontWeight: 600, color: '#1A150F' }}>
                  Cart
                </span>
              </button>
            </Link>

            {/* Sign in avatar */}
            <Link href="/auth" style={{ textDecoration: 'none' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg,#C8614A,#2D7A7A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: 'white', cursor: 'pointer', flexShrink: 0,
              }}>
                AR
              </div>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="show-mobile"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 4px', display: 'none' }}
            >
              {menuOpen
                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round"/></svg>
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><line x1="3" y1="6" x2="21" y2="6" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="12" x2="21" y2="12" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="18" x2="21" y2="18" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Category nav row — desktop */}
        <div className="hidden-mobile" style={{ borderTop: '1px solid #F5F1EA' }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto', padding: '0 24px',
            display: 'flex', alignItems: 'center', gap: 2, overflowX: 'auto',
          }}>
            {NAV_LINKS.map(link => (
              <NavLink key={link.href} href={link.href} label={link.label} active={isActive(link.href)} />
            ))}
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="show-mobile" style={{ padding: '10px 16px', borderTop: '1px solid #EDE8DF', display: 'flex', gap: 0 }}>
            <input
              autoFocus
              type="search"
              placeholder="Search handmade products..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { goSearch(); setMobileSearchOpen(false) }}}
              style={{
                flex: 1, padding: '10px 14px', border: '1.5px solid #EDE8DF', borderRight: 'none',
                borderRadius: '10px 0 0 10px', fontSize: 14, outline: 'none', background: '#F5F1EA',
              }}
            />
            <button
              onClick={() => { goSearch(); setMobileSearchOpen(false) }}
              style={{
                padding: '10px 16px', background: '#C8614A', color: 'white',
                border: 'none', borderRadius: '0 10px 10px 0', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              }}
            >
              Go
            </button>
          </div>
        )}

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="show-mobile" style={{ borderTop: '1px solid #EDE8DF', background: 'white', padding: '8px 0 16px' }}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block', padding: '11px 20px', fontSize: 15,
                  fontWeight: isActive(link.href) ? 700 : 400,
                  color: isActive(link.href) ? '#C8614A' : '#4A3E33',
                  textDecoration: 'none', borderBottom: '1px solid #F5F1EA',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/orders" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '11px 20px', fontSize: 15, color: '#4A3E33', textDecoration: 'none', borderBottom: '1px solid #F5F1EA' }}>My Orders</Link>
            <Link href="/profile" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '11px 20px', fontSize: 15, color: '#4A3E33', textDecoration: 'none', borderBottom: '1px solid #F5F1EA' }}>Profile</Link>
            <Link href="/auth" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '11px 20px', fontSize: 15, color: '#4A3E33', textDecoration: 'none' }}>Sign in / Sign out</Link>
          </div>
        )}
      </header>

      <style>{`
        @media(max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media(min-width: 641px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', padding: '10px 16px',
        fontSize: 13, fontWeight: active ? 700 : 500,
        color: active || hovered ? '#C8614A' : '#4A3E33',
        textDecoration: 'none', whiteSpace: 'nowrap',
        borderBottom: `2.5px solid ${active ? '#C8614A' : 'transparent'}`,
        transition: 'color .12s, border-color .12s',
      }}
    >
      {label}
    </Link>
  )
}

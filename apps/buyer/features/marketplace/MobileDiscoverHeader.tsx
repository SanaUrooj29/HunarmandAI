'use client'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export function MobileDiscoverHeader() {
  const { totalItems } = useCart()
  return (
    <div style={{
      background: 'white',
      padding: '16px 20px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      borderBottom: '1px solid #EDE8DF',
    }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1A150F', lineHeight: 1 }}>Discover</h1>
        <p style={{ fontSize: 13, color: '#8C7D6B', marginTop: 2 }}>Curated for you</p>
      </div>
      <Link href="/cart" style={{ textDecoration: 'none' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: '#C8614A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="2"/>
              <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          {totalItems > 0 && (
            <span style={{
              position: 'absolute', top: -2, right: -2,
              background: '#1A150F', color: 'white',
              borderRadius: '50%', width: 16, height: 16,
              fontSize: 9, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid white',
            }}>
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </div>
      </Link>
    </div>
  )
}

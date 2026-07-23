'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Seller } from '@/lib/mock/data'

export function SellerCard({ seller }: { seller: Seller }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={`/storefront/${seller.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'white', borderRadius: 16, padding: '20px 22px',
          border: '1.5px solid #EDE8DF', textAlign: 'center', width: 170,
          boxShadow: hovered ? '0 8px 24px rgba(26,21,15,.10)' : '0 2px 8px rgba(26,21,15,.05)',
          transform: hovered ? 'translateY(-3px)' : 'none',
          transition: 'transform .16s ease, box-shadow .16s ease',
        }}
      >
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg,#C8614A,#2D7A7A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 800, color: 'white', margin: '0 auto 10px',
        }}>
          {seller.initials}
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#1A150F', marginBottom: 3 }}>{seller.name}</p>
        <p style={{ fontSize: 12, color: '#8C7D6B', marginBottom: 8 }}>{seller.city}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <span style={{ color: '#F5A623', fontSize: 13 }}>★</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#4A3E33' }}>{seller.rating}</span>
          <span style={{ fontSize: 11, color: '#B8AC9B' }}>({seller.reviewCount})</span>
        </div>
        <p style={{ fontSize: 11, color: '#8C7D6B', marginTop: 4 }}>{seller.products} products</p>
      </div>
    </Link>
  )
}

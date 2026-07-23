'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MOCK_PRODUCTS, MOCK_SELLERS, CATEGORIES, getGradient } from '@/lib/mock/data'
import { formatPKR } from '@/lib/utils'

// Compact mobile product card matching the prototype
function MobileProductCard({ product }: { product: typeof MOCK_PRODUCTS[0] }) {
  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', flexShrink: 0, width: 160 }}>
      <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '1px solid #EDE8DF' }}>
        <div style={{ height: 120, background: getGradient(product.id), position: 'relative' }}>
          {product.isTopSeller && (
            <span style={{ position: 'absolute', bottom: 6, right: 6, background: '#C8614A', color: 'white', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 999 }}>
              Top seller
            </span>
          )}
        </div>
        <div style={{ padding: '10px 10px 12px' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#1A150F', lineHeight: 1.3, marginBottom: 3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.title}
          </p>
          <p style={{ fontSize: 11, color: '#8C7D6B', marginBottom: 4 }}>{product.seller.name.split("'")[0]} · {product.seller.city}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1A150F' }}>{formatPKR(product.price)}</span>
            <span style={{ fontSize: 11, color: '#F5A623', fontWeight: 600 }}>★ {product.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Full-width marketplace product card (2-col grid)
function MobileGridCard({ product }: { product: typeof MOCK_PRODUCTS[0] }) {
  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '1px solid #EDE8DF' }}>
        <div style={{ height: 140, background: getGradient(product.id), position: 'relative' }}>
          {product.isTopSeller && (
            <span style={{ position: 'absolute', bottom: 8, right: 8, background: '#C8614A', color: 'white', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 999 }}>
              Top seller
            </span>
          )}
        </div>
        <div style={{ padding: '10px 12px 12px' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#1A150F', lineHeight: 1.3, marginBottom: 3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.title}
          </p>
          <p style={{ fontSize: 11, color: '#8C7D6B', marginBottom: 5 }}>{product.seller.name.split("'")[0]} · {product.seller.city}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1A150F' }}>{formatPKR(product.price)}</span>
            <span style={{ fontSize: 11, color: '#F5A623' }}>★ {product.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function MobileMarketplace() {
  const [activeCategory, setActiveCategory] = useState('All')

  const cats = ['All', 'Embroidery', 'Food', 'Crafts', 'Home', 'Textiles']
  const filteredProducts = activeCategory === 'All'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter(p => p.category === activeCategory)

  return (
    <div style={{ background: '#FAF7F2' }}>

      {/* ── DISCOVER TAB ── */}

      {/* Top sellers near you */}
      <section style={{ padding: '20px 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A150F' }}>Top sellers near you</h2>
          <Link href="/marketplace/search" style={{ fontSize: 13, fontWeight: 600, color: '#C8614A', textDecoration: 'none' }}>See all</Link>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 20px 4px' }} className="scrollbar-hide">
          {MOCK_SELLERS.map(seller => (
            <Link key={seller.id} href={`/storefront/${seller.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ background: 'white', borderRadius: 14, padding: '16px 18px', border: '1px solid #EDE8DF', textAlign: 'center', minWidth: 130, boxShadow: '0 2px 8px rgba(26,21,15,.04)' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#D9D0C4,#8C7D6B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'white', margin: '0 auto 8px' }}>
                  {seller.initials}
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1A150F', marginBottom: 2 }}>{seller.name}</p>
                <p style={{ fontSize: 11, color: '#8C7D6B', marginBottom: 6 }}>{seller.city}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                  <span style={{ color: '#F5A623', fontSize: 12 }}>★</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#4A3E33' }}>{seller.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stories from sellers */}
      <section style={{ padding: '24px 20px 0' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A150F', marginBottom: 12 }}>Stories from sellers</h2>
        <div style={{ borderRadius: 16, overflow: 'hidden', height: 180, position: 'relative', background: 'linear-gradient(135deg,#A84E3A 0%,#C8614A 50%,#8C7D6B 100%)', cursor: 'pointer' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.65) 0%, transparent 55%)' }}/>
          <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.7)', letterSpacing: '.1em', marginBottom: 6 }}>STORY · 3 MIN READ</p>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', lineHeight: 1.3 }}>
              How Fatima built a 14-product store from her courtyard
            </h3>
          </div>
        </div>
      </section>

      {/* New this week */}
      <section style={{ padding: '24px 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A150F' }}>New this week</h2>
          <Link href="/marketplace/search?sort=new" style={{ fontSize: 13, fontWeight: 600, color: '#C8614A', textDecoration: 'none' }}>See all</Link>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 20px 4px' }} className="scrollbar-hide">
          {MOCK_PRODUCTS.slice(0, 6).map(p => <MobileProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── MARKETPLACE VIEW (matches 2nd mobile screen) ── */}
      <div style={{ marginTop: 28, padding: '0 0 20px' }}>
        {/* Deliver to bar */}
        <div style={{ background: 'white', padding: '12px 20px', borderBottom: '1px solid #EDE8DF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 11, color: '#8C7D6B', marginBottom: 1 }}>Deliver to</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#C8614A" strokeWidth="2.5" fill="#F5E8E4"/><circle cx="12" cy="10" r="3" stroke="#C8614A" strokeWidth="2"/></svg>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1A150F' }}>Gulberg, Lahore</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#1A150F" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, position: 'relative' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#4A3E33" strokeWidth="2"/></svg>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ padding: '12px 20px', background: 'white', borderBottom: '1px solid #EDE8DF' }}>
          <Link href="/marketplace/search" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F5F1EA', borderRadius: 999, padding: '10px 16px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#8C7D6B" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="#8C7D6B" strokeWidth="2" strokeLinecap="round"/></svg>
              <span style={{ fontSize: 14, color: '#8C7D6B' }}>Search hand-made products...</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 'auto' }}><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke="#8C7D6B" strokeWidth="2"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="#8C7D6B" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          </Link>
        </div>

        {/* Support women artisans banner */}
        <div style={{ margin: '16px 20px 0' }}>
          <div style={{ borderRadius: 16, background: '#2D7A7A', padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,.07)' }}/>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.65)', letterSpacing: '.1em', marginBottom: 8 }}>SUPPORT WOMEN ARTISANS</p>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 14 }}>
              Hand-made by 1,200+ women across Pakistan
            </h3>
            <Link href="/marketplace/search" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '9px 18px', background: 'white', color: '#2D7A7A', border: 'none', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                Explore stories
              </button>
            </Link>
          </div>
        </div>

        {/* Category pills */}
        <div style={{ padding: '14px 0 0', overflowX: 'auto' }} className="scrollbar-hide">
          <div style={{ display: 'flex', gap: 8, padding: '0 20px', flexWrap: 'nowrap' }}>
            {cats.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0,
                  padding: '7px 14px',
                  borderRadius: 999,
                  border: activeCategory === cat ? 'none' : '1.5px solid #EDE8DF',
                  background: activeCategory === cat ? '#C8614A' : 'white',
                  color: activeCategory === cat ? 'white' : '#6B5D4E',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  whiteSpace: 'nowrap',
                }}
              >
                {activeCategory === cat && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="white"/>
                  </svg>
                )}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Near you header with Filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A150F' }}>Near you · Lahore</h3>
          <Link href="/marketplace/search" style={{ fontSize: 14, fontWeight: 600, color: '#C8614A', textDecoration: 'none' }}>Filter</Link>
        </div>

        {/* 2-col product grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, padding: '0 20px' }}>
          {filteredProducts.slice(0, 8).map(p => <MobileGridCard key={p.id} product={p} />)}
        </div>

        {filteredProducts.length > 8 && (
          <div style={{ padding: '16px 20px 0' }}>
            <Link href="/marketplace/search" style={{ textDecoration: 'none', display: 'block' }}>
              <button style={{ width: '100%', padding: 13, background: 'white', border: '1.5px solid #EDE8DF', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#4A3E33', cursor: 'pointer' }}>
                View all products →
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

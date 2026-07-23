'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MOCK_PRODUCTS, CATEGORIES } from '@/lib/mock/data'
import { ProductCard } from '@/components/buyer/ProductCard'
import { formatPKR } from '@/lib/utils'
import { getGradient } from '@/lib/mock/data'

export default function CategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const cat = CATEGORIES.find(c => c.id === params.id)
  const [sortBy, setSortBy] = useState('Best match')
  const products = params.id === 'all'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter(p => p.category.toLowerCase() === params.id.toLowerCase())

  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price
    if (sortBy === 'Price: High to Low') return b.price - a.price
    if (sortBy === 'Top rated') return b.rating - a.rating
    return 0
  })

  // Mobile compact card
  const MobileListCard = ({ product }: { product: typeof MOCK_PRODUCTS[0] }) => (
    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <div style={{ display: 'flex', gap: 12, padding: '12px', background: 'white', borderRadius: 14, border: '1px solid #EDE8DF' }}>
        <div style={{ width: 74, height: 74, borderRadius: 10, background: getGradient(product.id), flexShrink: 0, position: 'relative' }}>
          {product.isTopSeller && (
            <span style={{ position: 'absolute', bottom: 4, right: 4, background: '#C8614A', color: 'white', fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 999 }}>Top</span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1A150F', lineHeight: 1.3, marginBottom: 3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.title}
          </p>
          <p style={{ fontSize: 11, color: '#8C7D6B', marginBottom: 4 }}>{product.seller.name} · {product.seller.city}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1A150F' }}>{formatPKR(product.price)}</span>
            {product.originalPrice && (
              <span style={{ fontSize: 11, color: '#B8AC9B', textDecoration: 'line-through' }}>{formatPKR(product.originalPrice)}</span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#F5A623', fontWeight: 600 }}>★ {product.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100dvh' }}>

      {/* ═══ MOBILE ═══ */}
      <div className="mobile-only" style={{ display: 'none', flexDirection: 'column' }}>
        {/* Sticky header */}
        <div style={{ background: 'white', borderBottom: '1px solid #EDE8DF', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 style={{ fontSize: 17, fontWeight: 800, color: '#1A150F', flex: 1 }}>
              {cat?.icon} {cat?.label || params.id}
            </h1>
            <Link href="/marketplace/search" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="#4A3E33" strokeWidth="2" />
                  <path d="M21 21l-4.35-4.35" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </Link>
          </div>
          {/* Sort + count row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px 10px' }}>
            <p style={{ fontSize: 13, color: '#8C7D6B' }}>
              <strong style={{ color: '#1A150F' }}>{sorted.length}</strong> products
            </p>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ fontSize: 13, fontWeight: 600, color: '#4A3E33', border: '1px solid #EDE8DF', borderRadius: 8, padding: '5px 8px', background: 'white', cursor: 'pointer', outline: 'none' }}
            >
              {['Best match', 'Price: Low to High', 'Price: High to Low', 'Top rated'].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>{cat?.icon || '🧵'}</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#1A150F', marginBottom: 8 }}>No products yet</p>
            <Link href="/marketplace"><button style={{ marginTop: 12, padding: '11px 22px', background: '#C8614A', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Back to marketplace</button></Link>
          </div>
        ) : (
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sorted.map(p => <MobileListCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      {/* ═══ DESKTOP ═══ */}
      <div className="desktop-only">
        <div style={{ background: 'white', borderBottom: '1px solid #EDE8DF', padding: '28px 24px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#8C7D6B' }}>
              <Link href="/marketplace" style={{ textDecoration: 'none', color: '#8C7D6B' }}>Home</Link>
              <span>›</span>
              <span style={{ color: '#1A150F', fontWeight: 500 }}>{cat?.label || params.id}</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1A150F', marginBottom: 6 }}>
              {cat?.icon} {cat?.label || params.id}
            </h1>
            <p style={{ fontSize: 14, color: '#8C7D6B' }}>{products.length} handmade products</p>
          </div>
        </div>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px 48px' }}>
          {sorted.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>{cat?.icon || '🧵'}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#1A150F', marginBottom: 8 }}>No products yet in {cat?.label}</p>
              <Link href="/marketplace" style={{ textDecoration: 'none' }}>
                <button style={{ marginTop: 12, padding: '12px 24px', background: '#C8614A', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Back to marketplace</button>
              </Link>
            </div>
          ) : (
            <div className="product-grid">
              {sorted.map(p => <ProductCard key={p.id} product={p} layout="grid" />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

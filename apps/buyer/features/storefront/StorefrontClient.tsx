'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Seller, Product } from '@/lib/mock/data'
import { MOCK_PRODUCTS } from '@/lib/mock/data'
import { ProductCard } from '@/components/buyer/ProductCard'
import { StarRating } from '@/components/ui/StarRating'

export function StorefrontClient({ seller, allProducts }: { seller: Seller; allProducts: Product[] }) {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('All')
  const [following, setFollowing] = useState(false)
  const [tabHover, setTabHover] = useState<string | null>(null)

  const cats = ['All', ...seller.categories]
  const products = activeCategory === 'All'
    ? allProducts
    : MOCK_PRODUCTS.filter(p => p.category === activeCategory).slice(0, 6)

  const StatBar = () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {[['Products', seller.products], ['Sales', seller.sales], ['On-time', `${seller.onTimeRate}%`], ['Rating', seller.rating]].map(([l, v]) => (
        <div key={l as string} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#1A150F', marginBottom: 2 }}>{v}</div>
          <div style={{ fontSize: 12, color: '#8C7D6B' }}>{l}</div>
        </div>
      ))}
    </div>
  )

  const CategoryTabs = () => (
    <div style={{ display: 'flex', gap: 0, overflowX: 'auto', borderTop: '1px solid #EDE8DF' }} className="scrollbar-hide">
      {cats.map(cat => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          onMouseEnter={() => setTabHover(cat)}
          onMouseLeave={() => setTabHover(null)}
          style={{
            padding: '12px 16px', background: 'none', border: 'none',
            borderBottom: `2.5px solid ${activeCategory === cat ? '#C8614A' : (tabHover === cat ? '#D9D0C4' : 'transparent')}`,
            color: activeCategory === cat ? '#C8614A' : (tabHover === cat ? '#1A150F' : '#6B5D4E'),
            fontSize: 14, fontWeight: activeCategory === cat ? 700 : 500,
            cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .12s', flexShrink: 0,
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  )

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100dvh' }}>

      {/* ═══ MOBILE ═══ */}
      <div className="mobile-only" style={{ display: 'none', flexDirection: 'column' }}>
        {/* Banner */}
        <div style={{ height: 180, background: 'linear-gradient(135deg,#A84E3A 0%,#C8614A 40%,#2D7A7A 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,255,255,.03) 0,rgba(255,255,255,.03) 2px,transparent 2px,transparent 20px)' }} />
          <div style={{ position: 'absolute', top: 14, left: 16, right: 16, display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button onClick={() => setFollowing(!following)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill={following ? '#F5A623' : 'none'}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="white" strokeWidth="2" /></svg>
            </button>
          </div>
        </div>

        {/* Profile card */}
        <div style={{ background: 'white', borderBottom: '1px solid #EDE8DF' }}>
          <div style={{ padding: '0 20px 20px' }}>
            {/* Avatar + name row */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: -28, marginBottom: 14 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#D9D0C4,#8C7D6B)', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                {seller.initials}
              </div>
              <div style={{ paddingBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h1 style={{ fontSize: 18, fontWeight: 800, color: '#1A150F' }}>{seller.name}</h1>
                  {seller.verified && <span style={{ background: '#2D7A7A', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999 }}>✓ Verified</span>}
                </div>
                <p style={{ fontSize: 12, color: '#8C7D6B' }}>📍 {seller.city} · Since {seller.joinedDate}</p>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#6B5D4E', lineHeight: 1.6, marginBottom: 14 }}>{seller.bio}</p>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, background: '#FAF7F2', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
              {[['Products', seller.products], ['Sales', seller.sales], ['On-time', `${seller.onTimeRate}%`], ['Rating', seller.rating]].map(([l, v], i) => (
                <div key={l as string} style={{ textAlign: 'center', padding: '10px 4px', borderRight: i < 3 ? '1px solid #EDE8DF' : 'none' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#1A150F', marginBottom: 2 }}>{v}</div>
                  <div style={{ fontSize: 10, color: '#8C7D6B' }}>{l}</div>
                </div>
              ))}
            </div>

            <StarRating rating={seller.rating} count={seller.reviewCount} />

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" style={{ flex: 1, textDecoration: 'none' }}>
                <button style={{ width: '100%', padding: '11px', background: '#C8614A', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413zM12 2C6.477 2 2 6.477 2 12c0 1.778.468 3.447 1.28 4.895L2 22l5.252-1.265A9.952 9.952 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" /></svg>
                  Message
                </button>
              </a>
              <button
                onClick={() => setFollowing(!following)}
                style={{ flex: 1, padding: '11px', background: following ? '#C8614A' : 'white', color: following ? 'white' : '#4A3E33', border: `1.5px solid ${following ? '#C8614A' : '#EDE8DF'}`, borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all .12s' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill={following ? 'white' : 'none'}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={following ? 'white' : '#C8614A'} strokeWidth="2" /></svg>
                {following ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
          <CategoryTabs />
        </div>

        {/* Products */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
            {products.map(p => <ProductCard key={p.id} product={p} layout="grid" />)}
          </div>
        </div>
      </div>

      {/* ═══ DESKTOP ═══ */}
      <div className="desktop-only">
        <div style={{ height: 200, background: 'linear-gradient(135deg,#A84E3A 0%,#C8614A 40%,#2D7A7A 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,255,255,.03) 0,rgba(255,255,255,.03) 2px,transparent 2px,transparent 20px)' }} />
        </div>
        <div style={{ background: 'white', borderBottom: '1px solid #EDE8DF' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, marginTop: -40, marginBottom: 18, flexWrap: 'wrap' }}>
              <div style={{ width: 78, height: 78, borderRadius: '50%', background: 'linear-gradient(135deg,#D9D0C4,#8C7D6B)', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: 'white', flexShrink: 0, boxShadow: '0 4px 16px rgba(26,21,15,.15)' }}>
                {seller.initials}
              </div>
              <div style={{ flex: 1, paddingBottom: 4, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1A150F', margin: 0 }}>{seller.name}</h1>
                  {seller.verified && <span style={{ background: '#2D7A7A', color: 'white', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>✓ Verified</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#8C7D6B' }}>
                  <span>📍 {seller.city}</span>
                  <span style={{ color: '#D9D0C4' }}>·</span>
                  <span>Member since {seller.joinedDate}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, paddingBottom: 4 }}>
                <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#C8614A', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413zM12 2C6.477 2 2 6.477 2 12c0 1.778.468 3.447 1.28 4.895L2 22l5.252-1.265A9.952 9.952 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" /></svg>
                    Message
                  </button>
                </a>
                <button onClick={() => setFollowing(!following)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: following ? '#C8614A' : 'white', color: following ? 'white' : '#4A3E33', border: `1.5px solid ${following ? '#C8614A' : '#EDE8DF'}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all .12s' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill={following ? 'white' : 'none'}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={following ? 'white' : '#C8614A'} strokeWidth="2" /></svg>
                  {following ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
            <p style={{ fontSize: 14, color: '#6B5D4E', lineHeight: 1.7, maxWidth: 560, marginBottom: 18 }}>{seller.bio}</p>
            <StatBar />
            <div style={{ marginTop: 14 }}><StarRating rating={seller.rating} count={seller.reviewCount} size="md" /></div>
          </div>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}><CategoryTabs /></div>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 48px' }}>
          <div className="product-grid">
            {products.map(p => <ProductCard key={p.id} product={p} layout="grid" />)}
          </div>
        </div>
      </div>
    </div>
  )
}

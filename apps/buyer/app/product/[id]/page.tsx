'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MOCK_PRODUCTS, getGradient } from '@/lib/mock/data'
import { formatPKR } from '@/lib/utils'
import { StarRating } from '@/components/ui/StarRating'
import { ProductCard } from '@/components/buyer/ProductCard'
import { useCart } from '@/lib/cart-context'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { add, items } = useCart()
  const [wishlisted, setWishlisted] = useState(false)
  const [added, setAdded] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const [reviewFilter, setReviewFilter] = useState<number | null>(null)
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({})

  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0]
  const related = MOCK_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const inCart = items.some(i => i.productId === product.id)
  const reviews = product.reviews || []
  const filteredReviews = reviewFilter ? reviews.filter(r => r.rating === reviewFilter) : reviews
  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length ? Math.round(reviews.filter(r => r.rating === star).length / reviews.length * 100) : 0,
  }))

  const handleAdd = () => { add(product.id); setAdded(true); setTimeout(() => setAdded(false), 2000) }
  const IMAGES = [0, 1, 2].map(i => getGradient(product.id + i))

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100dvh' }}>

      {/* ═══════════════ MOBILE LAYOUT ═══════════════ */}
      <div className="mobile-only" style={{ display: 'none', flexDirection: 'column' }}>

        {/* Hero image */}
        <div style={{ position: 'relative', background: IMAGES[activeImg], height: 320, flexShrink: 0 }}>
          {/* Top controls */}
          <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => router.back()}
              style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.12)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A150F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.12)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? '#C8614A' : 'none'}>
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="#C8614A" strokeWidth="2" />
                </svg>
              </button>
              <button
                style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.12)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1A150F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content slides up over image */}
        <div style={{ background: 'white', borderRadius: '20px 20px 0 0', marginTop: -20, padding: '20px 20px 16px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#2D8A5A', background: '#E4F5EC', borderRadius: 999, padding: '4px 10px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2D8A5A', display: 'inline-block' }} />IN STOCK
            </span>
            <span style={{ fontSize: 12, color: '#B8AC9B' }}>Listed {product.listedAgo}</span>
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1A150F', lineHeight: 1.2, marginBottom: 10 }}>{product.title}</h1>
          <div style={{ marginBottom: 14 }}><StarRating rating={product.rating} count={product.reviewCount} size="md" /></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 30, fontWeight: 900, color: '#1A150F' }}>{formatPKR(product.price)}</span>
            {product.deliveryNote && (
              <span style={{ fontSize: 12, fontWeight: 600, color: '#2D8A5A', background: '#E4F5EC', borderRadius: 999, padding: '4px 10px' }}>{product.deliveryNote}</span>
            )}
          </div>

          {/* Seller card */}
          <div style={{ border: '1px solid #EDE8DF', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#D9D0C4,#8C7D6B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white', flexShrink: 0 }}>
              {product.seller.initials}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1A150F' }}>{product.seller.name}</p>
              <p style={{ fontSize: 12, color: '#8C7D6B' }}>
                {product.seller.verified ? 'Verified seller · ' : ''}{product.seller.city}
              </p>
            </div>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: 40, height: 40, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413zM12 2C6.477 2 2 6.477 2 12c0 1.778.468 3.447 1.28 4.895L2 22l5.252-1.265A9.952 9.952 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" /></svg>
            </a>
            <Link href={`/storefront/${product.seller.id}`} style={{ textDecoration: 'none' }}>
              <button style={{ padding: '8px 16px', background: 'white', border: '1.5px solid #EDE8DF', borderRadius: 999, fontSize: 13, fontWeight: 600, color: '#4A3E33', cursor: 'pointer' }}>Visit</button>
            </Link>
          </div>
        </div>

        {/* About */}
        {product.description && (
          <div style={{ background: 'white', marginTop: 8, padding: '16px 20px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A150F', marginBottom: 8 }}>About this product</h3>
            <p style={{ fontSize: 14, color: '#6B5D4E', lineHeight: 1.7 }}>{product.description}</p>
          </div>
        )}

        {/* Reviews (mobile) */}
        {reviews.length > 0 && (
          <div style={{ background: 'white', marginTop: 8, padding: '16px 20px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A150F', marginBottom: 12 }}>Reviews ({reviews.length})</h3>
            {/* Quick rating summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px', background: '#FAF7F2', borderRadius: 12, marginBottom: 14 }}>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#1A150F', lineHeight: 1 }}>{product.rating.toFixed(1)}</div>
                <div style={{ marginTop: 4 }}><StarRating rating={product.rating} /></div>
              </div>
              <div style={{ flex: 1 }}>
                {ratingBreakdown.slice(0, 5).map(({ star, pct }) => (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: '#8C7D6B', width: 10 }}>{star}</span>
                    <div style={{ flex: 1, height: 5, background: '#EDE8DF', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#F5A623', borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Review cards */}
            {reviews.slice(0, 3).map(review => (
              <div key={review.id} style={{ padding: '12px', background: '#FAF7F2', borderRadius: 12, border: '1px solid #EDE8DF', marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1A150F' }}>{review.author}</span>
                  <span style={{ fontSize: 11, color: '#B8AC9B' }}>{review.date}</span>
                </div>
                <div style={{ marginBottom: 6 }}><StarRating rating={review.rating} /></div>
                <p style={{ fontSize: 13, color: '#6B5D4E', lineHeight: 1.5 }}>{review.text}</p>
                {review.tags && review.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
                    {review.tags.map(tag => (
                      <span key={tag} style={{ padding: '2px 9px', background: 'white', border: '1px solid #EDE8DF', borderRadius: 999, fontSize: 11, color: '#6B5D4E' }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Spacer so content clears fixed CTA */}
        <div style={{ height: 90 }} />

        {/* Fixed bottom CTA */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'white', borderTop: '1px solid #EDE8DF',
          padding: '12px 20px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          display: 'flex', gap: 12, zIndex: 50,
        }}>
          <button
            onClick={handleAdd}
            style={{ flex: 1, padding: '14px', background: 'white', border: '1.5px solid #EDE8DF', borderRadius: 14, fontSize: 15, fontWeight: 600, color: '#4A3E33', cursor: 'pointer' }}
          >
            {inCart ? '✓ In cart' : added ? 'Added!' : 'Add to cart'}
          </button>
          <Link href="/checkout" style={{ flex: 2, textDecoration: 'none' }}>
            <button style={{ width: '100%', padding: '14px', background: '#C8614A', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: 'white', cursor: 'pointer' }}>
              Buy now
            </button>
          </Link>
        </div>
      </div>

      {/* ═══════════════ DESKTOP LAYOUT ═══════════════ */}
      <div className="desktop-only">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 60px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: '#8C7D6B' }}>
            <Link href="/marketplace" style={{ textDecoration: 'none', color: '#8C7D6B' }}>Home</Link>
            <span>›</span>
            <Link href={`/marketplace/category/${product.category.toLowerCase()}`} style={{ textDecoration: 'none', color: '#8C7D6B' }}>{product.category}</Link>
            <span>›</span>
            <span style={{ color: '#1A150F', fontWeight: 500 }}>{product.title}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            {/* Images */}
            <div>
              <div style={{ borderRadius: 20, overflow: 'hidden', background: IMAGES[activeImg], height: 420, position: 'relative', marginBottom: 12 }}>
                {product.isTopSeller && <span style={{ position: 'absolute', top: 16, left: 16, background: '#C8614A', color: 'white', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>⭐ Top seller</span>}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {IMAGES.map((bg, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{ width: 72, height: 72, borderRadius: 10, background: bg, border: `2.5px solid ${activeImg === i ? '#C8614A' : 'transparent'}`, cursor: 'pointer', padding: 0 }} />
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#2D8A5A', background: '#E4F5EC', borderRadius: 999, padding: '4px 10px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2D8A5A', display: 'inline-block' }} />In stock
                </span>
                <span style={{ fontSize: 12, color: '#B8AC9B' }}>Listed {product.listedAgo}</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A150F', lineHeight: 1.2, marginBottom: 12 }}>{product.title}</h1>
              <div style={{ marginBottom: 16 }}><StarRating rating={product.rating} count={product.reviewCount} size="md" /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: '#1A150F' }}>{formatPKR(product.price)}</span>
                {product.originalPrice && <span style={{ fontSize: 18, color: '#B8AC9B', textDecoration: 'line-through' }}>{formatPKR(product.originalPrice)}</span>}
                {product.deliveryNote && <span style={{ fontSize: 12, fontWeight: 600, color: '#2D8A5A', background: '#E4F5EC', borderRadius: 999, padding: '4px 10px' }}>{product.deliveryNote}</span>}
              </div>

              {/* Seller */}
              <div style={{ background: '#FAF7F2', border: '1px solid #EDE8DF', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#C8614A,#2D7A7A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                  {product.seller.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1A150F' }}>{product.seller.name}</p>
                  <p style={{ fontSize: 12, color: '#8C7D6B' }}>{product.seller.verified ? '✓ Verified seller · ' : ''}{product.seller.city}</p>
                </div>
                <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" style={{ width: 38, height: 38, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413zM12 2C6.477 2 2 6.477 2 12c0 1.778.468 3.447 1.28 4.895L2 22l5.252-1.265A9.952 9.952 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" /></svg>
                </a>
                <Link href={`/storefront/${product.seller.id}`} style={{ textDecoration: 'none' }}>
                  <button style={{ padding: '8px 16px', background: 'white', border: '1.5px solid #EDE8DF', borderRadius: 999, fontSize: 13, fontWeight: 600, color: '#4A3E33', cursor: 'pointer' }}>Visit store</button>
                </Link>
              </div>

              {product.description && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1A150F', marginBottom: 8 }}>About this product</h3>
                  <p style={{ fontSize: 14, color: '#6B5D4E', lineHeight: 1.7 }}>{product.description}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={handleAdd} style={{ flex: 1, padding: '14px', background: 'white', border: '1.5px solid #EDE8DF', borderRadius: 14, fontSize: 15, fontWeight: 600, color: '#4A3E33', cursor: 'pointer' }}>
                  {inCart ? '✓ In cart' : added ? 'Added!' : 'Add to cart'}
                </button>
                <Link href="/checkout" style={{ flex: 2, textDecoration: 'none' }}>
                  <button style={{ width: '100%', padding: '14px', background: '#C8614A', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: 'white', cursor: 'pointer' }}>Buy now</button>
                </Link>
                <button onClick={() => setWishlisted(!wishlisted)} style={{ width: 48, height: 48, borderRadius: 12, background: wishlisted ? '#FFF5F3' : '#F5F1EA', border: `1.5px solid ${wishlisted ? '#F5D0C8' : '#EDE8DF'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? '#C8614A' : 'none'}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="#C8614A" strokeWidth="2" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Reviews — desktop */}
          <div style={{ marginTop: 56, background: 'white', borderRadius: 20, border: '1px solid #EDE8DF', padding: '28px 32px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A150F', marginBottom: 24 }}>Customer Reviews ({reviews.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32, marginBottom: 28 }}>
              <div style={{ textAlign: 'center', paddingRight: 24, borderRight: '1px solid #EDE8DF' }}>
                <div style={{ fontSize: 56, fontWeight: 900, color: '#1A150F', lineHeight: 1 }}>{product.rating.toFixed(1)}</div>
                <div style={{ margin: '8px 0' }}><StarRating rating={product.rating} size="lg" /></div>
                <div style={{ fontSize: 13, color: '#8C7D6B' }}>Based on {reviews.length} reviews</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
                {ratingBreakdown.map(({ star, count, pct }) => (
                  <button key={star} onClick={() => setReviewFilter(reviewFilter === star ? null : star)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: '3px 0', width: '100%' }}>
                    <span style={{ fontSize: 13, color: '#4A3E33', width: 16, textAlign: 'right' }}>{star}</span>
                    <span style={{ color: '#F5A623' }}>★</span>
                    <div style={{ flex: 1, height: 8, background: '#F5F1EA', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: reviewFilter === star ? '#C8614A' : '#F5A623', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 12, color: '#8C7D6B', width: 28 }}>{count}</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filteredReviews.map(review => (
                <div key={review.id} style={{ padding: 18, background: '#FAF7F2', borderRadius: 14, border: '1px solid #EDE8DF' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#C8614A,#2D7A7A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'white' }}>
                        {review.author.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#1A150F' }}>{review.author}</p>
                        <p style={{ fontSize: 12, color: '#B8AC9B' }}>{review.date}</p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p style={{ fontSize: 14, color: '#4A3E33', lineHeight: 1.6, marginBottom: review.tags?.length ? 10 : 0 }}>{review.text}</p>
                  {review.tags && review.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                      {review.tags.map(tag => <span key={tag} style={{ padding: '3px 10px', background: 'white', border: '1.5px solid #EDE8DF', borderRadius: 999, fontSize: 11, color: '#6B5D4E' }}>{tag}</span>)}
                    </div>
                  )}
                  <button
                    onClick={() => setHelpfulVotes(prev => ({ ...prev, [review.id]: !prev[review.id] }))}
                    style={{ fontSize: 12, color: helpfulVotes[review.id] ? '#C8614A' : '#8C7D6B', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: helpfulVotes[review.id] ? 600 : 400 }}
                  >
                    👍 Helpful {(review.helpful || 0) + (helpfulVotes[review.id] ? 1 : 0)}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A150F', marginBottom: 20 }}>You might also like</h2>
              <div className="product-grid">
                {related.map(p => <ProductCard key={p.id} product={p} layout="grid" />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

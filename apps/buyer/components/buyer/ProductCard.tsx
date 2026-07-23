'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { Product } from '@/lib/mock/data'
import { getGradient } from '@/lib/mock/data'
import { formatPKR } from '@/lib/utils'
import { StarRating } from '@/components/ui/StarRating'

export function ProductCard({ product, layout = 'grid' }: { product: Product; layout?: 'grid'|'list' }) {
  const [hovered, setHovered] = useState(false)

  if (layout === 'list') {
    return (
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
        <div
          className="card-hover"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ display: 'flex', gap: 14, padding: '14px', background: 'white', borderRadius: 14, border: '1.5px solid #EDE8DF', boxShadow: hovered ? '0 4px 16px rgba(26,21,15,.08)' : '0 2px 8px rgba(26,21,15,.04)' }}
        >
          <div style={{ width: 80, height: 80, borderRadius: 10, background: getGradient(product.id), flexShrink: 0, position: 'relative' }}>
            {product.isTopSeller && <span className="badge badge-tc" style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 9 }}>Top seller</span>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1A150F', lineHeight: 1.3, marginBottom: 3 }} className="line-clamp-2">{product.title}</p>
            <p style={{ fontSize: 12, color: '#8C7D6B', marginBottom: 5 }}>{product.seller.name} · {product.seller.city}</p>
            <StarRating rating={product.rating} count={product.reviewCount} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1A150F' }}>{formatPKR(product.price)}</span>
                {product.originalPrice && <span style={{ fontSize: 12, color: '#B8AC9B', textDecoration: 'line-through', marginLeft: 6 }}>{formatPKR(product.originalPrice)}</span>}
              </div>
              {product.deliveryNote && <span style={{ fontSize: 11, color: '#2D8A5A', fontWeight: 600 }}>{product.deliveryNote}</span>}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '1.5px solid #EDE8DF', boxShadow: hovered ? '0 6px 20px rgba(26,21,15,.1)' : '0 2px 8px rgba(26,21,15,.05)', transition: 'transform .16s ease,box-shadow .16s ease', transform: hovered ? 'translateY(-3px)' : 'none' }}
      >
        <div style={{ height: 180, background: getGradient(product.id), position: 'relative' }}>
          {product.isTopSeller && <span className="badge badge-tc" style={{ position: 'absolute', top: 10, right: 10 }}>Top seller</span>}
          {product.originalPrice && <span className="badge" style={{ position: 'absolute', top: 10, left: 10, background: '#C8614A', color: 'white' }}>{Math.round((1-product.price/product.originalPrice)*100)}% off</span>}
        </div>
        <div style={{ padding: '12px 14px 14px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1A150F', lineHeight: 1.3, marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.title}</p>
          <p style={{ fontSize: 11, color: '#8C7D6B', marginBottom: 6 }}>{product.seller.name} · {product.seller.city}</p>
          <StarRating rating={product.rating} count={product.reviewCount} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1A150F' }}>{formatPKR(product.price)}</span>
              {product.originalPrice && <span style={{ fontSize: 11, color: '#B8AC9B', textDecoration: 'line-through', marginLeft: 5 }}>{formatPKR(product.originalPrice)}</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

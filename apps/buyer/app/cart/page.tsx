'use client'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { formatPKR } from '@/lib/utils'
import { getGradient } from '@/lib/mock/data'

const DELIVERY = 250

export default function CartPage() {
  const { items, remove, update, subtotal } = useCart()
  const total = subtotal + DELIVERY

  const EmptyCart = () => (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <p style={{ fontSize: 56, marginBottom: 16 }}>🛒</p>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#1A150F' }}>Your cart is empty</h2>
      <p style={{ fontSize: 14, color: '#8C7D6B', marginBottom: 24 }}>Discover handmade treasures from artisans across Pakistan</p>
      <Link href="/marketplace" style={{ textDecoration: 'none' }}>
        <button style={{ padding: '12px 24px', background: '#C8614A', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Browse products</button>
      </Link>
    </div>
  )

  const ItemRow = ({ item }: { item: typeof items[0] }) => (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'white', borderRadius: 16, border: '1.5px solid #EDE8DF', padding: '14px', minHeight: 110 }}>
      <div style={{ width: 68, height: 68, borderRadius: 10, background: getGradient(item.productId), flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#1A150F', marginBottom: 3, lineHeight: 1.3 }}>{item.title}</p>
        {item.seller?.name && <p style={{ fontSize: 12, color: '#8C7D6B', marginBottom: 6 }}>{item.seller.name}</p>}
        <p style={{ fontSize: 14, fontWeight: 700, color: '#1A150F', marginBottom: 8 }}>{formatPKR(item.price)}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #EDE8DF', borderRadius: 8, overflow: 'hidden' }}>
            <button onClick={() => update(item.productId, item.quantity - 1)} style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', fontSize: 17, color: '#4A3E33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <span style={{ width: 32, textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#1A150F' }}>{item.quantity}</span>
            <button onClick={() => update(item.productId, item.quantity + 1)} style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', fontSize: 17, color: '#4A3E33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
          <button onClick={() => remove(item.productId)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#B8AC9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  )

  const OrderSummary = ({ sticky }: { sticky?: boolean }) => (
    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #EDE8DF', padding: '20px', ...(sticky ? { position: 'sticky', top: 90 } : {}) }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A150F', marginBottom: 16 }}>Order summary</h3>
      {[['Subtotal', subtotal], ['Delivery (TCS)', DELIVERY]].map(([l, v]) => (
        <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
          <span style={{ fontSize: 14, color: '#6B5D4E' }}>{l as string}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1A150F' }}>{formatPKR(v as number)}</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
        <span style={{ fontSize: 14, color: '#2D8A5A', fontWeight: 600 }}>Platform support 5%</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#2D8A5A' }}>included</span>
      </div>
      <div style={{ height: 1, background: '#EDE8DF', margin: '12px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#1A150F' }}>Total</span>
        <span style={{ fontSize: 17, fontWeight: 800, color: '#1A150F' }}>{formatPKR(total)}</span>
      </div>
      <Link href="/checkout" style={{ textDecoration: 'none', display: 'block' }}>
        <button style={{ width: '100%', padding: '14px', background: '#C8614A', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, color: 'white', cursor: 'pointer' }}>
          Checkout · {formatPKR(total)}
        </button>
      </Link>
    </div>
  )

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100dvh' }}>

      {/* ═══ MOBILE ═══ */}
      <div className="mobile-only" style={{ display: 'none', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: 'white', padding: '14px 20px 12px', borderBottom: '1px solid #EDE8DF', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/marketplace" style={{ textDecoration: 'none', display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: '#1A150F' }}>Your cart</h1>
              <p style={{ fontSize: 12, color: '#8C7D6B' }}>{items.reduce((s, i) => s + i.quantity, 0)} items · {items.length} products</p>
            </div>
          </div>
        </div>

        {items.length === 0 ? <EmptyCart /> : (
          <>
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {items.map(item => <ItemRow key={item.id} item={item} />)}
              {/* Summary inline on mobile */}
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #EDE8DF', padding: '16px' }}>
                {[['Subtotal', subtotal], ['Delivery (TCS)', DELIVERY]].map(([l, v]) => (
                  <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: '#6B5D4E' }}>{l as string}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1A150F' }}>{formatPKR(v as number)}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Fixed checkout bar */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #EDE8DF', padding: '12px 20px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom,0px))', zIndex: 50 }}>
              <Link href="/checkout" style={{ textDecoration: 'none', display: 'block' }}>
                <button style={{ width: '100%', padding: '15px', background: '#C8614A', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, color: 'white', cursor: 'pointer' }}>
                  Checkout · {formatPKR(total)}
                </button>
              </Link>
            </div>
            <div style={{ height: 80 }} />
          </>
        )}
      </div>

      {/* ═══ DESKTOP ═══ */}
      <div className="desktop-only">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 60px' }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A150F', marginBottom: 6 }}>Your cart</h1>
          <p style={{ fontSize: 14, color: '#8C7D6B', marginBottom: 28 }}>
            {items.reduce((s, i) => s + i.quantity, 0)} items · {items.length} products
          </p>
          {items.length === 0 ? <EmptyCart /> : (
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {items.map(item => <ItemRow key={item.id} item={item} />)}
              </div>
              <OrderSummary sticky />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

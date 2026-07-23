'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { formatPKR } from '@/lib/utils'

type PayMethod = 'jazzcash' | 'easypaisa' | 'cod'
const DELIVERY = 250

const METHODS = [
  { id: 'jazzcash' as PayMethod, label: 'JazzCash', sub: 'Wallet — 7890', color: '#E5192A', abbr: 'JC' },
  { id: 'easypaisa' as PayMethod, label: 'EasyPaisa', sub: 'Use a different number', color: '#00A551', abbr: 'EP' },
  { id: 'cod' as PayMethod, label: 'Cash on delivery', subFn: (over: boolean) => over ? 'Not available above PKR 5,000' : 'Available · order under PKR 5,000 only', color: '#8C7D6B', abbr: '💵', codLimit: true },
]

function PaymentOption({ method, selected, onSelect, disabled }: { method: typeof METHODS[0]; selected: boolean; onSelect: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onSelect()}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
        background: selected ? '#FFF5F3' : 'white',
        border: `1.5px solid ${selected ? '#C8614A' : '#EDE8DF'}`,
        borderRadius: 12, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? .5 : 1, textAlign: 'left', transition: 'all .12s', width: '100%',
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, background: method.id === 'cod' ? '#F5F1EA' : method.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: method.id === 'cod' ? 18 : 12, fontWeight: 800, color: 'white', flexShrink: 0 }}>
        {method.abbr}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#1A150F', marginBottom: 2 }}>{method.label}</p>
        <p style={{ fontSize: 12, color: '#8C7D6B' }}>{method.subFn ? method.subFn(!!disabled) : method.sub}</p>
      </div>
      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected ? '#C8614A' : '#D9D0C4'}`, background: selected ? '#C8614A' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .12s' }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
      </div>
    </button>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clear } = useCart()
  const [method, setMethod] = useState<PayMethod>('jazzcash')
  const [loading, setLoading] = useState(false)
  const address = { label: 'Home', full: 'House 14, Block B, Gulberg III, Lahore' }
  const total = subtotal + DELIVERY

  const handlePay = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1600))
    clear()
    router.push('/orders?success=true')
  }

  if (items.length === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60dvh', gap: 16 }}>
      <p style={{ fontSize: 16, color: '#8C7D6B' }}>Your cart is empty</p>
      <Link href="/marketplace" style={{ textDecoration: 'none' }}>
        <button style={{ padding: '12px 24px', background: '#C8614A', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Shop now</button>
      </Link>
    </div>
  )

  const DeliverySection = () => (
    <div style={{ background: 'white', borderRadius: 14, border: '1px solid #EDE8DF', padding: '18px' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7D6B', letterSpacing: '.1em', marginBottom: 14 }}>DELIVER TO</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F5E8E4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#C8614A" strokeWidth="2" /><circle cx="12" cy="10" r="3" stroke="#C8614A" strokeWidth="2" /></svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#1A150F' }}>{address.label}</p>
          <p style={{ fontSize: 13, color: '#6B5D4E' }}>{address.full}</p>
        </div>
        <button style={{ fontSize: 13, fontWeight: 600, color: '#C8614A', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>Change</button>
      </div>
    </div>
  )

  const PaymentSection = () => (
    <div style={{ background: 'white', borderRadius: 14, border: '1px solid #EDE8DF', padding: '18px' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7D6B', letterSpacing: '.1em', marginBottom: 14 }}>PAYMENT METHOD</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {METHODS.map(m => (
          <PaymentOption
            key={m.id}
            method={m}
            selected={method === m.id}
            onSelect={() => setMethod(m.id)}
            disabled={m.codLimit && subtotal > 5000}
          />
        ))}
      </div>
    </div>
  )

  const SummarySection = ({ showTitle }: { showTitle?: boolean }) => (
    <div style={{ background: 'white', borderRadius: 14, border: '1px solid #EDE8DF', padding: '18px' }}>
      {showTitle && <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7D6B', letterSpacing: '.1em', marginBottom: 14 }}>ORDER SUMMARY</p>}
      {[
        [`${items.reduce((s, i) => s + i.quantity, 0)} items`, subtotal],
        ['Delivery', DELIVERY],
      ].map(([l, v]) => (
        <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
          <span style={{ fontSize: 14, color: '#6B5D4E' }}>{l as string}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1A150F' }}>{formatPKR(v as number)}</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
        <span style={{ fontSize: 14, color: '#2D8A5A', fontWeight: 600 }}>Platform support 5%</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#2D8A5A' }}>included</span>
      </div>
    </div>
  )

  const PayButton = () => (
    <button
      onClick={handlePay}
      disabled={loading}
      style={{
        width: '100%', padding: '15px', background: loading ? '#D9D0C4' : '#C8614A',
        border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: 'white',
        cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}
    >
      {loading ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin .8s linear infinite' }}>
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" opacity=".25" />
            <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Processing…
        </>
      ) : (
        <>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" /></svg>
          Pay {formatPKR(total)} securely
        </>
      )}
    </button>
  )

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100dvh' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* ═══ MOBILE ═══ */}
      <div className="mobile-only" style={{ display: 'none', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: 'white', padding: '14px 20px', borderBottom: '1px solid #EDE8DF', position: 'sticky', top: 0, zIndex: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/cart" style={{ textDecoration: 'none', display: 'flex' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#1A150F' }}>Checkout</h1>
        </div>

        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <DeliverySection />
          <PaymentSection />
          <SummarySection showTitle />
        </div>

        {/* Fixed pay button */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #EDE8DF', padding: '12px 20px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom,0px))', zIndex: 50 }}>
          <PayButton />
        </div>
        <div style={{ height: 80 }} />
      </div>

      {/* ═══ DESKTOP ═══ */}
      <div className="desktop-only">
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <Link href="/cart" style={{ textDecoration: 'none', color: '#4A3E33', display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A150F' }}>Checkout</h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <DeliverySection />
              <PaymentSection />
            </div>
            <div style={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SummarySection showTitle />
              <div style={{ background: 'white', borderRadius: 14, border: '1px solid #EDE8DF', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#1A150F' }}>Total</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#1A150F' }}>{formatPKR(total)}</span>
                </div>
                <PayButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

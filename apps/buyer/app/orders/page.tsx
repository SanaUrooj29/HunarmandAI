'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { MOCK_ORDERS } from '@/lib/mock/data'
import { formatPKR } from '@/lib/utils'

type Tab = 'active' | 'past' | 'cancelled'

const STATUS_COLOR: Record<string, string> = { teal: '#2D7A7A', amber: '#C8841A', green: '#2D8A5A', red: '#C84A3A' }
const STATUS_BG: Record<string, string> = { teal: '#E4F0F0', amber: '#FDF3E0', green: '#E4F5EC', red: '#FDECEA' }

const REVIEW_TAGS = ['Great quality', 'Fast delivery', 'As described', 'Beautiful packaging', 'Sweet seller']

export default function OrdersPage() {
  const sp = useSearchParams()
  const [tab, setTab] = useState<Tab>('active')
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const isSuccess = sp.get('success') === 'true'

  const active = MOCK_ORDERS.filter(o => ['in_transit', 'pickup_scheduled'].includes(o.status))
  const past = MOCK_ORDERS.filter(o => o.status === 'delivered')
  const cancelled = MOCK_ORDERS.filter(o => o.status === 'cancelled')
  const lists: Record<Tab, typeof MOCK_ORDERS> = { active, past, cancelled }

  const handleReviewSubmit = () => {
    setSubmitted(true)
    setTimeout(() => { setReviewId(null); setSubmitted(false); setRating(5); setText(''); setTags([]) }, 1500)
  }

  const OrderCard = ({ order }: { order: typeof MOCK_ORDERS[0] }) => (
    <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1.5px solid #EDE8DF' }}>
      <div style={{ padding: '11px 16px', borderBottom: '1px solid #EDE8DF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFAFA' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#4A3E33' }}>#{order.id}</span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', color: STATUS_COLOR[order.statusColor] || '#8C7D6B', background: STATUS_BG[order.statusColor] || '#F5F1EA', borderRadius: 999, padding: '4px 10px' }}>
          {order.statusLabel.toUpperCase()}
        </span>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 13, alignItems: 'center', marginBottom: 14 }}>
          <div style={{ width: 58, height: 58, borderRadius: 10, background: 'linear-gradient(135deg,#E8D5C0,#C8A882)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1A150F', marginBottom: 2 }}>{order.product.title}</p>
            <p style={{ fontSize: 12, color: '#8C7D6B', marginBottom: 2 }}>{order.product.seller}</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#1A150F' }}>{formatPKR(order.product.price)}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {order.status !== 'delivered' && (
            <Link href={`/orders/${order.id}/track`} style={{ flex: 1, textDecoration: 'none' }}>
              <button style={{ width: '100%', padding: '10px', background: 'white', border: '1.5px solid #EDE8DF', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#4A3E33', cursor: 'pointer' }}>Track</button>
            </Link>
          )}
          {order.status === 'delivered' && (
            <button onClick={() => setReviewId(order.id)} style={{ flex: 1, padding: '10px', background: '#C8614A', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer' }}>
              Leave a review
            </button>
          )}
          <button style={{ width: 40, height: 40, background: 'white', border: '1.5px solid #EDE8DF', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#8C7D6B" strokeWidth="2" /></svg>
          </button>
        </div>
      </div>
    </div>
  )

  const TabBar = () => (
    <div style={{ display: 'flex', borderBottom: '2px solid #EDE8DF' }}>
      {(['active', 'past', 'cancelled'] as Tab[]).map(t => (
        <button key={t} onClick={() => setTab(t)} style={{
          padding: '10px 20px', background: 'none', border: 'none',
          borderBottom: `2.5px solid ${tab === t ? '#C8614A' : 'transparent'}`,
          marginBottom: -2, fontSize: 14, fontWeight: tab === t ? 700 : 500,
          color: tab === t ? '#C8614A' : '#8C7D6B', cursor: 'pointer', textTransform: 'capitalize',
        }}>
          {t}
          {t === 'active' && active.length > 0 && (
            <span style={{ marginLeft: 5, background: '#C8614A', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{active.length}</span>
          )}
        </button>
      ))}
    </div>
  )

  const EmptyState = () => (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <p style={{ fontSize: 48, marginBottom: 12 }}>📦</p>
      <p style={{ fontSize: 16, fontWeight: 600, color: '#1A150F', marginBottom: 8 }}>No {tab} orders</p>
      {tab === 'active' && <Link href="/marketplace"><button style={{ marginTop: 12, padding: '12px 24px', background: '#C8614A', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Start shopping</button></Link>}
    </div>
  )

  // Review modal shared
  const ReviewModal = () => (
    <>
      <div onClick={() => setReviewId(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 100, backdropFilter: 'blur(3px)' }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderRadius: '20px 20px 0 0', zIndex: 101, padding: '20px 20px', paddingBottom: 'calc(20px + env(safe-area-inset-bottom,0px))', maxHeight: '92dvh', overflowY: 'auto' }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#D9D0C4' }} />
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E4F5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#2D8A5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#1A150F' }}>Review posted! 🎉</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1A150F' }}>Leave a review</h2>
              <button onClick={() => setReviewId(null)} style={{ background: '#F5F1EA', border: 'none', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </div>

            {/* Product ref */}
            <div style={{ display: 'flex', gap: 12, background: '#FAF7F2', borderRadius: 12, padding: '12px', marginBottom: 20, border: '1px solid #EDE8DF' }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: 'linear-gradient(135deg,#2D7A7A,#4A9A9A)', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#1A150F' }}>Ralli Quilt</p>
                <p style={{ fontSize: 12, color: '#8C7D6B' }}>Khadija · Hyderabad · Delivered Apr 24</p>
              </div>
            </div>

            {/* Stars */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1A150F', marginBottom: 6 }}>How was it?</p>
              <p style={{ fontSize: 13, color: '#8C7D6B', marginBottom: 12 }}>Your review helps Khadija and other buyers.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setRating(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, transform: rating >= s ? 'scale(1.15)' : 'scale(1)', transition: 'transform .1s' }}>
                    <svg width="38" height="38" viewBox="0 0 24 24" fill={s <= rating ? '#F5A623' : '#D9D0C4'} style={{ transition: 'fill .12s' }}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#C8841A' }}>{['', 'Poor', 'Fair', 'Good', 'Great', 'Loved it'][rating]}</p>
            </div>

            {/* Tags */}
            <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7D6B', letterSpacing: '.08em', marginBottom: 10 }}>WHAT STOOD OUT?</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {REVIEW_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setTags(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag])}
                  style={{ padding: '7px 14px', borderRadius: 999, border: `1.5px solid ${tags.includes(tag) ? '#C8614A' : '#EDE8DF'}`, background: tags.includes(tag) ? '#C8614A' : 'white', color: tags.includes(tag) ? 'white' : '#6B5D4E', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Text */}
            <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7D6B', letterSpacing: '.08em', marginBottom: 8 }}>SHARE A FEW WORDS <span style={{ fontWeight: 400 }}>(optional)</span></p>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Stunning craftsmanship — bigger than expected and the colors are vibrant."
              rows={3}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #EDE8DF', borderRadius: 12, fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', marginBottom: 20, lineHeight: 1.5 }}
            />

            <button onClick={handleReviewSubmit} style={{ width: '100%', padding: '15px', background: '#C8614A', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: 'white', cursor: 'pointer' }}>
              Post review
            </button>
          </>
        )}
      </div>
    </>
  )

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100dvh' }}>

      {/* ═══ MOBILE ═══ */}
      <div className="mobile-only" style={{ display: 'none', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: 'white', borderBottom: '1px solid #EDE8DF', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ padding: '16px 20px 0' }}>
            {isSuccess && (
              <div style={{ background: '#E4F5EC', border: '1px solid #A8D8C0', borderRadius: 12, padding: '12px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#2D8A5A" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <p style={{ fontWeight: 600, color: '#2D8A5A', fontSize: 13 }}>Order placed successfully! 🎉</p>
              </div>
            )}
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1A150F', marginBottom: 14 }}>My orders</h1>
          </div>
          <div style={{ padding: '0 20px' }}><TabBar /></div>
        </div>

        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {lists[tab].length === 0 ? <EmptyState /> : lists[tab].map(o => <OrderCard key={o.id} order={o} />)}
        </div>
      </div>

      {/* ═══ DESKTOP ═══ */}
      <div className="desktop-only">
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 60px' }}>
          {isSuccess && (
            <div style={{ background: '#E4F5EC', border: '1px solid #A8D8C0', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#2D8A5A" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div>
                <p style={{ fontWeight: 700, color: '#2D8A5A', fontSize: 15 }}>Order placed successfully! 🎉</p>
                <p style={{ fontSize: 13, color: '#2D8A5A' }}>The artisan has been notified and will prepare your item.</p>
              </div>
            </div>
          )}
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A150F', marginBottom: 20 }}>My orders</h1>
          <div style={{ marginBottom: 24 }}><TabBar /></div>
          {lists[tab].length === 0 ? <EmptyState /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {lists[tab].map(o => <OrderCard key={o.id} order={o} />)}
            </div>
          )}
        </div>
      </div>

      {reviewId && <ReviewModal />}
    </div>
  )
}

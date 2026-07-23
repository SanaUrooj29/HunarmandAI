'use client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MOCK_ORDERS } from '@/lib/mock/data'
import { formatPKR } from '@/lib/utils'

const ICONS: Record<string, React.ReactNode> = {
  check:    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="white" strokeWidth="2"/><line x1="8" y1="2" x2="8" y2="6" stroke="white" strokeWidth="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="white" strokeWidth="2"/></>,
  package:  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="white" strokeWidth="2"/>,
  truck:    <><rect x="1" y="3" width="15" height="13" stroke="white" strokeWidth="2"/><path d="M16 8h4l3 5v4h-7V8z" stroke="white" strokeWidth="2"/><circle cx="5.5" cy="18.5" r="2.5" stroke="white" strokeWidth="2"/><circle cx="18.5" cy="18.5" r="2.5" stroke="white" strokeWidth="2"/></>,
  home:     <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2"/>,
}

function TrackContent({ order }: { order: typeof MOCK_ORDERS[0] }) {
  return (
    <>
      {/* Map visual */}
      <div style={{ borderRadius: 16, overflow: 'hidden', background: '#E4F0F0', height: 180, position: 'relative', border: '1px solid #C8E0E0', marginBottom: 16 }}>
        <svg width="100%" height="180" viewBox="0 0 360 180" preserveAspectRatio="xMidYMid slice">
          {[40, 80, 120].map(y => <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="#C8E0E0" strokeWidth="1" strokeDasharray="4 4" />)}
          {[80, 160, 240, 320].map(x => <line key={x} x1={x} y1="0" x2={x} y2="180" stroke="#C8E0E0" strokeWidth="1" strokeDasharray="4 4" />)}
          <path d="M 40 140 Q 100 70 180 100 Q 240 120 300 55" stroke="#2D7A7A" strokeWidth="2.5" strokeDasharray="8 4" fill="none" />
          <circle cx="40" cy="140" r="6" fill="#2D8A5A" />
          <circle cx="40" cy="140" r="12" fill="rgba(45,138,90,.18)" />
          <rect x="294" y="48" width="12" height="14" rx="2" fill="#1A150F" />
          <circle cx="180" cy="100" r="15" fill="#C8614A" />
          <text x="180" y="105" textAnchor="middle" fontSize="13" fill="white">🚚</text>
        </svg>
        <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'white', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: '#2D7A7A', boxShadow: '0 2px 8px rgba(0,0,0,.1)' }}>
          📍 Currently in Sahiwal hub
        </div>
      </div>

      {/* Status banner */}
      <div style={{ background: '#FFF5F3', border: '1.5px solid #F5D0C8', borderRadius: 14, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: '#C8614A', marginBottom: 5 }}>IN TRANSIT WITH TCS</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#1A150F', marginBottom: 3 }}>Arriving {order.estimatedDelivery?.split(',')[0]}</p>
          {order.courierTrackingId && <p style={{ fontSize: 12, color: '#8C7D6B' }}>Tracking ID: {order.courierTrackingId}</p>}
        </div>
        {order.courierTrackingId && (
          <button onClick={() => navigator.clipboard?.writeText(order.courierTrackingId!)} style={{ padding: '8px 14px', background: 'white', border: '1.5px solid #EDE8DF', borderRadius: 999, fontSize: 13, fontWeight: 600, color: '#4A3E33', cursor: 'pointer' }}>Copy</button>
        )}
      </div>

      {/* Timeline */}
      {order.timeline && order.timeline.length > 0 && (
        <div style={{ background: 'white', borderRadius: 16, padding: '16px', border: '1.5px solid #EDE8DF', marginBottom: 16 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 15, top: 32, bottom: 32, width: 2, background: '#EDE8DF' }} />
            {order.timeline.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '9px 0', position: 'relative' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: step.done ? '#2D8A5A' : '#D9D0C4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">{ICONS[step.icon]}</svg>
                </div>
                <div style={{ paddingTop: 4 }}>
                  <p style={{ fontSize: 14, fontWeight: step.done ? 600 : 400, color: step.done ? '#1A150F' : '#B8AC9B', marginBottom: 2 }}>{step.label}</p>
                  {step.time && <p style={{ fontSize: 12, color: step.done ? '#8C7D6B' : '#D9D0C4' }}>{step.time}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order detail */}
      <div style={{ background: 'white', borderRadius: 16, padding: '16px', border: '1.5px solid #EDE8DF' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1A150F', marginBottom: 12 }}>Order details</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 10, background: 'linear-gradient(135deg,#E8D5C0,#C8A882)', flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1A150F', marginBottom: 2 }}>{order.product.title}</p>
            <p style={{ fontSize: 12, color: '#8C7D6B', marginBottom: 2 }}>{order.product.seller}</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#1A150F' }}>{formatPKR(order.product.price)}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function TrackPage() {
  const { id } = useParams()
  const router = useRouter()
  const order = MOCK_ORDERS.find(o => o.id === id) || MOCK_ORDERS[0]

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100dvh' }}>

      {/* ═══ MOBILE ═══ */}
      <div className="mobile-only" style={{ display: 'none', flexDirection: 'column' }}>
        <div style={{ background: 'white', padding: '14px 20px', borderBottom: '1px solid #EDE8DF', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: '#1A150F' }}>Track order</h1>
              <p style={{ fontSize: 12, color: '#8C7D6B' }}>#{order.id} · est. {order.estimatedDelivery}</p>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px' }}>
          <TrackContent order={order} />
        </div>
      </div>

      {/* ═══ DESKTOP ═══ */}
      <div className="desktop-only">
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#4A3E33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1A150F' }}>Track order</h1>
              <p style={{ fontSize: 13, color: '#8C7D6B' }}>#{order.id} · est. {order.estimatedDelivery}</p>
            </div>
          </div>
          <TrackContent order={order} />
        </div>
      </div>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getBuyerProfile, getBuyerToken, logoutBuyer } from '@/lib/api'

type BuyerProfile = {
  id: string
  phone: string
  name?: string
  age?: number
  preferredLanguage?: string
  credibilityScore?: number
  accountStatus?: string
  createdAt?: string
}

type MenuItem = { icon: string; label: string; href: string }

type MenuSection = { section: string; items: MenuItem[] }

const MENU: MenuSection[] = [
  { section: 'Shopping', items: [
    { icon: '📦', label: 'My orders', href: '/orders' },
    { icon: '❤️', label: 'Saved items', href: '#' },
    { icon: '📍', label: 'Saved addresses', href: '#' },
    { icon: '💳', label: 'Payment methods', href: '#' },
  ]},
  { section: 'Account', items: [
    { icon: '🔔', label: 'Notifications', href: '#' },
    { icon: '🌐', label: 'Language', href: '#' },
    { icon: '🔒', label: 'Privacy & Security', href: '#' },
    { icon: '❓', label: 'Help & Support', href: '#' },
    { icon: '📄', label: 'Terms of Service', href: '#' },
  ]},
]

function MenuRow({ icon, label, href, last }: { icon: string; label: string; href: string; last: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderBottom: last ? 'none' : '1px solid #F5F1EA', background: hovered ? '#FAF7F2' : 'white', cursor: 'pointer', transition: 'background .1s' }}
      >
        <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#1A150F' }}>{label}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#B8AC9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </Link>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<BuyerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = getBuyerToken()
    if (!token) {
      router.replace('/auth')
      return
    }

    let canceled = false
    const loadProfile = async () => {
      try {
        const data = await getBuyerProfile(token)
        if (canceled) return
        setProfile(data)
      } catch (err) {
        console.error('[BUYER PROFILE] fetch error', err)
        if (canceled) return
        setError('Unable to load profile. Please sign in again.')
        router.replace('/auth')
      } finally {
        if (!canceled) setLoading(false)
      }
    }

    loadProfile()
    return () => { canceled = true }
  }, [router])

  const handleSignOut = async () => {
    await logoutBuyer()
    router.replace('/auth')
  }

  const initials = profile?.name ? profile.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() : 'BU'
  const userName = profile?.name || 'Buyer'
  const phone = profile?.phone || ''
  const city = 'Lahore'
  const joined = profile?.createdAt ? new Date(profile.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Unknown'
  const orders = 7
  const reviews = 5

  if (loading) {
    return (
      <div style={{ background: '#FAF7F2', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 30, textAlign: 'center', border: '1px solid #EDE8DF' }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1A150F' }}>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const UserCard = () => (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #EDE8DF', padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#C8614A,#2D7A7A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: 'white', flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: '#1A150F', marginBottom: 2 }}>{userName}</p>
          <p style={{ fontSize: 13, color: '#8C7D6B', marginBottom: 2 }}>{phone}</p>
          <p style={{ fontSize: 12, color: '#B8AC9B' }}>Member since {joined}</p>
        </div>
        <button style={{ padding: '8px 16px', background: '#F5F1EA', border: 'none', borderRadius: 999, fontSize: 13, fontWeight: 600, color: '#4A3E33', cursor: 'pointer' }}>Edit</button>
      </div>
      <div style={{ display: 'flex', marginTop: 18, background: '#FAF7F2', borderRadius: 12, overflow: 'hidden' }}>
        {[{ label: 'Orders', value: orders }, { label: 'Reviews', value: reviews }, { label: 'City', value: city }].map((stat, i) => (
          <div key={stat.label} style={{ flex: 1, textAlign: 'center', padding: '12px 8px', borderRight: i < 2 ? '1px solid #EDE8DF' : 'none' }}>
            <p style={{ fontSize: 19, fontWeight: 800, color: '#1A150F', marginBottom: 2 }}>{stat.value}</p>
            <p style={{ fontSize: 11, color: '#8C7D6B' }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )

  const MenuSections = () => (
    <>
      {MENU.map(section => (
        <div key={section.section} style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7D6B', letterSpacing: '.1em', marginBottom: 8, paddingLeft: 4 }}>
            {section.section.toUpperCase()}
          </p>
          <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '1px solid #EDE8DF' }}>
            {section.items.map((item, i) => (
              <MenuRow key={item.label} icon={item.icon} label={item.label} href={item.href} last={i === section.items.length - 1} />
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSignOut}
        style={{ width: '100%', padding: 14, background: 'white', border: '1.5px solid #F5A0A0', borderRadius: 14, fontSize: 14, fontWeight: 600, color: '#C84A3A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#C84A3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Sign out
      </button>
      <p style={{ textAlign: 'center', fontSize: 11, color: '#B8AC9B', marginTop: 20 }}>HunarmandAI v0.2.0 · Made with ❤️ in Pakistan</p>
    </>
  )

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100dvh' }}>
      {error ? (
        <div style={{ padding: '24px', maxWidth: 720, margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #EDE8DF', padding: 20 }}>
            <p style={{ margin: 0, color: '#C84A3A', fontWeight: 700 }}>{error}</p>
          </div>
        </div>
      ) : null}

      {/* ═══ MOBILE ═══ */}
      <div className="mobile-only" style={{ display: 'none', flexDirection: 'column' }}>
        <div style={{ background: 'white', padding: '14px 20px', borderBottom: '1px solid #EDE8DF', position: 'sticky', top: 0, zIndex: 40 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1A150F' }}>My profile</h1>
        </div>
        <div style={{ padding: '16px' }}>
          <UserCard />
          <MenuSections />
        </div>
      </div>

      {/* ═══ DESKTOP ═══ */}
      <div className="desktop-only">
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 60px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A150F', marginBottom: 24 }}>My profile</h1>
          <UserCard />
          <MenuSections />
        </div>
      </div>
    </div>
  )
}

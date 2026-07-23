'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/mock/data'

export function CategoryBar() {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <div style={{ background: 'white', borderBottom: '1px solid #EDE8DF' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', overflowX: 'auto' }} className="scrollbar-hide">
        {CATEGORIES.map(cat => {
          const href = cat.id === 'all' ? '/marketplace/search' : `/marketplace/category/${cat.id}`
          const isHovered = hovered === cat.id
          return (
            <Link key={cat.id} href={href} style={{ textDecoration: 'none', flexShrink: 0 }}>
              <div
                onMouseEnter={() => setHovered(cat.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '14px 18px', fontSize: 14, fontWeight: isHovered ? 600 : 500,
                  color: isHovered ? '#C8614A' : '#4A3E33',
                  borderBottom: `2.5px solid ${isHovered ? '#C8614A' : 'transparent'}`,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'color .12s, border-color .12s',
                }}
              >
                <span>{cat.icon}</span>{cat.label}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

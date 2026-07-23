'use client'
import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MOCK_PRODUCTS, CATEGORIES } from '@/lib/mock/data'
import { ProductCard } from '@/components/buyer/ProductCard'

const CITIES = ['Lahore','Karachi','Islamabad','Hyderabad','Multan','Rawalpindi','Faisalabad']
const PRICE_RANGES = [['Under PKR 1k','<1000'],['Under PKR 3k','<3000'],['Under PKR 5k','<5000'],['PKR 5k–10k','5000-10000'],['PKR 10k+','>10000']]
const SORTS = ['Best match','Newest first','Price: Low to High','Price: High to Low','Top rated']

export default function SearchPage() {
  const sp = useSearchParams()
  const router = useRouter()
  const initQ = sp.get('q') || ''
  const [query, setQuery] = useState(initQ)
  const [category, setCategory] = useState('all')
  const [city, setCity] = useState<string|null>(null)
  const [priceRange, setPriceRange] = useState<string|null>(null)
  const [minRating, setMinRating] = useState<number|null>(null)
  const [sort, setSort] = useState('Best match')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid')

  const results = useMemo(() => {
    let r = [...MOCK_PRODUCTS]
    if (query) { const q = query.toLowerCase(); r = r.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.seller.name.toLowerCase().includes(q) || p.seller.city.toLowerCase().includes(q)) }
    if (category !== 'all') r = r.filter(p => p.category.toLowerCase() === category)
    if (city) r = r.filter(p => p.seller.city === city)
    if (priceRange) {
      if (priceRange.startsWith('<')) { const max = parseInt(priceRange.slice(1)); r = r.filter(p => p.price < max) }
      else if (priceRange.startsWith('>')) { const min = parseInt(priceRange.slice(1)); r = r.filter(p => p.price > min) }
      else { const [min, max] = priceRange.split('-').map(Number); r = r.filter(p => p.price >= min && p.price <= max) }
    }
    if (minRating) r = r.filter(p => p.rating >= minRating)
    if (sort === 'Price: Low to High') r.sort((a,b) => a.price - b.price)
    else if (sort === 'Price: High to Low') r.sort((a,b) => b.price - a.price)
    else if (sort === 'Top rated') r.sort((a,b) => b.rating - a.rating)
    else if (sort === 'Newest first') r.reverse()
    return r
  }, [query, category, city, priceRange, minRating, sort])

  const activeFilters = [
    city && { label: city, clear: () => setCity(null) },
    priceRange && { label: PRICE_RANGES.find(r => r[1] === priceRange)?.[0] || '', clear: () => setPriceRange(null) },
    minRating && { label: `${minRating}★+`, clear: () => setMinRating(null) },
    category !== 'all' && { label: CATEGORIES.find(c => c.id === category)?.label || '', clear: () => setCategory('all') },
  ].filter(Boolean) as { label: string; clear: () => void }[]

  const clearAll = () => { setCategory('all'); setCity(null); setPriceRange(null); setMinRating(null) }

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100dvh' }}>

      {/* ── MOBILE SEARCH HEADER (matches prototype) ── */}
      <div className="mobile-only" style={{ display: 'none', flexDirection: 'column', background: 'white', borderBottom: '1px solid #EDE8DF', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
          {/* Back arrow */}
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A150F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {/* Search pill — matches prototype style */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#F5F1EA', border: `1.5px solid ${query ? '#C8614A' : '#EDE8DF'}`, borderRadius: 999, padding: '9px 14px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#8C7D6B" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="#8C7D6B" strokeWidth="2" strokeLinecap="round"/></svg>
            <input
              autoFocus
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search hand-made products..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: '#1A150F' }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#8C7D6B" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            )}
          </div>
          {/* Filter button — orange circle with funnel icon */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{ width: 40, height: 40, borderRadius: '50%', background: showFilters ? '#C8614A' : '#F5F1EA', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke={showFilters ? 'white' : '#8C7D6B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={showFilters ? 'white' : 'none'}/>
            </svg>
          </button>
        </div>

        {/* Active filter chips — terracotta pills with × */}
        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', overflowX: 'auto' }} className="scrollbar-hide">
            {activeFilters.map((f, i) => (
              <button key={i} onClick={f.clear} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px 5px 14px', background: '#C8614A', color: 'white', border: 'none', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
                {f.label}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </button>
            ))}
          </div>
        )}

        {/* Mobile filter panel */}
        {showFilters && (
          <div style={{ padding: '12px 16px 16px', borderTop: '1px solid #EDE8DF', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7D6B', letterSpacing: '.08em', marginBottom: 8 }}>CITY</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {CITIES.map(c => <button key={c} onClick={() => setCity(city === c ? null : c)} style={{ padding: '6px 13px', borderRadius: 999, border: `1.5px solid ${city === c ? '#C8614A' : '#EDE8DF'}`, background: city === c ? '#C8614A' : 'white', color: city === c ? 'white' : '#4A3E33', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>{c}</button>)}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7D6B', letterSpacing: '.08em', marginBottom: 8 }}>PRICE</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PRICE_RANGES.map(([l, v]) => <button key={v} onClick={() => setPriceRange(priceRange === v ? null : v)} style={{ padding: '6px 13px', borderRadius: 999, border: `1.5px solid ${priceRange === v ? '#C8614A' : '#EDE8DF'}`, background: priceRange === v ? '#C8614A' : 'white', color: priceRange === v ? 'white' : '#4A3E33', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>{l}</button>)}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7D6B', letterSpacing: '.08em', marginBottom: 8 }}>RATING</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {[4,3].map(r => <button key={r} onClick={() => setMinRating(minRating === r ? null : r)} style={{ padding: '6px 13px', borderRadius: 999, border: `1.5px solid ${minRating === r ? '#C8614A' : '#EDE8DF'}`, background: minRating === r ? '#C8614A' : 'white', color: minRating === r ? 'white' : '#4A3E33', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>{r}★ +</button>)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── DESKTOP SEARCH HEADER ── */}
      <div className="desktop-only" style={{ background: 'white', borderBottom: '1px solid #EDE8DF', padding: '20px 0 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#F5F1EA', border: '1.5px solid #EDE8DF', borderRadius: 12, padding: '0 14px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#8C7D6B" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="#8C7D6B" strokeWidth="2" strokeLinecap="round"/></svg>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search hand-made products..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, padding: '12px 0', background: 'none' }}/>
              {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#8C7D6B" strokeWidth="2" strokeLinecap="round"/></svg></button>}
            </div>
          </div>
          {/* Active filter chips desktop */}
          {activeFilters.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {activeFilters.map((f, i) => (
                <button key={i} onClick={f.clear} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px 5px 14px', background: '#C8614A', color: 'white', border: 'none', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {f.label} <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
                </button>
              ))}
              <button onClick={clearAll} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #EDE8DF', borderRadius: 999, fontSize: 13, color: '#8C7D6B', cursor: 'pointer' }}>Clear all</button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 24, padding: '24px 24px 48px' }}>

          {/* Desktop sidebar */}
          <aside className="desktop-only" style={{ width: 240, flexShrink: 0 }}>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #EDE8DF', padding: 20, position: 'sticky', top: 90 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A150F', marginBottom: 20 }}>Filters</h3>
              {/* Category */}
              <div style={{ marginBottom: 22 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7D6B', letterSpacing: '.08em', marginBottom: 10 }}>CATEGORY</p>
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setCategory(cat.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px', borderRadius: 8, border: 'none', background: category === cat.id ? '#F5E8E4' : 'transparent', color: category === cat.id ? '#C8614A' : '#4A3E33', fontSize: 13, fontWeight: category === cat.id ? 700 : 400, cursor: 'pointer', textAlign: 'left' }}>
                    <span>{cat.icon}</span>{cat.label}
                    {category === cat.id && <svg style={{ marginLeft: 'auto' }} width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#C8614A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </button>
                ))}
              </div>
              {/* Price */}
              <div style={{ marginBottom: 22 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7D6B', letterSpacing: '.08em', marginBottom: 10 }}>PRICE RANGE</p>
                {PRICE_RANGES.map(([label, val]) => (
                  <button key={val} onClick={() => setPriceRange(priceRange === val ? null : val)} style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '7px 10px', borderRadius: 8, border: 'none', background: priceRange === val ? '#F5E8E4' : 'transparent', color: priceRange === val ? '#C8614A' : '#4A3E33', fontSize: 13, fontWeight: priceRange === val ? 700 : 400, cursor: 'pointer', textAlign: 'left' }}>
                    {label}
                  </button>
                ))}
              </div>
              {/* Rating */}
              <div style={{ marginBottom: 22 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7D6B', letterSpacing: '.08em', marginBottom: 10 }}>RATING</p>
                {[4,3,2].map(r => (
                  <button key={r} onClick={() => setMinRating(minRating === r ? null : r)} style={{ display: 'flex', alignItems: 'center', gap: 5, width: '100%', padding: '7px 10px', borderRadius: 8, border: 'none', background: minRating === r ? '#F5E8E4' : 'transparent', color: minRating === r ? '#C8614A' : '#4A3E33', fontSize: 13, cursor: 'pointer' }}>
                    {Array.from({length: r}).map((_, i) => <span key={i} style={{ color: '#F5A623' }}>★</span>)} & up
                  </button>
                ))}
              </div>
              {/* City */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8C7D6B', letterSpacing: '.08em', marginBottom: 10 }}>CITY</p>
                {CITIES.map(c => (
                  <button key={c} onClick={() => setCity(city === c ? null : c)} style={{ display: 'flex', width: '100%', padding: '7px 10px', borderRadius: 8, border: 'none', background: city === c ? '#F5E8E4' : 'transparent', color: city === c ? '#C8614A' : '#4A3E33', fontSize: 13, fontWeight: city === c ? 700 : 400, cursor: 'pointer' }}>
                    {c}
                  </button>
                ))}
              </div>
              {activeFilters.length > 0 && (
                <button onClick={clearAll} style={{ width: '100%', marginTop: 16, padding: 9, background: '#FFF5F3', border: '1px solid #F5D0C8', borderRadius: 8, color: '#C8614A', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Results */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Results header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontSize: 14, color: '#8C7D6B' }}>
                <strong style={{ color: '#1A150F' }}>{results.length}</strong> results {query && `for "${query}"`}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <select value={sort} onChange={e => setSort(e.target.value)} style={{ fontSize: 13, fontWeight: 600, color: '#4A3E33', border: '1px solid #EDE8DF', borderRadius: 8, padding: '6px 10px', background: 'white', cursor: 'pointer', outline: 'none' }}>
                  {SORTS.map(s => <option key={s}>{s}</option>)}
                </select>
                {/* Grid/list toggle — desktop only */}
                <div className="desktop-only" style={{ display: 'flex', border: '1px solid #EDE8DF', borderRadius: 8, overflow: 'hidden' }}>
                  {(['grid','list'] as const).map(v => (
                    <button key={v} onClick={() => setViewMode(v)} style={{ padding: '6px 10px', background: viewMode === v ? '#F5E8E4' : 'white', border: 'none', cursor: 'pointer', color: viewMode === v ? '#C8614A' : '#8C7D6B' }}>
                      {v === 'grid'
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      }
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#1A150F', marginBottom: 8 }}>No products found</p>
                <p style={{ fontSize: 14, color: '#8C7D6B' }}>Try different keywords or clear some filters</p>
              </div>
            ) : (
              /* Mobile always list style, desktop respects viewMode */
              <>
                {/* Mobile list view — matches prototype (list cards) */}
                <div className="mobile-only" style={{ display: 'none', flexDirection: 'column', gap: 10 }}>
                  {results.map(p => <ProductCard key={p.id} product={p} layout="list" />)}
                </div>
                {/* Desktop */}
                <div className="desktop-only">
                  {viewMode === 'grid'
                    ? <div className="product-grid">{results.map(p => <ProductCard key={p.id} product={p} layout="grid"/>)}</div>
                    : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{results.map(p => <ProductCard key={p.id} product={p} layout="list"/>)}</div>
                  }
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

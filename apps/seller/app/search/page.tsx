'use client'

import { useState, useMemo } from 'react'
import { Search, X, Package, Store } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { ORDERS, PRODUCTS } from '@/lib/mock-data'
import Link from 'next/link'
import { StatusPill } from '@/components/seller/ui'

type ResultType = 'order' | 'product'
interface Result {
  type: ResultType
  id: string
  title: string
  sub: string
  href: string
  status?: string
  meta?: string
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const dq = useDebounce(query, 250)

  const results = useMemo<Result[]>(() => {
    if (dq.trim().length < 2) return []
    const q = dq.toLowerCase()

    const orderResults: Result[] = ORDERS
      .filter(o =>
        o.product.toLowerCase().includes(q) ||
        o.buyer.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      )
      .map(o => ({
        type: 'order',
        id: o.id,
        title: o.product,
        sub: `${o.buyer} · #${o.id}`,
        href: `/orders/${o.id}`,
        status: o.status,
        meta: `PKR ${o.price.toLocaleString()}`,
      }))

    const productResults: Result[] = PRODUCTS
      .filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.titleUr.includes(q)
      )
      .map(p => ({
        type: 'product',
        id: p.id,
        title: p.title,
        sub: `${p.category} · ${p.status === 'live' ? '● Live' : '○ Draft'}`,
        href: `/listing/${p.id}/edit`,
        meta: `PKR ${p.price.toLocaleString()}`,
      }))

    return [...orderResults, ...productResults]
  }, [dq])

  const grouped = {
    orders: results.filter(r => r.type === 'order'),
    products: results.filter(r => r.type === 'product'),
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Search input */}
      <div className="sticky top-[57px] z-20 bg-[#f4ede3]/95 backdrop-blur-sm border-b border-[#e6d8cc] px-4 py-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2A1F14]/40" />
          <input
            type="text"
            autoFocus
            placeholder="Search orders, products, buyers…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#e6d8cc] rounded-xl text-sm focus:outline-none focus:border-[#1F7A8C] transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2A1F14]/40 hover:text-[#2A1F14]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Empty / initial state */}
        {dq.length < 2 && (
          <div className="text-center py-16 text-[#2A1F14]/40">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Search your store</p>
            <p className="text-sm mt-1">Orders, products, buyer names</p>
          </div>
        )}

        {/* No results */}
        {dq.length >= 2 && results.length === 0 && (
          <div className="text-center py-16 text-[#2A1F14]/40">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">No results for &ldquo;{dq}&rdquo;</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        )}

        {/* Orders */}
        {grouped.orders.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Package size={12} /> Orders ({grouped.orders.length})
            </p>
            <div className="space-y-2">
              {grouped.orders.map(r => (
                <Link
                  key={r.id}
                  href={r.href}
                  className="flex items-center gap-3 bg-white rounded-xl border border-[#e6d8cc] p-3 hover:border-[#1F7A8C] transition-colors"
                >
                  <div className="w-10 h-10 bg-[#F5EBDD] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package size={16} className="text-[#1F7A8C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#2A1F14] text-sm truncate">{r.title}</p>
                    <p className="text-xs text-[#2A1F14]/50 truncate">{r.sub}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <p className="text-xs font-bold text-[#2A1F14]">{r.meta}</p>
                    {r.status && <StatusPill status={r.status} />}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {grouped.products.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Store size={12} /> Products ({grouped.products.length})
            </p>
            <div className="space-y-2">
              {grouped.products.map(r => (
                <Link
                  key={r.id}
                  href={r.href}
                  className="flex items-center gap-3 bg-white rounded-xl border border-[#e6d8cc] p-3 hover:border-[#1F7A8C] transition-colors"
                >
                  <div className="w-10 h-10 bg-[#E27D60]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Store size={16} className="text-[#E27D60]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#2A1F14] text-sm truncate">{r.title}</p>
                    <p className="text-xs text-[#2A1F14]/50 truncate">{r.sub}</p>
                  </div>
                  <p className="text-xs font-bold text-[#2A1F14] flex-shrink-0">{r.meta}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

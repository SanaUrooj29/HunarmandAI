'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Download } from 'lucide-react'
import { StatusPill, SkeletonCard } from '@/components/seller/ui'
import { useAsync } from '@/hooks/useAsync'
import { getOrders } from '@/lib/api/seller-orders'
import { useDebounce } from '@/hooks/useDebounce'
import clsx from 'clsx'

const TABS = ['All', 'Pending', 'Accepted', 'Preparing', 'Shipped', 'Delivered']
const statusFilter: Record<string, string[]> = {
  All: ['pending', 'accepted', 'preparing', 'shipped', 'delivered', 'cancelled'],
  Pending: ['pending'],
  Accepted: ['accepted'],
  Preparing: ['preparing'],
  Shipped: ['shipped'], 
  Delivered: ['delivered'],
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const dSearch = useDebounce(search, 250)
  const { data: orders, loading } = useAsync(() => getOrders())

  const filtered = (orders ?? []).filter((o: any) =>
    statusFilter[activeTab].includes(o.status) &&
    (dSearch === '' || o.productTitleSnapshot.toLowerCase().includes(dSearch.toLowerCase()) || o.deliveryAddress?.fullName.toLowerCase().includes(dSearch.toLowerCase()))
  )
  const tabCount = (tab: string) => (orders ?? []).filter((o: any) => statusFilter[tab].includes(o.status)).length

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-content mx-auto">
      {/* Page header — desktop */}
      <div className="hidden md:flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#2A1F14]">Orders</h1>
          <p className="text-sm text-[#9a8878] mt-0.5">{(orders ?? []).length} total this month</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-[#6b5a4e] border border-[#e6d8cc] bg-white px-3 py-2 rounded-xl hover:border-[#E27D60] transition-colors">
          <Download size={14} />Export CSV
        </button>
      </div>

      {/* Stats row — desktop */}
      {orders && (
        <div className="hidden md:grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Accepted',    count: tabCount('Accepted'),      color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200' },
            { label: 'Shipped',   count: tabCount('Shipped'),  color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200'  },
            { label: 'Delivered',    count: tabCount('Delivered'),   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { label: 'Pending',          count: tabCount('Pending'),         color: 'text-[#E27D60]',   bg: 'bg-[#E27D60]/5', border: 'border-[#E27D60]/30' },
          ].map(s => (
            <div key={s.label} className={`bg-white rounded-2xl border ${s.border} p-4`}>
              <p className="text-xs font-semibold text-[#9a8878] uppercase tracking-wider">{s.label}</p>
              <p className={`font-display font-bold text-3xl mt-1 ${s.color}`}>{s.count}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search + filter + tabs */}
      <div className="bg-white rounded-2xl border border-[#e6d8cc] overflow-hidden mb-4">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e6d8cc]">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a8878]" />
            <input type="text" placeholder="Search orders…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f4ede3] border border-[#e6d8cc] rounded-xl text-sm focus:outline-none focus:border-[#E27D60] transition-colors" />
          </div>
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {TABS.map(tab => {
              const count = tabCount(tab)
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                    activeTab === tab ? 'bg-[#E27D60] text-white' : 'bg-[#f4ede3] text-[#6b5a4e] hover:bg-[#ede0d4]'
                  )}>
                  {tab}
                  {tab !== 'All' && count > 0 && (
                    <span className={clsx('text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center',
                      activeTab === tab ? 'bg-white/30 text-white' : 'bg-white text-[#2A1F14]')}>{count}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Table header — desktop */}
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr_0.7fr_1fr_1fr_1fr_80px] gap-4 px-4 py-2.5 text-xs font-semibold text-[#9a8878] uppercase tracking-wider border-b border-[#e6d8cc] bg-[#f4ede3]">
          <span>Order</span><span>Buyer</span><span>Seller/Product</span>
          <span>Items</span><span>Amount</span><span>Payment</span><span>Status</span><span></span>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[#9a8878]">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-medium text-[#2A1F14]">No orders found</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e6d8cc]">
            {filtered.map((o: any) => (
              <Link key={o._id} href={`/orders/${o._id}`}
                className="group hover:bg-[#f4ede3] transition-colors block">
                {/* Mobile card */}
                <div className="md:hidden flex items-center gap-3 p-4">
                  <div className="w-12 h-12 bg-[#F5EBDD] rounded-xl flex-shrink-0 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-lg bg-[#E27D60]/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <p className="font-semibold text-[#2A1F14] text-sm truncate">{o.productTitleSnapshot}</p>
                      <p className="font-bold text-[#2A1F14] text-sm whitespace-nowrap">PKR {o.subtotalPkr?.toLocaleString()}</p>
                    </div>
                    <p className="text-xs text-[#9a8878] mt-0.5">{o.deliveryAddress?.fullName} · #{o._id.slice(-6)}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <StatusPill status={o.status} />
                      <span className="text-xs text-[#9a8878]">{new Date(o.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {/* Desktop row */}
                <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr_0.7fr_1fr_1fr_1fr_80px] gap-4 items-center px-4 py-3.5">
                  <span className="font-semibold text-sm text-[#E27D60]">#{o._id.slice(-6)}</span>
                  <span className="text-sm text-[#2A1F14] truncate">{o.deliveryAddress?.fullName}</span>
                  <span className="text-sm text-[#2A1F14] truncate">{o.productTitleSnapshot}</span>
                  <span className="text-sm text-[#6b5a4e]">{o.quantity}</span>
                  <span className="text-sm font-semibold text-[#2A1F14]">PKR {o.subtotalPkr?.toLocaleString()}</span>
                  <span className="text-sm text-[#6b5a4e]">{o.paymentMethod}</span>
                  <StatusPill status={o.status} />
                  <button onClick={e => e.preventDefault()}
                    className="text-xs font-semibold bg-[#F5EBDD] text-[#2A1F14] px-2.5 py-1 rounded-lg hover:bg-[#E27D60] hover:text-white transition-colors whitespace-nowrap">
                    {o.status === 'pending' ? 'Accept' : o.status === 'shipped' ? 'Track' : 'View'}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

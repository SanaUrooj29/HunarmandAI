'use client'

import { useAsync } from '@/hooks/useAsync'
import { getDashboard } from '@/lib/api/seller-dashboard'
import { getOrders } from '@/lib/api/seller-orders'
import Link from 'next/link'
import { TrendingUp, Plus, ChevronRight, Activity } from 'lucide-react'
import { OrderCard, SectionHeader, Badge, SkeletonCard } from '@/components/seller/ui'

function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-content mx-auto space-y-6">
      <div className="skeleton rounded-2xl h-44" />
      <div className="skeleton rounded-2xl h-16" />
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3].map(i => <div key={i} className="skeleton rounded-xl h-20" />)}
      </div>
      <SkeletonCard /><SkeletonCard />
    </div>
  )
}

export default function DashboardPage() {
  const { data, loading, error } = useAsync(async () => {
    const [dashboard, allOrders] = await Promise.all([getDashboard(), getOrders()])
    return { dashboard, orders: allOrders.slice(0, 3), allOrders }
  })
  if (loading) return <DashboardSkeleton />
  if (error || !data) return <div className="p-8 text-center text-red-500">Failed to load dashboard</div>
  
  const { dashboard, orders, allOrders } = data
  const newCount = allOrders.filter((o: any) => o.status === 'placed').length

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-content mx-auto">
      {/* ── Desktop: two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column — main content (spans 2) */}
        <div className="lg:col-span-2 space-y-5">

          {/* Earnings hero */}
          <div className="bg-[#1F7A8C] rounded-2xl p-5 lg:p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
            <p className="text-xs font-medium uppercase tracking-wider text-white/60">This Month</p>
            <div className="flex items-end gap-3 mt-1">
              <p className="font-display font-bold text-4xl lg:text-5xl">PKR {dashboard.thisMonthRevenuePkr.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-emerald-300 text-sm font-medium mb-1">
                <TrendingUp size={14} />+{(dashboard.revenueGrowthRate * 100).toFixed(1)}%
              </div>
            </div>
            <div className="flex gap-8 mt-4 pt-4 border-t border-white/10">
              <div><p className="text-white/50 text-xs uppercase tracking-wide">Pending</p><p className="font-semibold mt-0.5">PKR {dashboard.pendingPayoutPkr.toLocaleString()}</p></div>
              <div><p className="text-white/50 text-xs uppercase tracking-wide">Orders</p><p className="font-semibold mt-0.5">{dashboard.ordersThisWeek}</p></div>
              <div><p className="text-white/50 text-xs uppercase tracking-wide">Rating</p><p className="font-semibold mt-0.5">{dashboard.averageRating.toFixed(1)} ★</p></div>
            </div>
            <div className="absolute bottom-4 right-6 text-white/10 pointer-events-none"><Activity size={56} /></div>
          </div>

          {/* New order alert */}
          {newCount > 0 && (
            <Link href="/orders" className="flex items-center gap-3 bg-[#E27D60]/10 border border-[#E27D60]/30 rounded-xl px-4 py-3 hover:bg-[#E27D60]/15 transition-colors">
              <span className="w-6 h-6 bg-[#E27D60] rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{newCount}</span>
              <p className="text-sm font-semibold text-[#2A1F14]">{newCount} new order{newCount > 1 ? 's' : ''} waiting — confirm now</p>
              <ChevronRight size={16} className="ml-auto text-[#2A1F14]/40" />
            </Link>
          )}

          {/* Recent orders */}
          <div>
            <SectionHeader title="Recent orders" action="See all" actionHref="/orders" />
            <div className="space-y-2">
              {orders.map((o: any) => (
                <Link key={o._id} href={`/orders/${o._id}`}>
                  <OrderCard id={`#${o._id.slice(-6)}`} product={o.items?.[0]?.title || 'Products'} buyer={o.deliveryAddress?.name || 'Customer'}
                    price={`PKR ${o.totalAmountPkr.toLocaleString()}`} status={o.status}
                    action={o.status === 'placed' ? 'Confirm' : undefined} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — sidebar widgets */}
        <div className="space-y-5">
          {/* List product CTA */}
          <Link href="/listing/new" className="flex items-center gap-4 bg-[#E27D60] hover:bg-[#c85c3a] transition-colors rounded-2xl p-4 text-white group">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0"><Plus size={20} /></div>
            <div className="flex-1">
              <p className="font-semibold text-sm">List a new product</p>
              <p className="text-white/70 text-xs mt-0.5">Snap a photo — AI does the rest</p>
            </div>
            <ChevronRight size={16} className="text-white/50 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Quick stats */}
          <div className="grid grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3">
            {[
              { label: 'Products', value: dashboard.products.total, sub: `${dashboard.products.drafts} drafts` },
              { label: 'This week', value: dashboard.ordersThisWeek, sub: 'orders' },
              { label: 'Views', value: '0', sub: 'storefront' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-[#e6d8cc] p-3 text-center">
                <p className="font-display font-bold text-xl text-[#2A1F14]">{s.value}</p>
                <p className="text-xs text-[#2A1F14]/50 mt-0.5">{s.label}</p>
                <p className="text-xs text-[#2A1F14]/40">{s.sub}</p>
              </div>
            ))}
          </div>


          {/* Learning nudge */}
          <div className="bg-white rounded-2xl border border-[#e6d8cc] p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1F7A8C]/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📚</div>
            <div className="flex-1 min-w-0">
              <Badge>NEW</Badge>
              <p className="font-semibold text-[#2A1F14] text-sm mt-1 leading-tight">Calculating profit margins</p>
              <p className="text-[#2A1F14]/40 text-xs">3 cards · 2 min</p>
            </div>
            <Link href="/learn/profit-margins" className="text-xs font-semibold text-[#1F7A8C] hover:underline whitespace-nowrap">Start →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

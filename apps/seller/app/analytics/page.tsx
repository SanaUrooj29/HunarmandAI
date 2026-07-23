'use client'

import { useAsync, fakeFetch } from '@/hooks/useAsync'
import { EARNINGS, PRODUCTS, ORDERS } from '@/lib/mock-data'
import { TrendingUp, TrendingDown, Eye, ShoppingBag, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/seller/ui'

const ANALYTICS = {
  views: { total: 1240, change: +12 },
  conversion: { rate: 3.8, change: -0.4 },
  avgOrderValue: { amount: 2680, change: +320 },
  repeatBuyers: { count: 4, pct: 33 },
  topProducts: [
    { id: '5', title: 'Embroidered Shawl', views: 312, orders: 8, revenue: 36000 },
    { id: '1', title: 'Phulkari Dupatta', views: 280, orders: 12, revenue: 38400 },
    { id: '2', title: 'Mirror Cushion x2', views: 190, orders: 6, revenue: 10800 },
  ],
  weeklyViews: [42, 58, 35, 71, 89, 64, 92],
  ordersByDay: [1, 0, 2, 1, 3, 0, 2],
}

function Metric({ label, value, change, prefix = '', suffix = '' }: {
  label: string; value: string | number; change: number; prefix?: string; suffix?: string
}) {
  const positive = change >= 0
  return (
    <div className="bg-white rounded-2xl border border-[#e6d8cc] p-4">
      <p className="text-xs text-[#2A1F14]/50 uppercase font-medium tracking-wider">{label}</p>
      <p className="font-display font-bold text-2xl text-[#2A1F14] mt-1">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </p>
      <p className={`text-xs font-semibold mt-1 flex items-center gap-0.5 ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
        {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {positive ? '+' : ''}{change}{suffix} vs last week
      </p>
    </div>
  )
}

function MiniBar({ values, color = '#1F7A8C' }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex items-end gap-1 h-10">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all"
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: i === values.length - 1 ? 1 : 0.5 }}
        />
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const { data, loading } = useAsync(() =>
    fakeFetch({ analytics: ANALYTICS, earnings: EARNINGS })
  )

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-content mx-auto space-y-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
      </div>
    )
  }

  const { analytics } = data!

  return (
    <div className="max-w-content mx-auto">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e6d8cc]">
        <Link href="/earnings" className="w-8 h-8 flex items-center justify-center hover:bg-[#F5EBDD] rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-[#2A1F14]" />
        </Link>
        <h1 className="font-semibold text-[#2A1F14]">Store Analytics</h1>
        <span className="ml-auto text-xs text-[#2A1F14]/40 bg-[#F5EBDD] px-2 py-1 rounded-lg">Last 7 days</span>
      </div>

      <div className="p-4 space-y-5">
        {/* Key metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Metric label="Storefront views" value={analytics.views.total} change={analytics.views.change} />
          <Metric label="Conversion rate" value={analytics.conversion.rate} change={analytics.conversion.change} suffix="%" />
          <Metric label="Avg order value" value={analytics.avgOrderValue.amount} change={analytics.avgOrderValue.change} prefix="PKR " />
          <Metric label="Repeat buyers" value={`${analytics.repeatBuyers.pct}%`} change={8} />
        </div>

        {/* Weekly views chart */}
        <div className="bg-white rounded-2xl border border-[#e6d8cc] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-[#1F7A8C]" />
              <p className="font-semibold text-[#2A1F14] text-sm">Daily views</p>
            </div>
            <p className="text-sm font-bold text-[#2A1F14]">{analytics.views.total.toLocaleString()} total</p>
          </div>
          <div className="flex items-end gap-1.5 h-20">
            {analytics.weeklyViews.map((v, i) => {
              const max = Math.max(...analytics.weeklyViews, 1)
              const isToday = i === analytics.weeklyViews.length - 1
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${(v / max) * 100}%`,
                      backgroundColor: isToday ? '#E27D60' : '#1F7A8C',
                      opacity: isToday ? 1 : 0.4,
                    }}
                  />
                  <span className="text-[9px] text-[#2A1F14]/40">{days[i]}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Orders chart */}
        <div className="bg-white rounded-2xl border border-[#e6d8cc] p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag size={16} className="text-[#E27D60]" />
            <p className="font-semibold text-[#2A1F14] text-sm">Orders per day</p>
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {analytics.ordersByDay.map((v, i) => {
              const max = Math.max(...analytics.ordersByDay, 1)
              const isToday = i === analytics.ordersByDay.length - 1
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg"
                    style={{
                      height: v > 0 ? `${(v / max) * 100}%` : '4px',
                      backgroundColor: isToday ? '#E27D60' : '#1F7A8C',
                      opacity: isToday ? 1 : 0.4,
                    }}
                  />
                  <span className="text-[9px] text-[#2A1F14]/40">{days[i]}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top products */}
        <div>
          <p className="font-semibold text-[#2A1F14] mb-3 flex items-center gap-2">
            <Star size={16} className="text-amber-400 fill-amber-400" />
            Top performing products
          </p>
          <div className="space-y-2">
            {analytics.topProducts.map((p, i) => {
              const maxRevenue = Math.max(...analytics.topProducts.map(x => x.revenue))
              const barPct = (p.revenue / maxRevenue) * 100
              return (
                <Link
                  key={p.id}
                  href={`/listing/${p.id}/edit`}
                  className="block bg-white rounded-xl border border-[#e6d8cc] p-4 hover:border-[#1F7A8C] transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-[#F5EBDD] rounded-full flex items-center justify-center text-xs font-bold text-[#2A1F14]">
                        {i + 1}
                      </span>
                      <p className="font-semibold text-[#2A1F14] text-sm">{p.title}</p>
                    </div>
                    <p className="font-bold text-[#2A1F14] text-sm">PKR {p.revenue.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#2A1F14]/50 mb-2">
                    <span className="flex items-center gap-1"><Eye size={10} />{p.views} views</span>
                    <span className="flex items-center gap-1"><ShoppingBag size={10} />{p.orders} orders</span>
                    <span>{((p.orders / p.views) * 100).toFixed(1)}% conv.</span>
                  </div>
                  <div className="h-1.5 bg-[#F5EBDD] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E27D60] rounded-full transition-all"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-[#F5EBDD] rounded-2xl p-4">
          <p className="font-semibold text-[#2A1F14] text-sm mb-2">💡 Insights for you</p>
          <ul className="space-y-1.5">
            {[
              'Sunday gets 43% more views — schedule new listings for Friday.',
              'Your Phulkari Dupatta converts at 4.3% — above average! Consider raising the price.',
              '3 buyers viewed Mirror Cushion 3+ times without buying. Consider a small price drop.',
            ].map((tip, i) => (
              <li key={i} className="text-xs text-[#2A1F14]/70 flex items-start gap-1.5">
                <span className="text-[#E27D60] flex-shrink-0 mt-0.5">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

'use client'

import { TrendingUp, Calendar, ArrowDownToLine, BarChart2 } from 'lucide-react'
import { SectionHeader, SkeletonCard } from '@/components/seller/ui'
import { useAsync, fakeFetch } from '@/hooks/useAsync'
import { EARNINGS, TRANSACTIONS } from '@/lib/mock-data'
import Link from 'next/link'

function EarningsSkeleton() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-content mx-auto space-y-5">
      <div className="skeleton rounded-2xl h-52" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="skeleton rounded-2xl h-24" />
        <div className="skeleton rounded-2xl h-24" />
      </div>
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}

export default function EarningsPage() {
  const { data, loading } = useAsync(() =>
    fakeFetch({ earnings: EARNINGS, transactions: TRANSACTIONS })
  )

  if (loading) return <EarningsSkeleton />
  const { earnings, transactions } = data!
  const maxAmount = Math.max(...earnings.monthly.map(d => d.amount))

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-content mx-auto space-y-6">
      {/* Hero */}
      <div className="bg-[#1F7A8C] rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -translate-y-10 translate-x-10 pointer-events-none" />
        <p className="text-xs font-medium uppercase tracking-wider text-white/60">This Month · May 2026</p>
        <div className="flex items-end gap-3 mt-1">
          <p className="font-display font-bold text-4xl">PKR {earnings.thisMonth.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-emerald-300 text-sm font-medium mb-1">
            <TrendingUp size={14} />+{earnings.growth}% vs April
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-2 mt-5 h-16">
          {earnings.monthly.map((d, i) => {
            const h = (d.amount / maxAmount) * 100
            const isLast = i === earnings.monthly.length - 1
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{ height: `${h}%`, backgroundColor: isLast ? '#E27D60' : 'rgba(255,255,255,0.25)' }}
                />
                <span className="text-white/50 text-xs">{d.month}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Analytics link */}
      <Link
        href="/analytics"
        className="flex items-center gap-3 bg-white border border-[#e6d8cc] rounded-2xl p-4 hover:border-[#1F7A8C] hover:shadow-sm transition-all group"
      >
        <div className="w-10 h-10 bg-[#1F7A8C]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <BarChart2 size={20} className="text-[#1F7A8C]" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[#2A1F14] text-sm">Store Analytics</p>
          <p className="text-xs text-[#2A1F14]/50">Views, conversion, top products, insights</p>
        </div>
        <span className="text-[#2A1F14]/30 group-hover:text-[#1F7A8C] transition-colors">→</span>
      </Link>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white border border-[#e6d8cc] rounded-2xl p-4">
          <p className="text-xs text-[#2A1F14]/50 uppercase font-medium tracking-wider">Pending payout</p>
          <p className="font-display font-bold text-xl text-[#2A1F14] mt-1">PKR {earnings.pending.toLocaleString()}</p>
          <p className="text-xs text-[#2A1F14]/40 mt-1 flex items-center gap-1"><Calendar size={10} />Next: {earnings.nextPayoutDate}</p>
        </div>
        <div className="bg-white border border-[#e6d8cc] rounded-2xl p-4">
          <p className="text-xs text-[#2A1F14]/50 uppercase font-medium tracking-wider">Total earned</p>
          <p className="font-display font-bold text-xl text-[#2A1F14] mt-1">PKR {earnings.total.toLocaleString()}</p>
          <p className="text-xs text-[#2A1F14]/40 mt-1">Since Jan 2026</p>
        </div>
      </div>

      {/* Wallet */}
      <div className="bg-white border border-[#e6d8cc] rounded-2xl p-4">
        <p className="text-xs text-[#2A1F14]/50 uppercase font-medium tracking-wider mb-3">Payout wallets</p>
        <div className="space-y-3">
          {[
            { abbr: 'JC', name: 'JazzCash', last4: '7890', verified: true, color: 'bg-red-500' },
            { abbr: 'EP', name: 'EasyPaisa', last4: null, verified: false, color: 'bg-emerald-500' },
            { abbr: 'CC', name: 'Credit Card', last4: null, verified: false, color: 'bg-blue-500' },
          ].map(w => (
            <div key={w.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 ${w.color} rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {w.abbr}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2A1F14]">{w.name}</p>
                  <p className="text-xs text-[#2A1F14]/40">{w.last4 ? `···· ${w.last4}` : 'Not linked'}</p>
                </div>
              </div>
              {w.verified
                ? <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">● Active</span>
                : <button className="text-xs font-semibold border border-[#e6d8cc] px-3 py-1 rounded-lg hover:border-[#1F7A8C] transition-colors">Link</button>}
            </div>
          ))}
          <div className="flex items-center justify-between pt-2 border-t border-[#e6d8cc]">
            <div>
              <p className="text-sm text-[#2A1F14]/60">Pending payout</p>
              <p className="font-display font-bold text-xl text-[#2A1F14]">PKR {earnings.pending.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#2A1F14]/50">Withdrawal status</p>
              <p className="text-sm font-semibold text-[#2A1F14]">
                {earnings.completedSales >= 2 ? 'Eligible' : `${2 - earnings.completedSales} more sales needed`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Commission notice */}
      <div className="bg-[#F5EBDD] rounded-xl p-4 flex items-start gap-3">
        <span className="text-lg flex-shrink-0">ℹ️</span>
        <div>
          <p className="font-semibold text-[#2A1F14] text-sm">Platform commission</p>
          <p className="text-xs text-[#2A1F14]/60 mt-0.5 leading-relaxed">
            A variable commission (configured by admin) may be deducted from each sale. Payouts are processed every Tuesday and Friday via JazzCash, EasyPaisa, or Credit Card.
          </p>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <SectionHeader title="Transaction history" action="Download CSV" />
        <div className="space-y-2">
          {transactions.map(t => (
            <div key={t.id} className="bg-white border border-[#e6d8cc] rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F5EBDD] rounded-xl flex items-center justify-center flex-shrink-0">
                <ArrowDownToLine size={16} className="text-[#1F7A8C]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#2A1F14] text-sm truncate">{t.product}</p>
                <p className="text-xs text-[#2A1F14]/50">{t.buyer} · PKR {t.commission} commission deducted</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`font-bold text-sm ${t.status === 'paid' ? 'text-emerald-600' : 'text-[#2A1F14]'}`}>
                  {t.status === 'paid' ? '+' : ''}PKR {t.net.toLocaleString()}
                </p>
                <p className="text-xs text-[#2A1F14]/40">{t.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

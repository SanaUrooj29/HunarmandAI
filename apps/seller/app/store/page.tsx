'use client'

import Link from 'next/link'
import { Edit, MoreHorizontal, Grid3x3, List, MapPin, Star, Shield, Plus } from 'lucide-react'
import { Badge, SkeletonCard, Skeleton } from '@/components/seller/ui'
import { useAsync } from '@/hooks/useAsync'
import { getListings } from '@/lib/api/seller-listings'
import { getProfile } from '@/lib/api/seller-profile'
import { useState } from 'react'
import clsx from 'clsx'

function StoreSkeleton() {
  return (
    <div>
      <div className="skeleton h-32 w-full" />
      <div className="px-4 pt-4 space-y-3">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-5 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mt-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
        </div>
      </div>
    </div>
  )
}

export default function StorePage() {
  const { data, loading } = useAsync(async () => {
    const [products, profileResponse] = await Promise.all([getListings(), getProfile()])
    return { products, seller: profileResponse.user }
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  if (loading) return <StoreSkeleton />
  if (!data) return null;
  const { products, seller } = data
  const liveProducts = products.filter((p: any) => p.status === 'active')
  const draftProducts = products.filter((p: any) => p.status === 'draft')

  return (
    <div className="max-w-content mx-auto">
      {/* Store header */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-br from-[#1F7A8C] to-[#E27D60]" />
        <div className="px-4 pb-4">
          <div className="flex items-end justify-between -mt-8 mb-4">
            <div className="w-16 h-16 bg-[#E27D60] rounded-2xl border-4 border-white flex items-center justify-center text-white font-bold text-xl shadow-sm">
              {seller.fullName?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || 'S'}
            </div>
            <div className="flex gap-2 mb-1">
              <Link href="/profile" className="flex items-center gap-1.5 bg-white border border-[#e6d8cc] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2A1F14] hover:border-[#1F7A8C] transition-colors">
                <Edit size={12} />Edit
              </Link>
              <button className="w-8 h-8 bg-white border border-[#e6d8cc] rounded-xl flex items-center justify-center hover:border-[#1F7A8C] transition-colors">
                <MoreHorizontal size={14} className="text-[#2A1F14]" />
              </button>
            </div>
          </div>

          <h1 className="font-display font-bold text-2xl text-[#2A1F14]">{seller.sellerProfile?.shopName || seller.fullName}</h1>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-sm text-[#2A1F14]/60"><MapPin size={12} />{seller.sellerProfile?.city || 'No City'}</span>
            <span className="flex items-center gap-1 text-sm text-[#2A1F14]/60">
              <Star size={12} className="text-amber-400 fill-amber-400" />{0} ({0} reviews)
            </span>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {seller.sellerProfile?.productCategories?.map((cat: string) => (
              <span key={cat} className="text-xs font-medium bg-[#F5EBDD] text-[#2A1F14] px-3 py-1 rounded-full">{cat}</span>
            ))}
            {seller.sellerProfile?.isVerified && (
              <Badge variant="success"><Shield size={10} />Verified</Badge>
            )}
          </div>

          {/* Storefront link */}
          <div className="mt-3 flex items-center gap-2 p-3 bg-white border border-[#e6d8cc] rounded-xl">
            <span className="text-xs text-[#2A1F14]/50 flex-1">hunarmand.ai/{seller.id}</span>
            <button className="w-8 h-8 bg-[#25D366] rounded-lg flex items-center justify-center text-white text-sm">📱</button>
            <button className="text-xs font-semibold text-[#1F7A8C] hover:underline">Copy link</button>
          </div>
        </div>
      </div>

      {/* Products section */}
      <div className="px-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#2A1F14]">{liveProducts.length} live products</h2>
          <div className="flex gap-1">
            {(['grid', 'list'] as const).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className={clsx('w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                  viewMode === mode ? 'bg-[#1F7A8C] text-white' : 'bg-white border border-[#e6d8cc] text-[#2A1F14]/60 hover:border-[#1F7A8C]')}>
                {mode === 'grid' ? <Grid3x3 size={14} /> : <List size={14} />}
              </button>
            ))}
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {liveProducts.map((p: any) => (
              <Link key={p._id} href={`/listing/${p._id}/edit`}
                className="bg-white rounded-2xl border border-[#e6d8cc] overflow-hidden hover:border-[#1F7A8C] hover:shadow-sm transition-all group">
                <div className="aspect-square relative flex items-center justify-center bg-gray-100">
                  {p.images?.[0] ? (
                    <img src={p.images[0].resizedUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gray-200" />
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Edit size={12} className="text-[#2A1F14]" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="text-xs bg-white/80 backdrop-blur-sm text-[#2A1F14]/60 px-1.5 py-0.5 rounded font-medium">
                      Qty: {p.quantity}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-[#2A1F14] text-sm leading-tight">{p.titleUr}</p>
                  <p className="text-[#E27D60] font-bold text-sm mt-1">PKR {p.pricePkr.toLocaleString()}</p>
                </div>
              </Link>
            ))}
            <Link href="/listing/new"
              className="bg-[#F5EBDD] rounded-2xl border-2 border-dashed border-[#E27D60]/40 hover:border-[#E27D60] transition-colors flex flex-col items-center justify-center gap-2 aspect-square">
              <div className="w-12 h-12 bg-[#E27D60]/15 rounded-full flex items-center justify-center">
                <Plus size={24} className="text-[#E27D60]" />
              </div>
              <p className="text-xs font-semibold text-[#E27D60]">Add product</p>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {liveProducts.map((p: any) => (
              <Link key={p._id} href={`/listing/${p._id}/edit`}
                className="flex items-center gap-3 bg-white rounded-xl border border-[#e6d8cc] p-3 hover:border-[#1F7A8C] hover:shadow-sm transition-all">
                <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-gray-100 overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0].resizedUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-gray-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#2A1F14] text-sm truncate">{p.titleUr}</p>
                  <p className="text-xs text-[#2A1F14]/50">{p.category} · Qty: {p.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#2A1F14] text-sm">PKR {p.pricePkr.toLocaleString()}</p>
                  <Edit size={12} className="text-[#2A1F14]/30 ml-auto mt-1" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {draftProducts.length > 0 && (
          <Link href="/listing/drafts" className="flex items-center justify-between mt-4 p-3 bg-white border border-[#e6d8cc] rounded-xl hover:border-[#1F7A8C] transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#2A1F14]">Drafts</span>
              <span className="text-xs font-semibold bg-[#F5EBDD] text-[#2A1F14] px-2 py-0.5 rounded-md">{draftProducts.length}</span>
            </div>
            <span className="text-xs text-[#2A1F14]/40">View →</span>
          </Link>
        )}
      </div>
    </div>
  )
}

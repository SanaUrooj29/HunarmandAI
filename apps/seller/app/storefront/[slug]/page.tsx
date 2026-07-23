'use client'

import { useAsync, fakeFetch } from '@/hooks/useAsync'
import { PRODUCTS, SELLER } from '@/lib/mock-data'
import { ArrowLeft, Star, MapPin, Shield, Share2, Heart, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useToast } from '@/components/seller/Toast'
import { Skeleton } from '@/components/seller/ui'

export default function StorefrontPage({ params }: { params: { slug: string } }) {
  const { toast } = useToast()
  const { data, loading } = useAsync(() =>
    fakeFetch({ seller: SELLER, products: PRODUCTS.filter(p => p.status === 'live') }, 700)
  )
  const [wishlist, setWishlist] = useState<string[]>([])

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
    toast(wishlist.includes(id) ? 'Removed from wishlist' : 'Added to wishlist', 'info')
  }

  const handleShare = async () => {
    const url = `https://hunarmand.ai/${params.slug}`
    if (navigator.share) {
      await navigator.share({ title: data?.seller.storeName, url })
    } else {
      await navigator.clipboard.writeText(url)
      toast('Storefront link copied!', 'success')
    }
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto">
        <Skeleton className="h-32 w-full" />
        <div className="px-4 pt-4 space-y-3">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-4 w-56" />
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
          </div>
        </div>
      </div>
    )
  }

  const { seller, products } = data!

  return (
    <div className="max-w-lg mx-auto pb-8">
      {/* Back + share bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e6d8cc]">
        <Link href="/store" className="flex items-center gap-2 text-sm text-[#2A1F14]/60 hover:text-[#2A1F14]">
          <ArrowLeft size={16} />Back
        </Link>
        <p className="text-xs text-[#2A1F14]/40">hunarmand.ai/{params.slug}</p>
        <button
          onClick={handleShare}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5EBDD] transition-colors"
        >
          <Share2 size={16} className="text-[#2A1F14]" />
        </button>
      </div>

      {/* Cover + avatar */}
      <div className="relative">
        <div className="h-28 bg-gradient-to-br from-[#1F7A8C] via-[#2d8a9e] to-[#E27D60]" />
        <div className="px-4">
          <div className="-mt-7 mb-3 flex items-end justify-between">
            <div className="w-14 h-14 bg-[#E27D60] rounded-2xl border-4 border-white flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {seller.initials}
            </div>
            <a
              href={`https://wa.me/923124567890`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              💬 WhatsApp
            </a>
          </div>

          <h1 className="font-display font-bold text-2xl text-[#2A1F14]">{seller.storeName}</h1>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-sm text-[#2A1F14]/60">
              <MapPin size={12} />{seller.city}
            </span>
            <span className="flex items-center gap-1 text-sm text-[#2A1F14]/60">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              {seller.rating} ({seller.reviewCount} reviews)
            </span>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {seller.categories.map(c => (
              <span key={c} className="text-xs font-medium bg-[#F5EBDD] text-[#2A1F14] px-2.5 py-1 rounded-full">{c}</span>
            ))}
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <Shield size={10} />Verified seller
            </span>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="px-4 mt-5">
        <h2 className="font-semibold text-[#2A1F14] mb-3">{products.length} products</h2>
        <div className="grid grid-cols-2 gap-3">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-[#e6d8cc] overflow-hidden group">
              <div className="aspect-square relative flex items-center justify-center" style={{ backgroundColor: p.color + '15' }}>
                <div className="w-16 h-16 rounded-2xl" style={{ backgroundColor: p.color + '35' }} />
                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart
                    size={14}
                    className={wishlist.includes(p.id) ? 'text-red-500 fill-red-500' : 'text-[#2A1F14]/40'}
                  />
                </button>
                {p.qty <= 1 && (
                  <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                    Only {p.qty} left
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-[#2A1F14] text-sm leading-tight">{p.title}</p>
                <p className="text-xs text-[#2A1F14]/50 mt-0.5">{p.titleUr}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="font-bold text-[#E27D60]">PKR {p.price.toLocaleString()}</p>
                  <button
                    onClick={() => toast('Added to cart! (buyer flow)', 'success')}
                    className="w-7 h-7 bg-[#E27D60] rounded-lg flex items-center justify-center hover:bg-[#c85c3a] transition-colors"
                  >
                    <ShoppingBag size={13} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About / policy */}
      <div className="px-4 mt-6 space-y-3">
        <div className="bg-[#F5EBDD] rounded-2xl p-4">
          <p className="font-semibold text-[#2A1F14] text-sm mb-1">About {seller.storeName}</p>
          <p className="text-xs text-[#2A1F14]/60 leading-relaxed">
            Handcrafted with love in {seller.city}. Each piece is made by hand — no two are exactly alike.
            Orders typically ship within 2–3 days.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { icon: '📦', label: 'Free pickup', sub: 'Lahore' },
            { icon: '✅', label: 'Verified', sub: 'Seller' },
            { icon: '↩️', label: 'Easy', sub: 'Returns' },
          ].map(b => (
            <div key={b.label} className="bg-white border border-[#e6d8cc] rounded-xl p-3">
              <p className="text-xl mb-0.5">{b.icon}</p>
              <p className="text-xs font-semibold text-[#2A1F14]">{b.label}</p>
              <p className="text-[10px] text-[#2A1F14]/50">{b.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

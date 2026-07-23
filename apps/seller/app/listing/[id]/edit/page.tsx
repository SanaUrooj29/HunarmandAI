'use client'

import { useState } from 'react'
import { ArrowLeft, Trash2, Eye, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/seller/ui'
import { ConfirmModal } from '@/components/seller/Modal'
import { useToast } from '@/components/seller/Toast'
import { useAsync } from '@/hooks/useAsync'
import { getListing, updateListing, deleteListing } from '@/lib/api/seller-listings'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

const CATEGORIES = [
  'Embroidery → Phulkari',
  'Embroidery → Block Print',
  'Embroidery → Shawls',
  'Crafts → Cushions',
  'Crafts → Bags',
  'Jewelry → Necklaces',
  'Pottery → Bowls',
  'Food → Pickles',
]

export default function EditListingPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const { data: product, loading } = useAsync(() => getListing(params.id))

  const [title, setTitle] = useState('')
  const [titleUr, setTitleUr] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState<'live' | 'draft'>('live')
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Initialize form from loaded product
  if (product && !initialized) {
    setTitle(product.titleEn || '')
    setTitleUr(product.titleUr || '')
    setDesc(product.descriptionEn || '')
    setPrice(String(product.pricePkr))
    setQty(String(product.quantity))
    setCategory(product.category)
    setStatus(product.status as 'live' | 'draft')
    setInitialized(true)
  }

  const handleSave = async () => {
    if (!titleUr.trim() && !title.trim()) { toast('Title is required', 'error'); return }
    if (!price || isNaN(Number(price))) { toast('Please enter a valid price', 'error'); return }
    setIsSaving(true)
    try {
      await updateListing(params.id, {
        titleEn: title,
        titleUr: titleUr || title,
        descriptionEn: desc,
        descriptionUr: desc,
        pricePkr: Number(price),
        quantity: Number(qty),
        category: category,
        status: status === 'live' ? 'active' : 'inactive'
      })
      toast('Listing updated successfully!', 'success')
      router.push('/store')
    } catch (e) {
      console.error(e)
      toast('Failed to update listing', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setShowDeleteConfirm(false)
    try {
      await deleteListing(params.id)
      toast('Listing deleted', 'info')
      router.push('/store')
    } catch (e) {
      console.error(e)
      toast('Failed to delete listing', 'error')
    }
  }

  const handleArchive = () => {
    setShowArchiveConfirm(false)
    setStatus('draft')
    handleSave()
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <div className="skeleton h-8 w-32 rounded-xl" />
        <div className="skeleton h-24 w-full rounded-2xl" />
        <div className="skeleton h-14 w-full rounded-xl" />
        <div className="skeleton h-14 w-full rounded-xl" />
        <div className="skeleton h-24 w-full rounded-xl" />
        <div className="skeleton h-14 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e6d8cc]">
        <Link href="/store" className="flex items-center gap-2 text-sm font-medium text-[#2A1F14]/60 hover:text-[#2A1F14]">
          <ArrowLeft size={16} />Back
        </Link>
        <h1 className="font-semibold text-[#2A1F14]">Edit listing</h1>
        <div className="flex gap-1">
          <button
            onClick={() => toast('Preview coming soon', 'info')}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5EBDD] transition-colors">
            <Eye size={16} className="text-[#1F7A8C]" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors">
            <Trash2 size={16} className="text-red-400" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5 pb-32">
        {/* Photos */}
        <div>
          <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider block mb-2">Photos</label>
          <div className="flex gap-3 flex-wrap">
            <div className="w-24 h-24 rounded-xl border-2 border-[#E27D60] flex items-center justify-center relative overflow-hidden bg-gray-100">
              {product?.images?.[0] ? (
                <img src={product.images[0].resizedUrl} className="w-full h-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gray-200" />
              )}
            </div>
            <button className="w-24 h-24 rounded-xl border-2 border-dashed border-[#e6d8cc] flex flex-col items-center justify-center gap-1 hover:border-[#1F7A8C] transition-colors">
              <Plus size={20} className="text-[#2A1F14]/30" />
              <span className="text-xs text-[#2A1F14]/40">Add</span>
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between bg-white border border-[#e6d8cc] rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[#2A1F14]">Listing status</p>
            <p className="text-xs text-[#2A1F14]/50">{status === 'live' ? 'Visible to buyers' : 'Hidden — draft'}</p>
          </div>
          <button
            onClick={() => {
              const next = status === 'live' ? 'draft' : 'live'
              setStatus(next)
              toast(`Listing ${next === 'live' ? 'published' : 'moved to drafts'}`, next === 'live' ? 'success' : 'info')
            }}
            className={clsx(
              'text-xs font-semibold px-3 py-1 rounded-full transition-colors',
              status === 'live'
                ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
            )}>
            {status === 'live' ? '● Live' : '○ Draft'}
          </button>
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider block mb-1.5">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full bg-white border border-[#e6d8cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1F7A8C] appearance-none cursor-pointer">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Title EN */}
        <div>
          <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider block mb-1.5">Title (English)</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            className="w-full bg-white border border-[#e6d8cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1F7A8C]" />
          <p className="text-xs text-[#2A1F14]/30 mt-1 text-right">{title.length}/80</p>
        </div>

        {/* Title UR */}
        <div>
          <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider block mb-1.5">عنوان (اردو)</label>
          <textarea value={titleUr} onChange={e => setTitleUr(e.target.value)} dir="rtl"
            className="w-full bg-white border border-[#e6d8cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1F7A8C] font-urdu text-right resize-none"
            rows={2} />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider block mb-1.5">Description (English)</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)}
            className="w-full bg-white border border-[#e6d8cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1F7A8C] resize-none"
            rows={4} />
        </div>

        {/* Price & Qty */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider block mb-1.5">Price (PKR)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#2A1F14]/40 font-medium select-none">PKR</span>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} min={1}
                className="w-full bg-white border border-[#e6d8cc] rounded-xl pl-12 pr-3 py-3 text-sm focus:outline-none focus:border-[#1F7A8C] font-semibold" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider block mb-1.5">Qty in stock</label>
            <input type="number" value={qty} onChange={e => setQty(e.target.value)} min={0} 
              className="w-full bg-white border border-[#e6d8cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1F7A8C]" />
          </div>
        </div>

        {/* Delivery */}
        <div>
          <label className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider block mb-2">Delivery option</label>
          <div className="space-y-2">
            {[
              { id: 'free', label: 'Free pickup', sub: 'Buyer collects from your city' },
              { id: 'courier', label: 'Courier (buyer pays)', sub: 'Shipped via Leopards/TCS' },
            ].map(opt => (
              <label key={opt.id} className="flex items-start gap-3 p-3 bg-white border border-[#e6d8cc] rounded-xl cursor-pointer hover:border-[#1F7A8C] transition-colors">
                <input type="radio" name="delivery" value={opt.id} defaultChecked={opt.id === 'free'}
                  className="mt-0.5 accent-[#E27D60]" />
                <div>
                  <p className="text-sm font-medium text-[#2A1F14]">{opt.label}</p>
                  <p className="text-xs text-[#2A1F14]/50">{opt.sub}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#f4ede3]/95 backdrop-blur-sm border-t border-[#e6d8cc] p-4 flex gap-3">
        <Button variant="secondary" size="md" className="flex-1" onClick={() => setShowArchiveConfirm(true)}>
          Archive
        </Button>
        <Button variant="primary" size="md" className="flex-1" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : 'Save changes'}
        </Button>
      </div>

      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete listing?"
        message={`"${title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete permanently"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ConfirmModal
        open={showArchiveConfirm}
        title="Archive listing?"
        message={`"${title}" will be moved to drafts and hidden from buyers.`}
        confirmLabel="Archive"
        onConfirm={handleArchive}
        onCancel={() => setShowArchiveConfirm(false)}
      />
    </div>
  )
}

'use client'

import Link from 'next/link'
import { Edit, Trash2, ArrowLeft, Plus } from 'lucide-react'
import { SkeletonCard } from '@/components/seller/ui'
import { ConfirmModal } from '@/components/seller/Modal'
import { useToast } from '@/components/seller/Toast'
import { useAsync, fakeFetch } from '@/hooks/useAsync'
import { PRODUCTS } from '@/lib/mock-data'
import { useState } from 'react'

export default function DraftsPage() {
  const { toast } = useToast()
  const { data: allProducts, loading } = useAsync(() => fakeFetch(PRODUCTS))
  const drafts = (allProducts ?? []).filter(p => p.status === 'draft')

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deletedIds, setDeletedIds] = useState<string[]>([])

  const visible = drafts.filter(d => !deletedIds.includes(d.id))
  const deleteTarget = drafts.find(d => d.id === deleteId)

  const handleDelete = () => {
    if (!deleteId) return
    setDeletedIds(p => [...p, deleteId])
    setDeleteId(null)
    toast('Draft deleted', 'info')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e6d8cc]">
        <Link href="/store" className="w-8 h-8 flex items-center justify-center hover:bg-[#F5EBDD] rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-[#2A1F14]" />
        </Link>
        <h1 className="font-semibold text-[#2A1F14]">Drafts {!loading && `(${visible.length})`}</h1>
      </div>

      {loading ? (
        <div className="p-4 space-y-3">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {visible.length > 0 && (
            <p className="text-sm text-[#2A1F14]/60">
              These listings are hidden from buyers. Review and publish when ready.
            </p>
          )}

          <div className="space-y-2">
            {visible.map(d => (
              <div key={d.id}
                className="bg-white rounded-xl border border-[#e6d8cc] p-4 flex items-center gap-3 hover:border-[#1F7A8C] transition-colors">
                <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: d.color + '20' }}>
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: d.color + '40' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#2A1F14] text-sm truncate">{d.title}</p>
                  <p className="text-xs text-[#2A1F14]/50 mt-0.5">{d.category} · PKR {d.price.toLocaleString()}</p>
                  {d.qty === 0 && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                      ⚠ No stock quantity set
                    </p>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Link href={`/listing/${d.id}/edit`}
                    className="w-8 h-8 flex items-center justify-center hover:bg-[#F5EBDD] rounded-lg transition-colors">
                    <Edit size={14} className="text-[#1F7A8C]" />
                  </Link>
                  <button
                    onClick={() => setDeleteId(d.id)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {visible.length === 0 && (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📝</p>
              <p className="font-semibold text-[#2A1F14]">No drafts</p>
              <p className="text-sm text-[#2A1F14]/50 mt-1">Products you save without publishing appear here.</p>
              <Link href="/listing/new"
                className="inline-flex items-center gap-2 mt-6 bg-[#E27D60] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#c85c3a] transition-colors">
                <Plus size={16} />List a product
              </Link>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete draft?"
        message={`"${deleteTarget?.title ?? 'This draft'}" will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}

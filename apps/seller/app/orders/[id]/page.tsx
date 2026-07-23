'use client'

import { useState } from 'react'
import { ArrowLeft, Phone, MessageSquare, MapPin, Package, CheckCircle, Copy } from 'lucide-react'
import Link from 'next/link'
import { StatusPill, Button, Skeleton } from '@/components/seller/ui'
import { ConfirmModal } from '@/components/seller/Modal'
import { useAsync } from '@/hooks/useAsync'
import { getOrder, markOrderReady as markReadyApi } from '@/lib/api/seller-orders'

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { data: order, loading, refetch } = useAsync(() => getOrder(params.id))
  const [showConfirm, setShowConfirm] = useState(false)
  const [isMarkingReady, setIsMarkingReady] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleMarkReady = async () => {
    setIsMarkingReady(true)
    try {
      await markReadyApi(params.id)
      refetch()
    } catch (e) {
      console.error(e)
    } finally {
      setIsMarkingReady(false)
      setShowConfirm(false)
    }
  }

  const copyAddress = () => {
    if (order?.deliveryAddress?.addressLine) {
      navigator.clipboard.writeText(order.deliveryAddress.addressLine)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const steps = [
    { label: 'Order received', done: true, time: new Date(order?.createdAt || Date.now()).toLocaleString() },
    { label: 'Order accepted', done: ['accepted','preparing','shipped','delivered'].includes(order?.status ?? ''), time: order?.status === 'accepted' ? 'Accepted' : '' },
    { label: 'Preparing', done: ['preparing','shipped','delivered'].includes(order?.status ?? ''), time: '' },
    { label: 'Shipped', done: ['shipped','delivered'].includes(order?.status ?? ''), time: '' },
    { label: 'Delivered', done: order?.status === 'delivered', time: order?.status === 'delivered' ? 'Delivered' : '' },
  ]

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e6d8cc]">
        <Link href="/orders" className="w-8 h-8 flex items-center justify-center hover:bg-[#F5EBDD] rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-[#2A1F14]" />
        </Link>
        <div className="flex-1">
          <h1 className="font-semibold text-[#2A1F14]">Order #{order?._id?.slice(-6)}</h1>
          <p className="text-xs text-[#2A1F14]/50">{new Date(order?.createdAt || Date.now()).toLocaleDateString()}</p>
        </div>
        <StatusPill status={order?.status ?? 'placed'} />
      </div>

      <div className="p-4 space-y-5">
        {/* Product summary */}
        <div className="bg-white rounded-2xl border border-[#e6d8cc] p-4 flex gap-4">
          <div className="w-20 h-20 bg-[#F5EBDD] rounded-xl flex-shrink-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-[#E27D60]/20 rounded-lg" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#2A1F14]">{order?.productTitleSnapshot}</p>
            <p className="text-xs text-[#2A1F14]/50 mt-0.5">Qty: {order?.quantity}</p>
            <div className="flex items-center justify-between mt-3">
              <p className="font-display font-bold text-xl text-[#2A1F14]">PKR {order?.subtotalPkr?.toLocaleString()}</p>
              <p className="text-xs text-[#2A1F14]/40">Payout: PKR {order?.sellerNetPkr?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Buyer info */}
        <div className="bg-white rounded-2xl border border-[#e6d8cc] p-4">
          <p className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider mb-3">Buyer</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#1F7A8C] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {order?.deliveryAddress?.fullName.split(' ').map((w: string) => w[0]).join('').slice(0, 2) || 'C'}
            </div>
            <div>
              <p className="font-semibold text-[#2A1F14]">{order?.deliveryAddress?.fullName}</p>
              <p className="text-xs text-[#2A1F14]/50">{order?.deliveryAddress?.phone}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a href={`tel:${order?.deliveryAddress?.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-2 border border-[#e6d8cc] rounded-xl text-sm font-medium hover:border-[#1F7A8C] transition-colors">
              <Phone size={14} />Call
            </a>
            <a href={`https://wa.me/${order?.deliveryAddress?.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#25D366] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
              <MessageSquare size={14} />WhatsApp
            </a>
          </div>
        </div>

        {/* Shipping info */}
        {order?.status === 'preparing' && (
          <div className="bg-[#F5EBDD] rounded-2xl p-4">
            <p className="font-semibold text-[#2A1F14] text-sm">📦 Preparing Order</p>
            <p className="text-xs text-[#2A1F14]/60 mt-1">Please package the item securely. You are responsible for arranging shipping and delivery.</p>
          </div>
        )}

        {/* Delivery address */}
        <div className="bg-white rounded-2xl border border-[#e6d8cc] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#1F7A8C]" />
              <p className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider">Delivery address</p>
            </div>
            <button onClick={copyAddress} className="flex items-center gap-1 text-xs text-[#1F7A8C] font-medium hover:underline">
              <Copy size={12} />{copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-sm text-[#2A1F14]">{order?.deliveryAddress?.addressLine}, {order?.deliveryAddress?.city}</p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-[#e6d8cc] p-4">
          <p className="text-xs font-semibold text-[#2A1F14]/50 uppercase tracking-wider mb-4">Order timeline</p>
          {steps.map((s, i) => (
            <div key={s.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${s.done ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-[#e6d8cc]'}`}>
                  {s.done && <CheckCircle size={10} className="text-white fill-white" />}
                </div>
                {i < steps.length - 1 && <div className={`w-0.5 h-8 mt-1 ${s.done ? 'bg-emerald-200' : 'bg-[#e8ddd0]'}`} />}
              </div>
              <div className="pb-6 last:pb-0">
                <p className={`text-sm font-medium ${s.done ? 'text-[#2A1F14]' : 'text-[#2A1F14]/40'}`}>{s.label}</p>
                {s.time && <p className="text-xs text-[#2A1F14]/40 mt-0.5">{s.time}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-4">
          <Button variant="secondary" size="md" className="flex-1">
            <Package size={16} />Report issue
          </Button>
          {order?.status === 'pending' && (
            <Button variant="primary" size="md" className="flex-1" onClick={() => setShowConfirm(true)}>
              Accept Order
            </Button>
          )}
          {order?.status === 'accepted' && (
            <Button variant="primary" size="md" className="flex-1" onClick={() => setShowConfirm(true)}>
              Mark as preparing
            </Button>
          )}
          {order?.status === 'preparing' && (
            <Button variant="primary" size="md" className="flex-1" onClick={() => setShowConfirm(true)}>
              Mark as shipped
            </Button>
          )}
          {['shipped', 'delivered'].includes(order?.status ?? '') && (
            <div className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 font-semibold text-sm rounded-xl py-2.5 border border-emerald-200">
              <CheckCircle size={16} />{order?.status === 'delivered' ? 'Delivered' : 'Shipped'}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        title="Update order status?"
        message={`Confirm that you want to update the status for ${order?.productTitleSnapshot}.`}
        confirmLabel={isMarkingReady ? "Updating..." : "Yes, update"}
        onConfirm={handleMarkReady}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  )
}

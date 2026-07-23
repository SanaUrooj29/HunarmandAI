'use client'

import { useState } from 'react'
import { ArrowLeft, CheckCheck } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

interface Notification {
  id: string
  type: 'order' | 'payout' | 'learn' | 'system'
  title: string
  body: string
  time: string
  read: boolean
  href?: string
}

const INITIAL_NOTIFS: Notification[] = [
  { id: 'n1', type: 'order', title: 'New order received!', body: 'Zara Malik ordered Hand-stitched Tote — PKR 950. Confirm to start fulfillment.', time: '2 min ago', read: false, href: '/orders/OD-2835' },
  { id: 'n2', type: 'payout', title: 'Payout processed', body: 'PKR 4,275 for Embroidered Shawl has been sent to your JazzCash wallet.', time: '1 hour ago', read: false, href: '/earnings' },
  { id: 'n3', type: 'order', title: 'Order picked up', body: 'Mirror Cushion x2 was collected by Leopards Courier. Tracking: LPD-7291.', time: '2 hours ago', read: true, href: '/orders/OD-2840' },
  { id: 'n4', type: 'learn', title: 'New lesson unlocked 📚', body: '"Calculating Profit Margins" is now available for you based on your recent listings.', time: 'Yesterday', read: true, href: '/learn/profit-margins' },
  { id: 'n6', type: 'order', title: 'Order delivered', body: 'Phulkari Dupatta was delivered to Ayesha Khan. Payout in 36 hours.', time: '2 days ago', read: true, href: '/orders/OD-2841' },
]

const typeIcon: Record<string, string> = {
  order: '📦',
  payout: '💰',
  learn: '📚',
  system: '🔔',
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS)

  const unreadCount = notifs.filter(n => !n.read).length

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })))
  const markRead = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x))

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e6d8cc]">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center hover:bg-[#F5EBDD] rounded-lg transition-colors">
            <ArrowLeft size={18} className="text-[#2A1F14]" />
          </Link>
          <div>
            <h1 className="font-semibold text-[#2A1F14]">Notifications</h1>
            {unreadCount > 0 && <p className="text-xs text-[#E27D60]">{unreadCount} unread</p>}
          </div>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-semibold text-[#1F7A8C] hover:underline">
            <CheckCheck size={14} />Mark all read
          </button>
        )}
      </div>

      <div className="divide-y divide-[#e8ddd0]">
        {notifs.map(n => (
          <Link key={n.id} href={n.href ?? '#'}
            onClick={() => markRead(n.id)}
            className={clsx(
              'flex items-start gap-3 px-4 py-4 transition-colors hover:bg-[#f4ede3]',
              !n.read && 'bg-[#E27D60]/5'
            )}>
            <div className="w-10 h-10 bg-[#F5EBDD] rounded-xl flex-shrink-0 flex items-center justify-center text-xl">
              {typeIcon[n.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[#2A1F14] text-sm">{n.title}</p>
                {!n.read && <span className="w-2 h-2 bg-[#E27D60] rounded-full flex-shrink-0" />}
              </div>
              <p className="text-xs text-[#2A1F14]/60 mt-0.5 leading-relaxed">{n.body}</p>
              <p className="text-xs text-[#2A1F14]/40 mt-1">{n.time}</p>
            </div>
          </Link>
        ))}
      </div>

      {notifs.length === 0 && (
        <div className="text-center py-20 text-[#2A1F14]/40">
          <p className="text-4xl mb-3">🔔</p>
          <p className="font-medium">All caught up!</p>
          <p className="text-sm mt-1">No new notifications</p>
        </div>
      )}
    </div>
  )
}

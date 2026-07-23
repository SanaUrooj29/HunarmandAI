// orders/hooks.ts — Order management business logic

import { useState } from 'react'
import { useAsync, fakeFetch } from '@/hooks/useAsync'
import { ORDERS } from '@/lib/mock-data'

export function useOrders() {
  return useAsync(() => fakeFetch(ORDERS))
}

export function useOrder(id: string) {
  return useAsync(() => fakeFetch(ORDERS.find(o => o.id === id) ?? null), [id])
}

export function useOrderActions(orderId: string) {
  const [loading, setLoading] = useState(false)

  const markReady = async () => {
    setLoading(true)
    await fakeFetch({ orderId, action: 'mark_ready' }, 800)
    setLoading(false)
  }

  const confirmOrder = async () => {
    setLoading(true)
    await fakeFetch({ orderId, action: 'confirm' }, 800)
    setLoading(false)
  }

  const reportIssue = async (reason: string) => {
    setLoading(true)
    await fakeFetch({ orderId, reason }, 600)
    setLoading(false)
  }

  return { markReady, confirmOrder, reportIssue, loading }
}

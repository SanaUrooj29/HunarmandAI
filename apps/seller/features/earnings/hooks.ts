// earnings/hooks.ts — Earnings & payout business logic

import { useAsync, fakeFetch } from '@/hooks/useAsync'
import { EARNINGS, TRANSACTIONS } from '@/lib/mock-data'

export function useEarnings() {
  return useAsync(() => fakeFetch(EARNINGS))
}

export function useTransactions() {
  return useAsync(() => fakeFetch(TRANSACTIONS))
}

export function useWallet() {
  return useAsync(() => fakeFetch({
    jazzcash: { last4: '7890', verified: true, active: true },
    easypaisa: null,
    pendingPayout: 4200,
    nextPayoutDate: 'Tue, 6 May',
  }))
}

// listings/hooks.ts — Product CRUD business logic
// Swap fakeFetch → real fetch('/api/listings') when backend is ready

import { useState } from 'react'
import { useAsync, fakeFetch } from '@/hooks/useAsync'
import { PRODUCTS } from '@/lib/mock-data'

export function useProducts() {
  return useAsync(() => fakeFetch(PRODUCTS))
}

export function useProduct(id: string) {
  return useAsync(() => fakeFetch(PRODUCTS.find(p => p.id === id) ?? null), [id])
}

export function usePublishListing() {
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)

  const publish = async (data: Record<string, unknown>) => {
    setPublishing(true)
    // POST /api/listings
    await fakeFetch(data, 1200)
    setPublishing(false)
    setPublished(true)
    return { slug: 'fatima-aslam', listingId: 'new-001' }
  }

  return { publish, publishing, published, reset: () => setPublished(false) }
}

export function useDeleteListing() {
  const [deleting, setDeleting] = useState(false)

  const deleteListing = async (id: string) => {
    setDeleting(true)
    await fakeFetch(id, 600)
    setDeleting(false)
  }

  return { deleteListing, deleting }
}

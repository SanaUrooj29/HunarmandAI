import { useState, useEffect } from 'react'

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const execute = () => {
    setLoading(true)
    return fn()
      .then(d => { setData(d); setLoading(false); return d; })
      .catch(e => { setError(e); setLoading(false); throw e; })
  }

  useEffect(() => {
    execute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error, refetch: execute }
}

export function fakeFetch<T>(data: T, delay = 600): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), delay))
}

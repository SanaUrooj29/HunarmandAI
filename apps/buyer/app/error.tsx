'use client'
import Link from 'next/link'

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'80dvh', padding:24, textAlign:'center' }}>
      <p style={{ fontSize:48, marginBottom:16 }}>⚠️</p>
      <h2 style={{ fontSize:20, fontWeight:700, color:'#1A150F', marginBottom:8 }}>Something went wrong</h2>
      <p style={{ fontSize:14, color:'#8C7D6B', marginBottom:24, maxWidth:300 }}>{error.message || 'An unexpected error occurred.'}</p>
      <button onClick={reset} style={{ padding:'12px 28px', background:'#C8614A', color:'white', border:'none', borderRadius:12, fontSize:14, fontWeight:600, cursor:'pointer' }}>Try again</button>
    </div>
  )
}

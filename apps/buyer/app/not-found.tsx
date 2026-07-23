import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'80dvh', padding:24, textAlign:'center' }}>
      <p style={{ fontSize:64, marginBottom:16 }}>🧵</p>
      <h2 style={{ fontSize:26, fontWeight:800, color:'#1A150F', marginBottom:8 }}>Page not found</h2>
      <p style={{ fontSize:14, color:'#8C7D6B', marginBottom:28, maxWidth:300, lineHeight:1.6 }}>This page doesn&apos;t exist. Try browsing handmade products instead.</p>
      <Link href="/marketplace" style={{ textDecoration:'none' }}>
        <button style={{ padding:'14px 32px', background:'#C8614A', color:'white', border:'none', borderRadius:14, fontSize:15, fontWeight:700, cursor:'pointer' }}>Go to marketplace</button>
      </Link>
    </div>
  )
}

'use client'
import Link from 'next/link'

export function HeroBanner() {
  return (
    <section style={{
      background: 'linear-gradient(135deg,#1F5757 0%,#2D7A7A 50%,#C8614A 100%)',
      padding: 'clamp(40px,7vw,80px) 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{ position:'absolute', right:'8%', top:'50%', transform:'translateY(-50%)', width:320, height:320, borderRadius:'50%', background:'rgba(255,255,255,.05)' }}/>
      <div style={{ position:'absolute', right:'4%', top:'10%', width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,.04)' }}/>

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.7)', letterSpacing:'.14em', marginBottom:14 }}>
          SUPPORT WOMEN ARTISANS
        </p>
        <h1 style={{ fontSize:'clamp(28px,5vw,52px)', fontWeight:900, color:'white', lineHeight:1.15, marginBottom:16, maxWidth:580 }}>
          Handmade with love by<br/>1,200+ women across Pakistan
        </h1>
        <p style={{ fontSize:16, color:'rgba(255,255,255,.82)', marginBottom:28, maxWidth:460, lineHeight:1.7 }}>
          Every purchase directly supports a home-based artisan. Authentic embroidery, food, crafts &amp; more — delivered to your door.
        </p>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          <Link href="/marketplace/search" style={{ textDecoration:'none' }}>
            <button style={{ padding:'13px 28px', background:'#C8614A', color:'white', border:'none', borderRadius:12, fontSize:15, fontWeight:700, cursor:'pointer' }}>
              Shop Now
            </button>
          </Link>
          <Link href="/marketplace/search?q=phulkari" style={{ textDecoration:'none' }}>
            <button style={{ padding:'13px 28px', background:'rgba(255,255,255,.15)', color:'white', border:'1.5px solid rgba(255,255,255,.3)', borderRadius:12, fontSize:15, fontWeight:600, cursor:'pointer', backdropFilter:'blur(4px)' }}>
              Explore stories
            </button>
          </Link>
        </div>
        <div style={{ display:'flex', gap:32, marginTop:36, flexWrap:'wrap' }}>
          {[['1,200+','Women artisans'],['50k+','Happy buyers'],['98%','On-time delivery']].map(([n,l]) => (
            <div key={l}>
              <div style={{ fontSize:22, fontWeight:800, color:'white' }}>{n}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,.65)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

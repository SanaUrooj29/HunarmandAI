'use client'
import Link from 'next/link'

export function MarketplacePromos() {
  return (
    <>
      {/* Story banner */}
      <section style={{ marginBottom: 48 }}>
        <div style={{
          borderRadius: 20,
          background: 'linear-gradient(135deg,#A84E3A 0%,#C8614A 60%,#8C7D6B 100%)',
          padding: 'clamp(24px,4vw,40px)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position:'absolute', right:-30, top:-30, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,.06)' }}/>
          <div style={{ position:'absolute', right:60, bottom:-40, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.04)' }}/>
          <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.7)', letterSpacing:'.1em', marginBottom:10 }}>SELLER STORY · 3 MIN READ</p>
          <h3 style={{ fontSize:'clamp(18px,3vw,28px)', fontWeight:800, color:'white', lineHeight:1.2, maxWidth:500, marginBottom:14 }}>
            How Fatima built a 14-product store from her courtyard in Lahore
          </h3>
          <p style={{ fontSize:14, color:'rgba(255,255,255,.8)', maxWidth:440, lineHeight:1.6, marginBottom:20 }}>
            &ldquo;I never thought I could sell my work online. HunarmandAI made it possible in 10 minutes.&rdquo;
          </p>
          <button style={{ padding:'11px 22px', background:'white', color:'#A84E3A', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer' }}>
            Read her story →
          </button>
        </div>
      </section>

      {/* Two promo cards */}
      <section style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20, marginBottom:48 }}>
        <div style={{ borderRadius:20, background:'#2D7A7A', padding:'28px 24px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-20, bottom:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.08)' }}/>
          <p style={{ fontSize:11, color:'rgba(255,255,255,.6)', letterSpacing:'.1em', marginBottom:8 }}>FOOD &amp; PICKLES</p>
          <h3 style={{ fontSize:20, fontWeight:700, color:'white', marginBottom:14, lineHeight:1.3 }}>
            Homemade food, straight from her kitchen
          </h3>
          <Link href="/marketplace/category/food" style={{ textDecoration:'none' }}>
            <button style={{ padding:'9px 18px', background:'rgba(255,255,255,.2)', color:'white', border:'1px solid rgba(255,255,255,.3)', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer' }}>
              Shop Food →
            </button>
          </Link>
        </div>
        <div style={{ borderRadius:20, background:'#F5E8E4', padding:'28px 24px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-20, bottom:-20, width:120, height:120, borderRadius:'50%', background:'rgba(200,97,74,.08)' }}/>
          <p style={{ fontSize:11, color:'#A84E3A', letterSpacing:'.1em', marginBottom:8 }}>CRAFTS &amp; HOME</p>
          <h3 style={{ fontSize:20, fontWeight:700, color:'#1A150F', marginBottom:14, lineHeight:1.3 }}>
            Handcrafted pieces for your home
          </h3>
          <Link href="/marketplace/category/crafts" style={{ textDecoration:'none' }}>
            <button style={{ padding:'9px 18px', background:'#C8614A', color:'white', border:'none', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer' }}>
              Shop Crafts →
            </button>
          </Link>
        </div>
      </section>
    </>
  )
}

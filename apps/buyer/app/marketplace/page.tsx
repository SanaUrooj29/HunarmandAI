import Link from 'next/link'
import { MOCK_PRODUCTS, MOCK_SELLERS, CATEGORIES } from '@/lib/mock/data'
import { ProductCard } from '@/components/buyer/ProductCard'
import { HeroBanner } from '@/features/marketplace/HeroBanner'
import { SellerCard } from '@/features/marketplace/SellerCard'
import { CategoryBar } from '@/features/marketplace/CategoryBar'
import { MarketplacePromos } from '@/features/marketplace/MarketplacePromos'
import { MobileDiscoverHeader } from '@/features/marketplace/MobileDiscoverHeader'
import { MobileMarketplace } from '@/features/marketplace/MobileMarketplace'

export default function MarketplacePage() {
  const featured = MOCK_PRODUCTS.filter(p => p.isTopSeller)
  const newArrivals = MOCK_PRODUCTS.slice(0, 8)

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100dvh' }}>
      {/* ── MOBILE LAYOUT (≤640px) ── */}
      <div className="mobile-only" style={{ display: 'none', flexDirection: 'column' }}>
        <MobileDiscoverHeader />
        <MobileMarketplace />
      </div>

      {/* ── DESKTOP LAYOUT (>640px) ── */}
      <div className="desktop-only">
        <HeroBanner />
        <CategoryBar />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 24px 60px' }}>
          {/* Top Sellers */}
          <section style={{ marginBottom: 48 }}>
            <SectionHeader title="Top sellers near you" subtitle="Verified artisans in Lahore &amp; nearby cities" href="/marketplace/search" linkLabel="See all" />
            <div className="h-scroll-row">
              {MOCK_SELLERS.map(s => <SellerCard key={s.id} seller={s} />)}
            </div>
          </section>

          {/* Featured picks */}
          <section style={{ marginBottom: 48 }}>
            <SectionHeader title="Featured picks" subtitle="Handpicked top-rated items this week" href="/marketplace/search" linkLabel="View all" />
            <div className="product-grid">
              {featured.map(p => <ProductCard key={p.id} product={p} layout="grid" />)}
            </div>
          </section>

          {/* Promo banners */}
          <MarketplacePromos />

          {/* New arrivals */}
          <section style={{ marginBottom: 48 }}>
            <SectionHeader title="New this week" subtitle="Fresh listings from our artisans" href="/marketplace/search?sort=new" linkLabel="See all new" />
            <div className="product-grid">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} layout="grid" />)}
            </div>
          </section>

          {/* All products */}
          <section style={{ marginBottom: 48 }}>
            <SectionHeader title="All products · Lahore &amp; nearby" subtitle={`${MOCK_PRODUCTS.length} handmade items`} href="/marketplace/search" linkLabel="Browse all" />
            <div className="product-grid">
              {MOCK_PRODUCTS.map(p => <ProductCard key={p.id} product={p} layout="grid" />)}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer style={{ background: '#1A150F', color: 'rgba(255,255,255,.7)', padding: '40px 24px 24px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 28, marginBottom: 32 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#C8614A,#2D7A7A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧵</div>
                  <span style={{ fontWeight: 800, color: 'white', fontSize: 14 }}>HunarmandAI</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6 }}>Empowering Pakistan&apos;s women artisans through technology.</p>
              </div>
              {[
                ['Shop', ['Embroidery', 'Food', 'Crafts', 'Home', 'Textiles']],
                ['Support', ['My Orders', 'Track Order', 'Returns', 'Contact Us']],
                ['Company', ['About Us', 'Press', 'Careers', 'Blog']],
              ].map(([title, links]) => (
                <div key={title as string}>
                  <p style={{ fontWeight: 700, color: 'white', marginBottom: 12, fontSize: 13 }}>{title as string}</p>
                  {(links as string[]).map(l => (
                    <Link key={l} href="#" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,.6)', textDecoration: 'none', marginBottom: 7 }}>{l}</Link>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 18, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
              <span>© 2026 HunarmandAI. Made with ❤️ in Pakistan.</span>
              <span>JazzCash &amp; EasyPaisa accepted · TCS &amp; Leopards delivery</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

function SectionHeader({ title, subtitle, href, linkLabel }: { title: string; subtitle: string; href: string; linkLabel: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A150F', marginBottom: 3 }} dangerouslySetInnerHTML={{ __html: title }} />
        <p style={{ fontSize: 13, color: '#8C7D6B' }} dangerouslySetInnerHTML={{ __html: subtitle }} />
      </div>
      <Link href={href} style={{ fontSize: 14, fontWeight: 600, color: '#C8614A', textDecoration: 'none', whiteSpace: 'nowrap', marginLeft: 16 }}>
        {linkLabel} →
      </Link>
    </div>
  )
}

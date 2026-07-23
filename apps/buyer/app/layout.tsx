import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'
import { CartProvider } from '@/lib/cart-context'
import { TopNav } from '@/components/layout/TopNav'
import { BottomNav } from '@/components/layout/BottomNav'

export const metadata: Metadata = {
  title: 'HunarmandAI — Handmade by Pakistan',
  description: 'Authentic handmade products from women artisans across Pakistan.',
  manifest: '/manifest.json',
}
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#C8614A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          {/* Top nav — hidden on mobile via .top-nav-wrapper CSS class */}
          <div className="top-nav-wrapper">
            <TopNav />
          </div>
          <main>
            {children}
          </main>
          {/* Bottom nav — visible only on mobile via .bottom-nav CSS class */}
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  )
}

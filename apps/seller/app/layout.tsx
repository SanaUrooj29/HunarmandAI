import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SidebarNav } from '@/components/layout/SidebarNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { TopBar } from '@/components/layout/TopBar'
import { ToastProvider } from '@/components/seller/Toast'
import { PWAInit } from '@/components/seller/PWAInit'
import { SidebarProvider } from '@/lib/sidebar-context'
import { ContentShell } from '@/components/layout/ContentShell'

export const metadata: Metadata = {
  title: { default: 'HunarmandAI — Seller Portal', template: '%s | HunarmandAI' },
  description: 'Turn your craft into income — list a product in 10 seconds with a single photo.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'HunarmandAI' },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    title: 'HunarmandAI Seller Portal',
    description: 'Turn your craft into income',
    siteName: 'HunarmandAI',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  themeColor: '#f4ede3',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>
          <SidebarProvider>
            <PWAInit />
            <div className="flex min-h-screen bg-[#f4ede3]">
              {/* Desktop sidebar */}
              <SidebarNav />
              {/* Content area — offset shifts with sidebar */}
              <ContentShell>
                <TopBar />
                <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
                  {children}
                </main>
              </ContentShell>
              {/* Mobile bottom nav */}
              <BottomNav />
            </div>
          </SidebarProvider>
        </ToastProvider>
      </body>
    </html>
  )
}

# HunarmandAI — Buyer Panel Frontend

Next.js 14 buyer-facing marketplace. Top navigation (no sidebar), fully responsive, zero Next.js server/client errors.

## Setup

```bash
npm install
npm run dev
# → http://localhost:3000  (auto-redirects to /marketplace)
```

## What's built

### Pages
| Route | Description |
|---|---|
| `/marketplace` | Home feed — hero, top sellers, categories, featured, new arrivals |
| `/marketplace/search` | Full search with sidebar filters (category, price, rating, city) + sort + grid/list toggle |
| `/marketplace/category/[id]` | Category browse |
| `/product/[id]` | Product detail — gallery, reviews with ratings breakdown + helpful votes |
| `/cart` | Cart grouped by seller with quantity controls |
| `/checkout` | JazzCash / EasyPaisa / COD checkout |
| `/orders` | Order list (Active/Past/Cancelled tabs) + review modal |
| `/orders/[id]/track` | Live tracking timeline with map visual |
| `/storefront/[sellerId]` | Seller profile + listings |
| `/auth` | OTP phone login |
| `/profile` | Buyer profile + menu |

### Architecture
- **No bottom nav / no sidebar** — top nav only, consistent with Daraz/Ethnic style
- **All event handlers in Client Components** — zero `⨯ Error: Event handlers cannot be passed to Client Component props`
- Server pages import client feature components that handle interactivity
- Cart state via React Context (CartProvider in root layout)

### Design tokens
- Terracotta `#C8614A` · Teal `#2D7A7A` · Cream `#FAF7F2`
- DM Sans (Latin) + Noto Nastaliq Urdu
- Responsive: 375px mobile → 1280px desktop

### Fix summary (v0.2)
1. Removed all seller portal code — buyer panel only
2. Replaced side nav with top nav (Daraz/Ethnic style)
3. Fixed all `onMouseEnter/onMouseLeave` in server components by extracting to `'use client'` components (`NavLink`, `SellerCard`, `CategoryBar`, `StorefrontClient`, `ProductCard`, `MenuRow`)
4. Marketplace page now server-rendered — interactive sub-sections are client components
5. Storefront page delegates to `StorefrontClient`

### Production checklist
- [ ] Connect Supabase for real product/order data
- [ ] Integrate JazzCash HMAC SDK for payments
- [ ] Add real SMS OTP via Jazz/Twilio
- [ ] TCS API for live order tracking
- [ ] Supabase Storage for product images
- [ ] Google Maps for delivery location picker
- [ ] i18n for Urdu (`/ur/*`)

# HunarmandAI Admin Portal

Internal operations dashboard for the HunarmandAI marketplace — *v2.0*

## Overview

This is the admin-only frontend for managing HunarmandAI, an AI-powered marketplace for Pakistan's informal women entrepreneurs. It is a **Next.js 14 App Router** application that maps to every admin use case defined in the SRS v2.0 (Module M7).

---

## Pages implemented

| Route | Description | SRS Coverage |
|---|---|---|
| `/dashboard` | KPI overview: GMV, sellers, orders, AI listings, marketplace activity chart, top categories, needs-attention queue | M7 — Admin overview |
| `/moderation` | Three-panel listing review: queue, detail pane, approve / edit-and-approve / remove actions | UC-09 — Admin Moderates a Product Listing |
| `/users` | Sellers, buyers, admins tabs with status badges, GMV, ratings, pagination | M7 — User management |
| `/orders` | Status stat cards, filterable order table, courier tracking statuses | UC-05, UC-06 — Checkout & Logistics |
| `/analytics` | AI listing success rate, generation latency bar chart, wellness sentiment donut, top sellers | M7 — Analytics |
| `/payouts` | Pending / paid / failed seller disbursements, 5% commission tracking | FR-4-03 — Commission & payout |
| `/ngo-partners` | Partner cards with sellers/orders counts, active/wellness/onboarding statuses | M7 — NGO partner management |
| `/learning-content` | Lesson list with triggers, completions, badges, live/draft status | UC-08 — Micro-learning |
| `/ai-monitoring` | Claude API call log, latency tracking, auto-flag review, model config | FR-2 — AI listing requirements |
| `/settings` | Commission slider (0–15%), integration health (JazzCash, EasyPaisa, TCS, Leopards, Claude, Supabase), danger zone | M7 — Platform settings |

---

## Tech stack

- **Framework:** Next.js 14 (App Router, Server + Client Components)
- **Language:** TypeScript (strict)
- **Styling:** Inline `<style>` CSS with CSS custom properties — zero external CSS framework dependency
- **Auth:** Middleware stub ready for Supabase JWT verification
- **Data:** Mock data in `lib/mock-data.ts` — replace with Supabase queries

---

## Design tokens (from SRS §6.1 + UI designs)

```
--terracotta:   #E27D60   (primary CTA, active states)
--teal:         #1F7A8C   (navigation, secondary data)
--cream:        #F5EBDD   (background warmth)
--brown:        #2A1F14   (body text)
--sand:         #F9F4EE   (hover states, card backgrounds)
```

---

## Getting started

```bash
# Install dependencies
npm install

# Run development server (port 3001 to avoid clash with seller PWA on 3000)
npm run dev

# Type check
npm run type-check

# Production build
npm run build && npm start
```

---

## Folder structure

```
app/
├── layout.tsx            # Root layout with Sidebar
├── page.tsx              # Redirect → /dashboard
├── globals.css           # Design tokens + global utilities
├── dashboard/page.tsx
├── moderation/page.tsx
├── users/page.tsx
├── orders/page.tsx
├── analytics/page.tsx
├── payouts/page.tsx
├── ngo-partners/page.tsx
├── learning-content/page.tsx
├── ai-monitoring/page.tsx
└── settings/page.tsx

components/
├── layout/
│   ├── Sidebar.tsx       # Responsive sidebar with mobile drawer
│   └── TopBar.tsx        # Sticky page header with search
├── admin/
│   └── StatCard.tsx      # KPI card with trend arrow
└── analytics/
    └── ActivityChart.tsx # Area chart with period toggle (7d/30d/90d/1y)

lib/
└── mock-data.ts          # All mock data + helpers (formatPKR, getInitials)

types/
└── index.ts              # Full TypeScript domain model (matches SRS Data Dictionary)

middleware.ts             # Auth middleware stub (replace with Supabase JWT)
```

---

## Connecting real data

Replace mock imports in each page with Supabase queries:

```typescript
// Example: replace in dashboard/page.tsx
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side only
);

const { data: sellers } = await supabase
  .from('users')
  .select('*')
  .eq('role', 'seller')
  .eq('status', 'active');
```

---

## Responsive breakpoints

| Breakpoint | Behaviour |
|---|---|
| ≥1100px | Full layout — sidebar + all table columns visible |
| 768–1100px | Some columns hidden, 2-col grids collapse |
| ≤768px | Sidebar becomes mobile drawer (hamburger), tables simplified |
| ≤480px | Single-column stat grids |

---

## SRS compliance notes

- **UC-09** fully implemented in `/moderation`: approve, edit-and-approve, remove with reason modal; auto-flag vs reported queue tabs; seller removal counter shown
- **FR-4-03** (5% commission) tracked in `/payouts` and `/settings` slider
- **NFR-U-02** (48×48 tap targets) respected on all interactive elements
- **Admin role only** — middleware ready for Supabase RLS enforcement
- Wellness data shown only as aggregated percentages (no raw text) — compliant with **NFR-S-07**

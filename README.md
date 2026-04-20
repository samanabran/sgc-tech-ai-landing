# SGC TECH AI — Premium Landing Page

## Project Overview
- **Name**: SGC TECH AI Landing Page
- **Goal**: A premium, production-ready landing page for SGC TECH AI that reflects world-class design quality — glassmorphism + brutalist minimalism, electric cyan on dark navy, zero generic "AI-slop" aesthetic.
- **Features**:
  - Asymmetric hero with animated circuit-board SVG background and floating logo with orbit rings
  - 8 glassmorphism industry cards with hover spotlight + icon animations
  - 6 value-prop cards with neon icon rings and gradient borders
  - 3 pricing tiers (Starter $2,400 / Professional $7,900 / Enterprise Custom) with featured card elevation
  - 3 customer testimonials with premium card layout and 5-star ratings
  - Minimalist FAQ accordion (native `<details>` for zero-JS accessibility)
  - High-contrast final CTA card with magnetic buttons
  - Trust-bar infinite marquee
  - Custom cursor glow (desktop), scroll-reveal observer, magnetic CTAs, animated stat counters

## URLs
- **Sandbox**: https://3000-irbjmooyeepkdfo4opz7l-ea026bf9.sandbox.novita.ai
- **Production**: _Not yet deployed to Cloudflare Pages (run `npm run deploy` when ready)_
- **Local dev**: http://localhost:3000

## Entry Points / Sections (anchor links)
- `/#top` — Hero
- `/#industries` — Industries Served (8 categories)
- `/#why` — Why SGC TECH AI (6 value props)
- `/#pricing` — Pricing tiers
- `/#testimonials` — Customer quotes
- `/#faq` — Frequently asked questions
- `/#contact` — Final CTA

## Design System
| Token | Value |
|---|---|
| **Base background** | `#0b0e27` (navy-900) with radial gradient mesh + noise |
| **Primary accent** | `#00d9ff` (electric cyan) |
| **Secondary accent** | `#0047ff` (tech blue) |
| **Display font** | Space Grotesk (600/700) |
| **Body font** | Outfit (400/500) |
| **Mono font** | JetBrains Mono (labels, numerics) |
| **Glass blur** | `backdrop-filter: blur(20px) saturate(160%)` |
| **Border system** | Animated gradient border via mask-composite |

## Anti-Pattern Compliance ✅
- ❌ No Inter font — using Space Grotesk + Outfit
- ❌ No purple gradients — only cyan/tech-blue
- ❌ No centered hero — asymmetric 1.3fr / 1fr grid
- ❌ No generic AI-slop aesthetic — intentional brutalist type, mono labels, numbered sections
- ❌ No excessive animations — subtle float, pulse, marquee, scroll-reveal only
- ❌ No boring solid backgrounds — gradient mesh + noise + animated circuit SVG

## Data Architecture
- **Data Models**: All content is statically typed in `src/index.tsx` (industries, values, pricing, testimonials, faqs arrays)
- **Storage Services**: None — 100% static rendered at request time via Hono JSX renderer on Cloudflare Pages edge
- **Data Flow**: Request → Hono handler → JSX SSR → Cloudflare edge CDN → Browser

## User Guide
1. **Navigate** with the top nav (Industries / Why SGC / Pricing / Customers / FAQ) — smooth scroll with offset
2. **Hover** on any glass card to see the cyan spotlight follow the cursor
3. **Hover** on primary CTAs to feel the magnetic pull effect
4. **Expand** FAQ items by clicking (uses native `<details>` for zero-JS accessibility)
5. **Mobile**: fully responsive at 375px / 768px / 1440px breakpoints

## Project Structure
```
webapp/
├── src/
│   ├── index.tsx              # Main Hono app + all page sections
│   ├── renderer.tsx           # HTML shell (meta, fonts, favicon)
│   └── components/
│       ├── Icons.tsx          # All inline SVG icons
│       └── CircuitBg.tsx      # Animated circuit-board background
├── public/static/
│   ├── style.css              # Design system + all section styles (28.7 KB)
│   ├── app.js                 # Interactions: reveal, magnetic, cursor glow (5.2 KB)
│   └── sgc-tech-logo.png      # Brand logo (115 KB)
├── ecosystem.config.cjs       # PM2 process config
├── wrangler.jsonc             # Cloudflare Pages config
├── vite.config.ts             # Vite + Hono + Cloudflare Pages adapter
└── package.json
```

## Deployment
- **Platform**: Cloudflare Pages (via `wrangler pages dev dist`)
- **Status**: ✅ Active in sandbox on port 3000 via PM2
- **Tech Stack**: Hono + TypeScript + JSX + vanilla CSS + vanilla JS (no framework runtime, no React, no build-step bloat)
- **Bundle**: `_worker.js` = 71.72 KB (includes all JSX rendering logic)
- **Last Updated**: 2026-04-20

## Commands
```bash
# Build production bundle
npm run build

# Start with PM2 (sandbox)
pm2 start ecosystem.config.cjs
pm2 logs webapp --nostream

# Deploy to Cloudflare Pages (requires setup_cloudflare_api_key first)
npm run deploy
```

## Features Not Yet Implemented (Suggested Next Steps)
1. **Contact form backend** — the `#contact` CTA is presentational; wire it to a Cloudflare Workers endpoint + email provider (Resend/SendGrid)
2. **Live booking widget** — integrate Cal.com or Calendly for the "Book a 30-min call" button
3. **Customer case-study pages** — build `/case-studies/[slug]` routes for Meridian, Vertex, Northwind
4. **Dark/light toggle** — currently dark-only (per brief), but a light variant could be added
5. **i18n** — content is English-only; wrap strings for easier translation
6. **Analytics** — add Cloudflare Web Analytics or Plausible
7. **Open Graph image** — generate a dynamic OG image via Satori/workers for social previews

# SGC TECH AI Landing Page — Copilot Instructions

## Commands

```bash
npm run dev        # Vite dev server — http://localhost:3000
npm run build      # Production build → ./dist
npm run deploy     # build + wrangler pages deploy to Cloudflare Pages
npm run preview    # serve ./dist locally via wrangler pages dev
npm run test       # vitest unit tests (tests/unit/)
npm run test:e2e   # Playwright e2e tests (tests/e2e/) — requires server on :3000
```

No lint script is configured.

## Architecture

**Hono.js SSR app** deployed to **Cloudflare Pages** as a serverless edge function.

```
src/
  index.tsx              — Main Hono app: page data arrays, route mounts, JSX landing page
  renderer.tsx           — HTML shell: <head>, fonts, CDN scripts, /static/style.css & app.js
  routes/
    api.ts               — POST /api/validate-email, POST /api/send-quote (email + Odoo CRM)
    quote-builder.tsx    — SSR page for /quote-builder (interactive pricing configurator)
  components/
    Icons.tsx            — Inline SVG icon components (currentColor, 1.5px stroke-width)
    CircuitBg.tsx        — Animated SVG circuit-board background (CSS-driven, no SMIL)
    Nav.tsx              — Site navigation component
    AwardBadges.tsx      — Re-exports from ui/award.tsx
    Badges.tsx           — Badge/pill components
    ui/award.tsx         — StampBadge + AwardBadgeCard SVG components
  data/
    quote-data.ts        — INDUSTRIES, AI_FEATURES, ODOO_MODULES typed data arrays
  utils/
    pricing.ts           — calculateQuote() — pure pricing logic (unit-tested)
    email-validator.ts   — validateEmail() — format + disposable domain check
    email-templates.ts   — buildCustomerEmailHtml(), buildNotificationEmailHtml()
    smtp.ts              — sendEmail() — Zoho SMTP via smtppro.zoho.com:465
    odoo.ts              — createOdooLead() — Odoo CRM REST API integration
public/static/
  style.css              — All CSS: design tokens, layout, animations — no CSS framework
  app.js                 — All client interactivity (vanilla JS IIFE, no framework)
tests/
  unit/pricing.test.ts   — vitest tests for calculateQuote + data integrity
  e2e/quote-builder.spec.ts, chatbox.spec.ts — Playwright e2e tests
```

**Request flow**: HTTP → Cloudflare Pages edge → Hono → JSX SSR → HTML response  
**Cloudflare bindings**: `AIRA_BRAIN_KV` (KV namespace) for rate limiting, token storage, Aira memory

## Routes

| Route | Handler |
|---|---|
| `GET /` | Landing page (src/index.tsx) |
| `GET /quote-builder` | Quote builder SSR page |
| `POST /api/validate-email` | Email validation + KV token issuance |
| `POST /api/send-quote` | Quote calculation, email send, Odoo lead sync |
| `GET/POST /api/aira/memory` | Aira AI memory API (KV-backed) |
| `GET /api/aira/chat` | Proxy to aira.tachimao.com |
| `GET /api/admin/aira/sessions` | Admin: list all Aira sessions |
| `GET /admin/aira-memory` | Admin dashboard UI |

## Key Conventions

### Hono JSX — not React
This project uses **Hono's JSX runtime** (`jsxImportSource: "hono/jsx"`), not React:
- Use `class` (not `className`)
- Use `innerHTML` for raw SVG/HTML string injection
- No event handlers, refs, or hooks in server-rendered JSX
- All interactivity is in `public/static/app.js` (vanilla JS)

### Static assets are not bundled
`/public/static/style.css` and `/public/static/app.js` are served as-is — not processed by Vite or imported by TypeScript. CDN scripts (GSAP, particles.js, Lenis) are loaded in `renderer.tsx` via `<script defer>`.

### All page data lives in `src/index.tsx`
Content arrays (`industries`, `values`, `pricing`, `testimonials`, `faqs`) are typed TypeScript objects at the top of `src/index.tsx`. No CMS — edit those arrays directly.

### Quote data lives in `src/data/quote-data.ts`
`INDUSTRIES` (10), `AI_FEATURES` (9), `ODOO_MODULES` (15) are the single source of truth for the quote builder. The `calculateQuote()` utility is pure and fully unit-tested. **Server-side always recomputes totals** — never trust client-submitted prices.

### Design system (in `style.css`)
CSS custom properties are the single source of truth for design tokens:
- `--cyan: #00d9ff` — primary accent
- `--tech-blue: #0047ff` — secondary accent
- `--navy-900: #0b0e27` — base background
- `--glass-bg`, `--glass-border` — glassmorphism surface tokens
- **Display font**: Space Grotesk (600/700) via Google Fonts
- **Body font**: Outfit (400/500) via Google Fonts
- **Mono font**: JetBrains Mono (labels, prices) via Google Fonts in style.css

**Do NOT use** (anti-patterns):
- ❌ Satoshi or Inter fonts — use Space Grotesk + Outfit
- ❌ Purple gradients — cyan/tech-blue only
- ❌ Centered hero — asymmetric grid
- ❌ Tailwind utility classes in JSX markup — pure CSS only
- ❌ className — use `class` (Hono JSX)

### Scroll-reveal pattern
Elements with `class="reveal"` (+ optional `class="reveal-delay-N"` 1–4) are animated by an `IntersectionObserver` in `app.js`. Add to any new section container that should fade/slide in on scroll.

### API security patterns
- `/api/validate-email` issues a short-lived KV token (`qt:{uuid}`, TTL 600s) after validating email. `/api/send-quote` verifies this token before processing — single use, invalidated on success.
- Rate limiting uses `AIRA_BRAIN_KV` with sliding window counters (`rl:{endpoint}:{ip}`).
- Honeypot field `_hp` in quote form body — non-empty = bot, reject silently.
- `/api/admin/aira/*` checks `ADMIN_TOKEN` env var; unset = open (dev only).

### Cloudflare environment access
```typescript
const env = c.env as Record<string, string> & { AIRA_BRAIN_KV: KVNamespace }
```
Guard every binding with a null check; return `503` with setup instructions if missing.

### SMTP / Odoo integration
- Email: Zoho SMTP via `smtppro.zoho.com:465`, sender `hello@scholarixglobal.com`
- Secrets set via `wrangler secret put SMTP_PASS` and `wrangler secret put ODOO_API_KEY`
- Odoo CRM sync is fire-and-forget (`.catch(console.error)`) — never block quote response on it

## Testing

- **Unit**: `npm run test` — vitest, runs `tests/unit/**/*.test.ts` in Node env
- **E2E**: `npm run test:e2e` — Playwright (Chromium), requires server at `:3000` (`reuseExistingServer: true`)
- Playwright browser is cached at `.playwright-browsers/chromium-1217/chrome-win64/chrome.exe`

## Deployment

Pushes to `main` automatically deploy via `.github/workflows/deploy.yml`:
- Runs `npm ci && npm run build`
- Deploys `dist/` to Cloudflare Pages project `sgc-tech-ai-landing`
- Uses `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` secrets

Manual: `npm run deploy`

## Environment Variables (wrangler.jsonc)

| Variable | Description |
|---|---|
| `AIRA_BRAIN_KV` | KV namespace binding (rate limiting, tokens, Aira memory) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_FROM` | Zoho SMTP config (in vars) |
| `NOTIFICATION_EMAIL` | Where quote alerts are sent (`info@sgctech.ai`) |
| `ODOO_URL` / `ODOO_DB` / `ODOO_USER` | Odoo instance config |
| `SMTP_PASS` | Secret — set with `wrangler secret put` |
| `ODOO_API_KEY` | Secret — set with `wrangler secret put` |
| `ADMIN_TOKEN` | Optional secret — protects `/api/admin/*` routes |

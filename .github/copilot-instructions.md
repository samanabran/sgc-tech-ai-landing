# SGC TECH AI Landing Page — Copilot Instructions

## Commands

```bash
npm run dev      # local dev server (Vite + Hono dev adapter, http://localhost:3000)
npm run build    # production build → ./dist
npm run deploy   # build + wrangler pages deploy to Cloudflare Pages
npm run preview  # serve ./dist locally via wrangler pages dev
```

No test suite is configured. There is no lint script.

## Architecture

This is a **Hono.js SSR app** deployed to **Cloudflare Pages** as a serverless edge function.

```
src/
  index.tsx     — single-file app: all page data arrays, Hono route handlers, JSX page render
  renderer.tsx  — HTML shell (head, fonts, CDN scripts, /static/style.css, /static/app.js)
  components/
    Icons.tsx        — inline SVG icon components (currentColor, 1.5 stroke-width)
    CircuitBg.tsx    — animated SVG circuit-board background (CSS-driven, no SMIL)
    AwardBadges.tsx  — re-exports from ui/award.tsx
    ui/award.tsx     — StampBadge + AwardBadgeCard SVG components with computed paths
public/static/
  style.css     — all CSS (design tokens, layout, animations) — no CSS framework at runtime
  app.js        — all client-side interactivity (vanilla JS IIFE)
```

**Request flow**: HTTP request → Cloudflare Pages edge → Hono handler → JSX SSR → HTML response  
**Cloudflare binding**: `AIRA_BRAIN_KV` (KV namespace) for Aira AI memory API (`/api/aira/memory`)

## Key Conventions

### Hono JSX — not React
JSX in this project uses **Hono's JSX runtime**, not React. Key differences:
- Use `class` (not `className`)
- Use `innerHTML` for raw SVG/HTML string injection
- Event handlers and refs are not used in server-rendered JSX

### Static assets are not bundled
`/public/static/style.css` and `/public/static/app.js` are **served as-is** — they are not processed by Vite or imported by TypeScript. Changes to these files take effect immediately in dev. The CDN scripts (`typed.js`, `particles.js`) are loaded in the HTML shell via `<script defer>`.

### All page data lives in `src/index.tsx`
Content arrays (`industries`, `values`, `pricing`, `stories`, `testimonials`, `faqs`) are typed TypeScript objects defined at the top of `src/index.tsx`. To add or edit content, modify those arrays directly — there is no CMS or external data source.

### Design system (in `style.css`)
CSS custom properties are the single source of truth for the design:
- `--cyan: #00d9ff` — primary accent
- `--tech-blue: #0047ff` — secondary accent  
- `--navy-900: #0b0e27` — base background
- `--glass-bg`, `--glass-border` — glassmorphism surface tokens
- Fonts: **Satoshi** (display/body, via Fontshare) + **JetBrains Mono** (labels/numerics, via Google Fonts)

The aesthetic is intentionally **glassmorphism + brutalist minimalism** — no Inter font, no purple gradients, no centered hero, no Tailwind utility classes in markup.

### Scroll-reveal pattern
Elements with `class="reveal"` and optional `class="reveal-delay-N"` (1–4) are animated in by an `IntersectionObserver` in `app.js`. Add these classes to any new section container that should fade/slide in on scroll.

### Admin API authorization
`/api/admin/aira/*` endpoints check for an `ADMIN_TOKEN` environment variable. If the var is unset, all requests are allowed. Set it in `wrangler.jsonc` vars (commented-out template already present) for production.

### Cloudflare environment access
Cloudflare bindings (KV, env vars) are accessed via `(c.env as any)?.BINDING_NAME` inside Hono route handlers. Always guard with a null check and return a `503` with setup instructions if the binding is missing — see existing `/api/aira/memory` handlers for the pattern.

## Deployment

Pushes to `main` automatically deploy via `.github/workflows/deploy.yml` using `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets. Manual deploy: `npm run deploy`.

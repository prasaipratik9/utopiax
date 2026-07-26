# UtopiaX — Phase 2

MERN-adjacent rebuild: **React + Vite** (client) → Vercel; **Node + Express + Supabase** (server) → Render (Week 2+).

## Week 1 complete (frontend)

- Monorepo with `client/` (React/Vite) and `legacy/` (Phase 1 static prototype)
- All 8 public pages in React with dark hybrid UI kit theme
- Content seeded from `content.json` via `ContentProvider` (swap to API in Week 2)
- Universal Header / Footer via `Layout`
- Contact form UI stubbed (Nodemailer in Week 3)

## Quick start

```bash
cd utopiax
npm install
npm run dev
```

App: http://localhost:5173

```bash
npm run build          # production build of client
```

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/openmindx` | Speaking |
| `/ideationworx` | Ideation |
| `/lumierex` | Retreats |
| `/xperiences` | Programs (paginated) |
| `/media` | Media (filterable) |
| `/about` | About / team |
| `/contact` | Contact (stub) |

## Structure

```
utopiax/
  client/     # React + Vite → Vercel
  legacy/     # Phase 1 reference
  server/     # Week 2
```

## Vercel

Root `vercel.json` builds the `client` workspace. Or set project root to `client/`.

## 4-week timeline

| Week | Focus |
|------|--------|
| 1 | Frontend + Vercel (this week) |
| 2 | Express + Supabase + JWT + CMS |
| 3 | Cloudinary + Nodemailer |
| 4 | Stripe + QA + handover |

## Design tokens

Primary `#5811FB` · Secondary `#00F0FF` · Tertiary `#FF4D80` · Neutral `#0F172A`  
Fonts: Space Grotesk + Inter

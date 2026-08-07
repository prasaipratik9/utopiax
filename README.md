# UtopiaX — Phase 2

MERN-adjacent rebuild: **React + Vite** (client) → Vercel; **Node + Express** (server) → Render (Week 2+).

## Status

- **Frontend:** All 8 public pages use the landing design system (`#FA3E32`, Bricolage / Public Sans)
- **Backend:** Light Express scaffold (`/api/health`, `/api/content`) — auth/CMS later

## Quick start

```bash
cd utopiax
npm install
npm run dev              # client → http://localhost:5173
npm run dev:server       # API → http://localhost:4000
```

```bash
npm run build            # production build of client
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
  server/     # Express scaffold (Week 2 start)
  legacy/     # Phase 1 reference
```

## 4-week timeline

| Week | Focus |
|------|--------|
| 1 | Frontend + Vercel |
| 2 | Express + Supabase + JWT + CMS (scaffold started) |
| 3 | Cloudinary + Nodemailer |
| 4 | Stripe + QA + handover |

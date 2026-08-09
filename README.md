# UtopiaX — Phase 2



MERN-adjacent rebuild: **React + Vite** (client) → Vercel; **Node + Express** (server) → Render; **Supabase** (optional DB for CMS + admins).



## Status



- **Frontend:** All 8 public pages use the landing design system (`#FA3E32`, Bricolage / Public Sans)

- **Backend (Week 2):** Express API with JWT login + content CMS; file store by default, Supabase when configured

- **Admin:** `/admin/login` → `/admin` (Site, Home, pillars, Media, About, Contact, …)



## Quick start



```bash

cd utopiax

npm install

npm run dev:server       # API → http://localhost:4000

npm run dev              # client → http://localhost:5173 (proxies /api)

```



```bash

npm run build            # production build of client

```



### Admin CMS



1. Start the API (`npm run dev:server`)

2. Open http://localhost:5173/admin/login

3. Sign in with `admin` / `utopiax-admin`

4. Edit fields → **Save changes**



Without Supabase, saves write `client/src/data/content.json`. With Supabase, saves go to the DB and sync the local file.



### Optional Supabase



See [`server/README.md`](./server/README.md) and run [`server/schema.sql`](./server/schema.sql). Copy `server/.env.example` → `server/.env` and set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.



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

| `/admin/login` | CMS login |

| `/admin` | CMS editor |



## Structure



```

utopiax/

  client/     # React + Vite → Vercel

  server/     # Express + JWT + content API (+ optional Supabase)

  legacy/     # Phase 1 reference

```



## 4-week timeline



| Week | Focus |

|------|--------|

| 1 | Frontend + Vercel |

| 2 | Express + JWT + CMS + Supabase (done; DB optional until you add keys) |

| 3 | Cloudinary + Nodemailer |

| 4 | Stripe + QA + handover |



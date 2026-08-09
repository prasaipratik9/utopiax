# UtopiaX API (Week 2)

Express + JWT admin auth + content CMS + relational resources (Supabase).

- **JSON CMS** (`/api/content`) — file by default; Supabase `site_content` when configured. Do not remove.
- **Relational APIs** (`/api/services`, etc.) — require Supabase + [`schema-core.sql`](./schema-core.sql).

## Endpoints

### Auth + CMS (always available)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/health` | no | Health + storage/auth mode |
| POST | `/api/auth/login` | no | Admin login → JWT |
| GET | `/api/auth/me` | yes | Current user |
| GET | `/api/content` | no | Read marketing copy JSON |
| PUT | `/api/content` | yes | Save marketing copy JSON |

### Relational (need Supabase + schema-core.sql)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/services` | optional | List (published only if anonymous) |
| POST/PUT/DELETE | `/api/services[/:id]` | yes | Manage services |
| GET | `/api/products` | optional | List products |
| POST/PUT/DELETE | `/api/products[/:id]` | yes | Manage products |
| GET | `/api/media` | optional | List media |
| POST/PUT/DELETE | `/api/media[/:id]` | yes | Manage media |
| POST | `/api/enquiries` | no | Submit enquiry (`emailed=false`; Nodemailer later) |
| GET | `/api/enquiries?status=` | yes | List enquiries |
| POST | `/api/newsletter/subscribe` | no | Subscribe (idempotent on email) |
| GET | `/api/newsletter/subscribers` | yes | List subscribers |
| POST | `/api/analytics/events` | no | Record event (202) |
| GET | `/api/analytics/summary` | yes | Counts by event_type / page |
| GET | `/api/users` | yes | List users (no password hashes) |
| PATCH | `/api/users/:id/role` | yes | Set `admin` or `editor` |

Each route file under `routes/` has a curl comment block at the top.

## Default credentials (dev)

- Username: `admin`
- Password: `utopiax-admin`

Override with `ADMIN_USER`, `ADMIN_PASSWORD`, `JWT_SECRET`, `SESSION_HOURS`, `PORT`.

## Run

```bash
npm install
npm run dev:server
```

API: http://localhost:4000

Without Supabase: CMS uses `content.json`; relational routes return **503**.

## Supabase setup

1. Run [`schema.sql`](./schema.sql) (CMS + initial admins table) if not already applied.
2. Run [`schema-core.sql`](./schema-core.sql) (renames `admins` → `users`, adds role + catalogs / enquiries / newsletter / analytics). Safe to re-run; preserves existing admin rows.
3. Copy [`.env.example`](./.env.example) → `server/.env` with `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
4. Restart API. Health should show `"db": "supabase"`.

### Quick verify (PowerShell)

```powershell
# Login
$login = Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/auth/login `
  -ContentType "application/json" -Body '{"username":"admin","password":"utopiax-admin"}'
$TOKEN = $login.token
$H = @{ Authorization = "Bearer $TOKEN" }

# Public write
Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/enquiries `
  -ContentType "application/json" `
  -Body '{"name":"Ada","email":"ada@example.com","message":"Hello"}'

# Admin list
Invoke-RestMethod -Uri http://localhost:4000/api/services -Headers $H
Invoke-RestMethod -Uri http://localhost:4000/api/analytics/summary -Headers $H
```

## Later weeks

- Nodemailer for enquiries (`emailed` flag ready)
- Cloudinary for media `url` / `thumbnail_url`
- Stripe for products

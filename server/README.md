# UtopiaX API (Week 2)

Express + JWT admin auth + content CMS. Storage is **file by default**; set Supabase env vars to use the database.

## Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/health` | no | Health + storage/auth mode |
| POST | `/api/auth/login` | no | Admin login → JWT |
| GET | `/api/auth/me` | yes | Current admin user |
| GET | `/api/content` | no | Read site content |
| PUT | `/api/content` | yes | Save site content |

## Default credentials (dev)

- Username: `admin`
- Password: `utopiax-admin`

Override with `ADMIN_USER`, `ADMIN_PASSWORD`, `JWT_SECRET`, `SESSION_HOURS`, `PORT`.

## Run (file mode — no DB required)

```bash
npm install
npm run dev:server
```

API: http://localhost:4000  
`GET /api/health` should show `"db": "file"`.

## Supabase setup (optional)

1. Create a free Supabase project.
2. In the SQL editor, run [`schema.sql`](./schema.sql).
3. Copy [`.env.example`](./.env.example) → `server/.env` and fill:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only — never expose in the client)
4. Restart the API. Health should show `"db": "supabase"`.
5. First `GET /api/content` seeds `site_content` from `client/src/data/content.json`.
6. First successful login with env credentials seeds an `admins` row (bcrypt hash).

Saves still sync `content.json` locally so Vite seed/offline fallback stays current.

## Later weeks

- Nodemailer for contact form
- Cloudinary / Stripe

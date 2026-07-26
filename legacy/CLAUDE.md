# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

UtopiaX is a static marketing website (7 public pages) with a hand-rolled admin CMS, served by a small dependency-free Node HTTP server. There is no build step, no bundler, no framework, and no test suite — everything is plain HTML/CSS/JS loaded directly by the browser.

## Commands

```bash
npm start   # or: npm run dev — both just run `node server.js`
```

- Serves the site at http://localhost:3000, admin CMS at http://localhost:3000/admin/
- Default admin login: `admin` / `utopiax-admin` (defined in `config.json`)
- No install step needed beyond Node itself (`engines.node >= 18`); there are no npm dependencies to install
- No lint, test, or build commands exist in this repo — do not invent or assume any
- Pages can also be previewed with VS Code Live Server (port 5500); saves in that mode persist to `localStorage` only, not to `content.json`, until `npm start` is run

## Architecture

### Content flow: file → override → DOM

All page copy lives in `content.json`, a single flat-ish JSON tree keyed by section (`site`, `nav`, `social`, `home`, `xperiences`, `mediaItems`, etc.). Nothing is hardcoded server-side per page — the same file feeds every public page and the admin CMS.

1. **`js/content-store.js`** loads on every page. On `DOMContentLoaded` it fetches `content.json` (trying `./content.json`, `content.json`, `/content.json`, then falling back to `/api/content`), deep-merges any `localStorage` override (`utopiax_cms_override`) on top, and assigns the result to `window.CONTENT`. It then fires a `contentready` event and applies all `[data-cms="path.to.value"]` bindings by setting `textContent` (or `innerHTML`/`href` when `data-cms-html`/`data-cms-href-path` are set).
2. **`js/layout.js`** listens for `contentready` and renders the shared header/nav and footer into `#site-header`/`#site-footer` on any page whose `<body>` has `data-public-site`. Nav links, social links, and footer contact info fall back to hardcoded `DEFAULT_*` constants if `window.CONTENT` lacks them.
3. **`js/main.js`** handles page-specific rendering driven by `document.body.dataset.page` (e.g. `home`, `media`, `xperiences`) — pagination, media/xperience card rendering, filtering.
4. **`js/admin.js`** is the CMS: it edits an in-memory copy of `window.CONTENT`, and "Save changes" either writes to `localStorage` (`utopiax_cms_override`, for Live Server / no-backend previews) or `PUT`s the full merged document to `/api/content` (when `server.js` is running), which persists it directly to `content.json` on disk.

When editing a page's copy, prefer adding a `data-cms` binding + a `content.json` key over hardcoding text, so the admin CMS can manage it.

### Server (`server.js`)

A single-file Node `http` server (no Express) that:
- Serves static files from the repo root (path-traversal guarded against `ROOT`)
- Exposes `/api/content` (GET public, PUT requires auth) and `/api/auth/{login,me,logout}`
- Auth is an in-memory `Map` of bearer tokens (also settable via `utopiax_session` cookie) with expiry from `config.json`'s `sessionHours`; tokens are lost on server restart
- Credentials live in plaintext in `config.json` — this is an explicitly documented prototype/demo limitation, not an oversight (see README "Security notes")

### Pages

Each public HTML page sets `data-public-site` and `data-page="<id>"` on `<body>`, includes empty `#site-header`/`#site-footer` containers, and loads scripts in this fixed order: `content-store.js` → `layout.js` → `main.js`. The `admin/` pages do not include `data-public-site` and do not use `layout.js` (they have their own header/nav in `dashboard.html`).

| URL | Page id |
| --- | --- |
| `/` (`index.html`) | `home` |
| `openmindx.html` | speaking |
| `ideationworx.html` | ideation |
| `lumierex.html` | retreats |
| `xperiences.html` | paginated programs |
| `media.html` | filterable blog/media |
| `about.html` | about/team |
| `contact.html` | client-side-only contact form (no email backend) |

## Styling

UI kit colors: Primary `#5811FB`, Secondary `#00F0FF`, Tertiary `#FF4D80`, Neutral `#0F172A`. Fonts: Space Grotesk (display) + Inter (body). Public styles in `css/styles.css`; admin-only styles in `css/admin.css`.

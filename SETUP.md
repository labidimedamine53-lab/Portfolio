# Portfolio — Backend & Deployment Setup

This document covers everything beyond the visual portfolio: the database, the
working contact form, the analytics layer, and how to deploy to production.

---

## 1. Local development

```bash
cp .env.example .env.local
# edit .env.local if needed — the defaults work for local dev
npm install
npm run db:push          # creates ./local.db with the schema
npm run dev              # http://localhost:3000
```

Open `/admin` in a browser. You'll be prompted for the Basic Auth credentials
from `.env.local` (default: `admin` / `dev-password-change-me`).

Useful scripts:

| Script              | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start dev server                               |
| `npm run build`     | Production build                               |
| `npm run db:push`   | Apply schema changes to the configured DB     |
| `npm run db:studio` | Open Drizzle Studio — a web GUI for the DB    |
| `npm run lint`      | ESLint                                         |

---

## 2. What's in the backend

### Database (`lib/db/schema.ts`)

Two tables, persisted via Drizzle ORM on libSQL (SQLite-compatible):

- **`contact_messages`** — name / email / message / locale / hashed IP / UA / timestamp
- **`page_views`** — path / referrer / country / session hash / timestamp

IPs are never stored raw — they're SHA-256 hashed with a salt
(`IP_HASH_SALT`) and truncated, so individual visitors can't be
re-identified but session-level dedup still works.

### Contact form (`app/actions/contact.ts`)

- Server action invoked via `<form action={…}>` + `useActionState`
- Zod validation, field-level errors surfaced to the UI
- Honeypot field (`website`) silently catches bots
- Writes to `contact_messages`
- Pending/success/error states all wired up

### Page view tracker (`components/PageViewTracker.tsx`)

Mounted once on `/`, fires a server action on first render. Captures:
path, referrer, country (when behind Vercel or Cloudflare), session hash.

### Admin (`/admin`)

Server component that reads stats + recent messages. Protected by
HTTP Basic Auth via `proxy.ts` (Next 16's replacement for `middleware.ts`).
Shows:

- Total page views, last-7-day views, message count
- Top pages, top countries
- Latest 50 messages with mailto links

---

## 3. Analytics layers

You get analytics from two complementary sources:

1. **Vercel Analytics** (`@vercel/analytics`) — drop-in via `<Analytics />` in
   `app/layout.tsx`. Free on Vercel, no cookies, GDPR-friendly. Shows
   page views, top pages, top countries, top referrers, devices.

2. **First-party DB tracking** — your own `page_views` table you fully own.
   Visible at `/admin`. Works on any host, not just Vercel.

If you don't deploy to Vercel, the `<Analytics />` component is a no-op
and you still get first-party tracking via the DB.

---

## 4. Production deployment — Vercel + Turso

### a) Create a free Turso database

1. `npm install -g turso` (or use [turso.tech](https://turso.tech))
2. `turso auth signup`
3. `turso db create amine-portfolio`
4. `turso db show amine-portfolio --url` → copy the `libsql://…` URL
5. `turso db tokens create amine-portfolio` → copy the auth token

### b) Push the schema to Turso

```bash
# Set production env temporarily and push
DATABASE_URL="libsql://..." DATABASE_AUTH_TOKEN="..." npm run db:push
```

### c) Deploy to Vercel

1. Push the repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables (Settings → Environment Variables):

   | Variable              | Value                                          |
   | --------------------- | ---------------------------------------------- |
   | `DATABASE_URL`        | Your `libsql://…` URL                          |
   | `DATABASE_AUTH_TOKEN` | Your Turso token                               |
   | `ADMIN_USER`          | A username for `/admin`                        |
   | `ADMIN_PASSWORD`      | A long random password                         |
   | `IP_HASH_SALT`        | A long random string (used to hash IPs)        |

4. Deploy. Vercel Analytics activates automatically.

---

## 5. Security & abuse protection

What's in place at the app layer:

| Layer                         | Where                                  | What it does                                                                                  |
| ----------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- |
| Rate limit (contact form)     | `app/actions/contact.ts`               | 3 per hour AND 10 per day per IP. Friendly error if exceeded.                                 |
| Rate limit (page tracker)     | `app/actions/track.ts`                 | 60 views per minute per session — blocks scrapers without affecting humans.                   |
| Honeypot                      | `components/Contact.tsx`               | Hidden `website` field. Bots fill it; the action silently returns a fake success.             |
| Time-to-fill check            | `app/actions/contact.ts`               | Rejects submissions <1.5 s after the form rendered (typical bot behavior).                    |
| Constant-time auth compare    | `proxy.ts`                             | Defeats timing-oracle attacks on `/admin` basic auth.                                         |
| Brute-force slowdown          | `proxy.ts`                             | 250–450 ms jittered delay on every failed `/admin` attempt — caps brute-force at ~3 tries/s.  |
| IP anonymization              | `app/actions/*.ts`                     | Raw IPs are never stored. Only `SHA-256(salt + ip)` truncated to 32 chars.                    |
| Server Action CSRF            | Built into Next 16                     | Server actions validate `Origin === Host` before executing — no extra code needed.            |
| Security headers              | `next.config.ts`                       | HSTS, X-Frame-Options DENY, nosniff, strict Referrer-Policy, narrow Permissions-Policy, CSP.  |
| Admin not indexed             | `proxy.ts`                             | `X-Robots-Tag: noindex, nofollow` on /admin responses.                                        |
| `X-Powered-By` removed        | `next.config.ts`                       | `poweredByHeader: false` — don't advertise the framework.                                     |

### Rate limit storage

Buckets live in the `rate_limit_buckets` table (libSQL). It's not as fast as
Redis but for a portfolio it's free and "good enough". Old buckets are
auto-deleted in a 60s sweep. If traffic ever becomes serious, swap
`lib/rateLimit.ts` for [Upstash Ratelimit](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
without touching the call sites.

### What you still need to do at the network layer

App-layer defenses don't stop **L3/L4 volumetric DDoS** — that has to happen
upstream. Two free options:

1. **Vercel** — its platform includes always-on DDoS mitigation. For
   a portfolio on a hobby plan, you get this automatically. If you see
   suspicious patterns, enable the **Vercel Firewall** challenge mode
   (Settings → Firewall → System bypass = off, enable Attack Challenge).

2. **Cloudflare** (any host) — put your domain behind Cloudflare (free tier).
   You get global DDoS protection, bot fight mode, WAF managed rules,
   rate-limiting rules at the edge, and challenge pages. Recommended even
   on top of Vercel.

### Production secrets checklist

Before going live, set these in your host's env vars and **rotate them**
(don't reuse the dev values):

- `ADMIN_PASSWORD` — long random string (passphrase ≥ 24 chars, or 32+ random
  bytes base64-encoded). The proxy compares this in constant time but a weak
  password defeats that.
- `IP_HASH_SALT` — long random string. If you ever leak the database, this
  prevents reverse-lookup of IPs.
- `DATABASE_AUTH_TOKEN` — generated by `turso db tokens create`. Treat as a
  credential.

Quick generator (PowerShell):

```powershell
# 48-char random secret
-join ((33..126) | Get-Random -Count 48 | ForEach-Object { [char]$_ })
```

### What to monitor

- `/admin` dashboard — message volume, top countries (sudden spikes from
  one country = attack).
- Vercel deployment logs — repeated 401s on `/admin` mean someone is
  trying credentials.
- Vercel Analytics — sudden traffic spike with bouncy sessions = bot wave.

---

## 6. What's left for you

Optional polish you might want next:

- **Email notifications** on new contact messages — add [Resend](https://resend.com)
  and call `resend.emails.send()` at the end of the `submitContact` action.
- **Rate limiting** on the contact form — add [Upstash Ratelimit](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
  keyed by `ipHash` to block flood spam.
- **Resend confirmation email** to the user so they know it was received.
- **Public OG image** for link previews — create `app/opengraph-image.tsx`.
- **Sitemap + robots.txt** — `app/sitemap.ts` and `app/robots.ts`.
- **Self-hosted analytics chart** — the admin page shows totals; you could
  add a daily-bucketed line chart with a small charting lib (e.g. recharts).

---

## 7. Files added by this setup

```
app/
  actions/
    contact.ts            # Server action — handles form submissions
    track.ts              # Server action — records page views
  admin/
    page.tsx              # Protected dashboard
  layout.tsx              # Added <Analytics />
  page.tsx                # Added <PageViewTracker />
components/
  Contact.tsx             # Refactored to use server action + useActionState
  PageViewTracker.tsx     # Client component, fires action on mount
lib/
  db/
    index.ts              # Drizzle + libSQL client
    schema.ts             # Tables
drizzle.config.ts         # Drizzle Kit config
proxy.ts                  # Basic Auth gate for /admin (Next 16 replaces middleware.ts)
.env.example              # Template
.env.local                # Your local secrets (gitignored)
SETUP.md                  # This file
```

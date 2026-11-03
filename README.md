# Karat Racing — website & CMS

The Karat Racing website. It covers one organisation with three separate businesses:

| Division | Route | Scope in this build |
|---|---|---|
| Championship Team | `/championship-team/**` | Fully implemented: programmes, drivers, calendar, events, Race Centre, results, standings, news, media, press, partners, hospitality, careers, enquiry funnels |
| Testing & Karat Academy | `/testing`, `/testing/enquire` | Introductory landing page with a working enquiry form. The data model is reserved for the future fleet/availability work |
| Championship Series (India) | `/championship-organisation`, `/championship-organisation/enquire` | Introductory landing page with a working enquiry form. Kept explicitly separate from Indian F4 |

The visual identity uses the owner-supplied **Karat "K" logo** and the **blue / gold livery** (`scripts/assets/source-*.jpg`), on a dark navy base with a restrained cyan edge accent.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript) with **Tailwind CSS 4** design tokens
- **Payload CMS 3.92** embedded at `/admin`. Postgres via `@payloadcms/db-postgres`, Lexical rich text
- **PostgreSQL 16**
- **Zod** validation shared between client and server
- **Vitest** (unit and integration against real Postgres) and **Playwright** with axe-core for E2E and accessibility

## Quick start

```bash
pnpm install
```

```bash
cp .env.example .env   # then set PAYLOAD_SECRET, DATABASE_URL, SEED_ADMIN_* 
```

```bash
pnpm seed:demo         # base content + clearly-labelled fictional fixtures (dev only)
```

```bash
pnpm dev               # http://localhost:3000  — CMS at http://localhost:3000/admin
```

Use `pnpm seed` (no demo fixtures) for staging and production. To rebuild brand images from the source files, run `node scripts/build-brand-assets.mjs`.

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` / `pnpm build` / `pnpm start` | Next.js development server, production build, production server |
| `pnpm seed` | Production-safe base content: divisions, championships, programmes (status *Intended*), FAQs, source register |
| `pnpm seed:demo` | Adds fictional fixtures (`isDemo=true`, titled "[DEMO]"). Refuses to run when `APP_ENV=production` |
| `pnpm migrate:create` / `pnpm migrate` | Create / apply database migrations (staging and production) |
| `pnpm generate:types` / `pnpm generate:importmap` | Regenerate Payload types and the admin import map |
| `pnpm test:unit` / `pnpm test:int` / `pnpm test:e2e` | Test suites (see TEST-PLAN.md) |
| `pnpm tsx scripts/check-production-content.ts` | Launch gate: fails if any demo fixture exists |
| `pnpm check:links` | Internal broken-link crawl against a running site |

## Documentation

| Document | Contents |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design, routes, data model, caching |
| [REQUIREMENTS.md](REQUIREMENTS.md) | Requirement traceability (ID → status → test) |
| [CONTENT-DEPENDENCIES.md](CONTENT-DEPENDENCIES.md) | What the owner must supply before launch |
| [DATA-SOURCES.md](DATA-SOURCES.md) | Research register of official sources |
| [ASSET-RIGHTS.md](ASSET-RIGHTS.md) | Brand and media assets and their rights status |
| [CMS-EDITOR-GUIDE.md](CMS-EDITOR-GUIDE.md) | How non-technical staff run the site |
| [INTEGRATIONS.md](INTEGRATIONS.md) | Email, analytics, timing and other adapters, including failure behaviour |
| [SECURITY.md](SECURITY.md) / [PRIVACY-IMPLEMENTATION.md](PRIVACY-IMPLEMENTATION.md) | Controls |
| [TEST-PLAN.md](TEST-PLAN.md) | Acceptance-test mapping |
| [DEPLOYMENT.md](DEPLOYMENT.md) / [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) | Environments, backups, rollback, go-live |
| [KNOWN-LIMITATIONS.md](KNOWN-LIMITATIONS.md) | Open items and future scope |

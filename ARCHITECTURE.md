# Architecture

## Overview

```
Browser ──► Next.js 16 (App Router)
             ├─ (frontend) route group  — public site, server components, server actions for forms
             ├─ (payload)  route group  — Payload admin UI (/admin) + REST API (/api)
             ├─ proxy.ts               — editor-managed redirects (cached 60s)
             └─ Payload local API ──► PostgreSQL
                                   └─► local disk (media/, private-uploads/) → S3-compatible in production
Email outbox (notifications collection) ──► email adapter (SMTP | log | none) with retry/backoff
```

The frontend and the CMS run in **one Next.js process**. Public pages read through `src/lib/data.ts`, which calls the Payload local API with `overrideAccess: false` and **no user**. That one choke point makes every public channel use the same access rules: pages, site search, the sitemap, RSS and ICS feeds, and the REST API. Those rules cover embargoes, publication status, rights expiry and approval flags.

## Key directories

| Path | Purpose |
|---|---|
| `src/collections/` | CMS schema: Racing, Results, People, Editorial, Enquiries, Governance, Media, Users |
| `src/globals/` | Site settings (contact routing, legal entity), feature flags, approved team copy |
| `src/access/roles.ts` | Roles: admin, editor, raceData, commercial, media, recruiter. Division scoping and public-read helpers |
| `src/hooks/` | Audit log, slug→redirect, approval-to-publish, minor-consent gate, session time-zone conversion |
| `src/lib/` | Pure domain logic (time zones, events, ICS, results, partners, media rights, season rollover, enquiry schema) plus server services |
| `src/endpoints/` | `/api/health`, `/api/cron/notifications`, `/api/season-rollover`, `/api/results-import/preview` |
| `src/app/(frontend)/` | All public routes (see route map) |
| `src/components/` | Design-system components, forms, gallery, countdown, consent manager |
| `scripts/` | Seed, demo fixtures, brand-asset build, launch gate, link checker |
| `tests/` | unit / int (real Postgres) / e2e (Playwright + axe) |

## Route map

Every route in brief §5.2 is implemented:

- `/`: gateway
- `/championship-team`: about, heritage, people, facilities, programmes, programmes/[programme], programmes/[programme]/[season], drivers, drivers/[driver], alumni, calendar (`feed.ics`), events/[event] (`/ics`), results, standings, race-centre, driver-development, race-with-us, partners, partners/[partner], partner-with-us, hospitality, news (`rss.xml`), news/[article], media, media/[collection], press, careers, careers/[vacancy], faqs, contact
- `/testing`, `/testing/enquire`
- `/championship-organisation`, `/championship-organisation/enquire`
- `/privacy`, `/cookies`, `/terms`, `/accessibility`, `/safeguarding`, `/search`
- `/sitemap.xml`, `/robots.txt`

The optional routes `portal`, `partner-portal` and `shop` are **not** built. They are Future scope, and their feature flags are off.

## Data model (brief §30 → collections)

| Entity | Collection | Notes |
|---|---|---|
| BusinessDivision | `divisions` | status labels, `enabled` kill-switch, routing email |
| Championship | `championships` | aliases (e.g. FRECA) for discovery |
| ChampionshipSeason | `championship-seasons` | documents, machinery (+source, verifiedAt), format, points JSON, classes, eligibility |
| TeamProgramme | `programmes` + `programme-seasons` | status, relationship type (entrant / technical operator / …), pricing controls, seat availability |
| Driver / DriverEngagement | `drivers` / `driver-engagements` | numbers are per season. Embargo `announceAt`. Minor safeguarding |
| Person, Facility | `people`, `facilities` | publication approval. Owned / operated / partner-provided |
| Circuit / Event / Session | `circuits`, `events`, `sessions` | IANA zone. Sessions entered as circuit-local wall-clock time and converted to UTC by a hook |
| ResultSet / StandingSnapshot | `result-sets`, `standings` | provisional / final, verified, source, attribution (karat / kic / other), versions = revision history |
| Article | `articles` | drafts, scheduled publish, approval workflow, corrections |
| MediaAsset | `media`, `media-collections` | credit, rights expiry, download permission. Access withdraws expired items |
| Partner / Partnership | `partners`, `partnerships` | tier, scope, rights period, approval |
| Vacancy / Application | `vacancies`, `applications`, `cv-uploads` | private CV storage |
| Enquiry | `enquiries` | division, category, status workflow, assignment, retention, idempotency key |
| ConsentRecord, SourceRecord, Redirect, FeatureFlag, Audit | `consent-records`, `sources`, `redirects`, global `feature-flags`, `audit-logs` | |

Modelling rules followed: unknown values are `null`, never zero. Time zones are stored explicitly. Personal lead data lives in separate restricted collections. Demo fixtures carry `isDemo`. Racing numbers are not used as identifiers. Results keep their revisions. Attribution is explicit.

## Rendering & caching

Public pages are `force-dynamic` server components. Embargoes are time-based (`announceAt`, `publishedAt`), so a statically cached page could leak or lag them. Pages send very little JavaScript: client components are limited to the header menus, forms, consent manager, countdown, time-zone toggle, gallery and share links.

**Enhancement:** put a CDN in front with a short TTL (60s) and `stale-while-revalidate`. Do not cache `/admin`, `/api` or form POSTs.

## Forms

Forms use server actions (`src/app/(frontend)/actions.ts`), with Next's built-in origin check against CSRF. They are validated server-side with the shared Zod schemas, then persisted. Only after that are notifications queued in the `notifications` outbox. Delivery runs after the response (`after()`) and through `/api/cron/notifications`, with exponential backoff.

## Reserved architecture (future scope)

**Testing & Karat Academy.** The `test-cars` collection (staff-only, admin group "Testing (reserved)") holds ownership and operator, category, generation, specification, base location, circuits, internal availability windows, services and restrictions. It has **no public route**. Publishing availability, prices or bookings needs a new, approved scope plus a payments provider.

**Championship Series (India).** No organiser data model has been created, on purpose. When the project is approved, add these collections: `series` (name, sanctioning body, approval status + evidence), `series-seasons`, `series-regulations` (versioned documents), `series-entries` (teams, drivers), and reuse `events`, `sessions`, `result-sets`, `partners` with a `division` field. Keep the public routes under `/championship-organisation/**`. Its permissions should be scoped through `users.divisions = championship-organisation`, which already exists.

**Portals.** If a driver or partner portal is authorised, use Payload auth on a separate `portal-users` collection with record-level access, MFA, expiring signed file URLs and the existing audit log. Never use a client-side password page.

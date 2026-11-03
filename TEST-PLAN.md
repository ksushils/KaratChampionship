# Test plan

| Layer | Command | Runs against | Count (at handover) |
|---|---|---|---|
| Unit | `pnpm test:unit` | Pure logic (time zones and DST, events, ICS, results, partners, media rights, rollover, schemas, rate limit, analytics sanitising) | 34 passing |
| Integration | `pnpm test:int` | Real PostgreSQL test DB (`TEST_DATABASE_URL`, schema reset per run). Payload local API with real access control | 24 passing |
| End-to-end | `pnpm test:e2e` | Running site seeded with `pnpm seed:demo`. Chromium desktop plus Pixel 7 emulation. Axe-core WCAG 2.2 AA scans | 30 passing (dev and production build) |
| Type safety | `pnpm typecheck` | Whole repo | clean |
| Build | `pnpm build` | Production build | passes |
| Links | `pnpm check:links` | Running site | 0 broken |
| Launch gate | `pnpm tsx scripts/check-production-content.ts` | Target DB | must print OK |

Run the E2E suite against a production build (`pnpm build && pnpm start`) in CI. See `.github/workflows/ci.yml`.

## Acceptance tests (brief §40)

| # | Scenario | Test |
|---|---|---|
| 1 | Gateway → Championship Team | e2e `journeys` #1 |
| 2 | Switch Team → Testing | e2e `journeys` #2 |
| 3 | Programmes show correct status | e2e #3; int "seeded programmes are intended or future" |
| 4 | No unapproved programme shown as confirmed | e2e #3/#4; int "cannot mark Confirmed without source" |
| 5 | Programme CTA carries context | e2e #5 |
| 6 | Persisted before success | int "persists before success…"; e2e #6 |
| 7 | Email failure keeps enquiry | int "survives an email-provider failure" (EMAIL_ADAPTER=fail, then recovery) |
| 8 | Duplicate submissions | int "duplicate submissions…" |
| 9 | Parent/guardian enquiry | e2e #6 #9 (two tests); unit schema; int guardian |
| 10 | Marketing optional | unit; int "marketing opt-in…" |
| 11 | Sponsor enquiry → restricted workflow | int "record-level access by role" |
| 12 | Embargoed driver absent from API, search, sitemap | int "embargoed driver…" (public API and search). Sitemap uses the same public reads |
| 13 | Rollover doesn't confirm | unit + int |
| 14 | Different numbers across seasons | int |
| 15 | Timetable across time zones | unit time; int session hook; e2e #15 |
| 16 | DST transitions | unit (spring gap, autumn ambiguity, 23h day) |
| 17 | Cancelled not next | unit; e2e #17 |
| 18 | Season-complete replaces countdown | unit `isSeasonComplete`. The homepage renders the off-season panel |
| 19 | Simultaneous weekends | unit `currentEvents` / `overlapping` |
| 20 | Provisional → final with audit | int (versions + audit log user) |
| 21 | Missing ≠ zero | unit `display`; int null points; e2e #21 |
| 22 | Expired partner removed | unit; int; e2e #22 |
| 23 | Expired media blocked | unit `canDownload`; int media access |
| 24 | Unauthorised user can't access enquiries/applications | int (anonymous, raceData, recruiter) |
| 25 | Rejecting cookies blocks tracking requests | e2e #25 (network interception) |
| 26 | Keyboard-only navigation, forms, galleries | e2e #26 (skip link, disclosure + Esc). The form flows in e2e #6 use keyboard-operable controls. The gallery uses native `<dialog>` (manual check) |
| 27 | No mobile overflow | e2e `responsive` at 375/390/768 across 14 pages |
| 28 | Search excludes private content | int; e2e #28 |
| 29 | KIC records don't inflate Karat stats | unit `seasonSummary`. Results pages filter `attribution=karat` |
| 30 | Testing / organisation enquiries separated | int divisions; e2e CHAMP-20 hand-off |
| 31 | Unconfigured live feed → fallback, never simulated | Race Centre renders fallback copy when `liveTiming` is empty. No simulated-timing code exists (code review) |
| 32 | Broken media / unavailable services | `ConsentEmbed` link fallback. Notification queue. Error boundary `error.tsx` |
| 33 | Editor publishes article without developer | int editorial workflow (editor → admin approval → editor publishes) |
| 34 | Race-data editor can't access applications | int careers |
| 35 | Production contains no fictional content | int launch gate; `scripts/check-production-content.ts`; `seed:demo` refuses in production |

## Manual checks before launch
- Screen reader pass (VoiceOver and NVDA) on the gateway, race enquiry, results table and gallery
- 200% zoom on desktop. Reduced-motion setting
- Core Web Vitals on staging with a throttled mobile profile (targets: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1)

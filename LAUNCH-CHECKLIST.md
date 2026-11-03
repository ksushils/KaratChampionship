# Launch checklist

## Content & claims
- [ ] Every row in CONTENT-DEPENDENCIES.md is resolved or knowingly deferred
- [ ] Programme statuses reviewed. "Confirmed" only where an entry-confirmation source is attached
- [ ] KIC heritage wording approved (or left hidden)
- [ ] No unsupported claims ("championship-winning", "pathway to F1", facilities that do not exist)
- [ ] Livery imagery captions read "concept"
- [ ] `pnpm tsx scripts/check-production-content.ts` prints **OK** against the production DB (acceptance #35)

## Legal & privacy
- [ ] Privacy, cookie and terms text reviewed by a qualified adviser (UK / EU / India)
- [ ] Legal entity name and address in Site settings
- [ ] Retention periods confirmed. Purge procedure scheduled
- [ ] Safeguarding lead named. Safeguarding route tested end to end

## Operations
- [ ] SMTP configured. Each routing address receives a real test enquiry (race, partnership, hospitality, media, careers, testing, organisation, safeguarding, general)
- [ ] Cron for `/api/cron/notifications` running. No `failed` notifications
- [ ] MFA in front of `/admin` (SECURITY.md)
- [ ] Admin accounts created per person with least-privilege roles. Seed admin password rotated
- [ ] CV malware scanning integrated, or the `cvUpload` flag turned off
- [ ] Rate limiter backed by a shared store if running more than one instance
- [ ] Backups running. A restore test has been done
- [ ] Error tracking and uptime monitoring enabled

## Quality
- [ ] CI green: typecheck, unit, int, build, e2e (incl. axe), link check
- [ ] Manual screen-reader pass and 200% zoom pass
- [ ] Core Web Vitals measured on staging
- [ ] `APP_ENV=production` is set **only** on production. robots and sitemap verified
- [ ] Redirect map (old URLs) loaded if domain migration rights exist
- [ ] Analytics: consent rejection verified on production network traces

## Rollback readiness
- [ ] Previous image tag recorded. Pre-launch DB snapshot taken

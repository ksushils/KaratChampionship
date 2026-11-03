# Deployment

## Environments

| Env | `APP_ENV` | DB schema | Indexing | Seed |
|---|---|---|---|---|
| development | `development` | `PAYLOAD_DB_PUSH=true` | noindex | `pnpm seed:demo` |
| staging | `staging` | migrations (`pnpm migrate`) | noindex (robots `Disallow: /` + meta) | `pnpm seed` (+ demo only on a separate preview DB) |
| production | `production` | migrations | indexable + sitemap | `pnpm seed` once, then CMS |

Each environment needs its own database, its own `PAYLOAD_SECRET` and its own storage bucket.

## Required environment variables
See `.env.example`. For production, at minimum: `DATABASE_URL`, `PAYLOAD_SECRET` (32+ random bytes), `NEXT_PUBLIC_SERVER_URL`, `APP_ENV=production`, `PAYLOAD_DB_PUSH=false`, `SMTP_*`, `EMAIL_FROM`, `EMAIL_FROM_ADDRESS`, `CRON_SECRET`, and optionally `NEXT_PUBLIC_ANALYTICS_*`.

## Options

**A. Container (recommended).** Build the provided `Dockerfile` (Next standalone output) and run it behind a TLS-terminating proxy. Release steps:
1. `pnpm migrate` (one-off job, same image and env)
2. Roll out the new containers
3. Check `GET /api/health` returns `{"status":"ok"}`

**B. Vercel or similar.** Uses managed Postgres (Neon, RDS, Supabase). Replace local disk storage with `@payloadcms/storage-s3` or Vercel Blob, because a serverless filesystem is ephemeral. Set `PAYLOAD_JOBS_AUTORUN=false` and call the cron endpoint from a platform cron.

## Scheduled jobs
- `POST /api/cron/notifications` every 5 min with `Authorization: Bearer $CRON_SECRET` (email outbox)
- Scheduled publishing. Payload's `schedulePublish` needs the jobs runner: set `PAYLOAD_JOBS_AUTORUN=true` on a long-running server, or call `/api/payload-jobs/run` from cron. Embargoes using `announceAt` / `publishedAt` work **without** jobs, because access control evaluates them on every request.

## Media storage
Development keeps uploads on local disk (`media/`, `private-uploads/`). In production, mount persistent volumes or switch to S3: install `@payloadcms/storage-s3` and configure it in `payload.config.ts` with **separate private bucket access for `cv-uploads`**.

## Backups & restore
- Daily: `pg_dump --format=custom "$DATABASE_URL" > karat-$(date +%F).dump`, kept for 30 days in encrypted storage in a separate account or region
- Media: bucket versioning plus a lifecycle rule (30 days)
- Restore: `pg_restore --clean --if-exists -d "$DATABASE_URL" karat-YYYY-MM-DD.dump`, then restore the media bucket to the same timestamp
- Test a restore into staging every quarter and record the result in LAUNCH-CHECKLIST

## Rollback
1. Redeploy the previous image tag. The application is stateless.
2. If the release included a migration, run `pnpm payload migrate:down` **only** if the down migration is non-destructive. Otherwise restore the pre-release database snapshot. **Always take a snapshot before `pnpm migrate`.**
3. Content mistakes: restore the earlier version from the document's **Versions** tab in the CMS.

## Health & monitoring
- `/api/health` checks the database connection (503 on failure). Use it for uptime monitoring.
- Add error tracking (e.g. Sentry for Next.js) and structured logs from the platform.
- Alerts: notifications with `status=failed`, health failures, a 5xx rate above 1%.

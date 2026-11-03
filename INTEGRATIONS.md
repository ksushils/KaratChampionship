# Integrations

Every integration sits behind an adapter, so the site keeps working when one is missing or down. **No live-timing, CRM or newsletter provider has been connected.** Nothing pretends to be connected.

| Integration | Purpose | Configuration | Credentials | Data transferred | Privacy | Failure behaviour | Retry | Manual fallback | Monitoring | Owner |
|---|---|---|---|---|---|---|---|---|---|---|
| **Email (notifications)** `src/lib/email` | Team alerts and enquirer acknowledgements | `EMAIL_ADAPTER` = smtp / log / none / fail, plus `SMTP_*`, `EMAIL_FROM` | SMTP user and password | Recipient address, subject, body. Team alerts contain only reference, category and CMS link, **not** the personal data | Acknowledgement goes to the enquirer's own address | The enquiry is always saved first. Notifications stay `pending` with `lastError` | Exponential backoff 1, 2, 4 … min (max 6h), 8 attempts, then `failed`. Unconfigured adapter retries indefinitely | Leads → Notifications shows pending/failed. Staff can work enquiries straight from the CMS | Alert on notifications `failed` > 0 or `pending` older than 1h | Ops |
| **Email (CMS system)** `@payloadcms/email-nodemailer` | Password resets | `SMTP_*`, `EMAIL_FROM_ADDRESS` | SMTP | Staff email | — | Without it, Payload logs emails to the console (development only) | — | An admin resets the password | — | Ops |
| **Cron** `/api/cron/notifications` | Drains the outbox | `CRON_SECRET`. Schedule a POST every 5 min with `Authorization: Bearer $CRON_SECRET` | Shared secret | None | — | Returns 401 without the secret | Next run | Trigger from an admin session | Monitor job HTTP status | Ops |
| **Analytics** `components/analytics.ts` | Conversion measurement (section 37) | `NEXT_PUBLIC_ANALYTICS_SRC`, `NEXT_PUBLIC_ANALYTICS_DOMAIN` (Plausible-compatible `window.plausible`) | None | Event name plus non-PII properties (programme, category, step, path) | Loaded only after consent. PII keys stripped by `sanitizeProps` | If unconfigured, nothing loads and `track()` does nothing | — | — | Provider dashboard | Marketing |
| **CRM** | Lead sync | Not configured | — | — | Requires a DPA | Enquiries live in the CMS | — | Export from Leads | — | Commercial |
| **Newsletter** | Marketing list | Not configured (`feature-flags.newsletter` off) | — | Opt-in flag stored on each enquiry | Separate from enquiry processing | No subscribe UI shown | — | Export opted-in contacts manually | — | Marketing |
| **Search** | Site search | Built in: Postgres `LIKE` through public access rules | — | — | Public content only | — | — | — | — | Dev |
| **Media storage** | Uploads | `MEDIA_DIR`, `PRIVATE_UPLOAD_DIR` (local disk). In production use the Payload S3 storage adapter (`@payloadcms/storage-s3`) with a private bucket for CVs | Bucket keys | Files | CVs private, served only to recruiters through Payload access control | Upload error shown to the editor | — | — | Bucket metrics | Ops |
| **Calendar** | ICS downloads and feed | Built in (`lib/ics.ts`) | — | Public event data | — | — | — | — | — | Dev |
| **Timing / results** | Official live timing, results | **Links only** (`event.officialLinks`). Results are entered manually or imported from CSV with a validated preview | — | — | — | No link means a fallback message. **Simulated timing is never shown** | — | Manual entry | — | Race-data editor |
| **Consent** | Cookie choices | Built in (`ConsentManager`). Choices are also written to `consent-records` with an anonymous ID | — | Purpose, choice, policy version | No identifiers | — | — | — | — | DPO |
| **Malware scanning (CVs)** | JOB-05 | `MALWARE_SCANNER_URL` (not integrated). Uploads are recorded as `scanner-unavailable` | Scanner API | CV file | — | Type and size validation still applies (magic bytes, 5 MB) | — | Recruiters open CVs in a sandboxed viewer | — | Ops |
| **Rate limiting** | LEAD-15 | In-memory per instance | — | IP (not stored) | — | — | — | — | — | Dev. **Use Redis or Upstash for multi-instance deployments** |

Imported files and feeds are treated as **untrusted data**. CSV values are parsed as plain strings or numbers and validated. Nothing in them is ever run as code.

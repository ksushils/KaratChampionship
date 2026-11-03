# Security

| Control | Implementation |
|---|---|
| HTTPS / HSTS | HSTS header in production (`next.config.ts`). Terminate TLS at the platform |
| Security headers | CSP, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy. `X-Robots-Tag: noindex` on `/admin` and `/api` |
| Secure cookies | Payload auth cookies: `Secure` in production, `SameSite=Lax`, 8h token expiry, lockout after 5 failed logins for 15 min |
| Server-side authorisation | Payload access functions on every collection, including **record-level** rules for enquiries by role and division (`collections/Enquiries.ts`). Public reads use `overrideAccess:false` |
| Least privilege | Six roles (see CMS-EDITOR-GUIDE). Only admins can change roles and divisions (field-level access). Covered by integration tests (#24, #34) |
| CSRF | Server actions use Next.js origin checks. Payload `csrf` and `cors` are restricted to `NEXT_PUBLIC_SERVER_URL` |
| Rate limiting & abuse | Per-IP limits on enquiries, applications and consent. Honeypot field. Time-trap. Idempotency keys |
| Input validation / output escaping | Zod on the server for every form. React escapes output. JSON-LD is serialised with `<` escaped. Rich text is rendered from Lexical JSON, never raw HTML |
| Uploads | Media: MIME allow-list, 10 MB limit. CVs: PDF/DOCX only, verified by magic bytes, 5 MB, stored outside `public/` in `private-uploads`, readable only by recruiters |
| Malware scanning | **Not integrated.** The adapter point is documented (INTEGRATIONS.md). Required before launch if CV upload stays enabled |
| Private storage / signed links | Production: an S3 private bucket for `cv-uploads`, served through Payload's authenticated file route |
| Secrets | `.env` is git-ignored. Only `NEXT_PUBLIC_*` values reach the browser (analytics host and domain, site URL) |
| Audit logs | `audit-logs` records create, update and delete on every collection, with the user. Admin-read only, immutable through the API |
| Dependency scanning | Run `pnpm audit` in CI and enable Dependabot or Renovate |
| Backups | See DEPLOYMENT.md: daily `pg_dump`, 30-day retention, encrypted at rest, quarterly restore test |
| Privileged-account MFA | **Payload local auth has no MFA.** Before launch, put `/admin` behind an identity-aware proxy with MFA (e.g. Cloudflare Access or Google IAP), or add an SSO/OIDC strategy |
| Secret rotation | Rotate `PAYLOAD_SECRET` (this invalidates sessions), SMTP and `CRON_SECRET` every 90 days, and immediately when a staff member leaves |

Report vulnerabilities to the site administrator (contact to be added in Site settings).

# Privacy implementation

Technical controls are below. **Jurisdiction-specific wording (UK GDPR, EU GDPR, India DPDP Act 2023) needs review by a qualified adviser.** The draft policies in this build do not on their own make the organisation compliant.

| Principle | Implementation |
|---|---|
| Data minimisation | Enquiries ask for an **age band**, not a date of birth. No identity documents, medical data or licence scans (LEAD-12). Phone is optional |
| Purpose separation | `marketingOptIn` is a separate, optional checkbox. The enquiry is processed whatever the choice (acceptance #10) |
| Versioned notices | `site-settings.privacyNoticeVersion` is stored on every enquiry and consent record |
| Retention | `retentionUntil` is set on creation: enquiries 24 months, applications 6 months (confirm with the adviser). Enhancement: a scheduled purge job. Until then, use a monthly admin review on the `retentionUntil` filter |
| Access / correction / deletion | Admins can find a record by reference or email (list search), then edit or delete it. Deletions are audit-logged |
| International transfers | To review once hosting, SMTP and CRM providers are chosen |
| No PII in analytics | `sanitizeProps` drops PII keys and email- or phone-like strings. Unit-tested |
| No lead data in caches or URLs | Enquiries go via POST (server action). References are random. Team email alerts contain links, not personal data. `/api/enquiries` denies public reads |
| Cookies | Essential only by default. Analytics and embeds load **after** consent (acceptance #25, tested on the network). Withdraw via "Cookie settings" in the footer |
| Minors | Guardian involvement is enforced in validation. `involvesMinor` flag. Safeguarding enquiries are admin-only. Driver profiles of minors cannot be published without consent records |
| Applicant privacy | Recruiters only. CVs in private storage. Never in search, sitemap or public API |

# Known limitations & scope status

## Implemented and tested
Gateway, all Championship Team routes, Testing and Championship Series landing pages with enquiries, CMS schema with roles, approval workflow, embargoes, revisions, audit log, redirects, consent management, ICS/RSS feeds, sitemap/robots and the enquiry pipeline with retrying notifications. See REQUIREMENTS.md.

## Implemented, awaiting content
Driver line-ups, calendars, results, partners, people, facilities, heritage, galleries, approved team copy. The pages show honest empty states until the content exists.

## Awaiting credentials
- SMTP (enquiries are stored and queued. Delivery starts once configured)
- Analytics provider
- S3 / object storage for production uploads
- Malware-scanning service for CV uploads

## Feature-flagged (off by default)
Newsletter, live text updates, WhatsApp, speculative applications. Hospitality enquiries, viewer-local time, calendar feed, RSS and CV upload are **on**.

## Future scope (not built)
- Driver portal, partner portal, merchandise shop. Their routes do not exist, and nothing in the UI suggests they do.
- Testing division inventory (cars, availability, prices, booking, payments). Championship organiser platform (entries, regulations, governance).
- Live-timing or results feed integration. Links only by design. No simulated timing.
- Automated points calculation (`pointsSystem` JSON is stored for future use. Official standings take precedence).
- Translations (structure is translation-ready, English only).

## Technical caveats
- **MFA:** Payload local auth has none. Put `/admin` behind MFA before launch.
- **Rate limiting** is in-memory per instance.
- **Search** uses Postgres `LIKE`. That is fine at the expected scale. Add full-text indexes if content grows large.
- **Retention purge** is a manual review today (`retentionUntil` is stored). A scheduled purge job is an enhancement.
- **Live preview** in the CMS is not configured. Drafts can be previewed by signed-in staff, because staff access lets them read drafts. A preview route with draft mode is an enhancement.
- **Indian F4 facts:** 2026 machinery could not be confirmed from a primary source (DATA-SOURCES.md), so it is intentionally unpublished.
- **TopJet F2000** official URL is unverified and not linked.
- **Logo:** derived from the supplied raster image with a luminance mask. A vector master from the owner would improve sharpness.

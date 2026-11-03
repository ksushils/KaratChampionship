# Requirements traceability

Status key: **IT** implemented and tested · **IM** implemented, verified manually or visually · **IA** implemented, awaiting content · **AC** awaiting credentials · **FF** feature-flagged · **FS** future scope.

Abbreviations: `U` = tests/unit, `I` = tests/int/platform.int.test.ts, `J` = tests/e2e/journeys.spec.ts, `P` = tests/e2e/privacy-a11y.spec.ts, `RS` = tests/e2e/responsive.spec.ts.

| requirementId | module | priority | implementationStatus | testReference | dependency | contentDependency | notes |
|---|---|---|---|---|---|---|---|
| GW-01 | Gateway | Launch | IT | J #1 | — | Approved proposition copy | src/app/(frontend)/page.tsx |
| GW-02 | Gateway | Launch | IT | J #1 | divisions | Division imagery | Three pathway panels |
| GW-03 | Gateway | Launch | IT | J #1 | divisions.status | — | Planned / Enquiries open / Launching soon / Operational |
| GW-04 | Gateway | Launch | IT | J #2 | SiteHeader | — | Business switcher on every page |
| GW-05 | Gateway | Launch | IT | P #26, axe | — | — | Panels are links; no hover dependence |
| GW-06 | Gateway | Launch | IT | J #5 | — | — | Every division/programme has a stable deep link; UTM captured in enquiries |
| GW-07 | Gateway | Launch | IT | I divisions | enquiry-schema CATEGORY_DIVISION | Routing emails | Division stored on every enquiry |
| GW-08 | Gateway | Launch | IM | visual | — | — | No video at launch; static optimised images via next/image |
| GW-09 | Gateway | Launch | IT | I kill-switch | divisions collection | — | Independent copy/status per division |
| GW-10 | Gateway | Launch | IT | J #3 | — | — | Explicit separation notices on gateway, Indian F4 page, organisation page, FAQ |
| HOME-01 | Team homepage | Launch | IM | visual | — | Approved hero copy | Livery concept imagery |
| HOME-02 | Team homepage | Launch | IT | J #6 | — | — | "Discuss your race programme" primary CTA |
| HOME-03 | Team homepage | Launch | IT | J #3 | programmes | Entry confirmations | Status badges |
| HOME-04 | Team homepage | Launch | IT | J #17 | lib/events.nextEvent | Calendar | Countdown to confirmed session |
| HOME-05 | Team homepage | Launch | IT | U/events.test.ts | lib/events | — | upcoming / race-weekend / completed / postponed / cancelled / season-complete |
| HOME-06 | Team homepage | Launch | IT | I unverified results | result-sets access | Verified results | Hidden when none |
| HOME-07 | Team homepage | Launch | IA | visual | driver-engagements | Driver announcements | Hidden when empty |
| HOME-08 | Team homepage | Launch | IA | visual | articles | News | Hidden when empty |
| HOME-09 | Team homepage | Launch | IA | visual | team-content.workingMethods | Approved proposition | Seeded neutral copy |
| HOME-10 | Team homepage | Launch | IT | J #22 | partnerships | Partner rights | Hierarchy-ordered |
| HOME-11 | Team homepage | Launch | IA | — | team-content.acquisitionApproved | KIC wording approval | Hidden until approved |
| HOME-12 | Team homepage | Launch | IM | visual | — | — | Partner CTA |
| HOME-13 | Team homepage | Enhancement | FF | — | feature-flags.newsletter | Newsletter provider | Opt-in captured on enquiries; standalone subscribe flow not built |
| HOME-14 | Team homepage | Launch | IT | J #17 | — | — | Conditional modules |
| TEAM-01 | Team, heritage & people | Launch | IA | visual | team-content.story | Approved story | Neutral fallback |
| TEAM-02 | Team, heritage & people | Launch | IT | I (hook) / visual | heritage-milestones | Milestones + evidence | Source required before approval |
| TEAM-03 | Team, heritage & people | Launch | IA | — | team-content.acquisitionApproved | Owner approval |  |
| TEAM-04 | Team, heritage & people | Launch | IM | visual | heritage-milestones.entity | — | Entity badge on every milestone |
| TEAM-05 | Team, heritage & people | Launch | IT | U/misc.test.ts seasonSummary | result-sets.attribution | — | KIC never aggregated |
| TEAM-06 | Team, heritage & people | Launch | IA | visual | people | Profiles | Approval flag |
| TEAM-07 | Team, heritage & people | Launch | IA | visual | people.department | Profiles |  |
| TEAM-08 | Team, heritage & people | Launch | IA | visual | facilities | Facility facts |  |
| TEAM-09 | Team, heritage & people | Launch | IM | visual | facilities.ownership | — | Partner-provided badge |
| TEAM-10 | Team, heritage & people | Launch | IA | visual | team-content.workingMethods | Approved copy |  |
| TEAM-11 | Team, heritage & people | Launch | IA | — | team-content.values | Approved values | Hidden until approved |
| TEAM-12 | Team, heritage & people | Enhancement | FS | — | — | Accreditations |  |
| TEAM-13 | Team, heritage & people | Enhancement | IA | — | team-content.teamProfilePdf | Approved PDF | Press page |
| PROG-01 | Programmes | Launch | IT | J #3 | programmes | — | Italian F4, GB4, Indian F4, Formula X / F2000; F3/F2 as Future |
| PROG-02 | Programmes | Launch | IT | I programmes | PROGRAMME_STATUS | Confirmations | + "Future ambition" |
| PROG-03 | Programmes | Launch | IM | visual | programmes.comparison | — |  |
| PROG-04 | Programmes | Launch | IT | I confirmed needs source | validators | — | Pricing/eligibility blank unless supplied |
| PROG-05 | Programmes | Enhancement | IT | — | CMS | — | New programmes need no code |
| PROG-06 | Programmes | Launch | IM | — | status=archived | — | Archive section |
| PROG-07 | Programmes | Launch | IA | visual | programmes.driverFit | Eligibility |  |
| PROG-08 | Programmes | Launch | IT | J #5 | ?programme= | — |  |
| PROG-09 | Programmes | Launch | IT | visual | officialLinks | — | From DATA-SOURCES.md |
| PROG-10 | Programmes | Launch | IT | RS #27 | — | — | Stacked cards < lg |
| CHAMP-01 | Championship programme pages | Launch | IM | visual | ProgrammeView | Overview copy |  |
| CHAMP-02 | Championship programme pages | Launch | IT | J #3 | — | — | Status badge under H1 |
| CHAMP-03 | Championship programme pages | Launch | IT | visual + route /[programme]/[season] | programme-seasons | — |  |
| CHAMP-04 | Championship programme pages | Launch | IA | — | championships.explainer | Explainer copy |  |
| CHAMP-05 | Championship programme pages | Launch | IT | visual (GB4 chassis) | championship-seasons.machinery | Verified specs | Italian F4 / Indian F4 left blank (unverified) |
| CHAMP-06 | Championship programme pages | Launch | IT | visual | season-labelled spec card | — | Shows spec year if different |
| CHAMP-07 | Championship programme pages | Launch | IM | visual | championship-seasons.format | — |  |
| CHAMP-08 | Championship programme pages | Launch | IT | J #17 | events | Calendars |  |
| CHAMP-09 | Championship programme pages | Launch | IT | I engagements | driver-engagements | Announcements |  |
| CHAMP-10 | Championship programme pages | Launch | IA | — | programmes.teamSupport | Approved support |  |
| CHAMP-11 | Championship programme pages | Launch | IA | — | inclusions/exclusions | Approved inclusions |  |
| CHAMP-12 | Championship programme pages | Launch | IM | visual | seatAvailability | — |  |
| CHAMP-13 | Championship programme pages | Launch | IT | validator | pricing group | — | Default: discuss |
| CHAMP-14 | Championship programme pages | Launch | IA | — | eligibility group | Verified eligibility | Fallback text points to regulations |
| CHAMP-15 | Championship programme pages | Launch | IT | visual | documents | — | Italian F4 2026 regs, GB4 format |
| CHAMP-16 | Championship programme pages | Launch | IM | visual | articles.programmes | — |  |
| CHAMP-17 | Championship programme pages | Launch | IT | visual | result-sets.programme | — |  |
| CHAMP-18 | Championship programme pages | Launch | IM | visual | media-collections.programme | — |  |
| CHAMP-19 | Championship programme pages | Launch | IT | visual | faqs.programmes | — | Falls back to programme FAQs |
| CHAMP-20 | Championship programme pages | Launch | IT | J CHAMP-20 | /testing/enquire?programme= | — |  |
| CHAMP-21 | Championship programme pages | Enhancement | IA | — | programmes.brochure | Brochure |  |
| CHAMP-22 | Championship programme pages | Enhancement | FS | — | — | — |  |
| SAFE-IF4 | Championship safeguards | Launch | IT | seed + data model | championship-seasons.format/points JSON | — | Groups/finals/points by season; not hard-coded |
| SAFE-GB4 | Championship safeguards | Launch | IT | seed | separate championship | — | Distinct from British F4/GB3; 2026 race duration |
| SAFE-INF4 | Championship safeguards | Launch | IT | visual notice | programmes.relationshipType | Confirmed model | Relationship configurable; machinery unpublished |
| SAFE-FREC | Championship safeguards | Launch | IT | seed aliases | championships.aliases | — | FRECA as alias only; no entry implied |
| DRV-01 | Drivers | Launch | IT | visual | drivers | — |  |
| DRV-02 | Drivers | Launch | IT | visual | GET filters | — |  |
| DRV-03 | Drivers | Launch | IT | visual | — | Portraits |  |
| DRV-04 | Drivers | Launch | IT | I #14 | driver-engagements | — |  |
| DRV-05 | Drivers | Launch | IM | visual | careerTimeline | — |  |
| DRV-06 | Drivers | Launch | IM | visual | stats w/ scope+source | — |  |
| DRV-07 | Drivers | Launch | IM | visual | entries.driver | — |  |
| DRV-08 | Drivers | Launch | IM | visual | articles.drivers | — |  |
| DRV-09 | Drivers | Launch | IM | visual | media-collections.drivers | — |  |
| DRV-10 | Drivers | Launch | IM | visual | socialLinks | — |  |
| DRV-11 | Drivers | Enhancement | IM | visual | driverPartners | — | Separate from team partners |
| DRV-12 | Drivers | Enhancement | FS | — | — | — |  |
| DRV-13 | Drivers | Launch | IT | I embargo | announceAt + access | — | Absent from pages, search, sitemap, API |
| DRV-14 | Drivers | Enhancement | IM | /alumni | drivers.alumni | — | Karat vs KIC separated |
| DRV-15 | Drivers | Launch | IM | schema | — | — | No address/DOB fields exist |
| DRV-16 | Drivers | Launch | IT | I minor consent | requireMinorConsent | Consent records |  |
| CAL-01 | Calendar & events | Launch | IT | visual | events | Calendar |  |
| CAL-02 | Calendar & events | Launch | IT | visual | GET filters | — | programme/season/country/circuit/type |
| CAL-03 | Calendar & events | Launch | IT | RS #27 | month+list | — | Month grid → list on mobile |
| CAL-04 | Calendar & events | Launch | IM | — | events.type | — |  |
| CAL-05 | Calendar & events | Launch | IM | notice | — | — | Testing inventory not in team calendar |
| CAL-06 | Calendar & events | Launch | IT | U/time.test.ts, I | sessions hook | — |  |
| CAL-07 | Calendar & events | Enhancement | IT | J #15 | TimeModeProvider | — | Flag viewerLocalTime |
| CAL-08 | Calendar & events | Launch | IT | J #15 | sessions.certainty | — |  |
| CAL-09 | Calendar & events | Launch | IM | visual | status + changeNote | — |  |
| CAL-10 | Calendar & events | Launch | IT | J CAL-10, U | lib/ics | — |  |
| CAL-11 | Calendar & events | Enhancement | IT | route feed.ics | flag calendarFeed | — | Stable UIDs |
| CAL-12 | Calendar & events | Launch | IT | U, J #17 | nextEvent | — |  |
| CAL-13 | Calendar & events | Launch | IT | U overlapping | — | — |  |
| CAL-14 | Calendar & events | Launch | IT | U season complete | — | — |  |
| EVENT-01 | Calendar & events | Launch | IT | visual | — | — |  |
| EVENT-02 | Calendar & events | Launch | IT | J #15 | sessions | — |  |
| EVENT-03 | Calendar & events | Launch | IM | visual | circuits | Circuit info |  |
| EVENT-04 | Calendar & events | Launch | IA | — | layouts.diagram | Licensed diagrams |  |
| EVENT-05 | Calendar & events | Launch | IM | visual | driversEntered | — |  |
| EVENT-06 | Calendar & events | Launch | IM | visual | preview | — |  |
| EVENT-07 | Calendar & events | Launch | IT | visual | result-sets.session | — |  |
| EVENT-08 | Calendar & events | Launch | IM | visual | report | — |  |
| EVENT-09 | Calendar & events | Launch | IM | visual | gallery | — |  |
| EVENT-10 | Calendar & events | Launch | IM | visual | officialLinks | — |  |
| EVENT-11 | Calendar & events | Enhancement | FF | visual | hospitality?event= | — | Flag hospitalityEnquiries |
| EVENT-12 | Calendar & events | Enhancement | IM | visual | officialLinks.tickets | — | Organiser controls admission |
| EVENT-13 | Calendar & events | Launch | IM | visual | revisedAt/updatedAt | — |  |
| EVENT-14 | Calendar & events | Launch | IM | — | — | — | Completed events stay published |
| RACE-01 | Race Centre | Launch | IT | visual | — | — |  |
| RACE-02 | Race Centre | Launch | IT | U currentEvents | — | — |  |
| RACE-03 | Race Centre | Launch | IT | U raceCentreState | — | — |  |
| RACE-04 | Race Centre | Launch | IT | U countdown | — | — | Clamped ≥ 0 |
| RACE-05 | Race Centre | Launch | IM | visual | officialLinks.liveTiming | Official links | Fallback text if missing |
| RACE-06 | Race Centre | Launch | IM | visual | ConsentEmbed | Authorised streams |  |
| RACE-07 | Race Centre | Launch | IT | P #25 (analytics) / ConsentEmbed | — | — |  |
| RACE-08 | Race Centre | Enhancement | FF | — | live-updates + flag liveText | — | Timestamped manual updates |
| RACE-09 | Race Centre | Enhancement | FS | — | — | Documented feed | No feed integrated |
| RACE-10 | Race Centre | Launch | IM | visual | "Manual update" label | — |  |
| RACE-11 | Race Centre | Launch | IM | visual | — | — | Fallback copy |
| RACE-12 | Race Centre | Launch | IT | code review | — | — | No timing animation exists |
| RACE-13 | Race Centre | Enhancement | IM | — | sessions.replayUrl | — |  |
| RES-01 | Results & standings | Launch | IT | visual | GET filters | — |  |
| RES-02 | Results & standings | Launch | IT | J #21 | entries | — |  |
| RES-03 | Results & standings | Launch | IT | J #21 | RESULT_STATUSES | — |  |
| RES-04 | Results & standings | Launch | IM | — | classification text | — |  |
| RES-05 | Results & standings | Launch | IT | I provisional→final | state | — |  |
| RES-06 | Results & standings | Launch | IM | visual | penaltyNotes | — |  |
| RES-07 | Results & standings | Launch | IT | I | source group validator | — |  |
| RES-08 | Results & standings | Launch | IT | visual | isKarat | — |  |
| RES-09 | Results & standings | Launch | IM | visual | standings | — |  |
| RES-10 | Results & standings | Enhancement | FS | — | pointsSystem JSON | — | Calculated standings labelled |
| RES-11 | Results & standings | Launch | IM | visual | calculated flag | — |  |
| RES-12 | Results & standings | Launch | IT | U parseResultCsv | /api/results-import/preview | — |  |
| RES-13 | Results & standings | Launch | IT | U, I | validateResultEntries | — |  |
| RES-14 | Results & standings | Launch | IT | I | versions + audit-logs | — |  |
| RES-15 | Results & standings | Launch | IT | J #21 | Val component | — |  |
| RES-16 | Results & standings | Enhancement | FS | — | — | Rights |  |
| RES-17 | Results & standings | Enhancement | IT | U seasonSummary | — | — |  |
| RES-18 | Results & standings | Launch | IT | U seasonSummary | attribution | — |  |
| DEV-01 | Driver development | Launch | IM | visual | driver-development page | — |  |
| DEV-02 | Driver development | Launch | IM | visual | driver-development page | — |  |
| DEV-03 | Driver development | Launch | IM | visual | driver-development page | — |  |
| DEV-04 | Driver development | Launch | IM | visual | driver-development page | — |  |
| DEV-05 | Driver development | Launch | IM | visual | driver-development page | — |  |
| DEV-06 | Driver development | Launch | IM | visual | driver-development page | Approved statements |  |
| DEV-07 | Driver development | Launch | IM | visual | driver-development page | Approved statements |  |
| DEV-08 | Driver development | Launch | IM | visual | driver-development page | Approved statements |  |
| DEV-09 | Driver development | Launch | IM | visual | driver-development page | — |  |
| DEV-10 | Driver development | Launch | IM | visual | driver-development page | — |  |
| DEV-11 | Driver development | Launch | IM | visual | driver-development page | — |  |
| DEV-12 | Driver development | Launch | IM | visual | driver-development page | — |  |
| LEAD-01 | Race With Us | Launch | IT | J #6 | — | — |  |
| LEAD-02 | Race With Us | Launch | IT | J #6 | EnquiryForm steps | — |  |
| LEAD-03 | Race With Us | Launch | IT | J #5 | — | — |  |
| LEAD-04 | Race With Us | Launch | IT | code | computed seasons | — |  |
| LEAD-05 | Race With Us | Launch | IT | J #6 | — | — |  |
| LEAD-06 | Race With Us | Launch | IM | — | experience | — |  |
| LEAD-07 | Race With Us | Launch | IT | J #6 | — | — |  |
| LEAD-08 | Race With Us | Launch | IT | U | ageBand | — |  |
| LEAD-09 | Race With Us | Launch | IT | U, J #9, I | superRefine | — |  |
| LEAD-10 | Race With Us | Launch | IM | — | budget optional | — |  |
| LEAD-11 | Race With Us | Enhancement | IM | — | profileLink (CV upload on careers only) | — |  |
| LEAD-12 | Race With Us | Launch | IT | schema | — | — | No document fields |
| LEAD-13 | Race With Us | Launch | IT | I | sourcePage/campaign | — |  |
| LEAD-14 | Race With Us | Launch | IT | U, I | zod server-side | — |  |
| LEAD-15 | Race With Us | Launch | IT | U rate limit, honeypot | — | — | + time-trap |
| LEAD-16 | Race With Us | Launch | IT | I #6 | submitEnquiry | — |  |
| LEAD-17 | Race With Us | Launch | AC | I | notifications outbox | SMTP credentials, routing emails |  |
| LEAD-18 | Race With Us | Launch | IT | I #7 | backoff + cron | — |  |
| LEAD-19 | Race With Us | Launch | IT | schema | enquiries.status | — |  |
| LEAD-20 | Race With Us | Launch | IT | I #10 | marketingOptIn | — |  |
| LEAD-21 | Race With Us | Launch | IT | code | responseTimeStatement blank by default | — |  |
| LEAD-22 | Race With Us | Launch | IT | J #6 | reference | — |  |
| SPON-01 | Partners & sponsorship | Launch | IT | J #22 | — | Partners |  |
| SPON-02 | Partners & sponsorship | Launch | IT | U sortByHierarchy | — | — |  |
| SPON-03 | Partners & sponsorship | Launch | IM | visual | — | — |  |
| SPON-04 | Partners & sponsorship | Launch | IM | — | scope/programme/driver | — |  |
| SPON-05 | Partners & sponsorship | Launch | IT | I #22 | start/end dates | — |  |
| SPON-06 | Partners & sponsorship | Launch | IT | J #22 | past partners | — |  |
| SPON-07 | Partners & sponsorship | Launch | IM | visual | — | — |  |
| SPON-08 | Partners & sponsorship | Launch | IM | visual | livery positions 1–9 | — | From supplied placement diagram |
| SPON-09 | Partners & sponsorship | Launch | IM | visual | — | — |  |
| SPON-10 | Partners & sponsorship | Launch | IT | schema requires source | audienceMetrics | Karat figures |  |
| SPON-11 | Partners & sponsorship | Launch | IT | policy | — | — | No competitor figures used |
| SPON-12 | Partners & sponsorship | Enhancement | FS | — | — | Case studies |  |
| SPON-13 | Partners & sponsorship | Launch | IT | I partnership | PartnershipEnquiryForm | — |  |
| SPON-14 | Partners & sponsorship | Enhancement | IA | — | commercialDeck | Deck |  |
| SPON-15 | Partners & sponsorship | Enhancement | IA | — | commercialDeckVersion | — | Per-prospect tracking not built |
| SPON-16 | Partners & sponsorship | Launch | IT | access | partners.publicationApproved | — |  |
| SPON-17 | Partners & sponsorship | Enhancement | FS | — | — | — |  |
| HOSP-01 | Hospitality | Launch | IM | visual | hospitality page | — |  |
| HOSP-02 | Hospitality | Launch | IM | visual | hospitality page | — | Enquiry-only |
| HOSP-03 | Hospitality | Launch | IM | visual | hospitality page | — |  |
| HOSP-04 | Hospitality | Launch | IM | visual | hospitality page | — |  |
| HOSP-05 | Hospitality | Launch | IM | visual | hospitality page | — |  |
| HOSP-06 | Hospitality | Launch | IM | visual | hospitality page | — |  |
| HOSP-07 | Hospitality | Enhancement | FS | visual | hospitality page | — |  |
| HOSP-08 | Hospitality | Launch | IM | visual | hospitality page | — | Enquiry-only |
| NEWS-01 | News | Launch | IT | visual | pagination + search | — |  |
| NEWS-02 | News | Launch | IT | visual | filters | — | Filtered views noindex |
| NEWS-03 | News | Launch | IT | schema | ARTICLE_TYPES | — |  |
| NEWS-04 | News | Launch | IM | visual | — | — |  |
| NEWS-05 | News | Launch | IT | I (publishedAt access) | publishedAt | — |  |
| NEWS-06 | News | Launch | IM | visual | — | — |  |
| NEWS-07 | News | Launch | IM | visual | ShareLinks | — |  |
| NEWS-08 | News | Launch | IM | — | seo group + OG | — |  |
| NEWS-09 | News | Launch | IM | visual | corrections | — |  |
| NEWS-10 | News | Launch | IT | I redirect | slugRedirect | — |  |
| NEWS-11 | News | Enhancement | IT | route rss.xml | flag rss | — |  |
| NEWS-12 | News | Launch | IT | I approval | editorialStatus + drafts | — |  |
| NEWS-13 | News | Launch | IT | policy | — | — | Original copy only |
| MEDIA-01 | Media & press | Launch | IM | visual | media-collections | Galleries |  |
| MEDIA-02 | Media & press | Launch | IM | visual | filters | — |  |
| MEDIA-03 | Media & press | Launch | IM | visual | Gallery (dialog, arrows, Esc) | — |  |
| MEDIA-04 | Media & press | Launch | IM | visual | ConsentEmbed | — |  |
| MEDIA-05 | Media & press | Launch | IT | schema | credit/copyrightOwner | — |  |
| MEDIA-06 | Media & press | Launch | IT | U | rights fields | — |  |
| MEDIA-07 | Media & press | Launch | IT | I #23 | media access | — |  |
| MEDIA-08 | Media & press | Launch | IT | visual | /press | Approved assets |  |
| MEDIA-09 | Media & press | Enhancement | IM | — | imageSizes | — |  |
| MEDIA-10 | Media & press | Launch | IT | visual | media enquiry | — |  |
| MEDIA-11 | Media & press | Launch | IM | visual | notice | — |  |
| MEDIA-12 | Media & press | Launch | IM | schema | alt/caption/tags | — |  |
| MEDIA-13 | Media & press | Launch | IT | policy | — | — |  |
| MEDIA-14 | Media & press | Enhancement | FS | — | — | — |  |
| JOB-01 | Careers | Launch | IM | visual | — | Approved copy |  |
| JOB-02 | Careers | Launch | IT | visual | filters | — |  |
| JOB-03 | Careers | Launch | IT | schema | vacancies | — |  |
| JOB-04 | Careers | Launch | IT | server action | applicationAction | — |  |
| JOB-05 | Careers | Launch | IT | magic-byte + size check | cv-uploads (private) | Malware scanner | Scanning AC |
| JOB-06 | Careers | Launch | IT | J JOB-06 | closed/closingDate | — | Server also refuses |
| JOB-07 | Careers | Enhancement | FF | — | flag speculativeApplications | — | Not built |
| JOB-08 | Careers | Launch | IT | I #34 | access + retentionUntil | Retention schedule |  |
| JOB-09 | Careers | Launch | IT | visual | internshipEligibility gate | Approved wording |  |
| UTIL-01 | Utilities | Launch | IT | visual | faqs.category | — |  |
| UTIL-02 | Utilities | Launch | IT | visual | — | — |  |
| UTIL-03 | Utilities | Launch | IT | I | ROUTING_KEY | Routing emails |  |
| UTIL-04 | Utilities | Launch | IA | — | site-settings | Contact details |  |
| UTIL-05 | Utilities | Enhancement | FF | — | flag whatsapp | Approved number |  |
| UTIL-06 | Utilities | Launch | IT | J #28 | lib/search | — |  |
| UTIL-07 | Utilities | Launch | IT | I #12 | public access | — |  |
| UTIL-08 | Utilities | Launch | IT | J #28 | — | — |  |
| UTIL-09 | Utilities | Launch | IT | J UTIL-09 | not-found/error | — |  |
| UTIL-10 | Utilities | Launch | IT | scripts/check-links.ts | — | — |  |
| CMS-01 | CMS | Launch | IT | manual | Payload admin | — |  |
| CMS-02 | CMS | Launch | IT | schema | all collections | — |  |
| CMS-03 | CMS | Launch | IT | I | drafts + staff read | — | Live preview: Enhancement |
| CMS-04 | CMS | Launch | IT | I | requireApprovalToPublish | — |  |
| CMS-05 | CMS | Launch | IT | config | schedulePublish + publishedAt/announceAt | — | Jobs autorun env |
| CMS-06 | CMS | Launch | IT | I | versions | — |  |
| CMS-07 | CMS | Launch | IT | I | ROLES | — |  |
| CMS-08 | CMS | Launch | IT | I | record-level access | — |  |
| CMS-09 | CMS | Launch | IT | I | divisions on users | — |  |
| CMS-10 | CMS | Launch | IT | schema | structured fields | — |  |
| CMS-11 | CMS | Launch | IT | schema | focalPoint/crop/alt/rights | — |  |
| CMS-12 | CMS | Launch | IT | I | redirects + proxy | — |  |
| CMS-13 | CMS | Launch | IT | schema | seo group | — |  |
| CMS-14 | CMS | Launch | IM | required fields + validators | — | — | Dashboard report: Enhancement |
| CMS-15 | CMS | Launch | IT | schema | sources | — |  |
| CMS-16 | CMS | Launch | IT | I | substantiation group | — |  |
| CMS-17 | CMS | Launch | IT | I | audit-logs | — |  |
| CMS-18 | CMS | Launch | IT | I #13 | /api/season-rollover | — |  |
| CMS-19 | CMS | Launch | IT | global | feature-flags | — |  |
| CMS-20 | CMS | Launch | IT | I kill-switch | enabled flags | — |  |
| TEST-LP | Testing division | Launch | IT | J #2 | /testing | Approved proposition |  |
| TEST-FLEET | Testing division | Future | IT | I testing division boundary | test-cars (staff-only) | Fleet data | Reserved model, no public route |
| TEST-ENQ | Testing division | Launch | IT | I divisions | /testing/enquire | — |  |
| ORG-LP | Organisation division | Launch | IT | visual | /championship-organisation | Approved ambition |  |
| ORG-ENQ | Organisation division | Launch | IT | I divisions | /championship-organisation/enquire | — |  |
| PORTAL-DRIVER | Portals & shop | Future | FS | — | flag driverPortal | — | Not built |
| PORTAL-PARTNER | Portals & shop | Future | FS | — | flag partnerPortal | — | Not built |
| SHOP | Portals & shop | Future | FS | — | flag shop | — | Hidden |
| SEO-01 | SEO | Launch | IT | generateMetadata | — | — |  |
| SEO-02 | SEO | Launch | IT | alternates.canonical | — | — |  |
| SEO-03 | SEO | Launch | IT | app/sitemap.ts | public reads | — | Prod only |
| SEO-04 | SEO | Launch | IT | robots.ts + noindex | APP_ENV | — |  |
| SEO-05 | SEO | Launch | IM | JsonLd | — | — | Organisation, Breadcrumb, NewsArticle, Person, SportsEvent, JobPosting, FAQ |
| SEO-06 | SEO | Launch | IT | policy | — | — |  |
| SEO-07 | SEO | Launch | IA | redirects | — | Old→new URL map |  |
| SEO-08 | SEO | Launch | IA | — | — | KIC domain rights |  |
| SEO-09 | SEO | Launch | IA | ASSET-RIGHTS.md | — | Migration inventory |  |
| SEO-10 | SEO | Launch | IT | championships.aliases | — | — |  |
| SEO-11 | SEO | Launch | IT | noindex filters | — | — |  |
| SEO-12 | SEO | Enhancement | FS | — | — | — | English only |
| AN-CONSENT | Analytics | Launch | IT | P #25 | ConsentManager | — |  |
| AN-PII | Analytics | Launch | IT | U sanitizeProps | — | — |  |
| AN-EVENTS | Analytics | Launch | IM | data-track + track() | — | Provider | division_selected, race_enquiry_started/submitted, sponsor_enquiry_submitted, testing_handoff_clicked, organiser_enquiry_submitted, calendar_downloaded, media_downloaded, careers_application_submitted, official_timing_clicked |

**Totals:** 295 requirements — AC: 1, FF: 5, FS: 14, IA: 25, IM: 85, IT: 165

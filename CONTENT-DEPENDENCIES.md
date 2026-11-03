# Content dependencies (owner checklist)

The site works now with honest empty states. The items below must come **from the owner**. None of them have been invented. Status values: ☐ outstanding · ◐ partially supplied · ☑ supplied.

| # | Input | Status | Where it goes in the CMS | Treatment / rule |
|---|---|---|---|---|
| 1 | Logo and brand guidelines | ◐ K mark and livery concept supplied. No written guidelines | `public/brand/*` (built from `scripts/assets`) | Palette derived from the supplied artwork. Needs owner sign-off on the wordmark lock-up ("KARAT / RACING") and a vector (SVG) logo |
| 2 | Legal company name, number, registered address | ☐ | Settings → Site settings | Footer and privacy notice show placeholders until supplied |
| 3 | KIC Motorsport acquisition / heritage wording | ☐ | Settings → Team content → Heritage | Hidden until **Acquisition approved** is ticked. Also needs evidence of rights to the KIC name, results archive and domain |
| 4 | Heritage milestones and evidence | ☐ | Team → Heritage milestones | Each needs an entity and a source before approval |
| 5 | Programme entry confirmations | ☐ | Racing → Programmes / Programme seasons | Every programme is **Intended**. "Confirmed" needs a source record (the validator enforces this) |
| 6 | Indian F4 relationship model | ☐ | Programme → Relationship type | Currently "Relationship to be confirmed" |
| 7 | Formula X / TopJet F2000 official links and class details | ◐ Formula X site observed. F2000 site **not verified** | Championships → Formula X | F2000 URL left out until verified |
| 8 | Car specifications per season | ◐ GB4 chassis (2026). Italian F4 and Indian F4 not verified | Championship seasons → Machinery | Leave blank until verified from a primary source |
| 9 | Calendars for 2027 | ☐ | Racing → Events / Sessions | Enter circuit-local times. UTC is computed automatically |
| 10 | Driver announcements, portraits, consents | ☐ | Racing → Drivers / Driver engagements | Use `announceAt` for embargoes. Minors need consent recorded |
| 11 | Staff profiles | ☐ | Team → People | Tick "Approved for publication" |
| 12 | Facilities and equipment | ☐ | Team → Facilities | State owned / operated / partner-provided |
| 13 | Team story, values, simulator/coaching statements | ☐ | Settings → Team content | Neutral fallback copy is shown until approved |
| 14 | Partners, logos, rights dates | ☐ | Commercial → Partners / Partnerships | Logo approval + start/end dates |
| 15 | Audience / reach figures | ☐ | Team content → Commercial | Karat-only figures with source, period and scope |
| 16 | Commercial deck, team profile PDF, brochures | ☐ | Team content → Commercial; Programme → Brochure | Record the version |
| 17 | Photography and video with rights | ☐ | Media | Credit, owner, scope, expiry, public approval |
| 18 | Contact routing addresses | ☐ | Site settings → Routing | Test every route (LAUNCH-CHECKLIST) |
| 19 | Public email, phone, social accounts | ☐ | Site settings | Approved accounts only |
| 20 | Safeguarding lead | ☐ | Site settings → Safeguarding lead | Required before launch |
| 21 | Privacy, cookie and terms wording | ◐ Drafts in place | `/privacy`, `/cookies`, `/terms` | **Qualified legal review** (UK / EU / India) |
| 22 | Retention periods | ☐ | Code defaults: enquiries 24 months, applications 6 months | Confirm with the adviser |
| 23 | Response-time promise | ☐ (deliberately blank) | Site settings | Only if the business approves one |
| 24 | Testing division: cars, partners, geography | ☐ | Future data model | Not published |
| 25 | Championship Series name / approvals | ☐ | — | Nothing is published until confirmed |
| 26 | Old → new URL map (KIC domain) | ☐ | Governance → Redirects | Only if domain and migration rights exist |

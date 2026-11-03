# Data Sources & Research Register

Research reference date: **3 November 2026**. "Observed" means the URL was fetched, appeared in search results, or appeared as a link on a fetched page. "Inferred" means it came from a secondary source or could not be confirmed. **No URL in this file was guessed.**

These sources are **benchmarks and verification leads**. They do not prove Karat Racing takes part in any series. Each fact must be re-verified against the primary source for the season concerned, and recorded as a `SourceRecord` in the CMS (Admin → Governance → Sources), before it is published.

## Championships

| Championship | Item | URL | Observed / inferred | Note | Access limitations |
|---|---|---|---|---|---|
| Italian F4 | Official site | https://f4championship.com/ | Observed | "Formula4 Italian Championship – Certified by FIA – WSK Promotion" | — |
| Italian F4 | ACI Sport F4 section | https://www.acisport.it/en/F4/ | Observed | The section's text is mirrored on f4championship.com | Returned HTTP 403 to automated fetch |
| Italian F4 | 2026 sporting regulations | https://acisport.it/en/f4/regulations/2026 | Observed (as a link) | Linked from the f4championship.com news item announcing the regulations | — |
| Italian F4 | 2026 points / over-capacity format | f4championship.com news items 983 and 985 | Observed | Points go to the top 15 (30-26-22-20-18-16-14-12-10-9-8-6-4-2-1). Large entries use qualifying groups, qualifying races and a Final | Implementation: points and format are season data, never hard-coded |
| Italian F4 | Car / engine | — | Inferred | Tatuus F4-T421 with Abarth 1.4 turbo, per secondary sources only | **Do not publish until verified from a primary source** |
| GB4 | Official site | https://www.gb-4.net/ | Observed | MotorSport Vision Racing | — |
| GB4 | Event format / operation | https://www.gb-4.net/info/event-format · https://www.gb-4.net/info/operation | Observed | No dedicated regulations page found | — |
| GB4 | 2026 changes | https://www.gb-4.net/news/2026/apr/19/whats-new-in-gb4-2026 | Observed | Races go from 18 to 20 min. New rookie title, test-day tyre limits, 4 pit staff per car | Season-specific data |
| GB4 | Car | https://www.gb-4.net/ | Observed | Tatuus MSV GB4-025. The engine is described but its make is not named | — |
| Indian F4 | Official site / about | https://fiaindianf4.com · https://fiaindianf4.com/about | Observed | Promoter: Racing Promotions Pvt Ltd (RPPL). Credits Ligier (chassis) and Oreca (engines) | Only 2025 regulations PDF found |
| Indian F4 | 2026 season report | https://telanganatoday.com/f4-indian-championship-2026-season-to-begin-in-coimbatore-on-september-12 | Observed (secondary) | City-franchise teams within the Indian Racing Festival | Secondary source |
| Indian F4 | Operating model | https://feederseries.net/2025/08/15/indian-f4-2025-season-guide | Observed (secondary, 2025) | The promoter reportedly runs the cars in-house with franchise teams | **Unconfirmed by a primary source.** This is why the site models Karat's relationship as configurable data |
| Indian F4 | 2026 machinery | — | **Conflict** | The Ligier JS F422 is confirmed for 2025. No 2026 manufacturer announcement for India was found in this pass | Leave machinery unpublished until verified |
| Formula X Italian Series | Official site | https://www.formulaxitalianseries.it/ | Observed (as a link) | FX1/FX2 single-seater classes | Not fetched directly |
| TopJet F2000 Italian Formula Trophy | Site | www.f2trophy.it | Inferred (Wikipedia only) | Formula Libre series with several classes. Its title sponsor has changed over the years | **Verify before linking** |
| FIA Formula Regional European Championship | FIA event page | https://www.fia.com/events/fia-formula-regional-european-championship/season-2026/fia-formula-regional-european | Observed (as a link) | Takes over from FRECA naming for 2026 | — |
| FIA FREC | 2026 sporting regulations | https://www.fia.com/system/files/documents/2026_fia_frec_sporting_regulations_v5_clean.pdf | Observed | V5, 23 Jun 2026 | — |
| FRECA (historic) | Former site | https://formularegionaleubyalpine.com/ | Observed | Latest item is from Dec 2025 | Historic naming only |
| FIA F2 | Official site | https://www.fiaformula2.com/ | Observed | Benchmark only | — |
| FIA F3 | Official site | https://www.fiaformula3.com/ | Observed | Benchmark only | — |
| KIC Motorsport | Official site | https://www.kicmotorsport.com/ | Observed | Finnish team, ran in FRECA 2019–2024 | **Not** on the FIA FREC 2026 grid. Archive republication rights are unconfirmed (SEO-08) |

## Reference teams (functionality benchmarks only)

| Team | URL | Observed / inferred | Pattern noted (from brief) | Implementation implication |
|---|---|---|---|---|
| PREMA | https://premaracing.com/en | Observed | Race previews with session timetables and local time | Event hubs with circuit-local time and a viewer-time toggle |
| Rodin Motorsport | https://rodinmotorsport.com | Observed | Championship pages linked to driver announcements | Programme hubs related to drivers and news |
| Hitech | https://www.hitechgp.co.uk | Observed | Driver progression and facilities | Driver-development page using only approved resources |
| MP Motorsport | https://mpmotorsport.com | Observed | Commercial partnership proposition | Partner With Us funnel and inventory |
| Van Amersfoort Racing | https://www.vanamersfoortracing.nl | Observed | Driver biographies and careers pathway | Driver profiles and careers with applications |
| Campos Racing | https://www.camposracing.com | Inferred | Separate championship pages | One reusable programme template |
| Trident | https://www.tridentmotorsport.com/en | Observed | Championship hub with drivers, calendar and standings | Connected season hubs |
| Fortec | https://www.fortecmotorsport.com | Observed | Standings on the programme page | Standings with source attribution |
| Elite Motorsport | https://www.elitemotorsport.co.uk | Observed | Championship overview, format and calendar | Championship explainer for families |
| AS Motorsport | https://asmotorsport.preveli.it/team | Observed, official status uncertain | Racing vs academy vs testing | Distinct Testing division with cross-links |

Notes:
- Features in the benchmark column come from the project brief. **No private portal or integration of any team was tested.** Nothing in this register should be read as proof that a competitor has a given capability.
- The GB3 and Italian F4 team directories should be used as a coverage checklist only. They were not re-crawled in this pass.

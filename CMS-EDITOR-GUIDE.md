# CMS editor guide

Sign in at **`/admin`**. The menu is grouped into Structure, Racing, Editorial, Media, Commercial, Team, People & Careers, Leads, Governance and Settings.

## Roles

| Role | Can do |
|---|---|
| Administrator | Everything: approve and publish, manage users, see all enquiries including safeguarding |
| Editor | Pages, programmes, drivers, news (cannot approve), FAQs, people, facilities, heritage |
| Race-data editor | Circuits, events, sessions, results, standings, live updates. **No** access to enquiries or applications |
| Commercial manager | Partners and partnerships. Race, partnership, hospitality and general enquiries for their divisions |
| Media manager | Media library, galleries, media enquiries |
| Recruiter | Vacancies, applications, CVs |

## Everyday tasks

**Publish a news article**
1. Editorial → Articles → Create. Add a title, type, standfirst, hero image and body. Link the programmes, drivers and events it relates to.
2. Set **Editorial status** to *In review* and save the draft.
3. An administrator sets it to *Approved*.
4. Click **Publish**. To schedule it, set **Published at** to a future time, or use *Schedule publish*. The article stays hidden until that time.
5. If you change the slug later, a redirect from the old URL is created automatically.
6. To correct a published article, add a **Corrections** entry. It is shown to readers.

**Announce a driver (embargo)**
1. Racing → Drivers → Create. Fill in the profile. If the driver is under 18, tick **Is minor** and record guardian and media consent; publishing is blocked until you do.
2. Set **Announce at** (Publishing tab), then publish. The driver is invisible everywhere (pages, search, sitemap, API) until that time.
3. Add a **Driver engagement** for each season and programme, with that season's racing number.

**Add a race weekend**
1. Make sure the circuit exists, with its IANA time zone (e.g. `Europe/Rome`).
2. Racing → Events: enter the programme, season, round, circuit, dates, status and official links. Publish.
3. Racing → Sessions: enter **Local start/end as circuit time** (`2027-04-10T10:30`) and its certainty (Confirmed / Provisional / TBC). UTC is calculated for you, including daylight-saving changes.
4. If an event is postponed or cancelled, change its status and add a **Change note**. It is then never chosen as the "next event".

**Publish results**
1. Optional: test a CSV first by POSTing it to `/api/results-import/preview` (columns: `position,driver,number,entrant,laps,time,gap,points,status`). Nothing is saved; you get back any validation issues.
2. Racing → Result sets: choose the event and session, classification (*overall*, *rookie*…), **state** (provisional/final) and **attribution** (Karat / KIC / other).
3. Add the official **source** URL or document, set **Verification = Verified**, then publish. Unverified results never appear publicly.
4. Leave unknown values blank. They display as "—", never as 0.
5. When the final classification arrives, change the state to *Final*. Each version is kept in **Versions**, and who changed what is in Governance → Audit logs.

**New season (rollover)**
POST `/api/season-rollover` with `{ "programmeSeasonId": <id> }` while signed in, or create a Programme season manually. The participation status always resets to *Intended*. Drivers, seats and sponsor rights are never copied.

**Partners**
Create the partner and tick **Publication approved** only when you have written logo approval. Then create a **Partnership** with tier, scope and start/end dates. When the end date passes, the partner moves to "Past partners" automatically.

**Media**
Upload images with alt text, credit, owner and usage scope. Tick **Public use approved**. Set **Rights expire at** if the licence ends; the asset is withdrawn automatically after that date. Tick **Download permitted** to offer it on the Press page.

**Enquiries**
Leads → Enquiries. Work each one through *New → Assigned → Contacted → Qualified → Proposal → Converted / Closed*. Use **Internal notes** for the history. Enquiries that involve a minor are flagged.

**Owner kill-switches**
- Structure → Divisions → *Enabled* hides a business.
- Racing → Programmes → *Enabled* hides a programme.
- Settings → Feature flags turns optional modules on or off.

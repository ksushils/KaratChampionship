import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { CvUploads } from './collections/CvUploads'
import { Sources } from './collections/Sources'
import { AuditLogs, ConsentRecords, Notifications, Redirects } from './collections/Governance'
import { Championships, ChampionshipSeasons, Circuits, Divisions, Events, ProgrammeSeasons, Programmes, Sessions } from './collections/Racing'
import { ResultSets, Standings } from './collections/Results'
import { DriverEngagements, Drivers, Facilities, HeritageMilestones, People } from './collections/People'
import { Applications, Articles, Faqs, LiveUpdates, MediaCollections, Partners, Partnerships, Vacancies } from './collections/Editorial'
import { Enquiries } from './collections/Enquiries'
import { FeatureFlags, SiteSettings, TeamContent } from './globals'
import { healthEndpoint, notificationsCronEndpoint, resultsImportPreviewEndpoint, seasonRolloverEndpoint } from './endpoints'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' — Karat Racing CMS' },
    importMap: { baseDir: path.resolve(dirname) },
    livePreview: undefined,
  },
  collections: [
    Divisions,
    Programmes,
    ProgrammeSeasons,
    Championships,
    ChampionshipSeasons,
    Drivers,
    DriverEngagements,
    Circuits,
    Events,
    Sessions,
    ResultSets,
    Standings,
    LiveUpdates,
    Articles,
    Faqs,
    MediaCollections,
    Media,
    Partners,
    Partnerships,
    People,
    Facilities,
    HeritageMilestones,
    Vacancies,
    Applications,
    CvUploads,
    Enquiries,
    Notifications,
    Sources,
    Redirects,
    ConsentRecords,
    AuditLogs,
    Users,
  ],
  globals: [SiteSettings, FeatureFlags, TeamContent],
  endpoints: [healthEndpoint, notificationsCronEndpoint, seasonRolloverEndpoint, resultsImportPreviewEndpoint],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
    push: process.env.PAYLOAD_DB_PUSH === 'true',
  }),
  graphQL: { disable: true },
  cors: [serverURL],
  csrf: [serverURL],
  sharp,
  upload: { limits: { fileSize: 10_000_000 } },
  jobs: {
    // Enables scheduled publish/unpublish (CMS-05). Run via `autoRun` on long-lived servers or the jobs endpoint on serverless.
    tasks: [],
    autoRun: process.env.PAYLOAD_JOBS_AUTORUN === 'true' ? [{ cron: '* * * * *', queue: 'default', limit: 20 }] : undefined,
  },
})

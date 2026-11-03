import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
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
    meta: { titleSuffix: ' — Karat Racing CMS', icons: [{ url: '/icon.png' }] },
    components: { graphics: { Logo: '/components/admin/Logo', Icon: '/components/admin/Icon' } },
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
  // CMS system email (password resets). Enquiry notifications use the outbox in src/lib/notifications.ts.
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'no-reply@example.com',
        defaultFromName: 'Karat Racing',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
        },
      })
    : undefined,
  sharp,
  upload: { limits: { fileSize: 10_000_000 } },
  jobs: {
    // Enables scheduled publish/unpublish (CMS-05). Run via `autoRun` on long-lived servers or the jobs endpoint on serverless.
    tasks: [],
    autoRun: process.env.PAYLOAD_JOBS_AUTORUN === 'true' ? [{ cron: '* * * * *', queue: 'default', limit: 20 }] : undefined,
  },
})

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'node:path'

const TEST_DB = process.env.TEST_DATABASE_URL || 'postgres://karat:karat@localhost:5432/karat_test'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: { alias: { 'server-only': path.resolve(__dirname, 'tests/stubs/server-only.ts') } },
  test: {
    projects: [
      { extends: true, test: { name: 'unit', environment: 'node', include: ['tests/unit/**/*.test.ts'] } },
      {
        extends: true,
        test: {
          name: 'int',
          environment: 'node',
          include: ['tests/int/**/*.int.test.ts'],
          testTimeout: 60_000,
          hookTimeout: 180_000,
          fileParallelism: false,
          env: { DATABASE_URL: TEST_DB, PAYLOAD_SECRET: 'test-secret-0123456789', PAYLOAD_DB_PUSH: 'true', EMAIL_ADAPTER: 'fail', APP_ENV: 'test', NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000' },
        },
      },
    ],
  },
})

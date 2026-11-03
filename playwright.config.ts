import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

/**
 * E2E against a running site seeded with `pnpm seed:demo`.
 * Locally it reuses `pnpm dev`; in CI set E2E_BASE_URL or let it start `pnpm start` after a build.
 */
const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000'
export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  timeout: 60_000,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL, trace: 'on-first-retry' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, testIgnore: /responsive\.spec\.ts/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /responsive\.spec\.ts/ },
  ],
  webServer: process.env.E2E_BASE_URL ? undefined : { command: process.env.CI ? 'pnpm start' : 'pnpm dev', reuseExistingServer: true, url: baseURL, timeout: 180_000 },
})

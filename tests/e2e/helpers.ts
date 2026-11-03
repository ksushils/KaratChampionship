import type { BrowserContext } from '@playwright/test'

export async function presetConsent(context: BrowserContext, baseURL: string, analytics = false, media = false) {
  await context.addCookies([{ name: 'karat_consent', value: encodeURIComponent(JSON.stringify({ v: 1, analytics, media, at: new Date().toISOString() })), url: baseURL }])
}

import { expect, test } from '@playwright/test'
import { presetConsent } from './helpers'

const PATHS = ['/', '/championship-team', '/championship-team/programmes', '/championship-team/programmes/gb4', '/championship-team/calendar?view=month', '/championship-team/results', '/championship-team/standings', '/championship-team/events/demo-round-3-monza', '/championship-team/race-centre', '/championship-team/race-with-us', '/championship-team/partner-with-us', '/championship-team/news', '/testing', '/championship-organisation']

for (const width of [375, 390, 768]) {
  test(`#27 no horizontal page overflow at ${width}px`, async ({ page, context, baseURL }) => {
    await presetConsent(context, baseURL!)
    await page.setViewportSize({ width, height: 900 })
    for (const p of PATHS) {
      await page.goto(p)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, `${p} overflows by ${overflow}px`).toBeLessThanOrEqual(0)
    }
  })
}

test('mobile menu opens, lists businesses, and closes with Escape', async ({ page, context, baseURL }) => {
  await presetConsent(context, baseURL!)
  await page.goto('/championship-team')
  await page.locator('header[data-hydrated]').waitFor()
  const btn = page.getByRole('button', { name: 'Open menu' })
  await btn.click()
  const menu = page.locator('#mobile-menu')
  await expect(menu.getByRole('link', { name: 'Testing & Karat Academy' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
})

import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { presetConsent } from './helpers'

test('#25 rejecting optional cookies prevents analytics requests; accepting loads them', async ({ page }) => {
  const hits: string[] = []
  await page.route('https://analytics.example.test/**', (route) => {
    hits.push(route.request().url())
    return route.fulfill({ status: 200, contentType: 'application/javascript', body: 'window.plausible=function(){}' })
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Reject optional' }).click()
  await page.goto('/championship-team')
  await page.waitForLoadState('load')
  await page.waitForTimeout(1500)
  expect(hits).toHaveLength(0)
  // Withdraw/change: open preferences from the footer and opt in.
  await page.getByRole('button', { name: 'Cookie settings' }).click()
  await page.getByRole('checkbox', { name: /Analytics/ }).check()
  await page.getByRole('button', { name: 'Save choices' }).click()
  await expect.poll(() => hits.length).toBeGreaterThan(0)
})

test('#26 keyboard: skip link, menu disclosure with Escape, focus visible', async ({ page, context, baseURL }) => {
  await presetConsent(context, baseURL!)
  await page.goto('/championship-team')
  await page.locator('header[data-hydrated]').waitFor()
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to main content' })
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
  const btn = page.getByRole('button', { name: 'Programmes' })
  await btn.focus()
  await page.keyboard.press('Enter')
  await expect(btn).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('link', { name: 'All programmes', exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(btn).toHaveAttribute('aria-expanded', 'false')
})

for (const path of ['/', '/championship-team', '/championship-team/programmes/italian-f4', '/championship-team/race-with-us', '/championship-team/results', '/championship-team/events/demo-round-3-monza', '/championship-team/partner-with-us', '/testing', '/championship-organisation']) {
  test(`axe: no serious/critical violations on ${path}`, async ({ page, context, baseURL }) => {
    await presetConsent(context, baseURL!)
    await page.goto(path)
    const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    const bad = res.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(bad.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
  })
}

import { expect, test } from '@playwright/test'
import { presetConsent } from './helpers'

test.beforeEach(async ({ context, baseURL }) => presetConsent(context, baseURL!))

test('#1 visitor selects Championship Team from the gateway', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Karat')
  const panels = page.getByRole('heading', { level: 3 })
  await expect(panels).toHaveText([/Championship Team/i, /Testing/i, /Championship Series/i])
  await page.getByRole('link', { name: 'Championship Team', exact: true }).last().click()
  await expect(page).toHaveURL(/\/championship-team$/)
  await expect(page.getByText('You are viewing:')).toBeVisible()
})

test('#2 visitor switches from Championship Team to Testing without returning to the gateway', async ({ page }) => {
  await page.goto('/championship-team')
  await page.getByRole('button', { name: /Business:/ }).click()
  await page.getByRole('link', { name: 'Testing & Karat Academy' }).first().click()
  await expect(page).toHaveURL(/\/testing$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/performance/i)
})

test('#3 #4 programmes show statuses and none is presented as a confirmed entry', async ({ page }) => {
  await page.goto('/championship-team/programmes')
  for (const p of ['Italian F4', 'GB4', 'Indian F4']) await expect(page.getByRole('heading', { name: p, exact: true })).toBeVisible()
  await expect(page.getByText('Intended programme').first()).toBeVisible()
  await expect(page.getByText('Confirmed entry')).toHaveCount(0)
  await expect(page.getByText(/does not hold an FIA F3 entry/)).toBeVisible()
})

test('#5 programme CTA opens the enquiry with programme context', async ({ page }) => {
  await page.goto('/championship-team/programmes/gb4')
  await page.getByRole('link', { name: 'Discuss this programme' }).click()
  await expect(page).toHaveURL(/race-with-us\?programme=gb4/)
  await expect(page.getByRole('radio', { name: /GB4/ })).toBeChecked()
})

test('#6 #9 parent submits a race enquiry for a young driver and receives a reference', async ({ page }) => {
  await page.goto('/championship-team/race-with-us?programme=italian-f4')
  await page.getByRole('button', { name: /Continue/ }).click()
  await page.getByRole('radio', { name: 'Parent or guardian' }).check()
  await page.getByLabel('Driver name').fill('Young Racer')
  await page.getByLabel(/Driver age band/).selectOption('14-15')
  await page.getByRole('button', { name: /Continue/ }).click()
  // Validation is announced and blocks progress.
  await page.getByRole('button', { name: 'Send race enquiry' }).click()
  await expect(page.getByTestId('form-errors')).toContainText('Full name is required')
  await page.getByLabel('Full name').fill('Pat Parent')
  await page.getByLabel('Email address').fill('pat.parent@example.com')
  await page.getByLabel('Country').fill('United Kingdom')
  await page.getByLabel(/I have read the privacy notice/).check()
  await page.waitForTimeout(2100) // spam time-trap
  await page.getByRole('button', { name: 'Send race enquiry' }).click()
  await expect(page.getByRole('heading', { name: 'Enquiry received' })).toBeVisible({ timeout: 20_000 })
  await expect(page.getByTestId('enquiry-reference')).toHaveText(/^KR-RP-[A-Z2-9]{6}$/)
})

test('#9 minor driver enquiring alone is asked for guardian details', async ({ page }) => {
  await page.goto('/championship-team/race-with-us?programme=gb4')
  await page.getByRole('button', { name: /Continue/ }).click()
  await page.getByRole('radio', { name: 'I am the driver' }).check()
  await page.getByLabel(/Driver age band/).selectOption('16-17')
  await expect(page.getByLabel(/Parent or guardian name/)).toBeVisible()
  await page.getByRole('button', { name: /Continue/ }).click()
  await expect(page.getByTestId('form-errors')).toContainText(/Parent or guardian name is required/)
})

test('#17 cancelled events are never selected as the next race', async ({ page }) => {
  await page.goto('/championship-team')
  const panel = page.locator('section', { has: page.getByText('Next event', { exact: true }) })
  await expect(panel).toContainText('Monza')
  await expect(panel).not.toContainText('Donington')
})

test('#15 event timetable shows circuit-local times and a viewer-time option', async ({ page }) => {
  await page.goto('/championship-team/events/demo-round-3-madras')
  await expect(page.getByText(/circuit local time \(Asia\/Kolkata\)/)).toBeVisible()
  await expect(page.getByRole('row', { name: /Free Practice/ })).toContainText('09:30')
  await expect(page.getByRole('row', { name: /Race 2/ })).toContainText('Time TBC')
  await page.getByRole('radio', { name: /My time/ }).check()
  await expect(page.getByRole('radio', { name: /My time/ })).toBeChecked()
})

test('CAL-10 single-event ICS download is a valid calendar', async ({ request }) => {
  const r = await request.get('/championship-team/events/demo-round-3-monza/ics')
  expect(r.headers()['content-type']).toContain('text/calendar')
  const body = await r.text()
  expect(body).toMatch(/^BEGIN:VCALENDAR\r\n/)
  expect(body).toContain('BEGIN:VEVENT')
})

test('#21 missing result values are not shown as zero', async ({ page }) => {
  await page.goto('/championship-team/results')
  const row = page.getByRole('row', { name: /Rival Two/ })
  await expect(row.getByTitle('Not published')).toHaveCount(1)
  await expect(page.getByRole('row', { name: /Rival Three/ })).toContainText('DNF')
})

test('#22 expired partner is not shown as current', async ({ page }) => {
  await page.goto('/championship-team/partners')
  await expect(page.getByRole('link', { name: /Example Partner/ })).toBeVisible()
  const current = page.locator('main section').first().locator('xpath=following-sibling::section[1]')
  await expect(current.getByRole('link', { name: /Expired Partner/ })).toHaveCount(0)
  await expect(page.getByText(/Past partners/)).toBeVisible()
})

test('#28 search returns public content only', async ({ page }) => {
  await page.goto('/search?q=Pat%20Parent')
  await expect(page.getByText('No matches found.')).toBeVisible()
  await page.goto('/search?q=GB4')
  await expect(page.getByRole('link', { name: 'GB4', exact: true })).toBeVisible()
})

test('CHAMP-20 testing hand-off keeps programme context and goes to the Testing division', async ({ page }) => {
  await page.goto('/championship-team/programmes/italian-f4')
  await page.getByRole('link', { name: 'Ask about testing first' }).click()
  await expect(page).toHaveURL(/\/testing\/enquire/)
  await expect(page.getByText(/You came from the/)).toContainText('Italian F4')
  await expect(page.getByText('You are viewing:').locator('..')).toContainText('Testing')
})

test('JOB-06 closed vacancies refuse applications', async ({ page }) => {
  await page.goto('/championship-team/careers/demo-closed-role')
  await expect(page.getByText('This role is closed')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Submit application' })).toHaveCount(0)
})

test('UTIL-09 unknown pages return a helpful 404', async ({ page }) => {
  const r = await page.goto('/championship-team/drivers/not-a-driver')
  expect(r?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: /Off the racing line/ })).toBeVisible()
})

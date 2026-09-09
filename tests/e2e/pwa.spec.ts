import { expect, test } from '@playwright/test'

test.describe('PWA', () => {
  test('serve manifest com nome, ícones e display standalone', async ({
    request,
  }) => {
    const resposta = await request.get('/manifest.webmanifest')
    expect(resposta.ok()).toBeTruthy()

    const manifest = await resposta.json()
    expect(manifest.name).toBe('my-biblia')
    expect(manifest.display).toBe('standalone')
    expect(Array.isArray(manifest.icons)).toBe(true)
    expect(manifest.icons.length).toBeGreaterThan(0)
  })

  test('a home linka o manifest e o apple-touch-icon', async ({ page }) => {
    await page.goto('/')
    const manifest = page.locator('link[rel="manifest"]')
    await expect(manifest).toHaveCount(1)

    const apple = page.locator('link[rel="apple-touch-icon"]')
    await expect(apple).toHaveCount(1)
  })

  test('theme-color muda entre light e dark', async ({ page }) => {
    await page.goto('/')
    const themeColors = await page.locator('meta[name="theme-color"]').all()
    // Um para cada media query.
    expect(themeColors.length).toBeGreaterThanOrEqual(2)
  })
})

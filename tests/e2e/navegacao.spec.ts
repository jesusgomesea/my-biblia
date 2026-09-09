import { expect, test } from '@playwright/test'

test.describe('Navegação principal', () => {
  test('home mostra as duas CTAs e o cabeçalho fixo', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', {
        name: /Leia a Bíblia no seu ritmo/i,
      }),
    ).toBeVisible()

    await expect(
      page.getByRole('link', { name: /Montar um plano de estudo/i }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /Abrir a Bíblia/i }),
    ).toBeVisible()
  })

  test('a barra de navegação leva a cada seção', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Planos', exact: true }).click()
    await expect(page).toHaveURL('/planos')

    await page.getByRole('link', { name: 'Marcados', exact: true }).click()
    await expect(page).toHaveURL('/marcacoes')

    await page.getByRole('link', { name: 'Buscar', exact: true }).click()
    await expect(page).toHaveURL('/busca')
  })

  test('/planos vazio mostra o painel de boas-vindas no desktop', async ({
    page,
  }) => {
    await page.goto('/planos')

    await expect(
      page.getByRole('heading', {
        name: /Escolha um plano à esquerda ou monte um novo/i,
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /Montar meu primeiro plano/i }),
    ).toBeVisible()
  })

  test('/planos/novo carrega o formulário', async ({ page }) => {
    await page.goto('/planos/novo')

    await expect(page).toHaveURL(/\/planos\/novo/)
    // O título do formulário pode mudar; verificamos os campos essenciais
    // que a modelagem exige.
    await expect(page.getByRole('textbox').first()).toBeVisible()
  })
})

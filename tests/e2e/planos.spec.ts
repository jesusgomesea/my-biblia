import { expect, test } from '@playwright/test'
import type { Plano } from '../../lib/planos/tipos'

/** Semeia um plano no localStorage sem chamar a IA, para testar a leitura. */
function planoDeFake(): Plano {
  return {
    id: 'plano-teste',
    titulo: 'Plano de teste',
    resumo: 'Semeado pelo Playwright.',
    temas: ['fé'],
    dias: 2,
    minutosPorDia: 10,
    traducao: 'NVT',
    criadoEm: new Date().toISOString(),
    concluidos: [],
    roteiro: [
      {
        dia: 1,
        foco: 'Início do caminho',
        reflexao: 'O que é fé para você?',
        leituras: [
          {
            livro: 58,
            capitulo: 11,
            versiculoInicio: 1,
            versiculoFim: 6,
          },
        ],
      },
      {
        dia: 2,
        foco: 'Testemunhas',
        reflexao: 'Quem inspira a sua fé?',
        leituras: [
          {
            livro: 58,
            capitulo: 12,
            versiculoInicio: 1,
            versiculoFim: 3,
          },
        ],
      },
    ],
  }
}

test.describe('Planos armazenados no navegador', () => {
  test('lista o plano semeado e mostra a barra lateral no desktop', async ({
    page,
  }) => {
    const plano = planoDeFake()
    await page.goto('/planos')
    await page.evaluate((p) => {
      localStorage.setItem('my-biblia:planos', JSON.stringify([p]))
    }, plano)
    await page.reload()

    await expect(page.getByText('Plano de teste').first()).toBeVisible()
    await expect(page.getByText('0/2').first()).toBeVisible()
  })

  test('abre o detalhe e mostra preview das referências nos dias fechados', async ({
    page,
  }) => {
    const plano = planoDeFake()
    await page.goto('/planos')
    await page.evaluate((p) => {
      localStorage.setItem('my-biblia:planos', JSON.stringify([p]))
    }, plano)

    await page.goto(`/planos/${plano.id}`)

    await expect(
      page.getByRole('heading', { name: 'Plano de teste' }),
    ).toBeVisible()

    // Dia 1 abre por padrão; dia 2 fica fechado com referência visível.
    await expect(page.getByText('Testemunhas')).toBeVisible()
    await expect(page.getByText(/Hebreus 12:1-3/)).toBeVisible()
  })
})

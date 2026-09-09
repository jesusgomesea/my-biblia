import { describe, expect, it } from 'vitest'
import { converterLeitura } from '@/lib/planos/gerar'

describe('converterLeitura', () => {
  it('resolve o livro pelo nome canônico', () => {
    expect(
      converterLeitura({
        livro: 'João',
        capitulo: 3,
        versiculoInicio: 16,
        versiculoFim: 17,
      }),
    ).toEqual({ livro: 43, capitulo: 3, versiculoInicio: 16, versiculoFim: 17 })
  })

  it('aceita abreviações', () => {
    expect(
      converterLeitura({
        livro: 'Pv',
        capitulo: 3,
        versiculoInicio: 5,
        versiculoFim: 6,
      })?.livro,
    ).toBe(20)
  })

  it('devolve null para livro desconhecido', () => {
    expect(
      converterLeitura({
        livro: 'Livro Que Nao Existe',
        capitulo: 1,
        versiculoInicio: 1,
        versiculoFim: 1,
      }),
    ).toBeNull()
  })

  it('descarta capítulo além do canon', () => {
    // Rute tem 4 capítulos
    expect(
      converterLeitura({
        livro: 'Rute',
        capitulo: 99,
        versiculoInicio: 1,
        versiculoFim: 1,
      }),
    ).toBeNull()
  })

  it('descarta capítulo 0 ou negativo', () => {
    expect(
      converterLeitura({
        livro: 'Gênesis',
        capitulo: 0,
        versiculoInicio: 1,
        versiculoFim: 1,
      }),
    ).toBeNull()
  })

  it('clampa versículoInicio menor que 1 para 1', () => {
    expect(
      converterLeitura({
        livro: 'Gênesis',
        capitulo: 1,
        versiculoInicio: 0,
        versiculoFim: 3,
      })?.versiculoInicio,
    ).toBe(1)
  })

  it('faz versículoFim virar o inicio quando vem menor', () => {
    const r = converterLeitura({
      livro: 'Gênesis',
      capitulo: 1,
      versiculoInicio: 10,
      versiculoFim: 5,
    })
    expect(r).toEqual({
      livro: 1,
      capitulo: 1,
      versiculoInicio: 10,
      versiculoFim: 10,
    })
  })

  it('trunca decimais que a IA às vezes devolve', () => {
    const r = converterLeitura({
      livro: 'Gênesis',
      capitulo: 1.7 as unknown as number,
      versiculoInicio: 2.9 as unknown as number,
      versiculoFim: 5.1 as unknown as number,
    })
    expect(r).toEqual({
      livro: 1,
      capitulo: 1,
      versiculoInicio: 2,
      versiculoFim: 5,
    })
  })
})

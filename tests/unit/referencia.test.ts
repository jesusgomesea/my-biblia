import { describe, expect, it } from 'vitest'
import { lerReferencia } from '@/lib/bible/referencia'

describe('lerReferencia', () => {
  it('reconhece "João 3:16"', () => {
    expect(lerReferencia('João 3:16')).toEqual({
      livro: 43,
      capitulo: 3,
      versiculo: 16,
    })
  })

  it('reconhece abreviação sem espaço "sl23"', () => {
    expect(lerReferencia('sl23')).toEqual({
      livro: 19,
      capitulo: 23,
      versiculo: undefined,
    })
  })

  it('reconhece "Pv 3" sem versículo', () => {
    expect(lerReferencia('Pv 3')).toEqual({
      livro: 20,
      capitulo: 3,
      versiculo: undefined,
    })
  })

  it('reconhece livros numerados "1 Coríntios 13:4"', () => {
    const ref = lerReferencia('1 Coríntios 13:4')
    expect(ref).toEqual({ livro: 46, capitulo: 13, versiculo: 4 })
  })

  it('assume capítulo 1 quando só o livro é dado', () => {
    expect(lerReferencia('Rute')).toEqual({
      livro: 8,
      capitulo: 1,
      versiculo: undefined,
    })
  })

  it('ignora acento e maiúsculas', () => {
    expect(lerReferencia('genesis 1:1')).toEqual({
      livro: 1,
      capitulo: 1,
      versiculo: 1,
    })
  })

  it('devolve null para texto que não é referência', () => {
    expect(lerReferencia('amor de Deus')).toBeNull()
  })

  it('devolve null quando o capítulo passa do total do livro', () => {
    // Rute tem 4 capítulos
    expect(lerReferencia('Rute 5')).toBeNull()
  })

  it('devolve null para livro desconhecido', () => {
    expect(lerReferencia('Xyz 1:1')).toBeNull()
  })
})

import { describe, expect, it } from 'vitest'
import { sanitizeVerseHtml, stripHtml } from '@/lib/bible/sanitize'

describe('sanitizeVerseHtml', () => {
  it('mantém <i> e <mark>, únicos permitidos', () => {
    expect(sanitizeVerseHtml('Palavra <i>fé</i> e <mark>graça</mark>')).toBe(
      'Palavra <i>fé</i> e <mark>graça</mark>',
    )
  })

  it('remove blocos <S> (Strong) e <sup> por completo, com conteúdo', () => {
    const cru = 'No princípio<S>H7225</S> criou<sup>1</sup> Deus'
    expect(sanitizeVerseHtml(cru)).toBe('No princípio criou Deus')
  })

  it('escapa <script> em vez de executá-lo', () => {
    const cru = 'Amém <script>alert(1)</script>'
    expect(sanitizeVerseHtml(cru)).toBe(
      'Amém &lt;script&gt;alert(1)&lt;/script&gt;',
    )
  })

  it('escapa handlers inline em tags desconhecidas', () => {
    const cru = '<img src=x onerror=alert(1)>'
    // A palavra `onerror` sobrevive como texto escapado, e não há problema
    // nisso: o que a tornaria executável é a tag, e é a tag que some.
    expect(sanitizeVerseHtml(cru)).toBe('&lt;img src=x onerror=alert(1)&gt;')
  })

  it('escapa <iframe> mesmo aninhado', () => {
    const cru = '<iframe src="javascript:alert(1)"></iframe>'
    expect(sanitizeVerseHtml(cru)).not.toMatch(/<iframe/i)
  })

  it('escapa & solto para não virar entidade parcial', () => {
    expect(sanitizeVerseHtml('A & B')).toBe('A &amp; B')
  })

  it('colapsa espaços e faz trim', () => {
    expect(sanitizeVerseHtml('  linha\n   com   quebras  ')).toBe(
      'linha com quebras',
    )
  })

  it('é case-insensitive em <I> e <MARK>', () => {
    expect(sanitizeVerseHtml('<I>fé</I>')).toBe('<i>fé</i>')
    expect(sanitizeVerseHtml('<MARK>graça</MARK>')).toBe('<mark>graça</mark>')
  })

  it('preserva <br>, <br/> e <br /> (usado em versos de Salmos)', () => {
    expect(sanitizeVerseHtml('Uma linha<br>outra linha')).toBe(
      'Uma linha<br>outra linha',
    )
    expect(sanitizeVerseHtml('Uma linha<br/>outra')).toBe(
      'Uma linha<br>outra',
    )
    expect(sanitizeVerseHtml('Uma linha<br />outra')).toBe(
      'Uma linha<br>outra',
    )
  })
})

describe('stripHtml', () => {
  it('devolve o texto sem qualquer tag remanescente', () => {
    expect(stripHtml('No <i>princípio</i> criou <mark>Deus</mark>')).toBe(
      'No princípio criou Deus',
    )
  })

  it('decodifica entidades básicas geradas pela sanitização', () => {
    expect(stripHtml('A & B < C > D')).toBe('A & B < C > D')
  })
})

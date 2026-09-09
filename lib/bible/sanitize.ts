/**
 * O texto vem de uma API externa e é renderizado como HTML, então nada pode
 * passar sem inspeção. A estratégia é escapar tudo e reintroduzir apenas as
 * poucas tags que têm valor de leitura.
 */

const DROPPED_BLOCKS = [
  /<S>[\s\S]*?<\/S>/gi, // números de Strong
  /<sup>[\s\S]*?<\/sup>/gi, // marcadores de nota de rodapé, sem a nota
]

const ALLOWED_PAIRED = ['i', 'mark'] as const
const ALLOWED_VOID = ['br'] as const

export function sanitizeVerseHtml(raw: string): string {
  let text = raw
  for (const pattern of DROPPED_BLOCKS) text = text.replace(pattern, '')

  text = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  for (const tag of ALLOWED_PAIRED) {
    text = text
      .replace(new RegExp(`&lt;${tag}&gt;`, 'gi'), `<${tag}>`)
      .replace(new RegExp(`&lt;/${tag}&gt;`, 'gi'), `</${tag}>`)
  }

  for (const tag of ALLOWED_VOID) {
    // Aceita <br>, <br/> e <br /> — todas as variações que a fonte devolve.
    text = text.replace(
      new RegExp(`&lt;${tag}\\s*\\/?&gt;`, 'gi'),
      `<${tag}>`,
    )
  }

  return text.replace(/\s+/g, ' ').trim()
}

export function stripHtml(raw: string): string {
  return sanitizeVerseHtml(raw)
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

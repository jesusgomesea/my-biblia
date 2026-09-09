import { acharLivro } from './livros'

export type Referencia = {
  livro: number
  capitulo: number
  versiculo?: number
}

/**
 * Reconhece "João 3:16", "Pv 3", "1 Coríntios 13:4" e "sl23".
 * Devolve null quando o termo não é uma referência — aí a busca é textual.
 */
export function lerReferencia(termo: string): Referencia | null {
  const partes = termo
    .trim()
    .match(/^([1-3]?\s*[^\d:]+?)\s*(\d+)?\s*(?::\s*(\d+))?$/)
  if (!partes) return null

  const livro = acharLivro(partes[1])
  if (!livro) return null

  const capitulo = partes[2] ? Number(partes[2]) : 1
  if (capitulo < 1 || capitulo > livro.capitulos) return null

  const versiculo = partes[3] ? Number(partes[3]) : undefined
  return { livro: livro.id, capitulo, versiculo }
}

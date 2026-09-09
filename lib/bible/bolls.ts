import linguasEstaticas from './linguas.json'
import { sanitizeVerseHtml } from './sanitize'
import type {
  BibleProvider,
  Book,
  Language,
  SearchResults,
  Verse,
} from './types'

const BASE = 'https://bolls.life'

/** Uma semana: o texto bíblico não muda, só o catálogo cresce de vez em quando. */
const REVALIDATE = 60 * 60 * 24 * 7

/** Ids de tradução entram na URL, então só aceitamos o formato que a fonte usa. */
function assertTranslation(id: string): string {
  if (!/^[A-Za-z0-9_-]{1,20}$/.test(id)) {
    throw new Error(`Tradução inválida: ${id}`)
  }
  return id
}

function assertNumber(value: number, max: number, label: string): number {
  if (!Number.isInteger(value) || value < 1 || value > max) {
    throw new Error(`${label} inválido: ${value}`)
  }
  return value
}

async function request<T>(path: string, revalidate = REVALIDATE): Promise<T> {
  const response = await fetch(`${BASE}${path}`, { next: { revalidate } })
  if (!response.ok) {
    throw new Error(`Bolls.life respondeu ${response.status} em ${path}`)
  }
  return response.json() as Promise<T>
}

type RawBook = { bookid: number; name: string; chapters: number }
type RawVerse = { verse: number; text: string }
type RawHit = { book: number; chapter: number; verse: number; text: string }
type RawSearch = { results: RawHit[] }

export const bolls: BibleProvider = {
  async listLanguages(): Promise<Language[]> {
    // Servido de um JSON versionado em vez de bater na fonte a cada leitura.
    // Atualização manual: `node scripts/atualizar-linguas.mjs`.
    return linguasEstaticas as Language[]
  },

  async listBooks(translation: string): Promise<Book[]> {
    const raw = await request<RawBook[]>(
      `/get-books/${assertTranslation(translation)}/`,
    )
    return raw.map((book) => ({
      id: book.bookid,
      name: book.name,
      chapters: book.chapters,
    }))
  },

  async getChapter(
    translation: string,
    book: number,
    chapter: number,
  ): Promise<Verse[]> {
    const path = `/get-text/${assertTranslation(translation)}/${assertNumber(
      book,
      66,
      'Livro',
    )}/${assertNumber(chapter, 150, 'Capítulo')}/`
    const raw = await request<RawVerse[]>(path)
    return raw.map((verse) => ({
      number: verse.verse,
      html: sanitizeVerseHtml(verse.text),
    }))
  },

  /**
   * A fonte faz busca difusa e mistura versículos que não contêm o termo. Só os
   * que ela marca com <mark> casaram de verdade, então pedimos um lote maior e
   * descartamos o resto. O campo `total` que ela devolve é o tamanho do pool
   * difuso (milhares, sempre o mesmo) e não serve para exibir.
   */
  async search(
    translation: string,
    query: string,
    limit = 50,
  ): Promise<SearchResults> {
    const desejado = assertNumber(limit, 100, 'Limite')
    const params = new URLSearchParams({
      search: query,
      limit: String(desejado * 2),
    })
    const raw = await request<RawSearch>(
      `/v2/find/${assertTranslation(translation)}?${params}`,
      60 * 60,
    )

    const casaram = raw.results.filter((hit) => hit.text.includes('<mark>'))
    return {
      truncado: casaram.length > desejado,
      hits: casaram.slice(0, desejado).map((hit) => ({
        book: hit.book,
        chapter: hit.chapter,
        verse: hit.verse,
        html: sanitizeVerseHtml(hit.text),
      })),
    }
  },
}

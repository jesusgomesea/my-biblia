export type Translation = {
  /** Sigla usada nas URLs da fonte. Ex.: "ARA", "KJV". */
  id: string
  name: string
  language: string
}

export type Language = {
  name: string
  translations: Translation[]
}

export type Book = {
  /** Numeração canônica de 1 (Gênesis) a 66 (Apocalipse). */
  id: number
  name: string
  chapters: number
}

export type Verse = {
  number: number
  /** HTML já sanitizado: apenas <i> e <mark> podem aparecer. */
  html: string
}

export type SearchHit = {
  book: number
  chapter: number
  verse: number
  /** HTML já sanitizado, com <mark> no trecho encontrado. */
  html: string
}

export type SearchResults = {
  hits: SearchHit[]
  total: number
}

export interface BibleProvider {
  listLanguages(): Promise<Language[]>
  listBooks(translation: string): Promise<Book[]>
  getChapter(translation: string, book: number, chapter: number): Promise<Verse[]>
  search(translation: string, query: string, limit?: number): Promise<SearchResults>
}

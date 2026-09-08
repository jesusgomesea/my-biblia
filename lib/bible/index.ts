import { bolls } from './bolls'
import type { BibleProvider } from './types'

/** Tradução aberta por padrão quando o usuário ainda não escolheu uma. */
export const TRADUCAO_PADRAO = 'ARA'

/** Trocar de fonte bíblica é trocar esta linha. */
export const bible: BibleProvider = bolls

export * from './types'
export * from './livros'
export { sanitizeVerseHtml, stripHtml } from './sanitize'

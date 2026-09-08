import { bolls } from './bolls'
import type { BibleProvider } from './types'

/** Trocar de fonte bíblica é trocar esta linha. */
export const bible: BibleProvider = bolls

export * from './types'
export { sanitizeVerseHtml, stripHtml } from './sanitize'

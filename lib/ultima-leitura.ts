'use client'

export type UltimaLeitura = {
  traducao: string
  livro: number
  capitulo: number
  quando: string
}

const CHAVE = 'my-biblia:ultima-leitura'

export function gravarUltimaLeitura(dados: Omit<UltimaLeitura, 'quando'>): void {
  if (typeof window === 'undefined') return
  try {
    const registro: UltimaLeitura = { ...dados, quando: new Date().toISOString() }
    window.localStorage.setItem(CHAVE, JSON.stringify(registro))
  } catch {
    // localStorage bloqueado; sem drama.
  }
}

export function lerUltimaLeitura(): UltimaLeitura | null {
  if (typeof window === 'undefined') return null
  try {
    const cru = window.localStorage.getItem(CHAVE)
    return cru ? (JSON.parse(cru) as UltimaLeitura) : null
  } catch {
    return null
  }
}

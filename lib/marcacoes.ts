'use client'

import { sincronizarDepois } from '@/lib/dados/nuvem'

export type Marcacao = {
  livro: number
  capitulo: number
  versiculo: number
  /** Tradução em que o versículo foi marcado, junto do texto daquele momento. */
  traducao: string
  html: string
  marcadoEm: string
}

const CHAVE = 'my-biblia:marcacoes'
const EVENTO = 'marcacoes-alteradas'

/** A referência não depende da tradução, então a marca aparece em qualquer uma. */
export function chaveDaMarcacao(
  livro: number,
  capitulo: number,
  versiculo: number,
): string {
  return `${livro}:${capitulo}:${versiculo}`
}

function ler(): Record<string, Marcacao> {
  if (typeof window === 'undefined') return {}
  try {
    const cru = window.localStorage.getItem(CHAVE)
    return cru ? (JSON.parse(cru) as Record<string, Marcacao>) : {}
  } catch {
    return {}
  }
}

function escrever(marcacoes: Record<string, Marcacao>): void {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(marcacoes))
  } catch {
    // localStorage indisponível; segue em memória.
  }
  window.dispatchEvent(new Event(EVENTO))
  sincronizarDepois()
}

export function listarMarcacoes(): Marcacao[] {
  return Object.values(ler()).sort(
    (a, b) =>
      a.livro - b.livro || a.capitulo - b.capitulo || a.versiculo - b.versiculo,
  )
}

export function chavesMarcadas(): Set<string> {
  return new Set(Object.keys(ler()))
}

export function alternarMarcacao(marcacao: Marcacao): void {
  const marcacoes = ler()
  const chave = chaveDaMarcacao(
    marcacao.livro,
    marcacao.capitulo,
    marcacao.versiculo,
  )
  if (marcacoes[chave]) delete marcacoes[chave]
  else marcacoes[chave] = marcacao
  escrever(marcacoes)
}

export function observarMarcacoes(aoMudar: () => void): () => void {
  window.addEventListener(EVENTO, aoMudar)
  return () => window.removeEventListener(EVENTO, aoMudar)
}

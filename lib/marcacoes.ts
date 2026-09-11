'use client'

import { sincronizarDepois } from '@/lib/dados/nuvem'

export const CORES = ['amarelo', 'rosa', 'azul', 'verde', 'roxo'] as const
export type CorMarcacao = (typeof CORES)[number]
export const COR_PADRAO: CorMarcacao = 'amarelo'

export type Marcacao = {
  livro: number
  capitulo: number
  versiculo: number
  /** Tradução em que o versículo foi marcado, junto do texto daquele momento. */
  traducao: string
  html: string
  marcadoEm: string
  /** Anotação pessoal, opcional. Marcações antigas nunca tiveram nota. */
  anotacao?: string
  anotadoEm?: string
  /** Cor do destaque. Marcações antigas nunca tiveram cor — tratamos como amarelo. */
  cor?: CorMarcacao
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

export function buscarMarcacao(
  livro: number,
  capitulo: number,
  versiculo: number,
): Marcacao | undefined {
  return ler()[chaveDaMarcacao(livro, capitulo, versiculo)]
}

export function trocarCor(
  livro: number,
  capitulo: number,
  versiculo: number,
  cor: CorMarcacao,
): void {
  const marcacoes = ler()
  const chave = chaveDaMarcacao(livro, capitulo, versiculo)
  const existente = marcacoes[chave]
  if (!existente) return
  marcacoes[chave] = { ...existente, cor }
  escrever(marcacoes)
}

/**
 * Grava a anotação. Se a marcação ainda não existe, cria uma (o texto precisa
 * vir do chamador — a nota não faz sentido sem a captura do versículo).
 * Nota vazia limpa `anotacao` e `anotadoEm`, preservando a marcação.
 */
export function salvarAnotacao(
  base: Omit<Marcacao, 'marcadoEm' | 'anotacao' | 'anotadoEm'>,
  anotacao: string,
): void {
  const marcacoes = ler()
  const chave = chaveDaMarcacao(base.livro, base.capitulo, base.versiculo)
  const existente = marcacoes[chave]
  const texto = anotacao.trim()
  const agora = new Date().toISOString()

  if (existente) {
    if (texto) {
      marcacoes[chave] = { ...existente, anotacao: texto, anotadoEm: agora }
    } else {
      const { anotacao: _a, anotadoEm: _q, ...resto } = existente
      marcacoes[chave] = resto
    }
  } else if (texto) {
    // Anotação em versículo ainda não marcado — marca automaticamente.
    marcacoes[chave] = {
      ...base,
      marcadoEm: agora,
      anotacao: texto,
      anotadoEm: agora,
    }
  } else {
    return // Nota vazia num versículo não marcado: no-op.
  }
  escrever(marcacoes)
}

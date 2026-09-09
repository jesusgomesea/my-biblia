'use client'

import { sincronizarDepois } from '@/lib/dados/nuvem'
import type { PedidoDePlano, Plano } from './tipos'

const CHAVE = 'my-biblia:planos'

function ler(): Plano[] {
  if (typeof window === 'undefined') return []
  try {
    const cru = window.localStorage.getItem(CHAVE)
    return cru ? (JSON.parse(cru) as Plano[]) : []
  } catch {
    return []
  }
}

function escrever(planos: Plano[]): void {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(planos))
  } catch {
    // localStorage indisponível (quota, modo privado); segue em memória.
  }
  window.dispatchEvent(new Event('planos-alterados'))
  // Se o usuário estiver logado, também salva no servidor (401 é ignorado).
  sincronizarDepois()
}

export function listarPlanos(): Plano[] {
  return ler().sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
}

export function buscarPlano(id: string): Plano | undefined {
  return ler().find((plano) => plano.id === id)
}

export function salvarPlano(
  pedido: PedidoDePlano,
  gerado: Pick<Plano, 'titulo' | 'resumo' | 'roteiro'>,
): Plano {
  const plano: Plano = {
    ...pedido,
    ...gerado,
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
    concluidos: [],
  }
  escrever([...ler(), plano])
  return plano
}

export function alternarDiaConcluido(id: string, dia: number): void {
  escrever(
    ler().map((plano) =>
      plano.id === id
        ? {
            ...plano,
            concluidos: plano.concluidos.includes(dia)
              ? plano.concluidos.filter((d) => d !== dia)
              : [...plano.concluidos, dia],
          }
        : plano,
    ),
  )
}

export function removerPlano(id: string): void {
  escrever(ler().filter((plano) => plano.id !== id))
}

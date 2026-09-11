'use client'

import { sincronizarDepois } from '@/lib/dados/nuvem'

/**
 * Historico simples de dias com atividade: cada YYYY-MM-DD entra uma vez.
 * Alimenta o streak e o mini-calendario da tela de planos. Registrado tanto
 * ao marcar um versiculo quanto ao concluir um dia de plano — o objetivo e
 * "voltei hoje", nao "quantas coisas fiz".
 */
const CHAVE = 'my-biblia:atividade'
const EVENTO = 'atividade-alterada'

function hoje(): string {
  // toISOString() usa UTC — em fuso negativo cai no dia anterior de madrugada,
  // por isso montamos a partir dos componentes locais.
  return chaveDoDia(new Date())
}

function ler(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const cru = window.localStorage.getItem(CHAVE)
    return cru ? (JSON.parse(cru) as string[]) : []
  } catch {
    return []
  }
}

function escrever(datas: string[]): void {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(datas))
  } catch {
    // localStorage bloqueado; segue em memoria.
  }
  window.dispatchEvent(new Event(EVENTO))
  sincronizarDepois()
}

export function registrarAtividadeHoje(): void {
  const chave = hoje()
  const datas = ler()
  if (datas.includes(chave)) return
  escrever([...datas, chave].sort())
}

export function listarAtividade(): string[] {
  return ler()
}

export function observarAtividade(aoMudar: () => void): () => void {
  window.addEventListener(EVENTO, aoMudar)
  return () => window.removeEventListener(EVENTO, aoMudar)
}

/**
 * Streak = quantos dias consecutivos ate hoje ou ate ontem (permite entrar no
 * app e ainda contar o streak antes de fazer algo hoje). Zero se nem hoje nem
 * ontem tiveram atividade.
 */
export function calcularStreak(datas: string[], agora = new Date()): number {
  const set = new Set(datas)
  const dia = new Date(agora)
  dia.setHours(0, 0, 0, 0)

  // Se hoje nao tem atividade, tenta comecar de ontem.
  if (!set.has(chaveDoDia(dia))) {
    dia.setDate(dia.getDate() - 1)
    if (!set.has(chaveDoDia(dia))) return 0
  }

  let streak = 0
  while (set.has(chaveDoDia(dia))) {
    streak++
    dia.setDate(dia.getDate() - 1)
  }
  return streak
}

function chaveDoDia(dia: Date): string {
  const y = dia.getFullYear()
  const m = String(dia.getMonth() + 1).padStart(2, '0')
  const d = String(dia.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

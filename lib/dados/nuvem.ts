'use client'

import type { Marcacao } from '@/lib/marcacoes'
import type { Plano } from '@/lib/planos/tipos'

/**
 * Camada fina para o cliente conversar com /api/dados. Trata 401 (não logado)
 * como "sem sessão" em vez de erro — o app segue funcionando via localStorage.
 */

const CHAVE_PLANOS = 'my-biblia:planos'
const CHAVE_MARCACOES = 'my-biblia:marcacoes'

export type Snapshot = {
  planos: Plano[]
  marcacoes: Record<string, Marcacao>
}

function lerLocal(): Snapshot {
  try {
    const planos = JSON.parse(
      window.localStorage.getItem(CHAVE_PLANOS) ?? '[]',
    ) as Plano[]
    const marcacoes = JSON.parse(
      window.localStorage.getItem(CHAVE_MARCACOES) ?? '{}',
    ) as Record<string, Marcacao>
    return { planos, marcacoes }
  } catch {
    return { planos: [], marcacoes: {} }
  }
}

function gravarLocal(snapshot: Snapshot): void {
  try {
    window.localStorage.setItem(CHAVE_PLANOS, JSON.stringify(snapshot.planos))
    window.localStorage.setItem(
      CHAVE_MARCACOES,
      JSON.stringify(snapshot.marcacoes),
    )
  } catch {
    // localStorage cheio ou bloqueado: seguimos apenas em memória.
  }
}

/**
 * `flag` marca no próprio localStorage se o usuário atual já sincronizou
 * o snapshot inicial da nuvem para este navegador — evita ficar puxando a
 * cada refresh.
 */
const CHAVE_ULTIMO_USUARIO = 'my-biblia:usuario-sincronizado'

function usuarioJaSincronizado(userId: string): boolean {
  return window.localStorage.getItem(CHAVE_ULTIMO_USUARIO) === userId
}

function marcarUsuarioSincronizado(userId: string): void {
  window.localStorage.setItem(CHAVE_ULTIMO_USUARIO, userId)
}

/**
 * Ao logar pela primeira vez neste navegador, decide quem vence:
 * - Servidor tem dados: baixa e substitui o local.
 * - Servidor vazio: sobe o que estiver no local.
 * O caminho ignora conflitos por simplicidade — o servidor vira a fonte da
 * verdade a partir daí.
 */
export async function sincronizarInicial(userId: string): Promise<void> {
  if (usuarioJaSincronizado(userId)) return

  const resposta = await fetch('/api/dados', { credentials: 'include' })
  if (resposta.status === 401) return
  if (!resposta.ok) throw new Error(`GET /api/dados ${resposta.status}`)

  const remoto = (await resposta.json()) as Snapshot
  const local = lerLocal()

  const remotoTemAlgo =
    remoto.planos.length > 0 || Object.keys(remoto.marcacoes).length > 0

  if (remotoTemAlgo) {
    gravarLocal(remoto)
    window.dispatchEvent(new Event('planos-alterados'))
    window.dispatchEvent(new Event('marcacoes-alteradas'))
  } else {
    await enviar(local)
  }

  marcarUsuarioSincronizado(userId)
}

/** Envia snapshot inteiro. Sem retry — chamador ignora falha silenciosamente. */
export async function enviar(snapshot: Snapshot): Promise<void> {
  const resposta = await fetch('/api/dados', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(snapshot),
  })
  if (resposta.status === 401) return
  if (!resposta.ok) throw new Error(`PUT /api/dados ${resposta.status}`)
}

/**
 * Chamado a cada escrita local. Se ninguém está logado a rota devolve 401
 * e a promessa simplesmente resolve — sem barulho no console.
 */
export function sincronizarDepois(): void {
  const snapshot = lerLocal()
  enviar(snapshot).catch(() => {
    // Off-line ou 401: dados seguem no localStorage; próxima escrita tenta de novo.
  })
}

export function limparMarcadorSincronizacao(): void {
  try {
    window.localStorage.removeItem(CHAVE_ULTIMO_USUARIO)
  } catch {
    // ignora
  }
}

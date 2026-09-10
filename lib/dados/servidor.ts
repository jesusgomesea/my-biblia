import { getStore } from '@netlify/blobs'
import type { Plano } from '@/lib/planos/tipos'
import type { Marcacao } from '@/lib/marcacoes'

/**
 * Um blob por usuário, chaveado pelo id do Netlify Identity. Guarda tudo que ele viu
 * sentido em salvar: planos e marcações. O formato é pequeno o bastante para
 * caber num só objeto e ainda dar bem menos que o teto por blob do Netlify.
 */
export type DadosDoUsuario = {
  planos: Plano[]
  marcacoes: Record<string, Marcacao>
}

const NOME_STORE = 'usuarios'

/**
 * Em produção o Netlify injeta o token automaticamente. Em `next dev` local
 * o store não existe, então esta função vai lançar; use `netlify dev` para
 * testar auth+sync localmente.
 */
function abrirStore() {
  return getStore({ name: NOME_STORE, consistency: 'strong' })
}

export async function lerDados(userId: string): Promise<DadosDoUsuario> {
  const store = abrirStore()
  const dados = await store.get(userId, { type: 'json' })
  if (dados) return dados as DadosDoUsuario
  return { planos: [], marcacoes: {} }
}

export async function gravarDados(
  userId: string,
  dados: DadosDoUsuario,
): Promise<void> {
  const store = abrirStore()
  await store.setJSON(userId, dados)
}

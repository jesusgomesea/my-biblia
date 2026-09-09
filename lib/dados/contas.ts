import { getStore } from '@netlify/blobs'
import bcrypt from 'bcryptjs'

/**
 * Store separado dos dados do usuário — assim uma consulta de login não puxa
 * planos e marcações junto. Chave: email normalizado. Valor: registro abaixo.
 */
const NOME_STORE = 'contas'

const CUSTO_BCRYPT = 10
const SENHA_MIN = 8
const SENHA_MAX = 200

export type Conta = {
  id: string
  email: string
  senhaHash: string
  criadoEm: string
}

export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function emailValido(email: string): boolean {
  // Validação intencionalmente conservadora — apenas para bloquear lixo.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

export function senhaValida(senha: string): boolean {
  return (
    typeof senha === 'string' &&
    senha.length >= SENHA_MIN &&
    senha.length <= SENHA_MAX
  )
}

function abrir() {
  return getStore({ name: NOME_STORE, consistency: 'strong' })
}

export async function buscarConta(email: string): Promise<Conta | null> {
  const store = abrir()
  const conta = await store.get(normalizarEmail(email), { type: 'json' })
  return (conta as Conta | null) ?? null
}

export type ResultadoCadastro =
  | { ok: true; conta: Conta }
  | { ok: false; motivo: 'email-invalido' | 'senha-curta' | 'ja-existe' }

export async function criarConta(
  email: string,
  senha: string,
): Promise<ResultadoCadastro> {
  const emailNormalizado = normalizarEmail(email)

  if (!emailValido(emailNormalizado)) return { ok: false, motivo: 'email-invalido' }
  if (!senhaValida(senha)) return { ok: false, motivo: 'senha-curta' }

  const existente = await buscarConta(emailNormalizado)
  if (existente) return { ok: false, motivo: 'ja-existe' }

  const conta: Conta = {
    id: crypto.randomUUID(),
    email: emailNormalizado,
    senhaHash: await bcrypt.hash(senha, CUSTO_BCRYPT),
    criadoEm: new Date().toISOString(),
  }

  await abrir().setJSON(emailNormalizado, conta)
  return { ok: true, conta }
}

export async function verificarSenha(
  email: string,
  senha: string,
): Promise<Conta | null> {
  if (!emailValido(email) || !senhaValida(senha)) return null

  const conta = await buscarConta(email)
  if (!conta) return null

  const bate = await bcrypt.compare(senha, conta.senhaHash)
  return bate ? conta : null
}

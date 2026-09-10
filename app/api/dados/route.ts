import { getUser } from '@netlify/identity'
import { gravarDados, lerDados, type DadosDoUsuario } from '@/lib/dados/servidor'

/**
 * `getUser()` le o cookie `nf_jwt` da requisicao e valida contra o Identity.
 * Devolve null em qualquer falha, entao ausencia de usuario e sempre 401.
 */

/** Retorna os dados do usuário logado. 401 se não estiver autenticado. */
export async function GET() {
  const usuario = await getUser()
  if (!usuario) {
    return Response.json({ erro: 'Não autenticado' }, { status: 401 })
  }

  try {
    const dados = await lerDados(usuario.id)
    return Response.json(dados)
  } catch (erro) {
    console.error('Falha ao ler dados do usuário:', erro)
    return Response.json({ erro: 'Falha ao ler dados' }, { status: 500 })
  }
}

/** Substitui o snapshot do usuário. Escrita atômica, sem merge. */
export async function PUT(request: Request) {
  const usuario = await getUser()
  if (!usuario) {
    return Response.json({ erro: 'Não autenticado' }, { status: 401 })
  }

  const corpo = (await request.json().catch(() => null)) as DadosDoUsuario | null
  if (!corpo || typeof corpo !== 'object') {
    return Response.json({ erro: 'Corpo inválido' }, { status: 400 })
  }

  const dados: DadosDoUsuario = {
    planos: Array.isArray(corpo.planos) ? corpo.planos : [],
    marcacoes:
      corpo.marcacoes && typeof corpo.marcacoes === 'object'
        ? corpo.marcacoes
        : {},
  }

  try {
    await gravarDados(usuario.id, dados)
    return Response.json({ ok: true })
  } catch (erro) {
    console.error('Falha ao gravar dados do usuário:', erro)
    return Response.json({ erro: 'Falha ao gravar' }, { status: 500 })
  }
}

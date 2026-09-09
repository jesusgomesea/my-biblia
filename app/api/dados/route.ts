import { auth } from '@/auth'
import { gravarDados, lerDados, type DadosDoUsuario } from '@/lib/dados/servidor'

/** Retorna os dados do usuário logado. 401 se não estiver autenticado. */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ erro: 'Não autenticado' }, { status: 401 })
  }

  try {
    const dados = await lerDados(session.user.id)
    return Response.json(dados)
  } catch (erro) {
    console.error('Falha ao ler dados do usuário:', erro)
    return Response.json({ erro: 'Falha ao ler dados' }, { status: 500 })
  }
}

/** Substitui o snapshot do usuário. Escrita atômica, sem merge. */
export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
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
    await gravarDados(session.user.id, dados)
    return Response.json({ ok: true })
  } catch (erro) {
    console.error('Falha ao gravar dados do usuário:', erro)
    return Response.json({ erro: 'Falha ao gravar' }, { status: 500 })
  }
}

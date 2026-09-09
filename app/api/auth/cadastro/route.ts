import { criarConta } from '@/lib/dados/contas'

const MENSAGENS = {
  'email-invalido': 'Digite um email válido.',
  'senha-curta': 'A senha precisa ter pelo menos 8 caracteres.',
  'ja-existe': 'Já existe uma conta com este email.',
} as const

export async function POST(request: Request) {
  const corpo = await request.json().catch(() => null)
  if (!corpo || typeof corpo !== 'object') {
    return Response.json({ erro: 'Corpo inválido' }, { status: 400 })
  }

  const email = String((corpo as { email?: unknown }).email ?? '')
  const senha = String((corpo as { senha?: unknown }).senha ?? '')

  try {
    const resultado = await criarConta(email, senha)
    if (!resultado.ok) {
      return Response.json(
        { erro: MENSAGENS[resultado.motivo] },
        { status: resultado.motivo === 'ja-existe' ? 409 : 400 },
      )
    }
    return Response.json({ ok: true })
  } catch (erro) {
    console.error('Falha no cadastro:', erro)
    return Response.json(
      { erro: 'Não foi possível criar a conta agora. Tente de novo em instantes.' },
      { status: 500 },
    )
  }
}

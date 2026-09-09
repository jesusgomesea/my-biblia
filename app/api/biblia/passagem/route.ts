import type { NextRequest } from 'next/server'
import { bible } from '@/lib/bible'

/**
 * As telas de plano vivem no navegador (o plano está no localStorage), então
 * precisam buscar o texto por aqui em vez de renderizá-lo no servidor.
 */
export async function GET(request: NextRequest) {
  const busca = request.nextUrl.searchParams
  const traducao = busca.get('traducao') ?? ''
  const livro = Number(busca.get('livro'))
  const capitulo = Number(busca.get('capitulo'))
  const inicio = Number(busca.get('inicio') ?? 1)
  const fim = Number(busca.get('fim') ?? 0)

  try {
    const capituloInteiro = await bible.getChapter(traducao, livro, capitulo)
    const versiculos = capituloInteiro.filter(
      (versiculo) =>
        versiculo.number >= inicio && (fim < inicio || versiculo.number <= fim),
    )
    return Response.json({ versiculos })
  } catch {
    return Response.json({ erro: 'Passagem não encontrada.' }, { status: 404 })
  }
}

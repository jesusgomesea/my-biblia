import type { NextRequest } from 'next/server'
import { gerarPlano } from '@/lib/planos/gerar'
import { LIMITES, type PedidoDePlano } from '@/lib/planos/tipos'

function entre(valor: unknown, min: number, max: number): number | null {
  const numero = Math.trunc(Number(valor))
  return Number.isFinite(numero) && numero >= min && numero <= max ? numero : null
}

/** O corpo vem do navegador aberto, então nada aqui é confiável. */
function lerPedido(corpo: unknown): PedidoDePlano | string {
  const dados = corpo as Record<string, unknown>

  const temas = Array.isArray(dados?.temas)
    ? dados.temas
        .filter((t): t is string => typeof t === 'string')
        .map((t) => t.trim().slice(0, 60))
        .filter(Boolean)
        .slice(0, LIMITES.temas.max)
    : []
  if (temas.length < LIMITES.temas.min) return 'Informe ao menos um tema.'

  const dias = entre(dados?.dias, LIMITES.dias.min, LIMITES.dias.max)
  if (dias === null) {
    return `A duração deve ficar entre ${LIMITES.dias.min} e ${LIMITES.dias.max} dias.`
  }

  const minutosPorDia = entre(
    dados?.minutosPorDia,
    LIMITES.minutosPorDia.min,
    LIMITES.minutosPorDia.max,
  )
  if (minutosPorDia === null) {
    return `O tempo diário deve ficar entre ${LIMITES.minutosPorDia.min} e ${LIMITES.minutosPorDia.max} minutos.`
  }

  const traducao = String(dados?.traducao ?? '')
  if (!/^[A-Za-z0-9_-]{1,20}$/.test(traducao)) return 'Tradução inválida.'

  return { temas, dias, minutosPorDia, traducao }
}

export async function POST(request: NextRequest) {
  const pedido = lerPedido(await request.json().catch(() => null))
  if (typeof pedido === 'string') {
    return Response.json({ erro: pedido }, { status: 400 })
  }

  try {
    const plano = await gerarPlano(pedido)
    return Response.json(plano)
  } catch (erro) {
    console.error('Falha ao gerar plano:', erro)
    return Response.json(
      { erro: 'Não foi possível montar o plano agora. Tente de novo em instantes.' },
      { status: 502 },
    )
  }
}

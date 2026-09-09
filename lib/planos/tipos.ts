export type Leitura = {
  /** Id canônico do livro (1 a 66). */
  livro: number
  capitulo: number
  versiculoInicio: number
  versiculoFim: number
}

export type DiaDoPlano = {
  dia: number
  foco: string
  reflexao: string
  leituras: Leitura[]
}

export type PedidoDePlano = {
  temas: string[]
  dias: number
  minutosPorDia: number
  traducao: string
}

export type Plano = PedidoDePlano & {
  id: string
  titulo: string
  resumo: string
  criadoEm: string
  roteiro: DiaDoPlano[]
  /** Dias já marcados como concluídos. */
  concluidos: number[]
}

export const LIMITES = {
  temas: { min: 1, max: 5 },
  dias: { min: 1, max: 90 },
  minutosPorDia: { min: 5, max: 120 },
} as const

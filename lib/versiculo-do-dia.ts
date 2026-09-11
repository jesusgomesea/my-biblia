import type { Leitura } from '@/lib/planos/tipos'

/**
 * Lista curada de trechos "citaveis" — os que a maioria dos leitores de
 * biblia em portugues reconhece. Sorteio aleatorio pela biblia toda cairia em
 * genealogias na maior parte das vezes; uma lista curada mantem o valor da
 * home. Mais itens podem ser acrescentados sem regra especial: o indice do dia
 * cicla pelo tamanho.
 */
const VERSICULOS: Leitura[] = [
  { livro: 19, capitulo: 23, versiculoInicio: 1, versiculoFim: 1 },
  { livro: 19, capitulo: 23, versiculoInicio: 4, versiculoFim: 4 },
  { livro: 19, capitulo: 27, versiculoInicio: 1, versiculoFim: 1 },
  { livro: 19, capitulo: 34, versiculoInicio: 8, versiculoFim: 8 },
  { livro: 19, capitulo: 37, versiculoInicio: 5, versiculoFim: 5 },
  { livro: 19, capitulo: 42, versiculoInicio: 1, versiculoFim: 1 },
  { livro: 19, capitulo: 46, versiculoInicio: 1, versiculoFim: 1 },
  { livro: 19, capitulo: 46, versiculoInicio: 10, versiculoFim: 10 },
  { livro: 19, capitulo: 91, versiculoInicio: 1, versiculoFim: 2 },
  { livro: 19, capitulo: 118, versiculoInicio: 24, versiculoFim: 24 },
  { livro: 19, capitulo: 121, versiculoInicio: 1, versiculoFim: 2 },
  { livro: 19, capitulo: 139, versiculoInicio: 14, versiculoFim: 14 },
  { livro: 20, capitulo: 3, versiculoInicio: 5, versiculoFim: 6 },
  { livro: 20, capitulo: 4, versiculoInicio: 23, versiculoFim: 23 },
  { livro: 20, capitulo: 16, versiculoInicio: 3, versiculoFim: 3 },
  { livro: 20, capitulo: 22, versiculoInicio: 6, versiculoFim: 6 },
  { livro: 20, capitulo: 27, versiculoInicio: 17, versiculoFim: 17 },
  { livro: 23, capitulo: 26, versiculoInicio: 3, versiculoFim: 3 },
  { livro: 23, capitulo: 40, versiculoInicio: 31, versiculoFim: 31 },
  { livro: 23, capitulo: 41, versiculoInicio: 10, versiculoFim: 10 },
  { livro: 23, capitulo: 53, versiculoInicio: 5, versiculoFim: 5 },
  { livro: 24, capitulo: 29, versiculoInicio: 11, versiculoFim: 11 },
  { livro: 24, capitulo: 33, versiculoInicio: 3, versiculoFim: 3 },
  { livro: 40, capitulo: 5, versiculoInicio: 16, versiculoFim: 16 },
  { livro: 40, capitulo: 6, versiculoInicio: 33, versiculoFim: 33 },
  { livro: 40, capitulo: 11, versiculoInicio: 28, versiculoFim: 30 },
  { livro: 43, capitulo: 1, versiculoInicio: 1, versiculoFim: 1 },
  { livro: 43, capitulo: 3, versiculoInicio: 16, versiculoFim: 16 },
  { livro: 43, capitulo: 14, versiculoInicio: 6, versiculoFim: 6 },
  { livro: 43, capitulo: 14, versiculoInicio: 27, versiculoFim: 27 },
  { livro: 43, capitulo: 16, versiculoInicio: 33, versiculoFim: 33 },
  { livro: 45, capitulo: 5, versiculoInicio: 8, versiculoFim: 8 },
  { livro: 45, capitulo: 8, versiculoInicio: 28, versiculoFim: 28 },
  { livro: 45, capitulo: 12, versiculoInicio: 2, versiculoFim: 2 },
  { livro: 46, capitulo: 10, versiculoInicio: 13, versiculoFim: 13 },
  { livro: 46, capitulo: 13, versiculoInicio: 4, versiculoFim: 7 },
  { livro: 47, capitulo: 5, versiculoInicio: 17, versiculoFim: 17 },
  { livro: 47, capitulo: 12, versiculoInicio: 9, versiculoFim: 9 },
  { livro: 48, capitulo: 5, versiculoInicio: 22, versiculoFim: 23 },
  { livro: 49, capitulo: 2, versiculoInicio: 8, versiculoFim: 9 },
  { livro: 50, capitulo: 4, versiculoInicio: 6, versiculoFim: 7 },
  { livro: 50, capitulo: 4, versiculoInicio: 8, versiculoFim: 8 },
  { livro: 50, capitulo: 4, versiculoInicio: 13, versiculoFim: 13 },
  { livro: 51, capitulo: 3, versiculoInicio: 23, versiculoFim: 23 },
  { livro: 52, capitulo: 5, versiculoInicio: 16, versiculoFim: 18 },
  { livro: 55, capitulo: 1, versiculoInicio: 7, versiculoFim: 7 },
  { livro: 55, capitulo: 3, versiculoInicio: 16, versiculoFim: 17 },
  { livro: 59, capitulo: 1, versiculoInicio: 22, versiculoFim: 22 },
  { livro: 60, capitulo: 5, versiculoInicio: 7, versiculoFim: 7 },
  { livro: 62, capitulo: 4, versiculoInicio: 19, versiculoFim: 19 },
  { livro: 66, capitulo: 3, versiculoInicio: 20, versiculoFim: 20 },
]

/**
 * Indice deterministico por data em UTC — todos os visitantes veem o mesmo
 * versiculo no mesmo dia, o que casa com o cache de 7 dias do provider.
 */
function diasDesdeEpoca(agora = new Date()): number {
  return Math.floor(agora.getTime() / 86_400_000)
}

export function versiculoDoDia(agora = new Date()): Leitura {
  return VERSICULOS[diasDesdeEpoca(agora) % VERSICULOS.length]
}

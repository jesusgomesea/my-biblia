import type { CorMarcacao } from './marcacoes'

/**
 * Nome curto para leitores de tela e para o titulo do botao. As cores em si
 * moram em CSS (`--marca-*`) para acompanhar o tema claro/escuro sem duplicar
 * palette em JS.
 */
export const ROTULO_DA_COR: Record<CorMarcacao, string> = {
  amarelo: 'Amarelo',
  rosa: 'Rosa',
  azul: 'Azul',
  verde: 'Verde',
  roxo: 'Roxo',
}

export function corDeMarcacao(cor: CorMarcacao): string {
  return `var(--marca-${cor})`
}

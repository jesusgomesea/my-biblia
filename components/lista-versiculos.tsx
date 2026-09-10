'use client'

import { useEffect, useState } from 'react'
import { livroPorId, stripHtml, type Verse } from '@/lib/bible'
import {
  alternarMarcacao,
  chaveDaMarcacao,
  chavesMarcadas,
  observarMarcacoes,
} from '@/lib/marcacoes'

export default function ListaVersiculos({
  versiculos,
  traducao,
  livro,
  capitulo,
}: {
  versiculos: Verse[]
  traducao: string
  livro: number
  capitulo: number
}) {
  const [marcadas, setMarcadas] = useState<Set<string>>(new Set())
  /** Numero do versiculo copiado por ultimo — vira ✓ por um instante. */
  const [copiado, setCopiado] = useState<number | null>(null)

  useEffect(() => {
    const atualizar = () => setMarcadas(chavesMarcadas())
    atualizar()
    return observarMarcacoes(atualizar)
  }, [])

  const nomeDoLivro = livroPorId(livro)?.nome ?? `Livro ${livro}`

  async function copiar(versiculo: Verse) {
    const texto = formatarParaCompartilhar({
      livro: nomeDoLivro,
      capitulo,
      versiculo: versiculo.number,
      traducao,
      html: versiculo.html,
    })
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(versiculo.number)
      window.setTimeout(() => {
        setCopiado((atual) => (atual === versiculo.number ? null : atual))
      }, 1500)
    } catch {
      // navegadores antigos ou sem permissao: sem feedback e melhor que erro na tela.
    }
  }

  return (
    <article className="mt-6 space-y-2 font-serif text-lg/8">
      {versiculos.map((versiculo) => {
        const marcado = marcadas.has(
          chaveDaMarcacao(livro, capitulo, versiculo.number),
        )
        const foiCopiado = copiado === versiculo.number
        return (
          <p
            key={versiculo.number}
            id={`v${versiculo.number}`}
            className={`group flex scroll-mt-6 items-start gap-3 rounded-md px-2 py-1 transition-colors ${
              marcado ? 'bg-accent-soft' : ''
            }`}
          >
            <button
              type="button"
              title={marcado ? 'Remover marcação' : 'Marcar versículo'}
              onClick={() =>
                alternarMarcacao({
                  livro,
                  capitulo,
                  versiculo: versiculo.number,
                  traducao,
                  html: versiculo.html,
                  marcadoEm: new Date().toISOString(),
                })
              }
              className={`relative w-7 shrink-0 self-start pt-1.5 text-right font-sans text-xs after:absolute after:-inset-x-2 after:-inset-y-3 after:content-[''] ${
                marcado ? 'text-accent' : 'text-muted hover:text-accent'
              }`}
            >
              {versiculo.number}
            </button>

            {/* Sanitizado em lib/bible/sanitize.ts: só <i> e <mark> sobrevivem. */}
            <span
              className="min-w-0 flex-1"
              dangerouslySetInnerHTML={{ __html: versiculo.html }}
            />

            <button
              type="button"
              onClick={() => copiar(versiculo)}
              aria-label={`Copiar ${nomeDoLivro} ${capitulo}:${versiculo.number}`}
              title={foiCopiado ? 'Copiado!' : 'Copiar com referência'}
              className={`shrink-0 self-start rounded p-1.5 font-sans transition-opacity hover:text-accent hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent
                ${
                  foiCopiado
                    ? 'text-accent opacity-100'
                    : 'text-muted opacity-60 sm:opacity-0 sm:group-hover:opacity-60'
                }`}
            >
              {foiCopiado ? <IconeCheck /> : <IconeCopiar />}
            </button>
          </p>
        )
      })}
    </article>
  )
}

/**
 * Formato pensado para colar em WhatsApp/Notas/redes: texto entre aspas,
 * seguido da referencia. `stripHtml` remove <i>/<mark>, mantendo so o texto.
 */
function formatarParaCompartilhar({
  livro,
  capitulo,
  versiculo,
  traducao,
  html,
}: {
  livro: string
  capitulo: number
  versiculo: number
  traducao: string
  html: string
}): string {
  const texto = stripHtml(html)
  return `"${texto}" — ${livro} ${capitulo}:${versiculo} (${traducao})`
}

function IconeCopiar() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function IconeCheck() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

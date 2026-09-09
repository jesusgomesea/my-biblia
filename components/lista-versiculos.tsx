'use client'

import { useEffect, useState } from 'react'
import type { Verse } from '@/lib/bible'
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

  useEffect(() => {
    const atualizar = () => setMarcadas(chavesMarcadas())
    atualizar()
    return observarMarcacoes(atualizar)
  }, [])

  return (
    <article className="mt-6 space-y-2 font-serif text-lg/8">
      {versiculos.map((versiculo) => {
        const marcado = marcadas.has(
          chaveDaMarcacao(livro, capitulo, versiculo.number),
        )
        return (
          <p
            key={versiculo.number}
            id={`v${versiculo.number}`}
            className={`flex scroll-mt-6 gap-3 rounded-md px-2 py-1 transition-colors ${
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
            <span dangerouslySetInnerHTML={{ __html: versiculo.html }} />
          </p>
        )
      })}
    </article>
  )
}

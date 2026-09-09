'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { descreverLeitura } from '@/lib/planos/gerar'
import type { Leitura } from '@/lib/planos/tipos'
import type { Verse } from '@/lib/bible'

export default function Passagem({
  leitura,
  traducao,
}: {
  leitura: Leitura
  traducao: string
}) {
  const [versiculos, setVersiculos] = useState<Verse[] | null>(null)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    const busca = new URLSearchParams({
      traducao,
      livro: String(leitura.livro),
      capitulo: String(leitura.capitulo),
      inicio: String(leitura.versiculoInicio),
      fim: String(leitura.versiculoFim),
    })
    let ativo = true
    fetch(`/api/biblia/passagem?${busca}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => ativo && setVersiculos(d.versiculos))
      .catch(() => ativo && setErro(true))
    return () => {
      ativo = false
    }
  }, [leitura, traducao])

  return (
    <section className="mt-5">
      <Link
        href={`/biblia/${traducao}/${leitura.livro}/${leitura.capitulo}`}
        className="text-sm font-medium text-accent hover:underline"
      >
        {descreverLeitura(leitura)}
      </Link>

      {erro ? (
        <p className="mt-2 text-sm text-muted">
          Não foi possível carregar esta passagem.
        </p>
      ) : versiculos === null ? (
        <p className="mt-2 text-sm text-muted">Carregando…</p>
      ) : (
        <div className="mt-2 space-y-2 font-serif text-base/7">
          {versiculos.map((versiculo) => (
            <p key={versiculo.number} className="flex gap-2.5">
              <span className="w-6 shrink-0 pt-1 text-right font-sans text-xs text-muted">
                {versiculo.number}
              </span>
              {/* Sanitizado em lib/bible/sanitize.ts. */}
              <span dangerouslySetInnerHTML={{ __html: versiculo.html }} />
            </p>
          ))}
        </div>
      )}
    </section>
  )
}

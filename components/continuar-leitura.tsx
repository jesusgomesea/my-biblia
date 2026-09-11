'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { livroPorId } from '@/lib/bible'
import { lerUltimaLeitura, type UltimaLeitura } from '@/lib/ultima-leitura'

/**
 * Banner opcional no topo da home. Fica invisivel ate a leitura montar (evita
 * um pisca no SSR), depois aparece so se houver ultima leitura registrada.
 */
export default function ContinuarLeitura() {
  const [ultima, setUltima] = useState<UltimaLeitura | null | undefined>(
    undefined,
  )

  useEffect(() => {
    setUltima(lerUltimaLeitura())
  }, [])

  if (!ultima) return null

  const nome = livroPorId(ultima.livro)?.nome ?? `Livro ${ultima.livro}`

  return (
    <Link
      href={`/biblia/${ultima.traducao}/${ultima.livro}/${ultima.capitulo}`}
      className="mb-8 flex items-center justify-between gap-4 rounded-lg border border-borda bg-accent-soft/40 px-4 py-3 text-sm hover:border-accent"
    >
      <span className="min-w-0">
        <span className="block text-xs uppercase tracking-wider text-muted">
          Continuar
        </span>
        <span className="mt-0.5 block truncate font-medium">
          {nome} {ultima.capitulo}{' '}
          <span className="text-muted">· {ultima.traducao}</span>
        </span>
      </span>
      <span className="shrink-0 text-accent">→</span>
    </Link>
  )
}

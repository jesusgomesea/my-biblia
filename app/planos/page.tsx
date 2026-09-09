'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { listarPlanos, removerPlano } from '@/lib/planos/armazenamento'
import type { Plano } from '@/lib/planos/tipos'

export default function Planos() {
  const [planos, setPlanos] = useState<Plano[] | null>(null)

  useEffect(() => {
    const atualizar = () => setPlanos(listarPlanos())
    atualizar()
    window.addEventListener('planos-alterados', atualizar)
    return () => window.removeEventListener('planos-alterados', atualizar)
  }, [])

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold">Meus planos</h1>
        <Link
          href="/planos/novo"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-background"
        >
          Novo plano
        </Link>
      </div>

      {planos === null ? (
        <p className="mt-8 text-muted">Carregando…</p>
      ) : planos.length === 0 ? (
        <p className="mt-8 text-muted">
          Você ainda não tem planos. Diga sobre o que quer refletir e monte o
          primeiro.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {planos.map((plano) => (
            <li
              key={plano.id}
              className="rounded-lg border border-borda bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <Link href={`/planos/${plano.id}`} className="min-w-0 flex-1">
                  <h2 className="font-serif text-lg font-medium">{plano.titulo}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {plano.temas.join(' · ')} — {plano.dias} dias de{' '}
                    {plano.minutosPorDia} min, em {plano.traducao}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    {plano.concluidos.length} de {plano.roteiro.length} dias
                    concluídos
                  </p>
                </Link>
                <button
                  type="button"
                  onClick={() => removerPlano(plano.id)}
                  className="shrink-0 text-xs text-muted hover:text-foreground"
                >
                  Apagar
                </button>
              </div>
              <div
                className="mt-3 h-1 overflow-hidden rounded-full bg-accent-soft"
                role="presentation"
              >
                <div
                  className="h-full bg-accent"
                  style={{
                    width: `${
                      (plano.concluidos.length / plano.roteiro.length) * 100
                    }%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

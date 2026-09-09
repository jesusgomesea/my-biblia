'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { listarPlanos } from '@/lib/planos/armazenamento'
import type { Plano } from '@/lib/planos/tipos'

type Props = {
  /** No desktop a barra é a coluna esquerda; no mobile ela ocupa a página. */
  variante?: 'lateral' | 'pagina'
}

export default function BarraPlanos({ variante = 'lateral' }: Props) {
  const [planos, setPlanos] = useState<Plano[] | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const atualizar = () => setPlanos(listarPlanos())
    atualizar()
    window.addEventListener('planos-alterados', atualizar)
    return () => window.removeEventListener('planos-alterados', atualizar)
  }, [])

  const idAtivo = pathname.startsWith('/planos/')
    ? pathname.slice('/planos/'.length).split('/')[0]
    : null

  return (
    <aside
      className={
        variante === 'lateral'
          ? 'flex h-full flex-col gap-4 border-r border-borda bg-surface/40 p-4'
          : 'flex flex-col gap-4'
      }
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-lg font-semibold">Meus planos</h2>
        <Link
          href="/planos/novo"
          className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-background"
        >
          Novo
        </Link>
      </div>

      {planos === null ? (
        <p className="text-sm text-muted">Carregando…</p>
      ) : planos.length === 0 ? (
        <p className="text-sm text-muted">
          Nenhum plano ainda. Toque em <strong>Novo</strong> para montar o
          primeiro.
        </p>
      ) : (
        <ul className="flex flex-col gap-2 overflow-y-auto">
          {planos.map((plano) => {
            const ativo = plano.id === idAtivo
            const feitos = plano.concluidos.length
            const total = plano.roteiro.length
            return (
              <li key={plano.id}>
                <Link
                  href={`/planos/${plano.id}`}
                  aria-current={ativo ? 'page' : undefined}
                  className={`block rounded-lg border p-3 transition-colors ${
                    ativo
                      ? 'border-accent bg-accent-soft'
                      : 'border-borda bg-surface hover:border-accent/60'
                  }`}
                >
                  <p className="line-clamp-2 font-serif text-sm font-medium">
                    {plano.titulo}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted">
                    {plano.temas.join(' · ')}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className="h-1 flex-1 overflow-hidden rounded-full bg-accent-soft"
                      role="presentation"
                    >
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${(feitos / total) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] tabular-nums text-muted">
                      {feitos}/{total}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </aside>
  )
}

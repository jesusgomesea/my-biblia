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
    <>
      {/* Mobile: lista completa, com botão de apagar. A sidebar do layout fica escondida. */}
      <div className="mx-auto max-w-2xl px-4 py-10 lg:hidden">
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
                    <h2 className="font-serif text-lg font-medium">
                      {plano.titulo}
                    </h2>
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

      {/* Desktop: painel de boas-vindas / resumo enquanto nenhum plano está aberto. */}
      <div className="hidden lg:block">
        <PainelBoasVindas planos={planos} />
      </div>
    </>
  )
}

function PainelBoasVindas({ planos }: { planos: Plano[] | null }) {
  const total = planos?.length ?? 0
  const diasFeitos =
    planos?.reduce((soma, p) => soma + p.concluidos.length, 0) ?? 0
  const diasTotal =
    planos?.reduce((soma, p) => soma + p.roteiro.length, 0) ?? 0
  const pendente = planos?.find(
    (p) => p.concluidos.length < p.roteiro.length,
  )

  return (
    <div className="mx-auto max-w-3xl px-8 py-12">
      <p className="text-xs uppercase tracking-wider text-muted">Meus planos</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold">
        Escolha um plano à esquerda ou monte um novo.
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Cada plano é um percurso de leitura montado a partir dos temas, do prazo
        e do tempo diário que você definiu. Escolha um na barra ao lado ou crie
        outro em segundos.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Cartao rotulo="Planos ativos" valor={total} />
        <Cartao rotulo="Dias concluídos" valor={diasFeitos} />
        <Cartao
          rotulo="Progresso total"
          valor={
            diasTotal === 0 ? '—' : `${Math.round((diasFeitos / diasTotal) * 100)}%`
          }
        />
      </div>

      {pendente && (
        <div className="mt-10 rounded-lg border border-borda bg-surface p-6">
          <p className="text-xs uppercase tracking-wider text-muted">
            Continuar
          </p>
          <h2 className="mt-1 font-serif text-xl font-medium">
            {pendente.titulo}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {pendente.concluidos.length} de {pendente.roteiro.length} dias
            concluídos
          </p>
          <Link
            href={`/planos/${pendente.id}`}
            className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-background"
          >
            Abrir plano
          </Link>
        </div>
      )}

      {total === 0 && (
        <Link
          href="/planos/novo"
          className="mt-10 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background"
        >
          Montar meu primeiro plano
        </Link>
      )}
    </div>
  )
}

function Cartao({ rotulo, valor }: { rotulo: string; valor: number | string }) {
  return (
    <div className="rounded-lg border border-borda bg-surface p-5">
      <p className="text-xs uppercase tracking-wider text-muted">{rotulo}</p>
      <p className="mt-2 font-serif text-3xl font-semibold">{valor}</p>
    </div>
  )
}

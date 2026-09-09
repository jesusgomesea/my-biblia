'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Passagem from '@/components/passagem'
import { alternarDiaConcluido, buscarPlano } from '@/lib/planos/armazenamento'
import { descreverLeitura } from '@/lib/planos/gerar'
import type { Plano } from '@/lib/planos/tipos'

export default function DetalheDoPlano() {
  const { id } = useParams<{ id: string }>()
  const [plano, setPlano] = useState<Plano | null | undefined>(undefined)
  /** null deixa o próximo dia pendente aberto; 'nenhum' é o usuário fechando. */
  const [escolhido, setEscolhido] = useState<number | 'nenhum' | null>(null)

  useEffect(() => {
    const atualizar = () => setPlano(buscarPlano(id) ?? null)
    atualizar()
    window.addEventListener('planos-alterados', atualizar)
    return () => window.removeEventListener('planos-alterados', atualizar)
  }, [id])

  if (plano === undefined) {
    return <p className="mx-auto max-w-6xl px-6 py-10 lg:px-10 text-muted">Carregando…</p>
  }

  if (plano === null) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <p className="text-muted">
          Plano não encontrado. Ele fica salvo neste navegador, então não aparece
          em outro dispositivo.
        </p>
        <Link href="/planos" className="mt-4 inline-block text-accent hover:underline">
          Ver meus planos
        </Link>
      </div>
    )
  }

  const concluidos = plano.concluidos.length
  const total = plano.roteiro.length
  const progresso = Math.round((concluidos / total) * 100)
  const pendente =
    plano.roteiro.find((d) => !plano.concluidos.includes(d.dia))?.dia ??
    plano.roteiro[0]?.dia
  const diaAberto =
    escolhido === null ? pendente : escolhido === 'nenhum' ? null : escolhido

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
      <header className="border-b border-borda pb-6">
        <h1 className="font-serif text-3xl font-semibold lg:text-4xl">
          {plano.titulo}
        </h1>
        <p className="mt-3 max-w-3xl text-muted">{plano.resumo}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          <span>{plano.temas.join(' · ')}</span>
          <span className="text-borda">•</span>
          <span>{plano.minutosPorDia} min por dia</span>
          <span className="text-borda">•</span>
          <span>Tradução {plano.traducao}</span>
          <span className="text-borda">•</span>
          <span>
            {concluidos} de {total} dias · {progresso}%
          </span>
        </div>
        <div
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-accent-soft"
          role="presentation"
        >
          <div
            className="h-full bg-accent transition-[width]"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </header>

      <ol className="mt-8 space-y-3">
        {plano.roteiro.map((dia) => {
          const feito = plano.concluidos.includes(dia.dia)
          const expandido = diaAberto === dia.dia
          return (
            <li key={dia.dia} className="rounded-lg border border-borda bg-surface">
              <button
                type="button"
                onClick={() => setEscolhido(expandido ? 'nenhum' : dia.dia)}
                aria-expanded={expandido}
                className="flex w-full items-start gap-4 p-4 text-left"
              >
                <span
                  className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                    feito
                      ? 'bg-accent text-background'
                      : 'bg-accent-soft text-accent'
                  }`}
                >
                  {feito ? '✓' : dia.dia}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs uppercase tracking-wide text-muted">
                    Dia {dia.dia}
                  </span>
                  <span className="mt-0.5 block font-medium">{dia.foco}</span>
                  {!expandido && dia.leituras.length > 0 && (
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {dia.leituras.map((leitura, i) => (
                        <span
                          key={i}
                          className="rounded bg-accent-soft/60 px-2 py-0.5 text-xs text-muted"
                        >
                          {descreverLeitura(leitura)}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
                <span
                  aria-hidden
                  className={`shrink-0 text-muted transition-transform ${
                    expandido ? 'rotate-180' : ''
                  }`}
                >
                  ▾
                </span>
              </button>

              {expandido && (
                <div className="grid gap-6 border-t border-borda px-4 pb-4 pt-4 xl:grid-cols-[1fr_320px] xl:gap-8 xl:px-6 xl:pb-6">
                  <div className="min-w-0">
                    {dia.leituras.map((leitura, indice) => (
                      <Passagem
                        key={`${leitura.livro}-${leitura.capitulo}-${indice}`}
                        leitura={leitura}
                        traducao={plano.traducao}
                      />
                    ))}
                  </div>

                  <aside className="xl:sticky xl:top-4 xl:self-start">
                    <div className="rounded-md bg-accent-soft p-4 text-sm">
                      <p className="text-xs font-medium uppercase tracking-wider text-accent">
                        Para refletir
                      </p>
                      <p className="mt-2">{dia.reflexao}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => alternarDiaConcluido(plano.id, dia.dia)}
                      className={`mt-4 w-full rounded-md px-4 py-2.5 text-sm font-medium ${
                        feito
                          ? 'border border-borda'
                          : 'bg-accent text-background'
                      }`}
                    >
                      {feito ? 'Desmarcar dia' : 'Marcar dia como concluído'}
                    </button>
                  </aside>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

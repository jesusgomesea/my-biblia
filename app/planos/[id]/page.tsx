'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Passagem from '@/components/passagem'
import { alternarDiaConcluido, buscarPlano } from '@/lib/planos/armazenamento'
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
    return <p className="mx-auto max-w-3xl px-4 py-10 lg:px-8 text-muted">Carregando…</p>
  }

  if (plano === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
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
  const pendente =
    plano.roteiro.find((d) => !plano.concluidos.includes(d.dia))?.dia ??
    plano.roteiro[0]?.dia
  const diaAberto =
    escolhido === null ? pendente : escolhido === 'nenhum' ? null : escolhido

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold">{plano.titulo}</h1>
      <p className="mt-2 text-muted">{plano.resumo}</p>
      <p className="mt-3 text-sm text-muted">
        {plano.temas.join(' · ')} — {plano.minutosPorDia} min por dia, em{' '}
        {plano.traducao} · {concluidos} de {plano.roteiro.length} concluídos
      </p>

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
                className="flex w-full items-start gap-3 p-4 text-left"
              >
                <span
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs ${
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
                </span>
              </button>

              {expandido && (
                <div className="border-t border-borda px-4 pb-4">
                  {dia.leituras.map((leitura, indice) => (
                    <Passagem
                      key={`${leitura.livro}-${leitura.capitulo}-${indice}`}
                      leitura={leitura}
                      traducao={plano.traducao}
                    />
                  ))}

                  <p className="mt-5 rounded-md bg-accent-soft p-3 text-sm">
                    <span className="font-medium">Para refletir: </span>
                    {dia.reflexao}
                  </p>

                  <button
                    type="button"
                    onClick={() => alternarDiaConcluido(plano.id, dia.dia)}
                    className={`mt-4 rounded-md px-4 py-2 text-sm font-medium ${
                      feito
                        ? 'border border-borda'
                        : 'bg-accent text-background'
                    }`}
                  >
                    {feito ? 'Desmarcar dia' : 'Marcar dia como concluído'}
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

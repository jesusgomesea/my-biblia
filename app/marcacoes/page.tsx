'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { livroPorId } from '@/lib/bible'
import {
  alternarMarcacao,
  COR_PADRAO,
  listarMarcacoes,
  observarMarcacoes,
  type Marcacao,
} from '@/lib/marcacoes'
import { corDeMarcacao } from '@/lib/cores-marcacao'

export default function Marcacoes() {
  const [marcacoes, setMarcacoes] = useState<Marcacao[] | null>(null)

  useEffect(() => {
    const atualizar = () => setMarcacoes(listarMarcacoes())
    atualizar()
    return observarMarcacoes(atualizar)
  }, [])

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold">Versículos marcados</h1>

      {marcacoes === null ? (
        <p className="mt-8 text-muted">Carregando…</p>
      ) : marcacoes.length === 0 ? (
        <p className="mt-8 text-muted">
          Você ainda não marcou nenhum versículo. Ao ler um capítulo, toque no
          número do versículo para guardá-lo aqui.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {marcacoes.map((marcacao) => (
            <li
              key={`${marcacao.livro}:${marcacao.capitulo}:${marcacao.versiculo}`}
              className="rounded-lg border border-borda p-4"
              style={{
                backgroundColor: corDeMarcacao(marcacao.cor ?? COR_PADRAO),
              }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <Link
                  href={`/biblia/${marcacao.traducao}/${marcacao.livro}/${marcacao.capitulo}`}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  {livroPorId(marcacao.livro)?.nome} {marcacao.capitulo}:
                  {marcacao.versiculo}
                </Link>
                <button
                  type="button"
                  onClick={() => alternarMarcacao(marcacao)}
                  className="shrink-0 text-xs text-muted hover:text-foreground"
                >
                  Remover
                </button>
              </div>
              {/* Sanitizado em lib/bible/sanitize.ts. */}
              <p
                className="mt-2 font-serif text-base/7"
                dangerouslySetInnerHTML={{ __html: marcacao.html }}
              />
              {marcacao.anotacao && (
                <p className="mt-3 rounded-md bg-accent-soft/40 p-3 text-sm italic">
                  “{marcacao.anotacao}”
                </p>
              )}
              <p className="mt-2 text-xs text-muted">{marcacao.traducao}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

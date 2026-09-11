'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Language } from '@/lib/bible'

/**
 * Controle das colunas: chips com X para remover cada traducao ativa, mais
 * um <select> para acrescentar. Cada mudanca reescreve a URL com o novo `?t`.
 * Fica no cliente para o feedback ser instantaneo — o Server Component em
 * cima re-renderiza no push.
 */
export default function SeletorComparacao({
  linguas,
  livro,
  capitulo,
  traducoes,
  max,
}: {
  linguas: Language[]
  livro: number
  capitulo: number
  traducoes: string[]
  max: number
}) {
  const router = useRouter()
  const [aberto, setAberto] = useState(false)

  const disponiveis = linguas
    .flatMap((l) => l.translations)
    .filter((t) => !traducoes.includes(t.id))

  function irPara(lista: string[]) {
    const params = new URLSearchParams({ t: lista.join(',') })
    router.push(`/comparar/${livro}/${capitulo}?${params}`)
  }

  function remover(id: string) {
    const nova = traducoes.filter((t) => t !== id)
    if (nova.length === 0) return // impede grid vazio; o servidor tambem cai no default
    irPara(nova)
  }

  function adicionar(id: string) {
    if (!id) return
    irPara([...traducoes, id])
    setAberto(false)
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {traducoes.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 rounded-full border border-borda bg-surface px-3 py-1 text-xs"
        >
          {t}
          <button
            type="button"
            onClick={() => remover(t)}
            aria-label={`Remover ${t}`}
            className="text-muted hover:text-accent"
            disabled={traducoes.length === 1}
          >
            ×
          </button>
        </span>
      ))}

      {traducoes.length < max && (
        <div className="relative">
          {aberto ? (
            <select
              autoFocus
              onChange={(e) => adicionar(e.target.value)}
              onBlur={() => setAberto(false)}
              className="rounded-full border border-borda bg-surface px-3 py-1 text-xs"
              defaultValue=""
            >
              <option value="" disabled>
                Escolher…
              </option>
              {linguas.map((lingua) => (
                <optgroup key={lingua.name} label={lingua.name}>
                  {lingua.translations
                    .filter((t) => !traducoes.includes(t.id))
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id} — {t.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          ) : (
            <button
              type="button"
              onClick={() => setAberto(true)}
              className="rounded-full border border-borda bg-surface px-3 py-1 text-xs text-muted hover:text-accent"
              disabled={disponiveis.length === 0}
            >
              + Adicionar tradução
            </button>
          )}
        </div>
      )}
    </div>
  )
}

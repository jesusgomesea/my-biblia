'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Language } from '@/lib/bible'
import { salvarPlano } from '@/lib/planos/armazenamento'
import { LIMITES } from '@/lib/planos/tipos'

const SUGESTOES = ['sabedoria', 'responsabilidade', 'perdão', 'ansiedade', 'gratidão']

export default function FormularioPlano({
  linguas,
  traducaoPadrao,
}: {
  linguas: Language[]
  traducaoPadrao: string
}) {
  const router = useRouter()
  const [temas, setTemas] = useState<string[]>([])
  const [rascunho, setRascunho] = useState('')
  const [dias, setDias] = useState(7)
  const [minutosPorDia, setMinutos] = useState(15)
  const [traducao, setTraducao] = useState(traducaoPadrao)
  const [gerando, setGerando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  function adicionarTema(valor: string) {
    const tema = valor.trim()
    if (!tema || temas.includes(tema) || temas.length >= LIMITES.temas.max) return
    setTemas([...temas, tema])
    setRascunho('')
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault()
    const escolhidos = rascunho.trim() ? [...temas, rascunho.trim()] : temas
    if (escolhidos.length === 0) {
      setErro('Informe ao menos um tema.')
      return
    }

    setGerando(true)
    setErro(null)
    try {
      const resposta = await fetch('/api/planos/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temas: escolhidos, dias, minutosPorDia, traducao }),
      })
      const dados = await resposta.json()
      if (!resposta.ok) throw new Error(dados.erro ?? 'Falha ao gerar o plano.')

      const plano = salvarPlano(
        { temas: escolhidos, dias, minutosPorDia, traducao },
        dados,
      )
      router.push(`/planos/${plano.id}`)
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Falha ao gerar o plano.')
      setGerando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-8">
      <fieldset disabled={gerando} className="space-y-8">
        <div>
          <label htmlFor="tema" className="block text-sm font-medium">
            Sobre o que você quer aprender ou refletir?
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {temas.map((tema) => (
              <button
                key={tema}
                type="button"
                onClick={() => setTemas(temas.filter((t) => t !== tema))}
                className="rounded-full bg-accent-soft px-3 py-1 text-sm text-accent"
              >
                {tema} <span aria-hidden>×</span>
                <span className="sr-only">Remover tema</span>
              </button>
            ))}
          </div>
          <input
            id="tema"
            value={rascunho}
            onChange={(e) => setRascunho(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                adicionarTema(rascunho)
              }
            }}
            placeholder="Digite um tema e aperte Enter"
            className="mt-3 w-full rounded-md border border-borda bg-surface px-3 py-2"
          />
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
            {SUGESTOES.filter((s) => !temas.includes(s)).map((sugestao) => (
              <button
                key={sugestao}
                type="button"
                onClick={() => adicionarTema(sugestao)}
                className="rounded-full border border-borda px-2.5 py-1 hover:text-foreground"
              >
                + {sugestao}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="dias" className="block text-sm font-medium">
              Por quantos dias?
            </label>
            <input
              id="dias"
              type="number"
              value={dias}
              min={LIMITES.dias.min}
              max={LIMITES.dias.max}
              onChange={(e) => setDias(Number(e.target.value))}
              className="mt-2 w-full rounded-md border border-borda bg-surface px-3 py-2"
            />
            <div className="mt-2 flex gap-2 text-xs text-muted">
              {[7, 14, 30].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDias(n)}
                  className="rounded-full border border-borda px-2.5 py-1 hover:text-foreground"
                >
                  {n} dias
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="minutos" className="block text-sm font-medium">
              Quantos minutos por dia?
            </label>
            <input
              id="minutos"
              type="number"
              value={minutosPorDia}
              min={LIMITES.minutosPorDia.min}
              max={LIMITES.minutosPorDia.max}
              onChange={(e) => setMinutos(Number(e.target.value))}
              className="mt-2 w-full rounded-md border border-borda bg-surface px-3 py-2"
            />
            <div className="mt-2 flex gap-2 text-xs text-muted">
              {[10, 15, 30].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMinutos(n)}
                  className="rounded-full border border-borda px-2.5 py-1 hover:text-foreground"
                >
                  {n} min
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="traducao" className="block text-sm font-medium">
            Em qual tradução você vai ler?
          </label>
          <select
            id="traducao"
            value={traducao}
            onChange={(e) => setTraducao(e.target.value)}
            className="mt-2 w-full rounded-md border border-borda bg-surface px-3 py-2"
          >
            {linguas.map((lingua) => (
              <optgroup key={lingua.name} label={lingua.name}>
                {lingua.translations.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} — {t.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </fieldset>

      {erro && <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>}

      <button
        type="submit"
        disabled={gerando}
        className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background disabled:opacity-60"
      >
        {gerando ? 'Montando seu plano…' : 'Montar plano'}
      </button>
      {gerando && (
        <p className="text-sm text-muted">
          Isso costuma levar alguns segundos, e às vezes até meio minuto quando o
          modelo está concorrido.
        </p>
      )}
    </form>
  )
}

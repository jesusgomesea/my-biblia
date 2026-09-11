'use client'

import { useRouter } from 'next/navigation'

const RESUMO: Record<string, { fundo: string; texto: string; rotulo: string }> =
  {
    bege: { fundo: '#f0e7d8', texto: '#3d2f1a', rotulo: 'Bege' },
    noite: { fundo: '#14130f', texto: '#ece7dd', rotulo: 'Noite' },
    claro: { fundo: '#fbfaf7', texto: '#1c1a17', rotulo: 'Claro' },
    sepia: { fundo: '#efe5cc', texto: '#4a3a2a', rotulo: 'Sépia' },
  }

/**
 * Chips de amostra por paleta. Cada clique atualiza a URL com `?fundo=X` e o
 * Server Component em cima re-renderiza a <img>, disparando nova chamada ao
 * /api/imagem com o novo fundo.
 */
export default function SeletorPaleta({
  atual,
  paletas,
  base,
  traducao,
}: {
  atual: string
  paletas: readonly string[]
  base: string
  traducao: string
}) {
  const router = useRouter()

  function escolher(fundo: string) {
    const params = new URLSearchParams({ t: traducao, fundo })
    router.push(`${base}?${params}`)
  }

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {paletas.map((p) => {
        const info = RESUMO[p]
        if (!info) return null
        const ativa = atual === p
        return (
          <button
            key={p}
            type="button"
            onClick={() => escolher(p)}
            aria-pressed={ativa}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
              ativa ? 'border-accent' : 'border-borda hover:border-accent'
            }`}
          >
            <span
              aria-hidden
              className="flex size-5 items-center justify-center rounded-full text-[10px] font-serif"
              style={{ backgroundColor: info.fundo, color: info.texto }}
            >
              Aa
            </span>
            {info.rotulo}
          </button>
        )
      })}
    </div>
  )
}

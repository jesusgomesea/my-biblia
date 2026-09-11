'use client'

import { useEffect, useState } from 'react'

const CHAVE = 'my-biblia:tamanho-fonte'
const TAMANHOS = ['pequeno', 'medio', 'grande'] as const
type Tamanho = (typeof TAMANHOS)[number]

function ler(): Tamanho {
  if (typeof window === 'undefined') return 'medio'
  try {
    const cru = window.localStorage.getItem(CHAVE)
    return (TAMANHOS as readonly string[]).includes(cru ?? '')
      ? (cru as Tamanho)
      : 'medio'
  } catch {
    return 'medio'
  }
}

function aplicar(tamanho: Tamanho): void {
  document.documentElement.dataset.fonte = tamanho
}

/**
 * Controle de tamanho da leitura biblica. Persiste em localStorage e escreve
 * `data-fonte` no <html> para o CSS aplicar. Fica per-device, sem sincronia
 * com a nuvem — cada dispositivo tem sua tela e sua preferencia.
 */
export default function PreferenciasLeitura() {
  const [tamanho, setTamanho] = useState<Tamanho>('medio')

  useEffect(() => {
    const salvo = ler()
    setTamanho(salvo)
    aplicar(salvo)
  }, [])

  function mudar(novo: Tamanho) {
    setTamanho(novo)
    aplicar(novo)
    try {
      window.localStorage.setItem(CHAVE, novo)
    } catch {
      // localStorage bloqueado: perde ao recarregar, mas nao quebra a sessao.
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Tamanho do texto"
      className="flex items-center gap-1 rounded-md border border-borda p-1 text-sm"
    >
      {TAMANHOS.map((t) => (
        <button
          key={t}
          type="button"
          role="radio"
          aria-checked={tamanho === t}
          aria-label={t}
          onClick={() => mudar(t)}
          className={`rounded px-2 py-1 font-serif ${
            tamanho === t
              ? 'bg-accent text-background'
              : 'text-muted hover:text-foreground'
          }`}
          style={{
            fontSize:
              t === 'pequeno' ? '0.75rem' : t === 'grande' ? '1.125rem' : '0.9rem',
          }}
        >
          A
        </button>
      ))}
    </div>
  )
}
